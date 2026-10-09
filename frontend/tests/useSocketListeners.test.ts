import { beforeEach, expect, test, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { Socket } from "socket.io-client";

import { useSocketListeners } from "../src/hooks/useSocketListeners";
import { PLAYER_NAME_KEY } from "../src/utils/storageKeys";
import type { Card, HistoryItem, Player, SocketActions } from "../src/types/game";

type Handler = (...args: unknown[]) => void;

// Faux socket : on déclenche à la main les events envoyés par le serveur
function setup() {
  const handlers: Record<string, Handler> = {};
  const socket = {
    id: "me",
    on: (event: string, handler: Handler) => (handlers[event] = handler),
    off: vi.fn(),
    emit: vi.fn(),
  } as unknown as Socket;

  const actions = Object.fromEntries(
    [
      "setView", "setError", "setRoomCode", "setRules", "setPlayers", "setThreshold",
      "setHistory", "setWinner", "setPlayerTurn", "setPlayerOrder", "setDisplayOrder",
      "setPropositions", "setNoMorePlayers", "setIsConnected",
    ].map((name) => [name, vi.fn()])
  );
  const typed = { ...actions, sfxVolumeRef: { current: 0 } } as unknown as SocketActions;
  renderHook(() => useSocketListeners(socket, typed));

  /** Applique la dernière mise à jour fonctionnelle de setPlayers / setHistory sur `previous` */
  const applied = <T,>(setter: string, previous: T): T =>
    (actions[setter].mock.calls.at(-1)![0] as (prev: T) => T)(previous);

  return { handlers, actions, applied };
}

const card = (id: string): Card => ({ id, symbol: "cercle", color: "rouge" });
const player = (id: string, extra: Partial<Player> = {}): Player => ({
  id, name: id, isHost: false, isReady: false, score: 0, leavedPlayer: false,
  deck: { cards: null }, ...extra,
});

beforeEach(() => localStorage.clear());

test("room_updated : ordre et tour mis à jour, ma main locale est gardée si le serveur n'en envoie pas", () => {
  const { handlers, actions, applied } = setup();
  const hand = [card("1"), card("2"), card("3")];

  handlers.room_updated({
    players: [player("me", { name: "Moi" }), player("other")],
    playerOrder: ["other", "me"],
  });

  expect(actions.setPlayerTurn).toHaveBeenCalledWith("other");
  expect(actions.setDisplayOrder).toHaveBeenCalledWith(["me", "other"]);
  expect(localStorage.getItem(PLAYER_NAME_KEY)).toBe("Moi");

  const merged = applied<Player[]>("setPlayers", [player("me", { deck: { cards: hand } })]);
  expect(merged.find((p) => p.id === "me")!.deck.cards).toEqual(hand);
});

test("room_updated : l'écran d'attente se ferme dès que deux joueurs sont actifs", () => {
  const { handlers, actions } = setup();

  handlers.room_updated({ players: [player("me"), player("other", { leavedPlayer: true })] });
  expect(actions.setNoMorePlayers).not.toHaveBeenCalled();

  handlers.room_updated({ players: [player("me"), player("other")] });
  expect(actions.setNoMorePlayers).toHaveBeenCalledWith(false);
});

test("no_more_players affiche l'écran d'attente", () => {
  const { handlers, actions } = setup();
  handlers.no_more_players();
  expect(actions.setNoMorePlayers).toHaveBeenCalledWith(true);
});

test("reconnected : retour en partie avec le gagnant quand elle est terminée", () => {
  const { handlers, actions } = setup();
  handlers.reconnected({
    roomCode: "ABC234", rules: {}, players: [player("me")], threshold: 15,
    playerOrder: ["me", "other"], playerTurn: "me", history: [], winner: "other",
  });

  expect(actions.setWinner).toHaveBeenCalledWith("other");
  expect(actions.setView).toHaveBeenCalledWith("game");
});

test("reconnected : retour au lobby sans ordre de jeu, sans gagnant", () => {
  const { handlers, actions } = setup();
  handlers.reconnected({
    roomCode: "ABC234", rules: {}, players: [player("me")], threshold: 15,
    playerOrder: undefined, playerTurn: null, history: [], winner: null,
  });

  expect(actions.setWinner).toHaveBeenCalledWith(null);
  expect(actions.setView).toHaveBeenCalledWith("lobby");
});

test("card_played : mon score et ma main sont mis à jour, la carte piochée par un autre ne touche pas ma main", () => {
  const { handlers, applied } = setup();
  const played = card("1");

  handlers.card_played(played, "me", "Moi", ["other", "me"], 3, 3, card("4"));

  const players = applied<Player[]>("setPlayers", [
    player("me", { deck: { cards: [card("1"), card("2"), card("3")] } }),
    player("other", { deck: { cards: [card("x")] } }),
  ]);
  const me = players.find((p) => p.id === "me")!;
  expect(me.score).toBe(3);
  expect(me.deck.cards!.map((c) => c.id)).toEqual(["2", "3", "4"]);

  const history = applied<HistoryItem[]>("setHistory", []);
  expect(history).toHaveLength(1);
  expect(history[0]).toMatchObject({ player: "me", points: 3, score: 3 });

  handlers.card_played(card("7"), "other", "Autre", ["me", "other"], 1, 1, card("9"));
  const after = applied<Player[]>("setPlayers", players);
  expect(after.find((p) => p.id === "other")!.score).toBe(1);
  expect(after.find((p) => p.id === "me")!.deck.cards).toHaveLength(3);
});

test("game_won : le gagnant et les règles révélées sont enregistrés", () => {
  const { handlers, actions, applied } = setup();
  const rules = { symbolRules: { cercle: 3 }, colorRules: { rouge: "Gel" } };

  handlers.game_won("other", 16, rules);

  expect(actions.setRules).toHaveBeenCalledWith(rules);
  expect(actions.setWinner).toHaveBeenCalledWith("other");
  expect(applied<Player[]>("setPlayers", [player("other", { score: 14 })])[0].score).toBe(16);
});

test("card_played : la main cachée d'un adversaire perd la carte jouée et gagne la carte piochée", () => {
  const { handlers, applied } = setup();
  const hidden = (id: string): Card => ({ id, symbol: "", color: "" });

  handlers.card_played(card("a"), "other", "Autre", ["me", "other"], 2, 2, hidden("d"));

  const players = applied<Player[]>("setPlayers", [
    player("me"),
    player("other", { deck: { cards: [hidden("a"), hidden("b"), hidden("c")] } }),
  ]);
  expect(players.find((p) => p.id === "other")!.deck.cards!.map((c) => c.id)).toEqual(["b", "c", "d"]);
});

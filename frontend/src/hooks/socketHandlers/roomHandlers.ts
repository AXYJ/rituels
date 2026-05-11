import { Socket } from "socket.io-client";
import { Player, GameRules, View } from "../../types/game";

const ROOM_CODE_KEY = "rituels_room_code";
const PLAYER_NAME_KEY = "rituels_player_name";

export const registerRoomHandlers = (
  socket: Socket,
  setRoomCode: (code: string) => void,
  setRules: (rules: GameRules | null) => void,
  setThreshold: (threshold: number) => void,
  setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void,
  setPlayerNumber: (num: number) => void,
  setView: (view: View) => void,
  setError: (error: string | null) => void
) => {
  // Création d'un lobby
  socket.on(
    "room_created",
    (
      code: string,
      rules: GameRules,
      serverPlayers: Player[],
      playerNumber: number,
      threshold: number
    ) => {
      setRoomCode(code);
      setRules(rules);
      localStorage.setItem(ROOM_CODE_KEY, code);

      if (typeof window !== "undefined" && serverPlayers) {
        const me = serverPlayers.find((p: Player) => p.id === socket.id);
        if (me?.name) {
          localStorage.setItem(PLAYER_NAME_KEY, me.name);
        }
      }

      if (threshold !== undefined) setThreshold(threshold);
      setPlayers(
        (serverPlayers || []).map((p: Player) => ({
          ...p,
          deck: p.deck ?? { cards: null },
          score: p.score ?? 0,
        }))
      );
      setPlayerNumber(playerNumber);
      setView("lobby");
    }
  );

  // Rejoindre une partie
  socket.on(
    "join_game_success",
    (
      code: string,
      rules: GameRules,
      players: Player[],
      playerNumber: number,
      threshold: number
    ) => {
      localStorage.setItem(ROOM_CODE_KEY, code);
      setRoomCode(code);
      setRules(rules);

      if (typeof window !== "undefined" && players) {
        const me = players.find((p: Player) => p.id === socket.id);
        if (me?.name) {
          localStorage.setItem(PLAYER_NAME_KEY, me.name);
        }
      }

      if (threshold !== undefined) setThreshold(threshold);
      setPlayers(players || []);
      setPlayerNumber(playerNumber);
      setView("lobby");
    }
  );

  // Erreurs salon
  socket.on("room_full", () => setError("La partie est pleine !"));
  socket.on("room_not_found", () => setError("Partie introuvable !"));
  socket.on("game_already_started", () =>
    setError("La partie a déjà commencé !")
  );
  socket.on("name_rejected", () => setError("Pseudo refusé !"));

  socket.on("threshold_updated", (newThreshold: number) =>
    setThreshold(newThreshold)
  );
  socket.on("room_deleted", () => {
    setRoomCode("");
    setRules(null);
    setThreshold(0);
    setPlayers([]);
    setPlayerNumber(0);
    setView("home");
    localStorage.removeItem(ROOM_CODE_KEY);
    setError("Tous les joueurs sont partis.");
  });
};

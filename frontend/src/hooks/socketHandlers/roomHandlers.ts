import { Socket } from "socket.io-client";
import { Player, GameRules, SocketActions } from "../../types/game";
import { PLAYER_NAME_KEY, ROOM_CODE_KEY } from "../../utils/storageKeys";
import { listen } from "../../utils/socketHelpers";

export const registerRoomHandlers = (
  socket: Socket,
  { setRoomCode, setRules, setThreshold, setPlayers, setView, setError }: SocketActions
) => {
  const rememberName = (players: Player[]) => {
    const me = players.find((p) => p.id === socket.id);
    if (me?.name) localStorage.setItem(PLAYER_NAME_KEY, me.name);
  };

  return listen(socket, {
    // Création d'un lobby
    room_created: (
      code: string,
      rules: GameRules,
      serverPlayers: Player[],
      threshold: number
    ) => {
      setRoomCode(code);
      setRules(rules);
      sessionStorage.setItem(ROOM_CODE_KEY, code);
      if (serverPlayers) rememberName(serverPlayers);
      if (threshold !== undefined) setThreshold(threshold);
      setPlayers(
        (serverPlayers || []).map((p: Player) => ({
          ...p,
          deck: p.deck ?? { cards: null },
          score: p.score ?? 0,
        }))
      );
      setView("lobby");
    },

    // Rejoindre une partie
    join_game_success: (
      code: string,
      rules: GameRules,
      players: Player[],
      threshold: number
    ) => {
      sessionStorage.setItem(ROOM_CODE_KEY, code);
      setRoomCode(code);
      setRules(rules);
      if (players) rememberName(players);
      if (threshold !== undefined) setThreshold(threshold);
      setPlayers(players || []);
      setView("lobby");
    },

    // Erreurs salon
    room_full: () => setError("La partie est pleine !"),
    room_not_found: () => setError("Partie introuvable !"),
    game_already_started: () => setError("La partie a déjà commencé !"),
    name_rejected: () => setError("Pseudo refusé !"),

    threshold_updated: (newThreshold: number) => setThreshold(newThreshold),
  });
};

import { randomInt } from "node:crypto";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Génère un code de salle de 6 caractères qui n'existe pas encore
 */
export function generateRoomCode(rooms) {
  let code;
  do {
    code = Array.from({ length: 6 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");
  } while (rooms[code]);
  return code;
}

const MIN_THRESHOLD = 5;
const MAX_THRESHOLD = 30;

/** Ramène le quota de victoire dans les bornes autorisées */
export const clampThreshold = (value) =>
  Math.min(Math.max(value, MIN_THRESHOLD), MAX_THRESHOLD);

/**
 * Retrouve la salle et le joueur du socket (l'identité vient du socket, jamais du client)
 */
export function getRoomAndPlayer(socket, rooms) {
  const code = socket.data.roomCode;
  const room = rooms[code];
  const player = room?.players.find((p) => p.id === socket.id);
  return player ? { code, room, player } : null;
}

/**
 * Un joueur (socket ou même sessionId, ex. deuxième onglet) est-il déjà dans une salle ?
 * Une seule partie à la fois par joueur.
 */
export function isInARoom(socket, rooms, sessionId) {
  return (
    Boolean(getRoomAndPlayer(socket, rooms)) ||
    Object.values(rooms).some((room) =>
      room.players.some((p) => p.sessionId === (sessionId || socket.id) && !p.leavedPlayer)
    )
  );
}

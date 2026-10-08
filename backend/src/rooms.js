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

/**
 * Retrouve la salle et le joueur du socket (l'identité vient du socket, jamais du client)
 */
export function getRoomAndPlayer(socket, rooms) {
  const code = socket.data.roomCode;
  const room = rooms[code];
  const player = room?.players.find((p) => p.id === socket.id);
  return player ? { code, room, player } : null;
}

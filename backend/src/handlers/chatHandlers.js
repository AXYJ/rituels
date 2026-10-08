import { moderateMessage, MAX_MESSAGE_LENGTH } from "../moderation.js";
import { getRoomAndPlayer } from "../rooms.js";

const MIN_DELAY_MS = 1000;

export const registerChatHandlers = (io, socket, rooms) => {
  let lastMessageAt = 0;

  // Message chat
  socket.on("send_message", async (message) => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found || typeof message !== "string") return;

    // Un appel LLM par message : on limite la fréquence et la longueur
    const now = Date.now();
    if (now - lastMessageAt < MIN_DELAY_MS) return;
    lastMessageAt = now;

    const text = message.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!text) return;

    const moderated = await moderateMessage(text);
    found.room.history.push({
      type: "message",
      player: socket.id,
      playerName: found.player.name,
      message: moderated,
    });
    io.to(found.code).emit("message_received", socket.id, found.player.name, moderated);
  });
};

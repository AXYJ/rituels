import { moderateMessage, MAX_MESSAGE_LENGTH } from "../moderation.js";
import { slidingWindow } from "../rateLimit.js";
import { getRoomAndPlayer } from "../rooms.js";

// Messages gardés dans l'historique d'une salle (les cartes jouées sont toutes conservées)
const MAX_CHAT_HISTORY = Number(process.env.MAX_CHAT_HISTORY) || 200;

export const registerChatHandlers = (io, socket, rooms) => {
  // Budget de modération : 5 messages en rafale puis environ 1 par seconde.
  // Au-delà, le message passe sans modération (jamais refusé) ; seul un flood absurde est ignoré.
  const moderationBudget = slidingWindow(5, 5000);
  const floodGuard = slidingWindow(10, 1000);

  // Message chat
  socket.on("send_message", async (message) => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found || typeof message !== "string") return;
    if (!floodGuard()) return;

    const text = message.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!text) return;

    const moderated = moderationBudget() ? await moderateMessage(text) : text;
    const { history } = found.room;
    history.push({
      type: "message",
      player: socket.id,
      playerName: found.player.name,
      message: moderated,
    });
    const messages = history.filter((item) => item.type === "message");
    if (messages.length > MAX_CHAT_HISTORY) history.splice(history.indexOf(messages[0]), 1);
    io.to(found.code).emit("message_received", socket.id, found.player.name, moderated);
  });
};

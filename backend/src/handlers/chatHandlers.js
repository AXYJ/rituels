import { moderateMessage } from "../gameLogic.js";

export const registerChatHandlers = (io, socket, rooms) => {
  // Message chat
  socket.on("send_message", async (message) => {
    for (const code in rooms) {
      const player = rooms[code].players.find((p) => p.id === socket.id);
      if (player) {
        const status = await moderateMessage(message);
        if (status === "OK") {
          const historyItem = {
            type: "message",
            player: socket.id,
            playerName: player.name,
            message,
          };
          rooms[code].history.push(historyItem);
          io.to(code).emit("message_received", socket.id, player.name, message);
        } else {
          const historyItem = {
            type: "message",
            player: socket.id,
            playerName: player.name,
            message: status,
          };
          rooms[code].history.push(historyItem);
          io.to(code).emit("message_received", socket.id, player.name, status);
        }
        break;
      }
    }
  });
};

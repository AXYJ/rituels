import { generateRules, moderatePseudo } from "../gameLogic.js";

export const registerRoomHandlers = (io, socket, rooms) => {
  // Création d'une partie
  socket.on("create_game", (idPlayer, sessionId) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    rooms[roomCode] = {
      players: [
        {
          id: idPlayer,
          name: "Host",
          sessionId: sessionId || idPlayer,
          isHost: true,
          isReady: false,
          score: 0,
          deck: { cards: null },
          leavedPlayer: false,
        },
      ],
      threshold: 15,
      history: [],
    };
    socket.join(roomCode);
    const rules = generateRules();
    rooms[roomCode].rules = rules;

    const room = rooms[roomCode];
    socket.emit(
      "room_created",
      roomCode,
      rules,
      room.players,
      room.players.length,
      room.threshold
    );
  });

  // Rejoindre une partie
  socket.on("join_game", (roomCode, sessionId) => {
    if (!rooms[roomCode]) {
      socket.emit("room_not_found");
      return;
    }

    const room = rooms[roomCode];
    const existingPlayer = room.players.find((p) => p.sessionId === sessionId);

    if (existingPlayer) {
      const oldId = existingPlayer.id;
      existingPlayer.id = socket.id;
      existingPlayer.leavedPlayer = false;
      socket.join(roomCode);

      if (room.playerOrder) {
        room.playerOrder = room.playerOrder.map((id) =>
          id === oldId ? socket.id : id
        );
      }

      socket.emit("reconnected", {
        roomCode,
        rules: room.rules,
        players: room.players,
        playerNumber: room.players.length,
        threshold: room.threshold,
        playerOrder: room.playerOrder,
        playerTurn: room.playerOrder ? room.playerOrder[0] : null,
        history: room.history || [],
      });

      io.to(roomCode).emit("room_updated", {
        players: room.players,
        playerOrder: room.playerOrder,
      });
    } else if (room.playerOrder && room.playerOrder.length > 0) {
      socket.emit("game_already_started");
    } else if (room.players.length < 4) {
      const player = {
        id: socket.id,
        name: "Sujet #" + (room.players.length + 1),
        sessionId,
        isHost: false,
        isReady: false,
        score: 0,
        deck: { cards: null },
        leavedPlayer: false,
      };
      room.players.push(player);
      socket.join(roomCode);

      io.to(roomCode).emit("room_updated", { players: room.players });
      socket.emit(
        "join_game_success",
        roomCode,
        room.rules,
        room.players,
        room.players.length,
        room.threshold
      );
    } else {
      socket.emit("room_full");
    }
  });

  // Changement du nom
  socket.on("change_name", async (name) => {
    for (const code in rooms) {
      const room = rooms[code];
      const player = room.players.find((p) => p.id === socket.id);
      if (player) {
        const status = await moderatePseudo(name);
        if (status === "NON") {
          socket.emit("name_rejected");
        } else {
          player.name = name;
          io.to(code).emit("room_updated", { players: room.players });
        }
        break;
      }
    }
  });

  // Prêt
  socket.on("ready", (isReady, idPlayer) => {
    for (const code in rooms) {
      const room = rooms[code];
      const player = room.players.find((p) => p.id === idPlayer);
      if (player) {
        player.isReady = isReady;
        io.to(code).emit("room_updated", { players: room.players });
        break;
      }
    }
  });

  // Mise à jour du seuil de victoire
  socket.on("update_threshold", (newThreshold) => {
    for (const code in rooms) {
      const room = rooms[code];
      const host = room.players.find((p) => p.id === socket.id && p.isHost);
      if (host) {
        room.threshold = Math.min(Math.max(newThreshold, 5), 30);
        io.to(code).emit("threshold_updated", room.threshold);
        break;
      }
    }
  });

  // Quitter le lobby
  socket.on("quit_lobby", (idPlayer) => {
    // La logique de leave est gérée par handlePlayerLeave dans server.js
    // car elle est aussi utilisée lors de la déconnexion
  });
};

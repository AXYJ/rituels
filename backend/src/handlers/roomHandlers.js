import { generateRules, getNextPlayerOrder } from "../gameLogic.js";
import { moderatePseudo, MAX_NAME_LENGTH } from "../moderation.js";
import { generateRoomCode, getRoomAndPlayer } from "../rooms.js";
import { checkAndResetGame } from "./gameHandlers.js";

const MIN_THRESHOLD = 5;
const MAX_THRESHOLD = 30;

// Départ d'un joueur (partagé par quit_lobby et disconnect)
export const handlePlayerLeave = (io, socket, rooms) => {
  const found = getRoomAndPlayer(socket, rooms);
  if (!found) return;
  const { code, room, player } = found;
  if (player.leavedPlayer) return;

  socket.leave(code);
  socket.data.roomCode = undefined;

  const isGameStarted = room.playerOrder && room.playerOrder.length > 0;

  if (!isGameStarted) {
    // Si la partie n'a pas commencé, on retire complètement le joueur
    room.players.splice(room.players.indexOf(player), 1);
  } else {
    // Si elle a commencé, on le marque simplement comme déconnecté
    player.leavedPlayer = true;
  }

  const activePlayers = room.players.filter((p) => !p.leavedPlayer);

  if (activePlayers.length === 0) {
    delete rooms[code];
    return;
  }

  if (isGameStarted && activePlayers.length <= 1) {
    io.to(code).emit("no_more_players");
    return;
  }

  if (player.isHost) {
    player.isHost = false;
    activePlayers[0].isHost = true;
  }

  io.to(code).emit("room_updated", {
    players: room.players,
    playerOrder: room.playerOrder,
  });

  if (isGameStarted && room.playerOrder[0] === socket.id) {
    room.playerOrder = getNextPlayerOrder(room.playerOrder, room.players);
    io.to(code).emit("turn_updated", room.playerOrder);
  }

  if (room.isGameOver) {
    checkAndResetGame(code, rooms, io);
  }
};

export const registerRoomHandlers = (io, socket, rooms) => {
  // Création d'une partie
  socket.on("create_game", (sessionId) => {
    const roomCode = generateRoomCode(rooms);
    const rules = generateRules();

    const room = (rooms[roomCode] = {
      players: [
        {
          id: socket.id,
          name: "Hôte",
          sessionId: sessionId || socket.id,
          isHost: true,
          isReady: false,
          score: 0,
          deck: { cards: null },
          leavedPlayer: false,
          inLobby: true,
        },
      ],
      threshold: 15,
      history: [],
      rules,
    });
    socket.join(roomCode);
    socket.data.roomCode = roomCode;

    socket.emit("room_created", roomCode, rules, room.players, room.threshold);
  });

  // Rejoindre une partie
  socket.on("join_game", (roomCode, sessionId) => {
    if (typeof roomCode !== "string" || !rooms[roomCode]) {
      socket.emit("room_not_found");
      return;
    }

    const room = rooms[roomCode];
    const existingPlayer = room.players.find((p) => p.sessionId === sessionId);

    if (existingPlayer) {
      const oldId = existingPlayer.id;
      existingPlayer.id = socket.id;
      existingPlayer.leavedPlayer = false;
      existingPlayer.inLobby = room.playerOrder ? false : true;
      socket.join(roomCode);
      socket.data.roomCode = roomCode;

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
        inLobby: true,
      };
      room.players.push(player);
      socket.join(roomCode);
      socket.data.roomCode = roomCode;

      io.to(roomCode).emit("room_updated", { players: room.players });
      socket.emit(
        "join_game_success",
        roomCode,
        room.rules,
        room.players,
        room.threshold
      );
    } else {
      socket.emit("room_full");
    }
  });

  // Changement du nom
  socket.on("change_name", async (name) => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found || typeof name !== "string") return;
    const cleaned = name.trim();
    if (!cleaned || cleaned.length > MAX_NAME_LENGTH) {
      socket.emit("name_rejected");
      return;
    }

    // Même nom que celui déjà validé : pas besoin de rappeler le modérateur
    if (cleaned === found.player.name) return;

    const status = await moderatePseudo(cleaned);
    if (status === "NON") {
      socket.emit("name_rejected");
    } else {
      found.player.name = cleaned;
      io.to(found.code).emit("room_updated", { players: found.room.players });
    }
  });

  // Prêt
  socket.on("ready", (isReady) => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found) return;
    found.player.isReady = Boolean(isReady);
    io.to(found.code).emit("room_updated", { players: found.room.players });
  });

  // Mise à jour du seuil de victoire
  socket.on("update_threshold", (newThreshold) => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found || !found.player.isHost || !Number.isFinite(newThreshold)) return;
    found.room.threshold = Math.min(Math.max(newThreshold, MIN_THRESHOLD), MAX_THRESHOLD);
    io.to(found.code).emit("threshold_updated", found.room.threshold);
  });

  // Départ volontaire
  socket.on("quit_lobby", () => handlePlayerLeave(io, socket, rooms));
};

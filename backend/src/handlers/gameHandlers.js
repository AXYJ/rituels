import {
    whoStart,
    getNextPlayerOrder,
    checkWin,
    calculateCardPoints,
    createCard,
    generateRules
} from "../gameLogic.js";
import { getRoomAndPlayer } from "../rooms.js";

export const checkAndResetGame = (roomCode, rooms, io) => {
  const room = rooms[roomCode];
  if (!room) return;

  const activePlayers = room.players.filter((p) => !p.leavedPlayer);
  const allInLobby = activePlayers.every((p) => p.inLobby);

  if (room.isGameOver && allInLobby) {
    room.rules = generateRules();
    delete room.playerOrder;
    room.threshold = 15;
    room.history = [];
    room.lastEffect = null;
    room.isGameOver = false;

    activePlayers.forEach((p) => {
      p.isReady = p.isHost;
      p.deck = { cards: null };
      p.inLobby = true;
    });

    room.players = activePlayers;

    io.to(roomCode).emit("game_reset", room.rules, activePlayers);
  }
};

export const registerGameHandlers = (io, socket, rooms) => {
  // Démarrer la partie
  socket.on("start_game", (roomCode, threshold) => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found || !found.player.isHost || found.code !== roomCode) return;
    const { room } = found;

    room.playerOrder = whoStart(room.players);
    room.players.forEach((p) => {
      p.score = 0;
      p.deck = {
        cards: [
          createCard(room.rules),
          createCard(room.rules),
          createCard(room.rules),
        ],
      };
      p.inLobby = false;
    });
    // Le seuil est borné par update_threshold ; on garde celui du serveur si la valeur reçue est invalide
    if (Number.isFinite(threshold)) {
      room.threshold = Math.min(Math.max(threshold, 5), 30);
    }
    room.history = [];
    room.lastEffect = null;
    io.to(roomCode).emit(
      "game_started",
      room.playerOrder[0],
      room.playerOrder,
      room.rules,
      room.players
    );
  });

  // Carte jouée
  socket.on("card_played", (card) => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found || !card) return;
    const { code, room, player } = found;

    // Partie en cours, tour du joueur, et carte réellement dans son deck
    if (room.isGameOver || room.playerOrder?.[0] !== socket.id) return;
    const ownCard = player.deck.cards?.find((c) => c.id === card.id);
    if (!ownCard) return;

    const { points, effectiveEffect } = calculateCardPoints(
      ownCard,
      room.rules,
      room.lastEffect
    );
    const isWin = checkWin(player, points, room.threshold);

    room.playerOrder = getNextPlayerOrder(room.playerOrder, room.players);

    room.history.push({
      type: "card",
      card: ownCard,
      player: socket.id,
      playerName: player.name,
      score: player.score,
      points,
      effectiveEffect,
    });

    if (isWin) {
      room.isGameOver = true;
      return io.to(code).emit("game_won", player.id, player.score);
    }

    room.lastEffect = effectiveEffect;

    const newCard = createCard(room.rules);
    player.deck.cards = player.deck.cards.filter((c) => c.id !== ownCard.id);
    player.deck.cards.push(newCard);

    io.to(code).emit(
      "card_played",
      ownCard,
      socket.id,
      player.name,
      room.playerOrder,
      player.score,
      points,
      newCard
    );
  });

  // Retour au lobby
  socket.on("return_to_lobby", () => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found) return;
    found.player.inLobby = true;

    io.to(found.code).emit("room_updated", { players: found.room.players });

    checkAndResetGame(found.code, rooms, io);
  });
};

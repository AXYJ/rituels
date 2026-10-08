import {
    whoStart,
    getNextPlayerOrder,
    checkWin,
    calculateCardPoints,
    createCard,
    generateRules
} from "../gameLogic.js";
import { getRoomAndPlayer } from "../rooms.js";
import {
  emitRoomUpdated,
  emitToRoom,
  hideCard,
  maskRules,
  publicPlayers,
} from "../serializers.js";

export const checkAndResetGame = (roomCode, rooms, io) => {
  const room = rooms[roomCode];
  if (!room) return;

  const activePlayers = room.players.filter((p) => !p.leavedPlayer);
  const allInLobby = activePlayers.every((p) => p.inLobby);

  if (room.isGameOver && allInLobby) {
    room.rules = generateRules();
    delete room.playerOrder;
    room.history = [];
    room.lastEffect = null;
    room.isGameOver = false;

    activePlayers.forEach((p) => {
      p.isReady = p.isHost;
      p.deck = { cards: null };
      p.inLobby = true;
    });

    room.players = activePlayers;

    emitToRoom(io, room, "game_reset", (viewerId) => [
      maskRules(room.rules),
      publicPlayers(activePlayers, viewerId),
    ]);
  }
};

export const registerGameHandlers = (io, socket, rooms) => {
  // Démarrer la partie
  socket.on("start_game", (roomCode) => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found || !found.player.isHost || found.code !== roomCode) return;
    const { room } = found;
    // Tout le monde doit être revenu au lobby (en fin de partie, les autres sont encore sur l'écran de victoire)
    if (room.players.some((p) => !p.leavedPlayer && !p.inLobby)) return;

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
    room.history = [];
    room.lastEffect = null;
    emitToRoom(io, room, "game_started", (viewerId) => [
      room.playerOrder[0],
      room.playerOrder,
      maskRules(room.rules),
      publicPlayers(room.players, viewerId),
    ]);
  });

  // Carte jouée
  socket.on("card_played", (card) => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found || !card) return;
    const { code, room, player } = found;

    // Partie en cours, tour du joueur, et carte réellement dans son deck
    if (room.isGameOver) return;
    const ownCard = player.deck.cards?.find((c) => c.id === card.id);
    if (room.playerOrder?.[0] !== socket.id || !ownCard) {
      // Client désynchronisé (tour, main) : on renvoie l'état réel pour qu'il ne reste pas bloqué
      emitRoomUpdated(io, room, { withOrder: true });
      return;
    }

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
      // Fin de partie : les règles sont enfin révélées
      room.players.forEach((p) => (p.isReady = false));
      io.to(code).emit("game_won", player.id, player.score, room.rules);
      // Chacun repasse en « pas prêt » jusqu'à son retour au lobby
      return emitRoomUpdated(io, room);
    }

    room.lastEffect = effectiveEffect;

    const newCard = createCard(room.rules);
    player.deck.cards = player.deck.cards.filter((c) => c.id !== ownCard.id);
    player.deck.cards.push(newCard);

    // La carte piochée n'est visible que par son propriétaire
    emitToRoom(io, room, "card_played", (viewerId) => [
      ownCard,
      socket.id,
      player.name,
      room.playerOrder,
      player.score,
      points,
      viewerId === socket.id ? newCard : hideCard(newCard),
    ]);
  });

  // Retour au lobby
  socket.on("return_to_lobby", () => {
    const found = getRoomAndPlayer(socket, rooms);
    if (!found) return;
    found.player.inLobby = true;

    emitRoomUpdated(io, found.room);

    checkAndResetGame(found.code, rooms, io);
  });
};

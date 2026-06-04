import { 
    whoStart, 
    getNextPlayerOrder, 
    checkWin, 
    calculateCardPoints, 
    createCard,
    generateRules 
} from "../gameLogic.js";

export const registerGameHandlers = (io, socket, rooms) => {
  // Démarrer la partie
  socket.on("start_game", (roomCode, threshold) => {
    const room = rooms[roomCode];
    if (room && room.players.find((p) => p.id === socket.id && p.isHost)) {
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
      });
      room.threshold = threshold;
      room.history = [];
      room.lastEffect = null;
      io.to(roomCode).emit(
        "game_started",
        room.playerOrder[0],
        room.playerOrder,
        room.rules,
        room.players
      );
    }
  });

  // Mise à jour du deck (pour la synchronisation visuelle)
  socket.on("update_deck", (idPlayer, deck) => {
    for (const code in rooms) {
      const room = rooms[code];
      const player = room.players.find((p) => p.id === idPlayer);
      if (player) {
        player.deck = deck;
        io.to(code).emit("deck_updated", idPlayer, player.deck);
        break;
      }
    }
  });

  // Carte jouée
  socket.on("card_played", (idPlayer, card) => {
    for (const code in rooms) {
      const room = rooms[code];
      const player = room.players.find((p) => p.id === idPlayer);
      if (player) {
        const { points, effectiveEffect } = calculateCardPoints(
          card,
          room.rules,
          room.lastEffect
        );
        const isWin = checkWin(player, points, room.threshold);

        room.playerOrder = getNextPlayerOrder(room.playerOrder, room.players);

        const historyItem = {
          type: "card",
          card,
          player: idPlayer,
          score: player.score,
          points: points,
          effectiveEffect,
        };
        room.history.push(historyItem);

        if (isWin) {
          return io.to(code).emit("game_won", player.id, player.score);
        }

        room.lastEffect = effectiveEffect;
        room.currentCard = card;

        const newCard = createCard(room.rules);
        if (player.deck.cards) {
          player.deck.cards = player.deck.cards.filter((c) => c.id !== card.id);
        }
        player.deck.cards.push(newCard);

        io.to(code).emit(
          "card_played",
          card,
          idPlayer,
          room.playerOrder,
          player.score,
          points,
          newCard
        );
        break;
      }
    }
  });

  // Rejouer la partie
  socket.on("reset_game", (triggerId) => {
    for (const code in rooms) {
      const room = rooms[code];
      const player = room.players.find((p) => p.id === socket.id);
      if (player) {
        room.rules = generateRules();
        delete room.playerOrder;
        room.threshold = 15;
        room.history = [];
        room.lastEffect = null;

        const activePlayers = room.players.filter((p) => !p.leavedPlayer);

        activePlayers.forEach((p) => {
          p.isReady = p.isHost;
          p.deck = { cards: null };
        });

        room.players = activePlayers;

        io.to(code).emit("game_reset", room.rules, activePlayers, triggerId);
        break;
      }
    }
  });
};

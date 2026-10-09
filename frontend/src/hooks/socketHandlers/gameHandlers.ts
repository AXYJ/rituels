import { Socket } from "socket.io-client";
import { Player, Card, GameRules, SocketActions } from "../../types/game";
import { listen, playSfx, rotateOrder } from "../../utils/socketHelpers";

export const registerGameHandlers = (
  socket: Socket,
  {
    setHistory,
    setWinner,
    setPlayerTurn,
    setPlayerOrder,
    setDisplayOrder,
    setPlayers,
    setRules,
    setView,
    setPropositions,
    sfxVolumeRef,
  }: SocketActions
) =>
  listen(socket, {
    // Démarrage de la partie
    game_started: (
      playerStart: string,
      playerOrder: string[],
      newRules: GameRules,
      serverPlayers: Player[]
    ) => {
      setHistory([]);
      setWinner(null);
      setPropositions({ symbolRules: {}, colorRules: {} });
      if (newRules) setRules(newRules);
      if (serverPlayers) setPlayers(serverPlayers);
      setView("game");
      setPlayerTurn(playerStart);
      setPlayerOrder(playerOrder);

      const displayOrder = rotateOrder(playerOrder, socket.id);
      if (displayOrder) setDisplayOrder(displayOrder);
    },

    // Carte jouée
    card_played: (
      card: Card,
      idPlayer: string,
      playerName: string,
      newOrder: string[],
      newScore: number,
      pointsGained: number,
      newCard: Card
    ) => {
      setHistory((prev) => [
        ...prev,
        {
          type: "card",
          card,
          player: idPlayer,
          playerName,
          score: newScore,
          points: pointsGained,
        },
      ]);
      setPlayerTurn(newOrder[0]);
      setPlayerOrder(newOrder);
      playSfx("flipcard", sfxVolumeRef);

      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id !== idPlayer) return p;
          const updatedPlayer = { ...p, score: newScore };
          // Même échange pour tous : la main des adversaires est cachée mais garde les ids
          if (p.deck.cards) {
            const newCards = p.deck.cards.filter((c) => c.id !== card.id);
            newCards.push(newCard);
            updatedPlayer.deck = { cards: newCards };
          }
          return updatedPlayer;
        })
      );
    },

    // Fin de partie
    game_won: (idPlayer: string, finalScore: number, finalRules: GameRules) => {
      setRules(finalRules);
      setPlayers((prev) =>
        prev.map((p) => (p.id === idPlayer ? { ...p, score: finalScore } : p))
      );
      setWinner(idPlayer);
    },

    game_reset: (rules: GameRules, players: Player[]) => {
      setPlayers(players);
      setView("lobby");
      setRules(rules);
      setHistory([]);
      setWinner(null);
      setPropositions({ symbolRules: {}, colorRules: {} });
    },
  });

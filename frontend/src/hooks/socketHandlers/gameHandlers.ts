import { Socket } from "socket.io-client";
import { Player, Card, GameRules, View, HistoryItem } from "../../types/game";
import { MutableRefObject, Dispatch, SetStateAction } from "react";

export const registerGameHandlers = (
  socket: Socket,
  setHistory: (
    history: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])
  ) => void,
  setWinner: (winner: string | null) => void,
  setPlayerTurn: (turn: string) => void,
  setPlayerOrder: (order: string[]) => void,
  setDisplayOrder: (order: string[] | null) => void,
  setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void,
  setRules: (rules: GameRules | null) => void,
  setView: (view: View) => void,
  setPropositions: Dispatch<
    SetStateAction<{
      symbolRules: Record<string, string>;
      colorRules: Record<string, string>;
    }>
  >,
  setPlayerNumber: (num: number) => void,
  sfxVolumeRef: MutableRefObject<number>
) => {
  // Démarrage de la partie
  socket.on(
    "game_started",
    (
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

      const myOrder = playerOrder.findIndex((p: string) => p === socket.id);
      if (myOrder !== -1) {
        const newDisplayOrder = [
          ...playerOrder.slice(myOrder),
          ...playerOrder.slice(0, myOrder),
        ];
        setDisplayOrder(newDisplayOrder);
      }
    }
  );

  // Carte jouée
  socket.on(
    "card_played",
    (
      card: Card,
      idPlayer: string,
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
          score: newScore,
          points: pointsGained,
        },
      ]);
      setPlayerTurn(newOrder[0]);
      setPlayerOrder(newOrder);

      if (sfxVolumeRef.current > 0) {
        const sound = new Audio("/sfx/flipcard.mp3");
        sound.volume = sfxVolumeRef.current;
        sound.play().catch((e) => console.error("Erreur lecture audio :", e));
      }

      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === idPlayer) {
            const updatedPlayer = { ...p, score: newScore };
            if (p.id === socket.id && p.deck.cards) {
              const newCards = p.deck.cards.filter((c) => c.id !== card.id);
              newCards.push(newCard);
              updatedPlayer.deck = { cards: newCards };
            }
            return updatedPlayer;
          }
          return p;
        })
      );
    }
  );

  // Fin de partie / Reset
  socket.on("game_won", (idPlayer: string, finalScore: number) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === idPlayer) {
          return { ...p, score: finalScore };
        }
        return p;
      })
    );
    setWinner(idPlayer);
  });

  socket.on("turn_updated", (newOrder: string[]) => {
    setPlayerTurn(newOrder[0]);
    setPlayerOrder(newOrder);
  });

  socket.on(
    "game_reset",
    (rules: GameRules, players: Player[], socketId: string) => {
      setPlayers(players);
      if (socketId === socket.id) {
        setView("lobby");
        setRules(rules);
        setHistory([]);
        setWinner(null);
        setPropositions({ symbolRules: {}, colorRules: {} });
        setPlayerNumber(0);
      }
    }
  );

  socket.on(
    "deck_updated",
    (idPlayer: string, deck: { cards: Card[] | null }) => {
      if (idPlayer === socket.id) return;
      setPlayers((prev) =>
        prev.map((p) => (p.id === idPlayer ? { ...p, deck } : p))
      );
    }
  );
};

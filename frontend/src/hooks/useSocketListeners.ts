import { useEffect, MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { Player, Card, GameRules, View, HistoryItem } from "../types/game";

interface SocketListenersProps {
  socket: Socket | null;
  setView: (view: View) => void;
  setError: (error: string | null) => void;
  setRoomCode: (code: string) => void;
  setRules: (rules: GameRules | null) => void;
  setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void;
  setPlayerNumber: (num: number) => void;
  setThreshold: (threshold: number) => void;
  setHistory: (history: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])) => void;
  setWinner: (winner: string | null) => void;
  setPlayerTurn: (turn: string) => void;
  setPlayerOrder: (order: string[]) => void;
  setDisplayOrder: (order: string[] | null) => void;
  setLastEffect: (effect: string | null) => void;
  setPropositions: (props: any) => void;
  sfxVolumeRef: MutableRefObject<number>;
}

export const useSocketListeners = (props: SocketListenersProps) => {
  const {
    socket,
    setView,
    setError,
    setRoomCode,
    setRules,
    setPlayers,
    setPlayerNumber,
    setThreshold,
    setHistory,
    setWinner,
    setPlayerTurn,
    setPlayerOrder,
    setDisplayOrder,
    setLastEffect,
    setPropositions,
    sfxVolumeRef,
  } = props;

  useEffect(() => {
    if (!socket) return;

    // Keep-alive HTTP
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    const keepAliveInterval = setInterval(() => {
      fetch(socketUrl).catch((err) => console.error("Erreur keep-alive", err));
    }, 5 * 60 * 1000);

    // Connexion
    socket.on("connect", () => {
      console.log("Connecté au serveur ! ID:", socket.id);
    });

    // Erreurs de connexion
    socket.on("connect_error", (err) => {
      console.error("Erreur de connexion socket:", err);
      setError("Erreur de connexion serveur");
    });

    // Déconnexion
    socket.on("disconnect", (reason) => {
      console.log("Socket déconnecté:", reason);
      setView("home");
      setError("Vous avez été déconnecté du serveur.");
      setRoomCode("");
      setPlayers([]);
      setRules(null);
      setPlayerNumber(0);
      setHistory([]);
      setPropositions({ symbolRules: {}, colorRules: {} });
    });

    // Création d'un lobby
    socket.on("room_created", (code, rules, serverPlayers, playerNumber, threshold) => {
      setRoomCode(code);
      setRules(rules);
      if (threshold !== undefined) setThreshold(threshold);
      setPlayers(serverPlayers.map((p: Player) => ({
        ...p,
        deck: p.deck ?? { cards: null },
        score: p.score ?? 0,
      })));
      setPlayerNumber(playerNumber);
      setView("lobby");
    });

    // Rejoindre une partie
    socket.on("join_game_success", (code, rules, players, playerNumber, threshold) => {
      setRoomCode(code);
      setRules(rules);
      if (threshold !== undefined) setThreshold(threshold);
      setPlayers(players);
      setPlayerNumber(playerNumber);
      setView("lobby");
    });

    // Erreurs salon
    socket.on("room_full", () => setError("La partie est pleine !"));
    socket.on("room_not_found", () => setError("Partie introuvable !"));
    socket.on("game_already_started", () => setError("La partie a déjà commencé !"));

    // Mise à jour du lobby
    socket.on("room_updated", (room) => {
      if (!room || !room.players) return;
      setPlayers((prevPlayers) => {
        return room.players.map((serverPlayer: Player) => {
          const localPlayer = prevPlayers.find((p) => p.id === serverPlayer.id);
          return {
            ...serverPlayer,
            deck: serverPlayer.deck ?? localPlayer?.deck ?? { cards: null },
            score: serverPlayer.score ?? localPlayer?.score ?? 0,
          };
        });
      });
    });

    // Démarrage de la partie
    socket.on("game_started", (playerStart, playerOrder, newRules) => {
      setHistory([]);
      setWinner(null);
      setPropositions({ symbolRules: {}, colorRules: {} });
      setLastEffect(null);
      if (newRules) setRules(newRules);
      setView("game");
      setPlayerTurn(playerStart);
      setPlayerOrder(playerOrder);
      
      const myOrder = playerOrder.findIndex((p: string) => p === socket.id);
      let newDisplayOrder: string[] = [];
      if (myOrder !== -1) {
        newDisplayOrder = [...playerOrder.slice(myOrder), ...playerOrder.slice(0, myOrder)];
      } else {
        newDisplayOrder = [...playerOrder];
      }
      setDisplayOrder(newDisplayOrder);
    });

    // Carte jouée
    socket.on("card_played", (card, idPlayer, newOrder, newScore, pointsGained, effectiveEffect) => {
      setHistory((prev) => [...prev, {
        type: "card",
        card,
        player: idPlayer,
        score: newScore,
        points: pointsGained,
      }]);
      setLastEffect(effectiveEffect);
      setPlayerTurn(newOrder[0]);
      setPlayerOrder(newOrder);
      
      if (sfxVolumeRef.current > 0) {
        const sound = new Audio("/sfx/flipcard.mp3");
        sound.volume = sfxVolumeRef.current;
        sound.play().catch((e) => console.error("Erreur lecture audio :", e));
      }
      setPlayers((prev) => prev.map((p) => (p.id === idPlayer ? { ...p, score: newScore } : p)));
    });

    // Message reçu
    socket.on("message_received", (idPlayer, message) => {
      setHistory((prev) => [...prev, { type: "message", player: idPlayer, message }]);
      if (sfxVolumeRef.current > 0) {
        const sound = new Audio("/sfx/notification.mp3");
        sound.volume = sfxVolumeRef.current;
        sound.play().catch((e) => console.error("Erreur lecture audio :", e));
      }
    });

    // Fin de partie / Reset
    socket.on("game_won", (idPlayer) => setWinner(idPlayer));
    socket.on("turn_updated", (newOrder) => {
      setPlayerTurn(newOrder[0]);
      setPlayerOrder(newOrder);
    });

    socket.on("game_reset", (rules, players, socketId) => {
      setPlayers(players);
      if (socketId === socket.id) {
        setView("lobby");
        setRules(rules);
        setHistory([]);
        setWinner(null);
        setPropositions({ symbolRules: {}, colorRules: {} });
        setPlayerNumber(0);
      }
    });

    socket.on("deck_updated", (idPlayer, deck) => {
      if (idPlayer === socket.id) return;
      setPlayers((prev) => prev.map((p) => (p.id === idPlayer ? { ...p, deck } : p)));
    });

    socket.on("threshold_updated", (newThreshold) => setThreshold(newThreshold));

    return () => {
      clearInterval(keepAliveInterval);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [socket, setView, setError, setRoomCode, setRules, setPlayers, setPlayerNumber, setThreshold, setHistory, setWinner, setPlayerTurn, setPlayerOrder, setDisplayOrder, setLastEffect, setPropositions, sfxVolumeRef]);
};

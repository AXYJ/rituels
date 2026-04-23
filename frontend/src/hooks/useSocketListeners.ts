import { useEffect, MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { Player, Card, GameRules, View, HistoryItem } from "../types/game";

// Clé pour le localStorage
const ROOM_CODE_KEY = "rituels_room_code";

interface SocketListenersProps {
  socket: Socket | null;
  setView: (view: View) => void;
  setError: (error: string | null) => void;
  setRoomCode: (code: string) => void;
  setRules: (rules: GameRules | null) => void;
  setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void;
  setPlayerNumber: (num: number) => void;
  setThreshold: (threshold: number) => void;
  setHistory: (
    history: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])
  ) => void;
  setWinner: (winner: string | null) => void;
  setPlayerTurn: (turn: string) => void;
  setPlayerOrder: (order: string[]) => void;
  setDisplayOrder: (order: string[] | null) => void;
  setPropositions: (props: any) => void;
  setIsConnected: (connected: boolean) => void;
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
    setPropositions,
    setIsConnected,
    sfxVolumeRef,
  } = props;

  useEffect(() => {
    if (!socket) return;

    // Keep-alive HTTP
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    const keepAliveInterval = setInterval(
      () => {
        fetch(socketUrl).catch((err) =>
          console.error("Erreur keep-alive", err)
        );
      },
      5 * 60 * 1000
    );

    // Connexion
    socket.on("connect", () => {
      console.log("Connecté au serveur ! ID:", socket.id);
      setIsConnected(true);
    });

    // Erreurs de connexion
    socket.on("connect_error", (err) => {
      console.error("Erreur de connexion socket:", err);
      setError("Erreur de connexion serveur");
      setIsConnected(false);
    });

    // Déconnexion
    socket.on("disconnect", (reason) => {
      console.log("Socket déconnecté:", reason);
      setIsConnected(false);
      // Ne pas rediriger vers "home" si c'est une déconnexion temporaire (transports, etc.)
      if (
        reason === "io server disconnect" ||
        reason === "io client disconnect"
      ) {
        setView("home");
        setError("Vous avez été déconnecté du serveur.");
      }
    });

    // Création d'un lobby
    socket.on(
      "room_created",
      (code, rules, serverPlayers, playerNumber, threshold) => {
        setRoomCode(code);
        setRules(rules);
        localStorage.setItem(ROOM_CODE_KEY, code);
        if (threshold !== undefined) setThreshold(threshold);
        setPlayers(
          (serverPlayers || []).map((p: Player) => ({
            ...p,
            deck: p.deck ?? { cards: null },
            score: p.score ?? 0,
          }))
        );
        setPlayerNumber(playerNumber);
        setView("lobby");
      }
    );

    // Rejoindre une partie
    socket.on(
      "join_game_success",
      (code, rules, players, playerNumber, threshold) => {
        localStorage.setItem(ROOM_CODE_KEY, code);
        setRoomCode(code);
        setRules(rules);
        if (threshold !== undefined) setThreshold(threshold);
        setPlayers(players || []);
        setPlayerNumber(playerNumber);
        setView("lobby");
      }
    );

    // Erreurs salon
    socket.on("room_full", () => setError("La partie est pleine !"));
    socket.on("room_not_found", () => setError("Partie introuvable !"));
    socket.on("game_already_started", () =>
      setError("La partie a déjà commencé !")
    );
    socket.on("name_rejected", () => setError("Pseudo refusé !"));

    // Mise à jour du lobby
    socket.on("room_updated", (data) => {
      if (!data || !data.players) return;

      const { players: serverPlayers, playerOrder: serverPlayerOrder } = data;

      // Mise à jour de l'ordre si on est en partie (si playerOrder est présent)
      if (serverPlayerOrder) {
        setPlayerOrder(serverPlayerOrder);
        setPlayerTurn(serverPlayerOrder[0]);

        const myOrder = serverPlayerOrder.findIndex(
          (p: string) => p === socket?.id
        );
        if (myOrder !== -1) {
          const newDisplayOrder = [
            ...serverPlayerOrder.slice(myOrder),
            ...serverPlayerOrder.slice(0, myOrder),
          ];
          setDisplayOrder(newDisplayOrder);
        }
      }

      setPlayers((prevPlayers) => {
        const safePrevPlayers = prevPlayers || [];
        return serverPlayers.map((serverPlayer: Player) => {
          // On cherche par ID socket, ou par sessionId si l'ID socket a changé (reconnexion)
          const localPlayer =
            safePrevPlayers.find((p) => p.id === serverPlayer.id) ||
            safePrevPlayers.find((p) => p.sessionId === serverPlayer.sessionId);
          return {
            ...serverPlayer,
            deck: serverPlayer.deck?.cards
              ? serverPlayer.deck
              : (localPlayer?.deck ?? { cards: null }),
            score: serverPlayer.score ?? localPlayer?.score ?? 0,
          };
        });
      });
    });

    socket.on("reconnected", (data) => {
      const {
        roomCode,
        rules,
        players,
        playerNumber,
        threshold,
        playerOrder,
        playerTurn,
        history,
      } = data;

      setRoomCode(roomCode);
      setRules(rules);
      if (threshold !== undefined) setThreshold(threshold);
      setPlayers(players || []);
      setPlayerNumber(playerNumber);

      // Si une partie est déjà en cours (ordre défini)
      if (playerOrder && playerOrder.length > 0) {
        setPlayerOrder(playerOrder);
        setPlayerTurn(playerTurn);
        setHistory(history || []);

        // Calculer l'ordre d'affichage (pour que le joueur local soit en bas)
        const myOrder = playerOrder.findIndex((p: string) => p === socket.id);
        let newDisplayOrder: string[] = [];
        if (myOrder !== -1) {
          newDisplayOrder = [
            ...playerOrder.slice(myOrder),
            ...playerOrder.slice(0, myOrder),
          ];
        } else {
          newDisplayOrder = [...playerOrder];
        }
        setDisplayOrder(newDisplayOrder);
        setView("game");
      } else {
        setView("lobby");
      }
    });

    // Démarrage de la partie
    socket.on(
      "game_started",
      (playerStart, playerOrder, newRules, serverPlayers) => {
        setHistory([]);
        setWinner(null);
        setPropositions({ symbolRules: {}, colorRules: {} });
        if (newRules) setRules(newRules);
        if (serverPlayers) setPlayers(serverPlayers);
        setView("game");
      setPlayerTurn(playerStart);
      setPlayerOrder(playerOrder);

      const myOrder = playerOrder.findIndex((p: string) => p === socket.id);
      let newDisplayOrder: string[] = [];
      if (myOrder !== -1) {
        newDisplayOrder = [
          ...playerOrder.slice(myOrder),
          ...playerOrder.slice(0, myOrder),
        ];
      } else {
        newDisplayOrder = [...playerOrder];
      }
      setDisplayOrder(newDisplayOrder);
    });

    // Carte jouée
    socket.on(
      "card_played",
      (card, idPlayer, newOrder, newScore, pointsGained, newCard) => {
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
              // Si c'est le joueur local, on met à jour son deck
              if (p.id === socket?.id && p.deck.cards) {
                // On retire la carte jouée par son ID unique
                const newCards = p.deck.cards.filter((c) => c.id !== card.id);
                // On ajoute la nouvelle carte générée par le serveur
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

    // Message reçu
    socket.on("message_received", (idPlayer, message) => {
      setHistory((prev) => [
        ...prev,
        { type: "message", player: idPlayer, message },
      ]);
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
      setPlayers((prev) =>
        prev.map((p) => (p.id === idPlayer ? { ...p, deck } : p))
      );
    });

    socket.on("threshold_updated", (newThreshold) =>
      setThreshold(newThreshold)
    );

    return () => {
      clearInterval(keepAliveInterval);
      socket.removeAllListeners();
    };
  }, [
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
    setPropositions,
    setIsConnected,
    sfxVolumeRef,
  ]);
};

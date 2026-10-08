import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { Player, GameRules, HistoryItem, SocketActions } from "../types/game";
import { PLAYER_NAME_KEY } from "../utils/storageKeys";
import { listen, rotateOrder } from "../utils/socketHelpers";

// Handlers segmentés
import { registerRoomHandlers } from "./socketHandlers/roomHandlers";
import { registerGameHandlers } from "./socketHandlers/gameHandlers";
import { registerChatHandlers } from "./socketHandlers/chatHandlers";

export const useSocketListeners = (
  socket: Socket | null,
  actions: SocketActions
) => {
  useEffect(() => {
    if (!socket) return;
    const {
      setView,
      setError,
      setRoomCode,
      setRules,
      setPlayers,
      setThreshold,
      setHistory,
      setPlayerTurn,
      setPlayerOrder,
      setDisplayOrder,
      setIsConnected,
      setNoMorePlayers,
    } = actions;

    // Keep-alive pour éviter que le serveur (ex: Render) ne mette le socket en veille
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

    // Chaque register* renvoie sa propre fonction de désabonnement
    const cleanups = [
      registerRoomHandlers(socket, actions),
      registerGameHandlers(socket, actions),
      registerChatHandlers(socket, actions),

      // Connexion & cycle de vie, mise à jour du lobby, reconnexion
      listen(socket, {
        connect: () => {
          console.log("Connecté au serveur ! ID:", socket.id);
          setIsConnected(true);
        },

        connect_error: (err: Error) => {
          console.error("Erreur de connexion socket:", err);
          setError("Erreur de connexion serveur");
          setIsConnected(false);
        },

        disconnect: (reason: string) => {
          console.log("Socket déconnecté:", reason);
          setIsConnected(false);
          if (
            reason === "io server disconnect" ||
            reason === "io client disconnect"
          ) {
            setView("home");
            setError("Vous avez été déconnecté du serveur.");
          }
        },

        // Mise à jour du lobby / salle
        room_updated: (data: { players: Player[]; playerOrder?: string[] }) => {
          if (!data || !data.players) return;

          // Persistance du pseudo validé
          const me = data.players.find((p: Player) => p.id === socket.id);
          if (me?.name) {
            localStorage.setItem(PLAYER_NAME_KEY, me.name);
          }

          const { players: serverPlayers, playerOrder: serverPlayerOrder } =
            data;

          if (serverPlayerOrder) {
            setPlayerOrder(serverPlayerOrder);
            setPlayerTurn(serverPlayerOrder[0]);

            const displayOrder = rotateOrder(serverPlayerOrder, socket.id);
            if (displayOrder) setDisplayOrder(displayOrder);
          }

          setPlayers((prevPlayers) => {
            const safePrevPlayers = prevPlayers || [];
            return serverPlayers.map((serverPlayer: Player) => {
              const localPlayer = safePrevPlayers.find(
                (p) => p.id === serverPlayer.id
              );
              return {
                ...serverPlayer,
                deck: serverPlayer.deck?.cards
                  ? serverPlayer.deck
                  : (localPlayer?.deck ?? { cards: null }),
                score: serverPlayer.score ?? localPlayer?.score ?? 0,
              };
            });
          });
        },

        // Gestion de la reconnexion
        reconnected: (data: {
          roomCode: string;
          rules: GameRules;
          players: Player[];
          threshold: number;
          playerOrder: string[];
          playerTurn: string;
          history: HistoryItem[];
        }) => {
          const {
            roomCode,
            rules,
            players,
            threshold,
            playerOrder,
            playerTurn,
            history,
          } = data;

          setRoomCode(roomCode);
          setRules(rules);
          if (threshold !== undefined) setThreshold(threshold);
          setPlayers(players || []);

          if (playerOrder && playerOrder.length > 0) {
            setPlayerOrder(playerOrder);
            setPlayerTurn(playerTurn);
            setHistory(history || []);

            const displayOrder = rotateOrder(playerOrder, socket.id);
            if (displayOrder) setDisplayOrder(displayOrder);
            setView("game");
          } else {
            setView("lobby");
          }
        },

        no_more_players: () => setNoMorePlayers(true),
      }),
    ];

    return () => {
      clearInterval(keepAliveInterval);
      cleanups.forEach((cleanup) => cleanup());
    };
    // actions est recréé à chaque rendu mais ne contient que des setters stables et une ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
};

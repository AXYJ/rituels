import { useEffect, MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { Player, GameRules, View, HistoryItem } from "../types/game";

// Handlers segmentés
import { registerRoomHandlers } from "./socketHandlers/roomHandlers";
import { registerGameHandlers } from "./socketHandlers/gameHandlers";
import { registerChatHandlers } from "./socketHandlers/chatHandlers";

// Clé pour le localStorage
const PLAYER_NAME_KEY = "rituels_player_name";

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
  setNoMorePlayers: React.Dispatch<React.SetStateAction<boolean>>;
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
    setNoMorePlayers,
    sfxVolumeRef,
  } = props;

  useEffect(() => {
    if (!socket) return;

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

    // ----------------
    // Connexion & Cycle de vie
    // ----------------
    socket.on("connect", () => {
      console.log("Connecté au serveur ! ID:", socket.id);
      setIsConnected(true);
    });

    socket.on("connect_error", (err) => {
      console.error("Erreur de connexion socket:", err);
      setError("Erreur de connexion serveur");
      setIsConnected(false);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket déconnecté:", reason);
      setIsConnected(false);
      if (
        reason === "io server disconnect" ||
        reason === "io client disconnect"
      ) {
        setView("home");
        setError("Vous avez été déconnecté du serveur.");
      }
    });

    // ----------------
    // Enregistrement des handlers modularisés
    // ----------------
    registerRoomHandlers(
      socket,
      setRoomCode,
      setRules,
      setThreshold,
      setPlayers,
      setPlayerNumber,
      setView,
      setError
    );

    registerGameHandlers(
      socket,
      setHistory,
      setWinner,
      setPlayerTurn,
      setPlayerOrder,
      setDisplayOrder,
      setPlayers,
      setRules,
      setView,
      setPropositions,
      setPlayerNumber,
      sfxVolumeRef
    );

    registerChatHandlers(socket, setHistory, sfxVolumeRef);

    // ----------------
    // Handlers spécifiques à la mise à jour globale et reconnexion
    // ----------------

    // Mise à jour du lobby / salle
    socket.on(
      "room_updated",
      (data: { players: Player[]; playerOrder?: string[] }) => {
        if (!data || !data.players) return;

        // Persistance du pseudo validé
        if (typeof window !== "undefined") {
          const me = data.players.find((p: Player) => p.id === socket.id);
          if (me?.name) {
            localStorage.setItem(PLAYER_NAME_KEY, me.name);
          }
        }

        const { players: serverPlayers, playerOrder: serverPlayerOrder } = data;

        if (serverPlayerOrder) {
          setPlayerOrder(serverPlayerOrder);
          setPlayerTurn(serverPlayerOrder[0]);

          const myOrder = serverPlayerOrder.findIndex(
            (p: string) => p === socket.id
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
            const localPlayer =
              safePrevPlayers.find((p) => p.id === serverPlayer.id) ||
              safePrevPlayers.find(
                (p) => p.sessionId === serverPlayer.sessionId
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
      }
    );

    // Gestion de la reconnexion
    socket.on(
      "reconnected",
      (data: {
        roomCode: string;
        rules: GameRules;
        players: Player[];
        playerNumber: number;
        threshold: number;
        playerOrder: string[];
        playerTurn: string;
        history: HistoryItem[];
      }) => {
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

        if (playerOrder && playerOrder.length > 0) {
          setPlayerOrder(playerOrder);
          setPlayerTurn(playerTurn);
          setHistory(history || []);

          const myOrder = playerOrder.findIndex((p: string) => p === socket.id);
          if (myOrder !== -1) {
            const newDisplayOrder = [
              ...playerOrder.slice(myOrder),
              ...playerOrder.slice(0, myOrder),
            ];
            setDisplayOrder(newDisplayOrder);
          }
          setView("game");
        } else {
          setView("lobby");
        }
      }
    );

    socket.on("no_more_players", () => {
      setNoMorePlayers(true);
    });

    // ----------------
    // Cleanup
    // ----------------
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
    setNoMorePlayers,
    sfxVolumeRef,
  ]);
};

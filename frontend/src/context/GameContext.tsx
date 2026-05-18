"use client";

// Import des modules
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";

// Clé pour le localStorage
const PLAYER_NAME_KEY = "rituels_player_name";

// Import des types
import {
  View,
  GameContextType,
  GameRules,
  Player,
  Card,
  HistoryItem,
} from "../types/game";
import { useSocketListeners } from "../hooks/useSocketListeners";

// Création du contexte
const GameContext = createContext<GameContextType | undefined>(undefined);

// Création du provider
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("home");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [rules, setRules] = useState<GameRules | null>(null);
  const [playerNumber, setPlayerNumber] = useState(0);
  const [playerTurn, setPlayerTurn] = useState("");
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [noMorePlayers, setNoMorePlayers] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<string[] | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const sfxVolumeRef = useRef(sfxVolume);
  const [threshold, setThreshold] = useState(15);
  const [propositions, setPropositions] = useState<{
    symbolRules: Record<string, string>;
    colorRules: Record<string, string>;
  }>({
    symbolRules: {},
    colorRules: {},
  });

  useEffect(() => {
    sfxVolumeRef.current = sfxVolume;
  }, [sfxVolume]);

  useEffect(() => {
    // Création d'un ID de session pour pouvoir se reconnecter
    let sessionId = sessionStorage.getItem("rituels_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("rituels_session_id", sessionId);
    }

    // Initialisation de la connexion
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);
    setIsConnected(newSocket.connected);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Utilisation du hook personnalisé pour gérer les écouteurs Socket
  useSocketListeners({
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
    sfxVolumeRef,
    setNoMorePlayers,
    setIsConnected,
  });

  // Reconnexion automatique au lobby / partie après une déconnexion
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      if (roomCode) {
        const sessionId = sessionStorage.getItem("rituels_session_id");
        socket.emit("join_game", roomCode, sessionId);

        const savedName = localStorage.getItem(PLAYER_NAME_KEY);
        if (savedName) {
          socket.emit("change_name", savedName);
        }
      }
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket, roomCode]);

  // ----------------
  // Actions de jeu (envoi au serveur)
  // ----------------

  // Création d'une partie
  const createGame = useCallback(() => {
    if (socket) {
      const sessionId = sessionStorage.getItem("rituels_session_id");
      socket.emit("create_game", socket.id, sessionId);

      // Restaurer le nom si présent dans le localStorage
      if (typeof window !== "undefined") {
        const savedName = localStorage.getItem(PLAYER_NAME_KEY);
        if (savedName) {
          socket.emit("change_name", savedName);
        }
      }
    }
  }, [socket]);

  // Rejoindre une partie
  const joinGame = useCallback(
    (code: string) => {
      if (socket) {
        setRoomCode(code);
        const sessionId = sessionStorage.getItem("rituels_session_id");
        socket.emit("join_game", code, sessionId);

        // Restaurer le nom si présent dans le localStorage
        if (typeof window !== "undefined") {
          const savedName = localStorage.getItem(PLAYER_NAME_KEY);
          if (savedName) {
            socket.emit("change_name", savedName);
          }
        }
      }
    },
    [socket]
  );

  // Changer le nom
  const changeName = useCallback(
    (name: string) => {
      if (socket) {
        socket.emit("change_name", name);
      }
    },
    [socket]
  );

  // Prêt
  const beReady = useCallback(() => {
    if (socket) {
      const me = players.find((p) => p.id === socket.id);
      if (me) {
        socket.emit("ready", !me.isReady, socket.id);
      }
    }
  }, [socket, players]);

  // Quitter le lobby
  const quitLobby = useCallback(() => {
    if (socket) {
      socket.emit("quit_lobby", socket.id);
    }
    setView("home");
    setRoomCode("");
    setPlayers([]);
    setRules(null);
    setHistory([]);
    setDisplayOrder(null);
    setPlayerNumber(0);
  }, [socket]);

  // Démarrer la partie
  const startGame = useCallback(() => {
    if (socket) {
      socket.emit("start_game", roomCode, threshold);
    }
  }, [socket, roomCode, threshold]);

  // Mis à jour du deck
  const updateDeck = useCallback(
    (deck: { cards: Card[] | null }) => {
      if (socket) {
        socket.emit("update_deck", socket.id, deck);
      }
    },
    [socket]
  );

  // Mise à jour du seuil de victoire
  const updateThreshold = useCallback(
    (newThreshold: number) => {
      if (socket) {
        setThreshold(newThreshold);
        socket.emit("update_threshold", newThreshold);
      }
    },
    [socket]
  );

  // Jouer une carte
  const cardPlayed = useCallback(
    (card: Card) => {
      if (socket) {
        socket.emit("card_played", socket.id, card);
      }
    },
    [socket]
  );

  // Envoyer un message
  const sendMessage = useCallback(
    (message: string) => {
      if (socket && message.trim() !== "") {
        socket.emit("send_message", message.trim());
      }
    },
    [socket]
  );

  // Reset le jeu
  const resetGame = useCallback(() => {
    if (socket) {
      socket.emit("reset_game", socket.id);
    }
  }, [socket]);

  // Met à jour le deck du joueur local
  const setLocalPlayerDeck = useCallback(
    (cards: Card[]) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === socket?.id ? { ...p, deck: { cards } } : p))
      );
    },
    [socket]
  );

  // ----------------
  // Valeurs du contexte
  // ----------------

  const value = useMemo(
    () => ({
      socket,
      view,
      setView,
      isConnected,
      error,
      setError,
      roomCode,
      setRoomCode,
      noMorePlayers,
      setNoMorePlayers,
      players,
      setPlayers,
      createGame,
      joinGame,
      changeName,
      rules,
      setRules,
      playerNumber,
      setPlayerNumber,
      beReady,
      quitLobby,
      startGame,
      playerTurn,
      setPlayerTurn,
      cardPlayed,
      playerOrder,
      setPlayerOrder,
      setLocalPlayerDeck,
      history,
      setHistory,
      sendMessage,
      winner,
      setWinner,
      displayOrder,
      setDisplayOrder,
      resetGame,
      updateDeck,
      volume,
      setVolume,
      sfxVolume,
      setSfxVolume,
      threshold,
      updateThreshold,
      setThreshold,
      propositions,
      setPropositions,
    }),
    [
      socket,
      view,
      isConnected,
      error,
      noMorePlayers,
      roomCode,
      players,
      createGame,
      joinGame,
      changeName,
      rules,
      playerNumber,
      beReady,
      quitLobby,
      startGame,
      playerTurn,
      cardPlayed,
      playerOrder,
      setLocalPlayerDeck,
      history,
      sendMessage,
      winner,
      displayOrder,
      resetGame,
      updateDeck,
      volume,
      sfxVolume,
      threshold,
      updateThreshold,
      propositions,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Hook personnalisé
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context)
    throw new Error("useGame doit être utilisé dans un GameProvider");
  return context;
};

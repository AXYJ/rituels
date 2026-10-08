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

// Import des types
import {
  View,
  GameContextType,
  GameRules,
  Player,
  Card,
  HistoryItem,
  SocketActions,
} from "../types/game";
import { useSocketListeners } from "../hooks/useSocketListeners";
import {
  ROOM_CODE_KEY,
  SESSION_ID_KEY,
  SFX_KEY,
  VOLUME_KEY,
} from "../utils/storageKeys";
import { restoreName } from "../utils/socketHelpers";

// Volume enregistré (0.5 par défaut, et côté serveur où localStorage n'existe pas)
const readVolume = (key: string) => {
  if (typeof window === "undefined") return 0.5;
  const saved = parseFloat(localStorage.getItem(key) ?? "");
  return Number.isNaN(saved) ? 0.5 : saved;
};

// Création du contexte
const GameContext = createContext<GameContextType | undefined>(undefined);

// Création du provider
export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Créé une seule fois côté navigateur ; la connexion démarre dans l'effet ci-dessous
  const [socket] = useState<Socket | null>(() =>
    typeof window === "undefined"
      ? null
      : io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
          transports: ["websocket", "polling"],
          autoConnect: false,
        })
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("home");
  const [roomCode, setRoomCode] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(ROOM_CODE_KEY) || "";
    }
    return "";
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [rules, setRules] = useState<GameRules | null>(null);
  const [playerTurn, setPlayerTurn] = useState("");
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [noMorePlayers, setNoMorePlayers] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<string[] | null>(null);
  const [volume, setVolume] = useState(() => readVolume(VOLUME_KEY));
  const [sfxVolume, setSfxVolume] = useState(() => readVolume(SFX_KEY));
  const sfxVolumeRef = useRef(sfxVolume);
  const [threshold, setThreshold] = useState(15);
  const [propositions, setPropositions] = useState<{
    symbolRules: Record<string, string>;
    colorRules: Record<string, string>;
  }>({
    symbolRules: {},
    colorRules: {},
  });

  // Sauvegarde des volumes dans le localStorage quand ils changent
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(VOLUME_KEY, volume.toString());
      localStorage.setItem(SFX_KEY, sfxVolume.toString());
    }
    sfxVolumeRef.current = sfxVolume;
  }, [volume, sfxVolume]);

  useEffect(() => {
    // Création d'un ID de session pour pouvoir se reconnecter
    if (!localStorage.getItem(SESSION_ID_KEY)) {
      localStorage.setItem(SESSION_ID_KEY, crypto.randomUUID());
    }

    // Connexion au serveur (le socket est créé plus haut, une seule fois)
    socket?.connect();
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  // Utilisation du hook personnalisé pour gérer les écouteurs Socket
  const socketActions: SocketActions = {
    setView,
    setError,
    setRoomCode,
    setRules,
    setPlayers,
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
  };
  useSocketListeners(socket, socketActions);

  // Reconnexion automatique au lobby / partie après une déconnexion
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      if (roomCode) {
        socket.emit("join_game", roomCode, localStorage.getItem(SESSION_ID_KEY));
        restoreName(socket);
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
      socket.emit("create_game", localStorage.getItem(SESSION_ID_KEY));
      restoreName(socket);
    }
  }, [socket]);

  // Rejoindre une partie
  const joinGame = useCallback(
    (code: string) => {
      if (socket) {
        setRoomCode(code);
        socket.emit("join_game", code, localStorage.getItem(SESSION_ID_KEY));
        restoreName(socket);
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
        socket.emit("ready", !me.isReady);
      }
    }
  }, [socket, players]);

  // Quitter le lobby
  const quitLobby = useCallback(() => {
    if (socket) {
      socket.emit("quit_lobby");
    }
    setView("home");
    setRoomCode("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(ROOM_CODE_KEY);
    }
    setPlayers([]);
    setRules(null);
    setHistory([]);
    setDisplayOrder(null);
  }, [socket]);

  // Démarrer la partie
  const startGame = useCallback(() => {
    if (socket) {
      socket.emit("start_game", roomCode, threshold);
    }
  }, [socket, roomCode, threshold]);

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
        socket.emit("card_played", card);
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
    setView("lobby");
    if (socket) {
      socket.emit("return_to_lobby");
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

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";

// Définition des vues
type View = "home" | "lobby" | "game" | "results";

// Toutes les variables globales du jeu
interface GameContextType {
  // Connexion
  socket: Socket | null;
  isConnected: boolean;
  // Vue actuelle
  view: View;
  setView: (view: View) => void;
  // Partie
  roomCode: string;
  setRoomCode: (code: string) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  // Actions
  createGame: () => void;
  joinGame: (code: string) => void;
  changeName: (name: string) => void;
  beReady: () => void;
  quitLobby: () => void;
  startGame: () => void;
  // Règles
  rules: GameRules | null;
  setRules: (rules: GameRules | null) => void;
  // Joueur
  playerNumber: number;
  setPlayerNumber: (number: number) => void;
  // Hôte
  isHost: boolean;
  setIsHost: (isHost: boolean) => void;
  // Prêt
  isReady: boolean;
  setIsReady: (isReady: boolean) => void;
}

// Types pour les règles issues du serveur
export interface GameRules {
  symbolRules: Record<string, number>;
  colorRules: Record<string, string>;
}

// Types pour les joueurs
export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [view, setView] = useState<View>("home");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [rules, setRules] = useState<GameRules | null>(null);
  const [playerNumber, setPlayerNumber] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialisation de la connexion
    const newSocket = io("http://localhost:4000", {
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    // ----------------
    // Écouteurs de base (réponse du serveur)
    // ----------------

    // Connexion
    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Connecté au serveur ! ID:", newSocket.id);
    });

    // Erreurs de connexion
    newSocket.on("connect_error", (err) => {
      console.error("Erreur de connexion socket:", err);
    });

    // Déconnexion
    newSocket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("Socket déconnecté:", reason);
    });


    // ----------------
    // Écouteurs de jeu (réponse du serveur)
    // ----------------

    // Création d'un lobby
    newSocket.on("room_created", (code, rules, players, playerNumber, isHost) => {
      setRoomCode(code);
      setRules(rules);
      setPlayers(players);
      setPlayerNumber(playerNumber);
      setIsHost(isHost);
      setView("lobby");
    });

    // Rejoindre une partie
    newSocket.on("join_game_success", (code, rules, players, playerNumber) => {
      setRoomCode(code);
      setRules(rules);
      setPlayers(players);
      setPlayerNumber(playerNumber);
      setView("lobby");
    });

    // Erreurs de connexion
    newSocket.on("room_full", () => {
      alert("La partie est pleine !");
    });
    newSocket.on("room_not_found", () => {
      alert("Partie introuvable !");
    });

    // Mise à jour du lobby
    newSocket.on("room_updated", (room) => {
      setPlayers(room.players);
      // Update local isReady based on the new players list
      if (newSocket.id) {
        const me = room.players.find((p: Player) => p.id === newSocket.id);
        if (me) setIsReady(me.isReady);
      }
    });

    // Hôte quitte le lobby
    newSocket.on("host_quit_lobby", () => {
      setView("home");
      setRoomCode("");
      setPlayers([]);
      setRules(null);
      setPlayerNumber(0);
      setIsHost(false);
      setIsReady(false);
    });

    // Démarrage de la partie
    newSocket.on("game_started", () => {
      setView("game");
    });

    // Nettoyage automatique
    return () => {
      newSocket.disconnect();
    };
  }, []);


  // ----------------
  // Actions de jeu (envoi au serveur)
  // ----------------

  // Création d'une partie
  const createGame = useCallback(() => {
    if (socket) {
      socket.emit("create_game", socket.id);
    }
  }, [socket]);

  // Rejoindre une partie
  const joinGame = useCallback(
    (code: string) => {
      if (socket) {
        setRoomCode(code);
        socket.emit("join_game", code);
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
      // Toggle readiness
      socket.emit("ready", !isReady, socket.id);
    }
  }, [socket, isReady]);

  // Quitter le lobby
  const quitLobby = useCallback(() => {
    if (socket) {
      if (isHost) {
        socket.emit("host_quit_lobby", socket.id, view);
      } else {
        socket.emit("quit_lobby", socket.id);
      }
    }
    setView("home");
    setRoomCode("");
    setPlayers([]);
    setRules(null);
    setPlayerNumber(0);
    setIsHost(false);
    setIsReady(false);
  }, [socket, isHost, view]);

  // Démarrer la partie
  const startGame = useCallback(() => {
    if (socket) {
      socket.emit("start_game", socket.id);
    }
  }, [socket]);

  // ----------------
  // Valeurs du contexte
  // ----------------

  const value = useMemo(
    () => ({
      socket,
      view,
      setView,
      isConnected,
      roomCode,
      setRoomCode,
      players,
      setPlayers,
      createGame,
      joinGame,
      changeName,
      rules,
      setRules,
      playerNumber,
      setPlayerNumber,
      isHost,
      setIsHost,
      isReady,
      beReady,
      quitLobby,
      setIsReady,
      startGame,
    }),
    [
      socket,
      view,
      isConnected,
      roomCode,
      players,
      createGame,
      joinGame,
      changeName,
      rules,
      playerNumber,
      isHost,
      isReady,
      beReady,
      quitLobby,
      setIsReady,
      startGame,
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

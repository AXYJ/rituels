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
  playerNames: string[];
  setPlayerNames: (names: string[]) => void;
  // Actions
  createGame: () => void;
  joinGame: (code: string) => void;
  changeName: (name: string) => void;
  // Règles
  rules: GameRules | null;
  setRules: (rules: GameRules | null) => void;
  // Joueur
  playerNumber: number;
  setPlayerNumber: (number: number) => void;
}

// Types pour les règles issues du serveur
export interface GameRules {
  symbolRules: Record<string, number>;
  colorRules: Record<string, string>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [view, setView] = useState<View>("home");
  const [roomCode, setRoomCode] = useState("");
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [rules, setRules] = useState<GameRules | null>(null);
  const [playerNumber, setPlayerNumber] = useState(0);

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
    newSocket.on("room_created", (code, rules, players, playerNumber) => {
      setRoomCode(code);
      setRules(rules);
      setPlayerNames(players);
      setPlayerNumber(playerNumber);
      setView("lobby");
    });

    // Rejoindre une partie
    newSocket.on("join_game_success", (code, rules, players, playerNumber) => {
      setRoomCode(code);
      setRules(rules);
      setPlayerNames(players);
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
      setPlayerNames(room.players);
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
      playerNames,
      setPlayerNames,
      createGame,
      joinGame,
      changeName,
      rules,
      setRules,
      playerNumber,
      setPlayerNumber,
    }),
    [
      socket,
      view,
      isConnected,
      roomCode,
      playerNames,
      createGame,
      joinGame,
      changeName,
      rules,
      playerNumber,
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

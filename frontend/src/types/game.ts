import { Socket } from "socket.io-client";

// Définition des vues
export type View = "home" | "lobby" | "game" | "results";

// Toutes les variables globales du jeu
export interface GameContextType {
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
  cardPlayed: (card: { symbol: string; color: string }) => void;
  sendMessage: (message: string) => void;
  resetGame: () => void;
  // Règles
  rules: GameRules | null;
  setRules: (rules: GameRules | null) => void;
  // Joueur
  playerNumber: number;
  setPlayerNumber: (number: number) => void;
  // Carte
  card: { symbol: string; color: string } | null;
  setCard: (card: { symbol: string; color: string } | null) => void;
  // Modifier localement le deck du joueur
  setLocalPlayerDeck: (cards: { symbol: string; color: string }[]) => void;
  // Jeu
  playerTurn: string;
  setPlayerTurn: (playerTurn: string) => void;
  playerOrder: string[];
  setPlayerOrder: (playerOrder: string[]) => void;
  history: {
    type: "card" | "message";
    card?: { symbol: string; color: string };
    player: string;
    score?: number;
    points?: number;
    message?: string;
  }[];
  setHistory: (
    history: {
      type: "card" | "message";
      card?: { symbol: string; color: string };
      player: string;
      score?: number;
      points?: number;
      message?: string;
    }[]
  ) => void;
  lastEffect: string | null;
  setLastEffect: (lastEffect: string | null) => void;
  winner: string | null;
  setWinner: (winner: string | null) => void;
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
  deck: { cards: { symbol: string; color: string }[] | null };
  score: number;
}

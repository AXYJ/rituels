import { Socket } from "socket.io-client";

// Définition des vues
export type View = "home" | "lobby" | "game";

// Type pour une carte
export interface Card {
  id?: number;
  symbol: string;
  color: string;
}

// Type pour un élément d'historique
export interface HistoryItem {
  type: "card" | "message";
  card?: Card;
  player: string;
  score?: number;
  points?: number;
  message?: string;
}

// Toutes les variables globales du jeu
// Utilisation de variables globales pour éviter de passer des props à chaque composant
export interface GameContextType {
  // Connexion
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  setError: (error: string | null) => void;
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
  updateDeck: (deck: { cards: Card[] | null }) => void;
  cardPlayed: (card: Card) => void;
  sendMessage: (message: string) => void;
  resetGame: () => void;
  // Règles
  rules: GameRules | null;
  setRules: (rules: GameRules | null) => void;
  // Joueur
  playerNumber: number;
  setPlayerNumber: (number: number) => void;
  // Carte
  card: Card | null;
  setCard: (card: Card | null) => void;
  // Modifier localement le deck du joueur
  setLocalPlayerDeck: (cards: Card[]) => void;
  // Jeu
  playerTurn: string;
  setPlayerTurn: (playerTurn: string) => void;
  playerOrder: string[];
  setPlayerOrder: (playerOrder: string[]) => void;
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  lastEffect: string | null;
  setLastEffect: (lastEffect: string | null) => void;
  winner: string | null;
  setWinner: (winner: string | null) => void;
  displayOrder: string[] | null;
  setDisplayOrder: (displayOrder: string[] | null) => void;
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
  deck: { cards: Card[] | null };
  score: number;
}

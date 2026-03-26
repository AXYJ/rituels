import React from "react";
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
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
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
  setRules: React.Dispatch<React.SetStateAction<GameRules | null>>;
  // Joueur
  playerNumber: number;
  setPlayerNumber: (number: number) => void;
  // Modifier localement le deck du joueur
  setLocalPlayerDeck: (cards: Card[]) => void;
  // Jeu
  playerTurn: string;
  setPlayerTurn: React.Dispatch<React.SetStateAction<string>>;
  playerOrder: string[];
  setPlayerOrder: React.Dispatch<React.SetStateAction<string[]>>;
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  lastEffect: string | null;
  setLastEffect: React.Dispatch<React.SetStateAction<string | null>>;
  winner: string | null;
  setWinner: React.Dispatch<React.SetStateAction<string | null>>;
  displayOrder: string[] | null;
  setDisplayOrder: React.Dispatch<React.SetStateAction<string[] | null>>;
  // Volume
  volume: number;
  setVolume: (volume: number) => void;
  sfxVolume: number;
  setSfxVolume: (sfxVolume: number) => void;
  // Seuil
  threshold: number;
  setThreshold: (threshold: number) => void;
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

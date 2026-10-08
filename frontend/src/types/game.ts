import React from "react";
import { Socket } from "socket.io-client";

// Définition des vues
export type View = "home" | "lobby" | "game" | "mentions-legales" | "mentions-legales#credits";

// Type pour une carte
export interface Card {
  id?: string;
  symbol: string;
  color: string;
}

// Type pour un élément d'historique
export interface HistoryItem {
  type: "card" | "message";
  card?: Card;
  player: string;
  playerName?: string;
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
  noMorePlayers: boolean;
  setNoMorePlayers: React.Dispatch<React.SetStateAction<boolean>>;
  // Actions
  createGame: () => void;
  joinGame: (code: string) => void;
  changeName: (name: string) => void;
  beReady: () => void;
  quitLobby: () => void;
  startGame: () => void;
  cardPlayed: (card: Card) => void;
  sendMessage: (message: string) => void;
  resetGame: () => void;
  // Règles
  rules: GameRules | null;
  setRules: React.Dispatch<React.SetStateAction<GameRules | null>>;
  // Modifier localement le deck du joueur
  setLocalPlayerDeck: (cards: Card[]) => void;
  // Jeu
  playerTurn: string;
  setPlayerTurn: React.Dispatch<React.SetStateAction<string>>;
  playerOrder: string[];
  setPlayerOrder: React.Dispatch<React.SetStateAction<string[]>>;
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
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
  updateThreshold: (newThreshold: number) => void;
  // Propositions
  propositions: {
    symbolRules: Record<string, string>;
    colorRules: Record<string, string>;
  };
  setPropositions: React.Dispatch<
    React.SetStateAction<{
      symbolRules: Record<string, string>;
      colorRules: Record<string, string>;
    }>
  >;
}

// Types pour les règles issues du serveur
export interface GameRules {
  // Les valeurs restent null tant que la partie n'est pas terminée (secret du jeu)
  symbolRules: Record<string, number | null>;
  colorRules: Record<string, string | null>;
}

// Types pour les joueurs
export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  deck: { cards: Card[] | null };
  score: number;
  leavedPlayer: boolean;
  // Seulement connu pour le joueur local (jamais envoyé par le serveur pour les autres)
  sessionId?: string;
}

// Actions d'état passées aux handlers d'events socket
export interface SocketActions {
  setView: (view: View) => void;
  setError: (error: string | null) => void;
  setRoomCode: (code: string) => void;
  setRules: (rules: GameRules | null) => void;
  setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void;
  setThreshold: (threshold: number) => void;
  setHistory: (
    history: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])
  ) => void;
  setWinner: (winner: string | null) => void;
  setPlayerTurn: (turn: string) => void;
  setPlayerOrder: (order: string[]) => void;
  setDisplayOrder: (order: string[] | null) => void;
  setPropositions: React.Dispatch<
    React.SetStateAction<{
      symbolRules: Record<string, string>;
      colorRules: Record<string, string>;
    }>
  >;
  setIsConnected: (connected: boolean) => void;
  setNoMorePlayers: React.Dispatch<React.SetStateAction<boolean>>;
  sfxVolumeRef: React.RefObject<number>;
}

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

import { View, GameContextType, GameRules, Player } from "../types/game";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [view, setView] = useState<View>("home");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [rules, setRules] = useState<GameRules | null>(null);
  const [playerNumber, setPlayerNumber] = useState(0);
  const [card, setCard] = useState<{ symbol: string; color: string } | null>(
    null
  );
  const [playerTurn, setPlayerTurn] = useState("");
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [history, setHistory] = useState<
    {
      type: "card" | "message";
      card?: { symbol: string; color: string };
      player: string;
      score?: number;
      points?: number;
      message?: string;
    }[]
  >([]);
  const [lastEffect, setLastEffect] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

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
    newSocket.on("room_created", (code, rules, serverPlayers, playerNumber) => {
      setRoomCode(code);
      setRules(rules);
      setPlayers(
        serverPlayers.map((p: Player) => ({
          ...p,
          deck: { cards: null },
          score: 0,
        }))
      );
      setPlayerNumber(playerNumber);
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
      if (!room || !room.players) return;
      setPlayers((prevPlayers) => {
        return room.players.map((serverPlayer: Player) => {
          const localPlayer = prevPlayers.find((p) => p.id === serverPlayer.id);
          return {
            ...serverPlayer,
            deck: localPlayer?.deck || { cards: null },
            score: serverPlayer.score ?? localPlayer?.score ?? 0,
          };
        });
      });
    });

    // Hôte quitte le lobby
    newSocket.on("host_quit_lobby", () => {
      setView("home");
      setRoomCode("");
      setPlayers([]);
      setRules(null);
      setPlayerNumber(0);
      setHistory([]);
      setLastEffect(null);
    });

    // Démarrage de la partie
    newSocket.on("game_started", (playerStart, playerOrder) => {
      setView("game");
      setPlayerTurn(playerStart);
      setPlayerOrder(playerOrder);
    });

    // Carte jouée
    newSocket.on(
      "card_played",
      (card, idPlayer, newOrder, newScore, pointsGained, effectiveEffect) => {
        setHistory((prev) => [
          ...prev,
          {
            type: "card",
            card,
            player: idPlayer,
            score: newScore,
            points: pointsGained,
          },
        ]);
        setLastEffect(effectiveEffect);
        setPlayerTurn(newOrder[0]);
        setPlayerOrder(newOrder);
        setPlayers((prev) =>
          prev.map((p) => (p.id === idPlayer ? { ...p, score: newScore } : p))
        );
      }
    );

    // Message reçu
    newSocket.on("message_received", (idPlayer, message) => {
      setHistory((prev) => [
        ...prev,
        { type: "message", player: idPlayer, message },
      ]);
    });

    // Partie gagnée
    newSocket.on("game_won", (idPlayer) => {
      setWinner(idPlayer);
    });

    // Partie réinitialisée (Rejouer)
    newSocket.on("game_reset", (rules, players) => {
      setRules(rules);
      setPlayers(players);
      setHistory([]);
      setWinner(null);
      setLastEffect(null);
      setView("lobby");
    });

    // Nettoyage automatique
    return () => {
      newSocket.removeAllListeners();
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
      const me = players.find((p) => p.id === socket.id);
      if (me) {
        socket.emit("ready", !me.isReady, socket.id);
      }
    }
  }, [socket, players]);

  // Quitter le lobby
  const quitLobby = useCallback(() => {
    if (socket) {
      const isHost = players.find((p) => p.id === socket.id)?.isHost;
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
    setHistory([]);
    setLastEffect(null);
  }, [socket, players, view]);

  // Démarrer la partie
  const startGame = useCallback(() => {
    if (socket) {
      socket.emit("start_game", roomCode);
    }
  }, [socket, roomCode]);

  // Jouer une carte
  const cardPlayed = useCallback(
    (card: { symbol: string; color: string }) => {
      if (socket) {
        let points = 0;
        let effect = "";
        let effectiveEffect = "";

        if (rules) {
          points = rules.symbolRules[card.symbol] || 0;
          effect = rules.colorRules[card.color];
          effectiveEffect =
            effect === "Répétition" ? lastEffect || "Neutre" : effect;

          // Effets rémanents (qui s'appliquent au tour actuel à cause du joueur précédent)
          if (lastEffect === "Gel") {
            points = 0;
          }

          // Effets immédiats (qui modifient les points de la carte que je pose)
          switch (effectiveEffect) {
            case "Inversion":
              points *= -1;
              break;
            case "Gel":
              // N'altère pas mes points actuels, mais `effectiveEffect` sera enregistré pour le gel du prochain !
              break;
            case "Neutre":
            default:
              break;
          }
        }

        socket.emit("card_played", socket.id, points, card, effectiveEffect);
      }
    },
    [socket, rules, lastEffect]
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

  // Reset le jeu (demande au serveur)
  const resetGame = useCallback(() => {
    if (socket) {
      socket.emit("reset_game");
    }
  }, [socket]);

  const setLocalPlayerDeck = useCallback(
    (cards: { symbol: string; color: string }[]) => {
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
      beReady,
      quitLobby,
      startGame,
      card,
      setCard,
      playerTurn,
      setPlayerTurn,
      cardPlayed,
      playerOrder,
      setPlayerOrder,
      setLocalPlayerDeck,
      history,
      setHistory,
      lastEffect,
      setLastEffect,
      sendMessage,
      winner,
      setWinner,
      resetGame,
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
      beReady,
      quitLobby,
      startGame,
      card,
      setCard,
      playerTurn,
      setPlayerTurn,
      playerOrder,
      setPlayerOrder,
      setLocalPlayerDeck,
      history,
      setHistory,
      lastEffect,
      setLastEffect,
      sendMessage,
      winner,
      setWinner,
      resetGame,
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

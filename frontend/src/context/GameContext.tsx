"use client";

// Import des modules
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

// Import des types
import {
  View,
  GameContextType,
  GameRules,
  Player,
  Card,
  HistoryItem,
} from "../types/game";

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
  const [card, setCard] = useState<Card | null>(null);
  const [playerTurn, setPlayerTurn] = useState("");
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lastEffect, setLastEffect] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [displayOrder, setDisplayOrder] = useState<string[] | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [threshold, setThreshold] = useState(15);

  useEffect(() => {
    // Initialisation de la connexion
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    queueMicrotask(() => setSocket(newSocket));

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
      setError("Erreur de connexion serveur");
    });

    // Déconnexion
    newSocket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("Socket déconnecté:", reason);
      setView("home");
      setError("Vous avez été déconnecté du serveur.");
      setRoomCode("");
      setPlayers([]);
      setRules(null);
      setPlayerNumber(0);
      setHistory([]);
      setLastEffect(null);
      setDisplayOrder(null);
      setThreshold(15);
    });

    // ----------------
    // Écouteurs de jeu (réponse du serveur)
    // ----------------

    // Création d'un lobby
    newSocket.on("room_created", (code, rules, serverPlayers, playerNumber) => {
      setRoomCode(code);
      setRules(rules);
      // Initialisation de l'état des joueurs
      setPlayers(
        serverPlayers.map((p: Player) => ({
          ...p,
          deck: p.deck ?? { cards: null },
          score: p.score ?? 0,
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
      setError("La partie est pleine !");
    });
    newSocket.on("room_not_found", () => {
      setError("Partie introuvable !");
    });
    newSocket.on("game_already_started", () => {
      setError("La partie a déjà commencé !");
    });

    // Mise à jour du lobby
    newSocket.on("room_updated", (room) => {
      if (!room || !room.players) return;
      // Récupère les informations des joueurs
      setPlayers((prevPlayers) => {
        return room.players.map((serverPlayer: Player) => {
          // Check chaque joueur
          const localPlayer = prevPlayers.find((p) => p.id === serverPlayer.id);
          return {
            // Met à jour les informations du joueur
            ...serverPlayer,
            deck: serverPlayer.deck ?? localPlayer?.deck ?? { cards: null },
            score: serverPlayer.score ?? localPlayer?.score ?? 0,
          };
        });
      });
    });

    // Démarrage de la partie
    newSocket.on("game_started", (playerStart, playerOrder) => {
      setView("game");
      setPlayerTurn(playerStart);
      setPlayerOrder(playerOrder);
      const myOrder = playerOrder.findIndex((p: string) => p === newSocket.id);

      let newDisplayOrder: string[] = [];
      if (myOrder !== -1) {
        newDisplayOrder = [
          ...playerOrder.slice(myOrder),
          ...playerOrder.slice(0, myOrder),
        ];
      } else {
        newDisplayOrder = [...playerOrder];
      }

      setDisplayOrder(newDisplayOrder);
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
        // Met à jour le score du joueur
        if (sfxVolume > 0) {
          const sound = new Audio("/sfx/flipcard.mp3");
          sound.volume = sfxVolume;
          sound.play().catch((e) => console.error("Erreur lecture audio :", e));
        }
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
      if (sfxVolume > 0) {
        const sound = new Audio("/sfx/notification.mp3");
        sound.volume = sfxVolume;
        sound.play().catch((e) => console.error("Erreur lecture audio :", e));
      }
    });

    // Partie gagnée
    newSocket.on("game_won", (idPlayer) => {
      setWinner(idPlayer);
    });

    // Mise à jour du tour de jeu (ex: déconnexion)
    newSocket.on("turn_updated", (newOrder) => {
      setPlayerTurn(newOrder[0]);
      setPlayerOrder(newOrder);
    });

    // Partie réinitialisée (Rejouer)
    newSocket.on("game_reset", (rules, players) => {
      setRules(rules);
      setPlayers(players);
      setHistory([]);
      setWinner(null);
      setLastEffect(null);
      setDisplayOrder(null);
      setThreshold(15);
      setView("lobby");
    });

    newSocket.on("deck_updated", (idPlayer, deck) => {
      // Ignorer ses propres mises à jour pour éviter de sur-écrire l'état local optimiste
      if (idPlayer === newSocket.id) return;

      setPlayers((prev) =>
        prev.map((p) => (p.id === idPlayer ? { ...p, deck } : p))
      );
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
      socket.emit("quit_lobby", socket.id);
    }
    setView("home");
    setRoomCode("");
    setPlayers([]);
    setRules(null);
    setPlayerNumber(0);
    setHistory([]);
    setLastEffect(null);
    setDisplayOrder(null);
    setThreshold(15);
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

  // Jouer une carte
  const cardPlayed = useCallback(
    (card: Card) => {
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
              // N'altère pas mes points actuels, mais `effectiveEffect` sera enregistré pour le gel du prochain tour !
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

  // Reset le jeu
  const resetGame = useCallback(() => {
    if (socket) {
      socket.emit("reset_game");
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

  // Permet d'éviter de re-render tout les composants à chaque fois si pas de modifications des valeurs ci-dessous
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
      displayOrder,
      setDisplayOrder,
      resetGame,
      updateDeck,
      volume,
      setVolume,
      sfxVolume,
      setSfxVolume,
      threshold,
      setThreshold,
    }),
    [
      socket,
      view,
      isConnected,
      error,
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
      displayOrder,
      setDisplayOrder,
      resetGame,
      updateDeck,
      volume,
      setVolume,
      sfxVolume,
      setSfxVolume,
      threshold,
      setThreshold,
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

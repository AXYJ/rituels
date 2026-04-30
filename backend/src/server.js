import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { 
    generateRules, 
    whoStart, 
    getNextPlayerOrder, 
    checkWin,
    calculateCardPoints,
    createCard,
    moderatePseudo,
    moderateMessage
} from "./gameLogic.js";

// Initialisation
const app = express();
app.use(cors());

// Route de base pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
    res.send("Rituels Server is running");
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000", 
            "http://127.0.0.1:3000",
            process.env.NEXT_PUBLIC_SOCKET_URL // Permet d'ajouter l'URL Vercel via les variables d'env Render
        ].filter(Boolean),
        methods: ["GET", "POST"],
        credentials: true
    },
    pingInterval: 25000,
    pingTimeout: 60000
});

// Stockage des parties
// Clé: roomCode, Valeur: { players, rules, threshold, history, playerOrder }
const rooms = {};

// ----------------
// Gestion des connexions
// ----------------

io.on("connection", (socket) => {

    // ----------------
    // ----- HOME -----
    // ----------------

    // Création d'une partie
    socket.on("create_game", (idPlayer) => {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        rooms[roomCode] = {
            players: [{ 
                id: idPlayer, 
                name: "Host", 
                sessionId: idPlayer, 
                isHost: true, 
                isReady: false, 
                score: 0, 
                deck: { cards: null },
                leavedPlayer: false
            }],
            threshold: 15,
            history: []
        };
        socket.join(roomCode);
        const rules = generateRules();
        rooms[roomCode].rules = rules;
        
        const room = rooms[roomCode];
        socket.emit("room_created", roomCode, rules, room.players, room.players.length, room.threshold);
    });

    // Rejoindre une partie
    socket.on("join_game", (roomCode, sessionId) => {
        if (!rooms[roomCode]) {
            socket.emit("room_not_found");
            return;
        }

        const room = rooms[roomCode];
        const existingPlayer = room.players.find(p => p.sessionId === sessionId);

        if (existingPlayer) {
            const oldId = existingPlayer.id;
            existingPlayer.id = socket.id;
            existingPlayer.leavedPlayer = false;
            socket.join(roomCode);
            
            if (room.playerOrder) {
                room.playerOrder = room.playerOrder.map(id => id === oldId ? socket.id : id);
            }
            
            socket.emit("reconnected", {
                roomCode,
                rules: room.rules,
                players: room.players,
                playerNumber: room.players.length,
                threshold: room.threshold,
                playerOrder: room.playerOrder,
                playerTurn: room.playerOrder ? room.playerOrder[0] : null,
                history: room.history || []
                
            });
            
            io.to(roomCode).emit("room_updated", { 
                players: room.players,
                playerOrder: room.playerOrder
            });
        } else if(room.playerOrder && room.playerOrder.length > 0) {
            socket.emit("game_already_started");
        } else if (room.players.length < 4) {
            console.log("New player joining");
            const player = { 
                id: socket.id, 
                name: "Sujet #" + (room.players.length + 1), 
                sessionId, 
                isHost: false, 
                isReady: false, 
                score: 0, 
                deck: { cards: null },
                leavedPlayer: false
            };
            room.players.push(player);
            socket.join(roomCode);
            
            io.to(roomCode).emit("room_updated", { players: room.players });
            socket.emit("join_game_success", roomCode, room.rules, room.players, room.players.length, room.threshold);
        } else {
            socket.emit("room_full");
        }
    });


    // -----------------
    // ----- LOBBY -----
    // -----------------

    // Changement du nom
    socket.on("change_name", async (name) => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                const status = await moderatePseudo(name);
                if (status === "NON") {
                    socket.emit("name_rejected");
                } else {
                    player.name = name;
                    io.to(code).emit("room_updated", { players: room.players });
                }
                break;
            }
        }
    });

    // Prêt
    socket.on("ready", (isReady, idPlayer) => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === idPlayer);
            if (player) {
                player.isReady = isReady;
                io.to(code).emit("room_updated", { players: room.players });
                break;
            }
        }
    });

    // Mise à jour du seuil de victoire
    socket.on("update_threshold", (newThreshold) => {
        for (const code in rooms) {
            const room = rooms[code];
            const host = room.players.find(p => p.id === socket.id && p.isHost);
            if (host) {
                room.threshold = Math.min(Math.max(newThreshold, 5), 30);
                io.to(code).emit("threshold_updated", room.threshold);
                break;
            }
        }
    });

    // Gestion du départ d'un joueur
    const handlePlayerLeave = (idPlayer) => {
        for (const code in rooms) {
            const room = rooms[code];
            const playerIndex = room.players.findIndex(p => p.id === idPlayer);
            
            if (playerIndex !== -1) {
                const player = room.players[playerIndex];
                socket.leave(code);
                player.leavedPlayer = true;

                const activePlayers = room.players.filter(p => !p.leavedPlayer);
                
                if (activePlayers.length === 0) {
                    delete rooms[code];
                } else {
                    if (player.isHost) {
                        player.isHost = false;
                        activePlayers[0].isHost = true;
                    }
                    
                    io.to(code).emit("room_updated", { 
                        players: room.players,
                        playerOrder: room.playerOrder
                    });

                    if (room.playerOrder && room.playerOrder[0] === idPlayer) {
                        room.playerOrder = getNextPlayerOrder(room.playerOrder, room.players);
                        io.to(code).emit("turn_updated", room.playerOrder);
                    }
                }
                break;
            }
        }
    };

    // Quitter le lobby
    socket.on("quit_lobby", (idPlayer) => {
        handlePlayerLeave(idPlayer);
    });

    // Démarrer la partie
    socket.on("start_game", (roomCode, threshold) => {
        const room = rooms[roomCode];
        if (room && room.players.find(p => p.id === socket.id && p.isHost)) {
            room.playerOrder = whoStart(room.players);
            room.players.forEach(p => {
                p.score = 0;
                // Génération sécurisée du deck initial (3 cartes)
                p.deck = { 
                    cards: [
                        createCard(room.rules),
                        createCard(room.rules),
                        createCard(room.rules)
                    ]
                };
            });
            room.threshold = threshold;
            room.history = [];
            room.lastEffect = null;
            io.to(roomCode).emit("game_started", room.playerOrder[0], room.playerOrder, room.rules, room.players);
        }
    });

    // ----------------
    // ----- GAME -----
    // ----------------

    // Mise à jour du deck (pour la synchronisation visuelle)
    socket.on("update_deck", (idPlayer, deck) => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === idPlayer);
            if (player) {
                player.deck = deck;
                io.to(code).emit("deck_updated", idPlayer, player.deck);
                break;
            }
        }
    });

    // Carte jouée
    socket.on("card_played", (idPlayer, card) => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === idPlayer);
            if (player) {
                const { points, effectiveEffect } = calculateCardPoints(card, room.rules, room.lastEffect);
                const isWin = checkWin(player, points, room.threshold);

               
                
                room.playerOrder = getNextPlayerOrder(room.playerOrder, room.players);
                
                const historyItem = {
                    type: "card",
                    card,
                    player: idPlayer,
                    score: player.score,
                    points: points,
                    effectiveEffect
                };
                room.history.push(historyItem);
                
                if (isWin) {
                   // Ensure the score is updated with the winning points if checkWin modifies player object we just use player.score but since checkWin modifies it indeed
                   return io.to(code).emit("game_won", player.id, player.score);
                }

                room.lastEffect = effectiveEffect;
                room.currentCard = card;

                const newCard = createCard(room.rules);
                // Retirer la carte jouée du deck sur le serveur
                if (player.deck.cards) {
                    player.deck.cards = player.deck.cards.filter(c => c.id !== card.id);
                }
                player.deck.cards.push(newCard);
                
                io.to(code).emit("card_played", card, idPlayer, room.playerOrder, player.score, points, newCard);

                
                break;
            }
        }
    });

    // Message chat
    socket.on("send_message", async (message) => {
        for (const code in rooms) {
            const player = rooms[code].players.find(p => p.id === socket.id);
            if (player) {
                const status = await moderateMessage(message);
                if (status === "OK") {
                    const historyItem = { type: "message", player: player.name, message };
                    rooms[code].history.push(historyItem);
                    io.to(code).emit("message_received", player.name, message);
                } else {
                    const historyItem = { type: "message", player: player.name, message: status };
                    rooms[code].history.push(historyItem);
                    io.to(code).emit("message_received", player.name, status);
                }
                break;
            }
        }
    });

    // Rejouer la partie
    socket.on("reset_game", (triggerId) => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                room.rules = generateRules();
                delete room.playerOrder;
                room.threshold = 15;
                room.history = [];
                room.lastEffect = null;

                room.players.forEach(p => {
                    p.score = 0;
                    p.isReady = p.isHost;
                    p.deck = { cards: null };
                });

                io.to(code).emit("game_reset", room.rules, room.players, triggerId);
                break;
            }
        }
    });

    // Déconnexion
    socket.on("disconnect", (reason) => {
        handlePlayerLeave(socket.id);
        console.log(`[${new Date().toISOString()}] User disconnected: ${socket.id} (Reason: ${reason})`);
    });
});

// ----------------
// Démarrage du serveur
// ----------------

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

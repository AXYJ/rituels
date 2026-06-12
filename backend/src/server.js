import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { getNextPlayerOrder } from "./gameLogic.js";

// Handlers
import { registerRoomHandlers } from "./handlers/roomHandlers.js";
import { registerGameHandlers, checkAndResetGame } from "./handlers/gameHandlers.js";
import { registerChatHandlers } from "./handlers/chatHandlers.js";

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
            process.env.NEXT_PUBLIC_SOCKET_URL
        ].filter(Boolean),
        methods: ["GET", "POST"],
        credentials: true
    },
    pingInterval: 25000,
    pingTimeout: 60000
});

// Stockage des parties
// Clé: roomCode, Valeur: { players, rules, threshold, history, playerOrder, lastEffect }
const rooms = {};

// ----------------
// Gestion des connexions
// ----------------

io.on("connection", (socket) => {
    console.log(`[${new Date().toISOString()}] User connected: ${socket.id}`);

    // Gestion du départ d'un joueur (partagée car utilisée par quit_lobby et disconnect)
    const handlePlayerLeave = (idPlayer) => {
        for (const code in rooms) {
            const room = rooms[code];
            const playerIndex = room.players.findIndex(p => p.id === idPlayer);
            
            if (playerIndex !== -1) {
                const player = room.players[playerIndex];
                socket.leave(code);
                
                const isGameStarted = room.playerOrder && room.playerOrder.length > 0;

                if (!isGameStarted) {
                    // Si la partie n'a pas commencé, on retire complètement le joueur
                    room.players.splice(playerIndex, 1);
                } else {
                    // Si elle a commencé, on le marque simplement comme déconnecté
                    player.leavedPlayer = true;
                }

                const activePlayers = room.players.filter(p => !p.leavedPlayer);
                
                if (room.players.length === 0 || (isGameStarted && activePlayers.length <= 1)) {
                    io.to(code).emit("no_more_players");
                    if (room.players.length === 0) {
                        delete rooms[code];
                    }
                } else {
                    if (player.isHost) {
                        player.isHost = false;
                        if (isGameStarted) {
                            activePlayers[0].isHost = true;
                        } else {
                            room.players[0].isHost = true;
                        }
                    }
                    
                    io.to(code).emit("room_updated", { 
                        players: room.players,
                        playerOrder: room.playerOrder
                    });

                    if (isGameStarted && room.playerOrder && room.playerOrder[0] === idPlayer) {
                        room.playerOrder = getNextPlayerOrder(room.playerOrder, room.players);
                        io.to(code).emit("turn_updated", room.playerOrder);
                    }

                    if (room.isGameOver) {
                        checkAndResetGame(code, rooms, io);
                    }
                }
                break;
            }
        }
    };

    // Enregistrement des handlers segmentés
    registerRoomHandlers(io, socket, rooms);
    registerGameHandlers(io, socket, rooms);
    registerChatHandlers(io, socket, rooms);

    // Handler spécifique au départ
    socket.on("quit_lobby", (idPlayer) => {
        handlePlayerLeave(idPlayer);
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

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { getNextPlayerOrder } from "./gameLogic.js";

// Handlers
import { registerRoomHandlers } from "./handlers/roomHandlers.js";
import { registerGameHandlers } from "./handlers/gameHandlers.js";
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
                player.leavedPlayer = true;

                const activePlayers = room.players.filter(p => !p.leavedPlayer);
                
                if (activePlayers.length <= 1) {
                    io.to(code).emit("room_deleted");
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

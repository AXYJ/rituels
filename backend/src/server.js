import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Handlers
import { registerRoomHandlers, handlePlayerLeave } from "./handlers/roomHandlers.js";
import { registerGameHandlers } from "./handlers/gameHandlers.js";
import { registerChatHandlers } from "./handlers/chatHandlers.js";

// Initialisation
const app = express();
app.use(cors());

// Backend : ne doit pas être indexé par les moteurs de recherche
app.use((req, res, next) => {
    res.set("X-Robots-Tag", "noindex, nofollow");
    next();
});

// Route de base pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
    res.send("Rituels Server is running");
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(",") ?? [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://rituels.xiao-web.com"
        ],
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["polling", "websocket"],
    pingInterval: 25000,
    pingTimeout: 60000
});

// Stockage des parties
// Clé: roomCode, Valeur: { players, rules, threshold, history, playerOrder, lastEffect }
// Sans prototype : un code comme "constructor" ne doit pas être pris pour une salle
const rooms = Object.create(null);

// ----------------
// Gestion des connexions
// ----------------

io.on("connection", (socket) => {
    console.log(`[${new Date().toISOString()}] User connected: ${socket.id}`);

    // Enregistrement des handlers segmentés
    registerRoomHandlers(io, socket, rooms);
    registerGameHandlers(io, socket, rooms);
    registerChatHandlers(io, socket, rooms);

    // Déconnexion
    socket.on("disconnect", (reason) => {
        handlePlayerLeave(io, socket, rooms);
        console.log(`[${new Date().toISOString()}] User disconnected: ${socket.id} (Reason: ${reason})`);
    });
});

// ----------------
// Démarrage du serveur
// ----------------

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

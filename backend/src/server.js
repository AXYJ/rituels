import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

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
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Stockage des parties
const rooms = {};


// ----------------
// Génération des règles aléatoires pour une nouvelle partie
// ----------------

function generateRules() {
    const symbols = ["Symbol1", "Symbol2", "Symbol3", "Symbol4", "Symbol5"];
    const colors = ["Color1", "Color2", "Color3", "Color4", "Color5"];

    // Algorithme de Fisher-Yates pour un mélange parfait
    // Algorithme permettant de mélanger un tableau de manière aléatoire avec probabilité égale pour chaque élément
    // Algorithme généré par IA
    // Pour chaque élément, on l'échange avec un élément choisi aléatoirement parmi les éléments restants
    // https://fr.wikipedia.org/wiki/Mélange_de_Fisher-Yates
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const values = shuffle([-2, -1, 0, 1, 2]);
    const symbolRules = {};
    symbols.forEach((sym, i) => {
        symbolRules[sym] = values[i];
    });

    const effects = shuffle(["Double", "Inversion", "Blocage", "Saut", "Neutre"]);
    const colorRules = {};
    colors.forEach((col, i) => {
        colorRules[col] = effects[i];
    });

    return { symbolRules, colorRules };
}


// ----------------
// Gestion des connexions
// ----------------

io.on("connection", (socket) => {

    // Création d'une partie
    socket.on("create_game", (idPlayer) => {
        // Algorithme de génération d'un code de salle aléatoire
        // Algorithme généré par IA
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        rooms[roomCode] = {
            players: [{ id: idPlayer, name: "Host", isHost: true, isReady: false }]
        };
        socket.join(roomCode);
        const rules = generateRules();
        rooms[roomCode].rules = rules;
        const playerNumber = rooms[roomCode].players.length;
        const players = rooms[roomCode].players;
        const isHost = rooms[roomCode].players[0].isHost;
        socket.emit("room_created", roomCode, rules, players, playerNumber, isHost);
    });

    // Rejoindre une partie
    socket.on("join_game", (roomCode) => {
        if (rooms[roomCode]) {
            if (rooms[roomCode].players.length < 4) {
                rooms[roomCode].players.push({ id: socket.id, name: "Player", isHost: false, isReady: false });
                socket.join(roomCode);
                const players = rooms[roomCode].players;
                io.to(roomCode).emit("room_updated", { players: players });
                const playerNumber = rooms[roomCode].players.length;
                socket.emit("join_game_success", roomCode, rooms[roomCode].rules, players, playerNumber);
            } else {
                socket.emit("room_full");
            }
        } else {
            socket.emit("room_not_found");
        }
    });

    // Changement du nom
    socket.on("change_name", (name) => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                player.name = name;
                const players = room.players;
                io.to(code).emit("room_updated", { players: players });
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
                const players = room.players;
                io.to(code).emit("room_updated", { players: players });
                break;
            }
        }
    });

    // Quitter le lobby
    socket.on("quit_lobby", (idPlayer) => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === idPlayer);
            if (player) {
                room.players = room.players.filter(p => p.id !== idPlayer);
                const players = room.players;
                if (room.players.length === 0) {
                    delete rooms[code];
                }
                io.to(code).emit("room_updated", { players: players });
                break;
            }

        }
    });

    // Hôte quitte le lobby
    socket.on("host_quit_lobby", (idPlayer, view) => {
        for (const code in rooms) {
            const room = rooms[code];
            const host = room.players.find(p => p.id === idPlayer && p.isHost);

            if (host) {
                if (view === "lobby") {
                    io.to(code).emit("host_quit_lobby");
                }

                setTimeout(() => {
                    delete rooms[code];
                }, 500);

                break;
            }
        }
    });

    // Démarrer la partie
    socket.on("start_game", (idPlayer) => {
        for (const code in rooms) {
            const room = rooms[code];
            const host = room.players.find(p => p.id === idPlayer && p.isHost);

            if (host) {
                io.to(code).emit("game_started", room.rules, room.players);
                break;
            }
        }
    });

    // Déconnexion
    socket.on("disconnect", (reason) => {
        console.log(`[${new Date().toISOString()}] User disconnected: ${socket.id} (Reason: ${reason})`);
    });
});


// ----------------
// Démarrage du serveur
// ----------------

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

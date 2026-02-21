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

function generateRules() {
    const symbols = ["circle", "cross", "square", "triangle", "wave"];
    const colors = ["red", "blue", "green", "yellow", "pink"];

    const values = shuffle([3, 2, 1, 0, -1]);
    const symbolRules = {};
    symbols.forEach((sym, i) => {
        symbolRules[sym] = values[i];
    });

    const effects = shuffle(["Inversion", "Gel", "Répétition", "Neutre", "Neutre"]);
    const colorRules = {};
    colors.forEach((col, i) => {
        colorRules[col] = effects[i];
    });

    return { symbolRules, colorRules };
}

function whoStart(roomCode) {
    const room = rooms[roomCode];
    const playerOrder = shuffle([...room.players]).map(p => p.id);
    room.playerOrder = playerOrder;
    return playerOrder;
}

function nextPlayer(roomCode) {
    const room = rooms[roomCode];
    const playerOrder = room.playerOrder;
    if (playerOrder && playerOrder.length > 0) {
        const pId = playerOrder.shift();
        playerOrder.push(pId);
    }
    return playerOrder;
}

function win(player, points) {
    player.score += points;
    if (player.score >= 20) {
        return true;
    }
    return false;
}


// ----------------
// Gestion des connexions
// ----------------

io.on("connection", (socket) => {

    // ------- 
    // Home
    // ------- 

    // Création d'une partie
    socket.on("create_game", (idPlayer) => {
        // Algorithme de génération d'un code de salle aléatoire
        // Algorithme généré par IA
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        rooms[roomCode] = {
            players: [{ id: idPlayer, name: "Host", isHost: true, isReady: false, score: 0 }]
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
                rooms[roomCode].players.push({ id: socket.id, name: "Player", isHost: false, isReady: false, score: 0 });
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


    // ------- 
    // Lobby
    // ------- 

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
    socket.on("start_game", (roomCode) => {
        for (const code in rooms) {
            if (code !== roomCode) continue;
            const room = rooms[code];
            const host = room.players.find(p => p.id === socket.id && p.isHost);

            if (host) {
                const playerOrder = whoStart(roomCode);
                const playerTurn = playerOrder[0];
                room.players.forEach(player => player.score = 0);
                io.to(code).emit("game_started", playerTurn, playerOrder);
                break;
            }
        }
    });

    // -------
    // Game
    // -------

    // Carte jouée
    socket.on("card_played", (idPlayer, points, card, effectiveEffect) => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === idPlayer);
            if (player) {
                const isWin = win(player, points);
                const newOrder = nextPlayer(code);
                io.to(code).emit("card_played", card, idPlayer, newOrder, player.score, points, effectiveEffect);

                if (isWin) {
                    io.to(code).emit("game_won", player.id);
                }
                break;
            }
        }
    });

    // Message
    socket.on("send_message", (message) => {
        for (const code in rooms) {
            const player = rooms[code].players.find(p => p.id === socket.id);
            if (player) {
                io.to(code).emit("message_received", socket.id, message);
                break;
            }
        }
    });

    // Rejouer la partie
    socket.on("reset_game", () => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                // Générer de nouvelles règles (ou garder les mêmes, mais relancer est drôle avec des nouvelles !)
                room.rules = generateRules();

                // Remise à zéro des joueurs
                room.players.forEach(p => {
                    p.score = 0;
                    if(p.isHost){
                        p.isReady = true;
                    } else {
                        p.isReady = false;
                    }
                    p.deck = { cards: null };
                });

                // On met à jour tout le monde !
                io.to(code).emit("game_reset", room.rules, room.players);
                break;
            }
        }
    });

    // Déconnexion
    socket.on("disconnect", (reason) => {
        for (const code in rooms) {
            const room = rooms[code];
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                if (player.isHost) {
                    io.to(code).emit("host_quit_lobby");
                    delete rooms[code];
                } else {
                    room.players = room.players.filter(p => p.id !== socket.id);
                    if (room.players.length === 0) {
                        delete rooms[code];
                    } else {
                        io.to(code).emit("room_updated", { players: room.players });
                    }
                }
                break;
            }
        }
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

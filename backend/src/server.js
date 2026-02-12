import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Initialize Express and Socket.io
const app = express();
app.use(cors());

// Add a simple route to fix 404 errors and confirm server status
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

// Game state storage
const rooms = {};

// Helper: Generate randomized rules for a new game
function generateRules() {
    const symbols = ["Symbol1", "Symbol2", "Symbol3", "Symbol4", "Symbol5"];
    const colors = ["Color1", "Color2", "Color3", "Color4", "Color5"]; // Client will map these to visuals

    // Values: -2, -1, 0, 1, 2 shuffled
    const values = [-2, -1, 0, 1, 2].sort(() => Math.random() - 0.5);
    const symbolRules = {};
    symbols.forEach((sym, i) => {
        symbolRules[sym] = values[i];
    });

    // Effects: Double, Inversion, Blocage, Saut, Neutre shuffled
    const effects = ["Double", "Inversion", "Blocage", "Saut", "Neutre"].sort(() => Math.random() - 0.5);
    const colorRules = {};
    colors.forEach((col, i) => {
        colorRules[col] = effects[i];
    });

    // We send these maps to the client so it knows what "Symbol1" or "Color1" does
    return { symbolRules, colorRules };
}

io.on("connection", (socket) => {
    console.log(`[${new Date().toISOString()}] User connected: ${socket.id}`);

    // Implémenter fonctionnalités du jeu

    socket.on("disconnect", (reason) => {
        console.log(`[${new Date().toISOString()}] User disconnected: ${socket.id} (Reason: ${reason})`);
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

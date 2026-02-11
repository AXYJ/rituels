import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let game = {
    roomID: "",
    players: [],
    rules: [],
    scores: [],
}

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    // socket.on("join_room", (roomID) => {join_room(socket, roomID)} );
    // socket.on("start_game", (roomID) => {start_game(socket, roomID)} );
    // socket.on("play_card", (roomID) => {play_card(socket, roomID)} );
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
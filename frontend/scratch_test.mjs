import { io } from "socket.io-client";

const URL = "http://localhost:4000";

const socket1 = io(URL);
const socket2 = io(URL);

let roomCode = "";

socket1.on("connect", () => {
  console.log("Socket 1 connected");
socket1.emit("create_game", socket1.id, "session1");
});

socket1.on("room_created", (code) => {
  console.log("Room created:", code);
  roomCode = code;
  socket2.emit("join_game", code, "session2");
});

socket2.on("connect", () => {
  console.log("Socket 2 connected");
});

let nameChanged = false;
let playersCount = 0;
socket1.on("room_updated", (data) => {
    playersCount = data.players.length;
    console.log("Room updated for socket 1. Players:", data.players.map(p => p.name));
    if (playersCount === 2 && !nameChanged) {
        nameChanged = true;
        console.log("Both players joined. Changing name...");
        socket1.emit("change_name", "TestName123");
    } else if (nameChanged) {
        console.log("Name changed to:", data.players.map(p => p.name));
        process.exit(0);
    }
});



setTimeout(() => {
    console.log("Timeout! Did not receive no_more_players.");
    process.exit(1);
}, 5000);

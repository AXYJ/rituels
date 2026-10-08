import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { io } from "socket.io-client";
import { slidingWindow } from "./rateLimit.js";

test("slidingWindow refuse au-delà du maximum puis réautorise quand la fenêtre est passée", async () => {
  const take = slidingWindow(2, 50);
  assert.deepEqual([take(), take(), take()], [true, true, false]);
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(take(), true);
});

const PORT = 4998;
let server;
const clients = [];

before(async () => {
  server = spawn(process.execPath, ["src/server.js"], {
    env: { ...process.env, PORT: String(PORT), GROQ_API_KEY: "" },
    stdio: "pipe",
  });
  await new Promise((resolve) => server.stdout.on("data", (d) => String(d).includes("running") && resolve()));
});

after(() => {
  clients.forEach((c) => c.disconnect());
  server.kill();
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function joinedRoom() {
  const socket = io(`http://localhost:${PORT}`);
  socket.received = [];
  socket.onAny((event, ...args) => socket.received.push({ event, args }));
  clients.push(socket);
  await new Promise((resolve) => socket.on("connect", resolve));
  socket.emit("create_game", `S-${socket.id}`);
  await wait(200);
  return socket;
}

const count = (socket, event) => socket.received.filter((m) => m.event === event).length;

test("au-delà de 5 changements de pseudo par minute, le serveur répond name_rate_limited", async () => {
  const socket = await joinedRoom();
  for (let i = 1; i <= 7; i++) socket.emit("change_name", `Nom${i}`);
  await wait(400);
  // 5 acceptés (room_updated), les 2 suivants limités
  assert.equal(count(socket, "name_rate_limited"), 2);
});

test("un pseudo trop long est refusé sans compter dans le budget", async () => {
  const socket = await joinedRoom();
  socket.emit("change_name", "UnPseudoBeaucoupTropLong");
  await wait(200);
  assert.equal(count(socket, "name_rejected"), 1);
  assert.equal(count(socket, "name_rate_limited"), 0);
});

test("le chat ne perd aucun message en rafale normale, mais ignore un flood", async () => {
  const socket = await joinedRoom();
  for (let i = 0; i < 8; i++) socket.emit("send_message", `msg ${i}`);
  await wait(400);
  assert.equal(count(socket, "message_received"), 8);

  for (let i = 0; i < 30; i++) socket.emit("send_message", `flood ${i}`);
  await wait(600);
  // 10 messages maximum par seconde : 8 déjà envoyés, donc 2 de plus seulement
  assert.equal(count(socket, "message_received"), 10);
});

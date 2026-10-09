import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { slidingWindow } from "../src/rateLimit.js";
import { startTestServer, lobby, wait, settle } from "./helpers.js";

test("slidingWindow refuse au-delà du maximum puis réautorise quand la fenêtre est passée", async () => {
  const take = slidingWindow(2, 50);
  assert.deepEqual([take(), take(), take()], [true, true, false]);
  await wait(60);
  assert.equal(take(), true);
});

let server;
before(async () => (server = await startTestServer()));
after(() => server.stop());

test("au-delà de 5 changements de pseudo par minute, le serveur répond name_rate_limited", async () => {
  const { players: [socket] } = await lobby(server, 1);
  for (let i = 1; i <= 7; i++) socket.emit("change_name", `Nom${i}`);
  await settle();
  assert.equal(socket.count("name_rate_limited"), 2);
});

test("un pseudo trop long est refusé sans compter dans le budget", async () => {
  const { players: [socket] } = await lobby(server, 1);
  socket.emit("change_name", "UnPseudoBeaucoupTropLong");
  await settle();
  assert.equal(socket.count("name_rejected"), 1);
  assert.equal(socket.count("name_rate_limited"), 0);
});

test("le chat ne perd aucun message en rafale normale, mais ignore un flood", async () => {
  const { players: [socket] } = await lobby(server, 1);
  for (let i = 0; i < 8; i++) socket.emit("send_message", `msg ${i}`);
  await settle();
  assert.equal(socket.count("message_received"), 8);

  for (let i = 0; i < 30; i++) socket.emit("send_message", `flood ${i}`);
  await settle();
  // 10 messages maximum par seconde : 8 déjà envoyés, donc 2 de plus seulement
  assert.equal(socket.count("message_received"), 10);
});

test("création de salles : 3 par minute et par connexion, plafond global", async () => {
  const limited = await startTestServer({ MAX_ROOMS: "100" });
  try {
    const client = await limited.connect();
    for (let i = 0; i < 4; i++) {
      client.emit("create_game", `session-${i}`);
      await settle();
      client.emit("quit_lobby");
      await settle();
    }
    assert.equal(client.count("room_created"), 3);
    assert.equal(client.count("server_busy"), 1);
  } finally {
    limited.stop();
  }

  const capped = await startTestServer({ MAX_ROOMS: "2" });
  try {
    const clients = [await capped.connect(), await capped.connect(), await capped.connect()];
    for (const [i, client] of clients.entries()) client.emit("create_game", `session-${i}`);
    await settle();
    assert.equal(clients.filter((c) => c.count("room_created") === 1).length, 2);
    assert.equal(clients.filter((c) => c.count("server_busy") === 1).length, 1);
  } finally {
    capped.stop();
  }
});

test("historique : seuls les derniers messages du chat sont gardés, les cartes restent", async () => {
  const small = await startTestServer({ MAX_CHAT_HISTORY: "3" });
  try {
    const { code, players: [host, guest], sessions } = await lobby(small, 2);
    guest.emit("ready", true);
    host.emit("start_game", code);
    await settle();
    for (let i = 1; i <= 5; i++) host.emit("send_message", `message ${i}`);
    await settle();
    const back = await small.connect();
    back.emit("join_game", code, sessions[1]);
    await settle();
    const messages = back.last("reconnected").args[0].history.filter((h) => h.type === "message");
    assert.deepEqual(messages.map((m) => m.message), ["message 3", "message 4", "message 5"]);
  } finally {
    small.stop();
  }
});

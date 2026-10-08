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

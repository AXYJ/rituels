import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { io } from "socket.io-client";

const PORT = 4999;
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

// Client qui garde tous les messages reçus
function connect() {
  const socket = io(`http://localhost:${PORT}`);
  socket.received = [];
  socket.onAny((event, ...args) => socket.received.push({ event, args }));
  clients.push(socket);
  return new Promise((resolve) => socket.on("connect", () => resolve(socket)));
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const lastOf = (socket, event) => socket.received.findLast((m) => m.event === event);

test("un joueur ne reçoit ni les règles, ni les cartes, ni le sessionId des autres", async () => {
  const host = await connect();
  const guest = await connect();

  host.emit("create_game", "SESSION-HOST");
  await wait(200);
  const code = lastOf(host, "room_created").args[0];
  guest.emit("join_game", code, "SESSION-GUEST");
  await wait(200);
  host.emit("ready", true);
  host.emit("start_game", code, 15);
  await wait(300);

  // Règles masquées dans tous les messages de la partie
  const started = lastOf(guest, "game_started");
  const [, , rules, players] = started.args;
  assert.ok(Object.values(rules.symbolRules).every((v) => v === null));
  assert.ok(Object.values(rules.colorRules).every((v) => v === null));

  // Les autres joueurs : pas de sessionId, cartes cachées ; soi-même : tout
  const hostSeenByGuest = players.find((p) => p.isHost);
  const guestSeenByGuest = players.find((p) => !p.isHost);
  assert.equal(hostSeenByGuest.sessionId, undefined);
  assert.ok(hostSeenByGuest.deck.cards.every((c) => c.symbol === "" && c.color === ""));
  assert.equal(guestSeenByGuest.sessionId, "SESSION-GUEST");
  assert.ok(guestSeenByGuest.deck.cards.every((c) => c.symbol && c.color));

  // Aucun message reçu par l'invité ne contient le sessionId de l'hôte
  assert.ok(!JSON.stringify(guest.received).includes("SESSION-HOST"));
});

test("la carte piochée n'est visible que par son propriétaire", async () => {
  const host = await connect();
  const guest = await connect();
  host.emit("create_game", "S1");
  await wait(200);
  const code = lastOf(host, "room_created").args[0];
  guest.emit("join_game", code, "S2");
  await wait(200);
  host.emit("ready", true);
  host.emit("start_game", code, 15);
  await wait(300);

  const [first, order, , players] = lastOf(host, "game_started").args;
  const [player, other] = first === host.id ? [host, guest] : [guest, host];
  const myCards = players.find((p) => p.id === player.id).deck.cards;
  player.emit("card_played", myCards[0]);
  await wait(300);

  const mine = lastOf(player, "card_played").args[6];
  const theirs = lastOf(other, "card_played").args[6];
  assert.ok(mine.symbol && mine.color);
  assert.equal(theirs.symbol, "");
  assert.equal(theirs.color, "");
  assert.equal(theirs.id, mine.id);
  assert.equal(order.length, 2);
});

test("les règles complètes sont révélées à la fin de la partie", async () => {
  const host = await connect();
  const guest = await connect();
  host.emit("create_game", "S3");
  await wait(200);
  const code = lastOf(host, "room_created").args[0];
  guest.emit("join_game", code, "S4");
  await wait(200);
  host.emit("ready", true);
  host.emit("update_threshold", 5);
  await wait(100);
  host.emit("start_game", code, 5);
  await wait(300);

  const [first, , , players] = lastOf(host, "game_started").args;
  const sockets = { [host.id]: host, [guest.id]: guest };
  const hands = {};
  for (const [id, socket] of Object.entries(sockets)) {
    const seen = lastOf(socket, "game_started").args[3];
    hands[id] = [...seen.find((p) => p.id === id).deck.cards];
  }
  assert.equal(players.length, 2);

  // On joue chacun son tour jusqu'à ce que quelqu'un atteigne le quota
  let turn = first;
  for (let i = 0; i < 200 && !lastOf(host, "game_won"); i++) {
    const card = hands[turn].shift();
    sockets[turn].emit("card_played", card);
    await wait(40);
    const played = lastOf(sockets[turn], "card_played");
    if (played && played.args[1] === turn && played.args[6]) {
      const drawn = played.args[6];
      if (drawn.symbol) hands[turn].push(drawn);
    }
    turn = turn === host.id ? guest.id : host.id;
  }

  const won = lastOf(guest, "game_won");
  assert.ok(won, "la partie doit se terminer");
  const finalRules = won.args[2];
  assert.ok(Object.values(finalRules.symbolRules).every((v) => typeof v === "number"));
  assert.ok(Object.values(finalRules.colorRules).every((v) => typeof v === "string"));
});

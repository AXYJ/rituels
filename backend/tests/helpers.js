// Outils communs aux tests d'intégration : un vrai serveur lancé en processus fils et de vrais clients socket.io
import { spawn } from "node:child_process";
import net from "node:net";
import { fileURLToPath } from "node:url";
import { io } from "socket.io-client";

const BACKEND_DIR = fileURLToPath(new URL("../", import.meta.url));

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Laisse le temps aux messages de circuler entre le serveur et les clients
export const settle = () => wait(200);

function getFreePort() {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.listen(0, () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

/** Lance le serveur sur un port libre (sans clé Groq : modération désactivée) */
export async function startTestServer() {
  const port = await getFreePort();
  const child = spawn(process.execPath, ["src/server.js"], {
    cwd: BACKEND_DIR,
    env: { ...process.env, PORT: String(port), GROQ_API_KEY: "" },
    stdio: "pipe",
  });
  await new Promise((resolve) =>
    child.stdout.on("data", (data) => String(data).includes("running") && resolve())
  );

  const clients = [];

  /** Nouveau client connecté ; garde tous les messages reçus dans `received` */
  async function connect() {
    const socket = io(`http://localhost:${port}`, { forceNew: true });
    socket.received = [];
    socket.onAny((event, ...args) => socket.received.push({ event, args }));
    socket.last = (event) => socket.received.findLast((m) => m.event === event);
    socket.count = (event) => socket.received.filter((m) => m.event === event).length;
    socket.clear = () => (socket.received.length = 0);
    clients.push(socket);
    await new Promise((resolve) => socket.on("connect", resolve));
    return socket;
  }

  return {
    port,
    connect,
    stop() {
      clients.forEach((client) => client.disconnect());
      child.kill();
    },
  };
}

/** Salle dans le lobby avec `playerCount` joueurs (le premier est l'hôte) */
export async function lobby(server, playerCount = 2) {
  const players = [];
  for (let i = 0; i < playerCount; i++) players.push(await server.connect());
  const sessions = players.map((_, i) => `session-${i}-${Math.random().toString(36).slice(2)}`);

  players[0].emit("create_game", sessions[0]);
  await settle();
  const code = players[0].last("room_created").args[0];
  for (let i = 1; i < playerCount; i++) {
    players[i].emit("join_game", code, sessions[i]);
    await settle();
  }
  return { code, players, sessions };
}

/** Partie lancée avec `playerCount` joueurs : mains, ordre et premier joueur sont connus du test */
export async function startedGame(server, playerCount = 2) {
  const room = await lobby(server, playerCount);
  const [host] = room.players;
  host.emit("start_game", room.code, 15);
  await settle();

  const [first, order] = host.last("game_started").args;
  const byId = Object.fromEntries(room.players.map((p) => [p.id, p]));
  const hands = Object.fromEntries(
    room.players.map((p) => {
      const seen = p.last("game_started").args[3];
      return [p.id, [...seen.find((x) => x.id === p.id).deck.cards]];
    })
  );
  return { ...room, first, order, byId, hands };
}

/** Joue chacun son tour jusqu'à ce qu'un joueur atteigne le quota (minimum 5 points) */
export async function playUntilWin(game, maxTurns = 300) {
  const [host] = game.players;
  host.emit("update_threshold", 5);
  for (let i = 0; i < maxTurns && !host.last("game_won"); i++) {
    const turn = game.order[i % game.order.length];
    const socket = game.byId[turn];
    socket.emit("card_played", game.hands[turn].shift());
    await wait(40);
    const played = socket.last("card_played");
    const drawn = played && played.args[1] === turn ? played.args[6] : null;
    if (drawn?.symbol) game.hands[turn].push(drawn);
  }
  await settle();
}

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, lobby, startedGame, playUntilWin, settle } from "./helpers.js";

let server;
before(async () => (server = await startTestServer()));
after(() => server.stop());

const hostsOf = (event) => event.args[0].players.filter((p) => p.isHost);

test("lobby : l'hôte qui part transmet son rôle, la salle vide est supprimée", async () => {
  const { code, players: [host, guest] } = await lobby(server, 2);

  host.emit("quit_lobby");
  await settle();
  const update = guest.last("room_updated");
  assert.equal(update.args[0].players.length, 1);
  assert.equal(hostsOf(update).length, 1);
  assert.equal(hostsOf(update)[0].id, guest.id);

  guest.emit("quit_lobby");
  await settle();
  const late = await server.connect();
  late.emit("join_game", code, "late");
  await settle();
  assert.equal(late.count("room_not_found"), 1);
});

test("limites : salle pleine, partie commencée, salle inconnue", async () => {
  const { code, players } = await lobby(server, 4);
  const fifth = await server.connect();
  fifth.emit("join_game", code, "fifth");
  await settle();
  assert.equal(fifth.count("room_full"), 1);

  players[0].emit("start_game", code, 15);
  await settle();
  const late = await server.connect();
  late.emit("join_game", code, "late");
  await settle();
  assert.equal(late.count("game_already_started"), 1);

  late.emit("join_game", "ZZZZZZ", "late");
  await settle();
  assert.equal(late.count("room_not_found"), 1);
});

test("quota : modifiable par l'hôte au lobby, ignoré en partie", async () => {
  const { code, players: [host, guest] } = await lobby(server, 2);
  guest.emit("update_threshold", 7);
  host.emit("update_threshold", 7);
  await settle();
  assert.equal(host.count("threshold_updated"), 1);

  host.emit("start_game", code, 7);
  await settle();
  host.emit("update_threshold", 5);
  await settle();
  assert.equal(host.count("threshold_updated"), 1);
});

test("règles d'accès : pas de partie lancée par un invité, pas de carte hors tour ni inventée", async () => {
  const { code, players: [host, guest] } = await lobby(server, 2);
  guest.emit("start_game", code, 15);
  await settle();
  assert.equal(host.count("game_started"), 0);

  const game = await startedGame(server, 2);
  const current = game.byId[game.first];
  const waiting = game.players.find((p) => p !== current);

  waiting.emit("card_played", game.hands[waiting.id][0]);
  current.emit("card_played", { id: "inventée", symbol: "cercle", color: "rouge" });
  await settle();
  assert.equal(current.count("card_played"), 0);

  current.emit("card_played", game.hands[current.id][0]);
  await settle();
  assert.equal(current.count("card_played"), 1);
});

test("en partie : le joueur dont c'est le tour part, le tour passe au suivant", async () => {
  const game = await startedGame(server, 3);
  const leaver = game.byId[game.first];
  const stay = game.players.find((p) => p !== leaver);

  leaver.disconnect();
  await settle();

  const turn = stay.last("turn_updated").args[0];
  assert.notEqual(turn[0], game.first);
  const update = stay.last("room_updated").args[0];
  assert.equal(update.players.find((p) => p.id === game.first).leavedPlayer, true);
});

test("en partie : l'hôte qui part transmet son rôle à un joueur actif", async () => {
  const game = await startedGame(server, 3);
  const [host, , other] = game.players;

  host.disconnect();
  await settle();

  const update = other.last("room_updated");
  assert.equal(hostsOf(update).length, 1);
  assert.notEqual(hostsOf(update)[0].id, host.id);
});

test("en partie : no_more_players une seule fois, même avec quit_lobby puis disconnect", async () => {
  const game = await startedGame(server, 2);
  const [host, guest] = game.players;

  guest.emit("quit_lobby");
  guest.disconnect();
  await settle();

  assert.equal(host.count("no_more_players"), 1);
});

test("reconnexion : même sessionId retrouve sa place, un inconnu est refusé", async () => {
  const game = await startedGame(server, 3);
  const [, , third] = game.players;

  third.disconnect();
  await settle();

  const back = await server.connect();
  back.emit("join_game", game.code, game.sessions[2]);
  await settle();
  const state = back.last("reconnected").args[0];
  assert.equal(state.roomCode, game.code);
  assert.equal(typeof state.playerTurn, "string");
  assert.ok(Array.isArray(state.history));
  const me = state.players.find((p) => p.id === back.id);
  assert.ok(me.deck.cards.every((c) => c.symbol && c.color));
  assert.ok(Object.values(state.rules.symbolRules).every((v) => v === null));

  const stranger = await server.connect();
  stranger.emit("join_game", game.code, "inconnu");
  await settle();
  assert.equal(stranger.count("game_already_started"), 1);
});

test("fin de partie : retour au lobby, nouvelles règles masquées, nouvelle partie possible", async () => {
  const game = await startedGame(server, 2, 5);
  const [host, guest] = game.players;
  await playUntilWin(game);

  host.emit("return_to_lobby");
  guest.emit("return_to_lobby");
  await settle();

  const [rules, players] = guest.last("game_reset").args;
  assert.ok(Object.values(rules.symbolRules).every((v) => v === null));
  assert.ok(players.every((p) => p.deck.cards === null));

  host.clear();
  host.emit("start_game", game.code, 15);
  await settle();
  assert.equal(host.count("game_started"), 1);
});

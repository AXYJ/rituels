import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, lobby, startedGame, playUntilWin, settle } from "./helpers.js";

let server;
before(async () => (server = await startTestServer()));
after(() => server.stop());

test("un joueur ne reçoit ni les règles, ni les cartes, ni le sessionId des autres", async () => {
  const { code, players: [host, guest], sessions } = await lobby(server, 2);
  host.emit("start_game", code, 15);
  await settle();

  // Règles masquées dans tous les messages de la partie
  const [, , rules, players] = guest.last("game_started").args;
  assert.ok(Object.values(rules.symbolRules).every((v) => v === null));
  assert.ok(Object.values(rules.colorRules).every((v) => v === null));

  // Les autres joueurs : pas de sessionId, cartes cachées ; soi-même : tout
  const hostSeenByGuest = players.find((p) => p.isHost);
  const guestSeenByGuest = players.find((p) => !p.isHost);
  assert.equal(hostSeenByGuest.sessionId, undefined);
  assert.ok(hostSeenByGuest.deck.cards.every((c) => c.symbol === "" && c.color === ""));
  assert.equal(guestSeenByGuest.sessionId, sessions[1]);
  assert.ok(guestSeenByGuest.deck.cards.every((c) => c.symbol && c.color));

  // Aucun message reçu par l'invité ne contient le sessionId de l'hôte
  assert.ok(!JSON.stringify(guest.received).includes(sessions[0]));
});

test("la carte piochée n'est visible que par son propriétaire", async () => {
  const game = await startedGame(server, 2);
  const player = game.byId[game.first];
  const other = game.players.find((p) => p !== player);

  player.emit("card_played", game.hands[game.first][0]);
  await settle();

  const mine = player.last("card_played").args[6];
  const theirs = other.last("card_played").args[6];
  assert.ok(mine.symbol && mine.color);
  assert.equal(theirs.symbol, "");
  assert.equal(theirs.color, "");
  assert.equal(theirs.id, mine.id);
});

test("les règles complètes sont révélées à la fin de la partie", async () => {
  const game = await startedGame(server, 2);
  await playUntilWin(game);

  const won = game.players[1].last("game_won");
  assert.ok(won, "la partie doit se terminer");
  const finalRules = won.args[2];
  assert.ok(Object.values(finalRules.symbolRules).every((v) => typeof v === "number"));
  assert.ok(Object.values(finalRules.colorRules).every((v) => typeof v === "string"));
});

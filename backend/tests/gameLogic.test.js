import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateCardPoints, getNextPlayerOrder } from "../src/gameLogic.js";

const rules = {
  symbolRules: { cercle: 3, croix: 2 },
  colorRules: { rouge: "Inversion", bleu: "Gel", vert: "Répétition", rose: "Neutre" },
};

test("Inversion inverse les points", () => {
  assert.deepEqual(calculateCardPoints({ symbol: "cercle", color: "rouge" }, rules, null), {
    points: -3,
    effectiveEffect: "Inversion",
  });
});

test("Gel du tour précédent met les points à 0", () => {
  assert.equal(calculateCardPoints({ symbol: "cercle", color: "rose" }, rules, "Gel").points, 0);
});

test("Répétition reprend l'effet réellement appliqué au tour précédent", () => {
  const r = calculateCardPoints({ symbol: "croix", color: "vert" }, rules, "Inversion");
  assert.deepEqual(r, { points: -2, effectiveEffect: "Inversion" });
});

test("getNextPlayerOrder saute les joueurs partis", () => {
  const players = [{ id: "a" }, { id: "b", leavedPlayer: true }, { id: "c" }];
  assert.deepEqual(getNextPlayerOrder(["a", "b", "c"], players), ["c", "a", "b"]);
});

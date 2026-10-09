import { beforeEach, expect, test, vi } from "vitest";
import type { Socket } from "socket.io-client";

import { listen, restoreName, rotateOrder } from "../src/utils/socketHelpers";
import { PLAYER_NAME_KEY } from "../src/utils/storageKeys";

beforeEach(() => localStorage.clear());

test("rotateOrder met le joueur local en premier en gardant l'ordre circulaire", () => {
  expect(rotateOrder(["a", "b", "c", "d"], "c")).toEqual(["c", "d", "a", "b"]);
  expect(rotateOrder(["a", "b"], "a")).toEqual(["a", "b"]);
});

test("rotateOrder renvoie null si le joueur n'est pas dans l'ordre", () => {
  expect(rotateOrder(["a", "b"], "z")).toBeNull();
  expect(rotateOrder(["a", "b"], undefined)).toBeNull();
});

test("restoreName renvoie le pseudo mémorisé, et rien sinon", () => {
  const emit = vi.fn();
  const socket = { emit } as unknown as Socket;

  restoreName(socket);
  expect(emit).not.toHaveBeenCalled();

  localStorage.setItem(PLAYER_NAME_KEY, "Alex");
  restoreName(socket);
  expect(emit).toHaveBeenCalledWith("change_name", "Alex");
});

test("listen abonne chaque event et renvoie la fonction de désabonnement", () => {
  const on = vi.fn();
  const off = vi.fn();
  const socket = { on, off } as unknown as Socket;
  const handler = vi.fn();

  const stop = listen(socket, { room_full: handler });
  expect(on).toHaveBeenCalledWith("room_full", handler);

  stop();
  expect(off).toHaveBeenCalledWith("room_full", handler);
});

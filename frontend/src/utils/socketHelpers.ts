import { RefObject } from "react";
import { Socket } from "socket.io-client";
import { PLAYER_NAME_KEY } from "./storageKeys";

/** Remet l'ordre d'affichage avec le joueur local en premier */
export function rotateOrder(order: string[], myId: string | undefined): string[] | null {
  const myIndex = order.findIndex((id) => id === myId);
  if (myIndex === -1) return null;
  return [...order.slice(myIndex), ...order.slice(0, myIndex)];
}

/** Joue un effet sonore si le volume des effets n'est pas coupé */
export function playSfx(name: string, volumeRef: RefObject<number>) {
  if (volumeRef.current <= 0) return;
  const sound = new Audio(`/sfx/${name}.mp3`);
  sound.volume = volumeRef.current;
  sound.play().catch((e) => console.error("Erreur lecture audio :", e));
}

/** Renvoie au serveur le pseudo mémorisé localement */
export function restoreName(socket: Socket) {
  const savedName = localStorage.getItem(PLAYER_NAME_KEY);
  if (savedName) socket.emit("change_name", savedName);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (...args: any[]) => void;

/** Abonne le socket à plusieurs events et renvoie la fonction de désabonnement correspondante */
export function listen(socket: Socket, handlers: Record<string, Handler>) {
  Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));
  return () =>
    Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
}

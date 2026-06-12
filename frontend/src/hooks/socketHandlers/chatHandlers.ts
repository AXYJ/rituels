import { Socket } from "socket.io-client";
import { HistoryItem } from "../../types/game";
import { RefObject } from "react";

export const registerChatHandlers = (
  socket: Socket,
  setHistory: (
    history: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])
  ) => void,
  sfxVolumeRef: RefObject<number>
) => {
  socket.on(
    "message_received",
    (idPlayer: string, playerName: string, message: string) => {
      setHistory((prev) => [
        ...prev,
        { type: "message", player: idPlayer, playerName, message },
      ]);
    if (sfxVolumeRef.current > 0) {
      const sound = new Audio("/sfx/notification.mp3");
      sound.volume = sfxVolumeRef.current;
      sound.play().catch((e) => console.error("Erreur lecture audio :", e));
    }
  });
};

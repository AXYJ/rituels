import { Socket } from "socket.io-client";
import { HistoryItem } from "../../types/game";
import { MutableRefObject } from "react";

export const registerChatHandlers = (
  socket: Socket,
  setHistory: (
    history: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])
  ) => void,
  sfxVolumeRef: MutableRefObject<number>
) => {
  socket.on("message_received", (idPlayer: string, message: string) => {
    setHistory((prev) => [
      ...prev,
      { type: "message", player: idPlayer, message },
    ]);
    if (sfxVolumeRef.current > 0) {
      const sound = new Audio("/sfx/notification.mp3");
      sound.volume = sfxVolumeRef.current;
      sound.play().catch((e) => console.error("Erreur lecture audio :", e));
    }
  });
};

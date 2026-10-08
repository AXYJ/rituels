import { Socket } from "socket.io-client";
import { SocketActions } from "../../types/game";
import { listen, playSfx } from "../../utils/socketHelpers";

export const registerChatHandlers = (
  socket: Socket,
  { setHistory, sfxVolumeRef }: SocketActions
) =>
  listen(socket, {
    message_received: (idPlayer: string, playerName: string, message: string) => {
      setHistory((prev) => [
        ...prev,
        { type: "message", player: idPlayer, playerName, message },
      ]);
      playSfx("notification", sfxVolumeRef);
    },
  });

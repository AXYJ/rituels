import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (url) => {
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialisation de la connexion Socket.io
        const socket = io(url || "http://localhost:4000", {
            transports: ["websocket", "polling"],
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        // Nettoyage à la déconnexion
        return () => {
            socket.disconnect();
        };
    }, [url]);

    return socketRef;
};

export default useSocket;

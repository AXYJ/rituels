"use client";

// Importations des modules
import { useGame } from "../../context/GameContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Importations des composants
import PlayerNameInput from "../lobby/PlayerNameInput";

export default function Lobby() {
  // Appel du contexte
  const { players, roomCode, beReady, quitLobby, startGame, socket } =
    useGame();

  const me = players.find((p) => p.id === socket?.id);
  const isHost = me?.isHost || false;
  const isReady = me?.isReady || false;

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleReady = () => {
    beReady();
  };

  const handleQuit = () => {
    quitLobby();
  };

  const onGameStart = () => {
    startGame();
  };

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center">
      <h1 className="mb-8 flex items-center gap-4 text-2xl">
        Code de la partie : {roomCode}{" "}
        <button
          onClick={handleCopyCode}
          className="text-md rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Copier
        </button>
      </h1>

      {players.length > 0 && (
        <div className="mb-4 w-[40vw] overflow-y-auto text-center">
          <ul className="flex flex-col gap-4">
            {players.map((player, index) => (
              <li
                className={`h-10 w-full rounded-full py-2 ${player.isReady ? "bg-green-200" : "bg-amber-100"
                  }`}
                key={index}
              >
                {player.name} {player.isReady ? "(Prêt)" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mb-4">En attente de joueurs...</p>
      <PlayerNameInput />

      <div className="flex gap-4">
        {isHost && (
          <button
            onClick={onGameStart}
            disabled={players.filter((p) => p.isHost || p.isReady).length !== players.length || players.length === 1}
            className={`rounded-full bg-green-500 px-6 py-2 font-bold text-white transition-colors duration-200 ease-in-out hover:bg-green-600 ${players.filter((p) => p.isHost || p.isReady).length === players.length ? "" : "cursor-not-allowed opacity-50"} ${players.length === 1 ? "cursor-not-allowed opacity-50" : ""}`}
          >
            Start Game ({players.filter((p) => p.isHost || p.isReady).length}/{players.length})
          </button>
        )}
        {!isHost && (
          <button
            onClick={handleReady}
            className="rounded-full bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600"
          >
            {isReady ? "Annuler" : "Prêt"}
          </button>
        )}
        <button
          onClick={handleQuit}
          className="rounded-full bg-red-500 px-6 py-2 font-bold text-white transition-colors duration-200 ease-in-out hover:bg-red-600"
        >
          Retour
        </button>
      </div>

      <AnimatePresence>
        {copySuccess && (
          <motion.div
            key="copy-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded bg-green-500 px-4 py-2 text-white"
          >
            Code copié !
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

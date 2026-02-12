"use client";

// Modules
import { useGame } from "../../context/GameContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import PlayerNameInput from "../lobby/PlayerNameInput";

export default function Lobby() {
  // Appel du contexte
  const { setView, playerNames, roomCode } = useGame();

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <h1 className="mb-8 flex items-center gap-4 text-2xl">
        Code de la partie : {roomCode}{" "}
        <button
          onClick={handleCopyCode}
          className="text-md rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Copier
        </button>
      </h1>

      {playerNames.length > 0 && (
        <div className="mb-4 h-[20vh] w-[40vw] overflow-y-auto text-center">
          <ul>
            {playerNames.map((player, index) => (
              <li
                className="h-10 w-full rounded-full bg-amber-100 py-2"
                key={index}
              >
                {player}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mb-4">En attente de joueurs...</p>
      <PlayerNameInput />

      <div className="flex gap-4">
        <button
          // onClick={onGameStart}
          className="rounded-full bg-green-500 px-6 py-2 font-bold text-white hover:bg-green-600"
        >
          Start Game (Debug)
        </button>
        <button
          onClick={() => setView("home")}
          className="rounded-full bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600"
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
    </div>
  );
}

"use client";

// Importations des modules
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";

export default function Home() {
  // Appel du contexte
  const { createGame, joinGame } = useGame();

  // Gestion des états
  const [inputCode, setInputCode] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  // ----------------
  // Gestion des événements
  // ----------------

  // Création d'une partie
  const startGame = () => {
    setBtnDisabled(true);
    createGame();
  };

  // Rejoindre une partie
  const handleJoinGame = () => {
    if (inputCode.trim()) {
      joinGame(inputCode);
    }
  };

  return (
    // Animation au chargement
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8">
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "backInOut",
          }}
        >
          <h1 className="mb-4 text-6xl font-bold text-blue-400">Rituels</h1>
          <p className="text-xl text-gray-400">Le jeu de cartes mystique</p>
        </motion.div>

        <motion.div
          className="launch-btn flex flex-col gap-6 sm:flex-row"
          initial={{
            y: 200,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 200,
            opacity: 0,
          }}
          transition={{
            duration: 1,
            ease: "backInOut",
            staggerChildren: 0.2,
          }}
        >
          <button
            onClick={startGame}
            disabled={btnDisabled}
            className={`rounded-full bg-blue-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-blue-700 ${btnDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            Créer une partie
          </button>
          <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-purple-500 bg-transparent px-10 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-purple-500/20">
            <input
              type="text"
              placeholder="Code de la partie"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="w-full rounded p-2 text-center text-black"
            />
            <button
              onClick={handleJoinGame}
              className="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Rejoindre
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

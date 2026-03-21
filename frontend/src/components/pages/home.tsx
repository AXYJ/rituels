"use client";

// Importations des modules
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";
import Image from "next/image";

// Importations des composants
import Logo from "../logo";

export default function Home() {
  // Appel du contexte
  const { createGame, joinGame, error, setError } = useGame();

  // Gestion des états
  const [inputCode, setInputCode] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  // ----------------
  // Gestion des événements
  // ----------------

  // Création d'une partie
  const startGame = () => {
    setError(null);
    setBtnDisabled(true);
    createGame();
  };

  // Rejoindre une partie
  const handleJoinGame = () => {
    if (inputCode.trim()) {
      setError(null);
      joinGame(inputCode);
    }
  };

  return (
    // Animation au chargement
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <AnimatePresence>
        <motion.div
          key="title"
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
          <Logo />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-10 flex items-center gap-4 rounded-md bg-red px-8 py-4 text-2xl font-bold text-white shadow-lg z-50"
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </motion.div>
        )}

        <motion.div
          key="actions"
          className="launch-btn flex w-8/10 max-w-[1024px] flex-col items-center gap-12"
          initial={{
            y: 20,
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
            className={`relative w-1/2 cursor-pointer px-12 py-4 rounded-3xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black`}
          >
            <Image
              src="/assets/button-long.png"
              alt=""
              width={800}
              height={100}
              className="object-fill pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
            />
            <span className="relative z-50 text-4xl text-black">
              Créer une nouvelle partie
            </span>
          </button>
          <div className="items-between flex w-1/2 gap-4 text-white">
            <div className="need-border relative w-full">
              <input
                type="text"
                placeholder="Code de la partie"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="relative z-20 w-full bg-transparent p-2 px-6 py-4 text-4xl text-white outline-none"
              />
            </div>
            <button
              onClick={handleJoinGame}
              className="relative w-fit cursor-pointer px-6 py-4 rounded-3xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black"
            >
              <Image
                src="/assets/button-short.png"
                alt=""
                width={300}
                height={100}
                className="object-fill pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
              />
              <span className="relative z-50 text-4xl text-nowrap text-black">
                Entrez le code
              </span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

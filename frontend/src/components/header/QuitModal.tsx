"use client";

import { useGame } from "../../context/GameContext";
import { motion } from "framer-motion";
import Image from "next/image";

export default function QuitModal({
  setQuitGame,
}: {
  setQuitGame: (quitGame: boolean) => void;
}) {
  const { quitLobby } = useGame();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="rounded bg-white p-4">
        <h2>Cette action vous fera quitter la partie</h2>
        <p>Êtes-vous sûr de vouloir quitter ?</p>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-full cursor-pointer rounded-full px-6 py-2 text-white shadow-black transition-shadow duration-300 hover:shadow-lg"
            onClick={() => {
              quitLobby();
              setQuitGame(false);
            }}
          >
            <Image
              src="/assets/button-mid-border.png"
              alt="quit"
              width={20}
              height={20}
              className="absolute inset-0 z-0 h-full w-full object-contain select-none"
            />
            <span className="relative z-10">Quitter</span>
          </motion.button>
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-full cursor-pointer rounded-full px-6 py-2 text-white shadow-black transition-shadow duration-300 hover:shadow-lg"
            onClick={() => setQuitGame(false)}
          >
            <Image
              src="/assets/button-mid-border.png"
              alt="quit"
              width={20}
              height={20}
              className="absolute inset-0 z-0 h-full w-full object-contain select-none"
            />
            Annuler
          </motion.button>
        </div>
      </div>
    </div>
  );
}

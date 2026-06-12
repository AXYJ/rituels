"use client";

// Import des modules
import { motion } from "framer-motion";
import Image from "next/image";

// Import du contexte
import { useGame } from "../../context/GameContext";

export default function QuitModal({ onClose }: { onClose: () => void }) {
  const { quitLobby } = useGame();
  return (
    <div className="fixed top-0 left-0 z-60 flex h-full w-full justify-center overflow-y-auto bg-black/80 lg:overflow-hidden">
      <div className="flex h-full w-full items-center">
        <div className="mx-auto flex w-full max-w-[1024px] flex-col items-center justify-center overflow-y-auto rounded-lg p-6 lg:justify-center lg:gap-8 lg:overflow-hidden">
          <h2 className="mb-8 text-center">
            Voulez-vous vraiment quitter la partie ?
          </h2>
          <div className="flex w-4/5 gap-18">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-full cursor-pointer rounded-full px-6 py-2 text-white shadow-black transition-shadow duration-300 hover:shadow-lg"
              onClick={onClose}
            >
              <Image
                src="/assets/button-long-white.png"
                alt="quit"
                width={800}
                height={100}
                className="absolute inset-0 z-0 h-full w-full object-contain select-none"
              />
              <span className="relative z-10 text-2xl text-black">Annuler</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-full cursor-pointer rounded-full px-6 py-2 text-white shadow-black transition-shadow duration-300 hover:shadow-lg"
              onClick={() => {
                quitLobby();
                onClose();
              }}
            >
              <Image
                src="/assets/button-long-red.png"
                alt="quit"
                width={800}
                height={100}
                className="absolute inset-0 z-0 h-full w-full object-contain select-none"
              />
              <span className="relative z-10 text-2xl">Quitter</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

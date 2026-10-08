"use client";

// Import des modules
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Import du contexte
import { useGame } from "../../context/GameContext";

// Import des composants
import Logo from "../Logo";
import ErrorToast from "../ErrorToast";
import RulesModal from "../game/RulesModal";
import RoomCode from "../lobby/RoomCode";
import ThresholdPicker from "../lobby/ThresholdPicker";
import PlayerRow, { EmptySlot } from "../lobby/PlayerRow";
import LobbyActions from "../lobby/LobbyActions";
import { frameVariants, itemVariants } from "../lobby/variants";
import { MAX_PLAYERS } from "../../utils/gameConstants";

export default function Lobby() {
  const [showRules, setShowRules] = useState(false);
  const { players, socket, quitLobby } = useGame();

  const isHost = players.find((p) => p.id === socket?.id)?.isHost || false;

  return (
    <section className="bg-[radial-gradient(ellipse_31.48%_48.47%_at_51.72%_50.00%,#464441_0%,#191918_100%)] py-16 lg:py-0">
      <Logo
        className="absolute top-0 left-0 h-16 w-40 lg:top-4 lg:left-4"
        onClick={() => quitLobby()}
        onHoverScale={true}
      />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 flex items-center gap-4 px-12 py-2"
        onClick={() => setShowRules(true)}
      >
        <Image
          src="/assets/button-short.png"
          alt="Règles"
          width={320}
          height={320}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
        />
        <Image
          src="/assets/setting-wheel.png"
          alt="settings"
          width={24}
          height={24}
          className="relative"
        />
        <p className="relative text-black">Réglages / Règles</p>
      </motion.button>

      <ErrorToast />

      <motion.div
        variants={frameVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-4 lg:gap-8"
      >
        <RoomCode />

        <ThresholdPicker isHost={isHost} />

        {/* Liste des joueurs */}
        <motion.div
          variants={itemVariants}
          className="w-8/10 text-center lg:w-1/2"
        >
          <ul className="flex flex-col gap-4">
            {Array.from({ length: MAX_PLAYERS }).map((_, index) =>
              players[index] ? (
                <PlayerRow key={index} player={players[index]} />
              ) : (
                <EmptySlot key={index} />
              )
            )}
          </ul>
        </motion.div>

        <LobbyActions />
      </motion.div>

      <AnimatePresence>
        {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      </AnimatePresence>
    </section>
  );
}

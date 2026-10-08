"use client";

import { motion } from "framer-motion";

import { useGame } from "../../context/GameContext";
import ImageButton from "../ImageButton";
import { itemVariants } from "./variants";

const buttonClass = "w-full rounded-full px-6 py-2";
const textClass = "text-2xl text-white";

// Boutons du lobby : Quitter, puis Lancer (hôte) ou Prêt (autres joueurs)
export default function LobbyActions() {
  const { players, socket, quitLobby, startGame, beReady } = useGame();

  const me = players.find((p) => p.id === socket?.id);
  const isHost = me?.isHost || false;
  const isReady = me?.isReady || false;

  const readyCount = players.filter((p) => p.isHost || p.isReady).length;
  const canStart = readyCount === players.length && players.length > 1;

  return (
    <motion.div variants={itemVariants} className="flex w-8/10 gap-4 lg:w-1/2">
      <ImageButton
        variant="long-red"
        whileHover={{ y: -5 }}
        onClick={quitLobby}
        textClassName={textClass}
        className={buttonClass}
      >
        Quitter
      </ImageButton>

      {isHost ? (
        <ImageButton
          variant={canStart ? "long-green" : "long-border"}
          whileHover={canStart ? { y: -5 } : {}}
          onClick={startGame}
          disabled={!canStart}
          textClassName={`text-2xl ${canStart ? "text-black" : "text-white"}`}
          className={`${buttonClass} ${canStart ? "" : "opacity-50 hover:shadow-none"}`}
        >
          Lancer la partie ({readyCount}/{players.length})
        </ImageButton>
      ) : (
        <ImageButton
          variant={isReady ? "long-red" : "long-green"}
          whileHover={{ y: -5 }}
          onClick={beReady}
          textClassName={`text-2xl ${isReady ? "text-white" : "text-black"}`}
          className={buttonClass}
        >
          {isReady ? "Pas prêt" : "Prêt"}
        </ImageButton>
      )}
    </motion.div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useGame } from "../../context/GameContext";
import { MIN_THRESHOLD, MAX_THRESHOLD } from "../../utils/gameConstants";
import { itemVariants } from "./variants";

const clamp = (value: number) =>
  Math.min(Math.max(value, MIN_THRESHOLD), MAX_THRESHOLD);

export default function ThresholdPicker({ isHost }: { isHost: boolean }) {
  const { threshold, updateThreshold } = useGame();
  // Saisie en cours dans le champ (null = on affiche la valeur du serveur)
  const [draft, setDraft] = useState<string | null>(null);

  const commit = useCallback(() => {
    if (draft === null) return;
    const value = Number(draft);
    if (draft !== "" && !isNaN(value)) updateThreshold(clamp(value));
    setDraft(null);
  }, [draft, updateThreshold]);

  // Valide après un délai de réflexion (debouncing), ou tout de suite en quittant le champ
  useEffect(() => {
    if (draft === null) return;
    const timer = setTimeout(commit, 1000);
    return () => clearTimeout(timer);
  }, [draft, commit]);

  const atMin = threshold <= MIN_THRESHOLD;
  const atMax = threshold >= MAX_THRESHOLD;

  const step = (delta: number) => {
    setDraft(null);
    updateThreshold(threshold + delta);
  };

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center gap-4"
    >
      <h3>Quota à atteindre</h3>
      <div className="flex items-center gap-4">
        {isHost ? (
          <>
            <motion.button
              whileHover={atMin ? {} : { scale: 1.1 }}
              whileTap={atMin ? {} : { scale: 0.9 }}
              onClick={() => step(-1)}
              disabled={atMin}
              className="cursor-pointer text-5xl disabled:cursor-not-allowed disabled:opacity-30"
            >
              -
            </motion.button>
            <input
              type="number"
              value={draft ?? threshold}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              className="w-16 rounded-md border border-gray-300 bg-white p-1 text-center text-2xl text-black"
              min={MIN_THRESHOLD}
              max={MAX_THRESHOLD}
            />
            <motion.button
              whileHover={atMax ? {} : { scale: 1.1 }}
              whileTap={atMax ? {} : { scale: 0.9 }}
              onClick={() => step(1)}
              disabled={atMax}
              className="cursor-pointer text-5xl disabled:cursor-not-allowed disabled:opacity-30"
            >
              +
            </motion.button>
          </>
        ) : (
          <span className="text-4xl text-white">{threshold}</span>
        )}
      </div>
    </motion.div>
  );
}

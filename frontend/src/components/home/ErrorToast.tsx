"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";

const DISMISS_DELAY_MS = 2000;

export default function ErrorToast() {
  const { error, setError } = useGame();

  // Fait disparaître l'erreur automatiquement
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), DISMISS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [error, setError]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          key="error-message"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red fixed top-10 z-9999 flex items-center gap-4 rounded-md px-8 py-4 text-2xl font-bold text-white shadow-lg"
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
    </AnimatePresence>
  );
}

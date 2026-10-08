"use client";

import { motion, AnimatePresence } from "framer-motion";

/** Bandeau « Code copié ! » partagé par le lobby et la modale de réglages */
export default function CodeCopiedToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="copy-success"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-10 left-1/2 z-9999 flex -translate-x-1/2 items-center gap-4 rounded-md bg-green-500 px-8 py-4 text-2xl text-white shadow-lg"
        >
          Code copié !
        </motion.div>
      )}
    </AnimatePresence>
  );
}

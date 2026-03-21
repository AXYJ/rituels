"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../types/game";

type PlayerDeckProps = {
  me: any;
  isMyTurn: boolean;
  deck: any;
  handleCardClick: (card: Card) => void;
};

export default function PlayerDeck({ me, isMyTurn, deck, handleCardClick }: PlayerDeckProps) {
  return (
    <div
      className={`col-start-2 col-end-3 row-start-3 row-end-4 grid grid-cols-3 items-start gap-4 relative ${isMyTurn ? "" : "pointer-events-none grayscale-80"}`}
    >
      <h2 className="text-4xl absolute left-1/2 -translate-x-1/2 -top-1/4">
        {me?.name}
      </h2>
      <AnimatePresence>
        {deck?.cards?.map((card: Card, index: number) => (
          <motion.div
            layout
            layoutId={`card-${card.id || card.symbol + card.color}`}
            key={card.id || index}
            initial={{ opacity: 0, y: 200, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-center justify-center"
          >
            <Image
              src={`/cards/${card.symbol}-${card.color}.png`}
              alt="card"
              width={400}
              height={600}
              className="max-h-full cursor-pointer object-contain transition-transform duration-300 hover:-translate-y-10"
              onClick={() => handleCardClick(card)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

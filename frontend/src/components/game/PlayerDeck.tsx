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

export default function PlayerDeck({
  me,
  isMyTurn,
  deck,
  handleCardClick,
}: PlayerDeckProps) {
  return (
    <div
      className={`relative col-start-2 col-end-3 row-start-3 row-end-4 grid grid-cols-3 items-start gap-2 px-4 lg:gap-4 ${isMyTurn ? "" : "pointer-events-none grayscale-80"}`}
    >
      <div className="absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-[110%] items-center gap-8">
        <span className="text-5xl">{me?.name}</span>
        <div className="flex w-full items-center gap-2">
          <Image
            src={`/cards/Seed.png`}
            alt="card"
            width={1000}
            height={1000}
            className="z-10 h-12 w-12 object-contain"
          />
          <span className="pointer-events-none z-10 -ml-2 w-full px-3 py-1 text-5xl whitespace-nowrap">
            {me.score} {Math.abs(me.score) > 1 ? "graines" : "graine"}
          </span>
        </div>
      </div>

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

"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../types/game";
import { useGame } from "../../context/GameContext";

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
  const { playerTurn, players, propositions } = useGame();

  return (
    <div
      className={`relative col-start-2 col-end-3 row-start-3 row-end-4 grid grid-cols-3 items-start gap-2 px-4 lg:gap-4 ${isMyTurn ? "" : "grayscale-90"}`}
    >
      <div className="absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-[110%] items-center gap-8">
        <span className="text-3xl lg:text-5xl">{me?.name}</span>
        <div className="flex w-full items-center gap-2">
          <Image
            src={`/cards/Seed.png`}
            alt="card"
            width={1000}
            height={1000}
            className="z-10 h-12 w-12 object-contain"
          />
          <span className="pointer-events-none z-10 -ml-2 w-full px-3 py-1 text-3xl whitespace-nowrap lg:text-5xl">
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
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            whileHover={{ y: -64 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`group relative flex items-center justify-center overflow-hidden rounded-xl lg:after:pointer-events-none lg:after:absolute lg:after:inset-0 lg:after:bg-black/60 lg:after:opacity-0 lg:after:transition-opacity lg:after:duration-300 ${propositions && (propositions.symbolRules[card.symbol] || propositions.colorRules[card.color]) && isMyTurn ? "lg:group-hover:after:opacity-100" : ""} ${isMyTurn ? "" : "pointer-events-none"}`}
          >
            <div className="pointer-events-none absolute inset-0 z-20 hidden flex-col items-center justify-start pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:flex">
              {propositions &&
                (propositions.symbolRules[card.symbol] ||
                  propositions.colorRules[card.color]) && (
                  <div className="flex flex-col items-center gap-1 p-4 text-center">
                    <span className="text-xl tracking-widest text-white uppercase">
                      Selon vous :
                    </span>
                    {propositions.symbolRules[card.symbol] && (
                      <span className="text-2xl text-white drop-shadow-md">
                        {propositions.symbolRules[card.symbol]}
                      </span>
                    )}
                    {propositions.colorRules[card.color] && (
                      <span className="text-2xl text-white drop-shadow-md">
                        {propositions.colorRules[card.color]}
                      </span>
                    )}
                  </div>
                )}
            </div>
            <Image
              src={`/cards/${card.symbol}-${card.color}.png`}
              alt="card"
              width={400}
              height={600}
              className={`relative z-10 max-h-full object-contain transition-all duration-300 ${propositions && (propositions.symbolRules[card.symbol] || propositions.colorRules[card.color]) && isMyTurn ? "lg:group-hover:brightness-50 lg:group-hover:grayscale" : ""} ${isMyTurn ? "cursor-pointer" : "cursor-default"}`}
              onClick={() => isMyTurn && handleCardClick(card)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {!isMyTurn && (
        <div className="pointer-events-none absolute z-15 top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-8">
          <h3 className="whitespace-nowrap">
            Au tour de :{" "}
            {players.find((p) => p.id === playerTurn)?.name || playerTurn}
          </h3>
        </div>
      )}
    </div>
  );
}

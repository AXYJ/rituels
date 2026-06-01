"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { Player, Card } from "../../types/game";

function OpponentDeck({
  opponent,
  index,
  total,
  getOpponentPlacementClass,
  getOpponentNamePlacementClass,
}: {
  opponent: Player | undefined;
  index: number;
  total: number;
  getOpponentPlacementClass: (index: number, total: number) => string;
  getOpponentNamePlacementClass: (index: number, total: number) => string;
}) {
  const seedRef = useRef<HTMLImageElement>(null);
  const prevScoreRef = useRef<number | null>(null);

  useEffect(() => {
    if (opponent) {
      if (
        prevScoreRef.current !== null &&
        opponent.score !== prevScoreRef.current
      ) {
        const diff = opponent.score - prevScoreRef.current;
        const seed = seedRef.current;

        if (seed) {
          if (diff > 0) {
            seed.animate(
              [
                { transform: "scale(1)" },
                { transform: "scale(1.2)" },
                { transform: "scale(1)" },
              ],
              {
                duration: 300,
                easing: "ease-in-out",
              }
            );
          } else if (diff < 0) {
            seed.animate(
              [
                { transform: "scale(1)" },
                { transform: "scale(0.8)" },
                { transform: "scale(1)" },
              ],
              {
                duration: 300,
                easing: "ease-in-out",
              }
            );
          }
        }
      }
      prevScoreRef.current = opponent.score;
    }
  }, [opponent, opponent?.score]);

  return (
    <div
      className={`relative ${getOpponentPlacementClass(index, total)} ${opponent?.leavedPlayer ? "opacity-10" : ""}`}
    >
      <div
        className={`absolute z-30 flex flex-col items-center gap-0 whitespace-nowrap lg:flex-row lg:gap-8 ${getOpponentNamePlacementClass(index, total)}`}
      >
        <h3 className="whitespace-nowrap">{opponent?.name}</h3>
        <div className="pointer-events-none flex w-full items-center gap-0 lg:gap-2">
          <Image
            ref={seedRef}
            src={`/cards/Seed.png`}
            alt="card"
            width={1000}
            height={1000}
            className="seed z-10 h-8 w-8 object-contain lg:h-12 lg:w-12"
          />
          <span className="pointer-events-none z-10 -ml-2 w-full px-3 py-1 text-2xl whitespace-nowrap lg:text-4xl">
            {opponent?.score ?? 0}{" "}
            {Math.abs(opponent?.score ?? 0) > 1 ? "graines" : "graine"}
          </span>
        </div>
      </div>

      {opponent?.deck?.cards?.map((card: Card, cardIndex: number) => (
        <motion.div
          layout
          layoutId={`card-back-${opponent?.id}-${card.id || cardIndex}`}
          key={card.id || cardIndex}
          className="flex items-center justify-center"
        >
          <Image
            src={`/cards/card-back.png`}
            alt="card back"
            width={400}
            height={600}
            className="h-16 w-12 object-contain lg:h-32 lg:w-24"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function OpponentDecks() {
  const { players, displayOrder } = useGame();

  const opponents = displayOrder
    ? displayOrder
        .slice(1)
        .map((id) => players.find((p) => p.id === id))
        .filter((p) => p !== undefined)
    : [];

  const getOpponentPlacementClass = (index: number, total: number) => {
    if (total === 1)
      return "col-start-2 col-end-3 row-start-1 row-end-2 flex -translate-y-1/2 items-center justify-center gap-0 lg:gap-4";
    if (total === 2) {
      if (index === 0)
        return "col-start-1 col-end-2 row-start-2 row-end-3 flex items-center justify-center gap-0 lg:gap-4 rotate-90 -translate-x-1/2";
      if (index === 1)
        return "col-start-3 col-end-4 row-start-2 row-end-3 flex items-center justify-center gap-0 lg:gap-4 -rotate-90 translate-x-1/2";
    }
    if (total === 3) {
      if (index === 0)
        return "col-start-1 col-end-2 row-start-2 row-end-3 flex items-center justify-center gap-0 lg:gap-4 rotate-90 -translate-x-1/2";
      if (index === 1)
        return "col-start-2 col-end-3 row-start-1 row-end-2 flex -translate-y-1/2 items-center justify-center gap-0 lg:gap-4";
      if (index === 2)
        return "col-start-3 col-end-4 row-start-2 row-end-3 flex items-center justify-center gap-0 lg:gap-4 -rotate-90 translate-x-1/2";
    }
    return "hidden";
  };

  const getOpponentNamePlacementClass = (index: number, total: number) => {
    if (total === 1) return "left-1/2 -translate-x-1/2 -bottom-4";
    if (total === 2) {
      if (index === 0) return "right-1/2 translate-x-1/2 -top-8"; // gauche
      if (index === 1) return "left-1/2 -translate-x-1/2 -top-8"; // droite
    }
    if (total === 3) {
      if (index === 0) return "right-1/2 translate-x-1/2 -top-8"; // gauche
      if (index === 1) return "left-1/2 -translate-x-1/2 -bottom-4"; // haut
      if (index === 2) return "left-1/2 -translate-x-1/2 -top-8"; // droite
    }
    return "left-1/2 -translate-x-1/2 -bottom-1";
  };

  return (
    <>
      {opponents.map((opponent, index) => (
        <OpponentDeck
          key={opponent?.id || index}
          opponent={opponent}
          index={index}
          total={opponents.length}
          getOpponentPlacementClass={getOpponentPlacementClass}
          getOpponentNamePlacementClass={getOpponentNamePlacementClass}
        />
      ))}
    </>
  );
}

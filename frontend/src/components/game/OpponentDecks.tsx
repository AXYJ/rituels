"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useGame } from "../../context/GameContext";

export default function OpponentDecks() {
  const { players, displayOrder } = useGame();

  const opponents = displayOrder
    ? displayOrder
        .slice(1)
        .map((id) => players.find((p) => p.id === id))
        .filter((p) => p !== undefined)
    : [];

  const getOpponentPlacementClass = (index: number, total: number) => {
    // Note: Tailwindcss n'accepte pas les strings dynamiques ex: `col-start-${x}`
    // On doit écrire en entier la classe pour qu'elle soit compilée !
    if (total === 1)
      return "col-start-2 col-end-3 row-start-1 row-end-2 flex -translate-y-1/2 items-center justify-center gap-1 lg:gap-4";
    if (total === 2) {
      if (index === 0)
        return "col-start-1 col-end-2 row-start-2 row-end-3 flex items-end justify-center gap-0 lg:gap-4 rotate-90 -translate-x-1/2 h-fit";
      if (index === 1)
        return "col-start-3 col-end-4 row-start-2 row-end-3 flex items-end justify-center gap-0 lg:gap-4 -rotate-90 translate-x-1/2 h-fit";
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
    if (total === 1) return "left-1/2 -translate-x-1/2 -bottom-1";
    if (total === 2) {
      if (index === 0) return "right-1/2 translate-x-1/2 -top-16"; // gauche
      if (index === 1) return "left-1/2 -translate-x-1/2 -top-16"; // droite
    }
    if (total === 3) {
      if (index === 0) return "right-1/2 translate-x-1/2 -top-16"; // gauche
      if (index === 1) return "left-1/2 -translate-x-1/2 -bottom-1"; // haut
      if (index === 2) return "left-1/2 -translate-x-1/2 -top-16"; // droite
    }
    return "left-1/2 -translate-x-1/2 -bottom-1";
  };

  return (
    <>
      {opponents.map((opponent, index) => (
        <div
          key={opponent?.id || index}
          className={`relative ${getOpponentPlacementClass(index, opponents.length)}`}
        >
          <div
            className={`absolute z-30 flex items-center gap-8 whitespace-nowrap ${getOpponentNamePlacementClass(index, opponents.length)}`}
          >
            <h3>{opponent?.name}</h3>
            <div className="flex w-full items-center gap-2">
              <Image
                src={`/cards/Seed.png`}
                alt="card"
                width={1000}
                height={1000}
                className="z-10 h-12 w-12 object-contain"
              />
              <span className="pointer-events-none z-10 -ml-2 w-full px-3 py-1 text-4xl whitespace-nowrap">
                {opponent?.score}{" "}
                {Math.abs(opponent?.score) > 1 ? "graines" : "graine"}
              </span>
            </div>
          </div>

          {opponent?.deck?.cards?.map((card: any, cardIndex: number) => (
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
      ))}
    </>
  );
}

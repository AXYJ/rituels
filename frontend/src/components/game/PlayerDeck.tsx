"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const handleGlobalClick = () => {
      setSelectedCardIndex(null);
    };

    if (selectedCardIndex !== null) {
      window.addEventListener("click", handleGlobalClick);
    }

    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [selectedCardIndex]);

  const { playerTurn, players, propositions } = useGame();

  const handleClick = (e: React.MouseEvent, card: Card, index: number) => {
    e.stopPropagation();
    // On utilise innerWidth pour la détection mobile (< 1024px)
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      if (selectedCardIndex === index) {
        // Deuxième clic sur la même carte : on la joue
        handleCardClick(card);
        setSelectedCardIndex(null);
      } else {
        // Premier clic : on sélectionne la carte (soulève + propositions)
        setSelectedCardIndex(index);
      }
    } else {
      // Comportement Desktop : clic direct pour jouer
      handleCardClick(card);
    }
  };

  const seedRef = useRef<HTMLImageElement>(null);
  const prevScoreRef = useRef<number | null>(null);

  useEffect(() => {
    if (me) {
      if (prevScoreRef.current !== null && me.score !== prevScoreRef.current) {
        const diff = me.score - prevScoreRef.current;
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
      prevScoreRef.current = me.score;
    }
  }, [me?.score]);

  return (
    <div
      className={`relative col-start-2 col-end-3 row-start-3 row-end-4 grid grid-cols-3 items-start gap-2 px-4 lg:gap-4 ${isMyTurn ? "" : "grayscale-90"}`}
    >
      <div className="absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-[110%] items-center gap-8">
        <span className="text-3xl whitespace-nowrap lg:text-5xl">
          {me?.name}
        </span>
        <div className="flex w-full items-center gap-2">
          <Image
            ref={seedRef}
            src={`/cards/Seed.png`}
            alt="card"
            width={1000}
            height={1000}
            className="seed z-10 h-12 w-12 object-contain"
          />
          <span className="pointer-events-none z-10 -ml-2 w-full px-3 py-1 text-3xl whitespace-nowrap lg:text-5xl">
            {me?.score ?? 0}{" "}
            {Math.abs(me?.score ?? 0) > 1 ? "graines" : "graine"}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {deck?.cards?.map((card: Card, index: number) => (
          <motion.div
            layout
            layoutId={`card-${card.id || card.symbol + card.color}`}
            key={card.id || index}
            drag={isMyTurn ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(e, info) => {
              if (info.offset.y < -50 || info.velocity.y < -400) {
                handleCardClick(card);
                setSelectedCardIndex(null);
              } else if (info.offset.y > 50 || info.velocity.y > 400) {
                setSelectedCardIndex(null);
              }
            }}
            initial={{ opacity: 0, y: 200, scale: 0.8 }}
            animate={
              selectedCardIndex === index
                ? { opacity: 1, y: -64, scale: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            whileHover={
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? { y: -64 }
                : {}
            }
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`group relative flex aspect-[2/3] items-center justify-center overflow-hidden rounded-xl lg:after:pointer-events-none lg:after:absolute lg:after:inset-0 lg:after:opacity-0 lg:after:transition-opacity lg:after:duration-300 ${propositions && (propositions.symbolRules[card.symbol] || propositions.colorRules[card.color]) && isMyTurn ? "lg:group-hover:after:opacity-100" : ""} ${isMyTurn ? "" : "pointer-events-none"} ${selectedCardIndex === index ? "after:pointer-events-none after:absolute after:inset-0 after:bg-black/60 after:opacity-100" : ""}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 z-20 flex-col items-center justify-start transition-opacity duration-300 lg:flex lg:pt-8 lg:opacity-0 lg:group-hover:opacity-100 ${selectedCardIndex === index ? "flex opacity-100" : "hidden opacity-0"}`}
            >
              {propositions &&
                (propositions.symbolRules[card.symbol] ||
                  propositions.colorRules[card.color]) && (
                  <div className="flex flex-col items-center p-2 text-center lg:p-4">
                    <span className="text-sm tracking-widest text-white uppercase lg:text-xl">
                      Selon vous :
                    </span>
                    {propositions.symbolRules[card.symbol] && (
                      <span className="text-lg text-white lg:text-2xl">
                        {propositions.symbolRules[card.symbol]}
                      </span>
                    )}
                    {propositions.colorRules[card.color] && (
                      <span className="text-lg text-white lg:text-2xl">
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
              draggable={false}
              className={`relative z-10 max-h-full object-contain transition-all duration-300 ${
                isMyTurn ? "cursor-pointer" : "cursor-default"
              } ${
                propositions &&
                (propositions.symbolRules[card.symbol] ||
                  propositions.colorRules[card.color]) &&
                isMyTurn
                  ? "lg:group-hover:brightness-50 lg:group-hover:grayscale"
                  : ""
              } ${
                selectedCardIndex === index &&
                (propositions.symbolRules[card.symbol] ||
                  propositions.colorRules[card.color])
                  ? "brightness-50 grayscale"
                  : ""
              }`}
              onClick={(e) => handleClick(e, card, index)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {!isMyTurn && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-15 flex -translate-x-1/2 -translate-y-1/2 items-center gap-8">
          <h3 className="whitespace-nowrap">
            Au tour de :{" "}
            {players.find((p) => p.id === playerTurn)?.name || playerTurn}
          </h3>
        </div>
      )}
    </div>
  );
}

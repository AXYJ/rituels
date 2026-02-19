"use client";

import Image from "next/image";

import { useEffect } from "react";
import { useGame } from "../../context/GameContext";

import { createCard } from "../../hooks/createCard";




export default function Game() {
  const { quitLobby, rules, deck, setDeck, playerTurn } = useGame();

  useEffect(() => {
    if (!rules) return;

    const currentCards = deck.cards ? [...deck.cards] : [];

    if (currentCards.length < 3) {
      while (currentCards.length < 3) {
        currentCards.push(createCard(rules));
      }
      setDeck({ cards: currentCards });
    }
  }, [deck.cards, rules, setDeck]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-between">
      <h1 className="mb-8 text-4xl font-bold">Partie en cours</h1>
      <button
        onClick={() => { quitLobby(); }}
        className="rounded-full bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600"
      >
        Quitter la partie
      </button>

      <h2>Au tour de : {playerTurn}</h2>

      <div className="grid grid-cols-3 gap-4 w-1/3 fixed -bottom-15">
        {deck.cards?.map((card, index) => (
          <Image key={index} src={`/cards/${card.symbol}-${card.color}.png`} alt="card" width={500} height={500} className="w-full h-full" />
        ))}
      </div>

    </div>
  );
}

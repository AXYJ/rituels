"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";

import { createCard } from "../../hooks/createCard";
import WinnerScreen from "../game/WinnerScreen";
import Helper from "../game/Helper";

export default function Game() {
  const [message, setMessage] = useState("");
  const {
    quitLobby,
    rules,
    playerTurn,
    cardPlayed,
    socket,
    players,
    setLocalPlayerDeck,
    history,
    sendMessage,
    winner,
  } = useGame();

  const me = players.find((p) => p.id === socket?.id);
  const isMyTurn = me ? playerTurn === me.id : false;
  const deck = me?.deck;

  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCardClick = (card: { symbol: string; color: string }) => {
    if (me?.deck?.cards) {
      const cardIndex = me.deck.cards.findIndex((c) => c === card);
      if (cardIndex !== -1) {
        const newCards = [...me.deck.cards];
        newCards.splice(cardIndex, 1);
        setLocalPlayerDeck(newCards);
      }
    }
    cardPlayed(card);
  };

  useEffect(() => {
    console.log(rules);
    if (!rules) return;

    const currentCards = deck?.cards ? [...deck.cards] : [];

    if (currentCards.length < 3) {
      while (currentCards.length < 3) {
        currentCards.push(createCard(rules));
      }
      setLocalPlayerDeck(currentCards);
    }
  }, [deck?.cards, rules, setLocalPlayerDeck]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="grid h-screen w-full grid-cols-3 grid-rows-3 gap-8 overflow-hidden p-4">
      <button
        onClick={() => {
          quitLobby();
        }}
        className="h-fit w-fit rounded-full bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600"
      >
        Quitter la partie
      </button>

      <h2>
        Au tour de :{" "}
        {players.find((p) => p.id === playerTurn)?.name || playerTurn}
      </h2>

      {/* Historique des actions */}

      <div className="relative col-start-1 col-end-2 row-start-3 row-end-4 flex h-full flex-col justify-between rounded-lg border bg-gray-50/10">
        <h3 className="w-full bg-gray-900/50 p-2 font-bold text-white">
          Historique des actions:
        </h3>
        <div className="h-full overflow-y-auto p-2">
          {history.map((h, index) => {
            const playerName =
              players.find((p) => p.id === h.player)?.name || h.player;

            if (h.type === "message") {
              return (
                <div key={index} className="text-sm">
                  <span className="font-semibold text-blue-400">
                    {playerName}
                  </span>{" "}
                  : <span>{h.message}</span>
                </div>
              );
            }

            return (
              <div key={index} className="text-sm">
                <span className="font-semibold">{playerName}</span> a joué{" "}
                <span className="italic">
                  {h.card?.color} {h.card?.symbol}
                </span>{" "}
                et a gagné <span className="font-semibold">{h.points}</span>{" "}
                points
              </div>
            );
          })}
          <div ref={historyEndRef} />
        </div>

        <form
          className="border-gray flex w-full overflow-hidden rounded-lg border bg-gray-900"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-transparent px-2 py-2 text-white outline-none"
            placeholder="Tchat..."
          />
          <button
            type="submit"
            className="bg-gray-800 px-8 font-bold hover:bg-gray-700"
          >
            Envoyer
          </button>
        </form>
      </div>

      {/* Deck */}

      <div
        className={`col-start-2 col-end-3 row-start-3 row-end-4 grid grid-cols-3 gap-4 ${isMyTurn ? "" : "pointer-events-none grayscale-80"}`}
      >
        {deck?.cards?.map((card, index) => (
          <Image
            key={index}
            src={`/cards/${card.symbol}-${card.color}.png`}
            alt="card"
            width={500}
            height={500}
            className="h-full w-full cursor-pointer transition-transform duration-300 hover:-translate-y-10"
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {/* Score */}

      {me && (
        <div className="col-start-3 col-end-4 row-start-2 row-end-4 flex flex-col items-center gap-8 justify-end">
          <div className="flex items-center gap-2">
            <Image
              src={`/cards/seed.png`}
              alt="card"
              width={1000}
              height={1000}
              className="h-16 w-16 object-contain"
            />
            <p className="text-xl font-bold">x {me.score}</p>
          </div>
          <Helper/>
        </div>
      )}

      {/* Winner */}

      {winner && <WinnerScreen />}
    </div>
  );
}

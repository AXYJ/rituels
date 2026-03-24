"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";

export default function History() {
  const [message, setMessage] = useState("");
  const { history, players, sendMessage } = useGame();

  const historyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Permet de scroller en bas de l'historique
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTo({
        top: historyContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="relative col-start-1 col-end-2 row-start-3 row-end-4 flex h-full flex-col justify-between">
      <Image
        src="/assets/historique.png"
        alt=""
        width={800}
        height={100}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
      />
      <div
        ref={historyContainerRef}
        className="my-2 mr-2 h-full overflow-y-auto py-2 pr-2 pl-4 md:mr-4 md:py-6 md:pl-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {history.map((h, index) => {
          const playerName =
            players.find((p) => p.id === h.player)?.name || h.player;

          if (h.type === "message") {
            return (
              <div key={index} className="text-sm md:text-xl">
                <span className="text-green font-semibold">{playerName}</span> :{" "}
                <span>{h.message}</span>
              </div>
            );
          }

          return (
            <div key={index} className="text-sm md:text-xl">
              <span className="font-semibold">{playerName}</span>
              {" a joué "}
              <span className="italic">
                {h.card?.symbol} {h.card?.color}
              </span>
              {" et a gagné "}
              <span className="font-semibold">{h.points}</span>
              {" points"}
            </div>
          );
        })}
      </div>

      <form
        className="z-10 mx-2 mb-2 flex overflow-hidden rounded-lg bg-white md:mx-4 md:mb-4"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent px-4 py-4 text-sm text-black outline-none md:text-xl"
          placeholder="Envoyer un message..."
        />
        <button
          type="submit"
          className="bg-black px-8 text-sm text-white transition-colors duration-300 ease-in-out hover:bg-gray-700 md:text-xl"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

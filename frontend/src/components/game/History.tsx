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
      <Image src="/assets/historique.png" alt="" width={800} height={100} className="object-fill pointer-events-none absolute inset-0 z-0 h-full w-full select-none" />
      <div ref={historyContainerRef} className="h-full overflow-y-auto py-6 pl-6 pr-2 mr-4 my-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
        {history.map((h, index) => {
          const playerName =
            players.find((p) => p.id === h.player)?.name || h.player;

          if (h.type === "message") {
            return (
              <div key={index} className="text-xl">
                <span className="font-semibold text-green">
                  {playerName}
                </span>{" "}
                : <span>{h.message}</span>
              </div>
            );
          }

          return (
            <div key={index} className="text-xl">
              <span className="font-semibold">{playerName}</span> a joué {" "}
              <span className="italic">
                {h.card?.symbol} {h.card?.color}
              </span>{" "}
               et a gagné <span className="font-semibold">{h.points}</span>
              {"  "}
              points
            </div>
          );
        })}
      </div>

      <form
        className="flex overflow-hidden rounded-lg bg-white mx-4 mb-4 z-10"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent px-4 py-4 text-black outline-none text-xl"
          placeholder="Envoyer un message..."
        />
        <button
          type="submit"
          className="px-8 text-xl bg-black transition-colors duration-300 ease-in-out hover:bg-gray-700 text-white"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

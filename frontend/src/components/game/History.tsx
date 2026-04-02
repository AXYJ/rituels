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
    <div className="relative z-10 col-start-1 col-end-2 row-start-3 row-end-4 mr-4 mb-2 flex h-[33vh] flex-col justify-center self-end lg:mb-6 lg:h-full">
      <Image
        src="/assets/historique.png"
        alt=""
        width={800}
        height={100}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
      />
      <div
        ref={historyContainerRef}
        className="my-2 mr-2 h-full overflow-y-auto py-2 pr-2 pl-4 lg:mr-4 lg:py-6 lg:pl-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {history.map((h, index) => {
          const playerName =
            players.find((p) => p.id === h.player)?.name || h.player;

          if (h.type === "message") {
            return (
              <div key={index} className="text-md lg:text-xl">
                <span className="text-green">{playerName}</span> :{" "}
                <span>{h.message}</span>
              </div>
            );
          }

          return (
            <div key={index} className="text-md lg:text-xl">
              <span>{playerName}</span>
              {" a joué "}
              <span className="italic">{h.card?.symbol}</span>
              <span
                style={{
                  color: `var(--color-card-${h.card?.color?.toLowerCase()})`,
                }}
              >
                {" "}
                {h.card?.color}
              </span>
              {h.points === 0 ? (
                " et n'a rien gagné"
              ) : (
                <>
                  {h.points! > 0 ? " et a gagné " : " et a perdu "}
                  <span>{Math.abs(h.points ?? 0)}</span>{" "}
                  {Math.abs(h.points ?? 0) > 1 ? "graines" : "graine"}
                </>
              )}
            </div>
          );
        })}
      </div>

      <form
        className="z-10 mx-2 mb-2 flex overflow-hidden rounded-lg bg-white lg:mx-4 lg:mb-4"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent px-4 py-4 text-sm text-black outline-none lg:text-xl"
          placeholder="Envoyer un message..."
        />
        <button
          type="submit"
          className="cursor-pointer bg-black px-8 text-sm text-white transition-colors duration-300 ease-in-out hover:bg-gray-700 lg:text-xl"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

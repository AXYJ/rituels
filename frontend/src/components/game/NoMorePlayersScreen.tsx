"use client";
import { useGame } from "@/src/context/GameContext";
import React from "react";

export default function NoMorePlayersScreen() {
  const { setNoMorePlayers, quitLobby, setView } = useGame();
  const handleStay = () => {
    setNoMorePlayers(false);
  };
  const handleQuit = () => {
    quitLobby();
    setView("home");
  };
  return (
    <div className="fixed top-0 left-0 z-60 flex h-full w-full justify-center overflow-y-auto bg-black/50 lg:overflow-hidden">
      <div className="flex w-full max-w-[1024px] flex-col items-center justify-center overflow-y-auto rounded-lg bg-black p-6 lg:justify-center lg:gap-8 lg:overflow-hidden">
        <h3 className="mb-8 text-center">
          Tout le monde a fait une indigestion à part toi !
        </h3>
        <h2 className="mb-8 text-center">
          Souhaitez-vous attendre leur retour ?
        </h2>
        <div className="flex gap-18">
          <button
            onClick={handleStay}
            className="cursor-pointer rounded bg-white px-16 py-2 text-3xl font-bold text-black transition-transform duration-300 ease-in-out hover:scale-110"
          >
            Attendre
          </button>
          <button
            onClick={handleQuit}
            className="bg-red cursor-pointer rounded px-16 py-2 text-3xl font-bold text-white transition-transform duration-300 ease-in-out hover:scale-110"
          >
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
}

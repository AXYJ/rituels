"use client";

// Importations des modules
import { useGame } from "../../context/GameContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Importations des composants
import PlayerNameInput from "../lobby/PlayerNameInput";

export default function Lobby() {
  // Appel du contexte
  const { players, roomCode, beReady, quitLobby, startGame, socket } =
    useGame();

  const me = players.find((p) => p.id === socket?.id);
  const isHost = me?.isHost || false;
  const isReady = me?.isReady || false;

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleReady = () => {
    beReady();
  };

  const handleQuit = () => {
    quitLobby();
  };

  const onGameStart = () => {
    startGame();
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-16">
      <h1 className="relative flex items-center gap-4 text-5xl">
        Code : {roomCode}{" "}
        <button
          onClick={handleCopyCode}
          className="absolute top-1/2 -right-1/2 -translate-y-1/2"
        >
          <div
            className="h-10 w-10 bg-white"
            style={{
              maskImage: "url('/pen-to-square-solid-full.svg')",
              WebkitMaskImage: "url('/pen-to-square-solid-full.svg')",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
        </button>
      </h1>

      <div className="w-[40vw] overflow-y-auto text-center">
        <ul className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => {
            const player = players[index];

            if (player) {
              return (
                <li
                  key={index}
                  className={`flex w-full items-center justify-center rounded-full py-4 text-3xl transition-colors ${
                    player.isHost || player.isReady
                      ? "bg-green text-white"
                      : "bg-red text-white"
                  }`}
                >
                  {player.name} {(player.isHost || player.isReady) && "(Prêt)"}
                </li>
              );
            }

            return (
              <li
                key={index}
                className="flex h-10 w-full items-center justify-center rounded-full border-2 border-dashed border-white/50 bg-transparent py-4 text-3xl text-white/50"
              >
                En attente de joueurs...
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex gap-4">
        {isHost && (
          <button
            onClick={onGameStart}
            disabled={
              players.filter((p) => p.isHost || p.isReady).length !==
                players.length || players.length === 5
            }
            className={`rounded-full bg-green-500 px-6 py-2 font-bold text-white transition-colors duration-200 ease-in-out hover:bg-green-600 ${players.filter((p) => p.isHost || p.isReady).length === players.length ? "" : "cursor-not-allowed opacity-50"} ${players.length === 1 ? "cursor-not-allowed opacity-50" : ""}`}
          >
            Start Game ({players.filter((p) => p.isHost || p.isReady).length}/
            {players.length})
          </button>
        )}
        {!isHost && (
          <button
            onClick={handleReady}
            className="rounded-full bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600"
          >
            {isReady ? "Annuler" : "Prêt"}
          </button>
        )}
        <button
          onClick={handleQuit}
          className="rounded-full bg-red-500 px-6 py-2 font-bold text-white transition-colors duration-200 ease-in-out hover:bg-red-600"
        >
          Retour
        </button>
      </div>

      <AnimatePresence>
        {copySuccess && (
          <motion.div
            key="copy-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded bg-green-500 px-4 py-2 text-white"
          >
            Code copié !
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

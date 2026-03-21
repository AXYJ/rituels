"use client";

// Importations des modules
import { useGame } from "../../context/GameContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Importations des composants

export default function Lobby() {
  // Appel du contexte
  const { players, roomCode, beReady, quitLobby, startGame, socket, changeName } =
    useGame();

  const me = players.find((p) => p.id === socket?.id);
  const isHost = me?.isHost || false;
  const isReady = me?.isReady || false;

  const [copySuccess, setCopySuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

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
    <section className="flex min-h-screen flex-col items-center justify-center gap-16 max-w-[1024px] w-full mx-auto">
      <h1 className="relative flex items-center gap-4 text-5xl">
        Code : {roomCode}{" "}
        <button
          onClick={handleCopyCode}
          className="absolute top-1/2 -right-1/2 -translate-y-1/2 cursor-pointer"
        >
          <Image
            src="/assets/copy.svg"
            alt="Copier"
            width={40}
            height={40}
            className="h-10 w-10 hover:-translate-y-2 hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in-out"
          />
        </button>
      </h1>


      {/* Liste des joueurs */}
      <div className="w-1/2 text-center">
        <ul className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => {
            const player = players[index];

            if (player) {
              return (
                <li
                  key={index}
                  className={`flex w-full items-center justify-center rounded-full py-4 text-3xl relative hover:-translate-y-2 hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in-out ${player.id === socket?.id ? "cursor-pointer" : "pointer-events-none"}`}
                  onClick={() => {
                    if (player.id === socket?.id && !isEditing) {
                      setIsEditing(true);
                      setEditName(player.name);
                    }
                  }}
                >
                  <Image
                    src={
                      player.isHost || player.isReady
                        ? "/assets/button-long-green.png"
                        : "/assets/button-long-red.png"
                    }
                    alt=""
                    width={800}
                    height={100}
                    className="object-fill pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
                  />
                  {isEditing && player.id === socket?.id ? (
                    <input
                      autoFocus
                      type="text"
                      className={`relative z-50 text-4xl bg-transparent border-b-2 outline-none text-center w-1/2 uppercase ${player.isHost || player.isReady ? "text-black border-black" : "text-white border-white"}`}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => {
                        setIsEditing(false);
                        const trimmed = editName.trim();
                        if (trimmed !== "" && trimmed !== player.name) {
                          changeName(trimmed);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  ) : (
                    <span className={`relative z-50 text-4xl ${player.isHost || player.isReady ? "text-black" : "text-white"}`}>
                      {player.name} {(player.isHost || player.isReady) && "(Prêt)"}
                    </span>
                  )}
                  {player.id === socket?.id && (
                      <Image
                        src={
                          player.isHost || player.isReady
                            ? "/assets/pen-to-square-black.png"
                            : "/assets/pen-to-square.png"
                        }
                        alt=""
                        width={100}
                        height={100}
                        className="pointer-events-none z-0 w-12 select-none absolute right-4"
                      />
                    )
                  }
                </li>
              );
            }

            return (
              <li
                key={index}
                className="flex w-full items-center justify-center rounded-full py-4 text-3xl transition-colors relative cursor-default"
              >
                <Image
                  src="/assets/button-long-border.png"
                  alt=""
                  width={800}
                  height={100}
                  className="object-fill pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
                />
                <span className="relative z-50 text-4xl text-white">
                  En attente de joueurs...
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-4 w-1/2">
        {isHost && (
          <button
            onClick={onGameStart}
            disabled={
              players.filter((p) => p.isHost || p.isReady).length !== players.length || players.length === 5
            }
            className={`relative rounded-full px-6 py-2 font-bold text-white w-full cursor-pointer transition-all duration-300 ease-in-out ${players.filter((p) => p.isHost || p.isReady).length === players.length ? "hover:-translate-y-2 hover:shadow-lg hover:shadow-black" : "cursor-not-allowed opacity-50"}`}
          >
            <Image
              src={
                players.filter((p) => p.isHost || p.isReady).length === players.length && players.length !== 1
                  ? "/assets/button-long-green.png"
                  : "/assets/button-long-red.png"
              }
              alt=""
              width={800}
              height={100}
              className="object-fill pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
            />
            <span className="relative z-50 text-2xl text-white">
              Lancer la partie ({players.filter((p) => p.isHost || p.isReady).length}/
              {players.length})
            </span>
          </button>
        )}
        {!isHost && (
          <button
            onClick={handleReady}
            className="relative rounded-full px-6 py-2 font-bold text-white w-full cursor-pointer hover:-translate-y-2 hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in-out"
          >
            <Image
              src={
                isReady
                  ? "/assets/button-long-red.png"
                  : "/assets/button-long-green.png"
              }
              alt=""
              width={800}
              height={100}
              className="object-fill pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
            />
            <span className="relative z-50 text-2xl text-white">
              {isReady ? "Annuler" : "Prêt"}
            </span>
          </button>
        )}
        <button
          onClick={handleQuit}
          className="relative rounded-full px-6 py-2 font-bold text-white w-full cursor-pointer hover:-translate-y-2 hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in-out"
        >
          <Image
            src="/assets/button-long-red.png"
            alt=""
            width={800}
            height={100}
            className="object-fill pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
          />
          <span className="relative z-50 text-2xl text-white">
            Quitter
          </span>
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

"use client";

// Importations des modules
import { useGame } from "../../context/GameContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import Logo from "../logo";
import RulesModal from "../header/RulesModal";
import CopyCodeRoom from "../../hooks/CopyCodeRoom";

// Variants pour l'animation d'entrée
const frameVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.2, // Délai entre chaque bloc
      type: "spring",
      bounce: 0.6,
    } as any,
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      type: "spring",
      bounce: 0.6,
    } as any,
  },
};

export default function Lobby() {
  const [showRules, setShowRules] = useState(false);

  // Appel du contexte
  const {
    players,
    roomCode,
    beReady,
    quitLobby,
    startGame,
    socket,
    changeName,
    threshold,
    setThreshold,
    updateThreshold,
    error,
    setError,
  } = useGame();

  const me = players.find((p) => p.id === socket?.id);
  const isHost = me?.isHost || false;
  const isReady = me?.isReady || false;

  const [copySuccess, setCopySuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const handleCopyCode = () => {
    CopyCodeRoom({ roomCode, setCopySuccess });
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    if (target.classList.contains("minus")) {
      if (threshold === 5) return;
      updateThreshold(threshold - 1);
    } else {
      if (threshold === 30) return;
      updateThreshold(threshold + 1);
    }
  };

  // État local pour un affichage immédiat de la frappe
  const [localThreshold, setLocalThreshold] = useState<string | number>(
    threshold
  );

  // Synchronise l'input local quand la valeur globale change (via boutons +/- ou serveur)
  useEffect(() => {
    setLocalThreshold(threshold);
  }, [threshold]);

  // Valide et envoie au serveur après un délai de réflexion (debouncing)
  useEffect(() => {
    if (localThreshold === "" || Number(localThreshold) === threshold) return;

    const timer = setTimeout(() => {
      const valNum = Number(localThreshold);
      if (isNaN(valNum)) return;

      const clamped = Math.min(Math.max(valNum, 5), 30);
      updateThreshold(clamped);
      setLocalThreshold(clamped);
    }, 1000);

    return () => clearTimeout(timer);
  }, [localThreshold, threshold, updateThreshold]);

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalThreshold(e.target.value);
  };

  // Fait disparaître l'erreur automatiquement après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <section className="bg-[radial-gradient(ellipse_31.48%_48.47%_at_51.72%_50.00%,_#464441_0%,_#191918_100%)] py-16 lg:py-0">
      <Logo
        className="absolute top-0 left-0 h-16 w-40 lg:top-4 lg:left-4"
        onClick={() => handleQuit()}
      />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 flex items-center gap-4 px-12 py-2"
        onClick={() => {
          setShowRules(true);
        }}
      >
        <Image
          src="/assets/button-short.png"
          alt="Règles"
          width={320}
          height={320}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
        ></Image>
        <Image
          src="/assets/setting-wheel.png"
          alt="settings"
          width={24}
          height={24}
          className="relative"
        />
        <p className="relative text-black">Réglages / Règles</p>
      </motion.button>

      <AnimatePresence>
        {error && (
          <motion.div
            key="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red absolute top-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-md px-8 py-4 text-2xl text-white shadow-lg"
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={frameVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-screen w-full max-w-[1024px] flex-col items-center justify-center gap-4 lg:gap-8"
      >
        <motion.h1
          variants={itemVariants}
          className="relative flex items-center gap-4 text-3xl lg:text-5xl"
        >
          Code : <span className="tracking-widest">{roomCode}</span>{" "}
          <button onClick={handleCopyCode} className="cursor-pointer">
            <Image
              src="/assets/copy.png"
              alt="Copier"
              width={40}
              height={40}
              className="h-10 w-10 transition-transform duration-300 ease-in-out hover:-translate-y-2"
            />
          </button>
        </motion.h1>

        {isHost && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-4"
          >
            <h3>Quota à atteindre</h3>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClick}
                className="minus cursor-pointer text-5xl"
              >
                -
              </motion.button>
              <input
                type="number"
                value={localThreshold}
                onChange={handleThresholdChange}
                className="w-16 rounded-md border border-gray-300 bg-white p-1 text-center text-2xl text-black"
                min={5}
                max={30}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClick}
                className="plus cursor-pointer text-5xl"
              >
                +
              </motion.button>
            </div>
          </motion.div>
        )}

        {!isHost && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-4"
          >
            <h3>Seuil de victoire</h3>
            <div className="flex items-center gap-4">
              <span className="text-4xl text-white">{threshold}</span>
            </div>
          </motion.div>
        )}

        {/* Liste des joueurs */}
        <motion.div
          variants={itemVariants}
          className="w-8/10 text-center lg:w-1/2"
        >
          <ul className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, index) => {
              const player = players[index];

              if (player) {
                return (
                  <li
                    key={index}
                    className={`relative flex w-full items-center justify-center rounded-full py-4 text-3xl transition-shadow duration-300 hover:shadow-lg hover:shadow-black ${player.id === socket?.id ? "cursor-pointer" : "pointer-events-none"}`}
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
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
                    />
                    {isEditing && player.id === socket?.id ? (
                      <input
                        autoFocus
                        type="text"
                        className={`relative z-15 w-1/2 border-b-2 bg-transparent text-center text-4xl uppercase outline-none ${player.isHost || player.isReady ? "border-black text-black" : "border-white text-white"}`}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => {
                          setIsEditing(false);
                          const trimmed = editName.trim();
                          if (
                            trimmed !== "" &&
                            trimmed !== player.name &&
                            trimmed.length <= 10
                          ) {
                            changeName(trimmed);
                          } else {
                            setEditName(player.name);
                            setError(
                              "Le nom doit contenir entre 1 et 10 caractères."
                            );
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.currentTarget.blur();
                          }
                        }}
                      />
                    ) : (
                      <span
                        className={`relative z-15 text-4xl ${player.isHost || player.isReady ? "text-black" : "text-white"}`}
                      >
                        {player.name}{" "}
                        {(player.isHost || player.isReady) && "(Prêt)"}
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
                        className="pointer-events-none absolute right-4 z-0 w-12 select-none"
                      />
                    )}
                  </li>
                );
              }

              return (
                <li
                  key={index}
                  className="relative flex w-full cursor-default items-center justify-center rounded-full py-4 text-3xl"
                >
                  <Image
                    src="/assets/button-long-border.png"
                    alt=""
                    width={800}
                    height={100}
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
                  />
                  <span className="relative z-15 text-4xl text-white">
                    En attente de joueurs...
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Boutons d'action */}
        <motion.div
          variants={itemVariants}
          className="flex w-8/10 gap-4 lg:w-1/2"
        >
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleQuit}
            className="relative w-full cursor-pointer rounded-full px-6 py-2 text-white shadow-black transition-shadow duration-300 hover:shadow-lg"
          >
            <Image
              src="/assets/button-long-red.png"
              alt=""
              width={800}
              height={100}
              className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
            />
            <span className="relative z-15 text-2xl text-white">Quitter</span>
          </motion.button>

          {isHost && (
            <motion.button
              whileHover={
                players.filter((p) => p.isHost || p.isReady).length ===
                players.length
                  ? { y: -5 }
                  : {}
              }
              whileTap={{ scale: 0.9 }}
              onClick={onGameStart}
              disabled={
                players.filter((p) => p.isHost || p.isReady).length !==
                  players.length || players.length === 1
              }
              className={`relative w-full cursor-pointer rounded-full px-6 py-2 text-white shadow-black transition-shadow duration-300 ${players.filter((p) => p.isHost || p.isReady).length === players.length ? "hover:shadow-lg" : "cursor-not-allowed opacity-50"} ${players.length === 1 ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              <Image
                src={
                  players.filter((p) => p.isHost || p.isReady).length ===
                    players.length && players.length !== 1
                    ? "/assets/button-long-green.png"
                    : "/assets/button-long-red.png"
                }
                alt=""
                width={800}
                height={100}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
              />
              <span
                className={`relative z-15 text-2xl ${players.filter((p) => p.isHost || p.isReady).length === players.length && players.length !== 1 ? "text-black" : "text-white"}`}
              >
                Lancer la partie (
                {players.filter((p) => p.isHost || p.isReady).length}/
                {players.length})
              </span>
            </motion.button>
          )}
          {!isHost && (
            <motion.button
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleReady}
              className="relative w-full cursor-pointer rounded-full px-6 py-2 text-white shadow-black transition-shadow duration-300 hover:shadow-lg"
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
                className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
              />
              <span
                className={`relative z-15 text-2xl ${isReady ? "text-white" : "text-black"} `}
              >
                {isReady ? "Pas prêt" : "Prêt"}
              </span>
            </motion.button>
          )}
        </motion.div>

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
      </motion.div>

      <AnimatePresence>
        {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      </AnimatePresence>
    </section>
  );
}

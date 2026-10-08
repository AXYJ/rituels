"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";

import { useGame } from "../../context/GameContext";
import Logo from "../Logo";
import ImageButton from "../ImageButton";
import ErrorToast from "./ErrorToast";

const MotionImage = motion(Image);

const ROOM_CODE_LENGTH = 6;
// Durée de l'animation Lottie de la première visite
const LOTTIE_DURATION = 9.5;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, type: "spring", bounce: 0.6 },
  },
};

interface HeroSectionProps {
  onPlay: () => void;
  playDisabled: boolean;
  savedCode: string | null;
  isFirstVisit: boolean;
  hasCheckedVisit: boolean;
}

export default function HeroSection({
  onPlay,
  playDisabled,
  savedCode,
  isFirstVisit,
  hasCheckedVisit,
}: HeroSectionProps) {
  const { joinGame, setError, isConnected } = useGame();
  const [inputCode, setInputCode] = useState("");
  const joinable = inputCode.length === ROOM_CODE_LENGTH;

  // Si c'est la première visite, on attend la fin de l'animation Lottie
  const baseDelay = isFirstVisit ? LOTTIE_DURATION : 0.5;

  const frameVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 2,
        staggerChildren: 0.5,
        type: "spring",
        bounce: 0.6,
        delay: baseDelay,
      },
    },
  };

  const handleJoinGame = () => {
    setInputCode("");
    if (!isConnected) {
      setError("Connexion au serveur en cours... Veuillez patienter.");
      return;
    }
    if (inputCode.trim()) {
      setError(null);
      joinGame(inputCode);
    }
  };

  return (
    <section
      className="bg-[radial-gradient(ellipse_31.48%_48.47%_at_51.72%_50.00%,#464441_0%,#191918_100%)] pb-32"
      id="launch-btn"
    >
      <div className="relative flex min-h-screen flex-col items-center gap-2 overflow-hidden pt-12 lg:justify-center lg:gap-8 lg:pt-0">
        <AnimatePresence>
          <motion.div
            key="title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.6 }}
            className="flex w-1/2 flex-col items-center lg:w-full"
          >
            {hasCheckedVisit ? (
              isFirstVisit ? (
                <DotLottieReact
                  src="/final.json"
                  className="pointer-events-none h-auto w-full max-w-120"
                  autoplay
                />
              ) : (
                <Logo className="h-auto w-full max-w-120" />
              )
            ) : (
              <div className="aspect-2780/1042 h-auto w-full max-w-120" />
            )}
          </motion.div>

          <ErrorToast />

          <motion.div
            key="launch-container"
            variants={frameVariants}
            initial="hidden"
            animate={hasCheckedVisit ? "visible" : "hidden"}
            className="launch-btn flex w-8/10 max-w-120 flex-col items-center gap-4 lg:gap-12"
          >
            <ImageButton
              variant="long"
              variants={itemVariants}
              onClick={onPlay}
              disabled={playDisabled}
              className="w-full px-12 py-4"
            >
              Créer une nouvelle partie
            </ImageButton>

            <motion.div
              variants={itemVariants}
              className="items-between flex w-full gap-4 text-white"
            >
              <div className="need-border relative w-full">
                <input
                  type="text"
                  name="room-code"
                  placeholder="Code de la partie"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="relative z-20 w-full bg-transparent p-2 px-6 py-4 text-4xl text-white outline-none"
                  list="room-codes-list"
                  autoComplete="off"
                />
                <datalist id="room-codes-list">
                  {savedCode && <option value={savedCode} />}
                </datalist>
              </div>
              <ImageButton
                variant="short"
                onClick={handleJoinGame}
                className={`w-fit px-6 py-4 ${joinable ? "" : "pointer-events-none cursor-not-allowed opacity-50"}`}
              >
                Rejoindre
              </ImageButton>
            </motion.div>
          </motion.div>

          <motion.div
            key="scroll-indicator"
            initial={{ opacity: 0, y: 20 }}
            animate={
              hasCheckedVisit ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{
              duration: 1,
              type: "spring",
              bounce: 0.6,
              delay: baseDelay + 1,
            }}
            className="flex items-center pt-8"
          >
            <a href="#rules" className="flex flex-col items-center">
              <span className="text-3xl text-white">Règles du jeu</span>
              <motion.img
                whileTap={{ y: -8 }}
                src="/assets/arrow-down.png"
                alt=""
                width={800}
                height={100}
                className="z-0 mt-4 h-6 w-12 cursor-pointer object-fill lg:h-12 lg:w-24"
              />
            </a>
          </motion.div>
        </AnimatePresence>
        <MotionImage
          src="/assets/bg/path.png"
          alt=""
          width={517}
          height={69}
          className="pointer-events-none absolute top-2/3 z-0 hidden w-80 select-none lg:left-9/12 lg:block lg:w-lg"
          whileInView={hasCheckedVisit ? { opacity: 1 } : { opacity: 0 }}
          initial={{ opacity: 0 }}
          fetchPriority="high"
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.6,
            delay: baseDelay + 1.5,
            repeat: 0,
          }}
          viewport={{ once: true }}
          sizes="(min-width: 1024px) 512px, 0px"
        />
      </div>
    </section>
  );
}

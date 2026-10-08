"use client";

import { useState } from "react";

import { useGame } from "../../context/GameContext";
import { useFirstVisit } from "../../hooks/useFirstVisit";
import ImageButton from "../ImageButton";
import HomeHeader from "../home/HomeHeader";
import HeroSection from "../home/HeroSection";
import IntroSection from "../home/IntroSection";
import RulesSection from "../home/RulesSection";
import HomeFooter from "../home/HomeFooter";

export default function Home() {
  const { createGame, setError, isConnected, setView } = useGame();
  const { savedCode, isFirstVisit, hasCheckedVisit } = useFirstVisit();
  const [btnDisabled, setBtnDisabled] = useState(false);

  // Création d'une partie (déclenchée par le header et par le bouton principal)
  const startGame = () => {
    if (!isConnected) {
      setError("Connexion au serveur en cours... Veuillez patienter.");
      return;
    }
    setError(null);
    setBtnDisabled(true);
    createGame();
  };

  return (
    <>
      <HomeHeader onPlay={startGame} />
      <HeroSection
        onPlay={startGame}
        playDisabled={btnDisabled}
        savedCode={savedCode}
        isFirstVisit={isFirstVisit}
        hasCheckedVisit={hasCheckedVisit}
      />
      <IntroSection />
      <RulesSection />

      <section className="bg-[#191918] pb-32">
        <div className="flex items-center justify-center">
          <ImageButton
            variant="short"
            href="#launch-btn"
            className="flex w-80 items-center justify-center rounded-3xl px-12 py-4"
          >
            Lancer une partie
          </ImageButton>
        </div>
      </section>

      <HomeFooter setView={setView} />
    </>
  );
}

"use client";

// Import des modules
import { useEffect, useRef } from "react";

// Import du context
import { GameProvider, useGame } from "../context/GameContext";

// Import des composants
import Home from "../components/pages/home";
import Lobby from "../components/pages/Lobby";
import Game from "../components/pages/Game";
import MentionsLegales from "../components/pages/MentionsLegales";

function GameContent() {
  const { view } = useGame();

  // Rendu des vues
  // Rendu conditionnel plutôt que routing Next.js pour éviter de perdre la connexion WebSocket
  const baseView = view.split("#")[0];
  switch (baseView) {
    case "home":
      return <Home />;
    case "lobby":
      return <Lobby />;
    case "game":
      return (
        <>
          <AudioPlayer />
          <Game />
        </>
      );
    case "mentions-legales":
      return <MentionsLegales />;
    default:
      return <Home />;
  }
}

// Lecteur audio
function AudioPlayer() {
  const { volume } = useGame();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [volume]);

  useEffect(() => {
    const handleInteraction = () => {
      if (audioRef.current?.paused) {
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener("click", handleInteraction);
    };
    document.addEventListener("click", handleInteraction);
    return () => document.removeEventListener("click", handleInteraction);
  }, []);

  return (
    <audio ref={audioRef} autoPlay loop src="/sunshine_through_feathers.mp3" />
  );
}

export default function App() {
  return (
    <main>
      <GameProvider>
        <GameContent />
      </GameProvider>
    </main>
  );
}

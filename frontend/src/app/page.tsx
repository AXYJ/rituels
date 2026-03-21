"use client";

// Components
import { GameProvider, useGame } from "../context/GameContext";
import { useEffect, useRef } from "react";
import Home from "../components/pages/home";
import Lobby from "../components/pages/Lobby";
import Game from "../components/pages/Game";

function GameContent() {
  const { view } = useGame();

  // Rendu des vues
  // Rendu conditionnel plutôt que routing Next.js pour éviter de perdre la connexion WebSocket
  switch (view) {
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
    default:
      return <Home />;
  }
}

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

  return <audio ref={audioRef} autoPlay loop src="/music.wav" />;
}

export default function App() {
  return (
    <main className="bg-[radial-gradient(ellipse_31.48%_48.47%_at_51.72%_50.00%,_#464441_0%,_#191918_100%)]">
      <GameProvider>
        <GameContent />
      </GameProvider>
    </main>
  );
}

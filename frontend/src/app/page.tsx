"use client";

// Components
import { GameProvider, useGame } from "../context/GameContext";
import Header from "../components/header/Header";
import Home from "../components/pages/home";
import Lobby from "../components/pages/Lobby";
import Game from "../components/pages/Game";

function GameContent() {
  const { view, setView } = useGame();

  // Rendu des vues
  // Rendu conditionnel plutôt que routing Next.js pour éviter de perdre la connexion WebSocket
  switch (view) {
    case "home":
      return <Home />;
    case "lobby":
      return <Lobby />;
    case "game":
      return <Game />;
    default:
      return <Home />;
  }
}

export default function App() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl">
      <GameProvider>
        <Header />
        <GameContent />
      </GameProvider>
    </main>
  );
}

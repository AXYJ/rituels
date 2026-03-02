"use client";

// Components
import { GameProvider, useGame } from "../context/GameContext";
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
      return <Game />;
    default:
      return <Home />;
  }
}

export default function App() {
  return (
    <main className="">
      <GameProvider>
        <GameContent />
      </GameProvider>
    </main>
  );
}

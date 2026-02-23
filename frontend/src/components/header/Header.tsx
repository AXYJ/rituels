"use client";

// Modules
import { useState } from "react";

// Components
import Button from "./Button";
import RulesModal from "./RulesModal";
import QuitModal from "./QuitModal";

export default function Header() {
  // State
  const [showRules, setShowRules] = useState(false);
  const [quitGame, setQuitGame] = useState(false);

  // Functions
  const handleClick = () => {
    setQuitGame(true);
  };

  return (
    <header className="flex items-center justify-between p-4">
      <button onClick={() => handleClick()}>
        <h1>Rituels</h1>
      </button>
      <div className="flex gap-4">
        <Button onClick={() => setShowRules(true)}>Règles</Button>
      </div>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {quitGame && <QuitModal setQuitGame={setQuitGame} />}
    </header>
  );
}

"use client";

import { useState } from "react";
import { useGame } from "../../context/GameContext";

export default function PlayerNameInput() {
  const [name, setName] = useState("");

  const { changeName } = useGame();

  const handleValidate = (name: string) => {
    if (name.trim()) {
      changeName(name);
      setName("");
    }
  };

  return (
    <div className={`mb-4 flex items-center justify-center gap-4`}>
      <input
        type="text"
        placeholder="Entrez votre nom"
        className="rounded border p-2 text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={() => handleValidate(name)}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Valider
      </button>
    </div>
  );
}

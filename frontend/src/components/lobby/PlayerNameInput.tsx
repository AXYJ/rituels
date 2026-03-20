"use client";

import { useState } from "react";
import { useGame } from "../../context/GameContext";

export default function PlayerNameInput() {
  const [name, setName] = useState("");

  const { changeName } = useGame();

  const handleValidate = (name: string) => {
    const cleanName = name.trim().slice(0, 15);
    if (cleanName) {
      changeName(cleanName);
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
        maxLength={15}
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

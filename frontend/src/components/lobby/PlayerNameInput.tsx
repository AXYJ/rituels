'use client'

import { useState } from "react";
import { useGame } from "../../context/GameContext";

export default function PlayerNameInput() {


    const [name, setName] = useState("");

    const { changeName } = useGame();

    const handleValidate = (name: string) => {
        if (name.trim()) {
            changeName(name)
            setName("");
        }
    };

    return (
        <div className={`flex items-center justify-center min-h-[20vh] gap-4`}>
            <input
                type="text"
                placeholder="Entrez votre nom"
                className="p-2 border rounded text-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button
                onClick={() => handleValidate(name)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Valider
            </button>


        </div>
    );
}
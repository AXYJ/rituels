'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../../context/GameContext";

export default function Home() {
    const { createGame, joinGame } = useGame();

    const [inputCode, setInputCode] = useState("");
    const [btnDisabled, setBtnDisabled] = useState(false);

    const startGame = () => {
        setBtnDisabled(true);
        createGame();
    };

    const handleJoinGame = () => {
        if (inputCode.trim()) {
            joinGame(inputCode);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Rituels
                </h1>
                <p className="text-xl text-gray-400">Le jeu de cartes mystique</p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    disabled={btnDisabled}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg text-lg transition-colors ${btnDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Créer une partie
                </motion.button>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 bg-transparent border-2 border-purple-500 hover:bg-purple-500/20 text-white font-bold py-4 px-10 rounded-xl shadow-lg text-lg transition-colors"
                >
                    <input
                        type="text"
                        placeholder="Code de la partie"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        className="p-2 text-black rounded text-center w-full"
                    />
                    <button
                        onClick={handleJoinGame}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
                    >
                        Rejoindre
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
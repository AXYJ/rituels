'use client'

import { useGame } from "../../context/GameContext";

// Components
import PlayerNameInput from "../lobby/PlayerNameInput";

export default function Lobby() {
    const { setView, playerNames, roomCode } = useGame();
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">

            {playerNames.length > 0 && (
                <div className="mb-4">
                    <ul className="">
                        {playerNames.map((player, index) => (
                            <li key={index}>{player}</li>
                        ))}
                    </ul>
                </div>
            )}


            <p className="mb-4">En attente de joueurs...</p>
            <PlayerNameInput />
            <p className="mb-4">Code de la partie : {roomCode}</p>
            <div className="flex gap-4">
                <button
                    // onClick={onGameStart}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full"
                >
                    Start Game (Debug)
                </button>
                <button
                    onClick={() => setView("home")}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full"
                >
                    Retour
                </button>
            </div>
        </div>
    );
}

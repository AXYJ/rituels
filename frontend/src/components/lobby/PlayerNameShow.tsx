'use client'

import { useGame } from "../../context/GameContext";

export default function PlayerNameShow() {
    const { playerNames } = useGame();
    return (
        <div className="flex flex-col items-center justify-center min-h-[20vh] gap-4">
            {playerNames.map((player, index) => (
                <p key={index} className="text-xl text-gray-400">{player}</p>
            ))}
        </div>
    );
}
"use client";

import { useGame } from "../../context/GameContext";

export default function WinnerScreen() {
  const { winner, rules, players, resetGame } = useGame();

  const playerWin = players.find((p) => p.id === winner);
  return (
    <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/50">
      <div className="rounded-lg bg-gray-200 p-6">
        <h1>Le gagnant est {playerWin?.name}</h1>
        <p>Les règles de cet partie était :</p>
        <ul>
          {Object.entries(rules?.symbolRules || {}).map(
            ([symbol, value], index) => (
              <li key={`sym-${index}`}>
                {symbol} : {value} points
              </li>
            )
          )}
          {Object.entries(rules?.colorRules || {}).map(
            ([color, effect], index) => (
              <li key={`col-${index}`}>
                {color} : {effect}
              </li>
            )
          )}
        </ul>
        <button
          onClick={() => {
            resetGame();
          }}
        >
          Rejouer
        </button>
      </div>
    </div>
  );
}

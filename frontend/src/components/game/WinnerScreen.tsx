"use client";

import { useGame } from "../../context/GameContext";

export default function WinnerScreen() {
  const { winner, rules, players, resetGame, threshold } = useGame();

  const playerWin = players.find((p) => p.id === winner);
  return (
    <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/50 z-15">
      <div className="flex w-full max-w-[1024px] flex-col items-center rounded-lg bg-black p-6">
        <h2 className="mb-8 text-center font-bold">
          Bravo {playerWin?.name} ! <br />
          Vous êtes le premier à avoir atteint {threshold} graines
        </h2>
        <h3 className="mb-4 text-center">
          Voici les règles de cette partie :
        </h3>
        <div className="mb-8 flex justify-center gap-16">
          <ul>
            <h4 className="text-center text-4xl">Symboles</h4>
            {Object.entries(rules?.symbolRules || {}).map(
              ([symbol, value], index) => (
                <li key={`sym-${index}`} className="text-center text-2xl">
                  {symbol} : {value} points
                </li>
              )
            )}
          </ul>
          <ul>
            <h4 className="text-center text-4xl">Couleurs</h4>
            {Object.entries(rules?.colorRules || {}).map(
              ([color, effect], index) => (
                <li key={`col-${index}`} className="text-center text-2xl">
                  {color} : {effect}
                </li>
              )
            )}
          </ul>
        </div>
        <button
          onClick={() => {
            resetGame();
          }}
          className="cursor-pointer rounded bg-white px-16 py-4 text-3xl font-bold text-black"
        >
          Rejouer
        </button>
      </div>
    </div>
  );
}

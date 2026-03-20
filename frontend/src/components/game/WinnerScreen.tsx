"use client";

import { useGame } from "../../context/GameContext";

export default function WinnerScreen() {
  const { winner, rules, players, resetGame } = useGame();

  const playerWin = players.find((p) => p.id === winner);
  return (
    <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/50">
      <div className="rounded-lg bg-black p-6 max-w-[1024px] w-full flex flex-col items-center">
        <h2 className="text-6xl font-bold text-center mb-8">Bravo {playerWin?.name} ! <br />
          Vous êtes le premier à avoir atteint 20 graines
        </h2>
        <h3 className="text-center mb-4 text-4xl">Voici les règles de cette partie :</h3>
        <div className="flex gap-16 mb-8 justify-center">
          <ul>
            <h4 className="text-4xl text-center">Symboles</h4>
            {Object.entries(rules?.symbolRules || {}).map(
              ([symbol, value], index) => (
                <li key={`sym-${index}`} className="text-2xl text-center">
                  {symbol} : {value} points
                </li>
              )
            )}
          </ul>
          <ul>
            <h4 className="text-4xl text-center">Couleurs</h4>
            {Object.entries(rules?.colorRules || {}).map(
              ([color, effect], index) => (
                <li key={`col-${index}`} className="text-2xl text-center">
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
          className="bg-white text-black font-bold py-4 px-16 rounded text-3xl cursor-pointer"
        >
          Rejouer
        </button>
      </div>
    </div>
  );
}

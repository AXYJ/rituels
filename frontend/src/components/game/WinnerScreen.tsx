"use client";

import { useGame } from "../../context/GameContext";

export default function WinnerScreen() {
  const { winner, rules, players, resetGame, threshold, propositions } =
    useGame();

  const playerWin = players.find((p) => p.id === winner);
  return (
    <div className="fixed top-0 left-0 z-15 flex h-full w-full justify-center overflow-y-auto bg-black/50 lg:overflow-hidden">
      <div className="flex w-full max-w-[1024px] flex-col items-center overflow-y-auto rounded-lg bg-black p-6 lg:justify-center lg:gap-8 lg:overflow-hidden">
        <h2 className="mb-8 text-center font-bold">
          Bravo {playerWin?.name} ! <br />
          Vous êtes le premier à avoir atteint {threshold} graines
        </h2>
        <div className="flex gap-12">
          <div>
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
          </div>
          <div>
            <h3 className="mb-4 text-center">Vos propositions : </h3>
            <div className="mb-8 flex justify-center gap-16">
              <ul>
                <h4 className="text-center text-4xl">Symboles</h4>
                {Object.keys(rules?.symbolRules || {}).map((symbol, index) => {
                  const prop = propositions.symbolRules[symbol];
                  const actual = rules?.symbolRules[symbol];
                  const isCorrect = prop !== "" && Number(prop) === actual;

                  return (
                    <li
                      key={`prop-sym-${index}`}
                      className={`text-center text-2xl ${
                        isCorrect ? "text-green" : "text-red"
                      }`}
                    >
                      {symbol} : {prop || "--"} points
                    </li>
                  );
                })}
              </ul>
              <ul>
                <h4 className="text-center text-4xl">Couleurs</h4>
                {Object.keys(rules?.colorRules || {}).map((color, index) => {
                  const prop = propositions.colorRules[color];
                  const actual = rules?.colorRules[color];
                  const isCorrect = prop !== "" && prop === actual;

                  return (
                    <li
                      key={`prop-col-${index}`}
                      className={`text-center text-2xl ${
                        isCorrect ? "text-green" : "text-red"
                      }`}
                    >
                      {color} : {prop || "--"}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
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

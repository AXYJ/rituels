"use client";

import { useState } from "react";
import Image from "next/image";

import { useGame } from "../../context/GameContext";

export default function WinnerScreen() {
  const { winner, rules, players, resetGame, threshold, propositions, socket } =
    useGame();

  const [showRules, setShowRules] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const playerWin = players.find((p) => p.id === winner);
  return (
    <div className="absolute inset-0 z-60">
      <div className="relative z-10 flex min-h-[100vh] w-full flex-col items-center gap-4 overflow-y-auto rounded-lg bg-black p-6 lg:justify-center lg:gap-8 lg:overflow-hidden">
        {winner === socket?.id ? (
          <h2 className="text-center font-bold">
            Bravo {playerWin?.name} ! <br />
            Vous êtes le premier à avoir atteint {threshold} graines
          </h2>
        ) : (
          <h2 className="text-center font-bold">
            Dommage, le/la gagnant(e) est {playerWin?.name} ! <br />
            Il/Elle a atteint {threshold} graines avant toi.
          </h2>
        )}
        <div className="flex gap-18">
          <button
            className="relative px-12 py-2 transition-transform duration-300 ease-in-out hover:scale-110"
            onClick={() => {
              setShowRules(true);
              setShowLeaderboard(false);
            }}
          >
            <Image
              src="/assets/button-noborder-bottom.png"
              alt="settings"
              width={320}
              height={320}
              className="absolute inset-0 z-0 h-full w-full object-fill select-none"
            />
            <p className="relative text-black">Règles</p>
          </button>
          <button
            className="relative px-12 py-2 transition-transform duration-300 ease-in-out hover:scale-110"
            onClick={() => {
              setShowRules(false);
              setShowLeaderboard(true);
            }}
          >
            <Image
              src="/assets/button-noborder-bottom.png"
              alt="settings"
              width={320}
              height={320}
              className="absolute inset-0 z-0 h-full w-full object-fill select-none"
            />
            <p className="relative text-black">Classement</p>
          </button>
        </div>
        {showRules && (
          <div className="z-10 flex min-h-[66.66vh] gap-18 lg:min-h-[50vh]">
            <div>
              <h3 className="mb-4 text-center">
                Voici les règles de cette partie :
              </h3>
              <div className="mb-8 flex justify-center gap-12">
                <ul>
                  <h4 className="text-center text-4xl">Symboles</h4>
                  {Object.entries(rules?.symbolRules || {}).map(
                    ([symbol, value], index) => (
                      <li key={`sym-${index}`} className="text-2xl">
                        {symbol} : {value} points
                      </li>
                    )
                  )}
                </ul>
                <ul>
                  <h4 className="text-center text-4xl">Couleurs</h4>
                  {Object.entries(rules?.colorRules || {}).map(
                    ([color, effect], index) => (
                      <li key={`col-${index}`} className="text-2xl">
                        {color} : {effect}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-center">Vos propositions : </h3>
              <div className="mb-8 flex justify-center gap-12">
                <ul>
                  <h4 className="text-center text-4xl">Symboles</h4>
                  {Object.keys(rules?.symbolRules || {}).map(
                    (symbol, index) => {
                      const prop = propositions.symbolRules[symbol];
                      const actual = rules?.symbolRules[symbol];
                      const isCorrect = prop !== "" && Number(prop) === actual;

                      return (
                        <li
                          key={`prop-sym-${index}`}
                          className={`text-2xl ${
                            isCorrect ? "text-green" : "text-red"
                          }`}
                        >
                          {symbol} : {prop || "--"} points
                        </li>
                      );
                    }
                  )}
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
                        className={`text-2xl ${
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
        )}

        {showLeaderboard && (
          <div className="z-10 min-h-[66.66vh] gap-18 lg:min-h-[50vh]">
            <h3 className="mb-4 text-center">Classement :</h3>
            <div className="mb-8 flex justify-center gap-12">
              <ol className="list-inside list-decimal">
                {players
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <li key={`player-${index}`} className="text-2xl">
                      {player.name} : {player.score} graines
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            resetGame();
          }}
          className="z-10 cursor-pointer rounded bg-white px-16 py-4 text-3xl font-bold text-black transition-transform duration-300 ease-in-out hover:scale-110"
        >
          Rejouer
        </button>

        <Image
          src="/assets/bird-victory-1.png"
          alt="bird-victory-1"
          width={1920}
          height={1080}
          className="absolute top-1/3 left-0 z-0 h-1/3 w-auto -translate-y-1/2 object-contain opacity-70"
        ></Image>

        <Image
          src="/assets/bird-victory-2.png"
          alt="bird-victory-2"
          width={1920}
          height={1080}
          className="absolute bottom-0 left-0 z-0 h-1/3 w-auto object-contain opacity-70"
        ></Image>

        <Image
          src="/assets/bird-victory-3.png"
          alt="bird-victory-3"
          width={1920}
          height={1080}
          className="absolute right-1/10 bottom-0 z-0 h-1/4 w-auto object-contain opacity-70"
        ></Image>

        <Image
          src="/assets/bird-victory-4.png"
          alt="bird-victory-4"
          width={1920}
          height={1080}
          className="absolute top-1/2 right-0 z-0 h-1/2 w-auto -translate-y-1/2 object-contain opacity-70"
        ></Image>
      </div>
    </div>
  );
}

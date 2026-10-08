"use client";

import { useState } from "react";
import Image from "next/image";

import { useGame } from "../../context/GameContext";

type RuleItem = { key: string; text: string; correct?: boolean };

// Colonne titrée ; `correct` colore la ligne en vert ou rouge (propositions du joueur)
function RuleList({ title, items }: { title: string; items: RuleItem[] }) {
  return (
    <div>
      <h4 className="text-center text-4xl">{title}</h4>
      <ul>
        {items.map(({ key, text, correct }) => (
          <li
            key={key}
            className={`text-2xl ${correct === undefined ? "" : correct ? "text-green" : "text-red"}`}
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TabButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      className="relative px-12 py-2 transition-transform duration-300 ease-in-out hover:scale-110"
      onClick={onClick}
    >
      <Image
        src="/assets/button-noborder-bottom.png"
        alt=""
        width={320}
        height={320}
        className="absolute inset-0 z-0 h-full w-full object-fill select-none"
      />
      <p className="relative text-black">{children}</p>
    </button>
  );
}

export default function WinnerScreen() {
  const { winner, rules, players, resetGame, threshold, propositions, socket } =
    useGame();

  const [showRules, setShowRules] = useState(true);

  const playerWin = players.find((p) => p.id === winner);

  const activePlayers = players.filter((p) => !p.leavedPlayer);

  const symbolRules = rules?.symbolRules ?? {};
  const colorRules = rules?.colorRules ?? {};

  const actualSymbols = Object.entries(symbolRules).map(([symbol, value]) => ({
    key: symbol,
    text: `${symbol} : ${value} points`,
  }));
  const actualColors = Object.entries(colorRules).map(([color, effect]) => ({
    key: color,
    text: `${color} : ${effect}`,
  }));
  const guessedSymbols = Object.keys(symbolRules).map((symbol) => {
    const guess = propositions.symbolRules[symbol];
    return {
      key: symbol,
      text: `${symbol} : ${guess || "--"} points`,
      correct: guess !== "" && Number(guess) === symbolRules[symbol],
    };
  });
  const guessedColors = Object.keys(colorRules).map((color) => {
    const guess = propositions.colorRules[color];
    return {
      key: color,
      text: `${color} : ${guess || "--"}`,
      correct: guess !== "" && guess === colorRules[color],
    };
  });

  return (
    <div className="absolute inset-0 z-60">
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center gap-4 overflow-y-auto rounded-lg bg-black p-6 lg:justify-center lg:gap-8 lg:overflow-hidden">
        {winner === socket?.id ? (
          <h2 className="text-center font-bold">
            Bravo {playerWin?.name} ! <br />
            Vous êtes le premier à avoir atteint {threshold} graines
          </h2>
        ) : (
          <h2 className="text-center font-bold">
            Dommage, le/la gagnant(e) est {playerWin?.name} ! <br />
            Il/Elle a atteint {threshold} graines avant vous.
          </h2>
        )}
        <div className="flex gap-18">
          <TabButton onClick={() => setShowRules(true)}>Règles</TabButton>
          <TabButton onClick={() => setShowRules(false)}>Classement</TabButton>
        </div>
        {showRules ? (
          <div className="z-10 flex min-h-[66.66vh] gap-18 lg:min-h-[50vh]">
            <div>
              <h3 className="mb-4 text-center">
                Voici les règles de cette partie :
              </h3>
              <div className="mb-8 flex justify-center gap-12">
                <RuleList title="Symboles" items={actualSymbols} />
                <RuleList title="Couleurs" items={actualColors} />
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-center">Vos propositions : </h3>
              <div className="mb-8 flex justify-center gap-12">
                <RuleList title="Symboles" items={guessedSymbols} />
                <RuleList title="Couleurs" items={guessedColors} />
              </div>
            </div>
          </div>
        ) : (
          <div className="z-10 min-h-[66.66vh] gap-18 lg:min-h-[50vh]">
            <h3 className="mb-4 text-center">Classement :</h3>
            <div className="mb-8 flex justify-center gap-12">
              <ol className="list-inside list-decimal">
                {[...activePlayers]
                  .sort((a, b) => b.score - a.score)
                  .map((player) => (
                    <li key={player.id} className="text-2xl">
                      {player.name} : {player.score} graines
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        )}

        <button
          onClick={resetGame}
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

import { useEffect, useRef } from "react";

/** Fait « pulser » l'icône de graine quand le score change (grossit si gain, rétrécit si perte) */
export default function useScoreBump(score: number | undefined) {
  const seedRef = useRef<HTMLImageElement>(null);
  const prevScoreRef = useRef<number | null>(null);

  useEffect(() => {
    if (score === undefined) return;
    const diff =
      prevScoreRef.current === null ? 0 : score - prevScoreRef.current;
    prevScoreRef.current = score;
    if (diff === 0) return;

    seedRef.current?.animate(
      [
        { transform: "scale(1)" },
        { transform: `scale(${diff > 0 ? 1.2 : 0.8})` },
        { transform: "scale(1)" },
      ],
      { duration: 300, easing: "ease-in-out" }
    );
  }, [score]);

  return seedRef;
}

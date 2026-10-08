import { useEffect, useRef, useState } from "react";

/** Variations de score récentes (+3, -1…), chacune retirée de la liste après 1,5 s */
export default function useScoreDiffs(score: number | undefined) {
  const [diffs, setDiffs] = useState<{ id: number; diff: number }[]>([]);
  const prevScoreRef = useRef(score ?? 0);
  const nextIdRef = useRef(0);

  useEffect(() => {
    if (score === undefined || score === prevScoreRef.current) return;
    const diff = score - prevScoreRef.current;
    prevScoreRef.current = score;

    const id = nextIdRef.current++;
    setDiffs((prev) => [...prev, { id, diff }]);
    setTimeout(() => setDiffs((prev) => prev.filter((d) => d.id !== id)), 1500);
  }, [score]);

  return diffs;
}

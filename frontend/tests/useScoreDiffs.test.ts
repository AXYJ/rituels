import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useScoreDiffs from "../src/hooks/useScoreDiffs";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("aucune variation au premier rendu ni quand le score ne change pas", () => {
  const { result, rerender } = renderHook(({ score }) => useScoreDiffs(score), {
    initialProps: { score: 4 },
  });
  expect(result.current).toEqual([]);
  rerender({ score: 4 });
  expect(result.current).toEqual([]);
});

test("un gain et une perte apparaissent avec leur écart, puis disparaissent après 1,5 s", () => {
  const { result, rerender } = renderHook(({ score }) => useScoreDiffs(score), {
    initialProps: { score: 0 },
  });
  rerender({ score: 3 });
  rerender({ score: 2 });
  expect(result.current.map((d) => d.diff)).toEqual([3, -1]);

  act(() => {
    vi.advanceTimersByTime(1500);
  });
  expect(result.current).toEqual([]);
});

test("un score indéfini est ignoré", () => {
  const { result, rerender } = renderHook(
    ({ score }: { score: number | undefined }) => useScoreDiffs(score),
    { initialProps: { score: 1 as number | undefined } }
  );
  rerender({ score: undefined });
  expect(result.current).toEqual([]);
});

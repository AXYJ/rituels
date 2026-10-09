import { beforeEach, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";

import useScoreBump from "../src/hooks/useScoreBump";

const animate = vi.fn();

// jsdom ne connaît pas Element.animate
beforeEach(() => {
  animate.mockClear();
  Element.prototype.animate = animate;
});

function Seed({ score }: { score: number | undefined }) {
  const ref = useScoreBump(score);
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} alt="seed" />;
}

const scaleReached = () => animate.mock.calls[0][0][1].transform;

test("pas d'animation au premier rendu ni sans changement", () => {
  const { rerender } = render(<Seed score={2} />);
  rerender(<Seed score={2} />);
  expect(animate).not.toHaveBeenCalled();
});

test("la graine grossit sur un gain et rétrécit sur une perte", () => {
  const { rerender } = render(<Seed score={0} />);
  rerender(<Seed score={3} />);
  expect(scaleReached()).toBe("scale(1.2)");

  animate.mockClear();
  rerender(<Seed score={1} />);
  expect(scaleReached()).toBe("scale(0.8)");
});

test("score indéfini : rien ne se passe", () => {
  const { rerender } = render(<Seed score={undefined} />);
  rerender(<Seed score={undefined} />);
  expect(animate).not.toHaveBeenCalled();
});

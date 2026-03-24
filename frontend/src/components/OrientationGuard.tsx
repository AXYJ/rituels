"use client";

import { useEffect, useState } from "react";

export default function OrientationGuard() {
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);

  useEffect(() => {
    // Tente de forcer l'orientation en paysage sur les navigateurs le supportant
    const lockOrientation = async () => {
      try {
        const orientation = screen.orientation as any;
        if (orientation && typeof orientation.lock === "function") {
          await orientation.lock("landscape");
        }
      } catch (error) {
        console.warn(
          "Screen orientation lock not supported or blocked by the browser",
          error
        );
      }
    };

    lockOrientation();

    const checkOrientation = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      // Détection mobile simple
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen =
        window.innerWidth <= 1024 || window.innerHeight <= 1024;

      setIsMobilePortrait(isPortrait && hasTouch && isSmallScreen);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isMobilePortrait) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] p-6 text-center text-white select-none"
      style={{ touchAction: "none", zIndex: 99999 }}
    >
      <div className="mb-8 animate-pulse text-8xl">📱</div>
      <h2
        className="mb-4 text-4xl font-bold lg:text-5xl"
        style={{ fontFamily: "var(--font-family-sweet-and-salty)" }}
      >
        Tourner votre écran <br /> à l'horizontal
      </h2>
      <p
        className="mt-4 text-xl opacity-80 lg:text-2xl"
        style={{ fontFamily: "sans-serif" }}
      >
        L'affichage en mode portrait n'est pas supporté sur mobile.
      </p>
    </div>
  );
}

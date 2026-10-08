// Import des modules
import Image from "next/image";
import { useEffect } from "react";

// Import du contexte
import { useGame } from "../../context/GameContext";

// Import des sections
import CharteSection from "../legal/CharteSection";
import EditorSection from "../legal/EditorSection";
import PrivacySection from "../legal/PrivacySection";
import CreditsSection from "../legal/CreditsSection";

const Separator = () => <hr className="my-16 w-full border-white/10" />;

export default function MentionsLegales() {
  const { view, setView } = useGame();

  useEffect(() => {
    if (view === "mentions-legales#credits") {
      const timer = setTimeout(() => {
        document
          .getElementById("credits")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [view]);

  return (
    <div className="min-h-screen bg-[#191918] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => setView("home")}
          className="group mb-8 flex cursor-pointer items-center gap-2 text-white transition-colors hover:text-gray-300"
        >
          <Image
            src="/assets/arrow-down.png"
            alt="Retour"
            width={24}
            height={12}
            className="rotate-90 transition-transform group-hover:-translate-x-1"
          />
          <span>Retour à l&apos;accueil</span>
        </button>

        <CharteSection />
        <Separator />
        <EditorSection />
        <Separator />
        <PrivacySection />
        <Separator />
        <CreditsSection />
      </div>
    </div>
  );
}

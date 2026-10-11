import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ImageButton from "../../components/ImageButton";
import CharteSection from "../../components/legal/CharteSection";
import EditorSection from "../../components/legal/EditorSection";
import PrivacySection from "../../components/legal/PrivacySection";
import CreditsSection from "../../components/legal/CreditsSection";

export const metadata: Metadata = {
  title: "Mentions légales et confidentialité",
  description:
    "Mentions légales, politique de confidentialité, charte de bonne conduite et crédits de Rituels, jeu de cartes en ligne pour 2 à 4 joueurs.",
  alternates: { canonical: "/mentions-legales" },
};

const Separator = () => <hr className="my-16 w-full border-white/10" />;

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#191918] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="group mb-8 flex items-center gap-2 text-white transition-colors hover:text-gray-300"
        >
          <Image
            src="/assets/arrow-down.png"
            alt=""
            width={24}
            height={12}
            className="rotate-90 transition-transform group-hover:-translate-x-1"
          />
          <span>Retour à l&apos;accueil</span>
        </Link>

        <CharteSection />
        <Separator />
        <EditorSection />
        <Separator />
        <PrivacySection />
        <Separator />
        <CreditsSection />

        <div className="mt-16 flex justify-center">
          <ImageButton
            variant="long"
            href="/"
            className="rounded-3xl px-12 py-4"
          >
            Retour à l&apos;accueil
          </ImageButton>
        </div>
      </div>
    </main>
  );
}

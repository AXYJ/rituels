"use client";

import Image from "next/image";
import Footprints from "./Footprints";
import Reveal from "./Reveal";

export default function IntroSection() {
  return (
    <section
      className="relative min-h-[70dvh] overflow-x-hidden bg-[#191918] pb-64"
      id="univers"
    >
      <div
        className="relative z-5 flex flex-col items-center justify-center gap-8"
        id="explication"
      >
        <h2>Rapport Déclassifié : Laboratoire Skinner</h2>
        <div className="relative flex w-8/10 max-w-5xl flex-col gap-4 text-white lg:w-1/2">
          <Reveal className="overflow-hidden">
            En 1948, le psychologue B.F. Skinner a réussi à rendre des pigeons
            superstitieux en distribuant des graines de manière aléatoire. Le
            monde a acclamé ses travaux mais a également oublié ces pigeons.
          </Reveal>
          <Reveal className="overflow-hidden">
            Dans cette enceinte, l&apos;expérience ne s&apos;est jamais
            arretée. En tant que sujet d&apos;expérience, il vous est déconseillé
            de vous fier à vos instincts. Fiez-vous plutôt à votre sens de
            l&apos;observation. Vous disposerez de trois cartes en permanence.
            Analysez vos résultats, observez les autres sujets, et déduisez la
            logique changeante du système pour obtenir vos graines.
          </Reveal>
        </div>
      </div>
      <Image
        src="/assets/bg/cards-1.png"
        alt=""
        width={517}
        height={69}
        className="pointer-events-none absolute top-0 left-4 z-0 w-32 select-none lg:left-1/8 lg:w-48"
        sizes="(min-width: 1024px) 192px, 128px"
      />
      <Image
        src="/assets/bg/path-2.png"
        alt=""
        width={517}
        height={69}
        className="height-fit pointer-events-none absolute bottom-24 left-1/2 z-0 w-[50vw] select-none lg:bottom-16"
        sizes="50vw"
      />
      <Footprints />
    </section>
  );
}

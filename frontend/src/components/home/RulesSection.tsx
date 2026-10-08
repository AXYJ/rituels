"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import Reveal from "./Reveal";
// Textes des règles (source unique, partagée avec RulesModal.tsx)
import {
  RULES_PARAGRAPHS,
  RULES_EFFECTS,
  RULES_FOOTER_PARAGRAPHS,
} from "../../content/rulesText";

const MotionImage = motion(Image);

export default function RulesSection() {
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <section className="min-h-[70dvh] bg-[#191918] pb-48" id="rules">
      <div className="relative flex flex-col items-center justify-center gap-8">
        <h2>Protocole de jeu (règles)</h2>
        {playVideo ? (
          <iframe
            src="https://www.youtube-nocookie.com/embed/Cb2AY2S5HGs?autoplay=1"
            className="aspect-video w-8/10 max-w-5xl rounded-2xl border border-white/10 shadow-2xl lg:w-1/2"
            title="Rituels - Explication des règles"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div
            onClick={() => setPlayVideo(true)}
            className="relative aspect-video w-8/10 max-w-5xl cursor-pointer overflow-hidden border border-white/40 lg:w-1/2"
          >
            <Image
              src="/assets/video_preview.png"
              alt="Rituels - Explication des règles"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 80vw, 50vw"
              fetchPriority="high"
              priority
            />
            <div className="absolute inset-0 z-10 flex items-center justify-center transition-colors duration-300">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black text-white shadow-lg transition-transform duration-300 md:h-20 md:w-20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1 h-8 w-8 md:h-10 md:w-10"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        )}
        <div className="flex w-8/10 max-w-5xl flex-col gap-4 text-white lg:w-1/2">
          {RULES_PARAGRAPHS.map((text) => (
            <Reveal key={text} className="overflow-hidden">
              {text}
            </Reveal>
          ))}
          <Reveal
            as="ul"
            className="ml-4 list-inside list-disc text-2xl"
          >
            {RULES_EFFECTS.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </Reveal>
          {RULES_FOOTER_PARAGRAPHS.map((text) => (
            <Reveal key={text} className="overflow-hidden">
              {text}
            </Reveal>
          ))}
        </div>
        <MotionImage
          initial={{ opacity: 0, rotate: -45 }}
          whileInView={{ opacity: 1, rotate: 15 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.6,
            delay: 0.5,
            repeat: 0,
          }}
          className="pointer-events-none absolute bottom-1/4 -left-40 z-0 hidden w-48 origin-bottom rotate-45 overflow-hidden select-none lg:block"
          src="/assets/pigeon.png"
          alt=""
          width={517}
          height={517}
          sizes="(min-width: 1024px) 192px, 0px"
        />
      </div>
    </section>
  );
}

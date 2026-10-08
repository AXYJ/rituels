"use client";

import { motion } from "framer-motion";

// Pas qui apparaissent de droite à gauche (le délai diminue quand left augmente).
// Les classes sont écrites en entier pour que Tailwind les détecte.
const FOOTPRINTS = [
  { foot: "left", position: "bottom-30 left-[57%]", delay: 1.6 },
  { foot: "right", position: "bottom-36 left-[63%]", delay: 1.4 },
  { foot: "left", position: "bottom-30 left-[69%]", delay: 1.2 },
  { foot: "right", position: "bottom-36 left-[75%]", delay: 1 },
  { foot: "left", position: "bottom-30 left-[81%]", delay: 0.8 },
  { foot: "right", position: "bottom-36 left-[87%]", delay: 0.6 },
  { foot: "left", position: "bottom-30 left-[93%] hidden lg:block", delay: 0.4 },
];

export default function Footprints() {
  return (
    <>
      {FOOTPRINTS.map(({ foot, position, delay }) => (
        <motion.img
          key={position}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", bounce: 0.6, delay, repeat: 0 }}
          className={`pointer-events-none absolute z-0 w-16 select-none lg:w-24 ${position}`}
          src={`/assets/bg/${foot}-foot.png`}
          alt=""
          width={517}
          height={69}
        />
      ))}
    </>
  );
}

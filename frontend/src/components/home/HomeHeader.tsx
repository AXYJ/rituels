"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const LINKS = [
  { label: "Introduction", href: "#univers" },
  { label: "Règles", href: "#rules" },
];

const linkClass =
  "relative z-10 rounded-lg px-8 py-4 text-xl whitespace-nowrap text-white transition-all duration-300 hover:cursor-pointer hover:text-black lg:text-2xl";

export default function HomeHeader({ onPlay }: { onPlay: () => void }) {
  const items = [
    { label: "Jouer au jeu", href: "#", onClick: onPlay },
    ...LINKS.map((link) => ({ ...link, onClick: undefined })),
  ];

  return (
    <header className="absolute top-4 left-1/2 z-10 w-fit -translate-x-1/2 bg-transparent lg:top-8">
      <ul className="flex gap-4 lg:gap-16">
        {items.map(({ label, href, onClick }) => (
          <motion.li
            key={label}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.9 }}
            className="relative transition-all duration-300 hover:shadow-lg"
          >
            <Image
              src="/assets/button-short.png"
              alt=""
              width={300}
              height={100}
              className="header-btn-bg pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
            />
            <a href={href} className={linkClass} onClick={onClick}>
              {label}
            </a>
          </motion.li>
        ))}
      </ul>
    </header>
  );
}

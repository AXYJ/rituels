"use client";

import { ReactNode } from "react";
import { motion, TargetAndTransition, Variants } from "framer-motion";
import Image from "next/image";

// Bouton dont le fond est une image du jeu ; devient un lien si `href` est fourni
const BACKGROUNDS = {
  short: { src: "/assets/button-short.png", width: 300 },
  long: { src: "/assets/button-long.png", width: 800 },
  "long-white": { src: "/assets/button-long-white.png", width: 800 },
  "long-green": { src: "/assets/button-long-green.png", width: 800 },
  "long-red": { src: "/assets/button-long-red.png", width: 800 },
  "long-border": { src: "/assets/button-long-border.png", width: 800 },
};

export type ImageButtonVariant = keyof typeof BACKGROUNDS;

interface ImageButtonProps {
  variant: ImageButtonVariant;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variants?: Variants;
  whileHover?: TargetAndTransition;
  // Classes du texte (taille et couleur)
  textClassName?: string;
  // Forme, taille et espacement du bouton
  className?: string;
  children: ReactNode;
}

export default function ImageButton({
  variant,
  href,
  onClick,
  disabled,
  variants,
  whileHover = { y: -8 },
  textClassName = "text-4xl text-black",
  className = "",
  children,
}: ImageButtonProps) {
  const { src, width } = BACKGROUNDS[variant];
  const content = (
    <>
      <Image
        src={src}
        alt=""
        width={width}
        height={100}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
      />
      <span className={`relative z-10 text-nowrap ${textClassName}`}>
        {children}
      </span>
    </>
  );
  const props = {
    variants,
    whileHover,
    whileTap: { scale: 0.9 },
    className: `relative cursor-pointer shadow-black transition-shadow duration-300 hover:shadow-lg disabled:cursor-not-allowed ${className}`,
  };

  return href ? (
    <motion.a href={href} {...props}>
      {content}
    </motion.a>
  ) : (
    <motion.button onClick={onClick} disabled={disabled} {...props}>
      {content}
    </motion.button>
  );
}

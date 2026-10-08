"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

// Bouton dont le fond est une image du jeu ; devient un lien si `href` est fourni
const BACKGROUNDS = {
  short: { src: "/assets/button-short.png", width: 300 },
  long: { src: "/assets/button-long.png", width: 800 },
};

interface ImageButtonProps {
  variant: "short" | "long";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variants?: Variants;
  className?: string;
  children: ReactNode;
}

export default function ImageButton({
  variant,
  href,
  onClick,
  disabled,
  variants,
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
      <span className="relative z-10 text-4xl text-nowrap text-black">
        {children}
      </span>
    </>
  );
  const props = {
    variants,
    whileHover: { y: -8 },
    whileTap: { scale: 0.9 },
    className: `relative cursor-pointer rounded-3xl shadow-black transition-shadow duration-300 hover:shadow-lg ${className}`,
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

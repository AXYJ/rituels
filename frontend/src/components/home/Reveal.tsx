"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

// Texte qui apparaît au scroll, une seule fois
export default function Reveal({
  as = "p",
  className,
  children,
}: {
  as?: "p" | "ul";
  className: string;
  children: ReactNode;
}) {
  const Tag = as === "ul" ? motion.ul : motion.p;
  return (
    <Tag
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, type: "spring", bounce: 0.6, repeat: 0 }}
      className={className}
    >
      {children}
    </Tag>
  );
}

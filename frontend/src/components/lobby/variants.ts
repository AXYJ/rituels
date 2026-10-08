import { Variants } from "framer-motion";

// Animation d'entrée du lobby : les blocs apparaissent l'un après l'autre
export const frameVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.2, // Délai entre chaque bloc
      type: "spring",
      bounce: 0.6,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, type: "spring", bounce: 0.6 },
  },
};

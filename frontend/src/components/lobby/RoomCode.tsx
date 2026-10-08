"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import CodeCopiedToast from "../CodeCopiedToast";
import { useGame } from "../../context/GameContext";
import copyToClipboard from "../../utils/copyToClipboard";
import { itemVariants } from "./variants";

export default function RoomCode() {
  const { roomCode } = useGame();
  const [copySuccess, setCopySuccess] = useState(false);

  return (
    <>
      <motion.h1
        variants={itemVariants}
        className="relative flex items-center gap-4 text-3xl lg:text-5xl"
      >
        Code : <span className="tracking-widest">{roomCode}</span>{" "}
        <button
          onClick={() => copyToClipboard(roomCode, setCopySuccess)}
          className="cursor-pointer"
        >
          <Image
            src="/assets/copy.png"
            alt="Copier"
            width={40}
            height={40}
            className="h-10 w-10 transition-transform duration-300 ease-in-out hover:-translate-y-2"
          />
        </button>
      </motion.h1>

      <CodeCopiedToast show={copySuccess} />
    </>
  );
}

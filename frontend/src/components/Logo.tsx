"use client";

import Image from "next/image";
import { View } from "../types/game";

export default function Logo({
  className,
  setView,
  onClick,
  onHoverScale,
}: {
  className?: string;
  setView?: (view: View) => void;
  onClick?: () => void;
  onHoverScale?: boolean;
}) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (setView) {
      setView("home");
    }
  };

  return (
    <div
      className={`z-100 flex items-center justify-center ${onHoverScale ? "hover:scale-110 transition-transform duration-300 ease-in-out" : ""} ${setView || onClick ? "cursor-pointer" : ""} ${className || ""}`}
      onClick={handleClick}
    >
      <Image
        src="/logo-v4.png"
        alt="Logo"
        width={2780}
        height={1042}
        className="pointer-events-none h-auto w-full object-contain"
        fetchPriority="high"
        loading="eager"
      />
    </div>
  );
}

"use client";

import Image from "next/image";

export default function Logo({
  className,
  setView,
  onClick,
}: {
  className?: string;
  setView?: (view: any) => void;
  onClick?: () => void;
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
      className={`z-100 flex items-center justify-center ${setView || onClick ? "cursor-pointer" : ""} ${className || ""}`}
      onClick={handleClick}
    >
      <Image
        src="/logo-v4.png"
        alt="Logo"
        width={2780}
        height={1042}
        className="pointer-events-none h-auto w-full object-contain"
        loading="eager"
      />
    </div>
  );
}

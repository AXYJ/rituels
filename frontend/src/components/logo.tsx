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
      className={`flex items-center justify-center ${setView || onClick ? "cursor-pointer" : ""} ${className || ""}`}
      onClick={handleClick}
    >
      <Image
        src="/logo-v3.png"
        alt="Logo"
        width={500}
        height={500}
        className="pointer-events-none w-1/2 lg:w-full"
      />
    </div>
  );
}

"use client";

import Image from "next/image";

export default function Logo({
  className,
  setView,
}: {
  className?: string;
  setView?: (view: any) => void;
}) {
  return (
    <div
      className={`flex items-center ${setView ? "cursor-pointer" : ""}${className || ""}`}
      onClick={() => setView?.("home")}
    >
      <Image src="/logo-v3.png" alt="Logo" width={500} height={500} />
    </div>
  );
}

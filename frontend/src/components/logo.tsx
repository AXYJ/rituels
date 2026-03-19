"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image src="/logo-v3.png" alt="Logo" width={500} height={500} />
    </div>
  );
}

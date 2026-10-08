"use client";

import { useSyncExternalStore } from "react";
import type { JSX } from "react/jsx-runtime";

// Adresse assemblée côté client uniquement : absente du HTML servi aux bots sans JS.
const EMAIL = ["contact", "xiao-web.com"].join("@");
const subscribe = () => () => {};

export default function EmailLink({ className }: { className?: string }): JSX.Element {
  // Rendu serveur (et hydratation) : chaîne vide, puis l'adresse une fois monté
  const email = useSyncExternalStore(subscribe, () => EMAIL, () => "");

  if (!email) {
    return <span className={className}>contact [at] xiao-web [dot] com</span>;
  }

  return (
    <a className={className} href={`mailto:${email}`}>
      {email}
    </a>
  );
}

"use client";

import { View } from "../../types/game";

const LEGAL_LINKS: { label: string; view: View }[] = [
  { label: "Mentions Légales", view: "mentions-legales" },
  { label: "Crédits", view: "mentions-legales#credits" },
];

export default function HomeFooter({
  setView,
}: {
  setView: (view: View) => void;
}) {
  return (
    <footer className="bg-[#191918] py-8 text-center text-white">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex gap-16">
          {LEGAL_LINKS.map(({ label, view }) => (
            <button
              key={view}
              onClick={() => setView(view)}
              className="cursor-pointer hover:underline"
            >
              <p>{label}</p>
            </button>
          ))}
        </div>

        <div>
          <p>Créé par : Alex Xiao</p>
          <p>© Rituels 2026 | Tous droits réservés </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useRouter } from "next/navigation";

export default function QuitModal({
  setQuitGame,
}: {
  setQuitGame: (quitGame: boolean) => void;
}) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="rounded bg-white p-4">
        <h2>Cette action vous fera quitter la partie</h2>
        <p>Êtes-vous sûr de vouloir quitter ?</p>
        <div className="flex gap-4">
          <button
            className="rounded bg-red-500 px-4 py-2 text-white"
            onClick={() => {}}
          >
            Quitter
          </button>
          <button
            className="rounded bg-gray-500 px-4 py-2 text-white"
            onClick={() => setQuitGame(false)}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

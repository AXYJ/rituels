'use client'

import { useRouter } from "next/navigation";

export default function QuitModal({ setQuitGame }: { setQuitGame: (quitGame: boolean) => void }) {
    const router = useRouter();
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded">
                <h2>Cette action vous fera quitter la partie</h2>
                <p>Êtes-vous sûr de vouloir quitter ?</p>
                <div className="flex gap-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => {}}>Quitter</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setQuitGame(false)}>Annuler</button>
                </div>
            </div>
        </div>
    );
}
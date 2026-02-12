'use client'

export default function Game() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <h1 className="text-4xl font-bold mb-8">Partie en cours</h1>
            <button
                onClick={() => { }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full"
            >
                Quitter la partie
            </button>
        </div>
    );
}

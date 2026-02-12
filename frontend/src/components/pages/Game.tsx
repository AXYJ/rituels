"use client";

export default function Game() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl font-bold">Partie en cours</h1>
      <button
        onClick={() => {}}
        className="rounded-full bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600"
      >
        Quitter la partie
      </button>
    </div>
  );
}

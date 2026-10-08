"use client";

// Import du contexte
import { useGame } from "../../context/GameContext";
import ImageButton from "../ImageButton";

const buttonClass = "w-full rounded-full px-6 py-2";

export default function QuitModal({ onClose }: { onClose: () => void }) {
  const { quitLobby } = useGame();
  return (
    <div className="fixed top-0 left-0 z-60 flex h-full w-full justify-center overflow-y-auto bg-black/80 lg:overflow-hidden">
      <div className="flex h-full w-full items-center">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center overflow-y-auto rounded-lg p-6 lg:justify-center lg:gap-8 lg:overflow-hidden">
          <h2 className="mb-8 text-center">
            Voulez-vous vraiment quitter la partie ?
          </h2>
          <div className="flex w-4/5 gap-18">
            <ImageButton
              variant="long-white"
              whileHover={{ scale: 1.05 }}
              textClassName="text-2xl text-black"
              className={buttonClass}
              onClick={onClose}
            >
              Annuler
            </ImageButton>
            <ImageButton
              variant="long-red"
              whileHover={{ scale: 1.05 }}
              textClassName="text-2xl text-white"
              className={buttonClass}
              onClick={() => {
                quitLobby();
                onClose();
              }}
            >
              Quitter
            </ImageButton>
          </div>
        </div>
      </div>
    </div>
  );
}

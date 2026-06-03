"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { useState } from "react";
import Image from "next/image";

import CopyCodeRoom from "../../hooks/CopyCodeRoom";

export default function RulesModal({
  onClose,
  onQuit,
}: {
  onClose: () => void;
  onQuit?: () => void;
}) {
  const { volume, setVolume, sfxVolume, setSfxVolume, roomCode } = useGame();

  const [settings, setSettings] = useState(true);
  const [rules, setRules] = useState(false);

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = () => {
    CopyCodeRoom({ roomCode, setCopySuccess });
  };

  const handleClick = (e: React.MouseEvent) => {
    const id = e.currentTarget.id;
    if (id === "settings-btn") {
      setSettings(true);
      setRules(false);
    } else if (id === "rules-btn") {
      setRules(true);
      setSettings(false);
    } else if (id === "quit-btn") {
      onQuit?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 z-40 h-full w-full bg-black/70"
      onClick={() => onClose()}
    >
      <div
        className="fixed top-1/2 left-1/2 z-50 h-[90vh] w-1/2 max-w-2xl -translate-x-1/2 -translate-y-1/2 lg:w-11/12"
        style={{ anchorName: "--settings" } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full w-full flex-col gap-8 overflow-y-auto rounded-lg bg-black p-6 text-white shadow-lg [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="close absolute top-4 right-4 h-8 w-8">
            <button onClick={() => onClose()}>
              <Image
                src="/assets/close.png"
                alt="Fermer"
                width={32}
                height={32}
                className="h-4 w-4 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 lg:h-8 lg:w-8"
              />
            </button>
          </div>
          <div id="settings" className={settings ? "block" : "hidden"}>
            <h2 className="text-center text-4xl">Réglages</h2>
            <div className="flex flex-col gap-2">
              <h3 className="my-4 flex items-center justify-center gap-2 text-center">
                Code : {roomCode}{" "}
                <Image
                  src="/assets/copy.png"
                  alt="Copier"
                  width={32}
                  height={32}
                  className="h-4 w-4 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 lg:h-8 lg:w-8"
                  onClick={handleCopyCode}
                />
              </h3>
              <div className="grid grid-cols-5 items-center gap-2">
                <label htmlFor="sfx" className="col-span-1 text-2xl">
                  Effets sonores
                </label>
                <input
                  type="range"
                  id="sfx"
                  step={0.01}
                  min={0}
                  max={1}
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                  className="col-span-3 h-2 cursor-pointer appearance-none rounded-full bg-white/50 outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
                <input
                  type="checkbox"
                  checked={sfxVolume > 0}
                  onChange={(e) => setSfxVolume(e.target.checked ? 0.5 : 0)}
                  className="col-span-1 h-8 w-8 rounded-full"
                />
              </div>
              <div className="grid grid-cols-5 items-center gap-2">
                <label htmlFor="ost" className="col-span-1 text-2xl">
                  Musique de fond
                </label>
                <input
                  type="range"
                  id="ost"
                  step={0.01}
                  min={0}
                  max={1}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="col-span-3 h-2 cursor-pointer appearance-none rounded-full bg-white/50 outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
                <input
                  type="checkbox"
                  checked={volume > 0}
                  onChange={(e) => setVolume(e.target.checked ? 0.5 : 0)}
                  className="col-span-1 h-8 w-8 rounded-full"
                />
              </div>
            </div>
          </div>

          <div
            id="rules"
            className={`flex-col gap-6 ${rules ? "flex" : "hidden"}`}
          >
            <div className="flex flex-col items-center justify-center gap-8 pt-8">
              <h2>Protocole de jeu</h2>
              <iframe
                src="https://youtu.be/jhxZaYCYIco"
                className="aspect-video w-full"
                loading="lazy"
                title="Rituels - Explication des règles"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
              <div className="flex max-w-[1024px] flex-col gap-4 text-white">
                <p>
                  Rituels est un jeu de cartes expérimental pour 2 à 4 joueurs
                  où le but est d&apos;être le premier joueur à atteindre le
                  quota de graines fixé à l&apos;avance.
                </p>
                <p>
                  Pour gagner des graines, vous disposerez à tout moment de 3
                  cartes.
                </p>
                <p>
                  Chaque carte est une combinaison de deux éléments : un symbole
                  et une couleur.
                </p>
                <p>Chaque symbole a une valeur différente entre -1 et 3.</p>
                <p>
                  Chaque couleur a un pouvoir qui influence le cours du jeu :
                  inversion, gel, répétition et neutre.
                </p>
                <ul className="ml-4 list-inside list-disc text-2xl">
                  <li>
                    L&apos;inversion inverse la valeur de la carte jouée. Si le
                    symbole vaut 2, alors la carte vaudra -2.
                  </li>
                  <li>
                    Le gel empêche le joueur suivant de gagner des graines.
                    Qu&apos;importe ce que le jouer suivant joue, il ne gagnera
                    ni ne perdra de points.
                  </li>
                  <li>
                    La répétition répète le pouvoir de la carte précédemment
                    jouée. Si la carte précédente avait le pouvoir
                    &quot;gel&quot;, cette carte aura aussi l&apos;effet
                    &quot;gel&quot;.
                  </li>
                  <li>
                    Neutre n&apos;a aucun effet mais est présent deux fois.
                  </li>
                </ul>
                <p>
                  Les valeurs des symboles et les pouvoirs des couleurs sont
                  répartis aléatoirement à chaque partie.
                </p>
                <p>À votre tour, vous devez jouer une carte de votre main.</p>
                <p>
                  Le joueur dont le score atteint ou dépasse le quota défini en
                  premier remporte la partie.
                </p>
                <p>
                  Pour vous aidez, vous avez à votre disposition un bloc-notes
                  où vous pouvez noter vos hypothèses ainsi qu&apos;une
                  messagerie qui recense toutes les cartes qui ont été jouées.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className={`aside-btn-1 absolute cursor-pointer rounded-lg rounded-r-none bg-white px-4 py-2 text-center text-2xl text-black transition-all duration-300 hover:w-48 lg:text-4xl ${settings ? "w-32 lg:w-48" : "w-24 lg:w-40"}`}
              id="settings-btn"
              onClick={handleClick}
            >
              Réglages
            </button>
            <button
              className={`aside-btn-2 absolute cursor-pointer rounded-lg rounded-r-none bg-white px-4 py-2 text-center text-2xl text-black transition-all duration-300 hover:w-48 lg:text-4xl ${rules ? "w-32 lg:w-48" : "w-24 lg:w-40"}`}
              id="rules-btn"
              onClick={handleClick}
            >
              Règles
            </button>
            <button
              className={`aside-btn-3 bg-red absolute w-24 cursor-pointer rounded-lg rounded-r-none px-4 py-2 text-center text-2xl text-white transition-all duration-300 hover:w-48 lg:w-40 lg:text-4xl`}
              id="quit-btn"
              onClick={handleClick}
            >
              Quitter
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {copySuccess && (
          <motion.div
            key="copy-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 z-100 -translate-x-1/2 rounded bg-green-500 px-4 py-2 text-4xl text-white"
          >
            Code copié !
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

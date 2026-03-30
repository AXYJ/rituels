"use client";

import { motion } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { useState } from "react";
import Image from "next/image";

export default function RulesModal({ onClose }: { onClose: () => void }) {
  const { volume, setVolume, sfxVolume, setSfxVolume, quitLobby } = useGame();

  const [settings, setSettings] = useState(true);
  const [rules, setRules] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    const id = e.currentTarget.id;
    if (id === "settings-btn") {
      setSettings(true);
      setRules(false);
    } else if (id === "rules-btn") {
      setRules(true);
      setSettings(false);
    } else if (id === "quit-btn") {
      quitLobby();
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
        style={{ "anchor-name": "--settings" } as React.CSSProperties}
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
            <div className="flex flex-col items-center justify-center gap-8">
              <h2>Fonctionnement du système</h2>
              <div className="flex max-w-[1024px] flex-col gap-4 text-white">
                <Image
                  src="/screen/game.png"
                  alt="Aperçu de l'interface"
                  width={1500}
                  height={844}
                  className="mb-8 h-auto w-full rounded-lg shadow-md"
                />
                <p>Aperçu de l'interface :</p>
                <p>
                  1 — Réglages : ajustement des paramètres sonores et rappel des
                  protocoles ;
                </p>
                <p>
                  2 — Console de suivi : historique des cartes jouées et
                  communications entre spécimens ;
                </p>
                <p>3 — Deck : les cartes actuellement en votre possession ;</p>
                <p>
                  4 — Bloc-notes : un espace pour consigner vos découvertes sur
                  les règles en vigueur ;
                </p>
                <p>
                  5 — Compteur : points accumulés (attention, les valeurs
                  négatives sont possibles).
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-8 pt-8">
              <h2>Protocole de jeu</h2>
              <div className="flex max-w-[1024px] flex-col gap-4 text-white">
                <p>
                  Rituels est un jeu de cartes expérimental pour 2 à 4 joueurs.
                </p>
                <p>
                  Les cartes sont composées de 2 éléments : un symbole et une
                  couleur. Chaque symbole possède une valeur fixe (de -1 à 3),
                  tandis que chaque couleur possède un pouvoir.
                </p>
                <p>
                  Au lancement de chaque partie, le système distribue
                  aléatoirement les valeurs et les pouvoirs. Votre but est
                  d'identifier ces variables avant vos adversaires et être le
                  premier à atteindre le score défini (seuil de victoire).
                </p>
                <p>Les pouvoirs possibles sont les suivants :</p>
                <ul className="flex flex-col gap-2">
                  <li className="ml-5 list-disc text-2xl">
                    Inversion : inverse la valeur du symbole de la carte que
                    vous jouez (un 2 devient -2) ;
                  </li>
                  <li className="ml-5 list-disc text-2xl">
                    Gel : le prochain joueur ne reçoit aucun point ;
                  </li>
                  <li className="ml-5 list-disc text-2xl">
                    Répétition : la carte copie le pouvoir de la carte
                    précédemment jouée;
                  </li>
                  <li className="ml-5 list-disc text-2xl">
                    Neutre : la valeur du symbole est appliquée sans
                    modification.
                  </li>
                </ul>
                <p>
                  Note : chaque symbole possède une valeur unique. Pour les
                  couleurs, deux d'entre elles sont systématiquement "Neutres",
                  les autres se partagent les pouvoirs restants.
                </p>
                <p>À votre tour, vous devez jouer une carte de votre main.</p>
                <p>
                  Le joueur dont le score atteint ou dépasse le seuil défini en
                  premier remporte la partie.
                </p>
                <p>
                  Pour vous aider, vous pouvez utiliser le bloc-notes pour noter
                  vos découvertes.
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
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { useState } from "react";

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
        style={{ "--anchor-name": "--settings" } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full w-full flex-col gap-8 overflow-y-auto rounded-lg bg-black p-6 text-white shadow-lg [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent">
          <div id="settings" className={settings ? "block" : "hidden"}>
            <h2 className="text-center text-4xl font-bold">Réglages</h2>
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
            <h2 className="text-center text-4xl font-bold">
              Objectif de l'itération
            </h2>
            <p>
              Bienvenue dans votre session de test. Votre objectif est de
              saturer votre compteur de graines (points) avant les autres
              spécimens. Le premier sujet à atteindre le seuil critique (15
              unités par défaut) valide l'expérience et met fin à la session.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-bold">Déroulement du test</h3>
                <p>Chaque session regroupe 2 à 4 sujets.</p>

                <ul className="text-2xl">
                  <li>
                    Main : Vous disposez en permanence de 3 cartes en main.
                  </li>
                  <li>
                    Soumission : À votre tour, vous devez jouer une seule carte.
                  </li>
                  <li>
                    Récupération : Une nouvelle carte est immédiatement ajoutée
                    à votre main pour maintenir votre stock à trois cartes.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-bold">Analyse des vecteurs</h3>

                <p>
                  Chaque carte est une combinaison de deux variables instables :
                </p>

                <ul className="text-2xl">
                  <li>
                    <strong>Le Symbole</strong> : Détermine la valeur brute en
                    points (comprise entre -1 et 3). C’est l’accumulation de ces
                    valeurs qui vous rapproche de la victoire.
                  </li>
                  <li>
                    <strong>La Couleur</strong> : Déclenche un pouvoir qui
                    altère le calcul des points :
                    <ul className="list-inside list-disc text-2xl">
                      <li>
                        Inversion : La valeur des points est inversée (ex: un 2
                        devient -2).
                      </li>
                      <li>
                        Gel : Le joueur suivant ne pourra gagner aucune graine
                        lors de son prochain tour (score forcé à 0).
                      </li>
                      <li>
                        Répétition : Le système reproduit le pouvoir de la carte
                        précédemment jouée.
                      </li>
                      <li>
                        Neutre : La valeur du symbole est appliquée sans
                        modification (2 teintes possèdent cet état).
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-bold">
                  Note sur l'instabilité du Système
                </h3>

                <p>
                  Attention : Au lancement de chaque nouvelle session, les
                  effets des cartes sont réinitialisés. Les valeurs des symboles
                  et les pouvoirs des couleurs sont redistribués aléatoirement.
                </p>
                <p>
                  Ce qui était vrai lors de l'itération précédente est désormais
                  caduc. Votre survie dépend de votre capacité à observer les
                  résultats de chaque carte pour déduire les lois du protocole
                  en cours.
                </p>
              </div>
            </div>
          </div>
          <button
            className={`aside-btn-1 absolute rounded-lg rounded-r-none bg-white px-4 py-2 text-center text-2xl font-bold text-black transition-all duration-300 hover:w-48 lg:text-4xl ${settings ? "w-32 lg:w-48" : "w-24 lg:w-40"}`}
            id="settings-btn"
            onClick={handleClick}
          >
            Réglages
          </button>
          <button
            className={`aside-btn-2 absolute rounded-lg rounded-r-none bg-white px-4 py-2 text-center text-2xl font-bold text-black transition-all duration-300 hover:w-48 lg:text-4xl ${rules ? "w-32 lg:w-48" : "w-24 lg:w-40"}`}
            id="rules-btn"
            onClick={handleClick}
          >
            Règles
          </button>
          <button
            className={`aside-btn-3 bg-red absolute w-24 lg:w-40 rounded-lg rounded-r-none px-4 py-2 text-center text-2xl font-bold text-white transition-all duration-300 hover:w-48 lg:text-4xl`}
            id="quit-btn"
            onClick={handleClick}
          >
            Quitter
          </button>
        </div>
      </div>
    </motion.div>
  );
}

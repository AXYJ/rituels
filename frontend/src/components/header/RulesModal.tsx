"use client";

import { motion } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { useState } from "react";

export default function RulesModal({ onClose }: { onClose: () => void }) {
  const { volume, setVolume, sfxVolume, setSfxVolume } = useGame();

  const [settings, setSettings] = useState(true);
  const [rules, setRules] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    const id = e.currentTarget.id;
    if (id === "settings-btn") {
      setSettings(!settings);
      setRules(settings);
    } else if (id === "rules-btn") {
      setRules(!rules);
      setSettings(rules);
    } else if (id === "close-btn") {
      onClose();
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
        className="fixed top-1/2 left-1/2 z-50 h-[90vh] w-11/12 max-w-2xl -translate-x-1/2 -translate-y-1/2"
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
                  step={0.1}
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
                  step={0.1}
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
              Procédure du protocole
            </h2>
            <p>
              Bienvenue dans votre session de test. Votre objectif est simple :
              soyez le premier sujet à accumuler le nombre de graines convenu au
              début du protocole (20 par défaut) pour valider l&apos;expérience.
            </p>

            <div className="flex flex-col gap-2">
              <h3 className="text-3xl font-bold">Déroulement de la session</h3>

              <p>
                Chaque session regroupe 2 à 4 sujets. Vous commencez avec une
                dotation de 3 cartes en main. À son tour, le sujet doit choisir
                et soumettre une seule de ses cartes. Une fois la carte jouée,
                une nouvelle est immédiatement ajoutée à sa main afin qu&apos;il
                en ait toujours trois à disposition.
              </p>

              <p>Chaque carte est composée de deux variables : </p>

              <ul className="text-2xl">
                <li>
                  <strong>Le symbole</strong> détermine la valeur en points
                  d&apos;une carte lorsqu&apos;elle est posée. Ces valeurs sont
                  comprises entre -1 et 3. C&apos;est en cumulant ces points que
                  vous pourrez atteindre l&apos;objectif de victoire.
                </li>
                <li>
                  <strong>La couleur</strong> déclenche un effet spécial qui
                  peut modifier le cours du test. Les effets sont les suivants :
                  <ul className="pl-8 text-2xl">
                    <li>
                      <strong>inversion</strong> : Les points accordés par cette
                      carte sont inversés (multipliés par -1)
                    </li>
                    <li>
                      <strong>gel</strong> : le prochaine joueur ne gagnera
                      aucun point au prochain tour
                    </li>
                    <li>
                      <strong>répétition </strong> : l&apos;effet de la carte
                      précédente est répété
                    </li>
                    <li>
                      <strong>neutre</strong> : aucun effet (2 couleurs auront
                      cette effet)
                    </li>
                  </ul>
                </li>
              </ul>

              <p className="mt-2 text-justify">
                <strong>Rituels</strong> est un jeu de cartes rapide où
                l&apos;objectif est d&apos;accumuler un certain nombre de
                points, fixé en début de partie. Pour gagner, il vous faudra
                faire preuve de stratégie, utiliser les effets uniques de chaque
                carte à votre avantage et, surtout, déjouer les plans de vos
                adversaires.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-3xl font-bold">Fin de la session</h3>

              <p>
                La session de test s’arrête dès qu’un sujet atteint le nombre de
                graines requis.
              </p>

              <p>
                <strong>Note importante</strong> : Au début de chaque session,
                les points et les effets liés aux symboles et aux couleurs sont{" "}
                <strong>re-distribués aléatoirement</strong>. Ce qui était vrai
                lors de la session précédente ne l&apos;est plus. C&apos;est à
                vous d&apos;observer les résultats de chaque carte pour déduire
                les règles de la partie en cours.
              </p>
            </div>
          </div>
        </div>
        <button
          className={`aside-btn-1 absolute top-4 left-0 rounded-lg rounded-r-none bg-white px-4 py-2 text-center text-4xl font-bold text-black transition-all duration-300 hover:w-48 ${settings ? "w-48" : "w-40"}`}
          id="settings-btn"
          onClick={handleClick}
        >
          Réglages
        </button>
        <button
          className={`aside-btn-2 absolute top-20 left-0 rounded-lg rounded-r-none bg-white px-4 py-2 text-center text-4xl font-bold text-black transition-all duration-300 hover:w-48 ${rules ? "w-48" : "w-40"}`}
          id="rules-btn"
          onClick={handleClick}
        >
          Règles
        </button>
      </div>
    </motion.div>
  );
}

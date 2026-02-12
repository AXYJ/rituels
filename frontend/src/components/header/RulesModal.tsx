"use client";

import { motion } from "framer-motion";

export default function RulesModal({ onClose }: { onClose: () => void }) {
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
        className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-11/12 max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 text-black shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Règles</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <p>
            <strong>Rituels</strong> est un jeu de cartes pour 2 à 4 joueurs. Le
            but du jeu est d'être le premier à atteindre le nombre de points
            requis (20 points par défaut).
          </p>
          <p>
            Au début de chaque tour, les joueurs auront 3 cartes en main. Chacun
            leur tour, les joueurs devront jouer une carte et en recevront une
            nouvelle.
          </p>
          <p>
            Les cartes ont deux caractéristiques : un symbole et une couleur. A
            chaque symbole est associé une valeur entre -2 et 2 et à chaque
            couleur est associé un effet.
          </p>
          <p>Les effets sont : Double, Inversion, Blocage, Saut, Neutre.</p>
          <div>{/* // Mettre les symboles ici */}</div>
          <div className="space-y-2">
            <p>
              <strong>Double</strong> : la valeur de la carte est multipliée par
              2.
            </p>
            <p>
              <strong>Inversion</strong> : la valeur de la carte est multipliée
              par -1.
            </p>
            <p>
              <strong>Blocage</strong> : le prochain joueur ne gagne aucun
              point.
            </p>
            <p>
              <strong>Saut</strong> : le prochain joueur ne joue pas son tour.
            </p>
            <p>
              <strong>Neutre</strong> : aucun effet
            </p>
          </div>
          <div className="rounded-md bg-gray-100 p-4">
            <p className="font-bold">Attention :</p>
            <p>
              À chaque partie, les valeurs des symboles et les effets des
              couleurs sont mélangés aléatoirement.
            </p>
            <p>
              Il faut donc observer les cartes pour connaître leur effet et leur
              valeur.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

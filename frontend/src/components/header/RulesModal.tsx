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
          <h2 className="text-2xl font-bold">Procédure du protocole</h2>

          <p>
            Bienvenue dans votre session de test. Votre objectif est simple :
            soyez le premier sujet à accumuler le nombre de graines convenu au
            début du protocole (20 par défaut) pour valider l&apos;expérience.
          </p>

          <h3 className="text-xl font-bold">Déroulement de la session</h3>

          <p>
            Chaque session regroupe 2 à 4 sujets. Vous commencez avec une
            dotation de 3 cartes en main. À son tour, le sujet doit choisir et
            soumettre une seule de ses cartes. Une fois la carte jouée, une
            nouvelle est immédiatement ajoutée à sa main afin qu&apos;il en ait
            toujours trois à disposition.
          </p>

          <p>Chaque carte est composée de deux variables : </p>

          <ul>
            <li>
              <strong>Le symbole</strong> détermine la valeur en points d&apos;une carte lorsqu&apos;elle est posée. Ces valeurs peuvent être positives, négatives ou même nulles, selon les règles générées pour la partie. C&apos;est en cumulant ces points que vous pourrez atteindre l&apos;objectif de victoire.
            </li>
            <li>
              <strong>La couleur</strong> déclenche un effet spécial qui peut
              modifier le cours du test (doubler les points, passer un tour,
              etc.).
            </li>
          </ul>

          <p className="mt-2 text-justify">
            <strong>Rituels</strong> est un jeu de cartes rapide où l&apos;objectif
            est d&apos;accumuler un certain nombre de points, fixé en début de
            partie. Pour gagner, il vous faudra faire preuve de stratégie,
            utiliser les effets uniques de chaque carte à votre avantage et,
            surtout, déjouer les plans de vos adversaires.
          </p>

          <h3 className="text-xl font-bold">Fin de la session</h3>

          <p>
            La session de test s’arrête dès qu’un sujet atteint le nombre de
            graines requis.
          </p>

          <p>
            <strong>Note importante</strong> : Au début de chaque session, les
            points et les effets liés aux symboles et aux couleurs sont{" "}
            <strong>re-distribués aléatoirement</strong>. Ce qui était vrai lors
            de la session précédente ne l'est plus. C'est à vous d'observer les
            résultats de chaque carte pour déduire les règles de la partie en
            cours.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

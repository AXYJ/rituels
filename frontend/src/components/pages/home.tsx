"use client";

// Importations des modules
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";
import Image from "next/image";

// Importations des composants
import Logo from "../logo";

export default function Home() {
  // Appel du contexte
  const { createGame, joinGame, error, setError } = useGame();

  // Gestion des états
  const [inputCode, setInputCode] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  // ----------------
  // Gestion des événements
  // ----------------

  // Création d'une partie
  const startGame = () => {
    setError(null);
    setBtnDisabled(true);
    createGame();
  };

  // Rejoindre une partie
  const handleJoinGame = () => {
    if (inputCode.trim()) {
      setError(null);
      joinGame(inputCode);
    }
  };

  return (
    <>
      {/* // Animation au chargement */}
      <section className="bg-[radial-gradient(ellipse_31.48%_48.47%_at_51.72%_50.00%,_#464441_0%,_#191918_100%)] pb-32">
        <div className="flex min-h-screen flex-col items-center justify-center gap-8">
          <AnimatePresence>
            <motion.div
              key="title"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "backInOut",
              }}
            >
              <Logo />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red absolute top-10 z-50 flex items-center gap-4 rounded-md px-8 py-4 text-2xl font-bold text-white shadow-lg"
              >
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </motion.div>
            )}

            <motion.div
              key="actions"
              className="launch-btn flex w-8/10 max-w-[1024px] flex-col items-center gap-12"
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 200,
                opacity: 0,
              }}
              transition={{
                duration: 1,
                ease: "backInOut",
                staggerChildren: 0.2,
              }}
            >
              <button
                onClick={startGame}
                disabled={btnDisabled}
                className={`relative w-full cursor-pointer rounded-3xl px-12 py-4 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black md:w-1/2`}
              >
                <Image
                  src="/assets/button-long.png"
                  alt=""
                  width={800}
                  height={100}
                  className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
                />
                <span className="relative z-50 text-4xl text-black">
                  Créer une nouvelle partie
                </span>
              </button>
              <div className="items-between flex w-full gap-4 text-white md:w-1/2">
                <div className="need-border relative w-full">
                  <input
                    type="text"
                    placeholder="Code de la partie"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    className="relative z-20 w-full bg-transparent p-2 px-6 py-4 text-4xl text-white outline-none"
                  />
                </div>
                <button
                  onClick={handleJoinGame}
                  className="relative w-fit cursor-pointer rounded-3xl px-6 py-4 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black"
                >
                  <Image
                    src="/assets/button-short.png"
                    alt=""
                    width={300}
                    height={100}
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
                  />
                  <span className="relative z-50 text-4xl text-nowrap text-black">
                    Entrez le code
                  </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="bg-[#191918] pb-32">
        <div className="flex flex-col items-center justify-center gap-8">
          <h2>
            Séquence de test <span className="text-4xl text-white">n° 458</span>
          </h2>
          <div className="flex w-8/10 max-w-[1024px] flex-col gap-4 text-white md:w-1/2">
            <p>
              Dans cette enceinte, rien n'est laissé au hasard, mais tout semble
              imprévisible.
            </p>
            <p>
              À chaque session, les règles qui régissent cette expérience
              mutent. Ne vous fiez pas à vos instincts : fiez-vous à votre sens
              de l’observation.
            </p>
            <p>
              Vous disposerez de trois cartes en permanence. Votre survie dépend
              de votre capacité à percevoir les mécaniques cachées derrière les
              symboles et les couleurs.
            </p>
            <p>
              Analysez vos résultats, surveillez ceux des autres spécimens et
              déduisez la logique du système pour atteindre le seuil critique.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#191918] pb-32 md:pb-0">
        <div className="mb-32 flex flex-col items-center justify-center gap-8">
          <h2>Fonctionnement du système</h2>
          <div className="flex w-8/10 max-w-[1024px] flex-col gap-4 text-white md:w-1/2">
            <Image
              src="/screen/game.png"
              alt="Interface de test"
              width={1920}
              height={1080}
              className="mb-8"
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
              4 — Bloc-notes : un espace pour consigner vos découvertes sur les
              règles en vigueur ;
            </p>
            <p>
              5 — Compteur : graines accumulées (attention, les valeurs
              négatives sont possibles).
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-8">
          <h2>Protocole de jeu (explication du jeu)</h2>
          <div className="flex w-8/10 max-w-[1024px] flex-col gap-4 text-white md:w-1/2">
            <p>Rituels est un jeu de cartes expérimental pour 2 à 4 joueurs.</p>
            <p>
              Au lancement de chaque partie, le système redistribue
              aléatoirement les valeurs et les pouvoirs. Votre but est
              d'identifier ces variables avant vos adversaires et être le
              premier à atteindre le score défini.
            </p>
            <p>
              Les symboles possèdent une valeur fixe (de -1 à 3), tandis que les
              couleurs appliquent des modificateurs de score.
            </p>
            <p>Les pouvoirs possibles sont les suivants :</p>
            <ul className="ml-4 list-inside list-disc text-2xl">
              <li>
                Inversion : inverse la valeur du symbole (un 2 devient -2) ;
              </li>
              <li>Gel : le prochain joueur ne reçoit aucune graine ;</li>
              <li>
                Répétition : la carte copie le pouvoir de la carte précédemment
                jouée;
              </li>
              <li>
                Neutre : la valeur du symbole est appliquée sans modification.
              </li>
            </ul>
            <p>
              Note : chaque symbole possède une valeur unique. Pour les
              couleurs, deux d'entre elles sont systématiquement "Neutres", les
              autres se partagent les pouvoirs restants.
            </p>
            <p>À votre tour, vous devez jouer une carte de votre main.</p>
            <p>
              Le joueur dont le score atteint ou dépasse le seuil défini en
              premier remporte la partie.
            </p>
            <p>
              Pour vous aider, vous pouvez utiliser le bloc-notes pour noter vos
              découvertes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

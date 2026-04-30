"use client";

// Importations des modules
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Les variants sont maintenant définis à l'intérieur du composant pour gérer les délais dynamiques.

import { useGame } from "../../context/GameContext";
import Image from "next/image";

// Importations des composants
import Logo from "../logo";

export default function Home() {
  // Appel du contexte
  const { createGame, joinGame, error, setError, isConnected } = useGame();

  // Gestion des états
  const [inputCode, setInputCode] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [hasCheckedVisit, setHasCheckedVisit] = useState(false);

  // Charger le code sauvegardé et vérifier la première visite après le montage (côté client uniquement)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSavedCode(localStorage.getItem("rituels_room_code"));

      const visited = localStorage.getItem("rituels_visited");
      if (visited) {
        setIsFirstVisit(false);
      } else {
        setIsFirstVisit(true);
        localStorage.setItem("rituels_visited", "true");
      }
      setHasCheckedVisit(true);
    }
  }, []);

  // ----------------
  // Variants d'animation
  // ----------------
  // Si c'est la première visite, on attend la fin de l'animation Lottie (env. 9.5s)
  // Sinon, on affiche les éléments immédiatement.
  const baseDelay = isFirstVisit ? 9.5 : 0.5;

  const frameVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 2,
        staggerChildren: 0.3,
        type: "spring",
        bounce: 0.6,
        delay: baseDelay,
      } as any,
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        type: "spring",
        bounce: 0.6,
        delay: baseDelay,
      } as any,
    },
  };

  const itemVariants2 = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        type: "spring",
        bounce: 0.6,
        delay: baseDelay + 0.5,
      } as any,
    },
  };

  const itemVariants3 = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        type: "spring",
        bounce: 0.6,
        delay: baseDelay + 0.5,
      } as any,
    },
  };

  // ----------------
  // Gestion des événements
  // ----------------

  // Création d'une partie
  const startGame = () => {
    if (!isConnected) {
      setError("Connexion au serveur en cours... Veuillez patienter.");
      return;
    }
    setError(null);
    setBtnDisabled(true);
    createGame();
  };

  // Rejoindre une partie
  const handleJoinGame = () => {
    if (!isConnected) {
      setError("Connexion au serveur en cours... Veuillez patienter.");
      return;
    }
    if (inputCode.trim()) {
      setError(null);
      joinGame(inputCode);
    }
  };

  // Fait disparaître l'erreur automatiquement après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <>
      <header className="absolute top-4 left-1/2 z-10 w-fit -translate-x-1/2 bg-transparent lg:top-8">
        <ul className="flex gap-4 lg:gap-16">
          <li className="relative transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <img
              src="assets/button-short.png"
              alt=""
              className="header-btn-bg pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
            />
            <a
              href="#"
              className="relative z-10 rounded-lg px-8 py-4 text-xl whitespace-nowrap text-white transition-all duration-300 hover:cursor-pointer hover:text-black lg:text-2xl"
              onClick={() => {
                startGame();
              }}
            >
              Jouer au jeu
            </a>
          </li>
          <li className="relative transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <img
              src="assets/button-short.png"
              alt=""
              className="header-btn-bg pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
            />
            <a
              href="#univers"
              className="relative z-10 rounded-lg px-8 py-4 text-xl whitespace-nowrap text-white transition-all duration-300 hover:cursor-pointer hover:text-black lg:text-2xl"
            >
              Univers
            </a>
          </li>
          <li className="relative transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <img
              src="assets/button-short.png"
              alt=""
              className="header-btn-bg pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
            />
            <a
              href="#rules"
              className="relative z-10 rounded-lg px-8 py-4 text-xl whitespace-nowrap text-white transition-all duration-300 hover:cursor-pointer hover:text-black lg:text-2xl"
            >
              Règles
            </a>
          </li>
        </ul>
      </header>
      {/* // Animation au chargement */}
      <section
        className="bg-[radial-gradient(ellipse_31.48%_48.47%_at_51.72%_50.00%,_#464441_0%,_#191918_100%)] pb-32"
        id="launch-btn"
      >
        <div className="relative flex min-h-screen flex-col items-center gap-2 overflow-hidden pt-12 lg:justify-center lg:gap-8 lg:pt-0">
          <AnimatePresence>
            <motion.div
              key="title"
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
              }}
              className="flex w-1/2 flex-col items-center lg:w-full"
            >
              {hasCheckedVisit ? (
                isFirstVisit ? (
                  <DotLottieReact
                    src="/final.json"
                    className="pointer-events-none h-auto w-full max-w-[480px]"
                    autoplay
                  />
                ) : (
                  <Logo className="h-auto w-full max-w-[480px]" />
                )
              ) : (
                <div className="aspect-[2780/1042] h-auto w-full max-w-[480px]" />
              )}
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  key="error-message"
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
            </AnimatePresence>

            <motion.div
              key="launch-container"
              variants={frameVariants}
              initial="hidden"
              animate={hasCheckedVisit ? "visible" : "hidden"}
              className="launch-btn flex w-8/10 max-w-[1024px] flex-col items-center gap-4 lg:gap-12"
            >
              <motion.button
                variants={itemVariants}
                whileHover={{ y: -8 }}
                onClick={startGame}
                disabled={btnDisabled}
                className={`relative w-full cursor-pointer rounded-3xl px-12 py-4 shadow-black transition-shadow duration-300 hover:shadow-lg lg:w-1/2`}
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
              </motion.button>

              <motion.div
                variants={itemVariants2}
                className="items-between flex w-full gap-4 text-white lg:w-1/2"
              >
                <div className="need-border relative w-full">
                  <input
                    type="text"
                    name="room-code"
                    placeholder="Code de la partie"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    className="relative z-20 w-full bg-transparent p-2 px-6 py-4 text-4xl text-white outline-none"
                    list="room-codes-list"
                    autoComplete="on"
                  />
                  <datalist id="room-codes-list">
                    {savedCode && <option value={savedCode} />}
                  </datalist>
                </div>
                <motion.button
                  whileHover={{ y: -8 }}
                  onClick={handleJoinGame}
                  className="relative w-fit cursor-pointer rounded-3xl px-6 py-4 shadow-black transition-shadow duration-300 hover:shadow-lg"
                >
                  <Image
                    src="/assets/button-short.png"
                    alt=""
                    width={300}
                    height={100}
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
                  />
                  <span className="relative z-50 text-4xl text-nowrap text-black">
                    Rejoindre
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
            <motion.div
              key="scroll-indicator"
              variants={itemVariants3}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={
                hasCheckedVisit
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {
                      opacity: 0,
                      y: 20,
                    }
              }
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: baseDelay + 1,
              }}
              className="flex items-center pt-8"
            >
              <a href="#rules" className="flex flex-col items-center">
                <span className="text-3xl text-white">Règles du jeu</span>
                <Image
                  src="/assets/arrow-down.png"
                  alt=""
                  width={800}
                  height={100}
                  className="z-0 mt-4 h-6 w-12 cursor-pointer object-fill lg:h-12 lg:w-24"
                />
              </a>
            </motion.div>
          </AnimatePresence>
          <motion.img
            src="/assets/bg/path.png"
            alt=""
            width={517}
            height={69}
            className="pointer-events-none absolute top-2/3 z-0 hidden w-80 select-none lg:left-9/12 lg:block lg:w-128"
            whileInView={hasCheckedVisit ? { opacity: 1 } : { opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{
              duration: 1,
              type: "spring",
              bounce: 0.6,
              delay: baseDelay + 1.5,
              repeat: 0,
            }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      <section
        className="relative min-h-[70dvh] bg-[#191918] pb-64"
        id="univers"
      >
        <div
          className="flex flex-col items-center justify-center gap-8"
          id="explication"
        >
          <h2>
            Séquence de test{" "}
            <span className="relative text-3xl text-white lg:text-6xl">
              n° 666
              <Image
                src="/assets/line.png"
                alt=""
                width={800}
                height={100}
                className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-full -translate-x-1/2 -translate-y-1/2"
              />
            </span>
          </h2>
          <div className="relative flex w-8/10 max-w-[1024px] flex-col gap-4 text-white lg:w-1/2">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.2,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Dans cette enceinte, rien n'est laissé au hasard, mais tout semble
              imprévisible.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.4,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              À chaque session, les règles qui régissent cette expérience
              changent. Ne vous fiez pas à vos instincts : fiez-vous à votre
              sens de l’observation.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.6,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Vous disposerez de trois cartes en permanence. Votre survie dépend
              de votre capacité à percevoir les mécaniques cachées derrière les
              symboles et les couleurs.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.8,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Analysez vos résultats, surveillez ceux des autres spécimens et
              déduisez la logique du système pour atteindre le seuil de
              victoire.
            </motion.p>

            <Image
              src="/assets/bg/cards-1.png"
              alt=""
              width={517}
              height={69}
              className="pointer-events-none absolute -top-2/3 -left-1/3 z-0 w-48 select-none"
            ></Image>
          </div>
        </div>

        <motion.img
          src="/assets/bg/path-2.png"
          alt=""
          width={517}
          height={69}
          className="height-fit pointer-events-none absolute bottom-24 left-1/2 z-0 w-[50vw] select-none lg:bottom-16"
        />
      </section>

      <section className="min-h-[70dvh] bg-[#191918] pb-64" id="rules">
        <div className="flex flex-col items-center justify-center gap-8">
          <h2>Protocole de jeu (règles)</h2>
          <div className="flex w-8/10 max-w-[1024px] flex-col gap-4 text-white lg:w-1/2">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.2,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Rituels est un jeu de cartes expérimental pour 2 à 4 joueurs.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.4,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Les cartes sont composées de 2 éléments : un symbole et une
              couleur. Chaque symbole possède une valeur fixe (de -1 à 3),
              tandis que chaque couleur possède un pouvoir.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.6,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Au lancement de chaque partie, le système distribue aléatoirement
              les valeurs et les pouvoirs. Votre but est d'identifier ces
              variables avant vos adversaires et être le premier à atteindre le
              score défini (quota).
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.8,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Les pouvoirs possibles sont les suivants :
            </motion.p>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 1,
                repeat: 0,
              }}
              className="ml-4 list-inside list-disc text-2xl"
            >
              <li>
                Inversion (Action Immédiate) : Ce pouvoir agit sur votre carte
                actuelle. Il inverse la valeur de votre symbole. (un 2 devient
                -2) ;
              </li>
              <li>
                Gel (Effet sur le joueur suivant) : Ce pouvoir n'affecte pas
                votre score, mais celui du sujet suivant. Le système forcera son
                prochain résultat à 0, peu importe son symbole ;
              </li>
              <li>
                Répétition (Effet de la carte précédente) : Cette couleur n'a
                pas de pouvoir propre. Elle duplique le pouvoir de la dernière
                carte jouée ;
              </li>
              <li>
                Neutre : la valeur du symbole est appliquée sans modification.
              </li>
            </motion.ul>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 1.2,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Note : chaque symbole possède une valeur unique. Pour les
              couleurs, deux d'entre elles sont systématiquement "Neutres", les
              autres se partagent les pouvoirs restants.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 1.4,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              À votre tour, vous devez jouer une carte de votre main.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 1.6,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Le joueur dont le score atteint ou dépasse le quota défini en
              premier remporte la partie.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 1.8,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Pour vous aider, vous pouvez utiliser le bloc-notes pour noter vos
              découvertes.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="min-h-[70dvh] bg-[#191918] pb-32">
        <div className="flex flex-col items-center justify-center gap-8">
          <h2>Fonctionnement du système</h2>
          <div className="flex w-8/10 max-w-[1024px] flex-col gap-4 text-white lg:w-1/2">
            <Image
              src="/screen/game.png"
              alt="Interface de test"
              width={1920}
              height={1080}
              className="mb-8"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.2,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              Aperçu de l'interface :
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.4,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              1 — Réglages : ajustement des paramètres sonores et rappel des
              protocoles ;
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.6,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              2 — Console de suivi : historique des cartes jouées et
              communications entre spécimens ;
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 0.8,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              3 — Deck : les cartes actuellement en votre possession ;
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 1,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              4 — Bloc-notes : un espace pour consigner vos découvertes sur les
              règles en vigueur ;
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                type: "spring",
                bounce: 0.6,
                delay: 1.2,
                repeat: 0,
              }}
              className="overflow-hidden"
            >
              5 — Compteur : points accumulés (attention, les valeurs négatives
              sont possibles).
            </motion.p>
          </div>
        </div>
      </section>

      <section className="bg-[#191918] pb-32">
        <div className="flex items-center justify-center">
          <motion.a
            whileHover={{ y: -8 }}
            href="#launch-btn"
            className="relative flex w-80 cursor-pointer items-center justify-center rounded-3xl px-12 py-4 shadow-black transition-all duration-300 hover:shadow-lg"
          >
            <Image
              src="/assets/button-short.png"
              alt=""
              width={500}
              height={100}
              className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none"
            />
            <span className="relative z-10 text-4xl text-black">
              Lancer une partie
            </span>
          </motion.a>
        </div>
      </section>

      <footer className="bg-[#191918] py-8 text-center text-white">
        <p>Rituels - 2026 | HEFF</p>
        <p>Créé par : Alex Xiao 3TIWeb</p>
      </footer>
    </>
  );
}

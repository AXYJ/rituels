"use client";

// Importations des modules
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Les variants sont maintenant définis à l'intérieur du composant pour gérer les délais dynamiques.

import { useGame } from "../../context/GameContext";
import Image from "next/image";

// Importations des composants
import Logo from "../logo";

export default function Home() {
  // Appel du contexte
  const { createGame, joinGame, error, setError, isConnected, setView } =
    useGame();

  // Gestion des états
  const [inputCode, setInputCode] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [hasCheckedVisit, setHasCheckedVisit] = useState(false);

  // Charger le code sauvegardé et vérifier la première visite après le montage (côté client uniquement)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const code = localStorage.getItem("rituels_room_code");
      const visited = localStorage.getItem("rituels_visited");
      setTimeout(() => {
        setSavedCode(code);
        if (visited) {
          setIsFirstVisit(false);
        } else {
          setIsFirstVisit(true);
          localStorage.setItem("rituels_visited", "true");
        }
        setHasCheckedVisit(true);
      }, 0);
    }
  }, []);

  // ----------------
  // Variants d'animation
  // ----------------
  // Si c'est la première visite, on attend la fin de l'animation Lottie (env. 9.5s)
  // Sinon, on affiche les éléments immédiatement.
  const baseDelay = isFirstVisit ? 9.5 : 0.5;

  const frameVariants: Variants = {
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
      },
    },
  };

  const itemVariants: Variants = {
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
      },
    },
  };

  const itemVariants2: Variants = {
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
      },
    },
  };

  const itemVariants3: Variants = {
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
      },
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
          <motion.li
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.9 }}
            className="relative transition-all duration-300  hover:shadow-lg"
          >
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
          </motion.li>
          <motion.li
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.9 }}
            className="relative transition-all duration-300 hover:shadow-lg"
          >
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
          </motion.li>
          <motion.li
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.9 }}
            className="relative transition-all duration-300 hover:shadow-lg"
          >
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
          </motion.li>
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
                whileTap={{ scale: 0.9 }}
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
                  whileTap={{ scale: 0.9 }}
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
                <motion.img
                  whileTap={{ y: -8 }}
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
          className="relative z-5 flex flex-col items-center justify-center gap-8"
          id="explication"
        >
          <h2>Rapport Déclassifié : Laboratoire Skinner</h2>
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
              className="overflow-hidden text-center"
            >
              En 1948, le psychologue B.F. Skinner a réussi à rendre des pigeons
              superstitieux en distribuant des graines de manière aléatoire.{" "}
              <br /> Le monde a acclamé ses travaux mais a également oublié ces
              pigeons.
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
              className="overflow-hidden text-center"
            >
              Dans cette enceinte, l&apos;expérience ne s&apos;est jamais
              arretée. En tant que sujet d&apos;expérience, il vous est
              déconseillé de vous fier à vos instincts. Fiez-vous plutôt à votre
              sens de l&apos;observation. Vous disposerez de trois cartes en
              permanence. Analysez vos résultats, observez les autres sujets, et
              déduisez la logique changeante du système pour obtenir vos
              graines.
            </motion.p>
          </div>
        </div>
        <Image
          src="/assets/bg/cards-1.png"
          alt=""
          width={517}
          height={69}
          className="pointer-events-none absolute top-0 left-4 z-0 w-32 select-none lg:left-1/8 lg:w-48"
        ></Image>
        <motion.img
          src="/assets/bg/path-2.png"
          alt=""
          width={517}
          height={69}
          className="height-fit pointer-events-none absolute bottom-24 left-1/2 z-0 w-[50vw] select-none lg:bottom-16"
        />
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.6,
            delay: 1.6,
            repeat: 0,
          }}
          className="pointer-events-none absolute bottom-30 left-[57%] z-0 w-16 select-none lg:w-24"
          src="/assets/bg/left-foot.png"
          alt=""
          width={517}
          height={69}
        />
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.6,
            delay: 1.4,
            repeat: 0,
          }}
          className="pointer-events-none absolute bottom-36 left-[63%] z-0 w-16 select-none lg:w-24"
          src="/assets/bg/right-foot.png"
          alt=""
          width={517}
          height={69}
        />
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.6,
            delay: 1.2,
            repeat: 0,
          }}
          className="pointer-events-none absolute bottom-30 left-[69%] z-0 w-16 select-none lg:w-24"
          src="/assets/bg/left-foot.png"
          alt=""
          width={517}
          height={69}
        />
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.6,
            delay: 1,
            repeat: 0,
          }}
          className="pointer-events-none absolute bottom-36 left-[75%] z-0 w-16 select-none lg:w-24"
          src="/assets/bg/right-foot.png"
          alt=""
          width={517}
          height={69}
        />
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.6,
            delay: 0.8,
            repeat: 0,
          }}
          className="pointer-events-none absolute bottom-30 left-[81%] z-0 w-16 select-none lg:w-24"
          src="/assets/bg/left-foot.png"
          alt=""
          width={517}
          height={69}
        />
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.6,
            delay: 0.6,
            repeat: 0,
          }}
          className="pointer-events-none absolute bottom-36 left-[87%] z-0 w-16 select-none lg:w-24"
          src="/assets/bg/right-foot.png"
          alt=""
          width={517}
          height={69}
        />
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.6,
            delay: 0.4,
            repeat: 0,
          }}
          className="pointer-events-none absolute bottom-30 left-[93%] z-0 hidden w-24 select-none lg:block"
          src="/assets/bg/left-foot.png"
          alt=""
          width={517}
          height={69}
        />
      </section>

      <section className="min-h-[70dvh] bg-[#191918] pb-48" id="rules">
        <div className="relative flex flex-col items-center justify-center gap-8">
          <h2>Protocole de jeu (règles)</h2>
          <iframe
            src="https://www.youtube.com/embed/jhxZaYCYIco"
            className="aspect-video w-8/10 max-w-[1024px] lg:w-1/2"
            loading="lazy"
            title="Rituels - Explication des règles"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
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
              Rituels est un jeu de cartes expérimental pour 2 à 4 joueurs où le
              but est d&apos;être le premier joueur à atteindre le quota de
              graines fixé <br /> à l&apos;avance.
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
              Pour gagner des graines, vous disposerez à tout moment de 3
              cartes.
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
              Chaque carte est une combinaison de deux éléments : un symbole et
              une couleur.
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
              Chaque symbole a une valeur différente entre -1 et 3.
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
              Chaque couleur a un pouvoir qui influence le cours du jeu :
              inversion, gel, répétition et neutre.
            </motion.p>
            <motion.ul
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
              className="ml-4 list-inside list-disc text-2xl"
            >
              <li>
                L&apos;inversion inverse la valeur de la carte jouée. Si le
                symbole vaut 2, alors la carte vaudra -2.
              </li>
              <li>
                Le gel empêche le joueur suivant de gagner des graines.
                Qu&apos;importe ce que le jouer suivant joue, il ne gagnera ni
                ne perdra <br /> de points.
              </li>
              <li>
                La répétition répète le pouvoir de la carte précédemment jouée.
                Si la carte précédente avait le pouvoir &quot;gel&quot;, cette
                carte aura aussi l&apos;effet &quot;gel&quot;.
              </li>
              <li>Neutre n&apos;a aucun effet mais est présent deux fois.</li>
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
              Les valeurs des symboles et les pouvoirs des couleurs sont
              répartis aléatoirement à chaque partie.
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
              Pour vous aidez, vous avez à votre disposition un bloc-notes où
              vous pouvez noter vos hypothèses ainsi qu&apos;une messagerie qui
              recense toutes les cartes qui ont été jouées.
            </motion.p>
          </div>
          <motion.img
            initial={{ opacity: 0, rotate: -45 }}
            whileInView={{ opacity: 1, rotate: 15 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              type: "spring",
              bounce: 0.6,
              delay: 2,
              repeat: 0,
            }}
            className="pointer-events-none absolute bottom-1/4 -left-40 z-0 hidden w-48 origin-bottom rotate-45 overflow-hidden select-none lg:block"
            src="/assets/pigeon.png"
            alt=""
            width={517}
            height={517}
          />
        </div>
      </section>

      <section className="bg-[#191918] pb-32">
        <div className="flex items-center justify-center">
          <motion.a
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.9 }}
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
        <div className="flex flex-col items-center justify-center gap-4">
         <div className="flex gap-16">
          <button
            onClick={() => setView("mentions-legales")}
            className="cursor-pointer hover:underline"
          >
            <p>Mentions Legales</p>
          </button>
          <button
            onClick={() => setView("mentions-legales#credits")}
            className="cursor-pointer hover:underline"
          >
            <p>Crédits</p>
          </button>
         </div>
         
          <div>
            <p>Rituels - 2026 | HEFF</p>
            <p>Créé par : Alex Xiao 3TIWeb</p>
          </div>
        </div>
      </footer>
    </>
  );
}

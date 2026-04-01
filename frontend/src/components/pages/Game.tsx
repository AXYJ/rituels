"use client";

// Importations des modules
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useGame } from "../../context/GameContext";
import { createCard } from "../../hooks/createCard";
import { Card } from "../../types/game";
import WinnerScreen from "../game/WinnerScreen";
import Helper from "../game/Helper";
import History from "../game/History";
import PlayerDeck from "../game/PlayerDeck";
import OpponentDecks from "../game/OpponentDecks";
import RulesModal from "../header/RulesModal";
import QuitModal from "../game/QuitModal";
import Logo from "../logo";

export default function Game() {
  const [showRules, setShowRules] = useState(false);
  const [showQuit, setShowQuit] = useState(false);
  const {
    quitLobby,
    rules,
    playerTurn,
    cardPlayed,
    socket,
    players,
    setLocalPlayerDeck,
    history,
    winner,
    updateDeck,
    playerNumber,
    setView,
  } = useGame();

  const me = players.find((p) => p.id === socket?.id);
  const isMyTurn = me ? playerTurn === me.id : false;
  const deck = me?.deck;

  const [pendingCard, setPendingCard] = useState<Card | null>(null);
  const [scoreDiffs, setScoreDiffs] = useState<{ id: number; diff: number }[]>(
    []
  );
  const prevScoreRef = useRef(me?.score ?? 0);
  const diffIdRef = useRef(0);

  useEffect(() => {
    if (me && me.score !== prevScoreRef.current) {
      const diff = me.score - prevScoreRef.current;
      prevScoreRef.current = me.score;

      if (diff !== 0) {
        const id = diffIdRef.current++;
        setScoreDiffs((prev) => [...prev, { id, diff }]);

        setTimeout(() => {
          setScoreDiffs((prev) => prev.filter((d) => d.id !== id));
        }, 1500);
      }
    }
  }, [me?.score]);

  useEffect(() => {
    queueMicrotask(() => setPendingCard(null));
  }, [history]);

  const handleCardClick = (card: Card) => {
    // Si une carte est déjà en train d'être jouée, on ignore le clic (anti-spam)
    if (pendingCard) return;

    if (me?.deck?.cards) {
      // Trouver la carte jouée
      const cardIndex = me.deck.cards.findIndex((c) => c.id === card.id);
      if (cardIndex !== -1) {
        // Retirer la carte du deck
        const newCards = [...me.deck.cards];
        newCards.splice(cardIndex, 1);
        setLocalPlayerDeck(newCards);
        updateDeck({ cards: newCards });
        setPendingCard(card);
      }
    }
    cardPlayed(card);
  };

  useEffect(() => {
    if (!rules) return;

    // Création de cartes si le joueur n'en a pas assez
    const currentCards = deck?.cards ? [...deck.cards] : [];

    if (currentCards.length < 3) {
      const timeoutId = setTimeout(() => {
        currentCards.push(createCard(rules));
        setLocalPlayerDeck(currentCards);
        updateDeck({ cards: currentCards });
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [deck?.cards, rules, setLocalPlayerDeck, updateDeck]);

  useEffect(() => {
    // Tentative de masquer la barre d'adresse sur mobile au chargement
    const hideAddressBar = () => {
      window.scrollTo(0, 1);
    };

    // Petit délai pour laisser le temps au layout de se stabiliser
    const timeoutId = setTimeout(hideAddressBar, 100);

    // On peut aussi le refaire si le joueur touche l'écran (souvent nécessaire sur mobile)
    const handleTouch = () => {
      if (window.scrollY === 0) {
        window.scrollTo(0, 1);
      }
    };

    window.addEventListener("touchstart", handleTouch);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return (
    <section className="min-h-[100.1dvh] overflow-x-hidden bg-[radial-gradient(ellipse_31.48%_48.47%_at_51.72%_50.00%,#464441_0%,#191918_100%)] lg:min-h-dvh">
      <div className="grid h-dvh w-full grid-cols-3 grid-rows-[25%_50%_25%] gap-2 overflow-hidden p-4">
        <Logo
          className="absolute top-4 left-4 h-16 w-40"
          onClick={() => setShowQuit(true)}
        />

        <button
          onClick={() => {
            setShowRules(true);
          }}
          className="z-10 col-start-3 col-end-4 h-fit w-fit cursor-pointer justify-self-end rounded-full px-6 py-2 font-bold transition-transform duration-300 hover:scale-110"
        >
          <Image
            src="/assets/settings.png"
            alt="rules"
            width={50}
            height={50}
          />
        </button>

        {/* Historique des actions */}

        <History />

        {/* Zone de jeu */}

        <div className="relative col-start-2 col-end-3 row-start-2 row-end-3 flex items-start justify-center p-0 lg:p-8">
          <span className="absolute -top-10 hidden text-center text-3xl lg:flex lg:text-5xl">
            Au tour de :{" "}
            {players.find((p) => p.id === playerTurn)?.name || playerTurn}
          </span>

          {/* {Animation du score} */}
          <div className="pointer-events-auto absolute top-0 right-8 z-50 flex items-center self-end">
            <AnimatePresence>
              {scoreDiffs.map(({ id, diff }) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 10, x: 20 }}
                  animate={{ opacity: 1, y: -40, x: 20 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`pointer-events-none absolute top-0 right-0 text-5xl lg:text-9xl ${diff > 0 ? "text-green" : "text-red"}`}
                >
                  {diff > 0 ? "+" : ""}
                  {diff}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {(() => {
              const playedCards = history
                .filter((h) => h.type === "card" && h.card)
                .map((h) => h.card!);

              // On ajoute pendingCard uniquement s'il est différent de la dernière carte enregistrée par le serveur
              if (pendingCard) {
                const lastPlayedCard =
                  playedCards.length > 0
                    ? playedCards[playedCards.length - 1]
                    : null;
                if (!lastPlayedCard || lastPlayedCard.id !== pendingCard.id) {
                  playedCards.push(pendingCard);
                }
              }

              return playedCards.map((played, i) => (
                <motion.div
                  layout
                  layoutId={`card-${played.id || played.symbol + played.color}`}
                  // Utiliser l'index ou une combinaison avec l'index pour garantir l'unicité de la clé,
                  // car layoutId gère l'animation, la "key" React sert juste à l'arbre.
                  key={`played-${played.id}-${i}`}
                  initial={{ opacity: 0, scale: 0.5, y: -50 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotate: (i % 5) * 6 - 12,
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute h-32 w-24 drop-shadow-sm lg:h-56 lg:w-40"
                >
                  <Image
                    src={`/cards/${played.symbol}-${played.color}.png`}
                    alt="played card"
                    width={400}
                    height={600}
                    className="pointer-events-none h-full w-full object-contain"
                  />
                </motion.div>
              ));
            })()}
          </AnimatePresence>
        </div>

        {/* Deck Joueur principal*/}

        <PlayerDeck
          me={me}
          isMyTurn={isMyTurn}
          deck={deck}
          handleCardClick={handleCardClick}
        />

        {/* Decks adverses (haut et côtés) */}

        <OpponentDecks />

        {/* Helper and Score */}

        <Helper />

        {/* Winner */}

        {winner && <WinnerScreen />}

        {/* Rules Modal */}
        <AnimatePresence>
          {showRules && (
            <RulesModal
              onClose={() => setShowRules(false)}
              onQuit={() => {
                setShowRules(false);
                setShowQuit(true);
              }}
            />
          )}
        </AnimatePresence>

        {/* Quit Modal */}
        <AnimatePresence>
          {showQuit && <QuitModal onClose={() => setShowQuit(false)} />}
        </AnimatePresence>
      </div>
    </section>
  );
}

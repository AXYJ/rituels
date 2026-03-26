"use client";

// Importations des modules
import Image from "next/image";
import { useEffect, useState } from "react";
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
import Logo from "../logo";

export default function Game() {
  const [showRules, setShowRules] = useState(false);
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

  return (
    <section className="bg-[radial-gradient(ellipse_31.48%_48.47%_at_51.72%_50.00%,#464441_0%,#191918_100%)]">
      <div className="grid h-screen w-full grid-cols-3 grid-rows-3 gap-2 overflow-hidden p-4 lg:gap-8">
        <Logo className="absolute top-4 left-4 h-16 w-40" setView={quitLobby} />

        <button
          onClick={() => {
            setShowRules(true);
          }}
          className="col-start-3 col-end-4 h-fit w-fit justify-self-end rounded-full px-6 py-2 font-bold transition-transform duration-300 hover:scale-110"
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

        <div className="relative col-start-2 col-end-3 row-start-2 row-end-3 flex items-end justify-center p-0 lg:p-8">
          <h2 className="absolute -top-16 text-center">
            Au tour de :{" "}
            {players.find((p) => p.id === playerTurn)?.name || playerTurn}
          </h2>
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
                  className="absolute h-24 w-16 drop-shadow-sm lg:h-48 lg:w-32"
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
          {showRules && <RulesModal onClose={() => setShowRules(false)} />}
        </AnimatePresence>
      </div>
    </section>
  );
}

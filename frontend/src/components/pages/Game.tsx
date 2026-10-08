"use client";

// Importations des modules
import Image from "next/image";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import du contexte
import { useGame } from "../../context/GameContext";

// Import des types
import { Card } from "../../types/game";

// Import des hooks
import { normalizeSymbol } from "../../utils/normalizeSymbol";
import { backGuard } from "../../utils/backGuard";

// Import des composants
import WinnerScreen from "../game/WinnerScreen";
import BlocNotes from "../game/BlocNotes";
import History from "../game/Chat";
import PlayerDeck from "../game/PlayerDeck";
import OpponentDecks from "../game/OpponentDecks";
import RulesModal from "../game/RulesModal";
import QuitModal from "../game/QuitModal";
import NoMorePlayersScreen from "../game/NoMorePlayersScreen";
import Logo from "../Logo";

export default function Game() {
  const [showRules, setShowRules] = useState(false);
  const [showQuit, setShowQuit] = useState(false);
  const {
    playerTurn,
    cardPlayed,
    socket,
    players,
    setLocalPlayerDeck,
    history,
    winner,
    threshold,
    noMorePlayers,
  } = useGame();

  const me = players.find((p) => p.id === socket?.id);
  const isMyTurn = me ? playerTurn === me.id : false;
  const deck = me?.deck;

  const [clickedCard, setClickedCard] = useState<Card | null>(null);
  // Carte jouée mais pas encore confirmée par le serveur (absente de l'historique)
  const pendingCard =
    clickedCard && !history.some((h) => h.card?.id === clickedCard.id)
      ? clickedCard
      : null;
  const [scoreDiffs, setScoreDiffs] = useState<{ id: number; diff: number }[]>(
    []
  );
  const onBackAttempt = useCallback(() => {
    setShowQuit(true);
  }, []);
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
  }, [me, me?.score]);

  const playedCards = useMemo(() => {
    const cards = history.filter((h) => h.type === "card" && h.card).map((h) => h.card!);
    if (pendingCard) cards.push(pendingCard);
    return cards;
  }, [history, pendingCard]);

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
        setClickedCard(card);
      }
    }
    cardPlayed(card);
  };

  // Bloquer le bouton retour (le bloc-notes ouvert le consomme en premier)
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (backGuard.skipPopState) {
        backGuard.skipPopState = false;
        return;
      }

      if (backGuard.blocNotesOpen) {
        backGuard.blocNotesOpen = false;
        backGuard.closeBlocNotes?.();
        return;
      }

      window.history.pushState(null, "", window.location.href);
      onBackAttempt();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [onBackAttempt]);

  return (
    <section className="min-h-[100.1dvh] overflow-x-hidden bg-[radial-gradient(ellipse_31.48%_48.47%_at_51.72%_50.00%,#464441_0%,#191918_100%)] lg:min-h-dvh">
      <div className="grid h-dvh w-full grid-cols-3 grid-rows-[25%_50%_25%] gap-2 overflow-hidden p-4">
        <Logo
          className="absolute top-0 left-0 h-16 w-40 lg:top-4 lg:left-4"
          onClick={() => setShowQuit(true)}
        />

        <div className="z-10 col-start-3 col-end-4 flex h-fit w-fit cursor-pointer items-center gap-4 justify-self-end rounded-full px-6 py-2">
          <span className="text-lg lg:text-4xl">Quota : {threshold}</span>

          <motion.button
            onClick={() => {
              setShowRules(true);
            }}
            className="transition-transform duration-300 hover:scale-110"
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 30 }}
          >
            <Image
              src="/assets/settings.png"
              alt="rules"
              width={50}
              height={50}
              className="h-8 w-8 lg:h-16 lg:w-16"
            />
          </motion.button>
        </div>

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
            {playedCards.map((played, i) => (
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
                  className="absolute h-36 w-24 drop-shadow-sm lg:h-60 lg:w-40"
                >
                  <Image
                    src={`/cards/${normalizeSymbol(played.symbol)}-${played.color}.png`}
                    alt="played card"
                    width={400}
                    height={600}
                    className="pointer-events-none h-full w-full object-contain"
                  />
                </motion.div>
            ))}
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

        <BlocNotes />

        {/* Winner */}

        {winner && <WinnerScreen />}

        {/* No More Players */}

        {noMorePlayers && <NoMorePlayersScreen />}

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

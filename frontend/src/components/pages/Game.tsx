"use client";

// Importations des modules
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useGame } from "../../context/GameContext";
import { createCard } from "../../hooks/createCard";
import { Card } from "../../types/game";
import WinnerScreen from "../game/WinnerScreen";
import Helper from "../game/Helper";
import RulesModal from "../header/RulesModal";

export default function Game() {
  const [message, setMessage] = useState("");
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
    sendMessage,
    winner,
    updateDeck,
    playerNumber,
    displayOrder,
  } = useGame();

  const me = players.find((p) => p.id === socket?.id);
  const isMyTurn = me ? playerTurn === me.id : false;
  const deck = me?.deck;

  // Déterminer les decks adverses en fonction de displayOrder
  const opponents = displayOrder
    ? displayOrder
        .slice(1)
        .map((id) => players.find((p) => p.id === id))
        .filter((p) => p !== undefined)
    : [];

  const getOpponentPlacementClass = (index: number, total: number) => {
    // Note: Tailwindcss n'accepte pas les strings dynamiques ex: `col-start-${x}`
    // On doit écrire en entier la classe pour qu'elle soit compilée !
    if (total === 1)
      return "col-start-2 col-end-3 row-start-1 row-end-2 flex -translate-y-1/2 items-center justify-center gap-4";
    if (total === 2) {
      if (index === 0)
        return "col-start-1 col-end-2 row-start-2 row-end-3 flex items-end justify-center gap-4 rotate-90 -translate-x-1/2 h-fit";
      if (index === 1)
        return "col-start-3 col-end-4 row-start-2 row-end-3 flex items-end justify-center gap-4 -rotate-90 translate-x-1/2 h-fit";
    }
    if (total === 3) {
      if (index === 0)
        return "col-start-1 col-end-2 row-start-2 row-end-3 flex items-center justify-center gap-4 rotate-90 -translate-x-1/2";
      if (index === 1)
        return "col-start-2 col-end-3 row-start-1 row-end-2 flex -translate-y-1/2 items-center justify-center gap-4";
      if (index === 2)
        return "col-start-3 col-end-4 row-start-2 row-end-3 flex items-center justify-center gap-4 -rotate-90 translate-x-1/2";
    }
    return "hidden";
  };

  const [pendingCard, setPendingCard] = useState<Card | null>(null);

  const historyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => setPendingCard(null));
  }, [history]);

  useEffect(() => {
    // Permet de scroller en bas de l'historique
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTo({
        top: historyContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="grid h-screen w-full grid-cols-3 grid-rows-3 gap-8 overflow-hidden p-4">
      <button
        onClick={() => {
          quitLobby();
        }}
        className="h-fit w-fit rounded-full bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600"
      >
        Quitter la partie
      </button>

      <button
        onClick={() => {
          setShowRules(true);
        }}
        className="col-start-3 col-end-4 h-fit w-fit justify-self-end rounded-full bg-blue-500 px-6 py-2 font-bold text-white hover:bg-blue-600"
      >
        Règles
      </button>

      {/* Historique des actions */}

      <div className="relative col-start-1 col-end-2 row-start-3 row-end-4 flex h-full flex-col justify-between rounded-lg border bg-gray-50/10">
        <h3 className="w-full bg-gray-900/50 p-2 font-bold text-white">
          Historique des actions:
        </h3>
        <div ref={historyContainerRef} className="h-full overflow-y-auto p-2">
          {history.map((h, index) => {
            const playerName =
              players.find((p) => p.id === h.player)?.name || h.player;

            if (h.type === "message") {
              return (
                <div key={index} className="text-sm">
                  <span className="font-semibold text-blue-400">
                    {playerName}
                  </span>{" "}
                  : <span>{h.message}</span>
                </div>
              );
            }

            return (
              <div key={index} className="text-sm">
                <span className="font-semibold">{playerName}</span> a joué{" "}
                <span className="italic">
                  {h.card?.color} {h.card?.symbol}
                </span>{" "}
                et a gagné <span className="font-semibold">{h.points}</span>
                {"  "}
                points
              </div>
            );
          })}
        </div>

        <form
          className="border-gray flex w-full overflow-hidden rounded-lg border bg-gray-900"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-transparent px-2 py-2 text-white outline-none"
            placeholder="Tchat..."
          />
          <button
            type="submit"
            className="bg-gray-800 px-8 font-bold hover:bg-gray-700"
          >
            Envoyer
          </button>
        </form>
      </div>

      {/* Zone de jeu */}

      <div className="relative col-start-2 col-end-3 row-start-2 row-end-3 flex items-center justify-center p-8">
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
                className="absolute h-32 w-24 drop-shadow-sm md:h-48 md:w-32 lg:h-64 lg:w-48"
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

      <div
        className={`col-start-2 col-end-3 row-start-3 row-end-4 grid grid-cols-3 gap-4 ${isMyTurn ? "" : "pointer-events-none grayscale-80"}`}
      >
        <AnimatePresence>
          {deck?.cards?.map((card, index) => (
            <motion.div
              layout
              layoutId={`card-${card.id || card.symbol + card.color}`}
              key={card.id || index}
              initial={{ opacity: 0, y: 200, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex items-center justify-center"
            >
              <Image
                src={`/cards/${card.symbol}-${card.color}.png`}
                alt="card"
                width={400}
                height={600}
                className="max-h-full cursor-pointer object-contain transition-transform duration-300 hover:-translate-y-10"
                onClick={() => handleCardClick(card)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Decks adverses (haut et côtés) */}

      {opponents.map((opponent, index) => (
        <div
          key={opponent?.id || index}
          className={getOpponentPlacementClass(index, opponents.length)}
        >
          {opponent?.deck?.cards?.map((card, cardIndex) => (
            <motion.div
              layout
              layoutId={`card-back-${opponent.id}-${card.id || cardIndex}`}
              key={card.id || cardIndex}
              className="flex items-center justify-center"
            >
              <Image
                src={`/cards/card-back.png`}
                alt="card back"
                width={400}
                height={600}
                className="h-32 w-24 object-contain"
              />
            </motion.div>
          ))}
        </div>
      ))}

      {/* Score */}

      {me && (
        <div className="col-start-3 col-end-4 row-start-2 row-end-4 flex flex-col items-center justify-end gap-8">
          <div className="flex items-center gap-2">
            <Image
              src={`/cards/seed.png`}
              alt="card"
              width={1000}
              height={1000}
              className="h-16 w-16 object-contain"
            />
            <p className="text-xl font-bold">x {me.score}</p>
          </div>
          <Helper />
        </div>
      )}

      {/* Winner */}

      {winner && <WinnerScreen />}

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      </AnimatePresence>
    </div>
  );
}

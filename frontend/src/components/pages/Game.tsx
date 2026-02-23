"use client";

// Importations des modules
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Importations des composants  
import { useGame } from "../../context/GameContext";
import { createCard } from "../../hooks/createCard";
import WinnerScreen from "../game/WinnerScreen";
import Helper from "../game/Helper";

export default function Game() {
  const [message, setMessage] = useState("");
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
  } = useGame();

  const me = players.find((p) => p.id === socket?.id);
  const isMyTurn = me ? playerTurn === me.id : false;
  const deck = me?.deck;

  const [pendingCard, setPendingCard] = useState<{ id?: number; symbol: string; color: string } | null>(null);

  const historyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPendingCard(null);
  }, [history]);

  useEffect(() => {
    // Permet de scroller en bas de l'historique
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTo({
        top: historyContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [history]);

  const handleCardClick = (card: { id?: number; symbol: string; color: string }) => {
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

      <h2>
        Au tour de :{" "}
        {players.find((p) => p.id === playerTurn)?.name || playerTurn}
      </h2>

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
                et a gagné <span className="font-semibold">{h.points}</span>{"  "}
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
        <AnimatePresence>
          {(() => {
            const playedCards = history
              .filter((h) => h.type === "card" && h.card)
              .map((h) => h.card!);

            // On ajoute pendingCard uniquement s'il est différent de la dernière carte enregistrée par le serveur
            if (pendingCard) {
              const lastPlayedCard = playedCards.length > 0 ? playedCards[playedCards.length - 1] : null;
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
                animate={{ opacity: 1, scale: 1, y: 0, rotate: (i % 5) * 6 - 12 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute h-48 w-32 md:h-64 md:w-48 drop-shadow-sm"
              >
                <Image
                  src={`/cards/${played.symbol}-${played.color}.png`}
                  alt="played card"
                  width={400}
                  height={600}
                  className="h-full w-full object-contain pointer-events-none"
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


      {/* Deck adverse (haut) */}

      {playerNumber == 2 && (
        <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex items-center justify-center gap-4 -translate-y-20">
          {players.find((p) => p.id !== me?.id)?.deck?.cards?.map((card, index) => (
            <motion.div
              layout
              layoutId={`card-back-${card.id || index}`}
              key={card.id || index}
              className="flex items-center justify-center"
            >
              <Image
                src={`/cards/card-back.png`}
                alt="card back"
                width={400}
                height={600}
                className="h-32 w-24 object-contain "
              />
            </motion.div>
          ))}
        </div>
      )}



      {/* Score */}

      {me && (
        <div className="col-start-3 col-end-4 row-start-2 row-end-4 flex flex-col items-center gap-8 justify-end">
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
    </div>
  );
}

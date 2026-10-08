import { randomUUID } from "node:crypto";

/**
 * Algorithme de Fisher-Yates pour un mélange parfait
 */
export function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Génère les règles aléatoires pour une nouvelle partie
 */
export function generateRules() {
  const symbols = ["cercle", "croix", "vague", "carré", "étoile"];
  const colors = ["rouge", "bleu", "vert", "jaune", "rose"];

  const values = shuffle([3, 2, 1, 0, -1]);
  const symbolRules = {};
  symbols.forEach((sym, i) => {
    symbolRules[sym] = values[i];
  });

  const effects = shuffle([
    "Inversion",
    "Gel",
    "Répétition",
    "Neutre",
    "Neutre",
  ]);
  const colorRules = {};
  colors.forEach((col, i) => {
    colorRules[col] = effects[i];
  });

  return { symbolRules, colorRules };
}

/**
 * Détermine l'ordre des joueurs
 */
export function whoStart(players) {
  const playerOrder = shuffle([...players]).map((p) => p.id);
  return playerOrder;
}

/**
 * Passe au joueur suivant en sautant ceux qui ont quitté
 */
export function getNextPlayerOrder(playerOrder, players) {
  if (!playerOrder || playerOrder.length === 0) return [];

  const newOrder = [...playerOrder];
  const pId = newOrder.shift();
  newOrder.push(pId);

  // Vérifier si le nouveau joueur actif a quitté
  const activePlayer = players.find(p => p.id === newOrder[0]);
  if (activePlayer && activePlayer.leavedPlayer) {
    return getNextPlayerOrder(newOrder, players);
  }

  return newOrder;
}

/**
 * Calcule les points d'une carte jouée en fonction des règles et de l'effet précédent.
 */
export function calculateCardPoints(card, rules, lastEffect) {
  let points = rules.symbolRules[card.symbol] || 0;
  const effect = rules.colorRules[card.color];
  const effectiveEffect =
    effect === "Répétition" ? lastEffect || "Neutre" : effect;

  // Effets rémanents (qui s'appliquent au tour actuel à cause du joueur précédent)
  if (lastEffect === "Gel") {
    points = 0;
  }

  // Effets immédiats (qui modifient les points de la carte que je pose)
  switch (effectiveEffect) {
    case "Inversion":
      points *= -1;
      break;
    case "Gel":
      // N'altère pas mes points actuels, mais `effectiveEffect` sera enregistré pour le gel du prochain tour !
      break;
    case "Neutre":
    default:
      break;
  }

  return { points, effectiveEffect };
}

/**
 * Génère une carte unique pour un joueur
 */
export function createCard(rules) {
  const symbols = Object.keys(rules.symbolRules);
  const colors = Object.keys(rules.colorRules);

  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // ID unique par carte (clé de suppression + layoutId Framer Motion côté client)
  return { id: randomUUID(), symbol, color };
}


/**
 * Vérifie si un joueur a gagné
 */
export function checkWin(player, points, threshold) {
  player.score += points;
  return player.score >= threshold;
}

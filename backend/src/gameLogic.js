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
  const symbols = ["cercle", "croix", "carre", "triangle", "vague"];
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

  // Utiliser Date.now() et un nombre aléatoire pour assurer un identifiant unique même entre plusieurs navigateurs
  // Nécessité d'avoir une ID unique pour chaque carte pour les animations Framer Motion
  const uniqueId = Date.now() + Math.floor(Math.random() * 1000000);

  return { id: uniqueId, symbol, color };
}



/**
 * Vérifie si un joueur a gagné
 */
export function checkWin(player, points, threshold) {
  player.score += points;
  return player.score >= threshold;
}

/**
 * Modère pseudo 
 */

import { Groq } from 'groq-sdk';

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

const apiKey = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const reasoningEffort = process.env.GROQ_REASONING_EFFORT || 'low';

if (!apiKey) {
  throw new Error('La variable d environnement GROQ_API_KEY est requise.');
}

const groq = new Groq({ apiKey });

export async function moderatePseudo(pseudo) {
  const cleaned = String(pseudo || '').trim();

  if (!cleaned) {
    throw new Error('Le texte a moderer est requis.');
  }

  try {
    const completion = await groq.chat.completions.create({
      model,
      temperature: 0,
      max_completion_tokens: 20, // Plus de marge pour capter un refus explicite
      messages: [
        {
          role: 'system',
          content: 'Tu es un modérateur de chat. Bloque les pseudonymes vulgaires, haineux ou sexuels.\n' +
                   'Réponds UNIQUEMENT "OK" si c\'est acceptable, ou "NON" si c\'est inapproprié.\n' +
                   'PAS D\'EXPLICATION.'
        },
        {
          role: 'user',
          content: cleaned
        }
      ]
    });

    const result = completion.choices[0]?.message?.content?.trim().toUpperCase() || '';
    
    // Si la réponse contient "NON" ou commence par "NON", on refuse
    if (result.includes('NON') || result === 'REFUSÉ' || result === 'INTERDIT' || result === 'INAPPROPRIÉ') {
      return 'NON';
    }
    
    return 'OK';
  } catch (error) {
    console.error('Erreur Groq:', error);
    return 'OK'; // Fallback sécurisé
  }
}

export async function moderateMessage(message) {
  const cleaned = String(message || '').trim();

  if (!cleaned) {
    throw new Error('Le texte a moderer est requis.');
  }

  try {
    const completion = await groq.chat.completions.create({
      model,
      temperature: 0,
      max_completion_tokens: 500, // Suffisant pour un long message de chat
      messages: [
        {
          role: 'system',
          content: 'Tu es un modérateur de chat. Ta tâche est de censurer les messages vulgaires, haineux ou sexuels.\n' +
                   '1. Si le message est acceptable, réponds UNIQUEMENT "OK".\n' +
                   '2. Si le message est inapproprié, réponds UNIQUEMENT par le texte où les mots vulgaires sont remplacés par "***".\n' +
                   'NE DONNE AUCUNE EXPLICATION.'
        },
        {
          role: 'user',
          content: cleaned
        }
      ]
    });

    const result = completion.choices[0]?.message?.content?.trim() || '';
    
    if (result === 'OK' || result.toUpperCase() === 'OK') {
      return 'OK';
    }
    
    // Si le modèle a commencé à donner une explication type "Le message est..." malgré la consigne
    if (result.toLowerCase().startsWith('le message') || result.toLowerCase().startsWith('votre message')) {
        return '*** (Message inapproprié)';
    }

    return result;
  } catch (error) {
    console.error('Erreur Groq:', error);
    return 'OK';
  }
}


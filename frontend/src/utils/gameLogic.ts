import { Card, GameRules } from "../types/game";

/**
 * Calcule les points d'une carte jouée en fonction des règles et de l'effet précédent.
 * @param card La carte jouée
 * @param rules Les règles de la partie
 * @param lastEffect L'effet de la carte précédente (facultatif)
 * @returns Un objet contenant les points calculés et l'effet effectif
 */
export function calculateCardPoints(
  card: Card,
  rules: GameRules,
  lastEffect: string | null
): { points: number; effectiveEffect: string } {
  let points = rules.symbolRules[card.symbol] || 0;
  const effect = rules.colorRules[card.color];
  const effectiveEffect = effect === "Répétition" ? lastEffect || "Neutre" : effect;

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

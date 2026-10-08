/**
 * Fenêtre glissante : renvoie une fonction qui autorise au plus `max` appels par fenêtre de `windowMs`.
 * Un appel refusé n'est pas compté.
 */
export function slidingWindow(max, windowMs) {
  let hits = [];
  return () => {
    const now = Date.now();
    hits = hits.filter((time) => now - time < windowMs);
    if (hits.length >= max) return false;
    hits.push(now);
    return true;
  };
}

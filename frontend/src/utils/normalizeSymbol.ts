/**
 * Normalise un nom de symbole en retirant les accents et en le passant en minuscules.
 * Exemple : "carré" -> "carre", "étoile" -> "etoile"
 */
export function normalizeSymbol(symbol: string): string {
  if (!symbol) return "";
  return symbol
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

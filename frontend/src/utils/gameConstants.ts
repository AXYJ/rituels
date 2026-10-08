// Valeurs de jeu partagées (identiques côté backend)
export const MAX_PLAYERS = 4;
export const MIN_THRESHOLD = 5;
export const MAX_THRESHOLD = 30;
export const MAX_NAME_LENGTH = 10;

// Valeurs que peuvent prendre les symboles et les effets des couleurs (cf. generateRules côté backend)
export const SYMBOL_VALUES = [3, 2, 1, 0, -1];
export const COLOR_EFFECTS = ["Inversion", "Gel", "Répétition", "Neutre"];

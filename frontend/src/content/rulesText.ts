// Source unique du texte des règles, utilisé par la page d'accueil (home.tsx)
// et par la modale en jeu (RulesModal.tsx). Modifier ici suffit pour les deux.

export const RULES_PARAGRAPHS = [
  "Rituels est un jeu de cartes expérimental pour 2 à 4 joueurs où le but est d'être le premier joueur à atteindre le quota de graines fixé à l'avance.",
  "Pour gagner des graines, vous disposerez à tout moment de 3 cartes.",
  "Chaque carte est une combinaison de deux éléments : un symbole et une couleur.",
  "Chaque symbole a une valeur différente entre -1 et 3.",
  "Chaque couleur a un pouvoir qui influence le cours du jeu : inversion, gel, répétition et neutre.",
];

export const RULES_EFFECTS = [
  "L'inversion inverse la valeur de la carte jouée. Si le symbole vaut 2, alors la carte vaudra -2.",
  "Le gel empêche le joueur suivant de gagner des graines. Qu'importe ce que le joueur suivant joue, il ne gagnera ni ne perdra de points.",
  'La répétition répète le pouvoir de la carte précédemment jouée. Si la carte précédente avait le pouvoir "gel", cette carte aura aussi l\'effet "gel".',
  "Neutre n'a aucun effet mais est présent deux fois.",
];

export const RULES_FOOTER_PARAGRAPHS = [
  "Les valeurs des symboles et les pouvoirs des couleurs sont répartis aléatoirement à chaque partie.",
  "À votre tour, vous devez jouer une carte de votre main.",
  "Le joueur dont le score atteint ou dépasse le quota défini en premier remporte la partie.",
  "Pour vous aider, vous avez à votre disposition un bloc-notes où vous pouvez noter vos hypothèses ainsi qu'une messagerie qui recense toutes les cartes qui ont été jouées.",
];

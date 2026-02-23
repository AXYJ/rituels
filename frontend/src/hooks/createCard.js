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

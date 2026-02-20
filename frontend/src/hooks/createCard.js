export function createCard(rules) {
  const symbols = Object.keys(rules.symbolRules);
  const colors = Object.keys(rules.colorRules);

  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return { symbol, color };
}

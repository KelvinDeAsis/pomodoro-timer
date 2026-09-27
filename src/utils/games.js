export const matchSymbols = ['Seed', 'Berry', 'Leaf', 'Acorn', 'Carrot', 'Hamster'];
export function createDeck(random = Math.random) {
  const cards = [...matchSymbols, ...matchSymbols].map((value, id) => ({ value, id }));
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
}
export function isPair(cards, ids) {
  if (ids.length !== 2 || ids[0] === ids[1]) return false;
  const first = cards.find(card => card.id === ids[0]);
  const second = cards.find(card => card.id === ids[1]);
  return Boolean(first && second && first.value === second.value);
}

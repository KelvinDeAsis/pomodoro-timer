import test from 'node:test';
import assert from 'node:assert/strict';
import { createDeck, isPair, matchSymbols } from '../src/utils/games.js';
test('shuffled matching cards contain exactly six pairs and unique stable ids', () => { const cards = createDeck(() => .2); assert.equal(cards.length, 12); assert.equal(new Set(cards.map(c => c.id)).size, 12); for (const symbol of matchSymbols) assert.equal(cards.filter(c => c.value === symbol).length, 2); });
test('pairs compare stable ids, not array positions after shuffling', () => { const cards = createDeck(() => .2); for (const value of matchSymbols) { const ids = cards.filter(c => c.value === value).map(c => c.id); assert.equal(isPair(cards, ids), true); } assert.equal(isPair(cards, [0, 1]), false); assert.equal(isPair(cards, [0, 0]), false); assert.equal(isPair(cards, [999, 1]), false); });

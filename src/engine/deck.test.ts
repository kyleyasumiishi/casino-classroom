import { describe, it, expect } from 'vitest';
import { createDeck, drawCard } from './deck';

describe('createDeck', () => {
  it('createDeck(1) returns 52 cards', () => {
    expect(createDeck(1)).toHaveLength(52);
  });

  it('createDeck(6) returns 312 cards (blackjack shoe)', () => {
    expect(createDeck(6)).toHaveLength(312);
  });

  it('createDeck(8) returns 416 cards (baccarat shoe)', () => {
    expect(createDeck(8)).toHaveLength(416);
  });

  it('all cards have unique IDs (even across decks in a shoe)', () => {
    const deck = createDeck(6);
    const ids = deck.map((c) => c.id);
    expect(new Set(ids).size).toBe(312);
  });

  it('single deck contains 4 suits × 13 ranks', () => {
    const deck = createDeck(1);
    const suits = new Set(deck.map((c) => c.suit));
    const ranks = new Set(deck.map((c) => c.rank));
    expect(suits.size).toBe(4);
    expect(ranks.size).toBe(13);
  });

  it('multi-deck shoe contains correct duplicates', () => {
    const deck = createDeck(6);
    const aceOfSpades = deck.filter(
      (c) => c.rank === 'A' && c.suit === 'spades'
    );
    expect(aceOfSpades).toHaveLength(6);
  });
});

describe('drawCard', () => {
  it('removes and returns top card', () => {
    const deck = createDeck(1);
    const originalLength = deck.length;
    const lastCard = deck[deck.length - 1];
    const { card, deck: remaining } = drawCard(deck);
    expect(card.id).toBe(lastCard.id);
    expect(remaining).toHaveLength(originalLength - 1);
  });

  it('throws on empty deck', () => {
    expect(() => drawCard([])).toThrow('Cannot draw from an empty deck');
  });
});

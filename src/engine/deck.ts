import type { Card, Suit, Rank } from '../types/common';
import { shuffle } from '../utils/shuffle';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(numDecks: number = 1): Card[] {
  const cards: Card[] = [];
  for (let d = 0; d < numDecks; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push({
          id: `${suit}-${rank}-${d}`,
          suit,
          rank,
          faceUp: true,
        });
      }
    }
  }
  return shuffle(cards);
}

export function drawCard(deck: Card[]): { card: Card; deck: Card[] } {
  if (deck.length === 0) {
    throw new Error('Cannot draw from an empty deck');
  }
  const card = deck[deck.length - 1];
  return { card, deck: deck.slice(0, -1) };
}

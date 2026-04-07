import type { Card, Rank } from '../types/common';
import type { BlackjackAction, BlackjackHand, HandResult } from '../types/blackjack';

interface HandEvaluation {
  total: number;
  isSoft: boolean;
  isBust: boolean;
  isBlackjack: boolean;
}

function cardValue(rank: Rank): number {
  if (rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return parseInt(rank, 10);
}

export function evaluateHand(cards: Card[]): HandEvaluation {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    total += cardValue(card.rank);
    if (card.rank === 'A') aces++;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  const isSoft = aces > 0;
  const isBust = total > 21;
  const isBlackjack = cards.length === 2 && total === 21;

  return { total, isSoft, isBust, isBlackjack };
}

export function dealerShouldHit(cards: Card[]): boolean {
  const { total } = evaluateHand(cards);
  // Dealer stands on all 17s including soft 17
  return total < 17;
}

export function getAvailableActions(
  playerHand: BlackjackHand,
  _dealerUpCard: Card,
  balance: number
): BlackjackAction[] {
  const actions: BlackjackAction[] = ['hit', 'stand'];
  const { cards, bet } = playerHand;

  // Double: allowed on any first two cards if balance covers it
  if (cards.length === 2 && balance >= bet) {
    actions.push('double');
  }

  // Split: allowed on matching ranks, first two cards, if balance covers it
  if (
    cards.length === 2 &&
    cards[0].rank === cards[1].rank &&
    balance >= bet
  ) {
    actions.push('split');
  }

  return actions;
}

export function calculatePayout(bet: number, result: HandResult): number {
  switch (result) {
    case 'blackjack':
      return bet + bet * 1.5; // 3:2 payout — return stake + 1.5x profit
    case 'win':
      return bet * 2; // 1:1 — return stake + 1x profit
    case 'push':
      return bet; // return stake
    case 'lose':
    case 'bust':
      return 0;
  }
}

export function resolveHand(
  playerCards: Card[],
  dealerCards: Card[]
): HandResult {
  const player = evaluateHand(playerCards);
  const dealer = evaluateHand(dealerCards);

  if (player.isBust) return 'bust';
  if (player.isBlackjack && !dealer.isBlackjack) return 'blackjack';
  if (player.isBlackjack && dealer.isBlackjack) return 'push';
  if (dealer.isBust) return 'win';
  if (player.total > dealer.total) return 'win';
  if (player.total < dealer.total) return 'lose';
  return 'push';
}

import type { Card, Rank } from '../types/common';
import type { BaccaratBetType, BaccaratResult } from '../types/baccarat';
import { BACCARAT_PAYOUTS } from '../types/baccarat';

function cardValue(rank: Rank): number {
  if (['K', 'Q', 'J', '10'].includes(rank)) return 0;
  if (rank === 'A') return 1;
  return parseInt(rank, 10);
}

export function evaluateHand(cards: Card[]): number {
  let total = 0;
  for (const card of cards) {
    total += cardValue(card.rank);
  }
  return total % 10;
}

export function shouldPlayerDraw(playerTotal: number, playerCardCount: number): boolean {
  // Natural — no draw
  if (playerCardCount === 2 && (playerTotal === 8 || playerTotal === 9)) return false;
  return playerTotal <= 5;
}

export function shouldBankerDraw(
  bankerTotal: number,
  bankerCardCount: number,
  playerThirdCard: number | null
): boolean {
  // Natural — no draw
  if (bankerCardCount === 2 && (bankerTotal === 8 || bankerTotal === 9)) return false;

  // If player stood (no third card), banker draws on 0-5
  if (playerThirdCard === null) {
    return bankerTotal <= 5;
  }

  // Banker tableau based on player's third card value
  switch (bankerTotal) {
    case 0:
    case 1:
    case 2:
      return true;
    case 3:
      return playerThirdCard !== 8;
    case 4:
      return playerThirdCard >= 2 && playerThirdCard <= 7;
    case 5:
      return playerThirdCard >= 4 && playerThirdCard <= 7;
    case 6:
      return playerThirdCard === 6 || playerThirdCard === 7;
    case 7:
      return false;
    default:
      return false;
  }
}

export function resolveBaccarat(playerTotal: number, bankerTotal: number): BaccaratResult {
  if (playerTotal > bankerTotal) return 'player';
  if (bankerTotal > playerTotal) return 'banker';
  return 'tie';
}

export function calculatePayout(
  bet: { type: BaccaratBetType; amount: number },
  result: BaccaratResult
): number {
  // Tie result: player/banker bets push (returned)
  if (result === 'tie' && bet.type !== 'tie') {
    return bet.amount;
  }

  // Winning bet
  if (bet.type === result) {
    return bet.amount + bet.amount * BACCARAT_PAYOUTS[bet.type];
  }

  // Losing bet
  return 0;
}

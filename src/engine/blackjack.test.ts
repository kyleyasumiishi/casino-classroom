import { describe, it, expect } from 'vitest';
import { evaluateHand, dealerShouldHit, getAvailableActions, calculatePayout, resolveHand } from './blackjack';
import type { Card } from '../types/common';
import type { BlackjackHand } from '../types/blackjack';

function card(rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card {
  return { id: `${suit}-${rank}-0`, suit, rank, faceUp: true };
}

function hand(cards: Card[], bet = 10): BlackjackHand {
  return { cards, bet, isDoubled: false };
}

describe('evaluateHand', () => {
  it('counts number cards at face value', () => {
    expect(evaluateHand([card('7'), card('5')])).toEqual({
      total: 12, isSoft: false, isBust: false, isBlackjack: false,
    });
  });

  it('counts face cards as 10', () => {
    expect(evaluateHand([card('K'), card('Q')])).toEqual({
      total: 20, isSoft: false, isBust: false, isBlackjack: false,
    });
  });

  it('counts ace as 11 when total <= 21 (soft hand)', () => {
    expect(evaluateHand([card('A'), card('6')])).toEqual({
      total: 17, isSoft: true, isBust: false, isBlackjack: false,
    });
  });

  it('counts ace as 1 when 11 would bust', () => {
    expect(evaluateHand([card('A'), card('7'), card('8')])).toEqual({
      total: 16, isSoft: false, isBust: false, isBlackjack: false,
    });
  });

  it('handles multiple aces', () => {
    expect(evaluateHand([card('A'), card('A'), card('9')])).toEqual({
      total: 21, isSoft: true, isBust: false, isBlackjack: false,
    });
    expect(evaluateHand([card('A'), card('A')])).toEqual({
      total: 12, isSoft: true, isBust: false, isBlackjack: false,
    });
  });

  it('detects blackjack (ace + 10-value, 2 cards only)', () => {
    expect(evaluateHand([card('A'), card('10')])).toEqual({
      total: 21, isSoft: true, isBust: false, isBlackjack: true,
    });
    expect(evaluateHand([card('A'), card('K')])).toEqual({
      total: 21, isSoft: true, isBust: false, isBlackjack: true,
    });
  });

  it('does not flag 21 with 3+ cards as blackjack', () => {
    expect(evaluateHand([card('7'), card('7'), card('7')])).toEqual({
      total: 21, isSoft: false, isBust: false, isBlackjack: false,
    });
  });

  it('detects bust', () => {
    expect(evaluateHand([card('K'), card('8'), card('5')])).toEqual({
      total: 23, isSoft: false, isBust: true, isBlackjack: false,
    });
  });
});

describe('dealerShouldHit', () => {
  it('returns true for 16', () => {
    expect(dealerShouldHit([card('10'), card('6')])).toBe(true);
  });

  it('returns false for 17', () => {
    expect(dealerShouldHit([card('10'), card('7')])).toBe(false);
  });

  it('returns false for soft 17 (stands on soft 17)', () => {
    expect(dealerShouldHit([card('A'), card('6')])).toBe(false);
  });
});

describe('getAvailableActions', () => {
  it('includes hit and stand always', () => {
    const h = hand([card('7'), card('8')]);
    const actions = getAvailableActions(h, card('10'), 1000);
    expect(actions).toContain('hit');
    expect(actions).toContain('stand');
  });

  it('includes double on first two cards with sufficient balance', () => {
    const h = hand([card('5'), card('6')], 10);
    const actions = getAvailableActions(h, card('10'), 10);
    expect(actions).toContain('double');
  });

  it('excludes double when balance insufficient', () => {
    const h = hand([card('5'), card('6')], 10);
    const actions = getAvailableActions(h, card('10'), 5);
    expect(actions).not.toContain('double');
  });

  it('includes split on matching ranks with sufficient balance', () => {
    const h = hand([card('8', 'hearts'), card('8', 'clubs')], 10);
    const actions = getAvailableActions(h, card('10'), 10);
    expect(actions).toContain('split');
  });

  it('excludes split on non-matching ranks', () => {
    const h = hand([card('8'), card('9')], 10);
    const actions = getAvailableActions(h, card('10'), 10);
    expect(actions).not.toContain('split');
  });

  it('excludes double and split after more than 2 cards', () => {
    const h = hand([card('3'), card('4'), card('5')], 10);
    const actions = getAvailableActions(h, card('10'), 1000);
    expect(actions).not.toContain('double');
    expect(actions).not.toContain('split');
  });
});

describe('calculatePayout', () => {
  it('returns 1.5x bet for blackjack (3:2)', () => {
    expect(calculatePayout(10, 'blackjack')).toBe(25);
  });

  it('returns 2x bet for regular win (1:1)', () => {
    expect(calculatePayout(10, 'win')).toBe(20);
  });

  it('returns 0 for loss', () => {
    expect(calculatePayout(10, 'lose')).toBe(0);
  });

  it('returns bet amount for push', () => {
    expect(calculatePayout(10, 'push')).toBe(10);
  });

  it('returns 0 for bust', () => {
    expect(calculatePayout(10, 'bust')).toBe(0);
  });
});

describe('resolveHand', () => {
  it('player bust → bust', () => {
    expect(resolveHand([card('K'), card('8'), card('5')], [card('10'), card('7')])).toBe('bust');
  });

  it('player blackjack, dealer no blackjack → blackjack', () => {
    expect(resolveHand([card('A'), card('K')], [card('10'), card('7')])).toBe('blackjack');
  });

  it('both blackjack → push', () => {
    expect(resolveHand([card('A'), card('K')], [card('A'), card('Q')])).toBe('push');
  });

  it('dealer bust → win', () => {
    expect(resolveHand([card('10'), card('7')], [card('K'), card('8'), card('5')])).toBe('win');
  });

  it('player higher → win', () => {
    expect(resolveHand([card('10'), card('9')], [card('10'), card('7')])).toBe('win');
  });

  it('dealer higher → lose', () => {
    expect(resolveHand([card('10'), card('7')], [card('10'), card('9')])).toBe('lose');
  });

  it('equal totals → push', () => {
    expect(resolveHand([card('10'), card('7')], [card('10'), card('7')])).toBe('push');
  });
});

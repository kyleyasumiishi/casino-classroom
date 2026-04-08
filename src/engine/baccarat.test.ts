import { describe, it, expect } from 'vitest';
import {
  evaluateHand,
  shouldPlayerDraw,
  shouldBankerDraw,
  resolveBaccarat,
  calculatePayout,
} from './baccarat';
import type { Card } from '../types/common';

function makeCard(rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card {
  return { id: `${suit}-${rank}-0`, suit, rank, faceUp: true };
}

describe('evaluateHand', () => {
  it('returns sum mod 10', () => {
    expect(evaluateHand([makeCard('7'), makeCard('5')])).toBe(2); // 12 mod 10
  });

  it('face cards count as 0', () => {
    expect(evaluateHand([makeCard('K'), makeCard('Q')])).toBe(0);
    expect(evaluateHand([makeCard('J'), makeCard('5')])).toBe(5);
  });

  it('ace counts as 1', () => {
    expect(evaluateHand([makeCard('A'), makeCard('3')])).toBe(4);
  });

  it('7 + 6 = 3 (13 mod 10)', () => {
    expect(evaluateHand([makeCard('7'), makeCard('6')])).toBe(3);
  });

  it('10 counts as 0', () => {
    expect(evaluateHand([makeCard('10'), makeCard('8')])).toBe(8);
  });
});

describe('shouldPlayerDraw', () => {
  it('true when total <= 5', () => {
    expect(shouldPlayerDraw(0, 2)).toBe(true);
    expect(shouldPlayerDraw(3, 2)).toBe(true);
    expect(shouldPlayerDraw(5, 2)).toBe(true);
  });

  it('false when total >= 6', () => {
    expect(shouldPlayerDraw(6, 2)).toBe(false);
    expect(shouldPlayerDraw(7, 2)).toBe(false);
  });

  it('false on natural (8 or 9)', () => {
    expect(shouldPlayerDraw(8, 2)).toBe(false);
    expect(shouldPlayerDraw(9, 2)).toBe(false);
  });
});

describe('shouldBankerDraw', () => {
  it('with no player third card (player stood): true when <= 5', () => {
    expect(shouldBankerDraw(5, 2, null)).toBe(true);
    expect(shouldBankerDraw(3, 2, null)).toBe(true);
    expect(shouldBankerDraw(6, 2, null)).toBe(false);
  });

  it('banker 3, player third card 8 → false', () => {
    expect(shouldBankerDraw(3, 2, 8)).toBe(false);
  });

  it('banker 4, player third card 1 → false', () => {
    expect(shouldBankerDraw(4, 2, 1)).toBe(false);
  });

  it('banker 4, player third card 2 → true', () => {
    expect(shouldBankerDraw(4, 2, 2)).toBe(true);
  });

  it('banker 4, player third card 3 → true', () => {
    expect(shouldBankerDraw(4, 2, 3)).toBe(true);
  });

  it('banker 4, player third card 7 → true', () => {
    expect(shouldBankerDraw(4, 2, 7)).toBe(true);
  });

  it('banker 4, player third card 8 → false', () => {
    expect(shouldBankerDraw(4, 2, 8)).toBe(false);
  });

  it('banker 6, player third card 6 → true', () => {
    expect(shouldBankerDraw(6, 2, 6)).toBe(true);
  });

  it('banker 6, player third card 7 → true', () => {
    expect(shouldBankerDraw(6, 2, 7)).toBe(true);
  });

  it('banker 7 → false (always stands)', () => {
    expect(shouldBankerDraw(7, 2, 5)).toBe(false);
    expect(shouldBankerDraw(7, 2, null)).toBe(false);
  });

  it('false on natural (8 or 9)', () => {
    expect(shouldBankerDraw(8, 2, 3)).toBe(false);
    expect(shouldBankerDraw(9, 2, 5)).toBe(false);
  });
});

describe('resolveBaccarat', () => {
  it('higher total wins', () => {
    expect(resolveBaccarat(7, 5)).toBe('player');
    expect(resolveBaccarat(3, 8)).toBe('banker');
  });

  it('equal totals → tie', () => {
    expect(resolveBaccarat(6, 6)).toBe('tie');
  });
});

describe('calculatePayout', () => {
  it('player bet wins → 1:1', () => {
    expect(calculatePayout({ type: 'player', amount: 100 }, 'player')).toBe(200);
  });

  it('banker bet wins → 0.95:1 (5% commission)', () => {
    expect(calculatePayout({ type: 'banker', amount: 100 }, 'banker')).toBe(195);
  });

  it('tie bet wins → 8:1', () => {
    expect(calculatePayout({ type: 'tie', amount: 100 }, 'tie')).toBe(900);
  });

  it('losing bet → 0', () => {
    expect(calculatePayout({ type: 'player', amount: 100 }, 'banker')).toBe(0);
    expect(calculatePayout({ type: 'banker', amount: 100 }, 'player')).toBe(0);
    expect(calculatePayout({ type: 'tie', amount: 100 }, 'player')).toBe(0);
  });

  it('tie result with player/banker bet → push (return bet)', () => {
    expect(calculatePayout({ type: 'player', amount: 100 }, 'tie')).toBe(100);
    expect(calculatePayout({ type: 'banker', amount: 100 }, 'tie')).toBe(100);
  });
});

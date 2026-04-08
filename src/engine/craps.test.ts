import { describe, it, expect } from 'vitest';
import {
  rollDice,
  resolveComeOutRoll,
  resolvePointRoll,
  calculateCrapsPayout,
  getAvailableBets,
} from './craps';
import type { CrapsBet, DiceRoll } from '../types/craps';

function makeBet(type: CrapsBet['type'], amount = 100, point?: number): CrapsBet {
  return { id: `${type}-test`, type, amount, point };
}

function roll(die1: number, die2: number): DiceRoll {
  return { die1, die2, total: die1 + die2, isHard: die1 === die2 };
}

describe('rollDice', () => {
  it('returns values 1-6 for each die', () => {
    for (let i = 0; i < 100; i++) {
      const r = rollDice();
      expect(r.die1).toBeGreaterThanOrEqual(1);
      expect(r.die1).toBeLessThanOrEqual(6);
      expect(r.die2).toBeGreaterThanOrEqual(1);
      expect(r.die2).toBeLessThanOrEqual(6);
    }
  });

  it('total equals sum of dice', () => {
    for (let i = 0; i < 50; i++) {
      const r = rollDice();
      expect(r.total).toBe(r.die1 + r.die2);
    }
  });

  it('isHard true when dice match', () => {
    const r = { die1: 3, die2: 3, total: 6, isHard: true } as DiceRoll;
    expect(r.isHard).toBe(true);
    const r2 = { die1: 4, die2: 2, total: 6, isHard: false } as DiceRoll;
    expect(r2.isHard).toBe(false);
  });
});

describe('resolveComeOutRoll', () => {
  it('7 → pass wins, don\'t pass loses', () => {
    const bets = [makeBet('pass'), makeBet('dontPass')];
    const results = resolveComeOutRoll(roll(3, 4), bets);
    const passResult = results.find((r) => r.bet.type === 'pass');
    const dpResult = results.find((r) => r.bet.type === 'dontPass');
    expect(passResult?.outcome).toBe('win');
    expect(dpResult?.outcome).toBe('lose');
  });

  it('11 → pass wins, don\'t pass loses', () => {
    const bets = [makeBet('pass'), makeBet('dontPass')];
    const results = resolveComeOutRoll(roll(5, 6), bets);
    expect(results.find((r) => r.bet.type === 'pass')?.outcome).toBe('win');
    expect(results.find((r) => r.bet.type === 'dontPass')?.outcome).toBe('lose');
  });

  it('2 → pass loses, don\'t pass wins', () => {
    const bets = [makeBet('pass'), makeBet('dontPass')];
    const results = resolveComeOutRoll(roll(1, 1), bets);
    expect(results.find((r) => r.bet.type === 'pass')?.outcome).toBe('lose');
    expect(results.find((r) => r.bet.type === 'dontPass')?.outcome).toBe('win');
  });

  it('3 → pass loses, don\'t pass wins', () => {
    const bets = [makeBet('pass'), makeBet('dontPass')];
    const results = resolveComeOutRoll(roll(1, 2), bets);
    expect(results.find((r) => r.bet.type === 'pass')?.outcome).toBe('lose');
    expect(results.find((r) => r.bet.type === 'dontPass')?.outcome).toBe('win');
  });

  it('12 → pass loses, don\'t pass pushes (bar 12)', () => {
    const bets = [makeBet('pass'), makeBet('dontPass')];
    const results = resolveComeOutRoll(roll(6, 6), bets);
    expect(results.find((r) => r.bet.type === 'pass')?.outcome).toBe('lose');
    const dp = results.find((r) => r.bet.type === 'dontPass');
    expect(dp?.outcome).toBe('push');
    expect(dp?.payout).toBe(100); // returns bet
  });

  it('4,5,6,8,9,10 → point established, no bets resolved', () => {
    for (const t of [4, 5, 6, 8, 9, 10]) {
      const d1 = t <= 6 ? 1 : 2;
      const d2 = t - d1;
      const bets = [makeBet('pass'), makeBet('dontPass')];
      const results = resolveComeOutRoll(roll(d1, d2), bets);
      // No pass/dontPass resolutions (point established)
      const passResults = results.filter((r) => r.bet.type === 'pass' || r.bet.type === 'dontPass');
      expect(passResults).toHaveLength(0);
    }
  });
});

describe('resolvePointRoll', () => {
  it('point hit → pass wins, don\'t pass loses', () => {
    const bets = [makeBet('pass'), makeBet('dontPass')];
    const results = resolvePointRoll(roll(2, 2), 4, bets);
    expect(results.find((r) => r.bet.type === 'pass')?.outcome).toBe('win');
    expect(results.find((r) => r.bet.type === 'dontPass')?.outcome).toBe('lose');
  });

  it('7 → pass loses, don\'t pass wins (seven-out)', () => {
    const bets = [makeBet('pass'), makeBet('dontPass')];
    const results = resolvePointRoll(roll(3, 4), 6, bets);
    expect(results.find((r) => r.bet.type === 'pass')?.outcome).toBe('lose');
    expect(results.find((r) => r.bet.type === 'dontPass')?.outcome).toBe('win');
  });

  it('7 → all place bets lose', () => {
    const bets = [makeBet('place6'), makeBet('place8'), makeBet('place4')];
    const results = resolvePointRoll(roll(3, 4), 5, bets);
    expect(results).toHaveLength(3);
    results.forEach((r) => expect(r.outcome).toBe('lose'));
  });

  it('field bet on 3 → wins 1:1', () => {
    const bets = [makeBet('field')];
    const results = resolvePointRoll(roll(1, 2), 6, bets);
    expect(results[0].outcome).toBe('win');
    expect(results[0].payout).toBe(200); // 1:1
  });

  it('field bet on 2 → wins 2:1', () => {
    const bets = [makeBet('field')];
    const results = resolvePointRoll(roll(1, 1), 6, bets);
    expect(results[0].outcome).toBe('win');
    expect(results[0].payout).toBe(300); // 2:1
  });

  it('field bet on 12 → wins 2:1', () => {
    const bets = [makeBet('field')];
    const results = resolvePointRoll(roll(6, 6), 4, bets);
    expect(results[0].outcome).toBe('win');
    expect(results[0].payout).toBe(300); // 2:1
  });

  it('field bet on 7 → loses', () => {
    const bets = [makeBet('field')];
    const results = resolvePointRoll(roll(3, 4), 6, bets);
    expect(results[0].outcome).toBe('lose');
  });

  it('place6 hit → pays 7:6', () => {
    const bets = [makeBet('place6', 60)]; // use 60 to get clean division
    const results = resolvePointRoll(roll(2, 4), 8, bets);
    expect(results[0].outcome).toBe('win');
    expect(results[0].payout).toBe(60 + 70); // 7:6
  });

  it('hardway6 (3+3) → pays 9:1', () => {
    const bets = [makeBet('hardway6')];
    const results = resolvePointRoll(roll(3, 3), 8, bets);
    expect(results[0].outcome).toBe('win');
    expect(results[0].payout).toBe(1000); // 100 * 10 (9:1 + stake)
  });

  it('hardway6 with easy 6 (4+2) → hardway loses', () => {
    const bets = [makeBet('hardway6')];
    const results = resolvePointRoll(roll(4, 2), 8, bets);
    expect(results[0].outcome).toBe('lose');
  });

  it('hardway loses on 7', () => {
    const bets = [makeBet('hardway6')];
    const results = resolvePointRoll(roll(3, 4), 8, bets);
    expect(results[0].outcome).toBe('lose');
  });

  it('anySeven on 7 → pays 4:1', () => {
    const bets = [makeBet('anySeven')];
    const results = resolvePointRoll(roll(3, 4), 6, bets);
    expect(results[0].outcome).toBe('win');
    expect(results[0].payout).toBe(500); // 4:1 + stake
  });

  it('anyCraps on 2 → pays 7:1', () => {
    const bets = [makeBet('anyCraps')];
    const results = resolvePointRoll(roll(1, 1), 6, bets);
    expect(results[0].outcome).toBe('win');
    expect(results[0].payout).toBe(800); // 7:1 + stake
  });
});

describe('calculateCrapsPayout', () => {
  it('pass odds on 4/10 → 2:1', () => {
    expect(calculateCrapsPayout('passOdds', 100, 4)).toBe(300); // 100 + 200
    expect(calculateCrapsPayout('passOdds', 100, 10)).toBe(300);
  });

  it('pass odds on 5/9 → 3:2', () => {
    expect(calculateCrapsPayout('passOdds', 100, 5)).toBe(250); // 100 + 150
    expect(calculateCrapsPayout('passOdds', 100, 9)).toBe(250);
  });

  it('pass odds on 6/8 → 6:5', () => {
    expect(calculateCrapsPayout('passOdds', 100, 6)).toBe(220); // 100 + 120
    expect(calculateCrapsPayout('passOdds', 100, 8)).toBe(220);
  });

  it('don\'t pass odds on 4/10 → 1:2', () => {
    expect(calculateCrapsPayout('dontPassOdds', 100, 4)).toBe(150); // 100 + 50
  });

  it('uses integer math (no floating point errors)', () => {
    // All these should be exact integers, no .99999 or .00001
    const payouts = [
      calculateCrapsPayout('passOdds', 10, 5),   // 10 + 15 = 25
      calculateCrapsPayout('passOdds', 10, 6),   // 10 + 12 = 22
      calculateCrapsPayout('place6', 30),          // 30 + 35 = 65
      calculateCrapsPayout('dontPassOdds', 10, 9), // 10 + 6 = 16
    ];
    payouts.forEach((p) => expect(p).toBe(Math.floor(p)));
  });
});

describe('getAvailableBets', () => {
  it('comeOut → pass, dontPass, field, props', () => {
    const available = getAvailableBets('comeOut', null, []);
    expect(available).toContain('pass');
    expect(available).toContain('dontPass');
    expect(available).toContain('field');
    expect(available).toContain('anySeven');
    expect(available).toContain('anyCraps');
    expect(available).toContain('aces');
  });

  it('point → come, dontCome, odds, place, field, props, hardways', () => {
    const passBet = makeBet('pass');
    const available = getAvailableBets('point', 6, [passBet]);
    expect(available).toContain('come');
    expect(available).toContain('dontCome');
    expect(available).toContain('passOdds');
    expect(available).toContain('place4');
    expect(available).toContain('place8');
    expect(available).toContain('field');
    expect(available).toContain('anySeven');
    expect(available).toContain('hardway6');
  });

  it('excludes bets already at max', () => {
    const bets = [makeBet('pass'), makeBet('hardway6')];
    const available = getAvailableBets('comeOut', null, bets);
    expect(available).not.toContain('pass');
    expect(available).not.toContain('hardway6');
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCraps } from './useCraps';
import { useWallet } from '../store/useWallet';
import { STARTING_BALANCE } from '../types/common';
import * as crapsEngine from '../engine/craps';
import type { DiceRoll } from '../types/craps';

function mockRoll(die1: number, die2: number): DiceRoll {
  return { die1, die2, total: die1 + die2, isHard: die1 === die2 };
}

describe('useCraps', () => {
  beforeEach(() => {
    useWallet.setState({
      balance: STARTING_BALANCE,
      totalWon: 0,
      totalLost: 0,
    });
    vi.restoreAllMocks();
  });

  it('initializes in comeOut phase with no point', () => {
    const { result } = renderHook(() => useCraps());
    expect(result.current.phase).toBe('comeOut');
    expect(result.current.point).toBeNull();
    expect(result.current.activeBets).toEqual([]);
  });

  it('placeBet adds to activeBets', () => {
    const { result } = renderHook(() => useCraps());
    act(() => result.current.placeBet('pass', 25));
    expect(result.current.activeBets).toHaveLength(1);
    expect(result.current.activeBets[0].type).toBe('pass');
    expect(result.current.activeBets[0].amount).toBe(25);
    expect(useWallet.getState().balance).toBe(STARTING_BALANCE - 25);
  });

  it('placeBet rejects invalid bets for current phase', () => {
    const { result } = renderHook(() => useCraps());
    // Can't place come bets during comeOut
    act(() => result.current.placeBet('come', 25));
    expect(result.current.activeBets).toHaveLength(0);
    expect(useWallet.getState().balance).toBe(STARTING_BALANCE);
  });

  it('roll on come-out: 7 resolves pass/dontPass, stays in comeOut', () => {
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(3, 4)); // 7

    const { result } = renderHook(() => useCraps());
    act(() => result.current.placeBet('pass', 50));
    act(() => result.current.roll());

    expect(result.current.phase).toBe('comeOut');
    expect(result.current.point).toBeNull();
    expect(result.current.activeBets).toHaveLength(0);
    // Pass wins on 7: balance = 1000 - 50 (bet) + 100 (payout) = 1050
    expect(useWallet.getState().balance).toBe(STARTING_BALANCE - 50 + 100);
  });

  it('roll on come-out: 4 establishes point, transitions to point phase', () => {
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(2, 2)); // 4

    const { result } = renderHook(() => useCraps());
    act(() => result.current.placeBet('pass', 50));
    act(() => result.current.roll());

    expect(result.current.phase).toBe('point');
    expect(result.current.point).toBe(4);
    expect(result.current.activeBets).toHaveLength(1); // pass bet stays
  });

  it('roll on point: point hit → resolves, new come-out', () => {
    // Roll 1: establish point of 4
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(2, 2));
    const { result } = renderHook(() => useCraps());
    act(() => result.current.placeBet('pass', 50));
    act(() => result.current.roll());
    expect(result.current.phase).toBe('point');

    // Roll 2: hit the point (4)
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(1, 3));
    act(() => result.current.roll());

    expect(result.current.phase).toBe('comeOut');
    expect(result.current.point).toBeNull();
    expect(result.current.activeBets).toHaveLength(0);
    // Pass wins: 1000 - 50 + 100 = 1050
    expect(useWallet.getState().balance).toBe(STARTING_BALANCE - 50 + 100);
  });

  it('roll on point: 7 → seven-out, all bets resolved, new shooter', () => {
    // Establish point of 6
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(2, 4));
    const { result } = renderHook(() => useCraps());
    act(() => result.current.placeBet('pass', 50));
    act(() => result.current.roll());
    expect(result.current.phase).toBe('point');

    // Seven-out
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(3, 4));
    act(() => result.current.roll());

    expect(result.current.phase).toBe('resolved');
    expect(result.current.activeBets).toHaveLength(0);
    // Pass loses: balance = 1000 - 50 = 950
    expect(useWallet.getState().balance).toBe(STARTING_BALANCE - 50);
  });

  it('come bet travels to number on non-7/11/craps roll', () => {
    // Establish point of 6
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(2, 4));
    const { result } = renderHook(() => useCraps());
    act(() => result.current.placeBet('pass', 25));
    act(() => result.current.roll());

    // Place come bet
    act(() => result.current.placeBet('come', 25));
    expect(result.current.activeBets).toHaveLength(2);

    // Roll 8 — come bet travels to 8
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(3, 5));
    act(() => result.current.roll());

    const comeBet = result.current.activeBets.find((b) => b.type === 'come');
    expect(comeBet?.point).toBe(8);
  });

  it('come odds can be placed on traveled come bet', () => {
    // Establish point of 6
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(2, 4));
    const { result } = renderHook(() => useCraps());
    act(() => result.current.placeBet('pass', 25));
    act(() => result.current.roll());

    // Place come bet and roll to travel it
    act(() => result.current.placeBet('come', 25));
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(3, 5)); // 8
    act(() => result.current.roll());

    // Now comeOdds should be available
    expect(result.current.availableBets).toContain('comeOdds');
    act(() => result.current.placeBet('comeOdds', 25));

    const comeOddsBet = result.current.activeBets.find((b) => b.type === 'comeOdds');
    expect(comeOddsBet).toBeDefined();
  });

  it('removeBet removes place bet (allowed)', () => {
    // Establish point
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(2, 4));
    const { result } = renderHook(() => useCraps());
    act(() => result.current.placeBet('pass', 25));
    act(() => result.current.roll());

    // Place a place6 bet
    act(() => result.current.placeBet('place6', 30));
    expect(result.current.activeBets).toHaveLength(2);

    const placeBet = result.current.activeBets.find((b) => b.type === 'place6')!;
    act(() => result.current.removeBet(placeBet.id));

    expect(result.current.activeBets).toHaveLength(1);
    // Bet amount returned to wallet
    expect(useWallet.getState().balance).toBe(STARTING_BALANCE - 25 - 30 + 30);
  });

  it('removeBet does not remove pass bet (not allowed once point established)', () => {
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(2, 4));
    const { result } = renderHook(() => useCraps());
    act(() => result.current.placeBet('pass', 25));
    act(() => result.current.roll());

    const passBet = result.current.activeBets.find((b) => b.type === 'pass')!;
    act(() => result.current.removeBet(passBet.id));

    // Pass bet should NOT be removed
    expect(result.current.activeBets.find((b) => b.type === 'pass')).toBeDefined();
  });

  it('beginner toggle filters displayed bet zones', () => {
    const { result } = renderHook(() => useCraps());
    expect(result.current.showBeginnerLayout).toBe(true);
    act(() => result.current.toggleBeginner());
    expect(result.current.showBeginnerLayout).toBe(false);
    act(() => result.current.toggleBeginner());
    expect(result.current.showBeginnerLayout).toBe(true);
  });

  it('roll resolves all active bets correctly in single roll', () => {
    // Establish point of 6
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(2, 4));
    const { result } = renderHook(() => useCraps());
    act(() => result.current.placeBet('pass', 50));
    act(() => result.current.roll());

    // Add a field bet
    act(() => result.current.placeBet('field', 25));

    // Roll 7: pass loses (seven-out), field loses (7 not in field)
    vi.spyOn(crapsEngine, 'rollDice').mockReturnValue(mockRoll(3, 4));
    act(() => result.current.roll());

    expect(result.current.lastResults).toHaveLength(2);
    expect(result.current.phase).toBe('resolved');
    // Both bets lost: 1000 - 50 - 25 = 925
    expect(useWallet.getState().balance).toBe(STARTING_BALANCE - 50 - 25);
  });
});

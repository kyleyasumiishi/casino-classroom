import { describe, it, expect, beforeEach } from 'vitest';
import { useWallet } from './useWallet';
import { STARTING_BALANCE } from '../types/common';

describe('useWallet', () => {
  beforeEach(() => {
    // Reset store state directly (localStorage is cleared by test-setup afterEach)
    useWallet.setState({
      balance: STARTING_BALANCE,
      totalWon: 0,
      totalLost: 0,
    });
  });

  it('initial balance is 1000', () => {
    expect(useWallet.getState().balance).toBe(1000);
  });

  it('placeBet deducts from balance', () => {
    const result = useWallet.getState().placeBet(100);
    expect(result).toBe(true);
    expect(useWallet.getState().balance).toBe(900);
  });

  it('placeBet returns false if insufficient balance', () => {
    const result = useWallet.getState().placeBet(1500);
    expect(result).toBe(false);
    expect(useWallet.getState().balance).toBe(1000);
  });

  it('winBet adds to balance and totalWon', () => {
    useWallet.getState().placeBet(100);
    useWallet.getState().winBet(200, 100);
    expect(useWallet.getState().balance).toBe(1100);
    expect(useWallet.getState().totalWon).toBe(100);
  });

  it('pushBet returns exact bet amount', () => {
    useWallet.getState().placeBet(50);
    useWallet.getState().pushBet(50);
    expect(useWallet.getState().balance).toBe(1000);
    expect(useWallet.getState().totalWon).toBe(0);
    expect(useWallet.getState().totalLost).toBe(0);
  });

  it('loseBet tracks loss without deducting balance', () => {
    useWallet.getState().placeBet(100);
    useWallet.getState().loseBet(100);
    expect(useWallet.getState().balance).toBe(900);
    expect(useWallet.getState().totalLost).toBe(100);
  });

  it('reset restores to 1000 and clears totals', () => {
    useWallet.getState().placeBet(500);
    useWallet.getState().loseBet(500);
    useWallet.getState().reset();
    expect(useWallet.getState().balance).toBe(1000);
    expect(useWallet.getState().totalWon).toBe(0);
    expect(useWallet.getState().totalLost).toBe(0);
  });

  it('persists to localStorage across store recreations', () => {
    useWallet.getState().placeBet(300);
    const stored = localStorage.getItem('casino-classroom-wallet');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.balance).toBe(700);
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBaccarat } from './useBaccarat';
import { useWallet } from '../store/useWallet';
import { STARTING_BALANCE } from '../types/common';
import * as deckModule from '../engine/deck';
import type { Card } from '../types/common';

function card(rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card {
  return { id: `${suit}-${rank}-test`, suit, rank, faceUp: true };
}

// drawCard pops from end, so reverse desired deal order
function rigDeck(cards: Card[]): Card[] {
  return [...cards].reverse();
}

describe('useBaccarat', () => {
  beforeEach(() => {
    useWallet.setState({
      balance: STARTING_BALANCE,
      totalWon: 0,
      totalLost: 0,
    });
    vi.restoreAllMocks();
  });

  it('initializes in betting phase', () => {
    const { result } = renderHook(() => useBaccarat());
    expect(result.current.phase).toBe('betting');
    expect(result.current.bets).toEqual([]);
  });

  it('placeBet adds bet to bets array', () => {
    const { result } = renderHook(() => useBaccarat());
    act(() => result.current.placeBet('player', 25));
    expect(result.current.bets).toEqual([{ type: 'player', amount: 25 }]);
  });

  it('placeBet on same type increases existing bet', () => {
    const { result } = renderHook(() => useBaccarat());
    act(() => result.current.placeBet('banker', 25));
    act(() => result.current.placeBet('banker', 50));
    expect(result.current.bets).toEqual([{ type: 'banker', amount: 75 }]);
  });

  it('deal transitions through dealing to resolved', () => {
    // Player: 7+3=0 (draws), Banker: K+5=5
    // Player 3rd: 4 → player total = 4. Banker 5 with player 3rd=4 → draws
    // Banker 3rd: 2 → banker total = 7. Player=4, Banker=7 → banker wins
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([
        card('7'), card('K'),   // player1, banker1
        card('3'), card('5'),   // player2, banker2
        card('4'),              // player 3rd
        card('2'),              // banker 3rd
      ])
    );

    const { result } = renderHook(() => useBaccarat());
    act(() => result.current.placeBet('banker', 100));
    act(() => result.current.deal());

    expect(result.current.phase).toBe('resolved');
    expect(result.current.result).toBe('banker');
    expect(result.current.playerHand).toHaveLength(3);
    expect(result.current.bankerHand).toHaveLength(3);
  });

  it('third card dealt to player when total <= 5', () => {
    // Player: 2+3=5 (draws), Banker: K+7=7 (stands on 7)
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([
        card('2'), card('K'),   // player1, banker1
        card('3'), card('7'),   // player2, banker2
        card('A'),              // player 3rd (total becomes 6)
      ])
    );

    const { result } = renderHook(() => useBaccarat());
    act(() => result.current.placeBet('player', 50));
    act(() => result.current.deal());

    expect(result.current.playerHand).toHaveLength(3);
    expect(result.current.bankerHand).toHaveLength(2);
  });

  it('third card dealt to banker per tableau rules', () => {
    // Player: 9+7=6 (stands), Banker: 2+3=5 (player stood, banker draws on <=5)
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([
        card('9'), card('2'),   // player1, banker1
        card('7'), card('3'),   // player2, banker2
        card('4'),              // banker 3rd
      ])
    );

    const { result } = renderHook(() => useBaccarat());
    act(() => result.current.placeBet('player', 50));
    act(() => result.current.deal());

    expect(result.current.playerHand).toHaveLength(2);
    expect(result.current.bankerHand).toHaveLength(3);
  });

  it('no third cards on natural 8 or 9', () => {
    // Player: 9+K=9 (natural), Banker: 4+4=8 (natural)
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([
        card('9'), card('4'),
        card('K'), card('4', 'diamonds'),
      ])
    );

    const { result } = renderHook(() => useBaccarat());
    act(() => result.current.placeBet('player', 50));
    act(() => result.current.deal());

    expect(result.current.playerHand).toHaveLength(2);
    expect(result.current.bankerHand).toHaveLength(2);
    expect(result.current.result).toBe('player'); // 9 > 8
  });

  it('resolve updates wallet correctly for win', () => {
    // Player: A+8=9 (natural), Banker: 3+4=7
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([
        card('A'), card('3'),
        card('8'), card('4'),
      ])
    );

    const { result } = renderHook(() => useBaccarat());
    act(() => result.current.placeBet('player', 100));
    act(() => result.current.deal());

    expect(result.current.result).toBe('player');
    // Player bet wins 1:1: wallet starts at 1000, bet 100 deducted = 900, then win returns 200
    expect(useWallet.getState().balance).toBe(STARTING_BALANCE - 100 + 200);
  });

  it('resolve pushes player/banker bets on tie', () => {
    // Player: 3+4=7, Banker: K+7=7 → tie
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([
        card('3'), card('K'),
        card('4'), card('7'),
      ])
    );

    const { result } = renderHook(() => useBaccarat());
    act(() => result.current.placeBet('player', 50));
    act(() => result.current.deal());

    expect(result.current.result).toBe('tie');
    // Player bet pushes on tie — balance should be back to starting
    expect(useWallet.getState().balance).toBe(STARTING_BALANCE);
  });

  it('newRound resets to betting phase', () => {
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([
        card('A'), card('3'),
        card('8'), card('4'),
      ])
    );

    const { result } = renderHook(() => useBaccarat());
    act(() => result.current.placeBet('player', 50));
    act(() => result.current.deal());
    expect(result.current.phase).toBe('resolved');

    act(() => result.current.newRound());
    expect(result.current.phase).toBe('betting');
    expect(result.current.bets).toEqual([]);
    expect(result.current.playerHand).toEqual([]);
    expect(result.current.bankerHand).toEqual([]);
    expect(result.current.result).toBeUndefined();
  });
});

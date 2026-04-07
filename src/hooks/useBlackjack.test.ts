import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlackjack } from './useBlackjack';
import { useWallet } from '../store/useWallet';
import { STARTING_BALANCE } from '../types/common';
import * as deckModule from '../engine/deck';
import type { Card } from '../types/common';

function card(rank: Card['rank'], suit: Card['suit'] = 'hearts', faceUp = true): Card {
  return { id: `${suit}-${rank}-test`, suit, rank, faceUp };
}

// Helper to create a rigged deck that deals specific cards
function rigDeck(cards: Card[]): Card[] {
  // drawCard pops from the end, so reverse the desired deal order
  return [...cards].reverse();
}

describe('useBlackjack', () => {
  beforeEach(() => {
    useWallet.setState({
      balance: STARTING_BALANCE,
      totalWon: 0,
      totalLost: 0,
    });
    vi.restoreAllMocks();
  });

  it('initializes in betting phase', () => {
    const { result } = renderHook(() => useBlackjack());
    expect(result.current.phase).toBe('betting');
  });

  it('deal transitions to playerTurn (normal hand)', () => {
    // Rig deck: player gets 7+8, dealer gets 2+3 (no blackjack)
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('7'), card('2'), card('8'), card('3')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    expect(result.current.phase).toBe('playerTurn');
    expect(result.current.playerHands[0].cards).toHaveLength(2);
    expect(result.current.dealerHand).toHaveLength(2);
  });

  it('deal transitions to resolved on player blackjack', () => {
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('A'), card('5'), card('K'), card('6')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    expect(result.current.phase).toBe('resolved');
    expect(result.current.playerHands[0].result).toBe('blackjack');
  });

  it('deal transitions to resolved on dealer blackjack', () => {
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('7'), card('A'), card('8'), card('K')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    expect(result.current.phase).toBe('resolved');
    expect(result.current.playerHands[0].result).toBe('lose');
  });

  it('hit adds card to active hand', () => {
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('7'), card('2'), card('8'), card('3'), card('4')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    act(() => result.current.hit());
    expect(result.current.playerHands[0].cards).toHaveLength(3);
  });

  it('hit transitions to resolved on bust', () => {
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('10'), card('2'), card('6'), card('3'), card('K')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    // Player has 10+6=16, hits K → busts with 26
    act(() => result.current.hit());
    expect(result.current.phase).toBe('resolved');
  });

  it('stand on single hand transitions to resolved (dealer plays)', () => {
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('10'), card('5'), card('7'), card('6'), card('8')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    act(() => result.current.stand());
    expect(result.current.phase).toBe('resolved');
  });

  it('double doubles bet, adds one card, transitions to resolved', () => {
    // Player: 5+6=11, doubles, gets 4→15. Dealer: 2+3=5, draws 10→15, draws 3→18
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('5'), card('2'), card('6'), card('3'), card('4'), card('10'), card('3', 'clubs')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    act(() => result.current.double());
    expect(result.current.playerHands[0].cards).toHaveLength(3);
    expect(result.current.playerHands[0].bet).toBe(20);
    expect(result.current.playerHands[0].isDoubled).toBe(true);
    expect(result.current.phase).toBe('resolved');
  });

  it('split creates two hands from a pair', () => {
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([
        card('8', 'hearts'),
        card('5'),
        card('8', 'clubs'),
        card('3'),
        // Cards dealt to split hands
        card('2'),
        // Extra cards for dealer play
        card('10'),
        card('7'),
      ])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    act(() => result.current.split());
    expect(result.current.playerHands).toHaveLength(2);
  });

  it('dealer plays until >= 17', () => {
    // Dealer has 5+6=11, needs to hit. Next card is 10 → 21, stands.
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('10'), card('5'), card('7'), card('6'), card('10')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    act(() => result.current.stand());
    expect(result.current.phase).toBe('resolved');
    // Dealer should have drawn until >= 17
    const dealerCards = result.current.dealerHand;
    const total = dealerCards.reduce((sum, c) => {
      if (['K', 'Q', 'J'].includes(c.rank)) return sum + 10;
      if (c.rank === 'A') return sum + 11;
      return sum + parseInt(c.rank, 10);
    }, 0);
    expect(total).toBeGreaterThanOrEqual(17);
  });

  it('resolve correctly identifies win and calls wallet.winBet', () => {
    // Player 10+9=19 vs dealer 5+6=11 → dealer draws 10 → 21 → player loses
    // Actually let's make player win: player 10+9=19, dealer 5+6+3=14, draws more...
    // Simpler: player 10+K=20, dealer 5+6=11 draws 4=15 draws 3=18 → player wins
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('10'), card('5'), card('K'), card('6'), card('4'), card('3')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    act(() => result.current.stand());

    expect(result.current.phase).toBe('resolved');
    expect(result.current.playerHands[0].result).toBe('win');
    // Balance: 1000 - 10 (bet) + 20 (win payout) = 1010
    expect(useWallet.getState().balance).toBe(1010);
  });

  it('resolve calls wallet.placeBet on initial deal', () => {
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('7'), card('2'), card('8'), card('3')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(100));
    act(() => result.current.deal());
    expect(useWallet.getState().balance).toBe(900);
  });

  it('newRound resets to betting phase', () => {
    vi.spyOn(deckModule, 'createDeck').mockReturnValue(
      rigDeck([card('10'), card('5'), card('K'), card('6'), card('4'), card('3')])
    );

    const { result } = renderHook(() => useBlackjack());
    act(() => result.current.placeBet(10));
    act(() => result.current.deal());
    act(() => result.current.stand());
    act(() => result.current.newRound());
    expect(result.current.phase).toBe('betting');
    expect(result.current.playerHands).toHaveLength(0);
  });
});

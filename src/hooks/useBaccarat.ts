import { useState, useCallback, useEffect } from 'react';
import type { Card } from '../types/common';
import type {
  BaccaratPhase,
  BaccaratBetType,
  BaccaratResult,
  BaccaratBet,
  BaccaratGameState,
} from '../types/baccarat';
import { MIN_BET, MAX_BET } from '../types/common';
import { createDeck, drawCard } from '../engine/deck';
import {
  evaluateHand,
  shouldPlayerDraw,
  shouldBankerDraw,
  resolveBaccarat,
  calculatePayout,
} from '../engine/baccarat';
import { useWallet } from '../store/useWallet';

const RESHUFFLE_THRESHOLD = 0.75;
const NUM_DECKS = 8;
const TOTAL_CARDS = NUM_DECKS * 52;

function makeDeck(): Card[] {
  return createDeck(NUM_DECKS);
}

function needsReshuffle(deck: Card[]): boolean {
  return deck.length < TOTAL_CARDS * (1 - RESHUFFLE_THRESHOLD);
}

export function useBaccarat() {
  const wallet = useWallet();

  const [phase, setPhase] = useState<BaccaratPhase>('betting');
  const [deck, setDeck] = useState<Card[]>(makeDeck);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [bankerHand, setBankerHand] = useState<Card[]>([]);
  const [bets, setBets] = useState<BaccaratBet[]>([]);
  const [result, setResult] = useState<BaccaratResult | undefined>();
  const [resultMessage, setResultMessage] = useState<{
    result: BaccaratResult;
    netAmount: number;
  } | null>(null);

  // Refund unresolved bets on unmount
  useEffect(() => {
    return () => {
      if (phase !== 'betting' && phase !== 'resolved') {
        for (const bet of bets) {
          wallet.pushBet(bet.amount);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state: BaccaratGameState = {
    phase,
    deck,
    playerHand,
    bankerHand,
    bets,
    result,
  };

  const placeBet = useCallback(
    (type: BaccaratBetType, amount: number) => {
      if (phase !== 'betting') return;
      if (amount < MIN_BET || amount > MAX_BET) return;

      setBets((prev) => {
        const existing = prev.find((b) => b.type === type);
        if (existing) {
          return prev.map((b) =>
            b.type === type ? { ...b, amount: b.amount + amount } : b
          );
        }
        return [...prev, { type, amount }];
      });
    },
    [phase]
  );

  const clearBets = useCallback(() => {
    if (phase !== 'betting') return;
    setBets([]);
  }, [phase]);

  const deal = useCallback(() => {
    if (phase !== 'betting' || bets.length === 0) return;

    // Place all bets with wallet
    const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);
    if (!wallet.placeBet(totalBet)) return;

    let d = needsReshuffle(deck) ? makeDeck() : [...deck];

    // Draw initial 4 cards: player, banker, player, banker
    const draw = () => {
      const { card, deck: rem } = drawCard(d);
      d = rem;
      return { ...card, faceUp: true };
    };

    const p1 = draw();
    const b1 = draw();
    const p2 = draw();
    const b2 = draw();

    let pCards = [p1, p2];
    let bCards = [b1, b2];

    const playerTotal = evaluateHand(pCards);
    const bankerTotal = evaluateHand(bCards);

    // Check for naturals
    const isNatural = playerTotal >= 8 || bankerTotal >= 8;

    if (!isNatural) {
      // Player third card
      let playerThirdCardValue: number | null = null;

      if (shouldPlayerDraw(playerTotal, 2)) {
        const p3 = draw();
        pCards = [...pCards, p3];
        playerThirdCardValue = parseInt(p3.rank, 10);
        // Face cards and 10 = 0, Ace = 1
        if (['K', 'Q', 'J', '10'].includes(p3.rank)) playerThirdCardValue = 0;
        if (p3.rank === 'A') playerThirdCardValue = 1;
      }

      // Banker third card
      const newBankerTotal = evaluateHand(bCards);
      if (shouldBankerDraw(newBankerTotal, 2, playerThirdCardValue)) {
        const b3 = draw();
        bCards = [...bCards, b3];
      }
    }

    // Resolve
    const finalPlayerTotal = evaluateHand(pCards);
    const finalBankerTotal = evaluateHand(bCards);
    const roundResult = resolveBaccarat(finalPlayerTotal, finalBankerTotal);

    // Calculate payouts
    let totalPayout = 0;
    let totalStake = 0;
    for (const bet of bets) {
      totalPayout += calculatePayout(bet, roundResult);
      totalStake += bet.amount;
    }

    // Settle with wallet
    if (totalPayout > 0) {
      wallet.winBet(totalPayout, totalStake);
    } else {
      wallet.loseBet(totalStake);
    }

    const netAmount =
      totalPayout > totalStake
        ? totalPayout - totalStake
        : totalPayout < totalStake
          ? totalStake - totalPayout
          : 0;

    setDeck(d);
    setPlayerHand(pCards);
    setBankerHand(bCards);
    setResult(roundResult);
    setResultMessage({ result: roundResult, netAmount });
    setPhase('resolved');
  }, [phase, bets, deck, wallet]);

  const newRound = useCallback(() => {
    setPhase('betting');
    setPlayerHand([]);
    setBankerHand([]);
    setBets([]);
    setResult(undefined);
    setResultMessage(null);
  }, []);

  return {
    ...state,
    resultMessage,
    placeBet,
    clearBets,
    deal,
    newRound,
  };
}

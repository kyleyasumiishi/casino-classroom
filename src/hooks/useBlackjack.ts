import { useState, useCallback, useEffect } from 'react';
import type { Card } from '../types/common';
import type {
  BlackjackPhase,
  BlackjackAction,
  BlackjackHand,
  BlackjackGameState,
  HandResult,
} from '../types/blackjack';
import { MIN_BET, MAX_BET } from '../types/common';
import { createDeck, drawCard } from '../engine/deck';
import {
  evaluateHand,
  dealerShouldHit,
  getAvailableActions,
  calculatePayout,
  resolveHand,
} from '../engine/blackjack';
import { useWallet } from '../store/useWallet';

const RESHUFFLE_THRESHOLD = 0.75;
const NUM_DECKS = 6;
const TOTAL_CARDS = NUM_DECKS * 52;

function makeDeck(): Card[] {
  return createDeck(NUM_DECKS);
}

function needsReshuffle(deck: Card[]): boolean {
  return deck.length < TOTAL_CARDS * (1 - RESHUFFLE_THRESHOLD);
}

export function useBlackjack() {
  const wallet = useWallet();

  const [phase, setPhase] = useState<BlackjackPhase>('betting');
  const [deck, setDeck] = useState<Card[]>(makeDeck);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerHands, setPlayerHands] = useState<BlackjackHand[]>([]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [insuranceBet, setInsuranceBet] = useState<number | null>(null);
  const [currentBet, setCurrentBet] = useState(0);
  const [resultMessage, setResultMessage] = useState<{
    result: HandResult;
    amount: number;
  } | null>(null);

  // Compute available actions
  const availableActions: BlackjackAction[] =
    phase === 'playerTurn' && playerHands[activeHandIndex]
      ? getAvailableActions(
          playerHands[activeHandIndex],
          dealerHand[0],
          wallet.balance
        )
      : [];

  const state: BlackjackGameState = {
    phase,
    deck,
    dealerHand,
    playerHands,
    activeHandIndex,
    insuranceBet,
    availableActions,
  };

  // Refund unresolved bets on unmount
  useEffect(() => {
    return () => {
      // Use the store directly to check current state at unmount time
      const currentPhase = phase;
      if (currentPhase !== 'betting' && currentPhase !== 'resolved') {
        // Refund all active bets
        for (const hand of playerHands) {
          wallet.pushBet(hand.bet);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawFromDeck = useCallback(
    (
      currentDeck: Card[],
      faceUp = true
    ): { card: Card; newDeck: Card[] } => {
      let d = currentDeck;
      if (d.length === 0) d = makeDeck();
      const { card, deck: remaining } = drawCard(d);
      return { card: { ...card, faceUp }, newDeck: remaining };
    },
    []
  );

  const placeBet = useCallback(
    (amount: number) => {
      if (phase !== 'betting') return;
      // Allow 0 to clear the bet
      if (amount === 0) {
        setCurrentBet(0);
        return;
      }
      if (amount < MIN_BET || amount > MAX_BET) return;
      setCurrentBet(amount);
    },
    [phase]
  );

  const deal = useCallback(() => {
    if (phase !== 'betting' || currentBet < MIN_BET) return;

    if (!wallet.placeBet(currentBet)) return;

    let d = needsReshuffle(deck) ? makeDeck() : [...deck];

    // Draw 4 cards: player, dealer, player, dealer
    const { card: p1, newDeck: d1 } = (() => {
      const { card, deck: rem } = drawCard(d);
      return { card: { ...card, faceUp: true }, newDeck: rem };
    })();
    d = d1;

    const { card: dl1, newDeck: d2 } = (() => {
      const { card, deck: rem } = drawCard(d);
      return { card: { ...card, faceUp: true }, newDeck: rem };
    })();
    d = d2;

    const { card: p2, newDeck: d3 } = (() => {
      const { card, deck: rem } = drawCard(d);
      return { card: { ...card, faceUp: true }, newDeck: rem };
    })();
    d = d3;

    const { card: dl2, newDeck: d4 } = (() => {
      const { card, deck: rem } = drawCard(d);
      return { card: { ...card, faceUp: false }, newDeck: rem };
    })();
    d = d4;

    const newDealerHand = [dl1, dl2];
    const newPlayerHand: BlackjackHand = {
      cards: [p1, p2],
      bet: currentBet,
      isDoubled: false,
    };

    setDeck(d);
    setDealerHand(newDealerHand);
    setPlayerHands([newPlayerHand]);
    setActiveHandIndex(0);
    setInsuranceBet(null);
    setResultMessage(null);

    // Check for player blackjack
    const playerEval = evaluateHand([p1, p2]);
    const dealerEval = evaluateHand(newDealerHand);

    if (playerEval.isBlackjack || dealerEval.isBlackjack) {
      // Reveal dealer card
      const revealedDealer = newDealerHand.map((c) => ({ ...c, faceUp: true }));
      setDealerHand(revealedDealer);

      const result = resolveHand([p1, p2], revealedDealer);
      const payout = calculatePayout(currentBet, result);

      const resolvedHand: BlackjackHand = {
        ...newPlayerHand,
        result,
      };
      setPlayerHands([resolvedHand]);

      if (payout > 0) {
        wallet.winBet(payout, currentBet);
      } else {
        wallet.loseBet(currentBet);
      }

      setResultMessage({ result, amount: payout > 0 ? payout - currentBet : currentBet });
      setPhase('resolved');
      return;
    }

    setPhase('playerTurn');
  }, [phase, currentBet, deck, wallet]);

  const advanceHand = useCallback(
    (
      hands: BlackjackHand[],
      handIdx: number,
      currentDeck: Card[],
      currentDealerHand: Card[]
    ) => {
      // Check if there are more hands to play (split)
      if (handIdx + 1 < hands.length) {
        setActiveHandIndex(handIdx + 1);
        setPlayerHands(hands);
        setDeck(currentDeck);

        // If next hand is split aces, deal one card and move on
        const nextHand = hands[handIdx + 1];
        if (nextHand.cards.length === 1 && nextHand.cards[0].rank === 'A') {
          const { card, newDeck } = (() => {
            const { card: c, deck: rem } = drawCard(currentDeck);
            return { card: { ...c, faceUp: true }, newDeck: rem };
          })();
          const updatedHand = { ...nextHand, cards: [...nextHand.cards, card] };
          const updatedHands = [...hands];
          updatedHands[handIdx + 1] = updatedHand;

          // This hand is done (split aces get one card only)
          advanceHand(updatedHands, handIdx + 1, newDeck, currentDealerHand);
        }
      } else {
        // All hands played — dealer's turn
        setPlayerHands(hands);
        playDealer(hands, currentDeck, currentDealerHand);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const playDealer = useCallback(
    (
      hands: BlackjackHand[],
      currentDeck: Card[],
      currentDealerHand: Card[]
    ) => {
      // Reveal dealer hole card
      let dHand = currentDealerHand.map((c) => ({ ...c, faceUp: true }));
      let d = currentDeck;

      // Check if any player hand is not busted (if all busted, dealer doesn't draw)
      const anyAlive = hands.some(
        (h) => !evaluateHand(h.cards).isBust
      );

      if (anyAlive) {
        while (dealerShouldHit(dHand)) {
          const { card, deck: rem } = drawCard(d);
          dHand = [...dHand, { ...card, faceUp: true }];
          d = rem;
        }
      }

      setDealerHand(dHand);
      setDeck(d);
      setPhase('dealerTurn');

      // Resolve all hands
      let totalPayout = 0;
      let totalStake = 0;
      const resolvedHands = hands.map((h) => {
        const result = resolveHand(h.cards, dHand);
        const payout = calculatePayout(h.bet, result);
        totalPayout += payout;
        totalStake += h.bet;
        return { ...h, result };
      });

      setPlayerHands(resolvedHands);

      // Settle with wallet
      if (totalPayout > 0) {
        wallet.winBet(totalPayout, totalStake);
      } else {
        wallet.loseBet(totalStake);
      }

      // Determine result message from first (or only) hand
      const primaryResult = resolvedHands[0].result!;
      const netAmount =
        totalPayout > totalStake
          ? totalPayout - totalStake
          : totalPayout < totalStake
            ? totalStake - totalPayout
            : 0;

      setResultMessage({ result: primaryResult, amount: netAmount });
      setPhase('resolved');
    },
    [wallet]
  );

  const hit = useCallback(() => {
    if (phase !== 'playerTurn') return;
    const { card, newDeck } = drawFromDeck(deck);
    const hand = playerHands[activeHandIndex];
    const newCards = [...hand.cards, card];
    const updatedHand = { ...hand, cards: newCards };
    const updatedHands = [...playerHands];
    updatedHands[activeHandIndex] = updatedHand;

    const eval_ = evaluateHand(newCards);
    if (eval_.isBust) {
      updatedHands[activeHandIndex] = { ...updatedHand, result: 'bust' };
      advanceHand(updatedHands, activeHandIndex, newDeck, dealerHand);
    } else {
      setPlayerHands(updatedHands);
      setDeck(newDeck);
    }
  }, [phase, deck, playerHands, activeHandIndex, dealerHand, drawFromDeck, advanceHand]);

  const stand = useCallback(() => {
    if (phase !== 'playerTurn') return;
    advanceHand(playerHands, activeHandIndex, deck, dealerHand);
  }, [phase, playerHands, activeHandIndex, deck, dealerHand, advanceHand]);

  const double = useCallback(() => {
    if (phase !== 'playerTurn') return;
    const hand = playerHands[activeHandIndex];
    if (!wallet.placeBet(hand.bet)) return;

    const { card, newDeck } = drawFromDeck(deck);
    const newCards = [...hand.cards, card];
    const updatedHand: BlackjackHand = {
      ...hand,
      cards: newCards,
      bet: hand.bet * 2,
      isDoubled: true,
    };
    const updatedHands = [...playerHands];
    updatedHands[activeHandIndex] = updatedHand;

    const eval_ = evaluateHand(newCards);
    if (eval_.isBust) {
      updatedHands[activeHandIndex] = { ...updatedHand, result: 'bust' };
    }

    advanceHand(updatedHands, activeHandIndex, newDeck, dealerHand);
  }, [phase, playerHands, activeHandIndex, deck, dealerHand, wallet, drawFromDeck, advanceHand]);

  const split = useCallback(() => {
    if (phase !== 'playerTurn') return;
    const hand = playerHands[activeHandIndex];
    if (hand.cards.length !== 2 || hand.cards[0].rank !== hand.cards[1].rank) return;
    if (!wallet.placeBet(hand.bet)) return;

    const isSplitAces = hand.cards[0].rank === 'A';

    // Create two new hands, each with one card
    const hand1: BlackjackHand = {
      cards: [hand.cards[0]],
      bet: hand.bet,
      isDoubled: false,
    };
    const hand2: BlackjackHand = {
      cards: [hand.cards[1]],
      bet: hand.bet,
      isDoubled: false,
    };

    // Deal one card to first hand
    let d = deck;
    const { card: card1, newDeck: d1 } = drawFromDeck(d);
    d = d1;
    hand1.cards.push(card1);

    const updatedHands = [...playerHands];
    updatedHands[activeHandIndex] = hand1;
    updatedHands.push(hand2);

    if (isSplitAces) {
      // Split aces: deal one card to second hand, both hands done
      const { card: card2, newDeck: d2 } = drawFromDeck(d);
      d = d2;
      hand2.cards.push(card2);
      updatedHands[updatedHands.length - 1] = hand2;

      // Both hands are done, go to dealer
      setPlayerHands(updatedHands);
      setDeck(d);
      playDealer(updatedHands, d, dealerHand);
    } else {
      setPlayerHands(updatedHands);
      setDeck(d);
      // Continue playing the first hand
    }
  }, [phase, playerHands, activeHandIndex, deck, dealerHand, wallet, drawFromDeck, playDealer]);

  const newRound = useCallback(() => {
    setPhase('betting');
    setDealerHand([]);
    setPlayerHands([]);
    setActiveHandIndex(0);
    setInsuranceBet(null);
    setResultMessage(null);
  }, []);

  return {
    ...state,
    currentBet,
    resultMessage,
    placeBet,
    deal,
    hit,
    stand,
    double,
    split,
    newRound,
  };
}

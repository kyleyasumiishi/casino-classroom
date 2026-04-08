import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  CrapsPhase,
  CrapsBetType,
  CrapsBet,
  DiceRoll,
  BetResolution,
  CrapsGameState,
} from '../types/craps';
import { MIN_BET, MAX_BET } from '../types/common';
import {
  rollDice,
  resolveComeOutRoll,
  resolvePointRoll,
  getAvailableBets,
} from '../engine/craps';
import { useWallet } from '../store/useWallet';

// Bet types that CANNOT be removed once placed
const NON_REMOVABLE = new Set<CrapsBetType>(['pass', 'dontPass', 'come', 'dontCome']);

export function useCraps() {
  const wallet = useWallet();
  const betCounter = useRef(0);

  const [phase, setPhase] = useState<CrapsPhase>('comeOut');
  const [point, setPoint] = useState<number | null>(null);
  const [activeBets, setActiveBets] = useState<CrapsBet[]>([]);
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null);
  const [lastResults, setLastResults] = useState<BetResolution[]>([]);
  const [showBeginnerLayout, setShowBeginnerLayout] = useState(true);

  // Refund unresolved bets on unmount
  useEffect(() => {
    return () => {
      for (const bet of activeBets) {
        wallet.pushBet(bet.amount);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state: CrapsGameState = {
    phase,
    point,
    activeBets,
    currentRoll,
    lastResults,
    showBeginnerLayout,
  };

  const available = getAvailableBets(phase, point, activeBets);

  const placeBet = useCallback(
    (type: CrapsBetType, amount: number) => {
      if (phase === 'resolved') return;
      if (amount < MIN_BET || amount > MAX_BET) return;
      if (!available.includes(type)) return;
      if (!wallet.placeBet(amount)) return;

      const id = `bet-${betCounter.current++}`;
      setActiveBets((prev) => [...prev, { id, type, amount }]);
    },
    [phase, available, wallet]
  );

  const removeBet = useCallback(
    (betId: string) => {
      const bet = activeBets.find((b) => b.id === betId);
      if (!bet) return;
      // Can't remove contract bets
      if (NON_REMOVABLE.has(bet.type)) return;
      wallet.pushBet(bet.amount);
      setActiveBets((prev) => prev.filter((b) => b.id !== betId));
    },
    [activeBets, wallet]
  );

  const doRoll = useCallback(() => {
    if (phase === 'resolved') return;
    if (activeBets.length === 0) return;

    const dice = rollDice();
    setCurrentRoll(dice);

    let resolutions: BetResolution[];

    if (phase === 'comeOut') {
      resolutions = resolveComeOutRoll(dice, activeBets);
    } else {
      resolutions = resolvePointRoll(dice, point!, activeBets);
    }

    // Settle each resolution with wallet
    for (const res of resolutions) {
      if (res.outcome === 'win') {
        wallet.winBet(res.payout, res.bet.amount);
      } else if (res.outcome === 'push') {
        wallet.pushBet(res.payout);
      } else {
        wallet.loseBet(res.bet.amount);
      }
    }

    setLastResults(resolutions);

    // Remove resolved bets
    const resolvedIds = new Set(resolutions.map((r) => r.bet.id));
    let remaining = activeBets.filter((b) => !resolvedIds.has(b.id));

    // Handle come/dontCome traveling (point phase only)
    if (phase === 'point') {
      const pointNumbers = new Set([4, 5, 6, 8, 9, 10]);
      if (pointNumbers.has(dice.total) && dice.total !== point) {
        remaining = remaining.map((b) => {
          if ((b.type === 'come' || b.type === 'dontCome') && b.point == null) {
            return { ...b, point: dice.total };
          }
          return b;
        });
      }
      // If roll is the point, come bets also travel to point number (but point is being resolved)
      if (dice.total === point) {
        remaining = remaining.map((b) => {
          if ((b.type === 'come' || b.type === 'dontCome') && b.point == null) {
            return { ...b, point: dice.total };
          }
          return b;
        });
      }
    }

    setActiveBets(remaining);

    // Phase transitions
    if (phase === 'comeOut') {
      const pointNumbers = [4, 5, 6, 8, 9, 10];
      if (pointNumbers.includes(dice.total)) {
        setPoint(dice.total);
        setPhase('point');
      }
      // 7, 11, 2, 3, 12 → stay in comeOut
    } else {
      // Point phase
      if (dice.total === point) {
        // Point hit → back to comeOut
        setPoint(null);
        setPhase('comeOut');
      } else if (dice.total === 7) {
        // Seven-out → resolved
        setPhase('resolved');
      }
      // Other numbers → stay in point phase
    }
  }, [phase, point, activeBets, wallet]);

  const newShooter = useCallback(() => {
    setPhase('comeOut');
    setPoint(null);
    setActiveBets([]);
    setCurrentRoll(null);
    setLastResults([]);
  }, []);

  const toggleBeginner = useCallback(() => {
    setShowBeginnerLayout((prev) => !prev);
  }, []);

  return {
    ...state,
    availableBets: available,
    placeBet,
    removeBet,
    roll: doRoll,
    newShooter,
    toggleBeginner,
  };
}

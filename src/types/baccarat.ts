import type { Card } from './common';

export type BaccaratBetType = 'player' | 'banker' | 'tie';
export type BaccaratPhase = 'betting' | 'dealing' | 'resolved';
export type BaccaratResult = 'player' | 'banker' | 'tie';

export interface BaccaratBet {
  type: BaccaratBetType;
  amount: number;
}

export interface BaccaratGameState {
  phase: BaccaratPhase;
  deck: Card[];
  playerHand: Card[];
  bankerHand: Card[];
  bets: BaccaratBet[];
  result?: BaccaratResult;
}

export const BACCARAT_PAYOUTS: Record<BaccaratBetType, number> = {
  player: 1,
  banker: 0.95,
  tie: 8,
};

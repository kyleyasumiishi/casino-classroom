import type { Card } from './common';

export type BlackjackPhase = 'betting' | 'dealing' | 'playerTurn' | 'dealerTurn' | 'resolved';
export type BlackjackAction = 'hit' | 'stand' | 'double' | 'split' | 'insurance';
export type HandResult = 'blackjack' | 'win' | 'lose' | 'push' | 'bust';

export interface BlackjackHand {
  cards: Card[];
  bet: number;
  isDoubled: boolean;
  result?: HandResult;
}

export interface BlackjackGameState {
  phase: BlackjackPhase;
  deck: Card[];
  dealerHand: Card[];
  playerHands: BlackjackHand[];
  activeHandIndex: number;
  insuranceBet: number | null;
  availableActions: BlackjackAction[];
}

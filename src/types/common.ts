export type GameType = 'blackjack' | 'baccarat' | 'craps';
export type GameMode = 'learn' | 'play';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export interface GameConfig {
  type: GameType;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  learnPath: string;
  playPath: string;
}

export const STARTING_BALANCE = 1000;
export const MIN_BET = 5;
export const MAX_BET = 500;
export const CHIP_DENOMINATIONS = [5, 10, 25, 50, 100] as const;

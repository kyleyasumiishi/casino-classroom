export type CrapsPhase = 'comeOut' | 'point' | 'resolved';

export type CrapsBetType =
  | 'pass' | 'dontPass'
  | 'come' | 'dontCome'
  | 'passOdds' | 'dontPassOdds'
  | 'comeOdds' | 'dontComeOdds'
  | 'place4' | 'place5' | 'place6' | 'place8' | 'place9' | 'place10'
  | 'field'
  | 'hardway4' | 'hardway6' | 'hardway8' | 'hardway10'
  | 'anySeven' | 'anyCraps' | 'eleven' | 'aceDeuce' | 'aces' | 'boxcars'
  | 'big6' | 'big8'
  | 'horn' | 'hornHigh';

export type BetCategory = 'smart' | 'standard' | 'sucker';

export interface CrapsBet {
  id: string;
  type: CrapsBetType;
  amount: number;
  point?: number;
  parentBetId?: string;
}

export interface DiceRoll {
  die1: number;
  die2: number;
  total: number;
  isHard: boolean;
}

export interface CrapsGameState {
  phase: CrapsPhase;
  point: number | null;
  activeBets: CrapsBet[];
  currentRoll: DiceRoll | null;
  lastResults: BetResolution[];
  showBeginnerLayout: boolean;
}

export interface BetResolution {
  bet: CrapsBet;
  outcome: 'win' | 'lose' | 'push';
  payout: number;
}

export interface PayoutInfo {
  betType: CrapsBetType;
  paysRatio: string;
  houseEdge: string;
  category: BetCategory;
}

export const CRAPS_PAYOUT_TABLE: Record<CrapsBetType, PayoutInfo> = {
  pass:          { betType: 'pass', paysRatio: '1:1', houseEdge: '1.41%', category: 'smart' },
  dontPass:      { betType: 'dontPass', paysRatio: '1:1', houseEdge: '1.36%', category: 'smart' },
  come:          { betType: 'come', paysRatio: '1:1', houseEdge: '1.41%', category: 'smart' },
  dontCome:      { betType: 'dontCome', paysRatio: '1:1', houseEdge: '1.36%', category: 'smart' },
  passOdds:      { betType: 'passOdds', paysRatio: 'varies', houseEdge: '0%', category: 'smart' },
  dontPassOdds:  { betType: 'dontPassOdds', paysRatio: 'varies', houseEdge: '0%', category: 'smart' },
  comeOdds:      { betType: 'comeOdds', paysRatio: 'varies', houseEdge: '0%', category: 'smart' },
  dontComeOdds:  { betType: 'dontComeOdds', paysRatio: 'varies', houseEdge: '0%', category: 'smart' },
  place6:        { betType: 'place6', paysRatio: '7:6', houseEdge: '1.52%', category: 'smart' },
  place8:        { betType: 'place8', paysRatio: '7:6', houseEdge: '1.52%', category: 'smart' },
  place5:        { betType: 'place5', paysRatio: '7:5', houseEdge: '4.00%', category: 'standard' },
  place9:        { betType: 'place9', paysRatio: '7:5', houseEdge: '4.00%', category: 'standard' },
  place4:        { betType: 'place4', paysRatio: '9:5', houseEdge: '6.67%', category: 'standard' },
  place10:       { betType: 'place10', paysRatio: '9:5', houseEdge: '6.67%', category: 'standard' },
  field:         { betType: 'field', paysRatio: '1:1 / 2:1', houseEdge: '5.56%', category: 'standard' },
  big6:          { betType: 'big6', paysRatio: '1:1', houseEdge: '9.09%', category: 'sucker' },
  big8:          { betType: 'big8', paysRatio: '1:1', houseEdge: '9.09%', category: 'sucker' },
  hardway4:      { betType: 'hardway4', paysRatio: '7:1', houseEdge: '11.11%', category: 'sucker' },
  hardway6:      { betType: 'hardway6', paysRatio: '9:1', houseEdge: '9.09%', category: 'sucker' },
  hardway8:      { betType: 'hardway8', paysRatio: '9:1', houseEdge: '9.09%', category: 'sucker' },
  hardway10:     { betType: 'hardway10', paysRatio: '7:1', houseEdge: '11.11%', category: 'sucker' },
  anySeven:      { betType: 'anySeven', paysRatio: '4:1', houseEdge: '16.67%', category: 'sucker' },
  anyCraps:      { betType: 'anyCraps', paysRatio: '7:1', houseEdge: '11.11%', category: 'sucker' },
  eleven:        { betType: 'eleven', paysRatio: '15:1', houseEdge: '11.11%', category: 'sucker' },
  aceDeuce:      { betType: 'aceDeuce', paysRatio: '15:1', houseEdge: '11.11%', category: 'sucker' },
  aces:          { betType: 'aces', paysRatio: '30:1', houseEdge: '13.89%', category: 'sucker' },
  boxcars:       { betType: 'boxcars', paysRatio: '30:1', houseEdge: '13.89%', category: 'sucker' },
  horn:          { betType: 'horn', paysRatio: 'varies', houseEdge: '12.50%', category: 'sucker' },
  hornHigh:      { betType: 'hornHigh', paysRatio: 'varies', houseEdge: '12.50%', category: 'sucker' },
};

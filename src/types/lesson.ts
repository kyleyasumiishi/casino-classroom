import type { BetCategory } from './craps';
import type { GameType } from './common';

export interface LessonSection {
  id: string;
  title: string;
  content: LessonBlock[];
}

export type LessonBlock =
  | { type: 'text'; body: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'tip'; body: string }
  | { type: 'warning'; body: string }
  | { type: 'example'; scenario: string; action: string; result: string }
  | { type: 'payoutTable'; rows: PayoutTableRow[] };

export interface PayoutTableRow {
  bet: string;
  pays: string;
  houseEdge: string;
  notes?: string;
  category?: BetCategory;
}

export interface CheatSheetEntry {
  label: string;
  value: string;
}

export interface LessonData {
  gameType: GameType;
  title: string;
  sections: LessonSection[];
  cheatSheet: CheatSheetEntry[];
}

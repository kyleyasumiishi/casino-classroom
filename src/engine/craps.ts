import type {
  CrapsBetType,
  CrapsBet,
  DiceRoll,
  BetResolution,
  CrapsPhase,
} from '../types/craps';

// --- Dice ---

export function rollDice(): DiceRoll {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return { die1, die2, total: die1 + die2, isHard: die1 === die2 };
}

// --- Payout calculation ---

function passOddsProfit(amount: number, point: number): number {
  switch (point) {
    case 4: case 10: return amount * 2;                     // 2:1
    case 5: case 9:  return Math.floor(amount * 3 / 2);     // 3:2
    case 6: case 8:  return Math.floor(amount * 6 / 5);     // 6:5
    default: return 0;
  }
}

function dontPassOddsProfit(amount: number, point: number): number {
  switch (point) {
    case 4: case 10: return Math.floor(amount / 2);         // 1:2
    case 5: case 9:  return Math.floor(amount * 2 / 3);     // 2:3
    case 6: case 8:  return Math.floor(amount * 5 / 6);     // 5:6
    default: return 0;
  }
}

/** Returns total return (stake + profit) for a winning bet. */
export function calculateCrapsPayout(
  betType: CrapsBetType,
  amount: number,
  point?: number,
  rollTotal?: number
): number {
  switch (betType) {
    case 'pass': case 'dontPass': case 'come': case 'dontCome':
    case 'big6': case 'big8':
      return amount * 2; // 1:1

    case 'passOdds': case 'comeOdds':
      return amount + passOddsProfit(amount, point!);
    case 'dontPassOdds': case 'dontComeOdds':
      return amount + dontPassOddsProfit(amount, point!);

    case 'place4': case 'place10':
      return amount + Math.floor(amount * 9 / 5);   // 9:5
    case 'place5': case 'place9':
      return amount + Math.floor(amount * 7 / 5);   // 7:5
    case 'place6': case 'place8':
      return amount + Math.floor(amount * 7 / 6);   // 7:6

    case 'field':
      if (rollTotal === 2 || rollTotal === 12) return amount * 3; // 2:1
      return amount * 2; // 1:1

    case 'hardway4': case 'hardway10': return amount * 8;   // 7:1
    case 'hardway6': case 'hardway8': return amount * 10;   // 9:1

    case 'anySeven':  return amount * 5;   // 4:1
    case 'anyCraps':  return amount * 8;   // 7:1
    case 'eleven':
    case 'aceDeuce':  return amount * 16;  // 15:1
    case 'aces':
    case 'boxcars':   return amount * 31;  // 30:1

    case 'horn':
    case 'hornHigh': {
      const unit = Math.floor(amount / 4);
      if (rollTotal === 2 || rollTotal === 12) return unit * 31; // 30:1 on quarter
      if (rollTotal === 3 || rollTotal === 11) return unit * 16; // 15:1 on quarter
      return 0;
    }

    default: return 0;
  }
}

// --- Resolution helpers ---

const ONE_ROLL_TYPES = new Set<CrapsBetType>([
  'field', 'anySeven', 'anyCraps', 'eleven', 'aceDeuce', 'aces', 'boxcars', 'horn', 'hornHigh',
]);

const HARDWAY_NUMBER: Partial<Record<CrapsBetType, number>> = {
  hardway4: 4, hardway6: 6, hardway8: 8, hardway10: 10,
};

const FIELD_WINS = new Set([2, 3, 4, 9, 10, 11, 12]);

function win(bet: CrapsBet, payout: number): BetResolution {
  return { bet, outcome: 'win', payout };
}
function lose(bet: CrapsBet): BetResolution {
  return { bet, outcome: 'lose', payout: 0 };
}
function push(bet: CrapsBet): BetResolution {
  return { bet, outcome: 'push', payout: bet.amount };
}

function resolveOneRoll(bet: CrapsBet, roll: DiceRoll): BetResolution {
  const t = roll.total;
  switch (bet.type) {
    case 'field':
      return FIELD_WINS.has(t)
        ? win(bet, calculateCrapsPayout('field', bet.amount, undefined, t))
        : lose(bet);
    case 'anySeven':
      return t === 7 ? win(bet, calculateCrapsPayout('anySeven', bet.amount)) : lose(bet);
    case 'anyCraps':
      return [2, 3, 12].includes(t) ? win(bet, calculateCrapsPayout('anyCraps', bet.amount)) : lose(bet);
    case 'eleven':
      return t === 11 ? win(bet, calculateCrapsPayout('eleven', bet.amount)) : lose(bet);
    case 'aceDeuce':
      return t === 3 ? win(bet, calculateCrapsPayout('aceDeuce', bet.amount)) : lose(bet);
    case 'aces':
      return t === 2 ? win(bet, calculateCrapsPayout('aces', bet.amount)) : lose(bet);
    case 'boxcars':
      return t === 12 ? win(bet, calculateCrapsPayout('boxcars', bet.amount)) : lose(bet);
    case 'horn':
    case 'hornHigh':
      return [2, 3, 11, 12].includes(t)
        ? win(bet, calculateCrapsPayout(bet.type, bet.amount, undefined, t))
        : lose(bet);
    default:
      return lose(bet);
  }
}

function resolveHardway(bet: CrapsBet, roll: DiceRoll): BetResolution | null {
  const target = HARDWAY_NUMBER[bet.type];
  if (!target) return null;
  if (roll.total === 7) return lose(bet);
  if (roll.total === target) {
    return roll.isHard
      ? win(bet, calculateCrapsPayout(bet.type, bet.amount))
      : lose(bet);
  }
  return null; // not resolved this roll
}

function resolveBig(bet: CrapsBet, roll: DiceRoll): BetResolution | null {
  const target = bet.type === 'big6' ? 6 : 8;
  if (roll.total === target) return win(bet, calculateCrapsPayout(bet.type, bet.amount));
  if (roll.total === 7) return lose(bet);
  return null;
}

// --- Main resolution functions ---

export function resolveComeOutRoll(roll: DiceRoll, bets: CrapsBet[]): BetResolution[] {
  const results: BetResolution[] = [];
  const t = roll.total;

  for (const bet of bets) {
    // Pass line
    if (bet.type === 'pass') {
      if (t === 7 || t === 11) results.push(win(bet, calculateCrapsPayout('pass', bet.amount)));
      else if ([2, 3, 12].includes(t)) results.push(lose(bet));
      continue;
    }

    // Don't Pass
    if (bet.type === 'dontPass') {
      if (t === 7 || t === 11) results.push(lose(bet));
      else if (t === 2 || t === 3) results.push(win(bet, calculateCrapsPayout('dontPass', bet.amount)));
      else if (t === 12) results.push(push(bet)); // bar 12
      continue;
    }

    // Place bets: OFF during come-out
    if (bet.type.startsWith('place')) continue;

    // Pass/Don't Pass Odds shouldn't exist during come-out
    if (bet.type === 'passOdds' || bet.type === 'dontPassOdds') continue;

    // One-roll bets
    if (ONE_ROLL_TYPES.has(bet.type)) {
      results.push(resolveOneRoll(bet, roll));
      continue;
    }

    // Hardways
    if (HARDWAY_NUMBER[bet.type] !== undefined) {
      const r = resolveHardway(bet, roll);
      if (r) results.push(r);
      continue;
    }

    // Big 6/8
    if (bet.type === 'big6' || bet.type === 'big8') {
      const r = resolveBig(bet, roll);
      if (r) results.push(r);
      continue;
    }

    // Traveled come bets (have a point from previous round)
    if (bet.type === 'come' && bet.point != null) {
      if (t === bet.point) results.push(win(bet, calculateCrapsPayout('come', bet.amount)));
      else if (t === 7) results.push(lose(bet));
      continue;
    }
    if (bet.type === 'comeOdds' && bet.point != null) {
      if (t === bet.point) results.push(win(bet, calculateCrapsPayout('comeOdds', bet.amount, bet.point)));
      else if (t === 7) results.push(lose(bet));
      continue;
    }
    if (bet.type === 'dontCome' && bet.point != null) {
      if (t === bet.point) results.push(lose(bet));
      else if (t === 7) results.push(win(bet, calculateCrapsPayout('dontCome', bet.amount)));
      continue;
    }
    if (bet.type === 'dontComeOdds' && bet.point != null) {
      if (t === bet.point) results.push(lose(bet));
      else if (t === 7) results.push(win(bet, calculateCrapsPayout('dontComeOdds', bet.amount, bet.point)));
      continue;
    }
  }

  return results;
}

export function resolvePointRoll(roll: DiceRoll, point: number, bets: CrapsBet[]): BetResolution[] {
  const results: BetResolution[] = [];
  const t = roll.total;
  const isPointHit = t === point;
  const isSevenOut = t === 7;

  for (const bet of bets) {
    // Pass
    if (bet.type === 'pass') {
      if (isPointHit) results.push(win(bet, calculateCrapsPayout('pass', bet.amount)));
      else if (isSevenOut) results.push(lose(bet));
      continue;
    }
    if (bet.type === 'passOdds') {
      if (isPointHit) results.push(win(bet, calculateCrapsPayout('passOdds', bet.amount, point)));
      else if (isSevenOut) results.push(lose(bet));
      continue;
    }

    // Don't Pass
    if (bet.type === 'dontPass') {
      if (isPointHit) results.push(lose(bet));
      else if (isSevenOut) results.push(win(bet, calculateCrapsPayout('dontPass', bet.amount)));
      continue;
    }
    if (bet.type === 'dontPassOdds') {
      if (isPointHit) results.push(lose(bet));
      else if (isSevenOut) results.push(win(bet, calculateCrapsPayout('dontPassOdds', bet.amount, point)));
      continue;
    }

    // Fresh come (no point yet — acts as come-out for this bet)
    if (bet.type === 'come' && bet.point == null) {
      if (t === 7 || t === 11) results.push(win(bet, calculateCrapsPayout('come', bet.amount)));
      else if ([2, 3, 12].includes(t)) results.push(lose(bet));
      // else: travels — not resolved, hook handles
      continue;
    }

    // Traveled come
    if (bet.type === 'come' && bet.point != null) {
      if (t === bet.point) results.push(win(bet, calculateCrapsPayout('come', bet.amount)));
      else if (isSevenOut) results.push(lose(bet));
      continue;
    }
    if (bet.type === 'comeOdds') {
      if (t === bet.point) results.push(win(bet, calculateCrapsPayout('comeOdds', bet.amount, bet.point)));
      else if (isSevenOut) results.push(lose(bet));
      continue;
    }

    // Fresh don't come
    if (bet.type === 'dontCome' && bet.point == null) {
      if (t === 7 || t === 11) results.push(lose(bet));
      else if (t === 2 || t === 3) results.push(win(bet, calculateCrapsPayout('dontCome', bet.amount)));
      else if (t === 12) results.push(push(bet));
      continue;
    }

    // Traveled don't come
    if (bet.type === 'dontCome' && bet.point != null) {
      if (t === bet.point) results.push(lose(bet));
      else if (isSevenOut) results.push(win(bet, calculateCrapsPayout('dontCome', bet.amount)));
      continue;
    }
    if (bet.type === 'dontComeOdds') {
      if (t === bet.point) results.push(lose(bet));
      else if (isSevenOut) results.push(win(bet, calculateCrapsPayout('dontComeOdds', bet.amount, bet.point)));
      continue;
    }

    // Place bets (ON during point phase)
    if (bet.type.startsWith('place')) {
      const placeNumber = parseInt(bet.type.replace('place', ''));
      if (t === placeNumber) results.push(win(bet, calculateCrapsPayout(bet.type, bet.amount)));
      else if (isSevenOut) results.push(lose(bet));
      continue;
    }

    // One-roll bets
    if (ONE_ROLL_TYPES.has(bet.type)) {
      results.push(resolveOneRoll(bet, roll));
      continue;
    }

    // Hardways
    if (HARDWAY_NUMBER[bet.type] !== undefined) {
      const r = resolveHardway(bet, roll);
      if (r) results.push(r);
      continue;
    }

    // Big 6/8
    if (bet.type === 'big6' || bet.type === 'big8') {
      const r = resolveBig(bet, roll);
      if (r) results.push(r);
      continue;
    }
  }

  return results;
}

// --- Available bets ---

export function getAvailableBets(
  phase: CrapsPhase,
  _point: number | null,
  activeBets: CrapsBet[]
): CrapsBetType[] {
  if (phase === 'resolved') return [];

  const activeTypes = new Set(activeBets.map((b) => b.type));
  const available: CrapsBetType[] = [];

  const addIfNotActive = (type: CrapsBetType) => {
    if (!activeTypes.has(type)) available.push(type);
  };

  // One-roll bets and standing bets available in both phases
  const addCommonBets = () => {
    addIfNotActive('field');
    available.push('anySeven', 'anyCraps', 'eleven', 'aceDeuce', 'aces', 'boxcars', 'horn', 'hornHigh');
    addIfNotActive('hardway4');
    addIfNotActive('hardway6');
    addIfNotActive('hardway8');
    addIfNotActive('hardway10');
    addIfNotActive('big6');
    addIfNotActive('big8');
  };

  if (phase === 'comeOut') {
    addIfNotActive('pass');
    addIfNotActive('dontPass');
    addCommonBets();
  }

  if (phase === 'point') {
    // Come/Don't Come
    const hasFreshCome = activeBets.some((b) => b.type === 'come' && b.point == null);
    if (!hasFreshCome) available.push('come');
    const hasFreshDontCome = activeBets.some((b) => b.type === 'dontCome' && b.point == null);
    if (!hasFreshDontCome) available.push('dontCome');

    // Odds
    if (activeTypes.has('pass') && !activeTypes.has('passOdds')) available.push('passOdds');
    if (activeTypes.has('dontPass') && !activeTypes.has('dontPassOdds')) available.push('dontPassOdds');

    const hasTraveledCome = activeBets.some((b) => b.type === 'come' && b.point != null);
    if (hasTraveledCome) available.push('comeOdds');
    const hasTraveledDontCome = activeBets.some((b) => b.type === 'dontCome' && b.point != null);
    if (hasTraveledDontCome) available.push('dontComeOdds');

    // Place bets
    for (const p of ['place4', 'place5', 'place6', 'place8', 'place9', 'place10'] as CrapsBetType[]) {
      addIfNotActive(p);
    }

    addCommonBets();
  }

  return available;
}

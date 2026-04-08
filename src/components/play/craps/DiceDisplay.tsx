import type { DiceRoll } from '../../../types/craps';

interface DiceDisplayProps {
  roll: DiceRoll | null;
  rolling?: boolean;
}

// Pip positions for each die face (on a 5x5 grid, center = 2,2)
const pipPositions: Record<number, [number, number][]> = {
  1: [[2, 2]],
  2: [[0.8, 3.2], [3.2, 0.8]],
  3: [[0.8, 3.2], [2, 2], [3.2, 0.8]],
  4: [[0.8, 0.8], [0.8, 3.2], [3.2, 0.8], [3.2, 3.2]],
  5: [[0.8, 0.8], [0.8, 3.2], [2, 2], [3.2, 0.8], [3.2, 3.2]],
  6: [[0.8, 0.8], [0.8, 2], [0.8, 3.2], [3.2, 0.8], [3.2, 2], [3.2, 3.2]],
};

function Die({ value }: { value: number }) {
  const pips = pipPositions[value] || [];
  return (
    <svg viewBox="0 0 4 4" className="w-16 h-16">
      <rect
        x="0" y="0" width="4" height="4" rx="0.5"
        fill="white" stroke="#d1d5db" strokeWidth="0.1"
      />
      {pips.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.35" fill="#1a1a1a" />
      ))}
    </svg>
  );
}

export function DiceDisplay({ roll }: DiceDisplayProps) {
  if (!roll) {
    return (
      <div className="flex justify-center gap-3 py-4">
        <div className="w-16 h-16 rounded-lg border-2 border-dashed border-cream/20" />
        <div className="w-16 h-16 rounded-lg border-2 border-dashed border-cream/20" />
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center gap-3 py-4 motion-safe:animate-dice-tumble"
      role="img"
      aria-label={`Rolled ${roll.die1} and ${roll.die2}, total ${roll.total}`}
    >
      <Die value={roll.die1} />
      <Die value={roll.die2} />
    </div>
  );
}

import { useState } from 'react';
import { CHIP_DENOMINATIONS, MIN_BET, MAX_BET } from '../../../types/common';

interface BettingControlsProps {
  onPlaceBet: (amount: number) => void;
  onClear: () => void;
  onAction: () => void;
  currentBet: number;
  balance: number;
  actionLabel: string;
  disabled: boolean;
}

const chipColors: Record<number, string> = {
  5: 'bg-gray-100 text-gray-800 border-gray-300',
  10: 'bg-red-700 text-white border-red-500',
  25: 'bg-green-700 text-white border-green-500',
  50: 'bg-blue-700 text-white border-blue-500',
  100: 'bg-gray-800 text-white border-gray-600',
};

export function BettingControls({
  onPlaceBet,
  onClear,
  onAction,
  currentBet,
  balance,
  actionLabel,
  disabled,
}: BettingControlsProps) {
  const [selectedChip, setSelectedChip] = useState<number>(CHIP_DENOMINATIONS[0]);

  const handleChipClick = (denom: number) => {
    setSelectedChip(denom);
    const newBet = Math.min(currentBet + denom, MAX_BET);
    if (newBet <= balance + currentBet) {
      onPlaceBet(newBet);
    }
  };

  const canDeal = currentBet >= MIN_BET && !disabled;

  return (
    <div className="space-y-4">
      {/* Current bet display */}
      <div className="text-center">
        <p className="text-cream/60 text-sm">Current Bet</p>
        <p className="text-gold text-3xl font-bold">{currentBet}</p>
      </div>

      {/* Chip denomination buttons */}
      <div className="flex justify-center gap-2">
        {CHIP_DENOMINATIONS.map((denom) => (
          <button
            key={denom}
            onClick={() => handleChipClick(denom)}
            disabled={disabled || denom > balance + currentBet - currentBet}
            aria-label={`Select ${denom} chip`}
            className={`w-14 h-14 rounded-full border-2 font-bold text-sm transition-all min-w-11 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-felt ${
              chipColors[denom]
            } ${
              selectedChip === denom
                ? 'ring-2 ring-gold ring-offset-2 ring-offset-felt scale-110'
                : ''
            } ${
              disabled || denom > balance
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95'
            }`}
          >
            {denom}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3">
        {currentBet > 0 && (
          <button
            onClick={onClear}
            disabled={disabled}
            aria-label="Clear current bet"
            className="px-5 py-3 bg-felt-light text-cream rounded-lg hover:bg-felt-light/80 transition-colors min-h-11 font-semibold disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-felt"
          >
            Clear
          </button>
        )}
        <button
          onClick={onAction}
          disabled={!canDeal}
          aria-label={actionLabel}
          className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-felt ${
            canDeal
              ? 'bg-gold text-felt-dark hover:bg-gold-light'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

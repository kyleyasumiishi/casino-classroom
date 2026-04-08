import { useState } from 'react';
import type { BaccaratBetType, BaccaratBet } from '../../../types/baccarat';
import { CHIP_DENOMINATIONS, MIN_BET, MAX_BET } from '../../../types/common';

interface BetSelectorProps {
  bets: BaccaratBet[];
  onPlaceBet: (type: BaccaratBetType, amount: number) => void;
  onClear: () => void;
  chipAmount: number;
  disabled: boolean;
}

const chipColors: Record<number, string> = {
  5: 'bg-gray-100 text-gray-800 border-gray-300',
  10: 'bg-red-700 text-white border-red-500',
  25: 'bg-green-700 text-white border-green-500',
  50: 'bg-blue-700 text-white border-blue-500',
  100: 'bg-gray-800 text-white border-gray-600',
};

const betZones: { type: BaccaratBetType; label: string; payout: string; color: string }[] = [
  { type: 'player', label: 'Player', payout: '1:1', color: 'border-blue-500 bg-casino-blue/30' },
  { type: 'tie', label: 'Tie', payout: '8:1', color: 'border-green-500 bg-felt-light/50' },
  { type: 'banker', label: 'Banker', payout: '0.95:1', color: 'border-red-500 bg-casino-red/30' },
];

export function BetSelector({
  bets,
  onPlaceBet,
  onClear,
  chipAmount,
  disabled,
}: BetSelectorProps) {
  const [selectedChip, setSelectedChip] = useState<number>(CHIP_DENOMINATIONS[0]);

  const getBetAmount = (type: BaccaratBetType): number => {
    return bets.find((b) => b.type === type)?.amount ?? 0;
  };

  const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);

  const handleZoneClick = (type: BaccaratBetType) => {
    if (disabled) return;
    const currentBet = getBetAmount(type);
    const newAmount = currentBet + selectedChip;
    if (newAmount > MAX_BET) return;
    if (selectedChip > chipAmount) return;
    onPlaceBet(type, selectedChip);
  };

  return (
    <div className="space-y-4">
      {/* Bet zones */}
      <div className="grid grid-cols-3 gap-2">
        {betZones.map(({ type, label, payout, color }) => {
          const amount = getBetAmount(type);
          return (
            <button
              key={type}
              onClick={() => handleZoneClick(type)}
              disabled={disabled}
              className={`relative rounded-xl border-2 p-4 text-center transition-all min-h-[88px] ${color} ${
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-[1.02] active:scale-95 cursor-pointer'
              } ${amount > 0 ? 'ring-2 ring-gold' : ''}`}
            >
              <div className="text-cream font-bold text-lg">{label}</div>
              <div className="text-cream/60 text-xs">{payout}</div>
              {amount > 0 && (
                <div className="mt-1 text-gold font-bold text-sm">{amount}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Total bet */}
      <div className="text-center">
        <p className="text-cream/60 text-sm">Total Bet</p>
        <p className="text-gold text-3xl font-bold">{totalBet}</p>
      </div>

      {/* Chip selector */}
      <div className="flex justify-center gap-2">
        {CHIP_DENOMINATIONS.map((denom) => (
          <button
            key={denom}
            onClick={() => setSelectedChip(denom)}
            disabled={disabled || denom > chipAmount}
            className={`w-14 h-14 rounded-full border-2 font-bold text-sm transition-all min-w-11 min-h-11 ${
              chipColors[denom]
            } ${
              selectedChip === denom
                ? 'ring-2 ring-gold ring-offset-2 ring-offset-felt scale-110'
                : ''
            } ${
              disabled || denom > chipAmount
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
        {totalBet > 0 && (
          <button
            onClick={onClear}
            disabled={disabled}
            className="px-5 py-3 bg-felt-light text-cream rounded-lg hover:bg-felt-light/80 transition-colors min-h-11 font-semibold disabled:opacity-40"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

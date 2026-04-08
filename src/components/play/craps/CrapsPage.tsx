import { useState } from 'react';
import { useCraps } from '../../../hooks/useCraps';
import { useWallet } from '../../../store/useWallet';
import { CrapsTable } from './CrapsTable';
import { DiceDisplay } from './DiceDisplay';
import { PointMarker } from './PointMarker';
import { BeginnerToggle } from './BeginnerToggle';
import { ActionButton } from '../common/ActionButton';
import { OutOfChips } from '../../shared/OutOfChips';
import { CHIP_DENOMINATIONS } from '../../../types/common';

const chipColors: Record<number, string> = {
  5: 'bg-gray-100 text-gray-800 border-gray-300',
  10: 'bg-red-700 text-white border-red-500',
  25: 'bg-green-700 text-white border-green-500',
  50: 'bg-blue-700 text-white border-blue-500',
  100: 'bg-gray-800 text-white border-gray-600',
};

export function CrapsPage() {
  const game = useCraps();
  const balance = useWallet((s) => s.balance);
  const [selectedChip, setSelectedChip] = useState<number>(CHIP_DENOMINATIONS[0]);

  const canRoll = game.activeBets.length > 0 && game.phase !== 'resolved';

  const handlePlaceBet = (type: Parameters<typeof game.placeBet>[0]) => {
    game.placeBet(type, selectedChip);
  };

  // Summarize last results for display
  const resultSummary = game.lastResults.length > 0
    ? (() => {
        let totalWon = 0;
        let totalLost = 0;
        for (const r of game.lastResults) {
          if (r.outcome === 'win') totalWon += r.payout - r.bet.amount;
          else if (r.outcome === 'lose') totalLost += r.bet.amount;
        }
        const net = totalWon - totalLost;
        return { totalWon, totalLost, net };
      })()
    : null;

  return (
    <div className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-4 md:max-w-4xl">
      {/* Header: Point marker + Beginner toggle */}
      <div className="flex items-center justify-between">
        <PointMarker point={game.point} />
        <div className="text-center">
          <span className="text-cream/50 text-xs uppercase tracking-wider">
            {game.phase === 'comeOut' ? 'Come-Out Roll' : game.phase === 'point' ? 'Point Phase' : 'Seven Out!'}
          </span>
        </div>
        <BeginnerToggle
          isBeginnerMode={game.showBeginnerLayout}
          onToggle={game.toggleBeginner}
        />
      </div>

      {/* Dice display */}
      <DiceDisplay roll={game.currentRoll} rolling={false} />

      {/* Roll result summary */}
      {game.currentRoll && resultSummary && resultSummary.net !== 0 && (
        <div className={`text-center text-sm font-semibold ${
          resultSummary.net > 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {resultSummary.net > 0 ? '+' : ''}{resultSummary.net}
        </div>
      )}

      {/* Chip selector */}
      {game.phase !== 'resolved' && (
        <div className="flex justify-center gap-2">
          {CHIP_DENOMINATIONS.map((denom) => (
            <button
              key={denom}
              onClick={() => setSelectedChip(denom)}
              disabled={denom > balance}
              aria-label={`Select ${denom} chip`}
              className={`w-12 h-12 rounded-full border-2 font-bold text-xs transition-all min-w-11 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-felt ${
                chipColors[denom]
              } ${
                selectedChip === denom
                  ? 'ring-2 ring-gold ring-offset-2 ring-offset-felt scale-110'
                  : ''
              } ${
                denom > balance
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:scale-105 active:scale-95'
              }`}
            >
              {denom}
            </button>
          ))}
        </div>
      )}

      {/* Craps table */}
      <CrapsTable
        activeBets={game.activeBets}
        onPlaceBet={handlePlaceBet}
        showBeginnerLayout={game.showBeginnerLayout}
        point={game.point}
        chipAmount={selectedChip}
        availableBets={game.availableBets}
      />

      {/* Roll / New Shooter buttons */}
      <div className="flex justify-center gap-3">
        {game.phase !== 'resolved' && (
          <ActionButton
            label="Roll"
            onClick={game.roll}
            disabled={!canRoll}
          />
        )}
        {game.phase === 'resolved' && (
          <ActionButton
            label="New Shooter"
            onClick={game.newShooter}
          />
        )}
      </div>

      <OutOfChips />
    </div>
  );
}

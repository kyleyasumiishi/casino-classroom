import type { CrapsBetType } from '../../../types/craps';

interface CrapsBetZoneProps {
  betType: CrapsBetType;
  label: string;
  payout: string;
  isActive: boolean;
  chipAmount: number;
  dimmed: boolean;
  onClick: () => void;
}

export function CrapsBetZone({
  betType: _betType,
  label,
  payout,
  isActive,
  chipAmount,
  dimmed,
  onClick,
}: CrapsBetZoneProps) {
  return (
    <button
      onClick={onClick}
      disabled={dimmed}
      aria-label={`${isActive ? `${chipAmount} on ` : 'Place bet on '}${label}, pays ${payout}`}
      className={`relative w-full rounded-lg border-2 px-3 py-2 text-left transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:ring-offset-felt ${
        dimmed
          ? 'border-cream/10 bg-felt-dark/30 opacity-40 cursor-not-allowed'
          : isActive
            ? 'border-gold bg-felt-light/40 ring-1 ring-gold/50'
            : 'border-cream/20 bg-felt-dark/50 hover:border-cream/40 active:scale-[0.98]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className={`font-semibold text-sm ${dimmed ? 'text-cream/40' : 'text-cream'}`}>
            {label}
          </div>
          <div className={`text-xs ${dimmed ? 'text-cream/20' : 'text-cream/50'}`}>
            {payout}
          </div>
        </div>
        {isActive && chipAmount > 0 && (
          <div className="bg-gold text-felt-dark text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
            {chipAmount}
          </div>
        )}
      </div>
    </button>
  );
}

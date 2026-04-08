import type { Card as CardType } from '../../../types/common';
import type { BaccaratPhase } from '../../../types/baccarat';
import { Card } from '../common/Card';
import { evaluateHand } from '../../../engine/baccarat';

interface BaccaratTableProps {
  playerHand: CardType[];
  bankerHand: CardType[];
  phase: BaccaratPhase;
}

function HandDisplay({
  label,
  cards,
  side,
}: {
  label: string;
  cards: CardType[];
  side: 'player' | 'banker';
}) {
  const total = cards.length > 0 ? evaluateHand(cards) : null;
  const colorClass = side === 'player' ? 'text-blue-400' : 'text-red-400';

  return (
    <div className="flex-1 text-center">
      <div className={`font-bold text-lg mb-1 ${colorClass}`}>{label}</div>
      {total !== null && (
        <div className="text-cream text-2xl font-bold mb-2">{total}</div>
      )}
      <div className="flex justify-center gap-1 min-h-[96px]">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
        {cards.length === 0 && (
          <div className="w-16 h-24 rounded-lg border-2 border-dashed border-cream/20" />
        )}
      </div>
    </div>
  );
}

export function BaccaratTable({ playerHand, bankerHand, phase }: BaccaratTableProps) {
  return (
    <div className="bg-felt-dark/50 rounded-2xl p-4 border border-cream/10">
      {phase === 'betting' && playerHand.length === 0 && (
        <p className="text-cream/40 text-center text-sm mb-4">Place your bets to begin</p>
      )}
      <div className="flex gap-4">
        <HandDisplay label="Player" cards={playerHand} side="player" />
        <div className="w-px bg-cream/20" />
        <HandDisplay label="Banker" cards={bankerHand} side="banker" />
      </div>
    </div>
  );
}

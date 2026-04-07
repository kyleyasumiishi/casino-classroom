import type { Card as CardType } from '../../../types/common';
import { Card } from '../common/Card';
import { evaluateHand } from '../../../engine/blackjack';

interface HandDisplayProps {
  cards: CardType[];
  showTotal: boolean;
  label?: string;
  isActive?: boolean;
}

export function HandDisplay({
  cards,
  showTotal,
  label,
  isActive = false,
}: HandDisplayProps) {
  const visibleCards = cards.filter((c) => c.faceUp);
  const eval_ = showTotal && visibleCards.length > 0 ? evaluateHand(visibleCards) : null;

  return (
    <div className={`flex flex-col items-center gap-2 ${isActive ? 'ring-2 ring-gold/50 rounded-xl p-3' : 'p-3'}`}>
      {label && (
        <p className="text-cream/60 text-sm font-semibold uppercase tracking-wider">
          {label}
        </p>
      )}

      {/* Cards */}
      <div className="flex gap-[-0.5rem]">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className="motion-safe:animate-[slideIn_0.3s_ease-out]"
            style={{ marginLeft: i > 0 ? '-0.5rem' : 0, zIndex: i }}
          >
            <Card card={card} />
          </div>
        ))}
      </div>

      {/* Total */}
      {eval_ && (
        <div className="flex items-center gap-1.5">
          <span
            className={`text-lg font-bold ${
              eval_.isBlackjack
                ? 'text-gold'
                : eval_.isBust
                  ? 'text-casino-red'
                  : 'text-cream'
            }`}
          >
            {eval_.total}
          </span>
          {eval_.isSoft && !eval_.isBlackjack && (
            <span className="text-cream/50 text-xs">(soft)</span>
          )}
          {eval_.isBlackjack && (
            <span className="text-gold text-xs font-semibold">Blackjack!</span>
          )}
          {eval_.isBust && (
            <span className="text-casino-red text-xs font-semibold">Bust</span>
          )}
        </div>
      )}
    </div>
  );
}

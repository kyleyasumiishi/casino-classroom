import type { Card } from '../../../types/common';
import type { BlackjackHand, BlackjackPhase } from '../../../types/blackjack';
import { HandDisplay } from './HandDisplay';

interface BlackjackTableProps {
  dealerHand: Card[];
  playerHands: BlackjackHand[];
  activeHandIndex: number;
  phase: BlackjackPhase;
}

export function BlackjackTable({
  dealerHand,
  playerHands,
  activeHandIndex,
  phase,
}: BlackjackTableProps) {
  const showDealerTotal = phase === 'dealerTurn' || phase === 'resolved';
  const showPlayerTotal = phase !== 'betting';
  const hasMultipleHands = playerHands.length > 1;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Dealer area */}
      {dealerHand.length > 0 && (
        <HandDisplay
          cards={dealerHand}
          showTotal={showDealerTotal}
          label="Dealer"
        />
      )}

      {/* Divider */}
      {dealerHand.length > 0 && playerHands.length > 0 && (
        <div className="w-32 border-t border-cream/20" />
      )}

      {/* Player hand(s) */}
      {playerHands.length > 0 && (
        <div className={`flex ${hasMultipleHands ? 'gap-6' : ''} items-start`}>
          {playerHands.map((hand, i) => (
            <HandDisplay
              key={i}
              cards={hand.cards}
              showTotal={showPlayerTotal}
              label={
                hasMultipleHands
                  ? `Hand ${i + 1}${hand.result ? ` (${hand.result})` : ''}`
                  : 'Player'
              }
              isActive={
                phase === 'playerTurn' && hasMultipleHands && i === activeHandIndex
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

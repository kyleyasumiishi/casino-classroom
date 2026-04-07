import type { Card as CardType } from '../../../types/common';

interface CardProps {
  card: CardType;
  className?: string;
}

const suitSymbols: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const suitColors: Record<string, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-gray-900',
  spades: 'text-gray-900',
};

export function Card({ card, className = '' }: CardProps) {
  if (!card.faceUp) {
    return (
      <div
        className={`w-16 h-24 rounded-lg border-2 border-cream/30 bg-casino-blue flex items-center justify-center shadow-md ${className}`}
        role="img"
        aria-label="Face-down card"
      >
        <svg viewBox="0 0 40 56" className="w-10 h-14">
          <pattern id="cardBack" patternUnits="userSpaceOnUse" width="8" height="8">
            <path d="M0,4 L4,0 L8,4 L4,8 Z" fill="none" stroke="#f5f0e8" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <rect width="40" height="56" fill="url(#cardBack)" rx="2" />
        </svg>
      </div>
    );
  }

  const symbol = suitSymbols[card.suit];
  const colorClass = suitColors[card.suit];

  return (
    <div
      className={`w-16 h-24 rounded-lg border border-gray-300 bg-white flex flex-col justify-between p-1.5 shadow-md motion-safe:animate-[slideIn_0.3s_ease-out] ${className}`}
      role="img"
      aria-label={`${card.rank} of ${card.suit}`}
    >
      <div className={`text-xs font-bold leading-none ${colorClass}`}>
        <div>{card.rank}</div>
        <div>{symbol}</div>
      </div>
      <div className={`text-2xl leading-none text-center ${colorClass}`}>
        {symbol}
      </div>
      <div className={`text-xs font-bold leading-none self-end rotate-180 ${colorClass}`}>
        <div>{card.rank}</div>
        <div>{symbol}</div>
      </div>
    </div>
  );
}

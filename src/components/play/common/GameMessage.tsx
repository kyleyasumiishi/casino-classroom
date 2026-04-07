import { useEffect } from 'react';

interface GameMessageProps {
  result: 'win' | 'lose' | 'push' | 'blackjack' | 'bust';
  amount: number;
  onDismiss: () => void;
}

const resultConfig = {
  blackjack: { text: 'Blackjack!', color: 'bg-gold text-felt-dark', prefix: '+' },
  win: { text: 'You Win!', color: 'bg-green-600 text-white', prefix: '+' },
  push: { text: 'Push', color: 'bg-gray-500 text-white', prefix: '' },
  lose: { text: 'You Lose', color: 'bg-casino-red text-white', prefix: '-' },
  bust: { text: 'Bust!', color: 'bg-casino-red text-white', prefix: '-' },
};

export function GameMessage({ result, amount, onDismiss }: GameMessageProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const config = resultConfig[result];
  const showAmount = result !== 'push' && amount > 0;

  return (
    <button
      onClick={onDismiss}
      className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-center shadow-lg motion-safe:animate-[slideDown_0.3s_ease-out] ${config.color}`}
    >
      <span>{config.text}</span>
      {showAmount && (
        <span className="ml-2">
          {config.prefix}{Math.round(amount)}
        </span>
      )}
    </button>
  );
}

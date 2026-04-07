import { useEffect, useRef, useState } from 'react';
import { useWallet } from '../../store/useWallet';

export function ChipDisplay() {
  const balance = useWallet((s) => s.balance);
  const prevBalance = useRef(balance);
  const [flash, setFlash] = useState<'none' | 'win' | 'lose'>('none');

  useEffect(() => {
    if (balance > prevBalance.current) {
      setFlash('win');
    } else if (balance < prevBalance.current) {
      setFlash('lose');
    }
    prevBalance.current = balance;

    const timer = setTimeout(() => setFlash('none'), 500);
    return () => clearTimeout(timer);
  }, [balance]);

  const flashClass =
    flash === 'win'
      ? 'text-green-400 scale-110'
      : flash === 'lose'
        ? 'text-casino-red scale-110'
        : '';

  return (
    <div
      className={`flex items-center gap-1.5 font-bold text-lg transition-all duration-300 ${flashClass}`}
    >
      <span aria-hidden="true">🪙</span>
      <span aria-label={`Chip balance: ${Math.round(balance)}`}>
        {Math.round(balance).toLocaleString()}
      </span>
    </div>
  );
}

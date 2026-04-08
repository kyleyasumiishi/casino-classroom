import { useWallet } from '../../store/useWallet';

export function OutOfChips() {
  const balance = useWallet((s) => s.balance);
  const reset = useWallet((s) => s.reset);

  if (balance > 0) return null;

  return (
    <div className="bg-casino-red/20 border border-casino-red rounded-xl p-6 text-center">
      <p className="text-cream text-lg font-bold mb-2">You're out of chips!</p>
      <p className="text-cream/60 text-sm mb-4">Reset your balance to keep playing.</p>
      <button
        onClick={reset}
        aria-label="Reset balance to 1,000 chips"
        className="px-6 py-3 bg-gold text-felt-dark font-bold rounded-lg hover:bg-gold-light transition-colors min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-felt"
      >
        Reset to 1,000
      </button>
    </div>
  );
}

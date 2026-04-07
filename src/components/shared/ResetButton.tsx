import { useState } from 'react';
import { useWallet } from '../../store/useWallet';

export function ResetButton() {
  const reset = useWallet((s) => s.reset);
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-cream/60 text-sm">Reset chips to 1,000?</span>
        <button
          onClick={() => {
            reset();
            setConfirming(false);
          }}
          className="px-3 py-2 bg-casino-red text-cream text-sm font-semibold rounded-lg hover:bg-casino-red/80 transition-colors min-h-11 min-w-11"
        >
          Yes
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-2 bg-felt-light text-cream text-sm rounded-lg hover:bg-felt-light/80 transition-colors min-h-11 min-w-11"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-4 py-2 text-cream/50 text-sm hover:text-cream transition-colors min-h-11"
    >
      Reset Chips
    </button>
  );
}

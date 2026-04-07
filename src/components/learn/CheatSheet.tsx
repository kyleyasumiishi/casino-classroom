import type { CheatSheetEntry } from '../../types/lesson';

interface CheatSheetProps {
  entries: CheatSheetEntry[];
  isOpen: boolean;
  onToggle: () => void;
}

export function CheatSheet({ entries, isOpen, onToggle }: CheatSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onToggle}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-felt-dark border-l border-cream/20 z-50 overflow-y-auto shadow-2xl">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gold">Cheat Sheet</h2>
            <button
              onClick={onToggle}
              className="text-cream/50 hover:text-cream transition-colors min-h-11 min-w-11 flex items-center justify-center"
              aria-label="Close cheat sheet"
            >
              ✕
            </button>
          </div>
          <dl className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.label} className="border-b border-cream/10 pb-3">
                <dt className="text-sm font-semibold text-gold mb-0.5">
                  {entry.label}
                </dt>
                <dd className="text-sm text-cream/80">{entry.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}

interface CheatSheetButtonProps {
  onClick: () => void;
}

export function CheatSheetButton({ onClick }: CheatSheetButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3 border border-gold/40 text-gold rounded-lg hover:bg-gold/10 transition-colors min-h-11 text-sm"
    >
      Cheat Sheet
    </button>
  );
}

interface BeginnerToggleProps {
  isBeginnerMode: boolean;
  onToggle: () => void;
}

export function BeginnerToggle({ isBeginnerMode, onToggle }: BeginnerToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cream/20 text-sm text-cream/70 hover:text-cream transition-colors"
    >
      <div
        className={`w-8 h-5 rounded-full flex items-center transition-colors ${
          isBeginnerMode ? 'bg-green-600 justify-end' : 'bg-gray-600 justify-start'
        }`}
      >
        <div className="w-3.5 h-3.5 rounded-full bg-white mx-0.5" />
      </div>
      <span>{isBeginnerMode ? 'Beginner' : 'Full Table'}</span>
    </button>
  );
}

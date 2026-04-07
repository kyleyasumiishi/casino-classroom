import type { LessonSection } from '../../types/lesson';

interface LessonNavProps {
  sections: LessonSection[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function LessonNav({ sections, currentIndex, onSelect }: LessonNavProps) {
  return (
    <nav className="space-y-1">
      <p className="text-cream/50 text-xs font-semibold uppercase tracking-wider mb-3">
        {currentIndex + 1} of {sections.length}
      </p>
      {sections.map((section, i) => {
        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;
        return (
          <button
            key={section.id}
            onClick={() => onSelect(i)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors min-h-11 flex items-center gap-2 ${
              isActive
                ? 'bg-gold/20 text-gold font-semibold border border-gold/30'
                : isCompleted
                  ? 'text-cream/70 hover:bg-felt-light/50'
                  : 'text-cream/50 hover:bg-felt-light/50'
            }`}
          >
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-full border text-xs flex items-center justify-center ${
                isActive
                  ? 'border-gold bg-gold text-felt-dark font-bold'
                  : isCompleted
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : 'border-cream/30 text-cream/40'
              }`}
            >
              {isCompleted ? '✓' : i + 1}
            </span>
            <span className="truncate">{section.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

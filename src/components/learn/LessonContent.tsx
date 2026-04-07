import type { LessonSection } from '../../types/lesson';
import { PayoutTable } from './PayoutTable';

interface LessonContentProps {
  section: LessonSection;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  onCheatSheet?: () => void;
}

export function LessonContent({
  section,
  onNext,
  onPrev,
  isFirst,
  isLast,
  onCheatSheet,
}: LessonContentProps) {
  return (
    <article className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gold mb-6">{section.title}</h2>

      <div className="space-y-4">
        {section.content.map((block, i) => {
          switch (block.type) {
            case 'text':
              return (
                <p key={i} className="text-cream/90 leading-relaxed">
                  {block.body}
                </p>
              );
            case 'heading':
              return block.level === 2 ? (
                <h2 key={i} className="text-xl font-bold text-cream mt-6 mb-2">
                  {block.text}
                </h2>
              ) : (
                <h3 key={i} className="text-lg font-semibold text-cream mt-4 mb-2">
                  {block.text}
                </h3>
              );
            case 'tip':
              return (
                <div
                  key={i}
                  className="border-l-4 border-green-500 bg-green-900/20 rounded-r-lg px-4 py-3"
                  role="note"
                >
                  <p className="text-sm font-semibold text-green-400 mb-1">Tip</p>
                  <p className="text-cream/90 text-sm">{block.body}</p>
                </div>
              );
            case 'warning':
              return (
                <div
                  key={i}
                  className="border-l-4 border-amber-500 bg-amber-900/20 rounded-r-lg px-4 py-3"
                  role="alert"
                >
                  <p className="text-sm font-semibold text-amber-400 mb-1">Warning</p>
                  <p className="text-cream/90 text-sm">{block.body}</p>
                </div>
              );
            case 'example':
              return (
                <div
                  key={i}
                  className="bg-felt-light rounded-lg p-4 border border-cream/10"
                >
                  <p className="text-sm font-semibold text-gold mb-2">Example</p>
                  <p className="text-cream/90 text-sm mb-2">
                    <span className="font-semibold text-cream">Scenario: </span>
                    {block.scenario}
                  </p>
                  <p className="text-cream/90 text-sm mb-2">
                    <span className="font-semibold text-cream">Action: </span>
                    {block.action}
                  </p>
                  <p className="text-cream/90 text-sm">
                    <span className="font-semibold text-cream">Result: </span>
                    {block.result}
                  </p>
                </div>
              );
            case 'payoutTable':
              return <PayoutTable key={i} rows={block.rows} showCategory />;
            default:
              return null;
          }
        })}
      </div>

      <nav className="flex items-center justify-between mt-8 pt-6 border-t border-cream/10 gap-2">
        <div className="flex gap-2">
          {!isFirst && (
            <button
              onClick={onPrev}
              className="px-5 py-3 bg-felt-light text-cream rounded-lg hover:bg-felt-light/80 transition-colors min-h-11"
            >
              Previous
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {onCheatSheet && (
            <button
              onClick={onCheatSheet}
              className="px-4 py-3 border border-gold/40 text-gold rounded-lg hover:bg-gold/10 transition-colors min-h-11 text-sm"
            >
              Cheat Sheet
            </button>
          )}
          <button
            onClick={onNext}
            className="px-5 py-3 bg-gold text-felt-dark font-semibold rounded-lg hover:bg-gold-light transition-colors min-h-11"
          >
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </nav>
    </article>
  );
}

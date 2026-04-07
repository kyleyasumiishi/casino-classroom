import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import type { GameType } from '../../types/common';
import type { LessonData } from '../../types/lesson';
import { blackjackLesson } from '../../data/lessons/blackjack';
import { baccaratLesson } from '../../data/lessons/baccarat';
import { crapsLesson } from '../../data/lessons/craps';
import { useLesson } from '../../hooks/useLesson';
import { LessonNav } from './LessonNav';
import { LessonContent } from './LessonContent';
import { CheatSheet, CheatSheetButton } from './CheatSheet';

const lessonMap: Record<GameType, LessonData> = {
  blackjack: blackjackLesson,
  baccarat: baccaratLesson,
  craps: crapsLesson,
};

const validGameTypes: GameType[] = ['blackjack', 'baccarat', 'craps'];

export function LearnPage() {
  const { gameType } = useParams<{ gameType: string }>();
  const [navOpen, setNavOpen] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);

  if (!gameType || !validGameTypes.includes(gameType as GameType)) {
    return <Navigate to="/404" replace />;
  }

  const lesson = lessonMap[gameType as GameType];
  const {
    currentSectionIndex,
    goToSection,
    nextSection,
    prevSection,
    isFirst,
    isLast,
  } = useLesson({ totalSections: lesson.sections.length });

  const currentSection = lesson.sections[currentSectionIndex];

  const handleNext = () => {
    if (isLast) {
      // On finish, scroll to top
      window.scrollTo(0, 0);
    } else {
      nextSection();
      window.scrollTo(0, 0);
    }
  };

  const handleSelect = (index: number) => {
    goToSection(index);
    setNavOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gold">{lesson.title}</h1>
      </div>

      {/* Mobile nav toggle */}
      <button
        onClick={() => setNavOpen(!navOpen)}
        className="md:hidden mb-4 px-4 py-2.5 bg-felt-light text-cream text-sm rounded-lg min-h-11 w-full text-left flex items-center justify-between"
      >
        <span>
          Section {currentSectionIndex + 1}: {currentSection.title}
        </span>
        <span className="text-cream/50">{navOpen ? '▲' : '▼'}</span>
      </button>

      {/* Mobile nav dropdown */}
      {navOpen && (
        <div className="md:hidden mb-4 bg-felt-dark rounded-lg p-3 border border-cream/10">
          <LessonNav
            sections={lesson.sections}
            currentIndex={currentSectionIndex}
            onSelect={handleSelect}
          />
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-20">
            <LessonNav
              sections={lesson.sections}
              currentIndex={currentSectionIndex}
              onSelect={handleSelect}
            />
            <div className="mt-4 pt-4 border-t border-cream/10">
              <CheatSheetButton onClick={() => setCheatSheetOpen(true)} />
            </div>
          </div>
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <LessonContent
            section={currentSection}
            onNext={handleNext}
            onPrev={() => {
              prevSection();
              window.scrollTo(0, 0);
            }}
            isFirst={isFirst}
            isLast={isLast}
            onCheatSheet={() => setCheatSheetOpen(true)}
          />
        </div>
      </div>

      <CheatSheet
        entries={lesson.cheatSheet}
        isOpen={cheatSheetOpen}
        onToggle={() => setCheatSheetOpen(!cheatSheetOpen)}
      />
    </div>
  );
}

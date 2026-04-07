import { useState, useMemo, useCallback } from 'react';

interface UseLessonOptions {
  totalSections: number;
}

export function useLesson({ totalSections }: UseLessonOptions) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const nextSection = useCallback(() => {
    setCurrentSectionIndex((i) => Math.min(i + 1, totalSections - 1));
  }, [totalSections]);

  const prevSection = useCallback(() => {
    setCurrentSectionIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToSection = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSections) {
        setCurrentSectionIndex(index);
      }
    },
    [totalSections]
  );

  const isFirst = currentSectionIndex === 0;
  const isLast = currentSectionIndex === totalSections - 1;
  const progress = useMemo(
    () => (totalSections > 0 ? currentSectionIndex / totalSections : 0),
    [currentSectionIndex, totalSections]
  );

  return {
    currentSectionIndex,
    totalSections,
    goToSection,
    nextSection,
    prevSection,
    isFirst,
    isLast,
    progress,
  };
}

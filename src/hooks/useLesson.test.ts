import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLesson } from './useLesson';

describe('useLesson', () => {
  it('initializes at section 0', () => {
    const { result } = renderHook(() => useLesson({ totalSections: 5 }));
    expect(result.current.currentSectionIndex).toBe(0);
  });

  it('nextSection increments index', () => {
    const { result } = renderHook(() => useLesson({ totalSections: 5 }));
    act(() => result.current.nextSection());
    expect(result.current.currentSectionIndex).toBe(1);
  });

  it('prevSection decrements index', () => {
    const { result } = renderHook(() => useLesson({ totalSections: 5 }));
    act(() => result.current.goToSection(2));
    act(() => result.current.prevSection());
    expect(result.current.currentSectionIndex).toBe(1);
  });

  it('nextSection does not exceed total sections', () => {
    const { result } = renderHook(() => useLesson({ totalSections: 3 }));
    act(() => result.current.goToSection(2));
    act(() => result.current.nextSection());
    expect(result.current.currentSectionIndex).toBe(2);
  });

  it('prevSection does not go below 0', () => {
    const { result } = renderHook(() => useLesson({ totalSections: 5 }));
    act(() => result.current.prevSection());
    expect(result.current.currentSectionIndex).toBe(0);
  });

  it('goToSection jumps to specified index', () => {
    const { result } = renderHook(() => useLesson({ totalSections: 5 }));
    act(() => result.current.goToSection(3));
    expect(result.current.currentSectionIndex).toBe(3);
  });

  it('isFirst is true at index 0', () => {
    const { result } = renderHook(() => useLesson({ totalSections: 5 }));
    expect(result.current.isFirst).toBe(true);
  });

  it('isLast is true at final index', () => {
    const { result } = renderHook(() => useLesson({ totalSections: 5 }));
    act(() => result.current.goToSection(4));
    expect(result.current.isLast).toBe(true);
  });

  it('progress computes correctly (e.g., 2/5 = 0.4)', () => {
    const { result } = renderHook(() => useLesson({ totalSections: 5 }));
    act(() => result.current.goToSection(2));
    expect(result.current.progress).toBe(0.4);
  });
});

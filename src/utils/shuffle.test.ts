import { describe, it, expect } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('returns array of same length', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input)).toHaveLength(5);
  });

  it('contains all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not mutate original array', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it('produces different orderings (run 10x, not all identical)', () => {
    const input = Array.from({ length: 20 }, (_, i) => i);
    const results = Array.from({ length: 10 }, () => shuffle(input).join(','));
    const unique = new Set(results);
    expect(unique.size).toBeGreaterThan(1);
  });

  it('handles empty array', () => {
    expect(shuffle([])).toEqual([]);
  });
});

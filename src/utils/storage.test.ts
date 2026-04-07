import { describe, it, expect } from 'vitest';
import { saveToStorage, loadFromStorage } from './storage';

describe('storage', () => {
  it('saves and loads data correctly', () => {
    saveToStorage('test', { balance: 500 });
    expect(loadFromStorage('test', { balance: 0 })).toEqual({ balance: 500 });
  });

  it('returns fallback on missing key', () => {
    expect(loadFromStorage('nonexistent', 42)).toBe(42);
  });

  it('returns fallback on corrupted JSON', () => {
    localStorage.setItem('corrupt', '{bad json!!!');
    expect(loadFromStorage('corrupt', 'default')).toBe('default');
  });

  it('returns fallback on wrong version', () => {
    localStorage.setItem('old', JSON.stringify({ version: 999, data: 'old' }));
    expect(loadFromStorage('old', 'fallback')).toBe('fallback');
  });

  it('handles localStorage unavailable (throws → fallback)', () => {
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = () => { throw new Error('SecurityError'); };
    expect(loadFromStorage('key', 'safe')).toBe('safe');
    localStorage.getItem = originalGetItem;
  });
});

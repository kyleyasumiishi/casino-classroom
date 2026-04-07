import '@testing-library/jest-dom';

// Node 25 provides a built-in localStorage that is incomplete (no setItem/getItem/clear methods).
// Replace it with a proper Web Storage API-compliant implementation for tests.
const storage = new Map<string, string>();

const localStorageMock: Storage = {
  getItem(key: string): string | null {
    return storage.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    storage.set(key, String(value));
  },
  removeItem(key: string): void {
    storage.delete(key);
  },
  clear(): void {
    storage.clear();
  },
  get length(): number {
    return storage.size;
  },
  key(index: number): string | null {
    const keys = Array.from(storage.keys());
    return keys[index] ?? null;
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

afterEach(() => {
  storage.clear();
});

const STORAGE_VERSION = 1;

interface StorageWrapper<T> {
  version: number;
  data: T;
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    const wrapper: StorageWrapper<T> = { version: STORAGE_VERSION, data };
    localStorage.setItem(key, JSON.stringify(wrapper));
  } catch {
    // localStorage unavailable or full — silently fail
  }
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: StorageWrapper<T> = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION) return fallback;
    return parsed.data;
  } catch {
    return fallback;
  }
}

// Inspired by:
// https://denwakeup.medium.com/custom-react-hooks-%D1%85%D1%80%D0%B0%D0%BD%D0%B8%D0%BC-%D0%BD%D0%B0%D1%88%D0%B8-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-%D0%B2-localstorage-sessionstorage-%D0%B8%D0%BB%D0%B8-%D1%82%D0%B0%D0%BC-%D0%B3%D0%B4%D0%B5-%D0%B4%D1%83%D1%88%D0%B5-%D1%83%D0%B3%D0%BE%D0%B4%D0%BD%D0%BE-d36d9f03da2f

export type Maybe<V> = V | null;

export interface Storage<K = any, V = any> {
  getItem(key: K): Maybe<V>;
  setItem(key: K, value: V): void;
  removeItem(key: K): void;
}

export class LocalStorageAdapter<T> implements Storage<string, T> {
  storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  getItem<V>(key: string): Maybe<V> {
    const value = this.storage.getItem(key);

    if (value === null || value === undefined) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch (e) {
      console.log('Storage parse error', e);
      return null;
    }
  }

  setItem<V>(key: string, value: V) {
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log('Storage stringify error', e);
    }
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }
}

export const storage = new LocalStorageAdapter(localStorage);

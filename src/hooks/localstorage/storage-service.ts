export type Maybe<V> = V | null;

export interface Storage<K = any, V = any> {
  getItem(key: K): Maybe<V>;
  setItem(key: K, value: V): void;
  removeItem(key: K): void;
}

export class LocalStorageAdapter implements Storage<string, any> {
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

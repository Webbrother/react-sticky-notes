import { SetStateAction, useCallback, useState } from 'react';

import { storage } from './storage-service';

// Inspired by https://usehooks.com/
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: SetStateAction<T>) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storage.getItem<T>(key) ?? initialValue;
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue(prevState => {
        const valueToStore = value instanceof Function ? value(prevState) : value;

        storage.setItem(key, valueToStore);

        return valueToStore;
      });
    },
    [key]
  );

  return [storedValue, setValue];
};

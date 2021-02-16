import { SetStateAction, useCallback, useState } from 'react';

// Inspired by https://usehooks.com/
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: SetStateAction<T>) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        if (value instanceof Function) {
          setStoredValue(prevValue => {
            const nextValue = value(prevValue);

            window.localStorage.setItem(key, JSON.stringify(nextValue));
            return nextValue;
          });
        } else {
          setStoredValue(value);
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

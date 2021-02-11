import { useState, useEffect, useCallback } from 'react';

export interface RequestStatus {
  loading: boolean;
  loaded: boolean;
  error: boolean;
}

export const RequestStatuses: {
  init: Readonly<RequestStatus>;
  request: Readonly<RequestStatus>;
  requestSuccess: Readonly<RequestStatus>;
  error: Readonly<RequestStatus>;
} = {
  init: {
    loading: false,
    loaded: false,
    error: false,
  },
  request: {
    loading: true,
    loaded: false,
    error: false,
  },
  requestSuccess: {
    loading: false,
    loaded: true,
    error: false,
  },
  error: {
    loading: false,
    loaded: false,
    error: true,
  },
};


// Inspired by https://usehooks.com/useAsync/
export const useAsync = <Arg, T, E = string>(
  asyncFunction: (arg: Arg) => Promise<T>,
  immediateCallArg?: Arg
) => {
  const [status, setStatus] = useState<RequestStatus>(RequestStatuses.init);
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(
    arg => {
      setStatus(RequestStatuses.request);
      setValue(null);
      setError(null);

      return asyncFunction(arg)
        .then(response => {
          setValue(response);
          setStatus(RequestStatuses.requestSuccess);
        })
        .catch(error => {
          setError(error);
          setStatus(RequestStatuses.error);
        });
    },
    [asyncFunction]
  );

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediateCallArg) {
      execute(immediateCallArg);
    }
  }, [execute, immediateCallArg]);

  return { execute, status, value, error };
};

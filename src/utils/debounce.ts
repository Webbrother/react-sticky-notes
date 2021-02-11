type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export const debounce = <T extends Function>(cb: T, wait = 100) => {
  let timeoutId: number;

  return (...args: ArgumentTypes<T>) => {
    clearTimeout(timeoutId);
    timeoutId = (setTimeout(() => {
      cb.apply(this, args);
    }, wait) as unknown) as number;
  };
};

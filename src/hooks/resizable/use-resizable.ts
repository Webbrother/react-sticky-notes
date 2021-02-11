import { RefObject, useEffect } from 'react';
import { OnResizeCallback, resizableService } from './resizable-service';

export const useResizable = <T extends HTMLElement>(
  ref: RefObject<T>,
  onResize: OnResizeCallback
) => {
  useEffect(() => {
    const { current } = ref;

    if (current) {
      return resizableService.subscribe(onResize, current);
    }
  }, [ref, onResize]);

  useEffect(() => {
    const { current } = ref;

    if (current) {
      return resizableService.observe(current);
    }
  }, [ref]);
};

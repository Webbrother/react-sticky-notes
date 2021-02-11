import { useEffect, useRef } from 'react';
import { movableService } from './movable-service';

export const useMovableContext = <T extends HTMLElement>() => {
  const movableContextRef = useRef<T>(null);

  useEffect(() => {
    movableService.setContext(movableContextRef);

    return () => {
      movableService.destroy();
    };
  }, []);

  return movableContextRef;
};

import { RefObject, useEffect } from 'react';
import {IdCallback, movableService} from './movable-service';

export const useDroppable = <T extends HTMLElement>(ref: RefObject<T>, onDrop: IdCallback) => {
  useEffect(() => {
    movableService.setDroppableTarget(ref);
    movableService.setOnDropCallback(onDrop);

    return () => {
      movableService.setDroppableTarget(null);
      movableService.setOnDropCallback(() => {});
    };
  }, [ref, onDrop]);
};

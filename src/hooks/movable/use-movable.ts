import { MovableCoordinates, MovableNode, movableService } from './movable-service';
import { RefObject, useEffect, useMemo } from 'react';

export const useMovable = <T extends HTMLElement, H extends HTMLElement>(
  movableRef: RefObject<T>,
  handleRef: RefObject<H>,
  onMoveFinish: (coordinates: MovableCoordinates) => void,
) => {
  const movableNode = useMemo<MovableNode>(
    () => ({
      movableRef,
      handleRef,
      onMoveFinish,
    }),
    [movableRef, handleRef, onMoveFinish]
  );

  useEffect(() => {
    handleRef.current?.classList.add('movable-handle');
  }, [handleRef]);

  useEffect(() => {
    movableService.addNode(movableNode);

    return () => {
      movableService.removeNode(movableNode);
    };
  }, [movableNode]);

  return movableNode;
};

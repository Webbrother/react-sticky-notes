import { MovableCoordinates, MovableNode, movableService } from './movable-service';
import { RefObject, useEffect, useMemo } from 'react';

export const useMovable = <T extends HTMLElement, H extends HTMLElement>(
  movableRef: RefObject<T>,
  handleRef: RefObject<H>,
  onMoveFinish: (coordinates: MovableCoordinates) => void,
  id: number
) => {
  const movableNode = useMemo<MovableNode>(
    () => ({
      movableRef,
      handleRef,
      onMoveFinish,
      id,
    }),
    [movableRef, handleRef, onMoveFinish, id]
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

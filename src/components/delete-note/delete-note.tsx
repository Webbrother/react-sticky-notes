import styles from './delete-note.module.css';
import { FunctionComponent, memo, useRef } from 'react';
import { useDroppable } from '../../hooks/movable/use-droppable';

interface DeleteNoteProps {
  onDrop(id: number): void;
}

const DeleteNoteComponent: FunctionComponent<DeleteNoteProps> = ({onDrop}) => {
  const droppableRef = useRef<HTMLDivElement>(null);

  useDroppable(droppableRef, onDrop);
  return (
    <div className={styles.deleteNote} ref={droppableRef}>
      Drop note here to delete.
    </div>
  );
};

export const DeleteNote = memo(DeleteNoteComponent);

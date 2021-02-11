import {useState, useCallback, useRef, FunctionComponent, useMemo, memo, useEffect, CSSProperties} from 'react';
import styles from './note.module.css';
import { ReactComponent as EditLogo } from '../../icons/edit.svg';
import { ReactComponent as CheckLogo } from '../../icons/check.svg';
import { ReactComponent as TrashLogo } from '../../icons/trash.svg';
import { useMovable } from '../../hooks/movable';
import { useResizable } from '../../hooks/resizable/use-resizable';
import { MovableCoordinates } from '../../hooks/movable/movable-service';
import { ResizableSizes } from '../../hooks/resizable/resizable-service';

export type NoteColor = '#fff780' | '#cbfafa' | '#f8cdcd';

export interface INote {
  id: number;
  text: string;
  coordinates?: MovableCoordinates;
  sizes?: ResizableSizes;
  color: NoteColor;
}

interface NoteProps {
  note: INote;
  onSave(id: number, note: string): void;
  onDelete(id: number): void;
  onMoveFinish(id: number, coordinates: MovableCoordinates): void;
  onResizeFinish(id: number, sizes: ResizableSizes): void;
}

const NoteComponent: FunctionComponent<NoteProps> = ({
  note,
  onSave,
  onDelete,
  onMoveFinish,
  onResizeFinish,
}) => {
  const { id, text, coordinates, sizes, color } = note;

  const contentRef = useRef<HTMLDivElement>(null);
  const movableRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.innerText = text;
  }, [text]);

  const [isEdit, setIsEdit] = useState(false);

  const noteStyle = useMemo<CSSProperties>(() => {
    const result:CSSProperties = { backgroundColor: color };
    if (sizes) {
      result.width = `${sizes.width}px`
      result.height = `${sizes.height}px`
    }

    if (coordinates) {
      result.position = 'absolute';
      result.left = `${coordinates.x}px`
      result.top = `${coordinates.y}px`
    }

    return result;
  }, [color, sizes, coordinates]);

  const handleFocus = useCallback(() => {
    setIsEdit(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEdit(false);
    onSave(id, contentRef.current!.textContent || '');
  }, [id, onSave]);

  const toggleEdit = useCallback(() => {
    if (isEdit) {
      contentRef.current!.blur();
    } else {
      contentRef.current!.focus();
    }
  }, [contentRef, isEdit]);

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  const handleMoveFinish = useCallback(
    (coordinates: MovableCoordinates) => {
      onMoveFinish(id, coordinates);
    },
    [id, onMoveFinish]
  );

  const handleResizeFinish = useCallback(
    (sizes: ResizableSizes) => {
      onResizeFinish(id, sizes);
    },
    [id, onResizeFinish]
  );

  useMovable(movableRef, handleRef, handleMoveFinish);
  useResizable(movableRef, handleResizeFinish);

  return (
    <div className={styles.note} ref={movableRef} style={noteStyle}>
      <div className={styles.noteHeader} ref={handleRef}>
        <div className={styles.iconContainer} onClick={toggleEdit}>
          {isEdit ? <CheckLogo /> : <EditLogo />}
        </div>

        <div className={styles.iconContainer} onClick={handleDelete}>
          <TrashLogo />
        </div>
      </div>
      <div
        ref={contentRef}
        className={styles.noteBody}
        contentEditable
        tabIndex={id}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export const Note = memo(NoteComponent);

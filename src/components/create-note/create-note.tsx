import { FormEvent, FunctionComponent, memo, useCallback, useRef } from 'react';
import { INote, NoteColor } from '../note/note';
import styles from './create-note.module.css';

export type NewNote = Omit<INote, 'id'>;

interface CreateNoteProps {
  onSubmit(note: NewNote): void;
}

const noteColors: NoteColor[] = ['#fff780', '#cbfafa', '#f8cdcd'];

const CreateNoteComponent: FunctionComponent<CreateNoteProps> = ({ onSubmit }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      const index = Math.floor(Math.random() * 3);
      const color = noteColors[index];

      const result: NewNote = {
        coordinates: {
          x: +formData.get('x')! || 50,
          y: +formData.get('y')! || 150,
        },
        sizes: {
          width: +formData.get('width')! || 200,
          height: +formData.get('height')! || 200,
        },
        text: '',
        color,
      };

      formRef.current?.reset();

      onSubmit(result);
    },
    [onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.createNote} ref={formRef}>
      <p>Create a new note</p>
      <label>
        <span>Width:</span>
        <input type='number' name='width' placeholder='default 200px' />
      </label>
      <label>
        <span>Height:</span>
        <input type='number' name='height' placeholder='default 200px' />
      </label>
      <label>
        <span>Top:</span>
        <input type='number' name='y' placeholder='default 150px' />
      </label>
      <label>
        <span>Left:</span>
        <input type='number' name='x' placeholder='default 50px' />
      </label>

      <button type='submit'>New note</button>
    </form>
  );
};

export const CreateNote = memo(CreateNoteComponent);

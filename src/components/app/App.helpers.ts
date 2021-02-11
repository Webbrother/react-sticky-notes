import { INote } from '../note/note';
import { SetStateAction, useCallback } from 'react';
import { RequestStatus, useAsync } from '../../hooks/async/use-async';
import { useLocalStorage } from '../../hooks/localstorage/use-localstorage';
import { API } from '../../api/api-mock';

export const updateNote = (
  notes: INote[],
  id: number,
  prop: keyof INote,
  value: INote[keyof INote]
): INote[] => {
  const index = notes.findIndex(note => note.id === id);
  if (index === -1) return notes;

  notes[index] = { ...notes[index], [prop]: value };
  return notes;
};

export const useSaveNotes = (): [
  INote[],
  (value: SetStateAction<INote[]>) => void,
  RequestStatus
] => {
  const [notes, setNotes] = useLocalStorage<INote[]>('notes', []);
  const { execute, status } = useAsync<INote[], void, void>(API.postNotes);

  const saveNotes = useCallback(
    (value: INote[] | ((val: INote[]) => INote[])) => {
      const valueToSave = value instanceof Function ? value(notes) : value;

      setNotes(valueToSave);
      execute(valueToSave);
    },
    [setNotes, execute, notes]
  );

  return [notes, saveNotes, status];
};

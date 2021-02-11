import React, { useCallback } from 'react';
import './App.css';
import { Note } from '../note/note';
import { useMovableContext } from '../../hooks/movable';
import { MovableCoordinates } from '../../hooks/movable/movable-service';
import { ResizableSizes } from '../../hooks/resizable/resizable-service';
import { CreateNote, NewNote } from '../create-note/create-note';
import { updateNote, useSaveNotes } from './App.helpers';

export const App = () => {
  const [notes, setNotes, status] = useSaveNotes();

  const movableContextRef = useMovableContext<HTMLDivElement>();

  const handleCreateNote = useCallback(
    (note: NewNote) => {
      setNotes(prev => {
        return [...prev, { ...note, id: Date.now() }];
      });
    },
    [setNotes]
  );

  const handleSaveNote = useCallback(
    (id: number, noteText: string) => {
      console.log('note saved:', id, noteText);
      setNotes(notes => updateNote(notes, id, 'text', noteText));
    },
    [setNotes]
  );

  const handleDeleteNote = useCallback(
    id => {
      console.log('node deleted:', id);
      setNotes(notes => notes.filter(_note => _note.id !== id));
    },
    [setNotes]
  );

  const handleMoveFinish = useCallback(
    (id: number, coordinates: MovableCoordinates) => {
      console.log('node moved:', id, coordinates);
      setNotes(notes => {
        // Here we should set coordinates ...
        const result = updateNote(notes, id, 'coordinates', coordinates);
        // ... and put the note to the bottom
        const note = result.find(_note => _note.id === id);

        return [...result.filter(note => note.id !== id), note!];
      });
    },
    [setNotes]
  );

  const handleResizeFinish = useCallback(
    (id: number, sizes: ResizableSizes) => {
      console.log('node resized:', id, sizes);
      setNotes(notes => updateNote(notes, id, 'sizes', sizes));
    },
    [setNotes]
  );

  return (
    <div className='App' ref={movableContextRef}>
      <CreateNote onSubmit={handleCreateNote} />

      {status.loading && 'Saving notes...'}

      {notes.map(note => (
        <Note
          key={note.id}
          note={note}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onMoveFinish={handleMoveFinish}
          onResizeFinish={handleResizeFinish}
        />
      ))}
    </div>
  );
};

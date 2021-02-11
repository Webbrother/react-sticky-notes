import { INote } from '../components/note/note';

export const API = {
  postNotes(notes: INote[]): Promise<void> {
    return new Promise((res, rej) => {
      console.log('Request start');
      setTimeout(() => {
        res();
        console.log('Request finish');
      }, 1500);
    });
  },
};

import {ADD_NOTE, DELETE_NOTE, EDIT_NOTE} from '../actionTypes';
export function addNote({
  noteTitle,
  noteContent,
  noteDate,
  noteBackground,
  notePin,
}) {
  return {
    type: ADD_NOTE,
    payload: {
      noteTitle: noteTitle,
      noteContent: noteContent,
      noteDate: noteDate,
      noteBackground: noteBackground,
      notePin: notePin,
    },
  };
}
export function deleteNote(noteDate) {
  return {
    type: DELETE_NOTE,
    payload: noteDate,
  };
}
export function editNote({
  noteTitle,
  noteContent,
  oldNoteDate,
  newNoteDate,
  noteBackground,
  notePin,
}) {
  return {
    type: EDIT_NOTE,
    payload: {
      noteTitle: noteTitle,
      noteContent: noteContent,
      oldNoteDate: oldNoteDate,
      newNoteDate: newNoteDate,
      noteBackground: noteBackground,
      notePin: notePin,
    },
  };
}

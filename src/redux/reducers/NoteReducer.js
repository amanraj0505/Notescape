import {CLEAR_DATA, ADD_NOTE, DELETE_NOTE, EDIT_NOTE} from '../actionTypes';
const initialState = {
  noteList: [],
};

export const noteReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_DATA: {
      return initialState;
    }
    case ADD_NOTE: {
      if (action.payload.notePin === 'pin') {
        return {
          ...state,
          noteList: [
            {
              noteTitle: action.payload.noteTitle,
              noteContent: action.payload.noteContent,
              noteDate: action.payload.noteDate,
              noteBackground: action.payload.noteBackground,
              notePin: action.payload.notePin,
              id: Math.random(),
            },
            ...state.noteList,
          ],
        };
      } else {
        return {
          ...state,
          noteList: [
            ...state.noteList,
            {
              noteTitle: action.payload.noteTitle,
              noteContent: action.payload.noteContent,
              noteDate: action.payload.noteDate,
              noteBackground: action.payload.noteBackground,
              notePin: action.payload.notePin,
              id: Math.random(),
            },
          ],
        };
      }
    }
    case DELETE_NOTE: {
      return {
        noteList: [
          ...state.noteList.filter(note => note.noteDate !== action.payload),
        ],
      };
    }
    case EDIT_NOTE: {
      if (action.payload.notePin === 'pin') {
        return {
          noteList: [
            {
              noteTitle: action.payload.noteTitle,
              noteContent: action.payload.noteContent,
              noteDate: action.payload.newNoteDate,
              noteBackground: action.payload.noteBackground,
              notePin: action.payload.notePin,
              id: Math.random(),
            },
            ...state.noteList.filter(
              note => note.noteDate !== action.payload.oldNoteDate,
            ),
          ],
        };
      } else {
        return {
          noteList: [
            ...state.noteList.filter(
              note => note.noteDate !== action.payload.oldNoteDate,
            ),
            {
              noteTitle: action.payload.noteTitle,
              noteContent: action.payload.noteContent,
              noteDate: action.payload.newNoteDate,
              noteBackground: action.payload.noteBackground,
              notePin: action.payload.notePin,
              id: Math.random(),
            },
          ],
        };
      }
    }
    default:
      return {
        ...state,
      };
  }
};

import {noteReducer} from './NoteReducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  note: noteReducer,
});

export default rootReducer;

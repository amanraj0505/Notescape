import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Reducers from './reducers';

//redux store
export const store = createStore(Reducers, applyMiddleware(thunk));

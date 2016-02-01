/**
 * @file The reducer which operates on the Redux store.
 */

import { combineReducers } from 'redux';
import selectedFilesReducer from './selected-files/reducer.js';
import filesReducer from './files/reducer.js';

/**
 * @func rootReducer
 * @param object state - The current state.
 * @param object action - The dispatched action.
 * @param string action.type - The type of action that has been dispatched.
 * @param object [action.payload] - Optional data passed with the action.
 * @desc Operates on the Redux store to update application state.
 */
const rootReducer = combineReducers({
	files: filesReducer,
	selectedFiles: selectedFilesReducer
});

export default rootReducer;
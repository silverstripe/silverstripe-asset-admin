/**
 * @file The reducer which operates on the Redux store.
 */

import { combineReducers } from 'redux';


function exampleReducer(state = {}, action) {
	switch (action.type) {
		case 'foo':
			return Object.assign({}, state, {
				updated: true
			});
			break;
		default:
			return state;
	}
}

/**
 * @func rootReducer
 * @param object state - The current state.
 * @param object action - The dispatched action.
 * @param string action.type - The type of action that has been dispatched.
 * @param object [action.payload] - Optional data passed with the action.
 * @desc Operates on the Redux store to update application state.
 */
const rootReducer = combineReducers({
	exampleReducer
});

export default rootReducer;
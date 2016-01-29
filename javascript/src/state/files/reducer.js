/**
 * @file Reducers for application's selected items.
 */

import { FILES } from '../action-types';

const initialState = {
	files: new Array()
};

/**
 * @func selectedFilesReducer
 * @param object initialState
 * @param object action - The dispatched action.
 * @param string action.type - Name of the dispatched action.
 * @param object [action.payload] - Optional data passed with the action.
 * @desc Reducer for the `selectedItems` section of state.
 */
export default function selectedFilesReducer(state = initialState, action) {
	switch (action.type) {
		case FILES.ADD_FILE:
			return Object.assign({}, state, {
				files: state.files.concat(action.file)
			});
		default:
			return state;
	}
}

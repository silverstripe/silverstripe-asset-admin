/**
 * @file Reducers for application's selected items.
 */

import { SELECTED_FILES } from '../action-types';
import deepFreeze from 'deep-freeze';

const initialState = {
	selectedFiles: [],
	selected: false
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
		case SELECTED_FILES.SELECT_FILE:
			var newSelectedFiles = [],
				fileIndex = state.selectedFiles.indexOf(action.payload.id);

			//Remove file if its already in array, else add it to the array
			if (fileIndex > -1) {
				newSelectedFiles = state.selectedFiles.filter((id) => id !== action.payload.id);
			} else {
				newSelectedFiles = state.selectedFiles.concat(action.payload.id);
			}

			return deepFreeze(Object.assign({}, state, {
				selectedFiles: newSelectedFiles
			}));

		default:
			return state;
	}
}

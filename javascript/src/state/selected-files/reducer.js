/**
 * @file Reducers for application's selected items.
 */

import { SELECTED_FILES } from '../action-types';

const initialState = {
	selectedFiles: new Array()
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
			var newSelectedFiles = state.selectedFiles,
				fileIndex = -1;
			
			//Check if file is already in selectedFiles array
			for (var i = 0; i < newSelectedFiles.length; i++) {
				if (newSelectedFiles[i].props.id === action.file.props.id) {
					fileIndex = i;
				}
			}

			//Remove file if its already in array, else add it to the array
			if (fileIndex > -1) {
				newSelectedFiles.splice(fileIndex, 1);
			} else {
				newSelectedFiles.push(action.file);
			}

			return Object.assign({}, state, {
				selectedFiles: newSelectedFiles
			});

		default:
			return state;
	}
}

/**
 * @file Actions for making updates to the selectedItems section of the store's state.
 */

import { SELECTED_FILES } from '../action-types';


export function selectFile(file) {
	return (dispatch, getState) => {
		return dispatch ({
			type: SELECTED_FILES.SELECT_FILE,
			file
		});
	}
}

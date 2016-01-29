/**
 * @file Actions for making updates to the selectedItems section of the store's state.
 */

import { SELECTED_FILES } from '../action-types';

/**
 * Selects a file
 *
 * @param object file
 * @param number file.id - The file id.
 * @param boolean file.selected - The new selected state of the file.
 */
export function selectFile(file) {
	return (dispatch, getState) => {
		return dispatch ({
			type: SELECTED_FILES.SELECT_FILE,
			payload: file
		});
	}
}

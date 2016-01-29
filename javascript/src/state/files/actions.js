/**
 * @file Actions for making updates to the selectedItems section of the store's state.
 */

import { FILES } from '../action-types';

export function addFile(file) {
	return (dispatch, getState) => {
		return dispatch ({
			type: FILES.ADD_FILE,
			payload: {
				id: file.props.id
			}
		});
	}
}

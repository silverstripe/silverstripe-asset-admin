import { GALLERY } from '../action-types';

/**
 * Adds a file to state.
 *
 * @param object file
 * @param number file.id - The file id.
 */
export function addFile(file) {
    return (dispatch, getState) => {
        return dispatch ({
            type: GALLERY.ADD_FILE,
            payload: file
        });
    }
}

/**
 * Selects a file.
 *
 * @param number file.id - The file id.
 */
export function selectFile(id) {
    return (dispatch, getState) => {
        return dispatch ({
            type: GALLERY.SELECT_FILE,
            payload: {
                id
            }
        });
    }
}

/**
 * Starts editing the given file or stops editing if false is given.
 *
 * @param object|boolean file - The file to edit.
 */
export function setEditing(file) {
	return (dispatch, getState) => {
		return dispatch ({
			type: GALLERY.SET_EDITING,
			payload: file
		});
	}
}

/**
 * Sets the focus state of a file.
 *
 * @param number|boolean id - the id of the file to focus on, or false.
 */
export function setFocus(id) {
    return (dispatch, getState) => {
		return dispatch ({
			type: GALLERY.SET_FOCUS,
			payload: {
                id
            }
		});
	}
}

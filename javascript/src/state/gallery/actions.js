import { GALLERY } from '../action-types';

/**
 * Adds a file to state
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
 * Selects a file
 *
 * @param object file
 * @param number file.id - The file id.
 */
export function selectFile(file) {
    return (dispatch, getState) => {
        return dispatch ({
            type: GALLERY.SELECT_FILE,
            payload: file
        });
    }
}

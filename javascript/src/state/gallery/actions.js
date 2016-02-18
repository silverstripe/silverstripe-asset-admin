import { GALLERY } from '../action-types';

/**
 * Adds files to state.
 *
 * @param array files - Array of file objects.
 * @param number [count] - The number of files in the current view.
 */
export function addFiles(files, count) {
    return (dispatch, getState) => {
        return dispatch ({
            type: GALLERY.ADD_FILES,
            payload: { files, count }
        });
    }
}

/**
 * Removes files from the state. If no param is passed all files are removed
 *
 * @param Array id - Array of file ids.
 */
export function removeFiles(ids) {
    return (dispatch, getState) => {
        return dispatch ({
            type: GALLERY.REMOVE_FILES,
            payload: { ids }
        });
    }
}

/**
 * Updates a file with new data.
 *
 * @param number id - The id of the file to update.
 * @param object updates - The new values.
 */
export function updateFile(id, updates) {
    return (dispatch, getState) => {
        return dispatch({
            type: GALLERY.UPDATE_FILE,
            payload: { id, updates }
        });
    }
}

/**
 * Selects files. If no param is passed all files are selected.
 *
 * @param Array ids - Array of file ids to select.
 */
export function selectFiles(ids = null) {
    return (dispatch, getState) => {
        return dispatch({
            type: GALLERY.SELECT_FILES,
            payload: { ids }
        });
    }
}

/**
 * Deselects files. If no param is passed all files are deselected.
 *
 * @param Array ids - Array of file ids to deselect.
 */
export function deselectFiles(ids = null) {
    return (dispatch, getState) => {
        return dispatch({
            type: GALLERY.DESELECT_FILES,
            payload: { ids }
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
        return dispatch({
            type: GALLERY.SET_EDITING,
            payload: { file }
        });
    }
}

/**
 * Sets the state of the fields for the editor component.
 *
 * @param object editorFields - the current fields in the editor component
 */
export function setEditorFields(editorFields = []) {
    return (dispatch, getState) => {
		return dispatch ({
			type: GALLERY.SET_EDITOR_FIELDS,
			payload: { editorFields }
		});
	}
}

/**
 * Update the value of the given field.
 *
 * @param object updates - The values to update the editor field with.
 * @param string updates.name - The editor field name.
 * @param string updates.value - The new value of the field.
 * @param string [updates.label] - The field label.
 */
export function updateEditorField(updates) {
    return (dispatch, getState) => {
		return dispatch ({
			type: GALLERY.UPDATE_EDITOR_FIELD,
			payload: { updates }
		});
	}
}

/**
 * Sorts files in some order.
 *
 * @param func comparator - Used to determine the sort order.
 */
export function sortFiles(comparator) {
    return (dispatch, getState) => {
        return dispatch({
            type: GALLERY.SORT_FILES,
            payload: { comparator }
        });
    }
}

import { GALLERY } from '../action-types';

/**
 * Adds a file to state.
 *
 * @param object|array file - File object or array of file objects.
 * @param number [count] - The number of files in the current view.
 */
export function addFile(file, count) {
    return (dispatch, getState) => {
        return dispatch ({
            type: GALLERY.ADD_FILE,
            payload: { file, count }
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
 * Selects a file or files. If no param is passed all files are selected.
 *
 * @param number|array ids - File id or array of file ids to select.
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
 * Deselects a file or files. If no param is passed all files are deselected.
 *
 * @param number|array ids - File id or array of file ids to deselect.
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
 * Sets the focus state of a file.
 *
 * @param number|boolean id - the id of the file to focus on, or false.
 */
export function setFocus(id) {
    return (dispatch, getState) => {
        return dispatch({
            type: GALLERY.SET_FOCUS,
            payload: {
                id
            }
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

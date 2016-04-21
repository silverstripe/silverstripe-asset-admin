import EDITOR from './EditorActionTypes';

/**
 * Sets the state of the fields for the editor component.
 *
 * @param object editorFields - the current fields in the editor component
 */
export function setEditorFields(editorFields = []) {
  return (dispatch) =>
    dispatch({
      type: EDITOR.SET_EDITOR_FIELDS,
      payload: { editorFields },
    });
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
  return (dispatch) =>
    dispatch({
      type: EDITOR.UPDATE_EDITOR_FIELD,
      payload: { updates },
    });
}

/**
 * Load the editing view for a given file
 * Used by AssetAdmin
 * @todo Refactor so that AssetAdmin has its own actions
 */
export function show(folderID, fileID, file) {
  return (dispatch) => {
    dispatch({
      type: EDITOR.SET_OPEN_FILE,
      payload: { folderID, fileID, file },
    });
  };
}

/**
 * Hide the editor
 */
export function hide() {
  return (dispatch) => {
    dispatch({
      type: EDITOR.HIDE,
    });
  };
}

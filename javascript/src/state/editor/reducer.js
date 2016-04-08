import deepFreeze from 'deep-freeze';
import EDITOR from './action-types';

const initialState = {
  visible: false,
  editing: null, // The file being edited
  editorFields: [], // The input fields for editing files. Hardcoded until form field schema is implemented.
  folderID: -1,
  fileID: -1,
};

/**
 * Reducer for the `assetAdmin.gallery` state key.
 *
 * @param object state
 * @param object action - The dispatched action.
 * @param string action.type - Name of the dispatched action.
 * @param object [action.payload] - Optional data passed with the action.
 */
export default function editorReducer(state = initialState, action) {
  switch (action.type) {

    case EDITOR.SET_EDITOR_FIELDS: {
      return deepFreeze(Object.assign({}, state, {
        editorFields: action.payload.editorFields,
      }));
    }

    case EDITOR.UPDATE_EDITOR_FIELD: {
      return deepFreeze(Object.assign({}, state, {
        editorFields: state.editorFields.map(
          (field) => {
            if (field.name === action.payload.updates.name) {
              return Object.assign(field, { value: action.payload.updates.value });
            }
            return field;
          }
        ),
      }));
    }

    case EDITOR.SET_OPEN_FILE:
      return deepFreeze(Object.assign({}, state, {
        visible: true,
        folderID: parseInt(action.payload.folderID, 10),
        fileID: parseInt(action.payload.fileID, 10),
        editing: action.payload.file,
      }));

    case EDITOR.HIDE:
      return deepFreeze(Object.assign({}, state, {
        visible: false,
      }));

    default:
      return state;
  }
}

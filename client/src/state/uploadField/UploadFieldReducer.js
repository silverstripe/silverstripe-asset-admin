import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './UploadFieldActionTypes';
import fileStructure from 'lib/fileStructure';

/**
 * Initial base state
 * @type {{fields: {}}}
 */
const initialState = {
  fields: {},
};

/**
 * Default object for an empty field state
 * @type {{files: Array}}
 */
const initialFieldState = { files: [] };

function uploadFieldReducer(state = initialState, action) {
  /**
   * Helper to assist with manipulating the current field.
   *
   * @param {function} fieldReducer - Callback which will take
   * the current field information, and must return back an object
   * which reflects any properties on that field that should be changed.
   * @return {Object} - Updated state (frozen)
   */
  const reduceField = (fieldReducer) => {
    if (!action.payload.fieldId) {
      throw new Error('Invalid fieldId');
    }
    // Extract field field record, or prototype
    const field = state.fields[action.payload.fieldId]
      ? state.fields[action.payload.fieldId]
      : initialFieldState;

    // Merge result back into state
    return deepFreeze(Object.assign({}, state, {
      fields: Object.assign({}, state.fields, {
        [action.payload.fieldId]: Object.assign({}, field, fieldReducer(field)),
      }),
    }));
  };

  // Update state for this field
  switch (action.type) {
    case ACTION_TYPES.UPLOADFIELD_ADD_FILE:
      return reduceField((field) => ({
        files: [
          ...(field.files),
          Object.assign({}, fileStructure, action.payload.file),
        ],
      }));

    case ACTION_TYPES.UPLOADFIELD_SET_FILES:
      return reduceField(() => ({ files: action.payload.files }));

    case ACTION_TYPES.UPLOADFIELD_UPLOAD_FAILURE:
      // Add an error message to the failed file.
      return reduceField((field) => ({
        files: field.files.map((file) => {
          if (file.queuedId === action.payload.queuedId) {
            return Object.assign({}, file, {
              message: action.payload.message,
            });
          }
          return file;
        }),
      }));

    case ACTION_TYPES.UPLOADFIELD_REMOVE_FILE:
      return reduceField((field) => ({
        files: field.files.filter((file) => !(
          // Identify file either by queuedId or via record ID
          (action.payload.file.queuedId && (file.queuedId === action.payload.file.queuedId))
          || (action.payload.file.id && (file.id === action.payload.file.id))
        )),
      }));

    case ACTION_TYPES.UPLOADFIELD_UPLOAD_SUCCESS:
      return reduceField((field) => ({
        files: field.files.map((file) => {
          if (file.queuedId === action.payload.queuedId) {
            return Object.assign({}, file, action.payload.json);
          }
          return file;
        }),
      }));

    case ACTION_TYPES.UPLOADFIELD_UPDATE_QUEUED_FILE:
      return reduceField((field) => ({
        files: field.files.map((file) => {
          if (file.queuedId === action.payload.queuedId) {
            return Object.assign({}, file, action.payload.updates);
          }
          return file;
        }),
      }));

    default:
      return state;
  }
}

export default uploadFieldReducer;

import fileStructure from 'lib/fileStructure';
import getFieldReducer from 'lib/reduxFieldReducer';
import ACTION_TYPES from './UploadFieldActionTypes';

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
const initialFieldState = { formSchemaFilesHash: null, files: [] };

function uploadFieldReducer(state = initialState, action) {
  // Get field reducer
  const reduceField = getFieldReducer(state, action, initialFieldState);

  // Update state for this field
  switch (action.type) {
    case ACTION_TYPES.UPLOADFIELD_SET_FORM_SCHEMA_FILES_HASH:
      return reduceField(() => ({ formSchemaFilesHash: action.payload.hash }));

    case ACTION_TYPES.UPLOADFIELD_ADD_FILE:
      return reduceField((field) => {
        // don't re-add
        if (field.files.find(file => file.id === action.payload.file.id)) {
          return field;
        }
        return {
          ...field,
          files: [
            ...field.files,
            { ...fileStructure, ...action.payload.file },
          ],
        };
      });

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

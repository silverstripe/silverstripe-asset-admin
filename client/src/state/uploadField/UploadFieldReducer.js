import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './UploadFieldActionTypes';
import fileStructure from 'lib/fileStructure';

const initialState = {
  fields: {},
};

function uploadFieldReducer(state = initialState, action) {
  switch (action.type) {

    case ACTION_TYPES.FILEFIELD_ADD_FILE:
      return deepFreeze(Object.assign({}, state, {
        fields: Object.assign({}, state.fields, {
          [action.payload.fieldId]: [
            ...(state.fields[action.payload.fieldId] || []),
            Object.assign({}, fileStructure, action.payload.file),
          ],
        }),
      }));

    case ACTION_TYPES.FILEFIELD_SET_FILES:
      return deepFreeze(Object.assign({}, state, {
        fields: Object.assign({}, state.fields, {
          [action.payload.fieldId]: action.payload.files,
        }),
      }));

    case ACTION_TYPES.FILEFIELD_UPLOAD_FAILURE:
      // Add an error message to the failed file.
      return deepFreeze(Object.assign({}, state, {
        fields: Object.assign({}, state.fields, {
          [action.payload.fieldId]: (state.fields[action.payload.fieldId] || [])
            .map((file) => {
              if (file.queuedId === action.payload.queuedId) {
                return Object.assign({}, file, {
                  message: action.payload.message,
                });
              }
              return file;
            }),
        }),
      }));

    case ACTION_TYPES.FILEFIELD_REMOVE_FILE:
      return deepFreeze(Object.assign({}, state, {
        fields: Object.assign({}, state.fields, {
          [action.payload.fieldId]: (state.fields[action.payload.fieldId] || [])
            .filter((file) => !(
              // Identify file either by queuedId or via record ID
              (action.payload.file.queuedId && (file.queuedId === action.payload.file.queuedId))
              || (action.payload.file.id && (file.id === action.payload.file.id))
            )),
        }),
      }));

    case ACTION_TYPES.FILEFIELD_UPLOAD_SUCCESS:
      return deepFreeze(Object.assign({}, state, {
        fields: Object.assign({}, state.fields, {
          [action.payload.fieldId]: (state.fields[action.payload.fieldId] || [])
            .map((file) => {
              if (file.queuedId === action.payload.queuedId) {
                return Object.assign({}, file, action.payload.json);
              }
              return file;
            }),
        }),
      }));

    case ACTION_TYPES.FILEFIELD_UPDATE_QUEUED_FILE:
      return deepFreeze(Object.assign({}, state, {
        fields: Object.assign({}, state.fields, {
          [action.payload.fieldId]: (state.fields[action.payload.fieldId] || [])
            .map((file) => {
              if (file.queuedId === action.payload.queuedId) {
                return Object.assign({}, file, action.payload.updates);
              }
              return file;
            }),
        }),
      }));

    default:
      return state;
  }
}

export default uploadFieldReducer;

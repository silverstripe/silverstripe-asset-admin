import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './FileFieldActionTypes';

export function fileFactory() {
  return deepFreeze({
    attributes: {
      dimensions: {
        height: null,
        width: null,
      },
    },
    name: null,
    canDelete: false,
    canEdit: false,
    category: null,
    created: null,
    extension: null,
    filename: null,
    id: 0,
    lastUpdated: null,
    messages: null,
    owner: {
      id: 0,
      title: null,
    },
    parent: {
      filename: null,
      id: 0,
      title: null,
    },
    queuedId: null,
    size: null,
    title: null,
    type: null,
    url: null,
    xhr: null,
    progress: 0,
    uploaded: false, // Set to true if file is uploaded. False if existing / attached
  });
}

const initialState = {
  fields: {},
};

function fileFieldReducer(state = initialState, action) {
  switch (action.type) {

    case ACTION_TYPES.FILEFIELD_ADD_FILE:
      return deepFreeze(Object.assign({}, state, {
        fields: Object.assign({}, state.fields, {
          [action.payload.fieldId]: [
            ...(state.fields[action.payload.fieldId] || []),
            Object.assign({}, fileFactory(), action.payload.file),
          ],
        }),
      }));

    case ACTION_TYPES.FILEFIELD_SET_FILES:
      return deepFreeze(Object.assign({}, state, {
        fields: Object.assign({}, state.fields, {
          [action.payload.fieldId]: action.payload.files,
        }),
      }));

    case ACTION_TYPES.FILEFIELD_FAIL_UPLOAD:
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

    case ACTION_TYPES.FILEFIELD_SUCCEED_UPLOAD:
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

export default fileFieldReducer;

import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './QueuedFilesActionTypes';
import i18n from 'i18n';

function fileFactory() {
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
    queuedAtTime: null,
    size: null,
    title: null,
    type: null,
    url: null,
    xhr: null,
  });
}

const initialState = {
  items: [],
};

function queuedFilesReducer(state = initialState, action) {
  switch (action.type) {

    case ACTION_TYPES.ADD_QUEUED_FILE:
      return deepFreeze(Object.assign({}, state, {
        items: state.items.concat([Object.assign({}, fileFactory(), action.payload.file)]),
      }));

    case ACTION_TYPES.FAIL_UPLOAD:
      // Add an error message to the failed file.
      return deepFreeze(Object.assign({}, state, {
        items: state.items.map((file) => {
          if (file.queuedAtTime === action.payload.queuedAtTime) {
            return Object.assign({}, file, {
              messages: [{
                value: i18n._t('AssetGalleryField.DROPZONE_FAILED_UPLOAD'),
                type: 'error',
                extraClass: 'error',
              }],
            });
          }

          return file;
        }),
      }));

    case ACTION_TYPES.PURGE_UPLOAD_QUEUE:
      // Failed uploads are removed.
      // Successful file uploads removed.
      // Pending uploads are ignored.
      return deepFreeze(Object.assign({}, state, {
        items: state.items.filter((file) => {
          if (Array.isArray(file.messages)) {
            // If any of the file's messages are of type 'error' or 'success' then return false.
            return !file.messages.filter(message => message.type === 'error' || message.type === 'success').length > 0;
          }

          return true;
        }),
      }));

    case ACTION_TYPES.REMOVE_QUEUED_FILE:
      return deepFreeze(Object.assign({}, state, {
        items: state.items.filter(
          (file) => file.queuedAtTime !== action.payload.queuedAtTime
        ),
      }));

    case ACTION_TYPES.SUCCEED_UPLOAD:
      return deepFreeze(Object.assign({}, state, {
        items: state.items.map((file) => {
          if (file.queuedAtTime === action.payload.queuedAtTime) {
            return Object.assign({}, file, {
              messages: [{
                value: i18n._t('AssetGalleryField.DROPZONE_SUCCESS_UPLOAD'),
                type: 'success',
                extraClass: 'success',
              }],
            });
          }

          return file;
        }),
      }));

    case ACTION_TYPES.UPDATE_QUEUED_FILE:
      return deepFreeze(Object.assign({}, state, {
        items: state.items.map((file) => {
          if (file.queuedAtTime === action.payload.queuedAtTime) {
            return Object.assign({}, file, action.payload.updates);
          }

          return file;
        }),
      }));

    default:
      return state;
  }
}

export default queuedFilesReducer;

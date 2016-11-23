import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './QueuedFilesActionTypes';
import fileStructure from 'lib/FileStructure';
import i18n from 'i18n';

const initialState = {
  items: [],
};

function queuedFilesReducer(state = initialState, action) {
  switch (action.type) {

    case ACTION_TYPES.ADD_QUEUED_FILE:
      return deepFreeze(Object.assign({}, state, {
        items: state.items.concat([Object.assign({}, fileStructure, action.payload.file)]),
      }));

    case ACTION_TYPES.FAIL_UPLOAD:
      // Add an error message to the failed file.
      return deepFreeze(Object.assign({}, state, {
        items: state.items.map((file) => {
          if (file.queuedId === action.payload.queuedId) {
            return Object.assign({}, file, {
              message: action.payload.message,
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
          if (file.message) {
            // If any of the file's messages are of type 'error' or 'success' then return false.
            return file.message.type !== 'error' && file.message.type !== 'success';
          }

          return true;
        }),
      }));

    case ACTION_TYPES.REMOVE_QUEUED_FILE:
      return deepFreeze(Object.assign({}, state, {
        items: state.items.filter(
          (file) => file.queuedId !== action.payload.queuedId
        ),
      }));

    case ACTION_TYPES.SUCCEED_UPLOAD:
      return deepFreeze(Object.assign({}, state, {
        items: state.items.map((file) => {
          if (file.queuedId === action.payload.queuedId) {
            return Object.assign({}, file, {
              messages: [{
                value: i18n._t('AssetAdmin.DROPZONE_SUCCESS_UPLOAD'),
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

export default queuedFilesReducer;

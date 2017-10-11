import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './QueuedFilesActionTypes';
import fileStructure from 'lib/fileStructure';
import i18n from 'i18n';

const initialState = {
  items: [],
};

function queuedFilesReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_QUEUED_FILE:
      return deepFreeze({
        ...state,
        items: [
          ...state.items,
          {
            ...fileStructure,
            ...action.payload.file,
          },
        ],
      });

    case ACTION_TYPES.FAIL_UPLOAD:
      // Add an error message to the failed file.
      return deepFreeze({
        ...state,
        items: state.items.map((file) => {
          if (file.queuedId === action.payload.queuedId) {
            return {
              ...file,
              message: action.payload.message,
            };
          }

          return file;
        }),
      });

    case ACTION_TYPES.PURGE_UPLOAD_QUEUE:
      // Successful file uploads removed.
      // Pending and failed uploads are retained.
      return deepFreeze({
        ...state,
        items: state.items.filter((file) => !file.id),
      });

    case ACTION_TYPES.REMOVE_QUEUED_FILE:
      return deepFreeze({
        ...state,
        items: state.items.filter(
          (file) => file.queuedId !== action.payload.queuedId
        ),
      });

    case ACTION_TYPES.SUCCEED_UPLOAD:
      return deepFreeze({
        ...state,
        items: state.items.map((file) => {
          if (file.queuedId === action.payload.queuedId) {
            return {
              ...file,
              ...action.payload.json,
              messages: [{
                value: i18n._t('AssetAdmin.DROPZONE_SUCCESS_UPLOAD'),
                type: 'success',
                extraClass: 'success',
              }],
            };
          }
          return file;
        }),
      });

    case ACTION_TYPES.UPDATE_QUEUED_FILE:
      return deepFreeze({
        ...state,
        items: state.items.map((file) => {
          if (file.queuedId === action.payload.queuedId) {
            return {
              ...file,
              ...action.payload.updates,
            };
          }

          return file;
        }),
      });

    default:
      return state;
  }
}

export default queuedFilesReducer;

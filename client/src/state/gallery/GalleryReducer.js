import deepFreeze from 'deep-freeze-strict';
import GALLERY from './GalleryActionTypes';

const initialState = {
  selectedFiles: [],
  errorMessage: null,
  enableDropzone: true,
  badges: [],
};

/**
 * Reducer for the `assetAdmin.gallery` state key.
 *
 * @param {object} state
 * @param {string} type - Name of the dispatched action.
 * @param {object} payload - Optional data passed with the action.
 */
export default function galleryReducer(state = initialState, { type, payload } = {}) {
  switch (type) {

    case GALLERY.SET_FILE_BADGE: {
      return {
        ...state,
        badges: state.badges
          .filter((badge) => badge.id !== payload.id)
          .concat([payload]),
      };
    }

    case GALLERY.CLEAR_FILE_BADGE: {
      return {
        ...state,
        badges: state.badges
          .filter((badge) => badge.id !== payload.id),
      };
    }

    case GALLERY.SET_ENABLE_DROPZONE: {
      return {
        ...state,
        enableDropzone: payload.enableDropzone,
      };
    }

    case GALLERY.SET_NOTICE_MESSAGE: {
      return {
        ...state,
        noticeMessage: payload.message,
      };
    }

    case GALLERY.SET_ERROR_MESSAGE: {
      return {
        ...state,
        errorMessage: payload.message,
      };
    }

    case GALLERY.LOAD_FILE_SUCCESS: {
      const oldFile = state.files.find(file => file.id === payload.id);
      if (oldFile) {
        const updatedFile = {
          ...oldFile,
          ...payload.file,
        };

        return deepFreeze({
          ...state,
          files: state.files.map(
            file => (file.id === updatedFile.id ? updatedFile : file)
          ),
        });
      } else if (state.folder.id === payload.id) {
        return deepFreeze({
          ...state,
          folder: {
            ...state.folder,
            ...payload.file,
          },
        });
      }
      return state;
    }

    case GALLERY.SELECT_FILES: {
      let selectedFiles = null;

      if (payload.ids === null) {
        // No param was passed, so select everything.
        selectedFiles = state.files.map(file => file.id);
      } else {
        // We're dealing with an array if ids to select.
        selectedFiles = state.selectedFiles.concat(
          payload.ids.filter(id => state.selectedFiles.indexOf(id) === -1)
        );
      }

      return deepFreeze({
        ...state,
        selectedFiles,
      });
    }

    case GALLERY.DESELECT_FILES: {
      let selectedFiles = null;
      if (payload.ids === null) {
        // No param was passed, deselect everything.
        selectedFiles = [];
      } else {
        // We're dealing with an array of ids to deselect.
        selectedFiles = state.selectedFiles
          .filter(id => payload.ids.indexOf(id) === -1);
      }

      return deepFreeze({
        ...state,
        selectedFiles,
      });
    }

    default:
      return state;
  }
}

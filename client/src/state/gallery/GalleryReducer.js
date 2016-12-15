import deepFreeze from 'deep-freeze-strict';
import GALLERY from './GalleryActionTypes';

const initialState = {
  editorFields: [], // The input fields for editing files. Hardcoded until form field schema is implemented.
  file: null,
  files: [],
  focus: false,
  path: null, // The current location path the app is on
  selectedFiles: [],
  page: 0,
  errorMessage: null,
};

/**
 * Reducer for the `assetAdmin.gallery` state key.
 *
 * @param object state
 * @param object action - The dispatched action.
 * @param string action.type - Name of the dispatched action.
 * @param object [action.payload] - Optional data passed with the action.
 */
export default function galleryReducer(state = initialState, action) {
  switch (action.type) {

    case GALLERY.LOAD_FILE_SUCCESS: {
      const oldFile = state.files.find(file => file.id === action.payload.id);
      if (oldFile) {
        const updatedFile = Object.assign({}, oldFile, action.payload.file);

        return deepFreeze(Object.assign({}, state, {
          files: state.files.map(
            file => (file.id === updatedFile.id ? updatedFile : file)
          ),
        }));
      } else if (state.folder.id === action.payload.id) {
        return deepFreeze(Object.assign({}, state, {
          folder: Object.assign({}, state.folder, action.payload.file),
        }));
      }
      return state;
    }

    case GALLERY.SELECT_FILES: {
      let selectedFiles = null;

      if (action.payload.ids === null) {
        // No param was passed, so select everything.
        selectedFiles = state.files.map(file => file.id);
      } else {
        // We're dealing with an array if ids to select.
        selectedFiles = state.selectedFiles.concat(
          action.payload.ids.filter(id => state.selectedFiles.indexOf(id) === -1)
        );
      }

      return deepFreeze(Object.assign({}, state, {
        selectedFiles,
      }));
    }

    case GALLERY.DESELECT_FILES: {
      let selectedFiles = null;
      if (action.payload.ids === null) {
        // No param was passed, deselect everything.
        selectedFiles = [];
      } else {
        // We're dealing with an array of ids to deselect.
        selectedFiles = state.selectedFiles
          .filter(id => action.payload.ids.indexOf(id) === -1);
      }

      return deepFreeze(Object.assign({}, state, {
        selectedFiles,
      }));
    }

    default:
      return state;
  }
}

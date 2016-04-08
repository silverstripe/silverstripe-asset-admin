import deepFreeze from 'deep-freeze';
import GALLERY from './action-types';
import CONSTANTS from 'constants/index';

const initialState = {
  bulkActions: {
    placeholder: CONSTANTS.BULK_ACTIONS_PLACEHOLDER,
    options: CONSTANTS.BULK_ACTIONS,
  },
  count: 0, // The number of files in the current view
  editing: null, // The file being edited
  editorFields: [], // The input fields for editing files. Hardcoded until form field schema is implemented.
  files: [],
  folderID: -1,
  focus: false,
  parentFolderID: null,
  path: null, // The current location path the app is on
  selectedFiles: [],
  viewingFolder: false,
  page: 0,
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
  let nextState;

  switch (action.type) {

    case GALLERY.SHOW:
      return deepFreeze(Object.assign({}, state, {
        visible: true,
        fileID: null,
        folderID: parseInt(action.payload.folderID, 10),
      }));

    case GALLERY.HIDE:
      return deepFreeze(Object.assign({}, state, {
        visible: false,
      }));


    case GALLERY.ADD_FILES: {
      const nextFilesState = []; // Clone the state.files array

      action.payload.files.forEach(payloadFile => {
        let fileInState = false;

        state.files.forEach(stateFile => {
          // Check if each file given is already in the state
          if (stateFile.id === payloadFile.id) {
            fileInState = true;
          }
        });

        // Only add the file if it isn't already in the state
        if (!fileInState) {
          nextFilesState.push(payloadFile);
        }
      });

      return deepFreeze(Object.assign({}, state, {
        count: typeof action.payload.count !== 'undefined' ? action.payload.count : state.count,
        files: nextFilesState.concat(state.files),
      }));
    }

    case GALLERY.REMOVE_FILES: {
      if (typeof action.payload.ids === 'undefined') {
        // No param was passed, remove everything.
        nextState = deepFreeze(Object.assign({}, state, { count: 0, files: [] }));
      } else {
        // We're dealing with an array of ids
        nextState = deepFreeze(Object.assign({}, state, {
          count: state.files.filter(file => action.payload.ids.indexOf(file.id) === -1).length,
          files: state.files.filter(file => action.payload.ids.indexOf(file.id) === -1),
        }));
      }

      return nextState;
    }

    case GALLERY.UPDATE_FILE: {
      const fileIndex = state.files.map(file => file.id).indexOf(action.payload.id);
      const updatedFile = Object.assign({}, state.files[fileIndex], action.payload.updates);

      return deepFreeze(Object.assign({}, state, {
        files: state.files.map(
          file => (file.id === updatedFile.id ? updatedFile : file)
        ),
      }));
    }

    case GALLERY.SELECT_FILES: {
      if (action.payload.ids === null) {
        // No param was passed, add everything that isn't currently selected, to the selectedFiles array.
        nextState = deepFreeze(Object.assign({}, state, {
          selectedFiles: state.selectedFiles
            .concat(
              state.files.map(file => file.id).filter(id => state.selectedFiles.indexOf(id) === -1)
            ),
        }));
      } else {
        // We're dealing with an array if ids to select.
        nextState = deepFreeze(Object.assign({}, state, {
          selectedFiles: state.selectedFiles
            .concat(
              action.payload.ids.filter(id => state.selectedFiles.indexOf(id) === -1)
            ),
        }));
      }

      return nextState;
    }

    case GALLERY.DESELECT_FILES: {
      if (action.payload.ids === null) {
        // No param was passed, deselect everything.
        nextState = deepFreeze(Object.assign({}, state, { selectedFiles: [] }));
      } else {
        // We're dealing with an array of ids to deselect.
        nextState = deepFreeze(Object.assign({}, state, {
          selectedFiles: state.selectedFiles.filter(id => action.payload.ids.indexOf(id) === -1),
        }));
      }

      return nextState;
    }

    // De-select and remove the files listed in payload.ids
    case GALLERY.DELETE_ITEM_SUCCESS: {
      return deepFreeze(Object.assign({}, state, {
        selectedFiles: state.selectedFiles.filter(id => action.payload.ids.indexOf(id) === -1),
        files: state.files.filter(file => action.payload.ids.indexOf(file.id) === -1),
        count: state.files.filter(file => action.payload.ids.indexOf(file.id) === -1).length,
      }));
    }

    case GALLERY.SORT_FILES: {
      const folders = state.files.filter(file => file.type === 'folder');
      const files = state.files.filter(file => file.type !== 'folder');

      return deepFreeze(Object.assign({}, state, {
        files: folders.sort(action.payload.comparator).concat(files.sort(action.payload.comparator)),
      }));
    }

    case GALLERY.LOAD_FOLDER_REQUEST: {
      return deepFreeze(Object.assign({}, state, {
        // Mark "loaded" at the start of the request to avoid infinite loop of load events
        loadedFolderID: action.payload.folderID,
        folderID: action.payload.folderID,
        viewingFolder: action.payload.viewingFolder,
        selectedFiles: [],
        files: [],
        count: 0,
      }));
    }

    case GALLERY.LOAD_FOLDER_SUCCESS: {
      return deepFreeze(Object.assign({}, state, {
        parentFolderID: action.payload.parentFolderID,
        files: action.payload.files,
        count: action.payload.files.length,
      }));
    }

    case GALLERY.ADD_FOLDER_REQUEST:
      return state;

    case GALLERY.ADD_FOLDER_FAILURE:
      return state;

    case GALLERY.ADD_FOLDER_SUCCESS:
      return state;

    default:
      return state;
  }
}

import deepFreeze from 'deep-freeze';
import { GALLERY } from '../action-types';
import CONSTANTS from '../../constants.js';

const initialState = {
    files: [],
    selectedFiles: [],
    editing: false,
    focus: false,
    bulkActions: {
        placeholder: CONSTANTS.BULK_ACTIONS_PLACEHOLDER,
        options: CONSTANTS.BULK_ACTIONS
    }
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
        case GALLERY.ADD_FILE:
            return Object.assign({}, state, {
                files: state.files.concat(action.payload)
            });
        case GALLERY.SELECT_FILE:
            var newSelectedFiles = [],
                fileIndex = state.selectedFiles.indexOf(action.payload.id);

            // Add the file if it doesn't exist, otherwise remove it.
            if (fileIndex > -1) {
                newSelectedFiles = state.selectedFiles.filter((id) => id !== action.payload.id);
            } else {
                newSelectedFiles = state.selectedFiles.concat(action.payload.id);
            }

            return Object.assign({}, state, {
                selectedFiles: newSelectedFiles
            });
        case GALLERY.SET_EDITING:
			return Object.assign({}, state, {
				editing: action.payload
			});
        case GALLERY.SET_FOCUS:
            return Object.assign({}, state, {
                focus: action.payload.id
            });
        default:
            return state;
    }
}

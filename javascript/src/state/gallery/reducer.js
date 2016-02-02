import deepFreeze from 'deep-freeze';
import { GALLERY } from '../action-types';
import CONSTANTS from '../../constants.js';

const initialState = {
    count: 0, // The number of files in the current view
    editing: false,
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

    var nextState;

    switch (action.type) {
        case GALLERY.ADD_FILE:
            return deepFreeze(Object.assign({}, state, {
                count: action.payload.count !== 'undefined' ? action.payload.count : state.count,
                files: state.files.concat(action.payload.file)
            }));

        case GALLERY.UPDATE_FILE:
            let fileIndex = state.files.map(file => file.id).indexOf(action.payload.id);
            let updatedFile = Object.assign({}, state.files[fileIndex], action.payload.updates);

            return deepFreeze(Object.assign({}, state, {
                files: state.files.map(file => file.id === updatedFile.id ? updatedFile : file)
            }));

        case GALLERY.SELECT_FILES:
            if (action.payload.ids === null) {
                // No param was passed, add everything that isn't currently selected, to the selectedFiles array.
                nextState = deepFreeze(Object.assign({}, state, {
                    selectedFiles: state.selectedFiles.concat(state.files.map(file => file.id).filter(id => state.selectedFiles.indexOf(id) === -1))
                }));
            } else if (typeof action.payload.ids === 'number') {
                // We're dealing with a single id to select.
                // Add the file if it's not already selected.
                if (state.selectedFiles.indexOf(action.payload.ids) === -1) {
                    nextState = deepFreeze(Object.assign({}, state, {
                        selectedFiles: state.selectedFiles.concat(action.payload.ids)
                    }));
                } else {
                    // The file is already selected, so return the current state.
                    nextState = state;
                }
            } else {
                // We're dealing with an array if ids to select.
                nextState = deepFreeze(Object.assign({}, state, {
                    selectedFiles: state.selectedFiles.concat(action.payload.ids.filter(id => state.selectedFiles.indexOf(id) === -1))
                }));
            }

            return nextState;

        case GALLERY.DESELECT_FILES:
            if (action.payload.ids === null) {
                // No param was passed, deselect everything.
                nextState = deepFreeze(Object.assign({}, state, { selectedFiles: [] }));
            } else if (typeof action.payload.ids === 'number') {
                // We're dealing with a single id to deselect.
                let fileIndex = state.selectedFiles.indexOf(action.payload.ids);

                nextState = deepFreeze(Object.assign({}, state, {
                    selectedFiles: state.selectedFiles.slice(0, fileIndex).concat(state.selectedFiles.slice(fileIndex + 1))
                }));
            } else {
                // We're dealing with an array if ids to deselect.
                nextState = deepFreeze(Object.assign({}, state, {
                    selectedFiles: state.selectedFiles.filter(id => action.payload.ids.indexOf(id) === -1)
                }));
            }

            return nextState;

        case GALLERY.SET_EDITING:
            return deepFreeze(Object.assign({}, state, {
                editing: action.payload.file
            }));

        case GALLERY.SET_FOCUS:
            return deepFreeze(Object.assign({}, state, {
                focus: action.payload.id
            }));

        default:
            return state;
    }
}

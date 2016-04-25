import GALLERY from './GalleryActionTypes';

/**
 * Load the folder view for a given folder
 * Used by AssetAdmin.
 * @todo Refactor so that AssetAdmin has its own actions
 */
export function show(folderID) {
  return (dispatch) => {
    // Start message
    dispatch({
      type: GALLERY.SHOW,
      payload: { folderID },
    });
  };
}

/**
 * Hide the editor
 */
export function hide() {
  return (dispatch) => {
    dispatch({
      type: GALLERY.HIDE,
    });
  };
}

/**
 * Adds files to state.
 *
 * @param array files - Array of file objects.
 * @param number [count] - The number of files in the current view.
 */
export function addFiles(files, count) {
  // TODO: Refactor this away - will be part of "load folder" and "search" actions
  return (dispatch) =>
    dispatch({
      type: GALLERY.ADD_FILES,
      payload: { files, count },
    });
}

/**
 * Removes files from the state. If no param is passed all files are removed
 *
 * @param array ids - Array of file ids.
 */
export function removeFiles(ids) {
  // TODO: Refactor this away - will be part of "load folder", "search", and "delete files" actions
  return (dispatch) => {
    dispatch({
      type: GALLERY.REMOVE_FILES,
      payload: { ids },
    });
  };
}

/**
 * Deletes a number of items
 */
export function deleteItems(deleteApi, ids) {
  return (dispatch) => {
    dispatch({
      type: GALLERY.DELETE_ITEM_REQUEST,
      payload: { ids },
    });

    return deleteApi({ ids })
    .then((json) => {
      dispatch({
        type: GALLERY.DELETE_ITEM_SUCCESS,
        payload: { ids },
      });

      return json;
    })
    .catch((error) => {
      // Failure finish message
      dispatch({
        type: GALLERY.DELETE_ITEM_FAILURE,
        payload: { error },
      });
    });
  };
}

/**
 * Load the contents of a folder from the API
 */
export function loadFolderContents(filesByParentApi, folderID, limit, page) {
  return (dispatch) => {
    dispatch({
      type: GALLERY.LOAD_FOLDER_REQUEST,
      payload: { viewingFolder: (folderID > 0), folderID: parseInt(folderID, 10) },
    });

    return filesByParentApi({ id: folderID, limit, page })
    .then((data) => {
      dispatch({
        type: GALLERY.LOAD_FOLDER_SUCCESS,
        payload: { folderID: parseInt(folderID, 10), parentFolderID: data.parent, files: data.files },
      });
    });
  };
}

/**
 * Updates a file with new data.
 *
 * @param number id - The id of the file to update.
 * @param object updates - The new values.
 */
export function updateFile(id, updates) {
  return (dispatch) =>
    dispatch({
      type: GALLERY.UPDATE_FILE,
      payload: { id, updates },
    });
}

/**
 * Selects files. If no param is passed all files are selected.
 *
 * @param Array ids - Array of file ids to select.
 */
export function selectFiles(ids = null) {
  return (dispatch) =>
    dispatch({
      type: GALLERY.SELECT_FILES,
      payload: { ids },
    });
}

/**
 * Deselects files. If no param is passed all files are deselected.
 *
 * @param Array ids - Array of file ids to deselect.
 */
export function deselectFiles(ids = null) {
  return (dispatch) =>
    dispatch({
      type: GALLERY.DESELECT_FILES,
      payload: { ids },
    });
}

/**
 * Sorts files in some order.
 *
 * @param func comparator - Used to determine the sort order.
 */
export function sortFiles(comparator) {
  return (dispatch) =>
    dispatch({
      type: GALLERY.SORT_FILES,
      payload: { comparator },
    });
}

/**
 * Create a new folder as a sub-folder of the current and open it for viewing.
 * Triggers an asyncrhonous back-end requests and changes view after the request
 * has completed.
 *
 * @param string folderName
 * @param number [count] - The number of files in the current view.
 */
export function addFolder(addFolderApi, folderID, folderName) {
  return (dispatch) => {
    // Start message
    dispatch({
      type: GALLERY.ADD_FOLDER_REQUEST,
      payload: { folderName },
    });

    return addFolderApi({ folderID: isNaN(folderID) ? 0 : folderID, folderName })
    .then(json => {
      dispatch({
        type: GALLERY.ADD_FOLDER_SUCCESS,
        payload: { folderName },
      });

      dispatch({
        type: GALLERY.SHOW,
        payload: { folderID: json.folderID },
      });

      // Trigger the open-folder-view action
      (show(parseInt(json.folderID, 10)))(dispatch);

      // TODO: Fix this so that the subsequent action is passed without a coupling to router
      // here.
      //  - Successful action should triggers 'show files' view rather than triggering an action
      // showFilesFromFolder(json.folderID);
    })
    .catch((err) => {
      // Failure finish message
      dispatch({
        type: GALLERY.ADD_FOLDER_FAILURE,
        payload: { error: `Couldn\'t create ${folderName}: ${err}` },
      });
    });
  };
}

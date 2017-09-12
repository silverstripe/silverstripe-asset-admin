import ACTION_TYPES from './UploadFieldActionTypes';

/**
 * Adds a file which has not been persisted to the server yet.
 *
 * @param {String} fieldId Identifier of UploadField
 * @param {Object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
 */
export function addFile(fieldId, file) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.UPLOADFIELD_ADD_FILE,
      payload: { fieldId, file },
    });
}

/**
 * Initialise all values for the given field with the list of files
 *
 * @param {String} fieldId - Identifier of UploadField
 * @param {Array} files - List of files to assign
 */
export function setFiles(fieldId, files) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.UPLOADFIELD_SET_FILES,
      payload: { fieldId, files },
    });
}

/**
 * Updates a queued file if it fails to upload.
 *
 * @param {String} fieldId - Identifier of UploadField
 * @param {String} queuedId - Temporary id assigned when this file was queued
 */
export function failUpload(fieldId, queuedId, response) {
  return (dispatch) => {
    let message = response.message;

    // if we're given a string, then use it as the error message
    if (typeof response === 'string') {
      message = {
        value: response,
        type: 'error',
      };
    }
    return dispatch({
      type: ACTION_TYPES.UPLOADFIELD_UPLOAD_FAILURE,
      payload: { fieldId, queuedId, message },
    });
  };
}

/**
 * Removes a file from the queue.
 *
 * @param {string} fieldId - Identifier of UploadField
 * @param {object} file - File record to remove. Will have either an id or queuedId to identify
 * this file
 */
export function removeFile(fieldId, file) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.UPLOADFIELD_REMOVE_FILE,
      payload: { fieldId, file },
    });
}

/**
 * Updates a queued file when it successfully uploads.
 *
 * @param {String} fieldId - Identifier of UploadField
 * @param {String} queuedId - Temporary id assigned when this file was queued
 * @param {Object} json - json encoded data for object sent from server
 */
export function succeedUpload(fieldId, queuedId, json) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.UPLOADFIELD_UPLOAD_SUCCESS,
      payload: { fieldId, queuedId, json },
    });
}

/**
 * Override the values of a currently queued file.
 *
 * @param {String} fieldId - Identifier of UploadField
 * @param {String} queuedId - Temporary id assigned when this file was queued
 * @param {Object} updates - The values to update.
 */
export function updateQueuedFile(fieldId, queuedId, updates) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.UPLOADFIELD_UPDATE_QUEUED_FILE,
      payload: { fieldId, queuedId, updates },
    });
}

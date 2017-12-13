import ACTION_TYPES from './QueuedFilesActionTypes';

/**
 * Adds a file which has not been persisted to the server yet.
 *
 * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
 */
export function addQueuedFile(file) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.ADD_QUEUED_FILE,
      payload: { file },
    });
}

/**
 * Updates a queued file if it fails to upload.
 *
 * @param {String} queuedId - Temporary id assigned when this file was queued
 */
export function failUpload(queuedId, response) {
  return (dispatch) => {
    let message = response.message;
    if (response.errors && response.errors.length) {
      message = response.errors[0];
    }

    // if we're given a string, then use it as the error message
    if (typeof response === 'string') {
      message = {
        value: response,
        type: 'error',
      };
    }
    return dispatch({
      type: ACTION_TYPES.FAIL_UPLOAD,
      payload: {
        queuedId,
        message,
      },
    });
  };
}

/**
 * Purges the upload queue.
 *   - Failed uploads are removed.
 *   - Successful uploads are removed.
 *   - Pending uploads are ignored.
 */
export function purgeUploadQueue() {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.PURGE_UPLOAD_QUEUE,
      payload: null,
    });
}

/**
 * Removes a file from the queue.
 *
 * @param {String} queuedId - Temporary id assigned when this file was queued
 */
export function removeQueuedFile(queuedId) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.REMOVE_QUEUED_FILE,
      payload: { queuedId },
    });
}

/**
 * Updates a queued file when it successfully uploads.
 *
 * @param {String} queuedId - Temporary id assigned when this file was queued
 */
export function succeedUpload(queuedId, json) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.SUCCEED_UPLOAD,
      payload: { queuedId, json },
    });
}

/**
 * Override the values of a currently queued file.
 *
 * @param {String} queuedId - Temporary id assigned when this file was queued
 * @param object updates - The values to update.
 */
export function updateQueuedFile(queuedId, updates) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.UPDATE_QUEUED_FILE,
      payload: { queuedId, updates },
    });
}

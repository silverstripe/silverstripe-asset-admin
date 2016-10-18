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
 * @param number queuedAtTime - Timestamp (Date.now()) when the file was queued.
 */
export function failUpload(queuedAtTime, response) {
  return (dispatch) => {
    let messages = response.messages;

    // if we're given a string, then use it as the error message
    if (typeof response === 'string') {
      messages = [{
        value: response,
        type: 'error',
      }];
    }
    return dispatch({
      type: ACTION_TYPES.FAIL_UPLOAD,
      payload: {
        queuedAtTime,
        messages,
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
 * @param number queuedAtTime - Timestamp (Date.now()) when the file was queued.
 */
export function removeQueuedFile(queuedAtTime) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.REMOVE_QUEUED_FILE,
      payload: { queuedAtTime },
    });
}

/**
 * Updates a queued file when it successfully uploads.
 *
 * @param number queuedAtTime - Timestamp (Date.now()) when the file was queued.
 */
export function succeedUpload(queuedAtTime) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.SUCCEED_UPLOAD,
      payload: { queuedAtTime },
    });
}

/**
 * Override the values of a currently queued file.
 *
 * @param number queuedAtTime - Timestamp (Date.now()) when the file was queued.
 * @param object updates - The values to update.
 */
export function updateQueuedFile(queuedAtTime, updates) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.UPDATE_QUEUED_FILE,
      payload: { queuedAtTime, updates },
    });
}

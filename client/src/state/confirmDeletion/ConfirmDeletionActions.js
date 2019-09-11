import ACTION_TYPES from './ConfirmDeletionActionTypes';

/**
 * Ask for permission to delete
 *
 * @param {Object[]} List of files we want to delete
 */
export function confirm(files) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.CONFIRM_DELETION_ASK,
      payload: { files },
    });
}

/**
 * Ask for permission to delete
 *
 * @param {Object[]} List of files we want to delete
 */
export function ok() {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.CONFIRM_DELETION_CONFIRM,
      payload: { },
    });
}

/**
 * Ask for permission to delete
 *
 * @param {Object[]} List of files we want to delete
 */
export function cancel() {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.CONFIRM_DELETION_CANCEL,
      payload: { },
    });
}

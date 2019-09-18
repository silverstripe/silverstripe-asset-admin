import ACTION_TYPES from './ConfirmDeletionActionTypes';

/**
 * Ask for permission to delete
 *
 * @param {Object[]} List of files we want to delete
 */
export function confirm(files) {
  return {
    type: ACTION_TYPES.CONFIRM_DELETION_ASK,
    payload: { files },
  };
}

/**
 * Ask for permission to delete
 *
 * @param {Object[]} List of files we want to delete
 */
export function deleting() {
  return {
    type: ACTION_TYPES.CONFIRM_DELETION_CONFIRM,
    payload: { },
  };
}

/**
 * Ask for permission to delete
 *
 * @param {Object[]} List of files we want to delete
 */
export function cancel() {
  return {
    type: ACTION_TYPES.CONFIRM_DELETION_CANCEL,
    payload: { },
  };
}

/**
 * Ask for permission to delete
 *
 * @param {Object[]} List of files we want to delete
 */
export function reset() {
  return {
    type: ACTION_TYPES.CONFIRM_DELETION_RESET,
    payload: { },
  };
}

/**
 * Ask for permission to delete
 *
 * @param {Object[]} List of files we want to delete
 */
export function modalClose() {
  return {
    type: ACTION_TYPES.CONFIRM_DELETION_MODAL_CLOSE,
    payload: { },
  };
}

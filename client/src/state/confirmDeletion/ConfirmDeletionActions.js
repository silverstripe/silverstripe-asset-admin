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
 * The GraphQL request for deleting files has started.
 *
 */
export function deleting() {
  return {
    type: ACTION_TYPES.CONFIRM_DELETION_CONFIRM,
    payload: { },
  };
}

/**
 * User has changed their mind and doesn't want to delete files any more.
 *
 */
export function cancel() {
  return {
    type: ACTION_TYPES.CONFIRM_DELETION_CANCEL,
    payload: { },
  };
}

/**
 * Deletion workflow was completed and we're returning to our regular state.
 *
 */
export function reset() {
  return {
    type: ACTION_TYPES.CONFIRM_DELETION_RESET,
    payload: { },
  };
}

/**
 * Modal has closed, we can stop rendering it.
 *
 */
export function modalClose() {
  return {
    type: ACTION_TYPES.CONFIRM_DELETION_MODAL_CLOSE,
    payload: { },
  };
}

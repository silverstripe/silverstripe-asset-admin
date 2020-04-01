/**
 * State value for ConfirmDeletion.transition when no transition is ongoing.
 */
export const NO_TRANSITION = false;

/**
 * State value for ConfirmDeletion.transition when the modal is being hidden
 * because the user has decided not to delete the files.
 */
export const CANCELING = 'canceling';

/**
 * State value for ConfirmDeletion.transition when the files are in the
 * process of being deleted and we're waiting for a response from the server.
 */
export const DELETING = 'deleting';

import ACTION_TYPES from './ConfirmDeletionActionTypes';
import * as TRANSITIONS from './ConfirmDeletionTransitions';

/**
 * Initial base state
 * @type { Object }
 */
export const initialState = {
  showConfirmation: false,
  files: [],
  transition: TRANSITIONS.NO_TRANSITION,
};

function confirmDeletionReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.CONFIRM_DELETION_ASK:
      return { ...initialState, showConfirmation: true, files: action.payload.files };

    case ACTION_TYPES.CONFIRM_DELETION_CANCEL:
      if (state.showConfirmation) {
        return { ...state, transition: TRANSITIONS.CANCELING };
      }
      break;

    case ACTION_TYPES.CONFIRM_DELETION_CONFIRM:
      if (state.showConfirmation) {
        return { ...state, transition: TRANSITIONS.DELETING };
      }
      break;

    case ACTION_TYPES.CONFIRM_DELETION_MODAL_CLOSE:
      return { ...state, showConfirmation: false, transition: TRANSITIONS.NO_TRANSITION };

    case ACTION_TYPES.CONFIRM_DELETION_RESET:
      return initialState;

    default:
  }

  return state;
}

export default confirmDeletionReducer;

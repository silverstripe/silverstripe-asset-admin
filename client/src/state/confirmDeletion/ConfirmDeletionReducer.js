import ACTION_TYPES from './ConfirmDeletionActionTypes';

/**
 * Initial base state
 * @type {{fields: {}}}
 */
export const initialState = {
  showConfirmation: false,
  files: [],
  transition: false,
};

function confirmDeletionReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.CONFIRM_DELETION_ASK:
      return { ...initialState, showConfirmation: true, files: action.payload.files };

    case ACTION_TYPES.CONFIRM_DELETION_CANCEL:
      if (state.showConfirmation) {
        return { ...state, transition: 'canceling' };
      }
      break;

    case ACTION_TYPES.CONFIRM_DELETION_CONFIRM:
      if (state.showConfirmation) {
        return { ...state, transition: 'deleting' };
      }
      break;

    case ACTION_TYPES.CONFIRM_DELETION_MODAL_CLOSE:
      return { ...state, showConfirmation: false, transition: false };

    case ACTION_TYPES.CONFIRM_DELETION_RESET:
      return initialState;

    default:
  }

  return state;
}

export default confirmDeletionReducer;

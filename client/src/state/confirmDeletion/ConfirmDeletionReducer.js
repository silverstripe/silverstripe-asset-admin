import ACTION_TYPES from './ConfirmDeletionActionTypes';

/**
 * Initial base state
 * @type {{fields: {}}}
 */
const initialState = {
  showConfirmation: false,
  files: [],
  transition: false,
};

function confirmDeletionReducer(state = initialState, action) {
  // Update state for this field
  switch (action.type) {
    case ACTION_TYPES.CONFIRM_DELETION_ASK:
      return {showConfirmation: true, files: action.payload.files};

    case ACTION_TYPES.CONFIRM_DELETION_CANCEL:
      return {...state, transition: 'canceling'};

    case ACTION_TYPES.CONFIRM_DELETION_CONFIRM:
      return {...state, transition: 'deleting'};

    case ACTION_TYPES.CONFIRM_DELETION_RESET:
      return state.transition === 'deleting' ?
        {...state, transition: false, showConfirmation: false} :
        initialState;

    default:
      return state;
  }
}

export default confirmDeletionReducer;

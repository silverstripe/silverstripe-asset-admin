import ACTION_TYPES from './ConfirmDeletionActionTypes';

/**
 * Initial base state
 * @type {{fields: {}}}
 */
const initialState = {
  showConfirmation: false,
  files: []
};

function confirmDeletionReducer(state = initialState, action) {
  // Update state for this field
  switch (action.type) {
    case ACTION_TYPES.CONFIRM_DELETION_ASK:
      return {showConfirmation: true, files: action.payload.files};
    case ACTION_TYPES.CONFIRM_DELETION_ASK:
    case ACTION_TYPES.CONFIRM_DELETION_ASK:
      return initialState;
    default:
      return state;
  }
}

export default confirmDeletionReducer;

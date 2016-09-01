import deepFreeze from 'deep-freeze-strict';
import EDITOR from './EditorActionTypes';

const initialState = {
  openAddCampaignModal: false,
};

/**
 * @param object state
 * @param object action - The dispatched action.
 * @param string action.type - Name of the dispatched action.
 * @param object [action.payload] - Optional data passed with the action.
 */
export default function editorReducer(state = initialState, action) {
  switch (action.type) {

    case EDITOR.UPDATE_ADDTOCAMPAIGN_MODAL: {
      return deepFreeze(Object.assign({}, state, {
        openAddCampaignModal: action.payload.show,
      }));
    }

    default:
      return state;
  }
}

import EDITOR from './EditorActionTypes';

export function updateAddToCampaignModal(show) {
  return (dispatch) =>
    dispatch({
      type: EDITOR.UPDATE_ADDTOCAMPAIGN_MODAL,
      payload: { show },
    });
}

import EDITOR from './EditorActionTypes';

export function updateAddToCampaignModal(show) {
  return (dispatch) =>
    dispatch({
      type: EDITOR.UPDATE_ADDTOCAMPAING_MODAL,
      payload: { show },
    });
}

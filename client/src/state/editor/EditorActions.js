import EDITOR from './EditorActionTypes';

/**
 * Update the form state.
 * @todo Replace with form state management library (e.g. redux-form)
 *
 * @param object updates - Key-value map of form state updates
 */
export function updateFormState(updates) {
  return (dispatch) =>
    dispatch({
      type: EDITOR.UPDATE_FORM_STATE,
      payload: { updates },
    });
}

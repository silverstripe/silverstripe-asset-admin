/* global jest, describe, it, expect */

jest.unmock('deep-freeze-strict');
jest.unmock('../EditorActionTypes.js');
jest.unmock('../EditorReducer.js');

import editorReducer from '../EditorReducer.js';
import EDITOR from '../EditorActionTypes.js';

describe('editorReducer', () => {
  describe('UPDATE_FORM_STATE', () => {
    it('should update existing form state', () => {
      const initialState = {
        formState: { fieldA: 'a' },
      };

      const nextState = editorReducer(initialState, {
        type: EDITOR.UPDATE_FORM_STATE,
        payload: { updates: { fieldA: 'aa', fieldB: 'b' } },
      });

      expect(JSON.stringify(nextState.formState))
        .toBe(JSON.stringify({ fieldA: 'aa', fieldB: 'b' }));
    });
  });
});

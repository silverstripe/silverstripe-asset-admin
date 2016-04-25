/* global jest, describe, it, expect */

jest.unmock('deep-freeze');
jest.unmock('../action-types.js');
jest.unmock('../reducer.js');

import editorReducer from '../reducer.js';
import EDITOR from '../action-types.js';

describe('editorReducer', () => {
  describe('SET_OPEN_FILE', () => {
    it('should start editing the given file', () => {
      const initialState = {
        editing: null,
      };

      const nextState = editorReducer(initialState, {
        type: EDITOR.SET_OPEN_FILE,
        payload: { file: { id: 1 } },
      });

      expect(JSON.stringify(nextState.editing)).toBe(JSON.stringify({ id: 1 }));
    });

    it('should stop editing', () => {
      const initialState = {
        editing: { id: 1 },
      };

      const nextState = editorReducer(initialState, {
        type: EDITOR.SET_OPEN_FILE,
        payload: { file: null },
      });

      expect(nextState.editing).toBe(null);
    });
  });

  describe('SET_EDITOR_FIELDS', () => {
    it('should set the state for the editor fields', () => {
      const initialState = {
        editorFields: [],
      };

      const nextState = editorReducer(initialState, {
        type: EDITOR.SET_EDITOR_FIELDS,
        payload: {
          editorFields: [{
            label: 'File name',
            name: 'filename',
            value: 'file1.jpg',
          }],
        },
      });

      expect(nextState.editorFields).toEqual([{
        label: 'File name',
        name: 'filename',
        value: 'file1.jpg',
      }]);
    });
  });

  describe('UPDATE_EDITOR_FIELD', () => {
    it('should update the value of the given field', () => {
      const initialState = {
        editorFields: [
          {
            label: 'Title',
            name: 'title',
            value: 'file1',
          },
          {
            label: 'File name',
            name: 'filename',
            value: 'file1.jpg',
          },
        ],
      };

      const nextState = editorReducer(initialState, {
        type: EDITOR.UPDATE_EDITOR_FIELD,
        payload: {
          updates: {
            name: 'filename',
            value: 'file2.jpg',
          },
        },
      });

      expect(nextState.editorFields).toEqual([
        {
          label: 'Title',
          name: 'title',
          value: 'file1',
        },
        {
          label: 'File name',
          name: 'filename',
          value: 'file2.jpg',
        },
      ]);
    });
  });
});

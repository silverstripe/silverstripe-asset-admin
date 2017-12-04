/* global jest, describe, it, expect, beforeEach, jasmine */

import previewFieldReducer from '../PreviewFieldReducer';
import ACTION_TYPES from '../PreviewFieldActionTypes';

describe('previewFieldReducer', () => {
  let id = null;
  let initialState = null;

  beforeEach(() => {
    id = 'MyPreview';
    initialState = {};
  });

  describe('PREVIEWFIELD_ADD_FILE', () => {
    it('should add the file to state', () => {
      const file = { id: 543 };
      const nextState = previewFieldReducer(initialState, {
        type: ACTION_TYPES.PREVIEWFIELD_ADD_FILE,
        payload: { id, file },
      });

      expect(nextState[id]).toBe(file);
    });
  });

  describe('PREVIEWFIELD_FAIL_UPLOAD', () => {
    it('should add the message to the existing file state', () => {
      const message = {
        message: {
          type: 'error',
          value: 'failed to upload',
        },
      };
      initialState[id] = { id: 543 };
      const nextState = previewFieldReducer(initialState, {
        type: ACTION_TYPES.PREVIEWFIELD_FAIL_UPLOAD,
        payload: { id, message },
      });

      expect(nextState[id].id).toBe(543);
      expect(nextState[id].message).toBe(message.message);
    });
  });

  describe('PREVIEWFIELD_REMOVE_FILE', () => {
    it('should remove the file state', () => {
      initialState[id] = { id: 321 };
      const nextState = previewFieldReducer(initialState, {
        type: ACTION_TYPES.PREVIEWFIELD_REMOVE_FILE,
        payload: { id },
      });

      expect(typeof nextState[id]).toBe('undefined');
    });
  });

  describe('PREVIEWFIELD_UPDATE_FILE', () => {
    it('should add the given data to the existing file state', () => {
      const data = {
        xhr: {},
        progress: 32,
      };
      initialState[id] = { id: 765 };
      const nextState = previewFieldReducer(initialState, {
        type: ACTION_TYPES.PREVIEWFIELD_UPDATE_FILE,
        payload: { id, data },
      });

      expect(nextState[id].id).toBe(765);
      expect(nextState[id].xhr).toBe(data.xhr);
      expect(nextState[id].progress).toBe(32);
    });
  });
});

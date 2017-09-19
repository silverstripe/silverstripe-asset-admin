/* global jest, jasmine, describe, it, expect, beforeEach */

import queuedFilesReducer from '../QueuedFilesReducer';

describe('queuedFilesReducer', () => {
  describe('PURGE_UPLOAD_QUEUE', () => {
    const action = { type: 'PURGE_UPLOAD_QUEUE', payload: null };

    const fileSuccess = {
      id: 1,
      message: {
        value: 'File uploaded',
        type: 'success',
        extraClass: 'success',
      },
    };

    const filePending = {
      id: 0,
      message: {
        value: 'Uploading...',
        type: 'pending',
        extraClass: 'pending',
      },
    };

    const fileFailed = {
      id: 0,
      message: {
        value: 'Failed to upload file',
        type: 'error',
        extraClass: 'error',
      },
    };

    it('should remove successful uploads from the queue', () => {
      const initialState = {
        items: [
          fileSuccess,
        ],
      };

      const nextState = queuedFilesReducer(initialState, action);

      expect(nextState.items.length).toBe(0);
    });

    it('should not remove pending uploads from the queue', () => {
      const initialState = {
        items: [
          fileSuccess,
          filePending,
        ],
      };

      const nextState = queuedFilesReducer(initialState, action);

      expect(nextState.items.length).toBe(1);
      expect(nextState.items[0]).toBe(filePending);
    });

    it('should not remove failed uploads from the queue', () => {
      const initialState = {
        items: [
          fileSuccess,
          fileFailed,
        ],
      };

      const nextState = queuedFilesReducer(initialState, action);

      expect(nextState.items.length).toBe(1);
      expect(nextState.items[0]).toBe(fileFailed);
    });
  });

  describe('FAIL_UPLOAD', () => {
    const type = 'FAIL_UPLOAD';
    const initialState = {
      items: [{
        filename: 'unclepaul.png',
        size: 123,
      }],
    };

    it('should set an error message', () => {
      const nextState = queuedFilesReducer(initialState, {
        type,
        payload: {
          message: {
            value: 'There was a problem.',
            type: 'error',
          },
        },
      });

      expect(nextState.items[0].message.type).toBe('error');
    });
  });

  describe('REMOVE_QUEUED_FILE', () => {
    const type = 'REMOVE_QUEUED_FILE';
    const initialState = {
      items: [{ queuedId: '123' }, { queuedId: '456' }],
    };

    it('should remove the file from the queue', () => {
      const nextState = queuedFilesReducer(initialState, {
        type,
        payload: { queuedId: '456' },
      });

      expect(nextState.items.length).toBe(1);
      expect(nextState.items[0].queuedId).toBe('123');
    });
  });
});

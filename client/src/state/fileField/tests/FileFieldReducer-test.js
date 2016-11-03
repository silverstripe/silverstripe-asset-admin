/* global jest, describe, it, expect, beforeEach, jasmine */

jest.unmock('deep-freeze-strict');
jest.unmock('../FileFieldActionTypes.js');
jest.unmock('../FileFieldReducer.js');

import fileFieldReducer, { fileFactory } from '../FileFieldReducer';
import ACTION_TYPES from '../FileFieldActionTypes';

describe('fileFieldReducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {
      fields: {
        myfield: [
          Object.assign({}, fileFactory(), { id: 5, name: 'MyFile.jpg' }),
          Object.assign({}, fileFactory(), { id: 6, name: 'AnotherFile.jpg' }),
        ],
        anotherfield: [
          Object.assign({}, fileFactory(), { id: 5, name: 'MyFile.jpg' }),
          Object.assign({}, fileFactory(), { queuedId: 'xyz', name: 'InProgressFile.jpg', progress: 10 }),
        ],
      },
    };
  });


  describe('FILEFIELD_ADD_FILE', () => {
    it('should add a new file to a list', () => {
      const nextState = fileFieldReducer(initialState, {
        type: ACTION_TYPES.FILEFIELD_ADD_FILE,
        payload: {
          fieldId: 'myfield',
          file: Object.assign({}, fileFactory(), { id: 7, name: 'NewFile.jpg' }),
        },
      });
      expect(nextState.fields.myfield.length).toEqual(3);
      expect(nextState.fields.myfield[2].id).toEqual(7);
      expect(nextState.fields.anotherfield).toEqual(initialState.fields.anotherfield);
    });
  });

  describe('FILEFIELD_SET_FILES', () => {
    it('should replace existing files', () => {
      const nextState = fileFieldReducer(initialState, {
        type: ACTION_TYPES.FILEFIELD_SET_FILES,
        payload: {
          fieldId: 'myfield',
          files: [
            Object.assign({}, fileFactory(), { id: 8, name: 'EightFile.jpg' }),
            Object.assign({}, fileFactory(), { id: 9, name: 'NineFile.jpg' }),
          ],
        },
      });
      expect(nextState.fields.myfield.length).toEqual(2);
      expect(nextState.fields.myfield[0].id).toEqual(8);
      expect(nextState.fields.myfield[1].id).toEqual(9);
      expect(nextState.fields.anotherfield).toEqual(initialState.fields.anotherfield);
    });
  });

  describe('FILEFIELD_FAIL_UPLOAD', () => {
    it('should update error messages on failed uploads', () => {
      const nextState = fileFieldReducer(initialState, {
        type: ACTION_TYPES.FILEFIELD_FAIL_UPLOAD,
        payload: {
          fieldId: 'anotherfield',
          queuedId: 'xyz',
          message: {
            type: 'error',
            value: 'An error occurred uploading this file',
          },
        },
      });
      expect(nextState.fields.anotherfield.length).toEqual(2);
      expect(nextState.fields.anotherfield[0].message).toBe(undefined);
      expect(nextState.fields.anotherfield[1].message.type).toEqual('error');
      expect(nextState.fields.anotherfield[1].message.value).toEqual('An error occurred uploading this file');
      expect(nextState.fields.myfield).toEqual(initialState.fields.myfield);
    });
  });

  describe('FILEFIELD_REMOVE_FILE', () => {
    it('should remove the specified saved file', () => {
      const nextState = fileFieldReducer(initialState, {
        type: ACTION_TYPES.FILEFIELD_REMOVE_FILE,
        payload: {
          fieldId: 'anotherfield',
          file: { id: 5 },
        },
      });
      expect(nextState.fields.anotherfield.length).toEqual(1);
      expect(nextState.fields.anotherfield[0].queuedId).toBe('xyz');
      expect(nextState.fields.myfield).toEqual(initialState.fields.myfield);
    });

    it('should remove the specified in-progress file', () => {
      const nextState = fileFieldReducer(initialState, {
        type: ACTION_TYPES.FILEFIELD_REMOVE_FILE,
        payload: {
          fieldId: 'anotherfield',
          file: { queuedId: 'xyz' },
        },
      });
      expect(nextState.fields.anotherfield.length).toEqual(1);
      expect(nextState.fields.anotherfield[0].id).toBe(5);
      expect(nextState.fields.myfield).toEqual(initialState.fields.myfield);
    });
  });

  describe('FILEFIELD_SUCCEED_UPLOAD', () => {
    it('should update in-progress files on successful upload', () => {
      const nextState = fileFieldReducer(initialState, {
        type: ACTION_TYPES.FILEFIELD_SUCCEED_UPLOAD,
        payload: {
          fieldId: 'anotherfield',
          queuedId: 'xyz',
          json: { id: 10, title: 'In-Progress File' },
        },
      });
      expect(nextState.fields.anotherfield.length).toEqual(2);
      expect(nextState.fields.anotherfield[1]).toEqual(
        jasmine.objectContaining({
          id: 10,
          queuedId: 'xyz',
          name: 'InProgressFile.jpg',
          title: 'In-Progress File',
        })
      );
      expect(nextState.fields.myfield).toEqual(initialState.fields.myfield);
    });
  });

  describe('FILEFIELD_UPDATE_QUEUED_FILE', () => {
    it('updates progress of queued files', () => {
      const nextState = fileFieldReducer(initialState, {
        type: ACTION_TYPES.FILEFIELD_UPDATE_QUEUED_FILE,
        payload: {
          fieldId: 'anotherfield',
          queuedId: 'xyz',
          updates: { progress: 50 },
        },
      });
      expect(nextState.fields.anotherfield.length).toEqual(2);
      expect(nextState.fields.anotherfield[1].progress).toEqual(50);
      expect(nextState.fields.myfield).toEqual(initialState.fields.myfield);
    });
  });
});

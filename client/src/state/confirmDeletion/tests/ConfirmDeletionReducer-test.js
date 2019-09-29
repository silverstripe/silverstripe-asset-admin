/* global jest, describe, it, pit, expect, beforeEach, jasmine */
import reducer, { initialState } from '../ConfirmDeletionReducer';
import ACTION_TYPES from '../ConfirmDeletionActionTypes';
import * as TRANSITIONS from '../ConfirmDeletionTransitions';

const FOLDER = 'folder';
const FILE = 'file';

const files = [
  { id: 1, title: 'A folder', type: FOLDER },
  { id: 2, title: 'Another folder', type: FOLDER },
  { id: 3, title: 'image.jpg', type: FILE },
  { id: 4, title: 'document.pdf', type: FILE },
];


describe('Confirm Deletion State Reducers', () => {
  describe(ACTION_TYPES.CONFIRM_DELETION_ASK, () => {
    it('Asking to confirm deletion', () => {
      const actualNewState = reducer(
        initialState,
        { type: ACTION_TYPES.CONFIRM_DELETION_ASK, payload: { files } }
      );
      expect(actualNewState.showConfirmation).toBe(true);
      expect(actualNewState.transition).toBe(TRANSITIONS.NO_TRANSITION);
      expect(actualNewState.files).toBe(files);
    });

    it('Asking to confirm deletion with an existing prompt', () => {
      const actualNewState = reducer(
        {
          showConfirmation: true,
          transition: TRANSITIONS.CANCELING,
          files: [{ id: 5, title: 'monkey.jpg', type: FILE }]
        },
        { type: ACTION_TYPES.CONFIRM_DELETION_ASK, payload: { files } }
      );
      expect(actualNewState.showConfirmation).toBe(true);
      expect(actualNewState.transition).toBe(TRANSITIONS.NO_TRANSITION);
      expect(actualNewState.files).toBe(files);
    });
  });

  describe(ACTION_TYPES.CONFIRM_DELETION_CONFIRM, () => {
    it('User as confirm deletion', () => {
      const actualNewState = reducer(
        { showConfirmation: true, transition: TRANSITIONS.NO_TRANSITION, files },
        { type: ACTION_TYPES.CONFIRM_DELETION_CONFIRM, payload: { } }
      );
      expect(actualNewState.showConfirmation).toBe(true);
      expect(actualNewState.transition).toBe(TRANSITIONS.DELETING);
      expect(actualNewState.files).toBe(files);
    });

    it('User confirm deletion, but the modal is already gone', () => {
      const actualNewState = reducer(
        { showConfirmation: false, transition: TRANSITIONS.NO_TRANSITION, files },
        { type: ACTION_TYPES.CONFIRM_DELETION_CONFIRM, payload: { } }
      );
      expect(actualNewState.showConfirmation).toBe(false);
      expect(actualNewState.transition).toBe(TRANSITIONS.NO_TRANSITION);
      expect(actualNewState.files).toBe(files);
    });
  });

  describe(ACTION_TYPES.CONFIRM_DELETION_CANCEL, () => {
    it('User doesn\'t want to delete anymore', () => {
      const actualNewState = reducer(
        { showConfirmation: true, transition: TRANSITIONS.NO_TRANSITION, files },
        { type: ACTION_TYPES.CONFIRM_DELETION_CANCEL, payload: { } }
      );
      expect(actualNewState.showConfirmation).toBe(true);
      expect(actualNewState.transition).toBe(TRANSITIONS.CANCELING);
      expect(actualNewState.files).toBe(files);
    });

    it('Cancel after reset', () => {
      const actualNewState = reducer(
        initialState,
        { type: ACTION_TYPES.CONFIRM_DELETION_CANCEL, payload: { } }
      );
      expect(actualNewState.showConfirmation).toBe(false);
      expect(actualNewState.transition).toBe(TRANSITIONS.NO_TRANSITION);
      expect(actualNewState.files).toEqual([]);
    });
  });

  describe(ACTION_TYPES.CONFIRM_DELETION_CANCEL, () => {
    it('User doesn\'t want to delete anymore', () => {
      const actualNewState = reducer(
        { showConfirmation: true, transition: TRANSITIONS.NO_TRANSITION, files },
        { type: ACTION_TYPES.CONFIRM_DELETION_CANCEL, payload: { } }
      );
      expect(actualNewState.showConfirmation).toBe(true);
      expect(actualNewState.transition).toBe(TRANSITIONS.CANCELING);
      expect(actualNewState.files).toBe(files);
    });

    it('Cancel after reset', () => {
      const actualNewState = reducer(
        initialState,
        { type: ACTION_TYPES.CONFIRM_DELETION_CANCEL, payload: { } }
      );
      expect(actualNewState.showConfirmation).toBe(false);
      expect(actualNewState.transition).toBe(TRANSITIONS.NO_TRANSITION);
      expect(actualNewState.files).toEqual([]);
    });
  });

  describe(ACTION_TYPES.CONFIRM_DELETION_RESET, () => {
    it('Reset bring evertything back to initial state', () => {
      const actualNewState = reducer(
        initialState,
        { type: ACTION_TYPES.CONFIRM_DELETION_RESET, payload: { } }
      );
      expect(actualNewState).toBe(initialState);
    });

    it('Reset udpates unset files as well', () => {
      const actualNewState = reducer(
        { showConfirmation: true, transition: TRANSITIONS.DELETING, files },
        { type: ACTION_TYPES.CONFIRM_DELETION_RESET, payload: { } }
      );
      expect(actualNewState).toBe(initialState);
    });
  });

  describe(ACTION_TYPES.CONFIRM_DELETION_MODAL_CLOSE, () => {
    it('Modal close after delete request is done', () => {
      const actualNewState = reducer(
        initialState,
        { type: ACTION_TYPES.CONFIRM_DELETION_MODAL_CLOSE, payload: { } }
      );
      expect(actualNewState.showConfirmation).toBe(false);
      expect(actualNewState.transition).toBe(TRANSITIONS.NO_TRANSITION);
      expect(actualNewState.files).toEqual([]);
    });

    it('Modal close before delete request is done', () => {
      const actualNewState = reducer(
        { showConfirmation: true, transition: TRANSITIONS.DELETING, files },
        { type: ACTION_TYPES.CONFIRM_DELETION_MODAL_CLOSE, payload: { } }
      );
      expect(actualNewState.showConfirmation).toBe(false);
      expect(actualNewState.transition).toBe(TRANSITIONS.NO_TRANSITION);
      expect(actualNewState.files).toBe(files);
    });
  });
});


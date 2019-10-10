/* global jest, describe, it, pit, expect, beforeEach, jasmine */
import reducer, { initialState } from '../ModalReducer';
import { defineImageSizePresets } from '../ModalActions';

const presetList = [
  { width: 123, text: 'test preset' }
];

describe('Modal State Reducers', () => {
  describe('Image Size Preset', () => {
    it('Defining new preset', () => {
      const actualNewState = reducer(
        initialState,
        defineImageSizePresets(presetList)
      );
      expect(actualNewState.imageSizePresets).toBe(presetList);
    });
  });
});


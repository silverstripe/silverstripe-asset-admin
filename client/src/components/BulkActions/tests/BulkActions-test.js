/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('../BulkActions.js');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { BulkActions } from '../BulkActions.js';

describe('BulkActions', () => {
  describe('canApply()', () => {
    let props = null;
    beforeEach(() => {
      props = {
        actions: [
          {
            value: 'action-with-apply',
            label: '',
            canApply: (items) => items.filter(item => item.applies).length,
            callback: () => true,
          },
          {
            value: 'action-without-apply',
            label: '',
            callback: () => true,
          },
        ],
      };
    });

    it('shows an action button when canApply returns true', () => {
      const propsWithItems = Object.assign({}, props, { items: [{ applies: true }] });
      const bulkActions = ReactTestUtils.renderIntoDocument(
        <BulkActions {...propsWithItems} />
      );
      const matchedBulkAction = ReactTestUtils.scryRenderedDOMComponentsWithClass(bulkActions, 'bulk-actions_action')
        .find(el => el.value === 'action-with-apply');
      expect(matchedBulkAction).toBeTruthy();
    });

    it('does not show an action button when canApply returns false', () => {
      const propsWithItems = Object.assign({}, props, { items: [{ applies: false }] });
      const bulkActions = ReactTestUtils.renderIntoDocument(
        <BulkActions {...propsWithItems } />
      );
      const matchedBulkAction = ReactTestUtils.scryRenderedDOMComponentsWithClass(bulkActions, 'bulk-actions_action')
        .find(el => el.value === 'action-with-apply');
      expect(matchedBulkAction).toBeFalsy();
    });
  });

  describe('getOptionByValue()', () => {
    let bulkActions = null;
    let props = null;

    beforeEach(() => {
      props = {
        actions: [
          {
            value: 'my-first-action',
            label: 'My First Action',
            callback: () => true,
          },
        ],
        items: [],
      };
      bulkActions = ReactTestUtils.renderIntoDocument(
        <BulkActions {...props} />
      );
    });

    it('should return the option which matches the given value', () => {
      expect(bulkActions.getOptionByValue('my-first-action').value).not.toBeFalsy();
    });

    it('should return null if no option matches the given value', () => {
      expect(bulkActions.getOptionByValue('unknown-action')).toBeFalsy();
    });
  });

  describe('onChangeValue()', () => {
    let bulkActions = null;
    let event = null;
    let props = null;

    beforeEach(() => {
      props = {
        actions: [],
        items: [],
      };
      bulkActions = ReactTestUtils.renderIntoDocument(
          <BulkActions {...props} />
      );
      event = {
        target: {
          value: null,
        },
      };

      bulkActions.getOptionByValue = jest.genMockFunction();
      bulkActions.applyAction = jest.genMockFunction();
    });

    it('should return undefined if no valid option is selected', () => {
      bulkActions.getOptionByValue.mockReturnValueOnce(null);

      expect(bulkActions.onChangeValue(event)).toBeFalsy();
    });


    it('should use callback if no confirm callback is configured', () => {
      const callbackMockFn = jest.genMockFunction();

      bulkActions.getOptionByValue.mockReturnValueOnce({ confirm: null, callback: callbackMockFn });
      return bulkActions.onChangeValue(event).then(() => {
        expect(callbackMockFn).toBeCalled();
      });
    });

    it('should use callback if confirm is configured and resolved', () => {
      const callbackMockFn = jest.genMockFunction();

      bulkActions.getOptionByValue.mockReturnValueOnce({ confirm: Promise.resolve(), callback: callbackMockFn });
      return bulkActions.onChangeValue(event).then(() => {
        expect(callbackMockFn).toBeCalled();
      });
    });

    it('should not use callback if confirm is configured and rejected', () => {
      const callbackMockFn = jest.genMockFunction();

      bulkActions.getOptionByValue.mockReturnValueOnce({ confirm: Promise.reject(), callback: callbackMockFn });
      return bulkActions.onChangeValue(event).then(() => {
        expect(callbackMockFn).toBeCalled();
      });
    });
  });
});

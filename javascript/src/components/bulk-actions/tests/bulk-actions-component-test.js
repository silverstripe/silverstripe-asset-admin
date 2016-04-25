/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('../index.js');

import React from 'react';
import i18n from 'i18n';
import ReactTestUtils from 'react-addons-test-utils';
import { BulkActionsComponent } from '../index.js';

describe('BulkActionsComponent', () => {
  let props;
  const deleteActionSpy = jasmine.createSpy('deleteAction');

  beforeEach(() => {
    props = {
      gallery: {
        bulkActions: {
          options: [
            {
              value: 'delete',
              label: 'Delete',
              destructive: true,
            },
          ],

        },
        selectedFiles: [1],
      },
      deleteAction: deleteActionSpy,
    };
  });

  describe('getOptionByValue()', () => {
    let bulkActions;

    beforeEach(() => {
      bulkActions = ReactTestUtils.renderIntoDocument(
        <BulkActionsComponent {...props} />
      );
    });

    it('should return the option which matches the given value', () => {
      expect(bulkActions.getOptionByValue('delete').value).toBe('delete');
    });

    it('should return null if no option matches the given value', () => {
      expect(bulkActions.getOptionByValue('destroyCMS')).toBe(null);
    });
  });

  describe('getSelectedFiles()', () => {
    let bulkActions;

    beforeEach(() => {
      bulkActions = ReactTestUtils.renderIntoDocument(
        <BulkActionsComponent {...props} />
      );
    });

    it('should return the option which matches the given value', () => {
      expect(bulkActions.getSelectedFiles()[0]).toBe(1);
    });
  });

  describe('applyAction()', () => {
    let bulkActions;

    beforeEach(() => {
      props.backend = {
        delete: jest.genMockFunction(),
      };
      props.getSelectedFiles = jest.genMockFunction();

      bulkActions = ReactTestUtils.renderIntoDocument(
          <BulkActionsComponent {...props} />
      );
    });

    it('should apply the given action', () => {
      props.getSelectedFiles.mockReturnValueOnce('file1');

      bulkActions.applyAction('delete');

      expect(deleteActionSpy).toHaveBeenCalled();
    });

    it('should return false if there are no matching actions', () => {
      expect(bulkActions.applyAction('destroyCMS')).toBe(false);
    });
  });

  describe('onChangeValue()', () => {
    let bulkActions;
    let event;

    beforeEach(() => {
      bulkActions = ReactTestUtils.renderIntoDocument(
          <BulkActionsComponent {...props} />
      );

      event = {
        target: {
          value: 'delete',
        },
      };

      bulkActions.getOptionByValue = jest.genMockFunction();
      bulkActions.applyAction = jest.genMockFunction();
    });

    it('should return undefined if no valid option is selected', () => {
      bulkActions.getOptionByValue.mockReturnValueOnce(null);

      expect(bulkActions.onChangeValue(event)).toBe(undefined);
    });

    it('should ask user for confirmation if the action is destructive', () => {
      const mock = jest.genMockFunction();
      const originalConfirm = window.confirm;

      bulkActions.getOptionByValue.mockReturnValueOnce({ destructive: true });
      mock.mockReturnValueOnce(true);
      window.confirm = mock;
      i18n.sprintf = jest.genMockFunction();

      bulkActions.onChangeValue(event);

      expect(bulkActions.applyAction).toBeCalled();
      expect(window.confirm).toBeCalled();

      window.confirm = originalConfirm;
    });

    it('should not ask user for confirmation if the action is not destructive', () => {
      bulkActions.getOptionByValue.mockReturnValueOnce({ destructive: false });

      bulkActions.onChangeValue(event);

      expect(bulkActions.applyAction).toBeCalled();
    });
  });
});

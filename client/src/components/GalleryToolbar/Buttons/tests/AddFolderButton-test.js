/* global jest, describe, it, expect, beforeEach, Event */
import React from 'react';
import Component from '../AddFolderButton';
import ReactTestUtils from 'react-addons-test-utils';

describe('AddFolderButton', () => {
  describe('handleCreateFolder()', () => {
    it('should call onCreateFolder on click', () => {
      const props = {
        canEdit: true,
        onCreateFolder: jest.genMockFunction()
      };
      const button = ReactTestUtils.renderIntoDocument(<Component {...props} />);
      button.handleCreateFolder(new Event('click'));

      expect(props.onCreateFolder).toBeCalled();
    });
  });
});

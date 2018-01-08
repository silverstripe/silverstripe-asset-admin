/* global jest, describe, it, expect, beforeEach, Event */
import React from 'react';
// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('components/BackButton/BackButton');

import ReactTestUtils from 'react-addons-test-utils';
import Component from '../BackButton';

describe('BackButton', () => {
  let props = null;

  beforeEach(() => {
    props = {
      folder: {
        id: 1,
        title: 'container folder',
        parentId: null,
        canView: true,
        canEdit: true,
      },
      onMoveFiles: () => {},
      onOpenFolder: () => {},
      badges: [],
    };
  });

  describe('render BackButton', () => {
    it('should not render if parentId is not set', () => {
      const backbutton = ReactTestUtils.renderIntoDocument(<Component {...props} />);
      const locator = ReactTestUtils.scryRenderedDOMComponentsWithClass(backbutton, 'gallery__back-container');
      expect(locator.length).toBe(0);
    });

    it('should render a react component if parentId is set', () => {
      props.folder.parentId = 15;
      const backbutton = ReactTestUtils.renderIntoDocument(<Component {...props} />);
      const locator = ReactTestUtils.scryRenderedDOMComponentsWithClass(backbutton, 'gallery__back-container');
      expect(locator.length).toBe(1);
    });
  });

  describe('handleBackClick()', () => {
    it('should open folder with parentId', () => {
      props.folder.parentId = 15;
      props.onOpenFolder = jest.genMockFunction();
      const backbutton = ReactTestUtils.renderIntoDocument(<Component {...props} />);
      backbutton.handleBackClick(new Event('click'));
      expect(props.onOpenFolder).toBeCalledWith(15);
    });
  });
});

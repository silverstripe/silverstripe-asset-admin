/* global jest, describe, it, expect, beforeEach, Event */
// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('components/BackButton/BackButton');

import ReactTestUtils from 'react-addons-test-utils';
import Component, { onClick } from '../BackButton';

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
      handleMoveFiles: () => {},
      onOpenFolder: () => {},
      badges: [],
    };
  });

  describe('render BackButton', () => {
    it('should not render if parentId is not set', () => {
      expect(Component({ ...props })).toBeNull();
    });

    it('should render a react component if parentId is set', () => {
      props.folder.parentId = 15;
      const backbutton = ReactTestUtils.renderIntoDocument(Component({ ...props }));
      expect(backbutton).not.toBeNull();
    });
  });

  describe('handleBackClick()', () => {
    it('should open folder with parentId', () => {
      props.folder.parentId = 15;
      props.onOpenFolder = jest.genMockFunction();
      onClick(props.onOpenFolder, props.folder)(new Event('click'));
      expect(props.onOpenFolder).toBeCalledWith(15);
    });
  });
});

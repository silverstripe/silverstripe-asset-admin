/* global jest, describe, it, expect, beforeEach */

// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('components/FormAlert/FormAlert');
jest.mock('components/GalleryItem/GalleryItem');
jest.mock('griddle-react');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ThumbnailView from '../ThumbnailView';

describe('ThumbnailView', () => {
  let props = null;

  beforeEach(() => {
    const itemProps = {
      uploading: false,
      type: 'folder',
      category: 'folder',
      title: 'My test file',
    };
    props = {
      files: [
        Object.assign({}, itemProps, { id: 12, parent: { id: 0 } }),
        Object.assign({}, itemProps, { id: 15, parent: { id: 6 } }),
      ],
      onOpenFile: jest.genMockFunction(),
      onOpenFolder: jest.genMockFunction(),
      onSort: jest.genMockFunction(),
      onSetPage: jest.genMockFunction(),
      renderNoItemsNotice: jest.genMockFunction(),
      badges: [],
    };
  });

  describe('handleSetPage()', () => {
    it('should call onSetPage with the same param', () => {
      const view = ReactTestUtils.renderIntoDocument(<ThumbnailView {...props} />);
      view.handleSetPage(3);

      expect(props.onSetPage).toBeCalledWith(4);
    });
  });

  describe('handleNextPage()', () => {
    it('should increment from the current page', () => {
      props.page = 3;
      const view = ReactTestUtils.renderIntoDocument(<ThumbnailView {...props} />);
      view.handleNextPage();

      expect(props.onSetPage).toBeCalledWith(4);
    });
  });

  describe('handlePrevPage()', () => {
    it('should decrement from the current page', () => {
      props.page = 3;
      const view = ReactTestUtils.renderIntoDocument(<ThumbnailView {...props} />);
      view.handlePrevPage();

      expect(props.onSetPage).toBeCalledWith(2);
    });

    it('should stay on page 1 if that is the current page', () => {
      props.page = 1;
      const view = ReactTestUtils.renderIntoDocument(<ThumbnailView {...props} />);
      view.handlePrevPage();

      expect(props.onSetPage).toBeCalledWith(1);
    });
  });

  describe('filter file/folder', () => {
    let view = null;

    beforeEach(() => {
      view = ReactTestUtils.renderIntoDocument(<ThumbnailView {...props} />);
    });

    it('should return true for folder types', () => {
      const file = { type: 'folder' };
      const filter = view.folderFilter(file);

      expect(filter).toBe(true);
    });

    it('should return true for non-folder types', () => {
      const file = { type: 'image' };
      const filter = view.fileFilter(file);

      expect(filter).toBe(true);
    });
  });

  describe('renderPagination()', () => {
    it('should render pagination when the count of items exceed the items per page limit', () => {
      props.totalCount = 40;
      props.limit = 15;
      const view = ReactTestUtils.renderIntoDocument(<ThumbnailView {...props} />);
      const pagination = view.renderPagination();

      expect(pagination).not.toBeNull();
    });

    it('should return null when the count of items equals the items per page limit', () => {
      props.totalCount = 15;
      props.limit = 15;
      const view = ReactTestUtils.renderIntoDocument(<ThumbnailView {...props} />);
      const pagination = view.renderPagination();

      expect(pagination).toBeNull();
    });

    it('should return null when the count of items is less than the items per page limit', () => {
      props.totalCount = 5;
      props.limit = 15;
      const view = ReactTestUtils.renderIntoDocument(<ThumbnailView {...props} />);
      const pagination = view.renderPagination();

      expect(pagination).toBeNull();
    });
  });

  describe('renderItem()', () => {
    let view = null;
    let itemProps = null;

    beforeEach(() => {
      props.onCancelUpload = () => null;
      props.onRemoveErroredUpload = () => null;
      view = ReactTestUtils.renderIntoDocument(<ThumbnailView {...props} />);
      itemProps = {
        uploading: false,
        type: 'folder',
        category: 'folder',
        id: 5,
        title: 'My test file',
      };
    });

    it('should have cancel callbacks and no activate callback', () => {
      itemProps = Object.assign({}, itemProps, {
        uploading: true,
      });
      const item = ReactTestUtils.renderIntoDocument(view.renderItem(itemProps, 0));

      expect(typeof item.props.onCancelUpload).toBe('function');
      expect(typeof item.props.onRemoveErroredUpload).toBe('function');
      expect(typeof item.props.onActivate).not.toBe('function');
    });

    it('should callback folder for a folder type item', () => {
      itemProps = Object.assign({}, itemProps, {
        type: 'folder',
      });
      const item = ReactTestUtils.renderIntoDocument(view.renderItem(itemProps, 0));

      item.props.onActivate();

      expect(typeof item.props.onCancelUpload).not.toBe('function');
      expect(typeof item.props.onRemoveErroredUpload).not.toBe('function');
      expect(props.onOpenFolder).toBeCalled();
      expect(props.onOpenFile).not.toBeCalled();
    });

    it('should callback folder for a folder type item', () => {
      itemProps = Object.assign({}, itemProps, {
        type: 'image',
      });
      const item = ReactTestUtils.renderIntoDocument(view.renderItem(itemProps, 0));

      item.props.onActivate();

      expect(typeof item.props.onCancelUpload).not.toBe('function');
      expect(typeof item.props.onRemoveErroredUpload).not.toBe('function');
      expect(props.onOpenFolder).not.toBeCalled();
      expect(props.onOpenFile).toBeCalled();
    });
  });
});

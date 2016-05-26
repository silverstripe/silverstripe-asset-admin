/* global jest, describe, it, expect, beforeEach */

jest.unmock('react');
jest.unmock('react-dom');
jest.unmock('react-redux');
jest.unmock('react-addons-test-utils');
jest.unmock('../../../components/BulkActions/BulkActions');
jest.unmock('../Gallery');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Gallery } from '../Gallery';

describe('Gallery', () => {
  let props;

  beforeEach(() => {
    props = {
      actions: {
        gallery: {
          addFiles: () => null,
          updateFile: () => null,
          selectFiles: () => null,
          deselectFiles: () => null,
          setEditing: () => null,
          setEditorFields: () => null,
          updateEditorField: () => null,
          setPath: () => null,
          sortFiles: () => null,
          setViewingFolder: () => null,
          setParentfolderId: () => null,
          setfolderId: () => null,
          loadFolderContents: () => null,
          deleteItems: () => null,
          show: () => null,
        },
        queuedFiles: {
          addQueuedFile: () => null,
          failUpload: () => null,
          purgeUploadQueue: () => null,
          removeQueuedFile: () => null,
          succeedUpload: () => null,
        },
      },
      parentfolderId: null,
      selectedFiles: [],
      files: [],
      count: 0,
      folderId: 1,
      queuedFiles: {
        items: [],
      },
      onOpenFile: () => {},
    };
  });

  describe('handleSuccessfulUpload', () => {
    const file = {
      filename: 'unclepaul.png',
      size: 123,
      xhr: { response: '[{"id":1}]' },
    };

    it('should call an action to remove the file from the `queuedFiles` state', () => {
      props.actions.queuedFiles.removeQueuedFile = jest.genMockFunction();

      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.handleSuccessfulUpload(file);
      expect(props.actions.queuedFiles.removeQueuedFile).toBeCalled();
    });

    it('should call an action to add the file to the `files` state', () => {
      props.actions.gallery.addFiles = jest.genMockFunction();

      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.handleSuccessfulUpload(file);
      expect(props.actions.gallery.addFiles).toBeCalled();
    });
  });

  describe('handleSort()', () => {
    let gallery;
    const event = {
      target: {
        dataset: {
          field: 'field',
          direction: 'direction',
        },
      },
    };

    beforeEach(() => {
      props.actions.queuedFiles.purgeUploadQueue = jest.genMockFunction();
      props.actions.gallery.sortFiles = jest.genMockFunction();

      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should purge the upload queue', () => {
      gallery.handleSort(event);
      expect(props.actions.queuedFiles.purgeUploadQueue).toBeCalled();
    });

    it('should call props.actions.sortFiles() with the event\'s dataset', () => {
      gallery.handleSort(event);
      expect(props.actions.gallery.sortFiles).toBeCalled();
    });
  });

  describe('getNoItemsNotice()', () => {
    it('should return the no items notice if there are no files', () => {
      props.count = 0;

      const gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );

      expect(JSON.stringify(gallery.getNoItemsNotice())).toContain('gallery__no-item-notice');
    });

    it('should return null if there is at least one file', () => {
      props.files = [{ id: 1 }];
      props.count = 1;

      const gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );

      expect(gallery.getNoItemsNotice()).toBe(null);
    });
  });

  describe('getBackButton()', () => {
    let gallery;

    beforeEach(() => {
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should not return a back button it we\'re at the top level', () => {
      expect(gallery.getBackButton()).toBe(null);
    });

    it('should return a back button if parentfolderId is set.', () => {
      props.parentfolderId = 0;
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
      const button = gallery.getBackButton();

      expect(button).not.toBe(null);
      expect(button.type).toBe('button');
      expect(button.ref).toBe('backButton');
    });
  });

  describe('getBulkActionsComponent()', () => {
    let gallery;

    beforeEach(() => {
      props.bulkActions = true;

      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should not return a BulkActionsComponent if there are no selected items', () => {
      expect(gallery.getBulkActionsComponent()).toBe(null);
    });

    it('should return a BulkActionsComponent if there are items in the selectedFiles array.', () => {
      props.selectedFiles = [1];
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );

      expect(gallery.getBulkActionsComponent()).not.toBe(null);
    });
  });

  describe('getMoreButton()', () => {
    let gallery;

    beforeEach(() => {
      props.files = [1];

      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should not return a more button if all files are loaded', () => {
      props.count = 1;
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );

      expect(gallery.getMoreButton()).toBe(null);
    });

    it('should return a more button if all files are loaded.', () => {
      props.count = 2;
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );

      expect(gallery.getMoreButton()).not.toBe(null);
    });
  });

  describe('handleItemDelete()', () => {
    let gallery;
    const item = { id: 1 };
    const event = {};

    beforeEach(() => {
      props.actions.gallery.deleteItems = jest.genMockFunction();

      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should call props.actions.gallery.deleteItems with the item id.', () => {
      const mock = jest.genMockFunction();
      const originalConfirm = window.confirm;

      mock.mockReturnValueOnce(true);
      window.confirm = mock;
      // i18n.sprintf = jest.genMockFunction();

      gallery.handleItemDelete(event, item);

      expect(props.actions.gallery.deleteItems).toBeCalled();
      expect(window.confirm).toBeCalled();

      window.confirm = originalConfirm;
    });
  });

  describe('itemIsSelected()', () => {
    let gallery;

    beforeEach(() => {
      props.selectedFiles = [1];

      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should return true if the file is selected', () => {
      expect(gallery.itemIsSelected(1)).toBe(true);
    });

    it('should return false if the file is not selected', () => {
      expect(gallery.itemIsSelected(2)).toBe(false);
    });
  });

  describe('handleFolderActivate()', () => {
    let gallery;

    beforeEach(() => {
      props.actions.gallery.show = jest.genMockFunction();
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should call show', () => {
      const folder = { id: 1 };
      const event = {};

      gallery.handleFolderActivate(event, folder);

      expect(props.actions.gallery.show).toBeCalledWith(1);
    });
  });

  describe('handleFileActivate()', () => {
    let gallery;

    beforeEach(() => {
      props.actions.gallery.setEditing = jest.genMockFunction();
      props.onOpenFile = jest.genMockFunction();

      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should call onOpenFile', () => {
      const file = { id: 1 };
      const event = {};

      gallery.handleFileActivate(event, file);

      expect(props.onOpenFile).toBeCalledWith(1, file);
    });
  });

  describe('handleToggleSelect()', () => {
    let gallery;
    const event = {};

    beforeEach(() => {
      props.actions.gallery.selectFiles = jest.genMockFunction();
      props.actions.gallery.deselectFiles = jest.genMockFunction();
      props.selectedFiles = [1];

      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should set deselect the file is currently selected', () => {
      const item = { id: 1 };

      gallery.handleToggleSelect(event, item);

      expect(props.actions.gallery.deselectFiles).toBeCalledWith([1]);
    });

    it('should set select the file is not currently selected', () => {
      const item = { id: 2 };

      gallery.handleToggleSelect(event, item);

      expect(props.actions.gallery.selectFiles).toBeCalledWith([2]);
    });
  });
});

/* global jest, describe, it, expect, beforeEach */

jest.unmock('react');
jest.unmock('react-dom');
jest.unmock('react-redux');
jest.unmock('react-addons-test-utils');
jest.unmock('../../../components/BulkActions/BulkActions');
jest.unmock('../Gallery');
// mock GriddlePagination because it gives mutation warnings all over the place!
jest.mock('griddle-react', () => null);

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Gallery } from '../Gallery';

describe('Gallery', () => {
  let props = null;

  beforeEach(() => {
    props = {
      actions: {
        gallery: {
          addFiles: () => {},
          selectFiles: () => {},
          deselectFiles: () => {},
          setPath: () => {},
          setFile: () => {},
          loadFolderContents: () => {},
          deleteItems: () => {},
        },
        queuedFiles: {
          addQueuedFile: () => null,
          failUpload: () => null,
          purgeUploadQueue: () => null,
          removeQueuedFile: () => null,
          succeedUpload: () => null,
        },
      },
      selectedFiles: [],
      highlightedFiles: [],
      files: [],
      count: 0,
      folderId: 1,
      fileId: null,
      folder: {
        id: 1,
        parentID: null,
        canView: true,
        canEdit: true,
      },
      queuedFiles: {
        items: [],
      },
      sort: '',
      page: 2,
      onOpenFile: () => {},
      onOpenFolder: () => {},
      onSort: () => {},
      onSetPage: () => {},
      onViewChange: () => {},
    };
  });

  describe('refreshFolderIfNeeded()', () => {
    let gallery = null;
    beforeEach(() => {
      gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
      // these are called on componentDidMount()...
      props.actions.gallery.deselectFiles = jest.genMockFunction();
      props.actions.gallery.loadFolderContents = jest.genMockFunction();
    });

    it('should call deselectFiles and loadFolderContents with empty props', () => {
      gallery.refreshFolderIfNeeded(null, props);
      expect(props.actions.gallery.deselectFiles).toBeCalled();
      expect(props.actions.gallery.loadFolderContents).toBeCalled();
    });
    it('should not call deselectFiles and loadFolderContents if props do not change', () => {
      const nextProps = Object.assign({}, props);

      gallery.refreshFolderIfNeeded(props, nextProps);
      expect(nextProps.actions.gallery.deselectFiles.mock.calls.length).toBe(0);
      expect(nextProps.actions.gallery.loadFolderContents.mock.calls.length).toBe(0);
    });
    it('should call deselectFiles and loadFolderContents if folderId changes', () => {
      const nextProps = Object.assign({}, props, { folderId: 3 });

      gallery.refreshFolderIfNeeded(props, nextProps);
      expect(props.actions.gallery.deselectFiles).toBeCalled();
      expect(props.actions.gallery.loadFolderContents).toBeCalled();
    });
    it('should call deselectFiles and loadFolderContents if page changes', () => {
      const nextProps = Object.assign({}, props, { page: 0 });

      gallery.refreshFolderIfNeeded(props, nextProps);
      expect(props.actions.gallery.deselectFiles).toBeCalled();
      expect(props.actions.gallery.loadFolderContents).toBeCalled();
    });
    it('should call deselectFiles and loadFolderContents if sort changes', () => {
      const nextProps = Object.assign({}, props, { sort: 'title,asc' });

      gallery.refreshFolderIfNeeded(props, nextProps);
      expect(props.actions.gallery.deselectFiles).toBeCalled();
      expect(props.actions.gallery.loadFolderContents).toBeCalled();
    });
  });

  describe('handleSetPage', () => {
    it('should return the set page for callback', () => {
      props.onSetPage = jest.genMockFunction();
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.handleSetPage(5);
      expect(props.onSetPage).toBeCalledWith(5);
    });
  });

  describe('renderBulkActions()', () => {
    beforeEach(() => {
      props.type = 'admin';
      props.selectedFiles = [15, 20];
      props.files = [
        { id: 15 },
        { id: 20 },
        { id: 45 },
      ];
    });

    it('should render bulk actions if there are selected files and admin type', () => {
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
      const bulkActions = gallery.renderBulkActions();

      expect(bulkActions).not.toBeNull();
    });

    it('should not render bulk actions if not admin type', () => {
      props.type = 'insert';
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
      const bulkActions = gallery.renderBulkActions();

      expect(bulkActions).toBeNull();
    });

    it('should not render bulk actions if no files were selected', () => {
      props.selectedFiles = [];
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
      const bulkActions = gallery.renderBulkActions();

      expect(bulkActions).toBeNull();
    });
  });

  describe('renderBackButton()', () => {
    it('should not render if parentID is not set', () => {
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
      const backButton = gallery.renderBackButton();

      expect(backButton).toBeNull();
    });

    it('should render a react component if parentID is set', () => {
      props.folder.parentID = 15;
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
      const backButton = gallery.renderBackButton();

      expect(backButton).not.toBeNull();
    });
  });

  describe('handleBackClick()', () => {
    it('should open folder with parentID', () => {
      props.folder.parentID = 15;
      props.onOpenFolder = jest.genMockFunction();
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.handleBackClick(new Event('click'));
      expect(props.onOpenFolder).toBeCalledWith(15);
    });
  });

  describe('componentWillUnmount()', () => {
    it('should unload folder data when the component is going to unmount', () => {
      props.actions.gallery.unloadFolderContents = jest.genMockFunction();
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.componentWillUnmount();
      expect(props.actions.gallery.unloadFolderContents).toBeCalled();
    });
  });

  describe('handleSuccessfulUpload()', () => {
    const file = {
      exists: true,
      category: 'image',
      filename: 'unclepaul.png',
      dimensions: {
        width: 10,
        height: 10,
      },
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

    it('should openFile if type is "insert"', () => {
      props.type = 'insert';
      props.onOpenFile = jest.genMockFunction();

      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.handleSuccessfulUpload(file);
      expect(props.onOpenFile).toBeCalled();
    });

    it('should not openFile if type is not "insert"', () => {
      props.type = 'admin';
      props.onOpenFile = jest.genMockFunction();

      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.handleSuccessfulUpload(file);
      expect(props.onOpenFile).not.toBeCalled();
    });

    it('should not openFile if a file is open', () => {
      props.type = 'insert';
      props.fileId = 10;
      props.onOpenFile = jest.genMockFunction();

      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.handleSuccessfulUpload(file);
      expect(props.onOpenFile).not.toBeCalled();
    });

    it('should not openFile if items are still in the queue', () => {
      props.type = 'insert';
      props.queuedFiles.items.push({ _queuedAtTime: 35 });
      props.onOpenFile = jest.genMockFunction();

      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.handleSuccessfulUpload(file);
      expect(props.onOpenFile).not.toBeCalled();
    });
  });

  describe('handleSort()', () => {
    let gallery = null;

    beforeEach(() => {
      props.actions.queuedFiles.purgeUploadQueue = jest.genMockFunction();
      props.onSort = jest.genMockFunction();

      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should purge the upload queue', () => {
      gallery.handleSort('title,asc');
      expect(props.actions.queuedFiles.purgeUploadQueue).toBeCalled();
      expect(props.onSort).toBeCalledWith('title,asc');
    });
  });

  describe('handleSelectSort()', () => {
    let gallery = null;
    const event = {
      currentTarget: {
        value: 'title,desc',
      },
    };

    beforeEach(() => {
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
      gallery.handleSort = jest.genMockFunction();
    });

    it('should purge the upload queue', () => {
      gallery.handleSelectSort(event);
      expect(gallery.handleSort).toBeCalledWith('title,desc');
    });
  });

  describe('renderNoItemsNotice()', () => {
    it('should return the no items notice if there are no files', () => {
      props.count = 0;

      const gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );

      expect(JSON.stringify(gallery.renderNoItemsNotice())).toContain('gallery__no-item-notice');
    });

    it('should return null if there is at least one file', () => {
      props.files = [{ id: 1 }];
      props.count = 1;

      const gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );

      expect(gallery.renderNoItemsNotice()).toBe(null);
    });
  });

  describe('getBackButton()', () => {
    let gallery = null;

    beforeEach(() => {
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should not return a back button it we\'re at the top level', () => {
      expect(gallery.renderBackButton()).toBe(null);
    });

    it('should return a back button if parentID is set.', () => {
      props.folder = { parentID: 0 };
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
      const button = gallery.renderBackButton();

      expect(button).not.toBe(null);
      expect(button.type).toBe('button');
      expect(button.ref).toBe('backButton');
    });
  });

  describe('getBulkActionsComponent()', () => {
    let gallery = null;

    beforeEach(() => {
      props.bulkActions = true;

      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should not return a BulkActionsComponent if there are no selected items', () => {
      expect(gallery.renderBulkActions()).toBe(null);
    });

    it('should return a BulkActionsComponent if there are items in the selectedFiles array.', () => {
      props.selectedFiles = [1];
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );

      expect(gallery.renderBulkActions()).not.toBe(null);
    });
  });

  describe('itemIsSelected()', () => {
    let gallery = null;

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

  describe('handleActivate()', () => {
    let gallery = null;

    beforeEach(() => {
      props.onOpenFolder = jest.genMockFunction();
      props.onOpenFile = jest.genMockFunction();
      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
    });

    it('should call onOpenFolder', () => {
      const folder = { id: 1 };
      const event = new Event('activate');

      gallery.handleOpenFolder(event, folder);

      expect(props.onOpenFolder).toBeCalledWith(1);
    });

    it('should call onOpenFile', () => {
      const file = { id: 1 };
      const event = new Event('activate');

      gallery.handleOpenFile(event, file);

      expect(props.onOpenFile).toBeCalledWith(1, file);
    });
  });

  describe('handleSelect()', () => {
    let gallery = null;
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

      gallery.handleSelect(event, item);

      expect(props.actions.gallery.deselectFiles).toBeCalledWith([1]);
    });

    it('should set select the file is not currently selected', () => {
      const item = { id: 2 };

      gallery.handleSelect(event, item);

      expect(props.actions.gallery.selectFiles).toBeCalledWith([2]);
    });
  });

  describe('handleCreateFolder()', () => {
    let gallery = null;
    const mockFile = { name: 'newFolder' };
    const promise = Promise.resolve(mockFile);

    beforeEach(() => {
      props.actions.gallery.createFolder = jest.genMockFunction();
      props.actions.gallery.createFolder.mockReturnValue(promise);
      props.actions.gallery.addFiles = jest.genMockFunction();

      gallery = ReactTestUtils.renderIntoDocument(
        <Gallery {...props} />
      );
      gallery.promptFolderName = () => 'newFolder';
    });

    it('should add folder after successful create API call', () => {
      gallery.handleCreateFolder({
        preventDefault: () => {},
      }, 'newFolder');
      return promise.then(() => {
        expect(props.actions.gallery.addFiles).toBeCalled();
      });
    });
  });
});

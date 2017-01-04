/* global jest, describe, it, expect, beforeEach */

// mock GriddlePagination because it gives mutation warnings all over the place!
jest.mock('griddle-react', () => null);
jest.mock('components/FormAlert/FormAlert', () => null);
jest.unmock('i18n');
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
  let props = null;

  beforeEach(() => {
    props = {
      client: jest.genMockFromModule('apollo-client'),
      mutate: () => {},
      actions: {
        gallery: {
          selectFiles: () => {},
          deselectFiles: () => {},
          setPath: () => {},
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
        title: 'container folder',
        parentId: null,
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

  describe('renderSearchAlert()', () => {
    let gallery = null;

    beforeEach(() => {
      gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
    });

    it('should not show a message without filters', () => {
      const search = {};

      const message = gallery.getSearchMessage(search);

      expect(message).toBe('');
    });

    it('should show a message with filters', () => {
      const search = { currentFolderOnly: 1 };

      const message = gallery.getSearchMessage(search);

      expect(message).toContain('limited to');
    });

    it('should show a single message without conjoins with one item', () => {
      const search = { name: 'hi', };

      const message = gallery.getSearchMessage(search);

      expect(message).not.toContain(',');
      expect(message).not.toContain('and');
    });

    it('should show a message with "and" with two items', () => {
      const search = { name: 'hi', appCategory: 'IMAGE', };

      const message = gallery.getSearchMessage(search);

      expect(message).not.toContain(',');
      expect(message).toContain('and');
    });

    it('should show a message with "," and "and" with more than two items', () => {
      const search = { name: 'hi', appCategory: 'IMAGE', createdFrom: '2016-03-17' };

      const message = gallery.getSearchMessage(search);

      expect(message).toContain(',');
      expect(message).toContain('and');
    });
  });

  describe('compareFiles()', () => {
    let gallery = null;

    beforeEach(() => {
      gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
    });

    it('should not find differences on identical lists', () => {
      const left = [
        { id: 1 },
      ];
      const right = [
        { id: 1 },
      ];

      expect(gallery.compareFiles(left, right)).toBeFalsy();
    });

    it('should find differences on array length', () => {
      const left = [
        { id: 1 },
      ];
      const right = [
        { id: 1 },
        { id: 2 },
      ];

      expect(gallery.compareFiles(left, right)).toBeTruthy();
    });

    it('should find differences on "id" attribute', () => {
      const left = [
        { id: 1 },
      ];
      const right = [
        { id: 2 },
      ];

      expect(gallery.compareFiles(left, right)).toBeTruthy();
    });
  });

  describe('componentWillReceiveProps()', () => {
    let gallery = null;

    beforeEach(() => {
      props.files = [
        { id: 1 },
      ];
      gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
      // these are called on componentDidMount()...
      props.actions.queuedFiles.purgeUploadQueue = jest.genMockFunction();
    });

    it('should not call purgeUploadQueue when receiving same files', () => {
      gallery.componentWillReceiveProps(Object.assign({}, props, {
        files: [
          { id: 1 },
        ],
      }));
      expect(props.actions.queuedFiles.purgeUploadQueue).not.toBeCalled();
    });

    it('should call purgeUploadQueue when receiving new files', () => {
      gallery.componentWillReceiveProps(Object.assign({}, props, {
        files: [
          { id: 2 },
        ],
      }));
      expect(props.actions.queuedFiles.purgeUploadQueue).toBeCalled();
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
    it('should not render if parentId is not set', () => {
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
      const backButton = gallery.renderBackButton();

      expect(backButton).toBeNull();
    });

    it('should render a react component if parentId is set', () => {
      props.folder.parentId = 15;
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);
      const backButton = gallery.renderBackButton();

      expect(backButton).not.toBeNull();
    });
  });

  describe('handleBackClick()', () => {
    it('should open folder with parentId', () => {
      props.folder.parentId = 15;
      props.onOpenFolder = jest.genMockFunction();
      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.handleBackClick(new Event('click'));
      expect(props.onOpenFolder).toBeCalledWith(15);
    });
  });

  describe('handleSuccessfulUpload()', () => {
    const file = {
      exists: true,
      category: 'image',
      filename: 'unclepaul.png',
      width: 10,
      height: 10,
      size: 123,
      xhr: { response: '[{"id":1}]' },
    };

    it('should not call an action to remove the file from the `queuedFiles` state', () => {
      props.actions.queuedFiles.removeQueuedFile = jest.genMockFunction();

      const gallery = ReactTestUtils.renderIntoDocument(<Gallery {...props} />);

      gallery.handleSuccessfulUpload(file);
      expect(props.actions.queuedFiles.removeQueuedFile).not.toBeCalled();
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

    it('should return a back button if parentId is set.', () => {
      props.folder = { parentId: 0 };
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
  });
});

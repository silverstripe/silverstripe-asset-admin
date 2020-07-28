/* global jest, describe, it, pit, expect, beforeEach, jasmine */

// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('containers/Editor/Editor');
jest.mock('components/Search/Search');
jest.mock('containers/Gallery/Gallery');
jest.mock('containers/BulkDeleteConfirmation/BulkDeleteConfirmation');

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { Component as AssetAdmin } from '../AssetAdmin';

function getMockFile(id) {
  return {
    id,
    __typename: 'File',
  };
}

describe('AssetAdmin', () => {
  let props = null;

  beforeEach(() => {
    props = {
      client: {
        dataId: jest.fn()
          .mockReturnValue(getMockFile(1)),
      },
      dialog: true,
      sectionConfig: {
        url: '',
        limit: 10,
        createFileEndpoint: {
          url: '',
        },
        form: {
          fileEditForm: {
            schemaUrl: '',
          },
          fileSearchForm: {
            schemaUrl: '',
          },
        },
      },
      fileId: null,
      folderId: null,
      getUrl: jest.fn(),
      query: {
        sort: '',
        limit: 10,
        page: 1,
      },
      type: 'admin',
      files: [],
      queuedFiles: {
        items: [],
      },
      filesTotalCount: 20,
      folder: {
        id: 0,
        title: '',
        parents: [],
        parentId: 0,
        canView: true,
        canEdit: true,
      },
      actions: {
        gallery: {
          deselectFiles: jest.fn(),
          setErrorMessage: jest.fn(),
          setNoticeMessage: jest.fn(),
        },
        queuedFiles: {
          addQueuedFile: jest.fn(),
          failUpload: jest.fn(),
          purgeUploadQueue: jest.fn(),
          removeQueuedFile: jest.fn(),
          succeedUpload: jest.fn(),
        },
        files: {
          deleteFiles: jest.fn(() => Promise.resolve({ data: { deleteFiles: [] } })),
          readFiles: jest.fn(() => Promise.resolve()),
          publishFiles: jest.fn(() => Promise.resolve({ data: { publishFiles: [] } })),
          unpublishFiles: jest.fn(() => Promise.resolve({ data: { unpublishFiles: [] } })),
        },
        confirmDeletion: {
          deleting: jest.fn(),
        }
      },
    };
  });

  describe('handleSubmitEditor', () => {
    let component = null;
    let response = null;
    let propSubmit = null;
    let paramSubmit = null;

    beforeEach(() => {
      response = { record: {} };
      propSubmit = jest.fn(() => Promise.resolve(response));
      paramSubmit = jest.fn(() => Promise.resolve(response));
    });

    it('should call the onSubmitEditor property when that is supplied', () => {
      component = ReactTestUtils.renderIntoDocument(
        <AssetAdmin
          {...props}
          onSubmitEditor={propSubmit}
        />);
      component.handleSubmitEditor({}, 'action_test', paramSubmit);

      expect(propSubmit).toBeCalledWith({}, 'action_test', paramSubmit, undefined);
      expect(paramSubmit).not.toBeCalled();
    });

    it('should call the paramSubmit given when no onSubmitEditor is supplied', () => {
      component = ReactTestUtils.renderIntoDocument(
        <AssetAdmin
          {...props}
        />);
      component.handleSubmitEditor({}, 'action_test', paramSubmit);

      expect(paramSubmit).toBeCalled();
    });

    it('should call handleOpenFile if action is creating a folder in admin', () => {
      component = ReactTestUtils.renderIntoDocument(
        <AssetAdmin
          {...props}
        />);
      component.handleOpenFile = jest.fn();
      component.handleOpenFolder = jest.fn();

      return component.handleSubmitEditor({}, 'action_createfolder', paramSubmit)
        .then(() => {
          expect(component.handleOpenFile).toBeCalled();
          expect(component.handleOpenFolder).not.toBeCalled();
        });
    });

    it('should call handleOpenFolder if action is creating a folder not in admin', () => {
      props.type = 'insert-media';
      component = ReactTestUtils.renderIntoDocument(
        <AssetAdmin
          {...props}
        />);
      component.handleOpenFile = jest.fn();
      component.handleOpenFolder = jest.fn();

      return component.handleSubmitEditor({}, 'action_createfolder', paramSubmit)
        .then(() => {
          expect(component.handleOpenFile).not.toBeCalled();
          expect(component.handleOpenFolder).toBeCalled();
        });
    });
  });

  describe('handleBrowse', () => {
    let component = null;

    beforeEach(() => {
      props.folderId = 2;
      props.actions.gallery.deselectFiles = jest.fn();
      component = ReactTestUtils.renderIntoDocument(<AssetAdmin {...props} />);
    });

    it('should clear selected files when folder changes', () => {
      component.handleBrowse(3);

      expect(props.actions.gallery.deselectFiles).toBeCalled();
    });

    it('should not clear selected files', () => {
      component.handleBrowse(2);

      expect(props.actions.gallery.deselectFiles).not.toBeCalled();
    });
  });

  describe('handleDelete', () => {
    let component = null;

    beforeEach(() => {
      props.files = [
        getMockFile(1),
      ];
      props.queuedFiles = {
        items: [
          { ...getMockFile(2), queuedId: 2 },
        ],
      };
      component = ReactTestUtils.renderIntoDocument(<AssetAdmin {...props} />);
    });

    it('should delete a file', () => {
      const id = props.files[0].id;
      component.handleDelete([id]);

      expect(props.actions.files.deleteFiles).toBeCalledWith([id], 0);
    });

    it('should remove the file from the queued files list', () => {
      const id = props.queuedFiles.items[0].id;
      props.actions.queuedFiles.removeQueuedFile = jest.fn();
      return component.handleDelete([id]).then(() => {
        expect(props.actions.queuedFiles.removeQueuedFile)
          .toBeCalledWith(props.queuedFiles.items[0].queuedId);
      });
    });
  });
  describe('doPublish', () => {
    let component = null;

    beforeEach(() => {
      props.files = [
        getMockFile(1),
      ];
      props.queuedFiles = {
        items: [
          { ...getMockFile(2), queuedId: 2 },
        ],
      };
      component = ReactTestUtils.renderIntoDocument(<AssetAdmin {...props} />);
    });

    it('should publish a file', () => {
      const id = props.files[0].id;
      component.doPublish([id]);

      expect(props.actions.files.publishFiles).toBeCalledWith([id]);
    });
  });

  describe('doUnpublish', () => {
    let component = null;

    beforeEach(() => {
      props.files = [
        getMockFile(1),
      ];
      props.queuedFiles = {
        items: [
          { ...getMockFile(2), queuedId: 2 },
        ],
      };
      component = ReactTestUtils.renderIntoDocument(<AssetAdmin {...props} />);
    });

    it('should unpublish a file', () => {
      const id = props.files[0].id;
      component.doUnpublish([id]);

      expect(props.actions.files.unpublishFiles).toBeCalledWith([id], false);
    });
  });

  describe('handleUploadQueue', () => {
    let component = null;
    it('should refresh if a file is open', () => {
      props.fileId = 123;
      component = ReactTestUtils.renderIntoDocument(<AssetAdmin {...props} />);
      component.handleUploadQueue();
      expect(props.actions.files.readFiles).toBeCalled();
    });
    it('should not refresh if no file is open', () => {
      props.fileId = 0;
      component = ReactTestUtils.renderIntoDocument(<AssetAdmin {...props} />);
      component.handleUploadQueue();
      expect(props.actions.files.readFiles).not.toBeCalled();
    });
  });

  describe('getFiles', () => {
    const deriveFilesIDs = (_props) => {
      props = { ...props, ..._props };
      const component = ReactTestUtils.renderIntoDocument(<AssetAdmin {...props} />);
      return component.getFiles().map(({ id }) => id);
    };

    beforeEach(() => {
      props.files = [];
      props.queuedFiles = { items: [] };
      props.folderId = 99;
    });

    it('no files provided', () => {
      expect(deriveFilesIDs({})).toEqual([]);
    });

    it('some files in a folder', () => {
      expect(deriveFilesIDs({
        files: [
          { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
          { id: 2, name: 'file two', type: 'image/jpeg', parent: { id: 99 } }
        ]
      })).toEqual([1, 2]);
    });

    it('files+queuedFiles', () => {
      expect(deriveFilesIDs({
        files: [
          { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
          { id: 2, name: 'file two', type: 'image/jpeg', parent: { id: 99 } }
        ],
        queuedFiles: {
          items: [
            { id: 3, name: 'file three', type: 'image/jpeg', parent: { id: 99 } },
            { id: 4, name: 'file four', type: 'image/jpeg', parent: { id: 99 } }
          ]
        }
      })).toEqual([3, 4, 1, 2]);
    });

    it('upload error e.g. invalid file extension', () => {
      expect(deriveFilesIDs({
        files: [
          { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
        ],
        queuedFiles: {
          items: [
            {
              id: 0,
              name: 'invalid file attempted to upload',
              type: 'alien/artifact',
              parent: { id: 0 },
              message: { type: 'error', value: 'Invalid file extension' },
              uploadedToFolderId: 99,
            },
          ]
        }
      })).toEqual([0, 1]);
    });

    it('upload in progress', () => {
      expect(deriveFilesIDs({
        files: [
          { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
        ],
        queuedFiles: {
          items: [
            {
              id: 0,
              name: 'file uploading',
              type: 'image/jpeg',
              parent: { id: 0 },
              uploadedToFolderId: 99,
            },
          ]
        }
      })).toEqual([0, 1]);
    });

    it('upload in progress to root folder', () => {
      expect(deriveFilesIDs({
        files: [
          { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
        ],
        queuedFiles: {
          items: [
            {
              id: 0,
              name: 'file uploading',
              type: 'image/jpeg',
              parent: { id: 0 },
              uploadedToFolderId: 0,
            },
          ]
        },
        folderId: 0
      })).toEqual([0, 1]);
    });

    it('viewing a folder after uploading to a different folder', () => {
      expect(deriveFilesIDs({
        files: [
          { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
        ],
        queuedFiles: {
          items: [
            {
              id: 0,
              name: 'file uploaded',
              type: 'image/jpeg',
              parent: { id: 0 },
              uploadedToFolderId: 77,
            },
          ]
        },
      })).toEqual([1]);
    });
  });
});

/* global jest, describe, it, pit, expect, beforeEach, jasmine */

// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('containers/Editor/Editor');
jest.mock('components/Breadcrumb/Breadcrumb');
jest.mock('components/Search/Search');
jest.mock('containers/Gallery/Gallery');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { AssetAdmin } from '../AssetAdmin';

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
        dataId: jest.genMockFunction()
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
      onSubmitEditor: jest.fn(),
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
          deselectFiles: jest.genMockFunction(),
        },
        breadcrumbsActions: {},
        queuedFiles: {
          addQueuedFile: () => null,
          failUpload: () => null,
          purgeUploadQueue: () => null,
          removeQueuedFile: () => null,
          succeedUpload: () => null,
        },
        files: {
          deleteFile: jest.genMockFunction()
            .mockReturnValue(Promise.resolve()),
        },
      },
    };
  });

  describe('handleBrowse', () => {
    let component = null;

    beforeEach(() => {
      props.folderId = 2;
      props.actions.gallery.deselectFiles = jest.genMockFunction();
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
          Object.assign({}, getMockFile(2), { queuedId: 2 }),
        ],
      };
      component = ReactTestUtils.renderIntoDocument(<AssetAdmin {...props} />);
    });

    it('should delete a file', () => {
      const id = props.files[0].id;
      component.handleDelete(id);

      expect(props.actions.files.deleteFile).toBeCalledWith(id, getMockFile(1));
    });

    it('should deselect files after a delete', () => {
      const id = props.files[0].id;
      props.actions.gallery.deselectFiles = jest.genMockFunction();
      return component.handleDelete(id).then(() => {
        expect(props.actions.gallery.deselectFiles)
          .toBeCalledWith([id]);
      });
    });

    it('should remove the file from the queued files list', () => {
      const id = props.queuedFiles.items[0].id;
      props.actions.queuedFiles.removeQueuedFile = jest.genMockFunction();
      return component.handleDelete(id).then(() => {
        expect(props.actions.queuedFiles.removeQueuedFile)
          .toBeCalledWith(props.queuedFiles.items[0].queuedId);
      });
    });
  });
});

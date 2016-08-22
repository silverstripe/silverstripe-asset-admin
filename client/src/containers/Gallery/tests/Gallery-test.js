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
          selectFiles: () => null,
          deselectFiles: () => null,
          setPath: () => null,
          sortFiles: () => null,
          loadFolderContents: () => Promise.resolve(),
          deleteItems: () => null,
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
      folder: {
        id: 1,
        parentID: null,
        canView: true,
        canEdit: true,
      },
      queuedFiles: {
        items: [],
      },
      onOpenFile: () => {},
      onOpenFolder: () => {},
    };
  });


  describe('handleCreateFolder()', () => {
    let gallery;
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
      gallery.handleCreateFolder({}, 'newFolder');
      return promise.then(data => {
        expect(props.actions.gallery.addFiles).toBeCalled();
      });
    });
  })
});

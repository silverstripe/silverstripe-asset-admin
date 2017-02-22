/* global jest, describe, it, pit, expect, beforeEach, jasmine */

jest.unmock('react');
jest.unmock('react-dom');
jest.unmock('react-redux');
jest.unmock('react-addons-test-utils');
jest.unmock('../AssetAdmin');
jest.mock('containers/Editor/Editor');
jest.mock('components/Breadcrumb/Breadcrumb');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { AssetAdmin } from '../AssetAdmin';

const graphql = require('react-apollo').graphql;

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
        dataId: jest.fn(),
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
        gallery: {},
        breadcrumbsActions: {},
        queuedFiles: {
          addQueuedFile: () => null,
          failUpload: () => null,
          purgeUploadQueue: () => null,
          removeQueuedFile: () => null,
          succeedUpload: () => null,
        },
        mutate: {
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

      expect(props.actions.mutate.deleteFile.mock.calls.length).toBe(1);
      const callArgs = props.actions.mutate.deleteFile.mock.calls[0];
      expect(callArgs[0]).toEqual(id);
    });

    // TODO Fix promise returns in jest
    // pit('should deselect files after a delete', () => {
    //   const id = props.files[0].id;
    //   props.actions.gallery.deselectFiles = jest.genMockFunction();
    //   props.actions.mutate.deleteFile.mockReturnValue(Promise.resolve());
    //   return component.handleDelete(id).then(() => {
    //     expect(props.actions.gallery.deselectFiles.mock.calls.length)
    //       .toBe(1);
    //     expect(props.actions.gallery.deselectFiles.mock.calls[0])
    //       .toEqual([id]);
    //   });
    // });

    // TODO Fix promise returns in jest
    // pit('should remove the file from the queued files list', () => {
    //   const id = props.queuedFiles.items[0].id;
    //   props.actions.queuedFiles.removeQueuedFile = jest.genMockFunction();
    //   return component.handleDelete(id).then(() => {
    //     expect(props.actions.queuedFiles.removeQueuedFile.mock.calls.length)
    //       .toBe(1);
    //     expect(props.actions.queuedFiles.removeQueuedFile.mock.calls[0])
    //       .toEqual([props.queuedFiles.items[0].queuedId]);
    //   });
    // });
  });

  describe('graphql', () => {
    let graphqlData = null;
    let child1 = null;
    let child2 = null;
    let folder = null;

    beforeEach(() => {
      child1 = { node: { id: 2 } };
      child2 = { node: { id: 3 } };
      folder = {
        id: 1,
        children: {
          pageInfo: { totalCount: 2 },
          edges: [child1, child2],
        },
      };
      graphqlData = {
        data: {
          readFiles: {
            pageInfo: { totalCount: 1 },
            edges: [
              { node: folder },
            ],
          },
        },
      };
    });

    it('should map the readFiles data to props', () => {
      ReactTestUtils.renderIntoDocument(<AssetAdmin {...props} />);

      const graphqlOpts = graphql.mock.calls[0][1];
      const graphqlProps = graphqlOpts.props(graphqlData);

      expect(graphqlProps.files).toContain(child1.node);
      expect(graphqlProps.files).toContain(child2.node);
      expect(graphqlProps.filesTotalCount).toBe(2);
    });

    it('should calculate pagination info in options', () => {
      const ownProps = {
        sectionConfig: {},
        folderId: 1,
        query: {
          limit: 10,
          page: 3,
          sort: 'title desc',
        },
      };
      const graphqlOpts = graphql.mock.calls[0][1];
      const vars = graphqlOpts.options(ownProps);

      expect(vars.variables.limit).toBe(10);
      expect(vars.variables.offset).toBe(10 * 2);
    });

    it('should calculate pagination info on defaults in options', () => {
      const ownProps = {
        sectionConfig: {
          limit: 10,
        },
        folderId: 1,
        query: {
          limit: null,
          page: 3,
          sort: 'title desc',
        },
      };
      const graphqlOpts = graphql.mock.calls[0][1];
      const vars = graphqlOpts.options(ownProps);

      expect(vars.variables.limit).toBe(10);
      expect(vars.variables.offset).toBe(10 * 2);
    });
  });
});

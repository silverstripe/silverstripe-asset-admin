/* global jest, jasmine, describe, it, expect, beforeEach */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { Component as UploadField } from '../UploadField';

describe('UploadField', () => {
  let props = {};
  let file = null;

  const fileInSubFolder = {
    id: 2,
    name: 'MyFile.jpg',
    parent: {
      filename: 'Folder/SubFolder',
      id: 23,
      title: 'SubFolder',
    }
  };

  const fileInRoot = {
    id: 4,
    name: 'AnotherFile.jpg',
    parent: {
      filename: null,
      id: 0,
      title: null
    }
  };

  const fileUploadInProgress = {
    id: 0,
    queuedId: 'abc',
    name: 'NewFile.jpg',
    progress: 20
  };

  const files = [
    fileInSubFolder,
    fileInRoot,
    fileUploadInProgress,
  ];

  beforeEach(() => {
    props = {
      id: 'Form_MyTestUpload',
      name: 'MyTestUpload',
      files,
      onChange: jest.fn(),
      actions: {
        uploadField: {
          setFiles: jest.fn(),
          removeFile: jest.fn(),
        },
        modal: {
          initFormStack: jest.fn(),
          reset: jest.fn(),
        }
      },
      data: {
        multi: true,
        maxFiles: null,
        maxFilesize: null,
        createFileEndpoint: {
          url: 'test',
          method: 'POST',
          payloadFormat: 'json',
        },
        parentid: 0,
        files,
        canAttach: true,
        canUpload: true,
      },
      value: {
        Files: [2, 4],
      },
      securityId: 'TestingBob',
      UploadFieldItem: () => null,
      AssetDropzone: () => null,
      InsertMediaModal: () => null,
    };
  });

  describe('getMaxFiles()', () => {
    it('should be a max one always for single file uploadfields', () => {
      props.data.multi = false;
      props.data.maxFiles = 1;
      props.files = [];
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );
      let maxFiles = file.getMaxFiles();

      expect(maxFiles).toBe(1);

      props.data.maxFiles = 3;
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );
      maxFiles = file.getMaxFiles();

      expect(maxFiles).toBe(1);
    });

    it('should return null if max files prop was left empty', () => {
      props.data.multi = true;
      props.data.maxFiles = null;
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );
      let maxFiles = file.getMaxFiles();

      expect(maxFiles).toBe(null);

      props.data.maxFiles = undefined;
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );
      maxFiles = file.getMaxFiles();

      expect(maxFiles).toBe(null);
    });

    it('should return a positive number or zero', () => {
      props.data.multi = true;
      props.data.maxFiles = 2;
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );
      let maxFiles = file.getMaxFiles();

      expect(maxFiles).toBe(0);

      props.data.maxFiles = 5;
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );
      maxFiles = file.getMaxFiles();

      expect(maxFiles).toBe(3);
    });
  });

  describe('getFolderId()', () => {
    it('should match the the parentid of a provided file', () => {
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );
      file.handleReplaceShow({}, fileInSubFolder);

      let folderId = file.getFolderId();
      expect(folderId).toBe(fileInSubFolder.parent.id);

      props.data.parentid = 23;
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );
      file.handleReplaceShow({}, fileInSubFolder);

      folderId = file.getFolderId();
      expect(folderId).toBe(fileInSubFolder.parent.id);
    });

    it('should match 0 for file in root', () => {
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );

      const folderId = file.getFolderId();

      expect(folderId).toBe(0);
    });

    it('should match parentid when not viewing specific file', () => {
      props.data.parentid = 23;

      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );

      const folderId = file.getFolderId();
      expect(folderId).toBe(props.data.parentid);
    });

    it('should match 0 (filse system root id) when no parentid specified', () => {
      delete props.data.parentid;

      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );

      const folderId = file.getFolderId();
      expect(folderId).toBe(0);
    });
  });

  describe('componentDidMount()', () => {
    it('should set the files for redux-form to use for submit', () => {
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );
      file.componentDidMount();

      expect(props.actions.uploadField.setFiles).toBeCalled();
    });
  });

  describe('componentWillReceiveProps', () => {
    beforeEach(() => {
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );
    });

    it('should not call onChange for the same file list', () => {
      file.componentWillReceiveProps(props);

      expect(props.onChange).not.toBeCalled();
    });


    it('should call onChange when an item was added to the file list', () => {
      const newProps = Object.assign({}, props, {
        files: [
          ...props.files,
          { id: 9 },
        ],
      });
      file.componentWillReceiveProps(newProps);

      expect(props.onChange).toBeCalled();
    });

    it('should call onChange if one of the item ids change', () => {
      const newProps = Object.assign({}, props, {
        files: [
          ...props.files.filter((item) => item.id !== 4),
          { id: 12 },
        ],
      });
      file.componentWillReceiveProps(newProps);

      expect(props.onChange).toBeCalled();
    });
  });

  describe('renderDropzone', () => {
    it('should not render the dropzone when there is not create endpoint', () => {
      props.data.createFileEndpoint = null;
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );

      const dropzone = file.renderDropzone();

      expect(dropzone).toBe(null);
    });

    it('should hide the dropzone when maxFiles reached', () => {
      props.data.multi = true;
      props.data.maxFiles = 2;
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );

      const dropzone = file.renderDropzone();

      expect(dropzone.props.className.split(' ')).toContain('uploadfield__dropzone--hidden');
    });

    it('should show the dropzone when maxFiles has not been reached', () => {
      props.data.multi = true;
      props.data.maxFiles = 4;
      file = ReactTestUtils.renderIntoDocument(
        <UploadField {...props} />
      );

      const dropzone = file.renderDropzone();

      expect(dropzone.props.className.split(' ')).not.toContain('uploadfield__dropzone--hidden');
    });
  });
});

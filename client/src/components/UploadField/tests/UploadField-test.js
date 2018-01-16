/* global jest, jasmine, describe, it, expect, beforeEach */

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as UploadField } from '../UploadField';

describe('UploadField', () => {
  let props = {};
  let file = null;
  const files = [
    { id: 2, name: 'MyFile.jpg' },
    { id: 4, name: 'AnotherFile.jpg' },
    { id: 0, queuedId: 'abc', name: 'NewFile.jpg', progress: 20 },
  ];

  beforeEach(() => {
    props = {
      id: 'Form_MyTestUpload',
      name: 'MyTestUpload',
      files,
      onChange: jest.fn(),
      actions: {
        uploadField: {
          setFiles: jest.genMockFunction(),
          removeFile: jest.genMockFunction(),
        },
      },
      data: {
        createFileEndpoint: {
          url: 'test',
          method: 'POST',
          payloadFormat: 'json',
        },
        parentid: 0,
        files,
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
      props.data.maxFiles = 3;
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

/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('../FileField.js');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { FileField } from '../FileField.js';

describe('FileField', () => {
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
      onChange: jest.genMockFunction(),
      actions: {
        fileField: {
          setFiles: jest.genMockFunction(),
          removeFile: jest.genMockFunction(),
        },
      },
      data: { files },
      value: {
        Files: [2, 4],
      },
    };
  });

  describe('componentDidMount()', () => {
    it('should set the files for redux-form to use for submit', () => {
      file = ReactTestUtils.renderIntoDocument(
        <FileField {...props} />
      );
      file.componentDidMount();

      expect(props.actions.fileField.setFiles).toBeCalled();
    });
  });

  describe('componentWillReceiveProps', () => {
    beforeEach(() => {
      file = ReactTestUtils.renderIntoDocument(
        <FileField {...props} />
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
});

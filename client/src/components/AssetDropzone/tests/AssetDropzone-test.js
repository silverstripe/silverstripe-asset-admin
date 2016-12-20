/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('react');
jest.unmock('dropzone');
jest.unmock('../AssetDropzone');
jest.unmock('lib/DataFormat');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import AssetDropzone from '../AssetDropzone';

describe('AssetDropzone', () => {
  let props = null;

  beforeEach(() => {
    props = {
      options: {
        url: 'upload',
      },
      handleAddedFile: jest.genMockFunction(),
      handleError: jest.genMockFunction(),
      handleSuccess: jest.genMockFunction(),
      folderId: 1,
      securityID: '123',
      canUpload: true,
    };
  });

  describe('constructor()', () => {
    let item = null;

    beforeEach(() => {
      item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...props} />
      );
    });

    it('should set this.dropzone to null', () => {
      item.dropzone = 1;
      item.constructor(props);

      expect(item.dropzone).toBe(null);
    });
  });

  describe('handleError()', () => {
    it('should remove the file in dropzone', () => {
      const item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...props} />
      );
      item.dropzone = {
        removeFile: jest.genMockFunction(),
      };
      const file = {};

      item.handleError(file, '');
      expect(item.dropzone.removeFile).toBeCalledWith(file);
      expect(props.handleError).toBeCalledWith(file, '');
    });
  });

  describe('handleSuccess()', () => {
    it('should remove the file in dropzone', () => {
      const item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...props} />
      );
      item.dropzone = {
        removeFile: jest.genMockFunction(),
      };
      const file = {};

      item.handleSuccess(file);
      expect(item.dropzone.removeFile).toBeCalledWith(file);
      expect(props.handleSuccess).toBeCalledWith(file);
    });
  });

  describe('props.maxFiles', () => {
    let item = null;

    beforeEach(() => {
      props.handleMaxFilesExceeded = jest.genMockFunction();
      props.options.maxFiles = 2;
      item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...props} />
      );
    });

    it('should not remove anything if not exceeded', () => {
      item.dropzone = {
        files: ['a'],
        removeFile: jest.genMockFunction(),
      };

      item.handleAddedFile({});

      expect(item.dropzone.removeFile).not.toBeCalled();
      expect(props.handleMaxFilesExceeded).not.toBeCalled();
    });

    it('should remove the first file if exceeded and trigger callback', () => {
      item.dropzone = {
        files: ['a', 'b', 'c'],
        removeFile: jest.genMockFunction(),
      };

      item.handleAddedFile({});

      expect(item.dropzone.removeFile).toBeCalled();
      expect(props.handleMaxFilesExceeded).toBeCalled();
    });
  });

  describe('xhr.abort()', () => {
    it('should call dropzone.cancelUpload() when abort is called', () => {
      props.handleSending = (file, xhr) => {
        xhr.abort();
      };
      const item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...props} />
      );
      item.dropzone = {
        cancelUpload: jest.genMockFunction(),
      };

      item.handleSending({}, { abort: () => null }, new FormData());

      expect(item.dropzone.cancelUpload).toBeCalled();
    });
  });

  describe('componentDidMount()', () => {
    let item = null;

    beforeEach(() => {
      props.promptOnRemove = 'prompt';

      item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...props} />
      );
    });

    it('should set this.dropzone to a new Dropzone', () => {
      expect(item.dropzone.options.url).toBe('upload');
    });

    it('should call setPromptOnRemove if props.promptOnRemove is set', () => {
      expect(item.dropzone.options.dictRemoveFileConfirmation).toBe('prompt');
    });
  });

  describe('componentWillUnmount()', () => {
    let item = null;

    beforeEach(() => {
      item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...props} />
      );
    });

    it('should remove all dropzone listeners', () => {
      item.dropzone.disable = jest.genMockFunction();
      item.componentWillUnmount();

      expect(item.dropzone.disable).toBeCalled();
    });
  });

  describe('handleAddedFile()', () => {
    let item = null;
    let uploadProps = null;

    beforeEach(() => {
      uploadProps = Object.assign({}, props, {
        handleAddedFile: jest.genMockFunction(),
      });
    });

    it('restricts uploading', (done) => {
      uploadProps.canUpload = false;

      item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...uploadProps} />
      );

      return item.handleAddedFile({})
        .then(() => {
          expect("This shouldn't be called").toBeFalsey();
        })
        .catch((error) => {
          expect(error instanceof Error).toBeTruthy();
        })
        .then(() => done());
    });

    it('loads non-images', (done) => {
      const file = {
        size: 123,
        name: 'Test file',
        type: 'text/plain',
      };

      item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...uploadProps} />
      );
      item.dropzone = {
        processFile: jest.genMockFunction(),
      };

      return item.handleAddedFile(file)
        .then((details) => {
          expect(uploadProps.handleAddedFile).toBeCalled();
          expect(item.dropzone.processFile).toBeCalled();
          expect(details.size).toBe(123);
          expect(details.title).toBe('Test file');
          expect(details.url).toBeUndefined();
        })
        .catch(() => {
          expect("This shouldn't be called").toBeFalsey();
        })
        .then(() => done());
    });
  });

  describe('setPromptOnRemove()', () => {
    let item = null;

    beforeEach(() => {
      item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...props} />
      );
    });

    it('should set dropzone.options.dictRemoveFileConfirmation to the given string', () => {
      item.setPromptOnRemove('prompt');

      expect(item.dropzone.options.dictRemoveFileConfirmation).toBe('prompt');
    });
  });
});

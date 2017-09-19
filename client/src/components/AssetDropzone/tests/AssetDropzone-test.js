/* global jest, jasmine, describe, it, expect, beforeEach, FormData */

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
      onAddedFile: jest.fn(),
      onError: jest.fn(),
      onSuccess: jest.fn(),
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
      expect(props.onError).toBeCalledWith(file, '');
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
      expect(props.onSuccess).toBeCalledWith(file);
    });
  });

  describe('props.maxFiles', () => {
    let item = null;

    beforeEach(() => {
      props.onMaxFilesExceeded = jest.genMockFunction();
      props.options.maxFiles = 2;
      item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...props} />
      );
    });

    it('should not remove anything if not exceeded', () => {
      item.dropzone.files = [{ accepted: true }];
      item.dropzone.accept({ name: 'test', size: 100 }, () => {});

      expect(props.onMaxFilesExceeded).not.toBeCalled();
    });

    it('should remove the first file if exceeded and trigger callback', () => {
      item.dropzone.files = [
        { accepted: true },
        { accepted: true },
        { accepted: true },
      ];
      item.dropzone.accept({ name: 'test', size: 100 }, () => {});

      expect(props.onMaxFilesExceeded).toBeCalled();
    });
  });

  describe('xhr.abort()', () => {
    it('should call dropzone.cancelUpload() when abort is called', () => {
      props.onSending = (file, xhr) => {
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
        onAddedFile: jest.fn(),
        onPreviewLoaded: jest.fn(),
      });
    });

    it('validates uploads', () => {
      uploadProps.canUpload = false;

      item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...uploadProps} />
      );
      item.dropzone._errorProcessing = jest.genMockFunction();
      item.dropzone.addFile({ name: 'test', size: 100, type: 'text/plain' });
      // The error gets called asynchronously
      return new Promise(resolve => {
        setTimeout(() => {
          expect(item.dropzone._errorProcessing).toBeCalled();
          resolve();
        }, 0);
      });
    });

    it('loads non-images', () => {
      const file = {
        size: 123,
        name: 'Test file',
        type: 'text/plain',
      };

      item = ReactTestUtils.renderIntoDocument(
        <AssetDropzone {...uploadProps} />
      );
      item.getLoadPreview = () => Promise.resolve({});

      return item.handleAddedFile(file)
        .then((details) => {
          expect(uploadProps.onAddedFile).toBeCalled();
          expect(uploadProps.onPreviewLoaded).toBeCalled();
          expect(details.size).toBe(123);
          expect(details.title).toBe('Test file');
          expect(details.url).toBeUndefined();
        });
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

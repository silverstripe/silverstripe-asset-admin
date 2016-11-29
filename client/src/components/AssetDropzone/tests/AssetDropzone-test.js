/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('../AssetDropzone.js');
jest.unmock('dropzone');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import AssetDropzone from '../AssetDropzone.js';

describe('AssetDropzone', () => {
  let props = null;

  beforeEach(() => {
    props = {
      options: {
        url: 'upload',
      },
      handleAddedFile: () => null,
      handleError: () => null,
      handleSuccess: () => null,
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
          expect(details.size).toBe('123 bytes');
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

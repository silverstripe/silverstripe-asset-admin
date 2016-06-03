/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('../AssetDropzone.js');
jest.unmock('dropzone');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import AssetDropzone from '../AssetDropzone.js';

describe('AssetDropzone', () => {
  let props;

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
    let item;

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
    let item;

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
    let item;

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
  });

  describe('setPromptOnRemove()', () => {
    let item;

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

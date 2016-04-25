/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('../Dropzone.js');
jest.unmock('dropzone');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import DropzoneComponent from '../Dropzone.js';

describe('DropzoneComponent', () => {
  let props;

  beforeEach(() => {
    props = {
      options: {
        url: 'upload',
      },
      handleAddedFile: () => null,
      handleError: () => null,
      handleSuccess: () => null,
      folderID: 1,
      securityID: '123',
    };
  });

  describe('constructor()', () => {
    let Dropzone;

    beforeEach(() => {
      Dropzone = ReactTestUtils.renderIntoDocument(
        <DropzoneComponent {...props} />
      );
    });

    it('should set this.dropzone to null', () => {
      Dropzone.dropzone = 1;
      Dropzone.constructor(props);

      expect(Dropzone.dropzone).toBe(null);
    });
  });

  describe('componentDidMount()', () => {
    let Dropzone;

    beforeEach(() => {
      props.promptOnRemove = 'prompt';

      Dropzone = ReactTestUtils.renderIntoDocument(
        <DropzoneComponent {...props} />
      );
    });

    it('should set this.dropzone to a new Dropzone', () => {
      expect(Dropzone.dropzone.options.url).toBe('upload');
    });

    it('should call setPromptOnRemove if props.promptOnRemove is set', () => {
      expect(Dropzone.dropzone.options.dictRemoveFileConfirmation).toBe('prompt');
    });
  });

  describe('componentWillUnmount()', () => {
    let Dropzone;

    beforeEach(() => {
      Dropzone = ReactTestUtils.renderIntoDocument(
        <DropzoneComponent {...props} />
      );
    });

    it('should remove all dropzone listeners', () => {
      Dropzone.dropzone.disable = jest.genMockFunction();
      Dropzone.componentWillUnmount();

      expect(Dropzone.dropzone.disable).toBeCalled();
    });
  });

  describe('handleAddedFile()', () => {
  });

  describe('setPromptOnRemove()', () => {
    let Dropzone;

    beforeEach(() => {
      Dropzone = ReactTestUtils.renderIntoDocument(
        <DropzoneComponent {...props} />
      );
    });

    it('should set dropzone.options.dictRemoveFileConfirmation to the given string', () => {
      Dropzone.setPromptOnRemove('prompt');

      expect(Dropzone.dropzone.options.dictRemoveFileConfirmation).toBe('prompt');
    });
  });
});

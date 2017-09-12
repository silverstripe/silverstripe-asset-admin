/* global jest, jasmine, describe, it, expect, beforeEach */

jest.mock('components/AssetDropzone/AssetDropzone');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as PreviewImageField } from '../PreviewImageField';

describe('PreviewImageField', () => {
  let props = null;

  beforeEach(() => {
    props = {
      id: 'Form_Test_Field',
      data: {
        category: 'file',
        exists: true,
        nameField: 'Name',
      },
      onAutofill: jest.fn(),
      actions: {
        previewField: {
          removeFile: jest.genMockFunction(),
        },
      },
    };
  });

  describe('handleSuccessfulUpload()', () => {
    it('should auto the tuple fields with the given response data', () => {
      const fileXhr = {
        xhr: {
          response: JSON.stringify({
            Filename: 'abc.jpg',
            Name: 'abc.jpg',
            Hash: 'zxcvqwer',
            Variant: '123',
          }),
        },
      };
      const item = ReactTestUtils.renderIntoDocument(
        <PreviewImageField {...props} />
      );
      item.handleSuccessfulUpload(fileXhr);

      expect(props.onAutofill.mock.calls.length).toBe(4);
      expect(props.onAutofill.mock.calls[0][0]).toBe('FileFilename');
      expect(props.onAutofill.mock.calls[0][1]).toBe('abc.jpg');
      expect(props.onAutofill.mock.calls[1][0]).toBe('FileHash');
      expect(props.onAutofill.mock.calls[1][1]).toBe('zxcvqwer');
      expect(props.onAutofill.mock.calls[2][0]).toBe('FileVariant');
      expect(props.onAutofill.mock.calls[2][1]).toBe('123');
      expect(props.onAutofill.mock.calls[3][0]).toBe('Name');
      expect(props.onAutofill.mock.calls[3][1]).toBe('abc.jpg');
    });
  });

  describe('handleRemoveErroredUpload()', () => {
    it('should autofill the tuple fields with initial values and call removeFile', () => {
      props.data.initialValues = {
        FileFilename: 'abc.jpg',
        FileHash: 'zxcvqwer',
        FileVariant: '123',
      };
      const item = ReactTestUtils.renderIntoDocument(
        <PreviewImageField {...props} />
      );
      item.handleRemoveErroredUpload();

      expect(props.onAutofill.mock.calls.length).toBe(3);
      expect(props.onAutofill.mock.calls[0][0]).toBe('FileFilename');
      expect(props.onAutofill.mock.calls[0][1]).toBe('abc.jpg');
      expect(props.onAutofill.mock.calls[1][0]).toBe('FileHash');
      expect(props.onAutofill.mock.calls[1][1]).toBe('zxcvqwer');
      expect(props.onAutofill.mock.calls[2][0]).toBe('FileVariant');
      expect(props.onAutofill.mock.calls[2][1]).toBe('123');
      expect(props.actions.previewField.removeFile).toBeCalled();
    });
  });

  describe('canFileUpload()', () => {
    let file = null;
    beforeEach(() => {
      props.data.initialValues = { FileFilename: 'test.jpg' };
      file = {};
    });

    it('should return true if the extension is the same', () => {
      file.name = 'test-replace.jpg';
      const item = ReactTestUtils.renderIntoDocument(
        <PreviewImageField {...props} />
      );
      const canUpload = item.canFileUpload(file);

      expect(canUpload).toBe(true);
    });

    it('should return true if there is no initial filename defined', () => {
      props.data.initialValues.FileFilename = '';
      const item = ReactTestUtils.renderIntoDocument(
        <PreviewImageField {...props} />
      );
      const canUpload = item.canFileUpload(file);

      expect(canUpload).toBe(true);
    });

    it('should return what the confirm callback gives when the extension changes', () => {
      props.confirm = () => 'abc';
      file.name = 'test.txt';
      const item = ReactTestUtils.renderIntoDocument(
        <PreviewImageField {...props} />
      );
      const canUpload = item.canFileUpload(file);

      expect(canUpload).toBe('abc');
    });
  });

  describe('canEdit()', () => {
    it('should enable edit for file types', () => {
      const item = ReactTestUtils.renderIntoDocument(
        <PreviewImageField {...props} />
      );
      const edit = item.canEdit();

      expect(edit).toBe(true);
    });

    it('should disable edit when readonly', () => {
      props.readOnly = true;
      const item = ReactTestUtils.renderIntoDocument(
        <PreviewImageField {...props} />
      );
      const edit = item.canEdit();

      expect(edit).toBe(false);
    });

    it('should disable edit when disabled', () => {
      props.disabled = true;
      const item = ReactTestUtils.renderIntoDocument(
        <PreviewImageField {...props} />
      );
      const edit = item.canEdit();

      expect(edit).toBe(false);
    });

    it('should disable edit when it is a folder', () => {
      props.data.category = 'folder';
      const item = ReactTestUtils.renderIntoDocument(
        <PreviewImageField {...props} />
      );
      const edit = item.canEdit();

      expect(edit).toBe(false);
    });
  });
});

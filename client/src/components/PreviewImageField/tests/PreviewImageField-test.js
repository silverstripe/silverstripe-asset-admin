/* global jest, test, expect, beforeEach */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as PreviewImageField } from '../PreviewImageField';

jest.mock('components/AssetDropzone/AssetDropzone');

let nextAction;
let nextParam;
let lastReturn;
beforeEach(() => {
  nextAction = undefined;
  nextParam = undefined;
  lastReturn = undefined;
});

function makeProps(obj = {}) {
  return {
    id: 'Form_Test_Field',
    data: {
      category: 'file',
      exists: true,
      nameField: 'Name',
    },
    onAutofill: () => null,
    actions: {
      previewField: {
        removeFile: () => null,
      },
    },
    AssetDropzoneComponent: ({ onSuccess, canFileUpload, onUploadComplete, children }) => <div
      data-testid="test-asset-dropzone"
      onClick={() => {
        if (nextAction === 'response') {
          onSuccess(nextParam);
        } else if (nextAction === 'canfileupload') {
          lastReturn = canFileUpload(nextParam);
        } else if (nextAction === 'uploadcomplete') {
          onUploadComplete(nextParam);
        }
      }}
    >{children}</div>,
    ...obj
  };
}

test('PreviewImageField handleSuccessfulUpload should auto the tuple fields with the given response data', async () => {
  const onAutofill = jest.fn();
  render(
    <PreviewImageField {...makeProps({
      onAutofill,
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'response';
  nextParam = {
    xhr: {
      response: JSON.stringify({
        Filename: 'abc.jpg',
        Name: 'abc.jpg',
        Hash: 'zxcvqwer',
        Variant: '123',
      }),
    },
  };
  fireEvent.click(dropzone);
  expect(onAutofill.mock.calls.length).toBe(4);
  expect(onAutofill.mock.calls[0][0]).toBe('FileFilename');
  expect(onAutofill.mock.calls[0][1]).toBe('abc.jpg');
  expect(onAutofill.mock.calls[1][0]).toBe('FileHash');
  expect(onAutofill.mock.calls[1][1]).toBe('zxcvqwer');
  expect(onAutofill.mock.calls[2][0]).toBe('FileVariant');
  expect(onAutofill.mock.calls[2][1]).toBe('123');
});

test('PreviewImageField handleRemoveErroredUpload should auto the tuple fields with initial values and call removeFile', async () => {
  const onAutofill = jest.fn();
  const removeFile = jest.fn();
  render(
    <PreviewImageField {...makeProps({
      onAutofill,
      upload: {
        progress: 100,
        status: 'success'
      },
      data: {
        mock: true,
        initialValues: {
          FileFilename: 'abc.jpg',
          FileHash: 'zxcvqwer',
          FileVariant: '123',
        }
      },
      actions: {
        previewField: {
          removeFile
        }
      }
    })}
    />
  );
  const undo = await screen.findByRole('button', 'Undo');
  fireEvent.click(undo);
  expect(onAutofill.mock.calls.length).toBe(3);
  expect(onAutofill.mock.calls[0][0]).toBe('FileFilename');
  expect(onAutofill.mock.calls[0][1]).toBe('abc.jpg');
  expect(onAutofill.mock.calls[1][0]).toBe('FileHash');
  expect(onAutofill.mock.calls[1][1]).toBe('zxcvqwer');
  expect(onAutofill.mock.calls[2][0]).toBe('FileVariant');
  expect(onAutofill.mock.calls[2][1]).toBe('123');
  expect(removeFile).toHaveBeenCalled();
});

test('PreviewImageField canFileUpload() should return true if the extension is the same', async () => {
  render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        initialValues: {
          FileFilename: 'test.jpg'
        }
      },
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'canfileupload';
  nextParam = {
    name: 'test-replace.jpg',
  };
  fireEvent.click(dropzone);
  expect(lastReturn).toBe(true);
});

test('PreviewImageField canFileUpload() should return true if the extension is the same', async () => {
  render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        initialValues: {}
      },
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'canfileupload';
  nextParam = {
    name: 'test-replace.jpg',
  };
  fireEvent.click(dropzone);
  expect(lastReturn).toBe(true);
});

test('PreviewImageField canFileUpload() should return what the confirm callback gives when the extension changes', async () => {
  render(
    <PreviewImageField {...makeProps({
      confirm: () => 'abc',
      data: {
        mock: true,
        initialValues: {
          FileFilename: 'test.jpg'
        }
      },
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'canfileupload';
  nextParam = {
    name: 'test-replace.png',
  };
  fireEvent.click(dropzone);
  expect(lastReturn).toBe('abc');
});

test('PreviewImageField canEdit() should enable edit for file types', () => {
  const { container } = render(
    <PreviewImageField {...makeProps()}/>
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]')).not.toBeNull();
});

test('PreviewImageField canEdit() should disable edit when readonly', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      readOnly: true
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]')).toBeNull();
});

test('PreviewImageField canEdit() should disable edit when disabled', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      disabled: true
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]')).toBeNull();
});

test('PreviewImageField canEdit() should disable edit when it is a folder', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        category: 'folder'
      }
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]')).toBeNull();
});

test('PreviewImageField preview bust cache default', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'logo.jpg',
        version: 1
      }
    })}
    />
  );
  expect(container.querySelector('.editor__file-preview-link').getAttribute('href')).toBe('logo.jpg?vid=1');
});

test('PreviewImageField preview bust cache enabled', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'logo.jpg',
        version: 1
      },
      bustCache: true
    })}
    />
  );
  expect(container.querySelector('.editor__file-preview-link').getAttribute('href')).toBe('logo.jpg?vid=1');
});

test('PreviewImageField preview bust cache disabled', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'logo.jpg',
        version: 1
      },
      bustCache: false
    })}
    />
  );
  expect(container.querySelector('.editor__file-preview-link').getAttribute('href')).toBe('logo.jpg');
});

test('PreviewImageField preview bust cache disabled with no version', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'logo.jpg'
      },
      bustCache: false
    })}
    />
  );
  expect(container.querySelector('.editor__file-preview-link').getAttribute('href')).toBe('logo.jpg');
});

test('PreviewImageField handleUploadComplete() success', async () => {
  const updateStatus = jest.fn();
  render(
    <PreviewImageField {...makeProps({
      upload: {
        progress: 100,
        status: 'success',
        category: 'image',
        extension: 'png',
        filename: 'test.png',
      },
      actions: {
        previewField: {
          updateStatus,
          removeFile: () => null
        }
      }
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'uploadcomplete';
  nextParam = 'success';
  fireEvent.click(dropzone);
  expect(updateStatus.mock.calls.length).toBe(1);
  expect(updateStatus.mock.calls[0][0]).toBe('Form_Test_Field');
  expect(updateStatus.mock.calls[0][1]).toStrictEqual({ status: 'success' });
  const el = await screen.findByText('Upload successful, the file will be replaced when you Save.');
  expect(el.classList).toContain('preview-image-field__message');
});

test('PreviewImageField handleUploadComplete() success', async () => {
  const updateStatus = jest.fn();
  render(
    <PreviewImageField {...makeProps({
      upload: {
        progress: 100,
        status: 'error',
        category: 'text',
        extension: 'txt',
        filename: 'test.txt',
        errors: [
          {
            code: 400,
            type: 'error',
            value: 'Filesize is too large, maximum 100 KB allowed',
          }
        ]
      },
      actions: {
        previewField: {
          updateStatus,
          removeFile: () => null
        }
      }
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'uploadcomplete';
  nextParam = 'error';
  fireEvent.click(dropzone);
  expect(updateStatus.mock.calls.length).toBe(1);
  expect(updateStatus.mock.calls[0][0]).toBe('Form_Test_Field');
  expect(updateStatus.mock.calls[0][1]).toStrictEqual({ status: 'error' });
  const el = await screen.findByText('Filesize is too large, maximum 100 KB allowed');
  expect(el.classList).toContain('preview-image-field__message');
});

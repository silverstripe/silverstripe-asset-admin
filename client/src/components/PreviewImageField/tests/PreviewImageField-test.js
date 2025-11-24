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

test('PreviewImageField handleAddedFile should call addFile action', async () => {
  const addFile = jest.fn();
  render(
    <PreviewImageField {...makeProps({
      actions: {
        previewField: {
          addFile,
          removeFile: () => null
        }
      },
      AssetDropzoneComponent: ({ onAddedFile, children }) => <div
        data-testid="test-asset-dropzone"
        onClick={() => {
          if (nextAction === 'addedfile') {
            onAddedFile(nextParam);
          }
        }}
      >{children}</div>,
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'addedfile';
  nextParam = { name: 'test.jpg', size: 1024 };
  fireEvent.click(dropzone);
  expect(addFile).toHaveBeenCalledWith('Form_Test_Field', { name: 'test.jpg', size: 1024 });
});

test('PreviewImageField handleFailedUpload should call failUpload action', async () => {
  const failUpload = jest.fn();
  render(
    <PreviewImageField {...makeProps({
      actions: {
        previewField: {
          failUpload,
          removeFile: () => null
        }
      },
      AssetDropzoneComponent: ({ onError, children }) => <div
        data-testid="test-asset-dropzone"
        onClick={() => {
          if (nextAction === 'error') {
            onError(nextParam, { error: 'Upload error' });
          }
        }}
      >{children}</div>,
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'error';
  nextParam = { name: 'test.jpg' };
  fireEvent.click(dropzone);
  expect(failUpload).toHaveBeenCalledWith('Form_Test_Field', { error: 'Upload error' });
});

test('PreviewImageField handleSending should update file with xhr', async () => {
  const updateFile = jest.fn();
  render(
    <PreviewImageField {...makeProps({
      actions: {
        previewField: {
          updateFile,
          removeFile: () => null
        }
      },
      AssetDropzoneComponent: ({ onSending, children }) => <div
        data-testid="test-asset-dropzone"
        onClick={() => {
          if (nextAction === 'sending') {
            onSending({ name: 'test.jpg' }, nextParam);
          }
        }}
      >{children}</div>,
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'sending';
  nextParam = { upload: { progress: 0 } };
  fireEvent.click(dropzone);
  expect(updateFile).toHaveBeenCalledWith('Form_Test_Field', { xhr: { upload: { progress: 0 } } });
});

test('PreviewImageField handleUploadProgress should update file with progress', async () => {
  const updateFile = jest.fn();
  render(
    <PreviewImageField {...makeProps({
      actions: {
        previewField: {
          updateFile,
          removeFile: () => null
        }
      },
      AssetDropzoneComponent: ({ onUploadProgress, children }) => <div
        data-testid="test-asset-dropzone"
        onClick={() => {
          if (nextAction === 'progress') {
            onUploadProgress({ name: 'test.jpg' }, nextParam);
          }
        }}
      >{children}</div>,
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'progress';
  nextParam = { loaded: 512, total: 1024 };
  fireEvent.click(dropzone);
  expect(updateFile).toHaveBeenCalledWith('Form_Test_Field', { progress: { loaded: 512, total: 1024 } });
});

test('PreviewImageField updateFormData should append required form fields', async () => {
  const appendSpy = jest.fn();
  const formData = { append: appendSpy };
  render(
    <PreviewImageField {...makeProps({
      nameValue: 'test-name.jpg',
      data: {
        id: 123,
        category: 'file',
        exists: true,
        nameField: 'Name',
      },
      AssetDropzoneComponent: ({ updateFormData, children }) => <div
        data-testid="test-asset-dropzone"
        onClick={() => {
          if (nextAction === 'updateformdata') {
            updateFormData(formData);
          }
        }}
      >{children}</div>,
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone');
  nextAction = 'updateformdata';
  fireEvent.click(dropzone);
  expect(appendSpy).toHaveBeenCalledWith('ID', 123);
  expect(appendSpy).toHaveBeenCalledWith('Name', 'test-name.jpg');
});

test('PreviewImageField should render file missing message when file does not exist', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: false,
        exists: false,
        category: 'file'
      }
    })}
    />
  );
  const messagebox = container.querySelector('.editor__file-preview-message--file-missing');
  expect(messagebox).not.toBeNull();
  expect(messagebox.textContent).toBe('File cannot be found');
});

test('PreviewImageField should render progress bar at intermediate progress', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'test.jpg',
        category: 'image'
      },
      upload: {
        progress: 50
      }
    })}
    />
  );
  const progressBar = container.querySelector('.preview-image-field__progress-bar');
  expect(progressBar).not.toBeNull();
  expect(progressBar.style.width).toBe('50%');
});

test('PreviewImageField should not render progress bar when progress is 0', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'test.jpg',
        category: 'image'
      },
      upload: {
        progress: 0
      }
    })}
    />
  );
  const progressBar = container.querySelector('.preview-image-field__progress-bar');
  expect(progressBar).toBeNull();
});

test('PreviewImageField should not render progress bar when progress is 100', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'test.jpg',
        category: 'image'
      },
      upload: {
        progress: 100
      }
    })}
    />
  );
  const progressBar = container.querySelector('.preview-image-field__progress-bar');
  expect(progressBar).toBeNull();
});

test('PreviewImageField should render error message with custom error type', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        category: 'image'
      },
      upload: {
        errors: [{
          type: 'warning',
          value: 'This is a warning message'
        }]
      }
    })}
    />
  );
  const messageBox = container.querySelector('.preview-image-field__message--warning');
  expect(messageBox).not.toBeNull();
  expect(messageBox.textContent).toBe('This is a warning message');
});

test('PreviewImageField should render error message when status is error', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        category: 'image'
      },
      upload: {
        status: 'error'
      }
    })}
    />
  );
  const messageBox = container.querySelector('.preview-image-field__message--error');
  expect(messageBox).not.toBeNull();
  expect(messageBox.textContent).toBe('Server responded with an error.');
});

test('PreviewImageField should render message from upload state', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        category: 'image'
      },
      upload: {
        message: {
          type: 'info',
          value: 'This is an info message'
        }
      }
    })}
    />
  );
  const messageBox = container.querySelector('.preview-image-field__message--info');
  expect(messageBox).not.toBeNull();
  expect(messageBox.textContent).toBe('This is an info message');
});

test('PreviewImageField should render data:image URL directly without cache busting', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'data:image/png;base64,ABC123',
        category: 'image'
      }
    })}
    />
  );
  const image = container.querySelector('.editor__thumbnail');
  expect(image.src).toBe('data:image/png;base64,ABC123');
});

test('PreviewImageField should render preview from upload.url', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        category: 'image'
      },
      upload: {
        url: 'uploaded-preview.jpg'
      }
    })}
    />
  );
  const image = container.querySelector('.editor__thumbnail');
  expect(image.src).toContain('uploaded-preview.jpg');
});

test('PreviewImageField should use data.preview as fallback for image URL', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        preview: 'fallback-preview.jpg',
        category: 'image'
      }
    })}
    />
  );
  const image = container.querySelector('.editor__thumbnail');
  expect(image.src).toContain('fallback-preview.jpg');
});

test('PreviewImageField should render default preview for non-image categories', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'document.pdf',
        category: 'pdf'
      }
    })}
    />
  );
  const image = container.querySelector('.editor__thumbnail');
  expect(image).not.toBeNull();
});

test('PreviewImageField should render linked image when URL is present and not uploading', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'http://example.com/image.jpg',
        category: 'image'
      }
    })}
    />
  );
  const link = container.querySelector('.editor__file-preview-link');
  expect(link).not.toBeNull();
  expect(link.getAttribute('href')).toContain('http://example.com/image.jpg');
  expect(link.getAttribute('target')).toBe('_blank');
  expect(link.getAttribute('rel')).toBe('noopener noreferrer');
});

test('PreviewImageField should not render linked image when uploading', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'http://example.com/image.jpg',
        category: 'image'
      },
      upload: {
        progress: 50
      }
    })}
    />
  );
  const link = container.querySelector('.editor__file-preview-link');
  expect(link).toBeNull();
});

test('PreviewImageField should render icon inside linked image', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'http://example.com/image.jpg',
        category: 'image'
      }
    })}
    />
  );
  const icon = container.querySelector('.editor__file-preview-icon');
  expect(icon).not.toBeNull();
  expect(icon.classList.contains('font-icon-icon-enlarge')).toBe(true);
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('PreviewImageField cacheBustUrl should handle URLs with existing query parameters', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'logo.jpg?width=200&height=100',
        version: 5,
        category: 'image'
      }
    })}
    />
  );
  const link = container.querySelector('.editor__file-preview-link');
  expect(link.getAttribute('href')).toContain('vid=5');
  expect(link.getAttribute('href')).toContain('width=200');
  expect(link.getAttribute('href')).toContain('height=100');
});

test('PreviewImageField cacheBustUrl should use explicit versionId parameter', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      data: {
        mock: true,
        url: 'logo.jpg',
        version: 1,
        category: 'image'
      }
    })}
    />
  );
  const link = container.querySelector('.editor__file-preview-link');
  expect(link.getAttribute('href')).toBe('logo.jpg?vid=1');
});

test('PreviewImageField should apply correct class names when editable', async () => {
  render(
    <PreviewImageField {...makeProps({
      className: 'custom-class',
      extraClass: 'extra-class',
      data: {
        category: 'file',
        exists: true,
        nameField: 'Name',
      },
      AssetDropzoneComponent: ({ className, onSuccess, canFileUpload, onUploadComplete, children }) => <div
        data-testid="test-asset-dropzone-classes"
        className={className}
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
    })}
    />
  );
  const dropzone = await screen.findByTestId('test-asset-dropzone-classes');
  expect(dropzone.classList.contains('asset-dropzone--button')).toBe(true);
  expect(dropzone.classList.contains('preview-image-field__container')).toBe(true);
  expect(dropzone.classList.contains('custom-class')).toBe(true);
  expect(dropzone.classList.contains('extra-class')).toBe(true);
});

test('PreviewImageField should apply correct class names when not editable', () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      className: 'custom-class',
      extraClass: 'extra-class',
      readOnly: true,
      data: {
        category: 'file',
        exists: true,
        nameField: 'Name',
      }
    })}
    />
  );
  const containerEl = container.querySelector('.preview-image-field__container');
  expect(containerEl.classList.contains('preview-image-field__container')).toBe(true);
  expect(containerEl.classList.contains('custom-class')).toBe(true);
  expect(containerEl.classList.contains('extra-class')).toBe(true);
  expect(containerEl.classList.contains('asset-dropzone--button')).toBe(false);
});

test('PreviewImageField should handle componentDidUpdate when URL changes', () => {
  const removeFile = jest.fn();
  const { rerender } = render(
    <PreviewImageField {...makeProps({
      data: {
        url: 'old-url.jpg',
        version: 1,
        category: 'image'
      },
      actions: {
        previewField: {
          removeFile
        }
      }
    })}
    />
  );
  rerender(
    <PreviewImageField {...makeProps({
      data: {
        url: 'new-url.jpg',
        version: 1,
        category: 'image'
      },
      actions: {
        previewField: {
          removeFile
        }
      }
    })}
    />
  );
  expect(removeFile).toHaveBeenCalledWith('Form_Test_Field');
});

test('PreviewImageField should handle componentDidUpdate when version changes', () => {
  const removeFile = jest.fn();
  const { rerender } = render(
    <PreviewImageField {...makeProps({
      data: {
        url: 'same-url.jpg',
        version: 1,
        category: 'image'
      },
      actions: {
        previewField: {
          removeFile
        }
      }
    })}
    />
  );
  rerender(
    <PreviewImageField {...makeProps({
      data: {
        url: 'same-url.jpg',
        version: 2,
        category: 'image'
      },
      actions: {
        previewField: {
          removeFile
        }
      }
    })}
    />
  );
  expect(removeFile).toHaveBeenCalledWith('Form_Test_Field');
});

test('PreviewImageField should handle componentWillUnmount cleanup', () => {
  const removeFile = jest.fn();
  const { unmount } = render(
    <PreviewImageField {...makeProps({
      data: {
        url: 'test.jpg',
        category: 'image'
      },
      actions: {
        previewField: {
          removeFile
        }
      }
    })}
    />
  );
  unmount();
  expect(removeFile).toHaveBeenCalledWith('Form_Test_Field');
});

test('PreviewImageField should configure AssetDropzone with correct props', async () => {
  const { container } = render(
    <PreviewImageField {...makeProps({
      name: 'TestFile',
      className: 'my-class',
      extraClass: 'my-extra-class',
      securityID: 'sec123',
      data: {
        id: 456,
        parentid: 789,
        uploadFileEndpoint: {
          url: 'http://example.com/upload',
          method: 'POST'
        },
        category: 'file',
        exists: true,
        nameField: 'Name',
      }
    })}
    />
  );
  const dropzone = container.querySelector('[data-testid="test-asset-dropzone"]');
  expect(dropzone).not.toBeNull();
});

test('PreviewImageField canFileUpload should return false when extension changes and user declines', async () => {
  render(
    <PreviewImageField {...makeProps({
      confirm: () => false,
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
  expect(lastReturn).toBe(false);
});

/* global jest, test, expect, beforeEach, afterEach */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CONSTANTS from 'constants/index';
import { Component as MoveModal } from '../MoveModal';

jest.mock('components/FormBuilderModal/FormBuilderModal', () => ({
  __esModule: true,
  default: ({ title, isOpen, onClosed, onSubmit, identifier, schemaUrl, ...props }) => (
    <div
      data-testid="form-builder-modal"
      data-title={title}
      data-is-open={isOpen}
      data-identifier={identifier}
      data-schema-url={schemaUrl}
      {...props}
    >
      <button
        data-testid="modal-submit-btn"
        onClick={() => onSubmit && onSubmit({ FolderID: 123 })}
      >
        Submit
      </button>
      <button data-testid="modal-close-btn" onClick={onClosed}>
        Close
      </button>
    </div>
  )
}));

let resolveBackendPost;
let rejectBackendPost;
let resolveBackendGet;
let rejectBackendGet;
let lastBackendPostEndpoint;
let lastBackendPostData;
let lastBackendPostHeaders;
let lastBackendGetEndpoint;

jest.mock('lib/Backend', () => ({
  post: (endpoint, data, headers) => new Promise((resolve, reject) => {
    resolveBackendPost = resolve;
    rejectBackendPost = reject;
    lastBackendPostEndpoint = endpoint;
    lastBackendPostData = data;
    lastBackendPostHeaders = headers;
  }),
  get: (endpoint) => new Promise((resolve, reject) => {
    resolveBackendGet = resolve;
    rejectBackendGet = reject;
    lastBackendGetEndpoint = endpoint;
  }),
}));

jest.mock('lib/Config', () => ({
  get: (key) => {
    if (key === 'SecurityID') {
      return 'test-security-id-12345';
    }
    return undefined;
  }
}));

jest.mock('i18n', () => ({
  sprintf: (template, ...args) => template.replace(/%s/g, () => args.shift()),
  _t: (key, defaultValue) => defaultValue || key,
}));

jest.mock('constants/index', () => ({
  MODAL_MOVE: 'MODAL_MOVE',
  MOVE_SUCCESS_DURATION: 5000,
}));

let consoleWarnFn;
let consoleErrorFn;

beforeEach(() => {
  resolveBackendPost = undefined;
  rejectBackendPost = undefined;
  resolveBackendGet = undefined;
  rejectBackendGet = undefined;
  lastBackendPostEndpoint = undefined;
  lastBackendPostData = undefined;
  lastBackendPostHeaders = undefined;
  lastBackendGetEndpoint = undefined;
  consoleWarnFn = jest.spyOn(console, 'warn').mockImplementation(() => null);
  consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => null);
});

afterEach(() => {
  consoleWarnFn.mockRestore();
  consoleErrorFn.mockRestore();
});

function makeProps(obj = {}) {
  return {
    isOpen: false,
    onClosed: jest.fn(),
    folderId: 1,
    selectedFiles: [1, 2, 3],
    title: 'Move 3 item(s) to...',
    setNotice: jest.fn(),
    setError: jest.fn(),
    setBadge: jest.fn(),
    onSuccess: jest.fn(),
    onOpenFolder: jest.fn(),
    sectionConfig: {
      endpoints: {
        move: { url: '/move-endpoint' },
        read: { url: '/read-endpoint' },
      },
      form: {
        moveForm: { schemaUrl: '/schema-url' },
      },
    },
    ...obj
  };
}

test('MoveModal renders FormBuilderModal with correct props', () => {
  render(<MoveModal {...makeProps()} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal).not.toBeNull();
  expect(modal.getAttribute('data-identifier')).toBe('AssetAdmin.MoveForm');
});

test('MoveModal passes title to FormBuilderModal', () => {
  render(<MoveModal {...makeProps({ title: 'Custom Title' })} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal.getAttribute('data-title')).toBe('Custom Title');
});

test('MoveModal passes isOpen prop to FormBuilderModal', () => {
  render(<MoveModal {...makeProps({ isOpen: true })} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal.getAttribute('data-is-open')).toBe('true');
});

test('MoveModal passes isOpen false to FormBuilderModal', () => {
  render(<MoveModal {...makeProps({ isOpen: false })} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal.getAttribute('data-is-open')).toBe('false');
});

test('MoveModal passes schemaUrl with folderId to FormBuilderModal', () => {
  render(<MoveModal {...makeProps({ folderId: 42 })} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal.getAttribute('data-schema-url')).toBe('/schema-url/42');
});

test('MoveModal calls onClosed when close button is clicked', () => {
  const onClosed = jest.fn();
  render(<MoveModal {...makeProps({ onClosed })} />);
  const closeBtn = screen.getByTestId('modal-close-btn');
  fireEvent.click(closeBtn);
  expect(onClosed).toHaveBeenCalled();
});

test('MoveModal handleSubmit posts to move endpoint with correct data', async () => {
  const selectedFiles = [1, 2, 3];
  render(<MoveModal {...makeProps({ selectedFiles })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  await waitFor(() => {
    expect(lastBackendPostEndpoint).toBe('/move-endpoint');
  });
  expect(lastBackendPostData).toEqual({
    ids: [1, 2, 3],
    folderID: 123,
  });
  expect(lastBackendPostHeaders).toEqual({
    'X-SecurityID': 'test-security-id-12345',
  });
});

test('MoveModal handleSubmit sends SecurityID header', async () => {
  render(<MoveModal {...makeProps({ selectedFiles: [99] })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  await waitFor(() => {
    expect(lastBackendPostHeaders).toEqual({
      'X-SecurityID': 'test-security-id-12345',
    });
  });
});

test('MoveModal handleSubmit fetches folder data after successful move', async () => {
  render(<MoveModal {...makeProps()} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  await waitFor(() => {
    expect(resolveBackendPost).toBeDefined();
  });
  resolveBackendPost();
  await waitFor(() => {
    expect(lastBackendGetEndpoint).toBe('/read-endpoint/123');
  });
});

test('MoveModal handleSubmit displays success notice with folder name', async () => {
  const setNotice = jest.fn();
  render(<MoveModal {...makeProps({ setNotice, selectedFiles: [1, 2] })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 123,
      name: 'My Folder',
    }),
  });
  await waitFor(() => {
    expect(setNotice).toHaveBeenCalled();
    const callArgs = setNotice.mock.calls[0];
    expect(callArgs[0]).toContain('Moved 2 item(s) to My Folder');
  });
});

test('MoveModal handleSubmit notice includes Go to folder action', async () => {
  const setNotice = jest.fn();
  const onOpenFolder = jest.fn();
  render(
    <MoveModal
      {...makeProps({
        setNotice,
        onOpenFolder,
      })}
    />
  );
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 99,
      name: 'Target Folder',
    }),
  });
  await waitFor(() => {
    expect(setNotice).toHaveBeenCalled();
    const actions = setNotice.mock.calls[0][1];
    expect(actions).toHaveLength(1);
    expect(actions[0].label).toContain('Go to folder');
  });
});

test('MoveModal handleSubmit calls setBadge with success type', async () => {
  const setBadge = jest.fn();
  render(<MoveModal {...makeProps({ setBadge, selectedFiles: [1, 2, 3, 4] })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 55,
      name: 'Folder',
    }),
  });
  await waitFor(() => {
    expect(setBadge).toHaveBeenCalled();
    const callArgs = setBadge.mock.calls[0];
    expect(callArgs[0]).toBe(55);
    expect(callArgs[1]).toBe('4');
    expect(callArgs[2]).toBe('success');
    expect(callArgs[3]).toBe(CONSTANTS.MOVE_SUCCESS_DURATION);
  });
});

test('MoveModal handleSubmit calls onSuccess callback', async () => {
  const onSuccess = jest.fn();
  const selectedFiles = [5, 10];
  render(<MoveModal {...makeProps({ onSuccess, selectedFiles })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 77,
      name: 'NewFolder',
    }),
  });
  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalledWith(77, [5, 10]);
  });
});

test('MoveModal handleSubmit calls onClosed after success', async () => {
  const onClosed = jest.fn();
  render(<MoveModal {...makeProps({ onClosed })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 123,
      name: 'Folder',
    }),
  });
  await waitFor(() => {
    expect(onClosed).toHaveBeenCalled();
  });
});

test('MoveModal handleSubmit calls setError on post failure', async () => {
  const setError = jest.fn();
  render(<MoveModal {...makeProps({ setError })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  rejectBackendPost(new Error('Network error'));
  await waitFor(() => {
    expect(setError).toHaveBeenCalledWith('There was an error moving the selected items.');
  });
});

test('MoveModal handleSubmit calls setError on get failure', async () => {
  const setError = jest.fn();
  render(<MoveModal {...makeProps({ setError })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(rejectBackendGet).toBeDefined();
  });
  rejectBackendGet(new Error('Failed to read folder'));
  await waitFor(() => {
    expect(setError).toHaveBeenCalledWith('There was an error moving the selected items.');
  });
});

test('MoveModal handleSubmit returns a promise', async () => {
  render(<MoveModal {...makeProps()} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 123,
      name: 'Folder',
    }),
  });
});

test('MoveModal renders without errors', () => {
  render(<MoveModal {...makeProps()} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal).not.toBeNull();
  expect(consoleErrorFn).not.toHaveBeenCalled();
  expect(consoleWarnFn).not.toHaveBeenCalled();
});

test('MoveModal has correct defaultProps', () => {
  expect(MoveModal.defaultProps).toBeDefined();
  expect(MoveModal.defaultProps.isOpen).toBe(false);
});

test('MoveModal has correct propTypes', () => {
  expect(MoveModal.propTypes).toBeDefined();
  expect(MoveModal.propTypes.sectionConfig).toBeDefined();
  expect(MoveModal.propTypes.folderId).toBeDefined();
  expect(MoveModal.propTypes.isOpen).toBeDefined();
  expect(MoveModal.propTypes.onClosed).toBeDefined();
  expect(MoveModal.propTypes.setNotice).toBeDefined();
  expect(MoveModal.propTypes.setBadge).toBeDefined();
  expect(MoveModal.propTypes.setError).toBeDefined();
  expect(MoveModal.propTypes.title).toBeDefined();
  expect(MoveModal.propTypes.onSuccess).toBeDefined();
  expect(MoveModal.propTypes.onOpenFolder).toBeDefined();
  expect(MoveModal.propTypes.selectedFiles).toBeDefined();
});

test('MoveModal handleSubmit with empty selectedFiles', async () => {
  const setBadge = jest.fn();
  render(<MoveModal {...makeProps({ selectedFiles: [], setBadge })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 123,
      name: 'Folder',
    }),
  });
  await waitFor(() => {
    expect(setBadge).toHaveBeenCalled();
    const callArgs = setBadge.mock.calls[0];
    expect(callArgs[1]).toBe('0');
  });
});

test('MoveModal handleSubmit with single file', async () => {
  const setNotice = jest.fn();
  render(<MoveModal {...makeProps({ setNotice, selectedFiles: [42] })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 123,
      name: 'Folder',
    }),
  });
  await waitFor(() => {
    expect(setNotice).toHaveBeenCalled();
    const callArgs = setNotice.mock.calls[0];
    expect(callArgs[0]).toContain('Moved 1 item(s) to Folder');
  });
});

test('MoveModal handleSubmit with multiple files', async () => {
  const setNotice = jest.fn();
  render(<MoveModal {...makeProps({ setNotice, selectedFiles: [1, 2, 3, 4, 5] })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 123,
      name: 'Target',
    }),
  });
  await waitFor(() => {
    expect(setNotice).toHaveBeenCalled();
    const callArgs = setNotice.mock.calls[0];
    expect(callArgs[0]).toContain('Moved 5 item(s) to Target');
  });
});

test('MoveModal handleSubmit with different folderIds', () => {
  const folderIds = [10, 20, 30];
  folderIds.forEach(folderId => {
    const { unmount } = render(<MoveModal {...makeProps({ folderId })} />);
    const modal = screen.getByTestId('form-builder-modal');
    expect(modal.getAttribute('data-schema-url')).toContain(`/${folderId}`);
    unmount();
  });
});

test('MoveModal renders with complex sectionConfig', () => {
  const sectionConfig = {
    endpoints: {
      move: { url: '/api/move-complex' },
      read: { url: '/api/read-complex' },
    },
    form: {
      moveForm: { schemaUrl: '/api/schema-complex' },
    },
  };
  render(<MoveModal {...makeProps({ sectionConfig })} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal.getAttribute('data-schema-url')).toBe('/api/schema-complex/1');
});

test('MoveModal onSuccess is optional', async () => {
  render(<MoveModal {...makeProps({ onSuccess: undefined })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 123,
      name: 'Folder',
    }),
  });
});

test('MoveModal renders FormBuilderModal with onClosed callback', () => {
  const onClosed = jest.fn();
  render(<MoveModal {...makeProps({ onClosed })} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal).not.toBeNull();
});

test('MoveModal handles response with different folderNames', async () => {
  const setNotice = jest.fn();
  render(<MoveModal {...makeProps({ setNotice })} />);
  const submitBtn = screen.getByTestId('modal-submit-btn');
  fireEvent.click(submitBtn);
  resolveBackendPost();
  await waitFor(() => {
    expect(resolveBackendGet).toBeDefined();
  });
  resolveBackendGet({
    json: () => Promise.resolve({
      id: 100,
      name: 'Documents',
    }),
  });
  await waitFor(() => {
    expect(setNotice).toHaveBeenCalled();
  });
});

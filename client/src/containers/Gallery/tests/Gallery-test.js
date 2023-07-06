/* global jest, expect, test */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as Gallery } from '../Gallery';

// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('components/FormAlert/FormAlert');
jest.mock('components/AssetDropzone/AssetDropzone');
jest.mock('components/GalleryToolbar/GalleryToolbar');
jest.mock('../../MoveModal/MoveModal');
// mock jquery, as leaving it causes more problems than it solves
jest.mock('jquery', () => {
  const jqueryMock = {
    find: () => jqueryMock,
    change: () => jqueryMock,
    val: () => jqueryMock,
    trigger: () => null,
    chosen: () => null,
    on: () => null,
    off: () => null,
  };
  return () => jqueryMock;
});

// eslint-disable-next-line no-unused-vars
let nextAction;
let consoleWarnFn;
let consoleErrorFn;
beforeEach(() => {
  // surpress warning + error
  // componentWillReceiveProps has been renamed, and is not recommended for use.
  consoleWarnFn = jest.spyOn(console, 'warn').mockImplementation(() => null);
  consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => null);
  nextAction = undefined;
});
afterEach(() => {
  consoleWarnFn.mockRestore();
  consoleErrorFn.mockRestore();
});

function makeProps(obj = {}) {
  return {
    actions: {
      gallery: {
        setLastSelected: () => {},
        selectFiles: () => {},
        deselectFiles: () => {},
        setPath: () => {},
        setLoading: () => {},
        onDelete: () => {},
        onPublish: () => {},
        onUnpublish: () => {},
        onPublishComplete: () => {},
        onUnpublishComplete: () => {},
      },
      queuedFiles: {
        addQueuedFile: () => null,
        failUpload: () => null,
        purgeUploadQueue: () => null,
        removeQueuedFile: () => null,
        succeedUpload: () => null,
      },
      mutate: {
        moveFiles: () => ({}),
        createFolder: () => ({}),
      },
      toasts: {
        display: jest.fn(),
        success: jest.fn(),
        error: jest.fn(),
      }
    },
    selectedFiles: [],
    highlightedFiles: [],
    combinedFiles: [],
    files: [],
    count: 0,
    folderId: 1,
    fileId: null,
    folder: {
      id: 1,
      title: 'container folder',
      parentId: null,
      canView: true,
      canEdit: true,
    },
    queuedFiles: {
      items: [],
    },
    sort: '',
    page: 2,
    onOpenFile: () => {},
    onOpenFolder: () => {},
    onSort: () => {},
    onSetPage: () => {},
    onViewChange: () => {},
    badges: [],
    sectionConfig: {},
    GalleryToolbar: () => null,
    sorters: [
      {
        field: 'title',
        direction: 'asc',
        label: 'title a-z',
      },
      {
        field: 'title',
        direction: 'desc',
        label: 'title z-a',
      },
      {
        field: 'lastEdited',
        direction: 'desc',
        label: 'newest',
      },
      {
        field: 'lastEdited',
        direction: 'asc',
        label: 'oldest',
      },
    ],
    BulkActionsComponent: ({ items, actions }) => <div data-testid="test-bulk-actions">
      {actions.map(a => <div data-testid={`test-bulk-action-${a.value}`} onClick={() => a.callback({}, items)}/>)}
    </div>,
    ...obj
  };
}

test('Gallery componentDidUpdate() should not call purgeUploadQueue when receiving same files', () => {
  const purgeUploadQueue = jest.fn();
  const { rerender } = render(
    <Gallery {...makeProps({
      files: [
        { id: 1 },
      ],
      actions: {
        ...makeProps().actions,
        queuedFiles: {
          ...makeProps().actions.queuedFiles,
          purgeUploadQueue
        }
      }
    })}
    />
  );
  rerender(
    <Gallery {...makeProps({
      files: [
        { id: 1 },
      ],
      actions: {
        ...makeProps().actions,
        queuedFiles: {
          ...makeProps().actions.queuedFiles,
          purgeUploadQueue
        }
      }
    })}
    />
  );
  expect(purgeUploadQueue).not.toBeCalled();
});

test('Gallery componentDidUpdate() should call purgeUploadQueue when changing folder', () => {
  const purgeUploadQueue = jest.fn();
  const { rerender } = render(
    <Gallery {...makeProps({
      files: [
        { id: 1 },
      ],
      actions: {
        ...makeProps().actions,
        queuedFiles: {
          ...makeProps().actions.queuedFiles,
          purgeUploadQueue
        }
      }
    })}
    />
  );
  rerender(
    <Gallery {...makeProps({
      folderId: 8,
      folder: {
        id: 8,
        title: 'subfolder',
        parentId: 1,
        canView: true,
        canEdit: true,
      },
      actions: {
        ...makeProps().actions,
        queuedFiles: {
          ...makeProps().actions.queuedFiles,
          purgeUploadQueue
        }
      }
    })}
    />
  );
  expect(purgeUploadQueue).toBeCalled();
});

test('Gallery renderBulkActions() should render bulk actions if there are selected files and admin type', () => {
  const { container } = render(
    <Gallery {...makeProps({
      type: 'admin',
      selectedFiles: [15, 20],
      files: [
        { id: 15 },
        { id: 20 },
        { id: 45 },
      ]
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-bulk-actions"]')).not.toBe(null);
});

test('Gallery renderBulkActions() should not render bulk actions if not admin type', () => {
  const { container } = render(
    <Gallery {...makeProps({
      type: 'insert-media',
      selectedFiles: [15, 20],
      files: [
        { id: 15 },
        { id: 20 },
        { id: 45 },
      ]
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-bulk-actions"]')).toBe(null);
});

test('Gallery renderBulkActions() should not render bulk actions if there are no selected files', () => {
  const { container } = render(
    <Gallery {...makeProps({
      type: 'admin',
      selectedFiles: [],
      files: [
        { id: 15 },
        { id: 20 },
        { id: 45 },
      ]
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-bulk-actions"]')).toBe(null);
});

test('Gallery renderBulkActions() should not return a BulkActionsComponent if there are items in the selectedFiles array that do not resolve to files', () => {
  const { container } = render(
    <Gallery {...makeProps({
      type: 'admin',
      selectedFiles: [1],
      files: [
        { id: 15 },
        { id: 20 },
        { id: 45 },
      ]
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-bulk-actions"]')).toBe(null);
});

test('Gallery bulkActions published a list of items if it was unpublished', async () => {
  let doResolve;
  const promise = new Promise((resolve) => {
    doResolve = resolve;
  });
  const setLoading = jest.fn();
  const success = jest.fn();
  const onPublish = jest.fn((id) => {
    doResolve();
    return Promise.resolve([{ id }]);
  });
  const deselectFiles = jest.fn();
  const { container } = render(
    <Gallery {...makeProps({
      type: 'admin',
      selectedFiles: [5],
      files: [
        { id: 5, published: false },
      ],
      onPublish,
      actions: {
        ...makeProps().actions,
        gallery: {
          ...makeProps().actions.gallery,
          setLoading,
          deselectFiles
        },
        toasts: {
          ...makeProps().actions.toasts,
          success
        }
      }
    })}
    />
  );
  fireEvent.click(container.querySelector('[data-testid="test-bulk-action-publish"]'));
  await (promise);
  expect(setLoading.mock.calls.length).toBe(2);
  expect(setLoading.mock.calls[0][0]).toBe(true);
  expect(setLoading.mock.calls[1][0]).toBe(false);
  expect(success.mock.calls.length).toBe(1);
  expect(success.mock.calls[0][0]).toBe('1 folders/files were successfully published.');
  expect(onPublish.mock.calls.length).toBe(1);
  expect(onPublish.mock.calls[0][0]).toEqual([5]);
  expect(deselectFiles.mock.calls.length).toBe(1);
});

test('Gallery bulkActions unpublishes a list of items if it was published', async () => {
  let doResolve;
  const promise = new Promise((resolve) => {
    doResolve = resolve;
  });
  const setLoading = jest.fn();
  const success = jest.fn();
  const onUnpublish = jest.fn((id) => {
    doResolve();
    return Promise.resolve([{ id }]);
  });
  const deselectFiles = jest.fn();
  const { container } = render(
    <Gallery {...makeProps({
      type: 'admin',
      selectedFiles: [5],
      files: [
        { id: 5, published: true },
      ],
      onUnpublish,
      actions: {
        ...makeProps().actions,
        gallery: {
          ...makeProps().actions.gallery,
          setLoading,
          deselectFiles
        },
        toasts: {
          ...makeProps().actions.toasts,
          success
        }
      }
    })}
    />
  );
  fireEvent.click(container.querySelector('[data-testid="test-bulk-action-unpublish"]'));
  await promise;
  expect(setLoading.mock.calls.length).toBe(2);
  expect(setLoading.mock.calls[0][0]).toBe(true);
  expect(setLoading.mock.calls[1][0]).toBe(false);
  expect(success.mock.calls.length).toBe(1);
  expect(success.mock.calls[0][0]).toBe('1 folders/files were successfully unpublished.');
  expect(onUnpublish.mock.calls.length).toBe(1);
  expect(onUnpublish.mock.calls[0][0]).toEqual([5]);
  expect(deselectFiles.mock.calls.length).toBe(1);
});

test('Gallery bulkActions does not unpublish an item if it was not published', async () => {
  const setLoading = jest.fn();
  const success = jest.fn();
  const onUnpublish = jest.fn();
  const deselectFiles = jest.fn();
  const { container } = render(
    <Gallery {...makeProps({
      type: 'admin',
      selectedFiles: [5],
      files: [
        { id: 5, published: false },
      ],
      onUnpublish,
      actions: {
        ...makeProps().actions,
        gallery: {
          ...makeProps().actions.gallery,
          setLoading,
          deselectFiles
        },
        toasts: {
          ...makeProps().actions.toasts,
          success
        }
      }
    })}
    />
  );
  fireEvent.click(container.querySelector('[data-testid="test-bulk-action-unpublish"]'));
  expect(setLoading.mock.calls.length).toBe(0);
  expect(success.mock.calls.length).toBe(0);
  expect(onUnpublish.mock.calls.length).toBe(0);
  expect(deselectFiles.mock.calls.length).toBe(1);
});

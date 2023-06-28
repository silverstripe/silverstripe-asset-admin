/* global jest, test, expect, beforeEach, afterEach */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as AssetAdmin } from '../AssetAdmin';

// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('containers/Editor/Editor');

jest.mock('lib/getFormSchema', () => ({
  __esModule: true,
  default: () => ({
    schemaUrl: 'mySchemaUrl',
    targetId: 'myTargetId'
  })
}));

let lastReturn;
let nextAction;
let nextParams;

let consoleErrorFn;
beforeEach(() => {
  lastReturn = undefined;
  nextAction = undefined;
  nextParams = [];
  // surpress warning:
  // Warning: Injector.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined
  consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => null);
});
afterEach(() => {
  consoleErrorFn.mockRestore();
});

function getMockFile(id) {
  return {
    id,
    __typename: 'File',
  };
}

function makeProps(obj = {}) {
  return {
    client: {
      dataId: () => null
        .mockReturnValue(getMockFile(1)),
    },
    dialog: true,
    sectionConfig: {
      url: '',
      limit: 10,
      createFileEndpoint: {
        url: '',
      },
      form: {
        fileEditForm: {
          schemaUrl: '',
        },
        fileSearchForm: {
          schemaUrl: '',
        },
        addToCampaignForm: {
          schemaUrl: '',
        }
      },
    },
    fileId: null,
    folderId: null,
    getUrl: () => null,
    query: {
      sort: '',
      limit: 10,
      page: 1,
    },
    type: 'admin',
    files: [],
    queuedFiles: {
      items: [],
    },
    filesTotalCount: 20,
    folder: {
      id: 0,
      title: '',
      parents: [],
      parentId: 0,
      canView: true,
      canEdit: true,
    },
    actions: {
      gallery: {
        deselectFiles: () => null,
      },
      queuedFiles: {
        addQueuedFile: () => null,
        failUpload: () => null,
        purgeUploadQueue: () => null,
        removeQueuedFile: () => null,
        succeedUpload: () => null,
      },
      files: {
        deleteFiles: () => Promise.resolve({ data: { deleteFiles: [] } }),
        readFiles: () => Promise.resolve(),
        publishFiles: () => Promise.resolve({ data: { publishFiles: [] } }),
        unpublishFiles: () => Promise.resolve({ data: { unpublishFiles: [] } }),
      },
      confirmDeletion: {
        deleting: () => null,
      },
      toasts: {
        display: () => null,
        success: () => null,
        error: () => null,
      }
    },
    showSearch: true,
    EditorComponent: ({ onSubmit }) => <div data-testid="test-editor" onClick={() => onSubmit(...nextParams)}/>,
    GalleryComponent: ({ onPublish, onUnpublish, onSuccessfulUploadQueue, files }) => <div
      data-testid="test-gallery"
      onClick={() => {
        if (nextAction === 'publish') {
          onPublish(...nextParams);
        } else if (nextAction === 'unpublish') {
          onUnpublish(...nextParams);
        } else if (nextAction === 'successfulupload') {
          onSuccessfulUploadQueue(...nextParams);
        } else if (nextAction === 'files') {
          lastReturn = files;
        }
      }}
    />,
    SearchComponent: ({ onSearch }) => <div data-testid="test-search" onClick={() => onSearch(...nextParams)}/>,
    BulkDeleteConfirmationComponent: ({ onConfirm }) => <div data-testid="test-bulk-delete-confirmation" onClick={() => onConfirm(...nextParams)}/>,
    ...obj
  };
}

test('AssetAdmin handleSubmitEditor should call the onSubmitEditor property when that is supplied', async () => {
  const onSubmitEditor = jest.fn(() => Promise.resolve(null));
  const paramSubmit = jest.fn(() => Promise.resolve(null));
  render(
    <AssetAdmin {...makeProps({
      onSubmitEditor
    })}
    />
  );
  const editor = await screen.findByTestId('test-editor');
  nextParams = [{}, 'action_test', paramSubmit];
  fireEvent.click(editor);
  expect(onSubmitEditor).toBeCalledWith({}, 'action_test', paramSubmit, undefined);
  expect(paramSubmit).not.toBeCalled();
});

test('AssetAdmin handleSubmitEditor should call the paramSubmit given when no onSubmitEditor is supplied', async () => {
  const paramSubmit = jest.fn(() => Promise.resolve(null));
  render(
    <AssetAdmin {...makeProps()}/>
  );
  const editor = await screen.findByTestId('test-editor');
  nextParams = [{}, 'action_test', paramSubmit];
  fireEvent.click(editor);
  expect(paramSubmit).toBeCalled();
});

test('AssetAdmin handleBrowse should clear selected files when folder changes', async () => {
  const deselectFiles = jest.fn();
  render(
    <AssetAdmin {...makeProps({
      folderId: 2,
      actions: {
        ...makeProps().actions,
        gallery: {
          deselectFiles
        }
      }
    })}
    />
  );
  const search = await screen.findByTestId('test-search');
  nextParams = [{
    currentFolderOnly: false
  }];
  fireEvent.click(search);
  expect(deselectFiles.mock.calls.length).toBe(2);
});

test('AssetAdmin handleBrowse should not clear selected', async () => {
  const deselectFiles = jest.fn();
  render(
    <AssetAdmin {...makeProps({
      folderId: 2,
      actions: {
        ...makeProps().actions,
        gallery: {
          deselectFiles
        }
      }
    })}
    />
  );
  const search = await screen.findByTestId('test-search');
  nextParams = [{
    currentFolderOnly: true
  }];
  fireEvent.click(search);
  expect(deselectFiles.mock.calls.length).toBe(1);
});

test('AssetAdmin handleDelete should delete a file', async () => {
  const deleteFiles = jest.fn(() => Promise.resolve({ data: { deleteFiles: [] } }));
  const files = [
    getMockFile(1)
  ];
  render(
    <AssetAdmin {...makeProps({
      files,
      queuedFiles: {
        items: [
          {
            ...getMockFile(2),
            queuedId: 2
          },
        ]
      },
      actions: {
        ...makeProps().actions,
        files: {
          ...makeProps().actions.files,
          deleteFiles
        }
      }
    })}
    />
  );
  const confirmation = await screen.findByTestId('test-bulk-delete-confirmation');
  nextParams = [[files[0].id]];
  fireEvent.click(confirmation);
  expect(deleteFiles.mock.calls.length).toBe(1);
  expect(deleteFiles.mock.calls[0][0]).toEqual([files[0].id]);
});

test('AssetAdmin handleDelete should remove the file from the queued files list', async () => {
  const removeQueuedFile = jest.fn();
  const files = [
    getMockFile(1)
  ];
  render(
    <AssetAdmin {...makeProps({
      files,
      queuedFiles: {
        items: [
          {
            ...getMockFile(2),
            queuedId: 2
          },
        ]
      },
      actions: {
        ...makeProps().actions,
        queuedFiles: {
          ...makeProps().actions.queuedFiles,
          removeQueuedFile
        }
      },
    })}
    />
  );
  const confirmation = await screen.findByTestId('test-bulk-delete-confirmation');
  nextParams = [[2]];
  fireEvent.click(confirmation);
  expect(removeQueuedFile.mock.calls.length).toBe(1);
  expect(removeQueuedFile.mock.calls[0][0]).toEqual(2);
});

test('AssetAdmin doPublish should publish a file', async () => {
  const publishFiles = jest.fn(() => Promise.resolve({ data: { publishFiles: [] } }));
  const files = [
    getMockFile(1)
  ];
  render(
    <AssetAdmin {...makeProps({
      files,
      queuedFiles: {
        items: [
          {
            ...getMockFile(2),
            queuedId: 2
          },
        ]
      },
      actions: {
        ...makeProps().actions,
        files: {
          ...makeProps().actions.files,
          publishFiles
        }
      },
    })}
    />
  );
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'publish';
  nextParams = [[files[0].id]];
  fireEvent.click(gallery);
  expect(publishFiles.mock.calls.length).toBe(1);
  expect(publishFiles.mock.calls[0][0]).toEqual([files[0].id]);
});

test('AssetAdmin doUnpublish should unpublish a file', async () => {
  const unpublishFiles = jest.fn(() => Promise.resolve({ data: { unpublishFiles: [] } }));
  const files = [
    getMockFile(1)
  ];
  render(
    <AssetAdmin {...makeProps({
      files,
      queuedFiles: {
        items: [
          {
            ...getMockFile(2),
            queuedId: 2
          },
        ]
      },
      actions: {
        ...makeProps().actions,
        files: {
          ...makeProps().actions.files,
          unpublishFiles
        }
      },
    })}
    />
  );
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'unpublish';
  nextParams = [[files[0].id]];
  fireEvent.click(gallery);
  expect(unpublishFiles.mock.calls.length).toBe(1);
  expect(unpublishFiles.mock.calls[0][0]).toEqual([files[0].id]);
});

test('AssetAdmin handleUploadQueue should not refresh if no file is open', async () => {
  const readFiles = jest.fn();
  render(
    <AssetAdmin {...makeProps({
      fileId: 0,
      actions: {
        ...makeProps().actions,
        files: {
          ...makeProps().actions.files,
          readFiles
        }
      },
    })}
    />
  );
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'successfulupload';
  fireEvent.click(gallery);
  expect(readFiles.mock.calls.length).toBe(0);
});

test('AssetAdmin getFiles no files provided', async () => {
  render(
    <AssetAdmin {...makeProps({
      files: [],
      queuedFiles: {
        items: []
      },
      folderId: 99
    })}
    />
  );
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn).toStrictEqual([]);
});

test('AssetAdmin getFiles some files in a folder', async () => {
  render(
    <AssetAdmin {...makeProps({
      files: [
        { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
        { id: 2, name: 'file two', type: 'image/jpeg', parent: { id: 99 } }
      ],
      queuedFiles: {
        items: []
      },
      folderId: 99
    })}
    />
  );
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([1, 2]);
});

test('AssetAdmin getFiles some files in a folder', async () => {
  render(
    <AssetAdmin {...makeProps({
      files: [
        { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
        { id: 2, name: 'file two', type: 'image/jpeg', parent: { id: 99 } }
      ],
      queuedFiles: {
        items: [
          { id: 3, name: 'file three', type: 'image/jpeg', parent: { id: 99 } },
          { id: 4, name: 'file four', type: 'image/jpeg', parent: { id: 99 } }
        ]
      },
      folderId: 99
    })}
    />
  );
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([3, 4, 1, 2]);
});

test('AssetAdmin getFiles upload error e.g. invalid file extension', async () => {
  render(
    <AssetAdmin {...makeProps({
      files: [
        { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
      ],
      queuedFiles: {
        items: [
          {
            id: 0,
            name: 'invalid file attempted to upload',
            type: 'alien/artifact',
            parent: { id: 0 },
            message: { type: 'error', value: 'Invalid file extension' },
            uploadedToFolderId: 99,
          },
        ]
      },
      folderId: 99
    })}
    />
  );
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([0, 1]);
});

test('AssetAdmin getFiles upload in progress', async () => {
  render(
    <AssetAdmin {...makeProps({
      files: [
        { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
      ],
      queuedFiles: {
        items: [
          {
            id: 0,
            name: 'file uploading',
            type: 'image/jpeg',
            parent: { id: 0 },
            uploadedToFolderId: 99,
          },
        ]
      },
      folderId: 99
    })}
    />
  );
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([0, 1]);
});

test('AssetAdmin getFiles upload in progress to root folder', async () => {
  render(
    <AssetAdmin {...makeProps({
      files: [
        { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
      ],
      queuedFiles: {
        items: [
          {
            id: 0,
            name: 'file uploading',
            type: 'image/jpeg',
            parent: { id: 0 },
            uploadedToFolderId: 0,
          },
        ]
      },
      folderId: 0
    })}
    />
  );
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([0, 1]);
});

test('AssetAdmin viewing a folder after uploading to a different folder', async () => {
  render(
    <AssetAdmin {...makeProps({
      files: [
        { id: 1, name: 'file one', type: 'image/jpeg', parent: { id: 99 } },
      ],
      queuedFiles: {
        items: [
          {
            id: 0,
            name: 'file uploaded',
            type: 'image/jpeg',
            parent: { id: 0 },
            uploadedToFolderId: 77,
          },
        ]
      }
    })}
    />
  );
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([1]);
});

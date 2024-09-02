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

let resolveBackendGet;
let rejectBackendGet;
let resolveBackendPost;
let rejectBackendPost;
let lastBackendGetEndpoint;
let lastBackendPostEndpoint;
let lastBackendPostData;

jest.mock('lib/Backend', () => ({
  get: (endpoint) => new Promise((resolve, reject) => {
    resolveBackendGet = resolve;
    rejectBackendGet = reject;
    lastBackendGetEndpoint = endpoint;
  }),
  post: (endpoint, data) => new Promise((resolve, reject) => {
    resolveBackendPost = resolve;
    rejectBackendPost = reject;
    lastBackendPostEndpoint = endpoint;
    lastBackendPostData = data;
  }),
}));

window.ss.config = {
  SecurityID: 1234567890,
  sections: [
    {
      name: 'SilverStripe\\AssetAdmin\\Controller\\AssetAdminOpen',
      endpoints: {
        read: 'test/endpoint/read',
      }
    },
  ],
};

function makeReadFileResponse() {
  return {
    json: () => ({
      children: {
        pageInfo: {
          totalCount: 2,
        },
        nodes: [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ],
      },
    }),
  };
}

let lastReturn;
let nextAction;
let nextParams;
let lastToastErrorMessage;

let consoleErrorFn;
beforeEach(() => {
  lastBackendGetEndpoint = undefined;
  lastBackendPostEndpoint = undefined;
  lastBackendPostData = undefined;
  lastToastErrorMessage = undefined;
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

function createJsonError(message) {
  return {
    response: {
      json: () => Promise.resolve({
        errors: [
          {
            value: message
          }
        ],
      }),
    },
  };
}

function makeProps(obj = {}) {
  return {
    client: {
      dataId: () => null
        .mockReturnValue({ id: 1 }),
    },
    dialog: true,
    sectionConfig: {
      url: '',
      limit: 10,
      endpoints: {
        createFile: {
          url: '',
        },
        read: {
          url: 'test/endpoint/read',
        },
        delete: {
          url: 'test/endpoint/delete',
        },
        publish: {
          url: 'test/endpoint/publish',
        },
        unpublish: {
          url: 'test/endpoint/unpublish',
        },
        readLiveOwnerCounts: {
          url: 'test/endpoint/readLiveOwnerCounts',
        },
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
      ancestors: [],
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
        read: () => Promise.resolve(),
        publish: () => Promise.resolve({ data: { publish: [] } }),
        unpublish: () => Promise.resolve({ data: { unpublish: [] } }),
      },
      confirmDeletion: {
        deleting: () => null,
        reset: () => null,
      },
      toasts: {
        display: () => null,
        success: () => null,
        error: (message) => {
          lastToastErrorMessage = message;
        },
      },
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

test('AssetAdmin refetchFolder reject known error', async () => {
  render(
    <AssetAdmin {...makeProps()} />
  );
  rejectBackendGet(createJsonError('Cannot read files'));
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('Cannot read files');
});

test('AssetAdmin refetchFolder reject unknown error', async () => {
  render(
    <AssetAdmin {...makeProps()} />
  );
  rejectBackendGet();
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('An unknown error has occurred.');
});

test('AssetAdmin handleSubmitEditor should call the onSubmitEditor property when that is supplied', async () => {
  const onSubmitEditor = jest.fn(() => Promise.resolve(null));
  const paramSubmit = jest.fn(() => Promise.resolve(null));
  render(
    <AssetAdmin {...makeProps({
      onSubmitEditor
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
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
  resolveBackendGet(makeReadFileResponse());
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
  resolveBackendGet(makeReadFileResponse());
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
  resolveBackendGet(makeReadFileResponse());
  const search = await screen.findByTestId('test-search');
  nextParams = [{
    currentFolderOnly: true
  }];
  fireEvent.click(search);
  expect(deselectFiles.mock.calls.length).toBe(1);
});

const setupHandleDeleteTest = async () => {
  render(
    <AssetAdmin {...makeProps()}/>
  );
  resolveBackendGet(makeReadFileResponse());
  const confirmation = await screen.findByTestId('test-bulk-delete-confirmation');
  nextParams = [[1]];
  fireEvent.click(confirmation);
};

test('AssetAdmin handleDelete should delete a file', async () => {
  await setupHandleDeleteTest();
  resolveBackendPost();
  expect(lastBackendPostEndpoint).toBe('test/endpoint/delete');
  expect(lastBackendPostData).toEqual({ ids: [1] });
});

test('AssetAdmin handleDelete reject known error', async () => {
  await setupHandleDeleteTest();
  rejectBackendPost(createJsonError('Cannot delete files'));
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('Cannot delete files');
});

test('AssetAdmin handleDelete reject unknown error', async () => {
  await setupHandleDeleteTest();
  rejectBackendPost();
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('An unknown error has occurred.');
});

test('AssetAdmin handleDelete should remove the file from the queued files list', async () => {
  const removeQueuedFile = jest.fn();
  render(
    <AssetAdmin {...makeProps({
      queuedFiles: {
        items: [
          {
            id: 2,
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
  resolveBackendGet(makeReadFileResponse());
  const confirmation = await screen.findByTestId('test-bulk-delete-confirmation');
  nextParams = [[2]];
  fireEvent.click(confirmation);
  resolveBackendPost();
  // wait for the next tick to ensure that the post request has completed
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(removeQueuedFile.mock.calls.length).toBe(1);
  expect(removeQueuedFile.mock.calls[0][0]).toEqual(2);
});

const setupDoPublishTest = async () => {
  render(
    <AssetAdmin {...makeProps()}/>
  );
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'publish';
  nextParams = [[1]];
  fireEvent.click(gallery);
};

test('AssetAdmin doPublish should publish a file', async () => {
  await setupDoPublishTest();
  resolveBackendPost();
  expect(lastBackendPostEndpoint).toBe('test/endpoint/publish');
  expect(lastBackendPostData).toEqual({ ids: [1] });
});

test('AssetAdmin doPublish reject known error', async () => {
  await setupDoPublishTest();
  rejectBackendPost(createJsonError('Cannot publish files'));
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('Cannot publish files');
});

test('AssetAdmin doPublish reject unknown error', async () => {
  await setupDoPublishTest();
  rejectBackendPost();
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('An unknown error has occurred.');
});

const setupReadLiveOwnerCountsTest = async () => {
  // simulate confirming window.confirm() dialog
  global.confirm = jest.fn(() => true);
  render(
    <AssetAdmin {...makeProps()}/>
  );
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'unpublish';
  nextParams = [[1, 2]];
  fireEvent.click(gallery);
};

test('AssetAdmin readLiveOwnerCounts reject known error', async () => {
  await setupReadLiveOwnerCountsTest();
  rejectBackendGet(createJsonError('Cannot read live owner counts'));
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('Cannot read live owner counts');
});

test('AssetAdmin readLiveOwnerCounts reject unknown error', async () => {
  await setupReadLiveOwnerCountsTest();
  rejectBackendGet();
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('An unknown error has occurred.');
});

// This also doubles as testing readLiveOwnerCounts success
const setupDoUnpublishTest = async () => {
  await setupReadLiveOwnerCountsTest();
  resolveBackendGet({
    json: () => [
      {
        id: 1,
        count: 1,
        message: 'lorem',
      },
      {
        id: 2,
        count: 1,
        message: 'ipsum',
      }
    ]
  });
  expect(lastBackendGetEndpoint).toBe('test/endpoint/readLiveOwnerCounts?ids[]=1&ids[]=2');
  // wait for the next tick to ensure that the post request has fired
  await new Promise(resolve => setTimeout(resolve, 0));
};

test('AssetAdmin doUnpublish should unpublish a file', async () => {
  await setupDoUnpublishTest();
  resolveBackendPost();
  expect(lastBackendPostEndpoint).toBe('test/endpoint/unpublish');
  expect(lastBackendPostData).toEqual({ ids: [1, 2] });
});

test('AssetAdmin doUnpublish reject known error', async () => {
  await setupDoUnpublishTest();
  rejectBackendPost(createJsonError('Cannot unpublish files'));
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('Cannot unpublish files');
});

test('AssetAdmin doUnpublish reject unknown error', async () => {
  await setupDoUnpublishTest();
  rejectBackendPost();
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('An unknown error has occurred.');
});

test('AssetAdmin handleUploadQueue should not refresh if no file is open', async () => {
  const read = jest.fn();
  render(
    <AssetAdmin {...makeProps({
      fileId: 0,
      actions: {
        ...makeProps().actions,
        files: {
          ...makeProps().actions.files,
          read
        }
      },
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'successfulupload';
  fireEvent.click(gallery);
  expect(read.mock.calls.length).toBe(0);
});

test('AssetAdmin getFiles no files provided', async () => {
  render(
    <AssetAdmin {...makeProps({
      queuedFiles: {
        items: []
      },
      folderId: 99
    })}
    />
  );
  resolveBackendGet({
    json: () => ({
      children: {
        pageInfo: {
          totalCount: 0,
        },
        nodes: [],
      },
    }),
  });
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
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([1, 2]);
});

test('AssetAdmin getFiles some files in a folder', async () => {
  render(
    <AssetAdmin {...makeProps({
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
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([3, 4, 1, 2]);
});

test('AssetAdmin getFiles upload error e.g. invalid file extension', async () => {
  render(
    <AssetAdmin {...makeProps({
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
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([0, 1, 2]);
});

test('AssetAdmin getFiles upload in progress', async () => {
  render(
    <AssetAdmin {...makeProps({
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
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([0, 1, 2]);
});

test('AssetAdmin getFiles upload in progress to root folder', async () => {
  render(
    <AssetAdmin {...makeProps({
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
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([0, 1, 2]);
});

test('AssetAdmin viewing a folder after uploading to a different folder', async () => {
  render(
    <AssetAdmin {...makeProps({
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
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([1, 2]);
});

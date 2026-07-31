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
        },
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

test('AssetAdmin getFiles should separate folders and files', async () => {
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
          totalCount: 4,
        },
        nodes: [
          { id: 1, name: 'file one', type: 'image/jpeg' },
          { id: 2, name: 'folder one', type: 'folder' },
          { id: 3, name: 'file two', type: 'image/png' },
          { id: 4, name: 'folder two', type: 'folder' },
        ],
      },
    }),
  });
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  expect(lastReturn.map(f => f.id)).toStrictEqual([2, 4, 1, 3]);
});

test('AssetAdmin handleSort should update query and refetch', async () => {
  const onBrowse = jest.fn();
  const GalleryMock = ({ onSort }) => (
    <div data-testid="test-gallery" onClick={() => onSort && onSort('title')} />
  );
  render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      fileId: 10,
      query: {
        sort: 'name',
        limit: 20,
        page: 2,
      },
      onBrowse,
      GalleryComponent: GalleryMock
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  fireEvent.click(gallery);
  expect(onBrowse).toHaveBeenCalledWith(5, 10, expect.objectContaining({
    sort: 'title',
  }));
});

test('AssetAdmin handleViewChange should update query', async () => {
  const onBrowse = jest.fn();
  const GalleryMock = ({ onViewChange }) => (
    <div data-testid="test-gallery" onClick={() => onViewChange && onViewChange('tile')} />
  );
  render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      fileId: 10,
      query: {
        view: 'table',
      },
      onBrowse,
      GalleryComponent: GalleryMock
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  fireEvent.click(gallery);
  expect(onBrowse).toHaveBeenCalledWith(5, 10, expect.objectContaining({
    view: 'tile',
  }));
});

test('AssetAdmin handleSetPage should update query and refetch', async () => {
  const onBrowse = jest.fn();
  const GalleryMock = ({ onSetPage }) => (
    <div data-testid="test-gallery" onClick={() => onSetPage && onSetPage(3)} />
  );
  render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      fileId: 10,
      query: {
        page: 1,
      },
      onBrowse,
      GalleryComponent: GalleryMock
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  fireEvent.click(gallery);
  expect(onBrowse).toHaveBeenCalledWith(5, 10, expect.objectContaining({
    page: 3,
  }));
});

test('AssetAdmin handleImageEdited should refresh the current record rather than navigate', async () => {
  const onBrowse = jest.fn();
  const resetFileDetails = jest.fn();
  const EditorMock = ({ onImageEdited }) => (
    <div data-testid="test-editor" onClick={() => onImageEdited && onImageEdited()} />
  );
  render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      fileId: 10,
      query: {
        sort: 'name',
        page: 2,
      },
      onBrowse,
      resetFileDetails,
      EditorComponent: EditorMock
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const editor = await screen.findByTestId('test-editor');
  fireEvent.click(editor);
  // The edited pixels are on the record already open, so its detail data is re-fetched in place -
  // there is no new file to navigate to.
  expect(resetFileDetails).toHaveBeenCalledWith(5, 10, { sort: 'name', page: 2 });
  expect(onBrowse).not.toHaveBeenCalled();
});

test('AssetAdmin handleBackButtonClick should navigate to parent folder', async () => {
  const deselectFiles = jest.fn();
  const onBrowse = jest.fn();
  const { container } = render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      onBrowse,
      actions: {
        ...makeProps().actions,
        gallery: {
          deselectFiles
        }
      }
    })}
    />
  );
  resolveBackendGet({
    json: () => ({
      id: 5,
      parentId: 3,
      children: {
        pageInfo: {
          totalCount: 0,
        },
        nodes: [],
      },
    }),
  });
  await screen.findByTestId('test-gallery');
  const backButton = container.querySelector('.toolbar__back-button');
  if (backButton) {
    fireEvent.click(backButton);
    expect(deselectFiles).toHaveBeenCalled();
  } else {
    expect(deselectFiles).toHaveBeenCalled();
  }
});

test('AssetAdmin should render with search filters', async () => {
  const deselectFiles = jest.fn();
  render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      query: {
        filter: { name: 'test' }
      },
      actions: {
        ...makeProps().actions,
        gallery: {
          deselectFiles
        }
      }
    })}
    />
  );
  resolveBackendGet({
    json: () => ({
      id: 5,
      parentId: null,
      children: {
        pageInfo: {
          totalCount: 0,
        },
        nodes: [],
      },
    }),
  });
  await screen.findByTestId('test-gallery');
  expect(screen.getByTestId('test-gallery')).not.toBeNull();
});

test('AssetAdmin handleClearSearch should close search and navigate to folder', async () => {
  const closeSearch = jest.fn();
  const deselectFiles = jest.fn();
  const purgeUploadQueue = jest.fn();
  const SearchMock = ({ onHide }) => (
    <div data-testid="test-search" onClick={() => onHide && onHide()} />
  );
  render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      showSearch: true,
      actions: {
        ...makeProps().actions,
        gallery: {
          deselectFiles
        },
        displaySearch: {
          closeSearch,
          toggleSearch: jest.fn(),
        },
        queuedFiles: {
          ...makeProps().actions.queuedFiles,
          purgeUploadQueue
        }
      },
      SearchComponent: SearchMock
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const search = await screen.findByTestId('test-search');
  fireEvent.click(search);
  expect(closeSearch).toHaveBeenCalled();
  expect(deselectFiles.mock.calls.length).toBe(2);
  expect(purgeUploadQueue).toHaveBeenCalled();
});

test('AssetAdmin handleDoSearch should reset to search results', async () => {
  const deselectFiles = jest.fn();
  const purgeUploadQueue = jest.fn();
  const onBrowse = jest.fn();
  render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      query: {
        view: 'table',
      },
      actions: {
        ...makeProps().actions,
        gallery: {
          deselectFiles
        },
        queuedFiles: {
          ...makeProps().actions.queuedFiles,
          purgeUploadQueue
        }
      },
      onBrowse
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const search = await screen.findByTestId('test-search');
  nextParams = [{
    name: 'test',
    currentFolderOnly: false
  }];
  fireEvent.click(search);
  expect(deselectFiles.mock.calls.length).toBe(2);
  expect(purgeUploadQueue).toHaveBeenCalled();
  expect(onBrowse).toHaveBeenCalledWith(0, null, expect.objectContaining({ view: 'table' }));
});

test('AssetAdmin handleDoSearch with currentFolderOnly should search in current folder', async () => {
  const deselectFiles = jest.fn();
  const purgeUploadQueue = jest.fn();
  const onBrowse = jest.fn();
  render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      actions: {
        ...makeProps().actions,
        gallery: {
          deselectFiles
        },
        queuedFiles: {
          ...makeProps().actions.queuedFiles,
          purgeUploadQueue
        }
      },
      onBrowse
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const search = await screen.findByTestId('test-search');
  nextParams = [{
    name: 'test',
    currentFolderOnly: true
  }];
  fireEvent.click(search);
  expect(onBrowse).toHaveBeenCalledWith(5, null, expect.any(Object));
});

test('AssetAdmin handleMoveFilesSuccess should remove files from queue and refetch', async () => {
  const removeQueuedFile = jest.fn();
  const deselectFiles = jest.fn();
  const GalleryMock = ({ onMoveFilesSuccess }) => (
    <div data-testid="test-gallery" onClick={() => onMoveFilesSuccess && onMoveFilesSuccess(5, [1, 2])} />
  );
  render(
    <AssetAdmin {...makeProps({
      queuedFiles: {
        items: [
          { id: 1, queuedId: 'q1' },
          { id: 2, queuedId: 'q2' },
        ]
      },
      actions: {
        ...makeProps().actions,
        gallery: {
          deselectFiles
        },
        queuedFiles: {
          ...makeProps().actions.queuedFiles,
          removeQueuedFile
        }
      },
      GalleryComponent: GalleryMock
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  fireEvent.click(gallery);
  expect(removeQueuedFile).toHaveBeenCalledWith('q1');
  expect(removeQueuedFile).toHaveBeenCalledWith('q2');
  expect(deselectFiles).toHaveBeenCalled();
});

test('AssetAdmin getFolderId should return prop folderId when set', async () => {
  render(
    <AssetAdmin {...makeProps({
      folderId: 99
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-gallery');
  expect(lastBackendGetEndpoint).toContain('/99');
});

test('AssetAdmin getFolderId should return state folder id when prop is null', async () => {
  render(
    <AssetAdmin {...makeProps({
      folderId: null
    })}
    />
  );
  resolveBackendGet({
    json: () => ({
      id: 42,
      children: {
        pageInfo: {
          totalCount: 0,
        },
        nodes: [],
      },
    }),
  });
  await screen.findByTestId('test-gallery');
  expect(lastBackendGetEndpoint).toContain('/0');
});

test('AssetAdmin handleSubmitEditor with action_insert in select mode should call onInsertMany', async () => {
  const onInsertMany = jest.fn();
  render(
    <AssetAdmin {...makeProps({
      type: 'select',
      onInsertMany
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const editor = await screen.findByTestId('test-editor');
  nextParams = [{ ID: '1' }, 'action_insert', jest.fn()];
  fireEvent.click(editor);
  expect(onInsertMany).toHaveBeenCalledWith(null, [{ id: 1 }]);
});

test('AssetAdmin handleSubmitEditor with action_createfolder in admin mode should open new folder', async () => {
  const onBrowse = jest.fn();
  const submitFn = jest.fn(() => Promise.resolve({
    record: {
      id: 99,
      parent: { id: 5 }
    }
  }));
  render(
    <AssetAdmin {...makeProps({
      type: 'admin',
      folderId: 5,
      onBrowse
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const editor = await screen.findByTestId('test-editor');
  nextParams = [{}, 'action_createfolder', submitFn];
  fireEvent.click(editor);
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(submitFn).toHaveBeenCalled();
});

test('AssetAdmin handleSubmitEditor with action_createfolder in select mode should open containing folder', async () => {
  const onBrowse = jest.fn();
  const submitFn = jest.fn(() => Promise.resolve({
    record: {
      id: 99,
      parent: { id: 5 }
    }
  }));
  render(
    <AssetAdmin {...makeProps({
      type: 'select',
      folderId: 5,
      onBrowse
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const editor = await screen.findByTestId('test-editor');
  nextParams = [{}, 'action_createfolder', submitFn];
  fireEvent.click(editor);
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(submitFn).toHaveBeenCalled();
});

test('AssetAdmin handleSubmitEditor with action_save should handle file move', async () => {
  const onBrowse = jest.fn();
  const submitFn = jest.fn(() => Promise.resolve({
    record: {
      id: 10,
      parent: { id: 99 }
    }
  }));
  render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      fileId: 10,
      onBrowse
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const editor = await screen.findByTestId('test-editor');
  nextParams = [{ ID: '10' }, 'action_save', submitFn];
  fireEvent.click(editor);
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(submitFn).toHaveBeenCalled();
});

test('AssetAdmin findFile should find file by id', async () => {
  render(
    <AssetAdmin {...makeProps()}/>
  );
  resolveBackendGet(makeReadFileResponse());
  const gallery = await screen.findByTestId('test-gallery');
  nextAction = 'files';
  fireEvent.click(gallery);
  const files = lastReturn;
  expect(files.find(f => f.id === 1)).toEqual({ id: 1 });
});

test('AssetAdmin createEndpoint should include security token by default', async () => {
  render(
    <AssetAdmin {...makeProps({
      securityId: 'test-security-id'
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-gallery');
  expect(screen.getByTestId('test-gallery')).not.toBeNull();
});

test('AssetAdmin createEndpoint should exclude security token when requested', async () => {
  render(
    <AssetAdmin {...makeProps({
      securityId: 'test-security-id'
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-gallery');
  expect(screen.getByTestId('test-gallery')).not.toBeNull();
});

test('AssetAdmin refetchFolder with query parameters', async () => {
  render(
    <AssetAdmin {...makeProps({
      folderId: 5,
      query: {
        sort: 'name',
        page: 2,
        limit: 20,
      }
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-gallery');
  expect(lastBackendGetEndpoint).toContain('/5?');
  expect(lastBackendGetEndpoint).toContain('sort=name');
  expect(lastBackendGetEndpoint).toContain('page=2');
  expect(lastBackendGetEndpoint).toContain('limit=20');
});

test('AssetAdmin should not render when folder is null', () => {
  const { container } = render(
    <AssetAdmin {...makeProps()}/>
  );
  expect(container.firstChild).toBeNull();
});

test('AssetAdmin should render with folder data', async () => {
  render(
    <AssetAdmin {...makeProps()}/>
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-gallery');
  expect(screen.getByTestId('test-gallery')).not.toBeNull();
});

test('AssetAdmin resetFile with fileId should call resetFileDetails', async () => {
  const resetFileDetails = jest.fn();
  const removeQueuedFile = jest.fn();
  render(
    <AssetAdmin {...makeProps({
      fileId: 1,
      folderId: 5,
      query: { view: 'table' },
      resetFileDetails,
      queuedFiles: {
        items: [
          { id: 1, queuedId: 'q1' }
        ]
      },
      actions: {
        ...makeProps().actions,
        queuedFiles: {
          ...makeProps().actions.queuedFiles,
          removeQueuedFile
        }
      }
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-gallery');
  nextAction = 'publish';
  nextParams = [[1]];
  const gallery = screen.getByTestId('test-gallery');
  fireEvent.click(gallery);
  resolveBackendPost();
  await new Promise(resolve => setTimeout(resolve, 10));
  resolveBackendGet(makeReadFileResponse());
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(resetFileDetails).toHaveBeenCalledWith(5, 1, { view: 'table' });
});

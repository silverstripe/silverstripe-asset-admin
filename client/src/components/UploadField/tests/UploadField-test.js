/* global jest, test, expect, beforeEach */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as UploadField } from '../UploadField';

let selectingItem;
beforeEach(() => {
  selectingItem = undefined;
});

const fileInSubFolder = {
  id: 2,
  name: 'MyFile.jpg',
  parent: {
    filename: 'Folder/SubFolder',
    id: 23,
    title: 'SubFolder',
  }
};

const fileInRoot = {
  id: 4,
  name: 'AnotherFile.jpg',
  parent: {
    filename: null,
    id: 0,
    title: null
  }
};

const fileUploadInProgress = {
  id: 0,
  queuedId: 'abc',
  name: 'NewFile.jpg',
  progress: 20
};

const files = [
  fileInSubFolder,
  fileInRoot,
  fileUploadInProgress,
];

function makeProps(obj = {}) {
  return {
    id: 'Form_MyTestUpload',
    name: 'MyTestUpload',
    files,
    onChange: jest.fn(),
    actions: {
      uploadField: {
        setFormSchemaFilesHash: jest.fn(),
        setFiles: jest.fn(),
        removeFile: jest.fn(),
      },
      modal: {
        initFormStack: jest.fn(),
        reset: jest.fn(),
      }
    },
    data: {
      multi: true,
      maxFiles: null,
      maxFilesize: null,
      createFileEndpoint: {
        url: 'test',
        method: 'POST',
        payloadFormat: 'json',
      },
      parentid: 0,
      files,
      canAttach: true,
      canUpload: true,
    },
    value: {
      Files: [2, 4],
    },
    securityId: 'TestingBob',
    UploadFieldItem: ({ onView, item }) => <div data-testid="test-upload-field-item" onClick={() => onView({}, selectingItem)} data-name={item.name}/>,
    AssetDropzone: ({ options, className }) => {
      const opts = Object.keys(options).map(k => `${k}:${options[k]}`).join(',');
      return <div data-testid="test-asset-dropzone" data-options={opts} className={className}/>;
    },
    InsertMediaModal: ({ folderId }) => <div data-testid="test-insert-media-modal" data-folder-id={folderId}/>,
    getItemProps: (draftProps) => draftProps,
    ...obj
  };
}

test('UploadField getMaxFiles() should be a max one always for single file uploadfields ', () => {
  const { container } = render(
    <UploadField {...makeProps({
      data: {
        ...makeProps().data,
        multi: false,
        maxFiles: 3,
      },
      files: []
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]').getAttribute('data-options')).toContain('maxFiles:1');
});

test('UploadField getMaxFiles() should return null if max files prop was left empty', () => {
  const { container } = render(
    <UploadField {...makeProps({
      data: {
        ...makeProps().data,
        multi: true,
        maxFiles: null
      },
      files: []
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]').getAttribute('data-options')).toContain('maxFiles:null');
});

test('UploadField getMaxFiles() should return zero when there are more files uploaded than maxFiles', () => {
  const { container } = render(
    <UploadField {...makeProps({
      data: {
        ...makeProps().data,
        multi: true,
        maxFiles: 2
      },
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]').getAttribute('data-options')).toContain('maxFiles:0');
});

test('UploadField getMaxFiles() should return a positive number when there are less files uploaded than maxFiles', () => {
  const { container } = render(
    <UploadField {...makeProps({
      data: {
        ...makeProps().data,
        multi: true,
        maxFiles: 5
      },
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]').getAttribute('data-options')).toContain('maxFiles:3');
});

test('UploadField getFolderId() should match the the parentid of a provided file', async () => {
  render(
    <UploadField {...makeProps({})}/>
  );
  selectingItem = fileInSubFolder;
  const items = await screen.findAllByTestId('test-upload-field-item');
  const item = items[0];
  expect(item.getAttribute('data-name')).toBe('MyFile.jpg');
  fireEvent.click(item);
  const modal = await screen.findByTestId('test-insert-media-modal');
  expect(modal.getAttribute('data-folder-id')).toBe('23');
});

test('UploadField getFolderId() should match 0 for file in root', async () => {
  render(
    <UploadField {...makeProps({})}/>
  );
  selectingItem = fileInRoot;
  const items = await screen.findAllByTestId('test-upload-field-item');
  const item = items[1];
  expect(item.getAttribute('data-name')).toBe('AnotherFile.jpg');
  fireEvent.click(item);
  const modal = await screen.findByTestId('test-insert-media-modal');
  expect(modal.getAttribute('data-folder-id')).toBe('0');
});

test('UploadField getFolderId() should match 0 for file in root', async () => {
  render(
    <UploadField {...makeProps({
      data: {
        parentid: 23
      }
    })}
    />
  );
  const modal = await screen.findByTestId('test-insert-media-modal');
  expect(modal.getAttribute('data-folder-id')).toBe('23');
});

test('UploadField getFolderId() should match 0 (file system root id) when no parentid specified', async () => {
  render(
    <UploadField {...makeProps()}/>
  );
  const modal = await screen.findByTestId('test-insert-media-modal');
  expect(modal.getAttribute('data-folder-id')).toBe('0');
});

test('UploadField componentDidMount() should set the files for redux-form to use for submit', () => {
  const setFiles = jest.fn();
  render(
    <UploadField {...makeProps({
      actions: {
        ...makeProps().actions,
        uploadField: {
          ...makeProps().actions.uploadField,
          setFiles,
        }
      }
    })}
    />
  );
  expect(setFiles).toBeCalled();
});

test('UploadField componentDidMount() should not call onChange for the same file list', () => {
  const onChange = jest.fn();
  render(
    <UploadField {...makeProps({
      onChange
    })}
    />
  );
  expect(onChange).not.toBeCalled();
});

test('UploadField componentDidMount() should call onChange when an item was added to the file list', () => {
  const onChange = jest.fn();
  const { rerender } = render(
    <UploadField {...makeProps({
      onChange,
    })}
    />
  );
  rerender(
    <UploadField {...makeProps({
      onChange,
      files: [
        ...makeProps().files,
        { id: 9 },
      ]
    })}
    />
  );
  expect(onChange).toBeCalled();
});

test('UploadField componentDidMount() shoudl call onChagne if one of the item ids changed', () => {
  const onChange = jest.fn();
  const { rerender } = render(
    <UploadField {...makeProps({
      onChange,
    })}
    />
  );
  rerender(
    <UploadField {...makeProps({
      onChange,
      files: [
        ...makeProps().files.filter((item) => item.id !== 4),
        { id: 12 },
      ]
    })}
    />
  );
  expect(onChange).toBeCalled();
});

test('UploadField renderDropzone() should not render the dropzone when there is not create endpoint', () => {
  const { container } = render(
    <UploadField {...makeProps({
      data: {
        ...makeProps().data,
        createFileEndpoint: null,
      }
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]')).toBe(null);
});

test('UploadField renderDropzone() should hide the dropzone when maxFiles reached', () => {
  const { container } = render(
    <UploadField {...makeProps({
      data: {
        ...makeProps().data,
        multi: true,
        maxFiles: 2,
      }
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]').classList).toContain('uploadfield__dropzone--hidden');
});

test('UploadField renderDropzone() should show the dropzone when maxFiles has not been reached', () => {
  const { container } = render(
    <UploadField {...makeProps({
      data: {
        ...makeProps().data,
        multi: true,
        maxFiles: 4,
      }
    })}
    />
  );
  expect(container.querySelector('[data-testid="test-asset-dropzone"]').classList).not.toContain('uploadfield__dropzone--hidden');
});

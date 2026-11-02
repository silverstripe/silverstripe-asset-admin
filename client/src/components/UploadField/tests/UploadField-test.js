/* global jest, test, expect, beforeEach */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import md5 from 'crypto-js/md5';
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
      endpoints: {
        createFile: {
          url: 'test',
          method: 'POST',
          payloadFormat: 'json',
        },
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
        ...makeProps().data,
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
        endpoints: {
          createFile: null
        }
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

test('UploadField renderDropzone() should render a no files message when read only and empty', () => {
  const { container } = render(
    <UploadField {...makeProps({ readOnly: true, files: [] })}/>
  );
  expect(screen.getByText('No files')).not.toBeNull();
  expect(container.querySelector('[data-testid="test-asset-dropzone"]')).toBe(null);
});

test('UploadField renderDropzone() should render no dropzone or message when read only with files', () => {
  const { container } = render(
    <UploadField {...makeProps({ readOnly: true })}/>
  );
  expect(screen.queryByText('No files')).toBeNull();
  expect(container.querySelector('[data-testid="test-asset-dropzone"]')).toBe(null);
  expect(screen.getAllByTestId('test-upload-field-item')).toHaveLength(3);
});

test('UploadField renderDropzone() should render buttons depending on canUpload and canAttach', () => {
  const AssetDropzone = ({ children }) => <div>{children}</div>;
  const { rerender } = render(
    <UploadField {...makeProps({ AssetDropzone })}/>
  );
  expect(screen.getByText('Upload new')).not.toBeNull();
  expect(screen.getByText('or')).not.toBeNull();
  expect(screen.getByText('Choose existing')).not.toBeNull();
  rerender(
    <UploadField {...makeProps({
      AssetDropzone,
      data: { ...makeProps().data, canUpload: false },
    })}
    />
  );
  expect(screen.queryByText('Upload new')).toBeNull();
  expect(screen.queryByText('or')).toBeNull();
  expect(screen.getByText('Choose existing')).not.toBeNull();
});

test('UploadField handleAddShow() should initialise the form stack and open the modal', () => {
  const props = makeProps({
    AssetDropzone: ({ children }) => <div>{children}</div>,
    InsertMediaModal: ({ isOpen }) => <div data-testid="test-insert-media-modal" data-open={String(isOpen)}/>,
  });
  render(<UploadField {...props}/>);
  expect(screen.getByTestId('test-insert-media-modal').getAttribute('data-open')).toBe('false');
  fireEvent.click(screen.getByText('Choose existing'));
  expect(props.actions.modal.initFormStack).toBeCalledWith('select', 'admin');
  expect(screen.getByTestId('test-insert-media-modal').getAttribute('data-open')).toBe('true');
});

test('UploadField handleAddInsert() should add the file and close the modal', async () => {
  const addFile = jest.fn();
  const base = makeProps();
  const props = makeProps({
    actions: { ...base.actions, uploadField: { ...base.actions.uploadField, addFile } },
    InsertMediaModal: ({ onInsert, onInsertMany }) => (
      <div>
        <button type="button" onClick={() => onInsert({}, null, { id: 7 })}>insert</button>
        <button type="button" onClick={() => onInsertMany({}, [{ id: 8 }, { id: 9 }])}>insertmany</button>
      </div>
    ),
  });
  render(<UploadField {...props}/>);
  fireEvent.click(screen.getByText('insert'));
  expect(addFile).toBeCalledWith('Form_MyTestUpload', { id: 7 });
  expect(props.actions.modal.reset).toBeCalledTimes(1);
  fireEvent.click(screen.getByText('insertmany'));
  expect(addFile).toBeCalledWith('Form_MyTestUpload', { id: 8 });
  expect(addFile).toBeCalledWith('Form_MyTestUpload', { id: 9 });
  expect(addFile).toBeCalledTimes(3);
});

test('UploadField handleReplace() should remove the selected item and add the new file', () => {
  const addFile = jest.fn();
  const removeFile = jest.fn();
  const base = makeProps();
  const props = makeProps({
    actions: { ...base.actions, uploadField: { ...base.actions.uploadField, addFile, removeFile } },
    UploadFieldItem: ({ onView }) => <button type="button" onClick={() => onView({}, fileInRoot)}>view</button>,
    InsertMediaModal: ({ onInsert, maxFiles }) => (
      <button type="button" data-max={maxFiles} onClick={() => onInsert({}, null, { id: 7 })}>insert</button>
    ),
  });
  render(<UploadField {...props}/>);
  fireEvent.click(screen.getAllByText('view')[0]);
  expect(screen.getByText('insert').getAttribute('data-max')).toBe('1');
  fireEvent.click(screen.getByText('insert'));
  expect(removeFile).toBeCalledWith('Form_MyTestUpload', fileInRoot);
  expect(addFile).toBeCalledWith('Form_MyTestUpload', { id: 7 });
  expect(props.actions.modal.reset).toBeCalledTimes(1);
});

test('UploadField handleItemRemove() should remove the file', () => {
  const removeFile = jest.fn();
  const base = makeProps();
  const props = makeProps({
    actions: { ...base.actions, uploadField: { ...base.actions.uploadField, removeFile } },
    UploadFieldItem: ({ onRemove, item }) => <button type="button" onClick={(e) => onRemove(e, item)}>remove</button>,
  });
  render(<UploadField {...props}/>);
  fireEvent.click(screen.getAllByText('remove')[1]);
  expect(removeFile).toBeCalledWith('Form_MyTestUpload', fileInRoot);
});

test('UploadField handleChange() should write the file ids back through onChange', () => {
  const onChange = jest.fn();
  const { rerender } = render(<UploadField {...makeProps({ onChange })}/>);
  rerender(<UploadField {...makeProps({ onChange, files: [fileInRoot, fileUploadInProgress] })}/>);
  expect(onChange).toBeCalledTimes(1);
  expect(onChange).toBeCalledWith(null, { id: 'Form_MyTestUpload', value: { Files: [4] } });
});

test('UploadField dropzone handlers should dispatch the matching upload actions', () => {
  const base = makeProps();
  const uploadField = {
    ...base.actions.uploadField,
    addFile: jest.fn(),
    updateQueuedFile: jest.fn(),
    succeedUpload: jest.fn(),
    failUpload: jest.fn(),
  };
  const queued = { _queuedId: 'abc', xhr: { status: 500, response: '[{"id":5}]' } };
  const props = makeProps({
    actions: { ...base.actions, uploadField },
    AssetDropzone: ({ onAddedFile, onSending, onUploadProgress, onSuccess, onError }) => (
      <div>
        <button type="button" onClick={() => onAddedFile({ name: 'a' })}>added</button>
        <button type="button" onClick={() => onSending(queued, 'xhr')}>sending</button>
        <button type="button" onClick={() => onUploadProgress(queued, 50)}>progress</button>
        <button type="button" onClick={() => onSuccess(queued)}>success</button>
        <button type="button" onClick={() => onError({ _queuedId: 'abc' }, 'oops')}>error</button>
      </div>
    ),
  });
  render(<UploadField {...props}/>);
  fireEvent.click(screen.getByText('added'));
  expect(uploadField.addFile).toBeCalledWith('Form_MyTestUpload', { name: 'a', uploaded: true });
  fireEvent.click(screen.getByText('sending'));
  expect(uploadField.updateQueuedFile).toBeCalledWith('Form_MyTestUpload', 'abc', { xhr: 'xhr' });
  fireEvent.click(screen.getByText('progress'));
  expect(uploadField.updateQueuedFile).toBeCalledWith('Form_MyTestUpload', 'abc', { progress: 50 });
  fireEvent.click(screen.getByText('success'));
  expect(uploadField.succeedUpload).toBeCalledWith('Form_MyTestUpload', 'abc', { id: 5 });
  fireEvent.click(screen.getByText('error'));
  expect(uploadField.failUpload).toBeCalledWith('Form_MyTestUpload', 'abc', 'oops', '');
});

test('UploadField handleSuccessfulUpload() should fail the upload when the response holds an error', () => {
  const base = makeProps();
  const uploadField = { ...base.actions.uploadField, succeedUpload: jest.fn(), failUpload: jest.fn() };
  const file = { _queuedId: 'abc', xhr: { response: '[{"error":"bad"}]' } };
  render(
    <UploadField {...makeProps({
      actions: { ...base.actions, uploadField },
      AssetDropzone: ({ onSuccess }) => <button type="button" onClick={() => onSuccess(file)}>success</button>,
    })}
    />
  );
  fireEvent.click(screen.getByText('success'));
  expect(uploadField.succeedUpload).not.toBeCalled();
  expect(uploadField.failUpload).toBeCalledTimes(1);
});

test('UploadField componentDidMount() should load the schema files when the hash differs', () => {
  const props = makeProps({ formSchemaFilesHash: 'different' });
  render(<UploadField {...props}/>);
  expect(props.actions.uploadField.setFormSchemaFilesHash).toBeCalledTimes(1);
  expect(props.actions.uploadField.setFiles).toBeCalledWith('Form_MyTestUpload', props.data.files);
});

test('UploadField componentDidMount() should load files from redux state when the hash matches', () => {
  const hash = md5(JSON.stringify([2, 4])).toString();
  const props = makeProps({ formSchemaFilesHash: hash });
  render(<UploadField {...props}/>);
  expect(props.actions.uploadField.setFormSchemaFilesHash).not.toBeCalled();
  expect(props.actions.uploadField.setFiles).toBeCalledWith('Form_MyTestUpload', files);
});

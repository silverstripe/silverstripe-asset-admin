/* global jest, test, expect, beforeEach */

import React from 'react';
import { render, act } from '@testing-library/react';
import DropzoneLib from '@deltablot/dropzone';
import AssetDropzone from '../AssetDropzone';

jest.mock('@deltablot/dropzone', () => jest.fn());

let instances;

beforeEach(() => {
  instances = [];
  DropzoneLib.mockReset();
  DropzoneLib.mockImplementation((element, options) => {
    const instance = {
      element,
      options,
      hiddenFileInput: document.createElement('input'),
      files: ['a'],
      enable: jest.fn(),
      destroy: jest.fn(),
      removeFile: jest.fn(),
      cancelUpload: jest.fn(),
    };
    instances.push(instance);
    return instance;
  });
});

const makeProps = (obj = {}) => ({
  folderId: 5,
  canUpload: true,
  securityID: 'abc123',
  onAddedFile: jest.fn(),
  onError: jest.fn(),
  onSuccess: jest.fn(),
  preview: { width: 10, height: 10 },
  options: { url: 'upload' },
  ...obj,
});

test('renders wrapper, upload button and children', () => {
  const { container } = render(<AssetDropzone {...makeProps()}><p>Child</p></AssetDropzone>);
  expect(container.querySelector('.asset-dropzone')).not.toBeNull();
  expect(container.querySelector('.asset-dropzone__upload-button')).not.toBeNull();
  expect(container.querySelector('.asset-dropzone p').textContent).toBe('Child');
});

test('applies custom className', () => {
  const { container } = render(<AssetDropzone {...makeProps({ className: 'custom' })} />);
  expect(container.querySelector('.asset-dropzone.custom')).not.toBeNull();
});

test('hides upload button when uploadButton is false', () => {
  const { container } = render(<AssetDropzone {...makeProps({ uploadButton: false })} />);
  expect(container.querySelector('.asset-dropzone__upload-button')).toBeNull();
});

test('disables upload button when canUpload is false', () => {
  const { container } = render(<AssetDropzone {...makeProps({ canUpload: false })} />);
  expect(container.querySelector('.asset-dropzone__upload-button').disabled).toBe(true);
});

test('creates dropzone on mount with default options merged with props options', () => {
  const { container } = render(<AssetDropzone {...makeProps()} />);
  expect(DropzoneLib).toHaveBeenCalledTimes(1);
  expect(instances[0].element).toBe(container.querySelector('.asset-dropzone'));
  expect(instances[0].options.url).toBe('upload');
  expect(instances[0].options.timeout).toBe(0);
  expect(typeof instances[0].options.accept).toBe('function');
  expect(instances[0].options.clickable).toEqual([container.querySelector('.asset-dropzone__upload-button')]);
});

test('clickable is null when no upload button or selector', () => {
  render(<AssetDropzone {...makeProps({ uploadButton: false })} />);
  expect(instances[0].options.clickable).toBeNull();
});

test('clickable uses uploadSelector', () => {
  const { container } = render(
    <AssetDropzone {...makeProps({ uploadSelector: '.my-target' })}><span className="my-target" /></AssetDropzone>
  );
  expect(instances[0].options.clickable).toEqual([container.querySelector('.my-target')]);
});

test('adds name class to hidden input', () => {
  render(<AssetDropzone {...makeProps({ name: 'foo' })} />);
  expect(instances[0].hiddenFileInput.classList.contains('dz-input-foo')).toBe(true);
});

test('sets promptOnRemove only when provided', () => {
  render(<AssetDropzone {...makeProps({ promptOnRemove: 'Sure?' })} />);
  expect(instances[0].options.dictRemoveFileConfirmation).toBe('Sure?');
  render(<AssetDropzone {...makeProps()} />);
  expect(instances[1].options.dictRemoveFileConfirmation).toBeUndefined();
});

test('destroys dropzone on unmount', () => {
  const { unmount } = render(<AssetDropzone {...makeProps()} />);
  unmount();
  expect(instances[0].destroy).toHaveBeenCalledTimes(1);
  expect(instances[0].files).toEqual([]);
});

test('updating options re-enables dropzone and merges options', () => {
  const props = makeProps();
  const { rerender } = render(<AssetDropzone {...props} />);
  rerender(<AssetDropzone {...props} options={{ url: 'other' }} />);
  expect(instances[0].enable).toHaveBeenCalledTimes(1);
  expect(instances[0].options.url).toBe('other');
  expect(typeof instances[0].options.accept).toBe('function');
});

test('rerender with same options does not re-enable, and cannot upload does not either', () => {
  const props = makeProps();
  const { rerender } = render(<AssetDropzone {...props} />);
  rerender(<AssetDropzone {...props} className="x" />);
  rerender(<AssetDropzone {...props} canUpload={false} options={{ url: 'other' }} />);
  expect(instances[0].enable).not.toHaveBeenCalled();
});

test('update reattaches name class to hidden input', () => {
  const props = makeProps({ name: 'foo' });
  const { rerender } = render(<AssetDropzone {...props} />);
  instances[0].hiddenFileInput = document.createElement('input');
  rerender(<AssetDropzone {...props} className="x" />);
  expect(instances[0].hiddenFileInput.classList.contains('dz-input-foo')).toBe(true);
});

test('dragenter and dragleave toggle dragging class and call callbacks', () => {
  const onDragEnter = jest.fn();
  const onDragLeave = jest.fn();
  const { container } = render(<AssetDropzone {...makeProps({ onDragEnter, onDragLeave })} />);
  const node = container.querySelector('.asset-dropzone');
  const event = { target: node };
  act(() => { instances[0].options.dragenter(event); });
  expect(node.classList.contains('dragging')).toBe(true);
  expect(onDragEnter).toHaveBeenCalledWith(event);
  act(() => { instances[0].options.dragleave({ target: document.body }); });
  expect(node.classList.contains('dragging')).toBe(true);
  expect(onDragLeave).not.toHaveBeenCalled();
  act(() => { instances[0].options.dragleave(event); });
  expect(node.classList.contains('dragging')).toBe(false);
  expect(onDragLeave).toHaveBeenCalledWith(event, node);
});

test('dragenter and dragleave are ignored when canUpload is false', () => {
  const onDragEnter = jest.fn();
  const onDragLeave = jest.fn();
  const { container } = render(
    <AssetDropzone {...makeProps({ canUpload: false, onDragEnter, onDragLeave })} />
  );
  const node = container.querySelector('.asset-dropzone');
  act(() => { instances[0].options.dragenter({ target: node }); });
  act(() => { instances[0].options.dragleave({ target: node }); });
  expect(node.classList.contains('dragging')).toBe(false);
  expect(onDragEnter).not.toHaveBeenCalled();
  expect(onDragLeave).not.toHaveBeenCalled();
});

test('drop clears dragging and calls onDrop', () => {
  const onDrop = jest.fn();
  const { container } = render(<AssetDropzone {...makeProps({ onDrop })} />);
  const node = container.querySelector('.asset-dropzone');
  act(() => { instances[0].options.dragenter({ target: node }); });
  act(() => { instances[0].options.drop('evt'); });
  expect(node.classList.contains('dragging')).toBe(false);
  expect(onDrop).toHaveBeenCalledWith('evt');
});

test('drop without onDrop does not throw', () => {
  render(<AssetDropzone {...makeProps()} />);
  act(() => { instances[0].options.drop('evt'); });
});

test('handlers use the latest props', () => {
  const first = jest.fn();
  const second = jest.fn();
  const props = makeProps({ onUploadProgress: first });
  const { rerender } = render(<AssetDropzone {...props} />);
  rerender(<AssetDropzone {...props} onUploadProgress={second} />);
  instances[0].options.uploadprogress('file', 50, 100);
  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledWith('file', 50, 100);
});

test('upload progress without callback does not throw', () => {
  render(<AssetDropzone {...makeProps()} />);
  instances[0].options.uploadprogress('file', 50, 100);
});

test('upload complete passes file status', () => {
  const onUploadComplete = jest.fn();
  render(<AssetDropzone {...makeProps({ onUploadComplete })} />);
  instances[0].options.complete({ status: 'success' });
  expect(onUploadComplete).toHaveBeenCalledWith('success');
});

test('sending decorates form data and passes wrapped xhr', () => {
  const onSending = jest.fn();
  const updateFormData = jest.fn();
  render(<AssetDropzone {...makeProps({ onSending, updateFormData })} />);
  const formData = { append: jest.fn() };
  const xhr = { abort: jest.fn(), other: 1 };
  const file = { name: 'f' };
  instances[0].options.sending(file, xhr, formData);
  expect(updateFormData).toHaveBeenCalledWith(formData);
  expect(formData.append).toHaveBeenCalledWith('SecurityID', 'abc123');
  expect(formData.append).toHaveBeenCalledWith('ParentID', 5);
  const newXhr = onSending.mock.calls[0][1];
  expect(onSending.mock.calls[0][0]).toBe(file);
  expect(newXhr.other).toBe(1);
  newXhr.abort();
  expect(instances[0].cancelUpload).toHaveBeenCalledWith(file);
  expect(xhr.abort).toHaveBeenCalled();
});

test('sending without optional callbacks does not throw', () => {
  render(<AssetDropzone {...makeProps()} />);
  const formData = { append: jest.fn() };
  instances[0].options.sending({}, { abort: jest.fn() }, formData);
  expect(formData.append).toHaveBeenCalledTimes(2);
});

test('maxfilesexceeded returns callback result or true', () => {
  const onMaxFilesExceeded = jest.fn(() => false);
  render(<AssetDropzone {...makeProps({ onMaxFilesExceeded })} />);
  expect(instances[0].options.maxfilesexceeded('file')).toBe(false);
  expect(onMaxFilesExceeded).toHaveBeenCalledWith('file');
  render(<AssetDropzone {...makeProps()} />);
  expect(instances[1].options.maxfilesexceeded('file')).toBe(true);
});

test('accept calls done without error when upload is allowed', () => {
  const done = jest.fn();
  render(<AssetDropzone {...makeProps()} />);
  instances[0].options.accept({}, done);
  expect(done).toHaveBeenCalledWith();
});

test('accept rejects when canUpload is false', () => {
  const done = jest.fn();
  render(<AssetDropzone {...makeProps({ canUpload: false })} />);
  instances[0].options.accept({}, done);
  expect(done).toHaveBeenCalledWith('Uploading not permitted.');
});

test('accept rejects when canFileUpload returns false', () => {
  const done = jest.fn();
  const canFileUpload = jest.fn(() => false);
  render(<AssetDropzone {...makeProps({ canFileUpload })} />);
  const file = { name: 'x' };
  instances[0].options.accept(file, done);
  expect(canFileUpload).toHaveBeenCalledWith(file);
  expect(done).toHaveBeenCalledWith('Uploading not permitted.');
});

test('error removes file and calls onError', () => {
  const props = makeProps();
  render(<AssetDropzone {...props} />);
  instances[0].options.error('file', 'oops');
  expect(instances[0].removeFile).toHaveBeenCalledWith('file');
  expect(props.onError).toHaveBeenCalledWith('file', 'oops');
});

test('success removes file and calls onSuccess', () => {
  const props = makeProps();
  render(<AssetDropzone {...props} />);
  instances[0].options.success('file');
  expect(instances[0].removeFile).toHaveBeenCalledWith('file');
  expect(props.onSuccess).toHaveBeenCalledWith('file');
});

test('queuecomplete calls onQueueComplete when provided', () => {
  const onQueueComplete = jest.fn();
  render(<AssetDropzone {...makeProps({ onQueueComplete })} />);
  instances[0].options.queuecomplete();
  expect(onQueueComplete).toHaveBeenCalledTimes(1);
  render(<AssetDropzone {...makeProps()} />);
  instances[1].options.queuecomplete();
});

test('addedfile registers file and resolves details for non-image files', async () => {
  const onPreviewLoaded = jest.fn();
  const props = makeProps({ onPreviewLoaded });
  render(<AssetDropzone {...props} />);
  const file = new File(['abc'], 'my-file.name.pdf', { type: 'application/pdf' });
  const result = await instances[0].options.addedfile(file);
  const details = props.onAddedFile.mock.calls[0][0];
  expect(details).toEqual({
    category: 'application',
    filename: 'my-file.name.pdf',
    queuedId: file._queuedId,
    size: 3,
    title: 'my-file.name',
    extension: 'pdf',
    type: 'application/pdf',
    uploadedToFolderId: 5,
  });
  expect(typeof file._queuedId).toBe('number');
  expect(onPreviewLoaded).toHaveBeenCalledWith(details, {
    height: undefined,
    width: undefined,
    url: undefined,
    thumbnail: undefined,
    smallThumbnail: undefined,
  });
  expect(result.filename).toBe('my-file.name.pdf');
});

test('addedfile gives each file a unique queued id', async () => {
  render(<AssetDropzone {...makeProps()} />);
  const fileA = new File(['a'], 'a.pdf', { type: 'application/pdf' });
  const fileB = new File(['b'], 'b.pdf', { type: 'application/pdf' });
  await instances[0].options.addedfile(fileA);
  await instances[0].options.addedfile(fileB);
  expect(fileB._queuedId).toBe(fileA._queuedId + 1);
});

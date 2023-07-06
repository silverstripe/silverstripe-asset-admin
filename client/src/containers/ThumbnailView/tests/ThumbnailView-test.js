/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as ThumbnailView } from '../ThumbnailView';
// import mocks for injector props

// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('components/FormAlert/FormAlert');
jest.mock('components/GalleryItem/GalleryItem');

function makeProps(obj = {}) {
  return {
    files: [
      {
        key: 12,
        id: 12,
        parent: {
          id: 0
        },
        uploading: false,
        type: 'folder',
        category: 'folder',
        title: 'My test file',
      },
      {
        key: 16,
        id: 16,
        parent: {
          id: 6
        },
        uploading: false,
        type: 'folder',
        category: 'folder',
        title: 'My test file',
      },
    ],
    onOpenFile: jest.fn(),
    onOpenFolder: jest.fn(),
    onSort: jest.fn(),
    onSetPage: jest.fn(),
    renderNoItemsNotice: jest.fn(),
    badges: [],
    File: ({ selectableKey, onActivate, item }) => <div data-testid="test-file" data-id={selectableKey} onClick={onActivate} key={item.key} />,
    Folder: ({ selectableKey, onActivate, item }) => <div data-testid="test-folder" data-id={selectableKey} onClick={onActivate} key={item.key} />,
    page: 1,
    totalCount: 10,
    limit: 1,
    ...obj
  };
}

test('ThumbnailView handleSetPage()', async () => {
  const onSetPage = jest.fn();
  render(
    <ThumbnailView {...makeProps({
      onSetPage
    })}
    />
  );
  const option = await screen.findByText('5');
  const select = option.parentNode;
  fireEvent.change(select, { target: { value: option.value } });
  expect(onSetPage.mock.calls.length).toBe(1);
  expect(onSetPage.mock.calls[0][0]).toBe(5);
});

test('ThumbnailView handleNextPage()', async () => {
  const onSetPage = jest.fn();
  render(
    <ThumbnailView {...makeProps({
      page: 3,
      onSetPage
    })}
    />
  );
  const next = await screen.findByText('Next');
  fireEvent.click(next);
  expect(onSetPage.mock.calls.length).toBe(1);
  expect(onSetPage.mock.calls[0][0]).toBe(4);
});

test('ThumbnailView handlePrevPage() should decrement from the current page', async () => {
  const onSetPage = jest.fn();
  render(
    <ThumbnailView {...makeProps({
      page: 3,
      onSetPage
    })}
    />
  );
  const prev = await screen.findByText('Previous');
  fireEvent.click(prev);
  expect(onSetPage.mock.calls.length).toBe(1);
  expect(onSetPage.mock.calls[0][0]).toBe(2);
});

test('ThumbnailView handlePrevPage() should not be available from the first page', async () => {
  const onSetPage = jest.fn();
  render(
    <ThumbnailView {...makeProps({
      onSetPage
    })}
    />
  );
  await screen.findByText('Next');
  expect(screen.queryByText('Previous')).toBeNull();
});

test('ThumnbnailView filter file/folder should return true for folder types', async () => {
  render(
    <ThumbnailView {...makeProps({
      files: [
        {
          key: 12,
          id: 12,
          parent: {
            id: 0
          },
          uploading: false,
          type: 'folder',
          category: 'folder',
          title: 'My test folder',
        },
      ]
    })}
    />
  );
  const folders = await screen.findAllByTestId('test-folder');
  expect(folders.length).toBe(1);
  expect(folders[0].getAttribute('data-id')).toBe('12');
});

test('ThumnbnailView filter file/folder should return true for non-folder types', async () => {
  render(
    <ThumbnailView {...makeProps({
      files: [
        {
          key: 13,
          id: 13,
          parent: {
            id: 0
          },
          uploading: false,
          type: 'image',
          category: 'image',
          title: 'My test file',
        },
      ]
    })}
    />
  );
  const folders = await screen.findAllByTestId('test-file');
  expect(folders.length).toBe(1);
  expect(folders[0].getAttribute('data-id')).toBe('13');
});

test('ThumnbnailView renderPagination() should render pagination when the count of items exceed the items per page limit', async () => {
  render(
    <ThumbnailView {...makeProps({
      totalCount: 40,
      limit: 15
    })}
    />
  );
  const next = await screen.findByText('Next');
  expect(next).not.toBeNull();
});

test('ThumnbnailView renderPagination() should return null when the count of items equals the items per page limit', async () => {
  render(
    <ThumbnailView {...makeProps({
      totalCount: 15,
      limit: 15
    })}
    />
  );
  expect(screen.queryByText('Next')).toBeNull();
});

test('ThumnbnailView renderPagination() should return null when the count of items is less than the items per page limit', async () => {
  render(
    <ThumbnailView {...makeProps({
      totalCount: 5,
      limit: 15
    })}
    />
  );
  expect(screen.queryByText('Next')).toBeNull();
});

test('ThumnbnailView renderItem() hould callback folder for a folder type item', async () => {
  const onOpenFolder = jest.fn();
  const onOpenFile = jest.fn();
  render(
    <ThumbnailView {...makeProps({
      onOpenFolder,
      onOpenFile,
      files: [
        {
          uploading: false,
          type: 'folder',
          category: 'folder',
          title: 'My test folder',
          id: 5,
          key: 5,
        }
      ]
    })}
    />
  );
  const folder = await screen.findByTestId('test-folder');
  fireEvent.click(folder);
  expect(onOpenFolder.mock.calls.length).toBe(1);
  expect(onOpenFile.mock.calls.length).toBe(0);
});

test('ThumnbnailView renderItem() hould callback file for a file type item', async () => {
  const onOpenFolder = jest.fn();
  const onOpenFile = jest.fn();
  render(
    <ThumbnailView {...makeProps({
      onOpenFolder,
      onOpenFile,
      files: [
        {
          uploading: false,
          type: 'image',
          category: 'file',
          title: 'My test file',
          id: 5,
          key: 5,
        }
      ]
    })}
    />
  );
  const folder = await screen.findByTestId('test-file');
  fireEvent.click(folder);
  expect(onOpenFolder.mock.calls.length).toBe(0);
  expect(onOpenFile.mock.calls.length).toBe(1);
});

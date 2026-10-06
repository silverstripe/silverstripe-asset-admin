/* global jest, test, expect */

import React, { useEffect, useRef } from 'react';
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

test('ThumbnailView next button should go to the next page', async () => {
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

test('ThumbnailView previous button should go the previous page', async () => {
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

test('ThumbnailView previous button should not be available from the first page', async () => {
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

const makeNavProps = (obj = {}) => makeProps({
  files: [
    { key: 12, id: 12, type: 'folder', title: 'Folder 12' },
    { key: 16, id: 16, type: 'folder', title: 'Folder 16' },
    { key: 20, id: 20, type: 'folder', title: 'Folder 20' },
  ],
  totalCount: 3,
  limit: 10,
  File: ({ selectableKey, draggableSizeRef, tabIndex, isFocused, onNavigateKeyDown }) => (
    <div
      data-testid="test-file"
      data-id={selectableKey}
      data-focused={String(isFocused)}
      className="gallery-item"
      tabIndex={tabIndex}
      ref={draggableSizeRef}
      style={{ margin: 0 }}
      onKeyDown={onNavigateKeyDown}
    />
  ),
  Folder: ({ selectableKey, droppableSizeRef, tabIndex, isFocused, onNavigateKeyDown }) => (
    <div
      data-testid="test-folder"
      data-id={selectableKey}
      data-focused={String(isFocused)}
      className="gallery-item"
      tabIndex={tabIndex}
      ref={droppableSizeRef}
      style={{ margin: 0 }}
      onKeyDown={onNavigateKeyDown}
    />
  ),
  ...obj
});

const mockOffsetWidth = () => jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
  .mockImplementation(function getOffsetWidth() {
    return this.getAttribute('role') === 'grid' ? 300 : 100;
  });

test('ThumbnailView renders a grid with a description of the page contents', async () => {
  const { container } = render(<ThumbnailView {...makeProps({ totalCount: 40, limit: 15 })} />);
  const grid = screen.getByRole('grid');
  const description = container.querySelector(`[id="${grid.getAttribute('aria-describedby')}"]`);
  expect(description.textContent).toContain('Page 1 of 3');
  expect(description.textContent).toContain('2 folders and 0 files');
});

test('ThumbnailView shows the no items notice only when there are no files and it is not loading', async () => {
  const { container, rerender } = render(<ThumbnailView {...makeProps({ files: [], loading: false })} />);
  expect(container.querySelector('.gallery__no-item-notice')).not.toBeNull();
  rerender(<ThumbnailView {...makeProps({ files: [], loading: true })} />);
  expect(container.querySelector('.gallery__no-item-notice')).toBeNull();
});

test('ThumbnailView renders folders and files in separate groups', async () => {
  const { container } = render(
    <ThumbnailView {...makeNavProps({
      files: [
        { key: 1, id: 1, type: 'folder', title: 'Folder' },
        { key: 2, id: 2, type: 'image', title: 'Image' },
      ],
    })}
    />
  );
  expect(container.querySelectorAll('.gallery__folders [data-testid="test-folder"]').length).toBe(1);
  expect(container.querySelectorAll('.gallery__files [data-testid="test-file"]').length).toBe(1);
});

test('ThumbnailView makes the first item tabbable when nothing has focus', async () => {
  render(<ThumbnailView {...makeNavProps()} />);
  const folders = screen.getAllByTestId('test-folder');
  expect(folders[0].getAttribute('tabindex')).toBe('0');
  expect(folders[1].getAttribute('tabindex')).toBe('-1');
  expect(folders[2].getAttribute('tabindex')).toBe('-1');
});

test('ThumbnailView sets aria row and column counts based on the items per row', async () => {
  const spy = mockOffsetWidth();
  render(
    <ThumbnailView {...makeNavProps({
      files: [
        { key: 1, id: 1, type: 'folder', title: 'Folder 1' },
        { key: 2, id: 2, type: 'folder', title: 'Folder 2' },
        { key: 3, id: 3, type: 'folder', title: 'Folder 3' },
        { key: 4, id: 4, type: 'folder', title: 'Folder 4' },
      ],
    })}
    />
  );
  const grid = screen.getByRole('grid');
  expect(grid.getAttribute('aria-colcount')).toBe('3');
  expect(grid.getAttribute('aria-rowcount')).toBe('2');
  spy.mockRestore();
});

test('ThumbnailView aria row and column counts are unknown without a measurable item size', async () => {
  render(<ThumbnailView {...makeNavProps()} />);
  const grid = screen.getByRole('grid');
  expect(grid.getAttribute('aria-colcount')).toBe('-1');
  expect(grid.getAttribute('aria-rowcount')).toBe('-1');
});

test('ThumbnailView ArrowRight moves focus to the next item', async () => {
  const spy = mockOffsetWidth();
  render(<ThumbnailView {...makeNavProps()} />);
  const folders = screen.getAllByTestId('test-folder');
  fireEvent.keyDown(folders[0], { key: 'ArrowRight' });
  const updated = screen.getAllByTestId('test-folder');
  expect(updated[0].getAttribute('tabindex')).toBe('-1');
  expect(updated[1].getAttribute('tabindex')).toBe('0');
  expect(updated[1].getAttribute('data-focused')).toBe('true');
  spy.mockRestore();
});

test('ThumbnailView ArrowLeft on the first item does not move focus', async () => {
  const spy = mockOffsetWidth();
  render(<ThumbnailView {...makeNavProps()} />);
  const folders = screen.getAllByTestId('test-folder');
  fireEvent.keyDown(folders[0], { key: 'ArrowLeft' });
  expect(screen.getAllByTestId('test-folder')[0].getAttribute('tabindex')).toBe('0');
  spy.mockRestore();
});

test('ThumbnailView ArrowDown from the last folder row moves focus to the files', async () => {
  const spy = mockOffsetWidth();
  render(
    <ThumbnailView {...makeNavProps({
      files: [
        { key: 1, id: 1, type: 'folder', title: 'Folder' },
        { key: 2, id: 2, type: 'image', title: 'Image 2' },
        { key: 3, id: 3, type: 'image', title: 'Image 3' },
      ],
    })}
    />
  );
  fireEvent.keyDown(screen.getByTestId('test-folder'), { key: 'ArrowDown' });
  const files = screen.getAllByTestId('test-file');
  expect(files[0].getAttribute('tabindex')).toBe('0');
  expect(files[1].getAttribute('tabindex')).toBe('-1');
  expect(screen.getByTestId('test-folder').getAttribute('tabindex')).toBe('-1');
  spy.mockRestore();
});

test('ThumbnailView ArrowUp from the first file moves focus to the last folder', async () => {
  const spy = mockOffsetWidth();
  render(
    <ThumbnailView {...makeNavProps({
      files: [
        { key: 1, id: 1, type: 'folder', title: 'Folder' },
        { key: 2, id: 2, type: 'image', title: 'Image 2' },
      ],
    })}
    />
  );
  fireEvent.keyDown(screen.getByTestId('test-file'), { key: 'ArrowUp' });
  expect(screen.getByTestId('test-folder').getAttribute('tabindex')).toBe('0');
  expect(screen.getByTestId('test-file').getAttribute('tabindex')).toBe('-1');
  spy.mockRestore();
});

test('ThumbnailView End moves focus to the last item in the row', async () => {
  const spy = mockOffsetWidth();
  render(<ThumbnailView {...makeNavProps()} />);
  fireEvent.keyDown(screen.getAllByTestId('test-folder')[0], { key: 'End', getModifierState: () => false });
  expect(screen.getAllByTestId('test-folder')[2].getAttribute('tabindex')).toBe('0');
  spy.mockRestore();
});

test('ThumbnailView ignores unhandled keys', async () => {
  const spy = mockOffsetWidth();
  render(<ThumbnailView {...makeNavProps()} />);
  const folders = screen.getAllByTestId('test-folder');
  const notPrevented = fireEvent.keyDown(folders[0], { key: 'a' });
  expect(notPrevented).toBe(true);
  expect(screen.getAllByTestId('test-folder')[0].getAttribute('tabindex')).toBe('0');
  spy.mockRestore();
});

test('ThumbnailView prevents the default action for handled keys', async () => {
  const spy = mockOffsetWidth();
  render(<ThumbnailView {...makeNavProps()} />);
  const notPrevented = fireEvent.keyDown(screen.getAllByTestId('test-folder')[0], { key: 'ArrowRight' });
  expect(notPrevented).toBe(false);
  spy.mockRestore();
});

test('ThumbnailView focuses the grid when the page changes to different files', async () => {
  const { rerender } = render(<ThumbnailView {...makeNavProps()} />);
  rerender(
    <ThumbnailView {...makeNavProps({
      page: 2,
      files: [{ key: 30, id: 30, type: 'folder', title: 'Folder 30' }],
    })}
    />
  );
  expect(document.activeElement).toBe(screen.getByRole('grid'));
});

test('ThumbnailView focuses the new item when an item is added', async () => {
  const { rerender } = render(<ThumbnailView {...makeNavProps()} />);
  rerender(
    <ThumbnailView {...makeNavProps({
      totalCount: 4,
      files: [
        { key: 12, id: 12, type: 'folder', title: 'Folder 12' },
        { key: 16, id: 16, type: 'folder', title: 'Folder 16' },
        { key: 20, id: 20, type: 'folder', title: 'Folder 20' },
        { key: 24, id: 24, type: 'folder', title: 'Folder 24' },
      ],
    })}
    />
  );
  const folders = screen.getAllByTestId('test-folder');
  expect(folders[3].getAttribute('tabindex')).toBe('0');
  expect(folders[3].getAttribute('data-focused')).toBe('true');
  expect(folders[0].getAttribute('tabindex')).toBe('-1');
});

test('ThumbnailView moves focus to a neighbouring item when the focused item is removed', async () => {
  const spy = mockOffsetWidth();
  const { rerender } = render(<ThumbnailView {...makeNavProps()} />);
  fireEvent.keyDown(screen.getAllByTestId('test-folder')[0], { key: 'ArrowRight' });
  rerender(
    <ThumbnailView {...makeNavProps({
      totalCount: 2,
      files: [
        { key: 12, id: 12, type: 'folder', title: 'Folder 12' },
        { key: 20, id: 20, type: 'folder', title: 'Folder 20' },
      ],
    })}
    />
  );
  const folders = screen.getAllByTestId('test-folder');
  expect(folders.length).toBe(2);
  expect(folders[1].getAttribute('data-id')).toBe('20');
  expect(folders[1].getAttribute('tabindex')).toBe('0');
  spy.mockRestore();
});

test('ThumbnailView moves focus to the grid when all items are removed', async () => {
  const spy = mockOffsetWidth();
  const { rerender } = render(<ThumbnailView {...makeNavProps()} />);
  fireEvent.keyDown(screen.getAllByTestId('test-folder')[0], { key: 'ArrowRight' });
  rerender(<ThumbnailView {...makeNavProps({ totalCount: 0, files: [] })} />);
  expect(document.activeElement).toBe(screen.getByRole('grid'));
  spy.mockRestore();
});

test('ThumbnailView focuses the tabbable item when the open file form is closed', async () => {
  const { rerender } = render(<ThumbnailView {...makeNavProps({ openFileId: 16 })} />);
  const folders = screen.getAllByTestId('test-folder');
  expect(folders[1].getAttribute('tabindex')).toBe('0');
  rerender(<ThumbnailView {...makeNavProps({ openFileId: undefined })} />);
  expect(document.activeElement).toBe(screen.getAllByTestId('test-folder')[1]);
});

test('ThumbnailView passes the selection handlers to selectable items', async () => {
  const onSelect = jest.fn();
  const Folder = jest.fn(() => <div data-testid="test-folder" />);
  render(
    <ThumbnailView {...makeNavProps({
      Folder,
      selectableItems: true,
      selectableFolders: true,
      selectedFiles: [],
      onSelect,
      maxFilesSelect: null,
    })}
    />
  );
  const itemProps = Folder.mock.calls[0][0];
  expect(itemProps.selectable).toBe(true);
  expect(itemProps.onSelect).toBe(onSelect);
  expect(itemProps.maxSelected).toBe(false);
});

test('ThumbnailView does not make folders selectable unless selectableFolders is set', async () => {
  const Folder = jest.fn(() => <div data-testid="test-folder" />);
  render(
    <ThumbnailView {...makeNavProps({
      Folder,
      selectableItems: true,
      selectedFiles: [],
    })}
    />
  );
  expect(Folder.mock.calls[0][0].selectable).toBeUndefined();
});

test('ThumbnailView passes upload handlers to items that are still uploading', async () => {
  const onCancelUpload = jest.fn();
  const onRemoveErroredUpload = jest.fn();
  const File = jest.fn(() => <div data-testid="test-file" />);
  render(
    <ThumbnailView {...makeNavProps({
      File,
      onCancelUpload,
      onRemoveErroredUpload,
      files: [{ key: 'q1', queuedId: 'q1', type: 'image', title: 'Uploading' }],
    })}
    />
  );
  const itemProps = File.mock.calls[0][0];
  expect(itemProps.onCancelUpload).toBe(onCancelUpload);
  expect(itemProps.onRemoveErroredUpload).toBe(onRemoveErroredUpload);
  expect(itemProps.onActivate).toBeUndefined();
});

test('ThumbnailView focuses the first folder after keyboard navigation opens another folder from an empty one', async () => {
  const spy = mockOffsetWidth();
  // Focuses itself when isFocused changes, as GalleryItem does
  const Folder = ({ selectableKey, droppableSizeRef, tabIndex, isFocused, onNavigateKeyDown }) => {
    const itemRef = useRef(null);
    useEffect(() => {
      if (isFocused) {
        itemRef.current.focus();
      }
    }, [isFocused]);
    return (
      <div
        data-testid="test-folder"
        data-id={selectableKey}
        tabIndex={tabIndex}
        style={{ margin: 0 }}
        ref={(el) => {
          itemRef.current = el;
          if (droppableSizeRef) {
            droppableSizeRef(el);
          }
        }}
        onKeyDown={onNavigateKeyDown}
      />
    );
  };
  const { rerender } = render(<ThumbnailView {...makeNavProps({ Folder, folderId: 1 })} />);
  fireEvent.keyDown(screen.getAllByTestId('test-folder')[0], { key: 'ArrowRight' });
  const newFiles = [
    { key: 30, id: 30, type: 'folder', title: 'Folder 30' },
    { key: 34, id: 34, type: 'folder', title: 'Folder 34' },
  ];
  // Removing every item leaves no focused item
  rerender(<ThumbnailView {...makeNavProps({ Folder, folderId: 1, totalCount: 0, files: [] })} />);
  // The folder ID changes before the new files arrive
  rerender(<ThumbnailView {...makeNavProps({ Folder, folderId: 2, totalCount: 0, files: [] })} />);
  rerender(<ThumbnailView {...makeNavProps({ Folder, folderId: 2, totalCount: 2, files: newFiles })} />);
  const folders = screen.getAllByTestId('test-folder');
  expect(folders[0].getAttribute('data-id')).toBe('30');
  expect(document.activeElement).toBe(folders[0]);
  spy.mockRestore();
});

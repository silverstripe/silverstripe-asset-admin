/* global jest, expect, test */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Component as GalleryToolbar } from '../GalleryToolbar';

// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('components/FormAlert/FormAlert');
jest.mock('components/AssetDropzone/AssetDropzone');
jest.mock('components/BulkActions/BulkActions');
jest.mock('containers/MoveModal/MoveModal');

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

function makeProps(obj = {}) {
  return {
    folder: {
      id: 1,
      title: 'container folder',
      parentId: null,
      canView: true,
      canEdit: true,
    },
    sort: '',
    onMoveFiles: () => {},
    onCreateFolder: () => {},
    onOpenFolder: () => {},
    onSort: () => {},
    onViewChange: () => {},
    badges: [],
    sectionConfig: {},
    BackButton: () => null,
    UploadButton: () => null,
    AddFolderButton: () => null,
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
    ...obj
  };
}

test('GalleryToolbar handleSelectSort() should purge the upload queue', () => {
  const onSort = jest.fn();
  const { container } = render(
    <GalleryToolbar {...makeProps({
      onSort
    })}
    />
  );
  fireEvent.click(container.querySelector('.dropdown option[value="title,desc"]'));
  expect(onSort).toBeCalledWith('title,desc');
});

test('GalleryToolbar renders main toolbar structure', () => {
  const { container } = render(<GalleryToolbar {...makeProps()} />);
  expect(container.querySelector('.toolbar--content')).not.toBeNull();
  expect(container.querySelector('.gallery__btn-toolbar')).not.toBeNull();
  expect(container.querySelector('.btn-toolbar')).not.toBeNull();
});

test('GalleryToolbar renders with default view as tile', () => {
  const { container } = render(<GalleryToolbar {...makeProps()} />);
  const viewChangeButtons = container.querySelectorAll('.gallery__view-change-button');
  expect(viewChangeButtons.length).toBe(1);
});

test('GalleryToolbar renders sort dropdown only when view is tile', () => {
  const { container: containerTile } = render(
    <GalleryToolbar {...makeProps({ view: 'tile' })} />
  );
  expect(containerTile.querySelector('.gallery__sort')).not.toBeNull();

  const { container: containerTable } = render(
    <GalleryToolbar {...makeProps({ view: 'table' })} />
  );
  expect(containerTable.querySelector('.gallery__sort')).toBeNull();
});

test('GalleryToolbar sort dropdown has correct default value', () => {
  const { container } = render(
    <GalleryToolbar {...makeProps({ sort: 'title,desc', view: 'tile' })} />
  );
  const select = container.querySelector('select.dropdown');
  expect(select.value).toBe('title,desc');
});

test('GalleryToolbar renders all sorters as options', () => {
  const { container } = render(
    <GalleryToolbar {...makeProps({ view: 'tile' })} />
  );
  const options = container.querySelectorAll('select.dropdown option');
  expect(options.length).toBe(4);
  expect(options[0].textContent).toBe('Title A-Z');
  expect(options[1].textContent).toBe('Title Z-A');
  expect(options[2].textContent).toBe('Newest');
  expect(options[3].textContent).toBe('Oldest');
});

test('GalleryToolbar calls onSort when dropdown selection changes', () => {
  const onSort = jest.fn();
  const { container } = render(
    <GalleryToolbar {...makeProps({ onSort, view: 'tile' })} />
  );
  const option = container.querySelector('.dropdown option[value="lastEdited,asc"]');
  fireEvent.click(option);
  expect(onSort).toHaveBeenCalledWith('lastEdited,asc');
});

test('GalleryToolbar renders view change button with correct icon when in tile view', () => {
  const { container } = render(
    <GalleryToolbar {...makeProps({ view: 'tile' })} />
  );
  const viewButton = container.querySelector('#button-view-table');
  expect(viewButton).not.toBeNull();
  expect(viewButton.querySelector('.font-icon-list')).not.toBeNull();
  expect(viewButton.getAttribute('title')).toBe('Change view gallery/list');
});

test('GalleryToolbar renders view change button with correct icon when in table view', () => {
  const { container } = render(
    <GalleryToolbar {...makeProps({ view: 'table' })} />
  );
  const viewButton = container.querySelector('#button-view-tile');
  expect(viewButton).not.toBeNull();
  expect(viewButton.querySelector('.font-icon-thumbnails')).not.toBeNull();
});

test('GalleryToolbar calls onViewChange when view button is clicked', () => {
  const onViewChange = jest.fn();
  const { container } = render(
    <GalleryToolbar {...makeProps({ view: 'tile', onViewChange })} />
  );
  const viewButton = container.querySelector('#button-view-table');
  fireEvent.click(viewButton);
  expect(onViewChange).toHaveBeenCalledWith('table');
});

test('GalleryToolbar does not render active view button', () => {
  const { container } = render(
    <GalleryToolbar {...makeProps({ view: 'table' })} />
  );
  expect(container.querySelector('#button-view-table')).toBeNull();
});

test('GalleryToolbar renders button components with correct props', () => {
  const BackButton = jest.fn(() => <div data-testid="back-button">Back</div>);
  const UploadButton = jest.fn(() => <div data-testid="upload-button">Upload</div>);
  const AddFolderButton = jest.fn(() => <div data-testid="add-folder-button">Add Folder</div>);

  const folder = {
    id: 1,
    title: 'test folder',
    parentId: null,
    canView: true,
    canEdit: true,
  };
  const badges = [{ id: 1, message: 'test', status: 'warning' }];
  const onOpenFolder = jest.fn();
  const onCreateFolder = jest.fn();

  render(
    <GalleryToolbar {...makeProps({
      BackButton,
      UploadButton,
      AddFolderButton,
      folder,
      badges,
      onOpenFolder,
      onCreateFolder,
    })}
    />
  );

  expect(BackButton).toHaveBeenCalledWith(
    expect.objectContaining({
      folder,
      badges,
      onOpenFolder,
    }),
    expect.anything()
  );
  expect(UploadButton).toHaveBeenCalledWith(
    expect.objectContaining({
      canEdit: true,
    }),
    expect.anything()
  );
  expect(AddFolderButton).toHaveBeenCalledWith(
    expect.objectContaining({
      canEdit: true,
      onCreateFolder,
    }),
    expect.anything()
  );
});

test('GalleryToolbar renders children when provided', () => {
  render(
    <GalleryToolbar {...makeProps()}>
      <button data-testid="child-button">Child Button</button>
    </GalleryToolbar>
  );
  expect(screen.getByTestId('child-button')).not.toBeNull();
});

test('GalleryToolbar with canEdit false disables upload and add folder buttons', () => {
  const UploadButton = ({ canEdit }) => <button disabled={!canEdit}>Upload</button>;
  const AddFolderButton = ({ canEdit }) => <button disabled={!canEdit}>Folder</button>;

  const { container } = render(
    <GalleryToolbar {...makeProps({
      UploadButton,
      AddFolderButton,
      folder: { ...makeProps().folder, canEdit: false },
    })}
    />
  );

  const buttons = container.querySelectorAll('button[disabled]');
  expect(buttons.length).toBeGreaterThan(0);
});

test('GalleryToolbar renders with empty badges array', () => {
  const { container } = render(
    <GalleryToolbar {...makeProps({ badges: [] })} />
  );
  expect(container.querySelector('.toolbar--content')).not.toBeNull();
});

test('GalleryToolbar renders view group with proper accessibility', () => {
  const { container } = render(<GalleryToolbar {...makeProps()} />);
  const viewGroup = container.querySelector('div[role="group"]');
  expect(viewGroup).not.toBeNull();
  expect(viewGroup.getAttribute('aria-label')).toBe('View mode');
});

test('GalleryToolbar view buttons have correct button properties', () => {
  const { container } = render(
    <GalleryToolbar {...makeProps({ view: 'tile' })} />
  );
  const viewButton = container.querySelector('.gallery__view-change-button');
  expect(viewButton.type).toBe('button');
  expect(viewButton.classList.contains('btn')).toBe(true);
  expect(viewButton.classList.contains('btn-secondary')).toBe(true);
  expect(viewButton.classList.contains('btn--icon-sm')).toBe(true);
  expect(viewButton.classList.contains('btn--no-text')).toBe(true);
});

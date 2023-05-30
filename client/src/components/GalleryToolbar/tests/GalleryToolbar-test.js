/* global jest, expect, test */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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

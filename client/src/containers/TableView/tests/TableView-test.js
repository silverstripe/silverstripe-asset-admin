/* global jest, expect, test */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as TableView } from '../TableView';

function makeProps(obj = {}) {
  return {
    totalCount: 2,
    limit: 10,
    page: 1,
    handleSetPage: jest.fn(),
    files: [
      {
        id: 11,
        parent: { id: 0 },
        title: 'Folder 01',
        draft: false,
        modified: false,
        lastEdited: null,
        url: null,
        category: null,
        size: null,
        type: 'folder',
        hasRestrictedAccess: false,
        isTrackedFormUpload: false,
      },
      {
        id: 12,
        parent: { id: 0 },
        title: 'File 01',
        draft: true,
        modified: false,
        lastEdited: '2025-02-26 05:43:20',
        url: 'file1.jpg',
        category: 'image',
        size: '100 kb',
        type: 'file',
        hasRestrictedAccess: false,
        isTrackedFormUpload: false,
      },
      {
        id: 12,
        parent: { id: 0 },
        title: 'File 02',
        draft: false,
        modified: true,
        lastEdited: '2025-02-25 04:43:20',
        url: 'file2.jpg',
        category: 'image',
        size: '101 kb',
        type: 'file',
        hasRestrictedAccess: false,
        isTrackedFormUpload: false,
      },
    ],
    onOpenFile: () => null,
    onOpenFolder: () => null,
    onSort: () => null,
    onSetPage: () => null,
    sort: 'title,asc',
    ...obj
  };
}

function getAncestorTag(el, tag) {
  while (el.tagName.toLowerCase() !== tag) {
    el = el.parentNode;
  }
  return el;
}

test('TableView renders file data', async () => {
  render(<TableView {...makeProps()}/>);
  let td = screen.getByText('File 01');
  let tr = getAncestorTag(td, 'tr');
  expect(tr.querySelector('.versioned-badge').innerHTML).toBe('Draft');
  expect(tr.querySelector('.gallery__table-image').getAttribute('style')).toBe('background-image: url(file1.jpg);');
  td = screen.getByText('File 02');
  tr = getAncestorTag(td, 'tr');
  expect(tr.querySelector('.versioned-badge').innerHTML).toBe('Modified');
  expect(tr.querySelector('.gallery__table-image').getAttribute('style')).toBe('background-image: url(file2.jpg);');
});

test('TableView calls onOpenFile() when clicking on a file', async () => {
  let lastId = null;
  const onOpenFile = jest.fn((evt, rowData) => {
    lastId = rowData.id;
  });
  render(<TableView {...makeProps({ onOpenFile })}/>);
  const td = screen.getByText('File 01');
  fireEvent.click(td);
  expect(onOpenFile).toHaveBeenCalled();
  expect(lastId).toBe(12);
});

test('TableView calls onOpenFolder() when clicking on a folder', async () => {
  let lastId = null;
  const onOpenFolder = jest.fn((_, rowData) => {
    lastId = rowData.id;
  });
  render(<TableView {...makeProps({ onOpenFolder })}/>);
  const td = screen.getByText('Folder 01');
  fireEvent.click(td);
  expect(onOpenFolder).toHaveBeenCalled();
  expect(lastId).toBe(11);
});

test('TableView calls onSort() when clicking on a sortable header', async () => {
  let lastSort = null;
  const onSort = jest.fn((sort) => {
    lastSort = sort;
  });
  render(<TableView {...makeProps({ onSort })}/>);
  const td = screen.getByText('Title');
  fireEvent.click(td);
  expect(onSort).toHaveBeenCalled();
  expect(lastSort).toBe('title,desc');
});

test('TableView calls onSetPage() when using pagination', async () => {
  let newPage = null;
  const onSetPage = jest.fn((page) => {
    newPage = page;
  });
  render(<TableView {...makeProps({
    onSetPage,
    // set a limit of 2 to force pagination component to show
    limit: 1,
  })}
  />);
  const button = screen.getByText('Next');
  fireEvent.click(button);
  expect(onSetPage).toHaveBeenCalled();
  expect(newPage).toBe(2);
});

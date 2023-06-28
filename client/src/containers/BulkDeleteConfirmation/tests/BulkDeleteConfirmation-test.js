/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as BulkDeleteConfirmation } from '../BulkDeleteConfirmation';

const FOLDER = 'folder';
const FILE = 'file';

const files = [
  { id: 1, title: 'A folder', type: FOLDER },
  { id: 2, title: 'Another folder', type: FOLDER },
  { id: 3, title: 'image.jpg', type: FILE },
  { id: 4, title: 'document.pdf', type: FILE },
];

function makeProps(obj = {}) {
  return {
    loading: false,
    LoadingComponent: () => <p>Loading...</p>,
    transition: false,
    descendantFileCounts: {},
    onCancel: () => null,
    onModalClose: () => null,
    onConfirm: () => null,
    ...obj
  };
}

test('BulkDeleteConfirmation Nothing in use', async () => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();
  render(
    <BulkDeleteConfirmation {...makeProps({
      files: files.slice(0, 2),
      onConfirm,
      onCancel
    })}
    />
  );
  const modal = await screen.findByRole('dialog');
  expect(modal.style.display).toBe('block');
  // render().container() doesn't render anything, and queryByRole('button') doesn't find anything
  const buttons = screen.getByText('Delete').parentNode.querySelectorAll('button');
  expect(buttons.length).toBe(2);
  expect(buttons[0].textContent).toBe('Delete');
  expect(buttons[1].textContent).toBe('Cancel');
  fireEvent.click(buttons[0]);
  expect(onConfirm.mock.calls.length).toBe(1);
  expect(onCancel.mock.calls.length).toBe(0);
});

test('BulkDeleteConfirmation Folder in use', async () => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();
  render(
    <BulkDeleteConfirmation {...makeProps({
      files,
      fileUsage: { 1: 5 },
      onConfirm,
      onCancel
    })}
    />
  );
  await screen.findByRole('dialog');
  const buttons = screen.getByText('Delete').parentNode.querySelectorAll('button');
  expect(buttons.length).toBe(2);
  expect(buttons[0].textContent).toBe('Cancel');
  expect(buttons[1].textContent).toBe('Delete');
  fireEvent.click(buttons[0]);
  expect(onConfirm.mock.calls.length).toBe(0);
  expect(onCancel.mock.calls.length).toBe(1);
});

test('BulkDeleteConfirmation Files in use', async () => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();
  render(
    <BulkDeleteConfirmation {...makeProps({
      files,
      fileUsage: { 3: 5 },
      onConfirm,
      onCancel
    })}
    />
  );
  await screen.findByRole('dialog');
  const buttons = screen.getByText('Delete').parentNode.querySelectorAll('button');
  expect(buttons.length).toBe(2);
  expect(buttons[0].textContent).toBe('Cancel');
  expect(buttons[1].textContent).toBe('Delete');
  fireEvent.click(buttons[0]);
  expect(onConfirm.mock.calls.length).toBe(0);
  expect(onCancel.mock.calls.length).toBe(1);
});

/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as BulkDeleteConfirmation } from '../BulkDeleteConfirmation';

let resolveBackendGet;
let rejectBackendGet;

jest.mock('lib/Backend', () => ({
  get: () => new Promise((resolve, reject) => {
    resolveBackendGet = resolve;
    rejectBackendGet = reject;
  }),
}));

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';
window.ss.config = {
  SecurityID: 1234567890,
  sections: [
    {
      name: sectionConfigKey,
      endpoints: {
        readDescendantCounts: {
          url: 'test/endpoint/readDescendantCounts',
        }
      }
    },
  ],
};

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

const FOLDER = 'folder';
const FILE = 'file';

const files = [
  { id: 1, title: 'A folder', type: FOLDER },
  { id: 2, title: 'Another folder', type: FOLDER },
  { id: 3, title: 'image.jpg', type: FILE },
  { id: 4, title: 'document.pdf', type: FILE },
];

let onConfirm;
let onCancel;
let lastToastErrorMessage;

beforeEach(() => {
  onConfirm = undefined;
  onCancel = undefined;
  lastToastErrorMessage = undefined;
});

function makeProps(obj = {}) {
  return {
    loading: false,
    LoadingComponent: () => <p>Loading...</p>,
    transition: false,
    descendantFileCounts: {},
    onCancel: () => null,
    onModalClose: () => null,
    onConfirm: () => null,
    filesAreVersioned: false,
    archiveFiles: false,
    actions: {
      toasts: {
        error: (message) => {
          lastToastErrorMessage = message;
        },
      },
    },
    ...obj
  };
}

const setupTest = () => {
  onConfirm = jest.fn();
  onCancel = jest.fn();
  render(
    <BulkDeleteConfirmation {...makeProps({
      files,
      onConfirm,
      onCancel
    })}
    />
  );
};

const expectSuccess = async (buttonZeroText, buttonOneText, onConfirmCalls, onCancelCalls) => {
  const modal = await screen.findByRole('dialog');
  // Wait a tick for the the modal to re-render
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(modal.style.display).toBe('block');
  // render().container() doesn't render anything, and queryByRole('button') doesn't find anything
  const buttons = screen.getByText('Delete').parentNode.querySelectorAll('button');
  expect(buttons.length).toBe(2);
  expect(buttons[0].textContent).toBe(buttonZeroText);
  expect(buttons[1].textContent).toBe(buttonOneText);
  fireEvent.click(buttons[0]);
  expect(onConfirm.mock.calls.length).toBe(onConfirmCalls);
  expect(onCancel.mock.calls.length).toBe(onCancelCalls);
  return Promise.resolve();
};

test('BulkDeleteConfirmation Nothing in use', async () => {
  setupTest();
  resolveBackendGet({
    json: () => [],
  });
  await expectSuccess('Delete', 'Cancel', 1, 0);
});

test('BulkDeleteConfirmation Folder in use', async () => {
  setupTest();
  resolveBackendGet({
    json: () => [
      {
        id: 1,
        type: 'folder',
        count: 10,
      },
    ],
  });
  await expectSuccess('Cancel', 'Delete', 0, 1);
});

test('BulkDeleteConfirmation Files in use', async () => {
  setupTest();
  resolveBackendGet({
    json: () => [
      {
        id: 3,
        type: 'file',
        count: 5,
      },
    ],
  });
  await expectSuccess('Cancel', 'Delete', 0, 1);
});

test('BulkDeleteConfirmation reject known error', async () => {
  setupTest();
  rejectBackendGet(createJsonError('Unable to read descendant counts'));
  await screen.findByRole('dialog');
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('Unable to read descendant counts');
});

test('BulkDeleteConfirmation reject unknown error', async () => {
  setupTest();
  rejectBackendGet();
  await screen.findByRole('dialog');
  // sleep for 0 seconds to get the next tick
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastToastErrorMessage).toBe('An unknown error has occurred.');
});

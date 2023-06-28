/* global jest, test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import BulkDeleteMessage from '../BulkDeleteMessage';

const unlinkFileWarning = 'Ensure files are removed from content areas prior to deleting them, otherwise they will appear as broken links.';

const noFoldersProps = {
  folderCount: 0,
  folderDescendantFileTotals: { totalItems: 0, totalCount: 0 },
};

const oneEmptyFolder = {
  folderCount: 1,
  folderDescendantFileTotals: { totalItems: 0, totalCount: 0 },
};

const manyEmptyFolders = {
  folderCount: 2,
  folderDescendantFileTotals: { totalItems: 0, totalCount: 0 },
};

const oneFolderProps = {
  folderCount: 1,
  folderDescendantFileTotals: { totalItems: 1, totalCount: 5 },
};

const manyfolderProps = {
  folderCount: 2,
  folderDescendantFileTotals: { totalItems: 2, totalCount: 10 },
};

const noFilesProps = {
  fileTotalItems: 0,
};

const oneFileProps = {
  fileTotalItems: 1,
};

const manyFilesProps = {
  fileTotalItems: 2,
};

const getMessage = (count) => [
  `You're about to delete ${count} file(s) which may be used in your site's content.`,
  'Carefully check the file usage on the files before deleting the folder.'
].join(' ');

const emptyFolderMessage = 'Are you sure you want to delete this folder?';

const emptyFoldersMessage = 'Are you sure you want to delete these folders?';

function makeProps(obj = {}) {
  return {
    actions: [
      {
        value: 'foo'
      }
    ],
    ...obj
  };
}

test('BulkDeleteMessage Deleting a file and a folder file in use', () => {
  const { container } = render(
    <BulkDeleteMessage {...makeProps({
      ...noFoldersProps,
      ...oneFileProps
    })}
    />
  );
  const ps = container.querySelectorAll('p');
  expect(ps.length).toBe(2);
  expect(ps[0].textContent).toBe(getMessage('1'));
  expect(ps[1].textContent).toBe(unlinkFileWarning);
});

test('BulkDeleteMessage Deleting a file and a folder folder in use', () => {
  const { container } = render(
    <BulkDeleteMessage {...makeProps({
      ...noFilesProps,
      ...oneFolderProps
    })}
    />
  );
  const ps = container.querySelectorAll('p');
  expect(ps.length).toBe(2);
  expect(ps[0].textContent).toBe(getMessage('5'));
  expect(ps[1].textContent).toBe(unlinkFileWarning);
});

test('BulkDeleteMessage Deleting a file and a folder file and folder in use', () => {
  const { container } = render(
    <BulkDeleteMessage {...makeProps({
      ...oneFileProps,
      ...oneFolderProps
    })}
    />
  );
  expect(container.querySelector('p').textContent).toBe(getMessage('6'));
});

test('BulkDeleteMessage Deleting folders one folder in use', () => {
  const { container } = render(
    <BulkDeleteMessage {...makeProps({
      ...noFilesProps,
      ...oneFolderProps
    })}
    />
  );
  const ps = container.querySelectorAll('p');
  expect(ps.length).toBe(2);
  expect(ps[0].textContent).toBe(getMessage('5'));
  expect(ps[1].textContent).toBe(unlinkFileWarning);
});

test('BulkDeleteMessage Deleting folders multiple folders in use', () => {
  const { container } = render(
    <BulkDeleteMessage {...makeProps({
      ...noFilesProps,
      ...manyfolderProps
    })}
    />
  );
  const ps = container.querySelectorAll('p');
  expect(ps.length).toBe(2);
  expect(ps[0].textContent).toBe(getMessage('10'));
  expect(ps[1].textContent).toBe(unlinkFileWarning);
});

test('BulkDeleteMessage Deleting empty folders one empty folder', () => {
  const { container } = render(
    <BulkDeleteMessage {...makeProps({
      ...noFilesProps,
      ...oneEmptyFolder
    })}
    />
  );
  const ps = container.querySelectorAll('p');
  expect(ps.length).toBe(1);
  expect(ps[0].textContent).toBe(emptyFolderMessage);
});

test('BulkDeleteMessage Deleting empty folders multiple empty folders', () => {
  const { container } = render(
    <BulkDeleteMessage {...makeProps({
      ...noFilesProps,
      ...manyEmptyFolders
    })}
    />
  );
  const ps = container.querySelectorAll('p');
  expect(ps.length).toBe(1);
  expect(ps[0].textContent).toBe(emptyFoldersMessage);
});

test('BulkDeleteMessage Deleting files one file in use', () => {
  const { container } = render(
    <BulkDeleteMessage {...makeProps({
      ...noFoldersProps,
      ...oneFileProps
    })}
    />
  );
  const ps = container.querySelectorAll('p');
  expect(ps.length).toBe(2);
  expect(ps[0].textContent).toBe(getMessage('1'));
  expect(ps[1].textContent).toBe(unlinkFileWarning);
});

test('BulkDeleteMessage Deleting files many files in use', () => {
  const { container } = render(
    <BulkDeleteMessage {...makeProps({
      ...noFoldersProps,
      ...manyFilesProps
    })}
    />
  );
  const ps = container.querySelectorAll('p');
  expect(ps.length).toBe(2);
  expect(ps[0].textContent).toBe(getMessage('2'));
  expect(ps[1].textContent).toBe(unlinkFileWarning);
});

/* global jest, jasmine, describe, it, expect, beforeEach, Event */

import React from 'react';
import Component from '../BulkDeleteMessage';
import ShallowRenderer from 'react-test-renderer/shallow';

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

describe('BulkDeleteMessage', () => {
  const renderer = new ShallowRenderer();

  describe('Deleting a file and a folder', () => {
    const testCases = [
      [
        'file in use',
        { ...noFoldersProps, ...oneFileProps },
        getMessage('1'),
      ],
      [
        'folder in use',
        { ...noFilesProps, ...oneFolderProps },
        getMessage('5'),
      ],
      [
        'file and folder in use',
        { ...oneFileProps, ...oneFolderProps },
        getMessage('6'),
      ],
    ];

    testCases.forEach(([desc, props, expectedMessage]) => {
      it(desc, () => {
        renderer.render(<Component {...props} />);
        const result = renderer.getRenderOutput();
        expect(result.props.children.length).toEqual(2);
        expect(result.props.children[0]).toEqual(
          <p>{expectedMessage}</p>
        );
      });
    });
  });

  describe('Deleting folders', () => {
    const testCases = [
      [
        'one folder in use',
        { ...noFilesProps, ...oneFolderProps },
        getMessage('5'),
      ],
      [
        'multiple folders in use',
        { ...noFilesProps, ...manyfolderProps },
        getMessage('10'),
      ],
    ];

    testCases.forEach(([desc, props, expectedMessage]) => {
      it(desc, () => {
        renderer.render(<Component {...props} />);
        const result = renderer.getRenderOutput();
        expect(result.props.children.length).toEqual(2);
        expect(result.props.children[0]).toEqual(
          <p>{expectedMessage}</p>
        );
      });
    });
  });

  describe('Deleting empty folders', () => {
    const testCases = [
      [
        'one empty folder',
        { ...noFilesProps, ...oneEmptyFolder },
        emptyFolderMessage,
      ],
      [
        'multiple empty folders',
        { ...noFilesProps, ...manyEmptyFolders },
        emptyFoldersMessage,
      ],
    ];

    testCases.forEach(([desc, props, expectedMessage]) => {
      it(desc, () => {
        renderer.render(<Component {...props} />);
        const result = renderer.getRenderOutput();
        expect(result.props.children.length).toEqual(2);
        expect(result.props.children[0]).toEqual(
          <p>{expectedMessage}</p>
        );
      });
    });
  });

  describe('Deleting files', () => {
    const testCases = [
      [
        'one file in use',
        { ...noFoldersProps, ...oneFileProps },
        getMessage('1'),
      ],
      [
        'many files in use',
        { ...noFoldersProps, ...manyFilesProps },
        getMessage('2'),
      ]
    ];

    testCases.forEach(([desc, props, expectedMessage]) => {
      it(desc, () => {
        renderer.render(<Component {...props} />);
        const result = renderer.getRenderOutput();
        expect(result.props.children).toEqual([
          <p>{expectedMessage}</p>,
          <p>{unlinkFileWarning}</p>
        ]);
      });
    });
  });
});

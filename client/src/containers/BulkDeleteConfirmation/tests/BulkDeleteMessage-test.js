/* global jest, jasmine, describe, it, expect, beforeEach, Event */

import React from 'react';
import Component from '../BulkDeleteMessage';
import ShallowRenderer from 'react-test-renderer/shallow';

const unlinkFileWarning = (archiveFiles) => {
  const word = archiveFiles ? 'archiving' : 'deleting';
  return `Ensure files are removed from content areas prior to ${word} them, otherwise they will appear as broken links.`;
};

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

const getMessage = (count, archiveFiles) => {
  const wordOne = archiveFiles ? 'archive' : 'delete';
  const wordTwo = archiveFiles ? 'archiving' : 'deleting';
  return [
  `You're about to ${wordOne} ${count} file(s) which may be used in your site's content.`,
  `Carefully check the file usage on the files before ${wordTwo} the file(s).`
  ].join(' ');
};

const emptyFolderMessage = (archiveFiles) => {
  const word = archiveFiles ? 'archive' : 'delete';
  return `Are you sure you want to ${word} this folder?`;
};

const emptyFoldersMessage = (archiveFiles) => {
  const word = archiveFiles ? 'archive' : 'delete';
  return `Are you sure you want to ${word} these folders?`;
};

[false, true].forEach((archiveFiles) => {
  const word = archiveFiles ? 'archive' : 'delete';
  describe(`BulkDeleteMessage - ${word}`, () => {
    const renderer = new ShallowRenderer();

    describe('Deleting a file and a folder', () => {
      const testCases = [
        [
          'file in use',
          { ...noFoldersProps, ...oneFileProps, archiveFiles },
          getMessage('1', archiveFiles),
        ],
        [
          'folder in use',
          { ...noFilesProps, ...oneFolderProps, archiveFiles },
          getMessage('5', archiveFiles),
        ],
        [
          'file and folder in use',
          { ...oneFileProps, ...oneFolderProps, archiveFiles },
          getMessage('6', archiveFiles),
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
          { ...noFilesProps, ...oneFolderProps, archiveFiles },
          getMessage('5', archiveFiles),
        ],
        [
          'multiple folders in use',
          { ...noFilesProps, ...manyfolderProps, archiveFiles },
          getMessage('10', archiveFiles),
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
          { ...noFilesProps, ...oneEmptyFolder, archiveFiles },
          emptyFolderMessage(archiveFiles),
        ],
        [
          'multiple empty folders',
          { ...noFilesProps, ...manyEmptyFolders, archiveFiles },
          emptyFoldersMessage(archiveFiles),
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
          { ...noFoldersProps, ...oneFileProps, archiveFiles },
          getMessage('1', archiveFiles),
        ],
        [
          'many files in use',
          { ...noFoldersProps, ...manyFilesProps, archiveFiles },
          getMessage('2', archiveFiles),
        ]
      ];

      testCases.forEach(([desc, props, expectedMessage]) => {
        it(desc, () => {
          renderer.render(<Component {...props} />);
          const result = renderer.getRenderOutput();
          expect(result.props.children).toEqual([
            <p>{expectedMessage}</p>,
            <p>{unlinkFileWarning(archiveFiles)}</p>
          ]);
        });
      });
    });
  });
});

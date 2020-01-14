/* global jest, jasmine, describe, it, expect, beforeEach, Event */

import React from 'react';
import Component from '../BulkDeleteMessage';
import ShallowRenderer from 'react-test-renderer/shallow';

const unlinkFileWarning = 'Ensure files are removed from content areas prior to deleting them, otherwise they will appear as broken links.';

const noFoldersInUseProps = {
  foldersInUse: { totalItems: 0, totalUsages: 0 },
};

const oneFolderInUseProps = {
  foldersInUse: { totalItems: 1, totalUsages: 1 },
};

const manyFoldersInUseProps = {
  foldersInUse: { totalItems: 2, totalUsages: 2 },
};

const noFilesInUseProps = {
  filesInUse: { totalItems: 0, totalUsages: 0 },
};

const oneFileInUseProps = {
  filesInUse: { totalItems: 1, totalUsages: 2 },
};

const manyFilesInUseProps = {
  filesInUse: { totalItems: 2, totalUsages: 3 },
};

describe('BulkDeleteMessage', () => {
  const renderer = new ShallowRenderer();

  describe('Deleting a file and a folder', () => {
    const testCases = [
      [
        'file in use',
        { ...noFoldersInUseProps, ...oneFileInUseProps, itemCount: 2 },
        '1 item(s) are currently in use in 2 place(s). Are you sure you want to delete them?',
      ],
      [
        'folder in use',
        { ...noFilesInUseProps, ...oneFolderInUseProps, itemCount: 2 },
        '1 item(s) are currently in use in 1 place(s). Are you sure you want to delete them?',
      ],
      [
        'file and folder in use',
        { ...oneFileInUseProps, ...oneFolderInUseProps, itemCount: 2 },
        '2 item(s) are currently in use in 3 place(s). Are you sure you want to delete them?',
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
        { ...noFilesInUseProps, ...oneFolderInUseProps, itemCount: 1 },
        'This folder contains file(s) that are currently used in 1 place(s). Are you sure you want to delete it?'
      ],
      [
        'multiple folders in use',
        { ...noFilesInUseProps, ...manyFoldersInUseProps, itemCount: 2 },
        '2 of these folders contain file(s) that are currently used in 2 place(s). Are you sure you want to delete them?'
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
        { ...noFoldersInUseProps, ...oneFileInUseProps, itemCount: 1 },
        'This file is currently in use in 2 place(s). Are you sure you want to delete it?',
      ],
      [
        'many files in use',
        { ...noFoldersInUseProps, ...manyFilesInUseProps, itemCount: 2 },
        '2 of these files are currently used in 3 place(s). Are you sure you want to delete them?',
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

  describe('Deleting items not in use', () => {
    const testCases = [
      [
        'one item',
        { ...noFoldersInUseProps, ...noFilesInUseProps, itemCount: 1 },
        'Are you sure you want to delete this file/folder?',
      ],
      [
        'many items',
        { ...noFoldersInUseProps, ...noFilesInUseProps, itemCount: 2 },
        'Are you sure you want to delete these files/folders?',
      ]
    ];


    testCases.forEach(([desc, props, expectedMessage]) => {
      it(desc, () => {
        renderer.render(<Component {...props} />);
        const result = renderer.getRenderOutput();
        expect(result.props.children).toEqual([
          <p>{expectedMessage}</p>,
          false
        ]);
      });
    });
  });
});

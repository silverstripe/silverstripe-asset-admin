/* global jest, jasmine, describe, it, expect, beforeEach, Event */

import React from 'react';
import Component from '../BulkDeleteMessage';
import ShallowRenderer from 'react-test-renderer/shallow';

const unlinkFileWarning = 'Ensure files are removed from content areas prior to deleting them, otherwise they will appear as broken links.';

const folderNotInUseProps = {
  folderInUse: false,
};

const folderInUseProps = {
  folderInUse: true
};

const oneFileNotInUseProps = {
  fileCount: 1,
  fileInUseCount: 0,
  inUseCount: 0
};

const oneFileInUseProps = {
  fileCount: 1,
  fileInUseCount: 1,
  inUseCount: 2
};

const manyFileInUseProps = {
  fileCount: 5,
  fileInUseCount: 3,
  inUseCount: 4
};

const noFileInUse = {
  fileCount: 6,
  fileInUseCount: 0,
  inUseCount: 0
};

describe('BulkDeleteMessage', () => {
  const renderer = new ShallowRenderer();

  describe('Can not delete folders in use', () => {
    const testCases = [
      ['only folder in use', { ...folderInUseProps, ...noFileInUse }],
      ['files in use too', { ...folderInUseProps, ...manyFileInUseProps }]
    ];

    testCases.forEach(([desc, props]) => {
      it(desc, () => {
        renderer.render(<Component {...props} />);
        const result = renderer.getRenderOutput();
        expect(result.props.children).toEqual([
          <p>These folders contain files which are currently in use, you must move
              or delete their contents before you can delete the folder.</p>,
        false
        ]);
      });
    });
  });

  describe('Nothing in use', () => {
    const testCases = [
      ['1 file not in use', { ...folderNotInUseProps, ...oneFileNotInUseProps }],
      ['many files not in use too', { ...folderNotInUseProps, ...noFileInUse }]
    ];

    testCases.forEach(([desc, props]) => {
      it(desc, () => {
        renderer.render(<Component {...props} />);
        const result = renderer.getRenderOutput();
        expect(result.props.children).toEqual([
          <p>Are you sure you want to delete these files?</p>,
          false
        ]);
      });
    });
  });

  describe('Files in use', () => {
    it('Deleting single file in use', () => {
      renderer.render(<Component {...folderNotInUseProps} {...oneFileInUseProps} />);
      const result = renderer.getRenderOutput();
      expect(result.props.children).toEqual([
        <p>This file is currently used in 2 place(s), are you sure you want to delete it?</p>,
        <p>{unlinkFileWarning}</p>
      ]);
    });

    it('Deleting many files in use file in use', () => {
      renderer.render(<Component {...folderNotInUseProps} {...manyFileInUseProps} />);
      const result = renderer.getRenderOutput();
      expect(result.props.children).toEqual([
        <p>There are 3 files currently in use, are you sure you want to delete these files?</p>,
        <p>{unlinkFileWarning}</p>
      ]);
    });
  });
});

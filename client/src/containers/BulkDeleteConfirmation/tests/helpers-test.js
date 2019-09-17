/* global jest, describe, it, pit, expect, beforeEach, jasmine */
import { getFolderInUse, getFileInUseCount } from '../helpers';

const FOLDER = 'folder';
const FILE = 'file';

const files = [
  {id: 1, title: 'A folder', type: FOLDER},
  {id: 2, title: 'Another folder', type: FOLDER},
  {id: 3, title: 'image.jpg', type: FILE},
  {id: 4, title: 'image.jpg', type: FILE},
];


describe('BulkDeleteConfirmation Helper methods', () => {

  describe('getFolderInUse', () => {

    const testCases = [
      ['one folder in use', {'1': 1}, true],
      ['many folders in use', {'1': 1, '2': 2}, true],
      ['nothing in use', {'3': 0, '4': 0, '1': 0, '2': 0}, false],
      ['one file in use', {'4': 1}, false],
      ['many files in use', {'3': 2, '4': 1}, false],
      ['missing file use entries', {}, false],
      ['unknown file IDs', {'123456': 1}, false],
      ['file and folder in use', {'3': 2, '1': 3}, true],
    ];

    testCases.forEach((testCaseData) => {
      const [description, fileUsage, expected] = testCaseData;
      it(description, () => {
        const actual = getFolderInUse(files, fileUsage);
        expect(actual).toBe(expected);
      })

    });

  });

  describe('getFileInUseCount', () => {

    const testCases = [
      ['one folder in use', {'1': 1}, 0, 0],
      ['many folders in use', {'1': 1, '2': 2}, 0, 0],
      ['nothing in use', {'3': 0, '4': 0, '1': 0, '2': 0}, 0, 0],
      ['one file in use', {'4': 1}, 1, 1],
      ['many files in use', {'3': 2, '4': 1}, 2 , 3],
      ['missing file use entries', {}, 0, 0],
      ['unknown file IDs', {'123456': 1}, 0, 0],
      ['file and folder in use', {'3': 2, '1': 3}, 1, 2],
    ];

    testCases.forEach((testCaseData) => {
      const [description, fileUsage, expectedfileInUseCount, expectedInUseCount] = testCaseData;
      it(description, () => {
        const {fileInUseCount, inUseCount} = getFileInUseCount(files, fileUsage);
        expect(fileInUseCount).toBe(expectedfileInUseCount);
        expect(inUseCount).toBe(expectedInUseCount);
      })

    });

  });

});


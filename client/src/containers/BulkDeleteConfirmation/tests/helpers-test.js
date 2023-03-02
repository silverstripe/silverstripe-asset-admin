/* global jest, describe, it, pit, expect, beforeEach */
import { getFolderDescendantFileTotals, getFileTotalItems } from '../helpers';
import { mockfiles as files } from './mockfiles';

describe('BulkDeleteConfirmation Helper methods', () => {
  describe('getFolderInUseCounts', () => {
    const testCases = [
      ['one folder in use', { 1: 1 }, 1, 1],
      ['many folders in use', { 1: 1, 2: 2 }, 2, 3],
      ['nothing in use', { 3: 0, 4: 0, 1: 0, 2: 0 }, 0, 0],
      ['one file in use', { 4: 1 }, 0, 0],
      ['many files in use', { 3: 2, 4: 1 }, 0, 0],
      ['missing file use entries', {}, 0, 0],
      ['unknown file IDs', { 123456: 1 }, 0, 0],
      ['file and folder in use', { 3: 2, 1: 3 }, 1, 3],
    ];

    testCases.forEach((testCaseData) => {
      const [
        description,
        descendantFileCounts,
        expectedTotalItems,
        expectedTotalCount
      ] = testCaseData;

      it(description, () => {
        const { totalItems, totalCount } =
          getFolderDescendantFileTotals(files, descendantFileCounts);
        expect(totalItems).toBe(expectedTotalItems);
        expect(totalCount).toBe(expectedTotalCount);
      });
    });
  });

  describe('getFileTotalItems', () => {
    expect(getFileTotalItems(files)).toBe(2);
  });
});

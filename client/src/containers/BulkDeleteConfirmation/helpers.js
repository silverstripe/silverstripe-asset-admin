import PropTypes from 'prop-types';

/**
 * Check if the provided file entry is a folder
 * @param {Object} file
 * @return {boolean}
 */
const isFolder = (({ type }) => (type === 'folder'));

/**
 * Check if the provided file entry is a file
 * @param {Object} file
 * @return {boolean}
 */
const isFile = (file => (!isFolder(file)));

/**
 * Given a fileCount map, creates a reducer callback that produces an object containing:
 * - totalItems, number of files
 * - totalCount, total count of nests non-folders across files
 * @param {Object} descendentFileCount
 */
const descendantFileCountsReducer = (descendentFileCount) =>
  (accumulator, { id }) => (
    (descendentFileCount[id] > 0) ?
      {
        totalItems: accumulator.totalItems + 1,
        totalCount: accumulator.totalCount + descendentFileCount[id]
      } : accumulator
  );

/**
 * Initial accumulator to use with `fileCountReducer`.
 * @type {{totalItems: number, totalCount: number}}
 */
const descendantFileCountsInitAccumulator = { totalItems: 0, totalCount: 0 };

/**
 * PropType shape for the file count object
 */
export const descendantFileTotalsShape = PropTypes.shape({
  totalItems: PropTypes.number,
  totalCount: PropTypes.number,
});

/**
 * Count the number of folders that are currently in use and the number of places where they are
 * in use.
 * @param {Object[]} files
 * @param {Object} descendantFileCounts
 * @return {Object}
 * @note Not part of the public API
 */
export const getFolderDescendantFileTotals = (files, descendantFileCounts) => (
  files.filter(isFolder)
    .reduce(descendantFileCountsReducer(descendantFileCounts), descendantFileCountsInitAccumulator)
);
/**
 * Count the number of files
 * @param {Object[]} files
 * @return {number}
 * @note Not part of the public API
 */
export const getFileTotalItems = (files) => files.filter(isFile).length;

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
 * Given a fileUsage map, creates a reducer callback that produces an object containing:
 * - totalItems, how many files are in use
 * - totalUsages, a sum of usages across all files
 * @param {Object} fileUsage
 */
const fileUsageReducer = (fileUsage) =>
  (accumulator, { id }) => (
    (fileUsage[id] > 0) ?
      {
        totalItems: accumulator.totalItems + 1,
        totalUsages: accumulator.totalUsages + fileUsage[id]
      } : accumulator
  );

/**
 * Initial accumulator to use with `fileUsageReducer`.
 * @type {{totalItems: number, totalUsages: number}}
 */
const fileUsageInitAccumulator = { totalItems: 0, totalUsages: 0 };

/**
 * PropType shape for the file usage object
 */
export const fileUsageShape = PropTypes.shape({
  totalItems: PropTypes.number,
  totalUsages: PropTypes.number,
});

/**
 * Count the number of folders that are currently in use and the number of places where they are
 * in use.
 * @param {Object[]} files
 * @param {Object} fileUsage
 * @return {Object}
 * @note Not part of the public API
 */
export const getFolderInUseCounts = (files, fileUsage) => (
  files.filter(isFolder).reduce(fileUsageReducer(fileUsage), fileUsageInitAccumulator)
);

/**
 * Count the number of files that are currently in use and the number of places where they are
 * in use.
 * @param {Object[]} files
 * @param {Object} fileUsage
 * @return {Object}
 * @note Not part of the public API
 */
export const getFileInUseCounts = (files, fileUsage) => (
  files.filter(isFile).reduce(fileUsageReducer(fileUsage), fileUsageInitAccumulator)
);

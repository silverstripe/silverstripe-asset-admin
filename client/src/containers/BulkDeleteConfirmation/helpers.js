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
 * Given a fileUsage map, create a suitable reduce callback that count the sums up the usage for
 * a list of files.
 * @param {Object}fileUsage
 */
const fileUsageReducer = (fileUsage) =>
  (accumulator, { id }) => (
    fileUsage[id] ?
      {
        fileInUseCount: accumulator.fileInUseCount + 1,
        inUseCount: accumulator.inUseCount + fileUsage[id]
      } : accumulator
  );

/**
 * Initial accumulator to use with `fileUsageReducer`.
 * @type {{fileInUseCount: number, inUseCount: number}}
 */
const fileUsageInitAccumulator = { fileInUseCount: 0, inUseCount: 0 };

/**
 * Detect if there's any folder in-use in our current selection
 * @param {Object[]} files
 * @param {Object} fileUsageData
 * @return {boolean}
 * @note Not part of the public API
 */
export const getFolderInUse = (files, fileUsage) => {
  const folderUsage = files
    .filter(isFolder)
    .reduce(fileUsageReducer(fileUsage), fileUsageInitAccumulator);
  return folderUsage.fileInUseCount > 0;
};

/**
 * Count the number of files that are currently in use and the number of places where they are
 * in use.
 * @param {Object[]} files
 * @param {Object} fileUsageData
 * @return {Object}
 * @note Not part of the public API
 */
export const getFileInUseCount = (files, fileUsage) => (
  files.filter(isFile).reduce(fileUsageReducer(fileUsage), fileUsageInitAccumulator)
);

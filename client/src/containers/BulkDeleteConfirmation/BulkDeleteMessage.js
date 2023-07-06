import i18n from 'i18n';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { descendantFileTotalsShape } from './helpers';

/**
 * Choose which message to delete confirmation message to display.
 * @param {object} folderDescendantFileTotals
 * @param {object} fileTotalItems
 * @returns {string}
 */
const confirmationMessage = (folderCount, folderDescendantFileTotals, fileTotalItems) => {
  const fileCount = folderDescendantFileTotals.totalCount + fileTotalItems;
  if (fileCount > 0) {
    return i18n.sprintf(
      i18n._t(
        'AssetAdmin.BULK_ACTIONS_DELETE_ITEMS_CONFIRM',
        [
          "You're about to delete %s file(s) which may be used in your site's content.",
          'Carefully check the file usage on the files before deleting the folder.'
        ].join(' ')
      ),
      fileCount
    );
  } else if (folderCount === 1) {
    return i18n._t(
      'AssetAdmin.BULK_ACTIONS_DELETE_FOLDER_CONFIRM',
      'Are you sure you want to delete this folder?'
    );
  }
  return i18n._t(
    'AssetAdmin.BULK_ACTIONS_DELETE_FOLDERS_CONFIRM',
    'Are you sure you want to delete these folders?'
  );
};

/**
 * Display a context dependent confirmation message.
 */
const BulkDeleteMessage = ({ folderCount, folderDescendantFileTotals, fileTotalItems }) => (
  <>
    <p>{confirmationMessage(folderCount, folderDescendantFileTotals, fileTotalItems)}</p>
    {(folderDescendantFileTotals.totalItems > 0 || fileTotalItems > 0) &&
    <p>{i18n._t(
      'AssetAdmin.BULK_ACTIONS_DELETE_WARNING',
      'Ensure files are removed from content areas prior to deleting them, otherwise they will appear as broken links.'
    )}</p>}
  </>
);

BulkDeleteMessage.propTypes = {
  folderCount: PropTypes.number,
  folderDescendantFileTotals: descendantFileTotalsShape,
  fileTotalItems: PropTypes.number,
};

BulkDeleteMessage.defaultProps = {
  folderCount: 0,
  folderDescendantFileTotals: { totalItems: 0, totalCount: 0 },
  fileTotalItems: 0
};

export default BulkDeleteMessage;

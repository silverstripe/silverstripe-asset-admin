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
const confirmationMessage = (
  folderCount,
  folderDescendantFileTotals,
  fileTotalItems,
  archiveFiles
) => {
  const fileCount = folderDescendantFileTotals.totalCount + fileTotalItems;
  if (fileCount > 0) {
    let transKey = 'AssetAdmin.BULK_ACTIONS_DELETE_ITEMS_CONFIRM';
    let transDefault = [
      "You're about to delete %s file(s) which may be used in your site's content.",
      'Carefully check the file usage on the files before deleting the file(s).'
    ].join(' ');
    if (archiveFiles) {
      transKey = 'AssetAdmin.BULK_ACTIONS_ARCHIVE_ITEMS_CONFIRM';
      transDefault = [
        "You're about to archive %s file(s) which may be used in your site's content.",
        'Carefully check the file usage on the files before archiving the file(s).'
      ].join(' ');
    }
    return i18n.sprintf(
      i18n._t(transKey, transDefault),
      fileCount
    );
  } else if (folderCount === 1) {
    let transKey = 'AssetAdmin.BULK_ACTIONS_DELETE_FOLDER_CONFIRM';
    let transDefault = 'Are you sure you want to delete this folder?';
    if (archiveFiles) {
      transKey = 'AssetAdmin.BULK_ACTIONS_ARCHIVE_FOLDER_CONFIRM';
      transDefault = 'Are you sure you want to archive this folder?';
    }
    return i18n._t(transKey, transDefault);
  }
  let transKey = 'AssetAdmin.BULK_ACTIONS_DELETE_FOLDERS_CONFIRM';
  let transDefault = 'Are you sure you want to delete these folders?';
  if (archiveFiles) {
    transKey = 'AssetAdmin.BULK_ACTIONS_ARCHIVE_FOLDERS_CONFIRM';
    transDefault = 'Are you sure you want to archive these folders?';
  }
  return i18n._t(transKey, transDefault);
};

/**
 * Display a context dependent confirmation message.
 */
const BulkDeleteMessage = ({
  folderCount,
  folderDescendantFileTotals,
  fileTotalItems,
  archiveFiles
}) => {
  let transKey = 'AssetAdmin.BULK_ACTIONS_DELETE_WARNING';
  let transDefault = 'Ensure files are removed from content areas prior to deleting them, otherwise they will '
    + 'appear as broken links.';
  if (archiveFiles) {
    transKey = 'AssetAdmin.BULK_ACTIONS_ARCHIVE_WARNING';
    transDefault = 'Ensure files are removed from content areas prior to archiving them, otherwise they will '
      + 'appear as broken links.';
  }
  const message = confirmationMessage(
    folderCount,
    folderDescendantFileTotals,
    fileTotalItems,
    archiveFiles
  );
  return (
    <Fragment>
      <p>{message}</p>
      {(folderDescendantFileTotals.totalItems > 0 || fileTotalItems > 0) &&
      <p>{i18n._t(transKey, transDefault)}</p>}
    </Fragment>
  );
};

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

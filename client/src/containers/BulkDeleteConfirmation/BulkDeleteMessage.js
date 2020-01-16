import i18n from 'i18n';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { fileUsageShape } from './helpers';

/**
 * Choose which message to delete confirmation message to display.
 * @param {object} foldersInUse
 * @param {object} filesInUse
 * @param {number} itemCount The total number of files/folders that will be deleted
 * @returns {string}
 */
const confirmationMessage = (foldersInUse, filesInUse, itemCount) => {
  // CASE: Mix of files and folders selected, some or all of which are in use
  if (
    (filesInUse.totalItems && foldersInUse.totalItems) ||
    (filesInUse.totalItems && filesInUse.totalItems !== itemCount) ||
    (foldersInUse.totalItems && foldersInUse.totalItems !== itemCount)
  ) {
    return i18n.sprintf(
      i18n._t(
        'AssetAdmin.BULK_ACTIONS_DELETE_MULTIPLE_ITEMS_IN_USE_CONFIRM',
        '%s item(s) are currently in use in %s place(s). Are you sure you want to delete them?'
      ),
      filesInUse.totalItems + foldersInUse.totalItems,
      filesInUse.totalUsages + foldersInUse.totalUsages,
    );
  }

  // CASE: One or more files are in use
  if (filesInUse.totalItems) {
    if (filesInUse.totalItems === 1 && itemCount === 1) {
      return i18n.sprintf(
        i18n._t(
          'AssetAdmin.BULK_ACTIONS_DELETE_SINGLE_FILE_IN_USE_CONFIRM',
          'This file is currently in use in %s place(s). Are you sure you want to delete it?'
        ),
        filesInUse.totalUsages
      );
    }

    return i18n.sprintf(
      i18n._t(
        'AssetAdmin.BULK_ACTIONS_DELETE_MULTIPLE_FILES_IN_USE_CONFIRM',
        '%s of these files are currently used in %s place(s). Are you sure you want to delete them?'
      ),
      filesInUse.totalItems,
      filesInUse.totalUsages,
    );
  }

  // CASE: One or more folders are in use
  if (foldersInUse.totalItems) {
    if (foldersInUse.totalItems === 1 && itemCount === 1) {
      return i18n.sprintf(
        i18n._t(
          'AssetAdmin.BULK_ACTIONS_DELETE_SINGLE_FOLDER_IN_USE_CONFIRM',
          'This folder contains file(s) that are currently used in %s place(s). Are you sure you want to delete it?'
        ),
        foldersInUse.totalUsages
      );
    }

    return i18n.sprintf(
      i18n._t(
        'AssetAdmin.BULK_ACTIONS_DELETE_MULTIPLE_FOLDERS_IN_USE_CONFIRM',
        '%s of these folders contain file(s) that are currently used in %s place(s). Are you sure you want to delete them?'
      ),
      foldersInUse.totalItems,
      foldersInUse.totalUsages
    );
  }

  // CASE: One file or folder is being deleted, but isn't in use
  if (itemCount === 1) {
    return i18n._t(
      'AssetAdmin.BULK_ACTIONS_DELETE_SINGLE_ITEM_CONFIRM',
      'Are you sure you want to delete this file/folder?'
    );
  }

  // CASE: Multiple files / folders are being deleted, but aren't in use
  return i18n._t(
    'AssetAdmin.BULK_ACTIONS_DELETE_MULTIPLE_ITEMS_CONFIRM',
    'Are you sure you want to delete these files/folders?'
  );
};

/**
 * Display a context dependent confirmation message.
 */
const BulkDeleteMessage = ({ foldersInUse, filesInUse, itemCount }) => (
  <Fragment>
    <p>{confirmationMessage(foldersInUse, filesInUse, itemCount)}</p>
    {(foldersInUse.totalItems > 0 || filesInUse.totalItems > 0) && <p>{i18n._t(
      'AssetAdmin.BULK_ACTIONS_DELETE_WARNING',
      'Ensure files are removed from content areas prior to deleting them, otherwise they will appear as broken links.'
    )}</p>}
  </Fragment>
);

BulkDeleteMessage.propTypes = {
  foldersInUse: fileUsageShape,
  filesInUse: fileUsageShape,
  itemCount: PropTypes.number,
};

BulkDeleteMessage.defaultProps = {
  foldersInUse: { totalItems: 0, totalUsages: 0 },
  filesInUse: { totalItems: 0, totalUsages: 0 },
  itemCount: 0,
};

export default BulkDeleteMessage;

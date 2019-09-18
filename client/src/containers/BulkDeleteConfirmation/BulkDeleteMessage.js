import i18n from 'i18n';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/**
 * Choose which message to delete confirmation message to display.
 * @param {boolean} folderInUse
 * @param {number} fileCount
 * @param {number} fileInUseCount
 * @param {number} inUseCount
 * @returns {string}
 */
const confirmationMessage = (folderInUse, fileCount, fileInUseCount, inUseCount) => {
  if (folderInUse) {
    return i18n._t(
      'AssetAdmin.BULK_ACTIONS_DELETE_FOLDER',
      'These folders contain files which are currently in use, you must move or delete their contents before ' +
      'you can delete the folder.'
    );
  }

  if (fileInUseCount === 0) {
    return i18n._t('AssetAdmin.BULK_ACTIONS_DELETE_CONFIRM', 'Are you sure you want to delete these files?');
  }

  if (fileCount === 1 && fileInUseCount === 1) {
    return i18n.sprintf(
      i18n._t(
        'AssetAdmin.BULK_ACTIONS_DELETE_SINGLE_CONFIRM',
        'This file is currently used in %s place(s), are you sure you want to delete it?'
      ),
      inUseCount
    );
  }

  return i18n.sprintf(
    i18n._t(
      'AssetAdmin.BULK_ACTIONS_DELETE_MULTI_CONFIRM',
      'There are %s files currently in use, are you sure you want to delete these files?'
    ),
    fileInUseCount
  );
};

/**
 * Display a context dependent confirmation message.
 */
const BulkDeleteMessage = ({ folderInUse, fileCount, fileInUseCount, inUseCount }) => (
  <Fragment>
    <p>{confirmationMessage(folderInUse, fileCount, fileInUseCount, inUseCount)}</p>
    {!folderInUse && fileInUseCount > 0 && <p>{i18n._t(
      'AssetAdmin.BULK_ACTIONS_DELETE_WARNING',
      'Ensure files are removed from content areas prior to deleting them, otherwise they will appear as broken links.'
    )}</p>}
  </Fragment>
);

BulkDeleteMessage.propTypes = {
  folderInUse: PropTypes.bool,
  fileCount: PropTypes.number,
  fileInUseCount: PropTypes.number,
  inUseCount: PropTypes.number
};

BulkDeleteMessage.defaultProps = {
  folderInUse: false,
  fileCount: 0,
  fileInUseCount: 0,
  inUseCount: 0
};

export default BulkDeleteMessage;

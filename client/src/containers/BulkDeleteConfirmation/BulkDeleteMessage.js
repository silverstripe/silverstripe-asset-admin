import i18n from 'i18n';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Choose which message to delete confirmation message to display.
 */
const confirmationMessage = (
  topLevelFolderCount,
  topLevelFileCount,
  descendantFileCount,
  filesAreVersioned,
  archiveFiles,
) => {
  const fileCount = topLevelFileCount + descendantFileCount;
  if (fileCount > 0) {
    let transKey = 'AssetAdmin.BULK_ACTIONS_DELETE_ITEMS_CONFIRM';
    let transDefault = [
      "You're about to delete %s file(s) which may be used in your site's content.",
      'Carefully check the file usage on the files before deleting the file(s).'
    ].join(' ');
    if (filesAreVersioned && archiveFiles) {
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
  } else if (topLevelFolderCount === 1) {
    let transKey = 'AssetAdmin.BULK_ACTIONS_DELETE_FOLDER_CONFIRM';
    let transDefault = 'Are you sure you want to delete this folder?';
    if (filesAreVersioned && archiveFiles) {
      transKey = 'AssetAdmin.BULK_ACTIONS_ARCHIVE_FOLDER_CONFIRM';
      transDefault = 'Are you sure you want to archive this folder?';
    }
    return i18n._t(transKey, transDefault);
  }
  let transKey = 'AssetAdmin.BULK_ACTIONS_DELETE_FOLDERS_CONFIRM';
  let transDefault = 'Are you sure you want to delete these folders?';
  if (filesAreVersioned && archiveFiles) {
    transKey = 'AssetAdmin.BULK_ACTIONS_ARCHIVE_FOLDERS_CONFIRM';
    transDefault = 'Are you sure you want to archive these folders?';
  }
  return i18n._t(transKey, transDefault);
};

/**
 * Display a context dependent confirmation message.
 */
const BulkDeleteMessage = ({
  topLevelFolderCount,
  topLevelFileCount,
  descendantFileCount,
  filesAreVersioned,
  archiveFiles,
}) => {
  let transKey = 'AssetAdmin.BULK_ACTIONS_DELETE_WARNING';
  let transDefault = 'Ensure files are removed from content areas prior to deleting them, otherwise they will '
    + 'appear as broken links.';
  if (filesAreVersioned && archiveFiles) {
    transKey = 'AssetAdmin.BULK_ACTIONS_ARCHIVE_WARNING';
    transDefault = 'Ensure files are removed from content areas prior to archiving them, otherwise they will '
      + 'appear as broken links.';
  }
  const message = confirmationMessage(
    topLevelFolderCount,
    topLevelFileCount,
    descendantFileCount,
    filesAreVersioned,
    archiveFiles,
  );
  return (
    <>
      <p>{message}</p>
      {(topLevelFileCount + descendantFileCount > 0) &&
      <p>{i18n._t(transKey, transDefault)}</p>}
    </>
  );
};

BulkDeleteMessage.propTypes = {
  topLevelFolderCount: PropTypes.number,
  topLevelFileCount: PropTypes.number,
  descendantFileCount: PropTypes.number,
};

BulkDeleteMessage.defaultProps = {
  topLevelFolderCount: 0,
  topLevelFileCount: 0,
  descendantFileCount: 0,
};

export default BulkDeleteMessage;

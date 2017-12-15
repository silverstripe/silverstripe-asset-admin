import React, { PropTypes } from 'react';
import i18n from 'i18n';

function onClick(onCreateFolder) {
  /**
   * Handler for when the user changes clicks the add folder button
   *
   * @param {Event} event
   */
  return function handleCreateFolder(event) {
    if (typeof onCreateFolder === 'function') {
      onCreateFolder();
    }
    event.preventDefault();
  };
}

/**
 * Gallery Toolbar add folder button.
 *
 * @returns {XML} button
 */
function AddFolderButton({ canEdit, onCreateFolder }) {
  return (
    <button
      id="add-folder-button"
      className="btn btn-secondary font-icon-folder-add btn--icon-xl"
      type="button"
      onClick={onClick(onCreateFolder)}
      disabled={!canEdit}
    >
      <span className="btn__text btn__title">{i18n._t('AssetAdmin.ADD_FOLDER_BUTTON')}</span>
    </button>
  );
}

AddFolderButton.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  onCreateFolder: PropTypes.func.isRequired,
};

export default AddFolderButton;

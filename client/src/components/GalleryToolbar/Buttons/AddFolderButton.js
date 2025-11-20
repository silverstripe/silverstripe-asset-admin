import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';

/**
 * Gallery Toolbar add folder button.
 *
 * @returns {XML} button
 */
const AddFolderButton = ({
  canEdit,
  onCreateFolder,
}) => {
  const handleCreateFolder = (event) => {
    event.preventDefault();
    if (typeof onCreateFolder === 'function') {
      onCreateFolder();
    }
  };

  return (
    <button
      id="add-folder-button"
      className="btn btn-secondary btn--icon-xl"
      type="button"
      onClick={handleCreateFolder}
      disabled={!canEdit}
    >
      <span className="font-icon-folder-add btn__icon" aria-hidden="true" />
      <span className="btn__text btn__title">{i18n._t('AssetAdmin.ADD_NEW_FOLDER_BUTTON')}</span>
    </button>
  );
};

AddFolderButton.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  onCreateFolder: PropTypes.func.isRequired,
};

export default AddFolderButton;

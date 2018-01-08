import React, { Component, PropTypes } from 'react';
import i18n from 'i18n';

/**
 * Gallery Toolbar add folder button.
 *
 * @returns {XML} button
 */
class AddFolderButton extends Component {
  constructor() {
    super();
    this.handleCreateFolder = this.handleCreateFolder.bind(this);
  }
  handleCreateFolder(event) {
    const { onCreateFolder } = this.props;
    event.preventDefault();
    if (typeof onCreateFolder === 'function') {
      onCreateFolder();
    }
  }
  render() {
    const { canEdit } = this.props;
    return (
      <button
        id="add-folder-button"
        className="btn btn-secondary font-icon-folder-add btn--icon-xl"
        type="button"
        onClick={this.handleCreateFolder}
        disabled={!canEdit}
      >
        <span className="btn__text btn__title">{i18n._t('AssetAdmin.ADD_FOLDER_BUTTON')}</span>
      </button>
    );
  }
}

AddFolderButton.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  onCreateFolder: PropTypes.func.isRequired,
};

export default AddFolderButton;

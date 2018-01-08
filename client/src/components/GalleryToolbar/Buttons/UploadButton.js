/* eslint-disable react/prefer-stateless-function */
import React, { Component, PropTypes } from 'react';
import i18n from 'i18n';

/**
 * Gallery Toolbar upload button.
 *
 * @returns {XML} button
 */
class UploadButton extends Component {
  render() {
    const { canEdit } = this.props;
    return (
      <button
        id="upload-button"
        className="btn btn-secondary font-icon-upload btn--icon-xl"
        type="button"
        disabled={!canEdit}
      >
        <span className="btn__text btn__title">{i18n._t('AssetAdmin.DROPZONE_UPLOAD')}</span>
      </button>
    );
  }
}

UploadButton.defaultProps = {
  canEdit: PropTypes.func.isRequired,
};

export default UploadButton;

import React from 'react';
import i18n from 'i18n';
import PropTypes from 'prop-types';

/**
 * Gallery Toolbar upload button.
 *
 * @returns {XML} button
 */
const UploadButton = ({
  canEdit,
}) => (
  <button
    id="upload-button"
    className="btn btn-secondary btn--icon-xl"
    type="button"
    disabled={!canEdit}
  >
    <span className="font-icon-upload btn__icon" aria-hidden="true" />
    <span className="btn__text btn__title">{i18n._t('AssetAdmin.DROPZONE_UPLOAD')}</span>
  </button>
);

UploadButton.propTypes = {
  canEdit: PropTypes.bool.isRequired,
};

export default UploadButton;

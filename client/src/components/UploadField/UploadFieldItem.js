/* eslint-disable no-use-before-define */
import i18n from 'i18n';
import React from 'react';
import CONSTANTS from 'constants';
import fileShape from 'lib/fileShape';
import { fileSize } from 'lib/DataFormat';
import PropTypes from 'prop-types';
import FileStatusIcon from 'components/FileStatusIcon/FileStatusIcon';

const UploadFieldItem = (props) => {
  /**
   * Gets props for thumbnail
   *
   * @returns {Object}
   */
  const getThumbnailStyles = () => {
    if (isImage() && (exists() || uploading())) {
      const thumbnail = props.item.smallThumbnail || props.item.url || '';
      return {
        backgroundImage: `url(${thumbnail})`,
      };
    }

    return {};
  };

  /**
   * Retrieve list of thumbnail classes
   *
   * @returns {string}
   */
  const getThumbnailClassNames = () => {
    const thumbnailClassNames = ['uploadfield-item__thumbnail'];

    if (isImageSmallerThanThumbnail()) {
      thumbnailClassNames.push('uploadfield-item__thumbnail--small');
    }

    return thumbnailClassNames.join(' ');
  };

  /**
   * Retrieves class names for the item
   *
   * @returns {string}
   */
  const getItemClassNames = () => {
    const category = props.item.category || 'none';
    const itemClassNames = [
      'fill-width',
      'uploadfield-item',
      `uploadfield-item--${category}`,
    ];

    if (missing()) {
      itemClassNames.push('uploadfield-item--missing');
    }

    if (hasError()) {
      itemClassNames.push('uploadfield-item--error');
    }

    return itemClassNames.join(' ');
  };

  /**
   * Checks if the component has an error set.
   *
   * @return {boolean}
   */
  const hasError = () => {
    if (props.item.message) {
      return props.item.message.type === 'error';
    }

    return false;
  };

  /**
   * Determine if this is an image type
   *
   * @returns {Boolean}
   */
  const isImage = () => props.item.category === 'image';

  /**
   * Validate that the file backing this record is not missing
   *
   * @returns {Boolean}
   */
  const exists = () => props.item.exists;

  /**
   * Check if this item is in the process uploaded.
   * If false this file was attached to this editor instead.
   *
   * @returns {boolean}
   */
  const uploading = () => props.item.queuedId && !saved();

  /**
   * Check if this item has been successfully uploaded.
   * Excludes items not uploaded in this request.
   *
   * @returns {Boolean}
   */
  // Uploading is complete if saved with a DB id
  const complete = () => props.item.queuedId && saved();

  /**
   * Check if this item has been saved, either in this request or in a prior one
   *
   * @return {Boolean}
   */
  const saved = () => props.item.id > 0;

  /**
   * Check if this item should have a file, but is missing.
   *
   * @return {Boolean}
   */
  const missing = () => !exists() && saved();

  /**
   * Determine that this record is an image, and the thumbnail is smaller than the given
   * thumbnail area
   *
   * @returns {boolean}
   */
  const isImageSmallerThanThumbnail = () => {
    if (!isImage() || missing()) {
      return false;
    }
    const width = props.item.width;
    const height = props.item.height;

    // Note: dimensions will be null if the back-end image is lost
    return (
      height
      && width
      && height < CONSTANTS.SMALL_THUMBNAIL_HEIGHT
      && width < CONSTANTS.SMALL_THUMBNAIL_WIDTH
    );
  };

  /**
   * Handles remove (x) button click
   *
   * @param {Object} event
   */
  const handleRemove = (event) => {
    event.preventDefault();
    if (props.onRemove) {
      props.onRemove(event, props.item);
    }
  };

  /**
   * Handles edit button click
   *
   * @param {Object} event
   */
  const handleView = (event) => {
    event.preventDefault();
    if (props.onView) {
      props.onView(event, props.item);
    }
  };

  /**
   * Handles click of an item
   *
   * @param {Object} event
   */
  const handleItemClick = (event) => {
    event.preventDefault();
    if (props.onItemClick) {
      props.onItemClick(event, props.item);
    }
  };

  const renderStatus = () => {
    if (props.item.draft) {
      return (
        <span className="uploadfield-item__status">{i18n._t('File.DRAFT', 'Draft')}</span>
      );
    } else if (props.item.modified) {
      return (
        <span className="uploadfield-item__status">{i18n._t('File.MODIFIED', 'Modified')}</span>
      );
    }
    return null;
  };

  /**
   * Returns markup for an error message if one is set.
   *
   * @returns {Object}
   */
  const renderErrorMessage = () => {
    let message = null;

    if (hasError()) {
      message = props.item.message.value;
    } else if (missing()) {
      message = i18n._t('AssetAdmin.FILE_MISSING', 'File cannot be found');
    }

    if (message !== null) {
      return (
        <div className="uploadfield-item__error-message" title={message}>
          {message}
        </div>
      );
    }

    return null;
  };

  /**
   * Gets upload progress bar
   *
   * @returns {object}
   */
  const renderProgressBar = () => {
    const progressBarProps = {
      className: 'uploadfield-item__progress-bar',
      style: {
        width: `${props.item.progress}%`,
      },
    };

    if (!hasError() && props.item.queuedId) {
      if (complete()) {
        const successText = i18n._t('AssetAdmin.DROPZONE_SUCCESS_UPLOAD', 'File uploaded');
        return (
          <div className="uploadfield-item__complete" aria-label={successText} title={successText}>
            <span className="uploadfield-item__complete-icon font-icon-check-mark-circle" aria-hidden="true" />
          </div>
        );
      }
      return (
        <div className="uploadfield-item__upload-progress">
          <div {...progressBarProps} />
        </div>
      );
    }

    return null;
  };

  /**
   * Gets the remove item button
   *
   * @returns {object}
   */
  const renderRemoveButton = () => {
    if (!props.canEdit) {
      return null;
    }
    const classes = [
      'btn',
      'uploadfield-item__remove-btn',
      'btn-secondary',
      'btn--no-text',
      'btn--icon-md',
    ].join(' ');
    return (
      <button
        className={classes}
        onClick={handleRemove}
        aria-label={i18n._t('File.REMOVE', 'Remove')}
        title={i18n._t('File.REMOVE', 'Remove')}
      >
        <span className="font-icon-cancel" aria-hidden="true" />
      </button>
    );
  };

  /**
   * Gets the edit item button
   *
   * @returns {object}
   */
  const renderViewButton = () => {
    if (!props.canEdit || !props.item.id) {
      return null;
    }
    const classes = [
      'btn',
      'uploadfield-item__view-btn',
      'btn-secondary',
      'btn--no-text',
      'btn--icon-md',
    ].join(' ');
    return (
      <button
        className={classes}
        onClick={handleView}
        aria-label={i18n._t('File.VIEW', 'View')}
        title={i18n._t('File.VIEW', 'View')}
      >
        <span className="font-icon-eye" aria-hidden="true" />
      </button>
    );
  };

  /**
   * @param {Object} item
   * @returns {*}
   */
  const renderRestrictedAccess = (item) => {
    const { id, hasRestrictedAccess } = item;
    const attrs = {
      fileID: id,
      placement: 'top',
      hasRestrictedAccess
    };
    return <FileStatusIcon {...attrs} />;
  };

  /**
   * @param {Object} item
   * @returns {*}
   */
  const renderTrackedFormUpload = (item) => {
    const { id, isTrackedFormUpload, hasRestrictedAccess } = item;
    const attrs = {
      fileID: id,
      placement: 'top',
      isTrackedFormUpload,
      hasRestrictedAccess
    };
    return <FileStatusIcon {...attrs} />;
  };

  /**
   * Get file title / metadata block
   *
   * @returns {object}
   */
  const renderFileDetails = () => {
    const item = props.item;
    let size = '';
    if (item.size) {
      size = `, ${fileSize(item.size)}`;
    }
    return (
      <div className="uploadfield-item__details fill-height flexbox-area-grow">
        <div className="fill-width">
          <span className="uploadfield-item__title flexbox-area-grow">
            {item.title}
          </span>
        </div>
        <div className="fill-width uploadfield-item__meta">
          <span className="uploadfield-item__specs">
            {item.extension}{size}
          </span>
          {renderStatus()}
          {item.hasRestrictedAccess && renderRestrictedAccess(item)}
          {item.isTrackedFormUpload && renderTrackedFormUpload(item)}
        </div>
      </div>
    );
  };

  const renderThumbnail = () => (
    <div
      className={getThumbnailClassNames()}
      style={getThumbnailStyles()}
      onClick={handleItemClick}
      role="button"
      tabIndex={props.onItemClick ? 0 : -1}
    />
  );

  const fieldName = `${props.name}[Files][]`;
  return (
    <div className={getItemClassNames()}>
      <input type="hidden" value={props.item.id} name={fieldName} />
      {renderThumbnail()}
      {renderFileDetails()}
      {renderProgressBar()}
      {renderErrorMessage()}
      {renderViewButton()}
      {renderRemoveButton()}
    </div>
  );
};

UploadFieldItem.propTypes = {
  canEdit: PropTypes.bool,
  name: PropTypes.string.isRequired,
  item: fileShape,
  onRemove: PropTypes.func,
  onItemClick: PropTypes.func,
  onView: PropTypes.func,
};

export default UploadFieldItem;

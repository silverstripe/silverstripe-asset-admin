import i18n from 'i18n';
import React, { Component } from 'react';
import CONSTANTS from 'constants';
import fileShape from 'lib/fileShape';
import { fileSize } from 'lib/DataFormat';
import PropTypes from 'prop-types';
import FileStatusIcon from 'components/FileStatusIcon/FileStatusIcon';

class UploadFieldItem extends Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleView = this.handleView.bind(this);
  }

  /**
   * Gets props for thumbnail
   *
   * @returns {Object}
   */
  getThumbnailStyles() {
    if (this.isImage() && (this.exists() || this.uploading())) {
      const thumbnail = this.props.item.smallThumbnail || this.props.item.url || '';
      return {
        backgroundImage: `url(${thumbnail})`,
      };
    }

    return {};
  }

  /**
   * Retrieve list of thumbnail classes
   *
   * @returns {string}
   */
  getThumbnailClassNames() {
    const thumbnailClassNames = ['uploadfield-item__thumbnail'];

    if (this.isImageSmallerThanThumbnail()) {
      thumbnailClassNames.push('uploadfield-item__thumbnail--small');
    }

    return thumbnailClassNames.join(' ');
  }

  /**
   * Retrieves class names for the item
   *
   * @returns {string}
   */
  getItemClassNames() {
    const category = this.props.item.category || 'none';
    const itemClassNames = [
      'fill-width',
      'uploadfield-item',
      `uploadfield-item--${category}`,
    ];

    if (this.missing()) {
      itemClassNames.push('uploadfield-item--missing');
    }

    if (this.hasError()) {
      itemClassNames.push('uploadfield-item--error');
    }

    return itemClassNames.join(' ');
  }

  /**
   * Checks if the component has an error set.
   *
   * @return {boolean}
   */
  hasError() {
    if (this.props.item.message) {
      return this.props.item.message.type === 'error';
    }

    return false;
  }

  /**
   * Determine if this is an image type
   *
   * @returns {Boolean}
   */
  isImage() {
    return this.props.item.category === 'image';
  }

  /**
   * Validate that the file backing this record is not missing
   *
   * @returns {Boolean}
   */
  exists() {
    return this.props.item.exists;
  }

  /**
   * Check if this item is in the process uploaded.
   * If false this file was attached to this editor instead.
   *
   * @returns {boolean}
   */
  uploading() {
    return this.props.item.queuedId && !this.saved();
  }

  /**
   * Check if this item has been successfully uploaded.
   * Excludes items not uploaded in this request.
   *
   * @returns {Boolean}
   */
  complete() {
    // Uploading is complete if saved with a DB id
    return this.props.item.queuedId && this.saved();
  }

  /**
   * Check if this item has been saved, either in this request or in a prior one
   *
   * @return {Boolean}
   */
  saved() {
    return this.props.item.id > 0;
  }

  /**
   * Check if this item should have a file, but is missing.
   *
   * @return {Boolean}
   */
  missing() {
    return !this.exists() && this.saved();
  }

  /**
   * Determine that this record is an image, and the thumbnail is smaller than the given
   * thumbnail area
   *
   * @returns {boolean}
   */
  isImageSmallerThanThumbnail() {
    if (!this.isImage() || this.missing()) {
      return false;
    }
    const width = this.props.item.width;
    const height = this.props.item.height;

    // Note: dimensions will be null if the back-end image is lost
    return (
      height
      && width
      && height < CONSTANTS.SMALL_THUMBNAIL_HEIGHT
      && width < CONSTANTS.SMALL_THUMBNAIL_WIDTH
    );
  }

  /**
   * Handles remove (x) button click
   *
   * @param {Object} event
   */
  handleRemove(event) {
    event.preventDefault();
    if (this.props.onRemove) {
      this.props.onRemove(event, this.props.item);
    }
  }

  /**
   * Handles edit button click
   *
   * @param {Object} event
   */
  handleView(event) {
    event.preventDefault();
    if (this.props.onView) {
      this.props.onView(event, this.props.item);
    }
  }

  /**
   * Handles click of an item
   *
   * @param {Object} event
   */
  handleItemClick(event) {
    event.preventDefault();
    if (this.props.onItemClick) {
      this.props.onItemClick(event, this.props.item);
    }
  }

  renderStatus() {
    if (this.props.item.draft) {
      return (
        <span className="uploadfield-item__status">{i18n._t('File.DRAFT', 'Draft')}</span>
      );
    } else if (this.props.item.modified) {
      return (
        <span className="uploadfield-item__status">{i18n._t('File.MODIFIED', 'Modified')}</span>
      );
    }
    return null;
  }

  /**
   * Returns markup for an error message if one is set.
   *
   * @returns {Object}
   */
  renderErrorMessage() {
    let message = null;

    if (this.hasError()) {
      message = this.props.item.message.value;
    } else if (this.missing()) {
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
  }

  /**
   * Gets upload progress bar
   *
   * @returns {object}
   */
  renderProgressBar() {
    const progressBarProps = {
      className: 'uploadfield-item__progress-bar',
      style: {
        width: `${this.props.item.progress}%`,
      },
    };

    if (!this.hasError() && this.props.item.queuedId) {
      if (this.complete()) {
        return (
          <div className="uploadfield-item__complete-icon" />
        );
      }
      return (
        <div className="uploadfield-item__upload-progress">
          <div {...progressBarProps} />
        </div>
      );
    }

    return null;
  }

  /**
   * Gets the remove item button
   *
   * @returns {object}
   */
  renderRemoveButton() {
    if (!this.props.canEdit) {
      return null;
    }
    const classes = [
      'btn',
      'uploadfield-item__remove-btn',
      'btn-secondary',
      'btn--no-text',
      'font-icon-cancel',
      'btn--icon-md',
    ].join(' ');
    return (
      <button
        className={classes}
        onClick={this.handleRemove}
      />
    );
  }

  /**
   * Gets the edit item button
   *
   * @returns {object}
   */
  renderViewButton() {
    if (!this.props.canEdit || !this.props.item.id) {
      return null;
    }
    const classes = [
      'btn',
      'uploadfield-item__view-btn',
      'btn-secondary',
      'btn--no-text',
      'font-icon-eye',
      'btn--icon-md',
    ].join(' ');
    return (
      <button
        className={classes}
        onClick={this.handleView}
      />
    );
  }

  /**
   * @param {Object} item
   * @returns {*}
   */
  renderRestrictedAccess(item) {
    const { id, hasRestrictedAccess } = item;
    const attrs = {
      fileID: id,
      placement: 'top',
      hasRestrictedAccess
    };
    return <FileStatusIcon {...attrs} />;
  }

  /**
   * @param {Object} item
   * @returns {*}
   */
  renderTrackedFormUpload(item) {
    const { id, isTrackedFormUpload, hasRestrictedAccess } = item;
    const attrs = {
      fileID: id,
      placement: 'top',
      isTrackedFormUpload,
      hasRestrictedAccess
    };
    return <FileStatusIcon {...attrs} />;
  }

  /**
   * Get file title / metadata block
   *
   * @returns {object}
   */
  renderFileDetails() {
    const item = this.props.item;
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
          {this.renderStatus()}
          {item.hasRestrictedAccess && this.renderRestrictedAccess(item)}
          {item.isTrackedFormUpload && this.renderTrackedFormUpload(item)}
        </div>
      </div>
    );
  }

  renderThumbnail() {
    return (
      <div
        className={this.getThumbnailClassNames()}
        style={this.getThumbnailStyles()}
        onClick={this.handleItemClick}
        role="button"
        tabIndex={this.props.onItemClick ? 0 : -1}
      />
    );
  }

  /**
   *
   * @returns {object}
   */
  render() {
    const fieldName = `${this.props.name}[Files][]`;
    return (
      <div className={this.getItemClassNames()}>
        <input type="hidden" value={this.props.item.id} name={fieldName} />
        {this.renderThumbnail()}
        {this.renderFileDetails()}
        {this.renderProgressBar()}
        {this.renderErrorMessage()}
        {this.renderViewButton()}
        {this.renderRemoveButton()}
      </div>
    );
  }
}

UploadFieldItem.propTypes = {
  canEdit: PropTypes.bool,
  name: PropTypes.string.isRequired,
  item: fileShape,
  onRemove: PropTypes.func,
  onItemClick: PropTypes.func,
  onView: PropTypes.func,
};

export default UploadFieldItem;

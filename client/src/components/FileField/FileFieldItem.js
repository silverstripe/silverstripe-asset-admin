import i18n from 'i18n';
import React from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import CONSTANTS from 'constants/index';
import fileShape from 'lib/fileShape';

class FileFieldItem extends SilverStripeComponent {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  /**
   * Gets props for thumbnail
   *
   * @returns {Object}
   */
  getThumbnailStyles() {
    if (this.isImage() && (this.exists() || this.uploading())) {
      const thumbnail = this.props.item.smallThumbnail || this.props.item.url;
      return {
        backgroundImage: `url(${thumbnail})`,
      };
    }

    return {};
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
   * Returns markup for an error message if one is set.
   *
   * @returns {Object}
   */
  renderErrorMessage() {
    let message = null;

    if (this.hasError()) {
      message = this.props.item.message.value;
    } else if (!this.exists() && !this.uploading()) {
      message = i18n._t('AssetAdmin.FILE_MISSING', 'File cannot be found');
    }

    if (message !== null) {
      return (
        <div className="file-field-item__error-message">
          {message}
        </div>
      );
    }

    return null;
  }

  /**
   * Retrieve list of thumbnail classes
   *
   * @returns {string}
   */
  getThumbnailClassNames() {
    const thumbnailClassNames = ['file-field-item__thumbnail'];

    if (this.isImageSmallerThanThumbnail()) {
      thumbnailClassNames.push('file-field-item__thumbnail--small');
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
      'file-field-item',
      `file-field-item--${category}`,
    ];

    if (!this.exists() && !this.uploading()) {
      itemClassNames.push('file-field-item--missing');
    }

    if (this.hasError()) {
      itemClassNames.push('file-field-item--error');
    }

    return itemClassNames.join(' ');
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
   * @returns {Boolean}
   */
  uploading() {
    return !!this.props.item.uploaded;
  }

  /**
   * Check if this item has been successfully uploaded.
   * Excludes items not uploaded in this request.
   *
   * @returns {Boolean}
   */
  complete() {
    // Uploading is complete if saved with a DB id
    return this.uploading() && this.props.item.id > 0;
  }

  /**
   * Determine that this record is an image, and the thumbnail is smaller than the given thumbnail area
   *
   * @returns {boolean}
   */
  isImageSmallerThanThumbnail() {
    if (!this.isImage() || (!this.exists() && !this.uploading())) {
      return false;
    }
    const dimensions = this.props.item.dimensions;

    // Note: dimensions will be null if the back-end image is lost
    return (
      dimensions
      && dimensions.height < CONSTANTS.SMALL_THUMBNAIL_HEIGHT
      && dimensions.width < CONSTANTS.SMALL_THUMBNAIL_WIDTH
    );
  }

  /**
   * Avoids the browser's default focus state when selecting an item.
   *
   * @param {Object} event Event object.
   */
  preventFocus(event) {
    event.preventDefault();
  }

  /**
   * Handles remove (x) button click
   *
   * @param {Object} event
   */
  handleRemove(event) {
    event.preventDefault();
    if (this.props.handleRemove) {
      this.props.handleRemove(event, this.props.item);
    }
  }

  /**
   * Gets upload progress bar
   *
   * @returns {Object}
   */
  renderProgressBar() {
    const progressBarProps = {
      className: 'file-field-item__progress-bar',
      style: {
        width: `${this.props.item.progress}%`,
      },
    };

    if (!this.hasError() && this.uploading()) {
      if (this.complete()) {
        return (
          <div className="file-field-item__complete-icon"></div>
        );
      }
      return (
        <div className="file-field-item__upload-progress">
          <div {...progressBarProps}></div>
        </div>
      );
    }

    return null;
  }

  /**
   * Gets the remove item button
   *
   * @returns {XML}
   */
  renderRemoveButton() {
    const classes = [
      'btn',
      'file-field-item__remove-btn',
      'btn-secondary',
      'btn--no-text',
      'font-icon-cancel',
      'btn--icon-md',
    ].join(' ');
    return (
      <button
        className={classes}
        onClick={this.handleRemove}
        ref="backButton"
      >
      </button>
    );
  }

  /**
   * Get file title / metadata block
   *
   * @returns {XML}
   */
  renderFileDetails() {
    return (
      <div className="file-field-item__details fill-width flexbox-area-grow">
        <span className="file-field-item__title" ref="title">
          {this.props.item.title}
        </span>
        <span className="file-field-item__meta">
          {this.props.item.extension}, {this.props.item.size}
        </span>
      </div>
    );
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    const fieldName = `${this.props.name}[Files][]`;
    return (
      <div className={this.getItemClassNames()}>
        <input type="hidden" value={this.props.item.id} name={fieldName} />
        <div
          ref="thumbnail"
          className={this.getThumbnailClassNames()}
          style={this.getThumbnailStyles()}
        ></div>
        {this.renderFileDetails()}
        {this.renderProgressBar()}
        {this.renderErrorMessage()}
        {this.renderRemoveButton()}
      </div>
    );
  }
}

FileFieldItem.propTypes = {
  name: React.PropTypes.string.isRequired,
  item: fileShape,
  handleRemove: React.PropTypes.func,
};

export default FileFieldItem;

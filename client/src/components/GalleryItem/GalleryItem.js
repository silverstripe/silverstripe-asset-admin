import i18n from 'i18n';
import React from 'react';
import constants from 'constants/index';
import SilverStripeComponent from 'lib/SilverStripeComponent';

class GalleryItem extends SilverStripeComponent {
  constructor(props) {
    super(props);

    this.handleToggleSelect = this.handleToggleSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.preventFocus = this.preventFocus.bind(this);
  }

  /**
   * Wrapper around this.props.handleActivate
   *
   * @param {Object} event - Event object.
   */
  handleActivate(event) {
    event.stopPropagation();
    this.props.handleActivate(event, this.props.item);
  }

  /**
   * Wrapper around this.props.handleToggleSelect
   *
   * @param {Object} event Event object.
   */
  handleToggleSelect(event) {
    event.stopPropagation();
    event.preventDefault();
    this.props.handleToggleSelect(event, this.props.item);
  }

  /**
   * Wrapper around this.props.handleDelete
   *
   * @param {Object} event Event object.
   */
  handleDelete(event) {
    this.props.handleDelete(event, this.props.item);
  }

  /**
   * Gets props for thumbnail
   *
   * @returns {Object}
   */
  getThumbnailStyles() {
    if (this.isImage() && (this.exists() || this.uploading())) {
      return {
        backgroundImage: `url(${this.props.item.url})`,
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
    let hasError = false;

    if (Array.isArray(this.props.messages)) {
      hasError = this.props.messages
        .filter(message => message.type === 'error')
        .length > 0;
    }

    return hasError;
  }

  /**
   * Returns markup for an error message if one is set.
   *
   * @returns {Object}
   */
  getErrorMessage() {
    if (this.hasError()) {
      return (
        <span className="gallery-item__error-message">
          {this.props.messages[0].value}
        </span>
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
    const thumbnailClassNames = ['gallery-item__thumbnail'];

    if (this.isImageSmallerThanThumbnail()) {
      thumbnailClassNames.push('gallery-item__thumbnail--small');
    }

    return thumbnailClassNames.join(' ');
  }

  /**
   * Retrieves class names for the item
   *
   * @returns {string}
   */
  getItemClassNames() {
    const itemClassNames = [`gallery-item gallery-item--${this.props.item.category}`];

    if (!this.exists() && !this.uploading()) {
      itemClassNames.push('gallery-item--error');
    }

    if (this.props.selected) {
      itemClassNames.push('gallery-item--selected');
    }

    if (this.props.highlighted) {
      itemClassNames.push('gallery-item--highlighted');
    }

    if (this.hasError()) {
      itemClassNames.push('gallery-item--error');
    }

    return itemClassNames.join(' ');
  }

  /**
   * Determine if this is an image type
   *
   * @returns {boolean}
   */
  isImage() {
    return this.props.item.category === 'image';
  }

  /**
   * Validate that the file backing this record is not missing
   *
   * @returns {boolean}
   */
  exists() {
    return this.props.item.exists;
  }

  uploading() {
    return this.props.uploading;
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
      && dimensions.height < constants.THUMBNAIL_HEIGHT
      && dimensions.width < constants.THUMBNAIL_WIDTH
    );
  }

  /**
   * @param {Object} event
   */
  handleKeyDown(event) {
    event.stopPropagation();

    // If space is pressed, select file
    if (constants.SPACE_KEY_CODE === event.keyCode) {
      event.preventDefault(); // Stop page scrolling if spaceKey is pressed
      this.handleToggleSelect(event);
    }

    // If return is pressed, navigate folder
    if (constants.RETURN_KEY_CODE === event.keyCode) {
      this.handleActivate(event);
    }
  }

  /**
   * Avoids the browser's default focus state when selecting an item.
   *
   * @param {Object} event Event object.
   */
  preventFocus(event) {
    event.preventDefault();
  }

  handleCancelUpload(event) {
    event.stopPropagation();

    if (this.hasError()) {
      this.props.handleRemoveErroredUpload(this.props.item);
    } else {
      this.props.handleCancelUpload(this.props.item);
    }
  }

  /**
   * Gets upload progress bar
   *
   * @returns {Object}
   */
  getProgressBar() {
    let progressBar = null;

    const progressBarProps = {
      className: 'gallery-item__progress-bar',
      style: {
        width: `${this.props.item.progress}%`,
      },
    };

    if (!this.hasError() && this.uploading()) {
      progressBar = (
        <div className="gallery-item__upload-progress">
          <div {...progressBarProps}></div>
        </div>
      );
    }

    return progressBar;
  }

  render() {
    let actionInputCheckbox = null;
    let overlay = null;

    if (this.uploading()) {
      actionInputCheckbox = (<label
        className="gallery-item__checkbox-label font-icon-cancel"
        onClick={this.handleCancelUpload}
      >
      <input
        className="gallery-item__checkbox"
        type="checkbox"
        title={i18n._t('AssetAdmin.SELECT')}
        tabIndex="-1"
        onMouseDown={this.preventFocus}
        data-dz-remove
      /></label>);
    } else {
      actionInputCheckbox = (<label
        className="gallery-item__checkbox-label font-icon-tick"
        onClick={this.handleToggleSelect}
      >
      <input
        className="gallery-item__checkbox"
        type="checkbox"
        title={i18n._t('AssetAdmin.SELECT')}
        tabIndex="-1"
        onMouseDown={this.preventFocus}
      /></label>);

      overlay = <div className="gallery-item--overlay font-icon-edit">View</div>;
    }

    return (
      <div
        className={this.getItemClassNames()}
        data-id={this.props.item.id}
        tabIndex="0"
        onKeyDown={this.handleKeyDown}
        onClick={this.handleActivate}
      >
        <div
          ref="thumbnail"
          className={this.getThumbnailClassNames()}
          style={this.getThumbnailStyles()}
        >
          {overlay}
        </div>
        {this.getProgressBar()}
        {this.getErrorMessage()}
        <div className="gallery-item__title" ref="title">
          {actionInputCheckbox}
          {this.props.item.title}
        </div>
      </div>
    );
  }
}

GalleryItem.propTypes = {
  item: React.PropTypes.shape({
    dimensions: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number,
    }),
    category: React.PropTypes.string.isRequired,
    id: React.PropTypes.number.isRequired,
    url: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    progress: React.PropTypes.number,
  }),
  // Can be used to highlight a currently edited file
  highlighted: React.PropTypes.bool,
  // Styles according to the checkbox selection state
  selected: React.PropTypes.bool.isRequired,
  handleActivate: React.PropTypes.func.isRequired,
  handleToggleSelect: React.PropTypes.func.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
  messages: React.PropTypes.array,
  uploading: React.PropTypes.bool,
};

export default GalleryItem;

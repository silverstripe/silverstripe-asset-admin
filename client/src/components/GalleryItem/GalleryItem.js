import i18n from 'i18n';
import React, { PropTypes } from 'react';
import CONSTANTS from 'constants/index';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import fileShape from 'lib/fileShape';
import draggable from 'components/GalleryItem/draggable';
import droppable from 'components/GalleryItem/droppable';
import Badge from 'components/Badge/Badge';

class GalleryItem extends SilverStripeComponent {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.preventFocus = this.preventFocus.bind(this);
  }

  /**
   * Wrapper around this.props.onActivate
   *
   * @param {Object} event - Event object.
   */
  handleActivate(event) {
    event.stopPropagation();
    if (typeof this.props.onActivate === 'function') {
      this.props.onActivate(event, this.props.item);
    }
  }

  /**
   * Wrapper around this.props.onSelect
   *
   * @param {Object} event Event object.
   */
  handleSelect(event) {
    event.stopPropagation();
    event.preventDefault();
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(event, this.props.item);
    }
  }

  /**
   * Gets props for thumbnail
   *
   * @returns {Object}
   */
  getThumbnailStyles() {
    // Don't fall back to this.props.item.url since it might be huge
    const thumbnail = this.props.item.thumbnail;
    if (this.isImage() && thumbnail && (this.exists() || this.uploading())) {
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
    let hasError = false;

    if (this.props.item.message) {
      hasError = this.props.item.message.type === 'error';
    }

    return hasError;
  }

  /**
   * Returns markup for an error message if one is set.
   *
   * @returns {Object}
   */
  getErrorMessage() {
    let message = null;

    if (this.hasError()) {
      message = this.props.item.message.value;
    } else if (!this.exists() && !this.uploading()) {
      message = i18n._t('AssetAdmin.FILE_MISSING', 'File cannot be found');
    }

    if (message !== null) {
      return (
        <span className="gallery-item__error-message">
          {message}
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
    const category = this.props.item.category || 'false';
    const itemClassNames = [`gallery-item gallery-item--${category}`];

    if (!this.exists() && !this.uploading()) {
      itemClassNames.push('gallery-item--missing');
    }

    if (this.props.selectable) {
      itemClassNames.push('gallery-item--selectable');

      if (this.props.item.selected) {
        itemClassNames.push('gallery-item--selected');
      }
    }

    if (this.props.enlarged) {
      itemClassNames.push('gallery-item--enlarged');
    }

    if (this.props.item.highlighted) {
      itemClassNames.push('gallery-item--highlighted');
    }

    if (this.hasError()) {
      itemClassNames.push('gallery-item--error');
    }

    return itemClassNames.join(' ');
  }

  /**
   * Get flags for statuses that apply to this item
   *
   * @returns {Array}
   */
  getStatusFlags() {
    const flags = [];
    if (this.props.item.type !== 'folder') {
      if (this.props.item.draft) {
        flags.push(<span
          key="status-draft"
          title={i18n._t('File.DRAFT', 'Draft')}
          className="gallery-item--draft"
        />);
      } else if (this.props.item.modified) {
        flags.push(<span
          key="status-modified"
          title={i18n._t('File.MODIFIED', 'Modified')}
          className="gallery-item--modified"
        />);
      }
    }
    return flags;
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

  /**
   * Validate that the file is in upload progress
   *
   * @returns {boolean}
   */
  uploading() {
    return this.props.item.uploading;
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
    const width = this.props.item.width;
    const height = this.props.item.height;

    // Note: dimensions will be null if the back-end image is lost
    return (
      height
      && width
      && height < CONSTANTS.THUMBNAIL_HEIGHT
      && width < CONSTANTS.THUMBNAIL_WIDTH
    );
  }

  /**
   * To capture keyboard actions, such as selecting or activating an item
   *
   * @param {Object} event
   */
  handleKeyDown(event) {
    event.stopPropagation();

    // If space is pressed, select file
    if (CONSTANTS.SPACE_KEY_CODE === event.keyCode) {
      event.preventDefault(); // Stop page scrolling if spaceKey is pressed
      this.handleSelect(event);
    }

    // If return is pressed, navigate folder
    if (CONSTANTS.RETURN_KEY_CODE === event.keyCode) {
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

  /**
   * Callback for cancelling or removing (if failed) this item when it's still uploading.
   *
   * @param event
   */
  handleCancelUpload(event) {
    event.stopPropagation();

    if (this.hasError()) {
      this.props.onRemoveErroredUpload(this.props.item);
    } else if (this.props.onCancelUpload) {
      this.props.onCancelUpload(this.props.item);
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

    if (!this.hasError() && this.uploading() && !this.complete()) {
      progressBar = (
        <div className="gallery-item__upload-progress">
          <div {...progressBarProps}></div>
        </div>
      );
    }

    return progressBar;
  }

  render() {
    let action = null;
    let actionIcon = null;
    let overlay = null;

    if (this.props.selectable) {
      action = this.handleSelect;
      actionIcon = 'font-icon-tick';
    }

    if (this.uploading()) {
      action = this.handleCancelUpload;
      actionIcon = 'font-icon-cancel';
    } else if (this.exists()) {
      overlay = <div className="gallery-item--overlay font-icon-edit">View</div>;
    }

    const badge = this.props.badge;

    return (
      <div
        className={this.getItemClassNames()}
        data-id={this.props.item.id}
        tabIndex="0"
        onKeyDown={this.handleKeyDown}
        onClick={this.handleActivate}
      >
        {!!badge &&
        <Badge
          className="gallery-item__badge"
          status={badge.status}
          message={badge.message}
        />
        }
        <div
          ref="thumbnail"
          className={this.getThumbnailClassNames()}
          style={this.getThumbnailStyles()}
        >
          {overlay}
          {this.getStatusFlags()}
        </div>
        {this.getProgressBar()}
        {this.getErrorMessage()}
        <div className="gallery-item__title" ref="title">
          <label
            className={`gallery-item__checkbox-label ${actionIcon}`}
            onClick={action}
          >
            <input
              className="gallery-item__checkbox"
              type="checkbox"
              title={i18n._t('AssetAdmin.SELECT')}
              tabIndex="-1"
              onMouseDown={this.preventFocus}
            />
          </label>
          {this.props.item.title}
        </div>
      </div>
    );
  }
}

GalleryItem.propTypes = {
  item: fileShape,
  // Can be used to highlight a currently edited file
  highlighted: PropTypes.bool,
  // Styles according to the checkbox selection state
  selected: PropTypes.bool,
  // Whether the item should be enlarged for more prominence than "highlighted"
  enlarged: PropTypes.bool,
  message: PropTypes.shape({
    value: PropTypes.string,
    type: PropTypes.string,
  }),
  selectable: PropTypes.bool,
  onActivate: PropTypes.func,
  onSelect: PropTypes.func,
  onCancelUpload: PropTypes.func,
  onRemoveErroredUpload: PropTypes.func,
};

const type = 'GalleryItem';

const File = draggable(type)(GalleryItem);
const Folder = droppable(type)(File);
export {
  Folder,
  File,
};
export default GalleryItem;

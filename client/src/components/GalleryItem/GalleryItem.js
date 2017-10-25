import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';
import CONSTANTS from 'constants/index';
import fileShape from 'lib/fileShape';
import draggable from 'components/GalleryItem/draggable';
import droppable from 'components/GalleryItem/droppable';
import Badge from 'components/Badge/Badge';
import configShape from 'lib/configShape';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelectable } from 'react-selectable';
import * as imageLoadActions from 'state/imageLoad/ImageLoadActions';
import IMAGE_STATUS from 'state/imageLoad/ImageLoadStatus';

/**
 * Determine if image loading should be performed
 *
 * @param {Object} props - Props to inspect
 */
function shouldLoadImage(props) {
  return props.item.thumbnail
    && props.item.category === 'image'
    && props.item.exists
    && !props.item.uploading // Don't load images for uploaded images (retain client thumbnail)
    && props.sectionConfig.imageRetry.minRetry
    && props.sectionConfig.imageRetry.maxRetry;
}

/**
 * Avoids the browser's default focus state when selecting an item.
 *
 * @param {Object} event Event object.
 */
const preventFocus = (event) => {
  event.preventDefault();
};

class GalleryItem extends Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (shouldLoadImage(nextProps)) {
      // Tell backend to start loading the image
      nextProps.actions.imageLoad.loadImage(
        nextProps.item.thumbnail,
        nextProps.sectionConfig.imageRetry
      );
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
    if (!this.isImage() || !thumbnail || !(this.exists() || this.uploading())) {
      return {};
    }

    // Check loading status of thumbnail
    switch (this.props.loadState) {
      // Use thumbnail if successfully loaded, or preloading isn't enabled
      case IMAGE_STATUS.SUCCESS:
      case IMAGE_STATUS.DISABLED:
        return {
          backgroundImage: `url(${thumbnail})`,
        };
      default:
        return {};
    }
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
    } else if (this.props.loadState === IMAGE_STATUS.FAILED) {
      message = i18n._t('AssetAdmin.FILE_LOAD_ERROR', 'Thumbnail not available');
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

    if (!this.props.item.thumbnail && this.isImage()) {
      thumbnailClassNames.push('gallery-item__thumbnail--no-preview');
    }

    // Check loading status of thumbnail
    switch (this.props.loadState) {
      // Show loading indicator for preloading images
      case IMAGE_STATUS.LOADING: // Beginning first load
      case IMAGE_STATUS.WAITING: // Waiting for subsequent load to retry
        thumbnailClassNames.push('gallery-item__thumbnail--loading');
        break;
      // Show error styles if failed to load thumbnail
      case IMAGE_STATUS.FAILED:
        thumbnailClassNames.push('gallery-item__thumbnail--error');
        break;
      default:
        break;
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
          <div {...progressBarProps} />
        </div>
      );
    }

    return progressBar;
  }

  /**
   * Determine that this record is an image, and the thumbnail is smaller than the given
   * thumbnail area
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
   * Validate that the file is in upload progress
   *
   * @returns {boolean}
   */
  uploading() {
    return this.props.item.uploading;
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
   * Determine if this is an image type
   *
   * @returns {boolean}
   */
  isImage() {
    return this.props.item.category === 'image';
  }

  /**
   * Determine if the item has enabled checkbox
   *
   * @return {Boolean}
   */
  canBatchSelect() {
    return this.props.selectable && this.props.item.canEdit;
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
   * Wrapper around this.props.onActivate
   *
   * @param {Object} event - Event object.
   */
  handleActivate(event) {
    event.stopPropagation();
    if (typeof this.props.onActivate === 'function' && !this.uploading()) {
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
   * To capture keyboard actions, such as selecting or activating an item
   *
   * @param {Object} event
   */
  handleKeyDown(event) {
    // If space is pressed, select file
    if (CONSTANTS.SPACE_KEY_CODE === event.keyCode) {
      event.preventDefault(); // Stop page scrolling if spaceKey is pressed
      if (this.canBatchSelect()) {
        this.handleSelect(event);
      }
    }

    // If return is pressed, navigate folder
    if (CONSTANTS.RETURN_KEY_CODE === event.keyCode) {
      this.handleActivate(event);
    }
  }

  /**
   * Callback for cancelling or removing (if failed) this item when it's still uploading.
   *
   * @param event
   */
  handleCancelUpload(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.hasError()) {
      this.props.onRemoveErroredUpload(this.props.item);
    } else if (this.props.onCancelUpload) {
      this.props.onCancelUpload(this.props.item);
    }
  }

  render() {
    let action = null;
    let actionIcon = null;
    let overlay = null;
    const { id, queuedId } = this.props.item;
    const htmlID = id ? `item-${id}` : `queued-${queuedId}`;
    if (this.props.selectable) {
      if (this.canBatchSelect()) {
        action = this.handleSelect;
      }
      actionIcon = 'font-icon-tick';
    }

    if (this.uploading()) {
      action = this.handleCancelUpload;
      actionIcon = 'font-icon-cancel';
    } else if (this.exists()) {
      const label = i18n._t('AssetAdmin.DETAILS', 'Details');
      overlay = <div className="gallery-item--overlay font-icon-edit">{label}</div>;
    }

    const badge = this.props.badge;

    const inputProps = {
      className: 'gallery-item__checkbox',
      type: 'checkbox',
      title: i18n._t('AssetAdmin.SELECT', 'Select'),
      tabIndex: -1,
      onMouseDown: preventFocus,
      id: htmlID,
    };
    const inputLabelClasses = [
      'gallery-item__checkbox-label',
      actionIcon,
    ];
    if (!this.canBatchSelect()) {
      inputProps.disabled = true;
      inputLabelClasses.push('gallery-item__checkbox-label--disabled');
    }
    const inputLabelProps = {
      className: inputLabelClasses.join(' '),
      onClick: action,
    };

    return (
      <div
        className={this.getItemClassNames()}
        data-id={this.props.item.id}
        tabIndex={0}
        role="button"
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
          ref={(thumbnail) => { this.thumbnail = thumbnail; }}
          className={this.getThumbnailClassNames()}
          style={this.getThumbnailStyles()}
        >
          {overlay}
          {this.getStatusFlags()}
        </div>
        {this.getProgressBar()}
        {this.getErrorMessage()}
        <div className="gallery-item__title" ref={(title) => { this.title = title; }}>
          <label {...inputLabelProps} htmlFor={htmlID}>
            <input {...inputProps} />
          </label>
          {this.props.item.title}
        </div>
      </div>
    );
  }
}

GalleryItem.propTypes = {
  sectionConfig: configShape,
  item: fileShape,
  loadState: PropTypes.oneOf(Object.values(IMAGE_STATUS)),
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
  badge: PropTypes.shape({
    status: PropTypes.string,
    message: PropTypes.string,
  }),
};

GalleryItem.defaultProps = {
  item: {},
  sectionConfig: {
    imageRetry: {},
  },
};
function mapStateToProps(state, ownprops) {
  // If image is broken, replace with placeholder
  if (shouldLoadImage(ownprops)) {
    // Find state of this file
    const imageLoad = state.assetAdmin.imageLoad;
    const file = imageLoad.files.find((next) => ownprops.item.thumbnail === next.url);

    // Use file state, or mark none prior to loadFile being called
    const loadState = (file && file.status) || IMAGE_STATUS.NONE;
    return { loadState };
  }
  // None implies disabled preloading
  return { loadState: IMAGE_STATUS.DISABLED };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      imageLoad: bindActionCreators(imageLoadActions, dispatch),
    },
  };
}

const ConnectedGalleryItem = connect(mapStateToProps, mapDispatchToProps)(GalleryItem);
const type = 'GalleryItem';

const File = createSelectable(draggable(type)(ConnectedGalleryItem));
const Folder = createSelectable(droppable(type)(File));
export {
  GalleryItem as Component,
  Folder,
  File,
};
export default ConnectedGalleryItem;

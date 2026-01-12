import i18n from 'i18n';
import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import CONSTANTS from 'constants/index';
import fileShape from 'lib/fileShape';
import draggable from 'components/GalleryItem/draggable';
import droppable from 'components/GalleryItem/droppable';
import Badge from 'components/Badge/Badge';
import FileStatusIcon from 'components/FileStatusIcon/FileStatusIcon';
import configShape from 'lib/configShape';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as imageLoadActions from 'state/imageLoad/ImageLoadActions';
import IMAGE_STATUS from 'state/imageLoad/ImageLoadStatus';
import PropTypes from 'prop-types';

/**
 * Determine if image loading should be performed
 *
 * @param {Object} props - Props to inspect
 */
function shouldLoadImage(props) {
  return props.item.thumbnail
    && props.item.category === 'image'
    && props.item.exists
    // Don't load images for uploaded images (retain client thumbnail)
    && !props.item.queuedId
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

const GalleryItem = (_props) => {
  const {
    sectionConfig = {
      imageRetry: {},
    },
    item = {},
    loadState,
    bustCache = true,
    isDropping,
    isDragging,
    maxSelected,
    selectable,
    onActivate,
    onSelect,
    onCancelUpload,
    onRemoveErroredUpload,
    badge,
    updateStatusFlags = (flags) => flags,
    updateProgressBar = (progressBar) => progressBar,
    updateErrorMessage = (msg) => msg,
    children,
    actions,
  } = _props;

  // Create a props object to pass child components
  const props = {
    ..._props,
    // Use either the passed in prop values or the default values
    sectionConfig,
    item,
    bustCache,
    updateStatusFlags,
    updateProgressBar,
    updateErrorMessage,
  };

  const thumbnailRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (shouldLoadImage({
      item,
      sectionConfig,
    })) {
      actions.imageLoad.loadImage(
        item.thumbnail,
        sectionConfig.imageRetry
      );
    }
  }, [item, sectionConfig, actions.imageLoad]);

  /**
   * Check if this item has been saved, either in this request or in a prior one
   *
   * @return {Boolean}
   */
  const saved = () => item.id > 0;

  /**
   * Check if this item has been successfully uploaded.
   * Excludes items not uploaded in this request.
   * Uploading is complete if saved with a DB id
   *
   * @returns {Boolean}
   */
  const complete = () => item.queuedId && saved();

  /**
   * Validate that the file backing this record is not missing
   *
   * @returns {boolean}
   */
  const exists = () => item.exists;

  /**
   * Check if this item should have a file, but is missing.
   *
   * @return {Boolean}
   */
  const missing = () => !exists() && saved();

  /**
   * Validate that the file is in upload progress, but not saved yet
   *
   * @returns {boolean}
   */
  const uploading = () => item.queuedId && !saved();

  /**
   * Determine if this is an image type
   *
   * @returns {boolean}
   */
  const isImage = () => item.category === 'image';

  /**
   * Determine if the item has enabled checkbox
   *
   * @return {Boolean}
   */
  const canBatchSelect = () => selectable && item.canEdit;

  /**
   * Checks if the component has an error set.
   *
   * @return {boolean}
   */
  const hasError = () => {
    let hasErrorFlag = false;

    if (item.message) {
      hasErrorFlag = item.message.type === 'error';
    }

    return hasErrorFlag;
  };

  /**
   * Gets props for thumbnail
   *
   * @returns {Object}
   */
  const getThumbnailStyles = () => {
    // Don't fall back to item.url since it might be huge
    const { thumbnail, version } = item;
    if (!isImage() || !thumbnail || missing()) {
      return {};
    }

    // When the thumbnail is a link, add version id to bust the cache
    const url = (bustCache === false || !version || thumbnail.startsWith('data:image/')) ?
      thumbnail :
      `${thumbnail}?vid=${version}`;

    // Check loading status of thumbnail
    switch (loadState) {
      // Use thumbnail if successfully loaded, or preloading isn't enabled
      case IMAGE_STATUS.SUCCESS:
      case IMAGE_STATUS.DISABLED:
        return {
          backgroundImage: `url(${url})`,
        };
      default:
        return {};
    }
  };

  /**
   * Gets a function that may be overloaded at the item level
   * @param {string} functionName
   * @returns {Function}
   */
  const getItemFunction = (functionName) => {
    if (typeof item[functionName] === 'function') {
      return item[functionName];
    }
    // Return the default function based on the function name
    const functionMap = {
      updateStatusFlags,
      updateProgressBar,
      updateErrorMessage,
    };
    return functionMap[functionName] || (() => null);
  };

  /**
   * Returns markup for an error message if one is set.
   *
   * @returns {Object}
   */
  const getErrorMessage = () => {
    let errMessage = null;

    if (hasError()) {
      errMessage = item.message.value;
    } else if (missing()) {
      errMessage = i18n._t('AssetAdmin.FILE_MISSING', 'File cannot be found');
    } else if (loadState === IMAGE_STATUS.FAILED) {
      errMessage = i18n._t('AssetAdmin.FILE_LOAD_ERROR', 'Thumbnail not available');
    }

    if (errMessage !== null) {
      const updateErrorMessageFn = getItemFunction('updateErrorMessage');
      const messageProps = { ...props, value: errMessage };
      errMessage = updateErrorMessageFn(errMessage, messageProps);
      return (
        <span className="gallery-item__error-message">
          {errMessage}
        </span>
      );
    }

    return null;
  };

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
    const width = item.width;
    const height = item.height;

    // Note: dimensions will be null if the back-end image is lost
    return (
      height
      && width
      && height < CONSTANTS.THUMBNAIL_HEIGHT
      && width < CONSTANTS.THUMBNAIL_WIDTH
    );
  };

  /**
   * Retrieve list of thumbnail classes
   *
   * @returns {string}
   */
  const getThumbnailClassNames = () => {
    const thumbnailClassNames = ['gallery-item__thumbnail'];

    if (isImageSmallerThanThumbnail()) {
      thumbnailClassNames.push('gallery-item__thumbnail--small');
    }

    if (!item.thumbnail && isImage()) {
      thumbnailClassNames.push('gallery-item__thumbnail--no-preview');
    }

    if (item.type === 'folder') {
      thumbnailClassNames.push('gallery-item__thumbnail--folder');
    }

    // Check loading status of thumbnail
    switch (loadState) {
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
  };

  /**
   * Retrieves class names for the item
   *
   * @returns {string}
   */
  const getItemClassNames = () => {
    const category = item.category || 'false';
    const isSelected = selectable && (item.selected || isDragging);

    return classnames({
      'gallery-item': true,
      [`gallery-item--${category}`]: true,
      'gallery-item--max-selected': maxSelected && !isSelected,
      'gallery-item--missing': missing(),
      'gallery-item--selectable': selectable,
      'gallery-item--selected': isSelected,
      'gallery-item--dropping': isDropping,
      'gallery-item--highlighted': item.highlighted,
      'gallery-item--error': hasError(),
      'gallery-item--dragging': isDragging,
    });
  };

  /**
   * Get flags for statuses that apply to this item
   *
   * @returns {*}
   */
  const getStatusFlags = () => {
    let flags = [];
    if (item.type !== 'folder') {
      if (item.draft) {
        flags.push({
          key: 'status-draft',
          title: i18n._t('File.DRAFT', 'Draft'),
          className: 'gallery-item--draft',
        });
      } else if (item.modified) {
        flags.push({
          key: 'status-modified',
          title: i18n._t('File.MODIFIED', 'Modified'),
          className: 'gallery-item--modified',
        });
      }
    }
    const updateStatusFlagsFn = getItemFunction('updateStatusFlags');
    flags = updateStatusFlagsFn(flags, props);
    return (
      <div className="gallery-item__status-flags">
        {flags.map(attrs => <span {...attrs} />)}
      </div>
    );
  };

  /**
   * Get flags for statuses that apply to this item
   *
   * @returns {*}
   */
  const getStatusIcons = () => {
    const icons = [];
    if (item.hasRestrictedAccess) {
      icons.push({
        key: 'status-restricted',
        fileID: item.id,
        hasRestrictedAccess: true,
        placement: 'top',
        disableTooltip: item.type === 'folder',
        includeBackground: item.type !== 'folder',
      });
    }
    if (item.isTrackedFormUpload && item.type !== 'folder') {
      icons.push({
        key: 'status-tracked-form-upload',
        fileID: item.id,
        isTrackedFormUpload: true,
        hasRestrictedAccess: item.hasRestrictedAccess,
        placement: 'top',
        includeBackground: true,
      });
    }
    return (
      <div className="gallery-item__status-icons">
        {icons.map(attrs => <FileStatusIcon {...attrs} />)}
      </div>
    );
  };

  /**
   * Gets upload progress bar
   *
   * @returns {Object}
   */
  const getProgressBar = () => {
    let progressBar = null;
    const progressBarProps = {
      className: 'gallery-item__progress-bar',
      style: {
        width: `${item.progress}%`,
      },
    };

    if (!hasError() && uploading() && !complete()) {
      progressBar = (
        <div className="gallery-item__upload-progress">
          <div {...progressBarProps} />
        </div>
      );
    }
    const updateProgressBarFn = getItemFunction('updateProgressBar');
    progressBar = updateProgressBarFn(progressBar, props);
    return progressBar;
  };

  /**
   * Wrapper around onActivate prop
   *
   * @param {Object} event - Event object.
   */
  const handleActivate = (event) => {
    event.stopPropagation();
    if (typeof onActivate === 'function' && saved()) {
      onActivate(event, item);
    }
  };

  /**
   * Wrapper around onSelect prop
   *
   * @param {Object} event Event object.
   */
  const handleSelect = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (typeof onSelect === 'function') {
      onSelect(event, item);
    }
  };

  /**
   * To capture keyboard actions, such as selecting or activating an item
   *
   * @param {Object} event
   */
  const handleKeyDown = (event) => {
    // If space is pressed, select file
    if (event.key === ' ') {
      event.preventDefault(); // Stop page scrolling if spaceKey is pressed
      if (canBatchSelect()) {
        handleSelect(event);
      }
    }

    // If return is pressed, navigate folder
    if (event.key === 'Enter') {
      handleActivate(event);
    }
  };

  /**
   * Callback for cancelling or removing (if failed) this item when it's still uploading.
   *
   * @param event
   */
  const handleCancelUpload = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (hasError()) {
      onRemoveErroredUpload(item);
    } else if (onCancelUpload) {
      onCancelUpload(item);
    }
  };

  let action = null;
  let actionIcon = null;
  let overlay = null;
  const { id, queuedId } = item;
  const htmlID = id ? `item-${id}` : `queued-${queuedId}`;
  if (selectable) {
    if (canBatchSelect()) {
      action = handleSelect;
    }
    actionIcon = 'font-icon-tick';
  }

  if (uploading()) {
    action = handleCancelUpload;
    actionIcon = 'font-icon-cancel';
  } else if (exists()) {
    const label = i18n._t('AssetAdmin.VIEW', 'View');
    overlay = <div className="gallery-item--overlay">
      <span className="font-icon-eye" aria-hidden="true" />
      {label}
    </div>;
  }

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
    'form-label',
  ];
  if (!canBatchSelect()) {
    inputProps.disabled = true;
    inputLabelClasses.push('gallery-item__checkbox-label--disabled');
  }
  const inputLabelProps = {
    className: inputLabelClasses.join(' '),
    onClick: action,
  };

  return (
    <div
      className={getItemClassNames()}
      data-id={item.id}
      tabIndex={0}
      role="button"
      onKeyDown={handleKeyDown}
      onClick={handleActivate}
    >
      {!!badge &&
      <Badge
        className="gallery-item__badge"
        status={badge.status}
        message={badge.message}
      />
      }
      <div
        ref={thumbnailRef}
        className={getThumbnailClassNames()}
        style={getThumbnailStyles()}
      >
        {overlay}
        {getStatusFlags()}
        {getStatusIcons()}
      </div>
      {getProgressBar()}
      {getErrorMessage()}
      {children}
      <div
        className="gallery-item__title"
        data-draggable="true"
        ref={titleRef}
      >
        <label {...inputLabelProps} htmlFor={htmlID}>
          <span className={`gallery-item__checkbox-icon ${actionIcon}`} aria-hidden="true" />
          <input {...inputProps} />
        </label>
        {item.title}
      </div>
    </div>
  );
};

GalleryItem.propTypes = {
  sectionConfig: configShape,
  item: fileShape,
  loadState: PropTypes.oneOf(Object.values(IMAGE_STATUS)),
  bustCache: PropTypes.bool,
  // Can be used to highlight a currently edited file
  highlighted: PropTypes.bool,
  // Styles according to the checkbox selection state
  selected: PropTypes.bool,
  // Whether the item should be enlarged for more prominence than "highlighted"
  isDropping: PropTypes.bool,
  isDragging: PropTypes.bool,
  maxSelected: PropTypes.bool,
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
  updateStatusFlags: PropTypes.func,
  updateProgressBar: PropTypes.func,
  updateErrorMessage: PropTypes.func,
};

function mapStateToProps(state, ownprops) {
  const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';
  const { bustCache } = state.config.sections.find((section) => section.name === sectionConfigKey);

  // None implies disabled preloading
  let loadState = IMAGE_STATUS.DISABLED;

  // If image is broken, replace with placeholder
  if (shouldLoadImage(ownprops)) {
    // Find state of this file
    const imageLoad = state.assetAdmin.imageLoad;
    const file = imageLoad.files.find((next) => ownprops.item.thumbnail === next.url);

    // Use file state, or mark none prior to loadFile being called
    loadState = (file && file.status) || IMAGE_STATUS.NONE;
  }

  return { bustCache, loadState };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      imageLoad: bindActionCreators(imageLoadActions, dispatch),
    },
  };
}

const ConnectedGalleryItem = connect(mapStateToProps, mapDispatchToProps)(GalleryItem);

const File = draggable(ConnectedGalleryItem);
const Folder = droppable(File);
export {
  GalleryItem as Component,
  Folder,
  File,
};
export default ConnectedGalleryItem;

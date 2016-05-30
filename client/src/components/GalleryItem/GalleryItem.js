import i18n from 'i18n';
import React from 'react';
import constants from 'constants/index';
import SilverStripeComponent from 'lib/SilverStripeComponent';

class File extends SilverStripeComponent {
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
   * @param object event - Event object.
   */
  handleActivate(event) {
    event.stopPropagation();
    this.props.handleActivate(event, this.props.item);
  }

  /**
   * Wrapper around this.props.handleToggleSelect
   *
   * @param object event - Event object.
   */
  handleToggleSelect(event) {
    event.stopPropagation();
    event.preventDefault();
    this.props.handleToggleSelect(event, this.props.item);
  }

  /**
   * Wrapper around this.props.handleDelete
   *
   * @param object event - Event object.
   */
  handleDelete(event) {
    this.props.handleDelete(event, this.props.item);
  }

  getThumbnailStyles() {
    if (this.props.item.category === 'image') {
      return {
        backgroundImage: `url(${this.props.item.url})`,
      };
    }

    return {};
  }

  /**
   * Checks if the component has an error set.
   *
   * @return boolean
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

  getThumbnailClassNames() {
    const thumbnailClassNames = ['gallery-item__thumbnail'];

    if (this.isImageSmallerThanThumbnail()) {
      thumbnailClassNames.push('gallery-item__thumbnail--small');
    }

    return thumbnailClassNames.join(' ');
  }

  getItemClassNames() {
    const itemClassNames = [`gallery-item gallery-item--${this.props.item.category}`];

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

  isImageSmallerThanThumbnail() {
    const dimensions = this.props.item.attributes.dimensions;

    return (
      dimensions.height < constants.THUMBNAIL_HEIGHT
      && dimensions.width < constants.THUMBNAIL_WIDTH
    );
  }

  handleKeyDown(event) {
    event.stopPropagation();

    // If space is pressed, select file
    if (this.props.spaceKey === event.keyCode) {
      event.preventDefault(); // Stop page scrolling if spaceKey is pressed
      this.handleToggleSelect(event);
    }

    // If return is pressed, navigate folder
    if (this.props.returnKey === event.keyCode) {
      this.handleActivate(event, this.props.item);
    }
  }

  /**
   * Avoids the browser's default focus state when selecting an item.
   *
   * @param object event - Event object.
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

  getProgressBar() {
    let progressBar;

    const progressBarProps = {
      className: 'gallery-item__upload-progress__bar',
      style: {
        width: `${this.props.item.progress}%`,
      },
    };

    if (!this.hasError() && this.props.uploading) {
      progressBar = (
        <div className="gallery-item__upload-progress">
          <div {...progressBarProps}></div>
        </div>
      );
    }

    return progressBar;
  }

  render() {
    let actionInputCheckbox;

    if (this.props.uploading) {
      actionInputCheckbox = (<label
        className="gallery-item__action--cancel font-icon-cancel"
        onClick={this.handleCancelUpload}
      >
      <input
        className="gallery-item__action item__action--select"
        type="checkbox"
        title={i18n._t('AssetGalleryField.SELECT')}
        tabIndex="-1"
        onMouseDown={this.preventFocus}
        data-dz-remove
      /></label>);
    } else {
      actionInputCheckbox = (<label
        className="gallery-item__action--label font-icon-tick"
        onClick={this.handleToggleSelect}
      >
      <input
        className="gallery-item__action gallery-item__action--select"
        type="checkbox"
        title={i18n._t('AssetGalleryField.SELECT')}
        tabIndex="-1"
        onMouseDown={this.preventFocus}
      /></label>);
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
          <div className="gallery-item--overlay font-icon-edit">View</div>
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

File.propTypes = {
  item: React.PropTypes.shape({
    attributes: React.PropTypes.shape({
      dimensions: React.PropTypes.object.isRequired,
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
  spaceKey: React.PropTypes.number,
  returnKey: React.PropTypes.number,
  handleActivate: React.PropTypes.func.isRequired,
  handleToggleSelect: React.PropTypes.func.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
  messages: React.PropTypes.array,
  uploading: React.PropTypes.bool,
};

File.defaultProps = {
  returnKey: 13,
  spaceKey: 32,
};

export default File;

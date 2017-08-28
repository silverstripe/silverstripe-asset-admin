import i18n from 'i18n';
import React, { Component } from 'react';
import { Folder, File } from 'components/GalleryItem/GalleryItem';
import { galleryViewPropTypes, galleryViewDefaultProps } from 'containers/Gallery/Gallery';
import Griddle from 'griddle-react';

class ThumbnailView extends Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDrag(dragging) {
    this.props.onEnableDropzone(!dragging);
  }

  /**
   * Handles setting the pagination page number
   *
   * @param {number} page
   */
  handleSetPage(page) {
    this.props.onSetPage(page);
  }

  /**
   * Handler for incrementing the set page
   */
  handleNextPage() {
    this.handleSetPage(this.props.page + 1);
  }

  /**
   * Handler for decrementing the set page
   */
  handlePrevPage() {
    this.handleSetPage(this.props.page - 1);
  }

  /**
   * Filtering by folder type
   *
   * @param {object} file
   * @returns {boolean}
   */
  folderFilter(file) {
    return file.type === 'folder';
  }

  /**
   * Filtering by non-folder types
   *
   * @param {object} file
   * @returns {boolean}
   */
  fileFilter(file) {
    return file.type !== 'folder';
  }

  /**
   * Renders the react component for pagination.
   * Current borrows the pagination from Griddle, to keep styling consistent between the two views
   *
   * @returns {XML|null}
   */
  renderPagination() {
    if (this.props.totalCount <= this.props.limit) {
      return null;
    }
    const props = {
      setPage: this.handleSetPage,
      maxPage: Math.ceil(this.props.totalCount / this.props.limit),
      next: this.handleNextPage,
      nextText: i18n._t('AssetAdmin.NEXT', 'Next'),
      previous: this.handlePrevPage,
      previousText: i18n._t('AssetAdmin.PREVIOUS', 'Previous'),
      currentPage: this.props.page - 1,
      useGriddleStyles: false,
    };
    return (
      <div className="griddle-footer">
        <Griddle.GridPagination {...props} />
      </div>
    );
  }

  /**
   * Renders the item for the this view, assigning relevant props
   *
   * @param {object} item
   * @param {number} index
   * @returns {XML}
   */
  renderItem(item, index) {
    const badge = this.props.badges.find((badgeItem) => badgeItem.id === item.id);
    const props = {
      sectionConfig: this.props.sectionConfig,
      key: index,
      selectableKey: item.id,
      item,
      selectedFiles: this.props.selectedFiles,
      onDrag: this.handleDrag,
      badge,
    };

    if (item.uploading) {
      Object.assign(props, {
        onCancelUpload: this.props.onCancelUpload,
        onRemoveErroredUpload: this.props.onRemoveErroredUpload,
      });
    } else {
      Object.assign(props, {
        onActivate: (item.type === 'folder')
          ? this.props.onOpenFolder
          : this.props.onOpenFile,
      });
    }

    if (this.props.selectableItems) {
      Object.assign(props, {
        selectable: true,
        onSelect: this.props.onSelect,
      });
    }

    if (item.type === 'folder') {
      Object.assign(props, {
        onDropFiles: this.props.onDropFiles,
      });
      return <Folder {...props} />;
    }
    return <File {...props} />;
  }

  render() {
    return (
      <div className="gallery__main-view--tile">
        <div className="gallery__folders">
          {this.props.files.filter(this.folderFilter).map(this.renderItem)}
        </div>

        <div className="gallery__files">
          {this.props.files.filter(this.fileFilter).map(this.renderItem)}
        </div>

        {this.props.files.length === 0 && !this.props.loading &&
          <p className="gallery__no-item-notice">{i18n._t('AssetAdmin.NOITEMSFOUND')}</p>
        }

        <div className="gallery__load">
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

ThumbnailView.defaultProps = galleryViewDefaultProps;

ThumbnailView.propTypes = galleryViewPropTypes;

export default ThumbnailView;

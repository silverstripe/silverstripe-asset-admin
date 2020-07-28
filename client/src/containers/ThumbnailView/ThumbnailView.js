import i18n from 'i18n';
import React, { Component } from 'react';
import { inject } from 'lib/Injector';
import { galleryViewPropTypes, galleryViewDefaultProps } from 'containers/Gallery/Gallery';
import Griddle from 'griddle-react';
import PropTypes from 'prop-types';

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
    // +1 to cater for the 0-indexed page that is returned from Griddle
    this.props.onSetPage(page + 1);
  }

  /**
   * Handler for incrementing the set page
   */
  handleNextPage() {
    // (page -1) to cater for the 0-indexed page that is returned from Griddle
    const currentPage = this.props.page - 1;
    this.handleSetPage(currentPage + 1);
  }

  /**
   * Handler for decrementing the set page
   */
  handlePrevPage() {
    // (page -1) to cater for the 0-indexed page that is returned from Griddle
    const currentPage = this.props.page - 1;
    if (currentPage === 0) {
      this.handleSetPage(currentPage);
      return;
    }
    this.handleSetPage(currentPage - 1);
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
  renderItem(item) {
    const {
      File,
      Folder,
      badges,
      sectionConfig,
      selectedFiles,
      selectableItems,
      selectableFolders,
    } = this.props;
    const badge = badges.find((badgeItem) => badgeItem.id === item.id);
    let props = {
      sectionConfig,
      key: item.key,
      selectableKey: item.id,
      item,
      selectedFiles,
      onDrag: this.handleDrag,
      badge,
      canDrag: this.props.canDrag,
    };

    if (item.queuedId && !item.id) {
      const { onCancelUpload, onRemoveErroredUpload } = this.props;
      props = { ...props, onCancelUpload, onRemoveErroredUpload };
    } else {
      const { onOpenFolder, onOpenFile } = this.props;
      props = {
        ...props,
        onActivate: (item.type === 'folder') ? onOpenFolder : onOpenFile,
      };
    }

    if (selectableItems && (selectableFolders || item.type !== 'folder')) {
      const maxSelected = (
        ![null, 1].includes(this.props.maxFilesSelect) &&
        this.props.selectedFiles.length >= this.props.maxFilesSelect
      );
      const onSelect = (this.props.maxFilesSelect === 1) ? props.onActivate : this.props.onSelect;
      props = { ...props, selectable: true, onSelect, maxSelected };
    }

    if (item.type === 'folder') {
      const { onDropFiles } = this.props;
      props = { ...props, onDropFiles };
      return <Folder {...props} />;
    }
    return <File {...props} />;
  }

  render() {
    const className = 'gallery__main-view--tile';
    return (
      <div className={className}>
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

ThumbnailView.propTypes = {
  ...galleryViewPropTypes,
  File: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  Folder: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

const injector = inject(
  ['GalleryItemFile', 'GalleryItemFolder'],
  (GalleryItemFile, GalleryItemFolder) => ({
    File: GalleryItemFile,
    Folder: GalleryItemFolder
  }),
  () => 'AssetAdmin.Gallery.ThumbnailView',
);

export { ThumbnailView as Component };

export default injector(ThumbnailView);

/* eslint-disable import/no-cycle */
import i18n from 'i18n';
import React, { Component } from 'react';
import { inject } from 'lib/Injector';
import { galleryViewPropTypes, galleryViewDefaultProps } from 'containers/Gallery/Gallery';
import Paginator from 'components/Paginator/Paginator';
import PropTypes from 'prop-types';

class ThumbnailView extends Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
  }

  /**
   * Handles setting the pagination page number
   */
  handleSetPage(page) {
    this.props.onSetPage(page);
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
   *
   * @returns {XML|null}
   */
  renderPagination() {
    if (this.props.totalCount <= this.props.limit) {
      return null;
    }
    const props = {
      totalItems: this.props.totalCount,
      maxItemsPerPage: this.props.limit,
      currentPage: this.props.page,
      onChangePage: this.handleSetPage,
      title: i18n._t('AssetAdmin.FILES')
    };
    return <Paginator {...props} />;
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
  File: PropTypes.elementType.isRequired,
  Folder: PropTypes.elementType.isRequired,
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

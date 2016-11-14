import $ from 'jQuery';
import i18n from 'i18n';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTestUtils from 'react-addons-test-utils';
import Dropzone from 'components/AssetDropzone/AssetDropzone';
import GalleryItem from 'components/GalleryItem/GalleryItem';
import BulkActions from 'components/BulkActions/BulkActions';
import CONSTANTS from 'constants/index';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as queuedFilesActions from 'state/queuedFiles/QueuedFilesActions';

function getComparator(field, direction) {
  return (a, b) => {
    const fieldA = a[field].toLowerCase();
    const fieldB = b[field].toLowerCase();

    if (direction === 'asc') {
      if (fieldA < fieldB) {
        return -1;
      }

      if (fieldA > fieldB) {
        return 1;
      }
    } else {
      if (fieldA > fieldB) {
        return -1;
      }

      if (fieldA < fieldB) {
        return 1;
      }
    }

    return 0;
  };
}

class Gallery extends Component {

  constructor(props) {
    super(props);

    this.sorters = [
      {
        field: 'title',
        direction: 'asc',
        label: i18n._t('AssetAdmin.FILTER_TITLE_ASC'),
      },
      {
        field: 'title',
        direction: 'desc',
        label: i18n._t('AssetAdmin.FILTER_TITLE_DESC'),
      },
      {
        field: 'created',
        direction: 'desc',
        label: i18n._t('AssetAdmin.FILTER_DATE_DESC'),
      },
      {
        field: 'created',
        direction: 'asc',
        label: i18n._t('AssetAdmin.FILTER_DATE_ASC'),
      },
    ];

    this.handleFolderActivate = this.handleFolderActivate.bind(this);
    this.handleFileActivate = this.handleFileActivate.bind(this);
    this.handleToggleSelect = this.handleToggleSelect.bind(this);
    this.handleAddedFile = this.handleAddedFile.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.handleRemoveErroredUpload = this.handleRemoveErroredUpload.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleSending = this.handleSending.bind(this);
    this.handleItemDelete = this.handleItemDelete.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSuccessfulUpload = this.handleSuccessfulUpload.bind(this);
    this.handleFailedUpload = this.handleFailedUpload.bind(this);
    this.handleCreateFolder = this.handleCreateFolder.bind(this);
  }

  componentDidMount() {
    this.refreshFolderIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.sort && !nextProps.files) {
      return;
    }
    if (this.props.files.length !== nextProps.files.length
      || this.props.sort !== nextProps.sort
    ) {
      const sort = nextProps.sort || `${this.sorters[0].field},${this.sorters[0].direction}`;
      const [field, direction] = sort.split(',');
      this.props.actions.gallery.sortFiles(getComparator(field, direction));
    }
  }

  componentWillUpdate() {
    const $select = $(ReactDOM.findDOMNode(this)).find('.gallery__sort .dropdown');
    $select.off('change');
  }

  componentDidUpdate(prevProps) {
    const $select = $(ReactDOM.findDOMNode(this)).find('.gallery__sort .dropdown');

    // We opt-out of letting the CMS handle Chosen because it doesn't
    // re-apply the behaviour correctly.
    // So after the gallery has been rendered we apply Chosen.
    $select.chosen({
      allow_single_deselect: true,
      disable_search_threshold: 20,
    });

    // Chosen stops the change event from reaching React so we have to simulate a click.
    $select.on('change', () => ReactTestUtils.Simulate.click($select.find(':selected')[0]));

    this.refreshFolderIfNeeded(prevProps);
    this.checkLoadingIndicator();
  }

  componentWillUnmount() {
    // clear existing folder content, so behaviour of component is predictable for the Modal
    this.props.actions.gallery.unloadFolderContents();
  }

  getNoItemsNotice() {
    if (this.props.files.length < 1 && this.props.queuedFiles.items.length < 1 && !this.props.loading) {
      return <p className="gallery__no-item-notice">{i18n._t('AssetAdmin.NOITEMSFOUND')}</p>;
    }

    return null;
  }

  getMoreButton() {
    if (this.props.count > this.props.files.length) {
      return (
        <button
          className="gallery__load-more"
          onClick={this.handleMoreClick}
        >
          {i18n._t('AssetAdmin.LOADMORE')}
        </button>
      );
    }

    return null;
  }

  checkLoadingIndicator() {
    const $sectionWrapper = $('.cms-content.AssetAdmin');

    if (this.props.loading && !$sectionWrapper.hasClass('loading')) {
      $sectionWrapper.addClass('loading');
    } else if (!this.props.loading && $sectionWrapper.hasClass('loading')) {
      $sectionWrapper.removeClass('loading');
    }
  }

  refreshFolderIfNeeded(prevProps) {
    if (!prevProps || this.props.folderId !== prevProps.folderId) {
      this.props.actions.gallery.deselectFiles();
      this.props.actions.gallery.loadFolderContents(
        this.props.readFolderApi,
        this.props.folderId,
        this.props.limit,
        this.props.page
      );
    }
  }

  /**
   * Handler for when the user changes the sort order.
   *
   * @param {Object} event - Click event.
   */
  handleSort(event) {
    if (typeof this.props.onSort === 'function') {
      this.props.actions.queuedFiles.purgeUploadQueue();
      this.props.onSort(event.target.value);
      // this will flow round to `componentWillReceiveProps` and update sort there.
    }
  }

  handleCancelUpload(fileData) {
    // abort wasn't defined..?
    fileData.xhr.abort();
    this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedAtTime);
  }

  handleRemoveErroredUpload(fileData) {
    this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedAtTime);
  }

  handleAddedFile(data) {
    this.props.actions.queuedFiles.addQueuedFile(data);
  }

  /**
   * Triggered just before the xhr request is sent.
   *
   * @param {Object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {Object} xhr
   */
  handleSending(file, xhr) {
    this.props.actions.queuedFiles.updateQueuedFile(file._queuedAtTime, { xhr });
  }

  handleUploadProgress(file, progress) {
    this.props.actions.queuedFiles.updateQueuedFile(file._queuedAtTime, { progress });
  }

  /**
   * Handler for when the user changes clicks the add folder button
   *
   * @param {Object} event - Click event.
   */
  handleCreateFolder(event) {
    const folderName = this.promptFolderName();
    if (folderName) {
      this.props.actions.gallery.createFolder(this.props.createFolderApi, this.props.folderId, folderName)
        .then(data => {
          this.props.actions.gallery.addFiles([data], 1);
          return data;
        });
    }
    event.preventDefault();
  }

  /**
   * Handles successful file uploads.
   *
   * @param {Object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  handleSuccessfulUpload(file) {
    const json = JSON.parse(file.xhr.response);

    // SilverStripe send back a success code with an error message sometimes...
    if (typeof json[0].error !== 'undefined') {
      this.handleFailedUpload(file);
      return;
    }

    this.props.actions.queuedFiles.removeQueuedFile(file._queuedAtTime);
    this.props.actions.gallery.addFiles(json, this.props.count + 1);

    // redirect to open the last uploaded file for 'insert modal' type only
    if (this.props.type === 'insert'
      && !this.props.fileId
      && this.props.queuedFiles.items.length === 0
    ) {
      const lastFile = json.pop();
      this.props.onOpenFile(lastFile.id);
    }
  }

  handleFailedUpload(file, response) {
    this.props.actions.queuedFiles.failUpload(file._queuedAtTime, response);
  }

  /**
   * Handles deleting a file or folder.
   *
   * @param {Object} event
   * @param {Object} item - The file or folder to delete.
   */
  handleItemDelete(event, item) {
    // eslint-disable-next-line no-alert
    if (confirm(i18n._t('AssetAdmin.CONFIRMDELETE'))) {
      this.props.actions.gallery.deleteItems(this.props.deleteApi, [item.id]);
    }
  }

	/**
   * @return {String}
   */
  promptFolderName() {
    // eslint-disable-next-line no-alert
    return prompt(i18n._t('AssetAdmin.PROMPTFOLDERNAME'));
  }

  /**
   * Checks if a file or folder is currently selected.
   *
   * @param {Number} id - The id of the file or folder to check.
   * @return {Boolean}
   */
  itemIsSelected(id) {
    return this.props.selectedFiles.indexOf(id) > -1;
  }

  /**
   * Checks if a file or folder is currently highlighted,
   * which typically means its own for viewing or editing.
   *
   * @param {Number} id - The id of the file or folder to check.
   * @return {Boolean}
   */
  itemIsHighlighted(id) {
    return this.props.fileId === id;
  }

  /**
   * Handles a user drilling down into a folder.
   *
   * @param {Object} event - Event object.
   * @param {Object} folder - The folder that's being activated.
   */
  handleFolderActivate(event, folder) {
    event.preventDefault();
    this.props.onOpenFolder(folder.id);
  }

  /**
   * Handles a user activating the file editor.
   *
   * @param {Object} event - Event object.
   * @param {Object} file - The file that's being activated.
   */
  handleFileActivate(event, file) {
    event.preventDefault();
    // Disable file editing if the file has not finished uploading
    // or the upload has errored.
    if (file.created === null) {
      return;
    }

    this.props.onOpenFile(file.id, file);
  }

  /**
   * Handles the user toggling the selected/deselected state of a file or folder.
   *
   * @param {Object} event - Event object.
   * @param {Object} item - The item being selected/deselected
   */
  handleToggleSelect(event, item) {
    if (this.props.selectedFiles.indexOf(item.id) === -1) {
      this.props.actions.gallery.selectFiles([item.id]);
    } else {
      this.props.actions.gallery.deselectFiles([item.id]);
    }
  }

  handleMoreClick(event) {
    event.stopPropagation();
    event.preventDefault();
    this.props.actions.gallery.deselectFiles();

    // TO DO: Load more
  }

  handleBackClick(event) {
    event.preventDefault();
    this.props.onOpenFolder(this.props.folder.parentID);
  }

  /**
   * Generates the react components needed for the Toolbar part of this component.
   *
   * @returns {Component}
   */
  renderToolbar() {
    const canEdit = this.props.folder.canEdit;

    return (
      <div className="toolbar--content toolbar--space-save">

        {this.renderBackButton()}

        <button
          id="upload-button"
          className="btn btn-secondary font-icon-upload btn--icon-xl"
          type="button"
          disabled={!canEdit}
        >
          <span className="btn__text">{i18n._t('AssetAdmin.DROPZONE_UPLOAD')}</span>
        </button>

        <button
          id="add-folder-button"
          className="btn btn-secondary font-icon-folder-add btn--icon-xl "
          type="button"
          onClick={this.handleCreateFolder}
          disabled={!canEdit}
        >
          <span className="btn__text">{i18n._t('AssetAdmin.ADD_FOLDER_BUTTON')}</span>
        </button>
      </div>
    );
  }

  /**
   * Generates the react components needed for the Sorter part of this component.
   *
   * @returns {Component}
   */
  renderSort() {
    return (
      <div className="gallery__sort fieldholder-small">
        <select
          className="dropdown no-change-track no-chzn"
          tabIndex="0"
          style={{ width: '160px' }}
          defaultValue={this.props.sort}
        >
          {this.sorters.map((sorter, i) =>
            (
              <option
                key={i}
                onClick={this.handleSort}
                data-field={sorter.field}
                data-direction={sorter.direction}
                value={`${sorter.field},${sorter.direction}`}
              >
                {sorter.label}
              </option>
            )
          )}
        </select>
      </div>
    );
  }

  /**
   * Generates the react components needed for the Back button.
   *
   * @returns {Component}
   */
  renderBackButton() {
    const classes = [
      'btn',
      'btn-secondary',
      'btn--no-text',
      'font-icon-level-up',
      'btn--icon-large',
      'gallery__back',
    ].join(' ');
    if (this.props.folder.parentID !== null) {
      return (
        <button
          className={classes}
          onClick={this.handleBackClick}
          ref="backButton"
        >
        </button>
      );
    }

    return null;
  }

  /**
   * Generates the react components needed for the BulkActions part of this component.
   *
   * @returns {Component}
   */
  renderBulkActions() {
    const deleteAction = (items) => {
      const ids = items.map(item => item.id);
      this.props.actions.gallery.deleteItems(this.props.deleteApi, ids);
    };
    const editAction = (items) => {
      this.props.onOpenFile(items[0].id);
    };
    const actions = CONSTANTS.BULK_ACTIONS.map(action => {
      if (action.value === 'delete' && !action.callback) {
        return Object.assign({}, action, { callback: deleteAction });
      }
      if (action.value === 'edit' && !action.callback) {
        return Object.assign({}, action, { callback: editAction });
      }
      return action;
    });
    const selectedFileObjs = this.props.selectedFiles.map(id => this.props.files.find(file => id === file.id));

    if (selectedFileObjs.length > 0 && this.props.type === 'admin') {
      return (
        <ReactCSSTransitionGroup
          transitionName="bulk-actions"
          transitionEnterTimeout={CONSTANTS.CSS_TRANSITION_TIME}
          transitionLeaveTimeout={CONSTANTS.CSS_TRANSITION_TIME}
        >
          <BulkActions
            actions={actions}
            items={selectedFileObjs}
            key={selectedFileObjs.length > 0}
          />
        </ReactCSSTransitionGroup>
      );
    }

    return null;
  }

  render() {
    if (!this.props.folder) {
      if (this.props.errorMessage) {
        return (
          <div className="gallery__error">
            <div className="gallery__error-message">
              <h3>{ this.props.errorMessage &&
                i18n._t('AssetAdmin.DROPZONE_RESPONSE_ERROR', 'Server responded with an error.')
              }</h3>
              <p>{ this.props.errorMessage }</p>
            </div>
          </div>
        );
      }
      return <div />;
    }

    const dimensions = {
      height: CONSTANTS.THUMBNAIL_HEIGHT,
      width: CONSTANTS.THUMBNAIL_WIDTH,
    };
    const dropzoneOptions = {
      url: this.props.createFileApiUrl,
      method: this.props.createFileApiMethod,
      paramName: 'Upload',
      clickable: '#upload-button',
    };

    const securityID = this.props.securityId;
    const canEdit = this.props.folder.canEdit;

    const selectableItem = this.props.type === 'admin';
    const galleryClasses = [
      'panel', 'panel--padded', 'panel--scrollable', 'gallery__main',
    ];
    if (this.props.dialog) {
      galleryClasses.push('gallery__main--dialog');
    }

    return (
      <div className="flexbox-area-grow gallery__outer">
        {this.renderBulkActions()}

        <div className={galleryClasses.join(' ')}>
          {this.renderSort()}

          {this.renderToolbar()}

          <Dropzone
            canUpload={canEdit}
            handleAddedFile={this.handleAddedFile}
            handleError={this.handleFailedUpload}
            handleSuccess={this.handleSuccessfulUpload}
            handleSending={this.handleSending}
            handleUploadProgress={this.handleUploadProgress}
            preview={dimensions}
            folderId={this.props.folderId}
            options={dropzoneOptions}
            securityID={securityID}
            uploadButton={false}
          >

            <div className="gallery__folders">
              {this.props.files.map((file, i) => (
                (file.type === 'folder')
                  ? (
                  <GalleryItem
                    key={i}
                    item={file}
                    selectable={selectableItem}
                    selected={this.itemIsSelected(file.id)}
                    highlighted={this.itemIsHighlighted(file.id)}
                    handleDelete={this.handleItemDelete}
                    handleToggleSelect={this.handleToggleSelect}
                    handleActivate={this.handleFolderActivate}
                  />
                )
                  : null
              ))}
            </div>

            <div className="gallery__files">
              {this.props.queuedFiles.items.map((file, i) => (
                <GalleryItem
                  key={`queued_file_${i}`}
                  item={file}
                  selectable={selectableItem}
                  selected={this.itemIsSelected(file.id)}
                  highlighted={this.itemIsHighlighted(file.id)}
                  handleDelete={this.handleItemDelete}
                  handleActivate={this.handleFileActivate}
                  handleCancelUpload={this.handleCancelUpload}
                  handleRemoveErroredUpload={this.handleRemoveErroredUpload}
                  message={file.message}
                  uploading
                />
              ))}
              {this.props.files.map((file, i) => (
                (file.type !== 'folder')
                  ? (
                  <GalleryItem
                    key={`file_${i}`}
                    item={file}
                    selectable={selectableItem}
                    selected={this.itemIsSelected(file.id)}
                    highlighted={this.itemIsHighlighted(file.id)}
                    handleDelete={this.handleItemDelete}
                    handleToggleSelect={this.handleToggleSelect}
                    handleActivate={this.handleFileActivate}
                  />
                )
                  : null
              ))}
            </div>

            {this.getNoItemsNotice()}

            <div className="gallery__load">
              {this.getMoreButton()}
            </div>
          </Dropzone>
        </div>
      </div>
    );
  }
}

Gallery.defaultProps = {
  type: 'admin',
};

Gallery.propTypes = {
  dialog: PropTypes.boolean,
  fileId: PropTypes.number,
  folderId: PropTypes.number.isRequired,
  folder: PropTypes.shape({
    id: PropTypes.number,
    parentID: PropTypes.number,
    canView: PropTypes.bool,
    canEdit: PropTypes.bool,
  }),
  queuedFiles: PropTypes.shape({
    items: PropTypes.array.isRequired,
  }),
  onOpenFile: PropTypes.func.isRequired,
  onOpenFolder: PropTypes.func.isRequired,
  onSort: PropTypes.func,
  createFileApiUrl: PropTypes.string,
  createFileApiMethod: PropTypes.string,
  createFolderApi: PropTypes.func,
  readFolderApi: PropTypes.func,
  deleteApi: PropTypes.func,
  actions: PropTypes.object,
  sort: PropTypes.string,
  type: PropTypes.oneOf(['insert', 'admin']),
  limit: PropTypes.number,
  page: PropTypes.number,

  loading: PropTypes.bool,
  count: PropTypes.number,
  files: PropTypes.array, // all files as full objects (incl. ids)
  selectedFiles: PropTypes.arrayOf(PropTypes.number), // ids only
  errorMessage: PropTypes.string,
  securityId: PropTypes.string,
};

function mapStateToProps(state) {
  const {
    loading,
    count,
    files,
    selectedFiles,
    errorMessage,
  } = state.assetAdmin.gallery;

  return {
    loading,
    count,
    files,
    selectedFiles,
    errorMessage,
    queuedFiles: state.assetAdmin.queuedFiles,
    securityId: state.config.SecurityID,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: bindActionCreators(galleryActions, dispatch),
      queuedFiles: bindActionCreators(queuedFilesActions, dispatch),
    },
  };
}

export { Gallery };

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);

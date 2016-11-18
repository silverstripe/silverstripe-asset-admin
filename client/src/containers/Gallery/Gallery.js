// TODO pull out jQuery library to separate HOC
import $ from 'jQuery';
import i18n from 'i18n';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AssetDropzone from 'components/AssetDropzone/AssetDropzone';
import BulkActions from 'components/BulkActions/BulkActions';
import GalleryViewTile from 'containers/GalleryViewTile/GalleryViewTile';
import GalleryViewTable from 'containers/GalleryViewTable/GalleryViewTable';
import CONSTANTS from 'constants/index';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as queuedFilesActions from 'state/queuedFiles/QueuedFilesActions';

/**
 * List of sorters for tile view, required here because it's rendered outside the tile view
 * component
 *
 * @type {array} sorters
 */
const sorters = [
  {
    field: 'title',
    direction: 'asc',
    label: i18n._t('AssetAdmin.FILTER_TITLE_ASC', 'title a-z'),
  },
  {
    field: 'title',
    direction: 'desc',
    label: i18n._t('AssetAdmin.FILTER_TITLE_DESC', 'title z-a'),
  },
  {
    field: 'created',
    direction: 'desc',
    label: i18n._t('AssetAdmin.FILTER_DATE_DESC', 'newest'),
  },
  {
    field: 'created',
    direction: 'asc',
    label: i18n._t('AssetAdmin.FILTER_DATE_ASC', 'oldest'),
  },
];

class Gallery extends Component {

  constructor(props) {
    super(props);

    this.handleOpenFolder = this.handleOpenFolder.bind(this);
    this.handleOpenFile = this.handleOpenFile.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectSort = this.handleSelectSort.bind(this);
    this.handleAddedFile = this.handleAddedFile.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.handleRemoveErroredUpload = this.handleRemoveErroredUpload.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleSending = this.handleSending.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
    this.handleSuccessfulUpload = this.handleSuccessfulUpload.bind(this);
    this.handleFailedUpload = this.handleFailedUpload.bind(this);
    this.handleCreateFolder = this.handleCreateFolder.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.renderNoItemsNotice = this.renderNoItemsNotice.bind(this);
  }

  componentDidMount() {
    // load contents when mounted
    this.refreshFolderIfNeeded(null, this.props);
  }

  componentWillReceiveProps(nextProps) {
    // turn off chosen.js
    if (nextProps.view !== 'tile') {
      const $select = this.getSortElement();

      $select.off('change');
    }

    // check if contents need a refresh
    this.refreshFolderIfNeeded(this.props, nextProps);
  }

  componentDidUpdate() {
    // turn on chosen if required
    if (this.props.view === 'tile') {
      const $select = this.getSortElement();

      // We opt-out of letting the CMS handle Chosen because it doesn't
      // re-apply the behaviour correctly.
      // So after the gallery has been rendered we apply Chosen.
      $select.chosen({
        allow_single_deselect: true,
        disable_search_threshold: 20,
      });

      // Chosen stops the change event from reaching React so we have to simulate a click.
      $select.on('change', () => ReactTestUtils.Simulate.click($select.find(':selected')[0]));
    }

    this.checkLoadingIndicator();
  }

  componentWillUnmount() {
    // clear existing folder content, so behaviour of component is predictable for the Modal
    this.props.actions.gallery.unloadFolderContents();
  }

  /**
   * Gets the element which represents the sorter dropdown for jQuery plugin usage
   *
   * @returns {jQuery}
   */
  getSortElement() {
    return $(ReactDOM.findDOMNode(this)).find('.gallery__sort .dropdown');
  }

  /**
   * Required anti-pattern, because `.cms-content` is the container for the React component.
   *
   * Adds or removes the load class from `.cms-content` if it is for the AssetAdmin
   */
  checkLoadingIndicator() {
    const $sectionWrapper = $('.cms-content.AssetAdmin');

    if (this.props.loading) {
      $sectionWrapper.addClass('loading');
    } else {
      $sectionWrapper.removeClass('loading');
    }
  }

  /**
   * Checks if key properties were changed and if they have then start a request to get new data
   * from the server.
   * Properties are:
   *    - folderId
   *    - limit
   *    - page
   *    - sort
   *
   * @param {object} prevProps
   * @param {object} nextProps
   */
  refreshFolderIfNeeded(prevProps, nextProps) {
    if (!prevProps
      || nextProps.folderId !== prevProps.folderId
      || nextProps.limit !== prevProps.limit
      || nextProps.page !== prevProps.page
      || nextProps.sort !== prevProps.sort
    ) {
      // TODO move this to AssetAdmin, anti-pattern for child to set props/state for parent
      this.props.actions.gallery.deselectFiles();
      this.props.actions.gallery.loadFolderContents(
        nextProps.readFolderApi,
        nextProps.folderId,
        nextProps.limit,
        nextProps.page,
        nextProps.sort
      );
    }
  }

  /**
   * Handler for when the user changes the sort order
   *
   * @param {string} value
   */
  handleSort(value) {
    this.props.actions.queuedFiles.purgeUploadQueue();
    this.props.onSort(value);
    // this will flow round to `componentWillReceiveProps` and update sort there.
  }

  /**
   * Handler for when the sorter dropdown value is changed
   *
   * @param {Event} event
   */
  handleSelectSort(event) {
    this.handleSort(event.currentTarget.value);
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
   * Handles removing an upload and cancelling the request made to upload
   *
   * @param {object} fileData
   */
  handleCancelUpload(fileData) {
    fileData.xhr.abort();
    this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedId);
  }

  /**
   * Handles removing an upload that had errored during/after upload
   *
   * @param {object} fileData
   */
  handleRemoveErroredUpload(fileData) {
    this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedId);
  }

  /**
   * Handler for when a file was added to be uploaded
   *
   * @param {object} fileData
   */
  handleAddedFile(fileData) {
    this.props.actions.queuedFiles.addQueuedFile(fileData);
  }

  /**
   * Triggered just before the xhr request is sent.
   *
   * @param {Object} fileData - File interface.
   *      See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {Object} xhr
   */
  handleSending(file, xhr) {
    this.props.actions.queuedFiles.updateQueuedFile(file._queuedId, { xhr });
  }

  handleUploadProgress(file, progress) {
    this.props.actions.queuedFiles.updateQueuedFile(file._queuedId, { progress });
  }

  /**
   * Handler for when the user changes clicks the add folder button
   *
   * @param {Event} event
   */
  handleCreateFolder(event) {
    const folderName = this.promptFolderName();
    if (folderName !== null) {
      this.props.actions.gallery.createFolder(this.props.createFolderApi, this.props.folderId, folderName)
        .then(data => {
          this.refreshFolderIfNeeded(null, this.props);
          return data;
        });
    }
    event.preventDefault();
  }

  /**
   * Handles successful file uploads.
   *
   * @param {Object} fileXhr - File interface.
   *      See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  handleSuccessfulUpload(fileXhr) {
    const json = JSON.parse(fileXhr.xhr.response);

    // SilverStripe send back a success code with an error message sometimes...
    if (typeof json[0].error !== 'undefined') {
      this.handleFailedUpload(fileXhr);
      return;
    }

    this.props.actions.queuedFiles.removeQueuedFile(file._queuedId);
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
    this.props.actions.queuedFiles.failUpload(file._queuedId, response);
  }

  /**
   * Prompts for a folder name from the user
   *
   * @return {string|null}
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
  handleOpenFolder(event, folder) {
    event.preventDefault();
    this.props.onOpenFolder(folder.id);
  }

  /**
   * Handles a user activating the file editor.
   *
   * @param {Object} event - Event object.
   * @param {Object} file - The file that's being activated.
   */
  handleOpenFile(event, file) {
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
  handleSelect(event, item) {
    if (this.props.selectedFiles.indexOf(item.id) === -1) {
      this.props.actions.gallery.selectFiles([item.id]);
    } else {
      this.props.actions.gallery.deselectFiles([item.id]);
    }
  }

  /**
   * Handles browsing back/up one folder
   *
   * @param {Event} event
   */
  handleBackClick(event) {
    event.preventDefault();
    this.props.onOpenFolder(this.props.folder.parentID);
  }

  /**
   * Handles changing the view type when the view button is clicked
   *
   * @param event
   */
  handleViewChange(event) {
    const view = event.currentTarget.value;

    this.props.onViewChange(view);
  }

  /**
   * Generates the react components needed for the Sorter part of this component
   *
   * @returns {XML}
   */
  renderSort() {
    if (this.props.view !== 'tile') {
      return null;
    }
    return (
      <div className="gallery__sort fieldholder-small">
        <select
          className="dropdown no-change-track no-chzn"
          tabIndex="0"
          style={{ width: '160px' }}
          defaultValue={this.props.sort}
        >
          {sorters.map((sorter, i) => (
            <option
              key={i}
              onClick={this.handleSelectSort}
              data-field={sorter.field}
              data-direction={sorter.direction}
              value={`${sorter.field},${sorter.direction}`}
            >
              {sorter.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  /**
   * Generates the react components needed for the Toolbar part of this component.
   *
   * @returns {XML}
   */
  renderToolbar() {
    const canEdit = this.props.folder.canEdit;

    return (
      <div className="toolbar--content toolbar--space-save">
        <div className="fill-width">
          <div className="flexbox-area-grow">
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
              className="btn btn-secondary font-icon-folder-add btn--icon-xl"
              type="button"
              onClick={this.handleCreateFolder}
              disabled={!canEdit}
            >
              <span className="btn__text">{i18n._t('AssetAdmin.ADD_FOLDER_BUTTON')}</span>
            </button>
          </div>

          <div className="toolbar__state-buttons">
            {this.renderSort()}
            <div className="btn-group" role="group" aria-label="View mode">
              {this.renderViewChangeButtons()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renders the react component buttons for changing the view that is currently being used
   *
   * @returns {Array} buttons
   */
  renderViewChangeButtons() {
    const views = ['tile', 'table'];
    return views.map((view, index) => {
      const icon = (view === 'table') ? 'list' : 'thumbnails';
      const classNames = [
        'gallery__view-change-button',
        'btn btn-secondary',
        'btn--icon-xl',
      ];

      if (view === this.props.view) {
        return null;
      }
      return (
        <button
          id={`button-view-${view}`}
          key={index}
          className={classNames.join(' ')}
          type="button"
          onClick={this.handleViewChange}
          value={view}
        >
          <span className={`icon font-icon-${icon}`} />
        </button>
      );
    });
  }

  /**
   * Generates the react components needed for the Back button.
   *
   * @returns {XML|null} button
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
   * @returns {XML}
   */
  renderBulkActions() {
    const deleteAction = (items) => {
      const ids = items.map(item => item.id);
      this.props.actions.gallery.deleteItems(this.props.deleteApi, ids);
    };
    const editAction = (items) => {
      this.props.onOpenFile(items[0].id);
    };
    const actions = CONSTANTS.BULK_ACTIONS.map((action) => {
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

  /**
   * Renders the message for when there was no items to display
   *
   * @returns {XML|null}
   */
  renderNoItemsNotice() {
    if (this.props.files.length === 0 && !this.props.loading) {
      return <p className="gallery__no-item-notice">{i18n._t('AssetAdmin.NOITEMSFOUND')}</p>;
    }

    return null;
  }

  /**
   * Renders the core view for this component, the component is determined by the view property
   *
   * @returns {XML}
   */
  renderGalleryView() {
    const GalleryView = (this.props.view === 'table') ? GalleryViewTable : GalleryViewTile;

    const allFiles = this.props.files
      .map((file) => Object.assign({}, file, {
        selected: this.itemIsSelected(file.id),
        highlighted: this.itemIsHighlighted(file.id),
      }));
    const queuedFiles = this.props.queuedFiles.items
      .map((file) => Object.assign({}, file, {
        uploading: true,
      }));
    const files = [
      ...queuedFiles,
      ...allFiles,
    ];
    const {
      type,
      loading,
      page,
      count,
      limit,
      sort,
    } = this.props;

    const props = {
      selectableItems: type === 'admin',
      files,
      loading,
      page,
      count,
      limit,
      sort,
      onSort: this.handleSort,
      onSetPage: this.handleSetPage,
      onOpenFile: this.handleOpenFile,
      onOpenFolder: this.handleOpenFolder,
      onSelect: this.handleSelect,
      onCancelUpload: this.handleCancelUpload,
      onRemoveErroredUpload: this.handleRemoveErroredUpload,
      renderNoItemsNotice: this.renderNoItemsNotice,
    };

    return <GalleryView {...props} />;
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
      return null;
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

    const galleryClasses = [
      'panel', 'panel--padded', 'panel--scrollable', 'gallery__main',
    ];
    if (this.props.type === 'insert') {
      galleryClasses.push('insert-media-modal__main');
    }

    return (
      <div className="flexbox-area-grow gallery__outer">
        {this.renderBulkActions()}

        <AssetDropzone
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

          <div className={galleryClasses.join(' ')}>
            {this.renderToolbar()}

            {this.renderGalleryView()}
          </div>
        </AssetDropzone>
      </div>
    );
  }
}

const sharedDefaultProps = {
  page: 0,
  limit: 15,
  sort: `${sorters[0].field},${sorters[0].direction}`,
};

const sharedPropTypes = {
  loading: PropTypes.bool,
  sort: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    parent: PropTypes.shape({
      id: PropTypes.number,
    }),
  })).isRequired,
  count: PropTypes.number,
  page: PropTypes.number,
  limit: PropTypes.number,
  onOpenFile: PropTypes.func.isRequired,
  onOpenFolder: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onSetPage: PropTypes.func.isRequired,
};

const galleryViewDefaultProps = Object.assign({}, sharedDefaultProps, {
  selectableItems: false,
});

const galleryViewPropTypes = Object.assign({}, sharedPropTypes, {
  selectableItems: PropTypes.bool,
  onSelect: PropTypes.func,
  onCancelUpload: PropTypes.func,
  onRemoveErroredUpload: PropTypes.func,
  renderNoItemsNotice: PropTypes.func.isRequired,
});

Gallery.defaultProps = Object.assign({}, sharedDefaultProps, {
  type: 'admin',
  view: 'tile',
});

Gallery.propTypes = Object.assign({}, sharedPropTypes, {
  type: PropTypes.oneOf(['insert', 'admin']),
  view: PropTypes.oneOf(['tile', 'table']),
  dialog: PropTypes.bool,
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
  selectedFiles: PropTypes.arrayOf(PropTypes.number),
  errorMessage: PropTypes.string,
  actions: PropTypes.object.isRequired,
  securityId: PropTypes.string,
  onViewChange: PropTypes.func.isRequired,

  createFileApiUrl: PropTypes.string,
  createFileApiMethod: PropTypes.string,
  createFolderApi: PropTypes.func,
  readFolderApi: PropTypes.func,
  deleteApi: PropTypes.func,
});

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

export { Gallery, sorters, galleryViewPropTypes, galleryViewDefaultProps };

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);

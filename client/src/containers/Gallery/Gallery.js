import $ from 'jQuery';
import i18n from 'i18n';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTestUtils from 'react-addons-test-utils';
import Dropzone from 'components/Dropzone/Dropzone';
import File from 'components/File/File';
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

export class Gallery extends Component {

  constructor(props) {
    super(props);

    this.sort = 'name';
    this.direction = 'asc';

    this.sorters = [
      {
        field: 'title',
        direction: 'asc',
        label: i18n._t('AssetGalleryField.FILTER_TITLE_ASC'),
      },
      {
        field: 'title',
        direction: 'desc',
        label: i18n._t('AssetGalleryField.FILTER_TITLE_DESC'),
      },
      {
        field: 'created',
        direction: 'desc',
        label: i18n._t('AssetGalleryField.FILTER_DATE_DESC'),
      },
      {
        field: 'created',
        direction: 'asc',
        label: i18n._t('AssetGalleryField.FILTER_DATE_ASC'),
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
    this.handleAddFolder = this.handleAddFolder.bind(this);
  }

  componentDidMount() {
    this.refreshFolderIfNeeded();
  }

  componentWillUpdate() {
    const $select = $(ReactDOM.findDOMNode(this)).find('.gallery__sort .dropdown');
    $select.off('change');
  }

  componentDidUpdate() {
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

    this.refreshFolderIfNeeded();
  }

  getNoItemsNotice() {
    if (this.props.files.length < 1 && this.props.queuedFiles.items.length < 1) {
      return <p className="gallery__no-item-notice">{i18n._t('AssetGalleryField.NOITEMSFOUND')}</p>;
    }

    return null;
  }

  getBackButton() {
    const classes = [
      'btn',
      'btn-secondary',
      'btn--no-text',
      'font-icon-level-up',
      'btn--icon-large',
      'gallery__back',
    ].join(' ');
    if (this.props.parentFolderID !== null) {
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

  getBulkActionsComponent() {
    const deleteAction = (ids) => {
      this.props.actions.gallery.deleteItems(this.props.deleteApi, ids);
    };

    if (this.props.selectedFiles.length > 0 && this.props.bulkActions) {
      return (
        <BulkActions
          deleteAction={deleteAction}
          key={this.props.selectedFiles.length > 0}
        />
      );
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
          {i18n._t('AssetGalleryField.LOADMORE')}
        </button>
      );
    }

    return null;
  }

  refreshFolderIfNeeded() {
    // folderID updates saying "please load", loadedFolderID updates when the ajax request is actually triggered
    if (!isNaN(this.props.folderID) && this.props.folderID >= 0 && this.props.folderID !== this.props.loadedFolderID) {
      this.props.actions.gallery.loadFolderContents(
        this.props.filesByParentApi,
        this.props.folderID,
        this.props.limit,
        this.props.page
      );
    }
  }

  /**
   * Handler for when the user changes the sort order.
   *
   * @param object event - Click event.
   */
  handleSort(event) {
    const data = event.target.dataset;
    this.props.actions.queuedFiles.purgeUploadQueue();
    this.props.actions.gallery.sortFiles(getComparator(data.field, data.direction));
  }

  handleCancelUpload(fileData) {
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
   * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param object xhr
   * @param object formData - FormData interface. See https://developer.mozilla.org/en-US/docs/Web/API/FormData
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
   * @param object event - Click event.
   */
  handleAddFolder() {
    // eslint-disable-next-line no-alert
    const folderName = prompt('Folder name (or blank to cancel)');
    if (folderName) {
      this.props.actions.gallery.addFolder(this.props.addFolderApi, this.props.folderID, folderName);
    }
  }


  /**
   * Handles successful file uploads.
   *
   * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
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
  }

  handleFailedUpload(file) {
    this.props.actions.queuedFiles.failUpload(file._queuedAtTime);
  }

  /**
   * Handles deleting a file or folder.
   *
   * @param object item - The file or folder to delete.
   */
  handleItemDelete(event, item) {
    // eslint-disable-next-line no-alert
    if (confirm(i18n._t('AssetGalleryField.CONFIRMDELETE'))) {
      this.props.actions.gallery.deleteItems(this.props.deleteApi, [item.id]);
    }
  }

  /**
   * Checks if a file or folder is currently selected.
   *
   * @param number id - The id of the file or folder to check.
   * @return boolean
   */
  itemIsSelected(id) {
    return this.props.selectedFiles.indexOf(id) > -1;
  }

  /**
   * Handles a user drilling down into a folder.
   *
   * @param object event - Event object.
   * @param object folder - The folder that's being activated.
   */
  handleFolderActivate(event, folder) {
    this.props.actions.gallery.show(folder.id);
  }

  /**
   * Handles a user activating the file editor.
   *
   * @param object event - Event object.
   * @param object file - The file that's being activated.
   */
  handleFileActivate(event, file) {
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
   * @param object event - Event object.
   * @param object item - The item being selected/deselected
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
    this.props.actions.gallery.show(this.props.parentFolderID);
  }

  render() {
    if (!this.props.visible) return null;

    const dropzoneOptions = {
      // Hardcoded placeholder until we have a backend
      url: 'admin/assets/EditForm/field/Upload/upload',
      paramName: 'Upload',
      clickable: '#upload-button',
    };
    const securityID = $(':input[name=SecurityID]').val();
    const canEdit = this.props.canEdit;

    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName="gallery__bulk-actions"
          transitionEnterTimeout={CONSTANTS.CSS_TRANSITION_TIME}
          transitionLeaveTimeout={CONSTANTS.CSS_TRANSITION_TIME}
        >
          {this.getBulkActionsComponent()}
        </ReactCSSTransitionGroup>
        <div className="gallery__sort fieldholder-small">
          <select
            className="dropdown no-change-track no-chzn"
            tabIndex="0"
            style={{ width: '160px' }}
          >
            {this.sorters.map((sorter, i) =>
              (
                <option
                  key={i}
                  onClick={this.handleSort}
                  data-field={sorter.field}
                  data-direction={sorter.direction}
                >
                  {sorter.label}
                </option>
              )
            )}
          </select>
        </div>

        <div className="toolbar--content">
          {this.getBackButton()}

          <button
            id="add-folder-button"
            className="btn btn-secondary font-icon-folder-add btn--icon-xl"
            type="button"
            onClick={this.handleAddFolder}
            disabled={!canEdit}
          >
            {i18n._t('AssetGalleryField.ADD_FOLDER_BUTTON')}
          </button>

          <button
            id="upload-button"
            className="btn btn-secondary font-icon-upload btn--icon-xl"
            type="button"
            disabled={!canEdit}
          >
            {i18n._t('AssetGalleryField.DROPZONE_UPLOAD')}
          </button>
        </div>

        <Dropzone
          canUpload={canEdit}
          handleAddedFile={this.handleAddedFile}
          handleError={this.handleFailedUpload}
          handleSuccess={this.handleSuccessfulUpload}
          handleSending={this.handleSending}
          handleUploadProgress={this.handleUploadProgress}
          folderID={this.props.folderID}
          options={dropzoneOptions}
          securityID={securityID}
          uploadButton={false}
        >

          <div className="gallery__folders">
            {this.props.files.map((file, i) => {
              let component;
              if (file.type === 'folder') {
                component = (<File
                  key={i}
                  item={file}
                  selected={this.itemIsSelected(file.id)}
                  handleDelete={this.handleItemDelete}
                  handleToggleSelect={this.handleToggleSelect}
                  handleActivate={this.handleFolderActivate}
                />);
              }
              return component;
            })}
          </div>

          <div className="gallery__files">
            {this.props.queuedFiles.items.map((file, i) =>
              (<File
                key={`queued_file_${i}`}
                item={file}
                selected={this.itemIsSelected(file.id)}
                handleDelete={this.handleItemDelete}
                handleToggleSelect={this.handleToggleSelect}
                handleActivate={this.handleFileActivate}
                handleCancelUpload={this.handleCancelUpload}
                handleRemoveErroredUpload={this.handleRemoveErroredUpload}
                messages={file.messages}
                uploading
              />)
            )}
            {this.props.files.map((file, i) => {
              let component;
              if (file.type !== 'folder') {
                component = (<File
                  key={`file_${i}`}
                  item={file}
                  selected={this.itemIsSelected(file.id)}
                  handleDelete={this.handleItemDelete}
                  handleToggleSelect={this.handleToggleSelect}
                  handleActivate={this.handleFileActivate}
                />);
              }
              return component;
            })}
          </div>

          {this.getNoItemsNotice()}

          <div className="gallery__load">
            {this.getMoreButton()}
          </div>
        </Dropzone>
      </div>
    );
  }
}

Gallery.propTypes = {
  visible: React.PropTypes.bool,

  files: React.PropTypes.array,
  count: React.PropTypes.number,
  folderID: React.PropTypes.number.isRequired,
  loadedFolderID: React.PropTypes.number,
  parentFolderID: React.PropTypes.number,
  selectedFiles: React.PropTypes.array,
  bulkActions: React.PropTypes.bool,
  limit: React.PropTypes.number,
  page: React.PropTypes.number,

  queuedFiles: React.PropTypes.shape({
    items: React.PropTypes.array.isRequired,
  }),

  onOpenFile: React.PropTypes.func.isRequired,

  addFolderApi: React.PropTypes.func,
  deleteApi: React.PropTypes.func,
  filesByParentApi: React.PropTypes.func,

  actions: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    visible: state.assetAdmin.gallery.visible,

    files: state.assetAdmin.gallery.files,
    count: state.assetAdmin.gallery.count,
    folderID: state.assetAdmin.gallery.folderID,
    loadedFolderID: state.assetAdmin.gallery.loadedFolderID,
    parentFolderID: state.assetAdmin.gallery.parentFolderID,
    selectedFiles: state.assetAdmin.gallery.selectedFiles,
    page: state.assetAdmin.gallery.page,
    canEdit: state.assetAdmin.gallery.canEdit,
    canDelete: state.assetAdmin.gallery.canDelete,

    queuedFiles: state.assetAdmin.queuedFiles,
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

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);

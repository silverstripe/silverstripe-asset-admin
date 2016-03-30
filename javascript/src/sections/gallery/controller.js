import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTestUtils from 'react-addons-test-utils';
import DropzoneComponent from 'components/dropzone/index';
import FileComponent from 'components/file/index';
import BulkActionsComponent from 'components/bulk-actions/index';
import SilverStripeComponent from 'silverstripe-component';
import CONSTANTS from 'constants/index';
import * as galleryActions from 'state/gallery/actions';
import * as queuedFilesActions from 'state/queued-files/actions';

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

export class GalleryContainer extends SilverStripeComponent {

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

  getNoItemsNotice() {
    if (this.props.gallery.count < 1 && this.props.queuedFiles.items.length < 1) {
      return <p className="gallery__no-item-notice">{i18n._t('AssetGalleryField.NOITEMSFOUND')}</p>;
    }

    return null;
  }

  getBackButton() {
    const classes = [
      'gallery__back',
      'ss-ui-button',
      'ui-button',
      'ui-widget',
      'ui-state-default',
      'ui-corner-all',
      'font-icon-level-up',
      'no-text',
    ].join(' ');
    if (this.props.gallery.parentFolderID !== null) {
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
    if (this.props.gallery.selectedFiles.length > 0 && this.props.backend.bulkActions) {
      return (
        <BulkActionsComponent
          backend={this.props.backend}
          key={this.props.gallery.selectedFiles.length > 0}
        />
      );
    }

    return null;
  }

  getMoreButton() {
    if (this.props.gallery.count > this.props.gallery.files.length) {
      return (
        <button
          className="gallery__load__more"
          onClick={this.handleMoreClick}
        >
          {i18n._t('AssetGalleryField.LOADMORE')}
        </button>
      );
    }

    return null;
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

  render() {
    const dropzoneOptions = {
      // Hardcoded placeholder until we have a backend
      url: 'admin/assets/EditForm/field/Upload/upload',
      paramName: 'Upload',
      clickable: '#upload-button',
    };

    const securityID = $(':input[name=SecurityID]').val();

    // TODO Make "add folder" and "upload" buttons conditional on permissions
    return (
      <div>
        {this.getBackButton()}
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

        <button id="add-folder-button" className="gallery__upload [ ss-ui-button font-icon-folder-add ]" type="button">
          {i18n._t('AssetGalleryField.ADD_FOLDER_BUTTON')}
        </button>

        <button id="upload-button" className="gallery__upload [ ss-ui-button font-icon-upload ]" type="button">
          {i18n._t('AssetGalleryField.DROPZONE_UPLOAD')}
        </button>

        <DropzoneComponent
          handleAddedFile={this.handleAddedFile}
          handleError={this.handleFailedUpload}
          handleSuccess={this.handleSuccessfulUpload}
          handleSending={this.handleSending}
          handleUploadProgress={this.handleUploadProgress}
          folderID={this.props.gallery.folderID}
          options={dropzoneOptions}
          securityID={securityID}
          uploadButton={false}
        >

          <div className="gallery__folders">
            {this.props.gallery.files.map((file, i) => {
              let component;
              if (file.type === 'folder') {
                component = (<FileComponent
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
              (<FileComponent
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
            {this.props.gallery.files.map((file, i) => {
              let component;
              if (file.type !== 'folder') {
                component = (<FileComponent
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
        </DropzoneComponent>
      </div>
    );
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
    this.props.actions.gallery.addFiles(json, this.props.gallery.count + 1);
  }

  handleFailedUpload(file) {
    this.props.actions.queuedFiles.failUpload(file._queuedAtTime);
  }

  handleEnterRoute(ctx, next) {
    let viewingFolder = false;

    const folderID = ctx.params.id || 0;
    const folderPath = CONSTANTS.FOLDER_ROUTE.replace(':id?', folderID);

    if (ctx.params.action === 'show' && ctx.params.id !== 0) {
      viewingFolder = true;
    }

    this.props.actions.gallery.setViewingFolder(viewingFolder);
    this.props.actions.gallery.deselectFiles();
    this.props.actions.gallery.removeFiles();
    this.props.actions.gallery.setPath(folderPath);

    this.props.backend.getFilesByParentID(folderID);

    next();
  }

  /**
   * Handles deleting a file or folder.
   *
   * @param object item - The file or folder to delete.
   */
  handleItemDelete(event, item) {
    // eslint-disable-next-line no-alert
    if (confirm(i18n._t('AssetGalleryField.CONFIRMDELETE'))) {
      this.props.backend.delete(item.id);
    }
  }

  /**
   * Checks if a file or folder is currently selected.
   *
   * @param number id - The id of the file or folder to check.
   * @return boolean
   */
  itemIsSelected(id) {
    return this.props.gallery.selectedFiles.indexOf(id) > -1;
  }

  /**
   * Handles a user drilling down into a folder.
   *
   * @param object event - Event object.
   * @param object folder - The folder that's being activated.
   */
  handleFolderActivate(event, folder) {
    window.ss.router.show(CONSTANTS.FOLDER_ROUTE.replace(':id?', folder.id));
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

    this.props.actions.gallery.setEditing(file);
    window.ss.router.show(CONSTANTS.EDITING_ROUTE.replace(':id', file.id));
  }

  /**
   * Handles the user toggling the selected/deselected state of a file or folder.
   *
   * @param object event - Event object.
   * @param object item - The item being selected/deselected
   */
  handleToggleSelect(event, item) {
    if (this.props.gallery.selectedFiles.indexOf(item.id) === -1) {
      this.props.actions.gallery.selectFiles([item.id]);
    } else {
      this.props.actions.gallery.deselectFiles([item.id]);
    }
  }

  handleMoreClick(event) {
    event.stopPropagation();
    event.preventDefault();
    this.props.backend.more();
  }

  handleBackClick(event) {
    event.preventDefault();
    window.ss.router.show(CONSTANTS.FOLDER_ROUTE.replace(':id?', this.props.gallery.parentFolderID));
  }
}

GalleryContainer.propTypes = {
  backend: React.PropTypes.object.isRequired,
  gallery: React.PropTypes.shape({
    folderID: React.PropTypes.number.isRequired,
  }),
  queuedFiles: React.PropTypes.shape({
    items: React.PropTypes.array.isRequired,
  }),
};

function mapStateToProps(state) {
  return {
    gallery: state.assetAdmin.gallery,
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

export default connect(mapStateToProps, mapDispatchToProps)(GalleryContainer);

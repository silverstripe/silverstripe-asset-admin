// TODO pull out jQuery library to separate HOC
import $ from 'jquery';
import i18n from 'i18n';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import AssetDropzone from 'components/AssetDropzone/AssetDropzone';
import BulkActions from 'components/BulkActions/BulkActions';
import ThumbnailView from 'containers/ThumbnailView/ThumbnailView';
import TableView from 'containers/TableView/TableView';
import CONSTANTS from 'constants/index';
import FormAlert from 'components/FormAlert/FormAlert';
import BackButton from 'components/BackButton/BackButton';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as queuedFilesActions from 'state/queuedFiles/QueuedFilesActions';
import createFolderMutation from 'state/files/createFolderMutation';
import moveFilesMutation from 'state/files/moveFilesMutation';
import { withApollo } from 'react-apollo';
import GalleryDND from './GalleryDND';

/**
 * List of sorters for tile view, required here because it's rendered outside the tile view
 * component
 *
 * @todo Use lowercase identifiers once we can map them in the silverstripe/graphql module
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
    field: 'lastEdited',
    direction: 'desc',
    label: i18n._t('AssetAdmin.FILTER_DATE_DESC', 'newest'),
  },
  {
    field: 'lastEdited',
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
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleEnableDropzone = this.handleEnableDropzone.bind(this);
    this.handleMoveFiles = this.handleMoveFiles.bind(this);
    this.handleBulkDelete = this.handleBulkDelete.bind(this);
    this.handleBulkEdit = this.handleBulkEdit.bind(this);
  }

  componentDidMount() {
    this.initSortDropdown();
  }

  componentWillReceiveProps(nextProps) {
    // turn off chosen.js
    if (nextProps.view !== 'tile') {
      const $select = this.getSortElement();

      $select.off('change');
    }

    // If props.files has changed, flush any uploaded files.
    // The render() logic will merge queuedFiles into the props.files array
    // until this is called, leaving completed uploads temporarily in the current view,
    // even if they're technically not part of props.files.
    if (!this.compareFiles(this.props.files, nextProps.files)) {
      nextProps.actions.queuedFiles.purgeUploadQueue();
    }

    this.checkLoadingIndicator(nextProps);
  }

  componentDidUpdate() {
    this.initSortDropdown();
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
   * Compose the search critia into a human readable message
   *
   * @param {object} search
   * @returns {string}
   */
  getSearchMessage(filters) {
    const messages = [];
    if (filters.name) {
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGEKEYWORDS',
        'with keywords \'{name}\''
      ));
    }

    if (filters.lastEditedFrom && filters.lastEditedTo) {
      // TODO Date localisation
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGEEDITEDBETWEEN',
        'last edited between \'{lastEditedFrom}\' and \'{lastEditedTo}\''
      ));
    } else if (filters.lastEditedFrom) {
      // TODO Date localisation
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGEEDITEDFROM',
        'last edited after \'{lastEditedFrom}\''
      ));
    } else if (filters.lastEditedTo) {
      // TODO Date localisation
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGEEDITEDTO',
        'last edited before \'{lastEditedTo}\''
      ));
    }

    if (filters.appCategory) {
      // TODO Category name localisation
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGECATEGORY',
        'categorised as \'{appCategory}\''
      ));
    }

    if (filters.currentFolderOnly) {
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGELIMIT',
        'limited to the folder \'{folder}\''
      ));
    }

    const parts = [
      messages.slice(0, -1).join(`${i18n._t('AssetAdmin.JOIN', ',')} `),
      messages.slice(-1),
    ].filter((part) => part).join(` ${i18n._t('AssetAdmin.JOINLAST', 'and')} `);

    if (parts === '') {
      return '';
    }

    const searchResults = {
      parts: i18n.inject(parts, Object.assign(
        { folder: this.props.folder.title },
        filters,
        { appCategory: filters.appCategory ? filters.appCategory.toLowerCase() : undefined }
      )),
    };

    return i18n.inject(
      i18n._t('AssetAdmin.SEARCHRESULTSMESSAGE', 'Search results {parts}'),
      searchResults
    );
  }

  /**
   * Required anti-pattern, because `.cms-content` is the container for the React component.
   *
   * Adds or removes the load class from `.cms-content` if it is for the AssetAdmin
   *
   * @param {Object} props
   */
  checkLoadingIndicator(props) {
    const $sectionWrapper = $('.cms-content.AssetAdmin');
    if (!$sectionWrapper.length) {
      return;
    }

    if (props.loading) {
      $sectionWrapper.addClass('loading');
    } else {
      $sectionWrapper.removeClass('loading');
    }
  }

  /**
   * Compare two lists to see if equal
   *
   * @param {Array} left
   * @param {Array} right
   * @return {Boolean} isEqual
   */
  compareFiles(left, right) {
    if ((left && !right) || (!left && right)) {
      return false;
    }
    if (left.length !== right.length) {
      return false;
    }
    for (let i = 0; i < left.length; i++) {
      if (left[i].id !== right[i].id) {
        return false;
      }
    }
    return true;
  }

  initSortDropdown() {
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
    if (typeof this.props.onCreateFolder === 'function') {
      this.props.onCreateFolder();
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

    this.props.actions.queuedFiles.succeedUpload(fileXhr._queuedId, json[0]);

    // TODO Update GraphQL store with new model,
    // see https://github.com/silverstripe/silverstripe-graphql/issues/14
    if (this.props.onSuccessfulUpload) {
      this.props.onSuccessfulUpload(json);
    }

    // redirect to open the last uploaded file for 'insert/select modal' type only
    if (this.props.type !== 'admin'
      && !this.props.fileId
      && this.props.queuedFiles.items.length === 0
    ) {
      const lastFile = json.pop();
      this.props.onOpenFile(lastFile.id);
    }
  }

  handleFailedUpload(fileXhr, response) {
    this.props.actions.queuedFiles.failUpload(fileXhr._queuedId, response);
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
   * Check if the gallery has an opened (for editing) item
   *
   * @return {Boolean}
   */
  hasOpenedItem() {
    return !!this.props.fileId;
  }

  handleClearSearch(event) {
    this.handleOpenFolder(event, this.props.folder);
  }

  /**
   * Handles a user drilling down into a folder.
   *
   * @param {Object} event - Event object.
   * @param {Object} folder - The folder that's being activated.
   */
  handleOpenFolder(event, folder) {
    event.preventDefault();
    this.props.actions.gallery.setErrorMessage(null);
    this.props.actions.gallery.setNoticeMessage(null);
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
    this.props.onOpenFolder(this.props.folder.parentId);
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

  handleEnableDropzone(enabled) {
    this.props.actions.gallery.setEnableDropzone(enabled);
  }

  handleMoveFiles(folderId, fileIds) {
    this.props.actions.files.moveFiles(folderId, fileIds)
      .then(() => {
        const duration = CONSTANTS.MOVE_SUCCESS_DURATION;
        const message = `+${fileIds.length}`;

        this.props.actions.gallery.setFileBadge(folderId, message, 'success', duration);

        if (typeof this.props.onMoveFilesSuccess === 'function') {
          this.props.onMoveFilesSuccess(folderId, fileIds);
        }
      });
  }

  handleBulkDelete(items) {
    return Promise.all(items.map(item => {
      // If the file was just uploaded, it doesn't exist in the files list,
      // and has to be removed from the queue instead.
      if (item.queuedId) {
        this.props.actions.queuedFiles.removeQueuedFile(item.queuedId);
        return Promise.resolve(true);
      }

// parent handle the files list
      return this.props.onDelete(item.id).then(() => true).catch(() => false);
    }))
      .then((deletes) => {
        const successes = deletes.filter((result) => result).length;

        if (successes !== deletes.length) {
          this.props.actions.gallery.setErrorMessage(
            i18n.sprintf(
              i18n._t('AssetAdmin.BULK_ACTIONS_DELETE_FAIL'),
              successes,
              deletes.length - successes
            )
          );
          this.props.actions.gallery.setNoticeMessage(null);
        } else {
          this.props.actions.gallery.setNoticeMessage(
            i18n.sprintf(
              i18n._t('AssetAdmin.BULK_ACTIONS_DELETE_SUCCESS'),
              successes
            )
          );
          this.props.actions.gallery.setErrorMessage(null);
        }
      });
  }

  handleBulkEdit(items) {
    this.props.onOpenFile(items[0].id);
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

          <div className="gallery__state-buttons">
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
   * Render the form search notification
   *
   * @return {XML}
   */
  renderSearchAlert() {
    const filters = this.props.filters;
    if (!filters || Object.keys(filters).length === 0) {
      return null;
    }

    const message = this.getSearchMessage(filters);

    if (message === '') {
      return null;
    }

    const body = (
      <div>
        <button
          onClick={this.handleClearSearch}
          className="btn btn-info font-icon-cancel form-alert__btn--right"
        >
          {i18n._t('AssetAdmin.SEARCHCLEARRESULTS', 'Clear results')}
        </button>
        {message}
      </div>
    );

    return <FormAlert value={{ react: body }} type="warning" />;
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
        'btn--icon-sm',
        'btn--no-text',
      ];

      if (view === this.props.view) {
        return null;
      }
      classNames.push(`font-icon-${icon}`);
      return (
        <button
          id={`button-view-${view}`}
          key={index}
          className={classNames.join(' ')}
          type="button"
          title="Change view gallery/list"
          onClick={this.handleViewChange}
          value={view}
        >
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
    const itemId = this.props.folder.parentId;
    if (itemId !== null) {
      const badge = this.props.badges.find((item) => item.id === itemId);
      return (
        <div className="gallery__back-container">
          <BackButton
            item={{ id: itemId }}
            onClick={this.handleBackClick}
            onDropFiles={this.handleMoveFiles}
            badge={badge}
          />
        </div>
      );
    }
    return null;
  }

  /**
   * Generates the react component that wraps around the actual bulk actions
   * and provides transition effect.
   *
   * @returns {XML}
   */
  renderTransitionBulkActions() {
    if (this.props.type === 'admin') {
      return (
        <ReactCSSTransitionGroup
          transitionName="bulk-actions"
          transitionEnterTimeout={CONSTANTS.CSS_TRANSITION_TIME}
          transitionLeaveTimeout={CONSTANTS.CSS_TRANSITION_TIME}
        >
          {this.renderBulkActions()}
        </ReactCSSTransitionGroup>
      );
    }

    return null;
  }

  /**
   * Generates the react components needed for the BulkActions part of this
   * component.
   *
   * @returns {XML}
   */
  renderBulkActions() {
    const actions = CONSTANTS.BULK_ACTIONS.map((action) => {
      if (!action.callback) {
        switch (action.value) {
          case 'delete': {
            return Object.assign({}, action, { callback: this.handleBulkDelete });
          }
          case 'edit': {
            return Object.assign({}, action, { callback: this.handleBulkEdit });
          }
          default: {
            return action;
          }
        }
      }
      return action;
    });

    // Bulk actions can happen for both queuedFiles (after they've completed the upload),
    // and the actual props.files in the current view.
    // TODO Refactor "queued files" into separate visual area and remove coupling here
    const allFiles = [...this.props.files, ...this.props.queuedFiles.items];
    const selectedFileObjs = this.props.selectedFiles.map(id => allFiles.find(file => file && id === file.id));

    if (selectedFileObjs.length > 0 && this.props.type === 'admin') {
      return (<BulkActions
        actions={actions}
        items={selectedFileObjs}
        key={selectedFileObjs.length > 0}
      />);
    }

    return null;
  }

  /**
   * Renders the core view for this component, the component is determined by the view property
   *
   * @returns {XML}
   */
  renderGalleryView() {
    const GalleryView = (this.props.view === 'table') ? TableView : ThumbnailView;

    const queuedFiles = this.props.queuedFiles.items
      .filter((file) => (
        // Exclude uploaded files that have been reloaded via graphql
        !file.id || !this.props.files.find((next) => (next.id === file.id))
      ))
      .map((file) => Object.assign({}, file, {
        // Queued files get removed in componentWillReceiveProps when the props.files array has changed identity,
        // which will also get rid of this flag. But intermediary render calls *after* upload might still
        // show queued files with successful uploads, hence we determine uploading status by absence of a database id.
        uploading: !(file.id > 0),
      }));
    const files = [
      // Always sort uploaded files first, even if they wouldn't show up in
      // this pagination page. They'll disappear on the next refetch() or navigation event.
      ...queuedFiles,
      ...this.props.files,
    ].map((file) => Object.assign({}, file || {}, {
      selected: this.itemIsSelected(file.id),
      highlighted: this.itemIsHighlighted(file.id),
    }));
    const {
      type,
      loading,
      page,
      totalCount,
      limit,
      sort,
      selectedFiles,
      badges,
    } = this.props;

    const props = {
      selectableItems: type === 'admin',
      files,
      loading,
      page,
      totalCount,
      limit,
      sort,
      selectedFiles,
      badges,
      onSort: this.handleSort,
      onSetPage: this.handleSetPage,
      onOpenFile: this.handleOpenFile,
      onOpenFolder: this.handleOpenFolder,
      onSelect: this.handleSelect,
      onCancelUpload: this.handleCancelUpload,
      onDropFiles: this.handleMoveFiles,
      onRemoveErroredUpload: this.handleRemoveErroredUpload,
      onEnableDropzone: this.handleEnableDropzone,
    };

    return <GalleryView {...props} />;
  }

  render() {
    if (!this.props.folder) {
      if (this.props.errorMessage) {
        return (
          <div className="gallery__error flexbox-area-grow">
            <div className="gallery__error-message">
              <h3>
                { i18n._t('AssetAdmin.DROPZONE_RESPONSE_ERROR', 'Server responded with an error.') }
              </h3>
              <p>{ this.props.errorMessage }</p>
            </div>
          </div>
        );
      }
      if (this.props.loading) {
        return <div className="flexbox-area-grow"></div>;
      }
      return (
        <div className="flexbox-area-grow">
          <div className="editor__file-preview-message--file-missing m-t-3">
            {i18n._t('AssetAdmin.FOLDER_MISSING', 'Folder cannot be found')}
          </div>
        </div>
      );
    }

    const messages = (
      <div className="gallery_messages">
        { this.props.errorMessage &&
          <FormAlert value={this.props.errorMessage} type="danger" />
        }
        { this.props.noticeMessage &&
          <FormAlert value={this.props.noticeMessage} type="success" />
        }
        {this.renderSearchAlert()}
      </div>
    );

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
    const canEdit = this.props.folder.canEdit && this.props.enableDropzone;

    const galleryClasses = [
      'panel', 'panel--padded', 'panel--scrollable', 'gallery__main',
    ];
    if (this.props.type === 'insert') {
      galleryClasses.push('insert-media-modal__main');
    }

    const cssClasses = galleryClasses;
    if (this.hasOpenedItem()) {
      cssClasses.push('gallery__main--has-opened-item');
    }

    return (
      <div className="flexbox-area-grow gallery__outer">
        {this.renderTransitionBulkActions()}
        <AssetDropzone
          name="gallery-container"
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
          <GalleryDND className={galleryClasses.join(' ')}>
            {this.renderToolbar()}
            {messages}
            {this.renderGalleryView()}
          </GalleryDND>
        </AssetDropzone>
      </div>
    );
  }
}

const sharedDefaultProps = {
  page: 1,
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
  selectedFiles: PropTypes.arrayOf(PropTypes.number),
  totalCount: PropTypes.number,
  page: PropTypes.number,
  limit: PropTypes.number,
  badges: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    message: PropTypes.node,
    status: PropTypes.string,
  })),
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
  onDelete: React.PropTypes.func,
  onRemoveErroredUpload: PropTypes.func,
  onEnableDropzone: PropTypes.func,
});

Gallery.defaultProps = Object.assign({}, sharedDefaultProps, {
  type: 'admin',
  view: 'tile',
  enableDropzone: true,
});

Gallery.propTypes = Object.assign({}, sharedPropTypes, {
  client: React.PropTypes.object,
  onUploadSuccess: React.PropTypes.func,
  onCreateFolder: React.PropTypes.func,
  onMoveFilesSuccess: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  type: PropTypes.oneOf(['insert', 'select', 'admin']),
  view: PropTypes.oneOf(['tile', 'table']),
  dialog: PropTypes.bool,
  fileId: PropTypes.number,
  folderId: PropTypes.number.isRequired,
  folder: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    parentId: PropTypes.number,
    canView: PropTypes.bool,
    canEdit: PropTypes.bool,
  }),
  queuedFiles: PropTypes.shape({
    items: PropTypes.array.isRequired,
  }),
  errorMessage: PropTypes.string,
  actions: PropTypes.object,
  securityId: PropTypes.string,
  onViewChange: PropTypes.func.isRequired,
  createFileApiUrl: PropTypes.string,
  createFileApiMethod: PropTypes.string,
  search: PropTypes.object,
  enableDropzone: PropTypes.bool,
});

function mapStateToProps(state) {
  const {
    selectedFiles,
    errorMessage,
    noticeMessage,
    enableDropzone,
    badges,
  } = state.assetAdmin.gallery;

  return {
    selectedFiles,
    errorMessage,
    noticeMessage,
    enableDropzone,
    badges,
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  moveFilesMutation,
  createFolderMutation,
  (component) => withApollo(component)
)(Gallery);

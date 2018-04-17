/* global window */
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
import Loading from 'components/Loading/Loading';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as queuedFilesActions from 'state/queuedFiles/QueuedFilesActions';
import moveFilesMutation from 'state/files/moveFilesMutation';
import { withApollo } from 'react-apollo';
import { SelectableGroup } from 'react-selectable';
import GalleryDND from './GalleryDND';
import configShape from 'lib/configShape';
import MoveModal from '../MoveModal/MoveModal';
import { inject } from 'lib/Injector';

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.handleOpenFolder = this.handleOpenFolder.bind(this);
    this.handleOpenFile = this.handleOpenFile.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleAddedFile = this.handleAddedFile.bind(this);
    this.handlePreviewLoaded = this.handlePreviewLoaded.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.handleRemoveErroredUpload = this.handleRemoveErroredUpload.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleSending = this.handleSending.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
    this.handleSuccessfulUpload = this.handleSuccessfulUpload.bind(this);
    this.handleFailedUpload = this.handleFailedUpload.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleEnableDropzone = this.handleEnableDropzone.bind(this);
    this.handleMoveFiles = this.handleMoveFiles.bind(this);
    this.handleBulkEdit = this.handleBulkEdit.bind(this);
    this.handleBulkPublish = this.handleBulkPublish.bind(this);
    this.handleBulkUnpublish = this.handleBulkUnpublish.bind(this);
    this.handleBulkDelete = this.handleBulkDelete.bind(this);
    this.handleBulkMove = this.handleBulkMove.bind(this);
    this.handleBulkInsert = this.handleBulkInsert.bind(this);
    this.handleGroupSelect = this.handleGroupSelect.bind(this);
    this.handleClearSelection = this.handleClearSelection.bind(this);
    this.toggleSelectConcat = this.toggleSelectConcat.bind(this);
    this.getSelectableFiles = this.getSelectableFiles.bind(this);
  }

  componentDidMount() {
    this.initSortDropdown();
    window.addEventListener('keydown', this.toggleSelectConcat);
    window.addEventListener('keyup', this.toggleSelectConcat);
  }

  componentWillReceiveProps(nextProps) {
    // turn off chosen.js
    if (nextProps.view !== 'tile') {
      const $select = this.getSortElement();

      $select.off('change');
    }

    // Flush uploaded files on folder navigation
    if (this.props.folderId !== nextProps.folderId) {
      nextProps.actions.queuedFiles.purgeUploadQueue();
    }
  }

  componentDidUpdate() {
    this.initSortDropdown();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.toggleSelectConcat);
    window.removeEventListener('keyup', this.toggleSelectConcat);
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

    // Show folder messagee, except for root folder
    if (filters.currentFolderOnly && this.props.folder.title) {
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
   * Calculates the items that are selected between two given item ids, this is primarily used when
   * holding down the shift key while selecting.
   *
   * @param {Number} firstId
   * @param {Number} lastId
   * @param {Array} files - Items that can be selected
   * @return {Array}
   */
  getSelection(firstId, lastId) {
    const selectable = this.getSelectableFiles();
    const indexes = [firstId, lastId]
      .map(id => selectable.findIndex(file => file.id === id))
      .filter(index => index !== -1)
      .sort((a, b) => a - b);

    // expect both indexes found
    if (indexes.length !== 2) {
      return indexes.map(index => selectable[index].id);
    }

    // get the items between the two indexes found, inclusive
    const [firstIndex, lastIndex] = indexes;
    return selectable
      .filter((file, index) => (
        index >= firstIndex && index <= lastIndex
      ))
      .map(file => file.id);
  }

  /**
   * Gets items that can be selected, in order
   *
   * @return {Array}
   */
  getSelectableFiles() {
    const selectable = this.props.files.filter(file => file.id);
    // When selecting, don't include any folders
    if (this.props.type === 'select') {
      return selectable.filter((item) => item.type !== 'folder');
    }

    // Files in provided order
    return selectable;
  }

  /**
   * @param {Event} event
   * @param {Array} items
   */
  handleBulkInsert(event, items) {
    this.props.onInsertMany(event, items);
  }

  /**
   * Delete a list of items
   *
   * @param {Event} event
   * @param {Array} items
   * @returns {Promise}
   */
  handleBulkDelete(event, items) {
    this.props.actions.gallery.setLoading(true);
    return this.props.onDelete(items.map(item => item.id))
      .then((resultItems) => {
        this.props.actions.gallery.setLoading(false);
        const successes = resultItems.filter((result) => result).length;
        if (successes !== items.length) {
          this.props.actions.gallery.setErrorMessage(
            i18n.sprintf(
              i18n._t(
                'AssetAdmin.BULK_ACTIONS_DELETE_FAIL',
                '%s folders/files were successfully deleted, but %s files were not able to be deleted.'
              ),
              successes,
              items.length - successes
            )
          );
          this.props.actions.gallery.setNoticeMessage(null);
        } else {
          this.props.actions.gallery.setNoticeMessage(
            i18n.sprintf(
              i18n._t('AssetAdmin.BULK_ACTIONS_DELETE_SUCCESS', '%s folders/files were successfully deleted.'),
              successes
            )
          );
          this.props.actions.gallery.setErrorMessage(null);
          this.props.actions.gallery.deselectFiles();
        }
      });
  }

  /**
   * Publish a list of items
   *
   * @param {Event} event
   * @param {Array} items
   * @returns {Promise}
   */
  handleBulkPublish(event, items) {
    const publishItems = items
      .map(item => item.id);
    if (!publishItems.length) {
      this.props.actions.gallery.deselectFiles();

      return Promise.resolve(true);
    }
    this.props.actions.gallery.setLoading(true);

    return this.props.onPublish(publishItems)
      .then((resultItems) => {
        this.props.actions.gallery.setLoading(false);
        this.props.actions.gallery.setNoticeMessage(
          i18n.sprintf(
            i18n._t('AssetAdmin.BULK_ACTIONS_PUBLISH_SUCCESS', '%s folders/files were successfully published.'),
            resultItems.length
          )
        );
        this.props.actions.gallery.setErrorMessage(null);
        this.props.actions.gallery.deselectFiles();
      });
  }

  /**
   * Unpublish a list of items
   *
   * @param {Event} event
   * @param {Array} items
   * @returns {Promise}
   */
  handleBulkUnpublish(event, items) {
    const unpublishItems = items.filter(item => item.published)
      .map(item => item.id);
    if (!unpublishItems.length) {
      this.props.actions.gallery.deselectFiles();

      return Promise.resolve(true);
    }
    this.props.actions.gallery.setLoading(true);

    return this.props.onUnpublish(unpublishItems)
      .then((resultItems) => {
        this.props.actions.gallery.setLoading(false);
        this.props.actions.gallery.setNoticeMessage(
          i18n.sprintf(
            i18n._t('AssetAdmin.BULK_ACTIONS_UNPUBLISH_SUCCESS', '%s folders/files were successfully unpublished.'),
            resultItems.length
          )
        );
        this.props.actions.gallery.setErrorMessage(null);
        this.props.actions.gallery.deselectFiles();
      });
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

      // remove existing event listener so it doesn't trigger multiple times per change
      $select.off('change');
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

  handlePreviewLoaded(fileData, previewData) {
    this.props.actions.queuedFiles.updateQueuedFile(fileData.queuedId, previewData);
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
   * Toggle concatenating selected items based on the key event
   *
   * @param {Event} event
   */
  toggleSelectConcat(event) {
    this.props.actions.gallery.setConcatenateSelect(this.isConcat(event));
  }

  /**
   * Determines whether concat should happen
   *
   * @param {Event} event
   * @return {boolean}
   */
  isConcat(event) {
    return event.metaKey || event.ctrlKey || event.shiftKey;
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
    this.props.onClearSearch(event);
  }

  /**
   * Handles the lasso selection of items from <SelectionGroup />
   *
   * @param items
   * @param event Event
   */
  handleGroupSelect(items, event) {
    const { setSelectedFiles, selectFiles } = this.props.actions.gallery;
    const selectableFiles = this.getSelectableFiles();

    const selectItems = items
      .filter((id, index) => {
        if (items.indexOf(id) !== index) {
          return false;
        }
        return selectableFiles.find(file => file.id === id);
      });

    const concat = this.props.concatenateSelect || this.isConcat(event);

    if (this.props.maxFilesSelect !== null) {
      let totalFiles = selectItems.length;
      if (concat) {
        const totalSelected = this.props.selectedFiles
          .filter(id => !this.props.selectedFiles.includes(id))
          .concat(this.props.selectedFiles);

        // include existing selected items in total count
        totalFiles = totalSelected.length;
      }

      // do not select if over the max allowable selection
      if (totalFiles >= this.props.maxFilesSelect) {
        return;
      }
    }

    if (concat) {
      setSelectedFiles(selectItems);
    } else {
      selectFiles(selectItems);
    }
  }

  /**
   * Clears all files from selection
   */
  handleClearSelection() {
    this.props.actions.gallery.deselectFiles();
  }

  /**
   * Handles a user drilling down into a folder.
   *
   * @param {Event} event - Event object.
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
   * @param {Event} event - Event object.
   * @param {Object} file - The file that's being activated.
   */
  handleOpenFile(event, file) {
    event.preventDefault();
    // Disable file editing if the file has not finished uploading
    // or the upload has errored.
    if (file.created === null) {
      return;
    }

    if ((!this.props.selectedFiles.length || this.props.maxFilesSelect === 1) &&
      this.props.type === 'select'
    ) {
      this.handleSelect(event, file);
    }

    this.props.onOpenFile(file.id, file);
  }

  /**
   * Handles the user toggling the selected/deselected state of a file or folder.
   * Holding shift when selecting multiple items will select items between those multiple items.
   *
   * @param {Event} event - Event object.
   * @param {Object} item - The item being selected/deselected
   */
  handleSelect(event, item) {
    const maxFiles = this.props.maxFilesSelect;
    const selectable = this.getSelectableFiles();
    let selectedItemIDs = selectable
      .filter((file) => file.id === item.id)
      .map((file) => file.id);

    // If only one file is allowed, set this as the only selected item
    if (maxFiles === 1) {
      this.props.actions.gallery.setSelectedFiles(selectedItemIDs);
      return;
    }

    if (this.props.selectedFiles.indexOf(item.id) === -1) {
      // If holding down shift, merge with last item selected
      if (event.shiftKey) {
        selectedItemIDs = this.getSelection(this.props.lastSelected, item.id);
      }

      const totalSelected = this.props.selectedFiles
        .filter(id => !selectedItemIDs.includes(id))
        .concat(selectedItemIDs);

      if (totalSelected.length > maxFiles && maxFiles !== null) {
        return;
      }

      this.props.actions.gallery.selectFiles(selectedItemIDs);
      this.props.actions.gallery.setLastSelected(item.id);
    } else {
      this.props.actions.gallery.deselectFiles([item.id]);
      // If holding down shift, don't deselect the last selected
      if (event.shiftKey) {
        this.props.actions.gallery.setLastSelected(null);
      }
    }
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
      })
      .catch(() => {
        this.props.actions.gallery.setErrorMessage(
          i18n._t('AssetAdmin.FAILED_MOVE', 'There was an error moving the selected items.')
        );
      });
  }

  /**
   * @param {Event} event
   * @param {Array} items
   */
  handleBulkEdit(event, items) {
    this.handleOpenFile(event, items[0]);
  }

  handleBulkMove() {
    this.props.actions.gallery.activateModal(CONSTANTS.MODAL_MOVE);
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
   * Generates the react component that wraps around the actual bulk actions
   * and provides transition effect.
   *
   * @returns {XML}
   */
  renderTransitionBulkActions() {
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

  /**
   * Generates the react components needed for the BulkActions part of this
   * component.
   *
   * @returns {XML}
   */
  renderBulkActions() {
    const actionFilter = (this.props.type === 'select')
      ? action => action.value === 'insert'
      : action => action.value !== 'insert';

    const actions = CONSTANTS.BULK_ACTIONS
      .filter(actionFilter)
      .map((action) => {
        if (action.callback) {
          return action;
        }
        switch (action.value) {
          case 'delete': {
            return { ...action, callback: this.handleBulkDelete };
          }
          case 'edit': {
            return { ...action, callback: this.handleBulkEdit };
          }
          case 'move': {
            return { ...action, callback: this.handleBulkMove };
          }
          case 'publish': {
            return { ...action, callback: this.handleBulkPublish };
          }
          case 'unpublish': {
            return { ...action, callback: this.handleBulkUnpublish };
          }
          case 'insert': {
            return { ...action, callback: this.handleBulkInsert };
          }
          default: {
            return action;
          }
        }
      });

    const selected = this.props.selectedFiles
      .map(id => this.props.files.find(file => file && id === file.id))
      .filter(item => item);

    if (selected.length > 0 && ['admin', 'select'].includes(this.props.type)) {
      return (
        <BulkActions
          actions={actions}
          items={selected}
          total={this.props.maxFilesSelect}
          key={selected.length > 0}
          container={this.gallery}
          showCount={this.props.maxFilesSelect !== 1}
        />
      );
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
    const files = this.props.files.map((file) => ({
      ...file,
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
      selectableItems: ['admin', 'select'].includes(type),
      selectableFolders: this.props.type !== 'select',
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
      sectionConfig: this.props.sectionConfig,
      canDrag: this.props.type === 'admin',
      maxFilesSelect: this.props.maxFilesSelect,
    };

    return <GalleryView {...props} />;
  }

  /**
   * Renders the toolbar for this component
   *
   * @returns {XML}
   */
  renderToolbar() {
    const {
      GalleryToolbar,
      sort,
      view,
      folder,
      onCreateFolder,
      onOpenFolder,
      onViewChange,
    } = this.props;

    const props = {
      onMoveFiles: this.handleMoveFiles,
      onSort: this.handleSort,
      onCreateFolder,
      onOpenFolder,
      onViewChange,
      view,
      sort,
      folder,
    };

    return <GalleryToolbar {...props} />;
  }

  render() {
    const { folder, errorMessage, graphQLErrors, noticeMessage, loading } = this.props;

    if (!folder) {
      if (errorMessage || graphQLErrors) {
        return (
          <div className="gallery__error flexbox-area-grow">
            <div className="gallery__error-message">
              <h3>
                { i18n._t('AssetAdmin.DROPZONE_RESPONSE_ERROR', 'Server responded with an error.') }
              </h3>
              { errorMessage && <p>{ errorMessage }</p> }
              { graphQLErrors && graphQLErrors.map((error, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <p key={index}>{error}</p>
              ))}
            </div>
          </div>
        );
      }
      if (loading) {
        return <Loading />;
      }
      return (
        <div className="flexbox-area-grow">
          <div className="editor__file-preview-message--file-missing m-t-3">
            {i18n._t('Admin.UNKNOWN_ERROR', 'An unknown error has occurred')}
          </div>
        </div>
      );
    }

    const messages = (
      <div className="gallery_messages">
        { errorMessage &&
          <FormAlert value={errorMessage} type="danger" />
        }
        { noticeMessage &&
          <FormAlert value={noticeMessage} type="success" />
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
      ...this.props.sectionConfig.dropzoneOptions,
    };

    const securityID = this.props.securityId;
    const canEdit = this.props.folder.canEdit && this.props.enableDropzone;

    const galleryClasses = [
      'panel', 'panel--padded', 'panel--scrollable', 'gallery__main', 'fill-height',
    ];
    if (this.props.type === 'insert') {
      galleryClasses.push('insert-media-modal__main');
    }

    const cssClasses = galleryClasses;
    if (this.hasOpenedItem()) {
      cssClasses.push('gallery__main--has-opened-item');
    }

    return (
      <div
        className="flexbox-area-grow gallery__outer"
        ref={gallery => { this.gallery = gallery; }}
      >
        {this.renderTransitionBulkActions()}
        <GalleryDND className={galleryClasses.join(' ')}>
          {this.renderToolbar()}
          <SelectableGroup
            enabled={this.props.view === 'tile' && this.props.type === 'admin'}
            className="flexbox-area-grow fill-height gallery__main--selectable"
            onSelection={this.handleGroupSelect}
            onNonItemClick={this.handleClearSelection}
            preventDefault={false}
            fixedPosition
          >
            <AssetDropzone
              name="gallery-container"
              className="flexbox-area-grow"
              canUpload={canEdit}
              onAddedFile={this.handleAddedFile}
              onPreviewLoaded={this.handlePreviewLoaded}
              onError={this.handleFailedUpload}
              onSuccess={this.handleSuccessfulUpload}
              onSending={this.handleSending}
              onUploadProgress={this.handleUploadProgress}
              preview={dimensions}
              folderId={this.props.folderId}
              options={dropzoneOptions}
              securityID={securityID}
              uploadButton={false}
            >
              {messages}
              {this.renderGalleryView()}
            </AssetDropzone>
          </SelectableGroup>
        </GalleryDND>
        { loading && <Loading containerClass="" /> }
        <MoveModal
          sectionConfig={this.props.sectionConfig}
          folderId={this.props.folderId}
          onSuccess={this.props.onMoveFilesSuccess}
          onOpenFolder={this.props.onOpenFolder}
        />
      </div>
    );
  }
}

const sharedDefaultProps = {
  page: 1,
  limit: 15,
};

const sharedPropTypes = {
  sectionConfig: configShape,
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
  maxFilesSelect: PropTypes.number,
};

const galleryViewDefaultProps = Object.assign({}, sharedDefaultProps, {
  selectableItems: false,
});

const galleryViewPropTypes = Object.assign({}, sharedPropTypes, {
  selectableItems: PropTypes.bool,
  selectableFolders: PropTypes.bool,
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
  onUploadSuccess: React.PropTypes.func,
  onCreateFolder: React.PropTypes.func,
  onMoveFilesSuccess: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onPublish: React.PropTypes.func,
  onUnpublish: React.PropTypes.func,
  type: PropTypes.oneOf(['insert-media', 'insert-link', 'select', 'admin']),
  view: PropTypes.oneOf(['tile', 'table']),
  lastSelected: PropTypes.number,
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
  // Combined queuedFiles + files
  files: PropTypes.array,
  errorMessage: PropTypes.string,
  graphQLErrors: PropTypes.arrayOf(PropTypes.string),
  actions: PropTypes.object,
  securityId: PropTypes.string,
  onViewChange: PropTypes.func.isRequired,
  createFileApiUrl: PropTypes.string,
  createFileApiMethod: PropTypes.string,
  search: PropTypes.object,
  enableDropzone: PropTypes.bool,
  concatenateSelect: PropTypes.bool,
  GalleryToolbar: PropTypes.func,
  sorters: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
});

function mapStateToProps(state, ownProps) {
  let { sort } = ownProps;
  const {
    selectedFiles,
    errorMessage,
    noticeMessage,
    enableDropzone,
    badges,
    concatenateSelect,
    loading,
    sorters,
    lastSelected,
  } = state.assetAdmin.gallery;

  // set default sort
  if (!sort && sorters && sorters[0]) {
    sort = `${sorters[0].field},${sorters[0].direction}`;
  }

  return {
    lastSelected,
    selectedFiles,
    errorMessage,
    noticeMessage,
    enableDropzone,
    badges,
    concatenateSelect,
    loading: ownProps.loading || loading,
    queuedFiles: state.assetAdmin.queuedFiles,
    securityId: state.config.SecurityID,
    sorters,
    sort,
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

export {
  Gallery as Component,
  galleryViewPropTypes,
  galleryViewDefaultProps,
};

export default compose(
  inject(
    ['GalleryToolbar'],
    null,
    () => 'AssetAdmin.Gallery',
  ),
  connect(mapStateToProps, mapDispatchToProps),
  moveFilesMutation,
  (component) => withApollo(component)
)(Gallery);

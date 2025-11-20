/* eslint-disable import/no-cycle */
import $ from 'jquery';
import i18n from 'i18n';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import AssetDropzone from 'components/AssetDropzone/AssetDropzone';
import BulkActions from 'components/BulkActions/BulkActions';
import ThumbnailView from 'containers/ThumbnailView/ThumbnailView';
import TableView from 'containers/TableView/TableView';
import CONSTANTS from 'constants/index';
import FormAlert from 'components/FormAlert/FormAlert';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as toastsActions from 'state/toasts/ToastsActions';
import * as queuedFilesActions from 'state/queuedFiles/QueuedFilesActions';
import * as confirmDeletionActions from 'state/confirmDeletion/ConfirmDeletionActions';
import configShape from 'lib/configShape';
import Config from 'lib/Config';
import getStatusCodeMessage from 'lib/getStatusCodeMessage';
import { inject } from 'lib/Injector';
import PropTypes from 'prop-types';
import backend from 'lib/Backend';
import Selectable from 'containers/Selectable/Selectable';
import MoveModal from '../MoveModal/MoveModal';
import GalleryDND from './GalleryDND';

/**
 * List of possible possible bulk actions.
 */
const ACTION_TYPES = {
  DELETE: 'delete',
  ARCHIVE: 'archive',
  EDIT: 'edit',
  MOVE: 'move',
  PUBLISH: 'publish',
  UNPUBLISH: 'unpublish',
  INSERT: 'insert',
  ADMIN: 'admin',
  SELECT: 'select',
};

const Gallery = ({
  actions,
  selectedFiles,
  files,
  folderId,
  fileId,
  folder,
  queuedFiles,
  sort,
  page = 1,
  limit = 15,
  onOpenFile,
  onOpenFolder,
  onSort,
  onSetPage,
  onViewChange,
  badges,
  sectionConfig,
  GalleryToolbar,
  LoadingComponent,
  BulkActionsComponent = BulkActions,
  onSuccessfulUpload,
  onSuccessfulUploadQueue,
  onCreateFolder,
  onMoveFilesSuccess,
  onPublish,
  onUnpublish,
  type = ACTION_TYPES.ADMIN,
  view = 'tile',
  lastSelected,
  dialog = false,
  errorMessage,
  securityId,
  createFileApiUrl,
  createFileApiMethod,
  enableDropzone = true,
  concatenateSelect,
  noticeMessage,
  loading,
  onClearSearch,
  maxFilesSelect,
  totalCount,
  onInsertMany,
}) => {
  const galleryRef = useRef(null);
  const prevFolderIdRef = useRef(folderId);

  /**
   * Gets the element which represents the sorter dropdown for jQuery plugin usage
   *
   * @returns {jQuery}
   */
  const getSortElement = () => $(galleryRef.current).find('.gallery__sort .dropdown');

  /**
   * Compose the search critia into a human readable message
   *
   * @param {object} search
   * @returns {string}
   */
  // eslint-disable-next-line no-unused-vars
  const getSearchMessage = (filters) => {
    const messages = [];
    if (filters.name) {
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGEKEYWORDS',
        'with keywords \'{name}\''
      ));
    }

    if (filters.lastEditedFrom && filters.lastEditedTo) {
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGEEDITEDBETWEEN',
        'last edited between \'{lastEditedFrom}\' and \'{lastEditedTo}\''
      ));
    } else if (filters.lastEditedFrom) {
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGEEDITEDFROM',
        'last edited after \'{lastEditedFrom}\''
      ));
    } else if (filters.lastEditedTo) {
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGEEDITEDTO',
        'last edited before \'{lastEditedTo}\''
      ));
    }

    if (filters.appCategory) {
      messages.push(i18n._t(
        'AssetAdmin.SEARCHRESULTSMESSAGECATEGORY',
        'categorised as \'{appCategory}\''
      ));
    }

    // Show folder messagee, except for root folder
    if (filters.currentFolderOnly && folder.title) {
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
        { folder: folder.title },
        filters,
        { appCategory: filters.appCategory ? filters.appCategory.toLowerCase() : undefined }
      )),
    };

    return i18n.inject(
      i18n._t('AssetAdmin.SEARCHRESULTSMESSAGE', 'Search results {parts}'),
      searchResults
    );
  };

  /**
   * Gets items that can be selected, in order
   *
   * @return {Array}
   */
  const getSelectableFiles = () => {
    const selectable = files.filter(file => file.id);
    // When selecting, don't include any folders
    if (type === ACTION_TYPES.SELECT) {
      return selectable.filter((item) => item.type !== 'folder');
    }

    // Files in provided order
    return selectable;
  };

  /**
   * Calculates the items that are selected between two given item ids, this is primarily used when
   * holding down the shift key while selecting.
   *
   * @param {Number} firstId
   * @param {Number} lastId
   * @param {Array} files - Items that can be selected
   * @return {Array}
   */
  const getSelection = (firstId, lastId) => {
    const selectable = getSelectableFiles();
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
  };

  /**
   * @param {Event} event
   * @param {Array} items
   */
  const handleBulkInsert = (event, items) => {
    onInsertMany(event, items);
  };

  /**
   * Publish a list of items
   *
   * @param {Event} event
   * @param {Array} items
   * @returns {Promise}
   */
  const handleBulkPublish = (event, items) => {
    const publishItems = items
      .map(item => item.id);
    if (!publishItems.length) {
      actions.gallery.deselectFiles();

      return Promise.resolve(true);
    }
    actions.gallery.setLoading(true);

    return onPublish(publishItems)
      .then((resultItems) => {
        actions.gallery.setLoading(false);
        actions.toasts.success(
          i18n.sprintf(
            i18n._t('AssetAdmin.BULK_ACTIONS_PUBLISH_SUCCESS', '%s folders/files were successfully published.'),
            resultItems.length
          )
        );
        actions.gallery.deselectFiles();
      });
  };

  /**
   * Unpublish a list of items
   *
   * @param {Event} event
   * @param {Array} items
   * @returns {Promise}
   */
  const handleBulkUnpublish = (event, items) => {
    const unpublishItems = items.filter(item => item.published)
      .map(item => item.id);
    if (!unpublishItems.length) {
      actions.gallery.deselectFiles();

      return Promise.resolve(true);
    }
    actions.gallery.setLoading(true);

    return onUnpublish(unpublishItems)
      .then((resultItems) => {
        actions.gallery.setLoading(false);
        actions.toasts.success(
          i18n.sprintf(
            i18n._t('AssetAdmin.BULK_ACTIONS_UNPUBLISH_SUCCESS', '%s folders/files were successfully unpublished.'),
            resultItems.length
          )
        );
        actions.gallery.deselectFiles();
      });
  };

  const initSortDropdown = () => {
    // turn on chosen if required
    if (view === 'tile') {
      const $select = getSortElement();

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
      $select.on('change', () => $select.find(':selected')[0].click());
    }
  };

  /**
   * Handler for when the user changes the sort order
   *
   * @param {string} value
   */
  const handleSort = (value) => {
    actions.queuedFiles.purgeUploadQueue();
    onSort(value);
  };

  /**
   * Handles setting the pagination page number
   *
   * @param {number} page
   */
  const handleSetPage = (pageParam) => {
    onSetPage(pageParam);
  };

  /**
   * Handles removing an upload and cancelling the request made to upload
   *
   * @param {object} fileData
   */
  const handleCancelUpload = (fileData) => {
    fileData.xhr.abort();
    actions.queuedFiles.removeQueuedFile(fileData.queuedId);
  };

  /**
   * Handles removing an upload that had errored during/after upload
   *
   * @param {object} fileData
   */
  const handleRemoveErroredUpload = (fileData) => {
    actions.queuedFiles.removeQueuedFile(fileData.queuedId);
  };

  /**
   * Handler for when a file was added to be uploaded
   *
   * @param {object} fileData
   */
  const handleAddedFile = (fileData) => {
    actions.queuedFiles.addQueuedFile(fileData);
  };

  const handlePreviewLoaded = (fileData, previewData) => {
    actions.queuedFiles.updateQueuedFile(fileData.queuedId, previewData);
  };

  /**
   * Triggered just before the xhr request is sent.
   *
   * @param {Object} fileData - File interface.
   *      See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {Object} xhr
   */
  const handleSending = (file, xhr) => {
    actions.queuedFiles.updateQueuedFile(file._queuedId, { xhr });
  };

  const handleUploadProgress = (file, progress) => {
    actions.queuedFiles.updateQueuedFile(file._queuedId, { progress });
  };

  const handleFailedUpload = (fileXhr, response) => {
    const statusCodeMessage = fileXhr.xhr && fileXhr.xhr.status
      ? getStatusCodeMessage(fileXhr.xhr.status, fileXhr.xhr)
      : '';
    actions.queuedFiles.failUpload(fileXhr._queuedId, response, statusCodeMessage);
  };

  /**
   * Handles successful file uploads.
   *
   * @param {Object} fileXhr - File interface.
   *      See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  const handleSuccessfulUpload = (fileXhr) => {
    const json = JSON.parse(fileXhr.xhr.response);

    // SilverStripe send back a success code with an error message sometimes...
    if (typeof json[0].error !== 'undefined') {
      handleFailedUpload(fileXhr);
      return;
    }

    actions.queuedFiles.succeedUpload(fileXhr._queuedId, json[0]);

    if (onSuccessfulUpload) {
      onSuccessfulUpload(json);
    }

    const filesInProgress = queuedFiles.items.reduce(
      (inProgress, file) => {
        if (file.progress !== 100) {
          return inProgress + 1;
        }
        return inProgress;
      }, 0
    );

    // redirect to open the last uploaded files
    if (
      !fileId &&
      !selectedFiles.length &&
      filesInProgress === 0
    ) {
      const lastFile = json.pop();
      onOpenFile(lastFile.id);
    }
  };

  const handleQueueComplete = () => {
    if (onSuccessfulUploadQueue) {
      onSuccessfulUploadQueue();
    }
  };

  /**
   * Checks if a file or folder is currently selected.
   *
   * @param {Number} id - The id of the file or folder to check.
   * @return {Boolean}
   */
  const itemIsSelected = (id) => selectedFiles.indexOf(id) > -1;

  /**
   * Determines whether concat should happen
   *
   * @param {Event} event
   * @return {boolean}
   */
  const isConcat = (event) => event.metaKey || event.ctrlKey || event.shiftKey;

  /**
   * Toggle concatenating selected items based on the key event
   *
   * @param {Event} event
   */
  const toggleSelectConcat = (event) => {
    actions.gallery.setConcatenateSelect(isConcat(event));
  };

  /**
   * Checks if a file or folder is currently highlighted,
   * which typically means its own for viewing or editing.
   *
   * @param {Number} id - The id of the file or folder to check.
   * @return {Boolean}
   */
  const itemIsHighlighted = (id) => fileId === id;

  /**
   * Check if the gallery has an opened (for editing) item
   *
   * @return {Boolean}
   */
  const hasOpenedItem = () => !!fileId;

  // eslint-disable-next-line no-unused-vars
  const handleClearSearch = (event) => {
    onClearSearch(event);
  };

  /**
   * Handles the lasso selection of items from <SelectionGroup />
   *
   * @param items
   * @param event Event
   */
  const handleGroupSelect = (items, event) => {
    const { setSelectedFiles, selectFiles } = actions.gallery;
    const selectableFiles = getSelectableFiles();

    const selectItems = items
      .filter((id, index) => {
        if (items.indexOf(id) !== index) {
          return false;
        }
        return selectableFiles.find(file => file.id === id);
      });

    const concat = concatenateSelect || isConcat(event);

    if (maxFilesSelect !== null) {
      let totalFiles = selectItems.length;
      if (concat) {
        const totalSelected = selectedFiles
          .filter(id => !selectedFiles.includes(id))
          .concat(selectedFiles);

        // include existing selected items in total count
        totalFiles = totalSelected.length;
      }

      // do not select if over the max allowable selection
      if (totalFiles >= maxFilesSelect) {
        return;
      }
    }

    if (!concat) {
      setSelectedFiles(selectItems);
    } else {
      selectFiles(selectItems);
    }
  };

  /**
   * Clears all files from selection
   */
  const handleClearSelection = () => {
    actions.gallery.deselectFiles();
  };

  /**
   * Selects all visible files
   */
  const handleSelectAll = () => {
    const ids = files.map(file => file.id);
    handleGroupSelect(ids, new Event('na'));
  };

  /**
   * Pick if the selection started from inside the pagination. If it started from inside the
   * pagination, cancel it to prevent inteference with the normal pagination.
   * @param Element target
   * @returns {boolean}
   */
  const handleShouldStartSelecting = (target) => {
    /** @type Node */
    let node = target;
    // Loop the nodes until we find the root of the pagination or the root of the selectable area
    while (node && (node instanceof Element)) {
      if (node.classList.contains('paginator-footer')) {
        return false;
      }
      if (node.classList.contains('gallery__main--selectable')) {
        break;
      }
      node = node.parentNode;
    }
    return true;
  };

  /**
   * Handles a user drilling down into a folder.
   *
   * @param {Event} event - Event object.
   * @param {Object} folder - The folder that's being activated.
   */
  const handleOpenFolder = (event, folderParam) => {
    event.preventDefault();
    onOpenFolder(folderParam.id);
  };

  /**
   * Handles the user toggling the selected/deselected state of a file or folder.
   * Holding shift when selecting multiple items will select items between those multiple items.
   *
   * @param {Event} event - Event object.
   * @param {Object} item - The item being selected/deselected
   */
  const handleSelect = (event, item) => {
    const maxFiles = maxFilesSelect;
    const selectable = getSelectableFiles();
    let selectedItemIDs = selectable
      .filter((file) => file.id === item.id)
      .map((file) => file.id);

    // If only one file is allowed, set this as the only selected item
    if (maxFiles === 1) {
      actions.gallery.setSelectedFiles(selectedItemIDs);
      return;
    }

    if (selectedFiles.indexOf(item.id) === -1) {
      // If holding down shift, merge with last item selected
      if (event.shiftKey) {
        selectedItemIDs = getSelection(lastSelected, item.id);
      }

      const totalSelected = selectedFiles
        .filter(id => !selectedItemIDs.includes(id))
        .concat(selectedItemIDs);

      if (totalSelected.length > maxFiles && maxFiles !== null) {
        return;
      }

      actions.gallery.selectFiles(selectedItemIDs);
      actions.gallery.setLastSelected(item.id);
    } else {
      actions.gallery.deselectFiles([item.id]);
      // If holding down shift, don't deselect the last selected
      if (event.shiftKey) {
        actions.gallery.setLastSelected(null);
      }
    }
  };

  /**
   * Handles a user activating the file editor.
   *
   * @param {Event} event - Event object.
   * @param {Object} file - The file that's being activated.
   */
  const handleOpenFile = (event, file) => {
    event.preventDefault();
    // Disable file editing if the file has not finished uploading
    // or the upload has errored.
    if (file.created === null) {
      return;
    }

    if ((!selectedFiles.length || maxFilesSelect === 1) &&
      type === ACTION_TYPES.SELECT
    ) {
      handleSelect(event, file);
    }

    onOpenFile(file.id, file);
  };

  const handleEnableDropzone = (enabled) => {
    actions.gallery.setEnableDropzone(enabled);
  };

  const handleMoveFiles = (folderIdParam, fileIds) => {
    const url = sectionConfig.endpoints.move.url;
    return backend.post(url, {
      ids: fileIds,
      folderID: folderIdParam,
    }, {
      'X-SecurityID': Config.get('SecurityID')
    })
      .then(() => {
        const duration = CONSTANTS.MOVE_SUCCESS_DURATION;
        const message = `+${fileIds.length}`;

        actions.gallery.setFileBadge(folderIdParam, message, 'success', duration);

        if (typeof onMoveFilesSuccess === 'function') {
          onMoveFilesSuccess(folderIdParam, fileIds);
        }
      })
      .catch(() => {
        actions.toasts.error(
          i18n._t('AssetAdmin.FAILED_MOVE', 'There was an error moving the selected items.')
        );
      });
  };

  /**
   * @param {Event} event
   * @param {Array} items
   */
  const handleBulkEdit = (event, items) => {
    handleOpenFile(event, items[0]);
  };

  const handleBulkMove = () => {
    actions.gallery.activateModal(CONSTANTS.MODAL_MOVE);
  };

  /**
   * Generates the react components needed for the BulkActions part of this
   * component.
   *
   * @returns {XML}
   */
  const renderBulkActions = () => {
    // When rendering gallery in modal or in select mode, filter all action but insert.
    const actionFilter = (type === ACTION_TYPES.SELECT || dialog)
      ? action => action.value === ACTION_TYPES.INSERT
      : action => action.value !== ACTION_TYPES.INSERT;

    // Used to choose whether the text should be "Delete" or "Archive"
    const deleteButtonFilter = (sectionConfig.filesAreVersioned && sectionConfig.archiveFiles)
      ? action => action.value !== ACTION_TYPES.DELETE
      : action => action.value !== ACTION_TYPES.ARCHIVE;

    const bulkActionsList = CONSTANTS.BULK_ACTIONS
      .filter(actionFilter)
      .filter(deleteButtonFilter)
      .map((action) => {
        if (action.callback) {
          return action;
        }
        switch (action.value) {
          case ACTION_TYPES.DELETE:
          case ACTION_TYPES.ARCHIVE: {
            return {
              ...action,
              callback: (event, items) => {
                actions.confirmDeletion.confirm(items);
              },
              confirm: undefined
            };
          }
          case ACTION_TYPES.EDIT: {
            return { ...action, callback: handleBulkEdit };
          }
          case ACTION_TYPES.MOVE: {
            return { ...action, callback: handleBulkMove };
          }
          case ACTION_TYPES.PUBLISH: {
            return { ...action, callback: handleBulkPublish };
          }
          case ACTION_TYPES.UNPUBLISH: {
            return { ...action, callback: handleBulkUnpublish };
          }
          case ACTION_TYPES.INSERT: {
            return { ...action, callback: handleBulkInsert, color: 'primary' };
          }
          default: {
            return action;
          }
        }
      });

    const selected = selectedFiles
      .map(id => files.find(file => file && id === file.id))
      .filter(item => item);

    if (selected.length > 0 && [ACTION_TYPES.ADMIN, ACTION_TYPES.SELECT].includes(type)) {
      return (
        <BulkActionsComponent
          actions={bulkActionsList}
          items={selected}
          total={maxFilesSelect}
          key={selected.length > 0}
          container={galleryRef.current}
          showCount={maxFilesSelect !== 1}
          onClearSelection={handleClearSelection}
          onSelectAll={handleSelectAll}
        />
      );
    }

    return null;
  };

  /**
   * Generates the react component that wraps around the actual bulk actions
   * and provides transition effect.
   *
   * @returns {XML}
   */
  const renderTransitionBulkActions = () => renderBulkActions();

  /**
   * Renders the core view for this component, the component is determined by the view property
   *
   * @returns {XML}
   */
  const renderGalleryView = () => {
    const GalleryView = (view === 'table') ? TableView : ThumbnailView;
    const mappedFiles = files.map((file) => {
      const selected = itemIsSelected(file.id);
      const highlighted = itemIsHighlighted(file.id);
      const key =
        (file.queuedId ? `queueId${file.queuedId}` : `id${file.id}`) +
        (selected ? '--selected' : '');
      return ({ ...file, selected, highlighted, key });
    });

    // Allow selection of file when:
    // * explictely selecting files
    // * plain asset-admin section
    // * editing files in a multi-select upload field
    const selectableItems =
      type === ACTION_TYPES.SELECT ||
      (type === ACTION_TYPES.ADMIN && (!maxFilesSelect || maxFilesSelect > 1));

    const props = {
      selectableItems,
      selectableFolders: type !== ACTION_TYPES.SELECT && !dialog,
      files: mappedFiles,
      loading,
      page,
      totalCount,
      limit,
      sort,
      selectedFiles,
      badges,
      onSort: handleSort,
      onSetPage: handleSetPage,
      onOpenFile: handleOpenFile,
      onOpenFolder: handleOpenFolder,
      onSelect: handleSelect,
      onCancelUpload: handleCancelUpload,
      onDropFiles: handleMoveFiles,
      onRemoveErroredUpload: handleRemoveErroredUpload,
      sectionConfig,
      canDrag: type === ACTION_TYPES.ADMIN,
      maxFilesSelect,
    };

    return <GalleryView {...props} />;
  };

  /**
   * Renders the toolbar for this component
   *
   * @returns {XML}
   */
  const renderToolbar = () => {
    const props = {
      onSort: handleSort,
      onCreateFolder,
      onOpenFolder,
      onViewChange,
      view,
      sort,
      folder,
    };

    return <GalleryToolbar {...props} />;
  };

  const initFlushUploadFiles = () => {
    // turn off chosen.js
    if (view !== 'tile') {
      const $select = getSortElement();

      $select.off('change');
    }
    // Flush uploaded files on folder navigation
    // Useing a ref to track previous folderId value instead of simply relying on the dependency array folderId
    // to trigger this effect to prevent if from calling purgeUploadQueue initially on mount
    if (prevFolderIdRef.current !== folderId) {
      actions.queuedFiles.purgeUploadQueue();
    }
  };

  useEffect(() => {
    initSortDropdown();
    window.addEventListener('keydown', toggleSelectConcat);
    window.addEventListener('keyup', toggleSelectConcat);

    return () => {
      window.removeEventListener('keydown', toggleSelectConcat);
      window.removeEventListener('keyup', toggleSelectConcat);
    };
  }, []);

  useEffect(() => {
    initSortDropdown();
    initFlushUploadFiles();
    if (prevFolderIdRef.current !== folderId) {
      prevFolderIdRef.current = folderId;
    }
  }, [view, folderId]);

  if (!folder) {
    if (errorMessage) {
      return (
        <div className="gallery__error flexbox-area-grow">
          <div className="gallery__error-message">
            <h3>
              {i18n._t('AssetAdmin.DROPZONE_RESPONSE_ERROR', 'Server responded with an error.')}
            </h3>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </div>
      );
    }
    if (loading) {
      return (
        <div className="flexbox-area-grow">
          <LoadingComponent />
        </div>
      );
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
      {errorMessage &&
        <FormAlert value={errorMessage} type="danger" />
      }
      {noticeMessage &&
        <FormAlert value={noticeMessage} type="success" />
      }
    </div>
  );

  const dimensions = {
    height: CONSTANTS.THUMBNAIL_HEIGHT,
    width: CONSTANTS.THUMBNAIL_WIDTH,
  };
  const dropzoneOptions = {
    url: createFileApiUrl,
    method: createFileApiMethod,
    paramName: 'Upload',
    clickable: '#upload-button',
    ...sectionConfig.dropzoneOptions,
  };

  const canEdit = folder.canEdit && enableDropzone;

  const galleryClasses = [
    'panel', 'panel--padded', 'panel--scrollable', 'gallery__main', 'fill-height',
  ];
  if (type === ACTION_TYPES.INSERT) {
    galleryClasses.push('insert-media-modal__main');
  }

  const cssClasses = galleryClasses;
  if (hasOpenedItem()) {
    cssClasses.push('gallery__main--has-opened-item');
  }

  const canSelect = view === 'tile' && type === ACTION_TYPES.ADMIN;

  return (
    <div
      className="flexbox-area-grow gallery__outer"
      ref={galleryRef}
    >
      {renderTransitionBulkActions()}
      <Selectable
        isEnabled={canSelect}
        onMouseDownOverNonDraggable={handleClearSelection}
        onSelectionChange={handleGroupSelect}
        onShouldStartSelecting={handleShouldStartSelecting}
      >
        <GalleryDND
          onDragStartEnd={(dragging) => handleEnableDropzone(!dragging)}
          onDropFiles={handleMoveFiles}
          selectedFiles={selectedFiles}
          className={galleryClasses.join(' ')}
        >
          {renderToolbar()}
          <AssetDropzone
            name="gallery-container"
            className="flexbox-area-grow"
            canUpload={canEdit}
            onAddedFile={handleAddedFile}
            onPreviewLoaded={handlePreviewLoaded}
            onError={handleFailedUpload}
            onSuccess={handleSuccessfulUpload}
            onQueueComplete={handleQueueComplete}
            onSending={handleSending}
            onUploadProgress={handleUploadProgress}
            preview={dimensions}
            folderId={folderId}
            options={dropzoneOptions}
            securityID={securityId}
            uploadButton={false}
          >
            {messages}
            {renderGalleryView()}
          </AssetDropzone>
        </GalleryDND>
        {loading && <LoadingComponent />}
        <MoveModal
          sectionConfig={sectionConfig}
          folderId={folderId}
          onSuccess={onMoveFilesSuccess}
          onOpenFolder={onOpenFolder}
        />
      </Selectable>
    </div>
  );
};

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
  onRemoveErroredUpload: PropTypes.func,
});

Gallery.propTypes = Object.assign({}, sharedPropTypes, {
  onSuccessfulUpload: PropTypes.func,
  onSuccessfulUploadQueue: PropTypes.func,
  onCreateFolder: PropTypes.func,
  onMoveFilesSuccess: PropTypes.func,
  onPublish: PropTypes.func,
  onUnpublish: PropTypes.func,
  type: PropTypes.oneOf(['insert-media', 'insert-link', ACTION_TYPES.SELECT, ACTION_TYPES.ADMIN]),
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
  actions: PropTypes.object,
  securityId: PropTypes.string,
  onViewChange: PropTypes.func.isRequired,
  createFileApiUrl: PropTypes.string,
  createFileApiMethod: PropTypes.string,
  search: PropTypes.object,
  enableDropzone: PropTypes.bool,
  concatenateSelect: PropTypes.bool,
  GalleryToolbar: PropTypes.elementType,
  sorters: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  BulkActionsComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
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
      toasts: bindActionCreators(toastsActions, dispatch),
      queuedFiles: bindActionCreators(queuedFilesActions, dispatch),
      confirmDeletion: bindActionCreators(confirmDeletionActions, dispatch)
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
    ['GalleryToolbar', 'Loading'],
    (GalleryToolbar, Loading) => ({
      GalleryToolbar,
      LoadingComponent: Loading
    }),
    () => 'AssetAdmin.Gallery',
  ),
  connect(mapStateToProps, mapDispatchToProps),
)(Gallery);

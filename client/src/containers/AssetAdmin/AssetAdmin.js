/* global alert, confirm */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import backend from 'lib/Backend';
import i18n from 'i18n';
import classnames from 'classnames';
import qs from 'qs';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as toastsActions from 'state/toasts/ToastsActions';
import * as queuedFilesActions from 'state/queuedFiles/QueuedFilesActions';
import * as displaySearchActions from 'state/displaySearch/DisplaySearchActions';
import Editor from 'containers/Editor/Editor';
import Gallery from 'containers/Gallery/Gallery';
import Toolbar from 'components/Toolbar/Toolbar';
import Search, { hasFilters } from 'components/Search/Search';
import SearchToggle from 'components/Search/SearchToggle';
import CONSTANTS from 'constants/index';
import configShape from 'lib/configShape';
import Config from 'lib/Config';
import * as confirmDeletionActions from 'state/confirmDeletion/ConfirmDeletionActions';
import getFormSchema from 'lib/getFormSchema';
import getJsonErrorMessage from 'lib/getJsonErrorMessage';
import isEqual from 'lodash.isequal';
import BulkDeleteConfirmation from '../BulkDeleteConfirmation/BulkDeleteConfirmation';
import AssetAdminBreadcrumb from './AssetAdminBreadcrumb';

const AssetAdmin = ({
  dialog,
  sectionConfig,
  fileId,
  folderId,
  resetFileDetails,
  onBrowse,
  onInsertMany,
  getUrl,
  query = {
    sort: '',
    limit: null,
    page: 0,
    filter: {},
  },
  onSubmitEditor,
  type = 'admin',
  queuedFiles,
  actions,
  maxFiles = null,
  fileSelected,
  EditorComponent = Editor,
  GalleryComponent = Gallery,
  SearchComponent = Search,
  BulkDeleteConfirmationComponent = BulkDeleteConfirmation,
  showSearch,
  toolbarChildren,
  requireLinkText,
  viewAction
}) => {
  const [loading, setLoading] = useState(false);
  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [forceRefetch, setForceRefetch] = useState(false);

  /**
   * Get logical folder ID to display
   */
  const getFolderId = () => {
    if (folderId !== null) {
      return folderId;
    }
    if (folder) {
      return folder.id;
    }
    return 0;
  };

  const refetchFolder = () => {
    let queryString = '';
    const hasQuery = query && Object.keys(query).length > 0;
    if (hasQuery) {
      queryString = `?${qs.stringify(query)}`;
    }
    const currentFolderId = getFolderId();
    const sectionConfigVar = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdminOpen');
    const url = `${sectionConfigVar.endpoints.read.url}/${currentFolderId}${queryString}`;
    backend.get(url)
      .then(async (response) => {
        const responseJson = await response.json();
        setLoading(false);
        setFolder(responseJson);
        setFiles(responseJson.children.nodes);
        setTotalCount(responseJson.children.pageInfo.totalCount);
      })
      .catch(async (err) => {
        setLoading(false);
        setFolder(null);
        setFiles([]);
        setTotalCount(0);
        const message = await getJsonErrorMessage(err);
        actions.toasts.error(message);
      });
  };

  const getFiles = () => {
    // Exclude uploaded files that have been reloaded from the server
    const combinedFilesList = [
      ...queuedFiles
        .items
        .filter(item =>
          (!item.id || !files.find(file => file.id === item.id)) &&
          (!item.hasOwnProperty('uploadedToFolderId') || item.uploadedToFolderId === folderId)
        ),
      ...files,
    ];
    // Separate folder and files then return an array with folders at the top (for table view)
    const foldersList = combinedFilesList.filter((file) => file.type === 'folder');
    const filesList = combinedFilesList.filter((file) => file.type !== 'folder');
    return foldersList.concat(filesList);
  };

  /**
   * Handles browsing within this section.
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object|null} [query]
   */
  const handleBrowse = (browseFolderId, browseFileId, browseQuery) => {
    if (typeof onBrowse === 'function') {
      const shouldForceRefetch = !isEqual(browseQuery, query);
      onBrowse(browseFolderId, browseFileId, browseQuery);
      if (shouldForceRefetch) {
        setForceRefetch(true);
      }
    }
    if (browseFolderId !== getFolderId()) {
      actions.gallery.deselectFiles();
    }
  };

  /**
   * Handles when the pagination page changes
   *
   * @param {number} page
   */
  const handleSetPage = (page) => {
    handleBrowse(
      getFolderId(),
      fileId,
      Object.assign({}, query, { page })
    );
    setForceRefetch(true);
  };

  /**
   * Reset to new search results page
   *
   * @param {Object} data
   */
  const handleDoSearch = (data) => {
    actions.gallery.deselectFiles();
    actions.queuedFiles.purgeUploadQueue();
    handleBrowse(
      data.currentFolderOnly ? getFolderId() : 0,
      null,
      { filter: data, view: query.view }
    );
  };

  /**
   * Handle for opening a folder
   *
   * @param {number} folderId
   */
  const handleOpenFolder = (targetFolderId) => {
    // Reset any potential search filters and pagination, but keep other view options
    const { page, filter, ...restQuery } = query;
    handleBrowse(targetFolderId, null, restQuery);
  };

  /**
   * Reset to non-search page
   *
   * @param event
   */
  const handleClearSearch = (event) => {
    actions.displaySearch.closeSearch();
    actions.gallery.deselectFiles();
    actions.queuedFiles.purgeUploadQueue();
    handleOpenFolder(event, folder);
  };

  /**
   * Handles configuring sorting with browsing history.onOpenFolder
   *
   * @param {string} sort
   */
  const handleSort = (sort) => {
    handleBrowse(
      getFolderId(),
      fileId,
      {
        ...query,
        sort,
        limit: undefined,
        page: undefined,
      }
    );
    setForceRefetch(true);
  };

  /**
   * Handles when the view for the component changes
   *
   * @param {string} view
   */
  const handleViewChange = (view) => {
    handleBrowse(
      getFolderId(),
      fileId,
      Object.assign({}, query, { view })
    );
  };

  /**
   * Navigate to parent folder
   *
   * @param {Object} event
   */
  const handleBackButtonClick = (event) => {
    event.preventDefault();
    actions.gallery.deselectFiles();
    if (folder) {
      handleOpenFolder(folder.parentId || 0);
    } else {
      handleOpenFolder(0);
    }
  };

  const resetFile = (file) => {
    if (file.queuedId) {
      actions.queuedFiles.removeQueuedFile(file.queuedId);
    }
    if (fileId === file.id) {
      resetFileDetails(getFolderId(), file.id, query);
    }
  };

  /**
   * Updates url to open the file in editor
   *
   * @param fileId
   */
  const handleOpenFile = (targetFileId) => {
    // Retain existing query, e.g. to stay within search results when viewing a file
    handleBrowse(getFolderId(), targetFileId, query);
  };

  /**
   * Handler for when the folder icon is clicked (to edit the folder)
   */
  const handleFolderIcon = () => {
    handleOpenFile(getFolderId());
  };

  /**
   * Find a file by id in all files (files + queued)
   *
   * @param {Number|String} fileId
   * @return {object}
   */
  const findFile = (targetFileId) => {
    const allFiles = getFiles();

    return allFiles.find((item) => item.id === parseInt(targetFileId, 10));
  };

  /**
   * Handle for closing the editor
   */
  const handleCloseFile = () => {
    handleBrowse(getFolderId(), null, query);
  };

  /**
   * Delete files or folders
   *
   * @param {array} ids
   */
  const handleDelete = (ids) => {
    actions.confirmDeletion.deleting();
    const filesToDelete = ids.map(id => {
      const result = findFile(id);
      if (!result) {
        throw new Error(`File selected for deletion cannot be found: ${id}`);
      }
      if (result.queuedId) {
        actions.queuedFiles.removeQueuedFile(result.queuedId);
      }
      return result;
    });
    const fileIDs = filesToDelete.map(file => file.id);
    const parentId = folder ? folder.id : 0;
    const url = sectionConfig.endpoints.delete.url;
    return backend.post(url, {
      ids: fileIDs,
    }, {
      'X-SecurityID': Config.get('SecurityID')
    })
      .then(() => {
        handleBrowse(parentId, null, query);
        const queuedFilesList = queuedFiles.items.filter((file) => (
          fileIDs.includes(file.id)
        ));
        queuedFilesList.forEach((file) => {
          if (file.queuedId) {
            actions.queuedFiles.removeQueuedFile(file.queuedId);
          }
        });
        let transKey = 'AssetAdmin.BULK_ACTIONS_DELETE_SUCCESS_02';
        let transDefault = '%s folders/files were successfully deleted.';
        if (sectionConfig.filesAreVersioned && sectionConfig.archiveFiles) {
          transKey = 'AssetAdmin.BULK_ACTIONS_ARCHIVE_SUCCESS_02';
          transDefault = '%s folders/files were successfully archived.';
        }
        actions.toasts.success(
          i18n.sprintf(
            i18n._t(transKey, transDefault),
            fileIDs.length
          )
        );
        actions.gallery.deselectFiles();
        refetchFolder();
      })
      .catch(async (err) => {
        const message = await getJsonErrorMessage(err);
        actions.toasts.error(message);
      })
      .finally(() => actions.confirmDeletion.reset());
  };

  /**
   * Unpublish files
   *
   * @param {array} ids
   * @return {Promise}
   */
  const doUnpublish = (ids) => {
    const filesToUnpublish = ids.map(id => {
      const result = findFile(id);
      if (!result) {
        throw new Error(`File selected for unpublishing cannot be found: ${id}`);
      } else if (result.type === 'folder') {
        throw new Error('Cannot unpublish folders');
      }
      return result;
    });
    const fileIDs = filesToUnpublish.map(file => file.id);
    // First make a call to api/readLiveOwnerCounts to check if any of the files are being used by other published content
    // If they are, display a confirmation to the user
    // If the user confirms, make a second call to api/unpublish to actually unpublish the files
    const queryString = fileIDs.map(id => `ids[]=${id}`).join('&');
    let url = `${sectionConfig.endpoints.readLiveOwnerCounts.url}?${queryString}`;
    return backend.get(url)
      .then(async (response) => {
        const responseJson = await response.json();
        // Display a maximum of 4 messages about individual file usage, any beyond that are 'the rest'
        // Note that if there are no live owners then this logic will be largely skipped
        const filesWithLiveUsage = responseJson.filter(fileObj => fileObj.count > 0);
        const displayedMessages = filesWithLiveUsage.slice(0, 4).map(fileObj => fileObj.message);
        const theRestLength = filesWithLiveUsage.slice(5).length;
        let theRestMessage = '';
        if (theRestLength > 0) {
          theRestMessage = i18n.inject(
            i18n._t(
              'AssetAdmin.BULK_OWNED_WARNING_REMAINING',
              'And {count} other file(s)'
            ),
            { count: theRestLength },
          );
        }
        if (displayedMessages.length) {
          const confirmationMessage = [
            i18n.inject(
              i18n._t(
                'AssetAdmin.BULK_OWNED_WARNING_HEADING',
                '{count} file(s) are being used by other published content.'
              ),
              { count: displayedMessages.length },
            ),
            ...displayedMessages,
            theRestMessage,
            i18n._t(
              'AssetAdmin.BULK_OWNED_WARNING_FOOTER',
              'Unpublishing will only remove files from the published version of the content. They will remain on the draft version. Unpublish anyway?'
            )
          ].filter(s => s).join('\n\n');
            // eslint-disable-next-line no-alert
          if (!confirm(confirmationMessage)) {
            return Promise.reject();
          }
        }
        return Promise.resolve();
      })
      .then(() => {
        url = sectionConfig.endpoints.unpublish.url;
        return backend.post(url, {
          ids: fileIDs,
        }, {
          'X-SecurityID': Config.get('SecurityID')
        })
          .catch(async (err) => {
            const message = await getJsonErrorMessage(err);
            actions.toasts.error(message);
          });
      })
      .then(() => {
        refetchFolder();
        return filesToUnpublish;
      })
      .catch(async (err) => {
        const message = await getJsonErrorMessage(err);
        actions.toasts.error(message);
        return [];
      });
  };

  /**
   * Unpublish files and update the UI
   *
   * @param {array} fileIds
   */
  const handleUnpublish = (fileIds) => doUnpublish(fileIds).then((filesToUnpublish) => {
    refetchFolder()
      .then(() => {
        if (fileId && filesToUnpublish.find(file => file.id === fileId)) {
          resetFileDetails(getFolderId(), fileId, query);
        }
      });
  });

  /**
   * Publish files
   *
   * @param {array} ids
   * @return {Promise}
   */
  const doPublish = (ids) => {
    const filesToPublish = ids.map(id => {
      const result = findFile(id);
      if (!result) {
        throw new Error(`File selected for publishing cannot be found: ${id}`);
      } else if (result.type === 'folder') {
        throw new Error('Cannot publish folders');
      }
      return result;
    });
    const fileIDs = filesToPublish.map(file => file.id);
    const url = sectionConfig.endpoints.publish.url;
    return backend.post(url, {
      ids: fileIDs,
    }, {
      'X-SecurityID': Config.get('SecurityID')
    })
      .then(() => {
        filesToPublish.forEach(file => resetFile(file));
        refetchFolder();
        return filesToPublish;
      })
      .catch(async (err) => {
        const message = await getJsonErrorMessage(err);
        actions.toasts.error(message);
      });
  };

  const handleUpload = () => {
    // noop
  };

  const handleUploadQueue = () => {
    refetchFolder();
  };

  const handleCreateFolder = () => {
    onBrowse(
      getFolderId(),
      null,
      query,
      CONSTANTS.ACTIONS.CREATE_FOLDER
    );
  };

  const handleMoveFilesSuccess = (targetFolderId, fileIds) => {
    const filesToMove = queuedFiles.items.filter((file) => (
      fileIds.includes(file.id)
    ));
    filesToMove.forEach((file) => {
      if (file.queuedId) {
        actions.queuedFiles.removeQueuedFile(file.queuedId);
      }
    });
    actions.gallery.deselectFiles();
    refetchFolder();
  };

  /**
   * Handler for when the editor is submitted
   *
   * @param {object} data
   * @param {string} action
   * @param {function} submitFn
   * @returns {Promise}
   */
  const handleSubmitEditor = (data, action, submitFn) => {
    let promise = null;
    if (action === 'action_insert' && type === 'select') {
      const allFiles = getFiles();
      const fileToInsert = allFiles.find(item => item.id === parseInt(data.ID, 10));
      onInsertMany(null, [fileToInsert]);
      setForceRefetch(true);
      return Promise.resolve();
    }
    if (typeof onSubmitEditor === 'function') {
      const fileToSubmit = findFile(fileId);
      promise = onSubmitEditor(data, action, submitFn, fileToSubmit);
    } else {
      promise = submitFn();
    }
    if (!promise) {
      throw new Error('Promise was not returned for submitting');
    }
    return promise
      .then((response) => {
        if (action === 'action_createfolder') {
          if (type === 'admin') {
            // open the new folder in edit mode after save completes
            handleOpenFile(response.record.id);
          } else {
            // open the containing folder, since folder edit mode isn't desired
            handleOpenFolder(getFolderId());
          }
        } else if ((action === 'action_save' || action === 'action_publish')
          && getFolderId() !== response.record.parent.id) {
          // If the file was moved, open the folder containing the file was moved to
          handleBrowse(response.record.parent.id, response.record.id, {});
        }
        return response;
      }).then(() => {
        setForceRefetch(true);
      }).catch(async (err) => {
        const message = await getJsonErrorMessage(err);
        actions.toasts.error(message);
        throw err;
      });
  };

  /**
   * Generates the Gallery react component to render with
   *
   * @returns {object}
   */
  const renderGallery = () => {
    const config = sectionConfig;
    const createFileApiUrl = config.endpoints.createFile.url;
    const createFileApiMethod = config.endpoints.createFile.method;
    const limit = query && parseInt(query.limit || config.limit, 10);
    const page = query && parseInt(query.page || 1, 10);
    const sort = query && query.sort;
    const view = query && query.view;
    const filters = query.filter || {};
    return (
      <GalleryComponent
        files={getFiles()}
        fileId={fileId}
        folderId={getFolderId()}
        folder={folder}
        type={type}
        limit={limit}
        page={page}
        totalCount={totalCount}
        view={view}
        filters={filters}
        createFileApiUrl={createFileApiUrl}
        createFileApiMethod={createFileApiMethod}
        onInsertMany={onInsertMany}
        onPublish={doPublish}
        onUnpublish={doUnpublish}
        onOpenFile={handleOpenFile}
        onOpenFolder={handleOpenFolder}
        onSuccessfulUpload={handleUpload}
        onSuccessfulUploadQueue={handleUploadQueue}
        onCreateFolder={handleCreateFolder}
        onMoveFilesSuccess={handleMoveFilesSuccess}
        onClearSearch={handleClearSearch}
        onSort={handleSort}
        onSetPage={handleSetPage}
        onViewChange={handleViewChange}
        sort={sort}
        sectionConfig={config}
        loading={loading}
        maxFilesSelect={maxFiles}
        dialog={dialog}
      />
    );
  };

  /**
   * Generates the Editor react component to render with
   *
   * @returns {object}
   */
  const renderEditor = () => {
    const config = sectionConfig;
    const { schemaUrl, targetId } = getFormSchema({
      config,
      viewAction,
      folderId: getFolderId(),
      type,
      fileId,
    });

    if (!schemaUrl) {
      return null;
    }

    const schemaUrlQueries = [];
    if (requireLinkText) {
      schemaUrlQueries.push({ name: 'requireLinkText', value: true });
    }

    if (fileSelected) {
      schemaUrlQueries.push({ name: 'fileSelected', value: true });
    }

    const editorProps = {
      dialog,
      fileId: targetId,
      schemaUrl,
      schemaUrlQueries,
      onClose: handleCloseFile,
      onSubmit: handleSubmitEditor,
      onUnpublish: handleUnpublish,
      addToCampaignSchemaUrl: config.form.addToCampaignForm?.schemaUrl
    };

    return <EditorComponent {...editorProps} />;
  };

  useEffect(() => {
    refetchFolder();
  }, [folderId]);

  useEffect(() => {
    if (forceRefetch) {
      refetchFolder();
      setForceRefetch(false);
    }
  }, [forceRefetch]);

  if (folder === null) {
    return null;
  }

  const showBackButton = Boolean(folderId || hasFilters(query.filter));
  const searchFormSchemaUrl = sectionConfig.form.fileSearchForm.schemaUrl;
  const filters = query.filter || {};
  const classNames = classnames(
    'fill-height asset-admin',
    type === 'select' && {
      'asset-admin--single-select': maxFiles === 1,
      'asset-admin--multi-select': maxFiles !== 1,
    }
  );
  const showSearchDisplay = hasFilters(query.filter) || showSearch;
  const onSearchToggle = actions.displaySearch ?
    actions.displaySearch.toggleSearch :
    undefined;
  const breadcrumbProps = {
    folder,
    query,
    getUrl,
    onBrowse: handleBrowse,
    onFolderIcon: handleFolderIcon
  };

  return (
    <div className={classNames}>
      <Toolbar
        showBackButton={showBackButton}
        onBackButtonClick={handleBackButtonClick}
      >
        {folder && <AssetAdminBreadcrumb {...breadcrumbProps} />}
        <div className="asset-admin__toolbar-extra pull-xs-right fill-width vertical-align-items">
          <SearchToggle toggled={showSearchDisplay} onToggle={onSearchToggle} />
          {toolbarChildren}
        </div>
      </Toolbar>
      {showSearchDisplay && <SearchComponent
        onSearch={handleDoSearch}
        id="AssetSearchForm"
        formSchemaUrl={searchFormSchemaUrl}
        onHide={handleClearSearch}
        displayBehavior="HIDEABLE"
        filters={filters}
        name="name"
      />}
      <div className="flexbox-area-grow fill-width fill-height gallery">
        {renderGallery()}
        {renderEditor()}
      </div>
      <BulkDeleteConfirmationComponent
        onConfirm={handleDelete}
        filesAreVersioned={sectionConfig.filesAreVersioned}
        archiveFiles={sectionConfig.archiveFiles}
      />
    </div>
  );
};

AssetAdmin.propTypes = {
  dialog: PropTypes.bool,
  sectionConfig: configShape,
  fileId: PropTypes.number,
  folderId: PropTypes.number,
  resetFileDetails: PropTypes.func,
  onBrowse: PropTypes.func,
  onReplaceUrl: PropTypes.func,
  onInsertMany: PropTypes.func,
  getUrl: PropTypes.func,
  query: PropTypes.shape({
    sort: PropTypes.string,
    limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    filter: PropTypes.object,
  }),
  onSubmitEditor: PropTypes.func,
  type: PropTypes.oneOf(['insert-media', 'insert-link', 'select', 'admin']),
  queuedFiles: PropTypes.shape({
    items: PropTypes.array.isRequired,
  }),
  filesTotalCount: PropTypes.number,
  loading: PropTypes.bool,
  actions: PropTypes.object,
  maxFiles: PropTypes.number,
  fileSelected: PropTypes.bool,
  EditorComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  GalleryComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  SearchComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  BulkDeleteConfirmationComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  showSearch: PropTypes.bool,
  toolbarChildren: PropTypes.node,
  requireLinkText: PropTypes.bool,
  viewAction: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  const { formSchema } = state.assetAdmin.modal;
  return {
    securityId: state.config.SecurityID,
    queuedFiles: state.assetAdmin.queuedFiles,
    showSearch: state.assetAdmin.displaySearch.isOpen,
    type: (formSchema && formSchema.type) || ownProps.type,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: bindActionCreators(galleryActions, dispatch),
      toasts: bindActionCreators(toastsActions, dispatch),
      displaySearch: bindActionCreators(displaySearchActions, dispatch),
      queuedFiles: bindActionCreators(queuedFilesActions, dispatch),
      confirmDeletion: bindActionCreators(confirmDeletionActions, dispatch)
    },
  };
}

export { AssetAdmin as Component };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AssetAdmin);

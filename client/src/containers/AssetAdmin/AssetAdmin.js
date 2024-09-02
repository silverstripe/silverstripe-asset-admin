/* global alert, confirm */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import backend from 'lib/Backend';
import i18n from 'i18n';
import classnames from 'classnames';
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
import BulkDeleteConfirmation from '../BulkDeleteConfirmation/BulkDeleteConfirmation';
import AssetAdminBreadcrumb from './AssetAdminBreadcrumb';

class AssetAdmin extends Component {
  constructor(props) {
    super(props);

    this.handleOpenFile = this.handleOpenFile.bind(this);
    this.handleCloseFile = this.handleCloseFile.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.doPublish = this.doPublish.bind(this);
    this.doUnpublish = this.doUnpublish.bind(this);
    this.handleUnpublish = this.handleUnpublish.bind(this);
    this.handleDoSearch = this.handleDoSearch.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleSubmitEditor = this.handleSubmitEditor.bind(this);
    this.handleOpenFolder = this.handleOpenFolder.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
    this.createEndpoint = this.createEndpoint.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleFolderIcon = this.handleFolderIcon.bind(this);
    this.handleBrowse = this.handleBrowse.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleUploadQueue = this.handleUploadQueue.bind(this);
    this.handleCreateFolder = this.handleCreateFolder.bind(this);
    this.handleMoveFilesSuccess = this.handleMoveFilesSuccess.bind(this);
    this.refetchFolder = this.refetchFolder.bind(this);

    this.state = {
      loading: false,
      folder: null,
      files: [],
      totalCount: 0,
      forceRefetch: false,
    };
  }

  componentDidMount() {
    this.refetchFolder();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.folderId !== prevProps.folderId)
      || ((this.props.fileId !== prevProps.fileId) && this.props.fileId !== 0)
      || this.state.forceRefetch
    ) {
      this.refetchFolder();
    }
    if (this.state.forceRefetch) {
      this.setState({
        forceRefetch: false
      });
    }
  }

  /**
   * Get logical folder ID to display
   */
  getFolderId() {
    if (this.props.folderId !== null) {
      return this.props.folderId;
    }
    if (this.state.folder) {
      return this.state.folder.id;
    }
    return 0;
  }

  refetchFolder() {
    const folderId = this.getFolderId();
    // Fetch child files in the folder
    const urlParams = new URLSearchParams(window.location.search);
    const qsParams = [];
    urlParams.forEach((value, key) => {
      // "page" is pagination
      // "filter" is for search
      // "sort" is for sort e.g. "title,desc"
      if (key === 'page' || key.substring(0, 6) === 'filter' || key.substring(0, 4) === 'sort') {
        qsParams.push(`${key}=${value}`);
      }
    });
    let qs = '';
    if (qsParams.length) {
      qs = `?${qsParams.join('&')}`;
    }
    // do not set loading state to true here, because it will cause an ugly flicker
    const sectionConfig = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdminOpen');
    const url = `${sectionConfig.endpoints.read.url}/${folderId}${qs}`;

    backend.get(url)
      .then(async (response) => {
        const responseJson = await response.json();
        this.setState({
          loading: false,
          folder: responseJson,
          files: responseJson.children.nodes,
          totalCount: responseJson.children.pageInfo.totalCount,
        });
      })
      .catch(async (err) => {
        this.setState({
          loading: false,
          folder: null,
          files: [],
          totalCount: 0,
        });
        const message = await getJsonErrorMessage(err);
        this.props.actions.toasts.error(message);
      });
  }

  getFiles() {
    const {
      queuedFiles,
      folderId
    } = this.props;

    const files = this.state.files;

    const combinedFilesList = [
      // Exclude uploaded files that have been reloaded from the server
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
  }

  /**
   * Handles browsing within this section.
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object|null} [query]
   */
  handleBrowse(folderId, fileId, query) {
    if (typeof this.props.onBrowse === 'function') {
      // for Higher-order component with a router handler
      this.props.onBrowse(folderId, fileId, query);
      this.setState({
        forceRefetch: true,
      });
    }
    if (folderId !== this.getFolderId()) {
      this.props.actions.gallery.deselectFiles();
    }
  }

  /**
   * Handles when the pagination page changes
   *
   * @param {number} page
   */
  handleSetPage(page) {
    this.handleBrowse(
      this.getFolderId(),
      this.props.fileId,
      Object.assign({}, this.props.query, { page })
    );
    this.setState({
      forceRefetch: true,
    });
  }

  /**
   * Reset to new search results page
   *
   * @param {Object} data
   */
  handleDoSearch(data) {
    this.props.actions.gallery.deselectFiles();
    this.props.actions.queuedFiles.purgeUploadQueue();
    this.handleBrowse(
      data.currentFolderOnly ? this.getFolderId() : 0,
      null,
      // Reset current query, retain "view" type
      { filter: data, view: this.props.query.view }
    );
  }

  /**
   * Reset to non-search page
   *
   * @param event
   */
  handleClearSearch(event) {
    this.props.actions.displaySearch.closeSearch();
    this.props.actions.gallery.deselectFiles();
    this.props.actions.queuedFiles.purgeUploadQueue();
    this.refetchFolder();
    const folder = this.state.folder;
    this.handleOpenFolder(event, folder);
  }

  /**
   * Handles configuring sorting with browsing history.onOpenFolder
   *
   * @param {string} sort
   */
  handleSort(sort) {
    this.handleBrowse(
      this.getFolderId(),
      this.props.fileId,
      {
        ...this.props.query,
        sort,
        // clear pagination
        limit: undefined,
        page: undefined,
      }
    );
    this.setState({
      forceRefetch: true
    });
  }

  /**
   * Handles when the view for the component changes
   *
   * @param {string} view
   */
  handleViewChange(view) {
    this.handleBrowse(
      this.getFolderId(),
      this.props.fileId,
      Object.assign({}, this.props.query, { view })
    );
  }

  /**
   * Create a new endpoint
   *
   * @param {Object} endpointConfig
   * @param {Boolean} includeToken
   * @returns {Function}
   */
  createEndpoint(endpointConfig, includeToken = true) {
    return backend.createEndpointFetcher(Object.assign(
      {},
      endpointConfig,
      includeToken ? { defaultData: { SecurityID: this.props.securityId } } : {}
    ));
  }

  /**
   * Navigate to parent folder
   *
   * @param {Object} event
   */
  handleBackButtonClick(event) {
    event.preventDefault();
    this.props.actions.gallery.deselectFiles();
    const folder = this.state.folder;
    if (folder) {
      this.handleOpenFolder(folder.parentId || 0);
    } else {
      this.handleOpenFolder(0);
    }
  }

  resetFile(file) {
    if (file.queuedId) {
      this.props.actions.queuedFiles.removeQueuedFile(file.queuedId);
    }
    // If the file is currently being edited, refresh that view
    if (this.props.fileId === file.id) {
      this.props.resetFileDetails(this.getFolderId(), file.id, this.props.query);
    }
  }

  /**
   * Handler for when the folder icon is clicked (to edit the folder)
   */
  handleFolderIcon() {
    this.handleOpenFile(this.getFolderId());
  }

  /**
   * Updates url to open the file in editor
   *
   * @param fileId
   */
  handleOpenFile(fileId) {
    // Retain existing query, e.g. to stay within search results when viewing a file
    this.handleBrowse(this.getFolderId(), fileId, this.props.query);
  }

  /**
   * Handler for when the editor is submitted
   *
   * @param {object} data
   * @param {string} action
   * @param {function} submitFn
   * @returns {Promise}
   */
  handleSubmitEditor(data, action, submitFn) {
    let promise = null;

    if (action === 'action_insert' && this.props.type === 'select') {
      const files = this.getFiles();
      const file = files.find(item => item.id === parseInt(data.ID, 10));

      this.props.onInsertMany(null, [file]);
      this.setState({
        forceRefetch: true
      });
      return Promise.resolve();
    }

    if (typeof this.props.onSubmitEditor === 'function') {
      // Look for file first in `files`, then `queuedFiles` property
      const file = this.findFile(this.props.fileId);
      promise = this.props.onSubmitEditor(data, action, submitFn, file);
    } else {
      promise = submitFn();
    }

    if (!promise) {
      throw new Error('Promise was not returned for submitting');
    }
    this.setState({
      forceRefetch: true
    });
    return promise
      .then((response) => {
        if (action === 'action_createfolder') {
          if (this.props.type === 'admin') {
            // open the new folder in edit mode after save completes
            this.handleOpenFile(response.record.id);
          } else {
            // open the containing folder, since folder edit mode isn't desired
            this.handleOpenFolder(this.getFolderId());
          }
        } else if ((action === 'action_save' || action === 'action_publish')
          && this.getFolderId() !== response.record.parent.id) {
          // If the file was moved, open the folder containing the file was moved to
          this.handleBrowse(response.record.parent.id, response.record.id, null);
        }
        return response;
      });
  }

  /**
   * Handle for closing the editor
   */
  handleCloseFile() {
    this.handleBrowse(this.getFolderId(), null, this.props.query);
  }

  /**
   * Handle for opening a folder
   *
   * @param {number} folderId
   */
  handleOpenFolder(folderId) {
    // Reset any potential search filters and pagination, but keep other view options
    const { page, filter, ...query } = this.props.query;
    this.handleBrowse(folderId, null, query);
  }

  /**
   * Delete files or folders
   *
   * @param {array} ids
   */
  handleDelete(ids) {
    this.props.actions.confirmDeletion.deleting();

    const files = ids.map(id => {
      const result = this.findFile(id);
      if (!result) {
        throw new Error(`File selected for deletion cannot be found: ${id}`);
      }
      if (result.queuedId) {
        this.props.actions.queuedFiles.removeQueuedFile(result.queuedId);
      }
      return result;
    });

    const fileIDs = files.map(file => file.id);
    const folder = this.state.folder;
    const parentId = folder ? folder.id : 0;

    const url = this.props.sectionConfig.endpoints.delete.url;
    return backend.post(url, {
      ids: fileIDs,
    }, {
      'X-SecurityID': Config.get('SecurityID')
    })
      .then(() => {
        this.handleBrowse(parentId, null, this.props.query);
        const queuedFiles = this.props.queuedFiles.items.filter((file) => (
          fileIDs.includes(file.id)
        ));
        queuedFiles.forEach((file) => {
          if (file.queuedId) {
            this.props.actions.queuedFiles.removeQueuedFile(file.queuedId);
          }
        });
        let transKey = 'AssetAdmin.BULK_ACTIONS_DELETE_SUCCESS_02';
        let transDefault = '%s folders/files were successfully deleted.';
        if (this.props.sectionConfig.filesAreVersioned && this.props.sectionConfig.archiveFiles) {
          transKey = 'AssetAdmin.BULK_ACTIONS_ARCHIVE_SUCCESS_02';
          transDefault = '%s folders/files were successfully archived.';
        }
        this.props.actions.toasts.success(
          i18n.sprintf(
            i18n._t(transKey, transDefault),
            fileIDs.length
          )
        );
        this.props.actions.gallery.deselectFiles();
        this.refetchFolder();
      })
      .catch(async (err) => {
        const message = await getJsonErrorMessage(err);
        this.props.actions.toasts.error(message);
      })
      .finally(() => this.props.actions.confirmDeletion.reset());
  }

  /**
   * Unpublish files
   *
   * @param {array} ids
   * @return {Promise}
   */
  doUnpublish(ids) {
    const files = ids.map(id => {
      const result = this.findFile(id);
      if (!result) {
        throw new Error(`File selected for unpublishing cannot be found: ${id}`);
      } else if (result.type === 'folder') {
        throw new Error('Cannot unpublish folders');
      }

      return result;
    });
    const fileIDs = files.map(file => file.id);
    // First make a call to api/readLiveOwnerCounts to check if any of the files are being used by other published content
    // If they are, display a confirmation to the user
    // If the user confirms, make a second call to api/unpublish to actually unpublish the files
    const qs = fileIDs.map(id => `ids[]=${id}`).join('&');
    let url = `${this.props.sectionConfig.endpoints.readLiveOwnerCounts.url}?${qs}`;
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
        url = this.props.sectionConfig.endpoints.unpublish.url;
        return backend.post(url, {
          ids: fileIDs,
        }, {
          'X-SecurityID': Config.get('SecurityID')
        })
          .catch(async (err) => {
            const message = await getJsonErrorMessage(err);
            this.props.actions.toasts.error(message);
          });
      })
      .then(() => {
        this.refetchFolder();
        return files;
      })
      .catch(async (err) => {
        const message = await getJsonErrorMessage(err);
        this.props.actions.toasts.error(message);
        return [];
      });
  }

  /**
   * Unpublish files and update the UI
   *
   * @param {array} fileIds
   */
  handleUnpublish(fileIds) {
    return this.doUnpublish(fileIds).then((files) => {
      const { fileId } = this.props;
      this.refetchFolder()
        .then(() => {
          if (fileId && files.find(file => file.id === fileId)) {
            this.props.resetFileDetails(this.getFolderId(), fileId, this.props.query);
          }
        });
    });
  }

  /**
   * Publish files
   *
   * @param {array} ids
   * @return {Promise}
   */
  doPublish(ids) {
    const files = ids.map(id => {
      const result = this.findFile(id);
      if (!result) {
        throw new Error(`File selected for publishing cannot be found: ${id}`);
      } else if (result.type === 'folder') {
        throw new Error('Cannot publish folders');
      }

      return result;
    });

    const fileIDs = files.map(file => file.id);
    const url = this.props.sectionConfig.endpoints.publish.url;
    return backend.post(url, {
      ids: fileIDs,
    }, {
      'X-SecurityID': Config.get('SecurityID')
    })
      .then(() => {
        files.forEach(file => this.resetFile(file));
        this.refetchFolder();
        return files;
      })
      .catch(async (err) => {
        const message = await getJsonErrorMessage(err);
        this.props.actions.toasts.error(message);
      });
  }

  /**
   * Find a file by id in all files (files + queued)
   *
   * @param {Number|String} fileId
   * @return {object}
   */
  findFile(fileId) {
    const allFiles = this.getFiles();

    return allFiles.find((item) => item.id === parseInt(fileId, 10));
  }

  handleUpload() {
    // noop
  }

  handleUploadQueue() {
    // A bit of coupling. If the editor isn't open, the gallery will automatically
    // open a file and force a refresh, so we have to guard against a double refresh.
    if (this.props.fileId) {
      this.refetchFolder();
    }
  }

  handleCreateFolder() {
    this.props.onBrowse(
      this.getFolderId(),
      null,
      this.props.query,
      CONSTANTS.ACTIONS.CREATE_FOLDER
    );
  }

  handleMoveFilesSuccess(folderId, fileIds) {
    const files = this.props.queuedFiles.items.filter((file) => (
      fileIds.includes(file.id)
    ));

    files.forEach((file) => {
      if (file.queuedId) {
        this.props.actions.queuedFiles.removeQueuedFile(file.queuedId);
      }
    });

    this.props.actions.gallery.deselectFiles();
    this.refetchFolder();
  }

  /**
   * Generates the Gallery react component to render with
   *
   * @returns {object}
   */
  renderGallery() {
    const { GalleryComponent } = this.props;
    const config = this.props.sectionConfig;
    const createFileApiUrl = config.endpoints.createFile.url;
    const createFileApiMethod = config.endpoints.createFile.method;

    const limit = this.props.query && parseInt(this.props.query.limit || config.limit, 10);
    const page = this.props.query && parseInt(this.props.query.page || 1, 10);

    const sort = this.props.query && this.props.query.sort;
    const view = this.props.query && this.props.query.view;
    const filters = this.props.query.filter || {};

    const folder = this.state.folder;
    const loading = this.state.loading;

    return (
      <GalleryComponent
        files={this.getFiles()}
        fileId={this.props.fileId}
        folderId={this.getFolderId()}
        folder={folder}
        type={this.props.type}
        limit={limit}
        page={page}
        totalCount={this.state.totalCount}
        view={view}
        filters={filters}
        createFileApiUrl={createFileApiUrl}
        createFileApiMethod={createFileApiMethod}
        onInsertMany={this.props.onInsertMany}
        onPublish={this.doPublish}
        onUnpublish={this.doUnpublish}
        onOpenFile={this.handleOpenFile}
        onOpenFolder={this.handleOpenFolder}
        onSuccessfulUpload={this.handleUpload}
        onSuccessfulUploadQueue={this.handleUploadQueue}
        onCreateFolder={this.handleCreateFolder}
        onMoveFilesSuccess={this.handleMoveFilesSuccess}
        onClearSearch={this.handleClearSearch}
        onSort={this.handleSort}
        onSetPage={this.handleSetPage}
        onViewChange={this.handleViewChange}
        sort={sort}
        sectionConfig={config}
        loading={loading}
        maxFilesSelect={this.props.maxFiles}
        dialog={this.props.dialog}
      />
    );
  }

  /**
   * Generates the Editor react component to render with
   *
   * @returns {object}
   */
  renderEditor() {
    const {
      sectionConfig: config,
      viewAction,
      type,
      fileId,
      dialog,
      requireLinkText,
      fileSelected,
      EditorComponent
    } = this.props;
    const { schemaUrl, targetId } = getFormSchema({
      config,
      viewAction,
      folderId: this.getFolderId(),
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
      onClose: this.handleCloseFile,
      onSubmit: this.handleSubmitEditor,
      onUnpublish: this.handleUnpublish,
      addToCampaignSchemaUrl: config.form.addToCampaignForm.schemaUrl
    };

    return <EditorComponent {...editorProps} />;
  }

  render() {
    const { folderId, query, getUrl, type, maxFiles, toolbarChildren, SearchComponent, BulkDeleteConfirmationComponent } = this.props;

    if (this.state.folder === null) {
      return null;
    }

    const showBackButton = Boolean(folderId || hasFilters(query.filter));
    const searchFormSchemaUrl = this.props.sectionConfig.form.fileSearchForm.schemaUrl;
    const filters = query.filter || {};
    const classNames = classnames(
      'fill-height asset-admin',
      type === 'select' && {
        'asset-admin--single-select': maxFiles === 1,
        'asset-admin--multi-select': maxFiles !== 1,
      }
    );
    const showSearch = hasFilters(query.filter) || this.props.showSearch;
    const onSearchToggle = this.props.actions.displaySearch ?
      this.props.actions.displaySearch.toggleSearch :
      undefined;

    const folder = this.state.folder;

    const breadcrumbProps = {
      folder,
      query,
      getUrl,
      onBrowse: this.handleBrowse,
      onFolderIcon: this.handleFolderIcon
    };

    return (
      <div className={classNames}>
        <Toolbar
          showBackButton={showBackButton}
          onBackButtonClick={this.handleBackButtonClick}
        >
          {folder && <AssetAdminBreadcrumb {...breadcrumbProps} />}
          <div className="asset-admin__toolbar-extra pull-xs-right fill-width vertical-align-items">
            <SearchToggle toggled={showSearch} onToggle={onSearchToggle} />
            {toolbarChildren}
          </div>
        </Toolbar>
        {showSearch && <SearchComponent
          onSearch={this.handleDoSearch}
          id="AssetSearchForm"
          formSchemaUrl={searchFormSchemaUrl}
          onHide={this.handleClearSearch}
          displayBehavior="HIDEABLE"
          filters={filters}
          name="name"
        />}
        <div className="flexbox-area-grow fill-width fill-height gallery">
          {this.renderGallery()}
          {this.renderEditor()}
        </div>
        <BulkDeleteConfirmationComponent
          onConfirm={this.handleDelete}
          filesAreVersioned={this.props.sectionConfig.filesAreVersioned}
          archiveFiles={this.props.sectionConfig.archiveFiles}
        />
      </div>
    );
  }
}

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
};

AssetAdmin.defaultProps = {
  type: 'admin',
  query: {
    sort: '',
    limit: null, // set to config default in mapStateToProps
    page: 0,
    filter: {},
  },
  maxFiles: null,
  EditorComponent: Editor,
  GalleryComponent: Gallery,
  SearchComponent: Search,
  BulkDeleteConfirmationComponent: BulkDeleteConfirmation,
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

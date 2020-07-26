/* global alert, confirm */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import backend from 'lib/Backend';
import i18n from 'i18n';
import classnames from 'classnames';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as queuedFilesActions from 'state/queuedFiles/QueuedFilesActions';
import * as displaySearchActions from 'state/displaySearch/DisplaySearchActions';
import Editor from 'containers/Editor/Editor';
import Gallery from 'containers/Gallery/Gallery';
import AssetAdminBreadcrumb from './AssetAdminBreadcrumb';
import Toolbar from 'components/Toolbar/Toolbar';
import { withApollo } from 'react-apollo';
import Search, { hasFilters } from 'components/Search/Search';
import SearchToggle from 'components/Search/SearchToggle';
import deleteFilesMutation from 'state/files/deleteFilesMutation';
import unpublishFilesMutation from 'state/files/unpublishFilesMutation';
import publishFilesMutation from 'state/files/publishFilesMutation';
import CONSTANTS from 'constants/index';
import configShape from 'lib/configShape';
import { injectGraphql } from 'lib/Injector';
import BulkDeleteConfirmation from '../BulkDeleteConfirmation/BulkDeleteConfirmation';
import * as confirmDeletionActions from 'state/confirmDeletion/ConfirmDeletionActions';
import getFormSchema from 'lib/getFormSchema';

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
  }

  componentWillReceiveProps(props) {
    if (!props.loading && props.folder && props.folderId !== props.folder.id) {
      props.onReplaceUrl(props.folder.id, props.fileId, props.query, props.viewAction);
    }
  }

  /**
   * Get logical folder ID to display
   */
  getFolderId() {
    if (this.props.folderId !== null) {
      return this.props.folderId;
    }
    if (this.props.folder) {
      return this.props.folder.id;
    }
    return 0;
  }

  getFiles() {
    const {
      files,
      queuedFiles,
      folderId
    } = this.props;

    const combinedFilesList = [
      // Exclude uploaded files that have been reloaded via graphql
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
  }

  /**
   * Reset to new search results page
   *
   * @param {Object} data
   */
  handleDoSearch(data) {
    this.props.actions.gallery.deselectFiles();
    this.props.actions.queuedFiles.purgeUploadQueue();
    this.props.actions.files.readFiles();
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
    this.props.actions.files.readFiles();
    this.handleOpenFolder(event, this.props.folder);
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
    if (this.props.folder) {
      this.handleOpenFolder(this.props.folder.parentId || 0);
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
      this.handleCloseFile();
      this.handleOpenFile(file.id);
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
    return promise
      .then((response) => {
        if (action === 'action_createfolder' && this.props.type === 'admin') {
          // open the new folder in edit mode after save completes
          this.handleOpenFile(response.record.id);
        }

        // TODO Update GraphQL store with new model,
        // see https://github.com/silverstripe/silverstripe-graphql/issues/14
        return this.props.actions.files.readFiles()
          .then(() => {
            // open the containing folder, since folder edit mode isn't desired
            if (action === 'action_createfolder' && this.props.type !== 'admin') {
              this.handleOpenFolder(this.getFolderId());
            }
            return response;
          });
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
    const parentId = this.props.folder ? this.props.folder.id : 0;

    return this.props.actions.files.deleteFiles(fileIDs, parentId)
      .then(({ data: { deleteFiles } }) => {
        this.handleBrowse(parentId, null, this.props.query);

        const queuedFiles = this.props.queuedFiles.items.filter((file) => (
          fileIDs.includes(file.id)
        ));

        queuedFiles.forEach((file) => {
          if (file.queuedId) {
            this.props.actions.queuedFiles.removeQueuedFile(file.queuedId);
          }
        });

        this.props.actions.files.readFiles();

        return deleteFiles;
      })
      .then((resultItems) => {
        const successes = resultItems.filter((result) => result).length;
        if (successes !== ids.length) {
          this.props.actions.gallery.setErrorMessage(
            i18n.sprintf(
              i18n._t(
                'AssetAdmin.BULK_ACTIONS_DELETE_FAIL',
                '%s folders/files were successfully deleted, but %s files were not able to be deleted.'
              ),
              successes,
              ids.length - successes
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

        return resultItems;
      })
      .finally(this.props.actions.confirmDeletion.reset);
  }

  /**
   * Unpublish files
   *
   * @param {array} ids
   * @param {boolean} force
   * @return {Promise}
   */
  doUnpublish(ids, force = false) {
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
    return this.props.actions.files.unpublishFiles(fileIDs, force)

      .then(({ data: { unpublishFiles } }) => {
        const successes = unpublishFiles.filter(result => result.__typename === 'File');
        const confirmationRequired = unpublishFiles.filter(result => (
          result.__typename === 'PublicationNotice' && result.Type === 'HAS_OWNERS'
        ));
        const successful = successes.map(file => {
          this.resetFile(file);
          return file;
        });
        const displayedMessages = confirmationRequired.slice(0, 4);
        const rest = confirmationRequired.slice(5);
        const body = displayedMessages.map(warning => warning.Message);
        if (rest.length) {
          body.push(
            i18n.inject(
              i18n._t(
                'AssetAdmin.BULK_OWNED_WARNING_REMAINING',
                'And {count} other file(s)'
              ),
              { count: rest.length },
            )
          );
        }
        if (displayedMessages.length) {
          const alertMessage = [
            i18n.inject(
              i18n._t(
                'AssetAdmin.BULK_OWNED_WARNING_HEADING',
                '{count} file(s) are being used by other published content.'
              ),
              { count: confirmationRequired.length },
            ),

            body.join('\n'),

            i18n._t(
              'AssetAdmin.BULK_OWNED_WARNING_FOOTER',
              'Unpublishing will only remove files from the published version of the content. They will remain on the draft version. Unpublish anyway?'
            )
          ];

          // eslint-disable-next-line no-alert
          if (confirm(alertMessage.join('\n\n'))) {
            const secondPassIDs = confirmationRequired.reduce(
              (acc, curr) => acc.concat(curr.IDs),
              []
            );
            return this.doUnpublish(secondPassIDs, true)
              .then(next => successful.concat(next));
          }
        }

        return successful;
      });
  }


  /**
   * Unpublish files and update the UI
   *
   * @param {array} fileIds
   */
  handleUnpublish(fileIds) {
    return this.doUnpublish(fileIds).then((response) => {
      // TODO Update GraphQL store with new model or update apollo and use new API
      // see https://github.com/silverstripe/silverstripe-graphql/issues/14
      // see https://dev-blog.apollodata.com/apollo-clients-new-imperative-store-api-6cb69318a1e3
      const { fileId } = this.props;
      this.props.actions.files.readFiles()
        .then(() => {
          if (fileId && response.find(file => file.id === fileId)) {
            this.handleCloseFile();
            this.handleOpenFile(fileId);
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

    return this.props.actions.files.publishFiles(fileIDs)
      .then(({ data: { publishFiles } }) => {
        const successes = publishFiles.filter(result => result.__typename === 'File');

        const successful = successes.map(file => {
          this.resetFile(file);
          return file;
        });

        return successful;
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
    // TODO Update GraphQL store with new model,
    // see https://github.com/silverstripe/silverstripe-graphql/issues/14
  }

  handleUploadQueue() {
    // A bit of coupling. If the editor isn't open, the gallery will automatically
    // open a file and force a refresh, so we have to guard against a double refresh.
    if (this.props.fileId) {
      this.props.actions.files.readFiles();
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
    // TODO Refactor "queued files" into separate visual area and remove coupling here
    const files = this.props.queuedFiles.items.filter((file) => (
      fileIds.includes(file.id)
    ));

    files.forEach((file) => {
      if (file.queuedId) {
        this.props.actions.queuedFiles.removeQueuedFile(file.queuedId);
      }
    });

    this.props.actions.gallery.deselectFiles();
    // TODO Update GraphQL store with new model,
    // see https://github.com/silverstripe/silverstripe-graphql/issues/14
    this.props.actions.files.readFiles();
  }

  /**
   * Generates the Gallery react component to render with
   *
   * @returns {object}
   */
  renderGallery() {
    const config = this.props.sectionConfig;
    const createFileApiUrl = config.createFileEndpoint.url;
    const createFileApiMethod = config.createFileEndpoint.method;

    const limit = this.props.query && parseInt(this.props.query.limit || config.limit, 10);
    const page = this.props.query && parseInt(this.props.query.page || 1, 10);

    const sort = this.props.query && this.props.query.sort;
    const view = this.props.query && this.props.query.view;
    const filters = this.props.query.filter || {};

    return (
      <Gallery
        files={this.getFiles()}
        fileId={this.props.fileId}
        folderId={this.getFolderId()}
        folder={this.props.folder}
        type={this.props.type}
        limit={limit}
        page={page}
        totalCount={this.props.filesTotalCount}
        view={view}
        filters={filters}
        graphQLErrors={this.props.graphQLErrors}
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
        loading={this.props.loading}
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
      fileSelected
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
      targetId,
      schemaUrl,
      schemaUrlQueries,
      file: this.findFile(targetId),
      onClose: this.handleCloseFile,
      onSubmit: this.handleSubmitEditor,
      onUnpublish: this.handleUnpublish,
      addToCampaignSchemaUrl: config.form.addToCampaignForm.schemaUrl
    };

    return <Editor {...editorProps} />;
  }

  render() {
    const { folder, folderId, query, getUrl, type, maxFiles, filter, toolbarChildren } = this.props;

    const showBackButton = Boolean(folderId || hasFilters(query.filter));
    const searchFormSchemaUrl = this.props.sectionConfig.form.fileSearchForm.schemaUrl;
    const filters = filter || {};
    const classNames = classnames(
      'fill-height asset-admin',
      type === 'select' && {
        'asset-admin--single-select': maxFiles === 1,
        'asset-admin--multi-select': maxFiles !== 1,
      }
    );
    const showSearch = hasFilters(filter) || this.props.showSearch;
    const onSearchToggle = this.props.actions.displaySearch ?
      this.props.actions.displaySearch.toggleSearch :
      undefined;

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
          <AssetAdminBreadcrumb {...breadcrumbProps} />
          <div className="asset-admin__toolbar-extra pull-xs-right fill-width vertical-align-items">
            <SearchToggle toggled={showSearch} onToggle={onSearchToggle} />
            {toolbarChildren}
          </div>
        </Toolbar>
        {showSearch && <Search
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
        <BulkDeleteConfirmation onConfirm={this.handleDelete} />
      </div>
    );
  }
}

AssetAdmin.propTypes = {
  dialog: PropTypes.bool,
  sectionConfig: configShape,
  fileId: PropTypes.number,
  folderId: PropTypes.number,
  onBrowse: PropTypes.func,
  onReplaceUrl: PropTypes.func,
  onInsertMany: PropTypes.func,
  graphQLErrors: PropTypes.arrayOf(PropTypes.string),
  getUrl: PropTypes.func,
  query: PropTypes.shape({
    sort: PropTypes.string,
    limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    filter: PropTypes.object,
  }),
  onSubmitEditor: PropTypes.func,
  type: PropTypes.oneOf(['insert-media', 'insert-link', 'select', 'admin']),
  files: PropTypes.array,
  queuedFiles: PropTypes.shape({
    items: PropTypes.array.isRequired,
  }),
  filesTotalCount: PropTypes.number,
  folder: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    parents: PropTypes.array,
    parentId: PropTypes.number,
    canView: PropTypes.bool,
    canEdit: PropTypes.bool,
  }),
  loading: PropTypes.bool,
  actions: PropTypes.object,
  maxFiles: PropTypes.number,
  fileSelected: PropTypes.bool
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
};

function mapStateToProps(state, ownProps) {
  const { formSchema } = state.assetAdmin.modal;
  return {
    securityId: state.config.SecurityID,
    // TODO Refactor "queued files" into separate visual area and remove coupling here
    queuedFiles: state.assetAdmin.queuedFiles,
    showSearch: state.assetAdmin.displaySearch.isOpen,
    type: (formSchema && formSchema.type) || ownProps.type,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: bindActionCreators(galleryActions, dispatch),
      displaySearch: bindActionCreators(displaySearchActions, dispatch),
      // TODO Refactor "queued files" into separate visual area and remove coupling here
      queuedFiles: bindActionCreators(queuedFilesActions, dispatch),
      confirmDeletion: bindActionCreators(confirmDeletionActions, dispatch)
    },
  };
}

export { AssetAdmin as Component };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectGraphql('ReadFilesQuery'),
  deleteFilesMutation,
  unpublishFilesMutation,
  publishFilesMutation,
  withApollo
)(AssetAdmin);

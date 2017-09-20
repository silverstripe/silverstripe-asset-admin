import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import backend from 'lib/Backend';
import i18n from 'i18n';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as breadcrumbsActions from 'state/breadcrumbs/BreadcrumbsActions';
import * as queuedFilesActions from 'state/queuedFiles/QueuedFilesActions';
import Editor from 'containers/Editor/Editor';
import Gallery from 'containers/Gallery/Gallery';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Toolbar from 'components/Toolbar/Toolbar';
import { withApollo } from 'react-apollo';
import Search, { hasFilters } from 'components/Search/Search';
import readFilesQuery from 'state/files/readFilesQuery';
import deleteFilesMutation from 'state/files/deleteFilesMutation';
import unpublishFilesMutation from 'state/files/unpublishFilesMutation';
import publishFilesMutation from 'state/files/publishFilesMutation';
import CONSTANTS from 'constants/index';
import configShape from 'lib/configShape';

function getFormSchema({ config, viewAction, folderId, fileId, type }) {
  let schemaUrl = null;
  let targetId = null;

  if (viewAction === CONSTANTS.ACTIONS.CREATE_FOLDER) {
    schemaUrl = config.form.folderCreateForm.schemaUrl;
    targetId = folderId;
  } else if (viewAction === CONSTANTS.ACTIONS.EDIT_FILE) {
    // Types are:
    // 'insert' -> Insert into html area with options
    // 'select' -> Select a file with no editable fields
    // 'edit' (default) -> edit files
    switch (type) {
      case 'insert-media':
        schemaUrl = config.form.fileInsertForm.schemaUrl;
        break;
      case 'insert-link':
        schemaUrl = config.form.fileEditorLinkForm.schemaUrl;
        break;
      case 'select':
        schemaUrl = config.form.fileSelectForm.schemaUrl;
        break;
      case 'admin':
      default:
        schemaUrl = config.form.fileEditForm.schemaUrl;
        break;
    }

    if (!fileId) {
      return {};
    }
    targetId = fileId;
  } else {
    return {};
  }
  return { schemaUrl, targetId };
}

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
    this.handleCreateFolder = this.handleCreateFolder.bind(this);
    this.handleMoveFilesSuccess = this.handleMoveFilesSuccess.bind(this);
    this.compare = this.compare.bind(this);
    this.setBreadcrumbs = this.setBreadcrumbs.bind(this);
  }

  componentWillMount() {
    const config = this.props.sectionConfig;

    // Build API callers from the URLs provided in configuration.
    // In time, something like a GraphQL endpoint might be a better way to run.
    this.endpoints = {
      historyApi: this.createEndpoint(config.historyEndpoint),
    };
  }

  componentDidMount() {
    this.setBreadcrumbs(this.props);
  }

  componentWillReceiveProps(props) {
    const viewChanged = this.compare(this.props.folder, props.folder);
    if (viewChanged || hasFilters(props.query.filter) !== hasFilters(this.props.query.filter)) {
      this.setBreadcrumbs(props);
    }

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

  /**
   * Assign breadcrumbs from selected folder
   *
   * @param {Object} props
   */
  setBreadcrumbs(props) {
    const folder = props.folder;
    const query = props.query;
    // Set root breadcrumb
    const breadcrumbs = [{
      text: i18n._t('AssetAdmin.FILES', 'Files'),
      href: this.props.getUrl && this.props.getUrl(),
      onClick: (event) => {
        event.preventDefault();
        this.handleBrowse();
      },
    }];

    if (folder && folder.id) {
      // Add parent folders
      if (folder.parents) {
        folder.parents.forEach((parent) => {
          breadcrumbs.push({
            text: parent.title,
            href: this.props.getUrl && this.props.getUrl(parent.id),
            onClick: (event) => {
              event.preventDefault();
              this.handleBrowse(parent.id);
            },
          });
        });
      }

      // Add current folder
      breadcrumbs.push({
        text: folder.title,
        href: this.props.getUrl && this.props.getUrl(folder.id),
        onClick: (event) => {
          event.preventDefault();
          this.handleBrowse(folder.id);
        },
        icon: {
          className: 'icon font-icon-edit-list',
          onClick: this.handleFolderIcon,
        },
      });
    }
    // Search leaf if there was a search entered
    if (hasFilters(query.filter)) {
      breadcrumbs.push({
        text: i18n._t('LeftAndMain.SEARCHRESULTS', 'Search results'),
      });
    }

    this.props.actions.breadcrumbsActions.setBreadcrumbs(breadcrumbs);
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
    this.handleBrowse(
      data.currentFolderOnly ? this.getFolderId() : 0,
      null,
      // Reset current query, retain "view" type
      { filter: data, view: this.props.query.view }
    );
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

  /**
   * Check if either of the two objects differ
   *
   * @param {Object} left
   * @param {Object} right
   */
  compare(left, right) {
    // Check for falsiness
    if ((left && !right) || (right && !left)) {
      return true;
    }

    // Fall back to object comparison
    return left && right && (left.id !== right.id || left.name !== right.name);
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
   * Handler for when the folder icon is clicked (to edit hte folder)
   *
   * @param {Event} event
   */
  handleFolderIcon(event) {
    event.preventDefault();
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
    const query = Object.assign({}, this.props.query);
    delete query.page;
    delete query.filter;
    this.handleBrowse(folderId, null, query);
  }

  /**
   * Delete files or folders
   *
   * @param {array} ids
   */
  handleDelete(ids) {
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

    const dataIds = files.map(({ __typename, id }) => (
      this.props.client.dataId({ __typename, id })
    ));
    const fileIDs = files.map(file => file.id);
    const parentId = this.props.folder ? this.props.folder.id : 0;
    return this.props.actions.files.deleteFiles(fileIDs, dataIds)
      .then(({ data: { deleteFiles } }) => {
        this.handleBrowse(parentId, null, this.props.query);

        return deleteFiles;
      });
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

    return this.props.actions.files.unpublishFiles(fileIDs)
      .then(({ data: { unpublishFiles } }) => (
        unpublishFiles.map(file => {
          this.resetFile(file);
          return file;
        })
      ));
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
      .then(({ data: { publishFiles } }) => (
        publishFiles.map(file => {
          this.resetFile(file);
          return file;
        })
      ));
  }

  /**
   * Find a file by id in all files (files + queued)
   *
   * @param {Number|String} fileId
   * @return {object}
   */
  findFile(fileId) {
    const allFiles = [...this.props.files, ...this.props.queuedFiles.items];
    return allFiles.find((item) => item.id === parseInt(fileId, 10));
  }

  handleUpload() {
    // TODO Update GraphQL store with new model,
    // see https://github.com/silverstripe/silverstripe-graphql/issues/14
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
        files={this.props.files}
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
        onDelete={this.handleDelete}
        onPublish={this.doPublish}
        onUnpublish={this.doUnpublish}
        onOpenFile={this.handleOpenFile}
        onOpenFolder={this.handleOpenFolder}
        onSuccessfulUpload={this.handleUpload}
        onCreateFolder={this.handleCreateFolder}
        onMoveFilesSuccess={this.handleMoveFilesSuccess}
        onSort={this.handleSort}
        onSetPage={this.handleSetPage}
        onViewChange={this.handleViewChange}
        sort={sort}
        sectionConfig={config}
        loading={this.props.loading}
      />
    );
  }

  /**
   * Generates the Editor react component to render with
   *
   * @returns {object}
   */
  renderEditor() {
    const config = this.props.sectionConfig;
    const { schemaUrl, targetId } = getFormSchema({
      config,
      viewAction: this.props.viewAction,
      folderId: this.getFolderId(),
      type: this.props.type,
      fileId: this.props.fileId,
    });

    if (!schemaUrl) {
      return null;
    }

    return (
      <Editor
        className={(this.props.dialog) ? 'editor--dialog' : ''}
        targetId={targetId}
        file={this.findFile(targetId)}
        onClose={this.handleCloseFile}
        schemaUrl={schemaUrl}
        schemaUrlQueries={this.props.requireLinkText ? [{ name: 'requireLinkText', value: true }] : []}
        onSubmit={this.handleSubmitEditor}
        onDelete={this.handleDelete}
        onUnpublish={this.handleUnpublish}
        addToCampaignSchemaUrl={config.form.addToCampaignForm.schemaUrl}
      />
    );
  }

  render() {
    const showBackButton = !!(
      (this.props.folderId)
      || hasFilters(this.props.query.filter)
    );
    const searchFormSchemaUrl = this.props.sectionConfig.form.fileSearchForm.schemaUrl;
    const filters = this.props.query.filter || {};
    return (
      <div className="fill-height">
        <Toolbar
          showBackButton={showBackButton}
          onBackButtonClick={this.handleBackButtonClick}
        >
          <Breadcrumb multiline />
          <div className="asset-admin__toolbar-extra pull-xs-right fill-width vertical-align-items">
            <Search
              onSearch={this.handleDoSearch}
              id="AssetSearchForm"
              searchFormSchemaUrl={searchFormSchemaUrl}
              folderId={this.getFolderId()}
              filters={filters}
            />
            {this.props.toolbarChildren}
          </div>
        </Toolbar>
        <div className="flexbox-area-grow fill-width fill-height gallery">
          {this.renderGallery()}
          {this.renderEditor()}
        </div>
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
};

AssetAdmin.defaultProps = {
  type: 'admin',
  query: {
    sort: '',
    limit: null, // set to config default in mapStateToProps
    page: 0,
    filter: {},
  },
};

function mapStateToProps(state) {
  return {
    securityId: state.config.SecurityID,
    // TODO Refactor "queued files" into separate visual area and remove coupling here
    queuedFiles: state.assetAdmin.queuedFiles,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: bindActionCreators(galleryActions, dispatch),
      breadcrumbsActions: bindActionCreators(breadcrumbsActions, dispatch),
      // TODO Refactor "queued files" into separate visual area and remove coupling here
      queuedFiles: bindActionCreators(queuedFilesActions, dispatch),
    },
  };
}

export { AssetAdmin as Component, getFormSchema };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  readFilesQuery,
  deleteFilesMutation,
  unpublishFilesMutation,
  publishFilesMutation,
  (component) => withApollo(component)
)(AssetAdmin);

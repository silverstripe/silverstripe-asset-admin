import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import backend from 'lib/Backend';
import i18n from 'i18n';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as breadcrumbsActions from 'state/breadcrumbs/BreadcrumbsActions';
import * as queuedFilesActions from 'state/queuedFiles/QueuedFilesActions';
import Editor from 'containers/Editor/Editor';
import Gallery from 'containers/Gallery/Gallery';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Toolbar from 'components/Toolbar/Toolbar';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { NetworkStatus } from 'apollo-client/queries/store';
import Search, { hasFilters } from 'components/Search/Search';

class AssetAdmin extends SilverStripeComponent {

  constructor(props) {
    super(props);
    this.handleOpenFile = this.handleOpenFile.bind(this);
    this.handleCloseFile = this.handleCloseFile.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
    this.handleCreateFolderSuccess = this.handleCreateFolderSuccess.bind(this);
    this.handleMoveFilesSuccess = this.handleMoveFilesSuccess.bind(this);
    this.compare = this.compare.bind(this);
  }

  componentWillMount() {
    const config = this.props.sectionConfig;

    // Build API callers from the URLs provided in configuration.
    // In time, something like a GraphQL endpoint might be a better way to run.
    this.endpoints = {
      historyApi: this.createEndpoint(config.historyEndpoint),
    };
  }

  componentWillReceiveProps(props) {
    const viewChanged = this.compare(this.props.folder, props.folder);
    if (viewChanged || hasFilters(props.query.filter) !== hasFilters(this.props.query.filter)) {
      this.setBreadcrumbs(props);
    }
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
    if (folderId !== this.props.folderId) {
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
      this.props.folderId,
      this.props.fileId,
      Object.assign({}, this.props.query, {
        page,
      })
    );
  }

  /**
   * Reset to new search results page
   *
   * @param {Object} data
   */
  handleDoSearch(data) {
    this.handleBrowse(
      data.currentFolderOnly ? this.props.folderId : 0,
      0,
      // Reset current query
      Object.assign({}, this.getBlankQuery(), { filter: data })
    );
  }

  /**
   * Generate a blank query based on current query
   *
   * @return {Object}
   */
  getBlankQuery() {
    const query = {};
    Object.keys(this.props.query).forEach((key) => {
      query[key] = undefined;
    });
    return query;
  }

  /**
   * Handles configuring sorting with browsing history.onOpenFolder
   *
   * @param {string} sort
   */
  handleSort(sort) {
    this.handleBrowse(this.props.folderId, this.props.fileId, Object.assign({}, this.props.query, {
      sort,
      // clear pagination
      limit: undefined,
      page: undefined,
    }));
  }

  /**
   * Handles when the view for the component changes
   *
   * @param {string} view
   */
  handleViewChange(view) {
    this.handleBrowse(this.props.folderId, this.props.fileId, Object.assign({}, this.props.query, {
      view,
    }));
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
    if (this.props.folder) {
      this.handleOpenFolder(this.props.folder.parentId || 0);
    } else {
      this.handleOpenFolder(0);
    }
  }

  /**
   * Assign breadcrumbs from selected folder
   *
   * @param {Object} folder
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
          action: this.handleFolderIcon,
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
   * Check if either of the two objects differ
   *
   * @param {Object} left
   * @param {Object} right
     */
  compare(left, right) {
    // Check for falsiness
    if (left && !right || right && !left) {
      return true;
    }

    // Fall back to object comparison
    return left && right && (left.id !== right.id || left.name !== right.name);
  }

  /**
   * Handler for when the folder icon is clicked (to edit hte folder)
   *
   * @param {Event} event
   */
  handleFolderIcon(event) {
    event.preventDefault();
    this.handleOpenFile(this.props.folderId);
  }

  /**
   * Updates url to open the file in editor
   *
   * @param fileId
   */
  handleOpenFile(fileId) {
    // Retain existing query, e.g. to stay within search results when viewing a file
    this.handleBrowse(this.props.folderId, fileId, this.props.query);
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
      const file = this.props.files.find((next) => next.id === parseInt(this.props.fileId, 10));
      promise = this.props.onSubmitEditor(data, action, submitFn, file);
    } else {
      promise = submitFn();
    }

    if (!promise) {
      throw new Error('Promise was not returned for submitting');
    }
    return promise
      .then((response) => {
        // TODO Update GraphQL store with new model,
        // see https://github.com/silverstripe/silverstripe-graphql/issues/14
        this.props.refetch();

        return response;
      });
  }

  /**
   * Handle for closing the editor
   */
  handleCloseFile() {
    this.handleOpenFolder(this.props.folderId);
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
   * Delete a file or folder
   *
   * @param {number} fileId
   */
  handleDelete(fileId) {
    // TODO Refactor "queued files" into separate visual area and remove coupling here
    const allFiles = [...this.props.files, ...this.props.queuedFiles.items];
    let file = allFiles.find((item) => item.id === fileId);
    if (!file && this.props.folder && this.props.folder.id === fileId) {
      file = this.props.folder;
    }

    if (!file) {
      throw new Error(`File selected for deletion cannot be found: ${fileId}`);
    }

    const dataId = this.props.client.dataId({
      __typename: file.__typename,
      id: file.id,
    });

    return this.props.actions.mutate.deleteFile(file.id, dataId).then(() => {
      this.props.actions.gallery.deselectFiles([file.id]);

      // If the file was just uploaded, it doesn't exist in the Apollo store,
      // and has to be removed from the queue instead.
      if (file.queuedId) {
        this.props.actions.queuedFiles.removeQueuedFile(file.queuedId);
      }

      // redirect to open parent folder if the file/folder is open and on screen to close it
      if (file) {
        this.handleBrowse((file.parent) ? file.parent.id : 0);
      }
    });
  }

  handleUpload() {
    // TODO Update GraphQL store with new model,
    // see https://github.com/silverstripe/silverstripe-graphql/issues/14

    // TODO Maybe we dont need to immediately refetch? (Damian 19-12-2016)
    // this.props.refetch();
  }

  handleCreateFolderSuccess() {
    // TODO Update GraphQL store with new model,
    // see https://github.com/silverstripe/silverstripe-graphql/issues/14
    this.props.refetch();
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
    this.props.refetch();
  }

  /**
   * Generates the Gallery react component to render with
   *
   * @returns {Component}
   */
  renderGallery() {
    const config = this.props.sectionConfig;
    const createFileApiUrl = config.createFileEndpoint.url;
    const createFileApiMethod = config.createFileEndpoint.method;

    const limit = this.props.query && parseInt(this.props.query.limit || config.limit, 10);
    const page = this.props.query && parseInt(this.props.query.page || 1, 10);

    const sort = this.props.query && this.props.query.sort;
    const view = this.props.query && this.props.query.view;
    const filters = (this.props.query && this.props.query.filter) || {};

    return (
      <Gallery
        files={this.props.files}
        fileId={this.props.fileId}
        folderId={this.props.folderId}
        folder={this.props.folder}
        type={this.props.type}
        limit={limit}
        page={page}
        totalCount={this.props.filesTotalCount}
        view={view}
        filters={filters}
        createFileApiUrl={createFileApiUrl}
        createFileApiMethod={createFileApiMethod}
        onDelete={this.handleDelete}
        onOpenFile={this.handleOpenFile}
        onOpenFolder={this.handleOpenFolder}
        onSuccessfulUpload={this.handleUpload}
        onCreateFolderSuccess={this.handleCreateFolderSuccess}
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
   * @returns {Component}
   */
  renderEditor() {
    const config = this.props.sectionConfig;
    // Types are:
    // 'insert' -> Insert into html area with options
    // 'select' -> Select a file with no editable fields
    // 'edit' (default) -> edit files
    let schemaUrl = null;
    switch (this.props.type) {
      case 'insert':
        schemaUrl = config.form.fileInsertForm.schemaUrl;
        break;
      case 'select':
        schemaUrl = config.form.fileSelectForm.schemaUrl;
        break;
      case 'admin':
      default:
        schemaUrl = config.form.fileEditForm.schemaUrl;
        break;
    }

    if (!this.props.fileId) {
      return null;
    }

    return (
      <Editor
        className={(this.props.type === 'insert') ? 'editor--dialog' : ''}
        fileId={this.props.fileId}
        onClose={this.handleCloseFile}
        editFileSchemaUrl={schemaUrl}
        onSubmit={this.handleSubmitEditor}
        onDelete={this.handleDelete}
        addToCampaignSchemaUrl={config.form.addToCampaignForm.schemaUrl}
      />
    );
  }

  render() {
    const showBackButton = !!(
      (this.props.folder && this.props.folder.id)
      || hasFilters(this.props.query.filter)
    );
    const searchFormSchemaUrl = this.props.sectionConfig.form.fileSearchForm.schemaUrl;
    const filters = this.props.query.filter || {};
    return (
      <div className="fill-height">
        <Toolbar showBackButton={showBackButton} handleBackButtonClick={this.handleBackButtonClick}>
          <Breadcrumb multiline />
          <div className="asset-admin__toolbar-extra pull-xs-right">
            <Search onSearch={this.handleDoSearch} id="AssetSearchForm"
              searchFormSchemaUrl={searchFormSchemaUrl} folderId={this.props.folderId}
              filters={filters}
            />
            {this.props.toolbarChildren}
          </div>
        </Toolbar>
        <div className="flexbox-area-grow fill-width fill-height gallery">
          {this.renderGallery()}
          {this.renderEditor()}
        </div>
        {this.props.type !== 'admin' && this.props.loading &&
        [<div key="overlay" className="cms-content-loading-overlay ui-widget-overlay-light"></div>,
        <div key="spinner" className="cms-content-loading-spinner"></div>]
        }
      </div>
    );
  }
}

AssetAdmin.propTypes = {
  dialog: PropTypes.bool,
  sectionConfig: PropTypes.shape({
    url: PropTypes.string,
    limit: PropTypes.number,
    form: PropTypes.object,
  }),
  fileId: PropTypes.number,
  folderId: PropTypes.number,
  onBrowse: PropTypes.func,
  getUrl: PropTypes.func,
  query: PropTypes.shape({
    sort: PropTypes.string,
    limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    filter: PropTypes.object,
  }),
  onSubmitEditor: PropTypes.func,
  type: PropTypes.oneOf(['insert', 'select', 'admin']),
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

// GraphQL Query
const readFilesQuery = gql`
  query ReadFiles($limit:Int!, $offset:Int!, $rootFilter: FileFilterInput, 
    $childrenFilter: FileFilterInput, $sortBy:[ChildrenSortInputType]
  ) {
    readFiles(filter: $rootFilter) {
      pageInfo {
        totalCount
      }
      edges {
        node {
          ...FileInterfaceFields
          ...FileFields
          ...on Folder {
            children(limit:$limit, offset:$offset, filter: $childrenFilter, sortBy:$sortBy) {
              pageInfo {
                totalCount
              }
              edges {
                node {
                  ...FileInterfaceFields
                  ...FileFields
                  ...FolderFields
                }
              }
            }
            parents {
              id
              title
            }
          }
        }
      }
    }
  }
  ${Gallery.fragments.fileInterface}
  ${Gallery.fragments.file}
  ${Gallery.fragments.folder}
`;
const readFilesConfig = {
  options({ sectionConfig, folderId, query }) {
    // Covers a few variations:
    // - Display the root folder with its direct children
    // - Display the root folder with its recursive children and filters (a full "search")
    // - Display a folder with its direct children, without any filters
    // - Display a folder with its direct children and filters (a "search" in the current folder)

    const [sortField, sortDir] = query.sort ? query.sort.split(',') : ['', ''];
    const filterWithDefault = query.filter || {};
    const limit = query.limit || sectionConfig.limit;
    return {
      variables: {
        rootFilter: { id: folderId },
        childrenFilter: Object.assign(
          filterWithDefault,
          {
            // Unset key, taken from rootFilter
            parentId: undefined,
            // Currently all searches are recursive, and only filtered by a ParentID
            recursive: hasFilters(filterWithDefault),
            // Unset this key since it's not a valid GraphQL argument
            currentFolderOnly: undefined,
          }
        ),
        limit,
        offset: ((query.page || 1) - 1) * limit,
        sortBy: (sortField && sortDir)
          ? [{ field: sortField, direction: sortDir.toUpperCase() }]
          : undefined,
      },
    };
  },
  props({ data: { networkStatus: currentNetworkStatus, refetch, readFiles } }) {
    // Uses same query as search and file list to return a single result (the containing folder)
    const folder = (readFiles && readFiles.edges[0]) ? readFiles.edges[0].node : null;
    const files = (folder && folder.children)
      // Filter nodes because the DELETE resultBehaviour doesn't delete the edge, only the node
      ? folder.children.edges.map((edge) => edge.node).filter((file) => file)
      : [];
    const filesTotalCount = (folder && folder.children) ? folder.children.pageInfo.totalCount : 0;

    // Only set to loading if a network request is in progress.
    // TODO Use built-in 'loading' indicator once it's set to true on setVariables() calls.
    // TODO Respect optimistic loading results. We can't check for presence of readFiles object,
    // since Apollo sends through the previous result before optimistically setting the new result.
    const loading =
      currentNetworkStatus !== NetworkStatus.ready
      && currentNetworkStatus !== NetworkStatus.error;

    return {
      loading,
      refetch,
      folder,
      files,
      filesTotalCount,
    };
  },
};
// const updateFileMutation = gql`mutation UpdateFile($id:ID!, $file:FileInput!) {
//   updateFile(id: $id, file: $file) {
//    id
//   }
// }`;
const deleteFileMutation = gql`mutation DeleteFile($id:ID!) {
  deleteFile(id: $id)
}`;

export { AssetAdmin };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(readFilesQuery, readFilesConfig),
  // graphql(updateFileMutation, { name: 'mutateUpdateFile' }),
  graphql(deleteFileMutation, {
    props: ({ mutate, ownProps: { actions } }) => ({
      actions: Object.assign({}, actions, {
        mutate: Object.assign({}, actions.mutate, {
          deleteFile: (id, dataId) => mutate({
            variables: {
              id,
            },
            resultBehaviors: [
              {
                type: 'DELETE',
                dataId,
              },
            ],
          }),
        }),
      }),
    }),
  }),
  (component) => withApollo(component)
)(AssetAdmin);

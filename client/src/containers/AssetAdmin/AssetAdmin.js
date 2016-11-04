import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import backend from 'lib/Backend';
import i18n from 'i18n';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as breadcrumbsActions from 'state/breadcrumbs/BreadcrumbsActions';
import Editor from 'containers/Editor/Editor';
import Gallery from 'containers/Gallery/Gallery';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Toolbar from 'components/Toolbar/Toolbar';

class AssetAdmin extends SilverStripeComponent {

  constructor(props) {
    super(props);
    this.handleOpenFile = this.handleOpenFile.bind(this);
    this.handleCloseFile = this.handleCloseFile.bind(this);
    this.delete = this.delete.bind(this);
    this.handleSubmitEditor = this.handleSubmitEditor.bind(this);
    this.handleOpenFolder = this.handleOpenFolder.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.createEndpoint = this.createEndpoint.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleFolderIcon = this.handleFolderIcon.bind(this);
    this.handleBrowse = this.handleBrowse.bind(this);
    this.compare = this.compare.bind(this);
  }

  componentWillMount() {
    const config = this.props.sectionConfig;

    // Build API callers from the URLs provided in configuration.
    // In time, something like a GraphQL endpoint might be a better way to run.
    this.endpoints = {
      createFolderApi: this.createEndpoint(config.createFolderEndpoint),
      readFolderApi: this.createEndpoint(config.readFolderEndpoint, false),
      updateFolderApi: this.createEndpoint(config.updateFolderEndpoint),
      deleteApi: this.createEndpoint(config.deleteEndpoint),
    }
  }

  componentWillReceiveProps(props) {
    const viewChanged = this.compare(this.props.folder, props.folder);
    if (viewChanged) {
      this.setBreadcrumbs(props.folder);
    }
  }

  /**
   * Handles browsing within this section.
   *
   * @param {string|number} folderId
   * @param {string|number} [fileId]
   * @param {object|null} [query]
   */
  handleBrowse(folderId, fileId, query) {
    if (typeof this.props.onBrowse === 'function') {
      // for Higher-order component with a router handler
      this.props.onBrowse(folderId, fileId, query);
    }
  }

  /**
   * Handles configuring sorting with browsing history.onOpenFolder
   *
   * @param {string} sort
   */
  handleSort(sort) {
    this.handleBrowse(this.props.folderId, this.props.fileId, { sort });
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
      this.handleOpenFolder(this.props.folder.parentID || 0);
    } else {
      this.handleOpenFolder(0);
    }
  }

  /**
   * Assign breadcrumbs from selected folder
   *
   * @param {Object} folder
     */
  setBreadcrumbs(folder) {
    const base = this.props.sectionConfig.url;

    // Set root breadcrumb
    const breadcrumbs = [{
      text: i18n._t('AssetAdmin.FILES', 'Files'),
      href: this.props.sectionConfig.url,
    }];

    if (folder && folder.id) {
      // Add parent folders
      if (folder.parents) {
        folder.parents.forEach((parent) => {
          breadcrumbs.push({
            text: parent.title,
            href: this.props.getUrl(parent.id),
          });
        });
      }

      // Add current folder
      breadcrumbs.push({
        text: folder.title,
        icon: {
          className: 'icon font-icon-edit-list',
          action: this.handleFolderIcon,
        },
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
    this.handleBrowse(this.props.folderId, fileId);
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

    if (action === 'insert') {
      const file = this.props.files.find((next) => next.id === parseInt(this.props.fileId, 10));

      // return a separate promise object without submitting for insert action.
      return Promise.resolve(Object.assign({}, file, data));
    }
    return submitFn()
      .then((response) => {
        this.props.actions.gallery.loadFile(this.props.fileId, response.record);
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
    this.handleBrowse(folderId);
  }

  /**
   * Delete a file or folder
   *
   * @param {number} fileId
   */
  delete(fileId) {
    let file = this.props.files.find((item) => item.id === fileId);
    if (!file && this.props.folder && this.props.folder.id === fileId) {
      file = this.props.folder;
    }
    if (!file) {
      throw new Error(`File selected for deletion cannot be found: ${fileId}`);
    }
    const parentId = file.parent ? file.parent.id : 0;

    // eslint-disable-next-line no-alert
    if (confirm(i18n._t('AssetAdmin.CONFIRMDELETE'))) {
      this.props.actions.gallery.deleteItems(this.endpoints.deleteApi, [file.id])
        .then(() => {
          this.handleBrowse(parentId);
        });
    }
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

    const limit = this.props.query && this.props.query.limit;
    const page = this.props.query && this.props.query.page;

    const sort = this.props.query && this.props.query.sort;

    return (
      <Gallery
        files={this.props.files}
        fileId={this.props.fileId}
        folderId={this.props.folderId}
        folder={this.props.folder}
        limit={limit}
        page={page}
        bulkActions={!this.props.selectMode}
        createFileApiUrl={createFileApiUrl}
        createFileApiMethod={createFileApiMethod}
        createFolderApi={this.endpoints.createFolderApi}
        readFolderApi={this.endpoints.readFolderApi}
        updateFolderApi={this.endpoints.updateFolderApi}
        deleteApi={this.endpoints.deleteApi}
        onOpenFile={this.handleOpenFile}
        onOpenFolder={this.handleOpenFolder}
        onSort={this.handleSort}
        sort={sort}
        sectionConfig={config}
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
    const file = this.props.files.find((next) => next.id === parseInt(this.props.fileId, 10));
    const schemaUrl = (this.props.selectMode)
      ? config.form.FileSelectForm.schemaUrl
      : config.form.FileEditForm.schemaUrl;

    if (!file && this.props.fileId !== this.props.folderId) {
      return null;
    }

    return (
      <Editor
        fileId={this.props.fileId}
        onClose={this.handleCloseFile}
        editFileSchemaUrl={schemaUrl}
        onSubmit={this.handleSubmitEditor}
        onDelete={this.delete}
        addToCampaignSchemaUrl={config.form.AddToCampaignForm.schemaUrl}
      />
    );
  }

  render() {
    const showBackButton = !!(this.props.folder && this.props.folder.id);

    return (
      <div className="fill-height">
        <Toolbar showBackButton={showBackButton} handleBackButtonClick={this.handleBackButtonClick}>
          <Breadcrumb multiline />
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
  sectionConfig: PropTypes.shape({
    url: PropTypes.string,
    limit: PropTypes.number,
    form: PropTypes.object,
  }),
  fileId: PropTypes.number,
  folderId: PropTypes.number,
  file: PropTypes.object,
  folder: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    parents: PropTypes.array,
    parentID: PropTypes.number,
    canView: PropTypes.bool,
    canEdit: PropTypes.bool,
  }),
  onBrowse: PropTypes.func,
  getUrl: PropTypes.func.isRequired,
  selectMode: PropTypes.bool,
  query: PropTypes.shape({
    sort: PropTypes.string,
  }),
};

AssetAdmin.defaultProps = {
  selectMode: false,
};

function mapStateToProps(state, ownProps) {
  const folder = state.assetAdmin.gallery.folder;
  const files = state.assetAdmin.gallery.files;

  return {
    files,
    folder,
    limit: ownProps.sectionConfig.limit,
    securityId: state.config.SecurityID,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: bindActionCreators(galleryActions, dispatch),
      breadcrumbsActions: bindActionCreators(breadcrumbsActions, dispatch),
    },
  };
}

export { AssetAdmin };

export default connect(mapStateToProps, mapDispatchToProps)(AssetAdmin);

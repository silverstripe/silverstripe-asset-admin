import React from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import { default as Gallery } from 'containers/Gallery/Gallery';
import Editor from 'containers/Editor/Editor';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as editorActions from 'state/editor/EditorActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Config from 'lib/Config';

class AssetAdmin extends SilverStripeComponent {
  constructor(props) {
    super(props);

    // Required to stop routing from kicking in before props can be set through handleURL()
    this._didHandleUrl = false;

    // TO DO: Work out what this is for and put it somewhere better
    // const $search = $('.cms-search-form');
    // if ($search.find('[type=hidden][name="q[Folder]"]').length === 0) {
    //   $search.append('<input type="hidden" name="q[Folder]" />');
    // }
    // this.$folder = $search.find('[type=hidden][name="q[Folder]"]');

    this.handleOpenFile = this.handleOpenFile.bind(this);
    this.handleCloseFile = this.handleCloseFile.bind(this);
    this.handleFileSave = this.handleFileSave.bind(this);
    this.handleURL = this.handleURL.bind(this);
    this.getConfig = this.getConfig.bind(this);
  }

  /**
   * Get config for this section
   * @returns {Object|undefined}
   */
  getConfig() {
    return Config.getSection(this.props.sectionConfigKey);
  }

  componentDidMount() {
    super.componentDidMount();

    // While a component is mounted it will intercept all routes and handle internally
    let captureRoute = true;

    const route = window.ss.router.resolveURLToBase(this.getConfig().assetsRoute);

    // Capture routing within this section
    window.ss.router(route, (ctx, next) => {
      if (captureRoute) {
        // If this component is mounted, then handle all page changes via state / redux
        this.handleURL(window.ss.router, ctx);
      } else {
        // If component is not mounted, we need to allow root routes to load
        // this section in via ajax
        next();
      }
    });

    // When leaving this section to go to another top level section then
    // disable route capturing.
    window.ss.router.exit(route, (ctx, next) => {
      const applies = window.ss.router.routeAppliesToCurrentLocation(route);
      if (!applies) {
        captureRoute = false;
      }
      next();
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    this._didHandleUrl = true;
  }

  componentWillReceiveProps(nextProps) {
    if (this._didHandleUrl) {
      this.refreshURL(window.ss.router, nextProps);
    }
  }

  /**
   * Refresh the URL based on the current component state
   */
  refreshURL(router, nextProps) {
    let desiredURL = null;
    if (nextProps.fileId) {
      desiredURL = this.getConfig().assetsRoute
        .replace(/:folderAction\?/, 'show')
        .replace(/:folderId\?/, nextProps.folderId)
        .replace(/:fileAction\?/, 'edit')
        .replace(/:fileId\?/, nextProps.fileId);
    } else {
      desiredURL = this.getConfig().assetsRoute
        .replace(/:folderAction\?/, 'show')
        .replace(/:folderId\?.*$/, nextProps.folderId);
    }

    if (desiredURL !== null && desiredURL !== router.current) {
      // 3rd arg false so as not to trigger handleEnterRoute() and therefore an infinite loops
      router.show(desiredURL, null, false);
    }
  }

  /**
   * Respond to a route change, provided by SS3-style javascript
   *
   * @param {Page} router
   * @param {Context} context
   */
  handleURL(router, context) {
    // If no folder is selected redirect to default route
    if (context.params.folderAction !== 'show') {
      this.props.actions.gallery.setFolder(0);
      const defaultRoute = this.getConfig().assetsRouteHome;
      router.show(defaultRoute, null, false);
      return;
    }

    const folderId = parseInt(context.params.folderId, 10);
    const fileId = parseInt(context.params.fileId, 10);

    // These actions will will trigger refreshUrl()
    // since they case changes to the 'folderId' and 'fileId' props on this component
    this.props.actions.gallery.setFolder(folderId);
    this.props.actions.gallery.setFile(fileId);

    this._didHandleUrl = true;
  }

  handleOpenFile(fileId) {
    this.props.actions.gallery.setFile(fileId);
  }

  handleCloseFile() {
    this.props.actions.gallery.setFile(null);
  }

  /**
   * @param  {Number} id
   * @param  {Object} updates
   */
  handleFileSave(id, updates) {
    return this.props.actions.gallery.updateFile(this.props.updateApi, id, updates);
  }

  render() {
    // Only show the editor if the file object has been loaded
    // (fetched through an async folder request for all contained files)
    const editor = (this.props.file &&
      <Editor
        onClose={this.handleCloseFile}
        onFileSave={this.handleFileSave}
      />
    );
    return (
      <div className="gallery">
        {editor}
        <Gallery
          name={this.props.name}
          limit={this.props.limit}
          bulkActions={this.props.bulkActions}
          filesByParentApi={this.props.filesByParentApi}
          addFolderApi={this.props.addFolderApi}
          deleteApi={this.props.deleteApi}
          onOpenFile={this.handleOpenFile}
        />
      </div>
    );
  }
}

AssetAdmin.propTypes = {
  config: React.PropTypes.shape({
    forms: React.PropTypes.shape({
      editForm: React.PropTypes.shape({
        schemaUrl: React.PropTypes.string,
      }),
    }),
  }),
  sectionConfigKey: React.PropTypes.string.isRequired,
  updateApi: React.PropTypes.func,
  file: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { files, fileId, folderId } = state.assetAdmin.gallery;
  let file = null;
  if (fileId) {
    // Calculated on the fly to avoid getting out of sync with lazy loaded fileId
    file = files.find((next) => next.id === parseInt(fileId, 10));
  }
  return {
    folderId,
    files,
    fileId,
    file,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: bindActionCreators(galleryActions, dispatch),
      editor: bindActionCreators(editorActions, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetAdmin);

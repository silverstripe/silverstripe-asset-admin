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


    // TO DO: Work out what this is for and put it somewhere better
    // const $search = $('.cms-search-form');
    // if ($search.find('[type=hidden][name="q[Folder]"]').length === 0) {
    //   $search.append('<input type="hidden" name="q[Folder]" />');
    // }
    // this.$folder = $search.find('[type=hidden][name="q[Folder]"]');

    this.handleOpenFile = this.handleOpenFile.bind(this);
    this.handleCloseFile = this.handleCloseFile.bind(this);
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

  componentDidUpdate() {
    this.refreshURL(window.ss.router);
  }

  /**
   * Refresh the URL based on the current component state
   */
  refreshURL(router) {
    let desiredURL = null;
    if (this.props.galleryVisible) {
      desiredURL = this.getConfig().assetsRoute
        .replace(/:folderAction\?/, 'show')
        .replace(/:folderId\?.*$/, this.props.folderID);
    } else if (this.props.editorVisible) {
      desiredURL = this.getConfig().assetsRoute
        .replace(/:folderAction\?/, 'show')
        .replace(/:folderId\?/, this.props.folderID)
        .replace(/:fileAction\?/, 'edit')
        .replace(/:fileId\?/, this.props.fileID);
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
      this.props.actions.editor.hide();
      this.props.actions.gallery.show(0);
      const defaultRoute = this.getConfig().assetsRouteHome;
      router.show(defaultRoute, null, false);
      return;
    }

    // Find folder
    const folderId = context.params.folderId || 0;

    // Check if file is selected
    if (context.params.fileAction === 'edit' && context.params.fileId) {
      // Show view for this file
      const fileId = context.params.fileId;
      const file = this.props.folderFiles.find((next) => next.id === parseInt(fileId, 10));
      if (file) {
        this.props.actions.gallery.hide();
        this.props.actions.editor.show(folderId, fileId, file);
      } else {
        // @todo Instead of redirecting, load just this one file via an ajax call
        // We don't have data on this file, so just redirect back to the gallery for this folder
        this.props.actions.editor.hide();
        this.props.actions.gallery.show(folderId);
      }
    } else {
      // No file is selected, so list view for this folder
      this.props.actions.editor.hide();
      this.props.actions.gallery.show(folderId);
    }
  }

  handleOpenFile(fileID, file) {
    this.props.actions.gallery.hide();
    this.props.actions.editor.show(this.props.folderID, fileID, file);
  }

  handleCloseFile() {
    this.props.actions.editor.hide();
    this.props.actions.gallery.show(this.props.folderID);
  }

  render() {
    return (
      <div className="gallery">
        <Gallery
          name={this.props.name}
          limit={this.props.limit}
          bulkActions={this.props.bulkActions}
          filesByParentApi={this.props.filesByParentApi}
          addFolderApi={this.props.addFolderApi}
          deleteApi={this.props.deleteApi}

          onOpenFile={this.handleOpenFile}
        />
        <Editor
          onClose={this.handleCloseFile}
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
  // @todo others
};

function mapStateToProps(state) {
  return {
    galleryVisible: state.assetAdmin.gallery.visible,
    editorVisible: state.assetAdmin.editor.visible,
    folderID: state.assetAdmin.gallery.folderID,
    folderFiles: state.assetAdmin.gallery.files,
    fileID: state.assetAdmin.editor.fileID,
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

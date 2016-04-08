import React from 'react';
import SilverStripeComponent from 'silverstripe-component';
import { default as GalleryContainer } from 'sections/gallery/controller';
import EditorContainer from 'sections/editor/controller';
import * as galleryActions from 'state/gallery/actions';
import * as editorActions from 'state/editor/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CONSTANTS from 'constants/index';

class AssetAdminContainer extends SilverStripeComponent {
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
  }

  componentDidMount() {
    super.componentDidMount();
    this.handleURL(window.ss.router, window.ss.router.current);
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
      desiredURL = CONSTANTS.FOLDER_ROUTE
        .replace(/:folderId\??/, this.props.folderID);
    } else if (this.props.editorVisible) {
      desiredURL = CONSTANTS.EDITING_ROUTE
        .replace(/:fileId\??/, this.props.fileID)
        .replace(/:folderId\??/, this.props.folderID);
    }

    if (desiredURL !== null && desiredURL !== router.current) {
      // 3rd arg false so as not to trigger handleEnterRoute() and therefore an infinite loops
      router.show(desiredURL, null, false);
    }
  }

  /**
   * Respond to a route change, provided by SS3-style javascript
   */
  handleURL(router, url) {
    const editingRoute = new router.Route(CONSTANTS.EDITING_ROUTE);
    const folderRoute = new router.Route(CONSTANTS.FOLDER_ROUTE);

    const params = {};

    // File editing view
    if (editingRoute.match(url || router.current, params)) {
      this.props.actions.gallery.hide();
      this.props.actions.editor.show(params.folderId, params.fileId);

    // Folder view
    } else if (folderRoute.match(router.current, params)) {
      this.props.actions.editor.hide();
      this.props.actions.gallery.show(params.folderId);

    // Default redirection
    } else {
      this.props.actions.editor.hide();
      this.props.actions.gallery.show(0);
      router.show(CONSTANTS.FOLDER_ROUTE.replace(':folderId', 0), null, false);
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
        <GalleryContainer
          name={this.props.name}
          limit={this.props.limit}
          bulkActions={this.props.bulkActions}
          filesByParentApi={this.props.filesByParentApi}
          addFolderApi={this.props.addFolderApi}
          deleteApi={this.props.deleteApi}

          onOpenFile={this.handleOpenFile}
        />
        <EditorContainer
          onClose={this.handleCloseFile}
        />
      </div>
    );
  }

  handleEnterRoute(ctx, next) {
    this.handleURL(window.ss.router, ctx.path);
    next();
  }

  handleExitRoute(ctx, next) {
    // TO DO: Add action for leaving both the gallery and the edit view
    next();
  }
}

function mapStateToProps(state) {
  return {
    galleryVisible: state.assetAdmin.gallery.visible,
    editorVisible: state.assetAdmin.editor.visible,
    folderID: state.assetAdmin.gallery.folderID,
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

export default connect(mapStateToProps, mapDispatchToProps)(AssetAdminContainer);

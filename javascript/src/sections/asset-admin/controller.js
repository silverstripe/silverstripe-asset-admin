import $ from 'jQuery';
import React from 'react';
import SilverStripeComponent from 'silverstripe-component';
import * as galleryActions from '../../state/gallery/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FileBackend from '../../backend/file-backend';
import CONSTANTS from '../../constants';

class AssetAdminContainer extends SilverStripeComponent {

    constructor(props) {
        super(props);

        var $componentWrapper = $('.asset-gallery').find('.asset-gallery-component-wrapper'),
            $search = $('.cms-search-form');

        if ($search.find('[type=hidden][name="q[Folder]"]').length === 0) {
            $search.append('<input type="hidden" name="q[Folder]" />');
        }

        this.backend = new FileBackend(
            $componentWrapper.data('asset-gallery-files-by-parent-url'),
            $componentWrapper.data('asset-gallery-files-by-sibling-url'),
            $componentWrapper.data('asset-gallery-search-url'),
            $componentWrapper.data('asset-gallery-update-url'),
            $componentWrapper.data('asset-gallery-delete-url'),
            $componentWrapper.data('asset-gallery-limit'),
            $componentWrapper.data('asset-gallery-bulk-actions'),
            $search.find('[type=hidden][name="q[Folder]"]'),
            $componentWrapper.data('asset-gallery-initial-folder') || ''
        );

        this.handleBackendFetch = this.handleBackendFetch.bind(this);
        this.handleBackendSave = this.handleBackendSave.bind(this);
        this.handleBackendDelete = this.handleBackendDelete.bind(this);
        this.handleBackendNavigate = this.handleBackendNavigate.bind(this);
        this.handleBackendMore = this.handleBackendMore.bind(this);
        this.handleBackendSearch = this.handleBackendSearch.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        
        var fetchMethod = 'getFilesByParentID';
        
        if (this.props.idFromURL && this.props.idFromURL !== this.props.initialFolder) {
            // If the url is to edit a specific file.
            // Doing this because the gallery view and the edit view are handled
            // by separate SilverStripe controllers. 
            // When the AssetGalleryField becomes the entire section we can handle this differently
            fetchMethod = 'getFilesBySiblingID';
        }
        
        this.backend[fetchMethod](this.props.idFromURL)
            .done((data, status, xhr) => {
                // Handle the initial payload from the FileBackend.
                // This handler will be called after this.handleBackendFetch

                const route = new window.ss.router.Route(CONSTANTS.EDITING_ROUTE);
                const currentPath = window.ss.router.current;
                const files = this.props.assetAdmin.gallery.files;

                var params = {};

                // If we're on a file edit route we need to set the file currently being edited.
                if (route.match(currentPath, params)) {
                    this.props.actions.setEditing(files.filter((file) => file.id === parseInt(params.id, 10))[0]);
                }

                this.props.actions.setPath(currentPath);

            }.bind(this));

        this.backend.addListener('onFetchData', this.handleBackendFetch);
        this.backend.addListener('onSaveData', this.handleBackendSave);
        this.backend.addListener('onDeleteData', this.handleBackendDelete);
        this.backend.addListener('onNavigateData', this.handleBackendNavigate);
        this.backend.addListener('onMoreData', this.handleBackendMore);
        this.backend.addListener('onSearchData', this.handleBackendSearch);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.backend.removeListener('onFetchData', this.handleBackendFetch);
        this.backend.removeListener('onSaveData', this.handleBackendSave);
        this.backend.removeListener('onDeleteData', this.handleBackendDelete);
        this.backend.removeListener('onNavigateData', this.handleBackendNavigate);
        this.backend.removeListener('onMoreData', this.handleBackendMore);
        this.backend.removeListener('onSearchData', this.handleBackendSearch);
    }

    render() {
        // Give each child component access to the FileBackend.
        const children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, { backend: this.backend });
        });

        return (
            <div className="gallery">
                {children}
            </div>
        );
    }

    handleEnterRoute(ctx, next) {
        this.props.actions.setPath(ctx.path);
        next();
    }

    handleExitRoute(ctx, next) {
        this.props.actions.setPath(null);
        next();
    }

    handleBackendFetch(data) {
        this.props.actions.setParentFolderId(data.parent);
        this.props.actions.addFiles(data.files, data.count);
    }

    handleBackendSave(id, values) {
        window.ss.router.show(CONSTANTS.HOME_ROUTE);
        this.props.actions.setEditing(null);
        this.props.actions.updateFile(id, { title: values.title, basename: values.basename });
    }

    handleBackendDelete(data) {
        this.props.actions.deselectFiles(data);
        this.props.actions.removeFiles(data);
    }

    handleBackendNavigate(data) {
        this.props.actions.removeFiles();
        this.props.actions.addFiles(data.files, data.count);
    }

    handleBackendMore(data) {
        this.props.actions.addFiles(this.props.assetAdmin.gallery.files.concat(data.files), data.count);
    }

    handleBackendSearch(data) {
        this.props.actions.addFiles(data.files, data.count);
    }
}

function mapStateToProps(state) {
    return {
        assetAdmin: state.assetAdmin
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(galleryActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetAdminContainer);

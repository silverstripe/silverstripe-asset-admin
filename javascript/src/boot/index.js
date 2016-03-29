import $ from 'jQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../state/configureStore';
import { setRoute } from '../state/gallery/actions';
import AssetAdminContainer from '../sections/asset-admin/controller';
import { default as GalleryContainer } from '../sections/gallery/controller';
import EditorContainer from '../sections/editor/controller';
import CONSTANTS from '../constants';

function getGalleryProps() {
	var $componentWrapper = $('.asset-gallery').find('.asset-gallery-component-wrapper'),
		initialFolder = $componentWrapper.data('asset-gallery-initial-folder'),
		currentFolder = initialFolder;

	return {
		current_folder: currentFolder,
		initial_folder: initialFolder,
		name: $('.asset-gallery').data('asset-gallery-name')
	};
}

$.entwine('ss', function($) {
	$('.asset-gallery-component-wrapper').entwine({
		onadd: function () {
			const store = configureStore();
			const galleryProps = getGalleryProps();

			ReactDOM.render(
				<Provider store={store}>
					<AssetAdminContainer initialFolder={this.data('asset-gallery-initial-folder')} idFromURL={this.data('asset-gallery-id-from-url')} >
						<GalleryContainer {...galleryProps} />
						<EditorContainer />
					</AssetAdminContainer>
				</Provider>,
				this[0]
			);

			// Catch any routes that aren't handled by components.
			window.ss.router('*', () => {});
		},
		onremove: function () {
			ReactDOM.unmountComponentAtNode(this[0]);
		}
	});
});


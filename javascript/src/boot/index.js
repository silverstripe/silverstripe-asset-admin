import $ from 'jQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../state/configureStore';
import GalleryComponent from '../containers/gallery-container';
import FileBackend from '../backend/file-backend';

function getVar(name) {
	var parts = window.location.href.split('?');

	if (parts.length > 1) {
		parts = parts[1].split('#');
	}

	let variables = parts[0].split('&');

	for (var i = 0; i < variables.length; i++) {
		let parts = variables[i].split('=');

		if (decodeURIComponent(parts[0]) === name) {
			return decodeURIComponent(parts[1]);
		}
	}

	return null;
}

function hasSessionStorage() {
	return typeof window.sessionStorage !== 'undefined' && window.sessionStorage !== null;
}

function getProps(props) {
	var $componentWrapper = $('.asset-gallery').find('.asset-gallery-component-wrapper'),
		$search = $('.cms-search-form'),
		initialFolder = $('.asset-gallery').data('asset-gallery-initial-folder'),
		currentFolder = getVar('q[Folder]') || initialFolder,
		backend,
		defaults;

	if ($search.find('[type=hidden][name="q[Folder]"]').length == 0) {
		$search.append('<input type="hidden" name="q[Folder]" />');
	}

	// Do we need to set up a default backend?
	if (typeof props === 'undefined' || typeof props.backend === 'undefined') {
		backend = FileBackend.create(
			$componentWrapper.data('asset-gallery-fetch-url'),
			$componentWrapper.data('asset-gallery-search-url'),
			$componentWrapper.data('asset-gallery-update-url'),
			$componentWrapper.data('asset-gallery-delete-url'),
			$componentWrapper.data('asset-gallery-limit'),
			$componentWrapper.data('asset-gallery-bulk-actions'),
			$search.find('[type=hidden][name="q[Folder]"]'),
			currentFolder
		);

		backend.emit(
			'filter',
			getVar('q[Name]'),
			getVar('q[AppCategory]'),
			getVar('q[Folder]'),
			getVar('q[CreatedFrom]'),
			getVar('q[CreatedTo]'),
			getVar('q[CurrentFolderOnly]')
		);
	}

	defaults = {
		backend: backend,
		current_folder: currentFolder,
		cmsEvents: {},
		initial_folder: initialFolder,
		name: $('.asset-gallery').data('asset-gallery-name')
	};

	return $.extend(true, defaults, props);
}

var props = getProps();
const initialState = {
	selectedFiles: []
}

const store = configureStore(initialState); //Create the redux store


ReactDOM.render(
    <Provider store={store}>
        <GalleryComponent {...props} />
    </Provider>,
    $('.asset-gallery-component-wrapper')[0]
);
console.log(store.getState())

// $.entwine('ss', function ($) {
// 
// 	$('.asset-gallery').entwine({
// 
// 		Component: null,
// 
// 		'getCurrentFolder': function () {
// 			var currentFolder = '',
// 				initialFolder = this.find('.asset-gallery-component-wrapper').data('asset-gallery-initial-folder'),
// 				qFolder = getVar('q[Folder]'),
// 				urlParts = window.location.pathname.split('/'),
// 				sessionFolder;
// 
// 			if (qFolder !== null) {
// 				currentFolder = qFolder;
// 			} else if (hasSessionStorage() && urlParts.indexOf('show') === -1) {
// 				sessionFolder = window.sessionStorage.getItem(this[0].id);
// 
// 				if (sessionFolder !== null) {
// 					currentFolder = sessionFolder;
// 				}
// 			} else {
// 				currentFolder = initialFolder;
// 			}
// 
// 			return currentFolder;
// 		},
// 
// 		/**
// 		 * @func getProps
// 		 * @param object props - Used to augment defaults.
// 		 * @desc The initial props passed into the GalleryComponent. Can be overridden by other Entwine components.
// 		 */
// 		'getProps': function (props) {
// 			var $componentWrapper = this.find('.asset-gallery-component-wrapper'),
// 				$search = $('.cms-search-form'),
// 				initialFolder = this.data('asset-gallery-initial-folder'),
// 				currentFolder = getVar('q[Folder]') || initialFolder,
// 				backend,
// 				defaults;
// 
// 			if ($search.find('[type=hidden][name="q[Folder]"]').length == 0) {
// 				$search.append('<input type="hidden" name="q[Folder]" />');
// 			}
// 
// 			// Do we need to set up a default backend?
// 			if (typeof props === 'undefined' || typeof props.backend === 'undefined') {
// 				backend = FileBackend.create(
// 					$componentWrapper.data('asset-gallery-fetch-url'),
// 					$componentWrapper.data('asset-gallery-search-url'),
// 					$componentWrapper.data('asset-gallery-update-url'),
// 					$componentWrapper.data('asset-gallery-delete-url'),
// 					$componentWrapper.data('asset-gallery-limit'),
// 					$componentWrapper.data('asset-gallery-bulk-actions'),
// 					$search.find('[type=hidden][name="q[Folder]"]'),
// 					currentFolder
// 				);
// 
// 				backend.emit(
// 					'filter',
// 					getVar('q[Name]'),
// 					getVar('q[AppCategory]'),
// 					getVar('q[Folder]'),
// 					getVar('q[CreatedFrom]'),
// 					getVar('q[CreatedTo]'),
// 					getVar('q[CurrentFolderOnly]')
// 				);
// 			}
// 
// 			defaults = {
// 				backend: backend,
// 				current_folder: currentFolder,
// 				cmsEvents: {},
// 				initial_folder: initialFolder,
// 				name: this.data('asset-gallery-name')
// 			};
// 
// 			return $.extend(true, defaults, props);
// 		},
// 
// 		'onadd': function () {
// 			var props = this.getProps();
// 
// 			this.setComponent(React.render(
// 				<GalleryComponent {...props} />,
// 				this.find('.asset-gallery-component-wrapper')[0]
// 			));
// 		}
// 	});
// });

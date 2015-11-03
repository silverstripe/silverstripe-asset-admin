import $ from 'jquery';
import React from 'react';
import GalleryComponent from './component/gallery-component';
import FileBackend from './backend/file-backend';

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

$.entwine('ss', function ($) {

	$('.asset-gallery').entwine({

		Component: null,

		'getCurrentFolder': function () {
			var currentFolder = '',
				initialFolder = this.find('.asset-gallery-component-wrapper').data('asset-gallery-initial-folder'),
				qFolder = getVar('q[Folder]'),
				sessionFolder;

			if (qFolder !== null) {
				currentFolder = qFolder;
			} else if (hasSessionStorage()) {
				sessionFolder = window.sessionStorage.getItem(this[0].id);

				if (sessionFolder !== null) {
					currentFolder = sessionFolder;
				}
			} else {
				currentFolder = initialFolder;
			}

			return currentFolder;
		},

		/**
		 * @func getProps
		 * @param object props - Used to augment defaults.
		 * @desc The initial props passed into the GalleryComponent. Can be overridden by other Entwine components.
		 */
		'getProps': function (props) {
			var $componentWrapper = this.find('.asset-gallery-component-wrapper'),
				$search = $('.cms-search-form'),
				currentFolder = this.getCurrentFolder(),
				backend,
				defaults;

			if ($search.find('[type=hidden][name="q[Folder]"]').length == 0) {
				$search.append('<input type="hidden" name="q[Folder]" />');
			}

			// Do we need to set up a default backend?
			if (typeof props === 'undefined' || typeof props.backend === 'undefined') {
				backend = FileBackend.create(
					$componentWrapper.data('asset-gallery-search-url'),
					$componentWrapper.data('asset-gallery-update-url'),
					$componentWrapper.data('asset-gallery-delete-url'),
					$componentWrapper.data('asset-gallery-limit'),
					$componentWrapper.data('asset-gallery-bulk-actions'),
					$search.find('[type=hidden][name="q[Folder]"]')
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
				cmsEvents: {
					'cms.fileAdded': function () {
						// Reload the gallery
						this.props.backend.navigate(this.props.current_folder);
					},
					'cms.updateSelected': function(event, selectedFiles) {
						selectedFiles = selectedFiles || [];

						this.setState({
							'selectedFiles': selectedFiles
						});
					},
					'cms.deselectFolder': function(event, file) {
						var currentlySelected = this.state.selectedFiles,
							fileIndex = currentlySelected.indexOf(file.id);
						
						currentlySelected.splice(fileIndex, 1);
						
						this.setState({
							'selectedFiles': currentlySelected
						});
					}
				},
				hasSessionStorage: hasSessionStorage,
				initial_folder: $componentWrapper.data('asset-gallery-initial-folder'),
				name: $componentWrapper.data('asset-gallery-name')
			};

			return $.extend(true, defaults, props);
		},

		'onadd': function () {
			var props = this.getProps();

			this.setComponent(React.render(
				<GalleryComponent {...props} />,
				this.find('.asset-gallery-component-wrapper')[0]
			));
		}
	});
});

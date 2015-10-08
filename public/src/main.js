import $ from 'jquery';
import React from 'react';
import GalleryComponent from './component/gallery-component';
import FileStore from './store/file-store';

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

$('.asset-gallery').entwine({
	'onadd': function () {
		let props = {
			'name': this[0].getAttribute('data-asset-gallery-name'),
			'initial_folder': this[0].getAttribute('data-asset-gallery-initial-folder')
		};

		if (props.name === null) {
			return;
		}

		let $search = $('.cms-search-form');

		if ($search.find('[type=hidden][name="q[Folder]"]').length == 0) {
			$search.append('<input type="hidden" name="q[Folder]" />');
		}

		props.store = FileStore.create(
				this[0].getAttribute('data-asset-gallery-search-url'),
				this[0].getAttribute('data-asset-gallery-update-url'),
				this[0].getAttribute('data-asset-gallery-delete-url'),
				this[0].getAttribute('data-asset-gallery-limit'),
				$search.find('[type=hidden][name="q[Folder]"]')
		).addEventListeners();

		props.store.emit(
			'filter',
			getVar('q[Name]'),
			getVar('q[AppCategory]'),
			getVar('q[Folder]'),
			getVar('q[CreatedFrom]'),
			getVar('q[CreatedTo]'),
			getVar('q[CurrentFolderOnly]')
		);

		props.current_folder = getVar('q[Folder]') || props.initial_folder;

		React.render(
			<GalleryComponent {...props} />,
			this[0]
		);
	}
});

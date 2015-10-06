import $ from 'jquery';
import React from 'react';
import Gallery from './component/gallery';

$('.asset-gallery').entwine({
	'onadd': function () {
		var props = {};

		props.name = this[0].getAttribute('data-asset-gallery-name');
		props.data_url = this[0].getAttribute('data-asset-gallery-data-url');
		props.update_url = this[0].getAttribute('data-asset-gallery-update-url');
		props.delete_url = this[0].getAttribute('data-asset-gallery-delete-url');
		props.initial_folder = this[0].getAttribute('data-asset-gallery-initial-folder');
		props.limit = this[0].getAttribute('data-asset-gallery-limit');

		props.filter_name = this[0].getAttribute('data-asset-gallery-filter-name');
		props.filter_type = this[0].getAttribute('data-asset-gallery-filter-type');
		props.filter_created_from = this[0].getAttribute('data-asset-gallery-filter-created-from');
		props.filter_created_to = this[0].getAttribute('data-asset-gallery-filter-created-to');
		props.filter_folder = this[0].getAttribute('data-asset-gallery-filter-folder');

		if (props.name === null || props.url === null) {
			return;
		}

		React.render(
			<Gallery {...props} />,
			this[0]
		);
	}
});

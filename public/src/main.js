import React from 'react';
import Gallery from './component/gallery';

jQuery('.asset-gallery').entwine({
	'onadd': function () {
		var props = {};

		props.name = this[0].getAttribute('data-asset-gallery-name');
		props.data_url = this[0].getAttribute('data-asset-gallery-data-url');
		props.update_url = this[0].getAttribute('data-asset-gallery-update-url');
		props.delete_url = this[0].getAttribute('data-asset-gallery-delete-url');
		props.initial_folder = this[0].getAttribute('data-asset-gallery-initial-folder');

		if (props.name === null || props.url === null) {
			return;
		}

		React.render(
			<Gallery {...props} />,
			this[0]
		);
	}
});

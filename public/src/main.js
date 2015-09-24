import React from 'react';
import Gallery from './component/gallery';

jQuery('.asset-gallery').entwine({
    onadd: function () {
        var props = {};

        props.name = this[0].getAttribute('data-asset-gallery-name');
        props.url = this[0].getAttribute('data-asset-gallery-url');

        if (props.name === null || props.url === null) {
            return;
        }

        React.render(
            <Gallery {...props} />,
            this[0]
        );
    }
});

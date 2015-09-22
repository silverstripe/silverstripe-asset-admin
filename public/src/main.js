import React from 'react';
import Gallery from './component/gallery';

let elements = document.querySelectorAll('.asset-gallery');

[].forEach.call(elements, (element) => {
    React.render(
        <Gallery
            name={element.getAttribute("data-asset-gallery-name")}
            url={element.getAttribute("data-asset-gallery-url")}
            />,
        element
    );
});

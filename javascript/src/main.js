/**
 * @file Entry point to the application.
 * @requires module:react
 * @requires module:./gallery
 */

import React from 'react';
import Gallery from './component/gallery';

React.render(
    <Gallery />,
    document.getElementById('gallery')
);

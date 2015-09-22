/**
 * @file Dispatches galery actions to the item store.
 * @module galeryDispatcher
 * @requires module:react
 */

import {Dispatcher} from 'flux';

let _galleryDispatcher = new Dispatcher(); // Singleton

export default _galleryDispatcher;
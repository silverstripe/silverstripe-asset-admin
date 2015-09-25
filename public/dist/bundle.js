(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatcherGalleryDispatcher = require('../dispatcher/galleryDispatcher');

var _dispatcherGalleryDispatcher2 = _interopRequireDefault(_dispatcherGalleryDispatcher);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var galleryActions = {
    /**
     * @func create
     * @param {object} data
     * @desc Creates a gallery item.
     */
    create: function create(data, silent) {
        _dispatcherGalleryDispatcher2['default'].dispatch({
            action: _constants2['default'].ITEM_STORE.CREATE,
            data: data,
            silent: silent
        });
    },

    /**
     * @func destroy
     * @param {string} id
     * @desc destroys a gallery item.
     */
    destroy: function destroy(id, silent) {
        _dispatcherGalleryDispatcher2['default'].dispatch({
            action: _constants2['default'].ITEM_STORE.DESTROY,
            data: {
                id: id
            },
            silent: silent
        });
    },

    /**
     * @func update
     * @param {string} id
     * @param {string} key
     * @desc Updates a gallery item.
     */
    update: function update(id, updates, silent) {
        _dispatcherGalleryDispatcher2['default'].dispatch({
            action: _constants2['default'].ITEM_STORE.UPDATE,
            data: {
                id: id,
                updates: updates
            },
            silent: silent
        });
    }
};

exports['default'] = galleryActions;
module.exports = exports['default'];

},{"../constants":5,"../dispatcher/galleryDispatcher":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var _actionGalleryActions = require('../action/galleryActions');

var _actionGalleryActions2 = _interopRequireDefault(_actionGalleryActions);

var _storeItemStore = require('../store/itemStore');

var _storeItemStore2 = _interopRequireDefault(_storeItemStore);

/**
 * @func getGalleryState
 * @private
 * @return {object}
 * @desc Factory for the gallery's state object.
 */
function getGalleryState() {
    return {
        items: _storeItemStore2['default'].getAll()
    };
}

var Gallery = (function (_React$Component) {
    _inherits(Gallery, _React$Component);

    function Gallery(props) {
        _classCallCheck(this, Gallery);

        _get(Object.getPrototypeOf(Gallery.prototype), 'constructor', this).call(this, props);

        var items = window.SS_ASSET_GALLERY[this.props.name];

        // Populate the store.
        for (var i = 0; i < items.length; i += 1) {
            _actionGalleryActions2['default'].create(items[i], true);
        }

        // Set the initial state of the gallery.
        this.state = getGalleryState();
    }

    _createClass(Gallery, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this = this;

            // Interface with the form so we can update state based on changes in the outside world.
            var $form = jQuery(_react2['default'].findDOMNode(this)).closest('form');

            if ($form.length) {
                $form.on('dirty', function () {
                    _this.fetch();
                });
            }

            // Explicitly bind the current context to the callback.
            // Node event emitters (the item store) bind their context when the callback it's invoked.
            _storeItemStore2['default'].addChangeListener(this.onChange.bind(this));
        }
    }, {
        key: 'componentDidUnmount',
        value: function componentDidUnmount() {
            // Explicitly bind the current context to the callback.
            // Node event emitters (the item store) bind their context when the callback it's invoked.
            _storeItemStore2['default'].removeChangeListener(this.onChange.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var items = this.getItemComponents();

            return _react2['default'].createElement(
                'div',
                { className: 'gallery' },
                _react2['default'].createElement(
                    'div',
                    { className: 'gallery__items' },
                    items
                )
            );
        }

        /**
         * @func onChange
         * @desc Updates the gallery state when somethnig changes in the store.
         */
    }, {
        key: 'onChange',
        value: function onChange() {
            this.setState(getGalleryState());
        }

        /**
         * @func getItemComponents
         * @desc Generates the item components which populate the gallery.
         */
    }, {
        key: 'getItemComponents',
        value: function getItemComponents() {
            var self = this;

            return Object.keys(this.state.items).map(function (key) {
                var item = self.state.items[key],
                    props = {};

                props.id = item.id;
                props.title = item.title;
                props.url = item.url;

                return _react2['default'].createElement(_item2['default'], _extends({ key: key }, props));
            });
        }

        /**
         * @func fetch
         * @desc Gets the latest data from the server.
         */
    }, {
        key: 'fetch',
        value: function fetch() {
            var _this2 = this;

            return jQuery.get(this.props.url).error(function () {
                console.log('error fetching data');
            }).done(function (data) {
                for (var i = 0; i < data.files.length; i += 1) {
                    _actionGalleryActions2['default'].create(data.files[i], true);
                    _this2.state = getGalleryState();
                }
            });
        }
    }]);

    return Gallery;
})(_react2['default'].Component);

exports['default'] = Gallery;
module.exports = exports['default'];

},{"../action/galleryActions":2,"../store/itemStore":8,"./item":4,"react":"react"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actionGalleryActions = require('../action/galleryActions');

var _actionGalleryActions2 = _interopRequireDefault(_actionGalleryActions);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var Item = (function (_React$Component) {
    _inherits(Item, _React$Component);

    function Item() {
        _classCallCheck(this, Item);

        _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Item, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { className: 'item' },
                _react2['default'].createElement(
                    'div',
                    { className: 'item__thumbnail' },
                    _react2['default'].createElement(
                        'div',
                        { className: 'item__actions' },
                        _react2['default'].createElement('button', {
                            className: 'item__actions__action item__actions__action--remove [ font-icon-cancel-circled ]',
                            type: 'button',
                            onClick: this.handleRemove.bind(this) }),
                        _react2['default'].createElement('button', {
                            className: 'item__actions__action item__actions__action--edit [ font-icon-pencil ]',
                            type: 'button',
                            onClick: this.handleEdit.bind(this) })
                    )
                ),
                _react2['default'].createElement(
                    'p',
                    { className: 'item__title' },
                    this.props.title
                )
            );
        }

        /**
         * @func handleEdit
         * @desc Event handler for the 'edit' button.
         */
    }, {
        key: 'handleEdit',
        value: function handleEdit() {}
        // TODO: Will we have an editing React component or render a form server-side?

        /**
         * @func handleRemove
         * @desc Event handler for the 'remove' button.
         */

    }, {
        key: 'handleRemove',
        value: function handleRemove() {
            _actionGalleryActions2['default'].destroy(this.props.id);
        }
    }]);

    return Item;
})(_react2['default'].Component);

Item.propTypes = {
    id: _react2['default'].PropTypes.string,
    title: _react2['default'].PropTypes.string
};

exports['default'] = Item;
module.exports = exports['default'];

},{"../action/galleryActions":2,"../constants":5,"react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var CONSTANTS = {
    ITEM_STORE: {
        CHANGE: 'change',
        CREATE: 'create',
        UPDATE: 'update',
        DESROY: 'destroy'
    }
};

exports['default'] = CONSTANTS;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _flux = require('flux');

var _galleryDispatcher = new _flux.Dispatcher(); // Singleton

exports['default'] = _galleryDispatcher;
module.exports = exports['default'];

},{"flux":"flux"}],7:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentGallery = require('./component/gallery');

var _componentGallery2 = _interopRequireDefault(_componentGallery);

jQuery('.asset-gallery').entwine({
	'onadd': function onadd() {
		var props = {};

		props.name = this[0].getAttribute('data-asset-gallery-name');
		props.data_url = this[0].getAttribute('data-asset-gallery-data-url');
		props.update_url = this[0].getAttribute('data-asset-gallery-update-url');
		props.delete_url = this[0].getAttribute('data-asset-gallery-delete-url');

		if (props.name === null || props.url === null) {
			return;
		}

		_react2['default'].render(_react2['default'].createElement(_componentGallery2['default'], props), this[0]);
	}
});

},{"./component/gallery":3,"react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _dispatcherGalleryDispatcher = require('../dispatcher/galleryDispatcher');

var _dispatcherGalleryDispatcher2 = _interopRequireDefault(_dispatcherGalleryDispatcher);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _items = {};

/**
 * @func create
 * @private
 * @param {object} itemData
 * @desc Adds a gallery item to the store.
 */
function create(itemData) {
    _items[itemData.id] = itemData;
}

/**
 * @func destroy
 * @private
 * @param {string} id
 * @desc Removes a gallery item from the store.
 */
function destroy(id) {
    delete _items[id];
}

/**
 * @func destroy
 * @private
 * @param {string} id
 * @param {object} itemData
 * @desc Updates an item in the store.
 */
function update(id, itemData) {
    // TODO:
}

var ItemStore = (function (_EventEmitter) {
    _inherits(ItemStore, _EventEmitter);

    function ItemStore() {
        _classCallCheck(this, ItemStore);

        _get(Object.getPrototypeOf(ItemStore.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ItemStore, [{
        key: 'getAll',

        /**
         * @return {object}
         * @desc Gets the entire collection of items.
         */
        value: function getAll() {
            return _items;
        }

        /**
         * @func getById
         * @param {string} id
         * @return {object}
         */
    }, {
        key: 'getById',
        value: function getById(id) {
            return _items[id];
        }

        /**
         * @func emitChange
         * @desc Triggered when something changes in the store.
         */
    }, {
        key: 'emitChange',
        value: function emitChange() {
            this.emit(_constants2['default'].ITEM_STORE.CHANGE);
        }

        /**
         * @param {function} callback
         */
    }, {
        key: 'addChangeListener',
        value: function addChangeListener(callback) {
            this.on(_constants2['default'].ITEM_STORE.CHANGE, callback);
        }

        /**
         * @param {function} callback
         */
    }, {
        key: 'removeChangeListener',
        value: function removeChangeListener(callback) {
            this.removeListener(_constants2['default'].ITEM_STORE.CHANGE, callback);
        }
    }]);

    return ItemStore;
})(_events2['default']);

var _itemStore = new ItemStore(); // Singleton

_dispatcherGalleryDispatcher2['default'].register(function (payload) {
    switch (payload.action) {
        case _constants2['default'].ITEM_STORE.CREATE:
            create(payload.data);
            if (!payload.silent) {
                _itemStore.emitChange(payload.silent);
            }
            break;

        case _constants2['default'].ITEM_STORE.DESTROY:
            destroy(payload.data.id);
            if (!payload.silent) {
                _itemStore.emitChange(payload.silent);
            }
            break;

        case _constants2['default'].ITEM_STORE.UPDATE:
            update(payload.data.id, payload.data.updates);
            if (!payload.silent) {
                _itemStore.emitChange();
            }
            break;
    }

    return true; // No errors. Needed by promise in Dispatcher.
});

exports['default'] = _itemStore;
module.exports = exports['default'];

},{"../constants":5,"../dispatcher/galleryDispatcher":6,"events":1}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvYWN0aW9uL2dhbGxlcnlBY3Rpb25zLmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZ2FsbGVyeS5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2l0ZW0uanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvc3RvcmUvaXRlbVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDLE1BQU07QUFDNUIsa0JBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLGdCQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNqQiwwQkFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQzNCO0FBQ0Qsa0JBQU07QUFBQSxLQUNiOztBQUVELFdBQU8sSUFBSSxDQUFDO0NBQ2YsQ0FBQyxDQUFDOztxQkFFWSxVQUFVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsImltcG9ydCBnYWxsZXJ5RGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2dhbGxlcnlEaXNwYXRjaGVyJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxubGV0IGdhbGxlcnlBY3Rpb25zID0ge1xuICAgIC8qKlxuICAgICAqIEBmdW5jIGNyZWF0ZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG4gICAgICogQGRlc2MgQ3JlYXRlcyBhIGdhbGxlcnkgaXRlbS5cbiAgICAgKi9cbiAgICBjcmVhdGU6IGZ1bmN0aW9uIChkYXRhLCBzaWxlbnQpIHtcbiAgICAgICAgZ2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgICAgICAgYWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5DUkVBVEUsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgc2lsZW50OiBzaWxlbnRcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGRlc3Ryb3lcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICAgKiBAZGVzYyBkZXN0cm95cyBhIGdhbGxlcnkgaXRlbS5cbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbiAoaWQsIHNpbGVudCkge1xuICAgICAgICBnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICAgICAgICBhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLkRFU1RST1ksXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lsZW50OiBzaWxlbnRcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBmdW5jIHVwZGF0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICAgKiBAZGVzYyBVcGRhdGVzIGEgZ2FsbGVyeSBpdGVtLlxuICAgICAqL1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGlkLCB1cGRhdGVzLCBzaWxlbnQpIHtcbiAgICAgICAgZ2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgICAgICAgYWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5VUERBVEUsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgIHVwZGF0ZXM6IHVwZGF0ZXNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaWxlbnQ6IHNpbGVudFxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYWxsZXJ5QWN0aW9ucztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSXRlbSBmcm9tICcuL2l0ZW0nO1xuaW1wb3J0IGdhbGxlcnlBY3Rpb25zIGZyb20gJy4uL2FjdGlvbi9nYWxsZXJ5QWN0aW9ucyc7XG5pbXBvcnQgaXRlbVN0b3JlIGZyb20gJy4uL3N0b3JlL2l0ZW1TdG9yZSc7XG5cbi8qKlxuICogQGZ1bmMgZ2V0R2FsbGVyeVN0YXRlXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7b2JqZWN0fVxuICogQGRlc2MgRmFjdG9yeSBmb3IgdGhlIGdhbGxlcnkncyBzdGF0ZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGdldEdhbGxlcnlTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpdGVtczogaXRlbVN0b3JlLmdldEFsbCgpXG4gICAgfTtcbn1cblxuY2xhc3MgR2FsbGVyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgdmFyIGl0ZW1zID0gd2luZG93LlNTX0FTU0VUX0dBTExFUllbdGhpcy5wcm9wcy5uYW1lXTtcblxuICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgc3RvcmUuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtc1tpXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGdhbGxlcnkuXG4gICAgICAgIHRoaXMuc3RhdGUgPSBnZXRHYWxsZXJ5U3RhdGUoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgICAgIC8vIEludGVyZmFjZSB3aXRoIHRoZSBmb3JtIHNvIHdlIGNhbiB1cGRhdGUgc3RhdGUgYmFzZWQgb24gY2hhbmdlcyBpbiB0aGUgb3V0c2lkZSB3b3JsZC5cbiAgICAgICAgdmFyICRmb3JtID0galF1ZXJ5KFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5jbG9zZXN0KCdmb3JtJyk7XG5cbiAgICAgICAgaWYgKCRmb3JtLmxlbmd0aCkge1xuICAgICAgICAgICAgJGZvcm0ub24oJ2RpcnR5JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2goKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXhwbGljaXRseSBiaW5kIHRoZSBjdXJyZW50IGNvbnRleHQgdG8gdGhlIGNhbGxiYWNrLlxuICAgICAgICAvLyBOb2RlIGV2ZW50IGVtaXR0ZXJzICh0aGUgaXRlbSBzdG9yZSkgYmluZCB0aGVpciBjb250ZXh0IHdoZW4gdGhlIGNhbGxiYWNrIGl0J3MgaW52b2tlZC5cbiAgICAgICAgaXRlbVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkVW5tb3VudCAoKSB7XG4gICAgICAgIC8vIEV4cGxpY2l0bHkgYmluZCB0aGUgY3VycmVudCBjb250ZXh0IHRvIHRoZSBjYWxsYmFjay5cbiAgICAgICAgLy8gTm9kZSBldmVudCBlbWl0dGVycyAodGhlIGl0ZW0gc3RvcmUpIGJpbmQgdGhlaXIgY29udGV4dCB3aGVuIHRoZSBjYWxsYmFjayBpdCdzIGludm9rZWQuXG4gICAgICAgIGl0ZW1TdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5nZXRJdGVtQ29tcG9uZW50cygpO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2l0ZW1zJz5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW1zfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgb25DaGFuZ2VcbiAgICAgKiBAZGVzYyBVcGRhdGVzIHRoZSBnYWxsZXJ5IHN0YXRlIHdoZW4gc29tZXRobmlnIGNoYW5nZXMgaW4gdGhlIHN0b3JlLlxuICAgICAqL1xuICAgIG9uQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKGdldEdhbGxlcnlTdGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBnZXRJdGVtQ29tcG9uZW50c1xuICAgICAqIEBkZXNjIEdlbmVyYXRlcyB0aGUgaXRlbSBjb21wb25lbnRzIHdoaWNoIHBvcHVsYXRlIHRoZSBnYWxsZXJ5LlxuICAgICAqL1xuICAgIGdldEl0ZW1Db21wb25lbnRzKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuc3RhdGUuaXRlbXMpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHNlbGYuc3RhdGUuaXRlbXNba2V5XSxcbiAgICAgICAgICAgICAgICBwcm9wcyA9IHt9O1xuXG4gICAgICAgICAgICBwcm9wcy5pZCA9IGl0ZW0uaWQ7XG4gICAgICAgICAgICBwcm9wcy50aXRsZSA9IGl0ZW0udGl0bGU7XG4gICAgICAgICAgICBwcm9wcy51cmwgPSBpdGVtLnVybDtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8SXRlbSBrZXk9e2tleX0gey4uLnByb3BzfSAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgZmV0Y2hcbiAgICAgKiBAZGVzYyBHZXRzIHRoZSBsYXRlc3QgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICovXG4gICAgZmV0Y2goKSB7XG4gICAgICAgIHJldHVybiBqUXVlcnlcbiAgICAgICAgICAgIC5nZXQodGhpcy5wcm9wcy51cmwpXG4gICAgICAgICAgICAuZXJyb3IoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBmZXRjaGluZyBkYXRhJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuZmlsZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2FsbGVyeUFjdGlvbnMuY3JlYXRlKGRhdGEuZmlsZXNbaV0sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gZ2V0R2FsbGVyeVN0YXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbGxlcnk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGdhbGxlcnlBY3Rpb25zIGZyb20gJy4uL2FjdGlvbi9nYWxsZXJ5QWN0aW9ucyc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmNsYXNzIEl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2l0ZW0nPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpdGVtX190aHVtYm5haWwnPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naXRlbV9fYWN0aW9ucyc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1yZW1vdmUgWyBmb250LWljb24tY2FuY2VsLWNpcmNsZWQgXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVSZW1vdmUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1lZGl0IFsgZm9udC1pY29uLXBlbmNpbCBdJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUVkaXQuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0naXRlbV9fdGl0bGUnPnt0aGlzLnByb3BzLnRpdGxlfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGhhbmRsZUVkaXRcbiAgICAgKiBAZGVzYyBFdmVudCBoYW5kbGVyIGZvciB0aGUgJ2VkaXQnIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBoYW5kbGVFZGl0KCkge1xuICAgICAgICAvLyBUT0RPOiBXaWxsIHdlIGhhdmUgYW4gZWRpdGluZyBSZWFjdCBjb21wb25lbnQgb3IgcmVuZGVyIGEgZm9ybSBzZXJ2ZXItc2lkZT9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBoYW5kbGVSZW1vdmVcbiAgICAgKiBAZGVzYyBFdmVudCBoYW5kbGVyIGZvciB0aGUgJ3JlbW92ZScgYnV0dG9uLlxuICAgICAqL1xuICAgIGhhbmRsZVJlbW92ZSgpIHtcbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMuZGVzdHJveSh0aGlzLnByb3BzLmlkKTtcbiAgICB9XG5cbn1cblxuSXRlbS5wcm9wVHlwZXMgPSB7XG4gICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgdGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG4iLCJjb25zdCBDT05TVEFOVFMgPSB7XG4gICAgSVRFTV9TVE9SRToge1xuICAgICAgICBDSEFOR0U6ICdjaGFuZ2UnLFxuICAgICAgICBDUkVBVEU6ICdjcmVhdGUnLFxuICAgICAgICBVUERBVEU6ICd1cGRhdGUnLFxuICAgICAgICBERVNST1k6ICdkZXN0cm95J1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IENPTlNUQU5UUztcbiIsImltcG9ydCB7RGlzcGF0Y2hlcn0gZnJvbSAnZmx1eCc7XG5cbmxldCBfZ2FsbGVyeURpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpOyAvLyBTaW5nbGV0b25cblxuZXhwb3J0IGRlZmF1bHQgX2dhbGxlcnlEaXNwYXRjaGVyOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2FsbGVyeSBmcm9tICcuL2NvbXBvbmVudC9nYWxsZXJ5JztcblxualF1ZXJ5KCcuYXNzZXQtZ2FsbGVyeScpLmVudHdpbmUoe1xuXHQnb25hZGQnOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHByb3BzID0ge307XG5cblx0XHRwcm9wcy5uYW1lID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1uYW1lJyk7XG5cdFx0cHJvcHMuZGF0YV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRhdGEtdXJsJyk7XG5cdFx0cHJvcHMudXBkYXRlX3VybCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktdXBkYXRlLXVybCcpO1xuXHRcdHByb3BzLmRlbGV0ZV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRlbGV0ZS11cmwnKTtcblxuXHRcdGlmIChwcm9wcy5uYW1lID09PSBudWxsIHx8IHByb3BzLnVybCA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdFJlYWN0LnJlbmRlcihcblx0XHRcdDxHYWxsZXJ5IHsuLi5wcm9wc30gLz4sXG5cdFx0XHR0aGlzWzBdXG5cdFx0KTtcblx0fVxufSk7XG4iLCJpbXBvcnQgZ2FsbGVyeURpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlcic7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmxldCBfaXRlbXMgPSB7fTtcblxuLyoqXG4gKiBAZnVuYyBjcmVhdGVcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gaXRlbURhdGFcbiAqIEBkZXNjIEFkZHMgYSBnYWxsZXJ5IGl0ZW0gdG8gdGhlIHN0b3JlLlxuICovXG5mdW5jdGlvbiBjcmVhdGUoaXRlbURhdGEpIHtcbiAgICBfaXRlbXNbaXRlbURhdGEuaWRdID0gaXRlbURhdGE7XG59XG5cbi8qKlxuICogQGZ1bmMgZGVzdHJveVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICogQGRlc2MgUmVtb3ZlcyBhIGdhbGxlcnkgaXRlbSBmcm9tIHRoZSBzdG9yZS5cbiAqL1xuZnVuY3Rpb24gZGVzdHJveShpZCkge1xuICAgIGRlbGV0ZSBfaXRlbXNbaWRdO1xufVxuXG5cbi8qKlxuICogQGZ1bmMgZGVzdHJveVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW1EYXRhXG4gKiBAZGVzYyBVcGRhdGVzIGFuIGl0ZW0gaW4gdGhlIHN0b3JlLlxuICovXG5mdW5jdGlvbiB1cGRhdGUoaWQsIGl0ZW1EYXRhKSB7XG4gICAgLy8gVE9ETzpcbn1cblxuY2xhc3MgSXRlbVN0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKiBAZGVzYyBHZXRzIHRoZSBlbnRpcmUgY29sbGVjdGlvbiBvZiBpdGVtcy5cbiAgICAgKi9cbiAgICBnZXRBbGwoKSB7XG4gICAgICAgIHJldHVybiBfaXRlbXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgZ2V0QnlJZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBnZXRCeUlkKGlkKSB7XG4gICAgICAgIHJldHVybiBfaXRlbXNbaWRdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGVtaXRDaGFuZ2VcbiAgICAgKiBAZGVzYyBUcmlnZ2VyZWQgd2hlbiBzb21ldGhpbmcgY2hhbmdlcyBpbiB0aGUgc3RvcmUuXG4gICAgICovXG4gICAgZW1pdENoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5lbWl0KENPTlNUQU5UUy5JVEVNX1NUT1JFLkNIQU5HRSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLm9uKENPTlNUQU5UUy5JVEVNX1NUT1JFLkNIQU5HRSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG4gICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihDT05TVEFOVFMuSVRFTV9TVE9SRS5DSEFOR0UsIGNhbGxiYWNrKTtcbiAgICB9XG59XG5cbmxldCBfaXRlbVN0b3JlID0gbmV3IEl0ZW1TdG9yZSgpOyAvLyBTaW5nbGV0b25cblxuZ2FsbGVyeURpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICBzd2l0Y2gocGF5bG9hZC5hY3Rpb24pIHtcbiAgICAgICAgY2FzZSBDT05TVEFOVFMuSVRFTV9TVE9SRS5DUkVBVEU6XG4gICAgICAgICAgICBjcmVhdGUocGF5bG9hZC5kYXRhKTtcbiAgICAgICAgICAgIGlmICghcGF5bG9hZC5zaWxlbnQpIHtcbiAgICAgICAgICAgICAgICBfaXRlbVN0b3JlLmVtaXRDaGFuZ2UocGF5bG9hZC5zaWxlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBDT05TVEFOVFMuSVRFTV9TVE9SRS5ERVNUUk9ZOlxuICAgICAgICAgICAgZGVzdHJveShwYXlsb2FkLmRhdGEuaWQpO1xuICAgICAgICAgICAgaWYgKCFwYXlsb2FkLnNpbGVudCkge1xuICAgICAgICAgICAgICAgIF9pdGVtU3RvcmUuZW1pdENoYW5nZShwYXlsb2FkLnNpbGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLlVQREFURTpcbiAgICAgICAgICAgIHVwZGF0ZShwYXlsb2FkLmRhdGEuaWQsIHBheWxvYWQuZGF0YS51cGRhdGVzKTtcbiAgICAgICAgICAgIGlmICghcGF5bG9hZC5zaWxlbnQpIHtcbiAgICAgICAgICAgICAgICBfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlOyAvLyBObyBlcnJvcnMuIE5lZWRlZCBieSBwcm9taXNlIGluIERpc3BhdGNoZXIuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgX2l0ZW1TdG9yZTsiXX0=

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2FjdGlvbi9nYWxsZXJ5QWN0aW9ucy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9nYWxsZXJ5LmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2l0ZW0uanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb25zdGFudHMuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9kaXNwYXRjaGVyL2dhbGxlcnlEaXNwYXRjaGVyLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvbWFpbi5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL3N0b3JlL2l0ZW1TdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0FBQyxVQUFVLEVBQUUsQ0FBQzthQUMzQjtBQUNELGtCQUFNO0FBQUEsS0FDYjs7QUFFRCxXQUFPLElBQUksQ0FBQztDQUNmLENBQUMsQ0FBQzs7cUJBRVksVUFBVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJpbXBvcnQgZ2FsbGVyeURpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlcic7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmxldCBnYWxsZXJ5QWN0aW9ucyA9IHtcbiAgICAvKipcbiAgICAgKiBAZnVuYyBjcmVhdGVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuICAgICAqIEBkZXNjIENyZWF0ZXMgYSBnYWxsZXJ5IGl0ZW0uXG4gICAgICovXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoZGF0YSwgc2lsZW50KSB7XG4gICAgICAgIGdhbGxlcnlEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgICAgICAgIGFjdGlvbjogQ09OU1RBTlRTLklURU1fU1RPUkUuQ1JFQVRFLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHNpbGVudDogc2lsZW50XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBkZXN0cm95XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAgICogQGRlc2MgZGVzdHJveXMgYSBnYWxsZXJ5IGl0ZW0uXG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24gKGlkLCBzaWxlbnQpIHtcbiAgICAgICAgZ2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgICAgICAgYWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5ERVNUUk9ZLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbGVudDogc2lsZW50XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyB1cGRhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAgICogQGRlc2MgVXBkYXRlcyBhIGdhbGxlcnkgaXRlbS5cbiAgICAgKi9cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChpZCwgdXBkYXRlcywgc2lsZW50KSB7XG4gICAgICAgIGdhbGxlcnlEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgICAgICAgIGFjdGlvbjogQ09OU1RBTlRTLklURU1fU1RPUkUuVVBEQVRFLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICB1cGRhdGVzOiB1cGRhdGVzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lsZW50OiBzaWxlbnRcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FsbGVyeUFjdGlvbnM7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEl0ZW0gZnJvbSAnLi9pdGVtJztcbmltcG9ydCBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZ2FsbGVyeUFjdGlvbnMnO1xuaW1wb3J0IGl0ZW1TdG9yZSBmcm9tICcuLi9zdG9yZS9pdGVtU3RvcmUnO1xuXG4vKipcbiAqIEBmdW5jIGdldEdhbGxlcnlTdGF0ZVxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqIEBkZXNjIEZhY3RvcnkgZm9yIHRoZSBnYWxsZXJ5J3Mgc3RhdGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBnZXRHYWxsZXJ5U3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXRlbXM6IGl0ZW1TdG9yZS5nZXRBbGwoKVxuICAgIH07XG59XG5cbmNsYXNzIEdhbGxlcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHZhciBpdGVtcyA9IHdpbmRvdy5TU19BU1NFVF9HQUxMRVJZW3RoaXMucHJvcHMubmFtZV07XG5cbiAgICAgICAgLy8gUG9wdWxhdGUgdGhlIHN0b3JlLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBnYWxsZXJ5QWN0aW9ucy5jcmVhdGUoaXRlbXNbaV0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSBnYWxsZXJ5LlxuICAgICAgICB0aGlzLnN0YXRlID0gZ2V0R2FsbGVyeVN0YXRlKCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgICAgICAvLyBJbnRlcmZhY2Ugd2l0aCB0aGUgZm9ybSBzbyB3ZSBjYW4gdXBkYXRlIHN0YXRlIGJhc2VkIG9uIGNoYW5nZXMgaW4gdGhlIG91dHNpZGUgd29ybGQuXG4gICAgICAgIHZhciAkZm9ybSA9IGpRdWVyeShSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkuY2xvc2VzdCgnZm9ybScpO1xuXG4gICAgICAgIGlmICgkZm9ybS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRmb3JtLm9uKCdkaXJ0eScsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEV4cGxpY2l0bHkgYmluZCB0aGUgY3VycmVudCBjb250ZXh0IHRvIHRoZSBjYWxsYmFjay5cbiAgICAgICAgLy8gTm9kZSBldmVudCBlbWl0dGVycyAodGhlIGl0ZW0gc3RvcmUpIGJpbmQgdGhlaXIgY29udGV4dCB3aGVuIHRoZSBjYWxsYmFjayBpdCdzIGludm9rZWQuXG4gICAgICAgIGl0ZW1TdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVubW91bnQgKCkge1xuICAgICAgICAvLyBFeHBsaWNpdGx5IGJpbmQgdGhlIGN1cnJlbnQgY29udGV4dCB0byB0aGUgY2FsbGJhY2suXG4gICAgICAgIC8vIE5vZGUgZXZlbnQgZW1pdHRlcnMgKHRoZSBpdGVtIHN0b3JlKSBiaW5kIHRoZWlyIGNvbnRleHQgd2hlbiB0aGUgY2FsbGJhY2sgaXQncyBpbnZva2VkLlxuICAgICAgICBpdGVtU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMuZ2V0SXRlbUNvbXBvbmVudHMoKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5X19pdGVtcyc+XG4gICAgICAgICAgICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIG9uQ2hhbmdlXG4gICAgICogQGRlc2MgVXBkYXRlcyB0aGUgZ2FsbGVyeSBzdGF0ZSB3aGVuIHNvbWV0aG5pZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBvbkNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShnZXRHYWxsZXJ5U3RhdGUoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgZ2V0SXRlbUNvbXBvbmVudHNcbiAgICAgKiBAZGVzYyBHZW5lcmF0ZXMgdGhlIGl0ZW0gY29tcG9uZW50cyB3aGljaCBwb3B1bGF0ZSB0aGUgZ2FsbGVyeS5cbiAgICAgKi9cbiAgICBnZXRJdGVtQ29tcG9uZW50cygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLml0ZW1zKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxmLnN0YXRlLml0ZW1zW2tleV0sXG4gICAgICAgICAgICAgICAgcHJvcHMgPSB7fTtcblxuICAgICAgICAgICAgcHJvcHMuaWQgPSBpdGVtLmlkO1xuICAgICAgICAgICAgcHJvcHMudGl0bGUgPSBpdGVtLnRpdGxlO1xuICAgICAgICAgICAgcHJvcHMudXJsID0gaXRlbS51cmw7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEl0ZW0ga2V5PXtrZXl9IHsuLi5wcm9wc30gLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGZldGNoXG4gICAgICogQGRlc2MgR2V0cyB0aGUgbGF0ZXN0IGRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgICAqL1xuICAgIGZldGNoKCkge1xuICAgICAgICByZXR1cm4galF1ZXJ5XG4gICAgICAgICAgICAuZ2V0KHRoaXMucHJvcHMudXJsKVxuICAgICAgICAgICAgLmVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZmV0Y2hpbmcgZGF0YScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmZpbGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShkYXRhLmZpbGVzW2ldLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IGdldEdhbGxlcnlTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBHYWxsZXJ5O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZ2FsbGVyeUFjdGlvbnMnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5jbGFzcyBJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpdGVtJz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naXRlbV9fdGh1bWJuYWlsJz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnMnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tcmVtb3ZlIFsgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkIF0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVtb3ZlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tZWRpdCBbIGZvbnQtaWNvbi1wZW5jaWwgXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVFZGl0LmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9J2l0ZW1fX3RpdGxlJz57dGhpcy5wcm9wcy50aXRsZX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBoYW5kbGVFZGl0XG4gICAgICogQGRlc2MgRXZlbnQgaGFuZGxlciBmb3IgdGhlICdlZGl0JyBidXR0b24uXG4gICAgICovXG4gICAgaGFuZGxlRWRpdCgpIHtcbiAgICAgICAgLy8gVE9ETzogV2lsbCB3ZSBoYXZlIGFuIGVkaXRpbmcgUmVhY3QgY29tcG9uZW50IG9yIHJlbmRlciBhIGZvcm0gc2VydmVyLXNpZGU/XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlUmVtb3ZlXG4gICAgICogQGRlc2MgRXZlbnQgaGFuZGxlciBmb3IgdGhlICdyZW1vdmUnIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBoYW5kbGVSZW1vdmUoKSB7XG4gICAgICAgIGdhbGxlcnlBY3Rpb25zLmRlc3Ryb3kodGhpcy5wcm9wcy5pZCk7XG4gICAgfVxuXG59XG5cbkl0ZW0ucHJvcFR5cGVzID0ge1xuICAgIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHRpdGxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBJdGVtO1xuIiwiY29uc3QgQ09OU1RBTlRTID0ge1xuICAgIElURU1fU1RPUkU6IHtcbiAgICAgICAgQ0hBTkdFOiAnY2hhbmdlJyxcbiAgICAgICAgQ1JFQVRFOiAnY3JlYXRlJyxcbiAgICAgICAgVVBEQVRFOiAndXBkYXRlJyxcbiAgICAgICAgREVTUk9ZOiAnZGVzdHJveSdcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDT05TVEFOVFM7XG4iLCJpbXBvcnQge0Rpc3BhdGNoZXJ9IGZyb20gJ2ZsdXgnO1xuXG5sZXQgX2dhbGxlcnlEaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTsgLy8gU2luZ2xldG9uXG5cbmV4cG9ydCBkZWZhdWx0IF9nYWxsZXJ5RGlzcGF0Y2hlcjsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEdhbGxlcnkgZnJvbSAnLi9jb21wb25lbnQvZ2FsbGVyeSc7XG5cbmpRdWVyeSgnLmFzc2V0LWdhbGxlcnknKS5lbnR3aW5lKHtcblx0J29uYWRkJzogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBwcm9wcyA9IHt9O1xuXG5cdFx0cHJvcHMubmFtZSA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktbmFtZScpO1xuXHRcdHByb3BzLmRhdGFfdXJsID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1kYXRhLXVybCcpO1xuXHRcdHByb3BzLnVwZGF0ZV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LXVwZGF0ZS11cmwnKTtcblx0XHRwcm9wcy5kZWxldGVfdXJsID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1kZWxldGUtdXJsJyk7XG5cblx0XHRpZiAocHJvcHMubmFtZSA9PT0gbnVsbCB8fCBwcm9wcy51cmwgPT09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRSZWFjdC5yZW5kZXIoXG5cdFx0XHQ8R2FsbGVyeSB7Li4ucHJvcHN9IC8+LFxuXHRcdFx0dGhpc1swXVxuXHRcdCk7XG5cdH1cbn0pO1xuIiwiaW1wb3J0IGdhbGxlcnlEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvZ2FsbGVyeURpc3BhdGNoZXInO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5sZXQgX2l0ZW1zID0ge307XG5cbi8qKlxuICogQGZ1bmMgY3JlYXRlXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW1EYXRhXG4gKiBAZGVzYyBBZGRzIGEgZ2FsbGVyeSBpdGVtIHRvIHRoZSBzdG9yZS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlKGl0ZW1EYXRhKSB7XG4gICAgX2l0ZW1zW2l0ZW1EYXRhLmlkXSA9IGl0ZW1EYXRhO1xufVxuXG4vKipcbiAqIEBmdW5jIGRlc3Ryb3lcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAqIEBkZXNjIFJlbW92ZXMgYSBnYWxsZXJ5IGl0ZW0gZnJvbSB0aGUgc3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICBkZWxldGUgX2l0ZW1zW2lkXTtcbn1cblxuXG4vKipcbiAqIEBmdW5jIGRlc3Ryb3lcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtRGF0YVxuICogQGRlc2MgVXBkYXRlcyBhbiBpdGVtIGluIHRoZSBzdG9yZS5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlKGlkLCBpdGVtRGF0YSkge1xuICAgIC8vIFRPRE86XG59XG5cbmNsYXNzIEl0ZW1TdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICogQGRlc2MgR2V0cyB0aGUgZW50aXJlIGNvbGxlY3Rpb24gb2YgaXRlbXMuXG4gICAgICovXG4gICAgZ2V0QWxsKCkge1xuICAgICAgICByZXR1cm4gX2l0ZW1zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGdldEJ5SWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgZ2V0QnlJZChpZCkge1xuICAgICAgICByZXR1cm4gX2l0ZW1zW2lkXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBlbWl0Q2hhbmdlXG4gICAgICogQGRlc2MgVHJpZ2dlcmVkIHdoZW4gc29tZXRoaW5nIGNoYW5nZXMgaW4gdGhlIHN0b3JlLlxuICAgICAqL1xuICAgIGVtaXRDaGFuZ2UoKSB7XG4gICAgICAgIHRoaXMuZW1pdChDT05TVEFOVFMuSVRFTV9TVE9SRS5DSEFOR0UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG4gICAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5vbihDT05TVEFOVFMuSVRFTV9TVE9SRS5DSEFOR0UsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqL1xuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoQ09OU1RBTlRTLklURU1fU1RPUkUuQ0hBTkdFLCBjYWxsYmFjayk7XG4gICAgfVxufVxuXG5sZXQgX2l0ZW1TdG9yZSA9IG5ldyBJdGVtU3RvcmUoKTsgLy8gU2luZ2xldG9uXG5cbmdhbGxlcnlEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgc3dpdGNoKHBheWxvYWQuYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuQ1JFQVRFOlxuICAgICAgICAgICAgY3JlYXRlKHBheWxvYWQuZGF0YSk7XG4gICAgICAgICAgICBpZiAoIXBheWxvYWQuc2lsZW50KSB7XG4gICAgICAgICAgICAgICAgX2l0ZW1TdG9yZS5lbWl0Q2hhbmdlKHBheWxvYWQuc2lsZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuREVTVFJPWTpcbiAgICAgICAgICAgIGRlc3Ryb3kocGF5bG9hZC5kYXRhLmlkKTtcbiAgICAgICAgICAgIGlmICghcGF5bG9hZC5zaWxlbnQpIHtcbiAgICAgICAgICAgICAgICBfaXRlbVN0b3JlLmVtaXRDaGFuZ2UocGF5bG9hZC5zaWxlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBDT05TVEFOVFMuSVRFTV9TVE9SRS5VUERBVEU6XG4gICAgICAgICAgICB1cGRhdGUocGF5bG9hZC5kYXRhLmlkLCBwYXlsb2FkLmRhdGEudXBkYXRlcyk7XG4gICAgICAgICAgICBpZiAoIXBheWxvYWQuc2lsZW50KSB7XG4gICAgICAgICAgICAgICAgX2l0ZW1TdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTsgLy8gTm8gZXJyb3JzLiBOZWVkZWQgYnkgcHJvbWlzZSBpbiBEaXNwYXRjaGVyLlxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF9pdGVtU3RvcmU7Il19

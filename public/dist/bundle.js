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
  * @param {string} delete_url
  * @param {bool} silent
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
  * Updates a gallery item.
  *
  * @param {object} props
  */
	update: function update(props, silent) {
		_dispatcherGalleryDispatcher2['default'].dispatch({
			action: _constants2['default'].ITEM_STORE.UPDATE,
			data: props,
			silent: silent
		});
	}
};

exports['default'] = galleryActions;
module.exports = exports['default'];

},{"../constants":6,"../dispatcher/galleryDispatcher":7}],3:[function(require,module,exports){
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

/**
 * @func Editor
 * @desc Used to edit the properties of an Item.
 */

var Editor = (function (_React$Component) {
    _inherits(Editor, _React$Component);

    function Editor() {
        _classCallCheck(this, Editor);

        _get(Object.getPrototypeOf(Editor.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Editor, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { className: 'editor' },
                _react2['default'].createElement(
                    'button',
                    {
                        type: 'button',
                        onClick: this.handleBack.bind(this) },
                    'Back to gallery'
                ),
                _react2['default'].createElement(
                    'form',
                    null,
                    _react2['default'].createElement(
                        'div',
                        { className: 'CompositeField composite cms-file-info nolabel' },
                        _react2['default'].createElement(
                            'div',
                            { className: 'CompositeField composite cms-file-info-preview nolabel' },
                            _react2['default'].createElement('img', { className: 'thumbnail-preview', src: this.props.item.url })
                        ),
                        _react2['default'].createElement(
                            'div',
                            { className: 'CompositeField composite cms-file-info-data nolabel' },
                            _react2['default'].createElement(
                                'div',
                                { className: 'CompositeField composite nolabel' },
                                _react2['default'].createElement(
                                    'div',
                                    { className: 'field readonly' },
                                    _react2['default'].createElement(
                                        'label',
                                        { className: 'left' },
                                        'File type:'
                                    ),
                                    _react2['default'].createElement(
                                        'div',
                                        { className: 'middleColumn' },
                                        _react2['default'].createElement(
                                            'span',
                                            { className: 'readonly' },
                                            this.props.item.type
                                        )
                                    )
                                )
                            ),
                            _react2['default'].createElement(
                                'div',
                                { className: 'field readonly' },
                                _react2['default'].createElement(
                                    'label',
                                    { className: 'left' },
                                    'File size:'
                                ),
                                _react2['default'].createElement(
                                    'div',
                                    { className: 'middleColumn' },
                                    _react2['default'].createElement(
                                        'span',
                                        { className: 'readonly' },
                                        this.props.item.size
                                    )
                                )
                            ),
                            _react2['default'].createElement(
                                'div',
                                { className: 'field readonly' },
                                _react2['default'].createElement(
                                    'label',
                                    { className: 'left' },
                                    'URL:'
                                ),
                                _react2['default'].createElement(
                                    'div',
                                    { className: 'middleColumn' },
                                    _react2['default'].createElement(
                                        'span',
                                        { className: 'readonly' },
                                        _react2['default'].createElement(
                                            'a',
                                            { href: this.props.item.url, target: '_blank' },
                                            this.props.item.url
                                        )
                                    )
                                )
                            ),
                            _react2['default'].createElement(
                                'div',
                                { className: 'field date_disabled readonly' },
                                _react2['default'].createElement(
                                    'label',
                                    { className: 'left' },
                                    'First uploaded:'
                                ),
                                _react2['default'].createElement(
                                    'div',
                                    { className: 'middleColumn' },
                                    _react2['default'].createElement(
                                        'span',
                                        { className: 'readonly' },
                                        this.props.item.created
                                    )
                                )
                            ),
                            _react2['default'].createElement(
                                'div',
                                { className: 'field date_disabled readonly' },
                                _react2['default'].createElement(
                                    'label',
                                    { className: 'left' },
                                    'Last changed:'
                                ),
                                _react2['default'].createElement(
                                    'div',
                                    { className: 'middleColumn' },
                                    _react2['default'].createElement(
                                        'span',
                                        { className: 'readonly' },
                                        this.props.item.lastUpdated
                                    )
                                )
                            ),
                            _react2['default'].createElement(
                                'div',
                                { className: 'field readonly' },
                                _react2['default'].createElement(
                                    'label',
                                    { className: 'left' },
                                    'Dimensions:'
                                ),
                                _react2['default'].createElement(
                                    'div',
                                    { className: 'middleColumn' },
                                    _react2['default'].createElement(
                                        'span',
                                        { className: 'readonly' },
                                        this.props.item.attributes.dimensions.width,
                                        ' x ',
                                        this.props.item.attributes.dimensions.height,
                                        'px'
                                    )
                                )
                            )
                        )
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'field text' },
                        _react2['default'].createElement(
                            'label',
                            { className: 'left' },
                            'Title'
                        ),
                        _react2['default'].createElement(
                            'div',
                            { className: 'middleColumn' },
                            _react2['default'].createElement('input', { className: 'text', type: 'text', name: 'Title', value: this.props.item.title })
                        )
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'field text' },
                        _react2['default'].createElement(
                            'label',
                            { className: 'left' },
                            'Filename'
                        ),
                        _react2['default'].createElement(
                            'div',
                            { className: 'middleColumn' },
                            _react2['default'].createElement('input', { className: 'text', type: 'text', name: 'Name', value: this.props.item.filename })
                        )
                    )
                )
            );
        }

        /**
         * @func handleBack
         * @desc Handles clicks on the back button. Switches back to the 'gallery' view.
         */
    }, {
        key: 'handleBack',
        value: function handleBack() {
            this.props.setEditing(false);
        }
    }]);

    return Editor;
})(_react2['default'].Component);

Editor.propTypes = {
    item: _react2['default'].PropTypes.object,
    setEditing: _react2['default'].PropTypes.func
};

exports['default'] = Editor;
module.exports = exports['default'];

},{"react":"react"}],4:[function(require,module,exports){
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

var _editor = require('./editor');

var _editor2 = _interopRequireDefault(_editor);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var _actionGalleryActions = require('../action/galleryActions');

var _actionGalleryActions2 = _interopRequireDefault(_actionGalleryActions);

var _storeItemStore = require('../store/itemStore');

var _storeItemStore2 = _interopRequireDefault(_storeItemStore);

/**
 * @func getItemStoreState
 * @private
 * @return {object}
 * @desc Factory for getting the current state of the ItemStore.
 */
function getItemStoreState() {
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

        _storeItemStore2['default'].data_url = props.data_url;
        _storeItemStore2['default'].update_url = props.update_url;
        _storeItemStore2['default'].delete_url = props.delete_url;

        // Populate the store.
        for (var i = 0; i < items.length; i += 1) {
            _actionGalleryActions2['default'].create(items[i], true);
        }

        // Set the initial state of the gallery.
        this.state = getItemStoreState();
        this.state.editing = false;
        this.state.currentItem = null;
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
            // Node event emitters (the item store) bind their context when the callback is invoked.
            _storeItemStore2['default'].addChangeListener(this.onChange.bind(this));
        }
    }, {
        key: 'componentDidUnmount',
        value: function componentDidUnmount() {
            // Explicitly bind the current context to the callback.
            // Node event emitters (the item store) bind their context when the callback is invoked.
            _storeItemStore2['default'].removeChangeListener(this.onChange.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.editing) {
                var editorComponent = this.getEditorComponent();

                return _react2['default'].createElement(
                    'div',
                    { className: 'gallery' },
                    editorComponent
                );
            } else {
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
        }

        /**
         * @func onChange
         * @desc Updates the gallery state when somethnig changes in the store.
         */
    }, {
        key: 'onChange',
        value: function onChange() {
            this.setState(getItemStoreState());
        }

        /**
         * @func setEditing
         * @param {boolean} isEditing
         * @param {string} [id]
         * @desc Switches between editing and gallery states.
         */
    }, {
        key: 'setEditing',
        value: function setEditing(isEditing, id) {
            var newState = { editing: isEditing };

            if (id !== void 0) {
                var currentItem = _storeItemStore2['default'].getById(id);

                if (currentItem !== void 0) {
                    this.setState(jQuery.extend(newState, { currentItem: currentItem }));
                }
            } else {
                this.setState(newState);
            }
        }

        /**
         * @func getEditorComponent
         * @desc Generates the editor component.
         */
    }, {
        key: 'getEditorComponent',
        value: function getEditorComponent() {
            var props = {};

            props.item = this.state.currentItem;
            props.setEditing = this.setEditing.bind(this);

            return _react2['default'].createElement(_editor2['default'], props);
        }

        /**
         * @func getItemComponents
         * @desc Generates the item components which populate the gallery.
         */
    }, {
        key: 'getItemComponents',
        value: function getItemComponents() {
            var _this2 = this;

            var self = this;

            return Object.keys(this.state.items).map(function (key) {
                var item = self.state.items[key],
                    props = {};

                props.id = item.id;
                props.setEditing = _this2.setEditing.bind(_this2);
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
            var _this3 = this;

            return jQuery.get(this.props.data_url).error(function () {
                console.log('error fetching data');
            }).done(function (data) {
                for (var i = 0; i < data.files.length; i += 1) {
                    _actionGalleryActions2['default'].create(data.files[i], true);
                    _this3.state = getItemStoreState();
                }
            });
        }
    }]);

    return Gallery;
})(_react2['default'].Component);

exports['default'] = Gallery;
module.exports = exports['default'];

},{"../action/galleryActions":2,"../store/itemStore":9,"./editor":3,"./item":5,"react":"react"}],5:[function(require,module,exports){
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
            var styles = { backgroundImage: 'url(' + this.props.url + ')' };

            return _react2['default'].createElement(
                'div',
                { className: 'item' },
                _react2['default'].createElement(
                    'div',
                    { className: 'item__thumbnail', style: styles },
                    _react2['default'].createElement(
                        'div',
                        { className: 'item__actions' },
                        _react2['default'].createElement('button', {
                            className: 'item__actions__action item__actions__action--remove [ font-icon-cancel-circled ]',
                            type: 'button',
                            onClick: this.handleDelete.bind(this) }),
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
        value: function handleEdit() {
            this.props.setEditing(true, this.props.id);
        }

        /**
         * @func handleDelete
         * @desc Event handler for the 'remove' button.
         */
    }, {
        key: 'handleDelete',
        value: function handleDelete() {
            _actionGalleryActions2['default'].destroy(this.props.id);
        }
    }]);

    return Item;
})(_react2['default'].Component);

Item.propTypes = {
    id: _react2['default'].PropTypes.string,
    setEditing: _react2['default'].PropTypes.func,
    title: _react2['default'].PropTypes.string
};

exports['default'] = Item;
module.exports = exports['default'];

},{"../action/galleryActions":2,"../constants":6,"react":"react"}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _flux = require('flux');

var _galleryDispatcher = new _flux.Dispatcher(); // Singleton

exports['default'] = _galleryDispatcher;
module.exports = exports['default'];

},{"flux":"flux"}],8:[function(require,module,exports){
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

},{"./component/gallery":4,"react":"react"}],9:[function(require,module,exports){
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
 * @param {int} id
 * @param {function} callback
 * @desc Removes a gallery item from the store.
 */
function destroy(id, callback) {
	jQuery.ajax({ // @todo fix this junk
		'url': _itemStore.delete_url,
		'data': {
			'id': id
		},
		'dataType': 'json',
		'method': 'GET',
		'success': function success(data) {
			delete _items[id];
			callback && callback();
		}
	});
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
			destroy(payload.data.id, function () {
				if (!payload.silent) {
					_itemStore.emitChange(payload.silent);
				}
			});

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

},{"../constants":6,"../dispatcher/galleryDispatcher":7,"events":1}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvYWN0aW9uL2dhbGxlcnlBY3Rpb25zLmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZWRpdG9yLmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZ2FsbGVyeS5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2l0ZW0uanMiLCIvVXNlcnMvQ2hyaXN0b3BoZXIvU291cmNlL2Fzc2VydGNocmlzL3NpbHZlcnN0cmlwZS13b3JrYmVuY2gvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvc3RvcmUvaXRlbVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OzsyQ0M3UzhCLGlDQUFpQzs7Ozt5QkFDekMsY0FBYzs7OztBQUVwQyxJQUFJLGNBQWMsR0FBRzs7Ozs7O0FBTXBCLE9BQU0sRUFBRSxnQkFBVSxJQUFJLEVBQUUsTUFBTSxFQUFF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anMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJpbXBvcnQgZ2FsbGVyeURpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlcic7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBnYWxsZXJ5QWN0aW9ucyA9IHtcblx0LyoqXG5cdCAqIEBmdW5jIGNyZWF0ZVxuXHQgKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuXHQgKiBAZGVzYyBDcmVhdGVzIGEgZ2FsbGVyeSBpdGVtLlxuXHQgKi9cblx0Y3JlYXRlOiBmdW5jdGlvbiAoZGF0YSwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5DUkVBVEUsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogQGZ1bmMgZGVzdHJveVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGRlbGV0ZV91cmxcblx0ICogQHBhcmFtIHtib29sfSBzaWxlbnRcblx0ICogQGRlc2MgZGVzdHJveXMgYSBnYWxsZXJ5IGl0ZW0uXG5cdCAqL1xuXHRkZXN0cm95OiBmdW5jdGlvbiAoaWQsIHNpbGVudCkge1xuXHRcdGdhbGxlcnlEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLklURU1fU1RPUkUuREVTVFJPWSxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0aWQ6IGlkXG5cdFx0XHR9LFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlcyBhIGdhbGxlcnkgaXRlbS5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IHByb3BzXG5cdCAqL1xuXHR1cGRhdGU6IGZ1bmN0aW9uIChwcm9wcywgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5VUERBVEUsXG5cdFx0XHRkYXRhOiBwcm9wcyxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbGxlcnlBY3Rpb25zO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBAZnVuYyBFZGl0b3JcbiAqIEBkZXNjIFVzZWQgdG8gZWRpdCB0aGUgcHJvcGVydGllcyBvZiBhbiBJdGVtLlxuICovXG5jbGFzcyBFZGl0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2VkaXRvcic+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQmFjay5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgQmFjayB0byBnYWxsZXJ5XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8gbm9sYWJlbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tcHJldmlldyBub2xhYmVsJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0ndGh1bWJuYWlsLXByZXZpZXcnIHNyYz17dGhpcy5wcm9wcy5pdGVtLnVybH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvLWRhdGEgbm9sYWJlbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBub2xhYmVsJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpbGUgdHlwZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS50eXBlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaWxlIHNpemU6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLnNpemV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5VUkw6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXt0aGlzLnByb3BzLml0ZW0udXJsfSB0YXJnZXQ9J19ibGFuayc+e3RoaXMucHJvcHMuaXRlbS51cmx9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgZGF0ZV9kaXNhYmxlZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpcnN0IHVwbG9hZGVkOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS5jcmVhdGVkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5MYXN0IGNoYW5nZWQ6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLmxhc3RVcGRhdGVkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RGltZW5zaW9uczo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0uYXR0cmlidXRlcy5kaW1lbnNpb25zLndpZHRofSB4IHt0aGlzLnByb3BzLml0ZW0uYXR0cmlidXRlcy5kaW1lbnNpb25zLmhlaWdodH1weDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHRleHQnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+VGl0bGU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT0ndGV4dCcgdHlwZT0ndGV4dCcgbmFtZT0nVGl0bGUnIHZhbHVlPXt0aGlzLnByb3BzLml0ZW0udGl0bGV9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCB0ZXh0Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpbGVuYW1lPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9J3RleHQnIHR5cGU9J3RleHQnIG5hbWU9J05hbWUnIHZhbHVlPXt0aGlzLnByb3BzLml0ZW0uZmlsZW5hbWV9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlQmFja1xuICAgICAqIEBkZXNjIEhhbmRsZXMgY2xpY2tzIG9uIHRoZSBiYWNrIGJ1dHRvbi4gU3dpdGNoZXMgYmFjayB0byB0aGUgJ2dhbGxlcnknIHZpZXcuXG4gICAgICovXG4gICAgaGFuZGxlQmFjaygpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRFZGl0aW5nKGZhbHNlKTtcbiAgICB9XG5cbn1cblxuRWRpdG9yLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIHNldEVkaXRpbmc6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBFZGl0b3I7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEVkaXRvciBmcm9tICcuL2VkaXRvcic7XG5pbXBvcnQgSXRlbSBmcm9tICcuL2l0ZW0nO1xuaW1wb3J0IGdhbGxlcnlBY3Rpb25zIGZyb20gJy4uL2FjdGlvbi9nYWxsZXJ5QWN0aW9ucyc7XG5pbXBvcnQgaXRlbVN0b3JlIGZyb20gJy4uL3N0b3JlL2l0ZW1TdG9yZSc7XG5cbi8qKlxuICogQGZ1bmMgZ2V0SXRlbVN0b3JlU3RhdGVcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKiBAZGVzYyBGYWN0b3J5IGZvciBnZXR0aW5nIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBJdGVtU3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGdldEl0ZW1TdG9yZVN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGl0ZW1zOiBpdGVtU3RvcmUuZ2V0QWxsKClcbiAgICB9O1xufVxuXG5jbGFzcyBHYWxsZXJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICB2YXIgaXRlbXMgPSB3aW5kb3cuU1NfQVNTRVRfR0FMTEVSWVt0aGlzLnByb3BzLm5hbWVdO1xuXG4gICAgICAgIGl0ZW1TdG9yZS5kYXRhX3VybCA9IHByb3BzLmRhdGFfdXJsO1xuICAgICAgICBpdGVtU3RvcmUudXBkYXRlX3VybCA9IHByb3BzLnVwZGF0ZV91cmw7XG4gICAgICAgIGl0ZW1TdG9yZS5kZWxldGVfdXJsID0gcHJvcHMuZGVsZXRlX3VybDtcblxuICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgc3RvcmUuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtc1tpXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGdhbGxlcnkuXG4gICAgICAgIHRoaXMuc3RhdGUgPSBnZXRJdGVtU3RvcmVTdGF0ZSgpO1xuICAgICAgICB0aGlzLnN0YXRlLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50SXRlbSA9IG51bGw7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgICAgICAvLyBJbnRlcmZhY2Ugd2l0aCB0aGUgZm9ybSBzbyB3ZSBjYW4gdXBkYXRlIHN0YXRlIGJhc2VkIG9uIGNoYW5nZXMgaW4gdGhlIG91dHNpZGUgd29ybGQuXG4gICAgICAgIHZhciAkZm9ybSA9IGpRdWVyeShSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkuY2xvc2VzdCgnZm9ybScpO1xuXG4gICAgICAgIGlmICgkZm9ybS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRmb3JtLm9uKCdkaXJ0eScsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEV4cGxpY2l0bHkgYmluZCB0aGUgY3VycmVudCBjb250ZXh0IHRvIHRoZSBjYWxsYmFjay5cbiAgICAgICAgLy8gTm9kZSBldmVudCBlbWl0dGVycyAodGhlIGl0ZW0gc3RvcmUpIGJpbmQgdGhlaXIgY29udGV4dCB3aGVuIHRoZSBjYWxsYmFjayBpcyBpbnZva2VkLlxuICAgICAgICBpdGVtU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVbm1vdW50ICgpIHtcbiAgICAgICAgLy8gRXhwbGljaXRseSBiaW5kIHRoZSBjdXJyZW50IGNvbnRleHQgdG8gdGhlIGNhbGxiYWNrLlxuICAgICAgICAvLyBOb2RlIGV2ZW50IGVtaXR0ZXJzICh0aGUgaXRlbSBzdG9yZSkgYmluZCB0aGVpciBjb250ZXh0IHdoZW4gdGhlIGNhbGxiYWNrIGlzIGludm9rZWQuXG4gICAgICAgIGl0ZW1TdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZykge1xuICAgICAgICAgICAgbGV0IGVkaXRvckNvbXBvbmVudCA9IHRoaXMuZ2V0RWRpdG9yQ29tcG9uZW50KCk7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuICAgICAgICAgICAgICAgICAgICB7ZWRpdG9yQ29tcG9uZW50fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpdGVtcyA9IHRoaXMuZ2V0SXRlbUNvbXBvbmVudHMoKTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5X19pdGVtcyc+XG4gICAgICAgICAgICAgICAgICAgICAgICB7aXRlbXN9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIG9uQ2hhbmdlXG4gICAgICogQGRlc2MgVXBkYXRlcyB0aGUgZ2FsbGVyeSBzdGF0ZSB3aGVuIHNvbWV0aG5pZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBvbkNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShnZXRJdGVtU3RvcmVTdGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBzZXRFZGl0aW5nXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpc0VkaXRpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2lkXVxuICAgICAqIEBkZXNjIFN3aXRjaGVzIGJldHdlZW4gZWRpdGluZyBhbmQgZ2FsbGVyeSBzdGF0ZXMuXG4gICAgICovXG4gICAgc2V0RWRpdGluZyhpc0VkaXRpbmcsIGlkKSB7XG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IHsgZWRpdGluZzogaXNFZGl0aW5nIH07XG5cbiAgICAgICAgaWYgKGlkICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50SXRlbSA9IGl0ZW1TdG9yZS5nZXRCeUlkKGlkKTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRJdGVtICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKGpRdWVyeS5leHRlbmQobmV3U3RhdGUsIHsgY3VycmVudEl0ZW06IGN1cnJlbnRJdGVtIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgZ2V0RWRpdG9yQ29tcG9uZW50XG4gICAgICogQGRlc2MgR2VuZXJhdGVzIHRoZSBlZGl0b3IgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGdldEVkaXRvckNvbXBvbmVudCgpIHtcbiAgICAgICAgdmFyIHByb3BzID0ge307XG5cbiAgICAgICAgcHJvcHMuaXRlbSA9IHRoaXMuc3RhdGUuY3VycmVudEl0ZW07XG4gICAgICAgIHByb3BzLnNldEVkaXRpbmcgPSB0aGlzLnNldEVkaXRpbmcuYmluZCh0aGlzKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEVkaXRvciB7Li4ucHJvcHN9IC8+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgZ2V0SXRlbUNvbXBvbmVudHNcbiAgICAgKiBAZGVzYyBHZW5lcmF0ZXMgdGhlIGl0ZW0gY29tcG9uZW50cyB3aGljaCBwb3B1bGF0ZSB0aGUgZ2FsbGVyeS5cbiAgICAgKi9cbiAgICBnZXRJdGVtQ29tcG9uZW50cygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLml0ZW1zKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxmLnN0YXRlLml0ZW1zW2tleV0sXG4gICAgICAgICAgICAgICAgcHJvcHMgPSB7fTtcblxuICAgICAgICAgICAgcHJvcHMuaWQgPSBpdGVtLmlkO1xuICAgICAgICAgICAgcHJvcHMuc2V0RWRpdGluZyA9IHRoaXMuc2V0RWRpdGluZy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgcHJvcHMudGl0bGUgPSBpdGVtLnRpdGxlO1xuICAgICAgICAgICAgcHJvcHMudXJsID0gaXRlbS51cmw7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEl0ZW0ga2V5PXtrZXl9IHsuLi5wcm9wc30gLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGZldGNoXG4gICAgICogQGRlc2MgR2V0cyB0aGUgbGF0ZXN0IGRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgICAqL1xuICAgIGZldGNoKCkge1xuICAgICAgICByZXR1cm4galF1ZXJ5XG4gICAgICAgICAgICAuZ2V0KHRoaXMucHJvcHMuZGF0YV91cmwpXG4gICAgICAgICAgICAuZXJyb3IoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBmZXRjaGluZyBkYXRhJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuZmlsZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2FsbGVyeUFjdGlvbnMuY3JlYXRlKGRhdGEuZmlsZXNbaV0sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gZ2V0SXRlbVN0b3JlU3RhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FsbGVyeTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2dhbGxlcnlBY3Rpb25zJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxuY2xhc3MgSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBzdHlsZXMgPSB7YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyB0aGlzLnByb3BzLnVybCArICcpJ307XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpdGVtJz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naXRlbV9fdGh1bWJuYWlsJyBzdHlsZT17c3R5bGVzfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnMnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tcmVtb3ZlIFsgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkIF0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRGVsZXRlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tZWRpdCBbIGZvbnQtaWNvbi1wZW5jaWwgXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVFZGl0LmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9J2l0ZW1fX3RpdGxlJz57dGhpcy5wcm9wcy50aXRsZX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBoYW5kbGVFZGl0XG4gICAgICogQGRlc2MgRXZlbnQgaGFuZGxlciBmb3IgdGhlICdlZGl0JyBidXR0b24uXG4gICAgICovXG4gICAgaGFuZGxlRWRpdCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRFZGl0aW5nKHRydWUsIHRoaXMucHJvcHMuaWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGhhbmRsZURlbGV0ZVxuICAgICAqIEBkZXNjIEV2ZW50IGhhbmRsZXIgZm9yIHRoZSAncmVtb3ZlJyBidXR0b24uXG4gICAgICovXG4gICAgaGFuZGxlRGVsZXRlKCkge1xuICAgICAgICBnYWxsZXJ5QWN0aW9ucy5kZXN0cm95KHRoaXMucHJvcHMuaWQpO1xuICAgIH1cblxufVxuXG5JdGVtLnByb3BUeXBlcyA9IHtcbiAgICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzZXRFZGl0aW5nOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSXRlbTtcbiIsImNvbnN0IENPTlNUQU5UUyA9IHtcbiAgICBJVEVNX1NUT1JFOiB7XG4gICAgICAgIENIQU5HRTogJ2NoYW5nZScsXG4gICAgICAgIENSRUFURTogJ2NyZWF0ZScsXG4gICAgICAgIFVQREFURTogJ3VwZGF0ZScsXG4gICAgICAgIERFU1JPWTogJ2Rlc3Ryb3knXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ09OU1RBTlRTO1xuIiwiaW1wb3J0IHtEaXNwYXRjaGVyfSBmcm9tICdmbHV4JztcblxubGV0IF9nYWxsZXJ5RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7IC8vIFNpbmdsZXRvblxuXG5leHBvcnQgZGVmYXVsdCBfZ2FsbGVyeURpc3BhdGNoZXI7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBHYWxsZXJ5IGZyb20gJy4vY29tcG9uZW50L2dhbGxlcnknO1xuXG5qUXVlcnkoJy5hc3NldC1nYWxsZXJ5JykuZW50d2luZSh7XG5cdCdvbmFkZCc6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgcHJvcHMgPSB7fTtcblxuXHRcdHByb3BzLm5hbWUgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LW5hbWUnKTtcblx0XHRwcm9wcy5kYXRhX3VybCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktZGF0YS11cmwnKTtcblx0XHRwcm9wcy51cGRhdGVfdXJsID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS11cGRhdGUtdXJsJyk7XG5cdFx0cHJvcHMuZGVsZXRlX3VybCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktZGVsZXRlLXVybCcpO1xuXG5cdFx0aWYgKHByb3BzLm5hbWUgPT09IG51bGwgfHwgcHJvcHMudXJsID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0UmVhY3QucmVuZGVyKFxuXHRcdFx0PEdhbGxlcnkgey4uLnByb3BzfSAvPixcblx0XHRcdHRoaXNbMF1cblx0XHQpO1xuXHR9XG59KTtcbiIsImltcG9ydCBnYWxsZXJ5RGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2dhbGxlcnlEaXNwYXRjaGVyJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxubGV0IF9pdGVtcyA9IHt9O1xuXG4vKipcbiAqIEBmdW5jIGNyZWF0ZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtRGF0YVxuICogQGRlc2MgQWRkcyBhIGdhbGxlcnkgaXRlbSB0byB0aGUgc3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShpdGVtRGF0YSkge1xuXHRfaXRlbXNbaXRlbURhdGEuaWRdID0gaXRlbURhdGE7XG59XG5cbi8qKlxuICogQGZ1bmMgZGVzdHJveVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7aW50fSBpZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBkZXNjIFJlbW92ZXMgYSBnYWxsZXJ5IGl0ZW0gZnJvbSB0aGUgc3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3koaWQsIGNhbGxiYWNrKSB7XG5cdGpRdWVyeS5hamF4KHsgLy8gQHRvZG8gZml4IHRoaXMganVua1xuXHRcdCd1cmwnOiBfaXRlbVN0b3JlLmRlbGV0ZV91cmwsXG5cdFx0J2RhdGEnOiB7XG5cdFx0XHQnaWQnOiBpZFxuXHRcdH0sXG5cdFx0J2RhdGFUeXBlJzogJ2pzb24nLFxuXHRcdCdtZXRob2QnOiAnR0VUJyxcblx0XHQnc3VjY2Vzcyc6IChkYXRhKSA9PiB7XG5cdFx0XHRkZWxldGUgX2l0ZW1zW2lkXTtcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0fVxuXHR9KTtcbn1cblxuXG4vKipcbiAqIEBmdW5jIGRlc3Ryb3lcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtRGF0YVxuICogQGRlc2MgVXBkYXRlcyBhbiBpdGVtIGluIHRoZSBzdG9yZS5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlKGlkLCBpdGVtRGF0YSkge1xuXHQvLyBUT0RPOlxufVxuXG5jbGFzcyBJdGVtU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHtvYmplY3R9XG5cdCAqIEBkZXNjIEdldHMgdGhlIGVudGlyZSBjb2xsZWN0aW9uIG9mIGl0ZW1zLlxuXHQgKi9cblx0Z2V0QWxsKCkge1xuXHRcdHJldHVybiBfaXRlbXM7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZ2V0QnlJZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaWRcblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKi9cblx0Z2V0QnlJZChpZCkge1xuXHRcdHJldHVybiBfaXRlbXNbaWRdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIGVtaXRDaGFuZ2Vcblx0ICogQGRlc2MgVHJpZ2dlcmVkIHdoZW4gc29tZXRoaW5nIGNoYW5nZXMgaW4gdGhlIHN0b3JlLlxuXHQgKi9cblx0ZW1pdENoYW5nZSgpIHtcblx0XHR0aGlzLmVtaXQoQ09OU1RBTlRTLklURU1fU1RPUkUuQ0hBTkdFKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKi9cblx0YWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcblx0XHR0aGlzLm9uKENPTlNUQU5UUy5JVEVNX1NUT1JFLkNIQU5HRSwgY2FsbGJhY2spO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqL1xuXHRyZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoQ09OU1RBTlRTLklURU1fU1RPUkUuQ0hBTkdFLCBjYWxsYmFjayk7XG5cdH1cbn1cblxubGV0IF9pdGVtU3RvcmUgPSBuZXcgSXRlbVN0b3JlKCk7IC8vIFNpbmdsZXRvblxuXG5nYWxsZXJ5RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbiAocGF5bG9hZCkge1xuXHRzd2l0Y2gocGF5bG9hZC5hY3Rpb24pIHtcblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLkNSRUFURTpcblx0XHRcdGNyZWF0ZShwYXlsb2FkLmRhdGEpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZShwYXlsb2FkLnNpbGVudCk7XG5cdFx0XHR9XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBDT05TVEFOVFMuSVRFTV9TVE9SRS5ERVNUUk9ZOlxuXHRcdFx0ZGVzdHJveShwYXlsb2FkLmRhdGEuaWQsICgpID0+IHtcblx0XHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZShwYXlsb2FkLnNpbGVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuVVBEQVRFOlxuXHRcdFx0dXBkYXRlKHBheWxvYWQuZGF0YS5pZCwgcGF5bG9hZC5kYXRhLnVwZGF0ZXMpO1xuXHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHRydWU7IC8vIE5vIGVycm9ycy4gTmVlZGVkIGJ5IHByb21pc2UgaW4gRGlzcGF0Y2hlci5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBfaXRlbVN0b3JlO1xuIl19

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
	},

	/**
  * Navigates to a new folder.
  *
  * @param {string} folder
  * @param {bool} silent
  */
	navigate: function navigate(folder, silent) {
		_dispatcherGalleryDispatcher2['default'].dispatch({
			action: _constants2['default'].ITEM_STORE.NAVIGATE,
			data: {
				'folder': folder
			},
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
        _storeItemStore2['default'].initial_folder = props.initial_folder;

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
                var button = null;

                if (_storeItemStore2['default'].hasNavigated()) {
                    button = _react2['default'].createElement(
                        'button',
                        {
                            type: 'button',
                            onClick: this.handleNavigate.bind(this) },
                        'Back'
                    );
                }

                return _react2['default'].createElement(
                    'div',
                    { className: 'gallery' },
                    button,
                    _react2['default'].createElement(
                        'div',
                        { className: 'gallery__items' },
                        items
                    )
                );
            }
        }
    }, {
        key: 'handleNavigate',
        value: function handleNavigate() {
            var navigation = _storeItemStore2['default'].popNavigation();

            _actionGalleryActions2['default'].navigate(navigation[1]);
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
                props.type = item.type;
                props.filename = item.filename;

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

            var navigate = function navigate() {
                console.log('not a folder');
            };

            if (this.props.type === 'folder') {
                navigate = this.handleNavigate.bind(this);
            }

            return _react2['default'].createElement(
                'div',
                { className: 'item', onClick: navigate },
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
         * Event handler for the 'edit' button.
         */
    }, {
        key: 'handleNavigate',
        value: function handleNavigate() {
            _actionGalleryActions2['default'].navigate(this.props.filename);
        }

        /**
         * Event handler for the 'remove' button.
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
		DESTROY: 'destroy',
		NAVIGATE: 'navigate'
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
		props.initial_folder = this[0].getAttribute('data-asset-gallery-initial-folder');

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

var _actionGalleryActions = require('../action/galleryActions');

var _actionGalleryActions2 = _interopRequireDefault(_actionGalleryActions);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _items = [];
var _folders = [];
var _currentFolder = null;

/**
 * @func create
 * @private
 * @param {object} itemData
 * @desc Adds a gallery item to the store.
 */
function create(itemData) {
	_items.push(itemData);
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
			var itemIndex = -1;

			// Get the index of the item we have deleted
			// so it can be removed from the store.
			for (var i = 0; i < _items.length; i += 1) {
				if (_items[i].id === id) {
					itemIndex = i;
					break;
				}
			}

			if (itemIndex === -1) {
				return;
			}

			_items.splice(itemIndex, 1);

			callback && callback();
		}
	});
}

/**
 * Navigates to a new folder.
 *
 * @private
 *
 * @param {string} folder
 * @param {function} callback
 */
function navigate(folder, callback) {
	jQuery.ajax({
		'url': _itemStore.data_url,
		'dataType': 'json',
		'data': {
			'folder': folder
		},
		'success': function success(data) {
			_items = {};

			if (folder !== _itemStore.initial_folder) {
				_folders.push([folder, _currentFolder || _itemStore.initial_folder]);
			}

			_currentFolder = folder;

			data.files.forEach(function (item) {
				_actionGalleryActions2['default'].create(item, true);
			});

			callback && callback();
		}
	});
}

/**
 * @func update
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
		key: 'hasNavigated',

		/**
   * Checks if the gallery has been navigated.
   */
		value: function hasNavigated() {
			return _folders.length > 0;
		}

		/**
   * Gets the folder stack.
   */
	}, {
		key: 'popNavigation',
		value: function popNavigation() {
			return _folders.pop();
		}

		/**
   * @return {object}
   * @desc Gets the entire collection of items.
   */
	}, {
		key: 'getAll',
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
			var item = null;

			for (var i = 0; i < _items.length; i += 1) {
				if (_items[i].id === id) {
					item = _items[i];
					break;
				}
			}

			return item;
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

		case _constants2['default'].ITEM_STORE.NAVIGATE:
			navigate(payload.data.folder, function () {
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

},{"../action/galleryActions":2,"../constants":6,"../dispatcher/galleryDispatcher":7,"events":1}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2FjdGlvbi9nYWxsZXJ5QWN0aW9ucy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9lZGl0b3IuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZ2FsbGVyeS5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9pdGVtLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29uc3RhbnRzLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlci5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL21haW4uanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9zdG9yZS9pdGVtU3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUUsWUFBTTtBQUNuQyxRQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNwQixlQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN0QztJQUNELENBQUMsQ0FBQzs7QUFFSCxTQUFNOztBQUFBLEFBRVAsT0FBSyx1QkFBVSxVQUFVLENBQUMsTUFBTTtBQUMvQixTQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFOUMsT0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDcEIsY0FBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3hCOztBQUVELFNBQU07QUFBQSxFQUNQOztBQUVELFFBQU8sSUFBSSxDQUFDO0NBQ1osQ0FBQyxDQUFDOztxQkFFWSxVQUFVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsImltcG9ydCBnYWxsZXJ5RGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2dhbGxlcnlEaXNwYXRjaGVyJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIGdhbGxlcnlBY3Rpb25zID0ge1xuXHQvKipcblx0ICogQGZ1bmMgY3JlYXRlXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG5cdCAqIEBkZXNjIENyZWF0ZXMgYSBnYWxsZXJ5IGl0ZW0uXG5cdCAqL1xuXHRjcmVhdGU6IGZ1bmN0aW9uIChkYXRhLCBzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLkNSRUFURSxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAZnVuYyBkZXN0cm95XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGVsZXRlX3VybFxuXHQgKiBAcGFyYW0ge2Jvb2x9IHNpbGVudFxuXHQgKiBAZGVzYyBkZXN0cm95cyBhIGdhbGxlcnkgaXRlbS5cblx0ICovXG5cdGRlc3Ryb3k6IGZ1bmN0aW9uIChpZCwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5ERVNUUk9ZLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpZDogaWRcblx0XHRcdH0sXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9LFxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgdXBkYXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgICAqIEBkZXNjIFVwZGF0ZXMgYSBnYWxsZXJ5IGl0ZW0uXG4gICAgICovXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoaWQsIHVwZGF0ZXMsIHNpbGVudCkge1xuICAgICAgICBnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICAgICAgICBhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLlVQREFURSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgdXBkYXRlczogdXBkYXRlc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbGVudDogc2lsZW50XG4gICAgICAgIH0pO1xuICAgIH0sXG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyB0byBhIG5ldyBmb2xkZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmb2xkZXJcblx0ICogQHBhcmFtIHtib29sfSBzaWxlbnRcblx0ICovXG5cdG5hdmlnYXRlOiBmdW5jdGlvbiAoZm9sZGVyLCBzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLk5BVklHQVRFLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHQnZm9sZGVyJzogZm9sZGVyXG5cdFx0XHR9LFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FsbGVyeUFjdGlvbnM7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG4vKipcbiAqIEBmdW5jIEVkaXRvclxuICogQGRlc2MgVXNlZCB0byBlZGl0IHRoZSBwcm9wZXJ0aWVzIG9mIGFuIEl0ZW0uXG4gKi9cbmNsYXNzIEVkaXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZWRpdG9yJz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVCYWNrLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICBCYWNrIHRvIGdhbGxlcnlcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mbyBub2xhYmVsJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1wcmV2aWV3IG5vbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSd0aHVtYm5haWwtcHJldmlldycgc3JjPXt0aGlzLnByb3BzLml0ZW0udXJsfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tZGF0YSBub2xhYmVsJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIG5vbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RmlsZSB0eXBlOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLnR5cGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpbGUgc2l6ZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0uc2l6ZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPlVSTDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e3RoaXMucHJvcHMuaXRlbS51cmx9IHRhcmdldD0nX2JsYW5rJz57dGhpcy5wcm9wcy5pdGVtLnVybH08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+Rmlyc3QgdXBsb2FkZWQ6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLmNyZWF0ZWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgZGF0ZV9kaXNhYmxlZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkxhc3QgY2hhbmdlZDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0ubGFzdFVwZGF0ZWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5EaW1lbnNpb25zOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMud2lkdGh9IHgge3RoaXMucHJvcHMuaXRlbS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMuaGVpZ2h0fXB4PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgdGV4dCc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5UaXRsZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPSd0ZXh0JyB0eXBlPSd0ZXh0JyBuYW1lPSdUaXRsZScgdmFsdWU9e3RoaXMucHJvcHMuaXRlbS50aXRsZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHRleHQnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RmlsZW5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT0ndGV4dCcgdHlwZT0ndGV4dCcgbmFtZT0nTmFtZScgdmFsdWU9e3RoaXMucHJvcHMuaXRlbS5maWxlbmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBoYW5kbGVCYWNrXG4gICAgICogQGRlc2MgSGFuZGxlcyBjbGlja3Mgb24gdGhlIGJhY2sgYnV0dG9uLiBTd2l0Y2hlcyBiYWNrIHRvIHRoZSAnZ2FsbGVyeScgdmlldy5cbiAgICAgKi9cbiAgICBoYW5kbGVCYWNrKCkge1xuICAgICAgICB0aGlzLnByb3BzLnNldEVkaXRpbmcoZmFsc2UpO1xuICAgIH1cblxufVxuXG5FZGl0b3IucHJvcFR5cGVzID0ge1xuICAgIGl0ZW06IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgc2V0RWRpdGluZzogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEVkaXRvcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRWRpdG9yIGZyb20gJy4vZWRpdG9yJztcbmltcG9ydCBJdGVtIGZyb20gJy4vaXRlbSc7XG5pbXBvcnQgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2dhbGxlcnlBY3Rpb25zJztcbmltcG9ydCBpdGVtU3RvcmUgZnJvbSAnLi4vc3RvcmUvaXRlbVN0b3JlJztcblxuLyoqXG4gKiBAZnVuYyBnZXRJdGVtU3RvcmVTdGF0ZVxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqIEBkZXNjIEZhY3RvcnkgZm9yIGdldHRpbmcgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIEl0ZW1TdG9yZS5cbiAqL1xuZnVuY3Rpb24gZ2V0SXRlbVN0b3JlU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXRlbXM6IGl0ZW1TdG9yZS5nZXRBbGwoKVxuICAgIH07XG59XG5cbmNsYXNzIEdhbGxlcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHZhciBpdGVtcyA9IHdpbmRvdy5TU19BU1NFVF9HQUxMRVJZW3RoaXMucHJvcHMubmFtZV07XG5cbiAgICAgICAgaXRlbVN0b3JlLmRhdGFfdXJsID0gcHJvcHMuZGF0YV91cmw7XG4gICAgICAgIGl0ZW1TdG9yZS51cGRhdGVfdXJsID0gcHJvcHMudXBkYXRlX3VybDtcbiAgICAgICAgaXRlbVN0b3JlLmRlbGV0ZV91cmwgPSBwcm9wcy5kZWxldGVfdXJsO1xuICAgICAgICBpdGVtU3RvcmUuaW5pdGlhbF9mb2xkZXIgPSBwcm9wcy5pbml0aWFsX2ZvbGRlcjtcblxuICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgc3RvcmUuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtc1tpXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGdhbGxlcnkuXG4gICAgICAgIHRoaXMuc3RhdGUgPSBnZXRJdGVtU3RvcmVTdGF0ZSgpO1xuICAgICAgICB0aGlzLnN0YXRlLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50SXRlbSA9IG51bGw7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgICAgICAvLyBJbnRlcmZhY2Ugd2l0aCB0aGUgZm9ybSBzbyB3ZSBjYW4gdXBkYXRlIHN0YXRlIGJhc2VkIG9uIGNoYW5nZXMgaW4gdGhlIG91dHNpZGUgd29ybGQuXG4gICAgICAgIHZhciAkZm9ybSA9IGpRdWVyeShSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkuY2xvc2VzdCgnZm9ybScpO1xuXG4gICAgICAgIGlmICgkZm9ybS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRmb3JtLm9uKCdkaXJ0eScsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEV4cGxpY2l0bHkgYmluZCB0aGUgY3VycmVudCBjb250ZXh0IHRvIHRoZSBjYWxsYmFjay5cbiAgICAgICAgLy8gTm9kZSBldmVudCBlbWl0dGVycyAodGhlIGl0ZW0gc3RvcmUpIGJpbmQgdGhlaXIgY29udGV4dCB3aGVuIHRoZSBjYWxsYmFjayBpcyBpbnZva2VkLlxuICAgICAgICBpdGVtU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVbm1vdW50ICgpIHtcbiAgICAgICAgLy8gRXhwbGljaXRseSBiaW5kIHRoZSBjdXJyZW50IGNvbnRleHQgdG8gdGhlIGNhbGxiYWNrLlxuICAgICAgICAvLyBOb2RlIGV2ZW50IGVtaXR0ZXJzICh0aGUgaXRlbSBzdG9yZSkgYmluZCB0aGVpciBjb250ZXh0IHdoZW4gdGhlIGNhbGxiYWNrIGlzIGludm9rZWQuXG4gICAgICAgIGl0ZW1TdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZykge1xuICAgICAgICAgICAgbGV0IGVkaXRvckNvbXBvbmVudCA9IHRoaXMuZ2V0RWRpdG9yQ29tcG9uZW50KCk7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuICAgICAgICAgICAgICAgICAgICB7ZWRpdG9yQ29tcG9uZW50fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpdGVtcyA9IHRoaXMuZ2V0SXRlbUNvbXBvbmVudHMoKTtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoaXRlbVN0b3JlLmhhc05hdmlnYXRlZCgpKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uID0gPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTmF2aWdhdGUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgIEJhY2tcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuICAgICAgICAgICAgICAgICAgICB7YnV0dG9ufVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeV9faXRlbXMnPlxuICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW1zfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVOYXZpZ2F0ZSgpIHtcbiAgICAgICAgbGV0IG5hdmlnYXRpb24gPSBpdGVtU3RvcmUucG9wTmF2aWdhdGlvbigpO1xuXG4gICAgICAgIGdhbGxlcnlBY3Rpb25zLm5hdmlnYXRlKG5hdmlnYXRpb25bMV0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIG9uQ2hhbmdlXG4gICAgICogQGRlc2MgVXBkYXRlcyB0aGUgZ2FsbGVyeSBzdGF0ZSB3aGVuIHNvbWV0aG5pZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBvbkNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShnZXRJdGVtU3RvcmVTdGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBzZXRFZGl0aW5nXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpc0VkaXRpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2lkXVxuICAgICAqIEBkZXNjIFN3aXRjaGVzIGJldHdlZW4gZWRpdGluZyBhbmQgZ2FsbGVyeSBzdGF0ZXMuXG4gICAgICovXG4gICAgc2V0RWRpdGluZyhpc0VkaXRpbmcsIGlkKSB7XG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IHsgZWRpdGluZzogaXNFZGl0aW5nIH07XG5cbiAgICAgICAgaWYgKGlkICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50SXRlbSA9IGl0ZW1TdG9yZS5nZXRCeUlkKGlkKTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRJdGVtICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKGpRdWVyeS5leHRlbmQobmV3U3RhdGUsIHsgY3VycmVudEl0ZW06IGN1cnJlbnRJdGVtIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgZ2V0RWRpdG9yQ29tcG9uZW50XG4gICAgICogQGRlc2MgR2VuZXJhdGVzIHRoZSBlZGl0b3IgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGdldEVkaXRvckNvbXBvbmVudCgpIHtcbiAgICAgICAgdmFyIHByb3BzID0ge307XG5cbiAgICAgICAgcHJvcHMuaXRlbSA9IHRoaXMuc3RhdGUuY3VycmVudEl0ZW07XG4gICAgICAgIHByb3BzLnNldEVkaXRpbmcgPSB0aGlzLnNldEVkaXRpbmcuYmluZCh0aGlzKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEVkaXRvciB7Li4ucHJvcHN9IC8+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgZ2V0SXRlbUNvbXBvbmVudHNcbiAgICAgKiBAZGVzYyBHZW5lcmF0ZXMgdGhlIGl0ZW0gY29tcG9uZW50cyB3aGljaCBwb3B1bGF0ZSB0aGUgZ2FsbGVyeS5cbiAgICAgKi9cbiAgICBnZXRJdGVtQ29tcG9uZW50cygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLml0ZW1zKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxmLnN0YXRlLml0ZW1zW2tleV0sXG4gICAgICAgICAgICAgICAgcHJvcHMgPSB7fTtcblxuICAgICAgICAgICAgcHJvcHMuaWQgPSBpdGVtLmlkO1xuICAgICAgICAgICAgcHJvcHMuc2V0RWRpdGluZyA9IHRoaXMuc2V0RWRpdGluZy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgcHJvcHMudGl0bGUgPSBpdGVtLnRpdGxlO1xuICAgICAgICAgICAgcHJvcHMudXJsID0gaXRlbS51cmw7XG4gICAgICAgICAgICBwcm9wcy50eXBlID0gaXRlbS50eXBlO1xuICAgICAgICAgICAgcHJvcHMuZmlsZW5hbWUgPSBpdGVtLmZpbGVuYW1lO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxJdGVtIGtleT17a2V5fSB7Li4ucHJvcHN9IC8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBmZXRjaFxuICAgICAqIEBkZXNjIEdldHMgdGhlIGxhdGVzdCBkYXRhIGZyb20gdGhlIHNlcnZlci5cbiAgICAgKi9cbiAgICBmZXRjaCgpIHtcbiAgICAgICAgcmV0dXJuIGpRdWVyeVxuICAgICAgICAgICAgLmdldCh0aGlzLnByb3BzLmRhdGFfdXJsKVxuICAgICAgICAgICAgLmVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZmV0Y2hpbmcgZGF0YScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmZpbGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShkYXRhLmZpbGVzW2ldLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IGdldEl0ZW1TdG9yZVN0YXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbGxlcnk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGdhbGxlcnlBY3Rpb25zIGZyb20gJy4uL2FjdGlvbi9nYWxsZXJ5QWN0aW9ucyc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmNsYXNzIEl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgc3R5bGVzID0ge2JhY2tncm91bmRJbWFnZTogJ3VybCgnICsgdGhpcy5wcm9wcy51cmwgKyAnKSd9O1xuXG4gICAgICAgIHZhciBuYXZpZ2F0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGEgZm9sZGVyJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMudHlwZSA9PT0gJ2ZvbGRlcicpIHtcbiAgICAgICAgICAgIG5hdmlnYXRlID0gdGhpcy5oYW5kbGVOYXZpZ2F0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpdGVtJyBvbkNsaWNrPXtuYXZpZ2F0ZX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2l0ZW1fX3RodW1ibmFpbCcgc3R5bGU9e3N0eWxlc30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXJlbW92ZSBbIGZvbnQtaWNvbi1jYW5jZWwtY2lyY2xlZCBdJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZURlbGV0ZS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLWVkaXQgWyBmb250LWljb24tcGVuY2lsIF0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRWRpdC5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSdpdGVtX190aXRsZSc+e3RoaXMucHJvcHMudGl0bGV9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlRWRpdFxuICAgICAqIEBkZXNjIEV2ZW50IGhhbmRsZXIgZm9yIHRoZSAnZWRpdCcgYnV0dG9uLlxuICAgICAqL1xuICAgIGhhbmRsZUVkaXQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0RWRpdGluZyh0cnVlLCB0aGlzLnByb3BzLmlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciB0aGUgJ2VkaXQnIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBoYW5kbGVOYXZpZ2F0ZSgpIHtcbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMubmF2aWdhdGUodGhpcy5wcm9wcy5maWxlbmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgdGhlICdyZW1vdmUnIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBoYW5kbGVEZWxldGUoKSB7XG4gICAgICAgIGdhbGxlcnlBY3Rpb25zLmRlc3Ryb3kodGhpcy5wcm9wcy5pZCk7XG4gICAgfVxuXG59XG5cbkl0ZW0ucHJvcFR5cGVzID0ge1xuICAgIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNldEVkaXRpbmc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIHRpdGxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBJdGVtO1xuIiwiY29uc3QgQ09OU1RBTlRTID0ge1xuXHRJVEVNX1NUT1JFOiB7XG5cdFx0Q0hBTkdFOiAnY2hhbmdlJyxcblx0XHRDUkVBVEU6ICdjcmVhdGUnLFxuXHRcdFVQREFURTogJ3VwZGF0ZScsXG5cdFx0REVTVFJPWTogJ2Rlc3Ryb3knLFxuXHRcdE5BVklHQVRFOiAnbmF2aWdhdGUnXG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IENPTlNUQU5UUztcbiIsImltcG9ydCB7RGlzcGF0Y2hlcn0gZnJvbSAnZmx1eCc7XG5cbmxldCBfZ2FsbGVyeURpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpOyAvLyBTaW5nbGV0b25cblxuZXhwb3J0IGRlZmF1bHQgX2dhbGxlcnlEaXNwYXRjaGVyOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2FsbGVyeSBmcm9tICcuL2NvbXBvbmVudC9nYWxsZXJ5JztcblxualF1ZXJ5KCcuYXNzZXQtZ2FsbGVyeScpLmVudHdpbmUoe1xuXHQnb25hZGQnOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHByb3BzID0ge307XG5cblx0XHRwcm9wcy5uYW1lID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1uYW1lJyk7XG5cdFx0cHJvcHMuZGF0YV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRhdGEtdXJsJyk7XG5cdFx0cHJvcHMudXBkYXRlX3VybCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktdXBkYXRlLXVybCcpO1xuXHRcdHByb3BzLmRlbGV0ZV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRlbGV0ZS11cmwnKTtcblx0XHRwcm9wcy5pbml0aWFsX2ZvbGRlciA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktaW5pdGlhbC1mb2xkZXInKTtcblxuXHRcdGlmIChwcm9wcy5uYW1lID09PSBudWxsIHx8IHByb3BzLnVybCA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdFJlYWN0LnJlbmRlcihcblx0XHRcdDxHYWxsZXJ5IHsuLi5wcm9wc30gLz4sXG5cdFx0XHR0aGlzWzBdXG5cdFx0KTtcblx0fVxufSk7XG4iLCJpbXBvcnQgZ2FsbGVyeURpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlcic7XG5pbXBvcnQgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2dhbGxlcnlBY3Rpb25zJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIF9pdGVtcyA9IFtdO1xudmFyIF9mb2xkZXJzID0gW107XG52YXIgX2N1cnJlbnRGb2xkZXIgPSBudWxsO1xuXG4vKipcbiAqIEBmdW5jIGNyZWF0ZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtRGF0YVxuICogQGRlc2MgQWRkcyBhIGdhbGxlcnkgaXRlbSB0byB0aGUgc3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShpdGVtRGF0YSkge1xuXHRfaXRlbXMucHVzaChpdGVtRGF0YSk7XG59XG5cbi8qKlxuICogQGZ1bmMgZGVzdHJveVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7aW50fSBpZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBkZXNjIFJlbW92ZXMgYSBnYWxsZXJ5IGl0ZW0gZnJvbSB0aGUgc3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3koaWQsIGNhbGxiYWNrKSB7XG5cdGpRdWVyeS5hamF4KHsgLy8gQHRvZG8gZml4IHRoaXMganVua1xuXHRcdCd1cmwnOiBfaXRlbVN0b3JlLmRlbGV0ZV91cmwsXG5cdFx0J2RhdGEnOiB7XG5cdFx0XHQnaWQnOiBpZFxuXHRcdH0sXG5cdFx0J2RhdGFUeXBlJzogJ2pzb24nLFxuXHRcdCdtZXRob2QnOiAnR0VUJyxcblx0XHQnc3VjY2Vzcyc6IChkYXRhKSA9PiB7XG5cdFx0XHR2YXIgaXRlbUluZGV4ID0gLTE7XG5cblx0XHRcdC8vIEdldCB0aGUgaW5kZXggb2YgdGhlIGl0ZW0gd2UgaGF2ZSBkZWxldGVkXG5cdFx0XHQvLyBzbyBpdCBjYW4gYmUgcmVtb3ZlZCBmcm9tIHRoZSBzdG9yZS5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgX2l0ZW1zLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRcdGlmIChfaXRlbXNbaV0uaWQgPT09IGlkKSB7XG5cdFx0XHRcdFx0aXRlbUluZGV4ID0gaTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaXRlbUluZGV4ID09PSAtMSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdF9pdGVtcy5zcGxpY2UoaXRlbUluZGV4LCAxKTtcblxuXHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHR9XG5cdH0pO1xufVxuXG4vKipcbiAqIE5hdmlnYXRlcyB0byBhIG5ldyBmb2xkZXIuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZm9sZGVyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5mdW5jdGlvbiBuYXZpZ2F0ZShmb2xkZXIsIGNhbGxiYWNrKSB7XG5cdGpRdWVyeS5hamF4KHtcblx0XHQndXJsJzogX2l0ZW1TdG9yZS5kYXRhX3VybCxcblx0XHQnZGF0YVR5cGUnOiAnanNvbicsXG5cdFx0J2RhdGEnOiB7XG5cdFx0XHQnZm9sZGVyJzogZm9sZGVyXG5cdFx0fSxcblx0XHQnc3VjY2Vzcyc6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdF9pdGVtcyA9IHt9O1xuXG5cdFx0XHRpZiAoZm9sZGVyICE9PSBfaXRlbVN0b3JlLmluaXRpYWxfZm9sZGVyKSB7XG5cdFx0XHRcdF9mb2xkZXJzLnB1c2goW2ZvbGRlciwgX2N1cnJlbnRGb2xkZXIgfHwgX2l0ZW1TdG9yZS5pbml0aWFsX2ZvbGRlcl0pO1xuXHRcdFx0fVxuXG5cdFx0XHRfY3VycmVudEZvbGRlciA9IGZvbGRlcjtcblxuXHRcdFx0ZGF0YS5maWxlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtLCB0cnVlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdH1cblx0fSlcbn1cblxuXG4vKipcbiAqIEBmdW5jIHVwZGF0ZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW1EYXRhXG4gKiBAZGVzYyBVcGRhdGVzIGFuIGl0ZW0gaW4gdGhlIHN0b3JlLlxuICovXG5mdW5jdGlvbiB1cGRhdGUoaWQsIGl0ZW1EYXRhKSB7XG5cdC8vIFRPRE86XG59XG5cbmNsYXNzIEl0ZW1TdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZ2FsbGVyeSBoYXMgYmVlbiBuYXZpZ2F0ZWQuXG5cdCAqL1xuXHRoYXNOYXZpZ2F0ZWQoKSB7XG5cdFx0cmV0dXJuIF9mb2xkZXJzLmxlbmd0aCA+IDA7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgZm9sZGVyIHN0YWNrLlxuXHQgKi9cblx0cG9wTmF2aWdhdGlvbigpIHtcblx0XHRyZXR1cm4gX2ZvbGRlcnMucG9wKCk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKiBAZGVzYyBHZXRzIHRoZSBlbnRpcmUgY29sbGVjdGlvbiBvZiBpdGVtcy5cblx0ICovXG5cdGdldEFsbCgpIHtcblx0XHRyZXR1cm4gX2l0ZW1zO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIGdldEJ5SWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkXG5cdCAqIEByZXR1cm4ge29iamVjdH1cblx0ICovXG5cdGdldEJ5SWQoaWQpIHtcblx0XHR2YXIgaXRlbSA9IG51bGw7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IF9pdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0aWYgKF9pdGVtc1tpXS5pZCA9PT0gaWQpIHtcblx0XHRcdFx0aXRlbSA9IF9pdGVtc1tpXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW07XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZW1pdENoYW5nZVxuXHQgKiBAZGVzYyBUcmlnZ2VyZWQgd2hlbiBzb21ldGhpbmcgY2hhbmdlcyBpbiB0aGUgc3RvcmUuXG5cdCAqL1xuXHRlbWl0Q2hhbmdlKCkge1xuXHRcdHRoaXMuZW1pdChDT05TVEFOVFMuSVRFTV9TVE9SRS5DSEFOR0UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqL1xuXHRhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuXHRcdHRoaXMub24oQ09OU1RBTlRTLklURU1fU1RPUkUuQ0hBTkdFLCBjYWxsYmFjayk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcblx0ICovXG5cdHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcihDT05TVEFOVFMuSVRFTV9TVE9SRS5DSEFOR0UsIGNhbGxiYWNrKTtcblx0fVxufVxuXG5sZXQgX2l0ZW1TdG9yZSA9IG5ldyBJdGVtU3RvcmUoKTsgLy8gU2luZ2xldG9uXG5cbmdhbGxlcnlEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cdHN3aXRjaChwYXlsb2FkLmFjdGlvbikge1xuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuQ1JFQVRFOlxuXHRcdFx0Y3JlYXRlKHBheWxvYWQuZGF0YSk7XG5cblx0XHRcdGlmICghcGF5bG9hZC5zaWxlbnQpIHtcblx0XHRcdFx0X2l0ZW1TdG9yZS5lbWl0Q2hhbmdlKHBheWxvYWQuc2lsZW50KTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLkRFU1RST1k6XG5cdFx0XHRkZXN0cm95KHBheWxvYWQuZGF0YS5pZCwgKCkgPT4ge1xuXHRcdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdFx0X2l0ZW1TdG9yZS5lbWl0Q2hhbmdlKHBheWxvYWQuc2lsZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBDT05TVEFOVFMuSVRFTV9TVE9SRS5OQVZJR0FURTpcblx0XHRcdG5hdmlnYXRlKHBheWxvYWQuZGF0YS5mb2xkZXIsICgpID0+IHtcblx0XHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZShwYXlsb2FkLnNpbGVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuVVBEQVRFOlxuXHRcdFx0dXBkYXRlKHBheWxvYWQuZGF0YS5pZCwgcGF5bG9hZC5kYXRhLnVwZGF0ZXMpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiB0cnVlOyAvLyBObyBlcnJvcnMuIE5lZWRlZCBieSBwcm9taXNlIGluIERpc3BhdGNoZXIuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgX2l0ZW1TdG9yZTtcbiJdfQ==

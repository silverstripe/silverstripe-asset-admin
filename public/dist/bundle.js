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

var _dispatcherEditorDispatcher = require('../dispatcher/editorDispatcher');

var _dispatcherEditorDispatcher2 = _interopRequireDefault(_dispatcherEditorDispatcher);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var editorActions = {

	create: function create(data, silent) {
		_dispatcherEditorDispatcher2['default'].dispatch({
			action: _constants2['default'].EDITOR.CREATE,
			data: data,
			silent: silent
		});
	},

	update: function update(data, silent) {
		_dispatcherEditorDispatcher2['default'].dispatch({
			action: _constants2['default'].EDITOR.UPDATE,
			data: data,
			silent: silent
		});
	},

	clear: function clear(silent) {
		_dispatcherEditorDispatcher2['default'].dispatch({
			action: _constants2['default'].EDITOR.CLEAR,
			silent: silent
		});
	}

};

exports['default'] = editorActions;
module.exports = exports['default'];

},{"../constants":8,"../dispatcher/editorDispatcher":9}],3:[function(require,module,exports){
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
  * @func setStoreProps
  * @desc Initialises the store
  */
	setStoreProps: function setStoreProps(data, silent) {
		_dispatcherGalleryDispatcher2['default'].dispatch({
			action: _constants2['default'].ITEM_STORE.INIT,
			data: data,
			silent: silent
		});
	},

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
	},

	/**
  * Loads another page of items into the gallery.
  *
  * @param {bool} silent
  */
	page: function page(silent) {
		_dispatcherGalleryDispatcher2['default'].dispatch({
			action: _constants2['default'].ITEM_STORE.PAGE,
			silent: silent
		});
	}
};

exports['default'] = galleryActions;
module.exports = exports['default'];

},{"../constants":8,"../dispatcher/galleryDispatcher":10}],4:[function(require,module,exports){
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

var _inputField = require('./inputField');

var _inputField2 = _interopRequireDefault(_inputField);

var _actionEditorActions = require('../action/editorActions');

var _actionEditorActions2 = _interopRequireDefault(_actionEditorActions);

var _storeEditorStore = require('../store/editorStore');

var _storeEditorStore2 = _interopRequireDefault(_storeEditorStore);

/**
 * @func getEditorStoreState
 * @private
 * @return {object}
 * @desc Factory for getting the current state of the ItemStore.
 */
function getEditorStoreState() {
    return {
        fields: _storeEditorStore2['default'].getAll()
    };
}

/**
 * @func Editor
 * @desc Used to edit the properties of an Item.
 */

var Editor = (function (_React$Component) {
    _inherits(Editor, _React$Component);

    function Editor(props) {
        _classCallCheck(this, Editor);

        _get(Object.getPrototypeOf(Editor.prototype), 'constructor', this).call(this, props);

        // Manually bind so listeners are removed correctly
        this.onChange = this.onChange.bind(this);

        // Populate the store.
        _actionEditorActions2['default'].create({ name: 'title', value: props.item.title }, true);
        _actionEditorActions2['default'].create({ name: 'filename', value: props.item.filename }, true);

        this.state = getEditorStoreState();
    }

    _createClass(Editor, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _storeEditorStore2['default'].addChangeListener(this.onChange);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _storeEditorStore2['default'].removeChangeListener(this.onChange);
        }
    }, {
        key: 'render',
        value: function render() {
            var textFields = this.getTextFieldComponents();

            return _react2['default'].createElement(
                'div',
                { className: 'editor' },
                _react2['default'].createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'ss-ui-button ui-corner-all font-icon-level-up',
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
                    textFields,
                    _react2['default'].createElement(
                        'div',
                        null,
                        _react2['default'].createElement(
                            'button',
                            { type: 'submit', className: 'ss-ui-button ui-corner-all font-icon-check-mark' },
                            'Save'
                        ),
                        _react2['default'].createElement(
                            'button',
                            { type: 'button', className: 'ss-ui-button ui-corner-all font-icon-cancel-circled', onClick: this.handleCancel.bind(this) },
                            'Cancel'
                        )
                    )
                )
            );
        }

        /**
         * @func getTextFieldComponents
         * @desc Generates the editable text field components for the form.
         */
    }, {
        key: 'getTextFieldComponents',
        value: function getTextFieldComponents() {
            var _this = this;

            return Object.keys(this.state.fields).map(function (key) {
                var field = _this.state.fields[key];

                return _react2['default'].createElement(
                    'div',
                    { className: 'field text', key: key },
                    _react2['default'].createElement(
                        'label',
                        { className: 'left' },
                        field.name
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'middleColumn' },
                        _react2['default'].createElement(_inputField2['default'], { name: field.name, value: field.value })
                    )
                );
            });
        }

        /**
         * @func onChange
         * @desc Updates the editor state when something changes in the store.
         */
    }, {
        key: 'onChange',
        value: function onChange() {
            this.setState(getEditorStoreState());
        }

        /**
         * @func handleBack
         * @desc Handles clicks on the back button. Switches back to the 'gallery' view.
         */
    }, {
        key: 'handleBack',
        value: function handleBack() {
            _actionEditorActions2['default'].clear(true);
            this.props.setEditing(false);
        }

        /**
         * @func handleSave
         * @desc Handles clicks on the save button
         */
    }, {
        key: 'handleSave',
        value: function handleSave() {}
        // TODO:

        /**
         * @func handleCancel
         * @param {object} event
         * @desc Resets the form to it's origional state.
         */

    }, {
        key: 'handleCancel',
        value: function handleCancel() {
            _actionEditorActions2['default'].update({ name: 'title', value: this.props.item.title });
            _actionEditorActions2['default'].update({ name: 'filename', value: this.props.item.filename });
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

},{"../action/editorActions":2,"../store/editorStore":12,"./inputField":6,"react":"react"}],5:[function(require,module,exports){
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

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

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

        // Manually bind so listeners are removed correctly
        this.onChange = this.onChange.bind(this);

        _actionGalleryActions2['default'].setStoreProps({
            data_url: props.data_url,
            update_url: props.update_url,
            delete_url: props.delete_url,
            initial_folder: props.initial_folder,
            limit: props.limit
        });

        // Populate the store.
        for (var i = 0; i < items.length; i += 1) {
            _actionGalleryActions2['default'].create(items[i], true);
        }

        // Set the initial state of the gallery.
        this.state = _jquery2['default'].extend(getItemStoreState(), { editing: false, currentItem: null });
    }

    _createClass(Gallery, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // @todo
            // if we want to hook into dirty checking, we need to find a way of refreshing
            // all loaded data not just the first page again...

            var $content = (0, _jquery2['default'])('.cms-content-fields');

            if ($content.length) {
                $content.on('scroll', function (event) {
                    if ($content[0].scrollHeight - $content[0].scrollTop === $content[0].clientHeight) {
                        _actionGalleryActions2['default'].page();
                    }
                });
            }

            _storeItemStore2['default'].addChangeListener(this.onChange);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _storeItemStore2['default'].removeChangeListener(this.onChange);
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
                    this.setState(_jquery2['default'].extend(newState, { currentItem: currentItem }));
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
            var _this = this;

            var self = this;

            return Object.keys(this.state.items).map(function (key) {
                var item = self.state.items[key],
                    props = {};

                props.attributes = item.attributes;
                props.id = item.id;
                props.setEditing = _this.setEditing.bind(_this);
                props.title = item.title;
                props.url = item.url;
                props.type = item.type;
                props.filename = item.filename;

                return _react2['default'].createElement(_item2['default'], _extends({ key: key }, props));
            });
        }
    }]);

    return Gallery;
})(_react2['default'].Component);

exports['default'] = Gallery;
module.exports = exports['default'];

},{"../action/galleryActions":3,"../store/itemStore":13,"./editor":4,"./item":7,"jquery":"jquery","react":"react"}],6:[function(require,module,exports){
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

var _actionEditorActions = require('../action/editorActions');

var _actionEditorActions2 = _interopRequireDefault(_actionEditorActions);

var InputField = (function (_React$Component) {
	_inherits(InputField, _React$Component);

	function InputField() {
		_classCallCheck(this, InputField);

		_get(Object.getPrototypeOf(InputField.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(InputField, [{
		key: 'render',
		value: function render() {
			return _react2['default'].createElement('input', { className: 'text', type: 'text', value: this.props.value, onChange: this.handleChange.bind(this) });
		}

		/**
   * @func handleChange
   * @param {object} event
   * @desc Handles the change events on input fields.
   */
	}, {
		key: 'handleChange',
		value: function handleChange(event) {
			_actionEditorActions2['default'].update({ name: this.props.name, value: event.target.value });
		}
	}]);

	return InputField;
})(_react2['default'].Component);

exports['default'] = InputField;
module.exports = exports['default'];

},{"../action/editorActions":2,"react":"react"}],7:[function(require,module,exports){
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
            var styles = { backgroundImage: 'url(' + this.props.url + ')' },
                thumbnailClassNames = 'item__thumbnail';

            if (this.imageLargerThanThumbnail()) {
                thumbnailClassNames += ' large';
            }

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
                    { className: thumbnailClassNames, style: styles },
                    _react2['default'].createElement(
                        'div',
                        { className: 'item__actions' },
                        _react2['default'].createElement('button', {
                            className: 'item__actions__action item__actions__action--remove [ font-icon-trash ]',
                            type: 'button',
                            onClick: this.handleDelete.bind(this) }),
                        _react2['default'].createElement('button', {
                            className: 'item__actions__action item__actions__action--edit [ font-icon-edit ]',
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
            //TODO internationalise confirmation message with transifex if/when merged into core
            if (confirm('Are you sure you want to delete this record?')) {
                _actionGalleryActions2['default'].destroy(this.props.id);
            }
        }

        /**
         * @func imageLargerThanThumbnail
         * @desc Check if an image is larger than the thumbnail container.
         */
    }, {
        key: 'imageLargerThanThumbnail',
        value: function imageLargerThanThumbnail() {
            return this.props.attributes.dimensions.height > _constants2['default'].ITEM_COMPONENT.THUMBNAIL_HEIGHT || this.props.attributes.dimensions.width > _constants2['default'].ITEM_COMPONENT.THUMBNAIL_WIDTH;
        }
    }]);

    return Item;
})(_react2['default'].Component);

Item.propTypes = {
    attributes: _react2['default'].PropTypes.object,
    id: _react2['default'].PropTypes.number,
    setEditing: _react2['default'].PropTypes.func,
    title: _react2['default'].PropTypes.string,
    url: _react2['default'].PropTypes.string
};

exports['default'] = Item;
module.exports = exports['default'];

},{"../action/galleryActions":3,"../constants":8,"react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var CONSTANTS = {
	ITEM_STORE: {
		INIT: 'init',
		CHANGE: 'change',
		CREATE: 'create',
		UPDATE: 'update',
		DESTROY: 'destroy',
		NAVIGATE: 'navigate',
		PAGE: 'page'
	},
	EDITOR: {
		CHANGE: 'change',
		UPDATE: 'update',
		CLEAR: 'clear'
	},
	ITEM_COMPONENT: {
		THUMBNAIL_HEIGHT: 150,
		THUMBNAIL_WIDTH: 200
	}
};

exports['default'] = CONSTANTS;
module.exports = exports['default'];

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _flux = require('flux');

var _editorDispatcher = new _flux.Dispatcher(); // Singleton

exports['default'] = _editorDispatcher;
module.exports = exports['default'];

},{"flux":"flux"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _flux = require('flux');

var _galleryDispatcher = new _flux.Dispatcher(); // Singleton

exports['default'] = _galleryDispatcher;
module.exports = exports['default'];

},{"flux":"flux"}],11:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentGallery = require('./component/gallery');

var _componentGallery2 = _interopRequireDefault(_componentGallery);

(0, _jquery2['default'])('.asset-gallery').entwine({
	'onadd': function onadd() {
		var props = {};

		props.name = this[0].getAttribute('data-asset-gallery-name');
		props.data_url = this[0].getAttribute('data-asset-gallery-data-url');
		props.update_url = this[0].getAttribute('data-asset-gallery-update-url');
		props.delete_url = this[0].getAttribute('data-asset-gallery-delete-url');
		props.initial_folder = this[0].getAttribute('data-asset-gallery-initial-folder');
		props.limit = this[0].getAttribute('data-asset-gallery-limit');

		if (props.name === null || props.url === null) {
			return;
		}

		_react2['default'].render(_react2['default'].createElement(_componentGallery2['default'], props), this[0]);
	}
});

},{"./component/gallery":5,"jquery":"jquery","react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _dispatcherEditorDispatcher = require('../dispatcher/editorDispatcher');

var _dispatcherEditorDispatcher2 = _interopRequireDefault(_dispatcherEditorDispatcher);

var _actionEditorActions = require('../action/editorActions');

var _actionEditorActions2 = _interopRequireDefault(_actionEditorActions);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _fields = [];

function create(data) {
	var fieldExists = _fields.filter(function (field) {
		return field.name === data.name;
	}).length > 0;

	if (fieldExists) {
		return;
	}

	_fields.push({
		name: data.name,
		value: data.value
	});
}

function update(data) {
	for (var i = 0; i < _fields.length; i += 1) {
		if (_fields[i].name === data.name) {
			_fields[i] = data;
			break;
		}
	}
}

function clear() {
	_fields = [];
}

var EditorStore = (function (_EventEmitter) {
	_inherits(EditorStore, _EventEmitter);

	function EditorStore() {
		_classCallCheck(this, EditorStore);

		_get(Object.getPrototypeOf(EditorStore.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(EditorStore, [{
		key: 'getAll',

		/**
   * @return {object}
   * @desc Gets the entire collection of items.
   */
		value: function getAll() {
			return _fields;
		}

		/**
   * @func emitChange
   * @desc Triggered when something changes in the store.
   */
	}, {
		key: 'emitChange',
		value: function emitChange() {
			this.emit(_constants2['default'].EDITOR.CHANGE);
		}

		/**
   * @param {function} callback
   */
	}, {
		key: 'addChangeListener',
		value: function addChangeListener(callback) {
			this.on(_constants2['default'].EDITOR.CHANGE, callback);
		}

		/**
   * @param {function} callback
   */
	}, {
		key: 'removeChangeListener',
		value: function removeChangeListener(callback) {
			this.removeListener(_constants2['default'].EDITOR.CHANGE, callback);
		}
	}]);

	return EditorStore;
})(_events2['default']);

var _editorStore = new EditorStore(); // Singleton.

_dispatcherEditorDispatcher2['default'].register(function (payload) {

	switch (payload.action) {
		case _constants2['default'].EDITOR.CREATE:
			create(payload.data);

			if (!payload.silent) {
				_editorStore.emitChange();
			}

			break;

		case _constants2['default'].EDITOR.UPDATE:
			update(payload.data);

			if (!payload.silent) {
				_editorStore.emitChange();
			}

			break;

		case _constants2['default'].EDITOR.CLEAR:
			clear();

			if (!payload.silent) {
				_editorStore.emitChange();
			}
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

exports['default'] = _editorStore;
module.exports = exports['default'];

},{"../action/editorActions":2,"../constants":8,"../dispatcher/editorDispatcher":9,"events":1}],13:[function(require,module,exports){
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

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _items = [];
var _folders = [];
var _currentFolder = null;

var _filters = {
	'page': 1,
	'limit': 10
};

/**
 * @func init
 * @private
 * @param {object} data
 * @desc Sets properties on the store.
 */
function init(data) {
	Object.keys(data).map(function (key) {
		_itemStore[key] = data[key];
	});
}

/**
 * @func create
 * @private
 * @param {object} itemData
 * @desc Adds a gallery item to the store.
 */
function create(itemData) {
	var itemExists = _items.filter(function (item) {
		return item.id === itemData.id;
	}).length > 0;

	if (itemExists) {
		return;
	}

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
	_jquery2['default'].ajax({ // @todo fix this junk
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
	_filters.page = 1;
	_filters.folder = folder;

	_jquery2['default'].ajax({
		'url': _itemStore.data_url,
		'dataType': 'json',
		'data': {
			'folder': _filters.folder,
			'page': _filters.page++,
			'limit': _itemStore.limit
		},
		'success': function success(data) {
			_items = [];

			_filters.count = data.count;

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

function page(callback) {
	if (_items.length < _filters.count) {
		_jquery2['default'].ajax({
			'url': _itemStore.data_url,
			'dataType': 'json',
			'data': {
				'folder': _filters.folder,
				'page': _filters.page++,
				'limit': _itemStore.limit
			},
			'success': function success(data) {
				data.files.forEach(function (item) {
					_actionGalleryActions2['default'].create(item, true);
				});

				callback && callback();
			}
		});
	}
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
		case _constants2['default'].ITEM_STORE.INIT:
			init(payload.data);

			if (!payload.silent) {
				_itemStore.emitChange();
			}

			break;

		case _constants2['default'].ITEM_STORE.CREATE:
			create(payload.data);

			if (!payload.silent) {
				_itemStore.emitChange();
			}

			break;

		case _constants2['default'].ITEM_STORE.DESTROY:
			destroy(payload.data.id, function () {
				if (!payload.silent) {
					_itemStore.emitChange();
				}
			});

			break;

		case _constants2['default'].ITEM_STORE.NAVIGATE:
			navigate(payload.data.folder, function () {
				if (!payload.silent) {
					_itemStore.emitChange();
				}
			});

			break;

		case _constants2['default'].ITEM_STORE.UPDATE:
			update(payload.data.id, payload.data.updates);

			if (!payload.silent) {
				_itemStore.emitChange();
			}

			break;

		case _constants2['default'].ITEM_STORE.PAGE:
			page(function () {
				if (!payload.silent) {
					_itemStore.emitChange();
				}
			});

			break;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

exports['default'] = _itemStore;
module.exports = exports['default'];

},{"../action/galleryActions":3,"../constants":8,"../dispatcher/galleryDispatcher":10,"events":1,"jquery":"jquery"}]},{},[11])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvYWN0aW9uL2VkaXRvckFjdGlvbnMuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2FjdGlvbi9nYWxsZXJ5QWN0aW9ucy5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2VkaXRvci5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2dhbGxlcnkuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9pbnB1dEZpZWxkLmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvaXRlbS5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9kaXNwYXRjaGVyL2VkaXRvckRpc3BhdGNoZXIuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2Rpc3BhdGNoZXIvZ2FsbGVyeURpc3BhdGNoZXIuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL21haW4uanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL3N0b3JlL2VkaXRvclN0b3JlLmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9zdG9yZS9pdGVtU3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsImltcG9ydCBlZGl0b3JEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvZWRpdG9yRGlzcGF0Y2hlcic7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBlZGl0b3JBY3Rpb25zID0ge1xuXG5cdGNyZWF0ZShkYXRhLCBzaWxlbnQpIHtcblx0XHRlZGl0b3JEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLkVESVRPUi5DUkVBVEUsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHR1cGRhdGUoZGF0YSwgc2lsZW50KSB7XG5cdFx0ZWRpdG9yRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5FRElUT1IuVVBEQVRFLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0Y2xlYXIoc2lsZW50KSB7XG5cdFx0ZWRpdG9yRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5FRElUT1IuQ0xFQVIsXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgZWRpdG9yQWN0aW9uczsiLCJpbXBvcnQgZ2FsbGVyeURpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlcic7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBnYWxsZXJ5QWN0aW9ucyA9IHtcblxuXHQvKipcblx0ICogQGZ1bmMgc2V0U3RvcmVQcm9wc1xuXHQgKiBAZGVzYyBJbml0aWFsaXNlcyB0aGUgc3RvcmVcblx0ICovXG5cdHNldFN0b3JlUHJvcHMoZGF0YSwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5JTklULFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEBmdW5jIGNyZWF0ZVxuXHQgKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuXHQgKiBAZGVzYyBDcmVhdGVzIGEgZ2FsbGVyeSBpdGVtLlxuXHQgKi9cblx0Y3JlYXRlKGRhdGEsIHNpbGVudCkge1xuXHRcdGdhbGxlcnlEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLklURU1fU1RPUkUuQ1JFQVRFLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEBmdW5jIGRlc3Ryb3lcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkZWxldGVfdXJsXG5cdCAqIEBwYXJhbSB7Ym9vbH0gc2lsZW50XG5cdCAqIEBkZXNjIGRlc3Ryb3lzIGEgZ2FsbGVyeSBpdGVtLlxuXHQgKi9cblx0ZGVzdHJveShpZCwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5ERVNUUk9ZLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpZDogaWRcblx0XHRcdH0sXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAZnVuYyB1cGRhdGVcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcblx0ICogQGRlc2MgVXBkYXRlcyBhIGdhbGxlcnkgaXRlbS5cblx0ICovXG5cdHVwZGF0ZShpZCwgdXBkYXRlcywgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5VUERBVEUsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGlkOiBpZCxcblx0XHRcdFx0dXBkYXRlczogdXBkYXRlc1xuXHRcdFx0fSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyB0byBhIG5ldyBmb2xkZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmb2xkZXJcblx0ICogQHBhcmFtIHtib29sfSBzaWxlbnRcblx0ICovXG5cdG5hdmlnYXRlKGZvbGRlciwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5OQVZJR0FURSxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0J2ZvbGRlcic6IGZvbGRlclxuXHRcdFx0fSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIExvYWRzIGFub3RoZXIgcGFnZSBvZiBpdGVtcyBpbnRvIHRoZSBnYWxsZXJ5LlxuXHQgKlxuXHQgKiBAcGFyYW0ge2Jvb2x9IHNpbGVudFxuXHQgKi9cblx0cGFnZShzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLlBBR0UsXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYWxsZXJ5QWN0aW9ucztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSW5wdXRGaWVsZCBmcm9tICcuL2lucHV0RmllbGQnO1xuaW1wb3J0IGVkaXRvckFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2VkaXRvckFjdGlvbnMnO1xuaW1wb3J0IGVkaXRvclN0b3JlIGZyb20gJy4uL3N0b3JlL2VkaXRvclN0b3JlJztcblxuLyoqXG4gKiBAZnVuYyBnZXRFZGl0b3JTdG9yZVN0YXRlXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7b2JqZWN0fVxuICogQGRlc2MgRmFjdG9yeSBmb3IgZ2V0dGluZyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgSXRlbVN0b3JlLlxuICovXG5mdW5jdGlvbiBnZXRFZGl0b3JTdG9yZVN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZpZWxkczogZWRpdG9yU3RvcmUuZ2V0QWxsKClcbiAgICB9O1xufVxuXG4vKipcbiAqIEBmdW5jIEVkaXRvclxuICogQGRlc2MgVXNlZCB0byBlZGl0IHRoZSBwcm9wZXJ0aWVzIG9mIGFuIEl0ZW0uXG4gKi9cbmNsYXNzIEVkaXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgLy8gTWFudWFsbHkgYmluZCBzbyBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgY29ycmVjdGx5XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy8gUG9wdWxhdGUgdGhlIHN0b3JlLlxuICAgICAgICBlZGl0b3JBY3Rpb25zLmNyZWF0ZSh7IG5hbWU6ICd0aXRsZScsIHZhbHVlOiBwcm9wcy5pdGVtLnRpdGxlIH0sIHRydWUpO1xuICAgICAgICBlZGl0b3JBY3Rpb25zLmNyZWF0ZSh7IG5hbWU6ICdmaWxlbmFtZScsIHZhbHVlOiBwcm9wcy5pdGVtLmZpbGVuYW1lIH0sIHRydWUpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSBnZXRFZGl0b3JTdG9yZVN0YXRlKCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgICAgICBlZGl0b3JTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgICAgIGVkaXRvclN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIHRleHRGaWVsZHMgPSB0aGlzLmdldFRleHRGaWVsZENvbXBvbmVudHMoKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2VkaXRvcic+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0nc3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWxldmVsLXVwJ1xuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUJhY2suYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgIEJhY2sgdG8gZ2FsbGVyeVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvIG5vbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvLXByZXZpZXcgbm9sYWJlbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9J3RodW1ibmFpbC1wcmV2aWV3JyBzcmM9e3RoaXMucHJvcHMuaXRlbS51cmx9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1kYXRhIG5vbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgbm9sYWJlbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaWxlIHR5cGU6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0udHlwZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RmlsZSBzaXplOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS5zaXplfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+VVJMOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17dGhpcy5wcm9wcy5pdGVtLnVybH0gdGFyZ2V0PSdfYmxhbmsnPnt0aGlzLnByb3BzLml0ZW0udXJsfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaXJzdCB1cGxvYWRlZDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0uY3JlYXRlZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+TGFzdCBjaGFuZ2VkOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS5sYXN0VXBkYXRlZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkRpbWVuc2lvbnM6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy53aWR0aH0geCB7dGhpcy5wcm9wcy5pdGVtLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy5oZWlnaHR9cHg8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIHt0ZXh0RmllbGRzfVxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J3N1Ym1pdCcgY2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNoZWNrLW1hcmtcIj5TYXZlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkXCIgb25DbGljaz17dGhpcy5oYW5kbGVDYW5jZWwuYmluZCh0aGlzKX0gPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBnZXRUZXh0RmllbGRDb21wb25lbnRzXG4gICAgICogQGRlc2MgR2VuZXJhdGVzIHRoZSBlZGl0YWJsZSB0ZXh0IGZpZWxkIGNvbXBvbmVudHMgZm9yIHRoZSBmb3JtLlxuICAgICAqL1xuICAgIGdldFRleHRGaWVsZENvbXBvbmVudHMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLmZpZWxkcykubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IHRoaXMuc3RhdGUuZmllbGRzW2tleV07XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHRleHQnIGtleT17a2V5fT5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2ZpZWxkLm5hbWV9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXRGaWVsZCBuYW1lPXtmaWVsZC5uYW1lfSB2YWx1ZT17ZmllbGQudmFsdWV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBvbkNoYW5nZVxuICAgICAqIEBkZXNjIFVwZGF0ZXMgdGhlIGVkaXRvciBzdGF0ZSB3aGVuIHNvbWV0aGluZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBvbkNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShnZXRFZGl0b3JTdG9yZVN0YXRlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGhhbmRsZUJhY2tcbiAgICAgKiBAZGVzYyBIYW5kbGVzIGNsaWNrcyBvbiB0aGUgYmFjayBidXR0b24uIFN3aXRjaGVzIGJhY2sgdG8gdGhlICdnYWxsZXJ5JyB2aWV3LlxuICAgICAqL1xuICAgIGhhbmRsZUJhY2soKSB7XG4gICAgICAgIGVkaXRvckFjdGlvbnMuY2xlYXIodHJ1ZSk7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0RWRpdGluZyhmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlU2F2ZVxuICAgICAqIEBkZXNjIEhhbmRsZXMgY2xpY2tzIG9uIHRoZSBzYXZlIGJ1dHRvblxuICAgICAqL1xuICAgIGhhbmRsZVNhdmUoKSB7XG4gICAgICAgIC8vIFRPRE86XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlQ2FuY2VsXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG4gICAgICogQGRlc2MgUmVzZXRzIHRoZSBmb3JtIHRvIGl0J3Mgb3JpZ2lvbmFsIHN0YXRlLlxuICAgICAqL1xuICAgIGhhbmRsZUNhbmNlbCgpIHtcbiAgICAgICAgZWRpdG9yQWN0aW9ucy51cGRhdGUoeyBuYW1lOiAndGl0bGUnLCB2YWx1ZTogdGhpcy5wcm9wcy5pdGVtLnRpdGxlIH0pO1xuICAgICAgICBlZGl0b3JBY3Rpb25zLnVwZGF0ZSh7IG5hbWU6ICdmaWxlbmFtZScsIHZhbHVlOiB0aGlzLnByb3BzLml0ZW0uZmlsZW5hbWUgfSk7XG4gICAgfVxuXG59XG5cbkVkaXRvci5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBzZXRFZGl0aW5nOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRWRpdG9yO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgRWRpdG9yIGZyb20gJy4vZWRpdG9yJztcbmltcG9ydCBJdGVtIGZyb20gJy4vaXRlbSc7XG5pbXBvcnQgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2dhbGxlcnlBY3Rpb25zJztcbmltcG9ydCBpdGVtU3RvcmUgZnJvbSAnLi4vc3RvcmUvaXRlbVN0b3JlJztcblxuLyoqXG4gKiBAZnVuYyBnZXRJdGVtU3RvcmVTdGF0ZVxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqIEBkZXNjIEZhY3RvcnkgZm9yIGdldHRpbmcgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIEl0ZW1TdG9yZS5cbiAqL1xuZnVuY3Rpb24gZ2V0SXRlbVN0b3JlU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXRlbXM6IGl0ZW1TdG9yZS5nZXRBbGwoKVxuICAgIH07XG59XG5cbmNsYXNzIEdhbGxlcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHZhciBpdGVtcyA9IHdpbmRvdy5TU19BU1NFVF9HQUxMRVJZW3RoaXMucHJvcHMubmFtZV07XG5cbiAgICAgICAgLy8gTWFudWFsbHkgYmluZCBzbyBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgY29ycmVjdGx5XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMuc2V0U3RvcmVQcm9wcyh7XG4gICAgICAgICAgICBkYXRhX3VybDogcHJvcHMuZGF0YV91cmwsXG4gICAgICAgICAgICB1cGRhdGVfdXJsOiBwcm9wcy51cGRhdGVfdXJsLFxuICAgICAgICAgICAgZGVsZXRlX3VybDogcHJvcHMuZGVsZXRlX3VybCxcbiAgICAgICAgICAgIGluaXRpYWxfZm9sZGVyOiBwcm9wcy5pbml0aWFsX2ZvbGRlcixcbiAgICAgICAgICAgIGxpbWl0OiBwcm9wcy5saW1pdFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgc3RvcmUuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtc1tpXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGdhbGxlcnkuXG4gICAgICAgIHRoaXMuc3RhdGUgPSAkLmV4dGVuZChnZXRJdGVtU3RvcmVTdGF0ZSgpLCB7IGVkaXRpbmc6IGZhbHNlLCBjdXJyZW50SXRlbTogbnVsbCB9KTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgICAgIC8vIEB0b2RvXG4gICAgICAgIC8vIGlmIHdlIHdhbnQgdG8gaG9vayBpbnRvIGRpcnR5IGNoZWNraW5nLCB3ZSBuZWVkIHRvIGZpbmQgYSB3YXkgb2YgcmVmcmVzaGluZ1xuICAgICAgICAvLyBhbGwgbG9hZGVkIGRhdGEgbm90IGp1c3QgdGhlIGZpcnN0IHBhZ2UgYWdhaW4uLi5cblxuICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKCcuY21zLWNvbnRlbnQtZmllbGRzJyk7XG5cbiAgICAgICAgaWYgKCRjb250ZW50Lmxlbmd0aCkge1xuICAgICAgICAgICAgJGNvbnRlbnQub24oJ3Njcm9sbCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgkY29udGVudFswXS5zY3JvbGxIZWlnaHQgLSAkY29udGVudFswXS5zY3JvbGxUb3AgPT09ICRjb250ZW50WzBdLmNsaWVudEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBnYWxsZXJ5QWN0aW9ucy5wYWdlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgICAgICBpdGVtU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nKSB7XG4gICAgICAgICAgICBsZXQgZWRpdG9yQ29tcG9uZW50ID0gdGhpcy5nZXRFZGl0b3JDb21wb25lbnQoKTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG4gICAgICAgICAgICAgICAgICAgIHtlZGl0b3JDb21wb25lbnR9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5nZXRJdGVtQ29tcG9uZW50cygpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChpdGVtU3RvcmUuaGFzTmF2aWdhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICBidXR0b24gPSA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVOYXZpZ2F0ZS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgQmFja1xuICAgICAgICAgICAgICAgIDwvYnV0dG9uPjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG4gICAgICAgICAgICAgICAgICAgIHtidXR0b259XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5X19pdGVtcyc+XG4gICAgICAgICAgICAgICAgICAgICAgICB7aXRlbXN9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZU5hdmlnYXRlKCkge1xuICAgICAgICBsZXQgbmF2aWdhdGlvbiA9IGl0ZW1TdG9yZS5wb3BOYXZpZ2F0aW9uKCk7XG5cbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMubmF2aWdhdGUobmF2aWdhdGlvblsxXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgb25DaGFuZ2VcbiAgICAgKiBAZGVzYyBVcGRhdGVzIHRoZSBnYWxsZXJ5IHN0YXRlIHdoZW4gc29tZXRobmlnIGNoYW5nZXMgaW4gdGhlIHN0b3JlLlxuICAgICAqL1xuICAgIG9uQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKGdldEl0ZW1TdG9yZVN0YXRlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIHNldEVkaXRpbmdcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzRWRpdGluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbaWRdXG4gICAgICogQGRlc2MgU3dpdGNoZXMgYmV0d2VlbiBlZGl0aW5nIGFuZCBnYWxsZXJ5IHN0YXRlcy5cbiAgICAgKi9cbiAgICBzZXRFZGl0aW5nKGlzRWRpdGluZywgaWQpIHtcbiAgICAgICAgdmFyIG5ld1N0YXRlID0geyBlZGl0aW5nOiBpc0VkaXRpbmcgfTtcblxuICAgICAgICBpZiAoaWQgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRJdGVtID0gaXRlbVN0b3JlLmdldEJ5SWQoaWQpO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudEl0ZW0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoJC5leHRlbmQobmV3U3RhdGUsIHsgY3VycmVudEl0ZW06IGN1cnJlbnRJdGVtIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgZ2V0RWRpdG9yQ29tcG9uZW50XG4gICAgICogQGRlc2MgR2VuZXJhdGVzIHRoZSBlZGl0b3IgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGdldEVkaXRvckNvbXBvbmVudCgpIHtcbiAgICAgICAgdmFyIHByb3BzID0ge307XG5cbiAgICAgICAgcHJvcHMuaXRlbSA9IHRoaXMuc3RhdGUuY3VycmVudEl0ZW07XG4gICAgICAgIHByb3BzLnNldEVkaXRpbmcgPSB0aGlzLnNldEVkaXRpbmcuYmluZCh0aGlzKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEVkaXRvciB7Li4ucHJvcHN9IC8+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgZ2V0SXRlbUNvbXBvbmVudHNcbiAgICAgKiBAZGVzYyBHZW5lcmF0ZXMgdGhlIGl0ZW0gY29tcG9uZW50cyB3aGljaCBwb3B1bGF0ZSB0aGUgZ2FsbGVyeS5cbiAgICAgKi9cbiAgICBnZXRJdGVtQ29tcG9uZW50cygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLml0ZW1zKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxmLnN0YXRlLml0ZW1zW2tleV0sXG4gICAgICAgICAgICAgICAgcHJvcHMgPSB7fTtcblxuICAgICAgICAgICAgcHJvcHMuYXR0cmlidXRlcyA9IGl0ZW0uYXR0cmlidXRlcztcbiAgICAgICAgICAgIHByb3BzLmlkID0gaXRlbS5pZDtcbiAgICAgICAgICAgIHByb3BzLnNldEVkaXRpbmcgPSB0aGlzLnNldEVkaXRpbmcuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHByb3BzLnRpdGxlID0gaXRlbS50aXRsZTtcbiAgICAgICAgICAgIHByb3BzLnVybCA9IGl0ZW0udXJsO1xuICAgICAgICAgICAgcHJvcHMudHlwZSA9IGl0ZW0udHlwZTtcbiAgICAgICAgICAgIHByb3BzLmZpbGVuYW1lID0gaXRlbS5maWxlbmFtZTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8SXRlbSBrZXk9e2tleX0gey4uLnByb3BzfSAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYWxsZXJ5O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBlZGl0b3JBY3Rpb25zIGZyb20gJy4uL2FjdGlvbi9lZGl0b3JBY3Rpb25zJztcblxuY2xhc3MgSW5wdXRGaWVsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8aW5wdXQgY2xhc3NOYW1lPSd0ZXh0JyB0eXBlPSd0ZXh0JyB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9IC8+XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZnVuYyBoYW5kbGVDaGFuZ2Vcblx0ICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG5cdCAqIEBkZXNjIEhhbmRsZXMgdGhlIGNoYW5nZSBldmVudHMgb24gaW5wdXQgZmllbGRzLlxuXHQgKi9cblx0aGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG5cdFx0ZWRpdG9yQWN0aW9ucy51cGRhdGUoeyBuYW1lOiB0aGlzLnByb3BzLm5hbWUsIHZhbHVlOiBldmVudC50YXJnZXQudmFsdWUgfSk7XG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnB1dEZpZWxkO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZ2FsbGVyeUFjdGlvbnMnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5jbGFzcyBJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIHN0eWxlcyA9IHtiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIHRoaXMucHJvcHMudXJsICsgJyknfSxcbiAgICAgICAgICAgIHRodW1ibmFpbENsYXNzTmFtZXMgPSAnaXRlbV9fdGh1bWJuYWlsJztcblxuICAgICAgICBpZiAodGhpcy5pbWFnZUxhcmdlclRoYW5UaHVtYm5haWwoKSkge1xuICAgICAgICAgICAgdGh1bWJuYWlsQ2xhc3NOYW1lcyArPSAnIGxhcmdlJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuYXZpZ2F0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGEgZm9sZGVyJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMudHlwZSA9PT0gJ2ZvbGRlcicpIHtcbiAgICAgICAgICAgIG5hdmlnYXRlID0gdGhpcy5oYW5kbGVOYXZpZ2F0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpdGVtJyBvbkNsaWNrPXtuYXZpZ2F0ZX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RodW1ibmFpbENsYXNzTmFtZXN9IHN0eWxlPXtzdHlsZXN9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naXRlbV9fYWN0aW9ucyc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1yZW1vdmUgWyBmb250LWljb24tdHJhc2ggXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVEZWxldGUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1lZGl0IFsgZm9udC1pY29uLWVkaXQgXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVFZGl0LmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9J2l0ZW1fX3RpdGxlJz57dGhpcy5wcm9wcy50aXRsZX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBoYW5kbGVFZGl0XG4gICAgICogQGRlc2MgRXZlbnQgaGFuZGxlciBmb3IgdGhlICdlZGl0JyBidXR0b24uXG4gICAgICovXG4gICAgaGFuZGxlRWRpdCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRFZGl0aW5nKHRydWUsIHRoaXMucHJvcHMuaWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIHRoZSAnZWRpdCcgYnV0dG9uLlxuICAgICAqL1xuICAgIGhhbmRsZU5hdmlnYXRlKCkge1xuICAgICAgICBnYWxsZXJ5QWN0aW9ucy5uYXZpZ2F0ZSh0aGlzLnByb3BzLmZpbGVuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciB0aGUgJ3JlbW92ZScgYnV0dG9uLlxuICAgICAqL1xuICAgIGhhbmRsZURlbGV0ZSgpIHtcbiAgICAgICAgLy9UT0RPIGludGVybmF0aW9uYWxpc2UgY29uZmlybWF0aW9uIG1lc3NhZ2Ugd2l0aCB0cmFuc2lmZXggaWYvd2hlbiBtZXJnZWQgaW50byBjb3JlXG4gICAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgcmVjb3JkPycpKSB7XG4gICAgICAgICAgICBnYWxsZXJ5QWN0aW9ucy5kZXN0cm95KHRoaXMucHJvcHMuaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaW1hZ2VMYXJnZXJUaGFuVGh1bWJuYWlsXG4gICAgICogQGRlc2MgQ2hlY2sgaWYgYW4gaW1hZ2UgaXMgbGFyZ2VyIHRoYW4gdGhlIHRodW1ibmFpbCBjb250YWluZXIuXG4gICAgICovXG4gICAgaW1hZ2VMYXJnZXJUaGFuVGh1bWJuYWlsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMuaGVpZ2h0ID4gQ09OU1RBTlRTLklURU1fQ09NUE9ORU5ULlRIVU1CTkFJTF9IRUlHSFQgfHwgXG4gICAgICAgICAgICAgICB0aGlzLnByb3BzLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy53aWR0aCA+IENPTlNUQU5UUy5JVEVNX0NPTVBPTkVOVC5USFVNQk5BSUxfV0lEVEg7XG4gICAgfVxufVxuXG5JdGVtLnByb3BUeXBlcyA9IHtcbiAgICBhdHRyaWJ1dGVzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIGlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIHNldEVkaXRpbmc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIHRpdGxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSXRlbTtcbiIsImNvbnN0IENPTlNUQU5UUyA9IHtcblx0SVRFTV9TVE9SRToge1xuXHRcdElOSVQ6ICdpbml0Jyxcblx0XHRDSEFOR0U6ICdjaGFuZ2UnLFxuXHRcdENSRUFURTogJ2NyZWF0ZScsXG5cdFx0VVBEQVRFOiAndXBkYXRlJyxcblx0XHRERVNUUk9ZOiAnZGVzdHJveScsXG5cdFx0TkFWSUdBVEU6ICduYXZpZ2F0ZScsXG5cdFx0UEFHRTogJ3BhZ2UnXG5cdH0sXG5cdEVESVRPUjoge1xuXHRcdENIQU5HRTogJ2NoYW5nZScsXG5cdFx0VVBEQVRFOiAndXBkYXRlJyxcblx0XHRDTEVBUjogJ2NsZWFyJ1xuXHR9LFxuXHRJVEVNX0NPTVBPTkVOVDoge1xuXHRcdFRIVU1CTkFJTF9IRUlHSFQ6IDE1MCxcblx0XHRUSFVNQk5BSUxfV0lEVEg6IDIwMFxuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDT05TVEFOVFM7XG4iLCJpbXBvcnQge0Rpc3BhdGNoZXJ9IGZyb20gJ2ZsdXgnO1xuXG5sZXQgX2VkaXRvckRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpOyAvLyBTaW5nbGV0b25cblxuZXhwb3J0IGRlZmF1bHQgX2VkaXRvckRpc3BhdGNoZXI7XG4iLCJpbXBvcnQge0Rpc3BhdGNoZXJ9IGZyb20gJ2ZsdXgnO1xuXG5sZXQgX2dhbGxlcnlEaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTsgLy8gU2luZ2xldG9uXG5cbmV4cG9ydCBkZWZhdWx0IF9nYWxsZXJ5RGlzcGF0Y2hlcjtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEdhbGxlcnkgZnJvbSAnLi9jb21wb25lbnQvZ2FsbGVyeSc7XG5cbiQoJy5hc3NldC1nYWxsZXJ5JykuZW50d2luZSh7XG5cdCdvbmFkZCc6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgcHJvcHMgPSB7fTtcblxuXHRcdHByb3BzLm5hbWUgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LW5hbWUnKTtcblx0XHRwcm9wcy5kYXRhX3VybCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktZGF0YS11cmwnKTtcblx0XHRwcm9wcy51cGRhdGVfdXJsID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS11cGRhdGUtdXJsJyk7XG5cdFx0cHJvcHMuZGVsZXRlX3VybCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktZGVsZXRlLXVybCcpO1xuXHRcdHByb3BzLmluaXRpYWxfZm9sZGVyID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1pbml0aWFsLWZvbGRlcicpO1xuXHRcdHByb3BzLmxpbWl0ID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1saW1pdCcpO1xuXG5cdFx0aWYgKHByb3BzLm5hbWUgPT09IG51bGwgfHwgcHJvcHMudXJsID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0UmVhY3QucmVuZGVyKFxuXHRcdFx0PEdhbGxlcnkgey4uLnByb3BzfSAvPixcblx0XHRcdHRoaXNbMF1cblx0XHQpO1xuXHR9XG59KTtcbiIsImltcG9ydCBlZGl0b3JEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvZWRpdG9yRGlzcGF0Y2hlcic7XG5pbXBvcnQgZWRpdG9yQWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZWRpdG9yQWN0aW9ucyc7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBfZmllbGRzID0gW107XG5cbmZ1bmN0aW9uIGNyZWF0ZShkYXRhKSB7XG5cdHZhciBmaWVsZEV4aXN0cyA9IF9maWVsZHMuZmlsdGVyKChmaWVsZCkgPT4geyByZXR1cm4gZmllbGQubmFtZSA9PT0gZGF0YS5uYW1lOyB9KS5sZW5ndGggPiAwO1xuXG5cdGlmIChmaWVsZEV4aXN0cykge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdF9maWVsZHMucHVzaCh7XG5cdFx0bmFtZTogZGF0YS5uYW1lLFxuXHRcdHZhbHVlOiBkYXRhLnZhbHVlXG5cdH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUoZGF0YSkge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IF9maWVsZHMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRpZiAoX2ZpZWxkc1tpXS5uYW1lID09PSBkYXRhLm5hbWUpIHtcblx0XHRcdF9maWVsZHNbaV0gPSBkYXRhO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGNsZWFyKCkge1xuXHRfZmllbGRzID0gW107XG59XG5cbmNsYXNzIEVkaXRvclN0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHQvKipcblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKiBAZGVzYyBHZXRzIHRoZSBlbnRpcmUgY29sbGVjdGlvbiBvZiBpdGVtcy5cblx0ICovXG5cdGdldEFsbCgpIHtcblx0XHRyZXR1cm4gX2ZpZWxkcztcblx0fVxuXG5cdC8qKlxuXHQgKiBAZnVuYyBlbWl0Q2hhbmdlXG5cdCAqIEBkZXNjIFRyaWdnZXJlZCB3aGVuIHNvbWV0aGluZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cblx0ICovXG5cdGVtaXRDaGFuZ2UoKSB7XG5cdFx0dGhpcy5lbWl0KENPTlNUQU5UUy5FRElUT1IuQ0hBTkdFKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKi9cblx0YWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcblx0XHR0aGlzLm9uKENPTlNUQU5UUy5FRElUT1IuQ0hBTkdFLCBjYWxsYmFjayk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcblx0ICovXG5cdHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcihDT05TVEFOVFMuRURJVE9SLkNIQU5HRSwgY2FsbGJhY2spO1xuXHR9XG5cbn1cblxubGV0IF9lZGl0b3JTdG9yZSA9IG5ldyBFZGl0b3JTdG9yZSgpOyAvLyBTaW5nbGV0b24uXG5cbmVkaXRvckRpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24gKHBheWxvYWQpIHtcblxuXHRzd2l0Y2gocGF5bG9hZC5hY3Rpb24pIHtcblx0XHRjYXNlIENPTlNUQU5UUy5FRElUT1IuQ1JFQVRFOlxuXHRcdFx0Y3JlYXRlKHBheWxvYWQuZGF0YSk7XG5cblx0XHRcdGlmICghcGF5bG9hZC5zaWxlbnQpIHtcblx0XHRcdFx0X2VkaXRvclN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5FRElUT1IuVVBEQVRFOlxuXHRcdFx0dXBkYXRlKHBheWxvYWQuZGF0YSk7XG5cblx0XHRcdGlmICghcGF5bG9hZC5zaWxlbnQpIHtcblx0XHRcdFx0X2VkaXRvclN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5FRElUT1IuQ0xFQVI6XG5cdFx0XHRjbGVhcigpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9lZGl0b3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTsgLy8gTm8gZXJyb3JzLiBOZWVkZWQgYnkgcHJvbWlzZSBpbiBEaXNwYXRjaGVyLlxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgX2VkaXRvclN0b3JlO1xuIiwiaW1wb3J0IGdhbGxlcnlEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvZ2FsbGVyeURpc3BhdGNoZXInO1xuaW1wb3J0IGdhbGxlcnlBY3Rpb25zIGZyb20gJy4uL2FjdGlvbi9nYWxsZXJ5QWN0aW9ucyc7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgX2l0ZW1zID0gW107XG52YXIgX2ZvbGRlcnMgPSBbXTtcbnZhciBfY3VycmVudEZvbGRlciA9IG51bGw7XG5cbnZhciBfZmlsdGVycyA9IHtcblx0J3BhZ2UnOiAxLFxuXHQnbGltaXQnOiAxMFxufTtcblxuLyoqXG4gKiBAZnVuYyBpbml0XG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAqIEBkZXNjIFNldHMgcHJvcGVydGllcyBvbiB0aGUgc3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGluaXQoZGF0YSkge1xuXHRPYmplY3Qua2V5cyhkYXRhKS5tYXAoKGtleSkgPT4ge1xuXHRcdF9pdGVtU3RvcmVba2V5XSA9IGRhdGFba2V5XTtcblx0fSk7XG59XG5cbi8qKlxuICogQGZ1bmMgY3JlYXRlXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW1EYXRhXG4gKiBAZGVzYyBBZGRzIGEgZ2FsbGVyeSBpdGVtIHRvIHRoZSBzdG9yZS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlKGl0ZW1EYXRhKSB7XG5cdHZhciBpdGVtRXhpc3RzID0gX2l0ZW1zLmZpbHRlcigoaXRlbSkgPT4geyByZXR1cm4gaXRlbS5pZCA9PT0gaXRlbURhdGEuaWQ7IH0pLmxlbmd0aCA+IDA7XG5cblx0aWYgKGl0ZW1FeGlzdHMpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRfaXRlbXMucHVzaChpdGVtRGF0YSk7XG59XG5cbi8qKlxuICogQGZ1bmMgZGVzdHJveVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7aW50fSBpZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBkZXNjIFJlbW92ZXMgYSBnYWxsZXJ5IGl0ZW0gZnJvbSB0aGUgc3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3koaWQsIGNhbGxiYWNrKSB7XG5cdCQuYWpheCh7IC8vIEB0b2RvIGZpeCB0aGlzIGp1bmtcblx0XHQndXJsJzogX2l0ZW1TdG9yZS5kZWxldGVfdXJsLFxuXHRcdCdkYXRhJzoge1xuXHRcdFx0J2lkJzogaWRcblx0XHR9LFxuXHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHQnbWV0aG9kJzogJ0dFVCcsXG5cdFx0J3N1Y2Nlc3MnOiAoZGF0YSkgPT4ge1xuXHRcdFx0dmFyIGl0ZW1JbmRleCA9IC0xO1xuXG5cdFx0XHQvLyBHZXQgdGhlIGluZGV4IG9mIHRoZSBpdGVtIHdlIGhhdmUgZGVsZXRlZFxuXHRcdFx0Ly8gc28gaXQgY2FuIGJlIHJlbW92ZWQgZnJvbSB0aGUgc3RvcmUuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IF9pdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0XHRpZiAoX2l0ZW1zW2ldLmlkID09PSBpZCkge1xuXHRcdFx0XHRcdGl0ZW1JbmRleCA9IGk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGl0ZW1JbmRleCA9PT0gLTEpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRfaXRlbXMuc3BsaWNlKGl0ZW1JbmRleCwgMSk7XG5cblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0fVxuXHR9KTtcbn1cblxuLyoqXG4gKiBOYXZpZ2F0ZXMgdG8gYSBuZXcgZm9sZGVyLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZvbGRlclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gbmF2aWdhdGUoZm9sZGVyLCBjYWxsYmFjaykge1xuXHRfZmlsdGVycy5wYWdlID0gMTtcblx0X2ZpbHRlcnMuZm9sZGVyID0gZm9sZGVyO1xuXG5cdCQuYWpheCh7XG5cdFx0J3VybCc6IF9pdGVtU3RvcmUuZGF0YV91cmwsXG5cdFx0J2RhdGFUeXBlJzogJ2pzb24nLFxuXHRcdCdkYXRhJzoge1xuXHRcdFx0J2ZvbGRlcic6IF9maWx0ZXJzLmZvbGRlcixcblx0XHRcdCdwYWdlJzogX2ZpbHRlcnMucGFnZSsrLFxuXHRcdFx0J2xpbWl0JzogX2l0ZW1TdG9yZS5saW1pdFxuXHRcdH0sXG5cdFx0J3N1Y2Nlc3MnOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRfaXRlbXMgPSBbXTtcblxuXHRcdFx0X2ZpbHRlcnMuY291bnQgPSBkYXRhLmNvdW50O1xuXG5cdFx0XHRpZiAoZm9sZGVyICE9PSBfaXRlbVN0b3JlLmluaXRpYWxfZm9sZGVyKSB7XG5cdFx0XHRcdF9mb2xkZXJzLnB1c2goW2ZvbGRlciwgX2N1cnJlbnRGb2xkZXIgfHwgX2l0ZW1TdG9yZS5pbml0aWFsX2ZvbGRlcl0pO1xuXHRcdFx0fVxuXG5cdFx0XHRfY3VycmVudEZvbGRlciA9IGZvbGRlcjtcblxuXHRcdFx0ZGF0YS5maWxlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtLCB0cnVlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdH1cblx0fSlcbn1cblxuZnVuY3Rpb24gcGFnZShjYWxsYmFjaykge1xuXHRpZiAoX2l0ZW1zLmxlbmd0aCA8IF9maWx0ZXJzLmNvdW50KSB7XG5cdFx0JC5hamF4KHtcblx0XHRcdCd1cmwnOiBfaXRlbVN0b3JlLmRhdGFfdXJsLFxuXHRcdFx0J2RhdGFUeXBlJzogJ2pzb24nLFxuXHRcdFx0J2RhdGEnOiB7XG5cdFx0XHRcdCdmb2xkZXInOiBfZmlsdGVycy5mb2xkZXIsXG5cdFx0XHRcdCdwYWdlJzogX2ZpbHRlcnMucGFnZSsrLFxuXHRcdFx0XHQnbGltaXQnOiBfaXRlbVN0b3JlLmxpbWl0XG5cdFx0XHR9LFxuXHRcdFx0J3N1Y2Nlc3MnOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdGRhdGEuZmlsZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0XHRcdGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtLCB0cnVlKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5cbi8qKlxuICogQGZ1bmMgdXBkYXRlXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gKiBAcGFyYW0ge29iamVjdH0gaXRlbURhdGFcbiAqIEBkZXNjIFVwZGF0ZXMgYW4gaXRlbSBpbiB0aGUgc3RvcmUuXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZShpZCwgaXRlbURhdGEpIHtcblx0Ly8gVE9ETzpcbn1cblxuY2xhc3MgSXRlbVN0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBnYWxsZXJ5IGhhcyBiZWVuIG5hdmlnYXRlZC5cblx0ICovXG5cdGhhc05hdmlnYXRlZCgpIHtcblx0XHRyZXR1cm4gX2ZvbGRlcnMubGVuZ3RoID4gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBmb2xkZXIgc3RhY2suXG5cdCAqL1xuXHRwb3BOYXZpZ2F0aW9uKCkge1xuXHRcdHJldHVybiBfZm9sZGVycy5wb3AoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHtvYmplY3R9XG5cdCAqIEBkZXNjIEdldHMgdGhlIGVudGlyZSBjb2xsZWN0aW9uIG9mIGl0ZW1zLlxuXHQgKi9cblx0Z2V0QWxsKCkge1xuXHRcdHJldHVybiBfaXRlbXM7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZ2V0QnlJZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaWRcblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKi9cblx0Z2V0QnlJZChpZCkge1xuXHRcdHZhciBpdGVtID0gbnVsbDtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgX2l0ZW1zLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRpZiAoX2l0ZW1zW2ldLmlkID09PSBpZCkge1xuXHRcdFx0XHRpdGVtID0gX2l0ZW1zW2ldO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZnVuYyBlbWl0Q2hhbmdlXG5cdCAqIEBkZXNjIFRyaWdnZXJlZCB3aGVuIHNvbWV0aGluZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cblx0ICovXG5cdGVtaXRDaGFuZ2UoKSB7XG5cdFx0dGhpcy5lbWl0KENPTlNUQU5UUy5JVEVNX1NUT1JFLkNIQU5HRSk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcblx0ICovXG5cdGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5vbihDT05TVEFOVFMuSVRFTV9TVE9SRS5DSEFOR0UsIGNhbGxiYWNrKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKi9cblx0cmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcblx0XHR0aGlzLnJlbW92ZUxpc3RlbmVyKENPTlNUQU5UUy5JVEVNX1NUT1JFLkNIQU5HRSwgY2FsbGJhY2spO1xuXHR9XG59XG5cbmxldCBfaXRlbVN0b3JlID0gbmV3IEl0ZW1TdG9yZSgpOyAvLyBTaW5nbGV0b25cblxuZ2FsbGVyeURpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24gKHBheWxvYWQpIHtcblx0c3dpdGNoKHBheWxvYWQuYWN0aW9uKSB7XG5cdFx0Y2FzZSBDT05TVEFOVFMuSVRFTV9TVE9SRS5JTklUOlxuXHRcdFx0aW5pdChwYXlsb2FkLmRhdGEpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuQ1JFQVRFOlxuXHRcdFx0Y3JlYXRlKHBheWxvYWQuZGF0YSk7XG5cblx0XHRcdGlmICghcGF5bG9hZC5zaWxlbnQpIHtcblx0XHRcdFx0X2l0ZW1TdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBDT05TVEFOVFMuSVRFTV9TVE9SRS5ERVNUUk9ZOlxuXHRcdFx0ZGVzdHJveShwYXlsb2FkLmRhdGEuaWQsICgpID0+IHtcblx0XHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLk5BVklHQVRFOlxuXHRcdFx0bmF2aWdhdGUocGF5bG9hZC5kYXRhLmZvbGRlciwgKCkgPT4ge1xuXHRcdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdFx0X2l0ZW1TdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuVVBEQVRFOlxuXHRcdFx0dXBkYXRlKHBheWxvYWQuZGF0YS5pZCwgcGF5bG9hZC5kYXRhLnVwZGF0ZXMpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuUEFHRTpcblx0XHRcdHBhZ2UoKCkgPT4ge1xuXHRcdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdFx0X2l0ZW1TdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiB0cnVlOyAvLyBObyBlcnJvcnMuIE5lZWRlZCBieSBwcm9taXNlIGluIERpc3BhdGNoZXIuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgX2l0ZW1TdG9yZTtcbiJdfQ==

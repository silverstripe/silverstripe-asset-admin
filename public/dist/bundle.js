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
                            { type: 'submit' },
                            'Save'
                        ),
                        _react2['default'].createElement(
                            'button',
                            { type: 'button', onClick: this.handleCancel.bind(this) },
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

        _storeItemStore2['default'].data_url = props.data_url;
        _storeItemStore2['default'].update_url = props.update_url;
        _storeItemStore2['default'].delete_url = props.delete_url;
        _storeItemStore2['default'].initial_folder = props.initial_folder;
        _storeItemStore2['default'].limit = props.limit;

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
            // @todo
            // if we want to hook into dirty checking, we need to find a way of refreshing
            // all loaded data not just the first page again...

            var $content = jQuery('.cms-content-fields');

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
            var _this = this;

            var self = this;

            return Object.keys(this.state.items).map(function (key) {
                var item = self.state.items[key],
                    props = {};

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

},{"../action/galleryActions":3,"../store/itemStore":13,"./editor":4,"./item":7,"react":"react"}],6:[function(require,module,exports){
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

},{"../action/galleryActions":3,"../constants":8,"react":"react"}],8:[function(require,module,exports){
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
		NAVIGATE: 'navigate',
		PAGE: 'page'
	},
	EDITOR: {
		CHANGE: 'change',
		UPDATE: 'update',
		CLEAR: 'clear'
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
		props.limit = this[0].getAttribute('data-asset-gallery-limit');

		if (props.name === null || props.url === null) {
			return;
		}

		_react2['default'].render(_react2['default'].createElement(_componentGallery2['default'], props), this[0]);
	}
});

},{"./component/gallery":5,"react":"react"}],12:[function(require,module,exports){
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
	_filters.page = 1;
	_filters.folder = folder;

	jQuery.ajax({
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
		jQuery.ajax({
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

},{"../action/galleryActions":3,"../constants":8,"../dispatcher/galleryDispatcher":10,"events":1}]},{},[11])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2FjdGlvbi9lZGl0b3JBY3Rpb25zLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvYWN0aW9uL2dhbGxlcnlBY3Rpb25zLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2VkaXRvci5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9nYWxsZXJ5LmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2lucHV0RmllbGQuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvaXRlbS5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbnN0YW50cy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2Rpc3BhdGNoZXIvZWRpdG9yRGlzcGF0Y2hlci5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2Rpc3BhdGNoZXIvZ2FsbGVyeURpc3BhdGNoZXIuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9tYWluLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvc3RvcmUvZWRpdG9yU3RvcmUuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9zdG9yZS9pdGVtU3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0QsQ0FBQyxDQUFDOztBQUVILFNBQU07O0FBQUEsQUFFUCxPQUFLLHVCQUFVLFVBQVUsQ0FBQyxNQUFNO0FBQy9CLFNBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU5QyxPQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNwQixjQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDeEI7O0FBRUQsU0FBTTs7QUFBQSxBQUVQLE9BQUssdUJBQVUsVUFBVSxDQUFDLElBQUk7QUFDN0IsT0FBSSxDQUFDLFlBQU07QUFDVixRQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNwQixlQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDeEI7SUFDRCxDQUFDLENBQUM7O0FBRUgsU0FBTTtBQUFBLEVBQ1A7O0FBRUQsUUFBTyxJQUFJLENBQUM7Q0FDWixDQUFDLENBQUM7O3FCQUVZLFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiaW1wb3J0IGVkaXRvckRpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9lZGl0b3JEaXNwYXRjaGVyJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIGVkaXRvckFjdGlvbnMgPSB7XG5cblx0Y3JlYXRlKGRhdGEsIHNpbGVudCkge1xuXHRcdGVkaXRvckRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuRURJVE9SLkNSRUFURSxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9LFxuXG5cdHVwZGF0ZShkYXRhLCBzaWxlbnQpIHtcblx0XHRlZGl0b3JEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLkVESVRPUi5VUERBVEUsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHRjbGVhcihzaWxlbnQpIHtcblx0XHRlZGl0b3JEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLkVESVRPUi5DTEVBUixcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBlZGl0b3JBY3Rpb25zOyIsImltcG9ydCBnYWxsZXJ5RGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2dhbGxlcnlEaXNwYXRjaGVyJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIGdhbGxlcnlBY3Rpb25zID0ge1xuXHQvKipcblx0ICogQGZ1bmMgY3JlYXRlXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG5cdCAqIEBkZXNjIENyZWF0ZXMgYSBnYWxsZXJ5IGl0ZW0uXG5cdCAqL1xuXHRjcmVhdGU6IGZ1bmN0aW9uIChkYXRhLCBzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLkNSRUFURSxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAZnVuYyBkZXN0cm95XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGVsZXRlX3VybFxuXHQgKiBAcGFyYW0ge2Jvb2x9IHNpbGVudFxuXHQgKiBAZGVzYyBkZXN0cm95cyBhIGdhbGxlcnkgaXRlbS5cblx0ICovXG5cdGRlc3Ryb3k6IGZ1bmN0aW9uIChpZCwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5ERVNUUk9ZLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpZDogaWRcblx0XHRcdH0sXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAZnVuYyB1cGRhdGVcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcblx0ICogQGRlc2MgVXBkYXRlcyBhIGdhbGxlcnkgaXRlbS5cblx0ICovXG5cdHVwZGF0ZTogZnVuY3Rpb24gKGlkLCB1cGRhdGVzLCBzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLlVQREFURSxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0aWQ6IGlkLFxuXHRcdFx0XHR1cGRhdGVzOiB1cGRhdGVzXG5cdFx0XHR9LFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogTmF2aWdhdGVzIHRvIGEgbmV3IGZvbGRlci5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZvbGRlclxuXHQgKiBAcGFyYW0ge2Jvb2x9IHNpbGVudFxuXHQgKi9cblx0bmF2aWdhdGU6IGZ1bmN0aW9uIChmb2xkZXIsIHNpbGVudCkge1xuXHRcdGdhbGxlcnlEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLklURU1fU1RPUkUuTkFWSUdBVEUsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdCdmb2xkZXInOiBmb2xkZXJcblx0XHRcdH0sXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBMb2FkcyBhbm90aGVyIHBhZ2Ugb2YgaXRlbXMgaW50byB0aGUgZ2FsbGVyeS5cblx0ICpcblx0ICogQHBhcmFtIHtib29sfSBzaWxlbnRcblx0ICovXG5cdHBhZ2U6IGZ1bmN0aW9uIChzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLlBBR0UsXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYWxsZXJ5QWN0aW9ucztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSW5wdXRGaWVsZCBmcm9tICcuL2lucHV0RmllbGQnO1xuaW1wb3J0IGVkaXRvckFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2VkaXRvckFjdGlvbnMnO1xuaW1wb3J0IGVkaXRvclN0b3JlIGZyb20gJy4uL3N0b3JlL2VkaXRvclN0b3JlJztcblxuLyoqXG4gKiBAZnVuYyBnZXRFZGl0b3JTdG9yZVN0YXRlXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7b2JqZWN0fVxuICogQGRlc2MgRmFjdG9yeSBmb3IgZ2V0dGluZyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgSXRlbVN0b3JlLlxuICovXG5mdW5jdGlvbiBnZXRFZGl0b3JTdG9yZVN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZpZWxkczogZWRpdG9yU3RvcmUuZ2V0QWxsKClcbiAgICB9O1xufVxuXG4vKipcbiAqIEBmdW5jIEVkaXRvclxuICogQGRlc2MgVXNlZCB0byBlZGl0IHRoZSBwcm9wZXJ0aWVzIG9mIGFuIEl0ZW0uXG4gKi9cbmNsYXNzIEVkaXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgLy8gTWFudWFsbHkgYmluZCBzbyBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgY29ycmVjdGx5XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy8gUG9wdWxhdGUgdGhlIHN0b3JlLlxuICAgICAgICBlZGl0b3JBY3Rpb25zLmNyZWF0ZSh7IG5hbWU6ICd0aXRsZScsIHZhbHVlOiBwcm9wcy5pdGVtLnRpdGxlIH0sIHRydWUpO1xuICAgICAgICBlZGl0b3JBY3Rpb25zLmNyZWF0ZSh7IG5hbWU6ICdmaWxlbmFtZScsIHZhbHVlOiBwcm9wcy5pdGVtLmZpbGVuYW1lIH0sIHRydWUpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSBnZXRFZGl0b3JTdG9yZVN0YXRlKCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgICAgICBlZGl0b3JTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgICAgIGVkaXRvclN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIHRleHRGaWVsZHMgPSB0aGlzLmdldFRleHRGaWVsZENvbXBvbmVudHMoKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2VkaXRvcic+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQmFjay5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgQmFjayB0byBnYWxsZXJ5XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8gbm9sYWJlbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tcHJldmlldyBub2xhYmVsJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0ndGh1bWJuYWlsLXByZXZpZXcnIHNyYz17dGhpcy5wcm9wcy5pdGVtLnVybH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvLWRhdGEgbm9sYWJlbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBub2xhYmVsJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpbGUgdHlwZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS50eXBlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaWxlIHNpemU6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLnNpemV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5VUkw6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXt0aGlzLnByb3BzLml0ZW0udXJsfSB0YXJnZXQ9J19ibGFuayc+e3RoaXMucHJvcHMuaXRlbS51cmx9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgZGF0ZV9kaXNhYmxlZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpcnN0IHVwbG9hZGVkOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS5jcmVhdGVkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5MYXN0IGNoYW5nZWQ6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLmxhc3RVcGRhdGVkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RGltZW5zaW9uczo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0uYXR0cmlidXRlcy5kaW1lbnNpb25zLndpZHRofSB4IHt0aGlzLnByb3BzLml0ZW0uYXR0cmlidXRlcy5kaW1lbnNpb25zLmhlaWdodH1weDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAge3RleHRGaWVsZHN9XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nc3VibWl0Jz5TYXZlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgb25DbGljaz17dGhpcy5oYW5kbGVDYW5jZWwuYmluZCh0aGlzKX0gPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBnZXRUZXh0RmllbGRDb21wb25lbnRzXG4gICAgICogQGRlc2MgR2VuZXJhdGVzIHRoZSBlZGl0YWJsZSB0ZXh0IGZpZWxkIGNvbXBvbmVudHMgZm9yIHRoZSBmb3JtLlxuICAgICAqL1xuICAgIGdldFRleHRGaWVsZENvbXBvbmVudHMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLmZpZWxkcykubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IHRoaXMuc3RhdGUuZmllbGRzW2tleV07XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHRleHQnIGtleT17a2V5fT5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2ZpZWxkLm5hbWV9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXRGaWVsZCBuYW1lPXtmaWVsZC5uYW1lfSB2YWx1ZT17ZmllbGQudmFsdWV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBvbkNoYW5nZVxuICAgICAqIEBkZXNjIFVwZGF0ZXMgdGhlIGVkaXRvciBzdGF0ZSB3aGVuIHNvbWV0aGluZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBvbkNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShnZXRFZGl0b3JTdG9yZVN0YXRlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGhhbmRsZUJhY2tcbiAgICAgKiBAZGVzYyBIYW5kbGVzIGNsaWNrcyBvbiB0aGUgYmFjayBidXR0b24uIFN3aXRjaGVzIGJhY2sgdG8gdGhlICdnYWxsZXJ5JyB2aWV3LlxuICAgICAqL1xuICAgIGhhbmRsZUJhY2soKSB7XG4gICAgICAgIGVkaXRvckFjdGlvbnMuY2xlYXIodHJ1ZSk7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0RWRpdGluZyhmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlU2F2ZVxuICAgICAqIEBkZXNjIEhhbmRsZXMgY2xpY2tzIG9uIHRoZSBzYXZlIGJ1dHRvblxuICAgICAqL1xuICAgIGhhbmRsZVNhdmUoKSB7XG4gICAgICAgIC8vIFRPRE86XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlQ2FuY2VsXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG4gICAgICogQGRlc2MgUmVzZXRzIHRoZSBmb3JtIHRvIGl0J3Mgb3JpZ2lvbmFsIHN0YXRlLlxuICAgICAqL1xuICAgIGhhbmRsZUNhbmNlbCgpIHtcbiAgICAgICAgZWRpdG9yQWN0aW9ucy51cGRhdGUoeyBuYW1lOiAndGl0bGUnLCB2YWx1ZTogdGhpcy5wcm9wcy5pdGVtLnRpdGxlIH0pO1xuICAgICAgICBlZGl0b3JBY3Rpb25zLnVwZGF0ZSh7IG5hbWU6ICdmaWxlbmFtZScsIHZhbHVlOiB0aGlzLnByb3BzLml0ZW0uZmlsZW5hbWUgfSk7XG4gICAgfVxuXG59XG5cbkVkaXRvci5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBzZXRFZGl0aW5nOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRWRpdG9yO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBFZGl0b3IgZnJvbSAnLi9lZGl0b3InO1xuaW1wb3J0IEl0ZW0gZnJvbSAnLi9pdGVtJztcbmltcG9ydCBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZ2FsbGVyeUFjdGlvbnMnO1xuaW1wb3J0IGl0ZW1TdG9yZSBmcm9tICcuLi9zdG9yZS9pdGVtU3RvcmUnO1xuXG4vKipcbiAqIEBmdW5jIGdldEl0ZW1TdG9yZVN0YXRlXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7b2JqZWN0fVxuICogQGRlc2MgRmFjdG9yeSBmb3IgZ2V0dGluZyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgSXRlbVN0b3JlLlxuICovXG5mdW5jdGlvbiBnZXRJdGVtU3RvcmVTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpdGVtczogaXRlbVN0b3JlLmdldEFsbCgpXG4gICAgfTtcbn1cblxuY2xhc3MgR2FsbGVyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgdmFyIGl0ZW1zID0gd2luZG93LlNTX0FTU0VUX0dBTExFUllbdGhpcy5wcm9wcy5uYW1lXTtcblxuICAgICAgICAvLyBNYW51YWxseSBiaW5kIHNvIGxpc3RlbmVycyBhcmUgcmVtb3ZlZCBjb3JyZWN0bHlcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKTtcblxuICAgICAgICBpdGVtU3RvcmUuZGF0YV91cmwgPSBwcm9wcy5kYXRhX3VybDtcbiAgICAgICAgaXRlbVN0b3JlLnVwZGF0ZV91cmwgPSBwcm9wcy51cGRhdGVfdXJsO1xuICAgICAgICBpdGVtU3RvcmUuZGVsZXRlX3VybCA9IHByb3BzLmRlbGV0ZV91cmw7XG4gICAgICAgIGl0ZW1TdG9yZS5pbml0aWFsX2ZvbGRlciA9IHByb3BzLmluaXRpYWxfZm9sZGVyO1xuICAgICAgICBpdGVtU3RvcmUubGltaXQgPSBwcm9wcy5saW1pdDtcblxuICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgc3RvcmUuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtc1tpXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGdhbGxlcnkuXG4gICAgICAgIHRoaXMuc3RhdGUgPSBnZXRJdGVtU3RvcmVTdGF0ZSgpO1xuICAgICAgICB0aGlzLnN0YXRlLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50SXRlbSA9IG51bGw7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgICAgICAvLyBpZiB3ZSB3YW50IHRvIGhvb2sgaW50byBkaXJ0eSBjaGVja2luZywgd2UgbmVlZCB0byBmaW5kIGEgd2F5IG9mIHJlZnJlc2hpbmdcbiAgICAgICAgLy8gYWxsIGxvYWRlZCBkYXRhIG5vdCBqdXN0IHRoZSBmaXJzdCBwYWdlIGFnYWluLi4uXG5cbiAgICAgICAgdmFyICRjb250ZW50ID0galF1ZXJ5KCcuY21zLWNvbnRlbnQtZmllbGRzJyk7XG5cbiAgICAgICAgaWYgKCRjb250ZW50Lmxlbmd0aCkge1xuICAgICAgICAgICAgJGNvbnRlbnQub24oJ3Njcm9sbCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgkY29udGVudFswXS5zY3JvbGxIZWlnaHQgLSAkY29udGVudFswXS5zY3JvbGxUb3AgPT09ICRjb250ZW50WzBdLmNsaWVudEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBnYWxsZXJ5QWN0aW9ucy5wYWdlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgICAgICBpdGVtU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nKSB7XG4gICAgICAgICAgICBsZXQgZWRpdG9yQ29tcG9uZW50ID0gdGhpcy5nZXRFZGl0b3JDb21wb25lbnQoKTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG4gICAgICAgICAgICAgICAgICAgIHtlZGl0b3JDb21wb25lbnR9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5nZXRJdGVtQ29tcG9uZW50cygpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChpdGVtU3RvcmUuaGFzTmF2aWdhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICBidXR0b24gPSA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVOYXZpZ2F0ZS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgQmFja1xuICAgICAgICAgICAgICAgIDwvYnV0dG9uPjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG4gICAgICAgICAgICAgICAgICAgIHtidXR0b259XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5X19pdGVtcyc+XG4gICAgICAgICAgICAgICAgICAgICAgICB7aXRlbXN9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZU5hdmlnYXRlKCkge1xuICAgICAgICBsZXQgbmF2aWdhdGlvbiA9IGl0ZW1TdG9yZS5wb3BOYXZpZ2F0aW9uKCk7XG5cbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMubmF2aWdhdGUobmF2aWdhdGlvblsxXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgb25DaGFuZ2VcbiAgICAgKiBAZGVzYyBVcGRhdGVzIHRoZSBnYWxsZXJ5IHN0YXRlIHdoZW4gc29tZXRobmlnIGNoYW5nZXMgaW4gdGhlIHN0b3JlLlxuICAgICAqL1xuICAgIG9uQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKGdldEl0ZW1TdG9yZVN0YXRlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIHNldEVkaXRpbmdcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzRWRpdGluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbaWRdXG4gICAgICogQGRlc2MgU3dpdGNoZXMgYmV0d2VlbiBlZGl0aW5nIGFuZCBnYWxsZXJ5IHN0YXRlcy5cbiAgICAgKi9cbiAgICBzZXRFZGl0aW5nKGlzRWRpdGluZywgaWQpIHtcbiAgICAgICAgdmFyIG5ld1N0YXRlID0geyBlZGl0aW5nOiBpc0VkaXRpbmcgfTtcblxuICAgICAgICBpZiAoaWQgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRJdGVtID0gaXRlbVN0b3JlLmdldEJ5SWQoaWQpO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudEl0ZW0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoalF1ZXJ5LmV4dGVuZChuZXdTdGF0ZSwgeyBjdXJyZW50SXRlbTogY3VycmVudEl0ZW0gfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBnZXRFZGl0b3JDb21wb25lbnRcbiAgICAgKiBAZGVzYyBHZW5lcmF0ZXMgdGhlIGVkaXRvciBjb21wb25lbnQuXG4gICAgICovXG4gICAgZ2V0RWRpdG9yQ29tcG9uZW50KCkge1xuICAgICAgICB2YXIgcHJvcHMgPSB7fTtcblxuICAgICAgICBwcm9wcy5pdGVtID0gdGhpcy5zdGF0ZS5jdXJyZW50SXRlbTtcbiAgICAgICAgcHJvcHMuc2V0RWRpdGluZyA9IHRoaXMuc2V0RWRpdGluZy5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8RWRpdG9yIHsuLi5wcm9wc30gLz5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBnZXRJdGVtQ29tcG9uZW50c1xuICAgICAqIEBkZXNjIEdlbmVyYXRlcyB0aGUgaXRlbSBjb21wb25lbnRzIHdoaWNoIHBvcHVsYXRlIHRoZSBnYWxsZXJ5LlxuICAgICAqL1xuICAgIGdldEl0ZW1Db21wb25lbnRzKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuc3RhdGUuaXRlbXMpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHNlbGYuc3RhdGUuaXRlbXNba2V5XSxcbiAgICAgICAgICAgICAgICBwcm9wcyA9IHt9O1xuXG4gICAgICAgICAgICBwcm9wcy5pZCA9IGl0ZW0uaWQ7XG4gICAgICAgICAgICBwcm9wcy5zZXRFZGl0aW5nID0gdGhpcy5zZXRFZGl0aW5nLmJpbmQodGhpcyk7XG4gICAgICAgICAgICBwcm9wcy50aXRsZSA9IGl0ZW0udGl0bGU7XG4gICAgICAgICAgICBwcm9wcy51cmwgPSBpdGVtLnVybDtcbiAgICAgICAgICAgIHByb3BzLnR5cGUgPSBpdGVtLnR5cGU7XG4gICAgICAgICAgICBwcm9wcy5maWxlbmFtZSA9IGl0ZW0uZmlsZW5hbWU7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEl0ZW0ga2V5PXtrZXl9IHsuLi5wcm9wc30gLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FsbGVyeTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZWRpdG9yQWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZWRpdG9yQWN0aW9ucyc7XG5cbmNsYXNzIElucHV0RmllbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGlucHV0IGNsYXNzTmFtZT0ndGV4dCcgdHlwZT0ndGV4dCcgdmFsdWU9e3RoaXMucHJvcHMudmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfSAvPlxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgaGFuZGxlQ2hhbmdlXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuXHQgKiBAZGVzYyBIYW5kbGVzIHRoZSBjaGFuZ2UgZXZlbnRzIG9uIGlucHV0IGZpZWxkcy5cblx0ICovXG5cdGhhbmRsZUNoYW5nZShldmVudCkge1xuXHRcdGVkaXRvckFjdGlvbnMudXBkYXRlKHsgbmFtZTogdGhpcy5wcm9wcy5uYW1lLCB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5wdXRGaWVsZDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2dhbGxlcnlBY3Rpb25zJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxuY2xhc3MgSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBzdHlsZXMgPSB7YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyB0aGlzLnByb3BzLnVybCArICcpJ307XG5cbiAgICAgICAgdmFyIG5hdmlnYXRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgYSBmb2xkZXInKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5wcm9wcy50eXBlID09PSAnZm9sZGVyJykge1xuICAgICAgICAgICAgbmF2aWdhdGUgPSB0aGlzLmhhbmRsZU5hdmlnYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2l0ZW0nIG9uQ2xpY2s9e25hdmlnYXRlfT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naXRlbV9fdGh1bWJuYWlsJyBzdHlsZT17c3R5bGVzfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnMnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tcmVtb3ZlIFsgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkIF0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRGVsZXRlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tZWRpdCBbIGZvbnQtaWNvbi1wZW5jaWwgXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVFZGl0LmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9J2l0ZW1fX3RpdGxlJz57dGhpcy5wcm9wcy50aXRsZX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBoYW5kbGVFZGl0XG4gICAgICogQGRlc2MgRXZlbnQgaGFuZGxlciBmb3IgdGhlICdlZGl0JyBidXR0b24uXG4gICAgICovXG4gICAgaGFuZGxlRWRpdCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRFZGl0aW5nKHRydWUsIHRoaXMucHJvcHMuaWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIHRoZSAnZWRpdCcgYnV0dG9uLlxuICAgICAqL1xuICAgIGhhbmRsZU5hdmlnYXRlKCkge1xuICAgICAgICBnYWxsZXJ5QWN0aW9ucy5uYXZpZ2F0ZSh0aGlzLnByb3BzLmZpbGVuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciB0aGUgJ3JlbW92ZScgYnV0dG9uLlxuICAgICAqL1xuICAgIGhhbmRsZURlbGV0ZSgpIHtcbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMuZGVzdHJveSh0aGlzLnByb3BzLmlkKTtcbiAgICB9XG5cbn1cblxuSXRlbS5wcm9wVHlwZXMgPSB7XG4gICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgc2V0RWRpdGluZzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgdGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG4iLCJjb25zdCBDT05TVEFOVFMgPSB7XG5cdElURU1fU1RPUkU6IHtcblx0XHRDSEFOR0U6ICdjaGFuZ2UnLFxuXHRcdENSRUFURTogJ2NyZWF0ZScsXG5cdFx0VVBEQVRFOiAndXBkYXRlJyxcblx0XHRERVNUUk9ZOiAnZGVzdHJveScsXG5cdFx0TkFWSUdBVEU6ICduYXZpZ2F0ZScsXG5cdFx0UEFHRTogJ3BhZ2UnXG5cdH0sXG5cdEVESVRPUjoge1xuXHRcdENIQU5HRTogJ2NoYW5nZScsXG5cdFx0VVBEQVRFOiAndXBkYXRlJyxcblx0XHRDTEVBUjogJ2NsZWFyJ1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDT05TVEFOVFM7XG4iLCJpbXBvcnQge0Rpc3BhdGNoZXJ9IGZyb20gJ2ZsdXgnO1xuXG5sZXQgX2VkaXRvckRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpOyAvLyBTaW5nbGV0b25cblxuZXhwb3J0IGRlZmF1bHQgX2VkaXRvckRpc3BhdGNoZXI7XG4iLCJpbXBvcnQge0Rpc3BhdGNoZXJ9IGZyb20gJ2ZsdXgnO1xuXG5sZXQgX2dhbGxlcnlEaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTsgLy8gU2luZ2xldG9uXG5cbmV4cG9ydCBkZWZhdWx0IF9nYWxsZXJ5RGlzcGF0Y2hlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2FsbGVyeSBmcm9tICcuL2NvbXBvbmVudC9nYWxsZXJ5JztcblxualF1ZXJ5KCcuYXNzZXQtZ2FsbGVyeScpLmVudHdpbmUoe1xuXHQnb25hZGQnOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHByb3BzID0ge307XG5cblx0XHRwcm9wcy5uYW1lID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1uYW1lJyk7XG5cdFx0cHJvcHMuZGF0YV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRhdGEtdXJsJyk7XG5cdFx0cHJvcHMudXBkYXRlX3VybCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktdXBkYXRlLXVybCcpO1xuXHRcdHByb3BzLmRlbGV0ZV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRlbGV0ZS11cmwnKTtcblx0XHRwcm9wcy5pbml0aWFsX2ZvbGRlciA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktaW5pdGlhbC1mb2xkZXInKTtcblx0XHRwcm9wcy5saW1pdCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktbGltaXQnKTtcblxuXHRcdGlmIChwcm9wcy5uYW1lID09PSBudWxsIHx8IHByb3BzLnVybCA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdFJlYWN0LnJlbmRlcihcblx0XHRcdDxHYWxsZXJ5IHsuLi5wcm9wc30gLz4sXG5cdFx0XHR0aGlzWzBdXG5cdFx0KTtcblx0fVxufSk7XG4iLCJpbXBvcnQgZWRpdG9yRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2VkaXRvckRpc3BhdGNoZXInO1xuaW1wb3J0IGVkaXRvckFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2VkaXRvckFjdGlvbnMnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgX2ZpZWxkcyA9IFtdO1xuXG5mdW5jdGlvbiBjcmVhdGUoZGF0YSkge1xuXHR2YXIgZmllbGRFeGlzdHMgPSBfZmllbGRzLmZpbHRlcigoZmllbGQpID0+IHsgcmV0dXJuIGZpZWxkLm5hbWUgPT09IGRhdGEubmFtZTsgfSkubGVuZ3RoID4gMDtcblxuXHRpZiAoZmllbGRFeGlzdHMpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRfZmllbGRzLnB1c2goe1xuXHRcdG5hbWU6IGRhdGEubmFtZSxcblx0XHR2YWx1ZTogZGF0YS52YWx1ZVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKGRhdGEpIHtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBfZmllbGRzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0aWYgKF9maWVsZHNbaV0ubmFtZSA9PT0gZGF0YS5uYW1lKSB7XG5cdFx0XHRfZmllbGRzW2ldID0gZGF0YTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBjbGVhcigpIHtcblx0X2ZpZWxkcyA9IFtdO1xufVxuXG5jbGFzcyBFZGl0b3JTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0LyoqXG5cdCAqIEByZXR1cm4ge29iamVjdH1cblx0ICogQGRlc2MgR2V0cyB0aGUgZW50aXJlIGNvbGxlY3Rpb24gb2YgaXRlbXMuXG5cdCAqL1xuXHRnZXRBbGwoKSB7XG5cdFx0cmV0dXJuIF9maWVsZHM7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZW1pdENoYW5nZVxuXHQgKiBAZGVzYyBUcmlnZ2VyZWQgd2hlbiBzb21ldGhpbmcgY2hhbmdlcyBpbiB0aGUgc3RvcmUuXG5cdCAqL1xuXHRlbWl0Q2hhbmdlKCkge1xuXHRcdHRoaXMuZW1pdChDT05TVEFOVFMuRURJVE9SLkNIQU5HRSk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcblx0ICovXG5cdGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5vbihDT05TVEFOVFMuRURJVE9SLkNIQU5HRSwgY2FsbGJhY2spO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqL1xuXHRyZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoQ09OU1RBTlRTLkVESVRPUi5DSEFOR0UsIGNhbGxiYWNrKTtcblx0fVxuXG59XG5cbmxldCBfZWRpdG9yU3RvcmUgPSBuZXcgRWRpdG9yU3RvcmUoKTsgLy8gU2luZ2xldG9uLlxuXG5lZGl0b3JEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cblx0c3dpdGNoKHBheWxvYWQuYWN0aW9uKSB7XG5cdFx0Y2FzZSBDT05TVEFOVFMuRURJVE9SLkNSRUFURTpcblx0XHRcdGNyZWF0ZShwYXlsb2FkLmRhdGEpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9lZGl0b3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBDT05TVEFOVFMuRURJVE9SLlVQREFURTpcblx0XHRcdHVwZGF0ZShwYXlsb2FkLmRhdGEpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9lZGl0b3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBDT05TVEFOVFMuRURJVE9SLkNMRUFSOlxuXHRcdFx0Y2xlYXIoKTtcblxuXHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRfZWRpdG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRydWU7IC8vIE5vIGVycm9ycy4gTmVlZGVkIGJ5IHByb21pc2UgaW4gRGlzcGF0Y2hlci5cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF9lZGl0b3JTdG9yZTtcbiIsImltcG9ydCBnYWxsZXJ5RGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2dhbGxlcnlEaXNwYXRjaGVyJztcbmltcG9ydCBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZ2FsbGVyeUFjdGlvbnMnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgX2l0ZW1zID0gW107XG52YXIgX2ZvbGRlcnMgPSBbXTtcbnZhciBfY3VycmVudEZvbGRlciA9IG51bGw7XG5cbnZhciBfZmlsdGVycyA9IHtcblx0J3BhZ2UnOiAxLFxuXHQnbGltaXQnOiAxMFxufTtcblxuLyoqXG4gKiBAZnVuYyBjcmVhdGVcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gaXRlbURhdGFcbiAqIEBkZXNjIEFkZHMgYSBnYWxsZXJ5IGl0ZW0gdG8gdGhlIHN0b3JlLlxuICovXG5mdW5jdGlvbiBjcmVhdGUoaXRlbURhdGEpIHtcblx0dmFyIGl0ZW1FeGlzdHMgPSBfaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7IHJldHVybiBpdGVtLmlkID09PSBpdGVtRGF0YS5pZDsgfSkubGVuZ3RoID4gMDtcblxuXHRpZiAoaXRlbUV4aXN0cykge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdF9pdGVtcy5wdXNoKGl0ZW1EYXRhKTtcbn1cblxuLyoqXG4gKiBAZnVuYyBkZXN0cm95XG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtpbnR9IGlkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICogQGRlc2MgUmVtb3ZlcyBhIGdhbGxlcnkgaXRlbSBmcm9tIHRoZSBzdG9yZS5cbiAqL1xuZnVuY3Rpb24gZGVzdHJveShpZCwgY2FsbGJhY2spIHtcblx0alF1ZXJ5LmFqYXgoeyAvLyBAdG9kbyBmaXggdGhpcyBqdW5rXG5cdFx0J3VybCc6IF9pdGVtU3RvcmUuZGVsZXRlX3VybCxcblx0XHQnZGF0YSc6IHtcblx0XHRcdCdpZCc6IGlkXG5cdFx0fSxcblx0XHQnZGF0YVR5cGUnOiAnanNvbicsXG5cdFx0J21ldGhvZCc6ICdHRVQnLFxuXHRcdCdzdWNjZXNzJzogKGRhdGEpID0+IHtcblx0XHRcdHZhciBpdGVtSW5kZXggPSAtMTtcblxuXHRcdFx0Ly8gR2V0IHRoZSBpbmRleCBvZiB0aGUgaXRlbSB3ZSBoYXZlIGRlbGV0ZWRcblx0XHRcdC8vIHNvIGl0IGNhbiBiZSByZW1vdmVkIGZyb20gdGhlIHN0b3JlLlxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBfaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdFx0aWYgKF9pdGVtc1tpXS5pZCA9PT0gaWQpIHtcblx0XHRcdFx0XHRpdGVtSW5kZXggPSBpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpdGVtSW5kZXggPT09IC0xKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0X2l0ZW1zLnNwbGljZShpdGVtSW5kZXgsIDEpO1xuXG5cdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdH1cblx0fSk7XG59XG5cbi8qKlxuICogTmF2aWdhdGVzIHRvIGEgbmV3IGZvbGRlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb2xkZXJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIG5hdmlnYXRlKGZvbGRlciwgY2FsbGJhY2spIHtcblx0X2ZpbHRlcnMucGFnZSA9IDE7XG5cdF9maWx0ZXJzLmZvbGRlciA9IGZvbGRlcjtcblxuXHRqUXVlcnkuYWpheCh7XG5cdFx0J3VybCc6IF9pdGVtU3RvcmUuZGF0YV91cmwsXG5cdFx0J2RhdGFUeXBlJzogJ2pzb24nLFxuXHRcdCdkYXRhJzoge1xuXHRcdFx0J2ZvbGRlcic6IF9maWx0ZXJzLmZvbGRlcixcblx0XHRcdCdwYWdlJzogX2ZpbHRlcnMucGFnZSsrLFxuXHRcdFx0J2xpbWl0JzogX2l0ZW1TdG9yZS5saW1pdFxuXHRcdH0sXG5cdFx0J3N1Y2Nlc3MnOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRfaXRlbXMgPSBbXTtcblxuXHRcdFx0X2ZpbHRlcnMuY291bnQgPSBkYXRhLmNvdW50O1xuXG5cdFx0XHRpZiAoZm9sZGVyICE9PSBfaXRlbVN0b3JlLmluaXRpYWxfZm9sZGVyKSB7XG5cdFx0XHRcdF9mb2xkZXJzLnB1c2goW2ZvbGRlciwgX2N1cnJlbnRGb2xkZXIgfHwgX2l0ZW1TdG9yZS5pbml0aWFsX2ZvbGRlcl0pO1xuXHRcdFx0fVxuXG5cdFx0XHRfY3VycmVudEZvbGRlciA9IGZvbGRlcjtcblxuXHRcdFx0ZGF0YS5maWxlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtLCB0cnVlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdH1cblx0fSlcbn1cblxuZnVuY3Rpb24gcGFnZShjYWxsYmFjaykge1xuXHRpZiAoX2l0ZW1zLmxlbmd0aCA8IF9maWx0ZXJzLmNvdW50KSB7XG5cdFx0alF1ZXJ5LmFqYXgoe1xuXHRcdFx0J3VybCc6IF9pdGVtU3RvcmUuZGF0YV91cmwsXG5cdFx0XHQnZGF0YVR5cGUnOiAnanNvbicsXG5cdFx0XHQnZGF0YSc6IHtcblx0XHRcdFx0J2ZvbGRlcic6IF9maWx0ZXJzLmZvbGRlcixcblx0XHRcdFx0J3BhZ2UnOiBfZmlsdGVycy5wYWdlKyssXG5cdFx0XHRcdCdsaW1pdCc6IF9pdGVtU3RvcmUubGltaXRcblx0XHRcdH0sXG5cdFx0XHQnc3VjY2Vzcyc6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0ZGF0YS5maWxlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdFx0Z2FsbGVyeUFjdGlvbnMuY3JlYXRlKGl0ZW0sIHRydWUpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cblxuLyoqXG4gKiBAZnVuYyB1cGRhdGVcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtRGF0YVxuICogQGRlc2MgVXBkYXRlcyBhbiBpdGVtIGluIHRoZSBzdG9yZS5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlKGlkLCBpdGVtRGF0YSkge1xuXHQvLyBUT0RPOlxufVxuXG5jbGFzcyBJdGVtU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGdhbGxlcnkgaGFzIGJlZW4gbmF2aWdhdGVkLlxuXHQgKi9cblx0aGFzTmF2aWdhdGVkKCkge1xuXHRcdHJldHVybiBfZm9sZGVycy5sZW5ndGggPiAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGZvbGRlciBzdGFjay5cblx0ICovXG5cdHBvcE5hdmlnYXRpb24oKSB7XG5cdFx0cmV0dXJuIF9mb2xkZXJzLnBvcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4ge29iamVjdH1cblx0ICogQGRlc2MgR2V0cyB0aGUgZW50aXJlIGNvbGxlY3Rpb24gb2YgaXRlbXMuXG5cdCAqL1xuXHRnZXRBbGwoKSB7XG5cdFx0cmV0dXJuIF9pdGVtcztcblx0fVxuXG5cdC8qKlxuXHQgKiBAZnVuYyBnZXRCeUlkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuXHQgKiBAcmV0dXJuIHtvYmplY3R9XG5cdCAqL1xuXHRnZXRCeUlkKGlkKSB7XG5cdFx0dmFyIGl0ZW0gPSBudWxsO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBfaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGlmIChfaXRlbXNbaV0uaWQgPT09IGlkKSB7XG5cdFx0XHRcdGl0ZW0gPSBfaXRlbXNbaV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBpdGVtO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIGVtaXRDaGFuZ2Vcblx0ICogQGRlc2MgVHJpZ2dlcmVkIHdoZW4gc29tZXRoaW5nIGNoYW5nZXMgaW4gdGhlIHN0b3JlLlxuXHQgKi9cblx0ZW1pdENoYW5nZSgpIHtcblx0XHR0aGlzLmVtaXQoQ09OU1RBTlRTLklURU1fU1RPUkUuQ0hBTkdFKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKi9cblx0YWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcblx0XHR0aGlzLm9uKENPTlNUQU5UUy5JVEVNX1NUT1JFLkNIQU5HRSwgY2FsbGJhY2spO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqL1xuXHRyZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoQ09OU1RBTlRTLklURU1fU1RPUkUuQ0hBTkdFLCBjYWxsYmFjayk7XG5cdH1cbn1cblxubGV0IF9pdGVtU3RvcmUgPSBuZXcgSXRlbVN0b3JlKCk7IC8vIFNpbmdsZXRvblxuXG5nYWxsZXJ5RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbiAocGF5bG9hZCkge1xuXHRzd2l0Y2gocGF5bG9hZC5hY3Rpb24pIHtcblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLkNSRUFURTpcblx0XHRcdGNyZWF0ZShwYXlsb2FkLmRhdGEpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuREVTVFJPWTpcblx0XHRcdGRlc3Ryb3kocGF5bG9hZC5kYXRhLmlkLCAoKSA9PiB7XG5cdFx0XHRcdGlmICghcGF5bG9hZC5zaWxlbnQpIHtcblx0XHRcdFx0XHRfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBDT05TVEFOVFMuSVRFTV9TVE9SRS5OQVZJR0FURTpcblx0XHRcdG5hdmlnYXRlKHBheWxvYWQuZGF0YS5mb2xkZXIsICgpID0+IHtcblx0XHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLlVQREFURTpcblx0XHRcdHVwZGF0ZShwYXlsb2FkLmRhdGEuaWQsIHBheWxvYWQuZGF0YS51cGRhdGVzKTtcblxuXHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLlBBR0U6XG5cdFx0XHRwYWdlKCgpID0+IHtcblx0XHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTsgLy8gTm8gZXJyb3JzLiBOZWVkZWQgYnkgcHJvbWlzZSBpbiBEaXNwYXRjaGVyLlxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF9pdGVtU3RvcmU7XG4iXX0=

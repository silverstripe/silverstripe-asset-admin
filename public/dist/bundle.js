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
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes += ' ' + arg;
			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],3:[function(require,module,exports){
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

},{"../constants":9,"../dispatcher/editorDispatcher":10}],4:[function(require,module,exports){
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
	},

	/**
  * Sorts the items in the gallery.
  *
  * @param {bool} silent
  */
	sort: function sort(name, silent) {
		_dispatcherGalleryDispatcher2['default'].dispatch({
			action: _constants2['default'].ITEM_STORE.SORT,
			data: {
				'name': name
			},
			silent: silent
		});
	}
};

exports['default'] = galleryActions;
module.exports = exports['default'];

},{"../constants":9,"../dispatcher/galleryDispatcher":11}],5:[function(require,module,exports){
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

},{"../action/editorActions":3,"../store/editorStore":13,"./inputField":7,"react":"react"}],6:[function(require,module,exports){
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
            limit: props.limit,
            filter_folder: props.filter_folder,
            filter_name: props.filter_name,
            filter_type: props.filter_type,
            filter_created_from: props.filter_created_from,
            filter_created_to: props.filter_created_to
        });

        // Populate the store.
        if (items && items.length > 0) {
            for (var i = 0; i < items.length; i += 1) {
                _actionGalleryActions2['default'].create(items[i], true);
            }
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
                            className: 'ss-ui-button ui-corner-all font-icon-level-up',
                            onClick: this.handleNavigate.bind(this) },
                        'Back'
                    );
                }

                var sorts = _react2['default'].createElement(
                    'div',
                    null,
                    _react2['default'].createElement(
                        'a',
                        { onClick: this.handleSortTitle.bind(this) },
                        'sort by name'
                    ),
                    _react2['default'].createElement(
                        'a',
                        { onClick: this.handleSortCreated.bind(this) },
                        'sort by created'
                    ),
                    _react2['default'].createElement(
                        'a',
                        { onClick: this.handleSortType.bind(this) },
                        'sort by type'
                    )
                );

                return _react2['default'].createElement(
                    'div',
                    { className: 'gallery' },
                    button,
                    sorts,
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
    }, {
        key: 'handleSortTitle',
        value: function handleSortTitle() {
            _actionGalleryActions2['default'].sort("title");
        }
    }, {
        key: 'handleSortCreated',
        value: function handleSortCreated() {
            _actionGalleryActions2['default'].sort("created");
        }
    }, {
        key: 'handleSortType',
        value: function handleSortType() {
            _actionGalleryActions2['default'].sort("type");
        }

        /**
         * @func onChange
         * @desc Updates the gallery state when something changes in the store.
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

},{"../action/galleryActions":4,"../store/itemStore":14,"./editor":5,"./item":8,"jquery":"jquery","react":"react"}],7:[function(require,module,exports){
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

},{"../action/editorActions":3,"react":"react"}],8:[function(require,module,exports){
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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Item = (function (_React$Component) {
    _inherits(Item, _React$Component);

    function Item() {
        _classCallCheck(this, Item);

        _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Item, [{
        key: 'render',
        value: function render() {
            var styles = this.getImageURL(),
                thumbnailClassNames = 'item__thumbnail',
                itemClassNames = (0, _classnames2['default'])({
                'item': true,
                'folder': this.props.type === 'folder'
            });

            if (this.imageLargerThanThumbnail()) {
                thumbnailClassNames += ' large';
            }

            var navigate = function navigate() {};

            if (this.props.type === 'folder') {
                navigate = this.handleNavigate.bind(this);
            }

            return _react2['default'].createElement(
                'div',
                { className: itemClassNames + ' ' + this.props.type, onClick: navigate },
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
         * @func getImageURL
         * @desc Return the URL of the image, determined by it's type. 
         */
    }, {
        key: 'getImageURL',
        value: function getImageURL() {
            if (this.props.type.toLowerCase().indexOf('image') > -1) {
                return { backgroundImage: 'url(' + this.props.url + ')' };
            } else {
                return {};
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
    type: _react2['default'].PropTypes.string,
    url: _react2['default'].PropTypes.string
};

exports['default'] = Item;
module.exports = exports['default'];

},{"../action/galleryActions":4,"../constants":9,"classnames":2,"react":"react"}],9:[function(require,module,exports){
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
		PAGE: 'page',
		SORT: 'sort'
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

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _flux = require('flux');

var _editorDispatcher = new _flux.Dispatcher(); // Singleton

exports['default'] = _editorDispatcher;
module.exports = exports['default'];

},{"flux":"flux"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _flux = require('flux');

var _galleryDispatcher = new _flux.Dispatcher(); // Singleton

exports['default'] = _galleryDispatcher;
module.exports = exports['default'];

},{"flux":"flux"}],12:[function(require,module,exports){
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

		props.filter_name = this[0].getAttribute('data-asset-gallery-filter-name');
		props.filter_type = this[0].getAttribute('data-asset-gallery-filter-type');
		props.filter_created_from = this[0].getAttribute('data-asset-gallery-filter-created-from');
		props.filter_created_to = this[0].getAttribute('data-asset-gallery-filter-created-to');
		props.filter_folder = this[0].getAttribute('data-asset-gallery-filter-folder');

		if (props.name === null || props.url === null) {
			return;
		}

		_react2['default'].render(_react2['default'].createElement(_componentGallery2['default'], props), this[0]);
	}
});

},{"./component/gallery":6,"jquery":"jquery","react":"react"}],13:[function(require,module,exports){
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

},{"../action/editorActions":3,"../constants":9,"../dispatcher/editorDispatcher":10,"events":1}],14:[function(require,module,exports){
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

/**
 * @func init
 * @private
 * @param {object} data
 * @desc Sets properties on the store.
 */
function init(data) {
	_itemStore.page = 1;
	_itemStore.limit = 10;
	_itemStore.sort = 'title';
	_itemStore.direction = 'asc';

	if (data.filter_folder && data.initial_folder && data.filter_folder !== data.initial_folder) {
		_folders.push([data.filter_folder, data.initial_folder]);
	}

	Object.keys(data).map(function (key) {
		_itemStore[key] = data[key];
	});
}

function sort(name, callback) {
	if (_itemStore.sort.toLowerCase() == name.toLowerCase()) {
		if (_itemStore.direction.toLowerCase() == 'asc') {
			_itemStore.direction = 'desc';
		} else {
			_itemStore.direction = 'asc';
		}
	} else {
		_itemStore.sort = name.toLowerCase();
		_itemStore.direction = 'asc';
	}

	callback && callback();
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
	_itemStore.page = 1;
	_itemStore.filter_folder = folder;

	var data = {
		'page': _itemStore.page++,
		'limit': _itemStore.limit
	};

	['filter_folder', 'filter_name', 'filter_type', 'filter_created_from', 'filter_created_to'].forEach(function (type) {
		if (_itemStore[type]) {
			data[type] = _itemStore[type];
		}
	});

	_jquery2['default'].ajax({
		'url': _itemStore.data_url,
		'dataType': 'json',
		'data': data,
		'success': function success(data) {
			_items = [];

			_itemStore.count = data.count;

			var $search = (0, _jquery2['default'])('.cms-search-form');

			if ($search.find('[type=hidden][name="q[Folder]"]').length == 0) {
				$search.append('<input type="hidden" name="q[Folder]" />');
			}

			if (folder.substr(-1) === '/') {
				folder = folder.substr(0, folder.length - 1);
			}

			$search.find('[type=hidden][name="q[Folder]"]').val(encodeURIComponent(folder));

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
	if (_items.length < _itemStore.count) {
		(function () {
			var data = {
				'page': _itemStore.page++,
				'limit': _itemStore.limit
			};

			['filter_folder', 'filter_name', 'filter_type', 'filter_created_from', 'filter_created_to'].forEach(function (type) {
				if (_itemStore[type]) {
					data[type] = _itemStore[type];
				}
			});

			_jquery2['default'].ajax({
				'url': _itemStore.data_url,
				'dataType': 'json',
				'data': data,
				'success': function success(data) {
					data.files.forEach(function (item) {
						_actionGalleryActions2['default'].create(item, true);
					});

					callback && callback();
				}
			});
		})();
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
			return _items.sort(function (a, b) {
				var sort = _itemStore.sort.toLowerCase();
				var direction = _itemStore.direction.toLowerCase();

				if (direction == 'asc') {
					if (a[sort] < b[sort]) {
						return -1;
					}

					if (a[sort] > b[sort]) {
						return 1;
					}

					return 0;
				}

				if (a[sort] > b[sort]) {
					return -1;
				}

				if (a[sort] < b[sort]) {
					return 1;
				}

				return 0;
			});
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

		case _constants2['default'].ITEM_STORE.SORT:
			sort(payload.data.name, function () {
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

},{"../action/galleryActions":4,"../constants":9,"../dispatcher/galleryDispatcher":11,"events":1,"jquery":"jquery"}]},{},[12])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9hY3Rpb24vZWRpdG9yQWN0aW9ucy5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvYWN0aW9uL2dhbGxlcnlBY3Rpb25zLmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZWRpdG9yLmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZ2FsbGVyeS5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2lucHV0RmllbGQuanMiLCIvVXNlcnMvQ2hyaXN0b3BoZXIvU291cmNlL2Fzc2VydGNocmlzL3NpbHZlcnN0cmlwZS13b3JrYmVuY2gvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9pdGVtLmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb25zdGFudHMuanMiLCIvVXNlcnMvQ2hyaXN0b3BoZXIvU291cmNlL2Fzc2VydGNocmlzL3NpbHZlcnN0cmlwZS13b3JrYmVuY2gvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2Rpc3BhdGNoZXIvZWRpdG9yRGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvc3RvcmUvZWRpdG9yU3RvcmUuanMiLCIvVXNlcnMvQ2hyaXN0b3BoZXIvU291cmNlL2Fzc2VydGNocmlzL3NpbHZlcnN0cmlwZS13b3JrYmVuY2gvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL3N0b3JlL2l0ZW1TdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OzBDQ2hENkIsZ0NBQWdDOzs7O3lCQUN2QyxjQUFjOzs7O0FBRXBDLElBQUksYUFBYSxHQUFHOztBQUVuQixPQUFNLEVBQUEsZ0JBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUNwQiwwQ0FBaUIsUUFBUSxDQUFDO0FBQ3pCLFNBQU0sRUFBRSx1QkFBVSxNQUFNLENBQUMsTUFBTTtBQUMvQixPQUFJLEVBQUUsSUFBSTtBQUNWLFNBQU0sRUFBRSxNQUFNO0dBQ2QsQ0FBQyxDQUFDO0VBQ0g7O0FBRUQsT0FBTSxFQUFBLGdCQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDcEIsMENBQWlCLFFBQVEsQ0FBQztBQUN6QixTQUFNLEVBQUUsdUJBQVUsTUFBTSxDQUFDLE1BQU07QUFDL0IsT0FBSSxFQUFFLElBQUk7QUFDVixTQUFNLEVBQUUsTUFBTTtHQUNkLENBQUMsQ0FBQztFQUNIOztBQUVELE1BQUssRUFBQSxlQUFDLE1BQU0sRUFBRTtBQUNiLDBDQUFpQixRQUFRLENBQUM7QUFDekIsU0FBTSxFQUFFLHVCQUFVLE1BQU0sQ0FBQyxLQUFLO0FBQzlCLFNBQU0sRUFBRSxNQUFNO0dBQ2QsQ0FBQyxDQUFDO0VBQ0g7O0NBRUQsQ0FBQTs7cUJBRWMsYUFBYTs7Ozs7Ozs7Ozs7OzJDQzlCRSxpQ0FBaUM7Ozs7eUJBQ3pDLGNBQWM7Ozs7QUFFcEMsSUFBSSxjQUFjLEdBQUc7Ozs7OztBQU1wQixjQUFhLEVBQUEsdUJBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUMzQiwyQ0FBa0IsUUFBUSxDQUFDO0FBQzFCLFNBQU0sRUFBRSx1QkFBVSxVQUFVLENBQUMsSUFBSTtBQUNqQyxPQUFJLEVBQUUsSUFBSTtBQUNWLFNBQU0sRUFBRSxNQUFNO0dBQ2QsQ0FBQyxDQUFDO0VBQ0g7Ozs7Ozs7QUFPRCxPQUFNLEVBQUEsZ0JBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUNwQiwyQ0FBa0IsUUFBUSxDQUFDO0FBQzFCLFNBQU0sRUFBRSx1QkFBVSxVQUFVLENBQUMsTUFBTTtBQUNuQyxPQUFJLEVBQUUsSUFBSTtBQUNWLFNBQU0sRUFBRSxNQUFNO0dBQ2QsQ0FBQyxDQUFDO0VBQ0g7Ozs7Ozs7OztBQVNELFFBQU8sRUFBQSxpQkFBQyxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ25CLDJDQUFrQixRQUFRLENBQUM7QUFDMUIsU0FBTSxFQUFFLHVCQUFVLFVBQVUsQ0FBQyxPQUFPO0FBQ3BDLE9BQUksRUFBRTtBQUNMLE1BQUUsRUFBRSxFQUFFO0lBQ047QUFDRCxTQUFNLEVBQUUsTUFBTTtHQUNkLENBQUMsQ0FBQztFQUNIOzs7Ozs7OztBQVFELE9BQU0sRUFBQSxnQkFBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMzQiwyQ0FBa0IsUUFBUSxDQUFDO0FBQzFCLFNBQU0sRUFBRSx1QkFBVSxVQUFVLENBQUMsTUFBTTtBQUNuQyxPQUFJLEVBQUU7QUFDTCxNQUFFLEVBQUUsRUFBRTtBQUNOLFdBQU8sRUFBRSxPQUFPO0lBQ2hCO0FBQ0QsU0FBTSxFQUFFLE1BQU07R0FDZCxDQUFDLENBQUM7RUFDSDs7Ozs7Ozs7QUFRRCxTQUFRLEVBQUEsa0JBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUN4QiwyQ0FBa0IsUUFBUSxDQUFDO0FBQzFCLFNBQU0sRUFBRSx1QkFBVSxVQUFVLENBQUMsUUFBUTtBQUNyQyxPQUFJLEVBQUU7QUFDTCxZQUFRLEVBQUUsTUFBTTtJQUNoQjtBQUNELFNBQU0sRUFBRSxNQUFNO0dBQ2QsQ0FBQyxDQUFDO0VBQ0g7Ozs7Ozs7QUFPRCxLQUFJLEVBQUEsY0FBQyxNQUFNLEVBQUU7QUFDWiwyQ0FBa0IsUUFBUSxDQUFDO0FBQzFCLFNBQU0sRUFBRSx1QkFBVSxVQUFVLENBQUMsSUFBSTtBQUNqQyxTQUFNLEVBQUUsTUFBTTtHQUNkLENBQUMsQ0FBQztFQUNIOzs7Ozs7O0FBT0QsS0FBSSxFQUFBLGNBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUNsQiwyQ0FBa0IsUUFBUSxDQUFDO0FBQzFCLFNBQU0sRUFBRSx1QkFBVSxVQUFVLENBQUMsSUFBSTtBQUNqQyxPQUFJLEVBQUU7QUFDTCxVQUFNLEVBQUUsSUFBSTtJQUNaO0FBQ0QsU0FBTSxFQUFFLE1BQU07R0FDZCxDQUFDLENBQUM7RUFDSDtDQUNELENBQUM7O3FCQUVhLGNBQWM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQzVHWCxPQUFPOzs7OzBCQUNGLGNBQWM7Ozs7bUNBQ1gseUJBQXlCOzs7O2dDQUMzQixzQkFBc0I7Ozs7Ozs7Ozs7QUFROUMsU0FBUyxtQkFBbUIsR0FBRztBQUMzQixXQUFPO0FBQ0gsY0FBTSxFQUFFLDhCQUFZLE1BQU0sRUFBRTtLQUMvQixDQUFDO0NBQ0w7Ozs7Ozs7SUFNSyxNQUFNO2NBQU4sTUFBTTs7QUFFRyxhQUZULE1BQU0sQ0FFSSxLQUFLLEVBQUU7OEJBRmpCLE1BQU07O0FBR0osbUNBSEYsTUFBTSw2Q0FHRSxLQUFLLEVBQUU7OztBQUdiLFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7OztBQUd6Qyx5Q0FBYyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZFLHlDQUFjLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRTdFLFlBQUksQ0FBQyxLQUFLLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztLQUN0Qzs7aUJBYkMsTUFBTTs7ZUFlVSw2QkFBRztBQUNqQiwwQ0FBWSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDaEQ7OztlQUVvQixnQ0FBRztBQUNwQiwwQ0FBWSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbkQ7OztlQUVLLGtCQUFHO0FBQ0wsZ0JBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDOztBQUUvQyxtQkFDSTs7a0JBQUssU0FBUyxFQUFDLFFBQVE7Z0JBQ25COzs7QUFDSSw0QkFBSSxFQUFDLFFBQVE7QUFDYixpQ0FBUyxFQUFDLCtDQUErQztBQUN6RCwrQkFBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDOztpQkFFM0I7Z0JBQ2I7OztvQkFDSTs7MEJBQUssU0FBUyxFQUFDLGdEQUFnRDt3QkFDM0Q7OzhCQUFLLFNBQVMsRUFBQyx3REFBd0Q7NEJBQ25FLDBDQUFLLFNBQVMsRUFBQyxtQkFBbUIsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxBQUFDLEdBQUc7eUJBQzdEO3dCQUNOOzs4QkFBSyxTQUFTLEVBQUMscURBQXFEOzRCQUNoRTs7a0NBQUssU0FBUyxFQUFDLGtDQUFrQztnQ0FDN0M7O3NDQUFLLFNBQVMsRUFBQyxnQkFBZ0I7b0NBQzNCOzswQ0FBTyxTQUFTLEVBQUMsTUFBTTs7cUNBQW1CO29DQUMxQzs7MENBQUssU0FBUyxFQUFDLGNBQWM7d0NBQ3pCOzs4Q0FBTSxTQUFTLEVBQUMsVUFBVTs0Q0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJO3lDQUFRO3FDQUN0RDtpQ0FDSjs2QkFDSjs0QkFDTjs7a0NBQUssU0FBUyxFQUFDLGdCQUFnQjtnQ0FDM0I7O3NDQUFPLFNBQVMsRUFBQyxNQUFNOztpQ0FBbUI7Z0NBQzFDOztzQ0FBSyxTQUFTLEVBQUMsY0FBYztvQ0FDekI7OzBDQUFNLFNBQVMsRUFBQyxVQUFVO3dDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7cUNBQVE7aUNBQ3REOzZCQUNKOzRCQUNOOztrQ0FBSyxTQUFTLEVBQUMsZ0JBQWdCO2dDQUMzQjs7c0NBQU8sU0FBUyxFQUFDLE1BQU07O2lDQUFhO2dDQUNwQzs7c0NBQUssU0FBUyxFQUFDLGNBQWM7b0NBQ3pCOzswQ0FBTSxTQUFTLEVBQUMsVUFBVTt3Q0FDdEI7OzhDQUFHLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEFBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUTs0Q0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHO3lDQUFLO3FDQUNwRTtpQ0FDTDs2QkFDSjs0QkFDTjs7a0NBQUssU0FBUyxFQUFDLDhCQUE4QjtnQ0FDekM7O3NDQUFPLFNBQVMsRUFBQyxNQUFNOztpQ0FBd0I7Z0NBQy9DOztzQ0FBSyxTQUFTLEVBQUMsY0FBYztvQ0FDekI7OzBDQUFNLFNBQVMsRUFBQyxVQUFVO3dDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87cUNBQVE7aUNBQ3pEOzZCQUNKOzRCQUNOOztrQ0FBSyxTQUFTLEVBQUMsOEJBQThCO2dDQUN6Qzs7c0NBQU8sU0FBUyxFQUFDLE1BQU07O2lDQUFzQjtnQ0FDN0M7O3NDQUFLLFNBQVMsRUFBQyxjQUFjO29DQUN6Qjs7MENBQU0sU0FBUyxFQUFDLFVBQVU7d0NBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVztxQ0FBUTtpQ0FDN0Q7NkJBQ0o7NEJBQ047O2tDQUFLLFNBQVMsRUFBQyxnQkFBZ0I7Z0NBQzNCOztzQ0FBTyxTQUFTLEVBQUMsTUFBTTs7aUNBQW9CO2dDQUMzQzs7c0NBQUssU0FBUyxFQUFDLGNBQWM7b0NBQ3pCOzswQ0FBTSxTQUFTLEVBQUMsVUFBVTt3Q0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUs7O3dDQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTTs7cUNBQVU7aUNBQ2hJOzZCQUNKO3lCQUNKO3FCQUNKO29CQUVMLFVBQVU7b0JBRVg7Ozt3QkFDSTs7OEJBQVEsSUFBSSxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsaURBQWlEOzt5QkFBYzt3QkFDL0Y7OzhCQUFRLElBQUksRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLHFEQUFxRCxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQzs7eUJBQWlCO3FCQUMzSTtpQkFDSDthQUNMLENBQ1I7U0FDTDs7Ozs7Ozs7ZUFNcUIsa0NBQUc7OztBQUNyQixtQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQy9DLG9CQUFJLEtBQUssR0FBRyxNQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRW5DLHVCQUNJOztzQkFBSyxTQUFTLEVBQUMsWUFBWSxFQUFDLEdBQUcsRUFBRSxHQUFHLEFBQUM7b0JBQ2pDOzswQkFBTyxTQUFTLEVBQUMsTUFBTTt3QkFBRSxLQUFLLENBQUMsSUFBSTtxQkFBUztvQkFDNUM7OzBCQUFLLFNBQVMsRUFBQyxjQUFjO3dCQUN6Qiw0REFBWSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQUFBQyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxBQUFDLEdBQUc7cUJBQ2xEO2lCQUNKLENBQ1Q7YUFDSixDQUFDLENBQUM7U0FDTjs7Ozs7Ozs7ZUFNTyxvQkFBRztBQUNQLGdCQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztTQUN4Qzs7Ozs7Ozs7ZUFNUyxzQkFBRztBQUNULDZDQUFjLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQixnQkFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDaEM7Ozs7Ozs7O2VBTVMsc0JBQUcsRUFFWjs7Ozs7Ozs7QUFBQTs7O2VBT1csd0JBQUc7QUFDWCw2Q0FBYyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ3RFLDZDQUFjLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDL0U7OztXQWxKQyxNQUFNO0dBQVMsbUJBQU0sU0FBUzs7QUFzSnBDLE1BQU0sQ0FBQyxTQUFTLEdBQUc7QUFDZixRQUFJLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDNUIsY0FBVSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0NBQ25DLENBQUM7O3FCQUVhLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJDaExILE9BQU87Ozs7c0JBQ1gsUUFBUTs7OztzQkFDSCxVQUFVOzs7O29CQUNaLFFBQVE7Ozs7b0NBQ0UsMEJBQTBCOzs7OzhCQUMvQixvQkFBb0I7Ozs7Ozs7Ozs7QUFRMUMsU0FBUyxpQkFBaUIsR0FBRztBQUN6QixXQUFPO0FBQ0gsYUFBSyxFQUFFLDRCQUFVLE1BQU0sRUFBRTtLQUM1QixDQUFDO0NBQ0w7O0lBRUssT0FBTztjQUFQLE9BQU87O0FBRUUsYUFGVCxPQUFPLENBRUcsS0FBSyxFQUFFOzhCQUZqQixPQUFPOztBQUdMLG1DQUhGLE9BQU8sNkNBR0MsS0FBSyxFQUFFOztBQUViLFlBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7QUFHckQsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekMsMENBQWUsYUFBYSxDQUFDO0FBQ3pCLG9CQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7QUFDeEIsc0JBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtBQUM1QixzQkFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO0FBQzVCLDBCQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7QUFDcEMsaUJBQUssRUFBRSxLQUFLLENBQUMsS0FBSztBQUNsQix5QkFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO0FBQ2xDLHVCQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7QUFDOUIsdUJBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztBQUM5QiwrQkFBbUIsRUFBRSxLQUFLLENBQUMsbUJBQW1CO0FBQzlDLDZCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7U0FDN0MsQ0FBQyxDQUFDOzs7QUFHSCxZQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMzQixpQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN0QyxrREFBZSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3pDO1NBQ0o7OztBQUdELFlBQUksQ0FBQyxLQUFLLEdBQUcsb0JBQUUsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ3JGOztpQkFoQ0MsT0FBTzs7ZUFrQ1MsNkJBQUc7Ozs7O0FBS2pCLGdCQUFJLFFBQVEsR0FBRyx5QkFBRSxxQkFBcUIsQ0FBQyxDQUFDOztBQUV4QyxnQkFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ2pCLHdCQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBSztBQUM3Qix3QkFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRTtBQUMvRSwwREFBZSxJQUFJLEVBQUUsQ0FBQztxQkFDekI7aUJBQ0osQ0FBQyxDQUFDO2FBQ047O0FBRUQsd0NBQVUsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzlDOzs7ZUFFb0IsZ0NBQUc7QUFDcEIsd0NBQVUsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2pEOzs7ZUFFSyxrQkFBRztBQUNMLGdCQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3BCLG9CQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs7QUFFaEQsdUJBQ0k7O3NCQUFLLFNBQVMsRUFBQyxTQUFTO29CQUNuQixlQUFlO2lCQUNkLENBQ1I7YUFDTCxNQUFNO0FBQ0gsb0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3JDLG9CQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRWxCLG9CQUFJLDRCQUFVLFlBQVksRUFBRSxFQUFFO0FBQzFCLDBCQUFNLEdBQUc7OztBQUNMLGdDQUFJLEVBQUMsUUFBUTtBQUNiLHFDQUFTLEVBQUMsK0NBQStDO0FBQ3pELG1DQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUM7O3FCQUVuQyxDQUFDO2lCQUNiOztBQUVELG9CQUFJLEtBQUssR0FBRzs7O29CQUNSOzswQkFBRyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUM7O3FCQUV4QztvQkFDSjs7MEJBQUcsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUM7O3FCQUUxQztvQkFDSjs7MEJBQUcsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDOztxQkFFdkM7aUJBQ0YsQ0FBQzs7QUFFUCx1QkFDSTs7c0JBQUssU0FBUyxFQUFDLFNBQVM7b0JBQ25CLE1BQU07b0JBQ04sS0FBSztvQkFDTjs7MEJBQUssU0FBUyxFQUFDLGdCQUFnQjt3QkFDMUIsS0FBSztxQkFDSjtpQkFDSixDQUNSO2FBQ0w7U0FDSjs7O2VBRWEsMEJBQUc7QUFDYixnQkFBSSxVQUFVLEdBQUcsNEJBQVUsYUFBYSxFQUFFLENBQUM7O0FBRTNDLDhDQUFlLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxQzs7O2VBRWMsMkJBQUc7QUFDZCw4Q0FBZSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEM7OztlQUVnQiw2QkFBRztBQUNoQiw4Q0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDbEM7OztlQUVhLDBCQUFHO0FBQ2IsOENBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9COzs7Ozs7OztlQU1PLG9CQUFHO0FBQ1AsZ0JBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1NBQ3RDOzs7Ozs7Ozs7O2VBUVMsb0JBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRTtBQUN0QixnQkFBSSxRQUFRLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUM7O0FBRXRDLGdCQUFJLEVBQUUsS0FBSyxLQUFLLENBQUMsRUFBRTtBQUNmLG9CQUFJLFdBQVcsR0FBRyw0QkFBVSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRXhDLG9CQUFJLFdBQVcsS0FBSyxLQUFLLENBQUMsRUFBRTtBQUN4Qix3QkFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDbkU7YUFDSixNQUFNO0FBQ0gsb0JBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDM0I7U0FDSjs7Ozs7Ozs7ZUFNaUIsOEJBQUc7QUFDakIsZ0JBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFZixpQkFBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUNwQyxpQkFBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFOUMsbUJBQ0ksc0RBQVksS0FBSyxDQUFJLENBQ3ZCO1NBQ0w7Ozs7Ozs7O2VBTWdCLDZCQUFHOzs7QUFDaEIsZ0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsbUJBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUM5QyxvQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO29CQUM1QixLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVmLHFCQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDbkMscUJBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNuQixxQkFBSyxDQUFDLFVBQVUsR0FBRyxNQUFLLFVBQVUsQ0FBQyxJQUFJLE9BQU0sQ0FBQztBQUM5QyxxQkFBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3pCLHFCQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDckIscUJBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QixxQkFBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOztBQUUvQix1QkFDSSwrREFBTSxHQUFHLEVBQUUsR0FBRyxBQUFDLElBQUssS0FBSyxFQUFJLENBQy9CO2FBQ0wsQ0FBQyxDQUFDO1NBQ047OztXQTFMQyxPQUFPO0dBQVMsbUJBQU0sU0FBUzs7cUJBNkx0QixPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkNoTkosT0FBTzs7OzttQ0FDQyx5QkFBeUI7Ozs7SUFFN0MsVUFBVTtXQUFWLFVBQVU7O1VBQVYsVUFBVTt3QkFBVixVQUFVOzs2QkFBVixVQUFVOzs7Y0FBVixVQUFVOztTQUVULGtCQUFHO0FBQ1IsVUFDQyw0Q0FBTyxTQUFTLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDLEdBQUcsQ0FDdEc7R0FDRjs7Ozs7Ozs7O1NBT1csc0JBQUMsS0FBSyxFQUFFO0FBQ25CLG9DQUFjLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0dBQzNFOzs7UUFmSSxVQUFVO0dBQVMsbUJBQU0sU0FBUzs7cUJBbUJ6QixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkN0QlAsT0FBTzs7OztvQ0FDRSwwQkFBMEI7Ozs7eUJBQy9CLGNBQWM7Ozs7MEJBQ2IsWUFBWTs7OztJQUU3QixJQUFJO2NBQUosSUFBSTs7YUFBSixJQUFJOzhCQUFKLElBQUk7O21DQUFKLElBQUk7OztpQkFBSixJQUFJOztlQUVBLGtCQUFHO0FBQ0wsZ0JBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQzNCLG1CQUFtQixHQUFHLGlCQUFpQjtnQkFDdkMsY0FBYyxHQUFHLDZCQUFXO0FBQ3hCLHNCQUFNLEVBQUUsSUFBSTtBQUNaLHdCQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUTthQUN6QyxDQUFDLENBQUM7O0FBRVAsZ0JBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUU7QUFDakMsbUNBQW1CLElBQUksUUFBUSxDQUFDO2FBQ25DOztBQUVELGdCQUFJLFFBQVEsR0FBRyxvQkFBVSxFQUV4QixDQUFDOztBQUVGLGdCQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUM5Qix3QkFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzdDOztBQUVELG1CQUNJOztrQkFBSyxTQUFTLEVBQUUsY0FBYyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQUFBQyxFQUFDLE9BQU8sRUFBRSxRQUFRLEFBQUM7Z0JBQ3RFOztzQkFBSyxTQUFTLEVBQUUsbUJBQW1CLEFBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxBQUFDO29CQUMvQzs7MEJBQUssU0FBUyxFQUFDLGVBQWU7d0JBQzFCO0FBQ0kscUNBQVMsRUFBQyx5RUFBeUU7QUFDbkYsZ0NBQUksRUFBQyxRQUFRO0FBQ2IsbUNBQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQyxHQUM3Qjt3QkFDYjtBQUNJLHFDQUFTLEVBQUMsc0VBQXNFO0FBQ2hGLGdDQUFJLEVBQUMsUUFBUTtBQUNiLG1DQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUMsR0FDM0I7cUJBQ1g7aUJBQ0o7Z0JBQ047O3NCQUFHLFNBQVMsRUFBQyxhQUFhO29CQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztpQkFBSzthQUMvQyxDQUNSO1NBQ0w7Ozs7Ozs7O2VBTVMsc0JBQUc7QUFDVCxnQkFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDOUM7Ozs7Ozs7ZUFLYSwwQkFBRztBQUNiLDhDQUFlLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2hEOzs7Ozs7O2VBS1csd0JBQUc7O0FBRVgsZ0JBQUksT0FBTyxDQUFDLDhDQUE4QyxDQUFDLEVBQUU7QUFDekQsa0RBQWUsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDekM7U0FDSjs7Ozs7Ozs7ZUFNVSx1QkFBRztBQUNWLGdCQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNyRCx1QkFBTyxFQUFDLGVBQWUsRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFDLENBQUM7YUFDM0QsTUFBTTtBQUNILHVCQUFPLEVBQUUsQ0FBQzthQUNiO1NBQ0o7Ozs7Ozs7O2VBTXVCLG9DQUFHO0FBQ3ZCLG1CQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsdUJBQVUsY0FBYyxDQUFDLGdCQUFnQixJQUNuRixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLHVCQUFVLGNBQWMsQ0FBQyxlQUFlLENBQUM7U0FDNUY7OztXQXZGQyxJQUFJO0dBQVMsbUJBQU0sU0FBUzs7QUEwRmxDLElBQUksQ0FBQyxTQUFTLEdBQUc7QUFDYixjQUFVLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDbEMsTUFBRSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzFCLGNBQVUsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNoQyxTQUFLLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDN0IsUUFBSSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzVCLE9BQUcsRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtDQUM5QixDQUFDOztxQkFFYSxJQUFJOzs7Ozs7Ozs7QUN4R25CLElBQU0sU0FBUyxHQUFHO0FBQ2pCLFdBQVUsRUFBRTtBQUNYLE1BQUksRUFBRSxNQUFNO0FBQ1osUUFBTSxFQUFFLFFBQVE7QUFDaEIsUUFBTSxFQUFFLFFBQVE7QUFDaEIsUUFBTSxFQUFFLFFBQVE7QUFDaEIsU0FBTyxFQUFFLFNBQVM7QUFDbEIsVUFBUSxFQUFFLFVBQVU7QUFDcEIsTUFBSSxFQUFFLE1BQU07QUFDWixNQUFJLEVBQUUsTUFBTTtFQUNaO0FBQ0QsT0FBTSxFQUFFO0FBQ1AsUUFBTSxFQUFFLFFBQVE7QUFDaEIsUUFBTSxFQUFFLFFBQVE7QUFDaEIsT0FBSyxFQUFFLE9BQU87RUFDZDtBQUNELGVBQWMsRUFBRTtBQUNmLGtCQUFnQixFQUFFLEdBQUc7QUFDckIsaUJBQWUsRUFBRSxHQUFHO0VBQ3BCO0NBQ0QsQ0FBQzs7cUJBRWEsU0FBUzs7Ozs7Ozs7OztvQkN0QkMsTUFBTTs7QUFFL0IsSUFBSSxpQkFBaUIsR0FBRyxzQkFBZ0IsQ0FBQzs7cUJBRTFCLGlCQUFpQjs7Ozs7Ozs7OztvQkNKUCxNQUFNOztBQUUvQixJQUFJLGtCQUFrQixHQUFHLHNCQUFnQixDQUFDOztxQkFFM0Isa0JBQWtCOzs7Ozs7OztzQkNKbkIsUUFBUTs7OztxQkFDSixPQUFPOzs7O2dDQUNMLHFCQUFxQjs7OztBQUV6Qyx5QkFBRSxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMzQixRQUFPLEVBQUUsaUJBQVk7QUFDcEIsTUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVmLE9BQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQzdELE9BQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3JFLE9BQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ3pFLE9BQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ3pFLE9BQUssQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ2pGLE9BQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUUvRCxPQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUMzRSxPQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUMzRSxPQUFLLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0FBQzNGLE9BQUssQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFDdkYsT0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7O0FBRS9FLE1BQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQUU7QUFDOUMsVUFBTztHQUNQOztBQUVELHFCQUFNLE1BQU0sQ0FDWCxnRUFBYSxLQUFLLENBQUksRUFDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUNQLENBQUM7RUFDRjtDQUNELENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQ0M5QjBCLGdDQUFnQzs7OzttQ0FDbkMseUJBQXlCOzs7O3NCQUMxQixRQUFROzs7O3lCQUNYLGNBQWM7Ozs7QUFFcEMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVqQixTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDckIsS0FBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUFFLFNBQU8sS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRTdGLEtBQUksV0FBVyxFQUFFO0FBQ2hCLFNBQU87RUFDUDs7QUFFRCxRQUFPLENBQUMsSUFBSSxDQUFDO0FBQ1osTUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ2YsT0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0VBQ2pCLENBQUMsQ0FBQztDQUNIOztBQUVELFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRTtBQUNyQixNQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzNDLE1BQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2xDLFVBQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbEIsU0FBTTtHQUNOO0VBQ0Q7Q0FDRDs7QUFFRCxTQUFTLEtBQUssR0FBRztBQUNoQixRQUFPLEdBQUcsRUFBRSxDQUFDO0NBQ2I7O0lBRUssV0FBVztXQUFYLFdBQVc7O1VBQVgsV0FBVzt3QkFBWCxXQUFXOzs2QkFBWCxXQUFXOzs7Y0FBWCxXQUFXOzs7Ozs7O1NBTVYsa0JBQUc7QUFDUixVQUFPLE9BQU8sQ0FBQztHQUNmOzs7Ozs7OztTQU1TLHNCQUFHO0FBQ1osT0FBSSxDQUFDLElBQUksQ0FBQyx1QkFBVSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDbkM7Ozs7Ozs7U0FLZ0IsMkJBQUMsUUFBUSxFQUFFO0FBQzNCLE9BQUksQ0FBQyxFQUFFLENBQUMsdUJBQVUsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztHQUMzQzs7Ozs7OztTQUttQiw4QkFBQyxRQUFRLEVBQUU7QUFDOUIsT0FBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBVSxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3ZEOzs7UUE5QkksV0FBVzs7O0FBa0NqQixJQUFJLFlBQVksR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDOztBQUVyQyx3Q0FBaUIsUUFBUSxDQUFDLFVBQVUsT0FBTyxFQUFFOztBQUU1QyxTQUFPLE9BQU8sQ0FBQyxNQUFNO0FBQ3BCLE9BQUssdUJBQVUsTUFBTSxDQUFDLE1BQU07QUFDM0IsU0FBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFckIsT0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDcEIsZ0JBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUMxQjs7QUFFRCxTQUFNOztBQUFBLEFBRVAsT0FBSyx1QkFBVSxNQUFNLENBQUMsTUFBTTtBQUMzQixTQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVyQixPQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNwQixnQkFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzFCOztBQUVELFNBQU07O0FBQUEsQUFFUCxPQUFLLHVCQUFVLE1BQU0sQ0FBQyxLQUFLO0FBQzFCLFFBQUssRUFBRSxDQUFDOztBQUVSLE9BQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3BCLGdCQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDMUI7QUFBQSxFQUNGOztBQUVELFFBQU8sSUFBSSxDQUFDO0NBRVosQ0FBQyxDQUFDOztxQkFFWSxZQUFZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQ0N0R0csaUNBQWlDOzs7O29DQUNwQywwQkFBMEI7Ozs7c0JBQzVCLFFBQVE7Ozs7c0JBQ25CLFFBQVE7Ozs7eUJBQ0EsY0FBYzs7OztBQUVwQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7QUFRMUIsU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ25CLFdBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLFdBQVUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFdBQVUsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO0FBQzFCLFdBQVUsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOztBQUU3QixLQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDNUYsVUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7RUFDekQ7O0FBRUQsT0FBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDOUIsWUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM1QixDQUFDLENBQUM7Q0FDSDs7QUFFRCxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQzdCLEtBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDeEQsTUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLEtBQUssRUFBRTtBQUNoRCxhQUFVLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztHQUM5QixNQUFNO0FBQ04sYUFBVSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7R0FDN0I7RUFDRCxNQUFNO0FBQ04sWUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDckMsWUFBVSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7RUFDN0I7O0FBRUQsU0FBUSxJQUFJLFFBQVEsRUFBRSxDQUFDO0NBQ3ZCOzs7Ozs7OztBQVFELFNBQVMsTUFBTSxDQUFDLFFBQVEsRUFBRTtBQUN6QixLQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQUUsU0FBTyxJQUFJLENBQUMsRUFBRSxLQUFLLFFBQVEsQ0FBQyxFQUFFLENBQUM7RUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7QUFFekYsS0FBSSxVQUFVLEVBQUU7QUFDZixTQUFPO0VBQ1A7O0FBRUQsT0FBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUN0Qjs7Ozs7Ozs7O0FBU0QsU0FBUyxPQUFPLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRTtBQUM5QixxQkFBRSxJQUFJLENBQUM7QUFDTixPQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVU7QUFDNUIsUUFBTSxFQUFFO0FBQ1AsT0FBSSxFQUFFLEVBQUU7R0FDUjtBQUNELFlBQVUsRUFBRSxNQUFNO0FBQ2xCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsV0FBUyxFQUFFLGlCQUFDLElBQUksRUFBSztBQUNwQixPQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7OztBQUluQixRQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzFDLFFBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDeEIsY0FBUyxHQUFHLENBQUMsQ0FBQztBQUNkLFdBQU07S0FDTjtJQUNEOztBQUVELE9BQUksU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3JCLFdBQU87SUFDUDs7QUFFRCxTQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFNUIsV0FBUSxJQUFJLFFBQVEsRUFBRSxDQUFDO0dBQ3ZCO0VBQ0QsQ0FBQyxDQUFDO0NBQ0g7Ozs7Ozs7Ozs7QUFVRCxTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ25DLFdBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLFdBQVUsQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDOztBQUVsQyxLQUFJLElBQUksR0FBRztBQUNWLFFBQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQ3pCLFNBQU8sRUFBRSxVQUFVLENBQUMsS0FBSztFQUN6QixDQUFDOztBQUVGLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDN0csTUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDckIsT0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5QjtFQUNELENBQUMsQ0FBQzs7QUFFSCxxQkFBRSxJQUFJLENBQUM7QUFDTixPQUFLLEVBQUUsVUFBVSxDQUFDLFFBQVE7QUFDMUIsWUFBVSxFQUFFLE1BQU07QUFDbEIsUUFBTSxFQUFFLElBQUk7QUFDWixXQUFTLEVBQUUsaUJBQVMsSUFBSSxFQUFFO0FBQ3pCLFNBQU0sR0FBRyxFQUFFLENBQUM7O0FBRVosYUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDOztBQUU5QixPQUFJLE9BQU8sR0FBRyx5QkFBRSxrQkFBa0IsQ0FBQyxDQUFDOztBQUVwQyxPQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ2hFLFdBQU8sQ0FBQyxNQUFNLENBQUMsMENBQTBDLENBQUMsQ0FBQztJQUMzRDs7QUFFRCxPQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7QUFDN0IsVUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0M7O0FBRUQsVUFBTyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUVoRixPQUFJLE1BQU0sS0FBSyxVQUFVLENBQUMsY0FBYyxFQUFFO0FBQ3pDLFlBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3JFOztBQUVELGlCQUFjLEdBQUcsTUFBTSxDQUFDOztBQUV4QixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUM1QixzQ0FBZSxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQzs7QUFFSCxXQUFRLElBQUksUUFBUSxFQUFFLENBQUM7R0FDdkI7RUFDRCxDQUFDLENBQUE7Q0FDRjs7QUFFRCxTQUFTLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDdkIsS0FBSSxNQUFNLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUU7O0FBQ3JDLE9BQUksSUFBSSxHQUFHO0FBQ1YsVUFBTSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDekIsV0FBTyxFQUFFLFVBQVUsQ0FBQyxLQUFLO0lBQ3pCLENBQUM7O0FBRUYsSUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUM3RyxRQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNyQixTQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzlCO0lBQ0QsQ0FBQyxDQUFDOztBQUVILHVCQUFFLElBQUksQ0FBQztBQUNOLFNBQUssRUFBRSxVQUFVLENBQUMsUUFBUTtBQUMxQixjQUFVLEVBQUUsTUFBTTtBQUNsQixVQUFNLEVBQUUsSUFBSTtBQUNaLGFBQVMsRUFBRSxpQkFBUyxJQUFJLEVBQUU7QUFDekIsU0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDNUIsd0NBQWUsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUNsQyxDQUFDLENBQUM7O0FBRUgsYUFBUSxJQUFJLFFBQVEsRUFBRSxDQUFDO0tBQ3ZCO0lBQ0QsQ0FBQyxDQUFDOztFQUNIO0NBQ0Q7Ozs7Ozs7OztBQVVELFNBQVMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUU7O0NBRTdCOztJQUVLLFNBQVM7V0FBVCxTQUFTOztVQUFULFNBQVM7d0JBQVQsU0FBUzs7NkJBQVQsU0FBUzs7O2NBQVQsU0FBUzs7Ozs7O1NBS0Ysd0JBQUc7QUFDZCxVQUFPLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0dBQzNCOzs7Ozs7O1NBS1kseUJBQUc7QUFDZixVQUFPLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztHQUN0Qjs7Ozs7Ozs7U0FNSyxrQkFBRztBQUNSLFVBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDakMsUUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN6QyxRQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDOztBQUVuRCxRQUFJLFNBQVMsSUFBSSxLQUFLLEVBQUU7QUFDdkIsU0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3RCLGFBQU8sQ0FBQyxDQUFDLENBQUM7TUFDVjs7QUFFRCxTQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdEIsYUFBTyxDQUFDLENBQUM7TUFDVDs7QUFFRCxZQUFPLENBQUMsQ0FBQTtLQUNSOztBQUVELFFBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN0QixZQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ1Y7O0FBRUQsUUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3RCLFlBQU8sQ0FBQyxDQUFDO0tBQ1Q7O0FBRUQsV0FBTyxDQUFDLENBQUE7SUFDUixDQUFDLENBQUM7R0FDSDs7Ozs7Ozs7O1NBT00saUJBQUMsRUFBRSxFQUFFO0FBQ1gsT0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixRQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzFDLFFBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDeEIsU0FBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixXQUFNO0tBQ047SUFDRDs7QUFFRCxVQUFPLElBQUksQ0FBQztHQUNaOzs7Ozs7OztTQU1TLHNCQUFHO0FBQ1osT0FBSSxDQUFDLElBQUksQ0FBQyx1QkFBVSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDdkM7Ozs7Ozs7U0FLZ0IsMkJBQUMsUUFBUSxFQUFFO0FBQzNCLE9BQUksQ0FBQyxFQUFFLENBQUMsdUJBQVUsVUFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztHQUMvQzs7Ozs7OztTQUttQiw4QkFBQyxRQUFRLEVBQUU7QUFDOUIsT0FBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBVSxVQUFVLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQzNEOzs7UUF2RkksU0FBUzs7O0FBMEZmLElBQUksVUFBVSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7O0FBRWpDLHlDQUFrQixRQUFRLENBQUMsVUFBVSxPQUFPLEVBQUU7QUFDN0MsU0FBTyxPQUFPLENBQUMsTUFBTTtBQUNwQixPQUFLLHVCQUFVLFVBQVUsQ0FBQyxJQUFJO0FBQzdCLE9BQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLE9BQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3BCLGNBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN4Qjs7QUFFRCxTQUFNOztBQUFBLEFBRVAsT0FBSyx1QkFBVSxVQUFVLENBQUMsTUFBTTtBQUMvQixTQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVyQixPQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNwQixjQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDeEI7O0FBRUQsU0FBTTs7QUFBQSxBQUVQLE9BQUssdUJBQVUsVUFBVSxDQUFDLE9BQU87QUFDaEMsVUFBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFlBQU07QUFDOUIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDcEIsZUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ3hCO0lBQ0QsQ0FBQyxDQUFDOztBQUVILFNBQU07O0FBQUEsQUFFUCxPQUFLLHVCQUFVLFVBQVUsQ0FBQyxRQUFRO0FBQ2pDLFdBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFNO0FBQ25DLFFBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3BCLGVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUN4QjtJQUNELENBQUMsQ0FBQzs7QUFFSCxTQUFNOztBQUFBLEFBRVAsT0FBSyx1QkFBVSxVQUFVLENBQUMsTUFBTTtBQUMvQixTQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFOUMsT0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDcEIsY0FBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3hCOztBQUVELFNBQU07O0FBQUEsQUFFUCxPQUFLLHVCQUFVLFVBQVUsQ0FBQyxJQUFJO0FBQzdCLE9BQUksQ0FBQyxZQUFNO0FBQ1YsUUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDcEIsZUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ3hCO0lBQ0QsQ0FBQyxDQUFDOztBQUVILFNBQU07O0FBQUEsQUFFUCxPQUFLLHVCQUFVLFVBQVUsQ0FBQyxJQUFJO0FBQzdCLE9BQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFNO0FBQzdCLFFBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3BCLGVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUN4QjtJQUNELENBQUMsQ0FBQzs7QUFFSCxTQUFNO0FBQUEsRUFDUDs7QUFFRCxRQUFPLElBQUksQ0FBQztDQUNaLENBQUMsQ0FBQzs7cUJBRVksVUFBVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE1IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSAnJztcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmIChhcmdUeXBlID09PSAnc3RyaW5nJyB8fCBhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGFyZztcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBrZXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuIiwiaW1wb3J0IGVkaXRvckRpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9lZGl0b3JEaXNwYXRjaGVyJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIGVkaXRvckFjdGlvbnMgPSB7XG5cblx0Y3JlYXRlKGRhdGEsIHNpbGVudCkge1xuXHRcdGVkaXRvckRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuRURJVE9SLkNSRUFURSxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9LFxuXG5cdHVwZGF0ZShkYXRhLCBzaWxlbnQpIHtcblx0XHRlZGl0b3JEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLkVESVRPUi5VUERBVEUsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHRjbGVhcihzaWxlbnQpIHtcblx0XHRlZGl0b3JEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLkVESVRPUi5DTEVBUixcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBlZGl0b3JBY3Rpb25zOyIsImltcG9ydCBnYWxsZXJ5RGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2dhbGxlcnlEaXNwYXRjaGVyJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIGdhbGxlcnlBY3Rpb25zID0ge1xuXG5cdC8qKlxuXHQgKiBAZnVuYyBzZXRTdG9yZVByb3BzXG5cdCAqIEBkZXNjIEluaXRpYWxpc2VzIHRoZSBzdG9yZVxuXHQgKi9cblx0c2V0U3RvcmVQcm9wcyhkYXRhLCBzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLklOSVQsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogQGZ1bmMgY3JlYXRlXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG5cdCAqIEBkZXNjIENyZWF0ZXMgYSBnYWxsZXJ5IGl0ZW0uXG5cdCAqL1xuXHRjcmVhdGUoZGF0YSwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5DUkVBVEUsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogQGZ1bmMgZGVzdHJveVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGRlbGV0ZV91cmxcblx0ICogQHBhcmFtIHtib29sfSBzaWxlbnRcblx0ICogQGRlc2MgZGVzdHJveXMgYSBnYWxsZXJ5IGl0ZW0uXG5cdCAqL1xuXHRkZXN0cm95KGlkLCBzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLkRFU1RST1ksXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGlkOiBpZFxuXHRcdFx0fSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEBmdW5jIHVwZGF0ZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGtleVxuXHQgKiBAZGVzYyBVcGRhdGVzIGEgZ2FsbGVyeSBpdGVtLlxuXHQgKi9cblx0dXBkYXRlKGlkLCB1cGRhdGVzLCBzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLlVQREFURSxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0aWQ6IGlkLFxuXHRcdFx0XHR1cGRhdGVzOiB1cGRhdGVzXG5cdFx0XHR9LFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogTmF2aWdhdGVzIHRvIGEgbmV3IGZvbGRlci5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZvbGRlclxuXHQgKiBAcGFyYW0ge2Jvb2x9IHNpbGVudFxuXHQgKi9cblx0bmF2aWdhdGUoZm9sZGVyLCBzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLk5BVklHQVRFLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHQnZm9sZGVyJzogZm9sZGVyXG5cdFx0XHR9LFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogTG9hZHMgYW5vdGhlciBwYWdlIG9mIGl0ZW1zIGludG8gdGhlIGdhbGxlcnkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7Ym9vbH0gc2lsZW50XG5cdCAqL1xuXHRwYWdlKHNpbGVudCkge1xuXHRcdGdhbGxlcnlEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLklURU1fU1RPUkUuUEFHRSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFNvcnRzIHRoZSBpdGVtcyBpbiB0aGUgZ2FsbGVyeS5cblx0ICpcblx0ICogQHBhcmFtIHtib29sfSBzaWxlbnRcblx0ICovXG5cdHNvcnQobmFtZSwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5TT1JULFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHQnbmFtZSc6IG5hbWVcblx0XHRcdH0sXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYWxsZXJ5QWN0aW9ucztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSW5wdXRGaWVsZCBmcm9tICcuL2lucHV0RmllbGQnO1xuaW1wb3J0IGVkaXRvckFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2VkaXRvckFjdGlvbnMnO1xuaW1wb3J0IGVkaXRvclN0b3JlIGZyb20gJy4uL3N0b3JlL2VkaXRvclN0b3JlJztcblxuLyoqXG4gKiBAZnVuYyBnZXRFZGl0b3JTdG9yZVN0YXRlXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7b2JqZWN0fVxuICogQGRlc2MgRmFjdG9yeSBmb3IgZ2V0dGluZyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgSXRlbVN0b3JlLlxuICovXG5mdW5jdGlvbiBnZXRFZGl0b3JTdG9yZVN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZpZWxkczogZWRpdG9yU3RvcmUuZ2V0QWxsKClcbiAgICB9O1xufVxuXG4vKipcbiAqIEBmdW5jIEVkaXRvclxuICogQGRlc2MgVXNlZCB0byBlZGl0IHRoZSBwcm9wZXJ0aWVzIG9mIGFuIEl0ZW0uXG4gKi9cbmNsYXNzIEVkaXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgLy8gTWFudWFsbHkgYmluZCBzbyBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgY29ycmVjdGx5XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy8gUG9wdWxhdGUgdGhlIHN0b3JlLlxuICAgICAgICBlZGl0b3JBY3Rpb25zLmNyZWF0ZSh7IG5hbWU6ICd0aXRsZScsIHZhbHVlOiBwcm9wcy5pdGVtLnRpdGxlIH0sIHRydWUpO1xuICAgICAgICBlZGl0b3JBY3Rpb25zLmNyZWF0ZSh7IG5hbWU6ICdmaWxlbmFtZScsIHZhbHVlOiBwcm9wcy5pdGVtLmZpbGVuYW1lIH0sIHRydWUpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSBnZXRFZGl0b3JTdG9yZVN0YXRlKCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgICAgICBlZGl0b3JTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgICAgIGVkaXRvclN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIHRleHRGaWVsZHMgPSB0aGlzLmdldFRleHRGaWVsZENvbXBvbmVudHMoKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2VkaXRvcic+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0nc3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWxldmVsLXVwJ1xuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUJhY2suYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgIEJhY2sgdG8gZ2FsbGVyeVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvIG5vbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvLXByZXZpZXcgbm9sYWJlbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9J3RodW1ibmFpbC1wcmV2aWV3JyBzcmM9e3RoaXMucHJvcHMuaXRlbS51cmx9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1kYXRhIG5vbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgbm9sYWJlbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaWxlIHR5cGU6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0udHlwZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RmlsZSBzaXplOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS5zaXplfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+VVJMOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17dGhpcy5wcm9wcy5pdGVtLnVybH0gdGFyZ2V0PSdfYmxhbmsnPnt0aGlzLnByb3BzLml0ZW0udXJsfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaXJzdCB1cGxvYWRlZDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0uY3JlYXRlZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+TGFzdCBjaGFuZ2VkOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS5sYXN0VXBkYXRlZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkRpbWVuc2lvbnM6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy53aWR0aH0geCB7dGhpcy5wcm9wcy5pdGVtLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy5oZWlnaHR9cHg8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIHt0ZXh0RmllbGRzfVxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J3N1Ym1pdCcgY2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNoZWNrLW1hcmtcIj5TYXZlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkXCIgb25DbGljaz17dGhpcy5oYW5kbGVDYW5jZWwuYmluZCh0aGlzKX0gPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBnZXRUZXh0RmllbGRDb21wb25lbnRzXG4gICAgICogQGRlc2MgR2VuZXJhdGVzIHRoZSBlZGl0YWJsZSB0ZXh0IGZpZWxkIGNvbXBvbmVudHMgZm9yIHRoZSBmb3JtLlxuICAgICAqL1xuICAgIGdldFRleHRGaWVsZENvbXBvbmVudHMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLmZpZWxkcykubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IHRoaXMuc3RhdGUuZmllbGRzW2tleV07XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHRleHQnIGtleT17a2V5fT5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2ZpZWxkLm5hbWV9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXRGaWVsZCBuYW1lPXtmaWVsZC5uYW1lfSB2YWx1ZT17ZmllbGQudmFsdWV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBvbkNoYW5nZVxuICAgICAqIEBkZXNjIFVwZGF0ZXMgdGhlIGVkaXRvciBzdGF0ZSB3aGVuIHNvbWV0aGluZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBvbkNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShnZXRFZGl0b3JTdG9yZVN0YXRlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGhhbmRsZUJhY2tcbiAgICAgKiBAZGVzYyBIYW5kbGVzIGNsaWNrcyBvbiB0aGUgYmFjayBidXR0b24uIFN3aXRjaGVzIGJhY2sgdG8gdGhlICdnYWxsZXJ5JyB2aWV3LlxuICAgICAqL1xuICAgIGhhbmRsZUJhY2soKSB7XG4gICAgICAgIGVkaXRvckFjdGlvbnMuY2xlYXIodHJ1ZSk7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0RWRpdGluZyhmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlU2F2ZVxuICAgICAqIEBkZXNjIEhhbmRsZXMgY2xpY2tzIG9uIHRoZSBzYXZlIGJ1dHRvblxuICAgICAqL1xuICAgIGhhbmRsZVNhdmUoKSB7XG4gICAgICAgIC8vIFRPRE86XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlQ2FuY2VsXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG4gICAgICogQGRlc2MgUmVzZXRzIHRoZSBmb3JtIHRvIGl0J3Mgb3JpZ2lvbmFsIHN0YXRlLlxuICAgICAqL1xuICAgIGhhbmRsZUNhbmNlbCgpIHtcbiAgICAgICAgZWRpdG9yQWN0aW9ucy51cGRhdGUoeyBuYW1lOiAndGl0bGUnLCB2YWx1ZTogdGhpcy5wcm9wcy5pdGVtLnRpdGxlIH0pO1xuICAgICAgICBlZGl0b3JBY3Rpb25zLnVwZGF0ZSh7IG5hbWU6ICdmaWxlbmFtZScsIHZhbHVlOiB0aGlzLnByb3BzLml0ZW0uZmlsZW5hbWUgfSk7XG4gICAgfVxuXG59XG5cbkVkaXRvci5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBzZXRFZGl0aW5nOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRWRpdG9yO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgRWRpdG9yIGZyb20gJy4vZWRpdG9yJztcbmltcG9ydCBJdGVtIGZyb20gJy4vaXRlbSc7XG5pbXBvcnQgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2dhbGxlcnlBY3Rpb25zJztcbmltcG9ydCBpdGVtU3RvcmUgZnJvbSAnLi4vc3RvcmUvaXRlbVN0b3JlJztcblxuLyoqXG4gKiBAZnVuYyBnZXRJdGVtU3RvcmVTdGF0ZVxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqIEBkZXNjIEZhY3RvcnkgZm9yIGdldHRpbmcgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIEl0ZW1TdG9yZS5cbiAqL1xuZnVuY3Rpb24gZ2V0SXRlbVN0b3JlU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXRlbXM6IGl0ZW1TdG9yZS5nZXRBbGwoKVxuICAgIH07XG59XG5cbmNsYXNzIEdhbGxlcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHZhciBpdGVtcyA9IHdpbmRvdy5TU19BU1NFVF9HQUxMRVJZW3RoaXMucHJvcHMubmFtZV07XG5cbiAgICAgICAgLy8gTWFudWFsbHkgYmluZCBzbyBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgY29ycmVjdGx5XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMuc2V0U3RvcmVQcm9wcyh7XG4gICAgICAgICAgICBkYXRhX3VybDogcHJvcHMuZGF0YV91cmwsXG4gICAgICAgICAgICB1cGRhdGVfdXJsOiBwcm9wcy51cGRhdGVfdXJsLFxuICAgICAgICAgICAgZGVsZXRlX3VybDogcHJvcHMuZGVsZXRlX3VybCxcbiAgICAgICAgICAgIGluaXRpYWxfZm9sZGVyOiBwcm9wcy5pbml0aWFsX2ZvbGRlcixcbiAgICAgICAgICAgIGxpbWl0OiBwcm9wcy5saW1pdCxcbiAgICAgICAgICAgIGZpbHRlcl9mb2xkZXI6IHByb3BzLmZpbHRlcl9mb2xkZXIsXG4gICAgICAgICAgICBmaWx0ZXJfbmFtZTogcHJvcHMuZmlsdGVyX25hbWUsXG4gICAgICAgICAgICBmaWx0ZXJfdHlwZTogcHJvcHMuZmlsdGVyX3R5cGUsXG4gICAgICAgICAgICBmaWx0ZXJfY3JlYXRlZF9mcm9tOiBwcm9wcy5maWx0ZXJfY3JlYXRlZF9mcm9tLFxuICAgICAgICAgICAgZmlsdGVyX2NyZWF0ZWRfdG86IHByb3BzLmZpbHRlcl9jcmVhdGVkX3RvXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFBvcHVsYXRlIHRoZSBzdG9yZS5cbiAgICAgICAgaWYgKGl0ZW1zICYmIGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBnYWxsZXJ5QWN0aW9ucy5jcmVhdGUoaXRlbXNbaV0sIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSBnYWxsZXJ5LlxuICAgICAgICB0aGlzLnN0YXRlID0gJC5leHRlbmQoZ2V0SXRlbVN0b3JlU3RhdGUoKSwgeyBlZGl0aW5nOiBmYWxzZSwgY3VycmVudEl0ZW06IG51bGwgfSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgICAgICAvLyBpZiB3ZSB3YW50IHRvIGhvb2sgaW50byBkaXJ0eSBjaGVja2luZywgd2UgbmVlZCB0byBmaW5kIGEgd2F5IG9mIHJlZnJlc2hpbmdcbiAgICAgICAgLy8gYWxsIGxvYWRlZCBkYXRhIG5vdCBqdXN0IHRoZSBmaXJzdCBwYWdlIGFnYWluLi4uXG5cbiAgICAgICAgdmFyICRjb250ZW50ID0gJCgnLmNtcy1jb250ZW50LWZpZWxkcycpO1xuXG4gICAgICAgIGlmICgkY29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICRjb250ZW50Lm9uKCdzY3JvbGwnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoJGNvbnRlbnRbMF0uc2Nyb2xsSGVpZ2h0IC0gJGNvbnRlbnRbMF0uc2Nyb2xsVG9wID09PSAkY29udGVudFswXS5jbGllbnRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2FsbGVyeUFjdGlvbnMucGFnZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaXRlbVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICAgICAgaXRlbVN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZykge1xuICAgICAgICAgICAgbGV0IGVkaXRvckNvbXBvbmVudCA9IHRoaXMuZ2V0RWRpdG9yQ29tcG9uZW50KCk7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuICAgICAgICAgICAgICAgICAgICB7ZWRpdG9yQ29tcG9uZW50fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpdGVtcyA9IHRoaXMuZ2V0SXRlbUNvbXBvbmVudHMoKTtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoaXRlbVN0b3JlLmhhc05hdmlnYXRlZCgpKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uID0gPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0nc3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWxldmVsLXVwJ1xuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZU5hdmlnYXRlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICBCYWNrXG4gICAgICAgICAgICAgICAgPC9idXR0b24+O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc29ydHMgPSA8ZGl2PlxuICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU29ydFRpdGxlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICBzb3J0IGJ5IG5hbWVcbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5oYW5kbGVTb3J0Q3JlYXRlZC5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgc29ydCBieSBjcmVhdGVkXG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU29ydFR5cGUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgIHNvcnQgYnkgdHlwZVxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PjtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG4gICAgICAgICAgICAgICAgICAgIHtidXR0b259XG4gICAgICAgICAgICAgICAgICAgIHtzb3J0c31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2l0ZW1zJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlTmF2aWdhdGUoKSB7XG4gICAgICAgIGxldCBuYXZpZ2F0aW9uID0gaXRlbVN0b3JlLnBvcE5hdmlnYXRpb24oKTtcblxuICAgICAgICBnYWxsZXJ5QWN0aW9ucy5uYXZpZ2F0ZShuYXZpZ2F0aW9uWzFdKTtcbiAgICB9XG5cbiAgICBoYW5kbGVTb3J0VGl0bGUoKSB7XG4gICAgICAgIGdhbGxlcnlBY3Rpb25zLnNvcnQoXCJ0aXRsZVwiKTtcbiAgICB9XG5cbiAgICBoYW5kbGVTb3J0Q3JlYXRlZCgpIHtcbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMuc29ydChcImNyZWF0ZWRcIik7XG4gICAgfVxuXG4gICAgaGFuZGxlU29ydFR5cGUoKSB7XG4gICAgICAgIGdhbGxlcnlBY3Rpb25zLnNvcnQoXCJ0eXBlXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIG9uQ2hhbmdlXG4gICAgICogQGRlc2MgVXBkYXRlcyB0aGUgZ2FsbGVyeSBzdGF0ZSB3aGVuIHNvbWV0aGluZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBvbkNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShnZXRJdGVtU3RvcmVTdGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBzZXRFZGl0aW5nXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpc0VkaXRpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2lkXVxuICAgICAqIEBkZXNjIFN3aXRjaGVzIGJldHdlZW4gZWRpdGluZyBhbmQgZ2FsbGVyeSBzdGF0ZXMuXG4gICAgICovXG4gICAgc2V0RWRpdGluZyhpc0VkaXRpbmcsIGlkKSB7XG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IHsgZWRpdGluZzogaXNFZGl0aW5nIH07XG5cbiAgICAgICAgaWYgKGlkICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50SXRlbSA9IGl0ZW1TdG9yZS5nZXRCeUlkKGlkKTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRJdGVtICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKCQuZXh0ZW5kKG5ld1N0YXRlLCB7IGN1cnJlbnRJdGVtOiBjdXJyZW50SXRlbSB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGdldEVkaXRvckNvbXBvbmVudFxuICAgICAqIEBkZXNjIEdlbmVyYXRlcyB0aGUgZWRpdG9yIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBnZXRFZGl0b3JDb21wb25lbnQoKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IHt9O1xuXG4gICAgICAgIHByb3BzLml0ZW0gPSB0aGlzLnN0YXRlLmN1cnJlbnRJdGVtO1xuICAgICAgICBwcm9wcy5zZXRFZGl0aW5nID0gdGhpcy5zZXRFZGl0aW5nLmJpbmQodGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxFZGl0b3Igey4uLnByb3BzfSAvPlxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGdldEl0ZW1Db21wb25lbnRzXG4gICAgICogQGRlc2MgR2VuZXJhdGVzIHRoZSBpdGVtIGNvbXBvbmVudHMgd2hpY2ggcG9wdWxhdGUgdGhlIGdhbGxlcnkuXG4gICAgICovXG4gICAgZ2V0SXRlbUNvbXBvbmVudHMoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5pdGVtcykubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gc2VsZi5zdGF0ZS5pdGVtc1trZXldLFxuICAgICAgICAgICAgICAgIHByb3BzID0ge307XG5cbiAgICAgICAgICAgIHByb3BzLmF0dHJpYnV0ZXMgPSBpdGVtLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICBwcm9wcy5pZCA9IGl0ZW0uaWQ7XG4gICAgICAgICAgICBwcm9wcy5zZXRFZGl0aW5nID0gdGhpcy5zZXRFZGl0aW5nLmJpbmQodGhpcyk7XG4gICAgICAgICAgICBwcm9wcy50aXRsZSA9IGl0ZW0udGl0bGU7XG4gICAgICAgICAgICBwcm9wcy51cmwgPSBpdGVtLnVybDtcbiAgICAgICAgICAgIHByb3BzLnR5cGUgPSBpdGVtLnR5cGU7XG4gICAgICAgICAgICBwcm9wcy5maWxlbmFtZSA9IGl0ZW0uZmlsZW5hbWU7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEl0ZW0ga2V5PXtrZXl9IHsuLi5wcm9wc30gLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FsbGVyeTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZWRpdG9yQWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZWRpdG9yQWN0aW9ucyc7XG5cbmNsYXNzIElucHV0RmllbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGlucHV0IGNsYXNzTmFtZT0ndGV4dCcgdHlwZT0ndGV4dCcgdmFsdWU9e3RoaXMucHJvcHMudmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfSAvPlxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgaGFuZGxlQ2hhbmdlXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuXHQgKiBAZGVzYyBIYW5kbGVzIHRoZSBjaGFuZ2UgZXZlbnRzIG9uIGlucHV0IGZpZWxkcy5cblx0ICovXG5cdGhhbmRsZUNoYW5nZShldmVudCkge1xuXHRcdGVkaXRvckFjdGlvbnMudXBkYXRlKHsgbmFtZTogdGhpcy5wcm9wcy5uYW1lLCB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5wdXRGaWVsZDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2dhbGxlcnlBY3Rpb25zJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5jbGFzcyBJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIHN0eWxlcyA9IHRoaXMuZ2V0SW1hZ2VVUkwoKSxcbiAgICAgICAgICAgIHRodW1ibmFpbENsYXNzTmFtZXMgPSAnaXRlbV9fdGh1bWJuYWlsJyxcbiAgICAgICAgICAgIGl0ZW1DbGFzc05hbWVzID0gY2xhc3NOYW1lcyh7XG4gICAgICAgICAgICAgICAgJ2l0ZW0nOiB0cnVlLFxuICAgICAgICAgICAgICAgICdmb2xkZXInOiB0aGlzLnByb3BzLnR5cGUgPT09ICdmb2xkZXInXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5pbWFnZUxhcmdlclRoYW5UaHVtYm5haWwoKSkge1xuICAgICAgICAgICAgdGh1bWJuYWlsQ2xhc3NOYW1lcyArPSAnIGxhcmdlJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuYXZpZ2F0ZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5wcm9wcy50eXBlID09PSAnZm9sZGVyJykge1xuICAgICAgICAgICAgbmF2aWdhdGUgPSB0aGlzLmhhbmRsZU5hdmlnYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2l0ZW1DbGFzc05hbWVzICsgJyAnICsgdGhpcy5wcm9wcy50eXBlfSBvbkNsaWNrPXtuYXZpZ2F0ZX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RodW1ibmFpbENsYXNzTmFtZXN9IHN0eWxlPXtzdHlsZXN9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naXRlbV9fYWN0aW9ucyc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1yZW1vdmUgWyBmb250LWljb24tdHJhc2ggXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVEZWxldGUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1lZGl0IFsgZm9udC1pY29uLWVkaXQgXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVFZGl0LmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9J2l0ZW1fX3RpdGxlJz57dGhpcy5wcm9wcy50aXRsZX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBoYW5kbGVFZGl0XG4gICAgICogQGRlc2MgRXZlbnQgaGFuZGxlciBmb3IgdGhlICdlZGl0JyBidXR0b24uXG4gICAgICovXG4gICAgaGFuZGxlRWRpdCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRFZGl0aW5nKHRydWUsIHRoaXMucHJvcHMuaWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIHRoZSAnZWRpdCcgYnV0dG9uLlxuICAgICAqL1xuICAgIGhhbmRsZU5hdmlnYXRlKCkge1xuICAgICAgICBnYWxsZXJ5QWN0aW9ucy5uYXZpZ2F0ZSh0aGlzLnByb3BzLmZpbGVuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciB0aGUgJ3JlbW92ZScgYnV0dG9uLlxuICAgICAqL1xuICAgIGhhbmRsZURlbGV0ZSgpIHtcbiAgICAgICAgLy9UT0RPIGludGVybmF0aW9uYWxpc2UgY29uZmlybWF0aW9uIG1lc3NhZ2Ugd2l0aCB0cmFuc2lmZXggaWYvd2hlbiBtZXJnZWQgaW50byBjb3JlXG4gICAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgcmVjb3JkPycpKSB7XG4gICAgICAgICAgICBnYWxsZXJ5QWN0aW9ucy5kZXN0cm95KHRoaXMucHJvcHMuaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgZ2V0SW1hZ2VVUkxcbiAgICAgKiBAZGVzYyBSZXR1cm4gdGhlIFVSTCBvZiB0aGUgaW1hZ2UsIGRldGVybWluZWQgYnkgaXQncyB0eXBlLiBcbiAgICAgKi9cbiAgICBnZXRJbWFnZVVSTCgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ltYWdlJykgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHtiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIHRoaXMucHJvcHMudXJsICsgJyknfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGltYWdlTGFyZ2VyVGhhblRodW1ibmFpbFxuICAgICAqIEBkZXNjIENoZWNrIGlmIGFuIGltYWdlIGlzIGxhcmdlciB0aGFuIHRoZSB0aHVtYm5haWwgY29udGFpbmVyLlxuICAgICAqL1xuICAgIGltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0cmlidXRlcy5kaW1lbnNpb25zLmhlaWdodCA+IENPTlNUQU5UUy5JVEVNX0NPTVBPTkVOVC5USFVNQk5BSUxfSEVJR0hUIHx8IFxuICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMud2lkdGggPiBDT05TVEFOVFMuSVRFTV9DT01QT05FTlQuVEhVTUJOQUlMX1dJRFRIO1xuICAgIH1cbn1cblxuSXRlbS5wcm9wVHlwZXMgPSB7XG4gICAgYXR0cmlidXRlczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBpZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBzZXRFZGl0aW5nOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICB0eXBlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSXRlbTtcbiIsImNvbnN0IENPTlNUQU5UUyA9IHtcblx0SVRFTV9TVE9SRToge1xuXHRcdElOSVQ6ICdpbml0Jyxcblx0XHRDSEFOR0U6ICdjaGFuZ2UnLFxuXHRcdENSRUFURTogJ2NyZWF0ZScsXG5cdFx0VVBEQVRFOiAndXBkYXRlJyxcblx0XHRERVNUUk9ZOiAnZGVzdHJveScsXG5cdFx0TkFWSUdBVEU6ICduYXZpZ2F0ZScsXG5cdFx0UEFHRTogJ3BhZ2UnLFxuXHRcdFNPUlQ6ICdzb3J0J1xuXHR9LFxuXHRFRElUT1I6IHtcblx0XHRDSEFOR0U6ICdjaGFuZ2UnLFxuXHRcdFVQREFURTogJ3VwZGF0ZScsXG5cdFx0Q0xFQVI6ICdjbGVhcidcblx0fSxcblx0SVRFTV9DT01QT05FTlQ6IHtcblx0XHRUSFVNQk5BSUxfSEVJR0hUOiAxNTAsXG5cdFx0VEhVTUJOQUlMX1dJRFRIOiAyMDBcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ09OU1RBTlRTO1xuIiwiaW1wb3J0IHtEaXNwYXRjaGVyfSBmcm9tICdmbHV4JztcblxubGV0IF9lZGl0b3JEaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTsgLy8gU2luZ2xldG9uXG5cbmV4cG9ydCBkZWZhdWx0IF9lZGl0b3JEaXNwYXRjaGVyO1xuIiwiaW1wb3J0IHtEaXNwYXRjaGVyfSBmcm9tICdmbHV4JztcblxubGV0IF9nYWxsZXJ5RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7IC8vIFNpbmdsZXRvblxuXG5leHBvcnQgZGVmYXVsdCBfZ2FsbGVyeURpc3BhdGNoZXI7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBHYWxsZXJ5IGZyb20gJy4vY29tcG9uZW50L2dhbGxlcnknO1xuXG4kKCcuYXNzZXQtZ2FsbGVyeScpLmVudHdpbmUoe1xuXHQnb25hZGQnOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHByb3BzID0ge307XG5cblx0XHRwcm9wcy5uYW1lID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1uYW1lJyk7XG5cdFx0cHJvcHMuZGF0YV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRhdGEtdXJsJyk7XG5cdFx0cHJvcHMudXBkYXRlX3VybCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktdXBkYXRlLXVybCcpO1xuXHRcdHByb3BzLmRlbGV0ZV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRlbGV0ZS11cmwnKTtcblx0XHRwcm9wcy5pbml0aWFsX2ZvbGRlciA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktaW5pdGlhbC1mb2xkZXInKTtcblx0XHRwcm9wcy5saW1pdCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktbGltaXQnKTtcblxuXHRcdHByb3BzLmZpbHRlcl9uYW1lID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1maWx0ZXItbmFtZScpO1xuXHRcdHByb3BzLmZpbHRlcl90eXBlID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1maWx0ZXItdHlwZScpO1xuXHRcdHByb3BzLmZpbHRlcl9jcmVhdGVkX2Zyb20gPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWZpbHRlci1jcmVhdGVkLWZyb20nKTtcblx0XHRwcm9wcy5maWx0ZXJfY3JlYXRlZF90byA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktZmlsdGVyLWNyZWF0ZWQtdG8nKTtcblx0XHRwcm9wcy5maWx0ZXJfZm9sZGVyID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1maWx0ZXItZm9sZGVyJyk7XG5cblx0XHRpZiAocHJvcHMubmFtZSA9PT0gbnVsbCB8fCBwcm9wcy51cmwgPT09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRSZWFjdC5yZW5kZXIoXG5cdFx0XHQ8R2FsbGVyeSB7Li4ucHJvcHN9IC8+LFxuXHRcdFx0dGhpc1swXVxuXHRcdCk7XG5cdH1cbn0pO1xuIiwiaW1wb3J0IGVkaXRvckRpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9lZGl0b3JEaXNwYXRjaGVyJztcbmltcG9ydCBlZGl0b3JBY3Rpb25zIGZyb20gJy4uL2FjdGlvbi9lZGl0b3JBY3Rpb25zJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIF9maWVsZHMgPSBbXTtcblxuZnVuY3Rpb24gY3JlYXRlKGRhdGEpIHtcblx0dmFyIGZpZWxkRXhpc3RzID0gX2ZpZWxkcy5maWx0ZXIoKGZpZWxkKSA9PiB7IHJldHVybiBmaWVsZC5uYW1lID09PSBkYXRhLm5hbWU7IH0pLmxlbmd0aCA+IDA7XG5cblx0aWYgKGZpZWxkRXhpc3RzKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0X2ZpZWxkcy5wdXNoKHtcblx0XHRuYW1lOiBkYXRhLm5hbWUsXG5cdFx0dmFsdWU6IGRhdGEudmFsdWVcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZShkYXRhKSB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgX2ZpZWxkcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdGlmIChfZmllbGRzW2ldLm5hbWUgPT09IGRhdGEubmFtZSkge1xuXHRcdFx0X2ZpZWxkc1tpXSA9IGRhdGE7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gY2xlYXIoKSB7XG5cdF9maWVsZHMgPSBbXTtcbn1cblxuY2xhc3MgRWRpdG9yU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHtvYmplY3R9XG5cdCAqIEBkZXNjIEdldHMgdGhlIGVudGlyZSBjb2xsZWN0aW9uIG9mIGl0ZW1zLlxuXHQgKi9cblx0Z2V0QWxsKCkge1xuXHRcdHJldHVybiBfZmllbGRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIGVtaXRDaGFuZ2Vcblx0ICogQGRlc2MgVHJpZ2dlcmVkIHdoZW4gc29tZXRoaW5nIGNoYW5nZXMgaW4gdGhlIHN0b3JlLlxuXHQgKi9cblx0ZW1pdENoYW5nZSgpIHtcblx0XHR0aGlzLmVtaXQoQ09OU1RBTlRTLkVESVRPUi5DSEFOR0UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqL1xuXHRhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuXHRcdHRoaXMub24oQ09OU1RBTlRTLkVESVRPUi5DSEFOR0UsIGNhbGxiYWNrKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKi9cblx0cmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcblx0XHR0aGlzLnJlbW92ZUxpc3RlbmVyKENPTlNUQU5UUy5FRElUT1IuQ0hBTkdFLCBjYWxsYmFjayk7XG5cdH1cblxufVxuXG5sZXQgX2VkaXRvclN0b3JlID0gbmV3IEVkaXRvclN0b3JlKCk7IC8vIFNpbmdsZXRvbi5cblxuZWRpdG9yRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbiAocGF5bG9hZCkge1xuXG5cdHN3aXRjaChwYXlsb2FkLmFjdGlvbikge1xuXHRcdGNhc2UgQ09OU1RBTlRTLkVESVRPUi5DUkVBVEU6XG5cdFx0XHRjcmVhdGUocGF5bG9hZC5kYXRhKTtcblxuXHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRfZWRpdG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgQ09OU1RBTlRTLkVESVRPUi5VUERBVEU6XG5cdFx0XHR1cGRhdGUocGF5bG9hZC5kYXRhKTtcblxuXHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRfZWRpdG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgQ09OU1RBTlRTLkVESVRPUi5DTEVBUjpcblx0XHRcdGNsZWFyKCk7XG5cblx0XHRcdGlmICghcGF5bG9hZC5zaWxlbnQpIHtcblx0XHRcdFx0X2VkaXRvclN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdH1cblx0fVxuXG5cdHJldHVybiB0cnVlOyAvLyBObyBlcnJvcnMuIE5lZWRlZCBieSBwcm9taXNlIGluIERpc3BhdGNoZXIuXG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBfZWRpdG9yU3RvcmU7XG4iLCJpbXBvcnQgZ2FsbGVyeURpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlcic7XG5pbXBvcnQgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2dhbGxlcnlBY3Rpb25zJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBfaXRlbXMgPSBbXTtcbnZhciBfZm9sZGVycyA9IFtdO1xudmFyIF9jdXJyZW50Rm9sZGVyID0gbnVsbDtcblxuLyoqXG4gKiBAZnVuYyBpbml0XG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAqIEBkZXNjIFNldHMgcHJvcGVydGllcyBvbiB0aGUgc3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGluaXQoZGF0YSkge1xuXHRfaXRlbVN0b3JlLnBhZ2UgPSAxO1xuXHRfaXRlbVN0b3JlLmxpbWl0ID0gMTA7XG5cdF9pdGVtU3RvcmUuc29ydCA9ICd0aXRsZSc7XG5cdF9pdGVtU3RvcmUuZGlyZWN0aW9uID0gJ2FzYyc7XG5cblx0aWYgKGRhdGEuZmlsdGVyX2ZvbGRlciAmJiBkYXRhLmluaXRpYWxfZm9sZGVyICYmIGRhdGEuZmlsdGVyX2ZvbGRlciAhPT0gZGF0YS5pbml0aWFsX2ZvbGRlcikge1xuXHRcdF9mb2xkZXJzLnB1c2goW2RhdGEuZmlsdGVyX2ZvbGRlciwgZGF0YS5pbml0aWFsX2ZvbGRlcl0pO1xuXHR9XG5cblx0T2JqZWN0LmtleXMoZGF0YSkubWFwKChrZXkpID0+IHtcblx0XHRfaXRlbVN0b3JlW2tleV0gPSBkYXRhW2tleV07XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzb3J0KG5hbWUsIGNhbGxiYWNrKSB7XG5cdGlmIChfaXRlbVN0b3JlLnNvcnQudG9Mb3dlckNhc2UoKSA9PSBuYW1lLnRvTG93ZXJDYXNlKCkpIHtcblx0XHRpZiAoX2l0ZW1TdG9yZS5kaXJlY3Rpb24udG9Mb3dlckNhc2UoKSA9PSAnYXNjJykge1xuXHRcdFx0X2l0ZW1TdG9yZS5kaXJlY3Rpb24gPSAnZGVzYyc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9pdGVtU3RvcmUuZGlyZWN0aW9uID0gJ2FzYyc7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdF9pdGVtU3RvcmUuc29ydCA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRfaXRlbVN0b3JlLmRpcmVjdGlvbiA9ICdhc2MnO1xuXHR9XG5cblx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbn1cblxuLyoqXG4gKiBAZnVuYyBjcmVhdGVcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gaXRlbURhdGFcbiAqIEBkZXNjIEFkZHMgYSBnYWxsZXJ5IGl0ZW0gdG8gdGhlIHN0b3JlLlxuICovXG5mdW5jdGlvbiBjcmVhdGUoaXRlbURhdGEpIHtcblx0dmFyIGl0ZW1FeGlzdHMgPSBfaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7IHJldHVybiBpdGVtLmlkID09PSBpdGVtRGF0YS5pZDsgfSkubGVuZ3RoID4gMDtcblxuXHRpZiAoaXRlbUV4aXN0cykge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdF9pdGVtcy5wdXNoKGl0ZW1EYXRhKTtcbn1cblxuLyoqXG4gKiBAZnVuYyBkZXN0cm95XG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtpbnR9IGlkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICogQGRlc2MgUmVtb3ZlcyBhIGdhbGxlcnkgaXRlbSBmcm9tIHRoZSBzdG9yZS5cbiAqL1xuZnVuY3Rpb24gZGVzdHJveShpZCwgY2FsbGJhY2spIHtcblx0JC5hamF4KHsgLy8gQHRvZG8gZml4IHRoaXMganVua1xuXHRcdCd1cmwnOiBfaXRlbVN0b3JlLmRlbGV0ZV91cmwsXG5cdFx0J2RhdGEnOiB7XG5cdFx0XHQnaWQnOiBpZFxuXHRcdH0sXG5cdFx0J2RhdGFUeXBlJzogJ2pzb24nLFxuXHRcdCdtZXRob2QnOiAnR0VUJyxcblx0XHQnc3VjY2Vzcyc6IChkYXRhKSA9PiB7XG5cdFx0XHR2YXIgaXRlbUluZGV4ID0gLTE7XG5cblx0XHRcdC8vIEdldCB0aGUgaW5kZXggb2YgdGhlIGl0ZW0gd2UgaGF2ZSBkZWxldGVkXG5cdFx0XHQvLyBzbyBpdCBjYW4gYmUgcmVtb3ZlZCBmcm9tIHRoZSBzdG9yZS5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgX2l0ZW1zLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRcdGlmIChfaXRlbXNbaV0uaWQgPT09IGlkKSB7XG5cdFx0XHRcdFx0aXRlbUluZGV4ID0gaTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaXRlbUluZGV4ID09PSAtMSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdF9pdGVtcy5zcGxpY2UoaXRlbUluZGV4LCAxKTtcblxuXHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHR9XG5cdH0pO1xufVxuXG4vKipcbiAqIE5hdmlnYXRlcyB0byBhIG5ldyBmb2xkZXIuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZm9sZGVyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5mdW5jdGlvbiBuYXZpZ2F0ZShmb2xkZXIsIGNhbGxiYWNrKSB7XG5cdF9pdGVtU3RvcmUucGFnZSA9IDE7XG5cdF9pdGVtU3RvcmUuZmlsdGVyX2ZvbGRlciA9IGZvbGRlcjtcblxuXHRsZXQgZGF0YSA9IHtcblx0XHQncGFnZSc6IF9pdGVtU3RvcmUucGFnZSsrLFxuXHRcdCdsaW1pdCc6IF9pdGVtU3RvcmUubGltaXQsXG5cdH07XG5cblx0WydmaWx0ZXJfZm9sZGVyJywgJ2ZpbHRlcl9uYW1lJywgJ2ZpbHRlcl90eXBlJywgJ2ZpbHRlcl9jcmVhdGVkX2Zyb20nLCAnZmlsdGVyX2NyZWF0ZWRfdG8nXS5mb3JFYWNoKCh0eXBlKSA9PiB7XG5cdFx0aWYgKF9pdGVtU3RvcmVbdHlwZV0pIHtcblx0XHRcdGRhdGFbdHlwZV0gPSBfaXRlbVN0b3JlW3R5cGVdO1xuXHRcdH1cblx0fSk7XG5cblx0JC5hamF4KHtcblx0XHQndXJsJzogX2l0ZW1TdG9yZS5kYXRhX3VybCxcblx0XHQnZGF0YVR5cGUnOiAnanNvbicsXG5cdFx0J2RhdGEnOiBkYXRhLFxuXHRcdCdzdWNjZXNzJzogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0X2l0ZW1zID0gW107XG5cblx0XHRcdF9pdGVtU3RvcmUuY291bnQgPSBkYXRhLmNvdW50O1xuXG5cdFx0XHRsZXQgJHNlYXJjaCA9ICQoJy5jbXMtc2VhcmNoLWZvcm0nKTtcblxuXHRcdFx0aWYgKCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJykubGVuZ3RoID09IDApIHtcblx0XHRcdFx0JHNlYXJjaC5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInFbRm9sZGVyXVwiIC8+Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKGZvbGRlci5zdWJzdHIoLTEpID09PSAnLycpIHtcblx0XHRcdFx0Zm9sZGVyID0gZm9sZGVyLnN1YnN0cigwLCBmb2xkZXIubGVuZ3RoIC0gMSk7XG5cdFx0XHR9XG5cblx0XHRcdCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJykudmFsKGVuY29kZVVSSUNvbXBvbmVudChmb2xkZXIpKTtcblxuXHRcdFx0aWYgKGZvbGRlciAhPT0gX2l0ZW1TdG9yZS5pbml0aWFsX2ZvbGRlcikge1xuXHRcdFx0XHRfZm9sZGVycy5wdXNoKFtmb2xkZXIsIF9jdXJyZW50Rm9sZGVyIHx8IF9pdGVtU3RvcmUuaW5pdGlhbF9mb2xkZXJdKTtcblx0XHRcdH1cblxuXHRcdFx0X2N1cnJlbnRGb2xkZXIgPSBmb2xkZXI7XG5cblx0XHRcdGRhdGEuZmlsZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0XHRnYWxsZXJ5QWN0aW9ucy5jcmVhdGUoaXRlbSwgdHJ1ZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHR9XG5cdH0pXG59XG5cbmZ1bmN0aW9uIHBhZ2UoY2FsbGJhY2spIHtcblx0aWYgKF9pdGVtcy5sZW5ndGggPCBfaXRlbVN0b3JlLmNvdW50KSB7XG5cdFx0bGV0IGRhdGEgPSB7XG5cdFx0XHQncGFnZSc6IF9pdGVtU3RvcmUucGFnZSsrLFxuXHRcdFx0J2xpbWl0JzogX2l0ZW1TdG9yZS5saW1pdCxcblx0XHR9O1xuXG5cdFx0WydmaWx0ZXJfZm9sZGVyJywgJ2ZpbHRlcl9uYW1lJywgJ2ZpbHRlcl90eXBlJywgJ2ZpbHRlcl9jcmVhdGVkX2Zyb20nLCAnZmlsdGVyX2NyZWF0ZWRfdG8nXS5mb3JFYWNoKCh0eXBlKSA9PiB7XG5cdFx0XHRpZiAoX2l0ZW1TdG9yZVt0eXBlXSkge1xuXHRcdFx0XHRkYXRhW3R5cGVdID0gX2l0ZW1TdG9yZVt0eXBlXTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdCQuYWpheCh7XG5cdFx0XHQndXJsJzogX2l0ZW1TdG9yZS5kYXRhX3VybCxcblx0XHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHRcdCdkYXRhJzogZGF0YSxcblx0XHRcdCdzdWNjZXNzJzogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRkYXRhLmZpbGVzLmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdFx0XHRnYWxsZXJ5QWN0aW9ucy5jcmVhdGUoaXRlbSwgdHJ1ZSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuXG4vKipcbiAqIEBmdW5jIHVwZGF0ZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW1EYXRhXG4gKiBAZGVzYyBVcGRhdGVzIGFuIGl0ZW0gaW4gdGhlIHN0b3JlLlxuICovXG5mdW5jdGlvbiB1cGRhdGUoaWQsIGl0ZW1EYXRhKSB7XG5cdC8vIFRPRE86XG59XG5cbmNsYXNzIEl0ZW1TdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZ2FsbGVyeSBoYXMgYmVlbiBuYXZpZ2F0ZWQuXG5cdCAqL1xuXHRoYXNOYXZpZ2F0ZWQoKSB7XG5cdFx0cmV0dXJuIF9mb2xkZXJzLmxlbmd0aCA+IDA7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgZm9sZGVyIHN0YWNrLlxuXHQgKi9cblx0cG9wTmF2aWdhdGlvbigpIHtcblx0XHRyZXR1cm4gX2ZvbGRlcnMucG9wKCk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKiBAZGVzYyBHZXRzIHRoZSBlbnRpcmUgY29sbGVjdGlvbiBvZiBpdGVtcy5cblx0ICovXG5cdGdldEFsbCgpIHtcblx0XHRyZXR1cm4gX2l0ZW1zLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0bGV0IHNvcnQgPSBfaXRlbVN0b3JlLnNvcnQudG9Mb3dlckNhc2UoKTtcblx0XHRcdGxldCBkaXJlY3Rpb24gPSBfaXRlbVN0b3JlLmRpcmVjdGlvbi50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09ICdhc2MnKSB7XG5cdFx0XHRcdGlmIChhW3NvcnRdIDwgYltzb3J0XSkge1xuXHRcdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhW3NvcnRdID4gYltzb3J0XSkge1xuXHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIDBcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFbc29ydF0gPiBiW3NvcnRdKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFbc29ydF0gPCBiW3NvcnRdKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMFxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIGdldEJ5SWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkXG5cdCAqIEByZXR1cm4ge29iamVjdH1cblx0ICovXG5cdGdldEJ5SWQoaWQpIHtcblx0XHR2YXIgaXRlbSA9IG51bGw7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IF9pdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0aWYgKF9pdGVtc1tpXS5pZCA9PT0gaWQpIHtcblx0XHRcdFx0aXRlbSA9IF9pdGVtc1tpXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW07XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZW1pdENoYW5nZVxuXHQgKiBAZGVzYyBUcmlnZ2VyZWQgd2hlbiBzb21ldGhpbmcgY2hhbmdlcyBpbiB0aGUgc3RvcmUuXG5cdCAqL1xuXHRlbWl0Q2hhbmdlKCkge1xuXHRcdHRoaXMuZW1pdChDT05TVEFOVFMuSVRFTV9TVE9SRS5DSEFOR0UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqL1xuXHRhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuXHRcdHRoaXMub24oQ09OU1RBTlRTLklURU1fU1RPUkUuQ0hBTkdFLCBjYWxsYmFjayk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcblx0ICovXG5cdHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcihDT05TVEFOVFMuSVRFTV9TVE9SRS5DSEFOR0UsIGNhbGxiYWNrKTtcblx0fVxufVxuXG5sZXQgX2l0ZW1TdG9yZSA9IG5ldyBJdGVtU3RvcmUoKTsgLy8gU2luZ2xldG9uXG5cbmdhbGxlcnlEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cdHN3aXRjaChwYXlsb2FkLmFjdGlvbikge1xuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuSU5JVDpcblx0XHRcdGluaXQocGF5bG9hZC5kYXRhKTtcblxuXHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLkNSRUFURTpcblx0XHRcdGNyZWF0ZShwYXlsb2FkLmRhdGEpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuREVTVFJPWTpcblx0XHRcdGRlc3Ryb3kocGF5bG9hZC5kYXRhLmlkLCAoKSA9PiB7XG5cdFx0XHRcdGlmICghcGF5bG9hZC5zaWxlbnQpIHtcblx0XHRcdFx0XHRfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBDT05TVEFOVFMuSVRFTV9TVE9SRS5OQVZJR0FURTpcblx0XHRcdG5hdmlnYXRlKHBheWxvYWQuZGF0YS5mb2xkZXIsICgpID0+IHtcblx0XHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLlVQREFURTpcblx0XHRcdHVwZGF0ZShwYXlsb2FkLmRhdGEuaWQsIHBheWxvYWQuZGF0YS51cGRhdGVzKTtcblxuXHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLlBBR0U6XG5cdFx0XHRwYWdlKCgpID0+IHtcblx0XHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLlNPUlQ6XG5cdFx0XHRzb3J0KHBheWxvYWQuZGF0YS5uYW1lLCAoKSA9PiB7XG5cdFx0XHRcdGlmICghcGF5bG9hZC5zaWxlbnQpIHtcblx0XHRcdFx0XHRfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHRydWU7IC8vIE5vIGVycm9ycy4gTmVlZGVkIGJ5IHByb21pc2UgaW4gRGlzcGF0Y2hlci5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBfaXRlbVN0b3JlO1xuIl19

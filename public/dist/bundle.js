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
                            className: 'ss-ui-button ui-corner-all font-icon-level-up',
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

            var navigate = function navigate() {
                console.log('not a folder');
            };

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

},{"../action/galleryActions":4,"../constants":9,"../dispatcher/galleryDispatcher":11,"events":1,"jquery":"jquery"}]},{},[12])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9hY3Rpb24vZWRpdG9yQWN0aW9ucy5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvYWN0aW9uL2dhbGxlcnlBY3Rpb25zLmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZWRpdG9yLmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZ2FsbGVyeS5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2lucHV0RmllbGQuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9pdGVtLmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb25zdGFudHMuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2Rpc3BhdGNoZXIvZWRpdG9yRGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvc3RvcmUvZWRpdG9yU3RvcmUuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL3N0b3JlL2l0ZW1TdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNwQixlQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDeEI7SUFDRCxDQUFDLENBQUM7O0FBRUgsU0FBTTs7QUFBQSxBQUVQLE9BQUssdUJBQVUsVUFBVSxDQUFDLFFBQVE7QUFDakMsV0FBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFlBQU07QUFDbkMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDcEIsZUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ3hCO0lBQ0QsQ0FBQyxDQUFDOztBQUVILFNBQU07O0FBQUEsQUFFUCxPQUFLLHVCQUFVLFVBQVUsQ0FBQyxNQUFNO0FBQy9CLFNBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU5QyxPQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNwQixjQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDeEI7O0FBRUQsU0FBTTs7QUFBQSxBQUVQLE9BQUssdUJBQVUsVUFBVSxDQUFDLElBQUk7QUFDN0IsT0FBSSxDQUFDLFlBQU07QUFDVixRQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNwQixlQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDeEI7SUFDRCxDQUFDLENBQUM7O0FBRUgsU0FBTTtBQUFBLEVBQ1A7O0FBRUQsUUFBTyxJQUFJLENBQUM7Q0FDWixDQUFDLENBQUM7O3FCQUVZLFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNSBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBhcmc7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoYXJnVHlwZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsga2V5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLnN1YnN0cigxKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gcmVnaXN0ZXIgYXMgJ2NsYXNzbmFtZXMnLCBjb25zaXN0ZW50IHdpdGggbnBtIHBhY2thZ2UgbmFtZVxuXHRcdGRlZmluZSgnY2xhc3NuYW1lcycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsImltcG9ydCBlZGl0b3JEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvZWRpdG9yRGlzcGF0Y2hlcic7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBlZGl0b3JBY3Rpb25zID0ge1xuXG5cdGNyZWF0ZShkYXRhLCBzaWxlbnQpIHtcblx0XHRlZGl0b3JEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLkVESVRPUi5DUkVBVEUsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c2lsZW50OiBzaWxlbnRcblx0XHR9KTtcblx0fSxcblxuXHR1cGRhdGUoZGF0YSwgc2lsZW50KSB7XG5cdFx0ZWRpdG9yRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5FRElUT1IuVVBEQVRFLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0Y2xlYXIoc2lsZW50KSB7XG5cdFx0ZWRpdG9yRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5FRElUT1IuQ0xFQVIsXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgZWRpdG9yQWN0aW9uczsiLCJpbXBvcnQgZ2FsbGVyeURpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlcic7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBnYWxsZXJ5QWN0aW9ucyA9IHtcblxuXHQvKipcblx0ICogQGZ1bmMgc2V0U3RvcmVQcm9wc1xuXHQgKiBAZGVzYyBJbml0aWFsaXNlcyB0aGUgc3RvcmVcblx0ICovXG5cdHNldFN0b3JlUHJvcHMoZGF0YSwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5JTklULFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEBmdW5jIGNyZWF0ZVxuXHQgKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuXHQgKiBAZGVzYyBDcmVhdGVzIGEgZ2FsbGVyeSBpdGVtLlxuXHQgKi9cblx0Y3JlYXRlKGRhdGEsIHNpbGVudCkge1xuXHRcdGdhbGxlcnlEaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdGFjdGlvbjogQ09OU1RBTlRTLklURU1fU1RPUkUuQ1JFQVRFLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEBmdW5jIGRlc3Ryb3lcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkZWxldGVfdXJsXG5cdCAqIEBwYXJhbSB7Ym9vbH0gc2lsZW50XG5cdCAqIEBkZXNjIGRlc3Ryb3lzIGEgZ2FsbGVyeSBpdGVtLlxuXHQgKi9cblx0ZGVzdHJveShpZCwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5ERVNUUk9ZLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpZDogaWRcblx0XHRcdH0sXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAZnVuYyB1cGRhdGVcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcblx0ICogQGRlc2MgVXBkYXRlcyBhIGdhbGxlcnkgaXRlbS5cblx0ICovXG5cdHVwZGF0ZShpZCwgdXBkYXRlcywgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5VUERBVEUsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGlkOiBpZCxcblx0XHRcdFx0dXBkYXRlczogdXBkYXRlc1xuXHRcdFx0fSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyB0byBhIG5ldyBmb2xkZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmb2xkZXJcblx0ICogQHBhcmFtIHtib29sfSBzaWxlbnRcblx0ICovXG5cdG5hdmlnYXRlKGZvbGRlciwgc2lsZW50KSB7XG5cdFx0Z2FsbGVyeURpc3BhdGNoZXIuZGlzcGF0Y2goe1xuXHRcdFx0YWN0aW9uOiBDT05TVEFOVFMuSVRFTV9TVE9SRS5OQVZJR0FURSxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0J2ZvbGRlcic6IGZvbGRlclxuXHRcdFx0fSxcblx0XHRcdHNpbGVudDogc2lsZW50XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIExvYWRzIGFub3RoZXIgcGFnZSBvZiBpdGVtcyBpbnRvIHRoZSBnYWxsZXJ5LlxuXHQgKlxuXHQgKiBAcGFyYW0ge2Jvb2x9IHNpbGVudFxuXHQgKi9cblx0cGFnZShzaWxlbnQpIHtcblx0XHRnYWxsZXJ5RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRhY3Rpb246IENPTlNUQU5UUy5JVEVNX1NUT1JFLlBBR0UsXG5cdFx0XHRzaWxlbnQ6IHNpbGVudFxuXHRcdH0pO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYWxsZXJ5QWN0aW9ucztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSW5wdXRGaWVsZCBmcm9tICcuL2lucHV0RmllbGQnO1xuaW1wb3J0IGVkaXRvckFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2VkaXRvckFjdGlvbnMnO1xuaW1wb3J0IGVkaXRvclN0b3JlIGZyb20gJy4uL3N0b3JlL2VkaXRvclN0b3JlJztcblxuLyoqXG4gKiBAZnVuYyBnZXRFZGl0b3JTdG9yZVN0YXRlXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7b2JqZWN0fVxuICogQGRlc2MgRmFjdG9yeSBmb3IgZ2V0dGluZyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgSXRlbVN0b3JlLlxuICovXG5mdW5jdGlvbiBnZXRFZGl0b3JTdG9yZVN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZpZWxkczogZWRpdG9yU3RvcmUuZ2V0QWxsKClcbiAgICB9O1xufVxuXG4vKipcbiAqIEBmdW5jIEVkaXRvclxuICogQGRlc2MgVXNlZCB0byBlZGl0IHRoZSBwcm9wZXJ0aWVzIG9mIGFuIEl0ZW0uXG4gKi9cbmNsYXNzIEVkaXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgLy8gTWFudWFsbHkgYmluZCBzbyBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgY29ycmVjdGx5XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy8gUG9wdWxhdGUgdGhlIHN0b3JlLlxuICAgICAgICBlZGl0b3JBY3Rpb25zLmNyZWF0ZSh7IG5hbWU6ICd0aXRsZScsIHZhbHVlOiBwcm9wcy5pdGVtLnRpdGxlIH0sIHRydWUpO1xuICAgICAgICBlZGl0b3JBY3Rpb25zLmNyZWF0ZSh7IG5hbWU6ICdmaWxlbmFtZScsIHZhbHVlOiBwcm9wcy5pdGVtLmZpbGVuYW1lIH0sIHRydWUpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSBnZXRFZGl0b3JTdG9yZVN0YXRlKCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgICAgICBlZGl0b3JTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgICAgIGVkaXRvclN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIHRleHRGaWVsZHMgPSB0aGlzLmdldFRleHRGaWVsZENvbXBvbmVudHMoKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2VkaXRvcic+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0nc3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWxldmVsLXVwJ1xuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUJhY2suYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgIEJhY2sgdG8gZ2FsbGVyeVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvIG5vbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvLXByZXZpZXcgbm9sYWJlbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9J3RodW1ibmFpbC1wcmV2aWV3JyBzcmM9e3RoaXMucHJvcHMuaXRlbS51cmx9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1kYXRhIG5vbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgbm9sYWJlbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaWxlIHR5cGU6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0udHlwZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RmlsZSBzaXplOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS5zaXplfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+VVJMOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17dGhpcy5wcm9wcy5pdGVtLnVybH0gdGFyZ2V0PSdfYmxhbmsnPnt0aGlzLnByb3BzLml0ZW0udXJsfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaXJzdCB1cGxvYWRlZDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0uY3JlYXRlZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+TGFzdCBjaGFuZ2VkOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS5sYXN0VXBkYXRlZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkRpbWVuc2lvbnM6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy53aWR0aH0geCB7dGhpcy5wcm9wcy5pdGVtLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy5oZWlnaHR9cHg8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIHt0ZXh0RmllbGRzfVxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J3N1Ym1pdCcgY2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNoZWNrLW1hcmtcIj5TYXZlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkXCIgb25DbGljaz17dGhpcy5oYW5kbGVDYW5jZWwuYmluZCh0aGlzKX0gPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBnZXRUZXh0RmllbGRDb21wb25lbnRzXG4gICAgICogQGRlc2MgR2VuZXJhdGVzIHRoZSBlZGl0YWJsZSB0ZXh0IGZpZWxkIGNvbXBvbmVudHMgZm9yIHRoZSBmb3JtLlxuICAgICAqL1xuICAgIGdldFRleHRGaWVsZENvbXBvbmVudHMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLmZpZWxkcykubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IHRoaXMuc3RhdGUuZmllbGRzW2tleV07XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHRleHQnIGtleT17a2V5fT5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2ZpZWxkLm5hbWV9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXRGaWVsZCBuYW1lPXtmaWVsZC5uYW1lfSB2YWx1ZT17ZmllbGQudmFsdWV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBvbkNoYW5nZVxuICAgICAqIEBkZXNjIFVwZGF0ZXMgdGhlIGVkaXRvciBzdGF0ZSB3aGVuIHNvbWV0aGluZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBvbkNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShnZXRFZGl0b3JTdG9yZVN0YXRlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGhhbmRsZUJhY2tcbiAgICAgKiBAZGVzYyBIYW5kbGVzIGNsaWNrcyBvbiB0aGUgYmFjayBidXR0b24uIFN3aXRjaGVzIGJhY2sgdG8gdGhlICdnYWxsZXJ5JyB2aWV3LlxuICAgICAqL1xuICAgIGhhbmRsZUJhY2soKSB7XG4gICAgICAgIGVkaXRvckFjdGlvbnMuY2xlYXIodHJ1ZSk7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0RWRpdGluZyhmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlU2F2ZVxuICAgICAqIEBkZXNjIEhhbmRsZXMgY2xpY2tzIG9uIHRoZSBzYXZlIGJ1dHRvblxuICAgICAqL1xuICAgIGhhbmRsZVNhdmUoKSB7XG4gICAgICAgIC8vIFRPRE86XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlQ2FuY2VsXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG4gICAgICogQGRlc2MgUmVzZXRzIHRoZSBmb3JtIHRvIGl0J3Mgb3JpZ2lvbmFsIHN0YXRlLlxuICAgICAqL1xuICAgIGhhbmRsZUNhbmNlbCgpIHtcbiAgICAgICAgZWRpdG9yQWN0aW9ucy51cGRhdGUoeyBuYW1lOiAndGl0bGUnLCB2YWx1ZTogdGhpcy5wcm9wcy5pdGVtLnRpdGxlIH0pO1xuICAgICAgICBlZGl0b3JBY3Rpb25zLnVwZGF0ZSh7IG5hbWU6ICdmaWxlbmFtZScsIHZhbHVlOiB0aGlzLnByb3BzLml0ZW0uZmlsZW5hbWUgfSk7XG4gICAgfVxuXG59XG5cbkVkaXRvci5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBzZXRFZGl0aW5nOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRWRpdG9yO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgRWRpdG9yIGZyb20gJy4vZWRpdG9yJztcbmltcG9ydCBJdGVtIGZyb20gJy4vaXRlbSc7XG5pbXBvcnQgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2dhbGxlcnlBY3Rpb25zJztcbmltcG9ydCBpdGVtU3RvcmUgZnJvbSAnLi4vc3RvcmUvaXRlbVN0b3JlJztcblxuLyoqXG4gKiBAZnVuYyBnZXRJdGVtU3RvcmVTdGF0ZVxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqIEBkZXNjIEZhY3RvcnkgZm9yIGdldHRpbmcgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIEl0ZW1TdG9yZS5cbiAqL1xuZnVuY3Rpb24gZ2V0SXRlbVN0b3JlU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXRlbXM6IGl0ZW1TdG9yZS5nZXRBbGwoKVxuICAgIH07XG59XG5cbmNsYXNzIEdhbGxlcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHZhciBpdGVtcyA9IHdpbmRvdy5TU19BU1NFVF9HQUxMRVJZW3RoaXMucHJvcHMubmFtZV07XG5cbiAgICAgICAgLy8gTWFudWFsbHkgYmluZCBzbyBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgY29ycmVjdGx5XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMuc2V0U3RvcmVQcm9wcyh7XG4gICAgICAgICAgICBkYXRhX3VybDogcHJvcHMuZGF0YV91cmwsXG4gICAgICAgICAgICB1cGRhdGVfdXJsOiBwcm9wcy51cGRhdGVfdXJsLFxuICAgICAgICAgICAgZGVsZXRlX3VybDogcHJvcHMuZGVsZXRlX3VybCxcbiAgICAgICAgICAgIGluaXRpYWxfZm9sZGVyOiBwcm9wcy5pbml0aWFsX2ZvbGRlcixcbiAgICAgICAgICAgIGxpbWl0OiBwcm9wcy5saW1pdFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgc3RvcmUuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtc1tpXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGdhbGxlcnkuXG4gICAgICAgIHRoaXMuc3RhdGUgPSAkLmV4dGVuZChnZXRJdGVtU3RvcmVTdGF0ZSgpLCB7IGVkaXRpbmc6IGZhbHNlLCBjdXJyZW50SXRlbTogbnVsbCB9KTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgICAgIC8vIEB0b2RvXG4gICAgICAgIC8vIGlmIHdlIHdhbnQgdG8gaG9vayBpbnRvIGRpcnR5IGNoZWNraW5nLCB3ZSBuZWVkIHRvIGZpbmQgYSB3YXkgb2YgcmVmcmVzaGluZ1xuICAgICAgICAvLyBhbGwgbG9hZGVkIGRhdGEgbm90IGp1c3QgdGhlIGZpcnN0IHBhZ2UgYWdhaW4uLi5cblxuICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKCcuY21zLWNvbnRlbnQtZmllbGRzJyk7XG5cbiAgICAgICAgaWYgKCRjb250ZW50Lmxlbmd0aCkge1xuICAgICAgICAgICAgJGNvbnRlbnQub24oJ3Njcm9sbCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgkY29udGVudFswXS5zY3JvbGxIZWlnaHQgLSAkY29udGVudFswXS5zY3JvbGxUb3AgPT09ICRjb250ZW50WzBdLmNsaWVudEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBnYWxsZXJ5QWN0aW9ucy5wYWdlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgICAgICBpdGVtU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nKSB7XG4gICAgICAgICAgICBsZXQgZWRpdG9yQ29tcG9uZW50ID0gdGhpcy5nZXRFZGl0b3JDb21wb25lbnQoKTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG4gICAgICAgICAgICAgICAgICAgIHtlZGl0b3JDb21wb25lbnR9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5nZXRJdGVtQ29tcG9uZW50cygpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChpdGVtU3RvcmUuaGFzTmF2aWdhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICBidXR0b24gPSA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdzcy11aS1idXR0b24gdWktY29ybmVyLWFsbCBmb250LWljb24tbGV2ZWwtdXAnXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTmF2aWdhdGUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgIEJhY2tcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuICAgICAgICAgICAgICAgICAgICB7YnV0dG9ufVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeV9faXRlbXMnPlxuICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW1zfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVOYXZpZ2F0ZSgpIHtcbiAgICAgICAgbGV0IG5hdmlnYXRpb24gPSBpdGVtU3RvcmUucG9wTmF2aWdhdGlvbigpO1xuXG4gICAgICAgIGdhbGxlcnlBY3Rpb25zLm5hdmlnYXRlKG5hdmlnYXRpb25bMV0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIG9uQ2hhbmdlXG4gICAgICogQGRlc2MgVXBkYXRlcyB0aGUgZ2FsbGVyeSBzdGF0ZSB3aGVuIHNvbWV0aG5pZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBvbkNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShnZXRJdGVtU3RvcmVTdGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBzZXRFZGl0aW5nXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpc0VkaXRpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2lkXVxuICAgICAqIEBkZXNjIFN3aXRjaGVzIGJldHdlZW4gZWRpdGluZyBhbmQgZ2FsbGVyeSBzdGF0ZXMuXG4gICAgICovXG4gICAgc2V0RWRpdGluZyhpc0VkaXRpbmcsIGlkKSB7XG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IHsgZWRpdGluZzogaXNFZGl0aW5nIH07XG5cbiAgICAgICAgaWYgKGlkICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50SXRlbSA9IGl0ZW1TdG9yZS5nZXRCeUlkKGlkKTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRJdGVtICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKCQuZXh0ZW5kKG5ld1N0YXRlLCB7IGN1cnJlbnRJdGVtOiBjdXJyZW50SXRlbSB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGdldEVkaXRvckNvbXBvbmVudFxuICAgICAqIEBkZXNjIEdlbmVyYXRlcyB0aGUgZWRpdG9yIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBnZXRFZGl0b3JDb21wb25lbnQoKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IHt9O1xuXG4gICAgICAgIHByb3BzLml0ZW0gPSB0aGlzLnN0YXRlLmN1cnJlbnRJdGVtO1xuICAgICAgICBwcm9wcy5zZXRFZGl0aW5nID0gdGhpcy5zZXRFZGl0aW5nLmJpbmQodGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxFZGl0b3Igey4uLnByb3BzfSAvPlxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGdldEl0ZW1Db21wb25lbnRzXG4gICAgICogQGRlc2MgR2VuZXJhdGVzIHRoZSBpdGVtIGNvbXBvbmVudHMgd2hpY2ggcG9wdWxhdGUgdGhlIGdhbGxlcnkuXG4gICAgICovXG4gICAgZ2V0SXRlbUNvbXBvbmVudHMoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5pdGVtcykubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gc2VsZi5zdGF0ZS5pdGVtc1trZXldLFxuICAgICAgICAgICAgICAgIHByb3BzID0ge307XG5cbiAgICAgICAgICAgIHByb3BzLmF0dHJpYnV0ZXMgPSBpdGVtLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICBwcm9wcy5pZCA9IGl0ZW0uaWQ7XG4gICAgICAgICAgICBwcm9wcy5zZXRFZGl0aW5nID0gdGhpcy5zZXRFZGl0aW5nLmJpbmQodGhpcyk7XG4gICAgICAgICAgICBwcm9wcy50aXRsZSA9IGl0ZW0udGl0bGU7XG4gICAgICAgICAgICBwcm9wcy51cmwgPSBpdGVtLnVybDtcbiAgICAgICAgICAgIHByb3BzLnR5cGUgPSBpdGVtLnR5cGU7XG4gICAgICAgICAgICBwcm9wcy5maWxlbmFtZSA9IGl0ZW0uZmlsZW5hbWU7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEl0ZW0ga2V5PXtrZXl9IHsuLi5wcm9wc30gLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FsbGVyeTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZWRpdG9yQWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZWRpdG9yQWN0aW9ucyc7XG5cbmNsYXNzIElucHV0RmllbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGlucHV0IGNsYXNzTmFtZT0ndGV4dCcgdHlwZT0ndGV4dCcgdmFsdWU9e3RoaXMucHJvcHMudmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfSAvPlxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgaGFuZGxlQ2hhbmdlXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuXHQgKiBAZGVzYyBIYW5kbGVzIHRoZSBjaGFuZ2UgZXZlbnRzIG9uIGlucHV0IGZpZWxkcy5cblx0ICovXG5cdGhhbmRsZUNoYW5nZShldmVudCkge1xuXHRcdGVkaXRvckFjdGlvbnMudXBkYXRlKHsgbmFtZTogdGhpcy5wcm9wcy5uYW1lLCB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5wdXRGaWVsZDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2dhbGxlcnlBY3Rpb25zJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5jbGFzcyBJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIHN0eWxlcyA9IHRoaXMuZ2V0SW1hZ2VVUkwoKSxcbiAgICAgICAgICAgIHRodW1ibmFpbENsYXNzTmFtZXMgPSAnaXRlbV9fdGh1bWJuYWlsJyxcbiAgICAgICAgICAgIGl0ZW1DbGFzc05hbWVzID0gY2xhc3NOYW1lcyh7XG4gICAgICAgICAgICAgICAgJ2l0ZW0nOiB0cnVlLFxuICAgICAgICAgICAgICAgICdmb2xkZXInOiB0aGlzLnByb3BzLnR5cGUgPT09ICdmb2xkZXInXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5pbWFnZUxhcmdlclRoYW5UaHVtYm5haWwoKSkge1xuICAgICAgICAgICAgdGh1bWJuYWlsQ2xhc3NOYW1lcyArPSAnIGxhcmdlJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuYXZpZ2F0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGEgZm9sZGVyJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMudHlwZSA9PT0gJ2ZvbGRlcicpIHtcbiAgICAgICAgICAgIG5hdmlnYXRlID0gdGhpcy5oYW5kbGVOYXZpZ2F0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtpdGVtQ2xhc3NOYW1lcyArICcgJyArIHRoaXMucHJvcHMudHlwZX0gb25DbGljaz17bmF2aWdhdGV9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aHVtYm5haWxDbGFzc05hbWVzfSBzdHlsZT17c3R5bGVzfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnMnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tcmVtb3ZlIFsgZm9udC1pY29uLXRyYXNoIF0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRGVsZXRlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tZWRpdCBbIGZvbnQtaWNvbi1lZGl0IF0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRWRpdC5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSdpdGVtX190aXRsZSc+e3RoaXMucHJvcHMudGl0bGV9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlRWRpdFxuICAgICAqIEBkZXNjIEV2ZW50IGhhbmRsZXIgZm9yIHRoZSAnZWRpdCcgYnV0dG9uLlxuICAgICAqL1xuICAgIGhhbmRsZUVkaXQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0RWRpdGluZyh0cnVlLCB0aGlzLnByb3BzLmlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciB0aGUgJ2VkaXQnIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBoYW5kbGVOYXZpZ2F0ZSgpIHtcbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMubmF2aWdhdGUodGhpcy5wcm9wcy5maWxlbmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgdGhlICdyZW1vdmUnIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBoYW5kbGVEZWxldGUoKSB7XG4gICAgICAgIC8vVE9ETyBpbnRlcm5hdGlvbmFsaXNlIGNvbmZpcm1hdGlvbiBtZXNzYWdlIHdpdGggdHJhbnNpZmV4IGlmL3doZW4gbWVyZ2VkIGludG8gY29yZVxuICAgICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHJlY29yZD8nKSkge1xuICAgICAgICAgICAgZ2FsbGVyeUFjdGlvbnMuZGVzdHJveSh0aGlzLnByb3BzLmlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGdldEltYWdlVVJMXG4gICAgICogQGRlc2MgUmV0dXJuIHRoZSBVUkwgb2YgdGhlIGltYWdlLCBkZXRlcm1pbmVkIGJ5IGl0J3MgdHlwZS4gXG4gICAgICovXG4gICAgZ2V0SW1hZ2VVUkwoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnR5cGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdpbWFnZScpID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB7YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyB0aGlzLnByb3BzLnVybCArICcpJ307XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBpbWFnZUxhcmdlclRoYW5UaHVtYm5haWxcbiAgICAgKiBAZGVzYyBDaGVjayBpZiBhbiBpbWFnZSBpcyBsYXJnZXIgdGhhbiB0aGUgdGh1bWJuYWlsIGNvbnRhaW5lci5cbiAgICAgKi9cbiAgICBpbWFnZUxhcmdlclRoYW5UaHVtYm5haWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy5oZWlnaHQgPiBDT05TVEFOVFMuSVRFTV9DT01QT05FTlQuVEhVTUJOQUlMX0hFSUdIVCB8fCBcbiAgICAgICAgICAgICAgIHRoaXMucHJvcHMuYXR0cmlidXRlcy5kaW1lbnNpb25zLndpZHRoID4gQ09OU1RBTlRTLklURU1fQ09NUE9ORU5ULlRIVU1CTkFJTF9XSURUSDtcbiAgICB9XG59XG5cbkl0ZW0ucHJvcFR5cGVzID0ge1xuICAgIGF0dHJpYnV0ZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgc2V0RWRpdGluZzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgdGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgdHlwZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICB1cmw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG4iLCJjb25zdCBDT05TVEFOVFMgPSB7XG5cdElURU1fU1RPUkU6IHtcblx0XHRJTklUOiAnaW5pdCcsXG5cdFx0Q0hBTkdFOiAnY2hhbmdlJyxcblx0XHRDUkVBVEU6ICdjcmVhdGUnLFxuXHRcdFVQREFURTogJ3VwZGF0ZScsXG5cdFx0REVTVFJPWTogJ2Rlc3Ryb3knLFxuXHRcdE5BVklHQVRFOiAnbmF2aWdhdGUnLFxuXHRcdFBBR0U6ICdwYWdlJ1xuXHR9LFxuXHRFRElUT1I6IHtcblx0XHRDSEFOR0U6ICdjaGFuZ2UnLFxuXHRcdFVQREFURTogJ3VwZGF0ZScsXG5cdFx0Q0xFQVI6ICdjbGVhcidcblx0fSxcblx0SVRFTV9DT01QT05FTlQ6IHtcblx0XHRUSFVNQk5BSUxfSEVJR0hUOiAxNTAsXG5cdFx0VEhVTUJOQUlMX1dJRFRIOiAyMDBcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ09OU1RBTlRTO1xuIiwiaW1wb3J0IHtEaXNwYXRjaGVyfSBmcm9tICdmbHV4JztcblxubGV0IF9lZGl0b3JEaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTsgLy8gU2luZ2xldG9uXG5cbmV4cG9ydCBkZWZhdWx0IF9lZGl0b3JEaXNwYXRjaGVyO1xuIiwiaW1wb3J0IHtEaXNwYXRjaGVyfSBmcm9tICdmbHV4JztcblxubGV0IF9nYWxsZXJ5RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7IC8vIFNpbmdsZXRvblxuXG5leHBvcnQgZGVmYXVsdCBfZ2FsbGVyeURpc3BhdGNoZXI7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBHYWxsZXJ5IGZyb20gJy4vY29tcG9uZW50L2dhbGxlcnknO1xuXG4kKCcuYXNzZXQtZ2FsbGVyeScpLmVudHdpbmUoe1xuXHQnb25hZGQnOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHByb3BzID0ge307XG5cblx0XHRwcm9wcy5uYW1lID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1uYW1lJyk7XG5cdFx0cHJvcHMuZGF0YV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRhdGEtdXJsJyk7XG5cdFx0cHJvcHMudXBkYXRlX3VybCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktdXBkYXRlLXVybCcpO1xuXHRcdHByb3BzLmRlbGV0ZV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRlbGV0ZS11cmwnKTtcblx0XHRwcm9wcy5pbml0aWFsX2ZvbGRlciA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktaW5pdGlhbC1mb2xkZXInKTtcblx0XHRwcm9wcy5saW1pdCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktbGltaXQnKTtcblxuXHRcdGlmIChwcm9wcy5uYW1lID09PSBudWxsIHx8IHByb3BzLnVybCA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdFJlYWN0LnJlbmRlcihcblx0XHRcdDxHYWxsZXJ5IHsuLi5wcm9wc30gLz4sXG5cdFx0XHR0aGlzWzBdXG5cdFx0KTtcblx0fVxufSk7XG4iLCJpbXBvcnQgZWRpdG9yRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2VkaXRvckRpc3BhdGNoZXInO1xuaW1wb3J0IGVkaXRvckFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2VkaXRvckFjdGlvbnMnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgX2ZpZWxkcyA9IFtdO1xuXG5mdW5jdGlvbiBjcmVhdGUoZGF0YSkge1xuXHR2YXIgZmllbGRFeGlzdHMgPSBfZmllbGRzLmZpbHRlcigoZmllbGQpID0+IHsgcmV0dXJuIGZpZWxkLm5hbWUgPT09IGRhdGEubmFtZTsgfSkubGVuZ3RoID4gMDtcblxuXHRpZiAoZmllbGRFeGlzdHMpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRfZmllbGRzLnB1c2goe1xuXHRcdG5hbWU6IGRhdGEubmFtZSxcblx0XHR2YWx1ZTogZGF0YS52YWx1ZVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKGRhdGEpIHtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBfZmllbGRzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0aWYgKF9maWVsZHNbaV0ubmFtZSA9PT0gZGF0YS5uYW1lKSB7XG5cdFx0XHRfZmllbGRzW2ldID0gZGF0YTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBjbGVhcigpIHtcblx0X2ZpZWxkcyA9IFtdO1xufVxuXG5jbGFzcyBFZGl0b3JTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0LyoqXG5cdCAqIEByZXR1cm4ge29iamVjdH1cblx0ICogQGRlc2MgR2V0cyB0aGUgZW50aXJlIGNvbGxlY3Rpb24gb2YgaXRlbXMuXG5cdCAqL1xuXHRnZXRBbGwoKSB7XG5cdFx0cmV0dXJuIF9maWVsZHM7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZW1pdENoYW5nZVxuXHQgKiBAZGVzYyBUcmlnZ2VyZWQgd2hlbiBzb21ldGhpbmcgY2hhbmdlcyBpbiB0aGUgc3RvcmUuXG5cdCAqL1xuXHRlbWl0Q2hhbmdlKCkge1xuXHRcdHRoaXMuZW1pdChDT05TVEFOVFMuRURJVE9SLkNIQU5HRSk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcblx0ICovXG5cdGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5vbihDT05TVEFOVFMuRURJVE9SLkNIQU5HRSwgY2FsbGJhY2spO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqL1xuXHRyZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoQ09OU1RBTlRTLkVESVRPUi5DSEFOR0UsIGNhbGxiYWNrKTtcblx0fVxuXG59XG5cbmxldCBfZWRpdG9yU3RvcmUgPSBuZXcgRWRpdG9yU3RvcmUoKTsgLy8gU2luZ2xldG9uLlxuXG5lZGl0b3JEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cblx0c3dpdGNoKHBheWxvYWQuYWN0aW9uKSB7XG5cdFx0Y2FzZSBDT05TVEFOVFMuRURJVE9SLkNSRUFURTpcblx0XHRcdGNyZWF0ZShwYXlsb2FkLmRhdGEpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9lZGl0b3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBDT05TVEFOVFMuRURJVE9SLlVQREFURTpcblx0XHRcdHVwZGF0ZShwYXlsb2FkLmRhdGEpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9lZGl0b3JTdG9yZS5lbWl0Q2hhbmdlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBDT05TVEFOVFMuRURJVE9SLkNMRUFSOlxuXHRcdFx0Y2xlYXIoKTtcblxuXHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRfZWRpdG9yU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRydWU7IC8vIE5vIGVycm9ycy4gTmVlZGVkIGJ5IHByb21pc2UgaW4gRGlzcGF0Y2hlci5cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF9lZGl0b3JTdG9yZTtcbiIsImltcG9ydCBnYWxsZXJ5RGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2dhbGxlcnlEaXNwYXRjaGVyJztcbmltcG9ydCBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZ2FsbGVyeUFjdGlvbnMnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIF9pdGVtcyA9IFtdO1xudmFyIF9mb2xkZXJzID0gW107XG52YXIgX2N1cnJlbnRGb2xkZXIgPSBudWxsO1xuXG52YXIgX2ZpbHRlcnMgPSB7XG5cdCdwYWdlJzogMSxcblx0J2xpbWl0JzogMTBcbn07XG5cbi8qKlxuICogQGZ1bmMgaW5pdFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG4gKiBAZGVzYyBTZXRzIHByb3BlcnRpZXMgb24gdGhlIHN0b3JlLlxuICovXG5mdW5jdGlvbiBpbml0KGRhdGEpIHtcblx0T2JqZWN0LmtleXMoZGF0YSkubWFwKChrZXkpID0+IHtcblx0XHRfaXRlbVN0b3JlW2tleV0gPSBkYXRhW2tleV07XG5cdH0pO1xufVxuXG4vKipcbiAqIEBmdW5jIGNyZWF0ZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtRGF0YVxuICogQGRlc2MgQWRkcyBhIGdhbGxlcnkgaXRlbSB0byB0aGUgc3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShpdGVtRGF0YSkge1xuXHR2YXIgaXRlbUV4aXN0cyA9IF9pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHsgcmV0dXJuIGl0ZW0uaWQgPT09IGl0ZW1EYXRhLmlkOyB9KS5sZW5ndGggPiAwO1xuXG5cdGlmIChpdGVtRXhpc3RzKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0X2l0ZW1zLnB1c2goaXRlbURhdGEpO1xufVxuXG4vKipcbiAqIEBmdW5jIGRlc3Ryb3lcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2ludH0gaWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAZGVzYyBSZW1vdmVzIGEgZ2FsbGVyeSBpdGVtIGZyb20gdGhlIHN0b3JlLlxuICovXG5mdW5jdGlvbiBkZXN0cm95KGlkLCBjYWxsYmFjaykge1xuXHQkLmFqYXgoeyAvLyBAdG9kbyBmaXggdGhpcyBqdW5rXG5cdFx0J3VybCc6IF9pdGVtU3RvcmUuZGVsZXRlX3VybCxcblx0XHQnZGF0YSc6IHtcblx0XHRcdCdpZCc6IGlkXG5cdFx0fSxcblx0XHQnZGF0YVR5cGUnOiAnanNvbicsXG5cdFx0J21ldGhvZCc6ICdHRVQnLFxuXHRcdCdzdWNjZXNzJzogKGRhdGEpID0+IHtcblx0XHRcdHZhciBpdGVtSW5kZXggPSAtMTtcblxuXHRcdFx0Ly8gR2V0IHRoZSBpbmRleCBvZiB0aGUgaXRlbSB3ZSBoYXZlIGRlbGV0ZWRcblx0XHRcdC8vIHNvIGl0IGNhbiBiZSByZW1vdmVkIGZyb20gdGhlIHN0b3JlLlxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBfaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdFx0aWYgKF9pdGVtc1tpXS5pZCA9PT0gaWQpIHtcblx0XHRcdFx0XHRpdGVtSW5kZXggPSBpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpdGVtSW5kZXggPT09IC0xKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0X2l0ZW1zLnNwbGljZShpdGVtSW5kZXgsIDEpO1xuXG5cdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdH1cblx0fSk7XG59XG5cbi8qKlxuICogTmF2aWdhdGVzIHRvIGEgbmV3IGZvbGRlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb2xkZXJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIG5hdmlnYXRlKGZvbGRlciwgY2FsbGJhY2spIHtcblx0X2ZpbHRlcnMucGFnZSA9IDE7XG5cdF9maWx0ZXJzLmZvbGRlciA9IGZvbGRlcjtcblxuXHQkLmFqYXgoe1xuXHRcdCd1cmwnOiBfaXRlbVN0b3JlLmRhdGFfdXJsLFxuXHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHQnZGF0YSc6IHtcblx0XHRcdCdmb2xkZXInOiBfZmlsdGVycy5mb2xkZXIsXG5cdFx0XHQncGFnZSc6IF9maWx0ZXJzLnBhZ2UrKyxcblx0XHRcdCdsaW1pdCc6IF9pdGVtU3RvcmUubGltaXRcblx0XHR9LFxuXHRcdCdzdWNjZXNzJzogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0X2l0ZW1zID0gW107XG5cblx0XHRcdF9maWx0ZXJzLmNvdW50ID0gZGF0YS5jb3VudDtcblxuXHRcdFx0aWYgKGZvbGRlciAhPT0gX2l0ZW1TdG9yZS5pbml0aWFsX2ZvbGRlcikge1xuXHRcdFx0XHRfZm9sZGVycy5wdXNoKFtmb2xkZXIsIF9jdXJyZW50Rm9sZGVyIHx8IF9pdGVtU3RvcmUuaW5pdGlhbF9mb2xkZXJdKTtcblx0XHRcdH1cblxuXHRcdFx0X2N1cnJlbnRGb2xkZXIgPSBmb2xkZXI7XG5cblx0XHRcdGRhdGEuZmlsZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0XHRnYWxsZXJ5QWN0aW9ucy5jcmVhdGUoaXRlbSwgdHJ1ZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHR9XG5cdH0pXG59XG5cbmZ1bmN0aW9uIHBhZ2UoY2FsbGJhY2spIHtcblx0aWYgKF9pdGVtcy5sZW5ndGggPCBfZmlsdGVycy5jb3VudCkge1xuXHRcdCQuYWpheCh7XG5cdFx0XHQndXJsJzogX2l0ZW1TdG9yZS5kYXRhX3VybCxcblx0XHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHRcdCdkYXRhJzoge1xuXHRcdFx0XHQnZm9sZGVyJzogX2ZpbHRlcnMuZm9sZGVyLFxuXHRcdFx0XHQncGFnZSc6IF9maWx0ZXJzLnBhZ2UrKyxcblx0XHRcdFx0J2xpbWl0JzogX2l0ZW1TdG9yZS5saW1pdFxuXHRcdFx0fSxcblx0XHRcdCdzdWNjZXNzJzogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRkYXRhLmZpbGVzLmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdFx0XHRnYWxsZXJ5QWN0aW9ucy5jcmVhdGUoaXRlbSwgdHJ1ZSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuXG4vKipcbiAqIEBmdW5jIHVwZGF0ZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW1EYXRhXG4gKiBAZGVzYyBVcGRhdGVzIGFuIGl0ZW0gaW4gdGhlIHN0b3JlLlxuICovXG5mdW5jdGlvbiB1cGRhdGUoaWQsIGl0ZW1EYXRhKSB7XG5cdC8vIFRPRE86XG59XG5cbmNsYXNzIEl0ZW1TdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZ2FsbGVyeSBoYXMgYmVlbiBuYXZpZ2F0ZWQuXG5cdCAqL1xuXHRoYXNOYXZpZ2F0ZWQoKSB7XG5cdFx0cmV0dXJuIF9mb2xkZXJzLmxlbmd0aCA+IDA7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgZm9sZGVyIHN0YWNrLlxuXHQgKi9cblx0cG9wTmF2aWdhdGlvbigpIHtcblx0XHRyZXR1cm4gX2ZvbGRlcnMucG9wKCk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKiBAZGVzYyBHZXRzIHRoZSBlbnRpcmUgY29sbGVjdGlvbiBvZiBpdGVtcy5cblx0ICovXG5cdGdldEFsbCgpIHtcblx0XHRyZXR1cm4gX2l0ZW1zO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIGdldEJ5SWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkXG5cdCAqIEByZXR1cm4ge29iamVjdH1cblx0ICovXG5cdGdldEJ5SWQoaWQpIHtcblx0XHR2YXIgaXRlbSA9IG51bGw7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IF9pdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0aWYgKF9pdGVtc1tpXS5pZCA9PT0gaWQpIHtcblx0XHRcdFx0aXRlbSA9IF9pdGVtc1tpXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW07XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZW1pdENoYW5nZVxuXHQgKiBAZGVzYyBUcmlnZ2VyZWQgd2hlbiBzb21ldGhpbmcgY2hhbmdlcyBpbiB0aGUgc3RvcmUuXG5cdCAqL1xuXHRlbWl0Q2hhbmdlKCkge1xuXHRcdHRoaXMuZW1pdChDT05TVEFOVFMuSVRFTV9TVE9SRS5DSEFOR0UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqL1xuXHRhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuXHRcdHRoaXMub24oQ09OU1RBTlRTLklURU1fU1RPUkUuQ0hBTkdFLCBjYWxsYmFjayk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcblx0ICovXG5cdHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcihDT05TVEFOVFMuSVRFTV9TVE9SRS5DSEFOR0UsIGNhbGxiYWNrKTtcblx0fVxufVxuXG5sZXQgX2l0ZW1TdG9yZSA9IG5ldyBJdGVtU3RvcmUoKTsgLy8gU2luZ2xldG9uXG5cbmdhbGxlcnlEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cdHN3aXRjaChwYXlsb2FkLmFjdGlvbikge1xuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuSU5JVDpcblx0XHRcdGluaXQocGF5bG9hZC5kYXRhKTtcblxuXHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLkNSRUFURTpcblx0XHRcdGNyZWF0ZShwYXlsb2FkLmRhdGEpO1xuXG5cdFx0XHRpZiAoIXBheWxvYWQuc2lsZW50KSB7XG5cdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgQ09OU1RBTlRTLklURU1fU1RPUkUuREVTVFJPWTpcblx0XHRcdGRlc3Ryb3kocGF5bG9hZC5kYXRhLmlkLCAoKSA9PiB7XG5cdFx0XHRcdGlmICghcGF5bG9hZC5zaWxlbnQpIHtcblx0XHRcdFx0XHRfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBDT05TVEFOVFMuSVRFTV9TVE9SRS5OQVZJR0FURTpcblx0XHRcdG5hdmlnYXRlKHBheWxvYWQuZGF0YS5mb2xkZXIsICgpID0+IHtcblx0XHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLlVQREFURTpcblx0XHRcdHVwZGF0ZShwYXlsb2FkLmRhdGEuaWQsIHBheWxvYWQuZGF0YS51cGRhdGVzKTtcblxuXHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRfaXRlbVN0b3JlLmVtaXRDaGFuZ2UoKTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIENPTlNUQU5UUy5JVEVNX1NUT1JFLlBBR0U6XG5cdFx0XHRwYWdlKCgpID0+IHtcblx0XHRcdFx0aWYgKCFwYXlsb2FkLnNpbGVudCkge1xuXHRcdFx0XHRcdF9pdGVtU3RvcmUuZW1pdENoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTsgLy8gTm8gZXJyb3JzLiBOZWVkZWQgYnkgcHJvbWlzZSBpbiBEaXNwYXRjaGVyLlxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF9pdGVtU3RvcmU7XG4iXX0=

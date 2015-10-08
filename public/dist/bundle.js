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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _default = (function (_React$Component) {
	_inherits(_default, _React$Component);

	function _default() {
		_classCallCheck(this, _default);

		_get(Object.getPrototypeOf(_default.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(_default, [{
		key: 'render',
		value: function render() {
			var textInputs = this.getTextInputs();

			return _react2['default'].createElement(
				'div',
				{ className: 'editor' },
				_react2['default'].createElement(
					'form',
					null,
					_react2['default'].createElement(
						'div',
						{ className: 'CompositeField composite cms-file-info nolabel' },
						_react2['default'].createElement(
							'div',
							{ className: 'CompositeField composite cms-file-info-preview nolabel' },
							_react2['default'].createElement('img', { className: 'thumbnail-preview', src: this.props.file.url })
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
											this.props.file.type
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
										this.props.file.size
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
											{ href: this.props.file.url, target: '_blank' },
											this.props.file.url
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
										this.props.file.created
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
										this.props.file.lastUpdated
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
										this.props.file.attributes.dimensions.width,
										' x ',
										this.props.file.attributes.dimensions.height,
										'px'
									)
								)
							)
						)
					),
					textInputs,
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
							{ type: 'button', className: 'ss-ui-button ui-corner-all font-icon-cancel-circled', onClick: this.props.onListClick },
							'Cancel'
						)
					)
				)
			);
		}
	}, {
		key: 'getTextInputs',
		value: function getTextInputs() {
			var fields = [{ 'name': 'title', 'value': this.props.file.title }, { 'name': 'filename', 'value': this.props.file.filename }];

			return fields.map(function (field) {
				return _react2['default'].createElement(
					'div',
					{ className: 'field text' },
					_react2['default'].createElement(
						'label',
						{ className: 'left' },
						field.name
					),
					_react2['default'].createElement(
						'div',
						{ className: 'middleColumn' },
						_react2['default'].createElement('input', { type: 'text', name: field.name, value: field.value })
					)
				);
			});
		}
	}]);

	return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];

},{"jquery":"jquery","react":"react"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _default = (function (_React$Component) {
	_inherits(_default, _React$Component);

	function _default() {
		_classCallCheck(this, _default);

		_get(Object.getPrototypeOf(_default.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(_default, [{
		key: 'render',
		value: function render() {
			var _this = this;

			var itemClassNames = this.getItemClassNames();
			var thumbnailStyles = this.getThumbnailStyles();
			var thumbnailClassNames = this.getThumbnailClassNames();

			var onFileNavigate = function onFileNavigate() {
				return null;
			};

			if (this.props.type === 'folder') {
				onFileNavigate = function (event) {
					_this.props.onFileNavigate(_this.props, event);
				};
			}

			var onFileDelete = function onFileDelete(event) {
				_this.props.onFileDelete(_this.props, event);
			};

			var onFileEdit = function onFileEdit(event) {
				_this.props.onFileEdit(_this.props, event);
			};

			return _react2['default'].createElement(
				'div',
				{ className: itemClassNames, onClick: onFileNavigate },
				_react2['default'].createElement(
					'div',
					{ className: thumbnailClassNames, style: thumbnailStyles },
					_react2['default'].createElement(
						'div',
						{ className: 'item__actions' },
						_react2['default'].createElement('button', {
							className: 'item__actions__action item__actions__action--remove [ font-icon-trash ]',
							type: 'button',
							onClick: onFileDelete }),
						_react2['default'].createElement('button', {
							className: 'item__actions__action item__actions__action--edit [ font-icon-edit ]',
							type: 'button',
							onClick: onFileEdit })
					)
				),
				_react2['default'].createElement(
					'p',
					{ className: 'item__title' },
					this.props.title
				)
			);
		}
	}, {
		key: 'getItemClassNames',
		value: function getItemClassNames() {
			var itemClassNames = 'item ' + this.props.type;

			if (this.props.type === 'folder') {
				itemClassNames += ' folder';
			}

			return itemClassNames;
		}
	}, {
		key: 'getThumbnailClassNames',
		value: function getThumbnailClassNames() {
			var thumbnailClassNames = 'item__thumbnail';

			if (this.isImageLargerThanThumbnail()) {
				thumbnailClassNames += ' large';
			}

			return thumbnailClassNames;
		}
	}, {
		key: 'isImageLargerThanThumbnail',
		value: function isImageLargerThanThumbnail() {
			var dimensions = this.props.attributes.dimensions;

			return dimensions.height > _constants2['default'].THUMBNAIL_HEIGHT || dimensions.width > _constants2['default'].THUMBNAIL_WIDTH;
		}
	}, {
		key: 'getThumbnailStyles',
		value: function getThumbnailStyles() {
			if (this.props.type.toLowerCase().indexOf('image') > -1) {
				return {
					'backgroundImage': 'url(' + this.props.url + ')'
				};
			}

			return {};
		}
	}]);

	return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];

},{"../constants":6,"classnames":2,"jquery":"jquery","react":"react"}],5:[function(require,module,exports){
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

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fileComponent = require('./file-component');

var _fileComponent2 = _interopRequireDefault(_fileComponent);

var _editorComponent = require('./editor-component');

var _editorComponent2 = _interopRequireDefault(_editorComponent);

var _default = (function (_React$Component) {
	_inherits(_default, _React$Component);

	function _default(props) {
		_classCallCheck(this, _default);

		_get(Object.getPrototypeOf(_default.prototype), 'constructor', this).call(this, props);

		this.state = {
			'files': [],
			'editing': null
		};

		this.folders = [props.initial_folder];

		this.sort = 'name';
		this.direction = 'asc';
	}

	_createClass(_default, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this = this;

			this.props.store.on('onSearchData', function (data) {
				_this.setState({
					'count': data.count,
					'files': data.files
				});
			});

			this.props.store.on('onMoreData', function (data) {
				_this.setState({
					'count': data.count,
					'files': _this.state.files.concat(data.files)
				});
			});

			this.props.store.on('onNavigateData', function (data) {
				_this.setState({
					'count': data.count,
					'files': data.files
				});
			});

			this.props.store.on('onDeleteData', function (data) {
				_this.setState({
					'files': _this.state.files.filter(function (file) {
						return data !== file.id;
					})
				});
			});

			if (this.props.initial_folder !== this.props.current_folder) {
				this.onNavigate(this.props.current_folder);
			} else {
				this.props.store.emit('search');
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			if (this.state.editing) {
				return _react2['default'].createElement(
					'div',
					{ className: 'gallery' },
					_react2['default'].createElement(
						'button',
						{
							className: 'ss-ui-button ui-corner-all font-icon-level-up',
							onClick: this.onListClick.bind(this) },
						'back'
					),
					_react2['default'].createElement(_editorComponent2['default'], { file: this.state.editing,
						onListClick: this.onListClick.bind(this) })
				);
			}

			var fileComponents = this.getFileComponents();

			var sorts = [{ 'field': 'title', 'direction': 'asc', 'label': 'a-z' }, { 'field': 'title', 'direction': 'desc', 'label': 'z-a' }, { 'field': 'created', 'direction': 'desc', 'label': 'newest' }, { 'field': 'created', 'direction': 'asc', 'label': 'oldest' }];

			var sortButtons = sorts.map(function (sort) {
				var onSort = function onSort() {
					var folders = _this2.state.files.filter(function (file) {
						return file.type === 'folder';
					});
					var files = _this2.state.files.filter(function (file) {
						return file.type !== 'folder';
					});

					var comparator = function comparator(a, b) {
						if (sort.direction === 'asc') {
							if (a[sort.field] < b[sort.field]) {
								return -1;
							}

							if (a[sort.field] > b[sort.field]) {
								return 1;
							}
						} else {
							if (a[sort.field] > b[sort.field]) {
								return -1;
							}

							if (a[sort.field] < b[sort.field]) {
								return 1;
							}
						}

						return 0;
					};

					_this2.setState({
						'files': folders.sort(comparator).concat(files.sort(comparator))
					});
				};

				return _react2['default'].createElement(
					'button',
					{ onClick: onSort },
					sort.label
				);
			});

			var moreButton = null;

			if (this.state.count > this.state.files.length) {
				moreButton = _react2['default'].createElement(
					'button',
					{ onClick: this.onMoreClick.bind(this) },
					'more'
				);
			}

			var backButton = null;

			if (this.folders.length > 1) {
				backButton = _react2['default'].createElement(
					'button',
					{
						className: 'ss-ui-button ui-corner-all font-icon-level-up',
						onClick: this.onBackClick.bind(this) },
					'back'
				);
			}

			return _react2['default'].createElement(
				'div',
				{ className: 'gallery' },
				backButton,
				sortButtons,
				_react2['default'].createElement(
					'div',
					{ className: 'gallery__items' },
					fileComponents
				),
				moreButton
			);
		}
	}, {
		key: 'onListClick',
		value: function onListClick() {
			this.setState({
				'editing': null
			});
		}
	}, {
		key: 'getFileComponents',
		value: function getFileComponents() {
			var _this3 = this;

			return this.state.files.map(function (file) {
				return _react2['default'].createElement(_fileComponent2['default'], _extends({}, file, {
					onFileDelete: _this3.onFileDelete.bind(_this3),
					onFileEdit: _this3.onFileEdit.bind(_this3),
					onFileNavigate: _this3.onFileNavigate.bind(_this3)
				}));
			});
		}
	}, {
		key: 'onFileDelete',
		value: function onFileDelete(file, event) {
			event.stopPropagation();

			if (confirm('Are you sure you want to delete this record?')) {
				this.props.store.emit('delete', file.id);
			}
		}
	}, {
		key: 'onFileEdit',
		value: function onFileEdit(file, event) {
			event.stopPropagation();

			this.setState({
				'editing': file
			});
		}
	}, {
		key: 'onFileNavigate',
		value: function onFileNavigate(file) {
			this.folders.push(file.filename);
			this.props.store.emit('navigate', file.filename);
		}
	}, {
		key: 'onNavigate',
		value: function onNavigate(folder) {
			this.folders.push(folder);
			this.props.store.emit('navigate', folder);
		}
	}, {
		key: 'onMoreClick',
		value: function onMoreClick() {
			this.props.store.emit('more');
		}
	}, {
		key: 'onBackClick',
		value: function onBackClick() {
			if (this.folders.length > 1) {
				this.folders.pop();
				this.props.store.emit('navigate', this.folders[this.folders.length - 1]);
			}
		}
	}]);

	return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];

},{"./editor-component":3,"./file-component":4,"jquery":"jquery","react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	'THUMBNAIL_HEIGHT': 150,
	'THUMBNAIL_WIDTH': 200
};
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentGalleryComponent = require('./component/gallery-component');

var _componentGalleryComponent2 = _interopRequireDefault(_componentGalleryComponent);

var _storeFileStore = require('./store/file-store');

var _storeFileStore2 = _interopRequireDefault(_storeFileStore);

function getVar(name) {
	var parts = window.location.href.split('?');

	if (parts.length > 1) {
		parts = parts[1].split('#');
	}

	var variables = parts[0].split('&');

	for (var i = 0; i < variables.length; i++) {
		var _parts = variables[i].split('=');

		if (decodeURIComponent(_parts[0]) === name) {
			return decodeURIComponent(_parts[1]);
		}
	}

	return null;
}

(0, _jquery2['default'])('.asset-gallery').entwine({
	'onadd': function onadd() {
		var props = {
			'name': this[0].getAttribute('data-asset-gallery-name'),
			'initial_folder': this[0].getAttribute('data-asset-gallery-initial-folder')
		};

		if (props.name === null) {
			return;
		}

		var $search = (0, _jquery2['default'])('.cms-search-form');

		if ($search.find('[type=hidden][name="q[Folder]"]').length == 0) {
			$search.append('<input type="hidden" name="q[Folder]" />');
		}

		props.store = _storeFileStore2['default'].create(this[0].getAttribute('data-asset-gallery-search-url'), this[0].getAttribute('data-asset-gallery-update-url'), this[0].getAttribute('data-asset-gallery-delete-url'), this[0].getAttribute('data-asset-gallery-limit'), $search.find('[type=hidden][name="q[Folder]"]')).addEventListeners();

		props.store.emit('filter', getVar('q[Name]'), getVar('q[AppCategory]'), getVar('q[Folder]'), getVar('q[CreatedFrom]'), getVar('q[CreatedTo]'), getVar('q[CurrentFolderOnly]'));

		props.current_folder = getVar('q[Folder]') || props.initial_folder;

		_react2['default'].render(_react2['default'].createElement(_componentGalleryComponent2['default'], props), this[0]);
	}
});

},{"./component/gallery-component":5,"./store/file-store":8,"jquery":"jquery","react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var FileStore = (function (_Events) {
	_inherits(FileStore, _Events);

	_createClass(FileStore, null, [{
		key: 'create',
		value: function create() {
			for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
				parameters[_key] = arguments[_key];
			}

			return new (_bind.apply(FileStore, [null].concat(parameters)))();
		}
	}]);

	function FileStore(search_url, update_url, delete_url, limit, $folder) {
		_classCallCheck(this, FileStore);

		_get(Object.getPrototypeOf(FileStore.prototype), 'constructor', this).call(this);

		this.search_url = search_url;
		this.update_url = update_url; // @todo
		this.delete_url = delete_url;
		this.limit = limit;
		this.$folder = $folder;

		this.page = 1;
	}

	_createClass(FileStore, [{
		key: 'addEventListeners',
		value: function addEventListeners() {
			this.on('search', this.onSearch.bind(this));
			this.on('more', this.onMore.bind(this));
			this.on('navigate', this.onNavigate.bind(this));
			this.on('delete', this.onDelete.bind(this));
			this.on('filter', this.onFilter.bind(this));

			return this;
		}
	}, {
		key: 'removeEventListeners',
		value: function removeEventListeners() {
			this.removeListener('search');
			this.removeListener('more');
			this.removeListener('navigate');
			this.removeListener('delete');
			this.removeListener('filter');

			return this;
		}
	}, {
		key: 'onSearch',
		value: function onSearch() {
			var _this = this;

			this.page = 1;

			this.request('GET', this.search_url).then(function (json) {
				_this.emit('onSearchData', json);
			});
		}
	}, {
		key: 'onMore',
		value: function onMore() {
			var _this2 = this;

			this.page++;

			this.request('GET', this.search_url).then(function (json) {
				_this2.emit('onMoreData', json);
			});
		}
	}, {
		key: 'onNavigate',
		value: function onNavigate(folder) {
			var _this3 = this;

			this.page = 1;
			this.folder = folder;

			this.persistFolderFilter(folder);

			this.request('GET', this.search_url).then(function (json) {
				_this3.emit('onNavigateData', json);
			});
		}
	}, {
		key: 'persistFolderFilter',
		value: function persistFolderFilter(folder) {
			if (folder.substr(-1) === '/') {
				folder = folder.substr(0, folder.length - 1);
			}

			this.$folder.val(folder);
		}
	}, {
		key: 'onDelete',
		value: function onDelete(id) {
			var _this4 = this;

			this.request('GET', this.delete_url, {
				'id': id
			}).then(function () {
				_this4.emit('onDeleteData', id);
			});
		}
	}, {
		key: 'onFilter',
		value: function onFilter(name, type, folder, createdFrom, createdTo, onlySearchInFolder) {
			this.name = name;
			this.type = type;
			this.folder = folder;
			this.createdFrom = createdFrom;
			this.createdTo = createdTo;
			this.onlySearchInFolder = onlySearchInFolder;

			this.onSearch();
		}
	}, {
		key: 'request',
		value: function request(method, url) {
			var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			var defaults = {
				'limit': this.limit,
				'page': this.page
			};

			if (this.name && this.name.trim() !== '') {
				defaults.name = decodeURIComponent(this.name);
			}

			if (this.folder && this.folder.trim() !== '') {
				defaults.folder = decodeURIComponent(this.folder);
			}

			if (this.createdFrom && this.createdFrom.trim() !== '') {
				defaults.createdFrom = decodeURIComponent(this.createdFrom);
			}

			if (this.createdTo && this.createdTo.trim() !== '') {
				defaults.createdTo = decodeURIComponent(this.createdTo);
			}

			if (this.onlySearchInFolder && this.onlySearchInFolder.trim() !== '') {
				defaults.onlySearchInFolder = decodeURIComponent(this.onlySearchInFolder);
			}

			return _jquery2['default'].ajax({
				'url': url,
				'method': method,
				'dataType': 'json',
				'data': _jquery2['default'].extend(data, defaults)
			});
		}
	}]);

	return FileStore;
})(_events2['default']);

expor
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbI},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZWRpdG9yLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2ZpbGUtY29tcG9uZW50LmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZ2FsbGVyeS1jb21wb25lbnQuanMiLCIvVXNlcnMvQ2hyaXN0b3BoZXIvU291cmNlL2Fzc2VydGNocmlzL3NpbHZlcnN0cmlwZS13b3JrYmVuY2gvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvc3RvcmUvZmlsZS1zdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JDaERjLFFBQVE7Ozs7cUJBQ0osT0FB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RyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEQ7O0FBRUQsT0FBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUNyRSxZQUFRLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDMUU7O0FBRUQsVUFBTyxvQkFBRSxJQUFJLENBQUM7QUFDYixTQUFLLEVBQUUsR0FBRztBQUNWLFlBQVEsRUFBRSxNQUFNO0FBQ2hCLGNBQVUsRUFBRSxNQUFNO0FBQ2xCLFVBQU0sRUFBRSxvQkFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztJQUNoQyxDQUFDLENBQUM7R0FDSDs7O1FBM0htQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE1IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSAnJztcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmIChhcmdUeXBlID09PSAnc3RyaW5nJyB8fCBhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGFyZztcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBrZXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblx0cmVuZGVyKCkge1xuXHRcdGxldCB0ZXh0SW5wdXRzID0gdGhpcy5nZXRUZXh0SW5wdXRzKCk7XG5cblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2VkaXRvcic+XG5cdFx0XHQ8Zm9ybT5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvIG5vbGFiZWwnPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1wcmV2aWV3IG5vbGFiZWwnPlxuXHRcdFx0XHRcdFx0PGltZyBjbGFzc05hbWU9J3RodW1ibmFpbC1wcmV2aWV3JyBzcmM9e3RoaXMucHJvcHMuZmlsZS51cmx9IC8+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvLWRhdGEgbm9sYWJlbCc+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIG5vbGFiZWwnPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpbGUgdHlwZTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS50eXBlfTwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpbGUgc2l6ZTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLnNpemV9PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+VVJMOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj17dGhpcy5wcm9wcy5maWxlLnVybH0gdGFyZ2V0PSdfYmxhbmsnPnt0aGlzLnByb3BzLmZpbGUudXJsfTwvYT5cblx0XHRcdFx0XHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgZGF0ZV9kaXNhYmxlZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpcnN0IHVwbG9hZGVkOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuY3JlYXRlZH08L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgZGF0ZV9kaXNhYmxlZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkxhc3QgY2hhbmdlZDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmxhc3RVcGRhdGVkfTwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkRpbWVuc2lvbnM6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMud2lkdGh9IHgge3RoaXMucHJvcHMuZmlsZS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMuaGVpZ2h0fXB4PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHR7dGV4dElucHV0c31cblxuXHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdDxidXR0b24gdHlwZT0nc3VibWl0JyBjbGFzc05hbWU9XCJzcy11aS1idXR0b24gdWktY29ybmVyLWFsbCBmb250LWljb24tY2hlY2stbWFya1wiPlNhdmU8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkXCIgb25DbGljaz17dGhpcy5wcm9wcy5vbkxpc3RDbGlja30+Q2FuY2VsPC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9mb3JtPlxuXHRcdDwvZGl2Pjtcblx0fVxuXG5cdGdldFRleHRJbnB1dHMoKSB7XG5cdFx0bGV0IGZpZWxkcyA9IFtcblx0XHRcdHsnbmFtZSc6ICd0aXRsZScsICd2YWx1ZSc6IHRoaXMucHJvcHMuZmlsZS50aXRsZX0sXG5cdFx0XHR7J25hbWUnOiAnZmlsZW5hbWUnLCAndmFsdWUnOiB0aGlzLnByb3BzLmZpbGUuZmlsZW5hbWV9XG5cdFx0XTtcblxuXHRcdHJldHVybiBmaWVsZHMubWFwKChmaWVsZCkgPT4ge1xuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCB0ZXh0Jz5cblx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2ZpZWxkLm5hbWV9PC9sYWJlbD5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT17ZmllbGQubmFtZX0gdmFsdWU9e2ZpZWxkLnZhbHVlfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdH0pO1xuXHR9XG59XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IGNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdHJlbmRlcigpIHtcblx0XHRsZXQgaXRlbUNsYXNzTmFtZXMgPSB0aGlzLmdldEl0ZW1DbGFzc05hbWVzKCk7XG5cdFx0bGV0IHRodW1ibmFpbFN0eWxlcyA9IHRoaXMuZ2V0VGh1bWJuYWlsU3R5bGVzKCk7XG5cdFx0bGV0IHRodW1ibmFpbENsYXNzTmFtZXMgPSB0aGlzLmdldFRodW1ibmFpbENsYXNzTmFtZXMoKTtcblxuXHRcdHZhciBvbkZpbGVOYXZpZ2F0ZSA9ICgpID0+IG51bGw7XG5cblx0XHRpZiAodGhpcy5wcm9wcy50eXBlID09PSAnZm9sZGVyJykge1xuXHRcdFx0b25GaWxlTmF2aWdhdGUgPSAoZXZlbnQpID0+IHtcblx0XHRcdFx0dGhpcy5wcm9wcy5vbkZpbGVOYXZpZ2F0ZSh0aGlzLnByb3BzLCBldmVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IG9uRmlsZURlbGV0ZSA9IChldmVudCkgPT4ge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkZpbGVEZWxldGUodGhpcy5wcm9wcywgZXZlbnQpO1xuXHRcdH07XG5cblx0XHRsZXQgb25GaWxlRWRpdCA9IChldmVudCkgPT4ge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkZpbGVFZGl0KHRoaXMucHJvcHMsIGV2ZW50KTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtpdGVtQ2xhc3NOYW1lc30gb25DbGljaz17b25GaWxlTmF2aWdhdGV9PlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e3RodW1ibmFpbENsYXNzTmFtZXN9IHN0eWxlPXt0aHVtYm5haWxTdHlsZXN9PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naXRlbV9fYWN0aW9ucyc+XG5cdFx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1yZW1vdmUgWyBmb250LWljb24tdHJhc2ggXSdcblx0XHRcdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0XHRcdG9uQ2xpY2s9e29uRmlsZURlbGV0ZX0+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1lZGl0IFsgZm9udC1pY29uLWVkaXQgXSdcblx0XHRcdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0XHRcdG9uQ2xpY2s9e29uRmlsZUVkaXR9PlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PHAgY2xhc3NOYW1lPSdpdGVtX190aXRsZSc+e3RoaXMucHJvcHMudGl0bGV9PC9wPlxuXHRcdDwvZGl2Pjtcblx0fVxuXG5cdGdldEl0ZW1DbGFzc05hbWVzKCkge1xuXHRcdHZhciBpdGVtQ2xhc3NOYW1lcyA9ICdpdGVtICcgKyB0aGlzLnByb3BzLnR5cGU7XG5cblx0XHRpZiAodGhpcy5wcm9wcy50eXBlID09PSAnZm9sZGVyJykge1xuXHRcdFx0aXRlbUNsYXNzTmFtZXMgKz0gJyBmb2xkZXInO1xuXHRcdH1cblxuXHRcdHJldHVybiBpdGVtQ2xhc3NOYW1lcztcblx0fVxuXG5cdGdldFRodW1ibmFpbENsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIHRodW1ibmFpbENsYXNzTmFtZXMgPSAnaXRlbV9fdGh1bWJuYWlsJztcblxuXHRcdGlmICh0aGlzLmlzSW1hZ2VMYXJnZXJUaGFuVGh1bWJuYWlsKCkpIHtcblx0XHRcdHRodW1ibmFpbENsYXNzTmFtZXMgKz0gJyBsYXJnZSc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRodW1ibmFpbENsYXNzTmFtZXM7XG5cdH1cblxuXHRpc0ltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpIHtcblx0XHRsZXQgZGltZW5zaW9ucyA9IHRoaXMucHJvcHMuYXR0cmlidXRlcy5kaW1lbnNpb25zO1xuXG5cdFx0cmV0dXJuIGRpbWVuc2lvbnMuaGVpZ2h0ID4gY29uc3RhbnRzLlRIVU1CTkFJTF9IRUlHSFQgfHwgZGltZW5zaW9ucy53aWR0aCA+IGNvbnN0YW50cy5USFVNQk5BSUxfV0lEVEg7XG5cdH1cblxuXHRnZXRUaHVtYm5haWxTdHlsZXMoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMudHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ltYWdlJykgPiAtMSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0J2JhY2tncm91bmRJbWFnZSc6ICd1cmwoJyArIHRoaXMucHJvcHMudXJsICsgJyknXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7fTtcblx0fVxufVxuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRmlsZUNvbXBvbmVudCBmcm9tICcuL2ZpbGUtY29tcG9uZW50JztcbmltcG9ydCBFZGl0b3JDb21wb25lbnQgZnJvbSAnLi9lZGl0b3ItY29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuc3RhdGUgPSB7XG5cdFx0XHQnZmlsZXMnOiBbXSxcblx0XHRcdCdlZGl0aW5nJzogbnVsbFxuXHRcdH07XG5cblx0XHR0aGlzLmZvbGRlcnMgPSBbcHJvcHMuaW5pdGlhbF9mb2xkZXJdO1xuXG5cdFx0dGhpcy5zb3J0ID0gJ25hbWUnO1xuXHRcdHRoaXMuZGlyZWN0aW9uID0gJ2FzYyc7XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR0aGlzLnByb3BzLnN0b3JlLm9uKCdvblNlYXJjaERhdGEnLCAoZGF0YSkgPT4ge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdCdjb3VudCc6IGRhdGEuY291bnQsXG5cdFx0XHRcdCdmaWxlcyc6IGRhdGEuZmlsZXNcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5wcm9wcy5zdG9yZS5vbignb25Nb3JlRGF0YScsIChkYXRhKSA9PiB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0J2NvdW50JzogZGF0YS5jb3VudCxcblx0XHRcdFx0J2ZpbGVzJzogdGhpcy5zdGF0ZS5maWxlcy5jb25jYXQoZGF0YS5maWxlcylcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5wcm9wcy5zdG9yZS5vbignb25OYXZpZ2F0ZURhdGEnLCAoZGF0YSkgPT4ge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdCdjb3VudCc6IGRhdGEuY291bnQsXG5cdFx0XHRcdCdmaWxlcyc6IGRhdGEuZmlsZXNcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5wcm9wcy5zdG9yZS5vbignb25EZWxldGVEYXRhJywgKGRhdGEpID0+IHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHQnZmlsZXMnOiB0aGlzLnN0YXRlLmZpbGVzLmZpbHRlcigoZmlsZSkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBkYXRhICE9PSBmaWxlLmlkO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblxuXHRcdGlmICh0aGlzLnByb3BzLmluaXRpYWxfZm9sZGVyICE9PSB0aGlzLnByb3BzLmN1cnJlbnRfZm9sZGVyKSB7XG5cdFx0XHR0aGlzLm9uTmF2aWdhdGUodGhpcy5wcm9wcy5jdXJyZW50X2ZvbGRlcik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucHJvcHMuc3RvcmUuZW1pdCgnc2VhcmNoJyk7XG5cdFx0fVxuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLmVkaXRpbmcpIHtcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG5cdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHRjbGFzc05hbWU9J3NzLXVpLWJ1dHRvbiB1aS1jb3JuZXItYWxsIGZvbnQtaWNvbi1sZXZlbC11cCdcblx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uTGlzdENsaWNrLmJpbmQodGhpcyl9PmJhY2s8L2J1dHRvbj5cblx0XHRcdFx0PEVkaXRvckNvbXBvbmVudCBmaWxlPXt0aGlzLnN0YXRlLmVkaXRpbmd9XG5cdFx0XHRcdFx0b25MaXN0Q2xpY2s9e3RoaXMub25MaXN0Q2xpY2suYmluZCh0aGlzKX0gLz5cblx0XHRcdDwvZGl2PlxuXHRcdH1cblxuXHRcdGxldCBmaWxlQ29tcG9uZW50cyA9IHRoaXMuZ2V0RmlsZUNvbXBvbmVudHMoKTtcblxuXHRcdGxldCBzb3J0cyA9IFtcblx0XHRcdHsnZmllbGQnOiAndGl0bGUnLCAnZGlyZWN0aW9uJzogJ2FzYycsICdsYWJlbCc6ICdhLXonfSxcblx0XHRcdHsnZmllbGQnOiAndGl0bGUnLCAnZGlyZWN0aW9uJzogJ2Rlc2MnLCAnbGFiZWwnOiAnei1hJ30sXG5cdFx0XHR7J2ZpZWxkJzogJ2NyZWF0ZWQnLCAnZGlyZWN0aW9uJzogJ2Rlc2MnLCAnbGFiZWwnOiAnbmV3ZXN0J30sXG5cdFx0XHR7J2ZpZWxkJzogJ2NyZWF0ZWQnLCAnZGlyZWN0aW9uJzogJ2FzYycsICdsYWJlbCc6ICdvbGRlc3QnfVxuXHRcdF07XG5cblx0XHRsZXQgc29ydEJ1dHRvbnMgPSBzb3J0cy5tYXAoKHNvcnQpID0+IHtcblx0XHRcdGxldCBvblNvcnQgPSAoKSA9PiB7XG5cdFx0XHRcdGxldCBmb2xkZXJzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgPT09ICdmb2xkZXInKTtcblx0XHRcdFx0bGV0IGZpbGVzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgIT09ICdmb2xkZXInKTtcblxuXHRcdFx0XHRsZXQgY29tcGFyYXRvciA9IChhLCBiKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHNvcnQuZGlyZWN0aW9uID09PSAnYXNjJykge1xuXHRcdFx0XHRcdFx0aWYgKGFbc29ydC5maWVsZF0gPCBiW3NvcnQuZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGFbc29ydC5maWVsZF0gPiBiW3NvcnQuZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoYVtzb3J0LmZpZWxkXSA+IGJbc29ydC5maWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoYVtzb3J0LmZpZWxkXSA8IGJbc29ydC5maWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2ZpbGVzJzogZm9sZGVycy5zb3J0KGNvbXBhcmF0b3IpLmNvbmNhdChmaWxlcy5zb3J0KGNvbXBhcmF0b3IpKVxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiA8YnV0dG9uIG9uQ2xpY2s9e29uU29ydH0+e3NvcnQubGFiZWx9PC9idXR0b24+O1xuXHRcdH0pO1xuXG5cdFx0dmFyIG1vcmVCdXR0b24gPSBudWxsO1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuY291bnQgPiB0aGlzLnN0YXRlLmZpbGVzLmxlbmd0aCkge1xuXHRcdFx0bW9yZUJ1dHRvbiA9IDxidXR0b24gb25DbGljaz17dGhpcy5vbk1vcmVDbGljay5iaW5kKHRoaXMpfT5tb3JlPC9idXR0b24+O1xuXHRcdH1cblxuXHRcdHZhciBiYWNrQnV0dG9uID0gbnVsbDtcblxuXHRcdGlmICh0aGlzLmZvbGRlcnMubGVuZ3RoID4gMSkge1xuXHRcdFx0YmFja0J1dHRvbiA9IDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPSdzcy11aS1idXR0b24gdWktY29ybmVyLWFsbCBmb250LWljb24tbGV2ZWwtdXAnXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25CYWNrQ2xpY2suYmluZCh0aGlzKX0+YmFjazwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuXHRcdFx0e2JhY2tCdXR0b259XG5cdFx0XHR7c29ydEJ1dHRvbnN9XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeV9faXRlbXMnPlxuXHRcdFx0XHR7ZmlsZUNvbXBvbmVudHN9XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdHttb3JlQnV0dG9ufVxuXHRcdDwvZGl2Pjtcblx0fVxuXG5cdG9uTGlzdENsaWNrKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0J2VkaXRpbmcnOiBudWxsXG5cdFx0fSk7XG5cdH1cblxuXHRnZXRGaWxlQ29tcG9uZW50cygpIHtcblx0XHRyZXR1cm4gdGhpcy5zdGF0ZS5maWxlcy5tYXAoKGZpbGUpID0+IHtcblx0XHRcdHJldHVybiA8RmlsZUNvbXBvbmVudFxuXHRcdFx0XHRcdHsuLi5maWxlfVxuXHRcdFx0XHRcdG9uRmlsZURlbGV0ZT17dGhpcy5vbkZpbGVEZWxldGUuYmluZCh0aGlzKX1cblx0XHRcdFx0XHRvbkZpbGVFZGl0PXt0aGlzLm9uRmlsZUVkaXQuYmluZCh0aGlzKX1cblx0XHRcdFx0XHRvbkZpbGVOYXZpZ2F0ZT17dGhpcy5vbkZpbGVOYXZpZ2F0ZS5iaW5kKHRoaXMpfVxuXHRcdFx0Lz47XG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbGVEZWxldGUoZmlsZSwgZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgcmVjb3JkPycpKSB7XG5cdFx0XHR0aGlzLnByb3BzLnN0b3JlLmVtaXQoJ2RlbGV0ZScsIGZpbGUuaWQpO1xuXHRcdH1cblx0fVxuXG5cdG9uRmlsZUVkaXQoZmlsZSwgZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0J2VkaXRpbmcnOiBmaWxlXG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbGVOYXZpZ2F0ZShmaWxlKSB7XG5cdFx0dGhpcy5mb2xkZXJzLnB1c2goZmlsZS5maWxlbmFtZSk7XG5cdFx0dGhpcy5wcm9wcy5zdG9yZS5lbWl0KCduYXZpZ2F0ZScsIGZpbGUuZmlsZW5hbWUpO1xuXHR9XG5cblx0b25OYXZpZ2F0ZShmb2xkZXIpIHtcblx0XHR0aGlzLmZvbGRlcnMucHVzaChmb2xkZXIpO1xuXHRcdHRoaXMucHJvcHMuc3RvcmUuZW1pdCgnbmF2aWdhdGUnLCBmb2xkZXIpO1xuXHR9XG5cblx0b25Nb3JlQ2xpY2soKSB7XG5cdFx0dGhpcy5wcm9wcy5zdG9yZS5lbWl0KCdtb3JlJyk7XG5cdH1cblxuXHRvbkJhY2tDbGljaygpIHtcblx0XHRpZiAodGhpcy5mb2xkZXJzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHRoaXMuZm9sZGVycy5wb3AoKTtcblx0XHRcdHRoaXMucHJvcHMuc3RvcmUuZW1pdCgnbmF2aWdhdGUnLCB0aGlzLmZvbGRlcnNbdGhpcy5mb2xkZXJzLmxlbmd0aCAtIDFdKTtcblx0XHR9XG5cdH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcblx0J1RIVU1CTkFJTF9IRUlHSFQnOiAxNTAsXG5cdCdUSFVNQk5BSUxfV0lEVEgnOiAyMDBcbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBHYWxsZXJ5Q29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50L2dhbGxlcnktY29tcG9uZW50JztcbmltcG9ydCBGaWxlU3RvcmUgZnJvbSAnLi9zdG9yZS9maWxlLXN0b3JlJztcblxuZnVuY3Rpb24gZ2V0VmFyKG5hbWUpIHtcblx0dmFyIHBhcnRzID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJz8nKTtcblxuXHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdHBhcnRzID0gcGFydHNbMV0uc3BsaXQoJyMnKTtcblx0fVxuXG5cdGxldCB2YXJpYWJsZXMgPSBwYXJ0c1swXS5zcGxpdCgnJicpO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdmFyaWFibGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IHBhcnRzID0gdmFyaWFibGVzW2ldLnNwbGl0KCc9Jyk7XG5cblx0XHRpZiAoZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKSA9PT0gbmFtZSkge1xuXHRcdFx0cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG51bGw7XG59XG5cbiQoJy5hc3NldC1nYWxsZXJ5JykuZW50d2luZSh7XG5cdCdvbmFkZCc6IGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgcHJvcHMgPSB7XG5cdFx0XHQnbmFtZSc6IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktbmFtZScpLFxuXHRcdFx0J2luaXRpYWxfZm9sZGVyJzogdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1pbml0aWFsLWZvbGRlcicpXG5cdFx0fTtcblxuXHRcdGlmIChwcm9wcy5uYW1lID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRzZWFyY2ggPSAkKCcuY21zLXNlYXJjaC1mb3JtJyk7XG5cblx0XHRpZiAoJHNlYXJjaC5maW5kKCdbdHlwZT1oaWRkZW5dW25hbWU9XCJxW0ZvbGRlcl1cIl0nKS5sZW5ndGggPT0gMCkge1xuXHRcdFx0JHNlYXJjaC5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInFbRm9sZGVyXVwiIC8+Jyk7XG5cdFx0fVxuXG5cdFx0cHJvcHMuc3RvcmUgPSBGaWxlU3RvcmUuY3JlYXRlKFxuXHRcdFx0XHR0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LXNlYXJjaC11cmwnKSxcblx0XHRcdFx0dGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS11cGRhdGUtdXJsJyksXG5cdFx0XHRcdHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktZGVsZXRlLXVybCcpLFxuXHRcdFx0XHR0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWxpbWl0JyksXG5cdFx0XHRcdCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJylcblx0XHQpLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG5cblx0XHRwcm9wcy5zdG9yZS5lbWl0KFxuXHRcdFx0J2ZpbHRlcicsXG5cdFx0XHRnZXRWYXIoJ3FbTmFtZV0nKSxcblx0XHRcdGdldFZhcigncVtBcHBDYXRlZ29yeV0nKSxcblx0XHRcdGdldFZhcigncVtGb2xkZXJdJyksXG5cdFx0XHRnZXRWYXIoJ3FbQ3JlYXRlZEZyb21dJyksXG5cdFx0XHRnZXRWYXIoJ3FbQ3JlYXRlZFRvXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0N1cnJlbnRGb2xkZXJPbmx5XScpXG5cdFx0KTtcblxuXHRcdHByb3BzLmN1cnJlbnRfZm9sZGVyID0gZ2V0VmFyKCdxW0ZvbGRlcl0nKSB8fCBwcm9wcy5pbml0aWFsX2ZvbGRlcjtcblxuXHRcdFJlYWN0LnJlbmRlcihcblx0XHRcdDxHYWxsZXJ5Q29tcG9uZW50IHsuLi5wcm9wc30gLz4sXG5cdFx0XHR0aGlzWzBdXG5cdFx0KTtcblx0fVxufSk7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IEV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlU3RvcmUgZXh0ZW5kcyBFdmVudHMge1xuXHRzdGF0aWMgY3JlYXRlKC4uLnBhcmFtZXRlcnMpIHtcblx0XHRyZXR1cm4gbmV3IEZpbGVTdG9yZSguLi5wYXJhbWV0ZXJzKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKHNlYXJjaF91cmwsIHVwZGF0ZV91cmwsIGRlbGV0ZV91cmwsIGxpbWl0LCAkZm9sZGVyKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuc2VhcmNoX3VybCA9IHNlYXJjaF91cmw7XG5cdFx0dGhpcy51cGRhdGVfdXJsID0gdXBkYXRlX3VybDsgLy8gQHRvZG9cblx0XHR0aGlzLmRlbGV0ZV91cmwgPSBkZWxldGVfdXJsO1xuXHRcdHRoaXMubGltaXQgPSBsaW1pdDtcblx0XHR0aGlzLiRmb2xkZXIgPSAkZm9sZGVyO1xuXG5cdFx0dGhpcy5wYWdlID0gMTtcblx0fVxuXG5cdGFkZEV2ZW50TGlzdGVuZXJzKCkge1xuXHRcdHRoaXMub24oJ3NlYXJjaCcsIHRoaXMub25TZWFyY2guYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5vbignbW9yZScsIHRoaXMub25Nb3JlLmJpbmQodGhpcykpO1xuXHRcdHRoaXMub24oJ25hdmlnYXRlJywgdGhpcy5vbk5hdmlnYXRlLmJpbmQodGhpcykpO1xuXHRcdHRoaXMub24oJ2RlbGV0ZScsIHRoaXMub25EZWxldGUuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5vbignZmlsdGVyJywgdGhpcy5vbkZpbHRlci5iaW5kKHRoaXMpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0cmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcignc2VhcmNoJyk7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcignbW9yZScpO1xuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoJ25hdmlnYXRlJyk7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcignZGVsZXRlJyk7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcignZmlsdGVyJyk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdG9uU2VhcmNoKCkge1xuXHRcdHRoaXMucGFnZSA9IDE7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvblNlYXJjaERhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG9uTW9yZSgpIHtcblx0XHR0aGlzLnBhZ2UrKztcblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uTW9yZURhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG9uTmF2aWdhdGUoZm9sZGVyKSB7XG5cdFx0dGhpcy5wYWdlID0gMTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblxuXHRcdHRoaXMucGVyc2lzdEZvbGRlckZpbHRlcihmb2xkZXIpO1xuXG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLnNlYXJjaF91cmwpLnRoZW4oKGpzb24pID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25OYXZpZ2F0ZURhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdHBlcnNpc3RGb2xkZXJGaWx0ZXIoZm9sZGVyKSB7XG5cdFx0aWYgKGZvbGRlci5zdWJzdHIoLTEpID09PSAnLycpIHtcblx0XHRcdGZvbGRlciA9IGZvbGRlci5zdWJzdHIoMCwgZm9sZGVyLmxlbmd0aCAtIDEpO1xuXHRcdH1cblxuXHRcdHRoaXMuJGZvbGRlci52YWwoZm9sZGVyKTtcblx0fVxuXG5cdG9uRGVsZXRlKGlkKSB7XG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLmRlbGV0ZV91cmwsIHtcblx0XHRcdCdpZCc6IGlkXG5cdFx0fSkudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uRGVsZXRlRGF0YScsIGlkKTtcblx0XHR9KTtcblx0fVxuXG5cdG9uRmlsdGVyKG5hbWUsIHR5cGUsIGZvbGRlciwgY3JlYXRlZEZyb20sIGNyZWF0ZWRUbywgb25seVNlYXJjaEluRm9sZGVyKSB7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMuZm9sZGVyID0gZm9sZGVyO1xuXHRcdHRoaXMuY3JlYXRlZEZyb20gPSBjcmVhdGVkRnJvbTtcblx0XHR0aGlzLmNyZWF0ZWRUbyA9IGNyZWF0ZWRUbztcblx0XHR0aGlzLm9ubHlTZWFyY2hJbkZvbGRlciA9IG9ubHlTZWFyY2hJbkZvbGRlcjtcblxuXHRcdHRoaXMub25TZWFyY2goKTtcblx0fVxuXG5cdHJlcXVlc3QobWV0aG9kLCB1cmwsIGRhdGEgPSB7fSkge1xuXHRcdGxldCBkZWZhdWx0cyA9IHtcblx0XHRcdCdsaW1pdCc6IHRoaXMubGltaXQsXG5cdFx0XHQncGFnZSc6IHRoaXMucGFnZSxcblx0XHR9O1xuXG5cdFx0aWYgKHRoaXMubmFtZSAmJiB0aGlzLm5hbWUudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMubmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm5hbWUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmZvbGRlciAmJiB0aGlzLmZvbGRlci50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5mb2xkZXIgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5mb2xkZXIpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRGcm9tICYmIHRoaXMuY3JlYXRlZEZyb20udHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuY3JlYXRlZEZyb20gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkRnJvbSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY3JlYXRlZFRvICYmIHRoaXMuY3JlYXRlZFRvLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRUbyA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLmNyZWF0ZWRUbyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMub25seVNlYXJjaEluRm9sZGVyICYmIHRoaXMub25seVNlYXJjaEluRm9sZGVyLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm9ubHlTZWFyY2hJbkZvbGRlciA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHQndXJsJzogdXJsLFxuXHRcdFx0J21ldGhvZCc6IG1ldGhvZCxcblx0XHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHRcdCdkYXRhJzogJC5leHRlbmQoZGF0YSwgZGVmYXVsdHMpXG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==

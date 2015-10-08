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
					_react2['default'].createElement(_editorComponent2['default'], { file: this.state.editing,
						onListClick: this.onListClick.bind(this) })
				);
			}

			var fileComponents = this.getFileComponents();

			var sorts = [{ 'field': 'title', 'direction': 'asc', 'label': 'title a-z' }, { 'field': 'title', 'direction': 'desc', 'label': 'title z-a' }, { 'field': 'created', 'direction': 'desc', 'label': 'newest' }, { 'field': 'created', 'direction': 'asc', 'label': 'oldest' }];

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
					'option',
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
					'Back'
				);
			}

			return _react2['default'].createElement(
				'div',
				{ className: 'gallery' },
				_react2['default'].createElement(
					'div',
					{ className: 'gallery__header' },
					backButton,
					_react2['default'].createElement(
						'div',
						{ className: 'gallery__header__sort fieldholder-small', style: { width: '160px' } },
						_react2['default'].createElement(
							'select',
							{ className: 'dropdown no-change-track' },
							sortButtons
						)
					)
				),
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
		var _this = this;

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

		(0, _jquery2['default'])('.gallery__header__sort .dropdown').change(function () {
			return _react2['default'].addons.TestUtils.Simulate.click((0, _jquery2['default'])(_this).find(':selected')[0]);
		});
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

exports['default'] = FileStore;
module.exports = exports['default'];

},{"events":1,"jquery":"jquery"}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZWRpdG9yLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2ZpbGUtY29tcG9uZW50LmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZ2FsbGVyeS1jb21wb25lbnQuanMiLCIvVXNlcnMvQ2hyaXN0b3BoZXIvU291cmNlL2Fzc2VydGNocmlzL3NpbHZlcnN0cmlwZS13b3JrYmVuY2gvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvc3RvcmUvZmlsZS1zdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JDaERjLFFBQVE7Ozs7cUJBQ0osT0FB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QUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDdkQsWUFBUSxDQUFDLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUQ7O0FBRUQsT0FBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ25ELFlBQVEsQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hEOztBQUVELE9BQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDckUsWUFBUSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzFFOztBQUVELFVBQU8sb0JBQUUsSUFBSSxDQUFDO0FBQ2IsU0FBSyxFQUFFLEdBQUc7QUFDVixZQUFRLEVBQUUsTUFBTTtBQUNoQixjQUFVLEVBQUUsTUFBTTtBQUNsQixVQUFNLEVBQUUsb0JBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7SUFDaEMsQ0FBQyxDQUFDO0dBQ0g7OztRQTNIbUIsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNSBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBhcmc7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoYXJnVHlwZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsga2V5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLnN1YnN0cigxKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gcmVnaXN0ZXIgYXMgJ2NsYXNzbmFtZXMnLCBjb25zaXN0ZW50IHdpdGggbnBtIHBhY2thZ2UgbmFtZVxuXHRcdGRlZmluZSgnY2xhc3NuYW1lcycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdHJlbmRlcigpIHtcblx0XHRsZXQgdGV4dElucHV0cyA9IHRoaXMuZ2V0VGV4dElucHV0cygpO1xuXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdlZGl0b3InPlxuXHRcdFx0PGZvcm0+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mbyBub2xhYmVsJz5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tcHJldmlldyBub2xhYmVsJz5cblx0XHRcdFx0XHRcdDxpbWcgY2xhc3NOYW1lPSd0aHVtYm5haWwtcHJldmlldycgc3JjPXt0aGlzLnByb3BzLmZpbGUudXJsfSAvPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1kYXRhIG5vbGFiZWwnPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBub2xhYmVsJz5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaWxlIHR5cGU6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUudHlwZX08L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaWxlIHNpemU6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5zaXplfTwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPlVSTDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdFx0XHRcdDxhIGhyZWY9e3RoaXMucHJvcHMuZmlsZS51cmx9IHRhcmdldD0nX2JsYW5rJz57dGhpcy5wcm9wcy5maWxlLnVybH08L2E+XG5cdFx0XHRcdFx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaXJzdCB1cGxvYWRlZDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmNyZWF0ZWR9PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5MYXN0IGNoYW5nZWQ6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5sYXN0VXBkYXRlZH08L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5EaW1lbnNpb25zOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuYXR0cmlidXRlcy5kaW1lbnNpb25zLndpZHRofSB4IHt0aGlzLnByb3BzLmZpbGUuYXR0cmlidXRlcy5kaW1lbnNpb25zLmhlaWdodH1weDwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0e3RleHRJbnB1dHN9XG5cblx0XHRcdFx0PGRpdj5cblx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9J3N1Ym1pdCcgY2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNoZWNrLW1hcmtcIj5TYXZlPC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT1cInNzLXVpLWJ1dHRvbiB1aS1jb3JuZXItYWxsIGZvbnQtaWNvbi1jYW5jZWwtY2lyY2xlZFwiIG9uQ2xpY2s9e3RoaXMucHJvcHMub25MaXN0Q2xpY2t9PkNhbmNlbDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZm9ybT5cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRnZXRUZXh0SW5wdXRzKCkge1xuXHRcdGxldCBmaWVsZHMgPSBbXG5cdFx0XHR7J25hbWUnOiAndGl0bGUnLCAndmFsdWUnOiB0aGlzLnByb3BzLmZpbGUudGl0bGV9LFxuXHRcdFx0eyduYW1lJzogJ2ZpbGVuYW1lJywgJ3ZhbHVlJzogdGhpcy5wcm9wcy5maWxlLmZpbGVuYW1lfVxuXHRcdF07XG5cblx0XHRyZXR1cm4gZmllbGRzLm1hcCgoZmllbGQpID0+IHtcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgdGV4dCc+XG5cdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntmaWVsZC5uYW1lfTwvbGFiZWw+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9e2ZpZWxkLm5hbWV9IHZhbHVlPXtmaWVsZC52YWx1ZX0gLz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHR9KTtcblx0fVxufVxuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBjb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXHRyZW5kZXIoKSB7XG5cdFx0bGV0IGl0ZW1DbGFzc05hbWVzID0gdGhpcy5nZXRJdGVtQ2xhc3NOYW1lcygpO1xuXHRcdGxldCB0aHVtYm5haWxTdHlsZXMgPSB0aGlzLmdldFRodW1ibmFpbFN0eWxlcygpO1xuXHRcdGxldCB0aHVtYm5haWxDbGFzc05hbWVzID0gdGhpcy5nZXRUaHVtYm5haWxDbGFzc05hbWVzKCk7XG5cblx0XHR2YXIgb25GaWxlTmF2aWdhdGUgPSAoKSA9PiBudWxsO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMudHlwZSA9PT0gJ2ZvbGRlcicpIHtcblx0XHRcdG9uRmlsZU5hdmlnYXRlID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMucHJvcHMub25GaWxlTmF2aWdhdGUodGhpcy5wcm9wcywgZXZlbnQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBvbkZpbGVEZWxldGUgPSAoZXZlbnQpID0+IHtcblx0XHRcdHRoaXMucHJvcHMub25GaWxlRGVsZXRlKHRoaXMucHJvcHMsIGV2ZW50KTtcblx0XHR9O1xuXG5cdFx0bGV0IG9uRmlsZUVkaXQgPSAoZXZlbnQpID0+IHtcblx0XHRcdHRoaXMucHJvcHMub25GaWxlRWRpdCh0aGlzLnByb3BzLCBldmVudCk7XG5cdFx0fTtcblxuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT17aXRlbUNsYXNzTmFtZXN9IG9uQ2xpY2s9e29uRmlsZU5hdmlnYXRlfT5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0aHVtYm5haWxDbGFzc05hbWVzfSBzdHlsZT17dGh1bWJuYWlsU3R5bGVzfT5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnMnPlxuXHRcdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHRcdGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tcmVtb3ZlIFsgZm9udC1pY29uLXRyYXNoIF0nXG5cdFx0XHRcdFx0XHR0eXBlPSdidXR0b24nXG5cdFx0XHRcdFx0XHRvbkNsaWNrPXtvbkZpbGVEZWxldGV9PlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHRcdGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tZWRpdCBbIGZvbnQtaWNvbi1lZGl0IF0nXG5cdFx0XHRcdFx0XHR0eXBlPSdidXR0b24nXG5cdFx0XHRcdFx0XHRvbkNsaWNrPXtvbkZpbGVFZGl0fT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxwIGNsYXNzTmFtZT0naXRlbV9fdGl0bGUnPnt0aGlzLnByb3BzLnRpdGxlfTwvcD5cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRnZXRJdGVtQ2xhc3NOYW1lcygpIHtcblx0XHR2YXIgaXRlbUNsYXNzTmFtZXMgPSAnaXRlbSAnICsgdGhpcy5wcm9wcy50eXBlO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMudHlwZSA9PT0gJ2ZvbGRlcicpIHtcblx0XHRcdGl0ZW1DbGFzc05hbWVzICs9ICcgZm9sZGVyJztcblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbUNsYXNzTmFtZXM7XG5cdH1cblxuXHRnZXRUaHVtYm5haWxDbGFzc05hbWVzKCkge1xuXHRcdHZhciB0aHVtYm5haWxDbGFzc05hbWVzID0gJ2l0ZW1fX3RodW1ibmFpbCc7XG5cblx0XHRpZiAodGhpcy5pc0ltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpKSB7XG5cdFx0XHR0aHVtYm5haWxDbGFzc05hbWVzICs9ICcgbGFyZ2UnO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aHVtYm5haWxDbGFzc05hbWVzO1xuXHR9XG5cblx0aXNJbWFnZUxhcmdlclRoYW5UaHVtYm5haWwoKSB7XG5cdFx0bGV0IGRpbWVuc2lvbnMgPSB0aGlzLnByb3BzLmF0dHJpYnV0ZXMuZGltZW5zaW9ucztcblxuXHRcdHJldHVybiBkaW1lbnNpb25zLmhlaWdodCA+IGNvbnN0YW50cy5USFVNQk5BSUxfSEVJR0hUIHx8IGRpbWVuc2lvbnMud2lkdGggPiBjb25zdGFudHMuVEhVTUJOQUlMX1dJRFRIO1xuXHR9XG5cblx0Z2V0VGh1bWJuYWlsU3R5bGVzKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLnR5cGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdpbWFnZScpID4gLTEpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdCdiYWNrZ3JvdW5kSW1hZ2UnOiAndXJsKCcgKyB0aGlzLnByb3BzLnVybCArICcpJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge307XG5cdH1cbn1cbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEZpbGVDb21wb25lbnQgZnJvbSAnLi9maWxlLWNvbXBvbmVudCc7XG5pbXBvcnQgRWRpdG9yQ29tcG9uZW50IGZyb20gJy4vZWRpdG9yLWNvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0J2ZpbGVzJzogW10sXG5cdFx0XHQnZWRpdGluZyc6IG51bGxcblx0XHR9O1xuXG5cdFx0dGhpcy5mb2xkZXJzID0gW3Byb3BzLmluaXRpYWxfZm9sZGVyXTtcblxuXHRcdHRoaXMuc29ydCA9ICduYW1lJztcblx0XHR0aGlzLmRpcmVjdGlvbiA9ICdhc2MnO1xuXHR9XG5cblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0dGhpcy5wcm9wcy5zdG9yZS5vbignb25TZWFyY2hEYXRhJywgKGRhdGEpID0+IHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHQnY291bnQnOiBkYXRhLmNvdW50LFxuXHRcdFx0XHQnZmlsZXMnOiBkYXRhLmZpbGVzXG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMucHJvcHMuc3RvcmUub24oJ29uTW9yZURhdGEnLCAoZGF0YSkgPT4ge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdCdjb3VudCc6IGRhdGEuY291bnQsXG5cdFx0XHRcdCdmaWxlcyc6IHRoaXMuc3RhdGUuZmlsZXMuY29uY2F0KGRhdGEuZmlsZXMpXG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMucHJvcHMuc3RvcmUub24oJ29uTmF2aWdhdGVEYXRhJywgKGRhdGEpID0+IHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHQnY291bnQnOiBkYXRhLmNvdW50LFxuXHRcdFx0XHQnZmlsZXMnOiBkYXRhLmZpbGVzXG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMucHJvcHMuc3RvcmUub24oJ29uRGVsZXRlRGF0YScsIChkYXRhKSA9PiB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0J2ZpbGVzJzogdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoKGZpbGUpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gZGF0YSAhPT0gZmlsZS5pZDtcblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMuaW5pdGlhbF9mb2xkZXIgIT09IHRoaXMucHJvcHMuY3VycmVudF9mb2xkZXIpIHtcblx0XHRcdHRoaXMub25OYXZpZ2F0ZSh0aGlzLnByb3BzLmN1cnJlbnRfZm9sZGVyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wcm9wcy5zdG9yZS5lbWl0KCdzZWFyY2gnKTtcblx0XHR9XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZWRpdGluZykge1xuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5Jz5cblx0XHRcdFx0PEVkaXRvckNvbXBvbmVudCBmaWxlPXt0aGlzLnN0YXRlLmVkaXRpbmd9XG5cdFx0XHRcdFx0b25MaXN0Q2xpY2s9e3RoaXMub25MaXN0Q2xpY2suYmluZCh0aGlzKX0gLz5cblx0XHRcdDwvZGl2PlxuXHRcdH1cblxuXHRcdGxldCBmaWxlQ29tcG9uZW50cyA9IHRoaXMuZ2V0RmlsZUNvbXBvbmVudHMoKTtcblxuXHRcdGxldCBzb3J0cyA9IFtcblx0XHRcdHsnZmllbGQnOiAndGl0bGUnLCAnZGlyZWN0aW9uJzogJ2FzYycsICdsYWJlbCc6ICd0aXRsZSBhLXonfSxcblx0XHRcdHsnZmllbGQnOiAndGl0bGUnLCAnZGlyZWN0aW9uJzogJ2Rlc2MnLCAnbGFiZWwnOiAndGl0bGUgei1hJ30sXG5cdFx0XHR7J2ZpZWxkJzogJ2NyZWF0ZWQnLCAnZGlyZWN0aW9uJzogJ2Rlc2MnLCAnbGFiZWwnOiAnbmV3ZXN0J30sXG5cdFx0XHR7J2ZpZWxkJzogJ2NyZWF0ZWQnLCAnZGlyZWN0aW9uJzogJ2FzYycsICdsYWJlbCc6ICdvbGRlc3QnfVxuXHRcdF07XG5cblx0XHRsZXQgc29ydEJ1dHRvbnMgPSBzb3J0cy5tYXAoKHNvcnQpID0+IHtcblx0XHRcdGxldCBvblNvcnQgPSAoKSA9PiB7XG5cdFx0XHRcdGxldCBmb2xkZXJzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgPT09ICdmb2xkZXInKTtcblx0XHRcdFx0bGV0IGZpbGVzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgIT09ICdmb2xkZXInKTtcblxuXHRcdFx0XHRsZXQgY29tcGFyYXRvciA9IChhLCBiKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHNvcnQuZGlyZWN0aW9uID09PSAnYXNjJykge1xuXHRcdFx0XHRcdFx0aWYgKGFbc29ydC5maWVsZF0gPCBiW3NvcnQuZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGFbc29ydC5maWVsZF0gPiBiW3NvcnQuZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoYVtzb3J0LmZpZWxkXSA+IGJbc29ydC5maWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoYVtzb3J0LmZpZWxkXSA8IGJbc29ydC5maWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2ZpbGVzJzogZm9sZGVycy5zb3J0KGNvbXBhcmF0b3IpLmNvbmNhdChmaWxlcy5zb3J0KGNvbXBhcmF0b3IpKVxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiA8b3B0aW9uIG9uQ2xpY2s9e29uU29ydH0+e3NvcnQubGFiZWx9PC9vcHRpb24+O1xuXHRcdH0pO1xuXG5cdFx0dmFyIG1vcmVCdXR0b24gPSBudWxsO1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuY291bnQgPiB0aGlzLnN0YXRlLmZpbGVzLmxlbmd0aCkge1xuXHRcdFx0bW9yZUJ1dHRvbiA9IDxidXR0b24gb25DbGljaz17dGhpcy5vbk1vcmVDbGljay5iaW5kKHRoaXMpfT5tb3JlPC9idXR0b24+O1xuXHRcdH1cblxuXHRcdHZhciBiYWNrQnV0dG9uID0gbnVsbDtcblxuXHRcdGlmICh0aGlzLmZvbGRlcnMubGVuZ3RoID4gMSkge1xuXHRcdFx0YmFja0J1dHRvbiA9IDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPSdzcy11aS1idXR0b24gdWktY29ybmVyLWFsbCBmb250LWljb24tbGV2ZWwtdXAnXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25CYWNrQ2xpY2suYmluZCh0aGlzKX0+QmFjazwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2hlYWRlcic+XG5cdFx0XHRcdHtiYWNrQnV0dG9ufVxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX2hlYWRlcl9fc29ydCBmaWVsZGhvbGRlci1zbWFsbFwiIHN0eWxlPXt7d2lkdGg6ICcxNjBweCd9fT5cblx0XHRcdFx0XHQ8c2VsZWN0IGNsYXNzTmFtZT1cImRyb3Bkb3duIG5vLWNoYW5nZS10cmFja1wiPlxuXHRcdFx0XHRcdFx0e3NvcnRCdXR0b25zfVxuXHRcdFx0XHRcdDwvc2VsZWN0PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2l0ZW1zJz5cblx0XHRcdFx0e2ZpbGVDb21wb25lbnRzfVxuXHRcdFx0PC9kaXY+XG5cdFx0XHR7bW9yZUJ1dHRvbn1cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRvbkxpc3RDbGljaygpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdlZGl0aW5nJzogbnVsbFxuXHRcdH0pO1xuXHR9XG5cblx0Z2V0RmlsZUNvbXBvbmVudHMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3RhdGUuZmlsZXMubWFwKChmaWxlKSA9PiB7XG5cdFx0XHRyZXR1cm4gPEZpbGVDb21wb25lbnRcblx0XHRcdFx0XHR7Li4uZmlsZX1cblx0XHRcdFx0XHRvbkZpbGVEZWxldGU9e3RoaXMub25GaWxlRGVsZXRlLmJpbmQodGhpcyl9XG5cdFx0XHRcdFx0b25GaWxlRWRpdD17dGhpcy5vbkZpbGVFZGl0LmJpbmQodGhpcyl9XG5cdFx0XHRcdFx0b25GaWxlTmF2aWdhdGU9e3RoaXMub25GaWxlTmF2aWdhdGUuYmluZCh0aGlzKX1cblx0XHRcdC8+O1xuXHRcdH0pO1xuXHR9XG5cblx0b25GaWxlRGVsZXRlKGZpbGUsIGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHJlY29yZD8nKSkge1xuXHRcdFx0dGhpcy5wcm9wcy5zdG9yZS5lbWl0KCdkZWxldGUnLCBmaWxlLmlkKTtcblx0XHR9XG5cdH1cblxuXHRvbkZpbGVFZGl0KGZpbGUsIGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdlZGl0aW5nJzogZmlsZVxuXHRcdH0pO1xuXHR9XG5cblx0b25GaWxlTmF2aWdhdGUoZmlsZSkge1xuXHRcdHRoaXMuZm9sZGVycy5wdXNoKGZpbGUuZmlsZW5hbWUpO1xuXHRcdHRoaXMucHJvcHMuc3RvcmUuZW1pdCgnbmF2aWdhdGUnLCBmaWxlLmZpbGVuYW1lKTtcblx0fVxuXG5cdG9uTmF2aWdhdGUoZm9sZGVyKSB7XG5cdFx0dGhpcy5mb2xkZXJzLnB1c2goZm9sZGVyKTtcblx0XHR0aGlzLnByb3BzLnN0b3JlLmVtaXQoJ25hdmlnYXRlJywgZm9sZGVyKTtcblx0fVxuXG5cdG9uTW9yZUNsaWNrKCkge1xuXHRcdHRoaXMucHJvcHMuc3RvcmUuZW1pdCgnbW9yZScpO1xuXHR9XG5cblx0b25CYWNrQ2xpY2soKSB7XG5cdFx0aWYgKHRoaXMuZm9sZGVycy5sZW5ndGggPiAxKSB7XG5cdFx0XHR0aGlzLmZvbGRlcnMucG9wKCk7XG5cdFx0XHR0aGlzLnByb3BzLnN0b3JlLmVtaXQoJ25hdmlnYXRlJywgdGhpcy5mb2xkZXJzW3RoaXMuZm9sZGVycy5sZW5ndGggLSAxXSk7XG5cdFx0fVxuXHR9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG5cdCdUSFVNQk5BSUxfSEVJR0hUJzogMTUwLFxuXHQnVEhVTUJOQUlMX1dJRFRIJzogMjAwXG59O1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2FsbGVyeUNvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudC9nYWxsZXJ5LWNvbXBvbmVudCc7XG5pbXBvcnQgRmlsZVN0b3JlIGZyb20gJy4vc3RvcmUvZmlsZS1zdG9yZSc7XG5cbmZ1bmN0aW9uIGdldFZhcihuYW1lKSB7XG5cdHZhciBwYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCc/Jyk7XG5cblx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRwYXJ0cyA9IHBhcnRzWzFdLnNwbGl0KCcjJyk7XG5cdH1cblxuXHRsZXQgdmFyaWFibGVzID0gcGFydHNbMF0uc3BsaXQoJyYnKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHZhcmlhYmxlcy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwYXJ0cyA9IHZhcmlhYmxlc1tpXS5zcGxpdCgnPScpO1xuXG5cdFx0aWYgKGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSkgPT09IG5hbWUpIHtcblx0XHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBudWxsO1xufVxuXG4kKCcuYXNzZXQtZ2FsbGVyeScpLmVudHdpbmUoe1xuXHQnb25hZGQnOiBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHByb3BzID0ge1xuXHRcdFx0J25hbWUnOiB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LW5hbWUnKSxcblx0XHRcdCdpbml0aWFsX2ZvbGRlcic6IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktaW5pdGlhbC1mb2xkZXInKVxuXHRcdH07XG5cblx0XHRpZiAocHJvcHMubmFtZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkc2VhcmNoID0gJCgnLmNtcy1zZWFyY2gtZm9ybScpO1xuXG5cdFx0aWYgKCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJykubGVuZ3RoID09IDApIHtcblx0XHRcdCRzZWFyY2guYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJxW0ZvbGRlcl1cIiAvPicpO1xuXHRcdH1cblxuXHRcdHByb3BzLnN0b3JlID0gRmlsZVN0b3JlLmNyZWF0ZShcblx0XHRcdFx0dGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1zZWFyY2gtdXJsJyksXG5cdFx0XHRcdHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktdXBkYXRlLXVybCcpLFxuXHRcdFx0XHR0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRlbGV0ZS11cmwnKSxcblx0XHRcdFx0dGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1saW1pdCcpLFxuXHRcdFx0XHQkc2VhcmNoLmZpbmQoJ1t0eXBlPWhpZGRlbl1bbmFtZT1cInFbRm9sZGVyXVwiXScpXG5cdFx0KS5hZGRFdmVudExpc3RlbmVycygpO1xuXG5cdFx0cHJvcHMuc3RvcmUuZW1pdChcblx0XHRcdCdmaWx0ZXInLFxuXHRcdFx0Z2V0VmFyKCdxW05hbWVdJyksXG5cdFx0XHRnZXRWYXIoJ3FbQXBwQ2F0ZWdvcnldJyksXG5cdFx0XHRnZXRWYXIoJ3FbRm9sZGVyXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRGcm9tXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRUb10nKSxcblx0XHRcdGdldFZhcigncVtDdXJyZW50Rm9sZGVyT25seV0nKVxuXHRcdCk7XG5cblx0XHRwcm9wcy5jdXJyZW50X2ZvbGRlciA9IGdldFZhcigncVtGb2xkZXJdJykgfHwgcHJvcHMuaW5pdGlhbF9mb2xkZXI7XG5cblx0XHRSZWFjdC5yZW5kZXIoXG5cdFx0XHQ8R2FsbGVyeUNvbXBvbmVudCB7Li4ucHJvcHN9IC8+LFxuXHRcdFx0dGhpc1swXVxuXHRcdCk7XG5cblx0XHQkKCcuZ2FsbGVyeV9faGVhZGVyX19zb3J0IC5kcm9wZG93bicpLmNoYW5nZSgoKSA9PiBSZWFjdC5hZGRvbnMuVGVzdFV0aWxzLlNpbXVsYXRlLmNsaWNrKCQodGhpcykuZmluZCgnOnNlbGVjdGVkJylbMF0pKTtcblx0fVxufSk7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IEV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlU3RvcmUgZXh0ZW5kcyBFdmVudHMge1xuXHRzdGF0aWMgY3JlYXRlKC4uLnBhcmFtZXRlcnMpIHtcblx0XHRyZXR1cm4gbmV3IEZpbGVTdG9yZSguLi5wYXJhbWV0ZXJzKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKHNlYXJjaF91cmwsIHVwZGF0ZV91cmwsIGRlbGV0ZV91cmwsIGxpbWl0LCAkZm9sZGVyKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuc2VhcmNoX3VybCA9IHNlYXJjaF91cmw7XG5cdFx0dGhpcy51cGRhdGVfdXJsID0gdXBkYXRlX3VybDsgLy8gQHRvZG9cblx0XHR0aGlzLmRlbGV0ZV91cmwgPSBkZWxldGVfdXJsO1xuXHRcdHRoaXMubGltaXQgPSBsaW1pdDtcblx0XHR0aGlzLiRmb2xkZXIgPSAkZm9sZGVyO1xuXG5cdFx0dGhpcy5wYWdlID0gMTtcblx0fVxuXG5cdGFkZEV2ZW50TGlzdGVuZXJzKCkge1xuXHRcdHRoaXMub24oJ3NlYXJjaCcsIHRoaXMub25TZWFyY2guYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5vbignbW9yZScsIHRoaXMub25Nb3JlLmJpbmQodGhpcykpO1xuXHRcdHRoaXMub24oJ25hdmlnYXRlJywgdGhpcy5vbk5hdmlnYXRlLmJpbmQodGhpcykpO1xuXHRcdHRoaXMub24oJ2RlbGV0ZScsIHRoaXMub25EZWxldGUuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5vbignZmlsdGVyJywgdGhpcy5vbkZpbHRlci5iaW5kKHRoaXMpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0cmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcignc2VhcmNoJyk7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcignbW9yZScpO1xuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoJ25hdmlnYXRlJyk7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcignZGVsZXRlJyk7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcignZmlsdGVyJyk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdG9uU2VhcmNoKCkge1xuXHRcdHRoaXMucGFnZSA9IDE7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvblNlYXJjaERhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG9uTW9yZSgpIHtcblx0XHR0aGlzLnBhZ2UrKztcblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uTW9yZURhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG9uTmF2aWdhdGUoZm9sZGVyKSB7XG5cdFx0dGhpcy5wYWdlID0gMTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblxuXHRcdHRoaXMucGVyc2lzdEZvbGRlckZpbHRlcihmb2xkZXIpO1xuXG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLnNlYXJjaF91cmwpLnRoZW4oKGpzb24pID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25OYXZpZ2F0ZURhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdHBlcnNpc3RGb2xkZXJGaWx0ZXIoZm9sZGVyKSB7XG5cdFx0aWYgKGZvbGRlci5zdWJzdHIoLTEpID09PSAnLycpIHtcblx0XHRcdGZvbGRlciA9IGZvbGRlci5zdWJzdHIoMCwgZm9sZGVyLmxlbmd0aCAtIDEpO1xuXHRcdH1cblxuXHRcdHRoaXMuJGZvbGRlci52YWwoZm9sZGVyKTtcblx0fVxuXG5cdG9uRGVsZXRlKGlkKSB7XG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLmRlbGV0ZV91cmwsIHtcblx0XHRcdCdpZCc6IGlkXG5cdFx0fSkudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uRGVsZXRlRGF0YScsIGlkKTtcblx0XHR9KTtcblx0fVxuXG5cdG9uRmlsdGVyKG5hbWUsIHR5cGUsIGZvbGRlciwgY3JlYXRlZEZyb20sIGNyZWF0ZWRUbywgb25seVNlYXJjaEluRm9sZGVyKSB7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMuZm9sZGVyID0gZm9sZGVyO1xuXHRcdHRoaXMuY3JlYXRlZEZyb20gPSBjcmVhdGVkRnJvbTtcblx0XHR0aGlzLmNyZWF0ZWRUbyA9IGNyZWF0ZWRUbztcblx0XHR0aGlzLm9ubHlTZWFyY2hJbkZvbGRlciA9IG9ubHlTZWFyY2hJbkZvbGRlcjtcblxuXHRcdHRoaXMub25TZWFyY2goKTtcblx0fVxuXG5cdHJlcXVlc3QobWV0aG9kLCB1cmwsIGRhdGEgPSB7fSkge1xuXHRcdGxldCBkZWZhdWx0cyA9IHtcblx0XHRcdCdsaW1pdCc6IHRoaXMubGltaXQsXG5cdFx0XHQncGFnZSc6IHRoaXMucGFnZSxcblx0XHR9O1xuXG5cdFx0aWYgKHRoaXMubmFtZSAmJiB0aGlzLm5hbWUudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMubmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm5hbWUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmZvbGRlciAmJiB0aGlzLmZvbGRlci50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5mb2xkZXIgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5mb2xkZXIpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRGcm9tICYmIHRoaXMuY3JlYXRlZEZyb20udHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuY3JlYXRlZEZyb20gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkRnJvbSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY3JlYXRlZFRvICYmIHRoaXMuY3JlYXRlZFRvLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRUbyA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLmNyZWF0ZWRUbyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMub25seVNlYXJjaEluRm9sZGVyICYmIHRoaXMub25seVNlYXJjaEluRm9sZGVyLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm9ubHlTZWFyY2hJbkZvbGRlciA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHQndXJsJzogdXJsLFxuXHRcdFx0J21ldGhvZCc6IG1ldGhvZCxcblx0XHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHRcdCdkYXRhJzogJC5leHRlbmQoZGF0YSwgZGVmYXVsdHMpXG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==

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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _default = (function (_React$Component) {
	_inherits(_default, _React$Component);

	function _default(props) {
		_classCallCheck(this, _default);

		_get(Object.getPrototypeOf(_default.prototype), 'constructor', this).call(this, props);

		this.state = {
			'title': this.props.file.title,
			'basename': this.props.file.basename
		};
	}

	_createClass(_default, [{
		key: 'render',
		value: function render() {
			var textInputs = this.getTextInputs();

			return _react2['default'].createElement(
				'div',
				{ className: 'editor' },
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
						{ type: 'submit', className: 'ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-check-mark', onClick: this.onFileSave.bind(this) },
						'Save'
					),
					_react2['default'].createElement(
						'button',
						{ type: 'button', className: 'ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-cancel-circled', onClick: this.props.onListClick },
						'Cancel'
					)
				)
			);
		}
	}, {
		key: 'getTextInputs',
		value: function getTextInputs() {
			var _this = this;

			var fields = [{ 'name': 'title', 'value': this.props.file.title }, { 'name': 'basename', 'value': this.props.file.basename }];

			console.log(fields);

			return fields.map(function (field) {
				var handler = function handler(event) {
					_this.onFieldChange.call(_this, event, field.name);
				};

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
						_react2['default'].createElement('input', { type: 'text', onChange: handler, value: _this.state[field.name] })
					)
				);
			});
		}
	}, {
		key: 'onFieldChange',
		value: function onFieldChange(event, name) {
			this.setState(_defineProperty({}, name, event.target.value));
		}
	}, {
		key: 'onFileSave',
		value: function onFileSave(event) {
			this.props.onFileSave(this.props.file.id, this.state, event);
		}
	}]);

	return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];

},{"jquery":"jquery","react":"react"}],3:[function(require,module,exports){
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
				{ className: 'item ' + this.props.category, onClick: onFileNavigate },
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

},{"../constants":5,"jquery":"jquery","react":"react"}],4:[function(require,module,exports){
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

			this.props.store.on('onSaveData', function (id, values) {
				var files = _this.state.files;

				files.forEach(function (file) {
					if (file.id == id) {
						if (values.title) {
							file.title = values.title;
						}

						if (values.basename) {
							file.basename = values.basename;
						}
					}
				});

				_this.setState({
					'files': files,
					'editing': false
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
						onFileSave: this.onFileSave.bind(this),
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
					{ className: 'load-more', onClick: this.onMoreClick.bind(this) },
					'Load more'
				);
			}

			var backButton = null;

			if (this.folders.length > 1) {
				backButton = _react2['default'].createElement(
					'button',
					{
						className: 'ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-level-up',
						onClick: this.onBackClick.bind(this) },
					'Back'
				);
			}

			return _react2['default'].createElement(
				'div',
				{ className: 'gallery' },
				backButton,
				_react2['default'].createElement(
					'div',
					{ className: 'gallery__sort fieldholder-small', style: { width: '160px' } },
					_react2['default'].createElement(
						'select',
						{ className: 'dropdown no-change-track' },
						sortButtons
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
	}, {
		key: 'onFileSave',
		value: function onFileSave(id, state, event) {
			this.props.store.emit('save', id, state);

			event.stopPropagation();
			event.preventDefault();
		}
	}]);

	return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];

},{"./editor-component":2,"./file-component":3,"jquery":"jquery","react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	'THUMBNAIL_HEIGHT': 150,
	'THUMBNAIL_WIDTH': 200
};
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
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

		props.store = _storeFileStore2['default'].create(this[0].getAttribute('data-asset-gallery-search-url'), this[0].getAttribute('data-asset-gallery-update-url'), this[0].getAttribute('data-asset-gallery-delete-url'), this[0].getAttribute('data-asset-gallery-limit'), $search.find('[type=hidden][name="q[Folder]"]'));

		props.store.emit('filter', getVar('q[Name]'), getVar('q[AppCategory]'), getVar('q[Folder]'), getVar('q[CreatedFrom]'), getVar('q[CreatedTo]'), getVar('q[CurrentFolderOnly]'));

		props.current_folder = getVar('q[Folder]') || props.initial_folder;

		_react2['default'].render(_react2['default'].createElement(_componentGalleryComponent2['default'], props), this[0]);

		(0, _jquery2['default'])('.gallery__sort .dropdown').change(function () {
			return _react2['default'].addons.TestUtils.Simulate.click((0, _jquery2['default'])(_this).find(':selected')[0]);
		});
	}
});

},{"./component/gallery-component":4,"./store/file-store":7,"jquery":"jquery","react":"react"}],7:[function(require,module,exports){
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
		this.update_url = update_url;
		this.delete_url = delete_url;
		this.limit = limit;
		this.$folder = $folder;

		this.page = 1;

		this.addEventListeners();
	}

	_createClass(FileStore, [{
		key: 'addEventListeners',
		value: function addEventListeners() {
			this.on('search', this.onSearch.bind(this));
			this.on('more', this.onMore.bind(this));
			this.on('navigate', this.onNavigate.bind(this));
			this.on('delete', this.onDelete.bind(this));
			this.on('filter', this.onFilter.bind(this));
			this.on('save', this.onSave.bind(this));

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
		key: 'onSave',
		value: function onSave(id, values) {
			var _this5 = this;

			values['id'] = id;

			this.request('POST', this.update_url, values).then(function () {
				_this5.emit('onSaveData', id, values);
			});
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

},{"events":1,"jquery":"jquery"}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2VkaXRvci1jb21wb25lbnQuanMiLCIvVXNlcnMvQ2hyaXN0b3BoZXIvU291cmNlL2Fzc2VydGNocmlzL3NpbHZlcnN0cmlwZS13b3JrYmVuY2gvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9maWxlLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy9DaHJpc3RvcGhlci9Tb3VyY2UvYXNzZXJ0Y2hyaXMvc2lsdmVyc3RyaXBlLXdvcmtiZW5jaC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2dhbGxlcnktY29tcG9uZW50LmpzIiwiL1VzZXJzL0NocmlzdG9waGVyL1NvdXJjZS9hc3NlcnRjaHJpcy9zaWx2ZXJzdHJpcGUtd29ya2JlbmNoL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb25zdGFudHMuanMiLCIvVXNlcnMvQ2hyaXN0b3BoZXIvU291cmNlL2Fzc2VydGNocmlzL3NpbHZlcnN0cmlwZS13b3JrYmVuY2gvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL21haW4uanMiLCIvVXNlcnMvQ2hyaXN0b3BoZXIvU291cmNlL2Fzc2VydGNocmlzL3NpbHZlcnN0cmlwZS13b3JrYmVuY2gvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL3N0b3JlL2ZpbGUtc3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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dCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0J3RpdGxlJzogdGhpcy5wcm9wcy5maWxlLnRpdGxlLFxuXHRcdFx0J2Jhc2VuYW1lJzogdGhpcy5wcm9wcy5maWxlLmJhc2VuYW1lXG5cdFx0fTtcblx0fVxuXHRyZW5kZXIoKSB7XG5cdFx0bGV0IHRleHRJbnB1dHMgPSB0aGlzLmdldFRleHRJbnB1dHMoKTtcblxuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZWRpdG9yJz5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mbyBub2xhYmVsJz5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvLXByZXZpZXcgbm9sYWJlbCc+XG5cdFx0XHRcdFx0PGltZyBjbGFzc05hbWU9J3RodW1ibmFpbC1wcmV2aWV3JyBzcmM9e3RoaXMucHJvcHMuZmlsZS51cmx9IC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tZGF0YSBub2xhYmVsJz5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIG5vbGFiZWwnPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RmlsZSB0eXBlOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUudHlwZX08L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpbGUgc2l6ZTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuc2l6ZX08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+VVJMOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+XG5cdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj17dGhpcy5wcm9wcy5maWxlLnVybH0gdGFyZ2V0PSdfYmxhbmsnPnt0aGlzLnByb3BzLmZpbGUudXJsfTwvYT5cblx0XHRcdFx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+Rmlyc3QgdXBsb2FkZWQ6PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmNyZWF0ZWR9PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+TGFzdCBjaGFuZ2VkOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5sYXN0VXBkYXRlZH08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RGltZW5zaW9uczo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuYXR0cmlidXRlcy5kaW1lbnNpb25zLndpZHRofSB4IHt0aGlzLnByb3BzLmZpbGUuYXR0cmlidXRlcy5kaW1lbnNpb25zLmhlaWdodH1weDwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXG5cdFx0XHR7dGV4dElucHV0c31cblxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGJ1dHRvbiB0eXBlPSdzdWJtaXQnIGNsYXNzTmFtZT1cInNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tY2hlY2stbWFya1wiIG9uQ2xpY2s9e3RoaXMub25GaWxlU2F2ZS5iaW5kKHRoaXMpfT5TYXZlPC9idXR0b24+XG5cdFx0XHRcdDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9XCJzcy11aS1idXR0b24gdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkXCIgb25DbGljaz17dGhpcy5wcm9wcy5vbkxpc3RDbGlja30+Q2FuY2VsPC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRnZXRUZXh0SW5wdXRzKCkge1xuXHRcdGxldCBmaWVsZHMgPSBbXG5cdFx0XHR7J25hbWUnOiAndGl0bGUnLCAndmFsdWUnOiB0aGlzLnByb3BzLmZpbGUudGl0bGV9LFxuXHRcdFx0eyduYW1lJzogJ2Jhc2VuYW1lJywgJ3ZhbHVlJzogdGhpcy5wcm9wcy5maWxlLmJhc2VuYW1lfVxuXHRcdF07XG5cblx0XHRjb25zb2xlLmxvZyhmaWVsZHMpO1xuXG5cdFx0cmV0dXJuIGZpZWxkcy5tYXAoKGZpZWxkKSA9PiB7XG5cdFx0XHRsZXQgaGFuZGxlciA9IChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLm9uRmllbGRDaGFuZ2UuY2FsbCh0aGlzLCBldmVudCwgZmllbGQubmFtZSk7XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHRleHQnPlxuXHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57ZmllbGQubmFtZX08L2xhYmVsPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHQ8aW5wdXQgdHlwZT0ndGV4dCcgb25DaGFuZ2U9e2hhbmRsZXJ9IHZhbHVlPXt0aGlzLnN0YXRlW2ZpZWxkLm5hbWVdfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdH0pO1xuXHR9XG5cblx0b25GaWVsZENoYW5nZShldmVudCwgbmFtZSkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0W25hbWVdOiBldmVudC50YXJnZXQudmFsdWVcblx0XHR9KTtcblx0fVxuXG5cdG9uRmlsZVNhdmUoZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLm9uRmlsZVNhdmUodGhpcy5wcm9wcy5maWxlLmlkLCB0aGlzLnN0YXRlLCBldmVudCk7XG5cdH1cbn1cbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdHJlbmRlcigpIHtcblx0XHRsZXQgdGh1bWJuYWlsU3R5bGVzID0gdGhpcy5nZXRUaHVtYm5haWxTdHlsZXMoKTtcblx0XHRsZXQgdGh1bWJuYWlsQ2xhc3NOYW1lcyA9IHRoaXMuZ2V0VGh1bWJuYWlsQ2xhc3NOYW1lcygpO1xuXG5cdFx0dmFyIG9uRmlsZU5hdmlnYXRlID0gKCkgPT4gbnVsbDtcblxuXHRcdGlmICh0aGlzLnByb3BzLnR5cGUgPT09ICdmb2xkZXInKSB7XG5cdFx0XHRvbkZpbGVOYXZpZ2F0ZSA9IChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLnByb3BzLm9uRmlsZU5hdmlnYXRlKHRoaXMucHJvcHMsIGV2ZW50KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRsZXQgb25GaWxlRGVsZXRlID0gKGV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLnByb3BzLm9uRmlsZURlbGV0ZSh0aGlzLnByb3BzLCBldmVudCk7XG5cdFx0fTtcblxuXHRcdGxldCBvbkZpbGVFZGl0ID0gKGV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLnByb3BzLm9uRmlsZUVkaXQodGhpcy5wcm9wcywgZXZlbnQpO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9eydpdGVtICcgKyB0aGlzLnByb3BzLmNhdGVnb3J5fSBvbkNsaWNrPXtvbkZpbGVOYXZpZ2F0ZX0+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dGh1bWJuYWlsQ2xhc3NOYW1lc30gc3R5bGU9e3RodW1ibmFpbFN0eWxlc30+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zJz5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXJlbW92ZSBbIGZvbnQtaWNvbi10cmFzaCBdJ1xuXHRcdFx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHRcdFx0b25DbGljaz17b25GaWxlRGVsZXRlfT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLWVkaXQgWyBmb250LWljb24tZWRpdCBdJ1xuXHRcdFx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHRcdFx0b25DbGljaz17b25GaWxlRWRpdH0+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8cCBjbGFzc05hbWU9J2l0ZW1fX3RpdGxlJz57dGhpcy5wcm9wcy50aXRsZX08L3A+XG5cdFx0PC9kaXY+O1xuXHR9XG5cblx0Z2V0SXRlbUNsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIGl0ZW1DbGFzc05hbWVzID0gJ2l0ZW0gJyArIHRoaXMucHJvcHMudHlwZTtcblxuXHRcdGlmICh0aGlzLnByb3BzLnR5cGUgPT09ICdmb2xkZXInKSB7XG5cdFx0XHRpdGVtQ2xhc3NOYW1lcyArPSAnIGZvbGRlcic7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW1DbGFzc05hbWVzO1xuXHR9XG5cblx0Z2V0VGh1bWJuYWlsQ2xhc3NOYW1lcygpIHtcblx0XHR2YXIgdGh1bWJuYWlsQ2xhc3NOYW1lcyA9ICdpdGVtX190aHVtYm5haWwnO1xuXG5cdFx0aWYgKHRoaXMuaXNJbWFnZUxhcmdlclRoYW5UaHVtYm5haWwoKSkge1xuXHRcdFx0dGh1bWJuYWlsQ2xhc3NOYW1lcyArPSAnIGxhcmdlJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGh1bWJuYWlsQ2xhc3NOYW1lcztcblx0fVxuXG5cdGlzSW1hZ2VMYXJnZXJUaGFuVGh1bWJuYWlsKCkge1xuXHRcdGxldCBkaW1lbnNpb25zID0gdGhpcy5wcm9wcy5hdHRyaWJ1dGVzLmRpbWVuc2lvbnM7XG5cblx0XHRyZXR1cm4gZGltZW5zaW9ucy5oZWlnaHQgPiBjb25zdGFudHMuVEhVTUJOQUlMX0hFSUdIVCB8fCBkaW1lbnNpb25zLndpZHRoID4gY29uc3RhbnRzLlRIVU1CTkFJTF9XSURUSDtcblx0fVxuXG5cdGdldFRodW1ibmFpbFN0eWxlcygpIHtcblx0XHRpZiAodGhpcy5wcm9wcy50eXBlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignaW1hZ2UnKSA+IC0xKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHQnYmFja2dyb3VuZEltYWdlJzogJ3VybCgnICsgdGhpcy5wcm9wcy51cmwgKyAnKSdcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHt9O1xuXHR9XG59XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGaWxlQ29tcG9uZW50IGZyb20gJy4vZmlsZS1jb21wb25lbnQnO1xuaW1wb3J0IEVkaXRvckNvbXBvbmVudCBmcm9tICcuL2VkaXRvci1jb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdCdmaWxlcyc6IFtdLFxuXHRcdFx0J2VkaXRpbmcnOiBudWxsXG5cdFx0fTtcblxuXHRcdHRoaXMuZm9sZGVycyA9IFtwcm9wcy5pbml0aWFsX2ZvbGRlcl07XG5cblx0XHR0aGlzLnNvcnQgPSAnbmFtZSc7XG5cdFx0dGhpcy5kaXJlY3Rpb24gPSAnYXNjJztcblx0fVxuXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHRoaXMucHJvcHMuc3RvcmUub24oJ29uU2VhcmNoRGF0YScsIChkYXRhKSA9PiB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0J2NvdW50JzogZGF0YS5jb3VudCxcblx0XHRcdFx0J2ZpbGVzJzogZGF0YS5maWxlc1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnByb3BzLnN0b3JlLm9uKCdvbk1vcmVEYXRhJywgKGRhdGEpID0+IHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHQnY291bnQnOiBkYXRhLmNvdW50LFxuXHRcdFx0XHQnZmlsZXMnOiB0aGlzLnN0YXRlLmZpbGVzLmNvbmNhdChkYXRhLmZpbGVzKVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnByb3BzLnN0b3JlLm9uKCdvbk5hdmlnYXRlRGF0YScsIChkYXRhKSA9PiB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0J2NvdW50JzogZGF0YS5jb3VudCxcblx0XHRcdFx0J2ZpbGVzJzogZGF0YS5maWxlc1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnByb3BzLnN0b3JlLm9uKCdvbkRlbGV0ZURhdGEnLCAoZGF0YSkgPT4ge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdCdmaWxlcyc6IHRoaXMuc3RhdGUuZmlsZXMuZmlsdGVyKChmaWxlKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGRhdGEgIT09IGZpbGUuaWQ7XG5cdFx0XHRcdH0pXG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMucHJvcHMuc3RvcmUub24oJ29uU2F2ZURhdGEnLCAoaWQsIHZhbHVlcykgPT4ge1xuXHRcdFx0bGV0IGZpbGVzID0gdGhpcy5zdGF0ZS5maWxlcztcblxuXHRcdFx0ZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuXHRcdFx0XHRpZiAoZmlsZS5pZCA9PSBpZCkge1xuXHRcdFx0XHRcdGlmICh2YWx1ZXMudGl0bGUpIHtcblx0XHRcdFx0XHRcdGZpbGUudGl0bGUgPSB2YWx1ZXMudGl0bGU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHZhbHVlcy5iYXNlbmFtZSkge1xuXHRcdFx0XHRcdFx0ZmlsZS5iYXNlbmFtZSA9IHZhbHVlcy5iYXNlbmFtZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0J2ZpbGVzJzogZmlsZXMsXG5cdFx0XHRcdCdlZGl0aW5nJzogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMuaW5pdGlhbF9mb2xkZXIgIT09IHRoaXMucHJvcHMuY3VycmVudF9mb2xkZXIpIHtcblx0XHRcdHRoaXMub25OYXZpZ2F0ZSh0aGlzLnByb3BzLmN1cnJlbnRfZm9sZGVyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wcm9wcy5zdG9yZS5lbWl0KCdzZWFyY2gnKTtcblx0XHR9XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZWRpdGluZykge1xuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5Jz5cblx0XHRcdFx0PEVkaXRvckNvbXBvbmVudCBmaWxlPXt0aGlzLnN0YXRlLmVkaXRpbmd9XG5cdFx0XHRcdFx0b25GaWxlU2F2ZT17dGhpcy5vbkZpbGVTYXZlLmJpbmQodGhpcyl9XG5cdFx0XHRcdFx0b25MaXN0Q2xpY2s9e3RoaXMub25MaXN0Q2xpY2suYmluZCh0aGlzKX0gLz5cblx0XHRcdDwvZGl2PlxuXHRcdH1cblxuXHRcdGxldCBmaWxlQ29tcG9uZW50cyA9IHRoaXMuZ2V0RmlsZUNvbXBvbmVudHMoKTtcblxuXHRcdGxldCBzb3J0cyA9IFtcblx0XHRcdHsnZmllbGQnOiAndGl0bGUnLCAnZGlyZWN0aW9uJzogJ2FzYycsICdsYWJlbCc6ICd0aXRsZSBhLXonfSxcblx0XHRcdHsnZmllbGQnOiAndGl0bGUnLCAnZGlyZWN0aW9uJzogJ2Rlc2MnLCAnbGFiZWwnOiAndGl0bGUgei1hJ30sXG5cdFx0XHR7J2ZpZWxkJzogJ2NyZWF0ZWQnLCAnZGlyZWN0aW9uJzogJ2Rlc2MnLCAnbGFiZWwnOiAnbmV3ZXN0J30sXG5cdFx0XHR7J2ZpZWxkJzogJ2NyZWF0ZWQnLCAnZGlyZWN0aW9uJzogJ2FzYycsICdsYWJlbCc6ICdvbGRlc3QnfVxuXHRcdF07XG5cblx0XHRsZXQgc29ydEJ1dHRvbnMgPSBzb3J0cy5tYXAoKHNvcnQpID0+IHtcblx0XHRcdGxldCBvblNvcnQgPSAoKSA9PiB7XG5cdFx0XHRcdGxldCBmb2xkZXJzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgPT09ICdmb2xkZXInKTtcblx0XHRcdFx0bGV0IGZpbGVzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgIT09ICdmb2xkZXInKTtcblxuXHRcdFx0XHRsZXQgY29tcGFyYXRvciA9IChhLCBiKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHNvcnQuZGlyZWN0aW9uID09PSAnYXNjJykge1xuXHRcdFx0XHRcdFx0aWYgKGFbc29ydC5maWVsZF0gPCBiW3NvcnQuZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGFbc29ydC5maWVsZF0gPiBiW3NvcnQuZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoYVtzb3J0LmZpZWxkXSA+IGJbc29ydC5maWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoYVtzb3J0LmZpZWxkXSA8IGJbc29ydC5maWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2ZpbGVzJzogZm9sZGVycy5zb3J0KGNvbXBhcmF0b3IpLmNvbmNhdChmaWxlcy5zb3J0KGNvbXBhcmF0b3IpKVxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiA8b3B0aW9uIG9uQ2xpY2s9e29uU29ydH0+e3NvcnQubGFiZWx9PC9vcHRpb24+O1xuXHRcdH0pO1xuXG5cdFx0dmFyIG1vcmVCdXR0b24gPSBudWxsO1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuY291bnQgPiB0aGlzLnN0YXRlLmZpbGVzLmxlbmd0aCkge1xuXHRcdFx0bW9yZUJ1dHRvbiA9IDxidXR0b24gY2xhc3NOYW1lPVwibG9hZC1tb3JlXCIgb25DbGljaz17dGhpcy5vbk1vcmVDbGljay5iaW5kKHRoaXMpfT5Mb2FkIG1vcmU8L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0dmFyIGJhY2tCdXR0b24gPSBudWxsO1xuXG5cdFx0aWYgKHRoaXMuZm9sZGVycy5sZW5ndGggPiAxKSB7XG5cdFx0XHRiYWNrQnV0dG9uID0gPGJ1dHRvblxuXHRcdFx0XHRjbGFzc05hbWU9J3NzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tbGV2ZWwtdXAnXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25CYWNrQ2xpY2suYmluZCh0aGlzKX0+QmFjazwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuXHRcdFx0e2JhY2tCdXR0b259XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX3NvcnQgZmllbGRob2xkZXItc21hbGxcIiBzdHlsZT17e3dpZHRoOiAnMTYwcHgnfX0+XG5cdFx0XHRcdDxzZWxlY3QgY2xhc3NOYW1lPVwiZHJvcGRvd24gbm8tY2hhbmdlLXRyYWNrXCI+XG5cdFx0XHRcdFx0e3NvcnRCdXR0b25zfVxuXHRcdFx0XHQ8L3NlbGVjdD5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2l0ZW1zJz5cblx0XHRcdFx0e2ZpbGVDb21wb25lbnRzfVxuXHRcdFx0PC9kaXY+XG5cdFx0XHR7bW9yZUJ1dHRvbn1cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRvbkxpc3RDbGljaygpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdlZGl0aW5nJzogbnVsbFxuXHRcdH0pO1xuXHR9XG5cblx0Z2V0RmlsZUNvbXBvbmVudHMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3RhdGUuZmlsZXMubWFwKChmaWxlKSA9PiB7XG5cdFx0XHRyZXR1cm4gPEZpbGVDb21wb25lbnRcblx0XHRcdFx0XHR7Li4uZmlsZX1cblx0XHRcdFx0XHRvbkZpbGVEZWxldGU9e3RoaXMub25GaWxlRGVsZXRlLmJpbmQodGhpcyl9XG5cdFx0XHRcdFx0b25GaWxlRWRpdD17dGhpcy5vbkZpbGVFZGl0LmJpbmQodGhpcyl9XG5cdFx0XHRcdFx0b25GaWxlTmF2aWdhdGU9e3RoaXMub25GaWxlTmF2aWdhdGUuYmluZCh0aGlzKX1cblx0XHRcdC8+O1xuXHRcdH0pO1xuXHR9XG5cblx0b25GaWxlRGVsZXRlKGZpbGUsIGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHJlY29yZD8nKSkge1xuXHRcdFx0dGhpcy5wcm9wcy5zdG9yZS5lbWl0KCdkZWxldGUnLCBmaWxlLmlkKTtcblx0XHR9XG5cdH1cblxuXHRvbkZpbGVFZGl0KGZpbGUsIGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdlZGl0aW5nJzogZmlsZVxuXHRcdH0pO1xuXHR9XG5cblx0b25GaWxlTmF2aWdhdGUoZmlsZSkge1xuXHRcdHRoaXMuZm9sZGVycy5wdXNoKGZpbGUuZmlsZW5hbWUpO1xuXHRcdHRoaXMucHJvcHMuc3RvcmUuZW1pdCgnbmF2aWdhdGUnLCBmaWxlLmZpbGVuYW1lKTtcblx0fVxuXG5cdG9uTmF2aWdhdGUoZm9sZGVyKSB7XG5cdFx0dGhpcy5mb2xkZXJzLnB1c2goZm9sZGVyKTtcblx0XHR0aGlzLnByb3BzLnN0b3JlLmVtaXQoJ25hdmlnYXRlJywgZm9sZGVyKTtcblx0fVxuXG5cdG9uTW9yZUNsaWNrKCkge1xuXHRcdHRoaXMucHJvcHMuc3RvcmUuZW1pdCgnbW9yZScpO1xuXHR9XG5cblx0b25CYWNrQ2xpY2soKSB7XG5cdFx0aWYgKHRoaXMuZm9sZGVycy5sZW5ndGggPiAxKSB7XG5cdFx0XHR0aGlzLmZvbGRlcnMucG9wKCk7XG5cdFx0XHR0aGlzLnByb3BzLnN0b3JlLmVtaXQoJ25hdmlnYXRlJywgdGhpcy5mb2xkZXJzW3RoaXMuZm9sZGVycy5sZW5ndGggLSAxXSk7XG5cdFx0fVxuXHR9XG5cblx0b25GaWxlU2F2ZShpZCwgc3RhdGUsIGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5zdG9yZS5lbWl0KCdzYXZlJywgaWQsIHN0YXRlKTtcblxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcblx0J1RIVU1CTkFJTF9IRUlHSFQnOiAxNTAsXG5cdCdUSFVNQk5BSUxfV0lEVEgnOiAyMDBcbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBHYWxsZXJ5Q29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50L2dhbGxlcnktY29tcG9uZW50JztcbmltcG9ydCBGaWxlU3RvcmUgZnJvbSAnLi9zdG9yZS9maWxlLXN0b3JlJztcblxuZnVuY3Rpb24gZ2V0VmFyKG5hbWUpIHtcblx0dmFyIHBhcnRzID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJz8nKTtcblxuXHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdHBhcnRzID0gcGFydHNbMV0uc3BsaXQoJyMnKTtcblx0fVxuXG5cdGxldCB2YXJpYWJsZXMgPSBwYXJ0c1swXS5zcGxpdCgnJicpO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdmFyaWFibGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IHBhcnRzID0gdmFyaWFibGVzW2ldLnNwbGl0KCc9Jyk7XG5cblx0XHRpZiAoZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKSA9PT0gbmFtZSkge1xuXHRcdFx0cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG51bGw7XG59XG5cbiQoJy5hc3NldC1nYWxsZXJ5JykuZW50d2luZSh7XG5cdCdvbmFkZCc6IGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgcHJvcHMgPSB7XG5cdFx0XHQnbmFtZSc6IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktbmFtZScpLFxuXHRcdFx0J2luaXRpYWxfZm9sZGVyJzogdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1pbml0aWFsLWZvbGRlcicpXG5cdFx0fTtcblxuXHRcdGlmIChwcm9wcy5uYW1lID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRzZWFyY2ggPSAkKCcuY21zLXNlYXJjaC1mb3JtJyk7XG5cblx0XHRpZiAoJHNlYXJjaC5maW5kKCdbdHlwZT1oaWRkZW5dW25hbWU9XCJxW0ZvbGRlcl1cIl0nKS5sZW5ndGggPT0gMCkge1xuXHRcdFx0JHNlYXJjaC5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInFbRm9sZGVyXVwiIC8+Jyk7XG5cdFx0fVxuXG5cdFx0cHJvcHMuc3RvcmUgPSBGaWxlU3RvcmUuY3JlYXRlKFxuXHRcdFx0dGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1zZWFyY2gtdXJsJyksXG5cdFx0XHR0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LXVwZGF0ZS11cmwnKSxcblx0XHRcdHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktZGVsZXRlLXVybCcpLFxuXHRcdFx0dGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1saW1pdCcpLFxuXHRcdFx0JHNlYXJjaC5maW5kKCdbdHlwZT1oaWRkZW5dW25hbWU9XCJxW0ZvbGRlcl1cIl0nKVxuXHRcdCk7XG5cblx0XHRwcm9wcy5zdG9yZS5lbWl0KFxuXHRcdFx0J2ZpbHRlcicsXG5cdFx0XHRnZXRWYXIoJ3FbTmFtZV0nKSxcblx0XHRcdGdldFZhcigncVtBcHBDYXRlZ29yeV0nKSxcblx0XHRcdGdldFZhcigncVtGb2xkZXJdJyksXG5cdFx0XHRnZXRWYXIoJ3FbQ3JlYXRlZEZyb21dJyksXG5cdFx0XHRnZXRWYXIoJ3FbQ3JlYXRlZFRvXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0N1cnJlbnRGb2xkZXJPbmx5XScpXG5cdFx0KTtcblxuXHRcdHByb3BzLmN1cnJlbnRfZm9sZGVyID0gZ2V0VmFyKCdxW0ZvbGRlcl0nKSB8fCBwcm9wcy5pbml0aWFsX2ZvbGRlcjtcblxuXHRcdFJlYWN0LnJlbmRlcihcblx0XHRcdDxHYWxsZXJ5Q29tcG9uZW50IHsuLi5wcm9wc30gLz4sXG5cdFx0XHR0aGlzWzBdXG5cdFx0KTtcblxuXHRcdCQoJy5nYWxsZXJ5X19zb3J0IC5kcm9wZG93bicpLmNoYW5nZSgoKSA9PiBSZWFjdC5hZGRvbnMuVGVzdFV0aWxzLlNpbXVsYXRlLmNsaWNrKCQodGhpcykuZmluZCgnOnNlbGVjdGVkJylbMF0pKTtcblx0fVxufSk7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IEV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlU3RvcmUgZXh0ZW5kcyBFdmVudHMge1xuXHRzdGF0aWMgY3JlYXRlKC4uLnBhcmFtZXRlcnMpIHtcblx0XHRyZXR1cm4gbmV3IEZpbGVTdG9yZSguLi5wYXJhbWV0ZXJzKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKHNlYXJjaF91cmwsIHVwZGF0ZV91cmwsIGRlbGV0ZV91cmwsIGxpbWl0LCAkZm9sZGVyKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuc2VhcmNoX3VybCA9IHNlYXJjaF91cmw7XG5cdFx0dGhpcy51cGRhdGVfdXJsID0gdXBkYXRlX3VybDtcblx0XHR0aGlzLmRlbGV0ZV91cmwgPSBkZWxldGVfdXJsO1xuXHRcdHRoaXMubGltaXQgPSBsaW1pdDtcblx0XHR0aGlzLiRmb2xkZXIgPSAkZm9sZGVyO1xuXG5cdFx0dGhpcy5wYWdlID0gMTtcblxuXHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdGFkZEV2ZW50TGlzdGVuZXJzKCkge1xuXHRcdHRoaXMub24oJ3NlYXJjaCcsIHRoaXMub25TZWFyY2guYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5vbignbW9yZScsIHRoaXMub25Nb3JlLmJpbmQodGhpcykpO1xuXHRcdHRoaXMub24oJ25hdmlnYXRlJywgdGhpcy5vbk5hdmlnYXRlLmJpbmQodGhpcykpO1xuXHRcdHRoaXMub24oJ2RlbGV0ZScsIHRoaXMub25EZWxldGUuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5vbignZmlsdGVyJywgdGhpcy5vbkZpbHRlci5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLm9uKCdzYXZlJywgdGhpcy5vblNhdmUuYmluZCh0aGlzKSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdG9uU2VhcmNoKCkge1xuXHRcdHRoaXMucGFnZSA9IDE7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvblNlYXJjaERhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG9uTW9yZSgpIHtcblx0XHR0aGlzLnBhZ2UrKztcblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uTW9yZURhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG9uTmF2aWdhdGUoZm9sZGVyKSB7XG5cdFx0dGhpcy5wYWdlID0gMTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblxuXHRcdHRoaXMucGVyc2lzdEZvbGRlckZpbHRlcihmb2xkZXIpO1xuXG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLnNlYXJjaF91cmwpLnRoZW4oKGpzb24pID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25OYXZpZ2F0ZURhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdHBlcnNpc3RGb2xkZXJGaWx0ZXIoZm9sZGVyKSB7XG5cdFx0aWYgKGZvbGRlci5zdWJzdHIoLTEpID09PSAnLycpIHtcblx0XHRcdGZvbGRlciA9IGZvbGRlci5zdWJzdHIoMCwgZm9sZGVyLmxlbmd0aCAtIDEpO1xuXHRcdH1cblxuXHRcdHRoaXMuJGZvbGRlci52YWwoZm9sZGVyKTtcblx0fVxuXG5cdG9uRGVsZXRlKGlkKSB7XG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLmRlbGV0ZV91cmwsIHtcblx0XHRcdCdpZCc6IGlkXG5cdFx0fSkudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uRGVsZXRlRGF0YScsIGlkKTtcblx0XHR9KTtcblx0fVxuXG5cdG9uRmlsdGVyKG5hbWUsIHR5cGUsIGZvbGRlciwgY3JlYXRlZEZyb20sIGNyZWF0ZWRUbywgb25seVNlYXJjaEluRm9sZGVyKSB7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMuZm9sZGVyID0gZm9sZGVyO1xuXHRcdHRoaXMuY3JlYXRlZEZyb20gPSBjcmVhdGVkRnJvbTtcblx0XHR0aGlzLmNyZWF0ZWRUbyA9IGNyZWF0ZWRUbztcblx0XHR0aGlzLm9ubHlTZWFyY2hJbkZvbGRlciA9IG9ubHlTZWFyY2hJbkZvbGRlcjtcblxuXHRcdHRoaXMub25TZWFyY2goKTtcblx0fVxuXG5cdG9uU2F2ZShpZCwgdmFsdWVzKSB7XG5cdFx0dmFsdWVzWydpZCddID0gaWQ7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ1BPU1QnLCB0aGlzLnVwZGF0ZV91cmwsIHZhbHVlcykudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uU2F2ZURhdGEnLCBpZCwgdmFsdWVzKTtcblx0XHR9KTtcblx0fVxuXG5cdHJlcXVlc3QobWV0aG9kLCB1cmwsIGRhdGEgPSB7fSkge1xuXHRcdGxldCBkZWZhdWx0cyA9IHtcblx0XHRcdCdsaW1pdCc6IHRoaXMubGltaXQsXG5cdFx0XHQncGFnZSc6IHRoaXMucGFnZSxcblx0XHR9O1xuXG5cdFx0aWYgKHRoaXMubmFtZSAmJiB0aGlzLm5hbWUudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMubmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm5hbWUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmZvbGRlciAmJiB0aGlzLmZvbGRlci50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5mb2xkZXIgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5mb2xkZXIpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRGcm9tICYmIHRoaXMuY3JlYXRlZEZyb20udHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuY3JlYXRlZEZyb20gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkRnJvbSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY3JlYXRlZFRvICYmIHRoaXMuY3JlYXRlZFRvLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRUbyA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLmNyZWF0ZWRUbyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMub25seVNlYXJjaEluRm9sZGVyICYmIHRoaXMub25seVNlYXJjaEluRm9sZGVyLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm9ubHlTZWFyY2hJbkZvbGRlciA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHQndXJsJzogdXJsLFxuXHRcdFx0J21ldGhvZCc6IG1ldGhvZCxcblx0XHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHRcdCdkYXRhJzogJC5leHRlbmQoZGF0YSwgZGVmYXVsdHMpXG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==

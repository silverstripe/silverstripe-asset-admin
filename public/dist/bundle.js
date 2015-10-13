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

var FileBackend = (function (_Events) {
	_inherits(FileBackend, _Events);

	_createClass(FileBackend, null, [{
		key: 'create',
		value: function create() {
			for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
				parameters[_key] = arguments[_key];
			}

			return new (_bind.apply(FileBackend, [null].concat(parameters)))();
		}
	}]);

	function FileBackend(search_url, update_url, delete_url, limit, $folder) {
		_classCallCheck(this, FileBackend);

		_get(Object.getPrototypeOf(FileBackend.prototype), 'constructor', this).call(this);

		this.search_url = search_url;
		this.update_url = update_url;
		this.delete_url = delete_url;
		this.limit = limit;
		this.$folder = $folder;

		this.page = 1;

		this.addEventListeners();
	}

	_createClass(FileBackend, [{
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
			var _this6 = this;

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

			this.showLoadingIndicator();

			return _jquery2['default'].ajax({
				'url': url,
				'method': method,
				'dataType': 'json',
				'data': _jquery2['default'].extend(defaults, data)
			}).always(function () {
				_this6.hideLoadingIndicator();
			});
		}
	}, {
		key: 'showLoadingIndicator',
		value: function showLoadingIndicator() {
			(0, _jquery2['default'])('.cms-content, .ui-dialog').addClass('loading');
			(0, _jquery2['default'])('.ui-dialog-content').css('opacity', '.1');
		}
	}, {
		key: 'hideLoadingIndicator',
		value: function hideLoadingIndicator() {
			(0, _jquery2['default'])('.cms-content, .ui-dialog').removeClass('loading');
			(0, _jquery2['default'])('.ui-dialog-content').css('opacity', '1');
		}
	}]);

	return FileBackend;
})(_events2['default']);

exports['default'] = FileBackend;
module.exports = exports['default'];

},{"events":1,"jquery":"jquery"}],3:[function(require,module,exports){
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

			var fields = [{ 'label': 'Title', 'name': 'title', 'value': this.props.file.title }, { 'label': 'Filename', 'name': 'basename', 'value': this.props.file.basename }];

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
						field.label
					),
					_react2['default'].createElement(
						'div',
						{ className: 'middleColumn' },
						_react2['default'].createElement('input', { className: 'text', type: 'text', onChange: handler, value: _this.state[field.name] })
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
				{ className: 'item ' + this.props.category, 'data-id': this.props.id, onClick: onFileNavigate },
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

},{"../constants":6,"jquery":"jquery","react":"react"}],5:[function(require,module,exports){
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
		key: 'getListeners',
		value: function getListeners() {
			var _this = this;

			return {
				'onSearchData': function onSearchData(data) {
					_this.setState({
						'count': data.count,
						'files': data.files
					});
				},
				'onMoreData': function onMoreData(data) {
					_this.setState({
						'count': data.count,
						'files': _this.state.files.concat(data.files)
					});
				},
				'onNavigateData': function onNavigateData(data) {
					_this.setState({
						'count': data.count,
						'files': data.files
					});
				},
				'onDeleteData': function onDeleteData(data) {
					_this.setState({
						'files': _this.state.files.filter(function (file) {
							return data !== file.id;
						})
					});
				},
				'onSaveData': function onSaveData(id, values) {
					var files = _this.state.files;

					files.forEach(function (file) {
						if (file.id == id) {
							file.title = values.title;
							file.basename = values.basename;
						}
					});

					_this.setState({
						'files': files,
						'editing': false
					});
				}
			};
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var listeners = this.getListeners();

			for (var _event in listeners) {
				this.props.backend.on(_event, listeners[_event]);
			}

			if (this.props.initial_folder !== this.props.current_folder) {
				this.onNavigate(this.props.current_folder);
			} else {
				this.props.backend.emit('search');
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			var listeners = this.getListeners();

			for (var _event2 in listeners) {
				this.props.backend.removeListener(_event2, listeners[_event2]);
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var $select = (0, _jquery2['default'])(_react2['default'].findDOMNode(this)).find('.gallery__sort .dropdown');

			// We opt-out of letting the CMS handle Chosen because it doesn't re-apply the behaviour correctly.
			// So after the gallery has been rendered we apply Chosen ourself.
			$select.chosen({
				'allow_single_deselect': true,
				'disable_search_threshold': 20
			});

			// Chosen stops the change event from reaching React so we have to simulate a click.
			$select.change(function () {
				return _react2['default'].addons.TestUtils.Simulate.click($select.find(':selected')[0]);
			});
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
					{ className: 'gallery__load__more', onClick: this.onMoreClick.bind(this) },
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
						{ className: 'dropdown no-change-track no-chzn' },
						sortButtons
					)
				),
				_react2['default'].createElement(
					'div',
					{ className: 'gallery__items' },
					fileComponents
				),
				_react2['default'].createElement(
					'div',
					{ className: 'gallery__load' },
					moreButton
				)
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
				this.props.backend.emit('delete', file.id);
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
			this.props.backend.emit('navigate', file.filename);
		}
	}, {
		key: 'onNavigate',
		value: function onNavigate(folder) {
			this.folders.push(folder);
			this.props.backend.emit('navigate', folder);
		}
	}, {
		key: 'onMoreClick',
		value: function onMoreClick(event) {
			event.preventDefault(); //Prevent submission of insert media dialog
			this.props.backend.emit('more');
		}
	}, {
		key: 'onBackClick',
		value: function onBackClick(event) {
			event.preventDefault(); //Prevent submission of insert media dialog
			if (this.folders.length > 1) {
				this.folders.pop();
				this.props.backend.emit('navigate', this.folders[this.folders.length - 1]);
			}
		}
	}, {
		key: 'onFileSave',
		value: function onFileSave(id, state, event) {
			this.props.backend.emit('save', id, state);

			event.stopPropagation();
			event.preventDefault();
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

var _backendFileBackend = require('./backend/file-backend');

var _backendFileBackend2 = _interopRequireDefault(_backendFileBackend);

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

		props.backend = _backendFileBackend2['default'].create(this[0].getAttribute('data-asset-gallery-search-url'), this[0].getAttribute('data-asset-gallery-update-url'), this[0].getAttribute('data-asset-gallery-delete-url'), this[0].getAttribute('data-asset-gallery-limit'), $search.find('[type=hidden][name="q[Folder]"]'));

		props.backend.emit('filter', getVar('q[Name]'), getVar('q[AppCategory]'), getVar('q[Folder]'), getVar('q[CreatedFrom]'), getVar('q[CreatedTo]'), getVar('q[CurrentFolderOnly]'));

		props.current_folder = getVar('q[Folder]') || props.initial_folder;

		_react2['default'].render(_react2['default'].createElement(_componentGalleryComponent2['default'], props), this[0]);
	}
});

},{"./backend/file-backend":2,"./component/gallery-component":5,"jquery":"jquery","react":"react"}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2JhY2tlbmQvZmlsZS1iYWNrZW5kLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2VkaXRvci1jb21wb25lbnQuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZmlsZS1jb21wb25lbnQuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZ2FsbGVyeS1jb21wb25lbnQuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb25zdGFudHMuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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SSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQywrQkFBK0IsQ0FBQyxFQUNyRCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDLEVBQ2hELE9BQU8sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FDL0MsQ0FBQzs7QUFFRixPQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDakIsUUFBUSxFQUNSLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFDakIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQ3hCLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFDbkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQ3hCLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFDdEIsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQzlCLENBQUM7O0FBRUYsT0FBSyxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQzs7QUFFbkUscUJBQU0sTUFBTSxDQUNYLHlFQUFzQixLQUFLLENBQUksRUFDL0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUNQLENBQUM7RUFDRjtDQUNELENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IEV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlQmFja2VuZCBleHRlbmRzIEV2ZW50cyB7XG5cdHN0YXRpYyBjcmVhdGUoLi4ucGFyYW1ldGVycykge1xuXHRcdHJldHVybiBuZXcgRmlsZUJhY2tlbmQoLi4ucGFyYW1ldGVycyk7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcihzZWFyY2hfdXJsLCB1cGRhdGVfdXJsLCBkZWxldGVfdXJsLCBsaW1pdCwgJGZvbGRlcikge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLnNlYXJjaF91cmwgPSBzZWFyY2hfdXJsO1xuXHRcdHRoaXMudXBkYXRlX3VybCA9IHVwZGF0ZV91cmw7XG5cdFx0dGhpcy5kZWxldGVfdXJsID0gZGVsZXRlX3VybDtcblx0XHR0aGlzLmxpbWl0ID0gbGltaXQ7XG5cdFx0dGhpcy4kZm9sZGVyID0gJGZvbGRlcjtcblxuXHRcdHRoaXMucGFnZSA9IDE7XG5cblx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG5cdH1cblxuXHRhZGRFdmVudExpc3RlbmVycygpIHtcblx0XHR0aGlzLm9uKCdzZWFyY2gnLCB0aGlzLm9uU2VhcmNoLmJpbmQodGhpcykpO1xuXHRcdHRoaXMub24oJ21vcmUnLCB0aGlzLm9uTW9yZS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLm9uKCduYXZpZ2F0ZScsIHRoaXMub25OYXZpZ2F0ZS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLm9uKCdkZWxldGUnLCB0aGlzLm9uRGVsZXRlLmJpbmQodGhpcykpO1xuXHRcdHRoaXMub24oJ2ZpbHRlcicsIHRoaXMub25GaWx0ZXIuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5vbignc2F2ZScsIHRoaXMub25TYXZlLmJpbmQodGhpcykpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRvblNlYXJjaCgpIHtcblx0XHR0aGlzLnBhZ2UgPSAxO1xuXG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLnNlYXJjaF91cmwpLnRoZW4oKGpzb24pID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25TZWFyY2hEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRvbk1vcmUoKSB7XG5cdFx0dGhpcy5wYWdlKys7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvbk1vcmVEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRvbk5hdmlnYXRlKGZvbGRlcikge1xuXHRcdHRoaXMucGFnZSA9IDE7XG5cdFx0dGhpcy5mb2xkZXIgPSBmb2xkZXI7XG5cblx0XHR0aGlzLnBlcnNpc3RGb2xkZXJGaWx0ZXIoZm9sZGVyKTtcblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uTmF2aWdhdGVEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRwZXJzaXN0Rm9sZGVyRmlsdGVyKGZvbGRlcikge1xuXHRcdGlmIChmb2xkZXIuc3Vic3RyKC0xKSA9PT0gJy8nKSB7XG5cdFx0XHRmb2xkZXIgPSBmb2xkZXIuc3Vic3RyKDAsIGZvbGRlci5sZW5ndGggLSAxKTtcblx0XHR9XG5cblx0XHR0aGlzLiRmb2xkZXIudmFsKGZvbGRlcik7XG5cdH1cblxuXHRvbkRlbGV0ZShpZCkge1xuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5kZWxldGVfdXJsLCB7XG5cdFx0XHQnaWQnOiBpZFxuXHRcdH0pLnRoZW4oKCkgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvbkRlbGV0ZURhdGEnLCBpZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbHRlcihuYW1lLCB0eXBlLCBmb2xkZXIsIGNyZWF0ZWRGcm9tLCBjcmVhdGVkVG8sIG9ubHlTZWFyY2hJbkZvbGRlcikge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblx0XHR0aGlzLmNyZWF0ZWRGcm9tID0gY3JlYXRlZEZyb207XG5cdFx0dGhpcy5jcmVhdGVkVG8gPSBjcmVhdGVkVG87XG5cdFx0dGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIgPSBvbmx5U2VhcmNoSW5Gb2xkZXI7XG5cblx0XHR0aGlzLm9uU2VhcmNoKCk7XG5cdH1cblxuXHRvblNhdmUoaWQsIHZhbHVlcykge1xuXHRcdHZhbHVlc1snaWQnXSA9IGlkO1xuXG5cdFx0dGhpcy5yZXF1ZXN0KCdQT1NUJywgdGhpcy51cGRhdGVfdXJsLCB2YWx1ZXMpLnRoZW4oKCkgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvblNhdmVEYXRhJywgaWQsIHZhbHVlcyk7XG5cdFx0fSk7XG5cdH1cblxuXHRyZXF1ZXN0KG1ldGhvZCwgdXJsLCBkYXRhID0ge30pIHtcblx0XHRsZXQgZGVmYXVsdHMgPSB7XG5cdFx0XHQnbGltaXQnOiB0aGlzLmxpbWl0LFxuXHRcdFx0J3BhZ2UnOiB0aGlzLnBhZ2UsXG5cdFx0fTtcblxuXHRcdGlmICh0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5uYW1lKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5mb2xkZXIgJiYgdGhpcy5mb2xkZXIudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuZm9sZGVyID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMuZm9sZGVyKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5jcmVhdGVkRnJvbSAmJiB0aGlzLmNyZWF0ZWRGcm9tLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRGcm9tID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMuY3JlYXRlZEZyb20pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRUbyAmJiB0aGlzLmNyZWF0ZWRUby50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5jcmVhdGVkVG8gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkVG8pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlciAmJiB0aGlzLm9ubHlTZWFyY2hJbkZvbGRlci50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5vbmx5U2VhcmNoSW5Gb2xkZXIgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIpO1xuXHRcdH1cblxuXHRcdHRoaXMuc2hvd0xvYWRpbmdJbmRpY2F0b3IoKTtcblxuXHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0J3VybCc6IHVybCxcblx0XHRcdCdtZXRob2QnOiBtZXRob2QsXG5cdFx0XHQnZGF0YVR5cGUnOiAnanNvbicsXG5cdFx0XHQnZGF0YSc6ICQuZXh0ZW5kKGRlZmF1bHRzLCBkYXRhKVxuXHRcdH0pLmFsd2F5cygoKSA9PiB7XG5cdFx0XHR0aGlzLmhpZGVMb2FkaW5nSW5kaWNhdG9yKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRzaG93TG9hZGluZ0luZGljYXRvcigpIHtcblx0XHQkKCcuY21zLWNvbnRlbnQsIC51aS1kaWFsb2cnKS5hZGRDbGFzcygnbG9hZGluZycpO1xuXHRcdCQoJy51aS1kaWFsb2ctY29udGVudCcpLmNzcygnb3BhY2l0eScsICcuMScpO1xuXHR9XG5cblx0aGlkZUxvYWRpbmdJbmRpY2F0b3IoKSB7XG5cdFx0JCgnLmNtcy1jb250ZW50LCAudWktZGlhbG9nJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblx0XHQkKCcudWktZGlhbG9nLWNvbnRlbnQnKS5jc3MoJ29wYWNpdHknLCAnMScpO1xuXHR9XG59XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuc3RhdGUgPSB7XG5cdFx0XHQndGl0bGUnOiB0aGlzLnByb3BzLmZpbGUudGl0bGUsXG5cdFx0XHQnYmFzZW5hbWUnOiB0aGlzLnByb3BzLmZpbGUuYmFzZW5hbWVcblx0XHR9O1xuXHR9XG5cdHJlbmRlcigpIHtcblx0XHRsZXQgdGV4dElucHV0cyA9IHRoaXMuZ2V0VGV4dElucHV0cygpO1xuXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdlZGl0b3InPlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvIG5vbGFiZWwnPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tcHJldmlldyBub2xhYmVsJz5cblx0XHRcdFx0XHQ8aW1nIGNsYXNzTmFtZT0ndGh1bWJuYWlsLXByZXZpZXcnIHNyYz17dGhpcy5wcm9wcy5maWxlLnVybH0gLz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1kYXRhIG5vbGFiZWwnPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgbm9sYWJlbCc+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaWxlIHR5cGU6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS50eXBlfTwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RmlsZSBzaXplOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5zaXplfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5VUkw6PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPXt0aGlzLnByb3BzLmZpbGUudXJsfSB0YXJnZXQ9J19ibGFuayc+e3RoaXMucHJvcHMuZmlsZS51cmx9PC9hPlxuXHRcdFx0XHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgZGF0ZV9kaXNhYmxlZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5GaXJzdCB1cGxvYWRlZDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuY3JlYXRlZH08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgZGF0ZV9kaXNhYmxlZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5MYXN0IGNoYW5nZWQ6PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmxhc3RVcGRhdGVkfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5EaW1lbnNpb25zOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMud2lkdGh9IHgge3RoaXMucHJvcHMuZmlsZS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMuaGVpZ2h0fXB4PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cblx0XHRcdHt0ZXh0SW5wdXRzfVxuXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8YnV0dG9uIHR5cGU9J3N1Ym1pdCcgY2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWJ1dHRvbiB1aS13aWRnZXQgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsIGZvbnQtaWNvbi1jaGVjay1tYXJrXCIgb25DbGljaz17dGhpcy5vbkZpbGVTYXZlLmJpbmQodGhpcyl9PlNhdmU8L2J1dHRvbj5cblx0XHRcdFx0PGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT1cInNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tY2FuY2VsLWNpcmNsZWRcIiBvbkNsaWNrPXt0aGlzLnByb3BzLm9uTGlzdENsaWNrfT5DYW5jZWw8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2Pjtcblx0fVxuXG5cdGdldFRleHRJbnB1dHMoKSB7XG5cdFx0bGV0IGZpZWxkcyA9IFtcblx0XHRcdHsnbGFiZWwnOiAnVGl0bGUnLCAnbmFtZSc6ICd0aXRsZScsICd2YWx1ZSc6IHRoaXMucHJvcHMuZmlsZS50aXRsZX0sXG5cdFx0XHR7J2xhYmVsJzogJ0ZpbGVuYW1lJywgJ25hbWUnOiAnYmFzZW5hbWUnLCAndmFsdWUnOiB0aGlzLnByb3BzLmZpbGUuYmFzZW5hbWV9XG5cdFx0XTtcblxuXHRcdHJldHVybiBmaWVsZHMubWFwKChmaWVsZCkgPT4ge1xuXHRcdFx0bGV0IGhhbmRsZXIgPSAoZXZlbnQpID0+IHtcblx0XHRcdFx0dGhpcy5vbkZpZWxkQ2hhbmdlLmNhbGwodGhpcywgZXZlbnQsIGZpZWxkLm5hbWUpO1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCB0ZXh0Jz5cblx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2ZpZWxkLmxhYmVsfTwvbGFiZWw+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdDxpbnB1dCBjbGFzc05hbWU9XCJ0ZXh0XCIgdHlwZT0ndGV4dCcgb25DaGFuZ2U9e2hhbmRsZXJ9IHZhbHVlPXt0aGlzLnN0YXRlW2ZpZWxkLm5hbWVdfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdH0pO1xuXHR9XG5cblx0b25GaWVsZENoYW5nZShldmVudCwgbmFtZSkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0W25hbWVdOiBldmVudC50YXJnZXQudmFsdWVcblx0XHR9KTtcblx0fVxuXG5cdG9uRmlsZVNhdmUoZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLm9uRmlsZVNhdmUodGhpcy5wcm9wcy5maWxlLmlkLCB0aGlzLnN0YXRlLCBldmVudCk7XG5cdH1cbn1cbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdHJlbmRlcigpIHtcblx0XHRsZXQgdGh1bWJuYWlsU3R5bGVzID0gdGhpcy5nZXRUaHVtYm5haWxTdHlsZXMoKTtcblx0XHRsZXQgdGh1bWJuYWlsQ2xhc3NOYW1lcyA9IHRoaXMuZ2V0VGh1bWJuYWlsQ2xhc3NOYW1lcygpO1xuXG5cdFx0dmFyIG9uRmlsZU5hdmlnYXRlID0gKCkgPT4gbnVsbDtcblxuXHRcdGlmICh0aGlzLnByb3BzLnR5cGUgPT09ICdmb2xkZXInKSB7XG5cdFx0XHRvbkZpbGVOYXZpZ2F0ZSA9IChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLnByb3BzLm9uRmlsZU5hdmlnYXRlKHRoaXMucHJvcHMsIGV2ZW50KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRsZXQgb25GaWxlRGVsZXRlID0gKGV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLnByb3BzLm9uRmlsZURlbGV0ZSh0aGlzLnByb3BzLCBldmVudCk7XG5cdFx0fTtcblxuXHRcdGxldCBvbkZpbGVFZGl0ID0gKGV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLnByb3BzLm9uRmlsZUVkaXQodGhpcy5wcm9wcywgZXZlbnQpO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9eydpdGVtICcgKyB0aGlzLnByb3BzLmNhdGVnb3J5fSBkYXRhLWlkPXt0aGlzLnByb3BzLmlkfSBvbkNsaWNrPXtvbkZpbGVOYXZpZ2F0ZX0+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dGh1bWJuYWlsQ2xhc3NOYW1lc30gc3R5bGU9e3RodW1ibmFpbFN0eWxlc30+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zJz5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXJlbW92ZSBbIGZvbnQtaWNvbi10cmFzaCBdJ1xuXHRcdFx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHRcdFx0b25DbGljaz17b25GaWxlRGVsZXRlfT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLWVkaXQgWyBmb250LWljb24tZWRpdCBdJ1xuXHRcdFx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHRcdFx0b25DbGljaz17b25GaWxlRWRpdH0+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8cCBjbGFzc05hbWU9J2l0ZW1fX3RpdGxlJz57dGhpcy5wcm9wcy50aXRsZX08L3A+XG5cdFx0PC9kaXY+O1xuXHR9XG5cblx0Z2V0SXRlbUNsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIGl0ZW1DbGFzc05hbWVzID0gJ2l0ZW0gJyArIHRoaXMucHJvcHMudHlwZTtcblxuXHRcdGlmICh0aGlzLnByb3BzLnR5cGUgPT09ICdmb2xkZXInKSB7XG5cdFx0XHRpdGVtQ2xhc3NOYW1lcyArPSAnIGZvbGRlcic7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW1DbGFzc05hbWVzO1xuXHR9XG5cblx0Z2V0VGh1bWJuYWlsQ2xhc3NOYW1lcygpIHtcblx0XHR2YXIgdGh1bWJuYWlsQ2xhc3NOYW1lcyA9ICdpdGVtX190aHVtYm5haWwnO1xuXG5cdFx0aWYgKHRoaXMuaXNJbWFnZUxhcmdlclRoYW5UaHVtYm5haWwoKSkge1xuXHRcdFx0dGh1bWJuYWlsQ2xhc3NOYW1lcyArPSAnIGxhcmdlJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGh1bWJuYWlsQ2xhc3NOYW1lcztcblx0fVxuXG5cdGlzSW1hZ2VMYXJnZXJUaGFuVGh1bWJuYWlsKCkge1xuXHRcdGxldCBkaW1lbnNpb25zID0gdGhpcy5wcm9wcy5hdHRyaWJ1dGVzLmRpbWVuc2lvbnM7XG5cblx0XHRyZXR1cm4gZGltZW5zaW9ucy5oZWlnaHQgPiBjb25zdGFudHMuVEhVTUJOQUlMX0hFSUdIVCB8fCBkaW1lbnNpb25zLndpZHRoID4gY29uc3RhbnRzLlRIVU1CTkFJTF9XSURUSDtcblx0fVxuXG5cdGdldFRodW1ibmFpbFN0eWxlcygpIHtcblx0XHRpZiAodGhpcy5wcm9wcy50eXBlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignaW1hZ2UnKSA+IC0xKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHQnYmFja2dyb3VuZEltYWdlJzogJ3VybCgnICsgdGhpcy5wcm9wcy51cmwgKyAnKSdcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHt9O1xuXHR9XG59XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGaWxlQ29tcG9uZW50IGZyb20gJy4vZmlsZS1jb21wb25lbnQnO1xuaW1wb3J0IEVkaXRvckNvbXBvbmVudCBmcm9tICcuL2VkaXRvci1jb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdCdmaWxlcyc6IFtdLFxuXHRcdFx0J2VkaXRpbmcnOiBudWxsXG5cdFx0fTtcblxuXHRcdHRoaXMuZm9sZGVycyA9IFtwcm9wcy5pbml0aWFsX2ZvbGRlcl07XG5cblx0XHR0aGlzLnNvcnQgPSAnbmFtZSc7XG5cdFx0dGhpcy5kaXJlY3Rpb24gPSAnYXNjJztcblx0fVxuXG5cdGdldExpc3RlbmVycygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0J29uU2VhcmNoRGF0YSc6IChkYXRhKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdCdjb3VudCc6IGRhdGEuY291bnQsXG5cdFx0XHRcdFx0J2ZpbGVzJzogZGF0YS5maWxlc1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHQnb25Nb3JlRGF0YSc6IChkYXRhKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdCdjb3VudCc6IGRhdGEuY291bnQsXG5cdFx0XHRcdFx0J2ZpbGVzJzogdGhpcy5zdGF0ZS5maWxlcy5jb25jYXQoZGF0YS5maWxlcylcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0J29uTmF2aWdhdGVEYXRhJzogKGRhdGEpID0+IHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2NvdW50JzogZGF0YS5jb3VudCxcblx0XHRcdFx0XHQnZmlsZXMnOiBkYXRhLmZpbGVzXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdCdvbkRlbGV0ZURhdGEnOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHQnZmlsZXMnOiB0aGlzLnN0YXRlLmZpbGVzLmZpbHRlcigoZmlsZSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGEgIT09IGZpbGUuaWQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0J29uU2F2ZURhdGEnOiAoaWQsIHZhbHVlcykgPT4ge1xuXHRcdFx0XHRsZXQgZmlsZXMgPSB0aGlzLnN0YXRlLmZpbGVzO1xuXG5cdFx0XHRcdGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcblx0XHRcdFx0XHRpZiAoZmlsZS5pZCA9PSBpZCkge1xuXHRcdFx0XHRcdFx0ZmlsZS50aXRsZSA9IHZhbHVlcy50aXRsZTtcblx0XHRcdFx0XHRcdGZpbGUuYmFzZW5hbWUgPSB2YWx1ZXMuYmFzZW5hbWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHQnZmlsZXMnOiBmaWxlcyxcblx0XHRcdFx0XHQnZWRpdGluZyc6IGZhbHNlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHRsZXQgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnMoKTtcblxuXHRcdGZvciAobGV0IGV2ZW50IGluIGxpc3RlbmVycykge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm9uKGV2ZW50LCBsaXN0ZW5lcnNbZXZlbnRdKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcm9wcy5pbml0aWFsX2ZvbGRlciAhPT0gdGhpcy5wcm9wcy5jdXJyZW50X2ZvbGRlcikge1xuXHRcdFx0dGhpcy5vbk5hdmlnYXRlKHRoaXMucHJvcHMuY3VycmVudF9mb2xkZXIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnByb3BzLmJhY2tlbmQuZW1pdCgnc2VhcmNoJyk7XG5cdFx0fVxuXHR9XG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQoKSB7XG5cdFx0bGV0IGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzKCk7XG5cblx0XHRmb3IgKGxldCBldmVudCBpbiBsaXN0ZW5lcnMpIHtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzW2V2ZW50XSk7XG5cdFx0fVxuXHR9XG5cblx0Y29tcG9uZW50RGlkVXBkYXRlKCkge1xuXHRcdHZhciAkc2VsZWN0ID0gJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmdhbGxlcnlfX3NvcnQgLmRyb3Bkb3duJyk7XG5cblx0XHQvLyBXZSBvcHQtb3V0IG9mIGxldHRpbmcgdGhlIENNUyBoYW5kbGUgQ2hvc2VuIGJlY2F1c2UgaXQgZG9lc24ndCByZS1hcHBseSB0aGUgYmVoYXZpb3VyIGNvcnJlY3RseS5cblx0XHQvLyBTbyBhZnRlciB0aGUgZ2FsbGVyeSBoYXMgYmVlbiByZW5kZXJlZCB3ZSBhcHBseSBDaG9zZW4gb3Vyc2VsZi5cblx0XHQkc2VsZWN0LmNob3Nlbih7XG5cdFx0XHQnYWxsb3dfc2luZ2xlX2Rlc2VsZWN0JzogdHJ1ZSxcblx0XHRcdCdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnOiAyMFxuXHRcdH0pO1xuXG5cdFx0Ly8gQ2hvc2VuIHN0b3BzIHRoZSBjaGFuZ2UgZXZlbnQgZnJvbSByZWFjaGluZyBSZWFjdCBzbyB3ZSBoYXZlIHRvIHNpbXVsYXRlIGEgY2xpY2suXG5cdFx0JHNlbGVjdC5jaGFuZ2UoKCkgPT4gUmVhY3QuYWRkb25zLlRlc3RVdGlscy5TaW11bGF0ZS5jbGljaygkc2VsZWN0LmZpbmQoJzpzZWxlY3RlZCcpWzBdKSk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZWRpdGluZykge1xuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5Jz5cblx0XHRcdFx0PEVkaXRvckNvbXBvbmVudCBmaWxlPXt0aGlzLnN0YXRlLmVkaXRpbmd9XG5cdFx0XHRcdFx0b25GaWxlU2F2ZT17dGhpcy5vbkZpbGVTYXZlLmJpbmQodGhpcyl9XG5cdFx0XHRcdFx0b25MaXN0Q2xpY2s9e3RoaXMub25MaXN0Q2xpY2suYmluZCh0aGlzKX0gLz5cblx0XHRcdDwvZGl2PlxuXHRcdH1cblxuXHRcdGxldCBmaWxlQ29tcG9uZW50cyA9IHRoaXMuZ2V0RmlsZUNvbXBvbmVudHMoKTtcblxuXHRcdGxldCBzb3J0cyA9IFtcblx0XHRcdHsnZmllbGQnOiAndGl0bGUnLCAnZGlyZWN0aW9uJzogJ2FzYycsICdsYWJlbCc6ICd0aXRsZSBhLXonfSxcblx0XHRcdHsnZmllbGQnOiAndGl0bGUnLCAnZGlyZWN0aW9uJzogJ2Rlc2MnLCAnbGFiZWwnOiAndGl0bGUgei1hJ30sXG5cdFx0XHR7J2ZpZWxkJzogJ2NyZWF0ZWQnLCAnZGlyZWN0aW9uJzogJ2Rlc2MnLCAnbGFiZWwnOiAnbmV3ZXN0J30sXG5cdFx0XHR7J2ZpZWxkJzogJ2NyZWF0ZWQnLCAnZGlyZWN0aW9uJzogJ2FzYycsICdsYWJlbCc6ICdvbGRlc3QnfVxuXHRcdF07XG5cblx0XHRsZXQgc29ydEJ1dHRvbnMgPSBzb3J0cy5tYXAoKHNvcnQpID0+IHtcblx0XHRcdGxldCBvblNvcnQgPSAoKSA9PiB7XG5cdFx0XHRcdGxldCBmb2xkZXJzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgPT09ICdmb2xkZXInKTtcblx0XHRcdFx0bGV0IGZpbGVzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgIT09ICdmb2xkZXInKTtcblxuXHRcdFx0XHRsZXQgY29tcGFyYXRvciA9IChhLCBiKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHNvcnQuZGlyZWN0aW9uID09PSAnYXNjJykge1xuXHRcdFx0XHRcdFx0aWYgKGFbc29ydC5maWVsZF0gPCBiW3NvcnQuZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGFbc29ydC5maWVsZF0gPiBiW3NvcnQuZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoYVtzb3J0LmZpZWxkXSA+IGJbc29ydC5maWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoYVtzb3J0LmZpZWxkXSA8IGJbc29ydC5maWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2ZpbGVzJzogZm9sZGVycy5zb3J0KGNvbXBhcmF0b3IpLmNvbmNhdChmaWxlcy5zb3J0KGNvbXBhcmF0b3IpKVxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiA8b3B0aW9uIG9uQ2xpY2s9e29uU29ydH0+e3NvcnQubGFiZWx9PC9vcHRpb24+O1xuXHRcdH0pO1xuXG5cdFx0dmFyIG1vcmVCdXR0b24gPSBudWxsO1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuY291bnQgPiB0aGlzLnN0YXRlLmZpbGVzLmxlbmd0aCkge1xuXHRcdFx0bW9yZUJ1dHRvbiA9IDxidXR0b24gY2xhc3NOYW1lPVwiZ2FsbGVyeV9fbG9hZF9fbW9yZVwiIG9uQ2xpY2s9e3RoaXMub25Nb3JlQ2xpY2suYmluZCh0aGlzKX0+TG9hZCBtb3JlPC9idXR0b24+O1xuXHRcdH1cblxuXHRcdHZhciBiYWNrQnV0dG9uID0gbnVsbDtcblxuXHRcdGlmICh0aGlzLmZvbGRlcnMubGVuZ3RoID4gMSkge1xuXHRcdFx0YmFja0J1dHRvbiA9IDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPSdzcy11aS1idXR0b24gdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWxldmVsLXVwJ1xuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uQmFja0NsaWNrLmJpbmQodGhpcyl9PkJhY2s8L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5Jz5cblx0XHRcdHtiYWNrQnV0dG9ufVxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5X19zb3J0IGZpZWxkaG9sZGVyLXNtYWxsXCIgc3R5bGU9e3t3aWR0aDogJzE2MHB4J319PlxuXHRcdFx0XHQ8c2VsZWN0IGNsYXNzTmFtZT1cImRyb3Bkb3duIG5vLWNoYW5nZS10cmFjayBuby1jaHpuXCI+XG5cdFx0XHRcdFx0e3NvcnRCdXR0b25zfVxuXHRcdFx0XHQ8L3NlbGVjdD5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2l0ZW1zJz5cblx0XHRcdFx0e2ZpbGVDb21wb25lbnRzfVxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX2xvYWRcIj5cblx0XHRcdFx0e21vcmVCdXR0b259XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRvbkxpc3RDbGljaygpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdlZGl0aW5nJzogbnVsbFxuXHRcdH0pO1xuXHR9XG5cblx0Z2V0RmlsZUNvbXBvbmVudHMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3RhdGUuZmlsZXMubWFwKChmaWxlKSA9PiB7XG5cdFx0XHRyZXR1cm4gPEZpbGVDb21wb25lbnRcblx0XHRcdFx0XHR7Li4uZmlsZX1cblx0XHRcdFx0XHRvbkZpbGVEZWxldGU9e3RoaXMub25GaWxlRGVsZXRlLmJpbmQodGhpcyl9XG5cdFx0XHRcdFx0b25GaWxlRWRpdD17dGhpcy5vbkZpbGVFZGl0LmJpbmQodGhpcyl9XG5cdFx0XHRcdFx0b25GaWxlTmF2aWdhdGU9e3RoaXMub25GaWxlTmF2aWdhdGUuYmluZCh0aGlzKX1cblx0XHRcdC8+O1xuXHRcdH0pO1xuXHR9XG5cblx0b25GaWxlRGVsZXRlKGZpbGUsIGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHJlY29yZD8nKSkge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLmVtaXQoJ2RlbGV0ZScsIGZpbGUuaWQpO1xuXHRcdH1cblx0fVxuXG5cdG9uRmlsZUVkaXQoZmlsZSwgZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0J2VkaXRpbmcnOiBmaWxlXG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbGVOYXZpZ2F0ZShmaWxlKSB7XG5cdFx0dGhpcy5mb2xkZXJzLnB1c2goZmlsZS5maWxlbmFtZSk7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLmVtaXQoJ25hdmlnYXRlJywgZmlsZS5maWxlbmFtZSk7XG5cdH1cblxuXHRvbk5hdmlnYXRlKGZvbGRlcikge1xuXHRcdHRoaXMuZm9sZGVycy5wdXNoKGZvbGRlcik7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLmVtaXQoJ25hdmlnYXRlJywgZm9sZGVyKTtcblx0fVxuXG5cdG9uTW9yZUNsaWNrKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy9QcmV2ZW50IHN1Ym1pc3Npb24gb2YgaW5zZXJ0IG1lZGlhIGRpYWxvZ1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5lbWl0KCdtb3JlJyk7XG5cdH1cblxuXHRvbkJhY2tDbGljayhldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vUHJldmVudCBzdWJtaXNzaW9uIG9mIGluc2VydCBtZWRpYSBkaWFsb2dcblx0XHRpZiAodGhpcy5mb2xkZXJzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHRoaXMuZm9sZGVycy5wb3AoKTtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5lbWl0KCduYXZpZ2F0ZScsIHRoaXMuZm9sZGVyc1t0aGlzLmZvbGRlcnMubGVuZ3RoIC0gMV0pO1xuXHRcdH1cblx0fVxuXG5cdG9uRmlsZVNhdmUoaWQsIHN0YXRlLCBldmVudCkge1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5lbWl0KCdzYXZlJywgaWQsIHN0YXRlKTtcblxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcblx0J1RIVU1CTkFJTF9IRUlHSFQnOiAxNTAsXG5cdCdUSFVNQk5BSUxfV0lEVEgnOiAyMDBcbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBHYWxsZXJ5Q29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50L2dhbGxlcnktY29tcG9uZW50JztcbmltcG9ydCBGaWxlQmFja2VuZCBmcm9tICcuL2JhY2tlbmQvZmlsZS1iYWNrZW5kJztcblxuZnVuY3Rpb24gZ2V0VmFyKG5hbWUpIHtcblx0dmFyIHBhcnRzID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJz8nKTtcblxuXHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdHBhcnRzID0gcGFydHNbMV0uc3BsaXQoJyMnKTtcblx0fVxuXG5cdGxldCB2YXJpYWJsZXMgPSBwYXJ0c1swXS5zcGxpdCgnJicpO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdmFyaWFibGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IHBhcnRzID0gdmFyaWFibGVzW2ldLnNwbGl0KCc9Jyk7XG5cblx0XHRpZiAoZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKSA9PT0gbmFtZSkge1xuXHRcdFx0cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG51bGw7XG59XG5cbiQoJy5hc3NldC1nYWxsZXJ5JykuZW50d2luZSh7XG5cdCdvbmFkZCc6IGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgcHJvcHMgPSB7XG5cdFx0XHQnbmFtZSc6IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktbmFtZScpLFxuXHRcdFx0J2luaXRpYWxfZm9sZGVyJzogdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1pbml0aWFsLWZvbGRlcicpXG5cdFx0fTtcblxuXHRcdGlmIChwcm9wcy5uYW1lID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRzZWFyY2ggPSAkKCcuY21zLXNlYXJjaC1mb3JtJyk7XG5cblx0XHRpZiAoJHNlYXJjaC5maW5kKCdbdHlwZT1oaWRkZW5dW25hbWU9XCJxW0ZvbGRlcl1cIl0nKS5sZW5ndGggPT0gMCkge1xuXHRcdFx0JHNlYXJjaC5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInFbRm9sZGVyXVwiIC8+Jyk7XG5cdFx0fVxuXG5cdFx0cHJvcHMuYmFja2VuZCA9IEZpbGVCYWNrZW5kLmNyZWF0ZShcblx0XHRcdHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktc2VhcmNoLXVybCcpLFxuXHRcdFx0dGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS11cGRhdGUtdXJsJyksXG5cdFx0XHR0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRlbGV0ZS11cmwnKSxcblx0XHRcdHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktbGltaXQnKSxcblx0XHRcdCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJylcblx0XHQpO1xuXG5cdFx0cHJvcHMuYmFja2VuZC5lbWl0KFxuXHRcdFx0J2ZpbHRlcicsXG5cdFx0XHRnZXRWYXIoJ3FbTmFtZV0nKSxcblx0XHRcdGdldFZhcigncVtBcHBDYXRlZ29yeV0nKSxcblx0XHRcdGdldFZhcigncVtGb2xkZXJdJyksXG5cdFx0XHRnZXRWYXIoJ3FbQ3JlYXRlZEZyb21dJyksXG5cdFx0XHRnZXRWYXIoJ3FbQ3JlYXRlZFRvXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0N1cnJlbnRGb2xkZXJPbmx5XScpXG5cdFx0KTtcblxuXHRcdHByb3BzLmN1cnJlbnRfZm9sZGVyID0gZ2V0VmFyKCdxW0ZvbGRlcl0nKSB8fCBwcm9wcy5pbml0aWFsX2ZvbGRlcjtcblxuXHRcdFJlYWN0LnJlbmRlcihcblx0XHRcdDxHYWxsZXJ5Q29tcG9uZW50IHsuLi5wcm9wc30gLz4sXG5cdFx0XHR0aGlzWzBdXG5cdFx0KTtcblx0fVxufSk7XG4iXX0=

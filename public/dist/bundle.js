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
	}

	_createClass(FileBackend, [{
		key: 'search',
		value: function search() {
			var _this = this;

			this.page = 1;

			this.request('GET', this.search_url).then(function (json) {
				_this.emit('onSearchData', json);
			});
		}
	}, {
		key: 'more',
		value: function more() {
			var _this2 = this;

			this.page++;

			this.request('GET', this.search_url).then(function (json) {
				_this2.emit('onMoreData', json);
			});
		}
	}, {
		key: 'navigate',
		value: function navigate(folder) {
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
		key: 'delete',
		value: function _delete(ids) {
			var _this4 = this;

			var filesToDelete = [];

			// Allows users to pass one or more ids to delete.
			if (Object.prototype.toString.call(ids) !== '[object Array]') {
				filesToDelete.push(ids);
			} else {
				filesToDelete = ids;
			}

			this.request('GET', this.delete_url, {
				'ids': filesToDelete
			}).then(function () {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = filesToDelete[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var id = _step.value;

						_this4.emit('onDeleteData', id);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator['return']) {
							_iterator['return']();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			});
		}
	}, {
		key: 'filter',
		value: function filter(name, type, folder, createdFrom, createdTo, onlySearchInFolder) {
			this.name = name;
			this.type = type;
			this.folder = folder;
			this.createdFrom = createdFrom;
			this.createdTo = createdTo;
			this.onlySearchInFolder = onlySearchInFolder;

			this.search();
		}
	}, {
		key: 'save',
		value: function save(id, values) {
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _default = (function (_React$Component) {
	_inherits(_default, _React$Component);

	function _default() {
		_classCallCheck(this, _default);

		_get(Object.getPrototypeOf(_default.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(_default, [{
		key: 'bind',
		value: function bind() {
			var _this = this;

			for (var _len = arguments.length, methods = Array(_len), _key = 0; _key < _len; _key++) {
				methods[_key] = arguments[_key];
			}

			methods.forEach(function (method) {
				return _this[method] = _this[method].bind(_this);
			});
		}
	}]);

	return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];

},{"react":"react"}],4:[function(require,module,exports){
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

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var BulkActionsComponent = (function (_BaseComponent) {
	_inherits(BulkActionsComponent, _BaseComponent);

	function BulkActionsComponent(props) {
		_classCallCheck(this, BulkActionsComponent);

		_get(Object.getPrototypeOf(BulkActionsComponent.prototype), 'constructor', this).call(this, props);

		this.bind('onChangeValue');
	}

	_createClass(BulkActionsComponent, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var $select = (0, _jquery2['default'])(_react2['default'].findDOMNode(this)).find('.dropdown'),
			    leftVal = leftVal = (0, _jquery2['default'])('.cms-content-toolbar:visible').width() + 12,
			    backButton = (0, _jquery2['default'])('.gallery .font-icon-level-up');

			if (backButton.length > 0) {
				leftVal += backButton.width() + 24;
			}

			(0, _jquery2['default'])(_react2['default'].findDOMNode(this)).css({
				left: leftVal
			});

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
			var _this = this;

			return _react2['default'].createElement(
				'div',
				{ className: 'gallery__bulk fieldholder-small' },
				_react2['default'].createElement(
					'select',
					{ className: 'dropdown no-change-track no-chzn', tabIndex: '0', 'data-placeholder': this.props.placeholder, style: { width: '160px' } },
					_react2['default'].createElement('option', { selected: true, disabled: true, hidden: true, value: '' }),
					this.props.options.map(function (option, i) {
						return _react2['default'].createElement(
							'option',
							{ key: i, onClick: _this.onChangeValue, value: option.value },
							option.label
						);
					})
				)
			);
		}
	}, {
		key: 'getOptionByValue',
		value: function getOptionByValue(value) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.props.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var option = _step.value;

					if (option.value === value) {
						return option;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return null;
		}
	}, {
		key: 'applyAction',
		value: function applyAction(value) {
			// We only have 'delete' right now...
			switch (value) {
				case 'delete':
					this.props.backend['delete'](this.props.getSelectedFiles());
				default:
					return false;
			}
		}
	}, {
		key: 'onChangeValue',
		value: function onChangeValue(event) {
			var option = this.getOptionByValue(event.target.value);

			// Make sure a valid option has been selected.
			if (option === null) {
				return;
			}

			if (option.destructive === true) {
				if (confirm(ss.i18n.sprintf(ss.i18n._t('AssetGalleryField.BULK_ACTIONS_CONFIRM'), option.label))) {
					this.applyAction(option.value);
				}
			} else {
				this.applyAction(option.value);
			}

			// Reset the dropdown to it's placeholder value.
			(0, _jquery2['default'])(_react2['default'].findDOMNode(this)).find('.dropdown').val('').trigger('liszt:updated');
		}
	}]);

	return BulkActionsComponent;
})(_baseComponent2['default']);

exports['default'] = BulkActionsComponent;
;
module.exports = exports['default'];

},{"./base-component":3,"jquery":"jquery","react":"react"}],5:[function(require,module,exports){
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

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var EditorComponent = (function (_BaseComponent) {
	_inherits(EditorComponent, _BaseComponent);

	function EditorComponent(props) {
		var _this = this;

		_classCallCheck(this, EditorComponent);

		_get(Object.getPrototypeOf(EditorComponent.prototype), 'constructor', this).call(this, props);

		this.state = {
			'title': this.props.file.title,
			'basename': this.props.file.basename
		};

		this.fields = [{
			'label': 'Title',
			'name': 'title',
			'value': this.props.file.title,
			'onChange': function onChange(event) {
				return _this.onFieldChange('title', event);
			}
		}, {
			'label': 'Filename',
			'name': 'basename',
			'value': this.props.file.basename,
			'onChange': function onChange(event) {
				return _this.onFieldChange('basename', event);
			}
		}];

		this.bind('onFieldChange', 'onFileSave', 'onCancel');
	}

	_createClass(EditorComponent, [{
		key: 'onFieldChange',
		value: function onFieldChange(name, event) {
			this.setState(_defineProperty({}, name, event.target.value));
		}
	}, {
		key: 'onFileSave',
		value: function onFileSave(event) {
			this.props.onFileSave(this.props.file.id, this.state, event);
		}
	}, {
		key: 'onCancel',
		value: function onCancel(event) {
			this.props.onCancel(event);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

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
									ss.i18n._t('AssetGalleryField.TYPE'),
									':'
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
								ss.i18n._t('AssetGalleryField.SIZE'),
								':'
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
								ss.i18n._t('AssetGalleryField.URL'),
								':'
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
								ss.i18n._t('AssetGalleryField.CREATED'),
								':'
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
								ss.i18n._t('AssetGalleryField.LASTEDIT'),
								':'
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
								ss.i18n._t('AssetGalleryField.DIM'),
								':'
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
				this.fields.map(function (field, i) {
					return _react2['default'].createElement(
						'div',
						{ className: 'field text', key: i },
						_react2['default'].createElement(
							'label',
							{ className: 'left' },
							field.label
						),
						_react2['default'].createElement(
							'div',
							{ className: 'middleColumn' },
							_react2['default'].createElement('input', { className: 'text', type: 'text', onChange: field.onChange, value: _this2.state[field.name] })
						)
					);
				}),
				_react2['default'].createElement(
					'div',
					null,
					_react2['default'].createElement(
						'button',
						{
							type: 'submit',
							className: 'ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-check-mark',
							onClick: this.onFileSave },
						ss.i18n._t('AssetGalleryField.SAVE')
					),
					_react2['default'].createElement(
						'button',
						{
							type: 'button',
							className: 'ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-cancel-circled',
							onClick: this.onCancel },
						ss.i18n._t('AssetGalleryField.CANCEL')
					)
				)
			);
		}
	}]);

	return EditorComponent;
})(_baseComponent2['default']);

EditorComponent.propTypes = {
	'file': _react2['default'].PropTypes.shape({
		'id': _react2['default'].PropTypes.number,
		'title': _react2['default'].PropTypes.string,
		'basename': _react2['default'].PropTypes.string,
		'url': _react2['default'].PropTypes.string,
		'size': _react2['default'].PropTypes.string,
		'created': _react2['default'].PropTypes.string,
		'lastUpdated': _react2['default'].PropTypes.string,
		'dimensions': _react2['default'].PropTypes.shape({
			'width': _react2['default'].PropTypes.number,
			'height': _react2['default'].PropTypes.number
		})
	}),
	'onFileSave': _react2['default'].PropTypes.func,
	'onCancel': _react2['default'].PropTypes.func
};

exports['default'] = EditorComponent;
module.exports = exports['default'];

},{"./base-component":3,"jquery":"jquery","react":"react"}],6:[function(require,module,exports){
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

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var FileComponent = (function (_BaseComponent) {
	_inherits(FileComponent, _BaseComponent);

	function FileComponent(props) {
		_classCallCheck(this, FileComponent);

		_get(Object.getPrototypeOf(FileComponent.prototype), 'constructor', this).call(this, props);

		this.state = {
			'focussed': false
		};

		this.bind('onFileNavigate', 'onFileEdit', 'onFileDelete', 'onFileSelect', 'handleDoubleClick', 'handleKeyDown', 'handleFocus', 'handleBlur', 'onFileSelect');
	}

	_createClass(FileComponent, [{
		key: 'handleDoubleClick',
		value: function handleDoubleClick(event) {
			if (event.target !== this.refs.title.getDOMNode() && event.target !== this.refs.thumbnail.getDOMNode()) {
				return;
			}

			this.onFileNavigate(event);
		}
	}, {
		key: 'onFileNavigate',
		value: function onFileNavigate(event) {
			if (this.isFolder()) {
				this.props.onFileNavigate(this.props, event);
				return;
			}

			this.onFileEdit(event);
		}
	}, {
		key: 'onFileSelect',
		value: function onFileSelect(event) {
			event.stopPropagation(); //stop triggering click on root element
			this.props.onFileSelect(this.props, event);
		}
	}, {
		key: 'onFileEdit',
		value: function onFileEdit(event) {
			event.stopPropagation(); //stop triggering click on root element
			this.props.onFileEdit(this.props, event);
		}
	}, {
		key: 'onFileDelete',
		value: function onFileDelete(event) {
			event.stopPropagation(); //stop triggering click on root element
			this.props.onFileDelete(this.props, event);
		}
	}, {
		key: 'isFolder',
		value: function isFolder() {
			return this.props.category === 'folder';
		}
	}, {
		key: 'getThumbnailStyles',
		value: function getThumbnailStyles() {
			if (this.props.category === 'image') {
				return { 'backgroundImage': 'url(' + this.props.url + ')' };
			}

			return {};
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
		key: 'getItemClassNames',
		value: function getItemClassNames() {
			var itemClassNames = 'item ' + this.props.category;

			if (this.state.focussed) {
				itemClassNames += ' focussed';
			}

			if (this.props.selected) {
				itemClassNames += ' selected';
			}

			return itemClassNames;
		}
	}, {
		key: 'isImageLargerThanThumbnail',
		value: function isImageLargerThanThumbnail() {
			var dimensions = this.props.attributes.dimensions;

			return dimensions.height > _constants2['default'].THUMBNAIL_HEIGHT || dimensions.width > _constants2['default'].THUMBNAIL_WIDTH;
		}
	}, {
		key: 'handleKeyDown',
		value: function handleKeyDown(event) {
			event.stopPropagation();

			//if event doesn't come from the root element, do nothing
			if (event.target !== _react2['default'].findDOMNode(this)) {
				return;
			}

			//If space or enter is pressed
			if (this.props.selectKeys.indexOf(event.keyCode) > -1) {
				event.preventDefault(); //Stop page from scrolling when space is clicked
				this.onFileNavigate();
			}
		}
	}, {
		key: 'handleFocus',
		value: function handleFocus() {
			this.setState({
				'focussed': true
			});
		}
	}, {
		key: 'handleBlur',
		value: function handleBlur() {
			this.setState({
				'focussed': false
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2['default'].createElement(
				'div',
				{ className: this.getItemClassNames(), 'data-id': this.props.id, tabIndex: '0', onKeyDown: this.handleKeyDown, onDoubleClick: this.handleDoubleClick },
				_react2['default'].createElement(
					'div',
					{ ref: 'thumbnail', className: this.getThumbnailClassNames(), style: this.getThumbnailStyles(), onClick: this.onFileSelect },
					_react2['default'].createElement(
						'div',
						{ className: 'item__actions' },
						_react2['default'].createElement('button', {
							className: 'item__actions__action item__actions__action--select [ font-icon-tick ]',
							type: 'button',
							onClick: this.onFileSelect,
							onFocus: this.handleFocus,
							onBlur: this.handleBlur }),
						_react2['default'].createElement('button', {
							className: 'item__actions__action item__actions__action--remove [ font-icon-trash ]',
							type: 'button',
							onClick: this.onFileDelete,
							onFocus: this.handleFocus,
							onBlur: this.handleBlur }),
						_react2['default'].createElement('button', {
							className: 'item__actions__action item__actions__action--edit [ font-icon-edit ]',
							type: 'button',
							onClick: this.onFileEdit,
							onFocus: this.handleFocus,
							onBlur: this.handleBlur })
					)
				),
				_react2['default'].createElement(
					'p',
					{ className: 'item__title', ref: 'title' },
					this.props.title
				)
			);
		}
	}]);

	return FileComponent;
})(_baseComponent2['default']);

FileComponent.propTypes = {
	'id': _react2['default'].PropTypes.number,
	'title': _react2['default'].PropTypes.string,
	'category': _react2['default'].PropTypes.string,
	'url': _react2['default'].PropTypes.string,
	'dimensions': _react2['default'].PropTypes.shape({
		'width': _react2['default'].PropTypes.number,
		'height': _react2['default'].PropTypes.number
	}),
	'onFileNavigate': _react2['default'].PropTypes.func,
	'onFileEdit': _react2['default'].PropTypes.func,
	'onFileDelete': _react2['default'].PropTypes.func,
	'selectKeys': _react2['default'].PropTypes.array,
	'onFileSelect': _react2['default'].PropTypes.func,
	'selected': _react2['default'].PropTypes.bool
};

exports['default'] = FileComponent;
module.exports = exports['default'];

},{"../constants":8,"./base-component":3,"jquery":"jquery","react":"react"}],7:[function(require,module,exports){
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

var _bulkActionsComponent = require('./bulk-actions-component');

var _bulkActionsComponent2 = _interopRequireDefault(_bulkActionsComponent);

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function getComparator(field, direction) {
	return function (a, b) {
		if (direction === 'asc') {
			if (a[field] < b[field]) {
				return -1;
			}

			if (a[field] > b[field]) {
				return 1;
			}
		} else {
			if (a[field] > b[field]) {
				return -1;
			}

			if (a[field] < b[field]) {
				return 1;
			}
		}

		return 0;
	};
}

function getSort(field, direction) {
	var _this = this;

	var comparator = getComparator(field, direction);

	return function () {
		var folders = _this.state.files.filter(function (file) {
			return file.type === 'folder';
		});
		var files = _this.state.files.filter(function (file) {
			return file.type !== 'folder';
		});

		_this.setState({
			'files': folders.sort(comparator).concat(files.sort(comparator))
		});
	};
}

var _default = (function (_BaseComponent) {
	_inherits(_default, _BaseComponent);

	function _default(props) {
		var _this2 = this;

		_classCallCheck(this, _default);

		_get(Object.getPrototypeOf(_default.prototype), 'constructor', this).call(this, props);

		this.state = {
			'count': 0, // The number of files in the current view
			'files': [],
			'selectedFiles': [],
			'editing': null
		};

		this.folders = [props.initial_folder];

		this.sort = 'name';
		this.direction = 'asc';

		this.sorters = [{
			'field': 'title',
			'direction': 'asc',
			'label': ss.i18n._t('AssetGalleryField.FILTER_TITLE_ASC'),
			'onSort': getSort.call(this, 'title', 'asc')
		}, {
			'field': 'title',
			'direction': 'desc',
			'label': ss.i18n._t('AssetGalleryField.FILTER_TITLE_DESC'),
			'onSort': getSort.call(this, 'title', 'desc')
		}, {
			'field': 'created',
			'direction': 'desc',
			'label': ss.i18n._t('AssetGalleryField.FILTER_DATE_DESC'),
			'onSort': getSort.call(this, 'created', 'desc')
		}, {
			'field': 'created',
			'direction': 'asc',
			'label': ss.i18n._t('AssetGalleryField.FILTER_DATE_ASC'),
			'onSort': getSort.call(this, 'created', 'asc')
		}];

		this.listeners = {
			'onSearchData': function onSearchData(data) {
				_this2.setState({
					'count': data.count,
					'files': data.files
				});
			},
			'onMoreData': function onMoreData(data) {
				_this2.setState({
					'count': data.count,
					'files': _this2.state.files.concat(data.files)
				});
			},
			'onNavigateData': function onNavigateData(data) {
				_this2.setState({
					'count': data.count,
					'files': data.files
				});
			},
			'onDeleteData': function onDeleteData(data) {
				_this2.setState({
					'count': _this2.state.count - 1,
					'files': _this2.state.files.filter(function (file) {
						return data !== file.id;
					})
				});
			},
			'onSaveData': function onSaveData(id, values) {
				var files = _this2.state.files;

				files.forEach(function (file) {
					if (file.id == id) {
						file.title = values.title;
						file.basename = values.basename;
					}
				});

				_this2.setState({
					'files': files,
					'editing': false
				});
			}
		};

		this.bind('onFileSave', 'onFileNavigate', 'onFileSelect', 'onFileEdit', 'onFileDelete', 'onBackClick', 'onMoreClick', 'onNavigate', 'onCancel', 'getSelectedFiles');
	}

	_createClass(_default, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			for (var _event in this.listeners) {
				this.props.backend.on(_event, this.listeners[_event]);
			}

			if (this.props.initial_folder !== this.props.current_folder) {
				this.onNavigate(this.props.current_folder);
			} else {
				this.props.backend.search();
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			for (var _event2 in this.listeners) {
				this.props.backend.removeListener(_event2, this.listeners[_event2]);
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var $select = (0, _jquery2['default'])(_react2['default'].findDOMNode(this)).find('.gallery__sort .dropdown'),
			    leftVal = (0, _jquery2['default'])('.cms-content-toolbar:visible').width() + 12;

			if (this.folders.length > 1) {
				var backButton = this.refs.backButton.getDOMNode();

				(0, _jquery2['default'])(backButton).css({
					left: leftVal
				});
			}

			// We opt-out of letting the CMS handle Chosen because it doesn't re-apply the behaviour correctly.
			// So after the gallery has been rendered we apply Chosen.
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
		key: 'getBackButton',
		value: function getBackButton() {
			if (this.folders.length > 1) {
				return _react2['default'].createElement(
					'button',
					{
						className: 'ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-level-up',
						onClick: this.onBackClick,
						ref: 'backButton' },
					ss.i18n._t('AssetGalleryField.BACK')
				);
			}

			return null;
		}
	}, {
		key: 'getBulkActionsComponent',
		value: function getBulkActionsComponent() {
			if (this.state.selectedFiles.length > 0) {
				return _react2['default'].createElement(_bulkActionsComponent2['default'], {
					options: _constants2['default'].BULK_ACTIONS,
					placeholder: ss.i18n._t('AssetGalleryField.BULK_ACTIONS_PLACEHOLDER'),
					backend: this.props.backend,
					getSelectedFiles: this.getSelectedFiles });
			}

			return null;
		}
	}, {
		key: 'getMoreButton',
		value: function getMoreButton() {
			if (this.state.count > this.state.files.length) {
				return _react2['default'].createElement(
					'button',
					{
						className: 'gallery__load__more',
						onClick: this.onMoreClick },
					ss.i18n._t('AssetGalleryField.LOADMORE')
				);
			}

			return null;
		}
	}, {
		key: 'getSelectedFiles',
		value: function getSelectedFiles() {
			return this.state.selectedFiles;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			if (this.state.editing) {
				return _react2['default'].createElement(
					'div',
					{ className: 'gallery' },
					_react2['default'].createElement(_editorComponent2['default'], {
						file: this.state.editing,
						onFileSave: this.onFileSave,
						onCancel: this.onCancel })
				);
			}

			return _react2['default'].createElement(
				'div',
				{ className: 'gallery' },
				this.getBackButton(),
				this.getBulkActionsComponent(),
				_react2['default'].createElement(
					'div',
					{ className: 'gallery__sort fieldholder-small' },
					_react2['default'].createElement(
						'select',
						{ className: 'dropdown no-change-track no-chzn', tabIndex: '0', style: { width: '160px' } },
						this.sorters.map(function (sorter, i) {
							return _react2['default'].createElement(
								'option',
								{ key: i, onClick: sorter.onSort },
								sorter.label
							);
						})
					)
				),
				_react2['default'].createElement(
					'div',
					{ className: 'gallery__items' },
					this.state.files.map(function (file, i) {
						return _react2['default'].createElement(_fileComponent2['default'], _extends({ key: i }, file, {
							selectKeys: _constants2['default'].FILE_SELECT_KEYS,
							onFileSelect: _this3.onFileSelect,
							selectKeys: _constants2['default'].FILE_SELECT_KEYS,
							onFileDelete: _this3.onFileDelete,
							onFileEdit: _this3.onFileEdit,
							onFileNavigate: _this3.onFileNavigate,
							selected: _this3.state.selectedFiles.indexOf(file.id) > -1 }));
					})
				),
				_react2['default'].createElement(
					'div',
					{ className: 'gallery__load' },
					this.getMoreButton()
				)
			);
		}
	}, {
		key: 'onCancel',
		value: function onCancel() {
			this.setState({
				'editing': null
			});
		}
	}, {
		key: 'onFileSelect',
		value: function onFileSelect(file, event) {
			event.stopPropagation();

			var currentlySelected = this.state.selectedFiles,
			    fileIndex = currentlySelected.indexOf(file.id);

			if (fileIndex > -1) {
				currentlySelected.splice(fileIndex, 1);
			} else {
				currentlySelected.push(file.id);
			}

			this.setState({
				'selectedFiles': currentlySelected
			});
		}
	}, {
		key: 'onFileDelete',
		value: function onFileDelete(file, event) {
			if (confirm(ss.i18n._t('AssetGalleryField.CONFIRMDELETE'))) {
				this.props.backend['delete'](file.id);
			}

			event.stopPropagation();
		}
	}, {
		key: 'onFileEdit',
		value: function onFileEdit(file, event) {
			this.setState({
				'editing': file
			});

			event.stopPropagation();
		}
	}, {
		key: 'onFileNavigate',
		value: function onFileNavigate(file) {
			this.folders.push(file.filename);
			this.props.backend.navigate(file.filename);

			this.setState({
				'selectedFiles': []
			});
		}
	}, {
		key: 'onNavigate',
		value: function onNavigate(folder) {
			this.folders.push(folder);
			this.props.backend.navigate(folder);
		}
	}, {
		key: 'onMoreClick',
		value: function onMoreClick(event) {
			event.stopPropagation();

			this.props.backend.more();

			event.preventDefault();
		}
	}, {
		key: 'onBackClick',
		value: function onBackClick(event) {
			if (this.folders.length > 1) {
				this.folders.pop();
				this.props.backend.navigate(this.folders[this.folders.length - 1]);
			}

			this.setState({
				'selectedFiles': []
			});

			event.preventDefault();
		}
	}, {
		key: 'onFileSave',
		value: function onFileSave(id, state, event) {
			this.props.backend.save(id, state);

			event.stopPropagation();
			event.preventDefault();
		}
	}]);

	return _default;
})(_baseComponent2['default']);

exports['default'] = _default;
module.exports = exports['default'];

},{"../constants":8,"./base-component":3,"./bulk-actions-component":4,"./editor-component":5,"./file-component":6,"jquery":"jquery","react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	'THUMBNAIL_HEIGHT': 150,
	'THUMBNAIL_WIDTH': 200,
	'FILE_SELECT_KEYS': [32, 13],
	'BULK_ACTIONS': [{
		value: 'delete',
		label: ss.i18n._t('AssetGalleryField.BULK_ACTIONS_DELETE'),
		destructive: true
	}]
};
module.exports = exports['default'];

},{}],9:[function(require,module,exports){
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

},{"./backend/file-backend":2,"./component/gallery-component":7,"jquery":"jquery","react":"react"}]},{},[9])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2JhY2tlbmQvZmlsZS1iYWNrZW5kLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2Jhc2UtY29tcG9uZW50LmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2J1bGstYWN0aW9ucy1jb21wb25lbnQuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZWRpdG9yLWNvbXBvbmVudC5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9maWxlLWNvbXBvbmVudC5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9nYWxsZXJ5LWNvbXBvbmVudC5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbnN0YW50cy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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VyxDQUFDLEVBQ25CLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUN4QixNQUFNLENBQUMsY0FBYyxDQUFDLEVBQ3RCLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUM5QixDQUFDOztBQUVGLE9BQUssQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUM7O0FBRW5FLHFCQUFNLE1BQU0sQ0FDWCx5RUFBc0IsS0FBSyxDQUFJLEVBQy9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FDUCxDQUFDO0VBQ0Y7Q0FDRCxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBFdmVudHMgZnJvbSAnZXZlbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZUJhY2tlbmQgZXh0ZW5kcyBFdmVudHMge1xuXHRzdGF0aWMgY3JlYXRlKC4uLnBhcmFtZXRlcnMpIHtcblx0XHRyZXR1cm4gbmV3IEZpbGVCYWNrZW5kKC4uLnBhcmFtZXRlcnMpO1xuXHR9XG5cblx0Y29uc3RydWN0b3Ioc2VhcmNoX3VybCwgdXBkYXRlX3VybCwgZGVsZXRlX3VybCwgbGltaXQsICRmb2xkZXIpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5zZWFyY2hfdXJsID0gc2VhcmNoX3VybDtcblx0XHR0aGlzLnVwZGF0ZV91cmwgPSB1cGRhdGVfdXJsO1xuXHRcdHRoaXMuZGVsZXRlX3VybCA9IGRlbGV0ZV91cmw7XG5cdFx0dGhpcy5saW1pdCA9IGxpbWl0O1xuXHRcdHRoaXMuJGZvbGRlciA9ICRmb2xkZXI7XG5cblx0XHR0aGlzLnBhZ2UgPSAxO1xuXHR9XG5cblx0c2VhcmNoKCkge1xuXHRcdHRoaXMucGFnZSA9IDE7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvblNlYXJjaERhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG1vcmUoKSB7XG5cdFx0dGhpcy5wYWdlKys7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvbk1vcmVEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRuYXZpZ2F0ZShmb2xkZXIpIHtcblx0XHR0aGlzLnBhZ2UgPSAxO1xuXHRcdHRoaXMuZm9sZGVyID0gZm9sZGVyO1xuXG5cdFx0dGhpcy5wZXJzaXN0Rm9sZGVyRmlsdGVyKGZvbGRlcik7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvbk5hdmlnYXRlRGF0YScsIGpzb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0cGVyc2lzdEZvbGRlckZpbHRlcihmb2xkZXIpIHtcblx0XHRpZiAoZm9sZGVyLnN1YnN0cigtMSkgPT09ICcvJykge1xuXHRcdFx0Zm9sZGVyID0gZm9sZGVyLnN1YnN0cigwLCBmb2xkZXIubGVuZ3RoIC0gMSk7XG5cdFx0fVxuXG5cdFx0dGhpcy4kZm9sZGVyLnZhbChmb2xkZXIpO1xuXHR9XG5cblx0ZGVsZXRlKGlkcykge1xuXHRcdHZhciBmaWxlc1RvRGVsZXRlID0gW107XG5cblx0XHQvLyBBbGxvd3MgdXNlcnMgdG8gcGFzcyBvbmUgb3IgbW9yZSBpZHMgdG8gZGVsZXRlLlxuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaWRzKSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuXHRcdFx0ZmlsZXNUb0RlbGV0ZS5wdXNoKGlkcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZpbGVzVG9EZWxldGUgPSBpZHM7XG5cdFx0fVxuXG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLmRlbGV0ZV91cmwsIHtcblx0XHRcdCdpZHMnOiBmaWxlc1RvRGVsZXRlXG5cdFx0fSkudGhlbigoKSA9PiB7XG5cdFx0XHRmb3IgKGxldCBpZCBvZiBmaWxlc1RvRGVsZXRlKSB7XG5cdFx0XHRcdHRoaXMuZW1pdCgnb25EZWxldGVEYXRhJywgaWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZmlsdGVyKG5hbWUsIHR5cGUsIGZvbGRlciwgY3JlYXRlZEZyb20sIGNyZWF0ZWRUbywgb25seVNlYXJjaEluRm9sZGVyKSB7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMuZm9sZGVyID0gZm9sZGVyO1xuXHRcdHRoaXMuY3JlYXRlZEZyb20gPSBjcmVhdGVkRnJvbTtcblx0XHR0aGlzLmNyZWF0ZWRUbyA9IGNyZWF0ZWRUbztcblx0XHR0aGlzLm9ubHlTZWFyY2hJbkZvbGRlciA9IG9ubHlTZWFyY2hJbkZvbGRlcjtcblxuXHRcdHRoaXMuc2VhcmNoKCk7XG5cdH1cblxuXHRzYXZlKGlkLCB2YWx1ZXMpIHtcblx0XHR2YWx1ZXNbJ2lkJ10gPSBpZDtcblxuXHRcdHRoaXMucmVxdWVzdCgnUE9TVCcsIHRoaXMudXBkYXRlX3VybCwgdmFsdWVzKS50aGVuKCgpID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25TYXZlRGF0YScsIGlkLCB2YWx1ZXMpO1xuXHRcdH0pO1xuXHR9XG5cblx0cmVxdWVzdChtZXRob2QsIHVybCwgZGF0YSA9IHt9KSB7XG5cdFx0bGV0IGRlZmF1bHRzID0ge1xuXHRcdFx0J2xpbWl0JzogdGhpcy5saW1pdCxcblx0XHRcdCdwYWdlJzogdGhpcy5wYWdlLFxuXHRcdH07XG5cblx0XHRpZiAodGhpcy5uYW1lICYmIHRoaXMubmFtZS50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5uYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMubmFtZSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuZm9sZGVyICYmIHRoaXMuZm9sZGVyLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmZvbGRlciA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLmZvbGRlcik7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY3JlYXRlZEZyb20gJiYgdGhpcy5jcmVhdGVkRnJvbS50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5jcmVhdGVkRnJvbSA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLmNyZWF0ZWRGcm9tKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5jcmVhdGVkVG8gJiYgdGhpcy5jcmVhdGVkVG8udHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuY3JlYXRlZFRvID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMuY3JlYXRlZFRvKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIgJiYgdGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMub25seVNlYXJjaEluRm9sZGVyID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMub25seVNlYXJjaEluRm9sZGVyKTtcblx0XHR9XG5cblx0XHR0aGlzLnNob3dMb2FkaW5nSW5kaWNhdG9yKCk7XG5cblx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdCd1cmwnOiB1cmwsXG5cdFx0XHQnbWV0aG9kJzogbWV0aG9kLFxuXHRcdFx0J2RhdGFUeXBlJzogJ2pzb24nLFxuXHRcdFx0J2RhdGEnOiAkLmV4dGVuZChkZWZhdWx0cywgZGF0YSlcblx0XHR9KS5hbHdheXMoKCkgPT4ge1xuXHRcdFx0dGhpcy5oaWRlTG9hZGluZ0luZGljYXRvcigpO1xuXHRcdH0pO1xuXHR9XG5cblx0c2hvd0xvYWRpbmdJbmRpY2F0b3IoKSB7XG5cdFx0JCgnLmNtcy1jb250ZW50LCAudWktZGlhbG9nJykuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblx0XHQkKCcudWktZGlhbG9nLWNvbnRlbnQnKS5jc3MoJ29wYWNpdHknLCAnLjEnKTtcblx0fVxuXG5cdGhpZGVMb2FkaW5nSW5kaWNhdG9yKCkge1xuXHRcdCQoJy5jbXMtY29udGVudCwgLnVpLWRpYWxvZycpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cdFx0JCgnLnVpLWRpYWxvZy1jb250ZW50JykuY3NzKCdvcGFjaXR5JywgJzEnKTtcblx0fVxufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXHRiaW5kKC4uLm1ldGhvZHMpIHtcblx0XHRtZXRob2RzLmZvckVhY2goKG1ldGhvZCkgPT4gdGhpc1ttZXRob2RdID0gdGhpc1ttZXRob2RdLmJpbmQodGhpcykpO1xuXHR9XG59XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vYmFzZS1jb21wb25lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWxrQWN0aW9uc0NvbXBvbmVudCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5iaW5kKFxuXHRcdFx0J29uQ2hhbmdlVmFsdWUnXG5cdFx0KTtcblx0fVxuXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHZhciAkc2VsZWN0ID0gJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmRyb3Bkb3duJyksXG5cdFx0XHRsZWZ0VmFsID0gbGVmdFZhbCA9ICQoJy5jbXMtY29udGVudC10b29sYmFyOnZpc2libGUnKS53aWR0aCgpICsgMTIsXG5cdFx0XHRiYWNrQnV0dG9uID0gJCgnLmdhbGxlcnkgLmZvbnQtaWNvbi1sZXZlbC11cCcpO1xuXG5cdFx0aWYgKGJhY2tCdXR0b24ubGVuZ3RoID4gMCkge1xuXHRcdFx0bGVmdFZhbCArPSBiYWNrQnV0dG9uLndpZHRoKCkgKyAyNDtcblx0XHR9XG5cblx0XHQkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5jc3Moe1xuXHRcdFx0bGVmdDogbGVmdFZhbFxuXHRcdH0pO1xuXG5cdFx0JHNlbGVjdC5jaG9zZW4oe1xuXHRcdFx0J2FsbG93X3NpbmdsZV9kZXNlbGVjdCc6IHRydWUsXG5cdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMjBcblx0XHR9KTtcblxuXHRcdC8vIENob3NlbiBzdG9wcyB0aGUgY2hhbmdlIGV2ZW50IGZyb20gcmVhY2hpbmcgUmVhY3Qgc28gd2UgaGF2ZSB0byBzaW11bGF0ZSBhIGNsaWNrLlxuXHRcdCRzZWxlY3QuY2hhbmdlKCgpID0+IFJlYWN0LmFkZG9ucy5UZXN0VXRpbHMuU2ltdWxhdGUuY2xpY2soJHNlbGVjdC5maW5kKCc6c2VsZWN0ZWQnKVswXSkpO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX2J1bGsgZmllbGRob2xkZXItc21hbGxcIj5cblx0XHRcdDxzZWxlY3QgY2xhc3NOYW1lPVwiZHJvcGRvd24gbm8tY2hhbmdlLXRyYWNrIG5vLWNoem5cIiB0YWJJbmRleD1cIjBcIiBkYXRhLXBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfSBzdHlsZT17e3dpZHRoOiAnMTYwcHgnfX0+XG5cdFx0XHRcdDxvcHRpb24gc2VsZWN0ZWQgZGlzYWJsZWQgaGlkZGVuIHZhbHVlPScnPjwvb3B0aW9uPlxuXHRcdFx0XHR7dGhpcy5wcm9wcy5vcHRpb25zLm1hcCgob3B0aW9uLCBpKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIDxvcHRpb24ga2V5PXtpfSBvbkNsaWNrPXt0aGlzLm9uQ2hhbmdlVmFsdWV9IHZhbHVlPXtvcHRpb24udmFsdWV9PntvcHRpb24ubGFiZWx9PC9vcHRpb24+O1xuXHRcdFx0XHR9KX1cblx0XHRcdDwvc2VsZWN0PlxuXHRcdDwvZGl2Pjtcblx0fVxuXG5cdGdldE9wdGlvbkJ5VmFsdWUodmFsdWUpIHtcblx0XHRmb3IgKGxldCBvcHRpb24gb2YgdGhpcy5wcm9wcy5vcHRpb25zKSB7XG5cdFx0XHRpZiAob3B0aW9uLnZhbHVlID09PSB2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gb3B0aW9uO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0YXBwbHlBY3Rpb24odmFsdWUpIHtcblx0XHQvLyBXZSBvbmx5IGhhdmUgJ2RlbGV0ZScgcmlnaHQgbm93Li4uXG5cdFx0c3dpdGNoICh2YWx1ZSkge1xuXHRcdFx0Y2FzZSAnZGVsZXRlJzpcblx0XHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLmRlbGV0ZSh0aGlzLnByb3BzLmdldFNlbGVjdGVkRmlsZXMoKSk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0b25DaGFuZ2VWYWx1ZShldmVudCkge1xuXHRcdHZhciBvcHRpb24gPSB0aGlzLmdldE9wdGlvbkJ5VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcblxuXHRcdC8vIE1ha2Ugc3VyZSBhIHZhbGlkIG9wdGlvbiBoYXMgYmVlbiBzZWxlY3RlZC5cblx0XHRpZiAob3B0aW9uID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbi5kZXN0cnVjdGl2ZSA9PT0gdHJ1ZSkge1xuXHRcdFx0aWYgKGNvbmZpcm0oc3MuaTE4bi5zcHJpbnRmKHNzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkJVTEtfQUNUSU9OU19DT05GSVJNJyksIG9wdGlvbi5sYWJlbCkpKSB7XG5cdFx0XHRcdHRoaXMuYXBwbHlBY3Rpb24ob3B0aW9uLnZhbHVlKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5hcHBseUFjdGlvbihvcHRpb24udmFsdWUpO1xuXHRcdH1cblxuXHRcdC8vIFJlc2V0IHRoZSBkcm9wZG93biB0byBpdCdzIHBsYWNlaG9sZGVyIHZhbHVlLlxuXHRcdCQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5kcm9wZG93bicpLnZhbCgnJykudHJpZ2dlcignbGlzenQ6dXBkYXRlZCcpO1xuXHR9XG59O1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL2Jhc2UtY29tcG9uZW50JztcblxuY2xhc3MgRWRpdG9yQ29tcG9uZW50IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdCd0aXRsZSc6IHRoaXMucHJvcHMuZmlsZS50aXRsZSxcblx0XHRcdCdiYXNlbmFtZSc6IHRoaXMucHJvcHMuZmlsZS5iYXNlbmFtZVxuXHRcdH07XG5cblx0XHR0aGlzLmZpZWxkcyA9IFtcblx0XHRcdHtcblx0XHRcdFx0J2xhYmVsJzogJ1RpdGxlJyxcblx0XHRcdFx0J25hbWUnOiAndGl0bGUnLFxuXHRcdFx0XHQndmFsdWUnOiB0aGlzLnByb3BzLmZpbGUudGl0bGUsXG5cdFx0XHRcdCdvbkNoYW5nZSc6IChldmVudCkgPT4gdGhpcy5vbkZpZWxkQ2hhbmdlKCd0aXRsZScsIGV2ZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J2xhYmVsJzogJ0ZpbGVuYW1lJyxcblx0XHRcdFx0J25hbWUnOiAnYmFzZW5hbWUnLFxuXHRcdFx0XHQndmFsdWUnOiB0aGlzLnByb3BzLmZpbGUuYmFzZW5hbWUsXG5cdFx0XHRcdCdvbkNoYW5nZSc6IChldmVudCkgPT4gdGhpcy5vbkZpZWxkQ2hhbmdlKCdiYXNlbmFtZScsIGV2ZW50KVxuXHRcdFx0fVxuXHRcdF07XG5cblx0XHR0aGlzLmJpbmQoJ29uRmllbGRDaGFuZ2UnLCAnb25GaWxlU2F2ZScsICdvbkNhbmNlbCcpO1xuXHR9XG5cblx0b25GaWVsZENoYW5nZShuYW1lLCBldmVudCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0W25hbWVdOiBldmVudC50YXJnZXQudmFsdWVcblx0XHR9KTtcblx0fVxuXG5cdG9uRmlsZVNhdmUoZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLm9uRmlsZVNhdmUodGhpcy5wcm9wcy5maWxlLmlkLCB0aGlzLnN0YXRlLCBldmVudCk7XG5cdH1cblxuXHRvbkNhbmNlbChldmVudCkge1xuXHRcdHRoaXMucHJvcHMub25DYW5jZWwoZXZlbnQpO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZWRpdG9yJz5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mbyBub2xhYmVsJz5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvLXByZXZpZXcgbm9sYWJlbCc+XG5cdFx0XHRcdFx0PGltZyBjbGFzc05hbWU9J3RodW1ibmFpbC1wcmV2aWV3JyBzcmM9e3RoaXMucHJvcHMuZmlsZS51cmx9IC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tZGF0YSBub2xhYmVsJz5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIG5vbGFiZWwnPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlRZUEUnKX06PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS50eXBlfTwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlNJWkUnKX06PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLnNpemV9PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntzcy5pMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5VUkwnKX06PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPXt0aGlzLnByb3BzLmZpbGUudXJsfSB0YXJnZXQ9J19ibGFuayc+e3RoaXMucHJvcHMuZmlsZS51cmx9PC9hPlxuXHRcdFx0XHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgZGF0ZV9kaXNhYmxlZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57c3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQ1JFQVRFRCcpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuY3JlYXRlZH08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgZGF0ZV9kaXNhYmxlZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57c3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuTEFTVEVESVQnKX06PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmxhc3RVcGRhdGVkfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57c3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRElNJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMud2lkdGh9IHgge3RoaXMucHJvcHMuZmlsZS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMuaGVpZ2h0fXB4PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHR7dGhpcy5maWVsZHMubWFwKChmaWVsZCwgaSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHRleHQnIGtleT17aX0+XG5cdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2ZpZWxkLmxhYmVsfTwvbGFiZWw+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgY2xhc3NOYW1lPVwidGV4dFwiIHR5cGU9J3RleHQnIG9uQ2hhbmdlPXtmaWVsZC5vbkNoYW5nZX0gdmFsdWU9e3RoaXMuc3RhdGVbZmllbGQubmFtZV19IC8+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0fSl9XG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0dHlwZT0nc3VibWl0J1xuXHRcdFx0XHRcdGNsYXNzTmFtZT1cInNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tY2hlY2stbWFya1wiXG5cdFx0XHRcdFx0b25DbGljaz17dGhpcy5vbkZpbGVTYXZlfT5cblx0XHRcdFx0XHR7c3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0FWRScpfVxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0XHRjbGFzc05hbWU9XCJzcy11aS1idXR0b24gdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkXCJcblx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uQ2FuY2VsfT5cblx0XHRcdFx0XHR7c3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQ0FOQ0VMJyl9XG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+O1xuXHR9XG59XG5cbkVkaXRvckNvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG5cdCdmaWxlJzogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcblx0XHQnaWQnOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRcdCd0aXRsZSc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0J2Jhc2VuYW1lJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHQndXJsJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHQnc2l6ZSc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0J2NyZWF0ZWQnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdCdsYXN0VXBkYXRlZCc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0J2RpbWVuc2lvbnMnOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHRcdFx0J3dpZHRoJzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0XHRcdCdoZWlnaHQnOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG5cdFx0fSlcblx0fSksXG5cdCdvbkZpbGVTYXZlJzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCdvbkNhbmNlbCc6UmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEVkaXRvckNvbXBvbmVudDtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9iYXNlLWNvbXBvbmVudCc7XG5cbmNsYXNzIEZpbGVDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0J2ZvY3Vzc2VkJzogZmFsc2Vcblx0XHR9O1xuXG5cdFx0dGhpcy5iaW5kKFxuXHRcdFx0J29uRmlsZU5hdmlnYXRlJyxcblx0XHRcdCdvbkZpbGVFZGl0Jyxcblx0XHRcdCdvbkZpbGVEZWxldGUnLFxuXHRcdFx0J29uRmlsZVNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlRG91YmxlQ2xpY2snLFxuXHRcdFx0J2hhbmRsZUtleURvd24nLFxuXHRcdFx0J2hhbmRsZUZvY3VzJyxcblx0XHRcdCdoYW5kbGVCbHVyJyxcblx0XHRcdCdvbkZpbGVTZWxlY3QnXG5cdFx0KTtcblx0fVxuXG5cdGhhbmRsZURvdWJsZUNsaWNrKGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LnRhcmdldCAhPT0gdGhpcy5yZWZzLnRpdGxlLmdldERPTU5vZGUoKSAmJiBldmVudC50YXJnZXQgIT09IHRoaXMucmVmcy50aHVtYm5haWwuZ2V0RE9NTm9kZSgpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5vbkZpbGVOYXZpZ2F0ZShldmVudCk7XG5cdH1cblxuXHRvbkZpbGVOYXZpZ2F0ZShldmVudCkge1xuXHRcdGlmICh0aGlzLmlzRm9sZGVyKCkpIHtcblx0XHRcdHRoaXMucHJvcHMub25GaWxlTmF2aWdhdGUodGhpcy5wcm9wcywgZXZlbnQpXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5vbkZpbGVFZGl0KGV2ZW50KTtcblx0fVxuXG5cdG9uRmlsZVNlbGVjdChldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyAvL3N0b3AgdHJpZ2dlcmluZyBjbGljayBvbiByb290IGVsZW1lbnRcblx0XHR0aGlzLnByb3BzLm9uRmlsZVNlbGVjdCh0aGlzLnByb3BzLCBldmVudCk7XG5cdH1cblxuXHRvbkZpbGVFZGl0KGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vc3RvcCB0cmlnZ2VyaW5nIGNsaWNrIG9uIHJvb3QgZWxlbWVudFxuXHRcdHRoaXMucHJvcHMub25GaWxlRWRpdCh0aGlzLnByb3BzLCBldmVudCk7XG5cdH1cblxuXHRvbkZpbGVEZWxldGUoZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgLy9zdG9wIHRyaWdnZXJpbmcgY2xpY2sgb24gcm9vdCBlbGVtZW50XG5cdFx0dGhpcy5wcm9wcy5vbkZpbGVEZWxldGUodGhpcy5wcm9wcywgZXZlbnQpXG5cdH1cblxuXHRpc0ZvbGRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy5jYXRlZ29yeSA9PT0gJ2ZvbGRlcic7XG5cdH1cblxuXHRnZXRUaHVtYm5haWxTdHlsZXMoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuY2F0ZWdvcnkgPT09ICdpbWFnZScpIHtcblx0XHRcdHJldHVybiB7J2JhY2tncm91bmRJbWFnZSc6ICd1cmwoJyArIHRoaXMucHJvcHMudXJsICsgJyknfTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHRnZXRUaHVtYm5haWxDbGFzc05hbWVzKCkge1xuXHRcdHZhciB0aHVtYm5haWxDbGFzc05hbWVzID0gJ2l0ZW1fX3RodW1ibmFpbCc7XG5cblx0XHRpZiAodGhpcy5pc0ltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpKSB7XG5cdFx0XHR0aHVtYm5haWxDbGFzc05hbWVzICs9ICcgbGFyZ2UnO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aHVtYm5haWxDbGFzc05hbWVzO1xuXHR9XG5cblx0Z2V0SXRlbUNsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIGl0ZW1DbGFzc05hbWVzID0gJ2l0ZW0gJyArIHRoaXMucHJvcHMuY2F0ZWdvcnk7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5mb2N1c3NlZCkge1xuXHRcdFx0aXRlbUNsYXNzTmFtZXMgKz0gJyBmb2N1c3NlZCc7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcblx0XHRcdGl0ZW1DbGFzc05hbWVzICs9ICcgc2VsZWN0ZWQnO1xuXHRcdH1cblxuXHRcdHJldHVybiBpdGVtQ2xhc3NOYW1lcztcblx0fVxuXG5cdGlzSW1hZ2VMYXJnZXJUaGFuVGh1bWJuYWlsKCkge1xuXHRcdGxldCBkaW1lbnNpb25zID0gdGhpcy5wcm9wcy5hdHRyaWJ1dGVzLmRpbWVuc2lvbnM7XG5cblx0XHRyZXR1cm4gZGltZW5zaW9ucy5oZWlnaHQgPiBjb25zdGFudHMuVEhVTUJOQUlMX0hFSUdIVCB8fCBkaW1lbnNpb25zLndpZHRoID4gY29uc3RhbnRzLlRIVU1CTkFJTF9XSURUSDtcblx0fVxuXG5cdGhhbmRsZUtleURvd24oZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdC8vaWYgZXZlbnQgZG9lc24ndCBjb21lIGZyb20gdGhlIHJvb3QgZWxlbWVudCwgZG8gbm90aGluZ1xuXHRcdGlmIChldmVudC50YXJnZXQgIT09IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly9JZiBzcGFjZSBvciBlbnRlciBpcyBwcmVzc2VkXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0S2V5cy5pbmRleE9mKGV2ZW50LmtleUNvZGUpID4gLTEpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vU3RvcCBwYWdlIGZyb20gc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgY2xpY2tlZFxuXHRcdFx0dGhpcy5vbkZpbGVOYXZpZ2F0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZUZvY3VzKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0J2ZvY3Vzc2VkJzogdHJ1ZVxuXHRcdH0pXG5cdH1cblxuXHRoYW5kbGVCbHVyKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0J2ZvY3Vzc2VkJzogZmFsc2Vcblx0XHR9KVxuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT17dGhpcy5nZXRJdGVtQ2xhc3NOYW1lcygpfSBkYXRhLWlkPXt0aGlzLnByb3BzLmlkfSB0YWJJbmRleD1cIjBcIiBvbktleURvd249e3RoaXMuaGFuZGxlS2V5RG93bn0gb25Eb3VibGVDbGljaz17dGhpcy5oYW5kbGVEb3VibGVDbGlja30+XG5cdFx0XHQ8ZGl2IHJlZj1cInRodW1ibmFpbFwiIGNsYXNzTmFtZT17dGhpcy5nZXRUaHVtYm5haWxDbGFzc05hbWVzKCl9IHN0eWxlPXt0aGlzLmdldFRodW1ibmFpbFN0eWxlcygpfSBvbkNsaWNrPXt0aGlzLm9uRmlsZVNlbGVjdH0+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zJz5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXNlbGVjdCBbIGZvbnQtaWNvbi10aWNrIF0nXG5cdFx0XHRcdFx0XHR0eXBlPSdidXR0b24nXG5cdFx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uRmlsZVNlbGVjdH1cblx0XHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlRm9jdXN9XG5cdFx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn0+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1yZW1vdmUgWyBmb250LWljb24tdHJhc2ggXSdcblx0XHRcdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25GaWxlRGVsZXRlfVxuXHRcdFx0XHRcdFx0b25Gb2N1cz17dGhpcy5oYW5kbGVGb2N1c31cblx0XHRcdFx0XHRcdG9uQmx1cj17dGhpcy5oYW5kbGVCbHVyfT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLWVkaXQgWyBmb250LWljb24tZWRpdCBdJ1xuXHRcdFx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5vbkZpbGVFZGl0fVxuXHRcdFx0XHRcdFx0b25Gb2N1cz17dGhpcy5oYW5kbGVGb2N1c31cblx0XHRcdFx0XHRcdG9uQmx1cj17dGhpcy5oYW5kbGVCbHVyfT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxwIGNsYXNzTmFtZT0naXRlbV9fdGl0bGUnIHJlZj1cInRpdGxlXCI+e3RoaXMucHJvcHMudGl0bGV9PC9wPlxuXHRcdDwvZGl2Pjtcblx0fVxufVxuXG5GaWxlQ29tcG9uZW50LnByb3BUeXBlcyA9IHtcblx0J2lkJzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0J3RpdGxlJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0J2NhdGVnb3J5JzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0J3VybCc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCdkaW1lbnNpb25zJzogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcblx0XHQnd2lkdGgnOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRcdCdoZWlnaHQnOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG5cdH0pLFxuXHQnb25GaWxlTmF2aWdhdGUnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0J29uRmlsZUVkaXQnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0J29uRmlsZURlbGV0ZSc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQnc2VsZWN0S2V5cyc6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0J29uRmlsZVNlbGVjdCc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQnc2VsZWN0ZWQnOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRmlsZUNvbXBvbmVudDtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEZpbGVDb21wb25lbnQgZnJvbSAnLi9maWxlLWNvbXBvbmVudCc7XG5pbXBvcnQgRWRpdG9yQ29tcG9uZW50IGZyb20gJy4vZWRpdG9yLWNvbXBvbmVudCc7XG5pbXBvcnQgQnVsa0FjdGlvbnNDb21wb25lbnQgZnJvbSAnLi9idWxrLWFjdGlvbnMtY29tcG9uZW50JztcbmltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vYmFzZS1jb21wb25lbnQnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5mdW5jdGlvbiBnZXRDb21wYXJhdG9yKGZpZWxkLCBkaXJlY3Rpb24pIHtcblx0cmV0dXJuIChhLCBiKSA9PiB7XG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2FzYycpIHtcblx0XHRcdGlmIChhW2ZpZWxkXSA8IGJbZmllbGRdKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFbZmllbGRdID4gYltmaWVsZF0pIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChhW2ZpZWxkXSA+IGJbZmllbGRdKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFbZmllbGRdIDwgYltmaWVsZF0pIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDA7XG5cdH07XG59XG5cbmZ1bmN0aW9uIGdldFNvcnQoZmllbGQsIGRpcmVjdGlvbikge1xuXHRsZXQgY29tcGFyYXRvciA9IGdldENvbXBhcmF0b3IoZmllbGQsIGRpcmVjdGlvbik7XG5cblx0cmV0dXJuICgpID0+IHtcblx0XHRsZXQgZm9sZGVycyA9IHRoaXMuc3RhdGUuZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS50eXBlID09PSAnZm9sZGVyJyk7XG5cdFx0bGV0IGZpbGVzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgIT09ICdmb2xkZXInKTtcblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0J2ZpbGVzJzogZm9sZGVycy5zb3J0KGNvbXBhcmF0b3IpLmNvbmNhdChmaWxlcy5zb3J0KGNvbXBhcmF0b3IpKVxuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdCdjb3VudCc6IDAsIC8vIFRoZSBudW1iZXIgb2YgZmlsZXMgaW4gdGhlIGN1cnJlbnQgdmlld1xuXHRcdFx0J2ZpbGVzJzogW10sXG5cdFx0XHQnc2VsZWN0ZWRGaWxlcyc6IFtdLFxuXHRcdFx0J2VkaXRpbmcnOiBudWxsXG5cdFx0fTtcblxuXHRcdHRoaXMuZm9sZGVycyA9IFtwcm9wcy5pbml0aWFsX2ZvbGRlcl07XG5cblx0XHR0aGlzLnNvcnQgPSAnbmFtZSc7XG5cdFx0dGhpcy5kaXJlY3Rpb24gPSAnYXNjJztcblxuXHRcdHRoaXMuc29ydGVycyA9IFtcblx0XHRcdHtcblx0XHRcdFx0J2ZpZWxkJzogJ3RpdGxlJyxcblx0XHRcdFx0J2RpcmVjdGlvbic6ICdhc2MnLFxuXHRcdFx0XHQnbGFiZWwnOiBzcy5pMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfVElUTEVfQVNDJyksXG5cdFx0XHRcdCdvblNvcnQnOiBnZXRTb3J0LmNhbGwodGhpcywgJ3RpdGxlJywgJ2FzYycpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQnZmllbGQnOiAndGl0bGUnLFxuXHRcdFx0XHQnZGlyZWN0aW9uJzogJ2Rlc2MnLFxuXHRcdFx0XHQnbGFiZWwnOiBzcy5pMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfVElUTEVfREVTQycpLFxuXHRcdFx0XHQnb25Tb3J0JzogZ2V0U29ydC5jYWxsKHRoaXMsICd0aXRsZScsICdkZXNjJylcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCdmaWVsZCc6ICdjcmVhdGVkJyxcblx0XHRcdFx0J2RpcmVjdGlvbic6ICdkZXNjJyxcblx0XHRcdFx0J2xhYmVsJzogc3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRklMVEVSX0RBVEVfREVTQycpLFxuXHRcdFx0XHQnb25Tb3J0JzogZ2V0U29ydC5jYWxsKHRoaXMsICdjcmVhdGVkJywgJ2Rlc2MnKVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J2ZpZWxkJzogJ2NyZWF0ZWQnLFxuXHRcdFx0XHQnZGlyZWN0aW9uJzogJ2FzYycsXG5cdFx0XHRcdCdsYWJlbCc6IHNzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkZJTFRFUl9EQVRFX0FTQycpLFxuXHRcdFx0XHQnb25Tb3J0JzogZ2V0U29ydC5jYWxsKHRoaXMsICdjcmVhdGVkJywgJ2FzYycpXG5cdFx0XHR9XG5cdFx0XTtcblxuXHRcdHRoaXMubGlzdGVuZXJzID0ge1xuXHRcdFx0J29uU2VhcmNoRGF0YSc6IChkYXRhKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdCdjb3VudCc6IGRhdGEuY291bnQsXG5cdFx0XHRcdFx0J2ZpbGVzJzogZGF0YS5maWxlc1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHQnb25Nb3JlRGF0YSc6IChkYXRhKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdCdjb3VudCc6IGRhdGEuY291bnQsXG5cdFx0XHRcdFx0J2ZpbGVzJzogdGhpcy5zdGF0ZS5maWxlcy5jb25jYXQoZGF0YS5maWxlcylcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0J29uTmF2aWdhdGVEYXRhJzogKGRhdGEpID0+IHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2NvdW50JzogZGF0YS5jb3VudCxcblx0XHRcdFx0XHQnZmlsZXMnOiBkYXRhLmZpbGVzXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdCdvbkRlbGV0ZURhdGEnOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHQnY291bnQnOiB0aGlzLnN0YXRlLmNvdW50IC0gMSxcblx0XHRcdFx0XHQnZmlsZXMnOiB0aGlzLnN0YXRlLmZpbGVzLmZpbHRlcigoZmlsZSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGEgIT09IGZpbGUuaWQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0J29uU2F2ZURhdGEnOiAoaWQsIHZhbHVlcykgPT4ge1xuXHRcdFx0XHRsZXQgZmlsZXMgPSB0aGlzLnN0YXRlLmZpbGVzO1xuXG5cdFx0XHRcdGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcblx0XHRcdFx0XHRpZiAoZmlsZS5pZCA9PSBpZCkge1xuXHRcdFx0XHRcdFx0ZmlsZS50aXRsZSA9IHZhbHVlcy50aXRsZTtcblx0XHRcdFx0XHRcdGZpbGUuYmFzZW5hbWUgPSB2YWx1ZXMuYmFzZW5hbWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHQnZmlsZXMnOiBmaWxlcyxcblx0XHRcdFx0XHQnZWRpdGluZyc6IGZhbHNlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR0aGlzLmJpbmQoXG5cdFx0XHQnb25GaWxlU2F2ZScsXG5cdFx0XHQnb25GaWxlTmF2aWdhdGUnLFxuXHRcdFx0J29uRmlsZVNlbGVjdCcsXG5cdFx0XHQnb25GaWxlRWRpdCcsXG5cdFx0XHQnb25GaWxlRGVsZXRlJyxcblx0XHRcdCdvbkJhY2tDbGljaycsXG5cdFx0XHQnb25Nb3JlQ2xpY2snLFxuXHRcdFx0J29uTmF2aWdhdGUnLFxuXHRcdFx0J29uQ2FuY2VsJyxcblx0XHRcdCdnZXRTZWxlY3RlZEZpbGVzJ1xuXHRcdCk7XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHRmb3IgKGxldCBldmVudCBpbiB0aGlzLmxpc3RlbmVycykge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm9uKGV2ZW50LCB0aGlzLmxpc3RlbmVyc1tldmVudF0pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BzLmluaXRpYWxfZm9sZGVyICE9PSB0aGlzLnByb3BzLmN1cnJlbnRfZm9sZGVyKSB7XG5cdFx0XHR0aGlzLm9uTmF2aWdhdGUodGhpcy5wcm9wcy5jdXJyZW50X2ZvbGRlcik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5zZWFyY2goKTtcblx0XHR9XG5cdH1cblxuXHRjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcblx0XHRmb3IgKGxldCBldmVudCBpbiB0aGlzLmxpc3RlbmVycykge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCB0aGlzLmxpc3RlbmVyc1tldmVudF0pO1xuXHRcdH1cblx0fVxuXG5cdGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcblx0XHR2YXIgJHNlbGVjdCA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5nYWxsZXJ5X19zb3J0IC5kcm9wZG93bicpLFxuXHRcdFx0bGVmdFZhbCA9ICQoJy5jbXMtY29udGVudC10b29sYmFyOnZpc2libGUnKS53aWR0aCgpICsgMTI7XG5cblx0XHRpZiAodGhpcy5mb2xkZXJzLmxlbmd0aCA+IDEpIHtcblx0XHRcdGxldCBiYWNrQnV0dG9uID0gdGhpcy5yZWZzLmJhY2tCdXR0b24uZ2V0RE9NTm9kZSgpO1xuXG5cdFx0XHQkKGJhY2tCdXR0b24pLmNzcyh7XG5cdFx0XHRcdGxlZnQ6IGxlZnRWYWxcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIFdlIG9wdC1vdXQgb2YgbGV0dGluZyB0aGUgQ01TIGhhbmRsZSBDaG9zZW4gYmVjYXVzZSBpdCBkb2Vzbid0IHJlLWFwcGx5IHRoZSBiZWhhdmlvdXIgY29ycmVjdGx5LlxuXHRcdC8vIFNvIGFmdGVyIHRoZSBnYWxsZXJ5IGhhcyBiZWVuIHJlbmRlcmVkIHdlIGFwcGx5IENob3Nlbi5cblx0XHQkc2VsZWN0LmNob3Nlbih7XG5cdFx0XHQnYWxsb3dfc2luZ2xlX2Rlc2VsZWN0JzogdHJ1ZSxcblx0XHRcdCdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnOiAyMFxuXHRcdH0pO1xuXG5cdFx0Ly8gQ2hvc2VuIHN0b3BzIHRoZSBjaGFuZ2UgZXZlbnQgZnJvbSByZWFjaGluZyBSZWFjdCBzbyB3ZSBoYXZlIHRvIHNpbXVsYXRlIGEgY2xpY2suXG5cdFx0JHNlbGVjdC5jaGFuZ2UoKCkgPT4gUmVhY3QuYWRkb25zLlRlc3RVdGlscy5TaW11bGF0ZS5jbGljaygkc2VsZWN0LmZpbmQoJzpzZWxlY3RlZCcpWzBdKSk7XG5cdH1cblxuXHRnZXRCYWNrQnV0dG9uKCkge1xuXHRcdGlmICh0aGlzLmZvbGRlcnMubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuIDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPSdzcy11aS1idXR0b24gdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWxldmVsLXVwJ1xuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uQmFja0NsaWNrfVxuXHRcdFx0XHRyZWY9XCJiYWNrQnV0dG9uXCI+e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkJBQ0snKX08L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRCdWxrQWN0aW9uc0NvbXBvbmVudCgpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiA8QnVsa0FjdGlvbnNDb21wb25lbnRcblx0XHRcdFx0b3B0aW9ucz17Q09OU1RBTlRTLkJVTEtfQUNUSU9OU31cblx0XHRcdFx0cGxhY2Vob2xkZXI9e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkJVTEtfQUNUSU9OU19QTEFDRUhPTERFUicpfVxuXHRcdFx0XHRiYWNrZW5kPXt0aGlzLnByb3BzLmJhY2tlbmR9XG5cdFx0XHRcdGdldFNlbGVjdGVkRmlsZXM9e3RoaXMuZ2V0U2VsZWN0ZWRGaWxlc30gLz47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRNb3JlQnV0dG9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLmNvdW50ID4gdGhpcy5zdGF0ZS5maWxlcy5sZW5ndGgpIHtcblx0XHRcdHJldHVybiA8YnV0dG9uXG5cdFx0XHRcdGNsYXNzTmFtZT1cImdhbGxlcnlfX2xvYWRfX21vcmVcIlxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uTW9yZUNsaWNrfT57c3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuTE9BRE1PUkUnKX08L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRTZWxlY3RlZEZpbGVzKCkge1xuXHRcdHJldHVybiB0aGlzLnN0YXRlLnNlbGVjdGVkRmlsZXM7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZWRpdGluZykge1xuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5Jz5cblx0XHRcdFx0PEVkaXRvckNvbXBvbmVudFxuXHRcdFx0XHRcdGZpbGU9e3RoaXMuc3RhdGUuZWRpdGluZ31cblx0XHRcdFx0XHRvbkZpbGVTYXZlPXt0aGlzLm9uRmlsZVNhdmV9XG5cdFx0XHRcdFx0b25DYW5jZWw9e3RoaXMub25DYW5jZWx9IC8+XG5cdFx0XHQ8L2Rpdj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5Jz5cblx0XHRcdHt0aGlzLmdldEJhY2tCdXR0b24oKX1cblx0XHRcdHt0aGlzLmdldEJ1bGtBY3Rpb25zQ29tcG9uZW50KCl9XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX3NvcnQgZmllbGRob2xkZXItc21hbGxcIj5cblx0XHRcdFx0PHNlbGVjdCBjbGFzc05hbWU9XCJkcm9wZG93biBuby1jaGFuZ2UtdHJhY2sgbm8tY2h6blwiIHRhYkluZGV4PVwiMFwiIHN0eWxlPXt7d2lkdGg6ICcxNjBweCd9fT5cblx0XHRcdFx0XHR7dGhpcy5zb3J0ZXJzLm1hcCgoc29ydGVyLCBpKSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gPG9wdGlvbiBrZXk9e2l9IG9uQ2xpY2s9e3NvcnRlci5vblNvcnR9Pntzb3J0ZXIubGFiZWx9PC9vcHRpb24+O1xuXHRcdFx0XHRcdH0pfVxuXHRcdFx0XHQ8L3NlbGVjdD5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2l0ZW1zJz5cblx0XHRcdFx0e3RoaXMuc3RhdGUuZmlsZXMubWFwKChmaWxlLCBpKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIDxGaWxlQ29tcG9uZW50IGtleT17aX0gey4uLmZpbGV9XG5cdFx0XHRcdFx0XHRzZWxlY3RLZXlzPXtDT05TVEFOVFMuRklMRV9TRUxFQ1RfS0VZU31cblx0XHRcdFx0XHRcdG9uRmlsZVNlbGVjdD17dGhpcy5vbkZpbGVTZWxlY3R9XG5cdFx0XHRcdFx0XHRzZWxlY3RLZXlzPXtDT05TVEFOVFMuRklMRV9TRUxFQ1RfS0VZU31cblx0XHRcdFx0XHRcdG9uRmlsZURlbGV0ZT17dGhpcy5vbkZpbGVEZWxldGV9XG5cdFx0XHRcdFx0XHRvbkZpbGVFZGl0PXt0aGlzLm9uRmlsZUVkaXR9XG5cdFx0XHRcdFx0XHRvbkZpbGVOYXZpZ2F0ZT17dGhpcy5vbkZpbGVOYXZpZ2F0ZX1cblx0XHRcdFx0XHRcdHNlbGVjdGVkPXt0aGlzLnN0YXRlLnNlbGVjdGVkRmlsZXMuaW5kZXhPZihmaWxlLmlkKSA+IC0xfSAvPjtcblx0XHRcdFx0fSl9XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZ2FsbGVyeV9fbG9hZFwiPlxuXHRcdFx0XHR7dGhpcy5nZXRNb3JlQnV0dG9uKCl9XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRvbkNhbmNlbCgpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdlZGl0aW5nJzogbnVsbFxuXHRcdH0pO1xuXHR9XG5cblx0b25GaWxlU2VsZWN0KGZpbGUsIGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHR2YXIgY3VycmVudGx5U2VsZWN0ZWQgPSB0aGlzLnN0YXRlLnNlbGVjdGVkRmlsZXMsXG5cdFx0XHRmaWxlSW5kZXggPSBjdXJyZW50bHlTZWxlY3RlZC5pbmRleE9mKGZpbGUuaWQpO1xuXG5cdFx0aWYgKGZpbGVJbmRleCA+IC0xKSB7XG5cdFx0XHRjdXJyZW50bHlTZWxlY3RlZC5zcGxpY2UoZmlsZUluZGV4LCAxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudGx5U2VsZWN0ZWQucHVzaChmaWxlLmlkKTtcblx0XHR9XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdzZWxlY3RlZEZpbGVzJzogY3VycmVudGx5U2VsZWN0ZWRcblx0XHR9KTtcblx0fVxuXG5cdG9uRmlsZURlbGV0ZShmaWxlLCBldmVudCkge1xuXHRcdGlmIChjb25maXJtKHNzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkNPTkZJUk1ERUxFVEUnKSkpIHtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5kZWxldGUoZmlsZS5pZCk7XG5cdFx0fVxuXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH1cblxuXHRvbkZpbGVFZGl0KGZpbGUsIGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHQnZWRpdGluZyc6IGZpbGVcblx0XHR9KTtcblxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9XG5cblx0b25GaWxlTmF2aWdhdGUoZmlsZSkge1xuXHRcdHRoaXMuZm9sZGVycy5wdXNoKGZpbGUuZmlsZW5hbWUpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5uYXZpZ2F0ZShmaWxlLmZpbGVuYW1lKTtcblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0J3NlbGVjdGVkRmlsZXMnOiBbXVxuXHRcdH0pXG5cdH1cblxuXHRvbk5hdmlnYXRlKGZvbGRlcikge1xuXHRcdHRoaXMuZm9sZGVycy5wdXNoKGZvbGRlcik7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm5hdmlnYXRlKGZvbGRlcik7XG5cdH1cblxuXHRvbk1vcmVDbGljayhldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm1vcmUoKTtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRvbkJhY2tDbGljayhldmVudCkge1xuXHRcdGlmICh0aGlzLmZvbGRlcnMubGVuZ3RoID4gMSkge1xuXHRcdFx0dGhpcy5mb2xkZXJzLnBvcCgpO1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm5hdmlnYXRlKHRoaXMuZm9sZGVyc1t0aGlzLmZvbGRlcnMubGVuZ3RoIC0gMV0pO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0J3NlbGVjdGVkRmlsZXMnOiBbXVxuXHRcdH0pXG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0b25GaWxlU2F2ZShpZCwgc3RhdGUsIGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLnNhdmUoaWQsIHN0YXRlKTtcblxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcblx0J1RIVU1CTkFJTF9IRUlHSFQnOiAxNTAsXG5cdCdUSFVNQk5BSUxfV0lEVEgnOiAyMDAsXG5cdCdGSUxFX1NFTEVDVF9LRVlTJzogWzMyLCAxM10sXG5cdCdCVUxLX0FDVElPTlMnOiBbXG5cdFx0e1xuXHRcdFx0dmFsdWU6ICdkZWxldGUnLFxuXHRcdFx0bGFiZWw6IHNzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkJVTEtfQUNUSU9OU19ERUxFVEUnKSxcblx0XHRcdGRlc3RydWN0aXZlOiB0cnVlXG5cdFx0fVxuXHRdXG59O1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2FsbGVyeUNvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudC9nYWxsZXJ5LWNvbXBvbmVudCc7XG5pbXBvcnQgRmlsZUJhY2tlbmQgZnJvbSAnLi9iYWNrZW5kL2ZpbGUtYmFja2VuZCc7XG5cbmZ1bmN0aW9uIGdldFZhcihuYW1lKSB7XG5cdHZhciBwYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCc/Jyk7XG5cblx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRwYXJ0cyA9IHBhcnRzWzFdLnNwbGl0KCcjJyk7XG5cdH1cblxuXHRsZXQgdmFyaWFibGVzID0gcGFydHNbMF0uc3BsaXQoJyYnKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHZhcmlhYmxlcy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwYXJ0cyA9IHZhcmlhYmxlc1tpXS5zcGxpdCgnPScpO1xuXG5cdFx0aWYgKGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSkgPT09IG5hbWUpIHtcblx0XHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBudWxsO1xufVxuXG4kKCcuYXNzZXQtZ2FsbGVyeScpLmVudHdpbmUoe1xuXHQnb25hZGQnOiBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHByb3BzID0ge1xuXHRcdFx0J25hbWUnOiB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LW5hbWUnKSxcblx0XHRcdCdpbml0aWFsX2ZvbGRlcic6IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktaW5pdGlhbC1mb2xkZXInKVxuXHRcdH07XG5cblx0XHRpZiAocHJvcHMubmFtZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkc2VhcmNoID0gJCgnLmNtcy1zZWFyY2gtZm9ybScpO1xuXG5cdFx0aWYgKCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJykubGVuZ3RoID09IDApIHtcblx0XHRcdCRzZWFyY2guYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJxW0ZvbGRlcl1cIiAvPicpO1xuXHRcdH1cblxuXHRcdHByb3BzLmJhY2tlbmQgPSBGaWxlQmFja2VuZC5jcmVhdGUoXG5cdFx0XHR0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LXNlYXJjaC11cmwnKSxcblx0XHRcdHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktdXBkYXRlLXVybCcpLFxuXHRcdFx0dGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1kZWxldGUtdXJsJyksXG5cdFx0XHR0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWxpbWl0JyksXG5cdFx0XHQkc2VhcmNoLmZpbmQoJ1t0eXBlPWhpZGRlbl1bbmFtZT1cInFbRm9sZGVyXVwiXScpXG5cdFx0KTtcblxuXHRcdHByb3BzLmJhY2tlbmQuZW1pdChcblx0XHRcdCdmaWx0ZXInLFxuXHRcdFx0Z2V0VmFyKCdxW05hbWVdJyksXG5cdFx0XHRnZXRWYXIoJ3FbQXBwQ2F0ZWdvcnldJyksXG5cdFx0XHRnZXRWYXIoJ3FbRm9sZGVyXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRGcm9tXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRUb10nKSxcblx0XHRcdGdldFZhcigncVtDdXJyZW50Rm9sZGVyT25seV0nKVxuXHRcdCk7XG5cblx0XHRwcm9wcy5jdXJyZW50X2ZvbGRlciA9IGdldFZhcigncVtGb2xkZXJdJykgfHwgcHJvcHMuaW5pdGlhbF9mb2xkZXI7XG5cblx0XHRSZWFjdC5yZW5kZXIoXG5cdFx0XHQ8R2FsbGVyeUNvbXBvbmVudCB7Li4ucHJvcHN9IC8+LFxuXHRcdFx0dGhpc1swXVxuXHRcdCk7XG5cdH1cbn0pO1xuIl19

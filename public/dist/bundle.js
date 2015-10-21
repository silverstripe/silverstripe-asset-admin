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
		label: 'Delete',
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2JhY2tlbmQvZmlsZS1iYWNrZW5kLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2Jhc2UtY29tcG9uZW50LmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1nYWxsZXJ5LWZpZWxkL3B1YmxpYy9zcmMvY29tcG9uZW50L2J1bGstYWN0aW9ucy1jb21wb25lbnQuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWdhbGxlcnktZmllbGQvcHVibGljL3NyYy9jb21wb25lbnQvZWRpdG9yLWNvbXBvbmVudC5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9maWxlLWNvbXBvbmVudC5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbXBvbmVudC9nYWxsZXJ5LWNvbXBvbmVudC5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL2NvbnN0YW50cy5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtZ2FsbGVyeS1maWVsZC9wdWJsaWMvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQzdTYyxRQUFROzs7O3NCQUNILFFBQVE7Ozs7SUFFTixXQUFXO1dBQVgsV0FBVzs7Y0FBWCxXQUFXOztTQUNsQixrQkFBZ0I7cUNBQVosVUFBVTtBQUFWLGNBQVU7OztBQUMxQiwyQkFBVyxXQUFXLGdCQUFJLFVBQVUsTUFBRTtHQUN0Qzs7O0FBRVUsVUFMUyxXQUFXLENBS25CLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7d0JBTDVDLFdBQVc7O0FBTTlCLDZCQU5tQixXQUFXLDZDQU10Qjs7QUFFUixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixNQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFdkIsTUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7RUFDZDs7Y0FmbUIsV0FBVzs7U0FpQnpCLGtCQUFHOzs7QUFDUixPQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzs7QUFFZCxPQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ25ELFVBQUssSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUM7R0FDSDs7O1NBRUcsZ0JBQUc7OztBQUNOLE9BQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWixPQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ25ELFdBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQUM7R0FDSDs7O1NBRU8sa0JBQUMsTUFBTSxFQUFFOzs7QUFDaEIsT0FBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7QUFDZCxPQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsT0FBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVqQyxPQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ25ELFdBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQztHQUNIOzs7U0FFa0IsNkJBQUMsTUFBTSxFQUFFO0FBQzNCLE9BQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUM5QixVQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3Qzs7QUFFRCxPQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN6Qjs7O1NBRUssaUJBQUMsR0FBRyxFQUFFOzs7QUFDWCxPQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7OztBQUd2QixPQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxnQkFBZ0IsRUFBRTtBQUM3RCxpQkFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixNQUFNO0FBQ04saUJBQWEsR0FBRyxHQUFHLENBQUM7SUFDcEI7O0FBRUQsT0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNwQyxTQUFLLEVBQUUsYUFBYTtJQUNwQixDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07Ozs7OztBQUNiLDBCQUFlLGFBQWEsOEhBQUU7VUFBckIsRUFBRTs7QUFDVixhQUFLLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUM7TUFDOUI7Ozs7Ozs7Ozs7Ozs7OztJQUNELENBQUMsQ0FBQztHQUNIOzs7U0FFSyxnQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGtCQUFrQixFQUFFO0FBQ3RFLE9BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLE9BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLE9BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLE9BQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQy9CLE9BQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLE9BQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQzs7QUFFN0MsT0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ2Q7OztTQUVHLGNBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRTs7O0FBQ2hCLFNBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRWxCLE9BQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDeEQsV0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUM7R0FDSDs7O1NBRU0saUJBQUMsTUFBTSxFQUFFLEdBQUcsRUFBYTs7O09BQVgsSUFBSSx5REFBRyxFQUFFOztBQUM3QixPQUFJLFFBQVEsR0FBRztBQUNkLFdBQU8sRUFBRSxJQUFJLENBQUMsS0FBSztBQUNuQixVQUFNLEVBQUUsSUFBSSxDQUFDLElBQUk7SUFDakIsQ0FBQzs7QUFFRixPQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDekMsWUFBUSxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUM7O0FBRUQsT0FBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQzdDLFlBQVEsQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xEOztBQUVELE9BQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUN2RCxZQUFRLENBQUMsV0FBVyxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1RDs7QUFFRCxPQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDbkQsWUFBUSxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEQ7O0FBRUQsT0FBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUNyRSxZQUFRLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDMUU7O0FBRUQsT0FBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7O0FBRTVCLFVBQU8sb0JBQUUsSUFBSSxDQUFDO0FBQ2IsU0FBSyxFQUFFLEdBQUc7QUFDVixZQUFRLEVBQUUsTUFBTTtBQUNoQixjQUFVLEVBQUUsTUFBTTtBQUNsQixVQUFNLEVBQUUsb0JBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUM7SUFDaEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFNO0FBQ2YsV0FBSyxvQkFBb0IsRUFBRSxDQUFDO0lBQzVCLENBQUMsQ0FBQztHQUNIOzs7U0FFbUIsZ0NBQUc7QUFDdEIsNEJBQUUsMEJBQTBCLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEQsNEJBQUUsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQzdDOzs7U0FFbUIsZ0NBQUc7QUFDdEIsNEJBQUUsMEJBQTBCLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckQsNEJBQUUsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0dBQzVDOzs7UUF4SW1CLFdBQVc7OztxQkFBWCxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkNIZCxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7U0FHcEIsZ0JBQWE7OztxQ0FBVCxPQUFPO0FBQVAsV0FBTzs7O0FBQ2QsVUFBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU07V0FBSyxNQUFLLE1BQU0sQ0FBQyxHQUFHLE1BQUssTUFBTSxDQUFDLENBQUMsSUFBSSxPQUFNO0lBQUEsQ0FBQyxDQUFDO0dBQ3BFOzs7O0dBSDJCLG1CQUFNLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JDRjlCLFFBQVE7Ozs7cUJBQ0osT0FBTzs7Ozs2QkFDQyxrQkFBa0I7Ozs7SUFFdkIsb0JBQW9CO1dBQXBCLG9CQUFvQjs7QUFFN0IsVUFGUyxvQkFBb0IsQ0FFNUIsS0FBSyxFQUFFO3dCQUZDLG9CQUFvQjs7QUFHdkMsNkJBSG1CLG9CQUFvQiw2Q0FHakMsS0FBSyxFQUFFOztBQUViLE1BQUksQ0FBQyxJQUFJLENBQ1IsZUFBZSxDQUNmLENBQUM7RUFDRjs7Y0FSbUIsb0JBQW9COztTQVV2Qiw2QkFBRztBQUNuQixPQUFJLE9BQU8sR0FBRyx5QkFBRSxtQkFBTSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO09BQ3pELE9BQU8sR0FBRyxPQUFPLEdBQUcseUJBQUUsOEJBQThCLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO09BQ2xFLFVBQVUsR0FBRyx5QkFBRSw4QkFBOEIsQ0FBQyxDQUFDOztBQUVoRCxPQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzFCLFdBQU8sSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ25DOztBQUVELDRCQUFFLG1CQUFNLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUM5QixRQUFJLEVBQUUsT0FBTztJQUNiLENBQUMsQ0FBQzs7QUFFSCxVQUFPLENBQUMsTUFBTSxDQUFDO0FBQ2QsMkJBQXVCLEVBQUUsSUFBSTtBQUM3Qiw4QkFBMEIsRUFBRSxFQUFFO0lBQzlCLENBQUMsQ0FBQzs7O0FBR0gsVUFBTyxDQUFDLE1BQU0sQ0FBQztXQUFNLG1CQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQUEsQ0FBQyxDQUFDO0dBQzFGOzs7U0FFSyxrQkFBRzs7O0FBQ1IsVUFBTzs7TUFBSyxTQUFTLEVBQUMsaUNBQWlDO0lBQ3REOztPQUFRLFNBQVMsRUFBQyxrQ0FBa0MsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLG9CQUFrQixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQUFBQyxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsQUFBQztLQUNuSSw2Q0FBUSxRQUFRLE1BQUEsRUFBQyxRQUFRLE1BQUEsRUFBQyxNQUFNLE1BQUEsRUFBQyxLQUFLLEVBQUMsRUFBRSxHQUFVO0tBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUs7QUFDdEMsYUFBTzs7U0FBUSxHQUFHLEVBQUUsQ0FBQyxBQUFDLEVBQUMsT0FBTyxFQUFFLE1BQUssYUFBYSxBQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEFBQUM7T0FBRSxNQUFNLENBQUMsS0FBSztPQUFVLENBQUM7TUFDakcsQ0FBQztLQUNNO0lBQ0osQ0FBQztHQUNQOzs7U0FFZSwwQkFBQyxLQUFLLEVBQUU7Ozs7OztBQUN2Qix5QkFBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLDhIQUFFO1NBQTlCLE1BQU07O0FBQ2QsU0FBSSxNQUFNLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRTtBQUMzQixhQUFPLE1BQU0sQ0FBQztNQUNkO0tBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxVQUFPLElBQUksQ0FBQztHQUNaOzs7U0FFVSxxQkFBQyxLQUFLLEVBQUU7O0FBRWxCLFdBQVEsS0FBSztBQUNaLFNBQUssUUFBUTtBQUNaLFNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxVQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7QUFBQSxBQUMxRDtBQUNDLFlBQU8sS0FBSyxDQUFDO0FBQUEsSUFDZDtHQUNEOzs7U0FFWSx1QkFBQyxLQUFLLEVBQUU7QUFDcEIsT0FBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7OztBQUd2RCxPQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDcEIsV0FBTztJQUNQOztBQUVELE9BQUksTUFBTSxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQUU7QUFDaEMsUUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsd0NBQXdDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNqRyxTQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMvQjtJQUNELE1BQU07QUFDTixRQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQjs7O0FBR0QsNEJBQUUsbUJBQU0sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7R0FDOUU7OztRQWpGbUIsb0JBQW9COzs7cUJBQXBCLG9CQUFvQjtBQWtGeEMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkN0RlksUUFBUTs7OztxQkFDSixPQUFPOzs7OzZCQUNDLGtCQUFrQjs7OztJQUV0QyxlQUFlO1dBQWYsZUFBZTs7QUFDVCxVQUROLGVBQWUsQ0FDUixLQUFLLEVBQUU7Ozt3QkFEZCxlQUFlOztBQUVuQiw2QkFGSSxlQUFlLDZDQUViLEtBQUssRUFBRTs7QUFFYixNQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1osVUFBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUs7QUFDOUIsYUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVE7R0FDcEMsQ0FBQzs7QUFFRixNQUFJLENBQUMsTUFBTSxHQUFHLENBQ2I7QUFDQyxVQUFPLEVBQUUsT0FBTztBQUNoQixTQUFNLEVBQUUsT0FBTztBQUNmLFVBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLO0FBQzlCLGFBQVUsRUFBRSxrQkFBQyxLQUFLO1dBQUssTUFBSyxhQUFhLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztJQUFBO0dBQ3pELEVBQ0Q7QUFDQyxVQUFPLEVBQUUsVUFBVTtBQUNuQixTQUFNLEVBQUUsVUFBVTtBQUNsQixVQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUTtBQUNqQyxhQUFVLEVBQUUsa0JBQUMsS0FBSztXQUFLLE1BQUssYUFBYSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUM7SUFBQTtHQUM1RCxDQUNELENBQUM7O0FBRUYsTUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0VBQ3JEOztjQXpCSSxlQUFlOztTQTJCUCx1QkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzFCLE9BQUksQ0FBQyxRQUFRLHFCQUNYLElBQUksRUFBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFDekIsQ0FBQztHQUNIOzs7U0FFUyxvQkFBQyxLQUFLLEVBQUU7QUFDakIsT0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDN0Q7OztTQUVPLGtCQUFDLEtBQUssRUFBRTtBQUNmLE9BQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzNCOzs7U0FFSyxrQkFBRzs7O0FBQ1IsVUFBTzs7TUFBSyxTQUFTLEVBQUMsUUFBUTtJQUM3Qjs7T0FBSyxTQUFTLEVBQUMsZ0RBQWdEO0tBQzlEOztRQUFLLFNBQVMsRUFBQyx3REFBd0Q7TUFDdEUsMENBQUssU0FBUyxFQUFDLG1CQUFtQixFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEFBQUMsR0FBRztNQUMxRDtLQUNOOztRQUFLLFNBQVMsRUFBQyxxREFBcUQ7TUFDbkU7O1NBQUssU0FBUyxFQUFDLGtDQUFrQztPQUNoRDs7VUFBSyxTQUFTLEVBQUMsZ0JBQWdCO1FBQzlCOztXQUFPLFNBQVMsRUFBQyxNQUFNO1NBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUM7O1NBQVU7UUFDdkU7O1dBQUssU0FBUyxFQUFDLGNBQWM7U0FDNUI7O1lBQU0sU0FBUyxFQUFDLFVBQVU7VUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJO1VBQVE7U0FDbkQ7UUFDRDtPQUNEO01BQ047O1NBQUssU0FBUyxFQUFDLGdCQUFnQjtPQUM5Qjs7VUFBTyxTQUFTLEVBQUMsTUFBTTtRQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHdCQUF3QixDQUFDOztRQUFVO09BQ3ZFOztVQUFLLFNBQVMsRUFBQyxjQUFjO1FBQzVCOztXQUFNLFNBQVMsRUFBQyxVQUFVO1NBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSTtTQUFRO1FBQ25EO09BQ0Q7TUFDTjs7U0FBSyxTQUFTLEVBQUMsZ0JBQWdCO09BQzlCOztVQUFPLFNBQVMsRUFBQyxNQUFNO1FBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUM7O1FBQVU7T0FDdEU7O1VBQUssU0FBUyxFQUFDLGNBQWM7UUFDNUI7O1dBQU0sU0FBUyxFQUFDLFVBQVU7U0FDekI7O1lBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRO1VBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRztVQUFLO1NBQ2pFO1FBQ0Y7T0FDRDtNQUNOOztTQUFLLFNBQVMsRUFBQyw4QkFBOEI7T0FDNUM7O1VBQU8sU0FBUyxFQUFDLE1BQU07UUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQzs7UUFBVTtPQUMxRTs7VUFBSyxTQUFTLEVBQUMsY0FBYztRQUM1Qjs7V0FBTSxTQUFTLEVBQUMsVUFBVTtTQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87U0FBUTtRQUN0RDtPQUNEO01BQ047O1NBQUssU0FBUyxFQUFDLDhCQUE4QjtPQUM1Qzs7VUFBTyxTQUFTLEVBQUMsTUFBTTtRQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLDRCQUE0QixDQUFDOztRQUFVO09BQzNFOztVQUFLLFNBQVMsRUFBQyxjQUFjO1FBQzVCOztXQUFNLFNBQVMsRUFBQyxVQUFVO1NBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVztTQUFRO1FBQzFEO09BQ0Q7TUFDTjs7U0FBSyxTQUFTLEVBQUMsZ0JBQWdCO09BQzlCOztVQUFPLFNBQVMsRUFBQyxNQUFNO1FBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUM7O1FBQVU7T0FDdEU7O1VBQUssU0FBUyxFQUFDLGNBQWM7UUFDNUI7O1dBQU0sU0FBUyxFQUFDLFVBQVU7U0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUs7O1NBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNOztTQUFVO1FBQzdIO09BQ0Q7TUFDRDtLQUNEO0lBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFLO0FBQzlCLFlBQU87O1FBQUssU0FBUyxFQUFDLFlBQVksRUFBQyxHQUFHLEVBQUUsQ0FBQyxBQUFDO01BQ3pDOztTQUFPLFNBQVMsRUFBQyxNQUFNO09BQUUsS0FBSyxDQUFDLEtBQUs7T0FBUztNQUM3Qzs7U0FBSyxTQUFTLEVBQUMsY0FBYztPQUM1Qiw0Q0FBTyxTQUFTLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLEFBQUMsRUFBQyxLQUFLLEVBQUUsT0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxBQUFDLEdBQUc7T0FDMUY7TUFDRCxDQUFBO0tBQ04sQ0FBQztJQUNGOzs7S0FDQzs7O0FBQ0MsV0FBSSxFQUFDLFFBQVE7QUFDYixnQkFBUyxFQUFDLHNGQUFzRjtBQUNoRyxjQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQztNQUN4QixFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztNQUM3QjtLQUNUOzs7QUFDQyxXQUFJLEVBQUMsUUFBUTtBQUNiLGdCQUFTLEVBQUMsMEZBQTBGO0FBQ3BHLGNBQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxBQUFDO01BQ3RCLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLDBCQUEwQixDQUFDO01BQy9CO0tBQ0o7SUFDRCxDQUFDO0dBQ1A7OztRQWpISSxlQUFlOzs7QUFvSHJCLGVBQWUsQ0FBQyxTQUFTLEdBQUc7QUFDM0IsT0FBTSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFDN0IsTUFBSSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzVCLFNBQU8sRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUMvQixZQUFVLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDbEMsT0FBSyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzdCLFFBQU0sRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUM5QixXQUFTLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDakMsZUFBYSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQ3JDLGNBQVksRUFBRSxtQkFBTSxTQUFTLENBQUMsS0FBSyxDQUFDO0FBQ25DLFVBQU8sRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUMvQixXQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07R0FDaEMsQ0FBQztFQUNGLENBQUM7QUFDRixhQUFZLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDbEMsV0FBVSxFQUFDLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0NBQy9CLENBQUM7O3FCQUVhLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQzFJaEIsUUFBUTs7OztxQkFDSixPQUFPOzs7O3lCQUNILGNBQWM7Ozs7NkJBQ1Ysa0JBQWtCOzs7O0lBRXRDLGFBQWE7V0FBYixhQUFhOztBQUNQLFVBRE4sYUFBYSxDQUNOLEtBQUssRUFBRTt3QkFEZCxhQUFhOztBQUVqQiw2QkFGSSxhQUFhLDZDQUVYLEtBQUssRUFBRTs7QUFFYixNQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1osYUFBVSxFQUFFLEtBQUs7R0FDakIsQ0FBQzs7QUFFRixNQUFJLENBQUMsSUFBSSxDQUNSLGdCQUFnQixFQUNoQixZQUFZLEVBQ1osY0FBYyxFQUNkLGNBQWMsRUFDZCxtQkFBbUIsRUFDbkIsZUFBZSxFQUNmLGFBQWEsRUFDYixZQUFZLEVBQ1osY0FBYyxDQUNkLENBQUM7RUFDRjs7Y0FuQkksYUFBYTs7U0FxQkQsMkJBQUMsS0FBSyxFQUFFO0FBQ3hCLE9BQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3ZHLFdBQU87SUFDUDs7QUFFRCxPQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzNCOzs7U0FFYSx3QkFBQyxLQUFLLEVBQUU7QUFDckIsT0FBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDcEIsUUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUM1QyxXQUFPO0lBQ1A7O0FBRUQsT0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN2Qjs7O1NBRVcsc0JBQUMsS0FBSyxFQUFFO0FBQ25CLFFBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4QixPQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzNDOzs7U0FFUyxvQkFBQyxLQUFLLEVBQUU7QUFDakIsUUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLE9BQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDekM7OztTQUVXLHNCQUFDLEtBQUssRUFBRTtBQUNuQixRQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDeEIsT0FBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtHQUMxQzs7O1NBRU8sb0JBQUc7QUFDVixVQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQztHQUN4Qzs7O1NBRWlCLDhCQUFHO0FBQ3BCLE9BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO0FBQ3BDLFdBQU8sRUFBQyxpQkFBaUIsRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFDLENBQUM7SUFDMUQ7O0FBRUQsVUFBTyxFQUFFLENBQUM7R0FDVjs7O1NBRXFCLGtDQUFHO0FBQ3hCLE9BQUksbUJBQW1CLEdBQUcsaUJBQWlCLENBQUM7O0FBRTVDLE9BQUksSUFBSSxDQUFDLDBCQUEwQixFQUFFLEVBQUU7QUFDdEMsdUJBQW1CLElBQUksUUFBUSxDQUFDO0lBQ2hDOztBQUVELFVBQU8sbUJBQW1CLENBQUM7R0FDM0I7OztTQUVnQiw2QkFBRztBQUNuQixPQUFJLGNBQWMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7O0FBRW5ELE9BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDeEIsa0JBQWMsSUFBSSxXQUFXLENBQUM7SUFDOUI7O0FBRUQsT0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUN4QixrQkFBYyxJQUFJLFdBQVcsQ0FBQztJQUM5Qjs7QUFFRCxVQUFPLGNBQWMsQ0FBQztHQUN0Qjs7O1NBRXlCLHNDQUFHO0FBQzVCLE9BQUksVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQzs7QUFFbEQsVUFBTyxVQUFVLENBQUMsTUFBTSxHQUFHLHVCQUFVLGdCQUFnQixJQUFJLFVBQVUsQ0FBQyxLQUFLLEdBQUcsdUJBQVUsZUFBZSxDQUFDO0dBQ3RHOzs7U0FFWSx1QkFBQyxLQUFLLEVBQUU7QUFDcEIsUUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDOzs7QUFHeEIsT0FBSSxLQUFLLENBQUMsTUFBTSxLQUFLLG1CQUFNLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM3QyxXQUFPO0lBQ1A7OztBQUdELE9BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUN0RCxTQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsUUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3RCO0dBQ0Q7OztTQUVVLHVCQUFHO0FBQ2IsT0FBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLGNBQVUsRUFBRSxJQUFJO0lBQ2hCLENBQUMsQ0FBQTtHQUNGOzs7U0FFUyxzQkFBRztBQUNaLE9BQUksQ0FBQyxRQUFRLENBQUM7QUFDYixjQUFVLEVBQUUsS0FBSztJQUNqQixDQUFDLENBQUE7R0FDRjs7O1NBRUssa0JBQUc7QUFDUixVQUFPOztNQUFLLFNBQVMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQUFBQyxFQUFDLFdBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEFBQUMsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxBQUFDLEVBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQUFBQztJQUMxSjs7T0FBSyxHQUFHLEVBQUMsV0FBVyxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQUFBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQUFBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxBQUFDO0tBQzNIOztRQUFLLFNBQVMsRUFBQyxlQUFlO01BQzdCO0FBQ0MsZ0JBQVMsRUFBQyx3RUFBd0U7QUFDbEYsV0FBSSxFQUFDLFFBQVE7QUFDYixjQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQztBQUMzQixjQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQUFBQztBQUMxQixhQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQyxHQUNoQjtNQUNUO0FBQ0MsZ0JBQVMsRUFBQyx5RUFBeUU7QUFDbkYsV0FBSSxFQUFDLFFBQVE7QUFDYixjQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQztBQUMzQixjQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQUFBQztBQUMxQixhQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQyxHQUNoQjtNQUNUO0FBQ0MsZ0JBQVMsRUFBQyxzRUFBc0U7QUFDaEYsV0FBSSxFQUFDLFFBQVE7QUFDYixjQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQztBQUN6QixjQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQUFBQztBQUMxQixhQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQyxHQUNoQjtNQUNKO0tBQ0Q7SUFDTjs7T0FBRyxTQUFTLEVBQUMsYUFBYSxFQUFDLEdBQUcsRUFBQyxPQUFPO0tBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO0tBQUs7SUFDeEQsQ0FBQztHQUNQOzs7UUF2SkksYUFBYTs7O0FBMEpuQixhQUFhLENBQUMsU0FBUyxHQUFHO0FBQ3pCLEtBQUksRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUM1QixRQUFPLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDL0IsV0FBVSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQ2xDLE1BQUssRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUM3QixhQUFZLEVBQUUsbUJBQU0sU0FBUyxDQUFDLEtBQUssQ0FBQztBQUNuQyxTQUFPLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDL0IsVUFBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0VBQ2hDLENBQUM7QUFDRixpQkFBZ0IsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUN0QyxhQUFZLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDbEMsZUFBYyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ3BDLGFBQVksRUFBRSxtQkFBTSxTQUFTLENBQUMsS0FBSztBQUNuQyxlQUFjLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDcEMsV0FBVSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0NBQ2hDLENBQUM7O3FCQUVhLGFBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JDaExkLFFBQVE7Ozs7cUJBQ0osT0FBTzs7Ozs2QkFDQyxrQkFBa0I7Ozs7K0JBQ2hCLG9CQUFvQjs7OztvQ0FDZiwwQkFBMEI7Ozs7NkJBQ2pDLGtCQUFrQjs7Ozt5QkFDdEIsY0FBYzs7OztBQUVwQyxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0FBQ3hDLFFBQU8sVUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQ2hCLE1BQUksU0FBUyxLQUFLLEtBQUssRUFBRTtBQUN4QixPQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDeEIsV0FBTyxDQUFDLENBQUMsQ0FBQztJQUNWOztBQUVELE9BQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN4QixXQUFPLENBQUMsQ0FBQztJQUNUO0dBQ0QsTUFBTTtBQUNOLE9BQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN4QixXQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ1Y7O0FBRUQsT0FBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3hCLFdBQU8sQ0FBQyxDQUFDO0lBQ1Q7R0FDRDs7QUFFRCxTQUFPLENBQUMsQ0FBQztFQUNULENBQUM7Q0FDRjs7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFOzs7QUFDbEMsS0FBSSxVQUFVLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFakQsUUFBTyxZQUFNO0FBQ1osTUFBSSxPQUFPLEdBQUcsTUFBSyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUk7VUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVE7R0FBQSxDQUFDLENBQUM7QUFDdEUsTUFBSSxLQUFLLEdBQUcsTUFBSyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUk7VUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVE7R0FBQSxDQUFDLENBQUM7O0FBRXBFLFFBQUssUUFBUSxDQUFDO0FBQ2IsVUFBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDaEUsQ0FBQyxDQUFDO0VBQ0gsQ0FBQTtDQUNEOzs7OztBQUdXLG1CQUFDLEtBQUssRUFBRTs7Ozs7QUFDbEIsa0ZBQU0sS0FBSyxFQUFFOztBQUViLE1BQUksQ0FBQyxLQUFLLEdBQUc7QUFDWixVQUFPLEVBQUUsQ0FBQztBQUNWLFVBQU8sRUFBRSxFQUFFO0FBQ1gsa0JBQWUsRUFBRSxFQUFFO0FBQ25CLFlBQVMsRUFBRSxJQUFJO0dBQ2YsQ0FBQzs7QUFFRixNQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV0QyxNQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNuQixNQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzs7QUFFdkIsTUFBSSxDQUFDLE9BQU8sR0FBRyxDQUNkO0FBQ0MsVUFBTyxFQUFFLE9BQU87QUFDaEIsY0FBVyxFQUFFLEtBQUs7QUFDbEIsVUFBTyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLG9DQUFvQyxDQUFDO0FBQ3pELFdBQVEsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDO0dBQzVDLEVBQ0Q7QUFDQyxVQUFPLEVBQUUsT0FBTztBQUNoQixjQUFXLEVBQUUsTUFBTTtBQUNuQixVQUFPLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMscUNBQXFDLENBQUM7QUFDMUQsV0FBUSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7R0FDN0MsRUFDRDtBQUNDLFVBQU8sRUFBRSxTQUFTO0FBQ2xCLGNBQVcsRUFBRSxNQUFNO0FBQ25CLFVBQU8sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQ0FBb0MsQ0FBQztBQUN6RCxXQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQztHQUMvQyxFQUNEO0FBQ0MsVUFBTyxFQUFFLFNBQVM7QUFDbEIsY0FBVyxFQUFFLEtBQUs7QUFDbEIsVUFBTyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO0FBQ3hELFdBQVEsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDO0dBQzlDLENBQ0QsQ0FBQzs7QUFFRixNQUFJLENBQUMsU0FBUyxHQUFHO0FBQ2hCLGlCQUFjLEVBQUUsc0JBQUMsSUFBSSxFQUFLO0FBQ3pCLFdBQUssUUFBUSxDQUFDO0FBQ2IsWUFBTyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ25CLFlBQU8sRUFBRSxJQUFJLENBQUMsS0FBSztLQUNuQixDQUFDLENBQUM7SUFDSDtBQUNELGVBQVksRUFBRSxvQkFBQyxJQUFJLEVBQUs7QUFDdkIsV0FBSyxRQUFRLENBQUM7QUFDYixZQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUs7QUFDbkIsWUFBTyxFQUFFLE9BQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUM1QyxDQUFDLENBQUM7SUFDSDtBQUNELG1CQUFnQixFQUFFLHdCQUFDLElBQUksRUFBSztBQUMzQixXQUFLLFFBQVEsQ0FBQztBQUNiLFlBQU8sRUFBRSxJQUFJLENBQUMsS0FBSztBQUNuQixZQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUs7S0FDbkIsQ0FBQyxDQUFDO0lBQ0g7QUFDRCxpQkFBYyxFQUFFLHNCQUFDLElBQUksRUFBSztBQUN6QixXQUFLLFFBQVEsQ0FBQztBQUNiLFlBQU8sRUFBRSxPQUFLLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQztBQUM3QixZQUFPLEVBQUUsT0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBSztBQUMxQyxhQUFPLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDO01BQ3hCLENBQUM7S0FDRixDQUFDLENBQUM7SUFDSDtBQUNELGVBQVksRUFBRSxvQkFBQyxFQUFFLEVBQUUsTUFBTSxFQUFLO0FBQzdCLFFBQUksS0FBSyxHQUFHLE9BQUssS0FBSyxDQUFDLEtBQUssQ0FBQzs7QUFFN0IsU0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN2QixTQUFJLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMxQixVQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFDaEM7S0FDRCxDQUFDLENBQUM7O0FBRUgsV0FBSyxRQUFRLENBQUM7QUFDYixZQUFPLEVBQUUsS0FBSztBQUNkLGNBQVMsRUFBRSxLQUFLO0tBQ2hCLENBQUMsQ0FBQztJQUNIO0dBQ0QsQ0FBQzs7QUFFRixNQUFJLENBQUMsSUFBSSxDQUNSLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsY0FBYyxFQUNkLFlBQVksRUFDWixjQUFjLEVBQ2QsYUFBYSxFQUNiLGFBQWEsRUFDYixZQUFZLEVBQ1osVUFBVSxFQUNWLGtCQUFrQixDQUNsQixDQUFDO0VBQ0Y7Ozs7U0FFZ0IsNkJBQUc7QUFDbkIsUUFBSyxJQUFJLE1BQUssSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2pDLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3BEOztBQUVELE9BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUU7QUFDNUQsUUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzNDLE1BQU07QUFDTixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM1QjtHQUNEOzs7U0FFbUIsZ0NBQUc7QUFDdEIsUUFBSyxJQUFJLE9BQUssSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2pDLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2hFO0dBQ0Q7OztTQUVpQiw4QkFBRztBQUNwQixPQUFJLE9BQU8sR0FBRyx5QkFBRSxtQkFBTSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUM7T0FDeEUsT0FBTyxHQUFHLHlCQUFFLDhCQUE4QixDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDOztBQUUxRCxPQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUM1QixRQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7QUFFbkQsNkJBQUUsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ2pCLFNBQUksRUFBRSxPQUFPO0tBQ2IsQ0FBQyxDQUFDO0lBQ0g7Ozs7QUFJRCxVQUFPLENBQUMsTUFBTSxDQUFDO0FBQ2QsMkJBQXVCLEVBQUUsSUFBSTtBQUM3Qiw4QkFBMEIsRUFBRSxFQUFFO0lBQzlCLENBQUMsQ0FBQzs7O0FBR0gsVUFBTyxDQUFDLE1BQU0sQ0FBQztXQUFNLG1CQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQUEsQ0FBQyxDQUFDO0dBQzFGOzs7U0FFWSx5QkFBRztBQUNmLE9BQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzVCLFdBQU87OztBQUNOLGVBQVMsRUFBQyxvRkFBb0Y7QUFDOUYsYUFBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEFBQUM7QUFDMUIsU0FBRyxFQUFDLFlBQVk7S0FBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztLQUFVLENBQUM7SUFDbEU7O0FBRUQsVUFBTyxJQUFJLENBQUM7R0FDWjs7O1NBRXNCLG1DQUFHO0FBQ3pCLE9BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN4QyxXQUFPO0FBQ04sWUFBTyxFQUFFLHVCQUFVLFlBQVksQUFBQztBQUNoQyxnQkFBVyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLDRDQUE0QyxDQUFDLEFBQUM7QUFDdEUsWUFBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUFDO0FBQzVCLHFCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQUFBQyxHQUFHLENBQUM7SUFDN0M7O0FBRUQsVUFBTyxJQUFJLENBQUM7R0FDWjs7O1NBRVkseUJBQUc7QUFDZixPQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUMvQyxXQUFPOzs7QUFDTixlQUFTLEVBQUMscUJBQXFCO0FBQy9CLGFBQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxBQUFDO0tBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsNEJBQTRCLENBQUM7S0FBVSxDQUFDO0lBQ2hGOztBQUVELFVBQU8sSUFBSSxDQUFDO0dBQ1o7OztTQUVlLDRCQUFHO0FBQ2xCLFVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7R0FDaEM7OztTQUVLLGtCQUFHOzs7QUFDUixPQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3ZCLFdBQU87O09BQUssU0FBUyxFQUFDLFNBQVM7S0FDOUI7QUFDQyxVQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEFBQUM7QUFDekIsZ0JBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxBQUFDO0FBQzVCLGNBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxBQUFDLEdBQUc7S0FDdkIsQ0FBQztJQUNQOztBQUVELFVBQU87O01BQUssU0FBUyxFQUFDLFNBQVM7SUFDN0IsSUFBSSxDQUFDLGFBQWEsRUFBRTtJQUNwQixJQUFJLENBQUMsdUJBQXVCLEVBQUU7SUFDL0I7O09BQUssU0FBUyxFQUFDLGlDQUFpQztLQUMvQzs7UUFBUSxTQUFTLEVBQUMsa0NBQWtDLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLEFBQUM7TUFDeEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFLO0FBQ2hDLGNBQU87O1VBQVEsR0FBRyxFQUFFLENBQUMsQUFBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxBQUFDO1FBQUUsTUFBTSxDQUFDLEtBQUs7UUFBVSxDQUFDO09BQ3ZFLENBQUM7TUFDTTtLQUNKO0lBQ047O09BQUssU0FBUyxFQUFDLGdCQUFnQjtLQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFLO0FBQ2xDLGFBQU8sd0VBQWUsR0FBRyxFQUFFLENBQUMsQUFBQyxJQUFLLElBQUk7QUFDckMsaUJBQVUsRUFBRSx1QkFBVSxnQkFBZ0IsQUFBQztBQUN2QyxtQkFBWSxFQUFFLE9BQUssWUFBWSxBQUFDO0FBQ2hDLGlCQUFVLEVBQUUsdUJBQVUsZ0JBQWdCLEFBQUM7QUFDdkMsbUJBQVksRUFBRSxPQUFLLFlBQVksQUFBQztBQUNoQyxpQkFBVSxFQUFFLE9BQUssVUFBVSxBQUFDO0FBQzVCLHFCQUFjLEVBQUUsT0FBSyxjQUFjLEFBQUM7QUFDcEMsZUFBUSxFQUFFLE9BQUssS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxBQUFDLElBQUcsQ0FBQztNQUM5RCxDQUFDO0tBQ0c7SUFDTjs7T0FBSyxTQUFTLEVBQUMsZUFBZTtLQUM1QixJQUFJLENBQUMsYUFBYSxFQUFFO0tBQ2hCO0lBQ0QsQ0FBQztHQUNQOzs7U0FFTyxvQkFBRztBQUNWLE9BQUksQ0FBQyxRQUFRLENBQUM7QUFDYixhQUFTLEVBQUUsSUFBSTtJQUNmLENBQUMsQ0FBQztHQUNIOzs7U0FFVyxzQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3pCLFFBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7QUFFeEIsT0FBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWE7T0FDL0MsU0FBUyxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRWhELE9BQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ25CLHFCQUFpQixDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkMsTUFBTTtBQUNOLHFCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEM7O0FBRUQsT0FBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLG1CQUFlLEVBQUUsaUJBQWlCO0lBQ2xDLENBQUMsQ0FBQztHQUNIOzs7U0FFVyxzQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3pCLE9BQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsRUFBRTtBQUMzRCxRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sVUFBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuQzs7QUFFRCxRQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7R0FDeEI7OztTQUVTLG9CQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDdkIsT0FBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLGFBQVMsRUFBRSxJQUFJO0lBQ2YsQ0FBQyxDQUFDOztBQUVILFFBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztHQUN4Qjs7O1NBRWEsd0JBQUMsSUFBSSxFQUFFO0FBQ3BCLE9BQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUUzQyxPQUFJLENBQUMsUUFBUSxDQUFDO0FBQ2IsbUJBQWUsRUFBRSxFQUFFO0lBQ25CLENBQUMsQ0FBQTtHQUNGOzs7U0FFUyxvQkFBQyxNQUFNLEVBQUU7QUFDbEIsT0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUIsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3BDOzs7U0FFVSxxQkFBQyxLQUFLLEVBQUU7QUFDbEIsUUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUV4QixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFMUIsUUFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0dBQ3ZCOzs7U0FFVSxxQkFBQyxLQUFLLEVBQUU7QUFDbEIsT0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDNUIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25FOztBQUVELE9BQUksQ0FBQyxRQUFRLENBQUM7QUFDYixtQkFBZSxFQUFFLEVBQUU7SUFDbkIsQ0FBQyxDQUFBOztBQUVGLFFBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztHQUN2Qjs7O1NBRVMsb0JBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDNUIsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFbkMsUUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLFFBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztHQUN2Qjs7Ozs7Ozs7Ozs7Ozs7O3FCQ3JWYTtBQUNkLG1CQUFrQixFQUFFLEdBQUc7QUFDdkIsa0JBQWlCLEVBQUUsR0FBRztBQUN0QixtQkFBa0IsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDNUIsZUFBYyxFQUFFLENBQ2Y7QUFDQyxPQUFLLEVBQUUsUUFBUTtBQUNmLE9BQUssRUFBRSxRQUFRO0FBQ2YsYUFBVyxFQUFFLElBQUk7RUFDakIsQ0FDRDtDQUNEOzs7Ozs7OztzQkNYYSxRQUFROzs7O3FCQUNKLE9BQU87Ozs7eUNBQ0ksK0JBQStCOzs7O2tDQUNwQyx3QkFBd0I7Ozs7QUFFaEQsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3JCLEtBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFNUMsS0FBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyQixPQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM1Qjs7QUFFRCxLQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwQyxNQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxQyxNQUFJLE1BQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwQyxNQUFJLGtCQUFrQixDQUFDLE1BQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtBQUMxQyxVQUFPLGtCQUFrQixDQUFDLE1BQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3BDO0VBQ0Q7O0FBRUQsUUFBTyxJQUFJLENBQUM7Q0FDWjs7QUFFRCx5QkFBRSxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMzQixRQUFPLEVBQUUsaUJBQVk7QUFDcEIsTUFBSSxLQUFLLEdBQUc7QUFDWCxTQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQztBQUN2RCxtQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLG1DQUFtQyxDQUFDO0dBQzNFLENBQUM7O0FBRUYsTUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtBQUN4QixVQUFPO0dBQ1A7O0FBRUQsTUFBSSxPQUFPLEdBQUcseUJBQUUsa0JBQWtCLENBQUMsQ0FBQzs7QUFFcEMsTUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtBQUNoRSxVQUFPLENBQUMsTUFBTSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7R0FDM0Q7O0FBRUQsT0FBSyxDQUFDLE9BQU8sR0FBRyxnQ0FBWSxNQUFNLENBQ2pDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsK0JBQStCLENBQUMsRUFDckQsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQywrQkFBK0IsQ0FBQyxFQUNyRCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLCtCQUErQixDQUFDLEVBQ3JELElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUMsRUFDaEQsT0FBTyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUMvQyxDQUFDOztBQUVGLE9BQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUNqQixRQUFRLEVBQ1IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUNqQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFDeEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUNuQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFDeEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUN0QixNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FDOUIsQ0FBQzs7QUFFRixPQUFLLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDOztBQUVuRSxxQkFBTSxNQUFNLENBQ1gseUVBQXNCLEtBQUssQ0FBSSxFQUMvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQ1AsQ0FBQztFQUNGO0NBQ0QsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgRXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVCYWNrZW5kIGV4dGVuZHMgRXZlbnRzIHtcblx0c3RhdGljIGNyZWF0ZSguLi5wYXJhbWV0ZXJzKSB7XG5cdFx0cmV0dXJuIG5ldyBGaWxlQmFja2VuZCguLi5wYXJhbWV0ZXJzKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKHNlYXJjaF91cmwsIHVwZGF0ZV91cmwsIGRlbGV0ZV91cmwsIGxpbWl0LCAkZm9sZGVyKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuc2VhcmNoX3VybCA9IHNlYXJjaF91cmw7XG5cdFx0dGhpcy51cGRhdGVfdXJsID0gdXBkYXRlX3VybDtcblx0XHR0aGlzLmRlbGV0ZV91cmwgPSBkZWxldGVfdXJsO1xuXHRcdHRoaXMubGltaXQgPSBsaW1pdDtcblx0XHR0aGlzLiRmb2xkZXIgPSAkZm9sZGVyO1xuXG5cdFx0dGhpcy5wYWdlID0gMTtcblx0fVxuXG5cdHNlYXJjaCgpIHtcblx0XHR0aGlzLnBhZ2UgPSAxO1xuXG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLnNlYXJjaF91cmwpLnRoZW4oKGpzb24pID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25TZWFyY2hEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRtb3JlKCkge1xuXHRcdHRoaXMucGFnZSsrO1xuXG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLnNlYXJjaF91cmwpLnRoZW4oKGpzb24pID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25Nb3JlRGF0YScsIGpzb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0bmF2aWdhdGUoZm9sZGVyKSB7XG5cdFx0dGhpcy5wYWdlID0gMTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblxuXHRcdHRoaXMucGVyc2lzdEZvbGRlckZpbHRlcihmb2xkZXIpO1xuXG5cdFx0dGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLnNlYXJjaF91cmwpLnRoZW4oKGpzb24pID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25OYXZpZ2F0ZURhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdHBlcnNpc3RGb2xkZXJGaWx0ZXIoZm9sZGVyKSB7XG5cdFx0aWYgKGZvbGRlci5zdWJzdHIoLTEpID09PSAnLycpIHtcblx0XHRcdGZvbGRlciA9IGZvbGRlci5zdWJzdHIoMCwgZm9sZGVyLmxlbmd0aCAtIDEpO1xuXHRcdH1cblxuXHRcdHRoaXMuJGZvbGRlci52YWwoZm9sZGVyKTtcblx0fVxuXG5cdGRlbGV0ZShpZHMpIHtcblx0XHR2YXIgZmlsZXNUb0RlbGV0ZSA9IFtdO1xuXG5cdFx0Ly8gQWxsb3dzIHVzZXJzIHRvIHBhc3Mgb25lIG9yIG1vcmUgaWRzIHRvIGRlbGV0ZS5cblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlkcykgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcblx0XHRcdGZpbGVzVG9EZWxldGUucHVzaChpZHMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmaWxlc1RvRGVsZXRlID0gaWRzO1xuXHRcdH1cblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5kZWxldGVfdXJsLCB7XG5cdFx0XHQnaWRzJzogZmlsZXNUb0RlbGV0ZVxuXHRcdH0pLnRoZW4oKCkgPT4ge1xuXHRcdFx0Zm9yIChsZXQgaWQgb2YgZmlsZXNUb0RlbGV0ZSkge1xuXHRcdFx0XHR0aGlzLmVtaXQoJ29uRGVsZXRlRGF0YScsIGlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZpbHRlcihuYW1lLCB0eXBlLCBmb2xkZXIsIGNyZWF0ZWRGcm9tLCBjcmVhdGVkVG8sIG9ubHlTZWFyY2hJbkZvbGRlcikge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblx0XHR0aGlzLmNyZWF0ZWRGcm9tID0gY3JlYXRlZEZyb207XG5cdFx0dGhpcy5jcmVhdGVkVG8gPSBjcmVhdGVkVG87XG5cdFx0dGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIgPSBvbmx5U2VhcmNoSW5Gb2xkZXI7XG5cblx0XHR0aGlzLnNlYXJjaCgpO1xuXHR9XG5cblx0c2F2ZShpZCwgdmFsdWVzKSB7XG5cdFx0dmFsdWVzWydpZCddID0gaWQ7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ1BPU1QnLCB0aGlzLnVwZGF0ZV91cmwsIHZhbHVlcykudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uU2F2ZURhdGEnLCBpZCwgdmFsdWVzKTtcblx0XHR9KTtcblx0fVxuXG5cdHJlcXVlc3QobWV0aG9kLCB1cmwsIGRhdGEgPSB7fSkge1xuXHRcdGxldCBkZWZhdWx0cyA9IHtcblx0XHRcdCdsaW1pdCc6IHRoaXMubGltaXQsXG5cdFx0XHQncGFnZSc6IHRoaXMucGFnZSxcblx0XHR9O1xuXG5cdFx0aWYgKHRoaXMubmFtZSAmJiB0aGlzLm5hbWUudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMubmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm5hbWUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmZvbGRlciAmJiB0aGlzLmZvbGRlci50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5mb2xkZXIgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5mb2xkZXIpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRGcm9tICYmIHRoaXMuY3JlYXRlZEZyb20udHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuY3JlYXRlZEZyb20gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkRnJvbSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY3JlYXRlZFRvICYmIHRoaXMuY3JlYXRlZFRvLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRUbyA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLmNyZWF0ZWRUbyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMub25seVNlYXJjaEluRm9sZGVyICYmIHRoaXMub25seVNlYXJjaEluRm9sZGVyLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm9ubHlTZWFyY2hJbkZvbGRlciA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5zaG93TG9hZGluZ0luZGljYXRvcigpO1xuXG5cdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHQndXJsJzogdXJsLFxuXHRcdFx0J21ldGhvZCc6IG1ldGhvZCxcblx0XHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHRcdCdkYXRhJzogJC5leHRlbmQoZGVmYXVsdHMsIGRhdGEpXG5cdFx0fSkuYWx3YXlzKCgpID0+IHtcblx0XHRcdHRoaXMuaGlkZUxvYWRpbmdJbmRpY2F0b3IoKTtcblx0XHR9KTtcblx0fVxuXG5cdHNob3dMb2FkaW5nSW5kaWNhdG9yKCkge1xuXHRcdCQoJy5jbXMtY29udGVudCwgLnVpLWRpYWxvZycpLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cdFx0JCgnLnVpLWRpYWxvZy1jb250ZW50JykuY3NzKCdvcGFjaXR5JywgJy4xJyk7XG5cdH1cblxuXHRoaWRlTG9hZGluZ0luZGljYXRvcigpIHtcblx0XHQkKCcuY21zLWNvbnRlbnQsIC51aS1kaWFsb2cnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXHRcdCQoJy51aS1kaWFsb2ctY29udGVudCcpLmNzcygnb3BhY2l0eScsICcxJyk7XG5cdH1cbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblx0YmluZCguLi5tZXRob2RzKSB7XG5cdFx0bWV0aG9kcy5mb3JFYWNoKChtZXRob2QpID0+IHRoaXNbbWV0aG9kXSA9IHRoaXNbbWV0aG9kXS5iaW5kKHRoaXMpKTtcblx0fVxufVxuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL2Jhc2UtY29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVsa0FjdGlvbnNDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcblxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuYmluZChcblx0XHRcdCdvbkNoYW5nZVZhbHVlJ1xuXHRcdCk7XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR2YXIgJHNlbGVjdCA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5kcm9wZG93bicpLFxuXHRcdFx0bGVmdFZhbCA9IGxlZnRWYWwgPSAkKCcuY21zLWNvbnRlbnQtdG9vbGJhcjp2aXNpYmxlJykud2lkdGgoKSArIDEyLFxuXHRcdFx0YmFja0J1dHRvbiA9ICQoJy5nYWxsZXJ5IC5mb250LWljb24tbGV2ZWwtdXAnKTtcblxuXHRcdGlmIChiYWNrQnV0dG9uLmxlbmd0aCA+IDApIHtcblx0XHRcdGxlZnRWYWwgKz0gYmFja0J1dHRvbi53aWR0aCgpICsgMjQ7XG5cdFx0fVxuXG5cdFx0JChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkuY3NzKHtcblx0XHRcdGxlZnQ6IGxlZnRWYWxcblx0XHR9KTtcblxuXHRcdCRzZWxlY3QuY2hvc2VuKHtcblx0XHRcdCdhbGxvd19zaW5nbGVfZGVzZWxlY3QnOiB0cnVlLFxuXHRcdFx0J2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCc6IDIwXG5cdFx0fSk7XG5cblx0XHQvLyBDaG9zZW4gc3RvcHMgdGhlIGNoYW5nZSBldmVudCBmcm9tIHJlYWNoaW5nIFJlYWN0IHNvIHdlIGhhdmUgdG8gc2ltdWxhdGUgYSBjbGljay5cblx0XHQkc2VsZWN0LmNoYW5nZSgoKSA9PiBSZWFjdC5hZGRvbnMuVGVzdFV0aWxzLlNpbXVsYXRlLmNsaWNrKCRzZWxlY3QuZmluZCgnOnNlbGVjdGVkJylbMF0pKTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5X19idWxrIGZpZWxkaG9sZGVyLXNtYWxsXCI+XG5cdFx0XHQ8c2VsZWN0IGNsYXNzTmFtZT1cImRyb3Bkb3duIG5vLWNoYW5nZS10cmFjayBuby1jaHpuXCIgdGFiSW5kZXg9XCIwXCIgZGF0YS1wbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZWhvbGRlcn0gc3R5bGU9e3t3aWR0aDogJzE2MHB4J319PlxuXHRcdFx0XHQ8b3B0aW9uIHNlbGVjdGVkIGRpc2FibGVkIGhpZGRlbiB2YWx1ZT0nJz48L29wdGlvbj5cblx0XHRcdFx0e3RoaXMucHJvcHMub3B0aW9ucy5tYXAoKG9wdGlvbiwgaSkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiA8b3B0aW9uIGtleT17aX0gb25DbGljaz17dGhpcy5vbkNoYW5nZVZhbHVlfSB2YWx1ZT17b3B0aW9uLnZhbHVlfT57b3B0aW9uLmxhYmVsfTwvb3B0aW9uPjtcblx0XHRcdFx0fSl9XG5cdFx0XHQ8L3NlbGVjdD5cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRnZXRPcHRpb25CeVZhbHVlKHZhbHVlKSB7XG5cdFx0Zm9yIChsZXQgb3B0aW9uIG9mIHRoaXMucHJvcHMub3B0aW9ucykge1xuXHRcdFx0aWYgKG9wdGlvbi52YWx1ZSA9PT0gdmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIG9wdGlvbjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGFwcGx5QWN0aW9uKHZhbHVlKSB7XG5cdFx0Ly8gV2Ugb25seSBoYXZlICdkZWxldGUnIHJpZ2h0IG5vdy4uLlxuXHRcdHN3aXRjaCAodmFsdWUpIHtcblx0XHRcdGNhc2UgJ2RlbGV0ZSc6XG5cdFx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5kZWxldGUodGhpcy5wcm9wcy5nZXRTZWxlY3RlZEZpbGVzKCkpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdG9uQ2hhbmdlVmFsdWUoZXZlbnQpIHtcblx0XHR2YXIgb3B0aW9uID0gdGhpcy5nZXRPcHRpb25CeVZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG5cblx0XHQvLyBNYWtlIHN1cmUgYSB2YWxpZCBvcHRpb24gaGFzIGJlZW4gc2VsZWN0ZWQuXG5cdFx0aWYgKG9wdGlvbiA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb24uZGVzdHJ1Y3RpdmUgPT09IHRydWUpIHtcblx0XHRcdGlmIChjb25maXJtKHNzLmkxOG4uc3ByaW50Zihzcy5pMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5CVUxLX0FDVElPTlNfQ09ORklSTScpLCBvcHRpb24ubGFiZWwpKSkge1xuXHRcdFx0XHR0aGlzLmFwcGx5QWN0aW9uKG9wdGlvbi52YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYXBwbHlBY3Rpb24ob3B0aW9uLnZhbHVlKTtcblx0XHR9XG5cblx0XHQvLyBSZXNldCB0aGUgZHJvcGRvd24gdG8gaXQncyBwbGFjZWhvbGRlciB2YWx1ZS5cblx0XHQkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKCcuZHJvcGRvd24nKS52YWwoJycpLnRyaWdnZXIoJ2xpc3p0OnVwZGF0ZWQnKTtcblx0fVxufTtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9iYXNlLWNvbXBvbmVudCc7XG5cbmNsYXNzIEVkaXRvckNvbXBvbmVudCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuc3RhdGUgPSB7XG5cdFx0XHQndGl0bGUnOiB0aGlzLnByb3BzLmZpbGUudGl0bGUsXG5cdFx0XHQnYmFzZW5hbWUnOiB0aGlzLnByb3BzLmZpbGUuYmFzZW5hbWVcblx0XHR9O1xuXG5cdFx0dGhpcy5maWVsZHMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdCdsYWJlbCc6ICdUaXRsZScsXG5cdFx0XHRcdCduYW1lJzogJ3RpdGxlJyxcblx0XHRcdFx0J3ZhbHVlJzogdGhpcy5wcm9wcy5maWxlLnRpdGxlLFxuXHRcdFx0XHQnb25DaGFuZ2UnOiAoZXZlbnQpID0+IHRoaXMub25GaWVsZENoYW5nZSgndGl0bGUnLCBldmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCdsYWJlbCc6ICdGaWxlbmFtZScsXG5cdFx0XHRcdCduYW1lJzogJ2Jhc2VuYW1lJyxcblx0XHRcdFx0J3ZhbHVlJzogdGhpcy5wcm9wcy5maWxlLmJhc2VuYW1lLFxuXHRcdFx0XHQnb25DaGFuZ2UnOiAoZXZlbnQpID0+IHRoaXMub25GaWVsZENoYW5nZSgnYmFzZW5hbWUnLCBldmVudClcblx0XHRcdH1cblx0XHRdO1xuXG5cdFx0dGhpcy5iaW5kKCdvbkZpZWxkQ2hhbmdlJywgJ29uRmlsZVNhdmUnLCAnb25DYW5jZWwnKTtcblx0fVxuXG5cdG9uRmllbGRDaGFuZ2UobmFtZSwgZXZlbnQpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFtuYW1lXTogZXZlbnQudGFyZ2V0LnZhbHVlXG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbGVTYXZlKGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5vbkZpbGVTYXZlKHRoaXMucHJvcHMuZmlsZS5pZCwgdGhpcy5zdGF0ZSwgZXZlbnQpO1xuXHR9XG5cblx0b25DYW5jZWwoZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLm9uQ2FuY2VsKGV2ZW50KTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2VkaXRvcic+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8gbm9sYWJlbCc+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1wcmV2aWV3IG5vbGFiZWwnPlxuXHRcdFx0XHRcdDxpbWcgY2xhc3NOYW1lPSd0aHVtYm5haWwtcHJldmlldycgc3JjPXt0aGlzLnByb3BzLmZpbGUudXJsfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvLWRhdGEgbm9sYWJlbCc+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBub2xhYmVsJz5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntzcy5pMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5UWVBFJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUudHlwZX08L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntzcy5pMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5TSVpFJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5zaXplfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57c3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuVVJMJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+XG5cdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj17dGhpcy5wcm9wcy5maWxlLnVybH0gdGFyZ2V0PSdfYmxhbmsnPnt0aGlzLnByb3BzLmZpbGUudXJsfTwvYT5cblx0XHRcdFx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkNSRUFURUQnKX06PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmNyZWF0ZWR9PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkxBU1RFRElUJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5sYXN0VXBkYXRlZH08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRJTScpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuYXR0cmlidXRlcy5kaW1lbnNpb25zLndpZHRofSB4IHt0aGlzLnByb3BzLmZpbGUuYXR0cmlidXRlcy5kaW1lbnNpb25zLmhlaWdodH1weDwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0e3RoaXMuZmllbGRzLm1hcCgoZmllbGQsIGkpID0+IHtcblx0XHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCB0ZXh0JyBrZXk9e2l9PlxuXHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntmaWVsZC5sYWJlbH08L2xhYmVsPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0PGlucHV0IGNsYXNzTmFtZT1cInRleHRcIiB0eXBlPSd0ZXh0JyBvbkNoYW5nZT17ZmllbGQub25DaGFuZ2V9IHZhbHVlPXt0aGlzLnN0YXRlW2ZpZWxkLm5hbWVdfSAvPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdH0pfVxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdHR5cGU9J3N1Ym1pdCdcblx0XHRcdFx0XHRjbGFzc05hbWU9XCJzcy11aS1idXR0b24gdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNoZWNrLW1hcmtcIlxuXHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25GaWxlU2F2ZX0+XG5cdFx0XHRcdFx0e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlNBVkUnKX1cblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHR0eXBlPSdidXR0b24nXG5cdFx0XHRcdFx0Y2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWJ1dHRvbiB1aS13aWRnZXQgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsIGZvbnQtaWNvbi1jYW5jZWwtY2lyY2xlZFwiXG5cdFx0XHRcdFx0b25DbGljaz17dGhpcy5vbkNhbmNlbH0+XG5cdFx0XHRcdFx0e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkNBTkNFTCcpfVxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2Pjtcblx0fVxufVxuXG5FZGl0b3JDb21wb25lbnQucHJvcFR5cGVzID0ge1xuXHQnZmlsZSc6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0J2lkJzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0XHQndGl0bGUnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdCdiYXNlbmFtZSc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0J3VybCc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0J3NpemUnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdCdjcmVhdGVkJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHQnbGFzdFVwZGF0ZWQnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdCdkaW1lbnNpb25zJzogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcblx0XHRcdCd3aWR0aCc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdFx0XHQnaGVpZ2h0JzogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxuXHRcdH0pXG5cdH0pLFxuXHQnb25GaWxlU2F2ZSc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQnb25DYW5jZWwnOlJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBFZGl0b3JDb21wb25lbnQ7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vYmFzZS1jb21wb25lbnQnO1xuXG5jbGFzcyBGaWxlQ29tcG9uZW50IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdCdmb2N1c3NlZCc6IGZhbHNlXG5cdFx0fTtcblxuXHRcdHRoaXMuYmluZChcblx0XHRcdCdvbkZpbGVOYXZpZ2F0ZScsXG5cdFx0XHQnb25GaWxlRWRpdCcsXG5cdFx0XHQnb25GaWxlRGVsZXRlJyxcblx0XHRcdCdvbkZpbGVTZWxlY3QnLFxuXHRcdFx0J2hhbmRsZURvdWJsZUNsaWNrJyxcblx0XHRcdCdoYW5kbGVLZXlEb3duJyxcblx0XHRcdCdoYW5kbGVGb2N1cycsXG5cdFx0XHQnaGFuZGxlQmx1cicsXG5cdFx0XHQnb25GaWxlU2VsZWN0J1xuXHRcdCk7XG5cdH1cblxuXHRoYW5kbGVEb3VibGVDbGljayhldmVudCkge1xuXHRcdGlmIChldmVudC50YXJnZXQgIT09IHRoaXMucmVmcy50aXRsZS5nZXRET01Ob2RlKCkgJiYgZXZlbnQudGFyZ2V0ICE9PSB0aGlzLnJlZnMudGh1bWJuYWlsLmdldERPTU5vZGUoKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMub25GaWxlTmF2aWdhdGUoZXZlbnQpO1xuXHR9XG5cblx0b25GaWxlTmF2aWdhdGUoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5pc0ZvbGRlcigpKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uRmlsZU5hdmlnYXRlKHRoaXMucHJvcHMsIGV2ZW50KVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMub25GaWxlRWRpdChldmVudCk7XG5cdH1cblxuXHRvbkZpbGVTZWxlY3QoZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgLy9zdG9wIHRyaWdnZXJpbmcgY2xpY2sgb24gcm9vdCBlbGVtZW50XG5cdFx0dGhpcy5wcm9wcy5vbkZpbGVTZWxlY3QodGhpcy5wcm9wcywgZXZlbnQpO1xuXHR9XG5cblx0b25GaWxlRWRpdChldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyAvL3N0b3AgdHJpZ2dlcmluZyBjbGljayBvbiByb290IGVsZW1lbnRcblx0XHR0aGlzLnByb3BzLm9uRmlsZUVkaXQodGhpcy5wcm9wcywgZXZlbnQpO1xuXHR9XG5cblx0b25GaWxlRGVsZXRlKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vc3RvcCB0cmlnZ2VyaW5nIGNsaWNrIG9uIHJvb3QgZWxlbWVudFxuXHRcdHRoaXMucHJvcHMub25GaWxlRGVsZXRlKHRoaXMucHJvcHMsIGV2ZW50KVxuXHR9XG5cblx0aXNGb2xkZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMucHJvcHMuY2F0ZWdvcnkgPT09ICdmb2xkZXInO1xuXHR9XG5cblx0Z2V0VGh1bWJuYWlsU3R5bGVzKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmNhdGVnb3J5ID09PSAnaW1hZ2UnKSB7XG5cdFx0XHRyZXR1cm4geydiYWNrZ3JvdW5kSW1hZ2UnOiAndXJsKCcgKyB0aGlzLnByb3BzLnVybCArICcpJ307XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0Z2V0VGh1bWJuYWlsQ2xhc3NOYW1lcygpIHtcblx0XHR2YXIgdGh1bWJuYWlsQ2xhc3NOYW1lcyA9ICdpdGVtX190aHVtYm5haWwnO1xuXG5cdFx0aWYgKHRoaXMuaXNJbWFnZUxhcmdlclRoYW5UaHVtYm5haWwoKSkge1xuXHRcdFx0dGh1bWJuYWlsQ2xhc3NOYW1lcyArPSAnIGxhcmdlJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGh1bWJuYWlsQ2xhc3NOYW1lcztcblx0fVxuXG5cdGdldEl0ZW1DbGFzc05hbWVzKCkge1xuXHRcdHZhciBpdGVtQ2xhc3NOYW1lcyA9ICdpdGVtICcgKyB0aGlzLnByb3BzLmNhdGVnb3J5O1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuZm9jdXNzZWQpIHtcblx0XHRcdGl0ZW1DbGFzc05hbWVzICs9ICcgZm9jdXNzZWQnO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BzLnNlbGVjdGVkKSB7XG5cdFx0XHRpdGVtQ2xhc3NOYW1lcyArPSAnIHNlbGVjdGVkJztcblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbUNsYXNzTmFtZXM7XG5cdH1cblxuXHRpc0ltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpIHtcblx0XHRsZXQgZGltZW5zaW9ucyA9IHRoaXMucHJvcHMuYXR0cmlidXRlcy5kaW1lbnNpb25zO1xuXG5cdFx0cmV0dXJuIGRpbWVuc2lvbnMuaGVpZ2h0ID4gY29uc3RhbnRzLlRIVU1CTkFJTF9IRUlHSFQgfHwgZGltZW5zaW9ucy53aWR0aCA+IGNvbnN0YW50cy5USFVNQk5BSUxfV0lEVEg7XG5cdH1cblxuXHRoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHQvL2lmIGV2ZW50IGRvZXNuJ3QgY29tZSBmcm9tIHRoZSByb290IGVsZW1lbnQsIGRvIG5vdGhpbmdcblx0XHRpZiAoZXZlbnQudGFyZ2V0ICE9PSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vSWYgc3BhY2Ugb3IgZW50ZXIgaXMgcHJlc3NlZFxuXHRcdGlmICh0aGlzLnByb3BzLnNlbGVjdEtleXMuaW5kZXhPZihldmVudC5rZXlDb2RlKSA+IC0xKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvL1N0b3AgcGFnZSBmcm9tIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIGNsaWNrZWRcblx0XHRcdHRoaXMub25GaWxlTmF2aWdhdGUoKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVGb2N1cygpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdmb2N1c3NlZCc6IHRydWVcblx0XHR9KVxuXHR9XG5cblx0aGFuZGxlQmx1cigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdmb2N1c3NlZCc6IGZhbHNlXG5cdFx0fSlcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9e3RoaXMuZ2V0SXRlbUNsYXNzTmFtZXMoKX0gZGF0YS1pZD17dGhpcy5wcm9wcy5pZH0gdGFiSW5kZXg9XCIwXCIgb25LZXlEb3duPXt0aGlzLmhhbmRsZUtleURvd259IG9uRG91YmxlQ2xpY2s9e3RoaXMuaGFuZGxlRG91YmxlQ2xpY2t9PlxuXHRcdFx0PGRpdiByZWY9XCJ0aHVtYm5haWxcIiBjbGFzc05hbWU9e3RoaXMuZ2V0VGh1bWJuYWlsQ2xhc3NOYW1lcygpfSBzdHlsZT17dGhpcy5nZXRUaHVtYm5haWxTdHlsZXMoKX0gb25DbGljaz17dGhpcy5vbkZpbGVTZWxlY3R9PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naXRlbV9fYWN0aW9ucyc+XG5cdFx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1zZWxlY3QgWyBmb250LWljb24tdGljayBdJ1xuXHRcdFx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5vbkZpbGVTZWxlY3R9XG5cdFx0XHRcdFx0XHRvbkZvY3VzPXt0aGlzLmhhbmRsZUZvY3VzfVxuXHRcdFx0XHRcdFx0b25CbHVyPXt0aGlzLmhhbmRsZUJsdXJ9PlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHRcdGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tcmVtb3ZlIFsgZm9udC1pY29uLXRyYXNoIF0nXG5cdFx0XHRcdFx0XHR0eXBlPSdidXR0b24nXG5cdFx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uRmlsZURlbGV0ZX1cblx0XHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlRm9jdXN9XG5cdFx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn0+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1lZGl0IFsgZm9udC1pY29uLWVkaXQgXSdcblx0XHRcdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25GaWxlRWRpdH1cblx0XHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlRm9jdXN9XG5cdFx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn0+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8cCBjbGFzc05hbWU9J2l0ZW1fX3RpdGxlJyByZWY9XCJ0aXRsZVwiPnt0aGlzLnByb3BzLnRpdGxlfTwvcD5cblx0XHQ8L2Rpdj47XG5cdH1cbn1cblxuRmlsZUNvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG5cdCdpZCc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdCd0aXRsZSc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCdjYXRlZ29yeSc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCd1cmwnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHQnZGltZW5zaW9ucyc6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0J3dpZHRoJzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0XHQnaGVpZ2h0JzogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxuXHR9KSxcblx0J29uRmlsZU5hdmlnYXRlJzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCdvbkZpbGVFZGl0JzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCdvbkZpbGVEZWxldGUnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0J3NlbGVjdEtleXMnOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG5cdCdvbkZpbGVTZWxlY3QnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0J3NlbGVjdGVkJzogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVDb21wb25lbnQ7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGaWxlQ29tcG9uZW50IGZyb20gJy4vZmlsZS1jb21wb25lbnQnO1xuaW1wb3J0IEVkaXRvckNvbXBvbmVudCBmcm9tICcuL2VkaXRvci1jb21wb25lbnQnO1xuaW1wb3J0IEJ1bGtBY3Rpb25zQ29tcG9uZW50IGZyb20gJy4vYnVsay1hY3Rpb25zLWNvbXBvbmVudCc7XG5pbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL2Jhc2UtY29tcG9uZW50JztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxuZnVuY3Rpb24gZ2V0Q29tcGFyYXRvcihmaWVsZCwgZGlyZWN0aW9uKSB7XG5cdHJldHVybiAoYSwgYikgPT4ge1xuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdhc2MnKSB7XG5cdFx0XHRpZiAoYVtmaWVsZF0gPCBiW2ZpZWxkXSkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhW2ZpZWxkXSA+IGJbZmllbGRdKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoYVtmaWVsZF0gPiBiW2ZpZWxkXSkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhW2ZpZWxkXSA8IGJbZmllbGRdKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAwO1xuXHR9O1xufVxuXG5mdW5jdGlvbiBnZXRTb3J0KGZpZWxkLCBkaXJlY3Rpb24pIHtcblx0bGV0IGNvbXBhcmF0b3IgPSBnZXRDb21wYXJhdG9yKGZpZWxkLCBkaXJlY3Rpb24pO1xuXG5cdHJldHVybiAoKSA9PiB7XG5cdFx0bGV0IGZvbGRlcnMgPSB0aGlzLnN0YXRlLmZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUudHlwZSA9PT0gJ2ZvbGRlcicpO1xuXHRcdGxldCBmaWxlcyA9IHRoaXMuc3RhdGUuZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS50eXBlICE9PSAnZm9sZGVyJyk7XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdmaWxlcyc6IGZvbGRlcnMuc29ydChjb21wYXJhdG9yKS5jb25jYXQoZmlsZXMuc29ydChjb21wYXJhdG9yKSlcblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuc3RhdGUgPSB7XG5cdFx0XHQnY291bnQnOiAwLCAvLyBUaGUgbnVtYmVyIG9mIGZpbGVzIGluIHRoZSBjdXJyZW50IHZpZXdcblx0XHRcdCdmaWxlcyc6IFtdLFxuXHRcdFx0J3NlbGVjdGVkRmlsZXMnOiBbXSxcblx0XHRcdCdlZGl0aW5nJzogbnVsbFxuXHRcdH07XG5cblx0XHR0aGlzLmZvbGRlcnMgPSBbcHJvcHMuaW5pdGlhbF9mb2xkZXJdO1xuXG5cdFx0dGhpcy5zb3J0ID0gJ25hbWUnO1xuXHRcdHRoaXMuZGlyZWN0aW9uID0gJ2FzYyc7XG5cblx0XHR0aGlzLnNvcnRlcnMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdCdmaWVsZCc6ICd0aXRsZScsXG5cdFx0XHRcdCdkaXJlY3Rpb24nOiAnYXNjJyxcblx0XHRcdFx0J2xhYmVsJzogc3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRklMVEVSX1RJVExFX0FTQycpLFxuXHRcdFx0XHQnb25Tb3J0JzogZ2V0U29ydC5jYWxsKHRoaXMsICd0aXRsZScsICdhc2MnKVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J2ZpZWxkJzogJ3RpdGxlJyxcblx0XHRcdFx0J2RpcmVjdGlvbic6ICdkZXNjJyxcblx0XHRcdFx0J2xhYmVsJzogc3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRklMVEVSX1RJVExFX0RFU0MnKSxcblx0XHRcdFx0J29uU29ydCc6IGdldFNvcnQuY2FsbCh0aGlzLCAndGl0bGUnLCAnZGVzYycpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQnZmllbGQnOiAnY3JlYXRlZCcsXG5cdFx0XHRcdCdkaXJlY3Rpb24nOiAnZGVzYycsXG5cdFx0XHRcdCdsYWJlbCc6IHNzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkZJTFRFUl9EQVRFX0RFU0MnKSxcblx0XHRcdFx0J29uU29ydCc6IGdldFNvcnQuY2FsbCh0aGlzLCAnY3JlYXRlZCcsICdkZXNjJylcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCdmaWVsZCc6ICdjcmVhdGVkJyxcblx0XHRcdFx0J2RpcmVjdGlvbic6ICdhc2MnLFxuXHRcdFx0XHQnbGFiZWwnOiBzcy5pMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfREFURV9BU0MnKSxcblx0XHRcdFx0J29uU29ydCc6IGdldFNvcnQuY2FsbCh0aGlzLCAnY3JlYXRlZCcsICdhc2MnKVxuXHRcdFx0fVxuXHRcdF07XG5cblx0XHR0aGlzLmxpc3RlbmVycyA9IHtcblx0XHRcdCdvblNlYXJjaERhdGEnOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHQnY291bnQnOiBkYXRhLmNvdW50LFxuXHRcdFx0XHRcdCdmaWxlcyc6IGRhdGEuZmlsZXNcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0J29uTW9yZURhdGEnOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHQnY291bnQnOiBkYXRhLmNvdW50LFxuXHRcdFx0XHRcdCdmaWxlcyc6IHRoaXMuc3RhdGUuZmlsZXMuY29uY2F0KGRhdGEuZmlsZXMpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdCdvbk5hdmlnYXRlRGF0YSc6IChkYXRhKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdCdjb3VudCc6IGRhdGEuY291bnQsXG5cdFx0XHRcdFx0J2ZpbGVzJzogZGF0YS5maWxlc1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHQnb25EZWxldGVEYXRhJzogKGRhdGEpID0+IHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2NvdW50JzogdGhpcy5zdGF0ZS5jb3VudCAtIDEsXG5cdFx0XHRcdFx0J2ZpbGVzJzogdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoKGZpbGUpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhICE9PSBmaWxlLmlkO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdCdvblNhdmVEYXRhJzogKGlkLCB2YWx1ZXMpID0+IHtcblx0XHRcdFx0bGV0IGZpbGVzID0gdGhpcy5zdGF0ZS5maWxlcztcblxuXHRcdFx0XHRmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGZpbGUuaWQgPT0gaWQpIHtcblx0XHRcdFx0XHRcdGZpbGUudGl0bGUgPSB2YWx1ZXMudGl0bGU7XG5cdFx0XHRcdFx0XHRmaWxlLmJhc2VuYW1lID0gdmFsdWVzLmJhc2VuYW1lO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2ZpbGVzJzogZmlsZXMsXG5cdFx0XHRcdFx0J2VkaXRpbmcnOiBmYWxzZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGhpcy5iaW5kKFxuXHRcdFx0J29uRmlsZVNhdmUnLFxuXHRcdFx0J29uRmlsZU5hdmlnYXRlJyxcblx0XHRcdCdvbkZpbGVTZWxlY3QnLFxuXHRcdFx0J29uRmlsZUVkaXQnLFxuXHRcdFx0J29uRmlsZURlbGV0ZScsXG5cdFx0XHQnb25CYWNrQ2xpY2snLFxuXHRcdFx0J29uTW9yZUNsaWNrJyxcblx0XHRcdCdvbk5hdmlnYXRlJyxcblx0XHRcdCdvbkNhbmNlbCcsXG5cdFx0XHQnZ2V0U2VsZWN0ZWRGaWxlcydcblx0XHQpO1xuXHR9XG5cblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0Zm9yIChsZXQgZXZlbnQgaW4gdGhpcy5saXN0ZW5lcnMpIHtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5vbihldmVudCwgdGhpcy5saXN0ZW5lcnNbZXZlbnRdKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcm9wcy5pbml0aWFsX2ZvbGRlciAhPT0gdGhpcy5wcm9wcy5jdXJyZW50X2ZvbGRlcikge1xuXHRcdFx0dGhpcy5vbk5hdmlnYXRlKHRoaXMucHJvcHMuY3VycmVudF9mb2xkZXIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnByb3BzLmJhY2tlbmQuc2VhcmNoKCk7XG5cdFx0fVxuXHR9XG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQoKSB7XG5cdFx0Zm9yIChsZXQgZXZlbnQgaW4gdGhpcy5saXN0ZW5lcnMpIHtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcihldmVudCwgdGhpcy5saXN0ZW5lcnNbZXZlbnRdKTtcblx0XHR9XG5cdH1cblxuXHRjb21wb25lbnREaWRVcGRhdGUoKSB7XG5cdFx0dmFyICRzZWxlY3QgPSAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKCcuZ2FsbGVyeV9fc29ydCAuZHJvcGRvd24nKSxcblx0XHRcdGxlZnRWYWwgPSAkKCcuY21zLWNvbnRlbnQtdG9vbGJhcjp2aXNpYmxlJykud2lkdGgoKSArIDEyO1xuXG5cdFx0aWYgKHRoaXMuZm9sZGVycy5sZW5ndGggPiAxKSB7XG5cdFx0XHRsZXQgYmFja0J1dHRvbiA9IHRoaXMucmVmcy5iYWNrQnV0dG9uLmdldERPTU5vZGUoKTtcblxuXHRcdFx0JChiYWNrQnV0dG9uKS5jc3Moe1xuXHRcdFx0XHRsZWZ0OiBsZWZ0VmFsXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBXZSBvcHQtb3V0IG9mIGxldHRpbmcgdGhlIENNUyBoYW5kbGUgQ2hvc2VuIGJlY2F1c2UgaXQgZG9lc24ndCByZS1hcHBseSB0aGUgYmVoYXZpb3VyIGNvcnJlY3RseS5cblx0XHQvLyBTbyBhZnRlciB0aGUgZ2FsbGVyeSBoYXMgYmVlbiByZW5kZXJlZCB3ZSBhcHBseSBDaG9zZW4uXG5cdFx0JHNlbGVjdC5jaG9zZW4oe1xuXHRcdFx0J2FsbG93X3NpbmdsZV9kZXNlbGVjdCc6IHRydWUsXG5cdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMjBcblx0XHR9KTtcblxuXHRcdC8vIENob3NlbiBzdG9wcyB0aGUgY2hhbmdlIGV2ZW50IGZyb20gcmVhY2hpbmcgUmVhY3Qgc28gd2UgaGF2ZSB0byBzaW11bGF0ZSBhIGNsaWNrLlxuXHRcdCRzZWxlY3QuY2hhbmdlKCgpID0+IFJlYWN0LmFkZG9ucy5UZXN0VXRpbHMuU2ltdWxhdGUuY2xpY2soJHNlbGVjdC5maW5kKCc6c2VsZWN0ZWQnKVswXSkpO1xuXHR9XG5cblx0Z2V0QmFja0J1dHRvbigpIHtcblx0XHRpZiAodGhpcy5mb2xkZXJzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJldHVybiA8YnV0dG9uXG5cdFx0XHRcdGNsYXNzTmFtZT0nc3MtdWktYnV0dG9uIHVpLWJ1dHRvbiB1aS13aWRnZXQgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsIGZvbnQtaWNvbi1sZXZlbC11cCdcblx0XHRcdFx0b25DbGljaz17dGhpcy5vbkJhY2tDbGlja31cblx0XHRcdFx0cmVmPVwiYmFja0J1dHRvblwiPntzcy5pMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5CQUNLJyl9PC9idXR0b24+O1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Z2V0QnVsa0FjdGlvbnNDb21wb25lbnQoKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gPEJ1bGtBY3Rpb25zQ29tcG9uZW50XG5cdFx0XHRcdG9wdGlvbnM9e0NPTlNUQU5UUy5CVUxLX0FDVElPTlN9XG5cdFx0XHRcdHBsYWNlaG9sZGVyPXtzcy5pMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5CVUxLX0FDVElPTlNfUExBQ0VIT0xERVInKX1cblx0XHRcdFx0YmFja2VuZD17dGhpcy5wcm9wcy5iYWNrZW5kfVxuXHRcdFx0XHRnZXRTZWxlY3RlZEZpbGVzPXt0aGlzLmdldFNlbGVjdGVkRmlsZXN9IC8+O1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Z2V0TW9yZUJ1dHRvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5jb3VudCA+IHRoaXMuc3RhdGUuZmlsZXMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gPGJ1dHRvblxuXHRcdFx0XHRjbGFzc05hbWU9XCJnYWxsZXJ5X19sb2FkX19tb3JlXCJcblx0XHRcdFx0b25DbGljaz17dGhpcy5vbk1vcmVDbGlja30+e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkxPQURNT1JFJyl9PC9idXR0b24+O1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Z2V0U2VsZWN0ZWRGaWxlcygpIHtcblx0XHRyZXR1cm4gdGhpcy5zdGF0ZS5zZWxlY3RlZEZpbGVzO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLmVkaXRpbmcpIHtcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG5cdFx0XHRcdDxFZGl0b3JDb21wb25lbnRcblx0XHRcdFx0XHRmaWxlPXt0aGlzLnN0YXRlLmVkaXRpbmd9XG5cdFx0XHRcdFx0b25GaWxlU2F2ZT17dGhpcy5vbkZpbGVTYXZlfVxuXHRcdFx0XHRcdG9uQ2FuY2VsPXt0aGlzLm9uQ2FuY2VsfSAvPlxuXHRcdFx0PC9kaXY+O1xuXHRcdH1cblxuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG5cdFx0XHR7dGhpcy5nZXRCYWNrQnV0dG9uKCl9XG5cdFx0XHR7dGhpcy5nZXRCdWxrQWN0aW9uc0NvbXBvbmVudCgpfVxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5X19zb3J0IGZpZWxkaG9sZGVyLXNtYWxsXCI+XG5cdFx0XHRcdDxzZWxlY3QgY2xhc3NOYW1lPVwiZHJvcGRvd24gbm8tY2hhbmdlLXRyYWNrIG5vLWNoem5cIiB0YWJJbmRleD1cIjBcIiBzdHlsZT17e3dpZHRoOiAnMTYwcHgnfX0+XG5cdFx0XHRcdFx0e3RoaXMuc29ydGVycy5tYXAoKHNvcnRlciwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDxvcHRpb24ga2V5PXtpfSBvbkNsaWNrPXtzb3J0ZXIub25Tb3J0fT57c29ydGVyLmxhYmVsfTwvb3B0aW9uPjtcblx0XHRcdFx0XHR9KX1cblx0XHRcdFx0PC9zZWxlY3Q+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5X19pdGVtcyc+XG5cdFx0XHRcdHt0aGlzLnN0YXRlLmZpbGVzLm1hcCgoZmlsZSwgaSkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiA8RmlsZUNvbXBvbmVudCBrZXk9e2l9IHsuLi5maWxlfVxuXHRcdFx0XHRcdFx0c2VsZWN0S2V5cz17Q09OU1RBTlRTLkZJTEVfU0VMRUNUX0tFWVN9XG5cdFx0XHRcdFx0XHRvbkZpbGVTZWxlY3Q9e3RoaXMub25GaWxlU2VsZWN0fVxuXHRcdFx0XHRcdFx0c2VsZWN0S2V5cz17Q09OU1RBTlRTLkZJTEVfU0VMRUNUX0tFWVN9XG5cdFx0XHRcdFx0XHRvbkZpbGVEZWxldGU9e3RoaXMub25GaWxlRGVsZXRlfVxuXHRcdFx0XHRcdFx0b25GaWxlRWRpdD17dGhpcy5vbkZpbGVFZGl0fVxuXHRcdFx0XHRcdFx0b25GaWxlTmF2aWdhdGU9e3RoaXMub25GaWxlTmF2aWdhdGV9XG5cdFx0XHRcdFx0XHRzZWxlY3RlZD17dGhpcy5zdGF0ZS5zZWxlY3RlZEZpbGVzLmluZGV4T2YoZmlsZS5pZCkgPiAtMX0gLz47XG5cdFx0XHRcdH0pfVxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX2xvYWRcIj5cblx0XHRcdFx0e3RoaXMuZ2V0TW9yZUJ1dHRvbigpfVxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+O1xuXHR9XG5cblx0b25DYW5jZWwoKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHQnZWRpdGluZyc6IG51bGxcblx0XHR9KTtcblx0fVxuXG5cdG9uRmlsZVNlbGVjdChmaWxlLCBldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0dmFyIGN1cnJlbnRseVNlbGVjdGVkID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEZpbGVzLFxuXHRcdFx0ZmlsZUluZGV4ID0gY3VycmVudGx5U2VsZWN0ZWQuaW5kZXhPZihmaWxlLmlkKTtcblxuXHRcdGlmIChmaWxlSW5kZXggPiAtMSkge1xuXHRcdFx0Y3VycmVudGx5U2VsZWN0ZWQuc3BsaWNlKGZpbGVJbmRleCwgMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1cnJlbnRseVNlbGVjdGVkLnB1c2goZmlsZS5pZCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHQnc2VsZWN0ZWRGaWxlcyc6IGN1cnJlbnRseVNlbGVjdGVkXG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbGVEZWxldGUoZmlsZSwgZXZlbnQpIHtcblx0XHRpZiAoY29uZmlybShzcy5pMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5DT05GSVJNREVMRVRFJykpKSB7XG5cdFx0XHR0aGlzLnByb3BzLmJhY2tlbmQuZGVsZXRlKGZpbGUuaWQpO1xuXHRcdH1cblxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9XG5cblx0b25GaWxlRWRpdChmaWxlLCBldmVudCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0J2VkaXRpbmcnOiBmaWxlXG5cdFx0fSk7XG5cblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fVxuXG5cdG9uRmlsZU5hdmlnYXRlKGZpbGUpIHtcblx0XHR0aGlzLmZvbGRlcnMucHVzaChmaWxlLmZpbGVuYW1lKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQubmF2aWdhdGUoZmlsZS5maWxlbmFtZSk7XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdzZWxlY3RlZEZpbGVzJzogW11cblx0XHR9KVxuXHR9XG5cblx0b25OYXZpZ2F0ZShmb2xkZXIpIHtcblx0XHR0aGlzLmZvbGRlcnMucHVzaChmb2xkZXIpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5uYXZpZ2F0ZShmb2xkZXIpO1xuXHR9XG5cblx0b25Nb3JlQ2xpY2soZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5tb3JlKCk7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0b25CYWNrQ2xpY2soZXZlbnQpIHtcblx0XHRpZiAodGhpcy5mb2xkZXJzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHRoaXMuZm9sZGVycy5wb3AoKTtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5uYXZpZ2F0ZSh0aGlzLmZvbGRlcnNbdGhpcy5mb2xkZXJzLmxlbmd0aCAtIDFdKTtcblx0XHR9XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdzZWxlY3RlZEZpbGVzJzogW11cblx0XHR9KVxuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fVxuXG5cdG9uRmlsZVNhdmUoaWQsIHN0YXRlLCBldmVudCkge1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5zYXZlKGlkLCBzdGF0ZSk7XG5cblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG5cdCdUSFVNQk5BSUxfSEVJR0hUJzogMTUwLFxuXHQnVEhVTUJOQUlMX1dJRFRIJzogMjAwLFxuXHQnRklMRV9TRUxFQ1RfS0VZUyc6IFszMiwgMTNdLFxuXHQnQlVMS19BQ1RJT05TJzogW1xuXHRcdHtcblx0XHRcdHZhbHVlOiAnZGVsZXRlJyxcblx0XHRcdGxhYmVsOiAnRGVsZXRlJyxcblx0XHRcdGRlc3RydWN0aXZlOiB0cnVlXG5cdFx0fVxuXHRdXG59O1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2FsbGVyeUNvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudC9nYWxsZXJ5LWNvbXBvbmVudCc7XG5pbXBvcnQgRmlsZUJhY2tlbmQgZnJvbSAnLi9iYWNrZW5kL2ZpbGUtYmFja2VuZCc7XG5cbmZ1bmN0aW9uIGdldFZhcihuYW1lKSB7XG5cdHZhciBwYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCc/Jyk7XG5cblx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRwYXJ0cyA9IHBhcnRzWzFdLnNwbGl0KCcjJyk7XG5cdH1cblxuXHRsZXQgdmFyaWFibGVzID0gcGFydHNbMF0uc3BsaXQoJyYnKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHZhcmlhYmxlcy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwYXJ0cyA9IHZhcmlhYmxlc1tpXS5zcGxpdCgnPScpO1xuXG5cdFx0aWYgKGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSkgPT09IG5hbWUpIHtcblx0XHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBudWxsO1xufVxuXG4kKCcuYXNzZXQtZ2FsbGVyeScpLmVudHdpbmUoe1xuXHQnb25hZGQnOiBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHByb3BzID0ge1xuXHRcdFx0J25hbWUnOiB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LW5hbWUnKSxcblx0XHRcdCdpbml0aWFsX2ZvbGRlcic6IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktaW5pdGlhbC1mb2xkZXInKVxuXHRcdH07XG5cblx0XHRpZiAocHJvcHMubmFtZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkc2VhcmNoID0gJCgnLmNtcy1zZWFyY2gtZm9ybScpO1xuXG5cdFx0aWYgKCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJykubGVuZ3RoID09IDApIHtcblx0XHRcdCRzZWFyY2guYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJxW0ZvbGRlcl1cIiAvPicpO1xuXHRcdH1cblxuXHRcdHByb3BzLmJhY2tlbmQgPSBGaWxlQmFja2VuZC5jcmVhdGUoXG5cdFx0XHR0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LXNlYXJjaC11cmwnKSxcblx0XHRcdHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktdXBkYXRlLXVybCcpLFxuXHRcdFx0dGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1kZWxldGUtdXJsJyksXG5cdFx0XHR0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWxpbWl0JyksXG5cdFx0XHQkc2VhcmNoLmZpbmQoJ1t0eXBlPWhpZGRlbl1bbmFtZT1cInFbRm9sZGVyXVwiXScpXG5cdFx0KTtcblxuXHRcdHByb3BzLmJhY2tlbmQuZW1pdChcblx0XHRcdCdmaWx0ZXInLFxuXHRcdFx0Z2V0VmFyKCdxW05hbWVdJyksXG5cdFx0XHRnZXRWYXIoJ3FbQXBwQ2F0ZWdvcnldJyksXG5cdFx0XHRnZXRWYXIoJ3FbRm9sZGVyXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRGcm9tXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRUb10nKSxcblx0XHRcdGdldFZhcigncVtDdXJyZW50Rm9sZGVyT25seV0nKVxuXHRcdCk7XG5cblx0XHRwcm9wcy5jdXJyZW50X2ZvbGRlciA9IGdldFZhcigncVtGb2xkZXJdJykgfHwgcHJvcHMuaW5pdGlhbF9mb2xkZXI7XG5cblx0XHRSZWFjdC5yZW5kZXIoXG5cdFx0XHQ8R2FsbGVyeUNvbXBvbmVudCB7Li4ucHJvcHN9IC8+LFxuXHRcdFx0dGhpc1swXVxuXHRcdCk7XG5cdH1cbn0pO1xuIl19

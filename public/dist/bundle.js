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
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ActionSet = (function () {
	function ActionSet(identifier, dispatcher) {
		_classCallCheck(this, ActionSet);

		this.identifier = identifier;
		this.dispatcher = dispatcher;
	}

	_createClass(ActionSet, [{
		key: "addAction",
		value: function addAction(actionName, listener) {
			var _this = this;

			this[actionName] = function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				listener && listener.apply(undefined, args);
				_this.dispatcher.dispatch({
					action: _this.identifier + "." + actionName,
					params: [].concat(args)
				});
			};
		}
	}, {
		key: "addAsyncAction",
		value: function addAsyncAction(actionName, onStart, onComplete) {
			var _this2 = this;

			this.addAction(actionName, onStart);
			this[actionName].completed = function () {
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				_this2.dispatcher.dispatch({
					action: _this2.identifier + "." + actionName + "Completed",
					params: [].concat(args)
				});
			};
		}
	}]);

	return ActionSet;
})();

exports["default"] = ActionSet;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatcherEditorDispatcher = require('../dispatcher/editorDispatcher');

var _dispatcherEditorDispatcher2 = _interopRequireDefault(_dispatcherEditorDispatcher);

var _ActionSet = require('./ActionSet');

var _ActionSet2 = _interopRequireDefault(_ActionSet);

var _apiAPI = require('../api/API');

var _apiAPI2 = _interopRequireDefault(_apiAPI);

var editorActions = new _ActionSet2['default']('editorActions', _dispatcherEditorDispatcher2['default']);

editorActions.addAction('create');

editorActions.addAction('update');

editorActions.addAction('clear');

exports['default'] = editorActions;
module.exports = exports['default'];

},{"../api/API":5,"../dispatcher/editorDispatcher":11,"./ActionSet":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatcherGalleryDispatcher = require('../dispatcher/galleryDispatcher');

var _dispatcherGalleryDispatcher2 = _interopRequireDefault(_dispatcherGalleryDispatcher);

var _ActionSet = require('./ActionSet');

var _ActionSet2 = _interopRequireDefault(_ActionSet);

var _apiAPI = require('../api/API');

var _apiAPI2 = _interopRequireDefault(_apiAPI);

var galleryActions = new _ActionSet2['default']('galleryActions', _dispatcherGalleryDispatcher2['default']);

galleryActions.addAction('setStoreProps');

galleryActions.addAction('create');

galleryActions.addAsyncAction('destroy', function (id) {
	_apiAPI2['default'].destroyItem(id, galleryActions.destroy.completed);
});

galleryActions.addAsyncAction('update', function () {
	console.log('todo');
});

galleryActions.addAsyncAction('navigate', function (folder) {
	_apiAPI2['default'].getFolderData({ folder: folder }, galleryActions.navigate.completed);
});

galleryActions.addAsyncAction('page', function (params) {
	_apiAPI2['default'].getFolderData(params, galleryActions.page.completed);
});

exports['default'] = galleryActions;
module.exports = exports['default'];

},{"../api/API":5,"../dispatcher/galleryDispatcher":12,"./ActionSet":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

exports['default'] = {
	_urls: {},

	setURLs: function setURLs(urls) {
		this._urls = urls;
	},

	getFolderData: function getFolderData(params, onComplete) {
		_jquery2['default'].ajax({
			url: this._urls.data_url,
			dataType: 'json',
			data: params,
			success: onComplete
		});
	},

	destroyItem: function destroyItem(id, onComplete) {
		_jquery2['default'].ajax({
			url: this._urls.delete_url,
			data: { id: id },
			dataType: 'json',
			method: 'GET',
			success: onComplete
		});
	}
};
module.exports = exports['default'];

},{"jquery":"jquery"}],6:[function(require,module,exports){
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

},{"../action/editorActions":3,"../store/editorStore":15,"./inputField":8,"react":"react"}],7:[function(require,module,exports){
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

var _apiAPI = require('../api/API');

var _apiAPI2 = _interopRequireDefault(_apiAPI);

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
            initial_folder: props.initial_folder,
            limit: props.limit
        });

        _apiAPI2['default'].setURLs({
            data_url: props.data_url,
            update_url: props.update_url,
            delete_url: props.delete_url
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

},{"../action/galleryActions":4,"../api/API":5,"../store/itemStore":16,"./editor":6,"./item":9,"jquery":"jquery","react":"react"}],8:[function(require,module,exports){
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

},{"../action/editorActions":3,"react":"react"}],9:[function(require,module,exports){
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
                            className: 'item__actions__action item__actions__action--edit [ font-icon-pencil ]',
                            type: 'button',
                            onClick: this.handleEdit.bind(this) }),
                        _react2['default'].createElement('button', {
                            className: 'item__actions__action item__actions__action--remove [ font-icon-trash ]',
                            type: 'button',
                            onClick: this.handleDelete.bind(this) })
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

},{"../action/galleryActions":4,"../constants":10,"react":"react"}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _flux = require('flux');

var _editorDispatcher = new _flux.Dispatcher(); // Singleton

exports['default'] = _editorDispatcher;
module.exports = exports['default'];

},{"flux":"flux"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _flux = require('flux');

var _galleryDispatcher = new _flux.Dispatcher(); // Singleton

exports['default'] = _galleryDispatcher;
module.exports = exports['default'];

},{"flux":"flux"}],13:[function(require,module,exports){
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

},{"./component/gallery":7,"jquery":"jquery","react":"react"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var Store = (function (_EventEmitter) {
	_inherits(Store, _EventEmitter);

	function Store() {
		_classCallCheck(this, Store);

		_get(Object.getPrototypeOf(Store.prototype), 'constructor', this).call(this);
		this.customListeners = {};
	}

	_createClass(Store, [{
		key: 'listenTo',
		value: function listenTo(actionSet, action, callback) {
			this.customListeners[actionSet.identifier + '.' + action] = callback;
		}
	}, {
		key: 'handleAction',
		value: function handleAction(action, params) {
			var method = this.customListeners[action];

			if (!method) {
				var _name = action.split('.').pop();
				var capName = _name.charAt(0).toUpperCase() + _name.slice(1);
				method = this['on' + capName];
			}

			if (method) {
				var _method;

				(_method = method).call.apply(_method, [this].concat(_toConsumableArray(params)));
			}
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
	}], [{
		key: 'getActionSets',
		value: function getActionSets() {
			return [];
		}
	}]);

	return Store;
})(_events2['default']);

exports['default'] = Store;
module.exports = exports['default'];

},{"../constants":10,"events":1}],15:[function(require,module,exports){
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

var _baseStore = require('./baseStore');

var _baseStore2 = _interopRequireDefault(_baseStore);

var _fields = [];

var EditorStore = (function (_BaseStore) {
	_inherits(EditorStore, _BaseStore);

	function EditorStore() {
		_classCallCheck(this, EditorStore);

		_get(Object.getPrototypeOf(EditorStore.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(EditorStore, [{
		key: 'onCreate',
		value: function onCreate(data) {
			var fieldExists = _fields.some(function (field) {
				return field.name === data.name;
			});

			if (fieldExists) {
				return;
			}

			_fields.push({
				name: data.name,
				value: data.value
			});

			this.emitChange();
		}
	}, {
		key: 'onUpdate',
		value: function onUpdate(data) {
			for (var i = 0; i < _fields.length; i += 1) {
				if (_fields[i].name === data.name) {
					_fields[i] = data;
					break;
				}
			}

			this.emitChange();
		}
	}, {
		key: 'onClear',
		value: function onClear() {
			_fields = [];

			this.emitChange();
		}

		/**
   * @return {object}
   * @desc Gets the entire collection of items.
   */
	}, {
		key: 'getAll',
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
			this.emit(CONSTANTS.EDITOR.CHANGE);
		}

		/**
   * @param {function} callback
   */
	}, {
		key: 'addChangeListener',
		value: function addChangeListener(callback) {
			this.on(CONSTANTS.EDITOR.CHANGE, callback);
		}

		/**
   * @param {function} callback
   */
	}, {
		key: 'removeChangeListener',
		value: function removeChangeListener(callback) {
			this.removeListener(CONSTANTS.EDITOR.CHANGE, callback);
		}
	}], [{
		key: 'getActionSets',
		value: function getActionSets() {
			return [_actionEditorActions2['default']];
		}
	}]);

	return EditorStore;
})(_baseStore2['default']);

var _editorStore = new EditorStore(); // Singleton.

_dispatcherEditorDispatcher2['default'].register(function (payload) {
	_editorStore.handleAction(payload.action, payload.params);

	return true;
});

exports['default'] = _editorStore;
module.exports = exports['default'];

},{"../action/editorActions":3,"../dispatcher/editorDispatcher":11,"./baseStore":14}],16:[function(require,module,exports){
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

var _baseStore = require('./baseStore');

var _baseStore2 = _interopRequireDefault(_baseStore);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _items = [];
var _folders = [];
var _currentFolder = null;

var _filters = {
	'page': 1,
	'limit': 10
};

var ItemStore = (function (_BaseStore) {
	_inherits(ItemStore, _BaseStore);

	function ItemStore() {
		_classCallCheck(this, ItemStore);

		_get(Object.getPrototypeOf(ItemStore.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(ItemStore, [{
		key: 'onSetStoreProps',
		value: function onSetStoreProps(data) {
			var _this = this;

			Object.keys(data).map(function (key) {
				_this[key] = data[key];
			});
		}

		/**
   * @func onCreate
   * @param {object} itemData
   * @desc Adds a gallery item to the store.
   */
	}, {
		key: 'onCreate',
		value: function onCreate(itemData) {
			var itemExists = _items.some(function (item) {
				item.id === itemData.id;
			});

			if (itemExists) {
				return;
			}

			_items.push(itemData);

			this.emitChange();
		}
	}, {
		key: 'onNavigate',
		value: function onNavigate(folder) {
			// Could find a cached copy here and trigger a change ahead of the XHR

			if (folder !== _itemStore.initial_folder) {
				_folders.push([folder, _currentFolder || _itemStore.initial_folder]);
			}

			_currentFolder = folder;
		}
	}, {
		key: 'onNavigateCompleted',
		value: function onNavigateCompleted(data) {
			_items = data.files;
			_filters.count = data.count;

			this.emitChange();
		}
	}, {
		key: 'onDestroy',
		value: function onDestroy(id) {
			// optimistically destroy
			_items = _items.filter(function (item) {
				return item.id !== id;
			});
			this.emitChange();
		}
	}, {
		key: 'onDestroyCompleted',
		value: function onDestroyCompleted(data) {
			// this could be used to replace the item if the server data doesn't look right.
		}
	}, {
		key: 'onPageCompleted',
		value: function onPageCompleted(data) {
			_items = _items.concat(data.files);

			this.emitChange();
		}

		/**
   * Checks if the gallery has been navigated.
   */
	}, {
		key: 'hasNavigated',
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
	}], [{
		key: 'getActionSets',
		value: function getActionSets() {
			return [_actionGalleryActions2['default']];
		}
	}]);

	return ItemStore;
})(_baseStore2['default']);

var _itemStore = new ItemStore(); // Singleton

_dispatcherGalleryDispatcher2['default'].register(function (payload) {
	_itemStore.handleAction(payload.action, payload.params);

	return true;
});

exports['default'] = _itemStore;
module.exports = exports['default'];

},{"../action/galleryActions":4,"../dispatcher/galleryDispatcher":12,"./baseStore":14,"jquery":"jquery"}]},{},[13])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy9hYXJvbmNhcmxpbm8vU2l0ZXMvc3MzMi9zaWx2ZXJzdHJpcGUtYXNzZXRzLWdhbGxlcnkvcHVibGljL3NyYy9hY3Rpb24vQWN0aW9uU2V0LmpzIiwiL1VzZXJzL2Fhcm9uY2FybGluby9TaXRlcy9zczMyL3NpbHZlcnN0cmlwZS1hc3NldHMtZ2FsbGVyeS9wdWJsaWMvc3JjL2FjdGlvbi9lZGl0b3JBY3Rpb25zLmpzIiwiL1VzZXJzL2Fhcm9uY2FybGluby9TaXRlcy9zczMyL3NpbHZlcnN0cmlwZS1hc3NldHMtZ2FsbGVyeS9wdWJsaWMvc3JjL2FjdGlvbi9nYWxsZXJ5QWN0aW9ucy5qcyIsIi9Vc2Vycy9hYXJvbmNhcmxpbm8vU2l0ZXMvc3MzMi9zaWx2ZXJzdHJpcGUtYXNzZXRzLWdhbGxlcnkvcHVibGljL3NyYy9hcGkvQVBJLmpzIiwiL1VzZXJzL2Fhcm9uY2FybGluby9TaXRlcy9zczMyL3NpbHZlcnN0cmlwZS1hc3NldHMtZ2FsbGVyeS9wdWJsaWMvc3JjL2NvbXBvbmVudC9lZGl0b3IuanMiLCIvVXNlcnMvYWFyb25jYXJsaW5vL1NpdGVzL3NzMzIvc2lsdmVyc3RyaXBlLWFzc2V0cy1nYWxsZXJ5L3B1YmxpYy9zcmMvY29tcG9uZW50L2dhbGxlcnkuanMiLCIvVXNlcnMvYWFyb25jYXJsaW5vL1NpdGVzL3NzMzIvc2lsdmVyc3RyaXBlLWFzc2V0cy1nYWxsZXJ5L3B1YmxpYy9zcmMvY29tcG9uZW50L2lucHV0RmllbGQuanMiLCIvVXNlcnMvYWFyb25jYXJsaW5vL1NpdGVzL3NzMzIvc2lsdmVyc3RyaXBlLWFzc2V0cy1nYWxsZXJ5L3B1YmxpYy9zcmMvY29tcG9uZW50L2l0ZW0uanMiLCIvVXNlcnMvYWFyb25jYXJsaW5vL1NpdGVzL3NzMzIvc2lsdmVyc3RyaXBlLWFzc2V0cy1nYWxsZXJ5L3B1YmxpYy9zcmMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL2Fhcm9uY2FybGluby9TaXRlcy9zczMyL3NpbHZlcnN0cmlwZS1hc3NldHMtZ2FsbGVyeS9wdWJsaWMvc3JjL2Rpc3BhdGNoZXIvZWRpdG9yRGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9hYXJvbmNhcmxpbm8vU2l0ZXMvc3MzMi9zaWx2ZXJzdHJpcGUtYXNzZXRzLWdhbGxlcnkvcHVibGljL3NyYy9kaXNwYXRjaGVyL2dhbGxlcnlEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2Fhcm9uY2FybGluby9TaXRlcy9zczMyL3NpbHZlcnN0cmlwZS1hc3NldHMtZ2FsbGVyeS9wdWJsaWMvc3JjL21haW4uanMiLCIvVXNlcnMvYWFyb25jYXJsaW5vL1NpdGVzL3NzMzIvc2lsdmVyc3RyaXBlLWFzc2V0cy1nYWxsZXJ5L3B1YmxpYy9zcmMvc3RvcmUvYmFzZVN0b3JlLmpzIiwiL1VzZXJzL2Fhcm9uY2FybGluby9TaXRlcy9zczMyL3NpbHZlcnN0cmlwZS1hc3NldHMtZ2FsbGVyeS9wdWJsaWMvc3JjL3N0b3JlL2VkaXRvclN0b3JlLmpzIiwiL1VzZXJzL2Fhcm9uY2FybGluby9TaXRlcy9zczMyL3NpbHZlcnN0cmlwZS1hc3NldHMtZ2FsbGVyeS9wdWJsaWMvc3JjL3N0b3JlL2l0ZW1TdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LElBQUksRUFBRTtBQUN0QixTQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRW5DLE9BQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNsQjs7Ozs7OztTQUtXLHdCQUFHO0FBQ2QsVUFBTyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztHQUMzQjs7Ozs7OztTQUtZLHlCQUFHO0FBQ2YsVUFBTyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7R0FDdEI7Ozs7Ozs7O1NBTUssa0JBQUc7QUFDUixVQUFPLE1BQU0sQ0FBQztHQUNkOzs7Ozs7Ozs7U0FPTSxpQkFBQyxFQUFFLEVBQUU7QUFDWCxPQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDMUMsUUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUN4QixTQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLFdBQU07S0FDTjtJQUNEOztBQUVELFVBQU8sSUFBSSxDQUFDO0dBQ1o7OztTQW5Hb0IseUJBQUc7QUFDdkIsVUFBTyxtQ0FBZ0IsQ0FBQztHQUN4Qjs7O1FBSkksU0FBUzs7O0FBeUdmLElBQU0sVUFBVSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7O0FBRW5DLHlDQUFrQixRQUFRLENBQUMsVUFBVSxPQUFPLEVBQUU7QUFDN0MsV0FBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEQsUUFBTyxJQUFJLENBQUM7Q0FDWixDQUFDLENBQUM7O3FCQUVZLFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0aW9uU2V0IHtcblxuXHRjb25zdHJ1Y3RvciAoaWRlbnRpZmllciwgZGlzcGF0Y2hlcikge1xuXHRcdHRoaXMuaWRlbnRpZmllciA9IGlkZW50aWZpZXI7XG5cdFx0dGhpcy5kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcdFx0XG5cdH1cblxuXG5cdGFkZEFjdGlvbiAoYWN0aW9uTmFtZSwgbGlzdGVuZXIpIHtcblx0XHR0aGlzW2FjdGlvbk5hbWVdID0gKC4uLmFyZ3MpID0+IHtcdFx0XHRcblx0XHRcdGxpc3RlbmVyICYmIGxpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdFx0dGhpcy5kaXNwYXRjaGVyLmRpc3BhdGNoKHtcblx0XHRcdFx0YWN0aW9uOiBgJHt0aGlzLmlkZW50aWZpZXJ9LiR7YWN0aW9uTmFtZX1gLFxuXHRcdFx0XHRwYXJhbXM6IFsuLi5hcmdzXVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblxuXHRhZGRBc3luY0FjdGlvbiAoYWN0aW9uTmFtZSwgb25TdGFydCwgb25Db21wbGV0ZSkge1xuXHRcdHRoaXMuYWRkQWN0aW9uKGFjdGlvbk5hbWUsIG9uU3RhcnQpO1xuXHRcdHRoaXNbYWN0aW9uTmFtZV0uY29tcGxldGVkID0gKC4uLmFyZ3MpID0+IHtcdFx0XHRcblx0XHRcdHRoaXMuZGlzcGF0Y2hlci5kaXNwYXRjaCh7XG5cdFx0XHRcdGFjdGlvbjogYCR7dGhpcy5pZGVudGlmaWVyfS4ke2FjdGlvbk5hbWV9Q29tcGxldGVkYCxcblx0XHRcdFx0cGFyYW1zOiBbLi4uYXJnc11cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRcbn0iLCJpbXBvcnQgZWRpdG9yRGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2VkaXRvckRpc3BhdGNoZXInO1xuaW1wb3J0IEFjdGlvblNldCBmcm9tICcuL0FjdGlvblNldCc7XG5pbXBvcnQgQVBJIGZyb20gJy4uL2FwaS9BUEknO1xuXG5jb25zdCBlZGl0b3JBY3Rpb25zID0gbmV3IEFjdGlvblNldCAoXG5cdCdlZGl0b3JBY3Rpb25zJywgXG5cdGVkaXRvckRpc3BhdGNoZXJcbik7XG5cbmVkaXRvckFjdGlvbnMuYWRkQWN0aW9uKCdjcmVhdGUnKTtcblxuZWRpdG9yQWN0aW9ucy5hZGRBY3Rpb24oJ3VwZGF0ZScpO1xuXG5lZGl0b3JBY3Rpb25zLmFkZEFjdGlvbignY2xlYXInKTtcblxuZXhwb3J0IGRlZmF1bHQgZWRpdG9yQWN0aW9uczsiLCJpbXBvcnQgZ2FsbGVyeURpc3BhdGNoZXIgZnJvbSAnLi4vZGlzcGF0Y2hlci9nYWxsZXJ5RGlzcGF0Y2hlcic7XG5pbXBvcnQgQWN0aW9uU2V0IGZyb20gJy4vQWN0aW9uU2V0JztcbmltcG9ydCBBUEkgZnJvbSAnLi4vYXBpL0FQSSc7XG5cbmNvbnN0IGdhbGxlcnlBY3Rpb25zID0gbmV3IEFjdGlvblNldCAoXG5cdCdnYWxsZXJ5QWN0aW9ucycsIFxuXHRnYWxsZXJ5RGlzcGF0Y2hlclxuKTtcblxuZ2FsbGVyeUFjdGlvbnMuYWRkQWN0aW9uKCdzZXRTdG9yZVByb3BzJyk7XG5cbmdhbGxlcnlBY3Rpb25zLmFkZEFjdGlvbignY3JlYXRlJyk7XG5cbmdhbGxlcnlBY3Rpb25zLmFkZEFzeW5jQWN0aW9uKCdkZXN0cm95JywgaWQgPT4ge1xuXHRBUEkuZGVzdHJveUl0ZW0oaWQsIGdhbGxlcnlBY3Rpb25zLmRlc3Ryb3kuY29tcGxldGVkKVxufSk7XG5cbmdhbGxlcnlBY3Rpb25zLmFkZEFzeW5jQWN0aW9uKCd1cGRhdGUnLCAoKSA9PiB7XG5cdGNvbnNvbGUubG9nKCd0b2RvJyk7XG59KTtcblxuZ2FsbGVyeUFjdGlvbnMuYWRkQXN5bmNBY3Rpb24oJ25hdmlnYXRlJywgZm9sZGVyID0+IHtcblx0QVBJLmdldEZvbGRlckRhdGEoe2ZvbGRlcn0sIGdhbGxlcnlBY3Rpb25zLm5hdmlnYXRlLmNvbXBsZXRlZCk7XG59KTtcblxuZ2FsbGVyeUFjdGlvbnMuYWRkQXN5bmNBY3Rpb24oJ3BhZ2UnLCBwYXJhbXMgPT4ge1xuXHRBUEkuZ2V0Rm9sZGVyRGF0YShwYXJhbXMsIGdhbGxlcnlBY3Rpb25zLnBhZ2UuY29tcGxldGVkKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnYWxsZXJ5QWN0aW9ucztcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0X3VybHM6IHt9LFxuXG5cdHNldFVSTHMgKHVybHMpIHtcblx0XHR0aGlzLl91cmxzID0gdXJscztcblx0fSxcblxuXHRnZXRGb2xkZXJEYXRhIChwYXJhbXMsIG9uQ29tcGxldGUpIHtcblx0XHQkLmFqYXgoe1xuXHRcdFx0dXJsOiB0aGlzLl91cmxzLmRhdGFfdXJsLFxuXHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdGRhdGE6IHBhcmFtcyxcblx0XHRcdHN1Y2Nlc3M6IG9uQ29tcGxldGVcblx0XHR9KTtcblx0fSxcblxuXHRkZXN0cm95SXRlbSAoaWQsIG9uQ29tcGxldGUpIHtcblx0XHQkLmFqYXgoe1xuXHRcdFx0dXJsOiB0aGlzLl91cmxzLmRlbGV0ZV91cmwsXG5cdFx0XHRkYXRhOiB7aWR9LFxuXHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0XHRzdWNjZXNzOiBvbkNvbXBsZXRlXG5cdFx0fSk7IFxuXHR9XG59IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBJbnB1dEZpZWxkIGZyb20gJy4vaW5wdXRGaWVsZCc7XG5pbXBvcnQgZWRpdG9yQWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZWRpdG9yQWN0aW9ucyc7XG5pbXBvcnQgZWRpdG9yU3RvcmUgZnJvbSAnLi4vc3RvcmUvZWRpdG9yU3RvcmUnO1xuXG4vKipcbiAqIEBmdW5jIGdldEVkaXRvclN0b3JlU3RhdGVcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKiBAZGVzYyBGYWN0b3J5IGZvciBnZXR0aW5nIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBJdGVtU3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGdldEVkaXRvclN0b3JlU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmllbGRzOiBlZGl0b3JTdG9yZS5nZXRBbGwoKVxuICAgIH07XG59XG5cbi8qKlxuICogQGZ1bmMgRWRpdG9yXG4gKiBAZGVzYyBVc2VkIHRvIGVkaXQgdGhlIHByb3BlcnRpZXMgb2YgYW4gSXRlbS5cbiAqL1xuY2xhc3MgRWRpdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICAvLyBNYW51YWxseSBiaW5kIHNvIGxpc3RlbmVycyBhcmUgcmVtb3ZlZCBjb3JyZWN0bHlcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKTtcblxuICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgc3RvcmUuXG4gICAgICAgIGVkaXRvckFjdGlvbnMuY3JlYXRlKHsgbmFtZTogJ3RpdGxlJywgdmFsdWU6IHByb3BzLml0ZW0udGl0bGUgfSwgdHJ1ZSk7XG4gICAgICAgIGVkaXRvckFjdGlvbnMuY3JlYXRlKHsgbmFtZTogJ2ZpbGVuYW1lJywgdmFsdWU6IHByb3BzLml0ZW0uZmlsZW5hbWUgfSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IGdldEVkaXRvclN0b3JlU3RhdGUoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgICAgIGVkaXRvclN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICAgICAgZWRpdG9yU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgdGV4dEZpZWxkcyA9IHRoaXMuZ2V0VGV4dEZpZWxkQ29tcG9uZW50cygpO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZWRpdG9yJz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVCYWNrLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICBCYWNrIHRvIGdhbGxlcnlcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mbyBub2xhYmVsJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1wcmV2aWV3IG5vbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSd0aHVtYm5haWwtcHJldmlldycgc3JjPXt0aGlzLnByb3BzLml0ZW0udXJsfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tZGF0YSBub2xhYmVsJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIG5vbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+RmlsZSB0eXBlOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLnR5cGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkZpbGUgc2l6ZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0uc2l6ZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPlVSTDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e3RoaXMucHJvcHMuaXRlbS51cmx9IHRhcmdldD0nX2JsYW5rJz57dGhpcy5wcm9wcy5pdGVtLnVybH08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+Rmlyc3QgdXBsb2FkZWQ6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5pdGVtLmNyZWF0ZWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgZGF0ZV9kaXNhYmxlZCByZWFkb25seSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPkxhc3QgY2hhbmdlZDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLml0ZW0ubGFzdFVwZGF0ZWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz5EaW1lbnNpb25zOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuaXRlbS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMud2lkdGh9IHgge3RoaXMucHJvcHMuaXRlbS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMuaGVpZ2h0fXB4PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICB7dGV4dEZpZWxkc31cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdzdWJtaXQnPlNhdmU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBvbkNsaWNrPXt0aGlzLmhhbmRsZUNhbmNlbC5iaW5kKHRoaXMpfSA+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGdldFRleHRGaWVsZENvbXBvbmVudHNcbiAgICAgKiBAZGVzYyBHZW5lcmF0ZXMgdGhlIGVkaXRhYmxlIHRleHQgZmllbGQgY29tcG9uZW50cyBmb3IgdGhlIGZvcm0uXG4gICAgICovXG4gICAgZ2V0VGV4dEZpZWxkQ29tcG9uZW50cygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuc3RhdGUuZmllbGRzKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgdmFyIGZpZWxkID0gdGhpcy5zdGF0ZS5maWVsZHNba2V5XTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgdGV4dCcga2V5PXtrZXl9PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57ZmllbGQubmFtZX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxJbnB1dEZpZWxkIG5hbWU9e2ZpZWxkLm5hbWV9IHZhbHVlPXtmaWVsZC52YWx1ZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIG9uQ2hhbmdlXG4gICAgICogQGRlc2MgVXBkYXRlcyB0aGUgZWRpdG9yIHN0YXRlIHdoZW4gc29tZXRoaW5nIGNoYW5nZXMgaW4gdGhlIHN0b3JlLlxuICAgICAqL1xuICAgIG9uQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKGdldEVkaXRvclN0b3JlU3RhdGUoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlQmFja1xuICAgICAqIEBkZXNjIEhhbmRsZXMgY2xpY2tzIG9uIHRoZSBiYWNrIGJ1dHRvbi4gU3dpdGNoZXMgYmFjayB0byB0aGUgJ2dhbGxlcnknIHZpZXcuXG4gICAgICovXG4gICAgaGFuZGxlQmFjaygpIHtcbiAgICAgICAgZWRpdG9yQWN0aW9ucy5jbGVhcih0cnVlKTtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRFZGl0aW5nKGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBoYW5kbGVTYXZlXG4gICAgICogQGRlc2MgSGFuZGxlcyBjbGlja3Mgb24gdGhlIHNhdmUgYnV0dG9uXG4gICAgICovXG4gICAgaGFuZGxlU2F2ZSgpIHtcbiAgICAgICAgLy8gVE9ETzpcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBoYW5kbGVDYW5jZWxcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnRcbiAgICAgKiBAZGVzYyBSZXNldHMgdGhlIGZvcm0gdG8gaXQncyBvcmlnaW9uYWwgc3RhdGUuXG4gICAgICovXG4gICAgaGFuZGxlQ2FuY2VsKCkge1xuICAgICAgICBlZGl0b3JBY3Rpb25zLnVwZGF0ZSh7IG5hbWU6ICd0aXRsZScsIHZhbHVlOiB0aGlzLnByb3BzLml0ZW0udGl0bGUgfSk7XG4gICAgICAgIGVkaXRvckFjdGlvbnMudXBkYXRlKHsgbmFtZTogJ2ZpbGVuYW1lJywgdmFsdWU6IHRoaXMucHJvcHMuaXRlbS5maWxlbmFtZSB9KTtcbiAgICB9XG5cbn1cblxuRWRpdG9yLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIHNldEVkaXRpbmc6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBFZGl0b3I7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBFZGl0b3IgZnJvbSAnLi9lZGl0b3InO1xuaW1wb3J0IEl0ZW0gZnJvbSAnLi9pdGVtJztcbmltcG9ydCBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZ2FsbGVyeUFjdGlvbnMnO1xuaW1wb3J0IGl0ZW1TdG9yZSBmcm9tICcuLi9zdG9yZS9pdGVtU3RvcmUnO1xuaW1wb3J0IEFQSSBmcm9tICcuLi9hcGkvQVBJJztcbi8qKlxuICogQGZ1bmMgZ2V0SXRlbVN0b3JlU3RhdGVcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKiBAZGVzYyBGYWN0b3J5IGZvciBnZXR0aW5nIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBJdGVtU3RvcmUuXG4gKi9cbmZ1bmN0aW9uIGdldEl0ZW1TdG9yZVN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGl0ZW1zOiBpdGVtU3RvcmUuZ2V0QWxsKClcbiAgICB9O1xufVxuXG5jbGFzcyBHYWxsZXJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICB2YXIgaXRlbXMgPSB3aW5kb3cuU1NfQVNTRVRfR0FMTEVSWVt0aGlzLnByb3BzLm5hbWVdO1xuXG4gICAgICAgIC8vIE1hbnVhbGx5IGJpbmQgc28gbGlzdGVuZXJzIGFyZSByZW1vdmVkIGNvcnJlY3RseVxuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIGdhbGxlcnlBY3Rpb25zLnNldFN0b3JlUHJvcHMoe1xuICAgICAgICAgICAgaW5pdGlhbF9mb2xkZXI6IHByb3BzLmluaXRpYWxfZm9sZGVyLFxuICAgICAgICAgICAgbGltaXQ6IHByb3BzLmxpbWl0XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgQVBJLnNldFVSTHMoe1xuICAgICAgICAgICAgZGF0YV91cmw6IHByb3BzLmRhdGFfdXJsLFxuICAgICAgICAgICAgdXBkYXRlX3VybDogcHJvcHMudXBkYXRlX3VybCxcbiAgICAgICAgICAgIGRlbGV0ZV91cmw6IHByb3BzLmRlbGV0ZV91cmwsICAgICAgICBcdFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgc3RvcmUuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGdhbGxlcnlBY3Rpb25zLmNyZWF0ZShpdGVtc1tpXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGdhbGxlcnkuXG4gICAgICAgIHRoaXMuc3RhdGUgPSAkLmV4dGVuZChnZXRJdGVtU3RvcmVTdGF0ZSgpLCB7IGVkaXRpbmc6IGZhbHNlLCBjdXJyZW50SXRlbTogbnVsbCB9KTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgICAgIC8vIEB0b2RvXG4gICAgICAgIC8vIGlmIHdlIHdhbnQgdG8gaG9vayBpbnRvIGRpcnR5IGNoZWNraW5nLCB3ZSBuZWVkIHRvIGZpbmQgYSB3YXkgb2YgcmVmcmVzaGluZ1xuICAgICAgICAvLyBhbGwgbG9hZGVkIGRhdGEgbm90IGp1c3QgdGhlIGZpcnN0IHBhZ2UgYWdhaW4uLi5cblxuICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKCcuY21zLWNvbnRlbnQtZmllbGRzJyk7XG5cbiAgICAgICAgaWYgKCRjb250ZW50Lmxlbmd0aCkge1xuICAgICAgICAgICAgJGNvbnRlbnQub24oJ3Njcm9sbCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgkY29udGVudFswXS5zY3JvbGxIZWlnaHQgLSAkY29udGVudFswXS5zY3JvbGxUb3AgPT09ICRjb250ZW50WzBdLmNsaWVudEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBnYWxsZXJ5QWN0aW9ucy5wYWdlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZSk7ICAgICAgICBcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgICAgIGl0ZW1TdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmcpIHtcbiAgICAgICAgICAgIGxldCBlZGl0b3JDb21wb25lbnQgPSB0aGlzLmdldEVkaXRvckNvbXBvbmVudCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5Jz5cbiAgICAgICAgICAgICAgICAgICAge2VkaXRvckNvbXBvbmVudH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaXRlbXMgPSB0aGlzLmdldEl0ZW1Db21wb25lbnRzKCk7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKGl0ZW1TdG9yZS5oYXNOYXZpZ2F0ZWQoKSkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbiA9IDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZU5hdmlnYXRlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICBCYWNrXG4gICAgICAgICAgICAgICAgPC9idXR0b24+O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5Jz5cbiAgICAgICAgICAgICAgICAgICAge2J1dHRvbn1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2l0ZW1zJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlTmF2aWdhdGUoKSB7XG4gICAgICAgIGxldCBuYXZpZ2F0aW9uID0gaXRlbVN0b3JlLnBvcE5hdmlnYXRpb24oKTtcblxuICAgICAgICBnYWxsZXJ5QWN0aW9ucy5uYXZpZ2F0ZShuYXZpZ2F0aW9uWzFdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBvbkNoYW5nZVxuICAgICAqIEBkZXNjIFVwZGF0ZXMgdGhlIGdhbGxlcnkgc3RhdGUgd2hlbiBzb21ldGhuaWcgY2hhbmdlcyBpbiB0aGUgc3RvcmUuXG4gICAgICovXG4gICAgb25DaGFuZ2UoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoZ2V0SXRlbVN0b3JlU3RhdGUoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgc2V0RWRpdGluZ1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNFZGl0aW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtpZF1cbiAgICAgKiBAZGVzYyBTd2l0Y2hlcyBiZXR3ZWVuIGVkaXRpbmcgYW5kIGdhbGxlcnkgc3RhdGVzLlxuICAgICAqL1xuICAgIHNldEVkaXRpbmcoaXNFZGl0aW5nLCBpZCkge1xuICAgICAgICB2YXIgbmV3U3RhdGUgPSB7IGVkaXRpbmc6IGlzRWRpdGluZyB9O1xuXG4gICAgICAgIGlmIChpZCAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudEl0ZW0gPSBpdGVtU3RvcmUuZ2V0QnlJZChpZCk7XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50SXRlbSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSgkLmV4dGVuZChuZXdTdGF0ZSwgeyBjdXJyZW50SXRlbTogY3VycmVudEl0ZW0gfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBnZXRFZGl0b3JDb21wb25lbnRcbiAgICAgKiBAZGVzYyBHZW5lcmF0ZXMgdGhlIGVkaXRvciBjb21wb25lbnQuXG4gICAgICovXG4gICAgZ2V0RWRpdG9yQ29tcG9uZW50KCkge1xuICAgICAgICB2YXIgcHJvcHMgPSB7fTtcblxuICAgICAgICBwcm9wcy5pdGVtID0gdGhpcy5zdGF0ZS5jdXJyZW50SXRlbTtcbiAgICAgICAgcHJvcHMuc2V0RWRpdGluZyA9IHRoaXMuc2V0RWRpdGluZy5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8RWRpdG9yIHsuLi5wcm9wc30gLz5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZnVuYyBnZXRJdGVtQ29tcG9uZW50c1xuICAgICAqIEBkZXNjIEdlbmVyYXRlcyB0aGUgaXRlbSBjb21wb25lbnRzIHdoaWNoIHBvcHVsYXRlIHRoZSBnYWxsZXJ5LlxuICAgICAqL1xuICAgIGdldEl0ZW1Db21wb25lbnRzKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuc3RhdGUuaXRlbXMpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHNlbGYuc3RhdGUuaXRlbXNba2V5XSxcbiAgICAgICAgICAgICAgICBwcm9wcyA9IHt9O1xuXG4gICAgICAgICAgICBwcm9wcy5hdHRyaWJ1dGVzID0gaXRlbS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgcHJvcHMuaWQgPSBpdGVtLmlkO1xuICAgICAgICAgICAgcHJvcHMuc2V0RWRpdGluZyA9IHRoaXMuc2V0RWRpdGluZy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgcHJvcHMudGl0bGUgPSBpdGVtLnRpdGxlO1xuICAgICAgICAgICAgcHJvcHMudXJsID0gaXRlbS51cmw7XG4gICAgICAgICAgICBwcm9wcy50eXBlID0gaXRlbS50eXBlO1xuICAgICAgICAgICAgcHJvcHMuZmlsZW5hbWUgPSBpdGVtLmZpbGVuYW1lO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxJdGVtIGtleT17a2V5fSB7Li4ucHJvcHN9IC8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbGxlcnk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGVkaXRvckFjdGlvbnMgZnJvbSAnLi4vYWN0aW9uL2VkaXRvckFjdGlvbnMnO1xuXG5jbGFzcyBJbnB1dEZpZWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxpbnB1dCBjbGFzc05hbWU9J3RleHQnIHR5cGU9J3RleHQnIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0gLz5cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIGhhbmRsZUNoYW5nZVxuXHQgKiBAcGFyYW0ge29iamVjdH0gZXZlbnRcblx0ICogQGRlc2MgSGFuZGxlcyB0aGUgY2hhbmdlIGV2ZW50cyBvbiBpbnB1dCBmaWVsZHMuXG5cdCAqL1xuXHRoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcblx0XHRlZGl0b3JBY3Rpb25zLnVwZGF0ZSh7IG5hbWU6IHRoaXMucHJvcHMubmFtZSwgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcblx0fVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IElucHV0RmllbGQ7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGdhbGxlcnlBY3Rpb25zIGZyb20gJy4uL2FjdGlvbi9nYWxsZXJ5QWN0aW9ucyc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmNsYXNzIEl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgc3R5bGVzID0ge2JhY2tncm91bmRJbWFnZTogJ3VybCgnICsgdGhpcy5wcm9wcy51cmwgKyAnKSd9LFxuICAgICAgICAgICAgdGh1bWJuYWlsQ2xhc3NOYW1lcyA9ICdpdGVtX190aHVtYm5haWwnO1xuXG4gICAgICAgIGlmICh0aGlzLmltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpKSB7XG4gICAgICAgICAgICB0aHVtYm5haWxDbGFzc05hbWVzICs9ICcgbGFyZ2UnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5hdmlnYXRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgYSBmb2xkZXInKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5wcm9wcy50eXBlID09PSAnZm9sZGVyJykge1xuICAgICAgICAgICAgbmF2aWdhdGUgPSB0aGlzLmhhbmRsZU5hdmlnYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2l0ZW0nIG9uQ2xpY2s9e25hdmlnYXRlfT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGh1bWJuYWlsQ2xhc3NOYW1lc30gc3R5bGU9e3N0eWxlc30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLWVkaXQgWyBmb250LWljb24tcGVuY2lsIF0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRWRpdC5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXJlbW92ZSBbIGZvbnQtaWNvbi10cmFzaCBdJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZURlbGV0ZS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSdpdGVtX190aXRsZSc+e3RoaXMucHJvcHMudGl0bGV9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmMgaGFuZGxlRWRpdFxuICAgICAqIEBkZXNjIEV2ZW50IGhhbmRsZXIgZm9yIHRoZSAnZWRpdCcgYnV0dG9uLlxuICAgICAqL1xuICAgIGhhbmRsZUVkaXQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0RWRpdGluZyh0cnVlLCB0aGlzLnByb3BzLmlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciB0aGUgJ2VkaXQnIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBoYW5kbGVOYXZpZ2F0ZSgpIHtcbiAgICAgICAgZ2FsbGVyeUFjdGlvbnMubmF2aWdhdGUodGhpcy5wcm9wcy5maWxlbmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgdGhlICdyZW1vdmUnIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBoYW5kbGVEZWxldGUoKSB7XG4gICAgICAgIC8vVE9ETyBpbnRlcm5hdGlvbmFsaXNlIGNvbmZpcm1hdGlvbiBtZXNzYWdlIHdpdGggdHJhbnNpZmV4IGlmL3doZW4gbWVyZ2VkIGludG8gY29yZVxuICAgICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHJlY29yZD8nKSkge1xuICAgICAgICAgICAgZ2FsbGVyeUFjdGlvbnMuZGVzdHJveSh0aGlzLnByb3BzLmlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBmdW5jIGltYWdlTGFyZ2VyVGhhblRodW1ibmFpbFxuICAgICAqIEBkZXNjIENoZWNrIGlmIGFuIGltYWdlIGlzIGxhcmdlciB0aGFuIHRoZSB0aHVtYm5haWwgY29udGFpbmVyLlxuICAgICAqL1xuICAgIGltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0cmlidXRlcy5kaW1lbnNpb25zLmhlaWdodCA+IENPTlNUQU5UUy5JVEVNX0NPTVBPTkVOVC5USFVNQk5BSUxfSEVJR0hUIHx8IFxuICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMud2lkdGggPiBDT05TVEFOVFMuSVRFTV9DT01QT05FTlQuVEhVTUJOQUlMX1dJRFRIO1xuICAgIH1cbn1cblxuSXRlbS5wcm9wVHlwZXMgPSB7XG4gICAgYXR0cmlidXRlczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBpZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBzZXRFZGl0aW5nOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICB1cmw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG4iLCJjb25zdCBDT05TVEFOVFMgPSB7XG5cdElURU1fU1RPUkU6IHtcblx0XHRJTklUOiAnaW5pdCcsXG5cdFx0Q0hBTkdFOiAnY2hhbmdlJyxcblx0XHRDUkVBVEU6ICdjcmVhdGUnLFxuXHRcdFVQREFURTogJ3VwZGF0ZScsXG5cdFx0REVTVFJPWTogJ2Rlc3Ryb3knLFxuXHRcdE5BVklHQVRFOiAnbmF2aWdhdGUnLFxuXHRcdFBBR0U6ICdwYWdlJ1xuXHR9LFxuXHRFRElUT1I6IHtcblx0XHRDSEFOR0U6ICdjaGFuZ2UnLFxuXHRcdFVQREFURTogJ3VwZGF0ZScsXG5cdFx0Q0xFQVI6ICdjbGVhcidcblx0fSxcblx0SVRFTV9DT01QT05FTlQ6IHtcblx0XHRUSFVNQk5BSUxfSEVJR0hUOiAxNTAsXG5cdFx0VEhVTUJOQUlMX1dJRFRIOiAyMDBcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ09OU1RBTlRTO1xuIiwiaW1wb3J0IHtEaXNwYXRjaGVyfSBmcm9tICdmbHV4JztcblxubGV0IF9lZGl0b3JEaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTsgLy8gU2luZ2xldG9uXG5cbmV4cG9ydCBkZWZhdWx0IF9lZGl0b3JEaXNwYXRjaGVyO1xuIiwiaW1wb3J0IHtEaXNwYXRjaGVyfSBmcm9tICdmbHV4JztcblxubGV0IF9nYWxsZXJ5RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7IC8vIFNpbmdsZXRvblxuXG5leHBvcnQgZGVmYXVsdCBfZ2FsbGVyeURpc3BhdGNoZXI7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBHYWxsZXJ5IGZyb20gJy4vY29tcG9uZW50L2dhbGxlcnknO1xuXG4kKCcuYXNzZXQtZ2FsbGVyeScpLmVudHdpbmUoe1xuXHQnb25hZGQnOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHByb3BzID0ge307XG5cblx0XHRwcm9wcy5uYW1lID0gdGhpc1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtZ2FsbGVyeS1uYW1lJyk7XG5cdFx0cHJvcHMuZGF0YV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRhdGEtdXJsJyk7XG5cdFx0cHJvcHMudXBkYXRlX3VybCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktdXBkYXRlLXVybCcpO1xuXHRcdHByb3BzLmRlbGV0ZV91cmwgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1hc3NldC1nYWxsZXJ5LWRlbGV0ZS11cmwnKTtcblx0XHRwcm9wcy5pbml0aWFsX2ZvbGRlciA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktaW5pdGlhbC1mb2xkZXInKTtcblx0XHRwcm9wcy5saW1pdCA9IHRoaXNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LWdhbGxlcnktbGltaXQnKTtcblxuXHRcdGlmIChwcm9wcy5uYW1lID09PSBudWxsIHx8IHByb3BzLnVybCA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdFJlYWN0LnJlbmRlcihcblx0XHRcdDxHYWxsZXJ5IHsuLi5wcm9wc30gLz4sXG5cdFx0XHR0aGlzWzBdXG5cdFx0KTtcblx0fVxufSk7XG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvciAoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLmN1c3RvbUxpc3RlbmVycyA9IHt9O1x0XHRcblx0fVxuXG5cdHN0YXRpYyBnZXRBY3Rpb25TZXRzICgpIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHRsaXN0ZW5UbyAoYWN0aW9uU2V0LCBhY3Rpb24sIGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5jdXN0b21MaXN0ZW5lcnNbYCR7YWN0aW9uU2V0LmlkZW50aWZpZXJ9LiR7YWN0aW9ufWBdID0gY2FsbGJhY2s7XG5cdH1cblxuXG5cdGhhbmRsZUFjdGlvbiAoYWN0aW9uLCBwYXJhbXMpIHtcblx0XHRsZXQgbWV0aG9kID0gdGhpcy5jdXN0b21MaXN0ZW5lcnNbYWN0aW9uXTtcblxuXHRcdGlmKCFtZXRob2QpIHtcblx0XHRcdGxldCBuYW1lID0gYWN0aW9uLnNwbGl0KCcuJykucG9wKCk7XG5cdFx0XHRsZXQgY2FwTmFtZSA9IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpO1x0XHRcdFx0XG5cdFx0XHRtZXRob2QgPSB0aGlzW2BvbiR7Y2FwTmFtZX1gXTtcblx0XHR9XG5cblx0XHRpZihtZXRob2QpIHtcblx0XHRcdG1ldGhvZC5jYWxsKHRoaXMsIC4uLnBhcmFtcyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIGVtaXRDaGFuZ2Vcblx0ICogQGRlc2MgVHJpZ2dlcmVkIHdoZW4gc29tZXRoaW5nIGNoYW5nZXMgaW4gdGhlIHN0b3JlLlxuXHQgKi9cblx0ZW1pdENoYW5nZSgpIHtcblx0XHR0aGlzLmVtaXQoQ09OU1RBTlRTLklURU1fU1RPUkUuQ0hBTkdFKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKi9cblx0YWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcblx0XHR0aGlzLm9uKENPTlNUQU5UUy5JVEVNX1NUT1JFLkNIQU5HRSwgY2FsbGJhY2spO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqL1xuXHRyZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoQ09OU1RBTlRTLklURU1fU1RPUkUuQ0hBTkdFLCBjYWxsYmFjayk7XG5cdH1cblxufSIsImltcG9ydCBlZGl0b3JEaXNwYXRjaGVyIGZyb20gJy4uL2Rpc3BhdGNoZXIvZWRpdG9yRGlzcGF0Y2hlcic7XG5pbXBvcnQgZWRpdG9yQWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZWRpdG9yQWN0aW9ucyc7XG5pbXBvcnQgQmFzZVN0b3JlIGZyb20gJy4vYmFzZVN0b3JlJztcblxubGV0IF9maWVsZHMgPSBbXTtcblxuY2xhc3MgRWRpdG9yU3RvcmUgZXh0ZW5kcyBCYXNlU3RvcmUge1xuXG5cdHN0YXRpYyBnZXRBY3Rpb25TZXRzICgpIHtcblx0XHRyZXR1cm4gW2VkaXRvckFjdGlvbnNdXG5cdH1cblxuXHRvbkNyZWF0ZSAoZGF0YSkge1xuXHRcdGNvbnN0IGZpZWxkRXhpc3RzID0gX2ZpZWxkcy5zb21lKGZpZWxkID0+IGZpZWxkLm5hbWUgPT09IGRhdGEubmFtZSk7XG5cblx0XHRpZiAoZmllbGRFeGlzdHMpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRfZmllbGRzLnB1c2goe1xuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxuXHRcdFx0dmFsdWU6IGRhdGEudmFsdWVcblx0XHR9KTtcblxuXHRcdHRoaXMuZW1pdENoYW5nZSgpO1xuXHR9XG5cblx0b25VcGRhdGUgKGRhdGEpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IF9maWVsZHMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGlmIChfZmllbGRzW2ldLm5hbWUgPT09IGRhdGEubmFtZSkge1xuXHRcdFx0XHRfZmllbGRzW2ldID0gZGF0YTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cdH1cblxuXHRvbkNsZWFyICgpIHtcblx0XHRfZmllbGRzID0gW107XG5cblx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0fVxuXHQvKipcblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKiBAZGVzYyBHZXRzIHRoZSBlbnRpcmUgY29sbGVjdGlvbiBvZiBpdGVtcy5cblx0ICovXG5cdGdldEFsbCgpIHtcblx0XHRyZXR1cm4gX2ZpZWxkcztcblx0fVxuXG5cdC8qKlxuXHQgKiBAZnVuYyBlbWl0Q2hhbmdlXG5cdCAqIEBkZXNjIFRyaWdnZXJlZCB3aGVuIHNvbWV0aGluZyBjaGFuZ2VzIGluIHRoZSBzdG9yZS5cblx0ICovXG5cdGVtaXRDaGFuZ2UoKSB7XG5cdFx0dGhpcy5lbWl0KENPTlNUQU5UUy5FRElUT1IuQ0hBTkdFKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKi9cblx0YWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcblx0XHR0aGlzLm9uKENPTlNUQU5UUy5FRElUT1IuQ0hBTkdFLCBjYWxsYmFjayk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcblx0ICovXG5cdHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcihDT05TVEFOVFMuRURJVE9SLkNIQU5HRSwgY2FsbGJhY2spO1xuXHR9XG5cbn1cblxubGV0IF9lZGl0b3JTdG9yZSA9IG5ldyBFZGl0b3JTdG9yZSgpOyAvLyBTaW5nbGV0b24uXG5cbmVkaXRvckRpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24gKHBheWxvYWQpIHtcblx0X2VkaXRvclN0b3JlLmhhbmRsZUFjdGlvbihwYXlsb2FkLmFjdGlvbiwgcGF5bG9hZC5wYXJhbXMpO1xuXG5cdHJldHVybiB0cnVlO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF9lZGl0b3JTdG9yZTtcbiIsImltcG9ydCBnYWxsZXJ5RGlzcGF0Y2hlciBmcm9tICcuLi9kaXNwYXRjaGVyL2dhbGxlcnlEaXNwYXRjaGVyJztcbmltcG9ydCBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi9hY3Rpb24vZ2FsbGVyeUFjdGlvbnMnO1xuaW1wb3J0IEJhc2VTdG9yZSBmcm9tICcuL2Jhc2VTdG9yZSc7XG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuXG5sZXQgX2l0ZW1zID0gW107XG5sZXQgX2ZvbGRlcnMgPSBbXTtcbmxldCBfY3VycmVudEZvbGRlciA9IG51bGw7XG5cbmNvbnN0IF9maWx0ZXJzID0ge1xuXHQncGFnZSc6IDEsXG5cdCdsaW1pdCc6IDEwXG59O1xuXG5jbGFzcyBJdGVtU3RvcmUgZXh0ZW5kcyBCYXNlU3RvcmUge1xuXG5cdHN0YXRpYyBnZXRBY3Rpb25TZXRzICgpIHtcblx0XHRyZXR1cm4gW2dhbGxlcnlBY3Rpb25zXTtcblx0fVxuXG5cdG9uU2V0U3RvcmVQcm9wcyAoZGF0YSkge1xuXHRcdE9iamVjdC5rZXlzKGRhdGEpLm1hcCgoa2V5KSA9PiB7XG5cdFx0XHR0aGlzW2tleV0gPSBkYXRhW2tleV07XG5cdFx0fSk7XHRcdFxuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIG9uQ3JlYXRlXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtRGF0YVxuXHQgKiBAZGVzYyBBZGRzIGEgZ2FsbGVyeSBpdGVtIHRvIHRoZSBzdG9yZS5cblx0ICovXG5cdG9uQ3JlYXRlIChpdGVtRGF0YSkge1xuXHRcdGNvbnN0IGl0ZW1FeGlzdHMgPSBfaXRlbXMuc29tZShpdGVtID0+IHsgaXRlbS5pZCA9PT0gaXRlbURhdGEuaWQ7IH0pO1xuXG5cdFx0aWYgKGl0ZW1FeGlzdHMpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRfaXRlbXMucHVzaChpdGVtRGF0YSk7XG5cblx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0fVxuXG5cdG9uTmF2aWdhdGUgKGZvbGRlcikge1xuXHRcdC8vIENvdWxkIGZpbmQgYSBjYWNoZWQgY29weSBoZXJlIGFuZCB0cmlnZ2VyIGEgY2hhbmdlIGFoZWFkIG9mIHRoZSBYSFJcblxuXG5cdFx0aWYgKGZvbGRlciAhPT0gX2l0ZW1TdG9yZS5pbml0aWFsX2ZvbGRlcikge1xuXHRcdFx0X2ZvbGRlcnMucHVzaChbZm9sZGVyLCBfY3VycmVudEZvbGRlciB8fCBfaXRlbVN0b3JlLmluaXRpYWxfZm9sZGVyXSk7XG5cdFx0fVxuXG5cdFx0X2N1cnJlbnRGb2xkZXIgPSBmb2xkZXI7XG5cdH1cblxuXHRvbk5hdmlnYXRlQ29tcGxldGVkIChkYXRhKSB7XG5cdFx0X2l0ZW1zID0gZGF0YS5maWxlcztcblx0XHRfZmlsdGVycy5jb3VudCA9IGRhdGEuY291bnQ7XG5cblx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0fVxuXG5cdG9uRGVzdHJveSAoaWQpIHtcblx0XHQvLyBvcHRpbWlzdGljYWxseSBkZXN0cm95XG5cdFx0X2l0ZW1zID0gX2l0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uaWQgIT09IGlkKTtcblx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0fVxuXG5cdG9uRGVzdHJveUNvbXBsZXRlZCAoZGF0YSkge1xuXHRcdC8vIHRoaXMgY291bGQgYmUgdXNlZCB0byByZXBsYWNlIHRoZSBpdGVtIGlmIHRoZSBzZXJ2ZXIgZGF0YSBkb2Vzbid0IGxvb2sgcmlnaHQuXG5cdH1cblxuXHRvblBhZ2VDb21wbGV0ZWQgKGRhdGEpIHtcblx0XHRfaXRlbXMgPSBfaXRlbXMuY29uY2F0KGRhdGEuZmlsZXMpO1xuXG5cdFx0dGhpcy5lbWl0Q2hhbmdlKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBnYWxsZXJ5IGhhcyBiZWVuIG5hdmlnYXRlZC5cblx0ICovXG5cdGhhc05hdmlnYXRlZCgpIHtcblx0XHRyZXR1cm4gX2ZvbGRlcnMubGVuZ3RoID4gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBmb2xkZXIgc3RhY2suXG5cdCAqL1xuXHRwb3BOYXZpZ2F0aW9uKCkge1xuXHRcdHJldHVybiBfZm9sZGVycy5wb3AoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHtvYmplY3R9XG5cdCAqIEBkZXNjIEdldHMgdGhlIGVudGlyZSBjb2xsZWN0aW9uIG9mIGl0ZW1zLlxuXHQgKi9cblx0Z2V0QWxsKCkge1xuXHRcdHJldHVybiBfaXRlbXM7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZ2V0QnlJZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaWRcblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKi9cblx0Z2V0QnlJZChpZCkge1xuXHRcdHZhciBpdGVtID0gbnVsbDtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgX2l0ZW1zLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRpZiAoX2l0ZW1zW2ldLmlkID09PSBpZCkge1xuXHRcdFx0XHRpdGVtID0gX2l0ZW1zW2ldO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbTtcblx0fVxuXG59XG5cbmNvbnN0IF9pdGVtU3RvcmUgPSBuZXcgSXRlbVN0b3JlKCk7IC8vIFNpbmdsZXRvblxuXG5nYWxsZXJ5RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbiAocGF5bG9hZCkge1xuXHRfaXRlbVN0b3JlLmhhbmRsZUFjdGlvbihwYXlsb2FkLmFjdGlvbiwgcGF5bG9hZC5wYXJhbXMpO1xuXG5cdHJldHVybiB0cnVlO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF9pdGVtU3RvcmU7XG4iXX0=

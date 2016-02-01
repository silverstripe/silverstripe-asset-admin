(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

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

	function FileBackend(fetch_url, search_url, update_url, delete_url, limit, bulkActions, $folder, currentFolder) {
		_classCallCheck(this, FileBackend);

		_get(Object.getPrototypeOf(FileBackend.prototype), 'constructor', this).call(this);

		this.fetch_url = fetch_url;
		this.search_url = search_url;
		this.update_url = update_url;
		this.delete_url = delete_url;
		this.limit = limit;
		this.bulkActions = bulkActions;
		this.$folder = $folder;
		this.folder = currentFolder;

		this.page = 1;
	}

	/**
  * @func fetch
  * @param number id
  * @desc Fetches a collection of Files by ParentID.
  */

	_createClass(FileBackend, [{
		key: 'fetch',
		value: function fetch(id) {
			var _this = this;

			if (typeof id === 'undefined') {
				return;
			}

			this.page = 1;

			this.request('POST', this.fetch_url, { id: id }).then(function (json) {
				_this.emit('onFetchData', json);
			});
		}
	}, {
		key: 'search',
		value: function search() {
			var _this2 = this;

			this.page = 1;

			this.request('GET', this.search_url).then(function (json) {
				_this2.emit('onSearchData', json);
			});
		}
	}, {
		key: 'more',
		value: function more() {
			var _this3 = this;

			this.page++;

			this.request('GET', this.search_url).then(function (json) {
				_this3.emit('onMoreData', json);
			});
		}
	}, {
		key: 'navigate',
		value: function navigate(folder) {
			var _this4 = this;

			this.page = 1;
			this.folder = folder;

			this.persistFolderFilter(folder);

			this.request('GET', this.search_url).then(function (json) {
				_this4.emit('onNavigateData', json);
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
			var _this5 = this;

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
				// Using for loop cos IE10 doesn't handle 'for of',
				// which gets transcompiled into a function which uses Symbol,
				// the thing IE10 dies on.
				for (var i = 0; i < filesToDelete.length; i += 1) {
					_this5.emit('onDeleteData', filesToDelete[i]);
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
			var _this6 = this;

			values['id'] = id;

			this.request('POST', this.update_url, values).then(function () {
				_this6.emit('onSaveData', id, values);
			});
		}
	}, {
		key: 'request',
		value: function request(method, url) {
			var _this7 = this;

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

			return _jQuery2['default'].ajax({
				'url': url,
				'method': method,
				'dataType': 'json',
				'data': _jQuery2['default'].extend(defaults, data)
			}).always(function () {
				_this7.hideLoadingIndicator();
			});
		}
	}, {
		key: 'showLoadingIndicator',
		value: function showLoadingIndicator() {
			(0, _jQuery2['default'])('.cms-content, .ui-dialog').addClass('loading');
			(0, _jQuery2['default'])('.ui-dialog-content').css('opacity', '.1');
		}
	}, {
		key: 'hideLoadingIndicator',
		value: function hideLoadingIndicator() {
			(0, _jQuery2['default'])('.cms-content, .ui-dialog').removeClass('loading');
			(0, _jQuery2['default'])('.ui-dialog-content').css('opacity', '1');
		}
	}]);

	return FileBackend;
})(_events2['default']);

exports['default'] = FileBackend;
module.exports = exports['default'];

},{"events":13,"jQuery":"jQuery"}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _stateConfigureStore = require('../state/configureStore');

var _stateConfigureStore2 = _interopRequireDefault(_stateConfigureStore);

var _containersGalleryContainer = require('../containers/gallery-container');

var _containersGalleryContainer2 = _interopRequireDefault(_containersGalleryContainer);

var _backendFileBackend = require('../backend/file-backend');

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

function hasSessionStorage() {
	return typeof window.sessionStorage !== 'undefined' && window.sessionStorage !== null;
}

function getProps(props) {
	var $componentWrapper = (0, _jQuery2['default'])('.asset-gallery').find('.asset-gallery-component-wrapper'),
	    $search = (0, _jQuery2['default'])('.cms-search-form'),
	    initialFolder = (0, _jQuery2['default'])('.asset-gallery').data('asset-gallery-initial-folder'),
	    currentFolder = getVar('q[Folder]') || initialFolder,
	    backend,
	    defaults;

	if ($search.find('[type=hidden][name="q[Folder]"]').length == 0) {
		$search.append('<input type="hidden" name="q[Folder]" />');
	}

	// Do we need to set up a default backend?
	if (typeof props === 'undefined' || typeof props.backend === 'undefined') {
		backend = _backendFileBackend2['default'].create($componentWrapper.data('asset-gallery-fetch-url'), $componentWrapper.data('asset-gallery-search-url'), $componentWrapper.data('asset-gallery-update-url'), $componentWrapper.data('asset-gallery-delete-url'), $componentWrapper.data('asset-gallery-limit'), $componentWrapper.data('asset-gallery-bulk-actions'), $search.find('[type=hidden][name="q[Folder]"]'), currentFolder);

		backend.emit('filter', getVar('q[Name]'), getVar('q[AppCategory]'), getVar('q[Folder]'), getVar('q[CreatedFrom]'), getVar('q[CreatedTo]'), getVar('q[CurrentFolderOnly]'));
	}

	defaults = {
		backend: backend,
		current_folder: currentFolder,
		cmsEvents: {},
		initial_folder: initialFolder,
		name: (0, _jQuery2['default'])('.asset-gallery').data('asset-gallery-name')
	};

	return _jQuery2['default'].extend(true, defaults, props);
}

var props = getProps();
var store = (0, _stateConfigureStore2['default'])(); //Create the redux store

_reactDom2['default'].render(_react2['default'].createElement(
	_reactRedux.Provider,
	{ store: store },
	_react2['default'].createElement(_containersGalleryContainer2['default'], props)
), (0, _jQuery2['default'])('.asset-gallery-component-wrapper')[0]);

},{"../backend/file-backend":1,"../containers/gallery-container":7,"../state/configureStore":9,"jQuery":"jQuery","react":"react","react-dom":"react-dom","react-redux":"react-redux"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var BulkActionsComponent = (function (_SilverStripeComponent) {
	_inherits(BulkActionsComponent, _SilverStripeComponent);

	function BulkActionsComponent(props) {
		_classCallCheck(this, BulkActionsComponent);

		_get(Object.getPrototypeOf(BulkActionsComponent.prototype), 'constructor', this).call(this, props);

		this.onChangeValue = this.onChangeValue.bind(this);
	}

	_createClass(BulkActionsComponent, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var $select = (0, _jQuery2['default'])(_reactDom2['default'].findDOMNode(this)).find('.dropdown');

			$select.chosen({
				'allow_single_deselect': true,
				'disable_search_threshold': 20
			});

			// Chosen stops the change event from reaching React so we have to simulate a click.
			$select.change(function () {
				return _reactAddonsTestUtils2['default'].Simulate.click($select.find(':selected')[0]);
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
			// Using for loop cos IE10 doesn't handle 'for of',
			// which gets transcompiled into a function which uses Symbol,
			// the thing IE10 dies on.
			for (var i = 0; i < this.props.options.length; i += 1) {
				if (this.props.options[i].value === value) {
					return this.props.options[i];
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

			this.setState({ value: option.value });

			if (option.destructive === true) {
				if (confirm(ss.i18n.sprintf(ss.i18n._t('AssetGalleryField.BULK_ACTIONS_CONFIRM'), option.label))) {
					this.applyAction(option.value);
				}
			} else {
				this.applyAction(option.value);
			}

			// Reset the dropdown to it's placeholder value.
			(0, _jQuery2['default'])(_reactDom2['default'].findDOMNode(this)).find('.dropdown').val('').trigger('liszt:updated');
		}
	}]);

	return BulkActionsComponent;
})(_silverstripeComponent2['default']);

exports['default'] = BulkActionsComponent;
;
module.exports = exports['default'];

},{"jQuery":"jQuery","react":"react","react-addons-test-utils":"react-addons-test-utils","react-dom":"react-dom","silverstripe-component":"silverstripe-component"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var EditorComponent = (function (_SilverStripeComponent) {
	_inherits(EditorComponent, _SilverStripeComponent);

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

		this.onFieldChange = this.onFieldChange.bind(this);
		this.onFileSave = this.onFileSave.bind(this);
		this.onCancel = this.onCancel.bind(this);
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
									_i18n2['default']._t('AssetGalleryField.TYPE'),
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
								_i18n2['default']._t('AssetGalleryField.SIZE'),
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
								_i18n2['default']._t('AssetGalleryField.URL'),
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
								_i18n2['default']._t('AssetGalleryField.CREATED'),
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
								_i18n2['default']._t('AssetGalleryField.LASTEDIT'),
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
								_i18n2['default']._t('AssetGalleryField.DIM'),
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
							{ className: 'left', htmlFor: 'gallery_' + field.name },
							field.label
						),
						_react2['default'].createElement(
							'div',
							{ className: 'middleColumn' },
							_react2['default'].createElement('input', { id: 'gallery_' + field.name, className: 'text', type: 'text', onChange: field.onChange, value: _this2.state[field.name] })
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
						_i18n2['default']._t('AssetGalleryField.SAVE')
					),
					_react2['default'].createElement(
						'button',
						{
							type: 'button',
							className: 'ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-cancel-circled',
							onClick: this.onCancel },
						_i18n2['default']._t('AssetGalleryField.CANCEL')
					)
				)
			);
		}
	}]);

	return EditorComponent;
})(_silverstripeComponent2['default']);

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

},{"i18n":"i18n","jQuery":"jQuery","react":"react","silverstripe-component":"silverstripe-component"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = {
	'THUMBNAIL_HEIGHT': 150,
	'THUMBNAIL_WIDTH': 200,
	'SPACE_KEY_CODE': 32,
	'RETURN_KEY_CODE': 13,
	'BULK_ACTIONS': [{
		value: 'delete',
		label: ss.i18n._t('AssetGalleryField.BULK_ACTIONS_DELETE'),
		destructive: true
	}]
};
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _stateGalleryActions = require('../state/gallery/actions');

var galleryActions = _interopRequireWildcard(_stateGalleryActions);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var FileComponent = (function (_SilverStripeComponent) {
	_inherits(FileComponent, _SilverStripeComponent);

	function FileComponent(props) {
		_classCallCheck(this, FileComponent);

		_get(Object.getPrototypeOf(FileComponent.prototype), 'constructor', this).call(this, props);

		this.state = {
			'focussed': false,
			'buttonTabIndex': -1
		};

		this.onFileNavigate = this.onFileNavigate.bind(this);
		this.onFileEdit = this.onFileEdit.bind(this);
		this.onFileDelete = this.onFileDelete.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.preventFocus = this.preventFocus.bind(this);
		this.onFileSelect = this.onFileSelect.bind(this);
	}

	_createClass(FileComponent, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.props.actions.addFile(this);
		}
	}, {
		key: 'handleDoubleClick',
		value: function handleDoubleClick(event) {
			if (event.target !== _reactDom2['default'].findDOMNode(this.refs.title) && event.target !== _reactDom2['default'].findDOMNode(this.refs.thumbnail)) {
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
			this.props.actions.selectFile({
				id: this.props.id,
				selected: !this.props.selected
			});
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
		key: 'isSelected',
		value: function isSelected() {
			return this.props.selectedFiles.indexOf(this.props.id) > -1;
		}
	}, {
		key: 'getItemClassNames',
		value: function getItemClassNames() {
			var itemClassNames = 'item ' + this.props.category;

			if (this.state.focussed) {
				itemClassNames += ' focussed';
			}

			if (this.isSelected()) {
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
			if (event.target !== _reactDom2['default'].findDOMNode(this.refs.thumbnail)) {
				return;
			}

			//If space is pressed, allow focus on buttons
			if (this.props.spaceKey === event.keyCode) {
				event.preventDefault(); //Stop page from scrolling
				this.setState({
					'buttonTabIndex': 0
				});
				(0, _jQuery2['default'])(_reactDom2['default'].findDOMNode(this)).find('.item__actions__action').first().focus();
			}

			//If return is pressed, navigate folder
			if (this.props.returnKey === event.keyCode) {
				this.onFileNavigate();
			}
		}
	}, {
		key: 'handleFocus',
		value: function handleFocus() {
			this.setState({
				'focussed': true,
				'buttonTabIndex': 0
			});
		}
	}, {
		key: 'handleBlur',
		value: function handleBlur() {
			this.setState({
				'focussed': false,
				'buttonTabIndex': -1
			});
		}
	}, {
		key: 'preventFocus',
		value: function preventFocus(event) {
			//To avoid browser's default focus state when selecting an item
			event.preventDefault();
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2['default'].createElement(
				'div',
				{ className: this.getItemClassNames(), 'data-id': this.props.id, onDoubleClick: this.handleDoubleClick },
				_react2['default'].createElement(
					'div',
					{ ref: 'thumbnail', className: this.getThumbnailClassNames(), tabIndex: '0', onKeyDown: this.handleKeyDown, style: this.getThumbnailStyles(), onClick: this.onFileSelect, onMouseDown: this.preventFocus },
					_react2['default'].createElement(
						'div',
						{ className: 'item__actions' },
						_react2['default'].createElement('button', {
							className: 'item__actions__action item__actions__action--select [ font-icon-tick ]',
							type: 'button',
							title: _i18n2['default']._t('AssetGalleryField.SELECT'),
							tabIndex: this.state.buttonTabIndex,
							onClick: this.onFileSelect,
							onFocus: this.handleFocus,
							onBlur: this.handleBlur }),
						_react2['default'].createElement('button', {
							className: 'item__actions__action item__actions__action--remove [ font-icon-trash ]',
							type: 'button',
							title: _i18n2['default']._t('AssetGalleryField.DELETE'),
							tabIndex: this.state.buttonTabIndex,
							onClick: this.onFileDelete,
							onFocus: this.handleFocus,
							onBlur: this.handleBlur }),
						_react2['default'].createElement('button', {
							className: 'item__actions__action item__actions__action--edit [ font-icon-edit ]',
							type: 'button',
							title: _i18n2['default']._t('AssetGalleryField.EDIT'),
							tabIndex: this.state.buttonTabIndex,
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
})(_silverstripeComponent2['default']);

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
	'spaceKey': _react2['default'].PropTypes.number,
	'returnKey': _react2['default'].PropTypes.number,
	'onFileSelect': _react2['default'].PropTypes.func,
	'selected': _react2['default'].PropTypes.bool
};

function mapStateToProps(state) {
	return {
		selectedFiles: state.assetAdmin.gallery.selectedFiles
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: (0, _redux.bindActionCreators)(Object.assign(galleryActions), dispatch)
	};
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(FileComponent);
module.exports = exports['default'];

},{"../constants":5,"../state/gallery/actions":10,"i18n":"i18n","jQuery":"jQuery","react":"react","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _fileContainer = require('./file-container');

var _fileContainer2 = _interopRequireDefault(_fileContainer);

var _componentsEditorComponent = require('../components/editor-component');

var _componentsEditorComponent2 = _interopRequireDefault(_componentsEditorComponent);

var _componentsBulkActionsComponent = require('../components/bulk-actions-component');

var _componentsBulkActionsComponent2 = _interopRequireDefault(_componentsBulkActionsComponent);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

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

var GalleryComponent = (function (_SilverStripeComponent) {
	_inherits(GalleryComponent, _SilverStripeComponent);

	function GalleryComponent(props) {
		var _this2 = this;

		_classCallCheck(this, GalleryComponent);

		_get(Object.getPrototypeOf(GalleryComponent.prototype), 'constructor', this).call(this, props);

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
			'label': _i18n2['default']._t('AssetGalleryField.FILTER_TITLE_ASC'),
			'onSort': getSort.call(this, 'title', 'asc')
		}, {
			'field': 'title',
			'direction': 'desc',
			'label': _i18n2['default']._t('AssetGalleryField.FILTER_TITLE_DESC'),
			'onSort': getSort.call(this, 'title', 'desc')
		}, {
			'field': 'created',
			'direction': 'desc',
			'label': _i18n2['default']._t('AssetGalleryField.FILTER_DATE_DESC'),
			'onSort': getSort.call(this, 'created', 'desc')
		}, {
			'field': 'created',
			'direction': 'asc',
			'label': _i18n2['default']._t('AssetGalleryField.FILTER_DATE_ASC'),
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
					'editing': null
				});
			},
			'onFetchData': function onFetchData(data) {
				_this2.setState({
					'count': data.count,
					'files': data.files
				});
			}
		};

		this.onFileSave = this.onFileSave.bind(this);
		this.onFileNavigate = this.onFileNavigate.bind(this);
		this.onFileEdit = this.onFileEdit.bind(this);
		this.onFileDelete = this.onFileDelete.bind(this);
		this.onBackClick = this.onBackClick.bind(this);
		this.onMoreClick = this.onMoreClick.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.getSelectedFiles = this.getSelectedFiles.bind(this);
	}

	_createClass(GalleryComponent, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_get(Object.getPrototypeOf(GalleryComponent.prototype), 'componentDidMount', this).call(this);

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
			_get(Object.getPrototypeOf(GalleryComponent.prototype), 'componentWillUnmount', this).call(this);

			for (var _event2 in this.listeners) {
				this.props.backend.removeListener(_event2, this.listeners[_event2]);
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var $select = (0, _jQuery2['default'])(_reactDom2['default'].findDOMNode(this)).find('.gallery__sort .dropdown');

			// We opt-out of letting the CMS handle Chosen because it doesn't re-apply the behaviour correctly.
			// So after the gallery has been rendered we apply Chosen.
			$select.chosen({
				'allow_single_deselect': true,
				'disable_search_threshold': 20
			});

			// Chosen stops the change event from reaching React so we have to simulate a click.
			$select.change(function () {
				return _reactAddonsTestUtils2['default'].Simulate.click($select.find(':selected')[0]);
			});
		}
	}, {
		key: 'getFileById',
		value: function getFileById(id) {
			var folder = null;

			for (var i = 0; i < this.state.files.length; i += 1) {
				if (this.state.files[i].id === id) {
					folder = this.state.files[i];
					break;
				}
			}

			return folder;
		}
	}, {
		key: 'getNoItemsNotice',
		value: function getNoItemsNotice() {
			if (this.state.count < 1) {
				return _react2['default'].createElement(
					'p',
					{ className: 'no-item-notice' },
					_i18n2['default']._t('AssetGalleryField.NOITEMSFOUND')
				);
			}

			return null;
		}
	}, {
		key: 'getBackButton',
		value: function getBackButton() {
			if (this.folders.length > 1) {
				return _react2['default'].createElement('button', {
					className: 'gallery__back ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-level-up no-text',
					onClick: this.onBackClick,
					ref: 'backButton' });
			}

			return null;
		}
	}, {
		key: 'getBulkActionsComponent',
		value: function getBulkActionsComponent() {
			if (this.state.selectedFiles.length > 0 && this.props.backend.bulkActions) {
				return _react2['default'].createElement(_componentsBulkActionsComponent2['default'], {
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
					_i18n2['default']._t('AssetGalleryField.LOADMORE')
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

			if (this.state.editing !== null) {
				return _react2['default'].createElement(
					'div',
					{ className: 'gallery' },
					_react2['default'].createElement(_componentsEditorComponent2['default'], {
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
						return _react2['default'].createElement(_fileContainer2['default'], _extends({ key: i }, file, {
							spaceKey: _constants2['default'].SPACE_KEY_CODE,
							returnKey: _constants2['default'].RETURN_KEY_CODE,
							onFileDelete: _this3.onFileDelete,
							onFileEdit: _this3.onFileEdit,
							onFileNavigate: _this3.onFileNavigate,
							selected: _this3.state.selectedFiles.indexOf(file.id) > -1 }));
					})
				),
				this.getNoItemsNotice(),
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

			this.emitExitFileViewCmsEvent();
		}
	}, {
		key: 'onFileDelete',
		value: function onFileDelete(file, event) {
			if (confirm(_i18n2['default']._t('AssetGalleryField.CONFIRMDELETE'))) {
				this.props.backend['delete'](file.id);
				this.emitFileDeletedCmsEvent();
			}

			event.stopPropagation();
		}
	}, {
		key: 'onFileEdit',
		value: function onFileEdit(file, event) {
			// Allow component users to inject behaviour.
			// Temporary solution until the CMS is fully React based,
			// at which point we can work with ES6 subclasses.
			var cb = this.props._onFileEditCallback;
			if (!cb || cb(file, event) !== false) {
				this.setState({
					'editing': file
				});
			}

			this.emitEnterFileViewCmsEvent(file);

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

			this.emitFolderChangedCmsEvent();
			// this.saveFolderNameInSession();
		}
	}, {
		key: 'emitFolderChangedCmsEvent',
		value: function emitFolderChangedCmsEvent() {
			var folder = {
				parentId: 0,
				id: 0
			};

			// The current folder is stored by it's name in our component.
			// We need to get it's id because that's how Entwine components (GridField) reference it.
			for (var i = 0; i < this.state.files.length; i += 1) {
				if (this.state.files[i].filename === this.props.backend.folder) {
					folder.parentId = this.state.files[i].parent.id;
					folder.id = this.state.files[i].id;
					break;
				}
			}

			this._emitCmsEvent('folder-changed.asset-gallery-field', folder);
		}
	}, {
		key: 'emitFileDeletedCmsEvent',
		value: function emitFileDeletedCmsEvent() {
			this._emitCmsEvent('file-deleted.asset-gallery-field');
		}
	}, {
		key: 'emitEnterFileViewCmsEvent',
		value: function emitEnterFileViewCmsEvent(file) {
			var id = 0;

			this._emitCmsEvent('enter-file-view.asset-gallery-field', file.id);
		}
	}, {
		key: 'emitExitFileViewCmsEvent',
		value: function emitExitFileViewCmsEvent() {
			this._emitCmsEvent('exit-file-view.asset-gallery-field');
		}

		// saveFolderNameInSession() {
		// 	if (this.props.hasSessionStorage()) {
		// 		window.sessionStorage.setItem($(ReactDOM.findDOMNode(this)).closest('.asset-gallery')[0].id, this.props.backend.folder);
		// 	}
		// }

	}, {
		key: 'onNavigate',
		value: function onNavigate(folder) {
			var silent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			// Don't the folder if it exists already.
			if (this.folders.indexOf(folder) === -1) {
				this.folders.push(folder);
			}

			this.props.backend.navigate(folder);

			if (!silent) {
				this.emitFolderChangedCmsEvent();
			}

			// this.saveFolderNameInSession();
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

			this.emitFolderChangedCmsEvent();
			// this.saveFolderNameInSession();

			event.preventDefault();
		}
	}, {
		key: 'onFileSave',
		value: function onFileSave(id, state, event) {
			this.props.backend.save(id, state);

			this.emitExitFileViewCmsEvent();

			event.stopPropagation();
			event.preventDefault();
		}
	}]);

	return GalleryComponent;
})(_silverstripeComponent2['default']);

GalleryComponent.propTypes = {
	// 'hasSessionStorage': React.PropTypes.func.isRequired,
	'backend': _react2['default'].PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: (0, _redux.bindActionCreators)(dispatch)
	};
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(GalleryComponent);
module.exports = exports['default'];

},{"../components/bulk-actions-component":3,"../components/editor-component":4,"../constants":5,"./file-container":6,"i18n":"i18n","jQuery":"jQuery","react":"react","react-addons-test-utils":"react-addons-test-utils","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var GALLERY = {
    ADD_FILE: 'ADD_FILE',
    SELECT_FILE: 'SELECT_FILE'
};
exports.GALLERY = GALLERY;

},{}],9:[function(require,module,exports){
/**
 * @file Factory for creating a Redux store.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = configureStore;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

// Used for handling async store updates.

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

// Logs state changes to the console. Useful for debugging.

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

/**
 * @func createStoreWithMiddleware
 * @param function rootReducer
 * @param object initialState
 * @desc Creates a Redux store with some middleware applied.
 * @private
 */
var createStoreWithMiddleware = (0, _redux.applyMiddleware)(_reduxThunk2['default'], (0, _reduxLogger2['default'])())(_redux.createStore);

/**
 * @func configureStore
 * @param object initialState
 * @return object - A Redux store that lets you read the state, dispatch actions and subscribe to changes.
 */

function configureStore() {
  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var store = createStoreWithMiddleware(_reducer2['default'], initialState);

  return store;
}

;
module.exports = exports['default'];

},{"./reducer":12,"redux":"redux","redux-logger":15,"redux-thunk":"redux-thunk"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.addFile = addFile;
exports.selectFile = selectFile;

var _actionTypes = require('../action-types');

/**
 * Adds a file to state
 *
 * @param object file
 * @param number file.id - The file id.
 */

function addFile(file) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.ADD_FILE,
            payload: file
        });
    };
}

/**
 * Selects a file
 *
 * @param object file
 * @param number file.id - The file id.
 */

function selectFile(file) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SELECT_FILE,
            payload: file
        });
    };
}

},{"../action-types":8}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = galleryReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _actionTypes = require('../action-types');

var initialState = {
    files: [],
    selectedFiles: []
};

/**
 * Reducer for the `assetAdmin.gallery` state key.
 *
 * @param object state
 * @param object action - The dispatched action.
 * @param string action.type - Name of the dispatched action.
 * @param object [action.payload] - Optional data passed with the action.
 */

function galleryReducer(state, action) {
    if (state === undefined) state = initialState;

    switch (action.type) {
        case _actionTypes.GALLERY.ADD_FILE:
            return Object.assign({}, state, {
                files: state.files.concat(action.payload)
            });
        case _actionTypes.GALLERY.SELECT_FILE:
            var newSelectedFiles = [],
                fileIndex = state.selectedFiles.indexOf(action.payload.id);

            // Add the file if it doesn't exist, otherwise remove it.
            if (fileIndex > -1) {
                newSelectedFiles = state.selectedFiles.filter(function (id) {
                    return id !== action.payload.id;
                });
            } else {
                newSelectedFiles = state.selectedFiles.concat(action.payload.id);
            }

            return Object.assign({}, state, {
                selectedFiles: newSelectedFiles
            });
        default:
            return state;
    }
}

module.exports = exports['default'];

},{"../action-types":8,"deep-freeze":14}],12:[function(require,module,exports){
/**
 * @file The reducer which operates on the Redux store.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _redux = require('redux');

var _galleryReducerJs = require('./gallery/reducer.js');

var _galleryReducerJs2 = _interopRequireDefault(_galleryReducerJs);

/**
 * Operates on the Redux store to update application state.
 *
 * @param object state - The current state.
 * @param object action - The dispatched action.
 * @param string action.type - The type of action that has been dispatched.
 * @param object [action.payload] - Optional data passed with the action.
 */
var rootReducer = (0, _redux.combineReducers)({
  assetAdmin: (0, _redux.combineReducers)({
    gallery: _galleryReducerJs2['default']
  })
});

exports['default'] = rootReducer;
module.exports = exports['default'];

},{"./gallery/reducer.js":11,"redux":"redux"}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
module.exports = function deepFreeze (o) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (o.hasOwnProperty(prop)
    && o[prop] !== null
    && (typeof o[prop] === "object" || typeof o[prop] === "function")
    && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });
  
  return o;
};

},{}],15:[function(require,module,exports){
"use strict";

var repeat = function repeat(str, times) {
  return new Array(times + 1).join(str);
};
var pad = function pad(num, maxLength) {
  return repeat("0", maxLength - num.toString().length) + num;
};
var formatTime = function formatTime(time) {
  return " @ " + pad(time.getHours(), 2) + ":" + pad(time.getMinutes(), 2) + ":" + pad(time.getSeconds(), 2) + "." + pad(time.getMilliseconds(), 3);
};

// Use the new performance api to get better precision if available
var timer = typeof performance !== "undefined" && typeof performance.now === "function" ? performance : Date;

/**
 * Creates logger with followed options
 *
 * @namespace
 * @property {object} options - options for logger
 * @property {string} options.level - console[level]
 * @property {boolean} options.duration - print duration of each action?
 * @property {boolean} options.timestamp - print timestamp with each action?
 * @property {object} options.colors - custom colors
 * @property {object} options.logger - implementation of the `console` API
 * @property {boolean} options.logErrors - should errors in action execution be caught, logged, and re-thrown?
 * @property {boolean} options.collapsed - is group collapsed?
 * @property {boolean} options.predicate - condition which resolves logger behavior
 * @property {function} options.stateTransformer - transform state before print
 * @property {function} options.actionTransformer - transform action before print
 * @property {function} options.errorTransformer - transform error before print
 */

function createLogger() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _options$level = options.level;
  var level = _options$level === undefined ? "log" : _options$level;
  var _options$logger = options.logger;
  var logger = _options$logger === undefined ? window.console : _options$logger;
  var _options$logErrors = options.logErrors;
  var logErrors = _options$logErrors === undefined ? true : _options$logErrors;
  var collapsed = options.collapsed;
  var predicate = options.predicate;
  var _options$duration = options.duration;
  var duration = _options$duration === undefined ? false : _options$duration;
  var _options$timestamp = options.timestamp;
  var timestamp = _options$timestamp === undefined ? true : _options$timestamp;
  var transformer = options.transformer;
  var _options$stateTransfo = options.stateTransformer;
  var // deprecated
  stateTransformer = _options$stateTransfo === undefined ? function (state) {
    return state;
  } : _options$stateTransfo;
  var _options$actionTransf = options.actionTransformer;
  var actionTransformer = _options$actionTransf === undefined ? function (actn) {
    return actn;
  } : _options$actionTransf;
  var _options$errorTransfo = options.errorTransformer;
  var errorTransformer = _options$errorTransfo === undefined ? function (error) {
    return error;
  } : _options$errorTransfo;
  var _options$colors = options.colors;
  var colors = _options$colors === undefined ? {
    title: function title() {
      return "#000000";
    },
    prevState: function prevState() {
      return "#9E9E9E";
    },
    action: function action() {
      return "#03A9F4";
    },
    nextState: function nextState() {
      return "#4CAF50";
    },
    error: function error() {
      return "#F20404";
    }
  } : _options$colors;

  // exit if console undefined

  if (typeof logger === "undefined") {
    return function () {
      return function (next) {
        return function (action) {
          return next(action);
        };
      };
    };
  }

  if (transformer) {
    console.error("Option 'transformer' is deprecated, use stateTransformer instead");
  }

  var logBuffer = [];
  function printBuffer() {
    logBuffer.forEach(function (logEntry, key) {
      var started = logEntry.started;
      var action = logEntry.action;
      var prevState = logEntry.prevState;
      var error = logEntry.error;
      var took = logEntry.took;
      var nextState = logEntry.nextState;

      var nextEntry = logBuffer[key + 1];
      if (nextEntry) {
        nextState = nextEntry.prevState;
        took = nextEntry.started - started;
      }
      // message
      var formattedAction = actionTransformer(action);
      var time = new Date(started);
      var isCollapsed = typeof collapsed === "function" ? collapsed(function () {
        return nextState;
      }, action) : collapsed;

      var formattedTime = formatTime(time);
      var titleCSS = colors.title ? "color: " + colors.title(formattedAction) + ";" : null;
      var title = "action " + formattedAction.type + (timestamp ? formattedTime : "") + (duration ? " in " + took.toFixed(2) + " ms" : "");

      // render
      try {
        if (isCollapsed) {
          if (colors.title) logger.groupCollapsed("%c " + title, titleCSS);else logger.groupCollapsed(title);
        } else {
          if (colors.title) logger.group("%c " + title, titleCSS);else logger.group(title);
        }
      } catch (e) {
        logger.log(title);
      }

      if (colors.prevState) logger[level]("%c prev state", "color: " + colors.prevState(prevState) + "; font-weight: bold", prevState);else logger[level]("prev state", prevState);

      if (colors.action) logger[level]("%c action", "color: " + colors.action(formattedAction) + "; font-weight: bold", formattedAction);else logger[level]("action", formattedAction);

      if (error) {
        if (colors.error) logger[level]("%c error", "color: " + colors.error(error, prevState) + "; font-weight: bold", error);else logger[level]("error", error);
      }

      if (colors.nextState) logger[level]("%c next state", "color: " + colors.nextState(nextState) + "; font-weight: bold", nextState);else logger[level]("next state", nextState);

      try {
        logger.groupEnd();
      } catch (e) {
        logger.log("—— log end ——");
      }
    });
    logBuffer.length = 0;
  }

  return function (_ref) {
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        // exit early if predicate function returns false
        if (typeof predicate === "function" && !predicate(getState, action)) {
          return next(action);
        }

        var logEntry = {};
        logBuffer.push(logEntry);

        logEntry.started = timer.now();
        logEntry.prevState = stateTransformer(getState());
        logEntry.action = action;

        var returnedValue = undefined;
        if (logErrors) {
          try {
            returnedValue = next(action);
          } catch (e) {
            logEntry.error = errorTransformer(e);
          }
        } else {
          returnedValue = next(action);
        }

        logEntry.took = timer.now() - logEntry.started;
        logEntry.nextState = stateTransformer(getState());

        printBuffer();

        if (logEntry.error) throw logEntry.error;
        return returnedValue;
      };
    };
  };
}

module.exports = createLogger;
},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL2JhY2tlbmQvZmlsZS1iYWNrZW5kLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9ib290L2luZGV4LmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb21wb25lbnRzL2J1bGstYWN0aW9ucy1jb21wb25lbnQuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL2NvbXBvbmVudHMvZWRpdG9yLWNvbXBvbmVudC5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvY29uc3RhbnRzLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb250YWluZXJzL2ZpbGUtY29udGFpbmVyLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb250YWluZXJzL2dhbGxlcnktY29udGFpbmVyLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9hY3Rpb24tdHlwZXMuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9nYWxsZXJ5L2FjdGlvbnMuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL2dhbGxlcnkvcmVkdWNlci5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvcmVkdWNlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2RlZXAtZnJlZXplL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LWxvZ2dlci9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkNBYyxRQUFROzs7O3NCQUNILFFBQVE7Ozs7SUFFTixXQUFXO1dBQVgsV0FBVzs7Y0FBWCxXQUFXOztTQUNsQixrQkFBZ0I7cUNBQVosVUFBVTtBQUFWLGNBQVU7OztBQUMxQiwyQkFBVyxXQUFXLGdCQUFJLFVBQVUsTUFBRTtHQUN0Qzs7O0FBRVUsVUFMUyxXQUFXLENBS25CLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUU7d0JBTG5GLFdBQVc7O0FBTTlCLDZCQU5tQixXQUFXLDZDQU10Qjs7QUFFUixNQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixNQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUMvQixNQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixNQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQzs7QUFFNUIsTUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7RUFDZDs7Ozs7Ozs7Y0FsQm1CLFdBQVc7O1NBeUIxQixlQUFDLEVBQUUsRUFBRTs7O0FBQ1QsT0FBSSxPQUFPLEVBQUUsS0FBSyxXQUFXLEVBQUU7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgRXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVCYWNrZW5kIGV4dGVuZHMgRXZlbnRzIHtcblx0c3RhdGljIGNyZWF0ZSguLi5wYXJhbWV0ZXJzKSB7XG5cdFx0cmV0dXJuIG5ldyBGaWxlQmFja2VuZCguLi5wYXJhbWV0ZXJzKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKGZldGNoX3VybCwgc2VhcmNoX3VybCwgdXBkYXRlX3VybCwgZGVsZXRlX3VybCwgbGltaXQsIGJ1bGtBY3Rpb25zLCAkZm9sZGVyLCBjdXJyZW50Rm9sZGVyKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuZmV0Y2hfdXJsID0gZmV0Y2hfdXJsO1xuXHRcdHRoaXMuc2VhcmNoX3VybCA9IHNlYXJjaF91cmw7XG5cdFx0dGhpcy51cGRhdGVfdXJsID0gdXBkYXRlX3VybDtcblx0XHR0aGlzLmRlbGV0ZV91cmwgPSBkZWxldGVfdXJsO1xuXHRcdHRoaXMubGltaXQgPSBsaW1pdDtcblx0XHR0aGlzLmJ1bGtBY3Rpb25zID0gYnVsa0FjdGlvbnM7XG5cdFx0dGhpcy4kZm9sZGVyID0gJGZvbGRlcjtcblx0XHR0aGlzLmZvbGRlciA9IGN1cnJlbnRGb2xkZXI7XG5cblx0XHR0aGlzLnBhZ2UgPSAxO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIGZldGNoXG5cdCAqIEBwYXJhbSBudW1iZXIgaWRcblx0ICogQGRlc2MgRmV0Y2hlcyBhIGNvbGxlY3Rpb24gb2YgRmlsZXMgYnkgUGFyZW50SUQuXG5cdCAqL1xuXHRmZXRjaChpZCkge1xuXHRcdGlmICh0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5wYWdlID0gMTtcblxuXHRcdHRoaXMucmVxdWVzdCgnUE9TVCcsIHRoaXMuZmV0Y2hfdXJsLCB7IGlkOiBpZCB9KS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uRmV0Y2hEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRzZWFyY2goKSB7XG5cdFx0dGhpcy5wYWdlID0gMTtcblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uU2VhcmNoRGF0YScsIGpzb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0bW9yZSgpIHtcblx0XHR0aGlzLnBhZ2UrKztcblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uTW9yZURhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG5hdmlnYXRlKGZvbGRlcikge1xuXHRcdHRoaXMucGFnZSA9IDE7XG5cdFx0dGhpcy5mb2xkZXIgPSBmb2xkZXI7XG5cblx0XHR0aGlzLnBlcnNpc3RGb2xkZXJGaWx0ZXIoZm9sZGVyKTtcblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uTmF2aWdhdGVEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRwZXJzaXN0Rm9sZGVyRmlsdGVyKGZvbGRlcikge1xuXHRcdGlmIChmb2xkZXIuc3Vic3RyKC0xKSA9PT0gJy8nKSB7XG5cdFx0XHRmb2xkZXIgPSBmb2xkZXIuc3Vic3RyKDAsIGZvbGRlci5sZW5ndGggLSAxKTtcblx0XHR9XG5cblx0XHR0aGlzLiRmb2xkZXIudmFsKGZvbGRlcik7XG5cdH1cblxuXHRkZWxldGUoaWRzKSB7XG5cdFx0dmFyIGZpbGVzVG9EZWxldGUgPSBbXTtcblxuXHRcdC8vIEFsbG93cyB1c2VycyB0byBwYXNzIG9uZSBvciBtb3JlIGlkcyB0byBkZWxldGUuXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpZHMpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG5cdFx0XHRmaWxlc1RvRGVsZXRlLnB1c2goaWRzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZmlsZXNUb0RlbGV0ZSA9IGlkcztcblx0XHR9XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuZGVsZXRlX3VybCwge1xuXHRcdFx0J2lkcyc6IGZpbGVzVG9EZWxldGVcblx0XHR9KS50aGVuKCgpID0+IHtcblx0XHRcdC8vIFVzaW5nIGZvciBsb29wIGNvcyBJRTEwIGRvZXNuJ3QgaGFuZGxlICdmb3Igb2YnLFxuXHRcdFx0Ly8gd2hpY2ggZ2V0cyB0cmFuc2NvbXBpbGVkIGludG8gYSBmdW5jdGlvbiB3aGljaCB1c2VzIFN5bWJvbCxcblx0XHRcdC8vIHRoZSB0aGluZyBJRTEwIGRpZXMgb24uXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzVG9EZWxldGUubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdFx0dGhpcy5lbWl0KCdvbkRlbGV0ZURhdGEnLCBmaWxlc1RvRGVsZXRlW2ldKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZpbHRlcihuYW1lLCB0eXBlLCBmb2xkZXIsIGNyZWF0ZWRGcm9tLCBjcmVhdGVkVG8sIG9ubHlTZWFyY2hJbkZvbGRlcikge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblx0XHR0aGlzLmNyZWF0ZWRGcm9tID0gY3JlYXRlZEZyb207XG5cdFx0dGhpcy5jcmVhdGVkVG8gPSBjcmVhdGVkVG87XG5cdFx0dGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIgPSBvbmx5U2VhcmNoSW5Gb2xkZXI7XG5cblx0XHR0aGlzLnNlYXJjaCgpO1xuXHR9XG5cblx0c2F2ZShpZCwgdmFsdWVzKSB7XG5cdFx0dmFsdWVzWydpZCddID0gaWQ7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ1BPU1QnLCB0aGlzLnVwZGF0ZV91cmwsIHZhbHVlcykudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uU2F2ZURhdGEnLCBpZCwgdmFsdWVzKTtcblx0XHR9KTtcblx0fVxuXG5cdHJlcXVlc3QobWV0aG9kLCB1cmwsIGRhdGEgPSB7fSkge1xuXHRcdGxldCBkZWZhdWx0cyA9IHtcblx0XHRcdCdsaW1pdCc6IHRoaXMubGltaXQsXG5cdFx0XHQncGFnZSc6IHRoaXMucGFnZSxcblx0XHR9O1xuXG5cdFx0aWYgKHRoaXMubmFtZSAmJiB0aGlzLm5hbWUudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMubmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm5hbWUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmZvbGRlciAmJiB0aGlzLmZvbGRlci50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5mb2xkZXIgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5mb2xkZXIpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRGcm9tICYmIHRoaXMuY3JlYXRlZEZyb20udHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuY3JlYXRlZEZyb20gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkRnJvbSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY3JlYXRlZFRvICYmIHRoaXMuY3JlYXRlZFRvLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRUbyA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLmNyZWF0ZWRUbyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMub25seVNlYXJjaEluRm9sZGVyICYmIHRoaXMub25seVNlYXJjaEluRm9sZGVyLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm9ubHlTZWFyY2hJbkZvbGRlciA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5zaG93TG9hZGluZ0luZGljYXRvcigpO1xuXG5cdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHQndXJsJzogdXJsLFxuXHRcdFx0J21ldGhvZCc6IG1ldGhvZCxcblx0XHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHRcdCdkYXRhJzogJC5leHRlbmQoZGVmYXVsdHMsIGRhdGEpXG5cdFx0fSkuYWx3YXlzKCgpID0+IHtcblx0XHRcdHRoaXMuaGlkZUxvYWRpbmdJbmRpY2F0b3IoKTtcblx0XHR9KTtcblx0fVxuXG5cdHNob3dMb2FkaW5nSW5kaWNhdG9yKCkge1xuXHRcdCQoJy5jbXMtY29udGVudCwgLnVpLWRpYWxvZycpLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cdFx0JCgnLnVpLWRpYWxvZy1jb250ZW50JykuY3NzKCdvcGFjaXR5JywgJy4xJyk7XG5cdH1cblxuXHRoaWRlTG9hZGluZ0luZGljYXRvcigpIHtcblx0XHQkKCcuY21zLWNvbnRlbnQsIC51aS1kaWFsb2cnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXHRcdCQoJy51aS1kaWFsb2ctY29udGVudCcpLmNzcygnb3BhY2l0eScsICcxJyk7XG5cdH1cbn1cbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBjb25maWd1cmVTdG9yZSBmcm9tICcuLi9zdGF0ZS9jb25maWd1cmVTdG9yZSc7XG5pbXBvcnQgR2FsbGVyeUNvbXBvbmVudCBmcm9tICcuLi9jb250YWluZXJzL2dhbGxlcnktY29udGFpbmVyJztcbmltcG9ydCBGaWxlQmFja2VuZCBmcm9tICcuLi9iYWNrZW5kL2ZpbGUtYmFja2VuZCc7XG5cbmZ1bmN0aW9uIGdldFZhcihuYW1lKSB7XG5cdHZhciBwYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCc/Jyk7XG5cblx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRwYXJ0cyA9IHBhcnRzWzFdLnNwbGl0KCcjJyk7XG5cdH1cblxuXHRsZXQgdmFyaWFibGVzID0gcGFydHNbMF0uc3BsaXQoJyYnKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHZhcmlhYmxlcy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwYXJ0cyA9IHZhcmlhYmxlc1tpXS5zcGxpdCgnPScpO1xuXG5cdFx0aWYgKGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSkgPT09IG5hbWUpIHtcblx0XHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBoYXNTZXNzaW9uU3RvcmFnZSgpIHtcblx0cmV0dXJuIHR5cGVvZiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcHMocHJvcHMpIHtcblx0dmFyICRjb21wb25lbnRXcmFwcGVyID0gJCgnLmFzc2V0LWdhbGxlcnknKS5maW5kKCcuYXNzZXQtZ2FsbGVyeS1jb21wb25lbnQtd3JhcHBlcicpLFxuXHRcdCRzZWFyY2ggPSAkKCcuY21zLXNlYXJjaC1mb3JtJyksXG5cdFx0aW5pdGlhbEZvbGRlciA9ICQoJy5hc3NldC1nYWxsZXJ5JykuZGF0YSgnYXNzZXQtZ2FsbGVyeS1pbml0aWFsLWZvbGRlcicpLFxuXHRcdGN1cnJlbnRGb2xkZXIgPSBnZXRWYXIoJ3FbRm9sZGVyXScpIHx8IGluaXRpYWxGb2xkZXIsXG5cdFx0YmFja2VuZCxcblx0XHRkZWZhdWx0cztcblxuXHRpZiAoJHNlYXJjaC5maW5kKCdbdHlwZT1oaWRkZW5dW25hbWU9XCJxW0ZvbGRlcl1cIl0nKS5sZW5ndGggPT0gMCkge1xuXHRcdCRzZWFyY2guYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJxW0ZvbGRlcl1cIiAvPicpO1xuXHR9XG5cblx0Ly8gRG8gd2UgbmVlZCB0byBzZXQgdXAgYSBkZWZhdWx0IGJhY2tlbmQ/XG5cdGlmICh0eXBlb2YgcHJvcHMgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwcm9wcy5iYWNrZW5kID09PSAndW5kZWZpbmVkJykge1xuXHRcdGJhY2tlbmQgPSBGaWxlQmFja2VuZC5jcmVhdGUoXG5cdFx0XHQkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LWZldGNoLXVybCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1zZWFyY2gtdXJsJyksXG5cdFx0XHQkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LXVwZGF0ZS11cmwnKSxcblx0XHRcdCRjb21wb25lbnRXcmFwcGVyLmRhdGEoJ2Fzc2V0LWdhbGxlcnktZGVsZXRlLXVybCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1saW1pdCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1idWxrLWFjdGlvbnMnKSxcblx0XHRcdCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJyksXG5cdFx0XHRjdXJyZW50Rm9sZGVyXG5cdFx0KTtcblxuXHRcdGJhY2tlbmQuZW1pdChcblx0XHRcdCdmaWx0ZXInLFxuXHRcdFx0Z2V0VmFyKCdxW05hbWVdJyksXG5cdFx0XHRnZXRWYXIoJ3FbQXBwQ2F0ZWdvcnldJyksXG5cdFx0XHRnZXRWYXIoJ3FbRm9sZGVyXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRGcm9tXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRUb10nKSxcblx0XHRcdGdldFZhcigncVtDdXJyZW50Rm9sZGVyT25seV0nKVxuXHRcdCk7XG5cdH1cblxuXHRkZWZhdWx0cyA9IHtcblx0XHRiYWNrZW5kOiBiYWNrZW5kLFxuXHRcdGN1cnJlbnRfZm9sZGVyOiBjdXJyZW50Rm9sZGVyLFxuXHRcdGNtc0V2ZW50czoge30sXG5cdFx0aW5pdGlhbF9mb2xkZXI6IGluaXRpYWxGb2xkZXIsXG5cdFx0bmFtZTogJCgnLmFzc2V0LWdhbGxlcnknKS5kYXRhKCdhc3NldC1nYWxsZXJ5LW5hbWUnKVxuXHR9O1xuXG5cdHJldHVybiAkLmV4dGVuZCh0cnVlLCBkZWZhdWx0cywgcHJvcHMpO1xufVxuXG5sZXQgcHJvcHMgPSBnZXRQcm9wcygpO1xuY29uc3Qgc3RvcmUgPSBjb25maWd1cmVTdG9yZSgpOyAvL0NyZWF0ZSB0aGUgcmVkdXggc3RvcmVcblxuXG5SZWFjdERPTS5yZW5kZXIoXG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgICAgIDxHYWxsZXJ5Q29tcG9uZW50IHsuLi5wcm9wc30gLz5cbiAgICA8L1Byb3ZpZGVyPixcbiAgICAkKCcuYXNzZXQtZ2FsbGVyeS1jb21wb25lbnQtd3JhcHBlcicpWzBdXG4pO1xuIiwiaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgUmVhY3RUZXN0VXRpbHMgZnJvbSAncmVhY3QtYWRkb25zLXRlc3QtdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWxrQWN0aW9uc0NvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLm9uQ2hhbmdlVmFsdWUgPSB0aGlzLm9uQ2hhbmdlVmFsdWUuYmluZCh0aGlzKTtcblx0fVxuXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHZhciAkc2VsZWN0ID0gJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmRyb3Bkb3duJyk7XG5cblx0XHQkc2VsZWN0LmNob3Nlbih7XG5cdFx0XHQnYWxsb3dfc2luZ2xlX2Rlc2VsZWN0JzogdHJ1ZSxcblx0XHRcdCdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnOiAyMFxuXHRcdH0pO1xuXG5cdFx0Ly8gQ2hvc2VuIHN0b3BzIHRoZSBjaGFuZ2UgZXZlbnQgZnJvbSByZWFjaGluZyBSZWFjdCBzbyB3ZSBoYXZlIHRvIHNpbXVsYXRlIGEgY2xpY2suXG5cdFx0JHNlbGVjdC5jaGFuZ2UoKCkgPT4gUmVhY3RUZXN0VXRpbHMuU2ltdWxhdGUuY2xpY2soJHNlbGVjdC5maW5kKCc6c2VsZWN0ZWQnKVswXSkpO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX2J1bGsgZmllbGRob2xkZXItc21hbGxcIj5cblx0XHRcdDxzZWxlY3QgY2xhc3NOYW1lPVwiZHJvcGRvd24gbm8tY2hhbmdlLXRyYWNrIG5vLWNoem5cIiB0YWJJbmRleD1cIjBcIiBkYXRhLXBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfSBzdHlsZT17e3dpZHRoOiAnMTYwcHgnfX0+XG5cdFx0XHRcdDxvcHRpb24gc2VsZWN0ZWQgZGlzYWJsZWQgaGlkZGVuIHZhbHVlPScnPjwvb3B0aW9uPlxuXHRcdFx0XHR7dGhpcy5wcm9wcy5vcHRpb25zLm1hcCgob3B0aW9uLCBpKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIDxvcHRpb24ga2V5PXtpfSBvbkNsaWNrPXt0aGlzLm9uQ2hhbmdlVmFsdWV9IHZhbHVlPXtvcHRpb24udmFsdWV9PntvcHRpb24ubGFiZWx9PC9vcHRpb24+O1xuXHRcdFx0XHR9KX1cblx0XHRcdDwvc2VsZWN0PlxuXHRcdDwvZGl2Pjtcblx0fVxuXG5cdGdldE9wdGlvbkJ5VmFsdWUodmFsdWUpIHtcblx0XHQvLyBVc2luZyBmb3IgbG9vcCBjb3MgSUUxMCBkb2Vzbid0IGhhbmRsZSAnZm9yIG9mJyxcblx0XHQvLyB3aGljaCBnZXRzIHRyYW5zY29tcGlsZWQgaW50byBhIGZ1bmN0aW9uIHdoaWNoIHVzZXMgU3ltYm9sLFxuXHRcdC8vIHRoZSB0aGluZyBJRTEwIGRpZXMgb24uXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGlmICh0aGlzLnByb3BzLm9wdGlvbnNbaV0udmFsdWUgPT09IHZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnByb3BzLm9wdGlvbnNbaV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRhcHBseUFjdGlvbih2YWx1ZSkge1xuXHRcdC8vIFdlIG9ubHkgaGF2ZSAnZGVsZXRlJyByaWdodCBub3cuLi5cblx0XHRzd2l0Y2ggKHZhbHVlKSB7XG5cdFx0XHRjYXNlICdkZWxldGUnOlxuXHRcdFx0XHR0aGlzLnByb3BzLmJhY2tlbmQuZGVsZXRlKHRoaXMucHJvcHMuZ2V0U2VsZWN0ZWRGaWxlcygpKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRvbkNoYW5nZVZhbHVlKGV2ZW50KSB7XG5cdFx0dmFyIG9wdGlvbiA9IHRoaXMuZ2V0T3B0aW9uQnlWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuXG5cdFx0Ly8gTWFrZSBzdXJlIGEgdmFsaWQgb3B0aW9uIGhhcyBiZWVuIHNlbGVjdGVkLlxuXHRcdGlmIChvcHRpb24gPT09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBvcHRpb24udmFsdWUgfSk7XG5cblx0XHRpZiAob3B0aW9uLmRlc3RydWN0aXZlID09PSB0cnVlKSB7XG5cdFx0XHRpZiAoY29uZmlybShzcy5pMThuLnNwcmludGYoc3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQlVMS19BQ1RJT05TX0NPTkZJUk0nKSwgb3B0aW9uLmxhYmVsKSkpIHtcblx0XHRcdFx0dGhpcy5hcHBseUFjdGlvbihvcHRpb24udmFsdWUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmFwcGx5QWN0aW9uKG9wdGlvbi52YWx1ZSk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVzZXQgdGhlIGRyb3Bkb3duIHRvIGl0J3MgcGxhY2Vob2xkZXIgdmFsdWUuXG5cdFx0JChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmRyb3Bkb3duJykudmFsKCcnKS50cmlnZ2VyKCdsaXN6dDp1cGRhdGVkJyk7XG5cdH1cbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNpbHZlclN0cmlwZUNvbXBvbmVudCBmcm9tICdzaWx2ZXJzdHJpcGUtY29tcG9uZW50JztcblxuY2xhc3MgRWRpdG9yQ29tcG9uZW50IGV4dGVuZHMgU2lsdmVyU3RyaXBlQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0J3RpdGxlJzogdGhpcy5wcm9wcy5maWxlLnRpdGxlLFxuXHRcdFx0J2Jhc2VuYW1lJzogdGhpcy5wcm9wcy5maWxlLmJhc2VuYW1lXG5cdFx0fTtcblxuXHRcdHRoaXMuZmllbGRzID0gW1xuXHRcdFx0e1xuXHRcdFx0XHQnbGFiZWwnOiAnVGl0bGUnLFxuXHRcdFx0XHQnbmFtZSc6ICd0aXRsZScsXG5cdFx0XHRcdCd2YWx1ZSc6IHRoaXMucHJvcHMuZmlsZS50aXRsZSxcblx0XHRcdFx0J29uQ2hhbmdlJzogKGV2ZW50KSA9PiB0aGlzLm9uRmllbGRDaGFuZ2UoJ3RpdGxlJywgZXZlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQnbGFiZWwnOiAnRmlsZW5hbWUnLFxuXHRcdFx0XHQnbmFtZSc6ICdiYXNlbmFtZScsXG5cdFx0XHRcdCd2YWx1ZSc6IHRoaXMucHJvcHMuZmlsZS5iYXNlbmFtZSxcblx0XHRcdFx0J29uQ2hhbmdlJzogKGV2ZW50KSA9PiB0aGlzLm9uRmllbGRDaGFuZ2UoJ2Jhc2VuYW1lJywgZXZlbnQpXG5cdFx0XHR9XG5cdFx0XTtcblxuXHRcdHRoaXMub25GaWVsZENoYW5nZSA9IHRoaXMub25GaWVsZENoYW5nZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25GaWxlU2F2ZSA9IHRoaXMub25GaWxlU2F2ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25DYW5jZWwgPSB0aGlzLm9uQ2FuY2VsLmJpbmQodGhpcyk7XG5cdH1cblxuXHRvbkZpZWxkQ2hhbmdlKG5hbWUsIGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRbbmFtZV06IGV2ZW50LnRhcmdldC52YWx1ZVxuXHRcdH0pO1xuXHR9XG5cblx0b25GaWxlU2F2ZShldmVudCkge1xuXHRcdHRoaXMucHJvcHMub25GaWxlU2F2ZSh0aGlzLnByb3BzLmZpbGUuaWQsIHRoaXMuc3RhdGUsIGV2ZW50KTtcblx0fVxuXG5cdG9uQ2FuY2VsKGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5vbkNhbmNlbChldmVudCk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdlZGl0b3InPlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvIG5vbGFiZWwnPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tcHJldmlldyBub2xhYmVsJz5cblx0XHRcdFx0XHQ8aW1nIGNsYXNzTmFtZT0ndGh1bWJuYWlsLXByZXZpZXcnIHNyYz17dGhpcy5wcm9wcy5maWxlLnVybH0gLz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1kYXRhIG5vbGFiZWwnPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgbm9sYWJlbCc+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuVFlQRScpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLnR5cGV9PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0laRScpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuc2l6ZX08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlVSTCcpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHRcdDxhIGhyZWY9e3RoaXMucHJvcHMuZmlsZS51cmx9IHRhcmdldD0nX2JsYW5rJz57dGhpcy5wcm9wcy5maWxlLnVybH08L2E+XG5cdFx0XHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5DUkVBVEVEJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5jcmVhdGVkfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5MQVNURURJVCcpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUubGFzdFVwZGF0ZWR9PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5ESU0nKX06PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy53aWR0aH0geCB7dGhpcy5wcm9wcy5maWxlLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy5oZWlnaHR9cHg8L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdHt0aGlzLmZpZWxkcy5tYXAoKGZpZWxkLCBpKSA9PiB7XG5cdFx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgdGV4dCcga2V5PXtpfT5cblx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0JyBodG1sRm9yPXsnZ2FsbGVyeV8nICsgZmllbGQubmFtZX0+e2ZpZWxkLmxhYmVsfTwvbGFiZWw+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgaWQ9eydnYWxsZXJ5XycgKyBmaWVsZC5uYW1lfSBjbGFzc05hbWU9XCJ0ZXh0XCIgdHlwZT0ndGV4dCcgb25DaGFuZ2U9e2ZpZWxkLm9uQ2hhbmdlfSB2YWx1ZT17dGhpcy5zdGF0ZVtmaWVsZC5uYW1lXX0gLz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHR9KX1cblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHR0eXBlPSdzdWJtaXQnXG5cdFx0XHRcdFx0Y2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWJ1dHRvbiB1aS13aWRnZXQgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsIGZvbnQtaWNvbi1jaGVjay1tYXJrXCJcblx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uRmlsZVNhdmV9PlxuXHRcdFx0XHRcdHtpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5TQVZFJyl9XG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHRcdGNsYXNzTmFtZT1cInNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tY2FuY2VsLWNpcmNsZWRcIlxuXHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25DYW5jZWx9PlxuXHRcdFx0XHRcdHtpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5DQU5DRUwnKX1cblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj47XG5cdH1cbn1cblxuRWRpdG9yQ29tcG9uZW50LnByb3BUeXBlcyA9IHtcblx0J2ZpbGUnOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHRcdCdpZCc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdFx0J3RpdGxlJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHQnYmFzZW5hbWUnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdCd1cmwnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdCdzaXplJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHQnY3JlYXRlZCc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0J2xhc3RVcGRhdGVkJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHQnZGltZW5zaW9ucyc6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0XHQnd2lkdGgnOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRcdFx0J2hlaWdodCc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcblx0XHR9KVxuXHR9KSxcblx0J29uRmlsZVNhdmUnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0J29uQ2FuY2VsJzpSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRWRpdG9yQ29tcG9uZW50O1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuXHQnVEhVTUJOQUlMX0hFSUdIVCc6IDE1MCxcblx0J1RIVU1CTkFJTF9XSURUSCc6IDIwMCxcblx0J1NQQUNFX0tFWV9DT0RFJzogMzIsXG5cdCdSRVRVUk5fS0VZX0NPREUnOiAxMyxcblx0J0JVTEtfQUNUSU9OUyc6IFtcblx0XHR7XG5cdFx0XHR2YWx1ZTogJ2RlbGV0ZScsXG5cdFx0XHRsYWJlbDogc3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQlVMS19BQ1RJT05TX0RFTEVURScpLFxuXHRcdFx0ZGVzdHJ1Y3RpdmU6IHRydWVcblx0XHR9XG5cdF1cbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgYmluZEFjdGlvbkNyZWF0b3JzIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0ICogYXMgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vc3RhdGUvZ2FsbGVyeS9hY3Rpb25zJ1xuaW1wb3J0IGNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IFNpbHZlclN0cmlwZUNvbXBvbmVudCBmcm9tICdzaWx2ZXJzdHJpcGUtY29tcG9uZW50JztcblxuY2xhc3MgRmlsZUNvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdCdmb2N1c3NlZCc6IGZhbHNlLFxuXHRcdFx0J2J1dHRvblRhYkluZGV4JzogLTFcblx0XHR9O1xuXG5cdFx0dGhpcy5vbkZpbGVOYXZpZ2F0ZSA9IHRoaXMub25GaWxlTmF2aWdhdGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZUVkaXQgPSB0aGlzLm9uRmlsZUVkaXQuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZURlbGV0ZSA9IHRoaXMub25GaWxlRGVsZXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVEb3VibGVDbGljayA9IHRoaXMuaGFuZGxlRG91YmxlQ2xpY2suYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUtleURvd24gPSB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUZvY3VzID0gdGhpcy5oYW5kbGVGb2N1cy5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlQmx1ciA9IHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucHJldmVudEZvY3VzID0gdGhpcy5wcmV2ZW50Rm9jdXMuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZVNlbGVjdCA9IHRoaXMub25GaWxlU2VsZWN0LmJpbmQodGhpcyk7XG5cdH1cblx0XG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlKHRoaXMpO1xuXHR9XG5cblx0aGFuZGxlRG91YmxlQ2xpY2soZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQudGFyZ2V0ICE9PSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMudGl0bGUpICYmIGV2ZW50LnRhcmdldCAhPT0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLnRodW1ibmFpbCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLm9uRmlsZU5hdmlnYXRlKGV2ZW50KTtcblx0fVxuXG5cdG9uRmlsZU5hdmlnYXRlKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMuaXNGb2xkZXIoKSkge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkZpbGVOYXZpZ2F0ZSh0aGlzLnByb3BzLCBldmVudClcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLm9uRmlsZUVkaXQoZXZlbnQpO1xuXHR9XG5cblx0b25GaWxlU2VsZWN0KGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vc3RvcCB0cmlnZ2VyaW5nIGNsaWNrIG9uIHJvb3QgZWxlbWVudFxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZWxlY3RGaWxlKHtcblx0XHRcdGlkOiB0aGlzLnByb3BzLmlkLFxuXHRcdFx0c2VsZWN0ZWQ6ICF0aGlzLnByb3BzLnNlbGVjdGVkXG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbGVFZGl0KGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vc3RvcCB0cmlnZ2VyaW5nIGNsaWNrIG9uIHJvb3QgZWxlbWVudFxuXHRcdHRoaXMucHJvcHMub25GaWxlRWRpdCh0aGlzLnByb3BzLCBldmVudCk7XG5cdH1cblxuXHRvbkZpbGVEZWxldGUoZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgLy9zdG9wIHRyaWdnZXJpbmcgY2xpY2sgb24gcm9vdCBlbGVtZW50XG5cdFx0dGhpcy5wcm9wcy5vbkZpbGVEZWxldGUodGhpcy5wcm9wcywgZXZlbnQpXG5cdH1cblxuXHRpc0ZvbGRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy5jYXRlZ29yeSA9PT0gJ2ZvbGRlcic7XG5cdH1cblxuXHRnZXRUaHVtYm5haWxTdHlsZXMoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuY2F0ZWdvcnkgPT09ICdpbWFnZScpIHtcblx0XHRcdHJldHVybiB7J2JhY2tncm91bmRJbWFnZSc6ICd1cmwoJyArIHRoaXMucHJvcHMudXJsICsgJyknfTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHRnZXRUaHVtYm5haWxDbGFzc05hbWVzKCkge1xuXHRcdHZhciB0aHVtYm5haWxDbGFzc05hbWVzID0gJ2l0ZW1fX3RodW1ibmFpbCc7XG5cblx0XHRpZiAodGhpcy5pc0ltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpKSB7XG5cdFx0XHR0aHVtYm5haWxDbGFzc05hbWVzICs9ICcgbGFyZ2UnO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aHVtYm5haWxDbGFzc05hbWVzO1xuXHR9XG5cdFxuXHRpc1NlbGVjdGVkKCkge1xuXHRcdHJldHVybiB0aGlzLnByb3BzLnNlbGVjdGVkRmlsZXMuaW5kZXhPZih0aGlzLnByb3BzLmlkKSA+IC0xO1xuXHR9XG5cblx0Z2V0SXRlbUNsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIGl0ZW1DbGFzc05hbWVzID0gJ2l0ZW0gJyArIHRoaXMucHJvcHMuY2F0ZWdvcnk7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5mb2N1c3NlZCkge1xuXHRcdFx0aXRlbUNsYXNzTmFtZXMgKz0gJyBmb2N1c3NlZCc7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuaXNTZWxlY3RlZCgpKSB7XG5cdFx0XHRpdGVtQ2xhc3NOYW1lcyArPSAnIHNlbGVjdGVkJztcblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbUNsYXNzTmFtZXM7XG5cdH1cblxuXHRpc0ltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpIHtcblx0XHRsZXQgZGltZW5zaW9ucyA9IHRoaXMucHJvcHMuYXR0cmlidXRlcy5kaW1lbnNpb25zO1xuXG5cdFx0cmV0dXJuIGRpbWVuc2lvbnMuaGVpZ2h0ID4gY29uc3RhbnRzLlRIVU1CTkFJTF9IRUlHSFQgfHwgZGltZW5zaW9ucy53aWR0aCA+IGNvbnN0YW50cy5USFVNQk5BSUxfV0lEVEg7XG5cdH1cblxuXHRoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHQvL2lmIGV2ZW50IGRvZXNuJ3QgY29tZSBmcm9tIHRoZSByb290IGVsZW1lbnQsIGRvIG5vdGhpbmdcblx0XHRpZiAoZXZlbnQudGFyZ2V0ICE9PSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMudGh1bWJuYWlsKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHQvL0lmIHNwYWNlIGlzIHByZXNzZWQsIGFsbG93IGZvY3VzIG9uIGJ1dHRvbnNcblx0XHRpZiAodGhpcy5wcm9wcy5zcGFjZUtleSA9PT0gZXZlbnQua2V5Q29kZSkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy9TdG9wIHBhZ2UgZnJvbSBzY3JvbGxpbmdcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHQnYnV0dG9uVGFiSW5kZXgnOiAwXG5cdFx0XHR9KTtcblx0XHRcdCQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5pdGVtX19hY3Rpb25zX19hY3Rpb24nKS5maXJzdCgpLmZvY3VzKCk7XG5cdFx0fVxuXG5cdFx0Ly9JZiByZXR1cm4gaXMgcHJlc3NlZCwgbmF2aWdhdGUgZm9sZGVyXG5cdFx0aWYgKHRoaXMucHJvcHMucmV0dXJuS2V5ID09PSBldmVudC5rZXlDb2RlKSB7XG5cdFx0XHR0aGlzLm9uRmlsZU5hdmlnYXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlRm9jdXMoKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHQnZm9jdXNzZWQnOiB0cnVlLFxuXHRcdFx0J2J1dHRvblRhYkluZGV4JzogMFxuXHRcdH0pO1xuXHR9XG5cblx0aGFuZGxlQmx1cigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdmb2N1c3NlZCc6IGZhbHNlLFxuXHRcdFx0J2J1dHRvblRhYkluZGV4JzogLTFcblx0XHR9KTtcblx0fVxuXHRcblx0cHJldmVudEZvY3VzKGV2ZW50KSB7XG5cdFx0Ly9UbyBhdm9pZCBicm93c2VyJ3MgZGVmYXVsdCBmb2N1cyBzdGF0ZSB3aGVuIHNlbGVjdGluZyBhbiBpdGVtXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9e3RoaXMuZ2V0SXRlbUNsYXNzTmFtZXMoKX0gZGF0YS1pZD17dGhpcy5wcm9wcy5pZH0gb25Eb3VibGVDbGljaz17dGhpcy5oYW5kbGVEb3VibGVDbGlja30+XG5cdFx0XHQ8ZGl2IHJlZj1cInRodW1ibmFpbFwiIGNsYXNzTmFtZT17dGhpcy5nZXRUaHVtYm5haWxDbGFzc05hbWVzKCl9IHRhYkluZGV4PVwiMFwiIG9uS2V5RG93bj17dGhpcy5oYW5kbGVLZXlEb3dufSBzdHlsZT17dGhpcy5nZXRUaHVtYm5haWxTdHlsZXMoKX0gb25DbGljaz17dGhpcy5vbkZpbGVTZWxlY3R9IG9uTW91c2VEb3duPXt0aGlzLnByZXZlbnRGb2N1c30+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zJz5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXNlbGVjdCBbIGZvbnQtaWNvbi10aWNrIF0nXG5cdFx0XHRcdFx0XHR0eXBlPSdidXR0b24nXG5cdFx0XHRcdFx0XHR0aXRsZT17aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0VMRUNUJyl9XG5cdFx0XHRcdFx0XHR0YWJJbmRleD17dGhpcy5zdGF0ZS5idXR0b25UYWJJbmRleH1cblx0XHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25GaWxlU2VsZWN0fVxuXHRcdFx0XHRcdFx0b25Gb2N1cz17dGhpcy5oYW5kbGVGb2N1c31cblx0XHRcdFx0XHRcdG9uQmx1cj17dGhpcy5oYW5kbGVCbHVyfT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXJlbW92ZSBbIGZvbnQtaWNvbi10cmFzaCBdJ1xuXHRcdFx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHRcdFx0dGl0bGU9e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRFTEVURScpfVxuXHRcdFx0XHRcdFx0dGFiSW5kZXg9e3RoaXMuc3RhdGUuYnV0dG9uVGFiSW5kZXh9XG5cdFx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uRmlsZURlbGV0ZX1cblx0XHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlRm9jdXN9XG5cdFx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn0+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1lZGl0IFsgZm9udC1pY29uLWVkaXQgXSdcblx0XHRcdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0XHRcdHRpdGxlPXtpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5FRElUJyl9XG5cdFx0XHRcdFx0XHR0YWJJbmRleD17dGhpcy5zdGF0ZS5idXR0b25UYWJJbmRleH1cblx0XHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25GaWxlRWRpdH1cblx0XHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlRm9jdXN9XG5cdFx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn0+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8cCBjbGFzc05hbWU9J2l0ZW1fX3RpdGxlJyByZWY9XCJ0aXRsZVwiPnt0aGlzLnByb3BzLnRpdGxlfTwvcD5cblx0XHQ8L2Rpdj47XG5cdH1cbn1cblxuRmlsZUNvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG5cdCdpZCc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdCd0aXRsZSc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCdjYXRlZ29yeSc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCd1cmwnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHQnZGltZW5zaW9ucyc6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0J3dpZHRoJzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0XHQnaGVpZ2h0JzogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxuXHR9KSxcblx0J29uRmlsZU5hdmlnYXRlJzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCdvbkZpbGVFZGl0JzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCdvbkZpbGVEZWxldGUnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0J3NwYWNlS2V5JzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0J3JldHVybktleSc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdCdvbkZpbGVTZWxlY3QnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0J3NlbGVjdGVkJzogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbn07XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuXHRyZXR1cm4ge1xuXHRcdHNlbGVjdGVkRmlsZXM6IHN0YXRlLmFzc2V0QWRtaW4uZ2FsbGVyeS5zZWxlY3RlZEZpbGVzXG5cdH1cbn1cblxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XG5cdHJldHVybiB7XG5cdFx0YWN0aW9uczogYmluZEFjdGlvbkNyZWF0b3JzKE9iamVjdC5hc3NpZ24oZ2FsbGVyeUFjdGlvbnMpLCBkaXNwYXRjaClcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShGaWxlQ29tcG9uZW50KTtcbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgaTE4biBmcm9tICdpMThuJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBiaW5kQWN0aW9uQ3JlYXRvcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgUmVhY3RUZXN0VXRpbHMgZnJvbSAncmVhY3QtYWRkb25zLXRlc3QtdXRpbHMnO1xuaW1wb3J0IEZpbGVDb21wb25lbnQgZnJvbSAnLi9maWxlLWNvbnRhaW5lcic7XG5pbXBvcnQgRWRpdG9yQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudHMvZWRpdG9yLWNvbXBvbmVudCc7XG5pbXBvcnQgQnVsa0FjdGlvbnNDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50cy9idWxrLWFjdGlvbnMtY29tcG9uZW50JztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmZ1bmN0aW9uIGdldENvbXBhcmF0b3IoZmllbGQsIGRpcmVjdGlvbikge1xuXHRyZXR1cm4gKGEsIGIpID0+IHtcblx0XHRpZiAoZGlyZWN0aW9uID09PSAnYXNjJykge1xuXHRcdFx0aWYgKGFbZmllbGRdIDwgYltmaWVsZF0pIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYVtmaWVsZF0gPiBiW2ZpZWxkXSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGFbZmllbGRdID4gYltmaWVsZF0pIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYVtmaWVsZF0gPCBiW2ZpZWxkXSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gMDtcblx0fTtcbn1cblxuZnVuY3Rpb24gZ2V0U29ydChmaWVsZCwgZGlyZWN0aW9uKSB7XG5cdGxldCBjb21wYXJhdG9yID0gZ2V0Q29tcGFyYXRvcihmaWVsZCwgZGlyZWN0aW9uKTtcblxuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdGxldCBmb2xkZXJzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgPT09ICdmb2xkZXInKTtcblx0XHRsZXQgZmlsZXMgPSB0aGlzLnN0YXRlLmZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUudHlwZSAhPT0gJ2ZvbGRlcicpO1xuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHQnZmlsZXMnOiBmb2xkZXJzLnNvcnQoY29tcGFyYXRvcikuY29uY2F0KGZpbGVzLnNvcnQoY29tcGFyYXRvcikpXG5cdFx0fSk7XG5cdH1cbn1cblxuY2xhc3MgR2FsbGVyeUNvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0J2NvdW50JzogMCwgLy8gVGhlIG51bWJlciBvZiBmaWxlcyBpbiB0aGUgY3VycmVudCB2aWV3XG5cdFx0XHQnZmlsZXMnOiBbXSxcblx0XHRcdCdzZWxlY3RlZEZpbGVzJzogW10sXG5cdFx0XHQnZWRpdGluZyc6IG51bGxcblx0XHR9O1xuXG5cdFx0dGhpcy5mb2xkZXJzID0gW3Byb3BzLmluaXRpYWxfZm9sZGVyXTtcblxuXHRcdHRoaXMuc29ydCA9ICduYW1lJztcblx0XHR0aGlzLmRpcmVjdGlvbiA9ICdhc2MnO1xuXG5cdFx0dGhpcy5zb3J0ZXJzID0gW1xuXHRcdFx0e1xuXHRcdFx0XHQnZmllbGQnOiAndGl0bGUnLFxuXHRcdFx0XHQnZGlyZWN0aW9uJzogJ2FzYycsXG5cdFx0XHRcdCdsYWJlbCc6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkZJTFRFUl9USVRMRV9BU0MnKSxcblx0XHRcdFx0J29uU29ydCc6IGdldFNvcnQuY2FsbCh0aGlzLCAndGl0bGUnLCAnYXNjJylcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCdmaWVsZCc6ICd0aXRsZScsXG5cdFx0XHRcdCdkaXJlY3Rpb24nOiAnZGVzYycsXG5cdFx0XHRcdCdsYWJlbCc6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkZJTFRFUl9USVRMRV9ERVNDJyksXG5cdFx0XHRcdCdvblNvcnQnOiBnZXRTb3J0LmNhbGwodGhpcywgJ3RpdGxlJywgJ2Rlc2MnKVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J2ZpZWxkJzogJ2NyZWF0ZWQnLFxuXHRcdFx0XHQnZGlyZWN0aW9uJzogJ2Rlc2MnLFxuXHRcdFx0XHQnbGFiZWwnOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfREFURV9ERVNDJyksXG5cdFx0XHRcdCdvblNvcnQnOiBnZXRTb3J0LmNhbGwodGhpcywgJ2NyZWF0ZWQnLCAnZGVzYycpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQnZmllbGQnOiAnY3JlYXRlZCcsXG5cdFx0XHRcdCdkaXJlY3Rpb24nOiAnYXNjJyxcblx0XHRcdFx0J2xhYmVsJzogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRklMVEVSX0RBVEVfQVNDJyksXG5cdFx0XHRcdCdvblNvcnQnOiBnZXRTb3J0LmNhbGwodGhpcywgJ2NyZWF0ZWQnLCAnYXNjJylcblx0XHRcdH1cblx0XHRdO1xuXG5cdFx0dGhpcy5saXN0ZW5lcnMgPSB7XG5cdFx0XHQnb25TZWFyY2hEYXRhJzogKGRhdGEpID0+IHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2NvdW50JzogZGF0YS5jb3VudCxcblx0XHRcdFx0XHQnZmlsZXMnOiBkYXRhLmZpbGVzXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdCdvbk1vcmVEYXRhJzogKGRhdGEpID0+IHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2NvdW50JzogZGF0YS5jb3VudCxcblx0XHRcdFx0XHQnZmlsZXMnOiB0aGlzLnN0YXRlLmZpbGVzLmNvbmNhdChkYXRhLmZpbGVzKVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHQnb25OYXZpZ2F0ZURhdGEnOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHQnY291bnQnOiBkYXRhLmNvdW50LFxuXHRcdFx0XHRcdCdmaWxlcyc6IGRhdGEuZmlsZXNcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0J29uRGVsZXRlRGF0YSc6IChkYXRhKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdCdjb3VudCc6IHRoaXMuc3RhdGUuY291bnQgLSAxLFxuXHRcdFx0XHRcdCdmaWxlcyc6IHRoaXMuc3RhdGUuZmlsZXMuZmlsdGVyKChmaWxlKSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YSAhPT0gZmlsZS5pZDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHQnb25TYXZlRGF0YSc6IChpZCwgdmFsdWVzKSA9PiB7XG5cdFx0XHRcdGxldCBmaWxlcyA9IHRoaXMuc3RhdGUuZmlsZXM7XG5cblx0XHRcdFx0ZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuXHRcdFx0XHRcdGlmIChmaWxlLmlkID09IGlkKSB7XG5cdFx0XHRcdFx0XHRmaWxlLnRpdGxlID0gdmFsdWVzLnRpdGxlO1xuXHRcdFx0XHRcdFx0ZmlsZS5iYXNlbmFtZSA9IHZhbHVlcy5iYXNlbmFtZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdCdmaWxlcyc6IGZpbGVzLFxuXHRcdFx0XHRcdCdlZGl0aW5nJzogbnVsbFxuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHQnb25GZXRjaERhdGEnOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHQnY291bnQnOiBkYXRhLmNvdW50LFxuXHRcdFx0XHRcdCdmaWxlcyc6IGRhdGEuZmlsZXNcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHRoaXMub25GaWxlU2F2ZSA9IHRoaXMub25GaWxlU2F2ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25GaWxlTmF2aWdhdGUgPSB0aGlzLm9uRmlsZU5hdmlnYXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbkZpbGVFZGl0ID0gdGhpcy5vbkZpbGVFZGl0LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbkZpbGVEZWxldGUgPSB0aGlzLm9uRmlsZURlbGV0ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25CYWNrQ2xpY2sgPSB0aGlzLm9uQmFja0NsaWNrLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbk1vcmVDbGljayA9IHRoaXMub25Nb3JlQ2xpY2suYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uTmF2aWdhdGUgPSB0aGlzLm9uTmF2aWdhdGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uQ2FuY2VsID0gdGhpcy5vbkNhbmNlbC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuZ2V0U2VsZWN0ZWRGaWxlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGaWxlcy5iaW5kKHRoaXMpO1xuXHR9XG5cblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0c3VwZXIuY29tcG9uZW50RGlkTW91bnQoKTtcblxuXHRcdGZvciAobGV0IGV2ZW50IGluIHRoaXMubGlzdGVuZXJzKSB7XG5cdFx0XHR0aGlzLnByb3BzLmJhY2tlbmQub24oZXZlbnQsIHRoaXMubGlzdGVuZXJzW2V2ZW50XSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucHJvcHMuaW5pdGlhbF9mb2xkZXIgIT09IHRoaXMucHJvcHMuY3VycmVudF9mb2xkZXIpIHtcblx0XHRcdHRoaXMub25OYXZpZ2F0ZSh0aGlzLnByb3BzLmN1cnJlbnRfZm9sZGVyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLnNlYXJjaCgpO1xuXHRcdH1cblx0fVxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuXHRcdHN1cGVyLmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cblx0XHRmb3IgKGxldCBldmVudCBpbiB0aGlzLmxpc3RlbmVycykge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCB0aGlzLmxpc3RlbmVyc1tldmVudF0pO1xuXHRcdH1cblx0fVxuXG5cdGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcblx0XHR2YXIgJHNlbGVjdCA9ICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5nYWxsZXJ5X19zb3J0IC5kcm9wZG93bicpO1xuXG5cdFx0Ly8gV2Ugb3B0LW91dCBvZiBsZXR0aW5nIHRoZSBDTVMgaGFuZGxlIENob3NlbiBiZWNhdXNlIGl0IGRvZXNuJ3QgcmUtYXBwbHkgdGhlIGJlaGF2aW91ciBjb3JyZWN0bHkuXG5cdFx0Ly8gU28gYWZ0ZXIgdGhlIGdhbGxlcnkgaGFzIGJlZW4gcmVuZGVyZWQgd2UgYXBwbHkgQ2hvc2VuLlxuXHRcdCRzZWxlY3QuY2hvc2VuKHtcblx0XHRcdCdhbGxvd19zaW5nbGVfZGVzZWxlY3QnOiB0cnVlLFxuXHRcdFx0J2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCc6IDIwXG5cdFx0fSk7XG5cblx0XHQvLyBDaG9zZW4gc3RvcHMgdGhlIGNoYW5nZSBldmVudCBmcm9tIHJlYWNoaW5nIFJlYWN0IHNvIHdlIGhhdmUgdG8gc2ltdWxhdGUgYSBjbGljay5cblx0XHQkc2VsZWN0LmNoYW5nZSgoKSA9PiBSZWFjdFRlc3RVdGlscy5TaW11bGF0ZS5jbGljaygkc2VsZWN0LmZpbmQoJzpzZWxlY3RlZCcpWzBdKSk7XG5cdH1cblxuXHRnZXRGaWxlQnlJZChpZCkge1xuXHRcdHZhciBmb2xkZXIgPSBudWxsO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRlLmZpbGVzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRpZiAodGhpcy5zdGF0ZS5maWxlc1tpXS5pZCA9PT0gaWQpIHtcblx0XHRcdFx0Zm9sZGVyID0gdGhpcy5zdGF0ZS5maWxlc1tpXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZvbGRlcjtcblx0fVxuXHRcblx0Z2V0Tm9JdGVtc05vdGljZSgpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5jb3VudCA8IDEpIHtcblx0XHRcdHJldHVybiA8cCBjbGFzc05hbWU9XCJuby1pdGVtLW5vdGljZVwiPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5OT0lURU1TRk9VTkQnKX08L3A+O1xuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGdldEJhY2tCdXR0b24oKSB7XG5cdFx0aWYgKHRoaXMuZm9sZGVycy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZXR1cm4gPGJ1dHRvblxuXHRcdFx0XHRjbGFzc05hbWU9J2dhbGxlcnlfX2JhY2sgc3MtdWktYnV0dG9uIHVpLWJ1dHRvbiB1aS13aWRnZXQgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsIGZvbnQtaWNvbi1sZXZlbC11cCBuby10ZXh0J1xuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uQmFja0NsaWNrfVxuXHRcdFx0XHRyZWY9XCJiYWNrQnV0dG9uXCI+PC9idXR0b24+O1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Z2V0QnVsa0FjdGlvbnNDb21wb25lbnQoKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwICYmIHRoaXMucHJvcHMuYmFja2VuZC5idWxrQWN0aW9ucykge1xuXHRcdFx0cmV0dXJuIDxCdWxrQWN0aW9uc0NvbXBvbmVudFxuXHRcdFx0XHRvcHRpb25zPXtDT05TVEFOVFMuQlVMS19BQ1RJT05TfVxuXHRcdFx0XHRwbGFjZWhvbGRlcj17c3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQlVMS19BQ1RJT05TX1BMQUNFSE9MREVSJyl9XG5cdFx0XHRcdGJhY2tlbmQ9e3RoaXMucHJvcHMuYmFja2VuZH1cblx0XHRcdFx0Z2V0U2VsZWN0ZWRGaWxlcz17dGhpcy5nZXRTZWxlY3RlZEZpbGVzfSAvPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGdldE1vcmVCdXR0b24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuY291bnQgPiB0aGlzLnN0YXRlLmZpbGVzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPVwiZ2FsbGVyeV9fbG9hZF9fbW9yZVwiXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25Nb3JlQ2xpY2t9PntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5MT0FETU9SRScpfTwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGdldFNlbGVjdGVkRmlsZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3RhdGUuc2VsZWN0ZWRGaWxlcztcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5lZGl0aW5nICE9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuXHRcdFx0XHQ8RWRpdG9yQ29tcG9uZW50XG5cdFx0XHRcdFx0ZmlsZT17dGhpcy5zdGF0ZS5lZGl0aW5nfVxuXHRcdFx0XHRcdG9uRmlsZVNhdmU9e3RoaXMub25GaWxlU2F2ZX1cblx0XHRcdFx0XHRvbkNhbmNlbD17dGhpcy5vbkNhbmNlbH0gLz5cblx0XHRcdDwvZGl2Pjtcblx0XHR9XG5cblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuXHRcdFx0e3RoaXMuZ2V0QmFja0J1dHRvbigpfVxuXHRcdFx0e3RoaXMuZ2V0QnVsa0FjdGlvbnNDb21wb25lbnQoKX1cblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZ2FsbGVyeV9fc29ydCBmaWVsZGhvbGRlci1zbWFsbFwiPlxuXHRcdFx0XHQ8c2VsZWN0IGNsYXNzTmFtZT1cImRyb3Bkb3duIG5vLWNoYW5nZS10cmFjayBuby1jaHpuXCIgdGFiSW5kZXg9XCIwXCIgc3R5bGU9e3t3aWR0aDogJzE2MHB4J319PlxuXHRcdFx0XHRcdHt0aGlzLnNvcnRlcnMubWFwKChzb3J0ZXIsIGkpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiA8b3B0aW9uIGtleT17aX0gb25DbGljaz17c29ydGVyLm9uU29ydH0+e3NvcnRlci5sYWJlbH08L29wdGlvbj47XG5cdFx0XHRcdFx0fSl9XG5cdFx0XHRcdDwvc2VsZWN0PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeV9faXRlbXMnPlxuXHRcdFx0XHR7dGhpcy5zdGF0ZS5maWxlcy5tYXAoKGZpbGUsIGkpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gPEZpbGVDb21wb25lbnQga2V5PXtpfSB7Li4uZmlsZX1cblx0XHRcdFx0XHRcdHNwYWNlS2V5PXtDT05TVEFOVFMuU1BBQ0VfS0VZX0NPREV9XG5cdFx0XHRcdFx0XHRyZXR1cm5LZXk9e0NPTlNUQU5UUy5SRVRVUk5fS0VZX0NPREV9XG5cdFx0XHRcdFx0XHRvbkZpbGVEZWxldGU9e3RoaXMub25GaWxlRGVsZXRlfVxuXHRcdFx0XHRcdFx0b25GaWxlRWRpdD17dGhpcy5vbkZpbGVFZGl0fVxuXHRcdFx0XHRcdFx0b25GaWxlTmF2aWdhdGU9e3RoaXMub25GaWxlTmF2aWdhdGV9XG5cdFx0XHRcdFx0XHRzZWxlY3RlZD17dGhpcy5zdGF0ZS5zZWxlY3RlZEZpbGVzLmluZGV4T2YoZmlsZS5pZCkgPiAtMX0gLz47XG5cdFx0XHRcdH0pfVxuXHRcdFx0PC9kaXY+XG5cdFx0XHR7dGhpcy5nZXROb0l0ZW1zTm90aWNlKCl9XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX2xvYWRcIj5cblx0XHRcdFx0e3RoaXMuZ2V0TW9yZUJ1dHRvbigpfVxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+O1xuXHR9XG5cblx0b25DYW5jZWwoKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHQnZWRpdGluZyc6IG51bGxcblx0XHR9KTtcblxuXHRcdHRoaXMuZW1pdEV4aXRGaWxlVmlld0Ntc0V2ZW50KCk7XG5cdH1cblxuXHRvbkZpbGVEZWxldGUoZmlsZSwgZXZlbnQpIHtcblx0XHRpZiAoY29uZmlybShpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5DT05GSVJNREVMRVRFJykpKSB7XG5cdFx0XHR0aGlzLnByb3BzLmJhY2tlbmQuZGVsZXRlKGZpbGUuaWQpO1xuXHRcdFx0dGhpcy5lbWl0RmlsZURlbGV0ZWRDbXNFdmVudCgpO1xuXHRcdH1cblxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9XG5cblx0b25GaWxlRWRpdChmaWxlLCBldmVudCkge1xuXHRcdC8vIEFsbG93IGNvbXBvbmVudCB1c2VycyB0byBpbmplY3QgYmVoYXZpb3VyLlxuXHRcdC8vIFRlbXBvcmFyeSBzb2x1dGlvbiB1bnRpbCB0aGUgQ01TIGlzIGZ1bGx5IFJlYWN0IGJhc2VkLFxuXHRcdC8vIGF0IHdoaWNoIHBvaW50IHdlIGNhbiB3b3JrIHdpdGggRVM2IHN1YmNsYXNzZXMuXG5cdFx0dmFyIGNiID0gdGhpcy5wcm9wcy5fb25GaWxlRWRpdENhbGxiYWNrO1xuXHRcdGlmKCFjYiB8fCBjYihmaWxlLCBldmVudCkgIT09IGZhbHNlKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0J2VkaXRpbmcnOiBmaWxlXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHR0aGlzLmVtaXRFbnRlckZpbGVWaWV3Q21zRXZlbnQoZmlsZSk7XG5cblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fVxuXG5cdG9uRmlsZU5hdmlnYXRlKGZpbGUpIHtcblx0XHR0aGlzLmZvbGRlcnMucHVzaChmaWxlLmZpbGVuYW1lKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQubmF2aWdhdGUoZmlsZS5maWxlbmFtZSk7XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdzZWxlY3RlZEZpbGVzJzogW11cblx0XHR9KTtcblxuXHRcdHRoaXMuZW1pdEZvbGRlckNoYW5nZWRDbXNFdmVudCgpO1xuXHRcdC8vIHRoaXMuc2F2ZUZvbGRlck5hbWVJblNlc3Npb24oKTtcblx0fVxuXG5cdGVtaXRGb2xkZXJDaGFuZ2VkQ21zRXZlbnQoKSB7XG5cdFx0dmFyIGZvbGRlciA9IHtcblx0XHRcdHBhcmVudElkOiAwLFxuXHRcdFx0aWQ6IDBcblx0XHR9O1xuXG5cdFx0Ly8gVGhlIGN1cnJlbnQgZm9sZGVyIGlzIHN0b3JlZCBieSBpdCdzIG5hbWUgaW4gb3VyIGNvbXBvbmVudC5cblx0XHQvLyBXZSBuZWVkIHRvIGdldCBpdCdzIGlkIGJlY2F1c2UgdGhhdCdzIGhvdyBFbnR3aW5lIGNvbXBvbmVudHMgKEdyaWRGaWVsZCkgcmVmZXJlbmNlIGl0LlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5maWxlcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0aWYgKHRoaXMuc3RhdGUuZmlsZXNbaV0uZmlsZW5hbWUgPT09IHRoaXMucHJvcHMuYmFja2VuZC5mb2xkZXIpIHtcblx0XHRcdFx0Zm9sZGVyLnBhcmVudElkID0gdGhpcy5zdGF0ZS5maWxlc1tpXS5wYXJlbnQuaWQ7XG5cdFx0XHRcdGZvbGRlci5pZCA9IHRoaXMuc3RhdGUuZmlsZXNbaV0uaWQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX2VtaXRDbXNFdmVudCgnZm9sZGVyLWNoYW5nZWQuYXNzZXQtZ2FsbGVyeS1maWVsZCcsIGZvbGRlcik7XG5cdH1cblxuXHRlbWl0RmlsZURlbGV0ZWRDbXNFdmVudCgpIHtcblx0XHR0aGlzLl9lbWl0Q21zRXZlbnQoJ2ZpbGUtZGVsZXRlZC5hc3NldC1nYWxsZXJ5LWZpZWxkJyk7XG5cdH1cblxuXHRlbWl0RW50ZXJGaWxlVmlld0Ntc0V2ZW50KGZpbGUpIHtcblx0XHR2YXIgaWQgPSAwO1xuXG5cdFx0dGhpcy5fZW1pdENtc0V2ZW50KCdlbnRlci1maWxlLXZpZXcuYXNzZXQtZ2FsbGVyeS1maWVsZCcsIGZpbGUuaWQpO1xuXHR9XG5cblx0ZW1pdEV4aXRGaWxlVmlld0Ntc0V2ZW50KCkge1xuXHRcdHRoaXMuX2VtaXRDbXNFdmVudCgnZXhpdC1maWxlLXZpZXcuYXNzZXQtZ2FsbGVyeS1maWVsZCcpO1xuXHR9XG5cblx0Ly8gc2F2ZUZvbGRlck5hbWVJblNlc3Npb24oKSB7XG5cdC8vIFx0aWYgKHRoaXMucHJvcHMuaGFzU2Vzc2lvblN0b3JhZ2UoKSkge1xuXHQvLyBcdFx0d2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuY2xvc2VzdCgnLmFzc2V0LWdhbGxlcnknKVswXS5pZCwgdGhpcy5wcm9wcy5iYWNrZW5kLmZvbGRlcik7XG5cdC8vIFx0fVxuXHQvLyB9XG5cblx0b25OYXZpZ2F0ZShmb2xkZXIsIHNpbGVudCA9IGZhbHNlKSB7XG5cdFx0Ly8gRG9uJ3QgdGhlIGZvbGRlciBpZiBpdCBleGlzdHMgYWxyZWFkeS5cblx0XHRpZiAodGhpcy5mb2xkZXJzLmluZGV4T2YoZm9sZGVyKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMuZm9sZGVycy5wdXNoKGZvbGRlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm5hdmlnYXRlKGZvbGRlcik7XG5cblx0XHRpZiAoIXNpbGVudCkge1xuXHRcdFx0dGhpcy5lbWl0Rm9sZGVyQ2hhbmdlZENtc0V2ZW50KCk7XG5cdFx0fVxuXG5cdFx0Ly8gdGhpcy5zYXZlRm9sZGVyTmFtZUluU2Vzc2lvbigpO1xuXHR9XG5cblx0b25Nb3JlQ2xpY2soZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5tb3JlKCk7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0b25CYWNrQ2xpY2soZXZlbnQpIHtcblx0XHRpZiAodGhpcy5mb2xkZXJzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHRoaXMuZm9sZGVycy5wb3AoKTtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5uYXZpZ2F0ZSh0aGlzLmZvbGRlcnNbdGhpcy5mb2xkZXJzLmxlbmd0aCAtIDFdKTtcblx0XHR9XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdzZWxlY3RlZEZpbGVzJzogW11cblx0XHR9KTtcblxuXHRcdHRoaXMuZW1pdEZvbGRlckNoYW5nZWRDbXNFdmVudCgpO1xuXHRcdC8vIHRoaXMuc2F2ZUZvbGRlck5hbWVJblNlc3Npb24oKTtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRvbkZpbGVTYXZlKGlkLCBzdGF0ZSwgZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQuc2F2ZShpZCwgc3RhdGUpO1xuXG5cdFx0dGhpcy5lbWl0RXhpdEZpbGVWaWV3Q21zRXZlbnQoKTtcblxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cbn1cblxuR2FsbGVyeUNvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG5cdC8vICdoYXNTZXNzaW9uU3RvcmFnZSc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdCdiYWNrZW5kJzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcblx0cmV0dXJuIHt9XG59XG5cbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuXHRyZXR1cm4ge1xuXHRcdGFjdGlvbnM6IGJpbmRBY3Rpb25DcmVhdG9ycyhkaXNwYXRjaClcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShHYWxsZXJ5Q29tcG9uZW50KTtcbiIsImV4cG9ydCBjb25zdCBHQUxMRVJZID0ge1xuICAgIEFERF9GSUxFOiAnQUREX0ZJTEUnLFxuICAgIFNFTEVDVF9GSUxFOiAnU0VMRUNUX0ZJTEUnXG59XG4iLCIvKipcbiAqIEBmaWxlIEZhY3RvcnkgZm9yIGNyZWF0aW5nIGEgUmVkdXggc3RvcmUuXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCB0aHVua01pZGRsZXdhcmUgZnJvbSAncmVkdXgtdGh1bmsnOyAvLyBVc2VkIGZvciBoYW5kbGluZyBhc3luYyBzdG9yZSB1cGRhdGVzLlxuaW1wb3J0IGNyZWF0ZUxvZ2dlciBmcm9tICdyZWR1eC1sb2dnZXInOyAvLyBMb2dzIHN0YXRlIGNoYW5nZXMgdG8gdGhlIGNvbnNvbGUuIFVzZWZ1bCBmb3IgZGVidWdnaW5nLlxuaW1wb3J0IHJvb3RSZWR1Y2VyIGZyb20gJy4vcmVkdWNlcic7XG5cbi8qKlxuICogQGZ1bmMgY3JlYXRlU3RvcmVXaXRoTWlkZGxld2FyZVxuICogQHBhcmFtIGZ1bmN0aW9uIHJvb3RSZWR1Y2VyXG4gKiBAcGFyYW0gb2JqZWN0IGluaXRpYWxTdGF0ZVxuICogQGRlc2MgQ3JlYXRlcyBhIFJlZHV4IHN0b3JlIHdpdGggc29tZSBtaWRkbGV3YXJlIGFwcGxpZWQuXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBjcmVhdGVTdG9yZVdpdGhNaWRkbGV3YXJlID0gYXBwbHlNaWRkbGV3YXJlKFxuXHR0aHVua01pZGRsZXdhcmUsXG5cdGNyZWF0ZUxvZ2dlcigpXG4pKGNyZWF0ZVN0b3JlKTtcblxuLyoqXG4gKiBAZnVuYyBjb25maWd1cmVTdG9yZVxuICogQHBhcmFtIG9iamVjdCBpbml0aWFsU3RhdGVcbiAqIEByZXR1cm4gb2JqZWN0IC0gQSBSZWR1eCBzdG9yZSB0aGF0IGxldHMgeW91IHJlYWQgdGhlIHN0YXRlLCBkaXNwYXRjaCBhY3Rpb25zIGFuZCBzdWJzY3JpYmUgdG8gY2hhbmdlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29uZmlndXJlU3RvcmUoaW5pdGlhbFN0YXRlID0ge30pIHtcblx0Y29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZVdpdGhNaWRkbGV3YXJlKHJvb3RSZWR1Y2VyLCBpbml0aWFsU3RhdGUpO1xuXG5cdHJldHVybiBzdG9yZTtcbn07IiwiaW1wb3J0IHsgR0FMTEVSWSB9IGZyb20gJy4uL2FjdGlvbi10eXBlcyc7XG5cbi8qKlxuICogQWRkcyBhIGZpbGUgdG8gc3RhdGVcbiAqXG4gKiBAcGFyYW0gb2JqZWN0IGZpbGVcbiAqIEBwYXJhbSBudW1iZXIgZmlsZS5pZCAtIFRoZSBmaWxlIGlkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRmlsZShmaWxlKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoICh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLkFERF9GSUxFLFxuICAgICAgICAgICAgcGF5bG9hZDogZmlsZVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU2VsZWN0cyBhIGZpbGVcbiAqXG4gKiBAcGFyYW0gb2JqZWN0IGZpbGVcbiAqIEBwYXJhbSBudW1iZXIgZmlsZS5pZCAtIFRoZSBmaWxlIGlkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0RmlsZShmaWxlKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoICh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlNFTEVDVF9GSUxFLFxuICAgICAgICAgICAgcGF5bG9hZDogZmlsZVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgZGVlcEZyZWV6ZSBmcm9tICdkZWVwLWZyZWV6ZSc7XG5pbXBvcnQgeyBHQUxMRVJZIH0gZnJvbSAnLi4vYWN0aW9uLXR5cGVzJztcblxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xuICAgIGZpbGVzOiBbXSxcbiAgICBzZWxlY3RlZEZpbGVzOiBbXVxufTtcblxuLyoqXG4gKiBSZWR1Y2VyIGZvciB0aGUgYGFzc2V0QWRtaW4uZ2FsbGVyeWAgc3RhdGUga2V5LlxuICpcbiAqIEBwYXJhbSBvYmplY3Qgc3RhdGVcbiAqIEBwYXJhbSBvYmplY3QgYWN0aW9uIC0gVGhlIGRpc3BhdGNoZWQgYWN0aW9uLlxuICogQHBhcmFtIHN0cmluZyBhY3Rpb24udHlwZSAtIE5hbWUgb2YgdGhlIGRpc3BhdGNoZWQgYWN0aW9uLlxuICogQHBhcmFtIG9iamVjdCBbYWN0aW9uLnBheWxvYWRdIC0gT3B0aW9uYWwgZGF0YSBwYXNzZWQgd2l0aCB0aGUgYWN0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnYWxsZXJ5UmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG5cbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgR0FMTEVSWS5BRERfRklMRTpcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGZpbGVzOiBzdGF0ZS5maWxlcy5jb25jYXQoYWN0aW9uLnBheWxvYWQpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFTEVDVF9GSUxFOlxuICAgICAgICAgICAgdmFyIG5ld1NlbGVjdGVkRmlsZXMgPSBbXSxcbiAgICAgICAgICAgICAgICBmaWxlSW5kZXggPSBzdGF0ZS5zZWxlY3RlZEZpbGVzLmluZGV4T2YoYWN0aW9uLnBheWxvYWQuaWQpO1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIGZpbGUgaWYgaXQgZG9lc24ndCBleGlzdCwgb3RoZXJ3aXNlIHJlbW92ZSBpdC5cbiAgICAgICAgICAgIGlmIChmaWxlSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIG5ld1NlbGVjdGVkRmlsZXMgPSBzdGF0ZS5zZWxlY3RlZEZpbGVzLmZpbHRlcigoaWQpID0+IGlkICE9PSBhY3Rpb24ucGF5bG9hZC5pZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld1NlbGVjdGVkRmlsZXMgPSBzdGF0ZS5zZWxlY3RlZEZpbGVzLmNvbmNhdChhY3Rpb24ucGF5bG9hZC5pZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkRmlsZXM6IG5ld1NlbGVjdGVkRmlsZXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgVGhlIHJlZHVjZXIgd2hpY2ggb3BlcmF0ZXMgb24gdGhlIFJlZHV4IHN0b3JlLlxuICovXG5cbmltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBnYWxsZXJ5UmVkdWNlciBmcm9tICcuL2dhbGxlcnkvcmVkdWNlci5qcyc7XG5cbi8qKlxuICogT3BlcmF0ZXMgb24gdGhlIFJlZHV4IHN0b3JlIHRvIHVwZGF0ZSBhcHBsaWNhdGlvbiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0gb2JqZWN0IHN0YXRlIC0gVGhlIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gb2JqZWN0IGFjdGlvbiAtIFRoZSBkaXNwYXRjaGVkIGFjdGlvbi5cbiAqIEBwYXJhbSBzdHJpbmcgYWN0aW9uLnR5cGUgLSBUaGUgdHlwZSBvZiBhY3Rpb24gdGhhdCBoYXMgYmVlbiBkaXNwYXRjaGVkLlxuICogQHBhcmFtIG9iamVjdCBbYWN0aW9uLnBheWxvYWRdIC0gT3B0aW9uYWwgZGF0YSBwYXNzZWQgd2l0aCB0aGUgYWN0aW9uLlxuICovXG5jb25zdCByb290UmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gICAgYXNzZXRBZG1pbjogY29tYmluZVJlZHVjZXJzKHtcbiAgICAgICAgZ2FsbGVyeTogZ2FsbGVyeVJlZHVjZXJcbiAgICB9KVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWVwRnJlZXplIChvKSB7XG4gIE9iamVjdC5mcmVlemUobyk7XG5cbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobykuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgIGlmIChvLmhhc093blByb3BlcnR5KHByb3ApXG4gICAgJiYgb1twcm9wXSAhPT0gbnVsbFxuICAgICYmICh0eXBlb2Ygb1twcm9wXSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb1twcm9wXSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICYmICFPYmplY3QuaXNGcm96ZW4ob1twcm9wXSkpIHtcbiAgICAgIGRlZXBGcmVlemUob1twcm9wXSk7XG4gICAgfVxuICB9KTtcbiAgXG4gIHJldHVybiBvO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcmVwZWF0ID0gZnVuY3Rpb24gcmVwZWF0KHN0ciwgdGltZXMpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh0aW1lcyArIDEpLmpvaW4oc3RyKTtcbn07XG52YXIgcGFkID0gZnVuY3Rpb24gcGFkKG51bSwgbWF4TGVuZ3RoKSB7XG4gIHJldHVybiByZXBlYXQoXCIwXCIsIG1heExlbmd0aCAtIG51bS50b1N0cmluZygpLmxlbmd0aCkgKyBudW07XG59O1xudmFyIGZvcm1hdFRpbWUgPSBmdW5jdGlvbiBmb3JtYXRUaW1lKHRpbWUpIHtcbiAgcmV0dXJuIFwiIEAgXCIgKyBwYWQodGltZS5nZXRIb3VycygpLCAyKSArIFwiOlwiICsgcGFkKHRpbWUuZ2V0TWludXRlcygpLCAyKSArIFwiOlwiICsgcGFkKHRpbWUuZ2V0U2Vjb25kcygpLCAyKSArIFwiLlwiICsgcGFkKHRpbWUuZ2V0TWlsbGlzZWNvbmRzKCksIDMpO1xufTtcblxuLy8gVXNlIHRoZSBuZXcgcGVyZm9ybWFuY2UgYXBpIHRvIGdldCBiZXR0ZXIgcHJlY2lzaW9uIGlmIGF2YWlsYWJsZVxudmFyIHRpbWVyID0gdHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09IFwiZnVuY3Rpb25cIiA/IHBlcmZvcm1hbmNlIDogRGF0ZTtcblxuLyoqXG4gKiBDcmVhdGVzIGxvZ2dlciB3aXRoIGZvbGxvd2VkIG9wdGlvbnNcbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAcHJvcGVydHkge29iamVjdH0gb3B0aW9ucyAtIG9wdGlvbnMgZm9yIGxvZ2dlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG9wdGlvbnMubGV2ZWwgLSBjb25zb2xlW2xldmVsXVxuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLmR1cmF0aW9uIC0gcHJpbnQgZHVyYXRpb24gb2YgZWFjaCBhY3Rpb24/XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMudGltZXN0YW1wIC0gcHJpbnQgdGltZXN0YW1wIHdpdGggZWFjaCBhY3Rpb24/XG4gKiBAcHJvcGVydHkge29iamVjdH0gb3B0aW9ucy5jb2xvcnMgLSBjdXN0b20gY29sb3JzXG4gKiBAcHJvcGVydHkge29iamVjdH0gb3B0aW9ucy5sb2dnZXIgLSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYGNvbnNvbGVgIEFQSVxuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLmxvZ0Vycm9ycyAtIHNob3VsZCBlcnJvcnMgaW4gYWN0aW9uIGV4ZWN1dGlvbiBiZSBjYXVnaHQsIGxvZ2dlZCwgYW5kIHJlLXRocm93bj9cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy5jb2xsYXBzZWQgLSBpcyBncm91cCBjb2xsYXBzZWQ/XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMucHJlZGljYXRlIC0gY29uZGl0aW9uIHdoaWNoIHJlc29sdmVzIGxvZ2dlciBiZWhhdmlvclxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gb3B0aW9ucy5zdGF0ZVRyYW5zZm9ybWVyIC0gdHJhbnNmb3JtIHN0YXRlIGJlZm9yZSBwcmludFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gb3B0aW9ucy5hY3Rpb25UcmFuc2Zvcm1lciAtIHRyYW5zZm9ybSBhY3Rpb24gYmVmb3JlIHByaW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBvcHRpb25zLmVycm9yVHJhbnNmb3JtZXIgLSB0cmFuc2Zvcm0gZXJyb3IgYmVmb3JlIHByaW50XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlTG9nZ2VyKCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuICB2YXIgX29wdGlvbnMkbGV2ZWwgPSBvcHRpb25zLmxldmVsO1xuICB2YXIgbGV2ZWwgPSBfb3B0aW9ucyRsZXZlbCA9PT0gdW5kZWZpbmVkID8gXCJsb2dcIiA6IF9vcHRpb25zJGxldmVsO1xuICB2YXIgX29wdGlvbnMkbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXI7XG4gIHZhciBsb2dnZXIgPSBfb3B0aW9ucyRsb2dnZXIgPT09IHVuZGVmaW5lZCA/IHdpbmRvdy5jb25zb2xlIDogX29wdGlvbnMkbG9nZ2VyO1xuICB2YXIgX29wdGlvbnMkbG9nRXJyb3JzID0gb3B0aW9ucy5sb2dFcnJvcnM7XG4gIHZhciBsb2dFcnJvcnMgPSBfb3B0aW9ucyRsb2dFcnJvcnMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBfb3B0aW9ucyRsb2dFcnJvcnM7XG4gIHZhciBjb2xsYXBzZWQgPSBvcHRpb25zLmNvbGxhcHNlZDtcbiAgdmFyIHByZWRpY2F0ZSA9IG9wdGlvbnMucHJlZGljYXRlO1xuICB2YXIgX29wdGlvbnMkZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uO1xuICB2YXIgZHVyYXRpb24gPSBfb3B0aW9ucyRkdXJhdGlvbiA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfb3B0aW9ucyRkdXJhdGlvbjtcbiAgdmFyIF9vcHRpb25zJHRpbWVzdGFtcCA9IG9wdGlvbnMudGltZXN0YW1wO1xuICB2YXIgdGltZXN0YW1wID0gX29wdGlvbnMkdGltZXN0YW1wID09PSB1bmRlZmluZWQgPyB0cnVlIDogX29wdGlvbnMkdGltZXN0YW1wO1xuICB2YXIgdHJhbnNmb3JtZXIgPSBvcHRpb25zLnRyYW5zZm9ybWVyO1xuICB2YXIgX29wdGlvbnMkc3RhdGVUcmFuc2ZvID0gb3B0aW9ucy5zdGF0ZVRyYW5zZm9ybWVyO1xuICB2YXIgLy8gZGVwcmVjYXRlZFxuICBzdGF0ZVRyYW5zZm9ybWVyID0gX29wdGlvbnMkc3RhdGVUcmFuc2ZvID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH0gOiBfb3B0aW9ucyRzdGF0ZVRyYW5zZm87XG4gIHZhciBfb3B0aW9ucyRhY3Rpb25UcmFuc2YgPSBvcHRpb25zLmFjdGlvblRyYW5zZm9ybWVyO1xuICB2YXIgYWN0aW9uVHJhbnNmb3JtZXIgPSBfb3B0aW9ucyRhY3Rpb25UcmFuc2YgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uIChhY3RuKSB7XG4gICAgcmV0dXJuIGFjdG47XG4gIH0gOiBfb3B0aW9ucyRhY3Rpb25UcmFuc2Y7XG4gIHZhciBfb3B0aW9ucyRlcnJvclRyYW5zZm8gPSBvcHRpb25zLmVycm9yVHJhbnNmb3JtZXI7XG4gIHZhciBlcnJvclRyYW5zZm9ybWVyID0gX29wdGlvbnMkZXJyb3JUcmFuc2ZvID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gZXJyb3I7XG4gIH0gOiBfb3B0aW9ucyRlcnJvclRyYW5zZm87XG4gIHZhciBfb3B0aW9ucyRjb2xvcnMgPSBvcHRpb25zLmNvbG9ycztcbiAgdmFyIGNvbG9ycyA9IF9vcHRpb25zJGNvbG9ycyA9PT0gdW5kZWZpbmVkID8ge1xuICAgIHRpdGxlOiBmdW5jdGlvbiB0aXRsZSgpIHtcbiAgICAgIHJldHVybiBcIiMwMDAwMDBcIjtcbiAgICB9LFxuICAgIHByZXZTdGF0ZTogZnVuY3Rpb24gcHJldlN0YXRlKCkge1xuICAgICAgcmV0dXJuIFwiIzlFOUU5RVwiO1xuICAgIH0sXG4gICAgYWN0aW9uOiBmdW5jdGlvbiBhY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXCIjMDNBOUY0XCI7XG4gICAgfSxcbiAgICBuZXh0U3RhdGU6IGZ1bmN0aW9uIG5leHRTdGF0ZSgpIHtcbiAgICAgIHJldHVybiBcIiM0Q0FGNTBcIjtcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICAgIHJldHVybiBcIiNGMjA0MDRcIjtcbiAgICB9XG4gIH0gOiBfb3B0aW9ucyRjb2xvcnM7XG5cbiAgLy8gZXhpdCBpZiBjb25zb2xlIHVuZGVmaW5lZFxuXG4gIGlmICh0eXBlb2YgbG9nZ2VyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAgIHJldHVybiBuZXh0KGFjdGlvbik7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgIH07XG4gIH1cblxuICBpZiAodHJhbnNmb3JtZXIpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiT3B0aW9uICd0cmFuc2Zvcm1lcicgaXMgZGVwcmVjYXRlZCwgdXNlIHN0YXRlVHJhbnNmb3JtZXIgaW5zdGVhZFwiKTtcbiAgfVxuXG4gIHZhciBsb2dCdWZmZXIgPSBbXTtcbiAgZnVuY3Rpb24gcHJpbnRCdWZmZXIoKSB7XG4gICAgbG9nQnVmZmVyLmZvckVhY2goZnVuY3Rpb24gKGxvZ0VudHJ5LCBrZXkpIHtcbiAgICAgIHZhciBzdGFydGVkID0gbG9nRW50cnkuc3RhcnRlZDtcbiAgICAgIHZhciBhY3Rpb24gPSBsb2dFbnRyeS5hY3Rpb247XG4gICAgICB2YXIgcHJldlN0YXRlID0gbG9nRW50cnkucHJldlN0YXRlO1xuICAgICAgdmFyIGVycm9yID0gbG9nRW50cnkuZXJyb3I7XG4gICAgICB2YXIgdG9vayA9IGxvZ0VudHJ5LnRvb2s7XG4gICAgICB2YXIgbmV4dFN0YXRlID0gbG9nRW50cnkubmV4dFN0YXRlO1xuXG4gICAgICB2YXIgbmV4dEVudHJ5ID0gbG9nQnVmZmVyW2tleSArIDFdO1xuICAgICAgaWYgKG5leHRFbnRyeSkge1xuICAgICAgICBuZXh0U3RhdGUgPSBuZXh0RW50cnkucHJldlN0YXRlO1xuICAgICAgICB0b29rID0gbmV4dEVudHJ5LnN0YXJ0ZWQgLSBzdGFydGVkO1xuICAgICAgfVxuICAgICAgLy8gbWVzc2FnZVxuICAgICAgdmFyIGZvcm1hdHRlZEFjdGlvbiA9IGFjdGlvblRyYW5zZm9ybWVyKGFjdGlvbik7XG4gICAgICB2YXIgdGltZSA9IG5ldyBEYXRlKHN0YXJ0ZWQpO1xuICAgICAgdmFyIGlzQ29sbGFwc2VkID0gdHlwZW9mIGNvbGxhcHNlZCA9PT0gXCJmdW5jdGlvblwiID8gY29sbGFwc2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgICAgIH0sIGFjdGlvbikgOiBjb2xsYXBzZWQ7XG5cbiAgICAgIHZhciBmb3JtYXR0ZWRUaW1lID0gZm9ybWF0VGltZSh0aW1lKTtcbiAgICAgIHZhciB0aXRsZUNTUyA9IGNvbG9ycy50aXRsZSA/IFwiY29sb3I6IFwiICsgY29sb3JzLnRpdGxlKGZvcm1hdHRlZEFjdGlvbikgKyBcIjtcIiA6IG51bGw7XG4gICAgICB2YXIgdGl0bGUgPSBcImFjdGlvbiBcIiArIGZvcm1hdHRlZEFjdGlvbi50eXBlICsgKHRpbWVzdGFtcCA/IGZvcm1hdHRlZFRpbWUgOiBcIlwiKSArIChkdXJhdGlvbiA/IFwiIGluIFwiICsgdG9vay50b0ZpeGVkKDIpICsgXCIgbXNcIiA6IFwiXCIpO1xuXG4gICAgICAvLyByZW5kZXJcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChpc0NvbGxhcHNlZCkge1xuICAgICAgICAgIGlmIChjb2xvcnMudGl0bGUpIGxvZ2dlci5ncm91cENvbGxhcHNlZChcIiVjIFwiICsgdGl0bGUsIHRpdGxlQ1NTKTtlbHNlIGxvZ2dlci5ncm91cENvbGxhcHNlZCh0aXRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGNvbG9ycy50aXRsZSkgbG9nZ2VyLmdyb3VwKFwiJWMgXCIgKyB0aXRsZSwgdGl0bGVDU1MpO2Vsc2UgbG9nZ2VyLmdyb3VwKHRpdGxlKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dnZXIubG9nKHRpdGxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbG9ycy5wcmV2U3RhdGUpIGxvZ2dlcltsZXZlbF0oXCIlYyBwcmV2IHN0YXRlXCIsIFwiY29sb3I6IFwiICsgY29sb3JzLnByZXZTdGF0ZShwcmV2U3RhdGUpICsgXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIHByZXZTdGF0ZSk7ZWxzZSBsb2dnZXJbbGV2ZWxdKFwicHJldiBzdGF0ZVwiLCBwcmV2U3RhdGUpO1xuXG4gICAgICBpZiAoY29sb3JzLmFjdGlvbikgbG9nZ2VyW2xldmVsXShcIiVjIGFjdGlvblwiLCBcImNvbG9yOiBcIiArIGNvbG9ycy5hY3Rpb24oZm9ybWF0dGVkQWN0aW9uKSArIFwiOyBmb250LXdlaWdodDogYm9sZFwiLCBmb3JtYXR0ZWRBY3Rpb24pO2Vsc2UgbG9nZ2VyW2xldmVsXShcImFjdGlvblwiLCBmb3JtYXR0ZWRBY3Rpb24pO1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGNvbG9ycy5lcnJvcikgbG9nZ2VyW2xldmVsXShcIiVjIGVycm9yXCIsIFwiY29sb3I6IFwiICsgY29sb3JzLmVycm9yKGVycm9yLCBwcmV2U3RhdGUpICsgXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIGVycm9yKTtlbHNlIGxvZ2dlcltsZXZlbF0oXCJlcnJvclwiLCBlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2xvcnMubmV4dFN0YXRlKSBsb2dnZXJbbGV2ZWxdKFwiJWMgbmV4dCBzdGF0ZVwiLCBcImNvbG9yOiBcIiArIGNvbG9ycy5uZXh0U3RhdGUobmV4dFN0YXRlKSArIFwiOyBmb250LXdlaWdodDogYm9sZFwiLCBuZXh0U3RhdGUpO2Vsc2UgbG9nZ2VyW2xldmVsXShcIm5leHQgc3RhdGVcIiwgbmV4dFN0YXRlKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgbG9nZ2VyLmdyb3VwRW5kKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ2dlci5sb2coXCLigJTigJQgbG9nIGVuZCDigJTigJRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbG9nQnVmZmVyLmxlbmd0aCA9IDA7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgZ2V0U3RhdGUgPSBfcmVmLmdldFN0YXRlO1xuICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgLy8gZXhpdCBlYXJseSBpZiBwcmVkaWNhdGUgZnVuY3Rpb24gcmV0dXJucyBmYWxzZVxuICAgICAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gXCJmdW5jdGlvblwiICYmICFwcmVkaWNhdGUoZ2V0U3RhdGUsIGFjdGlvbikpIHtcbiAgICAgICAgICByZXR1cm4gbmV4dChhY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvZ0VudHJ5ID0ge307XG4gICAgICAgIGxvZ0J1ZmZlci5wdXNoKGxvZ0VudHJ5KTtcblxuICAgICAgICBsb2dFbnRyeS5zdGFydGVkID0gdGltZXIubm93KCk7XG4gICAgICAgIGxvZ0VudHJ5LnByZXZTdGF0ZSA9IHN0YXRlVHJhbnNmb3JtZXIoZ2V0U3RhdGUoKSk7XG4gICAgICAgIGxvZ0VudHJ5LmFjdGlvbiA9IGFjdGlvbjtcblxuICAgICAgICB2YXIgcmV0dXJuZWRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGxvZ0Vycm9ycykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm5lZFZhbHVlID0gbmV4dChhY3Rpb24pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGxvZ0VudHJ5LmVycm9yID0gZXJyb3JUcmFuc2Zvcm1lcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuZWRWYWx1ZSA9IG5leHQoYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZ0VudHJ5LnRvb2sgPSB0aW1lci5ub3coKSAtIGxvZ0VudHJ5LnN0YXJ0ZWQ7XG4gICAgICAgIGxvZ0VudHJ5Lm5leHRTdGF0ZSA9IHN0YXRlVHJhbnNmb3JtZXIoZ2V0U3RhdGUoKSk7XG5cbiAgICAgICAgcHJpbnRCdWZmZXIoKTtcblxuICAgICAgICBpZiAobG9nRW50cnkuZXJyb3IpIHRocm93IGxvZ0VudHJ5LmVycm9yO1xuICAgICAgICByZXR1cm4gcmV0dXJuZWRWYWx1ZTtcbiAgICAgIH07XG4gICAgfTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVMb2dnZXI7Il19

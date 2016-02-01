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

},{"events":15,"jQuery":"jQuery"}],2:[function(require,module,exports){
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

var _redux = require('redux');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _stateSelectedFilesActions = require('../state/selected-files/actions');

var selectedFilesActions = _interopRequireWildcard(_stateSelectedFilesActions);

var _stateFilesActions = require('../state/files/actions');

var filesActions = _interopRequireWildcard(_stateFilesActions);

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
		selectedFiles: state.selectedFiles.selectedFiles
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: (0, _redux.bindActionCreators)(Object.assign(filesActions, selectedFilesActions), dispatch)
	};
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(FileComponent);
module.exports = exports['default'];

},{"../constants":5,"../state/files/actions":10,"../state/selected-files/actions":13,"i18n":"i18n","jQuery":"jQuery","react":"react","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],7:[function(require,module,exports){
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
var CONFIG = {};

exports.CONFIG = CONFIG;
var FILES = {
	ADD_FILE: 'FILES.ADD_FILE'
};

exports.FILES = FILES;
var SELECTED_FILES = {
	SELECT_FILE: 'SELECTED_FILES.SELECT_FILE'
};
exports.SELECTED_FILES = SELECTED_FILES;

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

},{"./reducer":12,"redux":"redux","redux-logger":17,"redux-thunk":"redux-thunk"}],10:[function(require,module,exports){
/**
 * @file Actions for making updates to the selectedItems section of the store's state.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.addFile = addFile;

var _actionTypes = require('../action-types');

function addFile(file) {
	return function (dispatch, getState) {
		return dispatch({
			type: _actionTypes.FILES.ADD_FILE,
			payload: {
				id: file.props.id
			}
		});
	};
}

},{"../action-types":8}],11:[function(require,module,exports){
/**
 * @file Reducers for application's selected items.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = selectedFilesReducer;

var _actionTypes = require('../action-types');

var initialState = {
  files: new Array()
};

/**
 * @func selectedFilesReducer
 * @param object initialState
 * @param object action - The dispatched action.
 * @param string action.type - Name of the dispatched action.
 * @param object [action.payload] - Optional data passed with the action.
 * @desc Reducer for the `selectedItems` section of state.
 */

function selectedFilesReducer(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case _actionTypes.FILES.ADD_FILE:
      return Object.assign({}, state, {
        files: state.files.concat(action.file)
      });
    default:
      return state;
  }
}

module.exports = exports['default'];

},{"../action-types":8}],12:[function(require,module,exports){
/**
 * @file The reducer which operates on the Redux store.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _redux = require('redux');

var _selectedFilesReducerJs = require('./selected-files/reducer.js');

var _selectedFilesReducerJs2 = _interopRequireDefault(_selectedFilesReducerJs);

var _filesReducerJs = require('./files/reducer.js');

var _filesReducerJs2 = _interopRequireDefault(_filesReducerJs);

/**
 * @func rootReducer
 * @param object state - The current state.
 * @param object action - The dispatched action.
 * @param string action.type - The type of action that has been dispatched.
 * @param object [action.payload] - Optional data passed with the action.
 * @desc Operates on the Redux store to update application state.
 */
var rootReducer = (0, _redux.combineReducers)({
  files: _filesReducerJs2['default'],
  selectedFiles: _selectedFilesReducerJs2['default']
});

exports['default'] = rootReducer;
module.exports = exports['default'];

},{"./files/reducer.js":11,"./selected-files/reducer.js":14,"redux":"redux"}],13:[function(require,module,exports){
/**
 * @file Actions for making updates to the selectedItems section of the store's state.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.selectFile = selectFile;

var _actionTypes = require('../action-types');

/**
 * Selects a file
 *
 * @param object file
 * @param number file.id - The file id.
 * @param boolean file.selected - The new selected state of the file.
 */

function selectFile(file) {
  return function (dispatch, getState) {
    return dispatch({
      type: _actionTypes.SELECTED_FILES.SELECT_FILE,
      payload: file
    });
  };
}

},{"../action-types":8}],14:[function(require,module,exports){
/**
 * @file Reducers for application's selected items.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = selectedFilesReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _actionTypes = require('../action-types');

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var initialState = {
	selectedFiles: [],
	selected: false
};

/**
 * @func selectedFilesReducer
 * @param object initialState
 * @param object action - The dispatched action.
 * @param string action.type - Name of the dispatched action.
 * @param object [action.payload] - Optional data passed with the action.
 * @desc Reducer for the `selectedItems` section of state.
 */

function selectedFilesReducer(state, action) {
	if (state === undefined) state = initialState;

	switch (action.type) {
		case _actionTypes.SELECTED_FILES.SELECT_FILE:
			var newSelectedFiles = [],
			    fileIndex = state.selectedFiles.indexOf(action.payload.id);

			//Remove file if its already in array, else add it to the array
			if (fileIndex > -1) {
				newSelectedFiles = state.selectedFiles.filter(function (id) {
					return id !== action.payload.id;
				});
			} else {
				newSelectedFiles = state.selectedFiles.concat(action.payload.id);
			}

			return (0, _deepFreeze2['default'])(Object.assign({}, state, {
				selectedFiles: newSelectedFiles
			}));

		default:
			return state;
	}
}

module.exports = exports['default'];

},{"../action-types":8,"deep-freeze":16}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL2JhY2tlbmQvZmlsZS1iYWNrZW5kLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9ib290L2luZGV4LmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb21wb25lbnRzL2J1bGstYWN0aW9ucy1jb21wb25lbnQuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL2NvbXBvbmVudHMvZWRpdG9yLWNvbXBvbmVudC5qcyIsIi92YXIvd3d3L3NzZGV2NDAvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvY29uc3RhbnRzLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb250YWluZXJzL2ZpbGUtY29udGFpbmVyLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb250YWluZXJzL2dhbGxlcnktY29udGFpbmVyLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9hY3Rpb24tdHlwZXMuanMiLCIvdmFyL3d3dy9zc2RldjQwL2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9maWxlcy9hY3Rpb25zLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9maWxlcy9yZWR1Y2VyLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9yZWR1Y2VyLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9zZWxlY3RlZC1maWxlcy9hY3Rpb25zLmpzIiwiL3Zhci93d3cvc3NkZXY0MC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9zZWxlY3RlZC1maWxlcy9yZWR1Y2VyLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvZGVlcC1mcmVlemUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVkdXgtbG9nZ2VyL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQ0FjLFFBQVE7Ozs7c0JBQ0gsUUFBUTs7OztJQUVOLFdBQVc7V0FBWCxXQUFXOztjQUFYLFdBQVc7O1NBQ2xCLGtCQUFnQjtxQ0FBWixVQUFVO0FBQVYsY0FBVTs7O0FBQzFCLDJCQUFXLFdBQVcsZ0JBQUksVUFBVSxNQUFFO0dBQ3RDOzs7QUFFVSxVQUxTLFdBQVcsQ0FLbkIsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRTt3QkFMbkYsV0FBVzs7QUFNOUIsNkJBTm1CLFdBQVcsNkNBTXRCOztBQUVSLE1BQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLE1BQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLE1BQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQy9CLE1BQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLE1B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RSxnQkFBZ0I7SUFDL0IsQ0FBQyxDQUFDLENBQUM7O0FBQUEsQUFFTDtBQUNDLFVBQU8sS0FBSyxDQUFDO0FBQUEsRUFDZDtDQUNEOzs7OztBQ3hDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgRXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVCYWNrZW5kIGV4dGVuZHMgRXZlbnRzIHtcblx0c3RhdGljIGNyZWF0ZSguLi5wYXJhbWV0ZXJzKSB7XG5cdFx0cmV0dXJuIG5ldyBGaWxlQmFja2VuZCguLi5wYXJhbWV0ZXJzKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKGZldGNoX3VybCwgc2VhcmNoX3VybCwgdXBkYXRlX3VybCwgZGVsZXRlX3VybCwgbGltaXQsIGJ1bGtBY3Rpb25zLCAkZm9sZGVyLCBjdXJyZW50Rm9sZGVyKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuZmV0Y2hfdXJsID0gZmV0Y2hfdXJsO1xuXHRcdHRoaXMuc2VhcmNoX3VybCA9IHNlYXJjaF91cmw7XG5cdFx0dGhpcy51cGRhdGVfdXJsID0gdXBkYXRlX3VybDtcblx0XHR0aGlzLmRlbGV0ZV91cmwgPSBkZWxldGVfdXJsO1xuXHRcdHRoaXMubGltaXQgPSBsaW1pdDtcblx0XHR0aGlzLmJ1bGtBY3Rpb25zID0gYnVsa0FjdGlvbnM7XG5cdFx0dGhpcy4kZm9sZGVyID0gJGZvbGRlcjtcblx0XHR0aGlzLmZvbGRlciA9IGN1cnJlbnRGb2xkZXI7XG5cblx0XHR0aGlzLnBhZ2UgPSAxO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jIGZldGNoXG5cdCAqIEBwYXJhbSBudW1iZXIgaWRcblx0ICogQGRlc2MgRmV0Y2hlcyBhIGNvbGxlY3Rpb24gb2YgRmlsZXMgYnkgUGFyZW50SUQuXG5cdCAqL1xuXHRmZXRjaChpZCkge1xuXHRcdGlmICh0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5wYWdlID0gMTtcblxuXHRcdHRoaXMucmVxdWVzdCgnUE9TVCcsIHRoaXMuZmV0Y2hfdXJsLCB7IGlkOiBpZCB9KS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uRmV0Y2hEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRzZWFyY2goKSB7XG5cdFx0dGhpcy5wYWdlID0gMTtcblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uU2VhcmNoRGF0YScsIGpzb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0bW9yZSgpIHtcblx0XHR0aGlzLnBhZ2UrKztcblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uTW9yZURhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG5hdmlnYXRlKGZvbGRlcikge1xuXHRcdHRoaXMucGFnZSA9IDE7XG5cdFx0dGhpcy5mb2xkZXIgPSBmb2xkZXI7XG5cblx0XHR0aGlzLnBlcnNpc3RGb2xkZXJGaWx0ZXIoZm9sZGVyKTtcblxuXHRcdHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uTmF2aWdhdGVEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRwZXJzaXN0Rm9sZGVyRmlsdGVyKGZvbGRlcikge1xuXHRcdGlmIChmb2xkZXIuc3Vic3RyKC0xKSA9PT0gJy8nKSB7XG5cdFx0XHRmb2xkZXIgPSBmb2xkZXIuc3Vic3RyKDAsIGZvbGRlci5sZW5ndGggLSAxKTtcblx0XHR9XG5cblx0XHR0aGlzLiRmb2xkZXIudmFsKGZvbGRlcik7XG5cdH1cblxuXHRkZWxldGUoaWRzKSB7XG5cdFx0dmFyIGZpbGVzVG9EZWxldGUgPSBbXTtcblxuXHRcdC8vIEFsbG93cyB1c2VycyB0byBwYXNzIG9uZSBvciBtb3JlIGlkcyB0byBkZWxldGUuXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpZHMpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG5cdFx0XHRmaWxlc1RvRGVsZXRlLnB1c2goaWRzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZmlsZXNUb0RlbGV0ZSA9IGlkcztcblx0XHR9XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuZGVsZXRlX3VybCwge1xuXHRcdFx0J2lkcyc6IGZpbGVzVG9EZWxldGVcblx0XHR9KS50aGVuKCgpID0+IHtcblx0XHRcdC8vIFVzaW5nIGZvciBsb29wIGNvcyBJRTEwIGRvZXNuJ3QgaGFuZGxlICdmb3Igb2YnLFxuXHRcdFx0Ly8gd2hpY2ggZ2V0cyB0cmFuc2NvbXBpbGVkIGludG8gYSBmdW5jdGlvbiB3aGljaCB1c2VzIFN5bWJvbCxcblx0XHRcdC8vIHRoZSB0aGluZyBJRTEwIGRpZXMgb24uXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzVG9EZWxldGUubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdFx0dGhpcy5lbWl0KCdvbkRlbGV0ZURhdGEnLCBmaWxlc1RvRGVsZXRlW2ldKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZpbHRlcihuYW1lLCB0eXBlLCBmb2xkZXIsIGNyZWF0ZWRGcm9tLCBjcmVhdGVkVG8sIG9ubHlTZWFyY2hJbkZvbGRlcikge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblx0XHR0aGlzLmNyZWF0ZWRGcm9tID0gY3JlYXRlZEZyb207XG5cdFx0dGhpcy5jcmVhdGVkVG8gPSBjcmVhdGVkVG87XG5cdFx0dGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIgPSBvbmx5U2VhcmNoSW5Gb2xkZXI7XG5cblx0XHR0aGlzLnNlYXJjaCgpO1xuXHR9XG5cblx0c2F2ZShpZCwgdmFsdWVzKSB7XG5cdFx0dmFsdWVzWydpZCddID0gaWQ7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ1BPU1QnLCB0aGlzLnVwZGF0ZV91cmwsIHZhbHVlcykudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uU2F2ZURhdGEnLCBpZCwgdmFsdWVzKTtcblx0XHR9KTtcblx0fVxuXG5cdHJlcXVlc3QobWV0aG9kLCB1cmwsIGRhdGEgPSB7fSkge1xuXHRcdGxldCBkZWZhdWx0cyA9IHtcblx0XHRcdCdsaW1pdCc6IHRoaXMubGltaXQsXG5cdFx0XHQncGFnZSc6IHRoaXMucGFnZSxcblx0XHR9O1xuXG5cdFx0aWYgKHRoaXMubmFtZSAmJiB0aGlzLm5hbWUudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMubmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm5hbWUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmZvbGRlciAmJiB0aGlzLmZvbGRlci50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5mb2xkZXIgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5mb2xkZXIpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRGcm9tICYmIHRoaXMuY3JlYXRlZEZyb20udHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuY3JlYXRlZEZyb20gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkRnJvbSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY3JlYXRlZFRvICYmIHRoaXMuY3JlYXRlZFRvLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRUbyA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLmNyZWF0ZWRUbyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMub25seVNlYXJjaEluRm9sZGVyICYmIHRoaXMub25seVNlYXJjaEluRm9sZGVyLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm9ubHlTZWFyY2hJbkZvbGRlciA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5zaG93TG9hZGluZ0luZGljYXRvcigpO1xuXG5cdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHQndXJsJzogdXJsLFxuXHRcdFx0J21ldGhvZCc6IG1ldGhvZCxcblx0XHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHRcdCdkYXRhJzogJC5leHRlbmQoZGVmYXVsdHMsIGRhdGEpXG5cdFx0fSkuYWx3YXlzKCgpID0+IHtcblx0XHRcdHRoaXMuaGlkZUxvYWRpbmdJbmRpY2F0b3IoKTtcblx0XHR9KTtcblx0fVxuXG5cdHNob3dMb2FkaW5nSW5kaWNhdG9yKCkge1xuXHRcdCQoJy5jbXMtY29udGVudCwgLnVpLWRpYWxvZycpLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cdFx0JCgnLnVpLWRpYWxvZy1jb250ZW50JykuY3NzKCdvcGFjaXR5JywgJy4xJyk7XG5cdH1cblxuXHRoaWRlTG9hZGluZ0luZGljYXRvcigpIHtcblx0XHQkKCcuY21zLWNvbnRlbnQsIC51aS1kaWFsb2cnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXHRcdCQoJy51aS1kaWFsb2ctY29udGVudCcpLmNzcygnb3BhY2l0eScsICcxJyk7XG5cdH1cbn1cbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBjb25maWd1cmVTdG9yZSBmcm9tICcuLi9zdGF0ZS9jb25maWd1cmVTdG9yZSc7XG5pbXBvcnQgR2FsbGVyeUNvbXBvbmVudCBmcm9tICcuLi9jb250YWluZXJzL2dhbGxlcnktY29udGFpbmVyJztcbmltcG9ydCBGaWxlQmFja2VuZCBmcm9tICcuLi9iYWNrZW5kL2ZpbGUtYmFja2VuZCc7XG5cbmZ1bmN0aW9uIGdldFZhcihuYW1lKSB7XG5cdHZhciBwYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCc/Jyk7XG5cblx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRwYXJ0cyA9IHBhcnRzWzFdLnNwbGl0KCcjJyk7XG5cdH1cblxuXHRsZXQgdmFyaWFibGVzID0gcGFydHNbMF0uc3BsaXQoJyYnKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHZhcmlhYmxlcy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwYXJ0cyA9IHZhcmlhYmxlc1tpXS5zcGxpdCgnPScpO1xuXG5cdFx0aWYgKGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSkgPT09IG5hbWUpIHtcblx0XHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBoYXNTZXNzaW9uU3RvcmFnZSgpIHtcblx0cmV0dXJuIHR5cGVvZiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcHMocHJvcHMpIHtcblx0dmFyICRjb21wb25lbnRXcmFwcGVyID0gJCgnLmFzc2V0LWdhbGxlcnknKS5maW5kKCcuYXNzZXQtZ2FsbGVyeS1jb21wb25lbnQtd3JhcHBlcicpLFxuXHRcdCRzZWFyY2ggPSAkKCcuY21zLXNlYXJjaC1mb3JtJyksXG5cdFx0aW5pdGlhbEZvbGRlciA9ICQoJy5hc3NldC1nYWxsZXJ5JykuZGF0YSgnYXNzZXQtZ2FsbGVyeS1pbml0aWFsLWZvbGRlcicpLFxuXHRcdGN1cnJlbnRGb2xkZXIgPSBnZXRWYXIoJ3FbRm9sZGVyXScpIHx8IGluaXRpYWxGb2xkZXIsXG5cdFx0YmFja2VuZCxcblx0XHRkZWZhdWx0cztcblxuXHRpZiAoJHNlYXJjaC5maW5kKCdbdHlwZT1oaWRkZW5dW25hbWU9XCJxW0ZvbGRlcl1cIl0nKS5sZW5ndGggPT0gMCkge1xuXHRcdCRzZWFyY2guYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJxW0ZvbGRlcl1cIiAvPicpO1xuXHR9XG5cblx0Ly8gRG8gd2UgbmVlZCB0byBzZXQgdXAgYSBkZWZhdWx0IGJhY2tlbmQ/XG5cdGlmICh0eXBlb2YgcHJvcHMgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwcm9wcy5iYWNrZW5kID09PSAndW5kZWZpbmVkJykge1xuXHRcdGJhY2tlbmQgPSBGaWxlQmFja2VuZC5jcmVhdGUoXG5cdFx0XHQkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LWZldGNoLXVybCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1zZWFyY2gtdXJsJyksXG5cdFx0XHQkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LXVwZGF0ZS11cmwnKSxcblx0XHRcdCRjb21wb25lbnRXcmFwcGVyLmRhdGEoJ2Fzc2V0LWdhbGxlcnktZGVsZXRlLXVybCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1saW1pdCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1idWxrLWFjdGlvbnMnKSxcblx0XHRcdCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJyksXG5cdFx0XHRjdXJyZW50Rm9sZGVyXG5cdFx0KTtcblxuXHRcdGJhY2tlbmQuZW1pdChcblx0XHRcdCdmaWx0ZXInLFxuXHRcdFx0Z2V0VmFyKCdxW05hbWVdJyksXG5cdFx0XHRnZXRWYXIoJ3FbQXBwQ2F0ZWdvcnldJyksXG5cdFx0XHRnZXRWYXIoJ3FbRm9sZGVyXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRGcm9tXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRUb10nKSxcblx0XHRcdGdldFZhcigncVtDdXJyZW50Rm9sZGVyT25seV0nKVxuXHRcdCk7XG5cdH1cblxuXHRkZWZhdWx0cyA9IHtcblx0XHRiYWNrZW5kOiBiYWNrZW5kLFxuXHRcdGN1cnJlbnRfZm9sZGVyOiBjdXJyZW50Rm9sZGVyLFxuXHRcdGNtc0V2ZW50czoge30sXG5cdFx0aW5pdGlhbF9mb2xkZXI6IGluaXRpYWxGb2xkZXIsXG5cdFx0bmFtZTogJCgnLmFzc2V0LWdhbGxlcnknKS5kYXRhKCdhc3NldC1nYWxsZXJ5LW5hbWUnKVxuXHR9O1xuXG5cdHJldHVybiAkLmV4dGVuZCh0cnVlLCBkZWZhdWx0cywgcHJvcHMpO1xufVxuXG5sZXQgcHJvcHMgPSBnZXRQcm9wcygpO1xuY29uc3Qgc3RvcmUgPSBjb25maWd1cmVTdG9yZSgpOyAvL0NyZWF0ZSB0aGUgcmVkdXggc3RvcmVcblxuXG5SZWFjdERPTS5yZW5kZXIoXG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgICAgIDxHYWxsZXJ5Q29tcG9uZW50IHsuLi5wcm9wc30gLz5cbiAgICA8L1Byb3ZpZGVyPixcbiAgICAkKCcuYXNzZXQtZ2FsbGVyeS1jb21wb25lbnQtd3JhcHBlcicpWzBdXG4pO1xuIiwiaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgUmVhY3RUZXN0VXRpbHMgZnJvbSAncmVhY3QtYWRkb25zLXRlc3QtdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWxrQWN0aW9uc0NvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLm9uQ2hhbmdlVmFsdWUgPSB0aGlzLm9uQ2hhbmdlVmFsdWUuYmluZCh0aGlzKTtcblx0fVxuXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHZhciAkc2VsZWN0ID0gJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmRyb3Bkb3duJyk7XG5cblx0XHQkc2VsZWN0LmNob3Nlbih7XG5cdFx0XHQnYWxsb3dfc2luZ2xlX2Rlc2VsZWN0JzogdHJ1ZSxcblx0XHRcdCdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnOiAyMFxuXHRcdH0pO1xuXG5cdFx0Ly8gQ2hvc2VuIHN0b3BzIHRoZSBjaGFuZ2UgZXZlbnQgZnJvbSByZWFjaGluZyBSZWFjdCBzbyB3ZSBoYXZlIHRvIHNpbXVsYXRlIGEgY2xpY2suXG5cdFx0JHNlbGVjdC5jaGFuZ2UoKCkgPT4gUmVhY3RUZXN0VXRpbHMuU2ltdWxhdGUuY2xpY2soJHNlbGVjdC5maW5kKCc6c2VsZWN0ZWQnKVswXSkpO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX2J1bGsgZmllbGRob2xkZXItc21hbGxcIj5cblx0XHRcdDxzZWxlY3QgY2xhc3NOYW1lPVwiZHJvcGRvd24gbm8tY2hhbmdlLXRyYWNrIG5vLWNoem5cIiB0YWJJbmRleD1cIjBcIiBkYXRhLXBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfSBzdHlsZT17e3dpZHRoOiAnMTYwcHgnfX0+XG5cdFx0XHRcdDxvcHRpb24gc2VsZWN0ZWQgZGlzYWJsZWQgaGlkZGVuIHZhbHVlPScnPjwvb3B0aW9uPlxuXHRcdFx0XHR7dGhpcy5wcm9wcy5vcHRpb25zLm1hcCgob3B0aW9uLCBpKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIDxvcHRpb24ga2V5PXtpfSBvbkNsaWNrPXt0aGlzLm9uQ2hhbmdlVmFsdWV9IHZhbHVlPXtvcHRpb24udmFsdWV9PntvcHRpb24ubGFiZWx9PC9vcHRpb24+O1xuXHRcdFx0XHR9KX1cblx0XHRcdDwvc2VsZWN0PlxuXHRcdDwvZGl2Pjtcblx0fVxuXG5cdGdldE9wdGlvbkJ5VmFsdWUodmFsdWUpIHtcblx0XHQvLyBVc2luZyBmb3IgbG9vcCBjb3MgSUUxMCBkb2Vzbid0IGhhbmRsZSAnZm9yIG9mJyxcblx0XHQvLyB3aGljaCBnZXRzIHRyYW5zY29tcGlsZWQgaW50byBhIGZ1bmN0aW9uIHdoaWNoIHVzZXMgU3ltYm9sLFxuXHRcdC8vIHRoZSB0aGluZyBJRTEwIGRpZXMgb24uXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGlmICh0aGlzLnByb3BzLm9wdGlvbnNbaV0udmFsdWUgPT09IHZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnByb3BzLm9wdGlvbnNbaV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRhcHBseUFjdGlvbih2YWx1ZSkge1xuXHRcdC8vIFdlIG9ubHkgaGF2ZSAnZGVsZXRlJyByaWdodCBub3cuLi5cblx0XHRzd2l0Y2ggKHZhbHVlKSB7XG5cdFx0XHRjYXNlICdkZWxldGUnOlxuXHRcdFx0XHR0aGlzLnByb3BzLmJhY2tlbmQuZGVsZXRlKHRoaXMucHJvcHMuZ2V0U2VsZWN0ZWRGaWxlcygpKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRvbkNoYW5nZVZhbHVlKGV2ZW50KSB7XG5cdFx0dmFyIG9wdGlvbiA9IHRoaXMuZ2V0T3B0aW9uQnlWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuXG5cdFx0Ly8gTWFrZSBzdXJlIGEgdmFsaWQgb3B0aW9uIGhhcyBiZWVuIHNlbGVjdGVkLlxuXHRcdGlmIChvcHRpb24gPT09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBvcHRpb24udmFsdWUgfSk7XG5cblx0XHRpZiAob3B0aW9uLmRlc3RydWN0aXZlID09PSB0cnVlKSB7XG5cdFx0XHRpZiAoY29uZmlybShzcy5pMThuLnNwcmludGYoc3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQlVMS19BQ1RJT05TX0NPTkZJUk0nKSwgb3B0aW9uLmxhYmVsKSkpIHtcblx0XHRcdFx0dGhpcy5hcHBseUFjdGlvbihvcHRpb24udmFsdWUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmFwcGx5QWN0aW9uKG9wdGlvbi52YWx1ZSk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVzZXQgdGhlIGRyb3Bkb3duIHRvIGl0J3MgcGxhY2Vob2xkZXIgdmFsdWUuXG5cdFx0JChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmRyb3Bkb3duJykudmFsKCcnKS50cmlnZ2VyKCdsaXN6dDp1cGRhdGVkJyk7XG5cdH1cbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNpbHZlclN0cmlwZUNvbXBvbmVudCBmcm9tICdzaWx2ZXJzdHJpcGUtY29tcG9uZW50JztcblxuY2xhc3MgRWRpdG9yQ29tcG9uZW50IGV4dGVuZHMgU2lsdmVyU3RyaXBlQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0J3RpdGxlJzogdGhpcy5wcm9wcy5maWxlLnRpdGxlLFxuXHRcdFx0J2Jhc2VuYW1lJzogdGhpcy5wcm9wcy5maWxlLmJhc2VuYW1lXG5cdFx0fTtcblxuXHRcdHRoaXMuZmllbGRzID0gW1xuXHRcdFx0e1xuXHRcdFx0XHQnbGFiZWwnOiAnVGl0bGUnLFxuXHRcdFx0XHQnbmFtZSc6ICd0aXRsZScsXG5cdFx0XHRcdCd2YWx1ZSc6IHRoaXMucHJvcHMuZmlsZS50aXRsZSxcblx0XHRcdFx0J29uQ2hhbmdlJzogKGV2ZW50KSA9PiB0aGlzLm9uRmllbGRDaGFuZ2UoJ3RpdGxlJywgZXZlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQnbGFiZWwnOiAnRmlsZW5hbWUnLFxuXHRcdFx0XHQnbmFtZSc6ICdiYXNlbmFtZScsXG5cdFx0XHRcdCd2YWx1ZSc6IHRoaXMucHJvcHMuZmlsZS5iYXNlbmFtZSxcblx0XHRcdFx0J29uQ2hhbmdlJzogKGV2ZW50KSA9PiB0aGlzLm9uRmllbGRDaGFuZ2UoJ2Jhc2VuYW1lJywgZXZlbnQpXG5cdFx0XHR9XG5cdFx0XTtcblxuXHRcdHRoaXMub25GaWVsZENoYW5nZSA9IHRoaXMub25GaWVsZENoYW5nZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25GaWxlU2F2ZSA9IHRoaXMub25GaWxlU2F2ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25DYW5jZWwgPSB0aGlzLm9uQ2FuY2VsLmJpbmQodGhpcyk7XG5cdH1cblxuXHRvbkZpZWxkQ2hhbmdlKG5hbWUsIGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRbbmFtZV06IGV2ZW50LnRhcmdldC52YWx1ZVxuXHRcdH0pO1xuXHR9XG5cblx0b25GaWxlU2F2ZShldmVudCkge1xuXHRcdHRoaXMucHJvcHMub25GaWxlU2F2ZSh0aGlzLnByb3BzLmZpbGUuaWQsIHRoaXMuc3RhdGUsIGV2ZW50KTtcblx0fVxuXG5cdG9uQ2FuY2VsKGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5vbkNhbmNlbChldmVudCk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdlZGl0b3InPlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvIG5vbGFiZWwnPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tcHJldmlldyBub2xhYmVsJz5cblx0XHRcdFx0XHQ8aW1nIGNsYXNzTmFtZT0ndGh1bWJuYWlsLXByZXZpZXcnIHNyYz17dGhpcy5wcm9wcy5maWxlLnVybH0gLz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1kYXRhIG5vbGFiZWwnPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgbm9sYWJlbCc+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuVFlQRScpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLnR5cGV9PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0laRScpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuc2l6ZX08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlVSTCcpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHRcdDxhIGhyZWY9e3RoaXMucHJvcHMuZmlsZS51cmx9IHRhcmdldD0nX2JsYW5rJz57dGhpcy5wcm9wcy5maWxlLnVybH08L2E+XG5cdFx0XHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5DUkVBVEVEJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5jcmVhdGVkfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5MQVNURURJVCcpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUubGFzdFVwZGF0ZWR9PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5ESU0nKX06PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy53aWR0aH0geCB7dGhpcy5wcm9wcy5maWxlLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy5oZWlnaHR9cHg8L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdHt0aGlzLmZpZWxkcy5tYXAoKGZpZWxkLCBpKSA9PiB7XG5cdFx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZmllbGQgdGV4dCcga2V5PXtpfT5cblx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0JyBodG1sRm9yPXsnZ2FsbGVyeV8nICsgZmllbGQubmFtZX0+e2ZpZWxkLmxhYmVsfTwvbGFiZWw+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgaWQ9eydnYWxsZXJ5XycgKyBmaWVsZC5uYW1lfSBjbGFzc05hbWU9XCJ0ZXh0XCIgdHlwZT0ndGV4dCcgb25DaGFuZ2U9e2ZpZWxkLm9uQ2hhbmdlfSB2YWx1ZT17dGhpcy5zdGF0ZVtmaWVsZC5uYW1lXX0gLz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHR9KX1cblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHR0eXBlPSdzdWJtaXQnXG5cdFx0XHRcdFx0Y2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWJ1dHRvbiB1aS13aWRnZXQgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsIGZvbnQtaWNvbi1jaGVjay1tYXJrXCJcblx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uRmlsZVNhdmV9PlxuXHRcdFx0XHRcdHtpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5TQVZFJyl9XG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHRcdGNsYXNzTmFtZT1cInNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tY2FuY2VsLWNpcmNsZWRcIlxuXHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25DYW5jZWx9PlxuXHRcdFx0XHRcdHtpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5DQU5DRUwnKX1cblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj47XG5cdH1cbn1cblxuRWRpdG9yQ29tcG9uZW50LnByb3BUeXBlcyA9IHtcblx0J2ZpbGUnOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHRcdCdpZCc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdFx0J3RpdGxlJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHQnYmFzZW5hbWUnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdCd1cmwnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdCdzaXplJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHQnY3JlYXRlZCc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0J2xhc3RVcGRhdGVkJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHQnZGltZW5zaW9ucyc6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0XHQnd2lkdGgnOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRcdFx0J2hlaWdodCc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcblx0XHR9KVxuXHR9KSxcblx0J29uRmlsZVNhdmUnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0J29uQ2FuY2VsJzpSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRWRpdG9yQ29tcG9uZW50O1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuXHQnVEhVTUJOQUlMX0hFSUdIVCc6IDE1MCxcblx0J1RIVU1CTkFJTF9XSURUSCc6IDIwMCxcblx0J1NQQUNFX0tFWV9DT0RFJzogMzIsXG5cdCdSRVRVUk5fS0VZX0NPREUnOiAxMyxcblx0J0JVTEtfQUNUSU9OUyc6IFtcblx0XHR7XG5cdFx0XHR2YWx1ZTogJ2RlbGV0ZScsXG5cdFx0XHRsYWJlbDogc3MuaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQlVMS19BQ1RJT05TX0RFTEVURScpLFxuXHRcdFx0ZGVzdHJ1Y3RpdmU6IHRydWVcblx0XHR9XG5cdF1cbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgYmluZEFjdGlvbkNyZWF0b3JzIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0ICogYXMgc2VsZWN0ZWRGaWxlc0FjdGlvbnMgZnJvbSAnLi4vc3RhdGUvc2VsZWN0ZWQtZmlsZXMvYWN0aW9ucydcbmltcG9ydCAqIGFzIGZpbGVzQWN0aW9ucyBmcm9tICcuLi9zdGF0ZS9maWxlcy9hY3Rpb25zJ1xuaW1wb3J0IGNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IFNpbHZlclN0cmlwZUNvbXBvbmVudCBmcm9tICdzaWx2ZXJzdHJpcGUtY29tcG9uZW50JztcblxuY2xhc3MgRmlsZUNvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdCdmb2N1c3NlZCc6IGZhbHNlLFxuXHRcdFx0J2J1dHRvblRhYkluZGV4JzogLTFcblx0XHR9O1xuXG5cdFx0dGhpcy5vbkZpbGVOYXZpZ2F0ZSA9IHRoaXMub25GaWxlTmF2aWdhdGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZUVkaXQgPSB0aGlzLm9uRmlsZUVkaXQuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZURlbGV0ZSA9IHRoaXMub25GaWxlRGVsZXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVEb3VibGVDbGljayA9IHRoaXMuaGFuZGxlRG91YmxlQ2xpY2suYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUtleURvd24gPSB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUZvY3VzID0gdGhpcy5oYW5kbGVGb2N1cy5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlQmx1ciA9IHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucHJldmVudEZvY3VzID0gdGhpcy5wcmV2ZW50Rm9jdXMuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZVNlbGVjdCA9IHRoaXMub25GaWxlU2VsZWN0LmJpbmQodGhpcyk7XG5cdH1cblx0XG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlKHRoaXMpO1xuXHR9XG5cblx0aGFuZGxlRG91YmxlQ2xpY2soZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQudGFyZ2V0ICE9PSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMudGl0bGUpICYmIGV2ZW50LnRhcmdldCAhPT0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLnRodW1ibmFpbCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLm9uRmlsZU5hdmlnYXRlKGV2ZW50KTtcblx0fVxuXG5cdG9uRmlsZU5hdmlnYXRlKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMuaXNGb2xkZXIoKSkge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkZpbGVOYXZpZ2F0ZSh0aGlzLnByb3BzLCBldmVudClcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLm9uRmlsZUVkaXQoZXZlbnQpO1xuXHR9XG5cblx0b25GaWxlU2VsZWN0KGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vc3RvcCB0cmlnZ2VyaW5nIGNsaWNrIG9uIHJvb3QgZWxlbWVudFxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZWxlY3RGaWxlKHtcblx0XHRcdGlkOiB0aGlzLnByb3BzLmlkLFxuXHRcdFx0c2VsZWN0ZWQ6ICF0aGlzLnByb3BzLnNlbGVjdGVkXG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbGVFZGl0KGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vc3RvcCB0cmlnZ2VyaW5nIGNsaWNrIG9uIHJvb3QgZWxlbWVudFxuXHRcdHRoaXMucHJvcHMub25GaWxlRWRpdCh0aGlzLnByb3BzLCBldmVudCk7XG5cdH1cblxuXHRvbkZpbGVEZWxldGUoZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgLy9zdG9wIHRyaWdnZXJpbmcgY2xpY2sgb24gcm9vdCBlbGVtZW50XG5cdFx0dGhpcy5wcm9wcy5vbkZpbGVEZWxldGUodGhpcy5wcm9wcywgZXZlbnQpXG5cdH1cblxuXHRpc0ZvbGRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy5jYXRlZ29yeSA9PT0gJ2ZvbGRlcic7XG5cdH1cblxuXHRnZXRUaHVtYm5haWxTdHlsZXMoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuY2F0ZWdvcnkgPT09ICdpbWFnZScpIHtcblx0XHRcdHJldHVybiB7J2JhY2tncm91bmRJbWFnZSc6ICd1cmwoJyArIHRoaXMucHJvcHMudXJsICsgJyknfTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHRnZXRUaHVtYm5haWxDbGFzc05hbWVzKCkge1xuXHRcdHZhciB0aHVtYm5haWxDbGFzc05hbWVzID0gJ2l0ZW1fX3RodW1ibmFpbCc7XG5cblx0XHRpZiAodGhpcy5pc0ltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpKSB7XG5cdFx0XHR0aHVtYm5haWxDbGFzc05hbWVzICs9ICcgbGFyZ2UnO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aHVtYm5haWxDbGFzc05hbWVzO1xuXHR9XG5cdFxuXHRpc1NlbGVjdGVkKCkge1xuXHRcdHJldHVybiB0aGlzLnByb3BzLnNlbGVjdGVkRmlsZXMuaW5kZXhPZih0aGlzLnByb3BzLmlkKSA+IC0xO1xuXHR9XG5cblx0Z2V0SXRlbUNsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIGl0ZW1DbGFzc05hbWVzID0gJ2l0ZW0gJyArIHRoaXMucHJvcHMuY2F0ZWdvcnk7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5mb2N1c3NlZCkge1xuXHRcdFx0aXRlbUNsYXNzTmFtZXMgKz0gJyBmb2N1c3NlZCc7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuaXNTZWxlY3RlZCgpKSB7XG5cdFx0XHRpdGVtQ2xhc3NOYW1lcyArPSAnIHNlbGVjdGVkJztcblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbUNsYXNzTmFtZXM7XG5cdH1cblxuXHRpc0ltYWdlTGFyZ2VyVGhhblRodW1ibmFpbCgpIHtcblx0XHRsZXQgZGltZW5zaW9ucyA9IHRoaXMucHJvcHMuYXR0cmlidXRlcy5kaW1lbnNpb25zO1xuXG5cdFx0cmV0dXJuIGRpbWVuc2lvbnMuaGVpZ2h0ID4gY29uc3RhbnRzLlRIVU1CTkFJTF9IRUlHSFQgfHwgZGltZW5zaW9ucy53aWR0aCA+IGNvbnN0YW50cy5USFVNQk5BSUxfV0lEVEg7XG5cdH1cblxuXHRoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHQvL2lmIGV2ZW50IGRvZXNuJ3QgY29tZSBmcm9tIHRoZSByb290IGVsZW1lbnQsIGRvIG5vdGhpbmdcblx0XHRpZiAoZXZlbnQudGFyZ2V0ICE9PSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMudGh1bWJuYWlsKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHQvL0lmIHNwYWNlIGlzIHByZXNzZWQsIGFsbG93IGZvY3VzIG9uIGJ1dHRvbnNcblx0XHRpZiAodGhpcy5wcm9wcy5zcGFjZUtleSA9PT0gZXZlbnQua2V5Q29kZSkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy9TdG9wIHBhZ2UgZnJvbSBzY3JvbGxpbmdcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHQnYnV0dG9uVGFiSW5kZXgnOiAwXG5cdFx0XHR9KTtcblx0XHRcdCQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5pdGVtX19hY3Rpb25zX19hY3Rpb24nKS5maXJzdCgpLmZvY3VzKCk7XG5cdFx0fVxuXG5cdFx0Ly9JZiByZXR1cm4gaXMgcHJlc3NlZCwgbmF2aWdhdGUgZm9sZGVyXG5cdFx0aWYgKHRoaXMucHJvcHMucmV0dXJuS2V5ID09PSBldmVudC5rZXlDb2RlKSB7XG5cdFx0XHR0aGlzLm9uRmlsZU5hdmlnYXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlRm9jdXMoKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHQnZm9jdXNzZWQnOiB0cnVlLFxuXHRcdFx0J2J1dHRvblRhYkluZGV4JzogMFxuXHRcdH0pO1xuXHR9XG5cblx0aGFuZGxlQmx1cigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdCdmb2N1c3NlZCc6IGZhbHNlLFxuXHRcdFx0J2J1dHRvblRhYkluZGV4JzogLTFcblx0XHR9KTtcblx0fVxuXHRcblx0cHJldmVudEZvY3VzKGV2ZW50KSB7XG5cdFx0Ly9UbyBhdm9pZCBicm93c2VyJ3MgZGVmYXVsdCBmb2N1cyBzdGF0ZSB3aGVuIHNlbGVjdGluZyBhbiBpdGVtXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9e3RoaXMuZ2V0SXRlbUNsYXNzTmFtZXMoKX0gZGF0YS1pZD17dGhpcy5wcm9wcy5pZH0gb25Eb3VibGVDbGljaz17dGhpcy5oYW5kbGVEb3VibGVDbGlja30+XG5cdFx0XHQ8ZGl2IHJlZj1cInRodW1ibmFpbFwiIGNsYXNzTmFtZT17dGhpcy5nZXRUaHVtYm5haWxDbGFzc05hbWVzKCl9IHRhYkluZGV4PVwiMFwiIG9uS2V5RG93bj17dGhpcy5oYW5kbGVLZXlEb3dufSBzdHlsZT17dGhpcy5nZXRUaHVtYm5haWxTdHlsZXMoKX0gb25DbGljaz17dGhpcy5vbkZpbGVTZWxlY3R9IG9uTW91c2VEb3duPXt0aGlzLnByZXZlbnRGb2N1c30+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zJz5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXNlbGVjdCBbIGZvbnQtaWNvbi10aWNrIF0nXG5cdFx0XHRcdFx0XHR0eXBlPSdidXR0b24nXG5cdFx0XHRcdFx0XHR0aXRsZT17aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0VMRUNUJyl9XG5cdFx0XHRcdFx0XHR0YWJJbmRleD17dGhpcy5zdGF0ZS5idXR0b25UYWJJbmRleH1cblx0XHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25GaWxlU2VsZWN0fVxuXHRcdFx0XHRcdFx0b25Gb2N1cz17dGhpcy5oYW5kbGVGb2N1c31cblx0XHRcdFx0XHRcdG9uQmx1cj17dGhpcy5oYW5kbGVCbHVyfT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXJlbW92ZSBbIGZvbnQtaWNvbi10cmFzaCBdJ1xuXHRcdFx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHRcdFx0dGl0bGU9e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRFTEVURScpfVxuXHRcdFx0XHRcdFx0dGFiSW5kZXg9e3RoaXMuc3RhdGUuYnV0dG9uVGFiSW5kZXh9XG5cdFx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uRmlsZURlbGV0ZX1cblx0XHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlRm9jdXN9XG5cdFx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn0+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1lZGl0IFsgZm9udC1pY29uLWVkaXQgXSdcblx0XHRcdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0XHRcdHRpdGxlPXtpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5FRElUJyl9XG5cdFx0XHRcdFx0XHR0YWJJbmRleD17dGhpcy5zdGF0ZS5idXR0b25UYWJJbmRleH1cblx0XHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25GaWxlRWRpdH1cblx0XHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlRm9jdXN9XG5cdFx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn0+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8cCBjbGFzc05hbWU9J2l0ZW1fX3RpdGxlJyByZWY9XCJ0aXRsZVwiPnt0aGlzLnByb3BzLnRpdGxlfTwvcD5cblx0XHQ8L2Rpdj47XG5cdH1cbn1cblxuRmlsZUNvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG5cdCdpZCc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdCd0aXRsZSc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCdjYXRlZ29yeSc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCd1cmwnOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHQnZGltZW5zaW9ucyc6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0J3dpZHRoJzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0XHQnaGVpZ2h0JzogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxuXHR9KSxcblx0J29uRmlsZU5hdmlnYXRlJzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCdvbkZpbGVFZGl0JzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCdvbkZpbGVEZWxldGUnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0J3NwYWNlS2V5JzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0J3JldHVybktleSc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdCdvbkZpbGVTZWxlY3QnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0J3NlbGVjdGVkJzogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbn07XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuXHRyZXR1cm4ge1xuXHRcdHNlbGVjdGVkRmlsZXM6IHN0YXRlLnNlbGVjdGVkRmlsZXMuc2VsZWN0ZWRGaWxlc1xuXHR9XG59XG5cbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuXHRyZXR1cm4ge1xuXHRcdGFjdGlvbnM6IGJpbmRBY3Rpb25DcmVhdG9ycyhPYmplY3QuYXNzaWduKGZpbGVzQWN0aW9ucywgc2VsZWN0ZWRGaWxlc0FjdGlvbnMpLCBkaXNwYXRjaClcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShGaWxlQ29tcG9uZW50KTtcbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgaTE4biBmcm9tICdpMThuJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBiaW5kQWN0aW9uQ3JlYXRvcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgUmVhY3RUZXN0VXRpbHMgZnJvbSAncmVhY3QtYWRkb25zLXRlc3QtdXRpbHMnO1xuaW1wb3J0IEZpbGVDb21wb25lbnQgZnJvbSAnLi9maWxlLWNvbnRhaW5lcic7XG5pbXBvcnQgRWRpdG9yQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudHMvZWRpdG9yLWNvbXBvbmVudCc7XG5pbXBvcnQgQnVsa0FjdGlvbnNDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50cy9idWxrLWFjdGlvbnMtY29tcG9uZW50JztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmZ1bmN0aW9uIGdldENvbXBhcmF0b3IoZmllbGQsIGRpcmVjdGlvbikge1xuXHRyZXR1cm4gKGEsIGIpID0+IHtcblx0XHRpZiAoZGlyZWN0aW9uID09PSAnYXNjJykge1xuXHRcdFx0aWYgKGFbZmllbGRdIDwgYltmaWVsZF0pIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYVtmaWVsZF0gPiBiW2ZpZWxkXSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGFbZmllbGRdID4gYltmaWVsZF0pIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYVtmaWVsZF0gPCBiW2ZpZWxkXSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gMDtcblx0fTtcbn1cblxuZnVuY3Rpb24gZ2V0U29ydChmaWVsZCwgZGlyZWN0aW9uKSB7XG5cdGxldCBjb21wYXJhdG9yID0gZ2V0Q29tcGFyYXRvcihmaWVsZCwgZGlyZWN0aW9uKTtcblxuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdGxldCBmb2xkZXJzID0gdGhpcy5zdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgPT09ICdmb2xkZXInKTtcblx0XHRsZXQgZmlsZXMgPSB0aGlzLnN0YXRlLmZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUudHlwZSAhPT0gJ2ZvbGRlcicpO1xuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHQnZmlsZXMnOiBmb2xkZXJzLnNvcnQoY29tcGFyYXRvcikuY29uY2F0KGZpbGVzLnNvcnQoY29tcGFyYXRvcikpXG5cdFx0fSk7XG5cdH1cbn1cblxuY2xhc3MgR2FsbGVyeUNvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdCdjb3VudCc6IDAsIC8vIFRoZSBudW1iZXIgb2YgZmlsZXMgaW4gdGhlIGN1cnJlbnQgdmlld1xuXHRcdFx0J2ZpbGVzJzogW10sXG5cdFx0XHQnc2VsZWN0ZWRGaWxlcyc6IFtdLFxuXHRcdFx0J2VkaXRpbmcnOiBudWxsXG5cdFx0fTtcblxuXHRcdHRoaXMuZm9sZGVycyA9IFtwcm9wcy5pbml0aWFsX2ZvbGRlcl07XG5cblx0XHR0aGlzLnNvcnQgPSAnbmFtZSc7XG5cdFx0dGhpcy5kaXJlY3Rpb24gPSAnYXNjJztcblxuXHRcdHRoaXMuc29ydGVycyA9IFtcblx0XHRcdHtcblx0XHRcdFx0J2ZpZWxkJzogJ3RpdGxlJyxcblx0XHRcdFx0J2RpcmVjdGlvbic6ICdhc2MnLFxuXHRcdFx0XHQnbGFiZWwnOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfVElUTEVfQVNDJyksXG5cdFx0XHRcdCdvblNvcnQnOiBnZXRTb3J0LmNhbGwodGhpcywgJ3RpdGxlJywgJ2FzYycpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQnZmllbGQnOiAndGl0bGUnLFxuXHRcdFx0XHQnZGlyZWN0aW9uJzogJ2Rlc2MnLFxuXHRcdFx0XHQnbGFiZWwnOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfVElUTEVfREVTQycpLFxuXHRcdFx0XHQnb25Tb3J0JzogZ2V0U29ydC5jYWxsKHRoaXMsICd0aXRsZScsICdkZXNjJylcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCdmaWVsZCc6ICdjcmVhdGVkJyxcblx0XHRcdFx0J2RpcmVjdGlvbic6ICdkZXNjJyxcblx0XHRcdFx0J2xhYmVsJzogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRklMVEVSX0RBVEVfREVTQycpLFxuXHRcdFx0XHQnb25Tb3J0JzogZ2V0U29ydC5jYWxsKHRoaXMsICdjcmVhdGVkJywgJ2Rlc2MnKVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J2ZpZWxkJzogJ2NyZWF0ZWQnLFxuXHRcdFx0XHQnZGlyZWN0aW9uJzogJ2FzYycsXG5cdFx0XHRcdCdsYWJlbCc6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkZJTFRFUl9EQVRFX0FTQycpLFxuXHRcdFx0XHQnb25Tb3J0JzogZ2V0U29ydC5jYWxsKHRoaXMsICdjcmVhdGVkJywgJ2FzYycpXG5cdFx0XHR9XG5cdFx0XTtcblxuXHRcdHRoaXMubGlzdGVuZXJzID0ge1xuXHRcdFx0J29uU2VhcmNoRGF0YSc6IChkYXRhKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdCdjb3VudCc6IGRhdGEuY291bnQsXG5cdFx0XHRcdFx0J2ZpbGVzJzogZGF0YS5maWxlc1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHQnb25Nb3JlRGF0YSc6IChkYXRhKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdCdjb3VudCc6IGRhdGEuY291bnQsXG5cdFx0XHRcdFx0J2ZpbGVzJzogdGhpcy5zdGF0ZS5maWxlcy5jb25jYXQoZGF0YS5maWxlcylcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0J29uTmF2aWdhdGVEYXRhJzogKGRhdGEpID0+IHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2NvdW50JzogZGF0YS5jb3VudCxcblx0XHRcdFx0XHQnZmlsZXMnOiBkYXRhLmZpbGVzXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdCdvbkRlbGV0ZURhdGEnOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHQnY291bnQnOiB0aGlzLnN0YXRlLmNvdW50IC0gMSxcblx0XHRcdFx0XHQnZmlsZXMnOiB0aGlzLnN0YXRlLmZpbGVzLmZpbHRlcigoZmlsZSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGEgIT09IGZpbGUuaWQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0J29uU2F2ZURhdGEnOiAoaWQsIHZhbHVlcykgPT4ge1xuXHRcdFx0XHRsZXQgZmlsZXMgPSB0aGlzLnN0YXRlLmZpbGVzO1xuXG5cdFx0XHRcdGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcblx0XHRcdFx0XHRpZiAoZmlsZS5pZCA9PSBpZCkge1xuXHRcdFx0XHRcdFx0ZmlsZS50aXRsZSA9IHZhbHVlcy50aXRsZTtcblx0XHRcdFx0XHRcdGZpbGUuYmFzZW5hbWUgPSB2YWx1ZXMuYmFzZW5hbWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHQnZmlsZXMnOiBmaWxlcyxcblx0XHRcdFx0XHQnZWRpdGluZyc6IG51bGxcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0J29uRmV0Y2hEYXRhJzogKGRhdGEpID0+IHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0J2NvdW50JzogZGF0YS5jb3VudCxcblx0XHRcdFx0XHQnZmlsZXMnOiBkYXRhLmZpbGVzXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR0aGlzLm9uRmlsZVNhdmUgPSB0aGlzLm9uRmlsZVNhdmUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZU5hdmlnYXRlID0gdGhpcy5vbkZpbGVOYXZpZ2F0ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25GaWxlRWRpdCA9IHRoaXMub25GaWxlRWRpdC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25GaWxlRGVsZXRlID0gdGhpcy5vbkZpbGVEZWxldGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uQmFja0NsaWNrID0gdGhpcy5vbkJhY2tDbGljay5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25Nb3JlQ2xpY2sgPSB0aGlzLm9uTW9yZUNsaWNrLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbk5hdmlnYXRlID0gdGhpcy5vbk5hdmlnYXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbkNhbmNlbCA9IHRoaXMub25DYW5jZWwuYmluZCh0aGlzKTtcblx0XHR0aGlzLmdldFNlbGVjdGVkRmlsZXMgPSB0aGlzLmdldFNlbGVjdGVkRmlsZXMuYmluZCh0aGlzKTtcblx0fVxuXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHN1cGVyLmNvbXBvbmVudERpZE1vdW50KCk7XG5cblx0XHRmb3IgKGxldCBldmVudCBpbiB0aGlzLmxpc3RlbmVycykge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm9uKGV2ZW50LCB0aGlzLmxpc3RlbmVyc1tldmVudF0pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BzLmluaXRpYWxfZm9sZGVyICE9PSB0aGlzLnByb3BzLmN1cnJlbnRfZm9sZGVyKSB7XG5cdFx0XHR0aGlzLm9uTmF2aWdhdGUodGhpcy5wcm9wcy5jdXJyZW50X2ZvbGRlcik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5zZWFyY2goKTtcblx0XHR9XG5cdH1cblxuXHRjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcblx0XHRzdXBlci5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXG5cdFx0Zm9yIChsZXQgZXZlbnQgaW4gdGhpcy5saXN0ZW5lcnMpIHtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcihldmVudCwgdGhpcy5saXN0ZW5lcnNbZXZlbnRdKTtcblx0XHR9XG5cdH1cblxuXHRjb21wb25lbnREaWRVcGRhdGUoKSB7XG5cdFx0dmFyICRzZWxlY3QgPSAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKCcuZ2FsbGVyeV9fc29ydCAuZHJvcGRvd24nKTtcblxuXHRcdC8vIFdlIG9wdC1vdXQgb2YgbGV0dGluZyB0aGUgQ01TIGhhbmRsZSBDaG9zZW4gYmVjYXVzZSBpdCBkb2Vzbid0IHJlLWFwcGx5IHRoZSBiZWhhdmlvdXIgY29ycmVjdGx5LlxuXHRcdC8vIFNvIGFmdGVyIHRoZSBnYWxsZXJ5IGhhcyBiZWVuIHJlbmRlcmVkIHdlIGFwcGx5IENob3Nlbi5cblx0XHQkc2VsZWN0LmNob3Nlbih7XG5cdFx0XHQnYWxsb3dfc2luZ2xlX2Rlc2VsZWN0JzogdHJ1ZSxcblx0XHRcdCdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnOiAyMFxuXHRcdH0pO1xuXG5cdFx0Ly8gQ2hvc2VuIHN0b3BzIHRoZSBjaGFuZ2UgZXZlbnQgZnJvbSByZWFjaGluZyBSZWFjdCBzbyB3ZSBoYXZlIHRvIHNpbXVsYXRlIGEgY2xpY2suXG5cdFx0JHNlbGVjdC5jaGFuZ2UoKCkgPT4gUmVhY3RUZXN0VXRpbHMuU2ltdWxhdGUuY2xpY2soJHNlbGVjdC5maW5kKCc6c2VsZWN0ZWQnKVswXSkpO1xuXHR9XG5cblx0Z2V0RmlsZUJ5SWQoaWQpIHtcblx0XHR2YXIgZm9sZGVyID0gbnVsbDtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5maWxlcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0aWYgKHRoaXMuc3RhdGUuZmlsZXNbaV0uaWQgPT09IGlkKSB7XG5cdFx0XHRcdGZvbGRlciA9IHRoaXMuc3RhdGUuZmlsZXNbaV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmb2xkZXI7XG5cdH1cblx0XG5cdGdldE5vSXRlbXNOb3RpY2UoKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuY291bnQgPCAxKSB7XG5cdFx0XHRyZXR1cm4gPHAgY2xhc3NOYW1lPVwibm8taXRlbS1ub3RpY2VcIj57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuTk9JVEVNU0ZPVU5EJyl9PC9wPjtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRCYWNrQnV0dG9uKCkge1xuXHRcdGlmICh0aGlzLmZvbGRlcnMubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuIDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPSdnYWxsZXJ5X19iYWNrIHNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tbGV2ZWwtdXAgbm8tdGV4dCdcblx0XHRcdFx0b25DbGljaz17dGhpcy5vbkJhY2tDbGlja31cblx0XHRcdFx0cmVmPVwiYmFja0J1dHRvblwiPjwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGdldEJ1bGtBY3Rpb25zQ29tcG9uZW50KCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCAmJiB0aGlzLnByb3BzLmJhY2tlbmQuYnVsa0FjdGlvbnMpIHtcblx0XHRcdHJldHVybiA8QnVsa0FjdGlvbnNDb21wb25lbnRcblx0XHRcdFx0b3B0aW9ucz17Q09OU1RBTlRTLkJVTEtfQUNUSU9OU31cblx0XHRcdFx0cGxhY2Vob2xkZXI9e3NzLmkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkJVTEtfQUNUSU9OU19QTEFDRUhPTERFUicpfVxuXHRcdFx0XHRiYWNrZW5kPXt0aGlzLnByb3BzLmJhY2tlbmR9XG5cdFx0XHRcdGdldFNlbGVjdGVkRmlsZXM9e3RoaXMuZ2V0U2VsZWN0ZWRGaWxlc30gLz47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRNb3JlQnV0dG9uKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLmNvdW50ID4gdGhpcy5zdGF0ZS5maWxlcy5sZW5ndGgpIHtcblx0XHRcdHJldHVybiA8YnV0dG9uXG5cdFx0XHRcdGNsYXNzTmFtZT1cImdhbGxlcnlfX2xvYWRfX21vcmVcIlxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uTW9yZUNsaWNrfT57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuTE9BRE1PUkUnKX08L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRTZWxlY3RlZEZpbGVzKCkge1xuXHRcdHJldHVybiB0aGlzLnN0YXRlLnNlbGVjdGVkRmlsZXM7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZWRpdGluZyAhPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5Jz5cblx0XHRcdFx0PEVkaXRvckNvbXBvbmVudFxuXHRcdFx0XHRcdGZpbGU9e3RoaXMuc3RhdGUuZWRpdGluZ31cblx0XHRcdFx0XHRvbkZpbGVTYXZlPXt0aGlzLm9uRmlsZVNhdmV9XG5cdFx0XHRcdFx0b25DYW5jZWw9e3RoaXMub25DYW5jZWx9IC8+XG5cdFx0XHQ8L2Rpdj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5Jz5cblx0XHRcdHt0aGlzLmdldEJhY2tCdXR0b24oKX1cblx0XHRcdHt0aGlzLmdldEJ1bGtBY3Rpb25zQ29tcG9uZW50KCl9XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX3NvcnQgZmllbGRob2xkZXItc21hbGxcIj5cblx0XHRcdFx0PHNlbGVjdCBjbGFzc05hbWU9XCJkcm9wZG93biBuby1jaGFuZ2UtdHJhY2sgbm8tY2h6blwiIHRhYkluZGV4PVwiMFwiIHN0eWxlPXt7d2lkdGg6ICcxNjBweCd9fT5cblx0XHRcdFx0XHR7dGhpcy5zb3J0ZXJzLm1hcCgoc29ydGVyLCBpKSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gPG9wdGlvbiBrZXk9e2l9IG9uQ2xpY2s9e3NvcnRlci5vblNvcnR9Pntzb3J0ZXIubGFiZWx9PC9vcHRpb24+O1xuXHRcdFx0XHRcdH0pfVxuXHRcdFx0XHQ8L3NlbGVjdD5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2l0ZW1zJz5cblx0XHRcdFx0e3RoaXMuc3RhdGUuZmlsZXMubWFwKChmaWxlLCBpKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIDxGaWxlQ29tcG9uZW50IGtleT17aX0gey4uLmZpbGV9XG5cdFx0XHRcdFx0XHRzcGFjZUtleT17Q09OU1RBTlRTLlNQQUNFX0tFWV9DT0RFfVxuXHRcdFx0XHRcdFx0cmV0dXJuS2V5PXtDT05TVEFOVFMuUkVUVVJOX0tFWV9DT0RFfVxuXHRcdFx0XHRcdFx0b25GaWxlRGVsZXRlPXt0aGlzLm9uRmlsZURlbGV0ZX1cblx0XHRcdFx0XHRcdG9uRmlsZUVkaXQ9e3RoaXMub25GaWxlRWRpdH1cblx0XHRcdFx0XHRcdG9uRmlsZU5hdmlnYXRlPXt0aGlzLm9uRmlsZU5hdmlnYXRlfVxuXHRcdFx0XHRcdFx0c2VsZWN0ZWQ9e3RoaXMuc3RhdGUuc2VsZWN0ZWRGaWxlcy5pbmRleE9mKGZpbGUuaWQpID4gLTF9IC8+O1xuXHRcdFx0XHR9KX1cblx0XHRcdDwvZGl2PlxuXHRcdFx0e3RoaXMuZ2V0Tm9JdGVtc05vdGljZSgpfVxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5X19sb2FkXCI+XG5cdFx0XHRcdHt0aGlzLmdldE1vcmVCdXR0b24oKX1cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2Pjtcblx0fVxuXG5cdG9uQ2FuY2VsKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0J2VkaXRpbmcnOiBudWxsXG5cdFx0fSk7XG5cblx0XHR0aGlzLmVtaXRFeGl0RmlsZVZpZXdDbXNFdmVudCgpO1xuXHR9XG5cblx0b25GaWxlRGVsZXRlKGZpbGUsIGV2ZW50KSB7XG5cdFx0aWYgKGNvbmZpcm0oaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQ09ORklSTURFTEVURScpKSkge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLmRlbGV0ZShmaWxlLmlkKTtcblx0XHRcdHRoaXMuZW1pdEZpbGVEZWxldGVkQ21zRXZlbnQoKTtcblx0XHR9XG5cblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fVxuXG5cdG9uRmlsZUVkaXQoZmlsZSwgZXZlbnQpIHtcblx0XHQvLyBBbGxvdyBjb21wb25lbnQgdXNlcnMgdG8gaW5qZWN0IGJlaGF2aW91ci5cblx0XHQvLyBUZW1wb3Jhcnkgc29sdXRpb24gdW50aWwgdGhlIENNUyBpcyBmdWxseSBSZWFjdCBiYXNlZCxcblx0XHQvLyBhdCB3aGljaCBwb2ludCB3ZSBjYW4gd29yayB3aXRoIEVTNiBzdWJjbGFzc2VzLlxuXHRcdHZhciBjYiA9IHRoaXMucHJvcHMuX29uRmlsZUVkaXRDYWxsYmFjaztcblx0XHRpZighY2IgfHwgY2IoZmlsZSwgZXZlbnQpICE9PSBmYWxzZSkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdCdlZGl0aW5nJzogZmlsZVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5lbWl0RW50ZXJGaWxlVmlld0Ntc0V2ZW50KGZpbGUpO1xuXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH1cblxuXHRvbkZpbGVOYXZpZ2F0ZShmaWxlKSB7XG5cdFx0dGhpcy5mb2xkZXJzLnB1c2goZmlsZS5maWxlbmFtZSk7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm5hdmlnYXRlKGZpbGUuZmlsZW5hbWUpO1xuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHQnc2VsZWN0ZWRGaWxlcyc6IFtdXG5cdFx0fSk7XG5cblx0XHR0aGlzLmVtaXRGb2xkZXJDaGFuZ2VkQ21zRXZlbnQoKTtcblx0XHQvLyB0aGlzLnNhdmVGb2xkZXJOYW1lSW5TZXNzaW9uKCk7XG5cdH1cblxuXHRlbWl0Rm9sZGVyQ2hhbmdlZENtc0V2ZW50KCkge1xuXHRcdHZhciBmb2xkZXIgPSB7XG5cdFx0XHRwYXJlbnRJZDogMCxcblx0XHRcdGlkOiAwXG5cdFx0fTtcblxuXHRcdC8vIFRoZSBjdXJyZW50IGZvbGRlciBpcyBzdG9yZWQgYnkgaXQncyBuYW1lIGluIG91ciBjb21wb25lbnQuXG5cdFx0Ly8gV2UgbmVlZCB0byBnZXQgaXQncyBpZCBiZWNhdXNlIHRoYXQncyBob3cgRW50d2luZSBjb21wb25lbnRzIChHcmlkRmllbGQpIHJlZmVyZW5jZSBpdC5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGUuZmlsZXMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGlmICh0aGlzLnN0YXRlLmZpbGVzW2ldLmZpbGVuYW1lID09PSB0aGlzLnByb3BzLmJhY2tlbmQuZm9sZGVyKSB7XG5cdFx0XHRcdGZvbGRlci5wYXJlbnRJZCA9IHRoaXMuc3RhdGUuZmlsZXNbaV0ucGFyZW50LmlkO1xuXHRcdFx0XHRmb2xkZXIuaWQgPSB0aGlzLnN0YXRlLmZpbGVzW2ldLmlkO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9lbWl0Q21zRXZlbnQoJ2ZvbGRlci1jaGFuZ2VkLmFzc2V0LWdhbGxlcnktZmllbGQnLCBmb2xkZXIpO1xuXHR9XG5cblx0ZW1pdEZpbGVEZWxldGVkQ21zRXZlbnQoKSB7XG5cdFx0dGhpcy5fZW1pdENtc0V2ZW50KCdmaWxlLWRlbGV0ZWQuYXNzZXQtZ2FsbGVyeS1maWVsZCcpO1xuXHR9XG5cblx0ZW1pdEVudGVyRmlsZVZpZXdDbXNFdmVudChmaWxlKSB7XG5cdFx0dmFyIGlkID0gMDtcblxuXHRcdHRoaXMuX2VtaXRDbXNFdmVudCgnZW50ZXItZmlsZS12aWV3LmFzc2V0LWdhbGxlcnktZmllbGQnLCBmaWxlLmlkKTtcblx0fVxuXG5cdGVtaXRFeGl0RmlsZVZpZXdDbXNFdmVudCgpIHtcblx0XHR0aGlzLl9lbWl0Q21zRXZlbnQoJ2V4aXQtZmlsZS12aWV3LmFzc2V0LWdhbGxlcnktZmllbGQnKTtcblx0fVxuXG5cdC8vIHNhdmVGb2xkZXJOYW1lSW5TZXNzaW9uKCkge1xuXHQvLyBcdGlmICh0aGlzLnByb3BzLmhhc1Nlc3Npb25TdG9yYWdlKCkpIHtcblx0Ly8gXHRcdHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmNsb3Nlc3QoJy5hc3NldC1nYWxsZXJ5JylbMF0uaWQsIHRoaXMucHJvcHMuYmFja2VuZC5mb2xkZXIpO1xuXHQvLyBcdH1cblx0Ly8gfVxuXG5cdG9uTmF2aWdhdGUoZm9sZGVyLCBzaWxlbnQgPSBmYWxzZSkge1xuXHRcdC8vIERvbid0IHRoZSBmb2xkZXIgaWYgaXQgZXhpc3RzIGFscmVhZHkuXG5cdFx0aWYgKHRoaXMuZm9sZGVycy5pbmRleE9mKGZvbGRlcikgPT09IC0xKSB7XG5cdFx0XHR0aGlzLmZvbGRlcnMucHVzaChmb2xkZXIpO1xuXHRcdH1cblxuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5uYXZpZ2F0ZShmb2xkZXIpO1xuXG5cdFx0aWYgKCFzaWxlbnQpIHtcblx0XHRcdHRoaXMuZW1pdEZvbGRlckNoYW5nZWRDbXNFdmVudCgpO1xuXHRcdH1cblxuXHRcdC8vIHRoaXMuc2F2ZUZvbGRlck5hbWVJblNlc3Npb24oKTtcblx0fVxuXG5cdG9uTW9yZUNsaWNrKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHR0aGlzLnByb3BzLmJhY2tlbmQubW9yZSgpO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fVxuXG5cdG9uQmFja0NsaWNrKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMuZm9sZGVycy5sZW5ndGggPiAxKSB7XG5cdFx0XHR0aGlzLmZvbGRlcnMucG9wKCk7XG5cdFx0XHR0aGlzLnByb3BzLmJhY2tlbmQubmF2aWdhdGUodGhpcy5mb2xkZXJzW3RoaXMuZm9sZGVycy5sZW5ndGggLSAxXSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHQnc2VsZWN0ZWRGaWxlcyc6IFtdXG5cdFx0fSk7XG5cblx0XHR0aGlzLmVtaXRGb2xkZXJDaGFuZ2VkQ21zRXZlbnQoKTtcblx0XHQvLyB0aGlzLnNhdmVGb2xkZXJOYW1lSW5TZXNzaW9uKCk7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0b25GaWxlU2F2ZShpZCwgc3RhdGUsIGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLnNhdmUoaWQsIHN0YXRlKTtcblxuXHRcdHRoaXMuZW1pdEV4aXRGaWxlVmlld0Ntc0V2ZW50KCk7XG5cblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG59XG5cbkdhbGxlcnlDb21wb25lbnQucHJvcFR5cGVzID0ge1xuXHQvLyAnaGFzU2Vzc2lvblN0b3JhZ2UnOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHQnYmFja2VuZCc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdHJldHVybiB7fVxufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0cmV0dXJuIHtcblx0XHRhY3Rpb25zOiBiaW5kQWN0aW9uQ3JlYXRvcnMoZGlzcGF0Y2gpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoR2FsbGVyeUNvbXBvbmVudCk7XG4iLCJleHBvcnQgY29uc3QgQ09ORklHID0ge307XG5cbmV4cG9ydCBjb25zdCBGSUxFUyA9IHtcblx0QUREX0ZJTEU6ICdGSUxFUy5BRERfRklMRSdcbn1cblxuZXhwb3J0IGNvbnN0IFNFTEVDVEVEX0ZJTEVTID0ge1xuXHRTRUxFQ1RfRklMRTogJ1NFTEVDVEVEX0ZJTEVTLlNFTEVDVF9GSUxFJ1xufTtcbiIsIi8qKlxuICogQGZpbGUgRmFjdG9yeSBmb3IgY3JlYXRpbmcgYSBSZWR1eCBzdG9yZS5cbiAqL1xuXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0IHRodW5rTWlkZGxld2FyZSBmcm9tICdyZWR1eC10aHVuayc7IC8vIFVzZWQgZm9yIGhhbmRsaW5nIGFzeW5jIHN0b3JlIHVwZGF0ZXMuXG5pbXBvcnQgY3JlYXRlTG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcic7IC8vIExvZ3Mgc3RhdGUgY2hhbmdlcyB0byB0aGUgY29uc29sZS4gVXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG5pbXBvcnQgcm9vdFJlZHVjZXIgZnJvbSAnLi9yZWR1Y2VyJztcblxuLyoqXG4gKiBAZnVuYyBjcmVhdGVTdG9yZVdpdGhNaWRkbGV3YXJlXG4gKiBAcGFyYW0gZnVuY3Rpb24gcm9vdFJlZHVjZXJcbiAqIEBwYXJhbSBvYmplY3QgaW5pdGlhbFN0YXRlXG4gKiBAZGVzYyBDcmVhdGVzIGEgUmVkdXggc3RvcmUgd2l0aCBzb21lIG1pZGRsZXdhcmUgYXBwbGllZC5cbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGNyZWF0ZVN0b3JlV2l0aE1pZGRsZXdhcmUgPSBhcHBseU1pZGRsZXdhcmUoXG5cdHRodW5rTWlkZGxld2FyZSxcblx0Y3JlYXRlTG9nZ2VyKClcbikoY3JlYXRlU3RvcmUpO1xuXG4vKipcbiAqIEBmdW5jIGNvbmZpZ3VyZVN0b3JlXG4gKiBAcGFyYW0gb2JqZWN0IGluaXRpYWxTdGF0ZVxuICogQHJldHVybiBvYmplY3QgLSBBIFJlZHV4IHN0b3JlIHRoYXQgbGV0cyB5b3UgcmVhZCB0aGUgc3RhdGUsIGRpc3BhdGNoIGFjdGlvbnMgYW5kIHN1YnNjcmliZSB0byBjaGFuZ2VzLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25maWd1cmVTdG9yZShpbml0aWFsU3RhdGUgPSB7fSkge1xuXHRjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlV2l0aE1pZGRsZXdhcmUocm9vdFJlZHVjZXIsIGluaXRpYWxTdGF0ZSk7XG5cblx0cmV0dXJuIHN0b3JlO1xufTsiLCIvKipcbiAqIEBmaWxlIEFjdGlvbnMgZm9yIG1ha2luZyB1cGRhdGVzIHRvIHRoZSBzZWxlY3RlZEl0ZW1zIHNlY3Rpb24gb2YgdGhlIHN0b3JlJ3Mgc3RhdGUuXG4gKi9cblxuaW1wb3J0IHsgRklMRVMgfSBmcm9tICcuLi9hY3Rpb24tdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkRmlsZShmaWxlKSB7XG5cdHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG5cdFx0cmV0dXJuIGRpc3BhdGNoICh7XG5cdFx0XHR0eXBlOiBGSUxFUy5BRERfRklMRSxcblx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0aWQ6IGZpbGUucHJvcHMuaWRcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuIiwiLyoqXG4gKiBAZmlsZSBSZWR1Y2VycyBmb3IgYXBwbGljYXRpb24ncyBzZWxlY3RlZCBpdGVtcy5cbiAqL1xuXG5pbXBvcnQgeyBGSUxFUyB9IGZyb20gJy4uL2FjdGlvbi10eXBlcyc7XG5cbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcblx0ZmlsZXM6IG5ldyBBcnJheSgpXG59O1xuXG4vKipcbiAqIEBmdW5jIHNlbGVjdGVkRmlsZXNSZWR1Y2VyXG4gKiBAcGFyYW0gb2JqZWN0IGluaXRpYWxTdGF0ZVxuICogQHBhcmFtIG9iamVjdCBhY3Rpb24gLSBUaGUgZGlzcGF0Y2hlZCBhY3Rpb24uXG4gKiBAcGFyYW0gc3RyaW5nIGFjdGlvbi50eXBlIC0gTmFtZSBvZiB0aGUgZGlzcGF0Y2hlZCBhY3Rpb24uXG4gKiBAcGFyYW0gb2JqZWN0IFthY3Rpb24ucGF5bG9hZF0gLSBPcHRpb25hbCBkYXRhIHBhc3NlZCB3aXRoIHRoZSBhY3Rpb24uXG4gKiBAZGVzYyBSZWR1Y2VyIGZvciB0aGUgYHNlbGVjdGVkSXRlbXNgIHNlY3Rpb24gb2Ygc3RhdGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNlbGVjdGVkRmlsZXNSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXHRcdGNhc2UgRklMRVMuQUREX0ZJTEU6XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcblx0XHRcdFx0ZmlsZXM6IHN0YXRlLmZpbGVzLmNvbmNhdChhY3Rpb24uZmlsZSlcblx0XHRcdH0pO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gc3RhdGU7XG5cdH1cbn1cbiIsIi8qKlxuICogQGZpbGUgVGhlIHJlZHVjZXIgd2hpY2ggb3BlcmF0ZXMgb24gdGhlIFJlZHV4IHN0b3JlLlxuICovXG5cbmltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBzZWxlY3RlZEZpbGVzUmVkdWNlciBmcm9tICcuL3NlbGVjdGVkLWZpbGVzL3JlZHVjZXIuanMnO1xuaW1wb3J0IGZpbGVzUmVkdWNlciBmcm9tICcuL2ZpbGVzL3JlZHVjZXIuanMnO1xuXG4vKipcbiAqIEBmdW5jIHJvb3RSZWR1Y2VyXG4gKiBAcGFyYW0gb2JqZWN0IHN0YXRlIC0gVGhlIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gb2JqZWN0IGFjdGlvbiAtIFRoZSBkaXNwYXRjaGVkIGFjdGlvbi5cbiAqIEBwYXJhbSBzdHJpbmcgYWN0aW9uLnR5cGUgLSBUaGUgdHlwZSBvZiBhY3Rpb24gdGhhdCBoYXMgYmVlbiBkaXNwYXRjaGVkLlxuICogQHBhcmFtIG9iamVjdCBbYWN0aW9uLnBheWxvYWRdIC0gT3B0aW9uYWwgZGF0YSBwYXNzZWQgd2l0aCB0aGUgYWN0aW9uLlxuICogQGRlc2MgT3BlcmF0ZXMgb24gdGhlIFJlZHV4IHN0b3JlIHRvIHVwZGF0ZSBhcHBsaWNhdGlvbiBzdGF0ZS5cbiAqL1xuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xuXHRmaWxlczogZmlsZXNSZWR1Y2VyLFxuXHRzZWxlY3RlZEZpbGVzOiBzZWxlY3RlZEZpbGVzUmVkdWNlclxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyOyIsIi8qKlxuICogQGZpbGUgQWN0aW9ucyBmb3IgbWFraW5nIHVwZGF0ZXMgdG8gdGhlIHNlbGVjdGVkSXRlbXMgc2VjdGlvbiBvZiB0aGUgc3RvcmUncyBzdGF0ZS5cbiAqL1xuXG5pbXBvcnQgeyBTRUxFQ1RFRF9GSUxFUyB9IGZyb20gJy4uL2FjdGlvbi10eXBlcyc7XG5cbi8qKlxuICogU2VsZWN0cyBhIGZpbGVcbiAqXG4gKiBAcGFyYW0gb2JqZWN0IGZpbGVcbiAqIEBwYXJhbSBudW1iZXIgZmlsZS5pZCAtIFRoZSBmaWxlIGlkLlxuICogQHBhcmFtIGJvb2xlYW4gZmlsZS5zZWxlY3RlZCAtIFRoZSBuZXcgc2VsZWN0ZWQgc3RhdGUgb2YgdGhlIGZpbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RGaWxlKGZpbGUpIHtcblx0cmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcblx0XHRyZXR1cm4gZGlzcGF0Y2ggKHtcblx0XHRcdHR5cGU6IFNFTEVDVEVEX0ZJTEVTLlNFTEVDVF9GSUxFLFxuXHRcdFx0cGF5bG9hZDogZmlsZVxuXHRcdH0pO1xuXHR9XG59XG4iLCIvKipcbiAqIEBmaWxlIFJlZHVjZXJzIGZvciBhcHBsaWNhdGlvbidzIHNlbGVjdGVkIGl0ZW1zLlxuICovXG5cbmltcG9ydCB7IFNFTEVDVEVEX0ZJTEVTIH0gZnJvbSAnLi4vYWN0aW9uLXR5cGVzJztcbmltcG9ydCBkZWVwRnJlZXplIGZyb20gJ2RlZXAtZnJlZXplJztcblxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xuXHRzZWxlY3RlZEZpbGVzOiBbXSxcblx0c2VsZWN0ZWQ6IGZhbHNlXG59O1xuXG4vKipcbiAqIEBmdW5jIHNlbGVjdGVkRmlsZXNSZWR1Y2VyXG4gKiBAcGFyYW0gb2JqZWN0IGluaXRpYWxTdGF0ZVxuICogQHBhcmFtIG9iamVjdCBhY3Rpb24gLSBUaGUgZGlzcGF0Y2hlZCBhY3Rpb24uXG4gKiBAcGFyYW0gc3RyaW5nIGFjdGlvbi50eXBlIC0gTmFtZSBvZiB0aGUgZGlzcGF0Y2hlZCBhY3Rpb24uXG4gKiBAcGFyYW0gb2JqZWN0IFthY3Rpb24ucGF5bG9hZF0gLSBPcHRpb25hbCBkYXRhIHBhc3NlZCB3aXRoIHRoZSBhY3Rpb24uXG4gKiBAZGVzYyBSZWR1Y2VyIGZvciB0aGUgYHNlbGVjdGVkSXRlbXNgIHNlY3Rpb24gb2Ygc3RhdGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNlbGVjdGVkRmlsZXNSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcblx0c3dpdGNoIChhY3Rpb24udHlwZSkge1xuXHRcdGNhc2UgU0VMRUNURURfRklMRVMuU0VMRUNUX0ZJTEU6XG5cdFx0XHR2YXIgbmV3U2VsZWN0ZWRGaWxlcyA9IFtdLFxuXHRcdFx0XHRmaWxlSW5kZXggPSBzdGF0ZS5zZWxlY3RlZEZpbGVzLmluZGV4T2YoYWN0aW9uLnBheWxvYWQuaWQpO1xuXG5cdFx0XHQvL1JlbW92ZSBmaWxlIGlmIGl0cyBhbHJlYWR5IGluIGFycmF5LCBlbHNlIGFkZCBpdCB0byB0aGUgYXJyYXlcblx0XHRcdGlmIChmaWxlSW5kZXggPiAtMSkge1xuXHRcdFx0XHRuZXdTZWxlY3RlZEZpbGVzID0gc3RhdGUuc2VsZWN0ZWRGaWxlcy5maWx0ZXIoKGlkKSA9PiBpZCAhPT0gYWN0aW9uLnBheWxvYWQuaWQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV3U2VsZWN0ZWRGaWxlcyA9IHN0YXRlLnNlbGVjdGVkRmlsZXMuY29uY2F0KGFjdGlvbi5wYXlsb2FkLmlkKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcblx0XHRcdFx0c2VsZWN0ZWRGaWxlczogbmV3U2VsZWN0ZWRGaWxlc1xuXHRcdFx0fSkpO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBzdGF0ZTtcblx0fVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWVwRnJlZXplIChvKSB7XG4gIE9iamVjdC5mcmVlemUobyk7XG5cbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobykuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgIGlmIChvLmhhc093blByb3BlcnR5KHByb3ApXG4gICAgJiYgb1twcm9wXSAhPT0gbnVsbFxuICAgICYmICh0eXBlb2Ygb1twcm9wXSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb1twcm9wXSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICYmICFPYmplY3QuaXNGcm96ZW4ob1twcm9wXSkpIHtcbiAgICAgIGRlZXBGcmVlemUob1twcm9wXSk7XG4gICAgfVxuICB9KTtcbiAgXG4gIHJldHVybiBvO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcmVwZWF0ID0gZnVuY3Rpb24gcmVwZWF0KHN0ciwgdGltZXMpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh0aW1lcyArIDEpLmpvaW4oc3RyKTtcbn07XG52YXIgcGFkID0gZnVuY3Rpb24gcGFkKG51bSwgbWF4TGVuZ3RoKSB7XG4gIHJldHVybiByZXBlYXQoXCIwXCIsIG1heExlbmd0aCAtIG51bS50b1N0cmluZygpLmxlbmd0aCkgKyBudW07XG59O1xudmFyIGZvcm1hdFRpbWUgPSBmdW5jdGlvbiBmb3JtYXRUaW1lKHRpbWUpIHtcbiAgcmV0dXJuIFwiIEAgXCIgKyBwYWQodGltZS5nZXRIb3VycygpLCAyKSArIFwiOlwiICsgcGFkKHRpbWUuZ2V0TWludXRlcygpLCAyKSArIFwiOlwiICsgcGFkKHRpbWUuZ2V0U2Vjb25kcygpLCAyKSArIFwiLlwiICsgcGFkKHRpbWUuZ2V0TWlsbGlzZWNvbmRzKCksIDMpO1xufTtcblxuLy8gVXNlIHRoZSBuZXcgcGVyZm9ybWFuY2UgYXBpIHRvIGdldCBiZXR0ZXIgcHJlY2lzaW9uIGlmIGF2YWlsYWJsZVxudmFyIHRpbWVyID0gdHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09IFwiZnVuY3Rpb25cIiA/IHBlcmZvcm1hbmNlIDogRGF0ZTtcblxuLyoqXG4gKiBDcmVhdGVzIGxvZ2dlciB3aXRoIGZvbGxvd2VkIG9wdGlvbnNcbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAcHJvcGVydHkge29iamVjdH0gb3B0aW9ucyAtIG9wdGlvbnMgZm9yIGxvZ2dlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG9wdGlvbnMubGV2ZWwgLSBjb25zb2xlW2xldmVsXVxuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLmR1cmF0aW9uIC0gcHJpbnQgZHVyYXRpb24gb2YgZWFjaCBhY3Rpb24/XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMudGltZXN0YW1wIC0gcHJpbnQgdGltZXN0YW1wIHdpdGggZWFjaCBhY3Rpb24/XG4gKiBAcHJvcGVydHkge29iamVjdH0gb3B0aW9ucy5jb2xvcnMgLSBjdXN0b20gY29sb3JzXG4gKiBAcHJvcGVydHkge29iamVjdH0gb3B0aW9ucy5sb2dnZXIgLSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYGNvbnNvbGVgIEFQSVxuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLmxvZ0Vycm9ycyAtIHNob3VsZCBlcnJvcnMgaW4gYWN0aW9uIGV4ZWN1dGlvbiBiZSBjYXVnaHQsIGxvZ2dlZCwgYW5kIHJlLXRocm93bj9cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy5jb2xsYXBzZWQgLSBpcyBncm91cCBjb2xsYXBzZWQ/XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMucHJlZGljYXRlIC0gY29uZGl0aW9uIHdoaWNoIHJlc29sdmVzIGxvZ2dlciBiZWhhdmlvclxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gb3B0aW9ucy5zdGF0ZVRyYW5zZm9ybWVyIC0gdHJhbnNmb3JtIHN0YXRlIGJlZm9yZSBwcmludFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gb3B0aW9ucy5hY3Rpb25UcmFuc2Zvcm1lciAtIHRyYW5zZm9ybSBhY3Rpb24gYmVmb3JlIHByaW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBvcHRpb25zLmVycm9yVHJhbnNmb3JtZXIgLSB0cmFuc2Zvcm0gZXJyb3IgYmVmb3JlIHByaW50XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlTG9nZ2VyKCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuICB2YXIgX29wdGlvbnMkbGV2ZWwgPSBvcHRpb25zLmxldmVsO1xuICB2YXIgbGV2ZWwgPSBfb3B0aW9ucyRsZXZlbCA9PT0gdW5kZWZpbmVkID8gXCJsb2dcIiA6IF9vcHRpb25zJGxldmVsO1xuICB2YXIgX29wdGlvbnMkbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXI7XG4gIHZhciBsb2dnZXIgPSBfb3B0aW9ucyRsb2dnZXIgPT09IHVuZGVmaW5lZCA/IHdpbmRvdy5jb25zb2xlIDogX29wdGlvbnMkbG9nZ2VyO1xuICB2YXIgX29wdGlvbnMkbG9nRXJyb3JzID0gb3B0aW9ucy5sb2dFcnJvcnM7XG4gIHZhciBsb2dFcnJvcnMgPSBfb3B0aW9ucyRsb2dFcnJvcnMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBfb3B0aW9ucyRsb2dFcnJvcnM7XG4gIHZhciBjb2xsYXBzZWQgPSBvcHRpb25zLmNvbGxhcHNlZDtcbiAgdmFyIHByZWRpY2F0ZSA9IG9wdGlvbnMucHJlZGljYXRlO1xuICB2YXIgX29wdGlvbnMkZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uO1xuICB2YXIgZHVyYXRpb24gPSBfb3B0aW9ucyRkdXJhdGlvbiA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfb3B0aW9ucyRkdXJhdGlvbjtcbiAgdmFyIF9vcHRpb25zJHRpbWVzdGFtcCA9IG9wdGlvbnMudGltZXN0YW1wO1xuICB2YXIgdGltZXN0YW1wID0gX29wdGlvbnMkdGltZXN0YW1wID09PSB1bmRlZmluZWQgPyB0cnVlIDogX29wdGlvbnMkdGltZXN0YW1wO1xuICB2YXIgdHJhbnNmb3JtZXIgPSBvcHRpb25zLnRyYW5zZm9ybWVyO1xuICB2YXIgX29wdGlvbnMkc3RhdGVUcmFuc2ZvID0gb3B0aW9ucy5zdGF0ZVRyYW5zZm9ybWVyO1xuICB2YXIgLy8gZGVwcmVjYXRlZFxuICBzdGF0ZVRyYW5zZm9ybWVyID0gX29wdGlvbnMkc3RhdGVUcmFuc2ZvID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH0gOiBfb3B0aW9ucyRzdGF0ZVRyYW5zZm87XG4gIHZhciBfb3B0aW9ucyRhY3Rpb25UcmFuc2YgPSBvcHRpb25zLmFjdGlvblRyYW5zZm9ybWVyO1xuICB2YXIgYWN0aW9uVHJhbnNmb3JtZXIgPSBfb3B0aW9ucyRhY3Rpb25UcmFuc2YgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uIChhY3RuKSB7XG4gICAgcmV0dXJuIGFjdG47XG4gIH0gOiBfb3B0aW9ucyRhY3Rpb25UcmFuc2Y7XG4gIHZhciBfb3B0aW9ucyRlcnJvclRyYW5zZm8gPSBvcHRpb25zLmVycm9yVHJhbnNmb3JtZXI7XG4gIHZhciBlcnJvclRyYW5zZm9ybWVyID0gX29wdGlvbnMkZXJyb3JUcmFuc2ZvID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gZXJyb3I7XG4gIH0gOiBfb3B0aW9ucyRlcnJvclRyYW5zZm87XG4gIHZhciBfb3B0aW9ucyRjb2xvcnMgPSBvcHRpb25zLmNvbG9ycztcbiAgdmFyIGNvbG9ycyA9IF9vcHRpb25zJGNvbG9ycyA9PT0gdW5kZWZpbmVkID8ge1xuICAgIHRpdGxlOiBmdW5jdGlvbiB0aXRsZSgpIHtcbiAgICAgIHJldHVybiBcIiMwMDAwMDBcIjtcbiAgICB9LFxuICAgIHByZXZTdGF0ZTogZnVuY3Rpb24gcHJldlN0YXRlKCkge1xuICAgICAgcmV0dXJuIFwiIzlFOUU5RVwiO1xuICAgIH0sXG4gICAgYWN0aW9uOiBmdW5jdGlvbiBhY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXCIjMDNBOUY0XCI7XG4gICAgfSxcbiAgICBuZXh0U3RhdGU6IGZ1bmN0aW9uIG5leHRTdGF0ZSgpIHtcbiAgICAgIHJldHVybiBcIiM0Q0FGNTBcIjtcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICAgIHJldHVybiBcIiNGMjA0MDRcIjtcbiAgICB9XG4gIH0gOiBfb3B0aW9ucyRjb2xvcnM7XG5cbiAgLy8gZXhpdCBpZiBjb25zb2xlIHVuZGVmaW5lZFxuXG4gIGlmICh0eXBlb2YgbG9nZ2VyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAgIHJldHVybiBuZXh0KGFjdGlvbik7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgIH07XG4gIH1cblxuICBpZiAodHJhbnNmb3JtZXIpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiT3B0aW9uICd0cmFuc2Zvcm1lcicgaXMgZGVwcmVjYXRlZCwgdXNlIHN0YXRlVHJhbnNmb3JtZXIgaW5zdGVhZFwiKTtcbiAgfVxuXG4gIHZhciBsb2dCdWZmZXIgPSBbXTtcbiAgZnVuY3Rpb24gcHJpbnRCdWZmZXIoKSB7XG4gICAgbG9nQnVmZmVyLmZvckVhY2goZnVuY3Rpb24gKGxvZ0VudHJ5LCBrZXkpIHtcbiAgICAgIHZhciBzdGFydGVkID0gbG9nRW50cnkuc3RhcnRlZDtcbiAgICAgIHZhciBhY3Rpb24gPSBsb2dFbnRyeS5hY3Rpb247XG4gICAgICB2YXIgcHJldlN0YXRlID0gbG9nRW50cnkucHJldlN0YXRlO1xuICAgICAgdmFyIGVycm9yID0gbG9nRW50cnkuZXJyb3I7XG4gICAgICB2YXIgdG9vayA9IGxvZ0VudHJ5LnRvb2s7XG4gICAgICB2YXIgbmV4dFN0YXRlID0gbG9nRW50cnkubmV4dFN0YXRlO1xuXG4gICAgICB2YXIgbmV4dEVudHJ5ID0gbG9nQnVmZmVyW2tleSArIDFdO1xuICAgICAgaWYgKG5leHRFbnRyeSkge1xuICAgICAgICBuZXh0U3RhdGUgPSBuZXh0RW50cnkucHJldlN0YXRlO1xuICAgICAgICB0b29rID0gbmV4dEVudHJ5LnN0YXJ0ZWQgLSBzdGFydGVkO1xuICAgICAgfVxuICAgICAgLy8gbWVzc2FnZVxuICAgICAgdmFyIGZvcm1hdHRlZEFjdGlvbiA9IGFjdGlvblRyYW5zZm9ybWVyKGFjdGlvbik7XG4gICAgICB2YXIgdGltZSA9IG5ldyBEYXRlKHN0YXJ0ZWQpO1xuICAgICAgdmFyIGlzQ29sbGFwc2VkID0gdHlwZW9mIGNvbGxhcHNlZCA9PT0gXCJmdW5jdGlvblwiID8gY29sbGFwc2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgICAgIH0sIGFjdGlvbikgOiBjb2xsYXBzZWQ7XG5cbiAgICAgIHZhciBmb3JtYXR0ZWRUaW1lID0gZm9ybWF0VGltZSh0aW1lKTtcbiAgICAgIHZhciB0aXRsZUNTUyA9IGNvbG9ycy50aXRsZSA/IFwiY29sb3I6IFwiICsgY29sb3JzLnRpdGxlKGZvcm1hdHRlZEFjdGlvbikgKyBcIjtcIiA6IG51bGw7XG4gICAgICB2YXIgdGl0bGUgPSBcImFjdGlvbiBcIiArIGZvcm1hdHRlZEFjdGlvbi50eXBlICsgKHRpbWVzdGFtcCA/IGZvcm1hdHRlZFRpbWUgOiBcIlwiKSArIChkdXJhdGlvbiA/IFwiIGluIFwiICsgdG9vay50b0ZpeGVkKDIpICsgXCIgbXNcIiA6IFwiXCIpO1xuXG4gICAgICAvLyByZW5kZXJcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChpc0NvbGxhcHNlZCkge1xuICAgICAgICAgIGlmIChjb2xvcnMudGl0bGUpIGxvZ2dlci5ncm91cENvbGxhcHNlZChcIiVjIFwiICsgdGl0bGUsIHRpdGxlQ1NTKTtlbHNlIGxvZ2dlci5ncm91cENvbGxhcHNlZCh0aXRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGNvbG9ycy50aXRsZSkgbG9nZ2VyLmdyb3VwKFwiJWMgXCIgKyB0aXRsZSwgdGl0bGVDU1MpO2Vsc2UgbG9nZ2VyLmdyb3VwKHRpdGxlKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dnZXIubG9nKHRpdGxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbG9ycy5wcmV2U3RhdGUpIGxvZ2dlcltsZXZlbF0oXCIlYyBwcmV2IHN0YXRlXCIsIFwiY29sb3I6IFwiICsgY29sb3JzLnByZXZTdGF0ZShwcmV2U3RhdGUpICsgXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIHByZXZTdGF0ZSk7ZWxzZSBsb2dnZXJbbGV2ZWxdKFwicHJldiBzdGF0ZVwiLCBwcmV2U3RhdGUpO1xuXG4gICAgICBpZiAoY29sb3JzLmFjdGlvbikgbG9nZ2VyW2xldmVsXShcIiVjIGFjdGlvblwiLCBcImNvbG9yOiBcIiArIGNvbG9ycy5hY3Rpb24oZm9ybWF0dGVkQWN0aW9uKSArIFwiOyBmb250LXdlaWdodDogYm9sZFwiLCBmb3JtYXR0ZWRBY3Rpb24pO2Vsc2UgbG9nZ2VyW2xldmVsXShcImFjdGlvblwiLCBmb3JtYXR0ZWRBY3Rpb24pO1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGNvbG9ycy5lcnJvcikgbG9nZ2VyW2xldmVsXShcIiVjIGVycm9yXCIsIFwiY29sb3I6IFwiICsgY29sb3JzLmVycm9yKGVycm9yLCBwcmV2U3RhdGUpICsgXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIGVycm9yKTtlbHNlIGxvZ2dlcltsZXZlbF0oXCJlcnJvclwiLCBlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2xvcnMubmV4dFN0YXRlKSBsb2dnZXJbbGV2ZWxdKFwiJWMgbmV4dCBzdGF0ZVwiLCBcImNvbG9yOiBcIiArIGNvbG9ycy5uZXh0U3RhdGUobmV4dFN0YXRlKSArIFwiOyBmb250LXdlaWdodDogYm9sZFwiLCBuZXh0U3RhdGUpO2Vsc2UgbG9nZ2VyW2xldmVsXShcIm5leHQgc3RhdGVcIiwgbmV4dFN0YXRlKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgbG9nZ2VyLmdyb3VwRW5kKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ2dlci5sb2coXCLigJTigJQgbG9nIGVuZCDigJTigJRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbG9nQnVmZmVyLmxlbmd0aCA9IDA7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgZ2V0U3RhdGUgPSBfcmVmLmdldFN0YXRlO1xuICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgLy8gZXhpdCBlYXJseSBpZiBwcmVkaWNhdGUgZnVuY3Rpb24gcmV0dXJucyBmYWxzZVxuICAgICAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gXCJmdW5jdGlvblwiICYmICFwcmVkaWNhdGUoZ2V0U3RhdGUsIGFjdGlvbikpIHtcbiAgICAgICAgICByZXR1cm4gbmV4dChhY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvZ0VudHJ5ID0ge307XG4gICAgICAgIGxvZ0J1ZmZlci5wdXNoKGxvZ0VudHJ5KTtcblxuICAgICAgICBsb2dFbnRyeS5zdGFydGVkID0gdGltZXIubm93KCk7XG4gICAgICAgIGxvZ0VudHJ5LnByZXZTdGF0ZSA9IHN0YXRlVHJhbnNmb3JtZXIoZ2V0U3RhdGUoKSk7XG4gICAgICAgIGxvZ0VudHJ5LmFjdGlvbiA9IGFjdGlvbjtcblxuICAgICAgICB2YXIgcmV0dXJuZWRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGxvZ0Vycm9ycykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm5lZFZhbHVlID0gbmV4dChhY3Rpb24pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGxvZ0VudHJ5LmVycm9yID0gZXJyb3JUcmFuc2Zvcm1lcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuZWRWYWx1ZSA9IG5leHQoYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZ0VudHJ5LnRvb2sgPSB0aW1lci5ub3coKSAtIGxvZ0VudHJ5LnN0YXJ0ZWQ7XG4gICAgICAgIGxvZ0VudHJ5Lm5leHRTdGF0ZSA9IHN0YXRlVHJhbnNmb3JtZXIoZ2V0U3RhdGUoKSk7XG5cbiAgICAgICAgcHJpbnRCdWZmZXIoKTtcblxuICAgICAgICBpZiAobG9nRW50cnkuZXJyb3IpIHRocm93IGxvZ0VudHJ5LmVycm9yO1xuICAgICAgICByZXR1cm4gcmV0dXJuZWRWYWx1ZTtcbiAgICAgIH07XG4gICAgfTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVMb2dnZXI7Il19

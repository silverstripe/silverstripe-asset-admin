(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

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

			this.request('DELETE', this.delete_url, {
				'ids': filesToDelete
			}).then(function () {
				// Using for loop because IE10 doesn't handle 'for of',
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

			var updates = { id: id };

			values.forEach(function (field) {
				updates[field.name] = field.value;
			});

			this.request('POST', this.update_url, updates).then(function () {
				_this6.emit('onSaveData', id, updates);
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
				'type': method, // compat with jQuery 1.7
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

},{"events":14,"jQuery":"jQuery"}],2:[function(require,module,exports){
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

var _sectionsGalleryController = require('../sections/gallery/controller');

var _sectionsGalleryController2 = _interopRequireDefault(_sectionsGalleryController);

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
		backend = new _backendFileBackend2['default']($componentWrapper.data('asset-gallery-fetch-url'), $componentWrapper.data('asset-gallery-search-url'), $componentWrapper.data('asset-gallery-update-url'), $componentWrapper.data('asset-gallery-delete-url'), $componentWrapper.data('asset-gallery-limit'), $componentWrapper.data('asset-gallery-bulk-actions'), $search.find('[type=hidden][name="q[Folder]"]'), currentFolder);

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
	_react2['default'].createElement(_sectionsGalleryController2['default'], props)
), (0, _jQuery2['default'])('.asset-gallery-component-wrapper')[0]);

},{"../backend/file-backend":1,"../sections/gallery/controller":8,"../state/configureStore":10,"jQuery":"jQuery","react":"react","react-dom":"react-dom","react-redux":"react-redux"}],3:[function(require,module,exports){
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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _stateGalleryActions = require('../../state/gallery/actions');

var galleryActions = _interopRequireWildcard(_stateGalleryActions);

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

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
				{ className: 'gallery__bulk-actions fieldholder-small' },
				_react2['default'].createElement(
					'select',
					{ className: 'dropdown no-change-track no-chzn', tabIndex: '0', 'data-placeholder': this.props.gallery.bulkActions.placeholder, style: { width: '160px' } },
					_react2['default'].createElement('option', { selected: true, disabled: true, hidden: true, value: '' }),
					this.props.gallery.bulkActions.options.map(function (option, i) {
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
			// Using for loop because IE10 doesn't handle 'for of',
			// which gets transcompiled into a function which uses Symbol,
			// the thing IE10 dies on.
			for (var i = 0; i < this.props.gallery.bulkActions.options.length; i += 1) {
				if (this.props.gallery.bulkActions.options[i].value === value) {
					return this.props.gallery.bulkActions.options[i];
				}
			}

			return null;
		}
	}, {
		key: 'getSelectedFiles',
		value: function getSelectedFiles() {
			return this.props.gallery.selectedFiles;
		}
	}, {
		key: 'applyAction',
		value: function applyAction(value) {
			// We only have 'delete' right now...
			switch (value) {
				case 'delete':
					this.props.backend['delete'](this.getSelectedFiles());
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
				if (confirm(_i18n2['default'].sprintf(_i18n2['default']._t('AssetGalleryField.BULK_ACTIONS_CONFIRM'), option.label))) {
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

function mapStateToProps(state) {
	return {
		gallery: state.assetAdmin.gallery
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: (0, _redux.bindActionCreators)(galleryActions, dispatch)
	};
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(BulkActionsComponent);
module.exports = exports['default'];

},{"../../state/gallery/actions":11,"i18n":"i18n","jQuery":"jQuery","react":"react","react-addons-test-utils":"react-addons-test-utils","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],4:[function(require,module,exports){
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

var _stateGalleryActions = require('../../state/gallery/actions');

var galleryActions = _interopRequireWildcard(_stateGalleryActions);

var _constants = require('../../constants');

var _constants2 = _interopRequireDefault(_constants);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var FileComponent = (function (_SilverStripeComponent) {
	_inherits(FileComponent, _SilverStripeComponent);

	function FileComponent(props) {
		_classCallCheck(this, FileComponent);

		_get(Object.getPrototypeOf(FileComponent.prototype), 'constructor', this).call(this, props);

		this.getButtonTabIndex = this.getButtonTabIndex.bind(this);
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

			if (this.props.gallery.selectedFiles.indexOf(this.props.id) === -1) {
				this.props.actions.selectFiles(this.props.id);
			} else {
				this.props.actions.deselectFiles(this.props.id);
			}
		}
	}, {
		key: 'onFileEdit',
		value: function onFileEdit(event) {
			var _this = this;

			event.stopPropagation(); //stop triggering click on root element
			this.props.actions.setEditing(this.props.gallery.files.find(function (file) {
				return file.id === _this.props.id;
			}));
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
				thumbnailClassNames += ' item__thumbnail--large';
			}

			return thumbnailClassNames;
		}
	}, {
		key: 'isSelected',
		value: function isSelected() {
			return this.props.gallery.selectedFiles.indexOf(this.props.id) > -1;
		}
	}, {
		key: 'isFocussed',
		value: function isFocussed() {
			return this.props.gallery.focus === this.props.id;
		}
	}, {
		key: 'getButtonTabIndex',
		value: function getButtonTabIndex() {
			if (this.isFocussed()) {
				return 0;
			} else {
				return -1;
			}
		}
	}, {
		key: 'getItemClassNames',
		value: function getItemClassNames() {
			var itemClassNames = 'item item--' + this.props.category;

			if (this.isFocussed()) {
				itemClassNames += ' item--focussed';
			}

			if (this.isSelected()) {
				itemClassNames += ' item--selected';
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
				(0, _jQuery2['default'])(_reactDom2['default'].findDOMNode(this)).find('.item__actions__action').first().focus();
			}

			//If return is pressed, navigate folder
			if (this.props.returnKey === event.keyCode) {
				this.onFileNavigate(event);
			}
		}
	}, {
		key: 'handleFocus',
		value: function handleFocus() {
			this.props.actions.setFocus(this.props.id);
		}
	}, {
		key: 'handleBlur',
		value: function handleBlur() {
			this.props.actions.setFocus(false);
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
			var selectButton;
			var deleteButton;
			var editButton;

			selectButton = _react2['default'].createElement('button', {
				className: 'item__actions__action item__actions__action--select [ font-icon-tick ]',
				type: 'button',
				title: _i18n2['default']._t('AssetGalleryField.SELECT'),
				tabIndex: this.getButtonTabIndex(),
				onClick: this.onFileSelect,
				onFocus: this.handleFocus,
				onBlur: this.handleBlur });

			if (this.props.canDelete) {
				deleteButton = _react2['default'].createElement('button', {
					className: 'item__actions__action item__actions__action--remove [ font-icon-trash ]',
					type: 'button',
					title: _i18n2['default']._t('AssetGalleryField.DELETE'),
					tabIndex: this.getButtonTabIndex(),
					onClick: this.onFileDelete,
					onFocus: this.handleFocus,
					onBlur: this.handleBlur });
			}

			if (this.props.canEdit) {
				editButton = _react2['default'].createElement('button', {
					className: 'item__actions__action item__actions__action--edit [ font-icon-edit ]',
					type: 'button',
					title: _i18n2['default']._t('AssetGalleryField.EDIT'),
					tabIndex: this.getButtonTabIndex(),
					onClick: this.onFileEdit,
					onFocus: this.handleFocus,
					onBlur: this.handleBlur });
			}

			return _react2['default'].createElement(
				'div',
				{ className: this.getItemClassNames(), 'data-id': this.props.id, onDoubleClick: this.handleDoubleClick },
				_react2['default'].createElement(
					'div',
					{ ref: 'thumbnail', className: this.getThumbnailClassNames(), tabIndex: '0', onKeyDown: this.handleKeyDown, style: this.getThumbnailStyles(), onClick: this.onFileSelect, onMouseDown: this.preventFocus },
					_react2['default'].createElement(
						'div',
						{ className: 'item__actions' },
						selectButton,
						deleteButton,
						editButton
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
	id: _react2['default'].PropTypes.number,
	title: _react2['default'].PropTypes.string,
	category: _react2['default'].PropTypes.string,
	url: _react2['default'].PropTypes.string,
	dimensions: _react2['default'].PropTypes.shape({
		width: _react2['default'].PropTypes.number,
		height: _react2['default'].PropTypes.number
	}),
	onFileNavigate: _react2['default'].PropTypes.func,
	onFileEdit: _react2['default'].PropTypes.func,
	onFileDelete: _react2['default'].PropTypes.func,
	spaceKey: _react2['default'].PropTypes.number,
	returnKey: _react2['default'].PropTypes.number,
	onFileSelect: _react2['default'].PropTypes.func,
	selected: _react2['default'].PropTypes.bool,
	canEdit: _react2['default'].PropTypes.bool,
	canDelete: _react2['default'].PropTypes.bool
};

function mapStateToProps(state) {
	return {
		gallery: state.assetAdmin.gallery
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: (0, _redux.bindActionCreators)(galleryActions, dispatch)
	};
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(FileComponent);
module.exports = exports['default'];

},{"../../constants":6,"../../state/gallery/actions":11,"i18n":"i18n","jQuery":"jQuery","react":"react","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var TextFieldComponent = (function (_SilverStripeComponent) {
    _inherits(TextFieldComponent, _SilverStripeComponent);

    function TextFieldComponent(props) {
        _classCallCheck(this, TextFieldComponent);

        _get(Object.getPrototypeOf(TextFieldComponent.prototype), 'constructor', this).call(this, props);

        this.handleChange = this.handleChange.bind(this);
    }

    _createClass(TextFieldComponent, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { className: 'field text' },
                _react2['default'].createElement(
                    'label',
                    { className: 'left', htmlFor: 'gallery_' + this.props.name },
                    this.props.label
                ),
                _react2['default'].createElement(
                    'div',
                    { className: 'middleColumn' },
                    _react2['default'].createElement('input', {
                        id: 'gallery_' + this.props.name,
                        className: 'text',
                        type: 'text',
                        name: this.props.name,
                        onChange: this.handleChange,
                        value: this.props.value })
                )
            );
        }
    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            this.props.onChange();
        }
    }]);

    return TextFieldComponent;
})(_silverstripeComponent2['default']);

exports['default'] = TextFieldComponent;

TextFieldComponent.propTypes = {
    label: _react2['default'].PropTypes.string.isRequired,
    name: _react2['default'].PropTypes.string.isRequired,
    value: _react2['default'].PropTypes.string.isRequired,
    onChange: _react2['default'].PropTypes.func.isRequired
};
module.exports = exports['default'];

},{"react":"react","silverstripe-component":"silverstripe-component"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

exports['default'] = {
	'THUMBNAIL_HEIGHT': 150,
	'THUMBNAIL_WIDTH': 200,
	'SPACE_KEY_CODE': 32,
	'RETURN_KEY_CODE': 13,
	'BULK_ACTIONS': [{
		value: 'delete',
		label: _i18n2['default']._t('AssetGalleryField.BULK_ACTIONS_DELETE'),
		destructive: true
	}],
	'BULK_ACTIONS_PLACEHOLDER': _i18n2['default']._t('AssetGalleryField.BULK_ACTIONS_PLACEHOLDER')
};
module.exports = exports['default'];

},{"i18n":"i18n"}],7:[function(require,module,exports){
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

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _stateGalleryActions = require('../../state/gallery/actions');

var galleryActions = _interopRequireWildcard(_stateGalleryActions);

var _componentsTextFieldIndex = require('../../components/text-field/index');

var _componentsTextFieldIndex2 = _interopRequireDefault(_componentsTextFieldIndex);

var EditorContainer = (function (_SilverStripeComponent) {
	_inherits(EditorContainer, _SilverStripeComponent);

	function EditorContainer(props) {
		_classCallCheck(this, EditorContainer);

		_get(Object.getPrototypeOf(EditorContainer.prototype), 'constructor', this).call(this, props);

		this.fields = [{
			'label': 'Title',
			'name': 'title',
			'value': this.props.file.title
		}, {
			'label': 'Filename',
			'name': 'basename',
			'value': this.props.file.basename
		}];

		this.onFieldChange = this.onFieldChange.bind(this);
		this.onFileSave = this.onFileSave.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	_createClass(EditorContainer, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_get(Object.getPrototypeOf(EditorContainer.prototype), 'componentDidMount', this).call(this);

			this.props.actions.setEditorFields(this.fields);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_get(Object.getPrototypeOf(EditorContainer.prototype), 'componentWillUnmount', this).call(this);

			this.props.actions.setEditorFields();
		}
	}, {
		key: 'onFieldChange',
		value: function onFieldChange(event) {
			this.props.actions.updateEditorField({
				name: event.target.name,
				value: event.target.value
			});
		}
	}, {
		key: 'onFileSave',
		value: function onFileSave(event) {
			this.props.onFileSave(this.props.file.id, this.props.gallery.editorFields, event);
		}
	}, {
		key: 'onCancel',
		value: function onCancel(event) {
			this.props.actions.setEditing(false);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

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
				this.props.gallery.editorFields.map(function (field, i) {
					return _react2['default'].createElement(_componentsTextFieldIndex2['default'], {
						key: i,
						label: field.label,
						name: field.name,
						value: field.value,
						onChange: _this.onFieldChange });
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

	return EditorContainer;
})(_silverstripeComponent2['default']);

EditorContainer.propTypes = {
	file: _react2['default'].PropTypes.shape({
		id: _react2['default'].PropTypes.number,
		title: _react2['default'].PropTypes.string,
		basename: _react2['default'].PropTypes.string,
		url: _react2['default'].PropTypes.string,
		size: _react2['default'].PropTypes.string,
		created: _react2['default'].PropTypes.string,
		lastUpdated: _react2['default'].PropTypes.string,
		dimensions: _react2['default'].PropTypes.shape({
			width: _react2['default'].PropTypes.number,
			height: _react2['default'].PropTypes.number
		})
	}),
	onFileSave: _react2['default'].PropTypes.func,
	onCancel: _react2['default'].PropTypes.func
};

function mapStateToProps(state) {
	return {
		gallery: state.assetAdmin.gallery
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: (0, _redux.bindActionCreators)(galleryActions, dispatch)
	};
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(EditorContainer);
module.exports = exports['default'];

},{"../../components/text-field/index":5,"../../state/gallery/actions":11,"i18n":"i18n","jQuery":"jQuery","react":"react","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _componentsFileIndex = require('../../components/file/index');

var _componentsFileIndex2 = _interopRequireDefault(_componentsFileIndex);

var _editorControllerJs = require('../editor/controller.js');

var _editorControllerJs2 = _interopRequireDefault(_editorControllerJs);

var _componentsBulkActionsIndex = require('../../components/bulk-actions/index');

var _componentsBulkActionsIndex2 = _interopRequireDefault(_componentsBulkActionsIndex);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var _constants = require('../../constants');

var _constants2 = _interopRequireDefault(_constants);

var _stateGalleryActions = require('../../state/gallery/actions');

var galleryActions = _interopRequireWildcard(_stateGalleryActions);

function getComparator(field, direction) {
	return function (a, b) {
		var fieldA = a[field].toLowerCase();
		var fieldB = b[field].toLowerCase();

		if (direction === 'asc') {
			if (fieldA < fieldB) {
				return -1;
			}

			if (fieldA > fieldB) {
				return 1;
			}
		} else {
			if (fieldA > fieldB) {
				return -1;
			}

			if (fieldA < fieldB) {
				return 1;
			}
		}

		return 0;
	};
}

var GalleryContainer = (function (_SilverStripeComponent) {
	_inherits(GalleryContainer, _SilverStripeComponent);

	function GalleryContainer(props) {
		_classCallCheck(this, GalleryContainer);

		_get(Object.getPrototypeOf(GalleryContainer.prototype), 'constructor', this).call(this, props);

		this.folders = [props.initial_folder];

		this.sort = 'name';
		this.direction = 'asc';

		this.sorters = [{
			field: 'title',
			direction: 'asc',
			label: _i18n2['default']._t('AssetGalleryField.FILTER_TITLE_ASC')
		}, {
			field: 'title',
			direction: 'desc',
			label: _i18n2['default']._t('AssetGalleryField.FILTER_TITLE_DESC')
		}, {
			field: 'created',
			direction: 'desc',
			label: _i18n2['default']._t('AssetGalleryField.FILTER_DATE_DESC')
		}, {
			field: 'created',
			direction: 'asc',
			label: _i18n2['default']._t('AssetGalleryField.FILTER_DATE_ASC')
		}];

		// Backend event listeners
		this.onFetchData = this.onFetchData.bind(this);
		this.onSaveData = this.onSaveData.bind(this);
		this.onDeleteData = this.onDeleteData.bind(this);
		this.onNavigateData = this.onNavigateData.bind(this);
		this.onMoreData = this.onMoreData.bind(this);
		this.onSearchData = this.onSearchData.bind(this);

		// User event listeners
		this.onFileSave = this.onFileSave.bind(this);
		this.onFileNavigate = this.onFileNavigate.bind(this);
		this.onFileDelete = this.onFileDelete.bind(this);
		this.onBackClick = this.onBackClick.bind(this);
		this.onMoreClick = this.onMoreClick.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.handleSort = this.handleSort.bind(this);
	}

	_createClass(GalleryContainer, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_get(Object.getPrototypeOf(GalleryContainer.prototype), 'componentDidMount', this).call(this);

			if (this.props.initial_folder !== this.props.current_folder) {
				this.onNavigate(this.props.current_folder);
			} else {
				this.props.backend.search();
			}

			this.props.backend.on('onFetchData', this.onFetchData);
			this.props.backend.on('onSaveData', this.onSaveData);
			this.props.backend.on('onDeleteData', this.onDeleteData);
			this.props.backend.on('onNavigateData', this.onNavigateData);
			this.props.backend.on('onMoreData', this.onMoreData);
			this.props.backend.on('onSearchData', this.onSearchData);

			var $select = (0, _jQuery2['default'])(_reactDom2['default'].findDOMNode(this)).find('.gallery__sort .dropdown');

			// We opt-out of letting the CMS handle Chosen because it doesn't re-apply the behaviour correctly.
			// So after the gallery has been rendered we apply Chosen.
			$select.chosen({
				'allow_single_deselect': true,
				'disable_search_threshold': 20
			});

			//Chosen stops the change event from reaching React so we have to simulate a click.
			$select.change(function () {
				return _reactAddonsTestUtils2['default'].Simulate.click($select.find(':selected')[0]);
			});
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_get(Object.getPrototypeOf(GalleryContainer.prototype), 'componentWillUnmount', this).call(this);

			this.props.backend.removeListener('onFetchData', this.onFetchData);
			this.props.backend.removeListener('onSaveData', this.onSaveData);
			this.props.backend.removeListener('onDeleteData', this.onDeleteData);
			this.props.backend.removeListener('onNavigateData', this.onNavigateData);
			this.props.backend.removeListener('onMoreData', this.onMoreData);
			this.props.backend.removeListener('onSearchData', this.onSearchData);
		}

		/**
   * Handler for when the user changes the sort order.
   *
   * @param object event - Click event.
   */
	}, {
		key: 'handleSort',
		value: function handleSort(event) {
			var data = event.target.dataset;
			this.props.actions.sortFiles(getComparator(data.field, data.direction));
		}
	}, {
		key: 'getFileById',
		value: function getFileById(id) {
			var folder = null;

			for (var i = 0; i < this.props.gallery.files.length; i += 1) {
				if (this.props.gallery.files[i].id === id) {
					folder = this.props.gallery.files[i];
					break;
				}
			}

			return folder;
		}
	}, {
		key: 'getNoItemsNotice',
		value: function getNoItemsNotice() {
			if (this.props.gallery.count < 1) {
				return _react2['default'].createElement(
					'p',
					{ className: 'gallery__no-item-notice' },
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
			if (this.props.gallery.selectedFiles.length > 0 && this.props.backend.bulkActions) {
				return _react2['default'].createElement(_componentsBulkActionsIndex2['default'], {
					backend: this.props.backend });
			}

			return null;
		}
	}, {
		key: 'getMoreButton',
		value: function getMoreButton() {
			if (this.props.gallery.count > this.props.gallery.files.length) {
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
		key: 'render',
		value: function render() {
			var _this = this;

			if (this.props.gallery.editing !== false) {
				return _react2['default'].createElement(
					'div',
					{ className: 'gallery' },
					_react2['default'].createElement(_editorControllerJs2['default'], {
						file: this.props.gallery.editing,
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
								{
									key: i,
									onClick: _this.handleSort,
									'data-field': sorter.field,
									'data-direction': sorter.direction },
								sorter.label
							);
						})
					)
				),
				_react2['default'].createElement(
					'div',
					{ className: 'gallery__items' },
					this.props.gallery.files.map(function (file, i) {
						return _react2['default'].createElement(_componentsFileIndex2['default'], _extends({ key: i }, file, {
							spaceKey: _constants2['default'].SPACE_KEY_CODE,
							returnKey: _constants2['default'].RETURN_KEY_CODE,
							onFileDelete: _this.onFileDelete,
							onFileNavigate: _this.onFileNavigate }));
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
		key: 'onFetchData',
		value: function onFetchData(data) {
			this.props.actions.addFile(data.files, data.count);
		}
	}, {
		key: 'onSaveData',
		value: function onSaveData(id, values) {
			this.props.actions.setEditing(false);
			this.props.actions.updateFile(id, { title: values.title, basename: values.basename });
		}
	}, {
		key: 'onDeleteData',
		value: function onDeleteData(data) {
			this.props.actions.removeFile(data);
		}
	}, {
		key: 'onNavigateData',
		value: function onNavigateData(data) {
			// Remove files from the previous folder from the state
			this.props.actions.removeFile();
			this.props.actions.addFile(data.files, data.count);
		}
	}, {
		key: 'onMoreData',
		value: function onMoreData(data) {
			this.props.actions.addFile(this.props.gallery.files.concat(data.files), data.count);
		}
	}, {
		key: 'onSearchData',
		value: function onSearchData(data) {
			this.props.actions.addFile(data.files, data.count);
		}
	}, {
		key: 'onFileDelete',
		value: function onFileDelete(file, event) {
			if (confirm(_i18n2['default']._t('AssetGalleryField.CONFIRMDELETE'))) {
				this.props.backend['delete'](file.id);
			}

			event.stopPropagation();
		}
	}, {
		key: 'onFileNavigate',
		value: function onFileNavigate(file) {
			this.folders.push(file.filename);
			this.props.backend.navigate(file.filename);

			this.props.actions.deselectFiles();
		}
	}, {
		key: 'onNavigate',
		value: function onNavigate(folder) {
			var silent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			// Don't push the folder to the array if it exists already.
			if (this.folders.indexOf(folder) === -1) {
				this.folders.push(folder);
			}

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

			this.props.actions.deselectFiles();

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

	return GalleryContainer;
})(_silverstripeComponent2['default']);

GalleryContainer.propTypes = {
	backend: _react2['default'].PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		gallery: state.assetAdmin.gallery
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: (0, _redux.bindActionCreators)(galleryActions, dispatch)
	};
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(GalleryContainer);
module.exports = exports['default'];

},{"../../components/bulk-actions/index":3,"../../components/file/index":4,"../../constants":6,"../../state/gallery/actions":11,"../editor/controller.js":7,"i18n":"i18n","jQuery":"jQuery","react":"react","react-addons-test-utils":"react-addons-test-utils","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var GALLERY = {
    ADD_FILE: 'ADD_FILE',
    REMOVE_FILE: 'REMOVE_FILE',
    UPDATE_FILE: 'UPDATE_FILE',
    SELECT_FILES: 'SELECT_FILES',
    DESELECT_FILES: 'DESELECT_FILES',
    SET_EDITING: 'SET_EDITING',
    SET_FOCUS: 'SET_FOCUS',
    SET_EDITOR_FIELDS: 'SET_EDITOR_FIELDS',
    UPDATE_EDITOR_FIELD: 'UPDATE_EDITOR_FIELD',
    SORT_FILES: 'SORT_FILES'
};
exports.GALLERY = GALLERY;

},{}],10:[function(require,module,exports){
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

},{"./reducer":13,"redux":"redux","redux-logger":16,"redux-thunk":"redux-thunk"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.addFile = addFile;
exports.removeFile = removeFile;
exports.updateFile = updateFile;
exports.selectFiles = selectFiles;
exports.deselectFiles = deselectFiles;
exports.setEditing = setEditing;
exports.setFocus = setFocus;
exports.setEditorFields = setEditorFields;
exports.updateEditorField = updateEditorField;
exports.sortFiles = sortFiles;

var _actionTypes = require('../action-types');

/**
 * Adds a file to state.
 *
 * @param object|array file - File object or array of file objects.
 * @param number [count] - The number of files in the current view.
 */

function addFile(file, count) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.ADD_FILE,
            payload: { file: file, count: count }
        });
    };
}

/**
 * Removes a file from the state. If no param is passed all files are removed
 *
 * @param number|array id - File id or array of file ids.
 */

function removeFile(id) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.REMOVE_FILE,
            payload: { id: id }
        });
    };
}

/**
 * Updates a file with new data.
 *
 * @param number id - The id of the file to update.
 * @param object updates - The new values.
 */

function updateFile(id, updates) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.UPDATE_FILE,
            payload: { id: id, updates: updates }
        });
    };
}

/**
 * Selects a file or files. If no param is passed all files are selected.
 *
 * @param number|array ids - File id or array of file ids to select.
 */

function selectFiles() {
    var ids = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SELECT_FILES,
            payload: { ids: ids }
        });
    };
}

/**
 * Deselects a file or files. If no param is passed all files are deselected.
 *
 * @param number|array ids - File id or array of file ids to deselect.
 */

function deselectFiles() {
    var ids = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.DESELECT_FILES,
            payload: { ids: ids }
        });
    };
}

/**
 * Starts editing the given file or stops editing if false is given.
 *
 * @param object|boolean file - The file to edit.
 */

function setEditing(file) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SET_EDITING,
            payload: { file: file }
        });
    };
}

/**
 * Sets the focus state of a file.
 *
 * @param number|boolean id - the id of the file to focus on, or false.
 */

function setFocus(id) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SET_FOCUS,
            payload: {
                id: id
            }
        });
    };
}

/**
 * Sets the state of the fields for the editor component.
 *
 * @param object editorFields - the current fields in the editor component
 */

function setEditorFields() {
    var editorFields = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SET_EDITOR_FIELDS,
            payload: { editorFields: editorFields }
        });
    };
}

/**
 * Update the value of the given field.
 *
 * @param object updates - The values to update the editor field with.
 * @param string updates.name - The editor field name.
 * @param string updates.value - The new value of the field.
 * @param string [updates.label] - The field label.
 */

function updateEditorField(updates) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.UPDATE_EDITOR_FIELD,
            payload: { updates: updates }
        });
    };
}

/**
 * Sorts files in some order.
 *
 * @param func comparator - Used to determine the sort order.
 */

function sortFiles(comparator) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SORT_FILES,
            payload: { comparator: comparator }
        });
    };
}

},{"../action-types":9}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = galleryReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _actionTypes = require('../action-types');

var _constantsJs = require('../../constants.js');

var _constantsJs2 = _interopRequireDefault(_constantsJs);

var initialState = {
    count: 0, // The number of files in the current view
    editing: false,
    files: [],
    selectedFiles: [],
    editing: false,
    focus: false,
    bulkActions: {
        placeholder: _constantsJs2['default'].BULK_ACTIONS_PLACEHOLDER,
        options: _constantsJs2['default'].BULK_ACTIONS
    },
    editorFields: []
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

    var nextState;

    switch (action.type) {
        case _actionTypes.GALLERY.ADD_FILE:
            var nextFilesState = []; // Clone the state.files array

            if (Object.prototype.toString.call(action.payload.file) === '[object Array]') {
                // If an array of object is given
                action.payload.file.forEach(function (payloadFile) {
                    var fileInState = false;

                    state.files.forEach(function (stateFile) {
                        // Check if each file given is already in the state
                        if (stateFile.id === payloadFile.id) {
                            fileInState = true;
                        };
                    });

                    // Only add the file if it isn't already in the state
                    if (!fileInState) {
                        nextFilesState.push(payloadFile);
                    }
                });
            } else if (typeof action.payload.file === 'object') {
                // Else if a single item is given
                var fileInState = false;

                state.files.forEach(function (file) {
                    // Check if the file given is already in the state
                    if (file.id === action.payload.file.id) {
                        fileInState = true;
                    };
                });

                // Only add the file if it isn't already in the state
                if (!fileInState) {
                    nextFilesState.push(action.payload.file);
                }
            }

            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                count: typeof action.payload.count !== 'undefined' ? action.payload.count : state.count,
                files: state.files.concat(nextFilesState)
            }));

        case _actionTypes.GALLERY.REMOVE_FILE:
            if (typeof action.payload.id === 'undefined') {
                // No param was passed, remove everything.
                nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, { count: 0, files: [] }));
            } else if (typeof action.payload.id === 'number') {
                // We're dealing with a single file to remove.
                nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, {
                    count: state.count - 1,
                    files: state.files.filter(function (file) {
                        return file.id !== action.payload.id;
                    })
                }));
            } else {
                // We're dealing with an array of ids
                nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, {
                    count: state.count - action.payload.id.length,
                    files: state.files.filter(function (file) {
                        return action.payload.id.indexOf(file.id) === -1;
                    })
                }));
            }

            return nextState;

        case _actionTypes.GALLERY.UPDATE_FILE:
            var fileIndex = state.files.map(function (file) {
                return file.id;
            }).indexOf(action.payload.id);
            var updatedFile = Object.assign({}, state.files[fileIndex], action.payload.updates);

            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                files: state.files.map(function (file) {
                    return file.id === updatedFile.id ? updatedFile : file;
                })
            }));

        case _actionTypes.GALLERY.SELECT_FILES:
            if (action.payload.ids === null) {
                // No param was passed, add everything that isn't currently selected, to the selectedFiles array.
                nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, {
                    selectedFiles: state.selectedFiles.concat(state.files.map(function (file) {
                        return file.id;
                    }).filter(function (id) {
                        return state.selectedFiles.indexOf(id) === -1;
                    }))
                }));
            } else if (typeof action.payload.ids === 'number') {
                // We're dealing with a single id to select.
                // Add the file if it's not already selected.
                if (state.selectedFiles.indexOf(action.payload.ids) === -1) {
                    nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, {
                        selectedFiles: state.selectedFiles.concat(action.payload.ids)
                    }));
                } else {
                    // The file is already selected, so return the current state.
                    nextState = state;
                }
            } else {
                // We're dealing with an array if ids to select.
                nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, {
                    selectedFiles: state.selectedFiles.concat(action.payload.ids.filter(function (id) {
                        return state.selectedFiles.indexOf(id) === -1;
                    }))
                }));
            }

            return nextState;

        case _actionTypes.GALLERY.DESELECT_FILES:
            if (action.payload.ids === null) {
                // No param was passed, deselect everything.
                nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, { selectedFiles: [] }));
            } else if (typeof action.payload.ids === 'number') {
                // We're dealing with a single id to deselect.
                var _fileIndex = state.selectedFiles.indexOf(action.payload.ids);

                nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, {
                    selectedFiles: state.selectedFiles.slice(0, _fileIndex).concat(state.selectedFiles.slice(_fileIndex + 1))
                }));
            } else {
                // We're dealing with an array of ids to deselect.
                nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, {
                    selectedFiles: state.selectedFiles.filter(function (id) {
                        return action.payload.ids.indexOf(id) === -1;
                    })
                }));
            }

            return nextState;

        case _actionTypes.GALLERY.SET_EDITING:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                editing: action.payload.file
            }));

        case _actionTypes.GALLERY.SET_FOCUS:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                focus: action.payload.id
            }));

        case _actionTypes.GALLERY.SET_EDITOR_FIELDS:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                editorFields: action.payload.editorFields
            }));

        case _actionTypes.GALLERY.UPDATE_EDITOR_FIELD:
            var fieldIndex = state.editorFields.map(function (field) {
                return field.name;
            }).indexOf(action.payload.updates.name),
                updatedField = Object.assign({}, state.editorFields[fieldIndex], action.payload.updates);

            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                editorFields: state.editorFields.map(function (field) {
                    return field.name === updatedField.name ? updatedField : field;
                })
            }));

        case _actionTypes.GALLERY.SORT_FILES:
            var folders = state.files.filter(function (file) {
                return file.type === 'folder';
            }),
                files = state.files.filter(function (file) {
                return file.type !== 'folder';
            });

            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                files: folders.sort(action.payload.comparator).concat(files.sort(action.payload.comparator))
            }));
        default:
            return state;
    }
}

module.exports = exports['default'];

},{"../../constants.js":6,"../action-types":9,"deep-freeze":15}],13:[function(require,module,exports){
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

},{"./gallery/reducer.js":12,"redux":"redux"}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvYmFja2VuZC9maWxlLWJhY2tlbmQuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvYm9vdC9pbmRleC5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb21wb25lbnRzL2J1bGstYWN0aW9ucy9pbmRleC5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb21wb25lbnRzL2ZpbGUvaW5kZXguanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvY29tcG9uZW50cy90ZXh0LWZpZWxkL2luZGV4LmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zZWN0aW9ucy9lZGl0b3IvY29udHJvbGxlci5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zZWN0aW9ucy9nYWxsZXJ5L2NvbnRyb2xsZXIuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvYWN0aW9uLXR5cGVzLmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiL1VzZXJzL3NodXRjaGluc29uL0RvY3VtZW50cy9TaXRlcy80L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL2dhbGxlcnkvYWN0aW9ucy5qcyIsIi9Vc2Vycy9zaHV0Y2hpbnNvbi9Eb2N1bWVudHMvU2l0ZXMvNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9nYWxsZXJ5L3JlZHVjZXIuanMiLCIvVXNlcnMvc2h1dGNoaW5zb24vRG9jdW1lbnRzL1NpdGVzLzQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvcmVkdWNlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2RlZXAtZnJlZXplL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LWxvZ2dlci9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQ0FjLFFBQVE7Ozs7c0JBQ0gsUUFBUTs7OztJQUVOLFdBQVc7V0FBWCxXQUFXOztBQUVwQixVQUZTLFdBQVcsQ0FFbkIsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRTt3QkFGbkYsV0FBVzs7QUFHOUIsNkJBSG1CLFdBQVcsNkNBR3RCOztBQUVSLE1BQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLE1BQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLE1BQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQy9CLE1BQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLE1BQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDOztBQUU1QixNQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztFQUNkOzs7Ozs7OztjQWZtQixXQUFXOztTQXNCMUIsZUFBQyxFQUFFLEVBQUU7OztBQUNULE9BQUksT0FBTyxFQUFFLEtBQUssV0FBVyxFQUFFO0FBQzlCLFdBQU87SUFDUDs7QUFFRCxPQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzs7QUFFZCxPQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQy9ELFVBQUssSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUM7R0FDSDs7O1NBRUssa0JBQUc7OztBQUNSLE9BQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDOztBQUVkLE9BQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDbkQsV0FBSyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUMsQ0FBQztHQUNIOzs7U0FFRyxnQkFBRzs7O0FBQ04sT0FBSSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVaLE9BQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDbkQsV0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQztHQUNIOzs7U0FFTyxrQkFBQyxNQUFNLEVBQUU7OztBQUNoQixPQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNkLE9BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixPQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWpDLE9BQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDbkQsV0FBSyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDO0dBQ0g7OztTQUVrQiw2QkFBQyxNQUFNLEVBQUU7QUFDM0IsT0FBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO0FBQzlCLFVBQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdDOztBQUVELE9BQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3pCOzs7U0FFSyxpQkFBQyxHQUFHLEVBQUU7OztBQUNYLE9BQUksYUFBYSxHQUFHLEVBQUUsQ0FBQzs7O0FBR3ZCLE9BQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLGdCQUFnQixFQUFFO0FBQzdELGlCQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLE1BQU07QUFDTixpQkFBYSxHQUFHLEdBQUcsQ0FBQztJQUNwQjs7QUFFRCxPQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3ZDLFNBQUssRUFBRSxhQUFhO0lBQ3BCLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTs7OztBQUliLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDakQsWUFBSyxJQUFJLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVDO0lBQ0QsQ0FBQyxDQUFDO0dBQ0g7OztTQUVLLGdCQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUU7QUFDdEUsT0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsT0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsT0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsT0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDL0IsT0FBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsT0FBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDOztBQUU3QyxPQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7R0FDZDs7O1NBRUcsY0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFOzs7QUFDaEIsT0FBSSxPQUFPLEdBQUcsRUFBRSxFQUFFLEVBQUYsRUFBRSxFQUFFLENBQUM7O0FBRXJCLFNBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDdkIsV0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQ2xDLENBQUMsQ0FBQzs7QUFFSCxPQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ3pELFdBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDO0dBQ0g7OztTQUVNLGlCQUFDLE1BQU0sRUFBRSxHQUFHLEVBQWE7OztPQUFYLElBQUkseURBQUcsRUFBRTs7QUFDN0IsT0FBSSxRQUFRLEdBQUc7QUFDZCxXQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUs7QUFDbkIsVUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJO0lBQ2pCLENBQUM7O0FBRUYsT0FBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ3pDLFlBQVEsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDOztBQUVELE9BQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUM3QyxZQUFRLENBQUMsTUFBTSxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsRDs7QUFFRCxPQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDdkQsWUFBUSxDQUFDLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUQ7O0FBRUQsT0FBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ25ELFlBQVEsQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hEOztBQUVELE9BQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDckUsWUFBUSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzFFOztBQUVELE9BQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDOztBQUU1QixVQUFPLG9CQUFFLElBQUksQ0FBQztBQUNiLFNBQUssRUFBRSxHQUFHO0FBQ1YsVUFBTSxFQUFFLE1BQU07QUFDZCxjQUFVLEVBQUUsTUFBTTtBQUNsQixVQUFNLEVBQUUsb0JBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUM7SUFDaEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFNO0FBQ2YsV0FBSyxvQkFBb0IsRUFBRSxDQUFDO0lBQzVCLENBQUMsQ0FBQztHQUNIOzs7U0FFbUIsZ0NBQUc7QUFDdEIsNEJBQUUsMEJBQTBCLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEQsNEJBQUUsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQzdDOzs7U0FFbUIsZ0NBQUc7QUFDdEIsNEJBQUUsMEJBQTBCLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckQsNEJBQUUsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0dBQzVDOzs7UUFoS21CLFdBQVc7OztxQkFBWCxXQUFXOzs7Ozs7OztzQkNIbEIsUUFBUTs7OztxQkFDSixPQUFPOzs7O3dCQUNKLFdBQVc7Ozs7MEJBQ1AsYUFBYTs7bUNBQ1gseUJBQXlCOzs7O3lDQUN2QixnQ0FBZ0M7Ozs7a0NBQ3JDLHlCQUF5Qjs7OztBQUVqRCxTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDckIsS0FBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUU1QyxLQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JCLE9BQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzVCOztBQUVELEtBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXBDLE1BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFDLE1BQUksTUFBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXBDLE1BQUksa0JBQWtCLENBQUMsTUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQzFDLFVBQU8sa0JBQWtCLENBQUMsTUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDcEM7RUFDRDs7QUFFRCxRQUFPLElBQUksQ0FBQztDQUNaOztBQUVELFNBQVMsaUJBQWlCLEdBQUc7QUFDNUIsUUFBTyxPQUFPLE1BQU0sQ0FBQyxjQUFjLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDO0NBQ3RGOztBQUVELFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUN4QixLQUFJLGlCQUFpQixHQUFHLHlCQUFFLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDO0tBQ25GLE9BQU8sR0FBRyx5QkFBRSxrQkFBa0IsQ0FBQztLQUMvQixhQUFhLEdBQUcseUJBQUUsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUM7S0FDeEUsYUFBYSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxhQUFhO0tBQ3BELE9BQU87S0FDUCxRQUFRLENBQUM7O0FBRVYsS0FBSSxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtBQUNoRSxTQUFPLENBQUMsTUFBTSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7RUFDM0Q7OztBQUdELEtBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxJQUFJLE9BQU8sS0FBSyxDQUFDLE9BQU8sS0FBSyxXQUFXLEVBQUU7QUFDekUsU0FBTyxHQUFHLG9DQUNULGlCQUFpQixDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxFQUNqRCxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsRUFDbEQsaUJBQWlCLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEVBQ2xELGlCQUFpQixDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxFQUNsRCxpQkFBaUIsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsRUFDN0MsaUJBQWlCLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLEVBQ3BELE9BQU8sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsRUFDL0MsYUFBYSxDQUNiLENBQUM7O0FBRUYsU0FBTyxDQUFDLElBQUksQ0FDWCxRQUFRLEVBQ1IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUNqQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFDeEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUNuQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFDeEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUN0QixNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FDOUIsQ0FBQztFQUNGOztBQUVELFNBQVEsR0FBRztBQUNWLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLGdCQUFjLEVBQUUsYUFBYTtBQUM3QixXQUFTLEVBQUUsRUFBRTtBQUNiLGdCQUFjLEVBQUUsYUFBYTtBQUM3QixNQUFJLEVBQUUseUJBQUUsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUM7RUFDcEQsQ0FBQzs7QUFFRixRQUFPLG9CQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0NBQ3ZDOztBQUVELElBQUksS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO0FBQ3ZCLElBQU0sS0FBSyxHQUFHLHVDQUFnQixDQUFDOztBQUcvQixzQkFBUyxNQUFNLENBQ1g7O0dBQVUsS0FBSyxFQUFFLEtBQUssQUFBQztDQUNuQix5RUFBc0IsS0FBSyxDQUFJO0NBQ3hCLEVBQ1gseUJBQUUsa0NBQWtDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDM0MsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQ3hGWSxRQUFROzs7O3FCQUNKLE9BQU87Ozs7d0JBQ0osV0FBVzs7OztxQ0FDRSx3QkFBd0I7Ozs7b0NBQy9CLHlCQUF5Qjs7OzswQkFDNUIsYUFBYTs7cUJBQ0YsT0FBTzs7bUNBQ1YsNkJBQTZCOztJQUFqRCxjQUFjOztvQkFDVCxNQUFNOzs7O0lBRUYsb0JBQW9CO1dBQXBCLG9CQUFvQjs7QUFFN0IsVUFGUyxvQkFBb0IsQ0FFNUIsS0FBSyxFQUFFO3dCQUZDLG9CQUFvQjs7QUFHdkMsNkJBSG1CLG9CQUFvQiw2Q0FHakMsS0FBSyxFQUFFOztBQUViLE1BQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbkQ7O2NBTm1CLG9CQUFvQjs7U0FRdkIsNkJBQUc7QUFDbkIsT0FBSSxPQUFPLEdBQUcseUJBQUUsc0JBQVMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU5RCxVQUFPLENBQUMsTUFBTSxDQUFDO0FBQ2QsMkJBQXVCLEVBQUUsSUFBSTtBQUM3Qiw4QkFBMEIsRUFBRSxFQUFFO0lBQzlCLENBQUMsQ0FBQzs7O0FBR0gsVUFBTyxDQUFDLE1BQU0sQ0FBQztXQUFNLGtDQUFlLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUFBLENBQUMsQ0FBQztHQUNsRjs7O1NBRUssa0JBQUc7OztBQUNSLFVBQU87O01BQUssU0FBUyxFQUFDLHlDQUF5QztJQUM5RDs7T0FBUSxTQUFTLEVBQUMsa0NBQWtDLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxvQkFBa0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQUFBQyxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsQUFBQztLQUN2Siw2Q0FBUSxRQUFRLE1BQUEsRUFBQyxRQUFRLE1BQUEsRUFBQyxNQUFNLE1BQUEsRUFBQyxLQUFLLEVBQUMsRUFBRSxHQUFVO0tBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLENBQUMsRUFBSztBQUMxRCxhQUFPOztTQUFRLEdBQUcsRUFBRSxDQUFDLEFBQUMsRUFBQyxPQUFPLEVBQUUsTUFBSyxhQUFhLEFBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQUFBQztPQUFFLE1BQU0sQ0FBQyxLQUFLO09BQVUsQ0FBQztNQUNqRyxDQUFDO0tBQ007SUFDSixDQUFDO0dBQ1A7OztTQUVlLDBCQUFDLEtBQUssRUFBRTs7OztBQUl2QixRQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMxRSxRQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRTtBQUM5RCxZQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakQ7SUFDRDs7QUFFRCxVQUFPLElBQUksQ0FBQztHQUNaOzs7U0FFa0IsNEJBQUc7QUFDZixVQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztHQUMzQzs7O1NBRU8scUJBQUMsS0FBSyxFQUFFOztBQUVsQixXQUFRLEtBQUs7QUFDWixTQUFLLFFBQVE7QUFDWixTQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sVUFBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7QUFBQSxBQUNwRDtBQUNDLFlBQU8sS0FBSyxDQUFDO0FBQUEsSUFDZDtHQUNEOzs7U0FFWSx1QkFBQyxLQUFLLEVBQUU7QUFDcEIsT0FBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7OztBQUd2RCxPQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDcEIsV0FBTztJQUNQOztBQUVELE9BQUksTUFBTSxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQUU7QUFDaEMsUUFBSSxPQUFPLENBQUMsa0JBQUssT0FBTyxDQUFDLGtCQUFLLEVBQUUsQ0FBQyx3Q0FBd0MsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQzNGLFNBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsTUFBTTtBQUNOLFFBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9COzs7QUFHRCw0QkFBRSxzQkFBUyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztHQUNqRjs7O1FBNUVtQixvQkFBb0I7OztxQkFBcEIsb0JBQW9CO0FBNkV4QyxDQUFDOztBQUVGLFNBQVMsZUFBZSxDQUFDLEtBQUssRUFBRTtBQUMvQixRQUFPO0FBQ04sU0FBTyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTztFQUNqQyxDQUFBO0NBQ0Q7O0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUU7QUFDckMsUUFBTztBQUNOLFNBQU8sRUFBRSwrQkFBbUIsY0FBYyxFQUFFLFFBQVEsQ0FBQztFQUNyRCxDQUFBO0NBQ0Q7O3FCQUVjLHlCQUFRLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQ3JHbkUsUUFBUTs7OztvQkFDTCxNQUFNOzs7O3FCQUNMLE9BQU87Ozs7d0JBQ0osV0FBVzs7OzswQkFDUixhQUFhOztxQkFDRixPQUFPOzttQ0FDViw2QkFBNkI7O0lBQWpELGNBQWM7O3lCQUNKLGlCQUFpQjs7OztxQ0FDTCx3QkFBd0I7Ozs7SUFFcEQsYUFBYTtXQUFiLGFBQWE7O0FBQ1AsVUFETixhQUFhLENBQ04sS0FBSyxFQUFFO3dCQURkLGFBQWE7O0FBRWpCLDZCQUZJLGFBQWEsNkNBRVgsS0FBSyxFQUFFOztBQUVQLE1BQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFLE1BQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckQsTUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxNQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELE1BQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNELE1BQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkQsTUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxNQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdDLE1BQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsTUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNqRDs7Y0FkSSxhQUFhOztTQWdCRCwyQkFBQyxLQUFLLEVBQUU7QUFDeEIsT0FBSSxLQUFLLENBQUMsTUFBTSxLQUFLLHNCQUFTLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssc0JBQVMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDekgsV0FBTztJQUNQOztBQUVELE9BQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDM0I7OztTQUVhLHdCQUFDLEtBQUssRUFBRTtBQUNyQixPQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtBQUNwQixRQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzVDLFdBQU87SUFDUDs7QUFFRCxPQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3ZCOzs7U0FFVyxzQkFBQyxLQUFLLEVBQUU7QUFDbkIsUUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUV4QixPQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNuRSxRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5QyxNQUFNO0FBQ04sUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEQ7R0FDRDs7O1NBRVMsb0JBQUMsS0FBSyxFQUFFOzs7QUFDakIsUUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtXQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssTUFBSyxLQUFLLENBQUMsRUFBRTtJQUFBLENBQUMsQ0FBQyxDQUFDO0dBQ2hHOzs7U0FFVyxzQkFBQyxLQUFLLEVBQUU7QUFDbkIsUUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLE9BQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7R0FDMUM7OztTQUVPLG9CQUFHO0FBQ1YsVUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUM7R0FDeEM7OztTQUVpQiw4QkFBRztBQUNwQixPQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtBQUNwQyxXQUFPLEVBQUMsaUJBQWlCLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBQyxDQUFDO0lBQzFEOztBQUVELFVBQU8sRUFBRSxDQUFDO0dBQ1Y7OztTQUVxQixrQ0FBRztBQUN4QixPQUFJLG1CQUFtQixHQUFHLGlCQUFpQixDQUFDOztBQUU1QyxPQUFJLElBQUksQ0FBQywwQkFBMEIsRUFBRSxFQUFFO0FBQ3RDLHVCQUFtQixJQUFJLHlCQUF5QixDQUFDO0lBQ2pEOztBQUVELFVBQU8sbUJBQW1CLENBQUM7R0FDM0I7OztTQUVTLHNCQUFHO0FBQ1osVUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDcEU7OztTQUVZLHNCQUFHO0FBQ1QsVUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7R0FDckQ7OztTQUVnQiw2QkFBRztBQUNoQixPQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUNuQixXQUFPLENBQUMsQ0FBQztJQUNaLE1BQU07QUFDSCxXQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2I7R0FDSjs7O1NBRWEsNkJBQUc7QUFDbkIsT0FBSSxjQUFjLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDOztBQUV6RCxPQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN0QixrQkFBYyxJQUFJLGlCQUFpQixDQUFDO0lBQ3BDOztBQUVELE9BQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3RCLGtCQUFjLElBQUksaUJBQWlCLENBQUM7SUFDcEM7O0FBRUQsVUFBTyxjQUFjLENBQUM7R0FDdEI7OztTQUV5QixzQ0FBRztBQUM1QixPQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7O0FBRWxELFVBQU8sVUFBVSxDQUFDLE1BQU0sR0FBRyx1QkFBVSxnQkFBZ0IsSUFBSSxVQUFVLENBQUMsS0FBSyxHQUFHLHVCQUFVLGVBQWUsQ0FBQztHQUN0Rzs7O1NBRVksdUJBQUMsS0FBSyxFQUFFO0FBQ3BCLFFBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7O0FBR3hCLE9BQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxzQkFBUyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUMvRCxXQUFPO0lBQ1A7OztBQUdELE9BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUMxQyxTQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsNkJBQUUsc0JBQVMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDN0U7OztBQUdELE9BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUMzQyxRQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCO0dBQ0Q7OztTQUVVLHVCQUFHO0FBQ1AsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7R0FDakQ7OztTQUVTLHNCQUFHO0FBQ04sT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3pDOzs7U0FFVyxzQkFBQyxLQUFLLEVBQUU7O0FBRW5CLFFBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztHQUN2Qjs7O1NBRUssa0JBQUc7QUFDUixPQUFJLFlBQVksQ0FBQztBQUNqQixPQUFJLFlBQVksQ0FBQztBQUNqQixPQUFJLFVBQVUsQ0FBQzs7QUFFZixlQUFZLEdBQUc7QUFDZCxhQUFTLEVBQUMsd0VBQXdFO0FBQ2xGLFFBQUksRUFBQyxRQUFRO0FBQ2IsU0FBSyxFQUFFLGtCQUFLLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxBQUFDO0FBQzNDLFlBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQUFBQztBQUNuQyxXQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQztBQUMzQixXQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQUFBQztBQUMxQixVQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQyxHQUNoQixDQUFDOztBQUVWLE9BQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDeEIsZ0JBQVksR0FBRztBQUNkLGNBQVMsRUFBQyx5RUFBeUU7QUFDbkYsU0FBSSxFQUFDLFFBQVE7QUFDYixVQUFLLEVBQUUsa0JBQUssRUFBRSxDQUFDLDBCQUEwQixDQUFDLEFBQUM7QUFDM0MsYUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxBQUFDO0FBQ25DLFlBQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxBQUFDO0FBQzNCLFlBQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxBQUFDO0FBQzFCLFdBQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxBQUFDLEdBQ2hCLENBQUM7SUFDVjs7QUFFRCxPQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3RCLGNBQVUsR0FBRztBQUNaLGNBQVMsRUFBQyxzRUFBc0U7QUFDaEYsU0FBSSxFQUFDLFFBQVE7QUFDYixVQUFLLEVBQUUsa0JBQUssRUFBRSxDQUFDLHdCQUF3QixDQUFDLEFBQUM7QUFDekMsYUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxBQUFDO0FBQ25DLFlBQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxBQUFDO0FBQ3pCLFlBQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxBQUFDO0FBQzFCLFdBQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxBQUFDLEdBQ2hCLENBQUM7SUFDVjs7QUFFRCxVQUFPOztNQUFLLFNBQVMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQUFBQyxFQUFDLFdBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEFBQUMsRUFBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixBQUFDO0lBQzlHOztPQUFLLEdBQUcsRUFBQyxXQUFXLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxBQUFDLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQUFBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQUFBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxBQUFDLEVBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUM7S0FDdk07O1FBQUssU0FBUyxFQUFDLGVBQWU7TUFDNUIsWUFBWTtNQUNaLFlBQVk7TUFDWixVQUFVO01BQ047S0FDRDtJQUNOOztPQUFHLFNBQVMsRUFBQyxhQUFhLEVBQUMsR0FBRyxFQUFDLE9BQU87S0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7S0FBSztJQUN4RCxDQUFDO0dBQ1A7OztRQWpNSSxhQUFhOzs7QUFvTW5CLGFBQWEsQ0FBQyxTQUFTLEdBQUc7QUFDekIsR0FBRSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzFCLE1BQUssRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUM3QixTQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDaEMsSUFBRyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzNCLFdBQVUsRUFBRSxtQkFBTSxTQUFTLENBQUMsS0FBSyxDQUFDO0FBQ2pDLE9BQUssRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUM3QixRQUFNLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07RUFDOUIsQ0FBQztBQUNGLGVBQWMsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNwQyxXQUFVLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDaEMsYUFBWSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ2xDLFNBQVEsRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUNoQyxVQUFTLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDakMsYUFBWSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ2xDLFNBQVEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUM5QixRQUFPLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDN0IsVUFBUyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0NBQy9CLENBQUM7O0FBRUYsU0FBUyxlQUFlLENBQUMsS0FBSyxFQUFFO0FBQy9CLFFBQU87QUFDTixTQUFPLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPO0VBQ2pDLENBQUE7Q0FDRDs7QUFFRCxTQUFTLGtCQUFrQixDQUFDLFFBQVEsRUFBRTtBQUNyQyxRQUFPO0FBQ04sU0FBTyxFQUFFLCtCQUFtQixjQUFjLEVBQUUsUUFBUSxDQUFDO0VBQ3JELENBQUE7Q0FDRDs7cUJBRWMseUJBQVEsZUFBZSxFQUFFLGtCQUFrQixDQUFDLENBQUMsYUFBYSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkM5T3hELE9BQU87Ozs7cUNBQ1Msd0JBQXdCOzs7O0lBRXJDLGtCQUFrQjtjQUFsQixrQkFBa0I7O0FBQ3hCLGFBRE0sa0JBQWtCLENBQ3ZCLEtBQUssRUFBRTs4QkFERixrQkFBa0I7O0FBRS9CLG1DQUZhLGtCQUFrQiw2Q0FFekIsS0FBSyxFQUFFOztBQUViLFlBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEQ7O2lCQUxnQixrQkFBa0I7O2VBTTdCLGtCQUFHO0FBQ0wsbUJBQU87O2tCQUFLLFNBQVMsRUFBQyxZQUFZO2dCQUM5Qjs7c0JBQU8sU0FBUyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxBQUFDO29CQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztpQkFBUztnQkFDekY7O3NCQUFLLFNBQVMsRUFBQyxjQUFjO29CQUN6QjtBQUNJLDBCQUFFLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxBQUFDO0FBQ2pDLGlDQUFTLEVBQUMsTUFBTTtBQUNoQiw0QkFBSSxFQUFDLE1BQU07QUFDWCw0QkFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxBQUFDO0FBQ3RCLGdDQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQUFBQztBQUM1Qiw2QkFBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxBQUFDLEdBQUc7aUJBQzdCO2FBQ0osQ0FBQTtTQUNUOzs7ZUFFVyxzQkFBQyxLQUFLLEVBQUU7QUFDaEIsZ0JBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDekI7OztXQXZCZ0Isa0JBQWtCOzs7cUJBQWxCLGtCQUFrQjs7QUEwQnZDLGtCQUFrQixDQUFDLFNBQVMsR0FBRztBQUMzQixTQUFLLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ3hDLFFBQUksRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDdkMsU0FBSyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVTtBQUN4QyxZQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVO0NBQzVDLENBQUM7Ozs7Ozs7Ozs7OztvQkNsQ2UsTUFBTTs7OztxQkFFUjtBQUNkLG1CQUFrQixFQUFFLEdBQUc7QUFDdkIsa0JBQWlCLEVBQUUsR0FBRztBQUN0QixpQkFBZ0IsRUFBRSxFQUFFO0FBQ3BCLGtCQUFpQixFQUFFLEVBQUU7QUFDckIsZUFBYyxFQUFFLENBQ2Y7QUFDQyxPQUFLLEVBQUUsUUFBUTtBQUNmLE9BQUssRUFBRSxrQkFBSyxFQUFFLENBQUMsdUNBQXVDLENBQUM7QUFDdkQsYUFBVyxFQUFFLElBQUk7RUFDakIsQ0FDRDtBQUNFLDJCQUEwQixFQUFFLGtCQUFLLEVBQUUsQ0FBQyw0Q0FBNEMsQ0FBQztDQUNwRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkNmYSxRQUFROzs7O29CQUNMLE1BQU07Ozs7cUJBQ0wsT0FBTzs7OztxQ0FDUyx3QkFBd0I7Ozs7MEJBQ2xDLGFBQWE7O3FCQUNGLE9BQU87O21DQUNWLDZCQUE2Qjs7SUFBakQsY0FBYzs7d0NBQ0ssbUNBQW1DOzs7O0lBRTVELGVBQWU7V0FBZixlQUFlOztBQUNULFVBRE4sZUFBZSxDQUNSLEtBQUssRUFBRTt3QkFEZCxlQUFlOztBQUVuQiw2QkFGSSxlQUFlLDZDQUViLEtBQUssRUFBRTs7QUFFYixNQUFJLENBQUMsTUFBTSxHQUFHLENBQ2I7QUFDQyxVQUFPLEVBQUUsT0FBTztBQUNoQixTQUFNLEVBQUUsT0FBTztBQUNmLFVBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLO0dBQzlCLEVBQ0Q7QUFDQyxVQUFPLEVBQUUsVUFBVTtBQUNuQixTQUFNLEVBQUUsVUFBVTtBQUNsQixVQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUTtHQUNqQyxDQUNELENBQUM7O0FBRUYsTUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCxNQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdDLE1BQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDekM7O2NBcEJJLGVBQWU7O1NBc0JILDZCQUFHO0FBQ25CLDhCQXZCSSxlQUFlLG1EQXVCTzs7QUFFMUIsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUNoRDs7O1NBRW1CLGdDQUFHO0FBQ3RCLDhCQTdCSSxlQUFlLHNEQTZCVTs7QUFFN0IsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7R0FDckM7OztTQUVZLHVCQUFDLEtBQUssRUFBRTtBQUNwQixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztBQUNwQyxRQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJO0FBQ3ZCLFNBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUs7SUFDekIsQ0FBQyxDQUFDO0dBQ0g7OztTQUVTLG9CQUFDLEtBQUssRUFBRTtBQUNqQixPQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQ2xGOzs7U0FFTyxrQkFBQyxLQUFLLEVBQUU7QUFDZixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDckM7OztTQUVLLGtCQUFHOzs7QUFDUixVQUFPOztNQUFLLFNBQVMsRUFBQyxRQUFRO0lBQzdCOztPQUFLLFNBQVMsRUFBQyxnREFBZ0Q7S0FDOUQ7O1FBQUssU0FBUyxFQUFDLHdEQUF3RDtNQUN0RSwwQ0FBSyxTQUFTLEVBQUMsbUJBQW1CLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQUFBQyxHQUFHO01BQzFEO0tBQ047O1FBQUssU0FBUyxFQUFDLHFEQUFxRDtNQUNuRTs7U0FBSyxTQUFTLEVBQUMsa0NBQWtDO09BQ2hEOztVQUFLLFNBQVMsRUFBQyxnQkFBZ0I7UUFDOUI7O1dBQU8sU0FBUyxFQUFDLE1BQU07U0FBRSxrQkFBSyxFQUFFLENBQUMsd0JBQXdCLENBQUM7O1NBQVU7UUFDcEU7O1dBQUssU0FBUyxFQUFDLGNBQWM7U0FDNUI7O1lBQU0sU0FBUyxFQUFDLFVBQVU7VUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJO1VBQVE7U0FDbkQ7UUFDRDtPQUNEO01BQ047O1NBQUssU0FBUyxFQUFDLGdCQUFnQjtPQUM5Qjs7VUFBTyxTQUFTLEVBQUMsTUFBTTtRQUFFLGtCQUFLLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQzs7UUFBVTtPQUNwRTs7VUFBSyxTQUFTLEVBQUMsY0FBYztRQUM1Qjs7V0FBTSxTQUFTLEVBQUMsVUFBVTtTQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7U0FBUTtRQUNuRDtPQUNEO01BQ047O1NBQUssU0FBUyxFQUFDLGdCQUFnQjtPQUM5Qjs7VUFBTyxTQUFTLEVBQUMsTUFBTTtRQUFFLGtCQUFLLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQzs7UUFBVTtPQUNuRTs7VUFBSyxTQUFTLEVBQUMsY0FBYztRQUM1Qjs7V0FBTSxTQUFTLEVBQUMsVUFBVTtTQUN6Qjs7WUFBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxBQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVE7VUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHO1VBQUs7U0FDakU7UUFDRjtPQUNEO01BQ047O1NBQUssU0FBUyxFQUFDLDhCQUE4QjtPQUM1Qzs7VUFBTyxTQUFTLEVBQUMsTUFBTTtRQUFFLGtCQUFLLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQzs7UUFBVTtPQUN2RTs7VUFBSyxTQUFTLEVBQUMsY0FBYztRQUM1Qjs7V0FBTSxTQUFTLEVBQUMsVUFBVTtTQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87U0FBUTtRQUN0RDtPQUNEO01BQ047O1NBQUssU0FBUyxFQUFDLDhCQUE4QjtPQUM1Qzs7VUFBTyxTQUFTLEVBQUMsTUFBTTtRQUFFLGtCQUFLLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQzs7UUFBVTtPQUN4RTs7VUFBSyxTQUFTLEVBQUMsY0FBYztRQUM1Qjs7V0FBTSxTQUFTLEVBQUMsVUFBVTtTQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVc7U0FBUTtRQUMxRDtPQUNEO01BQ047O1NBQUssU0FBUyxFQUFDLGdCQUFnQjtPQUM5Qjs7VUFBTyxTQUFTLEVBQUMsTUFBTTtRQUFFLGtCQUFLLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQzs7UUFBVTtPQUNuRTs7VUFBSyxTQUFTLEVBQUMsY0FBYztRQUM1Qjs7V0FBTSxTQUFTLEVBQUMsVUFBVTtTQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSzs7U0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU07O1NBQVU7UUFDN0g7T0FDRDtNQUNEO0tBQ0Q7SUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUMsRUFBSztBQUNsRCxZQUFPO0FBQ0wsU0FBRyxFQUFFLENBQUMsQUFBQztBQUNQLFdBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxBQUFDO0FBQ25CLFVBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxBQUFDO0FBQ2pCLFdBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxBQUFDO0FBQ25CLGNBQVEsRUFBRSxNQUFLLGFBQWEsQUFBQyxHQUFHLENBQUE7S0FDbEMsQ0FBQztJQUNGOzs7S0FDQzs7O0FBQ0MsV0FBSSxFQUFDLFFBQVE7QUFDYixnQkFBUyxFQUFDLHNGQUFzRjtBQUNoRyxjQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQztNQUN4QixrQkFBSyxFQUFFLENBQUMsd0JBQXdCLENBQUM7TUFDMUI7S0FDVDs7O0FBQ0MsV0FBSSxFQUFDLFFBQVE7QUFDYixnQkFBUyxFQUFDLDBGQUEwRjtBQUNwRyxjQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQUFBQztNQUN0QixrQkFBSyxFQUFFLENBQUMsMEJBQTBCLENBQUM7TUFDNUI7S0FDSjtJQUNELENBQUM7R0FDUDs7O1FBekhJLGVBQWU7OztBQTRIckIsZUFBZSxDQUFDLFNBQVMsR0FBRztBQUMzQixLQUFJLEVBQUUsbUJBQU0sU0FBUyxDQUFDLEtBQUssQ0FBQztBQUMzQixJQUFFLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDMUIsT0FBSyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzdCLFVBQVEsRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUNoQyxLQUFHLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDM0IsTUFBSSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzVCLFNBQU8sRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUMvQixhQUFXLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDbkMsWUFBVSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFDakMsUUFBSyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzdCLFNBQU0sRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtHQUM5QixDQUFDO0VBQ0YsQ0FBQztBQUNGLFdBQVUsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNoQyxTQUFRLEVBQUMsbUJBQU0sU0FBUyxDQUFDLElBQUk7Q0FDN0IsQ0FBQzs7QUFFRixTQUFTLGVBQWUsQ0FBQyxLQUFLLEVBQUU7QUFDL0IsUUFBTztBQUNOLFNBQU8sRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU87RUFDakMsQ0FBQTtDQUNEOztBQUVELFNBQVMsa0JBQWtCLENBQUMsUUFBUSxFQUFFO0FBQ3JDLFFBQU87QUFDTixTQUFPLEVBQUUsK0JBQW1CLGNBQWMsRUFBRSxRQUFRLENBQUM7RUFDckQsQ0FBQTtDQUNEOztxQkFFYyx5QkFBUSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkNuSzlELFFBQVE7Ozs7b0JBQ0wsTUFBTTs7OztxQkFDTCxPQUFPOzs7O3dCQUNKLFdBQVc7Ozs7MEJBQ1IsYUFBYTs7cUJBQ0YsT0FBTzs7b0NBQ2YseUJBQXlCOzs7O21DQUMxQiw2QkFBNkI7Ozs7a0NBQzNCLHlCQUF5Qjs7OzswQ0FDcEIscUNBQXFDOzs7O3FDQUNwQyx3QkFBd0I7Ozs7eUJBQ3BDLGlCQUFpQjs7OzttQ0FDUCw2QkFBNkI7O0lBQWpELGNBQWM7O0FBRTFCLFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7QUFDeEMsUUFBTyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDaEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3RDLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFFdEMsTUFBSSxTQUFTLEtBQUssS0FBSyxFQUFFO0FBQ3hCLE9BQUksTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUNwQixXQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ1Y7O0FBRUQsT0FBSSxNQUFNLEdBQUcsTUFBTSxFQUFFO0FBQ3BCLFdBQU8sQ0FBQyxDQUFDO0lBQ1Q7R0FDRCxNQUFNO0FBQ04sT0FBSSxNQUFNLEdBQUcsTUFBTSxFQUFFO0FBQ3BCLFdBQU8sQ0FBQyxDQUFDLENBQUM7SUFDVjs7QUFFRCxPQUFJLE1BQU0sR0FBRyxNQUFNLEVBQUU7QUFDcEIsV0FBTyxDQUFDLENBQUM7SUFDVDtHQUNEOztBQUVELFNBQU8sQ0FBQyxDQUFDO0VBQ1QsQ0FBQztDQUNGOztJQUVLLGdCQUFnQjtXQUFoQixnQkFBZ0I7O0FBRVYsVUFGTixnQkFBZ0IsQ0FFVCxLQUFLLEVBQUU7d0JBRmQsZ0JBQWdCOztBQUdwQiw2QkFISSxnQkFBZ0IsNkNBR2QsS0FBSyxFQUFFOztBQUViLE1BQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXRDLE1BQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ25CLE1BQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOztBQUV2QixNQUFJLENBQUMsT0FBTyxHQUFHLENBQ2Q7QUFDQyxRQUFLLEVBQUUsT0FBTztBQUNkLFlBQVMsRUFBRSxLQUFLO0FBQ2hCLFFBQUssRUFBRSxrQkFBSyxFQUFFLENBQUMsb0NBQW9DLENBQUM7R0FDcEQsRUFDRDtBQUNDLFFBQUssRUFBRSxPQUFPO0FBQ2QsWUFBUyxFQUFFLE1BQU07QUFDakIsUUFBSyxFQUFFLGtCQUFLLEVBQUUsQ0FBQyxxQ0FBcUMsQ0FBQztHQUNyRCxFQUNEO0FBQ0MsUUFBSyxFQUFFLFNBQVM7QUFDaEIsWUFBUyxFQUFFLE1BQU07QUFDakIsUUFBSyxFQUFFLGtCQUFLLEVBQUUsQ0FBQyxvQ0FBb0MsQ0FBQztHQUNwRCxFQUNEO0FBQ0MsUUFBSyxFQUFFLFNBQVM7QUFDaEIsWUFBUyxFQUFFLEtBQUs7QUFDaEIsUUFBSyxFQUFFLGtCQUFLLEVBQUUsQ0FBQyxtQ0FBbUMsQ0FBQztHQUNuRCxDQUNELENBQUM7OztBQUdGLE1BQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsTUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxNQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELE1BQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckQsTUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxNQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7QUFHakQsTUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxNQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JELE1BQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsTUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxNQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLE1BQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsTUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3Qzs7Y0FqREksZ0JBQWdCOztTQW1ESiw2QkFBRztBQUNuQiw4QkFwREksZ0JBQWdCLG1EQW9ETTs7QUFFMUIsT0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRTtBQUM1RCxRQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDM0MsTUFBTTtBQUNOLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCOztBQUVELE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZELE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JELE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pELE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDN0QsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDckQsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXpELE9BQUksT0FBTyxHQUFHLHlCQUFFLHNCQUFTLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOzs7O0FBSTdFLFVBQU8sQ0FBQyxNQUFNLENBQUM7QUFDZCwyQkFBdUIsRUFBRSxJQUFJO0FBQzdCLDhCQUEwQixFQUFFLEVBQUU7SUFDOUIsQ0FBQyxDQUFDOzs7QUFHSCxVQUFPLENBQUMsTUFBTSxDQUFDO1dBQU0sa0NBQWUsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQUEsQ0FBQyxDQUFDO0dBQ2xGOzs7U0FFbUIsZ0NBQUc7QUFDdEIsOEJBakZJLGdCQUFnQixzREFpRlM7O0FBRTdCLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25FLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3JFLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekUsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakUsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDckU7Ozs7Ozs7OztTQU9TLG9CQUFDLEtBQUssRUFBRTtBQUNqQixPQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNsQyxPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7R0FDeEU7OztTQUVVLHFCQUFDLEVBQUUsRUFBRTtBQUNmLE9BQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM1RCxRQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQzFDLFdBQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsV0FBTTtLQUNOO0lBQ0Q7O0FBRUQsVUFBTyxNQUFNLENBQUM7R0FDZDs7O1NBRWUsNEJBQUc7QUFDbEIsT0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO0FBQ2pDLFdBQU87O09BQUcsU0FBUyxFQUFDLHlCQUF5QjtLQUFFLGtCQUFLLEVBQUUsQ0FBQyxnQ0FBZ0MsQ0FBQztLQUFLLENBQUM7SUFDOUY7O0FBRUQsVUFBTyxJQUFJLENBQUM7R0FDWjs7O1NBRVkseUJBQUc7QUFDZixPQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUM1QixXQUFPO0FBQ04sY0FBUyxFQUFDLDBHQUEwRztBQUNwSCxZQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQUFBQztBQUMxQixRQUFHLEVBQUMsWUFBWSxHQUFVLENBQUM7SUFDNUI7O0FBRUQsVUFBTyxJQUFJLENBQUM7R0FDWjs7O1NBRXNCLG1DQUFHO0FBQ3pCLE9BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO0FBQ2xGLFdBQU87QUFDTixZQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEFBQUMsR0FBRyxDQUFDO0lBQ2pDOztBQUVELFVBQU8sSUFBSSxDQUFDO0dBQ1o7OztTQUVZLHlCQUFHO0FBQ2YsT0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUMvRCxXQUFPOzs7QUFDTixlQUFTLEVBQUMscUJBQXFCO0FBQy9CLGFBQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxBQUFDO0tBQUUsa0JBQUssRUFBRSxDQUFDLDRCQUE0QixDQUFDO0tBQVUsQ0FBQztJQUM3RTs7QUFFRCxVQUFPLElBQUksQ0FBQztHQUNaOzs7U0FFSyxrQkFBRzs7O0FBQ1IsT0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFO0FBQ3pDLFdBQU87O09BQUssU0FBUyxFQUFDLFNBQVM7S0FDOUI7QUFDQyxVQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxBQUFDO0FBQ2pDLGdCQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQztBQUM1QixjQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQUFBQyxHQUFHO0tBQ3ZCLENBQUM7SUFDUDs7QUFFRCxVQUFPOztNQUFLLFNBQVMsRUFBQyxTQUFTO0lBQzdCLElBQUksQ0FBQyxhQUFhLEVBQUU7SUFDcEIsSUFBSSxDQUFDLHVCQUF1QixFQUFFO0lBQy9COztPQUFLLFNBQVMsRUFBQyxpQ0FBaUM7S0FDL0M7O1FBQVEsU0FBUyxFQUFDLGtDQUFrQyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxBQUFDO01BQ3hGLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLENBQUMsRUFBSztBQUNoQyxjQUFPOzs7QUFDTCxZQUFHLEVBQUUsQ0FBQyxBQUFDO0FBQ1AsZ0JBQU8sRUFBRSxNQUFLLFVBQVUsQUFBQztBQUN6Qix1QkFBWSxNQUFNLENBQUMsS0FBSyxBQUFDO0FBQ3pCLDJCQUFnQixNQUFNLENBQUMsU0FBUyxBQUFDO1FBQUUsTUFBTSxDQUFDLEtBQUs7UUFBVSxDQUFDO09BQzVELENBQUM7TUFDTTtLQUNKO0lBQ047O09BQUssU0FBUyxFQUFDLGdCQUFnQjtLQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxFQUFFLENBQUMsRUFBSztBQUMxQyxhQUFPLDhFQUFlLEdBQUcsRUFBRSxDQUFDLEFBQUMsSUFBSyxJQUFJO0FBQ3JDLGVBQVEsRUFBRSx1QkFBVSxjQUFjLEFBQUM7QUFDbkMsZ0JBQVMsRUFBRSx1QkFBVSxlQUFlLEFBQUM7QUFDckMsbUJBQVksRUFBRSxNQUFLLFlBQVksQUFBQztBQUNoQyxxQkFBYyxFQUFFLE1BQUssY0FBYyxBQUFDLElBQUcsQ0FBQztNQUN6QyxDQUFDO0tBQ0c7SUFDTCxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7SUFDeEI7O09BQUssU0FBUyxFQUFDLGVBQWU7S0FDNUIsSUFBSSxDQUFDLGFBQWEsRUFBRTtLQUNoQjtJQUNELENBQUM7R0FDUDs7O1NBRVUscUJBQUMsSUFBSSxFQUFFO0FBQ2pCLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNuRDs7O1NBRVMsb0JBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUN0QixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckMsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztHQUN0Rjs7O1NBRVcsc0JBQUMsSUFBSSxFQUFFO0FBQ2xCLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNwQzs7O1NBRWEsd0JBQUMsSUFBSSxFQUFFOztBQUVwQixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNoQyxPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDbkQ7OztTQUVTLG9CQUFDLElBQUksRUFBRTtBQUNoQixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3BGOzs7U0FFVyxzQkFBQyxJQUFJLEVBQUU7QUFDbEIsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ25EOzs7U0FFVyxzQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3pCLE9BQUksT0FBTyxDQUFDLGtCQUFLLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLEVBQUU7QUFDeEQsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLFVBQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkM7O0FBRUQsUUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0dBQ3hCOzs7U0FFYSx3QkFBQyxJQUFJLEVBQUU7QUFDcEIsT0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTNDLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO0dBQ25DOzs7U0FFUyxvQkFBQyxNQUFNLEVBQWtCO09BQWhCLE1BQU0seURBQUcsS0FBSzs7O0FBRWhDLE9BQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDeEMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUI7O0FBRUQsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3BDOzs7U0FFVSxxQkFBQyxLQUFLLEVBQUU7QUFDbEIsUUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUV4QixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFMUIsUUFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0dBQ3ZCOzs7U0FFVSxxQkFBQyxLQUFLLEVBQUU7QUFDbEIsT0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDNUIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25FOztBQUVELE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUVuQyxRQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7R0FDdkI7OztTQUVTLG9CQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzVCLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRW5DLFFBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4QixRQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7R0FDdkI7OztRQTNRSSxnQkFBZ0I7OztBQThRdEIsZ0JBQWdCLENBQUMsU0FBUyxHQUFHO0FBQzVCLFFBQU8sRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7Q0FDMUMsQ0FBQzs7QUFFRixTQUFTLGVBQWUsQ0FBQyxLQUFLLEVBQUU7QUFDL0IsUUFBTztBQUNOLFNBQU8sRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU87RUFDakMsQ0FBQTtDQUNEOztBQUVELFNBQVMsa0JBQWtCLENBQUMsUUFBUSxFQUFFO0FBQ3JDLFFBQU87QUFDTixTQUFPLEVBQUUsK0JBQW1CLGNBQWMsRUFBRSxRQUFRLENBQUM7RUFDckQsQ0FBQTtDQUNEOztxQkFFYyx5QkFBUSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7O0FDdlV0RSxJQUFNLE9BQU8sR0FBRztBQUNuQixZQUFRLEVBQUUsVUFBVTtBQUNwQixlQUFXLEVBQUUsYUFBYTtBQUMxQixlQUFXLEVBQUUsYUFBYTtBQUMxQixnQkFBWSxFQUFFLGNBQWM7QUFDNUIsa0JBQWMsRUFBRSxnQkFBZ0I7QUFDaEMsZUFBVyxFQUFFLGFBQWE7QUFDMUIsYUFBUyxFQUFFLFdBQVc7QUFDdEIscUJBQWlCLEVBQUUsbUJBQW1CO0FBQ3RDLHVCQUFtQixFQUFFLHFCQUFxQjtBQUMxQyxjQUFVLEVBQUUsWUFBWTtDQUMzQixDQUFDOzs7Ozs7Ozs7Ozs7O3FCQ2VzQixjQUFjOzs7O3FCQXRCTyxPQUFPOzswQkFDeEIsYUFBYTs7Ozs7OzJCQUNoQixjQUFjOzs7Ozs7dUJBQ2YsV0FBVzs7Ozs7Ozs7Ozs7QUFTbkMsSUFBTSx5QkFBeUIsR0FBRyxxREFFakMsK0JBQWMsQ0FDZCxvQkFBYSxDQUFDOzs7Ozs7OztBQU9BLFNBQVMsY0FBYyxHQUFvQjtNQUFuQixZQUFZLHlEQUFHLEVBQUU7O0FBQ3ZELE1BQU0sS0FBSyxHQUFHLHlCQUF5Qix1QkFBYyxZQUFZLENBQUMsQ0FBQzs7QUFFbkUsU0FBTyxLQUFLLENBQUM7Q0FDYjs7QUFBQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkM5QnNCLGlCQUFpQjs7Ozs7Ozs7O0FBUWxDLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDakMsV0FBTyxVQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUs7QUFDM0IsZUFBTyxRQUFRLENBQUU7QUFDYixnQkFBSSxFQUFFLHFCQUFRLFFBQVE7QUFDdEIsbUJBQU8sRUFBRSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRTtTQUMzQixDQUFDLENBQUM7S0FDTixDQUFBO0NBQ0o7Ozs7Ozs7O0FBT00sU0FBUyxVQUFVLENBQUMsRUFBRSxFQUFFO0FBQzNCLFdBQU8sVUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFLO0FBQzNCLGVBQU8sUUFBUSxDQUFFO0FBQ2IsZ0JBQUksRUFBRSxxQkFBUSxXQUFXO0FBQ3pCLG1CQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUYsRUFBRSxFQUFFO1NBQ2xCLENBQUMsQ0FBQztLQUNOLENBQUE7Q0FDSjs7Ozs7Ozs7O0FBUU0sU0FBUyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUNwQyxXQUFPLFVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBSztBQUMzQixlQUFPLFFBQVEsQ0FBQztBQUNaLGdCQUFJLEVBQUUscUJBQVEsV0FBVztBQUN6QixtQkFBTyxFQUFFLEVBQUUsRUFBRSxFQUFGLEVBQUUsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFO1NBQzNCLENBQUMsQ0FBQztLQUNOLENBQUE7Q0FDSjs7Ozs7Ozs7QUFPTSxTQUFTLFdBQVcsR0FBYTtRQUFaLEdBQUcseURBQUcsSUFBSTs7QUFDbEMsV0FBTyxVQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUs7QUFDM0IsZUFBTyxRQUFRLENBQUM7QUFDWixnQkFBSSxFQUFFLHFCQUFRLFlBQVk7QUFDMUIsbUJBQU8sRUFBRSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUU7U0FDbkIsQ0FBQyxDQUFDO0tBQ04sQ0FBQTtDQUNKOzs7Ozs7OztBQU9NLFNBQVMsYUFBYSxHQUFhO1FBQVosR0FBRyx5REFBRyxJQUFJOztBQUNwQyxXQUFPLFVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBSztBQUMzQixlQUFPLFFBQVEsQ0FBQztBQUNaLGdCQUFJLEVBQUUscUJBQVEsY0FBYztBQUM1QixtQkFBTyxFQUFFLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRTtTQUNuQixDQUFDLENBQUM7S0FDTixDQUFBO0NBQ0o7Ozs7Ozs7O0FBT00sU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQzdCLFdBQU8sVUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFLO0FBQzNCLGVBQU8sUUFBUSxDQUFDO0FBQ1osZ0JBQUksRUFBRSxxQkFBUSxXQUFXO0FBQ3pCLG1CQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFO1NBQ3BCLENBQUMsQ0FBQztLQUNOLENBQUE7Q0FDSjs7Ozs7Ozs7QUFPTSxTQUFTLFFBQVEsQ0FBQyxFQUFFLEVBQUU7QUFDekIsV0FBTyxVQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUs7QUFDM0IsZUFBTyxRQUFRLENBQUM7QUFDWixnQkFBSSxFQUFFLHFCQUFRLFNBQVM7QUFDdkIsbUJBQU8sRUFBRTtBQUNMLGtCQUFFLEVBQUYsRUFBRTthQUNMO1NBQ0osQ0FBQyxDQUFDO0tBQ04sQ0FBQTtDQUNKOzs7Ozs7OztBQU9NLFNBQVMsZUFBZSxHQUFvQjtRQUFuQixZQUFZLHlEQUFHLEVBQUU7O0FBQzdDLFdBQU8sVUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFLO0FBQ2pDLGVBQU8sUUFBUSxDQUFFO0FBQ2hCLGdCQUFJLEVBQUUscUJBQVEsaUJBQWlCO0FBQy9CLG1CQUFPLEVBQUUsRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFO1NBQ3pCLENBQUMsQ0FBQztLQUNILENBQUE7Q0FDRDs7Ozs7Ozs7Ozs7QUFVTSxTQUFTLGlCQUFpQixDQUFDLE9BQU8sRUFBRTtBQUN2QyxXQUFPLFVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBSztBQUNqQyxlQUFPLFFBQVEsQ0FBRTtBQUNoQixnQkFBSSxFQUFFLHFCQUFRLG1CQUFtQjtBQUNqQyxtQkFBTyxFQUFFLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRTtTQUNwQixDQUFDLENBQUM7S0FDSCxDQUFBO0NBQ0Q7Ozs7Ozs7O0FBT00sU0FBUyxTQUFTLENBQUMsVUFBVSxFQUFFO0FBQ2xDLFdBQU8sVUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFLO0FBQzNCLGVBQU8sUUFBUSxDQUFDO0FBQ1osZ0JBQUksRUFBRSxxQkFBUSxVQUFVO0FBQ3hCLG1CQUFPLEVBQUUsRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFFO1NBQzFCLENBQUMsQ0FBQztLQUNOLENBQUE7Q0FDSjs7Ozs7Ozs7cUJDekh1QixjQUFjOzs7OzBCQTFCZixhQUFhOzs7OzJCQUNaLGlCQUFpQjs7MkJBQ25CLG9CQUFvQjs7OztBQUUxQyxJQUFNLFlBQVksR0FBRztBQUNqQixTQUFLLEVBQUUsQ0FBQztBQUNSLFdBQU8sRUFBRSxLQUFLO0FBQ2QsU0FBSyxFQUFFLEVBQUU7QUFDVCxpQkFBYSxFQUFFLEVBQUU7QUFDakIsV0FBTyxFQUFFLEtBQUs7QUFDZCxTQUFLLEVBQUUsS0FBSztBQUNaLGVBQVcsRUFBRTtBQUNULG1CQUFXLEVBQUUseUJBQVUsd0JBQXdCO0FBQy9DLGVBQU8sRUFBRSx5QkFBVSxZQUFZO0tBQ2xDO0FBQ0QsZ0JBQVksRUFBRSxFQUFFO0NBQ25CLENBQUM7Ozs7Ozs7Ozs7O0FBVWEsU0FBUyxjQUFjLENBQUMsS0FBSyxFQUFpQixNQUFNLEVBQUU7UUFBOUIsS0FBSyxnQkFBTCxLQUFLLEdBQUcsWUFBWTs7QUFFdkQsUUFBSSxTQUFTLENBQUM7O0FBRWQsWUFBUSxNQUFNLENBQUMsSUFBSTtBQUNmLGFBQUsscUJBQVEsUUFBUTtBQUNqQixnQkFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUV4QixnQkFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxnQkFBZ0IsRUFBRTs7QUFFMUUsc0JBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFdBQVcsRUFBSTtBQUN2Qyx3QkFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDOztBQUV4Qix5QkFBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTLEVBQUk7O0FBRTdCLDRCQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssV0FBVyxDQUFDLEVBQUUsRUFBRTtBQUNqQyx1Q0FBVyxHQUFHLElBQUksQ0FBQzt5QkFDdEIsQ0FBQztxQkFDTCxDQUFDLENBQUM7OztBQUdILHdCQUFJLENBQUMsV0FBVyxFQUFFO0FBQ2Qsc0NBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7cUJBQ25DO2lCQUNKLENBQUMsQ0FBQzthQUNOLE1BQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTs7QUFFaEQsb0JBQUksV0FBVyxHQUFHLEtBQUssQ0FBQzs7QUFFeEIscUJBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJOztBQUV4Qix3QkFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNwQyxtQ0FBVyxHQUFHLElBQUksQ0FBQztxQkFDdEIsQ0FBQztpQkFDTCxDQUFDLENBQUM7OztBQUdILG9CQUFJLENBQUMsV0FBVyxFQUFFO0FBQ2Qsa0NBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDNUM7YUFDSjs7QUFFRCxtQkFBTyw2QkFBVyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUU7QUFDdkMscUJBQUssRUFBRSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxLQUFLLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSztBQUN2RixxQkFBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQzthQUM1QyxDQUFDLENBQUMsQ0FBQzs7QUFBQSxBQUVSLGFBQUsscUJBQVEsV0FBVztBQUNwQixnQkFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLFdBQVcsRUFBRTs7QUFFMUMseUJBQVMsR0FBRyw2QkFBVyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDN0UsTUFBTSxJQUFJLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssUUFBUSxFQUFFOztBQUU5Qyx5QkFBUyxHQUFHLDZCQUFXLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRTtBQUM1Qyx5QkFBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQztBQUN0Qix5QkFBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSTsrQkFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTtxQkFBQSxDQUFDO2lCQUNuRSxDQUFDLENBQUMsQ0FBQzthQUNQLE1BQU07O0FBRUgseUJBQVMsR0FBRyw2QkFBVyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUU7QUFDNUMseUJBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU07QUFDN0MseUJBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUk7K0JBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQUEsQ0FBQztpQkFDL0UsQ0FBQyxDQUFDLENBQUM7YUFDUDs7QUFFRCxtQkFBTyxTQUFTLENBQUM7O0FBQUEsQUFFckIsYUFBSyxxQkFBUSxXQUFXO0FBQ3BCLGdCQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7dUJBQUksSUFBSSxDQUFDLEVBQUU7YUFBQSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUUsZ0JBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFcEYsbUJBQU8sNkJBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLHFCQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJOzJCQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssV0FBVyxDQUFDLEVBQUUsR0FBRyxXQUFXLEdBQUcsSUFBSTtpQkFBQSxDQUFDO2FBQ2xGLENBQUMsQ0FBQyxDQUFDOztBQUFBLEFBRVIsYUFBSyxxQkFBUSxZQUFZO0FBQ3JCLGdCQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLElBQUksRUFBRTs7QUFFN0IseUJBQVMsR0FBRyw2QkFBVyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUU7QUFDNUMsaUNBQWEsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7K0JBQUksSUFBSSxDQUFDLEVBQUU7cUJBQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFBLEVBQUU7K0JBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUFBLENBQUMsQ0FBQztpQkFDbkksQ0FBQyxDQUFDLENBQUM7YUFDUCxNQUFNLElBQUksT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxRQUFRLEVBQUU7OztBQUcvQyxvQkFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3hELDZCQUFTLEdBQUcsNkJBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFO0FBQzVDLHFDQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7cUJBQ2hFLENBQUMsQ0FBQyxDQUFDO2lCQUNQLE1BQU07O0FBRUgsNkJBQVMsR0FBRyxLQUFLLENBQUM7aUJBQ3JCO2FBQ0osTUFBTTs7QUFFSCx5QkFBUyxHQUFHLDZCQUFXLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRTtBQUM1QyxpQ0FBYSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFBLEVBQUU7K0JBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUFBLENBQUMsQ0FBQztpQkFDckgsQ0FBQyxDQUFDLENBQUM7YUFDUDs7QUFFRCxtQkFBTyxTQUFTLENBQUM7O0FBQUEsQUFFckIsYUFBSyxxQkFBUSxjQUFjO0FBQ3ZCLGdCQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLElBQUksRUFBRTs7QUFFN0IseUJBQVMsR0FBRyw2QkFBVyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzNFLE1BQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLFFBQVEsRUFBRTs7QUFFL0Msb0JBQUksVUFBUyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWhFLHlCQUFTLEdBQUcsNkJBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFO0FBQzVDLGlDQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQzFHLENBQUMsQ0FBQyxDQUFDO2FBQ1AsTUFBTTs7QUFFSCx5QkFBUyxHQUFHLDZCQUFXLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRTtBQUM1QyxpQ0FBYSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQUEsRUFBRTsrQkFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUFBLENBQUM7aUJBQ3pGLENBQUMsQ0FBQyxDQUFDO2FBQ1A7O0FBRUQsbUJBQU8sU0FBUyxDQUFDOztBQUFBLEFBRXJCLGFBQUsscUJBQVEsV0FBVztBQUNwQixtQkFBTyw2QkFBVyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUU7QUFDdkMsdUJBQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUk7YUFDL0IsQ0FBQyxDQUFDLENBQUM7O0FBQUEsQUFFUixhQUFLLHFCQUFRLFNBQVM7QUFDbEIsbUJBQU8sNkJBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLHFCQUFLLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2FBQzNCLENBQUMsQ0FBQyxDQUFDOztBQUFBLEFBRVIsYUFBSyxxQkFBUSxpQkFBaUI7QUFDMUIsbUJBQU8sNkJBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLDRCQUFZLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZO2FBQzVDLENBQUMsQ0FBQyxDQUFDOztBQUFBLEFBRVIsYUFBSyxxQkFBUSxtQkFBbUI7QUFDNUIsZ0JBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSzt1QkFBSSxLQUFLLENBQUMsSUFBSTthQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUM3RixZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3RixtQkFBTyw2QkFBVyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUU7QUFDdkMsNEJBQVksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7MkJBQUksS0FBSyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsSUFBSSxHQUFHLFlBQVksR0FBRyxLQUFLO2lCQUFBLENBQUM7YUFDekcsQ0FBQyxDQUFDLENBQUM7O0FBQUEsQUFFUixhQUFLLHFCQUFRLFVBQVU7QUFDbkIsZ0JBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSTt1QkFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVE7YUFBQSxDQUFDO2dCQUM1RCxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJO3VCQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTthQUFBLENBQUMsQ0FBQzs7QUFFL0QsbUJBQU8sNkJBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLHFCQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDL0YsQ0FBQyxDQUFDLENBQUM7QUFBQSxBQUNSO0FBQ0ksbUJBQU8sS0FBSyxDQUFDO0FBQUEsS0FDcEI7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJDaEwrQixPQUFPOztnQ0FDWixzQkFBc0I7Ozs7Ozs7Ozs7OztBQVVqRCxJQUFNLFdBQVcsR0FBRyw0QkFBZ0I7QUFDaEMsWUFBVSxFQUFFLDRCQUFnQjtBQUN4QixXQUFPLCtCQUFnQjtHQUMxQixDQUFDO0NBQ0wsQ0FBQyxDQUFDOztxQkFFWSxXQUFXOzs7O0FDckIxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgRXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVCYWNrZW5kIGV4dGVuZHMgRXZlbnRzIHtcblxuXHRjb25zdHJ1Y3RvcihmZXRjaF91cmwsIHNlYXJjaF91cmwsIHVwZGF0ZV91cmwsIGRlbGV0ZV91cmwsIGxpbWl0LCBidWxrQWN0aW9ucywgJGZvbGRlciwgY3VycmVudEZvbGRlcikge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLmZldGNoX3VybCA9IGZldGNoX3VybDtcblx0XHR0aGlzLnNlYXJjaF91cmwgPSBzZWFyY2hfdXJsO1xuXHRcdHRoaXMudXBkYXRlX3VybCA9IHVwZGF0ZV91cmw7XG5cdFx0dGhpcy5kZWxldGVfdXJsID0gZGVsZXRlX3VybDtcblx0XHR0aGlzLmxpbWl0ID0gbGltaXQ7XG5cdFx0dGhpcy5idWxrQWN0aW9ucyA9IGJ1bGtBY3Rpb25zO1xuXHRcdHRoaXMuJGZvbGRlciA9ICRmb2xkZXI7XG5cdFx0dGhpcy5mb2xkZXIgPSBjdXJyZW50Rm9sZGVyO1xuXG5cdFx0dGhpcy5wYWdlID0gMTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZnVuYyBmZXRjaFxuXHQgKiBAcGFyYW0gbnVtYmVyIGlkXG5cdCAqIEBkZXNjIEZldGNoZXMgYSBjb2xsZWN0aW9uIG9mIEZpbGVzIGJ5IFBhcmVudElELlxuXHQgKi9cblx0ZmV0Y2goaWQpIHtcblx0XHRpZiAodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMucGFnZSA9IDE7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ1BPU1QnLCB0aGlzLmZldGNoX3VybCwgeyBpZDogaWQgfSkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvbkZldGNoRGF0YScsIGpzb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0c2VhcmNoKCkge1xuXHRcdHRoaXMucGFnZSA9IDE7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvblNlYXJjaERhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG1vcmUoKSB7XG5cdFx0dGhpcy5wYWdlKys7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvbk1vcmVEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRuYXZpZ2F0ZShmb2xkZXIpIHtcblx0XHR0aGlzLnBhZ2UgPSAxO1xuXHRcdHRoaXMuZm9sZGVyID0gZm9sZGVyO1xuXG5cdFx0dGhpcy5wZXJzaXN0Rm9sZGVyRmlsdGVyKGZvbGRlcik7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvbk5hdmlnYXRlRGF0YScsIGpzb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0cGVyc2lzdEZvbGRlckZpbHRlcihmb2xkZXIpIHtcblx0XHRpZiAoZm9sZGVyLnN1YnN0cigtMSkgPT09ICcvJykge1xuXHRcdFx0Zm9sZGVyID0gZm9sZGVyLnN1YnN0cigwLCBmb2xkZXIubGVuZ3RoIC0gMSk7XG5cdFx0fVxuXG5cdFx0dGhpcy4kZm9sZGVyLnZhbChmb2xkZXIpO1xuXHR9XG5cblx0ZGVsZXRlKGlkcykge1xuXHRcdHZhciBmaWxlc1RvRGVsZXRlID0gW107XG5cblx0XHQvLyBBbGxvd3MgdXNlcnMgdG8gcGFzcyBvbmUgb3IgbW9yZSBpZHMgdG8gZGVsZXRlLlxuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaWRzKSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuXHRcdFx0ZmlsZXNUb0RlbGV0ZS5wdXNoKGlkcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZpbGVzVG9EZWxldGUgPSBpZHM7XG5cdFx0fVxuXG5cdFx0dGhpcy5yZXF1ZXN0KCdERUxFVEUnLCB0aGlzLmRlbGV0ZV91cmwsIHtcblx0XHRcdCdpZHMnOiBmaWxlc1RvRGVsZXRlXG5cdFx0fSkudGhlbigoKSA9PiB7XG5cdFx0XHQvLyBVc2luZyBmb3IgbG9vcCBiZWNhdXNlIElFMTAgZG9lc24ndCBoYW5kbGUgJ2ZvciBvZicsXG5cdFx0XHQvLyB3aGljaCBnZXRzIHRyYW5zY29tcGlsZWQgaW50byBhIGZ1bmN0aW9uIHdoaWNoIHVzZXMgU3ltYm9sLFxuXHRcdFx0Ly8gdGhlIHRoaW5nIElFMTAgZGllcyBvbi5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXNUb0RlbGV0ZS5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0XHR0aGlzLmVtaXQoJ29uRGVsZXRlRGF0YScsIGZpbGVzVG9EZWxldGVbaV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZmlsdGVyKG5hbWUsIHR5cGUsIGZvbGRlciwgY3JlYXRlZEZyb20sIGNyZWF0ZWRUbywgb25seVNlYXJjaEluRm9sZGVyKSB7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMuZm9sZGVyID0gZm9sZGVyO1xuXHRcdHRoaXMuY3JlYXRlZEZyb20gPSBjcmVhdGVkRnJvbTtcblx0XHR0aGlzLmNyZWF0ZWRUbyA9IGNyZWF0ZWRUbztcblx0XHR0aGlzLm9ubHlTZWFyY2hJbkZvbGRlciA9IG9ubHlTZWFyY2hJbkZvbGRlcjtcblxuXHRcdHRoaXMuc2VhcmNoKCk7XG5cdH1cblxuXHRzYXZlKGlkLCB2YWx1ZXMpIHtcblx0XHR2YXIgdXBkYXRlcyA9IHsgaWQgfTtcblxuXHRcdHZhbHVlcy5mb3JFYWNoKGZpZWxkID0+IHtcblx0XHRcdHVwZGF0ZXNbZmllbGQubmFtZV0gPSBmaWVsZC52YWx1ZTtcblx0XHR9KTtcblxuXHRcdHRoaXMucmVxdWVzdCgnUE9TVCcsIHRoaXMudXBkYXRlX3VybCwgdXBkYXRlcykudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uU2F2ZURhdGEnLCBpZCwgdXBkYXRlcyk7XG5cdFx0fSk7XG5cdH1cblxuXHRyZXF1ZXN0KG1ldGhvZCwgdXJsLCBkYXRhID0ge30pIHtcblx0XHRsZXQgZGVmYXVsdHMgPSB7XG5cdFx0XHQnbGltaXQnOiB0aGlzLmxpbWl0LFxuXHRcdFx0J3BhZ2UnOiB0aGlzLnBhZ2UsXG5cdFx0fTtcblxuXHRcdGlmICh0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5uYW1lKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5mb2xkZXIgJiYgdGhpcy5mb2xkZXIudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuZm9sZGVyID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMuZm9sZGVyKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5jcmVhdGVkRnJvbSAmJiB0aGlzLmNyZWF0ZWRGcm9tLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRGcm9tID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMuY3JlYXRlZEZyb20pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRUbyAmJiB0aGlzLmNyZWF0ZWRUby50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5jcmVhdGVkVG8gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkVG8pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlciAmJiB0aGlzLm9ubHlTZWFyY2hJbkZvbGRlci50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5vbmx5U2VhcmNoSW5Gb2xkZXIgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIpO1xuXHRcdH1cblxuXHRcdHRoaXMuc2hvd0xvYWRpbmdJbmRpY2F0b3IoKTtcblxuXHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0J3VybCc6IHVybCxcblx0XHRcdCd0eXBlJzogbWV0aG9kLCAvLyBjb21wYXQgd2l0aCBqUXVlcnkgMS43XG5cdFx0XHQnZGF0YVR5cGUnOiAnanNvbicsXG5cdFx0XHQnZGF0YSc6ICQuZXh0ZW5kKGRlZmF1bHRzLCBkYXRhKVxuXHRcdH0pLmFsd2F5cygoKSA9PiB7XG5cdFx0XHR0aGlzLmhpZGVMb2FkaW5nSW5kaWNhdG9yKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRzaG93TG9hZGluZ0luZGljYXRvcigpIHtcblx0XHQkKCcuY21zLWNvbnRlbnQsIC51aS1kaWFsb2cnKS5hZGRDbGFzcygnbG9hZGluZycpO1xuXHRcdCQoJy51aS1kaWFsb2ctY29udGVudCcpLmNzcygnb3BhY2l0eScsICcuMScpO1xuXHR9XG5cblx0aGlkZUxvYWRpbmdJbmRpY2F0b3IoKSB7XG5cdFx0JCgnLmNtcy1jb250ZW50LCAudWktZGlhbG9nJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblx0XHQkKCcudWktZGlhbG9nLWNvbnRlbnQnKS5jc3MoJ29wYWNpdHknLCAnMScpO1xuXHR9XG59XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgY29uZmlndXJlU3RvcmUgZnJvbSAnLi4vc3RhdGUvY29uZmlndXJlU3RvcmUnO1xuaW1wb3J0IEdhbGxlcnlDb250YWluZXIgZnJvbSAnLi4vc2VjdGlvbnMvZ2FsbGVyeS9jb250cm9sbGVyJztcbmltcG9ydCBGaWxlQmFja2VuZCBmcm9tICcuLi9iYWNrZW5kL2ZpbGUtYmFja2VuZCc7XG5cbmZ1bmN0aW9uIGdldFZhcihuYW1lKSB7XG5cdHZhciBwYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCc/Jyk7XG5cblx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRwYXJ0cyA9IHBhcnRzWzFdLnNwbGl0KCcjJyk7XG5cdH1cblxuXHRsZXQgdmFyaWFibGVzID0gcGFydHNbMF0uc3BsaXQoJyYnKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHZhcmlhYmxlcy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwYXJ0cyA9IHZhcmlhYmxlc1tpXS5zcGxpdCgnPScpO1xuXG5cdFx0aWYgKGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSkgPT09IG5hbWUpIHtcblx0XHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBoYXNTZXNzaW9uU3RvcmFnZSgpIHtcblx0cmV0dXJuIHR5cGVvZiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcHMocHJvcHMpIHtcblx0dmFyICRjb21wb25lbnRXcmFwcGVyID0gJCgnLmFzc2V0LWdhbGxlcnknKS5maW5kKCcuYXNzZXQtZ2FsbGVyeS1jb21wb25lbnQtd3JhcHBlcicpLFxuXHRcdCRzZWFyY2ggPSAkKCcuY21zLXNlYXJjaC1mb3JtJyksXG5cdFx0aW5pdGlhbEZvbGRlciA9ICQoJy5hc3NldC1nYWxsZXJ5JykuZGF0YSgnYXNzZXQtZ2FsbGVyeS1pbml0aWFsLWZvbGRlcicpLFxuXHRcdGN1cnJlbnRGb2xkZXIgPSBnZXRWYXIoJ3FbRm9sZGVyXScpIHx8IGluaXRpYWxGb2xkZXIsXG5cdFx0YmFja2VuZCxcblx0XHRkZWZhdWx0cztcblxuXHRpZiAoJHNlYXJjaC5maW5kKCdbdHlwZT1oaWRkZW5dW25hbWU9XCJxW0ZvbGRlcl1cIl0nKS5sZW5ndGggPT0gMCkge1xuXHRcdCRzZWFyY2guYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJxW0ZvbGRlcl1cIiAvPicpO1xuXHR9XG5cblx0Ly8gRG8gd2UgbmVlZCB0byBzZXQgdXAgYSBkZWZhdWx0IGJhY2tlbmQ/XG5cdGlmICh0eXBlb2YgcHJvcHMgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwcm9wcy5iYWNrZW5kID09PSAndW5kZWZpbmVkJykge1xuXHRcdGJhY2tlbmQgPSBuZXcgRmlsZUJhY2tlbmQoXG5cdFx0XHQkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LWZldGNoLXVybCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1zZWFyY2gtdXJsJyksXG5cdFx0XHQkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LXVwZGF0ZS11cmwnKSxcblx0XHRcdCRjb21wb25lbnRXcmFwcGVyLmRhdGEoJ2Fzc2V0LWdhbGxlcnktZGVsZXRlLXVybCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1saW1pdCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1idWxrLWFjdGlvbnMnKSxcblx0XHRcdCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJyksXG5cdFx0XHRjdXJyZW50Rm9sZGVyXG5cdFx0KTtcblxuXHRcdGJhY2tlbmQuZW1pdChcblx0XHRcdCdmaWx0ZXInLFxuXHRcdFx0Z2V0VmFyKCdxW05hbWVdJyksXG5cdFx0XHRnZXRWYXIoJ3FbQXBwQ2F0ZWdvcnldJyksXG5cdFx0XHRnZXRWYXIoJ3FbRm9sZGVyXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRGcm9tXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRUb10nKSxcblx0XHRcdGdldFZhcigncVtDdXJyZW50Rm9sZGVyT25seV0nKVxuXHRcdCk7XG5cdH1cblxuXHRkZWZhdWx0cyA9IHtcblx0XHRiYWNrZW5kOiBiYWNrZW5kLFxuXHRcdGN1cnJlbnRfZm9sZGVyOiBjdXJyZW50Rm9sZGVyLFxuXHRcdGNtc0V2ZW50czoge30sXG5cdFx0aW5pdGlhbF9mb2xkZXI6IGluaXRpYWxGb2xkZXIsXG5cdFx0bmFtZTogJCgnLmFzc2V0LWdhbGxlcnknKS5kYXRhKCdhc3NldC1nYWxsZXJ5LW5hbWUnKVxuXHR9O1xuXG5cdHJldHVybiAkLmV4dGVuZCh0cnVlLCBkZWZhdWx0cywgcHJvcHMpO1xufVxuXG5sZXQgcHJvcHMgPSBnZXRQcm9wcygpO1xuY29uc3Qgc3RvcmUgPSBjb25maWd1cmVTdG9yZSgpOyAvL0NyZWF0ZSB0aGUgcmVkdXggc3RvcmVcblxuXG5SZWFjdERPTS5yZW5kZXIoXG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgICAgIDxHYWxsZXJ5Q29udGFpbmVyIHsuLi5wcm9wc30gLz5cbiAgICA8L1Byb3ZpZGVyPixcbiAgICAkKCcuYXNzZXQtZ2FsbGVyeS1jb21wb25lbnQtd3JhcHBlcicpWzBdXG4pO1xuIiwiaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgUmVhY3RUZXN0VXRpbHMgZnJvbSAncmVhY3QtYWRkb25zLXRlc3QtdXRpbHMnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCAqIGFzIGdhbGxlcnlBY3Rpb25zIGZyb20gJy4uLy4uL3N0YXRlL2dhbGxlcnkvYWN0aW9ucyc7XG5pbXBvcnQgaTE4biBmcm9tICdpMThuJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVsa0FjdGlvbnNDb21wb25lbnQgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5vbkNoYW5nZVZhbHVlID0gdGhpcy5vbkNoYW5nZVZhbHVlLmJpbmQodGhpcyk7XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR2YXIgJHNlbGVjdCA9ICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5kcm9wZG93bicpO1xuXG5cdFx0JHNlbGVjdC5jaG9zZW4oe1xuXHRcdFx0J2FsbG93X3NpbmdsZV9kZXNlbGVjdCc6IHRydWUsXG5cdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMjBcblx0XHR9KTtcblxuXHRcdC8vIENob3NlbiBzdG9wcyB0aGUgY2hhbmdlIGV2ZW50IGZyb20gcmVhY2hpbmcgUmVhY3Qgc28gd2UgaGF2ZSB0byBzaW11bGF0ZSBhIGNsaWNrLlxuXHRcdCRzZWxlY3QuY2hhbmdlKCgpID0+IFJlYWN0VGVzdFV0aWxzLlNpbXVsYXRlLmNsaWNrKCRzZWxlY3QuZmluZCgnOnNlbGVjdGVkJylbMF0pKTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5X19idWxrLWFjdGlvbnMgZmllbGRob2xkZXItc21hbGxcIj5cblx0XHRcdDxzZWxlY3QgY2xhc3NOYW1lPVwiZHJvcGRvd24gbm8tY2hhbmdlLXRyYWNrIG5vLWNoem5cIiB0YWJJbmRleD1cIjBcIiBkYXRhLXBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLmdhbGxlcnkuYnVsa0FjdGlvbnMucGxhY2Vob2xkZXJ9IHN0eWxlPXt7d2lkdGg6ICcxNjBweCd9fT5cblx0XHRcdFx0PG9wdGlvbiBzZWxlY3RlZCBkaXNhYmxlZCBoaWRkZW4gdmFsdWU9Jyc+PC9vcHRpb24+XG5cdFx0XHRcdHt0aGlzLnByb3BzLmdhbGxlcnkuYnVsa0FjdGlvbnMub3B0aW9ucy5tYXAoKG9wdGlvbiwgaSkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiA8b3B0aW9uIGtleT17aX0gb25DbGljaz17dGhpcy5vbkNoYW5nZVZhbHVlfSB2YWx1ZT17b3B0aW9uLnZhbHVlfT57b3B0aW9uLmxhYmVsfTwvb3B0aW9uPjtcblx0XHRcdFx0fSl9XG5cdFx0XHQ8L3NlbGVjdD5cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRnZXRPcHRpb25CeVZhbHVlKHZhbHVlKSB7XG5cdFx0Ly8gVXNpbmcgZm9yIGxvb3AgYmVjYXVzZSBJRTEwIGRvZXNuJ3QgaGFuZGxlICdmb3Igb2YnLFxuXHRcdC8vIHdoaWNoIGdldHMgdHJhbnNjb21waWxlZCBpbnRvIGEgZnVuY3Rpb24gd2hpY2ggdXNlcyBTeW1ib2wsXG5cdFx0Ly8gdGhlIHRoaW5nIElFMTAgZGllcyBvbi5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZ2FsbGVyeS5idWxrQWN0aW9ucy5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LmJ1bGtBY3Rpb25zLm9wdGlvbnNbaV0udmFsdWUgPT09IHZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnByb3BzLmdhbGxlcnkuYnVsa0FjdGlvbnMub3B0aW9uc1tpXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuICAgIFxuICAgIGdldFNlbGVjdGVkRmlsZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmdhbGxlcnkuc2VsZWN0ZWRGaWxlcztcbiAgICB9XG5cblx0YXBwbHlBY3Rpb24odmFsdWUpIHtcblx0XHQvLyBXZSBvbmx5IGhhdmUgJ2RlbGV0ZScgcmlnaHQgbm93Li4uXG5cdFx0c3dpdGNoICh2YWx1ZSkge1xuXHRcdFx0Y2FzZSAnZGVsZXRlJzpcblx0XHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLmRlbGV0ZSh0aGlzLmdldFNlbGVjdGVkRmlsZXMoKSk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0b25DaGFuZ2VWYWx1ZShldmVudCkge1xuXHRcdHZhciBvcHRpb24gPSB0aGlzLmdldE9wdGlvbkJ5VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcblxuXHRcdC8vIE1ha2Ugc3VyZSBhIHZhbGlkIG9wdGlvbiBoYXMgYmVlbiBzZWxlY3RlZC5cblx0XHRpZiAob3B0aW9uID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbi5kZXN0cnVjdGl2ZSA9PT0gdHJ1ZSkge1xuXHRcdFx0aWYgKGNvbmZpcm0oaTE4bi5zcHJpbnRmKGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkJVTEtfQUNUSU9OU19DT05GSVJNJyksIG9wdGlvbi5sYWJlbCkpKSB7XG5cdFx0XHRcdHRoaXMuYXBwbHlBY3Rpb24ob3B0aW9uLnZhbHVlKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5hcHBseUFjdGlvbihvcHRpb24udmFsdWUpO1xuXHRcdH1cblxuXHRcdC8vIFJlc2V0IHRoZSBkcm9wZG93biB0byBpdCdzIHBsYWNlaG9sZGVyIHZhbHVlLlxuXHRcdCQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5kcm9wZG93bicpLnZhbCgnJykudHJpZ2dlcignbGlzenQ6dXBkYXRlZCcpO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcblx0cmV0dXJuIHtcblx0XHRnYWxsZXJ5OiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnlcblx0fVxufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0cmV0dXJuIHtcblx0XHRhY3Rpb25zOiBiaW5kQWN0aW9uQ3JlYXRvcnMoZ2FsbGVyeUFjdGlvbnMsIGRpc3BhdGNoKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEJ1bGtBY3Rpb25zQ29tcG9uZW50KTtcbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgaTE4biBmcm9tICdpMThuJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBiaW5kQWN0aW9uQ3JlYXRvcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgKiBhcyBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi8uLi9zdGF0ZS9nYWxsZXJ5L2FjdGlvbnMnO1xuaW1wb3J0IGNvbnN0YW50cyBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xuaW1wb3J0IFNpbHZlclN0cmlwZUNvbXBvbmVudCBmcm9tICdzaWx2ZXJzdHJpcGUtY29tcG9uZW50JztcblxuY2xhc3MgRmlsZUNvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHRoaXMuZ2V0QnV0dG9uVGFiSW5kZXggPSB0aGlzLmdldEJ1dHRvblRhYkluZGV4LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbkZpbGVOYXZpZ2F0ZSA9IHRoaXMub25GaWxlTmF2aWdhdGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZUVkaXQgPSB0aGlzLm9uRmlsZUVkaXQuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZURlbGV0ZSA9IHRoaXMub25GaWxlRGVsZXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVEb3VibGVDbGljayA9IHRoaXMuaGFuZGxlRG91YmxlQ2xpY2suYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUtleURvd24gPSB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUZvY3VzID0gdGhpcy5oYW5kbGVGb2N1cy5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlQmx1ciA9IHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucHJldmVudEZvY3VzID0gdGhpcy5wcmV2ZW50Rm9jdXMuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZVNlbGVjdCA9IHRoaXMub25GaWxlU2VsZWN0LmJpbmQodGhpcyk7XG5cdH1cblxuXHRoYW5kbGVEb3VibGVDbGljayhldmVudCkge1xuXHRcdGlmIChldmVudC50YXJnZXQgIT09IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy50aXRsZSkgJiYgZXZlbnQudGFyZ2V0ICE9PSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMudGh1bWJuYWlsKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMub25GaWxlTmF2aWdhdGUoZXZlbnQpO1xuXHR9XG5cblx0b25GaWxlTmF2aWdhdGUoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5pc0ZvbGRlcigpKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uRmlsZU5hdmlnYXRlKHRoaXMucHJvcHMsIGV2ZW50KVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMub25GaWxlRWRpdChldmVudCk7XG5cdH1cblxuXHRvbkZpbGVTZWxlY3QoZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgLy9zdG9wIHRyaWdnZXJpbmcgY2xpY2sgb24gcm9vdCBlbGVtZW50XG5cblx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LnNlbGVjdGVkRmlsZXMuaW5kZXhPZih0aGlzLnByb3BzLmlkKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZWxlY3RGaWxlcyh0aGlzLnByb3BzLmlkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmRlc2VsZWN0RmlsZXModGhpcy5wcm9wcy5pZCk7XG5cdFx0fVxuXHR9XG5cblx0b25GaWxlRWRpdChldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyAvL3N0b3AgdHJpZ2dlcmluZyBjbGljayBvbiByb290IGVsZW1lbnRcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuc2V0RWRpdGluZyh0aGlzLnByb3BzLmdhbGxlcnkuZmlsZXMuZmluZChmaWxlID0+IGZpbGUuaWQgPT09IHRoaXMucHJvcHMuaWQpKTtcblx0fVxuXG5cdG9uRmlsZURlbGV0ZShldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyAvL3N0b3AgdHJpZ2dlcmluZyBjbGljayBvbiByb290IGVsZW1lbnRcblx0XHR0aGlzLnByb3BzLm9uRmlsZURlbGV0ZSh0aGlzLnByb3BzLCBldmVudClcblx0fVxuXG5cdGlzRm9sZGVyKCkge1xuXHRcdHJldHVybiB0aGlzLnByb3BzLmNhdGVnb3J5ID09PSAnZm9sZGVyJztcblx0fVxuXG5cdGdldFRodW1ibmFpbFN0eWxlcygpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5jYXRlZ29yeSA9PT0gJ2ltYWdlJykge1xuXHRcdFx0cmV0dXJuIHsnYmFja2dyb3VuZEltYWdlJzogJ3VybCgnICsgdGhpcy5wcm9wcy51cmwgKyAnKSd9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdGdldFRodW1ibmFpbENsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIHRodW1ibmFpbENsYXNzTmFtZXMgPSAnaXRlbV9fdGh1bWJuYWlsJztcblxuXHRcdGlmICh0aGlzLmlzSW1hZ2VMYXJnZXJUaGFuVGh1bWJuYWlsKCkpIHtcblx0XHRcdHRodW1ibmFpbENsYXNzTmFtZXMgKz0gJyBpdGVtX190aHVtYm5haWwtLWxhcmdlJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGh1bWJuYWlsQ2xhc3NOYW1lcztcblx0fVxuXHRcblx0aXNTZWxlY3RlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy5nYWxsZXJ5LnNlbGVjdGVkRmlsZXMuaW5kZXhPZih0aGlzLnByb3BzLmlkKSA+IC0xO1xuXHR9XG4gICAgXG4gICAgaXNGb2N1c3NlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZ2FsbGVyeS5mb2N1cyA9PT0gdGhpcy5wcm9wcy5pZDtcbiAgICB9XG4gICAgXG4gICAgZ2V0QnV0dG9uVGFiSW5kZXgoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRm9jdXNzZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9XG5cblx0Z2V0SXRlbUNsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIGl0ZW1DbGFzc05hbWVzID0gJ2l0ZW0gaXRlbS0tJyArIHRoaXMucHJvcHMuY2F0ZWdvcnk7XG5cblx0XHRpZiAodGhpcy5pc0ZvY3Vzc2VkKCkpIHtcblx0XHRcdGl0ZW1DbGFzc05hbWVzICs9ICcgaXRlbS0tZm9jdXNzZWQnO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmlzU2VsZWN0ZWQoKSkge1xuXHRcdFx0aXRlbUNsYXNzTmFtZXMgKz0gJyBpdGVtLS1zZWxlY3RlZCc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW1DbGFzc05hbWVzO1xuXHR9XG5cblx0aXNJbWFnZUxhcmdlclRoYW5UaHVtYm5haWwoKSB7XG5cdFx0bGV0IGRpbWVuc2lvbnMgPSB0aGlzLnByb3BzLmF0dHJpYnV0ZXMuZGltZW5zaW9ucztcblxuXHRcdHJldHVybiBkaW1lbnNpb25zLmhlaWdodCA+IGNvbnN0YW50cy5USFVNQk5BSUxfSEVJR0hUIHx8IGRpbWVuc2lvbnMud2lkdGggPiBjb25zdGFudHMuVEhVTUJOQUlMX1dJRFRIO1xuXHR9XG5cblx0aGFuZGxlS2V5RG93bihldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0Ly9pZiBldmVudCBkb2Vzbid0IGNvbWUgZnJvbSB0aGUgcm9vdCBlbGVtZW50LCBkbyBub3RoaW5nXG5cdFx0aWYgKGV2ZW50LnRhcmdldCAhPT0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLnRodW1ibmFpbCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0Ly9JZiBzcGFjZSBpcyBwcmVzc2VkLCBhbGxvdyBmb2N1cyBvbiBidXR0b25zXG5cdFx0aWYgKHRoaXMucHJvcHMuc3BhY2VLZXkgPT09IGV2ZW50LmtleUNvZGUpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vU3RvcCBwYWdlIGZyb20gc2Nyb2xsaW5nXG5cdFx0XHQkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKCcuaXRlbV9fYWN0aW9uc19fYWN0aW9uJykuZmlyc3QoKS5mb2N1cygpO1xuXHRcdH1cblxuXHRcdC8vSWYgcmV0dXJuIGlzIHByZXNzZWQsIG5hdmlnYXRlIGZvbGRlclxuXHRcdGlmICh0aGlzLnByb3BzLnJldHVybktleSA9PT0gZXZlbnQua2V5Q29kZSkge1xuXHRcdFx0dGhpcy5vbkZpbGVOYXZpZ2F0ZShldmVudCk7XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlRm9jdXMoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5zZXRGb2N1cyh0aGlzLnByb3BzLmlkKTtcblx0fVxuXG5cdGhhbmRsZUJsdXIoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5zZXRGb2N1cyhmYWxzZSk7XG5cdH1cblx0XG5cdHByZXZlbnRGb2N1cyhldmVudCkge1xuXHRcdC8vVG8gYXZvaWQgYnJvd3NlcidzIGRlZmF1bHQgZm9jdXMgc3RhdGUgd2hlbiBzZWxlY3RpbmcgYW4gaXRlbVxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0dmFyIHNlbGVjdEJ1dHRvbjtcblx0XHR2YXIgZGVsZXRlQnV0dG9uO1xuXHRcdHZhciBlZGl0QnV0dG9uO1xuXG5cdFx0c2VsZWN0QnV0dG9uID0gPGJ1dHRvblxuXHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1zZWxlY3QgWyBmb250LWljb24tdGljayBdJ1xuXHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0dGl0bGU9e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlNFTEVDVCcpfVxuXHRcdFx0dGFiSW5kZXg9e3RoaXMuZ2V0QnV0dG9uVGFiSW5kZXgoKX1cblx0XHRcdG9uQ2xpY2s9e3RoaXMub25GaWxlU2VsZWN0fVxuXHRcdFx0b25Gb2N1cz17dGhpcy5oYW5kbGVGb2N1c31cblx0XHRcdG9uQmx1cj17dGhpcy5oYW5kbGVCbHVyfT5cblx0XHQ8L2J1dHRvbj47XG5cblx0XHRpZih0aGlzLnByb3BzLmNhbkRlbGV0ZSkge1xuXHRcdFx0ZGVsZXRlQnV0dG9uID0gPGJ1dHRvblxuXHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXJlbW92ZSBbIGZvbnQtaWNvbi10cmFzaCBdJ1xuXHRcdFx0XHR0eXBlPSdidXR0b24nXG5cdFx0XHRcdHRpdGxlPXtpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5ERUxFVEUnKX1cblx0XHRcdFx0dGFiSW5kZXg9e3RoaXMuZ2V0QnV0dG9uVGFiSW5kZXgoKX1cblx0XHRcdFx0b25DbGljaz17dGhpcy5vbkZpbGVEZWxldGV9XG5cdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlRm9jdXN9XG5cdFx0XHRcdG9uQmx1cj17dGhpcy5oYW5kbGVCbHVyfT5cblx0XHRcdDwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRpZih0aGlzLnByb3BzLmNhbkVkaXQpIHtcblx0XHRcdGVkaXRCdXR0b24gPSA8YnV0dG9uXG5cdFx0XHRcdGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tZWRpdCBbIGZvbnQtaWNvbi1lZGl0IF0nXG5cdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0dGl0bGU9e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkVESVQnKX1cblx0XHRcdFx0dGFiSW5kZXg9e3RoaXMuZ2V0QnV0dG9uVGFiSW5kZXgoKX1cblx0XHRcdFx0b25DbGljaz17dGhpcy5vbkZpbGVFZGl0fVxuXHRcdFx0XHRvbkZvY3VzPXt0aGlzLmhhbmRsZUZvY3VzfVxuXHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn0+XG5cdFx0XHQ8L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmdldEl0ZW1DbGFzc05hbWVzKCl9IGRhdGEtaWQ9e3RoaXMucHJvcHMuaWR9IG9uRG91YmxlQ2xpY2s9e3RoaXMuaGFuZGxlRG91YmxlQ2xpY2t9PlxuXHRcdFx0PGRpdiByZWY9XCJ0aHVtYm5haWxcIiBjbGFzc05hbWU9e3RoaXMuZ2V0VGh1bWJuYWlsQ2xhc3NOYW1lcygpfSB0YWJJbmRleD1cIjBcIiBvbktleURvd249e3RoaXMuaGFuZGxlS2V5RG93bn0gc3R5bGU9e3RoaXMuZ2V0VGh1bWJuYWlsU3R5bGVzKCl9IG9uQ2xpY2s9e3RoaXMub25GaWxlU2VsZWN0fSBvbk1vdXNlRG93bj17dGhpcy5wcmV2ZW50Rm9jdXN9PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naXRlbV9fYWN0aW9ucyc+XG5cdFx0XHRcdFx0e3NlbGVjdEJ1dHRvbn1cblx0XHRcdFx0XHR7ZGVsZXRlQnV0dG9ufVxuXHRcdFx0XHRcdHtlZGl0QnV0dG9ufVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PHAgY2xhc3NOYW1lPSdpdGVtX190aXRsZScgcmVmPVwidGl0bGVcIj57dGhpcy5wcm9wcy50aXRsZX08L3A+XG5cdFx0PC9kaXY+O1xuXHR9XG59XG5cbkZpbGVDb21wb25lbnQucHJvcFR5cGVzID0ge1xuXHRpZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0dGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdGNhdGVnb3J5OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHR1cmw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdGRpbWVuc2lvbnM6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0d2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdFx0aGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG5cdH0pLFxuXHRvbkZpbGVOYXZpZ2F0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdG9uRmlsZUVkaXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRvbkZpbGVEZWxldGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRzcGFjZUtleTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0cmV0dXJuS2V5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRvbkZpbGVTZWxlY3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRzZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdGNhbkVkaXQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRjYW5EZWxldGU6IFJlYWN0LlByb3BUeXBlcy5ib29sXG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcblx0cmV0dXJuIHtcblx0XHRnYWxsZXJ5OiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnlcblx0fVxufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0cmV0dXJuIHtcblx0XHRhY3Rpb25zOiBiaW5kQWN0aW9uQ3JlYXRvcnMoZ2FsbGVyeUFjdGlvbnMsIGRpc3BhdGNoKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEZpbGVDb21wb25lbnQpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHRGaWVsZENvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHRleHQnPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCcgaHRtbEZvcj17J2dhbGxlcnlfJyArIHRoaXMucHJvcHMubmFtZX0+e3RoaXMucHJvcHMubGFiZWx9PC9sYWJlbD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBpZD17J2dhbGxlcnlfJyArIHRoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSd0ZXh0J1xuICAgICAgICAgICAgICAgICAgICB0eXBlPSd0ZXh0J1xuICAgICAgICAgICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWV9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgfVxuXG4gICAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoKTtcbiAgICB9XG59XG5cblRleHRGaWVsZENvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcbiIsImltcG9ydCBpMThuIGZyb20gJ2kxOG4nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdCdUSFVNQk5BSUxfSEVJR0hUJzogMTUwLFxuXHQnVEhVTUJOQUlMX1dJRFRIJzogMjAwLFxuXHQnU1BBQ0VfS0VZX0NPREUnOiAzMixcblx0J1JFVFVSTl9LRVlfQ09ERSc6IDEzLFxuXHQnQlVMS19BQ1RJT05TJzogW1xuXHRcdHtcblx0XHRcdHZhbHVlOiAnZGVsZXRlJyxcblx0XHRcdGxhYmVsOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5CVUxLX0FDVElPTlNfREVMRVRFJyksXG5cdFx0XHRkZXN0cnVjdGl2ZTogdHJ1ZVxuXHRcdH1cblx0XSxcbiAgICAnQlVMS19BQ1RJT05TX1BMQUNFSE9MREVSJzogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQlVMS19BQ1RJT05TX1BMQUNFSE9MREVSJylcbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNpbHZlclN0cmlwZUNvbXBvbmVudCBmcm9tICdzaWx2ZXJzdHJpcGUtY29tcG9uZW50JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBiaW5kQWN0aW9uQ3JlYXRvcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgKiBhcyBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi8uLi9zdGF0ZS9nYWxsZXJ5L2FjdGlvbnMnO1xuaW1wb3J0IFRleHRGaWVsZENvbXBvbmVudCBmcm9tICcuLi8uLi9jb21wb25lbnRzL3RleHQtZmllbGQvaW5kZXgnXG5cbmNsYXNzIEVkaXRvckNvbnRhaW5lciBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5maWVsZHMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdCdsYWJlbCc6ICdUaXRsZScsXG5cdFx0XHRcdCduYW1lJzogJ3RpdGxlJyxcblx0XHRcdFx0J3ZhbHVlJzogdGhpcy5wcm9wcy5maWxlLnRpdGxlXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQnbGFiZWwnOiAnRmlsZW5hbWUnLFxuXHRcdFx0XHQnbmFtZSc6ICdiYXNlbmFtZScsXG5cdFx0XHRcdCd2YWx1ZSc6IHRoaXMucHJvcHMuZmlsZS5iYXNlbmFtZVxuXHRcdFx0fVxuXHRcdF07XG5cblx0XHR0aGlzLm9uRmllbGRDaGFuZ2UgPSB0aGlzLm9uRmllbGRDaGFuZ2UuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZVNhdmUgPSB0aGlzLm9uRmlsZVNhdmUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uQ2FuY2VsID0gdGhpcy5vbkNhbmNlbC5iaW5kKHRoaXMpO1xuXHR9XG5cblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0c3VwZXIuY29tcG9uZW50RGlkTW91bnQoKTtcblxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZXRFZGl0b3JGaWVsZHModGhpcy5maWVsZHMpO1xuXHR9XG5cdFxuXHRjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcblx0XHRzdXBlci5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXHRcdFxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZXRFZGl0b3JGaWVsZHMoKTtcblx0fVxuXG5cdG9uRmllbGRDaGFuZ2UoZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMudXBkYXRlRWRpdG9yRmllbGQoe1xuXHRcdFx0bmFtZTogZXZlbnQudGFyZ2V0Lm5hbWUsXG5cdFx0XHR2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlXG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbGVTYXZlKGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5vbkZpbGVTYXZlKHRoaXMucHJvcHMuZmlsZS5pZCwgdGhpcy5wcm9wcy5nYWxsZXJ5LmVkaXRvckZpZWxkcywgZXZlbnQpO1xuXHR9XG5cblx0b25DYW5jZWwoZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuc2V0RWRpdGluZyhmYWxzZSk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdlZGl0b3InPlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvIG5vbGFiZWwnPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tcHJldmlldyBub2xhYmVsJz5cblx0XHRcdFx0XHQ8aW1nIGNsYXNzTmFtZT0ndGh1bWJuYWlsLXByZXZpZXcnIHNyYz17dGhpcy5wcm9wcy5maWxlLnVybH0gLz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1kYXRhIG5vbGFiZWwnPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgbm9sYWJlbCc+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuVFlQRScpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLnR5cGV9PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0laRScpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuc2l6ZX08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlVSTCcpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHRcdDxhIGhyZWY9e3RoaXMucHJvcHMuZmlsZS51cmx9IHRhcmdldD0nX2JsYW5rJz57dGhpcy5wcm9wcy5maWxlLnVybH08L2E+XG5cdFx0XHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5DUkVBVEVEJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5jcmVhdGVkfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5MQVNURURJVCcpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUubGFzdFVwZGF0ZWR9PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5ESU0nKX06PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy53aWR0aH0geCB7dGhpcy5wcm9wcy5maWxlLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy5oZWlnaHR9cHg8L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdHt0aGlzLnByb3BzLmdhbGxlcnkuZWRpdG9yRmllbGRzLm1hcCgoZmllbGQsIGkpID0+IHtcblx0XHRcdFx0cmV0dXJuIDxUZXh0RmllbGRDb21wb25lbnRcblx0XHRcdFx0XHRcdGtleT17aX1cblx0XHRcdFx0XHRcdGxhYmVsPXtmaWVsZC5sYWJlbH1cblx0XHRcdFx0XHRcdG5hbWU9e2ZpZWxkLm5hbWV9XG5cdFx0XHRcdFx0XHR2YWx1ZT17ZmllbGQudmFsdWV9XG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5vbkZpZWxkQ2hhbmdlfSAvPlxuXHRcdFx0fSl9XG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0dHlwZT0nc3VibWl0J1xuXHRcdFx0XHRcdGNsYXNzTmFtZT1cInNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tY2hlY2stbWFya1wiXG5cdFx0XHRcdFx0b25DbGljaz17dGhpcy5vbkZpbGVTYXZlfT5cblx0XHRcdFx0XHR7aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0FWRScpfVxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0XHRjbGFzc05hbWU9XCJzcy11aS1idXR0b24gdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkXCJcblx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uQ2FuY2VsfT5cblx0XHRcdFx0XHR7aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQ0FOQ0VMJyl9XG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+O1xuXHR9XG59XG5cbkVkaXRvckNvbnRhaW5lci5wcm9wVHlwZXMgPSB7XG5cdGZpbGU6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0aWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdFx0dGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0YmFzZW5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dXJsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHNpemU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0Y3JlYXRlZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRsYXN0VXBkYXRlZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRkaW1lbnNpb25zOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHRcdFx0d2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdFx0XHRoZWlnaHQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcblx0XHR9KVxuXHR9KSxcblx0b25GaWxlU2F2ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdG9uQ2FuY2VsOlJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcblx0cmV0dXJuIHtcblx0XHRnYWxsZXJ5OiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnlcblx0fVxufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0cmV0dXJuIHtcblx0XHRhY3Rpb25zOiBiaW5kQWN0aW9uQ3JlYXRvcnMoZ2FsbGVyeUFjdGlvbnMsIGRpc3BhdGNoKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEVkaXRvckNvbnRhaW5lcik7XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgYmluZEFjdGlvbkNyZWF0b3JzIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0IFJlYWN0VGVzdFV0aWxzIGZyb20gJ3JlYWN0LWFkZG9ucy10ZXN0LXV0aWxzJztcbmltcG9ydCBGaWxlQ29tcG9uZW50IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZmlsZS9pbmRleCc7XG5pbXBvcnQgRWRpdG9yQ29udGFpbmVyIGZyb20gJy4uL2VkaXRvci9jb250cm9sbGVyLmpzJztcbmltcG9ydCBCdWxrQWN0aW9uc0NvbXBvbmVudCBmcm9tICcuLi8uLi9jb21wb25lbnRzL2J1bGstYWN0aW9ucy9pbmRleCc7XG5pbXBvcnQgU2lsdmVyU3RyaXBlQ29tcG9uZW50IGZyb20gJ3NpbHZlcnN0cmlwZS1jb21wb25lbnQnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xuaW1wb3J0ICogYXMgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vLi4vc3RhdGUvZ2FsbGVyeS9hY3Rpb25zJztcblxuZnVuY3Rpb24gZ2V0Q29tcGFyYXRvcihmaWVsZCwgZGlyZWN0aW9uKSB7XG5cdHJldHVybiAoYSwgYikgPT4ge1xuXHRcdGNvbnN0IGZpZWxkQSA9IGFbZmllbGRdLnRvTG93ZXJDYXNlKCk7XG5cdFx0Y29uc3QgZmllbGRCID0gYltmaWVsZF0udG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdhc2MnKSB7XG5cdFx0XHRpZiAoZmllbGRBIDwgZmllbGRCKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZpZWxkQSA+IGZpZWxkQikge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGZpZWxkQSA+IGZpZWxkQikge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmaWVsZEEgPCBmaWVsZEIpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDA7XG5cdH07XG59XG5cbmNsYXNzIEdhbGxlcnlDb250YWluZXIgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5mb2xkZXJzID0gW3Byb3BzLmluaXRpYWxfZm9sZGVyXTtcblxuXHRcdHRoaXMuc29ydCA9ICduYW1lJztcblx0XHR0aGlzLmRpcmVjdGlvbiA9ICdhc2MnO1xuXG5cdFx0dGhpcy5zb3J0ZXJzID0gW1xuXHRcdFx0e1xuXHRcdFx0XHRmaWVsZDogJ3RpdGxlJyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnYXNjJyxcblx0XHRcdFx0bGFiZWw6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkZJTFRFUl9USVRMRV9BU0MnKVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0ZmllbGQ6ICd0aXRsZScsXG5cdFx0XHRcdGRpcmVjdGlvbjogJ2Rlc2MnLFxuXHRcdFx0XHRsYWJlbDogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRklMVEVSX1RJVExFX0RFU0MnKVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0ZmllbGQ6ICdjcmVhdGVkJyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnZGVzYycsXG5cdFx0XHRcdGxhYmVsOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfREFURV9ERVNDJylcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGZpZWxkOiAnY3JlYXRlZCcsXG5cdFx0XHRcdGRpcmVjdGlvbjogJ2FzYycsXG5cdFx0XHRcdGxhYmVsOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfREFURV9BU0MnKVxuXHRcdFx0fVxuXHRcdF07XG5cblx0XHQvLyBCYWNrZW5kIGV2ZW50IGxpc3RlbmVyc1xuXHRcdHRoaXMub25GZXRjaERhdGEgPSB0aGlzLm9uRmV0Y2hEYXRhLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vblNhdmVEYXRhID0gdGhpcy5vblNhdmVEYXRhLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbkRlbGV0ZURhdGEgPSB0aGlzLm9uRGVsZXRlRGF0YS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25OYXZpZ2F0ZURhdGEgPSB0aGlzLm9uTmF2aWdhdGVEYXRhLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbk1vcmVEYXRhID0gdGhpcy5vbk1vcmVEYXRhLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vblNlYXJjaERhdGEgPSB0aGlzLm9uU2VhcmNoRGF0YS5iaW5kKHRoaXMpO1xuXG5cdFx0Ly8gVXNlciBldmVudCBsaXN0ZW5lcnNcblx0XHR0aGlzLm9uRmlsZVNhdmUgPSB0aGlzLm9uRmlsZVNhdmUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZU5hdmlnYXRlID0gdGhpcy5vbkZpbGVOYXZpZ2F0ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25GaWxlRGVsZXRlID0gdGhpcy5vbkZpbGVEZWxldGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uQmFja0NsaWNrID0gdGhpcy5vbkJhY2tDbGljay5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25Nb3JlQ2xpY2sgPSB0aGlzLm9uTW9yZUNsaWNrLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbk5hdmlnYXRlID0gdGhpcy5vbk5hdmlnYXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVTb3J0ID0gdGhpcy5oYW5kbGVTb3J0LmJpbmQodGhpcyk7XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHRzdXBlci5jb21wb25lbnREaWRNb3VudCgpO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMuaW5pdGlhbF9mb2xkZXIgIT09IHRoaXMucHJvcHMuY3VycmVudF9mb2xkZXIpIHtcblx0XHRcdHRoaXMub25OYXZpZ2F0ZSh0aGlzLnByb3BzLmN1cnJlbnRfZm9sZGVyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLnNlYXJjaCgpO1xuXHRcdH1cblxuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5vbignb25GZXRjaERhdGEnLCB0aGlzLm9uRmV0Y2hEYXRhKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQub24oJ29uU2F2ZURhdGEnLCB0aGlzLm9uU2F2ZURhdGEpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5vbignb25EZWxldGVEYXRhJywgdGhpcy5vbkRlbGV0ZURhdGEpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5vbignb25OYXZpZ2F0ZURhdGEnLCB0aGlzLm9uTmF2aWdhdGVEYXRhKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQub24oJ29uTW9yZURhdGEnLCB0aGlzLm9uTW9yZURhdGEpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5vbignb25TZWFyY2hEYXRhJywgdGhpcy5vblNlYXJjaERhdGEpO1xuXHRcdFxuXHRcdGxldCAkc2VsZWN0ID0gJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmdhbGxlcnlfX3NvcnQgLmRyb3Bkb3duJyk7XG5cdFx0XG5cdFx0Ly8gV2Ugb3B0LW91dCBvZiBsZXR0aW5nIHRoZSBDTVMgaGFuZGxlIENob3NlbiBiZWNhdXNlIGl0IGRvZXNuJ3QgcmUtYXBwbHkgdGhlIGJlaGF2aW91ciBjb3JyZWN0bHkuXG5cdFx0Ly8gU28gYWZ0ZXIgdGhlIGdhbGxlcnkgaGFzIGJlZW4gcmVuZGVyZWQgd2UgYXBwbHkgQ2hvc2VuLlxuXHRcdCRzZWxlY3QuY2hvc2VuKHtcblx0XHRcdCdhbGxvd19zaW5nbGVfZGVzZWxlY3QnOiB0cnVlLFxuXHRcdFx0J2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCc6IDIwXG5cdFx0fSk7XG5cblx0XHQvL0Nob3NlbiBzdG9wcyB0aGUgY2hhbmdlIGV2ZW50IGZyb20gcmVhY2hpbmcgUmVhY3Qgc28gd2UgaGF2ZSB0byBzaW11bGF0ZSBhIGNsaWNrLlxuXHRcdCRzZWxlY3QuY2hhbmdlKCgpID0+IFJlYWN0VGVzdFV0aWxzLlNpbXVsYXRlLmNsaWNrKCRzZWxlY3QuZmluZCgnOnNlbGVjdGVkJylbMF0pKTtcblx0fVxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuXHRcdHN1cGVyLmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cblx0XHR0aGlzLnByb3BzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uRmV0Y2hEYXRhJywgdGhpcy5vbkZldGNoRGF0YSk7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLnJlbW92ZUxpc3RlbmVyKCdvblNhdmVEYXRhJywgdGhpcy5vblNhdmVEYXRhKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uRGVsZXRlRGF0YScsIHRoaXMub25EZWxldGVEYXRhKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uTmF2aWdhdGVEYXRhJywgdGhpcy5vbk5hdmlnYXRlRGF0YSk7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLnJlbW92ZUxpc3RlbmVyKCdvbk1vcmVEYXRhJywgdGhpcy5vbk1vcmVEYXRhKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uU2VhcmNoRGF0YScsIHRoaXMub25TZWFyY2hEYXRhKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyB0aGUgc29ydCBvcmRlci5cblx0ICpcblx0ICogQHBhcmFtIG9iamVjdCBldmVudCAtIENsaWNrIGV2ZW50LlxuXHQgKi9cblx0aGFuZGxlU29ydChldmVudCkge1xuXHRcdGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQuZGF0YXNldDtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuc29ydEZpbGVzKGdldENvbXBhcmF0b3IoZGF0YS5maWVsZCwgZGF0YS5kaXJlY3Rpb24pKTtcblx0fVxuXG5cdGdldEZpbGVCeUlkKGlkKSB7XG5cdFx0dmFyIGZvbGRlciA9IG51bGw7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZ2FsbGVyeS5maWxlcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0aWYgKHRoaXMucHJvcHMuZ2FsbGVyeS5maWxlc1tpXS5pZCA9PT0gaWQpIHtcblx0XHRcdFx0Zm9sZGVyID0gdGhpcy5wcm9wcy5nYWxsZXJ5LmZpbGVzW2ldO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZm9sZGVyO1xuXHR9XG5cdFxuXHRnZXROb0l0ZW1zTm90aWNlKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmdhbGxlcnkuY291bnQgPCAxKSB7XG5cdFx0XHRyZXR1cm4gPHAgY2xhc3NOYW1lPVwiZ2FsbGVyeV9fbm8taXRlbS1ub3RpY2VcIj57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuTk9JVEVNU0ZPVU5EJyl9PC9wPjtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRCYWNrQnV0dG9uKCkge1xuXHRcdGlmICh0aGlzLmZvbGRlcnMubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuIDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPSdnYWxsZXJ5X19iYWNrIHNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tbGV2ZWwtdXAgbm8tdGV4dCdcblx0XHRcdFx0b25DbGljaz17dGhpcy5vbkJhY2tDbGlja31cblx0XHRcdFx0cmVmPVwiYmFja0J1dHRvblwiPjwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGdldEJ1bGtBY3Rpb25zQ29tcG9uZW50KCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmdhbGxlcnkuc2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwICYmIHRoaXMucHJvcHMuYmFja2VuZC5idWxrQWN0aW9ucykge1xuXHRcdFx0cmV0dXJuIDxCdWxrQWN0aW9uc0NvbXBvbmVudFxuXHRcdFx0XHRiYWNrZW5kPXt0aGlzLnByb3BzLmJhY2tlbmR9IC8+O1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Z2V0TW9yZUJ1dHRvbigpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LmNvdW50ID4gdGhpcy5wcm9wcy5nYWxsZXJ5LmZpbGVzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPVwiZ2FsbGVyeV9fbG9hZF9fbW9yZVwiXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25Nb3JlQ2xpY2t9PntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5MT0FETU9SRScpfTwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LmVkaXRpbmcgIT09IGZhbHNlKSB7XG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuXHRcdFx0XHQ8RWRpdG9yQ29udGFpbmVyXG5cdFx0XHRcdFx0ZmlsZT17dGhpcy5wcm9wcy5nYWxsZXJ5LmVkaXRpbmd9XG5cdFx0XHRcdFx0b25GaWxlU2F2ZT17dGhpcy5vbkZpbGVTYXZlfVxuXHRcdFx0XHRcdG9uQ2FuY2VsPXt0aGlzLm9uQ2FuY2VsfSAvPlxuXHRcdFx0PC9kaXY+O1xuXHRcdH1cblxuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG5cdFx0XHR7dGhpcy5nZXRCYWNrQnV0dG9uKCl9XG5cdFx0XHR7dGhpcy5nZXRCdWxrQWN0aW9uc0NvbXBvbmVudCgpfVxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5X19zb3J0IGZpZWxkaG9sZGVyLXNtYWxsXCI+XG5cdFx0XHRcdDxzZWxlY3QgY2xhc3NOYW1lPVwiZHJvcGRvd24gbm8tY2hhbmdlLXRyYWNrIG5vLWNoem5cIiB0YWJJbmRleD1cIjBcIiBzdHlsZT17e3dpZHRoOiAnMTYwcHgnfX0+XG5cdFx0XHRcdFx0e3RoaXMuc29ydGVycy5tYXAoKHNvcnRlciwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDxvcHRpb25cblx0XHRcdFx0XHRcdFx0XHRrZXk9e2l9XG5cdFx0XHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5oYW5kbGVTb3J0fVxuXHRcdFx0XHRcdFx0XHRcdGRhdGEtZmllbGQ9e3NvcnRlci5maWVsZH1cblx0XHRcdFx0XHRcdFx0XHRkYXRhLWRpcmVjdGlvbj17c29ydGVyLmRpcmVjdGlvbn0+e3NvcnRlci5sYWJlbH08L29wdGlvbj47XG5cdFx0XHRcdFx0fSl9XG5cdFx0XHRcdDwvc2VsZWN0PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeV9faXRlbXMnPlxuXHRcdFx0XHR7dGhpcy5wcm9wcy5nYWxsZXJ5LmZpbGVzLm1hcCgoZmlsZSwgaSkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiA8RmlsZUNvbXBvbmVudCBrZXk9e2l9IHsuLi5maWxlfVxuXHRcdFx0XHRcdFx0c3BhY2VLZXk9e0NPTlNUQU5UUy5TUEFDRV9LRVlfQ09ERX1cblx0XHRcdFx0XHRcdHJldHVybktleT17Q09OU1RBTlRTLlJFVFVSTl9LRVlfQ09ERX1cblx0XHRcdFx0XHRcdG9uRmlsZURlbGV0ZT17dGhpcy5vbkZpbGVEZWxldGV9XG5cdFx0XHRcdFx0XHRvbkZpbGVOYXZpZ2F0ZT17dGhpcy5vbkZpbGVOYXZpZ2F0ZX0gLz47XG5cdFx0XHRcdH0pfVxuXHRcdFx0PC9kaXY+XG5cdFx0XHR7dGhpcy5nZXROb0l0ZW1zTm90aWNlKCl9XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX2xvYWRcIj5cblx0XHRcdFx0e3RoaXMuZ2V0TW9yZUJ1dHRvbigpfVxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+O1xuXHR9XG5cblx0b25GZXRjaERhdGEoZGF0YSkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlKGRhdGEuZmlsZXMsIGRhdGEuY291bnQpO1xuXHR9XG5cblx0b25TYXZlRGF0YShpZCwgdmFsdWVzKSB7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLnNldEVkaXRpbmcoZmFsc2UpO1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy51cGRhdGVGaWxlKGlkLCB7IHRpdGxlOiB2YWx1ZXMudGl0bGUsIGJhc2VuYW1lOiB2YWx1ZXMuYmFzZW5hbWUgfSk7XG5cdH1cblxuXHRvbkRlbGV0ZURhdGEoZGF0YSkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5yZW1vdmVGaWxlKGRhdGEpO1xuXHR9XG5cblx0b25OYXZpZ2F0ZURhdGEoZGF0YSkge1xuXHRcdC8vIFJlbW92ZSBmaWxlcyBmcm9tIHRoZSBwcmV2aW91cyBmb2xkZXIgZnJvbSB0aGUgc3RhdGVcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMucmVtb3ZlRmlsZSgpO1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlKGRhdGEuZmlsZXMsIGRhdGEuY291bnQpO1xuXHR9XG5cblx0b25Nb3JlRGF0YShkYXRhKSB7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmFkZEZpbGUodGhpcy5wcm9wcy5nYWxsZXJ5LmZpbGVzLmNvbmNhdChkYXRhLmZpbGVzKSwgZGF0YS5jb3VudCk7XG5cdH1cblxuXHRvblNlYXJjaERhdGEoZGF0YSkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlKGRhdGEuZmlsZXMsIGRhdGEuY291bnQpO1xuXHR9XG5cblx0b25GaWxlRGVsZXRlKGZpbGUsIGV2ZW50KSB7XG5cdFx0aWYgKGNvbmZpcm0oaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQ09ORklSTURFTEVURScpKSkge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLmRlbGV0ZShmaWxlLmlkKTtcblx0XHR9XG5cblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fVxuXG5cdG9uRmlsZU5hdmlnYXRlKGZpbGUpIHtcblx0XHR0aGlzLmZvbGRlcnMucHVzaChmaWxlLmZpbGVuYW1lKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQubmF2aWdhdGUoZmlsZS5maWxlbmFtZSk7XG5cblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuZGVzZWxlY3RGaWxlcygpO1xuXHR9XG5cblx0b25OYXZpZ2F0ZShmb2xkZXIsIHNpbGVudCA9IGZhbHNlKSB7XG5cdFx0Ly8gRG9uJ3QgcHVzaCB0aGUgZm9sZGVyIHRvIHRoZSBhcnJheSBpZiBpdCBleGlzdHMgYWxyZWFkeS5cblx0XHRpZiAodGhpcy5mb2xkZXJzLmluZGV4T2YoZm9sZGVyKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMuZm9sZGVycy5wdXNoKGZvbGRlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm5hdmlnYXRlKGZvbGRlcik7XG5cdH1cblxuXHRvbk1vcmVDbGljayhldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm1vcmUoKTtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRvbkJhY2tDbGljayhldmVudCkge1xuXHRcdGlmICh0aGlzLmZvbGRlcnMubGVuZ3RoID4gMSkge1xuXHRcdFx0dGhpcy5mb2xkZXJzLnBvcCgpO1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm5hdmlnYXRlKHRoaXMuZm9sZGVyc1t0aGlzLmZvbGRlcnMubGVuZ3RoIC0gMV0pO1xuXHRcdH1cblxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5kZXNlbGVjdEZpbGVzKCk7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0b25GaWxlU2F2ZShpZCwgc3RhdGUsIGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLnNhdmUoaWQsIHN0YXRlKTtcblxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cbn1cblxuR2FsbGVyeUNvbnRhaW5lci5wcm9wVHlwZXMgPSB7XG5cdGJhY2tlbmQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdHJldHVybiB7XG5cdFx0Z2FsbGVyeTogc3RhdGUuYXNzZXRBZG1pbi5nYWxsZXJ5XG5cdH1cbn1cblxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XG5cdHJldHVybiB7XG5cdFx0YWN0aW9uczogYmluZEFjdGlvbkNyZWF0b3JzKGdhbGxlcnlBY3Rpb25zLCBkaXNwYXRjaClcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShHYWxsZXJ5Q29udGFpbmVyKTtcbiIsImV4cG9ydCBjb25zdCBHQUxMRVJZID0ge1xuICAgIEFERF9GSUxFOiAnQUREX0ZJTEUnLFxuICAgIFJFTU9WRV9GSUxFOiAnUkVNT1ZFX0ZJTEUnLFxuICAgIFVQREFURV9GSUxFOiAnVVBEQVRFX0ZJTEUnLFxuICAgIFNFTEVDVF9GSUxFUzogJ1NFTEVDVF9GSUxFUycsXG4gICAgREVTRUxFQ1RfRklMRVM6ICdERVNFTEVDVF9GSUxFUycsXG4gICAgU0VUX0VESVRJTkc6ICdTRVRfRURJVElORycsXG4gICAgU0VUX0ZPQ1VTOiAnU0VUX0ZPQ1VTJyxcbiAgICBTRVRfRURJVE9SX0ZJRUxEUzogJ1NFVF9FRElUT1JfRklFTERTJyxcbiAgICBVUERBVEVfRURJVE9SX0ZJRUxEOiAnVVBEQVRFX0VESVRPUl9GSUVMRCcsXG4gICAgU09SVF9GSUxFUzogJ1NPUlRfRklMRVMnXG59O1xuIiwiLyoqXG4gKiBAZmlsZSBGYWN0b3J5IGZvciBjcmVhdGluZyBhIFJlZHV4IHN0b3JlLlxuICovXG5cbmltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgdGh1bmtNaWRkbGV3YXJlIGZyb20gJ3JlZHV4LXRodW5rJzsgLy8gVXNlZCBmb3IgaGFuZGxpbmcgYXN5bmMgc3RvcmUgdXBkYXRlcy5cbmltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAncmVkdXgtbG9nZ2VyJzsgLy8gTG9ncyBzdGF0ZSBjaGFuZ2VzIHRvIHRoZSBjb25zb2xlLiBVc2VmdWwgZm9yIGRlYnVnZ2luZy5cbmltcG9ydCByb290UmVkdWNlciBmcm9tICcuL3JlZHVjZXInO1xuXG4vKipcbiAqIEBmdW5jIGNyZWF0ZVN0b3JlV2l0aE1pZGRsZXdhcmVcbiAqIEBwYXJhbSBmdW5jdGlvbiByb290UmVkdWNlclxuICogQHBhcmFtIG9iamVjdCBpbml0aWFsU3RhdGVcbiAqIEBkZXNjIENyZWF0ZXMgYSBSZWR1eCBzdG9yZSB3aXRoIHNvbWUgbWlkZGxld2FyZSBhcHBsaWVkLlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgY3JlYXRlU3RvcmVXaXRoTWlkZGxld2FyZSA9IGFwcGx5TWlkZGxld2FyZShcblx0dGh1bmtNaWRkbGV3YXJlLFxuXHRjcmVhdGVMb2dnZXIoKVxuKShjcmVhdGVTdG9yZSk7XG5cbi8qKlxuICogQGZ1bmMgY29uZmlndXJlU3RvcmVcbiAqIEBwYXJhbSBvYmplY3QgaW5pdGlhbFN0YXRlXG4gKiBAcmV0dXJuIG9iamVjdCAtIEEgUmVkdXggc3RvcmUgdGhhdCBsZXRzIHlvdSByZWFkIHRoZSBzdGF0ZSwgZGlzcGF0Y2ggYWN0aW9ucyBhbmQgc3Vic2NyaWJlIHRvIGNoYW5nZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbmZpZ3VyZVN0b3JlKGluaXRpYWxTdGF0ZSA9IHt9KSB7XG5cdGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmVXaXRoTWlkZGxld2FyZShyb290UmVkdWNlciwgaW5pdGlhbFN0YXRlKTtcblxuXHRyZXR1cm4gc3RvcmU7XG59OyIsImltcG9ydCB7IEdBTExFUlkgfSBmcm9tICcuLi9hY3Rpb24tdHlwZXMnO1xuXG4vKipcbiAqIEFkZHMgYSBmaWxlIHRvIHN0YXRlLlxuICpcbiAqIEBwYXJhbSBvYmplY3R8YXJyYXkgZmlsZSAtIEZpbGUgb2JqZWN0IG9yIGFycmF5IG9mIGZpbGUgb2JqZWN0cy5cbiAqIEBwYXJhbSBudW1iZXIgW2NvdW50XSAtIFRoZSBudW1iZXIgb2YgZmlsZXMgaW4gdGhlIGN1cnJlbnQgdmlldy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbGUoZmlsZSwgY291bnQpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2ggKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuQUREX0ZJTEUsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGZpbGUsIGNvdW50IH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYSBmaWxlIGZyb20gdGhlIHN0YXRlLiBJZiBubyBwYXJhbSBpcyBwYXNzZWQgYWxsIGZpbGVzIGFyZSByZW1vdmVkXG4gKlxuICogQHBhcmFtIG51bWJlcnxhcnJheSBpZCAtIEZpbGUgaWQgb3IgYXJyYXkgb2YgZmlsZSBpZHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGaWxlKGlkKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoICh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlJFTU9WRV9GSUxFLFxuICAgICAgICAgICAgcGF5bG9hZDogeyBpZCB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBVcGRhdGVzIGEgZmlsZSB3aXRoIG5ldyBkYXRhLlxuICpcbiAqIEBwYXJhbSBudW1iZXIgaWQgLSBUaGUgaWQgb2YgdGhlIGZpbGUgdG8gdXBkYXRlLlxuICogQHBhcmFtIG9iamVjdCB1cGRhdGVzIC0gVGhlIG5ldyB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVGaWxlKGlkLCB1cGRhdGVzKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuVVBEQVRFX0ZJTEUsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGlkLCB1cGRhdGVzIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFNlbGVjdHMgYSBmaWxlIG9yIGZpbGVzLiBJZiBubyBwYXJhbSBpcyBwYXNzZWQgYWxsIGZpbGVzIGFyZSBzZWxlY3RlZC5cbiAqXG4gKiBAcGFyYW0gbnVtYmVyfGFycmF5IGlkcyAtIEZpbGUgaWQgb3IgYXJyYXkgb2YgZmlsZSBpZHMgdG8gc2VsZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0RmlsZXMoaWRzID0gbnVsbCkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlNFTEVDVF9GSUxFUyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgaWRzIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIERlc2VsZWN0cyBhIGZpbGUgb3IgZmlsZXMuIElmIG5vIHBhcmFtIGlzIHBhc3NlZCBhbGwgZmlsZXMgYXJlIGRlc2VsZWN0ZWQuXG4gKlxuICogQHBhcmFtIG51bWJlcnxhcnJheSBpZHMgLSBGaWxlIGlkIG9yIGFycmF5IG9mIGZpbGUgaWRzIHRvIGRlc2VsZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzZWxlY3RGaWxlcyhpZHMgPSBudWxsKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuREVTRUxFQ1RfRklMRVMsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGlkcyB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTdGFydHMgZWRpdGluZyB0aGUgZ2l2ZW4gZmlsZSBvciBzdG9wcyBlZGl0aW5nIGlmIGZhbHNlIGlzIGdpdmVuLlxuICpcbiAqIEBwYXJhbSBvYmplY3R8Ym9vbGVhbiBmaWxlIC0gVGhlIGZpbGUgdG8gZWRpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEVkaXRpbmcoZmlsZSkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlNFVF9FRElUSU5HLFxuICAgICAgICAgICAgcGF5bG9hZDogeyBmaWxlIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFNldHMgdGhlIGZvY3VzIHN0YXRlIG9mIGEgZmlsZS5cbiAqXG4gKiBAcGFyYW0gbnVtYmVyfGJvb2xlYW4gaWQgLSB0aGUgaWQgb2YgdGhlIGZpbGUgdG8gZm9jdXMgb24sIG9yIGZhbHNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Rm9jdXMoaWQpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5TRVRfRk9DVVMsXG4gICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFNldHMgdGhlIHN0YXRlIG9mIHRoZSBmaWVsZHMgZm9yIHRoZSBlZGl0b3IgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSBvYmplY3QgZWRpdG9yRmllbGRzIC0gdGhlIGN1cnJlbnQgZmllbGRzIGluIHRoZSBlZGl0b3IgY29tcG9uZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRFZGl0b3JGaWVsZHMoZWRpdG9yRmllbGRzID0gW10pIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuXHRcdHJldHVybiBkaXNwYXRjaCAoe1xuXHRcdFx0dHlwZTogR0FMTEVSWS5TRVRfRURJVE9SX0ZJRUxEUyxcblx0XHRcdHBheWxvYWQ6IHsgZWRpdG9yRmllbGRzIH1cblx0XHR9KTtcblx0fVxufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmFsdWUgb2YgdGhlIGdpdmVuIGZpZWxkLlxuICpcbiAqIEBwYXJhbSBvYmplY3QgdXBkYXRlcyAtIFRoZSB2YWx1ZXMgdG8gdXBkYXRlIHRoZSBlZGl0b3IgZmllbGQgd2l0aC5cbiAqIEBwYXJhbSBzdHJpbmcgdXBkYXRlcy5uYW1lIC0gVGhlIGVkaXRvciBmaWVsZCBuYW1lLlxuICogQHBhcmFtIHN0cmluZyB1cGRhdGVzLnZhbHVlIC0gVGhlIG5ldyB2YWx1ZSBvZiB0aGUgZmllbGQuXG4gKiBAcGFyYW0gc3RyaW5nIFt1cGRhdGVzLmxhYmVsXSAtIFRoZSBmaWVsZCBsYWJlbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUVkaXRvckZpZWxkKHVwZGF0ZXMpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuXHRcdHJldHVybiBkaXNwYXRjaCAoe1xuXHRcdFx0dHlwZTogR0FMTEVSWS5VUERBVEVfRURJVE9SX0ZJRUxELFxuXHRcdFx0cGF5bG9hZDogeyB1cGRhdGVzIH1cblx0XHR9KTtcblx0fVxufVxuXG4vKipcbiAqIFNvcnRzIGZpbGVzIGluIHNvbWUgb3JkZXIuXG4gKlxuICogQHBhcmFtIGZ1bmMgY29tcGFyYXRvciAtIFVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBzb3J0IG9yZGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc29ydEZpbGVzKGNvbXBhcmF0b3IpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5TT1JUX0ZJTEVTLFxuICAgICAgICAgICAgcGF5bG9hZDogeyBjb21wYXJhdG9yIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IGRlZXBGcmVlemUgZnJvbSAnZGVlcC1mcmVlemUnO1xuaW1wb3J0IHsgR0FMTEVSWSB9IGZyb20gJy4uL2FjdGlvbi10eXBlcyc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uLy4uL2NvbnN0YW50cy5qcyc7XG5cbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICBjb3VudDogMCwgLy8gVGhlIG51bWJlciBvZiBmaWxlcyBpbiB0aGUgY3VycmVudCB2aWV3XG4gICAgZWRpdGluZzogZmFsc2UsXG4gICAgZmlsZXM6IFtdLFxuICAgIHNlbGVjdGVkRmlsZXM6IFtdLFxuICAgIGVkaXRpbmc6IGZhbHNlLFxuICAgIGZvY3VzOiBmYWxzZSxcbiAgICBidWxrQWN0aW9uczoge1xuICAgICAgICBwbGFjZWhvbGRlcjogQ09OU1RBTlRTLkJVTEtfQUNUSU9OU19QTEFDRUhPTERFUixcbiAgICAgICAgb3B0aW9uczogQ09OU1RBTlRTLkJVTEtfQUNUSU9OU1xuICAgIH0sXG4gICAgZWRpdG9yRmllbGRzOiBbXVxufTtcblxuLyoqXG4gKiBSZWR1Y2VyIGZvciB0aGUgYGFzc2V0QWRtaW4uZ2FsbGVyeWAgc3RhdGUga2V5LlxuICpcbiAqIEBwYXJhbSBvYmplY3Qgc3RhdGVcbiAqIEBwYXJhbSBvYmplY3QgYWN0aW9uIC0gVGhlIGRpc3BhdGNoZWQgYWN0aW9uLlxuICogQHBhcmFtIHN0cmluZyBhY3Rpb24udHlwZSAtIE5hbWUgb2YgdGhlIGRpc3BhdGNoZWQgYWN0aW9uLlxuICogQHBhcmFtIG9iamVjdCBbYWN0aW9uLnBheWxvYWRdIC0gT3B0aW9uYWwgZGF0YSBwYXNzZWQgd2l0aCB0aGUgYWN0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnYWxsZXJ5UmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG5cbiAgICB2YXIgbmV4dFN0YXRlO1xuXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIEdBTExFUlkuQUREX0ZJTEU6XG4gICAgICAgICAgICBsZXQgbmV4dEZpbGVzU3RhdGUgPSBbXTsgLy8gQ2xvbmUgdGhlIHN0YXRlLmZpbGVzIGFycmF5XG5cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYWN0aW9uLnBheWxvYWQuZmlsZSkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBhbiBhcnJheSBvZiBvYmplY3QgaXMgZ2l2ZW5cbiAgICAgICAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5maWxlLmZvckVhY2gocGF5bG9hZEZpbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZUluU3RhdGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5maWxlcy5mb3JFYWNoKHN0YXRlRmlsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBlYWNoIGZpbGUgZ2l2ZW4gaXMgYWxyZWFkeSBpbiB0aGUgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZUZpbGUuaWQgPT09IHBheWxvYWRGaWxlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZUluU3RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gT25seSBhZGQgdGhlIGZpbGUgaWYgaXQgaXNuJ3QgYWxyZWFkeSBpbiB0aGUgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWxlSW5TdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEZpbGVzU3RhdGUucHVzaChwYXlsb2FkRmlsZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnBheWxvYWQuZmlsZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAvLyBFbHNlIGlmIGEgc2luZ2xlIGl0ZW0gaXMgZ2l2ZW5cbiAgICAgICAgICAgICAgICBsZXQgZmlsZUluU3RhdGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHN0YXRlLmZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBmaWxlIGdpdmVuIGlzIGFscmVhZHkgaW4gdGhlIHN0YXRlXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlLmlkID09PSBhY3Rpb24ucGF5bG9hZC5maWxlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlSW5TdGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBPbmx5IGFkZCB0aGUgZmlsZSBpZiBpdCBpc24ndCBhbHJlYWR5IGluIHRoZSBzdGF0ZVxuICAgICAgICAgICAgICAgIGlmICghZmlsZUluU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEZpbGVzU3RhdGUucHVzaChhY3Rpb24ucGF5bG9hZC5maWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgY291bnQ6IHR5cGVvZiBhY3Rpb24ucGF5bG9hZC5jb3VudCAhPT0gJ3VuZGVmaW5lZCcgPyBhY3Rpb24ucGF5bG9hZC5jb3VudCA6IHN0YXRlLmNvdW50LFxuICAgICAgICAgICAgICAgIGZpbGVzOiBzdGF0ZS5maWxlcy5jb25jYXQobmV4dEZpbGVzU3RhdGUpXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlJFTU9WRV9GSUxFOlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24ucGF5bG9hZC5pZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBwYXJhbSB3YXMgcGFzc2VkLCByZW1vdmUgZXZlcnl0aGluZy5cbiAgICAgICAgICAgICAgICBuZXh0U3RhdGUgPSBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGNvdW50OiAwLCBmaWxlczogW10gfSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnBheWxvYWQuaWQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZGVhbGluZyB3aXRoIGEgc2luZ2xlIGZpbGUgdG8gcmVtb3ZlLlxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IHN0YXRlLmNvdW50IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZXM6IHN0YXRlLmZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuaWQgIT09IGFjdGlvbi5wYXlsb2FkLmlkKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZGVhbGluZyB3aXRoIGFuIGFycmF5IG9mIGlkc1xuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IHN0YXRlLmNvdW50IC0gYWN0aW9uLnBheWxvYWQuaWQubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBmaWxlczogc3RhdGUuZmlsZXMuZmlsdGVyKGZpbGUgPT4gYWN0aW9uLnBheWxvYWQuaWQuaW5kZXhPZihmaWxlLmlkKSA9PT0gLTEpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV4dFN0YXRlO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5VUERBVEVfRklMRTpcbiAgICAgICAgICAgIGxldCBmaWxlSW5kZXggPSBzdGF0ZS5maWxlcy5tYXAoZmlsZSA9PiBmaWxlLmlkKS5pbmRleE9mKGFjdGlvbi5wYXlsb2FkLmlkKTtcbiAgICAgICAgICAgIGxldCB1cGRhdGVkRmlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmZpbGVzW2ZpbGVJbmRleF0sIGFjdGlvbi5wYXlsb2FkLnVwZGF0ZXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGZpbGVzOiBzdGF0ZS5maWxlcy5tYXAoZmlsZSA9PiBmaWxlLmlkID09PSB1cGRhdGVkRmlsZS5pZCA/IHVwZGF0ZWRGaWxlIDogZmlsZSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBjYXNlIEdBTExFUlkuU0VMRUNUX0ZJTEVTOlxuICAgICAgICAgICAgaWYgKGFjdGlvbi5wYXlsb2FkLmlkcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIE5vIHBhcmFtIHdhcyBwYXNzZWQsIGFkZCBldmVyeXRoaW5nIHRoYXQgaXNuJ3QgY3VycmVudGx5IHNlbGVjdGVkLCB0byB0aGUgc2VsZWN0ZWRGaWxlcyBhcnJheS5cbiAgICAgICAgICAgICAgICBuZXh0U3RhdGUgPSBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmlsZXM6IHN0YXRlLnNlbGVjdGVkRmlsZXMuY29uY2F0KHN0YXRlLmZpbGVzLm1hcChmaWxlID0+IGZpbGUuaWQpLmZpbHRlcihpZCA9PiBzdGF0ZS5zZWxlY3RlZEZpbGVzLmluZGV4T2YoaWQpID09PSAtMSkpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnBheWxvYWQuaWRzID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGRlYWxpbmcgd2l0aCBhIHNpbmdsZSBpZCB0byBzZWxlY3QuXG4gICAgICAgICAgICAgICAgLy8gQWRkIHRoZSBmaWxlIGlmIGl0J3Mgbm90IGFscmVhZHkgc2VsZWN0ZWQuXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLnNlbGVjdGVkRmlsZXMuaW5kZXhPZihhY3Rpb24ucGF5bG9hZC5pZHMpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0U3RhdGUgPSBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEZpbGVzOiBzdGF0ZS5zZWxlY3RlZEZpbGVzLmNvbmNhdChhY3Rpb24ucGF5bG9hZC5pZHMpXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZmlsZSBpcyBhbHJlYWR5IHNlbGVjdGVkLCBzbyByZXR1cm4gdGhlIGN1cnJlbnQgc3RhdGUuXG4gICAgICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZGVhbGluZyB3aXRoIGFuIGFycmF5IGlmIGlkcyB0byBzZWxlY3QuXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEZpbGVzOiBzdGF0ZS5zZWxlY3RlZEZpbGVzLmNvbmNhdChhY3Rpb24ucGF5bG9hZC5pZHMuZmlsdGVyKGlkID0+IHN0YXRlLnNlbGVjdGVkRmlsZXMuaW5kZXhPZihpZCkgPT09IC0xKSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLkRFU0VMRUNUX0ZJTEVTOlxuICAgICAgICAgICAgaWYgKGFjdGlvbi5wYXlsb2FkLmlkcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIE5vIHBhcmFtIHdhcyBwYXNzZWQsIGRlc2VsZWN0IGV2ZXJ5dGhpbmcuXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBzZWxlY3RlZEZpbGVzOiBbXSB9KSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24ucGF5bG9hZC5pZHMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZGVhbGluZyB3aXRoIGEgc2luZ2xlIGlkIHRvIGRlc2VsZWN0LlxuICAgICAgICAgICAgICAgIGxldCBmaWxlSW5kZXggPSBzdGF0ZS5zZWxlY3RlZEZpbGVzLmluZGV4T2YoYWN0aW9uLnBheWxvYWQuaWRzKTtcblxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGaWxlczogc3RhdGUuc2VsZWN0ZWRGaWxlcy5zbGljZSgwLCBmaWxlSW5kZXgpLmNvbmNhdChzdGF0ZS5zZWxlY3RlZEZpbGVzLnNsaWNlKGZpbGVJbmRleCArIDEpKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZGVhbGluZyB3aXRoIGFuIGFycmF5IG9mIGlkcyB0byBkZXNlbGVjdC5cbiAgICAgICAgICAgICAgICBuZXh0U3RhdGUgPSBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmlsZXM6IHN0YXRlLnNlbGVjdGVkRmlsZXMuZmlsdGVyKGlkID0+IGFjdGlvbi5wYXlsb2FkLmlkcy5pbmRleE9mKGlkKSA9PT0gLTEpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV4dFN0YXRlO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5TRVRfRURJVElORzpcbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZWRpdGluZzogYWN0aW9uLnBheWxvYWQuZmlsZVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5TRVRfRk9DVVM6XG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGZvY3VzOiBhY3Rpb24ucGF5bG9hZC5pZFxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5TRVRfRURJVE9SX0ZJRUxEUzpcbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZWRpdG9yRmllbGRzOiBhY3Rpb24ucGF5bG9hZC5lZGl0b3JGaWVsZHNcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIGNhc2UgR0FMTEVSWS5VUERBVEVfRURJVE9SX0ZJRUxEOlxuICAgICAgICAgICAgbGV0IGZpZWxkSW5kZXggPSBzdGF0ZS5lZGl0b3JGaWVsZHMubWFwKGZpZWxkID0+IGZpZWxkLm5hbWUpLmluZGV4T2YoYWN0aW9uLnBheWxvYWQudXBkYXRlcy5uYW1lKSxcbiAgICAgICAgICAgICAgICB1cGRhdGVkRmllbGQgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5lZGl0b3JGaWVsZHNbZmllbGRJbmRleF0sIGFjdGlvbi5wYXlsb2FkLnVwZGF0ZXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGVkaXRvckZpZWxkczogc3RhdGUuZWRpdG9yRmllbGRzLm1hcChmaWVsZCA9PiBmaWVsZC5uYW1lID09PSB1cGRhdGVkRmllbGQubmFtZSA/IHVwZGF0ZWRGaWVsZCA6IGZpZWxkKVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgY2FzZSBHQUxMRVJZLlNPUlRfRklMRVM6XG4gICAgICAgICAgICBsZXQgZm9sZGVycyA9IHN0YXRlLmZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUudHlwZSA9PT0gJ2ZvbGRlcicpLFxuICAgICAgICAgICAgICAgIGZpbGVzID0gc3RhdGUuZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS50eXBlICE9PSAnZm9sZGVyJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZmlsZXM6IGZvbGRlcnMuc29ydChhY3Rpb24ucGF5bG9hZC5jb21wYXJhdG9yKS5jb25jYXQoZmlsZXMuc29ydChhY3Rpb24ucGF5bG9hZC5jb21wYXJhdG9yKSlcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIFRoZSByZWR1Y2VyIHdoaWNoIG9wZXJhdGVzIG9uIHRoZSBSZWR1eCBzdG9yZS5cbiAqL1xuXG5pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgZ2FsbGVyeVJlZHVjZXIgZnJvbSAnLi9nYWxsZXJ5L3JlZHVjZXIuanMnO1xuXG4vKipcbiAqIE9wZXJhdGVzIG9uIHRoZSBSZWR1eCBzdG9yZSB0byB1cGRhdGUgYXBwbGljYXRpb24gc3RhdGUuXG4gKlxuICogQHBhcmFtIG9iamVjdCBzdGF0ZSAtIFRoZSBjdXJyZW50IHN0YXRlLlxuICogQHBhcmFtIG9iamVjdCBhY3Rpb24gLSBUaGUgZGlzcGF0Y2hlZCBhY3Rpb24uXG4gKiBAcGFyYW0gc3RyaW5nIGFjdGlvbi50eXBlIC0gVGhlIHR5cGUgb2YgYWN0aW9uIHRoYXQgaGFzIGJlZW4gZGlzcGF0Y2hlZC5cbiAqIEBwYXJhbSBvYmplY3QgW2FjdGlvbi5wYXlsb2FkXSAtIE9wdGlvbmFsIGRhdGEgcGFzc2VkIHdpdGggdGhlIGFjdGlvbi5cbiAqL1xuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xuICAgIGFzc2V0QWRtaW46IGNvbWJpbmVSZWR1Y2Vycyh7XG4gICAgICAgIGdhbGxlcnk6IGdhbGxlcnlSZWR1Y2VyXG4gICAgfSlcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCByb290UmVkdWNlcjtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVlcEZyZWV6ZSAobykge1xuICBPYmplY3QuZnJlZXplKG8pO1xuXG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8pLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcm9wKVxuICAgICYmIG9bcHJvcF0gIT09IG51bGxcbiAgICAmJiAodHlwZW9mIG9bcHJvcF0gPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIG9bcHJvcF0gPT09IFwiZnVuY3Rpb25cIilcbiAgICAmJiAhT2JqZWN0LmlzRnJvemVuKG9bcHJvcF0pKSB7XG4gICAgICBkZWVwRnJlZXplKG9bcHJvcF0pO1xuICAgIH1cbiAgfSk7XG4gIFxuICByZXR1cm4gbztcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHJlcGVhdCA9IGZ1bmN0aW9uIHJlcGVhdChzdHIsIHRpbWVzKSB7XG4gIHJldHVybiBuZXcgQXJyYXkodGltZXMgKyAxKS5qb2luKHN0cik7XG59O1xudmFyIHBhZCA9IGZ1bmN0aW9uIHBhZChudW0sIG1heExlbmd0aCkge1xuICByZXR1cm4gcmVwZWF0KFwiMFwiLCBtYXhMZW5ndGggLSBudW0udG9TdHJpbmcoKS5sZW5ndGgpICsgbnVtO1xufTtcbnZhciBmb3JtYXRUaW1lID0gZnVuY3Rpb24gZm9ybWF0VGltZSh0aW1lKSB7XG4gIHJldHVybiBcIiBAIFwiICsgcGFkKHRpbWUuZ2V0SG91cnMoKSwgMikgKyBcIjpcIiArIHBhZCh0aW1lLmdldE1pbnV0ZXMoKSwgMikgKyBcIjpcIiArIHBhZCh0aW1lLmdldFNlY29uZHMoKSwgMikgKyBcIi5cIiArIHBhZCh0aW1lLmdldE1pbGxpc2Vjb25kcygpLCAzKTtcbn07XG5cbi8vIFVzZSB0aGUgbmV3IHBlcmZvcm1hbmNlIGFwaSB0byBnZXQgYmV0dGVyIHByZWNpc2lvbiBpZiBhdmFpbGFibGVcbnZhciB0aW1lciA9IHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSBcImZ1bmN0aW9uXCIgPyBwZXJmb3JtYW5jZSA6IERhdGU7XG5cbi8qKlxuICogQ3JlYXRlcyBsb2dnZXIgd2l0aCBmb2xsb3dlZCBvcHRpb25zXG4gKlxuICogQG5hbWVzcGFjZVxuICogQHByb3BlcnR5IHtvYmplY3R9IG9wdGlvbnMgLSBvcHRpb25zIGZvciBsb2dnZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBvcHRpb25zLmxldmVsIC0gY29uc29sZVtsZXZlbF1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy5kdXJhdGlvbiAtIHByaW50IGR1cmF0aW9uIG9mIGVhY2ggYWN0aW9uP1xuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLnRpbWVzdGFtcCAtIHByaW50IHRpbWVzdGFtcCB3aXRoIGVhY2ggYWN0aW9uP1xuICogQHByb3BlcnR5IHtvYmplY3R9IG9wdGlvbnMuY29sb3JzIC0gY3VzdG9tIGNvbG9yc1xuICogQHByb3BlcnR5IHtvYmplY3R9IG9wdGlvbnMubG9nZ2VyIC0gaW1wbGVtZW50YXRpb24gb2YgdGhlIGBjb25zb2xlYCBBUElcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy5sb2dFcnJvcnMgLSBzaG91bGQgZXJyb3JzIGluIGFjdGlvbiBleGVjdXRpb24gYmUgY2F1Z2h0LCBsb2dnZWQsIGFuZCByZS10aHJvd24/XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMuY29sbGFwc2VkIC0gaXMgZ3JvdXAgY29sbGFwc2VkP1xuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLnByZWRpY2F0ZSAtIGNvbmRpdGlvbiB3aGljaCByZXNvbHZlcyBsb2dnZXIgYmVoYXZpb3JcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IG9wdGlvbnMuc3RhdGVUcmFuc2Zvcm1lciAtIHRyYW5zZm9ybSBzdGF0ZSBiZWZvcmUgcHJpbnRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IG9wdGlvbnMuYWN0aW9uVHJhbnNmb3JtZXIgLSB0cmFuc2Zvcm0gYWN0aW9uIGJlZm9yZSBwcmludFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gb3B0aW9ucy5lcnJvclRyYW5zZm9ybWVyIC0gdHJhbnNmb3JtIGVycm9yIGJlZm9yZSBwcmludFxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcigpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcbiAgdmFyIF9vcHRpb25zJGxldmVsID0gb3B0aW9ucy5sZXZlbDtcbiAgdmFyIGxldmVsID0gX29wdGlvbnMkbGV2ZWwgPT09IHVuZGVmaW5lZCA/IFwibG9nXCIgOiBfb3B0aW9ucyRsZXZlbDtcbiAgdmFyIF9vcHRpb25zJGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyO1xuICB2YXIgbG9nZ2VyID0gX29wdGlvbnMkbG9nZ2VyID09PSB1bmRlZmluZWQgPyB3aW5kb3cuY29uc29sZSA6IF9vcHRpb25zJGxvZ2dlcjtcbiAgdmFyIF9vcHRpb25zJGxvZ0Vycm9ycyA9IG9wdGlvbnMubG9nRXJyb3JzO1xuICB2YXIgbG9nRXJyb3JzID0gX29wdGlvbnMkbG9nRXJyb3JzID09PSB1bmRlZmluZWQgPyB0cnVlIDogX29wdGlvbnMkbG9nRXJyb3JzO1xuICB2YXIgY29sbGFwc2VkID0gb3B0aW9ucy5jb2xsYXBzZWQ7XG4gIHZhciBwcmVkaWNhdGUgPSBvcHRpb25zLnByZWRpY2F0ZTtcbiAgdmFyIF9vcHRpb25zJGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgdmFyIGR1cmF0aW9uID0gX29wdGlvbnMkZHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX29wdGlvbnMkZHVyYXRpb247XG4gIHZhciBfb3B0aW9ucyR0aW1lc3RhbXAgPSBvcHRpb25zLnRpbWVzdGFtcDtcbiAgdmFyIHRpbWVzdGFtcCA9IF9vcHRpb25zJHRpbWVzdGFtcCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9vcHRpb25zJHRpbWVzdGFtcDtcbiAgdmFyIHRyYW5zZm9ybWVyID0gb3B0aW9ucy50cmFuc2Zvcm1lcjtcbiAgdmFyIF9vcHRpb25zJHN0YXRlVHJhbnNmbyA9IG9wdGlvbnMuc3RhdGVUcmFuc2Zvcm1lcjtcbiAgdmFyIC8vIGRlcHJlY2F0ZWRcbiAgc3RhdGVUcmFuc2Zvcm1lciA9IF9vcHRpb25zJHN0YXRlVHJhbnNmbyA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9IDogX29wdGlvbnMkc3RhdGVUcmFuc2ZvO1xuICB2YXIgX29wdGlvbnMkYWN0aW9uVHJhbnNmID0gb3B0aW9ucy5hY3Rpb25UcmFuc2Zvcm1lcjtcbiAgdmFyIGFjdGlvblRyYW5zZm9ybWVyID0gX29wdGlvbnMkYWN0aW9uVHJhbnNmID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoYWN0bikge1xuICAgIHJldHVybiBhY3RuO1xuICB9IDogX29wdGlvbnMkYWN0aW9uVHJhbnNmO1xuICB2YXIgX29wdGlvbnMkZXJyb3JUcmFuc2ZvID0gb3B0aW9ucy5lcnJvclRyYW5zZm9ybWVyO1xuICB2YXIgZXJyb3JUcmFuc2Zvcm1lciA9IF9vcHRpb25zJGVycm9yVHJhbnNmbyA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgcmV0dXJuIGVycm9yO1xuICB9IDogX29wdGlvbnMkZXJyb3JUcmFuc2ZvO1xuICB2YXIgX29wdGlvbnMkY29sb3JzID0gb3B0aW9ucy5jb2xvcnM7XG4gIHZhciBjb2xvcnMgPSBfb3B0aW9ucyRjb2xvcnMgPT09IHVuZGVmaW5lZCA/IHtcbiAgICB0aXRsZTogZnVuY3Rpb24gdGl0bGUoKSB7XG4gICAgICByZXR1cm4gXCIjMDAwMDAwXCI7XG4gICAgfSxcbiAgICBwcmV2U3RhdGU6IGZ1bmN0aW9uIHByZXZTdGF0ZSgpIHtcbiAgICAgIHJldHVybiBcIiM5RTlFOUVcIjtcbiAgICB9LFxuICAgIGFjdGlvbjogZnVuY3Rpb24gYWN0aW9uKCkge1xuICAgICAgcmV0dXJuIFwiIzAzQTlGNFwiO1xuICAgIH0sXG4gICAgbmV4dFN0YXRlOiBmdW5jdGlvbiBuZXh0U3RhdGUoKSB7XG4gICAgICByZXR1cm4gXCIjNENBRjUwXCI7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgICByZXR1cm4gXCIjRjIwNDA0XCI7XG4gICAgfVxuICB9IDogX29wdGlvbnMkY29sb3JzO1xuXG4gIC8vIGV4aXQgaWYgY29uc29sZSB1bmRlZmluZWRcblxuICBpZiAodHlwZW9mIGxvZ2dlciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gbmV4dChhY3Rpb24pO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHRyYW5zZm9ybWVyKSB7XG4gICAgY29uc29sZS5lcnJvcihcIk9wdGlvbiAndHJhbnNmb3JtZXInIGlzIGRlcHJlY2F0ZWQsIHVzZSBzdGF0ZVRyYW5zZm9ybWVyIGluc3RlYWRcIik7XG4gIH1cblxuICB2YXIgbG9nQnVmZmVyID0gW107XG4gIGZ1bmN0aW9uIHByaW50QnVmZmVyKCkge1xuICAgIGxvZ0J1ZmZlci5mb3JFYWNoKGZ1bmN0aW9uIChsb2dFbnRyeSwga2V5KSB7XG4gICAgICB2YXIgc3RhcnRlZCA9IGxvZ0VudHJ5LnN0YXJ0ZWQ7XG4gICAgICB2YXIgYWN0aW9uID0gbG9nRW50cnkuYWN0aW9uO1xuICAgICAgdmFyIHByZXZTdGF0ZSA9IGxvZ0VudHJ5LnByZXZTdGF0ZTtcbiAgICAgIHZhciBlcnJvciA9IGxvZ0VudHJ5LmVycm9yO1xuICAgICAgdmFyIHRvb2sgPSBsb2dFbnRyeS50b29rO1xuICAgICAgdmFyIG5leHRTdGF0ZSA9IGxvZ0VudHJ5Lm5leHRTdGF0ZTtcblxuICAgICAgdmFyIG5leHRFbnRyeSA9IGxvZ0J1ZmZlcltrZXkgKyAxXTtcbiAgICAgIGlmIChuZXh0RW50cnkpIHtcbiAgICAgICAgbmV4dFN0YXRlID0gbmV4dEVudHJ5LnByZXZTdGF0ZTtcbiAgICAgICAgdG9vayA9IG5leHRFbnRyeS5zdGFydGVkIC0gc3RhcnRlZDtcbiAgICAgIH1cbiAgICAgIC8vIG1lc3NhZ2VcbiAgICAgIHZhciBmb3JtYXR0ZWRBY3Rpb24gPSBhY3Rpb25UcmFuc2Zvcm1lcihhY3Rpb24pO1xuICAgICAgdmFyIHRpbWUgPSBuZXcgRGF0ZShzdGFydGVkKTtcbiAgICAgIHZhciBpc0NvbGxhcHNlZCA9IHR5cGVvZiBjb2xsYXBzZWQgPT09IFwiZnVuY3Rpb25cIiA/IGNvbGxhcHNlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgICB9LCBhY3Rpb24pIDogY29sbGFwc2VkO1xuXG4gICAgICB2YXIgZm9ybWF0dGVkVGltZSA9IGZvcm1hdFRpbWUodGltZSk7XG4gICAgICB2YXIgdGl0bGVDU1MgPSBjb2xvcnMudGl0bGUgPyBcImNvbG9yOiBcIiArIGNvbG9ycy50aXRsZShmb3JtYXR0ZWRBY3Rpb24pICsgXCI7XCIgOiBudWxsO1xuICAgICAgdmFyIHRpdGxlID0gXCJhY3Rpb24gXCIgKyBmb3JtYXR0ZWRBY3Rpb24udHlwZSArICh0aW1lc3RhbXAgPyBmb3JtYXR0ZWRUaW1lIDogXCJcIikgKyAoZHVyYXRpb24gPyBcIiBpbiBcIiArIHRvb2sudG9GaXhlZCgyKSArIFwiIG1zXCIgOiBcIlwiKTtcblxuICAgICAgLy8gcmVuZGVyXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaXNDb2xsYXBzZWQpIHtcbiAgICAgICAgICBpZiAoY29sb3JzLnRpdGxlKSBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQoXCIlYyBcIiArIHRpdGxlLCB0aXRsZUNTUyk7ZWxzZSBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQodGl0bGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChjb2xvcnMudGl0bGUpIGxvZ2dlci5ncm91cChcIiVjIFwiICsgdGl0bGUsIHRpdGxlQ1NTKTtlbHNlIGxvZ2dlci5ncm91cCh0aXRsZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nZ2VyLmxvZyh0aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2xvcnMucHJldlN0YXRlKSBsb2dnZXJbbGV2ZWxdKFwiJWMgcHJldiBzdGF0ZVwiLCBcImNvbG9yOiBcIiArIGNvbG9ycy5wcmV2U3RhdGUocHJldlN0YXRlKSArIFwiOyBmb250LXdlaWdodDogYm9sZFwiLCBwcmV2U3RhdGUpO2Vsc2UgbG9nZ2VyW2xldmVsXShcInByZXYgc3RhdGVcIiwgcHJldlN0YXRlKTtcblxuICAgICAgaWYgKGNvbG9ycy5hY3Rpb24pIGxvZ2dlcltsZXZlbF0oXCIlYyBhY3Rpb25cIiwgXCJjb2xvcjogXCIgKyBjb2xvcnMuYWN0aW9uKGZvcm1hdHRlZEFjdGlvbikgKyBcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgZm9ybWF0dGVkQWN0aW9uKTtlbHNlIGxvZ2dlcltsZXZlbF0oXCJhY3Rpb25cIiwgZm9ybWF0dGVkQWN0aW9uKTtcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGlmIChjb2xvcnMuZXJyb3IpIGxvZ2dlcltsZXZlbF0oXCIlYyBlcnJvclwiLCBcImNvbG9yOiBcIiArIGNvbG9ycy5lcnJvcihlcnJvciwgcHJldlN0YXRlKSArIFwiOyBmb250LXdlaWdodDogYm9sZFwiLCBlcnJvcik7ZWxzZSBsb2dnZXJbbGV2ZWxdKFwiZXJyb3JcIiwgZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29sb3JzLm5leHRTdGF0ZSkgbG9nZ2VyW2xldmVsXShcIiVjIG5leHQgc3RhdGVcIiwgXCJjb2xvcjogXCIgKyBjb2xvcnMubmV4dFN0YXRlKG5leHRTdGF0ZSkgKyBcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgbmV4dFN0YXRlKTtlbHNlIGxvZ2dlcltsZXZlbF0oXCJuZXh0IHN0YXRlXCIsIG5leHRTdGF0ZSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGxvZ2dlci5ncm91cEVuZCgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dnZXIubG9nKFwi4oCU4oCUIGxvZyBlbmQg4oCU4oCUXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ0J1ZmZlci5sZW5ndGggPSAwO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIGdldFN0YXRlID0gX3JlZi5nZXRTdGF0ZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIC8vIGV4aXQgZWFybHkgaWYgcHJlZGljYXRlIGZ1bmN0aW9uIHJldHVybnMgZmFsc2VcbiAgICAgICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09IFwiZnVuY3Rpb25cIiAmJiAhcHJlZGljYXRlKGdldFN0YXRlLCBhY3Rpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2dFbnRyeSA9IHt9O1xuICAgICAgICBsb2dCdWZmZXIucHVzaChsb2dFbnRyeSk7XG5cbiAgICAgICAgbG9nRW50cnkuc3RhcnRlZCA9IHRpbWVyLm5vdygpO1xuICAgICAgICBsb2dFbnRyeS5wcmV2U3RhdGUgPSBzdGF0ZVRyYW5zZm9ybWVyKGdldFN0YXRlKCkpO1xuICAgICAgICBsb2dFbnRyeS5hY3Rpb24gPSBhY3Rpb247XG5cbiAgICAgICAgdmFyIHJldHVybmVkVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChsb2dFcnJvcnMpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuZWRWYWx1ZSA9IG5leHQoYWN0aW9uKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2dFbnRyeS5lcnJvciA9IGVycm9yVHJhbnNmb3JtZXIoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybmVkVmFsdWUgPSBuZXh0KGFjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsb2dFbnRyeS50b29rID0gdGltZXIubm93KCkgLSBsb2dFbnRyeS5zdGFydGVkO1xuICAgICAgICBsb2dFbnRyeS5uZXh0U3RhdGUgPSBzdGF0ZVRyYW5zZm9ybWVyKGdldFN0YXRlKCkpO1xuXG4gICAgICAgIHByaW50QnVmZmVyKCk7XG5cbiAgICAgICAgaWYgKGxvZ0VudHJ5LmVycm9yKSB0aHJvdyBsb2dFbnRyeS5lcnJvcjtcbiAgICAgICAgcmV0dXJuIHJldHVybmVkVmFsdWU7XG4gICAgICB9O1xuICAgIH07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTG9nZ2VyOyJdfQ==

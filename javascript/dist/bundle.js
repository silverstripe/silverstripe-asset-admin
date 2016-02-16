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
		var folders = _this.props.gallery.files.filter(function (file) {
			return file.type === 'folder';
		});
		var files = _this.props.gallery.files.filter(function (file) {
			return file.type !== 'folder';
		});

		_this.props.actions.addFile(folders.sort(comparator).concat(files.sort(comparator)));
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
			var _this2 = this;

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
								{ key: i, onClick: sorter.onSort },
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
							onFileDelete: _this2.onFileDelete,
							onFileNavigate: _this2.onFileNavigate }));
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
			var files = this.props.gallery.files.filter(function (file) {
				return data !== file.id;
			});

			this.props.actions.addFile(files, this.props.gallery.count - 1);
		}
	}, {
		key: 'onNavigateData',
		value: function onNavigateData(data) {
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
    UPDATE_FILE: 'UPDATE_FILE',
    SELECT_FILES: 'SELECT_FILES',
    DESELECT_FILES: 'DESELECT_FILES',
    SET_EDITING: 'SET_EDITING',
    SET_FOCUS: 'SET_FOCUS',
    SET_EDITOR_FIELDS: 'SET_EDITOR_FIELDS',
    UPDATE_EDITOR_FIELD: 'UPDATE_EDITOR_FIELD'
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
exports.updateFile = updateFile;
exports.selectFiles = selectFiles;
exports.deselectFiles = deselectFiles;
exports.setEditing = setEditing;
exports.setFocus = setFocus;
exports.setEditorFields = setEditorFields;
exports.updateEditorField = updateEditorField;

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
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                count: action.payload.count !== 'undefined' ? action.payload.count : state.count,
                files: state.files.concat(action.payload.file)
            }));

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
                // We're dealing with an array if ids to deselect.
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
            }).indexOf(action.payload.updates.name);
            var updatedField = Object.assign({}, state.editorFields[fieldIndex], action.payload.updates);

            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                editorFields: state.editorFields.map(function (field) {
                    return field.name === updatedField.name ? updatedField : field;
                })
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
  return "@ " + pad(time.getHours(), 2) + ":" + pad(time.getMinutes(), 2) + ":" + pad(time.getSeconds(), 2) + "." + pad(time.getMilliseconds(), 3);
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
  var logger = _options$logger === undefined ? console : _options$logger;
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
      var startedTime = logEntry.startedTime;
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
      var isCollapsed = typeof collapsed === "function" ? collapsed(function () {
        return nextState;
      }, action) : collapsed;

      var formattedTime = formatTime(startedTime);
      var titleCSS = colors.title ? "color: " + colors.title(formattedAction) + ";" : null;
      var title = "action " + (timestamp ? formattedTime : "") + " " + formattedAction.type + " " + (duration ? "(in " + took.toFixed(2) + " ms)" : "");

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
        logEntry.startedTime = new Date();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaW5nby9TaXRlcy9tYXN0ZXItYXNzZXQtYWRtaW4vYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvYmFja2VuZC9maWxlLWJhY2tlbmQuanMiLCIvVXNlcnMvaW5nby9TaXRlcy9tYXN0ZXItYXNzZXQtYWRtaW4vYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvYm9vdC9pbmRleC5qcyIsIi9Vc2Vycy9pbmdvL1NpdGVzL21hc3Rlci1hc3NldC1hZG1pbi9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb21wb25lbnRzL2J1bGstYWN0aW9ucy9pbmRleC5qcyIsIi9Vc2Vycy9pbmdvL1NpdGVzL21hc3Rlci1hc3NldC1hZG1pbi9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb21wb25lbnRzL2ZpbGUvaW5kZXguanMiLCIvVXNlcnMvaW5nby9TaXRlcy9tYXN0ZXItYXNzZXQtYWRtaW4vYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvY29tcG9uZW50cy90ZXh0LWZpZWxkL2luZGV4LmpzIiwiL1VzZXJzL2luZ28vU2l0ZXMvbWFzdGVyLWFzc2V0LWFkbWluL2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9pbmdvL1NpdGVzL21hc3Rlci1hc3NldC1hZG1pbi9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zZWN0aW9ucy9lZGl0b3IvY29udHJvbGxlci5qcyIsIi9Vc2Vycy9pbmdvL1NpdGVzL21hc3Rlci1hc3NldC1hZG1pbi9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zZWN0aW9ucy9nYWxsZXJ5L2NvbnRyb2xsZXIuanMiLCIvVXNlcnMvaW5nby9TaXRlcy9tYXN0ZXItYXNzZXQtYWRtaW4vYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvYWN0aW9uLXR5cGVzLmpzIiwiL1VzZXJzL2luZ28vU2l0ZXMvbWFzdGVyLWFzc2V0LWFkbWluL2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiL1VzZXJzL2luZ28vU2l0ZXMvbWFzdGVyLWFzc2V0LWFkbWluL2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL2dhbGxlcnkvYWN0aW9ucy5qcyIsIi9Vc2Vycy9pbmdvL1NpdGVzL21hc3Rlci1hc3NldC1hZG1pbi9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9nYWxsZXJ5L3JlZHVjZXIuanMiLCIvVXNlcnMvaW5nby9TaXRlcy9tYXN0ZXItYXNzZXQtYWRtaW4vYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvcmVkdWNlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2RlZXAtZnJlZXplL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4LWxvZ2dlci9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQ0FjLFFBQVE7Ozs7c0JBQ0gsUUFBUTs7OztJQUVOLFdBQVc7V0FBWCxXQUFXOztBQUVwQixVQUZTLFdBQVcsQ0FFbkIsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRTt3QkFGbkYsV0FBVzs7QUFHOUIsNkJBSG1CLFdBQVcsNkNBR3RCOztBQUVSLE1BQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLE1BQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxLQUFLLEdBQUcsS0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgRXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVCYWNrZW5kIGV4dGVuZHMgRXZlbnRzIHtcblxuXHRjb25zdHJ1Y3RvcihmZXRjaF91cmwsIHNlYXJjaF91cmwsIHVwZGF0ZV91cmwsIGRlbGV0ZV91cmwsIGxpbWl0LCBidWxrQWN0aW9ucywgJGZvbGRlciwgY3VycmVudEZvbGRlcikge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLmZldGNoX3VybCA9IGZldGNoX3VybDtcblx0XHR0aGlzLnNlYXJjaF91cmwgPSBzZWFyY2hfdXJsO1xuXHRcdHRoaXMudXBkYXRlX3VybCA9IHVwZGF0ZV91cmw7XG5cdFx0dGhpcy5kZWxldGVfdXJsID0gZGVsZXRlX3VybDtcblx0XHR0aGlzLmxpbWl0ID0gbGltaXQ7XG5cdFx0dGhpcy5idWxrQWN0aW9ucyA9IGJ1bGtBY3Rpb25zO1xuXHRcdHRoaXMuJGZvbGRlciA9ICRmb2xkZXI7XG5cdFx0dGhpcy5mb2xkZXIgPSBjdXJyZW50Rm9sZGVyO1xuXG5cdFx0dGhpcy5wYWdlID0gMTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZnVuYyBmZXRjaFxuXHQgKiBAcGFyYW0gbnVtYmVyIGlkXG5cdCAqIEBkZXNjIEZldGNoZXMgYSBjb2xsZWN0aW9uIG9mIEZpbGVzIGJ5IFBhcmVudElELlxuXHQgKi9cblx0ZmV0Y2goaWQpIHtcblx0XHRpZiAodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMucGFnZSA9IDE7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ1BPU1QnLCB0aGlzLmZldGNoX3VybCwgeyBpZDogaWQgfSkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvbkZldGNoRGF0YScsIGpzb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0c2VhcmNoKCkge1xuXHRcdHRoaXMucGFnZSA9IDE7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvblNlYXJjaERhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG1vcmUoKSB7XG5cdFx0dGhpcy5wYWdlKys7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvbk1vcmVEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRuYXZpZ2F0ZShmb2xkZXIpIHtcblx0XHR0aGlzLnBhZ2UgPSAxO1xuXHRcdHRoaXMuZm9sZGVyID0gZm9sZGVyO1xuXG5cdFx0dGhpcy5wZXJzaXN0Rm9sZGVyRmlsdGVyKGZvbGRlcik7XG5cblx0XHR0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvbk5hdmlnYXRlRGF0YScsIGpzb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0cGVyc2lzdEZvbGRlckZpbHRlcihmb2xkZXIpIHtcblx0XHRpZiAoZm9sZGVyLnN1YnN0cigtMSkgPT09ICcvJykge1xuXHRcdFx0Zm9sZGVyID0gZm9sZGVyLnN1YnN0cigwLCBmb2xkZXIubGVuZ3RoIC0gMSk7XG5cdFx0fVxuXG5cdFx0dGhpcy4kZm9sZGVyLnZhbChmb2xkZXIpO1xuXHR9XG5cblx0ZGVsZXRlKGlkcykge1xuXHRcdHZhciBmaWxlc1RvRGVsZXRlID0gW107XG5cblx0XHQvLyBBbGxvd3MgdXNlcnMgdG8gcGFzcyBvbmUgb3IgbW9yZSBpZHMgdG8gZGVsZXRlLlxuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaWRzKSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuXHRcdFx0ZmlsZXNUb0RlbGV0ZS5wdXNoKGlkcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZpbGVzVG9EZWxldGUgPSBpZHM7XG5cdFx0fVxuXG5cdFx0dGhpcy5yZXF1ZXN0KCdERUxFVEUnLCB0aGlzLmRlbGV0ZV91cmwsIHtcblx0XHRcdCdpZHMnOiBmaWxlc1RvRGVsZXRlXG5cdFx0fSkudGhlbigoKSA9PiB7XG5cdFx0XHQvLyBVc2luZyBmb3IgbG9vcCBiZWNhdXNlIElFMTAgZG9lc24ndCBoYW5kbGUgJ2ZvciBvZicsXG5cdFx0XHQvLyB3aGljaCBnZXRzIHRyYW5zY29tcGlsZWQgaW50byBhIGZ1bmN0aW9uIHdoaWNoIHVzZXMgU3ltYm9sLFxuXHRcdFx0Ly8gdGhlIHRoaW5nIElFMTAgZGllcyBvbi5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXNUb0RlbGV0ZS5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0XHR0aGlzLmVtaXQoJ29uRGVsZXRlRGF0YScsIGZpbGVzVG9EZWxldGVbaV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZmlsdGVyKG5hbWUsIHR5cGUsIGZvbGRlciwgY3JlYXRlZEZyb20sIGNyZWF0ZWRUbywgb25seVNlYXJjaEluRm9sZGVyKSB7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMuZm9sZGVyID0gZm9sZGVyO1xuXHRcdHRoaXMuY3JlYXRlZEZyb20gPSBjcmVhdGVkRnJvbTtcblx0XHR0aGlzLmNyZWF0ZWRUbyA9IGNyZWF0ZWRUbztcblx0XHR0aGlzLm9ubHlTZWFyY2hJbkZvbGRlciA9IG9ubHlTZWFyY2hJbkZvbGRlcjtcblxuXHRcdHRoaXMuc2VhcmNoKCk7XG5cdH1cblxuXHRzYXZlKGlkLCB2YWx1ZXMpIHtcblx0XHR2YXIgdXBkYXRlcyA9IHsgaWQgfTtcblxuXHRcdHZhbHVlcy5mb3JFYWNoKGZpZWxkID0+IHtcblx0XHRcdHVwZGF0ZXNbZmllbGQubmFtZV0gPSBmaWVsZC52YWx1ZTtcblx0XHR9KTtcblxuXHRcdHRoaXMucmVxdWVzdCgnUE9TVCcsIHRoaXMudXBkYXRlX3VybCwgdXBkYXRlcykudGhlbigoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uU2F2ZURhdGEnLCBpZCwgdXBkYXRlcyk7XG5cdFx0fSk7XG5cdH1cblxuXHRyZXF1ZXN0KG1ldGhvZCwgdXJsLCBkYXRhID0ge30pIHtcblx0XHRsZXQgZGVmYXVsdHMgPSB7XG5cdFx0XHQnbGltaXQnOiB0aGlzLmxpbWl0LFxuXHRcdFx0J3BhZ2UnOiB0aGlzLnBhZ2UsXG5cdFx0fTtcblxuXHRcdGlmICh0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5uYW1lKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5mb2xkZXIgJiYgdGhpcy5mb2xkZXIudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuZm9sZGVyID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMuZm9sZGVyKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5jcmVhdGVkRnJvbSAmJiB0aGlzLmNyZWF0ZWRGcm9tLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRGcm9tID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMuY3JlYXRlZEZyb20pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRUbyAmJiB0aGlzLmNyZWF0ZWRUby50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5jcmVhdGVkVG8gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkVG8pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlciAmJiB0aGlzLm9ubHlTZWFyY2hJbkZvbGRlci50cmltKCkgIT09ICcnKSB7XG5cdFx0XHRkZWZhdWx0cy5vbmx5U2VhcmNoSW5Gb2xkZXIgPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIpO1xuXHRcdH1cblxuXHRcdHRoaXMuc2hvd0xvYWRpbmdJbmRpY2F0b3IoKTtcblxuXHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0J3VybCc6IHVybCxcblx0XHRcdCd0eXBlJzogbWV0aG9kLCAvLyBjb21wYXQgd2l0aCBqUXVlcnkgMS43XG5cdFx0XHQnZGF0YVR5cGUnOiAnanNvbicsXG5cdFx0XHQnZGF0YSc6ICQuZXh0ZW5kKGRlZmF1bHRzLCBkYXRhKVxuXHRcdH0pLmFsd2F5cygoKSA9PiB7XG5cdFx0XHR0aGlzLmhpZGVMb2FkaW5nSW5kaWNhdG9yKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRzaG93TG9hZGluZ0luZGljYXRvcigpIHtcblx0XHQkKCcuY21zLWNvbnRlbnQsIC51aS1kaWFsb2cnKS5hZGRDbGFzcygnbG9hZGluZycpO1xuXHRcdCQoJy51aS1kaWFsb2ctY29udGVudCcpLmNzcygnb3BhY2l0eScsICcuMScpO1xuXHR9XG5cblx0aGlkZUxvYWRpbmdJbmRpY2F0b3IoKSB7XG5cdFx0JCgnLmNtcy1jb250ZW50LCAudWktZGlhbG9nJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblx0XHQkKCcudWktZGlhbG9nLWNvbnRlbnQnKS5jc3MoJ29wYWNpdHknLCAnMScpO1xuXHR9XG59XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgY29uZmlndXJlU3RvcmUgZnJvbSAnLi4vc3RhdGUvY29uZmlndXJlU3RvcmUnO1xuaW1wb3J0IEdhbGxlcnlDb250YWluZXIgZnJvbSAnLi4vc2VjdGlvbnMvZ2FsbGVyeS9jb250cm9sbGVyJztcbmltcG9ydCBGaWxlQmFja2VuZCBmcm9tICcuLi9iYWNrZW5kL2ZpbGUtYmFja2VuZCc7XG5cbmZ1bmN0aW9uIGdldFZhcihuYW1lKSB7XG5cdHZhciBwYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCc/Jyk7XG5cblx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRwYXJ0cyA9IHBhcnRzWzFdLnNwbGl0KCcjJyk7XG5cdH1cblxuXHRsZXQgdmFyaWFibGVzID0gcGFydHNbMF0uc3BsaXQoJyYnKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHZhcmlhYmxlcy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwYXJ0cyA9IHZhcmlhYmxlc1tpXS5zcGxpdCgnPScpO1xuXG5cdFx0aWYgKGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSkgPT09IG5hbWUpIHtcblx0XHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBoYXNTZXNzaW9uU3RvcmFnZSgpIHtcblx0cmV0dXJuIHR5cGVvZiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcHMocHJvcHMpIHtcblx0dmFyICRjb21wb25lbnRXcmFwcGVyID0gJCgnLmFzc2V0LWdhbGxlcnknKS5maW5kKCcuYXNzZXQtZ2FsbGVyeS1jb21wb25lbnQtd3JhcHBlcicpLFxuXHRcdCRzZWFyY2ggPSAkKCcuY21zLXNlYXJjaC1mb3JtJyksXG5cdFx0aW5pdGlhbEZvbGRlciA9ICQoJy5hc3NldC1nYWxsZXJ5JykuZGF0YSgnYXNzZXQtZ2FsbGVyeS1pbml0aWFsLWZvbGRlcicpLFxuXHRcdGN1cnJlbnRGb2xkZXIgPSBnZXRWYXIoJ3FbRm9sZGVyXScpIHx8IGluaXRpYWxGb2xkZXIsXG5cdFx0YmFja2VuZCxcblx0XHRkZWZhdWx0cztcblxuXHRpZiAoJHNlYXJjaC5maW5kKCdbdHlwZT1oaWRkZW5dW25hbWU9XCJxW0ZvbGRlcl1cIl0nKS5sZW5ndGggPT0gMCkge1xuXHRcdCRzZWFyY2guYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJxW0ZvbGRlcl1cIiAvPicpO1xuXHR9XG5cblx0Ly8gRG8gd2UgbmVlZCB0byBzZXQgdXAgYSBkZWZhdWx0IGJhY2tlbmQ/XG5cdGlmICh0eXBlb2YgcHJvcHMgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwcm9wcy5iYWNrZW5kID09PSAndW5kZWZpbmVkJykge1xuXHRcdGJhY2tlbmQgPSBuZXcgRmlsZUJhY2tlbmQoXG5cdFx0XHQkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LWZldGNoLXVybCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1zZWFyY2gtdXJsJyksXG5cdFx0XHQkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LXVwZGF0ZS11cmwnKSxcblx0XHRcdCRjb21wb25lbnRXcmFwcGVyLmRhdGEoJ2Fzc2V0LWdhbGxlcnktZGVsZXRlLXVybCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1saW1pdCcpLFxuXHRcdFx0JGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1idWxrLWFjdGlvbnMnKSxcblx0XHRcdCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJyksXG5cdFx0XHRjdXJyZW50Rm9sZGVyXG5cdFx0KTtcblxuXHRcdGJhY2tlbmQuZW1pdChcblx0XHRcdCdmaWx0ZXInLFxuXHRcdFx0Z2V0VmFyKCdxW05hbWVdJyksXG5cdFx0XHRnZXRWYXIoJ3FbQXBwQ2F0ZWdvcnldJyksXG5cdFx0XHRnZXRWYXIoJ3FbRm9sZGVyXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRGcm9tXScpLFxuXHRcdFx0Z2V0VmFyKCdxW0NyZWF0ZWRUb10nKSxcblx0XHRcdGdldFZhcigncVtDdXJyZW50Rm9sZGVyT25seV0nKVxuXHRcdCk7XG5cdH1cblxuXHRkZWZhdWx0cyA9IHtcblx0XHRiYWNrZW5kOiBiYWNrZW5kLFxuXHRcdGN1cnJlbnRfZm9sZGVyOiBjdXJyZW50Rm9sZGVyLFxuXHRcdGNtc0V2ZW50czoge30sXG5cdFx0aW5pdGlhbF9mb2xkZXI6IGluaXRpYWxGb2xkZXIsXG5cdFx0bmFtZTogJCgnLmFzc2V0LWdhbGxlcnknKS5kYXRhKCdhc3NldC1nYWxsZXJ5LW5hbWUnKVxuXHR9O1xuXG5cdHJldHVybiAkLmV4dGVuZCh0cnVlLCBkZWZhdWx0cywgcHJvcHMpO1xufVxuXG5sZXQgcHJvcHMgPSBnZXRQcm9wcygpO1xuY29uc3Qgc3RvcmUgPSBjb25maWd1cmVTdG9yZSgpOyAvL0NyZWF0ZSB0aGUgcmVkdXggc3RvcmVcblxuXG5SZWFjdERPTS5yZW5kZXIoXG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgICAgIDxHYWxsZXJ5Q29udGFpbmVyIHsuLi5wcm9wc30gLz5cbiAgICA8L1Byb3ZpZGVyPixcbiAgICAkKCcuYXNzZXQtZ2FsbGVyeS1jb21wb25lbnQtd3JhcHBlcicpWzBdXG4pO1xuIiwiaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgUmVhY3RUZXN0VXRpbHMgZnJvbSAncmVhY3QtYWRkb25zLXRlc3QtdXRpbHMnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCAqIGFzIGdhbGxlcnlBY3Rpb25zIGZyb20gJy4uLy4uL3N0YXRlL2dhbGxlcnkvYWN0aW9ucyc7XG5pbXBvcnQgaTE4biBmcm9tICdpMThuJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVsa0FjdGlvbnNDb21wb25lbnQgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5vbkNoYW5nZVZhbHVlID0gdGhpcy5vbkNoYW5nZVZhbHVlLmJpbmQodGhpcyk7XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR2YXIgJHNlbGVjdCA9ICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5kcm9wZG93bicpO1xuXG5cdFx0JHNlbGVjdC5jaG9zZW4oe1xuXHRcdFx0J2FsbG93X3NpbmdsZV9kZXNlbGVjdCc6IHRydWUsXG5cdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMjBcblx0XHR9KTtcblxuXHRcdC8vIENob3NlbiBzdG9wcyB0aGUgY2hhbmdlIGV2ZW50IGZyb20gcmVhY2hpbmcgUmVhY3Qgc28gd2UgaGF2ZSB0byBzaW11bGF0ZSBhIGNsaWNrLlxuXHRcdCRzZWxlY3QuY2hhbmdlKCgpID0+IFJlYWN0VGVzdFV0aWxzLlNpbXVsYXRlLmNsaWNrKCRzZWxlY3QuZmluZCgnOnNlbGVjdGVkJylbMF0pKTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5X19idWxrLWFjdGlvbnMgZmllbGRob2xkZXItc21hbGxcIj5cblx0XHRcdDxzZWxlY3QgY2xhc3NOYW1lPVwiZHJvcGRvd24gbm8tY2hhbmdlLXRyYWNrIG5vLWNoem5cIiB0YWJJbmRleD1cIjBcIiBkYXRhLXBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLmdhbGxlcnkuYnVsa0FjdGlvbnMucGxhY2Vob2xkZXJ9IHN0eWxlPXt7d2lkdGg6ICcxNjBweCd9fT5cblx0XHRcdFx0PG9wdGlvbiBzZWxlY3RlZCBkaXNhYmxlZCBoaWRkZW4gdmFsdWU9Jyc+PC9vcHRpb24+XG5cdFx0XHRcdHt0aGlzLnByb3BzLmdhbGxlcnkuYnVsa0FjdGlvbnMub3B0aW9ucy5tYXAoKG9wdGlvbiwgaSkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiA8b3B0aW9uIGtleT17aX0gb25DbGljaz17dGhpcy5vbkNoYW5nZVZhbHVlfSB2YWx1ZT17b3B0aW9uLnZhbHVlfT57b3B0aW9uLmxhYmVsfTwvb3B0aW9uPjtcblx0XHRcdFx0fSl9XG5cdFx0XHQ8L3NlbGVjdD5cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRnZXRPcHRpb25CeVZhbHVlKHZhbHVlKSB7XG5cdFx0Ly8gVXNpbmcgZm9yIGxvb3AgYmVjYXVzZSBJRTEwIGRvZXNuJ3QgaGFuZGxlICdmb3Igb2YnLFxuXHRcdC8vIHdoaWNoIGdldHMgdHJhbnNjb21waWxlZCBpbnRvIGEgZnVuY3Rpb24gd2hpY2ggdXNlcyBTeW1ib2wsXG5cdFx0Ly8gdGhlIHRoaW5nIElFMTAgZGllcyBvbi5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZ2FsbGVyeS5idWxrQWN0aW9ucy5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LmJ1bGtBY3Rpb25zLm9wdGlvbnNbaV0udmFsdWUgPT09IHZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnByb3BzLmdhbGxlcnkuYnVsa0FjdGlvbnMub3B0aW9uc1tpXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuICAgIFxuICAgIGdldFNlbGVjdGVkRmlsZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmdhbGxlcnkuc2VsZWN0ZWRGaWxlcztcbiAgICB9XG5cblx0YXBwbHlBY3Rpb24odmFsdWUpIHtcblx0XHQvLyBXZSBvbmx5IGhhdmUgJ2RlbGV0ZScgcmlnaHQgbm93Li4uXG5cdFx0c3dpdGNoICh2YWx1ZSkge1xuXHRcdFx0Y2FzZSAnZGVsZXRlJzpcblx0XHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLmRlbGV0ZSh0aGlzLmdldFNlbGVjdGVkRmlsZXMoKSk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0b25DaGFuZ2VWYWx1ZShldmVudCkge1xuXHRcdHZhciBvcHRpb24gPSB0aGlzLmdldE9wdGlvbkJ5VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcblxuXHRcdC8vIE1ha2Ugc3VyZSBhIHZhbGlkIG9wdGlvbiBoYXMgYmVlbiBzZWxlY3RlZC5cblx0XHRpZiAob3B0aW9uID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbi5kZXN0cnVjdGl2ZSA9PT0gdHJ1ZSkge1xuXHRcdFx0aWYgKGNvbmZpcm0oaTE4bi5zcHJpbnRmKGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkJVTEtfQUNUSU9OU19DT05GSVJNJyksIG9wdGlvbi5sYWJlbCkpKSB7XG5cdFx0XHRcdHRoaXMuYXBwbHlBY3Rpb24ob3B0aW9uLnZhbHVlKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5hcHBseUFjdGlvbihvcHRpb24udmFsdWUpO1xuXHRcdH1cblxuXHRcdC8vIFJlc2V0IHRoZSBkcm9wZG93biB0byBpdCdzIHBsYWNlaG9sZGVyIHZhbHVlLlxuXHRcdCQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5kcm9wZG93bicpLnZhbCgnJykudHJpZ2dlcignbGlzenQ6dXBkYXRlZCcpO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcblx0cmV0dXJuIHtcblx0XHRnYWxsZXJ5OiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnlcblx0fVxufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0cmV0dXJuIHtcblx0XHRhY3Rpb25zOiBiaW5kQWN0aW9uQ3JlYXRvcnMoZ2FsbGVyeUFjdGlvbnMsIGRpc3BhdGNoKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEJ1bGtBY3Rpb25zQ29tcG9uZW50KTtcbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgaTE4biBmcm9tICdpMThuJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBiaW5kQWN0aW9uQ3JlYXRvcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgKiBhcyBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi8uLi9zdGF0ZS9nYWxsZXJ5L2FjdGlvbnMnO1xuaW1wb3J0IGNvbnN0YW50cyBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xuaW1wb3J0IFNpbHZlclN0cmlwZUNvbXBvbmVudCBmcm9tICdzaWx2ZXJzdHJpcGUtY29tcG9uZW50JztcblxuY2xhc3MgRmlsZUNvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHRoaXMuZ2V0QnV0dG9uVGFiSW5kZXggPSB0aGlzLmdldEJ1dHRvblRhYkluZGV4LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbkZpbGVOYXZpZ2F0ZSA9IHRoaXMub25GaWxlTmF2aWdhdGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZUVkaXQgPSB0aGlzLm9uRmlsZUVkaXQuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZURlbGV0ZSA9IHRoaXMub25GaWxlRGVsZXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVEb3VibGVDbGljayA9IHRoaXMuaGFuZGxlRG91YmxlQ2xpY2suYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUtleURvd24gPSB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUZvY3VzID0gdGhpcy5oYW5kbGVGb2N1cy5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlQmx1ciA9IHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucHJldmVudEZvY3VzID0gdGhpcy5wcmV2ZW50Rm9jdXMuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZVNlbGVjdCA9IHRoaXMub25GaWxlU2VsZWN0LmJpbmQodGhpcyk7XG5cdH1cblxuXHRoYW5kbGVEb3VibGVDbGljayhldmVudCkge1xuXHRcdGlmIChldmVudC50YXJnZXQgIT09IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy50aXRsZSkgJiYgZXZlbnQudGFyZ2V0ICE9PSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMudGh1bWJuYWlsKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMub25GaWxlTmF2aWdhdGUoZXZlbnQpO1xuXHR9XG5cblx0b25GaWxlTmF2aWdhdGUoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5pc0ZvbGRlcigpKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uRmlsZU5hdmlnYXRlKHRoaXMucHJvcHMsIGV2ZW50KVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMub25GaWxlRWRpdChldmVudCk7XG5cdH1cblxuXHRvbkZpbGVTZWxlY3QoZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgLy9zdG9wIHRyaWdnZXJpbmcgY2xpY2sgb24gcm9vdCBlbGVtZW50XG5cblx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LnNlbGVjdGVkRmlsZXMuaW5kZXhPZih0aGlzLnByb3BzLmlkKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZWxlY3RGaWxlcyh0aGlzLnByb3BzLmlkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmRlc2VsZWN0RmlsZXModGhpcy5wcm9wcy5pZCk7XG5cdFx0fVxuXHR9XG5cblx0b25GaWxlRWRpdChldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyAvL3N0b3AgdHJpZ2dlcmluZyBjbGljayBvbiByb290IGVsZW1lbnRcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuc2V0RWRpdGluZyh0aGlzLnByb3BzLmdhbGxlcnkuZmlsZXMuZmluZChmaWxlID0+IGZpbGUuaWQgPT09IHRoaXMucHJvcHMuaWQpKTtcblx0fVxuXG5cdG9uRmlsZURlbGV0ZShldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyAvL3N0b3AgdHJpZ2dlcmluZyBjbGljayBvbiByb290IGVsZW1lbnRcblx0XHR0aGlzLnByb3BzLm9uRmlsZURlbGV0ZSh0aGlzLnByb3BzLCBldmVudClcblx0fVxuXG5cdGlzRm9sZGVyKCkge1xuXHRcdHJldHVybiB0aGlzLnByb3BzLmNhdGVnb3J5ID09PSAnZm9sZGVyJztcblx0fVxuXG5cdGdldFRodW1ibmFpbFN0eWxlcygpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5jYXRlZ29yeSA9PT0gJ2ltYWdlJykge1xuXHRcdFx0cmV0dXJuIHsnYmFja2dyb3VuZEltYWdlJzogJ3VybCgnICsgdGhpcy5wcm9wcy51cmwgKyAnKSd9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdGdldFRodW1ibmFpbENsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIHRodW1ibmFpbENsYXNzTmFtZXMgPSAnaXRlbV9fdGh1bWJuYWlsJztcblxuXHRcdGlmICh0aGlzLmlzSW1hZ2VMYXJnZXJUaGFuVGh1bWJuYWlsKCkpIHtcblx0XHRcdHRodW1ibmFpbENsYXNzTmFtZXMgKz0gJyBpdGVtX190aHVtYm5haWwtLWxhcmdlJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGh1bWJuYWlsQ2xhc3NOYW1lcztcblx0fVxuXHRcblx0aXNTZWxlY3RlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy5nYWxsZXJ5LnNlbGVjdGVkRmlsZXMuaW5kZXhPZih0aGlzLnByb3BzLmlkKSA+IC0xO1xuXHR9XG4gICAgXG4gICAgaXNGb2N1c3NlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZ2FsbGVyeS5mb2N1cyA9PT0gdGhpcy5wcm9wcy5pZDtcbiAgICB9XG4gICAgXG4gICAgZ2V0QnV0dG9uVGFiSW5kZXgoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRm9jdXNzZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9XG5cblx0Z2V0SXRlbUNsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIGl0ZW1DbGFzc05hbWVzID0gJ2l0ZW0gaXRlbS0tJyArIHRoaXMucHJvcHMuY2F0ZWdvcnk7XG5cblx0XHRpZiAodGhpcy5pc0ZvY3Vzc2VkKCkpIHtcblx0XHRcdGl0ZW1DbGFzc05hbWVzICs9ICcgaXRlbS0tZm9jdXNzZWQnO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmlzU2VsZWN0ZWQoKSkge1xuXHRcdFx0aXRlbUNsYXNzTmFtZXMgKz0gJyBpdGVtLS1zZWxlY3RlZCc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW1DbGFzc05hbWVzO1xuXHR9XG5cblx0aXNJbWFnZUxhcmdlclRoYW5UaHVtYm5haWwoKSB7XG5cdFx0bGV0IGRpbWVuc2lvbnMgPSB0aGlzLnByb3BzLmF0dHJpYnV0ZXMuZGltZW5zaW9ucztcblxuXHRcdHJldHVybiBkaW1lbnNpb25zLmhlaWdodCA+IGNvbnN0YW50cy5USFVNQk5BSUxfSEVJR0hUIHx8IGRpbWVuc2lvbnMud2lkdGggPiBjb25zdGFudHMuVEhVTUJOQUlMX1dJRFRIO1xuXHR9XG5cblx0aGFuZGxlS2V5RG93bihldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0Ly9pZiBldmVudCBkb2Vzbid0IGNvbWUgZnJvbSB0aGUgcm9vdCBlbGVtZW50LCBkbyBub3RoaW5nXG5cdFx0aWYgKGV2ZW50LnRhcmdldCAhPT0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLnRodW1ibmFpbCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0Ly9JZiBzcGFjZSBpcyBwcmVzc2VkLCBhbGxvdyBmb2N1cyBvbiBidXR0b25zXG5cdFx0aWYgKHRoaXMucHJvcHMuc3BhY2VLZXkgPT09IGV2ZW50LmtleUNvZGUpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vU3RvcCBwYWdlIGZyb20gc2Nyb2xsaW5nXG5cdFx0XHQkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKCcuaXRlbV9fYWN0aW9uc19fYWN0aW9uJykuZmlyc3QoKS5mb2N1cygpO1xuXHRcdH1cblxuXHRcdC8vSWYgcmV0dXJuIGlzIHByZXNzZWQsIG5hdmlnYXRlIGZvbGRlclxuXHRcdGlmICh0aGlzLnByb3BzLnJldHVybktleSA9PT0gZXZlbnQua2V5Q29kZSkge1xuXHRcdFx0dGhpcy5vbkZpbGVOYXZpZ2F0ZShldmVudCk7XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlRm9jdXMoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5zZXRGb2N1cyh0aGlzLnByb3BzLmlkKTtcblx0fVxuXG5cdGhhbmRsZUJsdXIoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5zZXRGb2N1cyhmYWxzZSk7XG5cdH1cblx0XG5cdHByZXZlbnRGb2N1cyhldmVudCkge1xuXHRcdC8vVG8gYXZvaWQgYnJvd3NlcidzIGRlZmF1bHQgZm9jdXMgc3RhdGUgd2hlbiBzZWxlY3RpbmcgYW4gaXRlbVxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0dmFyIHNlbGVjdEJ1dHRvbjtcblx0XHR2YXIgZGVsZXRlQnV0dG9uO1xuXHRcdHZhciBlZGl0QnV0dG9uO1xuXG5cdFx0c2VsZWN0QnV0dG9uID0gPGJ1dHRvblxuXHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1zZWxlY3QgWyBmb250LWljb24tdGljayBdJ1xuXHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0dGl0bGU9e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlNFTEVDVCcpfVxuXHRcdFx0dGFiSW5kZXg9e3RoaXMuZ2V0QnV0dG9uVGFiSW5kZXgoKX1cblx0XHRcdG9uQ2xpY2s9e3RoaXMub25GaWxlU2VsZWN0fVxuXHRcdFx0b25Gb2N1cz17dGhpcy5oYW5kbGVGb2N1c31cblx0XHRcdG9uQmx1cj17dGhpcy5oYW5kbGVCbHVyfT5cblx0XHQ8L2J1dHRvbj47XG5cblx0XHRpZih0aGlzLnByb3BzLmNhbkRlbGV0ZSkge1xuXHRcdFx0ZGVsZXRlQnV0dG9uID0gPGJ1dHRvblxuXHRcdFx0XHRjbGFzc05hbWU9J2l0ZW1fX2FjdGlvbnNfX2FjdGlvbiBpdGVtX19hY3Rpb25zX19hY3Rpb24tLXJlbW92ZSBbIGZvbnQtaWNvbi10cmFzaCBdJ1xuXHRcdFx0XHR0eXBlPSdidXR0b24nXG5cdFx0XHRcdHRpdGxlPXtpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5ERUxFVEUnKX1cblx0XHRcdFx0dGFiSW5kZXg9e3RoaXMuZ2V0QnV0dG9uVGFiSW5kZXgoKX1cblx0XHRcdFx0b25DbGljaz17dGhpcy5vbkZpbGVEZWxldGV9XG5cdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlRm9jdXN9XG5cdFx0XHRcdG9uQmx1cj17dGhpcy5oYW5kbGVCbHVyfT5cblx0XHRcdDwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRpZih0aGlzLnByb3BzLmNhbkVkaXQpIHtcblx0XHRcdGVkaXRCdXR0b24gPSA8YnV0dG9uXG5cdFx0XHRcdGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tZWRpdCBbIGZvbnQtaWNvbi1lZGl0IF0nXG5cdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0dGl0bGU9e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkVESVQnKX1cblx0XHRcdFx0dGFiSW5kZXg9e3RoaXMuZ2V0QnV0dG9uVGFiSW5kZXgoKX1cblx0XHRcdFx0b25DbGljaz17dGhpcy5vbkZpbGVFZGl0fVxuXHRcdFx0XHRvbkZvY3VzPXt0aGlzLmhhbmRsZUZvY3VzfVxuXHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn0+XG5cdFx0XHQ8L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmdldEl0ZW1DbGFzc05hbWVzKCl9IGRhdGEtaWQ9e3RoaXMucHJvcHMuaWR9IG9uRG91YmxlQ2xpY2s9e3RoaXMuaGFuZGxlRG91YmxlQ2xpY2t9PlxuXHRcdFx0PGRpdiByZWY9XCJ0aHVtYm5haWxcIiBjbGFzc05hbWU9e3RoaXMuZ2V0VGh1bWJuYWlsQ2xhc3NOYW1lcygpfSB0YWJJbmRleD1cIjBcIiBvbktleURvd249e3RoaXMuaGFuZGxlS2V5RG93bn0gc3R5bGU9e3RoaXMuZ2V0VGh1bWJuYWlsU3R5bGVzKCl9IG9uQ2xpY2s9e3RoaXMub25GaWxlU2VsZWN0fSBvbk1vdXNlRG93bj17dGhpcy5wcmV2ZW50Rm9jdXN9PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naXRlbV9fYWN0aW9ucyc+XG5cdFx0XHRcdFx0e3NlbGVjdEJ1dHRvbn1cblx0XHRcdFx0XHR7ZGVsZXRlQnV0dG9ufVxuXHRcdFx0XHRcdHtlZGl0QnV0dG9ufVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PHAgY2xhc3NOYW1lPSdpdGVtX190aXRsZScgcmVmPVwidGl0bGVcIj57dGhpcy5wcm9wcy50aXRsZX08L3A+XG5cdFx0PC9kaXY+O1xuXHR9XG59XG5cbkZpbGVDb21wb25lbnQucHJvcFR5cGVzID0ge1xuXHRpZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0dGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdGNhdGVnb3J5OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHR1cmw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdGRpbWVuc2lvbnM6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0d2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdFx0aGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG5cdH0pLFxuXHRvbkZpbGVOYXZpZ2F0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdG9uRmlsZUVkaXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRvbkZpbGVEZWxldGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRzcGFjZUtleTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0cmV0dXJuS2V5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRvbkZpbGVTZWxlY3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRzZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdGNhbkVkaXQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRjYW5EZWxldGU6IFJlYWN0LlByb3BUeXBlcy5ib29sXG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcblx0cmV0dXJuIHtcblx0XHRnYWxsZXJ5OiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnlcblx0fVxufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0cmV0dXJuIHtcblx0XHRhY3Rpb25zOiBiaW5kQWN0aW9uQ3JlYXRvcnMoZ2FsbGVyeUFjdGlvbnMsIGRpc3BhdGNoKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEZpbGVDb21wb25lbnQpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHRGaWVsZENvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J2ZpZWxkIHRleHQnPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0nbGVmdCcgaHRtbEZvcj17J2dhbGxlcnlfJyArIHRoaXMucHJvcHMubmFtZX0+e3RoaXMucHJvcHMubGFiZWx9PC9sYWJlbD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBpZD17J2dhbGxlcnlfJyArIHRoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSd0ZXh0J1xuICAgICAgICAgICAgICAgICAgICB0eXBlPSd0ZXh0J1xuICAgICAgICAgICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWV9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgfVxuXG4gICAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoKTtcbiAgICB9XG59XG5cblRleHRGaWVsZENvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcbiIsImltcG9ydCBpMThuIGZyb20gJ2kxOG4nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdCdUSFVNQk5BSUxfSEVJR0hUJzogMTUwLFxuXHQnVEhVTUJOQUlMX1dJRFRIJzogMjAwLFxuXHQnU1BBQ0VfS0VZX0NPREUnOiAzMixcblx0J1JFVFVSTl9LRVlfQ09ERSc6IDEzLFxuXHQnQlVMS19BQ1RJT05TJzogW1xuXHRcdHtcblx0XHRcdHZhbHVlOiAnZGVsZXRlJyxcblx0XHRcdGxhYmVsOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5CVUxLX0FDVElPTlNfREVMRVRFJyksXG5cdFx0XHRkZXN0cnVjdGl2ZTogdHJ1ZVxuXHRcdH1cblx0XSxcbiAgICAnQlVMS19BQ1RJT05TX1BMQUNFSE9MREVSJzogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQlVMS19BQ1RJT05TX1BMQUNFSE9MREVSJylcbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNpbHZlclN0cmlwZUNvbXBvbmVudCBmcm9tICdzaWx2ZXJzdHJpcGUtY29tcG9uZW50JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBiaW5kQWN0aW9uQ3JlYXRvcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgKiBhcyBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi8uLi9zdGF0ZS9nYWxsZXJ5L2FjdGlvbnMnO1xuaW1wb3J0IFRleHRGaWVsZENvbXBvbmVudCBmcm9tICcuLi8uLi9jb21wb25lbnRzL3RleHQtZmllbGQvaW5kZXgnXG5cbmNsYXNzIEVkaXRvckNvbnRhaW5lciBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5maWVsZHMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdCdsYWJlbCc6ICdUaXRsZScsXG5cdFx0XHRcdCduYW1lJzogJ3RpdGxlJyxcblx0XHRcdFx0J3ZhbHVlJzogdGhpcy5wcm9wcy5maWxlLnRpdGxlXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQnbGFiZWwnOiAnRmlsZW5hbWUnLFxuXHRcdFx0XHQnbmFtZSc6ICdiYXNlbmFtZScsXG5cdFx0XHRcdCd2YWx1ZSc6IHRoaXMucHJvcHMuZmlsZS5iYXNlbmFtZVxuXHRcdFx0fVxuXHRcdF07XG5cblx0XHR0aGlzLm9uRmllbGRDaGFuZ2UgPSB0aGlzLm9uRmllbGRDaGFuZ2UuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZVNhdmUgPSB0aGlzLm9uRmlsZVNhdmUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uQ2FuY2VsID0gdGhpcy5vbkNhbmNlbC5iaW5kKHRoaXMpO1xuXHR9XG5cblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0c3VwZXIuY29tcG9uZW50RGlkTW91bnQoKTtcblxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZXRFZGl0b3JGaWVsZHModGhpcy5maWVsZHMpO1xuXHR9XG5cdFxuXHRjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcblx0XHRzdXBlci5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXHRcdFxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZXRFZGl0b3JGaWVsZHMoKTtcblx0fVxuXG5cdG9uRmllbGRDaGFuZ2UoZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMudXBkYXRlRWRpdG9yRmllbGQoe1xuXHRcdFx0bmFtZTogZXZlbnQudGFyZ2V0Lm5hbWUsXG5cdFx0XHR2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlXG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbGVTYXZlKGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5vbkZpbGVTYXZlKHRoaXMucHJvcHMuZmlsZS5pZCwgdGhpcy5wcm9wcy5nYWxsZXJ5LmVkaXRvckZpZWxkcywgZXZlbnQpO1xuXHR9XG5cblx0b25DYW5jZWwoZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuc2V0RWRpdGluZyhmYWxzZSk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdlZGl0b3InPlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvIG5vbGFiZWwnPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8tcHJldmlldyBub2xhYmVsJz5cblx0XHRcdFx0XHQ8aW1nIGNsYXNzTmFtZT0ndGh1bWJuYWlsLXByZXZpZXcnIHNyYz17dGhpcy5wcm9wcy5maWxlLnVybH0gLz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1kYXRhIG5vbGFiZWwnPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgbm9sYWJlbCc+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuVFlQRScpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLnR5cGV9PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0laRScpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuc2l6ZX08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlVSTCcpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0XHRcdDxhIGhyZWY9e3RoaXMucHJvcHMuZmlsZS51cmx9IHRhcmdldD0nX2JsYW5rJz57dGhpcy5wcm9wcy5maWxlLnVybH08L2E+XG5cdFx0XHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5DUkVBVEVEJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5jcmVhdGVkfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCBkYXRlX2Rpc2FibGVkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5MQVNURURJVCcpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUubGFzdFVwZGF0ZWR9PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5ESU0nKX06PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy53aWR0aH0geCB7dGhpcy5wcm9wcy5maWxlLmF0dHJpYnV0ZXMuZGltZW5zaW9ucy5oZWlnaHR9cHg8L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdHt0aGlzLnByb3BzLmdhbGxlcnkuZWRpdG9yRmllbGRzLm1hcCgoZmllbGQsIGkpID0+IHtcblx0XHRcdFx0cmV0dXJuIDxUZXh0RmllbGRDb21wb25lbnRcblx0XHRcdFx0XHRcdGtleT17aX1cblx0XHRcdFx0XHRcdGxhYmVsPXtmaWVsZC5sYWJlbH1cblx0XHRcdFx0XHRcdG5hbWU9e2ZpZWxkLm5hbWV9XG5cdFx0XHRcdFx0XHR2YWx1ZT17ZmllbGQudmFsdWV9XG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5vbkZpZWxkQ2hhbmdlfSAvPlxuXHRcdFx0fSl9XG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0dHlwZT0nc3VibWl0J1xuXHRcdFx0XHRcdGNsYXNzTmFtZT1cInNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tY2hlY2stbWFya1wiXG5cdFx0XHRcdFx0b25DbGljaz17dGhpcy5vbkZpbGVTYXZlfT5cblx0XHRcdFx0XHR7aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0FWRScpfVxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0XHRjbGFzc05hbWU9XCJzcy11aS1idXR0b24gdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNhbmNlbC1jaXJjbGVkXCJcblx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLm9uQ2FuY2VsfT5cblx0XHRcdFx0XHR7aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQ0FOQ0VMJyl9XG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+O1xuXHR9XG59XG5cbkVkaXRvckNvbnRhaW5lci5wcm9wVHlwZXMgPSB7XG5cdGZpbGU6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0aWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdFx0dGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0YmFzZW5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dXJsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHNpemU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0Y3JlYXRlZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRsYXN0VXBkYXRlZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRkaW1lbnNpb25zOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHRcdFx0d2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdFx0XHRoZWlnaHQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcblx0XHR9KVxuXHR9KSxcblx0b25GaWxlU2F2ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdG9uQ2FuY2VsOlJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcblx0cmV0dXJuIHtcblx0XHRnYWxsZXJ5OiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnlcblx0fVxufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0cmV0dXJuIHtcblx0XHRhY3Rpb25zOiBiaW5kQWN0aW9uQ3JlYXRvcnMoZ2FsbGVyeUFjdGlvbnMsIGRpc3BhdGNoKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEVkaXRvckNvbnRhaW5lcik7XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgYmluZEFjdGlvbkNyZWF0b3JzIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0IFJlYWN0VGVzdFV0aWxzIGZyb20gJ3JlYWN0LWFkZG9ucy10ZXN0LXV0aWxzJztcbmltcG9ydCBGaWxlQ29tcG9uZW50IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZmlsZS9pbmRleCc7XG5pbXBvcnQgRWRpdG9yQ29udGFpbmVyIGZyb20gJy4uL2VkaXRvci9jb250cm9sbGVyLmpzJztcbmltcG9ydCBCdWxrQWN0aW9uc0NvbXBvbmVudCBmcm9tICcuLi8uLi9jb21wb25lbnRzL2J1bGstYWN0aW9ucy9pbmRleCc7XG5pbXBvcnQgU2lsdmVyU3RyaXBlQ29tcG9uZW50IGZyb20gJ3NpbHZlcnN0cmlwZS1jb21wb25lbnQnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xuaW1wb3J0ICogYXMgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vLi4vc3RhdGUvZ2FsbGVyeS9hY3Rpb25zJztcblxuZnVuY3Rpb24gZ2V0Q29tcGFyYXRvcihmaWVsZCwgZGlyZWN0aW9uKSB7XG5cdHJldHVybiAoYSwgYikgPT4ge1xuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdhc2MnKSB7XG5cdFx0XHRpZiAoYVtmaWVsZF0gPCBiW2ZpZWxkXSkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhW2ZpZWxkXSA+IGJbZmllbGRdKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoYVtmaWVsZF0gPiBiW2ZpZWxkXSkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhW2ZpZWxkXSA8IGJbZmllbGRdKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAwO1xuXHR9O1xufVxuXG5mdW5jdGlvbiBnZXRTb3J0KGZpZWxkLCBkaXJlY3Rpb24pIHtcblx0bGV0IGNvbXBhcmF0b3IgPSBnZXRDb21wYXJhdG9yKGZpZWxkLCBkaXJlY3Rpb24pO1xuXG5cdHJldHVybiAoKSA9PiB7XG5cdFx0bGV0IGZvbGRlcnMgPSB0aGlzLnByb3BzLmdhbGxlcnkuZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS50eXBlID09PSAnZm9sZGVyJyk7XG5cdFx0bGV0IGZpbGVzID0gdGhpcy5wcm9wcy5nYWxsZXJ5LmZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUudHlwZSAhPT0gJ2ZvbGRlcicpO1xuXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmFkZEZpbGUoZm9sZGVycy5zb3J0KGNvbXBhcmF0b3IpLmNvbmNhdChmaWxlcy5zb3J0KGNvbXBhcmF0b3IpKSk7XG5cdH1cbn1cblxuY2xhc3MgR2FsbGVyeUNvbnRhaW5lciBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLmZvbGRlcnMgPSBbcHJvcHMuaW5pdGlhbF9mb2xkZXJdO1xuXG5cdFx0dGhpcy5zb3J0ID0gJ25hbWUnO1xuXHRcdHRoaXMuZGlyZWN0aW9uID0gJ2FzYyc7XG5cblx0XHR0aGlzLnNvcnRlcnMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdCdmaWVsZCc6ICd0aXRsZScsXG5cdFx0XHRcdCdkaXJlY3Rpb24nOiAnYXNjJyxcblx0XHRcdFx0J2xhYmVsJzogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRklMVEVSX1RJVExFX0FTQycpLFxuXHRcdFx0XHQnb25Tb3J0JzogZ2V0U29ydC5jYWxsKHRoaXMsICd0aXRsZScsICdhc2MnKVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J2ZpZWxkJzogJ3RpdGxlJyxcblx0XHRcdFx0J2RpcmVjdGlvbic6ICdkZXNjJyxcblx0XHRcdFx0J2xhYmVsJzogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRklMVEVSX1RJVExFX0RFU0MnKSxcblx0XHRcdFx0J29uU29ydCc6IGdldFNvcnQuY2FsbCh0aGlzLCAndGl0bGUnLCAnZGVzYycpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQnZmllbGQnOiAnY3JlYXRlZCcsXG5cdFx0XHRcdCdkaXJlY3Rpb24nOiAnZGVzYycsXG5cdFx0XHRcdCdsYWJlbCc6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkZJTFRFUl9EQVRFX0RFU0MnKSxcblx0XHRcdFx0J29uU29ydCc6IGdldFNvcnQuY2FsbCh0aGlzLCAnY3JlYXRlZCcsICdkZXNjJylcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCdmaWVsZCc6ICdjcmVhdGVkJyxcblx0XHRcdFx0J2RpcmVjdGlvbic6ICdhc2MnLFxuXHRcdFx0XHQnbGFiZWwnOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfREFURV9BU0MnKSxcblx0XHRcdFx0J29uU29ydCc6IGdldFNvcnQuY2FsbCh0aGlzLCAnY3JlYXRlZCcsICdhc2MnKVxuXHRcdFx0fVxuXHRcdF07XG5cblx0XHQvLyBCYWNrZW5kIGV2ZW50IGxpc3RlbmVyc1xuXHRcdHRoaXMub25GZXRjaERhdGEgPSB0aGlzLm9uRmV0Y2hEYXRhLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vblNhdmVEYXRhID0gdGhpcy5vblNhdmVEYXRhLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbkRlbGV0ZURhdGEgPSB0aGlzLm9uRGVsZXRlRGF0YS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25OYXZpZ2F0ZURhdGEgPSB0aGlzLm9uTmF2aWdhdGVEYXRhLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbk1vcmVEYXRhID0gdGhpcy5vbk1vcmVEYXRhLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vblNlYXJjaERhdGEgPSB0aGlzLm9uU2VhcmNoRGF0YS5iaW5kKHRoaXMpO1xuXG5cdFx0Ly8gVXNlciBldmVudCBsaXN0ZW5lcnNcblx0XHR0aGlzLm9uRmlsZVNhdmUgPSB0aGlzLm9uRmlsZVNhdmUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZU5hdmlnYXRlID0gdGhpcy5vbkZpbGVOYXZpZ2F0ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25GaWxlRGVsZXRlID0gdGhpcy5vbkZpbGVEZWxldGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uQmFja0NsaWNrID0gdGhpcy5vbkJhY2tDbGljay5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25Nb3JlQ2xpY2sgPSB0aGlzLm9uTW9yZUNsaWNrLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbk5hdmlnYXRlID0gdGhpcy5vbk5hdmlnYXRlLmJpbmQodGhpcyk7XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHRzdXBlci5jb21wb25lbnREaWRNb3VudCgpO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMuaW5pdGlhbF9mb2xkZXIgIT09IHRoaXMucHJvcHMuY3VycmVudF9mb2xkZXIpIHtcblx0XHRcdHRoaXMub25OYXZpZ2F0ZSh0aGlzLnByb3BzLmN1cnJlbnRfZm9sZGVyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLnNlYXJjaCgpO1xuXHRcdH1cblxuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5vbignb25GZXRjaERhdGEnLCB0aGlzLm9uRmV0Y2hEYXRhKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQub24oJ29uU2F2ZURhdGEnLCB0aGlzLm9uU2F2ZURhdGEpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5vbignb25EZWxldGVEYXRhJywgdGhpcy5vbkRlbGV0ZURhdGEpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5vbignb25OYXZpZ2F0ZURhdGEnLCB0aGlzLm9uTmF2aWdhdGVEYXRhKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQub24oJ29uTW9yZURhdGEnLCB0aGlzLm9uTW9yZURhdGEpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5vbignb25TZWFyY2hEYXRhJywgdGhpcy5vblNlYXJjaERhdGEpO1xuXHR9XG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQoKSB7XG5cdFx0c3VwZXIuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcignb25GZXRjaERhdGEnLCB0aGlzLm9uRmV0Y2hEYXRhKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uU2F2ZURhdGEnLCB0aGlzLm9uU2F2ZURhdGEpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcignb25EZWxldGVEYXRhJywgdGhpcy5vbkRlbGV0ZURhdGEpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcignb25OYXZpZ2F0ZURhdGEnLCB0aGlzLm9uTmF2aWdhdGVEYXRhKTtcblx0XHR0aGlzLnByb3BzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uTW9yZURhdGEnLCB0aGlzLm9uTW9yZURhdGEpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcignb25TZWFyY2hEYXRhJywgdGhpcy5vblNlYXJjaERhdGEpO1xuXHR9XG5cblx0Y29tcG9uZW50RGlkVXBkYXRlKCkge1xuXHRcdHZhciAkc2VsZWN0ID0gJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmdhbGxlcnlfX3NvcnQgLmRyb3Bkb3duJyk7XG5cblx0XHQvLyBXZSBvcHQtb3V0IG9mIGxldHRpbmcgdGhlIENNUyBoYW5kbGUgQ2hvc2VuIGJlY2F1c2UgaXQgZG9lc24ndCByZS1hcHBseSB0aGUgYmVoYXZpb3VyIGNvcnJlY3RseS5cblx0XHQvLyBTbyBhZnRlciB0aGUgZ2FsbGVyeSBoYXMgYmVlbiByZW5kZXJlZCB3ZSBhcHBseSBDaG9zZW4uXG5cdFx0JHNlbGVjdC5jaG9zZW4oe1xuXHRcdFx0J2FsbG93X3NpbmdsZV9kZXNlbGVjdCc6IHRydWUsXG5cdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMjBcblx0XHR9KTtcblxuXHRcdC8vIENob3NlbiBzdG9wcyB0aGUgY2hhbmdlIGV2ZW50IGZyb20gcmVhY2hpbmcgUmVhY3Qgc28gd2UgaGF2ZSB0byBzaW11bGF0ZSBhIGNsaWNrLlxuXHRcdCRzZWxlY3QuY2hhbmdlKCgpID0+IFJlYWN0VGVzdFV0aWxzLlNpbXVsYXRlLmNsaWNrKCRzZWxlY3QuZmluZCgnOnNlbGVjdGVkJylbMF0pKTtcblx0fVxuXG5cdGdldEZpbGVCeUlkKGlkKSB7XG5cdFx0dmFyIGZvbGRlciA9IG51bGw7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZ2FsbGVyeS5maWxlcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0aWYgKHRoaXMucHJvcHMuZ2FsbGVyeS5maWxlc1tpXS5pZCA9PT0gaWQpIHtcblx0XHRcdFx0Zm9sZGVyID0gdGhpcy5wcm9wcy5nYWxsZXJ5LmZpbGVzW2ldO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZm9sZGVyO1xuXHR9XG5cdFxuXHRnZXROb0l0ZW1zTm90aWNlKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmdhbGxlcnkuY291bnQgPCAxKSB7XG5cdFx0XHRyZXR1cm4gPHAgY2xhc3NOYW1lPVwiZ2FsbGVyeV9fbm8taXRlbS1ub3RpY2VcIj57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuTk9JVEVNU0ZPVU5EJyl9PC9wPjtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRCYWNrQnV0dG9uKCkge1xuXHRcdGlmICh0aGlzLmZvbGRlcnMubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuIDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPSdnYWxsZXJ5X19iYWNrIHNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tbGV2ZWwtdXAgbm8tdGV4dCdcblx0XHRcdFx0b25DbGljaz17dGhpcy5vbkJhY2tDbGlja31cblx0XHRcdFx0cmVmPVwiYmFja0J1dHRvblwiPjwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGdldEJ1bGtBY3Rpb25zQ29tcG9uZW50KCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmdhbGxlcnkuc2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwICYmIHRoaXMucHJvcHMuYmFja2VuZC5idWxrQWN0aW9ucykge1xuXHRcdFx0cmV0dXJuIDxCdWxrQWN0aW9uc0NvbXBvbmVudFxuXHRcdFx0XHRiYWNrZW5kPXt0aGlzLnByb3BzLmJhY2tlbmR9IC8+O1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Z2V0TW9yZUJ1dHRvbigpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LmNvdW50ID4gdGhpcy5wcm9wcy5nYWxsZXJ5LmZpbGVzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPVwiZ2FsbGVyeV9fbG9hZF9fbW9yZVwiXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25Nb3JlQ2xpY2t9PntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5MT0FETU9SRScpfTwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LmVkaXRpbmcgIT09IGZhbHNlKSB7XG5cdFx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2dhbGxlcnknPlxuXHRcdFx0XHQ8RWRpdG9yQ29udGFpbmVyXG5cdFx0XHRcdFx0ZmlsZT17dGhpcy5wcm9wcy5nYWxsZXJ5LmVkaXRpbmd9XG5cdFx0XHRcdFx0b25GaWxlU2F2ZT17dGhpcy5vbkZpbGVTYXZlfVxuXHRcdFx0XHRcdG9uQ2FuY2VsPXt0aGlzLm9uQ2FuY2VsfSAvPlxuXHRcdFx0PC9kaXY+O1xuXHRcdH1cblxuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeSc+XG5cdFx0XHR7dGhpcy5nZXRCYWNrQnV0dG9uKCl9XG5cdFx0XHR7dGhpcy5nZXRCdWxrQWN0aW9uc0NvbXBvbmVudCgpfVxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5X19zb3J0IGZpZWxkaG9sZGVyLXNtYWxsXCI+XG5cdFx0XHRcdDxzZWxlY3QgY2xhc3NOYW1lPVwiZHJvcGRvd24gbm8tY2hhbmdlLXRyYWNrIG5vLWNoem5cIiB0YWJJbmRleD1cIjBcIiBzdHlsZT17e3dpZHRoOiAnMTYwcHgnfX0+XG5cdFx0XHRcdFx0e3RoaXMuc29ydGVycy5tYXAoKHNvcnRlciwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDxvcHRpb24ga2V5PXtpfSBvbkNsaWNrPXtzb3J0ZXIub25Tb3J0fT57c29ydGVyLmxhYmVsfTwvb3B0aW9uPjtcblx0XHRcdFx0XHR9KX1cblx0XHRcdFx0PC9zZWxlY3Q+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdnYWxsZXJ5X19pdGVtcyc+XG5cdFx0XHRcdHt0aGlzLnByb3BzLmdhbGxlcnkuZmlsZXMubWFwKChmaWxlLCBpKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIDxGaWxlQ29tcG9uZW50IGtleT17aX0gey4uLmZpbGV9XG5cdFx0XHRcdFx0XHRzcGFjZUtleT17Q09OU1RBTlRTLlNQQUNFX0tFWV9DT0RFfVxuXHRcdFx0XHRcdFx0cmV0dXJuS2V5PXtDT05TVEFOVFMuUkVUVVJOX0tFWV9DT0RFfVxuXHRcdFx0XHRcdFx0b25GaWxlRGVsZXRlPXt0aGlzLm9uRmlsZURlbGV0ZX1cblx0XHRcdFx0XHRcdG9uRmlsZU5hdmlnYXRlPXt0aGlzLm9uRmlsZU5hdmlnYXRlfSAvPjtcblx0XHRcdFx0fSl9XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdHt0aGlzLmdldE5vSXRlbXNOb3RpY2UoKX1cblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZ2FsbGVyeV9fbG9hZFwiPlxuXHRcdFx0XHR7dGhpcy5nZXRNb3JlQnV0dG9uKCl9XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHRvbkZldGNoRGF0YShkYXRhKSB7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmFkZEZpbGUoZGF0YS5maWxlcywgZGF0YS5jb3VudCk7XG5cdH1cblxuXHRvblNhdmVEYXRhKGlkLCB2YWx1ZXMpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuc2V0RWRpdGluZyhmYWxzZSk7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLnVwZGF0ZUZpbGUoaWQsIHsgdGl0bGU6IHZhbHVlcy50aXRsZSwgYmFzZW5hbWU6IHZhbHVlcy5iYXNlbmFtZSB9KTtcblx0fVxuXG5cdG9uRGVsZXRlRGF0YShkYXRhKSB7XG5cdFx0Y29uc3QgZmlsZXMgPSB0aGlzLnByb3BzLmdhbGxlcnkuZmlsZXMuZmlsdGVyKChmaWxlKSA9PiB7XG5cdFx0XHRyZXR1cm4gZGF0YSAhPT0gZmlsZS5pZDtcblx0XHR9KTtcblxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlKGZpbGVzLCB0aGlzLnByb3BzLmdhbGxlcnkuY291bnQgLSAxKTtcblx0fVxuXG5cdG9uTmF2aWdhdGVEYXRhKGRhdGEpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuYWRkRmlsZShkYXRhLmZpbGVzLCBkYXRhLmNvdW50KTtcblx0fVxuXG5cdG9uTW9yZURhdGEoZGF0YSkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlKHRoaXMucHJvcHMuZ2FsbGVyeS5maWxlcy5jb25jYXQoZGF0YS5maWxlcyksIGRhdGEuY291bnQpO1xuXHR9XG5cblx0b25TZWFyY2hEYXRhKGRhdGEpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuYWRkRmlsZShkYXRhLmZpbGVzLCBkYXRhLmNvdW50KTtcblx0fVxuXG5cdG9uRmlsZURlbGV0ZShmaWxlLCBldmVudCkge1xuXHRcdGlmIChjb25maXJtKGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkNPTkZJUk1ERUxFVEUnKSkpIHtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5kZWxldGUoZmlsZS5pZCk7XG5cdFx0fVxuXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH1cblxuXHRvbkZpbGVOYXZpZ2F0ZShmaWxlKSB7XG5cdFx0dGhpcy5mb2xkZXJzLnB1c2goZmlsZS5maWxlbmFtZSk7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm5hdmlnYXRlKGZpbGUuZmlsZW5hbWUpO1xuXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmRlc2VsZWN0RmlsZXMoKTtcblx0fVxuXG5cdG9uTmF2aWdhdGUoZm9sZGVyLCBzaWxlbnQgPSBmYWxzZSkge1xuXHRcdC8vIERvbid0IHB1c2ggdGhlIGZvbGRlciB0byB0aGUgYXJyYXkgaWYgaXQgZXhpc3RzIGFscmVhZHkuXG5cdFx0aWYgKHRoaXMuZm9sZGVycy5pbmRleE9mKGZvbGRlcikgPT09IC0xKSB7XG5cdFx0XHR0aGlzLmZvbGRlcnMucHVzaChmb2xkZXIpO1xuXHRcdH1cblxuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5uYXZpZ2F0ZShmb2xkZXIpO1xuXHR9XG5cblx0b25Nb3JlQ2xpY2soZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5tb3JlKCk7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0b25CYWNrQ2xpY2soZXZlbnQpIHtcblx0XHRpZiAodGhpcy5mb2xkZXJzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHRoaXMuZm9sZGVycy5wb3AoKTtcblx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5uYXZpZ2F0ZSh0aGlzLmZvbGRlcnNbdGhpcy5mb2xkZXJzLmxlbmd0aCAtIDFdKTtcblx0XHR9XG5cblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuZGVzZWxlY3RGaWxlcygpO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fVxuXG5cdG9uRmlsZVNhdmUoaWQsIHN0YXRlLCBldmVudCkge1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5zYXZlKGlkLCBzdGF0ZSk7XG5cblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG59XG5cbkdhbGxlcnlDb250YWluZXIucHJvcFR5cGVzID0ge1xuXHRiYWNrZW5kOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuXHRyZXR1cm4ge1xuXHRcdGdhbGxlcnk6IHN0YXRlLmFzc2V0QWRtaW4uZ2FsbGVyeVxuXHR9XG59XG5cbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuXHRyZXR1cm4ge1xuXHRcdGFjdGlvbnM6IGJpbmRBY3Rpb25DcmVhdG9ycyhnYWxsZXJ5QWN0aW9ucywgZGlzcGF0Y2gpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoR2FsbGVyeUNvbnRhaW5lcik7XG4iLCJleHBvcnQgY29uc3QgR0FMTEVSWSA9IHtcbiAgICBBRERfRklMRTogJ0FERF9GSUxFJyxcbiAgICBVUERBVEVfRklMRTogJ1VQREFURV9GSUxFJyxcbiAgICBTRUxFQ1RfRklMRVM6ICdTRUxFQ1RfRklMRVMnLFxuICAgIERFU0VMRUNUX0ZJTEVTOiAnREVTRUxFQ1RfRklMRVMnLFxuICAgIFNFVF9FRElUSU5HOiAnU0VUX0VESVRJTkcnLFxuICAgIFNFVF9GT0NVUzogJ1NFVF9GT0NVUycsXG4gICAgU0VUX0VESVRPUl9GSUVMRFM6ICdTRVRfRURJVE9SX0ZJRUxEUycsXG4gICAgVVBEQVRFX0VESVRPUl9GSUVMRDogJ1VQREFURV9FRElUT1JfRklFTEQnXG59XG4iLCIvKipcbiAqIEBmaWxlIEZhY3RvcnkgZm9yIGNyZWF0aW5nIGEgUmVkdXggc3RvcmUuXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCB0aHVua01pZGRsZXdhcmUgZnJvbSAncmVkdXgtdGh1bmsnOyAvLyBVc2VkIGZvciBoYW5kbGluZyBhc3luYyBzdG9yZSB1cGRhdGVzLlxuaW1wb3J0IGNyZWF0ZUxvZ2dlciBmcm9tICdyZWR1eC1sb2dnZXInOyAvLyBMb2dzIHN0YXRlIGNoYW5nZXMgdG8gdGhlIGNvbnNvbGUuIFVzZWZ1bCBmb3IgZGVidWdnaW5nLlxuaW1wb3J0IHJvb3RSZWR1Y2VyIGZyb20gJy4vcmVkdWNlcic7XG5cbi8qKlxuICogQGZ1bmMgY3JlYXRlU3RvcmVXaXRoTWlkZGxld2FyZVxuICogQHBhcmFtIGZ1bmN0aW9uIHJvb3RSZWR1Y2VyXG4gKiBAcGFyYW0gb2JqZWN0IGluaXRpYWxTdGF0ZVxuICogQGRlc2MgQ3JlYXRlcyBhIFJlZHV4IHN0b3JlIHdpdGggc29tZSBtaWRkbGV3YXJlIGFwcGxpZWQuXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBjcmVhdGVTdG9yZVdpdGhNaWRkbGV3YXJlID0gYXBwbHlNaWRkbGV3YXJlKFxuXHR0aHVua01pZGRsZXdhcmUsXG5cdGNyZWF0ZUxvZ2dlcigpXG4pKGNyZWF0ZVN0b3JlKTtcblxuLyoqXG4gKiBAZnVuYyBjb25maWd1cmVTdG9yZVxuICogQHBhcmFtIG9iamVjdCBpbml0aWFsU3RhdGVcbiAqIEByZXR1cm4gb2JqZWN0IC0gQSBSZWR1eCBzdG9yZSB0aGF0IGxldHMgeW91IHJlYWQgdGhlIHN0YXRlLCBkaXNwYXRjaCBhY3Rpb25zIGFuZCBzdWJzY3JpYmUgdG8gY2hhbmdlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29uZmlndXJlU3RvcmUoaW5pdGlhbFN0YXRlID0ge30pIHtcblx0Y29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZVdpdGhNaWRkbGV3YXJlKHJvb3RSZWR1Y2VyLCBpbml0aWFsU3RhdGUpO1xuXG5cdHJldHVybiBzdG9yZTtcbn07IiwiaW1wb3J0IHsgR0FMTEVSWSB9IGZyb20gJy4uL2FjdGlvbi10eXBlcyc7XG5cbi8qKlxuICogQWRkcyBhIGZpbGUgdG8gc3RhdGUuXG4gKlxuICogQHBhcmFtIG9iamVjdHxhcnJheSBmaWxlIC0gRmlsZSBvYmplY3Qgb3IgYXJyYXkgb2YgZmlsZSBvYmplY3RzLlxuICogQHBhcmFtIG51bWJlciBbY291bnRdIC0gVGhlIG51bWJlciBvZiBmaWxlcyBpbiB0aGUgY3VycmVudCB2aWV3LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRmlsZShmaWxlLCBjb3VudCkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCAoe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5BRERfRklMRSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgZmlsZSwgY291bnQgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogVXBkYXRlcyBhIGZpbGUgd2l0aCBuZXcgZGF0YS5cbiAqXG4gKiBAcGFyYW0gbnVtYmVyIGlkIC0gVGhlIGlkIG9mIHRoZSBmaWxlIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSBvYmplY3QgdXBkYXRlcyAtIFRoZSBuZXcgdmFsdWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRmlsZShpZCwgdXBkYXRlcykge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlVQREFURV9GSUxFLFxuICAgICAgICAgICAgcGF5bG9hZDogeyBpZCwgdXBkYXRlcyB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTZWxlY3RzIGEgZmlsZSBvciBmaWxlcy4gSWYgbm8gcGFyYW0gaXMgcGFzc2VkIGFsbCBmaWxlcyBhcmUgc2VsZWN0ZWQuXG4gKlxuICogQHBhcmFtIG51bWJlcnxhcnJheSBpZHMgLSBGaWxlIGlkIG9yIGFycmF5IG9mIGZpbGUgaWRzIHRvIHNlbGVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEZpbGVzKGlkcyA9IG51bGwpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5TRUxFQ1RfRklMRVMsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGlkcyB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXNlbGVjdHMgYSBmaWxlIG9yIGZpbGVzLiBJZiBubyBwYXJhbSBpcyBwYXNzZWQgYWxsIGZpbGVzIGFyZSBkZXNlbGVjdGVkLlxuICpcbiAqIEBwYXJhbSBudW1iZXJ8YXJyYXkgaWRzIC0gRmlsZSBpZCBvciBhcnJheSBvZiBmaWxlIGlkcyB0byBkZXNlbGVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlc2VsZWN0RmlsZXMoaWRzID0gbnVsbCkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLkRFU0VMRUNUX0ZJTEVTLFxuICAgICAgICAgICAgcGF5bG9hZDogeyBpZHMgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU3RhcnRzIGVkaXRpbmcgdGhlIGdpdmVuIGZpbGUgb3Igc3RvcHMgZWRpdGluZyBpZiBmYWxzZSBpcyBnaXZlbi5cbiAqXG4gKiBAcGFyYW0gb2JqZWN0fGJvb2xlYW4gZmlsZSAtIFRoZSBmaWxlIHRvIGVkaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRFZGl0aW5nKGZpbGUpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5TRVRfRURJVElORyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgZmlsZSB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBmb2N1cyBzdGF0ZSBvZiBhIGZpbGUuXG4gKlxuICogQHBhcmFtIG51bWJlcnxib29sZWFuIGlkIC0gdGhlIGlkIG9mIHRoZSBmaWxlIHRvIGZvY3VzIG9uLCBvciBmYWxzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZvY3VzKGlkKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuU0VUX0ZPQ1VTLFxuICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICAgIGlkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBzdGF0ZSBvZiB0aGUgZmllbGRzIGZvciB0aGUgZWRpdG9yIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0gb2JqZWN0IGVkaXRvckZpZWxkcyAtIHRoZSBjdXJyZW50IGZpZWxkcyBpbiB0aGUgZWRpdG9yIGNvbXBvbmVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RWRpdG9yRmllbGRzKGVkaXRvckZpZWxkcyA9IFtdKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcblx0XHRyZXR1cm4gZGlzcGF0Y2ggKHtcblx0XHRcdHR5cGU6IEdBTExFUlkuU0VUX0VESVRPUl9GSUVMRFMsXG5cdFx0XHRwYXlsb2FkOiB7IGVkaXRvckZpZWxkcyB9XG5cdFx0fSk7XG5cdH1cbn1cblxuLyoqXG4gKiBVcGRhdGUgdGhlIHZhbHVlIG9mIHRoZSBnaXZlbiBmaWVsZC5cbiAqXG4gKiBAcGFyYW0gb2JqZWN0IHVwZGF0ZXMgLSBUaGUgdmFsdWVzIHRvIHVwZGF0ZSB0aGUgZWRpdG9yIGZpZWxkIHdpdGguXG4gKiBAcGFyYW0gc3RyaW5nIHVwZGF0ZXMubmFtZSAtIFRoZSBlZGl0b3IgZmllbGQgbmFtZS5cbiAqIEBwYXJhbSBzdHJpbmcgdXBkYXRlcy52YWx1ZSAtIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGZpZWxkLlxuICogQHBhcmFtIHN0cmluZyBbdXBkYXRlcy5sYWJlbF0gLSBUaGUgZmllbGQgbGFiZWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVFZGl0b3JGaWVsZCh1cGRhdGVzKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcblx0XHRyZXR1cm4gZGlzcGF0Y2ggKHtcblx0XHRcdHR5cGU6IEdBTExFUlkuVVBEQVRFX0VESVRPUl9GSUVMRCxcblx0XHRcdHBheWxvYWQ6IHsgdXBkYXRlcyB9XG5cdFx0fSk7XG5cdH1cbn1cbiIsImltcG9ydCBkZWVwRnJlZXplIGZyb20gJ2RlZXAtZnJlZXplJztcbmltcG9ydCB7IEdBTExFUlkgfSBmcm9tICcuLi9hY3Rpb24tdHlwZXMnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICcuLi8uLi9jb25zdGFudHMuanMnO1xuXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XG4gICAgY291bnQ6IDAsIC8vIFRoZSBudW1iZXIgb2YgZmlsZXMgaW4gdGhlIGN1cnJlbnQgdmlld1xuICAgIGVkaXRpbmc6IGZhbHNlLFxuICAgIGZpbGVzOiBbXSxcbiAgICBzZWxlY3RlZEZpbGVzOiBbXSxcbiAgICBlZGl0aW5nOiBmYWxzZSxcbiAgICBmb2N1czogZmFsc2UsXG4gICAgYnVsa0FjdGlvbnM6IHtcbiAgICAgICAgcGxhY2Vob2xkZXI6IENPTlNUQU5UUy5CVUxLX0FDVElPTlNfUExBQ0VIT0xERVIsXG4gICAgICAgIG9wdGlvbnM6IENPTlNUQU5UUy5CVUxLX0FDVElPTlNcbiAgICB9LFxuICAgIGVkaXRvckZpZWxkczogW11cbn07XG5cbi8qKlxuICogUmVkdWNlciBmb3IgdGhlIGBhc3NldEFkbWluLmdhbGxlcnlgIHN0YXRlIGtleS5cbiAqXG4gKiBAcGFyYW0gb2JqZWN0IHN0YXRlXG4gKiBAcGFyYW0gb2JqZWN0IGFjdGlvbiAtIFRoZSBkaXNwYXRjaGVkIGFjdGlvbi5cbiAqIEBwYXJhbSBzdHJpbmcgYWN0aW9uLnR5cGUgLSBOYW1lIG9mIHRoZSBkaXNwYXRjaGVkIGFjdGlvbi5cbiAqIEBwYXJhbSBvYmplY3QgW2FjdGlvbi5wYXlsb2FkXSAtIE9wdGlvbmFsIGRhdGEgcGFzc2VkIHdpdGggdGhlIGFjdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2FsbGVyeVJlZHVjZXIoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikge1xuXG4gICAgdmFyIG5leHRTdGF0ZTtcblxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBHQUxMRVJZLkFERF9GSUxFOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBjb3VudDogYWN0aW9uLnBheWxvYWQuY291bnQgIT09ICd1bmRlZmluZWQnID8gYWN0aW9uLnBheWxvYWQuY291bnQgOiBzdGF0ZS5jb3VudCxcbiAgICAgICAgICAgICAgICBmaWxlczogc3RhdGUuZmlsZXMuY29uY2F0KGFjdGlvbi5wYXlsb2FkLmZpbGUpXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlVQREFURV9GSUxFOlxuICAgICAgICAgICAgbGV0IGZpbGVJbmRleCA9IHN0YXRlLmZpbGVzLm1hcChmaWxlID0+IGZpbGUuaWQpLmluZGV4T2YoYWN0aW9uLnBheWxvYWQuaWQpO1xuICAgICAgICAgICAgbGV0IHVwZGF0ZWRGaWxlID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZmlsZXNbZmlsZUluZGV4XSwgYWN0aW9uLnBheWxvYWQudXBkYXRlcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZmlsZXM6IHN0YXRlLmZpbGVzLm1hcChmaWxlID0+IGZpbGUuaWQgPT09IHVwZGF0ZWRGaWxlLmlkID8gdXBkYXRlZEZpbGUgOiBmaWxlKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5TRUxFQ1RfRklMRVM6XG4gICAgICAgICAgICBpZiAoYWN0aW9uLnBheWxvYWQuaWRzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gcGFyYW0gd2FzIHBhc3NlZCwgYWRkIGV2ZXJ5dGhpbmcgdGhhdCBpc24ndCBjdXJyZW50bHkgc2VsZWN0ZWQsIHRvIHRoZSBzZWxlY3RlZEZpbGVzIGFycmF5LlxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGaWxlczogc3RhdGUuc2VsZWN0ZWRGaWxlcy5jb25jYXQoc3RhdGUuZmlsZXMubWFwKGZpbGUgPT4gZmlsZS5pZCkuZmlsdGVyKGlkID0+IHN0YXRlLnNlbGVjdGVkRmlsZXMuaW5kZXhPZihpZCkgPT09IC0xKSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24ucGF5bG9hZC5pZHMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZGVhbGluZyB3aXRoIGEgc2luZ2xlIGlkIHRvIHNlbGVjdC5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGZpbGUgaWYgaXQncyBub3QgYWxyZWFkeSBzZWxlY3RlZC5cbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUuc2VsZWN0ZWRGaWxlcy5pbmRleE9mKGFjdGlvbi5wYXlsb2FkLmlkcykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmlsZXM6IHN0YXRlLnNlbGVjdGVkRmlsZXMuY29uY2F0KGFjdGlvbi5wYXlsb2FkLmlkcylcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBmaWxlIGlzIGFscmVhZHkgc2VsZWN0ZWQsIHNvIHJldHVybiB0aGUgY3VycmVudCBzdGF0ZS5cbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBXZSdyZSBkZWFsaW5nIHdpdGggYW4gYXJyYXkgaWYgaWRzIHRvIHNlbGVjdC5cbiAgICAgICAgICAgICAgICBuZXh0U3RhdGUgPSBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmlsZXM6IHN0YXRlLnNlbGVjdGVkRmlsZXMuY29uY2F0KGFjdGlvbi5wYXlsb2FkLmlkcy5maWx0ZXIoaWQgPT4gc3RhdGUuc2VsZWN0ZWRGaWxlcy5pbmRleE9mKGlkKSA9PT0gLTEpKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcblxuICAgICAgICBjYXNlIEdBTExFUlkuREVTRUxFQ1RfRklMRVM6XG4gICAgICAgICAgICBpZiAoYWN0aW9uLnBheWxvYWQuaWRzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gcGFyYW0gd2FzIHBhc3NlZCwgZGVzZWxlY3QgZXZlcnl0aGluZy5cbiAgICAgICAgICAgICAgICBuZXh0U3RhdGUgPSBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IHNlbGVjdGVkRmlsZXM6IFtdIH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi5wYXlsb2FkLmlkcyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSdyZSBkZWFsaW5nIHdpdGggYSBzaW5nbGUgaWQgdG8gZGVzZWxlY3QuXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVJbmRleCA9IHN0YXRlLnNlbGVjdGVkRmlsZXMuaW5kZXhPZihhY3Rpb24ucGF5bG9hZC5pZHMpO1xuXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEZpbGVzOiBzdGF0ZS5zZWxlY3RlZEZpbGVzLnNsaWNlKDAsIGZpbGVJbmRleCkuY29uY2F0KHN0YXRlLnNlbGVjdGVkRmlsZXMuc2xpY2UoZmlsZUluZGV4ICsgMSkpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBXZSdyZSBkZWFsaW5nIHdpdGggYW4gYXJyYXkgaWYgaWRzIHRvIGRlc2VsZWN0LlxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGaWxlczogc3RhdGUuc2VsZWN0ZWRGaWxlcy5maWx0ZXIoaWQgPT4gYWN0aW9uLnBheWxvYWQuaWRzLmluZGV4T2YoaWQpID09PSAtMSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFVF9FRElUSU5HOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBlZGl0aW5nOiBhY3Rpb24ucGF5bG9hZC5maWxlXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFVF9GT0NVUzpcbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZm9jdXM6IGFjdGlvbi5wYXlsb2FkLmlkXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFVF9FRElUT1JfRklFTERTOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBlZGl0b3JGaWVsZHM6IGFjdGlvbi5wYXlsb2FkLmVkaXRvckZpZWxkc1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgY2FzZSBHQUxMRVJZLlVQREFURV9FRElUT1JfRklFTEQ6XG4gICAgICAgICAgICBsZXQgZmllbGRJbmRleCA9IHN0YXRlLmVkaXRvckZpZWxkcy5tYXAoZmllbGQgPT4gZmllbGQubmFtZSkuaW5kZXhPZihhY3Rpb24ucGF5bG9hZC51cGRhdGVzLm5hbWUpO1xuICAgICAgICAgICAgbGV0IHVwZGF0ZWRGaWVsZCA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmVkaXRvckZpZWxkc1tmaWVsZEluZGV4XSwgYWN0aW9uLnBheWxvYWQudXBkYXRlcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZWRpdG9yRmllbGRzOiBzdGF0ZS5lZGl0b3JGaWVsZHMubWFwKGZpZWxkID0+IGZpZWxkLm5hbWUgPT09IHVwZGF0ZWRGaWVsZC5uYW1lID8gdXBkYXRlZEZpZWxkIDogZmllbGQpXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgVGhlIHJlZHVjZXIgd2hpY2ggb3BlcmF0ZXMgb24gdGhlIFJlZHV4IHN0b3JlLlxuICovXG5cbmltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBnYWxsZXJ5UmVkdWNlciBmcm9tICcuL2dhbGxlcnkvcmVkdWNlci5qcyc7XG5cbi8qKlxuICogT3BlcmF0ZXMgb24gdGhlIFJlZHV4IHN0b3JlIHRvIHVwZGF0ZSBhcHBsaWNhdGlvbiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0gb2JqZWN0IHN0YXRlIC0gVGhlIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gb2JqZWN0IGFjdGlvbiAtIFRoZSBkaXNwYXRjaGVkIGFjdGlvbi5cbiAqIEBwYXJhbSBzdHJpbmcgYWN0aW9uLnR5cGUgLSBUaGUgdHlwZSBvZiBhY3Rpb24gdGhhdCBoYXMgYmVlbiBkaXNwYXRjaGVkLlxuICogQHBhcmFtIG9iamVjdCBbYWN0aW9uLnBheWxvYWRdIC0gT3B0aW9uYWwgZGF0YSBwYXNzZWQgd2l0aCB0aGUgYWN0aW9uLlxuICovXG5jb25zdCByb290UmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gICAgYXNzZXRBZG1pbjogY29tYmluZVJlZHVjZXJzKHtcbiAgICAgICAgZ2FsbGVyeTogZ2FsbGVyeVJlZHVjZXJcbiAgICB9KVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWVwRnJlZXplIChvKSB7XG4gIE9iamVjdC5mcmVlemUobyk7XG5cbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobykuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgIGlmIChvLmhhc093blByb3BlcnR5KHByb3ApXG4gICAgJiYgb1twcm9wXSAhPT0gbnVsbFxuICAgICYmICh0eXBlb2Ygb1twcm9wXSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb1twcm9wXSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICYmICFPYmplY3QuaXNGcm96ZW4ob1twcm9wXSkpIHtcbiAgICAgIGRlZXBGcmVlemUob1twcm9wXSk7XG4gICAgfVxuICB9KTtcbiAgXG4gIHJldHVybiBvO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcmVwZWF0ID0gZnVuY3Rpb24gcmVwZWF0KHN0ciwgdGltZXMpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh0aW1lcyArIDEpLmpvaW4oc3RyKTtcbn07XG52YXIgcGFkID0gZnVuY3Rpb24gcGFkKG51bSwgbWF4TGVuZ3RoKSB7XG4gIHJldHVybiByZXBlYXQoXCIwXCIsIG1heExlbmd0aCAtIG51bS50b1N0cmluZygpLmxlbmd0aCkgKyBudW07XG59O1xudmFyIGZvcm1hdFRpbWUgPSBmdW5jdGlvbiBmb3JtYXRUaW1lKHRpbWUpIHtcbiAgcmV0dXJuIFwiQCBcIiArIHBhZCh0aW1lLmdldEhvdXJzKCksIDIpICsgXCI6XCIgKyBwYWQodGltZS5nZXRNaW51dGVzKCksIDIpICsgXCI6XCIgKyBwYWQodGltZS5nZXRTZWNvbmRzKCksIDIpICsgXCIuXCIgKyBwYWQodGltZS5nZXRNaWxsaXNlY29uZHMoKSwgMyk7XG59O1xuXG4vLyBVc2UgdGhlIG5ldyBwZXJmb3JtYW5jZSBhcGkgdG8gZ2V0IGJldHRlciBwcmVjaXNpb24gaWYgYXZhaWxhYmxlXG52YXIgdGltZXIgPSB0eXBlb2YgcGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gXCJmdW5jdGlvblwiID8gcGVyZm9ybWFuY2UgOiBEYXRlO1xuXG4vKipcbiAqIENyZWF0ZXMgbG9nZ2VyIHdpdGggZm9sbG93ZWQgb3B0aW9uc1xuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyBmb3IgbG9nZ2VyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gb3B0aW9ucy5sZXZlbCAtIGNvbnNvbGVbbGV2ZWxdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMuZHVyYXRpb24gLSBwcmludCBkdXJhdGlvbiBvZiBlYWNoIGFjdGlvbj9cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy50aW1lc3RhbXAgLSBwcmludCB0aW1lc3RhbXAgd2l0aCBlYWNoIGFjdGlvbj9cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBvcHRpb25zLmNvbG9ycyAtIGN1c3RvbSBjb2xvcnNcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBvcHRpb25zLmxvZ2dlciAtIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgY29uc29sZWAgQVBJXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMubG9nRXJyb3JzIC0gc2hvdWxkIGVycm9ycyBpbiBhY3Rpb24gZXhlY3V0aW9uIGJlIGNhdWdodCwgbG9nZ2VkLCBhbmQgcmUtdGhyb3duP1xuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLmNvbGxhcHNlZCAtIGlzIGdyb3VwIGNvbGxhcHNlZD9cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy5wcmVkaWNhdGUgLSBjb25kaXRpb24gd2hpY2ggcmVzb2x2ZXMgbG9nZ2VyIGJlaGF2aW9yXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBvcHRpb25zLnN0YXRlVHJhbnNmb3JtZXIgLSB0cmFuc2Zvcm0gc3RhdGUgYmVmb3JlIHByaW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBvcHRpb25zLmFjdGlvblRyYW5zZm9ybWVyIC0gdHJhbnNmb3JtIGFjdGlvbiBiZWZvcmUgcHJpbnRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IG9wdGlvbnMuZXJyb3JUcmFuc2Zvcm1lciAtIHRyYW5zZm9ybSBlcnJvciBiZWZvcmUgcHJpbnRcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVMb2dnZXIoKSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG4gIHZhciBfb3B0aW9ucyRsZXZlbCA9IG9wdGlvbnMubGV2ZWw7XG4gIHZhciBsZXZlbCA9IF9vcHRpb25zJGxldmVsID09PSB1bmRlZmluZWQgPyBcImxvZ1wiIDogX29wdGlvbnMkbGV2ZWw7XG4gIHZhciBfb3B0aW9ucyRsb2dnZXIgPSBvcHRpb25zLmxvZ2dlcjtcbiAgdmFyIGxvZ2dlciA9IF9vcHRpb25zJGxvZ2dlciA9PT0gdW5kZWZpbmVkID8gY29uc29sZSA6IF9vcHRpb25zJGxvZ2dlcjtcbiAgdmFyIF9vcHRpb25zJGxvZ0Vycm9ycyA9IG9wdGlvbnMubG9nRXJyb3JzO1xuICB2YXIgbG9nRXJyb3JzID0gX29wdGlvbnMkbG9nRXJyb3JzID09PSB1bmRlZmluZWQgPyB0cnVlIDogX29wdGlvbnMkbG9nRXJyb3JzO1xuICB2YXIgY29sbGFwc2VkID0gb3B0aW9ucy5jb2xsYXBzZWQ7XG4gIHZhciBwcmVkaWNhdGUgPSBvcHRpb25zLnByZWRpY2F0ZTtcbiAgdmFyIF9vcHRpb25zJGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgdmFyIGR1cmF0aW9uID0gX29wdGlvbnMkZHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX29wdGlvbnMkZHVyYXRpb247XG4gIHZhciBfb3B0aW9ucyR0aW1lc3RhbXAgPSBvcHRpb25zLnRpbWVzdGFtcDtcbiAgdmFyIHRpbWVzdGFtcCA9IF9vcHRpb25zJHRpbWVzdGFtcCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9vcHRpb25zJHRpbWVzdGFtcDtcbiAgdmFyIHRyYW5zZm9ybWVyID0gb3B0aW9ucy50cmFuc2Zvcm1lcjtcbiAgdmFyIF9vcHRpb25zJHN0YXRlVHJhbnNmbyA9IG9wdGlvbnMuc3RhdGVUcmFuc2Zvcm1lcjtcbiAgdmFyIC8vIGRlcHJlY2F0ZWRcbiAgc3RhdGVUcmFuc2Zvcm1lciA9IF9vcHRpb25zJHN0YXRlVHJhbnNmbyA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9IDogX29wdGlvbnMkc3RhdGVUcmFuc2ZvO1xuICB2YXIgX29wdGlvbnMkYWN0aW9uVHJhbnNmID0gb3B0aW9ucy5hY3Rpb25UcmFuc2Zvcm1lcjtcbiAgdmFyIGFjdGlvblRyYW5zZm9ybWVyID0gX29wdGlvbnMkYWN0aW9uVHJhbnNmID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoYWN0bikge1xuICAgIHJldHVybiBhY3RuO1xuICB9IDogX29wdGlvbnMkYWN0aW9uVHJhbnNmO1xuICB2YXIgX29wdGlvbnMkZXJyb3JUcmFuc2ZvID0gb3B0aW9ucy5lcnJvclRyYW5zZm9ybWVyO1xuICB2YXIgZXJyb3JUcmFuc2Zvcm1lciA9IF9vcHRpb25zJGVycm9yVHJhbnNmbyA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgcmV0dXJuIGVycm9yO1xuICB9IDogX29wdGlvbnMkZXJyb3JUcmFuc2ZvO1xuICB2YXIgX29wdGlvbnMkY29sb3JzID0gb3B0aW9ucy5jb2xvcnM7XG4gIHZhciBjb2xvcnMgPSBfb3B0aW9ucyRjb2xvcnMgPT09IHVuZGVmaW5lZCA/IHtcbiAgICB0aXRsZTogZnVuY3Rpb24gdGl0bGUoKSB7XG4gICAgICByZXR1cm4gXCIjMDAwMDAwXCI7XG4gICAgfSxcbiAgICBwcmV2U3RhdGU6IGZ1bmN0aW9uIHByZXZTdGF0ZSgpIHtcbiAgICAgIHJldHVybiBcIiM5RTlFOUVcIjtcbiAgICB9LFxuICAgIGFjdGlvbjogZnVuY3Rpb24gYWN0aW9uKCkge1xuICAgICAgcmV0dXJuIFwiIzAzQTlGNFwiO1xuICAgIH0sXG4gICAgbmV4dFN0YXRlOiBmdW5jdGlvbiBuZXh0U3RhdGUoKSB7XG4gICAgICByZXR1cm4gXCIjNENBRjUwXCI7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgICByZXR1cm4gXCIjRjIwNDA0XCI7XG4gICAgfVxuICB9IDogX29wdGlvbnMkY29sb3JzO1xuXG4gIC8vIGV4aXQgaWYgY29uc29sZSB1bmRlZmluZWRcblxuICBpZiAodHlwZW9mIGxvZ2dlciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gbmV4dChhY3Rpb24pO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHRyYW5zZm9ybWVyKSB7XG4gICAgY29uc29sZS5lcnJvcihcIk9wdGlvbiAndHJhbnNmb3JtZXInIGlzIGRlcHJlY2F0ZWQsIHVzZSBzdGF0ZVRyYW5zZm9ybWVyIGluc3RlYWRcIik7XG4gIH1cblxuICB2YXIgbG9nQnVmZmVyID0gW107XG4gIGZ1bmN0aW9uIHByaW50QnVmZmVyKCkge1xuICAgIGxvZ0J1ZmZlci5mb3JFYWNoKGZ1bmN0aW9uIChsb2dFbnRyeSwga2V5KSB7XG4gICAgICB2YXIgc3RhcnRlZCA9IGxvZ0VudHJ5LnN0YXJ0ZWQ7XG4gICAgICB2YXIgc3RhcnRlZFRpbWUgPSBsb2dFbnRyeS5zdGFydGVkVGltZTtcbiAgICAgIHZhciBhY3Rpb24gPSBsb2dFbnRyeS5hY3Rpb247XG4gICAgICB2YXIgcHJldlN0YXRlID0gbG9nRW50cnkucHJldlN0YXRlO1xuICAgICAgdmFyIGVycm9yID0gbG9nRW50cnkuZXJyb3I7XG4gICAgICB2YXIgdG9vayA9IGxvZ0VudHJ5LnRvb2s7XG4gICAgICB2YXIgbmV4dFN0YXRlID0gbG9nRW50cnkubmV4dFN0YXRlO1xuXG4gICAgICB2YXIgbmV4dEVudHJ5ID0gbG9nQnVmZmVyW2tleSArIDFdO1xuICAgICAgaWYgKG5leHRFbnRyeSkge1xuICAgICAgICBuZXh0U3RhdGUgPSBuZXh0RW50cnkucHJldlN0YXRlO1xuICAgICAgICB0b29rID0gbmV4dEVudHJ5LnN0YXJ0ZWQgLSBzdGFydGVkO1xuICAgICAgfVxuICAgICAgLy8gbWVzc2FnZVxuICAgICAgdmFyIGZvcm1hdHRlZEFjdGlvbiA9IGFjdGlvblRyYW5zZm9ybWVyKGFjdGlvbik7XG4gICAgICB2YXIgaXNDb2xsYXBzZWQgPSB0eXBlb2YgY29sbGFwc2VkID09PSBcImZ1bmN0aW9uXCIgPyBjb2xsYXBzZWQoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgICAgfSwgYWN0aW9uKSA6IGNvbGxhcHNlZDtcblxuICAgICAgdmFyIGZvcm1hdHRlZFRpbWUgPSBmb3JtYXRUaW1lKHN0YXJ0ZWRUaW1lKTtcbiAgICAgIHZhciB0aXRsZUNTUyA9IGNvbG9ycy50aXRsZSA/IFwiY29sb3I6IFwiICsgY29sb3JzLnRpdGxlKGZvcm1hdHRlZEFjdGlvbikgKyBcIjtcIiA6IG51bGw7XG4gICAgICB2YXIgdGl0bGUgPSBcImFjdGlvbiBcIiArICh0aW1lc3RhbXAgPyBmb3JtYXR0ZWRUaW1lIDogXCJcIikgKyBcIiBcIiArIGZvcm1hdHRlZEFjdGlvbi50eXBlICsgXCIgXCIgKyAoZHVyYXRpb24gPyBcIihpbiBcIiArIHRvb2sudG9GaXhlZCgyKSArIFwiIG1zKVwiIDogXCJcIik7XG5cbiAgICAgIC8vIHJlbmRlclxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGlzQ29sbGFwc2VkKSB7XG4gICAgICAgICAgaWYgKGNvbG9ycy50aXRsZSkgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKFwiJWMgXCIgKyB0aXRsZSwgdGl0bGVDU1MpO2Vsc2UgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKHRpdGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoY29sb3JzLnRpdGxlKSBsb2dnZXIuZ3JvdXAoXCIlYyBcIiArIHRpdGxlLCB0aXRsZUNTUyk7ZWxzZSBsb2dnZXIuZ3JvdXAodGl0bGUpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ2dlci5sb2codGl0bGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29sb3JzLnByZXZTdGF0ZSkgbG9nZ2VyW2xldmVsXShcIiVjIHByZXYgc3RhdGVcIiwgXCJjb2xvcjogXCIgKyBjb2xvcnMucHJldlN0YXRlKHByZXZTdGF0ZSkgKyBcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgcHJldlN0YXRlKTtlbHNlIGxvZ2dlcltsZXZlbF0oXCJwcmV2IHN0YXRlXCIsIHByZXZTdGF0ZSk7XG5cbiAgICAgIGlmIChjb2xvcnMuYWN0aW9uKSBsb2dnZXJbbGV2ZWxdKFwiJWMgYWN0aW9uXCIsIFwiY29sb3I6IFwiICsgY29sb3JzLmFjdGlvbihmb3JtYXR0ZWRBY3Rpb24pICsgXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIGZvcm1hdHRlZEFjdGlvbik7ZWxzZSBsb2dnZXJbbGV2ZWxdKFwiYWN0aW9uXCIsIGZvcm1hdHRlZEFjdGlvbik7XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBpZiAoY29sb3JzLmVycm9yKSBsb2dnZXJbbGV2ZWxdKFwiJWMgZXJyb3JcIiwgXCJjb2xvcjogXCIgKyBjb2xvcnMuZXJyb3IoZXJyb3IsIHByZXZTdGF0ZSkgKyBcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgZXJyb3IpO2Vsc2UgbG9nZ2VyW2xldmVsXShcImVycm9yXCIsIGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbG9ycy5uZXh0U3RhdGUpIGxvZ2dlcltsZXZlbF0oXCIlYyBuZXh0IHN0YXRlXCIsIFwiY29sb3I6IFwiICsgY29sb3JzLm5leHRTdGF0ZShuZXh0U3RhdGUpICsgXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIG5leHRTdGF0ZSk7ZWxzZSBsb2dnZXJbbGV2ZWxdKFwibmV4dCBzdGF0ZVwiLCBuZXh0U3RhdGUpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBsb2dnZXIuZ3JvdXBFbmQoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nZ2VyLmxvZyhcIuKAlOKAlCBsb2cgZW5kIOKAlOKAlFwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsb2dCdWZmZXIubGVuZ3RoID0gMDtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBnZXRTdGF0ZSA9IF9yZWYuZ2V0U3RhdGU7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAvLyBleGl0IGVhcmx5IGlmIHByZWRpY2F0ZSBmdW5jdGlvbiByZXR1cm5zIGZhbHNlXG4gICAgICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSBcImZ1bmN0aW9uXCIgJiYgIXByZWRpY2F0ZShnZXRTdGF0ZSwgYWN0aW9uKSkge1xuICAgICAgICAgIHJldHVybiBuZXh0KGFjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9nRW50cnkgPSB7fTtcbiAgICAgICAgbG9nQnVmZmVyLnB1c2gobG9nRW50cnkpO1xuXG4gICAgICAgIGxvZ0VudHJ5LnN0YXJ0ZWQgPSB0aW1lci5ub3coKTtcbiAgICAgICAgbG9nRW50cnkuc3RhcnRlZFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBsb2dFbnRyeS5wcmV2U3RhdGUgPSBzdGF0ZVRyYW5zZm9ybWVyKGdldFN0YXRlKCkpO1xuICAgICAgICBsb2dFbnRyeS5hY3Rpb24gPSBhY3Rpb247XG5cbiAgICAgICAgdmFyIHJldHVybmVkVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChsb2dFcnJvcnMpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuZWRWYWx1ZSA9IG5leHQoYWN0aW9uKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2dFbnRyeS5lcnJvciA9IGVycm9yVHJhbnNmb3JtZXIoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybmVkVmFsdWUgPSBuZXh0KGFjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsb2dFbnRyeS50b29rID0gdGltZXIubm93KCkgLSBsb2dFbnRyeS5zdGFydGVkO1xuICAgICAgICBsb2dFbnRyeS5uZXh0U3RhdGUgPSBzdGF0ZVRyYW5zZm9ybWVyKGdldFN0YXRlKCkpO1xuXG4gICAgICAgIHByaW50QnVmZmVyKCk7XG5cbiAgICAgICAgaWYgKGxvZ0VudHJ5LmVycm9yKSB0aHJvdyBsb2dFbnRyeS5lcnJvcjtcbiAgICAgICAgcmV0dXJuIHJldHVybmVkVmFsdWU7XG4gICAgICB9O1xuICAgIH07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTG9nZ2VyOyJdfQ==

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

	function FileBackend(getFilesByParentID_url, getFilesBySiblingID_url, search_url, update_url, delete_url, limit, bulkActions, $folder, currentFolder) {
		_classCallCheck(this, FileBackend);

		_get(Object.getPrototypeOf(FileBackend.prototype), 'constructor', this).call(this);

		this.getFilesByParentID_url = getFilesByParentID_url;
		this.getFilesBySiblingID_url = getFilesBySiblingID_url;
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
		key: 'getFilesByParentID',
		value: function getFilesByParentID(id) {
			var _this = this;

			if (typeof id === 'undefined') {
				return;
			}

			this.page = 1;

			return this.request('POST', this.getFilesByParentID_url, { id: id, limit: this.limit }).then(function (json) {
				_this.emit('onFetchData', json);
			});
		}

		/**
   * @func getFilesBySiblingID
   * @param number id - the id of the file to get the siblings from.
   * @desc Fetches a collection of sibling files given an id.
   */
	}, {
		key: 'getFilesBySiblingID',
		value: function getFilesBySiblingID(id) {
			var _this2 = this;

			if (typeof id === 'undefined') {
				return;
			}

			this.page = 1;

			return this.request('POST', this.getFilesBySiblingID_url, { id: id, limit: this.limit }).then(function (json) {
				_this2.emit('onFetchData', json);
			});
		}
	}, {
		key: 'search',
		value: function search() {
			var _this3 = this;

			this.page = 1;

			return this.request('GET', this.search_url).then(function (json) {
				_this3.emit('onSearchData', json);
			});
		}
	}, {
		key: 'more',
		value: function more() {
			var _this4 = this;

			this.page++;

			return this.request('GET', this.search_url).then(function (json) {
				_this4.emit('onMoreData', json);
			});
		}
	}, {
		key: 'navigate',
		value: function navigate(folder) {
			var _this5 = this;

			this.page = 1;
			this.folder = folder;

			this.persistFolderFilter(folder);

			return this.request('GET', this.search_url).then(function (json) {
				_this5.emit('onNavigateData', json);
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

		/**
   * Deletes files on the server based on the given ids
   *
   * @param array ids - an array of file ids to delete on the server
   * @returns object - promise
   */
	}, {
		key: 'delete',
		value: function _delete(ids) {
			var _this6 = this;

			return this.request('DELETE', this.delete_url, {
				'ids': ids
			}).then(function () {
				_this6.emit('onDeleteData', ids);
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
			var _this7 = this;

			var updates = { id: id };

			values.forEach(function (field) {
				updates[field.name] = field.value;
			});

			return this.request('POST', this.update_url, updates).then(function () {
				_this7.emit('onSaveData', id, updates);
			});
		}
	}, {
		key: 'request',
		value: function request(method, url) {
			var _this8 = this;

			var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			var defaults = {
				'limit': this.limit,
				'page': this.page
			};

			if (this.name && this.name.trim() !== '') {
				defaults.name = decodeURIComponent(this.name);
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
				_this8.hideLoadingIndicator();
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

},{"events":19,"jQuery":"jQuery"}],2:[function(require,module,exports){
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

var _stateGalleryActions = require('../state/gallery/actions');

var _sectionsAssetAdminController = require('../sections/asset-admin/controller');

var _sectionsAssetAdminController2 = _interopRequireDefault(_sectionsAssetAdminController);

var _sectionsGalleryController = require('../sections/gallery/controller');

var _sectionsGalleryController2 = _interopRequireDefault(_sectionsGalleryController);

var _sectionsEditorController = require('../sections/editor/controller');

var _sectionsEditorController2 = _interopRequireDefault(_sectionsEditorController);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function getGalleryProps() {
	var $componentWrapper = (0, _jQuery2['default'])('.asset-gallery').find('.asset-gallery-component-wrapper'),
	    initialFolder = $componentWrapper.data('asset-gallery-initial-folder'),
	    currentFolder = initialFolder;

	return {
		current_folder: currentFolder,
		initial_folder: initialFolder,
		name: (0, _jQuery2['default'])('.asset-gallery').data('asset-gallery-name')
	};
}

_jQuery2['default'].entwine('ss', function ($) {
	$('.asset-gallery-component-wrapper').entwine({
		onadd: function onadd() {
			var store = (0, _stateConfigureStore2['default'])();
			var galleryProps = getGalleryProps();

			_reactDom2['default'].render(_react2['default'].createElement(
				_reactRedux.Provider,
				{ store: store },
				_react2['default'].createElement(
					_sectionsAssetAdminController2['default'],
					{ initialFolder: this.data('asset-gallery-initial-folder'), idFromURL: this.data('asset-gallery-id-from-url') },
					_react2['default'].createElement(_sectionsGalleryController2['default'], galleryProps),
					_react2['default'].createElement(_sectionsEditorController2['default'], null)
				)
			), this[0]);

			// Catch any routes that aren't handled by components.
			window.ss.router('*', function () {});
		},
		onremove: function onremove() {
			_reactDom2['default'].unmountComponentAtNode(this[0]);
		}
	});
});

},{"../constants":7,"../sections/asset-admin/controller":8,"../sections/editor/controller":9,"../sections/gallery/controller":10,"../state/configureStore":11,"../state/gallery/actions":13,"jQuery":"jQuery","react":"react","react-dom":"react-dom","react-redux":"react-redux"}],3:[function(require,module,exports){
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
					'div',
					{ className: 'gallery__bulk-actions__counter' },
					this.getSelectedFiles().length
				),
				this.props.gallery.bulkActions.options.map(function (option, i) {
					return _react2['default'].createElement(
						'button',
						{ type: 'button', className: 'gallery__bulk-actions_action font-icon-trash ss-ui-button ui-corner-all', key: i, onClick: _this.onChangeValue, value: option.value },
						option.label
					);
				})
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

exports.BulkActionsComponent = BulkActionsComponent;
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

},{"../../state/gallery/actions":13,"i18n":"i18n","jQuery":"jQuery","react":"react","react-addons-test-utils":"react-addons-test-utils","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],4:[function(require,module,exports){
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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _dropzone = require('dropzone');

var _dropzone2 = _interopRequireDefault(_dropzone);

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

var _constantsJs = require('../../constants.js');

var _constantsJs2 = _interopRequireDefault(_constantsJs);

var DropzoneComponent = (function (_SilverStripeComponent) {
    _inherits(DropzoneComponent, _SilverStripeComponent);

    function DropzoneComponent(props) {
        _classCallCheck(this, DropzoneComponent);

        _get(Object.getPrototypeOf(DropzoneComponent.prototype), 'constructor', this).call(this, props);

        this.dropzone = null;
        this.dragging = false;
    }

    _createClass(DropzoneComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _get(Object.getPrototypeOf(DropzoneComponent.prototype), 'componentDidMount', this).call(this);

            var defaultOptions = this.getDefaultOptions();

            if (this.props.uploadButton === true) {
                defaultOptions.clickable = (0, _jQuery2['default'])(_reactDom2['default'].findDOMNode(this)).find('.dropzone-component__upload-button')[0];
            }

            this.dropzone = new _dropzone2['default'](_reactDom2['default'].findDOMNode(this), Object.assign({}, defaultOptions, this.props.options));

            // Set the user warning displayed when a user attempts to remove a file.
            // If the props hasn't been passed there will be no warning when removing files.
            if (typeof this.props.promptOnRemove !== 'undefined') {
                this.setPromptOnRemove(this.props.promptOnRemove);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _get(Object.getPrototypeOf(DropzoneComponent.prototype), 'componentWillUnmount', this).call(this);

            // Remove all dropzone event listeners.
            this.dropzone.disable();
        }
    }, {
        key: 'render',
        value: function render() {
            var className = ['dropzone-component'];

            if (this.dragging === true) {
                className.push('dragging');
            }

            return _react2['default'].createElement(
                'div',
                { className: className.join(' ') },
                this.props.uploadButton && _react2['default'].createElement(
                    'button',
                    { className: 'dropzone-component__upload-button [ ss-ui-button font-icon-upload ]', type: 'button' },
                    _i18n2['default']._t("AssetGalleryField.DROPZONE_UPLOAD")
                ),
                this.props.children
            );
        }

        /**
         * Gets the default optiions to instanciate dropzone with.
         *
         * @return object
         */
    }, {
        key: 'getDefaultOptions',
        value: function getDefaultOptions() {
            return {
                // We handle the queue processing ourself in the FileReader callback. See `this.handleAddedFile`
                autoProcessQueue: false,

                // By default Dropzone adds markup to the DOM for displaying a thumbnail preview.
                // Here we're relpacing that default behaviour with our own React / Redux implementation.
                addedfile: this.handleAddedFile.bind(this),

                // When the user drags a file into the dropzone.
                dragenter: this.handleDragEnter.bind(this),

                // When the user's cursor leaves the dropzone while dragging a file.
                dragleave: this.handleDragLeave.bind(this),

                // When the user drops a file onto the dropzone.
                drop: this.handleDrop.bind(this),

                // Whenever the file upload progress changes
                uploadprogress: this.handleUploadProgress.bind(this),

                // The text used before any files are dropped
                dictDefaultMessage: _i18n2['default']._t('AssetGalleryField.DROPZONE_DEFAULT_MESSAGE'),

                // The text that replaces the default message text it the browser is not supported
                dictFallbackMessage: _i18n2['default']._t('AssetGalleryField.DROPZONE_FALLBACK_MESSAGE'),

                // The text that will be added before the fallback form
                // If null, no text will be added at all.
                dictFallbackText: _i18n2['default']._t('AssetGalleryField.DROPZONE_FALLBACK_TEXT'),

                // If the file doesn't match the file type.
                dictInvalidFileType: _i18n2['default']._t('AssetGalleryField.DROPZONE_INVALID_FILE_TYPE'),

                // If the server response was invalid.
                dictResponseError: _i18n2['default']._t('AssetGalleryField.DROPZONE_RESPONSE_ERROR'),

                // If used, the text to be used for the cancel upload link.
                dictCancelUpload: _i18n2['default']._t('AssetGalleryField.DROPZONE_CANCEL_UPLOAD'),

                // If used, the text to be used for confirmation when cancelling upload.
                dictCancelUploadConfirmation: _i18n2['default']._t('AssetGalleryField.DROPZONE_CANCEL_UPLOAD_CONFIRMATION'),

                // If used, the text to be used to remove a file.
                dictRemoveFile: _i18n2['default']._t('AssetGalleryField.DROPZONE_REMOVE_FILE'),

                // Displayed when the maxFiles have been exceeded
                // You can use {{maxFiles}} here, which will be replaced by the option.
                dictMaxFilesExceeded: _i18n2['default']._t('AssetGalleryField.DROPZONE_MAX_FILES_EXCEEDED'),

                // When a file upload fails.
                error: this.handleError.bind(this),

                // When file file is sent to the server.
                sending: this.handleSending.bind(this),

                // When a file upload succeeds.
                success: this.handleSuccess.bind(this),

                thumbnailHeight: 150,

                thumbnailWidth: 200
            };
        }

        /**
         * Gets a file's category based on its type.
         *
         * @param string fileType - For example 'image/jpg'.
         *
         * @return string
         */
    }, {
        key: 'getFileCategory',
        value: function getFileCategory(fileType) {
            return fileType.split('/')[0];
        }

        /**
         * Event handler triggered when the user drags a file into the dropzone.
         *
         * @param object event
         */
    }, {
        key: 'handleDragEnter',
        value: function handleDragEnter(event) {
            this.dragging = true;
            this.forceUpdate();

            if (typeof this.props.handleDragEnter === 'function') {
                this.props.handleDragEnter(event);
            }
        }

        /**
         * Event handler triggered when a user's curser leaves the dropzone while dragging a file.
         *
         * @param object event
         */
    }, {
        key: 'handleDragLeave',
        value: function handleDragLeave(event) {
            var componentNode = _reactDom2['default'].findDOMNode(this);

            // Event propagation (events bubbling up from decendent elements) means the `dragLeave`
            // event gets triggered on the dropzone. Here we're ignoring events that don't originate from the dropzone node.
            if (event.target !== componentNode) {
                return;
            }

            this.dragging = false;
            this.forceUpdate();

            if (typeof this.props.handleDragLeave === 'function') {
                this.props.handleDragLeave(event, componentNode);
            }
        }

        /**
         * Event handler when a file's upload progress changes.
         *
         * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
         * @param integer progress - the upload progress percentage
         * @param integer bytesSent - total bytesSent
         */
    }, {
        key: 'handleUploadProgress',
        value: function handleUploadProgress(file, progress, bytesSent) {
            if (typeof this.props.handleUploadProgress === 'function') {
                this.props.handleUploadProgress(file, progress, bytesSent);
            }
        }

        /**
         * Event handler triggered when the user drops a file on the dropzone.
         *
         * @param object event
         */
    }, {
        key: 'handleDrop',
        value: function handleDrop(event) {
            this.dragging = false;
            this.forceUpdate();

            if (typeof this.props.handleDrop === 'function') {
                this.props.handleDrop(event);
            }
        }

        /**
         * Called just before the file is sent. Gets the `xhr` object as second parameter,
         * so you can modify it (for example to add a CSRF token) and a `formData` object to add additional information.
         *
         * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
         * @param object xhr
         * @param object formData - FormData interface. See https://developer.mozilla.org/en-US/docs/Web/API/FormData
         */
    }, {
        key: 'handleSending',
        value: function handleSending(file, xhr, formData) {
            formData.append('SecurityID', this.props.securityID);
            formData.append('folderID', this.props.folderID);

            if (typeof this.props.handleSending === 'function') {
                this.props.handleSending(file, xhr, formData);
            }
        }

        /**
         * Event handler for files being added. Called before the request is made to the server.
         *
         * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
         */
    }, {
        key: 'handleAddedFile',
        value: function handleAddedFile(file) {
            var reader = new FileReader();

            // The queuedAtTime is used to uniquely identify file while it's in the queue.
            var queuedAtTime = Date.now();

            reader.onload = (function (event) {
                // If the user uploads multiple large images, we could run into memory issues
                // by simply using the `event.target.result` data URI as the thumbnail image.
                //
                // To get avoid this we're creating a canvas, using the dropzone thumbnail dimensions,
                // and using the canvas data URI as the thumbnail image instead.

                var thumbnailURL = '';

                if (this.getFileCategory(file.type) === 'image') {
                    var img = document.createElement('img'),
                        canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');

                    img.src = event.target.result;

                    canvas.width = this.dropzone.options.thumbnailWidth;
                    canvas.height = this.dropzone.options.thumbnailHeight;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    thumbnailURL = canvas.toDataURL();
                }

                this.props.handleAddedFile({
                    attributes: {
                        dimensions: {
                            height: this.dropzone.options.thumbnailHeight,
                            width: this.dropzone.options.thumbnailWidth
                        }
                    },
                    category: this.getFileCategory(file.type),
                    filename: file.name,
                    queuedAtTime: queuedAtTime,
                    size: file.size,
                    title: file.name,
                    type: file.type,
                    url: thumbnailURL
                });

                this.dropzone.processFile(file);
            }).bind(this);

            file._queuedAtTime = queuedAtTime;

            reader.readAsDataURL(file);
        }

        /**
         * Event handler for failed uploads.
         *
         * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
         * @param string errorMessage
         */
    }, {
        key: 'handleError',
        value: function handleError(file, errorMessage) {
            if (typeof this.props.handleSending === 'function') {
                this.props.handleError(file, errorMessage);
            }
        }

        /**
         * Event handler for successfully upload files.
         *
         * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
         */
    }, {
        key: 'handleSuccess',
        value: function handleSuccess(file) {
            this.props.handleSuccess(file);
        }

        /**
         * Set the text displayed when a user tries to remove a file.
         *
         * @param string userPrompt - The message to display.
         */
    }, {
        key: 'setPromptOnRemove',
        value: function setPromptOnRemove(userPrompt) {
            this.dropzone.options.dictRemoveFileConfirmation = userPrompt;
        }
    }]);

    return DropzoneComponent;
})(_silverstripeComponent2['default']);

DropzoneComponent.propTypes = {
    folderID: _react2['default'].PropTypes.number.isRequired,
    handleAddedFile: _react2['default'].PropTypes.func.isRequired,
    handleDragEnter: _react2['default'].PropTypes.func,
    handleDragLeave: _react2['default'].PropTypes.func,
    handleDrop: _react2['default'].PropTypes.func,
    handleError: _react2['default'].PropTypes.func.isRequired,
    handleSending: _react2['default'].PropTypes.func,
    handleSuccess: _react2['default'].PropTypes.func.isRequired,
    options: _react2['default'].PropTypes.shape({
        url: _react2['default'].PropTypes.string.isRequired
    }),
    promptOnRemove: _react2['default'].PropTypes.string,
    securityID: _react2['default'].PropTypes.string.isRequired,
    uploadButton: _react2['default'].PropTypes.bool
};

DropzoneComponent.defaultProps = {
    uploadButton: true
};

exports['default'] = DropzoneComponent;
module.exports = exports['default'];

},{"../../constants.js":7,"dropzone":20,"i18n":"i18n","jQuery":"jQuery","react":"react","react-dom":"react-dom","silverstripe-component":"silverstripe-component"}],5:[function(require,module,exports){
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

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _constants = require('../../constants');

var _constants2 = _interopRequireDefault(_constants);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var FileComponent = (function (_SilverStripeComponent) {
	_inherits(FileComponent, _SilverStripeComponent);

	function FileComponent(props) {
		_classCallCheck(this, FileComponent);

		_get(Object.getPrototypeOf(FileComponent.prototype), 'constructor', this).call(this, props);

		this.handleToggleSelect = this.handleToggleSelect.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleActivate = this.handleActivate.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleCancelUpload = this.handleCancelUpload.bind(this);
		this.preventFocus = this.preventFocus.bind(this);
	}

	/**
  * Wrapper around this.props.handleActivate
  *
  * @param object event - Event object.
  */

	_createClass(FileComponent, [{
		key: 'handleActivate',
		value: function handleActivate(event) {
			event.stopPropagation();
			this.props.handleActivate(event, this.props.item);
		}

		/**
   * Wrapper around this.props.handleToggleSelect
   *
   * @param object event - Event object.
   */
	}, {
		key: 'handleToggleSelect',
		value: function handleToggleSelect(event) {
			event.stopPropagation();
			this.props.handleToggleSelect(event, this.props.item);
		}

		/**
   * Wrapper around this.props.handleDelete
   *
   * @param object event - Event object.
   */
	}, {
		key: 'handleDelete',
		value: function handleDelete(event) {
			this.props.handleDelete(event, this.props.item);
		}
	}, {
		key: 'getThumbnailStyles',
		value: function getThumbnailStyles() {
			if (this.props.item.category === 'image') {
				return { 'backgroundImage': 'url(' + this.props.item.url + ')' };
			}

			return {};
		}

		/**
   * Checks if the component has an error set.
   *
   * @return boolean
   */
	}, {
		key: 'hasError',
		value: function hasError() {
			var hasError = false;

			if (Array.isArray(this.props.messages)) {
				hasError = this.props.messages.filter(function (message) {
					return message.type === 'error';
				}).length > 0;
			}

			return hasError;
		}

		/**
   * Returns markup for an error message if one is set.
   */
	}, {
		key: 'getErrorMessage',
		value: function getErrorMessage() {
			if (this.hasError()) {
				return _react2['default'].createElement(
					'span',
					{ className: 'item__error-message' },
					this.props.messages[0].value
				);
			}

			return null;
		}
	}, {
		key: 'getThumbnailClassNames',
		value: function getThumbnailClassNames() {
			var thumbnailClassNames = ['item__thumbnail'];

			if (this.isImageSmallerThanThumbnail()) {
				thumbnailClassNames.push('item__thumbnail--small');
			}

			return thumbnailClassNames.join(' ');
		}
	}, {
		key: 'getItemClassNames',
		value: function getItemClassNames() {
			var itemClassNames = ['item item--' + this.props.item.category];

			if (this.props.selected) {
				itemClassNames.push('item--selected');
			}

			if (this.hasError()) {
				itemClassNames.push('item--error');
			}

			return itemClassNames.join(' ');
		}
	}, {
		key: 'isImageSmallerThanThumbnail',
		value: function isImageSmallerThanThumbnail() {
			var dimensions = this.props.item.attributes.dimensions;

			return dimensions.height < _constants2['default'].THUMBNAIL_HEIGHT && dimensions.width < _constants2['default'].THUMBNAIL_WIDTH;
		}
	}, {
		key: 'handleKeyDown',
		value: function handleKeyDown(event) {
			event.stopPropagation();
			event.preventDefault(); //Stop page scrolling if spaceKey is pressed

			//If space is pressed, select file
			if (this.props.spaceKey === event.keyCode) {
				this.handleToggleSelect(event);
			}

			//If return is pressed, navigate folder
			if (this.props.returnKey === event.keyCode) {
				this.handleActivate(event, this.props.item);
			}
		}

		/**
   * Avoids the browser's default focus state when selecting an item.
   *
   * @param object event - Event object.
   */
	}, {
		key: 'preventFocus',
		value: function preventFocus(event) {
			event.preventDefault();
		}
	}, {
		key: 'handleCancelUpload',
		value: function handleCancelUpload(event) {
			event.stopPropagation();

			if (this.hasError()) {
				this.props.handleRemoveErroredUpload(this.props.item);
			} else {
				this.props.handleCancelUpload(this.props.item);
			}
		}
	}, {
		key: 'getProgressBar',
		value: function getProgressBar() {
			var progressBar;

			var progressBarProps = {
				className: 'item__upload-progress__bar',
				style: {
					width: this.props.item.progress + '%'
				}
			};

			if (!this.hasError() && this.props.uploading) {
				progressBar = _react2['default'].createElement(
					'div',
					{ className: 'item__upload-progress' },
					_react2['default'].createElement('div', progressBarProps)
				);
			}

			return progressBar;
		}
	}, {
		key: 'render',
		value: function render() {
			var actionButton;

			if (this.props.uploading) {
				actionButton = _react2['default'].createElement('button', {
					className: 'item__actions__action item__actions__action--cancel [ font-icon-cancel ]',
					type: 'button',
					title: _i18n2['default']._t('AssetGalleryField.SELECT'),
					tabIndex: '-1',
					onMouseDown: this.preventFocus,
					onClick: this.handleCancelUpload,
					'data-dz-remove': true });
			} else {
				actionButton = _react2['default'].createElement('button', {
					className: 'item__actions__action item__actions__action--select [ font-icon-tick ]',
					type: 'button',
					title: _i18n2['default']._t('AssetGalleryField.SELECT'),
					tabIndex: '-1',
					onMouseDown: this.preventFocus,
					onClick: this.handleToggleSelect });
			}

			return _react2['default'].createElement(
				'div',
				{
					className: this.getItemClassNames(),
					'data-id': this.props.item.id,
					tabIndex: '0',
					onKeyDown: this.handleKeyDown,
					onClick: this.handleActivate },
				_react2['default'].createElement(
					'div',
					{ ref: 'thumbnail', className: this.getThumbnailClassNames(), style: this.getThumbnailStyles() },
					_react2['default'].createElement(
						'div',
						{ className: 'item--overlay [ font-icon-edit ]' },
						'View'
					)
				),
				this.getProgressBar(),
				this.getErrorMessage(),
				_react2['default'].createElement(
					'div',
					{ className: 'item__title', ref: 'title' },
					this.props.item.title,
					actionButton
				)
			);
		}
	}]);

	return FileComponent;
})(_silverstripeComponent2['default']);

FileComponent.propTypes = {
	item: _react2['default'].PropTypes.shape({
		attributes: _react2['default'].PropTypes.shape({
			dimensions: _react2['default'].PropTypes.object.isRequired
		}),
		category: _react2['default'].PropTypes.string.isRequired,
		id: _react2['default'].PropTypes.number.isRequired,
		url: _react2['default'].PropTypes.string,
		title: _react2['default'].PropTypes.string.isRequired,
		progress: _react2['default'].PropTypes.number
	}),
	selected: _react2['default'].PropTypes.bool.isRequired,
	spaceKey: _react2['default'].PropTypes.number,
	returnKey: _react2['default'].PropTypes.number,
	handleActivate: _react2['default'].PropTypes.func.isRequired,
	handleToggleSelect: _react2['default'].PropTypes.func.isRequired,
	handleDelete: _react2['default'].PropTypes.func.isRequired,
	messages: _react2['default'].PropTypes.array,
	uploading: _react2['default'].PropTypes.bool
};

FileComponent.defaultProps = {
	returnKey: 13,
	spaceKey: 32
};

exports['default'] = FileComponent;
module.exports = exports['default'];

},{"../../constants":7,"i18n":"i18n","jQuery":"jQuery","react":"react","silverstripe-component":"silverstripe-component"}],6:[function(require,module,exports){
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
				{ className: 'form-group' },
				this.props.label && _react2['default'].createElement(
					'label',
					{ htmlFor: 'gallery_' + this.props.name },
					this.props.label
				),
				_react2['default'].createElement('input', this.getInputProps())
			);
		}
	}, {
		key: 'getInputProps',
		value: function getInputProps() {
			return {
				className: ['form-control', this.props.extraClass].join(' '),
				id: 'gallery_' + this.props.name,
				name: this.props.name,
				onChange: this.props.onChange,
				type: 'text',
				value: this.props.value
			};
		}
	}, {
		key: 'handleChange',
		value: function handleChange(event) {
			if (typeof this.props.onChange === 'undefined') {
				return;
			}

			this.props.onChange();
		}
	}]);

	return TextFieldComponent;
})(_silverstripeComponent2['default']);

TextFieldComponent.propTypes = {
	label: _react2['default'].PropTypes.string,
	extraClass: _react2['default'].PropTypes.string,
	name: _react2['default'].PropTypes.string.isRequired,
	onChange: _react2['default'].PropTypes.func,
	value: _react2['default'].PropTypes.string
};

exports['default'] = TextFieldComponent;
module.exports = exports['default'];

},{"react":"react","silverstripe-component":"silverstripe-component"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

exports['default'] = {
	'CSS_TRANSITION_TIME': 300,
	'THUMBNAIL_HEIGHT': 150,
	'THUMBNAIL_WIDTH': 200,
	'BULK_ACTIONS': [{
		value: 'delete',
		label: _i18n2['default']._t('AssetGalleryField.BULK_ACTIONS_DELETE'),
		destructive: true
	}],
	'BULK_ACTIONS_PLACEHOLDER': _i18n2['default']._t('AssetGalleryField.BULK_ACTIONS_PLACEHOLDER'),
	'HOME_ROUTE': '/assets', // Hardcoded here until we have a config manager
	'EDITING_ROUTE': '/assets/EditForm/field/Files/item/:id/edit', // Hardcoded here until we have a config manager
	'FOLDER_ROUTE': '/assets/show/:id?' // Hardcoded here until we have a config manager
};
module.exports = exports['default'];

},{"i18n":"i18n"}],8:[function(require,module,exports){
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

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var _stateGalleryActions = require('../../state/gallery/actions');

var galleryActions = _interopRequireWildcard(_stateGalleryActions);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _backendFileBackend = require('../../backend/file-backend');

var _backendFileBackend2 = _interopRequireDefault(_backendFileBackend);

var _constants = require('../../constants');

var _constants2 = _interopRequireDefault(_constants);

var AssetAdminContainer = (function (_SilverStripeComponent) {
    _inherits(AssetAdminContainer, _SilverStripeComponent);

    function AssetAdminContainer(props) {
        _classCallCheck(this, AssetAdminContainer);

        _get(Object.getPrototypeOf(AssetAdminContainer.prototype), 'constructor', this).call(this, props);

        var $componentWrapper = (0, _jQuery2['default'])('.asset-gallery').find('.asset-gallery-component-wrapper'),
            $search = (0, _jQuery2['default'])('.cms-search-form');

        if ($search.find('[type=hidden][name="q[Folder]"]').length === 0) {
            $search.append('<input type="hidden" name="q[Folder]" />');
        }

        this.backend = new _backendFileBackend2['default']($componentWrapper.data('asset-gallery-files-by-parent-url'), $componentWrapper.data('asset-gallery-files-by-sibling-url'), $componentWrapper.data('asset-gallery-search-url'), $componentWrapper.data('asset-gallery-update-url'), $componentWrapper.data('asset-gallery-delete-url'), $componentWrapper.data('asset-gallery-limit'), $componentWrapper.data('asset-gallery-bulk-actions'), $search.find('[type=hidden][name="q[Folder]"]'), $componentWrapper.data('asset-gallery-initial-folder') || '');

        this.handleBackendFetch = this.handleBackendFetch.bind(this);
        this.handleBackendSave = this.handleBackendSave.bind(this);
        this.handleBackendDelete = this.handleBackendDelete.bind(this);
        this.handleBackendNavigate = this.handleBackendNavigate.bind(this);
        this.handleBackendMore = this.handleBackendMore.bind(this);
        this.handleBackendSearch = this.handleBackendSearch.bind(this);
    }

    _createClass(AssetAdminContainer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this = this;

            _get(Object.getPrototypeOf(AssetAdminContainer.prototype), 'componentDidMount', this).call(this);

            var fetchMethod = 'getFilesByParentID';

            if (this.props.idFromURL && this.props.idFromURL !== this.props.initialFolder) {
                // If the url is to edit a specific file.
                // Doing this because the gallery view and the edit view are handled
                // by separate SilverStripe controllers.
                // When the AssetGalleryField becomes the entire section we can handle this differently
                fetchMethod = 'getFilesBySiblingID';
            }

            this.backend[fetchMethod](this.props.idFromURL).done((function (data, status, xhr) {
                // Handle the initial payload from the FileBackend.
                // This handler will be called after this.handleBackendFetch

                var route = new window.ss.router.Route(_constants2['default'].EDITING_ROUTE);
                var currentPath = window.ss.router.current;
                var files = _this.props.assetAdmin.gallery.files;

                var params = {};

                // If we're on a file edit route we need to set the file currently being edited.
                if (route.match(currentPath, params)) {
                    _this.props.actions.setEditing(files.filter(function (file) {
                        return file.id === parseInt(params.id, 10);
                    })[0]);
                }

                _this.props.actions.setPath(currentPath);
            }).bind(this));

            this.backend.addListener('onFetchData', this.handleBackendFetch);
            this.backend.addListener('onSaveData', this.handleBackendSave);
            this.backend.addListener('onDeleteData', this.handleBackendDelete);
            this.backend.addListener('onNavigateData', this.handleBackendNavigate);
            this.backend.addListener('onMoreData', this.handleBackendMore);
            this.backend.addListener('onSearchData', this.handleBackendSearch);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _get(Object.getPrototypeOf(AssetAdminContainer.prototype), 'componentWillUnmount', this).call(this);

            this.backend.removeListener('onFetchData', this.handleBackendFetch);
            this.backend.removeListener('onSaveData', this.handleBackendSave);
            this.backend.removeListener('onDeleteData', this.handleBackendDelete);
            this.backend.removeListener('onNavigateData', this.handleBackendNavigate);
            this.backend.removeListener('onMoreData', this.handleBackendMore);
            this.backend.removeListener('onSearchData', this.handleBackendSearch);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            // Give each child component access to the FileBackend.
            var children = _react2['default'].Children.map(this.props.children, function (child) {
                return _react2['default'].cloneElement(child, { backend: _this2.backend });
            });

            return _react2['default'].createElement(
                'div',
                { className: 'gallery' },
                children
            );
        }
    }, {
        key: 'handleEnterRoute',
        value: function handleEnterRoute(ctx, next) {
            this.props.actions.setPath(ctx.path);
            next();
        }
    }, {
        key: 'handleExitRoute',
        value: function handleExitRoute(ctx, next) {
            this.props.actions.setPath(null);
            next();
        }
    }, {
        key: 'handleBackendFetch',
        value: function handleBackendFetch(data) {
            this.props.actions.setFolderId(parseInt(data.folderID, 10));
            this.props.actions.setParentFolderId(data.parent);
            this.props.actions.addFiles(data.files, data.count);
        }
    }, {
        key: 'handleBackendSave',
        value: function handleBackendSave(id, values) {
            window.ss.router.show(_constants2['default'].HOME_ROUTE);
            this.props.actions.setEditing(null);
            this.props.actions.updateFile(id, { title: values.title, basename: values.basename });
        }
    }, {
        key: 'handleBackendDelete',
        value: function handleBackendDelete(data) {
            this.props.actions.deselectFiles(data);
            this.props.actions.removeFiles(data);
        }
    }, {
        key: 'handleBackendNavigate',
        value: function handleBackendNavigate(data) {
            this.props.actions.removeFiles();
            this.props.actions.addFiles(data.files, data.count);
        }
    }, {
        key: 'handleBackendMore',
        value: function handleBackendMore(data) {
            this.props.actions.addFiles(this.props.assetAdmin.gallery.files.concat(data.files), data.count);
        }
    }, {
        key: 'handleBackendSearch',
        value: function handleBackendSearch(data) {
            this.props.actions.addFiles(data.files, data.count);
        }
    }]);

    return AssetAdminContainer;
})(_silverstripeComponent2['default']);

function mapStateToProps(state) {
    return {
        assetAdmin: state.assetAdmin
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)(galleryActions, dispatch)
    };
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(AssetAdminContainer);
module.exports = exports['default'];

},{"../../backend/file-backend":1,"../../constants":7,"../../state/gallery/actions":13,"jQuery":"jQuery","react":"react","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],9:[function(require,module,exports){
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

var _constants = require('../../constants');

var _constants2 = _interopRequireDefault(_constants);

var _componentsFormAction = require('components/form-action');

var _componentsFormAction2 = _interopRequireDefault(_componentsFormAction);

var EditorContainer = (function (_SilverStripeComponent) {
	_inherits(EditorContainer, _SilverStripeComponent);

	function EditorContainer(props) {
		_classCallCheck(this, EditorContainer);

		_get(Object.getPrototypeOf(EditorContainer.prototype), 'constructor', this).call(this, props);

		var file = this.props.file;

		this.fields = [{
			'label': 'Title',
			'name': 'title',
			'value': file === null ? file : file.title
		}, {
			'label': 'Filename',
			'name': 'basename',
			'value': file === null ? file : file.basename
		}];

		this.onFieldChange = this.onFieldChange.bind(this);
		this.onFileSave = this.onFileSave.bind(this);
		this.onFilePublish = this.onFilePublish.bind(this);
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
			this.props.onFileSave(this.props.file.id, this.props.editorFields);

			event.stopPropagation();
			event.preventDefault();
		}
	}, {
		key: 'onFilePublish',
		value: function onFilePublish(event) {
			// Publish
		}
	}, {
		key: 'onCancel',
		value: function onCancel(event) {
			this.props.actions.setEditing(null);
			window.ss.router.show(_constants2['default'].HOME_ROUTE);
		}
	}, {
		key: 'handleEnterRoute',
		value: function handleEnterRoute(ctx, next) {
			// If there is no file to edit set the editing file
			// by matching a file id against the id in the URL.
			if (this.props.file === null) {
				this.props.actions.setEditing(this.props.files.filter(function (file) {
					return file.id === parseInt(ctx.params.id, 10);
				})[0]);
			}
		}
	}, {
		key: 'handleExitRoute',
		value: function handleExitRoute(ctx, next) {
			this.props.actions.setEditing(null);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			if (this.props.file === null || typeof this.props.file === 'undefined') {
				return null;
			}

			return _react2['default'].createElement(
				'div',
				{ className: 'editor-component' },
				_react2['default'].createElement('a', {
					className: 'font-icon-cancel no-text btn btn--close',
					onClick: this.onCancel
				}),
				_react2['default'].createElement(
					'div',
					{ className: 'file-details' },
					_react2['default'].createElement(
						'h2',
						{ className: '' },
						this.props.file.title
					),
					_react2['default'].createElement(
						'p',
						{ className: 'header-extra' },
						_react2['default'].createElement(
							'small',
							null,
							this.props.file.attributes.dimensions.width,
							' x ',
							this.props.file.attributes.dimensions.height,
							'px, ',
							this.props.file.size
						)
					),
					_react2['default'].createElement(
						'div',
						{ className: 'file-preview' },
						_react2['default'].createElement('img', { className: 'file-preview-thumbnail', src: this.props.file.url }),
						_react2['default'].createElement('a', { href: this.props.file.url, target: '_blank', className: 'file-enlarge font-icon-search no-text' })
					),
					_react2['default'].createElement(
						'ul',
						{ className: 'nav nav-tabs', role: 'tablist' },
						_react2['default'].createElement(
							'li',
							{ className: 'nav-item' },
							_react2['default'].createElement(
								'a',
								{ className: 'nav-link active', 'data-toggle': 'tab', href: '#details', role: 'tab' },
								'Details'
							)
						),
						_react2['default'].createElement(
							'li',
							{ className: 'nav-item' },
							_react2['default'].createElement(
								'a',
								{ className: 'nav-link', 'data-toggle': 'tab', href: '#usage', role: 'tab' },
								'Usage'
							)
						)
					),
					_react2['default'].createElement(
						'div',
						{ className: 'tab-content' },
						_react2['default'].createElement(
							'div',
							{ className: 'tab-pane active', id: 'details', role: 'tabpanel' },
							this.props.editorFields.map(function (field, i) {
								return _react2['default'].createElement(_componentsTextFieldIndex2['default'], {
									key: i,
									label: field.label,
									name: field.name,
									value: _this.props.file[field.name],
									onChange: _this.onFieldChange });
							}),
							_react2['default'].createElement(
								'div',
								{ className: 'form-group' },
								_react2['default'].createElement(
									'label',
									{ 'for': 'folderLocation' },
									'Folder location'
								),
								_react2['default'].createElement('input', { type: 'text', className: 'form-control', id: 'folderLocation', placeholder: 'uploads/folder name/' })
							),
							_react2['default'].createElement(
								'div',
								{ className: 'media form-group break-string' },
								_react2['default'].createElement(
									'div',
									{ className: 'media-left' },
									_react2['default'].createElement('i', { className: 'font-icon-link' })
								),
								_react2['default'].createElement(
									'div',
									{ className: 'media-body' },
									_react2['default'].createElement(
										'a',
										{ href: this.props.file.url, target: '_blank' },
										this.props.file.url
									)
								)
							),
							_react2['default'].createElement(
								'div',
								{ className: 'btn-toolbar' },
								_react2['default'].createElement(
									'div',
									{ className: 'btn-group', role: 'group', 'aria-label': '' },
									_react2['default'].createElement(_componentsFormAction2['default'], {
										type: 'submit',
										icon: 'save',
										style: 'success',
										handleClick: this.onFileSave,
										label: _i18n2['default']._t('AssetGalleryField.SAVE')
									}),
									_react2['default'].createElement(_componentsFormAction2['default'], {
										type: 'submit',
										icon: 'rocket',
										style: 'success',
										handleClick: this.onFilePublish,
										label: 'Publish'
									})
								),
								_react2['default'].createElement(
									'button',
									{ type: 'button', 'data-container': 'body', className: 'btn btn-link no-text', 'data-toggle': 'popover', title: 'Page actions', 'data-placement': 'top', 'data-content': '<a href=\'\'>Add to campaign</a><a href=\'\'>Remove from campaign</a>' },
									_react2['default'].createElement('i', { className: 'dot-3' })
								)
							)
						),
						_react2['default'].createElement(
							'div',
							{ className: 'tab-pane', id: 'usage', role: 'tabpanel' },
							_react2['default'].createElement(
								'table',
								{ className: 'table table-sm' },
								_react2['default'].createElement(
									'tbody',
									null,
									_react2['default'].createElement(
										'tr',
										null,
										_react2['default'].createElement(
											'td',
											{ scope: 'row' },
											_i18n2['default']._t('AssetGalleryField.CREATED'),
											' '
										),
										_react2['default'].createElement(
											'td',
											null,
											this.props.file.created,
											' by ',
											_react2['default'].createElement(
												'a',
												{ href: '' },
												'Michael'
											)
										)
									),
									_react2['default'].createElement(
										'tr',
										null,
										_react2['default'].createElement(
											'td',
											{ scope: 'row' },
											_i18n2['default']._t('AssetGalleryField.LASTEDIT'),
											' '
										),
										_react2['default'].createElement(
											'td',
											null,
											this.props.file.lastUpdated,
											' by ',
											_react2['default'].createElement(
												'a',
												{ href: '' },
												'Jack'
											)
										)
									)
								)
							),
							_react2['default'].createElement(
								'table',
								{ className: 'table' },
								_react2['default'].createElement(
									'thead',
									null,
									_react2['default'].createElement(
										'tr',
										null,
										_react2['default'].createElement(
											'th',
											null,
											'#'
										),
										_react2['default'].createElement(
											'th',
											null,
											'Used on'
										),
										_react2['default'].createElement(
											'th',
											null,
											'State'
										)
									)
								),
								_react2['default'].createElement(
									'tbody',
									null,
									_react2['default'].createElement(
										'tr',
										{ className: 'bg-primary' },
										_react2['default'].createElement(
											'th',
											{ scope: 'row' },
											'1'
										),
										_react2['default'].createElement(
											'td',
											null,
											'About us',
											_react2['default'].createElement(
												'small',
												{ className: 'additional-info' },
												'Page'
											)
										),
										_react2['default'].createElement(
											'td',
											null,
											_react2['default'].createElement(
												'span',
												{ className: 'label label-info' },
												'Draft'
											)
										)
									),
									_react2['default'].createElement(
										'tr',
										null,
										_react2['default'].createElement(
											'th',
											{ scope: 'row' },
											'2'
										),
										_react2['default'].createElement(
											'td',
											null,
											_react2['default'].createElement(
												'a',
												{ href: '' },
												'My great blog post'
											),
											_react2['default'].createElement(
												'small',
												{ className: 'additional-info' },
												'Blog post'
											)
										),
										_react2['default'].createElement(
											'td',
											null,
											_react2['default'].createElement(
												'span',
												{ className: 'label label-success' },
												'Published'
											)
										)
									),
									_react2['default'].createElement(
										'tr',
										null,
										_react2['default'].createElement(
											'th',
											{ scope: 'row' },
											'3'
										),
										_react2['default'].createElement(
											'td',
											null,
											_react2['default'].createElement(
												'a',
												{ href: '' },
												'Our services'
											),
											_react2['default'].createElement(
												'small',
												{ className: 'additional-info' },
												'Services Page'
											)
										),
										_react2['default'].createElement(
											'td',
											null,
											_react2['default'].createElement(
												'span',
												{ className: 'label label-success' },
												'Published'
											)
										)
									),
									_react2['default'].createElement(
										'tr',
										null,
										_react2['default'].createElement(
											'th',
											{ scope: 'row' },
											'4'
										),
										_react2['default'].createElement(
											'td',
											null,
											_react2['default'].createElement(
												'a',
												{ href: '' },
												'June release'
											),
											_react2['default'].createElement(
												'small',
												{ className: 'additional-info' },
												'Campaign'
											)
										),
										_react2['default'].createElement('td', null)
									),
									_react2['default'].createElement(
										'tr',
										null,
										_react2['default'].createElement(
											'th',
											{ scope: 'row' },
											'5'
										),
										_react2['default'].createElement(
											'td',
											null,
											_react2['default'].createElement(
												'a',
												{ href: '' },
												'Marketing'
											),
											_react2['default'].createElement(
												'small',
												{ className: 'additional-info' },
												'Campaign'
											)
										),
										_react2['default'].createElement(
											'td',
											null,
											_react2['default'].createElement(
												'span',
												{ className: 'label label-warning' },
												'Scheduled'
											)
										)
									),
									_react2['default'].createElement(
										'tr',
										null,
										_react2['default'].createElement(
											'th',
											{ scope: 'row' },
											'6'
										),
										_react2['default'].createElement(
											'td',
											null,
											_react2['default'].createElement(
												'a',
												{ href: '' },
												'Services section'
											),
											_react2['default'].createElement(
												'small',
												{ className: 'additional-info' },
												'Campaign'
											)
										),
										_react2['default'].createElement(
											'td',
											null,
											_react2['default'].createElement(
												'span',
												{ className: 'label label-success' },
												'Published'
											)
										)
									)
								)
							)
						)
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
	backend: _react2['default'].PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		editorFields: state.assetAdmin.gallery.editorFields, // The inputs for editing the file.
		file: state.assetAdmin.gallery.editing, // The file to edit.
		files: state.assetAdmin.gallery.files,
		path: state.assetAdmin.gallery.path // The current location path
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: (0, _redux.bindActionCreators)(galleryActions, dispatch)
	};
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(EditorContainer);
module.exports = exports['default'];

},{"../../components/text-field/index":6,"../../constants":7,"../../state/gallery/actions":13,"components/form-action":"components/form-action","i18n":"i18n","jQuery":"jQuery","react":"react","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],10:[function(require,module,exports){
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

var _reactAddonsCssTransitionGroup = require('react-addons-css-transition-group');

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _componentsDropzone = require('../../components/dropzone');

var _componentsDropzone2 = _interopRequireDefault(_componentsDropzone);

var _componentsFileIndex = require('../../components/file/index');

var _componentsFileIndex2 = _interopRequireDefault(_componentsFileIndex);

var _componentsBulkActionsIndex = require('../../components/bulk-actions/index');

var _componentsBulkActionsIndex2 = _interopRequireDefault(_componentsBulkActionsIndex);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var _constants = require('../../constants');

var _constants2 = _interopRequireDefault(_constants);

var _stateGalleryActions = require('../../state/gallery/actions');

var galleryActions = _interopRequireWildcard(_stateGalleryActions);

var _stateQueuedFilesActions = require('../../state/queued-files/actions');

var queuedFilesActions = _interopRequireWildcard(_stateQueuedFilesActions);

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

		this.handleFolderActivate = this.handleFolderActivate.bind(this);
		this.handleFileActivate = this.handleFileActivate.bind(this);
		this.handleToggleSelect = this.handleToggleSelect.bind(this);
		this.handleAddedFile = this.handleAddedFile.bind(this);
		this.handleCancelUpload = this.handleCancelUpload.bind(this);
		this.handleRemoveErroredUpload = this.handleRemoveErroredUpload.bind(this);
		this.handleUploadProgress = this.handleUploadProgress.bind(this);
		this.handleSending = this.handleSending.bind(this);
		this.handleItemDelete = this.handleItemDelete.bind(this);
		this.handleBackClick = this.handleBackClick.bind(this);
		this.handleMoreClick = this.handleMoreClick.bind(this);
		this.handleSort = this.handleSort.bind(this);
		this.handleSuccessfulUpload = this.handleSuccessfulUpload.bind(this);
		this.handleFailedUpload = this.handleFailedUpload.bind(this);
	}

	_createClass(GalleryContainer, [{
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			var $select = (0, _jQuery2['default'])(_reactDom2['default'].findDOMNode(this)).find('.gallery__sort .dropdown');

			$select.off('change');
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

			//Chosen stops the change event from reaching React so we have to simulate a click.
			$select.on('change', function () {
				return _reactAddonsTestUtils2['default'].Simulate.click($select.find(':selected')[0]);
			});
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
			this.props.actions.queuedFiles.purgeUploadQueue();
			this.props.actions.gallery.sortFiles(getComparator(data.field, data.direction));
		}
	}, {
		key: 'getNoItemsNotice',
		value: function getNoItemsNotice() {
			if (this.props.gallery.count < 1 && this.props.queuedFiles.items.length < 1) {
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
			if (this.props.gallery.parentFolderID !== null) {
				return _react2['default'].createElement('button', {
					className: 'gallery__back ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-level-up no-text',
					onClick: this.handleBackClick,
					ref: 'backButton' });
			}

			return null;
		}
	}, {
		key: 'getBulkActionsComponent',
		value: function getBulkActionsComponent() {
			if (this.props.gallery.selectedFiles.length > 0 && this.props.backend.bulkActions) {
				return _react2['default'].createElement(_componentsBulkActionsIndex2['default'], {
					backend: this.props.backend,
					key: this.props.gallery.selectedFiles.length > 0 });
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
						onClick: this.handleMoreClick },
					_i18n2['default']._t('AssetGalleryField.LOADMORE')
				);
			}

			return null;
		}
	}, {
		key: 'handleCancelUpload',
		value: function handleCancelUpload(fileData) {
			fileData.xhr.abort();
			this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedAtTime);
		}
	}, {
		key: 'handleRemoveErroredUpload',
		value: function handleRemoveErroredUpload(fileData) {
			this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedAtTime);
		}
	}, {
		key: 'handleAddedFile',
		value: function handleAddedFile(data) {
			this.props.actions.queuedFiles.addQueuedFile(data);
		}

		/**
   * Triggered just before the xhr request is sent.
   *
   * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param object xhr
   * @param object formData - FormData interface. See https://developer.mozilla.org/en-US/docs/Web/API/FormData
   */
	}, {
		key: 'handleSending',
		value: function handleSending(file, xhr, formData) {
			this.props.actions.queuedFiles.updateQueuedFile(file._queuedAtTime, { xhr: xhr });
		}
	}, {
		key: 'handleUploadProgress',
		value: function handleUploadProgress(file, progress, bytesSent) {
			this.props.actions.queuedFiles.updateQueuedFile(file._queuedAtTime, { progress: progress });
		}
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			var dropzoneOptions = {
				url: 'admin/assets/EditForm/field/Upload/upload', // Hardcoded placeholder until we have a backend
				paramName: 'Upload',
				clickable: '#upload-button'
			};

			var securityID = (0, _jQuery2['default'])(':input[name=SecurityID]').val();

			// TODO Make "add folder" and "upload" buttons conditional on permissions
			return _react2['default'].createElement(
				'div',
				null,
				this.getBackButton(),
				_react2['default'].createElement(
					_reactAddonsCssTransitionGroup2['default'],
					{ transitionName: 'gallery__bulk-actions', transitionEnterTimeout: _constants2['default'].CSS_TRANSITION_TIME, transitionLeaveTimeout: _constants2['default'].CSS_TRANSITION_TIME },
					this.getBulkActionsComponent()
				),
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
					'button',
					{ id: 'add-folder-button', className: 'gallery__upload [ ss-ui-button font-icon-folder-add ]', type: 'button' },
					_i18n2['default']._t("AssetGalleryField.ADD_FOLDER_BUTTON")
				),
				_react2['default'].createElement(
					'button',
					{ id: 'upload-button', className: 'gallery__upload [ ss-ui-button font-icon-upload ]', type: 'button' },
					_i18n2['default']._t("AssetGalleryField.DROPZONE_UPLOAD")
				),
				_react2['default'].createElement(
					_componentsDropzone2['default'],
					{
						handleAddedFile: this.handleAddedFile,
						handleError: this.handleFailedUpload,
						handleSuccess: this.handleSuccessfulUpload,
						handleSending: this.handleSending,
						handleUploadProgress: this.handleUploadProgress,
						folderID: this.props.gallery.folderID,
						options: dropzoneOptions,
						securityID: securityID,
						uploadButton: false },
					_react2['default'].createElement(
						'div',
						{ className: 'gallery__folders' },
						this.props.gallery.files.map(function (file, i) {
							if (file.type === 'folder') {
								return _react2['default'].createElement(_componentsFileIndex2['default'], {
									key: i,
									item: file,
									selected: _this.itemIsSelected(file.id),
									handleDelete: _this.handleItemDelete,
									handleToggleSelect: _this.handleToggleSelect,
									handleActivate: _this.handleFolderActivate });
							}
						})
					),
					_react2['default'].createElement(
						'div',
						{ className: 'gallery__files' },
						this.props.queuedFiles.items.map(function (file, i) {
							return _react2['default'].createElement(_componentsFileIndex2['default'], {
								key: 'queued_file_' + i,
								item: file,
								selected: _this.itemIsSelected(file.id),
								handleDelete: _this.handleItemDelete,
								handleToggleSelect: _this.handleToggleSelect,
								handleActivate: _this.handleFileActivate,
								handleCancelUpload: _this.handleCancelUpload,
								handleRemoveErroredUpload: _this.handleRemoveErroredUpload,
								messages: file.messages,
								uploading: true });
						}),
						this.props.gallery.files.map(function (file, i) {
							if (file.type !== 'folder') {
								return _react2['default'].createElement(_componentsFileIndex2['default'], {
									key: 'file_' + i,
									item: file,
									selected: _this.itemIsSelected(file.id),
									handleDelete: _this.handleItemDelete,
									handleToggleSelect: _this.handleToggleSelect,
									handleActivate: _this.handleFileActivate });
							}
						})
					),
					this.getNoItemsNotice(),
					_react2['default'].createElement(
						'div',
						{ className: 'gallery__load' },
						this.getMoreButton()
					)
				)
			);
		}

		/**
   * Handles successful file uploads.
   *
   * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
	}, {
		key: 'handleSuccessfulUpload',
		value: function handleSuccessfulUpload(file) {
			var json = JSON.parse(file.xhr.response);

			// SilverStripe send back a success code with an error message sometimes...
			if (typeof json[0].error !== 'undefined') {
				this.handleFailedUpload(file);
				return;
			}

			this.props.actions.queuedFiles.removeQueuedFile(file._queuedAtTime);
			this.props.actions.gallery.addFiles(json, this.props.gallery.count + 1);
		}
	}, {
		key: 'handleFailedUpload',
		value: function handleFailedUpload(file, errorMessage) {
			this.props.actions.queuedFiles.failUpload(file._queuedAtTime);
		}
	}, {
		key: 'handleEnterRoute',
		value: function handleEnterRoute(ctx, next) {
			var viewingFolder = false;

			var folderID = ctx.params.id || 0;
			var folderPath = _constants2['default'].FOLDER_ROUTE.replace(':id?', folderID);

			if (ctx.params.action === 'show' && typeof ctx.params.id !== 0) {
				viewingFolder = true;
			}

			this.props.actions.gallery.setViewingFolder(viewingFolder);
			this.props.actions.gallery.deselectFiles();
			this.props.actions.gallery.removeFiles();
			this.props.actions.gallery.setPath(folderPath);

			this.props.backend.getFilesByParentID(folderID);

			next();
		}

		/**
   * Handles deleting a file or folder.
   *
   * @param object item - The file or folder to delete.
   */
	}, {
		key: 'handleItemDelete',
		value: function handleItemDelete(event, item) {
			if (confirm(_i18n2['default']._t('AssetGalleryField.CONFIRMDELETE'))) {
				this.props.backend['delete'](item.id);
			}
		}

		/**
   * Checks if a file or folder is currently selected.
   *
   * @param number id - The id of the file or folder to check.
   * @return boolean
   */
	}, {
		key: 'itemIsSelected',
		value: function itemIsSelected(id) {
			return this.props.gallery.selectedFiles.indexOf(id) > -1;
		}

		/**
   * Handles a user drilling down into a folder.
   *
   * @param object event - Event object.
   * @param object folder - The folder that's being activated.
   */
	}, {
		key: 'handleFolderActivate',
		value: function handleFolderActivate(event, folder) {
			window.ss.router.show(_constants2['default'].FOLDER_ROUTE.replace(':id?', folder.id));
		}

		/**
   * Handles a user activating the file editor.
   *
   * @param object event - Event object.
   * @param object file - The file that's being activated.
   */
	}, {
		key: 'handleFileActivate',
		value: function handleFileActivate(event, file) {
			// Disable file editing if the file has not finished uploading
			// or the upload has errored.
			if (file.created === null) {
				return;
			}

			this.props.actions.gallery.setEditing(file);
			window.ss.router.show(_constants2['default'].EDITING_ROUTE.replace(':id', file.id));
		}

		/**
   * Handles the user toggling the selected/deselected state of a file or folder.
   *
   * @param object event - Event object.
   * @param object item - The item being selected/deselected
   */
	}, {
		key: 'handleToggleSelect',
		value: function handleToggleSelect(event, item) {
			if (this.props.gallery.selectedFiles.indexOf(item.id) === -1) {
				this.props.actions.gallery.selectFiles([item.id]);
			} else {
				this.props.actions.gallery.deselectFiles([item.id]);
			}
		}
	}, {
		key: 'handleMoreClick',
		value: function handleMoreClick(event) {
			event.stopPropagation();
			event.preventDefault();
			this.props.backend.more();
		}
	}, {
		key: 'handleBackClick',
		value: function handleBackClick(event) {
			event.preventDefault();
			window.ss.router.show(_constants2['default'].FOLDER_ROUTE.replace(':id?', this.props.gallery.parentFolderID));
		}
	}]);

	return GalleryContainer;
})(_silverstripeComponent2['default']);

exports.GalleryContainer = GalleryContainer;

GalleryContainer.propTypes = {
	backend: _react2['default'].PropTypes.object.isRequired,
	gallery: _react2['default'].PropTypes.shape({
		folderID: _react2['default'].PropTypes.number.isRequired
	}),
	queuedFiles: _react2['default'].PropTypes.shape({
		items: _react2['default'].PropTypes.array.isRequired
	})
};

function mapStateToProps(state) {
	return {
		gallery: state.assetAdmin.gallery,
		queuedFiles: state.assetAdmin.queuedFiles
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			gallery: (0, _redux.bindActionCreators)(galleryActions, dispatch),
			queuedFiles: (0, _redux.bindActionCreators)(queuedFilesActions, dispatch)
		}
	};
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(GalleryContainer);

},{"../../components/bulk-actions/index":3,"../../components/dropzone":4,"../../components/file/index":5,"../../constants":7,"../../state/gallery/actions":13,"../../state/queued-files/actions":16,"i18n":"i18n","jQuery":"jQuery","react":"react","react-addons-css-transition-group":"react-addons-css-transition-group","react-addons-test-utils":"react-addons-test-utils","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component"}],11:[function(require,module,exports){
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

},{"./reducer":18,"redux":"redux","redux-logger":21,"redux-thunk":"redux-thunk"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var GALLERY = {
    ADD_FILES: 'ADD_FILES',
    DESELECT_FILES: 'DESELECT_FILES',
    REMOVE_FILES: 'REMOVE_FILES',
    SELECT_FILES: 'SELECT_FILES',
    SET_EDITING: 'SET_EDITING',
    SET_EDITOR_FIELDS: 'SET_EDITOR_FIELDS',
    SET_FOLDER_ID: 'SET_FOLDER_ID',
    SET_PARENT_FOLDER_ID: 'SET_PARENT_FOLDER_ID',
    SET_PATH: 'SET_PATH',
    SET_VIEWING_FOLDER: 'SET_VIEWING_FOLDER',
    SORT_FILES: 'SORT_FILES',
    UPDATE_EDITOR_FIELD: 'UPDATE_EDITOR_FIELD',
    UPDATE_FILE: 'UPDATE_FILE'
};
exports.GALLERY = GALLERY;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.addFiles = addFiles;
exports.removeFiles = removeFiles;
exports.updateFile = updateFile;
exports.selectFiles = selectFiles;
exports.deselectFiles = deselectFiles;
exports.setEditing = setEditing;
exports.setEditorFields = setEditorFields;
exports.updateEditorField = updateEditorField;
exports.setPath = setPath;
exports.sortFiles = sortFiles;
exports.setViewingFolder = setViewingFolder;
exports.setParentFolderId = setParentFolderId;
exports.setFolderId = setFolderId;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _actionTypes = require('./action-types');

var _constants = require('../../constants');

var _constants2 = _interopRequireDefault(_constants);

/**
 * Adds files to state.
 *
 * @param array files - Array of file objects.
 * @param number [count] - The number of files in the current view.
 */

function addFiles(files, count) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.ADD_FILES,
            payload: { files: files, count: count }
        });
    };
}

/**
 * Removes files from the state. If no param is passed all files are removed
 *
 * @param array ids - Array of file ids.
 */

function removeFiles(ids) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.REMOVE_FILES,
            payload: { ids: ids }
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
 * Selects files. If no param is passed all files are selected.
 *
 * @param Array ids - Array of file ids to select.
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
 * Deselects files. If no param is passed all files are deselected.
 *
 * @param Array ids - Array of file ids to deselect.
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
 * Starts editing the given file or stops editing if null is given.
 *
 * @param object|null file - The file to edit.
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
 * Updates push state (invoking any registered page.js handlers) and sets the route in state.
 * Components which define routes are rendered based on the `route` value stored in state.
 *
 * @param string path - The path for pushState.
 */

function setPath(path) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SET_PATH,
            payload: { path: path }
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

/**
 * Sets wether or not the user is currently inside a folder.
 *
 * @param boolean viewingFolder
 */

function setViewingFolder(viewingFolder) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SET_VIEWING_FOLDER,
            payload: { viewingFolder: viewingFolder }
        });
    };
}

/**
 * Sets the parentID for the currently viewed folder.
 *
 * @param number parentID
 */

function setParentFolderId(parentFolderID) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SET_PARENT_FOLDER_ID,
            payload: { parentFolderID: parentFolderID }
        });
    };
}

/**
 * Sets the ID for the folder currently being viewed.
 *
 * @param number folderID
 */

function setFolderId(folderID) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SET_FOLDER_ID,
            payload: { folderID: folderID }
        });
    };
}

},{"../../constants":7,"./action-types":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = galleryReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _actionTypes = require('./action-types');

var _constantsJs = require('../../constants.js');

var _constantsJs2 = _interopRequireDefault(_constantsJs);

var initialState = {
    bulkActions: {
        placeholder: _constantsJs2['default'].BULK_ACTIONS_PLACEHOLDER,
        options: _constantsJs2['default'].BULK_ACTIONS
    },
    count: 0, // The number of files in the current view
    editing: null, // The file being edited
    editorFields: [], // The input fields for editing files. Hardcoded until form field schema is implemented.
    files: [],
    folderID: 0,
    focus: false,
    parentFolderID: null,
    path: null, // The current location path the app is on
    selectedFiles: [],
    viewingFolder: false
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

        case _actionTypes.GALLERY.ADD_FILES:
            var nextFilesState = []; // Clone the state.files array

            action.payload.files.forEach(function (payloadFile) {
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

            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                count: typeof action.payload.count !== 'undefined' ? action.payload.count : state.count,
                files: nextFilesState.concat(state.files)
            }));

        case _actionTypes.GALLERY.REMOVE_FILES:
            if (typeof action.payload.ids === 'undefined') {
                // No param was passed, remove everything.
                nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, { count: 0, files: [] }));
            } else {
                // We're dealing with an array of ids
                nextState = (0, _deepFreeze2['default'])(Object.assign({}, state, {
                    count: state.files.filter(function (file) {
                        return action.payload.ids.indexOf(file.id) === -1;
                    }).length,
                    files: state.files.filter(function (file) {
                        return action.payload.ids.indexOf(file.id) === -1;
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

        case _actionTypes.GALLERY.SET_PATH:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                path: action.payload.path
            }));

        case _actionTypes.GALLERY.SET_VIEWING_FOLDER:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                viewingFolder: action.payload.viewingFolder
            }));

        case _actionTypes.GALLERY.SET_PARENT_FOLDER_ID:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                parentFolderID: action.payload.parentFolderID
            }));

        case _actionTypes.GALLERY.SET_FOLDER_ID:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                folderID: action.payload.folderID
            }));

        default:
            return state;
    }
}

module.exports = exports['default'];

},{"../../constants.js":7,"./action-types":12,"deep-freeze":"deep-freeze"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    ADD_QUEUED_FILE: 'ADD_QUEUED_FILE',
    FAIL_UPLOAD: 'FAIL_UPLOAD',
    PURGE_UPLOAD_QUEUE: 'PURGE_UPLOAD_QUEUE',
    REMOVE_QUEUED_FILE: 'REMOVE_QUEUED_FILE',
    SUCCEED_UPLOAD: 'SUCCEED_UPLOAD',
    UPDATE_QUEUED_FILE: 'UPDATE_QUEUED_FILE'
};
module.exports = exports['default'];

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.addQueuedFile = addQueuedFile;
exports.failUpload = failUpload;
exports.purgeUploadQueue = purgeUploadQueue;
exports.removeQueuedFile = removeQueuedFile;
exports.succeedUpload = succeedUpload;
exports.updateQueuedFile = updateQueuedFile;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _actionTypes = require('./action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

/**
 * Adds a file which has not been persisted to the server yet.
 *
 * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
 */

function addQueuedFile(file) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes2['default'].ADD_QUEUED_FILE,
            payload: { file: file }
        });
    };
}

/**
 * Updates a queued file if it fails to upload.
 *
 * @param number queuedAtTime - Timestamp (Date.now()) when the file was queued.
 */

function failUpload(queuedAtTime) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes2['default'].FAIL_UPLOAD,
            payload: { queuedAtTime: queuedAtTime }
        });
    };
}

/**
 * Purges the upload queue.
 *   - Failed uploads are removed.
 *   - Successful uploads are removed.
 *   - Pending uploads are ignored.
 */

function purgeUploadQueue() {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes2['default'].PURGE_UPLOAD_QUEUE,
            payload: null
        });
    };
}

/**
 * Removes a file from the queue.
 *
 * @param number queuedAtTime - Timestamp (Date.now()) when the file was queued.
 */

function removeQueuedFile(queuedAtTime) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes2['default'].REMOVE_QUEUED_FILE,
            payload: { queuedAtTime: queuedAtTime }
        });
    };
}

/**
 * Updates a queued file when it successfully uploads.
 *
 * @param number queuedAtTime - Timestamp (Date.now()) when the file was queued.
 */

function succeedUpload(queuedAtTime) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes2['default'].SUCCEED_UPLOAD,
            payload: { queuedAtTime: queuedAtTime }
        });
    };
}

/**
 * Override the values of a currently queued file.
 *
 * @param number queuedAtTime - Timestamp (Date.now()) when the file was queued.
 * @param object updates - The values to update.
 */

function updateQueuedFile(queuedAtTime, updates) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes2['default'].UPDATE_QUEUED_FILE,
            payload: { queuedAtTime: queuedAtTime, updates: updates }
        });
    };
}

},{"./action-types":15}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _actionTypes = require('./action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function fileFactory() {
    return (0, _deepFreeze2['default'])({
        attributes: {
            dimensions: {
                height: null,
                width: null
            }
        },
        basename: null,
        canDelete: false,
        canEdit: false,
        category: null,
        created: null,
        extension: null,
        filename: null,
        id: 0,
        lastUpdated: null,
        messages: null,
        owner: {
            id: 0,
            title: null
        },
        parent: {
            filename: null,
            id: 0,
            title: null
        },
        queuedAtTime: null,
        size: null,
        title: null,
        type: null,
        url: null,
        xhr: null
    });
}

var initialState = {
    items: []
};

function queuedFilesReducer(state, action) {
    if (state === undefined) state = initialState;

    switch (action.type) {

        case _actionTypes2['default'].ADD_QUEUED_FILE:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                items: state.items.concat([Object.assign({}, fileFactory(), action.payload.file)])
            }));

        case _actionTypes2['default'].FAIL_UPLOAD:
            // Add an error message to the failed file.
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                items: state.items.map(function (file) {
                    if (file.queuedAtTime === action.payload.queuedAtTime) {
                        return Object.assign({}, file, {
                            messages: [{
                                value: _i18n2['default']._t('AssetGalleryField.DROPZONE_FAILED_UPLOAD'),
                                type: 'error',
                                extraClass: 'error'
                            }]
                        });
                    }

                    return file;
                })
            }));

        case _actionTypes2['default'].PURGE_UPLOAD_QUEUE:
            // Failed uploads are removed.
            // Successful file uploads removed.
            // Pending uploads are ignored.
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                items: state.items.filter(function (file) {
                    if (Array.isArray(file.messages)) {
                        // If any of the file's messages are of type 'error' or 'success' then return false.
                        return !file.messages.filter(function (message) {
                            return message.type === 'error' || message.type === 'success';
                        }).length > 0;
                    }

                    return true;
                })
            }));

        case _actionTypes2['default'].REMOVE_QUEUED_FILE:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                items: state.items.filter(function (file) {
                    return file.queuedAtTime !== action.payload.queuedAtTime;
                })
            }));

        case _actionTypes2['default'].SUCCEED_UPLOAD:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                items: state.items.map(function (file) {
                    if (file.queuedAtTime === action.payload.queuedAtTime) {
                        return Object.assign({}, file, {
                            messages: [{
                                value: _i18n2['default']._t('AssetGalleryField.DROPZONE_SUCCESS_UPLOAD'),
                                type: 'success',
                                extraClass: 'success'
                            }]
                        });
                    }

                    return file;
                })
            }));

        case _actionTypes2['default'].UPDATE_QUEUED_FILE:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                items: state.items.map(function (file) {
                    if (file.queuedAtTime === action.payload.queuedAtTime) {
                        return Object.assign({}, file, action.payload.updates);
                    }

                    return file;
                })
            }));

        default:
            return state;
    }
}

exports['default'] = queuedFilesReducer;
module.exports = exports['default'];

},{"./action-types":15,"deep-freeze":"deep-freeze","i18n":"i18n"}],18:[function(require,module,exports){
/**
 * @file The reducer which operates on the Redux store.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _redux = require('redux');

var _galleryReducer = require('./gallery/reducer');

var _galleryReducer2 = _interopRequireDefault(_galleryReducer);

var _queuedFilesReducer = require('./queued-files/reducer');

var _queuedFilesReducer2 = _interopRequireDefault(_queuedFilesReducer);

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
    gallery: _galleryReducer2['default'],
    queuedFiles: _queuedFilesReducer2['default']
  })
});

exports['default'] = rootReducer;
module.exports = exports['default'];

},{"./gallery/reducer":14,"./queued-files/reducer":17,"redux":"redux"}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){

/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

(function() {
  var Dropzone, Emitter, camelize, contentLoaded, detectVerticalSquash, drawImageIOSFix, noop, without,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  noop = function() {};

  Emitter = (function() {
    function Emitter() {}

    Emitter.prototype.addEventListener = Emitter.prototype.on;

    Emitter.prototype.on = function(event, fn) {
      this._callbacks = this._callbacks || {};
      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }
      this._callbacks[event].push(fn);
      return this;
    };

    Emitter.prototype.emit = function() {
      var args, callback, callbacks, event, _i, _len;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this._callbacks = this._callbacks || {};
      callbacks = this._callbacks[event];
      if (callbacks) {
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          callback.apply(this, args);
        }
      }
      return this;
    };

    Emitter.prototype.removeListener = Emitter.prototype.off;

    Emitter.prototype.removeAllListeners = Emitter.prototype.off;

    Emitter.prototype.removeEventListener = Emitter.prototype.off;

    Emitter.prototype.off = function(event, fn) {
      var callback, callbacks, i, _i, _len;
      if (!this._callbacks || arguments.length === 0) {
        this._callbacks = {};
        return this;
      }
      callbacks = this._callbacks[event];
      if (!callbacks) {
        return this;
      }
      if (arguments.length === 1) {
        delete this._callbacks[event];
        return this;
      }
      for (i = _i = 0, _len = callbacks.length; _i < _len; i = ++_i) {
        callback = callbacks[i];
        if (callback === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };

    return Emitter;

  })();

  Dropzone = (function(_super) {
    var extend, resolveOption;

    __extends(Dropzone, _super);

    Dropzone.prototype.Emitter = Emitter;


    /*
    This is a list of all available events you can register on a dropzone object.
    
    You can register an event handler like this:
    
        dropzone.on("dragEnter", function() { });
     */

    Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];

    Dropzone.prototype.defaultOptions = {
      url: null,
      method: "post",
      withCredentials: false,
      parallelUploads: 2,
      uploadMultiple: false,
      maxFilesize: 256,
      paramName: "file",
      createImageThumbnails: true,
      maxThumbnailFilesize: 10,
      thumbnailWidth: 120,
      thumbnailHeight: 120,
      filesizeBase: 1000,
      maxFiles: null,
      params: {},
      clickable: true,
      ignoreHiddenFiles: true,
      acceptedFiles: null,
      acceptedMimeTypes: null,
      autoProcessQueue: true,
      autoQueue: true,
      addRemoveLinks: false,
      previewsContainer: null,
      hiddenInputContainer: "body",
      capture: null,
      renameFilename: null,
      dictDefaultMessage: "Drop files here to upload",
      dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
      dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
      dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
      dictInvalidFileType: "You can't upload files of this type.",
      dictResponseError: "Server responded with {{statusCode}} code.",
      dictCancelUpload: "Cancel upload",
      dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
      dictRemoveFile: "Remove file",
      dictRemoveFileConfirmation: null,
      dictMaxFilesExceeded: "You can not upload any more files.",
      accept: function(file, done) {
        return done();
      },
      init: function() {
        return noop;
      },
      forceFallback: false,
      fallback: function() {
        var child, messageElement, span, _i, _len, _ref;
        this.element.className = "" + this.element.className + " dz-browser-not-supported";
        _ref = this.element.getElementsByTagName("div");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (/(^| )dz-message($| )/.test(child.className)) {
            messageElement = child;
            child.className = "dz-message";
            continue;
          }
        }
        if (!messageElement) {
          messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
          this.element.appendChild(messageElement);
        }
        span = messageElement.getElementsByTagName("span")[0];
        if (span) {
          if (span.textContent != null) {
            span.textContent = this.options.dictFallbackMessage;
          } else if (span.innerText != null) {
            span.innerText = this.options.dictFallbackMessage;
          }
        }
        return this.element.appendChild(this.getFallbackForm());
      },
      resize: function(file) {
        var info, srcRatio, trgRatio;
        info = {
          srcX: 0,
          srcY: 0,
          srcWidth: file.width,
          srcHeight: file.height
        };
        srcRatio = file.width / file.height;
        info.optWidth = this.options.thumbnailWidth;
        info.optHeight = this.options.thumbnailHeight;
        if ((info.optWidth == null) && (info.optHeight == null)) {
          info.optWidth = info.srcWidth;
          info.optHeight = info.srcHeight;
        } else if (info.optWidth == null) {
          info.optWidth = srcRatio * info.optHeight;
        } else if (info.optHeight == null) {
          info.optHeight = (1 / srcRatio) * info.optWidth;
        }
        trgRatio = info.optWidth / info.optHeight;
        if (file.height < info.optHeight || file.width < info.optWidth) {
          info.trgHeight = info.srcHeight;
          info.trgWidth = info.srcWidth;
        } else {
          if (srcRatio > trgRatio) {
            info.srcHeight = file.height;
            info.srcWidth = info.srcHeight * trgRatio;
          } else {
            info.srcWidth = file.width;
            info.srcHeight = info.srcWidth / trgRatio;
          }
        }
        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;
        return info;
      },

      /*
      Those functions register themselves to the events on init and handle all
      the user interface specific stuff. Overwriting them won't break the upload
      but can break the way it's displayed.
      You can overwrite them if you don't like the default behavior. If you just
      want to add an additional event handler, register it on the dropzone object
      and don't overwrite those options.
       */
      drop: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragstart: noop,
      dragend: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragenter: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragover: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragleave: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      paste: noop,
      reset: function() {
        return this.element.classList.remove("dz-started");
      },
      addedfile: function(file) {
        var node, removeFileEvent, removeLink, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        if (this.element === this.previewsContainer) {
          this.element.classList.add("dz-started");
        }
        if (this.previewsContainer) {
          file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
          file.previewTemplate = file.previewElement;
          this.previewsContainer.appendChild(file.previewElement);
          _ref = file.previewElement.querySelectorAll("[data-dz-name]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            node.textContent = this._renameFilename(file.name);
          }
          _ref1 = file.previewElement.querySelectorAll("[data-dz-size]");
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            node = _ref1[_j];
            node.innerHTML = this.filesize(file.size);
          }
          if (this.options.addRemoveLinks) {
            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
            file.previewElement.appendChild(file._removeLink);
          }
          removeFileEvent = (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              if (file.status === Dropzone.UPLOADING) {
                return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function() {
                  return _this.removeFile(file);
                });
              } else {
                if (_this.options.dictRemoveFileConfirmation) {
                  return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function() {
                    return _this.removeFile(file);
                  });
                } else {
                  return _this.removeFile(file);
                }
              }
            };
          })(this);
          _ref2 = file.previewElement.querySelectorAll("[data-dz-remove]");
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            removeLink = _ref2[_k];
            _results.push(removeLink.addEventListener("click", removeFileEvent));
          }
          return _results;
        }
      },
      removedfile: function(file) {
        var _ref;
        if (file.previewElement) {
          if ((_ref = file.previewElement) != null) {
            _ref.parentNode.removeChild(file.previewElement);
          }
        }
        return this._updateMaxFilesReachedClass();
      },
      thumbnail: function(file, dataUrl) {
        var thumbnailElement, _i, _len, _ref;
        if (file.previewElement) {
          file.previewElement.classList.remove("dz-file-preview");
          _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thumbnailElement = _ref[_i];
            thumbnailElement.alt = file.name;
            thumbnailElement.src = dataUrl;
          }
          return setTimeout(((function(_this) {
            return function() {
              return file.previewElement.classList.add("dz-image-preview");
            };
          })(this)), 1);
        }
      },
      error: function(file, message) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          file.previewElement.classList.add("dz-error");
          if (typeof message !== "String" && message.error) {
            message = message.error;
          }
          _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.textContent = message);
          }
          return _results;
        }
      },
      errormultiple: noop,
      processing: function(file) {
        if (file.previewElement) {
          file.previewElement.classList.add("dz-processing");
          if (file._removeLink) {
            return file._removeLink.textContent = this.options.dictCancelUpload;
          }
        }
      },
      processingmultiple: noop,
      uploadprogress: function(file, progress, bytesSent) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            if (node.nodeName === 'PROGRESS') {
              _results.push(node.value = progress);
            } else {
              _results.push(node.style.width = "" + progress + "%");
            }
          }
          return _results;
        }
      },
      totaluploadprogress: noop,
      sending: noop,
      sendingmultiple: noop,
      success: function(file) {
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-success");
        }
      },
      successmultiple: noop,
      canceled: function(file) {
        return this.emit("error", file, "Upload canceled.");
      },
      canceledmultiple: noop,
      complete: function(file) {
        if (file._removeLink) {
          file._removeLink.textContent = this.options.dictRemoveFile;
        }
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-complete");
        }
      },
      completemultiple: noop,
      maxfilesexceeded: noop,
      maxfilesreached: noop,
      queuecomplete: noop,
      addedfiles: noop,
      previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>"
    };

    extend = function() {
      var key, object, objects, target, val, _i, _len;
      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          val = object[key];
          target[key] = val;
        }
      }
      return target;
    };

    function Dropzone(element, options) {
      var elementOptions, fallback, _ref;
      this.element = element;
      this.version = Dropzone.version;
      this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
      this.clickableElements = [];
      this.listeners = [];
      this.files = [];
      if (typeof this.element === "string") {
        this.element = document.querySelector(this.element);
      }
      if (!(this.element && (this.element.nodeType != null))) {
        throw new Error("Invalid dropzone element.");
      }
      if (this.element.dropzone) {
        throw new Error("Dropzone already attached.");
      }
      Dropzone.instances.push(this);
      this.element.dropzone = this;
      elementOptions = (_ref = Dropzone.optionsForElement(this.element)) != null ? _ref : {};
      this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
      if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
        return this.options.fallback.call(this);
      }
      if (this.options.url == null) {
        this.options.url = this.element.getAttribute("action");
      }
      if (!this.options.url) {
        throw new Error("No URL provided.");
      }
      if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {
        throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
      }
      if (this.options.acceptedMimeTypes) {
        this.options.acceptedFiles = this.options.acceptedMimeTypes;
        delete this.options.acceptedMimeTypes;
      }
      this.options.method = this.options.method.toUpperCase();
      if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
        fallback.parentNode.removeChild(fallback);
      }
      if (this.options.previewsContainer !== false) {
        if (this.options.previewsContainer) {
          this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
        } else {
          this.previewsContainer = this.element;
        }
      }
      if (this.options.clickable) {
        if (this.options.clickable === true) {
          this.clickableElements = [this.element];
        } else {
          this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
        }
      }
      this.init();
    }

    Dropzone.prototype.getAcceptedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getRejectedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (!file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getFilesWithStatus = function(status) {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === status) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getQueuedFiles = function() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    };

    Dropzone.prototype.getUploadingFiles = function() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    };

    Dropzone.prototype.getAddedFiles = function() {
      return this.getFilesWithStatus(Dropzone.ADDED);
    };

    Dropzone.prototype.getActiveFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.init = function() {
      var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1;
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }
      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }
      if (this.clickableElements.length) {
        setupHiddenFileInput = (function(_this) {
          return function() {
            if (_this.hiddenFileInput) {
              _this.hiddenFileInput.parentNode.removeChild(_this.hiddenFileInput);
            }
            _this.hiddenFileInput = document.createElement("input");
            _this.hiddenFileInput.setAttribute("type", "file");
            if ((_this.options.maxFiles == null) || _this.options.maxFiles > 1) {
              _this.hiddenFileInput.setAttribute("multiple", "multiple");
            }
            _this.hiddenFileInput.className = "dz-hidden-input";
            if (_this.options.acceptedFiles != null) {
              _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
            }
            if (_this.options.capture != null) {
              _this.hiddenFileInput.setAttribute("capture", _this.options.capture);
            }
            _this.hiddenFileInput.style.visibility = "hidden";
            _this.hiddenFileInput.style.position = "absolute";
            _this.hiddenFileInput.style.top = "0";
            _this.hiddenFileInput.style.left = "0";
            _this.hiddenFileInput.style.height = "0";
            _this.hiddenFileInput.style.width = "0";
            document.querySelector(_this.options.hiddenInputContainer).appendChild(_this.hiddenFileInput);
            return _this.hiddenFileInput.addEventListener("change", function() {
              var file, files, _i, _len;
              files = _this.hiddenFileInput.files;
              if (files.length) {
                for (_i = 0, _len = files.length; _i < _len; _i++) {
                  file = files[_i];
                  _this.addFile(file);
                }
              }
              _this.emit("addedfiles", files);
              return setupHiddenFileInput();
            });
          };
        })(this);
        setupHiddenFileInput();
      }
      this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventName = _ref1[_i];
        this.on(eventName, this.options[eventName]);
      }
      this.on("uploadprogress", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("removedfile", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("canceled", (function(_this) {
        return function(file) {
          return _this.emit("complete", file);
        };
      })(this));
      this.on("complete", (function(_this) {
        return function(file) {
          if (_this.getAddedFiles().length === 0 && _this.getUploadingFiles().length === 0 && _this.getQueuedFiles().length === 0) {
            return setTimeout((function() {
              return _this.emit("queuecomplete");
            }), 0);
          }
        };
      })(this));
      noPropagation = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };
      this.listeners = [
        {
          element: this.element,
          events: {
            "dragstart": (function(_this) {
              return function(e) {
                return _this.emit("dragstart", e);
              };
            })(this),
            "dragenter": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.emit("dragenter", e);
              };
            })(this),
            "dragover": (function(_this) {
              return function(e) {
                var efct;
                try {
                  efct = e.dataTransfer.effectAllowed;
                } catch (_error) {}
                e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
                noPropagation(e);
                return _this.emit("dragover", e);
              };
            })(this),
            "dragleave": (function(_this) {
              return function(e) {
                return _this.emit("dragleave", e);
              };
            })(this),
            "drop": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.drop(e);
              };
            })(this),
            "dragend": (function(_this) {
              return function(e) {
                return _this.emit("dragend", e);
              };
            })(this)
          }
        }
      ];
      this.clickableElements.forEach((function(_this) {
        return function(clickableElement) {
          return _this.listeners.push({
            element: clickableElement,
            events: {
              "click": function(evt) {
                if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                  _this.hiddenFileInput.click();
                }
                return true;
              }
            }
          });
        };
      })(this));
      this.enable();
      return this.options.init.call(this);
    };

    Dropzone.prototype.destroy = function() {
      var _ref;
      this.disable();
      this.removeAllFiles(true);
      if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    };

    Dropzone.prototype.updateTotalUploadProgress = function() {
      var activeFiles, file, totalBytes, totalBytesSent, totalUploadProgress, _i, _len, _ref;
      totalBytesSent = 0;
      totalBytes = 0;
      activeFiles = this.getActiveFiles();
      if (activeFiles.length) {
        _ref = this.getActiveFiles();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }
      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    };

    Dropzone.prototype._getParamName = function(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "" + this.options.paramName + (this.options.uploadMultiple ? "[" + n + "]" : "");
      }
    };

    Dropzone.prototype._renameFilename = function(name) {
      if (typeof this.options.renameFilename !== "function") {
        return name;
      }
      return this.options.renameFilename(name);
    };

    Dropzone.prototype.getFallbackForm = function() {
      var existingFallback, fields, fieldsString, form;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }
      fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + (this._getParamName(0)) + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : void 0) + " /><input type=\"submit\" value=\"Upload!\"></div>";
      fields = Dropzone.createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }
      return form != null ? form : fields;
    };

    Dropzone.prototype.getExistingFallback = function() {
      var fallback, getFallback, tagName, _i, _len, _ref;
      getFallback = function(elements) {
        var el, _i, _len;
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };
      _ref = ["div", "form"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    };

    Dropzone.prototype.setupEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.removeEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.disable = function() {
      var file, _i, _len, _ref, _results;
      this.clickableElements.forEach(function(element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _results.push(this.cancelUpload(file));
      }
      return _results;
    };

    Dropzone.prototype.enable = function() {
      this.clickableElements.forEach(function(element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    };

    Dropzone.prototype.filesize = function(size) {
      var cutoff, i, selectedSize, selectedUnit, unit, units, _i, _len;
      selectedSize = 0;
      selectedUnit = "b";
      if (size > 0) {
        units = ['TB', 'GB', 'MB', 'KB', 'b'];
        for (i = _i = 0, _len = units.length; _i < _len; i = ++_i) {
          unit = units[i];
          cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;
          if (size >= cutoff) {
            selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
            selectedUnit = unit;
            break;
          }
        }
        selectedSize = Math.round(10 * selectedSize) / 10;
      }
      return "<strong>" + selectedSize + "</strong> " + selectedUnit;
    };

    Dropzone.prototype._updateMaxFilesReachedClass = function() {
      if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit('maxfilesreached', this.files);
        }
        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    };

    Dropzone.prototype.drop = function(e) {
      var files, items;
      if (!e.dataTransfer) {
        return;
      }
      this.emit("drop", e);
      files = e.dataTransfer.files;
      this.emit("addedfiles", files);
      if (files.length) {
        items = e.dataTransfer.items;
        if (items && items.length && (items[0].webkitGetAsEntry != null)) {
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    };

    Dropzone.prototype.paste = function(e) {
      var items, _ref;
      if ((e != null ? (_ref = e.clipboardData) != null ? _ref.items : void 0 : void 0) == null) {
        return;
      }
      this.emit("paste", e);
      items = e.clipboardData.items;
      if (items.length) {
        return this._addFilesFromItems(items);
      }
    };

    Dropzone.prototype.handleFiles = function(files) {
      var file, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(this.addFile(file));
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromItems = function(items) {
      var entry, item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
          if (entry.isFile) {
            _results.push(this.addFile(item.getAsFile()));
          } else if (entry.isDirectory) {
            _results.push(this._addFilesFromDirectory(entry, entry.name));
          } else {
            _results.push(void 0);
          }
        } else if (item.getAsFile != null) {
          if ((item.kind == null) || item.kind === "file") {
            _results.push(this.addFile(item.getAsFile()));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromDirectory = function(directory, path) {
      var dirReader, errorHandler, readEntries;
      dirReader = directory.createReader();
      errorHandler = function(error) {
        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
      };
      readEntries = (function(_this) {
        return function() {
          return dirReader.readEntries(function(entries) {
            var entry, _i, _len;
            if (entries.length > 0) {
              for (_i = 0, _len = entries.length; _i < _len; _i++) {
                entry = entries[_i];
                if (entry.isFile) {
                  entry.file(function(file) {
                    if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                      return;
                    }
                    file.fullPath = "" + path + "/" + file.name;
                    return _this.addFile(file);
                  });
                } else if (entry.isDirectory) {
                  _this._addFilesFromDirectory(entry, "" + path + "/" + entry.name);
                }
              }
              readEntries();
            }
            return null;
          }, errorHandler);
        };
      })(this);
      return readEntries();
    };

    Dropzone.prototype.accept = function(file, done) {
      if (file.size > this.options.maxFilesize * 1024 * 1024) {
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        return done(this.options.dictInvalidFileType);
      } else if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        return this.emit("maxfilesexceeded", file);
      } else {
        return this.options.accept.call(this, file, done);
      }
    };

    Dropzone.prototype.addFile = function(file) {
      file.upload = {
        progress: 0,
        total: file.size,
        bytesSent: 0
      };
      this.files.push(file);
      file.status = Dropzone.ADDED;
      this.emit("addedfile", file);
      this._enqueueThumbnail(file);
      return this.accept(file, (function(_this) {
        return function(error) {
          if (error) {
            file.accepted = false;
            _this._errorProcessing([file], error);
          } else {
            file.accepted = true;
            if (_this.options.autoQueue) {
              _this.enqueueFile(file);
            }
          }
          return _this._updateMaxFilesReachedClass();
        };
      })(this));
    };

    Dropzone.prototype.enqueueFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        this.enqueueFile(file);
      }
      return null;
    };

    Dropzone.prototype.enqueueFile = function(file) {
      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout(((function(_this) {
            return function() {
              return _this.processQueue();
            };
          })(this)), 0);
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    };

    Dropzone.prototype._thumbnailQueue = [];

    Dropzone.prototype._processingThumbnail = false;

    Dropzone.prototype._enqueueThumbnail = function(file) {
      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);
        return setTimeout(((function(_this) {
          return function() {
            return _this._processThumbnailQueue();
          };
        })(this)), 0);
      }
    };

    Dropzone.prototype._processThumbnailQueue = function() {
      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }
      this._processingThumbnail = true;
      return this.createThumbnail(this._thumbnailQueue.shift(), (function(_this) {
        return function() {
          _this._processingThumbnail = false;
          return _this._processThumbnailQueue();
        };
      })(this));
    };

    Dropzone.prototype.removeFile = function(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);
      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    };

    Dropzone.prototype.removeAllFiles = function(cancelIfNecessary) {
      var file, _i, _len, _ref;
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      _ref = this.files.slice();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    };

    Dropzone.prototype.createThumbnail = function(file, callback) {
      var fileReader;
      fileReader = new FileReader;
      fileReader.onload = (function(_this) {
        return function() {
          if (file.type === "image/svg+xml") {
            _this.emit("thumbnail", file, fileReader.result);
            if (callback != null) {
              callback();
            }
            return;
          }
          return _this.createThumbnailFromUrl(file, fileReader.result, callback);
        };
      })(this);
      return fileReader.readAsDataURL(file);
    };

    Dropzone.prototype.createThumbnailFromUrl = function(file, imageUrl, callback, crossOrigin) {
      var img;
      img = document.createElement("img");
      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }
      img.onload = (function(_this) {
        return function() {
          var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
          file.width = img.width;
          file.height = img.height;
          resizeInfo = _this.options.resize.call(_this, file);
          if (resizeInfo.trgWidth == null) {
            resizeInfo.trgWidth = resizeInfo.optWidth;
          }
          if (resizeInfo.trgHeight == null) {
            resizeInfo.trgHeight = resizeInfo.optHeight;
          }
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;
          drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
          thumbnail = canvas.toDataURL("image/png");
          _this.emit("thumbnail", file, thumbnail);
          if (callback != null) {
            return callback();
          }
        };
      })(this);
      if (callback != null) {
        img.onerror = callback;
      }
      return img.src = imageUrl;
    };

    Dropzone.prototype.processQueue = function() {
      var i, parallelUploads, processingLength, queuedFiles;
      parallelUploads = this.options.parallelUploads;
      processingLength = this.getUploadingFiles().length;
      i = processingLength;
      if (processingLength >= parallelUploads) {
        return;
      }
      queuedFiles = this.getQueuedFiles();
      if (!(queuedFiles.length > 0)) {
        return;
      }
      if (this.options.uploadMultiple) {
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          }
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    };

    Dropzone.prototype.processFile = function(file) {
      return this.processFiles([file]);
    };

    Dropzone.prototype.processFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.processing = true;
        file.status = Dropzone.UPLOADING;
        this.emit("processing", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }
      return this.uploadFiles(files);
    };

    Dropzone.prototype._getFilesWithXhr = function(xhr) {
      var file, files;
      return files = (function() {
        var _i, _len, _ref, _results;
        _ref = this.files;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (file.xhr === xhr) {
            _results.push(file);
          }
        }
        return _results;
      }).call(this);
    };

    Dropzone.prototype.cancelUpload = function(file) {
      var groupedFile, groupedFiles, _i, _j, _len, _len1, _ref;
      if (file.status === Dropzone.UPLOADING) {
        groupedFiles = this._getFilesWithXhr(file.xhr);
        for (_i = 0, _len = groupedFiles.length; _i < _len; _i++) {
          groupedFile = groupedFiles[_i];
          groupedFile.status = Dropzone.CANCELED;
        }
        file.xhr.abort();
        for (_j = 0, _len1 = groupedFiles.length; _j < _len1; _j++) {
          groupedFile = groupedFiles[_j];
          this.emit("canceled", groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if ((_ref = file.status) === Dropzone.ADDED || _ref === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    resolveOption = function() {
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof option === 'function') {
        return option.apply(this, args);
      }
      return option;
    };

    Dropzone.prototype.uploadFile = function(file) {
      return this.uploadFiles([file]);
    };

    Dropzone.prototype.uploadFiles = function(files) {
      var file, formData, handleError, headerName, headerValue, headers, i, input, inputName, inputType, key, method, option, progressObj, response, updateProgress, url, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      xhr = new XMLHttpRequest();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.xhr = xhr;
      }
      method = resolveOption(this.options.method, files);
      url = resolveOption(this.options.url, files);
      xhr.open(method, url, true);
      xhr.withCredentials = !!this.options.withCredentials;
      response = null;
      handleError = (function(_this) {
        return function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
            file = files[_j];
            _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
          }
          return _results;
        };
      })(this);
      updateProgress = (function(_this) {
        return function(e) {
          var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
          if (e != null) {
            progress = 100 * e.loaded / e.total;
            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
              file = files[_j];
              file.upload = {
                progress: progress,
                total: e.total,
                bytesSent: e.loaded
              };
            }
          } else {
            allFilesFinished = true;
            progress = 100;
            for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
              file = files[_k];
              if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                allFilesFinished = false;
              }
              file.upload.progress = progress;
              file.upload.bytesSent = file.upload.total;
            }
            if (allFilesFinished) {
              return;
            }
          }
          _results = [];
          for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
            file = files[_l];
            _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
          }
          return _results;
        };
      })(this);
      xhr.onload = (function(_this) {
        return function(e) {
          var _ref;
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          if (xhr.readyState !== 4) {
            return;
          }
          response = xhr.responseText;
          if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
            try {
              response = JSON.parse(response);
            } catch (_error) {
              e = _error;
              response = "Invalid JSON response from server.";
            }
          }
          updateProgress();
          if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
            return handleError();
          } else {
            return _this._finished(files, response, e);
          }
        };
      })(this);
      xhr.onerror = (function(_this) {
        return function() {
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          return handleError();
        };
      })(this);
      progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
      progressObj.onprogress = updateProgress;
      headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };
      if (this.options.headers) {
        extend(headers, this.options.headers);
      }
      for (headerName in headers) {
        headerValue = headers[headerName];
        if (headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }
      formData = new FormData();
      if (this.options.params) {
        _ref1 = this.options.params;
        for (key in _ref1) {
          value = _ref1[key];
          formData.append(key, value);
        }
      }
      for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
        file = files[_j];
        this.emit("sending", file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }
      if (this.element.tagName === "FORM") {
        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          input = _ref2[_k];
          inputName = input.getAttribute("name");
          inputType = input.getAttribute("type");
          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            _ref3 = input.options;
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              option = _ref3[_l];
              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
      for (i = _m = 0, _ref5 = files.length - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
        formData.append(this._getParamName(i), files[i], this._renameFilename(files[i].name));
      }
      return this.submitRequest(xhr, formData, files);
    };

    Dropzone.prototype.submitRequest = function(xhr, formData, files) {
      return xhr.send(formData);
    };

    Dropzone.prototype._finished = function(files, responseText, e) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    Dropzone.prototype._errorProcessing = function(files, message, xhr) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    return Dropzone;

  })(Emitter);

  Dropzone.version = "4.3.0";

  Dropzone.options = {};

  Dropzone.optionsForElement = function(element) {
    if (element.getAttribute("id")) {
      return Dropzone.options[camelize(element.getAttribute("id"))];
    } else {
      return void 0;
    }
  };

  Dropzone.instances = [];

  Dropzone.forElement = function(element) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    if ((element != null ? element.dropzone : void 0) == null) {
      throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
    }
    return element.dropzone;
  };

  Dropzone.autoDiscover = true;

  Dropzone.discover = function() {
    var checkElements, dropzone, dropzones, _i, _len, _results;
    if (document.querySelectorAll) {
      dropzones = document.querySelectorAll(".dropzone");
    } else {
      dropzones = [];
      checkElements = function(elements) {
        var el, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )dropzone($| )/.test(el.className)) {
            _results.push(dropzones.push(el));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      checkElements(document.getElementsByTagName("div"));
      checkElements(document.getElementsByTagName("form"));
    }
    _results = [];
    for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
      dropzone = dropzones[_i];
      if (Dropzone.optionsForElement(dropzone) !== false) {
        _results.push(new Dropzone(dropzone));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

  Dropzone.isBrowserSupported = function() {
    var capableBrowser, regex, _i, _len, _ref;
    capableBrowser = true;
    if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
      if (!("classList" in document.createElement("a"))) {
        capableBrowser = false;
      } else {
        _ref = Dropzone.blacklistedBrowsers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          regex = _ref[_i];
          if (regex.test(navigator.userAgent)) {
            capableBrowser = false;
            continue;
          }
        }
      }
    } else {
      capableBrowser = false;
    }
    return capableBrowser;
  };

  without = function(list, rejectedItem) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item !== rejectedItem) {
        _results.push(item);
      }
    }
    return _results;
  };

  camelize = function(str) {
    return str.replace(/[\-_](\w)/g, function(match) {
      return match.charAt(1).toUpperCase();
    });
  };

  Dropzone.createElement = function(string) {
    var div;
    div = document.createElement("div");
    div.innerHTML = string;
    return div.childNodes[0];
  };

  Dropzone.elementInside = function(element, container) {
    if (element === container) {
      return true;
    }
    while (element = element.parentNode) {
      if (element === container) {
        return true;
      }
    }
    return false;
  };

  Dropzone.getElement = function(el, name) {
    var element;
    if (typeof el === "string") {
      element = document.querySelector(el);
    } else if (el.nodeType != null) {
      element = el;
    }
    if (element == null) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
    }
    return element;
  };

  Dropzone.getElements = function(els, name) {
    var e, el, elements, _i, _j, _len, _len1, _ref;
    if (els instanceof Array) {
      elements = [];
      try {
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          elements.push(this.getElement(el, name));
        }
      } catch (_error) {
        e = _error;
        elements = null;
      }
    } else if (typeof els === "string") {
      elements = [];
      _ref = document.querySelectorAll(els);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        el = _ref[_j];
        elements.push(el);
      }
    } else if (els.nodeType != null) {
      elements = [els];
    }
    if (!((elements != null) && elements.length)) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
    }
    return elements;
  };

  Dropzone.confirm = function(question, accepted, rejected) {
    if (window.confirm(question)) {
      return accepted();
    } else if (rejected != null) {
      return rejected();
    }
  };

  Dropzone.isValidFile = function(file, acceptedFiles) {
    var baseMimeType, mimeType, validType, _i, _len;
    if (!acceptedFiles) {
      return true;
    }
    acceptedFiles = acceptedFiles.split(",");
    mimeType = file.type;
    baseMimeType = mimeType.replace(/\/.*$/, "");
    for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
      validType = acceptedFiles[_i];
      validType = validType.trim();
      if (validType.charAt(0) === ".") {
        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
          return true;
        }
      } else if (/\/\*$/.test(validType)) {
        if (baseMimeType === validType.replace(/\/.*$/, "")) {
          return true;
        }
      } else {
        if (mimeType === validType) {
          return true;
        }
      }
    }
    return false;
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.dropzone = function(options) {
      return this.each(function() {
        return new Dropzone(this, options);
      });
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Dropzone;
  } else {
    window.Dropzone = Dropzone;
  }

  Dropzone.ADDED = "added";

  Dropzone.QUEUED = "queued";

  Dropzone.ACCEPTED = Dropzone.QUEUED;

  Dropzone.UPLOADING = "uploading";

  Dropzone.PROCESSING = Dropzone.UPLOADING;

  Dropzone.CANCELED = "canceled";

  Dropzone.ERROR = "error";

  Dropzone.SUCCESS = "success";


  /*
  
  Bugfix for iOS 6 and 7
  Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
  based on the work of https://github.com/stomita/ios-imagefile-megapixel
   */

  detectVerticalSquash = function(img) {
    var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
    iw = img.naturalWidth;
    ih = img.naturalHeight;
    canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = ih;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    data = ctx.getImageData(0, 0, 1, ih).data;
    sy = 0;
    ey = ih;
    py = ih;
    while (py > sy) {
      alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    ratio = py / ih;
    if (ratio === 0) {
      return 1;
    } else {
      return ratio;
    }
  };

  drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio;
    vertSquashRatio = detectVerticalSquash(img);
    return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
  };


  /*
   * contentloaded.js
   *
   * Author: Diego Perini (diego.perini at gmail.com)
   * Summary: cross-browser wrapper for DOMContentLoaded
   * Updated: 20101020
   * License: MIT
   * Version: 1.2
   *
   * URL:
   * http://javascript.nwbox.com/ContentLoaded/
   * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
   */

  contentLoaded = function(win, fn) {
    var add, doc, done, init, poll, pre, rem, root, top;
    done = false;
    top = true;
    doc = win.document;
    root = doc.documentElement;
    add = (doc.addEventListener ? "addEventListener" : "attachEvent");
    rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
    pre = (doc.addEventListener ? "" : "on");
    init = function(e) {
      if (e.type === "readystatechange" && doc.readyState !== "complete") {
        return;
      }
      (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        return fn.call(win, e.type || e);
      }
    };
    poll = function() {
      var e;
      try {
        root.doScroll("left");
      } catch (_error) {
        e = _error;
        setTimeout(poll, 50);
        return;
      }
      return init("poll");
    };
    if (doc.readyState !== "complete") {
      if (doc.createEventObject && root.doScroll) {
        try {
          top = !win.frameElement;
        } catch (_error) {}
        if (top) {
          poll();
        }
      }
      doc[add](pre + "DOMContentLoaded", init, false);
      doc[add](pre + "readystatechange", init, false);
      return win[add](pre + "load", init, false);
    }
  };

  Dropzone._autoDiscoverFunction = function() {
    if (Dropzone.autoDiscover) {
      return Dropzone.discover();
    }
  };

  contentLoaded(window, Dropzone._autoDiscoverFunction);

}).call(this);

},{}],21:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGF1bC9TaXRlcy9jb3JlZGV2NC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9iYWNrZW5kL2ZpbGUtYmFja2VuZC5qcyIsIi9Vc2Vycy9wYXVsL1NpdGVzL2NvcmVkZXY0L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL2Jvb3QvaW5kZXguanMiLCIvVXNlcnMvcGF1bC9TaXRlcy9jb3JlZGV2NC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb21wb25lbnRzL2J1bGstYWN0aW9ucy9pbmRleC5qcyIsIi9Vc2Vycy9wYXVsL1NpdGVzL2NvcmVkZXY0L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL2NvbXBvbmVudHMvZHJvcHpvbmUvaW5kZXguanMiLCIvVXNlcnMvcGF1bC9TaXRlcy9jb3JlZGV2NC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb21wb25lbnRzL2ZpbGUvaW5kZXguanMiLCIvVXNlcnMvcGF1bC9TaXRlcy9jb3JlZGV2NC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb21wb25lbnRzL3RleHQtZmllbGQvaW5kZXguanMiLCIvVXNlcnMvcGF1bC9TaXRlcy9jb3JlZGV2NC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb25zdGFudHMuanMiLCIvVXNlcnMvcGF1bC9TaXRlcy9jb3JlZGV2NC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zZWN0aW9ucy9hc3NldC1hZG1pbi9jb250cm9sbGVyLmpzIiwiL1VzZXJzL3BhdWwvU2l0ZXMvY29yZWRldjQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc2VjdGlvbnMvZWRpdG9yL2NvbnRyb2xsZXIuanMiLCIvVXNlcnMvcGF1bC9TaXRlcy9jb3JlZGV2NC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zZWN0aW9ucy9nYWxsZXJ5L2NvbnRyb2xsZXIuanMiLCIvVXNlcnMvcGF1bC9TaXRlcy9jb3JlZGV2NC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9jb25maWd1cmVTdG9yZS5qcyIsIi9Vc2Vycy9wYXVsL1NpdGVzL2NvcmVkZXY0L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL2dhbGxlcnkvYWN0aW9uLXR5cGVzLmpzIiwiL1VzZXJzL3BhdWwvU2l0ZXMvY29yZWRldjQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvZ2FsbGVyeS9hY3Rpb25zLmpzIiwiL1VzZXJzL3BhdWwvU2l0ZXMvY29yZWRldjQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvZ2FsbGVyeS9yZWR1Y2VyLmpzIiwiL1VzZXJzL3BhdWwvU2l0ZXMvY29yZWRldjQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvcXVldWVkLWZpbGVzL2FjdGlvbi10eXBlcy5qcyIsIi9Vc2Vycy9wYXVsL1NpdGVzL2NvcmVkZXY0L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL3F1ZXVlZC1maWxlcy9hY3Rpb25zLmpzIiwiL1VzZXJzL3BhdWwvU2l0ZXMvY29yZWRldjQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvcXVldWVkLWZpbGVzL3JlZHVjZXIuanMiLCIvVXNlcnMvcGF1bC9TaXRlcy9jb3JlZGV2NC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9yZWR1Y2VyLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvZHJvcHpvbmUvZGlzdC9kcm9wem9uZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC1sb2dnZXIvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztzQkNBYyxRQUFROzs7O3NCQUNILFFBQVE7Ozs7SUFFTixXQUFXO1dB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3Z1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBFdmVudHMgZnJvbSAnZXZlbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZUJhY2tlbmQgZXh0ZW5kcyBFdmVudHMge1xuXG5cdGNvbnN0cnVjdG9yKGdldEZpbGVzQnlQYXJlbnRJRF91cmwsIGdldEZpbGVzQnlTaWJsaW5nSURfdXJsLCBzZWFyY2hfdXJsLCB1cGRhdGVfdXJsLCBkZWxldGVfdXJsLCBsaW1pdCwgYnVsa0FjdGlvbnMsICRmb2xkZXIsIGN1cnJlbnRGb2xkZXIpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5nZXRGaWxlc0J5UGFyZW50SURfdXJsID0gZ2V0RmlsZXNCeVBhcmVudElEX3VybDtcblx0XHR0aGlzLmdldEZpbGVzQnlTaWJsaW5nSURfdXJsID0gZ2V0RmlsZXNCeVNpYmxpbmdJRF91cmw7XG5cdFx0dGhpcy5zZWFyY2hfdXJsID0gc2VhcmNoX3VybDtcblx0XHR0aGlzLnVwZGF0ZV91cmwgPSB1cGRhdGVfdXJsO1xuXHRcdHRoaXMuZGVsZXRlX3VybCA9IGRlbGV0ZV91cmw7XG5cdFx0dGhpcy5saW1pdCA9IGxpbWl0O1xuXHRcdHRoaXMuYnVsa0FjdGlvbnMgPSBidWxrQWN0aW9ucztcblx0XHR0aGlzLiRmb2xkZXIgPSAkZm9sZGVyO1xuXHRcdHRoaXMuZm9sZGVyID0gY3VycmVudEZvbGRlcjtcblxuXHRcdHRoaXMucGFnZSA9IDE7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZmV0Y2hcblx0ICogQHBhcmFtIG51bWJlciBpZFxuXHQgKiBAZGVzYyBGZXRjaGVzIGEgY29sbGVjdGlvbiBvZiBGaWxlcyBieSBQYXJlbnRJRC5cblx0ICovXG5cdGdldEZpbGVzQnlQYXJlbnRJRChpZCkge1xuXHRcdGlmICh0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5wYWdlID0gMTtcblxuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QoJ1BPU1QnLCB0aGlzLmdldEZpbGVzQnlQYXJlbnRJRF91cmwsIHsgaWQ6IGlkLCBsaW1pdDogdGhpcy5saW1pdCB9KS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uRmV0Y2hEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZ2V0RmlsZXNCeVNpYmxpbmdJRFxuXHQgKiBAcGFyYW0gbnVtYmVyIGlkIC0gdGhlIGlkIG9mIHRoZSBmaWxlIHRvIGdldCB0aGUgc2libGluZ3MgZnJvbS5cblx0ICogQGRlc2MgRmV0Y2hlcyBhIGNvbGxlY3Rpb24gb2Ygc2libGluZyBmaWxlcyBnaXZlbiBhbiBpZC5cblx0ICovXG5cdGdldEZpbGVzQnlTaWJsaW5nSUQoaWQpIHtcblx0XHRpZiAodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHR0aGlzLnBhZ2UgPSAxO1xuXG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdCgnUE9TVCcsIHRoaXMuZ2V0RmlsZXNCeVNpYmxpbmdJRF91cmwsIHsgaWQ6IGlkLCBsaW1pdDogdGhpcy5saW1pdCB9KS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uRmV0Y2hEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRzZWFyY2goKSB7XG5cdFx0dGhpcy5wYWdlID0gMTtcblxuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvblNlYXJjaERhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG1vcmUoKSB7XG5cdFx0dGhpcy5wYWdlKys7XG5cblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLnNlYXJjaF91cmwpLnRoZW4oKGpzb24pID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25Nb3JlRGF0YScsIGpzb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0bmF2aWdhdGUoZm9sZGVyKSB7XG5cdFx0dGhpcy5wYWdlID0gMTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblxuXHRcdHRoaXMucGVyc2lzdEZvbGRlckZpbHRlcihmb2xkZXIpO1xuXG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uTmF2aWdhdGVEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRwZXJzaXN0Rm9sZGVyRmlsdGVyKGZvbGRlcikge1xuXHRcdGlmIChmb2xkZXIuc3Vic3RyKC0xKSA9PT0gJy8nKSB7XG5cdFx0XHRmb2xkZXIgPSBmb2xkZXIuc3Vic3RyKDAsIGZvbGRlci5sZW5ndGggLSAxKTtcblx0XHR9XG5cblx0XHR0aGlzLiRmb2xkZXIudmFsKGZvbGRlcik7XG5cdH1cblxuXHQvKipcblx0ICogRGVsZXRlcyBmaWxlcyBvbiB0aGUgc2VydmVyIGJhc2VkIG9uIHRoZSBnaXZlbiBpZHNcblx0ICpcblx0ICogQHBhcmFtIGFycmF5IGlkcyAtIGFuIGFycmF5IG9mIGZpbGUgaWRzIHRvIGRlbGV0ZSBvbiB0aGUgc2VydmVyXG5cdCAqIEByZXR1cm5zIG9iamVjdCAtIHByb21pc2Vcblx0ICovXG5cdGRlbGV0ZShpZHMpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KCdERUxFVEUnLCB0aGlzLmRlbGV0ZV91cmwsIHtcblx0XHRcdCdpZHMnOiBpZHNcblx0XHR9KS50aGVuKCgpID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25EZWxldGVEYXRhJywgaWRzKTtcblx0XHR9KTtcblx0fVxuXG5cdGZpbHRlcihuYW1lLCB0eXBlLCBmb2xkZXIsIGNyZWF0ZWRGcm9tLCBjcmVhdGVkVG8sIG9ubHlTZWFyY2hJbkZvbGRlcikge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblx0XHR0aGlzLmNyZWF0ZWRGcm9tID0gY3JlYXRlZEZyb207XG5cdFx0dGhpcy5jcmVhdGVkVG8gPSBjcmVhdGVkVG87XG5cdFx0dGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIgPSBvbmx5U2VhcmNoSW5Gb2xkZXI7XG5cblx0XHR0aGlzLnNlYXJjaCgpO1xuXHR9XG5cblx0c2F2ZShpZCwgdmFsdWVzKSB7XG5cdFx0dmFyIHVwZGF0ZXMgPSB7IGlkIH07XG5cblx0XHR2YWx1ZXMuZm9yRWFjaChmaWVsZCA9PiB7XG5cdFx0XHR1cGRhdGVzW2ZpZWxkLm5hbWVdID0gZmllbGQudmFsdWU7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KCdQT1NUJywgdGhpcy51cGRhdGVfdXJsLCB1cGRhdGVzKS50aGVuKCgpID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25TYXZlRGF0YScsIGlkLCB1cGRhdGVzKTtcblx0XHR9KTtcblx0fVxuXG5cdHJlcXVlc3QobWV0aG9kLCB1cmwsIGRhdGEgPSB7fSkge1xuXHRcdGxldCBkZWZhdWx0cyA9IHtcblx0XHRcdCdsaW1pdCc6IHRoaXMubGltaXQsXG5cdFx0XHQncGFnZSc6IHRoaXMucGFnZSxcblx0XHR9O1xuXG5cdFx0aWYgKHRoaXMubmFtZSAmJiB0aGlzLm5hbWUudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMubmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm5hbWUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRGcm9tICYmIHRoaXMuY3JlYXRlZEZyb20udHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuY3JlYXRlZEZyb20gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkRnJvbSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY3JlYXRlZFRvICYmIHRoaXMuY3JlYXRlZFRvLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRUbyA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLmNyZWF0ZWRUbyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMub25seVNlYXJjaEluRm9sZGVyICYmIHRoaXMub25seVNlYXJjaEluRm9sZGVyLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm9ubHlTZWFyY2hJbkZvbGRlciA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5zaG93TG9hZGluZ0luZGljYXRvcigpO1xuXG5cdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHQndXJsJzogdXJsLFxuXHRcdFx0J3R5cGUnOiBtZXRob2QsIC8vIGNvbXBhdCB3aXRoIGpRdWVyeSAxLjdcblx0XHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHRcdCdkYXRhJzogJC5leHRlbmQoZGVmYXVsdHMsIGRhdGEpXG5cdFx0fSkuYWx3YXlzKCgpID0+IHtcblx0XHRcdHRoaXMuaGlkZUxvYWRpbmdJbmRpY2F0b3IoKTtcblx0XHR9KTtcblx0fVxuXG5cdHNob3dMb2FkaW5nSW5kaWNhdG9yKCkge1xuXHRcdCQoJy5jbXMtY29udGVudCwgLnVpLWRpYWxvZycpLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cdFx0JCgnLnVpLWRpYWxvZy1jb250ZW50JykuY3NzKCdvcGFjaXR5JywgJy4xJyk7XG5cdH1cblxuXHRoaWRlTG9hZGluZ0luZGljYXRvcigpIHtcblx0XHQkKCcuY21zLWNvbnRlbnQsIC51aS1kaWFsb2cnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXHRcdCQoJy51aS1kaWFsb2ctY29udGVudCcpLmNzcygnb3BhY2l0eScsICcxJyk7XG5cdH1cbn1cbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBjb25maWd1cmVTdG9yZSBmcm9tICcuLi9zdGF0ZS9jb25maWd1cmVTdG9yZSc7XG5pbXBvcnQgeyBzZXRSb3V0ZSB9IGZyb20gJy4uL3N0YXRlL2dhbGxlcnkvYWN0aW9ucyc7XG5pbXBvcnQgQXNzZXRBZG1pbkNvbnRhaW5lciBmcm9tICcuLi9zZWN0aW9ucy9hc3NldC1hZG1pbi9jb250cm9sbGVyJztcbmltcG9ydCB7IGRlZmF1bHQgYXMgR2FsbGVyeUNvbnRhaW5lciB9IGZyb20gJy4uL3NlY3Rpb25zL2dhbGxlcnkvY29udHJvbGxlcic7XG5pbXBvcnQgRWRpdG9yQ29udGFpbmVyIGZyb20gJy4uL3NlY3Rpb25zL2VkaXRvci9jb250cm9sbGVyJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxuZnVuY3Rpb24gZ2V0R2FsbGVyeVByb3BzKCkge1xuXHR2YXIgJGNvbXBvbmVudFdyYXBwZXIgPSAkKCcuYXNzZXQtZ2FsbGVyeScpLmZpbmQoJy5hc3NldC1nYWxsZXJ5LWNvbXBvbmVudC13cmFwcGVyJyksXG5cdFx0aW5pdGlhbEZvbGRlciA9ICRjb21wb25lbnRXcmFwcGVyLmRhdGEoJ2Fzc2V0LWdhbGxlcnktaW5pdGlhbC1mb2xkZXInKSxcblx0XHRjdXJyZW50Rm9sZGVyID0gaW5pdGlhbEZvbGRlcjtcblxuXHRyZXR1cm4ge1xuXHRcdGN1cnJlbnRfZm9sZGVyOiBjdXJyZW50Rm9sZGVyLFxuXHRcdGluaXRpYWxfZm9sZGVyOiBpbml0aWFsRm9sZGVyLFxuXHRcdG5hbWU6ICQoJy5hc3NldC1nYWxsZXJ5JykuZGF0YSgnYXNzZXQtZ2FsbGVyeS1uYW1lJylcblx0fTtcbn1cblxuJC5lbnR3aW5lKCdzcycsIGZ1bmN0aW9uKCQpIHtcblx0JCgnLmFzc2V0LWdhbGxlcnktY29tcG9uZW50LXdyYXBwZXInKS5lbnR3aW5lKHtcblx0XHRvbmFkZDogZnVuY3Rpb24gKCkge1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSBjb25maWd1cmVTdG9yZSgpO1xuXHRcdFx0Y29uc3QgZ2FsbGVyeVByb3BzID0gZ2V0R2FsbGVyeVByb3BzKCk7XG5cblx0XHRcdFJlYWN0RE9NLnJlbmRlcihcblx0XHRcdFx0PFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG5cdFx0XHRcdFx0PEFzc2V0QWRtaW5Db250YWluZXIgaW5pdGlhbEZvbGRlcj17dGhpcy5kYXRhKCdhc3NldC1nYWxsZXJ5LWluaXRpYWwtZm9sZGVyJyl9IGlkRnJvbVVSTD17dGhpcy5kYXRhKCdhc3NldC1nYWxsZXJ5LWlkLWZyb20tdXJsJyl9ID5cblx0XHRcdFx0XHRcdDxHYWxsZXJ5Q29udGFpbmVyIHsuLi5nYWxsZXJ5UHJvcHN9IC8+XG5cdFx0XHRcdFx0XHQ8RWRpdG9yQ29udGFpbmVyIC8+XG5cdFx0XHRcdFx0PC9Bc3NldEFkbWluQ29udGFpbmVyPlxuXHRcdFx0XHQ8L1Byb3ZpZGVyPixcblx0XHRcdFx0dGhpc1swXVxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gQ2F0Y2ggYW55IHJvdXRlcyB0aGF0IGFyZW4ndCBoYW5kbGVkIGJ5IGNvbXBvbmVudHMuXG5cdFx0XHR3aW5kb3cuc3Mucm91dGVyKCcqJywgKCkgPT4ge30pO1xuXHRcdH0sXG5cdFx0b25yZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpc1swXSk7XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFNpbHZlclN0cmlwZUNvbXBvbmVudCBmcm9tICdzaWx2ZXJzdHJpcGUtY29tcG9uZW50JztcbmltcG9ydCBSZWFjdFRlc3RVdGlscyBmcm9tICdyZWFjdC1hZGRvbnMtdGVzdC11dGlscyc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgYmluZEFjdGlvbkNyZWF0b3JzIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0ICogYXMgZ2FsbGVyeUFjdGlvbnMgZnJvbSAnLi4vLi4vc3RhdGUvZ2FsbGVyeS9hY3Rpb25zJztcbmltcG9ydCBpMThuIGZyb20gJ2kxOG4nO1xuXG5leHBvcnQgY2xhc3MgQnVsa0FjdGlvbnNDb21wb25lbnQgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5vbkNoYW5nZVZhbHVlID0gdGhpcy5vbkNoYW5nZVZhbHVlLmJpbmQodGhpcyk7XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR2YXIgJHNlbGVjdCA9ICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5kcm9wZG93bicpO1xuXG5cdFx0JHNlbGVjdC5jaG9zZW4oe1xuXHRcdFx0J2FsbG93X3NpbmdsZV9kZXNlbGVjdCc6IHRydWUsXG5cdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMjBcblx0XHR9KTtcblxuXHRcdC8vIENob3NlbiBzdG9wcyB0aGUgY2hhbmdlIGV2ZW50IGZyb20gcmVhY2hpbmcgUmVhY3Qgc28gd2UgaGF2ZSB0byBzaW11bGF0ZSBhIGNsaWNrLlxuXHRcdCRzZWxlY3QuY2hhbmdlKCgpID0+IFJlYWN0VGVzdFV0aWxzLlNpbXVsYXRlLmNsaWNrKCRzZWxlY3QuZmluZCgnOnNlbGVjdGVkJylbMF0pKTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5X19idWxrLWFjdGlvbnMgZmllbGRob2xkZXItc21hbGxcIj5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZ2FsbGVyeV9fYnVsay1hY3Rpb25zX19jb3VudGVyXCI+e3RoaXMuZ2V0U2VsZWN0ZWRGaWxlcygpLmxlbmd0aH08L2Rpdj5cblx0XHRcdHt0aGlzLnByb3BzLmdhbGxlcnkuYnVsa0FjdGlvbnMub3B0aW9ucy5tYXAoKG9wdGlvbiwgaSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT1cImdhbGxlcnlfX2J1bGstYWN0aW9uc19hY3Rpb24gZm9udC1pY29uLXRyYXNoIHNzLXVpLWJ1dHRvbiB1aS1jb3JuZXItYWxsXCIga2V5PXtpfSBvbkNsaWNrPXt0aGlzLm9uQ2hhbmdlVmFsdWV9IHZhbHVlPXtvcHRpb24udmFsdWV9PntvcHRpb24ubGFiZWx9PC9idXR0b24+O1xuXHRcdFx0fSl9XG5cdFx0PC9kaXY+O1xuXHR9XG5cblx0Z2V0T3B0aW9uQnlWYWx1ZSh2YWx1ZSkge1xuXHRcdC8vIFVzaW5nIGZvciBsb29wIGJlY2F1c2UgSUUxMCBkb2Vzbid0IGhhbmRsZSAnZm9yIG9mJyxcblx0XHQvLyB3aGljaCBnZXRzIHRyYW5zY29tcGlsZWQgaW50byBhIGZ1bmN0aW9uIHdoaWNoIHVzZXMgU3ltYm9sLFxuXHRcdC8vIHRoZSB0aGluZyBJRTEwIGRpZXMgb24uXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmdhbGxlcnkuYnVsa0FjdGlvbnMub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0aWYgKHRoaXMucHJvcHMuZ2FsbGVyeS5idWxrQWN0aW9ucy5vcHRpb25zW2ldLnZhbHVlID09PSB2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wcm9wcy5nYWxsZXJ5LmJ1bGtBY3Rpb25zLm9wdGlvbnNbaV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbiAgICBcbiAgICBnZXRTZWxlY3RlZEZpbGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5nYWxsZXJ5LnNlbGVjdGVkRmlsZXM7XG4gICAgfVxuXG5cdGFwcGx5QWN0aW9uKHZhbHVlKSB7XG5cdFx0Ly8gV2Ugb25seSBoYXZlICdkZWxldGUnIHJpZ2h0IG5vdy4uLlxuXHRcdHN3aXRjaCAodmFsdWUpIHtcblx0XHRcdGNhc2UgJ2RlbGV0ZSc6XG5cdFx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5kZWxldGUodGhpcy5nZXRTZWxlY3RlZEZpbGVzKCkpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdG9uQ2hhbmdlVmFsdWUoZXZlbnQpIHtcblx0XHR2YXIgb3B0aW9uID0gdGhpcy5nZXRPcHRpb25CeVZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG5cblx0XHQvLyBNYWtlIHN1cmUgYSB2YWxpZCBvcHRpb24gaGFzIGJlZW4gc2VsZWN0ZWQuXG5cdFx0aWYgKG9wdGlvbiA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb24uZGVzdHJ1Y3RpdmUgPT09IHRydWUpIHtcblx0XHRcdGlmIChjb25maXJtKGkxOG4uc3ByaW50ZihpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5CVUxLX0FDVElPTlNfQ09ORklSTScpLCBvcHRpb24ubGFiZWwpKSkge1xuXHRcdFx0XHR0aGlzLmFwcGx5QWN0aW9uKG9wdGlvbi52YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYXBwbHlBY3Rpb24ob3B0aW9uLnZhbHVlKTtcblx0XHR9XG5cblx0XHQvLyBSZXNldCB0aGUgZHJvcGRvd24gdG8gaXQncyBwbGFjZWhvbGRlciB2YWx1ZS5cblx0XHQkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKCcuZHJvcGRvd24nKS52YWwoJycpLnRyaWdnZXIoJ2xpc3p0OnVwZGF0ZWQnKTtcblx0fVxufTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdHJldHVybiB7XG5cdFx0Z2FsbGVyeTogc3RhdGUuYXNzZXRBZG1pbi5nYWxsZXJ5XG5cdH1cbn1cblxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XG5cdHJldHVybiB7XG5cdFx0YWN0aW9uczogYmluZEFjdGlvbkNyZWF0b3JzKGdhbGxlcnlBY3Rpb25zLCBkaXNwYXRjaClcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShCdWxrQWN0aW9uc0NvbXBvbmVudCk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgU2lsdmVyU3RyaXBlQ29tcG9uZW50IGZyb20gJ3NpbHZlcnN0cmlwZS1jb21wb25lbnQnO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgRHJvcHpvbmUgZnJvbSAnZHJvcHpvbmUnO1xuaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vLi4vY29uc3RhbnRzLmpzJztcblxuY2xhc3MgRHJvcHpvbmVDb21wb25lbnQgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHRoaXMuZHJvcHpvbmUgPSBudWxsO1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHN1cGVyLmNvbXBvbmVudERpZE1vdW50KCk7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0gdGhpcy5nZXREZWZhdWx0T3B0aW9ucygpO1xuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnVwbG9hZEJ1dHRvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnMuY2xpY2thYmxlID0gJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmRyb3B6b25lLWNvbXBvbmVudF9fdXBsb2FkLWJ1dHRvbicpWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcm9wem9uZSA9IG5ldyBEcm9wem9uZShSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSwgT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIHRoaXMucHJvcHMub3B0aW9ucykpO1xuXG4gICAgICAgIC8vIFNldCB0aGUgdXNlciB3YXJuaW5nIGRpc3BsYXllZCB3aGVuIGEgdXNlciBhdHRlbXB0cyB0byByZW1vdmUgYSBmaWxlLlxuICAgICAgICAvLyBJZiB0aGUgcHJvcHMgaGFzbid0IGJlZW4gcGFzc2VkIHRoZXJlIHdpbGwgYmUgbm8gd2FybmluZyB3aGVuIHJlbW92aW5nIGZpbGVzLlxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMucHJvbXB0T25SZW1vdmUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnNldFByb21wdE9uUmVtb3ZlKHRoaXMucHJvcHMucHJvbXB0T25SZW1vdmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBkcm9wem9uZSBldmVudCBsaXN0ZW5lcnMuXG4gICAgICAgIHRoaXMuZHJvcHpvbmUuZGlzYWJsZSgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IFsnZHJvcHpvbmUtY29tcG9uZW50J107XG5cbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZS5wdXNoKCdkcmFnZ2luZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWUuam9pbignICcpfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy51cGxvYWRCdXR0b24gJiZcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2Ryb3B6b25lLWNvbXBvbmVudF9fdXBsb2FkLWJ1dHRvbiBbIHNzLXVpLWJ1dHRvbiBmb250LWljb24tdXBsb2FkIF0nIHR5cGU9J2J1dHRvbic+e2kxOG4uX3QoXCJBc3NldEdhbGxlcnlGaWVsZC5EUk9QWk9ORV9VUExPQURcIil9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZGVmYXVsdCBvcHRpaW9ucyB0byBpbnN0YW5jaWF0ZSBkcm9wem9uZSB3aXRoLlxuICAgICAqXG4gICAgICogQHJldHVybiBvYmplY3RcbiAgICAgKi9cbiAgICBnZXREZWZhdWx0T3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIFdlIGhhbmRsZSB0aGUgcXVldWUgcHJvY2Vzc2luZyBvdXJzZWxmIGluIHRoZSBGaWxlUmVhZGVyIGNhbGxiYWNrLiBTZWUgYHRoaXMuaGFuZGxlQWRkZWRGaWxlYFxuICAgICAgICAgICAgYXV0b1Byb2Nlc3NRdWV1ZTogZmFsc2UsXG5cbiAgICAgICAgICAgIC8vIEJ5IGRlZmF1bHQgRHJvcHpvbmUgYWRkcyBtYXJrdXAgdG8gdGhlIERPTSBmb3IgZGlzcGxheWluZyBhIHRodW1ibmFpbCBwcmV2aWV3LlxuICAgICAgICAgICAgLy8gSGVyZSB3ZSdyZSByZWxwYWNpbmcgdGhhdCBkZWZhdWx0IGJlaGF2aW91ciB3aXRoIG91ciBvd24gUmVhY3QgLyBSZWR1eCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICAgIGFkZGVkZmlsZTogdGhpcy5oYW5kbGVBZGRlZEZpbGUuYmluZCh0aGlzKSxcblxuICAgICAgICAgICAgLy8gV2hlbiB0aGUgdXNlciBkcmFncyBhIGZpbGUgaW50byB0aGUgZHJvcHpvbmUuXG4gICAgICAgICAgICBkcmFnZW50ZXI6IHRoaXMuaGFuZGxlRHJhZ0VudGVyLmJpbmQodGhpcyksXG5cbiAgICAgICAgICAgIC8vIFdoZW4gdGhlIHVzZXIncyBjdXJzb3IgbGVhdmVzIHRoZSBkcm9wem9uZSB3aGlsZSBkcmFnZ2luZyBhIGZpbGUuXG4gICAgICAgICAgICBkcmFnbGVhdmU6IHRoaXMuaGFuZGxlRHJhZ0xlYXZlLmJpbmQodGhpcyksXG5cbiAgICAgICAgICAgIC8vIFdoZW4gdGhlIHVzZXIgZHJvcHMgYSBmaWxlIG9udG8gdGhlIGRyb3B6b25lLlxuICAgICAgICAgICAgZHJvcDogdGhpcy5oYW5kbGVEcm9wLmJpbmQodGhpcyksXG5cbiAgICAgICAgICAgIC8vIFdoZW5ldmVyIHRoZSBmaWxlIHVwbG9hZCBwcm9ncmVzcyBjaGFuZ2VzXG4gICAgICAgICAgICB1cGxvYWRwcm9ncmVzczogdGhpcy5oYW5kbGVVcGxvYWRQcm9ncmVzcy5iaW5kKHRoaXMpLFxuXG4gICAgICAgICAgICAvLyBUaGUgdGV4dCB1c2VkIGJlZm9yZSBhbnkgZmlsZXMgYXJlIGRyb3BwZWRcbiAgICAgICAgICAgIGRpY3REZWZhdWx0TWVzc2FnZTogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfREVGQVVMVF9NRVNTQUdFJyksXG5cbiAgICAgICAgICAgIC8vIFRoZSB0ZXh0IHRoYXQgcmVwbGFjZXMgdGhlIGRlZmF1bHQgbWVzc2FnZSB0ZXh0IGl0IHRoZSBicm93c2VyIGlzIG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgICAgIGRpY3RGYWxsYmFja01lc3NhZ2U6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRST1BaT05FX0ZBTExCQUNLX01FU1NBR0UnKSxcblxuICAgICAgICAgICAgLy8gVGhlIHRleHQgdGhhdCB3aWxsIGJlIGFkZGVkIGJlZm9yZSB0aGUgZmFsbGJhY2sgZm9ybVxuICAgICAgICAgICAgLy8gSWYgbnVsbCwgbm8gdGV4dCB3aWxsIGJlIGFkZGVkIGF0IGFsbC5cbiAgICAgICAgICAgIGRpY3RGYWxsYmFja1RleHQ6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRST1BaT05FX0ZBTExCQUNLX1RFWFQnKSxcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGZpbGUgZG9lc24ndCBtYXRjaCB0aGUgZmlsZSB0eXBlLlxuICAgICAgICAgICAgZGljdEludmFsaWRGaWxlVHlwZTogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfSU5WQUxJRF9GSUxFX1RZUEUnKSxcblxuICAgICAgICAgICAgLy8gSWYgdGhlIHNlcnZlciByZXNwb25zZSB3YXMgaW52YWxpZC5cbiAgICAgICAgICAgIGRpY3RSZXNwb25zZUVycm9yOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5EUk9QWk9ORV9SRVNQT05TRV9FUlJPUicpLFxuXG4gICAgICAgICAgICAvLyBJZiB1c2VkLCB0aGUgdGV4dCB0byBiZSB1c2VkIGZvciB0aGUgY2FuY2VsIHVwbG9hZCBsaW5rLlxuICAgICAgICAgICAgZGljdENhbmNlbFVwbG9hZDogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfQ0FOQ0VMX1VQTE9BRCcpLFxuXG4gICAgICAgICAgICAvLyBJZiB1c2VkLCB0aGUgdGV4dCB0byBiZSB1c2VkIGZvciBjb25maXJtYXRpb24gd2hlbiBjYW5jZWxsaW5nIHVwbG9hZC5cbiAgICAgICAgICAgIGRpY3RDYW5jZWxVcGxvYWRDb25maXJtYXRpb246IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRST1BaT05FX0NBTkNFTF9VUExPQURfQ09ORklSTUFUSU9OJyksXG5cbiAgICAgICAgICAgIC8vIElmIHVzZWQsIHRoZSB0ZXh0IHRvIGJlIHVzZWQgdG8gcmVtb3ZlIGEgZmlsZS5cbiAgICAgICAgICAgIGRpY3RSZW1vdmVGaWxlOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5EUk9QWk9ORV9SRU1PVkVfRklMRScpLFxuXG4gICAgICAgICAgICAvLyBEaXNwbGF5ZWQgd2hlbiB0aGUgbWF4RmlsZXMgaGF2ZSBiZWVuIGV4Y2VlZGVkXG4gICAgICAgICAgICAvLyBZb3UgY2FuIHVzZSB7e21heEZpbGVzfX0gaGVyZSwgd2hpY2ggd2lsbCBiZSByZXBsYWNlZCBieSB0aGUgb3B0aW9uLlxuICAgICAgICAgICAgZGljdE1heEZpbGVzRXhjZWVkZWQ6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRST1BaT05FX01BWF9GSUxFU19FWENFRURFRCcpLFxuXG4gICAgICAgICAgICAvLyBXaGVuIGEgZmlsZSB1cGxvYWQgZmFpbHMuXG4gICAgICAgICAgICBlcnJvcjogdGhpcy5oYW5kbGVFcnJvci5iaW5kKHRoaXMpLFxuXG4gICAgICAgICAgICAvLyBXaGVuIGZpbGUgZmlsZSBpcyBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICBzZW5kaW5nOiB0aGlzLmhhbmRsZVNlbmRpbmcuYmluZCh0aGlzKSxcblxuICAgICAgICAgICAgLy8gV2hlbiBhIGZpbGUgdXBsb2FkIHN1Y2NlZWRzLlxuICAgICAgICAgICAgc3VjY2VzczogdGhpcy5oYW5kbGVTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICAgICAgICAgIHRodW1ibmFpbEhlaWdodDogMTUwLFxuXG4gICAgICAgICAgICB0aHVtYm5haWxXaWR0aDogMjAwXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGZpbGUncyBjYXRlZ29yeSBiYXNlZCBvbiBpdHMgdHlwZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdHJpbmcgZmlsZVR5cGUgLSBGb3IgZXhhbXBsZSAnaW1hZ2UvanBnJy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gc3RyaW5nXG4gICAgICovXG4gICAgZ2V0RmlsZUNhdGVnb3J5KGZpbGVUeXBlKSB7XG4gICAgICAgIHJldHVybiBmaWxlVHlwZS5zcGxpdCgnLycpWzBdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgdHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgZHJhZ3MgYSBmaWxlIGludG8gdGhlIGRyb3B6b25lLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9iamVjdCBldmVudFxuICAgICAqL1xuICAgIGhhbmRsZURyYWdFbnRlcihldmVudCkge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5oYW5kbGVEcmFnRW50ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuaGFuZGxlRHJhZ0VudGVyKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgdHJpZ2dlcmVkIHdoZW4gYSB1c2VyJ3MgY3Vyc2VyIGxlYXZlcyB0aGUgZHJvcHpvbmUgd2hpbGUgZHJhZ2dpbmcgYSBmaWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9iamVjdCBldmVudFxuICAgICAqL1xuICAgIGhhbmRsZURyYWdMZWF2ZShldmVudCkge1xuICAgICAgICBjb25zdCBjb21wb25lbnROb2RlID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcyk7XG5cbiAgICAgICAgLy8gRXZlbnQgcHJvcGFnYXRpb24gKGV2ZW50cyBidWJibGluZyB1cCBmcm9tIGRlY2VuZGVudCBlbGVtZW50cykgbWVhbnMgdGhlIGBkcmFnTGVhdmVgXG4gICAgICAgIC8vIGV2ZW50IGdldHMgdHJpZ2dlcmVkIG9uIHRoZSBkcm9wem9uZS4gSGVyZSB3ZSdyZSBpZ25vcmluZyBldmVudHMgdGhhdCBkb24ndCBvcmlnaW5hdGUgZnJvbSB0aGUgZHJvcHpvbmUgbm9kZS5cbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCAhPT0gY29tcG9uZW50Tm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLmhhbmRsZURyYWdMZWF2ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVEcmFnTGVhdmUoZXZlbnQsIGNvbXBvbmVudE5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciB3aGVuIGEgZmlsZSdzIHVwbG9hZCBwcm9ncmVzcyBjaGFuZ2VzLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9iamVjdCBmaWxlIC0gRmlsZSBpbnRlcmZhY2UuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVxuICAgICAqIEBwYXJhbSBpbnRlZ2VyIHByb2dyZXNzIC0gdGhlIHVwbG9hZCBwcm9ncmVzcyBwZXJjZW50YWdlXG4gICAgICogQHBhcmFtIGludGVnZXIgYnl0ZXNTZW50IC0gdG90YWwgYnl0ZXNTZW50XG4gICAgICovXG4gICAgaGFuZGxlVXBsb2FkUHJvZ3Jlc3MoZmlsZSwgcHJvZ3Jlc3MsIGJ5dGVzU2VudCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMuaGFuZGxlVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuaGFuZGxlVXBsb2FkUHJvZ3Jlc3MoZmlsZSwgcHJvZ3Jlc3MsIGJ5dGVzU2VudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIHRyaWdnZXJlZCB3aGVuIHRoZSB1c2VyIGRyb3BzIGEgZmlsZSBvbiB0aGUgZHJvcHpvbmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb2JqZWN0IGV2ZW50XG4gICAgICovXG4gICAgaGFuZGxlRHJvcChldmVudCkge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMuaGFuZGxlRHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVEcm9wKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCBqdXN0IGJlZm9yZSB0aGUgZmlsZSBpcyBzZW50LiBHZXRzIHRoZSBgeGhyYCBvYmplY3QgYXMgc2Vjb25kIHBhcmFtZXRlcixcbiAgICAgKiBzbyB5b3UgY2FuIG1vZGlmeSBpdCAoZm9yIGV4YW1wbGUgdG8gYWRkIGEgQ1NSRiB0b2tlbikgYW5kIGEgYGZvcm1EYXRhYCBvYmplY3QgdG8gYWRkIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb2JqZWN0IGZpbGUgLSBGaWxlIGludGVyZmFjZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlXG4gICAgICogQHBhcmFtIG9iamVjdCB4aHJcbiAgICAgKiBAcGFyYW0gb2JqZWN0IGZvcm1EYXRhIC0gRm9ybURhdGEgaW50ZXJmYWNlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Zvcm1EYXRhXG4gICAgICovXG4gICAgaGFuZGxlU2VuZGluZyhmaWxlLCB4aHIsIGZvcm1EYXRhKSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnU2VjdXJpdHlJRCcsIHRoaXMucHJvcHMuc2VjdXJpdHlJRCk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZm9sZGVySUQnLCB0aGlzLnByb3BzLmZvbGRlcklEKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMuaGFuZGxlU2VuZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVTZW5kaW5nKGZpbGUsIHhociwgZm9ybURhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgZmlsZXMgYmVpbmcgYWRkZWQuIENhbGxlZCBiZWZvcmUgdGhlIHJlcXVlc3QgaXMgbWFkZSB0byB0aGUgc2VydmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9iamVjdCBmaWxlIC0gRmlsZSBpbnRlcmZhY2UuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVxuICAgICAqL1xuICAgIGhhbmRsZUFkZGVkRmlsZShmaWxlKSB7XG4gICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICBcbiAgICAgICAgLy8gVGhlIHF1ZXVlZEF0VGltZSBpcyB1c2VkIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IGZpbGUgd2hpbGUgaXQncyBpbiB0aGUgcXVldWUuXG4gICAgICAgIGNvbnN0IHF1ZXVlZEF0VGltZSA9IERhdGUubm93KCk7XG5cbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgdXBsb2FkcyBtdWx0aXBsZSBsYXJnZSBpbWFnZXMsIHdlIGNvdWxkIHJ1biBpbnRvIG1lbW9yeSBpc3N1ZXNcbiAgICAgICAgICAgIC8vIGJ5IHNpbXBseSB1c2luZyB0aGUgYGV2ZW50LnRhcmdldC5yZXN1bHRgIGRhdGEgVVJJIGFzIHRoZSB0aHVtYm5haWwgaW1hZ2UuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gVG8gZ2V0IGF2b2lkIHRoaXMgd2UncmUgY3JlYXRpbmcgYSBjYW52YXMsIHVzaW5nIHRoZSBkcm9wem9uZSB0aHVtYm5haWwgZGltZW5zaW9ucyxcbiAgICAgICAgICAgIC8vIGFuZCB1c2luZyB0aGUgY2FudmFzIGRhdGEgVVJJIGFzIHRoZSB0aHVtYm5haWwgaW1hZ2UgaW5zdGVhZC5cblxuICAgICAgICAgICAgdmFyIHRodW1ibmFpbFVSTCA9ICcnO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRGaWxlQ2F0ZWdvcnkoZmlsZS50eXBlKSA9PT0gJ2ltYWdlJykge1xuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSxcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyksXG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpbWcuc3JjID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcblxuICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSB0aGlzLmRyb3B6b25lLm9wdGlvbnMudGh1bWJuYWlsV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmRyb3B6b25lLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRodW1ibmFpbFVSTCA9IGNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVBZGRlZEZpbGUoe1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmRyb3B6b25lLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuZHJvcHpvbmUub3B0aW9ucy50aHVtYm5haWxXaWR0aFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogdGhpcy5nZXRGaWxlQ2F0ZWdvcnkoZmlsZS50eXBlKSxcbiAgICAgICAgICAgICAgICBmaWxlbmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgICAgICAgIHF1ZXVlZEF0VGltZTogcXVldWVkQXRUaW1lLFxuICAgICAgICAgICAgICAgIHNpemU6IGZpbGUuc2l6ZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogZmlsZS5uYW1lLFxuICAgICAgICAgICAgICAgIHR5cGU6IGZpbGUudHlwZSxcbiAgICAgICAgICAgICAgICB1cmw6IHRodW1ibmFpbFVSTFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZHJvcHpvbmUucHJvY2Vzc0ZpbGUoZmlsZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICBmaWxlLl9xdWV1ZWRBdFRpbWUgPSBxdWV1ZWRBdFRpbWU7XG5cbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgZmFpbGVkIHVwbG9hZHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb2JqZWN0IGZpbGUgLSBGaWxlIGludGVyZmFjZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlXG4gICAgICogQHBhcmFtIHN0cmluZyBlcnJvck1lc3NhZ2VcbiAgICAgKi9cbiAgICBoYW5kbGVFcnJvcihmaWxlLCBlcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLmhhbmRsZVNlbmRpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuaGFuZGxlRXJyb3IoZmlsZSwgZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIHN1Y2Nlc3NmdWxseSB1cGxvYWQgZmlsZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb2JqZWN0IGZpbGUgLSBGaWxlIGludGVyZmFjZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlXG4gICAgICovXG4gICAgaGFuZGxlU3VjY2VzcyhmaWxlKSB7XG4gICAgICAgIHRoaXMucHJvcHMuaGFuZGxlU3VjY2VzcyhmaWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHRleHQgZGlzcGxheWVkIHdoZW4gYSB1c2VyIHRyaWVzIHRvIHJlbW92ZSBhIGZpbGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RyaW5nIHVzZXJQcm9tcHQgLSBUaGUgbWVzc2FnZSB0byBkaXNwbGF5LlxuICAgICAqL1xuICAgIHNldFByb21wdE9uUmVtb3ZlKHVzZXJQcm9tcHQpIHtcbiAgICAgICAgdGhpcy5kcm9wem9uZS5vcHRpb25zLmRpY3RSZW1vdmVGaWxlQ29uZmlybWF0aW9uID0gdXNlclByb21wdDtcbiAgICB9XG5cbn1cblxuRHJvcHpvbmVDb21wb25lbnQucHJvcFR5cGVzID0ge1xuICAgIGZvbGRlcklEOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaGFuZGxlQWRkZWRGaWxlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGhhbmRsZURyYWdFbnRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgaGFuZGxlRHJhZ0xlYXZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBoYW5kbGVEcm9wOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBoYW5kbGVFcnJvcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoYW5kbGVTZW5kaW5nOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBoYW5kbGVTdWNjZXNzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgcHJvbXB0T25SZW1vdmU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgc2VjdXJpdHlJRDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHVwbG9hZEJ1dHRvbjogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbn07XG5cbkRyb3B6b25lQ29tcG9uZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgICB1cGxvYWRCdXR0b246IHRydWVcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERyb3B6b25lQ29tcG9uZW50O1xuIiwiaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBpMThuIGZyb20gJ2kxOG4nO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjb25zdGFudHMgZnJvbSAnLi4vLi4vY29uc3RhbnRzJztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5cbmNsYXNzIEZpbGVDb21wb25lbnQgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuaGFuZGxlVG9nZ2xlU2VsZWN0ID0gdGhpcy5oYW5kbGVUb2dnbGVTZWxlY3QuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZURlbGV0ZSA9IHRoaXMuaGFuZGxlRGVsZXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVBY3RpdmF0ZSA9IHRoaXMuaGFuZGxlQWN0aXZhdGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUtleURvd24gPSB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUNhbmNlbFVwbG9hZCA9IHRoaXMuaGFuZGxlQ2FuY2VsVXBsb2FkLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5wcmV2ZW50Rm9jdXMgPSB0aGlzLnByZXZlbnRGb2N1cy5iaW5kKHRoaXMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdyYXBwZXIgYXJvdW5kIHRoaXMucHJvcHMuaGFuZGxlQWN0aXZhdGVcblx0ICpcblx0ICogQHBhcmFtIG9iamVjdCBldmVudCAtIEV2ZW50IG9iamVjdC5cblx0ICovXG5cdGhhbmRsZUFjdGl2YXRlKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0dGhpcy5wcm9wcy5oYW5kbGVBY3RpdmF0ZShldmVudCwgdGhpcy5wcm9wcy5pdGVtKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXcmFwcGVyIGFyb3VuZCB0aGlzLnByb3BzLmhhbmRsZVRvZ2dsZVNlbGVjdFxuXHQgKlxuXHQgKiBAcGFyYW0gb2JqZWN0IGV2ZW50IC0gRXZlbnQgb2JqZWN0LlxuXHQgKi9cblx0aGFuZGxlVG9nZ2xlU2VsZWN0KGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0dGhpcy5wcm9wcy5oYW5kbGVUb2dnbGVTZWxlY3QoZXZlbnQsIHRoaXMucHJvcHMuaXRlbSk7XG5cdH1cblxuXHQvKipcblx0ICogV3JhcHBlciBhcm91bmQgdGhpcy5wcm9wcy5oYW5kbGVEZWxldGVcblx0ICpcblx0ICogQHBhcmFtIG9iamVjdCBldmVudCAtIEV2ZW50IG9iamVjdC5cblx0ICovXG5cdGhhbmRsZURlbGV0ZShldmVudCkge1xuXHRcdHRoaXMucHJvcHMuaGFuZGxlRGVsZXRlKGV2ZW50LCB0aGlzLnByb3BzLml0ZW0pO1xuXHR9XG5cblx0Z2V0VGh1bWJuYWlsU3R5bGVzKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0uY2F0ZWdvcnkgPT09ICdpbWFnZScpIHtcblx0XHRcdHJldHVybiB7J2JhY2tncm91bmRJbWFnZSc6ICd1cmwoJyArIHRoaXMucHJvcHMuaXRlbS51cmwgKyAnKSd9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGNvbXBvbmVudCBoYXMgYW4gZXJyb3Igc2V0LlxuXHQgKlxuXHQgKiBAcmV0dXJuIGJvb2xlYW5cblx0ICovXG5cdGhhc0Vycm9yKCkge1xuXHRcdHZhciBoYXNFcnJvciA9IGZhbHNlO1xuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodGhpcy5wcm9wcy5tZXNzYWdlcykpIHtcblx0XHRcdGhhc0Vycm9yID0gdGhpcy5wcm9wcy5tZXNzYWdlcy5maWx0ZXIobWVzc2FnZSA9PiB7XG5cdFx0XHRcdHJldHVybiBtZXNzYWdlLnR5cGUgPT09ICdlcnJvcidcblx0XHRcdH0pLmxlbmd0aCA+IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhhc0Vycm9yO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgbWFya3VwIGZvciBhbiBlcnJvciBtZXNzYWdlIGlmIG9uZSBpcyBzZXQuXG5cdCAqL1xuXHRnZXRFcnJvck1lc3NhZ2UoKSB7XG5cdFx0aWYgKHRoaXMuaGFzRXJyb3IoKSkge1xuXHRcdFx0cmV0dXJuIDxzcGFuIGNsYXNzTmFtZT0naXRlbV9fZXJyb3ItbWVzc2FnZSc+e3RoaXMucHJvcHMubWVzc2FnZXNbMF0udmFsdWV9PC9zcGFuPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGdldFRodW1ibmFpbENsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIHRodW1ibmFpbENsYXNzTmFtZXMgPSBbJ2l0ZW1fX3RodW1ibmFpbCddO1xuXG5cdFx0aWYgKHRoaXMuaXNJbWFnZVNtYWxsZXJUaGFuVGh1bWJuYWlsKCkpIHtcblx0XHRcdHRodW1ibmFpbENsYXNzTmFtZXMucHVzaCgnaXRlbV9fdGh1bWJuYWlsLS1zbWFsbCcpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aHVtYm5haWxDbGFzc05hbWVzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGdldEl0ZW1DbGFzc05hbWVzKCkge1xuXHRcdHZhciBpdGVtQ2xhc3NOYW1lcyA9IFtgaXRlbSBpdGVtLS0ke3RoaXMucHJvcHMuaXRlbS5jYXRlZ29yeX1gXTtcblxuXHRcdGlmICh0aGlzLnByb3BzLnNlbGVjdGVkKSB7XG5cdFx0XHRpdGVtQ2xhc3NOYW1lcy5wdXNoKCdpdGVtLS1zZWxlY3RlZCcpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmhhc0Vycm9yKCkpIHtcblx0XHRcdGl0ZW1DbGFzc05hbWVzLnB1c2goJ2l0ZW0tLWVycm9yJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW1DbGFzc05hbWVzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlzSW1hZ2VTbWFsbGVyVGhhblRodW1ibmFpbCgpIHtcblx0XHRsZXQgZGltZW5zaW9ucyA9IHRoaXMucHJvcHMuaXRlbS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnM7XG5cblx0XHRyZXR1cm4gZGltZW5zaW9ucy5oZWlnaHQgPCBjb25zdGFudHMuVEhVTUJOQUlMX0hFSUdIVCAmJiBkaW1lbnNpb25zLndpZHRoIDwgY29uc3RhbnRzLlRIVU1CTkFJTF9XSURUSDtcblx0fVxuXG5cdGhhbmRsZUtleURvd24oZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvL1N0b3AgcGFnZSBzY3JvbGxpbmcgaWYgc3BhY2VLZXkgaXMgcHJlc3NlZFxuXG5cdFx0Ly9JZiBzcGFjZSBpcyBwcmVzc2VkLCBzZWxlY3QgZmlsZVxuXHRcdGlmICh0aGlzLnByb3BzLnNwYWNlS2V5ID09PSBldmVudC5rZXlDb2RlKSB7XG5cdFx0XHR0aGlzLmhhbmRsZVRvZ2dsZVNlbGVjdChldmVudCk7XG5cdFx0fVxuXG5cdFx0Ly9JZiByZXR1cm4gaXMgcHJlc3NlZCwgbmF2aWdhdGUgZm9sZGVyXG5cdFx0aWYgKHRoaXMucHJvcHMucmV0dXJuS2V5ID09PSBldmVudC5rZXlDb2RlKSB7XG5cdFx0XHR0aGlzLmhhbmRsZUFjdGl2YXRlKGV2ZW50LCB0aGlzLnByb3BzLml0ZW0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBBdm9pZHMgdGhlIGJyb3dzZXIncyBkZWZhdWx0IGZvY3VzIHN0YXRlIHdoZW4gc2VsZWN0aW5nIGFuIGl0ZW0uXG5cdCAqXG5cdCAqIEBwYXJhbSBvYmplY3QgZXZlbnQgLSBFdmVudCBvYmplY3QuXG5cdCAqL1xuXHRwcmV2ZW50Rm9jdXMoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0aGFuZGxlQ2FuY2VsVXBsb2FkKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XG5cdFx0aWYgKHRoaXMuaGFzRXJyb3IoKSkge1xuXHRcdFx0dGhpcy5wcm9wcy5oYW5kbGVSZW1vdmVFcnJvcmVkVXBsb2FkKHRoaXMucHJvcHMuaXRlbSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucHJvcHMuaGFuZGxlQ2FuY2VsVXBsb2FkKHRoaXMucHJvcHMuaXRlbSk7XG5cdFx0fVxuXHR9XG5cdFxuXHRnZXRQcm9ncmVzc0JhcigpIHtcblx0XHR2YXIgcHJvZ3Jlc3NCYXI7XG5cblx0XHRjb25zdCBwcm9ncmVzc0JhclByb3BzID0ge1xuXHRcdFx0Y2xhc3NOYW1lOiAnaXRlbV9fdXBsb2FkLXByb2dyZXNzX19iYXInLFxuXHRcdFx0c3R5bGU6IHtcblx0XHRcdFx0d2lkdGg6IGAke3RoaXMucHJvcHMuaXRlbS5wcm9ncmVzc30lYFxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAoIXRoaXMuaGFzRXJyb3IoKSAmJiB0aGlzLnByb3BzLnVwbG9hZGluZykge1xuXHRcdFx0cHJvZ3Jlc3NCYXIgPSA8ZGl2IGNsYXNzTmFtZT0naXRlbV9fdXBsb2FkLXByb2dyZXNzJz48ZGl2IHsuLi5wcm9ncmVzc0JhclByb3BzfT48L2Rpdj48L2Rpdj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb2dyZXNzQmFyO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHZhciBhY3Rpb25CdXR0b247XG5cblx0XHRpZiAodGhpcy5wcm9wcy51cGxvYWRpbmcpIHtcblx0XHRcdGFjdGlvbkJ1dHRvbiA9IDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1jYW5jZWwgWyBmb250LWljb24tY2FuY2VsIF0nXG5cdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0dGl0bGU9e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlNFTEVDVCcpfVxuXHRcdFx0XHR0YWJJbmRleD0nLTEnXG5cdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLnByZXZlbnRGb2N1c31cblx0XHRcdFx0b25DbGljaz17dGhpcy5oYW5kbGVDYW5jZWxVcGxvYWR9XG5cdFx0XHRcdGRhdGEtZHotcmVtb3ZlPlxuXHRcdFx0PC9idXR0b24+O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhY3Rpb25CdXR0b24gPSA8YnV0dG9uXG5cdFx0XHRcdGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tc2VsZWN0IFsgZm9udC1pY29uLXRpY2sgXSdcblx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHR0aXRsZT17aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0VMRUNUJyl9XG5cdFx0XHRcdHRhYkluZGV4PSctMSdcblx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMucHJldmVudEZvY3VzfVxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLmhhbmRsZVRvZ2dsZVNlbGVjdH0+XG5cdFx0XHQ8L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXZcblx0XHRcdFx0Y2xhc3NOYW1lPXt0aGlzLmdldEl0ZW1DbGFzc05hbWVzKCl9XG5cdFx0XHRcdGRhdGEtaWQ9e3RoaXMucHJvcHMuaXRlbS5pZH1cblx0XHRcdFx0dGFiSW5kZXg9JzAnXG5cdFx0XHRcdG9uS2V5RG93bj17dGhpcy5oYW5kbGVLZXlEb3dufVxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLmhhbmRsZUFjdGl2YXRlfT5cblx0XHRcdFx0PGRpdiByZWY9J3RodW1ibmFpbCcgY2xhc3NOYW1lPXt0aGlzLmdldFRodW1ibmFpbENsYXNzTmFtZXMoKX0gc3R5bGU9e3RoaXMuZ2V0VGh1bWJuYWlsU3R5bGVzKCl9PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpdGVtLS1vdmVybGF5IFsgZm9udC1pY29uLWVkaXQgXSc+VmlldzwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0e3RoaXMuZ2V0UHJvZ3Jlc3NCYXIoKX1cblx0XHRcdFx0e3RoaXMuZ2V0RXJyb3JNZXNzYWdlKCl9XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpdGVtX190aXRsZScgcmVmPSd0aXRsZSc+XG5cdFx0XHRcdFx0e3RoaXMucHJvcHMuaXRlbS50aXRsZX1cblx0XHRcdFx0XHR7YWN0aW9uQnV0dG9ufVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn1cblxuRmlsZUNvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG5cdGl0ZW06IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0YXR0cmlidXRlczogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcblx0XHRcdGRpbWVuc2lvbnM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxuXHRcdH0pLFxuXHRcdGNhdGVnb3J5OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cdFx0aWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHR1cmw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblx0XHRwcm9ncmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxuXHR9KSxcblx0c2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cdHNwYWNlS2V5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRyZXR1cm5LZXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdGhhbmRsZUFjdGl2YXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRoYW5kbGVUb2dnbGVTZWxlY3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdGhhbmRsZURlbGV0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblx0bWVzc2FnZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0dXBsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxufTtcblxuRmlsZUNvbXBvbmVudC5kZWZhdWx0UHJvcHMgPSB7XG5cdHJldHVybktleTogMTMsXG5cdHNwYWNlS2V5OiAzMlxufTtcblxuZXhwb3J0IGRlZmF1bHQgRmlsZUNvbXBvbmVudFxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5cbmNsYXNzIFRleHRGaWVsZENvbXBvbmVudCBleHRlbmRzIFNpbHZlclN0cmlwZUNvbXBvbmVudCB7XG5cblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmb3JtLWdyb3VwJz5cblx0XHRcdFx0e3RoaXMucHJvcHMubGFiZWwgJiZcblx0XHRcdFx0XHQ8bGFiZWwgaHRtbEZvcj17J2dhbGxlcnlfJyArIHRoaXMucHJvcHMubmFtZX0+XG5cdFx0XHRcdFx0XHR7dGhpcy5wcm9wcy5sYWJlbH1cblx0XHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHR9XG5cdFx0XHRcdDxpbnB1dCB7Li4udGhpcy5nZXRJbnB1dFByb3BzKCl9IC8+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG5cblx0Z2V0SW5wdXRQcm9wcygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2xhc3NOYW1lOiBbJ2Zvcm0tY29udHJvbCcsIHRoaXMucHJvcHMuZXh0cmFDbGFzc10uam9pbignICcpLFxuXHRcdFx0aWQ6IGBnYWxsZXJ5XyR7dGhpcy5wcm9wcy5uYW1lfWAsXG5cdFx0XHRuYW1lOiB0aGlzLnByb3BzLm5hbWUsXG5cdFx0XHRvbkNoYW5nZTogdGhpcy5wcm9wcy5vbkNoYW5nZSxcblx0XHRcdHR5cGU6ICd0ZXh0Jyxcblx0XHRcdHZhbHVlOiB0aGlzLnByb3BzLnZhbHVlXG5cdFx0fTtcblx0fVxuXG5cdGhhbmRsZUNoYW5nZShldmVudCkge1xuXHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5vbkNoYW5nZSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKCk7XG5cdH1cbn1cblxuVGV4dEZpZWxkQ29tcG9uZW50LnByb3BUeXBlcyA9IHtcblx0bGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdGV4dHJhQ2xhc3M6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblx0b25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHR2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVGV4dEZpZWxkQ29tcG9uZW50O1xuIiwiaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0J0NTU19UUkFOU0lUSU9OX1RJTUUnOiAzMDAsXG5cdCdUSFVNQk5BSUxfSEVJR0hUJzogMTUwLFxuXHQnVEhVTUJOQUlMX1dJRFRIJzogMjAwLFxuXHQnQlVMS19BQ1RJT05TJzogW1xuXHRcdHtcblx0XHRcdHZhbHVlOiAnZGVsZXRlJyxcblx0XHRcdGxhYmVsOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5CVUxLX0FDVElPTlNfREVMRVRFJyksXG5cdFx0XHRkZXN0cnVjdGl2ZTogdHJ1ZVxuXHRcdH1cblx0XSxcblx0J0JVTEtfQUNUSU9OU19QTEFDRUhPTERFUic6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkJVTEtfQUNUSU9OU19QTEFDRUhPTERFUicpLFxuXHQnSE9NRV9ST1VURSc6ICcvYXNzZXRzJywgLy8gSGFyZGNvZGVkIGhlcmUgdW50aWwgd2UgaGF2ZSBhIGNvbmZpZyBtYW5hZ2VyXG5cdCdFRElUSU5HX1JPVVRFJzogJy9hc3NldHMvRWRpdEZvcm0vZmllbGQvRmlsZXMvaXRlbS86aWQvZWRpdCcsIC8vIEhhcmRjb2RlZCBoZXJlIHVudGlsIHdlIGhhdmUgYSBjb25maWcgbWFuYWdlclxuXHQnRk9MREVSX1JPVVRFJzogJy9hc3NldHMvc2hvdy86aWQ/JyAvLyBIYXJkY29kZWQgaGVyZSB1bnRpbCB3ZSBoYXZlIGEgY29uZmlnIG1hbmFnZXJcbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgKiBhcyBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi8uLi9zdGF0ZS9nYWxsZXJ5L2FjdGlvbnMnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBGaWxlQmFja2VuZCBmcm9tICcuLi8uLi9iYWNrZW5kL2ZpbGUtYmFja2VuZCc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uLy4uL2NvbnN0YW50cyc7XG5cbmNsYXNzIEFzc2V0QWRtaW5Db250YWluZXIgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHZhciAkY29tcG9uZW50V3JhcHBlciA9ICQoJy5hc3NldC1nYWxsZXJ5JykuZmluZCgnLmFzc2V0LWdhbGxlcnktY29tcG9uZW50LXdyYXBwZXInKSxcbiAgICAgICAgICAgICRzZWFyY2ggPSAkKCcuY21zLXNlYXJjaC1mb3JtJyk7XG5cbiAgICAgICAgaWYgKCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAkc2VhcmNoLmFwcGVuZCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwicVtGb2xkZXJdXCIgLz4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFja2VuZCA9IG5ldyBGaWxlQmFja2VuZChcbiAgICAgICAgICAgICRjb21wb25lbnRXcmFwcGVyLmRhdGEoJ2Fzc2V0LWdhbGxlcnktZmlsZXMtYnktcGFyZW50LXVybCcpLFxuICAgICAgICAgICAgJGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1maWxlcy1ieS1zaWJsaW5nLXVybCcpLFxuICAgICAgICAgICAgJGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1zZWFyY2gtdXJsJyksXG4gICAgICAgICAgICAkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LXVwZGF0ZS11cmwnKSxcbiAgICAgICAgICAgICRjb21wb25lbnRXcmFwcGVyLmRhdGEoJ2Fzc2V0LWdhbGxlcnktZGVsZXRlLXVybCcpLFxuICAgICAgICAgICAgJGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1saW1pdCcpLFxuICAgICAgICAgICAgJGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1idWxrLWFjdGlvbnMnKSxcbiAgICAgICAgICAgICRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJyksXG4gICAgICAgICAgICAkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LWluaXRpYWwtZm9sZGVyJykgfHwgJydcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmhhbmRsZUJhY2tlbmRGZXRjaCA9IHRoaXMuaGFuZGxlQmFja2VuZEZldGNoLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlQmFja2VuZFNhdmUgPSB0aGlzLmhhbmRsZUJhY2tlbmRTYXZlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlQmFja2VuZERlbGV0ZSA9IHRoaXMuaGFuZGxlQmFja2VuZERlbGV0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZUJhY2tlbmROYXZpZ2F0ZSA9IHRoaXMuaGFuZGxlQmFja2VuZE5hdmlnYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlQmFja2VuZE1vcmUgPSB0aGlzLmhhbmRsZUJhY2tlbmRNb3JlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlQmFja2VuZFNlYXJjaCA9IHRoaXMuaGFuZGxlQmFja2VuZFNlYXJjaC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBzdXBlci5jb21wb25lbnREaWRNb3VudCgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIGZldGNoTWV0aG9kID0gJ2dldEZpbGVzQnlQYXJlbnRJRCc7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5wcm9wcy5pZEZyb21VUkwgJiYgdGhpcy5wcm9wcy5pZEZyb21VUkwgIT09IHRoaXMucHJvcHMuaW5pdGlhbEZvbGRlcikge1xuICAgICAgICAgICAgLy8gSWYgdGhlIHVybCBpcyB0byBlZGl0IGEgc3BlY2lmaWMgZmlsZS5cbiAgICAgICAgICAgIC8vIERvaW5nIHRoaXMgYmVjYXVzZSB0aGUgZ2FsbGVyeSB2aWV3IGFuZCB0aGUgZWRpdCB2aWV3IGFyZSBoYW5kbGVkXG4gICAgICAgICAgICAvLyBieSBzZXBhcmF0ZSBTaWx2ZXJTdHJpcGUgY29udHJvbGxlcnMuIFxuICAgICAgICAgICAgLy8gV2hlbiB0aGUgQXNzZXRHYWxsZXJ5RmllbGQgYmVjb21lcyB0aGUgZW50aXJlIHNlY3Rpb24gd2UgY2FuIGhhbmRsZSB0aGlzIGRpZmZlcmVudGx5XG4gICAgICAgICAgICBmZXRjaE1ldGhvZCA9ICdnZXRGaWxlc0J5U2libGluZ0lEJztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5iYWNrZW5kW2ZldGNoTWV0aG9kXSh0aGlzLnByb3BzLmlkRnJvbVVSTClcbiAgICAgICAgICAgIC5kb25lKChkYXRhLCBzdGF0dXMsIHhocikgPT4ge1xuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSB0aGUgaW5pdGlhbCBwYXlsb2FkIGZyb20gdGhlIEZpbGVCYWNrZW5kLlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCBhZnRlciB0aGlzLmhhbmRsZUJhY2tlbmRGZXRjaFxuXG4gICAgICAgICAgICAgICAgY29uc3Qgcm91dGUgPSBuZXcgd2luZG93LnNzLnJvdXRlci5Sb3V0ZShDT05TVEFOVFMuRURJVElOR19ST1VURSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFBhdGggPSB3aW5kb3cuc3Mucm91dGVyLmN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLnByb3BzLmFzc2V0QWRtaW4uZ2FsbGVyeS5maWxlcztcblxuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7fTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHdlJ3JlIG9uIGEgZmlsZSBlZGl0IHJvdXRlIHdlIG5lZWQgdG8gc2V0IHRoZSBmaWxlIGN1cnJlbnRseSBiZWluZyBlZGl0ZWQuXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlLm1hdGNoKGN1cnJlbnRQYXRoLCBwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5zZXRFZGl0aW5nKGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5pZCA9PT0gcGFyc2VJbnQocGFyYW1zLmlkLCAxMCkpWzBdKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMuc2V0UGF0aChjdXJyZW50UGF0aCk7XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5iYWNrZW5kLmFkZExpc3RlbmVyKCdvbkZldGNoRGF0YScsIHRoaXMuaGFuZGxlQmFja2VuZEZldGNoKTtcbiAgICAgICAgdGhpcy5iYWNrZW5kLmFkZExpc3RlbmVyKCdvblNhdmVEYXRhJywgdGhpcy5oYW5kbGVCYWNrZW5kU2F2ZSk7XG4gICAgICAgIHRoaXMuYmFja2VuZC5hZGRMaXN0ZW5lcignb25EZWxldGVEYXRhJywgdGhpcy5oYW5kbGVCYWNrZW5kRGVsZXRlKTtcbiAgICAgICAgdGhpcy5iYWNrZW5kLmFkZExpc3RlbmVyKCdvbk5hdmlnYXRlRGF0YScsIHRoaXMuaGFuZGxlQmFja2VuZE5hdmlnYXRlKTtcbiAgICAgICAgdGhpcy5iYWNrZW5kLmFkZExpc3RlbmVyKCdvbk1vcmVEYXRhJywgdGhpcy5oYW5kbGVCYWNrZW5kTW9yZSk7XG4gICAgICAgIHRoaXMuYmFja2VuZC5hZGRMaXN0ZW5lcignb25TZWFyY2hEYXRhJywgdGhpcy5oYW5kbGVCYWNrZW5kU2VhcmNoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgc3VwZXIuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuICAgICAgICB0aGlzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uRmV0Y2hEYXRhJywgdGhpcy5oYW5kbGVCYWNrZW5kRmV0Y2gpO1xuICAgICAgICB0aGlzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uU2F2ZURhdGEnLCB0aGlzLmhhbmRsZUJhY2tlbmRTYXZlKTtcbiAgICAgICAgdGhpcy5iYWNrZW5kLnJlbW92ZUxpc3RlbmVyKCdvbkRlbGV0ZURhdGEnLCB0aGlzLmhhbmRsZUJhY2tlbmREZWxldGUpO1xuICAgICAgICB0aGlzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uTmF2aWdhdGVEYXRhJywgdGhpcy5oYW5kbGVCYWNrZW5kTmF2aWdhdGUpO1xuICAgICAgICB0aGlzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uTW9yZURhdGEnLCB0aGlzLmhhbmRsZUJhY2tlbmRNb3JlKTtcbiAgICAgICAgdGhpcy5iYWNrZW5kLnJlbW92ZUxpc3RlbmVyKCdvblNlYXJjaERhdGEnLCB0aGlzLmhhbmRsZUJhY2tlbmRTZWFyY2gpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgLy8gR2l2ZSBlYWNoIGNoaWxkIGNvbXBvbmVudCBhY2Nlc3MgdG8gdGhlIEZpbGVCYWNrZW5kLlxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IFJlYWN0LkNoaWxkcmVuLm1hcCh0aGlzLnByb3BzLmNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQoY2hpbGQsIHsgYmFja2VuZDogdGhpcy5iYWNrZW5kIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5XCI+XG4gICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaGFuZGxlRW50ZXJSb3V0ZShjdHgsIG5leHQpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLnNldFBhdGgoY3R4LnBhdGgpO1xuICAgICAgICBuZXh0KCk7XG4gICAgfVxuXG4gICAgaGFuZGxlRXhpdFJvdXRlKGN0eCwgbmV4dCkge1xuICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMuc2V0UGF0aChudWxsKTtcbiAgICAgICAgbmV4dCgpO1xuICAgIH1cblxuICAgIGhhbmRsZUJhY2tlbmRGZXRjaChkYXRhKSB7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5zZXRGb2xkZXJJZChwYXJzZUludChkYXRhLmZvbGRlcklELCAxMCkpO1xuICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMuc2V0UGFyZW50Rm9sZGVySWQoZGF0YS5wYXJlbnQpO1xuICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMuYWRkRmlsZXMoZGF0YS5maWxlcywgZGF0YS5jb3VudCk7XG4gICAgfVxuXG4gICAgaGFuZGxlQmFja2VuZFNhdmUoaWQsIHZhbHVlcykge1xuICAgICAgICB3aW5kb3cuc3Mucm91dGVyLnNob3coQ09OU1RBTlRTLkhPTUVfUk9VVEUpO1xuICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMuc2V0RWRpdGluZyhudWxsKTtcbiAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLnVwZGF0ZUZpbGUoaWQsIHsgdGl0bGU6IHZhbHVlcy50aXRsZSwgYmFzZW5hbWU6IHZhbHVlcy5iYXNlbmFtZSB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVCYWNrZW5kRGVsZXRlKGRhdGEpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLmRlc2VsZWN0RmlsZXMoZGF0YSk7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5yZW1vdmVGaWxlcyhkYXRhKTtcbiAgICB9XG5cbiAgICBoYW5kbGVCYWNrZW5kTmF2aWdhdGUoZGF0YSkge1xuICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMucmVtb3ZlRmlsZXMoKTtcbiAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLmFkZEZpbGVzKGRhdGEuZmlsZXMsIGRhdGEuY291bnQpO1xuICAgIH1cblxuICAgIGhhbmRsZUJhY2tlbmRNb3JlKGRhdGEpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLmFkZEZpbGVzKHRoaXMucHJvcHMuYXNzZXRBZG1pbi5nYWxsZXJ5LmZpbGVzLmNvbmNhdChkYXRhLmZpbGVzKSwgZGF0YS5jb3VudCk7XG4gICAgfVxuXG4gICAgaGFuZGxlQmFja2VuZFNlYXJjaChkYXRhKSB7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlcyhkYXRhLmZpbGVzLCBkYXRhLmNvdW50KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFzc2V0QWRtaW46IHN0YXRlLmFzc2V0QWRtaW5cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFjdGlvbnM6IGJpbmRBY3Rpb25DcmVhdG9ycyhnYWxsZXJ5QWN0aW9ucywgZGlzcGF0Y2gpXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShBc3NldEFkbWluQ29udGFpbmVyKTtcbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgaTE4biBmcm9tICdpMThuJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgU2lsdmVyU3RyaXBlQ29tcG9uZW50IGZyb20gJ3NpbHZlcnN0cmlwZS1jb21wb25lbnQnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCAqIGFzIGdhbGxlcnlBY3Rpb25zIGZyb20gJy4uLy4uL3N0YXRlL2dhbGxlcnkvYWN0aW9ucyc7XG5pbXBvcnQgVGV4dEZpZWxkQ29tcG9uZW50IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvdGV4dC1maWVsZC9pbmRleCc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uLy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgRm9ybUFjdGlvbiBmcm9tICdjb21wb25lbnRzL2Zvcm0tYWN0aW9uJztcblxuY2xhc3MgRWRpdG9yQ29udGFpbmVyIGV4dGVuZHMgU2lsdmVyU3RyaXBlQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHRjb25zdCBmaWxlID0gdGhpcy5wcm9wcy5maWxlO1xuXG5cdFx0dGhpcy5maWVsZHMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdCdsYWJlbCc6ICdUaXRsZScsXG5cdFx0XHRcdCduYW1lJzogJ3RpdGxlJyxcblx0XHRcdFx0J3ZhbHVlJzogZmlsZSA9PT0gbnVsbCA/IGZpbGUgOiBmaWxlLnRpdGxlXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQnbGFiZWwnOiAnRmlsZW5hbWUnLFxuXHRcdFx0XHQnbmFtZSc6ICdiYXNlbmFtZScsXG5cdFx0XHRcdCd2YWx1ZSc6IGZpbGUgPT09IG51bGwgPyBmaWxlIDogZmlsZS5iYXNlbmFtZVxuXHRcdFx0fVxuXHRcdF07XG5cblx0XHR0aGlzLm9uRmllbGRDaGFuZ2UgPSB0aGlzLm9uRmllbGRDaGFuZ2UuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZVNhdmUgPSB0aGlzLm9uRmlsZVNhdmUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRmlsZVB1Ymxpc2ggPSB0aGlzLm9uRmlsZVB1Ymxpc2guYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uQ2FuY2VsID0gdGhpcy5vbkNhbmNlbC5iaW5kKHRoaXMpO1xuXHR9XG5cblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0c3VwZXIuY29tcG9uZW50RGlkTW91bnQoKTtcblxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZXRFZGl0b3JGaWVsZHModGhpcy5maWVsZHMpO1xuXHR9XG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQoKSB7XG5cdFx0c3VwZXIuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZXRFZGl0b3JGaWVsZHMoKTtcblx0fVxuXG5cdG9uRmllbGRDaGFuZ2UoZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMudXBkYXRlRWRpdG9yRmllbGQoe1xuXHRcdFx0bmFtZTogZXZlbnQudGFyZ2V0Lm5hbWUsXG5cdFx0XHR2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlXG5cdFx0fSk7XG5cdH1cblxuXHRvbkZpbGVTYXZlKGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5vbkZpbGVTYXZlKHRoaXMucHJvcHMuZmlsZS5pZCwgdGhpcy5wcm9wcy5lZGl0b3JGaWVsZHMpO1xuXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fVxuXG5cdG9uRmlsZVB1Ymxpc2goZXZlbnQpIHtcblx0XHQvLyBQdWJsaXNoXG5cdH1cblxuXHRvbkNhbmNlbChldmVudCkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZXRFZGl0aW5nKG51bGwpO1xuXHRcdHdpbmRvdy5zcy5yb3V0ZXIuc2hvdyhDT05TVEFOVFMuSE9NRV9ST1VURSk7XG5cdH1cblxuXHRoYW5kbGVFbnRlclJvdXRlKGN0eCwgbmV4dCkge1xuXHRcdC8vIElmIHRoZXJlIGlzIG5vIGZpbGUgdG8gZWRpdCBzZXQgdGhlIGVkaXRpbmcgZmlsZVxuXHRcdC8vIGJ5IG1hdGNoaW5nIGEgZmlsZSBpZCBhZ2FpbnN0IHRoZSBpZCBpbiB0aGUgVVJMLlxuXHRcdGlmICh0aGlzLnByb3BzLmZpbGUgPT09IG51bGwpIHtcblx0XHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZXRFZGl0aW5nKHRoaXMucHJvcHMuZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmlkID09PSBwYXJzZUludChjdHgucGFyYW1zLmlkLCAxMCkpWzBdKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVFeGl0Um91dGUoY3R4LCBuZXh0KSB7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLnNldEVkaXRpbmcobnVsbCk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuZmlsZSA9PT0gbnVsbCB8fCB0eXBlb2YgdGhpcy5wcm9wcy5maWxlID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdlZGl0b3ItY29tcG9uZW50Jz5cblxuXHRcdFx0PGEgXG5cdFx0XHRcdGNsYXNzTmFtZT1cImZvbnQtaWNvbi1jYW5jZWwgbm8tdGV4dCBidG4gYnRuLS1jbG9zZVwiXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25DYW5jZWx9XG5cdFx0XHQvPlxuXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmlsZS1kZXRhaWxzJz5cblx0XHRcdFx0XG5cdFx0XHRcdDxoMiBjbGFzc05hbWU9XCJcIj57dGhpcy5wcm9wcy5maWxlLnRpdGxlfTwvaDI+XG5cdFx0XHRcdDxwIGNsYXNzTmFtZT0naGVhZGVyLWV4dHJhJz48c21hbGw+e3RoaXMucHJvcHMuZmlsZS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMud2lkdGh9IHgge3RoaXMucHJvcHMuZmlsZS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnMuaGVpZ2h0fXB4LCB7dGhpcy5wcm9wcy5maWxlLnNpemV9PC9zbWFsbD48L3A+XG5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpbGUtcHJldmlldyc+XG5cdFx0XHRcdFx0PGltZyBjbGFzc05hbWU9J2ZpbGUtcHJldmlldy10aHVtYm5haWwnIHNyYz17dGhpcy5wcm9wcy5maWxlLnVybH0gLz5cblx0XHRcdFx0XHQ8YSBocmVmPXt0aGlzLnByb3BzLmZpbGUudXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzc05hbWU9J2ZpbGUtZW5sYXJnZSBmb250LWljb24tc2VhcmNoIG5vLXRleHQnPjwvYT5cblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0PHVsIGNsYXNzTmFtZT1cIm5hdiBuYXYtdGFic1wiIHJvbGU9XCJ0YWJsaXN0XCI+XG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+XG5cdFx0XHRcdFx0XHQ8YSBjbGFzc05hbWU9XCJuYXYtbGluayBhY3RpdmVcIiBkYXRhLXRvZ2dsZT1cInRhYlwiIGhyZWY9XCIjZGV0YWlsc1wiIHJvbGU9XCJ0YWJcIj5EZXRhaWxzPC9hPlxuXHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+XG5cdFx0XHRcdFx0XHQ8YSBjbGFzc05hbWU9XCJuYXYtbGlua1wiIGRhdGEtdG9nZ2xlPVwidGFiXCIgaHJlZj1cIiN1c2FnZVwiIHJvbGU9XCJ0YWJcIj5Vc2FnZTwvYT5cblx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHQ8L3VsPlxuXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwidGFiLWNvbnRlbnRcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInRhYi1wYW5lIGFjdGl2ZVwiIGlkPVwiZGV0YWlsc1wiIHJvbGU9XCJ0YWJwYW5lbFwiPlxuXG5cdFx0XHRcdFx0XHR7dGhpcy5wcm9wcy5lZGl0b3JGaWVsZHMubWFwKChmaWVsZCwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gPFRleHRGaWVsZENvbXBvbmVudFxuXHRcdFx0XHRcdFx0XHRcdGtleT17aX1cblx0XHRcdFx0XHRcdFx0XHRsYWJlbD17ZmllbGQubGFiZWx9XG5cdFx0XHRcdFx0XHRcdFx0bmFtZT17ZmllbGQubmFtZX1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5wcm9wcy5maWxlW2ZpZWxkLm5hbWVdfVxuXHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLm9uRmllbGRDaGFuZ2V9IC8+XG5cdFx0XHRcdFx0XHR9KX1cblxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJmb2xkZXJMb2NhdGlvblwiPkZvbGRlciBsb2NhdGlvbjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiZm9sZGVyTG9jYXRpb25cIiBwbGFjZWhvbGRlcj1cInVwbG9hZHMvZm9sZGVyIG5hbWUvXCIgLz5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhIGZvcm0tZ3JvdXAgYnJlYWstc3RyaW5nXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtbGVmdFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzTmFtZT1cImZvbnQtaWNvbi1saW5rXCI+PC9pPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XG5cdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj17dGhpcy5wcm9wcy5maWxlLnVybH0gdGFyZ2V0PSdfYmxhbmsnPnt0aGlzLnByb3BzLmZpbGUudXJsfTwvYT5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblxuXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImJ0bi10b29sYmFyXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIlwiPlxuXHRcdFx0XHRcdFx0XHRcdDxGb3JtQWN0aW9uXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlPSdzdWJtaXQnXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uPSdzYXZlJ1xuXHRcdFx0XHRcdFx0XHRcdFx0c3R5bGU9J3N1Y2Nlc3MnXG5cdFx0XHRcdFx0XHRcdFx0XHRoYW5kbGVDbGljaz17dGhpcy5vbkZpbGVTYXZlfVxuXHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw9e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlNBVkUnKX1cblx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHRcdDxGb3JtQWN0aW9uXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlPSdzdWJtaXQnXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uPSdyb2NrZXQnXG5cdFx0XHRcdFx0XHRcdFx0XHRzdHlsZT0nc3VjY2Vzcydcblx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZUNsaWNrPXt0aGlzLm9uRmlsZVB1Ymxpc2h9XG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbD0nUHVibGlzaCdcblx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1jb250YWluZXI9XCJib2R5XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIG5vLXRleHRcIiBkYXRhLXRvZ2dsZT1cInBvcG92ZXJcIiB0aXRsZT1cIlBhZ2UgYWN0aW9uc1wiIGRhdGEtcGxhY2VtZW50PVwidG9wXCIgZGF0YS1jb250ZW50PVwiPGEgaHJlZj0nJz5BZGQgdG8gY2FtcGFpZ248L2E+PGEgaHJlZj0nJz5SZW1vdmUgZnJvbSBjYW1wYWlnbjwvYT5cIj48aSBjbGFzc05hbWU9J2RvdC0zJz48L2k+PC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwidGFiLXBhbmVcIiBpZD1cInVzYWdlXCIgcm9sZT1cInRhYnBhbmVsXCI+XG5cblx0XHRcdFx0XHRcdDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZSB0YWJsZS1zbVwiPlxuXHRcdFx0XHRcdFx0XHQ8dGJvZHk+XG5cdFx0XHRcdFx0XHRcdFx0PHRyPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHRkIHNjb3BlPVwicm93XCI+e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkNSRUFURUQnKX0gPC90ZD5cblx0XHRcdFx0XHRcdFx0XHRcdDx0ZD57dGhpcy5wcm9wcy5maWxlLmNyZWF0ZWR9IGJ5IDxhIGhyZWY9XCJcIj5NaWNoYWVsPC9hPjwvdGQ+XG5cdFx0XHRcdFx0XHRcdFx0PC90cj5cblx0XHRcdFx0XHRcdFx0XHQ8dHI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8dGQgc2NvcGU9XCJyb3dcIj57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuTEFTVEVESVQnKX0gPC90ZD5cblx0XHRcdFx0XHRcdFx0XHRcdDx0ZD57dGhpcy5wcm9wcy5maWxlLmxhc3RVcGRhdGVkfSBieSA8YSBocmVmPVwiXCI+SmFjazwvYT48L3RkPlxuXHRcdFx0XHRcdFx0XHRcdDwvdHI+XG5cdFx0XHRcdFx0XHRcdDwvdGJvZHk+XG5cdFx0XHRcdFx0XHQ8L3RhYmxlPlxuXG5cdFx0XHRcdFx0XHQ8dGFibGUgY2xhc3NOYW1lPVwidGFibGVcIj5cblx0XHRcdFx0XHRcdCAgPHRoZWFkPlxuXHRcdFx0XHRcdFx0XHQ8dHI+XG5cdFx0XHRcdFx0XHRcdCAgPHRoPiM8L3RoPlxuXHRcdFx0XHRcdFx0XHQgIDx0aD5Vc2VkIG9uPC90aD5cblx0XHRcdFx0XHRcdFx0ICA8dGg+U3RhdGU8L3RoPlxuXHRcdFx0XHRcdFx0XHQ8L3RyPlxuXHRcdFx0XHRcdFx0ICA8L3RoZWFkPlxuXHRcdFx0XHRcdFx0ICA8dGJvZHk+XG5cdFx0XHRcdFx0XHRcdDx0ciBjbGFzc05hbWU9XCJiZy1wcmltYXJ5XCI+XG5cdFx0XHRcdFx0XHRcdCAgPHRoIHNjb3BlPVwicm93XCI+MTwvdGg+XG5cdFx0XHRcdFx0XHRcdCAgPHRkPkFib3V0IHVzPHNtYWxsIGNsYXNzTmFtZT1cImFkZGl0aW9uYWwtaW5mb1wiPlBhZ2U8L3NtYWxsPjwvdGQ+XG5cdFx0XHRcdFx0XHRcdCAgPHRkPjxzcGFuIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLWluZm9cIj5EcmFmdDwvc3Bhbj48L3RkPlxuXHRcdFx0XHRcdFx0XHQ8L3RyPlxuXHRcdFx0XHRcdFx0XHQ8dHI+XG5cdFx0XHRcdFx0XHRcdCAgPHRoIHNjb3BlPVwicm93XCI+MjwvdGg+XG5cdFx0XHRcdFx0XHRcdCAgPHRkPjxhIGhyZWY9XCJcIj5NeSBncmVhdCBibG9nIHBvc3Q8L2E+PHNtYWxsIGNsYXNzTmFtZT1cImFkZGl0aW9uYWwtaW5mb1wiPkJsb2cgcG9zdDwvc21hbGw+PC90ZD5cblx0XHRcdFx0XHRcdFx0ICA8dGQ+PHNwYW4gY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtc3VjY2Vzc1wiPlB1Ymxpc2hlZDwvc3Bhbj48L3RkPlxuXHRcdFx0XHRcdFx0XHQ8L3RyPlxuXHRcdFx0XHRcdFx0XHQ8dHI+XG5cdFx0XHRcdFx0XHRcdCAgPHRoIHNjb3BlPVwicm93XCI+MzwvdGg+XG5cdFx0XHRcdFx0XHRcdCAgPHRkPjxhIGhyZWY9XCJcIj5PdXIgc2VydmljZXM8L2E+PHNtYWxsIGNsYXNzTmFtZT1cImFkZGl0aW9uYWwtaW5mb1wiPlNlcnZpY2VzIFBhZ2U8L3NtYWxsPjwvdGQ+XG5cdFx0XHRcdFx0XHRcdCAgPHRkPjxzcGFuIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXN1Y2Nlc3NcIj5QdWJsaXNoZWQ8L3NwYW4+PC90ZD5cblx0XHRcdFx0XHRcdFx0PC90cj5cblx0XHRcdFx0XHRcdFx0PHRyPlxuXHRcdFx0XHRcdFx0XHQgIDx0aCBzY29wZT1cInJvd1wiPjQ8L3RoPlxuXHRcdFx0XHRcdFx0XHQgIDx0ZD48YSBocmVmPVwiXCI+SnVuZSByZWxlYXNlPC9hPjxzbWFsbCBjbGFzc05hbWU9XCJhZGRpdGlvbmFsLWluZm9cIj5DYW1wYWlnbjwvc21hbGw+PC90ZD5cblx0XHRcdFx0XHRcdFx0ICA8dGQ+PC90ZD5cblx0XHRcdFx0XHRcdFx0PC90cj5cblx0XHRcdFx0XHRcdFx0PHRyPlxuXHRcdFx0XHRcdFx0XHQgIDx0aCBzY29wZT1cInJvd1wiPjU8L3RoPlxuXHRcdFx0XHRcdFx0XHQgIDx0ZD48YSBocmVmPVwiXCI+TWFya2V0aW5nPC9hPjxzbWFsbCBjbGFzc05hbWU9XCJhZGRpdGlvbmFsLWluZm9cIj5DYW1wYWlnbjwvc21hbGw+PC90ZD5cblx0XHRcdFx0XHRcdFx0ICA8dGQ+PHNwYW4gY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtd2FybmluZ1wiPlNjaGVkdWxlZDwvc3Bhbj48L3RkPlxuXHRcdFx0XHRcdFx0XHQ8L3RyPlxuXHRcdFx0XHRcdFx0XHQ8dHI+XG5cdFx0XHRcdFx0XHRcdCAgPHRoIHNjb3BlPVwicm93XCI+NjwvdGg+XG5cdFx0XHRcdFx0XHRcdCAgPHRkPjxhIGhyZWY9XCJcIj5TZXJ2aWNlcyBzZWN0aW9uPC9hPjxzbWFsbCBjbGFzc05hbWU9XCJhZGRpdGlvbmFsLWluZm9cIj5DYW1wYWlnbjwvc21hbGw+PC90ZD5cblx0XHRcdFx0XHRcdFx0ICA8dGQ+PHNwYW4gY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtc3VjY2Vzc1wiPlB1Ymxpc2hlZDwvc3Bhbj48L3RkPlxuXHRcdFx0XHRcdFx0XHQ8L3RyPlxuXHRcdFx0XHRcdFx0ICA8L3Rib2R5PlxuXHRcdFx0XHRcdFx0PC90YWJsZT5cblxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2Pjtcblx0fVxufVxuXG5FZGl0b3JDb250YWluZXIucHJvcFR5cGVzID0ge1xuXHRmaWxlOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHRcdGlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRcdHRpdGxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGJhc2VuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRzaXplOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGNyZWF0ZWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0bGFzdFVwZGF0ZWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0ZGltZW5zaW9uczogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcblx0XHRcdHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRcdFx0aGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG5cdFx0fSlcblx0fSksXG5cdGJhY2tlbmQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdHJldHVybiB7XG5cdFx0ZWRpdG9yRmllbGRzOiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnkuZWRpdG9yRmllbGRzLCAvLyBUaGUgaW5wdXRzIGZvciBlZGl0aW5nIHRoZSBmaWxlLlxuXHRcdGZpbGU6IHN0YXRlLmFzc2V0QWRtaW4uZ2FsbGVyeS5lZGl0aW5nLCAvLyBUaGUgZmlsZSB0byBlZGl0LlxuXHRcdGZpbGVzOiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnkuZmlsZXMsXG5cdFx0cGF0aDogc3RhdGUuYXNzZXRBZG1pbi5nYWxsZXJ5LnBhdGggLy8gVGhlIGN1cnJlbnQgbG9jYXRpb24gcGF0aFxuXHR9XG59XG5cbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuXHRyZXR1cm4ge1xuXHRcdGFjdGlvbnM6IGJpbmRBY3Rpb25DcmVhdG9ycyhnYWxsZXJ5QWN0aW9ucywgZGlzcGF0Y2gpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoRWRpdG9yQ29udGFpbmVyKTtcbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgaTE4biBmcm9tICdpMThuJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBSZWFjdENTU1RyYW5zaXRpb25Hcm91cCBmcm9tICdyZWFjdC1hZGRvbnMtY3NzLXRyYW5zaXRpb24tZ3JvdXAnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBSZWFjdFRlc3RVdGlscyBmcm9tICdyZWFjdC1hZGRvbnMtdGVzdC11dGlscyc7XG5pbXBvcnQgRHJvcHpvbmVDb21wb25lbnQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9kcm9wem9uZSc7XG5pbXBvcnQgRmlsZUNvbXBvbmVudCBmcm9tICcuLi8uLi9jb21wb25lbnRzL2ZpbGUvaW5kZXgnO1xuaW1wb3J0IEJ1bGtBY3Rpb25zQ29tcG9uZW50IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYnVsay1hY3Rpb25zL2luZGV4JztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJy4uLy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgKiBhcyBnYWxsZXJ5QWN0aW9ucyBmcm9tICcuLi8uLi9zdGF0ZS9nYWxsZXJ5L2FjdGlvbnMnO1xuaW1wb3J0ICogYXMgcXVldWVkRmlsZXNBY3Rpb25zIGZyb20gJy4uLy4uL3N0YXRlL3F1ZXVlZC1maWxlcy9hY3Rpb25zJztcblxuZnVuY3Rpb24gZ2V0Q29tcGFyYXRvcihmaWVsZCwgZGlyZWN0aW9uKSB7XG5cdHJldHVybiAoYSwgYikgPT4ge1xuXHRcdGNvbnN0IGZpZWxkQSA9IGFbZmllbGRdLnRvTG93ZXJDYXNlKCk7XG5cdFx0Y29uc3QgZmllbGRCID0gYltmaWVsZF0udG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdhc2MnKSB7XG5cdFx0XHRpZiAoZmllbGRBIDwgZmllbGRCKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZpZWxkQSA+IGZpZWxkQikge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGZpZWxkQSA+IGZpZWxkQikge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmaWVsZEEgPCBmaWVsZEIpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDA7XG5cdH07XG59XG5cbmV4cG9ydCBjbGFzcyBHYWxsZXJ5Q29udGFpbmVyIGV4dGVuZHMgU2lsdmVyU3RyaXBlQ29tcG9uZW50IHtcblxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuc29ydCA9ICduYW1lJztcblx0XHR0aGlzLmRpcmVjdGlvbiA9ICdhc2MnO1xuXG5cdFx0dGhpcy5zb3J0ZXJzID0gW1xuXHRcdFx0e1xuXHRcdFx0XHRmaWVsZDogJ3RpdGxlJyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnYXNjJyxcblx0XHRcdFx0bGFiZWw6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkZJTFRFUl9USVRMRV9BU0MnKVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0ZmllbGQ6ICd0aXRsZScsXG5cdFx0XHRcdGRpcmVjdGlvbjogJ2Rlc2MnLFxuXHRcdFx0XHRsYWJlbDogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRklMVEVSX1RJVExFX0RFU0MnKVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0ZmllbGQ6ICdjcmVhdGVkJyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnZGVzYycsXG5cdFx0XHRcdGxhYmVsOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfREFURV9ERVNDJylcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGZpZWxkOiAnY3JlYXRlZCcsXG5cdFx0XHRcdGRpcmVjdGlvbjogJ2FzYycsXG5cdFx0XHRcdGxhYmVsOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfREFURV9BU0MnKVxuXHRcdFx0fVxuXHRcdF07XG5cblx0XHR0aGlzLmhhbmRsZUZvbGRlckFjdGl2YXRlID0gdGhpcy5oYW5kbGVGb2xkZXJBY3RpdmF0ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlRmlsZUFjdGl2YXRlID0gdGhpcy5oYW5kbGVGaWxlQWN0aXZhdGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZVRvZ2dsZVNlbGVjdCA9IHRoaXMuaGFuZGxlVG9nZ2xlU2VsZWN0LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVBZGRlZEZpbGUgPSB0aGlzLmhhbmRsZUFkZGVkRmlsZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlQ2FuY2VsVXBsb2FkID0gdGhpcy5oYW5kbGVDYW5jZWxVcGxvYWQuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZVJlbW92ZUVycm9yZWRVcGxvYWQgPSB0aGlzLmhhbmRsZVJlbW92ZUVycm9yZWRVcGxvYWQuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZVVwbG9hZFByb2dyZXNzID0gdGhpcy5oYW5kbGVVcGxvYWRQcm9ncmVzcy5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlU2VuZGluZyA9IHRoaXMuaGFuZGxlU2VuZGluZy5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlSXRlbURlbGV0ZSA9IHRoaXMuaGFuZGxlSXRlbURlbGV0ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlQmFja0NsaWNrID0gdGhpcy5oYW5kbGVCYWNrQ2xpY2suYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZU1vcmVDbGljayA9IHRoaXMuaGFuZGxlTW9yZUNsaWNrLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVTb3J0ID0gdGhpcy5oYW5kbGVTb3J0LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVTdWNjZXNzZnVsVXBsb2FkID0gdGhpcy5oYW5kbGVTdWNjZXNzZnVsVXBsb2FkLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVGYWlsZWRVcGxvYWQgPSB0aGlzLmhhbmRsZUZhaWxlZFVwbG9hZC5iaW5kKHRoaXMpO1xuXHR9XG5cblx0Y29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcblx0XHRsZXQgJHNlbGVjdCA9ICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmZpbmQoJy5nYWxsZXJ5X19zb3J0IC5kcm9wZG93bicpO1xuXG5cdFx0JHNlbGVjdC5vZmYoJ2NoYW5nZScpO1xuXHR9XG5cblx0Y29tcG9uZW50RGlkVXBkYXRlKCkge1xuXHRcdGxldCAkc2VsZWN0ID0gJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmdhbGxlcnlfX3NvcnQgLmRyb3Bkb3duJyk7XG5cblx0XHQvLyBXZSBvcHQtb3V0IG9mIGxldHRpbmcgdGhlIENNUyBoYW5kbGUgQ2hvc2VuIGJlY2F1c2UgaXQgZG9lc24ndCByZS1hcHBseSB0aGUgYmVoYXZpb3VyIGNvcnJlY3RseS5cblx0XHQvLyBTbyBhZnRlciB0aGUgZ2FsbGVyeSBoYXMgYmVlbiByZW5kZXJlZCB3ZSBhcHBseSBDaG9zZW4uXG5cdFx0JHNlbGVjdC5jaG9zZW4oe1xuXHRcdFx0J2FsbG93X3NpbmdsZV9kZXNlbGVjdCc6IHRydWUsXG5cdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMjBcblx0XHR9KTtcblxuXHRcdC8vQ2hvc2VuIHN0b3BzIHRoZSBjaGFuZ2UgZXZlbnQgZnJvbSByZWFjaGluZyBSZWFjdCBzbyB3ZSBoYXZlIHRvIHNpbXVsYXRlIGEgY2xpY2suXG5cdFx0JHNlbGVjdC5vbignY2hhbmdlJywgKCkgPT4gUmVhY3RUZXN0VXRpbHMuU2ltdWxhdGUuY2xpY2soJHNlbGVjdC5maW5kKCc6c2VsZWN0ZWQnKVswXSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyB0aGUgc29ydCBvcmRlci5cblx0ICpcblx0ICogQHBhcmFtIG9iamVjdCBldmVudCAtIENsaWNrIGV2ZW50LlxuXHQgKi9cblx0aGFuZGxlU29ydChldmVudCkge1xuXHRcdGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQuZGF0YXNldDtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMucXVldWVkRmlsZXMucHVyZ2VVcGxvYWRRdWV1ZSgpO1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5nYWxsZXJ5LnNvcnRGaWxlcyhnZXRDb21wYXJhdG9yKGRhdGEuZmllbGQsIGRhdGEuZGlyZWN0aW9uKSk7XG5cdH1cblxuXHRnZXROb0l0ZW1zTm90aWNlKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmdhbGxlcnkuY291bnQgPCAxICYmIHRoaXMucHJvcHMucXVldWVkRmlsZXMuaXRlbXMubGVuZ3RoIDwgMSkge1xuXHRcdFx0cmV0dXJuIDxwIGNsYXNzTmFtZT1cImdhbGxlcnlfX25vLWl0ZW0tbm90aWNlXCI+e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLk5PSVRFTVNGT1VORCcpfTwvcD47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRCYWNrQnV0dG9uKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmdhbGxlcnkucGFyZW50Rm9sZGVySUQgIT09IG51bGwpIHtcblx0XHRcdHJldHVybiA8YnV0dG9uXG5cdFx0XHRcdGNsYXNzTmFtZT0nZ2FsbGVyeV9fYmFjayBzcy11aS1idXR0b24gdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWxldmVsLXVwIG5vLXRleHQnXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMuaGFuZGxlQmFja0NsaWNrfVxuXHRcdFx0XHRyZWY9XCJiYWNrQnV0dG9uXCI+PC9idXR0b24+O1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Z2V0QnVsa0FjdGlvbnNDb21wb25lbnQoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuZ2FsbGVyeS5zZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDAgJiYgdGhpcy5wcm9wcy5iYWNrZW5kLmJ1bGtBY3Rpb25zKSB7XG5cdFx0XHRyZXR1cm4gPEJ1bGtBY3Rpb25zQ29tcG9uZW50XG5cdFx0XHRcdGJhY2tlbmQ9e3RoaXMucHJvcHMuYmFja2VuZH1cblx0XHRcdFx0a2V5PXt0aGlzLnByb3BzLmdhbGxlcnkuc2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwfSAvPlxuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Z2V0TW9yZUJ1dHRvbigpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LmNvdW50ID4gdGhpcy5wcm9wcy5nYWxsZXJ5LmZpbGVzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPVwiZ2FsbGVyeV9fbG9hZF9fbW9yZVwiXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMuaGFuZGxlTW9yZUNsaWNrfT57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuTE9BRE1PUkUnKX08L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRoYW5kbGVDYW5jZWxVcGxvYWQoZmlsZURhdGEpIHtcblx0XHRmaWxlRGF0YS54aHIuYWJvcnQoKTtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMucXVldWVkRmlsZXMucmVtb3ZlUXVldWVkRmlsZShmaWxlRGF0YS5xdWV1ZWRBdFRpbWUpO1xuXHR9XG5cblx0aGFuZGxlUmVtb3ZlRXJyb3JlZFVwbG9hZChmaWxlRGF0YSkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5xdWV1ZWRGaWxlcy5yZW1vdmVRdWV1ZWRGaWxlKGZpbGVEYXRhLnF1ZXVlZEF0VGltZSk7XG5cdH1cblxuXHRoYW5kbGVBZGRlZEZpbGUoZGF0YSkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5xdWV1ZWRGaWxlcy5hZGRRdWV1ZWRGaWxlKGRhdGEpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyaWdnZXJlZCBqdXN0IGJlZm9yZSB0aGUgeGhyIHJlcXVlc3QgaXMgc2VudC5cblx0ICpcblx0ICogQHBhcmFtIG9iamVjdCBmaWxlIC0gRmlsZSBpbnRlcmZhY2UuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVxuXHQgKiBAcGFyYW0gb2JqZWN0IHhoclxuXHQgKiBAcGFyYW0gb2JqZWN0IGZvcm1EYXRhIC0gRm9ybURhdGEgaW50ZXJmYWNlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Zvcm1EYXRhXG5cdCAqL1xuXHRoYW5kbGVTZW5kaW5nKGZpbGUsIHhociwgZm9ybURhdGEpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMucXVldWVkRmlsZXMudXBkYXRlUXVldWVkRmlsZShmaWxlLl9xdWV1ZWRBdFRpbWUsIHsgeGhyIH0pO1xuXHR9XG5cblx0aGFuZGxlVXBsb2FkUHJvZ3Jlc3MoZmlsZSwgcHJvZ3Jlc3MsIGJ5dGVzU2VudCkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5xdWV1ZWRGaWxlcy51cGRhdGVRdWV1ZWRGaWxlKGZpbGUuX3F1ZXVlZEF0VGltZSwgeyBwcm9ncmVzcyB9KTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRjb25zdCBkcm9wem9uZU9wdGlvbnMgPSB7XG5cdFx0XHR1cmw6ICdhZG1pbi9hc3NldHMvRWRpdEZvcm0vZmllbGQvVXBsb2FkL3VwbG9hZCcsIC8vIEhhcmRjb2RlZCBwbGFjZWhvbGRlciB1bnRpbCB3ZSBoYXZlIGEgYmFja2VuZFxuXHRcdFx0cGFyYW1OYW1lOiAnVXBsb2FkJyxcblx0XHRcdGNsaWNrYWJsZTogJyN1cGxvYWQtYnV0dG9uJ1xuXHRcdH07XG5cblx0XHRjb25zdCBzZWN1cml0eUlEID0gJCgnOmlucHV0W25hbWU9U2VjdXJpdHlJRF0nKS52YWwoKTtcblxuXHRcdC8vIFRPRE8gTWFrZSBcImFkZCBmb2xkZXJcIiBhbmQgXCJ1cGxvYWRcIiBidXR0b25zIGNvbmRpdGlvbmFsIG9uIHBlcm1pc3Npb25zXG5cdFx0cmV0dXJuIDxkaXY+XG5cdFx0XHR7dGhpcy5nZXRCYWNrQnV0dG9uKCl9XG5cdFx0XHQ8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXAgdHJhbnNpdGlvbk5hbWU9XCJnYWxsZXJ5X19idWxrLWFjdGlvbnNcIiB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXtDT05TVEFOVFMuQ1NTX1RSQU5TSVRJT05fVElNRX0gdHJhbnNpdGlvbkxlYXZlVGltZW91dD17Q09OU1RBTlRTLkNTU19UUkFOU0lUSU9OX1RJTUV9PlxuXHRcdFx0XHR7dGhpcy5nZXRCdWxrQWN0aW9uc0NvbXBvbmVudCgpfVxuXHRcdFx0PC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZ2FsbGVyeV9fc29ydCBmaWVsZGhvbGRlci1zbWFsbFwiPlxuXHRcdFx0XHQ8c2VsZWN0IGNsYXNzTmFtZT1cImRyb3Bkb3duIG5vLWNoYW5nZS10cmFjayBuby1jaHpuXCIgdGFiSW5kZXg9XCIwXCIgc3R5bGU9e3t3aWR0aDogJzE2MHB4J319PlxuXHRcdFx0XHRcdHt0aGlzLnNvcnRlcnMubWFwKChzb3J0ZXIsIGkpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiA8b3B0aW9uXG5cdFx0XHRcdFx0XHRcdFx0a2V5PXtpfVxuXHRcdFx0XHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMuaGFuZGxlU29ydH1cblx0XHRcdFx0XHRcdFx0XHRkYXRhLWZpZWxkPXtzb3J0ZXIuZmllbGR9XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS1kaXJlY3Rpb249e3NvcnRlci5kaXJlY3Rpb259Pntzb3J0ZXIubGFiZWx9PC9vcHRpb24+O1xuXHRcdFx0XHRcdH0pfVxuXHRcdFx0XHQ8L3NlbGVjdD5cblx0XHRcdDwvZGl2PlxuXG5cdFx0XHQ8YnV0dG9uIGlkPSdhZGQtZm9sZGVyLWJ1dHRvbicgY2xhc3NOYW1lPSdnYWxsZXJ5X191cGxvYWQgWyBzcy11aS1idXR0b24gZm9udC1pY29uLWZvbGRlci1hZGQgXScgdHlwZT0nYnV0dG9uJz5cblx0XHRcdFx0e2kxOG4uX3QoXCJBc3NldEdhbGxlcnlGaWVsZC5BRERfRk9MREVSX0JVVFRPTlwiKX1cblx0XHRcdDwvYnV0dG9uPlxuXG5cdFx0XHQ8YnV0dG9uIGlkPSd1cGxvYWQtYnV0dG9uJyBjbGFzc05hbWU9J2dhbGxlcnlfX3VwbG9hZCBbIHNzLXVpLWJ1dHRvbiBmb250LWljb24tdXBsb2FkIF0nIHR5cGU9J2J1dHRvbic+XG5cdFx0XHRcdHtpMThuLl90KFwiQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfVVBMT0FEXCIpfVxuXHRcdFx0PC9idXR0b24+XG5cblx0XHRcdDxEcm9wem9uZUNvbXBvbmVudFxuXHRcdFx0XHRoYW5kbGVBZGRlZEZpbGU9e3RoaXMuaGFuZGxlQWRkZWRGaWxlfVxuXHRcdFx0XHRoYW5kbGVFcnJvcj17dGhpcy5oYW5kbGVGYWlsZWRVcGxvYWR9XG5cdFx0XHRcdGhhbmRsZVN1Y2Nlc3M9e3RoaXMuaGFuZGxlU3VjY2Vzc2Z1bFVwbG9hZH1cblx0XHRcdFx0aGFuZGxlU2VuZGluZz17dGhpcy5oYW5kbGVTZW5kaW5nfVxuXHRcdFx0XHRoYW5kbGVVcGxvYWRQcm9ncmVzcz17dGhpcy5oYW5kbGVVcGxvYWRQcm9ncmVzc31cblx0XHRcdFx0Zm9sZGVySUQ9e3RoaXMucHJvcHMuZ2FsbGVyeS5mb2xkZXJJRH1cblx0XHRcdFx0b3B0aW9ucz17ZHJvcHpvbmVPcHRpb25zfVxuXHRcdFx0XHRzZWN1cml0eUlEPXtzZWN1cml0eUlEfVxuXHRcdFx0XHR1cGxvYWRCdXR0b249e2ZhbHNlfT5cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeV9fZm9sZGVycyc+XG5cdFx0XHRcdFx0e3RoaXMucHJvcHMuZ2FsbGVyeS5maWxlcy5tYXAoKGZpbGUsIGkpID0+IHtcblx0XHRcdFx0XHRcdGlmIChmaWxlLnR5cGUgPT09ICdmb2xkZXInKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiA8RmlsZUNvbXBvbmVudFxuXHRcdFx0XHRcdFx0XHRcdGtleT17aX1cblx0XHRcdFx0XHRcdFx0XHRpdGVtPXtmaWxlfVxuXHRcdFx0XHRcdFx0XHRcdHNlbGVjdGVkPXt0aGlzLml0ZW1Jc1NlbGVjdGVkKGZpbGUuaWQpfVxuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZURlbGV0ZT17dGhpcy5oYW5kbGVJdGVtRGVsZXRlfVxuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVNlbGVjdD17dGhpcy5oYW5kbGVUb2dnbGVTZWxlY3R9XG5cdFx0XHRcdFx0XHRcdFx0aGFuZGxlQWN0aXZhdGU9e3RoaXMuaGFuZGxlRm9sZGVyQWN0aXZhdGV9IC8+O1xuXHRcdFx0XHRcdFx0fX0pfVxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZ2FsbGVyeV9fZmlsZXMnPlxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLnF1ZXVlZEZpbGVzLml0ZW1zLm1hcCgoZmlsZSwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDxGaWxlQ29tcG9uZW50XG5cdFx0XHRcdFx0XHRcdGtleT17YHF1ZXVlZF9maWxlXyR7aX1gfVxuXHRcdFx0XHRcdFx0XHRpdGVtPXtmaWxlfVxuXHRcdFx0XHRcdFx0XHRzZWxlY3RlZD17dGhpcy5pdGVtSXNTZWxlY3RlZChmaWxlLmlkKX1cblx0XHRcdFx0XHRcdFx0aGFuZGxlRGVsZXRlPXt0aGlzLmhhbmRsZUl0ZW1EZWxldGV9XG5cdFx0XHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVNlbGVjdD17dGhpcy5oYW5kbGVUb2dnbGVTZWxlY3R9XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUFjdGl2YXRlPXt0aGlzLmhhbmRsZUZpbGVBY3RpdmF0ZX1cblx0XHRcdFx0XHRcdFx0aGFuZGxlQ2FuY2VsVXBsb2FkPXt0aGlzLmhhbmRsZUNhbmNlbFVwbG9hZH1cblx0XHRcdFx0XHRcdFx0aGFuZGxlUmVtb3ZlRXJyb3JlZFVwbG9hZD17dGhpcy5oYW5kbGVSZW1vdmVFcnJvcmVkVXBsb2FkfVxuXHRcdFx0XHRcdFx0XHRtZXNzYWdlcz17ZmlsZS5tZXNzYWdlc31cblx0XHRcdFx0XHRcdFx0dXBsb2FkaW5nPXt0cnVlfSAvPjtcblx0XHRcdFx0XHR9KX1cblx0XHRcdFx0XHR7dGhpcy5wcm9wcy5nYWxsZXJ5LmZpbGVzLm1hcCgoZmlsZSwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGZpbGUudHlwZSAhPT0gJ2ZvbGRlcicpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDxGaWxlQ29tcG9uZW50XG5cdFx0XHRcdFx0XHRcdFx0a2V5PXtgZmlsZV8ke2l9YH1cblx0XHRcdFx0XHRcdFx0XHRpdGVtPXtmaWxlfVxuXHRcdFx0XHRcdFx0XHRcdHNlbGVjdGVkPXt0aGlzLml0ZW1Jc1NlbGVjdGVkKGZpbGUuaWQpfVxuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZURlbGV0ZT17dGhpcy5oYW5kbGVJdGVtRGVsZXRlfVxuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVNlbGVjdD17dGhpcy5oYW5kbGVUb2dnbGVTZWxlY3R9XG5cdFx0XHRcdFx0XHRcdFx0aGFuZGxlQWN0aXZhdGU9e3RoaXMuaGFuZGxlRmlsZUFjdGl2YXRlfSAvPjtcblx0XHRcdFx0XHRcdH19KX1cblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0e3RoaXMuZ2V0Tm9JdGVtc05vdGljZSgpfVxuXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZ2FsbGVyeV9fbG9hZFwiPlxuXHRcdFx0XHRcdHt0aGlzLmdldE1vcmVCdXR0b24oKX1cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L0Ryb3B6b25lQ29tcG9uZW50PlxuXHRcdDwvZGl2Pjtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIHN1Y2Nlc3NmdWwgZmlsZSB1cGxvYWRzLlxuXHQgKlxuXHQgKiBAcGFyYW0gb2JqZWN0IGZpbGUgLSBGaWxlIGludGVyZmFjZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlXG5cdCAqL1xuXHRoYW5kbGVTdWNjZXNzZnVsVXBsb2FkKGZpbGUpIHtcblx0XHRjb25zdCBqc29uID0gSlNPTi5wYXJzZShmaWxlLnhoci5yZXNwb25zZSk7XG5cblx0XHQvLyBTaWx2ZXJTdHJpcGUgc2VuZCBiYWNrIGEgc3VjY2VzcyBjb2RlIHdpdGggYW4gZXJyb3IgbWVzc2FnZSBzb21ldGltZXMuLi5cblx0XHRpZiAodHlwZW9mIGpzb25bMF0uZXJyb3IgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR0aGlzLmhhbmRsZUZhaWxlZFVwbG9hZChmaWxlKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLnByb3BzLmFjdGlvbnMucXVldWVkRmlsZXMucmVtb3ZlUXVldWVkRmlsZShmaWxlLl9xdWV1ZWRBdFRpbWUpO1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5nYWxsZXJ5LmFkZEZpbGVzKGpzb24sIHRoaXMucHJvcHMuZ2FsbGVyeS5jb3VudCArIDEpO1xuXHR9XG5cblx0aGFuZGxlRmFpbGVkVXBsb2FkKGZpbGUsIGVycm9yTWVzc2FnZSkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5xdWV1ZWRGaWxlcy5mYWlsVXBsb2FkKGZpbGUuX3F1ZXVlZEF0VGltZSk7XG5cdH1cblxuXHRoYW5kbGVFbnRlclJvdXRlKGN0eCwgbmV4dCkge1xuXHRcdHZhciB2aWV3aW5nRm9sZGVyID0gZmFsc2U7XG5cblx0XHRjb25zdCBmb2xkZXJJRCA9IGN0eC5wYXJhbXMuaWQgfHwgMDtcblx0XHRjb25zdCBmb2xkZXJQYXRoID0gQ09OU1RBTlRTLkZPTERFUl9ST1VURS5yZXBsYWNlKCc6aWQ/JywgZm9sZGVySUQpO1xuXG5cdFx0aWYgKGN0eC5wYXJhbXMuYWN0aW9uID09PSAnc2hvdycgJiYgdHlwZW9mIGN0eC5wYXJhbXMuaWQgIT09IDApIHtcblx0XHRcdHZpZXdpbmdGb2xkZXIgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5nYWxsZXJ5LnNldFZpZXdpbmdGb2xkZXIodmlld2luZ0ZvbGRlcik7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmdhbGxlcnkuZGVzZWxlY3RGaWxlcygpO1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5nYWxsZXJ5LnJlbW92ZUZpbGVzKCk7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmdhbGxlcnkuc2V0UGF0aChmb2xkZXJQYXRoKTtcblxuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5nZXRGaWxlc0J5UGFyZW50SUQoZm9sZGVySUQpO1xuXG5cdFx0bmV4dCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgZGVsZXRpbmcgYSBmaWxlIG9yIGZvbGRlci5cblx0ICpcblx0ICogQHBhcmFtIG9iamVjdCBpdGVtIC0gVGhlIGZpbGUgb3IgZm9sZGVyIHRvIGRlbGV0ZS5cblx0ICovXG5cdGhhbmRsZUl0ZW1EZWxldGUoZXZlbnQsIGl0ZW0pIHtcblx0XHRpZiAoY29uZmlybShpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5DT05GSVJNREVMRVRFJykpKSB7XG5cdFx0XHR0aGlzLnByb3BzLmJhY2tlbmQuZGVsZXRlKGl0ZW0uaWQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYSBmaWxlIG9yIGZvbGRlciBpcyBjdXJyZW50bHkgc2VsZWN0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSBudW1iZXIgaWQgLSBUaGUgaWQgb2YgdGhlIGZpbGUgb3IgZm9sZGVyIHRvIGNoZWNrLlxuXHQgKiBAcmV0dXJuIGJvb2xlYW5cblx0ICovXG5cdGl0ZW1Jc1NlbGVjdGVkKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMucHJvcHMuZ2FsbGVyeS5zZWxlY3RlZEZpbGVzLmluZGV4T2YoaWQpID4gLTE7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBhIHVzZXIgZHJpbGxpbmcgZG93biBpbnRvIGEgZm9sZGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0gb2JqZWN0IGV2ZW50IC0gRXZlbnQgb2JqZWN0LlxuXHQgKiBAcGFyYW0gb2JqZWN0IGZvbGRlciAtIFRoZSBmb2xkZXIgdGhhdCdzIGJlaW5nIGFjdGl2YXRlZC5cblx0ICovXG5cdGhhbmRsZUZvbGRlckFjdGl2YXRlKGV2ZW50LCBmb2xkZXIpIHtcblx0XHR3aW5kb3cuc3Mucm91dGVyLnNob3coQ09OU1RBTlRTLkZPTERFUl9ST1VURS5yZXBsYWNlKCc6aWQ/JywgZm9sZGVyLmlkKSk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBhIHVzZXIgYWN0aXZhdGluZyB0aGUgZmlsZSBlZGl0b3IuXG5cdCAqXG5cdCAqIEBwYXJhbSBvYmplY3QgZXZlbnQgLSBFdmVudCBvYmplY3QuXG5cdCAqIEBwYXJhbSBvYmplY3QgZmlsZSAtIFRoZSBmaWxlIHRoYXQncyBiZWluZyBhY3RpdmF0ZWQuXG5cdCAqL1xuXHRoYW5kbGVGaWxlQWN0aXZhdGUoZXZlbnQsIGZpbGUpIHtcblx0XHQvLyBEaXNhYmxlIGZpbGUgZWRpdGluZyBpZiB0aGUgZmlsZSBoYXMgbm90IGZpbmlzaGVkIHVwbG9hZGluZ1xuXHRcdC8vIG9yIHRoZSB1cGxvYWQgaGFzIGVycm9yZWQuXG5cdFx0aWYgKGZpbGUuY3JlYXRlZCA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5nYWxsZXJ5LnNldEVkaXRpbmcoZmlsZSk7XG5cdFx0d2luZG93LnNzLnJvdXRlci5zaG93KENPTlNUQU5UUy5FRElUSU5HX1JPVVRFLnJlcGxhY2UoJzppZCcsIGZpbGUuaWQpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIHRoZSB1c2VyIHRvZ2dsaW5nIHRoZSBzZWxlY3RlZC9kZXNlbGVjdGVkIHN0YXRlIG9mIGEgZmlsZSBvciBmb2xkZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBvYmplY3QgZXZlbnQgLSBFdmVudCBvYmplY3QuXG5cdCAqIEBwYXJhbSBvYmplY3QgaXRlbSAtIFRoZSBpdGVtIGJlaW5nIHNlbGVjdGVkL2Rlc2VsZWN0ZWRcblx0ICovXG5cdGhhbmRsZVRvZ2dsZVNlbGVjdChldmVudCwgaXRlbSkge1xuXHRcdGlmICh0aGlzLnByb3BzLmdhbGxlcnkuc2VsZWN0ZWRGaWxlcy5pbmRleE9mKGl0ZW0uaWQpID09PSAtMSkge1xuXHRcdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmdhbGxlcnkuc2VsZWN0RmlsZXMoW2l0ZW0uaWRdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmdhbGxlcnkuZGVzZWxlY3RGaWxlcyhbaXRlbS5pZF0pO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZU1vcmVDbGljayhldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5wcm9wcy5iYWNrZW5kLm1vcmUoKTtcblx0fVxuXG5cdGhhbmRsZUJhY2tDbGljayhldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0d2luZG93LnNzLnJvdXRlci5zaG93KENPTlNUQU5UUy5GT0xERVJfUk9VVEUucmVwbGFjZSgnOmlkPycsIHRoaXMucHJvcHMuZ2FsbGVyeS5wYXJlbnRGb2xkZXJJRCkpO1xuXHR9XG59XG5cbkdhbGxlcnlDb250YWluZXIucHJvcFR5cGVzID0ge1xuXHRiYWNrZW5kOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cdGdhbGxlcnk6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0Zm9sZGVySUQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuXHR9KSxcblx0cXVldWVkRmlsZXM6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0aXRlbXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkXG5cdH0pXG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcblx0cmV0dXJuIHtcblx0XHRnYWxsZXJ5OiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnksXG5cdFx0cXVldWVkRmlsZXM6IHN0YXRlLmFzc2V0QWRtaW4ucXVldWVkRmlsZXNcblx0fVxufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0cmV0dXJuIHtcblx0XHRhY3Rpb25zOiB7XG5cdFx0XHRnYWxsZXJ5OiBiaW5kQWN0aW9uQ3JlYXRvcnMoZ2FsbGVyeUFjdGlvbnMsIGRpc3BhdGNoKSxcblx0XHRcdHF1ZXVlZEZpbGVzOiBiaW5kQWN0aW9uQ3JlYXRvcnMocXVldWVkRmlsZXNBY3Rpb25zLCBkaXNwYXRjaClcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoR2FsbGVyeUNvbnRhaW5lcik7XG4iLCIvKipcbiAqIEBmaWxlIEZhY3RvcnkgZm9yIGNyZWF0aW5nIGEgUmVkdXggc3RvcmUuXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCB0aHVua01pZGRsZXdhcmUgZnJvbSAncmVkdXgtdGh1bmsnOyAvLyBVc2VkIGZvciBoYW5kbGluZyBhc3luYyBzdG9yZSB1cGRhdGVzLlxuaW1wb3J0IGNyZWF0ZUxvZ2dlciBmcm9tICdyZWR1eC1sb2dnZXInOyAvLyBMb2dzIHN0YXRlIGNoYW5nZXMgdG8gdGhlIGNvbnNvbGUuIFVzZWZ1bCBmb3IgZGVidWdnaW5nLlxuaW1wb3J0IHJvb3RSZWR1Y2VyIGZyb20gJy4vcmVkdWNlcic7XG5cbi8qKlxuICogQGZ1bmMgY3JlYXRlU3RvcmVXaXRoTWlkZGxld2FyZVxuICogQHBhcmFtIGZ1bmN0aW9uIHJvb3RSZWR1Y2VyXG4gKiBAcGFyYW0gb2JqZWN0IGluaXRpYWxTdGF0ZVxuICogQGRlc2MgQ3JlYXRlcyBhIFJlZHV4IHN0b3JlIHdpdGggc29tZSBtaWRkbGV3YXJlIGFwcGxpZWQuXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBjcmVhdGVTdG9yZVdpdGhNaWRkbGV3YXJlID0gYXBwbHlNaWRkbGV3YXJlKFxuXHR0aHVua01pZGRsZXdhcmUsXG5cdGNyZWF0ZUxvZ2dlcigpXG4pKGNyZWF0ZVN0b3JlKTtcblxuLyoqXG4gKiBAZnVuYyBjb25maWd1cmVTdG9yZVxuICogQHBhcmFtIG9iamVjdCBpbml0aWFsU3RhdGVcbiAqIEByZXR1cm4gb2JqZWN0IC0gQSBSZWR1eCBzdG9yZSB0aGF0IGxldHMgeW91IHJlYWQgdGhlIHN0YXRlLCBkaXNwYXRjaCBhY3Rpb25zIGFuZCBzdWJzY3JpYmUgdG8gY2hhbmdlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29uZmlndXJlU3RvcmUoaW5pdGlhbFN0YXRlID0ge30pIHtcblx0Y29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZVdpdGhNaWRkbGV3YXJlKHJvb3RSZWR1Y2VyLCBpbml0aWFsU3RhdGUpO1xuXG5cdHJldHVybiBzdG9yZTtcbn07IiwiZXhwb3J0IGNvbnN0IEdBTExFUlkgPSB7XG4gICAgQUREX0ZJTEVTOiAnQUREX0ZJTEVTJyxcbiAgICBERVNFTEVDVF9GSUxFUzogJ0RFU0VMRUNUX0ZJTEVTJyxcbiAgICBSRU1PVkVfRklMRVM6ICdSRU1PVkVfRklMRVMnLFxuICAgIFNFTEVDVF9GSUxFUzogJ1NFTEVDVF9GSUxFUycsXG4gICAgU0VUX0VESVRJTkc6ICdTRVRfRURJVElORycsXG4gICAgU0VUX0VESVRPUl9GSUVMRFM6ICdTRVRfRURJVE9SX0ZJRUxEUycsXG4gICAgU0VUX0ZPTERFUl9JRDogJ1NFVF9GT0xERVJfSUQnLFxuICAgIFNFVF9QQVJFTlRfRk9MREVSX0lEOiAnU0VUX1BBUkVOVF9GT0xERVJfSUQnLFxuICAgIFNFVF9QQVRIOiAnU0VUX1BBVEgnLFxuICAgIFNFVF9WSUVXSU5HX0ZPTERFUjogJ1NFVF9WSUVXSU5HX0ZPTERFUicsXG4gICAgU09SVF9GSUxFUzogJ1NPUlRfRklMRVMnLFxuICAgIFVQREFURV9FRElUT1JfRklFTEQ6ICdVUERBVEVfRURJVE9SX0ZJRUxEJyxcbiAgICBVUERBVEVfRklMRTogJ1VQREFURV9GSUxFJ1xufVxuIiwiaW1wb3J0IHsgR0FMTEVSWSB9IGZyb20gJy4vYWN0aW9uLXR5cGVzJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vLi4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBBZGRzIGZpbGVzIHRvIHN0YXRlLlxuICpcbiAqIEBwYXJhbSBhcnJheSBmaWxlcyAtIEFycmF5IG9mIGZpbGUgb2JqZWN0cy5cbiAqIEBwYXJhbSBudW1iZXIgW2NvdW50XSAtIFRoZSBudW1iZXIgb2YgZmlsZXMgaW4gdGhlIGN1cnJlbnQgdmlldy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbGVzKGZpbGVzLCBjb3VudCkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCAoe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5BRERfRklMRVMsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGZpbGVzLCBjb3VudCB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGZpbGVzIGZyb20gdGhlIHN0YXRlLiBJZiBubyBwYXJhbSBpcyBwYXNzZWQgYWxsIGZpbGVzIGFyZSByZW1vdmVkXG4gKlxuICogQHBhcmFtIGFycmF5IGlkcyAtIEFycmF5IG9mIGZpbGUgaWRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRmlsZXMoaWRzKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoICh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlJFTU9WRV9GSUxFUyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgaWRzIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFVwZGF0ZXMgYSBmaWxlIHdpdGggbmV3IGRhdGEuXG4gKlxuICogQHBhcmFtIG51bWJlciBpZCAtIFRoZSBpZCBvZiB0aGUgZmlsZSB0byB1cGRhdGUuXG4gKiBAcGFyYW0gb2JqZWN0IHVwZGF0ZXMgLSBUaGUgbmV3IHZhbHVlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUZpbGUoaWQsIHVwZGF0ZXMpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5VUERBVEVfRklMRSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgaWQsIHVwZGF0ZXMgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU2VsZWN0cyBmaWxlcy4gSWYgbm8gcGFyYW0gaXMgcGFzc2VkIGFsbCBmaWxlcyBhcmUgc2VsZWN0ZWQuXG4gKlxuICogQHBhcmFtIEFycmF5IGlkcyAtIEFycmF5IG9mIGZpbGUgaWRzIHRvIHNlbGVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEZpbGVzKGlkcyA9IG51bGwpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5TRUxFQ1RfRklMRVMsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGlkcyB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXNlbGVjdHMgZmlsZXMuIElmIG5vIHBhcmFtIGlzIHBhc3NlZCBhbGwgZmlsZXMgYXJlIGRlc2VsZWN0ZWQuXG4gKlxuICogQHBhcmFtIEFycmF5IGlkcyAtIEFycmF5IG9mIGZpbGUgaWRzIHRvIGRlc2VsZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzZWxlY3RGaWxlcyhpZHMgPSBudWxsKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuREVTRUxFQ1RfRklMRVMsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGlkcyB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTdGFydHMgZWRpdGluZyB0aGUgZ2l2ZW4gZmlsZSBvciBzdG9wcyBlZGl0aW5nIGlmIG51bGwgaXMgZ2l2ZW4uXG4gKlxuICogQHBhcmFtIG9iamVjdHxudWxsIGZpbGUgLSBUaGUgZmlsZSB0byBlZGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RWRpdGluZyhmaWxlKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuU0VUX0VESVRJTkcsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGZpbGUgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhdGUgb2YgdGhlIGZpZWxkcyBmb3IgdGhlIGVkaXRvciBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIG9iamVjdCBlZGl0b3JGaWVsZHMgLSB0aGUgY3VycmVudCBmaWVsZHMgaW4gdGhlIGVkaXRvciBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEVkaXRvckZpZWxkcyhlZGl0b3JGaWVsZHMgPSBbXSkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlNFVF9FRElUT1JfRklFTERTLFxuICAgICAgICAgICAgcGF5bG9hZDogeyBlZGl0b3JGaWVsZHMgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZmllbGQuXG4gKlxuICogQHBhcmFtIG9iamVjdCB1cGRhdGVzIC0gVGhlIHZhbHVlcyB0byB1cGRhdGUgdGhlIGVkaXRvciBmaWVsZCB3aXRoLlxuICogQHBhcmFtIHN0cmluZyB1cGRhdGVzLm5hbWUgLSBUaGUgZWRpdG9yIGZpZWxkIG5hbWUuXG4gKiBAcGFyYW0gc3RyaW5nIHVwZGF0ZXMudmFsdWUgLSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBmaWVsZC5cbiAqIEBwYXJhbSBzdHJpbmcgW3VwZGF0ZXMubGFiZWxdIC0gVGhlIGZpZWxkIGxhYmVsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRWRpdG9yRmllbGQodXBkYXRlcykge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlVQREFURV9FRElUT1JfRklFTEQsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IHVwZGF0ZXMgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogVXBkYXRlcyBwdXNoIHN0YXRlIChpbnZva2luZyBhbnkgcmVnaXN0ZXJlZCBwYWdlLmpzIGhhbmRsZXJzKSBhbmQgc2V0cyB0aGUgcm91dGUgaW4gc3RhdGUuXG4gKiBDb21wb25lbnRzIHdoaWNoIGRlZmluZSByb3V0ZXMgYXJlIHJlbmRlcmVkIGJhc2VkIG9uIHRoZSBgcm91dGVgIHZhbHVlIHN0b3JlZCBpbiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0gc3RyaW5nIHBhdGggLSBUaGUgcGF0aCBmb3IgcHVzaFN0YXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0UGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuU0VUX1BBVEgsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IHBhdGggfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU29ydHMgZmlsZXMgaW4gc29tZSBvcmRlci5cbiAqXG4gKiBAcGFyYW0gZnVuYyBjb21wYXJhdG9yIC0gVXNlZCB0byBkZXRlcm1pbmUgdGhlIHNvcnQgb3JkZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0RmlsZXMoY29tcGFyYXRvcikge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlNPUlRfRklMRVMsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGNvbXBhcmF0b3IgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU2V0cyB3ZXRoZXIgb3Igbm90IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBpbnNpZGUgYSBmb2xkZXIuXG4gKlxuICogQHBhcmFtIGJvb2xlYW4gdmlld2luZ0ZvbGRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Vmlld2luZ0ZvbGRlcih2aWV3aW5nRm9sZGVyKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuU0VUX1ZJRVdJTkdfRk9MREVSLFxuICAgICAgICAgICAgcGF5bG9hZDogeyB2aWV3aW5nRm9sZGVyIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFNldHMgdGhlIHBhcmVudElEIGZvciB0aGUgY3VycmVudGx5IHZpZXdlZCBmb2xkZXIuXG4gKlxuICogQHBhcmFtIG51bWJlciBwYXJlbnRJRFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0UGFyZW50Rm9sZGVySWQocGFyZW50Rm9sZGVySUQpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5TRVRfUEFSRU5UX0ZPTERFUl9JRCxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgcGFyZW50Rm9sZGVySUQgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU2V0cyB0aGUgSUQgZm9yIHRoZSBmb2xkZXIgY3VycmVudGx5IGJlaW5nIHZpZXdlZC5cbiAqXG4gKiBAcGFyYW0gbnVtYmVyIGZvbGRlcklEXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGb2xkZXJJZChmb2xkZXJJRCkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlNFVF9GT0xERVJfSUQsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGZvbGRlcklEIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IGRlZXBGcmVlemUgZnJvbSAnZGVlcC1mcmVlemUnO1xuaW1wb3J0IHsgR0FMTEVSWSB9IGZyb20gJy4vYWN0aW9uLXR5cGVzJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnLi4vLi4vY29uc3RhbnRzLmpzJztcblxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xuICAgIGJ1bGtBY3Rpb25zOiB7XG4gICAgICAgIHBsYWNlaG9sZGVyOiBDT05TVEFOVFMuQlVMS19BQ1RJT05TX1BMQUNFSE9MREVSLFxuICAgICAgICBvcHRpb25zOiBDT05TVEFOVFMuQlVMS19BQ1RJT05TXG4gICAgfSxcbiAgICBjb3VudDogMCwgLy8gVGhlIG51bWJlciBvZiBmaWxlcyBpbiB0aGUgY3VycmVudCB2aWV3XG4gICAgZWRpdGluZzogbnVsbCwgLy8gVGhlIGZpbGUgYmVpbmcgZWRpdGVkXG4gICAgZWRpdG9yRmllbGRzOiBbXSwgLy8gVGhlIGlucHV0IGZpZWxkcyBmb3IgZWRpdGluZyBmaWxlcy4gSGFyZGNvZGVkIHVudGlsIGZvcm0gZmllbGQgc2NoZW1hIGlzIGltcGxlbWVudGVkLlxuICAgIGZpbGVzOiBbXSxcbiAgICBmb2xkZXJJRDogMCxcbiAgICBmb2N1czogZmFsc2UsXG4gICAgcGFyZW50Rm9sZGVySUQ6IG51bGwsXG4gICAgcGF0aDogbnVsbCwgLy8gVGhlIGN1cnJlbnQgbG9jYXRpb24gcGF0aCB0aGUgYXBwIGlzIG9uXG4gICAgc2VsZWN0ZWRGaWxlczogW10sXG4gICAgdmlld2luZ0ZvbGRlcjogZmFsc2Vcbn07XG5cbi8qKlxuICogUmVkdWNlciBmb3IgdGhlIGBhc3NldEFkbWluLmdhbGxlcnlgIHN0YXRlIGtleS5cbiAqXG4gKiBAcGFyYW0gb2JqZWN0IHN0YXRlXG4gKiBAcGFyYW0gb2JqZWN0IGFjdGlvbiAtIFRoZSBkaXNwYXRjaGVkIGFjdGlvbi5cbiAqIEBwYXJhbSBzdHJpbmcgYWN0aW9uLnR5cGUgLSBOYW1lIG9mIHRoZSBkaXNwYXRjaGVkIGFjdGlvbi5cbiAqIEBwYXJhbSBvYmplY3QgW2FjdGlvbi5wYXlsb2FkXSAtIE9wdGlvbmFsIGRhdGEgcGFzc2VkIHdpdGggdGhlIGFjdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2FsbGVyeVJlZHVjZXIoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikge1xuXG4gICAgdmFyIG5leHRTdGF0ZTtcblxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuICAgICAgICBjYXNlIEdBTExFUlkuQUREX0ZJTEVTOlxuICAgICAgICAgICAgbGV0IG5leHRGaWxlc1N0YXRlID0gW107IC8vIENsb25lIHRoZSBzdGF0ZS5maWxlcyBhcnJheVxuXG4gICAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5maWxlcy5mb3JFYWNoKHBheWxvYWRGaWxlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZUluU3RhdGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHN0YXRlLmZpbGVzLmZvckVhY2goc3RhdGVGaWxlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgZWFjaCBmaWxlIGdpdmVuIGlzIGFscmVhZHkgaW4gdGhlIHN0YXRlXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZUZpbGUuaWQgPT09IHBheWxvYWRGaWxlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlSW5TdGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBPbmx5IGFkZCB0aGUgZmlsZSBpZiBpdCBpc24ndCBhbHJlYWR5IGluIHRoZSBzdGF0ZVxuICAgICAgICAgICAgICAgIGlmICghZmlsZUluU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEZpbGVzU3RhdGUucHVzaChwYXlsb2FkRmlsZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBjb3VudDogdHlwZW9mIGFjdGlvbi5wYXlsb2FkLmNvdW50ICE9PSAndW5kZWZpbmVkJyA/IGFjdGlvbi5wYXlsb2FkLmNvdW50IDogc3RhdGUuY291bnQsXG4gICAgICAgICAgICAgICAgZmlsZXM6IG5leHRGaWxlc1N0YXRlLmNvbmNhdChzdGF0ZS5maWxlcylcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBjYXNlIEdBTExFUlkuUkVNT1ZFX0ZJTEVTOlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24ucGF5bG9hZC5pZHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gcGFyYW0gd2FzIHBhc3NlZCwgcmVtb3ZlIGV2ZXJ5dGhpbmcuXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBjb3VudDogMCwgZmlsZXM6IFtdIH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZGVhbGluZyB3aXRoIGFuIGFycmF5IG9mIGlkc1xuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IHN0YXRlLmZpbGVzLmZpbHRlcihmaWxlID0+IGFjdGlvbi5wYXlsb2FkLmlkcy5pbmRleE9mKGZpbGUuaWQpID09PSAtMSkubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBmaWxlczogc3RhdGUuZmlsZXMuZmlsdGVyKGZpbGUgPT4gYWN0aW9uLnBheWxvYWQuaWRzLmluZGV4T2YoZmlsZS5pZCkgPT09IC0xKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcblxuICAgICAgICBjYXNlIEdBTExFUlkuVVBEQVRFX0ZJTEU6XG4gICAgICAgICAgICBsZXQgZmlsZUluZGV4ID0gc3RhdGUuZmlsZXMubWFwKGZpbGUgPT4gZmlsZS5pZCkuaW5kZXhPZihhY3Rpb24ucGF5bG9hZC5pZCk7XG4gICAgICAgICAgICBsZXQgdXBkYXRlZEZpbGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5maWxlc1tmaWxlSW5kZXhdLCBhY3Rpb24ucGF5bG9hZC51cGRhdGVzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBmaWxlczogc3RhdGUuZmlsZXMubWFwKGZpbGUgPT4gZmlsZS5pZCA9PT0gdXBkYXRlZEZpbGUuaWQgPyB1cGRhdGVkRmlsZSA6IGZpbGUpXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFTEVDVF9GSUxFUzpcbiAgICAgICAgICAgIGlmIChhY3Rpb24ucGF5bG9hZC5pZHMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBwYXJhbSB3YXMgcGFzc2VkLCBhZGQgZXZlcnl0aGluZyB0aGF0IGlzbid0IGN1cnJlbnRseSBzZWxlY3RlZCwgdG8gdGhlIHNlbGVjdGVkRmlsZXMgYXJyYXkuXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEZpbGVzOiBzdGF0ZS5zZWxlY3RlZEZpbGVzLmNvbmNhdChzdGF0ZS5maWxlcy5tYXAoZmlsZSA9PiBmaWxlLmlkKS5maWx0ZXIoaWQgPT4gc3RhdGUuc2VsZWN0ZWRGaWxlcy5pbmRleE9mKGlkKSA9PT0gLTEpKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZGVhbGluZyB3aXRoIGFuIGFycmF5IGlmIGlkcyB0byBzZWxlY3QuXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEZpbGVzOiBzdGF0ZS5zZWxlY3RlZEZpbGVzLmNvbmNhdChhY3Rpb24ucGF5bG9hZC5pZHMuZmlsdGVyKGlkID0+IHN0YXRlLnNlbGVjdGVkRmlsZXMuaW5kZXhPZihpZCkgPT09IC0xKSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLkRFU0VMRUNUX0ZJTEVTOlxuICAgICAgICAgICAgaWYgKGFjdGlvbi5wYXlsb2FkLmlkcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIE5vIHBhcmFtIHdhcyBwYXNzZWQsIGRlc2VsZWN0IGV2ZXJ5dGhpbmcuXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBzZWxlY3RlZEZpbGVzOiBbXSB9KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGRlYWxpbmcgd2l0aCBhbiBhcnJheSBvZiBpZHMgdG8gZGVzZWxlY3QuXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEZpbGVzOiBzdGF0ZS5zZWxlY3RlZEZpbGVzLmZpbHRlcihpZCA9PiBhY3Rpb24ucGF5bG9hZC5pZHMuaW5kZXhPZihpZCkgPT09IC0xKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcblxuICAgICAgICBjYXNlIEdBTExFUlkuU0VUX0VESVRJTkc6XG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGVkaXRpbmc6IGFjdGlvbi5wYXlsb2FkLmZpbGVcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBjYXNlIEdBTExFUlkuU0VUX0VESVRPUl9GSUVMRFM6XG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGVkaXRvckZpZWxkczogYWN0aW9uLnBheWxvYWQuZWRpdG9yRmllbGRzXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlVQREFURV9FRElUT1JfRklFTEQ6XG4gICAgICAgICAgICBsZXQgZmllbGRJbmRleCA9IHN0YXRlLmVkaXRvckZpZWxkcy5tYXAoZmllbGQgPT4gZmllbGQubmFtZSkuaW5kZXhPZihhY3Rpb24ucGF5bG9hZC51cGRhdGVzLm5hbWUpLFxuICAgICAgICAgICAgICAgIHVwZGF0ZWRGaWVsZCA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmVkaXRvckZpZWxkc1tmaWVsZEluZGV4XSwgYWN0aW9uLnBheWxvYWQudXBkYXRlcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZWRpdG9yRmllbGRzOiBzdGF0ZS5lZGl0b3JGaWVsZHMubWFwKGZpZWxkID0+IGZpZWxkLm5hbWUgPT09IHVwZGF0ZWRGaWVsZC5uYW1lID8gdXBkYXRlZEZpZWxkIDogZmllbGQpXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlNPUlRfRklMRVM6XG4gICAgICAgICAgICBsZXQgZm9sZGVycyA9IHN0YXRlLmZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUudHlwZSA9PT0gJ2ZvbGRlcicpLFxuICAgICAgICAgICAgICAgIGZpbGVzID0gc3RhdGUuZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS50eXBlICE9PSAnZm9sZGVyJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZmlsZXM6IGZvbGRlcnMuc29ydChhY3Rpb24ucGF5bG9hZC5jb21wYXJhdG9yKS5jb25jYXQoZmlsZXMuc29ydChhY3Rpb24ucGF5bG9hZC5jb21wYXJhdG9yKSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBjYXNlIEdBTExFUlkuU0VUX1BBVEg6XG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIHBhdGg6IGFjdGlvbi5wYXlsb2FkLnBhdGhcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBjYXNlIEdBTExFUlkuU0VUX1ZJRVdJTkdfRk9MREVSOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICB2aWV3aW5nRm9sZGVyOiBhY3Rpb24ucGF5bG9hZC52aWV3aW5nRm9sZGVyXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFVF9QQVJFTlRfRk9MREVSX0lEOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRGb2xkZXJJRDogYWN0aW9uLnBheWxvYWQucGFyZW50Rm9sZGVySURcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBjYXNlIEdBTExFUlkuU0VUX0ZPTERFUl9JRDpcbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZm9sZGVySUQ6IGFjdGlvbi5wYXlsb2FkLmZvbGRlcklEXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgQUREX1FVRVVFRF9GSUxFOiAnQUREX1FVRVVFRF9GSUxFJyxcbiAgICBGQUlMX1VQTE9BRDogJ0ZBSUxfVVBMT0FEJyxcbiAgICBQVVJHRV9VUExPQURfUVVFVUU6ICdQVVJHRV9VUExPQURfUVVFVUUnLFxuICAgIFJFTU9WRV9RVUVVRURfRklMRTogJ1JFTU9WRV9RVUVVRURfRklMRScsXG4gICAgU1VDQ0VFRF9VUExPQUQ6ICdTVUNDRUVEX1VQTE9BRCcsXG4gICAgVVBEQVRFX1FVRVVFRF9GSUxFOiAnVVBEQVRFX1FVRVVFRF9GSUxFJ1xufTtcbiIsImltcG9ydCBBQ1RJT05fVFlQRVMgZnJvbSAnLi9hY3Rpb24tdHlwZXMnO1xuXG4vKipcbiAqIEFkZHMgYSBmaWxlIHdoaWNoIGhhcyBub3QgYmVlbiBwZXJzaXN0ZWQgdG8gdGhlIHNlcnZlciB5ZXQuXG4gKlxuICogQHBhcmFtIG9iamVjdCBmaWxlIC0gRmlsZSBpbnRlcmZhY2UuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUXVldWVkRmlsZShmaWxlKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEFDVElPTl9UWVBFUy5BRERfUVVFVUVEX0ZJTEUsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGZpbGUgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogVXBkYXRlcyBhIHF1ZXVlZCBmaWxlIGlmIGl0IGZhaWxzIHRvIHVwbG9hZC5cbiAqXG4gKiBAcGFyYW0gbnVtYmVyIHF1ZXVlZEF0VGltZSAtIFRpbWVzdGFtcCAoRGF0ZS5ub3coKSkgd2hlbiB0aGUgZmlsZSB3YXMgcXVldWVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmFpbFVwbG9hZChxdWV1ZWRBdFRpbWUpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogQUNUSU9OX1RZUEVTLkZBSUxfVVBMT0FELFxuICAgICAgICAgICAgcGF5bG9hZDogeyBxdWV1ZWRBdFRpbWUgfVxuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG4vKipcbiAqIFB1cmdlcyB0aGUgdXBsb2FkIHF1ZXVlLlxuICogICAtIEZhaWxlZCB1cGxvYWRzIGFyZSByZW1vdmVkLlxuICogICAtIFN1Y2Nlc3NmdWwgdXBsb2FkcyBhcmUgcmVtb3ZlZC5cbiAqICAgLSBQZW5kaW5nIHVwbG9hZHMgYXJlIGlnbm9yZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwdXJnZVVwbG9hZFF1ZXVlKCkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBBQ1RJT05fVFlQRVMuUFVSR0VfVVBMT0FEX1FVRVVFLFxuICAgICAgICAgICAgcGF5bG9hZDogbnVsbFxuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYSBmaWxlIGZyb20gdGhlIHF1ZXVlLlxuICpcbiAqIEBwYXJhbSBudW1iZXIgcXVldWVkQXRUaW1lIC0gVGltZXN0YW1wIChEYXRlLm5vdygpKSB3aGVuIHRoZSBmaWxlIHdhcyBxdWV1ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVRdWV1ZWRGaWxlKHF1ZXVlZEF0VGltZSkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBBQ1RJT05fVFlQRVMuUkVNT1ZFX1FVRVVFRF9GSUxFLFxuICAgICAgICAgICAgcGF5bG9hZDogeyBxdWV1ZWRBdFRpbWUgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogVXBkYXRlcyBhIHF1ZXVlZCBmaWxlIHdoZW4gaXQgc3VjY2Vzc2Z1bGx5IHVwbG9hZHMuXG4gKlxuICogQHBhcmFtIG51bWJlciBxdWV1ZWRBdFRpbWUgLSBUaW1lc3RhbXAgKERhdGUubm93KCkpIHdoZW4gdGhlIGZpbGUgd2FzIHF1ZXVlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1Y2NlZWRVcGxvYWQocXVldWVkQXRUaW1lKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEFDVElPTl9UWVBFUy5TVUNDRUVEX1VQTE9BRCxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgcXVldWVkQXRUaW1lIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbn1cblxuLyoqXG4gKiBPdmVycmlkZSB0aGUgdmFsdWVzIG9mIGEgY3VycmVudGx5IHF1ZXVlZCBmaWxlLlxuICpcbiAqIEBwYXJhbSBudW1iZXIgcXVldWVkQXRUaW1lIC0gVGltZXN0YW1wIChEYXRlLm5vdygpKSB3aGVuIHRoZSBmaWxlIHdhcyBxdWV1ZWQuXG4gKiBAcGFyYW0gb2JqZWN0IHVwZGF0ZXMgLSBUaGUgdmFsdWVzIHRvIHVwZGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVF1ZXVlZEZpbGUocXVldWVkQXRUaW1lLCB1cGRhdGVzKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEFDVElPTl9UWVBFUy5VUERBVEVfUVVFVUVEX0ZJTEUsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IHF1ZXVlZEF0VGltZSwgdXBkYXRlcyB9XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iLCJpbXBvcnQgZGVlcEZyZWV6ZSBmcm9tICdkZWVwLWZyZWV6ZSc7XG5pbXBvcnQgQUNUSU9OX1RZUEVTIGZyb20gJy4vYWN0aW9uLXR5cGVzJztcbmltcG9ydCBpMThuIGZyb20gJ2kxOG4nO1xuXG5mdW5jdGlvbiBmaWxlRmFjdG9yeSgpIHtcbiAgICByZXR1cm4gZGVlcEZyZWV6ZSh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IG51bGwsXG4gICAgICAgICAgICAgICAgd2lkdGg6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYmFzZW5hbWU6IG51bGwsXG4gICAgICAgIGNhbkRlbGV0ZTogZmFsc2UsXG4gICAgICAgIGNhbkVkaXQ6IGZhbHNlLFxuICAgICAgICBjYXRlZ29yeTogbnVsbCxcbiAgICAgICAgY3JlYXRlZDogbnVsbCxcbiAgICAgICAgZXh0ZW5zaW9uOiBudWxsLFxuICAgICAgICBmaWxlbmFtZTogbnVsbCxcbiAgICAgICAgaWQ6IDAsXG4gICAgICAgIGxhc3RVcGRhdGVkOiBudWxsLFxuICAgICAgICBtZXNzYWdlczogbnVsbCxcbiAgICAgICAgb3duZXI6IHtcbiAgICAgICAgICAgIGlkOiAwLFxuICAgICAgICAgICAgdGl0bGU6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgcGFyZW50OiB7XG4gICAgICAgICAgICBmaWxlbmFtZTogbnVsbCxcbiAgICAgICAgICAgIGlkOiAwLFxuICAgICAgICAgICAgdGl0bGU6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgcXVldWVkQXRUaW1lOiBudWxsLFxuICAgICAgICBzaXplOiBudWxsLFxuICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgdXJsOiBudWxsLFxuICAgICAgICB4aHI6IG51bGxcbiAgICB9KTtcbn1cblxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xuICAgIGl0ZW1zOiBbXVxufTtcblxuZnVuY3Rpb24gcXVldWVkRmlsZXNSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcblxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuICAgICAgICBjYXNlIEFDVElPTl9UWVBFUy5BRERfUVVFVUVEX0ZJTEU6XG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGl0ZW1zOiBzdGF0ZS5pdGVtcy5jb25jYXQoW09iamVjdC5hc3NpZ24oe30sIGZpbGVGYWN0b3J5KCksIGFjdGlvbi5wYXlsb2FkLmZpbGUpXSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBjYXNlIEFDVElPTl9UWVBFUy5GQUlMX1VQTE9BRDpcbiAgICAgICAgICAgIC8vIEFkZCBhbiBlcnJvciBtZXNzYWdlIHRvIHRoZSBmYWlsZWQgZmlsZS5cbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgaXRlbXM6IHN0YXRlLml0ZW1zLm1hcCgoZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZS5xdWV1ZWRBdFRpbWUgPT09IGFjdGlvbi5wYXlsb2FkLnF1ZXVlZEF0VGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGZpbGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRST1BaT05FX0ZBSUxFRF9VUExPQUQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFDbGFzczogJ2Vycm9yJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBBQ1RJT05fVFlQRVMuUFVSR0VfVVBMT0FEX1FVRVVFOlxuICAgICAgICAgICAgLy8gRmFpbGVkIHVwbG9hZHMgYXJlIHJlbW92ZWQuXG4gICAgICAgICAgICAvLyBTdWNjZXNzZnVsIGZpbGUgdXBsb2FkcyByZW1vdmVkLlxuICAgICAgICAgICAgLy8gUGVuZGluZyB1cGxvYWRzIGFyZSBpZ25vcmVkLlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpdGVtczogc3RhdGUuaXRlbXMuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGZpbGUubWVzc2FnZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhbnkgb2YgdGhlIGZpbGUncyBtZXNzYWdlcyBhcmUgb2YgdHlwZSAnZXJyb3InIG9yICdzdWNjZXNzJyB0aGVuIHJldHVybiBmYWxzZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhZmlsZS5tZXNzYWdlcy5maWx0ZXIobWVzc2FnZSA9PiBtZXNzYWdlLnR5cGUgPT09ICdlcnJvcicgfHwgbWVzc2FnZS50eXBlID09PSAnc3VjY2VzcycpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgQUNUSU9OX1RZUEVTLlJFTU9WRV9RVUVVRURfRklMRTpcbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgaXRlbXM6IHN0YXRlLml0ZW1zLmZpbHRlcigoZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsZS5xdWV1ZWRBdFRpbWUgIT09IGFjdGlvbi5wYXlsb2FkLnF1ZXVlZEF0VGltZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgQUNUSU9OX1RZUEVTLlNVQ0NFRURfVVBMT0FEOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpdGVtczogc3RhdGUuaXRlbXMubWFwKChmaWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlLnF1ZXVlZEF0VGltZSA9PT0gYWN0aW9uLnBheWxvYWQucXVldWVkQXRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZmlsZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfU1VDQ0VTU19VUExPQUQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYUNsYXNzOiAnc3VjY2VzcydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgQUNUSU9OX1RZUEVTLlVQREFURV9RVUVVRURfRklMRTpcbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgaXRlbXM6IHN0YXRlLml0ZW1zLm1hcCgoZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZS5xdWV1ZWRBdFRpbWUgPT09IGFjdGlvbi5wYXlsb2FkLnF1ZXVlZEF0VGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGZpbGUsIGFjdGlvbi5wYXlsb2FkLnVwZGF0ZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcXVldWVkRmlsZXNSZWR1Y2VyO1xuIiwiLyoqXG4gKiBAZmlsZSBUaGUgcmVkdWNlciB3aGljaCBvcGVyYXRlcyBvbiB0aGUgUmVkdXggc3RvcmUuXG4gKi9cblxuaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0IGdhbGxlcnlSZWR1Y2VyIGZyb20gJy4vZ2FsbGVyeS9yZWR1Y2VyJztcbmltcG9ydCBxdWV1ZWRGaWxlc1JlZHVjZXIgZnJvbSAnLi9xdWV1ZWQtZmlsZXMvcmVkdWNlcic7XG5cbi8qKlxuICogT3BlcmF0ZXMgb24gdGhlIFJlZHV4IHN0b3JlIHRvIHVwZGF0ZSBhcHBsaWNhdGlvbiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0gb2JqZWN0IHN0YXRlIC0gVGhlIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gb2JqZWN0IGFjdGlvbiAtIFRoZSBkaXNwYXRjaGVkIGFjdGlvbi5cbiAqIEBwYXJhbSBzdHJpbmcgYWN0aW9uLnR5cGUgLSBUaGUgdHlwZSBvZiBhY3Rpb24gdGhhdCBoYXMgYmVlbiBkaXNwYXRjaGVkLlxuICogQHBhcmFtIG9iamVjdCBbYWN0aW9uLnBheWxvYWRdIC0gT3B0aW9uYWwgZGF0YSBwYXNzZWQgd2l0aCB0aGUgYWN0aW9uLlxuICovXG5jb25zdCByb290UmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gICAgYXNzZXRBZG1pbjogY29tYmluZVJlZHVjZXJzKHtcbiAgICAgICAgZ2FsbGVyeTogZ2FsbGVyeVJlZHVjZXIsXG4gICAgICAgIHF1ZXVlZEZpbGVzOiBxdWV1ZWRGaWxlc1JlZHVjZXJcbiAgICB9KVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiXG4vKlxuICpcbiAqIE1vcmUgaW5mbyBhdCBbd3d3LmRyb3B6b25lanMuY29tXShodHRwOi8vd3d3LmRyb3B6b25lanMuY29tKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMiwgTWF0aWFzIE1lbm9cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBEcm9wem9uZSwgRW1pdHRlciwgY2FtZWxpemUsIGNvbnRlbnRMb2FkZWQsIGRldGVjdFZlcnRpY2FsU3F1YXNoLCBkcmF3SW1hZ2VJT1NGaXgsIG5vb3AsIHdpdGhvdXQsXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxuICAgIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICAgIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG4gIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuXG4gIEVtaXR0ZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRW1pdHRlcigpIHt9XG5cbiAgICBFbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gRW1pdHRlci5wcm90b3R5cGUub247XG5cbiAgICBFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50LCBmbikge1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAgICAgaWYgKCF0aGlzLl9jYWxsYmFja3NbZXZlbnRdKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NhbGxiYWNrc1tldmVudF0ucHVzaChmbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MsIGNhbGxiYWNrLCBjYWxsYmFja3MsIGV2ZW50LCBfaSwgX2xlbjtcbiAgICAgIGV2ZW50ID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgICAgIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFja3NbX2ldO1xuICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBFbWl0dGVyLnByb3RvdHlwZS5vZmY7XG5cbiAgICBFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBFbWl0dGVyLnByb3RvdHlwZS5vZmY7XG5cbiAgICBFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gRW1pdHRlci5wcm90b3R5cGUub2ZmO1xuXG4gICAgRW1pdHRlci5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24oZXZlbnQsIGZuKSB7XG4gICAgICB2YXIgY2FsbGJhY2ssIGNhbGxiYWNrcywgaSwgX2ksIF9sZW47XG4gICAgICBpZiAoIXRoaXMuX2NhbGxiYWNrcyB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IF9pID0gMCwgX2xlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IF9pIDwgX2xlbjsgaSA9ICsrX2kpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFja3NbaV07XG4gICAgICAgIGlmIChjYWxsYmFjayA9PT0gZm4pIHtcbiAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgcmV0dXJuIEVtaXR0ZXI7XG5cbiAgfSkoKTtcblxuICBEcm9wem9uZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICB2YXIgZXh0ZW5kLCByZXNvbHZlT3B0aW9uO1xuXG4gICAgX19leHRlbmRzKERyb3B6b25lLCBfc3VwZXIpO1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLkVtaXR0ZXIgPSBFbWl0dGVyO1xuXG5cbiAgICAvKlxuICAgIFRoaXMgaXMgYSBsaXN0IG9mIGFsbCBhdmFpbGFibGUgZXZlbnRzIHlvdSBjYW4gcmVnaXN0ZXIgb24gYSBkcm9wem9uZSBvYmplY3QuXG4gICAgXG4gICAgWW91IGNhbiByZWdpc3RlciBhbiBldmVudCBoYW5kbGVyIGxpa2UgdGhpczpcbiAgICBcbiAgICAgICAgZHJvcHpvbmUub24oXCJkcmFnRW50ZXJcIiwgZnVuY3Rpb24oKSB7IH0pO1xuICAgICAqL1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmV2ZW50cyA9IFtcImRyb3BcIiwgXCJkcmFnc3RhcnRcIiwgXCJkcmFnZW5kXCIsIFwiZHJhZ2VudGVyXCIsIFwiZHJhZ292ZXJcIiwgXCJkcmFnbGVhdmVcIiwgXCJhZGRlZGZpbGVcIiwgXCJhZGRlZGZpbGVzXCIsIFwicmVtb3ZlZGZpbGVcIiwgXCJ0aHVtYm5haWxcIiwgXCJlcnJvclwiLCBcImVycm9ybXVsdGlwbGVcIiwgXCJwcm9jZXNzaW5nXCIsIFwicHJvY2Vzc2luZ211bHRpcGxlXCIsIFwidXBsb2FkcHJvZ3Jlc3NcIiwgXCJ0b3RhbHVwbG9hZHByb2dyZXNzXCIsIFwic2VuZGluZ1wiLCBcInNlbmRpbmdtdWx0aXBsZVwiLCBcInN1Y2Nlc3NcIiwgXCJzdWNjZXNzbXVsdGlwbGVcIiwgXCJjYW5jZWxlZFwiLCBcImNhbmNlbGVkbXVsdGlwbGVcIiwgXCJjb21wbGV0ZVwiLCBcImNvbXBsZXRlbXVsdGlwbGVcIiwgXCJyZXNldFwiLCBcIm1heGZpbGVzZXhjZWVkZWRcIiwgXCJtYXhmaWxlc3JlYWNoZWRcIiwgXCJxdWV1ZWNvbXBsZXRlXCJdO1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdXJsOiBudWxsLFxuICAgICAgbWV0aG9kOiBcInBvc3RcIixcbiAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG4gICAgICBwYXJhbGxlbFVwbG9hZHM6IDIsXG4gICAgICB1cGxvYWRNdWx0aXBsZTogZmFsc2UsXG4gICAgICBtYXhGaWxlc2l6ZTogMjU2LFxuICAgICAgcGFyYW1OYW1lOiBcImZpbGVcIixcbiAgICAgIGNyZWF0ZUltYWdlVGh1bWJuYWlsczogdHJ1ZSxcbiAgICAgIG1heFRodW1ibmFpbEZpbGVzaXplOiAxMCxcbiAgICAgIHRodW1ibmFpbFdpZHRoOiAxMjAsXG4gICAgICB0aHVtYm5haWxIZWlnaHQ6IDEyMCxcbiAgICAgIGZpbGVzaXplQmFzZTogMTAwMCxcbiAgICAgIG1heEZpbGVzOiBudWxsLFxuICAgICAgcGFyYW1zOiB7fSxcbiAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgIGlnbm9yZUhpZGRlbkZpbGVzOiB0cnVlLFxuICAgICAgYWNjZXB0ZWRGaWxlczogbnVsbCxcbiAgICAgIGFjY2VwdGVkTWltZVR5cGVzOiBudWxsLFxuICAgICAgYXV0b1Byb2Nlc3NRdWV1ZTogdHJ1ZSxcbiAgICAgIGF1dG9RdWV1ZTogdHJ1ZSxcbiAgICAgIGFkZFJlbW92ZUxpbmtzOiBmYWxzZSxcbiAgICAgIHByZXZpZXdzQ29udGFpbmVyOiBudWxsLFxuICAgICAgaGlkZGVuSW5wdXRDb250YWluZXI6IFwiYm9keVwiLFxuICAgICAgY2FwdHVyZTogbnVsbCxcbiAgICAgIHJlbmFtZUZpbGVuYW1lOiBudWxsLFxuICAgICAgZGljdERlZmF1bHRNZXNzYWdlOiBcIkRyb3AgZmlsZXMgaGVyZSB0byB1cGxvYWRcIixcbiAgICAgIGRpY3RGYWxsYmFja01lc3NhZ2U6IFwiWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgZHJhZyduJ2Ryb3AgZmlsZSB1cGxvYWRzLlwiLFxuICAgICAgZGljdEZhbGxiYWNrVGV4dDogXCJQbGVhc2UgdXNlIHRoZSBmYWxsYmFjayBmb3JtIGJlbG93IHRvIHVwbG9hZCB5b3VyIGZpbGVzIGxpa2UgaW4gdGhlIG9sZGVuIGRheXMuXCIsXG4gICAgICBkaWN0RmlsZVRvb0JpZzogXCJGaWxlIGlzIHRvbyBiaWcgKHt7ZmlsZXNpemV9fU1pQikuIE1heCBmaWxlc2l6ZToge3ttYXhGaWxlc2l6ZX19TWlCLlwiLFxuICAgICAgZGljdEludmFsaWRGaWxlVHlwZTogXCJZb3UgY2FuJ3QgdXBsb2FkIGZpbGVzIG9mIHRoaXMgdHlwZS5cIixcbiAgICAgIGRpY3RSZXNwb25zZUVycm9yOiBcIlNlcnZlciByZXNwb25kZWQgd2l0aCB7e3N0YXR1c0NvZGV9fSBjb2RlLlwiLFxuICAgICAgZGljdENhbmNlbFVwbG9hZDogXCJDYW5jZWwgdXBsb2FkXCIsXG4gICAgICBkaWN0Q2FuY2VsVXBsb2FkQ29uZmlybWF0aW9uOiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBjYW5jZWwgdGhpcyB1cGxvYWQ/XCIsXG4gICAgICBkaWN0UmVtb3ZlRmlsZTogXCJSZW1vdmUgZmlsZVwiLFxuICAgICAgZGljdFJlbW92ZUZpbGVDb25maXJtYXRpb246IG51bGwsXG4gICAgICBkaWN0TWF4RmlsZXNFeGNlZWRlZDogXCJZb3UgY2FuIG5vdCB1cGxvYWQgYW55IG1vcmUgZmlsZXMuXCIsXG4gICAgICBhY2NlcHQ6IGZ1bmN0aW9uKGZpbGUsIGRvbmUpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUoKTtcbiAgICAgIH0sXG4gICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgICB9LFxuICAgICAgZm9yY2VGYWxsYmFjazogZmFsc2UsXG4gICAgICBmYWxsYmFjazogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjaGlsZCwgbWVzc2FnZUVsZW1lbnQsIHNwYW4sIF9pLCBfbGVuLCBfcmVmO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lID0gXCJcIiArIHRoaXMuZWxlbWVudC5jbGFzc05hbWUgKyBcIiBkei1icm93c2VyLW5vdC1zdXBwb3J0ZWRcIjtcbiAgICAgICAgX3JlZiA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRpdlwiKTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgY2hpbGQgPSBfcmVmW19pXTtcbiAgICAgICAgICBpZiAoLyhefCApZHotbWVzc2FnZSgkfCApLy50ZXN0KGNoaWxkLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VFbGVtZW50ID0gY2hpbGQ7XG4gICAgICAgICAgICBjaGlsZC5jbGFzc05hbWUgPSBcImR6LW1lc3NhZ2VcIjtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1lc3NhZ2VFbGVtZW50KSB7XG4gICAgICAgICAgbWVzc2FnZUVsZW1lbnQgPSBEcm9wem9uZS5jcmVhdGVFbGVtZW50KFwiPGRpdiBjbGFzcz1cXFwiZHotbWVzc2FnZVxcXCI+PHNwYW4+PC9zcGFuPjwvZGl2PlwiKTtcbiAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQobWVzc2FnZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHNwYW4gPSBtZXNzYWdlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNwYW5cIilbMF07XG4gICAgICAgIGlmIChzcGFuKSB7XG4gICAgICAgICAgaWYgKHNwYW4udGV4dENvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5kaWN0RmFsbGJhY2tNZXNzYWdlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3Bhbi5pbm5lclRleHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgc3Bhbi5pbm5lclRleHQgPSB0aGlzLm9wdGlvbnMuZGljdEZhbGxiYWNrTWVzc2FnZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmdldEZhbGxiYWNrRm9ybSgpKTtcbiAgICAgIH0sXG4gICAgICByZXNpemU6IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgdmFyIGluZm8sIHNyY1JhdGlvLCB0cmdSYXRpbztcbiAgICAgICAgaW5mbyA9IHtcbiAgICAgICAgICBzcmNYOiAwLFxuICAgICAgICAgIHNyY1k6IDAsXG4gICAgICAgICAgc3JjV2lkdGg6IGZpbGUud2lkdGgsXG4gICAgICAgICAgc3JjSGVpZ2h0OiBmaWxlLmhlaWdodFxuICAgICAgICB9O1xuICAgICAgICBzcmNSYXRpbyA9IGZpbGUud2lkdGggLyBmaWxlLmhlaWdodDtcbiAgICAgICAgaW5mby5vcHRXaWR0aCA9IHRoaXMub3B0aW9ucy50aHVtYm5haWxXaWR0aDtcbiAgICAgICAgaW5mby5vcHRIZWlnaHQgPSB0aGlzLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0O1xuICAgICAgICBpZiAoKGluZm8ub3B0V2lkdGggPT0gbnVsbCkgJiYgKGluZm8ub3B0SGVpZ2h0ID09IG51bGwpKSB7XG4gICAgICAgICAgaW5mby5vcHRXaWR0aCA9IGluZm8uc3JjV2lkdGg7XG4gICAgICAgICAgaW5mby5vcHRIZWlnaHQgPSBpbmZvLnNyY0hlaWdodDtcbiAgICAgICAgfSBlbHNlIGlmIChpbmZvLm9wdFdpZHRoID09IG51bGwpIHtcbiAgICAgICAgICBpbmZvLm9wdFdpZHRoID0gc3JjUmF0aW8gKiBpbmZvLm9wdEhlaWdodDtcbiAgICAgICAgfSBlbHNlIGlmIChpbmZvLm9wdEhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgaW5mby5vcHRIZWlnaHQgPSAoMSAvIHNyY1JhdGlvKSAqIGluZm8ub3B0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgdHJnUmF0aW8gPSBpbmZvLm9wdFdpZHRoIC8gaW5mby5vcHRIZWlnaHQ7XG4gICAgICAgIGlmIChmaWxlLmhlaWdodCA8IGluZm8ub3B0SGVpZ2h0IHx8IGZpbGUud2lkdGggPCBpbmZvLm9wdFdpZHRoKSB7XG4gICAgICAgICAgaW5mby50cmdIZWlnaHQgPSBpbmZvLnNyY0hlaWdodDtcbiAgICAgICAgICBpbmZvLnRyZ1dpZHRoID0gaW5mby5zcmNXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoc3JjUmF0aW8gPiB0cmdSYXRpbykge1xuICAgICAgICAgICAgaW5mby5zcmNIZWlnaHQgPSBmaWxlLmhlaWdodDtcbiAgICAgICAgICAgIGluZm8uc3JjV2lkdGggPSBpbmZvLnNyY0hlaWdodCAqIHRyZ1JhdGlvO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmZvLnNyY1dpZHRoID0gZmlsZS53aWR0aDtcbiAgICAgICAgICAgIGluZm8uc3JjSGVpZ2h0ID0gaW5mby5zcmNXaWR0aCAvIHRyZ1JhdGlvO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpbmZvLnNyY1ggPSAoZmlsZS53aWR0aCAtIGluZm8uc3JjV2lkdGgpIC8gMjtcbiAgICAgICAgaW5mby5zcmNZID0gKGZpbGUuaGVpZ2h0IC0gaW5mby5zcmNIZWlnaHQpIC8gMjtcbiAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgVGhvc2UgZnVuY3Rpb25zIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgdG8gdGhlIGV2ZW50cyBvbiBpbml0IGFuZCBoYW5kbGUgYWxsXG4gICAgICB0aGUgdXNlciBpbnRlcmZhY2Ugc3BlY2lmaWMgc3R1ZmYuIE92ZXJ3cml0aW5nIHRoZW0gd29uJ3QgYnJlYWsgdGhlIHVwbG9hZFxuICAgICAgYnV0IGNhbiBicmVhayB0aGUgd2F5IGl0J3MgZGlzcGxheWVkLlxuICAgICAgWW91IGNhbiBvdmVyd3JpdGUgdGhlbSBpZiB5b3UgZG9uJ3QgbGlrZSB0aGUgZGVmYXVsdCBiZWhhdmlvci4gSWYgeW91IGp1c3RcbiAgICAgIHdhbnQgdG8gYWRkIGFuIGFkZGl0aW9uYWwgZXZlbnQgaGFuZGxlciwgcmVnaXN0ZXIgaXQgb24gdGhlIGRyb3B6b25lIG9iamVjdFxuICAgICAgYW5kIGRvbid0IG92ZXJ3cml0ZSB0aG9zZSBvcHRpb25zLlxuICAgICAgICovXG4gICAgICBkcm9wOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICB9LFxuICAgICAgZHJhZ3N0YXJ0OiBub29wLFxuICAgICAgZHJhZ2VuZDogZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1kcmFnLWhvdmVyXCIpO1xuICAgICAgfSxcbiAgICAgIGRyYWdlbnRlcjogZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1kcmFnLWhvdmVyXCIpO1xuICAgICAgfSxcbiAgICAgIGRyYWdvdmVyOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICB9LFxuICAgICAgZHJhZ2xlYXZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICB9LFxuICAgICAgcGFzdGU6IG5vb3AsXG4gICAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LXN0YXJ0ZWRcIik7XG4gICAgICB9LFxuICAgICAgYWRkZWRmaWxlOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIHZhciBub2RlLCByZW1vdmVGaWxlRXZlbnQsIHJlbW92ZUxpbmssIF9pLCBfaiwgX2ssIF9sZW4sIF9sZW4xLCBfbGVuMiwgX3JlZiwgX3JlZjEsIF9yZWYyLCBfcmVzdWx0cztcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCA9PT0gdGhpcy5wcmV2aWV3c0NvbnRhaW5lcikge1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotc3RhcnRlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcmV2aWV3c0NvbnRhaW5lcikge1xuICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQgPSBEcm9wem9uZS5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5wcmV2aWV3VGVtcGxhdGUudHJpbSgpKTtcbiAgICAgICAgICBmaWxlLnByZXZpZXdUZW1wbGF0ZSA9IGZpbGUucHJldmlld0VsZW1lbnQ7XG4gICAgICAgICAgdGhpcy5wcmV2aWV3c0NvbnRhaW5lci5hcHBlbmRDaGlsZChmaWxlLnByZXZpZXdFbGVtZW50KTtcbiAgICAgICAgICBfcmVmID0gZmlsZS5wcmV2aWV3RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZHotbmFtZV1cIik7XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBub2RlID0gX3JlZltfaV07XG4gICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gdGhpcy5fcmVuYW1lRmlsZW5hbWUoZmlsZS5uYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX3JlZjEgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1zaXplXVwiKTtcbiAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMS5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICAgIG5vZGUgPSBfcmVmMVtfal07XG4gICAgICAgICAgICBub2RlLmlubmVySFRNTCA9IHRoaXMuZmlsZXNpemUoZmlsZS5zaXplKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGRSZW1vdmVMaW5rcykge1xuICAgICAgICAgICAgZmlsZS5fcmVtb3ZlTGluayA9IERyb3B6b25lLmNyZWF0ZUVsZW1lbnQoXCI8YSBjbGFzcz1cXFwiZHotcmVtb3ZlXFxcIiBocmVmPVxcXCJqYXZhc2NyaXB0OnVuZGVmaW5lZDtcXFwiIGRhdGEtZHotcmVtb3ZlPlwiICsgdGhpcy5vcHRpb25zLmRpY3RSZW1vdmVGaWxlICsgXCI8L2E+XCIpO1xuICAgICAgICAgICAgZmlsZS5wcmV2aWV3RWxlbWVudC5hcHBlbmRDaGlsZChmaWxlLl9yZW1vdmVMaW5rKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVtb3ZlRmlsZUV2ZW50ID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGlmIChmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuVVBMT0FESU5HKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIERyb3B6b25lLmNvbmZpcm0oX3RoaXMub3B0aW9ucy5kaWN0Q2FuY2VsVXBsb2FkQ29uZmlybWF0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZW1vdmVGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRpY3RSZW1vdmVGaWxlQ29uZmlybWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gRHJvcHpvbmUuY29uZmlybShfdGhpcy5vcHRpb25zLmRpY3RSZW1vdmVGaWxlQ29uZmlybWF0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJlbW92ZUZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJlbW92ZUZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pKHRoaXMpO1xuICAgICAgICAgIF9yZWYyID0gZmlsZS5wcmV2aWV3RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZHotcmVtb3ZlXVwiKTtcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2sgPSAwLCBfbGVuMiA9IF9yZWYyLmxlbmd0aDsgX2sgPCBfbGVuMjsgX2srKykge1xuICAgICAgICAgICAgcmVtb3ZlTGluayA9IF9yZWYyW19rXTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2gocmVtb3ZlTGluay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVtb3ZlRmlsZUV2ZW50KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJlbW92ZWRmaWxlOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIHZhciBfcmVmO1xuICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgIGlmICgoX3JlZiA9IGZpbGUucHJldmlld0VsZW1lbnQpICE9IG51bGwpIHtcbiAgICAgICAgICAgIF9yZWYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmaWxlLnByZXZpZXdFbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZU1heEZpbGVzUmVhY2hlZENsYXNzKCk7XG4gICAgICB9LFxuICAgICAgdGh1bWJuYWlsOiBmdW5jdGlvbihmaWxlLCBkYXRhVXJsKSB7XG4gICAgICAgIHZhciB0aHVtYm5haWxFbGVtZW50LCBfaSwgX2xlbiwgX3JlZjtcbiAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1maWxlLXByZXZpZXdcIik7XG4gICAgICAgICAgX3JlZiA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LXRodW1ibmFpbF1cIik7XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICB0aHVtYm5haWxFbGVtZW50ID0gX3JlZltfaV07XG4gICAgICAgICAgICB0aHVtYm5haWxFbGVtZW50LmFsdCA9IGZpbGUubmFtZTtcbiAgICAgICAgICAgIHRodW1ibmFpbEVsZW1lbnQuc3JjID0gZGF0YVVybDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotaW1hZ2UtcHJldmlld1wiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkodGhpcykpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihmaWxlLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBub2RlLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotZXJyb3JcIik7XG4gICAgICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlICE9PSBcIlN0cmluZ1wiICYmIG1lc3NhZ2UuZXJyb3IpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlLmVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBfcmVmID0gZmlsZS5wcmV2aWV3RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZHotZXJyb3JtZXNzYWdlXVwiKTtcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgbm9kZSA9IF9yZWZbX2ldO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChub2RlLnRleHRDb250ZW50ID0gbWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9ybXVsdGlwbGU6IG5vb3AsXG4gICAgICBwcm9jZXNzaW5nOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotcHJvY2Vzc2luZ1wiKTtcbiAgICAgICAgICBpZiAoZmlsZS5fcmVtb3ZlTGluaykge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUuX3JlbW92ZUxpbmsudGV4dENvbnRlbnQgPSB0aGlzLm9wdGlvbnMuZGljdENhbmNlbFVwbG9hZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9jZXNzaW5nbXVsdGlwbGU6IG5vb3AsXG4gICAgICB1cGxvYWRwcm9ncmVzczogZnVuY3Rpb24oZmlsZSwgcHJvZ3Jlc3MsIGJ5dGVzU2VudCkge1xuICAgICAgICB2YXIgbm9kZSwgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgIF9yZWYgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei11cGxvYWRwcm9ncmVzc11cIik7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIG5vZGUgPSBfcmVmW19pXTtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVOYW1lID09PSAnUFJPR1JFU1MnKSB7XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2gobm9kZS52YWx1ZSA9IHByb2dyZXNzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2gobm9kZS5zdHlsZS53aWR0aCA9IFwiXCIgKyBwcm9ncmVzcyArIFwiJVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdG90YWx1cGxvYWRwcm9ncmVzczogbm9vcCxcbiAgICAgIHNlbmRpbmc6IG5vb3AsXG4gICAgICBzZW5kaW5nbXVsdGlwbGU6IG5vb3AsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGZpbGUucHJldmlld0VsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LXN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdWNjZXNzbXVsdGlwbGU6IG5vb3AsXG4gICAgICBjYW5jZWxlZDogZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0KFwiZXJyb3JcIiwgZmlsZSwgXCJVcGxvYWQgY2FuY2VsZWQuXCIpO1xuICAgICAgfSxcbiAgICAgIGNhbmNlbGVkbXVsdGlwbGU6IG5vb3AsXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICBpZiAoZmlsZS5fcmVtb3ZlTGluaykge1xuICAgICAgICAgIGZpbGUuX3JlbW92ZUxpbmsudGV4dENvbnRlbnQgPSB0aGlzLm9wdGlvbnMuZGljdFJlbW92ZUZpbGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotY29tcGxldGVcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZW11bHRpcGxlOiBub29wLFxuICAgICAgbWF4ZmlsZXNleGNlZWRlZDogbm9vcCxcbiAgICAgIG1heGZpbGVzcmVhY2hlZDogbm9vcCxcbiAgICAgIHF1ZXVlY29tcGxldGU6IG5vb3AsXG4gICAgICBhZGRlZGZpbGVzOiBub29wLFxuICAgICAgcHJldmlld1RlbXBsYXRlOiBcIjxkaXYgY2xhc3M9XFxcImR6LXByZXZpZXcgZHotZmlsZS1wcmV2aWV3XFxcIj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LWltYWdlXFxcIj48aW1nIGRhdGEtZHotdGh1bWJuYWlsIC8+PC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJkei1kZXRhaWxzXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiZHotc2l6ZVxcXCI+PHNwYW4gZGF0YS1kei1zaXplPjwvc3Bhbj48L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiZHotZmlsZW5hbWVcXFwiPjxzcGFuIGRhdGEtZHotbmFtZT48L3NwYW4+PC9kaXY+XFxuICA8L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LXByb2dyZXNzXFxcIj48c3BhbiBjbGFzcz1cXFwiZHotdXBsb2FkXFxcIiBkYXRhLWR6LXVwbG9hZHByb2dyZXNzPjwvc3Bhbj48L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LWVycm9yLW1lc3NhZ2VcXFwiPjxzcGFuIGRhdGEtZHotZXJyb3JtZXNzYWdlPjwvc3Bhbj48L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LXN1Y2Nlc3MtbWFya1xcXCI+XFxuICAgIDxzdmcgd2lkdGg9XFxcIjU0cHhcXFwiIGhlaWdodD1cXFwiNTRweFxcXCIgdmlld0JveD1cXFwiMCAwIDU0IDU0XFxcIiB2ZXJzaW9uPVxcXCIxLjFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHhtbG5zOnNrZXRjaD1cXFwiaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zXFxcIj5cXG4gICAgICA8dGl0bGU+Q2hlY2s8L3RpdGxlPlxcbiAgICAgIDxkZWZzPjwvZGVmcz5cXG4gICAgICA8ZyBpZD1cXFwiUGFnZS0xXFxcIiBzdHJva2U9XFxcIm5vbmVcXFwiIHN0cm9rZS13aWR0aD1cXFwiMVxcXCIgZmlsbD1cXFwibm9uZVxcXCIgZmlsbC1ydWxlPVxcXCJldmVub2RkXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNQYWdlXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk0yMy41LDMxLjg0MzE0NTggTDE3LjU4NTI0MTksMjUuOTI4Mzg3NyBDMTYuMDI0ODI1MywyNC4zNjc5NzExIDEzLjQ5MTAyOTQsMjQuMzY2ODM1IDExLjkyODkzMjIsMjUuOTI4OTMyMiBDMTAuMzcwMDEzNiwyNy40ODc4NTA4IDEwLjM2NjU5MTIsMzAuMDIzNDQ1NSAxMS45MjgzODc3LDMxLjU4NTI0MTkgTDIwLjQxNDc1ODEsNDAuMDcxNjEyMyBDMjAuNTEzMzk5OSw0MC4xNzAyNTQxIDIwLjYxNTkzMTUsNDAuMjYyNjY0OSAyMC43MjE4NjE1LDQwLjM0ODg0MzUgQzIyLjI4MzU2NjksNDEuODcyNTY1MSAyNC43OTQyMzQsNDEuODYyNjIwMiAyNi4zNDYxNTY0LDQwLjMxMDY5NzggTDQzLjMxMDY5NzgsMjMuMzQ2MTU2NCBDNDQuODc3MTAyMSwyMS43Nzk3NTIxIDQ0Ljg3NTgwNTcsMTkuMjQ4Mzg4NyA0My4zMTM3MDg1LDE3LjY4NjI5MTUgQzQxLjc1NDc4OTksMTYuMTI3MzcyOSAzOS4yMTc2MDM1LDE2LjEyNTU0MjIgMzcuNjUzODQzNiwxNy42ODkzMDIyIEwyMy41LDMxLjg0MzE0NTggWiBNMjcsNTMgQzQxLjM1OTQwMzUsNTMgNTMsNDEuMzU5NDAzNSA1MywyNyBDNTMsMTIuNjQwNTk2NSA0MS4zNTk0MDM1LDEgMjcsMSBDMTIuNjQwNTk2NSwxIDEsMTIuNjQwNTk2NSAxLDI3IEMxLDQxLjM1OTQwMzUgMTIuNjQwNTk2NSw1MyAyNyw1MyBaXFxcIiBpZD1cXFwiT3ZhbC0yXFxcIiBzdHJva2Utb3BhY2l0eT1cXFwiMC4xOTg3OTQxNThcXFwiIHN0cm9rZT1cXFwiIzc0NzQ3NFxcXCIgZmlsbC1vcGFjaXR5PVxcXCIwLjgxNjUxOTQ3NVxcXCIgZmlsbD1cXFwiI0ZGRkZGRlxcXCIgc2tldGNoOnR5cGU9XFxcIk1TU2hhcGVHcm91cFxcXCI+PC9wYXRoPlxcbiAgICAgIDwvZz5cXG4gICAgPC9zdmc+XFxuICA8L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LWVycm9yLW1hcmtcXFwiPlxcbiAgICA8c3ZnIHdpZHRoPVxcXCI1NHB4XFxcIiBoZWlnaHQ9XFxcIjU0cHhcXFwiIHZpZXdCb3g9XFxcIjAgMCA1NCA1NFxcXCIgdmVyc2lvbj1cXFwiMS4xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4bWxuczpza2V0Y2g9XFxcImh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9uc1xcXCI+XFxuICAgICAgPHRpdGxlPkVycm9yPC90aXRsZT5cXG4gICAgICA8ZGVmcz48L2RlZnM+XFxuICAgICAgPGcgaWQ9XFxcIlBhZ2UtMVxcXCIgc3Ryb2tlPVxcXCJub25lXFxcIiBzdHJva2Utd2lkdGg9XFxcIjFcXFwiIGZpbGw9XFxcIm5vbmVcXFwiIGZpbGwtcnVsZT1cXFwiZXZlbm9kZFxcXCIgc2tldGNoOnR5cGU9XFxcIk1TUGFnZVxcXCI+XFxuICAgICAgICA8ZyBpZD1cXFwiQ2hlY2stKy1PdmFsLTJcXFwiIHNrZXRjaDp0eXBlPVxcXCJNU0xheWVyR3JvdXBcXFwiIHN0cm9rZT1cXFwiIzc0NzQ3NFxcXCIgc3Ryb2tlLW9wYWNpdHk9XFxcIjAuMTk4Nzk0MTU4XFxcIiBmaWxsPVxcXCIjRkZGRkZGXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjAuODE2NTE5NDc1XFxcIj5cXG4gICAgICAgICAgPHBhdGggZD1cXFwiTTMyLjY1Njg1NDIsMjkgTDM4LjMxMDY5NzgsMjMuMzQ2MTU2NCBDMzkuODc3MTAyMSwyMS43Nzk3NTIxIDM5Ljg3NTgwNTcsMTkuMjQ4Mzg4NyAzOC4zMTM3MDg1LDE3LjY4NjI5MTUgQzM2Ljc1NDc4OTksMTYuMTI3MzcyOSAzNC4yMTc2MDM1LDE2LjEyNTU0MjIgMzIuNjUzODQzNiwxNy42ODkzMDIyIEwyNywyMy4zNDMxNDU4IEwyMS4zNDYxNTY0LDE3LjY4OTMwMjIgQzE5Ljc4MjM5NjUsMTYuMTI1NTQyMiAxNy4yNDUyMTAxLDE2LjEyNzM3MjkgMTUuNjg2MjkxNSwxNy42ODYyOTE1IEMxNC4xMjQxOTQzLDE5LjI0ODM4ODcgMTQuMTIyODk3OSwyMS43Nzk3NTIxIDE1LjY4OTMwMjIsMjMuMzQ2MTU2NCBMMjEuMzQzMTQ1OCwyOSBMMTUuNjg5MzAyMiwzNC42NTM4NDM2IEMxNC4xMjI4OTc5LDM2LjIyMDI0NzkgMTQuMTI0MTk0MywzOC43NTE2MTEzIDE1LjY4NjI5MTUsNDAuMzEzNzA4NSBDMTcuMjQ1MjEwMSw0MS44NzI2MjcxIDE5Ljc4MjM5NjUsNDEuODc0NDU3OCAyMS4zNDYxNTY0LDQwLjMxMDY5NzggTDI3LDM0LjY1Njg1NDIgTDMyLjY1Mzg0MzYsNDAuMzEwNjk3OCBDMzQuMjE3NjAzNSw0MS44NzQ0NTc4IDM2Ljc1NDc4OTksNDEuODcyNjI3MSAzOC4zMTM3MDg1LDQwLjMxMzcwODUgQzM5Ljg3NTgwNTcsMzguNzUxNjExMyAzOS44NzcxMDIxLDM2LjIyMDI0NzkgMzguMzEwNjk3OCwzNC42NTM4NDM2IEwzMi42NTY4NTQyLDI5IFogTTI3LDUzIEM0MS4zNTk0MDM1LDUzIDUzLDQxLjM1OTQwMzUgNTMsMjcgQzUzLDEyLjY0MDU5NjUgNDEuMzU5NDAzNSwxIDI3LDEgQzEyLjY0MDU5NjUsMSAxLDEyLjY0MDU5NjUgMSwyNyBDMSw0MS4zNTk0MDM1IDEyLjY0MDU5NjUsNTMgMjcsNTMgWlxcXCIgaWQ9XFxcIk92YWwtMlxcXCIgc2tldGNoOnR5cGU9XFxcIk1TU2hhcGVHcm91cFxcXCI+PC9wYXRoPlxcbiAgICAgICAgPC9nPlxcbiAgICAgIDwvZz5cXG4gICAgPC9zdmc+XFxuICA8L2Rpdj5cXG48L2Rpdj5cIlxuICAgIH07XG5cbiAgICBleHRlbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXksIG9iamVjdCwgb2JqZWN0cywgdGFyZ2V0LCB2YWwsIF9pLCBfbGVuO1xuICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzWzBdLCBvYmplY3RzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gb2JqZWN0cy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBvYmplY3QgPSBvYmplY3RzW19pXTtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgdmFsID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIERyb3B6b25lKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBlbGVtZW50T3B0aW9ucywgZmFsbGJhY2ssIF9yZWY7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgdGhpcy52ZXJzaW9uID0gRHJvcHpvbmUudmVyc2lvbjtcbiAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMucHJldmlld1RlbXBsYXRlID0gdGhpcy5kZWZhdWx0T3B0aW9ucy5wcmV2aWV3VGVtcGxhdGUucmVwbGFjZSgvXFxuKi9nLCBcIlwiKTtcbiAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMgPSBbXTtcbiAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICB0aGlzLmZpbGVzID0gW107XG4gICAgICBpZiAodHlwZW9mIHRoaXMuZWxlbWVudCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuZWxlbWVudCk7XG4gICAgICB9XG4gICAgICBpZiAoISh0aGlzLmVsZW1lbnQgJiYgKHRoaXMuZWxlbWVudC5ub2RlVHlwZSAhPSBudWxsKSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBkcm9wem9uZSBlbGVtZW50LlwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVsZW1lbnQuZHJvcHpvbmUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRHJvcHpvbmUgYWxyZWFkeSBhdHRhY2hlZC5cIik7XG4gICAgICB9XG4gICAgICBEcm9wem9uZS5pbnN0YW5jZXMucHVzaCh0aGlzKTtcbiAgICAgIHRoaXMuZWxlbWVudC5kcm9wem9uZSA9IHRoaXM7XG4gICAgICBlbGVtZW50T3B0aW9ucyA9IChfcmVmID0gRHJvcHpvbmUub3B0aW9uc0ZvckVsZW1lbnQodGhpcy5lbGVtZW50KSkgIT0gbnVsbCA/IF9yZWYgOiB7fTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IGV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgZWxlbWVudE9wdGlvbnMsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMgOiB7fSk7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmZvcmNlRmFsbGJhY2sgfHwgIURyb3B6b25lLmlzQnJvd3NlclN1cHBvcnRlZCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmFsbGJhY2suY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXJsID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnVybCA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJhY3Rpb25cIik7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy51cmwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gVVJMIHByb3ZpZGVkLlwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcyAmJiB0aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IGNhbid0IHByb3ZpZGUgYm90aCAnYWNjZXB0ZWRGaWxlcycgYW5kICdhY2NlcHRlZE1pbWVUeXBlcycuICdhY2NlcHRlZE1pbWVUeXBlcycgaXMgZGVwcmVjYXRlZC5cIik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmFjY2VwdGVkTWltZVR5cGVzKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5hY2NlcHRlZEZpbGVzID0gdGhpcy5vcHRpb25zLmFjY2VwdGVkTWltZVR5cGVzO1xuICAgICAgICBkZWxldGUgdGhpcy5vcHRpb25zLmFjY2VwdGVkTWltZVR5cGVzO1xuICAgICAgfVxuICAgICAgdGhpcy5vcHRpb25zLm1ldGhvZCA9IHRoaXMub3B0aW9ucy5tZXRob2QudG9VcHBlckNhc2UoKTtcbiAgICAgIGlmICgoZmFsbGJhY2sgPSB0aGlzLmdldEV4aXN0aW5nRmFsbGJhY2soKSkgJiYgZmFsbGJhY2sucGFyZW50Tm9kZSkge1xuICAgICAgICBmYWxsYmFjay5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucHJldmlld3NDb250YWluZXIgIT09IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucHJldmlld3NDb250YWluZXIpIHtcbiAgICAgICAgICB0aGlzLnByZXZpZXdzQ29udGFpbmVyID0gRHJvcHpvbmUuZ2V0RWxlbWVudCh0aGlzLm9wdGlvbnMucHJldmlld3NDb250YWluZXIsIFwicHJldmlld3NDb250YWluZXJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wcmV2aWV3c0NvbnRhaW5lciA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jbGlja2FibGUpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jbGlja2FibGUgPT09IHRydWUpIHtcbiAgICAgICAgICB0aGlzLmNsaWNrYWJsZUVsZW1lbnRzID0gW3RoaXMuZWxlbWVudF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jbGlja2FibGVFbGVtZW50cyA9IERyb3B6b25lLmdldEVsZW1lbnRzKHRoaXMub3B0aW9ucy5jbGlja2FibGUsIFwiY2xpY2thYmxlXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZ2V0QWNjZXB0ZWRGaWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZpbGUsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgIF9yZWYgPSB0aGlzLmZpbGVzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmaWxlID0gX3JlZltfaV07XG4gICAgICAgIGlmIChmaWxlLmFjY2VwdGVkKSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChmaWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZ2V0UmVqZWN0ZWRGaWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZpbGUsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgIF9yZWYgPSB0aGlzLmZpbGVzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmaWxlID0gX3JlZltfaV07XG4gICAgICAgIGlmICghZmlsZS5hY2NlcHRlZCkge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goZmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmdldEZpbGVzV2l0aFN0YXR1cyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgdmFyIGZpbGUsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgIF9yZWYgPSB0aGlzLmZpbGVzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmaWxlID0gX3JlZltfaV07XG4gICAgICAgIGlmIChmaWxlLnN0YXR1cyA9PT0gc3RhdHVzKSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChmaWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZ2V0UXVldWVkRmlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEZpbGVzV2l0aFN0YXR1cyhEcm9wem9uZS5RVUVVRUQpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZ2V0VXBsb2FkaW5nRmlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEZpbGVzV2l0aFN0YXR1cyhEcm9wem9uZS5VUExPQURJTkcpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZ2V0QWRkZWRGaWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RmlsZXNXaXRoU3RhdHVzKERyb3B6b25lLkFEREVEKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmdldEFjdGl2ZUZpbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgX3JlZiA9IHRoaXMuZmlsZXM7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBfcmVmW19pXTtcbiAgICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5VUExPQURJTkcgfHwgZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLlFVRVVFRCkge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goZmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBldmVudE5hbWUsIG5vUHJvcGFnYXRpb24sIHNldHVwSGlkZGVuRmlsZUlucHV0LCBfaSwgX2xlbiwgX3JlZiwgX3JlZjE7XG4gICAgICBpZiAodGhpcy5lbGVtZW50LnRhZ05hbWUgPT09IFwiZm9ybVwiKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJlbmN0eXBlXCIsIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZHJvcHpvbmVcIikgJiYgIXRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmR6LW1lc3NhZ2VcIikpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKERyb3B6b25lLmNyZWF0ZUVsZW1lbnQoXCI8ZGl2IGNsYXNzPVxcXCJkei1kZWZhdWx0IGR6LW1lc3NhZ2VcXFwiPjxzcGFuPlwiICsgdGhpcy5vcHRpb25zLmRpY3REZWZhdWx0TWVzc2FnZSArIFwiPC9zcGFuPjwvZGl2PlwiKSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jbGlja2FibGVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgc2V0dXBIaWRkZW5GaWxlSW5wdXQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaGlkZGVuRmlsZUlucHV0KSB7XG4gICAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKF90aGlzLmhpZGRlbkZpbGVJbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5oaWRkZW5GaWxlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgICAgICBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImZpbGVcIik7XG4gICAgICAgICAgICBpZiAoKF90aGlzLm9wdGlvbnMubWF4RmlsZXMgPT0gbnVsbCkgfHwgX3RoaXMub3B0aW9ucy5tYXhGaWxlcyA+IDEpIHtcbiAgICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnNldEF0dHJpYnV0ZShcIm11bHRpcGxlXCIsIFwibXVsdGlwbGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuY2xhc3NOYW1lID0gXCJkei1oaWRkZW4taW5wdXRcIjtcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmFjY2VwdGVkRmlsZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuc2V0QXR0cmlidXRlKFwiYWNjZXB0XCIsIF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5jYXB0dXJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnNldEF0dHJpYnV0ZShcImNhcHR1cmVcIiwgX3RoaXMub3B0aW9ucy5jYXB0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS50b3AgPSBcIjBcIjtcbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS5sZWZ0ID0gXCIwXCI7XG4gICAgICAgICAgICBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuc3R5bGUuaGVpZ2h0ID0gXCIwXCI7XG4gICAgICAgICAgICBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuc3R5bGUud2lkdGggPSBcIjBcIjtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoX3RoaXMub3B0aW9ucy5oaWRkZW5JbnB1dENvbnRhaW5lcikuYXBwZW5kQ2hpbGQoX3RoaXMuaGlkZGVuRmlsZUlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIGZpbGUsIGZpbGVzLCBfaSwgX2xlbjtcbiAgICAgICAgICAgICAgZmlsZXMgPSBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuZmlsZXM7XG4gICAgICAgICAgICAgIGlmIChmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGZpbGVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICBmaWxlID0gZmlsZXNbX2ldO1xuICAgICAgICAgICAgICAgICAgX3RoaXMuYWRkRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgX3RoaXMuZW1pdChcImFkZGVkZmlsZXNcIiwgZmlsZXMpO1xuICAgICAgICAgICAgICByZXR1cm4gc2V0dXBIaWRkZW5GaWxlSW5wdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpO1xuICAgICAgICBzZXR1cEhpZGRlbkZpbGVJbnB1dCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5VUkwgPSAoX3JlZiA9IHdpbmRvdy5VUkwpICE9IG51bGwgPyBfcmVmIDogd2luZG93LndlYmtpdFVSTDtcbiAgICAgIF9yZWYxID0gdGhpcy5ldmVudHM7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGV2ZW50TmFtZSA9IF9yZWYxW19pXTtcbiAgICAgICAgdGhpcy5vbihldmVudE5hbWUsIHRoaXMub3B0aW9uc1tldmVudE5hbWVdKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub24oXCJ1cGxvYWRwcm9ncmVzc1wiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy51cGRhdGVUb3RhbFVwbG9hZFByb2dyZXNzKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICB0aGlzLm9uKFwicmVtb3ZlZGZpbGVcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMudXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzcygpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgdGhpcy5vbihcImNhbmNlbGVkXCIsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgZmlsZSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICB0aGlzLm9uKFwiY29tcGxldGVcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgaWYgKF90aGlzLmdldEFkZGVkRmlsZXMoKS5sZW5ndGggPT09IDAgJiYgX3RoaXMuZ2V0VXBsb2FkaW5nRmlsZXMoKS5sZW5ndGggPT09IDAgJiYgX3RoaXMuZ2V0UXVldWVkRmlsZXMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmVtaXQoXCJxdWV1ZWNvbXBsZXRlXCIpO1xuICAgICAgICAgICAgfSksIDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIG5vUHJvcGFnYXRpb24gPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbGVtZW50OiB0aGlzLmVsZW1lbnQsXG4gICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICBcImRyYWdzdGFydFwiOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZW1pdChcImRyYWdzdGFydFwiLCBlKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKHRoaXMpLFxuICAgICAgICAgICAgXCJkcmFnZW50ZXJcIjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgbm9Qcm9wYWdhdGlvbihlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZW1pdChcImRyYWdlbnRlclwiLCBlKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKHRoaXMpLFxuICAgICAgICAgICAgXCJkcmFnb3ZlclwiOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWZjdDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgZWZjdCA9IGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQ7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7fVxuICAgICAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZScgPT09IGVmY3QgfHwgJ2xpbmtNb3ZlJyA9PT0gZWZjdCA/ICdtb3ZlJyA6ICdjb3B5JztcbiAgICAgICAgICAgICAgICBub1Byb3BhZ2F0aW9uKGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5lbWl0KFwiZHJhZ292ZXJcIiwgZSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgICAgIFwiZHJhZ2xlYXZlXCI6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5lbWl0KFwiZHJhZ2xlYXZlXCIsIGUpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkodGhpcyksXG4gICAgICAgICAgICBcImRyb3BcIjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgbm9Qcm9wYWdhdGlvbihlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZHJvcChlKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKHRoaXMpLFxuICAgICAgICAgICAgXCJkcmFnZW5kXCI6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5lbWl0KFwiZHJhZ2VuZFwiLCBlKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKHRoaXMpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgdGhpcy5jbGlja2FibGVFbGVtZW50cy5mb3JFYWNoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY2xpY2thYmxlRWxlbWVudCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5saXN0ZW5lcnMucHVzaCh7XG4gICAgICAgICAgICBlbGVtZW50OiBjbGlja2FibGVFbGVtZW50LFxuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIFwiY2xpY2tcIjogZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKChjbGlja2FibGVFbGVtZW50ICE9PSBfdGhpcy5lbGVtZW50KSB8fCAoZXZ0LnRhcmdldCA9PT0gX3RoaXMuZWxlbWVudCB8fCBEcm9wem9uZS5lbGVtZW50SW5zaWRlKGV2dC50YXJnZXQsIF90aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5kei1tZXNzYWdlXCIpKSkpIHtcbiAgICAgICAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5jbGljaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgdGhpcy5lbmFibGUoKTtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuaW5pdC5jYWxsKHRoaXMpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF9yZWY7XG4gICAgICB0aGlzLmRpc2FibGUoKTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsRmlsZXModHJ1ZSk7XG4gICAgICBpZiAoKF9yZWYgPSB0aGlzLmhpZGRlbkZpbGVJbnB1dCkgIT0gbnVsbCA/IF9yZWYucGFyZW50Tm9kZSA6IHZvaWQgMCkge1xuICAgICAgICB0aGlzLmhpZGRlbkZpbGVJbnB1dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuaGlkZGVuRmlsZUlucHV0KTtcbiAgICAgICAgdGhpcy5oaWRkZW5GaWxlSW5wdXQgPSBudWxsO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudC5kcm9wem9uZTtcbiAgICAgIHJldHVybiBEcm9wem9uZS5pbnN0YW5jZXMuc3BsaWNlKERyb3B6b25lLmluc3RhbmNlcy5pbmRleE9mKHRoaXMpLCAxKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnVwZGF0ZVRvdGFsVXBsb2FkUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhY3RpdmVGaWxlcywgZmlsZSwgdG90YWxCeXRlcywgdG90YWxCeXRlc1NlbnQsIHRvdGFsVXBsb2FkUHJvZ3Jlc3MsIF9pLCBfbGVuLCBfcmVmO1xuICAgICAgdG90YWxCeXRlc1NlbnQgPSAwO1xuICAgICAgdG90YWxCeXRlcyA9IDA7XG4gICAgICBhY3RpdmVGaWxlcyA9IHRoaXMuZ2V0QWN0aXZlRmlsZXMoKTtcbiAgICAgIGlmIChhY3RpdmVGaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgX3JlZiA9IHRoaXMuZ2V0QWN0aXZlRmlsZXMoKTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgZmlsZSA9IF9yZWZbX2ldO1xuICAgICAgICAgIHRvdGFsQnl0ZXNTZW50ICs9IGZpbGUudXBsb2FkLmJ5dGVzU2VudDtcbiAgICAgICAgICB0b3RhbEJ5dGVzICs9IGZpbGUudXBsb2FkLnRvdGFsO1xuICAgICAgICB9XG4gICAgICAgIHRvdGFsVXBsb2FkUHJvZ3Jlc3MgPSAxMDAgKiB0b3RhbEJ5dGVzU2VudCAvIHRvdGFsQnl0ZXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3RhbFVwbG9hZFByb2dyZXNzID0gMTAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZW1pdChcInRvdGFsdXBsb2FkcHJvZ3Jlc3NcIiwgdG90YWxVcGxvYWRQcm9ncmVzcywgdG90YWxCeXRlcywgdG90YWxCeXRlc1NlbnQpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX2dldFBhcmFtTmFtZSA9IGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnBhcmFtTmFtZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucGFyYW1OYW1lKG4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiXCIgKyB0aGlzLm9wdGlvbnMucGFyYW1OYW1lICsgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSA/IFwiW1wiICsgbiArIFwiXVwiIDogXCJcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5fcmVuYW1lRmlsZW5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5yZW5hbWVGaWxlbmFtZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5yZW5hbWVGaWxlbmFtZShuYW1lKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmdldEZhbGxiYWNrRm9ybSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGV4aXN0aW5nRmFsbGJhY2ssIGZpZWxkcywgZmllbGRzU3RyaW5nLCBmb3JtO1xuICAgICAgaWYgKGV4aXN0aW5nRmFsbGJhY2sgPSB0aGlzLmdldEV4aXN0aW5nRmFsbGJhY2soKSkge1xuICAgICAgICByZXR1cm4gZXhpc3RpbmdGYWxsYmFjaztcbiAgICAgIH1cbiAgICAgIGZpZWxkc1N0cmluZyA9IFwiPGRpdiBjbGFzcz1cXFwiZHotZmFsbGJhY2tcXFwiPlwiO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaWN0RmFsbGJhY2tUZXh0KSB7XG4gICAgICAgIGZpZWxkc1N0cmluZyArPSBcIjxwPlwiICsgdGhpcy5vcHRpb25zLmRpY3RGYWxsYmFja1RleHQgKyBcIjwvcD5cIjtcbiAgICAgIH1cbiAgICAgIGZpZWxkc1N0cmluZyArPSBcIjxpbnB1dCB0eXBlPVxcXCJmaWxlXFxcIiBuYW1lPVxcXCJcIiArICh0aGlzLl9nZXRQYXJhbU5hbWUoMCkpICsgXCJcXFwiIFwiICsgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSA/ICdtdWx0aXBsZT1cIm11bHRpcGxlXCInIDogdm9pZCAwKSArIFwiIC8+PGlucHV0IHR5cGU9XFxcInN1Ym1pdFxcXCIgdmFsdWU9XFxcIlVwbG9hZCFcXFwiPjwvZGl2PlwiO1xuICAgICAgZmllbGRzID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChmaWVsZHNTdHJpbmcpO1xuICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lICE9PSBcIkZPUk1cIikge1xuICAgICAgICBmb3JtID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxmb3JtIGFjdGlvbj1cXFwiXCIgKyB0aGlzLm9wdGlvbnMudXJsICsgXCJcXFwiIGVuY3R5cGU9XFxcIm11bHRpcGFydC9mb3JtLWRhdGFcXFwiIG1ldGhvZD1cXFwiXCIgKyB0aGlzLm9wdGlvbnMubWV0aG9kICsgXCJcXFwiPjwvZm9ybT5cIik7XG4gICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoZmllbGRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJlbmN0eXBlXCIsIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcIm1ldGhvZFwiLCB0aGlzLm9wdGlvbnMubWV0aG9kKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmb3JtICE9IG51bGwgPyBmb3JtIDogZmllbGRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZ2V0RXhpc3RpbmdGYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZhbGxiYWNrLCBnZXRGYWxsYmFjaywgdGFnTmFtZSwgX2ksIF9sZW4sIF9yZWY7XG4gICAgICBnZXRGYWxsYmFjayA9IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgICAgIHZhciBlbCwgX2ksIF9sZW47XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZWxlbWVudHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBlbCA9IGVsZW1lbnRzW19pXTtcbiAgICAgICAgICBpZiAoLyhefCApZmFsbGJhY2soJHwgKS8udGVzdChlbC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgX3JlZiA9IFtcImRpdlwiLCBcImZvcm1cIl07XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgdGFnTmFtZSA9IF9yZWZbX2ldO1xuICAgICAgICBpZiAoZmFsbGJhY2sgPSBnZXRGYWxsYmFjayh0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSkpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbGxiYWNrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5zZXR1cEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWxlbWVudExpc3RlbmVycywgZXZlbnQsIGxpc3RlbmVyLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBfcmVmID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGVsZW1lbnRMaXN0ZW5lcnMgPSBfcmVmW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9yZWYxLCBfcmVzdWx0czE7XG4gICAgICAgICAgX3JlZjEgPSBlbGVtZW50TGlzdGVuZXJzLmV2ZW50cztcbiAgICAgICAgICBfcmVzdWx0czEgPSBbXTtcbiAgICAgICAgICBmb3IgKGV2ZW50IGluIF9yZWYxKSB7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IF9yZWYxW2V2ZW50XTtcbiAgICAgICAgICAgIF9yZXN1bHRzMS5wdXNoKGVsZW1lbnRMaXN0ZW5lcnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzMTtcbiAgICAgICAgfSkoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsZW1lbnRMaXN0ZW5lcnMsIGV2ZW50LCBsaXN0ZW5lciwgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgX3JlZiA9IHRoaXMubGlzdGVuZXJzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBlbGVtZW50TGlzdGVuZXJzID0gX3JlZltfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2goKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfcmVmMSwgX3Jlc3VsdHMxO1xuICAgICAgICAgIF9yZWYxID0gZWxlbWVudExpc3RlbmVycy5ldmVudHM7XG4gICAgICAgICAgX3Jlc3VsdHMxID0gW107XG4gICAgICAgICAgZm9yIChldmVudCBpbiBfcmVmMSkge1xuICAgICAgICAgICAgbGlzdGVuZXIgPSBfcmVmMVtldmVudF07XG4gICAgICAgICAgICBfcmVzdWx0czEucHVzaChlbGVtZW50TGlzdGVuZXJzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0czE7XG4gICAgICAgIH0pKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZpbGUsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1jbGlja2FibGVcIik7XG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIF9yZWYgPSB0aGlzLmZpbGVzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmaWxlID0gX3JlZltfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5jYW5jZWxVcGxvYWQoZmlsZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmNsaWNrYWJsZUVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotY2xpY2thYmxlXCIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5maWxlc2l6ZSA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgIHZhciBjdXRvZmYsIGksIHNlbGVjdGVkU2l6ZSwgc2VsZWN0ZWRVbml0LCB1bml0LCB1bml0cywgX2ksIF9sZW47XG4gICAgICBzZWxlY3RlZFNpemUgPSAwO1xuICAgICAgc2VsZWN0ZWRVbml0ID0gXCJiXCI7XG4gICAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgICAgdW5pdHMgPSBbJ1RCJywgJ0dCJywgJ01CJywgJ0tCJywgJ2InXTtcbiAgICAgICAgZm9yIChpID0gX2kgPSAwLCBfbGVuID0gdW5pdHMubGVuZ3RoOyBfaSA8IF9sZW47IGkgPSArK19pKSB7XG4gICAgICAgICAgdW5pdCA9IHVuaXRzW2ldO1xuICAgICAgICAgIGN1dG9mZiA9IE1hdGgucG93KHRoaXMub3B0aW9ucy5maWxlc2l6ZUJhc2UsIDQgLSBpKSAvIDEwO1xuICAgICAgICAgIGlmIChzaXplID49IGN1dG9mZikge1xuICAgICAgICAgICAgc2VsZWN0ZWRTaXplID0gc2l6ZSAvIE1hdGgucG93KHRoaXMub3B0aW9ucy5maWxlc2l6ZUJhc2UsIDQgLSBpKTtcbiAgICAgICAgICAgIHNlbGVjdGVkVW5pdCA9IHVuaXQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2VsZWN0ZWRTaXplID0gTWF0aC5yb3VuZCgxMCAqIHNlbGVjdGVkU2l6ZSkgLyAxMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBcIjxzdHJvbmc+XCIgKyBzZWxlY3RlZFNpemUgKyBcIjwvc3Ryb25nPiBcIiArIHNlbGVjdGVkVW5pdDtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl91cGRhdGVNYXhGaWxlc1JlYWNoZWRDbGFzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCh0aGlzLm9wdGlvbnMubWF4RmlsZXMgIT0gbnVsbCkgJiYgdGhpcy5nZXRBY2NlcHRlZEZpbGVzKCkubGVuZ3RoID49IHRoaXMub3B0aW9ucy5tYXhGaWxlcykge1xuICAgICAgICBpZiAodGhpcy5nZXRBY2NlcHRlZEZpbGVzKCkubGVuZ3RoID09PSB0aGlzLm9wdGlvbnMubWF4RmlsZXMpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ21heGZpbGVzcmVhY2hlZCcsIHRoaXMuZmlsZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LW1heC1maWxlcy1yZWFjaGVkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotbWF4LWZpbGVzLXJlYWNoZWRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5kcm9wID0gZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIGZpbGVzLCBpdGVtcztcbiAgICAgIGlmICghZS5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KFwiZHJvcFwiLCBlKTtcbiAgICAgIGZpbGVzID0gZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICB0aGlzLmVtaXQoXCJhZGRlZGZpbGVzXCIsIGZpbGVzKTtcbiAgICAgIGlmIChmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgaXRlbXMgPSBlLmRhdGFUcmFuc2Zlci5pdGVtcztcbiAgICAgICAgaWYgKGl0ZW1zICYmIGl0ZW1zLmxlbmd0aCAmJiAoaXRlbXNbMF0ud2Via2l0R2V0QXNFbnRyeSAhPSBudWxsKSkge1xuICAgICAgICAgIHRoaXMuX2FkZEZpbGVzRnJvbUl0ZW1zKGl0ZW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUZpbGVzKGZpbGVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUucGFzdGUgPSBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgaXRlbXMsIF9yZWY7XG4gICAgICBpZiAoKGUgIT0gbnVsbCA/IChfcmVmID0gZS5jbGlwYm9hcmREYXRhKSAhPSBudWxsID8gX3JlZi5pdGVtcyA6IHZvaWQgMCA6IHZvaWQgMCkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmVtaXQoXCJwYXN0ZVwiLCBlKTtcbiAgICAgIGl0ZW1zID0gZS5jbGlwYm9hcmREYXRhLml0ZW1zO1xuICAgICAgaWYgKGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkRmlsZXNGcm9tSXRlbXMoaXRlbXMpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuaGFuZGxlRmlsZXMgPSBmdW5jdGlvbihmaWxlcykge1xuICAgICAgdmFyIGZpbGUsIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGZpbGVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBmaWxlc1tfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5hZGRGaWxlKGZpbGUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9hZGRGaWxlc0Zyb21JdGVtcyA9IGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICB2YXIgZW50cnksIGl0ZW0sIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGl0ZW1zLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGl0ZW0gPSBpdGVtc1tfaV07XG4gICAgICAgIGlmICgoaXRlbS53ZWJraXRHZXRBc0VudHJ5ICE9IG51bGwpICYmIChlbnRyeSA9IGl0ZW0ud2Via2l0R2V0QXNFbnRyeSgpKSkge1xuICAgICAgICAgIGlmIChlbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5hZGRGaWxlKGl0ZW0uZ2V0QXNGaWxlKCkpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuX2FkZEZpbGVzRnJvbURpcmVjdG9yeShlbnRyeSwgZW50cnkubmFtZSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uZ2V0QXNGaWxlICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAoKGl0ZW0ua2luZCA9PSBudWxsKSB8fCBpdGVtLmtpbmQgPT09IFwiZmlsZVwiKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuYWRkRmlsZShpdGVtLmdldEFzRmlsZSgpKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5fYWRkRmlsZXNGcm9tRGlyZWN0b3J5ID0gZnVuY3Rpb24oZGlyZWN0b3J5LCBwYXRoKSB7XG4gICAgICB2YXIgZGlyUmVhZGVyLCBlcnJvckhhbmRsZXIsIHJlYWRFbnRyaWVzO1xuICAgICAgZGlyUmVhZGVyID0gZGlyZWN0b3J5LmNyZWF0ZVJlYWRlcigpO1xuICAgICAgZXJyb3JIYW5kbGVyID0gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwgPyB0eXBlb2YgY29uc29sZS5sb2cgPT09IFwiZnVuY3Rpb25cIiA/IGNvbnNvbGUubG9nKGVycm9yKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIH07XG4gICAgICByZWFkRW50cmllcyA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGRpclJlYWRlci5yZWFkRW50cmllcyhmdW5jdGlvbihlbnRyaWVzKSB7XG4gICAgICAgICAgICB2YXIgZW50cnksIF9pLCBfbGVuO1xuICAgICAgICAgICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGVudHJpZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgICBlbnRyeSA9IGVudHJpZXNbX2ldO1xuICAgICAgICAgICAgICAgIGlmIChlbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgIGVudHJ5LmZpbGUoZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5pZ25vcmVIaWRkZW5GaWxlcyAmJiBmaWxlLm5hbWUuc3Vic3RyaW5nKDAsIDEpID09PSAnLicpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmlsZS5mdWxsUGF0aCA9IFwiXCIgKyBwYXRoICsgXCIvXCIgKyBmaWxlLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5hZGRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlbnRyeS5pc0RpcmVjdG9yeSkge1xuICAgICAgICAgICAgICAgICAgX3RoaXMuX2FkZEZpbGVzRnJvbURpcmVjdG9yeShlbnRyeSwgXCJcIiArIHBhdGggKyBcIi9cIiArIGVudHJ5Lm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWFkRW50cmllcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgcmV0dXJuIHJlYWRFbnRyaWVzKCk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbihmaWxlLCBkb25lKSB7XG4gICAgICBpZiAoZmlsZS5zaXplID4gdGhpcy5vcHRpb25zLm1heEZpbGVzaXplICogMTAyNCAqIDEwMjQpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUodGhpcy5vcHRpb25zLmRpY3RGaWxlVG9vQmlnLnJlcGxhY2UoXCJ7e2ZpbGVzaXplfX1cIiwgTWF0aC5yb3VuZChmaWxlLnNpemUgLyAxMDI0IC8gMTAuMjQpIC8gMTAwKS5yZXBsYWNlKFwie3ttYXhGaWxlc2l6ZX19XCIsIHRoaXMub3B0aW9ucy5tYXhGaWxlc2l6ZSkpO1xuICAgICAgfSBlbHNlIGlmICghRHJvcHpvbmUuaXNWYWxpZEZpbGUoZmlsZSwgdGhpcy5vcHRpb25zLmFjY2VwdGVkRmlsZXMpKSB7XG4gICAgICAgIHJldHVybiBkb25lKHRoaXMub3B0aW9ucy5kaWN0SW52YWxpZEZpbGVUeXBlKTtcbiAgICAgIH0gZWxzZSBpZiAoKHRoaXMub3B0aW9ucy5tYXhGaWxlcyAhPSBudWxsKSAmJiB0aGlzLmdldEFjY2VwdGVkRmlsZXMoKS5sZW5ndGggPj0gdGhpcy5vcHRpb25zLm1heEZpbGVzKSB7XG4gICAgICAgIGRvbmUodGhpcy5vcHRpb25zLmRpY3RNYXhGaWxlc0V4Y2VlZGVkLnJlcGxhY2UoXCJ7e21heEZpbGVzfX1cIiwgdGhpcy5vcHRpb25zLm1heEZpbGVzKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXQoXCJtYXhmaWxlc2V4Y2VlZGVkXCIsIGZpbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5hY2NlcHQuY2FsbCh0aGlzLCBmaWxlLCBkb25lKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmFkZEZpbGUgPSBmdW5jdGlvbihmaWxlKSB7XG4gICAgICBmaWxlLnVwbG9hZCA9IHtcbiAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICAgIHRvdGFsOiBmaWxlLnNpemUsXG4gICAgICAgIGJ5dGVzU2VudDogMFxuICAgICAgfTtcbiAgICAgIHRoaXMuZmlsZXMucHVzaChmaWxlKTtcbiAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuQURERUQ7XG4gICAgICB0aGlzLmVtaXQoXCJhZGRlZGZpbGVcIiwgZmlsZSk7XG4gICAgICB0aGlzLl9lbnF1ZXVlVGh1bWJuYWlsKGZpbGUpO1xuICAgICAgcmV0dXJuIHRoaXMuYWNjZXB0KGZpbGUsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGZpbGUuYWNjZXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIF90aGlzLl9lcnJvclByb2Nlc3NpbmcoW2ZpbGVdLCBlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbGUuYWNjZXB0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuYXV0b1F1ZXVlKSB7XG4gICAgICAgICAgICAgIF90aGlzLmVucXVldWVGaWxlKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3RoaXMuX3VwZGF0ZU1heEZpbGVzUmVhY2hlZENsYXNzKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5lbnF1ZXVlRmlsZXMgPSBmdW5jdGlvbihmaWxlcykge1xuICAgICAgdmFyIGZpbGUsIF9pLCBfbGVuO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBmaWxlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmaWxlID0gZmlsZXNbX2ldO1xuICAgICAgICB0aGlzLmVucXVldWVGaWxlKGZpbGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5lbnF1ZXVlRmlsZSA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIGlmIChmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuQURERUQgJiYgZmlsZS5hY2NlcHRlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBmaWxlLnN0YXR1cyA9IERyb3B6b25lLlFVRVVFRDtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUHJvY2Vzc1F1ZXVlKSB7XG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pKHRoaXMpKSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgZmlsZSBjYW4ndCBiZSBxdWV1ZWQgYmVjYXVzZSBpdCBoYXMgYWxyZWFkeSBiZWVuIHByb2Nlc3NlZCBvciB3YXMgcmVqZWN0ZWQuXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX3RodW1ibmFpbFF1ZXVlID0gW107XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX3Byb2Nlc3NpbmdUaHVtYm5haWwgPSBmYWxzZTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5fZW5xdWV1ZVRodW1ibmFpbCA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3JlYXRlSW1hZ2VUaHVtYm5haWxzICYmIGZpbGUudHlwZS5tYXRjaCgvaW1hZ2UuKi8pICYmIGZpbGUuc2l6ZSA8PSB0aGlzLm9wdGlvbnMubWF4VGh1bWJuYWlsRmlsZXNpemUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgICB0aGlzLl90aHVtYm5haWxRdWV1ZS5wdXNoKGZpbGUpO1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9wcm9jZXNzVGh1bWJuYWlsUXVldWUoKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSksIDApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX3Byb2Nlc3NUaHVtYm5haWxRdWV1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX3Byb2Nlc3NpbmdUaHVtYm5haWwgfHwgdGhpcy5fdGh1bWJuYWlsUXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3Byb2Nlc3NpbmdUaHVtYm5haWwgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlVGh1bWJuYWlsKHRoaXMuX3RodW1ibmFpbFF1ZXVlLnNoaWZ0KCksIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgX3RoaXMuX3Byb2Nlc3NpbmdUaHVtYm5haWwgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuX3Byb2Nlc3NUaHVtYm5haWxRdWV1ZSgpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUucmVtb3ZlRmlsZSA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIGlmIChmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuVVBMT0FESU5HKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsVXBsb2FkKGZpbGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5maWxlcyA9IHdpdGhvdXQodGhpcy5maWxlcywgZmlsZSk7XG4gICAgICB0aGlzLmVtaXQoXCJyZW1vdmVkZmlsZVwiLCBmaWxlKTtcbiAgICAgIGlmICh0aGlzLmZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0KFwicmVzZXRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5yZW1vdmVBbGxGaWxlcyA9IGZ1bmN0aW9uKGNhbmNlbElmTmVjZXNzYXJ5KSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW4sIF9yZWY7XG4gICAgICBpZiAoY2FuY2VsSWZOZWNlc3NhcnkgPT0gbnVsbCkge1xuICAgICAgICBjYW5jZWxJZk5lY2Vzc2FyeSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgX3JlZiA9IHRoaXMuZmlsZXMuc2xpY2UoKTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmaWxlID0gX3JlZltfaV07XG4gICAgICAgIGlmIChmaWxlLnN0YXR1cyAhPT0gRHJvcHpvbmUuVVBMT0FESU5HIHx8IGNhbmNlbElmTmVjZXNzYXJ5KSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVGaWxlKGZpbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmNyZWF0ZVRodW1ibmFpbCA9IGZ1bmN0aW9uKGZpbGUsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgZmlsZVJlYWRlcjtcbiAgICAgIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcjtcbiAgICAgIGZpbGVSZWFkZXIub25sb2FkID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoZmlsZS50eXBlID09PSBcImltYWdlL3N2Zyt4bWxcIikge1xuICAgICAgICAgICAgX3RoaXMuZW1pdChcInRodW1ibmFpbFwiLCBmaWxlLCBmaWxlUmVhZGVyLnJlc3VsdCk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3RoaXMuY3JlYXRlVGh1bWJuYWlsRnJvbVVybChmaWxlLCBmaWxlUmVhZGVyLnJlc3VsdCwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICByZXR1cm4gZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuY3JlYXRlVGh1bWJuYWlsRnJvbVVybCA9IGZ1bmN0aW9uKGZpbGUsIGltYWdlVXJsLCBjYWxsYmFjaywgY3Jvc3NPcmlnaW4pIHtcbiAgICAgIHZhciBpbWc7XG4gICAgICBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgaWYgKGNyb3NzT3JpZ2luKSB7XG4gICAgICAgIGltZy5jcm9zc09yaWdpbiA9IGNyb3NzT3JpZ2luO1xuICAgICAgfVxuICAgICAgaW1nLm9ubG9hZCA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGNhbnZhcywgY3R4LCByZXNpemVJbmZvLCB0aHVtYm5haWwsIF9yZWYsIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICAgICAgZmlsZS53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgICBmaWxlLmhlaWdodCA9IGltZy5oZWlnaHQ7XG4gICAgICAgICAgcmVzaXplSW5mbyA9IF90aGlzLm9wdGlvbnMucmVzaXplLmNhbGwoX3RoaXMsIGZpbGUpO1xuICAgICAgICAgIGlmIChyZXNpemVJbmZvLnRyZ1dpZHRoID09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc2l6ZUluZm8udHJnV2lkdGggPSByZXNpemVJbmZvLm9wdFdpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzaXplSW5mby50cmdIZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzaXplSW5mby50cmdIZWlnaHQgPSByZXNpemVJbmZvLm9wdEhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHJlc2l6ZUluZm8udHJnV2lkdGg7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHJlc2l6ZUluZm8udHJnSGVpZ2h0O1xuICAgICAgICAgIGRyYXdJbWFnZUlPU0ZpeChjdHgsIGltZywgKF9yZWYgPSByZXNpemVJbmZvLnNyY1gpICE9IG51bGwgPyBfcmVmIDogMCwgKF9yZWYxID0gcmVzaXplSW5mby5zcmNZKSAhPSBudWxsID8gX3JlZjEgOiAwLCByZXNpemVJbmZvLnNyY1dpZHRoLCByZXNpemVJbmZvLnNyY0hlaWdodCwgKF9yZWYyID0gcmVzaXplSW5mby50cmdYKSAhPSBudWxsID8gX3JlZjIgOiAwLCAoX3JlZjMgPSByZXNpemVJbmZvLnRyZ1kpICE9IG51bGwgPyBfcmVmMyA6IDAsIHJlc2l6ZUluZm8udHJnV2lkdGgsIHJlc2l6ZUluZm8udHJnSGVpZ2h0KTtcbiAgICAgICAgICB0aHVtYm5haWwgPSBjYW52YXMudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO1xuICAgICAgICAgIF90aGlzLmVtaXQoXCJ0aHVtYm5haWxcIiwgZmlsZSwgdGh1bWJuYWlsKTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICBpbWcub25lcnJvciA9IGNhbGxiYWNrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGltZy5zcmMgPSBpbWFnZVVybDtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnByb2Nlc3NRdWV1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGksIHBhcmFsbGVsVXBsb2FkcywgcHJvY2Vzc2luZ0xlbmd0aCwgcXVldWVkRmlsZXM7XG4gICAgICBwYXJhbGxlbFVwbG9hZHMgPSB0aGlzLm9wdGlvbnMucGFyYWxsZWxVcGxvYWRzO1xuICAgICAgcHJvY2Vzc2luZ0xlbmd0aCA9IHRoaXMuZ2V0VXBsb2FkaW5nRmlsZXMoKS5sZW5ndGg7XG4gICAgICBpID0gcHJvY2Vzc2luZ0xlbmd0aDtcbiAgICAgIGlmIChwcm9jZXNzaW5nTGVuZ3RoID49IHBhcmFsbGVsVXBsb2Fkcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBxdWV1ZWRGaWxlcyA9IHRoaXMuZ2V0UXVldWVkRmlsZXMoKTtcbiAgICAgIGlmICghKHF1ZXVlZEZpbGVzLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0ZpbGVzKHF1ZXVlZEZpbGVzLnNsaWNlKDAsIHBhcmFsbGVsVXBsb2FkcyAtIHByb2Nlc3NpbmdMZW5ndGgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChpIDwgcGFyYWxsZWxVcGxvYWRzKSB7XG4gICAgICAgICAgaWYgKCFxdWV1ZWRGaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5wcm9jZXNzRmlsZShxdWV1ZWRGaWxlcy5zaGlmdCgpKTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnByb2Nlc3NGaWxlID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0ZpbGVzKFtmaWxlXSk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5wcm9jZXNzRmlsZXMgPSBmdW5jdGlvbihmaWxlcykge1xuICAgICAgdmFyIGZpbGUsIF9pLCBfbGVuO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBmaWxlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmaWxlID0gZmlsZXNbX2ldO1xuICAgICAgICBmaWxlLnByb2Nlc3NpbmcgPSB0cnVlO1xuICAgICAgICBmaWxlLnN0YXR1cyA9IERyb3B6b25lLlVQTE9BRElORztcbiAgICAgICAgdGhpcy5lbWl0KFwicHJvY2Vzc2luZ1wiLCBmaWxlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwicHJvY2Vzc2luZ211bHRpcGxlXCIsIGZpbGVzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnVwbG9hZEZpbGVzKGZpbGVzKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9nZXRGaWxlc1dpdGhYaHIgPSBmdW5jdGlvbih4aHIpIHtcbiAgICAgIHZhciBmaWxlLCBmaWxlcztcbiAgICAgIHJldHVybiBmaWxlcyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgICAgX3JlZiA9IHRoaXMuZmlsZXM7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGZpbGUgPSBfcmVmW19pXTtcbiAgICAgICAgICBpZiAoZmlsZS54aHIgPT09IHhocikge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChmaWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmNhbmNlbFVwbG9hZCA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIHZhciBncm91cGVkRmlsZSwgZ3JvdXBlZEZpbGVzLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmO1xuICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5VUExPQURJTkcpIHtcbiAgICAgICAgZ3JvdXBlZEZpbGVzID0gdGhpcy5fZ2V0RmlsZXNXaXRoWGhyKGZpbGUueGhyKTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBncm91cGVkRmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBncm91cGVkRmlsZSA9IGdyb3VwZWRGaWxlc1tfaV07XG4gICAgICAgICAgZ3JvdXBlZEZpbGUuc3RhdHVzID0gRHJvcHpvbmUuQ0FOQ0VMRUQ7XG4gICAgICAgIH1cbiAgICAgICAgZmlsZS54aHIuYWJvcnQoKTtcbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gZ3JvdXBlZEZpbGVzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIGdyb3VwZWRGaWxlID0gZ3JvdXBlZEZpbGVzW19qXTtcbiAgICAgICAgICB0aGlzLmVtaXQoXCJjYW5jZWxlZFwiLCBncm91cGVkRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMuZW1pdChcImNhbmNlbGVkbXVsdGlwbGVcIiwgZ3JvdXBlZEZpbGVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgoX3JlZiA9IGZpbGUuc3RhdHVzKSA9PT0gRHJvcHpvbmUuQURERUQgfHwgX3JlZiA9PT0gRHJvcHpvbmUuUVVFVUVEKSB7XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuQ0FOQ0VMRUQ7XG4gICAgICAgIHRoaXMuZW1pdChcImNhbmNlbGVkXCIsIGZpbGUpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2FuY2VsZWRtdWx0aXBsZVwiLCBbZmlsZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Qcm9jZXNzUXVldWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlc29sdmVPcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBvcHRpb247XG4gICAgICBvcHRpb24gPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHRpb247XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS51cGxvYWRGaWxlID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgcmV0dXJuIHRoaXMudXBsb2FkRmlsZXMoW2ZpbGVdKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnVwbG9hZEZpbGVzID0gZnVuY3Rpb24oZmlsZXMpIHtcbiAgICAgIHZhciBmaWxlLCBmb3JtRGF0YSwgaGFuZGxlRXJyb3IsIGhlYWRlck5hbWUsIGhlYWRlclZhbHVlLCBoZWFkZXJzLCBpLCBpbnB1dCwgaW5wdXROYW1lLCBpbnB1dFR5cGUsIGtleSwgbWV0aG9kLCBvcHRpb24sIHByb2dyZXNzT2JqLCByZXNwb25zZSwgdXBkYXRlUHJvZ3Jlc3MsIHVybCwgdmFsdWUsIHhociwgX2ksIF9qLCBfaywgX2wsIF9sZW4sIF9sZW4xLCBfbGVuMiwgX2xlbjMsIF9tLCBfcmVmLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNCwgX3JlZjU7XG4gICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IGZpbGVzW19pXTtcbiAgICAgICAgZmlsZS54aHIgPSB4aHI7XG4gICAgICB9XG4gICAgICBtZXRob2QgPSByZXNvbHZlT3B0aW9uKHRoaXMub3B0aW9ucy5tZXRob2QsIGZpbGVzKTtcbiAgICAgIHVybCA9IHJlc29sdmVPcHRpb24odGhpcy5vcHRpb25zLnVybCwgZmlsZXMpO1xuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9ICEhdGhpcy5vcHRpb25zLndpdGhDcmVkZW50aWFscztcbiAgICAgIHJlc3BvbnNlID0gbnVsbDtcbiAgICAgIGhhbmRsZUVycm9yID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX2osIF9sZW4xLCBfcmVzdWx0cztcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IGZpbGVzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgZmlsZSA9IGZpbGVzW19qXTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goX3RoaXMuX2Vycm9yUHJvY2Vzc2luZyhmaWxlcywgcmVzcG9uc2UgfHwgX3RoaXMub3B0aW9ucy5kaWN0UmVzcG9uc2VFcnJvci5yZXBsYWNlKFwie3tzdGF0dXNDb2RlfX1cIiwgeGhyLnN0YXR1cyksIHhocikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIHVwZGF0ZVByb2dyZXNzID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGFsbEZpbGVzRmluaXNoZWQsIHByb2dyZXNzLCBfaiwgX2ssIF9sLCBfbGVuMSwgX2xlbjIsIF9sZW4zLCBfcmVzdWx0cztcbiAgICAgICAgICBpZiAoZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBwcm9ncmVzcyA9IDEwMCAqIGUubG9hZGVkIC8gZS50b3RhbDtcbiAgICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IGZpbGVzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgICBmaWxlID0gZmlsZXNbX2pdO1xuICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IHtcbiAgICAgICAgICAgICAgICBwcm9ncmVzczogcHJvZ3Jlc3MsXG4gICAgICAgICAgICAgICAgdG90YWw6IGUudG90YWwsXG4gICAgICAgICAgICAgICAgYnl0ZXNTZW50OiBlLmxvYWRlZFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGxGaWxlc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHByb2dyZXNzID0gMTAwO1xuICAgICAgICAgICAgZm9yIChfayA9IDAsIF9sZW4yID0gZmlsZXMubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgICAgICAgICAgIGZpbGUgPSBmaWxlc1tfa107XG4gICAgICAgICAgICAgIGlmICghKGZpbGUudXBsb2FkLnByb2dyZXNzID09PSAxMDAgJiYgZmlsZS51cGxvYWQuYnl0ZXNTZW50ID09PSBmaWxlLnVwbG9hZC50b3RhbCkpIHtcbiAgICAgICAgICAgICAgICBhbGxGaWxlc0ZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZmlsZS51cGxvYWQucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgICAgICAgICAgZmlsZS51cGxvYWQuYnl0ZXNTZW50ID0gZmlsZS51cGxvYWQudG90YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWxsRmlsZXNGaW5pc2hlZCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfbCA9IDAsIF9sZW4zID0gZmlsZXMubGVuZ3RoOyBfbCA8IF9sZW4zOyBfbCsrKSB7XG4gICAgICAgICAgICBmaWxlID0gZmlsZXNbX2xdO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChfdGhpcy5lbWl0KFwidXBsb2FkcHJvZ3Jlc3NcIiwgZmlsZSwgcHJvZ3Jlc3MsIGZpbGUudXBsb2FkLmJ5dGVzU2VudCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIHhoci5vbmxvYWQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICB2YXIgX3JlZjtcbiAgICAgICAgICBpZiAoZmlsZXNbMF0uc3RhdHVzID09PSBEcm9wem9uZS5DQU5DRUxFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgIGlmICh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJjb250ZW50LXR5cGVcIikgJiYgfnhoci5nZXRSZXNwb25zZUhlYWRlcihcImNvbnRlbnQtdHlwZVwiKS5pbmRleE9mKFwiYXBwbGljYXRpb24vanNvblwiKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgICAgICAgICByZXNwb25zZSA9IFwiSW52YWxpZCBKU09OIHJlc3BvbnNlIGZyb20gc2VydmVyLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cGRhdGVQcm9ncmVzcygpO1xuICAgICAgICAgIGlmICghKCgyMDAgPD0gKF9yZWYgPSB4aHIuc3RhdHVzKSAmJiBfcmVmIDwgMzAwKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVFcnJvcigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX2ZpbmlzaGVkKGZpbGVzLCByZXNwb25zZSwgZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICB4aHIub25lcnJvciA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGZpbGVzWzBdLnN0YXR1cyA9PT0gRHJvcHpvbmUuQ0FOQ0VMRUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIHByb2dyZXNzT2JqID0gKF9yZWYgPSB4aHIudXBsb2FkKSAhPSBudWxsID8gX3JlZiA6IHhocjtcbiAgICAgIHByb2dyZXNzT2JqLm9ucHJvZ3Jlc3MgPSB1cGRhdGVQcm9ncmVzcztcbiAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJuby1jYWNoZVwiLFxuICAgICAgICBcIlgtUmVxdWVzdGVkLVdpdGhcIjogXCJYTUxIdHRwUmVxdWVzdFwiXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIGV4dGVuZChoZWFkZXJzLCB0aGlzLm9wdGlvbnMuaGVhZGVycyk7XG4gICAgICB9XG4gICAgICBmb3IgKGhlYWRlck5hbWUgaW4gaGVhZGVycykge1xuICAgICAgICBoZWFkZXJWYWx1ZSA9IGhlYWRlcnNbaGVhZGVyTmFtZV07XG4gICAgICAgIGlmIChoZWFkZXJWYWx1ZSkge1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlck5hbWUsIGhlYWRlclZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFyYW1zKSB7XG4gICAgICAgIF9yZWYxID0gdGhpcy5vcHRpb25zLnBhcmFtcztcbiAgICAgICAgZm9yIChrZXkgaW4gX3JlZjEpIHtcbiAgICAgICAgICB2YWx1ZSA9IF9yZWYxW2tleV07XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBmaWxlcy5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgZmlsZSA9IGZpbGVzW19qXTtcbiAgICAgICAgdGhpcy5lbWl0KFwic2VuZGluZ1wiLCBmaWxlLCB4aHIsIGZvcm1EYXRhKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwic2VuZGluZ211bHRpcGxlXCIsIGZpbGVzLCB4aHIsIGZvcm1EYXRhKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVsZW1lbnQudGFnTmFtZSA9PT0gXCJGT1JNXCIpIHtcbiAgICAgICAgX3JlZjIgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0LCB0ZXh0YXJlYSwgc2VsZWN0LCBidXR0b25cIik7XG4gICAgICAgIGZvciAoX2sgPSAwLCBfbGVuMiA9IF9yZWYyLmxlbmd0aDsgX2sgPCBfbGVuMjsgX2srKykge1xuICAgICAgICAgIGlucHV0ID0gX3JlZjJbX2tdO1xuICAgICAgICAgIGlucHV0TmFtZSA9IGlucHV0LmdldEF0dHJpYnV0ZShcIm5hbWVcIik7XG4gICAgICAgICAgaW5wdXRUeXBlID0gaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKTtcbiAgICAgICAgICBpZiAoaW5wdXQudGFnTmFtZSA9PT0gXCJTRUxFQ1RcIiAmJiBpbnB1dC5oYXNBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKSkge1xuICAgICAgICAgICAgX3JlZjMgPSBpbnB1dC5vcHRpb25zO1xuICAgICAgICAgICAgZm9yIChfbCA9IDAsIF9sZW4zID0gX3JlZjMubGVuZ3RoOyBfbCA8IF9sZW4zOyBfbCsrKSB7XG4gICAgICAgICAgICAgIG9wdGlvbiA9IF9yZWYzW19sXTtcbiAgICAgICAgICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChpbnB1dE5hbWUsIG9wdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKCFpbnB1dFR5cGUgfHwgKChfcmVmNCA9IGlucHV0VHlwZS50b0xvd2VyQ2FzZSgpKSAhPT0gXCJjaGVja2JveFwiICYmIF9yZWY0ICE9PSBcInJhZGlvXCIpIHx8IGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChpbnB1dE5hbWUsIGlucHV0LnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IF9tID0gMCwgX3JlZjUgPSBmaWxlcy5sZW5ndGggLSAxOyAwIDw9IF9yZWY1ID8gX20gPD0gX3JlZjUgOiBfbSA+PSBfcmVmNTsgaSA9IDAgPD0gX3JlZjUgPyArK19tIDogLS1fbSkge1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQodGhpcy5fZ2V0UGFyYW1OYW1lKGkpLCBmaWxlc1tpXSwgdGhpcy5fcmVuYW1lRmlsZW5hbWUoZmlsZXNbaV0ubmFtZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc3VibWl0UmVxdWVzdCh4aHIsIGZvcm1EYXRhLCBmaWxlcyk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5zdWJtaXRSZXF1ZXN0ID0gZnVuY3Rpb24oeGhyLCBmb3JtRGF0YSwgZmlsZXMpIHtcbiAgICAgIHJldHVybiB4aHIuc2VuZChmb3JtRGF0YSk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5fZmluaXNoZWQgPSBmdW5jdGlvbihmaWxlcywgcmVzcG9uc2VUZXh0LCBlKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW47XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGZpbGVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBmaWxlc1tfaV07XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuU1VDQ0VTUztcbiAgICAgICAgdGhpcy5lbWl0KFwic3VjY2Vzc1wiLCBmaWxlLCByZXNwb25zZVRleHQsIGUpO1xuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZVwiLCBmaWxlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwic3VjY2Vzc211bHRpcGxlXCIsIGZpbGVzLCByZXNwb25zZVRleHQsIGUpO1xuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZW11bHRpcGxlXCIsIGZpbGVzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1Byb2Nlc3NRdWV1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzUXVldWUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9lcnJvclByb2Nlc3NpbmcgPSBmdW5jdGlvbihmaWxlcywgbWVzc2FnZSwgeGhyKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW47XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGZpbGVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBmaWxlc1tfaV07XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuRVJST1I7XG4gICAgICAgIHRoaXMuZW1pdChcImVycm9yXCIsIGZpbGUsIG1lc3NhZ2UsIHhocik7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmVtaXQoXCJlcnJvcm11bHRpcGxlXCIsIGZpbGVzLCBtZXNzYWdlLCB4aHIpO1xuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZW11bHRpcGxlXCIsIGZpbGVzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1Byb2Nlc3NRdWV1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzUXVldWUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIERyb3B6b25lO1xuXG4gIH0pKEVtaXR0ZXIpO1xuXG4gIERyb3B6b25lLnZlcnNpb24gPSBcIjQuMy4wXCI7XG5cbiAgRHJvcHpvbmUub3B0aW9ucyA9IHt9O1xuXG4gIERyb3B6b25lLm9wdGlvbnNGb3JFbGVtZW50ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImlkXCIpKSB7XG4gICAgICByZXR1cm4gRHJvcHpvbmUub3B0aW9uc1tjYW1lbGl6ZShlbGVtZW50LmdldEF0dHJpYnV0ZShcImlkXCIpKV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICB9O1xuXG4gIERyb3B6b25lLmluc3RhbmNlcyA9IFtdO1xuXG4gIERyb3B6b25lLmZvckVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KTtcbiAgICB9XG4gICAgaWYgKChlbGVtZW50ICE9IG51bGwgPyBlbGVtZW50LmRyb3B6b25lIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBEcm9wem9uZSBmb3VuZCBmb3IgZ2l2ZW4gZWxlbWVudC4gVGhpcyBpcyBwcm9iYWJseSBiZWNhdXNlIHlvdSdyZSB0cnlpbmcgdG8gYWNjZXNzIGl0IGJlZm9yZSBEcm9wem9uZSBoYWQgdGhlIHRpbWUgdG8gaW5pdGlhbGl6ZS4gVXNlIHRoZSBgaW5pdGAgb3B0aW9uIHRvIHNldHVwIGFueSBhZGRpdGlvbmFsIG9ic2VydmVycyBvbiB5b3VyIERyb3B6b25lLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQuZHJvcHpvbmU7XG4gIH07XG5cbiAgRHJvcHpvbmUuYXV0b0Rpc2NvdmVyID0gdHJ1ZTtcblxuICBEcm9wem9uZS5kaXNjb3ZlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjaGVja0VsZW1lbnRzLCBkcm9wem9uZSwgZHJvcHpvbmVzLCBfaSwgX2xlbiwgX3Jlc3VsdHM7XG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAgIGRyb3B6b25lcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcHpvbmVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRyb3B6b25lcyA9IFtdO1xuICAgICAgY2hlY2tFbGVtZW50cyA9IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgICAgIHZhciBlbCwgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGVsZW1lbnRzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgZWwgPSBlbGVtZW50c1tfaV07XG4gICAgICAgICAgaWYgKC8oXnwgKWRyb3B6b25lKCR8ICkvLnRlc3QoZWwuY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChkcm9wem9uZXMucHVzaChlbCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH07XG4gICAgICBjaGVja0VsZW1lbnRzKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpKTtcbiAgICAgIGNoZWNrRWxlbWVudHMoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJmb3JtXCIpKTtcbiAgICB9XG4gICAgX3Jlc3VsdHMgPSBbXTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGRyb3B6b25lcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgZHJvcHpvbmUgPSBkcm9wem9uZXNbX2ldO1xuICAgICAgaWYgKERyb3B6b25lLm9wdGlvbnNGb3JFbGVtZW50KGRyb3B6b25lKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgX3Jlc3VsdHMucHVzaChuZXcgRHJvcHpvbmUoZHJvcHpvbmUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9O1xuXG4gIERyb3B6b25lLmJsYWNrbGlzdGVkQnJvd3NlcnMgPSBbL29wZXJhLipNYWNpbnRvc2guKnZlcnNpb25cXC8xMi9pXTtcblxuICBEcm9wem9uZS5pc0Jyb3dzZXJTdXBwb3J0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FwYWJsZUJyb3dzZXIsIHJlZ2V4LCBfaSwgX2xlbiwgX3JlZjtcbiAgICBjYXBhYmxlQnJvd3NlciA9IHRydWU7XG4gICAgaWYgKHdpbmRvdy5GaWxlICYmIHdpbmRvdy5GaWxlUmVhZGVyICYmIHdpbmRvdy5GaWxlTGlzdCAmJiB3aW5kb3cuQmxvYiAmJiB3aW5kb3cuRm9ybURhdGEgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcikge1xuICAgICAgaWYgKCEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKSkpIHtcbiAgICAgICAgY2FwYWJsZUJyb3dzZXIgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9yZWYgPSBEcm9wem9uZS5ibGFja2xpc3RlZEJyb3dzZXJzO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICByZWdleCA9IF9yZWZbX2ldO1xuICAgICAgICAgIGlmIChyZWdleC50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgICAgICBjYXBhYmxlQnJvd3NlciA9IGZhbHNlO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhcGFibGVCcm93c2VyID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBjYXBhYmxlQnJvd3NlcjtcbiAgfTtcblxuICB3aXRob3V0ID0gZnVuY3Rpb24obGlzdCwgcmVqZWN0ZWRJdGVtKSB7XG4gICAgdmFyIGl0ZW0sIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICBfcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gbGlzdC5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgaXRlbSA9IGxpc3RbX2ldO1xuICAgICAgaWYgKGl0ZW0gIT09IHJlamVjdGVkSXRlbSkge1xuICAgICAgICBfcmVzdWx0cy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG5cbiAgY2FtZWxpemUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1fXShcXHcpL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICByZXR1cm4gbWF0Y2guY2hhckF0KDEpLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgRHJvcHpvbmUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgIHZhciBkaXY7XG4gICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gc3RyaW5nO1xuICAgIHJldHVybiBkaXYuY2hpbGROb2Rlc1swXTtcbiAgfTtcblxuICBEcm9wem9uZS5lbGVtZW50SW5zaWRlID0gZnVuY3Rpb24oZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgaWYgKGVsZW1lbnQgPT09IGNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgRHJvcHpvbmUuZ2V0RWxlbWVudCA9IGZ1bmN0aW9uKGVsLCBuYW1lKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgaWYgKHR5cGVvZiBlbCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIH0gZWxzZSBpZiAoZWwubm9kZVR5cGUgIT0gbnVsbCkge1xuICAgICAgZWxlbWVudCA9IGVsO1xuICAgIH1cbiAgICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGBcIiArIG5hbWUgKyBcImAgb3B0aW9uIHByb3ZpZGVkLiBQbGVhc2UgcHJvdmlkZSBhIENTUyBzZWxlY3RvciBvciBhIHBsYWluIEhUTUwgZWxlbWVudC5cIik7XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50O1xuICB9O1xuXG4gIERyb3B6b25lLmdldEVsZW1lbnRzID0gZnVuY3Rpb24oZWxzLCBuYW1lKSB7XG4gICAgdmFyIGUsIGVsLCBlbGVtZW50cywgX2ksIF9qLCBfbGVuLCBfbGVuMSwgX3JlZjtcbiAgICBpZiAoZWxzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGVsZW1lbnRzID0gW107XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGVscy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGVsID0gZWxzW19pXTtcbiAgICAgICAgICBlbGVtZW50cy5wdXNoKHRoaXMuZ2V0RWxlbWVudChlbCwgbmFtZSkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgZSA9IF9lcnJvcjtcbiAgICAgICAgZWxlbWVudHMgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVscyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgZWxlbWVudHMgPSBbXTtcbiAgICAgIF9yZWYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVscyk7XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBlbCA9IF9yZWZbX2pdO1xuICAgICAgICBlbGVtZW50cy5wdXNoKGVsKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVscy5ub2RlVHlwZSAhPSBudWxsKSB7XG4gICAgICBlbGVtZW50cyA9IFtlbHNdO1xuICAgIH1cbiAgICBpZiAoISgoZWxlbWVudHMgIT0gbnVsbCkgJiYgZWxlbWVudHMubGVuZ3RoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBgXCIgKyBuYW1lICsgXCJgIG9wdGlvbiBwcm92aWRlZC4gUGxlYXNlIHByb3ZpZGUgYSBDU1Mgc2VsZWN0b3IsIGEgcGxhaW4gSFRNTCBlbGVtZW50IG9yIGEgbGlzdCBvZiB0aG9zZS5cIik7XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50cztcbiAgfTtcblxuICBEcm9wem9uZS5jb25maXJtID0gZnVuY3Rpb24ocXVlc3Rpb24sIGFjY2VwdGVkLCByZWplY3RlZCkge1xuICAgIGlmICh3aW5kb3cuY29uZmlybShxdWVzdGlvbikpIHtcbiAgICAgIHJldHVybiBhY2NlcHRlZCgpO1xuICAgIH0gZWxzZSBpZiAocmVqZWN0ZWQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHJlamVjdGVkKCk7XG4gICAgfVxuICB9O1xuXG4gIERyb3B6b25lLmlzVmFsaWRGaWxlID0gZnVuY3Rpb24oZmlsZSwgYWNjZXB0ZWRGaWxlcykge1xuICAgIHZhciBiYXNlTWltZVR5cGUsIG1pbWVUeXBlLCB2YWxpZFR5cGUsIF9pLCBfbGVuO1xuICAgIGlmICghYWNjZXB0ZWRGaWxlcykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGFjY2VwdGVkRmlsZXMgPSBhY2NlcHRlZEZpbGVzLnNwbGl0KFwiLFwiKTtcbiAgICBtaW1lVHlwZSA9IGZpbGUudHlwZTtcbiAgICBiYXNlTWltZVR5cGUgPSBtaW1lVHlwZS5yZXBsYWNlKC9cXC8uKiQvLCBcIlwiKTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGFjY2VwdGVkRmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIHZhbGlkVHlwZSA9IGFjY2VwdGVkRmlsZXNbX2ldO1xuICAgICAgdmFsaWRUeXBlID0gdmFsaWRUeXBlLnRyaW0oKTtcbiAgICAgIGlmICh2YWxpZFR5cGUuY2hhckF0KDApID09PSBcIi5cIikge1xuICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih2YWxpZFR5cGUudG9Mb3dlckNhc2UoKSwgZmlsZS5uYW1lLmxlbmd0aCAtIHZhbGlkVHlwZS5sZW5ndGgpICE9PSAtMSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKC9cXC9cXCokLy50ZXN0KHZhbGlkVHlwZSkpIHtcbiAgICAgICAgaWYgKGJhc2VNaW1lVHlwZSA9PT0gdmFsaWRUeXBlLnJlcGxhY2UoL1xcLy4qJC8sIFwiXCIpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtaW1lVHlwZSA9PT0gdmFsaWRUeXBlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGlmICh0eXBlb2YgalF1ZXJ5ICE9PSBcInVuZGVmaW5lZFwiICYmIGpRdWVyeSAhPT0gbnVsbCkge1xuICAgIGpRdWVyeS5mbi5kcm9wem9uZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgRHJvcHpvbmUodGhpcywgb3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlICE9PSBudWxsKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBEcm9wem9uZTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuRHJvcHpvbmUgPSBEcm9wem9uZTtcbiAgfVxuXG4gIERyb3B6b25lLkFEREVEID0gXCJhZGRlZFwiO1xuXG4gIERyb3B6b25lLlFVRVVFRCA9IFwicXVldWVkXCI7XG5cbiAgRHJvcHpvbmUuQUNDRVBURUQgPSBEcm9wem9uZS5RVUVVRUQ7XG5cbiAgRHJvcHpvbmUuVVBMT0FESU5HID0gXCJ1cGxvYWRpbmdcIjtcblxuICBEcm9wem9uZS5QUk9DRVNTSU5HID0gRHJvcHpvbmUuVVBMT0FESU5HO1xuXG4gIERyb3B6b25lLkNBTkNFTEVEID0gXCJjYW5jZWxlZFwiO1xuXG4gIERyb3B6b25lLkVSUk9SID0gXCJlcnJvclwiO1xuXG4gIERyb3B6b25lLlNVQ0NFU1MgPSBcInN1Y2Nlc3NcIjtcblxuXG4gIC8qXG4gIFxuICBCdWdmaXggZm9yIGlPUyA2IGFuZCA3XG4gIFNvdXJjZTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMTkyOTA5OS9odG1sNS1jYW52YXMtZHJhd2ltYWdlLXJhdGlvLWJ1Zy1pb3NcbiAgYmFzZWQgb24gdGhlIHdvcmsgb2YgaHR0cHM6Ly9naXRodWIuY29tL3N0b21pdGEvaW9zLWltYWdlZmlsZS1tZWdhcGl4ZWxcbiAgICovXG5cbiAgZGV0ZWN0VmVydGljYWxTcXVhc2ggPSBmdW5jdGlvbihpbWcpIHtcbiAgICB2YXIgYWxwaGEsIGNhbnZhcywgY3R4LCBkYXRhLCBleSwgaWgsIGl3LCBweSwgcmF0aW8sIHN5O1xuICAgIGl3ID0gaW1nLm5hdHVyYWxXaWR0aDtcbiAgICBpaCA9IGltZy5uYXR1cmFsSGVpZ2h0O1xuICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgY2FudmFzLndpZHRoID0gMTtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaWg7XG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XG4gICAgZGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMSwgaWgpLmRhdGE7XG4gICAgc3kgPSAwO1xuICAgIGV5ID0gaWg7XG4gICAgcHkgPSBpaDtcbiAgICB3aGlsZSAocHkgPiBzeSkge1xuICAgICAgYWxwaGEgPSBkYXRhWyhweSAtIDEpICogNCArIDNdO1xuICAgICAgaWYgKGFscGhhID09PSAwKSB7XG4gICAgICAgIGV5ID0gcHk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzeSA9IHB5O1xuICAgICAgfVxuICAgICAgcHkgPSAoZXkgKyBzeSkgPj4gMTtcbiAgICB9XG4gICAgcmF0aW8gPSBweSAvIGloO1xuICAgIGlmIChyYXRpbyA9PT0gMCkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByYXRpbztcbiAgICB9XG4gIH07XG5cbiAgZHJhd0ltYWdlSU9TRml4ID0gZnVuY3Rpb24oY3R4LCBpbWcsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaCkge1xuICAgIHZhciB2ZXJ0U3F1YXNoUmF0aW87XG4gICAgdmVydFNxdWFzaFJhdGlvID0gZGV0ZWN0VmVydGljYWxTcXVhc2goaW1nKTtcbiAgICByZXR1cm4gY3R4LmRyYXdJbWFnZShpbWcsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaCAvIHZlcnRTcXVhc2hSYXRpbyk7XG4gIH07XG5cblxuICAvKlxuICAgKiBjb250ZW50bG9hZGVkLmpzXG4gICAqXG4gICAqIEF1dGhvcjogRGllZ28gUGVyaW5pIChkaWVnby5wZXJpbmkgYXQgZ21haWwuY29tKVxuICAgKiBTdW1tYXJ5OiBjcm9zcy1icm93c2VyIHdyYXBwZXIgZm9yIERPTUNvbnRlbnRMb2FkZWRcbiAgICogVXBkYXRlZDogMjAxMDEwMjBcbiAgICogTGljZW5zZTogTUlUXG4gICAqIFZlcnNpb246IDEuMlxuICAgKlxuICAgKiBVUkw6XG4gICAqIGh0dHA6Ly9qYXZhc2NyaXB0Lm53Ym94LmNvbS9Db250ZW50TG9hZGVkL1xuICAgKiBodHRwOi8vamF2YXNjcmlwdC5ud2JveC5jb20vQ29udGVudExvYWRlZC9NSVQtTElDRU5TRVxuICAgKi9cblxuICBjb250ZW50TG9hZGVkID0gZnVuY3Rpb24od2luLCBmbikge1xuICAgIHZhciBhZGQsIGRvYywgZG9uZSwgaW5pdCwgcG9sbCwgcHJlLCByZW0sIHJvb3QsIHRvcDtcbiAgICBkb25lID0gZmFsc2U7XG4gICAgdG9wID0gdHJ1ZTtcbiAgICBkb2MgPSB3aW4uZG9jdW1lbnQ7XG4gICAgcm9vdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgYWRkID0gKGRvYy5hZGRFdmVudExpc3RlbmVyID8gXCJhZGRFdmVudExpc3RlbmVyXCIgOiBcImF0dGFjaEV2ZW50XCIpO1xuICAgIHJlbSA9IChkb2MuYWRkRXZlbnRMaXN0ZW5lciA/IFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiIDogXCJkZXRhY2hFdmVudFwiKTtcbiAgICBwcmUgPSAoZG9jLmFkZEV2ZW50TGlzdGVuZXIgPyBcIlwiIDogXCJvblwiKTtcbiAgICBpbml0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGUudHlwZSA9PT0gXCJyZWFkeXN0YXRlY2hhbmdlXCIgJiYgZG9jLnJlYWR5U3RhdGUgIT09IFwiY29tcGxldGVcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAoZS50eXBlID09PSBcImxvYWRcIiA/IHdpbiA6IGRvYylbcmVtXShwcmUgKyBlLnR5cGUsIGluaXQsIGZhbHNlKTtcbiAgICAgIGlmICghZG9uZSAmJiAoZG9uZSA9IHRydWUpKSB7XG4gICAgICAgIHJldHVybiBmbi5jYWxsKHdpbiwgZS50eXBlIHx8IGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgcG9sbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICB0cnkge1xuICAgICAgICByb290LmRvU2Nyb2xsKFwibGVmdFwiKTtcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgICBzZXRUaW1lb3V0KHBvbGwsIDUwKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGluaXQoXCJwb2xsXCIpO1xuICAgIH07XG4gICAgaWYgKGRvYy5yZWFkeVN0YXRlICE9PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgIGlmIChkb2MuY3JlYXRlRXZlbnRPYmplY3QgJiYgcm9vdC5kb1Njcm9sbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRvcCA9ICF3aW4uZnJhbWVFbGVtZW50O1xuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICAgIGlmICh0b3ApIHtcbiAgICAgICAgICBwb2xsKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRvY1thZGRdKHByZSArIFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0LCBmYWxzZSk7XG4gICAgICBkb2NbYWRkXShwcmUgKyBcInJlYWR5c3RhdGVjaGFuZ2VcIiwgaW5pdCwgZmFsc2UpO1xuICAgICAgcmV0dXJuIHdpblthZGRdKHByZSArIFwibG9hZFwiLCBpbml0LCBmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIERyb3B6b25lLl9hdXRvRGlzY292ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChEcm9wem9uZS5hdXRvRGlzY292ZXIpIHtcbiAgICAgIHJldHVybiBEcm9wem9uZS5kaXNjb3ZlcigpO1xuICAgIH1cbiAgfTtcblxuICBjb250ZW50TG9hZGVkKHdpbmRvdywgRHJvcHpvbmUuX2F1dG9EaXNjb3ZlckZ1bmN0aW9uKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcmVwZWF0ID0gZnVuY3Rpb24gcmVwZWF0KHN0ciwgdGltZXMpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh0aW1lcyArIDEpLmpvaW4oc3RyKTtcbn07XG52YXIgcGFkID0gZnVuY3Rpb24gcGFkKG51bSwgbWF4TGVuZ3RoKSB7XG4gIHJldHVybiByZXBlYXQoXCIwXCIsIG1heExlbmd0aCAtIG51bS50b1N0cmluZygpLmxlbmd0aCkgKyBudW07XG59O1xudmFyIGZvcm1hdFRpbWUgPSBmdW5jdGlvbiBmb3JtYXRUaW1lKHRpbWUpIHtcbiAgcmV0dXJuIFwiQCBcIiArIHBhZCh0aW1lLmdldEhvdXJzKCksIDIpICsgXCI6XCIgKyBwYWQodGltZS5nZXRNaW51dGVzKCksIDIpICsgXCI6XCIgKyBwYWQodGltZS5nZXRTZWNvbmRzKCksIDIpICsgXCIuXCIgKyBwYWQodGltZS5nZXRNaWxsaXNlY29uZHMoKSwgMyk7XG59O1xuXG4vLyBVc2UgdGhlIG5ldyBwZXJmb3JtYW5jZSBhcGkgdG8gZ2V0IGJldHRlciBwcmVjaXNpb24gaWYgYXZhaWxhYmxlXG52YXIgdGltZXIgPSB0eXBlb2YgcGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gXCJmdW5jdGlvblwiID8gcGVyZm9ybWFuY2UgOiBEYXRlO1xuXG4vKipcbiAqIENyZWF0ZXMgbG9nZ2VyIHdpdGggZm9sbG93ZWQgb3B0aW9uc1xuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyBmb3IgbG9nZ2VyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gb3B0aW9ucy5sZXZlbCAtIGNvbnNvbGVbbGV2ZWxdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMuZHVyYXRpb24gLSBwcmludCBkdXJhdGlvbiBvZiBlYWNoIGFjdGlvbj9cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy50aW1lc3RhbXAgLSBwcmludCB0aW1lc3RhbXAgd2l0aCBlYWNoIGFjdGlvbj9cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBvcHRpb25zLmNvbG9ycyAtIGN1c3RvbSBjb2xvcnNcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBvcHRpb25zLmxvZ2dlciAtIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgY29uc29sZWAgQVBJXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMubG9nRXJyb3JzIC0gc2hvdWxkIGVycm9ycyBpbiBhY3Rpb24gZXhlY3V0aW9uIGJlIGNhdWdodCwgbG9nZ2VkLCBhbmQgcmUtdGhyb3duP1xuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLmNvbGxhcHNlZCAtIGlzIGdyb3VwIGNvbGxhcHNlZD9cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy5wcmVkaWNhdGUgLSBjb25kaXRpb24gd2hpY2ggcmVzb2x2ZXMgbG9nZ2VyIGJlaGF2aW9yXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBvcHRpb25zLnN0YXRlVHJhbnNmb3JtZXIgLSB0cmFuc2Zvcm0gc3RhdGUgYmVmb3JlIHByaW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBvcHRpb25zLmFjdGlvblRyYW5zZm9ybWVyIC0gdHJhbnNmb3JtIGFjdGlvbiBiZWZvcmUgcHJpbnRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IG9wdGlvbnMuZXJyb3JUcmFuc2Zvcm1lciAtIHRyYW5zZm9ybSBlcnJvciBiZWZvcmUgcHJpbnRcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVMb2dnZXIoKSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG4gIHZhciBfb3B0aW9ucyRsZXZlbCA9IG9wdGlvbnMubGV2ZWw7XG4gIHZhciBsZXZlbCA9IF9vcHRpb25zJGxldmVsID09PSB1bmRlZmluZWQgPyBcImxvZ1wiIDogX29wdGlvbnMkbGV2ZWw7XG4gIHZhciBfb3B0aW9ucyRsb2dnZXIgPSBvcHRpb25zLmxvZ2dlcjtcbiAgdmFyIGxvZ2dlciA9IF9vcHRpb25zJGxvZ2dlciA9PT0gdW5kZWZpbmVkID8gY29uc29sZSA6IF9vcHRpb25zJGxvZ2dlcjtcbiAgdmFyIF9vcHRpb25zJGxvZ0Vycm9ycyA9IG9wdGlvbnMubG9nRXJyb3JzO1xuICB2YXIgbG9nRXJyb3JzID0gX29wdGlvbnMkbG9nRXJyb3JzID09PSB1bmRlZmluZWQgPyB0cnVlIDogX29wdGlvbnMkbG9nRXJyb3JzO1xuICB2YXIgY29sbGFwc2VkID0gb3B0aW9ucy5jb2xsYXBzZWQ7XG4gIHZhciBwcmVkaWNhdGUgPSBvcHRpb25zLnByZWRpY2F0ZTtcbiAgdmFyIF9vcHRpb25zJGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgdmFyIGR1cmF0aW9uID0gX29wdGlvbnMkZHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX29wdGlvbnMkZHVyYXRpb247XG4gIHZhciBfb3B0aW9ucyR0aW1lc3RhbXAgPSBvcHRpb25zLnRpbWVzdGFtcDtcbiAgdmFyIHRpbWVzdGFtcCA9IF9vcHRpb25zJHRpbWVzdGFtcCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9vcHRpb25zJHRpbWVzdGFtcDtcbiAgdmFyIHRyYW5zZm9ybWVyID0gb3B0aW9ucy50cmFuc2Zvcm1lcjtcbiAgdmFyIF9vcHRpb25zJHN0YXRlVHJhbnNmbyA9IG9wdGlvbnMuc3RhdGVUcmFuc2Zvcm1lcjtcbiAgdmFyIC8vIGRlcHJlY2F0ZWRcbiAgc3RhdGVUcmFuc2Zvcm1lciA9IF9vcHRpb25zJHN0YXRlVHJhbnNmbyA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9IDogX29wdGlvbnMkc3RhdGVUcmFuc2ZvO1xuICB2YXIgX29wdGlvbnMkYWN0aW9uVHJhbnNmID0gb3B0aW9ucy5hY3Rpb25UcmFuc2Zvcm1lcjtcbiAgdmFyIGFjdGlvblRyYW5zZm9ybWVyID0gX29wdGlvbnMkYWN0aW9uVHJhbnNmID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoYWN0bikge1xuICAgIHJldHVybiBhY3RuO1xuICB9IDogX29wdGlvbnMkYWN0aW9uVHJhbnNmO1xuICB2YXIgX29wdGlvbnMkZXJyb3JUcmFuc2ZvID0gb3B0aW9ucy5lcnJvclRyYW5zZm9ybWVyO1xuICB2YXIgZXJyb3JUcmFuc2Zvcm1lciA9IF9vcHRpb25zJGVycm9yVHJhbnNmbyA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgcmV0dXJuIGVycm9yO1xuICB9IDogX29wdGlvbnMkZXJyb3JUcmFuc2ZvO1xuICB2YXIgX29wdGlvbnMkY29sb3JzID0gb3B0aW9ucy5jb2xvcnM7XG4gIHZhciBjb2xvcnMgPSBfb3B0aW9ucyRjb2xvcnMgPT09IHVuZGVmaW5lZCA/IHtcbiAgICB0aXRsZTogZnVuY3Rpb24gdGl0bGUoKSB7XG4gICAgICByZXR1cm4gXCIjMDAwMDAwXCI7XG4gICAgfSxcbiAgICBwcmV2U3RhdGU6IGZ1bmN0aW9uIHByZXZTdGF0ZSgpIHtcbiAgICAgIHJldHVybiBcIiM5RTlFOUVcIjtcbiAgICB9LFxuICAgIGFjdGlvbjogZnVuY3Rpb24gYWN0aW9uKCkge1xuICAgICAgcmV0dXJuIFwiIzAzQTlGNFwiO1xuICAgIH0sXG4gICAgbmV4dFN0YXRlOiBmdW5jdGlvbiBuZXh0U3RhdGUoKSB7XG4gICAgICByZXR1cm4gXCIjNENBRjUwXCI7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgICByZXR1cm4gXCIjRjIwNDA0XCI7XG4gICAgfVxuICB9IDogX29wdGlvbnMkY29sb3JzO1xuXG4gIC8vIGV4aXQgaWYgY29uc29sZSB1bmRlZmluZWRcblxuICBpZiAodHlwZW9mIGxvZ2dlciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gbmV4dChhY3Rpb24pO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHRyYW5zZm9ybWVyKSB7XG4gICAgY29uc29sZS5lcnJvcihcIk9wdGlvbiAndHJhbnNmb3JtZXInIGlzIGRlcHJlY2F0ZWQsIHVzZSBzdGF0ZVRyYW5zZm9ybWVyIGluc3RlYWRcIik7XG4gIH1cblxuICB2YXIgbG9nQnVmZmVyID0gW107XG4gIGZ1bmN0aW9uIHByaW50QnVmZmVyKCkge1xuICAgIGxvZ0J1ZmZlci5mb3JFYWNoKGZ1bmN0aW9uIChsb2dFbnRyeSwga2V5KSB7XG4gICAgICB2YXIgc3RhcnRlZCA9IGxvZ0VudHJ5LnN0YXJ0ZWQ7XG4gICAgICB2YXIgc3RhcnRlZFRpbWUgPSBsb2dFbnRyeS5zdGFydGVkVGltZTtcbiAgICAgIHZhciBhY3Rpb24gPSBsb2dFbnRyeS5hY3Rpb247XG4gICAgICB2YXIgcHJldlN0YXRlID0gbG9nRW50cnkucHJldlN0YXRlO1xuICAgICAgdmFyIGVycm9yID0gbG9nRW50cnkuZXJyb3I7XG4gICAgICB2YXIgdG9vayA9IGxvZ0VudHJ5LnRvb2s7XG4gICAgICB2YXIgbmV4dFN0YXRlID0gbG9nRW50cnkubmV4dFN0YXRlO1xuXG4gICAgICB2YXIgbmV4dEVudHJ5ID0gbG9nQnVmZmVyW2tleSArIDFdO1xuICAgICAgaWYgKG5leHRFbnRyeSkge1xuICAgICAgICBuZXh0U3RhdGUgPSBuZXh0RW50cnkucHJldlN0YXRlO1xuICAgICAgICB0b29rID0gbmV4dEVudHJ5LnN0YXJ0ZWQgLSBzdGFydGVkO1xuICAgICAgfVxuICAgICAgLy8gbWVzc2FnZVxuICAgICAgdmFyIGZvcm1hdHRlZEFjdGlvbiA9IGFjdGlvblRyYW5zZm9ybWVyKGFjdGlvbik7XG4gICAgICB2YXIgaXNDb2xsYXBzZWQgPSB0eXBlb2YgY29sbGFwc2VkID09PSBcImZ1bmN0aW9uXCIgPyBjb2xsYXBzZWQoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgICAgfSwgYWN0aW9uKSA6IGNvbGxhcHNlZDtcblxuICAgICAgdmFyIGZvcm1hdHRlZFRpbWUgPSBmb3JtYXRUaW1lKHN0YXJ0ZWRUaW1lKTtcbiAgICAgIHZhciB0aXRsZUNTUyA9IGNvbG9ycy50aXRsZSA/IFwiY29sb3I6IFwiICsgY29sb3JzLnRpdGxlKGZvcm1hdHRlZEFjdGlvbikgKyBcIjtcIiA6IG51bGw7XG4gICAgICB2YXIgdGl0bGUgPSBcImFjdGlvbiBcIiArICh0aW1lc3RhbXAgPyBmb3JtYXR0ZWRUaW1lIDogXCJcIikgKyBcIiBcIiArIGZvcm1hdHRlZEFjdGlvbi50eXBlICsgXCIgXCIgKyAoZHVyYXRpb24gPyBcIihpbiBcIiArIHRvb2sudG9GaXhlZCgyKSArIFwiIG1zKVwiIDogXCJcIik7XG5cbiAgICAgIC8vIHJlbmRlclxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGlzQ29sbGFwc2VkKSB7XG4gICAgICAgICAgaWYgKGNvbG9ycy50aXRsZSkgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKFwiJWMgXCIgKyB0aXRsZSwgdGl0bGVDU1MpO2Vsc2UgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKHRpdGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoY29sb3JzLnRpdGxlKSBsb2dnZXIuZ3JvdXAoXCIlYyBcIiArIHRpdGxlLCB0aXRsZUNTUyk7ZWxzZSBsb2dnZXIuZ3JvdXAodGl0bGUpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ2dlci5sb2codGl0bGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29sb3JzLnByZXZTdGF0ZSkgbG9nZ2VyW2xldmVsXShcIiVjIHByZXYgc3RhdGVcIiwgXCJjb2xvcjogXCIgKyBjb2xvcnMucHJldlN0YXRlKHByZXZTdGF0ZSkgKyBcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgcHJldlN0YXRlKTtlbHNlIGxvZ2dlcltsZXZlbF0oXCJwcmV2IHN0YXRlXCIsIHByZXZTdGF0ZSk7XG5cbiAgICAgIGlmIChjb2xvcnMuYWN0aW9uKSBsb2dnZXJbbGV2ZWxdKFwiJWMgYWN0aW9uXCIsIFwiY29sb3I6IFwiICsgY29sb3JzLmFjdGlvbihmb3JtYXR0ZWRBY3Rpb24pICsgXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIGZvcm1hdHRlZEFjdGlvbik7ZWxzZSBsb2dnZXJbbGV2ZWxdKFwiYWN0aW9uXCIsIGZvcm1hdHRlZEFjdGlvbik7XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBpZiAoY29sb3JzLmVycm9yKSBsb2dnZXJbbGV2ZWxdKFwiJWMgZXJyb3JcIiwgXCJjb2xvcjogXCIgKyBjb2xvcnMuZXJyb3IoZXJyb3IsIHByZXZTdGF0ZSkgKyBcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgZXJyb3IpO2Vsc2UgbG9nZ2VyW2xldmVsXShcImVycm9yXCIsIGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbG9ycy5uZXh0U3RhdGUpIGxvZ2dlcltsZXZlbF0oXCIlYyBuZXh0IHN0YXRlXCIsIFwiY29sb3I6IFwiICsgY29sb3JzLm5leHRTdGF0ZShuZXh0U3RhdGUpICsgXCI7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIG5leHRTdGF0ZSk7ZWxzZSBsb2dnZXJbbGV2ZWxdKFwibmV4dCBzdGF0ZVwiLCBuZXh0U3RhdGUpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBsb2dnZXIuZ3JvdXBFbmQoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nZ2VyLmxvZyhcIuKAlOKAlCBsb2cgZW5kIOKAlOKAlFwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsb2dCdWZmZXIubGVuZ3RoID0gMDtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBnZXRTdGF0ZSA9IF9yZWYuZ2V0U3RhdGU7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAvLyBleGl0IGVhcmx5IGlmIHByZWRpY2F0ZSBmdW5jdGlvbiByZXR1cm5zIGZhbHNlXG4gICAgICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSBcImZ1bmN0aW9uXCIgJiYgIXByZWRpY2F0ZShnZXRTdGF0ZSwgYWN0aW9uKSkge1xuICAgICAgICAgIHJldHVybiBuZXh0KGFjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9nRW50cnkgPSB7fTtcbiAgICAgICAgbG9nQnVmZmVyLnB1c2gobG9nRW50cnkpO1xuXG4gICAgICAgIGxvZ0VudHJ5LnN0YXJ0ZWQgPSB0aW1lci5ub3coKTtcbiAgICAgICAgbG9nRW50cnkuc3RhcnRlZFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBsb2dFbnRyeS5wcmV2U3RhdGUgPSBzdGF0ZVRyYW5zZm9ybWVyKGdldFN0YXRlKCkpO1xuICAgICAgICBsb2dFbnRyeS5hY3Rpb24gPSBhY3Rpb247XG5cbiAgICAgICAgdmFyIHJldHVybmVkVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChsb2dFcnJvcnMpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuZWRWYWx1ZSA9IG5leHQoYWN0aW9uKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2dFbnRyeS5lcnJvciA9IGVycm9yVHJhbnNmb3JtZXIoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybmVkVmFsdWUgPSBuZXh0KGFjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsb2dFbnRyeS50b29rID0gdGltZXIubm93KCkgLSBsb2dFbnRyeS5zdGFydGVkO1xuICAgICAgICBsb2dFbnRyeS5uZXh0U3RhdGUgPSBzdGF0ZVRyYW5zZm9ybWVyKGdldFN0YXRlKCkpO1xuXG4gICAgICAgIHByaW50QnVmZmVyKCk7XG5cbiAgICAgICAgaWYgKGxvZ0VudHJ5LmVycm9yKSB0aHJvdyBsb2dFbnRyeS5lcnJvcjtcbiAgICAgICAgcmV0dXJuIHJldHVybmVkVmFsdWU7XG4gICAgICB9O1xuICAgIH07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTG9nZ2VyOyJdfQ==

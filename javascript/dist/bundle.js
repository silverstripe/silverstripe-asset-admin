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

},{"events":18,"jQuery":"jQuery"}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _stateConfigureStore = require('state/configureStore');

var _stateConfigureStore2 = _interopRequireDefault(_stateConfigureStore);

var _stateGalleryActions = require('state/gallery/actions');

var _sectionsAssetAdminController = require('sections/asset-admin/controller');

var _sectionsAssetAdminController2 = _interopRequireDefault(_sectionsAssetAdminController);

var _sectionsGalleryController = require('sections/gallery/controller');

var _sectionsGalleryController2 = _interopRequireDefault(_sectionsGalleryController);

var _sectionsEditorController = require('sections/editor/controller');

var _sectionsEditorController2 = _interopRequireDefault(_sectionsEditorController);

var _constantsIndex = require('constants/index');

var _constantsIndex2 = _interopRequireDefault(_constantsIndex);

function getGalleryProps() {
	var $componentWrapper = (0, _jQuery2['default'])('.asset-gallery').find('.asset-gallery-component-wrapper'),
	    initialFolder = $componentWrapper.data('asset-gallery-initial-folder'),
	    currentFolder = initialFolder;

	return {
		current_folder: currentFolder,
		initial_folder: initialFolder,
		name: (0, _jQuery2['default'])('.asset-gallery').data('asset-gallery-name'),
		route: '/assets/:action?/:id?'
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
					_react2['default'].createElement(_sectionsEditorController2['default'], { route: _constantsIndex2['default'].EDITING_ROUTE })
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

},{"constants/index":6,"jQuery":"jQuery","react":"react","react-dom":"react-dom","react-redux":"react-redux","sections/asset-admin/controller":7,"sections/editor/controller":8,"sections/gallery/controller":9,"state/configureStore":10,"state/gallery/actions":12}],3:[function(require,module,exports){
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

var _stateGalleryActions = require('state/gallery/actions');

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

},{"i18n":"i18n","jQuery":"jQuery","react":"react","react-addons-test-utils":"react-addons-test-utils","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component","state/gallery/actions":12}],4:[function(require,module,exports){
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

var _constantsIndex = require('constants/index');

var _constantsIndex2 = _interopRequireDefault(_constantsIndex);

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
                    { className: 'dropzone-component__upload-button [ ss-ui-button font-icon-upload ]', type: 'button', disabled: this.props.canUpload },
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
            if (!this.props.canUpload) {
                return;
            }

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
    uploadButton: _react2['default'].PropTypes.bool,
    canUpload: _react2['default'].PropTypes.bool.isRequired
};

DropzoneComponent.defaultProps = {
    uploadButton: true
};

exports['default'] = DropzoneComponent;
module.exports = exports['default'];

},{"constants/index":6,"dropzone":19,"i18n":"i18n","jQuery":"jQuery","react":"react","react-dom":"react-dom","silverstripe-component":"silverstripe-component"}],5:[function(require,module,exports){
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

var _constantsIndex = require('constants/index');

var _constantsIndex2 = _interopRequireDefault(_constantsIndex);

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

			return dimensions.height < _constantsIndex2['default'].THUMBNAIL_HEIGHT && dimensions.width < _constantsIndex2['default'].THUMBNAIL_WIDTH;
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

},{"constants/index":6,"i18n":"i18n","jQuery":"jQuery","react":"react","silverstripe-component":"silverstripe-component"}],6:[function(require,module,exports){
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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var _stateGalleryActions = require('state/gallery/actions');

var galleryActions = _interopRequireWildcard(_stateGalleryActions);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _backendFileBackend = require('backend/file-backend');

var _backendFileBackend2 = _interopRequireDefault(_backendFileBackend);

var _constantsIndex = require('constants/index');

var _constantsIndex2 = _interopRequireDefault(_constantsIndex);

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

                var route = new window.ss.router.Route(_constantsIndex2['default'].EDITING_ROUTE);
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
            this.props.actions.setFolderPermissions(data.folderPermissions);
        }
    }, {
        key: 'handleBackendSave',
        value: function handleBackendSave(id, values) {
            window.ss.router.show(_constantsIndex2['default'].HOME_ROUTE);
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

},{"backend/file-backend":1,"constants/index":6,"jQuery":"jQuery","react":"react","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component","state/gallery/actions":12}],8:[function(require,module,exports){
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

var _stateGalleryActions = require('state/gallery/actions');

var galleryActions = _interopRequireWildcard(_stateGalleryActions);

var _componentsTextFieldIndex = require('components/text-field/index');

var _componentsTextFieldIndex2 = _interopRequireDefault(_componentsTextFieldIndex);

var _constantsIndex = require('constants/index');

var _constantsIndex2 = _interopRequireDefault(_constantsIndex);

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
		key: 'onCancel',
		value: function onCancel(event) {
			window.ss.router.show(_constantsIndex2['default'].HOME_ROUTE);
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

},{"components/text-field/index":"components/text-field/index","constants/index":6,"i18n":"i18n","jQuery":"jQuery","react":"react","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component","state/gallery/actions":12}],9:[function(require,module,exports){
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

var _componentsDropzoneIndex = require('components/dropzone/index');

var _componentsDropzoneIndex2 = _interopRequireDefault(_componentsDropzoneIndex);

var _componentsFileIndex = require('components/file/index');

var _componentsFileIndex2 = _interopRequireDefault(_componentsFileIndex);

var _componentsBulkActionsIndex = require('components/bulk-actions/index');

var _componentsBulkActionsIndex2 = _interopRequireDefault(_componentsBulkActionsIndex);

var _silverstripeComponent = require('silverstripe-component');

var _silverstripeComponent2 = _interopRequireDefault(_silverstripeComponent);

var _constantsIndex = require('constants/index');

var _constantsIndex2 = _interopRequireDefault(_constantsIndex);

var _stateGalleryActions = require('state/gallery/actions');

var galleryActions = _interopRequireWildcard(_stateGalleryActions);

var _stateQueuedFilesActions = require('state/queued-files/actions');

var queuedFilesActions = _interopRequireWildcard(_stateQueuedFilesActions);

var _componentsFormActionIndex = require('components/form-action/index');

var _componentsFormActionIndex2 = _interopRequireDefault(_componentsFormActionIndex);

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

			var canEdit = this.props.gallery.folderPermissions.canEdit;

			// TODO Make "add folder" and "upload" buttons conditional on permissions
			return _react2['default'].createElement(
				'div',
				null,
				this.getBackButton(),
				_react2['default'].createElement(
					_reactAddonsCssTransitionGroup2['default'],
					{ transitionName: 'gallery__bulk-actions', transitionEnterTimeout: _constantsIndex2['default'].CSS_TRANSITION_TIME, transitionLeaveTimeout: _constantsIndex2['default'].CSS_TRANSITION_TIME },
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
				_react2['default'].createElement(_componentsFormActionIndex2['default'], {
					id: 'add-folder-button',
					label: _i18n2['default']._t("AssetGalleryField.ADD_FOLDER_BUTTON"),
					icon: 'folder-add',
					extraClass: 'gallery__upload',
					disabled: !canEdit }),
				_react2['default'].createElement(_componentsFormActionIndex2['default'], {
					id: 'upload-button',
					label: _i18n2['default']._t("AssetGalleryField.DROPZONE_UPLOAD"),
					icon: 'upload',
					extraClass: 'gallery__upload',
					disabled: !canEdit }),
				_react2['default'].createElement(
					_componentsDropzoneIndex2['default'],
					{
						canUpload: canEdit,
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
			var folderPath = _constantsIndex2['default'].FOLDER_ROUTE.replace(':id?', folderID);

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
			window.ss.router.show(_constantsIndex2['default'].FOLDER_ROUTE.replace(':id?', folder.id));
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
			window.ss.router.show(_constantsIndex2['default'].EDITING_ROUTE.replace(':id', file.id));
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
			window.ss.router.show(_constantsIndex2['default'].FOLDER_ROUTE.replace(':id?', this.props.gallery.parentFolderID));
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

},{"components/bulk-actions/index":3,"components/dropzone/index":4,"components/file/index":5,"components/form-action/index":"components/form-action/index","constants/index":6,"i18n":"i18n","jQuery":"jQuery","react":"react","react-addons-css-transition-group":"react-addons-css-transition-group","react-addons-test-utils":"react-addons-test-utils","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","silverstripe-component":"silverstripe-component","state/gallery/actions":12,"state/queued-files/actions":15}],10:[function(require,module,exports){
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

},{"./reducer":17,"redux":"redux","redux-logger":20,"redux-thunk":"redux-thunk"}],11:[function(require,module,exports){
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
    SET_FOLDER_PERMISSIONS: 'SET_FOLDER_PERMISSIONS',
    SET_PARENT_FOLDER_ID: 'SET_PARENT_FOLDER_ID',
    SET_PATH: 'SET_PATH',
    SET_VIEWING_FOLDER: 'SET_VIEWING_FOLDER',
    SORT_FILES: 'SORT_FILES',
    UPDATE_EDITOR_FIELD: 'UPDATE_EDITOR_FIELD',
    UPDATE_FILE: 'UPDATE_FILE'
};
exports.GALLERY = GALLERY;

},{}],12:[function(require,module,exports){
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
exports.setFolderPermissions = setFolderPermissions;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _actionTypes = require('./action-types');

var _constantsIndex = require('constants/index');

var _constantsIndex2 = _interopRequireDefault(_constantsIndex);

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

/**
 * Sets the permissions for the folder
 *
 * @param object folderPermissions Contains the canEdit, canDelete permissions as self-named keys
 */

function setFolderPermissions(folderPermissions) {
    return function (dispatch, getState) {
        return dispatch({
            type: _actionTypes.GALLERY.SET_FOLDER_PERMISSIONS,
            payload: folderPermissions
        });
    };
}

},{"./action-types":11,"constants/index":6}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = galleryReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _actionTypes = require('./action-types');

var _constantsIndex = require('constants/index');

var _constantsIndex2 = _interopRequireDefault(_constantsIndex);

var initialState = {
    bulkActions: {
        placeholder: _constantsIndex2['default'].BULK_ACTIONS_PLACEHOLDER,
        options: _constantsIndex2['default'].BULK_ACTIONS
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
    viewingFolder: false,
    folderPermissions: {
        canEdit: false,
        canDelete: false
    }
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

        case _actionTypes.GALLERY.SET_FOLDER_PERMISSIONS:
            return (0, _deepFreeze2['default'])(Object.assign({}, state, {
                folderPermissions: {
                    canEdit: action.payload.canEdit,
                    canDelete: action.payload.canDelete
                }
            }));

        default:
            return state;
    }
}

module.exports = exports['default'];

},{"./action-types":11,"constants/index":6,"deep-freeze":"deep-freeze"}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"./action-types":14}],16:[function(require,module,exports){
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

},{"./action-types":14,"deep-freeze":"deep-freeze","i18n":"i18n"}],17:[function(require,module,exports){
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

},{"./gallery/reducer":13,"./queued-files/reducer":16,"redux":"redux"}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){

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

},{}],20:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGt1bmcvU2l0ZXMvc3M0L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL2JhY2tlbmQvZmlsZS1iYWNrZW5kLmpzIiwiL1VzZXJzL3RrdW5nL1NpdGVzL3NzNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9ib290L2luZGV4LmpzIiwiL1VzZXJzL3RrdW5nL1NpdGVzL3NzNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb21wb25lbnRzL2J1bGstYWN0aW9ucy9pbmRleC5qcyIsIi9Vc2Vycy90a3VuZy9TaXRlcy9zczQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvY29tcG9uZW50cy9kcm9wem9uZS9pbmRleC5qcyIsIi9Vc2Vycy90a3VuZy9TaXRlcy9zczQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvY29tcG9uZW50cy9maWxlL2luZGV4LmpzIiwiL1VzZXJzL3RrdW5nL1NpdGVzL3NzNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9jb25zdGFudHMvaW5kZXguanMiLCIvVXNlcnMvdGt1bmcvU2l0ZXMvc3M0L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3NlY3Rpb25zL2Fzc2V0LWFkbWluL2NvbnRyb2xsZXIuanMiLCIvVXNlcnMvdGt1bmcvU2l0ZXMvc3M0L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3NlY3Rpb25zL2VkaXRvci9jb250cm9sbGVyLmpzIiwiL1VzZXJzL3RrdW5nL1NpdGVzL3NzNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zZWN0aW9ucy9nYWxsZXJ5L2NvbnRyb2xsZXIuanMiLCIvVXNlcnMvdGt1bmcvU2l0ZXMvc3M0L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiL1VzZXJzL3RrdW5nL1NpdGVzL3NzNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9nYWxsZXJ5L2FjdGlvbi10eXBlcy5qcyIsIi9Vc2Vycy90a3VuZy9TaXRlcy9zczQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvZ2FsbGVyeS9hY3Rpb25zLmpzIiwiL1VzZXJzL3RrdW5nL1NpdGVzL3NzNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9nYWxsZXJ5L3JlZHVjZXIuanMiLCIvVXNlcnMvdGt1bmcvU2l0ZXMvc3M0L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL3F1ZXVlZC1maWxlcy9hY3Rpb24tdHlwZXMuanMiLCIvVXNlcnMvdGt1bmcvU2l0ZXMvc3M0L2Fzc2V0LWFkbWluL2phdmFzY3JpcHQvc3JjL3N0YXRlL3F1ZXVlZC1maWxlcy9hY3Rpb25zLmpzIiwiL1VzZXJzL3RrdW5nL1NpdGVzL3NzNC9hc3NldC1hZG1pbi9qYXZhc2NyaXB0L3NyYy9zdGF0ZS9xdWV1ZWQtZmlsZXMvcmVkdWNlci5qcyIsIi9Vc2Vycy90a3VuZy9TaXRlcy9zczQvYXNzZXQtYWRtaW4vamF2YXNjcmlwdC9zcmMvc3RhdGUvcmVkdWNlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2Ryb3B6b25lL2Rpc3QvZHJvcHpvbmUuanMiLCJub2RlX21vZHVsZXMvcmVkdXgtbG9nZ2VyL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JDQWMsUUFBUTs7OztzQkFDSCxRQUFROzs7O0lBRU4sV0FBVztXQUFYLFdBQVc7O0FBRXBCLFVBRlMsV0FBVyxDQUVuQixzQkFBc0IsRUFBRSx1QkFBdUIsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUU7d0JBRnpILFdBQVc7O0FBRzlCLDZCQUht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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3Z1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBFdmVudHMgZnJvbSAnZXZlbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZUJhY2tlbmQgZXh0ZW5kcyBFdmVudHMge1xuXG5cdGNvbnN0cnVjdG9yKGdldEZpbGVzQnlQYXJlbnRJRF91cmwsIGdldEZpbGVzQnlTaWJsaW5nSURfdXJsLCBzZWFyY2hfdXJsLCB1cGRhdGVfdXJsLCBkZWxldGVfdXJsLCBsaW1pdCwgYnVsa0FjdGlvbnMsICRmb2xkZXIsIGN1cnJlbnRGb2xkZXIpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5nZXRGaWxlc0J5UGFyZW50SURfdXJsID0gZ2V0RmlsZXNCeVBhcmVudElEX3VybDtcblx0XHR0aGlzLmdldEZpbGVzQnlTaWJsaW5nSURfdXJsID0gZ2V0RmlsZXNCeVNpYmxpbmdJRF91cmw7XG5cdFx0dGhpcy5zZWFyY2hfdXJsID0gc2VhcmNoX3VybDtcblx0XHR0aGlzLnVwZGF0ZV91cmwgPSB1cGRhdGVfdXJsO1xuXHRcdHRoaXMuZGVsZXRlX3VybCA9IGRlbGV0ZV91cmw7XG5cdFx0dGhpcy5saW1pdCA9IGxpbWl0O1xuXHRcdHRoaXMuYnVsa0FjdGlvbnMgPSBidWxrQWN0aW9ucztcblx0XHR0aGlzLiRmb2xkZXIgPSAkZm9sZGVyO1xuXHRcdHRoaXMuZm9sZGVyID0gY3VycmVudEZvbGRlcjtcblxuXHRcdHRoaXMucGFnZSA9IDE7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZmV0Y2hcblx0ICogQHBhcmFtIG51bWJlciBpZFxuXHQgKiBAZGVzYyBGZXRjaGVzIGEgY29sbGVjdGlvbiBvZiBGaWxlcyBieSBQYXJlbnRJRC5cblx0ICovXG5cdGdldEZpbGVzQnlQYXJlbnRJRChpZCkge1xuXHRcdGlmICh0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5wYWdlID0gMTtcblxuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QoJ1BPU1QnLCB0aGlzLmdldEZpbGVzQnlQYXJlbnRJRF91cmwsIHsgaWQ6IGlkLCBsaW1pdDogdGhpcy5saW1pdCB9KS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uRmV0Y2hEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQGZ1bmMgZ2V0RmlsZXNCeVNpYmxpbmdJRFxuXHQgKiBAcGFyYW0gbnVtYmVyIGlkIC0gdGhlIGlkIG9mIHRoZSBmaWxlIHRvIGdldCB0aGUgc2libGluZ3MgZnJvbS5cblx0ICogQGRlc2MgRmV0Y2hlcyBhIGNvbGxlY3Rpb24gb2Ygc2libGluZyBmaWxlcyBnaXZlbiBhbiBpZC5cblx0ICovXG5cdGdldEZpbGVzQnlTaWJsaW5nSUQoaWQpIHtcblx0XHRpZiAodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHR0aGlzLnBhZ2UgPSAxO1xuXG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdCgnUE9TVCcsIHRoaXMuZ2V0RmlsZXNCeVNpYmxpbmdJRF91cmwsIHsgaWQ6IGlkLCBsaW1pdDogdGhpcy5saW1pdCB9KS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uRmV0Y2hEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRzZWFyY2goKSB7XG5cdFx0dGhpcy5wYWdlID0gMTtcblxuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QoJ0dFVCcsIHRoaXMuc2VhcmNoX3VybCkudGhlbigoanNvbikgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdvblNlYXJjaERhdGEnLCBqc29uKTtcblx0XHR9KTtcblx0fVxuXG5cdG1vcmUoKSB7XG5cdFx0dGhpcy5wYWdlKys7XG5cblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KCdHRVQnLCB0aGlzLnNlYXJjaF91cmwpLnRoZW4oKGpzb24pID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25Nb3JlRGF0YScsIGpzb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0bmF2aWdhdGUoZm9sZGVyKSB7XG5cdFx0dGhpcy5wYWdlID0gMTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblxuXHRcdHRoaXMucGVyc2lzdEZvbGRlckZpbHRlcihmb2xkZXIpO1xuXG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdCgnR0VUJywgdGhpcy5zZWFyY2hfdXJsKS50aGVuKChqc29uKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ29uTmF2aWdhdGVEYXRhJywganNvbik7XG5cdFx0fSk7XG5cdH1cblxuXHRwZXJzaXN0Rm9sZGVyRmlsdGVyKGZvbGRlcikge1xuXHRcdGlmIChmb2xkZXIuc3Vic3RyKC0xKSA9PT0gJy8nKSB7XG5cdFx0XHRmb2xkZXIgPSBmb2xkZXIuc3Vic3RyKDAsIGZvbGRlci5sZW5ndGggLSAxKTtcblx0XHR9XG5cblx0XHR0aGlzLiRmb2xkZXIudmFsKGZvbGRlcik7XG5cdH1cblxuXHQvKipcblx0ICogRGVsZXRlcyBmaWxlcyBvbiB0aGUgc2VydmVyIGJhc2VkIG9uIHRoZSBnaXZlbiBpZHNcblx0ICpcblx0ICogQHBhcmFtIGFycmF5IGlkcyAtIGFuIGFycmF5IG9mIGZpbGUgaWRzIHRvIGRlbGV0ZSBvbiB0aGUgc2VydmVyXG5cdCAqIEByZXR1cm5zIG9iamVjdCAtIHByb21pc2Vcblx0ICovXG5cdGRlbGV0ZShpZHMpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KCdERUxFVEUnLCB0aGlzLmRlbGV0ZV91cmwsIHtcblx0XHRcdCdpZHMnOiBpZHNcblx0XHR9KS50aGVuKCgpID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25EZWxldGVEYXRhJywgaWRzKTtcblx0XHR9KTtcblx0fVxuXG5cdGZpbHRlcihuYW1lLCB0eXBlLCBmb2xkZXIsIGNyZWF0ZWRGcm9tLCBjcmVhdGVkVG8sIG9ubHlTZWFyY2hJbkZvbGRlcikge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHR0aGlzLmZvbGRlciA9IGZvbGRlcjtcblx0XHR0aGlzLmNyZWF0ZWRGcm9tID0gY3JlYXRlZEZyb207XG5cdFx0dGhpcy5jcmVhdGVkVG8gPSBjcmVhdGVkVG87XG5cdFx0dGhpcy5vbmx5U2VhcmNoSW5Gb2xkZXIgPSBvbmx5U2VhcmNoSW5Gb2xkZXI7XG5cblx0XHR0aGlzLnNlYXJjaCgpO1xuXHR9XG5cblx0c2F2ZShpZCwgdmFsdWVzKSB7XG5cdFx0dmFyIHVwZGF0ZXMgPSB7IGlkIH07XG5cblx0XHR2YWx1ZXMuZm9yRWFjaChmaWVsZCA9PiB7XG5cdFx0XHR1cGRhdGVzW2ZpZWxkLm5hbWVdID0gZmllbGQudmFsdWU7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KCdQT1NUJywgdGhpcy51cGRhdGVfdXJsLCB1cGRhdGVzKS50aGVuKCgpID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnb25TYXZlRGF0YScsIGlkLCB1cGRhdGVzKTtcblx0XHR9KTtcblx0fVxuXG5cdHJlcXVlc3QobWV0aG9kLCB1cmwsIGRhdGEgPSB7fSkge1xuXHRcdGxldCBkZWZhdWx0cyA9IHtcblx0XHRcdCdsaW1pdCc6IHRoaXMubGltaXQsXG5cdFx0XHQncGFnZSc6IHRoaXMucGFnZSxcblx0XHR9O1xuXG5cdFx0aWYgKHRoaXMubmFtZSAmJiB0aGlzLm5hbWUudHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMubmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm5hbWUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNyZWF0ZWRGcm9tICYmIHRoaXMuY3JlYXRlZEZyb20udHJpbSgpICE9PSAnJykge1xuXHRcdFx0ZGVmYXVsdHMuY3JlYXRlZEZyb20gPSBkZWNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVkRnJvbSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY3JlYXRlZFRvICYmIHRoaXMuY3JlYXRlZFRvLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLmNyZWF0ZWRUbyA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLmNyZWF0ZWRUbyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMub25seVNlYXJjaEluRm9sZGVyICYmIHRoaXMub25seVNlYXJjaEluRm9sZGVyLnRyaW0oKSAhPT0gJycpIHtcblx0XHRcdGRlZmF1bHRzLm9ubHlTZWFyY2hJbkZvbGRlciA9IGRlY29kZVVSSUNvbXBvbmVudCh0aGlzLm9ubHlTZWFyY2hJbkZvbGRlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5zaG93TG9hZGluZ0luZGljYXRvcigpO1xuXG5cdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHQndXJsJzogdXJsLFxuXHRcdFx0J3R5cGUnOiBtZXRob2QsIC8vIGNvbXBhdCB3aXRoIGpRdWVyeSAxLjdcblx0XHRcdCdkYXRhVHlwZSc6ICdqc29uJyxcblx0XHRcdCdkYXRhJzogJC5leHRlbmQoZGVmYXVsdHMsIGRhdGEpXG5cdFx0fSkuYWx3YXlzKCgpID0+IHtcblx0XHRcdHRoaXMuaGlkZUxvYWRpbmdJbmRpY2F0b3IoKTtcblx0XHR9KTtcblx0fVxuXG5cdHNob3dMb2FkaW5nSW5kaWNhdG9yKCkge1xuXHRcdCQoJy5jbXMtY29udGVudCwgLnVpLWRpYWxvZycpLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cdFx0JCgnLnVpLWRpYWxvZy1jb250ZW50JykuY3NzKCdvcGFjaXR5JywgJy4xJyk7XG5cdH1cblxuXHRoaWRlTG9hZGluZ0luZGljYXRvcigpIHtcblx0XHQkKCcuY21zLWNvbnRlbnQsIC51aS1kaWFsb2cnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXHRcdCQoJy51aS1kaWFsb2ctY29udGVudCcpLmNzcygnb3BhY2l0eScsICcxJyk7XG5cdH1cbn1cbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBjb25maWd1cmVTdG9yZSBmcm9tICdzdGF0ZS9jb25maWd1cmVTdG9yZSc7XG5pbXBvcnQgeyBzZXRSb3V0ZSB9IGZyb20gJ3N0YXRlL2dhbGxlcnkvYWN0aW9ucyc7XG5pbXBvcnQgQXNzZXRBZG1pbkNvbnRhaW5lciBmcm9tICdzZWN0aW9ucy9hc3NldC1hZG1pbi9jb250cm9sbGVyJztcbmltcG9ydCB7IGRlZmF1bHQgYXMgR2FsbGVyeUNvbnRhaW5lciB9IGZyb20gJ3NlY3Rpb25zL2dhbGxlcnkvY29udHJvbGxlcic7XG5pbXBvcnQgRWRpdG9yQ29udGFpbmVyIGZyb20gJ3NlY3Rpb25zL2VkaXRvci9jb250cm9sbGVyJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnY29uc3RhbnRzL2luZGV4JztcblxuZnVuY3Rpb24gZ2V0R2FsbGVyeVByb3BzKCkge1xuXHR2YXIgJGNvbXBvbmVudFdyYXBwZXIgPSAkKCcuYXNzZXQtZ2FsbGVyeScpLmZpbmQoJy5hc3NldC1nYWxsZXJ5LWNvbXBvbmVudC13cmFwcGVyJyksXG5cdFx0aW5pdGlhbEZvbGRlciA9ICRjb21wb25lbnRXcmFwcGVyLmRhdGEoJ2Fzc2V0LWdhbGxlcnktaW5pdGlhbC1mb2xkZXInKSxcblx0XHRjdXJyZW50Rm9sZGVyID0gaW5pdGlhbEZvbGRlcjtcblxuXHRyZXR1cm4ge1xuXHRcdGN1cnJlbnRfZm9sZGVyOiBjdXJyZW50Rm9sZGVyLFxuXHRcdGluaXRpYWxfZm9sZGVyOiBpbml0aWFsRm9sZGVyLFxuXHRcdG5hbWU6ICQoJy5hc3NldC1nYWxsZXJ5JykuZGF0YSgnYXNzZXQtZ2FsbGVyeS1uYW1lJyksXG5cdFx0cm91dGU6ICcvYXNzZXRzLzphY3Rpb24/LzppZD8nXG5cdH07XG59XG5cbiQuZW50d2luZSgnc3MnLCBmdW5jdGlvbigkKSB7XG5cdCQoJy5hc3NldC1nYWxsZXJ5LWNvbXBvbmVudC13cmFwcGVyJykuZW50d2luZSh7XG5cdFx0b25hZGQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnN0IHN0b3JlID0gY29uZmlndXJlU3RvcmUoKTtcblx0XHRcdGNvbnN0IGdhbGxlcnlQcm9wcyA9IGdldEdhbGxlcnlQcm9wcygpO1xuXG5cdFx0XHRSZWFjdERPTS5yZW5kZXIoXG5cdFx0XHRcdDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxuXHRcdFx0XHRcdDxBc3NldEFkbWluQ29udGFpbmVyIGluaXRpYWxGb2xkZXI9e3RoaXMuZGF0YSgnYXNzZXQtZ2FsbGVyeS1pbml0aWFsLWZvbGRlcicpfSBpZEZyb21VUkw9e3RoaXMuZGF0YSgnYXNzZXQtZ2FsbGVyeS1pZC1mcm9tLXVybCcpfSA+XG5cdFx0XHRcdFx0XHQ8R2FsbGVyeUNvbnRhaW5lciB7Li4uZ2FsbGVyeVByb3BzfSAvPlxuXHRcdFx0XHRcdFx0PEVkaXRvckNvbnRhaW5lciByb3V0ZT17Q09OU1RBTlRTLkVESVRJTkdfUk9VVEV9IC8+XG5cdFx0XHRcdFx0PC9Bc3NldEFkbWluQ29udGFpbmVyPlxuXHRcdFx0XHQ8L1Byb3ZpZGVyPixcblx0XHRcdFx0dGhpc1swXVxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gQ2F0Y2ggYW55IHJvdXRlcyB0aGF0IGFyZW4ndCBoYW5kbGVkIGJ5IGNvbXBvbmVudHMuXG5cdFx0XHR3aW5kb3cuc3Mucm91dGVyKCcqJywgKCkgPT4ge30pO1xuXHRcdH0sXG5cdFx0b25yZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpc1swXSk7XG5cdFx0fVxuXHR9KTtcbn0pO1xuIiwiaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgUmVhY3RUZXN0VXRpbHMgZnJvbSAncmVhY3QtYWRkb25zLXRlc3QtdXRpbHMnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCAqIGFzIGdhbGxlcnlBY3Rpb25zIGZyb20gJ3N0YXRlL2dhbGxlcnkvYWN0aW9ucyc7XG5pbXBvcnQgaTE4biBmcm9tICdpMThuJztcblxuZXhwb3J0IGNsYXNzIEJ1bGtBY3Rpb25zQ29tcG9uZW50IGV4dGVuZHMgU2lsdmVyU3RyaXBlQ29tcG9uZW50IHtcblxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMub25DaGFuZ2VWYWx1ZSA9IHRoaXMub25DaGFuZ2VWYWx1ZS5iaW5kKHRoaXMpO1xuXHR9XG5cblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0dmFyICRzZWxlY3QgPSAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKCcuZHJvcGRvd24nKTtcblxuXHRcdCRzZWxlY3QuY2hvc2VuKHtcblx0XHRcdCdhbGxvd19zaW5nbGVfZGVzZWxlY3QnOiB0cnVlLFxuXHRcdFx0J2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCc6IDIwXG5cdFx0fSk7XG5cblx0XHQvLyBDaG9zZW4gc3RvcHMgdGhlIGNoYW5nZSBldmVudCBmcm9tIHJlYWNoaW5nIFJlYWN0IHNvIHdlIGhhdmUgdG8gc2ltdWxhdGUgYSBjbGljay5cblx0XHQkc2VsZWN0LmNoYW5nZSgoKSA9PiBSZWFjdFRlc3RVdGlscy5TaW11bGF0ZS5jbGljaygkc2VsZWN0LmZpbmQoJzpzZWxlY3RlZCcpWzBdKSk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZ2FsbGVyeV9fYnVsay1hY3Rpb25zIGZpZWxkaG9sZGVyLXNtYWxsXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX2J1bGstYWN0aW9uc19fY291bnRlclwiPnt0aGlzLmdldFNlbGVjdGVkRmlsZXMoKS5sZW5ndGh9PC9kaXY+XG5cdFx0XHR7dGhpcy5wcm9wcy5nYWxsZXJ5LmJ1bGtBY3Rpb25zLm9wdGlvbnMubWFwKChvcHRpb24sIGkpID0+IHtcblx0XHRcdFx0cmV0dXJuIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9XCJnYWxsZXJ5X19idWxrLWFjdGlvbnNfYWN0aW9uIGZvbnQtaWNvbi10cmFzaCBzcy11aS1idXR0b24gdWktY29ybmVyLWFsbFwiIGtleT17aX0gb25DbGljaz17dGhpcy5vbkNoYW5nZVZhbHVlfSB2YWx1ZT17b3B0aW9uLnZhbHVlfT57b3B0aW9uLmxhYmVsfTwvYnV0dG9uPjtcblx0XHRcdH0pfVxuXHRcdDwvZGl2Pjtcblx0fVxuXG5cdGdldE9wdGlvbkJ5VmFsdWUodmFsdWUpIHtcblx0XHQvLyBVc2luZyBmb3IgbG9vcCBiZWNhdXNlIElFMTAgZG9lc24ndCBoYW5kbGUgJ2ZvciBvZicsXG5cdFx0Ly8gd2hpY2ggZ2V0cyB0cmFuc2NvbXBpbGVkIGludG8gYSBmdW5jdGlvbiB3aGljaCB1c2VzIFN5bWJvbCxcblx0XHQvLyB0aGUgdGhpbmcgSUUxMCBkaWVzIG9uLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5nYWxsZXJ5LmJ1bGtBY3Rpb25zLm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGlmICh0aGlzLnByb3BzLmdhbGxlcnkuYnVsa0FjdGlvbnMub3B0aW9uc1tpXS52YWx1ZSA9PT0gdmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucHJvcHMuZ2FsbGVyeS5idWxrQWN0aW9ucy5vcHRpb25zW2ldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cbiAgICBnZXRTZWxlY3RlZEZpbGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5nYWxsZXJ5LnNlbGVjdGVkRmlsZXM7XG4gICAgfVxuXG5cdGFwcGx5QWN0aW9uKHZhbHVlKSB7XG5cdFx0Ly8gV2Ugb25seSBoYXZlICdkZWxldGUnIHJpZ2h0IG5vdy4uLlxuXHRcdHN3aXRjaCAodmFsdWUpIHtcblx0XHRcdGNhc2UgJ2RlbGV0ZSc6XG5cdFx0XHRcdHRoaXMucHJvcHMuYmFja2VuZC5kZWxldGUodGhpcy5nZXRTZWxlY3RlZEZpbGVzKCkpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdG9uQ2hhbmdlVmFsdWUoZXZlbnQpIHtcblx0XHR2YXIgb3B0aW9uID0gdGhpcy5nZXRPcHRpb25CeVZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG5cblx0XHQvLyBNYWtlIHN1cmUgYSB2YWxpZCBvcHRpb24gaGFzIGJlZW4gc2VsZWN0ZWQuXG5cdFx0aWYgKG9wdGlvbiA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb24uZGVzdHJ1Y3RpdmUgPT09IHRydWUpIHtcblx0XHRcdGlmIChjb25maXJtKGkxOG4uc3ByaW50ZihpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5CVUxLX0FDVElPTlNfQ09ORklSTScpLCBvcHRpb24ubGFiZWwpKSkge1xuXHRcdFx0XHR0aGlzLmFwcGx5QWN0aW9uKG9wdGlvbi52YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYXBwbHlBY3Rpb24ob3B0aW9uLnZhbHVlKTtcblx0XHR9XG5cblx0XHQvLyBSZXNldCB0aGUgZHJvcGRvd24gdG8gaXQncyBwbGFjZWhvbGRlciB2YWx1ZS5cblx0XHQkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKCcuZHJvcGRvd24nKS52YWwoJycpLnRyaWdnZXIoJ2xpc3p0OnVwZGF0ZWQnKTtcblx0fVxufTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdHJldHVybiB7XG5cdFx0Z2FsbGVyeTogc3RhdGUuYXNzZXRBZG1pbi5nYWxsZXJ5XG5cdH1cbn1cblxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XG5cdHJldHVybiB7XG5cdFx0YWN0aW9uczogYmluZEFjdGlvbkNyZWF0b3JzKGdhbGxlcnlBY3Rpb25zLCBkaXNwYXRjaClcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShCdWxrQWN0aW9uc0NvbXBvbmVudCk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgU2lsdmVyU3RyaXBlQ29tcG9uZW50IGZyb20gJ3NpbHZlcnN0cmlwZS1jb21wb25lbnQnO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgRHJvcHpvbmUgZnJvbSAnZHJvcHpvbmUnO1xuaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnY29uc3RhbnRzL2luZGV4JztcblxuY2xhc3MgRHJvcHpvbmVDb21wb25lbnQgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHRoaXMuZHJvcHpvbmUgPSBudWxsO1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHN1cGVyLmNvbXBvbmVudERpZE1vdW50KCk7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0gdGhpcy5nZXREZWZhdWx0T3B0aW9ucygpO1xuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnVwbG9hZEJ1dHRvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnMuY2xpY2thYmxlID0gJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmRyb3B6b25lLWNvbXBvbmVudF9fdXBsb2FkLWJ1dHRvbicpWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcm9wem9uZSA9IG5ldyBEcm9wem9uZShSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSwgT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIHRoaXMucHJvcHMub3B0aW9ucykpO1xuXG4gICAgICAgIC8vIFNldCB0aGUgdXNlciB3YXJuaW5nIGRpc3BsYXllZCB3aGVuIGEgdXNlciBhdHRlbXB0cyB0byByZW1vdmUgYSBmaWxlLlxuICAgICAgICAvLyBJZiB0aGUgcHJvcHMgaGFzbid0IGJlZW4gcGFzc2VkIHRoZXJlIHdpbGwgYmUgbm8gd2FybmluZyB3aGVuIHJlbW92aW5nIGZpbGVzLlxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMucHJvbXB0T25SZW1vdmUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnNldFByb21wdE9uUmVtb3ZlKHRoaXMucHJvcHMucHJvbXB0T25SZW1vdmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBkcm9wem9uZSBldmVudCBsaXN0ZW5lcnMuXG4gICAgICAgIHRoaXMuZHJvcHpvbmUuZGlzYWJsZSgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IFsnZHJvcHpvbmUtY29tcG9uZW50J107XG5cbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZS5wdXNoKCdkcmFnZ2luZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWUuam9pbignICcpfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy51cGxvYWRCdXR0b24gJiZcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2Ryb3B6b25lLWNvbXBvbmVudF9fdXBsb2FkLWJ1dHRvbiBbIHNzLXVpLWJ1dHRvbiBmb250LWljb24tdXBsb2FkIF0nIHR5cGU9J2J1dHRvbicgZGlzYWJsZWQ9e3RoaXMucHJvcHMuY2FuVXBsb2FkfT57aTE4bi5fdChcIkFzc2V0R2FsbGVyeUZpZWxkLkRST1BaT05FX1VQTE9BRFwiKX08L2J1dHRvbj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBkZWZhdWx0IG9wdGlpb25zIHRvIGluc3RhbmNpYXRlIGRyb3B6b25lIHdpdGguXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIG9iamVjdFxuICAgICAqL1xuICAgIGdldERlZmF1bHRPcHRpb25zKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLy8gV2UgaGFuZGxlIHRoZSBxdWV1ZSBwcm9jZXNzaW5nIG91cnNlbGYgaW4gdGhlIEZpbGVSZWFkZXIgY2FsbGJhY2suIFNlZSBgdGhpcy5oYW5kbGVBZGRlZEZpbGVgXG4gICAgICAgICAgICBhdXRvUHJvY2Vzc1F1ZXVlOiBmYWxzZSxcblxuICAgICAgICAgICAgLy8gQnkgZGVmYXVsdCBEcm9wem9uZSBhZGRzIG1hcmt1cCB0byB0aGUgRE9NIGZvciBkaXNwbGF5aW5nIGEgdGh1bWJuYWlsIHByZXZpZXcuXG4gICAgICAgICAgICAvLyBIZXJlIHdlJ3JlIHJlbHBhY2luZyB0aGF0IGRlZmF1bHQgYmVoYXZpb3VyIHdpdGggb3VyIG93biBSZWFjdCAvIFJlZHV4IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgICAgYWRkZWRmaWxlOiB0aGlzLmhhbmRsZUFkZGVkRmlsZS5iaW5kKHRoaXMpLFxuXG4gICAgICAgICAgICAvLyBXaGVuIHRoZSB1c2VyIGRyYWdzIGEgZmlsZSBpbnRvIHRoZSBkcm9wem9uZS5cbiAgICAgICAgICAgIGRyYWdlbnRlcjogdGhpcy5oYW5kbGVEcmFnRW50ZXIuYmluZCh0aGlzKSxcblxuICAgICAgICAgICAgLy8gV2hlbiB0aGUgdXNlcidzIGN1cnNvciBsZWF2ZXMgdGhlIGRyb3B6b25lIHdoaWxlIGRyYWdnaW5nIGEgZmlsZS5cbiAgICAgICAgICAgIGRyYWdsZWF2ZTogdGhpcy5oYW5kbGVEcmFnTGVhdmUuYmluZCh0aGlzKSxcblxuICAgICAgICAgICAgLy8gV2hlbiB0aGUgdXNlciBkcm9wcyBhIGZpbGUgb250byB0aGUgZHJvcHpvbmUuXG4gICAgICAgICAgICBkcm9wOiB0aGlzLmhhbmRsZURyb3AuYmluZCh0aGlzKSxcblxuICAgICAgICAgICAgLy8gV2hlbmV2ZXIgdGhlIGZpbGUgdXBsb2FkIHByb2dyZXNzIGNoYW5nZXNcbiAgICAgICAgICAgIHVwbG9hZHByb2dyZXNzOiB0aGlzLmhhbmRsZVVwbG9hZFByb2dyZXNzLmJpbmQodGhpcyksXG5cbiAgICAgICAgICAgIC8vIFRoZSB0ZXh0IHVzZWQgYmVmb3JlIGFueSBmaWxlcyBhcmUgZHJvcHBlZFxuICAgICAgICAgICAgZGljdERlZmF1bHRNZXNzYWdlOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5EUk9QWk9ORV9ERUZBVUxUX01FU1NBR0UnKSxcblxuICAgICAgICAgICAgLy8gVGhlIHRleHQgdGhhdCByZXBsYWNlcyB0aGUgZGVmYXVsdCBtZXNzYWdlIHRleHQgaXQgdGhlIGJyb3dzZXIgaXMgbm90IHN1cHBvcnRlZFxuICAgICAgICAgICAgZGljdEZhbGxiYWNrTWVzc2FnZTogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfRkFMTEJBQ0tfTUVTU0FHRScpLFxuXG4gICAgICAgICAgICAvLyBUaGUgdGV4dCB0aGF0IHdpbGwgYmUgYWRkZWQgYmVmb3JlIHRoZSBmYWxsYmFjayBmb3JtXG4gICAgICAgICAgICAvLyBJZiBudWxsLCBubyB0ZXh0IHdpbGwgYmUgYWRkZWQgYXQgYWxsLlxuICAgICAgICAgICAgZGljdEZhbGxiYWNrVGV4dDogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfRkFMTEJBQ0tfVEVYVCcpLFxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgZmlsZSBkb2Vzbid0IG1hdGNoIHRoZSBmaWxlIHR5cGUuXG4gICAgICAgICAgICBkaWN0SW52YWxpZEZpbGVUeXBlOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5EUk9QWk9ORV9JTlZBTElEX0ZJTEVfVFlQRScpLFxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgc2VydmVyIHJlc3BvbnNlIHdhcyBpbnZhbGlkLlxuICAgICAgICAgICAgZGljdFJlc3BvbnNlRXJyb3I6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRST1BaT05FX1JFU1BPTlNFX0VSUk9SJyksXG5cbiAgICAgICAgICAgIC8vIElmIHVzZWQsIHRoZSB0ZXh0IHRvIGJlIHVzZWQgZm9yIHRoZSBjYW5jZWwgdXBsb2FkIGxpbmsuXG4gICAgICAgICAgICBkaWN0Q2FuY2VsVXBsb2FkOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5EUk9QWk9ORV9DQU5DRUxfVVBMT0FEJyksXG5cbiAgICAgICAgICAgIC8vIElmIHVzZWQsIHRoZSB0ZXh0IHRvIGJlIHVzZWQgZm9yIGNvbmZpcm1hdGlvbiB3aGVuIGNhbmNlbGxpbmcgdXBsb2FkLlxuICAgICAgICAgICAgZGljdENhbmNlbFVwbG9hZENvbmZpcm1hdGlvbjogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfQ0FOQ0VMX1VQTE9BRF9DT05GSVJNQVRJT04nKSxcblxuICAgICAgICAgICAgLy8gSWYgdXNlZCwgdGhlIHRleHQgdG8gYmUgdXNlZCB0byByZW1vdmUgYSBmaWxlLlxuICAgICAgICAgICAgZGljdFJlbW92ZUZpbGU6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRST1BaT05FX1JFTU9WRV9GSUxFJyksXG5cbiAgICAgICAgICAgIC8vIERpc3BsYXllZCB3aGVuIHRoZSBtYXhGaWxlcyBoYXZlIGJlZW4gZXhjZWVkZWRcbiAgICAgICAgICAgIC8vIFlvdSBjYW4gdXNlIHt7bWF4RmlsZXN9fSBoZXJlLCB3aGljaCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHRoZSBvcHRpb24uXG4gICAgICAgICAgICBkaWN0TWF4RmlsZXNFeGNlZWRlZDogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfTUFYX0ZJTEVTX0VYQ0VFREVEJyksXG5cbiAgICAgICAgICAgIC8vIFdoZW4gYSBmaWxlIHVwbG9hZCBmYWlscy5cbiAgICAgICAgICAgIGVycm9yOiB0aGlzLmhhbmRsZUVycm9yLmJpbmQodGhpcyksXG5cbiAgICAgICAgICAgIC8vIFdoZW4gZmlsZSBmaWxlIGlzIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICAgICAgICAgIHNlbmRpbmc6IHRoaXMuaGFuZGxlU2VuZGluZy5iaW5kKHRoaXMpLFxuXG4gICAgICAgICAgICAvLyBXaGVuIGEgZmlsZSB1cGxvYWQgc3VjY2VlZHMuXG4gICAgICAgICAgICBzdWNjZXNzOiB0aGlzLmhhbmRsZVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgICAgICAgICAgdGh1bWJuYWlsSGVpZ2h0OiAxNTAsXG5cbiAgICAgICAgICAgIHRodW1ibmFpbFdpZHRoOiAyMDBcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgZmlsZSdzIGNhdGVnb3J5IGJhc2VkIG9uIGl0cyB0eXBlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHN0cmluZyBmaWxlVHlwZSAtIEZvciBleGFtcGxlICdpbWFnZS9qcGcnLlxuICAgICAqXG4gICAgICogQHJldHVybiBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXRGaWxlQ2F0ZWdvcnkoZmlsZVR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGVUeXBlLnNwbGl0KCcvJylbMF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciB0cmlnZ2VyZWQgd2hlbiB0aGUgdXNlciBkcmFncyBhIGZpbGUgaW50byB0aGUgZHJvcHpvbmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb2JqZWN0IGV2ZW50XG4gICAgICovXG4gICAgaGFuZGxlRHJhZ0VudGVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLmhhbmRsZURyYWdFbnRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVEcmFnRW50ZXIoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciB0cmlnZ2VyZWQgd2hlbiBhIHVzZXIncyBjdXJzZXIgbGVhdmVzIHRoZSBkcm9wem9uZSB3aGlsZSBkcmFnZ2luZyBhIGZpbGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb2JqZWN0IGV2ZW50XG4gICAgICovXG4gICAgaGFuZGxlRHJhZ0xlYXZlKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE5vZGUgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKTtcblxuICAgICAgICAvLyBFdmVudCBwcm9wYWdhdGlvbiAoZXZlbnRzIGJ1YmJsaW5nIHVwIGZyb20gZGVjZW5kZW50IGVsZW1lbnRzKSBtZWFucyB0aGUgYGRyYWdMZWF2ZWBcbiAgICAgICAgLy8gZXZlbnQgZ2V0cyB0cmlnZ2VyZWQgb24gdGhlIGRyb3B6b25lLiBIZXJlIHdlJ3JlIGlnbm9yaW5nIGV2ZW50cyB0aGF0IGRvbid0IG9yaWdpbmF0ZSBmcm9tIHRoZSBkcm9wem9uZSBub2RlLlxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ICE9PSBjb21wb25lbnROb2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMuaGFuZGxlRHJhZ0xlYXZlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmhhbmRsZURyYWdMZWF2ZShldmVudCwgY29tcG9uZW50Tm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIHdoZW4gYSBmaWxlJ3MgdXBsb2FkIHByb2dyZXNzIGNoYW5nZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb2JqZWN0IGZpbGUgLSBGaWxlIGludGVyZmFjZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlXG4gICAgICogQHBhcmFtIGludGVnZXIgcHJvZ3Jlc3MgLSB0aGUgdXBsb2FkIHByb2dyZXNzIHBlcmNlbnRhZ2VcbiAgICAgKiBAcGFyYW0gaW50ZWdlciBieXRlc1NlbnQgLSB0b3RhbCBieXRlc1NlbnRcbiAgICAgKi9cbiAgICBoYW5kbGVVcGxvYWRQcm9ncmVzcyhmaWxlLCBwcm9ncmVzcywgYnl0ZXNTZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5oYW5kbGVVcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVVcGxvYWRQcm9ncmVzcyhmaWxlLCBwcm9ncmVzcywgYnl0ZXNTZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgdHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgZHJvcHMgYSBmaWxlIG9uIHRoZSBkcm9wem9uZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvYmplY3QgZXZlbnRcbiAgICAgKi9cbiAgICBoYW5kbGVEcm9wKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5oYW5kbGVEcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmhhbmRsZURyb3AoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIGp1c3QgYmVmb3JlIHRoZSBmaWxlIGlzIHNlbnQuIEdldHMgdGhlIGB4aHJgIG9iamVjdCBhcyBzZWNvbmQgcGFyYW1ldGVyLFxuICAgICAqIHNvIHlvdSBjYW4gbW9kaWZ5IGl0IChmb3IgZXhhbXBsZSB0byBhZGQgYSBDU1JGIHRva2VuKSBhbmQgYSBgZm9ybURhdGFgIG9iamVjdCB0byBhZGQgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvYmplY3QgZmlsZSAtIEZpbGUgaW50ZXJmYWNlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVcbiAgICAgKiBAcGFyYW0gb2JqZWN0IHhoclxuICAgICAqIEBwYXJhbSBvYmplY3QgZm9ybURhdGEgLSBGb3JtRGF0YSBpbnRlcmZhY2UuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRm9ybURhdGFcbiAgICAgKi9cbiAgICBoYW5kbGVTZW5kaW5nKGZpbGUsIHhociwgZm9ybURhdGEpIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdTZWN1cml0eUlEJywgdGhpcy5wcm9wcy5zZWN1cml0eUlEKTtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXJJRCcsIHRoaXMucHJvcHMuZm9sZGVySUQpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5oYW5kbGVTZW5kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmhhbmRsZVNlbmRpbmcoZmlsZSwgeGhyLCBmb3JtRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBmaWxlcyBiZWluZyBhZGRlZC4gQ2FsbGVkIGJlZm9yZSB0aGUgcmVxdWVzdCBpcyBtYWRlIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb2JqZWN0IGZpbGUgLSBGaWxlIGludGVyZmFjZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlXG4gICAgICovXG4gICAgaGFuZGxlQWRkZWRGaWxlKGZpbGUpIHtcbiAgICAgICAgaWYoIXRoaXMucHJvcHMuY2FuVXBsb2FkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICAgICAgLy8gVGhlIHF1ZXVlZEF0VGltZSBpcyB1c2VkIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IGZpbGUgd2hpbGUgaXQncyBpbiB0aGUgcXVldWUuXG4gICAgICAgIGNvbnN0IHF1ZXVlZEF0VGltZSA9IERhdGUubm93KCk7XG5cbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgdXBsb2FkcyBtdWx0aXBsZSBsYXJnZSBpbWFnZXMsIHdlIGNvdWxkIHJ1biBpbnRvIG1lbW9yeSBpc3N1ZXNcbiAgICAgICAgICAgIC8vIGJ5IHNpbXBseSB1c2luZyB0aGUgYGV2ZW50LnRhcmdldC5yZXN1bHRgIGRhdGEgVVJJIGFzIHRoZSB0aHVtYm5haWwgaW1hZ2UuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gVG8gZ2V0IGF2b2lkIHRoaXMgd2UncmUgY3JlYXRpbmcgYSBjYW52YXMsIHVzaW5nIHRoZSBkcm9wem9uZSB0aHVtYm5haWwgZGltZW5zaW9ucyxcbiAgICAgICAgICAgIC8vIGFuZCB1c2luZyB0aGUgY2FudmFzIGRhdGEgVVJJIGFzIHRoZSB0aHVtYm5haWwgaW1hZ2UgaW5zdGVhZC5cblxuICAgICAgICAgICAgdmFyIHRodW1ibmFpbFVSTCA9ICcnO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRGaWxlQ2F0ZWdvcnkoZmlsZS50eXBlKSA9PT0gJ2ltYWdlJykge1xuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSxcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyksXG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIGltZy5zcmMgPSBldmVudC50YXJnZXQucmVzdWx0O1xuXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHRoaXMuZHJvcHpvbmUub3B0aW9ucy50aHVtYm5haWxXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMuZHJvcHpvbmUub3B0aW9ucy50aHVtYm5haWxIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGh1bWJuYWlsVVJMID0gY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnByb3BzLmhhbmRsZUFkZGVkRmlsZSh7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZHJvcHpvbmUub3B0aW9ucy50aHVtYm5haWxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5kcm9wem9uZS5vcHRpb25zLnRodW1ibmFpbFdpZHRoXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB0aGlzLmdldEZpbGVDYXRlZ29yeShmaWxlLnR5cGUpLFxuICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBmaWxlLm5hbWUsXG4gICAgICAgICAgICAgICAgcXVldWVkQXRUaW1lOiBxdWV1ZWRBdFRpbWUsXG4gICAgICAgICAgICAgICAgc2l6ZTogZmlsZS5zaXplLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBmaWxlLm5hbWUsXG4gICAgICAgICAgICAgICAgdHlwZTogZmlsZS50eXBlLFxuICAgICAgICAgICAgICAgIHVybDogdGh1bWJuYWlsVVJMXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5kcm9wem9uZS5wcm9jZXNzRmlsZShmaWxlKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIGZpbGUuX3F1ZXVlZEF0VGltZSA9IHF1ZXVlZEF0VGltZTtcblxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBmYWlsZWQgdXBsb2Fkcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvYmplY3QgZmlsZSAtIEZpbGUgaW50ZXJmYWNlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVcbiAgICAgKiBAcGFyYW0gc3RyaW5nIGVycm9yTWVzc2FnZVxuICAgICAqL1xuICAgIGhhbmRsZUVycm9yKGZpbGUsIGVycm9yTWVzc2FnZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMuaGFuZGxlU2VuZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVFcnJvcihmaWxlLCBlcnJvck1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3Igc3VjY2Vzc2Z1bGx5IHVwbG9hZCBmaWxlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvYmplY3QgZmlsZSAtIEZpbGUgaW50ZXJmYWNlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVcbiAgICAgKi9cbiAgICBoYW5kbGVTdWNjZXNzKGZpbGUpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVTdWNjZXNzKGZpbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdGV4dCBkaXNwbGF5ZWQgd2hlbiBhIHVzZXIgdHJpZXMgdG8gcmVtb3ZlIGEgZmlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdHJpbmcgdXNlclByb21wdCAtIFRoZSBtZXNzYWdlIHRvIGRpc3BsYXkuXG4gICAgICovXG4gICAgc2V0UHJvbXB0T25SZW1vdmUodXNlclByb21wdCkge1xuICAgICAgICB0aGlzLmRyb3B6b25lLm9wdGlvbnMuZGljdFJlbW92ZUZpbGVDb25maXJtYXRpb24gPSB1c2VyUHJvbXB0O1xuICAgIH1cblxufVxuXG5Ecm9wem9uZUNvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG4gICAgZm9sZGVySUQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBoYW5kbGVBZGRlZEZpbGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGFuZGxlRHJhZ0VudGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBoYW5kbGVEcmFnTGVhdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGhhbmRsZURyb3A6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGhhbmRsZUVycm9yOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGhhbmRsZVNlbmRpbmc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGhhbmRsZVN1Y2Nlc3M6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgdXJsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBwcm9tcHRPblJlbW92ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzZWN1cml0eUlEOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgdXBsb2FkQnV0dG9uOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICBjYW5VcGxvYWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWRcbn07XG5cbkRyb3B6b25lQ29tcG9uZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgICB1cGxvYWRCdXR0b246IHRydWVcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERyb3B6b25lQ29tcG9uZW50O1xuIiwiaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBpMThuIGZyb20gJ2kxOG4nO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjb25zdGFudHMgZnJvbSAnY29uc3RhbnRzL2luZGV4JztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5cbmNsYXNzIEZpbGVDb21wb25lbnQgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuaGFuZGxlVG9nZ2xlU2VsZWN0ID0gdGhpcy5oYW5kbGVUb2dnbGVTZWxlY3QuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZURlbGV0ZSA9IHRoaXMuaGFuZGxlRGVsZXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVBY3RpdmF0ZSA9IHRoaXMuaGFuZGxlQWN0aXZhdGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUtleURvd24gPSB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUNhbmNlbFVwbG9hZCA9IHRoaXMuaGFuZGxlQ2FuY2VsVXBsb2FkLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5wcmV2ZW50Rm9jdXMgPSB0aGlzLnByZXZlbnRGb2N1cy5iaW5kKHRoaXMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdyYXBwZXIgYXJvdW5kIHRoaXMucHJvcHMuaGFuZGxlQWN0aXZhdGVcblx0ICpcblx0ICogQHBhcmFtIG9iamVjdCBldmVudCAtIEV2ZW50IG9iamVjdC5cblx0ICovXG5cdGhhbmRsZUFjdGl2YXRlKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0dGhpcy5wcm9wcy5oYW5kbGVBY3RpdmF0ZShldmVudCwgdGhpcy5wcm9wcy5pdGVtKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXcmFwcGVyIGFyb3VuZCB0aGlzLnByb3BzLmhhbmRsZVRvZ2dsZVNlbGVjdFxuXHQgKlxuXHQgKiBAcGFyYW0gb2JqZWN0IGV2ZW50IC0gRXZlbnQgb2JqZWN0LlxuXHQgKi9cblx0aGFuZGxlVG9nZ2xlU2VsZWN0KGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0dGhpcy5wcm9wcy5oYW5kbGVUb2dnbGVTZWxlY3QoZXZlbnQsIHRoaXMucHJvcHMuaXRlbSk7XG5cdH1cblxuXHQvKipcblx0ICogV3JhcHBlciBhcm91bmQgdGhpcy5wcm9wcy5oYW5kbGVEZWxldGVcblx0ICpcblx0ICogQHBhcmFtIG9iamVjdCBldmVudCAtIEV2ZW50IG9iamVjdC5cblx0ICovXG5cdGhhbmRsZURlbGV0ZShldmVudCkge1xuXHRcdHRoaXMucHJvcHMuaGFuZGxlRGVsZXRlKGV2ZW50LCB0aGlzLnByb3BzLml0ZW0pO1xuXHR9XG5cblx0Z2V0VGh1bWJuYWlsU3R5bGVzKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0uY2F0ZWdvcnkgPT09ICdpbWFnZScpIHtcblx0XHRcdHJldHVybiB7J2JhY2tncm91bmRJbWFnZSc6ICd1cmwoJyArIHRoaXMucHJvcHMuaXRlbS51cmwgKyAnKSd9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGNvbXBvbmVudCBoYXMgYW4gZXJyb3Igc2V0LlxuXHQgKlxuXHQgKiBAcmV0dXJuIGJvb2xlYW5cblx0ICovXG5cdGhhc0Vycm9yKCkge1xuXHRcdHZhciBoYXNFcnJvciA9IGZhbHNlO1xuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodGhpcy5wcm9wcy5tZXNzYWdlcykpIHtcblx0XHRcdGhhc0Vycm9yID0gdGhpcy5wcm9wcy5tZXNzYWdlcy5maWx0ZXIobWVzc2FnZSA9PiB7XG5cdFx0XHRcdHJldHVybiBtZXNzYWdlLnR5cGUgPT09ICdlcnJvcidcblx0XHRcdH0pLmxlbmd0aCA+IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhhc0Vycm9yO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgbWFya3VwIGZvciBhbiBlcnJvciBtZXNzYWdlIGlmIG9uZSBpcyBzZXQuXG5cdCAqL1xuXHRnZXRFcnJvck1lc3NhZ2UoKSB7XG5cdFx0aWYgKHRoaXMuaGFzRXJyb3IoKSkge1xuXHRcdFx0cmV0dXJuIDxzcGFuIGNsYXNzTmFtZT0naXRlbV9fZXJyb3ItbWVzc2FnZSc+e3RoaXMucHJvcHMubWVzc2FnZXNbMF0udmFsdWV9PC9zcGFuPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGdldFRodW1ibmFpbENsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIHRodW1ibmFpbENsYXNzTmFtZXMgPSBbJ2l0ZW1fX3RodW1ibmFpbCddO1xuXG5cdFx0aWYgKHRoaXMuaXNJbWFnZVNtYWxsZXJUaGFuVGh1bWJuYWlsKCkpIHtcblx0XHRcdHRodW1ibmFpbENsYXNzTmFtZXMucHVzaCgnaXRlbV9fdGh1bWJuYWlsLS1zbWFsbCcpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aHVtYm5haWxDbGFzc05hbWVzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGdldEl0ZW1DbGFzc05hbWVzKCkge1xuXHRcdHZhciBpdGVtQ2xhc3NOYW1lcyA9IFtgaXRlbSBpdGVtLS0ke3RoaXMucHJvcHMuaXRlbS5jYXRlZ29yeX1gXTtcblxuXHRcdGlmICh0aGlzLnByb3BzLnNlbGVjdGVkKSB7XG5cdFx0XHRpdGVtQ2xhc3NOYW1lcy5wdXNoKCdpdGVtLS1zZWxlY3RlZCcpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmhhc0Vycm9yKCkpIHtcblx0XHRcdGl0ZW1DbGFzc05hbWVzLnB1c2goJ2l0ZW0tLWVycm9yJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGl0ZW1DbGFzc05hbWVzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlzSW1hZ2VTbWFsbGVyVGhhblRodW1ibmFpbCgpIHtcblx0XHRsZXQgZGltZW5zaW9ucyA9IHRoaXMucHJvcHMuaXRlbS5hdHRyaWJ1dGVzLmRpbWVuc2lvbnM7XG5cblx0XHRyZXR1cm4gZGltZW5zaW9ucy5oZWlnaHQgPCBjb25zdGFudHMuVEhVTUJOQUlMX0hFSUdIVCAmJiBkaW1lbnNpb25zLndpZHRoIDwgY29uc3RhbnRzLlRIVU1CTkFJTF9XSURUSDtcblx0fVxuXG5cdGhhbmRsZUtleURvd24oZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvL1N0b3AgcGFnZSBzY3JvbGxpbmcgaWYgc3BhY2VLZXkgaXMgcHJlc3NlZFxuXG5cdFx0Ly9JZiBzcGFjZSBpcyBwcmVzc2VkLCBzZWxlY3QgZmlsZVxuXHRcdGlmICh0aGlzLnByb3BzLnNwYWNlS2V5ID09PSBldmVudC5rZXlDb2RlKSB7XG5cdFx0XHR0aGlzLmhhbmRsZVRvZ2dsZVNlbGVjdChldmVudCk7XG5cdFx0fVxuXG5cdFx0Ly9JZiByZXR1cm4gaXMgcHJlc3NlZCwgbmF2aWdhdGUgZm9sZGVyXG5cdFx0aWYgKHRoaXMucHJvcHMucmV0dXJuS2V5ID09PSBldmVudC5rZXlDb2RlKSB7XG5cdFx0XHR0aGlzLmhhbmRsZUFjdGl2YXRlKGV2ZW50LCB0aGlzLnByb3BzLml0ZW0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBBdm9pZHMgdGhlIGJyb3dzZXIncyBkZWZhdWx0IGZvY3VzIHN0YXRlIHdoZW4gc2VsZWN0aW5nIGFuIGl0ZW0uXG5cdCAqXG5cdCAqIEBwYXJhbSBvYmplY3QgZXZlbnQgLSBFdmVudCBvYmplY3QuXG5cdCAqL1xuXHRwcmV2ZW50Rm9jdXMoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0aGFuZGxlQ2FuY2VsVXBsb2FkKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRpZiAodGhpcy5oYXNFcnJvcigpKSB7XG5cdFx0XHR0aGlzLnByb3BzLmhhbmRsZVJlbW92ZUVycm9yZWRVcGxvYWQodGhpcy5wcm9wcy5pdGVtKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wcm9wcy5oYW5kbGVDYW5jZWxVcGxvYWQodGhpcy5wcm9wcy5pdGVtKTtcblx0XHR9XG5cdH1cblxuXHRnZXRQcm9ncmVzc0JhcigpIHtcblx0XHR2YXIgcHJvZ3Jlc3NCYXI7XG5cblx0XHRjb25zdCBwcm9ncmVzc0JhclByb3BzID0ge1xuXHRcdFx0Y2xhc3NOYW1lOiAnaXRlbV9fdXBsb2FkLXByb2dyZXNzX19iYXInLFxuXHRcdFx0c3R5bGU6IHtcblx0XHRcdFx0d2lkdGg6IGAke3RoaXMucHJvcHMuaXRlbS5wcm9ncmVzc30lYFxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAoIXRoaXMuaGFzRXJyb3IoKSAmJiB0aGlzLnByb3BzLnVwbG9hZGluZykge1xuXHRcdFx0cHJvZ3Jlc3NCYXIgPSA8ZGl2IGNsYXNzTmFtZT0naXRlbV9fdXBsb2FkLXByb2dyZXNzJz48ZGl2IHsuLi5wcm9ncmVzc0JhclByb3BzfT48L2Rpdj48L2Rpdj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb2dyZXNzQmFyO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHZhciBhY3Rpb25CdXR0b247XG5cblx0XHRpZiAodGhpcy5wcm9wcy51cGxvYWRpbmcpIHtcblx0XHRcdGFjdGlvbkJ1dHRvbiA9IDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPSdpdGVtX19hY3Rpb25zX19hY3Rpb24gaXRlbV9fYWN0aW9uc19fYWN0aW9uLS1jYW5jZWwgWyBmb250LWljb24tY2FuY2VsIF0nXG5cdFx0XHRcdHR5cGU9J2J1dHRvbidcblx0XHRcdFx0dGl0bGU9e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlNFTEVDVCcpfVxuXHRcdFx0XHR0YWJJbmRleD0nLTEnXG5cdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLnByZXZlbnRGb2N1c31cblx0XHRcdFx0b25DbGljaz17dGhpcy5oYW5kbGVDYW5jZWxVcGxvYWR9XG5cdFx0XHRcdGRhdGEtZHotcmVtb3ZlPlxuXHRcdFx0PC9idXR0b24+O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhY3Rpb25CdXR0b24gPSA8YnV0dG9uXG5cdFx0XHRcdGNsYXNzTmFtZT0naXRlbV9fYWN0aW9uc19fYWN0aW9uIGl0ZW1fX2FjdGlvbnNfX2FjdGlvbi0tc2VsZWN0IFsgZm9udC1pY29uLXRpY2sgXSdcblx0XHRcdFx0dHlwZT0nYnV0dG9uJ1xuXHRcdFx0XHR0aXRsZT17aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuU0VMRUNUJyl9XG5cdFx0XHRcdHRhYkluZGV4PSctMSdcblx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMucHJldmVudEZvY3VzfVxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLmhhbmRsZVRvZ2dsZVNlbGVjdH0+XG5cdFx0XHQ8L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXZcblx0XHRcdFx0Y2xhc3NOYW1lPXt0aGlzLmdldEl0ZW1DbGFzc05hbWVzKCl9XG5cdFx0XHRcdGRhdGEtaWQ9e3RoaXMucHJvcHMuaXRlbS5pZH1cblx0XHRcdFx0dGFiSW5kZXg9JzAnXG5cdFx0XHRcdG9uS2V5RG93bj17dGhpcy5oYW5kbGVLZXlEb3dufVxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLmhhbmRsZUFjdGl2YXRlfT5cblx0XHRcdFx0PGRpdiByZWY9J3RodW1ibmFpbCcgY2xhc3NOYW1lPXt0aGlzLmdldFRodW1ibmFpbENsYXNzTmFtZXMoKX0gc3R5bGU9e3RoaXMuZ2V0VGh1bWJuYWlsU3R5bGVzKCl9PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpdGVtLS1vdmVybGF5IFsgZm9udC1pY29uLWVkaXQgXSc+VmlldzwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0e3RoaXMuZ2V0UHJvZ3Jlc3NCYXIoKX1cblx0XHRcdFx0e3RoaXMuZ2V0RXJyb3JNZXNzYWdlKCl9XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpdGVtX190aXRsZScgcmVmPSd0aXRsZSc+XG5cdFx0XHRcdFx0e3RoaXMucHJvcHMuaXRlbS50aXRsZX1cblx0XHRcdFx0XHR7YWN0aW9uQnV0dG9ufVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn1cblxuRmlsZUNvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG5cdGl0ZW06IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdFx0YXR0cmlidXRlczogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcblx0XHRcdGRpbWVuc2lvbnM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxuXHRcdH0pLFxuXHRcdGNhdGVnb3J5OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cdFx0aWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblx0XHR1cmw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblx0XHRwcm9ncmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxuXHR9KSxcblx0c2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cdHNwYWNlS2V5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRyZXR1cm5LZXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdGhhbmRsZUFjdGl2YXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRoYW5kbGVUb2dnbGVTZWxlY3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdGhhbmRsZURlbGV0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblx0bWVzc2FnZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0dXBsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxufTtcblxuRmlsZUNvbXBvbmVudC5kZWZhdWx0UHJvcHMgPSB7XG5cdHJldHVybktleTogMTMsXG5cdHNwYWNlS2V5OiAzMlxufTtcblxuZXhwb3J0IGRlZmF1bHQgRmlsZUNvbXBvbmVudFxuIiwiaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0J0NTU19UUkFOU0lUSU9OX1RJTUUnOiAzMDAsXG5cdCdUSFVNQk5BSUxfSEVJR0hUJzogMTUwLFxuXHQnVEhVTUJOQUlMX1dJRFRIJzogMjAwLFxuXHQnQlVMS19BQ1RJT05TJzogW1xuXHRcdHtcblx0XHRcdHZhbHVlOiAnZGVsZXRlJyxcblx0XHRcdGxhYmVsOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5CVUxLX0FDVElPTlNfREVMRVRFJyksXG5cdFx0XHRkZXN0cnVjdGl2ZTogdHJ1ZVxuXHRcdH1cblx0XSxcblx0J0JVTEtfQUNUSU9OU19QTEFDRUhPTERFUic6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkJVTEtfQUNUSU9OU19QTEFDRUhPTERFUicpLFxuXHQnSE9NRV9ST1VURSc6ICcvYXNzZXRzJywgLy8gSGFyZGNvZGVkIGhlcmUgdW50aWwgd2UgaGF2ZSBhIGNvbmZpZyBtYW5hZ2VyXG5cdCdFRElUSU5HX1JPVVRFJzogJy9hc3NldHMvRWRpdEZvcm0vZmllbGQvRmlsZXMvaXRlbS86aWQvZWRpdCcsIC8vIEhhcmRjb2RlZCBoZXJlIHVudGlsIHdlIGhhdmUgYSBjb25maWcgbWFuYWdlclxuXHQnRk9MREVSX1JPVVRFJzogJy9hc3NldHMvc2hvdy86aWQ/JyAvLyBIYXJkY29kZWQgaGVyZSB1bnRpbCB3ZSBoYXZlIGEgY29uZmlnIG1hbmFnZXJcbn07XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgKiBhcyBnYWxsZXJ5QWN0aW9ucyBmcm9tICdzdGF0ZS9nYWxsZXJ5L2FjdGlvbnMnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBGaWxlQmFja2VuZCBmcm9tICdiYWNrZW5kL2ZpbGUtYmFja2VuZCc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJ2NvbnN0YW50cy9pbmRleCc7XG5cbmNsYXNzIEFzc2V0QWRtaW5Db250YWluZXIgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICAgIHZhciAkY29tcG9uZW50V3JhcHBlciA9ICQoJy5hc3NldC1nYWxsZXJ5JykuZmluZCgnLmFzc2V0LWdhbGxlcnktY29tcG9uZW50LXdyYXBwZXInKSxcbiAgICAgICAgICAgICRzZWFyY2ggPSAkKCcuY21zLXNlYXJjaC1mb3JtJyk7XG5cbiAgICAgICAgaWYgKCRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAkc2VhcmNoLmFwcGVuZCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwicVtGb2xkZXJdXCIgLz4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFja2VuZCA9IG5ldyBGaWxlQmFja2VuZChcbiAgICAgICAgICAgICRjb21wb25lbnRXcmFwcGVyLmRhdGEoJ2Fzc2V0LWdhbGxlcnktZmlsZXMtYnktcGFyZW50LXVybCcpLFxuICAgICAgICAgICAgJGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1maWxlcy1ieS1zaWJsaW5nLXVybCcpLFxuICAgICAgICAgICAgJGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1zZWFyY2gtdXJsJyksXG4gICAgICAgICAgICAkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LXVwZGF0ZS11cmwnKSxcbiAgICAgICAgICAgICRjb21wb25lbnRXcmFwcGVyLmRhdGEoJ2Fzc2V0LWdhbGxlcnktZGVsZXRlLXVybCcpLFxuICAgICAgICAgICAgJGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1saW1pdCcpLFxuICAgICAgICAgICAgJGNvbXBvbmVudFdyYXBwZXIuZGF0YSgnYXNzZXQtZ2FsbGVyeS1idWxrLWFjdGlvbnMnKSxcbiAgICAgICAgICAgICRzZWFyY2guZmluZCgnW3R5cGU9aGlkZGVuXVtuYW1lPVwicVtGb2xkZXJdXCJdJyksXG4gICAgICAgICAgICAkY29tcG9uZW50V3JhcHBlci5kYXRhKCdhc3NldC1nYWxsZXJ5LWluaXRpYWwtZm9sZGVyJykgfHwgJydcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmhhbmRsZUJhY2tlbmRGZXRjaCA9IHRoaXMuaGFuZGxlQmFja2VuZEZldGNoLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlQmFja2VuZFNhdmUgPSB0aGlzLmhhbmRsZUJhY2tlbmRTYXZlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlQmFja2VuZERlbGV0ZSA9IHRoaXMuaGFuZGxlQmFja2VuZERlbGV0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZUJhY2tlbmROYXZpZ2F0ZSA9IHRoaXMuaGFuZGxlQmFja2VuZE5hdmlnYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlQmFja2VuZE1vcmUgPSB0aGlzLmhhbmRsZUJhY2tlbmRNb3JlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlQmFja2VuZFNlYXJjaCA9IHRoaXMuaGFuZGxlQmFja2VuZFNlYXJjaC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBzdXBlci5jb21wb25lbnREaWRNb3VudCgpO1xuXG4gICAgICAgIHZhciBmZXRjaE1ldGhvZCA9ICdnZXRGaWxlc0J5UGFyZW50SUQnO1xuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmlkRnJvbVVSTCAmJiB0aGlzLnByb3BzLmlkRnJvbVVSTCAhPT0gdGhpcy5wcm9wcy5pbml0aWFsRm9sZGVyKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgdXJsIGlzIHRvIGVkaXQgYSBzcGVjaWZpYyBmaWxlLlxuICAgICAgICAgICAgLy8gRG9pbmcgdGhpcyBiZWNhdXNlIHRoZSBnYWxsZXJ5IHZpZXcgYW5kIHRoZSBlZGl0IHZpZXcgYXJlIGhhbmRsZWRcbiAgICAgICAgICAgIC8vIGJ5IHNlcGFyYXRlIFNpbHZlclN0cmlwZSBjb250cm9sbGVycy5cbiAgICAgICAgICAgIC8vIFdoZW4gdGhlIEFzc2V0R2FsbGVyeUZpZWxkIGJlY29tZXMgdGhlIGVudGlyZSBzZWN0aW9uIHdlIGNhbiBoYW5kbGUgdGhpcyBkaWZmZXJlbnRseVxuICAgICAgICAgICAgZmV0Y2hNZXRob2QgPSAnZ2V0RmlsZXNCeVNpYmxpbmdJRCc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJhY2tlbmRbZmV0Y2hNZXRob2RdKHRoaXMucHJvcHMuaWRGcm9tVVJMKVxuICAgICAgICAgICAgLmRvbmUoKGRhdGEsIHN0YXR1cywgeGhyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIHRoZSBpbml0aWFsIHBheWxvYWQgZnJvbSB0aGUgRmlsZUJhY2tlbmQuXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIGFmdGVyIHRoaXMuaGFuZGxlQmFja2VuZEZldGNoXG5cbiAgICAgICAgICAgICAgICBjb25zdCByb3V0ZSA9IG5ldyB3aW5kb3cuc3Mucm91dGVyLlJvdXRlKENPTlNUQU5UUy5FRElUSU5HX1JPVVRFKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UGF0aCA9IHdpbmRvdy5zcy5yb3V0ZXIuY3VycmVudDtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IHRoaXMucHJvcHMuYXNzZXRBZG1pbi5nYWxsZXJ5LmZpbGVzO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UncmUgb24gYSBmaWxlIGVkaXQgcm91dGUgd2UgbmVlZCB0byBzZXQgdGhlIGZpbGUgY3VycmVudGx5IGJlaW5nIGVkaXRlZC5cbiAgICAgICAgICAgICAgICBpZiAocm91dGUubWF0Y2goY3VycmVudFBhdGgsIHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLnNldEVkaXRpbmcoZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmlkID09PSBwYXJzZUludChwYXJhbXMuaWQsIDEwKSlbMF0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5zZXRQYXRoKGN1cnJlbnRQYXRoKTtcblxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmJhY2tlbmQuYWRkTGlzdGVuZXIoJ29uRmV0Y2hEYXRhJywgdGhpcy5oYW5kbGVCYWNrZW5kRmV0Y2gpO1xuICAgICAgICB0aGlzLmJhY2tlbmQuYWRkTGlzdGVuZXIoJ29uU2F2ZURhdGEnLCB0aGlzLmhhbmRsZUJhY2tlbmRTYXZlKTtcbiAgICAgICAgdGhpcy5iYWNrZW5kLmFkZExpc3RlbmVyKCdvbkRlbGV0ZURhdGEnLCB0aGlzLmhhbmRsZUJhY2tlbmREZWxldGUpO1xuICAgICAgICB0aGlzLmJhY2tlbmQuYWRkTGlzdGVuZXIoJ29uTmF2aWdhdGVEYXRhJywgdGhpcy5oYW5kbGVCYWNrZW5kTmF2aWdhdGUpO1xuICAgICAgICB0aGlzLmJhY2tlbmQuYWRkTGlzdGVuZXIoJ29uTW9yZURhdGEnLCB0aGlzLmhhbmRsZUJhY2tlbmRNb3JlKTtcbiAgICAgICAgdGhpcy5iYWNrZW5kLmFkZExpc3RlbmVyKCdvblNlYXJjaERhdGEnLCB0aGlzLmhhbmRsZUJhY2tlbmRTZWFyY2gpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICBzdXBlci5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXG4gICAgICAgIHRoaXMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcignb25GZXRjaERhdGEnLCB0aGlzLmhhbmRsZUJhY2tlbmRGZXRjaCk7XG4gICAgICAgIHRoaXMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcignb25TYXZlRGF0YScsIHRoaXMuaGFuZGxlQmFja2VuZFNhdmUpO1xuICAgICAgICB0aGlzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uRGVsZXRlRGF0YScsIHRoaXMuaGFuZGxlQmFja2VuZERlbGV0ZSk7XG4gICAgICAgIHRoaXMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcignb25OYXZpZ2F0ZURhdGEnLCB0aGlzLmhhbmRsZUJhY2tlbmROYXZpZ2F0ZSk7XG4gICAgICAgIHRoaXMuYmFja2VuZC5yZW1vdmVMaXN0ZW5lcignb25Nb3JlRGF0YScsIHRoaXMuaGFuZGxlQmFja2VuZE1vcmUpO1xuICAgICAgICB0aGlzLmJhY2tlbmQucmVtb3ZlTGlzdGVuZXIoJ29uU2VhcmNoRGF0YScsIHRoaXMuaGFuZGxlQmFja2VuZFNlYXJjaCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICAvLyBHaXZlIGVhY2ggY2hpbGQgY29tcG9uZW50IGFjY2VzcyB0byB0aGUgRmlsZUJhY2tlbmQuXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gUmVhY3QuQ2hpbGRyZW4ubWFwKHRoaXMucHJvcHMuY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudChjaGlsZCwgeyBiYWNrZW5kOiB0aGlzLmJhY2tlbmQgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlcIj5cbiAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBoYW5kbGVFbnRlclJvdXRlKGN0eCwgbmV4dCkge1xuICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMuc2V0UGF0aChjdHgucGF0aCk7XG4gICAgICAgIG5leHQoKTtcbiAgICB9XG5cbiAgICBoYW5kbGVFeGl0Um91dGUoY3R4LCBuZXh0KSB7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5zZXRQYXRoKG51bGwpO1xuICAgICAgICBuZXh0KCk7XG4gICAgfVxuXG4gICAgaGFuZGxlQmFja2VuZEZldGNoKGRhdGEpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLnNldEZvbGRlcklkKHBhcnNlSW50KGRhdGEuZm9sZGVySUQsIDEwKSk7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5zZXRQYXJlbnRGb2xkZXJJZChkYXRhLnBhcmVudCk7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlcyhkYXRhLmZpbGVzLCBkYXRhLmNvdW50KTtcbiAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLnNldEZvbGRlclBlcm1pc3Npb25zKGRhdGEuZm9sZGVyUGVybWlzc2lvbnMpO1xuICAgIH1cblxuICAgIGhhbmRsZUJhY2tlbmRTYXZlKGlkLCB2YWx1ZXMpIHtcbiAgICAgICAgd2luZG93LnNzLnJvdXRlci5zaG93KENPTlNUQU5UUy5IT01FX1JPVVRFKTtcbiAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLnNldEVkaXRpbmcobnVsbCk7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy51cGRhdGVGaWxlKGlkLCB7IHRpdGxlOiB2YWx1ZXMudGl0bGUsIGJhc2VuYW1lOiB2YWx1ZXMuYmFzZW5hbWUgfSk7XG4gICAgfVxuXG4gICAgaGFuZGxlQmFja2VuZERlbGV0ZShkYXRhKSB7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5kZXNlbGVjdEZpbGVzKGRhdGEpO1xuICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMucmVtb3ZlRmlsZXMoZGF0YSk7XG4gICAgfVxuXG4gICAgaGFuZGxlQmFja2VuZE5hdmlnYXRlKGRhdGEpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5hY3Rpb25zLnJlbW92ZUZpbGVzKCk7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlcyhkYXRhLmZpbGVzLCBkYXRhLmNvdW50KTtcbiAgICB9XG5cbiAgICBoYW5kbGVCYWNrZW5kTW9yZShkYXRhKSB7XG4gICAgICAgIHRoaXMucHJvcHMuYWN0aW9ucy5hZGRGaWxlcyh0aGlzLnByb3BzLmFzc2V0QWRtaW4uZ2FsbGVyeS5maWxlcy5jb25jYXQoZGF0YS5maWxlcyksIGRhdGEuY291bnQpO1xuICAgIH1cblxuICAgIGhhbmRsZUJhY2tlbmRTZWFyY2goZGF0YSkge1xuICAgICAgICB0aGlzLnByb3BzLmFjdGlvbnMuYWRkRmlsZXMoZGF0YS5maWxlcywgZGF0YS5jb3VudCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhc3NldEFkbWluOiBzdGF0ZS5hc3NldEFkbWluXG4gICAgfVxufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhY3Rpb25zOiBiaW5kQWN0aW9uQ3JlYXRvcnMoZ2FsbGVyeUFjdGlvbnMsIGRpc3BhdGNoKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoQXNzZXRBZG1pbkNvbnRhaW5lcik7XG4iLCJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNpbHZlclN0cmlwZUNvbXBvbmVudCBmcm9tICdzaWx2ZXJzdHJpcGUtY29tcG9uZW50JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBiaW5kQWN0aW9uQ3JlYXRvcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgKiBhcyBnYWxsZXJ5QWN0aW9ucyBmcm9tICdzdGF0ZS9nYWxsZXJ5L2FjdGlvbnMnO1xuaW1wb3J0IFRleHRGaWVsZENvbXBvbmVudCBmcm9tICdjb21wb25lbnRzL3RleHQtZmllbGQvaW5kZXgnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICdjb25zdGFudHMvaW5kZXgnO1xuXG5jbGFzcyBFZGl0b3JDb250YWluZXIgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdGNvbnN0IGZpbGUgPSB0aGlzLnByb3BzLmZpbGU7XG5cblx0XHR0aGlzLmZpZWxkcyA9IFtcblx0XHRcdHtcblx0XHRcdFx0J2xhYmVsJzogJ1RpdGxlJyxcblx0XHRcdFx0J25hbWUnOiAndGl0bGUnLFxuXHRcdFx0XHQndmFsdWUnOiBmaWxlID09PSBudWxsID8gZmlsZSA6IGZpbGUudGl0bGVcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCdsYWJlbCc6ICdGaWxlbmFtZScsXG5cdFx0XHRcdCduYW1lJzogJ2Jhc2VuYW1lJyxcblx0XHRcdFx0J3ZhbHVlJzogZmlsZSA9PT0gbnVsbCA/IGZpbGUgOiBmaWxlLmJhc2VuYW1lXG5cdFx0XHR9XG5cdFx0XTtcblxuXHRcdHRoaXMub25GaWVsZENoYW5nZSA9IHRoaXMub25GaWVsZENoYW5nZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25GaWxlU2F2ZSA9IHRoaXMub25GaWxlU2F2ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25DYW5jZWwgPSB0aGlzLm9uQ2FuY2VsLmJpbmQodGhpcyk7XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHRzdXBlci5jb21wb25lbnREaWRNb3VudCgpO1xuXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLnNldEVkaXRvckZpZWxkcyh0aGlzLmZpZWxkcyk7XG5cdH1cblxuXHRjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcblx0XHRzdXBlci5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLnNldEVkaXRvckZpZWxkcygpO1xuXHR9XG5cblx0b25GaWVsZENoYW5nZShldmVudCkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy51cGRhdGVFZGl0b3JGaWVsZCh7XG5cdFx0XHRuYW1lOiBldmVudC50YXJnZXQubmFtZSxcblx0XHRcdHZhbHVlOiBldmVudC50YXJnZXQudmFsdWVcblx0XHR9KTtcblx0fVxuXG5cdG9uRmlsZVNhdmUoZXZlbnQpIHtcblx0XHR0aGlzLnByb3BzLm9uRmlsZVNhdmUodGhpcy5wcm9wcy5maWxlLmlkLCB0aGlzLnByb3BzLmVkaXRvckZpZWxkcyk7XG5cblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0b25DYW5jZWwoZXZlbnQpIHtcblx0XHR3aW5kb3cuc3Mucm91dGVyLnNob3coQ09OU1RBTlRTLkhPTUVfUk9VVEUpO1xuXHR9XG5cblx0aGFuZGxlRW50ZXJSb3V0ZShjdHgsIG5leHQpIHtcblx0XHQvLyBJZiB0aGVyZSBpcyBubyBmaWxlIHRvIGVkaXQgc2V0IHRoZSBlZGl0aW5nIGZpbGVcblx0XHQvLyBieSBtYXRjaGluZyBhIGZpbGUgaWQgYWdhaW5zdCB0aGUgaWQgaW4gdGhlIFVSTC5cblx0XHRpZiAodGhpcy5wcm9wcy5maWxlID09PSBudWxsKSB7XG5cdFx0XHR0aGlzLnByb3BzLmFjdGlvbnMuc2V0RWRpdGluZyh0aGlzLnByb3BzLmZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5pZCA9PT0gcGFyc2VJbnQoY3R4LnBhcmFtcy5pZCwgMTApKVswXSk7XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlRXhpdFJvdXRlKGN0eCwgbmV4dCkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5zZXRFZGl0aW5nKG51bGwpO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmZpbGUgPT09IG51bGwgfHwgdHlwZW9mIHRoaXMucHJvcHMuZmlsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZWRpdG9yLWNvbXBvbmVudCc+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nQ29tcG9zaXRlRmllbGQgY29tcG9zaXRlIGNtcy1maWxlLWluZm8gbm9sYWJlbCc+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdDb21wb3NpdGVGaWVsZCBjb21wb3NpdGUgY21zLWZpbGUtaW5mby1wcmV2aWV3IG5vbGFiZWwnPlxuXHRcdFx0XHRcdDxpbWcgY2xhc3NOYW1lPSd0aHVtYm5haWwtcHJldmlldycgc3JjPXt0aGlzLnByb3BzLmZpbGUudXJsfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBjbXMtZmlsZS1pbmZvLWRhdGEgbm9sYWJlbCc+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J0NvbXBvc2l0ZUZpZWxkIGNvbXBvc2l0ZSBub2xhYmVsJz5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5UWVBFJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUudHlwZX08L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIHJlYWRvbmx5Jz5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9J2xlZnQnPntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5TSVpFJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5zaXplfTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmaWVsZCByZWFkb25seSc+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPSdsZWZ0Jz57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuVVJMJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+XG5cdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj17dGhpcy5wcm9wcy5maWxlLnVybH0gdGFyZ2V0PSdfYmxhbmsnPnt0aGlzLnByb3BzLmZpbGUudXJsfTwvYT5cblx0XHRcdFx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkNSRUFURUQnKX06PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtaWRkbGVDb2x1bW4nPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3JlYWRvbmx5Jz57dGhpcy5wcm9wcy5maWxlLmNyZWF0ZWR9PC9zcGFuPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZpZWxkIGRhdGVfZGlzYWJsZWQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkxBU1RFRElUJyl9OjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbWlkZGxlQ29sdW1uJz5cblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdyZWFkb25seSc+e3RoaXMucHJvcHMuZmlsZS5sYXN0VXBkYXRlZH08L3NwYW4+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmllbGQgcmVhZG9ubHknPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nbGVmdCc+e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkRJTScpfTo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J21pZGRsZUNvbHVtbic+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0ncmVhZG9ubHknPnt0aGlzLnByb3BzLmZpbGUuYXR0cmlidXRlcy5kaW1lbnNpb25zLndpZHRofSB4IHt0aGlzLnByb3BzLmZpbGUuYXR0cmlidXRlcy5kaW1lbnNpb25zLmhlaWdodH1weDwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0e3RoaXMucHJvcHMuZWRpdG9yRmllbGRzLm1hcCgoZmllbGQsIGkpID0+IHtcblx0XHRcdFx0cmV0dXJuIDxUZXh0RmllbGRDb21wb25lbnRcblx0XHRcdFx0XHRcdGtleT17aX1cblx0XHRcdFx0XHRcdGxhYmVsPXtmaWVsZC5sYWJlbH1cblx0XHRcdFx0XHRcdG5hbWU9e2ZpZWxkLm5hbWV9XG5cdFx0XHRcdFx0XHR2YWx1ZT17dGhpcy5wcm9wcy5maWxlW2ZpZWxkLm5hbWVdfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMub25GaWVsZENoYW5nZX0gLz5cblx0XHRcdH0pfVxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdHR5cGU9J3N1Ym1pdCdcblx0XHRcdFx0XHRjbGFzc05hbWU9XCJzcy11aS1idXR0b24gdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwgZm9udC1pY29uLWNoZWNrLW1hcmtcIlxuXHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMub25GaWxlU2F2ZX0+XG5cdFx0XHRcdFx0e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLlNBVkUnKX1cblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHR0eXBlPSdidXR0b24nXG5cdFx0XHRcdFx0Y2xhc3NOYW1lPVwic3MtdWktYnV0dG9uIHVpLWJ1dHRvbiB1aS13aWRnZXQgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsIGZvbnQtaWNvbi1jYW5jZWwtY2lyY2xlZFwiXG5cdFx0XHRcdFx0b25DbGljaz17dGhpcy5vbkNhbmNlbH0+XG5cdFx0XHRcdFx0e2kxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkNBTkNFTCcpfVxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2Pjtcblx0fVxufVxuXG5FZGl0b3JDb250YWluZXIucHJvcFR5cGVzID0ge1xuXHRmaWxlOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHRcdGlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRcdHRpdGxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGJhc2VuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRzaXplOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGNyZWF0ZWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0bGFzdFVwZGF0ZWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0ZGltZW5zaW9uczogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcblx0XHRcdHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHRcdFx0aGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG5cdFx0fSlcblx0fSksXG5cdGJhY2tlbmQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdHJldHVybiB7XG5cdFx0ZWRpdG9yRmllbGRzOiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnkuZWRpdG9yRmllbGRzLCAvLyBUaGUgaW5wdXRzIGZvciBlZGl0aW5nIHRoZSBmaWxlLlxuXHRcdGZpbGU6IHN0YXRlLmFzc2V0QWRtaW4uZ2FsbGVyeS5lZGl0aW5nLCAvLyBUaGUgZmlsZSB0byBlZGl0LlxuXHRcdGZpbGVzOiBzdGF0ZS5hc3NldEFkbWluLmdhbGxlcnkuZmlsZXMsXG5cdFx0cGF0aDogc3RhdGUuYXNzZXRBZG1pbi5nYWxsZXJ5LnBhdGggLy8gVGhlIGN1cnJlbnQgbG9jYXRpb24gcGF0aFxuXHR9XG59XG5cbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuXHRyZXR1cm4ge1xuXHRcdGFjdGlvbnM6IGJpbmRBY3Rpb25DcmVhdG9ycyhnYWxsZXJ5QWN0aW9ucywgZGlzcGF0Y2gpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoRWRpdG9yQ29udGFpbmVyKTtcbiIsImltcG9ydCAkIGZyb20gJ2pRdWVyeSc7XG5pbXBvcnQgaTE4biBmcm9tICdpMThuJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBSZWFjdENTU1RyYW5zaXRpb25Hcm91cCBmcm9tICdyZWFjdC1hZGRvbnMtY3NzLXRyYW5zaXRpb24tZ3JvdXAnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBSZWFjdFRlc3RVdGlscyBmcm9tICdyZWFjdC1hZGRvbnMtdGVzdC11dGlscyc7XG5pbXBvcnQgRHJvcHpvbmVDb21wb25lbnQgZnJvbSAnY29tcG9uZW50cy9kcm9wem9uZS9pbmRleCc7XG5pbXBvcnQgRmlsZUNvbXBvbmVudCBmcm9tICdjb21wb25lbnRzL2ZpbGUvaW5kZXgnO1xuaW1wb3J0IEJ1bGtBY3Rpb25zQ29tcG9uZW50IGZyb20gJ2NvbXBvbmVudHMvYnVsay1hY3Rpb25zL2luZGV4JztcbmltcG9ydCBTaWx2ZXJTdHJpcGVDb21wb25lbnQgZnJvbSAnc2lsdmVyc3RyaXBlLWNvbXBvbmVudCc7XG5pbXBvcnQgQ09OU1RBTlRTIGZyb20gJ2NvbnN0YW50cy9pbmRleCc7XG5pbXBvcnQgKiBhcyBnYWxsZXJ5QWN0aW9ucyBmcm9tICdzdGF0ZS9nYWxsZXJ5L2FjdGlvbnMnO1xuaW1wb3J0ICogYXMgcXVldWVkRmlsZXNBY3Rpb25zIGZyb20gJ3N0YXRlL3F1ZXVlZC1maWxlcy9hY3Rpb25zJztcbmltcG9ydCBGb3JtQWN0aW9uIGZyb20gJ2NvbXBvbmVudHMvZm9ybS1hY3Rpb24vaW5kZXgnO1xuXG5mdW5jdGlvbiBnZXRDb21wYXJhdG9yKGZpZWxkLCBkaXJlY3Rpb24pIHtcblx0cmV0dXJuIChhLCBiKSA9PiB7XG5cdFx0Y29uc3QgZmllbGRBID0gYVtmaWVsZF0udG9Mb3dlckNhc2UoKTtcblx0XHRjb25zdCBmaWVsZEIgPSBiW2ZpZWxkXS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2FzYycpIHtcblx0XHRcdGlmIChmaWVsZEEgPCBmaWVsZEIpIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZmllbGRBID4gZmllbGRCKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZmllbGRBID4gZmllbGRCKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZpZWxkQSA8IGZpZWxkQikge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gMDtcblx0fTtcbn1cblxuZXhwb3J0IGNsYXNzIEdhbGxlcnlDb250YWluZXIgZXh0ZW5kcyBTaWx2ZXJTdHJpcGVDb21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5zb3J0ID0gJ25hbWUnO1xuXHRcdHRoaXMuZGlyZWN0aW9uID0gJ2FzYyc7XG5cblx0XHR0aGlzLnNvcnRlcnMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdGZpZWxkOiAndGl0bGUnLFxuXHRcdFx0XHRkaXJlY3Rpb246ICdhc2MnLFxuXHRcdFx0XHRsYWJlbDogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRklMVEVSX1RJVExFX0FTQycpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRmaWVsZDogJ3RpdGxlJyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnZGVzYycsXG5cdFx0XHRcdGxhYmVsOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5GSUxURVJfVElUTEVfREVTQycpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRmaWVsZDogJ2NyZWF0ZWQnLFxuXHRcdFx0XHRkaXJlY3Rpb246ICdkZXNjJyxcblx0XHRcdFx0bGFiZWw6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkZJTFRFUl9EQVRFX0RFU0MnKVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0ZmllbGQ6ICdjcmVhdGVkJyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnYXNjJyxcblx0XHRcdFx0bGFiZWw6IGkxOG4uX3QoJ0Fzc2V0R2FsbGVyeUZpZWxkLkZJTFRFUl9EQVRFX0FTQycpXG5cdFx0XHR9XG5cdFx0XTtcblxuXHRcdHRoaXMuaGFuZGxlRm9sZGVyQWN0aXZhdGUgPSB0aGlzLmhhbmRsZUZvbGRlckFjdGl2YXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVGaWxlQWN0aXZhdGUgPSB0aGlzLmhhbmRsZUZpbGVBY3RpdmF0ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlVG9nZ2xlU2VsZWN0ID0gdGhpcy5oYW5kbGVUb2dnbGVTZWxlY3QuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUFkZGVkRmlsZSA9IHRoaXMuaGFuZGxlQWRkZWRGaWxlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVDYW5jZWxVcGxvYWQgPSB0aGlzLmhhbmRsZUNhbmNlbFVwbG9hZC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlUmVtb3ZlRXJyb3JlZFVwbG9hZCA9IHRoaXMuaGFuZGxlUmVtb3ZlRXJyb3JlZFVwbG9hZC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlVXBsb2FkUHJvZ3Jlc3MgPSB0aGlzLmhhbmRsZVVwbG9hZFByb2dyZXNzLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVTZW5kaW5nID0gdGhpcy5oYW5kbGVTZW5kaW5nLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVJdGVtRGVsZXRlID0gdGhpcy5oYW5kbGVJdGVtRGVsZXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVCYWNrQ2xpY2sgPSB0aGlzLmhhbmRsZUJhY2tDbGljay5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlTW9yZUNsaWNrID0gdGhpcy5oYW5kbGVNb3JlQ2xpY2suYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZVNvcnQgPSB0aGlzLmhhbmRsZVNvcnQuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZVN1Y2Nlc3NmdWxVcGxvYWQgPSB0aGlzLmhhbmRsZVN1Y2Nlc3NmdWxVcGxvYWQuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUZhaWxlZFVwbG9hZCA9IHRoaXMuaGFuZGxlRmFpbGVkVXBsb2FkLmJpbmQodGhpcyk7XG5cdH1cblxuXHRjb21wb25lbnRXaWxsVXBkYXRlKCkge1xuXHRcdGxldCAkc2VsZWN0ID0gJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkuZmluZCgnLmdhbGxlcnlfX3NvcnQgLmRyb3Bkb3duJyk7XG5cblx0XHQkc2VsZWN0Lm9mZignY2hhbmdlJyk7XG5cdH1cblxuXHRjb21wb25lbnREaWRVcGRhdGUoKSB7XG5cdFx0bGV0ICRzZWxlY3QgPSAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKCcuZ2FsbGVyeV9fc29ydCAuZHJvcGRvd24nKTtcblxuXHRcdC8vIFdlIG9wdC1vdXQgb2YgbGV0dGluZyB0aGUgQ01TIGhhbmRsZSBDaG9zZW4gYmVjYXVzZSBpdCBkb2Vzbid0IHJlLWFwcGx5IHRoZSBiZWhhdmlvdXIgY29ycmVjdGx5LlxuXHRcdC8vIFNvIGFmdGVyIHRoZSBnYWxsZXJ5IGhhcyBiZWVuIHJlbmRlcmVkIHdlIGFwcGx5IENob3Nlbi5cblx0XHQkc2VsZWN0LmNob3Nlbih7XG5cdFx0XHQnYWxsb3dfc2luZ2xlX2Rlc2VsZWN0JzogdHJ1ZSxcblx0XHRcdCdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnOiAyMFxuXHRcdH0pO1xuXG5cdFx0Ly9DaG9zZW4gc3RvcHMgdGhlIGNoYW5nZSBldmVudCBmcm9tIHJlYWNoaW5nIFJlYWN0IHNvIHdlIGhhdmUgdG8gc2ltdWxhdGUgYSBjbGljay5cblx0XHQkc2VsZWN0Lm9uKCdjaGFuZ2UnLCAoKSA9PiBSZWFjdFRlc3RVdGlscy5TaW11bGF0ZS5jbGljaygkc2VsZWN0LmZpbmQoJzpzZWxlY3RlZCcpWzBdKSk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlciBmb3Igd2hlbiB0aGUgdXNlciBjaGFuZ2VzIHRoZSBzb3J0IG9yZGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0gb2JqZWN0IGV2ZW50IC0gQ2xpY2sgZXZlbnQuXG5cdCAqL1xuXHRoYW5kbGVTb3J0KGV2ZW50KSB7XG5cdFx0Y29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0O1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5xdWV1ZWRGaWxlcy5wdXJnZVVwbG9hZFF1ZXVlKCk7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLmdhbGxlcnkuc29ydEZpbGVzKGdldENvbXBhcmF0b3IoZGF0YS5maWVsZCwgZGF0YS5kaXJlY3Rpb24pKTtcblx0fVxuXG5cdGdldE5vSXRlbXNOb3RpY2UoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuZ2FsbGVyeS5jb3VudCA8IDEgJiYgdGhpcy5wcm9wcy5xdWV1ZWRGaWxlcy5pdGVtcy5sZW5ndGggPCAxKSB7XG5cdFx0XHRyZXR1cm4gPHAgY2xhc3NOYW1lPVwiZ2FsbGVyeV9fbm8taXRlbS1ub3RpY2VcIj57aTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuTk9JVEVNU0ZPVU5EJyl9PC9wPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGdldEJhY2tCdXR0b24oKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuZ2FsbGVyeS5wYXJlbnRGb2xkZXJJRCAhPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIDxidXR0b25cblx0XHRcdFx0Y2xhc3NOYW1lPSdnYWxsZXJ5X19iYWNrIHNzLXVpLWJ1dHRvbiB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCBmb250LWljb24tbGV2ZWwtdXAgbm8tdGV4dCdcblx0XHRcdFx0b25DbGljaz17dGhpcy5oYW5kbGVCYWNrQ2xpY2t9XG5cdFx0XHRcdHJlZj1cImJhY2tCdXR0b25cIj48L2J1dHRvbj47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRCdWxrQWN0aW9uc0NvbXBvbmVudCgpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LnNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCAmJiB0aGlzLnByb3BzLmJhY2tlbmQuYnVsa0FjdGlvbnMpIHtcblx0XHRcdHJldHVybiA8QnVsa0FjdGlvbnNDb21wb25lbnRcblx0XHRcdFx0YmFja2VuZD17dGhpcy5wcm9wcy5iYWNrZW5kfVxuXHRcdFx0XHRrZXk9e3RoaXMucHJvcHMuZ2FsbGVyeS5zZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDB9IC8+XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRnZXRNb3JlQnV0dG9uKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmdhbGxlcnkuY291bnQgPiB0aGlzLnByb3BzLmdhbGxlcnkuZmlsZXMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gPGJ1dHRvblxuXHRcdFx0XHRjbGFzc05hbWU9XCJnYWxsZXJ5X19sb2FkX19tb3JlXCJcblx0XHRcdFx0b25DbGljaz17dGhpcy5oYW5kbGVNb3JlQ2xpY2t9PntpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5MT0FETU9SRScpfTwvYnV0dG9uPjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGhhbmRsZUNhbmNlbFVwbG9hZChmaWxlRGF0YSkge1xuXHRcdGZpbGVEYXRhLnhoci5hYm9ydCgpO1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5xdWV1ZWRGaWxlcy5yZW1vdmVRdWV1ZWRGaWxlKGZpbGVEYXRhLnF1ZXVlZEF0VGltZSk7XG5cdH1cblxuXHRoYW5kbGVSZW1vdmVFcnJvcmVkVXBsb2FkKGZpbGVEYXRhKSB7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLnF1ZXVlZEZpbGVzLnJlbW92ZVF1ZXVlZEZpbGUoZmlsZURhdGEucXVldWVkQXRUaW1lKTtcblx0fVxuXG5cdGhhbmRsZUFkZGVkRmlsZShkYXRhKSB7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLnF1ZXVlZEZpbGVzLmFkZFF1ZXVlZEZpbGUoZGF0YSk7XG5cdH1cblxuXHQvKipcblx0ICogVHJpZ2dlcmVkIGp1c3QgYmVmb3JlIHRoZSB4aHIgcmVxdWVzdCBpcyBzZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0gb2JqZWN0IGZpbGUgLSBGaWxlIGludGVyZmFjZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlXG5cdCAqIEBwYXJhbSBvYmplY3QgeGhyXG5cdCAqIEBwYXJhbSBvYmplY3QgZm9ybURhdGEgLSBGb3JtRGF0YSBpbnRlcmZhY2UuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRm9ybURhdGFcblx0ICovXG5cdGhhbmRsZVNlbmRpbmcoZmlsZSwgeGhyLCBmb3JtRGF0YSkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5xdWV1ZWRGaWxlcy51cGRhdGVRdWV1ZWRGaWxlKGZpbGUuX3F1ZXVlZEF0VGltZSwgeyB4aHIgfSk7XG5cdH1cblxuXHRoYW5kbGVVcGxvYWRQcm9ncmVzcyhmaWxlLCBwcm9ncmVzcywgYnl0ZXNTZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLnF1ZXVlZEZpbGVzLnVwZGF0ZVF1ZXVlZEZpbGUoZmlsZS5fcXVldWVkQXRUaW1lLCB7IHByb2dyZXNzIH0pO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IGRyb3B6b25lT3B0aW9ucyA9IHtcblx0XHRcdHVybDogJ2FkbWluL2Fzc2V0cy9FZGl0Rm9ybS9maWVsZC9VcGxvYWQvdXBsb2FkJywgLy8gSGFyZGNvZGVkIHBsYWNlaG9sZGVyIHVudGlsIHdlIGhhdmUgYSBiYWNrZW5kXG5cdFx0XHRwYXJhbU5hbWU6ICdVcGxvYWQnLFxuXHRcdFx0Y2xpY2thYmxlOiAnI3VwbG9hZC1idXR0b24nXG5cdFx0fTtcblxuXHRcdGNvbnN0IHNlY3VyaXR5SUQgPSAkKCc6aW5wdXRbbmFtZT1TZWN1cml0eUlEXScpLnZhbCgpO1xuXG5cdFx0Y29uc3QgY2FuRWRpdCA9IHRoaXMucHJvcHMuZ2FsbGVyeS5mb2xkZXJQZXJtaXNzaW9ucy5jYW5FZGl0O1xuXG5cdFx0Ly8gVE9ETyBNYWtlIFwiYWRkIGZvbGRlclwiIGFuZCBcInVwbG9hZFwiIGJ1dHRvbnMgY29uZGl0aW9uYWwgb24gcGVybWlzc2lvbnNcblx0XHRyZXR1cm4gPGRpdj5cblx0XHRcdHt0aGlzLmdldEJhY2tCdXR0b24oKX1cblx0XHRcdDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cCB0cmFuc2l0aW9uTmFtZT1cImdhbGxlcnlfX2J1bGstYWN0aW9uc1wiIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9e0NPTlNUQU5UUy5DU1NfVFJBTlNJVElPTl9USU1FfSB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXtDT05TVEFOVFMuQ1NTX1RSQU5TSVRJT05fVElNRX0+XG5cdFx0XHRcdHt0aGlzLmdldEJ1bGtBY3Rpb25zQ29tcG9uZW50KCl9XG5cdFx0XHQ8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJnYWxsZXJ5X19zb3J0IGZpZWxkaG9sZGVyLXNtYWxsXCI+XG5cdFx0XHRcdDxzZWxlY3QgY2xhc3NOYW1lPVwiZHJvcGRvd24gbm8tY2hhbmdlLXRyYWNrIG5vLWNoem5cIiB0YWJJbmRleD1cIjBcIiBzdHlsZT17e3dpZHRoOiAnMTYwcHgnfX0+XG5cdFx0XHRcdFx0e3RoaXMuc29ydGVycy5tYXAoKHNvcnRlciwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDxvcHRpb25cblx0XHRcdFx0XHRcdFx0XHRrZXk9e2l9XG5cdFx0XHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5oYW5kbGVTb3J0fVxuXHRcdFx0XHRcdFx0XHRcdGRhdGEtZmllbGQ9e3NvcnRlci5maWVsZH1cblx0XHRcdFx0XHRcdFx0XHRkYXRhLWRpcmVjdGlvbj17c29ydGVyLmRpcmVjdGlvbn0+e3NvcnRlci5sYWJlbH08L29wdGlvbj47XG5cdFx0XHRcdFx0fSl9XG5cdFx0XHRcdDwvc2VsZWN0PlxuXHRcdFx0PC9kaXY+XG5cblx0XHRcdDxGb3JtQWN0aW9uXG5cdFx0XHRcdGlkPVwiYWRkLWZvbGRlci1idXR0b25cIlxuXHRcdFx0XHRsYWJlbD17aTE4bi5fdChcIkFzc2V0R2FsbGVyeUZpZWxkLkFERF9GT0xERVJfQlVUVE9OXCIpfVxuXHRcdFx0XHRpY29uPVwiZm9sZGVyLWFkZFwiXG5cdFx0XHRcdGV4dHJhQ2xhc3M9XCJnYWxsZXJ5X191cGxvYWRcIlxuXHRcdFx0XHRkaXNhYmxlZD17IWNhbkVkaXR9IC8+XG5cblx0XHRcdDxGb3JtQWN0aW9uXG5cdFx0XHRcdGlkPVwidXBsb2FkLWJ1dHRvblwiXG5cdFx0XHRcdGxhYmVsPXtpMThuLl90KFwiQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfVVBMT0FEXCIpfVxuXHRcdFx0XHRpY29uPVwidXBsb2FkXCJcblx0XHRcdFx0ZXh0cmFDbGFzcz1cImdhbGxlcnlfX3VwbG9hZFwiXG5cdFx0XHRcdGRpc2FibGVkPXshY2FuRWRpdH0gLz5cblxuXHRcdFx0PERyb3B6b25lQ29tcG9uZW50XG5cdFx0XHRcdGNhblVwbG9hZD17Y2FuRWRpdH1cblx0XHRcdFx0aGFuZGxlQWRkZWRGaWxlPXt0aGlzLmhhbmRsZUFkZGVkRmlsZX1cblx0XHRcdFx0aGFuZGxlRXJyb3I9e3RoaXMuaGFuZGxlRmFpbGVkVXBsb2FkfVxuXHRcdFx0XHRoYW5kbGVTdWNjZXNzPXt0aGlzLmhhbmRsZVN1Y2Nlc3NmdWxVcGxvYWR9XG5cdFx0XHRcdGhhbmRsZVNlbmRpbmc9e3RoaXMuaGFuZGxlU2VuZGluZ31cblx0XHRcdFx0aGFuZGxlVXBsb2FkUHJvZ3Jlc3M9e3RoaXMuaGFuZGxlVXBsb2FkUHJvZ3Jlc3N9XG5cdFx0XHRcdGZvbGRlcklEPXt0aGlzLnByb3BzLmdhbGxlcnkuZm9sZGVySUR9XG5cdFx0XHRcdG9wdGlvbnM9e2Ryb3B6b25lT3B0aW9uc31cblx0XHRcdFx0c2VjdXJpdHlJRD17c2VjdXJpdHlJRH1cblx0XHRcdFx0dXBsb2FkQnV0dG9uPXtmYWxzZX0+XG5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2ZvbGRlcnMnPlxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLmdhbGxlcnkuZmlsZXMubWFwKChmaWxlLCBpKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoZmlsZS50eXBlID09PSAnZm9sZGVyJykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gPEZpbGVDb21wb25lbnRcblx0XHRcdFx0XHRcdFx0XHRrZXk9e2l9XG5cdFx0XHRcdFx0XHRcdFx0aXRlbT17ZmlsZX1cblx0XHRcdFx0XHRcdFx0XHRzZWxlY3RlZD17dGhpcy5pdGVtSXNTZWxlY3RlZChmaWxlLmlkKX1cblx0XHRcdFx0XHRcdFx0XHRoYW5kbGVEZWxldGU9e3RoaXMuaGFuZGxlSXRlbURlbGV0ZX1cblx0XHRcdFx0XHRcdFx0XHRoYW5kbGVUb2dnbGVTZWxlY3Q9e3RoaXMuaGFuZGxlVG9nZ2xlU2VsZWN0fVxuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZUFjdGl2YXRlPXt0aGlzLmhhbmRsZUZvbGRlckFjdGl2YXRlfSAvPjtcblx0XHRcdFx0XHRcdH19KX1cblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2dhbGxlcnlfX2ZpbGVzJz5cblx0XHRcdFx0XHR7dGhpcy5wcm9wcy5xdWV1ZWRGaWxlcy5pdGVtcy5tYXAoKGZpbGUsIGkpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiA8RmlsZUNvbXBvbmVudFxuXHRcdFx0XHRcdFx0XHRrZXk9e2BxdWV1ZWRfZmlsZV8ke2l9YH1cblx0XHRcdFx0XHRcdFx0aXRlbT17ZmlsZX1cblx0XHRcdFx0XHRcdFx0c2VsZWN0ZWQ9e3RoaXMuaXRlbUlzU2VsZWN0ZWQoZmlsZS5pZCl9XG5cdFx0XHRcdFx0XHRcdGhhbmRsZURlbGV0ZT17dGhpcy5oYW5kbGVJdGVtRGVsZXRlfVxuXHRcdFx0XHRcdFx0XHRoYW5kbGVUb2dnbGVTZWxlY3Q9e3RoaXMuaGFuZGxlVG9nZ2xlU2VsZWN0fVxuXHRcdFx0XHRcdFx0XHRoYW5kbGVBY3RpdmF0ZT17dGhpcy5oYW5kbGVGaWxlQWN0aXZhdGV9XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNhbmNlbFVwbG9hZD17dGhpcy5oYW5kbGVDYW5jZWxVcGxvYWR9XG5cdFx0XHRcdFx0XHRcdGhhbmRsZVJlbW92ZUVycm9yZWRVcGxvYWQ9e3RoaXMuaGFuZGxlUmVtb3ZlRXJyb3JlZFVwbG9hZH1cblx0XHRcdFx0XHRcdFx0bWVzc2FnZXM9e2ZpbGUubWVzc2FnZXN9XG5cdFx0XHRcdFx0XHRcdHVwbG9hZGluZz17dHJ1ZX0gLz47XG5cdFx0XHRcdFx0fSl9XG5cdFx0XHRcdFx0e3RoaXMucHJvcHMuZ2FsbGVyeS5maWxlcy5tYXAoKGZpbGUsIGkpID0+IHtcblx0XHRcdFx0XHRcdGlmIChmaWxlLnR5cGUgIT09ICdmb2xkZXInKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiA8RmlsZUNvbXBvbmVudFxuXHRcdFx0XHRcdFx0XHRcdGtleT17YGZpbGVfJHtpfWB9XG5cdFx0XHRcdFx0XHRcdFx0aXRlbT17ZmlsZX1cblx0XHRcdFx0XHRcdFx0XHRzZWxlY3RlZD17dGhpcy5pdGVtSXNTZWxlY3RlZChmaWxlLmlkKX1cblx0XHRcdFx0XHRcdFx0XHRoYW5kbGVEZWxldGU9e3RoaXMuaGFuZGxlSXRlbURlbGV0ZX1cblx0XHRcdFx0XHRcdFx0XHRoYW5kbGVUb2dnbGVTZWxlY3Q9e3RoaXMuaGFuZGxlVG9nZ2xlU2VsZWN0fVxuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZUFjdGl2YXRlPXt0aGlzLmhhbmRsZUZpbGVBY3RpdmF0ZX0gLz47XG5cdFx0XHRcdFx0XHR9fSl9XG5cdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdHt0aGlzLmdldE5vSXRlbXNOb3RpY2UoKX1cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImdhbGxlcnlfX2xvYWRcIj5cblx0XHRcdFx0XHR7dGhpcy5nZXRNb3JlQnV0dG9uKCl9XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9Ecm9wem9uZUNvbXBvbmVudD5cblx0XHQ8L2Rpdj47XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBzdWNjZXNzZnVsIGZpbGUgdXBsb2Fkcy5cblx0ICpcblx0ICogQHBhcmFtIG9iamVjdCBmaWxlIC0gRmlsZSBpbnRlcmZhY2UuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVxuXHQgKi9cblx0aGFuZGxlU3VjY2Vzc2Z1bFVwbG9hZChmaWxlKSB7XG5cdFx0Y29uc3QganNvbiA9IEpTT04ucGFyc2UoZmlsZS54aHIucmVzcG9uc2UpO1xuXG5cdFx0Ly8gU2lsdmVyU3RyaXBlIHNlbmQgYmFjayBhIHN1Y2Nlc3MgY29kZSB3aXRoIGFuIGVycm9yIG1lc3NhZ2Ugc29tZXRpbWVzLi4uXG5cdFx0aWYgKHR5cGVvZiBqc29uWzBdLmVycm9yICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0dGhpcy5oYW5kbGVGYWlsZWRVcGxvYWQoZmlsZSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb25zLnF1ZXVlZEZpbGVzLnJlbW92ZVF1ZXVlZEZpbGUoZmlsZS5fcXVldWVkQXRUaW1lKTtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuZ2FsbGVyeS5hZGRGaWxlcyhqc29uLCB0aGlzLnByb3BzLmdhbGxlcnkuY291bnQgKyAxKTtcblx0fVxuXG5cdGhhbmRsZUZhaWxlZFVwbG9hZChmaWxlLCBlcnJvck1lc3NhZ2UpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMucXVldWVkRmlsZXMuZmFpbFVwbG9hZChmaWxlLl9xdWV1ZWRBdFRpbWUpO1xuXHR9XG5cblx0aGFuZGxlRW50ZXJSb3V0ZShjdHgsIG5leHQpIHtcblx0XHR2YXIgdmlld2luZ0ZvbGRlciA9IGZhbHNlO1xuXG5cdFx0Y29uc3QgZm9sZGVySUQgPSBjdHgucGFyYW1zLmlkIHx8IDA7XG5cdFx0Y29uc3QgZm9sZGVyUGF0aCA9IENPTlNUQU5UUy5GT0xERVJfUk9VVEUucmVwbGFjZSgnOmlkPycsIGZvbGRlcklEKTtcblxuXHRcdGlmIChjdHgucGFyYW1zLmFjdGlvbiA9PT0gJ3Nob3cnICYmIHR5cGVvZiBjdHgucGFyYW1zLmlkICE9PSAwKSB7XG5cdFx0XHR2aWV3aW5nRm9sZGVyID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuZ2FsbGVyeS5zZXRWaWV3aW5nRm9sZGVyKHZpZXdpbmdGb2xkZXIpO1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5nYWxsZXJ5LmRlc2VsZWN0RmlsZXMoKTtcblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuZ2FsbGVyeS5yZW1vdmVGaWxlcygpO1xuXHRcdHRoaXMucHJvcHMuYWN0aW9ucy5nYWxsZXJ5LnNldFBhdGgoZm9sZGVyUGF0aCk7XG5cblx0XHR0aGlzLnByb3BzLmJhY2tlbmQuZ2V0RmlsZXNCeVBhcmVudElEKGZvbGRlcklEKTtcblxuXHRcdG5leHQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIGRlbGV0aW5nIGEgZmlsZSBvciBmb2xkZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBvYmplY3QgaXRlbSAtIFRoZSBmaWxlIG9yIGZvbGRlciB0byBkZWxldGUuXG5cdCAqL1xuXHRoYW5kbGVJdGVtRGVsZXRlKGV2ZW50LCBpdGVtKSB7XG5cdFx0aWYgKGNvbmZpcm0oaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuQ09ORklSTURFTEVURScpKSkge1xuXHRcdFx0dGhpcy5wcm9wcy5iYWNrZW5kLmRlbGV0ZShpdGVtLmlkKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIGEgZmlsZSBvciBmb2xkZXIgaXMgY3VycmVudGx5IHNlbGVjdGVkLlxuXHQgKlxuXHQgKiBAcGFyYW0gbnVtYmVyIGlkIC0gVGhlIGlkIG9mIHRoZSBmaWxlIG9yIGZvbGRlciB0byBjaGVjay5cblx0ICogQHJldHVybiBib29sZWFuXG5cdCAqL1xuXHRpdGVtSXNTZWxlY3RlZChpZCkge1xuXHRcdHJldHVybiB0aGlzLnByb3BzLmdhbGxlcnkuc2VsZWN0ZWRGaWxlcy5pbmRleE9mKGlkKSA+IC0xO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgYSB1c2VyIGRyaWxsaW5nIGRvd24gaW50byBhIGZvbGRlci5cblx0ICpcblx0ICogQHBhcmFtIG9iamVjdCBldmVudCAtIEV2ZW50IG9iamVjdC5cblx0ICogQHBhcmFtIG9iamVjdCBmb2xkZXIgLSBUaGUgZm9sZGVyIHRoYXQncyBiZWluZyBhY3RpdmF0ZWQuXG5cdCAqL1xuXHRoYW5kbGVGb2xkZXJBY3RpdmF0ZShldmVudCwgZm9sZGVyKSB7XG5cdFx0d2luZG93LnNzLnJvdXRlci5zaG93KENPTlNUQU5UUy5GT0xERVJfUk9VVEUucmVwbGFjZSgnOmlkPycsIGZvbGRlci5pZCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgYSB1c2VyIGFjdGl2YXRpbmcgdGhlIGZpbGUgZWRpdG9yLlxuXHQgKlxuXHQgKiBAcGFyYW0gb2JqZWN0IGV2ZW50IC0gRXZlbnQgb2JqZWN0LlxuXHQgKiBAcGFyYW0gb2JqZWN0IGZpbGUgLSBUaGUgZmlsZSB0aGF0J3MgYmVpbmcgYWN0aXZhdGVkLlxuXHQgKi9cblx0aGFuZGxlRmlsZUFjdGl2YXRlKGV2ZW50LCBmaWxlKSB7XG5cdFx0Ly8gRGlzYWJsZSBmaWxlIGVkaXRpbmcgaWYgdGhlIGZpbGUgaGFzIG5vdCBmaW5pc2hlZCB1cGxvYWRpbmdcblx0XHQvLyBvciB0aGUgdXBsb2FkIGhhcyBlcnJvcmVkLlxuXHRcdGlmIChmaWxlLmNyZWF0ZWQgPT09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLnByb3BzLmFjdGlvbnMuZ2FsbGVyeS5zZXRFZGl0aW5nKGZpbGUpO1xuXHRcdHdpbmRvdy5zcy5yb3V0ZXIuc2hvdyhDT05TVEFOVFMuRURJVElOR19ST1VURS5yZXBsYWNlKCc6aWQnLCBmaWxlLmlkKSk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyB0aGUgdXNlciB0b2dnbGluZyB0aGUgc2VsZWN0ZWQvZGVzZWxlY3RlZCBzdGF0ZSBvZiBhIGZpbGUgb3IgZm9sZGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0gb2JqZWN0IGV2ZW50IC0gRXZlbnQgb2JqZWN0LlxuXHQgKiBAcGFyYW0gb2JqZWN0IGl0ZW0gLSBUaGUgaXRlbSBiZWluZyBzZWxlY3RlZC9kZXNlbGVjdGVkXG5cdCAqL1xuXHRoYW5kbGVUb2dnbGVTZWxlY3QoZXZlbnQsIGl0ZW0pIHtcblx0XHRpZiAodGhpcy5wcm9wcy5nYWxsZXJ5LnNlbGVjdGVkRmlsZXMuaW5kZXhPZihpdGVtLmlkKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHJvcHMuYWN0aW9ucy5nYWxsZXJ5LnNlbGVjdEZpbGVzKFtpdGVtLmlkXSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucHJvcHMuYWN0aW9ucy5nYWxsZXJ5LmRlc2VsZWN0RmlsZXMoW2l0ZW0uaWRdKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVNb3JlQ2xpY2soZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRoaXMucHJvcHMuYmFja2VuZC5tb3JlKCk7XG5cdH1cblxuXHRoYW5kbGVCYWNrQ2xpY2soZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHdpbmRvdy5zcy5yb3V0ZXIuc2hvdyhDT05TVEFOVFMuRk9MREVSX1JPVVRFLnJlcGxhY2UoJzppZD8nLCB0aGlzLnByb3BzLmdhbGxlcnkucGFyZW50Rm9sZGVySUQpKTtcblx0fVxufVxuXG5HYWxsZXJ5Q29udGFpbmVyLnByb3BUeXBlcyA9IHtcblx0YmFja2VuZDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXHRnYWxsZXJ5OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHRcdGZvbGRlcklEOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcblx0fSksXG5cdHF1ZXVlZEZpbGVzOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHRcdGl0ZW1zOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZFxuXHR9KVxufTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdHJldHVybiB7XG5cdFx0Z2FsbGVyeTogc3RhdGUuYXNzZXRBZG1pbi5nYWxsZXJ5LFxuXHRcdHF1ZXVlZEZpbGVzOiBzdGF0ZS5hc3NldEFkbWluLnF1ZXVlZEZpbGVzXG5cdH1cbn1cblxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XG5cdHJldHVybiB7XG5cdFx0YWN0aW9uczoge1xuXHRcdFx0Z2FsbGVyeTogYmluZEFjdGlvbkNyZWF0b3JzKGdhbGxlcnlBY3Rpb25zLCBkaXNwYXRjaCksXG5cdFx0XHRxdWV1ZWRGaWxlczogYmluZEFjdGlvbkNyZWF0b3JzKHF1ZXVlZEZpbGVzQWN0aW9ucywgZGlzcGF0Y2gpXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEdhbGxlcnlDb250YWluZXIpO1xuIiwiLyoqXG4gKiBAZmlsZSBGYWN0b3J5IGZvciBjcmVhdGluZyBhIFJlZHV4IHN0b3JlLlxuICovXG5cbmltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgdGh1bmtNaWRkbGV3YXJlIGZyb20gJ3JlZHV4LXRodW5rJzsgLy8gVXNlZCBmb3IgaGFuZGxpbmcgYXN5bmMgc3RvcmUgdXBkYXRlcy5cbmltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAncmVkdXgtbG9nZ2VyJzsgLy8gTG9ncyBzdGF0ZSBjaGFuZ2VzIHRvIHRoZSBjb25zb2xlLiBVc2VmdWwgZm9yIGRlYnVnZ2luZy5cbmltcG9ydCByb290UmVkdWNlciBmcm9tICcuL3JlZHVjZXInO1xuXG4vKipcbiAqIEBmdW5jIGNyZWF0ZVN0b3JlV2l0aE1pZGRsZXdhcmVcbiAqIEBwYXJhbSBmdW5jdGlvbiByb290UmVkdWNlclxuICogQHBhcmFtIG9iamVjdCBpbml0aWFsU3RhdGVcbiAqIEBkZXNjIENyZWF0ZXMgYSBSZWR1eCBzdG9yZSB3aXRoIHNvbWUgbWlkZGxld2FyZSBhcHBsaWVkLlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgY3JlYXRlU3RvcmVXaXRoTWlkZGxld2FyZSA9IGFwcGx5TWlkZGxld2FyZShcblx0dGh1bmtNaWRkbGV3YXJlLFxuXHRjcmVhdGVMb2dnZXIoKVxuKShjcmVhdGVTdG9yZSk7XG5cbi8qKlxuICogQGZ1bmMgY29uZmlndXJlU3RvcmVcbiAqIEBwYXJhbSBvYmplY3QgaW5pdGlhbFN0YXRlXG4gKiBAcmV0dXJuIG9iamVjdCAtIEEgUmVkdXggc3RvcmUgdGhhdCBsZXRzIHlvdSByZWFkIHRoZSBzdGF0ZSwgZGlzcGF0Y2ggYWN0aW9ucyBhbmQgc3Vic2NyaWJlIHRvIGNoYW5nZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbmZpZ3VyZVN0b3JlKGluaXRpYWxTdGF0ZSA9IHt9KSB7XG5cdGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmVXaXRoTWlkZGxld2FyZShyb290UmVkdWNlciwgaW5pdGlhbFN0YXRlKTtcblxuXHRyZXR1cm4gc3RvcmU7XG59OyIsImV4cG9ydCBjb25zdCBHQUxMRVJZID0ge1xuICAgIEFERF9GSUxFUzogJ0FERF9GSUxFUycsXG4gICAgREVTRUxFQ1RfRklMRVM6ICdERVNFTEVDVF9GSUxFUycsXG4gICAgUkVNT1ZFX0ZJTEVTOiAnUkVNT1ZFX0ZJTEVTJyxcbiAgICBTRUxFQ1RfRklMRVM6ICdTRUxFQ1RfRklMRVMnLFxuICAgIFNFVF9FRElUSU5HOiAnU0VUX0VESVRJTkcnLFxuICAgIFNFVF9FRElUT1JfRklFTERTOiAnU0VUX0VESVRPUl9GSUVMRFMnLFxuICAgIFNFVF9GT0xERVJfSUQ6ICdTRVRfRk9MREVSX0lEJyxcbiAgICBTRVRfRk9MREVSX1BFUk1JU1NJT05TOiAnU0VUX0ZPTERFUl9QRVJNSVNTSU9OUycsXG4gICAgU0VUX1BBUkVOVF9GT0xERVJfSUQ6ICdTRVRfUEFSRU5UX0ZPTERFUl9JRCcsXG4gICAgU0VUX1BBVEg6ICdTRVRfUEFUSCcsXG4gICAgU0VUX1ZJRVdJTkdfRk9MREVSOiAnU0VUX1ZJRVdJTkdfRk9MREVSJyxcbiAgICBTT1JUX0ZJTEVTOiAnU09SVF9GSUxFUycsXG4gICAgVVBEQVRFX0VESVRPUl9GSUVMRDogJ1VQREFURV9FRElUT1JfRklFTEQnLFxuICAgIFVQREFURV9GSUxFOiAnVVBEQVRFX0ZJTEUnXG59XG4iLCJpbXBvcnQgeyBHQUxMRVJZIH0gZnJvbSAnLi9hY3Rpb24tdHlwZXMnO1xuaW1wb3J0IENPTlNUQU5UUyBmcm9tICdjb25zdGFudHMvaW5kZXgnO1xuXG4vKipcbiAqIEFkZHMgZmlsZXMgdG8gc3RhdGUuXG4gKlxuICogQHBhcmFtIGFycmF5IGZpbGVzIC0gQXJyYXkgb2YgZmlsZSBvYmplY3RzLlxuICogQHBhcmFtIG51bWJlciBbY291bnRdIC0gVGhlIG51bWJlciBvZiBmaWxlcyBpbiB0aGUgY3VycmVudCB2aWV3LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRmlsZXMoZmlsZXMsIGNvdW50KSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoICh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLkFERF9GSUxFUyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgZmlsZXMsIGNvdW50IH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgZmlsZXMgZnJvbSB0aGUgc3RhdGUuIElmIG5vIHBhcmFtIGlzIHBhc3NlZCBhbGwgZmlsZXMgYXJlIHJlbW92ZWRcbiAqXG4gKiBAcGFyYW0gYXJyYXkgaWRzIC0gQXJyYXkgb2YgZmlsZSBpZHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGaWxlcyhpZHMpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2ggKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuUkVNT1ZFX0ZJTEVTLFxuICAgICAgICAgICAgcGF5bG9hZDogeyBpZHMgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogVXBkYXRlcyBhIGZpbGUgd2l0aCBuZXcgZGF0YS5cbiAqXG4gKiBAcGFyYW0gbnVtYmVyIGlkIC0gVGhlIGlkIG9mIHRoZSBmaWxlIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSBvYmplY3QgdXBkYXRlcyAtIFRoZSBuZXcgdmFsdWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRmlsZShpZCwgdXBkYXRlcykge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlVQREFURV9GSUxFLFxuICAgICAgICAgICAgcGF5bG9hZDogeyBpZCwgdXBkYXRlcyB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTZWxlY3RzIGZpbGVzLiBJZiBubyBwYXJhbSBpcyBwYXNzZWQgYWxsIGZpbGVzIGFyZSBzZWxlY3RlZC5cbiAqXG4gKiBAcGFyYW0gQXJyYXkgaWRzIC0gQXJyYXkgb2YgZmlsZSBpZHMgdG8gc2VsZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0RmlsZXMoaWRzID0gbnVsbCkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlNFTEVDVF9GSUxFUyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgaWRzIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIERlc2VsZWN0cyBmaWxlcy4gSWYgbm8gcGFyYW0gaXMgcGFzc2VkIGFsbCBmaWxlcyBhcmUgZGVzZWxlY3RlZC5cbiAqXG4gKiBAcGFyYW0gQXJyYXkgaWRzIC0gQXJyYXkgb2YgZmlsZSBpZHMgdG8gZGVzZWxlY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXNlbGVjdEZpbGVzKGlkcyA9IG51bGwpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5ERVNFTEVDVF9GSUxFUyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgaWRzIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFN0YXJ0cyBlZGl0aW5nIHRoZSBnaXZlbiBmaWxlIG9yIHN0b3BzIGVkaXRpbmcgaWYgZmFsc2UgaXMgZ2l2ZW4uXG4gKlxuICogQHBhcmFtIG9iamVjdHxib29sZWFuIGZpbGUgLSBUaGUgZmlsZSB0byBlZGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RWRpdGluZyhmaWxlKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuU0VUX0VESVRJTkcsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGZpbGUgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhdGUgb2YgdGhlIGZpZWxkcyBmb3IgdGhlIGVkaXRvciBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIG9iamVjdCBlZGl0b3JGaWVsZHMgLSB0aGUgY3VycmVudCBmaWVsZHMgaW4gdGhlIGVkaXRvciBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEVkaXRvckZpZWxkcyhlZGl0b3JGaWVsZHMgPSBbXSkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlNFVF9FRElUT1JfRklFTERTLFxuICAgICAgICAgICAgcGF5bG9hZDogeyBlZGl0b3JGaWVsZHMgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZmllbGQuXG4gKlxuICogQHBhcmFtIG9iamVjdCB1cGRhdGVzIC0gVGhlIHZhbHVlcyB0byB1cGRhdGUgdGhlIGVkaXRvciBmaWVsZCB3aXRoLlxuICogQHBhcmFtIHN0cmluZyB1cGRhdGVzLm5hbWUgLSBUaGUgZWRpdG9yIGZpZWxkIG5hbWUuXG4gKiBAcGFyYW0gc3RyaW5nIHVwZGF0ZXMudmFsdWUgLSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBmaWVsZC5cbiAqIEBwYXJhbSBzdHJpbmcgW3VwZGF0ZXMubGFiZWxdIC0gVGhlIGZpZWxkIGxhYmVsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRWRpdG9yRmllbGQodXBkYXRlcykge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlVQREFURV9FRElUT1JfRklFTEQsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IHVwZGF0ZXMgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogVXBkYXRlcyBwdXNoIHN0YXRlIChpbnZva2luZyBhbnkgcmVnaXN0ZXJlZCBwYWdlLmpzIGhhbmRsZXJzKSBhbmQgc2V0cyB0aGUgcm91dGUgaW4gc3RhdGUuXG4gKiBDb21wb25lbnRzIHdoaWNoIGRlZmluZSByb3V0ZXMgYXJlIHJlbmRlcmVkIGJhc2VkIG9uIHRoZSBgcm91dGVgIHZhbHVlIHN0b3JlZCBpbiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0gc3RyaW5nIHBhdGggLSBUaGUgcGF0aCBmb3IgcHVzaFN0YXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0UGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuU0VUX1BBVEgsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IHBhdGggfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU29ydHMgZmlsZXMgaW4gc29tZSBvcmRlci5cbiAqXG4gKiBAcGFyYW0gZnVuYyBjb21wYXJhdG9yIC0gVXNlZCB0byBkZXRlcm1pbmUgdGhlIHNvcnQgb3JkZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0RmlsZXMoY29tcGFyYXRvcikge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlNPUlRfRklMRVMsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGNvbXBhcmF0b3IgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU2V0cyB3ZXRoZXIgb3Igbm90IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBpbnNpZGUgYSBmb2xkZXIuXG4gKlxuICogQHBhcmFtIGJvb2xlYW4gdmlld2luZ0ZvbGRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Vmlld2luZ0ZvbGRlcih2aWV3aW5nRm9sZGVyKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEdBTExFUlkuU0VUX1ZJRVdJTkdfRk9MREVSLFxuICAgICAgICAgICAgcGF5bG9hZDogeyB2aWV3aW5nRm9sZGVyIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFNldHMgdGhlIHBhcmVudElEIGZvciB0aGUgY3VycmVudGx5IHZpZXdlZCBmb2xkZXIuXG4gKlxuICogQHBhcmFtIG51bWJlciBwYXJlbnRJRFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0UGFyZW50Rm9sZGVySWQocGFyZW50Rm9sZGVySUQpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5TRVRfUEFSRU5UX0ZPTERFUl9JRCxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgcGFyZW50Rm9sZGVySUQgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogU2V0cyB0aGUgSUQgZm9yIHRoZSBmb2xkZXIgY3VycmVudGx5IGJlaW5nIHZpZXdlZC5cbiAqXG4gKiBAcGFyYW0gbnVtYmVyIGZvbGRlcklEXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGb2xkZXJJZChmb2xkZXJJRCkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBHQUxMRVJZLlNFVF9GT0xERVJfSUQsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGZvbGRlcklEIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFNldHMgdGhlIHBlcm1pc3Npb25zIGZvciB0aGUgZm9sZGVyXG4gKlxuICogQHBhcmFtIG9iamVjdCBmb2xkZXJQZXJtaXNzaW9ucyBDb250YWlucyB0aGUgY2FuRWRpdCwgY2FuRGVsZXRlIHBlcm1pc3Npb25zIGFzIHNlbGYtbmFtZWQga2V5c1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Rm9sZGVyUGVybWlzc2lvbnMoZm9sZGVyUGVybWlzc2lvbnMpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogR0FMTEVSWS5TRVRfRk9MREVSX1BFUk1JU1NJT05TLFxuICAgICAgICAgICAgcGF5bG9hZDogZm9sZGVyUGVybWlzc2lvbnNcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IGRlZXBGcmVlemUgZnJvbSAnZGVlcC1mcmVlemUnO1xuaW1wb3J0IHsgR0FMTEVSWSB9IGZyb20gJy4vYWN0aW9uLXR5cGVzJztcbmltcG9ydCBDT05TVEFOVFMgZnJvbSAnY29uc3RhbnRzL2luZGV4JztcblxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xuICAgIGJ1bGtBY3Rpb25zOiB7XG4gICAgICAgIHBsYWNlaG9sZGVyOiBDT05TVEFOVFMuQlVMS19BQ1RJT05TX1BMQUNFSE9MREVSLFxuICAgICAgICBvcHRpb25zOiBDT05TVEFOVFMuQlVMS19BQ1RJT05TXG4gICAgfSxcbiAgICBjb3VudDogMCwgLy8gVGhlIG51bWJlciBvZiBmaWxlcyBpbiB0aGUgY3VycmVudCB2aWV3XG4gICAgZWRpdGluZzogbnVsbCwgLy8gVGhlIGZpbGUgYmVpbmcgZWRpdGVkXG4gICAgZWRpdG9yRmllbGRzOiBbXSwgLy8gVGhlIGlucHV0IGZpZWxkcyBmb3IgZWRpdGluZyBmaWxlcy4gSGFyZGNvZGVkIHVudGlsIGZvcm0gZmllbGQgc2NoZW1hIGlzIGltcGxlbWVudGVkLlxuICAgIGZpbGVzOiBbXSxcbiAgICBmb2xkZXJJRDogMCxcbiAgICBmb2N1czogZmFsc2UsXG4gICAgcGFyZW50Rm9sZGVySUQ6IG51bGwsXG4gICAgcGF0aDogbnVsbCwgLy8gVGhlIGN1cnJlbnQgbG9jYXRpb24gcGF0aCB0aGUgYXBwIGlzIG9uXG4gICAgc2VsZWN0ZWRGaWxlczogW10sXG4gICAgdmlld2luZ0ZvbGRlcjogZmFsc2UsXG4gICAgZm9sZGVyUGVybWlzc2lvbnM6IHtcbiAgICAgICAgY2FuRWRpdDogZmFsc2UsXG4gICAgICAgIGNhbkRlbGV0ZTogZmFsc2VcbiAgICB9XG59O1xuXG4vKipcbiAqIFJlZHVjZXIgZm9yIHRoZSBgYXNzZXRBZG1pbi5nYWxsZXJ5YCBzdGF0ZSBrZXkuXG4gKlxuICogQHBhcmFtIG9iamVjdCBzdGF0ZVxuICogQHBhcmFtIG9iamVjdCBhY3Rpb24gLSBUaGUgZGlzcGF0Y2hlZCBhY3Rpb24uXG4gKiBAcGFyYW0gc3RyaW5nIGFjdGlvbi50eXBlIC0gTmFtZSBvZiB0aGUgZGlzcGF0Y2hlZCBhY3Rpb24uXG4gKiBAcGFyYW0gb2JqZWN0IFthY3Rpb24ucGF5bG9hZF0gLSBPcHRpb25hbCBkYXRhIHBhc3NlZCB3aXRoIHRoZSBhY3Rpb24uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdhbGxlcnlSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcblxuICAgIHZhciBuZXh0U3RhdGU7XG5cbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLkFERF9GSUxFUzpcbiAgICAgICAgICAgIGxldCBuZXh0RmlsZXNTdGF0ZSA9IFtdOyAvLyBDbG9uZSB0aGUgc3RhdGUuZmlsZXMgYXJyYXlcblxuICAgICAgICAgICAgYWN0aW9uLnBheWxvYWQuZmlsZXMuZm9yRWFjaChwYXlsb2FkRmlsZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVJblN0YXRlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBzdGF0ZS5maWxlcy5mb3JFYWNoKHN0YXRlRmlsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGVhY2ggZmlsZSBnaXZlbiBpcyBhbHJlYWR5IGluIHRoZSBzdGF0ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGVGaWxlLmlkID09PSBwYXlsb2FkRmlsZS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZUluU3RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gT25seSBhZGQgdGhlIGZpbGUgaWYgaXQgaXNuJ3QgYWxyZWFkeSBpbiB0aGUgc3RhdGVcbiAgICAgICAgICAgICAgICBpZiAoIWZpbGVJblN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRGaWxlc1N0YXRlLnB1c2gocGF5bG9hZEZpbGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgY291bnQ6IHR5cGVvZiBhY3Rpb24ucGF5bG9hZC5jb3VudCAhPT0gJ3VuZGVmaW5lZCcgPyBhY3Rpb24ucGF5bG9hZC5jb3VudCA6IHN0YXRlLmNvdW50LFxuICAgICAgICAgICAgICAgIGZpbGVzOiBuZXh0RmlsZXNTdGF0ZS5jb25jYXQoc3RhdGUuZmlsZXMpXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlJFTU9WRV9GSUxFUzpcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYWN0aW9uLnBheWxvYWQuaWRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIC8vIE5vIHBhcmFtIHdhcyBwYXNzZWQsIHJlbW92ZSBldmVyeXRoaW5nLlxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgY291bnQ6IDAsIGZpbGVzOiBbXSB9KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGRlYWxpbmcgd2l0aCBhbiBhcnJheSBvZiBpZHNcbiAgICAgICAgICAgICAgICBuZXh0U3RhdGUgPSBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBzdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBhY3Rpb24ucGF5bG9hZC5pZHMuaW5kZXhPZihmaWxlLmlkKSA9PT0gLTEpLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgZmlsZXM6IHN0YXRlLmZpbGVzLmZpbHRlcihmaWxlID0+IGFjdGlvbi5wYXlsb2FkLmlkcy5pbmRleE9mKGZpbGUuaWQpID09PSAtMSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlVQREFURV9GSUxFOlxuICAgICAgICAgICAgbGV0IGZpbGVJbmRleCA9IHN0YXRlLmZpbGVzLm1hcChmaWxlID0+IGZpbGUuaWQpLmluZGV4T2YoYWN0aW9uLnBheWxvYWQuaWQpO1xuICAgICAgICAgICAgbGV0IHVwZGF0ZWRGaWxlID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZmlsZXNbZmlsZUluZGV4XSwgYWN0aW9uLnBheWxvYWQudXBkYXRlcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZmlsZXM6IHN0YXRlLmZpbGVzLm1hcChmaWxlID0+IGZpbGUuaWQgPT09IHVwZGF0ZWRGaWxlLmlkID8gdXBkYXRlZEZpbGUgOiBmaWxlKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5TRUxFQ1RfRklMRVM6XG4gICAgICAgICAgICBpZiAoYWN0aW9uLnBheWxvYWQuaWRzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gcGFyYW0gd2FzIHBhc3NlZCwgYWRkIGV2ZXJ5dGhpbmcgdGhhdCBpc24ndCBjdXJyZW50bHkgc2VsZWN0ZWQsIHRvIHRoZSBzZWxlY3RlZEZpbGVzIGFycmF5LlxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGaWxlczogc3RhdGUuc2VsZWN0ZWRGaWxlcy5jb25jYXQoc3RhdGUuZmlsZXMubWFwKGZpbGUgPT4gZmlsZS5pZCkuZmlsdGVyKGlkID0+IHN0YXRlLnNlbGVjdGVkRmlsZXMuaW5kZXhPZihpZCkgPT09IC0xKSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGRlYWxpbmcgd2l0aCBhbiBhcnJheSBpZiBpZHMgdG8gc2VsZWN0LlxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGaWxlczogc3RhdGUuc2VsZWN0ZWRGaWxlcy5jb25jYXQoYWN0aW9uLnBheWxvYWQuaWRzLmZpbHRlcihpZCA9PiBzdGF0ZS5zZWxlY3RlZEZpbGVzLmluZGV4T2YoaWQpID09PSAtMSkpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV4dFN0YXRlO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5ERVNFTEVDVF9GSUxFUzpcbiAgICAgICAgICAgIGlmIChhY3Rpb24ucGF5bG9hZC5pZHMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBwYXJhbSB3YXMgcGFzc2VkLCBkZXNlbGVjdCBldmVyeXRoaW5nLlxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgc2VsZWN0ZWRGaWxlczogW10gfSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBXZSdyZSBkZWFsaW5nIHdpdGggYW4gYXJyYXkgb2YgaWRzIHRvIGRlc2VsZWN0LlxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGaWxlczogc3RhdGUuc2VsZWN0ZWRGaWxlcy5maWx0ZXIoaWQgPT4gYWN0aW9uLnBheWxvYWQuaWRzLmluZGV4T2YoaWQpID09PSAtMSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFVF9FRElUSU5HOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBlZGl0aW5nOiBhY3Rpb24ucGF5bG9hZC5maWxlXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFVF9FRElUT1JfRklFTERTOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBlZGl0b3JGaWVsZHM6IGFjdGlvbi5wYXlsb2FkLmVkaXRvckZpZWxkc1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5VUERBVEVfRURJVE9SX0ZJRUxEOlxuICAgICAgICAgICAgbGV0IGZpZWxkSW5kZXggPSBzdGF0ZS5lZGl0b3JGaWVsZHMubWFwKGZpZWxkID0+IGZpZWxkLm5hbWUpLmluZGV4T2YoYWN0aW9uLnBheWxvYWQudXBkYXRlcy5uYW1lKSxcbiAgICAgICAgICAgICAgICB1cGRhdGVkRmllbGQgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5lZGl0b3JGaWVsZHNbZmllbGRJbmRleF0sIGFjdGlvbi5wYXlsb2FkLnVwZGF0ZXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGVkaXRvckZpZWxkczogc3RhdGUuZWRpdG9yRmllbGRzLm1hcChmaWVsZCA9PiBmaWVsZC5uYW1lID09PSB1cGRhdGVkRmllbGQubmFtZSA/IHVwZGF0ZWRGaWVsZCA6IGZpZWxkKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5TT1JUX0ZJTEVTOlxuICAgICAgICAgICAgbGV0IGZvbGRlcnMgPSBzdGF0ZS5maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLnR5cGUgPT09ICdmb2xkZXInKSxcbiAgICAgICAgICAgICAgICBmaWxlcyA9IHN0YXRlLmZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUudHlwZSAhPT0gJ2ZvbGRlcicpO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGZpbGVzOiBmb2xkZXJzLnNvcnQoYWN0aW9uLnBheWxvYWQuY29tcGFyYXRvcikuY29uY2F0KGZpbGVzLnNvcnQoYWN0aW9uLnBheWxvYWQuY29tcGFyYXRvcikpXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFVF9QQVRIOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBwYXRoOiBhY3Rpb24ucGF5bG9hZC5wYXRoXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFVF9WSUVXSU5HX0ZPTERFUjpcbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgdmlld2luZ0ZvbGRlcjogYWN0aW9uLnBheWxvYWQudmlld2luZ0ZvbGRlclxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5TRVRfUEFSRU5UX0ZPTERFUl9JRDpcbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgcGFyZW50Rm9sZGVySUQ6IGFjdGlvbi5wYXlsb2FkLnBhcmVudEZvbGRlcklEXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBHQUxMRVJZLlNFVF9GT0xERVJfSUQ6XG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGZvbGRlcklEOiBhY3Rpb24ucGF5bG9hZC5mb2xkZXJJRFxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgR0FMTEVSWS5TRVRfRk9MREVSX1BFUk1JU1NJT05TOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBmb2xkZXJQZXJtaXNzaW9uczoge1xuICAgICAgICAgICAgICAgICAgICBjYW5FZGl0OiBhY3Rpb24ucGF5bG9hZC5jYW5FZGl0LFxuICAgICAgICAgICAgICAgICAgICBjYW5EZWxldGU6IGFjdGlvbi5wYXlsb2FkLmNhbkRlbGV0ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICBBRERfUVVFVUVEX0ZJTEU6ICdBRERfUVVFVUVEX0ZJTEUnLFxuICAgIEZBSUxfVVBMT0FEOiAnRkFJTF9VUExPQUQnLFxuICAgIFBVUkdFX1VQTE9BRF9RVUVVRTogJ1BVUkdFX1VQTE9BRF9RVUVVRScsXG4gICAgUkVNT1ZFX1FVRVVFRF9GSUxFOiAnUkVNT1ZFX1FVRVVFRF9GSUxFJyxcbiAgICBTVUNDRUVEX1VQTE9BRDogJ1NVQ0NFRURfVVBMT0FEJyxcbiAgICBVUERBVEVfUVVFVUVEX0ZJTEU6ICdVUERBVEVfUVVFVUVEX0ZJTEUnXG59O1xuIiwiaW1wb3J0IEFDVElPTl9UWVBFUyBmcm9tICcuL2FjdGlvbi10eXBlcyc7XG5cbi8qKlxuICogQWRkcyBhIGZpbGUgd2hpY2ggaGFzIG5vdCBiZWVuIHBlcnNpc3RlZCB0byB0aGUgc2VydmVyIHlldC5cbiAqXG4gKiBAcGFyYW0gb2JqZWN0IGZpbGUgLSBGaWxlIGludGVyZmFjZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRRdWV1ZWRGaWxlKGZpbGUpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogQUNUSU9OX1RZUEVTLkFERF9RVUVVRURfRklMRSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgZmlsZSB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBVcGRhdGVzIGEgcXVldWVkIGZpbGUgaWYgaXQgZmFpbHMgdG8gdXBsb2FkLlxuICpcbiAqIEBwYXJhbSBudW1iZXIgcXVldWVkQXRUaW1lIC0gVGltZXN0YW1wIChEYXRlLm5vdygpKSB3aGVuIHRoZSBmaWxlIHdhcyBxdWV1ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmYWlsVXBsb2FkKHF1ZXVlZEF0VGltZSkge1xuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBBQ1RJT05fVFlQRVMuRkFJTF9VUExPQUQsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IHF1ZXVlZEF0VGltZSB9XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbi8qKlxuICogUHVyZ2VzIHRoZSB1cGxvYWQgcXVldWUuXG4gKiAgIC0gRmFpbGVkIHVwbG9hZHMgYXJlIHJlbW92ZWQuXG4gKiAgIC0gU3VjY2Vzc2Z1bCB1cGxvYWRzIGFyZSByZW1vdmVkLlxuICogICAtIFBlbmRpbmcgdXBsb2FkcyBhcmUgaWdub3JlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHB1cmdlVXBsb2FkUXVldWUoKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEFDVElPTl9UWVBFUy5QVVJHRV9VUExPQURfUVVFVUUsXG4gICAgICAgICAgICBwYXlsb2FkOiBudWxsXG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhIGZpbGUgZnJvbSB0aGUgcXVldWUuXG4gKlxuICogQHBhcmFtIG51bWJlciBxdWV1ZWRBdFRpbWUgLSBUaW1lc3RhbXAgKERhdGUubm93KCkpIHdoZW4gdGhlIGZpbGUgd2FzIHF1ZXVlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVF1ZXVlZEZpbGUocXVldWVkQXRUaW1lKSB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IEFDVElPTl9UWVBFUy5SRU1PVkVfUVVFVUVEX0ZJTEUsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IHF1ZXVlZEF0VGltZSB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBVcGRhdGVzIGEgcXVldWVkIGZpbGUgd2hlbiBpdCBzdWNjZXNzZnVsbHkgdXBsb2Fkcy5cbiAqXG4gKiBAcGFyYW0gbnVtYmVyIHF1ZXVlZEF0VGltZSAtIFRpbWVzdGFtcCAoRGF0ZS5ub3coKSkgd2hlbiB0aGUgZmlsZSB3YXMgcXVldWVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3VjY2VlZFVwbG9hZChxdWV1ZWRBdFRpbWUpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogQUNUSU9OX1RZUEVTLlNVQ0NFRURfVVBMT0FELFxuICAgICAgICAgICAgcGF5bG9hZDogeyBxdWV1ZWRBdFRpbWUgfVxuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG4vKipcbiAqIE92ZXJyaWRlIHRoZSB2YWx1ZXMgb2YgYSBjdXJyZW50bHkgcXVldWVkIGZpbGUuXG4gKlxuICogQHBhcmFtIG51bWJlciBxdWV1ZWRBdFRpbWUgLSBUaW1lc3RhbXAgKERhdGUubm93KCkpIHdoZW4gdGhlIGZpbGUgd2FzIHF1ZXVlZC5cbiAqIEBwYXJhbSBvYmplY3QgdXBkYXRlcyAtIFRoZSB2YWx1ZXMgdG8gdXBkYXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUXVldWVkRmlsZShxdWV1ZWRBdFRpbWUsIHVwZGF0ZXMpIHtcbiAgICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogQUNUSU9OX1RZUEVTLlVQREFURV9RVUVVRURfRklMRSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgcXVldWVkQXRUaW1lLCB1cGRhdGVzIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCBkZWVwRnJlZXplIGZyb20gJ2RlZXAtZnJlZXplJztcbmltcG9ydCBBQ1RJT05fVFlQRVMgZnJvbSAnLi9hY3Rpb24tdHlwZXMnO1xuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bic7XG5cbmZ1bmN0aW9uIGZpbGVGYWN0b3J5KCkge1xuICAgIHJldHVybiBkZWVwRnJlZXplKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogbnVsbCxcbiAgICAgICAgICAgICAgICB3aWR0aDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBiYXNlbmFtZTogbnVsbCxcbiAgICAgICAgY2FuRGVsZXRlOiBmYWxzZSxcbiAgICAgICAgY2FuRWRpdDogZmFsc2UsXG4gICAgICAgIGNhdGVnb3J5OiBudWxsLFxuICAgICAgICBjcmVhdGVkOiBudWxsLFxuICAgICAgICBleHRlbnNpb246IG51bGwsXG4gICAgICAgIGZpbGVuYW1lOiBudWxsLFxuICAgICAgICBpZDogMCxcbiAgICAgICAgbGFzdFVwZGF0ZWQ6IG51bGwsXG4gICAgICAgIG1lc3NhZ2VzOiBudWxsLFxuICAgICAgICBvd25lcjoge1xuICAgICAgICAgICAgaWQ6IDAsXG4gICAgICAgICAgICB0aXRsZTogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBwYXJlbnQ6IHtcbiAgICAgICAgICAgIGZpbGVuYW1lOiBudWxsLFxuICAgICAgICAgICAgaWQ6IDAsXG4gICAgICAgICAgICB0aXRsZTogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBxdWV1ZWRBdFRpbWU6IG51bGwsXG4gICAgICAgIHNpemU6IG51bGwsXG4gICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICB1cmw6IG51bGwsXG4gICAgICAgIHhocjogbnVsbFxuICAgIH0pO1xufVxuXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XG4gICAgaXRlbXM6IFtdXG59O1xuXG5mdW5jdGlvbiBxdWV1ZWRGaWxlc1JlZHVjZXIoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikge1xuXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuXG4gICAgICAgIGNhc2UgQUNUSU9OX1RZUEVTLkFERF9RVUVVRURfRklMRTpcbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgaXRlbXM6IHN0YXRlLml0ZW1zLmNvbmNhdChbT2JqZWN0LmFzc2lnbih7fSwgZmlsZUZhY3RvcnkoKSwgYWN0aW9uLnBheWxvYWQuZmlsZSldKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGNhc2UgQUNUSU9OX1RZUEVTLkZBSUxfVVBMT0FEOlxuICAgICAgICAgICAgLy8gQWRkIGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGZhaWxlZCBmaWxlLlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpdGVtczogc3RhdGUuaXRlbXMubWFwKChmaWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlLnF1ZXVlZEF0VGltZSA9PT0gYWN0aW9uLnBheWxvYWQucXVldWVkQXRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZmlsZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaTE4bi5fdCgnQXNzZXRHYWxsZXJ5RmllbGQuRFJPUFpPTkVfRkFJTEVEX1VQTE9BRCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYUNsYXNzOiAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBjYXNlIEFDVElPTl9UWVBFUy5QVVJHRV9VUExPQURfUVVFVUU6XG4gICAgICAgICAgICAvLyBGYWlsZWQgdXBsb2FkcyBhcmUgcmVtb3ZlZC5cbiAgICAgICAgICAgIC8vIFN1Y2Nlc3NmdWwgZmlsZSB1cGxvYWRzIHJlbW92ZWQuXG4gICAgICAgICAgICAvLyBQZW5kaW5nIHVwbG9hZHMgYXJlIGlnbm9yZWQuXG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGl0ZW1zOiBzdGF0ZS5pdGVtcy5maWx0ZXIoKGZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZmlsZS5tZXNzYWdlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGFueSBvZiB0aGUgZmlsZSdzIG1lc3NhZ2VzIGFyZSBvZiB0eXBlICdlcnJvcicgb3IgJ3N1Y2Nlc3MnIHRoZW4gcmV0dXJuIGZhbHNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFmaWxlLm1lc3NhZ2VzLmZpbHRlcihtZXNzYWdlID0+IG1lc3NhZ2UudHlwZSA9PT0gJ2Vycm9yJyB8fCBtZXNzYWdlLnR5cGUgPT09ICdzdWNjZXNzJykubGVuZ3RoID4gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBBQ1RJT05fVFlQRVMuUkVNT1ZFX1FVRVVFRF9GSUxFOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpdGVtczogc3RhdGUuaXRlbXMuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWxlLnF1ZXVlZEF0VGltZSAhPT0gYWN0aW9uLnBheWxvYWQucXVldWVkQXRUaW1lO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBBQ1RJT05fVFlQRVMuU1VDQ0VFRF9VUExPQUQ6XG4gICAgICAgICAgICByZXR1cm4gZGVlcEZyZWV6ZShPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGl0ZW1zOiBzdGF0ZS5pdGVtcy5tYXAoKGZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGUucXVldWVkQXRUaW1lID09PSBhY3Rpb24ucGF5bG9hZC5xdWV1ZWRBdFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBmaWxlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpMThuLl90KCdBc3NldEdhbGxlcnlGaWVsZC5EUk9QWk9ORV9TVUNDRVNTX1VQTE9BRCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhQ2xhc3M6ICdzdWNjZXNzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgY2FzZSBBQ1RJT05fVFlQRVMuVVBEQVRFX1FVRVVFRF9GSUxFOlxuICAgICAgICAgICAgcmV0dXJuIGRlZXBGcmVlemUoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpdGVtczogc3RhdGUuaXRlbXMubWFwKChmaWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlLnF1ZXVlZEF0VGltZSA9PT0gYWN0aW9uLnBheWxvYWQucXVldWVkQXRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZmlsZSwgYWN0aW9uLnBheWxvYWQudXBkYXRlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBxdWV1ZWRGaWxlc1JlZHVjZXI7XG4iLCIvKipcbiAqIEBmaWxlIFRoZSByZWR1Y2VyIHdoaWNoIG9wZXJhdGVzIG9uIHRoZSBSZWR1eCBzdG9yZS5cbiAqL1xuXG5pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgZ2FsbGVyeVJlZHVjZXIgZnJvbSAnLi9nYWxsZXJ5L3JlZHVjZXInO1xuaW1wb3J0IHF1ZXVlZEZpbGVzUmVkdWNlciBmcm9tICcuL3F1ZXVlZC1maWxlcy9yZWR1Y2VyJztcblxuLyoqXG4gKiBPcGVyYXRlcyBvbiB0aGUgUmVkdXggc3RvcmUgdG8gdXBkYXRlIGFwcGxpY2F0aW9uIHN0YXRlLlxuICpcbiAqIEBwYXJhbSBvYmplY3Qgc3RhdGUgLSBUaGUgY3VycmVudCBzdGF0ZS5cbiAqIEBwYXJhbSBvYmplY3QgYWN0aW9uIC0gVGhlIGRpc3BhdGNoZWQgYWN0aW9uLlxuICogQHBhcmFtIHN0cmluZyBhY3Rpb24udHlwZSAtIFRoZSB0eXBlIG9mIGFjdGlvbiB0aGF0IGhhcyBiZWVuIGRpc3BhdGNoZWQuXG4gKiBAcGFyYW0gb2JqZWN0IFthY3Rpb24ucGF5bG9hZF0gLSBPcHRpb25hbCBkYXRhIHBhc3NlZCB3aXRoIHRoZSBhY3Rpb24uXG4gKi9cbmNvbnN0IHJvb3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcbiAgICBhc3NldEFkbWluOiBjb21iaW5lUmVkdWNlcnMoe1xuICAgICAgICBnYWxsZXJ5OiBnYWxsZXJ5UmVkdWNlcixcbiAgICAgICAgcXVldWVkRmlsZXM6IHF1ZXVlZEZpbGVzUmVkdWNlclxuICAgIH0pXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcm9vdFJlZHVjZXI7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJcbi8qXG4gKlxuICogTW9yZSBpbmZvIGF0IFt3d3cuZHJvcHpvbmVqcy5jb21dKGh0dHA6Ly93d3cuZHJvcHpvbmVqcy5jb20pXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEyLCBNYXRpYXMgTWVub1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIERyb3B6b25lLCBFbWl0dGVyLCBjYW1lbGl6ZSwgY29udGVudExvYWRlZCwgZGV0ZWN0VmVydGljYWxTcXVhc2gsIGRyYXdJbWFnZUlPU0ZpeCwgbm9vcCwgd2l0aG91dCxcbiAgICBfX3NsaWNlID0gW10uc2xpY2UsXG4gICAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gICAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbiAgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbiAgRW1pdHRlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFbWl0dGVyKCkge31cblxuICAgIEVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuICAgIEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnQsIGZuKSB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICAgICBpZiAoIXRoaXMuX2NhbGxiYWNrc1tldmVudF0pIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IFtdO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XS5wdXNoKGZuKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgY2FsbGJhY2ssIGNhbGxiYWNrcywgZXZlbnQsIF9pLCBfbGVuO1xuICAgICAgZXZlbnQgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAgICAgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrc1tfaV07XG4gICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IEVtaXR0ZXIucHJvdG90eXBlLm9mZjtcblxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IEVtaXR0ZXIucHJvdG90eXBlLm9mZjtcblxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBFbWl0dGVyLnByb3RvdHlwZS5vZmY7XG5cbiAgICBFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbihldmVudCwgZm4pIHtcbiAgICAgIHZhciBjYWxsYmFjaywgY2FsbGJhY2tzLCBpLCBfaSwgX2xlbjtcbiAgICAgIGlmICghdGhpcy5fY2FsbGJhY2tzIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZm9yIChpID0gX2kgPSAwLCBfbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgX2kgPCBfbGVuOyBpID0gKytfaSkge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrc1tpXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrID09PSBmbikge1xuICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICByZXR1cm4gRW1pdHRlcjtcblxuICB9KSgpO1xuXG4gIERyb3B6b25lID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIHZhciBleHRlbmQsIHJlc29sdmVPcHRpb247XG5cbiAgICBfX2V4dGVuZHMoRHJvcHpvbmUsIF9zdXBlcik7XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuRW1pdHRlciA9IEVtaXR0ZXI7XG5cblxuICAgIC8qXG4gICAgVGhpcyBpcyBhIGxpc3Qgb2YgYWxsIGF2YWlsYWJsZSBldmVudHMgeW91IGNhbiByZWdpc3RlciBvbiBhIGRyb3B6b25lIG9iamVjdC5cbiAgICBcbiAgICBZb3UgY2FuIHJlZ2lzdGVyIGFuIGV2ZW50IGhhbmRsZXIgbGlrZSB0aGlzOlxuICAgIFxuICAgICAgICBkcm9wem9uZS5vbihcImRyYWdFbnRlclwiLCBmdW5jdGlvbigpIHsgfSk7XG4gICAgICovXG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZXZlbnRzID0gW1wiZHJvcFwiLCBcImRyYWdzdGFydFwiLCBcImRyYWdlbmRcIiwgXCJkcmFnZW50ZXJcIiwgXCJkcmFnb3ZlclwiLCBcImRyYWdsZWF2ZVwiLCBcImFkZGVkZmlsZVwiLCBcImFkZGVkZmlsZXNcIiwgXCJyZW1vdmVkZmlsZVwiLCBcInRodW1ibmFpbFwiLCBcImVycm9yXCIsIFwiZXJyb3JtdWx0aXBsZVwiLCBcInByb2Nlc3NpbmdcIiwgXCJwcm9jZXNzaW5nbXVsdGlwbGVcIiwgXCJ1cGxvYWRwcm9ncmVzc1wiLCBcInRvdGFsdXBsb2FkcHJvZ3Jlc3NcIiwgXCJzZW5kaW5nXCIsIFwic2VuZGluZ211bHRpcGxlXCIsIFwic3VjY2Vzc1wiLCBcInN1Y2Nlc3NtdWx0aXBsZVwiLCBcImNhbmNlbGVkXCIsIFwiY2FuY2VsZWRtdWx0aXBsZVwiLCBcImNvbXBsZXRlXCIsIFwiY29tcGxldGVtdWx0aXBsZVwiLCBcInJlc2V0XCIsIFwibWF4ZmlsZXNleGNlZWRlZFwiLCBcIm1heGZpbGVzcmVhY2hlZFwiLCBcInF1ZXVlY29tcGxldGVcIl07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICB1cmw6IG51bGwsXG4gICAgICBtZXRob2Q6IFwicG9zdFwiLFxuICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICAgIHBhcmFsbGVsVXBsb2FkczogMixcbiAgICAgIHVwbG9hZE11bHRpcGxlOiBmYWxzZSxcbiAgICAgIG1heEZpbGVzaXplOiAyNTYsXG4gICAgICBwYXJhbU5hbWU6IFwiZmlsZVwiLFxuICAgICAgY3JlYXRlSW1hZ2VUaHVtYm5haWxzOiB0cnVlLFxuICAgICAgbWF4VGh1bWJuYWlsRmlsZXNpemU6IDEwLFxuICAgICAgdGh1bWJuYWlsV2lkdGg6IDEyMCxcbiAgICAgIHRodW1ibmFpbEhlaWdodDogMTIwLFxuICAgICAgZmlsZXNpemVCYXNlOiAxMDAwLFxuICAgICAgbWF4RmlsZXM6IG51bGwsXG4gICAgICBwYXJhbXM6IHt9LFxuICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgaWdub3JlSGlkZGVuRmlsZXM6IHRydWUsXG4gICAgICBhY2NlcHRlZEZpbGVzOiBudWxsLFxuICAgICAgYWNjZXB0ZWRNaW1lVHlwZXM6IG51bGwsXG4gICAgICBhdXRvUHJvY2Vzc1F1ZXVlOiB0cnVlLFxuICAgICAgYXV0b1F1ZXVlOiB0cnVlLFxuICAgICAgYWRkUmVtb3ZlTGlua3M6IGZhbHNlLFxuICAgICAgcHJldmlld3NDb250YWluZXI6IG51bGwsXG4gICAgICBoaWRkZW5JbnB1dENvbnRhaW5lcjogXCJib2R5XCIsXG4gICAgICBjYXB0dXJlOiBudWxsLFxuICAgICAgcmVuYW1lRmlsZW5hbWU6IG51bGwsXG4gICAgICBkaWN0RGVmYXVsdE1lc3NhZ2U6IFwiRHJvcCBmaWxlcyBoZXJlIHRvIHVwbG9hZFwiLFxuICAgICAgZGljdEZhbGxiYWNrTWVzc2FnZTogXCJZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBkcmFnJ24nZHJvcCBmaWxlIHVwbG9hZHMuXCIsXG4gICAgICBkaWN0RmFsbGJhY2tUZXh0OiBcIlBsZWFzZSB1c2UgdGhlIGZhbGxiYWNrIGZvcm0gYmVsb3cgdG8gdXBsb2FkIHlvdXIgZmlsZXMgbGlrZSBpbiB0aGUgb2xkZW4gZGF5cy5cIixcbiAgICAgIGRpY3RGaWxlVG9vQmlnOiBcIkZpbGUgaXMgdG9vIGJpZyAoe3tmaWxlc2l6ZX19TWlCKS4gTWF4IGZpbGVzaXplOiB7e21heEZpbGVzaXplfX1NaUIuXCIsXG4gICAgICBkaWN0SW52YWxpZEZpbGVUeXBlOiBcIllvdSBjYW4ndCB1cGxvYWQgZmlsZXMgb2YgdGhpcyB0eXBlLlwiLFxuICAgICAgZGljdFJlc3BvbnNlRXJyb3I6IFwiU2VydmVyIHJlc3BvbmRlZCB3aXRoIHt7c3RhdHVzQ29kZX19IGNvZGUuXCIsXG4gICAgICBkaWN0Q2FuY2VsVXBsb2FkOiBcIkNhbmNlbCB1cGxvYWRcIixcbiAgICAgIGRpY3RDYW5jZWxVcGxvYWRDb25maXJtYXRpb246IFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbCB0aGlzIHVwbG9hZD9cIixcbiAgICAgIGRpY3RSZW1vdmVGaWxlOiBcIlJlbW92ZSBmaWxlXCIsXG4gICAgICBkaWN0UmVtb3ZlRmlsZUNvbmZpcm1hdGlvbjogbnVsbCxcbiAgICAgIGRpY3RNYXhGaWxlc0V4Y2VlZGVkOiBcIllvdSBjYW4gbm90IHVwbG9hZCBhbnkgbW9yZSBmaWxlcy5cIixcbiAgICAgIGFjY2VwdDogZnVuY3Rpb24oZmlsZSwgZG9uZSkge1xuICAgICAgICByZXR1cm4gZG9uZSgpO1xuICAgICAgfSxcbiAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICAgIH0sXG4gICAgICBmb3JjZUZhbGxiYWNrOiBmYWxzZSxcbiAgICAgIGZhbGxiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNoaWxkLCBtZXNzYWdlRWxlbWVudCwgc3BhbiwgX2ksIF9sZW4sIF9yZWY7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUgPSBcIlwiICsgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSArIFwiIGR6LWJyb3dzZXItbm90LXN1cHBvcnRlZFwiO1xuICAgICAgICBfcmVmID0gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBjaGlsZCA9IF9yZWZbX2ldO1xuICAgICAgICAgIGlmICgvKF58IClkei1tZXNzYWdlKCR8ICkvLnRlc3QoY2hpbGQuY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgbWVzc2FnZUVsZW1lbnQgPSBjaGlsZDtcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTmFtZSA9IFwiZHotbWVzc2FnZVwiO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghbWVzc2FnZUVsZW1lbnQpIHtcbiAgICAgICAgICBtZXNzYWdlRWxlbWVudCA9IERyb3B6b25lLmNyZWF0ZUVsZW1lbnQoXCI8ZGl2IGNsYXNzPVxcXCJkei1tZXNzYWdlXFxcIj48c3Bhbj48L3NwYW4+PC9kaXY+XCIpO1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgc3BhbiA9IG1lc3NhZ2VFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3BhblwiKVswXTtcbiAgICAgICAgaWYgKHNwYW4pIHtcbiAgICAgICAgICBpZiAoc3Bhbi50ZXh0Q29udGVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gdGhpcy5vcHRpb25zLmRpY3RGYWxsYmFja01lc3NhZ2U7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcGFuLmlubmVyVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBzcGFuLmlubmVyVGV4dCA9IHRoaXMub3B0aW9ucy5kaWN0RmFsbGJhY2tNZXNzYWdlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZ2V0RmFsbGJhY2tGb3JtKCkpO1xuICAgICAgfSxcbiAgICAgIHJlc2l6ZTogZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICB2YXIgaW5mbywgc3JjUmF0aW8sIHRyZ1JhdGlvO1xuICAgICAgICBpbmZvID0ge1xuICAgICAgICAgIHNyY1g6IDAsXG4gICAgICAgICAgc3JjWTogMCxcbiAgICAgICAgICBzcmNXaWR0aDogZmlsZS53aWR0aCxcbiAgICAgICAgICBzcmNIZWlnaHQ6IGZpbGUuaGVpZ2h0XG4gICAgICAgIH07XG4gICAgICAgIHNyY1JhdGlvID0gZmlsZS53aWR0aCAvIGZpbGUuaGVpZ2h0O1xuICAgICAgICBpbmZvLm9wdFdpZHRoID0gdGhpcy5vcHRpb25zLnRodW1ibmFpbFdpZHRoO1xuICAgICAgICBpbmZvLm9wdEhlaWdodCA9IHRoaXMub3B0aW9ucy50aHVtYm5haWxIZWlnaHQ7XG4gICAgICAgIGlmICgoaW5mby5vcHRXaWR0aCA9PSBudWxsKSAmJiAoaW5mby5vcHRIZWlnaHQgPT0gbnVsbCkpIHtcbiAgICAgICAgICBpbmZvLm9wdFdpZHRoID0gaW5mby5zcmNXaWR0aDtcbiAgICAgICAgICBpbmZvLm9wdEhlaWdodCA9IGluZm8uc3JjSGVpZ2h0O1xuICAgICAgICB9IGVsc2UgaWYgKGluZm8ub3B0V2lkdGggPT0gbnVsbCkge1xuICAgICAgICAgIGluZm8ub3B0V2lkdGggPSBzcmNSYXRpbyAqIGluZm8ub3B0SGVpZ2h0O1xuICAgICAgICB9IGVsc2UgaWYgKGluZm8ub3B0SGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICBpbmZvLm9wdEhlaWdodCA9ICgxIC8gc3JjUmF0aW8pICogaW5mby5vcHRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICB0cmdSYXRpbyA9IGluZm8ub3B0V2lkdGggLyBpbmZvLm9wdEhlaWdodDtcbiAgICAgICAgaWYgKGZpbGUuaGVpZ2h0IDwgaW5mby5vcHRIZWlnaHQgfHwgZmlsZS53aWR0aCA8IGluZm8ub3B0V2lkdGgpIHtcbiAgICAgICAgICBpbmZvLnRyZ0hlaWdodCA9IGluZm8uc3JjSGVpZ2h0O1xuICAgICAgICAgIGluZm8udHJnV2lkdGggPSBpbmZvLnNyY1dpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChzcmNSYXRpbyA+IHRyZ1JhdGlvKSB7XG4gICAgICAgICAgICBpbmZvLnNyY0hlaWdodCA9IGZpbGUuaGVpZ2h0O1xuICAgICAgICAgICAgaW5mby5zcmNXaWR0aCA9IGluZm8uc3JjSGVpZ2h0ICogdHJnUmF0aW87XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluZm8uc3JjV2lkdGggPSBmaWxlLndpZHRoO1xuICAgICAgICAgICAgaW5mby5zcmNIZWlnaHQgPSBpbmZvLnNyY1dpZHRoIC8gdHJnUmF0aW87XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGluZm8uc3JjWCA9IChmaWxlLndpZHRoIC0gaW5mby5zcmNXaWR0aCkgLyAyO1xuICAgICAgICBpbmZvLnNyY1kgPSAoZmlsZS5oZWlnaHQgLSBpbmZvLnNyY0hlaWdodCkgLyAyO1xuICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICBUaG9zZSBmdW5jdGlvbnMgcmVnaXN0ZXIgdGhlbXNlbHZlcyB0byB0aGUgZXZlbnRzIG9uIGluaXQgYW5kIGhhbmRsZSBhbGxcbiAgICAgIHRoZSB1c2VyIGludGVyZmFjZSBzcGVjaWZpYyBzdHVmZi4gT3ZlcndyaXRpbmcgdGhlbSB3b24ndCBicmVhayB0aGUgdXBsb2FkXG4gICAgICBidXQgY2FuIGJyZWFrIHRoZSB3YXkgaXQncyBkaXNwbGF5ZWQuXG4gICAgICBZb3UgY2FuIG92ZXJ3cml0ZSB0aGVtIGlmIHlvdSBkb24ndCBsaWtlIHRoZSBkZWZhdWx0IGJlaGF2aW9yLiBJZiB5b3UganVzdFxuICAgICAgd2FudCB0byBhZGQgYW4gYWRkaXRpb25hbCBldmVudCBoYW5kbGVyLCByZWdpc3RlciBpdCBvbiB0aGUgZHJvcHpvbmUgb2JqZWN0XG4gICAgICBhbmQgZG9uJ3Qgb3ZlcndyaXRlIHRob3NlIG9wdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIGRyb3A6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotZHJhZy1ob3ZlclwiKTtcbiAgICAgIH0sXG4gICAgICBkcmFnc3RhcnQ6IG5vb3AsXG4gICAgICBkcmFnZW5kOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICB9LFxuICAgICAgZHJhZ2VudGVyOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICB9LFxuICAgICAgZHJhZ292ZXI6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotZHJhZy1ob3ZlclwiKTtcbiAgICAgIH0sXG4gICAgICBkcmFnbGVhdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotZHJhZy1ob3ZlclwiKTtcbiAgICAgIH0sXG4gICAgICBwYXN0ZTogbm9vcCxcbiAgICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotc3RhcnRlZFwiKTtcbiAgICAgIH0sXG4gICAgICBhZGRlZGZpbGU6IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgdmFyIG5vZGUsIHJlbW92ZUZpbGVFdmVudCwgcmVtb3ZlTGluaywgX2ksIF9qLCBfaywgX2xlbiwgX2xlbjEsIF9sZW4yLCBfcmVmLCBfcmVmMSwgX3JlZjIsIF9yZXN1bHRzO1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50ID09PSB0aGlzLnByZXZpZXdzQ29udGFpbmVyKSB7XG4gICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1zdGFydGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByZXZpZXdzQ29udGFpbmVyKSB7XG4gICAgICAgICAgZmlsZS5wcmV2aWV3RWxlbWVudCA9IERyb3B6b25lLmNyZWF0ZUVsZW1lbnQodGhpcy5vcHRpb25zLnByZXZpZXdUZW1wbGF0ZS50cmltKCkpO1xuICAgICAgICAgIGZpbGUucHJldmlld1RlbXBsYXRlID0gZmlsZS5wcmV2aWV3RWxlbWVudDtcbiAgICAgICAgICB0aGlzLnByZXZpZXdzQ29udGFpbmVyLmFwcGVuZENoaWxkKGZpbGUucHJldmlld0VsZW1lbnQpO1xuICAgICAgICAgIF9yZWYgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1uYW1lXVwiKTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIG5vZGUgPSBfcmVmW19pXTtcbiAgICAgICAgICAgIG5vZGUudGV4dENvbnRlbnQgPSB0aGlzLl9yZW5hbWVGaWxlbmFtZShmaWxlLm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBfcmVmMSA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LXNpemVdXCIpO1xuICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYxLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgbm9kZSA9IF9yZWYxW19qXTtcbiAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gdGhpcy5maWxlc2l6ZShmaWxlLnNpemUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkZFJlbW92ZUxpbmtzKSB7XG4gICAgICAgICAgICBmaWxlLl9yZW1vdmVMaW5rID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxhIGNsYXNzPVxcXCJkei1yZW1vdmVcXFwiIGhyZWY9XFxcImphdmFzY3JpcHQ6dW5kZWZpbmVkO1xcXCIgZGF0YS1kei1yZW1vdmU+XCIgKyB0aGlzLm9wdGlvbnMuZGljdFJlbW92ZUZpbGUgKyBcIjwvYT5cIik7XG4gICAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmFwcGVuZENoaWxkKGZpbGUuX3JlbW92ZUxpbmspO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZW1vdmVGaWxlRXZlbnQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5VUExPQURJTkcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRHJvcHpvbmUuY29uZmlybShfdGhpcy5vcHRpb25zLmRpY3RDYW5jZWxVcGxvYWRDb25maXJtYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJlbW92ZUZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGljdFJlbW92ZUZpbGVDb25maXJtYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBEcm9wem9uZS5jb25maXJtKF90aGlzLm9wdGlvbnMuZGljdFJlbW92ZUZpbGVDb25maXJtYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkodGhpcyk7XG4gICAgICAgICAgX3JlZjIgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1yZW1vdmVdXCIpO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfayA9IDAsIF9sZW4yID0gX3JlZjIubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgICAgICAgICByZW1vdmVMaW5rID0gX3JlZjJbX2tdO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChyZW1vdmVMaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZW1vdmVGaWxlRXZlbnQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcmVtb3ZlZGZpbGU6IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgdmFyIF9yZWY7XG4gICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgaWYgKChfcmVmID0gZmlsZS5wcmV2aWV3RWxlbWVudCkgIT0gbnVsbCkge1xuICAgICAgICAgICAgX3JlZi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZpbGUucHJldmlld0VsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fdXBkYXRlTWF4RmlsZXNSZWFjaGVkQ2xhc3MoKTtcbiAgICAgIH0sXG4gICAgICB0aHVtYm5haWw6IGZ1bmN0aW9uKGZpbGUsIGRhdGFVcmwpIHtcbiAgICAgICAgdmFyIHRodW1ibmFpbEVsZW1lbnQsIF9pLCBfbGVuLCBfcmVmO1xuICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWZpbGUtcHJldmlld1wiKTtcbiAgICAgICAgICBfcmVmID0gZmlsZS5wcmV2aWV3RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZHotdGh1bWJuYWlsXVwiKTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIHRodW1ibmFpbEVsZW1lbnQgPSBfcmVmW19pXTtcbiAgICAgICAgICAgIHRodW1ibmFpbEVsZW1lbnQuYWx0ID0gZmlsZS5uYW1lO1xuICAgICAgICAgICAgdGh1bWJuYWlsRWxlbWVudC5zcmMgPSBkYXRhVXJsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1pbWFnZS1wcmV2aWV3XCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSh0aGlzKSksIDEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGZpbGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIG5vZGUsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1lcnJvclwiKTtcbiAgICAgICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgIT09IFwiU3RyaW5nXCIgJiYgbWVzc2FnZS5lcnJvcikge1xuICAgICAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UuZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICAgIF9yZWYgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1lcnJvcm1lc3NhZ2VdXCIpO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBub2RlID0gX3JlZltfaV07XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKG5vZGUudGV4dENvbnRlbnQgPSBtZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyb3JtdWx0aXBsZTogbm9vcCxcbiAgICAgIHByb2Nlc3Npbmc6IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1wcm9jZXNzaW5nXCIpO1xuICAgICAgICAgIGlmIChmaWxlLl9yZW1vdmVMaW5rKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZS5fcmVtb3ZlTGluay50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5kaWN0Q2FuY2VsVXBsb2FkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb2Nlc3NpbmdtdWx0aXBsZTogbm9vcCxcbiAgICAgIHVwbG9hZHByb2dyZXNzOiBmdW5jdGlvbihmaWxlLCBwcm9ncmVzcywgYnl0ZXNTZW50KSB7XG4gICAgICAgIHZhciBub2RlLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgX3JlZiA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LXVwbG9hZHByb2dyZXNzXVwiKTtcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgbm9kZSA9IF9yZWZbX2ldO1xuICAgICAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09ICdQUk9HUkVTUycpIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChub2RlLnZhbHVlID0gcHJvZ3Jlc3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChub2RlLnN0eWxlLndpZHRoID0gXCJcIiArIHByb2dyZXNzICsgXCIlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0b3RhbHVwbG9hZHByb2dyZXNzOiBub29wLFxuICAgICAgc2VuZGluZzogbm9vcCxcbiAgICAgIHNlbmRpbmdtdWx0aXBsZTogbm9vcCxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotc3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3NtdWx0aXBsZTogbm9vcCxcbiAgICAgIGNhbmNlbGVkOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXQoXCJlcnJvclwiLCBmaWxlLCBcIlVwbG9hZCBjYW5jZWxlZC5cIik7XG4gICAgICB9LFxuICAgICAgY2FuY2VsZWRtdWx0aXBsZTogbm9vcCxcbiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIGlmIChmaWxlLl9yZW1vdmVMaW5rKSB7XG4gICAgICAgICAgZmlsZS5fcmVtb3ZlTGluay50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5kaWN0UmVtb3ZlRmlsZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgIHJldHVybiBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1jb21wbGV0ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbXBsZXRlbXVsdGlwbGU6IG5vb3AsXG4gICAgICBtYXhmaWxlc2V4Y2VlZGVkOiBub29wLFxuICAgICAgbWF4ZmlsZXNyZWFjaGVkOiBub29wLFxuICAgICAgcXVldWVjb21wbGV0ZTogbm9vcCxcbiAgICAgIGFkZGVkZmlsZXM6IG5vb3AsXG4gICAgICBwcmV2aWV3VGVtcGxhdGU6IFwiPGRpdiBjbGFzcz1cXFwiZHotcHJldmlldyBkei1maWxlLXByZXZpZXdcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotaW1hZ2VcXFwiPjxpbWcgZGF0YS1kei10aHVtYm5haWwgLz48L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LWRldGFpbHNcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJkei1zaXplXFxcIj48c3BhbiBkYXRhLWR6LXNpemU+PC9zcGFuPjwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJkei1maWxlbmFtZVxcXCI+PHNwYW4gZGF0YS1kei1uYW1lPjwvc3Bhbj48L2Rpdj5cXG4gIDwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotcHJvZ3Jlc3NcXFwiPjxzcGFuIGNsYXNzPVxcXCJkei11cGxvYWRcXFwiIGRhdGEtZHotdXBsb2FkcHJvZ3Jlc3M+PC9zcGFuPjwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotZXJyb3ItbWVzc2FnZVxcXCI+PHNwYW4gZGF0YS1kei1lcnJvcm1lc3NhZ2U+PC9zcGFuPjwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotc3VjY2Vzcy1tYXJrXFxcIj5cXG4gICAgPHN2ZyB3aWR0aD1cXFwiNTRweFxcXCIgaGVpZ2h0PVxcXCI1NHB4XFxcIiB2aWV3Qm94PVxcXCIwIDAgNTQgNTRcXFwiIHZlcnNpb249XFxcIjEuMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgeG1sbnM6c2tldGNoPVxcXCJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnNcXFwiPlxcbiAgICAgIDx0aXRsZT5DaGVjazwvdGl0bGU+XFxuICAgICAgPGRlZnM+PC9kZWZzPlxcbiAgICAgIDxnIGlkPVxcXCJQYWdlLTFcXFwiIHN0cm9rZT1cXFwibm9uZVxcXCIgc3Ryb2tlLXdpZHRoPVxcXCIxXFxcIiBmaWxsPVxcXCJub25lXFxcIiBmaWxsLXJ1bGU9XFxcImV2ZW5vZGRcXFwiIHNrZXRjaDp0eXBlPVxcXCJNU1BhZ2VcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTIzLjUsMzEuODQzMTQ1OCBMMTcuNTg1MjQxOSwyNS45MjgzODc3IEMxNi4wMjQ4MjUzLDI0LjM2Nzk3MTEgMTMuNDkxMDI5NCwyNC4zNjY4MzUgMTEuOTI4OTMyMiwyNS45Mjg5MzIyIEMxMC4zNzAwMTM2LDI3LjQ4Nzg1MDggMTAuMzY2NTkxMiwzMC4wMjM0NDU1IDExLjkyODM4NzcsMzEuNTg1MjQxOSBMMjAuNDE0NzU4MSw0MC4wNzE2MTIzIEMyMC41MTMzOTk5LDQwLjE3MDI1NDEgMjAuNjE1OTMxNSw0MC4yNjI2NjQ5IDIwLjcyMTg2MTUsNDAuMzQ4ODQzNSBDMjIuMjgzNTY2OSw0MS44NzI1NjUxIDI0Ljc5NDIzNCw0MS44NjI2MjAyIDI2LjM0NjE1NjQsNDAuMzEwNjk3OCBMNDMuMzEwNjk3OCwyMy4zNDYxNTY0IEM0NC44NzcxMDIxLDIxLjc3OTc1MjEgNDQuODc1ODA1NywxOS4yNDgzODg3IDQzLjMxMzcwODUsMTcuNjg2MjkxNSBDNDEuNzU0Nzg5OSwxNi4xMjczNzI5IDM5LjIxNzYwMzUsMTYuMTI1NTQyMiAzNy42NTM4NDM2LDE3LjY4OTMwMjIgTDIzLjUsMzEuODQzMTQ1OCBaIE0yNyw1MyBDNDEuMzU5NDAzNSw1MyA1Myw0MS4zNTk0MDM1IDUzLDI3IEM1MywxMi42NDA1OTY1IDQxLjM1OTQwMzUsMSAyNywxIEMxMi42NDA1OTY1LDEgMSwxMi42NDA1OTY1IDEsMjcgQzEsNDEuMzU5NDAzNSAxMi42NDA1OTY1LDUzIDI3LDUzIFpcXFwiIGlkPVxcXCJPdmFsLTJcXFwiIHN0cm9rZS1vcGFjaXR5PVxcXCIwLjE5ODc5NDE1OFxcXCIgc3Ryb2tlPVxcXCIjNzQ3NDc0XFxcIiBmaWxsLW9wYWNpdHk9XFxcIjAuODE2NTE5NDc1XFxcIiBmaWxsPVxcXCIjRkZGRkZGXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNTaGFwZUdyb3VwXFxcIj48L3BhdGg+XFxuICAgICAgPC9nPlxcbiAgICA8L3N2Zz5cXG4gIDwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotZXJyb3ItbWFya1xcXCI+XFxuICAgIDxzdmcgd2lkdGg9XFxcIjU0cHhcXFwiIGhlaWdodD1cXFwiNTRweFxcXCIgdmlld0JveD1cXFwiMCAwIDU0IDU0XFxcIiB2ZXJzaW9uPVxcXCIxLjFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHhtbG5zOnNrZXRjaD1cXFwiaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zXFxcIj5cXG4gICAgICA8dGl0bGU+RXJyb3I8L3RpdGxlPlxcbiAgICAgIDxkZWZzPjwvZGVmcz5cXG4gICAgICA8ZyBpZD1cXFwiUGFnZS0xXFxcIiBzdHJva2U9XFxcIm5vbmVcXFwiIHN0cm9rZS13aWR0aD1cXFwiMVxcXCIgZmlsbD1cXFwibm9uZVxcXCIgZmlsbC1ydWxlPVxcXCJldmVub2RkXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNQYWdlXFxcIj5cXG4gICAgICAgIDxnIGlkPVxcXCJDaGVjay0rLU92YWwtMlxcXCIgc2tldGNoOnR5cGU9XFxcIk1TTGF5ZXJHcm91cFxcXCIgc3Ryb2tlPVxcXCIjNzQ3NDc0XFxcIiBzdHJva2Utb3BhY2l0eT1cXFwiMC4xOTg3OTQxNThcXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZpbGwtb3BhY2l0eT1cXFwiMC44MTY1MTk0NzVcXFwiPlxcbiAgICAgICAgICA8cGF0aCBkPVxcXCJNMzIuNjU2ODU0MiwyOSBMMzguMzEwNjk3OCwyMy4zNDYxNTY0IEMzOS44NzcxMDIxLDIxLjc3OTc1MjEgMzkuODc1ODA1NywxOS4yNDgzODg3IDM4LjMxMzcwODUsMTcuNjg2MjkxNSBDMzYuNzU0Nzg5OSwxNi4xMjczNzI5IDM0LjIxNzYwMzUsMTYuMTI1NTQyMiAzMi42NTM4NDM2LDE3LjY4OTMwMjIgTDI3LDIzLjM0MzE0NTggTDIxLjM0NjE1NjQsMTcuNjg5MzAyMiBDMTkuNzgyMzk2NSwxNi4xMjU1NDIyIDE3LjI0NTIxMDEsMTYuMTI3MzcyOSAxNS42ODYyOTE1LDE3LjY4NjI5MTUgQzE0LjEyNDE5NDMsMTkuMjQ4Mzg4NyAxNC4xMjI4OTc5LDIxLjc3OTc1MjEgMTUuNjg5MzAyMiwyMy4zNDYxNTY0IEwyMS4zNDMxNDU4LDI5IEwxNS42ODkzMDIyLDM0LjY1Mzg0MzYgQzE0LjEyMjg5NzksMzYuMjIwMjQ3OSAxNC4xMjQxOTQzLDM4Ljc1MTYxMTMgMTUuNjg2MjkxNSw0MC4zMTM3MDg1IEMxNy4yNDUyMTAxLDQxLjg3MjYyNzEgMTkuNzgyMzk2NSw0MS44NzQ0NTc4IDIxLjM0NjE1NjQsNDAuMzEwNjk3OCBMMjcsMzQuNjU2ODU0MiBMMzIuNjUzODQzNiw0MC4zMTA2OTc4IEMzNC4yMTc2MDM1LDQxLjg3NDQ1NzggMzYuNzU0Nzg5OSw0MS44NzI2MjcxIDM4LjMxMzcwODUsNDAuMzEzNzA4NSBDMzkuODc1ODA1NywzOC43NTE2MTEzIDM5Ljg3NzEwMjEsMzYuMjIwMjQ3OSAzOC4zMTA2OTc4LDM0LjY1Mzg0MzYgTDMyLjY1Njg1NDIsMjkgWiBNMjcsNTMgQzQxLjM1OTQwMzUsNTMgNTMsNDEuMzU5NDAzNSA1MywyNyBDNTMsMTIuNjQwNTk2NSA0MS4zNTk0MDM1LDEgMjcsMSBDMTIuNjQwNTk2NSwxIDEsMTIuNjQwNTk2NSAxLDI3IEMxLDQxLjM1OTQwMzUgMTIuNjQwNTk2NSw1MyAyNyw1MyBaXFxcIiBpZD1cXFwiT3ZhbC0yXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNTaGFwZUdyb3VwXFxcIj48L3BhdGg+XFxuICAgICAgICA8L2c+XFxuICAgICAgPC9nPlxcbiAgICA8L3N2Zz5cXG4gIDwvZGl2PlxcbjwvZGl2PlwiXG4gICAgfTtcblxuICAgIGV4dGVuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleSwgb2JqZWN0LCBvYmplY3RzLCB0YXJnZXQsIHZhbCwgX2ksIF9sZW47XG4gICAgICB0YXJnZXQgPSBhcmd1bWVudHNbMF0sIG9iamVjdHMgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBvYmplY3RzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIG9iamVjdCA9IG9iamVjdHNbX2ldO1xuICAgICAgICBmb3IgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICB2YWwgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gRHJvcHpvbmUoZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgdmFyIGVsZW1lbnRPcHRpb25zLCBmYWxsYmFjaywgX3JlZjtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICB0aGlzLnZlcnNpb24gPSBEcm9wem9uZS52ZXJzaW9uO1xuICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucy5wcmV2aWV3VGVtcGxhdGUgPSB0aGlzLmRlZmF1bHRPcHRpb25zLnByZXZpZXdUZW1wbGF0ZS5yZXBsYWNlKC9cXG4qL2csIFwiXCIpO1xuICAgICAgdGhpcy5jbGlja2FibGVFbGVtZW50cyA9IFtdO1xuICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgIHRoaXMuZmlsZXMgPSBbXTtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5lbGVtZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5lbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIGlmICghKHRoaXMuZWxlbWVudCAmJiAodGhpcy5lbGVtZW50Lm5vZGVUeXBlICE9IG51bGwpKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGRyb3B6b25lIGVsZW1lbnQuXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWxlbWVudC5kcm9wem9uZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEcm9wem9uZSBhbHJlYWR5IGF0dGFjaGVkLlwiKTtcbiAgICAgIH1cbiAgICAgIERyb3B6b25lLmluc3RhbmNlcy5wdXNoKHRoaXMpO1xuICAgICAgdGhpcy5lbGVtZW50LmRyb3B6b25lID0gdGhpcztcbiAgICAgIGVsZW1lbnRPcHRpb25zID0gKF9yZWYgPSBEcm9wem9uZS5vcHRpb25zRm9yRWxlbWVudCh0aGlzLmVsZW1lbnQpKSAhPSBudWxsID8gX3JlZiA6IHt9O1xuICAgICAgdGhpcy5vcHRpb25zID0gZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBlbGVtZW50T3B0aW9ucywgb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucyA6IHt9KTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZm9yY2VGYWxsYmFjayB8fCAhRHJvcHpvbmUuaXNCcm93c2VyU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5mYWxsYmFjay5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cmwgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMudXJsID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImFjdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnVybCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBVUkwgcHJvdmlkZWQuXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hY2NlcHRlZEZpbGVzICYmIHRoaXMub3B0aW9ucy5hY2NlcHRlZE1pbWVUeXBlcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgY2FuJ3QgcHJvdmlkZSBib3RoICdhY2NlcHRlZEZpbGVzJyBhbmQgJ2FjY2VwdGVkTWltZVR5cGVzJy4gJ2FjY2VwdGVkTWltZVR5cGVzJyBpcyBkZXByZWNhdGVkLlwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmFjY2VwdGVkRmlsZXMgPSB0aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXM7XG4gICAgICAgIGRlbGV0ZSB0aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXM7XG4gICAgICB9XG4gICAgICB0aGlzLm9wdGlvbnMubWV0aG9kID0gdGhpcy5vcHRpb25zLm1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuICAgICAgaWYgKChmYWxsYmFjayA9IHRoaXMuZ2V0RXhpc3RpbmdGYWxsYmFjaygpKSAmJiBmYWxsYmFjay5wYXJlbnROb2RlKSB7XG4gICAgICAgIGZhbGxiYWNrLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZmFsbGJhY2spO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wcmV2aWV3c0NvbnRhaW5lciAhPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wcmV2aWV3c0NvbnRhaW5lcikge1xuICAgICAgICAgIHRoaXMucHJldmlld3NDb250YWluZXIgPSBEcm9wem9uZS5nZXRFbGVtZW50KHRoaXMub3B0aW9ucy5wcmV2aWV3c0NvbnRhaW5lciwgXCJwcmV2aWV3c0NvbnRhaW5lclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByZXZpZXdzQ29udGFpbmVyID0gdGhpcy5lbGVtZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNsaWNrYWJsZSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNsaWNrYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMgPSBbdGhpcy5lbGVtZW50XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNsaWNrYWJsZUVsZW1lbnRzID0gRHJvcHpvbmUuZ2V0RWxlbWVudHModGhpcy5vcHRpb25zLmNsaWNrYWJsZSwgXCJjbGlja2FibGVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5nZXRBY2NlcHRlZEZpbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgX3JlZiA9IHRoaXMuZmlsZXM7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBfcmVmW19pXTtcbiAgICAgICAgaWYgKGZpbGUuYWNjZXB0ZWQpIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGZpbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5nZXRSZWplY3RlZEZpbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgX3JlZiA9IHRoaXMuZmlsZXM7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBfcmVmW19pXTtcbiAgICAgICAgaWYgKCFmaWxlLmFjY2VwdGVkKSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChmaWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZ2V0RmlsZXNXaXRoU3RhdHVzID0gZnVuY3Rpb24oc3RhdHVzKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgX3JlZiA9IHRoaXMuZmlsZXM7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBfcmVmW19pXTtcbiAgICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBzdGF0dXMpIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGZpbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5nZXRRdWV1ZWRGaWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RmlsZXNXaXRoU3RhdHVzKERyb3B6b25lLlFVRVVFRCk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5nZXRVcGxvYWRpbmdGaWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RmlsZXNXaXRoU3RhdHVzKERyb3B6b25lLlVQTE9BRElORyk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5nZXRBZGRlZEZpbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRGaWxlc1dpdGhTdGF0dXMoRHJvcHpvbmUuQURERUQpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZ2V0QWN0aXZlRmlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmaWxlLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBfcmVmID0gdGhpcy5maWxlcztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IF9yZWZbX2ldO1xuICAgICAgICBpZiAoZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLlVQTE9BRElORyB8fCBmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuUVVFVUVEKSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChmaWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGV2ZW50TmFtZSwgbm9Qcm9wYWdhdGlvbiwgc2V0dXBIaWRkZW5GaWxlSW5wdXQsIF9pLCBfbGVuLCBfcmVmLCBfcmVmMTtcbiAgICAgIGlmICh0aGlzLmVsZW1lbnQudGFnTmFtZSA9PT0gXCJmb3JtXCIpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImVuY3R5cGVcIiwgXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJkcm9wem9uZVwiKSAmJiAhdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZHotbWVzc2FnZVwiKSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxkaXYgY2xhc3M9XFxcImR6LWRlZmF1bHQgZHotbWVzc2FnZVxcXCI+PHNwYW4+XCIgKyB0aGlzLm9wdGlvbnMuZGljdERlZmF1bHRNZXNzYWdlICsgXCI8L3NwYW4+PC9kaXY+XCIpKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNsaWNrYWJsZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBzZXR1cEhpZGRlbkZpbGVJbnB1dCA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5oaWRkZW5GaWxlSW5wdXQpIHtcbiAgICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoX3RoaXMuaGlkZGVuRmlsZUlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiZmlsZVwiKTtcbiAgICAgICAgICAgIGlmICgoX3RoaXMub3B0aW9ucy5tYXhGaWxlcyA9PSBudWxsKSB8fCBfdGhpcy5vcHRpb25zLm1heEZpbGVzID4gMSkge1xuICAgICAgICAgICAgICBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuc2V0QXR0cmlidXRlKFwibXVsdGlwbGVcIiwgXCJtdWx0aXBsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5jbGFzc05hbWUgPSBcImR6LWhpZGRlbi1pbnB1dFwiO1xuICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJhY2NlcHRcIiwgX3RoaXMub3B0aW9ucy5hY2NlcHRlZEZpbGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmNhcHR1cmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBfdGhpcy5oaWRkZW5GaWxlSW5wdXQuc2V0QXR0cmlidXRlKFwiY2FwdHVyZVwiLCBfdGhpcy5vcHRpb25zLmNhcHR1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLmxlZnQgPSBcIjBcIjtcbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgICAgICAgICAgIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS53aWR0aCA9IFwiMFwiO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfdGhpcy5vcHRpb25zLmhpZGRlbklucHV0Q29udGFpbmVyKS5hcHBlbmRDaGlsZChfdGhpcy5oaWRkZW5GaWxlSW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmhpZGRlbkZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2YXIgZmlsZSwgZmlsZXMsIF9pLCBfbGVuO1xuICAgICAgICAgICAgICBmaWxlcyA9IF90aGlzLmhpZGRlbkZpbGVJbnB1dC5maWxlcztcbiAgICAgICAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgIGZpbGUgPSBmaWxlc1tfaV07XG4gICAgICAgICAgICAgICAgICBfdGhpcy5hZGRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBfdGhpcy5lbWl0KFwiYWRkZWRmaWxlc1wiLCBmaWxlcyk7XG4gICAgICAgICAgICAgIHJldHVybiBzZXR1cEhpZGRlbkZpbGVJbnB1dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcyk7XG4gICAgICAgIHNldHVwSGlkZGVuRmlsZUlucHV0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLlVSTCA9IChfcmVmID0gd2luZG93LlVSTCkgIT0gbnVsbCA/IF9yZWYgOiB3aW5kb3cud2Via2l0VVJMO1xuICAgICAgX3JlZjEgPSB0aGlzLmV2ZW50cztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZXZlbnROYW1lID0gX3JlZjFbX2ldO1xuICAgICAgICB0aGlzLm9uKGV2ZW50TmFtZSwgdGhpcy5vcHRpb25zW2V2ZW50TmFtZV0pO1xuICAgICAgfVxuICAgICAgdGhpcy5vbihcInVwbG9hZHByb2dyZXNzXCIsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnVwZGF0ZVRvdGFsVXBsb2FkUHJvZ3Jlc3MoKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIHRoaXMub24oXCJyZW1vdmVkZmlsZVwiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy51cGRhdGVUb3RhbFVwbG9hZFByb2dyZXNzKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICB0aGlzLm9uKFwiY2FuY2VsZWRcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmVtaXQoXCJjb21wbGV0ZVwiLCBmaWxlKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIHRoaXMub24oXCJjb21wbGV0ZVwiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICBpZiAoX3RoaXMuZ2V0QWRkZWRGaWxlcygpLmxlbmd0aCA9PT0gMCAmJiBfdGhpcy5nZXRVcGxvYWRpbmdGaWxlcygpLmxlbmd0aCA9PT0gMCAmJiBfdGhpcy5nZXRRdWV1ZWRGaWxlcygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZW1pdChcInF1ZXVlY29tcGxldGVcIik7XG4gICAgICAgICAgICB9KSwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgICAgbm9Qcm9wYWdhdGlvbiA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICByZXR1cm4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB0aGlzLmxpc3RlbmVycyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuZWxlbWVudCxcbiAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIFwiZHJhZ3N0YXJ0XCI6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5lbWl0KFwiZHJhZ3N0YXJ0XCIsIGUpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkodGhpcyksXG4gICAgICAgICAgICBcImRyYWdlbnRlclwiOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBub1Byb3BhZ2F0aW9uKGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5lbWl0KFwiZHJhZ2VudGVyXCIsIGUpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkodGhpcyksXG4gICAgICAgICAgICBcImRyYWdvdmVyXCI6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBlZmN0O1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBlZmN0ID0gZS5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJyA9PT0gZWZjdCB8fCAnbGlua01vdmUnID09PSBlZmN0ID8gJ21vdmUnIDogJ2NvcHknO1xuICAgICAgICAgICAgICAgIG5vUHJvcGFnYXRpb24oZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmVtaXQoXCJkcmFnb3ZlclwiLCBlKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKHRoaXMpLFxuICAgICAgICAgICAgXCJkcmFnbGVhdmVcIjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmVtaXQoXCJkcmFnbGVhdmVcIiwgZSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgICAgIFwiZHJvcFwiOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBub1Byb3BhZ2F0aW9uKGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5kcm9wKGUpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkodGhpcyksXG4gICAgICAgICAgICBcImRyYWdlbmRcIjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmVtaXQoXCJkcmFnZW5kXCIsIGUpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICB0aGlzLmNsaWNrYWJsZUVsZW1lbnRzLmZvckVhY2goKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjbGlja2FibGVFbGVtZW50KSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IGNsaWNrYWJsZUVsZW1lbnQsXG4gICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgXCJjbGlja1wiOiBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoKGNsaWNrYWJsZUVsZW1lbnQgIT09IF90aGlzLmVsZW1lbnQpIHx8IChldnQudGFyZ2V0ID09PSBfdGhpcy5lbGVtZW50IHx8IERyb3B6b25lLmVsZW1lbnRJbnNpZGUoZXZ0LnRhcmdldCwgX3RoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmR6LW1lc3NhZ2VcIikpKSkge1xuICAgICAgICAgICAgICAgICAgX3RoaXMuaGlkZGVuRmlsZUlucHV0LmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgICB0aGlzLmVuYWJsZSgpO1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pbml0LmNhbGwodGhpcyk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX3JlZjtcbiAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgdGhpcy5yZW1vdmVBbGxGaWxlcyh0cnVlKTtcbiAgICAgIGlmICgoX3JlZiA9IHRoaXMuaGlkZGVuRmlsZUlucHV0KSAhPSBudWxsID8gX3JlZi5wYXJlbnROb2RlIDogdm9pZCAwKSB7XG4gICAgICAgIHRoaXMuaGlkZGVuRmlsZUlucHV0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5oaWRkZW5GaWxlSW5wdXQpO1xuICAgICAgICB0aGlzLmhpZGRlbkZpbGVJbnB1dCA9IG51bGw7XG4gICAgICB9XG4gICAgICBkZWxldGUgdGhpcy5lbGVtZW50LmRyb3B6b25lO1xuICAgICAgcmV0dXJuIERyb3B6b25lLmluc3RhbmNlcy5zcGxpY2UoRHJvcHpvbmUuaW5zdGFuY2VzLmluZGV4T2YodGhpcyksIDEpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUudXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFjdGl2ZUZpbGVzLCBmaWxlLCB0b3RhbEJ5dGVzLCB0b3RhbEJ5dGVzU2VudCwgdG90YWxVcGxvYWRQcm9ncmVzcywgX2ksIF9sZW4sIF9yZWY7XG4gICAgICB0b3RhbEJ5dGVzU2VudCA9IDA7XG4gICAgICB0b3RhbEJ5dGVzID0gMDtcbiAgICAgIGFjdGl2ZUZpbGVzID0gdGhpcy5nZXRBY3RpdmVGaWxlcygpO1xuICAgICAgaWYgKGFjdGl2ZUZpbGVzLmxlbmd0aCkge1xuICAgICAgICBfcmVmID0gdGhpcy5nZXRBY3RpdmVGaWxlcygpO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBmaWxlID0gX3JlZltfaV07XG4gICAgICAgICAgdG90YWxCeXRlc1NlbnQgKz0gZmlsZS51cGxvYWQuYnl0ZXNTZW50O1xuICAgICAgICAgIHRvdGFsQnl0ZXMgKz0gZmlsZS51cGxvYWQudG90YWw7XG4gICAgICAgIH1cbiAgICAgICAgdG90YWxVcGxvYWRQcm9ncmVzcyA9IDEwMCAqIHRvdGFsQnl0ZXNTZW50IC8gdG90YWxCeXRlcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvdGFsVXBsb2FkUHJvZ3Jlc3MgPSAxMDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbWl0KFwidG90YWx1cGxvYWRwcm9ncmVzc1wiLCB0b3RhbFVwbG9hZFByb2dyZXNzLCB0b3RhbEJ5dGVzLCB0b3RhbEJ5dGVzU2VudCk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5fZ2V0UGFyYW1OYW1lID0gZnVuY3Rpb24obikge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGFyYW1OYW1lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wYXJhbU5hbWUobik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJcIiArIHRoaXMub3B0aW9ucy5wYXJhbU5hbWUgKyAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlID8gXCJbXCIgKyBuICsgXCJdXCIgOiBcIlwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9yZW5hbWVGaWxlbmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnJlbmFtZUZpbGVuYW1lICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnJlbmFtZUZpbGVuYW1lKG5hbWUpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuZ2V0RmFsbGJhY2tGb3JtID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXhpc3RpbmdGYWxsYmFjaywgZmllbGRzLCBmaWVsZHNTdHJpbmcsIGZvcm07XG4gICAgICBpZiAoZXhpc3RpbmdGYWxsYmFjayA9IHRoaXMuZ2V0RXhpc3RpbmdGYWxsYmFjaygpKSB7XG4gICAgICAgIHJldHVybiBleGlzdGluZ0ZhbGxiYWNrO1xuICAgICAgfVxuICAgICAgZmllbGRzU3RyaW5nID0gXCI8ZGl2IGNsYXNzPVxcXCJkei1mYWxsYmFja1xcXCI+XCI7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRpY3RGYWxsYmFja1RleHQpIHtcbiAgICAgICAgZmllbGRzU3RyaW5nICs9IFwiPHA+XCIgKyB0aGlzLm9wdGlvbnMuZGljdEZhbGxiYWNrVGV4dCArIFwiPC9wPlwiO1xuICAgICAgfVxuICAgICAgZmllbGRzU3RyaW5nICs9IFwiPGlucHV0IHR5cGU9XFxcImZpbGVcXFwiIG5hbWU9XFxcIlwiICsgKHRoaXMuX2dldFBhcmFtTmFtZSgwKSkgKyBcIlxcXCIgXCIgKyAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlID8gJ211bHRpcGxlPVwibXVsdGlwbGVcIicgOiB2b2lkIDApICsgXCIgLz48aW5wdXQgdHlwZT1cXFwic3VibWl0XFxcIiB2YWx1ZT1cXFwiVXBsb2FkIVxcXCI+PC9kaXY+XCI7XG4gICAgICBmaWVsZHMgPSBEcm9wem9uZS5jcmVhdGVFbGVtZW50KGZpZWxkc1N0cmluZyk7XG4gICAgICBpZiAodGhpcy5lbGVtZW50LnRhZ05hbWUgIT09IFwiRk9STVwiKSB7XG4gICAgICAgIGZvcm0gPSBEcm9wem9uZS5jcmVhdGVFbGVtZW50KFwiPGZvcm0gYWN0aW9uPVxcXCJcIiArIHRoaXMub3B0aW9ucy51cmwgKyBcIlxcXCIgZW5jdHlwZT1cXFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVxcXCIgbWV0aG9kPVxcXCJcIiArIHRoaXMub3B0aW9ucy5tZXRob2QgKyBcIlxcXCI+PC9mb3JtPlwiKTtcbiAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChmaWVsZHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImVuY3R5cGVcIiwgXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWV0aG9kXCIsIHRoaXMub3B0aW9ucy5tZXRob2QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZvcm0gIT0gbnVsbCA/IGZvcm0gOiBmaWVsZHM7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5nZXRFeGlzdGluZ0ZhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZmFsbGJhY2ssIGdldEZhbGxiYWNrLCB0YWdOYW1lLCBfaSwgX2xlbiwgX3JlZjtcbiAgICAgIGdldEZhbGxiYWNrID0gZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICAgICAgdmFyIGVsLCBfaSwgX2xlbjtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBlbGVtZW50cy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGVsID0gZWxlbWVudHNbX2ldO1xuICAgICAgICAgIGlmICgvKF58IClmYWxsYmFjaygkfCApLy50ZXN0KGVsLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBfcmVmID0gW1wiZGl2XCIsIFwiZm9ybVwiXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICB0YWdOYW1lID0gX3JlZltfaV07XG4gICAgICAgIGlmIChmYWxsYmFjayA9IGdldEZhbGxiYWNrKHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWdOYW1lKSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnNldHVwRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbGVtZW50TGlzdGVuZXJzLCBldmVudCwgbGlzdGVuZXIsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgIF9yZWYgPSB0aGlzLmxpc3RlbmVycztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZWxlbWVudExpc3RlbmVycyA9IF9yZWZbX2ldO1xuICAgICAgICBfcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3JlZjEsIF9yZXN1bHRzMTtcbiAgICAgICAgICBfcmVmMSA9IGVsZW1lbnRMaXN0ZW5lcnMuZXZlbnRzO1xuICAgICAgICAgIF9yZXN1bHRzMSA9IFtdO1xuICAgICAgICAgIGZvciAoZXZlbnQgaW4gX3JlZjEpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyID0gX3JlZjFbZXZlbnRdO1xuICAgICAgICAgICAgX3Jlc3VsdHMxLnB1c2goZWxlbWVudExpc3RlbmVycy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHMxO1xuICAgICAgICB9KSgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWxlbWVudExpc3RlbmVycywgZXZlbnQsIGxpc3RlbmVyLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBfcmVmID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGVsZW1lbnRMaXN0ZW5lcnMgPSBfcmVmW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9yZWYxLCBfcmVzdWx0czE7XG4gICAgICAgICAgX3JlZjEgPSBlbGVtZW50TGlzdGVuZXJzLmV2ZW50cztcbiAgICAgICAgICBfcmVzdWx0czEgPSBbXTtcbiAgICAgICAgICBmb3IgKGV2ZW50IGluIF9yZWYxKSB7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IF9yZWYxW2V2ZW50XTtcbiAgICAgICAgICAgIF9yZXN1bHRzMS5wdXNoKGVsZW1lbnRMaXN0ZW5lcnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzMTtcbiAgICAgICAgfSkoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgdGhpcy5jbGlja2FibGVFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWNsaWNrYWJsZVwiKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgX3JlZiA9IHRoaXMuZmlsZXM7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBfcmVmW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmNhbmNlbFVwbG9hZChmaWxlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1jbGlja2FibGVcIik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLnNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmZpbGVzaXplID0gZnVuY3Rpb24oc2l6ZSkge1xuICAgICAgdmFyIGN1dG9mZiwgaSwgc2VsZWN0ZWRTaXplLCBzZWxlY3RlZFVuaXQsIHVuaXQsIHVuaXRzLCBfaSwgX2xlbjtcbiAgICAgIHNlbGVjdGVkU2l6ZSA9IDA7XG4gICAgICBzZWxlY3RlZFVuaXQgPSBcImJcIjtcbiAgICAgIGlmIChzaXplID4gMCkge1xuICAgICAgICB1bml0cyA9IFsnVEInLCAnR0InLCAnTUInLCAnS0InLCAnYiddO1xuICAgICAgICBmb3IgKGkgPSBfaSA9IDAsIF9sZW4gPSB1bml0cy5sZW5ndGg7IF9pIDwgX2xlbjsgaSA9ICsrX2kpIHtcbiAgICAgICAgICB1bml0ID0gdW5pdHNbaV07XG4gICAgICAgICAgY3V0b2ZmID0gTWF0aC5wb3codGhpcy5vcHRpb25zLmZpbGVzaXplQmFzZSwgNCAtIGkpIC8gMTA7XG4gICAgICAgICAgaWYgKHNpemUgPj0gY3V0b2ZmKSB7XG4gICAgICAgICAgICBzZWxlY3RlZFNpemUgPSBzaXplIC8gTWF0aC5wb3codGhpcy5vcHRpb25zLmZpbGVzaXplQmFzZSwgNCAtIGkpO1xuICAgICAgICAgICAgc2VsZWN0ZWRVbml0ID0gdW5pdDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZWxlY3RlZFNpemUgPSBNYXRoLnJvdW5kKDEwICogc2VsZWN0ZWRTaXplKSAvIDEwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwiPHN0cm9uZz5cIiArIHNlbGVjdGVkU2l6ZSArIFwiPC9zdHJvbmc+IFwiICsgc2VsZWN0ZWRVbml0O1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX3VwZGF0ZU1heEZpbGVzUmVhY2hlZENsYXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoKHRoaXMub3B0aW9ucy5tYXhGaWxlcyAhPSBudWxsKSAmJiB0aGlzLmdldEFjY2VwdGVkRmlsZXMoKS5sZW5ndGggPj0gdGhpcy5vcHRpb25zLm1heEZpbGVzKSB7XG4gICAgICAgIGlmICh0aGlzLmdldEFjY2VwdGVkRmlsZXMoKS5sZW5ndGggPT09IHRoaXMub3B0aW9ucy5tYXhGaWxlcykge1xuICAgICAgICAgIHRoaXMuZW1pdCgnbWF4ZmlsZXNyZWFjaGVkJywgdGhpcy5maWxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotbWF4LWZpbGVzLXJlYWNoZWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1tYXgtZmlsZXMtcmVhY2hlZFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmRyb3AgPSBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgZmlsZXMsIGl0ZW1zO1xuICAgICAgaWYgKCFlLmRhdGFUcmFuc2Zlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmVtaXQoXCJkcm9wXCIsIGUpO1xuICAgICAgZmlsZXMgPSBlLmRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgIHRoaXMuZW1pdChcImFkZGVkZmlsZXNcIiwgZmlsZXMpO1xuICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICBpdGVtcyA9IGUuZGF0YVRyYW5zZmVyLml0ZW1zO1xuICAgICAgICBpZiAoaXRlbXMgJiYgaXRlbXMubGVuZ3RoICYmIChpdGVtc1swXS53ZWJraXRHZXRBc0VudHJ5ICE9IG51bGwpKSB7XG4gICAgICAgICAgdGhpcy5fYWRkRmlsZXNGcm9tSXRlbXMoaXRlbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaGFuZGxlRmlsZXMoZmlsZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5wYXN0ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBpdGVtcywgX3JlZjtcbiAgICAgIGlmICgoZSAhPSBudWxsID8gKF9yZWYgPSBlLmNsaXBib2FyZERhdGEpICE9IG51bGwgPyBfcmVmLml0ZW1zIDogdm9pZCAwIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdChcInBhc3RlXCIsIGUpO1xuICAgICAgaXRlbXMgPSBlLmNsaXBib2FyZERhdGEuaXRlbXM7XG4gICAgICBpZiAoaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRGaWxlc0Zyb21JdGVtcyhpdGVtcyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5oYW5kbGVGaWxlcyA9IGZ1bmN0aW9uKGZpbGVzKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IGZpbGVzW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmFkZEZpbGUoZmlsZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX2FkZEZpbGVzRnJvbUl0ZW1zID0gZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgIHZhciBlbnRyeSwgaXRlbSwgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gaXRlbXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgaXRlbSA9IGl0ZW1zW19pXTtcbiAgICAgICAgaWYgKChpdGVtLndlYmtpdEdldEFzRW50cnkgIT0gbnVsbCkgJiYgKGVudHJ5ID0gaXRlbS53ZWJraXRHZXRBc0VudHJ5KCkpKSB7XG4gICAgICAgICAgaWYgKGVudHJ5LmlzRmlsZSkge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmFkZEZpbGUoaXRlbS5nZXRBc0ZpbGUoKSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZW50cnkuaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5fYWRkRmlsZXNGcm9tRGlyZWN0b3J5KGVudHJ5LCBlbnRyeS5uYW1lKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbS5nZXRBc0ZpbGUgIT0gbnVsbCkge1xuICAgICAgICAgIGlmICgoaXRlbS5raW5kID09IG51bGwpIHx8IGl0ZW0ua2luZCA9PT0gXCJmaWxlXCIpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5hZGRGaWxlKGl0ZW0uZ2V0QXNGaWxlKCkpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9hZGRGaWxlc0Zyb21EaXJlY3RvcnkgPSBmdW5jdGlvbihkaXJlY3RvcnksIHBhdGgpIHtcbiAgICAgIHZhciBkaXJSZWFkZXIsIGVycm9ySGFuZGxlciwgcmVhZEVudHJpZXM7XG4gICAgICBkaXJSZWFkZXIgPSBkaXJlY3RvcnkuY3JlYXRlUmVhZGVyKCk7XG4gICAgICBlcnJvckhhbmRsZXIgPSBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCA/IHR5cGVvZiBjb25zb2xlLmxvZyA9PT0gXCJmdW5jdGlvblwiID8gY29uc29sZS5sb2coZXJyb3IpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgfTtcbiAgICAgIHJlYWRFbnRyaWVzID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZGlyUmVhZGVyLnJlYWRFbnRyaWVzKGZ1bmN0aW9uKGVudHJpZXMpIHtcbiAgICAgICAgICAgIHZhciBlbnRyeSwgX2ksIF9sZW47XG4gICAgICAgICAgICBpZiAoZW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZW50cmllcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICAgIGVudHJ5ID0gZW50cmllc1tfaV07XG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5LmlzRmlsZSkge1xuICAgICAgICAgICAgICAgICAgZW50cnkuZmlsZShmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmlnbm9yZUhpZGRlbkZpbGVzICYmIGZpbGUubmFtZS5zdWJzdHJpbmcoMCwgMSkgPT09ICcuJykge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmaWxlLmZ1bGxQYXRoID0gXCJcIiArIHBhdGggKyBcIi9cIiArIGZpbGUubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmFkZEZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgICBfdGhpcy5fYWRkRmlsZXNGcm9tRGlyZWN0b3J5KGVudHJ5LCBcIlwiICsgcGF0aCArIFwiL1wiICsgZW50cnkubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlYWRFbnRyaWVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9LCBlcnJvckhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICByZXR1cm4gcmVhZEVudHJpZXMoKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uKGZpbGUsIGRvbmUpIHtcbiAgICAgIGlmIChmaWxlLnNpemUgPiB0aGlzLm9wdGlvbnMubWF4RmlsZXNpemUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgICByZXR1cm4gZG9uZSh0aGlzLm9wdGlvbnMuZGljdEZpbGVUb29CaWcucmVwbGFjZShcInt7ZmlsZXNpemV9fVwiLCBNYXRoLnJvdW5kKGZpbGUuc2l6ZSAvIDEwMjQgLyAxMC4yNCkgLyAxMDApLnJlcGxhY2UoXCJ7e21heEZpbGVzaXplfX1cIiwgdGhpcy5vcHRpb25zLm1heEZpbGVzaXplKSk7XG4gICAgICB9IGVsc2UgaWYgKCFEcm9wem9uZS5pc1ZhbGlkRmlsZShmaWxlLCB0aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcykpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUodGhpcy5vcHRpb25zLmRpY3RJbnZhbGlkRmlsZVR5cGUpO1xuICAgICAgfSBlbHNlIGlmICgodGhpcy5vcHRpb25zLm1heEZpbGVzICE9IG51bGwpICYmIHRoaXMuZ2V0QWNjZXB0ZWRGaWxlcygpLmxlbmd0aCA+PSB0aGlzLm9wdGlvbnMubWF4RmlsZXMpIHtcbiAgICAgICAgZG9uZSh0aGlzLm9wdGlvbnMuZGljdE1heEZpbGVzRXhjZWVkZWQucmVwbGFjZShcInt7bWF4RmlsZXN9fVwiLCB0aGlzLm9wdGlvbnMubWF4RmlsZXMpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1pdChcIm1heGZpbGVzZXhjZWVkZWRcIiwgZmlsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFjY2VwdC5jYWxsKHRoaXMsIGZpbGUsIGRvbmUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuYWRkRmlsZSA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIGZpbGUudXBsb2FkID0ge1xuICAgICAgICBwcm9ncmVzczogMCxcbiAgICAgICAgdG90YWw6IGZpbGUuc2l6ZSxcbiAgICAgICAgYnl0ZXNTZW50OiAwXG4gICAgICB9O1xuICAgICAgdGhpcy5maWxlcy5wdXNoKGZpbGUpO1xuICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5BRERFRDtcbiAgICAgIHRoaXMuZW1pdChcImFkZGVkZmlsZVwiLCBmaWxlKTtcbiAgICAgIHRoaXMuX2VucXVldWVUaHVtYm5haWwoZmlsZSk7XG4gICAgICByZXR1cm4gdGhpcy5hY2NlcHQoZmlsZSwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgZmlsZS5hY2NlcHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgX3RoaXMuX2Vycm9yUHJvY2Vzc2luZyhbZmlsZV0sIGVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsZS5hY2NlcHRlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5hdXRvUXVldWUpIHtcbiAgICAgICAgICAgICAgX3RoaXMuZW5xdWV1ZUZpbGUoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfdGhpcy5fdXBkYXRlTWF4RmlsZXNSZWFjaGVkQ2xhc3MoKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmVucXVldWVGaWxlcyA9IGZ1bmN0aW9uKGZpbGVzKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW47XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGZpbGVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBmaWxlc1tfaV07XG4gICAgICAgIHRoaXMuZW5xdWV1ZUZpbGUoZmlsZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLmVucXVldWVGaWxlID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5BRERFRCAmJiBmaWxlLmFjY2VwdGVkID09PSB0cnVlKSB7XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuUVVFVUVEO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Qcm9jZXNzUXVldWUpIHtcbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9jZXNzUXVldWUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkodGhpcykpLCAwKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBmaWxlIGNhbid0IGJlIHF1ZXVlZCBiZWNhdXNlIGl0IGhhcyBhbHJlYWR5IGJlZW4gcHJvY2Vzc2VkIG9yIHdhcyByZWplY3RlZC5cIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5fdGh1bWJuYWlsUXVldWUgPSBbXTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5fcHJvY2Vzc2luZ1RodW1ibmFpbCA9IGZhbHNlO1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9lbnF1ZXVlVGh1bWJuYWlsID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jcmVhdGVJbWFnZVRodW1ibmFpbHMgJiYgZmlsZS50eXBlLm1hdGNoKC9pbWFnZS4qLykgJiYgZmlsZS5zaXplIDw9IHRoaXMub3B0aW9ucy5tYXhUaHVtYm5haWxGaWxlc2l6ZSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHRoaXMuX3RodW1ibmFpbFF1ZXVlLnB1c2goZmlsZSk7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX3Byb2Nlc3NUaHVtYm5haWxRdWV1ZSgpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpKSwgMCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5fcHJvY2Vzc1RodW1ibmFpbFF1ZXVlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fcHJvY2Vzc2luZ1RodW1ibmFpbCB8fCB0aGlzLl90aHVtYm5haWxRdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fcHJvY2Vzc2luZ1RodW1ibmFpbCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVUaHVtYm5haWwodGhpcy5fdGh1bWJuYWlsUXVldWUuc2hpZnQoKSwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBfdGhpcy5fcHJvY2Vzc2luZ1RodW1ibmFpbCA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBfdGhpcy5fcHJvY2Vzc1RodW1ibmFpbFF1ZXVlKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5yZW1vdmVGaWxlID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5VUExPQURJTkcpIHtcbiAgICAgICAgdGhpcy5jYW5jZWxVcGxvYWQoZmlsZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmZpbGVzID0gd2l0aG91dCh0aGlzLmZpbGVzLCBmaWxlKTtcbiAgICAgIHRoaXMuZW1pdChcInJlbW92ZWRmaWxlXCIsIGZpbGUpO1xuICAgICAgaWYgKHRoaXMuZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXQoXCJyZXNldFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnJlbW92ZUFsbEZpbGVzID0gZnVuY3Rpb24oY2FuY2VsSWZOZWNlc3NhcnkpIHtcbiAgICAgIHZhciBmaWxlLCBfaSwgX2xlbiwgX3JlZjtcbiAgICAgIGlmIChjYW5jZWxJZk5lY2Vzc2FyeSA9PSBudWxsKSB7XG4gICAgICAgIGNhbmNlbElmTmVjZXNzYXJ5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBfcmVmID0gdGhpcy5maWxlcy5zbGljZSgpO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBfcmVmW19pXTtcbiAgICAgICAgaWYgKGZpbGUuc3RhdHVzICE9PSBEcm9wem9uZS5VUExPQURJTkcgfHwgY2FuY2VsSWZOZWNlc3NhcnkpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUZpbGUoZmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuY3JlYXRlVGh1bWJuYWlsID0gZnVuY3Rpb24oZmlsZSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBmaWxlUmVhZGVyO1xuICAgICAgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyO1xuICAgICAgZmlsZVJlYWRlci5vbmxvYWQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChmaWxlLnR5cGUgPT09IFwiaW1hZ2Uvc3ZnK3htbFwiKSB7XG4gICAgICAgICAgICBfdGhpcy5lbWl0KFwidGh1bWJuYWlsXCIsIGZpbGUsIGZpbGVSZWFkZXIucmVzdWx0KTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfdGhpcy5jcmVhdGVUaHVtYm5haWxGcm9tVXJsKGZpbGUsIGZpbGVSZWFkZXIucmVzdWx0LCBjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIHJldHVybiBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgfTtcblxuICAgIERyb3B6b25lLnByb3RvdHlwZS5jcmVhdGVUaHVtYm5haWxGcm9tVXJsID0gZnVuY3Rpb24oZmlsZSwgaW1hZ2VVcmwsIGNhbGxiYWNrLCBjcm9zc09yaWdpbikge1xuICAgICAgdmFyIGltZztcbiAgICAgIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICBpZiAoY3Jvc3NPcmlnaW4pIHtcbiAgICAgICAgaW1nLmNyb3NzT3JpZ2luID0gY3Jvc3NPcmlnaW47XG4gICAgICB9XG4gICAgICBpbWcub25sb2FkID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgY2FudmFzLCBjdHgsIHJlc2l6ZUluZm8sIHRodW1ibmFpbCwgX3JlZiwgX3JlZjEsIF9yZWYyLCBfcmVmMztcbiAgICAgICAgICBmaWxlLndpZHRoID0gaW1nLndpZHRoO1xuICAgICAgICAgIGZpbGUuaGVpZ2h0ID0gaW1nLmhlaWdodDtcbiAgICAgICAgICByZXNpemVJbmZvID0gX3RoaXMub3B0aW9ucy5yZXNpemUuY2FsbChfdGhpcywgZmlsZSk7XG4gICAgICAgICAgaWYgKHJlc2l6ZUluZm8udHJnV2lkdGggPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzaXplSW5mby50cmdXaWR0aCA9IHJlc2l6ZUluZm8ub3B0V2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNpemVJbmZvLnRyZ0hlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXNpemVJbmZvLnRyZ0hlaWdodCA9IHJlc2l6ZUluZm8ub3B0SGVpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gcmVzaXplSW5mby50cmdXaWR0aDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gcmVzaXplSW5mby50cmdIZWlnaHQ7XG4gICAgICAgICAgZHJhd0ltYWdlSU9TRml4KGN0eCwgaW1nLCAoX3JlZiA9IHJlc2l6ZUluZm8uc3JjWCkgIT0gbnVsbCA/IF9yZWYgOiAwLCAoX3JlZjEgPSByZXNpemVJbmZvLnNyY1kpICE9IG51bGwgPyBfcmVmMSA6IDAsIHJlc2l6ZUluZm8uc3JjV2lkdGgsIHJlc2l6ZUluZm8uc3JjSGVpZ2h0LCAoX3JlZjIgPSByZXNpemVJbmZvLnRyZ1gpICE9IG51bGwgPyBfcmVmMiA6IDAsIChfcmVmMyA9IHJlc2l6ZUluZm8udHJnWSkgIT0gbnVsbCA/IF9yZWYzIDogMCwgcmVzaXplSW5mby50cmdXaWR0aCwgcmVzaXplSW5mby50cmdIZWlnaHQpO1xuICAgICAgICAgIHRodW1ibmFpbCA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XG4gICAgICAgICAgX3RoaXMuZW1pdChcInRodW1ibmFpbFwiLCBmaWxlLCB0aHVtYm5haWwpO1xuICAgICAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgIGltZy5vbmVycm9yID0gY2FsbGJhY2s7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW1nLnNyYyA9IGltYWdlVXJsO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUucHJvY2Vzc1F1ZXVlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSwgcGFyYWxsZWxVcGxvYWRzLCBwcm9jZXNzaW5nTGVuZ3RoLCBxdWV1ZWRGaWxlcztcbiAgICAgIHBhcmFsbGVsVXBsb2FkcyA9IHRoaXMub3B0aW9ucy5wYXJhbGxlbFVwbG9hZHM7XG4gICAgICBwcm9jZXNzaW5nTGVuZ3RoID0gdGhpcy5nZXRVcGxvYWRpbmdGaWxlcygpLmxlbmd0aDtcbiAgICAgIGkgPSBwcm9jZXNzaW5nTGVuZ3RoO1xuICAgICAgaWYgKHByb2Nlc3NpbmdMZW5ndGggPj0gcGFyYWxsZWxVcGxvYWRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHF1ZXVlZEZpbGVzID0gdGhpcy5nZXRRdWV1ZWRGaWxlcygpO1xuICAgICAgaWYgKCEocXVldWVkRmlsZXMubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzRmlsZXMocXVldWVkRmlsZXMuc2xpY2UoMCwgcGFyYWxsZWxVcGxvYWRzIC0gcHJvY2Vzc2luZ0xlbmd0aCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKGkgPCBwYXJhbGxlbFVwbG9hZHMpIHtcbiAgICAgICAgICBpZiAoIXF1ZXVlZEZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnByb2Nlc3NGaWxlKHF1ZXVlZEZpbGVzLnNoaWZ0KCkpO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUucHJvY2Vzc0ZpbGUgPSBmdW5jdGlvbihmaWxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9jZXNzRmlsZXMoW2ZpbGVdKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnByb2Nlc3NGaWxlcyA9IGZ1bmN0aW9uKGZpbGVzKSB7XG4gICAgICB2YXIgZmlsZSwgX2ksIF9sZW47XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGZpbGVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZpbGUgPSBmaWxlc1tfaV07XG4gICAgICAgIGZpbGUucHJvY2Vzc2luZyA9IHRydWU7XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuVVBMT0FESU5HO1xuICAgICAgICB0aGlzLmVtaXQoXCJwcm9jZXNzaW5nXCIsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmVtaXQoXCJwcm9jZXNzaW5nbXVsdGlwbGVcIiwgZmlsZXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMudXBsb2FkRmlsZXMoZmlsZXMpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX2dldEZpbGVzV2l0aFhociA9IGZ1bmN0aW9uKHhocikge1xuICAgICAgdmFyIGZpbGUsIGZpbGVzO1xuICAgICAgcmV0dXJuIGZpbGVzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgICBfcmVmID0gdGhpcy5maWxlcztcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgZmlsZSA9IF9yZWZbX2ldO1xuICAgICAgICAgIGlmIChmaWxlLnhociA9PT0geGhyKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGZpbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9KS5jYWxsKHRoaXMpO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuY2FuY2VsVXBsb2FkID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgdmFyIGdyb3VwZWRGaWxlLCBncm91cGVkRmlsZXMsIF9pLCBfaiwgX2xlbiwgX2xlbjEsIF9yZWY7XG4gICAgICBpZiAoZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLlVQTE9BRElORykge1xuICAgICAgICBncm91cGVkRmlsZXMgPSB0aGlzLl9nZXRGaWxlc1dpdGhYaHIoZmlsZS54aHIpO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGdyb3VwZWRGaWxlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGdyb3VwZWRGaWxlID0gZ3JvdXBlZEZpbGVzW19pXTtcbiAgICAgICAgICBncm91cGVkRmlsZS5zdGF0dXMgPSBEcm9wem9uZS5DQU5DRUxFRDtcbiAgICAgICAgfVxuICAgICAgICBmaWxlLnhoci5hYm9ydCgpO1xuICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBncm91cGVkRmlsZXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgZ3JvdXBlZEZpbGUgPSBncm91cGVkRmlsZXNbX2pdO1xuICAgICAgICAgIHRoaXMuZW1pdChcImNhbmNlbGVkXCIsIGdyb3VwZWRGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2FuY2VsZWRtdWx0aXBsZVwiLCBncm91cGVkRmlsZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKChfcmVmID0gZmlsZS5zdGF0dXMpID09PSBEcm9wem9uZS5BRERFRCB8fCBfcmVmID09PSBEcm9wem9uZS5RVUVVRUQpIHtcbiAgICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5DQU5DRUxFRDtcbiAgICAgICAgdGhpcy5lbWl0KFwiY2FuY2VsZWRcIiwgZmlsZSk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoXCJjYW5jZWxlZG11bHRpcGxlXCIsIFtmaWxlXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1Byb2Nlc3NRdWV1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzUXVldWUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVzb2x2ZU9wdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MsIG9wdGlvbjtcbiAgICAgIG9wdGlvbiA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gb3B0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnVwbG9hZEZpbGUgPSBmdW5jdGlvbihmaWxlKSB7XG4gICAgICByZXR1cm4gdGhpcy51cGxvYWRGaWxlcyhbZmlsZV0pO1xuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUudXBsb2FkRmlsZXMgPSBmdW5jdGlvbihmaWxlcykge1xuICAgICAgdmFyIGZpbGUsIGZvcm1EYXRhLCBoYW5kbGVFcnJvciwgaGVhZGVyTmFtZSwgaGVhZGVyVmFsdWUsIGhlYWRlcnMsIGksIGlucHV0LCBpbnB1dE5hbWUsIGlucHV0VHlwZSwga2V5LCBtZXRob2QsIG9wdGlvbiwgcHJvZ3Jlc3NPYmosIHJlc3BvbnNlLCB1cGRhdGVQcm9ncmVzcywgdXJsLCB2YWx1ZSwgeGhyLCBfaSwgX2osIF9rLCBfbCwgX2xlbiwgX2xlbjEsIF9sZW4yLCBfbGVuMywgX20sIF9yZWYsIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZWY0LCBfcmVmNTtcbiAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBmaWxlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmaWxlID0gZmlsZXNbX2ldO1xuICAgICAgICBmaWxlLnhociA9IHhocjtcbiAgICAgIH1cbiAgICAgIG1ldGhvZCA9IHJlc29sdmVPcHRpb24odGhpcy5vcHRpb25zLm1ldGhvZCwgZmlsZXMpO1xuICAgICAgdXJsID0gcmVzb2x2ZU9wdGlvbih0aGlzLm9wdGlvbnMudXJsLCBmaWxlcyk7XG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gISF0aGlzLm9wdGlvbnMud2l0aENyZWRlbnRpYWxzO1xuICAgICAgcmVzcG9uc2UgPSBudWxsO1xuICAgICAgaGFuZGxlRXJyb3IgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfaiwgX2xlbjEsIF9yZXN1bHRzO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gZmlsZXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgICBmaWxlID0gZmlsZXNbX2pdO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChfdGhpcy5fZXJyb3JQcm9jZXNzaW5nKGZpbGVzLCByZXNwb25zZSB8fCBfdGhpcy5vcHRpb25zLmRpY3RSZXNwb25zZUVycm9yLnJlcGxhY2UoXCJ7e3N0YXR1c0NvZGV9fVwiLCB4aHIuc3RhdHVzKSwgeGhyKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgdXBkYXRlUHJvZ3Jlc3MgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICB2YXIgYWxsRmlsZXNGaW5pc2hlZCwgcHJvZ3Jlc3MsIF9qLCBfaywgX2wsIF9sZW4xLCBfbGVuMiwgX2xlbjMsIF9yZXN1bHRzO1xuICAgICAgICAgIGlmIChlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHByb2dyZXNzID0gMTAwICogZS5sb2FkZWQgLyBlLnRvdGFsO1xuICAgICAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gZmlsZXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgICAgIGZpbGUgPSBmaWxlc1tfal07XG4gICAgICAgICAgICAgIGZpbGUudXBsb2FkID0ge1xuICAgICAgICAgICAgICAgIHByb2dyZXNzOiBwcm9ncmVzcyxcbiAgICAgICAgICAgICAgICB0b3RhbDogZS50b3RhbCxcbiAgICAgICAgICAgICAgICBieXRlc1NlbnQ6IGUubG9hZGVkXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsbEZpbGVzRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgcHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBmaWxlcy5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICAgICAgZmlsZSA9IGZpbGVzW19rXTtcbiAgICAgICAgICAgICAgaWYgKCEoZmlsZS51cGxvYWQucHJvZ3Jlc3MgPT09IDEwMCAmJiBmaWxlLnVwbG9hZC5ieXRlc1NlbnQgPT09IGZpbGUudXBsb2FkLnRvdGFsKSkge1xuICAgICAgICAgICAgICAgIGFsbEZpbGVzRmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmaWxlLnVwbG9hZC5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgICAgICAgICBmaWxlLnVwbG9hZC5ieXRlc1NlbnQgPSBmaWxlLnVwbG9hZC50b3RhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbGxGaWxlc0ZpbmlzaGVkKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9sID0gMCwgX2xlbjMgPSBmaWxlcy5sZW5ndGg7IF9sIDwgX2xlbjM7IF9sKyspIHtcbiAgICAgICAgICAgIGZpbGUgPSBmaWxlc1tfbF07XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKF90aGlzLmVtaXQoXCJ1cGxvYWRwcm9ncmVzc1wiLCBmaWxlLCBwcm9ncmVzcywgZmlsZS51cGxvYWQuYnl0ZXNTZW50KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgeGhyLm9ubG9hZCA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHZhciBfcmVmO1xuICAgICAgICAgIGlmIChmaWxlc1swXS5zdGF0dXMgPT09IERyb3B6b25lLkNBTkNFTEVEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgaWYgKHhoci5nZXRSZXNwb25zZUhlYWRlcihcImNvbnRlbnQtdHlwZVwiKSAmJiB+eGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiY29udGVudC10eXBlXCIpLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgICAgICAgIGUgPSBfZXJyb3I7XG4gICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJJbnZhbGlkIEpTT04gcmVzcG9uc2UgZnJvbSBzZXJ2ZXIuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHVwZGF0ZVByb2dyZXNzKCk7XG4gICAgICAgICAgaWYgKCEoKDIwMCA8PSAoX3JlZiA9IHhoci5zdGF0dXMpICYmIF9yZWYgPCAzMDApKSkge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fZmluaXNoZWQoZmlsZXMsIHJlc3BvbnNlLCBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIHhoci5vbmVycm9yID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoZmlsZXNbMF0uc3RhdHVzID09PSBEcm9wem9uZS5DQU5DRUxFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gaGFuZGxlRXJyb3IoKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgcHJvZ3Jlc3NPYmogPSAoX3JlZiA9IHhoci51cGxvYWQpICE9IG51bGwgPyBfcmVmIDogeGhyO1xuICAgICAgcHJvZ3Jlc3NPYmoub25wcm9ncmVzcyA9IHVwZGF0ZVByb2dyZXNzO1xuICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcIm5vLWNhY2hlXCIsXG4gICAgICAgIFwiWC1SZXF1ZXN0ZWQtV2l0aFwiOiBcIlhNTEh0dHBSZXF1ZXN0XCJcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgZXh0ZW5kKGhlYWRlcnMsIHRoaXMub3B0aW9ucy5oZWFkZXJzKTtcbiAgICAgIH1cbiAgICAgIGZvciAoaGVhZGVyTmFtZSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIGhlYWRlclZhbHVlID0gaGVhZGVyc1toZWFkZXJOYW1lXTtcbiAgICAgICAgaWYgKGhlYWRlclZhbHVlKSB7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyTmFtZSwgaGVhZGVyVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYXJhbXMpIHtcbiAgICAgICAgX3JlZjEgPSB0aGlzLm9wdGlvbnMucGFyYW1zO1xuICAgICAgICBmb3IgKGtleSBpbiBfcmVmMSkge1xuICAgICAgICAgIHZhbHVlID0gX3JlZjFba2V5XTtcbiAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IGZpbGVzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBmaWxlID0gZmlsZXNbX2pdO1xuICAgICAgICB0aGlzLmVtaXQoXCJzZW5kaW5nXCIsIGZpbGUsIHhociwgZm9ybURhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmVtaXQoXCJzZW5kaW5nbXVsdGlwbGVcIiwgZmlsZXMsIHhociwgZm9ybURhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09PSBcIkZPUk1cIikge1xuICAgICAgICBfcmVmMiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QsIGJ1dHRvblwiKTtcbiAgICAgICAgZm9yIChfayA9IDAsIF9sZW4yID0gX3JlZjIubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgICAgICAgaW5wdXQgPSBfcmVmMltfa107XG4gICAgICAgICAgaW5wdXROYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICAgICAgICBpbnB1dFR5cGUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpO1xuICAgICAgICAgIGlmIChpbnB1dC50YWdOYW1lID09PSBcIlNFTEVDVFwiICYmIGlucHV0Lmhhc0F0dHJpYnV0ZShcIm11bHRpcGxlXCIpKSB7XG4gICAgICAgICAgICBfcmVmMyA9IGlucHV0Lm9wdGlvbnM7XG4gICAgICAgICAgICBmb3IgKF9sID0gMCwgX2xlbjMgPSBfcmVmMy5sZW5ndGg7IF9sIDwgX2xlbjM7IF9sKyspIHtcbiAgICAgICAgICAgICAgb3B0aW9uID0gX3JlZjNbX2xdO1xuICAgICAgICAgICAgICBpZiAob3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGlucHV0TmFtZSwgb3B0aW9uLnZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoIWlucHV0VHlwZSB8fCAoKF9yZWY0ID0gaW5wdXRUeXBlLnRvTG93ZXJDYXNlKCkpICE9PSBcImNoZWNrYm94XCIgJiYgX3JlZjQgIT09IFwicmFkaW9cIikgfHwgaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGlucHV0TmFtZSwgaW5wdXQudmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpID0gX20gPSAwLCBfcmVmNSA9IGZpbGVzLmxlbmd0aCAtIDE7IDAgPD0gX3JlZjUgPyBfbSA8PSBfcmVmNSA6IF9tID49IF9yZWY1OyBpID0gMCA8PSBfcmVmNSA/ICsrX20gOiAtLV9tKSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCh0aGlzLl9nZXRQYXJhbU5hbWUoaSksIGZpbGVzW2ldLCB0aGlzLl9yZW5hbWVGaWxlbmFtZShmaWxlc1tpXS5uYW1lKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5zdWJtaXRSZXF1ZXN0KHhociwgZm9ybURhdGEsIGZpbGVzKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLnN1Ym1pdFJlcXVlc3QgPSBmdW5jdGlvbih4aHIsIGZvcm1EYXRhLCBmaWxlcykge1xuICAgICAgcmV0dXJuIHhoci5zZW5kKGZvcm1EYXRhKTtcbiAgICB9O1xuXG4gICAgRHJvcHpvbmUucHJvdG90eXBlLl9maW5pc2hlZCA9IGZ1bmN0aW9uKGZpbGVzLCByZXNwb25zZVRleHQsIGUpIHtcbiAgICAgIHZhciBmaWxlLCBfaSwgX2xlbjtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IGZpbGVzW19pXTtcbiAgICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5TVUNDRVNTO1xuICAgICAgICB0aGlzLmVtaXQoXCJzdWNjZXNzXCIsIGZpbGUsIHJlc3BvbnNlVGV4dCwgZSk7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmVtaXQoXCJzdWNjZXNzbXVsdGlwbGVcIiwgZmlsZXMsIHJlc3BvbnNlVGV4dCwgZSk7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlbXVsdGlwbGVcIiwgZmlsZXMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUHJvY2Vzc1F1ZXVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBEcm9wem9uZS5wcm90b3R5cGUuX2Vycm9yUHJvY2Vzc2luZyA9IGZ1bmN0aW9uKGZpbGVzLCBtZXNzYWdlLCB4aHIpIHtcbiAgICAgIHZhciBmaWxlLCBfaSwgX2xlbjtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZmlsZSA9IGZpbGVzW19pXTtcbiAgICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5FUlJPUjtcbiAgICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgZmlsZSwgbWVzc2FnZSwgeGhyKTtcbiAgICAgICAgdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuZW1pdChcImVycm9ybXVsdGlwbGVcIiwgZmlsZXMsIG1lc3NhZ2UsIHhocik7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlbXVsdGlwbGVcIiwgZmlsZXMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUHJvY2Vzc1F1ZXVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gRHJvcHpvbmU7XG5cbiAgfSkoRW1pdHRlcik7XG5cbiAgRHJvcHpvbmUudmVyc2lvbiA9IFwiNC4zLjBcIjtcblxuICBEcm9wem9uZS5vcHRpb25zID0ge307XG5cbiAgRHJvcHpvbmUub3B0aW9uc0ZvckVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaWRcIikpIHtcbiAgICAgIHJldHVybiBEcm9wem9uZS5vcHRpb25zW2NhbWVsaXplKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaWRcIikpXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gIH07XG5cbiAgRHJvcHpvbmUuaW5zdGFuY2VzID0gW107XG5cbiAgRHJvcHpvbmUuZm9yRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpO1xuICAgIH1cbiAgICBpZiAoKGVsZW1lbnQgIT0gbnVsbCA/IGVsZW1lbnQuZHJvcHpvbmUgOiB2b2lkIDApID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIERyb3B6b25lIGZvdW5kIGZvciBnaXZlbiBlbGVtZW50LiBUaGlzIGlzIHByb2JhYmx5IGJlY2F1c2UgeW91J3JlIHRyeWluZyB0byBhY2Nlc3MgaXQgYmVmb3JlIERyb3B6b25lIGhhZCB0aGUgdGltZSB0byBpbml0aWFsaXplLiBVc2UgdGhlIGBpbml0YCBvcHRpb24gdG8gc2V0dXAgYW55IGFkZGl0aW9uYWwgb2JzZXJ2ZXJzIG9uIHlvdXIgRHJvcHpvbmUuXCIpO1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudC5kcm9wem9uZTtcbiAgfTtcblxuICBEcm9wem9uZS5hdXRvRGlzY292ZXIgPSB0cnVlO1xuXG4gIERyb3B6b25lLmRpc2NvdmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoZWNrRWxlbWVudHMsIGRyb3B6b25lLCBkcm9wem9uZXMsIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCkge1xuICAgICAgZHJvcHpvbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kcm9wem9uZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZHJvcHpvbmVzID0gW107XG4gICAgICBjaGVja0VsZW1lbnRzID0gZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICAgICAgdmFyIGVsLCBfaSwgX2xlbiwgX3Jlc3VsdHM7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZWxlbWVudHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBlbCA9IGVsZW1lbnRzW19pXTtcbiAgICAgICAgICBpZiAoLyhefCApZHJvcHpvbmUoJHwgKS8udGVzdChlbC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGRyb3B6b25lcy5wdXNoKGVsKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfTtcbiAgICAgIGNoZWNrRWxlbWVudHMoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkaXZcIikpO1xuICAgICAgY2hlY2tFbGVtZW50cyhkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImZvcm1cIikpO1xuICAgIH1cbiAgICBfcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZHJvcHpvbmVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBkcm9wem9uZSA9IGRyb3B6b25lc1tfaV07XG4gICAgICBpZiAoRHJvcHpvbmUub3B0aW9uc0ZvckVsZW1lbnQoZHJvcHpvbmUpICE9PSBmYWxzZSkge1xuICAgICAgICBfcmVzdWx0cy5wdXNoKG5ldyBEcm9wem9uZShkcm9wem9uZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG5cbiAgRHJvcHpvbmUuYmxhY2tsaXN0ZWRCcm93c2VycyA9IFsvb3BlcmEuKk1hY2ludG9zaC4qdmVyc2lvblxcLzEyL2ldO1xuXG4gIERyb3B6b25lLmlzQnJvd3NlclN1cHBvcnRlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYXBhYmxlQnJvd3NlciwgcmVnZXgsIF9pLCBfbGVuLCBfcmVmO1xuICAgIGNhcGFibGVCcm93c2VyID0gdHJ1ZTtcbiAgICBpZiAod2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iICYmIHdpbmRvdy5Gb3JtRGF0YSAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKSB7XG4gICAgICBpZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpKSkge1xuICAgICAgICBjYXBhYmxlQnJvd3NlciA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3JlZiA9IERyb3B6b25lLmJsYWNrbGlzdGVkQnJvd3NlcnM7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIHJlZ2V4ID0gX3JlZltfaV07XG4gICAgICAgICAgaWYgKHJlZ2V4LnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgICAgIGNhcGFibGVCcm93c2VyID0gZmFsc2U7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2FwYWJsZUJyb3dzZXIgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGNhcGFibGVCcm93c2VyO1xuICB9O1xuXG4gIHdpdGhvdXQgPSBmdW5jdGlvbihsaXN0LCByZWplY3RlZEl0ZW0pIHtcbiAgICB2YXIgaXRlbSwgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgIF9yZXN1bHRzID0gW107XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBsaXN0Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBpdGVtID0gbGlzdFtfaV07XG4gICAgICBpZiAoaXRlbSAhPT0gcmVqZWN0ZWRJdGVtKSB7XG4gICAgICAgIF9yZXN1bHRzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfcmVzdWx0cztcbiAgfTtcblxuICBjYW1lbGl6ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLV9dKFxcdykvZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXRjaC5jaGFyQXQoMSkudG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbiAgfTtcblxuICBEcm9wem9uZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgdmFyIGRpdjtcbiAgICBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5pbm5lckhUTUwgPSBzdHJpbmc7XG4gICAgcmV0dXJuIGRpdi5jaGlsZE5vZGVzWzBdO1xuICB9O1xuXG4gIERyb3B6b25lLmVsZW1lbnRJbnNpZGUgPSBmdW5jdGlvbihlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIGlmIChlbGVtZW50ID09PSBjb250YWluZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBEcm9wem9uZS5nZXRFbGVtZW50ID0gZnVuY3Rpb24oZWwsIG5hbWUpIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBpZiAodHlwZW9mIGVsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgfSBlbHNlIGlmIChlbC5ub2RlVHlwZSAhPSBudWxsKSB7XG4gICAgICBlbGVtZW50ID0gZWw7XG4gICAgfVxuICAgIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYFwiICsgbmFtZSArIFwiYCBvcHRpb24gcHJvdmlkZWQuIFBsZWFzZSBwcm92aWRlIGEgQ1NTIHNlbGVjdG9yIG9yIGEgcGxhaW4gSFRNTCBlbGVtZW50LlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH07XG5cbiAgRHJvcHpvbmUuZ2V0RWxlbWVudHMgPSBmdW5jdGlvbihlbHMsIG5hbWUpIHtcbiAgICB2YXIgZSwgZWwsIGVsZW1lbnRzLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmO1xuICAgIGlmIChlbHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgZWxlbWVudHMgPSBbXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZWxzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgZWwgPSBlbHNbX2ldO1xuICAgICAgICAgIGVsZW1lbnRzLnB1c2godGhpcy5nZXRFbGVtZW50KGVsLCBuYW1lKSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgICBlbGVtZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZWxzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBlbGVtZW50cyA9IFtdO1xuICAgICAgX3JlZiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxzKTtcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIGVsID0gX3JlZltfal07XG4gICAgICAgIGVsZW1lbnRzLnB1c2goZWwpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZWxzLm5vZGVUeXBlICE9IG51bGwpIHtcbiAgICAgIGVsZW1lbnRzID0gW2Vsc107XG4gICAgfVxuICAgIGlmICghKChlbGVtZW50cyAhPSBudWxsKSAmJiBlbGVtZW50cy5sZW5ndGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGBcIiArIG5hbWUgKyBcImAgb3B0aW9uIHByb3ZpZGVkLiBQbGVhc2UgcHJvdmlkZSBhIENTUyBzZWxlY3RvciwgYSBwbGFpbiBIVE1MIGVsZW1lbnQgb3IgYSBsaXN0IG9mIHRob3NlLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnRzO1xuICB9O1xuXG4gIERyb3B6b25lLmNvbmZpcm0gPSBmdW5jdGlvbihxdWVzdGlvbiwgYWNjZXB0ZWQsIHJlamVjdGVkKSB7XG4gICAgaWYgKHdpbmRvdy5jb25maXJtKHF1ZXN0aW9uKSkge1xuICAgICAgcmV0dXJuIGFjY2VwdGVkKCk7XG4gICAgfSBlbHNlIGlmIChyZWplY3RlZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gcmVqZWN0ZWQoKTtcbiAgICB9XG4gIH07XG5cbiAgRHJvcHpvbmUuaXNWYWxpZEZpbGUgPSBmdW5jdGlvbihmaWxlLCBhY2NlcHRlZEZpbGVzKSB7XG4gICAgdmFyIGJhc2VNaW1lVHlwZSwgbWltZVR5cGUsIHZhbGlkVHlwZSwgX2ksIF9sZW47XG4gICAgaWYgKCFhY2NlcHRlZEZpbGVzKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYWNjZXB0ZWRGaWxlcyA9IGFjY2VwdGVkRmlsZXMuc3BsaXQoXCIsXCIpO1xuICAgIG1pbWVUeXBlID0gZmlsZS50eXBlO1xuICAgIGJhc2VNaW1lVHlwZSA9IG1pbWVUeXBlLnJlcGxhY2UoL1xcLy4qJC8sIFwiXCIpO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gYWNjZXB0ZWRGaWxlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgdmFsaWRUeXBlID0gYWNjZXB0ZWRGaWxlc1tfaV07XG4gICAgICB2YWxpZFR5cGUgPSB2YWxpZFR5cGUudHJpbSgpO1xuICAgICAgaWYgKHZhbGlkVHlwZS5jaGFyQXQoMCkgPT09IFwiLlwiKSB7XG4gICAgICAgIGlmIChmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHZhbGlkVHlwZS50b0xvd2VyQ2FzZSgpLCBmaWxlLm5hbWUubGVuZ3RoIC0gdmFsaWRUeXBlLmxlbmd0aCkgIT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoL1xcL1xcKiQvLnRlc3QodmFsaWRUeXBlKSkge1xuICAgICAgICBpZiAoYmFzZU1pbWVUeXBlID09PSB2YWxpZFR5cGUucmVwbGFjZSgvXFwvLiokLywgXCJcIikpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG1pbWVUeXBlID09PSB2YWxpZFR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBqUXVlcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgalF1ZXJ5ICE9PSBudWxsKSB7XG4gICAgalF1ZXJ5LmZuLmRyb3B6b25lID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEcm9wem9uZSh0aGlzLCBvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IERyb3B6b25lO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5Ecm9wem9uZSA9IERyb3B6b25lO1xuICB9XG5cbiAgRHJvcHpvbmUuQURERUQgPSBcImFkZGVkXCI7XG5cbiAgRHJvcHpvbmUuUVVFVUVEID0gXCJxdWV1ZWRcIjtcblxuICBEcm9wem9uZS5BQ0NFUFRFRCA9IERyb3B6b25lLlFVRVVFRDtcblxuICBEcm9wem9uZS5VUExPQURJTkcgPSBcInVwbG9hZGluZ1wiO1xuXG4gIERyb3B6b25lLlBST0NFU1NJTkcgPSBEcm9wem9uZS5VUExPQURJTkc7XG5cbiAgRHJvcHpvbmUuQ0FOQ0VMRUQgPSBcImNhbmNlbGVkXCI7XG5cbiAgRHJvcHpvbmUuRVJST1IgPSBcImVycm9yXCI7XG5cbiAgRHJvcHpvbmUuU1VDQ0VTUyA9IFwic3VjY2Vzc1wiO1xuXG5cbiAgLypcbiAgXG4gIEJ1Z2ZpeCBmb3IgaU9TIDYgYW5kIDdcbiAgU291cmNlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzExOTI5MDk5L2h0bWw1LWNhbnZhcy1kcmF3aW1hZ2UtcmF0aW8tYnVnLWlvc1xuICBiYXNlZCBvbiB0aGUgd29yayBvZiBodHRwczovL2dpdGh1Yi5jb20vc3RvbWl0YS9pb3MtaW1hZ2VmaWxlLW1lZ2FwaXhlbFxuICAgKi9cblxuICBkZXRlY3RWZXJ0aWNhbFNxdWFzaCA9IGZ1bmN0aW9uKGltZykge1xuICAgIHZhciBhbHBoYSwgY2FudmFzLCBjdHgsIGRhdGEsIGV5LCBpaCwgaXcsIHB5LCByYXRpbywgc3k7XG4gICAgaXcgPSBpbWcubmF0dXJhbFdpZHRoO1xuICAgIGloID0gaW1nLm5hdHVyYWxIZWlnaHQ7XG4gICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICBjYW52YXMud2lkdGggPSAxO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBpaDtcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcbiAgICBkYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCAxLCBpaCkuZGF0YTtcbiAgICBzeSA9IDA7XG4gICAgZXkgPSBpaDtcbiAgICBweSA9IGloO1xuICAgIHdoaWxlIChweSA+IHN5KSB7XG4gICAgICBhbHBoYSA9IGRhdGFbKHB5IC0gMSkgKiA0ICsgM107XG4gICAgICBpZiAoYWxwaGEgPT09IDApIHtcbiAgICAgICAgZXkgPSBweTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN5ID0gcHk7XG4gICAgICB9XG4gICAgICBweSA9IChleSArIHN5KSA+PiAxO1xuICAgIH1cbiAgICByYXRpbyA9IHB5IC8gaWg7XG4gICAgaWYgKHJhdGlvID09PSAwKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJhdGlvO1xuICAgIH1cbiAgfTtcblxuICBkcmF3SW1hZ2VJT1NGaXggPSBmdW5jdGlvbihjdHgsIGltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoKSB7XG4gICAgdmFyIHZlcnRTcXVhc2hSYXRpbztcbiAgICB2ZXJ0U3F1YXNoUmF0aW8gPSBkZXRlY3RWZXJ0aWNhbFNxdWFzaChpbWcpO1xuICAgIHJldHVybiBjdHguZHJhd0ltYWdlKGltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoIC8gdmVydFNxdWFzaFJhdGlvKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIGNvbnRlbnRsb2FkZWQuanNcbiAgICpcbiAgICogQXV0aG9yOiBEaWVnbyBQZXJpbmkgKGRpZWdvLnBlcmluaSBhdCBnbWFpbC5jb20pXG4gICAqIFN1bW1hcnk6IGNyb3NzLWJyb3dzZXIgd3JhcHBlciBmb3IgRE9NQ29udGVudExvYWRlZFxuICAgKiBVcGRhdGVkOiAyMDEwMTAyMFxuICAgKiBMaWNlbnNlOiBNSVRcbiAgICogVmVyc2lvbjogMS4yXG4gICAqXG4gICAqIFVSTDpcbiAgICogaHR0cDovL2phdmFzY3JpcHQubndib3guY29tL0NvbnRlbnRMb2FkZWQvXG4gICAqIGh0dHA6Ly9qYXZhc2NyaXB0Lm53Ym94LmNvbS9Db250ZW50TG9hZGVkL01JVC1MSUNFTlNFXG4gICAqL1xuXG4gIGNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbih3aW4sIGZuKSB7XG4gICAgdmFyIGFkZCwgZG9jLCBkb25lLCBpbml0LCBwb2xsLCBwcmUsIHJlbSwgcm9vdCwgdG9wO1xuICAgIGRvbmUgPSBmYWxzZTtcbiAgICB0b3AgPSB0cnVlO1xuICAgIGRvYyA9IHdpbi5kb2N1bWVudDtcbiAgICByb290ID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICBhZGQgPSAoZG9jLmFkZEV2ZW50TGlzdGVuZXIgPyBcImFkZEV2ZW50TGlzdGVuZXJcIiA6IFwiYXR0YWNoRXZlbnRcIik7XG4gICAgcmVtID0gKGRvYy5hZGRFdmVudExpc3RlbmVyID8gXCJyZW1vdmVFdmVudExpc3RlbmVyXCIgOiBcImRldGFjaEV2ZW50XCIpO1xuICAgIHByZSA9IChkb2MuYWRkRXZlbnRMaXN0ZW5lciA/IFwiXCIgOiBcIm9uXCIpO1xuICAgIGluaXQgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoZS50eXBlID09PSBcInJlYWR5c3RhdGVjaGFuZ2VcIiAmJiBkb2MucmVhZHlTdGF0ZSAhPT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIChlLnR5cGUgPT09IFwibG9hZFwiID8gd2luIDogZG9jKVtyZW1dKHByZSArIGUudHlwZSwgaW5pdCwgZmFsc2UpO1xuICAgICAgaWYgKCFkb25lICYmIChkb25lID0gdHJ1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwod2luLCBlLnR5cGUgfHwgZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBwb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJvb3QuZG9TY3JvbGwoXCJsZWZ0XCIpO1xuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIGUgPSBfZXJyb3I7XG4gICAgICAgIHNldFRpbWVvdXQocG9sbCwgNTApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5pdChcInBvbGxcIik7XG4gICAgfTtcbiAgICBpZiAoZG9jLnJlYWR5U3RhdGUgIT09IFwiY29tcGxldGVcIikge1xuICAgICAgaWYgKGRvYy5jcmVhdGVFdmVudE9iamVjdCAmJiByb290LmRvU2Nyb2xsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdG9wID0gIXdpbi5mcmFtZUVsZW1lbnQ7XG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgICAgaWYgKHRvcCkge1xuICAgICAgICAgIHBvbGwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZG9jW2FkZF0ocHJlICsgXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQsIGZhbHNlKTtcbiAgICAgIGRvY1thZGRdKHByZSArIFwicmVhZHlzdGF0ZWNoYW5nZVwiLCBpbml0LCBmYWxzZSk7XG4gICAgICByZXR1cm4gd2luW2FkZF0ocHJlICsgXCJsb2FkXCIsIGluaXQsIGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgRHJvcHpvbmUuX2F1dG9EaXNjb3ZlckZ1bmN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKERyb3B6b25lLmF1dG9EaXNjb3Zlcikge1xuICAgICAgcmV0dXJuIERyb3B6b25lLmRpc2NvdmVyKCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnRlbnRMb2FkZWQod2luZG93LCBEcm9wem9uZS5fYXV0b0Rpc2NvdmVyRnVuY3Rpb24pO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciByZXBlYXQgPSBmdW5jdGlvbiByZXBlYXQoc3RyLCB0aW1lcykge1xuICByZXR1cm4gbmV3IEFycmF5KHRpbWVzICsgMSkuam9pbihzdHIpO1xufTtcbnZhciBwYWQgPSBmdW5jdGlvbiBwYWQobnVtLCBtYXhMZW5ndGgpIHtcbiAgcmV0dXJuIHJlcGVhdChcIjBcIiwgbWF4TGVuZ3RoIC0gbnVtLnRvU3RyaW5nKCkubGVuZ3RoKSArIG51bTtcbn07XG52YXIgZm9ybWF0VGltZSA9IGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSkge1xuICByZXR1cm4gXCJAIFwiICsgcGFkKHRpbWUuZ2V0SG91cnMoKSwgMikgKyBcIjpcIiArIHBhZCh0aW1lLmdldE1pbnV0ZXMoKSwgMikgKyBcIjpcIiArIHBhZCh0aW1lLmdldFNlY29uZHMoKSwgMikgKyBcIi5cIiArIHBhZCh0aW1lLmdldE1pbGxpc2Vjb25kcygpLCAzKTtcbn07XG5cbi8vIFVzZSB0aGUgbmV3IHBlcmZvcm1hbmNlIGFwaSB0byBnZXQgYmV0dGVyIHByZWNpc2lvbiBpZiBhdmFpbGFibGVcbnZhciB0aW1lciA9IHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSBcImZ1bmN0aW9uXCIgPyBwZXJmb3JtYW5jZSA6IERhdGU7XG5cbi8qKlxuICogQ3JlYXRlcyBsb2dnZXIgd2l0aCBmb2xsb3dlZCBvcHRpb25zXG4gKlxuICogQG5hbWVzcGFjZVxuICogQHByb3BlcnR5IHtvYmplY3R9IG9wdGlvbnMgLSBvcHRpb25zIGZvciBsb2dnZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBvcHRpb25zLmxldmVsIC0gY29uc29sZVtsZXZlbF1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy5kdXJhdGlvbiAtIHByaW50IGR1cmF0aW9uIG9mIGVhY2ggYWN0aW9uP1xuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLnRpbWVzdGFtcCAtIHByaW50IHRpbWVzdGFtcCB3aXRoIGVhY2ggYWN0aW9uP1xuICogQHByb3BlcnR5IHtvYmplY3R9IG9wdGlvbnMuY29sb3JzIC0gY3VzdG9tIGNvbG9yc1xuICogQHByb3BlcnR5IHtvYmplY3R9IG9wdGlvbnMubG9nZ2VyIC0gaW1wbGVtZW50YXRpb24gb2YgdGhlIGBjb25zb2xlYCBBUElcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy5sb2dFcnJvcnMgLSBzaG91bGQgZXJyb3JzIGluIGFjdGlvbiBleGVjdXRpb24gYmUgY2F1Z2h0LCBsb2dnZWQsIGFuZCByZS10aHJvd24/XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMuY29sbGFwc2VkIC0gaXMgZ3JvdXAgY29sbGFwc2VkP1xuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLnByZWRpY2F0ZSAtIGNvbmRpdGlvbiB3aGljaCByZXNvbHZlcyBsb2dnZXIgYmVoYXZpb3JcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IG9wdGlvbnMuc3RhdGVUcmFuc2Zvcm1lciAtIHRyYW5zZm9ybSBzdGF0ZSBiZWZvcmUgcHJpbnRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IG9wdGlvbnMuYWN0aW9uVHJhbnNmb3JtZXIgLSB0cmFuc2Zvcm0gYWN0aW9uIGJlZm9yZSBwcmludFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gb3B0aW9ucy5lcnJvclRyYW5zZm9ybWVyIC0gdHJhbnNmb3JtIGVycm9yIGJlZm9yZSBwcmludFxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcigpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcbiAgdmFyIF9vcHRpb25zJGxldmVsID0gb3B0aW9ucy5sZXZlbDtcbiAgdmFyIGxldmVsID0gX29wdGlvbnMkbGV2ZWwgPT09IHVuZGVmaW5lZCA/IFwibG9nXCIgOiBfb3B0aW9ucyRsZXZlbDtcbiAgdmFyIF9vcHRpb25zJGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyO1xuICB2YXIgbG9nZ2VyID0gX29wdGlvbnMkbG9nZ2VyID09PSB1bmRlZmluZWQgPyBjb25zb2xlIDogX29wdGlvbnMkbG9nZ2VyO1xuICB2YXIgX29wdGlvbnMkbG9nRXJyb3JzID0gb3B0aW9ucy5sb2dFcnJvcnM7XG4gIHZhciBsb2dFcnJvcnMgPSBfb3B0aW9ucyRsb2dFcnJvcnMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBfb3B0aW9ucyRsb2dFcnJvcnM7XG4gIHZhciBjb2xsYXBzZWQgPSBvcHRpb25zLmNvbGxhcHNlZDtcbiAgdmFyIHByZWRpY2F0ZSA9IG9wdGlvbnMucHJlZGljYXRlO1xuICB2YXIgX29wdGlvbnMkZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uO1xuICB2YXIgZHVyYXRpb24gPSBfb3B0aW9ucyRkdXJhdGlvbiA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfb3B0aW9ucyRkdXJhdGlvbjtcbiAgdmFyIF9vcHRpb25zJHRpbWVzdGFtcCA9IG9wdGlvbnMudGltZXN0YW1wO1xuICB2YXIgdGltZXN0YW1wID0gX29wdGlvbnMkdGltZXN0YW1wID09PSB1bmRlZmluZWQgPyB0cnVlIDogX29wdGlvbnMkdGltZXN0YW1wO1xuICB2YXIgdHJhbnNmb3JtZXIgPSBvcHRpb25zLnRyYW5zZm9ybWVyO1xuICB2YXIgX29wdGlvbnMkc3RhdGVUcmFuc2ZvID0gb3B0aW9ucy5zdGF0ZVRyYW5zZm9ybWVyO1xuICB2YXIgLy8gZGVwcmVjYXRlZFxuICBzdGF0ZVRyYW5zZm9ybWVyID0gX29wdGlvbnMkc3RhdGVUcmFuc2ZvID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH0gOiBfb3B0aW9ucyRzdGF0ZVRyYW5zZm87XG4gIHZhciBfb3B0aW9ucyRhY3Rpb25UcmFuc2YgPSBvcHRpb25zLmFjdGlvblRyYW5zZm9ybWVyO1xuICB2YXIgYWN0aW9uVHJhbnNmb3JtZXIgPSBfb3B0aW9ucyRhY3Rpb25UcmFuc2YgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uIChhY3RuKSB7XG4gICAgcmV0dXJuIGFjdG47XG4gIH0gOiBfb3B0aW9ucyRhY3Rpb25UcmFuc2Y7XG4gIHZhciBfb3B0aW9ucyRlcnJvclRyYW5zZm8gPSBvcHRpb25zLmVycm9yVHJhbnNmb3JtZXI7XG4gIHZhciBlcnJvclRyYW5zZm9ybWVyID0gX29wdGlvbnMkZXJyb3JUcmFuc2ZvID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gZXJyb3I7XG4gIH0gOiBfb3B0aW9ucyRlcnJvclRyYW5zZm87XG4gIHZhciBfb3B0aW9ucyRjb2xvcnMgPSBvcHRpb25zLmNvbG9ycztcbiAgdmFyIGNvbG9ycyA9IF9vcHRpb25zJGNvbG9ycyA9PT0gdW5kZWZpbmVkID8ge1xuICAgIHRpdGxlOiBmdW5jdGlvbiB0aXRsZSgpIHtcbiAgICAgIHJldHVybiBcIiMwMDAwMDBcIjtcbiAgICB9LFxuICAgIHByZXZTdGF0ZTogZnVuY3Rpb24gcHJldlN0YXRlKCkge1xuICAgICAgcmV0dXJuIFwiIzlFOUU5RVwiO1xuICAgIH0sXG4gICAgYWN0aW9uOiBmdW5jdGlvbiBhY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXCIjMDNBOUY0XCI7XG4gICAgfSxcbiAgICBuZXh0U3RhdGU6IGZ1bmN0aW9uIG5leHRTdGF0ZSgpIHtcbiAgICAgIHJldHVybiBcIiM0Q0FGNTBcIjtcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICAgIHJldHVybiBcIiNGMjA0MDRcIjtcbiAgICB9XG4gIH0gOiBfb3B0aW9ucyRjb2xvcnM7XG5cbiAgLy8gZXhpdCBpZiBjb25zb2xlIHVuZGVmaW5lZFxuXG4gIGlmICh0eXBlb2YgbG9nZ2VyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAgIHJldHVybiBuZXh0KGFjdGlvbik7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgIH07XG4gIH1cblxuICBpZiAodHJhbnNmb3JtZXIpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiT3B0aW9uICd0cmFuc2Zvcm1lcicgaXMgZGVwcmVjYXRlZCwgdXNlIHN0YXRlVHJhbnNmb3JtZXIgaW5zdGVhZFwiKTtcbiAgfVxuXG4gIHZhciBsb2dCdWZmZXIgPSBbXTtcbiAgZnVuY3Rpb24gcHJpbnRCdWZmZXIoKSB7XG4gICAgbG9nQnVmZmVyLmZvckVhY2goZnVuY3Rpb24gKGxvZ0VudHJ5LCBrZXkpIHtcbiAgICAgIHZhciBzdGFydGVkID0gbG9nRW50cnkuc3RhcnRlZDtcbiAgICAgIHZhciBzdGFydGVkVGltZSA9IGxvZ0VudHJ5LnN0YXJ0ZWRUaW1lO1xuICAgICAgdmFyIGFjdGlvbiA9IGxvZ0VudHJ5LmFjdGlvbjtcbiAgICAgIHZhciBwcmV2U3RhdGUgPSBsb2dFbnRyeS5wcmV2U3RhdGU7XG4gICAgICB2YXIgZXJyb3IgPSBsb2dFbnRyeS5lcnJvcjtcbiAgICAgIHZhciB0b29rID0gbG9nRW50cnkudG9vaztcbiAgICAgIHZhciBuZXh0U3RhdGUgPSBsb2dFbnRyeS5uZXh0U3RhdGU7XG5cbiAgICAgIHZhciBuZXh0RW50cnkgPSBsb2dCdWZmZXJba2V5ICsgMV07XG4gICAgICBpZiAobmV4dEVudHJ5KSB7XG4gICAgICAgIG5leHRTdGF0ZSA9IG5leHRFbnRyeS5wcmV2U3RhdGU7XG4gICAgICAgIHRvb2sgPSBuZXh0RW50cnkuc3RhcnRlZCAtIHN0YXJ0ZWQ7XG4gICAgICB9XG4gICAgICAvLyBtZXNzYWdlXG4gICAgICB2YXIgZm9ybWF0dGVkQWN0aW9uID0gYWN0aW9uVHJhbnNmb3JtZXIoYWN0aW9uKTtcbiAgICAgIHZhciBpc0NvbGxhcHNlZCA9IHR5cGVvZiBjb2xsYXBzZWQgPT09IFwiZnVuY3Rpb25cIiA/IGNvbGxhcHNlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgICB9LCBhY3Rpb24pIDogY29sbGFwc2VkO1xuXG4gICAgICB2YXIgZm9ybWF0dGVkVGltZSA9IGZvcm1hdFRpbWUoc3RhcnRlZFRpbWUpO1xuICAgICAgdmFyIHRpdGxlQ1NTID0gY29sb3JzLnRpdGxlID8gXCJjb2xvcjogXCIgKyBjb2xvcnMudGl0bGUoZm9ybWF0dGVkQWN0aW9uKSArIFwiO1wiIDogbnVsbDtcbiAgICAgIHZhciB0aXRsZSA9IFwiYWN0aW9uIFwiICsgKHRpbWVzdGFtcCA/IGZvcm1hdHRlZFRpbWUgOiBcIlwiKSArIFwiIFwiICsgZm9ybWF0dGVkQWN0aW9uLnR5cGUgKyBcIiBcIiArIChkdXJhdGlvbiA/IFwiKGluIFwiICsgdG9vay50b0ZpeGVkKDIpICsgXCIgbXMpXCIgOiBcIlwiKTtcblxuICAgICAgLy8gcmVuZGVyXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaXNDb2xsYXBzZWQpIHtcbiAgICAgICAgICBpZiAoY29sb3JzLnRpdGxlKSBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQoXCIlYyBcIiArIHRpdGxlLCB0aXRsZUNTUyk7ZWxzZSBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQodGl0bGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChjb2xvcnMudGl0bGUpIGxvZ2dlci5ncm91cChcIiVjIFwiICsgdGl0bGUsIHRpdGxlQ1NTKTtlbHNlIGxvZ2dlci5ncm91cCh0aXRsZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nZ2VyLmxvZyh0aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2xvcnMucHJldlN0YXRlKSBsb2dnZXJbbGV2ZWxdKFwiJWMgcHJldiBzdGF0ZVwiLCBcImNvbG9yOiBcIiArIGNvbG9ycy5wcmV2U3RhdGUocHJldlN0YXRlKSArIFwiOyBmb250LXdlaWdodDogYm9sZFwiLCBwcmV2U3RhdGUpO2Vsc2UgbG9nZ2VyW2xldmVsXShcInByZXYgc3RhdGVcIiwgcHJldlN0YXRlKTtcblxuICAgICAgaWYgKGNvbG9ycy5hY3Rpb24pIGxvZ2dlcltsZXZlbF0oXCIlYyBhY3Rpb25cIiwgXCJjb2xvcjogXCIgKyBjb2xvcnMuYWN0aW9uKGZvcm1hdHRlZEFjdGlvbikgKyBcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgZm9ybWF0dGVkQWN0aW9uKTtlbHNlIGxvZ2dlcltsZXZlbF0oXCJhY3Rpb25cIiwgZm9ybWF0dGVkQWN0aW9uKTtcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGlmIChjb2xvcnMuZXJyb3IpIGxvZ2dlcltsZXZlbF0oXCIlYyBlcnJvclwiLCBcImNvbG9yOiBcIiArIGNvbG9ycy5lcnJvcihlcnJvciwgcHJldlN0YXRlKSArIFwiOyBmb250LXdlaWdodDogYm9sZFwiLCBlcnJvcik7ZWxzZSBsb2dnZXJbbGV2ZWxdKFwiZXJyb3JcIiwgZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29sb3JzLm5leHRTdGF0ZSkgbG9nZ2VyW2xldmVsXShcIiVjIG5leHQgc3RhdGVcIiwgXCJjb2xvcjogXCIgKyBjb2xvcnMubmV4dFN0YXRlKG5leHRTdGF0ZSkgKyBcIjsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgbmV4dFN0YXRlKTtlbHNlIGxvZ2dlcltsZXZlbF0oXCJuZXh0IHN0YXRlXCIsIG5leHRTdGF0ZSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGxvZ2dlci5ncm91cEVuZCgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dnZXIubG9nKFwi4oCU4oCUIGxvZyBlbmQg4oCU4oCUXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ0J1ZmZlci5sZW5ndGggPSAwO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIGdldFN0YXRlID0gX3JlZi5nZXRTdGF0ZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIC8vIGV4aXQgZWFybHkgaWYgcHJlZGljYXRlIGZ1bmN0aW9uIHJldHVybnMgZmFsc2VcbiAgICAgICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09IFwiZnVuY3Rpb25cIiAmJiAhcHJlZGljYXRlKGdldFN0YXRlLCBhY3Rpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2dFbnRyeSA9IHt9O1xuICAgICAgICBsb2dCdWZmZXIucHVzaChsb2dFbnRyeSk7XG5cbiAgICAgICAgbG9nRW50cnkuc3RhcnRlZCA9IHRpbWVyLm5vdygpO1xuICAgICAgICBsb2dFbnRyeS5zdGFydGVkVGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGxvZ0VudHJ5LnByZXZTdGF0ZSA9IHN0YXRlVHJhbnNmb3JtZXIoZ2V0U3RhdGUoKSk7XG4gICAgICAgIGxvZ0VudHJ5LmFjdGlvbiA9IGFjdGlvbjtcblxuICAgICAgICB2YXIgcmV0dXJuZWRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGxvZ0Vycm9ycykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm5lZFZhbHVlID0gbmV4dChhY3Rpb24pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGxvZ0VudHJ5LmVycm9yID0gZXJyb3JUcmFuc2Zvcm1lcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuZWRWYWx1ZSA9IG5leHQoYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZ0VudHJ5LnRvb2sgPSB0aW1lci5ub3coKSAtIGxvZ0VudHJ5LnN0YXJ0ZWQ7XG4gICAgICAgIGxvZ0VudHJ5Lm5leHRTdGF0ZSA9IHN0YXRlVHJhbnNmb3JtZXIoZ2V0U3RhdGUoKSk7XG5cbiAgICAgICAgcHJpbnRCdWZmZXIoKTtcblxuICAgICAgICBpZiAobG9nRW50cnkuZXJyb3IpIHRocm93IGxvZ0VudHJ5LmVycm9yO1xuICAgICAgICByZXR1cm4gcmV0dXJuZWRWYWx1ZTtcbiAgICAgIH07XG4gICAgfTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVMb2dnZXI7Il19

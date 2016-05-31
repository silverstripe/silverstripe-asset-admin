(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _configureStore = require('state/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _AssetAdmin = require('containers/AssetAdmin/AssetAdmin');

var _AssetAdmin2 = _interopRequireDefault(_AssetAdmin);

var _Backend = require('lib/Backend');

var _Backend2 = _interopRequireDefault(_Backend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss', function () {
  (0, _jQuery2.default)('.asset-gallery-component-wrapper').entwine({
    onadd: function onadd() {
      var store = (0, _configureStore2.default)();

      var filesByParentApi = _Backend2.default.createEndpointFetcher({
        method: 'get',
        responseFormat: 'json',
        url: this.data('asset-gallery-files-by-parent-url')
      });

      var deleteApi = _Backend2.default.createEndpointFetcher({
        method: 'delete',
        payloadFormat: 'urlencoded',
        url: this.data('asset-gallery-delete-url')
      });

      var addFolderApi = _Backend2.default.createEndpointFetcher({
        method: 'post',
        payloadFormat: 'urlencoded',
        url: this.data('asset-gallery-add-folder-url')
      });

      var updateApi = _Backend2.default.createEndpointFetcher({
        method: 'put',
        payloadFormat: 'urlencoded',
        url: this.data('asset-gallery-update-url')
      });

      var limit = this.data('asset-gallery-limit');
      var bulkActions = this.data('asset-gallery-bulk-actions');

      var name = (0, _jQuery2.default)('.asset-gallery').data('asset-gallery-name');
      var section = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

      _reactDom2.default.render(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(_AssetAdmin2.default, {
          name: name,
          limit: limit,
          bulkActions: !!bulkActions,

          filesByParentApi: filesByParentApi,
          addFolderApi: addFolderApi,
          deleteApi: deleteApi,
          updateApi: updateApi,
          sectionConfigKey: section
        })
      ), this[0]);
    },
    onremove: function onremove() {
      _reactDom2.default.unmountComponentAtNode(this[0]);
    }
  });
});

},{"containers/AssetAdmin/AssetAdmin":6,"jQuery":"jQuery","lib/Backend":"lib/Backend","react":"react","react-dom":"react-dom","react-redux":"react-redux","state/configureStore":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _SilverStripeComponent = require('lib/SilverStripeComponent');

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _dropzone = require('dropzone');

var _dropzone2 = _interopRequireDefault(_dropzone);

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var AssetDropzone = function (_SilverStripeComponen) {
  _inherits(AssetDropzone, _SilverStripeComponen);

  function AssetDropzone(props) {
    _classCallCheck(this, AssetDropzone);

    var _this = _possibleConstructorReturn(this, _SilverStripeComponen.call(this, props));

    _this.dropzone = null;
    _this.dragging = false;
    return _this;
  }

  AssetDropzone.prototype.componentDidMount = function componentDidMount() {
    _SilverStripeComponen.prototype.componentDidMount.call(this);

    var defaultOptions = this.getDefaultOptions();

    if (this.props.uploadButton === true) {
      defaultOptions.clickable = (0, _jQuery2.default)(_reactDom2.default.findDOMNode(this)).find('.asset-dropzone__upload-button')[0];
    }

    this.dropzone = new _dropzone2.default(_reactDom2.default.findDOMNode(this), _extends({}, defaultOptions, this.props.options));

    if (typeof this.props.promptOnRemove !== 'undefined') {
      this.setPromptOnRemove(this.props.promptOnRemove);
    }
  };

  AssetDropzone.prototype.componentWillUnmount = function componentWillUnmount() {
    _SilverStripeComponen.prototype.componentWillUnmount.call(this);

    this.dropzone.disable();
  };

  AssetDropzone.prototype.render = function render() {
    var className = ['asset-dropzone'];

    var buttonProps = {
      className: 'asset-dropzone__upload-button ss-ui-button font-icon-upload',
      type: 'button'
    };

    if (!this.props.canUpload) {
      buttonProps.disabled = true;
    }

    if (this.dragging === true) {
      className.push('dragging');
    }

    return _react2.default.createElement(
      'div',
      { className: className.join(' ') },
      this.props.uploadButton && _react2.default.createElement(
        'button',
        buttonProps,
        _i18n2.default._t('AssetGalleryField.DROPZONE_UPLOAD')
      ),
      this.props.children
    );
  };

  AssetDropzone.prototype.getDefaultOptions = function getDefaultOptions() {
    return {
      autoProcessQueue: false,

      addedfile: this.handleAddedFile.bind(this),

      dragenter: this.handleDragEnter.bind(this),

      dragleave: this.handleDragLeave.bind(this),

      drop: this.handleDrop.bind(this),

      uploadprogress: this.handleUploadProgress.bind(this),

      dictDefaultMessage: _i18n2.default._t('AssetGalleryField.DROPZONE_DEFAULT_MESSAGE'),

      dictFallbackMessage: _i18n2.default._t('AssetGalleryField.DROPZONE_FALLBACK_MESSAGE'),

      dictFallbackText: _i18n2.default._t('AssetGalleryField.DROPZONE_FALLBACK_TEXT'),

      dictInvalidFileType: _i18n2.default._t('AssetGalleryField.DROPZONE_INVALID_FILE_TYPE'),

      dictResponseError: _i18n2.default._t('AssetGalleryField.DROPZONE_RESPONSE_ERROR'),

      dictCancelUpload: _i18n2.default._t('AssetGalleryField.DROPZONE_CANCEL_UPLOAD'),

      dictCancelUploadConfirmation: _i18n2.default._t('AssetGalleryField.DROPZONE_CANCEL_UPLOAD_CONFIRMATION'),

      dictRemoveFile: _i18n2.default._t('AssetGalleryField.DROPZONE_REMOVE_FILE'),

      dictMaxFilesExceeded: _i18n2.default._t('AssetGalleryField.DROPZONE_MAX_FILES_EXCEEDED'),

      error: this.handleError.bind(this),

      sending: this.handleSending.bind(this),

      success: this.handleSuccess.bind(this),

      thumbnailHeight: 150,

      thumbnailWidth: 200
    };
  };

  AssetDropzone.prototype.getFileCategory = function getFileCategory(fileType) {
    return fileType.split('/')[0];
  };

  AssetDropzone.prototype.handleDragEnter = function handleDragEnter(event) {
    if (!this.props.canUpload) {
      return;
    }

    this.dragging = true;
    this.forceUpdate();

    if (typeof this.props.handleDragEnter === 'function') {
      this.props.handleDragEnter(event);
    }
  };

  AssetDropzone.prototype.handleDragLeave = function handleDragLeave(event) {
    var componentNode = _reactDom2.default.findDOMNode(this);

    if (!this.props.canUpload) {
      return;
    }

    if (event.target !== componentNode) {
      return;
    }

    this.dragging = false;
    this.forceUpdate();

    if (typeof this.props.handleDragLeave === 'function') {
      this.props.handleDragLeave(event, componentNode);
    }
  };

  AssetDropzone.prototype.handleUploadProgress = function handleUploadProgress(file, progress, bytesSent) {
    if (typeof this.props.handleUploadProgress === 'function') {
      this.props.handleUploadProgress(file, progress, bytesSent);
    }
  };

  AssetDropzone.prototype.handleDrop = function handleDrop(event) {
    this.dragging = false;
    this.forceUpdate();

    if (typeof this.props.handleDrop === 'function') {
      this.props.handleDrop(event);
    }
  };

  AssetDropzone.prototype.handleSending = function handleSending(file, xhr, formData) {
    formData.append('SecurityID', this.props.securityID);
    formData.append('folderId', this.props.folderId);

    if (typeof this.props.handleSending === 'function') {
      this.props.handleSending(file, xhr, formData);
    }
  };

  AssetDropzone.prototype.handleAddedFile = function handleAddedFile(file) {
    var _this2 = this;

    if (!this.props.canUpload) {
      return;
    }

    var reader = new FileReader();

    var queuedAtTime = Date.now();

    reader.onload = function (event) {

      var thumbnailURL = '';

      if (_this2.getFileCategory(file.type) === 'image') {
        var img = document.createElement('img');
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        img.src = event.target.result;

        canvas.width = _this2.dropzone.options.thumbnailWidth;
        canvas.height = _this2.dropzone.options.thumbnailHeight;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        thumbnailURL = canvas.toDataURL();
      }

      _this2.props.handleAddedFile({
        attributes: {
          dimensions: {
            height: _this2.dropzone.options.thumbnailHeight,
            width: _this2.dropzone.options.thumbnailWidth
          }
        },
        category: _this2.getFileCategory(file.type),
        filename: file.name,
        queuedAtTime: queuedAtTime,
        size: file.size,
        title: file.name,
        type: file.type,
        url: thumbnailURL
      });

      _this2.dropzone.processFile(file);
    };

    file._queuedAtTime = queuedAtTime;

    reader.readAsDataURL(file);
  };

  AssetDropzone.prototype.handleError = function handleError(file, errorMessage) {
    if (typeof this.props.handleSending === 'function') {
      this.props.handleError(file, errorMessage);
    }
  };

  AssetDropzone.prototype.handleSuccess = function handleSuccess(file) {
    this.props.handleSuccess(file);
  };

  AssetDropzone.prototype.setPromptOnRemove = function setPromptOnRemove(userPrompt) {
    this.dropzone.options.dictRemoveFileConfirmation = userPrompt;
  };

  return AssetDropzone;
}(_SilverStripeComponent2.default);

AssetDropzone.propTypes = {
  folderId: _react2.default.PropTypes.number.isRequired,
  handleAddedFile: _react2.default.PropTypes.func.isRequired,
  handleDragEnter: _react2.default.PropTypes.func,
  handleDragLeave: _react2.default.PropTypes.func,
  handleDrop: _react2.default.PropTypes.func,
  handleError: _react2.default.PropTypes.func.isRequired,
  handleSending: _react2.default.PropTypes.func,
  handleSuccess: _react2.default.PropTypes.func.isRequired,
  options: _react2.default.PropTypes.shape({
    url: _react2.default.PropTypes.string.isRequired
  }),
  promptOnRemove: _react2.default.PropTypes.string,
  securityID: _react2.default.PropTypes.string.isRequired,
  uploadButton: _react2.default.PropTypes.bool,
  canUpload: _react2.default.PropTypes.bool.isRequired
};

AssetDropzone.defaultProps = {
  uploadButton: true
};

exports.default = AssetDropzone;

},{"dropzone":20,"i18n":"i18n","jQuery":"jQuery","lib/SilverStripeComponent":"lib/SilverStripeComponent","react":"react","react-dom":"react-dom"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulkActions = undefined;

var _jQuery = require('jQuery');

var _jQuery2 = _interopRequireDefault(_jQuery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _SilverStripeComponent = require('lib/SilverStripeComponent');

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _GalleryActions = require('state/gallery/GalleryActions');

var galleryActions = _interopRequireWildcard(_GalleryActions);

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var BulkActions = exports.BulkActions = function (_SilverStripeComponen) {
  _inherits(BulkActions, _SilverStripeComponen);

  function BulkActions(props) {
    _classCallCheck(this, BulkActions);

    var _this = _possibleConstructorReturn(this, _SilverStripeComponen.call(this, props));

    _this.onChangeValue = _this.onChangeValue.bind(_this);
    return _this;
  }

  BulkActions.prototype.componentDidMount = function componentDidMount() {
    var $select = (0, _jQuery2.default)(_reactDom2.default.findDOMNode(this)).find('.dropdown');

    $select.chosen({
      allow_single_deselect: true,
      disable_search_threshold: 20
    });

    $select.change(function () {
      return _reactAddonsTestUtils2.default.Simulate.click($select.find(':selected')[0]);
    });
  };

  BulkActions.prototype.render = function render() {
    var _this2 = this;

    var children = this.props.gallery.bulkActions.options.map(function (option, i) {
      return _react2.default.createElement(
        'button',
        {
          type: 'button',
          className: 'bulk-actions_action font-icon-trash ss-ui-button ui-corner-all',
          key: i,
          onClick: _this2.onChangeValue,
          value: option.value
        },
        option.label
      );
    });

    return _react2.default.createElement(
      'div',
      { className: 'bulk-actions fieldholder-small' },
      _react2.default.createElement(
        'div',
        { className: 'bulk-actions-counter' },
        this.getSelectedFiles().length
      ),
      children
    );
  };

  BulkActions.prototype.getOptionByValue = function getOptionByValue(value) {
    for (var i = 0; i < this.props.gallery.bulkActions.options.length; i += 1) {
      if (this.props.gallery.bulkActions.options[i].value === value) {
        return this.props.gallery.bulkActions.options[i];
      }
    }

    return null;
  };

  BulkActions.prototype.getSelectedFiles = function getSelectedFiles() {
    return this.props.gallery.selectedFiles;
  };

  BulkActions.prototype.applyAction = function applyAction(value) {
    var result = false;

    switch (value) {
      case 'delete':
        this.props.deleteAction(this.getSelectedFiles());
        result = true;
        break;
      default:
    }

    return result;
  };

  BulkActions.prototype.onChangeValue = function onChangeValue(event) {
    var option = this.getOptionByValue(event.target.value);

    if (option === null) {
      return;
    }

    if (option.destructive === true) {
      if (confirm(_i18n2.default.sprintf(_i18n2.default._t('AssetGalleryField.BULK_ACTIONS_CONFIRM'), option.label))) {
        this.applyAction(option.value);
      }
    } else {
      this.applyAction(option.value);
    }

    (0, _jQuery2.default)(_reactDom2.default.findDOMNode(this)).find('.dropdown').val('').trigger('liszt:updated');
  };

  return BulkActions;
}(_SilverStripeComponent2.default);

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

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(BulkActions);

},{"i18n":"i18n","jQuery":"jQuery","lib/SilverStripeComponent":"lib/SilverStripeComponent","react":"react","react-addons-test-utils":"react-addons-test-utils","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","state/gallery/GalleryActions":14}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('constants/index');

var _index2 = _interopRequireDefault(_index);

var _SilverStripeComponent = require('lib/SilverStripeComponent');

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var GalleryItem = function (_SilverStripeComponen) {
  _inherits(GalleryItem, _SilverStripeComponen);

  function GalleryItem(props) {
    _classCallCheck(this, GalleryItem);

    var _this = _possibleConstructorReturn(this, _SilverStripeComponen.call(this, props));

    _this.handleToggleSelect = _this.handleToggleSelect.bind(_this);
    _this.handleDelete = _this.handleDelete.bind(_this);
    _this.handleActivate = _this.handleActivate.bind(_this);
    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
    _this.handleCancelUpload = _this.handleCancelUpload.bind(_this);
    _this.preventFocus = _this.preventFocus.bind(_this);
    return _this;
  }

  GalleryItem.prototype.handleActivate = function handleActivate(event) {
    event.stopPropagation();
    this.props.handleActivate(event, this.props.item);
  };

  GalleryItem.prototype.handleToggleSelect = function handleToggleSelect(event) {
    event.stopPropagation();
    event.preventDefault();
    this.props.handleToggleSelect(event, this.props.item);
  };

  GalleryItem.prototype.handleDelete = function handleDelete(event) {
    this.props.handleDelete(event, this.props.item);
  };

  GalleryItem.prototype.getThumbnailStyles = function getThumbnailStyles() {
    if (this.props.item.category === 'image') {
      return {
        backgroundImage: 'url(' + this.props.item.url + ')'
      };
    }

    return {};
  };

  GalleryItem.prototype.hasError = function hasError() {
    var hasError = false;

    if (Array.isArray(this.props.messages)) {
      hasError = this.props.messages.filter(function (message) {
        return message.type === 'error';
      }).length > 0;
    }

    return hasError;
  };

  GalleryItem.prototype.getErrorMessage = function getErrorMessage() {
    if (this.hasError()) {
      return _react2.default.createElement(
        'span',
        { className: 'gallery-item__error-message' },
        this.props.messages[0].value
      );
    }

    return null;
  };

  GalleryItem.prototype.getThumbnailClassNames = function getThumbnailClassNames() {
    var thumbnailClassNames = ['gallery-item__thumbnail'];

    if (this.isImageSmallerThanThumbnail()) {
      thumbnailClassNames.push('gallery-item__thumbnail--small');
    }

    return thumbnailClassNames.join(' ');
  };

  GalleryItem.prototype.getItemClassNames = function getItemClassNames() {
    var itemClassNames = ['gallery-item gallery-item--' + this.props.item.category];

    if (this.props.selected) {
      itemClassNames.push('gallery-item--selected');
    }

    if (this.props.highlighted) {
      itemClassNames.push('gallery-item--highlighted');
    }

    if (this.hasError()) {
      itemClassNames.push('gallery-item--error');
    }

    return itemClassNames.join(' ');
  };

  GalleryItem.prototype.isImageSmallerThanThumbnail = function isImageSmallerThanThumbnail() {
    var dimensions = this.props.item.attributes.dimensions;

    return dimensions.height < _index2.default.THUMBNAIL_HEIGHT && dimensions.width < _index2.default.THUMBNAIL_WIDTH;
  };

  GalleryItem.prototype.handleKeyDown = function handleKeyDown(event) {
    event.stopPropagation();

    if (this.props.spaceKey === event.keyCode) {
      event.preventDefault();
      this.handleToggleSelect(event);
    }

    if (this.props.returnKey === event.keyCode) {
      this.handleActivate(event, this.props.item);
    }
  };

  GalleryItem.prototype.preventFocus = function preventFocus(event) {
    event.preventDefault();
  };

  GalleryItem.prototype.handleCancelUpload = function handleCancelUpload(event) {
    event.stopPropagation();

    if (this.hasError()) {
      this.props.handleRemoveErroredUpload(this.props.item);
    } else {
      this.props.handleCancelUpload(this.props.item);
    }
  };

  GalleryItem.prototype.getProgressBar = function getProgressBar() {
    var progressBar = void 0;

    var progressBarProps = {
      className: 'gallery-item__progress-bar',
      style: {
        width: this.props.item.progress + '%'
      }
    };

    if (!this.hasError() && this.props.uploading) {
      progressBar = _react2.default.createElement(
        'div',
        { className: 'gallery-item__upload-progress' },
        _react2.default.createElement('div', progressBarProps)
      );
    }

    return progressBar;
  };

  GalleryItem.prototype.render = function render() {
    var actionInputCheckbox = void 0;

    if (this.props.uploading) {
      actionInputCheckbox = _react2.default.createElement(
        'label',
        {
          className: 'gallery-item__checkbox-label font-icon-cancel',
          onClick: this.handleCancelUpload
        },
        _react2.default.createElement('input', {
          className: 'gallery-item__checkbox',
          type: 'checkbox',
          title: _i18n2.default._t('AssetGalleryField.SELECT'),
          tabIndex: '-1',
          onMouseDown: this.preventFocus,
          'data-dz-remove': true
        })
      );
    } else {
      actionInputCheckbox = _react2.default.createElement(
        'label',
        {
          className: 'gallery-item__checkbox-label font-icon-tick',
          onClick: this.handleToggleSelect
        },
        _react2.default.createElement('input', {
          className: 'gallery-item__checkbox',
          type: 'checkbox',
          title: _i18n2.default._t('AssetGalleryField.SELECT'),
          tabIndex: '-1',
          onMouseDown: this.preventFocus
        })
      );
    }

    return _react2.default.createElement(
      'div',
      {
        className: this.getItemClassNames(),
        'data-id': this.props.item.id,
        tabIndex: '0',
        onKeyDown: this.handleKeyDown,
        onClick: this.handleActivate
      },
      _react2.default.createElement(
        'div',
        {
          ref: 'thumbnail',
          className: this.getThumbnailClassNames(),
          style: this.getThumbnailStyles()
        },
        _react2.default.createElement(
          'div',
          { className: 'gallery-item--overlay font-icon-edit' },
          'View'
        )
      ),
      this.getProgressBar(),
      this.getErrorMessage(),
      _react2.default.createElement(
        'div',
        { className: 'gallery-item__title', ref: 'title' },
        actionInputCheckbox,
        this.props.item.title
      )
    );
  };

  return GalleryItem;
}(_SilverStripeComponent2.default);

GalleryItem.propTypes = {
  item: _react2.default.PropTypes.shape({
    attributes: _react2.default.PropTypes.shape({
      dimensions: _react2.default.PropTypes.object.isRequired
    }),
    category: _react2.default.PropTypes.string.isRequired,
    id: _react2.default.PropTypes.number.isRequired,
    url: _react2.default.PropTypes.string,
    title: _react2.default.PropTypes.string.isRequired,
    progress: _react2.default.PropTypes.number
  }),

  highlighted: _react2.default.PropTypes.bool,

  selected: _react2.default.PropTypes.bool.isRequired,
  spaceKey: _react2.default.PropTypes.number,
  returnKey: _react2.default.PropTypes.number,
  handleActivate: _react2.default.PropTypes.func.isRequired,
  handleToggleSelect: _react2.default.PropTypes.func.isRequired,
  handleDelete: _react2.default.PropTypes.func.isRequired,
  messages: _react2.default.PropTypes.array,
  uploading: _react2.default.PropTypes.bool
};

GalleryItem.defaultProps = {
  returnKey: 13,
  spaceKey: 32
};

exports.default = GalleryItem;

},{"constants/index":5,"i18n":"i18n","lib/SilverStripeComponent":"lib/SilverStripeComponent","react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  CSS_TRANSITION_TIME: 300,
  THUMBNAIL_HEIGHT: 150,
  THUMBNAIL_WIDTH: 200,
  BULK_ACTIONS: [{
    value: 'delete',
    label: _i18n2.default._t('AssetGalleryField.BULK_ACTIONS_DELETE'),
    destructive: true
  }],
  BULK_ACTIONS_PLACEHOLDER: _i18n2.default._t('AssetGalleryField.BULK_ACTIONS_PLACEHOLDER')
};

},{"i18n":"i18n"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = require('lib/SilverStripeComponent');

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _Gallery = require('containers/Gallery/Gallery');

var _Gallery2 = _interopRequireDefault(_Gallery);

var _Editor = require('containers/Editor/Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _GalleryActions = require('state/gallery/GalleryActions');

var galleryActions = _interopRequireWildcard(_GalleryActions);

var _EditorActions = require('state/editor/EditorActions');

var editorActions = _interopRequireWildcard(_EditorActions);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _Config = require('lib/Config');

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var AssetAdmin = function (_SilverStripeComponen) {
  _inherits(AssetAdmin, _SilverStripeComponen);

  function AssetAdmin(props) {
    _classCallCheck(this, AssetAdmin);

    var _this = _possibleConstructorReturn(this, _SilverStripeComponen.call(this, props));

    _this._didHandleUrl = false;

    _this.handleOpenFile = _this.handleOpenFile.bind(_this);
    _this.handleCloseFile = _this.handleCloseFile.bind(_this);
    _this.handleFileSave = _this.handleFileSave.bind(_this);
    _this.handleURL = _this.handleURL.bind(_this);
    _this.getConfig = _this.getConfig.bind(_this);
    return _this;
  }

  AssetAdmin.prototype.getConfig = function getConfig() {
    return _Config2.default.getSection(this.props.sectionConfigKey);
  };

  AssetAdmin.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    _SilverStripeComponen.prototype.componentDidMount.call(this);

    var captureRoute = true;

    var route = window.ss.router.resolveURLToBase(this.getConfig().assetsRoute);

    window.ss.router(route, function (ctx, next) {
      if (captureRoute) {
        _this2.handleURL(window.ss.router, ctx);
      } else {
        next();
      }
    });

    window.ss.router.exit(route, function (ctx, next) {
      var applies = window.ss.router.routeAppliesToCurrentLocation(route);
      if (!applies) {
        captureRoute = false;
      }
      next();
    });
  };

  AssetAdmin.prototype.componentWillUnmount = function componentWillUnmount() {
    _SilverStripeComponen.prototype.componentWillUnmount.call(this);

    this._didHandleUrl = true;
  };

  AssetAdmin.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this._didHandleUrl) {
      this.refreshURL(window.ss.router, nextProps);
    }
  };

  AssetAdmin.prototype.refreshURL = function refreshURL(router, nextProps) {
    var desiredURL = null;
    if (nextProps.fileId) {
      desiredURL = this.getConfig().assetsRoute.replace(/:folderAction\?/, 'show').replace(/:folderId\?/, nextProps.folderId).replace(/:fileAction\?/, 'edit').replace(/:fileId\?/, nextProps.fileId);
    } else {
      desiredURL = this.getConfig().assetsRoute.replace(/:folderAction\?/, 'show').replace(/:folderId\?.*$/, nextProps.folderId);
    }

    if (desiredURL !== null && desiredURL !== router.current) {
      router.show(desiredURL, null, false);
    }
  };

  AssetAdmin.prototype.handleURL = function handleURL(router, context) {
    if (context.params.folderAction !== 'show') {
      this.props.actions.gallery.setFolder(0);
      var defaultRoute = this.getConfig().assetsRouteHome;
      router.show(defaultRoute, null, false);
      return;
    }

    var folderId = parseInt(context.params.folderId, 10);
    var fileId = parseInt(context.params.fileId, 10);

    this.props.actions.gallery.setFolder(folderId);
    this.props.actions.gallery.setFile(fileId);

    this._didHandleUrl = true;
  };

  AssetAdmin.prototype.handleOpenFile = function handleOpenFile(fileId) {
    this.props.actions.gallery.setFile(fileId);
  };

  AssetAdmin.prototype.handleCloseFile = function handleCloseFile() {
    this.props.actions.gallery.setFile(null);
  };

  AssetAdmin.prototype.handleFileSave = function handleFileSave(id, updates) {
    return this.props.actions.gallery.updateFile(this.props.updateApi, id, updates);
  };

  AssetAdmin.prototype.render = function render() {
    var editor = this.props.file && _react2.default.createElement(_Editor2.default, {
      onClose: this.handleCloseFile,
      onFileSave: this.handleFileSave
    });
    return _react2.default.createElement(
      'div',
      { className: 'gallery' },
      editor,
      _react2.default.createElement(_Gallery2.default, {
        name: this.props.name,
        limit: this.props.limit,
        bulkActions: this.props.bulkActions,
        filesByParentApi: this.props.filesByParentApi,
        addFolderApi: this.props.addFolderApi,
        deleteApi: this.props.deleteApi,
        onOpenFile: this.handleOpenFile
      })
    );
  };

  return AssetAdmin;
}(_SilverStripeComponent2.default);

AssetAdmin.propTypes = {
  config: _react2.default.PropTypes.shape({
    forms: _react2.default.PropTypes.shape({
      editForm: _react2.default.PropTypes.shape({
        schemaUrl: _react2.default.PropTypes.string
      })
    })
  }),
  sectionConfigKey: _react2.default.PropTypes.string.isRequired,
  updateApi: _react2.default.PropTypes.func,
  file: _react2.default.PropTypes.object
};

function mapStateToProps(state) {
  var _state$assetAdmin$gal = state.assetAdmin.gallery;
  var files = _state$assetAdmin$gal.files;
  var fileId = _state$assetAdmin$gal.fileId;
  var folderId = _state$assetAdmin$gal.folderId;

  var file = null;
  if (fileId) {
    file = files.find(function (next) {
      return next.id === parseInt(fileId, 10);
    });
  }
  return {
    folderId: folderId,
    files: files,
    fileId: fileId,
    file: file
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: (0, _redux.bindActionCreators)(galleryActions, dispatch),
      editor: (0, _redux.bindActionCreators)(editorActions, dispatch)
    }
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(AssetAdmin);

},{"containers/Editor/Editor":7,"containers/Gallery/Gallery":8,"lib/Config":"lib/Config","lib/SilverStripeComponent":"lib/SilverStripeComponent","react":"react","react-redux":"react-redux","redux":"redux","state/editor/EditorActions":11,"state/gallery/GalleryActions":14}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _EditorActions = require('state/editor/EditorActions');

var editorActions = _interopRequireWildcard(_EditorActions);

var _TextField = require('components/TextField/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _FormAction = require('components/FormAction/FormAction');

var _FormAction2 = _interopRequireDefault(_FormAction);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var Editor = function (_Component) {
  _inherits(Editor, _Component);

  function Editor(props) {
    _classCallCheck(this, Editor);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleFieldUpdate = _this.handleFieldUpdate.bind(_this);
    _this.handleFileSave = _this.handleFileSave.bind(_this);

    _this.state = {
      isSaving: false
    };

    _this.editorFields = [{
      label: 'Title',
      name: 'title'
    }, {
      label: 'Filename',

      name: 'basename'
    }];

    _this.props.actions.updateFormState(_extends({}, props.file));
    return _this;
  }

  Editor.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.file !== this.props.file) {
      this.props.actions.updateFormState(_extends({}, nextProps.file));
    }
  };

  Editor.prototype.handleFileSave = function handleFileSave(event) {
    var _this2 = this;

    if (this.props.onFileSave) {
      this.setState({ isSaving: true });

      var updates = this.editorFields.reduce(function (prev, curr) {
        return _extends({}, prev, _defineProperty({}, curr.name, _this2.props.formState[curr.name]));
      }, {});
      this.props.onFileSave(this.props.file.id, updates).then(function () {
        return _this2.setState({ isSaving: false });
      });
    }

    event.stopPropagation();
    event.preventDefault();
  };

  Editor.prototype.handleFieldUpdate = function handleFieldUpdate(event) {
    this.props.actions.updateFormState(_extends({}, this.props.formState, _defineProperty({}, event.target.name, event.target.value)));
  };

  Editor.prototype.render = function render() {
    var _this3 = this;

    var file = this.props.file;

    var headerExtraParts = [];
    if (file.attributes.dimensions.width && file.attributes.dimensions.height) {
      headerExtraParts.push(file.attributes.dimensions.width + 'x' + file.attributes.dimensions.height + 'px');
    }
    headerExtraParts.push(file.size);
    var headerExtraPartsStr = headerExtraParts.join(', ');

    var preview = file.category === 'image' && _react2.default.createElement(
      'a',
      {
        href: file.url,
        className: 'editor__file-preview font-icon-search btn--no-text',
        target: '_blank'
      },
      _react2.default.createElement('img', { className: 'editor__file-thumbnail', src: file.url, alt: file.title })
    );

    return _react2.default.createElement(
      'div',
      { className: 'editor container-fluid' },
      _react2.default.createElement('a', {
        tabIndex: '1',
        className: 'btn btn--top-right btn--no-text font-icon-cancel btn--icon-xl',
        onClick: this.props.onClose,
        type: 'button',
        'aria-label': _i18n2.default._t('AssetGalleryField.CANCEL')
      }),
      _react2.default.createElement(
        'div',
        { className: 'editor__details' },
        _react2.default.createElement(
          'h1',
          { className: 'editor__heading' },
          file.title
        ),
        _react2.default.createElement(
          'p',
          { className: 'sub-heading' },
          headerExtraPartsStr
        ),
        preview,
        _react2.default.createElement(
          'ul',
          { className: 'nav nav-tabs hidden-xs-up', role: 'tablist' },
          _react2.default.createElement(
            'li',
            { className: 'nav-item' },
            _react2.default.createElement(
              'a',
              { className: 'nav-link active', 'data-toggle': 'tab', href: '#file-details', role: 'tab' },
              'Details'
            )
          ),
          _react2.default.createElement(
            'li',
            { className: 'nav-item' },
            _react2.default.createElement(
              'a',
              { className: 'nav-link', 'data-toggle': 'tab', href: '#file-usage', role: 'tab' },
              'Usage'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'tab-content' },
          _react2.default.createElement(
            'div',
            { className: 'tab-pane active', id: 'file-details', role: 'tabpanel' },
            this.editorFields.map(function (field, i) {
              return _react2.default.createElement(_TextField2.default, {
                key: i,
                leftTitle: field.label,
                name: field.name,
                value: _this3.props.formState[field.name],
                onChange: _this3.handleFieldUpdate
              });
            }),
            _react2.default.createElement(
              'div',
              { className: 'form-group' },
              _react2.default.createElement(
                'label',
                { htmlFor: 'folderLocation' },
                'Folder location'
              ),
              _react2.default.createElement('input', { type: 'text', className: 'form-control', id: 'folderLocation', value: 'uploads/folder name/', disabled: true })
            ),
            _react2.default.createElement(
              'div',
              { className: 'media break-string' },
              _react2.default.createElement(
                'div',
                { className: 'media-left' },
                _react2.default.createElement('i', { className: 'font-icon-link btn--icon-large editor__url-icon' })
              ),
              _react2.default.createElement(
                'div',
                { className: 'media-body' },
                _react2.default.createElement(
                  'a',
                  { href: file.url, target: '_blank' },
                  file.url
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'btn-toolbar' },
              _react2.default.createElement(
                'div',
                { className: 'btn-group hidden-xs-up', role: 'group', 'aria-label': '' },
                _react2.default.createElement(_FormAction2.default, {
                  type: 'submit',
                  bootstrapButtonStyle: 'primary',
                  icon: 'rocket',
                  handleClick: this.onFilePublish,
                  loading: this.state.isSaving,
                  label: _i18n2.default._t('AssetGalleryField.PUBLISH')
                })
              ),
              _react2.default.createElement(_FormAction2.default, {
                type: 'submit',
                bootstrapButtonStyle: 'primary',
                icon: 'save',
                handleClick: this.handleFileSave,
                loading: this.state.isSaving,
                label: _i18n2.default._t('AssetGalleryField.SAVE')
              }),
              _react2.default.createElement('button', {
                type: 'button',
                'data-container': 'body',
                className: 'btn btn-secondary font-icon-dot-3 btn--no-text btn--icon-large hidden-xs-up',
                'data-toggle': 'popover',
                title: 'Page actions',
                'data-placement': 'top',
                'data-content': '<a href=\'\'>Add to campaign</a><a href=\'\'>Remove from campaign</a>'
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'tab-pane', id: 'file-usage', role: 'tabpanel' },
            _react2.default.createElement(
              'ul',
              { className: 'list-unstyled text-muted m-b-2' },
              _react2.default.createElement(
                'li',
                null,
                file.type
              ),
              _react2.default.createElement(
                'li',
                null,
                _i18n2.default._t('AssetGalleryField.CREATED'),
                ' ',
                file.created
              ),
              _react2.default.createElement(
                'li',
                null,
                _i18n2.default._t('AssetGalleryField.LASTEDIT'),
                ' ',
                file.lastUpdated
              )
            ),
            _react2.default.createElement(
              'table',
              { className: 'table' },
              _react2.default.createElement(
                'thead',
                null,
                _react2.default.createElement(
                  'tr',
                  null,
                  _react2.default.createElement(
                    'th',
                    null,
                    '#'
                  ),
                  _react2.default.createElement(
                    'th',
                    null,
                    'Used on'
                  ),
                  _react2.default.createElement(
                    'th',
                    null,
                    'State'
                  )
                )
              ),
              _react2.default.createElement(
                'tbody',
                null,
                _react2.default.createElement(
                  'tr',
                  null,
                  _react2.default.createElement(
                    'th',
                    { scope: 'row' },
                    '1'
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'h5',
                      null,
                      _react2.default.createElement(
                        'a',
                        { href: '' },
                        'About us'
                      )
                    ),
                    _react2.default.createElement(
                      'small',
                      { className: 'sub-heading' },
                      'Page'
                    )
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'span',
                      { className: 'label label-info' },
                      'Draft'
                    )
                  )
                ),
                _react2.default.createElement(
                  'tr',
                  null,
                  _react2.default.createElement(
                    'th',
                    { scope: 'row' },
                    '2'
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'h5',
                      null,
                      _react2.default.createElement(
                        'a',
                        { href: '' },
                        'My great blog post'
                      )
                    ),
                    _react2.default.createElement(
                      'p',
                      { className: 'sub-heading' },
                      'Blog post'
                    )
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'span',
                      { className: 'label label-success' },
                      'Published'
                    )
                  )
                ),
                _react2.default.createElement(
                  'tr',
                  null,
                  _react2.default.createElement(
                    'th',
                    { scope: 'row' },
                    '3'
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'h5',
                      null,
                      _react2.default.createElement(
                        'a',
                        { href: '' },
                        'Our services'
                      )
                    ),
                    _react2.default.createElement(
                      'p',
                      { className: 'sub-heading' },
                      'Services Page'
                    )
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'span',
                      { className: 'label label-success' },
                      'Published'
                    )
                  )
                ),
                _react2.default.createElement(
                  'tr',
                  null,
                  _react2.default.createElement(
                    'th',
                    { scope: 'row' },
                    '4'
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'h5',
                      null,
                      _react2.default.createElement(
                        'a',
                        { href: '' },
                        'June release'
                      )
                    ),
                    _react2.default.createElement(
                      'p',
                      { className: 'sub-heading' },
                      'Campaign'
                    )
                  ),
                  _react2.default.createElement('td', null)
                ),
                _react2.default.createElement(
                  'tr',
                  null,
                  _react2.default.createElement(
                    'th',
                    { scope: 'row' },
                    '5'
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'h5',
                      null,
                      _react2.default.createElement(
                        'a',
                        { href: '' },
                        'Marketing'
                      )
                    ),
                    _react2.default.createElement(
                      'p',
                      { className: 'sub-heading' },
                      'Campaign'
                    )
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'span',
                      { className: 'label label-warning' },
                      'Scheduled'
                    )
                  )
                ),
                _react2.default.createElement(
                  'tr',
                  null,
                  _react2.default.createElement(
                    'th',
                    { scope: 'row' },
                    '6'
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'h5',
                      null,
                      _react2.default.createElement(
                        'a',
                        { href: '' },
                        'Services section'
                      )
                    ),
                    _react2.default.createElement(
                      'p',
                      { className: 'sub-heading' },
                      'Campaign'
                    )
                  ),
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
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
  };

  return Editor;
}(_react.Component);

Editor.propTypes = {
  formState: _react2.default.PropTypes.object,
  file: _react2.default.PropTypes.shape({
    id: _react2.default.PropTypes.number,
    title: _react2.default.PropTypes.string,
    basename: _react2.default.PropTypes.string,
    url: _react2.default.PropTypes.string,
    size: _react2.default.PropTypes.string,
    type: _react2.default.PropTypes.string,
    created: _react2.default.PropTypes.string,
    lastUpdated: _react2.default.PropTypes.string,
    attributes: _react2.default.PropTypes.shape({
      dimensions: _react2.default.PropTypes.shape({
        width: _react2.default.PropTypes.number,
        height: _react2.default.PropTypes.number
      })
    })
  }),
  actions: _react2.default.PropTypes.object,
  onClose: _react2.default.PropTypes.func.isRequired,
  onFileSave: _react2.default.PropTypes.func
};

function mapStateToProps(state) {
  var _state$assetAdmin$gal = state.assetAdmin.gallery;
  var files = _state$assetAdmin$gal.files;
  var fileId = _state$assetAdmin$gal.fileId;

  var file = null;
  if (fileId) {
    file = files.find(function (next) {
      return next.id === parseInt(fileId, 10);
    });
  }
  return {
    file: file,
    formState: state.assetAdmin.editor.formState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: (0, _redux.bindActionCreators)(editorActions, dispatch)
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Editor);

},{"components/FormAction/FormAction":"components/FormAction/FormAction","components/TextField/TextField":"components/TextField/TextField","i18n":"i18n","react":"react","react-redux":"react-redux","redux":"redux","state/editor/EditorActions":11}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gallery = undefined;

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

var _AssetDropzone = require('components/AssetDropzone/AssetDropzone');

var _AssetDropzone2 = _interopRequireDefault(_AssetDropzone);

var _GalleryItem = require('components/GalleryItem/GalleryItem');

var _GalleryItem2 = _interopRequireDefault(_GalleryItem);

var _BulkActions = require('components/BulkActions/BulkActions');

var _BulkActions2 = _interopRequireDefault(_BulkActions);

var _index = require('constants/index');

var _index2 = _interopRequireDefault(_index);

var _GalleryActions = require('state/gallery/GalleryActions');

var galleryActions = _interopRequireWildcard(_GalleryActions);

var _QueuedFilesActions = require('state/queuedFiles/QueuedFilesActions');

var queuedFilesActions = _interopRequireWildcard(_QueuedFilesActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

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

var Gallery = exports.Gallery = function (_Component) {
  _inherits(Gallery, _Component);

  function Gallery(props) {
    _classCallCheck(this, Gallery);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.sort = 'name';
    _this.direction = 'asc';

    _this.sorters = [{
      field: 'title',
      direction: 'asc',
      label: _i18n2.default._t('AssetGalleryField.FILTER_TITLE_ASC')
    }, {
      field: 'title',
      direction: 'desc',
      label: _i18n2.default._t('AssetGalleryField.FILTER_TITLE_DESC')
    }, {
      field: 'created',
      direction: 'desc',
      label: _i18n2.default._t('AssetGalleryField.FILTER_DATE_DESC')
    }, {
      field: 'created',
      direction: 'asc',
      label: _i18n2.default._t('AssetGalleryField.FILTER_DATE_ASC')
    }];

    _this.handleFolderActivate = _this.handleFolderActivate.bind(_this);
    _this.handleFileActivate = _this.handleFileActivate.bind(_this);
    _this.handleToggleSelect = _this.handleToggleSelect.bind(_this);
    _this.handleAddedFile = _this.handleAddedFile.bind(_this);
    _this.handleCancelUpload = _this.handleCancelUpload.bind(_this);
    _this.handleRemoveErroredUpload = _this.handleRemoveErroredUpload.bind(_this);
    _this.handleUploadProgress = _this.handleUploadProgress.bind(_this);
    _this.handleSending = _this.handleSending.bind(_this);
    _this.handleItemDelete = _this.handleItemDelete.bind(_this);
    _this.handleBackClick = _this.handleBackClick.bind(_this);
    _this.handleMoreClick = _this.handleMoreClick.bind(_this);
    _this.handleSort = _this.handleSort.bind(_this);
    _this.handleSuccessfulUpload = _this.handleSuccessfulUpload.bind(_this);
    _this.handleFailedUpload = _this.handleFailedUpload.bind(_this);
    _this.handleAddFolder = _this.handleAddFolder.bind(_this);
    return _this;
  }

  Gallery.prototype.componentDidMount = function componentDidMount() {
    this.refreshFolderIfNeeded();
  };

  Gallery.prototype.componentWillUpdate = function componentWillUpdate() {
    var $select = (0, _jQuery2.default)(_reactDom2.default.findDOMNode(this)).find('.gallery__sort .dropdown');
    $select.off('change');
  };

  Gallery.prototype.componentDidUpdate = function componentDidUpdate() {
    var $select = (0, _jQuery2.default)(_reactDom2.default.findDOMNode(this)).find('.gallery__sort .dropdown');

    $select.chosen({
      allow_single_deselect: true,
      disable_search_threshold: 20
    });

    $select.on('change', function () {
      return _reactAddonsTestUtils2.default.Simulate.click($select.find(':selected')[0]);
    });

    this.refreshFolderIfNeeded();
  };

  Gallery.prototype.getNoItemsNotice = function getNoItemsNotice() {
    if (this.props.files.length < 1 && this.props.queuedFiles.items.length < 1) {
      return _react2.default.createElement(
        'p',
        { className: 'gallery__no-item-notice' },
        _i18n2.default._t('AssetGalleryField.NOITEMSFOUND')
      );
    }

    return null;
  };

  Gallery.prototype.getBackButton = function getBackButton() {
    var classes = ['btn', 'btn-secondary', 'btn--no-text', 'font-icon-level-up', 'btn--icon-large', 'gallery__back'].join(' ');
    if (this.props.parentfolderId !== null) {
      return _react2.default.createElement('button', {
        className: classes,
        onClick: this.handleBackClick,
        ref: 'backButton'
      });
    }

    return null;
  };

  Gallery.prototype.getBulkActionsComponent = function getBulkActionsComponent() {
    var _this2 = this;

    var deleteAction = function deleteAction(ids) {
      _this2.props.actions.gallery.deleteItems(_this2.props.deleteApi, ids);
    };

    if (this.props.selectedFiles.length > 0 && this.props.bulkActions) {
      return _react2.default.createElement(_BulkActions2.default, {
        deleteAction: deleteAction,
        key: this.props.selectedFiles.length > 0
      });
    }

    return null;
  };

  Gallery.prototype.getMoreButton = function getMoreButton() {
    if (this.props.count > this.props.files.length) {
      return _react2.default.createElement(
        'button',
        {
          className: 'gallery__load-more',
          onClick: this.handleMoreClick
        },
        _i18n2.default._t('AssetGalleryField.LOADMORE')
      );
    }

    return null;
  };

  Gallery.prototype.refreshFolderIfNeeded = function refreshFolderIfNeeded() {
    var self = this;

    if (!isNaN(this.props.folderId) && this.props.folderId >= 0 && this.props.folderId !== this.props.loadedfolderId) {
      this.props.actions.gallery.loadFolderContents(this.props.filesByParentApi, this.props.folderId, this.props.limit, this.props.page).then(function () {
        var fileId = self.props.fileId;
        var file = self.props.files.find(function (next) {
          return next.id === parseInt(fileId, 10);
        });
        if (file) {
          self.props.onOpenFile(fileId, file);
        }
      });
    }
  };

  Gallery.prototype.handleSort = function handleSort(event) {
    var data = event.target.dataset;
    this.props.actions.queuedFiles.purgeUploadQueue();
    this.props.actions.gallery.sortFiles(getComparator(data.field, data.direction));
  };

  Gallery.prototype.handleCancelUpload = function handleCancelUpload(fileData) {
    fileData.xhr.abort();
    this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedAtTime);
  };

  Gallery.prototype.handleRemoveErroredUpload = function handleRemoveErroredUpload(fileData) {
    this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedAtTime);
  };

  Gallery.prototype.handleAddedFile = function handleAddedFile(data) {
    this.props.actions.queuedFiles.addQueuedFile(data);
  };

  Gallery.prototype.handleSending = function handleSending(file, xhr) {
    this.props.actions.queuedFiles.updateQueuedFile(file._queuedAtTime, { xhr: xhr });
  };

  Gallery.prototype.handleUploadProgress = function handleUploadProgress(file, progress) {
    this.props.actions.queuedFiles.updateQueuedFile(file._queuedAtTime, { progress: progress });
  };

  Gallery.prototype.handleAddFolder = function handleAddFolder() {
    var folderName = prompt('Folder name (or blank to cancel)');
    if (folderName) {
      this.props.actions.gallery.addFolder(this.props.addFolderApi, this.props.folderId, folderName);
    }
  };

  Gallery.prototype.handleSuccessfulUpload = function handleSuccessfulUpload(file) {
    var json = JSON.parse(file.xhr.response);

    if (typeof json[0].error !== 'undefined') {
      this.handleFailedUpload(file);
      return;
    }

    this.props.actions.queuedFiles.removeQueuedFile(file._queuedAtTime);
    this.props.actions.gallery.addFiles(json, this.props.count + 1);
  };

  Gallery.prototype.handleFailedUpload = function handleFailedUpload(file) {
    this.props.actions.queuedFiles.failUpload(file._queuedAtTime);
  };

  Gallery.prototype.handleItemDelete = function handleItemDelete(event, item) {
    if (confirm(_i18n2.default._t('AssetGalleryField.CONFIRMDELETE'))) {
      this.props.actions.gallery.deleteItems(this.props.deleteApi, [item.id]);
    }
  };

  Gallery.prototype.itemIsSelected = function itemIsSelected(id) {
    return this.props.selectedFiles.indexOf(id) > -1;
  };

  Gallery.prototype.itemIsHighlighted = function itemIsHighlighted(id) {
    return this.props.highlightedFiles.indexOf(id) > -1;
  };

  Gallery.prototype.handleFolderActivate = function handleFolderActivate(event, folder) {
    this.props.actions.gallery.setFolder(folder.id);
  };

  Gallery.prototype.handleFileActivate = function handleFileActivate(event, file) {
    if (file.created === null) {
      return;
    }

    this.props.onOpenFile(file.id, file);
  };

  Gallery.prototype.handleToggleSelect = function handleToggleSelect(event, item) {
    if (this.props.selectedFiles.indexOf(item.id) === -1) {
      this.props.actions.gallery.selectFiles([item.id]);
    } else {
      this.props.actions.gallery.deselectFiles([item.id]);
    }
  };

  Gallery.prototype.handleMoreClick = function handleMoreClick(event) {
    event.stopPropagation();
    event.preventDefault();
    this.props.actions.gallery.deselectFiles();
  };

  Gallery.prototype.handleBackClick = function handleBackClick(event) {
    event.preventDefault();
    this.props.actions.gallery.setFolder(this.props.parentfolderId);
  };

  Gallery.prototype.render = function render() {
    var _this3 = this;

    var dropzoneOptions = {
      url: 'admin/assets/EditForm/field/Upload/upload',
      paramName: 'Upload',
      clickable: '#upload-button'
    };
    var securityID = (0, _jQuery2.default)(':input[name=SecurityID]').val();
    var canEdit = this.props.canEdit;

    return _react2.default.createElement(
      'div',
      { className: 'gallery__main' },
      _react2.default.createElement(
        _reactAddonsCssTransitionGroup2.default,
        {
          transitionName: 'bulk-actions',
          transitionEnterTimeout: _index2.default.CSS_TRANSITION_TIME,
          transitionLeaveTimeout: _index2.default.CSS_TRANSITION_TIME
        },
        this.getBulkActionsComponent()
      ),
      _react2.default.createElement(
        'div',
        { className: 'gallery__sort fieldholder-small' },
        _react2.default.createElement(
          'select',
          {
            className: 'dropdown no-change-track no-chzn',
            tabIndex: '0',
            style: { width: '160px' }
          },
          this.sorters.map(function (sorter, i) {
            return _react2.default.createElement(
              'option',
              {
                key: i,
                onClick: _this3.handleSort,
                'data-field': sorter.field,
                'data-direction': sorter.direction
              },
              sorter.label
            );
          })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'toolbar--content toolbar--space-save' },
        this.getBackButton(),
        _react2.default.createElement(
          'button',
          {
            id: 'upload-button',
            className: 'btn btn-secondary font-icon-upload btn--icon-xl',
            type: 'button',
            disabled: !canEdit
          },
          _react2.default.createElement(
            'span',
            { className: 'btn__text' },
            _i18n2.default._t('AssetGalleryField.DROPZONE_UPLOAD')
          )
        ),
        _react2.default.createElement(
          'button',
          {
            id: 'add-folder-button',
            className: 'btn btn-secondary font-icon-folder-add btn--icon-xl ',
            type: 'button',
            onClick: this.handleAddFolder,
            disabled: !canEdit
          },
          _react2.default.createElement(
            'span',
            { className: 'btn__text' },
            _i18n2.default._t('AssetGalleryField.ADD_FOLDER_BUTTON')
          )
        )
      ),
      _react2.default.createElement(
        _AssetDropzone2.default,
        {
          canUpload: canEdit,
          handleAddedFile: this.handleAddedFile,
          handleError: this.handleFailedUpload,
          handleSuccess: this.handleSuccessfulUpload,
          handleSending: this.handleSending,
          handleUploadProgress: this.handleUploadProgress,
          folderId: this.props.folderId,
          options: dropzoneOptions,
          securityID: securityID,
          uploadButton: false
        },
        _react2.default.createElement(
          'div',
          { className: 'gallery__folders' },
          this.props.files.map(function (file, i) {
            var component = void 0;
            if (file.type === 'folder') {
              component = _react2.default.createElement(_GalleryItem2.default, {
                key: i,
                item: file,
                selected: _this3.itemIsSelected(file.id),
                highlighted: _this3.itemIsHighlighted(file.id),
                handleDelete: _this3.handleItemDelete,
                handleToggleSelect: _this3.handleToggleSelect,
                handleActivate: _this3.handleFolderActivate
              });
            }
            return component;
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'gallery__files' },
          this.props.queuedFiles.items.map(function (file, i) {
            return _react2.default.createElement(_GalleryItem2.default, {
              key: 'queued_file_' + i,
              item: file,
              selected: _this3.itemIsSelected(file.id),
              highlighted: _this3.itemIsHighlighted(file.id),
              handleDelete: _this3.handleItemDelete,
              handleToggleSelect: _this3.handleToggleSelect,
              handleActivate: _this3.handleFileActivate,
              handleCancelUpload: _this3.handleCancelUpload,
              handleRemoveErroredUpload: _this3.handleRemoveErroredUpload,
              messages: file.messages,
              uploading: true
            });
          }),
          this.props.files.map(function (file, i) {
            var component = void 0;
            if (file.type !== 'folder') {
              component = _react2.default.createElement(_GalleryItem2.default, {
                key: 'file_' + i,
                item: file,
                selected: _this3.itemIsSelected(file.id),
                highlighted: _this3.itemIsHighlighted(file.id),
                handleDelete: _this3.handleItemDelete,
                handleToggleSelect: _this3.handleToggleSelect,
                handleActivate: _this3.handleFileActivate
              });
            }
            return component;
          })
        ),
        this.getNoItemsNotice(),
        _react2.default.createElement(
          'div',
          { className: 'gallery__load' },
          this.getMoreButton()
        )
      )
    );
  };

  return Gallery;
}(_react.Component);

Gallery.propTypes = {
  files: _react2.default.PropTypes.array,
  count: _react2.default.PropTypes.number,
  fileId: _react2.default.PropTypes.number,
  folderId: _react2.default.PropTypes.number.isRequired,
  loadedfolderId: _react2.default.PropTypes.number,
  parentfolderId: _react2.default.PropTypes.number,
  selectedFiles: _react2.default.PropTypes.array,
  highlightedFiles: _react2.default.PropTypes.array,
  bulkActions: _react2.default.PropTypes.bool,
  limit: _react2.default.PropTypes.number,
  page: _react2.default.PropTypes.number,
  canEdit: _react2.default.PropTypes.bool,

  queuedFiles: _react2.default.PropTypes.shape({
    items: _react2.default.PropTypes.array.isRequired
  }),

  onOpenFile: _react2.default.PropTypes.func.isRequired,

  addFolderApi: _react2.default.PropTypes.func,
  deleteApi: _react2.default.PropTypes.func,
  filesByParentApi: _react2.default.PropTypes.func,

  actions: _react2.default.PropTypes.object
};

function mapStateToProps(state) {
  var _state$assetAdmin$gal = state.assetAdmin.gallery;
  var files = _state$assetAdmin$gal.files;
  var fileId = _state$assetAdmin$gal.fileId;
  var folderId = _state$assetAdmin$gal.folderId;

  return {
    files: files,
    fileId: fileId,
    count: state.assetAdmin.gallery.count,
    folderId: folderId,
    loadedfolderId: state.assetAdmin.gallery.loadedfolderId,
    parentfolderId: state.assetAdmin.gallery.parentfolderId,
    selectedFiles: state.assetAdmin.gallery.selectedFiles,
    highlightedFiles: state.assetAdmin.gallery.highlightedFiles,
    page: state.assetAdmin.gallery.page,
    canEdit: state.assetAdmin.gallery.canEdit,
    canDelete: state.assetAdmin.gallery.canDelete,
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

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Gallery);

},{"components/AssetDropzone/AssetDropzone":2,"components/BulkActions/BulkActions":3,"components/GalleryItem/GalleryItem":4,"constants/index":5,"i18n":"i18n","jQuery":"jQuery","react":"react","react-addons-css-transition-group":"react-addons-css-transition-group","react-addons-test-utils":"react-addons-test-utils","react-dom":"react-dom","react-redux":"react-redux","redux":"redux","state/gallery/GalleryActions":14,"state/queuedFiles/QueuedFilesActions":17}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureStore;

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createStoreWithMiddleware = (0, _redux.applyMiddleware)(_reduxThunk2.default, (0, _reduxLogger2.default)())(_redux.createStore);

function configureStore() {
  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var store = createStoreWithMiddleware(_reducer2.default, initialState);

  return store;
}

},{"./reducer":19,"redux":"redux","redux-logger":21,"redux-thunk":"redux-thunk"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = ['UPDATE_FORM_STATE', 'SET_FILE'].reduce(function (obj, item) {
  return _extends(obj, _defineProperty({}, item, 'EDITOR.' + item));
}, {});

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFormState = updateFormState;

var _EditorActionTypes = require('./EditorActionTypes');

var _EditorActionTypes2 = _interopRequireDefault(_EditorActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateFormState(updates) {
  return function (dispatch) {
    return dispatch({
      type: _EditorActionTypes2.default.UPDATE_FORM_STATE,
      payload: { updates: updates }
    });
  };
}

},{"./EditorActionTypes":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = editorReducer;

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _EditorActionTypes = require('./EditorActionTypes');

var _EditorActionTypes2 = _interopRequireDefault(_EditorActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  formState: {}
};

function editorReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {

    case _EditorActionTypes2.default.UPDATE_FORM_STATE:
      {
        return (0, _deepFreeze2.default)(_extends({}, state, {
          formState: _extends({}, state.formState, action.payload.updates)
        }));
      }

    default:
      return state;
  }
}

},{"./EditorActionTypes":10,"deep-freeze":"deep-freeze"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = ['ADD_FILES', 'DESELECT_FILES', 'REMOVE_FILES', 'SELECT_FILES', 'SORT_FILES', 'UPDATE_FILE_REQUEST', 'UPDATE_FILE_SUCCESS', 'ADD_FOLDER_REQUEST', 'ADD_FOLDER_SUCCESS', 'ADD_FOLDER_FAILURE', 'DELETE_ITEM_REQUEST', 'DELETE_ITEM_SUCCESS', 'DELETE_ITEM_FAILURE', 'LOAD_FOLDER_REQUEST', 'LOAD_FOLDER_SUCCESS', 'SET_FOLDER', 'SET_FILE', 'SET_FOLDER_PERMISSIONS', 'HIGHLIGHT_FILES'].reduce(function (obj, item) {
  return _extends(obj, _defineProperty({}, item, 'GALLERY.' + item));
}, {});

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.setFolder = setFolder;
exports.setFile = setFile;
exports.addFiles = addFiles;
exports.deleteItems = deleteItems;
exports.loadFolderContents = loadFolderContents;
exports.updateFile = updateFile;
exports.selectFiles = selectFiles;
exports.deselectFiles = deselectFiles;
exports.highlightFiles = highlightFiles;
exports.sortFiles = sortFiles;
exports.addFolder = addFolder;
exports.setFolderPermissions = setFolderPermissions;

var _GalleryActionTypes = require('./GalleryActionTypes');

var _GalleryActionTypes2 = _interopRequireDefault(_GalleryActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setFolder(folderId) {
  return function (dispatch) {
    dispatch({
      type: _GalleryActionTypes2.default.SET_FOLDER,
      payload: { folderId: folderId }
    });

    dispatch({
      type: _GalleryActionTypes2.default.SET_FILE,
      payload: { fileId: null }
    });
    dispatch({
      type: _GalleryActionTypes2.default.HIGHLIGHT_FILES,
      payload: { ids: null }
    });
  };
}

function setFile(fileId) {
  return function (dispatch) {
    dispatch({
      type: _GalleryActionTypes2.default.HIGHLIGHT_FILES,
      payload: { ids: [fileId] }
    });

    dispatch({
      type: _GalleryActionTypes2.default.SET_FILE,
      payload: { fileId: fileId }
    });
  };
}

function addFiles(files, count) {
  return function (dispatch) {
    return dispatch({
      type: _GalleryActionTypes2.default.ADD_FILES,
      payload: { files: files, count: count }
    });
  };
}

function deleteItems(deleteApi, ids) {
  return function (dispatch) {
    dispatch({
      type: _GalleryActionTypes2.default.DELETE_ITEM_REQUEST,
      payload: { ids: ids }
    });

    return deleteApi({ ids: ids }).then(function (json) {
      dispatch({
        type: _GalleryActionTypes2.default.DELETE_ITEM_SUCCESS,
        payload: { ids: ids }
      });

      dispatch({
        type: _GalleryActionTypes2.default.SET_FILE,
        payload: { fileId: null }
      });

      return json;
    }).catch(function (error) {
      dispatch({
        type: _GalleryActionTypes2.default.DELETE_ITEM_FAILURE,
        payload: { error: error }
      });
    });
  };
}

function loadFolderContents(filesByParentApi, folderId, limit, page) {
  return function (dispatch) {
    dispatch({
      type: _GalleryActionTypes2.default.LOAD_FOLDER_REQUEST,
      payload: { viewingFolder: folderId > 0, folderId: parseInt(folderId, 10) }
    });

    return filesByParentApi({ id: folderId, limit: limit, page: page }).then(function (data) {
      dispatch({
        type: _GalleryActionTypes2.default.LOAD_FOLDER_SUCCESS,
        payload: {
          folderId: parseInt(folderId, 10),
          parentfolderId: data.parent,
          files: data.files,
          canEdit: data.canEdit,
          canDelete: data.canDelete
        }
      });
    });
  };
}

function updateFile(updateApi, id, updates) {
  return function (dispatch) {
    dispatch({
      type: _GalleryActionTypes2.default.UPDATE_FILE_REQUEST,
      payload: { id: id, updates: updates }
    });

    return updateApi(_extends({}, { id: id }, updates)).then(function () {
      dispatch({
        type: _GalleryActionTypes2.default.UPDATE_FILE_SUCCESS,
        payload: { id: id, updates: updates }
      });
    });
  };
}

function selectFiles() {
  var ids = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

  return function (dispatch) {
    return dispatch({
      type: _GalleryActionTypes2.default.SELECT_FILES,
      payload: { ids: ids }
    });
  };
}

function deselectFiles() {
  var ids = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

  return function (dispatch) {
    return dispatch({
      type: _GalleryActionTypes2.default.DESELECT_FILES,
      payload: { ids: ids }
    });
  };
}

function highlightFiles() {
  var ids = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

  return function (dispatch) {
    return dispatch({
      type: _GalleryActionTypes2.default.HIGHLIGHT_FILES,
      payload: { ids: ids }
    });
  };
}

function sortFiles(comparator) {
  return function (dispatch) {
    return dispatch({
      type: _GalleryActionTypes2.default.SORT_FILES,
      payload: { comparator: comparator }
    });
  };
}

function addFolder(addFolderApi, folderId, folderName) {
  return function (dispatch) {
    dispatch({
      type: _GalleryActionTypes2.default.ADD_FOLDER_REQUEST,
      payload: { folderName: folderName }
    });

    return addFolderApi({ folderId: isNaN(folderId) ? 0 : folderId, folderName: folderName }).then(function (json) {
      dispatch({
        type: _GalleryActionTypes2.default.ADD_FOLDER_SUCCESS,
        payload: { folderName: folderName }
      });

      dispatch({
        type: _GalleryActionTypes2.default.SET_FOLDER,
        payload: { folderId: json.folderID }
      });
    }).catch(function (err) {
      dispatch({
        type: _GalleryActionTypes2.default.ADD_FOLDER_FAILURE,
        payload: { error: 'Couldn\'t create ' + folderName + ': ' + err }
      });
    });
  };
}

function setFolderPermissions(folderPermissions) {
  return function (dispatch) {
    dispatch({
      type: _GalleryActionTypes2.default.SET_FOLDER_PERMISSIONS,
      payload: folderPermissions
    });
  };
}

},{"./GalleryActionTypes":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = galleryReducer;

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _GalleryActionTypes = require('./GalleryActionTypes');

var _GalleryActionTypes2 = _interopRequireDefault(_GalleryActionTypes);

var _index = require('constants/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  bulkActions: {
    placeholder: _index2.default.BULK_ACTIONS_PLACEHOLDER,
    options: _index2.default.BULK_ACTIONS
  },
  count: 0,
  editorFields: [],
  file: null,
  files: [],
  fileId: 0,
  folderId: 0,
  focus: false,
  parentfolderId: null,
  path: null,
  selectedFiles: [],
  highlightedFiles: [],
  viewingFolder: false,
  page: 0,
  folderPermissions: {
    canEdit: false,
    canDelete: false
  }
};

function galleryReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  var nextState = void 0;

  switch (action.type) {

    case _GalleryActionTypes2.default.SET_FOLDER:
      return (0, _deepFreeze2.default)(_extends({}, state, {
        folderId: parseInt(action.payload.folderId, 10) || 0,
        fileId: 0 }));

    case _GalleryActionTypes2.default.SET_FILE:
      return (0, _deepFreeze2.default)(_extends({}, state, {
        fileId: parseInt(action.payload.fileId, 10) || 0
      }));

    case _GalleryActionTypes2.default.ADD_FILES:
      {
        var _ret = function () {
          var nextFilesState = [];

          action.payload.files.forEach(function (payloadFile) {
            var fileInState = false;

            state.files.forEach(function (stateFile) {
              if (stateFile.id === payloadFile.id) {
                fileInState = true;
              }
            });

            if (!fileInState) {
              nextFilesState.push(payloadFile);
            }
          });

          return {
            v: (0, _deepFreeze2.default)(_extends({}, state, {
              count: typeof action.payload.count !== 'undefined' ? action.payload.count : state.count,
              files: nextFilesState.concat(state.files)
            }))
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

    case _GalleryActionTypes2.default.REMOVE_FILES:
      {
        if (typeof action.payload.ids === 'undefined') {
          nextState = (0, _deepFreeze2.default)(_extends({}, state, { count: 0, files: [] }));
        } else {
          nextState = (0, _deepFreeze2.default)(_extends({}, state, {
            count: state.files.filter(function (file) {
              return action.payload.ids.indexOf(file.id) === -1;
            }).length,
            files: state.files.filter(function (file) {
              return action.payload.ids.indexOf(file.id) === -1;
            })
          }));
        }

        return nextState;
      }

    case _GalleryActionTypes2.default.UPDATE_FILE_SUCCESS:
      {
        var _ret2 = function () {
          var fileIndex = state.files.map(function (file) {
            return file.id;
          }).indexOf(action.payload.id);
          var updatedFile = _extends({}, state.files[fileIndex], action.payload.updates);

          return {
            v: (0, _deepFreeze2.default)(_extends({}, state, {
              files: state.files.map(function (file) {
                return file.id === updatedFile.id ? updatedFile : file;
              })
            }))
          };
        }();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
      }

    case _GalleryActionTypes2.default.SELECT_FILES:
      {
        if (action.payload.ids === null) {
          nextState = (0, _deepFreeze2.default)(_extends({}, state, {
            selectedFiles: state.selectedFiles.concat(state.files.map(function (file) {
              return file.id;
            }).filter(function (id) {
              return state.selectedFiles.indexOf(id) === -1;
            }))
          }));
        } else {
          nextState = (0, _deepFreeze2.default)(_extends({}, state, {
            selectedFiles: state.selectedFiles.concat(action.payload.ids.filter(function (id) {
              return state.selectedFiles.indexOf(id) === -1;
            }))
          }));
        }

        return nextState;
      }

    case _GalleryActionTypes2.default.DESELECT_FILES:
      {
        if (action.payload.ids === null) {
          nextState = (0, _deepFreeze2.default)(_extends({}, state, { selectedFiles: [] }));
        } else {
          nextState = (0, _deepFreeze2.default)(_extends({}, state, {
            selectedFiles: state.selectedFiles.filter(function (id) {
              return action.payload.ids.indexOf(id) === -1;
            })
          }));
        }

        return nextState;
      }

    case _GalleryActionTypes2.default.HIGHLIGHT_FILES:
      {
        nextState = (0, _deepFreeze2.default)(_extends({}, state, {
          highlightedFiles: action.payload.ids || []
        }));

        return nextState;
      }

    case _GalleryActionTypes2.default.DELETE_ITEM_SUCCESS:
      {
        return (0, _deepFreeze2.default)(_extends({}, state, {
          selectedFiles: state.selectedFiles.filter(function (id) {
            return action.payload.ids.indexOf(id) === -1;
          }),
          files: state.files.filter(function (file) {
            return action.payload.ids.indexOf(file.id) === -1;
          }),
          count: state.files.filter(function (file) {
            return action.payload.ids.indexOf(file.id) === -1;
          }).length
        }));
      }

    case _GalleryActionTypes2.default.SORT_FILES:
      {
        var folders = state.files.filter(function (file) {
          return file.type === 'folder';
        });
        var files = state.files.filter(function (file) {
          return file.type !== 'folder';
        });

        return (0, _deepFreeze2.default)(_extends({}, state, {
          files: folders.sort(action.payload.comparator).concat(files.sort(action.payload.comparator))
        }));
      }

    case _GalleryActionTypes2.default.LOAD_FOLDER_REQUEST:
      {
        return (0, _deepFreeze2.default)(_extends({}, state, {
          loadedfolderId: action.payload.folderId,
          folderId: action.payload.folderId,
          viewingFolder: action.payload.viewingFolder,
          selectedFiles: [],
          files: [],
          count: 0
        }));
      }

    case _GalleryActionTypes2.default.LOAD_FOLDER_SUCCESS:
      {
        return (0, _deepFreeze2.default)(_extends({}, state, {
          parentfolderId: action.payload.parentfolderId,
          canEdit: action.payload.canEdit,
          canDelete: action.payload.canDelete,
          files: action.payload.files,
          count: action.payload.files.length
        }));
      }

    case _GalleryActionTypes2.default.ADD_FOLDER_REQUEST:
      return state;

    case _GalleryActionTypes2.default.ADD_FOLDER_FAILURE:
      return state;

    case _GalleryActionTypes2.default.ADD_FOLDER_SUCCESS:
      return state;

    case _GalleryActionTypes2.default.SET_FOLDER_PERMISSIONS:
      {
        return (0, _deepFreeze2.default)(_extends({}, state, {
          folderPermissions: {
            canEdit: action.payload.canEdit,
            canDelete: action.payload.canDelete
          }
        }));
      }

    default:
      return state;
  }
}

},{"./GalleryActionTypes":13,"constants/index":5,"deep-freeze":"deep-freeze"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  ADD_QUEUED_FILE: 'ADD_QUEUED_FILE',
  FAIL_UPLOAD: 'FAIL_UPLOAD',
  PURGE_UPLOAD_QUEUE: 'PURGE_UPLOAD_QUEUE',
  REMOVE_QUEUED_FILE: 'REMOVE_QUEUED_FILE',
  SUCCEED_UPLOAD: 'SUCCEED_UPLOAD',
  UPDATE_QUEUED_FILE: 'UPDATE_QUEUED_FILE'
};

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addQueuedFile = addQueuedFile;
exports.failUpload = failUpload;
exports.purgeUploadQueue = purgeUploadQueue;
exports.removeQueuedFile = removeQueuedFile;
exports.succeedUpload = succeedUpload;
exports.updateQueuedFile = updateQueuedFile;

var _QueuedFilesActionTypes = require('./QueuedFilesActionTypes');

var _QueuedFilesActionTypes2 = _interopRequireDefault(_QueuedFilesActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addQueuedFile(file) {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.ADD_QUEUED_FILE,
      payload: { file: file }
    });
  };
}

function failUpload(queuedAtTime) {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.FAIL_UPLOAD,
      payload: { queuedAtTime: queuedAtTime }
    });
  };
}

function purgeUploadQueue() {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.PURGE_UPLOAD_QUEUE,
      payload: null
    });
  };
}

function removeQueuedFile(queuedAtTime) {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.REMOVE_QUEUED_FILE,
      payload: { queuedAtTime: queuedAtTime }
    });
  };
}

function succeedUpload(queuedAtTime) {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.SUCCEED_UPLOAD,
      payload: { queuedAtTime: queuedAtTime }
    });
  };
}

function updateQueuedFile(queuedAtTime, updates) {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.UPDATE_QUEUED_FILE,
      payload: { queuedAtTime: queuedAtTime, updates: updates }
    });
  };
}

},{"./QueuedFilesActionTypes":16}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _QueuedFilesActionTypes = require('./QueuedFilesActionTypes');

var _QueuedFilesActionTypes2 = _interopRequireDefault(_QueuedFilesActionTypes);

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fileFactory() {
  return (0, _deepFreeze2.default)({
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

function queuedFilesReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {

    case _QueuedFilesActionTypes2.default.ADD_QUEUED_FILE:
      return (0, _deepFreeze2.default)(_extends({}, state, {
        items: state.items.concat([_extends({}, fileFactory(), action.payload.file)])
      }));

    case _QueuedFilesActionTypes2.default.FAIL_UPLOAD:
      return (0, _deepFreeze2.default)(_extends({}, state, {
        items: state.items.map(function (file) {
          if (file.queuedAtTime === action.payload.queuedAtTime) {
            return _extends({}, file, {
              messages: [{
                value: _i18n2.default._t('AssetGalleryField.DROPZONE_FAILED_UPLOAD'),
                type: 'error',
                extraClass: 'error'
              }]
            });
          }

          return file;
        })
      }));

    case _QueuedFilesActionTypes2.default.PURGE_UPLOAD_QUEUE:
      return (0, _deepFreeze2.default)(_extends({}, state, {
        items: state.items.filter(function (file) {
          if (Array.isArray(file.messages)) {
            return !file.messages.filter(function (message) {
              return message.type === 'error' || message.type === 'success';
            }).length > 0;
          }

          return true;
        })
      }));

    case _QueuedFilesActionTypes2.default.REMOVE_QUEUED_FILE:
      return (0, _deepFreeze2.default)(_extends({}, state, {
        items: state.items.filter(function (file) {
          return file.queuedAtTime !== action.payload.queuedAtTime;
        })
      }));

    case _QueuedFilesActionTypes2.default.SUCCEED_UPLOAD:
      return (0, _deepFreeze2.default)(_extends({}, state, {
        items: state.items.map(function (file) {
          if (file.queuedAtTime === action.payload.queuedAtTime) {
            return _extends({}, file, {
              messages: [{
                value: _i18n2.default._t('AssetGalleryField.DROPZONE_SUCCESS_UPLOAD'),
                type: 'success',
                extraClass: 'success'
              }]
            });
          }

          return file;
        })
      }));

    case _QueuedFilesActionTypes2.default.UPDATE_QUEUED_FILE:
      return (0, _deepFreeze2.default)(_extends({}, state, {
        items: state.items.map(function (file) {
          if (file.queuedAtTime === action.payload.queuedAtTime) {
            return _extends({}, file, action.payload.updates);
          }

          return file;
        })
      }));

    default:
      return state;
  }
}

exports.default = queuedFilesReducer;

},{"./QueuedFilesActionTypes":16,"deep-freeze":"deep-freeze","i18n":"i18n"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _GalleryReducer = require('./gallery/GalleryReducer');

var _GalleryReducer2 = _interopRequireDefault(_GalleryReducer);

var _QueuedFilesReducer = require('./queuedFiles/QueuedFilesReducer');

var _QueuedFilesReducer2 = _interopRequireDefault(_QueuedFilesReducer);

var _EditorReducer = require('./editor/EditorReducer');

var _EditorReducer2 = _interopRequireDefault(_EditorReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = (0, _redux.combineReducers)({
  assetAdmin: (0, _redux.combineReducers)({
    gallery: _GalleryReducer2.default,
    editor: _EditorReducer2.default,
    queuedFiles: _QueuedFilesReducer2.default
  })
});

exports.default = rootReducer;

},{"./editor/EditorReducer":12,"./gallery/GalleryReducer":15,"./queuedFiles/QueuedFilesReducer":18,"redux":"redux"}],20:[function(require,module,exports){

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
},{}]},{},[1])


//# sourceMappingURL=bundle.js.map

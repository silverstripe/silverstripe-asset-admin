/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(3);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _reactApollo = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var filter = 'div[data-shortcode="embed"]';
	
	(function () {
	  var ssembed = {
	    init: function init(editor) {
	      editor.addButton('ssembed', {
	        icon: 'media',
	        title: 'Insert Embedded content',
	        cmd: 'ssembed'
	      });
	      editor.addMenuItem('ssembed', {
	        icon: 'media',
	        text: 'Insert Embedded content',
	        cmd: 'ssembed'
	      });
	
	      editor.addCommand('ssembed', function () {
	        (0, _jquery2.default)('#' + editor.id).entwine('ss').openEmbedDialog();
	      });
	
	      editor.on('BeforeExecCommand', function (e) {
	        var cmd = e.command;
	        var ui = e.ui;
	        var val = e.value;
	        if (cmd === 'mceAdvMedia' || cmd === 'mceAdvMedia') {
	          e.preventDefault();
	          editor.execCommand('ssembed', ui, val);
	        }
	      });
	
	      editor.on('SaveContent', function (o) {
	        var content = (0, _jquery2.default)('<div>' + o.content + '</div>');
	        var attrsFn = function attrsFn(attrs) {
	          return Object.entries(attrs).map(function (_ref) {
	            var _ref2 = _slicedToArray(_ref, 2),
	                name = _ref2[0],
	                value = _ref2[1];
	
	            return value ? name + '="' + value + '"' : null;
	          }).filter(function (attr) {
	            return attr !== null;
	          }).join(' ');
	        };
	
	        content.find(filter).each(function replaceWithShortCode() {
	          var embed = (0, _jquery2.default)(this);
	
	          var placeholder = embed.find('img.placeholder');
	          if (placeholder.length === 0) {
	            embed.removeAttr('data-url');
	            embed.removeAttr('data-shortcode');
	            return;
	          }
	
	          var caption = embed.find('.caption').text();
	          var width = parseInt(placeholder.attr('width'), 10);
	          var height = parseInt(placeholder.attr('height'), 10);
	          var url = embed.data('url');
	          var attrs = {
	            url: url,
	            thumbnail: placeholder.prop('src'),
	            class: embed.prop('class'),
	            width: isNaN(width) ? null : width,
	            height: isNaN(height) ? null : height,
	            caption: caption
	          };
	          var shortCode = '[embed ' + attrsFn(attrs) + ']' + url + '[/embed]';
	          embed.replaceWith(shortCode);
	        });
	
	        o.content = content.html();
	      });
	      editor.on('BeforeSetContent', function (o) {
	        var content = o.content;
	        var attrFromStrFn = function attrFromStrFn(str) {
	          return str.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function (coll, val) {
	            var match = val.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/);
	            var key = match[1];
	            var value = match[2] || match[3] || match[4];
	            return _extends({}, coll, _defineProperty({}, key, value));
	          }, {});
	        };
	
	        var shortTagEmbegRegex = /\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi;
	        var matches = shortTagEmbegRegex.exec(content);
	        while (matches) {
	          var data = attrFromStrFn(matches[1]);
	
	          var base = (0, _jquery2.default)('<div/>').attr('data-url', data.url || matches[2]).attr('data-shortcode', 'embed').addClass(data.class).addClass('ss-htmleditorfield-file embed');
	
	          var placeholder = (0, _jquery2.default)('<img />').attr('src', data.thumbnail).addClass('placeholder');
	
	          if (data.width) {
	            base.width(data.width);
	            placeholder.attr('width', data.width);
	          }
	          if (data.height) {
	            placeholder.attr('height', data.height);
	          }
	
	          base.append(placeholder);
	
	          if (data.caption) {
	            var caption = (0, _jquery2.default)('<p />').addClass('caption').text(data.caption);
	            base.append(caption);
	          }
	
	          content = content.replace(matches[0], (0, _jquery2.default)('<div/>').append(base).html());
	
	          matches = shortTagEmbegRegex.exec(content);
	        }
	
	        o.content = content;
	      });
	    }
	  };
	
	  tinymce.PluginManager.add('ssembed', function (editor) {
	    return ssembed.init(editor);
	  });
	})();
	
	_jquery2.default.entwine('ss', function ($) {
	  $('#insert-embed-react__dialog-wrapper').entwine({
	    Element: null,
	
	    Data: {},
	
	    onunmatch: function onunmatch() {
	      this._clearModal();
	    },
	    _clearModal: function _clearModal() {
	      _reactDom2.default.unmountComponentAtNode(this[0]);
	    },
	    open: function open() {
	      this._renderModal(true);
	    },
	    close: function close() {
	      this.setData({});
	      this._renderModal(false);
	    },
	    _renderModal: function _renderModal(show) {
	      var _this = this;
	
	      var handleHide = function handleHide() {
	        return _this.close();
	      };
	
	      var handleInsert = function handleInsert() {
	        return _this._handleInsert.apply(_this, arguments);
	      };
	
	      var handleCreate = function handleCreate() {
	        return _this._handleCreate.apply(_this, arguments);
	      };
	      var handleLoadingError = function handleLoadingError() {
	        return _this._handleLoadingError.apply(_this, arguments);
	      };
	      var store = window.ss.store;
	      var client = window.ss.apolloClient;
	      var attrs = this.getOriginalAttributes();
	      var InsertEmbedModal = window.InsertEmbedModal.default;
	
	      if (!InsertEmbedModal) {
	        throw new Error('Invalid Insert embed modal component found');
	      }
	
	      _reactDom2.default.render(_react2.default.createElement(
	        _reactApollo.ApolloProvider,
	        { store: store, client: client },
	        _react2.default.createElement(InsertEmbedModal, {
	          show: show,
	          onCreate: handleCreate,
	          onInsert: handleInsert,
	          onHide: handleHide,
	          onLoadingError: handleLoadingError,
	          bodyClassName: 'modal__dialog',
	          className: 'insert-embed-react__dialog-wrapper',
	          fileAttributes: attrs
	        })
	      ), this[0]);
	    },
	    _handleLoadingError: function _handleLoadingError() {
	      this.setData({});
	      this.open();
	    },
	    _handleInsert: function _handleInsert(data) {
	      var oldData = this.getData();
	      this.setData(_extends({ Url: oldData.Url }, data));
	      this.insertRemote();
	      this.close();
	    },
	    _handleCreate: function _handleCreate(data) {
	      this.setData(_extends({}, this.getData(), data));
	      this.open();
	    },
	    getOriginalAttributes: function getOriginalAttributes() {
	      var data = this.getData();
	      var $field = this.getElement();
	      if (!$field) {
	        return data;
	      }
	
	      var node = $($field.getEditor().getSelectedNode());
	      if (!node.length) {
	        return data;
	      }
	
	      var element = node.closest(filter).add(node.filter(filter));
	      if (!element.length) {
	        return data;
	      }
	      var image = element.find('img.placeholder');
	
	      if (image.length === 0) {
	        return data;
	      }
	
	      var caption = element.find('.caption').text();
	      var width = parseInt(image.width(), 10);
	      var height = parseInt(image.height(), 10);
	
	      return {
	        Url: element.data('url') || data.Url,
	        CaptionText: caption,
	        PreviewUrl: image.attr('src'),
	        Width: isNaN(width) ? null : width,
	        Height: isNaN(height) ? null : height,
	        Placement: this.findPosition(element.prop('class'))
	      };
	    },
	    findPosition: function findPosition(cssClass) {
	      var alignments = ['leftAlone', 'center', 'rightAlone', 'left', 'right'];
	      if (typeof cssClass !== 'string') {
	        return '';
	      }
	      var classes = cssClass.split(' ');
	      return alignments.find(function (alignment) {
	        return classes.indexOf(alignment) > -1;
	      });
	    },
	    insertRemote: function insertRemote() {
	      var $field = this.getElement();
	      if (!$field) {
	        return false;
	      }
	      var editor = $field.getEditor();
	      if (!editor) {
	        return false;
	      }
	
	      var data = this.getData();
	
	      var base = (0, _jquery2.default)('<div/>').attr('data-url', data.Url).attr('data-shortcode', 'embed').addClass(data.Placement).addClass('ss-htmleditorfield-file embed');
	
	      var placeholder = (0, _jquery2.default)('<img />').attr('src', data.PreviewUrl).addClass('placeholder');
	
	      if (data.Width) {
	        base.width(data.Width);
	        placeholder.attr('width', data.Width);
	      }
	      if (data.Height) {
	        placeholder.attr('height', data.Height);
	      }
	
	      base.append(placeholder);
	
	      if (data.CaptionText) {
	        var caption = (0, _jquery2.default)('<p />').addClass('caption').text(data.CaptionText);
	        base.append(caption);
	      }
	
	      var node = $(editor.getSelectedNode());
	      var replacee = $(null);
	      if (node.length) {
	        replacee = node.filter(filter);
	
	        if (replacee.length === 0) {
	          replacee = node.closest(filter);
	        }
	
	        if (replacee.length === 0) {
	          replacee = node.filter('img.placeholder');
	        }
	      }
	
	      if (replacee.length) {
	        replacee.replaceWith(base);
	      } else {
	        editor.repaint();
	        editor.insertContent($('<div />').append(base.clone()).html(), { skip_undo: 1 });
	      }
	
	      editor.addUndo();
	      editor.repaint();
	
	      return true;
	    }
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = ReactDom;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = ReactApollo;

/***/ }
/******/ ]);
//# sourceMappingURL=TinyMCE_ssembed.js.map
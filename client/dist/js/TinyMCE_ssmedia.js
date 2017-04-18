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
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _i18n = __webpack_require__(5);
	
	var _i18n2 = _interopRequireDefault(_i18n);
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(3);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _reactApollo = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var filter = 'img[data-shortcode="image"]';
	
	(function () {
	  var ssmedia = {
	    init: function init(ed) {
	      ed.addButton('ssmedia', {
	        icon: 'image',
	        title: 'Insert Media',
	        cmd: 'ssmedia'
	      });
	      ed.addMenuItem('ssmedia', {
	        icon: 'image',
	        text: 'Insert Media',
	        cmd: 'ssmedia'
	      });
	
	      ed.addCommand('ssmedia', function () {
	        (0, _jquery2.default)('#' + ed.id).entwine('ss').openMediaDialog();
	      });
	
	      ed.on('BeforeExecCommand', function (e) {
	        var cmd = e.command;
	        var ui = e.ui;
	        var val = e.value;
	        if (cmd === 'mceAdvImage' || cmd === 'mceImage') {
	          e.preventDefault();
	          ed.execCommand('ssmedia', ui, val);
	        }
	      });
	
	      ed.on('SaveContent', function (o) {
	        var content = (0, _jquery2.default)(o.content);
	        var attrsFn = function attrsFn(attrs) {
	          return Object.keys(attrs).map(function (name) {
	            return attrs[name] ? name + '="' + attrs[name] + '"' : null;
	          }).filter(function (el) {
	            return el !== null;
	          }).join(' ');
	        };
	
	        content.find(filter).add(content.filter(filter)).each(function () {
	          var el = (0, _jquery2.default)(this);
	          var attrs = {
	            src: el.attr('src'),
	            id: el.data('id'),
	            width: el.attr('width'),
	            height: el.attr('height'),
	            class: el.attr('class'),
	
	            title: el.attr('title'),
	            alt: el.attr('alt')
	          };
	          var shortCode = '[image ' + attrsFn(attrs) + ']';
	          el.replaceWith(shortCode);
	        });
	
	        o.content = '';
	        content.each(function () {
	          if (this.outerHTML !== undefined) {
	            o.content += this.outerHTML;
	          }
	        });
	      });
	      ed.on('BeforeSetContent', function (o) {
	        var matches = null;
	        var content = o.content;
	        var attrFromStrFn = function attrFromStrFn(str) {
	          return str.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function (coll, val) {
	            var match = val.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/);
	            var key = match[1];
	            var value = match[2] || match[3] || match[4];
	            return _extends({}, coll, _defineProperty({}, key, value));
	          }, {});
	        };
	
	        var shortTagImageRegex = /\[image(.*?)]/gi;
	        while (matches = shortTagImageRegex.exec(content)) {
	          var attrs = attrFromStrFn(matches[1]);
	          var el = (0, _jquery2.default)('<img/>').attr(_extends({}, attrs, {
	            id: undefined,
	            'data-id': attrs.id,
	            'data-shortcode': 'image'
	          })).addClass('ss-htmleditorfield-file image');
	          content = content.replace(matches[0], (0, _jquery2.default)('<div/>').append(el).html());
	        }
	
	        o.content = content;
	      });
	    }
	  };
	
	  tinymce.PluginManager.add('ssmedia', function (editor) {
	    return ssmedia.init(editor);
	  });
	})();
	
	_jquery2.default.entwine('ss', function ($) {
	  $('.insert-media-react__dialog-wrapper .nav-link').entwine({
	    onclick: function onclick(e) {
	      return e.preventDefault();
	    }
	  });
	
	  $('#insert-media-react__dialog-wrapper').entwine({
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
	      var store = window.ss.store;
	      var client = window.ss.apolloClient;
	      var attrs = this.getOriginalAttributes();
	      var InsertMediaModal = window.InsertMediaModal.default;
	
	      if (!InsertMediaModal) {
	        throw new Error('Invalid Insert media modal component found');
	      }
	
	      delete attrs.url;
	
	      _reactDom2.default.render(_react2.default.createElement(
	        _reactApollo.ApolloProvider,
	        { store: store, client: client },
	        _react2.default.createElement(InsertMediaModal, {
	          title: false,
	          show: show,
	          onInsert: handleInsert,
	          onHide: handleHide,
	          bodyClassName: 'modal__dialog',
	          className: 'insert-media-react__dialog-wrapper',
	          fileAttributes: attrs
	        })
	      ), this[0]);
	    },
	    _handleInsert: function _handleInsert(data, file) {
	      var result = false;
	      this.setData(_extends({}, data, file));
	
	      try {
	        var category = null;
	        if (file) {
	          category = file.category;
	        } else {
	          category = 'image';
	        }
	        switch (category) {
	          case 'image':
	            result = this.insertImage();
	            break;
	          default:
	            result = this.insertFile();
	        }
	      } catch (e) {
	        this.statusMessage(e, 'bad');
	      }
	
	      if (result) {
	        this.close();
	      }
	      return Promise.resolve();
	    },
	    getOriginalAttributes: function getOriginalAttributes() {
	      var $field = this.getElement();
	      if (!$field) {
	        return {};
	      }
	
	      var node = $field.getEditor().getSelectedNode();
	      if (!node) {
	        return {};
	      }
	      var $node = $(node);
	      var $caption = $node.parent('.captionImage').find('.caption');
	
	      var attr = {
	        url: $node.attr('src'),
	        AltText: $node.attr('alt'),
	        InsertWidth: $node.attr('width'),
	        InsertHeight: $node.attr('height'),
	        TitleTooltip: $node.attr('title'),
	        Alignment: this.findPosition($node.attr('class')),
	        Caption: $caption.text(),
	        ID: $node.attr('data-id')
	      };
	
	      ['InsertWidth', 'InsertHeight', 'ID'].forEach(function (item) {
	        attr[item] = typeof attr[item] === 'string' ? parseInt(attr[item], 10) : null;
	      });
	
	      return attr;
	    },
	    findPosition: function findPosition(cssClass) {
	      var alignments = ['leftAlone', 'center', 'rightAlone', 'left', 'right'];
	      return alignments.find(function (alignment) {
	        var expr = new RegExp('\\b' + alignment + '\\b');
	        return expr.test(cssClass);
	      });
	    },
	    getAttributes: function getAttributes() {
	      var data = this.getData();
	
	      return {
	        src: data.url,
	        alt: data.AltText,
	        width: data.InsertWidth,
	        height: data.InsertHeight,
	        title: data.TitleTooltip,
	        class: data.Alignment,
	        'data-id': data.ID,
	        'data-shortcode': 'image'
	      };
	    },
	    getExtraData: function getExtraData() {
	      var data = this.getData();
	      return {
	        CaptionText: data && data.Caption
	      };
	    },
	    insertFile: function insertFile() {
	      this.statusMessage(_i18n2.default._t('HTMLEditorField_Toolbar.ERROR_OEMBED_REMOTE', 'Embed is only compatible with remote files'), 'bad');
	
	      return false;
	    },
	    insertImage: function insertImage() {
	      var $field = this.getElement();
	      if (!$field) {
	        return false;
	      }
	      var editor = $field.getEditor();
	      if (!editor) {
	        return false;
	      }
	      var node = $(editor.getSelectedNode());
	
	      var attrs = this.getAttributes();
	      var extraData = this.getExtraData();
	
	      var replacee = node && node.is('img') ? node : null;
	      if (replacee && replacee.parent().is('.captionImage')) replacee = replacee.parent();
	
	      var img = node && node.is('img') ? node : $('<img />');
	      img.attr(attrs).addClass('ss-htmleditorfield-file image');
	
	      var container = img.parent('.captionImage');
	      var caption = container.find('.caption');
	
	      if (extraData.CaptionText) {
	        if (!container.length) {
	          container = $('<div></div>');
	        }
	
	        container.attr('class', 'captionImage ' + attrs.class).removeAttr('data-mce-style').width(attrs.width);
	
	        if (!caption.length) {
	          caption = $('<p class="caption"></p>').appendTo(container);
	        }
	
	        caption.attr('class', 'caption ' + attrs.class).text(extraData.CaptionText);
	      } else {
	        container = caption = null;
	      }
	
	      var replacer = container || img;
	
	      if (replacee && replacee.not(replacer).length) {
	        replacee.replaceWith(replacer);
	      }
	
	      if (container) {
	        container.prepend(img);
	      }
	
	      if (!replacee) {
	        editor.repaint();
	        editor.insertContent($('<div />').append(replacer).html(), { skip_undo: 1 });
	      }
	
	      editor.addUndo();
	      editor.repaint();
	      return true;
	    },
	    statusMessage: function statusMessage(text, type) {
	      var content = $('<div/>').text(text).html();
	      $.noticeAdd({
	        text: content,
	        type: type,
	        stayTime: 5000,
	        inEffect: { left: '0', opacity: 'show' }
	      });
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = i18n;

/***/ }
/******/ ]);
//# sourceMappingURL=TinyMCE_ssmedia.js.map
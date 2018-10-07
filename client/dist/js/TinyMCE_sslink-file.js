<<<<<<< HEAD
!function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="./client/src/entwine/TinyMCE_sslink-file.js")}({"./client/src/entwine/TinyMCE_sslink-file.js":function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=i(r),l=n(24),a=i(l),s=n(0),u=i(s),c=n(6),d=i(c),f=n(7),p=i(f),g=n(8),_=i(g),m=n(10),k=i(m),h=n(3);a.default.addAction("sslink",{text:o.default._t("AssetAdmin.LINKLABEL_FILE","Link to a file"),onclick:function(e){return e.execCommand("sslinkfile")}}).addCommandWithUrlTest("sslinkfile",/^\[file_link/);var x={init:function(e){e.addCommand("sslinkfile",function(){(0,p.default)("#"+e.id).entwine("ss").openLinkFileDialog()})}},b="insert-link__dialog-wrapper--file",v=(0,h.loadComponent)(k.default);p.default.entwine("ss",function(e){e(".insert-link__dialog-wrapper--internal .nav-link, .insert-media-react__dialog-wrapper .breadcrumb__container a").entwine({onclick:function(e){return e.preventDefault()}}),e("textarea.htmleditor").entwine({openLinkFileDialog:function(){var t=e("#"+b);t.length||(t=e('<div id="'+b+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e(".js-injector-boot #"+b).entwine({renderModal:function(e){var t=this,n=function(){return t.close()},i=function(){return t.handleInsert.apply(t,arguments)},r=this.getOriginalAttributes(),o=tinymce.activeEditor.selection,l=o.getContent()||"",a=o.getNode().tagName,s="A"!==a&&""===l.trim();d.default.render(u.default.createElement(v,{isOpen:e,type:"insert-link",onInsert:i,onClosed:n,title:!1,bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--internal",fileAttributes:r,requireLinkText:s}),this[0])},buildAttributes:function(e){return{href:_.default.serialise({name:"file_link",properties:{id:e.ID}},!0)+(e.Anchor&&e.Anchor.length?"#"+e.Anchor:""),target:e.TargetBlank?"_blank":"",title:e.Description}},getOriginalAttributes:function(){var t=this.getElement().getEditor(),n=e(t.getSelectedNode()),i=(n.attr("href")||"").split("#");if(!i[0])return{};var r=_.default.match("file_link",!1,i[0]);return r?{ID:r.properties.id?parseInt(r.properties.id,10):0,Anchor:i[1]||"",Description:n.attr("title"),TargetBlank:!!n.attr("target")}:{}}})}),tinymce.PluginManager.add("sslinkfile",function(e){return x.init(e)}),t.default=x},0:function(e,t){e.exports=React},10:function(e,t){e.exports=InsertMediaModal},2:function(e,t){e.exports=i18n},24:function(e,t){e.exports=TinyMCEActionRegistrar},3:function(e,t){e.exports=Injector},6:function(e,t){e.exports=ReactDom},7:function(e,t){e.exports=jQuery},8:function(e,t){e.exports=ShortcodeSerialiser}});
=======
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/src/entwine/TinyMCE_sslink-file.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/src/entwine/TinyMCE_sslink-file.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _TinyMCEActionRegistrar = __webpack_require__(25);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = __webpack_require__(6);

var _jquery2 = _interopRequireDefault(_jquery);

var _ShortcodeSerialiser = __webpack_require__(7);

var _ShortcodeSerialiser2 = _interopRequireDefault(_ShortcodeSerialiser);

var _InsertMediaModal = __webpack_require__(10);

var _InsertMediaModal2 = _interopRequireDefault(_InsertMediaModal);

var _Injector = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandName = 'sslinkfile';

_TinyMCEActionRegistrar2.default.addAction('sslink', {
  text: _i18n2.default._t('AssetAdmin.LINKLABEL_FILE', 'Link to a file'),

  onclick: function onclick(editor) {
    return editor.execCommand(commandName);
  }
}).addCommandWithUrlTest(commandName, /^\[file_link/);

var plugin = {
  init: function init(editor) {
    editor.addCommand(commandName, function () {
      var field = (0, _jquery2.default)('#' + editor.id).entwine('ss');

      field.openLinkFileDialog();
    });
  }
};

var modalId = 'insert-link__dialog-wrapper--file';
var InjectableInsertMediaModal = (0, _Injector.loadComponent)(_InsertMediaModal2.default);

_jquery2.default.entwine('ss', function ($) {
  $('.insert-link__dialog-wrapper--internal .nav-link, ' + '.insert-media-react__dialog-wrapper .breadcrumb__container a').entwine({
    onclick: function onclick(e) {
      return e.preventDefault();
    }
  });

  $('textarea.htmleditor').entwine({
    openLinkFileDialog: function openLinkFileDialog() {
      var dialog = $('#' + modalId);

      if (!dialog.length) {
        dialog = $('<div id="' + modalId + '" />');
        $('body').append(dialog);
      }
      dialog.addClass('insert-link__dialog-wrapper');

      dialog.setElement(this);
      dialog.open();
    }
  });

  $('.js-injector-boot #' + modalId).entwine({
    renderModal: function renderModal(isOpen) {
      var _this = this;

      var handleHide = function handleHide() {
        return _this.close();
      };
      var handleInsert = function handleInsert() {
        return _this.handleInsert.apply(_this, arguments);
      };
      var attrs = this.getOriginalAttributes();
      var selection = tinymce.activeEditor.selection;
      var selectionContent = selection.getContent() || '';
      var tagName = selection.getNode().tagName;
      var requireLinkText = tagName !== 'A' && selectionContent.trim() === '';

      _reactDom2.default.render(_react2.default.createElement(InjectableInsertMediaModal, {
        isOpen: isOpen,
        type: 'insert-link',
        onInsert: handleInsert,
        onClosed: handleHide,
        title: false,
        bodyClassName: 'modal__dialog',
        className: 'insert-link__dialog-wrapper--internal',
        fileAttributes: attrs,
        requireLinkText: requireLinkText
      }), this[0]);
    },
    buildAttributes: function buildAttributes(data) {
      var shortcode = _ShortcodeSerialiser2.default.serialise({
        name: 'file_link',
        properties: { id: data.ID }
      }, true);

      var anchor = data.Anchor && data.Anchor.length ? '#' + data.Anchor : '';
      var href = '' + shortcode + anchor;

      return {
        href: href,
        target: data.TargetBlank ? '_blank' : '',
        title: data.Description
      };
    },
    getOriginalAttributes: function getOriginalAttributes() {
      var editor = this.getElement().getEditor();
      var node = $(editor.getSelectedNode());

      var hrefParts = (node.attr('href') || '').split('#');
      if (!hrefParts[0]) {
        return {};
      }

      var shortcode = _ShortcodeSerialiser2.default.match('file_link', false, hrefParts[0]);
      if (!shortcode) {
        return {};
      }

      return {
        ID: shortcode.properties.id ? parseInt(shortcode.properties.id, 10) : 0,
        Anchor: hrefParts[1] || '',
        Description: node.attr('title'),
        TargetBlank: !!node.attr('target')
      };
    }
  });
});

tinymce.PluginManager.add(commandName, function (editor) {
  return plugin.init(editor);
});

exports.default = plugin;

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 10:
/***/ (function(module, exports) {

module.exports = InsertMediaModal;

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ 25:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = ReactDom;

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = ShortcodeSerialiser;

/***/ })

/******/ });
//# sourceMappingURL=TinyMCE_sslink-file.js.map
>>>>>>> POC for injectable asset-admin

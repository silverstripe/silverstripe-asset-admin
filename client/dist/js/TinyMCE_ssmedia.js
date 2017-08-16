<<<<<<< HEAD
<<<<<<< HEAD
!function(t){function e(i){if(n[i])return n[i].exports;var a=n[i]={i:i,l:!1,exports:{}};return t[i].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=179)}({0:function(t,e){t.exports=React},1:function(t,e){t.exports=i18n},179:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var r=n(7),o=i(r),s=n(1),l=i(s),d=n(0),c=i(d),u=n(5),f=i(u),m=n(3),p=n(6),g=n(21),h=i(g),v=(0,p.provideInjector)(h.default),_='img[data-shortcode="image"]';!function(){var t={init:function(t){var e=l.default._t("AssetAdmin.INSERT_FROM_FILES","Insert from Files");t.addButton("ssmedia",{icon:"image",title:e,cmd:"ssmedia"}),t.addMenuItem("ssmedia",{icon:"image",text:e,cmd:"ssmedia"}),t.addCommand("ssmedia",function(){(0,o.default)("#"+t.id).entwine("ss").openMediaDialog()}),t.on("BeforeExecCommand",function(e){var n=e.command,i=e.ui,a=e.value;"mceAdvImage"!==n&&"mceImage"!==n||(e.preventDefault(),t.execCommand("ssmedia",i,a))}),t.on("SaveContent",function(t){var e=(0,o.default)(t.content),n=function(t){return Object.keys(t).map(function(e){return t[e]?e+'="'+t[e]+'"':null}).filter(function(t){return null!==t}).join(" ")};e.find(_).add(e.filter(_)).each(function(){var t=(0,o.default)(this),e={src:t.attr("src"),id:t.data("id"),width:t.attr("width"),height:t.attr("height"),class:t.attr("class"),title:t.attr("title"),alt:t.attr("alt")},i="[image "+n(e)+"]";t.replaceWith(i)}),t.content="",e.each(function(){void 0!==this.outerHTML&&(t.content+=this.outerHTML)})}),t.on("BeforeSetContent",function(t){for(var e=null,n=t.content,i=/\[image(.*?)]/gi;e=i.exec(n);){var r=function(t){return t.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(t,e){var n=e.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),i=n[1],r=n[2]||n[3]||n[4];return Object.assign({},t,a({},i,r))},{})}(e[1]),s=(0,o.default)("<img/>").attr(Object.assign({},r,{id:void 0,"data-id":r.id,"data-shortcode":"image"})).addClass("ss-htmleditorfield-file image");n=n.replace(e[0],(0,o.default)("<div/>").append(s).html())}t.content=n})}};tinymce.PluginManager.add("ssmedia",function(e){return t.init(e)})}(),o.default.entwine("ss",function(t){t(".insert-media-react__dialog-wrapper .nav-link, .insert-media-react__dialog-wrapper .breadcrumb__container a").entwine({onclick:function(t){return t.preventDefault()}}),t("#insert-media-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){f.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this._renderModal(!1)},_renderModal:function(t){var e=this,n=function(){return e.close()},i=function(){return e._handleInsert.apply(e,arguments)},a=window.ss.store,r=window.ss.apolloClient,o=this.getOriginalAttributes();delete o.url,f.default.render(c.default.createElement(m.ApolloProvider,{store:a,client:r},c.default.createElement(v,{title:!1,type:"insert-media",show:t,onInsert:i,onHide:n,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",fileAttributes:o})),this[0])},_handleInsert:function(t,e){var n=!1;this.setData(Object.assign({},t,e));try{switch(e?e.category:"image"){case"image":n=this.insertImage();break;default:n=this.insertFile()}}catch(t){this.statusMessage(t,"bad")}return n&&this.close(),Promise.resolve()},getOriginalAttributes:function(){var e=this.getElement();if(!e)return{};var n=e.getEditor().getSelectedNode();if(!n)return{};var i=t(n),a=i.parent(".captionImage").find(".caption"),r={url:i.attr("src"),AltText:i.attr("alt"),InsertWidth:i.attr("width"),InsertHeight:i.attr("height"),TitleTooltip:i.attr("title"),Alignment:this.findPosition(i.attr("class")),Caption:a.text(),ID:i.attr("data-id")};return["InsertWidth","InsertHeight","ID"].forEach(function(t){r[t]="string"==typeof r[t]?parseInt(r[t],10):null}),r},findPosition:function(t){return["leftAlone","center","rightAlone","left","right"].find(function(e){return new RegExp("\\b"+e+"\\b").test(t)})},getAttributes:function(){var t=this.getData();return{src:t.url,alt:t.AltText,width:t.InsertWidth,height:t.InsertHeight,title:t.TitleTooltip,class:t.Alignment,"data-id":t.ID,"data-shortcode":"image"}},getExtraData:function(){var t=this.getData();return{CaptionText:t&&t.Caption}},insertFile:function(){return this.statusMessage(l.default._t("AssetAdmin.ERROR_OEMBED_REMOTE","Embed is only compatible with remote files"),"bad"),!1},insertImage:function(){var e=this.getElement();if(!e)return!1;var n=e.getEditor();if(!n)return!1;var i=t(n.getSelectedNode()),a=this.getAttributes(),r=this.getExtraData(),o=i&&i.is("img")?i:null;o&&o.parent().is(".captionImage")&&(o=o.parent());var s=i&&i.is("img")?i:t("<img />");s.attr(a).addClass("ss-htmleditorfield-file image");var l=s.parent(".captionImage"),d=l.find(".caption");r.CaptionText?(l.length||(l=t("<div></div>")),l.attr("class","captionImage "+a.class).removeAttr("data-mce-style").width(a.width),d.length||(d=t('<p class="caption"></p>').appendTo(l)),d.attr("class","caption "+a.class).text(r.CaptionText)):l=d=null;var c=l||s;return o&&o.not(c).length&&o.replaceWith(c),l&&l.prepend(s),o||(n.repaint(),n.insertContent(t("<div />").append(c).html(),{skip_undo:1})),n.addUndo(),n.repaint(),!0},statusMessage:function(e,n){var i=t("<div/>").text(e).html();t.noticeAdd({text:i,type:n,stayTime:5e3,inEffect:{left:"0",opacity:"show"}})}})})},21:function(t,e){t.exports=InsertMediaModal},3:function(t,e){t.exports=ReactApollo},5:function(t,e){t.exports=ReactDom},6:function(t,e){t.exports=Injector},7:function(t,e){t.exports=jQuery}});
=======
!function(t){function e(i){if(n[i])return n[i].exports;var a=n[i]={i:i,l:!1,exports:{}};return t[i].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=179)}({0:function(t,e){t.exports=React},1:function(t,e){t.exports=i18n},179:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var r=n(7),o=i(r),s=n(1),l=(i(s),n(0)),d=i(l),c=n(5),u=i(c),f=n(3),m=n(6),p=n(21),g=i(p),h=n(37),v=i(h),I=(0,m.provideInjector)(g.default),x='img[data-shortcode="image"]';!function(){var t={init:function(t){t.addButton("ssmedia",{icon:"image",title:"Insert Media",cmd:"ssmedia"}),t.addMenuItem("ssmedia",{icon:"image",text:"Insert Media",cmd:"ssmedia"}),t.addCommand("ssmedia",function(){(0,o.default)("#"+t.id).entwine("ss").openMediaDialog()}),t.on("BeforeExecCommand",function(e){var n=e.command,i=e.ui,a=e.value;"mceAdvImage"!==n&&"mceImage"!==n||(e.preventDefault(),t.execCommand("ssmedia",i,a))}),t.on("SaveContent",function(t){var e=(0,o.default)(t.content),n=function(t){return Object.keys(t).map(function(e){return t[e]?e+'="'+t[e]+'"':null}).filter(function(t){return null!==t}).join(" ")};e.find(x).add(e.filter(x)).each(function(){var t=(0,o.default)(this),e={src:t.attr("src"),id:t.data("id"),width:t.attr("width"),height:t.attr("height"),class:t.attr("class"),title:t.attr("title"),alt:t.attr("alt")},i="[image "+n(e)+"]";t.replaceWith(i)}),t.content="",e.each(function(){void 0!==this.outerHTML&&(t.content+=this.outerHTML)})}),t.on("BeforeSetContent",function(t){for(var e=null,n=t.content,i=/\[image(.*?)]/gi;e=i.exec(n);){var r=function(t){return t.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(t,e){var n=e.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),i=n[1],r=n[2]||n[3]||n[4];return Object.assign({},t,a({},i,r))},{})}(e[1]),s=(0,o.default)("<img/>").attr(Object.assign({},r,{id:void 0,"data-id":r.id,"data-shortcode":"image"})).addClass("ss-htmleditorfield-file image");n=n.replace(e[0],(0,o.default)("<div/>").append(s).html())}t.content=n})}};tinymce.PluginManager.add("ssmedia",function(e){return t.init(e)})}(),o.default.entwine("ss",function(t){t(".insert-media-react__dialog-wrapper .nav-link, .insert-media-react__dialog-wrapper .breadcrumb__container a").entwine({onclick:function(t){return t.preventDefault()}}),t("#insert-media-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){u.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this._renderModal(!1)},_renderModal:function(t){var e=this,n=function(){return e.close()},i=function(){return e._handleInsert.apply(e,arguments)},a=window.ss.store,r=window.ss.apolloClient,o=this.getOriginalAttributes();delete o.url,u.default.render(d.default.createElement(f.ApolloProvider,{store:a,client:r},d.default.createElement(I,{title:!1,type:"insert-media",show:t,onInsert:i,onHide:n,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",fileAttributes:o})),this[0])},_handleInsert:function(t,e){var n=!1;this.setData(Object.assign({},t,e));try{switch(e?e.category:"image"){case"image":n=this.insertImage();break;default:n=this.insertFile()}}catch(t){this.statusMessage(t,"bad")}return n&&this.close(),Promise.resolve()},getOriginalAttributes:function(){var e=this.getElement();if(!e)return{};var n=e.getEditor().getSelectedNode();if(!n)return{};var i=t(n),a=i.parent(".captionImage").find(".caption"),r={url:i.attr("src"),AltText:i.attr("alt"),InsertWidth:i.attr("width"),InsertHeight:i.attr("height"),TitleTooltip:i.attr("title"),Alignment:this.findPosition(i.attr("class")),Caption:a.text(),ID:i.attr("data-id")};return["InsertWidth","InsertHeight","ID"].forEach(function(t){r[t]="string"==typeof r[t]?parseInt(r[t],10):null}),r},findPosition:function(t){return["leftAlone","center","rightAlone","left","right"].find(function(e){return new RegExp("\\b"+e+"\\b").test(t)})},getAttributes:function(){var t=this.getData();return{src:t.url,alt:t.AltText,width:t.InsertWidth,height:t.InsertHeight,title:t.TitleTooltip,class:t.Alignment,"data-id":t.ID,"data-shortcode":"image"}},getExtraData:function(){var t=this.getData();return{CaptionText:t&&t.Caption}},insertFile:function(){var t=this.getData(),e=v.default.serialise({name:"file_link",properties:{id:t.ID}},!0);return this.insertLinkInEditor({href:e},t.filename),!0},insertLinkInEditor:function(t,e){var n=this.getElement().getEditor();n.insertLink(t,null,e),n.addUndo(),n.repaint();var i=n.getInstance(),a=i.selection;setTimeout(function(){return a&&a.collapse()},0)},insertImage:function(){var e=this.getElement();if(!e)return!1;var n=e.getEditor();if(!n)return!1;var i=t(n.getSelectedNode()),a=this.getAttributes(),r=this.getExtraData(),o=i&&i.is("img")?i:null;o&&o.parent().is(".captionImage")&&(o=o.parent());var s=i&&i.is("img")?i:t("<img />");s.attr(a).addClass("ss-htmleditorfield-file image");var l=s.parent(".captionImage"),d=l.find(".caption");r.CaptionText?(l.length||(l=t("<div></div>")),l.attr("class","captionImage "+a.class).removeAttr("data-mce-style").width(a.width),d.length||(d=t('<p class="caption"></p>').appendTo(l)),d.attr("class","caption "+a.class).text(r.CaptionText)):l=d=null;var c=l||s;return o&&o.not(c).length&&o.replaceWith(c),l&&l.prepend(s),o||(n.repaint(),n.insertContent(t("<div />").append(c).html(),{skip_undo:1})),n.addUndo(),n.repaint(),!0},statusMessage:function(e,n){var i=t("<div/>").text(e).html();t.noticeAdd({text:i,type:n,stayTime:5e3,inEffect:{left:"0",opacity:"show"}})}})})},21:function(t,e){t.exports=InsertMediaModal},3:function(t,e){t.exports=ReactApollo},37:function(t,e){t.exports=ShortcodeSerialiser},5:function(t,e){t.exports=ReactDom},6:function(t,e){t.exports=Injector},7:function(t,e){t.exports=jQuery}});
>>>>>>> Insert non-image as a normal link
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
/******/ 	return __webpack_require__(__webpack_require__.s = 179);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ 179:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(7);

var _jquery2 = _interopRequireDefault(_jquery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactApollo = __webpack_require__(3);

var _Injector = __webpack_require__(6);

var _InsertMediaModal = __webpack_require__(21);

var _InsertMediaModal2 = _interopRequireDefault(_InsertMediaModal);

var _ShortcodeSerialiser = __webpack_require__(37);

var _ShortcodeSerialiser2 = _interopRequireDefault(_ShortcodeSerialiser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var InjectableInsertMediaModal = (0, _Injector.provideInjector)(_InsertMediaModal2.default);

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
            return Object.assign({}, coll, _defineProperty({}, key, value));
          }, {});
        };

        var shortTagImageRegex = /\[image(.*?)]/gi;
        while (matches = shortTagImageRegex.exec(content)) {
          var attrs = attrFromStrFn(matches[1]);
          var el = (0, _jquery2.default)('<img/>').attr(Object.assign({}, attrs, {
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
  $('.insert-media-react__dialog-wrapper .nav-link, ' + '.insert-media-react__dialog-wrapper .breadcrumb__container a').entwine({
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

      delete attrs.url;

      _reactDom2.default.render(_react2.default.createElement(
        _reactApollo.ApolloProvider,
        { store: store, client: client },
        _react2.default.createElement(InjectableInsertMediaModal, {
          title: false,
          type: 'insert-media',
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
      this.setData(Object.assign({}, data, file));

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
      var data = this.getData();
      var shortcode = _ShortcodeSerialiser2.default.serialise({
        name: 'file_link',
        properties: { id: data.ID }
      }, true);

      this.insertLinkInEditor({ href: shortcode }, data.filename);
      return true;
    },
    insertLinkInEditor: function insertLinkInEditor(attributes, linkText) {
      var editor = this.getElement().getEditor();
      editor.insertLink(attributes, null, linkText);
      editor.addUndo();
      editor.repaint();

      var instance = editor.getInstance();
      var selection = instance.selection;

      setTimeout(function () {
        return selection && selection.collapse();
      }, 0);
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

/***/ }),

/***/ 21:
/***/ (function(module, exports) {

module.exports = InsertMediaModal;

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = ReactApollo;

/***/ }),

/***/ 37:
/***/ (function(module, exports) {

module.exports = ShortcodeSerialiser;

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = ReactDom;

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })

/******/ });
//# sourceMappingURL=TinyMCE_ssmedia.js.map
>>>>>>> Add editor top message style

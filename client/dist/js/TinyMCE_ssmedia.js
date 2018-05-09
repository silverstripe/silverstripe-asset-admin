<<<<<<< HEAD
!function(t){function e(n){if(i[n])return i[n].exports;var a=i[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var i={};e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s="./client/src/entwine/TinyMCE_ssmedia.js")}({"./client/src/entwine/TinyMCE_ssmedia.js":function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}var a=i(6),r=n(a),o=i(1),s=n(o),d=i(0),l=n(d),c=i(5),u=n(c),f=i(2),m=i(10),p=n(m),g=i(7),h=n(g),v=(0,f.loadComponent)(p.default),I='img[data-shortcode="image"]';!function(){var t={init:function(t){var e=s.default._t("AssetAdmin.INSERT_FROM_FILES","Insert from Files");t.addButton("ssmedia",{icon:"image",title:e,cmd:"ssmedia"}),t.addMenuItem("ssmedia",{icon:"image",text:e,cmd:"ssmedia"}),t.addCommand("ssmedia",function(){(0,r.default)("#"+t.id).entwine("ss").openMediaDialog()}),t.on("BeforeExecCommand",function(e){var i=e.command,n=e.ui,a=e.value;"mceAdvImage"!==i&&"mceImage"!==i||(e.preventDefault(),t.execCommand("ssmedia",n,a))}),t.on("SaveContent",function(t){var e=(0,r.default)(t.content);e.find(I).add(e.filter(I)).each(function(){var t=(0,r.default)(this),e={src:t.attr("src"),id:t.data("id"),width:t.attr("width"),height:t.attr("height"),class:t.attr("class"),title:t.attr("title"),alt:t.attr("alt")},i=h.default.serialise({name:"image",properties:e,wrapped:!1});t.replaceWith(i)}),t.content="",e.each(function(){void 0!==this.outerHTML&&(t.content+=this.outerHTML)})}),t.on("BeforeSetContent",function(t){for(var e=t.content,i=h.default.match("image",!1,e);i;){var n=i.properties,a=(0,r.default)("<img/>").attr(Object.assign({},n,{id:void 0,"data-id":n.id,"data-shortcode":"image"})).addClass("ss-htmleditorfield-file image");e=e.replace(i.original,(0,r.default)("<div/>").append(a).html()),i=h.default.match("image",!1,e)}t.content=e})}};tinymce.PluginManager.add("ssmedia",function(e){return t.init(e)})}(),r.default.entwine("ss",function(t){t(".insert-media-react__dialog-wrapper .nav-link, .insert-media-react__dialog-wrapper .breadcrumb__container a").entwine({onclick:function(t){return t.preventDefault()}}),t(".js-injector-boot #insert-media-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){u.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this._renderModal(!1)},_renderModal:function(t){var e=this,i=function(){return e.close()},n=function(){return e._handleInsert.apply(e,arguments)},a=this.getOriginalAttributes(),r=tinymce.activeEditor.selection,o=r.getContent()||"",s=r.getNode().tagName,d="A"!==s&&("IMG"===s||""===o.trim());delete a.url,u.default.render(l.default.createElement(v,{title:!1,type:"insert-media",isOpen:t,onInsert:n,onClosed:i,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",requireLinkText:d,fileAttributes:a}),this[0])},_handleInsert:function(t,e){var i=!1;this.setData(Object.assign({},t,e));try{switch(e?e.category:"image"){case"image":i=this.insertImage();break;default:i=this.insertFile()}}catch(t){this.statusMessage(t,"bad")}return i&&this.close(),Promise.resolve()},getOriginalAttributes:function(){var e=this.getElement();if(!e)return{};var i=e.getEditor().getSelectedNode();if(!i)return{};var n=t(i),a=(n.attr("href")||"").split("#");if(a[0]){var r=h.default.match("file_link",!1,a[0]);if(r)return{ID:r.properties.id?parseInt(r.properties.id,10):0,Anchor:a[1]||"",Description:n.attr("title"),TargetBlank:!!n.attr("target")}}var o=n.parent(".captionImage").find(".caption"),s={url:n.attr("src"),AltText:n.attr("alt"),InsertWidth:n.attr("width"),InsertHeight:n.attr("height"),TitleTooltip:n.attr("title"),Alignment:this.findPosition(n.attr("class")),Caption:o.text(),ID:n.attr("data-id")};return["InsertWidth","InsertHeight","ID"].forEach(function(t){s[t]="string"==typeof s[t]?parseInt(s[t],10):null}),s},findPosition:function(t){return["leftAlone","center","rightAlone","left","right"].find(function(e){return new RegExp("\\b"+e+"\\b").test(t)})},getAttributes:function(){var t=this.getData();return{src:t.url,alt:t.AltText,width:t.InsertWidth,height:t.InsertHeight,title:t.TitleTooltip,class:t.Alignment,"data-id":t.ID,"data-shortcode":"image"}},getExtraData:function(){var t=this.getData();return{CaptionText:t&&t.Caption}},insertFile:function(){var e=this.getData(),i=this.getElement().getEditor(),n=t(i.getSelectedNode()),a=h.default.serialise({name:"file_link",properties:{id:e.ID}},!0),r=tinymce.activeEditor.selection,o=r.getContent()||"",s=o||e.Text||e.filename;n.is("a")&&n.html()&&(s="");var d={href:a,target:e.TargetBlank?"_blank":"",title:e.Description};if(n.is("img")){s=e.Text||e.filename;var l=t("<a />").attr(d).text(s);n.replaceWith(l),i.addUndo(),i.repaint()}else this.insertLinkInEditor(d,s);return!0},insertImage:function(){var e=this.getElement();if(!e)return!1;var i=e.getEditor();if(!i)return!1;var n=t(i.getSelectedNode()),a=this.getAttributes(),r=this.getExtraData(),o=n&&n.is("img,a")?n:null;o&&o.parent().is(".captionImage")&&(o=o.parent());var s=n&&n.is("img")?n:t("<img />");s.attr(a).addClass("ss-htmleditorfield-file image");var d=s.parent(".captionImage"),l=d.find(".caption");r.CaptionText?(d.length||(d=t("<div></div>")),d.attr("class","captionImage "+a.class).removeAttr("data-mce-style").width(a.width),l.length||(l=t('<p class="caption"></p>').appendTo(d)),l.attr("class","caption "+a.class).text(r.CaptionText)):(d=null,l=null);var c=d||s;return o&&o.not(c).length&&o.replaceWith(c),d&&d.prepend(s),o||(i.repaint(),i.insertContent(t("<div />").append(c).html(),{skip_undo:1})),i.addUndo(),i.repaint(),!0},statusMessage:function(e,i){var n=t("<div/>").text(e).html();t.noticeAdd({text:n,type:i,stayTime:5e3,inEffect:{left:"0",opacity:"show"}})}})})},0:function(t,e){t.exports=React},1:function(t,e){t.exports=i18n},10:function(t,e){t.exports=InsertMediaModal},2:function(t,e){t.exports=Injector},5:function(t,e){t.exports=ReactDom},6:function(t,e){t.exports=jQuery},7:function(t,e){t.exports=ShortcodeSerialiser}});
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/src/entwine/TinyMCE_ssmedia.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/src/entwine/TinyMCE_ssmedia.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _i18n = __webpack_require__("i18n");

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Injector = __webpack_require__("lib/Injector");

var _InsertMediaModal = __webpack_require__("containers/InsertMediaModal/InsertMediaModal");

var _InsertMediaModal2 = _interopRequireDefault(_InsertMediaModal);

var _ShortcodeSerialiser = __webpack_require__("lib/ShortcodeSerialiser");

var _ShortcodeSerialiser2 = _interopRequireDefault(_ShortcodeSerialiser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InjectableInsertMediaModal = (0, _Injector.loadComponent)(_InsertMediaModal2.default);

var filter = 'img[data-shortcode="image"]';

(function () {
  var ssmedia = {
    init: function init(ed) {
      var title = _i18n2.default._t('AssetAdmin.INSERT_FROM_FILES', 'Insert from Files');
      ed.addButton('ssmedia', {
        icon: 'image',
        title: title,
        cmd: 'ssmedia'
      });
      ed.addMenuItem('ssmedia', {
        icon: 'image',
        text: title,
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

        content.find(filter).add(content.filter(filter)).each(function () {
          var el = (0, _jquery2.default)(this);
          var properties = {
            src: el.attr('src'),
            id: el.data('id'),
            width: el.attr('width'),
            height: el.attr('height'),
            class: el.attr('class'),

            title: el.attr('title'),
            alt: el.attr('alt')
          };
          var shortCode = _ShortcodeSerialiser2.default.serialise({
            name: 'image',
            properties: properties,
            wrapped: false
          });
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
        var content = o.content;

        var match = _ShortcodeSerialiser2.default.match('image', false, content);
        while (match) {
          var attrs = match.properties;
          var el = (0, _jquery2.default)('<img/>').attr(Object.assign({}, attrs, {
            id: undefined,
            'data-id': attrs.id,
            'data-shortcode': 'image'
          })).addClass('ss-htmleditorfield-file image');
          content = content.replace(match.original, (0, _jquery2.default)('<div/>').append(el).html());

          match = _ShortcodeSerialiser2.default.match('image', false, content);
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

  $('.js-injector-boot #insert-media-react__dialog-wrapper').entwine({
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
    _renderModal: function _renderModal(isOpen) {
      var _this = this;

      var handleHide = function handleHide() {
        return _this.close();
      };
      var handleInsert = function handleInsert() {
        return _this._handleInsert.apply(_this, arguments);
      };
      var attrs = this.getOriginalAttributes();
      var selection = tinymce.activeEditor.selection;
      var selectionContent = selection.getContent() || '';
      var tagName = selection.getNode().tagName;

      var requireLinkText = tagName !== 'A' && (tagName === 'IMG' || selectionContent.trim() === '');

      delete attrs.url;

      _reactDom2.default.render(_react2.default.createElement(InjectableInsertMediaModal, {
        title: false,
        type: 'insert-media',
        isOpen: isOpen,
        onInsert: handleInsert,
        onClosed: handleHide,
        bodyClassName: 'modal__dialog',
        className: 'insert-media-react__dialog-wrapper',
        requireLinkText: requireLinkText,
        fileAttributes: attrs
      }), this[0]);
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

      var hrefParts = ($node.attr('href') || '').split('#');
      if (hrefParts[0]) {
        var shortcode = _ShortcodeSerialiser2.default.match('file_link', false, hrefParts[0]);
        if (shortcode) {
          return {
            ID: shortcode.properties.id ? parseInt(shortcode.properties.id, 10) : 0,
            Anchor: hrefParts[1] || '',
            Description: $node.attr('title'),
            TargetBlank: !!$node.attr('target')
          };
        }
      }

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

      var editor = this.getElement().getEditor();
      var $node = $(editor.getSelectedNode());

      var shortcode = _ShortcodeSerialiser2.default.serialise({
        name: 'file_link',
        properties: { id: data.ID }
      }, true);

      var selection = tinymce.activeEditor.selection;
      var selectionContent = selection.getContent() || '';
      var linkText = selectionContent || data.Text || data.filename;

      if ($node.is('a') && $node.html()) {
        linkText = '';
      }

      var linkAttributes = {
        href: shortcode,
        target: data.TargetBlank ? '_blank' : '',
        title: data.Description
      };

      if ($node.is('img')) {
        linkText = data.Text || data.filename;
        var newLink = $('<a />').attr(linkAttributes).text(linkText);
        $node.replaceWith(newLink);
        editor.addUndo();
        editor.repaint();
      } else {
        this.insertLinkInEditor(linkAttributes, linkText);
      }
      return true;
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

      var replacee = node && node.is('img,a') ? node : null;
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
        container = null;
        caption = null;
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

/***/ "containers/InsertMediaModal/InsertMediaModal":
/***/ (function(module, exports) {

module.exports = InsertMediaModal;

/***/ }),

/***/ "i18n":
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ "jquery":
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),

/***/ "lib/Injector":
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ "lib/ShortcodeSerialiser":
/***/ (function(module, exports) {

module.exports = ShortcodeSerialiser;

/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ "react-dom":
/***/ (function(module, exports) {

module.exports = ReactDom;

/***/ })

/******/ });
//# sourceMappingURL=TinyMCE_ssmedia.js.map
>>>>>>> 35044a6... Refactor resultBehaviors

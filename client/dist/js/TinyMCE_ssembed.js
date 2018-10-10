<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="./client/src/entwine/TinyMCE_ssembed.js")}({"./client/src/components/InsertEmbedModal/InsertEmbedModal.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var n=e.config.sections.find(function(e){return e.name===E}),r=t.fileAttributes?t.fileAttributes.Url:"",i=n.form.remoteEditForm.schemaUrl,a=r&&i+"/?embedurl="+encodeURIComponent(r),o=n.form.remoteCreateForm.schemaUrl;return{sectionConfig:n,schemaUrl:a||o,targetUrl:r}}function l(e){return{actions:{schema:(0,m.bindActionCreators)(_,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.Component=void 0;var d=function(){function e(e,t){var n=[],r=!0,i=!1,a=void 0;try{for(var o,s=e[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){i=!0,a=e}finally{try{!r&&s.return&&s.return()}finally{if(i)throw a}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(2),f=r(c),p=n(0),h=r(p),m=n(5),g=n(4),b=n(11),v=r(b),y=n(18),_=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(y),C=n(1),A=r(C),E="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",w=function(e){function t(e){i(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleSubmit=n.handleSubmit.bind(n),n}return o(t,e),u(t,[{key:"componentWillMount",value:function(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function(e){e.isOpen&&!this.props.isOpen&&this.setOverrides(e)}},{key:"componentWillUnmount",value:function(){this.clearOverrides()}},{key:"setOverrides",value:function(e){if(this.props.schemaUrl!==e.schemaUrl&&this.clearOverrides(),e.schemaUrl){var t=Object.assign({},e.fileAttributes);delete t.ID;var n={fields:Object.entries(t).map(function(e){var t=d(e,2);return{name:t[0],value:t[1]}})};this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,n)}}},{key:"getModalProps",value:function(){var e=Object.assign({onSubmit:this.handleSubmit,onLoadingError:this.handleLoadingError,showErrorMessage:!0,responseClassBad:"alert alert-danger",identifier:"AssetAdmin.InsertEmbedModal"},this.props,{className:"insert-embed-modal "+this.props.className,size:"lg",onClosed:this.props.onClosed,title:this.props.targetUrl?f.default._t("AssetAdmin.EditTitle","Media from the web"):f.default._t("AssetAdmin.CreateTitle","Insert new media from the web")});return delete e.sectionConfig,delete e.onInsert,delete e.fileAttributes,e}},{key:"clearOverrides",value:function(){this.props.actions.schema.setSchemaStateOverrides(this.props.schemaUrl,null)}},{key:"handleLoadingError",value:function(e){"function"==typeof this.props.onLoadingError&&this.props.onLoadingError(e)}},{key:"handleSubmit",value:function(e,t){switch(t){case"action_addmedia":this.props.onCreate(e);break;case"action_insertmedia":this.props.onInsert(e);break;case"action_cancel":this.props.onClosed()}return Promise.resolve()}},{key:"render",value:function(){return h.default.createElement(v.default,this.getModalProps())}}]),t}(p.Component);w.propTypes={sectionConfig:A.default.shape({url:A.default.string,form:A.default.object}),isOpen:A.default.bool,onInsert:A.default.func.isRequired,onCreate:A.default.func.isRequired,fileAttributes:A.default.shape({Url:A.default.string,CaptionText:A.default.string,PreviewUrl:A.default.string,Placement:A.default.string,Width:A.default.number,Height:A.default.number}),onClosed:A.default.func.isRequired,className:A.default.string,actions:A.default.object,schemaUrl:A.default.string.isRequired,targetUrl:A.default.string,onLoadingError:A.default.func},w.defaultProps={className:"",fileAttributes:{}},t.Component=w,t.default=(0,g.connect)(s,l)(w)},"./client/src/entwine/TinyMCE_ssembed.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var i=n(7),a=r(i),o=n(0),s=r(o),l=n(6),d=r(l),u=n(3),c=n(8),f=r(c),p=n("./client/src/components/InsertEmbedModal/InsertEmbedModal.js"),h=r(p),m=n(2),g=r(m),b=(0,u.loadComponent)(h.default),v='div[data-shortcode="embed"]';!function(){var e={init:function(e){var t=g.default._t("AssetAdmin.INSERT_VIA_URL","Insert media via URL"),n=g.default._t("AssetAdmin.EDIT_MEDIA","Edit media"),r=g.default._t("AssetAdmin.MEDIA","Media");e.addButton("ssembed",{title:t,icon:"media",cmd:"ssembed",stateSelector:v}),e.addMenuItem("ssembed",{text:r,icon:"media",cmd:"ssembed"}),e.addButton("ssembededit",{title:n,icon:"editimage",cmd:"ssembed"}),e.addContextToolbar(function(t){return e.dom.is(t,v)},"alignleft aligncenter alignright | ssembededit"),e.addCommand("ssembed",function(){(0,a.default)("#"+e.id).entwine("ss").openEmbedDialog()}),e.on("BeforeExecCommand",function(t){var n=t.command,r=t.ui,i=t.value;"mceAdvMedia"!==n&&"mceAdvMedia"!==n||(t.preventDefault(),e.execCommand("ssembed",r,i))}),e.on("SaveContent",function(e){var t=(0,a.default)("<div>"+e.content+"</div>");t.find(v).each(function(){var e=(0,a.default)(this),t=e.find("img.placeholder");if(0===t.length)return e.removeAttr("data-url"),void e.removeAttr("data-shortcode");var n=e.find(".caption").text(),r=parseInt(t.attr("width"),10),i=parseInt(t.attr("height"),10),o=e.data("url"),s={url:o,thumbnail:t.prop("src"),class:e.prop("class"),width:isNaN(r)?null:r,height:isNaN(i)?null:i,caption:n},l=f.default.serialise({name:"embed",properties:s,wrapped:!0,content:o});e.replaceWith(l)}),e.content=t.html()}),e.on("BeforeSetContent",function(e){for(var t=e.content,n=f.default.match("embed",!0,t);n;){var r=n.properties,i=(0,a.default)("<div/>").attr("data-url",r.url||n.content).attr("data-shortcode","embed").addClass(r.class).addClass("ss-htmleditorfield-file embed"),o=(0,a.default)("<img />").attr("src",r.thumbnail).addClass("placeholder");if(r.width&&o.attr("width",r.width),r.height&&o.attr("height",r.height),i.append(o),r.caption){var s=(0,a.default)("<p />").addClass("caption").text(r.caption);i.append(s)}t=t.replace(n.original,(0,a.default)("<div/>").append(i).html()),n=f.default.match("embed",!0,t)}e.content=t})}};tinymce.PluginManager.add("ssembed",function(t){return e.init(t)})}(),a.default.entwine("ss",function(e){e(".js-injector-boot #insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){d.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this.setData({}),this._renderModal(!1)},_renderModal:function(e){var t=this,n=function(){return t.close()},r=function(){return t._handleInsert.apply(t,arguments)},i=function(){return t._handleCreate.apply(t,arguments)},a=function(){return t._handleLoadingError.apply(t,arguments)},o=this.getOriginalAttributes();d.default.render(s.default.createElement(b,{isOpen:e,onCreate:i,onInsert:r,onClosed:n,onLoadingError:a,bodyClassName:"modal__dialog",className:"insert-embed-react__dialog-wrapper",fileAttributes:o}),this[0])},_handleLoadingError:function(){this.setData({}),this.open()},_handleInsert:function(e){var t=this.getData();this.setData(Object.assign({Url:t.Url},e)),this.insertRemote(),this.close()},_handleCreate:function(e){this.setData(Object.assign({},this.getData(),e)),this.open()},getOriginalAttributes:function(){var t=this.getData(),n=this.getElement();if(!n)return t;var r=e(n.getEditor().getSelectedNode());if(!r.length)return t;var i=r.closest(v).add(r.filter(v));if(!i.length)return t;var a=i.find("img.placeholder");if(0===a.length)return t;var o=i.find(".caption").text(),s=parseInt(a.width(),10),l=parseInt(a.height(),10);return{Url:i.data("url")||t.Url,CaptionText:o,PreviewUrl:a.attr("src"),Width:isNaN(s)?null:s,Height:isNaN(l)?null:l,Placement:this.findPosition(i.prop("class"))}},findPosition:function(e){var t=["leftAlone","center","rightAlone","left","right"];if("string"!=typeof e)return"";var n=e.split(" ");return t.find(function(e){return n.indexOf(e)>-1})},insertRemote:function(){var t=this.getElement();if(!t)return!1;var n=t.getEditor();if(!n)return!1;var r=this.getData(),i=(0,a.default)("<div/>").attr("data-url",r.Url).attr("data-shortcode","embed").addClass(r.Placement).addClass("ss-htmleditorfield-file embed"),o=(0,a.default)("<img />").attr("src",r.PreviewUrl).addClass("placeholder");if(r.Width&&o.attr("width",r.Width),r.Height&&o.attr("height",r.Height),i.append(o),r.CaptionText){var s=(0,a.default)("<p />").addClass("caption").text(r.CaptionText);i.append(s)}var l=e(n.getSelectedNode()),d=e(null);return l.length&&(d=l.filter(v),0===d.length&&(d=l.closest(v)),0===d.length&&(d=l.filter("img.placeholder"))),d.length?d.replaceWith(i):(n.repaint(),n.insertContent(e("<div />").append(i.clone()).html(),{skip_undo:1})),n.addUndo(),n.repaint(),!0}})})},0:function(e,t){e.exports=React},1:function(e,t){e.exports=PropTypes},11:function(e,t){e.exports=FormBuilderModal},18:function(e,t){e.exports=SchemaActions},2:function(e,t){e.exports=i18n},3:function(e,t){e.exports=Injector},4:function(e,t){e.exports=ReactRedux},5:function(e,t){e.exports=Redux},6:function(e,t){e.exports=ReactDom},7:function(e,t){e.exports=jQuery},8:function(e,t){e.exports=ShortcodeSerialiser}});
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/src/entwine/TinyMCE_ssembed.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/src/components/InsertEmbedModal/InsertEmbedModal.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _redux = __webpack_require__(4);

var _reactRedux = __webpack_require__(3);

var _FormBuilderModal = __webpack_require__(11);

var _FormBuilderModal2 = _interopRequireDefault(_FormBuilderModal);

var _SchemaActions = __webpack_require__(16);

var schemaActions = _interopRequireWildcard(_SchemaActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

var InsertEmbedModal = function (_Component) {
  _inherits(InsertEmbedModal, _Component);

  function InsertEmbedModal(props) {
    _classCallCheck(this, InsertEmbedModal);

    var _this = _possibleConstructorReturn(this, (InsertEmbedModal.__proto__ || Object.getPrototypeOf(InsertEmbedModal)).call(this, props));

    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(InsertEmbedModal, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setOverrides(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props.isOpen && !this.props.isOpen) {
        this.setOverrides(props);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearOverrides();
    }
  }, {
    key: 'setOverrides',
    value: function setOverrides(props) {
      if (this.props.schemaUrl !== props.schemaUrl) {
        this.clearOverrides();
      }
      if (props.schemaUrl) {
        var attrs = Object.assign({}, props.fileAttributes);
        delete attrs.ID;

        var overrides = {
          fields: Object.entries(attrs).map(function (field) {
            var _field = _slicedToArray(field, 2),
                name = _field[0],
                value = _field[1];

            return { name: name, value: value };
          })
        };

        this.props.actions.schema.setSchemaStateOverrides(props.schemaUrl, overrides);
      }
    }
  }, {
    key: 'getModalProps',
    value: function getModalProps() {
      var props = Object.assign({
        onSubmit: this.handleSubmit,
        onLoadingError: this.handleLoadingError,
        showErrorMessage: true,
        responseClassBad: 'alert alert-danger',
        identifier: 'AssetAdmin.InsertEmbedModal'
      }, this.props, {
        className: 'insert-embed-modal ' + this.props.className,
        size: 'lg',
        onClosed: this.props.onClosed,
        title: this.props.targetUrl ? _i18n2.default._t('AssetAdmin.EditTitle', 'Media from the web') : _i18n2.default._t('AssetAdmin.CreateTitle', 'Insert new media from the web')
      });
      delete props.sectionConfig;
      delete props.onInsert;
      delete props.fileAttributes;

      return props;
    }
  }, {
    key: 'clearOverrides',
    value: function clearOverrides() {
      this.props.actions.schema.setSchemaStateOverrides(this.props.schemaUrl, null);
    }
  }, {
    key: 'handleLoadingError',
    value: function handleLoadingError(error) {
      if (typeof this.props.onLoadingError === 'function') {
        this.props.onLoadingError(error);
      }
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(data, action) {
      switch (action) {
        case 'action_addmedia':
          {
            this.props.onCreate(data);
            break;
          }
        case 'action_insertmedia':
          {
            this.props.onInsert(data);
            break;
          }
        case 'action_cancel':
          {
            this.props.onClosed();
            break;
          }
        default:
          {}
      }

      return Promise.resolve();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_FormBuilderModal2.default, this.getModalProps());
    }
  }]);

  return InsertEmbedModal;
}(_react.Component);

InsertEmbedModal.propTypes = {
  sectionConfig: _react.PropTypes.shape({
    url: _react.PropTypes.string,
    form: _react.PropTypes.object
  }),
  isOpen: _react.PropTypes.bool,
  onInsert: _react.PropTypes.func.isRequired,
  onCreate: _react.PropTypes.func.isRequired,
  fileAttributes: _react.PropTypes.shape({
    Url: _react.PropTypes.string,
    CaptionText: _react.PropTypes.string,
    PreviewUrl: _react.PropTypes.string,
    Placement: _react.PropTypes.string,
    Width: _react.PropTypes.number,
    Height: _react.PropTypes.number
  }),
  onClosed: _react.PropTypes.func.isRequired,
  className: _react.PropTypes.string,
  actions: _react.PropTypes.object,
  schemaUrl: _react.PropTypes.string.isRequired,
  targetUrl: _react.PropTypes.string,
  onLoadingError: _react.PropTypes.func
};

InsertEmbedModal.defaultProps = {
  className: '',
  fileAttributes: {}
};

function mapStateToProps(state, ownProps) {
  var sectionConfig = state.config.sections.find(function (section) {
    return section.name === sectionConfigKey;
  });

  var targetUrl = ownProps.fileAttributes ? ownProps.fileAttributes.Url : '';
  var baseEditUrl = sectionConfig.form.remoteEditForm.schemaUrl;

  var editUrl = targetUrl && baseEditUrl + '/?embedurl=' + encodeURIComponent(targetUrl);
  var createUrl = sectionConfig.form.remoteCreateForm.schemaUrl;

  var schemaUrl = editUrl || createUrl;

  return {
    sectionConfig: sectionConfig,
    schemaUrl: schemaUrl,
    targetUrl: targetUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch)
    }
  };
}

exports.Component = InsertEmbedModal;
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(InsertEmbedModal);

/***/ }),

/***/ "./client/src/entwine/TinyMCE_ssembed.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(6);

var _jquery2 = _interopRequireDefault(_jquery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Injector = __webpack_require__(2);

var _ShortcodeSerialiser = __webpack_require__(7);

var _ShortcodeSerialiser2 = _interopRequireDefault(_ShortcodeSerialiser);

var _InsertEmbedModal = __webpack_require__("./client/src/components/InsertEmbedModal/InsertEmbedModal.js");

var _InsertEmbedModal2 = _interopRequireDefault(_InsertEmbedModal);

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InjectableInsertEmbedModal = (0, _Injector.loadComponent)(_InsertEmbedModal2.default);
var filter = 'div[data-shortcode="embed"]';

(function () {
  var ssembed = {
    init: function init(editor) {
      var title = _i18n2.default._t('AssetAdmin.INSERT_VIA_URL', 'Insert media via URL');
      editor.addButton('ssembed', {
        icon: 'media',
        title: title,
        cmd: 'ssembed'
      });
      editor.addMenuItem('ssembed', {
        icon: 'media',
        text: title,
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
          var properties = {
            url: url,
            thumbnail: placeholder.prop('src'),
            class: embed.prop('class'),
            width: isNaN(width) ? null : width,
            height: isNaN(height) ? null : height,
            caption: caption
          };
          var shortCode = _ShortcodeSerialiser2.default.serialise({
            name: 'embed',
            properties: properties,
            wrapped: true,
            content: url
          });
          embed.replaceWith(shortCode);
        });

        o.content = content.html();
      });
      editor.on('BeforeSetContent', function (o) {
        var content = o.content;

        var match = _ShortcodeSerialiser2.default.match('embed', true, content);
        while (match) {
          var data = match.properties;

          var base = (0, _jquery2.default)('<div/>').attr('data-url', data.url || match.content).attr('data-shortcode', 'embed').addClass(data.class).addClass('ss-htmleditorfield-file embed');

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

          content = content.replace(match.original, (0, _jquery2.default)('<div/>').append(base).html());

          match = _ShortcodeSerialiser2.default.match('embed', true, content);
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
  $('.js-injector-boot #insert-embed-react__dialog-wrapper').entwine({
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
    _renderModal: function _renderModal(isOpen) {
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
      var attrs = this.getOriginalAttributes();

      _reactDom2.default.render(_react2.default.createElement(InjectableInsertEmbedModal, {
        isOpen: isOpen,
        onCreate: handleCreate,
        onInsert: handleInsert,
        onClosed: handleHide,
        onLoadingError: handleLoadingError,
        bodyClassName: 'modal__dialog',
        className: 'insert-embed-react__dialog-wrapper',
        fileAttributes: attrs
      }), this[0]);
    },
    _handleLoadingError: function _handleLoadingError() {
      this.setData({});
      this.open();
    },
    _handleInsert: function _handleInsert(data) {
      var oldData = this.getData();
      this.setData(Object.assign({ Url: oldData.Url }, data));
      this.insertRemote();
      this.close();
    },
    _handleCreate: function _handleCreate(data) {
      this.setData(Object.assign({}, this.getData(), data));
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

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 11:
/***/ (function(module, exports) {

module.exports = FormBuilderModal;

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

module.exports = SchemaActions;

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = ReactRedux;

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = Redux;

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
//# sourceMappingURL=TinyMCE_ssembed.js.map
>>>>>>> POC for injectable asset-admin
=======
!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="./client/src/entwine/TinyMCE_ssembed.js")}({"./client/src/components/InsertEmbedModal/InsertEmbedModal.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var n=e.config.sections.find(function(e){return e.name===_}),r=t.fileAttributes?t.fileAttributes.Url:"",i=n.form.remoteEditForm.schemaUrl,o=r&&i+"/?embedurl="+encodeURIComponent(r),a=n.form.remoteCreateForm.schemaUrl;return{sectionConfig:n,schemaUrl:o||a,targetUrl:r}}function l(e){return{actions:{schema:(0,m.bindActionCreators)(C,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.Component=void 0;var d=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(i)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),p=r(u),f=n(0),h=r(f),m=n(4),g=n(3),b=n(10),v=r(b),y=n(17),C=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(y),_="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",P=function(e){function t(e){i(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleSubmit=n.handleSubmit.bind(n),n}return a(t,e),c(t,[{key:"componentWillMount",value:function(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function(e){e.isOpen&&!this.props.isOpen&&this.setOverrides(e)}},{key:"componentWillUnmount",value:function(){this.clearOverrides()}},{key:"setOverrides",value:function(e){if(this.props.schemaUrl!==e.schemaUrl&&this.clearOverrides(),e.schemaUrl){var t=Object.assign({},e.fileAttributes);delete t.ID;var n={fields:Object.entries(t).map(function(e){var t=d(e,2);return{name:t[0],value:t[1]}})};this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,n)}}},{key:"getModalProps",value:function(){var e=Object.assign({onSubmit:this.handleSubmit,onLoadingError:this.handleLoadingError,showErrorMessage:!0,responseClassBad:"alert alert-danger",identifier:"AssetAdmin.InsertEmbedModal"},this.props,{className:"insert-embed-modal "+this.props.className,size:"lg",onClosed:this.props.onClosed,title:this.props.targetUrl?p.default._t("AssetAdmin.EditTitle","Media from the web"):p.default._t("AssetAdmin.CreateTitle","Insert new media from the web")});return delete e.sectionConfig,delete e.onInsert,delete e.fileAttributes,e}},{key:"clearOverrides",value:function(){this.props.actions.schema.setSchemaStateOverrides(this.props.schemaUrl,null)}},{key:"handleLoadingError",value:function(e){"function"==typeof this.props.onLoadingError&&this.props.onLoadingError(e)}},{key:"handleSubmit",value:function(e,t){switch(t){case"action_addmedia":this.props.onCreate(e);break;case"action_insertmedia":this.props.onInsert(e);break;case"action_cancel":this.props.onClosed()}return Promise.resolve()}},{key:"render",value:function(){return h.default.createElement(v.default,this.getModalProps())}}]),t}(f.Component);P.propTypes={sectionConfig:f.PropTypes.shape({url:f.PropTypes.string,form:f.PropTypes.object}),isOpen:f.PropTypes.bool,onInsert:f.PropTypes.func.isRequired,onCreate:f.PropTypes.func.isRequired,fileAttributes:f.PropTypes.shape({Url:f.PropTypes.string,CaptionText:f.PropTypes.string,PreviewUrl:f.PropTypes.string,Placement:f.PropTypes.string,Width:f.PropTypes.number,Height:f.PropTypes.number}),onClosed:f.PropTypes.func.isRequired,className:f.PropTypes.string,actions:f.PropTypes.object,schemaUrl:f.PropTypes.string.isRequired,targetUrl:f.PropTypes.string,onLoadingError:f.PropTypes.func},P.defaultProps={className:"",fileAttributes:{}},t.Component=P,t.default=(0,g.connect)(s,l)(P)},"./client/src/entwine/TinyMCE_ssembed.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var i=n(6),o=r(i),a=n(0),s=r(a),l=n(5),d=r(l),c=n(2),u=n(7),p=r(u),f=n("./client/src/components/InsertEmbedModal/InsertEmbedModal.js"),h=r(f),m=n(1),g=r(m),b=(0,c.loadComponent)(h.default),v='div[data-shortcode="embed"]';!function(){var e={init:function(e){var t=g.default._t("AssetAdmin.INSERT_VIA_URL","Insert media via URL");e.addButton("ssembed",{icon:"media",title:t,cmd:"ssembed"}),e.addMenuItem("ssembed",{icon:"media",text:t,cmd:"ssembed"}),e.addCommand("ssembed",function(){(0,o.default)("#"+e.id).entwine("ss").openEmbedDialog()}),e.on("BeforeExecCommand",function(t){var n=t.command,r=t.ui,i=t.value;"mceAdvMedia"!==n&&"mceAdvMedia"!==n||(t.preventDefault(),e.execCommand("ssembed",r,i))}),e.on("SaveContent",function(e){var t=(0,o.default)("<div>"+e.content+"</div>");t.find(v).each(function(){var e=(0,o.default)(this),t=e.find("img.placeholder");if(0===t.length)return e.removeAttr("data-url"),void e.removeAttr("data-shortcode");var n=e.find(".caption").text(),r=parseInt(t.attr("width"),10),i=parseInt(t.attr("height"),10),a=e.data("url"),s={url:a,thumbnail:t.prop("src"),class:e.prop("class"),width:isNaN(r)?null:r,height:isNaN(i)?null:i,caption:n},l=p.default.serialise({name:"embed",properties:s,wrapped:!0,content:a});e.replaceWith(l)}),e.content=t.html()}),e.on("BeforeSetContent",function(e){for(var t=e.content,n=p.default.match("embed",!0,t);n;){var r=n.properties,i=(0,o.default)("<div/>").attr("data-url",r.url||n.content).attr("data-shortcode","embed").addClass(r.class).addClass("ss-htmleditorfield-file embed"),a=(0,o.default)("<img />").attr("src",r.thumbnail).addClass("placeholder");if(r.width&&(i.width(r.width),a.attr("width",r.width)),r.height&&a.attr("height",r.height),i.append(a),r.caption){var s=(0,o.default)("<p />").addClass("caption").text(r.caption);i.append(s)}t=t.replace(n.original,(0,o.default)("<div/>").append(i).html()),n=p.default.match("embed",!0,t)}e.content=t})}};tinymce.PluginManager.add("ssembed",function(t){return e.init(t)})}(),o.default.entwine("ss",function(e){e(".js-injector-boot #insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){d.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this.setData({}),this._renderModal(!1)},_renderModal:function(e){var t=this,n=function(){return t.close()},r=function(){return t._handleInsert.apply(t,arguments)},i=function(){return t._handleCreate.apply(t,arguments)},o=function(){return t._handleLoadingError.apply(t,arguments)},a=this.getOriginalAttributes();d.default.render(s.default.createElement(b,{isOpen:e,onCreate:i,onInsert:r,onClosed:n,onLoadingError:o,bodyClassName:"modal__dialog",className:"insert-embed-react__dialog-wrapper",fileAttributes:a}),this[0])},_handleLoadingError:function(){this.setData({}),this.open()},_handleInsert:function(e){var t=this.getData();this.setData(Object.assign({Url:t.Url},e)),this.insertRemote(),this.close()},_handleCreate:function(e){this.setData(Object.assign({},this.getData(),e)),this.open()},getOriginalAttributes:function(){var t=this.getData(),n=this.getElement();if(!n)return t;var r=e(n.getEditor().getSelectedNode());if(!r.length)return t;var i=r.closest(v).add(r.filter(v));if(!i.length)return t;var o=i.find("img.placeholder");if(0===o.length)return t;var a=i.find(".caption").text(),s=parseInt(o.width(),10),l=parseInt(o.height(),10);return{Url:i.data("url")||t.Url,CaptionText:a,PreviewUrl:o.attr("src"),Width:isNaN(s)?null:s,Height:isNaN(l)?null:l,Placement:this.findPosition(i.prop("class"))}},findPosition:function(e){var t=["leftAlone","center","rightAlone","left","right"];if("string"!=typeof e)return"";var n=e.split(" ");return t.find(function(e){return n.indexOf(e)>-1})},insertRemote:function(){var t=this.getElement();if(!t)return!1;var n=t.getEditor();if(!n)return!1;var r=this.getData(),i=(0,o.default)("<div/>").attr("data-url",r.Url).attr("data-shortcode","embed").addClass(r.Placement).addClass("ss-htmleditorfield-file embed"),a=(0,o.default)("<img />").attr("src",r.PreviewUrl).addClass("placeholder");if(r.Width&&(i.width(r.Width),a.attr("width",r.Width)),r.Height&&a.attr("height",r.Height),i.append(a),r.CaptionText){var s=(0,o.default)("<p />").addClass("caption").text(r.CaptionText);i.append(s)}var l=e(n.getSelectedNode()),d=e(null);return l.length&&(d=l.filter(v),0===d.length&&(d=l.closest(v)),0===d.length&&(d=l.filter("img.placeholder"))),d.length?d.replaceWith(i):(n.repaint(),n.insertContent(e("<div />").append(i.clone()).html(),{skip_undo:1})),n.addUndo(),n.repaint(),!0}})})},0:function(e,t){e.exports=React},1:function(e,t){e.exports=i18n},10:function(e,t){e.exports=FormBuilderModal},17:function(e,t){e.exports=SchemaActions},2:function(e,t){e.exports=Injector},3:function(e,t){e.exports=ReactRedux},4:function(e,t){e.exports=Redux},5:function(e,t){e.exports=ReactDom},6:function(e,t){e.exports=jQuery},7:function(e,t){e.exports=ShortcodeSerialiser}});
>>>>>>> Build
=======
!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="./client/src/entwine/TinyMCE_ssembed.js")}({"./client/src/components/InsertEmbedModal/InsertEmbedModal.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var n=e.config.sections.find(function(e){return e.name===_}),r=t.fileAttributes?t.fileAttributes.Url:"",i=n.form.remoteEditForm.schemaUrl,o=r&&i+"/?embedurl="+encodeURIComponent(r),a=n.form.remoteCreateForm.schemaUrl;return{sectionConfig:n,schemaUrl:o||a,targetUrl:r}}function l(e){return{actions:{schema:(0,m.bindActionCreators)(C,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.Component=void 0;var d=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(i)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),p=r(u),f=n(0),h=r(f),m=n(4),g=n(3),b=n(10),v=r(b),y=n(15),C=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(y),_="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",P=function(e){function t(e){i(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleSubmit=n.handleSubmit.bind(n),n}return a(t,e),c(t,[{key:"componentWillMount",value:function(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function(e){e.isOpen&&!this.props.isOpen&&this.setOverrides(e)}},{key:"componentWillUnmount",value:function(){this.clearOverrides()}},{key:"setOverrides",value:function(e){if(this.props.schemaUrl!==e.schemaUrl&&this.clearOverrides(),e.schemaUrl){var t=Object.assign({},e.fileAttributes);delete t.ID;var n={fields:Object.entries(t).map(function(e){var t=d(e,2);return{name:t[0],value:t[1]}})};this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,n)}}},{key:"getModalProps",value:function(){var e=Object.assign({onSubmit:this.handleSubmit,onLoadingError:this.handleLoadingError,showErrorMessage:!0,responseClassBad:"alert alert-danger",identifier:"AssetAdmin.InsertEmbedModal"},this.props,{className:"insert-embed-modal "+this.props.className,size:"lg",onClosed:this.props.onClosed,title:this.props.targetUrl?p.default._t("AssetAdmin.EditTitle","Media from the web"):p.default._t("AssetAdmin.CreateTitle","Insert new media from the web")});return delete e.sectionConfig,delete e.onInsert,delete e.fileAttributes,e}},{key:"clearOverrides",value:function(){this.props.actions.schema.setSchemaStateOverrides(this.props.schemaUrl,null)}},{key:"handleLoadingError",value:function(e){"function"==typeof this.props.onLoadingError&&this.props.onLoadingError(e)}},{key:"handleSubmit",value:function(e,t){switch(t){case"action_addmedia":this.props.onCreate(e);break;case"action_insertmedia":this.props.onInsert(e);break;case"action_cancel":this.props.onClosed()}return Promise.resolve()}},{key:"render",value:function(){return h.default.createElement(v.default,this.getModalProps())}}]),t}(f.Component);P.propTypes={sectionConfig:f.PropTypes.shape({url:f.PropTypes.string,form:f.PropTypes.object}),isOpen:f.PropTypes.bool,onInsert:f.PropTypes.func.isRequired,onCreate:f.PropTypes.func.isRequired,fileAttributes:f.PropTypes.shape({Url:f.PropTypes.string,CaptionText:f.PropTypes.string,PreviewUrl:f.PropTypes.string,Placement:f.PropTypes.string,Width:f.PropTypes.number,Height:f.PropTypes.number}),onClosed:f.PropTypes.func.isRequired,className:f.PropTypes.string,actions:f.PropTypes.object,schemaUrl:f.PropTypes.string.isRequired,targetUrl:f.PropTypes.string,onLoadingError:f.PropTypes.func},P.defaultProps={className:"",fileAttributes:{}},t.Component=P,t.default=(0,g.connect)(s,l)(P)},"./client/src/entwine/TinyMCE_ssembed.js":function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var i=n(6),o=r(i),a=n(0),s=r(a),l=n(5),d=r(l),c=n(2),u=n(7),p=r(u),f=n("./client/src/components/InsertEmbedModal/InsertEmbedModal.js"),h=r(f),m=n(1),g=r(m),b=(0,c.loadComponent)(h.default),v='div[data-shortcode="embed"]';!function(){var e={init:function(e){var t=g.default._t("AssetAdmin.INSERT_VIA_URL","Insert media via URL");e.addButton("ssembed",{icon:"media",title:t,cmd:"ssembed"}),e.addMenuItem("ssembed",{icon:"media",text:t,cmd:"ssembed"}),e.addCommand("ssembed",function(){(0,o.default)("#"+e.id).entwine("ss").openEmbedDialog()}),e.on("BeforeExecCommand",function(t){var n=t.command,r=t.ui,i=t.value;"mceAdvMedia"!==n&&"mceAdvMedia"!==n||(t.preventDefault(),e.execCommand("ssembed",r,i))}),e.on("SaveContent",function(e){var t=(0,o.default)("<div>"+e.content+"</div>");t.find(v).each(function(){var e=(0,o.default)(this),t=e.find("img.placeholder");if(0===t.length)return e.removeAttr("data-url"),void e.removeAttr("data-shortcode");var n=e.find(".caption").text(),r=parseInt(t.attr("width"),10),i=parseInt(t.attr("height"),10),a=e.data("url"),s={url:a,thumbnail:t.prop("src"),class:e.prop("class"),width:isNaN(r)?null:r,height:isNaN(i)?null:i,caption:n},l=p.default.serialise({name:"embed",properties:s,wrapped:!0,content:a});e.replaceWith(l)}),e.content=t.html()}),e.on("BeforeSetContent",function(e){for(var t=e.content,n=p.default.match("embed",!0,t);n;){var r=n.properties,i=(0,o.default)("<div/>").attr("data-url",r.url||n.content).attr("data-shortcode","embed").addClass(r.class).addClass("ss-htmleditorfield-file embed"),a=(0,o.default)("<img />").attr("src",r.thumbnail).addClass("placeholder");if(r.width&&(i.width(r.width),a.attr("width",r.width)),r.height&&a.attr("height",r.height),i.append(a),r.caption){var s=(0,o.default)("<p />").addClass("caption").text(r.caption);i.append(s)}t=t.replace(n.original,(0,o.default)("<div/>").append(i).html()),n=p.default.match("embed",!0,t)}e.content=t})}};tinymce.PluginManager.add("ssembed",function(t){return e.init(t)})}(),o.default.entwine("ss",function(e){e(".js-injector-boot #insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){d.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this.setData({}),this._renderModal(!1)},_renderModal:function(e){var t=this,n=function(){return t.close()},r=function(){return t._handleInsert.apply(t,arguments)},i=function(){return t._handleCreate.apply(t,arguments)},o=function(){return t._handleLoadingError.apply(t,arguments)},a=this.getOriginalAttributes();d.default.render(s.default.createElement(b,{isOpen:e,onCreate:i,onInsert:r,onClosed:n,onLoadingError:o,bodyClassName:"modal__dialog",className:"insert-embed-react__dialog-wrapper",fileAttributes:a}),this[0])},_handleLoadingError:function(){this.setData({}),this.open()},_handleInsert:function(e){var t=this.getData();this.setData(Object.assign({Url:t.Url},e)),this.insertRemote(),this.close()},_handleCreate:function(e){this.setData(Object.assign({},this.getData(),e)),this.open()},getOriginalAttributes:function(){var t=this.getData(),n=this.getElement();if(!n)return t;var r=e(n.getEditor().getSelectedNode());if(!r.length)return t;var i=r.closest(v).add(r.filter(v));if(!i.length)return t;var o=i.find("img.placeholder");if(0===o.length)return t;var a=i.find(".caption").text(),s=parseInt(o.width(),10),l=parseInt(o.height(),10);return{Url:i.data("url")||t.Url,CaptionText:a,PreviewUrl:o.attr("src"),Width:isNaN(s)?null:s,Height:isNaN(l)?null:l,Placement:this.findPosition(i.prop("class"))}},findPosition:function(e){var t=["leftAlone","center","rightAlone","left","right"];if("string"!=typeof e)return"";var n=e.split(" ");return t.find(function(e){return n.indexOf(e)>-1})},insertRemote:function(){var t=this.getElement();if(!t)return!1;var n=t.getEditor();if(!n)return!1;var r=this.getData(),i=(0,o.default)("<div/>").attr("data-url",r.Url).attr("data-shortcode","embed").addClass(r.Placement).addClass("ss-htmleditorfield-file embed"),a=(0,o.default)("<img />").attr("src",r.PreviewUrl).addClass("placeholder");if(r.Width&&(i.width(r.Width),a.attr("width",r.Width)),r.Height&&a.attr("height",r.Height),i.append(a),r.CaptionText){var s=(0,o.default)("<p />").addClass("caption").text(r.CaptionText);i.append(s)}var l=e(n.getSelectedNode()),d=e(null);return l.length&&(d=l.filter(v),0===d.length&&(d=l.closest(v)),0===d.length&&(d=l.filter("img.placeholder"))),d.length?d.replaceWith(i):(n.repaint(),n.insertContent(e("<div />").append(i.clone()).html(),{skip_undo:1})),n.addUndo(),n.repaint(),!0}})})},0:function(e,t){e.exports=React},1:function(e,t){e.exports=i18n},10:function(e,t){e.exports=FormBuilderModal},15:function(e,t){e.exports=SchemaActions},2:function(e,t){e.exports=Injector},3:function(e,t){e.exports=ReactRedux},4:function(e,t){e.exports=Redux},5:function(e,t){e.exports=ReactDom},6:function(e,t){e.exports=jQuery},7:function(e,t){e.exports=ShortcodeSerialiser}});
>>>>>>> Fix tests

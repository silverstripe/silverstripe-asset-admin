<<<<<<< HEAD
<<<<<<< HEAD
!function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var r={};t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=177)}({0:function(e,t){e.exports=React},1:function(e,t){e.exports=i18n},152:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var r=e.config.sections.find(function(e){return e.name===_}),n=t.fileAttributes?t.fileAttributes.Url:"",i=r.form.remoteEditForm.schemaUrl,o=n&&i+"/?embedurl="+encodeURIComponent(n),a=r.form.remoteCreateForm.schemaUrl;return{sectionConfig:r,schemaUrl:o||a,targetUrl:n}}function l(e){return{actions:{schema:(0,m.bindActionCreators)(w,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.InsertEmbedModal=void 0;var d=function(){function e(e,t){var r=[],n=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(n=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){i=!0,o=e}finally{try{!n&&s.return&&s.return()}finally{if(i)throw o}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),u=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),c=r(1),f=n(c),p=r(0),h=n(p),m=r(8),v=r(4),b=r(36),g=n(b),y=r(54),w=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(y),_="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",P=function(e){function t(e){i(this,t);var r=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.handleSubmit=r.handleSubmit.bind(r),r}return a(t,e),u(t,[{key:"componentWillMount",value:function(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function(e){e.show&&!this.props.show&&this.setOverrides(e)}},{key:"componentWillUnmount",value:function(){this.clearOverrides()}},{key:"setOverrides",value:function(e){if(this.props.schemaUrl!==e.schemaUrl&&this.clearOverrides(),e.schemaUrl){var t=Object.assign({},e.fileAttributes);delete t.ID;var r={fields:Object.entries(t).map(function(e){var t=d(e,2);return{name:t[0],value:t[1]}})};this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,r)}}},{key:"getModalProps",value:function(){var e=Object.assign({handleSubmit:this.handleSubmit,onLoadingError:this.handleLoadingError,showErrorMessage:!0,responseClassBad:"alert alert-danger",identifier:"AssetAdmin.InsertEmbedModal"},this.props,{className:"insert-embed-modal "+this.props.className,bsSize:"lg",handleHide:this.props.onHide,title:this.props.targetUrl?f.default._t("AssetAdmin.EditTitle","Media from the web"):f.default._t("AssetAdmin.CreateTitle","Insert new media from the web")});return delete e.onHide,delete e.sectionConfig,delete e.onInsert,delete e.fileAttributes,e}},{key:"clearOverrides",value:function(){this.props.actions.schema.setSchemaStateOverrides(this.props.schemaUrl,null)}},{key:"handleLoadingError",value:function(e){"function"==typeof this.props.onLoadingError&&this.props.onLoadingError(e)}},{key:"handleSubmit",value:function(e,t){switch(t){case"action_addmedia":this.props.onCreate(e);break;case"action_insertmedia":this.props.onInsert(e);break;case"action_cancel":this.props.onHide()}return Promise.resolve()}},{key:"render",value:function(){return h.default.createElement(g.default,this.getModalProps())}}]),t}(p.Component);P.propTypes={sectionConfig:p.PropTypes.shape({url:p.PropTypes.string,form:p.PropTypes.object}),show:p.PropTypes.bool,onInsert:p.PropTypes.func.isRequired,onCreate:p.PropTypes.func.isRequired,fileAttributes:p.PropTypes.shape({Url:p.PropTypes.string,CaptionText:p.PropTypes.string,PreviewUrl:p.PropTypes.string,Placement:p.PropTypes.string,Width:p.PropTypes.number,Height:p.PropTypes.number}),onHide:p.PropTypes.func.isRequired,className:p.PropTypes.string,actions:p.PropTypes.object,schemaUrl:p.PropTypes.string.isRequired,targetUrl:p.PropTypes.string,onLoadingError:p.PropTypes.func},P.defaultProps={className:"",fileAttributes:{}},t.InsertEmbedModal=P,t.default=(0,v.connect)(s,l)(P)},177:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var o=function(){function e(e,t){var r=[],n=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(n=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){i=!0,o=e}finally{try{!n&&s.return&&s.return()}finally{if(i)throw o}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a=r(7),s=n(a),l=r(0),d=n(l),u=r(5),c=n(u),f=r(3),p=r(6),h=r(152),m=n(h),v=r(1),b=n(v),g=(0,p.provideInjector)(m.default),y='div[data-shortcode="embed"]';!function(){var e={init:function(e){var t=b.default._t("AssetAdmin.INSERT_VIA_URL","Insert media via URL");e.addButton("ssembed",{icon:"media",title:t,cmd:"ssembed"}),e.addMenuItem("ssembed",{icon:"media",text:t,cmd:"ssembed"}),e.addCommand("ssembed",function(){(0,s.default)("#"+e.id).entwine("ss").openEmbedDialog()}),e.on("BeforeExecCommand",function(t){var r=t.command,n=t.ui,i=t.value;"mceAdvMedia"!==r&&"mceAdvMedia"!==r||(t.preventDefault(),e.execCommand("ssembed",n,i))}),e.on("SaveContent",function(e){var t=(0,s.default)("<div>"+e.content+"</div>"),r=function(e){return Object.entries(e).map(function(e){var t=o(e,2),r=t[0],n=t[1];return n?r+'="'+n+'"':null}).filter(function(e){return null!==e}).join(" ")};t.find(y).each(function(){var e=(0,s.default)(this),t=e.find("img.placeholder");if(0===t.length)return e.removeAttr("data-url"),void e.removeAttr("data-shortcode");var n=e.find(".caption").text(),i=parseInt(t.attr("width"),10),o=parseInt(t.attr("height"),10),a=e.data("url"),l={url:a,thumbnail:t.prop("src"),class:e.prop("class"),width:isNaN(i)?null:i,height:isNaN(o)?null:o,caption:n},d="[embed "+r(l)+"]"+a+"[/embed]";e.replaceWith(d)}),e.content=t.html()}),e.on("BeforeSetContent",function(e){for(var t=e.content,r=/\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi,n=r.exec(t);n;){var o=function(e){return e.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(e,t){var r=t.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),n=r[1],o=r[2]||r[3]||r[4];return Object.assign({},e,i({},n,o))},{})}(n[1]),a=(0,s.default)("<div/>").attr("data-url",o.url||n[2]).attr("data-shortcode","embed").addClass(o.class).addClass("ss-htmleditorfield-file embed"),l=(0,s.default)("<img />").attr("src",o.thumbnail).addClass("placeholder");if(o.width&&(a.width(o.width),l.attr("width",o.width)),o.height&&l.attr("height",o.height),a.append(l),o.caption){var d=(0,s.default)("<p />").addClass("caption").text(o.caption);a.append(d)}t=t.replace(n[0],(0,s.default)("<div/>").append(a).html()),n=r.exec(t)}e.content=t})}};tinymce.PluginManager.add("ssembed",function(t){return e.init(t)})}(),s.default.entwine("ss",function(e){e("#insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){c.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this.setData({}),this._renderModal(!1)},_renderModal:function(e){var t=this,r=function(){return t.close()},n=function(){return t._handleInsert.apply(t,arguments)},i=function(){return t._handleCreate.apply(t,arguments)},o=function(){return t._handleLoadingError.apply(t,arguments)},a=window.ss.store,s=window.ss.apolloClient,l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:a,client:s},d.default.createElement(g,{show:e,onCreate:i,onInsert:n,onHide:r,onLoadingError:o,bodyClassName:"modal__dialog fill-height",className:"insert-embed-react__dialog-wrapper",fileAttributes:l})),this[0])},_handleLoadingError:function(){this.setData({}),this.open()},_handleInsert:function(e){var t=this.getData();this.setData(Object.assign({Url:t.Url},e)),this.insertRemote(),this.close()},_handleCreate:function(e){this.setData(Object.assign({},this.getData(),e)),this.open()},getOriginalAttributes:function(){var t=this.getData(),r=this.getElement();if(!r)return t;var n=e(r.getEditor().getSelectedNode());if(!n.length)return t;var i=n.closest(y).add(n.filter(y));if(!i.length)return t;var o=i.find("img.placeholder");if(0===o.length)return t;var a=i.find(".caption").text(),s=parseInt(o.width(),10),l=parseInt(o.height(),10);return{Url:i.data("url")||t.Url,CaptionText:a,PreviewUrl:o.attr("src"),Width:isNaN(s)?null:s,Height:isNaN(l)?null:l,Placement:this.findPosition(i.prop("class"))}},findPosition:function(e){var t=["leftAlone","center","rightAlone","left","right"];if("string"!=typeof e)return"";var r=e.split(" ");return t.find(function(e){return r.indexOf(e)>-1})},insertRemote:function(){var t=this.getElement();if(!t)return!1;var r=t.getEditor();if(!r)return!1;var n=this.getData(),i=(0,s.default)("<div/>").attr("data-url",n.Url).attr("data-shortcode","embed").addClass(n.Placement).addClass("ss-htmleditorfield-file embed"),o=(0,s.default)("<img />").attr("src",n.PreviewUrl).addClass("placeholder");if(n.Width&&(i.width(n.Width),o.attr("width",n.Width)),n.Height&&o.attr("height",n.Height),i.append(o),n.CaptionText){var a=(0,s.default)("<p />").addClass("caption").text(n.CaptionText);i.append(a)}var l=e(r.getSelectedNode()),d=e(null);return l.length&&(d=l.filter(y),0===d.length&&(d=l.closest(y)),0===d.length&&(d=l.filter("img.placeholder"))),d.length?d.replaceWith(i):(r.repaint(),r.insertContent(e("<div />").append(i.clone()).html(),{skip_undo:1})),r.addUndo(),r.repaint(),!0}})})},3:function(e,t){e.exports=ReactApollo},36:function(e,t){e.exports=FormBuilderModal},4:function(e,t){e.exports=ReactRedux},5:function(e,t){e.exports=ReactDom},54:function(e,t){e.exports=SchemaActions},6:function(e,t){e.exports=Injector},7:function(e,t){e.exports=jQuery},8:function(e,t){e.exports=Redux}});
=======
!function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var r={};t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=177)}({0:function(e,t){e.exports=React},1:function(e,t){e.exports=i18n},153:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var r=e.config.sections.find(function(e){return e.name===P}),n=t.fileAttributes?t.fileAttributes.Url:"",i=r.form.remoteEditForm.schemaUrl,o=n&&i+"/?embedurl="+encodeURIComponent(n),a=r.form.remoteCreateForm.schemaUrl;return{sectionConfig:r,schemaUrl:o||a,targetUrl:n}}function l(e){return{actions:{schema:(0,m.bindActionCreators)(w,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.InsertEmbedModal=void 0;var d=function(){function e(e,t){var r=[],n=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(n=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){i=!0,o=e}finally{try{!n&&s.return&&s.return()}finally{if(i)throw o}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),u=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),c=r(1),f=n(c),p=r(0),h=n(p),m=r(8),b=r(4),v=r(36),g=n(v),y=r(55),w=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(y),P="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",_=function(e){function t(e){i(this,t);var r=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.handleSubmit=r.handleSubmit.bind(r),r}return a(t,e),u(t,[{key:"componentWillMount",value:function(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function(e){e.show&&!this.props.show&&this.setOverrides(e)}},{key:"componentWillUnmount",value:function(){this.clearOverrides()}},{key:"setOverrides",value:function(e){if(this.props.schemaUrl!==e.schemaUrl&&this.clearOverrides(),e.schemaUrl){var t=Object.assign({},e.fileAttributes);delete t.ID;var r={fields:Object.entries(t).map(function(e){var t=d(e,2);return{name:t[0],value:t[1]}})};this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,r)}}},{key:"getModalProps",value:function(){var e=Object.assign({handleSubmit:this.handleSubmit,onLoadingError:this.handleLoadingError,showErrorMessage:!0,responseClassBad:"alert alert-danger",identifier:"AssetAdmin.InsertEmbedModal"},this.props,{className:"insert-embed-modal "+this.props.className,bsSize:"lg",handleHide:this.props.onHide,title:this.props.targetUrl?f.default._t("AssetAdmin.EditTitle","Media from the web"):f.default._t("AssetAdmin.CreateTitle","Insert new media from the web")});return delete e.onHide,delete e.sectionConfig,delete e.onInsert,delete e.fileAttributes,e}},{key:"clearOverrides",value:function(){this.props.actions.schema.setSchemaStateOverrides(this.props.schemaUrl,null)}},{key:"handleLoadingError",value:function(e){"function"==typeof this.props.onLoadingError&&this.props.onLoadingError(e)}},{key:"handleSubmit",value:function(e,t){switch(t){case"action_addmedia":this.props.onCreate(e);break;case"action_insertmedia":this.props.onInsert(e);break;case"action_cancel":this.props.onHide()}return Promise.resolve()}},{key:"render",value:function(){return h.default.createElement(g.default,this.getModalProps())}}]),t}(p.Component);_.propTypes={sectionConfig:p.PropTypes.shape({url:p.PropTypes.string,form:p.PropTypes.object}),show:p.PropTypes.bool,onInsert:p.PropTypes.func.isRequired,onCreate:p.PropTypes.func.isRequired,fileAttributes:p.PropTypes.shape({Url:p.PropTypes.string,CaptionText:p.PropTypes.string,PreviewUrl:p.PropTypes.string,Placement:p.PropTypes.string,Width:p.PropTypes.number,Height:p.PropTypes.number}),onHide:p.PropTypes.func.isRequired,className:p.PropTypes.string,actions:p.PropTypes.object,schemaUrl:p.PropTypes.string.isRequired,targetUrl:p.PropTypes.string,onLoadingError:p.PropTypes.func},_.defaultProps={className:"",fileAttributes:{}},t.InsertEmbedModal=_,t.default=(0,b.connect)(s,l)(_)},177:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var o=function(){function e(e,t){var r=[],n=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(n=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){i=!0,o=e}finally{try{!n&&s.return&&s.return()}finally{if(i)throw o}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a=r(7),s=n(a),l=r(0),d=n(l),u=r(5),c=n(u),f=r(3),p=r(6),h=r(153),m=n(h),b=(0,p.provideInjector)(m.default),v='div[data-shortcode="embed"]';!function(){var e={init:function(e){e.addButton("ssembed",{icon:"media",title:"Insert Embedded content",cmd:"ssembed"}),e.addMenuItem("ssembed",{icon:"media",text:"Insert Embedded content",cmd:"ssembed"}),e.addCommand("ssembed",function(){(0,s.default)("#"+e.id).entwine("ss").openEmbedDialog()}),e.on("BeforeExecCommand",function(t){var r=t.command,n=t.ui,i=t.value;"mceAdvMedia"!==r&&"mceAdvMedia"!==r||(t.preventDefault(),e.execCommand("ssembed",n,i))}),e.on("SaveContent",function(e){var t=(0,s.default)("<div>"+e.content+"</div>"),r=function(e){return Object.entries(e).map(function(e){var t=o(e,2),r=t[0],n=t[1];return n?r+'="'+n+'"':null}).filter(function(e){return null!==e}).join(" ")};t.find(v).each(function(){var e=(0,s.default)(this),t=e.find("img.placeholder");if(0===t.length)return e.removeAttr("data-url"),void e.removeAttr("data-shortcode");var n=e.find(".caption").text(),i=parseInt(t.attr("width"),10),o=parseInt(t.attr("height"),10),a=e.data("url"),l={url:a,thumbnail:t.prop("src"),class:e.prop("class"),width:isNaN(i)?null:i,height:isNaN(o)?null:o,caption:n},d="[embed "+r(l)+"]"+a+"[/embed]";e.replaceWith(d)}),e.content=t.html()}),e.on("BeforeSetContent",function(e){for(var t=e.content,r=/\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi,n=r.exec(t);n;){var o=function(e){return e.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(e,t){var r=t.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),n=r[1],o=r[2]||r[3]||r[4];return Object.assign({},e,i({},n,o))},{})}(n[1]),a=(0,s.default)("<div/>").attr("data-url",o.url||n[2]).attr("data-shortcode","embed").addClass(o.class).addClass("ss-htmleditorfield-file embed"),l=(0,s.default)("<img />").attr("src",o.thumbnail).addClass("placeholder");if(o.width&&(a.width(o.width),l.attr("width",o.width)),o.height&&l.attr("height",o.height),a.append(l),o.caption){var d=(0,s.default)("<p />").addClass("caption").text(o.caption);a.append(d)}t=t.replace(n[0],(0,s.default)("<div/>").append(a).html()),n=r.exec(t)}e.content=t})}};tinymce.PluginManager.add("ssembed",function(t){return e.init(t)})}(),s.default.entwine("ss",function(e){e("#insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){c.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this.setData({}),this._renderModal(!1)},_renderModal:function(e){var t=this,r=function(){return t.close()},n=function(){return t._handleInsert.apply(t,arguments)},i=function(){return t._handleCreate.apply(t,arguments)},o=function(){return t._handleLoadingError.apply(t,arguments)},a=window.ss.store,s=window.ss.apolloClient,l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:a,client:s},d.default.createElement(b,{show:e,onCreate:i,onInsert:n,onHide:r,onLoadingError:o,bodyClassName:"modal__dialog fill-height",className:"insert-embed-react__dialog-wrapper",fileAttributes:l})),this[0])},_handleLoadingError:function(){this.setData({}),this.open()},_handleInsert:function(e){var t=this.getData();this.setData(Object.assign({Url:t.Url},e)),this.insertRemote(),this.close()},_handleCreate:function(e){this.setData(Object.assign({},this.getData(),e)),this.open()},getOriginalAttributes:function(){var t=this.getData(),r=this.getElement();if(!r)return t;var n=e(r.getEditor().getSelectedNode());if(!n.length)return t;var i=n.closest(v).add(n.filter(v));if(!i.length)return t;var o=i.find("img.placeholder");if(0===o.length)return t;var a=i.find(".caption").text(),s=parseInt(o.width(),10),l=parseInt(o.height(),10);return{Url:i.data("url")||t.Url,CaptionText:a,PreviewUrl:o.attr("src"),Width:isNaN(s)?null:s,Height:isNaN(l)?null:l,Placement:this.findPosition(i.prop("class"))}},findPosition:function(e){var t=["leftAlone","center","rightAlone","left","right"];if("string"!=typeof e)return"";var r=e.split(" ");return t.find(function(e){return r.indexOf(e)>-1})},insertRemote:function(){var t=this.getElement();if(!t)return!1;var r=t.getEditor();if(!r)return!1;var n=this.getData(),i=(0,s.default)("<div/>").attr("data-url",n.Url).attr("data-shortcode","embed").addClass(n.Placement).addClass("ss-htmleditorfield-file embed"),o=(0,s.default)("<img />").attr("src",n.PreviewUrl).addClass("placeholder");if(n.Width&&(i.width(n.Width),o.attr("width",n.Width)),n.Height&&o.attr("height",n.Height),i.append(o),n.CaptionText){var a=(0,s.default)("<p />").addClass("caption").text(n.CaptionText);i.append(a)}var l=e(r.getSelectedNode()),d=e(null);return l.length&&(d=l.filter(v),0===d.length&&(d=l.closest(v)),0===d.length&&(d=l.filter("img.placeholder"))),d.length?d.replaceWith(i):(r.repaint(),r.insertContent(e("<div />").append(i.clone()).html(),{skip_undo:1})),r.addUndo(),r.repaint(),!0}})})},3:function(e,t){e.exports=ReactApollo},36:function(e,t){e.exports=FormBuilderModal},4:function(e,t){e.exports=ReactRedux},5:function(e,t){e.exports=ReactDom},55:function(e,t){e.exports=SchemaActions},6:function(e,t){e.exports=Injector},7:function(e,t){e.exports=jQuery},8:function(e,t){e.exports=Redux}});
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
/******/ 	return __webpack_require__(__webpack_require__.s = 177);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InsertEmbedModal = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _redux = __webpack_require__(8);

var _reactRedux = __webpack_require__(4);

var _FormBuilderModal = __webpack_require__(36);

var _FormBuilderModal2 = _interopRequireDefault(_FormBuilderModal);

var _SchemaActions = __webpack_require__(55);

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
      if (props.show && !this.props.show) {
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
        handleSubmit: this.handleSubmit,
        onLoadingError: this.handleLoadingError,
        showErrorMessage: true,
        responseClassBad: 'alert alert-danger',
        identifier: 'AssetAdmin.InsertEmbedModal'
      }, this.props, {
        className: 'insert-embed-modal ' + this.props.className,
        bsSize: 'lg',
        handleHide: this.props.onHide,
        title: this.props.targetUrl ? _i18n2.default._t('AssetAdmin.EditTitle', 'Media from the web') : _i18n2.default._t('AssetAdmin.CreateTitle', 'Insert new media from the web')
      });
      delete props.onHide;
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
            this.props.onHide();
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
  show: _react.PropTypes.bool,
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
  onHide: _react.PropTypes.func.isRequired,
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

exports.InsertEmbedModal = InsertEmbedModal;
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(InsertEmbedModal);

/***/ }),

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _jquery = __webpack_require__(7);

var _jquery2 = _interopRequireDefault(_jquery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactApollo = __webpack_require__(3);

var _Injector = __webpack_require__(6);

var _InsertEmbedModal = __webpack_require__(153);

var _InsertEmbedModal2 = _interopRequireDefault(_InsertEmbedModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var InjectableInsertEmbedModal = (0, _Injector.provideInjector)(_InsertEmbedModal2.default);
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
            return Object.assign({}, coll, _defineProperty({}, key, value));
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

      _reactDom2.default.render(_react2.default.createElement(
        _reactApollo.ApolloProvider,
        { store: store, client: client },
        _react2.default.createElement(InjectableInsertEmbedModal, {
          show: show,
          onCreate: handleCreate,
          onInsert: handleInsert,
          onHide: handleHide,
          onLoadingError: handleLoadingError,
          bodyClassName: 'modal__dialog fill-height',
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

/***/ 3:
/***/ (function(module, exports) {

module.exports = ReactApollo;

/***/ }),

/***/ 36:
/***/ (function(module, exports) {

module.exports = FormBuilderModal;

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = ReactRedux;

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = ReactDom;

/***/ }),

/***/ 55:
/***/ (function(module, exports) {

module.exports = SchemaActions;

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = Redux;

/***/ })

/******/ });
//# sourceMappingURL=TinyMCE_ssembed.js.map
>>>>>>> Add editor top message style

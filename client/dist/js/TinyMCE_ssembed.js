<<<<<<< HEAD
!function(e){function t(n){if(r[n])return r[n].exports
var i=r[n]={exports:{},id:n,loaded:!1}
return e[n].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var r={}
return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){"use strict"
function n(e){return e&&e.__esModule?e:{default:e}}function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var o=Object.assign||function(e){
for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},a=function(){function e(e,t){var r=[],n=!0,i=!1,o=void 0
try{for(var a=e[Symbol.iterator](),s;!(n=(s=a.next()).done)&&(r.push(s.value),!t||r.length!==t);n=!0);}catch(e){i=!0,o=e}finally{try{!n&&a.return&&a.return()}finally{if(i)throw o}}return r}return function(t,r){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,r)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),s=r(1),l=n(s),d=r(2),u=n(d),c=r(3),p=n(c),f=r(4),h=r(5),m=r(6),v=n(m),b=(0,h.provideInjector)(v.default),g='div[data-shortcode="embed"]'


!function(){var e={init:function e(t){t.addButton("ssembed",{icon:"media",title:"Insert Embedded content",cmd:"ssembed"}),t.addMenuItem("ssembed",{icon:"media",text:"Insert Embedded content",cmd:"ssembed"
}),t.addCommand("ssembed",function(){(0,l.default)("#"+t.id).entwine("ss").openEmbedDialog()}),t.on("BeforeExecCommand",function(e){var r=e.command,n=e.ui,i=e.value
"mceAdvMedia"!==r&&"mceAdvMedia"!==r||(e.preventDefault(),t.execCommand("ssembed",n,i))}),t.on("SaveContent",function(e){var t=(0,l.default)("<div>"+e.content+"</div>"),r=function e(t){return Object.entries(t).map(function(e){
var t=a(e,2),r=t[0],n=t[1]
return n?r+'="'+n+'"':null}).filter(function(e){return null!==e}).join(" ")}
t.find(g).each(function e(){var t=(0,l.default)(this),n=t.find("img.placeholder")
if(0===n.length)return t.removeAttr("data-url"),void t.removeAttr("data-shortcode")
var i=t.find(".caption").text(),o=parseInt(n.attr("width"),10),a=parseInt(n.attr("height"),10),s=t.data("url"),d={url:s,thumbnail:n.prop("src"),class:t.prop("class"),width:isNaN(o)?null:o,height:isNaN(a)?null:a,
caption:i},u="[embed "+r(d)+"]"+s+"[/embed]"
t.replaceWith(u)}),e.content=t.html()}),t.on("BeforeSetContent",function(e){for(var t=e.content,r=function e(t){return t.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(e,t){
var r=t.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),n=r[1],a=r[2]||r[3]||r[4]
return o({},e,i({},n,a))},{})},n=/\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi,a=n.exec(t);a;){var s=r(a[1]),d=(0,l.default)("<div/>").attr("data-url",s.url||a[2]).attr("data-shortcode","embed").addClass(s.class).addClass("ss-htmleditorfield-file embed"),u=(0,
l.default)("<img />").attr("src",s.thumbnail).addClass("placeholder")
if(s.width&&(d.width(s.width),u.attr("width",s.width)),s.height&&u.attr("height",s.height),d.append(u),s.caption){var c=(0,l.default)("<p />").addClass("caption").text(s.caption)
d.append(c)}t=t.replace(a[0],(0,l.default)("<div/>").append(d).html()),a=n.exec(t)}e.content=t})}}
tinymce.PluginManager.add("ssembed",function(t){return e.init(t)})}(),l.default.entwine("ss",function(e){e("#insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function e(){this._clearModal()

},_clearModal:function e(){p.default.unmountComponentAtNode(this[0])},open:function e(){this._renderModal(!0)},close:function e(){this.setData({}),this._renderModal(!1)},_renderModal:function e(t){var r=this,n=function e(){
return r.close()},i=function e(){return r._handleInsert.apply(r,arguments)},o=function e(){return r._handleCreate.apply(r,arguments)},a=function e(){return r._handleLoadingError.apply(r,arguments)},s=window.ss.store,l=window.ss.apolloClient,d=this.getOriginalAttributes()


p.default.render(u.default.createElement(f.ApolloProvider,{store:s,client:l},u.default.createElement(b,{show:t,onCreate:o,onInsert:i,onHide:n,onLoadingError:a,bodyClassName:"modal__dialog",className:"insert-embed-react__dialog-wrapper",
fileAttributes:d})),this[0])},_handleLoadingError:function e(){this.setData({}),this.open()},_handleInsert:function e(t){var r=this.getData()
this.setData(o({Url:r.Url},t)),this.insertRemote(),this.close()},_handleCreate:function e(t){this.setData(o({},this.getData(),t)),this.open()},getOriginalAttributes:function t(){var r=this.getData(),n=this.getElement()


if(!n)return r
var i=e(n.getEditor().getSelectedNode())
if(!i.length)return r
var o=i.closest(g).add(i.filter(g))
if(!o.length)return r
var a=o.find("img.placeholder")
if(0===a.length)return r
var s=o.find(".caption").text(),l=parseInt(a.width(),10),d=parseInt(a.height(),10)
return{Url:o.data("url")||r.Url,CaptionText:s,PreviewUrl:a.attr("src"),Width:isNaN(l)?null:l,Height:isNaN(d)?null:d,Placement:this.findPosition(o.prop("class"))}},findPosition:function e(t){var r=["leftAlone","center","rightAlone","left","right"]


if("string"!=typeof t)return""
var n=t.split(" ")
return r.find(function(e){return n.indexOf(e)>-1})},insertRemote:function t(){var r=this.getElement()
if(!r)return!1
var n=r.getEditor()
if(!n)return!1
var i=this.getData(),o=(0,l.default)("<div/>").attr("data-url",i.Url).attr("data-shortcode","embed").addClass(i.Placement).addClass("ss-htmleditorfield-file embed"),a=(0,l.default)("<img />").attr("src",i.PreviewUrl).addClass("placeholder")


if(i.Width&&(o.width(i.Width),a.attr("width",i.Width)),i.Height&&a.attr("height",i.Height),o.append(a),i.CaptionText){var s=(0,l.default)("<p />").addClass("caption").text(i.CaptionText)
o.append(s)}var d=e(n.getSelectedNode()),u=e(null)
return d.length&&(u=d.filter(g),0===u.length&&(u=d.closest(g)),0===u.length&&(u=d.filter("img.placeholder"))),u.length?u.replaceWith(o):(n.repaint(),n.insertContent(e("<div />").append(o.clone()).html(),{
skip_undo:1})),n.addUndo(),n.repaint(),!0}})})},function(e,t){e.exports=jQuery},function(e,t){e.exports=React},function(e,t){e.exports=ReactDom},function(e,t){e.exports=ReactApollo},function(e,t){e.exports=Injector

},function(e,t,r){"use strict"
function n(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])
return t.default=e,t}function i(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var r=e.config.sections.find(function(e){
return e.name===C}),n=t.fileAttributes?t.fileAttributes.Url:"",i=r.form.remoteEditForm.schemaUrl,o=n&&i+"/?embedurl="+encodeURIComponent(n),a=r.form.remoteCreateForm.schemaUrl,s=o||a
return{sectionConfig:r,schemaUrl:s,targetUrl:n}}function d(e){return{actions:{schema:(0,b.bindActionCreators)(_,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.InsertEmbedModal=void 0
var u=function(){function e(e,t){var r=[],n=!0,i=!1,o=void 0
try{for(var a=e[Symbol.iterator](),s;!(n=(s=a.next()).done)&&(r.push(s.value),!t||r.length!==t);n=!0);}catch(e){i=!0,o=e}finally{try{!n&&a.return&&a.return()}finally{if(i)throw o}}return r}return function(t,r){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,r)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},p=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),f=r(7),h=i(f),m=r(2),v=i(m),b=r(8),g=r(9),y=r(10),w=i(y),P=r(11),_=n(P),C="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",x=function(e){
function t(e){o(this,t)
var r=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return r.handleSubmit=r.handleSubmit.bind(r),r}return s(t,e),p(t,[{key:"componentWillMount",value:function e(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function e(t){t.show&&!this.props.show&&this.setOverrides(t)

}},{key:"componentWillUnmount",value:function e(){this.clearOverrides()}},{key:"setOverrides",value:function e(t){if(this.props.schemaUrl!==t.schemaUrl&&this.clearOverrides(),t.schemaUrl){var r=c({},t.fileAttributes)


delete r.ID
var n={fields:Object.entries(r).map(function(e){var t=u(e,2),r=t[0],n=t[1]
return{name:r,value:n}})}
this.props.actions.schema.setSchemaStateOverrides(t.schemaUrl,n)}}},{key:"getModalProps",value:function e(){var t=c({handleSubmit:this.handleSubmit,onLoadingError:this.handleLoadingError,showErrorMessage:!0,
responseClassBad:"alert alert-danger"},this.props,{className:"insert-embed-modal "+this.props.className,bsSize:"lg",handleHide:this.props.onHide,title:this.props.targetUrl?h.default._t("AssetAdmin.EditTitle","Media from the web"):h.default._t("AssetAdmin.CreateTitle","Insert new media from the web")
})
return delete t.onHide,delete t.sectionConfig,delete t.onInsert,delete t.fileAttributes,t}},{key:"clearOverrides",value:function e(){this.props.actions.schema.setSchemaStateOverrides(this.props.schemaUrl,null)

}},{key:"handleLoadingError",value:function e(t){"function"==typeof this.props.onLoadingError&&this.props.onLoadingError(t)}},{key:"handleSubmit",value:function e(t,r){switch(r){case"action_addmedia":this.props.onCreate(t)


break
case"action_insertmedia":this.props.onInsert(t)
break
case"action_cancel":this.props.onHide()}return Promise.resolve()}},{key:"render",value:function e(){return v.default.createElement(w.default,this.getModalProps())}}]),t}(m.Component)
x.propTypes={sectionConfig:m.PropTypes.shape({url:m.PropTypes.string,form:m.PropTypes.object}),show:m.PropTypes.bool,onInsert:m.PropTypes.func.isRequired,onCreate:m.PropTypes.func.isRequired,fileAttributes:m.PropTypes.shape({
Url:m.PropTypes.string,CaptionText:m.PropTypes.string,PreviewUrl:m.PropTypes.string,Placement:m.PropTypes.string,Width:m.PropTypes.number,Height:m.PropTypes.number}),onHide:m.PropTypes.func.isRequired,
className:m.PropTypes.string,actions:m.PropTypes.object,schemaUrl:m.PropTypes.string.isRequired,targetUrl:m.PropTypes.string,onLoadingError:m.PropTypes.func},x.defaultProps={className:"",fileAttributes:{}
},t.InsertEmbedModal=x,t.default=(0,g.connect)(l,d)(x)},function(e,t){e.exports=i18n},function(e,t){e.exports=Redux},function(e,t){e.exports=ReactRedux},function(e,t){e.exports=FormBuilderModal},function(e,t){
e.exports=SchemaActions}])
=======
!function(t){function e(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=163)}({0:function(t,e){t.exports=React},163:function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var i=function(){function t(t,e){var n=[],r=!0,a=!1,i=void 0;try{for(var o,d=t[Symbol.iterator]();!(r=(o=d.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){a=!0,i=t}finally{try{!r&&d.return&&d.return()}finally{if(a)throw i}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o=n(6),d=r(o),l=n(0),s=r(l),u=n(5),c=r(u),f=n(3),h='div[data-shortcode="embed"]';!function(){var t={init:function(t){t.addButton("ssembed",{icon:"media",title:"Insert Embedded content",cmd:"ssembed"}),t.addMenuItem("ssembed",{icon:"media",text:"Insert Embedded content",cmd:"ssembed"}),t.addCommand("ssembed",function(){(0,d.default)("#"+t.id).entwine("ss").openEmbedDialog()}),t.on("BeforeExecCommand",function(e){var n=e.command,r=e.ui,a=e.value;"mceAdvMedia"!==n&&"mceAdvMedia"!==n||(e.preventDefault(),t.execCommand("ssembed",r,a))}),t.on("SaveContent",function(t){var e=(0,d.default)("<div>"+t.content+"</div>"),n=function(t){return Object.entries(t).map(function(t){var e=i(t,2),n=e[0],r=e[1];return r?n+'="'+r+'"':null}).filter(function(t){return null!==t}).join(" ")};e.find(h).each(function(){var t=(0,d.default)(this),e=t.find("img.placeholder");if(0===e.length)return t.removeAttr("data-url"),void t.removeAttr("data-shortcode");var r=t.find(".caption").text(),a=parseInt(e.attr("width"),10),i=parseInt(e.attr("height"),10),o=t.data("url"),l={url:o,thumbnail:e.prop("src"),class:t.prop("class"),width:isNaN(a)?null:a,height:isNaN(i)?null:i,caption:r},s="[embed "+n(l)+"]"+o+"[/embed]";t.replaceWith(s)}),t.content=e.html()}),t.on("BeforeSetContent",function(t){for(var e=t.content,n=/\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi,r=n.exec(e);r;){var i=function(t){return t.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(t,e){var n=e.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),r=n[1],i=n[2]||n[3]||n[4];return Object.assign({},t,a({},r,i))},{})}(r[1]),o=(0,d.default)("<div/>").attr("data-url",i.url||r[2]).attr("data-shortcode","embed").addClass(i.class).addClass("ss-htmleditorfield-file embed"),l=(0,d.default)("<img />").attr("src",i.thumbnail).addClass("placeholder");if(i.width&&(o.width(i.width),l.attr("width",i.width)),i.height&&l.attr("height",i.height),o.append(l),i.caption){var s=(0,d.default)("<p />").addClass("caption").text(i.caption);o.append(s)}e=e.replace(r[0],(0,d.default)("<div/>").append(o).html()),r=n.exec(e)}t.content=e})}};tinymce.PluginManager.add("ssembed",function(e){return t.init(e)})}(),d.default.entwine("ss",function(t){t("#insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){c.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this.setData({}),this._renderModal(!1)},_renderModal:function(t){var e=this,n=function(){return e.close()},r=function(){return e._handleInsert.apply(e,arguments)},a=function(){return e._handleCreate.apply(e,arguments)},i=function(){return e._handleLoadingError.apply(e,arguments)},o=window.ss.store,d=window.ss.apolloClient,l=this.getOriginalAttributes(),u=window.InsertEmbedModal.default;if(!u)throw new Error("Invalid Insert embed modal component found");c.default.render(s.default.createElement(f.ApolloProvider,{store:o,client:d},s.default.createElement(u,{show:t,onCreate:a,onInsert:r,onHide:n,onLoadingError:i,bodyClassName:"modal__dialog",className:"insert-embed-react__dialog-wrapper",fileAttributes:l})),this[0])},_handleLoadingError:function(){this.setData({}),this.open()},_handleInsert:function(t){var e=this.getData();this.setData(Object.assign({Url:e.Url},t)),this.insertRemote(),this.close()},_handleCreate:function(t){this.setData(Object.assign({},this.getData(),t)),this.open()},getOriginalAttributes:function(){var e=this.getData(),n=this.getElement();if(!n)return e;var r=t(n.getEditor().getSelectedNode());if(!r.length)return e;var a=r.closest(h).add(r.filter(h));if(!a.length)return e;var i=a.find("img.placeholder");if(0===i.length)return e;var o=a.find(".caption").text(),d=parseInt(i.width(),10),l=parseInt(i.height(),10);return{Url:a.data("url")||e.Url,CaptionText:o,PreviewUrl:i.attr("src"),Width:isNaN(d)?null:d,Height:isNaN(l)?null:l,Placement:this.findPosition(a.prop("class"))}},findPosition:function(t){var e=["leftAlone","center","rightAlone","left","right"];if("string"!=typeof t)return"";var n=t.split(" ");return e.find(function(t){return n.indexOf(t)>-1})},insertRemote:function(){var e=this.getElement();if(!e)return!1;var n=e.getEditor();if(!n)return!1;var r=this.getData(),a=(0,d.default)("<div/>").attr("data-url",r.Url).attr("data-shortcode","embed").addClass(r.Placement).addClass("ss-htmleditorfield-file embed"),i=(0,d.default)("<img />").attr("src",r.PreviewUrl).addClass("placeholder");if(r.Width&&(a.width(r.Width),i.attr("width",r.Width)),r.Height&&i.attr("height",r.Height),a.append(i),r.CaptionText){var o=(0,d.default)("<p />").addClass("caption").text(r.CaptionText);a.append(o)}var l=t(n.getSelectedNode()),s=t(null);return l.length&&(s=l.filter(h),0===s.length&&(s=l.closest(h)),0===s.length&&(s=l.filter("img.placeholder"))),s.length?s.replaceWith(a):(n.repaint(),n.insertContent(t("<div />").append(a.clone()).html(),{skip_undo:1})),n.addUndo(),n.repaint(),!0}})})},3:function(t,e){t.exports=ReactApollo},5:function(t,e){t.exports=ReactDom},6:function(t,e){t.exports=jQuery}});
>>>>>>> Enhancement shift webpack to use the shared silverstripe config module

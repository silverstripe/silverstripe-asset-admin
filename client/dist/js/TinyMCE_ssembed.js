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

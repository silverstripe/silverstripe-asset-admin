!function(e){function t(r){if(n[r])return n[r].exports
var a=n[r]={exports:{},id:r,loaded:!1}
return e[r].call(a.exports,a,a.exports,t),a.loaded=!0,a.exports}var n={}
return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var o=Object.assign||function(e){
for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=n(1),d=r(i),s=n(2),u=r(s),l=n(3),c=r(l),f=n(4)
!function(){var e={init:function e(t){t.addButton("ssembed",{icon:"media",title:"Insert Embedded content",cmd:"ssembed"}),t.addMenuItem("ssembed",{icon:"media",text:"Insert Embedded content",cmd:"ssembed"
}),t.addCommand("ssembed",function(){(0,d.default)("#"+t.id).entwine("ss").openEmbedDialog()}),t.on("BeforeExecCommand",function(e){var n=e.command,r=e.ui,a=e.value
"mceAdvMedia"!==n&&"mceAdvMedia"!==n||(e.preventDefault(),t.execCommand("ssembed",r,a))}),t.on("SaveContent",function(e){var t=(0,d.default)(e.content),n=function e(t){return Object.keys(t).map(function(e){
return t[e]?e+'="'+t[e]+'"':null}).filter(function(e){return null!==e}).join(" ")}
t.find(".ss-htmleditorfield-file.embed").each(function(){var e=(0,d.default)(this),t={width:e.attr("width"),class:e.attr("cssclass"),thumbnail:e.data("thumbnail")},r="[embed "+n(t)+"]"+e.data("url")+"[/embed]"


e.replaceWith(r)}),e.content="",t.each(function(){void 0!==this.outerHTML&&(e.content+=this.outerHTML)})}),t.on("BeforeSetContent",function(e){for(var t=null,n=e.content,r=function e(t){return t.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(e,t){
var n=t.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),r=n[1],i=n[2]||n[3]||n[4]
return o({},e,a({},r,i))},{})},i=/\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi,s=function e(){var a=r(t[1]),o=(0,d.default)("<img/>").attr({src:a.thumbnail,width:a.width,height:a.height,class:a.class,"data-url":t[2]
}).addClass("ss-htmleditorfield-file embed")
a.cssclass=a.class,Object.keys(a).forEach(function(e){return o.attr("data-"+e,a[e])}),n=n.replace(t[0],(0,d.default)("<div/>").append(o).html())};t=i.exec(n);)s()
e.content=n})}}
tinymce.PluginManager.add("ssembed",function(t){return e.init(t)})}(),d.default.entwine("ss",function(e){e("#insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function e(){this._clearModal()

},_clearModal:function e(){c.default.unmountComponentAtNode(this[0])},open:function e(){this._renderModal(!0)},close:function e(){this._renderModal(!1)},_renderModal:function e(t){var n=this,r=function e(){
return n.close()},a=function e(){return n._handleInsert.apply(n,arguments)},o=window.ss.store,i=window.ss.apolloClient,d=this.getOriginalAttributes(),s=window.InsertEmbedModal.default
if(!s)throw new Error("Invalid Insert embed modal component found")
c.default.render(u.default.createElement(f.ApolloProvider,{store:o,client:i},u.default.createElement(s,{title:!1,show:t,onInsert:a,onHide:r,bodyClassName:"modal__dialog",className:"insert-embed-react__dialog-wrapper",
attributes:d})),this[0])},setUrl:function e(t){this.setData(o({},this.getData(),{url:t}))},_handleInsert:function e(t){this.setData(o({},t))},getOriginalAttributes:function t(){var n=this.getElement()
if(!n)return{}
var r=n.getEditor().getSelectedNode()
if(!r)return{}
var a=e(r),o=this.getData()
return{url:a.data("url")||o.url}}})})},function(e,t){e.exports=jQuery},function(e,t){e.exports=React},function(e,t){e.exports=ReactDom},function(e,t){e.exports=ReactApollo}])

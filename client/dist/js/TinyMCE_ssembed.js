!function(t){function e(r){if(n[r])return n[r].exports
var a=n[r]={exports:{},id:r,loaded:!1}
return t[r].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var n={}
return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict"
function r(t){return t&&t.__esModule?t:{default:t}}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var i=Object.assign||function(t){
for(var e=1;e<arguments.length;e++){var n=arguments[e]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},o=function(){function t(t,e){var n=[],r=!0,a=!1,i=void 0
try{for(var o=t[Symbol.iterator](),d;!(r=(d=o.next()).done)&&(n.push(d.value),!e||n.length!==e);r=!0);}catch(t){a=!0,i=t}finally{try{!r&&o.return&&o.return()}finally{if(a)throw i}}return n}return function(e,n){
if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return t(e,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),d=n(1),l=r(d),s=n(2),u=r(s),c=n(3),f=r(c),h=n(4),p='div[data-shortcode="embed"]'
!function(){var t={init:function t(e){e.addButton("ssembed",{icon:"media",title:"Insert Embedded content",cmd:"ssembed"}),e.addMenuItem("ssembed",{icon:"media",text:"Insert Embedded content",cmd:"ssembed"
}),e.addCommand("ssembed",function(){(0,l.default)("#"+e.id).entwine("ss").openEmbedDialog()}),e.on("BeforeExecCommand",function(t){var n=t.command,r=t.ui,a=t.value
"mceAdvMedia"!==n&&"mceAdvMedia"!==n||(t.preventDefault(),e.execCommand("ssembed",r,a))}),e.on("SaveContent",function(t){var e=(0,l.default)(t.content),n=function t(e){return Object.entries(e).map(function(t){
var e=o(t,2),n=e[0],r=e[1]
return r?n+'="'+r+'"':null}).filter(function(t){return null!==t}).join(" ")}
e.find(p).add(e.filter(p)).each(function t(){var e=(0,l.default)(this),r=e.find("img.placeholder"),a=e.find(".caption").text(),i=parseInt(r.attr("width"),10),o=parseInt(r.attr("height"),10),d=e.data("url"),s={
url:d,thumbnail:r.prop("src"),class:e.prop("class"),width:isNaN(i)?null:i,height:isNaN(o)?null:o,caption:a},u="[embed "+n(s)+"]"+d+"[/embed]"
e.replaceWith(u)}),t.content="",e.each(function e(){void 0!==this.outerHTML&&(t.content+=this.outerHTML)})}),e.on("BeforeSetContent",function(t){for(var e=t.content,n=function t(e){return e.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(t,e){
var n=e.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),r=n[1],o=n[2]||n[3]||n[4]
return i({},t,a({},r,o))},{})},r=/\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi,o=r.exec(e);o;){var d=n(o[1]),s=(0,l.default)("<div/>").attr("data-url",d.url||o[2]).attr("data-shortcode","embed").addClass(d.class).addClass("ss-htmleditorfield-file embed"),u=(0,
l.default)("<img />").attr("src",d.thumbnail).addClass("placeholder")
if(d.width&&(s.width(d.width),u.attr("width",d.width)),d.height&&u.attr("height",d.height),s.append(u),d.caption){var c=(0,l.default)("<p />").addClass("caption").text(d.caption)
s.append(c)}e=e.replace(o[0],s.html()),o=r.exec(e)}t.content=e})}}
tinymce.PluginManager.add("ssembed",function(e){return t.init(e)})}(),l.default.entwine("ss",function(t){t("#insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function t(){this._clearModal()

},_clearModal:function t(){f.default.unmountComponentAtNode(this[0])},open:function t(){this._renderModal(!0)},close:function t(){this.setData({}),this._renderModal(!1)},_renderModal:function t(e){var n=this,r=function t(){
return n.close()},a=function t(){return n._handleInsert.apply(n,arguments)},i=function t(){return n._handleCreate.apply(n,arguments)},o=function t(){return n._handleLoadingError.apply(n,arguments)},d=window.ss.store,l=window.ss.apolloClient,s=this.getOriginalAttributes(),c=window.InsertEmbedModal.default


if(!c)throw new Error("Invalid Insert embed modal component found")
f.default.render(u.default.createElement(h.ApolloProvider,{store:d,client:l},u.default.createElement(c,{show:e,onCreate:i,onInsert:a,onHide:r,onLoadingError:o,bodyClassName:"modal__dialog",className:"insert-embed-react__dialog-wrapper",
fileAttributes:s})),this[0])},_handleLoadingError:function t(){this.setData({}),this.open()},_handleInsert:function t(e){var n=this.getData()
this.setData(i({Url:n.Url},e)),this.insertRemote(),this.close()},_handleCreate:function t(e){this.setData(i({},this.getData(),e)),this.open()},getOriginalAttributes:function e(){var n=this.getData(),r=this.getElement()


if(!r)return n
var a=t(r.getEditor().getSelectedNode())
if(!a.length)return n
var i=a.closest(p).add(a.filter(p))
if(!i.length)return n
var o=i.children("img.placeholder"),d=i.children(".caption").text(),l=parseInt(o.width(),10),s=parseInt(o.height(),10)
return{Url:i.data("url")||n.Url,CaptionText:d,PreviewUrl:o.attr("src"),Width:isNaN(l)?null:l,Height:isNaN(s)?null:s,Placement:this.findPosition(i.prop("class"))}},findPosition:function t(e){var n=["leftAlone","center","rightAlone","left","right"]


if("string"!=typeof e)return""
var r=e.split(" ")
return n.find(function(t){return r.indexOf(t)>-1})},insertRemote:function e(){var n=this.getElement()
if(!n)return!1
var r=n.getEditor()
if(!r)return!1
var a=this.getData(),i=(0,l.default)("<div/>").attr("data-url",a.Url).attr("data-shortcode","embed").addClass(a.Placement).addClass("ss-htmleditorfield-file embed"),o=(0,l.default)("<img />").attr("src",a.PreviewUrl).addClass("placeholder")


if(a.Width&&(i.width(a.Width),o.attr("width",a.Width)),a.Height&&o.attr("height",a.Height),i.append(o),a.CaptionText){var d=(0,l.default)("<p />").addClass("caption").text(a.CaptionText)
i.append(d)}var s=t(r.getSelectedNode()),u=t(null)
return s.length&&(u=s.filter(p),0===u.length&&(u=s.closest(p)),0===u.length&&(u=s.filter("img.placeholder"))),u.length?u.replaceWith(i):(r.repaint(),r.insertContent(t("<div />").append(i.clone()).html(),{
skip_undo:1})),r.addUndo(),r.repaint(),!0}})})},function(t,e){t.exports=jQuery},function(t,e){t.exports=React},function(t,e){t.exports=ReactDom},function(t,e){t.exports=ReactApollo}])

!function(t){function e(r){if(n[r])return n[r].exports
var a=n[r]={exports:{},id:r,loaded:!1}
return t[r].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var n={}
return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict"
function r(t){return t&&t.__esModule?t:{default:t}}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var i=Object.assign||function(t){
for(var e=1;e<arguments.length;e++){var n=arguments[e]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},l=function(){function t(t,e){var n=[],r=!0,a=!1,i=void 0
try{for(var l=t[Symbol.iterator](),o;!(r=(o=l.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){a=!0,i=t}finally{try{!r&&l.return&&l.return()}finally{if(a)throw i}}return n}return function(e,n){
if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return t(e,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o=n(1),s=r(o),d=n(2),c=r(d),u=n(3),h=r(u),m=n(4)
!function(){var t={init:function t(e){e.addButton("ssembed",{icon:"media",title:"Insert Embedded content",cmd:"ssembed"}),e.addMenuItem("ssembed",{icon:"media",text:"Insert Embedded content",cmd:"ssembed"
}),e.addCommand("ssembed",function(){(0,s.default)("#"+e.id).entwine("ss").openEmbedDialog()}),e.on("BeforeExecCommand",function(t){var n=t.command,r=t.ui,a=t.value
"mceAdvMedia"!==n&&"mceAdvMedia"!==n||(t.preventDefault(),e.execCommand("ssembed",r,a))}),e.on("SaveContent",function(t){var e=(0,s.default)(t.content),n=function t(e){return Object.entries(e).map(function(t){
var e=l(t,2),n=e[0],r=e[1]
return r?n+'="'+r+'"':null}).filter(function(t){return null!==t}).join(" ")}
e.find(".ss-htmleditorfield-file.embed").add(e.filter(".ss-htmleditorfield-file.embed")).each(function t(){var e=(0,s.default)(this),r=parseInt(e.attr("width"),10),a=parseInt(e.attr("height"),10),i={Url:e.data("url"),
AltText:e.attr("alt"),Title:e.attr("title"),PreviewUrl:e.attr("src"),Width:isNaN(r)?0:r,Height:isNaN(a)?0:a,Placement:e.data("cssclass"),thumbnail:e.attr("src"),class:e.attr("class")},l="[embed "+n(i)+"]"+e.data("url")+"[/embed]"


e.replaceWith(l)}),t.content="",e.each(function e(){void 0!==this.outerHTML&&(t.content+=this.outerHTML)})}),e.on("BeforeSetContent",function(t){for(var e=t.content,n=function t(e){return e.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(t,e){
var n=e.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),r=n[1],l=n[2]||n[3]||n[4]
return i({},t,a({},r,l))},{})},r=/\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi,l=r.exec(e);l;){var o=n(l[1]),d={src:o.PreviewUrl||o.thumbnail,width:o.Width||o.width,height:o.Height||o.height,class:o.class,alt:o.AltText,
title:o.Title,"data-url":o.Url||l[2],"data-cssclass":o.Placement||o.class},c=(0,s.default)("<img/>").attr(d).addClass("ss-htmleditorfield-file embed")
c.addClass(o.Placement),e=e.replace(l[0],(0,s.default)("<div/>").append(c).html()),l=r.exec(e)}t.content=e})}}
tinymce.PluginManager.add("ssembed",function(e){return t.init(e)})}(),s.default.entwine("ss",function(t){t("#insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function t(){this._clearModal()

},_clearModal:function t(){h.default.unmountComponentAtNode(this[0])},open:function t(){this._renderModal(!0)},close:function t(){this.setData({}),this._renderModal(!1)},_renderModal:function t(e){var n=this,r=function t(){
return n.close()},a=function t(){return n._handleInsert.apply(n,arguments)},i=function t(){return n._handleCreate.apply(n,arguments)},l=function t(){return n._handleLoadingError.apply(n,arguments)},o=window.ss.store,s=window.ss.apolloClient,d=this.getOriginalAttributes(),u=window.InsertEmbedModal.default


if(!u)throw new Error("Invalid Insert embed modal component found")
h.default.render(c.default.createElement(m.ApolloProvider,{store:o,client:s},c.default.createElement(u,{title:!1,show:e,onCreate:i,onInsert:a,onHide:r,onLoadingError:l,bodyClassName:"modal__dialog",className:"insert-embed-react__dialog-wrapper",
fileAttributes:d})),this[0])},_handleLoadingError:function t(){this.setData({}),this.open()},_handleInsert:function t(e){var n=this.getData()
this.setData(i({Url:n.Url},e)),this.insertRemote(),this.close()},_handleCreate:function t(e){this.setData(i({},this.getData(),e)),this.open()},getOriginalAttributes:function e(){var n=this.getElement()


if(!n)return{}
var r=t(n.getEditor().getSelectedNode())
if(!r.length)return{}
var a=this.getData(),i=r.parent(".captionImage"),l=t(null),o=t(null)
r.hasClass("captionImage")?r.children("img").length&&r.children(".caption").length&&(l=r,o=l.children("img")):i.length?i.children("img").length&&i.children(".caption").length&&(l=i,o=l.children("img")):r.is("img")&&(o=r)


var s=l.children(".caption").text(),d=parseInt(o.width(),10),c=parseInt(o.height(),10),u={Url:o.data("url")||a.Url,CaptionText:s,AltText:o.attr("alt"),Title:o.attr("title"),PreviewUrl:o.attr("src"),Width:isNaN(d)?0:d,
Height:isNaN(c)?0:c,Placement:o.data("cssclass")}
return u},insertRemote:function e(){var n=this.getElement()
if(!n)return!1
var r=n.getEditor()
if(!r)return!1
var a=t(r.getSelectedNode()),i=this.getData(),l={src:i.PreviewUrl,width:i.Width,height:i.Height,alt:i.AltText,title:i.Title,"data-url":i.Url,"data-cssclass":i.Placement},o=a.parent(".captionImage"),s=t('<div class="captionImage"><p class="caption"></p></div>'),d=t(null),c=t(null)


return a.hasClass("captionImage")?(a.children("img").length&&a.children(".caption").length&&(s=a,d=s.children("img")),c=a):o.length?(o.children("img").length&&o.children(".caption").length&&(s=o,d=s.children("img")),
c=o):a.is("img")&&(d=c=a),d.length||(d=t("<img />")),d.attr(l).attr("class",i.Placement+" ss-htmleditorfield-file embed"),i.CaptionText?s.prepend(d).attr("class",i.Placement+" captionImage").attr("width",i.Width).children(".caption").text(i.CaptionText):s=d,
c.length?c.not(s).length&&c.replaceWith(s):(r.repaint(),r.insertContent(t("<div/>").append(s.clone()).html(),{skip_undo:1})),r.addUndo(),r.repaint(),!0}})})},function(t,e){t.exports=jQuery},function(t,e){
t.exports=React},function(t,e){t.exports=ReactDom},function(t,e){t.exports=ReactApollo}])

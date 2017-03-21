!function(e){function t(r){if(n[r])return n[r].exports
var a=n[r]={exports:{},id:r,loaded:!1}
return e[r].call(a.exports,a,a.exports,t),a.loaded=!0,a.exports}var n={}
return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var i=Object.assign||function(e){
for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){var n=[],r=!0,a=!1,i=void 0
try{for(var l=e[Symbol.iterator](),o;!(r=(o=l.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){a=!0,i=e}finally{try{!r&&l.return&&l.return()}finally{if(a)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o=n(1),s=r(o),d=n(2),c=r(d),u=n(3),h=r(u),m=n(4)
!function(){var e={init:function e(t){t.addButton("ssembed",{icon:"media",title:"Insert Embedded content",cmd:"ssembed"}),t.addMenuItem("ssembed",{icon:"media",text:"Insert Embedded content",cmd:"ssembed"
}),t.addCommand("ssembed",function(){(0,s.default)("#"+t.id).entwine("ss").openEmbedDialog()}),t.on("BeforeExecCommand",function(e){var n=e.command,r=e.ui,a=e.value
"mceAdvMedia"!==n&&"mceAdvMedia"!==n||(e.preventDefault(),t.execCommand("ssembed",r,a))}),t.on("SaveContent",function(e){var t=(0,s.default)(e.content),n=function e(t){return Object.entries(t).map(function(e){
var t=l(e,2),n=t[0],r=t[1]
return r?n+'="'+r+'"':null}).filter(function(e){return null!==e}).join(" ")}
t.find(".ss-htmleditorfield-file.embed").add(t.filter(".ss-htmleditorfield-file.embed")).each(function e(){var t=(0,s.default)(this),r=parseInt(t.attr("width"),10),a=parseInt(t.attr("height"),10),i={Url:t.data("url"),
PreviewUrl:t.attr("src"),Width:isNaN(r)?0:r,Height:isNaN(a)?0:a,Placement:t.data("cssclass"),thumbnail:t.attr("src"),class:t.attr("class")},l="[embed "+n(i)+"]"+t.data("url")+"[/embed]"
t.replaceWith(l)}),e.content="",t.each(function t(){void 0!==this.outerHTML&&(e.content+=this.outerHTML)})}),t.on("BeforeSetContent",function(e){for(var t=e.content,n=function e(t){return t.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(e,t){
var n=t.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),r=n[1],l=n[2]||n[3]||n[4]
return i({},e,a({},r,l))},{})},r=/\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi,l=r.exec(t);l;){var o=n(l[1]),d={src:o.PreviewUrl||o.thumbnail,width:o.Width||o.width,height:o.Height||o.height,class:o.class,"data-url":o.Url||l[2],
"data-cssclass":o.Placement||o.class},c=(0,s.default)("<img/>").attr(d).addClass("ss-htmleditorfield-file embed")
c.addClass(o.Placement),t=t.replace(l[0],(0,s.default)("<div/>").append(c).html()),l=r.exec(t)}e.content=t})}}
tinymce.PluginManager.add("ssembed",function(t){return e.init(t)})}(),s.default.entwine("ss",function(e){e("#insert-embed-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function e(){this._clearModal()

},_clearModal:function e(){h.default.unmountComponentAtNode(this[0])},open:function e(){this._renderModal(!0)},close:function e(){this.setData({}),this._renderModal(!1)},_renderModal:function e(t){var n=this,r=function e(){
return n.close()},a=function e(){return n._handleInsert.apply(n,arguments)},i=function e(){return n._handleCreate.apply(n,arguments)},l=function e(){return n._handleLoadingError.apply(n,arguments)},o=window.ss.store,s=window.ss.apolloClient,d=this.getOriginalAttributes(),u=window.InsertEmbedModal.default


if(!u)throw new Error("Invalid Insert embed modal component found")
h.default.render(c.default.createElement(m.ApolloProvider,{store:o,client:s},c.default.createElement(u,{show:t,onCreate:i,onInsert:a,onHide:r,onLoadingError:l,bodyClassName:"modal__dialog",className:"insert-embed-react__dialog-wrapper",
fileAttributes:d})),this[0])},_handleLoadingError:function e(){this.setData({}),this.open()},_handleInsert:function e(t){var n=this.getData()
this.setData(i({Url:n.Url},t)),this.insertRemote(),this.close()},_handleCreate:function e(t){this.setData(i({},this.getData(),t)),this.open()},getOriginalAttributes:function t(){var n=this.getElement()


if(!n)return{}
var r=e(n.getEditor().getSelectedNode())
if(!r.length)return{}
var a=this.getData(),i=r.parent(".captionImage"),l=e(null),o=e(null)
r.hasClass("captionImage")?r.children("img").length&&r.children(".caption").length&&(l=r,o=l.children("img")):i.length?i.children("img").length&&i.children(".caption").length&&(l=i,o=l.children("img")):r.is("img")&&(o=r)


var s=l.children(".caption").text(),d=parseInt(o.width(),10),c=parseInt(o.height(),10),u={Url:o.data("url")||a.Url,CaptionText:s,PreviewUrl:o.attr("src"),Width:isNaN(d)?0:d,Height:isNaN(c)?0:c,Placement:o.data("cssclass")
}
return u},insertRemote:function t(){var n=this.getElement()
if(!n)return!1
var r=n.getEditor()
if(!r)return!1
var a=e(r.getSelectedNode()),i=this.getData(),l={src:i.PreviewUrl,width:i.Width,height:i.Height,"data-url":i.Url,"data-cssclass":i.Placement},o=a.parent(".captionImage"),s=e('<div class="captionImage"><p class="caption"></p></div>'),d=e(null),c=e(null)


return a.hasClass("captionImage")?(a.children("img").length&&a.children(".caption").length&&(s=a,d=s.children("img")),c=a):o.length?(o.children("img").length&&o.children(".caption").length&&(s=o,d=s.children("img")),
c=o):a.is("img")&&(d=c=a),d.length||(d=e("<img />")),d.attr(l).attr("class",i.Placement+" ss-htmleditorfield-file embed"),i.CaptionText?s.prepend(d).attr("class",i.Placement+" captionImage").attr("width",i.Width).children(".caption").text(i.CaptionText):s=d,
c.length?c.not(s).length&&c.replaceWith(s):(r.repaint(),r.insertContent(e("<div/>").append(s.clone()).html(),{skip_undo:1})),r.addUndo(),r.repaint(),!0}})})},function(e,t){e.exports=jQuery},function(e,t){
e.exports=React},function(e,t){e.exports=ReactDom},function(e,t){e.exports=ReactApollo}])

<<<<<<< HEAD
!function(t){function e(i){if(n[i])return n[i].exports
var a=n[i]={exports:{},id:i,loaded:!1}
return t[i].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var n={}
return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var r=Object.assign||function(t){
for(var e=1;e<arguments.length;e++){var n=arguments[e]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},o=n(1),s=i(o),l=n(7),d=i(l),c=n(2),u=i(c),f=n(3),m=i(f),p=n(4),h=n(5),g=n(12),v=i(g),x=(0,h.provideInjector)(v.default),I='img[data-shortcode="image"]'


!function(){var t={init:function t(e){e.addButton("ssmedia",{icon:"image",title:"Insert Media",cmd:"ssmedia"}),e.addMenuItem("ssmedia",{icon:"image",text:"Insert Media",cmd:"ssmedia"}),e.addCommand("ssmedia",function(){
(0,s.default)("#"+e.id).entwine("ss").openMediaDialog()}),e.on("BeforeExecCommand",function(t){var n=t.command,i=t.ui,a=t.value
"mceAdvImage"!==n&&"mceImage"!==n||(t.preventDefault(),e.execCommand("ssmedia",i,a))}),e.on("SaveContent",function(t){var e=(0,s.default)(t.content),n=function t(e){return Object.keys(e).map(function(t){
return e[t]?t+'="'+e[t]+'"':null}).filter(function(t){return null!==t}).join(" ")}
e.find(I).add(e.filter(I)).each(function(){var t=(0,s.default)(this),e={src:t.attr("src"),id:t.data("id"),width:t.attr("width"),height:t.attr("height"),class:t.attr("class"),title:t.attr("title"),alt:t.attr("alt")
},i="[image "+n(e)+"]"
t.replaceWith(i)}),t.content="",e.each(function(){void 0!==this.outerHTML&&(t.content+=this.outerHTML)})}),e.on("BeforeSetContent",function(t){for(var e=null,n=t.content,i=function t(e){return e.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(t,e){
var n=e.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),i=n[1],o=n[2]||n[3]||n[4]
return r({},t,a({},i,o))},{})},o=/\[image(.*?)]/gi;e=o.exec(n);){var l=i(e[1]),d=(0,s.default)("<img/>").attr(r({},l,{id:void 0,"data-id":l.id,"data-shortcode":"image"})).addClass("ss-htmleditorfield-file image")


n=n.replace(e[0],(0,s.default)("<div/>").append(d).html())}t.content=n})}}
tinymce.PluginManager.add("ssmedia",function(e){return t.init(e)})}(),s.default.entwine("ss",function(t){t(".insert-media-react__dialog-wrapper .nav-link").entwine({onclick:function t(e){return e.preventDefault()

}}),t("#insert-media-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function t(){this._clearModal()},_clearModal:function t(){m.default.unmountComponentAtNode(this[0])},open:function t(){
this._renderModal(!0)},close:function t(){this._renderModal(!1)},_renderModal:function t(e){var n=this,i=function t(){return n.close()},a=function t(){return n._handleInsert.apply(n,arguments)},r=window.ss.store,o=window.ss.apolloClient,s=this.getOriginalAttributes()


delete s.url,m.default.render(u.default.createElement(p.ApolloProvider,{store:r,client:o},u.default.createElement(x,{title:!1,show:e,onInsert:a,onHide:i,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",
fileAttributes:s})),this[0])},_handleInsert:function t(e,n){var i=!1
this.setData(r({},e,n))
try{var a=null
switch(a=n?n.category:"image"){case"image":i=this.insertImage()
break
default:i=this.insertFile()}}catch(t){this.statusMessage(t,"bad")}return i&&this.close(),Promise.resolve()},getOriginalAttributes:function e(){var n=this.getElement()
if(!n)return{}
var i=n.getEditor().getSelectedNode()
if(!i)return{}
var a=t(i),r=a.parent(".captionImage").find(".caption"),o={url:a.attr("src"),AltText:a.attr("alt"),InsertWidth:a.attr("width"),InsertHeight:a.attr("height"),TitleTooltip:a.attr("title"),Alignment:this.findPosition(a.attr("class")),
Caption:r.text(),ID:a.attr("data-id")}
return["InsertWidth","InsertHeight","ID"].forEach(function(t){o[t]="string"==typeof o[t]?parseInt(o[t],10):null}),o},findPosition:function t(e){var n=["leftAlone","center","rightAlone","left","right"]
return n.find(function(t){var n=new RegExp("\\b"+t+"\\b")
return n.test(e)})},getAttributes:function t(){var e=this.getData()
return{src:e.url,alt:e.AltText,width:e.InsertWidth,height:e.InsertHeight,title:e.TitleTooltip,class:e.Alignment,"data-id":e.ID,"data-shortcode":"image"}},getExtraData:function t(){var e=this.getData()
return{CaptionText:e&&e.Caption}},insertFile:function t(){return this.statusMessage(d.default._t("AssetAdmin.ERROR_OEMBED_REMOTE","Embed is only compatible with remote files"),"bad"),!1},insertImage:function e(){
var n=this.getElement()
if(!n)return!1
var i=n.getEditor()
if(!i)return!1
var a=t(i.getSelectedNode()),r=this.getAttributes(),o=this.getExtraData(),s=a&&a.is("img")?a:null
s&&s.parent().is(".captionImage")&&(s=s.parent())
var l=a&&a.is("img")?a:t("<img />")
l.attr(r).addClass("ss-htmleditorfield-file image")
var d=l.parent(".captionImage"),c=d.find(".caption")
o.CaptionText?(d.length||(d=t("<div></div>")),d.attr("class","captionImage "+r.class).removeAttr("data-mce-style").width(r.width),c.length||(c=t('<p class="caption"></p>').appendTo(d)),c.attr("class","caption "+r.class).text(o.CaptionText)):d=c=null


var u=d||l
return s&&s.not(u).length&&s.replaceWith(u),d&&d.prepend(l),s||(i.repaint(),i.insertContent(t("<div />").append(u).html(),{skip_undo:1})),i.addUndo(),i.repaint(),!0},statusMessage:function e(n,i){var a=t("<div/>").text(n).html()


t.noticeAdd({text:a,type:i,stayTime:5e3,inEffect:{left:"0",opacity:"show"}})}})})},function(t,e){t.exports=jQuery},function(t,e){t.exports=React},function(t,e){t.exports=ReactDom},function(t,e){t.exports=ReactApollo

},function(t,e){t.exports=Injector},,function(t,e){t.exports=i18n},,,,,function(t,e){t.exports=InsertMediaModal}])
=======
!function(t){function e(i){if(n[i])return n[i].exports;var a=n[i]={i:i,l:!1,exports:{}};return t[i].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=164)}({0:function(t,e){t.exports=React},164:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var r=n(6),o=i(r),s=n(2),l=i(s),d=n(0),c=i(d),u=n(5),f=i(u),m=n(3),g='img[data-shortcode="image"]';!function(){var t={init:function(t){t.addButton("ssmedia",{icon:"image",title:"Insert Media",cmd:"ssmedia"}),t.addMenuItem("ssmedia",{icon:"image",text:"Insert Media",cmd:"ssmedia"}),t.addCommand("ssmedia",function(){(0,o.default)("#"+t.id).entwine("ss").openMediaDialog()}),t.on("BeforeExecCommand",function(e){var n=e.command,i=e.ui,a=e.value;"mceAdvImage"!==n&&"mceImage"!==n||(e.preventDefault(),t.execCommand("ssmedia",i,a))}),t.on("SaveContent",function(t){var e=(0,o.default)(t.content),n=function(t){return Object.keys(t).map(function(e){return t[e]?e+'="'+t[e]+'"':null}).filter(function(t){return null!==t}).join(" ")};e.find(g).add(e.filter(g)).each(function(){var t=(0,o.default)(this),e={src:t.attr("src"),id:t.data("id"),width:t.attr("width"),height:t.attr("height"),class:t.attr("class"),title:t.attr("title"),alt:t.attr("alt")},i="[image "+n(e)+"]";t.replaceWith(i)}),t.content="",e.each(function(){void 0!==this.outerHTML&&(t.content+=this.outerHTML)})}),t.on("BeforeSetContent",function(t){for(var e=null,n=t.content,i=/\[image(.*?)]/gi;e=i.exec(n);){var r=function(t){return t.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(t,e){var n=e.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),i=n[1],r=n[2]||n[3]||n[4];return Object.assign({},t,a({},i,r))},{})}(e[1]),s=(0,o.default)("<img/>").attr(Object.assign({},r,{id:void 0,"data-id":r.id,"data-shortcode":"image"})).addClass("ss-htmleditorfield-file image");n=n.replace(e[0],(0,o.default)("<div/>").append(s).html())}t.content=n})}};tinymce.PluginManager.add("ssmedia",function(e){return t.init(e)})}(),o.default.entwine("ss",function(t){t(".insert-media-react__dialog-wrapper .nav-link").entwine({onclick:function(t){return t.preventDefault()}}),t("#insert-media-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){f.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this._renderModal(!1)},_renderModal:function(t){var e=this,n=function(){return e.close()},i=function(){return e._handleInsert.apply(e,arguments)},a=window.ss.store,r=window.ss.apolloClient,o=this.getOriginalAttributes(),s=window.InsertMediaModal.default;if(!s)throw new Error("Invalid Insert media modal component found");delete o.url,f.default.render(c.default.createElement(m.ApolloProvider,{store:a,client:r},c.default.createElement(s,{title:!1,show:t,onInsert:i,onHide:n,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",fileAttributes:o})),this[0])},_handleInsert:function(t,e){var n=!1;this.setData(Object.assign({},t,e));try{switch(e?e.category:"image"){case"image":n=this.insertImage();break;default:n=this.insertFile()}}catch(t){this.statusMessage(t,"bad")}return n&&this.close(),Promise.resolve()},getOriginalAttributes:function(){var e=this.getElement();if(!e)return{};var n=e.getEditor().getSelectedNode();if(!n)return{};var i=t(n),a=i.parent(".captionImage").find(".caption"),r={url:i.attr("src"),AltText:i.attr("alt"),InsertWidth:i.attr("width"),InsertHeight:i.attr("height"),TitleTooltip:i.attr("title"),Alignment:this.findPosition(i.attr("class")),Caption:a.text(),ID:i.attr("data-id")};return["InsertWidth","InsertHeight","ID"].forEach(function(t){r[t]="string"==typeof r[t]?parseInt(r[t],10):null}),r},findPosition:function(t){return["leftAlone","center","rightAlone","left","right"].find(function(e){return new RegExp("\\b"+e+"\\b").test(t)})},getAttributes:function(){var t=this.getData();return{src:t.url,alt:t.AltText,width:t.InsertWidth,height:t.InsertHeight,title:t.TitleTooltip,class:t.Alignment,"data-id":t.ID,"data-shortcode":"image"}},getExtraData:function(){var t=this.getData();return{CaptionText:t&&t.Caption}},insertFile:function(){return this.statusMessage(l.default._t("AssetAdmin.ERROR_OEMBED_REMOTE","Embed is only compatible with remote files"),"bad"),!1},insertImage:function(){var e=this.getElement();if(!e)return!1;var n=e.getEditor();if(!n)return!1;var i=t(n.getSelectedNode()),a=this.getAttributes(),r=this.getExtraData(),o=i&&i.is("img")?i:null;o&&o.parent().is(".captionImage")&&(o=o.parent());var s=i&&i.is("img")?i:t("<img />");s.attr(a).addClass("ss-htmleditorfield-file image");var l=s.parent(".captionImage"),d=l.find(".caption");r.CaptionText?(l.length||(l=t("<div></div>")),l.attr("class","captionImage "+a.class).removeAttr("data-mce-style").width(a.width),d.length||(d=t('<p class="caption"></p>').appendTo(l)),d.attr("class","caption "+a.class).text(r.CaptionText)):l=d=null;var c=l||s;return o&&o.not(c).length&&o.replaceWith(c),l&&l.prepend(s),o||(n.repaint(),n.insertContent(t("<div />").append(c).html(),{skip_undo:1})),n.addUndo(),n.repaint(),!0},statusMessage:function(e,n){var i=t("<div/>").text(e).html();t.noticeAdd({text:i,type:n,stayTime:5e3,inEffect:{left:"0",opacity:"show"}})}})})},2:function(t,e){t.exports=i18n},3:function(t,e){t.exports=ReactApollo},5:function(t,e){t.exports=ReactDom},6:function(t,e){t.exports=jQuery}});
>>>>>>> Enhancement shift webpack to use the shared silverstripe config module

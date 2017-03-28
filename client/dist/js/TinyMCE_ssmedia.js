!function(t){function e(i){if(n[i])return n[i].exports
var a=n[i]={exports:{},id:i,loaded:!1}
return t[i].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var n={}
return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var r=Object.assign||function(t){
for(var e=1;e<arguments.length;e++){var n=arguments[e]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},o=n(1),s=i(o),l=n(5),d=i(l),c=n(2),u=i(c),f=n(3),m=i(f),h=n(4),p='img[data-shortcode="image"]'
!function(){var t={init:function t(e){e.addButton("ssmedia",{icon:"image",title:"Insert Media",cmd:"ssmedia"}),e.addMenuItem("ssmedia",{icon:"image",text:"Insert Media",cmd:"ssmedia"}),e.addCommand("ssmedia",function(){
(0,s.default)("#"+e.id).entwine("ss").openMediaDialog()}),e.on("BeforeExecCommand",function(t){var n=t.command,i=t.ui,a=t.value
"mceAdvImage"!==n&&"mceImage"!==n||(t.preventDefault(),e.execCommand("ssmedia",i,a))}),e.on("SaveContent",function(t){var e=(0,s.default)(t.content),n=function t(e){return Object.keys(e).map(function(t){
return e[t]?t+'="'+e[t]+'"':null}).filter(function(t){return null!==t}).join(" ")}
e.find(p).add(e.filter(p)).each(function(){var t=(0,s.default)(this),e={src:t.attr("src"),id:t.data("id"),width:t.attr("width"),height:t.attr("height"),class:t.attr("class"),title:t.attr("title"),alt:t.attr("alt")
},i="[image "+n(e)+"]"
t.replaceWith(i)}),t.content="",e.each(function(){void 0!==this.outerHTML&&(t.content+=this.outerHTML)})}),e.on("BeforeSetContent",function(t){for(var e=null,n=t.content,i=function t(e){return e.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(t,e){
var n=e.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),i=n[1],o=n[2]||n[3]||n[4]
return r({},t,a({},i,o))},{})},o=/\[image(.*?)]/gi;e=o.exec(n);){var l=i(e[1]),d=(0,s.default)("<img/>").attr(r({},l,{id:void 0,"data-id":l.id,"data-shortcode":"image"})).addClass("ss-htmleditorfield-file image")


n=n.replace(e[0],(0,s.default)("<div/>").append(d).html())}t.content=n})}}
tinymce.PluginManager.add("ssmedia",function(e){return t.init(e)})}(),s.default.entwine("ss",function(t){t(".insert-media-react__dialog-wrapper .nav-link").entwine({onclick:function t(e){return e.preventDefault()

}}),t("#insert-media-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function t(){this._clearModal()},_clearModal:function t(){m.default.unmountComponentAtNode(this[0])},open:function t(){
this._renderModal(!0)},close:function t(){this._renderModal(!1)},_renderModal:function t(e){var n=this,i=function t(){return n.close()},a=function t(){return n._handleInsert.apply(n,arguments)},r=window.ss.store,o=window.ss.apolloClient,s=this.getOriginalAttributes(),l=window.InsertMediaModal.default


if(!l)throw new Error("Invalid Insert media modal component found")
delete s.url,m.default.render(u.default.createElement(h.ApolloProvider,{store:r,client:o},u.default.createElement(l,{title:!1,show:e,onInsert:a,onHide:i,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",
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
return{CaptionText:e&&e.Caption}},insertFile:function t(){return this.statusMessage(d.default._t("HTMLEditorField_Toolbar.ERROR_OEMBED_REMOTE","Embed is only compatible with remote files"),"bad"),!1},insertImage:function e(){
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

},function(t,e){t.exports=i18n}])

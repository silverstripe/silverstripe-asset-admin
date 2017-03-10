!function(t){function e(i){if(n[i])return n[i].exports
var a=n[i]={exports:{},id:i,loaded:!1}
return t[i].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var n={}
return e.m=t,e.c=n,e.p="",e(0)}([function(t,e){"use strict"
function n(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]


for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t}
!function(){var t={init:function t(e){e.addButton("ssmedia",{icon:"image",title:"Insert Media",cmd:"ssmedia"}),e.addMenuItem("ssmedia",{icon:"image",text:"Insert Media",cmd:"ssmedia"}),e.addCommand("ssmedia",function(){
window.jQuery("#"+e.id).entwine("ss").openMediaDialog()}),e.on("BeforeExecCommand",function(t){var n=t.command,i=t.ui,a=t.value
"mceAdvImage"!==n&&"mceImage"!==n||(t.preventDefault(),e.execCommand("ssmedia",i,a))}),e.on("SaveContent",function(t){var e=window.jQuery(t.content),n=function t(e){return Object.keys(e).map(function(t){
return e[t]?t+'="'+e[t]+'"':null}).filter(function(t){return null!==t}).join(" ")}
e.find(".ss-htmleditorfield-file.embed").each(function(){var t=window.jQuery(this),e={width:t.attr("width"),class:t.attr("cssclass"),thumbnail:t.data("thumbnail")},i="[embed "+n(e)+"]"+t.data("url")+"[/embed]"


t.replaceWith(i)}),e.find("img").each(function(){var t=window.jQuery(this),e={src:t.attr("src"),id:t.data("id"),width:t.attr("width"),height:t.attr("height"),class:t.attr("class"),title:t.attr("title"),
alt:t.attr("alt")},i="[image "+n(e)+"]"
t.replaceWith(i)}),t.content="",e.each(function(){void 0!==this.outerHTML&&(t.content+=this.outerHTML)})}),e.on("BeforeSetContent",function(t){for(var e=null,a=t.content,r=function t(e){return e.match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g).reduce(function(t,e){
var a=e.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/),r=a[1],s=a[2]||a[3]||a[4]
return i({},t,n({},r,s))},{})},s=/\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi,d=function t(){var n=r(e[1]),i=window.jQuery("<img/>").attr({src:n.thumbnail,width:n.width,height:n.height,class:n.class,"data-url":e[2]
}).addClass("ss-htmleditorfield-file embed")
n.cssclass=n.class,Object.keys(n).forEach(function(t){return i.attr("data-"+t,n[t])}),a=a.replace(e[0],window.jQuery("<div/>").append(i).html())};e=s.exec(a);)d()
for(var c=/\[image(.*?)]/gi;e=c.exec(a);){var o=r(e[1]),u=window.jQuery("<img/>").attr({src:o.src,width:o.width,height:o.height,class:o.class,alt:o.alt,title:o.title,"data-id":o.id})
a=a.replace(e[0],window.jQuery("<div/>").append(u).html())}t.content=a})}}
tinymce.PluginManager.add("ssmedia",function(e){return t.init(e)})}()}])

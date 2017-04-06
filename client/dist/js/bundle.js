!function(e){function t(r){if(n[r])return n[r].exports
var o=n[r]={exports:{},id:r,loaded:!1}
return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={}
return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict"
n(6),n(306),n(308),n(330),n(332)},function(e,t){e.exports=jQuery},function(e,t){e.exports=React},function(e,t){e.exports=ReactDom},function(e,t){e.exports=ReactApollo},function(e,t){e.exports=i18n},function(e,t,n){
(function(t){e.exports=t.InsertMediaModal=n(7)}).call(t,function(){return this}())},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=e.config.sections[F],r=t.fileAttributes?t.fileAttributes.ID:null,o=r&&n.form.fileInsertForm.schemaUrl+"/"+r


return{sectionConfig:n,schemaUrl:o}}function u(e){return{actions:{schema:(0,y.bindActionCreators)(P,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.InsertMediaModal=void 0
var p=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&s.return&&s.return()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(5),h=o(f),m=n(2),g=o(m),y=n(8),v=n(9),b=n(10),E=n(12),C=o(E),_=n(23),S=o(_),w=n(297),P=r(w),F="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",x=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSubmit=n.handleSubmit.bind(n),n.handleBrowse=n.handleBrowse.bind(n),n.getUrl=n.getUrl.bind(n),n.state={folderId:0,fileId:e.fileAttributes.ID,query:{}},n}return a(t,e),d(t,[{key:"componentWillMount",
value:function e(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function e(t){!t.show&&this.props.show&&this.setState({folderId:0,fileId:null,query:{}}),t.show&&!this.props.show&&t.fileAttributes.ID&&(this.setOverrides(t),
this.setState({folderId:0,fileId:t.fileAttributes.ID}))}},{key:"componentWillUnmount",value:function e(){this.setOverrides()}},{key:"setOverrides",value:function e(t){if(!t||this.props.schemaUrl!==t.schemaUrl){
var n=t&&t.schemaUrl||this.props.schemaUrl
n&&this.props.actions.schema.setSchemaStateOverrides(n,null)}if(t&&t.schemaUrl){var r=c({},t.fileAttributes)
delete r.ID
var o={fields:Object.entries(r).map(function(e){var t=p(e,2),n=t[0],r=t[1]
return{name:n,value:r}})}
this.props.actions.schema.setSchemaStateOverrides(t.schemaUrl,o)}}},{key:"getUrl",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=parseInt(t||0,10),i=parseInt(n||0,10),s=o!==this.getFolderId(),a=c({},r)


return(s||a.page<=1)&&delete a.page,(0,b.buildUrl)(this.props.sectionConfig.url,o,i,a)}},{key:"getFolderId",value:function e(){return parseInt(this.state.folderId||0,10)}},{key:"getFileId",value:function e(){
return parseInt(this.state.fileId||this.props.fileId,10)}},{key:"getSectionProps",value:function e(){return{dialog:!0,type:this.props.type,toolbarChildren:this.renderToolbarChildren(),sectionConfig:this.props.sectionConfig,
folderId:this.getFolderId(),fileId:this.getFileId(),query:this.state.query,getUrl:this.getUrl,onBrowse:this.handleBrowse,onSubmitEditor:this.handleSubmit}}},{key:"getModalProps",value:function e(){var t=c({},this.props,{
className:"insert-media-modal "+this.props.className,bsSize:"lg"})
return delete t.onHide,delete t.onInsert,delete t.sectionConfig,delete t.schemaUrl,t}},{key:"handleSubmit",value:function e(t,n,r,o){return this.props.onInsert(t,o)}},{key:"handleBrowse",value:function e(t,n){
var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}
this.setState({folderId:t,fileId:n,query:r})}},{key:"renderToolbarChildren",value:function e(){return g.default.createElement("button",{type:"button",className:"btn btn-secondary close insert-media-modal__close-button",
onClick:this.props.onHide,"aria-label":h.default._t("FormBuilderModal.CLOSE","Close")},g.default.createElement("span",{"aria-hidden":"true"},"×"))}},{key:"render",value:function e(){var t=this.getModalProps(),n=this.getSectionProps(),r=this.props.show?g.default.createElement(C.default,n):null


return g.default.createElement(S.default,t,r)}}]),t}(m.Component)
x.propTypes={sectionConfig:m.PropTypes.shape({url:m.PropTypes.string,form:m.PropTypes.object}),type:m.PropTypes.oneOf(["insert","select","admin"]),schemaUrl:m.PropTypes.string,show:m.PropTypes.bool,onInsert:m.PropTypes.func.isRequired,
fileAttributes:m.PropTypes.shape({ID:m.PropTypes.number,AltText:m.PropTypes.string,Width:m.PropTypes.number,Height:m.PropTypes.number,TitleTooltip:m.PropTypes.string,Alignment:m.PropTypes.string}),fileId:m.PropTypes.number,
onHide:m.PropTypes.func,className:m.PropTypes.string,actions:m.PropTypes.object},x.defaultProps={className:"",fileAttributes:{},type:"insert"},t.InsertMediaModal=x,t.default=(0,v.connect)(l,u)(x)},function(e,t){
e.exports=Redux},function(e,t){e.exports=ReactRedux},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t,n,r){var o=null


o=n?e+"/show/"+t+"/edit/"+n:t?e+"/show/"+t:e+"/"
var i=r&&Object.keys(r).length>0
return i&&(o=o+"?"+b.default.stringify(r)),o}function l(e){var t=e.config.sections[E]
return{sectionConfig:t}}Object.defineProperty(t,"__esModule",{value:!0}),t.buildUrl=t.AssetAdminRouter=void 0
var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(2),d=r(c),f=n(9),h=n(11),m=n(12),g=r(m),y=n(30),v=n(305),b=r(v),E="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",C=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleBrowse=n.handleBrowse.bind(n),n.getUrl=n.getUrl.bind(n),n}return s(t,e),p(t,[{key:"getUrl",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=parseInt(t||0,10),i=parseInt(n||0,10),s=o!==this.getFolderId(),l=u({},r)


return(s||l.page<=1)&&delete l.page,a(this.props.sectionConfig.url,o,i,l)}},{key:"getFolderId",value:function e(){return this.props.params&&this.props.params.folderId?parseInt(this.props.params.folderId,10):0

}},{key:"getFileId",value:function e(){return this.props.params&&this.props.params.fileId?parseInt(this.props.params.fileId,10):0}},{key:"getSectionProps",value:function e(){return{sectionConfig:this.props.sectionConfig,
type:"admin",folderId:this.getFolderId(),fileId:this.getFileId(),query:this.getQuery(),getUrl:this.getUrl,onBrowse:this.handleBrowse}}},{key:"getQuery",value:function e(){return(0,y.decodeQuery)(this.props.location.search)

}},{key:"handleBrowse",value:function e(t,n,r){var o=this.getUrl(t,n,r)
this.props.router.push(o)}},{key:"render",value:function e(){return this.props.sectionConfig?d.default.createElement(g.default,this.getSectionProps()):null}}]),t}(c.Component)
C.propTypes={sectionConfig:c.PropTypes.shape({url:c.PropTypes.string,limit:c.PropTypes.number,form:c.PropTypes.object}),location:c.PropTypes.shape({pathname:c.PropTypes.string,query:c.PropTypes.object,
search:c.PropTypes.string}),params:c.PropTypes.object,router:c.PropTypes.object},t.AssetAdminRouter=C,t.buildUrl=a,t.default=(0,h.withRouter)((0,f.connect)(l)(C))},function(e,t){e.exports=ReactRouter},function(e,t,n){
"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){return{securityId:e.config.SecurityID,
queuedFiles:e.assetAdmin.queuedFiles}}function p(e){return{actions:{gallery:(0,g.bindActionCreators)(w,e),breadcrumbsActions:(0,g.bindActionCreators)(F,e),queuedFiles:(0,g.bindActionCreators)(T,e)}}}Object.defineProperty(t,"__esModule",{
value:!0}),t.AssetAdmin=void 0
var c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(2),h=o(f),m=n(9),g=n(8),y=n(13),v=o(y),b=n(14),E=o(b),C=n(5),_=o(C),S=n(15),w=r(S),P=n(17),F=r(P),x=n(18),T=r(x),O=n(20),I=o(O),A=n(24),k=o(A),D=n(293),N=o(D),R=n(294),U=o(R),j=n(4),L=n(295),M=o(L),q=n(299),B=o(q),z=n(304),H=o(z),G=function(e){
function t(e){s(this,t)
var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleOpenFile=n.handleOpenFile.bind(n),n.handleCloseFile=n.handleCloseFile.bind(n),n.handleDelete=n.handleDelete.bind(n),n.handleDoSearch=n.handleDoSearch.bind(n),n.handleSubmitEditor=n.handleSubmitEditor.bind(n),
n.handleOpenFolder=n.handleOpenFolder.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.createEndpoint=n.createEndpoint.bind(n),n.handleBackButtonClick=n.handleBackButtonClick.bind(n),
n.handleFolderIcon=n.handleFolderIcon.bind(n),n.handleBrowse=n.handleBrowse.bind(n),n.handleViewChange=n.handleViewChange.bind(n),n.handleUpload=n.handleUpload.bind(n),n.handleCreateFolderSuccess=n.handleCreateFolderSuccess.bind(n),
n.handleMoveFilesSuccess=n.handleMoveFilesSuccess.bind(n),n.compare=n.compare.bind(n),n}return l(t,e),d(t,[{key:"componentWillMount",value:function e(){var t=this.props.sectionConfig
this.endpoints={historyApi:this.createEndpoint(t.historyEndpoint)}}},{key:"componentWillReceiveProps",value:function e(t){var n=this.compare(this.props.folder,t.folder);(n||(0,L.hasFilters)(t.query.filter)!==(0,
L.hasFilters)(this.props.query.filter))&&this.setBreadcrumbs(t)}},{key:"handleBrowse",value:function e(t,n,r){"function"==typeof this.props.onBrowse&&this.props.onBrowse(t,n,r),t!==this.props.folderId&&this.props.actions.gallery.deselectFiles()

}},{key:"handleSetPage",value:function e(t){this.handleBrowse(this.props.folderId,this.props.fileId,c({},this.props.query,{page:t}))}},{key:"handleDoSearch",value:function e(t){this.handleBrowse(t.currentFolderOnly?this.props.folderId:0,0,c({},this.getBlankQuery(),{
filter:t}))}},{key:"getBlankQuery",value:function e(){var t={}
return Object.keys(this.props.query).forEach(function(e){t[e]=void 0}),t}},{key:"handleSort",value:function e(t){this.handleBrowse(this.props.folderId,this.props.fileId,c({},this.props.query,{sort:t,limit:void 0,
page:void 0}))}},{key:"handleViewChange",value:function e(t){this.handleBrowse(this.props.folderId,this.props.fileId,c({},this.props.query,{view:t}))}},{key:"createEndpoint",value:function e(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]


return E.default.createEndpointFetcher(c({},t,n?{defaultData:{SecurityID:this.props.securityId}}:{}))}},{key:"handleBackButtonClick",value:function e(t){t.preventDefault(),this.props.folder?this.handleOpenFolder(this.props.folder.parentId||0):this.handleOpenFolder(0)

}},{key:"setBreadcrumbs",value:function e(t){var n=this,r=t.folder,o=t.query,i=[{text:_.default._t("AssetAdmin.FILES","Files"),href:this.props.getUrl&&this.props.getUrl(),onClick:function e(t){t.preventDefault(),
n.handleBrowse()}}]
r&&r.id&&(r.parents&&r.parents.forEach(function(e){i.push({text:e.title,href:n.props.getUrl&&n.props.getUrl(e.id),onClick:function t(r){r.preventDefault(),n.handleBrowse(e.id)}})}),i.push({text:r.title,
href:this.props.getUrl&&this.props.getUrl(r.id),onClick:function e(t){t.preventDefault(),n.handleBrowse(r.id)},icon:{className:"icon font-icon-edit-list",action:this.handleFolderIcon}})),(0,L.hasFilters)(o.filter)&&i.push({
text:_.default._t("LeftAndMain.SEARCHRESULTS","Search results")}),this.props.actions.breadcrumbsActions.setBreadcrumbs(i)}},{key:"compare",value:function e(t,n){return!!(t&&!n||n&&!t)||t&&n&&(t.id!==n.id||t.name!==n.name)

}},{key:"handleFolderIcon",value:function e(t){t.preventDefault(),this.handleOpenFile(this.props.folderId)}},{key:"handleOpenFile",value:function e(t){this.handleBrowse(this.props.folderId,t,this.props.query)

}},{key:"handleSubmitEditor",value:function e(t,n,r){var o=this,i=null
if("function"==typeof this.props.onSubmitEditor){var s=this.findFile(this.props.fileId)
i=this.props.onSubmitEditor(t,n,r,s)}else i=r()
if(!i)throw new Error("Promise was not returned for submitting")
return i.then(function(e){return o.props.actions.files.readFiles(),e})}},{key:"handleCloseFile",value:function e(){this.handleOpenFolder(this.props.folderId)}},{key:"handleOpenFolder",value:function e(t){
var n=c({},this.props.query)
delete n.page,delete n.filter,this.handleBrowse(t,null,n)}},{key:"handleDelete",value:function e(t){var n=this,r=this.findFile(t)
if(!r&&this.props.folder&&this.props.folder.id===t&&(r=this.props.folder),!r)throw new Error("File selected for deletion cannot be found: "+t)
var o=this.props.client.dataId({__typename:r.__typename,id:r.id})
return this.props.actions.files.deleteFile(r.id,o).then(function(){n.props.actions.gallery.deselectFiles([r.id]),r.queuedId&&n.props.actions.queuedFiles.removeQueuedFile(r.queuedId),r&&n.handleBrowse(r.parentId?r.parentId:0)

})}},{key:"findFile",value:function e(t){var n=[].concat(i(this.props.files),i(this.props.queuedFiles.items))
return n.find(function(e){return e.id===parseInt(t,10)})}},{key:"handleUpload",value:function e(){}},{key:"handleCreateFolderSuccess",value:function e(){this.props.actions.files.readFiles()}},{key:"handleMoveFilesSuccess",
value:function e(t,n){var r=this,o=this.props.queuedFiles.items.filter(function(e){return n.includes(e.id)})
o.forEach(function(e){e.queuedId&&r.props.actions.queuedFiles.removeQueuedFile(e.queuedId)}),this.props.actions.gallery.deselectFiles(),this.props.actions.files.readFiles()}},{key:"renderGallery",value:function e(){
var t=this.props.sectionConfig,n=t.createFileEndpoint.url,r=t.createFileEndpoint.method,o=this.props.query&&parseInt(this.props.query.limit||t.limit,10),i=this.props.query&&parseInt(this.props.query.page||1,10),s=this.props.query&&this.props.query.sort,a=this.props.query&&this.props.query.view,l=this.props.query&&this.props.query.filter||{}


return h.default.createElement(k.default,{files:this.props.files,fileId:this.props.fileId,folderId:this.props.folderId,folder:this.props.folder,type:this.props.type,limit:o,page:i,totalCount:this.props.filesTotalCount,
view:a,filters:l,createFileApiUrl:n,createFileApiMethod:r,onDelete:this.handleDelete,onOpenFile:this.handleOpenFile,onOpenFolder:this.handleOpenFolder,onSuccessfulUpload:this.handleUpload,onCreateFolderSuccess:this.handleCreateFolderSuccess,
onMoveFilesSuccess:this.handleMoveFilesSuccess,onSort:this.handleSort,onSetPage:this.handleSetPage,onViewChange:this.handleViewChange,sort:s,sectionConfig:t,loading:this.props.loading})}},{key:"renderEditor",
value:function e(){var t=this.props.sectionConfig,n=null
switch(this.props.type){case"insert":n=t.form.fileInsertForm.schemaUrl
break
case"select":n=t.form.fileSelectForm.schemaUrl
break
case"admin":default:n=t.form.fileEditForm.schemaUrl}return this.props.fileId?h.default.createElement(I.default,{className:"insert"===this.props.type?"editor--dialog":"",fileId:this.props.fileId,onClose:this.handleCloseFile,
editFileSchemaUrl:n,onSubmit:this.handleSubmitEditor,onDelete:this.handleDelete,addToCampaignSchemaUrl:t.form.addToCampaignForm.schemaUrl}):null}},{key:"render",value:function e(){var t=!!(this.props.folder&&this.props.folder.id||(0,
L.hasFilters)(this.props.query.filter)),n=this.props.sectionConfig.form.fileSearchForm.schemaUrl,r=this.props.query.filter||{}
return h.default.createElement("div",{className:"fill-height"},h.default.createElement(U.default,{showBackButton:t,handleBackButtonClick:this.handleBackButtonClick},h.default.createElement(N.default,{multiline:!0
}),h.default.createElement("div",{className:"asset-admin__toolbar-extra pull-xs-right fill-width"},h.default.createElement(M.default,{onSearch:this.handleDoSearch,id:"AssetSearchForm",searchFormSchemaUrl:n,
folderId:this.props.folderId,filters:r}),this.props.toolbarChildren)),h.default.createElement("div",{className:"flexbox-area-grow fill-width fill-height gallery"},this.renderGallery(),this.renderEditor()),"admin"!==this.props.type&&this.props.loading&&[h.default.createElement("div",{
key:"overlay",className:"cms-content-loading-overlay ui-widget-overlay-light"}),h.default.createElement("div",{key:"spinner",className:"cms-content-loading-spinner"})])}}]),t}(v.default)
G.propTypes={dialog:f.PropTypes.bool,sectionConfig:f.PropTypes.shape({url:f.PropTypes.string,limit:f.PropTypes.number,form:f.PropTypes.object}),fileId:f.PropTypes.number,folderId:f.PropTypes.number,onBrowse:f.PropTypes.func,
getUrl:f.PropTypes.func,query:f.PropTypes.shape({sort:f.PropTypes.string,limit:f.PropTypes.oneOfType([f.PropTypes.number,f.PropTypes.string]),page:f.PropTypes.oneOfType([f.PropTypes.number,f.PropTypes.string]),
filter:f.PropTypes.object}),onSubmitEditor:f.PropTypes.func,type:f.PropTypes.oneOf(["insert","select","admin"]),files:f.PropTypes.array,queuedFiles:f.PropTypes.shape({items:f.PropTypes.array.isRequired
}),filesTotalCount:f.PropTypes.number,folder:f.PropTypes.shape({id:f.PropTypes.number,title:f.PropTypes.string,parents:f.PropTypes.array,parentId:f.PropTypes.number,canView:f.PropTypes.bool,canEdit:f.PropTypes.bool
}),loading:f.PropTypes.bool,actions:f.PropTypes.object},G.defaultProps={type:"admin",query:{sort:"",limit:null,page:0,filter:{}}},t.AssetAdmin=G,t.default=(0,g.compose)((0,m.connect)(u,p),B.default,H.default,function(e){
return(0,j.withApollo)(e)})(G)},function(e,t){e.exports=SilverStripeComponent},function(e,t){e.exports=Backend},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return function(n){n({type:f.default.LOAD_FILE_SUCCESS,payload:{id:e,file:t}})}}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null


return function(t){return t({type:f.default.SELECT_FILES,payload:{ids:e}})}}function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null
return function(t){return t({type:f.default.DESELECT_FILES,payload:{ids:e}})}}function a(e){return function(t){return t({type:f.default.SET_NOTICE_MESSAGE,payload:{message:e}})}}function l(e){return function(t){
return t({type:f.default.SET_ERROR_MESSAGE,payload:{message:e}})}}function u(e){return function(t){return t({type:f.default.SET_ENABLE_DROPZONE,payload:{enableDropzone:e}})}}function p(e){return function(t){
t({type:f.default.CLEAR_FILE_BADGE,payload:{id:e}})}}function c(e,t,n,r){return function(o,i){var s=i(),a=s.assetAdmin,l=a.gallery.badges.find(function(t){return t.id===e})
l&&l.timer&&clearTimeout(l.timer)
var u=r>0?setTimeout(function(){return p(e)(o)},r):null
o({type:f.default.SET_FILE_BADGE,payload:{id:e,message:t,status:n,timer:u}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.loadFile=o,t.selectFiles=i,t.deselectFiles=s,t.setNoticeMessage=a,t.setErrorMessage=l,
t.setEnableDropzone=u,t.clearFileBadge=p,t.setFileBadge=c
var d=n(16),f=r(d)},function(e,t){"use strict"
function n(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0})
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}
t.default=["DESELECT_FILES","SELECT_FILES","LOAD_FILE_REQUEST","LOAD_FILE_SUCCESS","HIGHLIGHT_FILES","UPDATE_BATCH_ACTIONS","SET_NOTICE_MESSAGE","SET_ERROR_MESSAGE","SET_ENABLE_DROPZONE","SET_FILE_BADGE","CLEAR_FILE_BADGE"].reduce(function(e,t){
return r(e,n({},t,"GALLERY."+t))},{})},function(e,t){e.exports=BreadcrumbsActions},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e){return function(t){return t({type:c.default.ADD_QUEUED_FILE,payload:{file:e}})}}function i(e,t){return function(n){var r=t.message
return"string"==typeof t&&(r={value:t,type:"error"}),n({type:c.default.FAIL_UPLOAD,payload:{queuedId:e,message:r}})}}function s(){return function(e){return e({type:c.default.PURGE_UPLOAD_QUEUE,payload:null
})}}function a(e){return function(t){return t({type:c.default.REMOVE_QUEUED_FILE,payload:{queuedId:e}})}}function l(e,t){return function(n){return n({type:c.default.SUCCEED_UPLOAD,payload:{queuedId:e,json:t
}})}}function u(e,t){return function(n){return n({type:c.default.UPDATE_QUEUED_FILE,payload:{queuedId:e,updates:t}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addQueuedFile=o,t.failUpload=i,t.purgeUploadQueue=s,
t.removeQueuedFile=a,t.succeedUpload=l,t.updateQueuedFile=u
var p=n(19),c=r(p)},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.default={ADD_QUEUED_FILE:"ADD_QUEUED_FILE",FAIL_UPLOAD:"FAIL_UPLOAD",PURGE_UPLOAD_QUEUE:"PURGE_UPLOAD_QUEUE",REMOVE_QUEUED_FILE:"REMOVE_QUEUED_FILE",SUCCEED_UPLOAD:"SUCCEED_UPLOAD",
UPDATE_QUEUED_FILE:"UPDATE_QUEUED_FILE"}},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(5),u=r(l),p=n(2),c=r(p),d=n(21),f=r(d),h=n(22),m=r(h),g=n(23),y=r(g),v=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleCancelKeyDown=n.handleCancelKeyDown.bind(n),n.handleClose=n.handleClose.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n.handleAction=n.handleAction.bind(n),n.closeModal=n.closeModal.bind(n),
n.openModal=n.openModal.bind(n),n.state={openModal:!1},n}return s(t,e),a(t,[{key:"handleAction",value:function e(t,n){var r=t.currentTarget.name
return"action_addtocampaign"===r?(this.openModal(),void t.preventDefault()):"action_delete"===r?(confirm(u.default._t("AssetAdmin.CONFIRMDELETE"))&&this.props.onDelete(n.ID),void t.preventDefault()):void 0

}},{key:"handleCancelKeyDown",value:function e(t){t.keyCode!==f.default.SPACE_KEY_CODE&&t.keyCode!==f.default.RETURN_KEY_CODE||this.handleClose(t)}},{key:"handleSubmit",value:function e(t,n,r){return"function"==typeof this.props.onSubmit?this.props.onSubmit(t,n,r):r()

}},{key:"handleClose",value:function e(t){this.props.onClose(),this.closeModal(),t&&t.preventDefault()}},{key:"openModal",value:function e(){this.setState({openModal:!0})}},{key:"closeModal",value:function e(){
this.setState({openModal:!1})}},{key:"renderCancelButton",value:function e(){return c.default.createElement("a",{tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",
onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u.default._t("AssetAdmin.CANCEL")})}},{key:"renderCancelButton",value:function e(){return c.default.createElement("a",{
tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u.default._t("AssetAdmin.CANCEL")
})}},{key:"renderCancelButton",value:function e(){return c.default.createElement("a",{tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,
type:"button","aria-label":u.default._t("AssetAdmin.CANCEL")})}},{key:"render",value:function e(){var t=this.props.editFileSchemaUrl+"/"+this.props.fileId,n=this.props.addToCampaignSchemaUrl+"/"+this.props.fileId,r=["panel","panel--padded","panel--scrollable","form--no-dividers","editor"]


return this.props.className&&r.push(this.props.className),c.default.createElement("div",{className:r.join(" ")},c.default.createElement("div",{className:"editor__details"},c.default.createElement(m.default,{
schemaUrl:t,afterMessages:this.renderCancelButton(),handleSubmit:this.handleSubmit,handleAction:this.handleAction}),c.default.createElement(y.default,{show:this.state.openModal,handleHide:this.closeModal,
schemaUrl:n,bodyClassName:"modal__dialog",responseClassBad:"modal__response modal__response--error",responseClassGood:"modal__response modal__response--good"})))}}]),t}(p.Component)
v.propTypes={dialog:c.default.PropTypes.bool,className:c.default.PropTypes.string,fileId:c.default.PropTypes.number.isRequired,onClose:c.default.PropTypes.func.isRequired,onSubmit:c.default.PropTypes.func.isRequired,
onDelete:c.default.PropTypes.func.isRequired,editFileSchemaUrl:c.default.PropTypes.string.isRequired,addToCampaignSchemaUrl:c.default.PropTypes.string,openAddCampaignModal:c.default.PropTypes.bool},t.default=v

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(5),i=r(o)
t.default={MOVE_SUCCESS_DURATION:3e3,CSS_TRANSITION_TIME:300,SMALL_THUMBNAIL_HEIGHT:60,SMALL_THUMBNAIL_WIDTH:60,THUMBNAIL_HEIGHT:150,THUMBNAIL_WIDTH:200,BULK_ACTIONS:[{value:"delete",label:i.default._t("AssetAdmin.BULK_ACTIONS_DELETE","Delete"),
className:"font-icon-trash",destructive:!0,callback:null,canApply:function e(t){return t.reduce(function(e,t){return t&&t.canDelete&&e},!0)},confirm:function(e){function t(t){return e.apply(this,arguments)

}return t.toString=function(){return e.toString()},t}(function(e){return new Promise(function(t,n){var r=e.filter(function(e){return"folder"===e.type&&e.filesInUseCount>0})
if(r.length)return alert(i.default._t("AssetAdmin.BULK_ACTIONS_DELETE_FOLDER","These folders contain files which are currently in use, you must move or delete their contents before you can delete the folder.")),
void n("cancelled")
var o=e.filter(function(e){return"folder"!==e.type&&e.inUseCount>0}),s=i.default._t("AssetAdmin.BULK_ACTIONS_DELETE_CONFIRM","Are you sure you want to delete these files?")
1===e.length&&1===o.length&&(s=i.default.sprintf(i.default._t("AssetAdmin.BULK_ACTIONS_DELETE_SINGLE_CONFIRM","This file is currently in use in %s places, are you sure you want to delete it?"),e[0].inUseCount)),
o.length>1&&i.default.sprintf(i.default._t("AssetAdmin.BULK_ACTIONS_DELETE_MULTI_CONFIRM","There are %s files currently in use, are you sure you want to delete these files?"),o.length),confirm(s)?t():n("cancelled")

})})},{value:"edit",label:i.default._t("AssetAdmin.BULK_ACTIONS_EDIT","Edit"),className:"font-icon-edit",destructive:!1,canApply:function e(t){return 1===t.length},callback:null}],BULK_ACTIONS_PLACEHOLDER:i.default._t("AssetAdmin.BULK_ACTIONS_PLACEHOLDER"),
SPACE_KEY_CODE:32,RETURN_KEY_CODE:13,DEFAULT_PREVIEW:"framework/client/dist/images/app_icons/generic_92.png"}},function(e,t){e.exports=FormBuilderLoader},function(e,t){e.exports=FormBuilderModal},function(e,t,n){
"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){var t=e.assetAdmin.gallery,n=t.selectedFiles,r=t.errorMessage,o=t.noticeMessage,i=t.enableDropzone,s=t.badges


return{selectedFiles:n,errorMessage:r,noticeMessage:o,enableDropzone:i,badges:s,queuedFiles:e.assetAdmin.queuedFiles,securityId:e.config.SecurityID}}function p(e){return{actions:{gallery:(0,F.bindActionCreators)(z,e),
queuedFiles:(0,F.bindActionCreators)(G,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.galleryViewDefaultProps=t.galleryViewPropTypes=t.sorters=t.Gallery=void 0
var c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),h=o(f),m=n(5),g=o(m),y=n(2),v=o(y),b=n(3),E=o(b),C=n(25),_=o(C),S=n(26),w=o(S),P=n(9),F=n(8),x=n(27),T=o(x),O=n(31),I=o(O),A=n(32),k=o(A),D=n(284),N=o(D),R=n(21),U=o(R),j=n(285),L=o(j),M=n(286),q=o(M),B=n(15),z=r(B),H=n(18),G=r(H),V=n(287),Q=o(V),W=n(290),$=o(W),K=n(4),Y=n(291),Z=o(Y),X=[{
field:"title",direction:"asc",label:g.default._t("AssetAdmin.FILTER_TITLE_ASC","title a-z")},{field:"title",direction:"desc",label:g.default._t("AssetAdmin.FILTER_TITLE_DESC","title z-a")},{field:"lastEdited",
direction:"desc",label:g.default._t("AssetAdmin.FILTER_DATE_DESC","newest")},{field:"lastEdited",direction:"asc",label:g.default._t("AssetAdmin.FILTER_DATE_ASC","oldest")}],J=function(e){function t(e){
s(this,t)
var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleOpenFolder=n.handleOpenFolder.bind(n),n.handleOpenFile=n.handleOpenFile.bind(n),n.handleSelect=n.handleSelect.bind(n),n.handleSelectSort=n.handleSelectSort.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),
n.handleCancelUpload=n.handleCancelUpload.bind(n),n.handleRemoveErroredUpload=n.handleRemoveErroredUpload.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleSending=n.handleSending.bind(n),
n.handleBackClick=n.handleBackClick.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),
n.handleCreateFolder=n.handleCreateFolder.bind(n),n.handleViewChange=n.handleViewChange.bind(n),n.handleClearSearch=n.handleClearSearch.bind(n),n.handleEnableDropzone=n.handleEnableDropzone.bind(n),n.handleMoveFiles=n.handleMoveFiles.bind(n),
n.handleBulkDelete=n.handleBulkDelete.bind(n),n.handleBulkEdit=n.handleBulkEdit.bind(n),n}return l(t,e),d(t,[{key:"componentDidMount",value:function e(){this.initSortDropdown()}},{key:"componentWillReceiveProps",
value:function e(t){if("tile"!==t.view){var n=this.getSortElement()
n.off("change")}this.compareFiles(this.props.files,t.files)||t.actions.queuedFiles.purgeUploadQueue(),this.checkLoadingIndicator(t)}},{key:"componentDidUpdate",value:function e(){this.initSortDropdown()

}},{key:"getSortElement",value:function e(){return(0,h.default)(E.default.findDOMNode(this)).find(".gallery__sort .dropdown")}},{key:"getSearchMessage",value:function e(t){var n=[]
t.name&&n.push(g.default._t("AssetAdmin.SEARCHRESULTSMESSAGEKEYWORDS","with keywords '{name}'")),t.createdFrom&&t.createdTo?n.push(g.default._t("AssetAdmin.SEARCHRESULTSMESSAGEEDITEDBETWEEN","created between '{createdFrom}' and '{createdTo}'")):t.createdFrom?n.push(g.default._t("AssetAdmin.SEARCHRESULTSMESSAGEEDITEDFROM","created after '{createdFrom}'")):t.createdTo&&n.push(g.default._t("AssetAdmin.SEARCHRESULTSMESSAGEEDITEDTO","created before '{createdTo}'")),
t.appCategory&&n.push(g.default._t("AssetAdmin.SEARCHRESULTSMESSAGECATEGORY","categorised as '{appCategory}'")),t.currentFolderOnly&&n.push(g.default._t("AssetAdmin.SEARCHRESULTSMESSAGELIMIT","limited to the folder '{folder}'"))


var r=[n.slice(0,-1).join(g.default._t("AssetAdmin.JOIN",",")+" "),n.slice(-1)].filter(function(e){return e}).join(" "+g.default._t("AssetAdmin.JOINLAST","and")+" ")
if(""===r)return""
var o={parts:g.default.inject(r,c({folder:this.props.folder.title},t,{appCategory:t.appCategory?t.appCategory.toLowerCase():void 0}))}
return g.default.inject(g.default._t("AssetAdmin.SEARCHRESULTSMESSAGE","Search results {parts}"),o)}},{key:"checkLoadingIndicator",value:function e(t){var n=(0,h.default)(".cms-content.AssetAdmin")
n.length&&(t.loading?n.addClass("loading"):n.removeClass("loading"))}},{key:"compareFiles",value:function e(t,n){if(t&&!n||!t&&n)return!1
if(t.length!==n.length)return!1
for(var r=0;r<t.length;r++)if(t[r].id!==n[r].id)return!1
return!0}},{key:"initSortDropdown",value:function e(){if("tile"===this.props.view){var t=this.getSortElement()
t.chosen({allow_single_deselect:!0,disable_search_threshold:20}),t.on("change",function(){return _.default.Simulate.click(t.find(":selected")[0])})}}},{key:"handleSort",value:function e(t){this.props.actions.queuedFiles.purgeUploadQueue(),
this.props.onSort(t)}},{key:"handleSelectSort",value:function e(t){this.handleSort(t.currentTarget.value)}},{key:"handleSetPage",value:function e(t){this.props.onSetPage(t)}},{key:"handleCancelUpload",
value:function e(t){t.xhr.abort(),this.props.actions.queuedFiles.removeQueuedFile(t.queuedId)}},{key:"handleRemoveErroredUpload",value:function e(t){this.props.actions.queuedFiles.removeQueuedFile(t.queuedId)

}},{key:"handleAddedFile",value:function e(t){this.props.actions.queuedFiles.addQueuedFile(t)}},{key:"handleSending",value:function e(t,n){this.props.actions.queuedFiles.updateQueuedFile(t._queuedId,{xhr:n
})}},{key:"handleUploadProgress",value:function e(t,n){this.props.actions.queuedFiles.updateQueuedFile(t._queuedId,{progress:n})}},{key:"handleCreateFolder",value:function e(t){var n=this,r=this.promptFolderName(),o=parseInt(this.props.folder.id,10)


r&&this.props.actions.files.createFolder(o,r).then(function(e){n.props.onCreateFolderSuccess&&n.props.onCreateFolderSuccess(e)}),t.preventDefault()}},{key:"handleSuccessfulUpload",value:function e(t){var n=JSON.parse(t.xhr.response)


if("undefined"!=typeof n[0].error)return void this.handleFailedUpload(t)
if(this.props.actions.queuedFiles.succeedUpload(t._queuedId,n[0]),this.props.onSuccessfulUpload&&this.props.onSuccessfulUpload(n),"admin"!==this.props.type&&!this.props.fileId&&0===this.props.queuedFiles.items.length){
var r=n.pop()
this.props.onOpenFile(r.id)}}},{key:"handleFailedUpload",value:function e(t,n){this.props.actions.queuedFiles.failUpload(t._queuedId,n)}},{key:"promptFolderName",value:function e(){return prompt(g.default._t("AssetAdmin.PROMPTFOLDERNAME"))

}},{key:"itemIsSelected",value:function e(t){return this.props.selectedFiles.indexOf(t)>-1}},{key:"itemIsHighlighted",value:function e(t){return this.props.fileId===t}},{key:"handleClearSearch",value:function e(t){
this.handleOpenFolder(t,this.props.folder)}},{key:"handleOpenFolder",value:function e(t,n){t.preventDefault(),this.props.actions.gallery.setErrorMessage(null),this.props.actions.gallery.setNoticeMessage(null),
this.props.onOpenFolder(n.id)}},{key:"handleOpenFile",value:function e(t,n){t.preventDefault(),null!==n.created&&this.props.onOpenFile(n.id,n)}},{key:"handleSelect",value:function e(t,n){this.props.selectedFiles.indexOf(n.id)===-1?this.props.actions.gallery.selectFiles([n.id]):this.props.actions.gallery.deselectFiles([n.id])

}},{key:"handleBackClick",value:function e(t){t.preventDefault(),this.props.onOpenFolder(this.props.folder.parentId)}},{key:"handleViewChange",value:function e(t){var n=t.currentTarget.value
this.props.onViewChange(n)}},{key:"handleEnableDropzone",value:function e(t){this.props.actions.gallery.setEnableDropzone(t)}},{key:"handleMoveFiles",value:function e(t,n){var r=this
this.props.actions.files.moveFiles(t,n).then(function(){var e=U.default.MOVE_SUCCESS_DURATION,o="+"+n.length
r.props.actions.gallery.setFileBadge(t,o,"success",e),"function"==typeof r.props.onMoveFilesSuccess&&r.props.onMoveFilesSuccess(t,n)})}},{key:"handleBulkDelete",value:function e(t){var n=this
return Promise.all(t.map(function(e){return e.queuedId?(n.props.actions.queuedFiles.removeQueuedFile(e.queuedId),Promise.resolve(!0)):n.props.onDelete(e.id).then(function(){return!0}).catch(function(){
return!1})})).then(function(e){var t=e.filter(function(e){return e}).length
t!==e.length?(n.props.actions.gallery.setErrorMessage(g.default.sprintf(g.default._t("AssetAdmin.BULK_ACTIONS_DELETE_FAIL"),t,e.length-t)),n.props.actions.gallery.setNoticeMessage(null)):(n.props.actions.gallery.setNoticeMessage(g.default.sprintf(g.default._t("AssetAdmin.BULK_ACTIONS_DELETE_SUCCESS"),t)),
n.props.actions.gallery.setErrorMessage(null))})}},{key:"handleBulkEdit",value:function e(t){this.props.onOpenFile(t[0].id)}},{key:"renderSort",value:function e(){var t=this
return"tile"!==this.props.view?null:v.default.createElement("div",{className:"gallery__sort fieldholder-small"},v.default.createElement("select",{className:"dropdown no-change-track no-chzn",tabIndex:"0",
style:{width:"160px"},defaultValue:this.props.sort},X.map(function(e,n){return v.default.createElement("option",{key:n,onClick:t.handleSelectSort,"data-field":e.field,"data-direction":e.direction,value:e.field+","+e.direction
},e.label)})))}},{key:"renderToolbar",value:function e(){var t=this.props.folder.canEdit
return v.default.createElement("div",{className:"toolbar--content toolbar--space-save"},v.default.createElement("div",{className:"fill-width"},v.default.createElement("div",{className:"flexbox-area-grow"
},this.renderBackButton(),v.default.createElement("button",{id:"upload-button",className:"btn btn-secondary font-icon-upload btn--icon-xl",type:"button",disabled:!t},v.default.createElement("span",{className:"btn__text"
},g.default._t("AssetAdmin.DROPZONE_UPLOAD"))),v.default.createElement("button",{id:"add-folder-button",className:"btn btn-secondary font-icon-folder-add btn--icon-xl",type:"button",onClick:this.handleCreateFolder,
disabled:!t},v.default.createElement("span",{className:"btn__text"},g.default._t("AssetAdmin.ADD_FOLDER_BUTTON")))),v.default.createElement("div",{className:"gallery__state-buttons"},this.renderSort(),v.default.createElement("div",{
className:"btn-group",role:"group","aria-label":"View mode"},this.renderViewChangeButtons()))))}},{key:"renderSearchAlert",value:function e(){var t=this.props.filters
if(!t||0===Object.keys(t).length)return null
var n=this.getSearchMessage(t)
if(""===n)return null
var r=v.default.createElement("div",null,v.default.createElement("button",{onClick:this.handleClearSearch,className:"btn btn-info font-icon-cancel form-alert__btn--right"},g.default._t("AssetAdmin.SEARCHCLEARRESULTS","Clear results")),n)


return v.default.createElement(L.default,{value:{react:r},type:"warning"})}},{key:"renderViewChangeButtons",value:function e(){var t=this,n=["tile","table"]
return n.map(function(e,n){var r="table"===e?"list":"thumbnails",o=["gallery__view-change-button","btn btn-secondary","btn--icon-sm","btn--no-text"]
return e===t.props.view?null:(o.push("font-icon-"+r),v.default.createElement("button",{id:"button-view-"+e,key:n,className:o.join(" "),type:"button",title:"Change view gallery/list",onClick:t.handleViewChange,
value:e}))})}},{key:"renderBackButton",value:function e(){var t=this.props.folder.parentId
if(null!==t){var n=this.props.badges.find(function(e){return e.id===t})
return v.default.createElement("div",{className:"gallery__back-container"},v.default.createElement(q.default,{item:{id:t},onClick:this.handleBackClick,onDropFiles:this.handleMoveFiles,badge:n}))}return null

}},{key:"renderBulkActions",value:function e(){var t=this,n=U.default.BULK_ACTIONS.map(function(e){if(!e.callback)switch(e.value){case"delete":return c({},e,{callback:t.handleBulkDelete})
case"edit":return c({},e,{callback:t.handleBulkEdit})
default:return e}return e}),r=[].concat(i(this.props.files),i(this.props.queuedFiles.items)),o=this.props.selectedFiles.map(function(e){return r.find(function(t){return t&&e===t.id})})
return o.length>0&&"admin"===this.props.type?v.default.createElement(w.default,{transitionName:"bulk-actions",transitionEnterTimeout:U.default.CSS_TRANSITION_TIME,transitionLeaveTimeout:U.default.CSS_TRANSITION_TIME
},v.default.createElement(I.default,{actions:n,items:o,key:o.length>0})):null}},{key:"renderGalleryView",value:function e(){var t=this,n="table"===this.props.view?N.default:k.default,r=this.props.queuedFiles.items.filter(function(e){
return!e.id||!t.props.files.find(function(t){return t.id===e.id})}).map(function(e){return c({},e,{uploading:!(e.id>0)})}),o=[].concat(i(r),i(this.props.files)).map(function(e){return c({},e||{},{selected:t.itemIsSelected(e.id),
highlighted:t.itemIsHighlighted(e.id)})}),s=this.props,a=s.type,l=s.loading,u=s.page,p=s.totalCount,d=s.limit,f=s.sort,h=s.selectedFiles,m=s.badges,g={selectableItems:"admin"===a,files:o,loading:l,page:u,
totalCount:p,limit:d,sort:f,selectedFiles:h,badges:m,onSort:this.handleSort,onSetPage:this.handleSetPage,onOpenFile:this.handleOpenFile,onOpenFolder:this.handleOpenFolder,onSelect:this.handleSelect,onCancelUpload:this.handleCancelUpload,
onDropFiles:this.handleMoveFiles,onRemoveErroredUpload:this.handleRemoveErroredUpload,onEnableDropzone:this.handleEnableDropzone}
return v.default.createElement(n,g)}},{key:"render",value:function e(){if(!this.props.folder)return this.props.errorMessage?v.default.createElement("div",{className:"gallery__error flexbox-area-grow"},v.default.createElement("div",{
className:"gallery__error-message"},v.default.createElement("h3",null,g.default._t("AssetAdmin.DROPZONE_RESPONSE_ERROR","Server responded with an error.")),v.default.createElement("p",null,this.props.errorMessage))):v.default.createElement("div",{
className:"flexbox-area-grow"})
var t=v.default.createElement("div",{className:"gallery_messages"},this.props.errorMessage&&v.default.createElement(L.default,{value:this.props.errorMessage,type:"danger"}),this.props.noticeMessage&&v.default.createElement(L.default,{
value:this.props.noticeMessage,type:"success"}),this.renderSearchAlert()),n={height:U.default.THUMBNAIL_HEIGHT,width:U.default.THUMBNAIL_WIDTH},r={url:this.props.createFileApiUrl,method:this.props.createFileApiMethod,
paramName:"Upload",clickable:"#upload-button"},o=this.props.securityId,i=this.props.folder.canEdit&&this.props.enableDropzone,s=["panel","panel--padded","panel--scrollable","gallery__main"]
return"insert"===this.props.type&&s.push("insert-media-modal__main"),v.default.createElement("div",{className:"flexbox-area-grow gallery__outer"},this.renderBulkActions(),v.default.createElement(T.default,{
name:"gallery-container",canUpload:i,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,
preview:n,folderId:this.props.folderId,options:r,securityID:o,uploadButton:!1},v.default.createElement(Z.default,{className:s.join(" ")},this.renderToolbar(),t,this.renderGalleryView())))}}]),t}(y.Component),ee={
page:1,limit:15,sort:X[0].field+","+X[0].direction},te={loading:y.PropTypes.bool,sort:y.PropTypes.string,files:y.PropTypes.arrayOf(y.PropTypes.shape({id:y.PropTypes.number,parent:y.PropTypes.shape({id:y.PropTypes.number
})})).isRequired,selectedFiles:y.PropTypes.arrayOf(y.PropTypes.number),totalCount:y.PropTypes.number,page:y.PropTypes.number,limit:y.PropTypes.number,badges:y.PropTypes.arrayOf(y.PropTypes.shape({id:y.PropTypes.number,
message:y.PropTypes.node,status:y.PropTypes.string})),onOpenFile:y.PropTypes.func.isRequired,onOpenFolder:y.PropTypes.func.isRequired,onSort:y.PropTypes.func.isRequired,onSetPage:y.PropTypes.func.isRequired
},ne=c({},ee,{selectableItems:!1}),re=c({},te,{selectableItems:y.PropTypes.bool,onSelect:y.PropTypes.func,onCancelUpload:y.PropTypes.func,onDelete:v.default.PropTypes.func,onRemoveErroredUpload:y.PropTypes.func,
onEnableDropzone:y.PropTypes.func})
J.defaultProps=c({},ee,{type:"admin",view:"tile",enableDropzone:!0}),J.propTypes=c({},te,{client:v.default.PropTypes.object,onUploadSuccess:v.default.PropTypes.func,onCreateFolderSuccess:v.default.PropTypes.func,
onMoveFilesSuccess:v.default.PropTypes.func,onDelete:v.default.PropTypes.func,type:y.PropTypes.oneOf(["insert","select","admin"]),view:y.PropTypes.oneOf(["tile","table"]),dialog:y.PropTypes.bool,fileId:y.PropTypes.number,
folderId:y.PropTypes.number.isRequired,folder:y.PropTypes.shape({id:y.PropTypes.number,title:y.PropTypes.string,parentId:y.PropTypes.number,canView:y.PropTypes.bool,canEdit:y.PropTypes.bool}),queuedFiles:y.PropTypes.shape({
items:y.PropTypes.array.isRequired}),errorMessage:y.PropTypes.string,actions:y.PropTypes.object,securityId:y.PropTypes.string,onViewChange:y.PropTypes.func.isRequired,createFileApiUrl:y.PropTypes.string,
createFileApiMethod:y.PropTypes.string,search:y.PropTypes.object,enableDropzone:y.PropTypes.bool}),t.Gallery=J,t.sorters=X,t.galleryViewPropTypes=re,t.galleryViewDefaultProps=ne,t.default=(0,F.compose)((0,
P.connect)(u,p),$.default,Q.default,function(e){return(0,K.withApollo)(e)})(J)},function(e,t){e.exports=ReactAddonsTestUtils},function(e,t){e.exports=ReactAddonsCssTransitionGroup},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype)


var o=Object.getOwnPropertyDescriptor(t,n)
if(void 0===o){var i=Object.getPrototypeOf(t)
return null===i?void 0:e(i,n,r)}if("value"in o)return o.value
var s=o.get
if(void 0!==s)return s.call(r)},p=n(2),c=r(p),d=n(3),f=r(d),h=n(13),m=r(h),g=n(5),y=r(g),v=n(28),b=r(v),E=n(1),C=r(E),_=n(30),S=0,w=function(e){function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.dropzone=null,n.dragging=!1,n.handleAddedFile=n.handleAddedFile.bind(n),n.handleDragEnter=n.handleDragEnter.bind(n),n.handleDragLeave=n.handleDragLeave.bind(n),n.handleDrop=n.handleDrop.bind(n),
n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleError=n.handleError.bind(n),n.handleSending=n.handleSending.bind(n),n.handleSuccess=n.handleSuccess.bind(n),n.loadImage=n.loadImage.bind(n),
n}return s(t,e),l(t,[{key:"componentDidMount",value:function e(){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this)
var n=this.getDefaultOptions(),r=this.props.uploadSelector
if(!r&&this.props.uploadButton&&(r=".asset-dropzone__upload-button"),r){var o=(0,C.default)(f.default.findDOMNode(this)).find(r)
o&&o.length&&(n.clickable=o.toArray())}this.dropzone=new b.default(f.default.findDOMNode(this),a({},n,this.props.options))
var i=this.props.name
i&&this.dropzone.hiddenFileInput.classList.add("dz-input-"+i),"undefined"!=typeof this.props.promptOnRemove&&this.setPromptOnRemove(this.props.promptOnRemove)}},{key:"componentWillUnmount",value:function e(){
u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentWillUnmount",this).call(this),this.dropzone.disable()}},{key:"componentWillReceiveProps",value:function e(t){t.canUpload?this.dropzone&&this.dropzone.enable():this.dropzone.disable()

}},{key:"render",value:function e(){var t=["asset-dropzone"]
this.props.className&&t.push(this.props.className)
var n={className:"asset-dropzone__upload-button ss-ui-button font-icon-upload",type:"button"}
return this.props.canUpload||(n.disabled=!0),this.dragging===!0&&t.push("dragging"),c.default.createElement("div",{className:t.join(" ")},this.props.uploadButton&&c.default.createElement("button",n,y.default._t("AssetAdmin.DROPZONE_UPLOAD")),this.props.children)

}},{key:"getDefaultOptions",value:function e(){return{autoProcessQueue:!1,addedfile:this.handleAddedFile,dragenter:this.handleDragEnter,dragleave:this.handleDragLeave,drop:this.handleDrop,uploadprogress:this.handleUploadProgress,
dictDefaultMessage:y.default._t("AssetAdmin.DROPZONE_DEFAULT_MESSAGE"),dictFallbackMessage:y.default._t("AssetAdmin.DROPZONE_FALLBACK_MESSAGE"),dictFallbackText:y.default._t("AssetAdmin.DROPZONE_FALLBACK_TEXT"),
dictInvalidFileType:y.default._t("AssetAdmin.DROPZONE_INVALID_FILE_TYPE"),dictResponseError:y.default._t("AssetAdmin.DROPZONE_RESPONSE_ERROR"),dictCancelUpload:y.default._t("AssetAdmin.DROPZONE_CANCEL_UPLOAD"),
dictCancelUploadConfirmation:y.default._t("AssetAdmin.DROPZONE_CANCEL_UPLOAD_CONFIRMATION"),dictRemoveFile:y.default._t("AssetAdmin.DROPZONE_REMOVE_FILE"),dictMaxFilesExceeded:y.default._t("AssetAdmin.DROPZONE_MAX_FILES_EXCEEDED"),
error:this.handleError,sending:this.handleSending,success:this.handleSuccess,thumbnailHeight:150,thumbnailWidth:200}}},{key:"getFileCategory",value:function e(t){return t.split("/")[0]}},{key:"handleDragEnter",
value:function e(t){this.props.canUpload&&(this.dragging=!0,this.forceUpdate(),"function"==typeof this.props.handleDragEnter&&this.props.handleDragEnter(t))}},{key:"handleDragLeave",value:function e(t){
var n=f.default.findDOMNode(this)
this.props.canUpload&&t.target===n&&(this.dragging=!1,this.forceUpdate(),"function"==typeof this.props.handleDragLeave&&this.props.handleDragLeave(t,n))}},{key:"handleUploadProgress",value:function e(t,n,r){
"function"==typeof this.props.handleUploadProgress&&this.props.handleUploadProgress(t,n,r)}},{key:"handleDrop",value:function e(t){this.dragging=!1,this.forceUpdate(),"function"==typeof this.props.handleDrop&&this.props.handleDrop(t)

}},{key:"handleSending",value:function e(t,n,r){var o=this
"function"==typeof this.props.updateFormData&&this.props.updateFormData(r),r.append("SecurityID",this.props.securityID),r.append("ParentID",this.props.folderId)
var i=a({},n,{abort:function e(){o.dropzone.cancelUpload(t),n.abort()}})
"function"==typeof this.props.handleSending&&this.props.handleSending(t,i,r)}},{key:"generateQueuedId",value:function e(){return++S}},{key:"handleAddedFile",value:function e(t){var n=this
if(this.props.options.maxFiles&&this.dropzone.files.length>this.props.options.maxFiles)return this.dropzone.removeFile(this.dropzone.files[0]),"function"==typeof this.props.handleMaxFilesExceeded&&this.props.handleMaxFilesExceeded(t),
Promise.resolve()
if("function"==typeof this.props.canFileUpload&&!this.props.canFileUpload(t))return this.dropzone.removeFile(t),Promise.resolve()
if(!this.props.canUpload)return this.dropzone.removeFile(t),Promise.reject(new Error(y.default._t("AssetAdmin.DROPZONE_CANNOT_UPLOAD")))
t._queuedId=this.generateQueuedId()
var r=this.getLoadPreview(t)
return r.then(function(e){var r={height:e.height,width:e.width,category:n.getFileCategory(t.type),filename:t.name,queuedId:t._queuedId,size:t.size,title:n.getFileTitle(t.name),extension:(0,_.getFileExtension)(t.name),
type:t.type,url:e.thumbnailURL,thumbnail:e.thumbnailURL,smallThumbail:e.thumbnailURL}
return n.props.handleAddedFile(r),n.dropzone.processFile(t),r})}},{key:"getLoadPreview",value:function e(t){var n=this
return new Promise(function(e){var r=new FileReader
r.onload=function(r){if("image"===n.getFileCategory(t.type)){var o=document.createElement("img")
e(n.loadImage(o,r.target.result))}else e({})},r.readAsDataURL(t)})}},{key:"getFileTitle",value:function e(t){return t.replace(/[.][^.]+$/,"").replace(/-_/," ")}},{key:"loadImage",value:function e(t,n){
var r=this
return new Promise(function(e){t.onload=function(){var n=document.createElement("canvas"),o=n.getContext("2d"),i=2*r.props.preview.width,s=2*r.props.preview.height,a=t.naturalWidth/t.naturalHeight
t.naturalWidth<i||t.naturalHeight<s?(n.width=t.naturalWidth,n.height=t.naturalHeight):a<1?(n.width=i,n.height=i/a):(n.width=s*a,n.height=s),o.drawImage(t,0,0,n.width,n.height)
var l=n.toDataURL("image/png")
e({width:t.naturalWidth,height:t.naturalHeight,thumbnailURL:l})},t.src=n})}},{key:"handleError",value:function e(t,n){this.dropzone.removeFile(t),"function"==typeof this.props.handleError&&this.props.handleError(t,n)

}},{key:"handleSuccess",value:function e(t){this.dropzone.removeFile(t),this.props.handleSuccess(t)}},{key:"setPromptOnRemove",value:function e(t){this.dropzone.options.dictRemoveFileConfirmation=t}}]),
t}(m.default)
w.propTypes={folderId:c.default.PropTypes.number.isRequired,handleAddedFile:c.default.PropTypes.func.isRequired,handleDragEnter:c.default.PropTypes.func,handleDragLeave:c.default.PropTypes.func,handleDrop:c.default.PropTypes.func,
handleError:c.default.PropTypes.func.isRequired,handleSending:c.default.PropTypes.func,updateFormData:c.default.PropTypes.func,handleSuccess:c.default.PropTypes.func.isRequired,handleMaxFilesExceeded:c.default.PropTypes.func,
canFileUpload:c.default.PropTypes.func,options:c.default.PropTypes.shape({url:c.default.PropTypes.string.isRequired}),promptOnRemove:c.default.PropTypes.string,securityID:c.default.PropTypes.string.isRequired,
uploadButton:c.default.PropTypes.bool,uploadSelector:c.default.PropTypes.string,canUpload:c.default.PropTypes.bool.isRequired,preview:c.default.PropTypes.shape({width:c.default.PropTypes.number,height:c.default.PropTypes.number
}),className:c.default.PropTypes.string},w.defaultProps={uploadButton:!0},t.default=w},function(e,t,n){(function(e,t){(function(){var n,r,o,i,s,a,l,u,p=[].slice,c={}.hasOwnProperty,d=function(e,t){function n(){
this.constructor=e}for(var r in t)c.call(t,r)&&(e[r]=t[r])
return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e}
l=function(){},r=function(){function e(){}return e.prototype.addEventListener=e.prototype.on,e.prototype.on=function(e,t){return this._callbacks=this._callbacks||{},this._callbacks[e]||(this._callbacks[e]=[]),
this._callbacks[e].push(t),this},e.prototype.emit=function(){var e,t,n,r,o,i
if(r=arguments[0],e=2<=arguments.length?p.call(arguments,1):[],this._callbacks=this._callbacks||{},n=this._callbacks[r])for(o=0,i=n.length;o<i;o++)t=n[o],t.apply(this,e)
return this},e.prototype.removeListener=e.prototype.off,e.prototype.removeAllListeners=e.prototype.off,e.prototype.removeEventListener=e.prototype.off,e.prototype.off=function(e,t){var n,r,o,i,s
if(!this._callbacks||0===arguments.length)return this._callbacks={},this
if(r=this._callbacks[e],!r)return this
if(1===arguments.length)return delete this._callbacks[e],this
for(o=i=0,s=r.length;i<s;o=++i)if(n=r[o],n===t){r.splice(o,1)
break}return this},e}(),n=function(e){function t(e,r){var o,i,s
if(this.element=e,this.version=t.version,this.defaultOptions.previewTemplate=this.defaultOptions.previewTemplate.replace(/\n*/g,""),this.clickableElements=[],this.listeners=[],this.files=[],"string"==typeof this.element&&(this.element=document.querySelector(this.element)),
!this.element||null==this.element.nodeType)throw new Error("Invalid dropzone element.")
if(this.element.dropzone)throw new Error("Dropzone already attached.")
if(t.instances.push(this),this.element.dropzone=this,o=null!=(s=t.optionsForElement(this.element))?s:{},this.options=n({},this.defaultOptions,o,null!=r?r:{}),this.options.forceFallback||!t.isBrowserSupported())return this.options.fallback.call(this)


if(null==this.options.url&&(this.options.url=this.element.getAttribute("action")),!this.options.url)throw new Error("No URL provided.")
if(this.options.acceptedFiles&&this.options.acceptedMimeTypes)throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.")
this.options.acceptedMimeTypes&&(this.options.acceptedFiles=this.options.acceptedMimeTypes,delete this.options.acceptedMimeTypes),this.options.method=this.options.method.toUpperCase(),(i=this.getExistingFallback())&&i.parentNode&&i.parentNode.removeChild(i),
this.options.previewsContainer!==!1&&(this.options.previewsContainer?this.previewsContainer=t.getElement(this.options.previewsContainer,"previewsContainer"):this.previewsContainer=this.element),this.options.clickable&&(this.options.clickable===!0?this.clickableElements=[this.element]:this.clickableElements=t.getElements(this.options.clickable,"clickable")),
this.init()}var n,o
return d(t,e),t.prototype.Emitter=r,t.prototype.events=["drop","dragstart","dragend","dragenter","dragover","dragleave","addedfile","addedfiles","removedfile","thumbnail","error","errormultiple","processing","processingmultiple","uploadprogress","totaluploadprogress","sending","sendingmultiple","success","successmultiple","canceled","canceledmultiple","complete","completemultiple","reset","maxfilesexceeded","maxfilesreached","queuecomplete"],
t.prototype.defaultOptions={url:null,method:"post",withCredentials:!1,parallelUploads:2,uploadMultiple:!1,maxFilesize:256,paramName:"file",createImageThumbnails:!0,maxThumbnailFilesize:10,thumbnailWidth:120,
thumbnailHeight:120,filesizeBase:1e3,maxFiles:null,params:{},clickable:!0,ignoreHiddenFiles:!0,acceptedFiles:null,acceptedMimeTypes:null,autoProcessQueue:!0,autoQueue:!0,addRemoveLinks:!1,previewsContainer:null,
hiddenInputContainer:"body",capture:null,renameFilename:null,dictDefaultMessage:"Drop files here to upload",dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",dictFallbackText:"Please use the fallback form below to upload your files like in the olden days.",
dictFileTooBig:"File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",dictInvalidFileType:"You can't upload files of this type.",dictResponseError:"Server responded with {{statusCode}} code.",
dictCancelUpload:"Cancel upload",dictCancelUploadConfirmation:"Are you sure you want to cancel this upload?",dictRemoveFile:"Remove file",dictRemoveFileConfirmation:null,dictMaxFilesExceeded:"You can not upload any more files.",
accept:function(e,t){return t()},init:function(){return l},forceFallback:!1,fallback:function(){var e,n,r,o,i,s
for(this.element.className=""+this.element.className+" dz-browser-not-supported",s=this.element.getElementsByTagName("div"),o=0,i=s.length;o<i;o++)e=s[o],/(^| )dz-message($| )/.test(e.className)&&(n=e,
e.className="dz-message")
return n||(n=t.createElement('<div class="dz-message"><span></span></div>'),this.element.appendChild(n)),r=n.getElementsByTagName("span")[0],r&&(null!=r.textContent?r.textContent=this.options.dictFallbackMessage:null!=r.innerText&&(r.innerText=this.options.dictFallbackMessage)),
this.element.appendChild(this.getFallbackForm())},resize:function(e){var t,n,r
return t={srcX:0,srcY:0,srcWidth:e.width,srcHeight:e.height},n=e.width/e.height,t.optWidth=this.options.thumbnailWidth,t.optHeight=this.options.thumbnailHeight,null==t.optWidth&&null==t.optHeight?(t.optWidth=t.srcWidth,
t.optHeight=t.srcHeight):null==t.optWidth?t.optWidth=n*t.optHeight:null==t.optHeight&&(t.optHeight=1/n*t.optWidth),r=t.optWidth/t.optHeight,e.height<t.optHeight||e.width<t.optWidth?(t.trgHeight=t.srcHeight,
t.trgWidth=t.srcWidth):n>r?(t.srcHeight=e.height,t.srcWidth=t.srcHeight*r):(t.srcWidth=e.width,t.srcHeight=t.srcWidth/r),t.srcX=(e.width-t.srcWidth)/2,t.srcY=(e.height-t.srcHeight)/2,t},drop:function(e){
return this.element.classList.remove("dz-drag-hover")},dragstart:l,dragend:function(e){return this.element.classList.remove("dz-drag-hover")},dragenter:function(e){return this.element.classList.add("dz-drag-hover")

},dragover:function(e){return this.element.classList.add("dz-drag-hover")},dragleave:function(e){return this.element.classList.remove("dz-drag-hover")},paste:l,reset:function(){return this.element.classList.remove("dz-started")

},addedfile:function(e){var n,r,o,i,s,a,l,u,p,c,d,f,h
if(this.element===this.previewsContainer&&this.element.classList.add("dz-started"),this.previewsContainer){for(e.previewElement=t.createElement(this.options.previewTemplate.trim()),e.previewTemplate=e.previewElement,
this.previewsContainer.appendChild(e.previewElement),c=e.previewElement.querySelectorAll("[data-dz-name]"),i=0,l=c.length;i<l;i++)n=c[i],n.textContent=this._renameFilename(e.name)
for(d=e.previewElement.querySelectorAll("[data-dz-size]"),s=0,u=d.length;s<u;s++)n=d[s],n.innerHTML=this.filesize(e.size)
for(this.options.addRemoveLinks&&(e._removeLink=t.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>'+this.options.dictRemoveFile+"</a>"),e.previewElement.appendChild(e._removeLink)),
r=function(n){return function(r){return r.preventDefault(),r.stopPropagation(),e.status===t.UPLOADING?t.confirm(n.options.dictCancelUploadConfirmation,function(){return n.removeFile(e)}):n.options.dictRemoveFileConfirmation?t.confirm(n.options.dictRemoveFileConfirmation,function(){
return n.removeFile(e)}):n.removeFile(e)}}(this),f=e.previewElement.querySelectorAll("[data-dz-remove]"),h=[],a=0,p=f.length;a<p;a++)o=f[a],h.push(o.addEventListener("click",r))
return h}},removedfile:function(e){var t
return e.previewElement&&null!=(t=e.previewElement)&&t.parentNode.removeChild(e.previewElement),this._updateMaxFilesReachedClass()},thumbnail:function(e,t){var n,r,o,i
if(e.previewElement){for(e.previewElement.classList.remove("dz-file-preview"),i=e.previewElement.querySelectorAll("[data-dz-thumbnail]"),r=0,o=i.length;r<o;r++)n=i[r],n.alt=e.name,n.src=t
return setTimeout(function(t){return function(){return e.previewElement.classList.add("dz-image-preview")}}(this),1)}},error:function(e,t){var n,r,o,i,s
if(e.previewElement){for(e.previewElement.classList.add("dz-error"),"String"!=typeof t&&t.error&&(t=t.error),i=e.previewElement.querySelectorAll("[data-dz-errormessage]"),s=[],r=0,o=i.length;r<o;r++)n=i[r],
s.push(n.textContent=t)
return s}},errormultiple:l,processing:function(e){if(e.previewElement&&(e.previewElement.classList.add("dz-processing"),e._removeLink))return e._removeLink.textContent=this.options.dictCancelUpload},processingmultiple:l,
uploadprogress:function(e,t,n){var r,o,i,s,a
if(e.previewElement){for(s=e.previewElement.querySelectorAll("[data-dz-uploadprogress]"),a=[],o=0,i=s.length;o<i;o++)r=s[o],"PROGRESS"===r.nodeName?a.push(r.value=t):a.push(r.style.width=""+t+"%")
return a}},totaluploadprogress:l,sending:l,sendingmultiple:l,success:function(e){if(e.previewElement)return e.previewElement.classList.add("dz-success")},successmultiple:l,canceled:function(e){return this.emit("error",e,"Upload canceled.")

},canceledmultiple:l,complete:function(e){if(e._removeLink&&(e._removeLink.textContent=this.options.dictRemoveFile),e.previewElement)return e.previewElement.classList.add("dz-complete")},completemultiple:l,
maxfilesexceeded:l,maxfilesreached:l,queuecomplete:l,addedfiles:l,previewTemplate:'<div class="dz-preview dz-file-preview">\n  <div class="dz-image"><img data-dz-thumbnail /></div>\n  <div class="dz-details">\n    <div class="dz-size"><span data-dz-size></span></div>\n    <div class="dz-filename"><span data-dz-name></span></div>\n  </div>\n  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n  <div class="dz-success-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Check</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>\n      </g>\n    </svg>\n  </div>\n  <div class="dz-error-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Error</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">\n          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>'
},n=function(){var e,t,n,r,o,i,s
for(r=arguments[0],n=2<=arguments.length?p.call(arguments,1):[],i=0,s=n.length;i<s;i++){t=n[i]
for(e in t)o=t[e],r[e]=o}return r},t.prototype.getAcceptedFiles=function(){var e,t,n,r,o
for(r=this.files,o=[],t=0,n=r.length;t<n;t++)e=r[t],e.accepted&&o.push(e)
return o},t.prototype.getRejectedFiles=function(){var e,t,n,r,o
for(r=this.files,o=[],t=0,n=r.length;t<n;t++)e=r[t],e.accepted||o.push(e)
return o},t.prototype.getFilesWithStatus=function(e){var t,n,r,o,i
for(o=this.files,i=[],n=0,r=o.length;n<r;n++)t=o[n],t.status===e&&i.push(t)
return i},t.prototype.getQueuedFiles=function(){return this.getFilesWithStatus(t.QUEUED)},t.prototype.getUploadingFiles=function(){return this.getFilesWithStatus(t.UPLOADING)},t.prototype.getAddedFiles=function(){
return this.getFilesWithStatus(t.ADDED)},t.prototype.getActiveFiles=function(){var e,n,r,o,i
for(o=this.files,i=[],n=0,r=o.length;n<r;n++)e=o[n],e.status!==t.UPLOADING&&e.status!==t.QUEUED||i.push(e)
return i},t.prototype.init=function(){var e,n,r,o,i,s,a
for("form"===this.element.tagName&&this.element.setAttribute("enctype","multipart/form-data"),this.element.classList.contains("dropzone")&&!this.element.querySelector(".dz-message")&&this.element.appendChild(t.createElement('<div class="dz-default dz-message"><span>'+this.options.dictDefaultMessage+"</span></div>")),
this.clickableElements.length&&(r=function(e){return function(){return e.hiddenFileInput&&e.hiddenFileInput.parentNode.removeChild(e.hiddenFileInput),e.hiddenFileInput=document.createElement("input"),e.hiddenFileInput.setAttribute("type","file"),
(null==e.options.maxFiles||e.options.maxFiles>1)&&e.hiddenFileInput.setAttribute("multiple","multiple"),e.hiddenFileInput.className="dz-hidden-input",null!=e.options.acceptedFiles&&e.hiddenFileInput.setAttribute("accept",e.options.acceptedFiles),
null!=e.options.capture&&e.hiddenFileInput.setAttribute("capture",e.options.capture),e.hiddenFileInput.style.visibility="hidden",e.hiddenFileInput.style.position="absolute",e.hiddenFileInput.style.top="0",
e.hiddenFileInput.style.left="0",e.hiddenFileInput.style.height="0",e.hiddenFileInput.style.width="0",document.querySelector(e.options.hiddenInputContainer).appendChild(e.hiddenFileInput),e.hiddenFileInput.addEventListener("change",function(){
var t,n,o,i
if(n=e.hiddenFileInput.files,n.length)for(o=0,i=n.length;o<i;o++)t=n[o],e.addFile(t)
return e.emit("addedfiles",n),r()})}}(this))(),this.URL=null!=(s=window.URL)?s:window.webkitURL,a=this.events,o=0,i=a.length;o<i;o++)e=a[o],this.on(e,this.options[e])
return this.on("uploadprogress",function(e){return function(){return e.updateTotalUploadProgress()}}(this)),this.on("removedfile",function(e){return function(){return e.updateTotalUploadProgress()}}(this)),
this.on("canceled",function(e){return function(t){return e.emit("complete",t)}}(this)),this.on("complete",function(e){return function(t){if(0===e.getAddedFiles().length&&0===e.getUploadingFiles().length&&0===e.getQueuedFiles().length)return setTimeout(function(){
return e.emit("queuecomplete")},0)}}(this)),n=function(e){return e.stopPropagation(),e.preventDefault?e.preventDefault():e.returnValue=!1},this.listeners=[{element:this.element,events:{dragstart:function(e){
return function(t){return e.emit("dragstart",t)}}(this),dragenter:function(e){return function(t){return n(t),e.emit("dragenter",t)}}(this),dragover:function(e){return function(t){var r
try{r=t.dataTransfer.effectAllowed}catch(e){}return t.dataTransfer.dropEffect="move"===r||"linkMove"===r?"move":"copy",n(t),e.emit("dragover",t)}}(this),dragleave:function(e){return function(t){return e.emit("dragleave",t)

}}(this),drop:function(e){return function(t){return n(t),e.drop(t)}}(this),dragend:function(e){return function(t){return e.emit("dragend",t)}}(this)}}],this.clickableElements.forEach(function(e){return function(n){
return e.listeners.push({element:n,events:{click:function(r){return(n!==e.element||r.target===e.element||t.elementInside(r.target,e.element.querySelector(".dz-message")))&&e.hiddenFileInput.click(),!0}
}})}}(this)),this.enable(),this.options.init.call(this)},t.prototype.destroy=function(){var e
return this.disable(),this.removeAllFiles(!0),(null!=(e=this.hiddenFileInput)?e.parentNode:void 0)&&(this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput),this.hiddenFileInput=null),delete this.element.dropzone,
t.instances.splice(t.instances.indexOf(this),1)},t.prototype.updateTotalUploadProgress=function(){var e,t,n,r,o,i,s,a
if(r=0,n=0,e=this.getActiveFiles(),e.length){for(a=this.getActiveFiles(),i=0,s=a.length;i<s;i++)t=a[i],r+=t.upload.bytesSent,n+=t.upload.total
o=100*r/n}else o=100
return this.emit("totaluploadprogress",o,n,r)},t.prototype._getParamName=function(e){return"function"==typeof this.options.paramName?this.options.paramName(e):""+this.options.paramName+(this.options.uploadMultiple?"["+e+"]":"")

},t.prototype._renameFilename=function(e){return"function"!=typeof this.options.renameFilename?e:this.options.renameFilename(e)},t.prototype.getFallbackForm=function(){var e,n,r,o
return(e=this.getExistingFallback())?e:(r='<div class="dz-fallback">',this.options.dictFallbackText&&(r+="<p>"+this.options.dictFallbackText+"</p>"),r+='<input type="file" name="'+this._getParamName(0)+'" '+(this.options.uploadMultiple?'multiple="multiple"':void 0)+' /><input type="submit" value="Upload!"></div>',
n=t.createElement(r),"FORM"!==this.element.tagName?(o=t.createElement('<form action="'+this.options.url+'" enctype="multipart/form-data" method="'+this.options.method+'"></form>'),o.appendChild(n)):(this.element.setAttribute("enctype","multipart/form-data"),
this.element.setAttribute("method",this.options.method)),null!=o?o:n)},t.prototype.getExistingFallback=function(){var e,t,n,r,o,i
for(t=function(e){var t,n,r
for(n=0,r=e.length;n<r;n++)if(t=e[n],/(^| )fallback($| )/.test(t.className))return t},i=["div","form"],r=0,o=i.length;r<o;r++)if(n=i[r],e=t(this.element.getElementsByTagName(n)))return e},t.prototype.setupEventListeners=function(){
var e,t,n,r,o,i,s
for(i=this.listeners,s=[],r=0,o=i.length;r<o;r++)e=i[r],s.push(function(){var r,o
r=e.events,o=[]
for(t in r)n=r[t],o.push(e.element.addEventListener(t,n,!1))
return o}())
return s},t.prototype.removeEventListeners=function(){var e,t,n,r,o,i,s
for(i=this.listeners,s=[],r=0,o=i.length;r<o;r++)e=i[r],s.push(function(){var r,o
r=e.events,o=[]
for(t in r)n=r[t],o.push(e.element.removeEventListener(t,n,!1))
return o}())
return s},t.prototype.disable=function(){var e,t,n,r,o
for(this.clickableElements.forEach(function(e){return e.classList.remove("dz-clickable")}),this.removeEventListeners(),r=this.files,o=[],t=0,n=r.length;t<n;t++)e=r[t],o.push(this.cancelUpload(e))
return o},t.prototype.enable=function(){return this.clickableElements.forEach(function(e){return e.classList.add("dz-clickable")}),this.setupEventListeners()},t.prototype.filesize=function(e){var t,n,r,o,i,s,a,l


if(r=0,o="b",e>0){for(s=["TB","GB","MB","KB","b"],n=a=0,l=s.length;a<l;n=++a)if(i=s[n],t=Math.pow(this.options.filesizeBase,4-n)/10,e>=t){r=e/Math.pow(this.options.filesizeBase,4-n),o=i
break}r=Math.round(10*r)/10}return"<strong>"+r+"</strong> "+o},t.prototype._updateMaxFilesReachedClass=function(){return null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(this.getAcceptedFiles().length===this.options.maxFiles&&this.emit("maxfilesreached",this.files),
this.element.classList.add("dz-max-files-reached")):this.element.classList.remove("dz-max-files-reached")},t.prototype.drop=function(e){var t,n
e.dataTransfer&&(this.emit("drop",e),t=e.dataTransfer.files,this.emit("addedfiles",t),t.length&&(n=e.dataTransfer.items,n&&n.length&&null!=n[0].webkitGetAsEntry?this._addFilesFromItems(n):this.handleFiles(t)))

},t.prototype.paste=function(e){var t,n
if(null!=(null!=e&&null!=(n=e.clipboardData)?n.items:void 0))return this.emit("paste",e),t=e.clipboardData.items,t.length?this._addFilesFromItems(t):void 0},t.prototype.handleFiles=function(e){var t,n,r,o


for(o=[],n=0,r=e.length;n<r;n++)t=e[n],o.push(this.addFile(t))
return o},t.prototype._addFilesFromItems=function(e){var t,n,r,o,i
for(i=[],r=0,o=e.length;r<o;r++)n=e[r],null!=n.webkitGetAsEntry&&(t=n.webkitGetAsEntry())?t.isFile?i.push(this.addFile(n.getAsFile())):t.isDirectory?i.push(this._addFilesFromDirectory(t,t.name)):i.push(void 0):null!=n.getAsFile&&(null==n.kind||"file"===n.kind)?i.push(this.addFile(n.getAsFile())):i.push(void 0)


return i},t.prototype._addFilesFromDirectory=function(e,t){var n,r,o
return n=e.createReader(),r=function(e){return"undefined"!=typeof console&&null!==console&&"function"==typeof console.log?console.log(e):void 0},(o=function(e){return function(){return n.readEntries(function(n){
var r,i,s
if(n.length>0){for(i=0,s=n.length;i<s;i++)r=n[i],r.isFile?r.file(function(n){if(!e.options.ignoreHiddenFiles||"."!==n.name.substring(0,1))return n.fullPath=""+t+"/"+n.name,e.addFile(n)}):r.isDirectory&&e._addFilesFromDirectory(r,""+t+"/"+r.name)


o()}return null},r)}}(this))()},t.prototype.accept=function(e,n){return e.size>1024*this.options.maxFilesize*1024?n(this.options.dictFileTooBig.replace("{{filesize}}",Math.round(e.size/1024/10.24)/100).replace("{{maxFilesize}}",this.options.maxFilesize)):t.isValidFile(e,this.options.acceptedFiles)?null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(n(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}",this.options.maxFiles)),
this.emit("maxfilesexceeded",e)):this.options.accept.call(this,e,n):n(this.options.dictInvalidFileType)},t.prototype.addFile=function(e){return e.upload={progress:0,total:e.size,bytesSent:0},this.files.push(e),
e.status=t.ADDED,this.emit("addedfile",e),this._enqueueThumbnail(e),this.accept(e,function(t){return function(n){return n?(e.accepted=!1,t._errorProcessing([e],n)):(e.accepted=!0,t.options.autoQueue&&t.enqueueFile(e)),
t._updateMaxFilesReachedClass()}}(this))},t.prototype.enqueueFiles=function(e){var t,n,r
for(n=0,r=e.length;n<r;n++)t=e[n],this.enqueueFile(t)
return null},t.prototype.enqueueFile=function(e){if(e.status!==t.ADDED||e.accepted!==!0)throw new Error("This file can't be queued because it has already been processed or was rejected.")
if(e.status=t.QUEUED,this.options.autoProcessQueue)return setTimeout(function(e){return function(){return e.processQueue()}}(this),0)},t.prototype._thumbnailQueue=[],t.prototype._processingThumbnail=!1,
t.prototype._enqueueThumbnail=function(e){if(this.options.createImageThumbnails&&e.type.match(/image.*/)&&e.size<=1024*this.options.maxThumbnailFilesize*1024)return this._thumbnailQueue.push(e),setTimeout(function(e){
return function(){return e._processThumbnailQueue()}}(this),0)},t.prototype._processThumbnailQueue=function(){if(!this._processingThumbnail&&0!==this._thumbnailQueue.length)return this._processingThumbnail=!0,
this.createThumbnail(this._thumbnailQueue.shift(),function(e){return function(){return e._processingThumbnail=!1,e._processThumbnailQueue()}}(this))},t.prototype.removeFile=function(e){if(e.status===t.UPLOADING&&this.cancelUpload(e),
this.files=u(this.files,e),this.emit("removedfile",e),0===this.files.length)return this.emit("reset")},t.prototype.removeAllFiles=function(e){var n,r,o,i
for(null==e&&(e=!1),i=this.files.slice(),r=0,o=i.length;r<o;r++)n=i[r],(n.status!==t.UPLOADING||e)&&this.removeFile(n)
return null},t.prototype.createThumbnail=function(e,t){var n
return n=new FileReader,n.onload=function(r){return function(){return"image/svg+xml"===e.type?(r.emit("thumbnail",e,n.result),void(null!=t&&t())):r.createThumbnailFromUrl(e,n.result,t)}}(this),n.readAsDataURL(e)

},t.prototype.createThumbnailFromUrl=function(e,t,n,r){var o
return o=document.createElement("img"),r&&(o.crossOrigin=r),o.onload=function(t){return function(){var r,i,s,l,u,p,c,d
if(e.width=o.width,e.height=o.height,s=t.options.resize.call(t,e),null==s.trgWidth&&(s.trgWidth=s.optWidth),null==s.trgHeight&&(s.trgHeight=s.optHeight),r=document.createElement("canvas"),i=r.getContext("2d"),
r.width=s.trgWidth,r.height=s.trgHeight,a(i,o,null!=(u=s.srcX)?u:0,null!=(p=s.srcY)?p:0,s.srcWidth,s.srcHeight,null!=(c=s.trgX)?c:0,null!=(d=s.trgY)?d:0,s.trgWidth,s.trgHeight),l=r.toDataURL("image/png"),
t.emit("thumbnail",e,l),null!=n)return n()}}(this),null!=n&&(o.onerror=n),o.src=t},t.prototype.processQueue=function(){var e,t,n,r
if(t=this.options.parallelUploads,n=this.getUploadingFiles().length,e=n,!(n>=t)&&(r=this.getQueuedFiles(),r.length>0)){if(this.options.uploadMultiple)return this.processFiles(r.slice(0,t-n))
for(;e<t;){if(!r.length)return
this.processFile(r.shift()),e++}}},t.prototype.processFile=function(e){return this.processFiles([e])},t.prototype.processFiles=function(e){var n,r,o
for(r=0,o=e.length;r<o;r++)n=e[r],n.processing=!0,n.status=t.UPLOADING,this.emit("processing",n)
return this.options.uploadMultiple&&this.emit("processingmultiple",e),this.uploadFiles(e)},t.prototype._getFilesWithXhr=function(e){var t,n
return n=function(){var n,r,o,i
for(o=this.files,i=[],n=0,r=o.length;n<r;n++)t=o[n],t.xhr===e&&i.push(t)
return i}.call(this)},t.prototype.cancelUpload=function(e){var n,r,o,i,s,a,l
if(e.status===t.UPLOADING){for(r=this._getFilesWithXhr(e.xhr),o=0,s=r.length;o<s;o++)n=r[o],n.status=t.CANCELED
for(e.xhr.abort(),i=0,a=r.length;i<a;i++)n=r[i],this.emit("canceled",n)
this.options.uploadMultiple&&this.emit("canceledmultiple",r)}else(l=e.status)!==t.ADDED&&l!==t.QUEUED||(e.status=t.CANCELED,this.emit("canceled",e),this.options.uploadMultiple&&this.emit("canceledmultiple",[e]))


if(this.options.autoProcessQueue)return this.processQueue()},o=function(){var e,t
return t=arguments[0],e=2<=arguments.length?p.call(arguments,1):[],"function"==typeof t?t.apply(this,e):t},t.prototype.uploadFile=function(e){return this.uploadFiles([e])},t.prototype.uploadFiles=function(e){
var r,i,s,a,l,u,p,c,d,f,h,m,g,y,v,b,E,C,_,S,w,P,F,x,T,O,I,A,k,D,N,R,U,j
for(_=new XMLHttpRequest,S=0,x=e.length;S<x;S++)r=e[S],r.xhr=_
m=o(this.options.method,e),E=o(this.options.url,e),_.open(m,E,!0),_.withCredentials=!!this.options.withCredentials,v=null,s=function(t){return function(){var n,o,i
for(i=[],n=0,o=e.length;n<o;n++)r=e[n],i.push(t._errorProcessing(e,v||t.options.dictResponseError.replace("{{statusCode}}",_.status),_))
return i}}(this),b=function(t){return function(n){var o,i,s,a,l,u,p,c,d
if(null!=n)for(i=100*n.loaded/n.total,s=0,u=e.length;s<u;s++)r=e[s],r.upload={progress:i,total:n.total,bytesSent:n.loaded}
else{for(o=!0,i=100,a=0,p=e.length;a<p;a++)r=e[a],100===r.upload.progress&&r.upload.bytesSent===r.upload.total||(o=!1),r.upload.progress=i,r.upload.bytesSent=r.upload.total
if(o)return}for(d=[],l=0,c=e.length;l<c;l++)r=e[l],d.push(t.emit("uploadprogress",r,i,r.upload.bytesSent))
return d}}(this),_.onload=function(n){return function(r){var o
if(e[0].status!==t.CANCELED&&4===_.readyState){if(v=_.responseText,_.getResponseHeader("content-type")&&~_.getResponseHeader("content-type").indexOf("application/json"))try{v=JSON.parse(v)}catch(e){r=e,
v="Invalid JSON response from server."}return b(),200<=(o=_.status)&&o<300?n._finished(e,v,r):s()}}}(this),_.onerror=function(n){return function(){if(e[0].status!==t.CANCELED)return s()}}(this),y=null!=(k=_.upload)?k:_,
y.onprogress=b,u={Accept:"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"},this.options.headers&&n(u,this.options.headers)
for(a in u)l=u[a],l&&_.setRequestHeader(a,l)
if(i=new FormData,this.options.params){D=this.options.params
for(h in D)C=D[h],i.append(h,C)}for(w=0,T=e.length;w<T;w++)r=e[w],this.emit("sending",r,_,i)
if(this.options.uploadMultiple&&this.emit("sendingmultiple",e,_,i),"FORM"===this.element.tagName)for(N=this.element.querySelectorAll("input, textarea, select, button"),P=0,O=N.length;P<O;P++)if(c=N[P],
d=c.getAttribute("name"),f=c.getAttribute("type"),"SELECT"===c.tagName&&c.hasAttribute("multiple"))for(R=c.options,F=0,I=R.length;F<I;F++)g=R[F],g.selected&&i.append(d,g.value)
else(!f||"checkbox"!==(U=f.toLowerCase())&&"radio"!==U||c.checked)&&i.append(d,c.value)
for(p=A=0,j=e.length-1;0<=j?A<=j:A>=j;p=0<=j?++A:--A)i.append(this._getParamName(p),e[p],this._renameFilename(e[p].name))
return this.submitRequest(_,i,e)},t.prototype.submitRequest=function(e,t,n){return e.send(t)},t.prototype._finished=function(e,n,r){var o,i,s
for(i=0,s=e.length;i<s;i++)o=e[i],o.status=t.SUCCESS,this.emit("success",o,n,r),this.emit("complete",o)
if(this.options.uploadMultiple&&(this.emit("successmultiple",e,n,r),this.emit("completemultiple",e)),this.options.autoProcessQueue)return this.processQueue()},t.prototype._errorProcessing=function(e,n,r){
var o,i,s
for(i=0,s=e.length;i<s;i++)o=e[i],o.status=t.ERROR,this.emit("error",o,n,r),this.emit("complete",o)
if(this.options.uploadMultiple&&(this.emit("errormultiple",e,n,r),this.emit("completemultiple",e)),this.options.autoProcessQueue)return this.processQueue()},t}(r),n.version="4.3.0",n.options={},n.optionsForElement=function(e){
return e.getAttribute("id")?n.options[o(e.getAttribute("id"))]:void 0},n.instances=[],n.forElement=function(e){if("string"==typeof e&&(e=document.querySelector(e)),null==(null!=e?e.dropzone:void 0))throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.")


return e.dropzone},n.autoDiscover=!0,n.discover=function(){var e,t,r,o,i,s
for(document.querySelectorAll?r=document.querySelectorAll(".dropzone"):(r=[],e=function(e){var t,n,o,i
for(i=[],n=0,o=e.length;n<o;n++)t=e[n],/(^| )dropzone($| )/.test(t.className)?i.push(r.push(t)):i.push(void 0)
return i},e(document.getElementsByTagName("div")),e(document.getElementsByTagName("form"))),s=[],o=0,i=r.length;o<i;o++)t=r[o],n.optionsForElement(t)!==!1?s.push(new n(t)):s.push(void 0)
return s},n.blacklistedBrowsers=[/opera.*Macintosh.*version\/12/i],n.isBrowserSupported=function(){var e,t,r,o,i
if(e=!0,window.File&&window.FileReader&&window.FileList&&window.Blob&&window.FormData&&document.querySelector)if("classList"in document.createElement("a"))for(i=n.blacklistedBrowsers,r=0,o=i.length;r<o;r++)t=i[r],
t.test(navigator.userAgent)&&(e=!1)
else e=!1
else e=!1
return e},u=function(e,t){var n,r,o,i
for(i=[],r=0,o=e.length;r<o;r++)n=e[r],n!==t&&i.push(n)
return i},o=function(e){return e.replace(/[\-_](\w)/g,function(e){return e.charAt(1).toUpperCase()})},n.createElement=function(e){var t
return t=document.createElement("div"),t.innerHTML=e,t.childNodes[0]},n.elementInside=function(e,t){if(e===t)return!0
for(;e=e.parentNode;)if(e===t)return!0
return!1},n.getElement=function(e,t){var n
if("string"==typeof e?n=document.querySelector(e):null!=e.nodeType&&(n=e),null==n)throw new Error("Invalid `"+t+"` option provided. Please provide a CSS selector or a plain HTML element.")
return n},n.getElements=function(e,t){var n,r,o,i,s,a,l,u
if(e instanceof Array){o=[]
try{for(i=0,a=e.length;i<a;i++)r=e[i],o.push(this.getElement(r,t))}catch(e){n=e,o=null}}else if("string"==typeof e)for(o=[],u=document.querySelectorAll(e),s=0,l=u.length;s<l;s++)r=u[s],o.push(r)
else null!=e.nodeType&&(o=[e])
if(null==o||!o.length)throw new Error("Invalid `"+t+"` option provided. Please provide a CSS selector, a plain HTML element or a list of those.")
return o},n.confirm=function(e,t,n){return window.confirm(e)?t():null!=n?n():void 0},n.isValidFile=function(e,t){var n,r,o,i,s
if(!t)return!0
for(t=t.split(","),r=e.type,n=r.replace(/\/.*$/,""),i=0,s=t.length;i<s;i++)if(o=t[i],o=o.trim(),"."===o.charAt(0)){if(e.name.toLowerCase().indexOf(o.toLowerCase(),e.name.length-o.length)!==-1)return!0}else if(/\/\*$/.test(o)){
if(n===o.replace(/\/.*$/,""))return!0}else if(r===o)return!0
return!1},"undefined"!=typeof e&&null!==e&&(e.fn.dropzone=function(e){return this.each(function(){return new n(this,e)})}),"undefined"!=typeof t&&null!==t?t.exports=n:window.Dropzone=n,n.ADDED="added",
n.QUEUED="queued",n.ACCEPTED=n.QUEUED,n.UPLOADING="uploading",n.PROCESSING=n.UPLOADING,n.CANCELED="canceled",n.ERROR="error",n.SUCCESS="success",s=function(e){var t,n,r,o,i,s,a,l,u,p
for(a=e.naturalWidth,s=e.naturalHeight,n=document.createElement("canvas"),n.width=1,n.height=s,r=n.getContext("2d"),r.drawImage(e,0,0),o=r.getImageData(0,0,1,s).data,p=0,i=s,l=s;l>p;)t=o[4*(l-1)+3],0===t?i=l:p=l,
l=i+p>>1
return u=l/s,0===u?1:u},a=function(e,t,n,r,o,i,a,l,u,p){var c
return c=s(t),e.drawImage(t,n,r,o,i,a,l,u,p/c)},i=function(e,t){var n,r,o,i,s,a,l,u,p
if(o=!1,p=!0,r=e.document,u=r.documentElement,n=r.addEventListener?"addEventListener":"attachEvent",l=r.addEventListener?"removeEventListener":"detachEvent",a=r.addEventListener?"":"on",i=function(n){if("readystatechange"!==n.type||"complete"===r.readyState)return("load"===n.type?e:r)[l](a+n.type,i,!1),
!o&&(o=!0)?t.call(e,n.type||n):void 0},s=function(){var e
try{u.doScroll("left")}catch(t){return e=t,void setTimeout(s,50)}return i("poll")},"complete"!==r.readyState){if(r.createEventObject&&u.doScroll){try{p=!e.frameElement}catch(e){}p&&s()}return r[n](a+"DOMContentLoaded",i,!1),
r[n](a+"readystatechange",i,!1),e[n](a+"load",i,!1)}},n._autoDiscoverFunction=function(){if(n.autoDiscover)return n.discover()},i(window,n._autoDiscoverFunction)}).call(this)}).call(t,n(1),n(29)(e))},function(e,t){
e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],e.webpackPolyfill=1),e}},function(e,t){e.exports=DataFormat},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return{gallery:e.assetAdmin.gallery
}}Object.defineProperty(t,"__esModule",{value:!0}),t.BulkActions=void 0
var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),p=r(u),c=n(2),d=r(c),f=n(3),h=r(f),m=n(13),g=r(m),y=n(25),v=r(y),b=n(9),E=t.BulkActions=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.onChangeValue=n.onChangeValue.bind(n),n}return s(t,e),l(t,[{key:"componentDidMount",value:function e(){var t=(0,p.default)(h.default.findDOMNode(this)).find(".dropdown")
t.chosen({allow_single_deselect:!0,disable_search_threshold:20}),t.change(function(){return v.default.Simulate.click(t.find(":selected")[0])})}},{key:"render",value:function e(){var t=this,n=this.props.actions.map(function(e,n){
var r=t.props.items.length&&(!e.canApply||e.canApply(t.props.items))
if(!r)return""
var o=["bulk-actions__action","ss-ui-button","ui-corner-all",e.className||"font-icon-info-circled"].join(" ")
return d.default.createElement("button",{type:"button",className:o,key:n,onClick:t.onChangeValue,value:e.value},e.label)})
return d.default.createElement("div",{className:"bulk-actions fieldholder-small"},d.default.createElement("div",{className:"bulk-actions-counter"},this.props.items.length),n)}},{key:"getOptionByValue",
value:function e(t){return this.props.actions.find(function(e){return e.value===t})}},{key:"onChangeValue",value:function e(t){var n=this,r=null,o=this.getOptionByValue(t.target.value)
return null===o?null:(r="function"==typeof o.confirm?o.confirm(this.props.items).then(function(){return o.callback(n.props.items)}).catch(function(e){if("cancelled"!==e)throw e}):o.callback(this.props.items)||Promise.resolve(),
(0,p.default)(h.default.findDOMNode(this)).find(".dropdown").val("").trigger("liszt:updated"),r)}}]),t}(g.default)
E.propTypes={items:d.default.PropTypes.array,actions:d.default.PropTypes.arrayOf(d.default.PropTypes.shape({value:d.default.PropTypes.string.isRequired,label:d.default.PropTypes.string.isRequired,className:d.default.PropTypes.string,
destructive:d.default.PropTypes.bool,callback:d.default.PropTypes.func,canApply:d.default.PropTypes.func,confirm:d.default.PropTypes.func}))},t.default=(0,b.connect)(a)(E)},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(5),p=r(u),c=n(2),d=r(c),f=n(33),h=n(24),m=n(40),g=r(m),y=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.renderItem=n.renderItem.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handlePrevPage=n.handlePrevPage.bind(n),n.handleNextPage=n.handleNextPage.bind(n),n.handleDrag=n.handleDrag.bind(n),n}
return s(t,e),l(t,[{key:"handleDrag",value:function e(t){this.props.onEnableDropzone(!t)}},{key:"handleSetPage",value:function e(t){this.props.onSetPage(t)}},{key:"handleNextPage",value:function e(){this.handleSetPage(this.props.page+1)

}},{key:"handlePrevPage",value:function e(){this.handleSetPage(this.props.page-1)}},{key:"folderFilter",value:function e(t){return"folder"===t.type}},{key:"fileFilter",value:function e(t){return"folder"!==t.type

}},{key:"renderPagination",value:function e(){if(this.props.totalCount<=this.props.limit)return null
var t={setPage:this.handleSetPage,maxPage:Math.ceil(this.props.totalCount/this.props.limit),next:this.handleNextPage,nextText:p.default._t("Pagination.NEXT","Next"),previous:this.handlePrevPage,previousText:p.default._t("Pagination.PREVIOUS","Previous"),
currentPage:this.props.page-1,useGriddleStyles:!1}
return d.default.createElement("div",{className:"griddle-footer"},d.default.createElement(g.default.GridPagination,t))}},{key:"renderItem",value:function e(t,n){var r=this.props.badges.find(function(e){
return e.id===t.id}),o={key:n,item:t,selectedFiles:this.props.selectedFiles,onDrag:this.handleDrag,badge:r}
return t.uploading?a(o,{onCancelUpload:this.props.onCancelUpload,onRemoveErroredUpload:this.props.onRemoveErroredUpload}):a(o,{onActivate:"folder"===t.type?this.props.onOpenFolder:this.props.onOpenFile
}),this.props.selectableItems&&a(o,{selectable:!0,onSelect:this.props.onSelect}),"folder"===t.type?(a(o,{onDropFiles:this.props.onDropFiles}),d.default.createElement(f.Folder,o)):d.default.createElement(f.File,o)

}},{key:"render",value:function e(){return d.default.createElement("div",{className:"gallery__main-view--tile"},d.default.createElement("div",{className:"gallery__folders"},this.props.files.filter(this.folderFilter).map(this.renderItem)),d.default.createElement("div",{
className:"gallery__files"},this.props.files.filter(this.fileFilter).map(this.renderItem)),0===this.props.files.length&&!this.props.loading&&d.default.createElement("p",{className:"gallery__no-item-notice"
},p.default._t("AssetAdmin.NOITEMSFOUND")),d.default.createElement("div",{className:"gallery__load"},this.renderPagination()))}}]),t}(c.Component)
y.defaultProps=h.galleryViewDefaultProps,y.propTypes=h.galleryViewPropTypes,t.default=y},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0}),t.File=t.Folder=void 0
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(5),u=r(l),p=n(2),c=r(p),d=n(21),f=r(d),h=n(13),m=r(h),g=n(34),y=r(g),v=n(35),b=r(v),E=n(38),C=r(E),_=n(39),S=r(_),w=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSelect=n.handleSelect.bind(n),n.handleActivate=n.handleActivate.bind(n),n.handleKeyDown=n.handleKeyDown.bind(n),n.handleCancelUpload=n.handleCancelUpload.bind(n),n.preventFocus=n.preventFocus.bind(n),
n}return s(t,e),a(t,[{key:"handleActivate",value:function e(t){t.stopPropagation(),"function"==typeof this.props.onActivate&&this.props.onActivate(t,this.props.item)}},{key:"handleSelect",value:function e(t){
t.stopPropagation(),t.preventDefault(),"function"==typeof this.props.onSelect&&this.props.onSelect(t,this.props.item)}},{key:"getThumbnailStyles",value:function e(){var t=this.props.item.thumbnail
return this.isImage()&&t&&(this.exists()||this.uploading())?{backgroundImage:"url("+t+")"}:{}}},{key:"hasError",value:function e(){var e=!1
return this.props.item.message&&(e="error"===this.props.item.message.type),e}},{key:"getErrorMessage",value:function e(){var t=null
return this.hasError()?t=this.props.item.message.value:this.exists()||this.uploading()||(t=u.default._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==t?c.default.createElement("span",{className:"gallery-item__error-message"
},t):null}},{key:"getThumbnailClassNames",value:function e(){var t=["gallery-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&t.push("gallery-item__thumbnail--small"),t.join(" ")}},{key:"getItemClassNames",value:function e(){var t=this.props.item.category||"false",n=["gallery-item gallery-item--"+t]


return this.exists()||this.uploading()||n.push("gallery-item--missing"),this.props.selectable&&(n.push("gallery-item--selectable"),this.props.item.selected&&n.push("gallery-item--selected")),this.props.enlarged&&n.push("gallery-item--enlarged"),
this.props.item.highlighted&&n.push("gallery-item--highlighted"),this.hasError()&&n.push("gallery-item--error"),n.join(" ")}},{key:"getStatusFlags",value:function e(){var t=[]
return"folder"!==this.props.item.type&&(this.props.item.draft?t.push(c.default.createElement("span",{key:"status-draft",title:u.default._t("File.DRAFT","Draft"),className:"gallery-item--draft"})):this.props.item.modified&&t.push(c.default.createElement("span",{
key:"status-modified",title:u.default._t("File.MODIFIED","Modified"),className:"gallery-item--modified"}))),t}},{key:"isImage",value:function e(){return"image"===this.props.item.category}},{key:"exists",
value:function e(){return this.props.item.exists}},{key:"uploading",value:function e(){return this.props.item.uploading}},{key:"complete",value:function e(){return this.uploading()&&this.props.item.id>0

}},{key:"isImageSmallerThanThumbnail",value:function e(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1
var t=this.props.item.width,n=this.props.item.height
return n&&t&&n<f.default.THUMBNAIL_HEIGHT&&t<f.default.THUMBNAIL_WIDTH}},{key:"handleKeyDown",value:function e(t){t.stopPropagation(),f.default.SPACE_KEY_CODE===t.keyCode&&(t.preventDefault(),this.handleSelect(t)),
f.default.RETURN_KEY_CODE===t.keyCode&&this.handleActivate(t)}},{key:"preventFocus",value:function e(t){t.preventDefault()}},{key:"handleCancelUpload",value:function e(t){t.stopPropagation(),this.hasError()?this.props.onRemoveErroredUpload(this.props.item):this.props.onCancelUpload&&this.props.onCancelUpload(this.props.item)

}},{key:"getProgressBar",value:function e(){var t=null,n={className:"gallery-item__progress-bar",style:{width:this.props.item.progress+"%"}}
return this.hasError()||!this.uploading()||this.complete()||(t=c.default.createElement("div",{className:"gallery-item__upload-progress"},c.default.createElement("div",n))),t}},{key:"render",value:function e(){
var t=null,n=null,r=null
this.props.selectable&&(t=this.handleSelect,n="font-icon-tick"),this.uploading()?(t=this.handleCancelUpload,n="font-icon-cancel"):this.exists()&&(r=c.default.createElement("div",{className:"gallery-item--overlay font-icon-edit"
},"View"))
var o=this.props.badge
return c.default.createElement("div",{className:this.getItemClassNames(),"data-id":this.props.item.id,tabIndex:"0",onKeyDown:this.handleKeyDown,onClick:this.handleActivate},!!o&&c.default.createElement(S.default,{
className:"gallery-item__badge",status:o.status,message:o.message}),c.default.createElement("div",{ref:"thumbnail",className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()},r,this.getStatusFlags()),this.getProgressBar(),this.getErrorMessage(),c.default.createElement("div",{
className:"gallery-item__title",ref:"title"},c.default.createElement("label",{className:"gallery-item__checkbox-label "+n,onClick:t},c.default.createElement("input",{className:"gallery-item__checkbox",
type:"checkbox",title:u.default._t("AssetAdmin.SELECT"),tabIndex:"-1",onMouseDown:this.preventFocus})),this.props.item.title))}}]),t}(m.default)
w.propTypes={item:y.default,highlighted:p.PropTypes.bool,selected:p.PropTypes.bool,enlarged:p.PropTypes.bool,message:p.PropTypes.shape({value:p.PropTypes.string,type:p.PropTypes.string}),selectable:p.PropTypes.bool,
onActivate:p.PropTypes.func,onSelect:p.PropTypes.func,onCancelUpload:p.PropTypes.func,onRemoveErroredUpload:p.PropTypes.func}
var P="GalleryItem",F=(0,b.default)(P)(w),x=(0,C.default)(P)(F)
t.Folder=x,t.File=F,t.default=w},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(2),i=r(o),s=i.default.PropTypes.shape({exists:i.default.PropTypes.bool,type:i.default.PropTypes.string,smallThumbnail:i.default.PropTypes.string,thumbnail:i.default.PropTypes.string,width:i.default.PropTypes.number,
height:i.default.PropTypes.number,category:i.default.PropTypes.oneOfType([i.default.PropTypes.bool,i.default.PropTypes.string]),id:i.default.PropTypes.number,url:i.default.PropTypes.string,title:i.default.PropTypes.string,
progress:i.default.PropTypes.number})
t.default=s},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t={beginDrag:function e(t){
"function"==typeof t.onDrag&&t.onDrag(!0)
var n=t.selectedFiles.concat([])
return 0===n.length&&n.push(t.item.id),{selected:n,props:t}},endDrag:function e(t){"function"==typeof t.onDrag&&t.onDrag(!1)}},n=function e(t,n){return{connectDragPreview:t.dragPreview(),connectDragSource:t.dragSource(),
isDragging:n.isDragging()}},r=(0,c.DragSource)(e,t,n)
return function(e){var t=function(t){function n(){return o(this,n),i(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return s(n,t),l(n,[{key:"componentDidMount",value:function e(){this.props.connectDragPreview((0,
d.getEmptyImage)(),{captureDraggingState:!0})}},{key:"render",value:function t(){var n=this.props.connectDragSource,r=p.default.createElement(e,this.props)
return n("string"==typeof r.type?r:p.default.createElement("div",{className:"gallery-item__draggable"},r))}}]),n}(u.Component)
return t.propTypes={connectDragSource:u.PropTypes.func.isRequired,connectDragPreview:u.PropTypes.func.isRequired,item:u.PropTypes.shape({id:u.PropTypes.number.isRequired}).isRequired,onDrag:u.PropTypes.func,
selectedFiles:u.PropTypes.arrayOf(u.PropTypes.number)},r(t)}}Object.defineProperty(t,"__esModule",{value:!0})
var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()
t.default=a
var u=n(2),p=r(u),c=n(36),d=n(37)},function(e,t){e.exports=ReactDND},function(e,t){e.exports=ReactDNDHtml5Backend},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t={drop:function e(t,n){
if(n.canDrop()){var r=n.getItem()
t.onDropFiles(t.item.id,r.selected)}},canDrop:function e(t,n){var r=n.getItem()
return 1!==r.selected.length||r.selected[0]!==t.item.id}},n=function e(t,n){var r=n.isOver()
return{enlarged:r&&n.canDrop(),connectDropTarget:t.dropTarget(),isOver:r}},r=(0,c.DropTarget)(e,t,n)
return function(e){var t=function(t){function n(){return o(this,n),i(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return s(n,t),l(n,[{key:"render",value:function t(){var n=this.props.connectDropTarget,r=p.default.createElement(e,this.props)


return n("string"==typeof r.type?r:p.default.createElement("div",{className:"gallery-item__droppable"},r))}}]),n}(u.Component)
return t.propTypes={connectDropTarget:u.PropTypes.func.isRequired,item:u.PropTypes.shape({id:u.PropTypes.number.isRequired}).isRequired},r(t)}}Object.defineProperty(t,"__esModule",{value:!0})
var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()
t.default=a
var u=n(2),p=r(u),c=n(36)},function(e,t){e.exports=Badge},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(2),i=n(41),s=n(212),a=n(213),l=n(214),u=n(220),p=n(221),c=n(203),d=n(241),f=n(242),h=n(243),m=n(43),g=n(210),y=n(222),v=n(244),b=n(246),E=n(167),C=n(247),_=n(223),S=n(248),w=n(249),P=n(109),F=n(252),x=n(253),T=n(254),O=n(255),I=n(44),A=n(198),k=n(165),D=n(283),N=n(156),R=n(141),U=o.createClass({
displayName:"Griddle",statics:{GridTable:i,GridFilter:s,GridPagination:a,GridSettings:l,GridRow:p},columnSettings:null,rowSettings:null,getDefaultProps:function e(){return{columns:[],gridMetadata:null,
columnMetadata:[],rowMetadata:null,results:[],initialSort:"",gridClassName:"",tableClassName:"",customRowComponentClassName:"",settingsText:"Settings",filterPlaceholderText:"Filter Results",nextText:"Next",
previousText:"Previous",maxRowsText:"Rows per page",enableCustomFormatText:"Enable Custom Formatting",childrenColumnName:"children",metadataColumns:[],showFilter:!1,showSettings:!1,useCustomRowComponent:!1,
useCustomGridComponent:!1,useCustomPagerComponent:!1,useCustomFilterer:!1,useCustomFilterComponent:!1,useGriddleStyles:!0,useGriddleIcons:!0,customRowComponent:null,customGridComponent:null,customPagerComponent:{},
customFilterComponent:null,customFilterer:null,globalData:null,enableToggleCustom:!1,noDataMessage:"There is no data to display.",noDataClassName:"griddle-nodata",customNoDataComponent:null,customNoDataComponentProps:null,
allowEmptyGrid:!1,showTableHeading:!0,showPager:!0,useFixedHeader:!1,useExternal:!1,externalSetPage:null,externalChangeSort:null,externalSetFilter:null,externalSetPageSize:null,externalMaxPage:null,externalCurrentPage:null,
externalSortColumn:null,externalSortAscending:!0,externalLoadingComponent:null,externalIsLoading:!1,enableInfiniteScroll:!1,bodyHeight:null,paddingHeight:5,rowHeight:25,infiniteScrollLoadTreshold:50,useFixedLayout:!0,
isSubGriddle:!1,enableSort:!0,onRowClick:null,sortAscendingClassName:"sort-ascending",sortDescendingClassName:"sort-descending",parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",
settingsToggleClassName:"settings",nextClassName:"griddle-next",previousClassName:"griddle-previous",headerStyles:{},sortAscendingComponent:" ▲",sortDescendingComponent:" ▼",sortDefaultComponent:null,parentRowCollapsedComponent:"▶",
parentRowExpandedComponent:"▼",settingsIconComponent:"",nextIconComponent:"",previousIconComponent:"",isMultipleSelection:!1,selectedRowIds:[],uniqueIdentifier:"id",onSelectionChange:null}},propTypes:{
isMultipleSelection:o.PropTypes.bool,selectedRowIds:o.PropTypes.oneOfType([o.PropTypes.arrayOf(o.PropTypes.number),o.PropTypes.arrayOf(o.PropTypes.string)]),uniqueIdentifier:o.PropTypes.string,onSelectionChange:o.PropTypes.func
},defaultFilter:function e(t,n){var r=this
return k(t,function(e){for(var t=y.keys(e),o=0;o<t.length;o++){var i=r.columnSettings.getMetadataColumnProperty(t[o],"filterable",!0)
if(i&&(y.getAt(e,t[o])||"").toString().toLowerCase().indexOf(n.toLowerCase())>=0)return!0}return!1})},defaultColumnFilter:function e(t,n){return k(y.getObjectValues(t),function(e){return e.toString().toLowerCase().indexOf(n.toLowerCase())>=0

}).length>0},filterByColumnFilters:function e(t){var n=this.defaultColumnFilter,r=Object.keys(t).reduce(function(e,r){return k(e,function(e){var o=y.getAt(e,r||""),i=t[r]
return n(o,i)})},this.props.results),o={columnFilters:t}
t?(o.filteredResults=r,o.maxPage=this.getMaxPage(o.filteredResults)):this.state.filter?o.filteredResults=this.props.useCustomFilterer?this.props.customFilterer(this.props.results,filter):this.defaultFilter(this.props.results,filter):o.filteredResults=null,
this.setState(o)},filterByColumn:function e(t,n){var r=this.state.columnFilters
if(r.hasOwnProperty(n)&&!t)r=O(r,n)
else{var o={}
o[n]=t,r=A({},r,o)}this.filterByColumnFilters(r)},setFilter:function e(t){if(this.props.useExternal)return void this.props.externalSetFilter(t)
var n=this,r={page:0,filter:t}
r.filteredResults=this.props.useCustomFilterer?this.props.customFilterer(this.props.results,t):this.defaultFilter(this.props.results,t),r.maxPage=n.getMaxPage(r.filteredResults),(T(t)||x(t)||F(t))&&(r.filter=t,
r.filteredResults=null),n.setState(r),this._resetSelectedRows()},setPageSize:function e(t){return this.props.useExternal?(this.setState({resultsPerPage:t}),void this.props.externalSetPageSize(t)):(this.state.resultsPerPage=t,
void this.setMaxPage())},toggleColumnChooser:function e(){this.setState({showColumnChooser:!this.state.showColumnChooser})},isNullOrUndefined:function e(t){return void 0===t||null===t},shouldUseCustomRowComponent:function e(){
return this.isNullOrUndefined(this.state.useCustomRowComponent)?this.props.useCustomRowComponent:this.state.useCustomRowComponent},shouldUseCustomGridComponent:function e(){return this.isNullOrUndefined(this.state.useCustomGridComponent)?this.props.useCustomGridComponent:this.state.useCustomGridComponent

},toggleCustomComponent:function e(){"grid"===this.state.customComponentType?this.setState({useCustomGridComponent:!this.shouldUseCustomGridComponent()}):"row"===this.state.customComponentType&&this.setState({
useCustomRowComponent:!this.shouldUseCustomRowComponent()})},getMaxPage:function e(t,n){if(this.props.useExternal)return this.props.externalMaxPage
n||(n=(t||this.getCurrentResults()).length)
var r=Math.ceil(n/this.state.resultsPerPage)
return r},setMaxPage:function e(t){var n=this.getMaxPage(t)
this.state.maxPage!==n&&this.setState({page:0,maxPage:n,filteredColumns:this.columnSettings.filteredColumns})},setPage:function e(t){if(this.props.useExternal)return void this.props.externalSetPage(t)
if(t*this.state.resultsPerPage<=this.state.resultsPerPage*this.state.maxPage){var n=this,r={page:t}
n.setState(r)}this.props.enableInfiniteScroll&&this.setState({isSelectAllChecked:!1})},setColumns:function e(t){this.columnSettings.filteredColumns=P(t)?t:[t],this.setState({filteredColumns:this.columnSettings.filteredColumns
})},nextPage:function e(){var t=this.getCurrentPage()
t<this.getCurrentMaxPage()-1&&this.setPage(t+1)},previousPage:function e(){var t=this.getCurrentPage()
t>0&&this.setPage(t-1)},changeSort:function e(t){if(this.props.enableSort!==!1){if(this.props.useExternal){var n=this.props.externalSortColumn!==t||!this.props.externalSortAscending
return this.setState({sortColumn:t,sortDirection:n?"asc":"desc"}),void this.props.externalChangeSort(t,n)}var r=E(this.props.columnMetadata,{columnName:t})||{},o=r.sortDirectionCycle?r.sortDirectionCycle:[null,"asc","desc"],i=null,s=o.indexOf(this.state.sortDirection&&t===this.state.sortColumn?this.state.sortDirection:null)


s=(s+1)%o.length,i=o[s]?o[s]:null
var a={page:0,sortColumn:t,sortDirection:i}
this.setState(a)}},componentWillReceiveProps:function e(t){if(this.setMaxPage(t.results),t.resultsPerPage!==this.props.resultsPerPage&&this.setPageSize(t.resultsPerPage),this.columnSettings.columnMetadata=t.columnMetadata,
t.results.length>0){var n=y.keys(t.results[0]),r=this.columnSettings.allColumns.length==n.length&&this.columnSettings.allColumns.every(function(e,t){return e===n[t]})
r||(this.columnSettings.allColumns=n)}else this.columnSettings.allColumns.length>0&&(this.columnSettings.allColumns=[])
if(t.selectedRowIds){var o=this.getDataForRender(this.getCurrentResults(t.results),this.columnSettings.getColumns(),!0)
this.setState({isSelectAllChecked:this._getAreAllRowsChecked(t.selectedRowIds,I(o,this.props.uniqueIdentifier)),selectedRowIds:t.selectedRowIds})}},getInitialState:function e(){var t={maxPage:0,page:0,
filteredResults:null,filteredColumns:[],filter:"",columnFilters:{},resultsPerPage:this.props.resultsPerPage||5,showColumnChooser:!1,isSelectAllChecked:!1,selectedRowIds:this.props.selectedRowIds}
return t},componentWillMount:function e(){this.verifyExternal(),this.verifyCustom(),this.columnSettings=new m(this.props.results.length>0?y.keys(this.props.results[0]):[],this.props.columns,this.props.childrenColumnName,this.props.columnMetadata,this.props.metadataColumns),
this.rowSettings=new g(this.props.rowMetadata,this.props.useCustomTableRowComponent&&this.props.customTableRowComponent?this.props.customTableRowComponent:p,this.props.useCustomTableRowComponent),this.props.initialSort&&(this.props.useExternal?this.setState({
sortColumn:this.props.externalSortColumn,sortDirection:this.props.externalSortAscending?"asc":"desc"}):this.changeSort(this.props.initialSort)),this.setMaxPage(),this.shouldUseCustomGridComponent()?this.setState({
customComponentType:"grid"}):this.shouldUseCustomRowComponent()?this.setState({customComponentType:"row"}):this.setState({filteredColumns:this.columnSettings.filteredColumns})},componentDidMount:function e(){
if(this.props.componentDidMount&&"function"==typeof this.props.componentDidMount)return this.props.componentDidMount()},componentDidUpdate:function e(){if(this.props.componentDidUpdate&&"function"==typeof this.props.componentDidUpdate)return this.props.componentDidUpdate(this.state)

},verifyExternal:function e(){this.props.useExternal===!0&&(null===this.props.externalSetPage&&console.error("useExternal is set to true but there is no externalSetPage function specified."),null===this.props.externalChangeSort&&console.error("useExternal is set to true but there is no externalChangeSort function specified."),
null===this.props.externalSetFilter&&console.error("useExternal is set to true but there is no externalSetFilter function specified."),null===this.props.externalSetPageSize&&console.error("useExternal is set to true but there is no externalSetPageSize function specified."),
null===this.props.externalMaxPage&&console.error("useExternal is set to true but externalMaxPage is not set."),null===this.props.externalCurrentPage&&console.error("useExternal is set to true but externalCurrentPage is not set. Griddle will not page correctly without that property when using external data."))

},verifyCustom:function e(){this.props.useCustomGridComponent===!0&&null===this.props.customGridComponent&&console.error("useCustomGridComponent is set to true but no custom component was specified."),
this.props.useCustomRowComponent===!0&&null===this.props.customRowComponent&&console.error("useCustomRowComponent is set to true but no custom component was specified."),this.props.useCustomGridComponent===!0&&this.props.useCustomRowComponent===!0&&console.error("Cannot currently use both customGridComponent and customRowComponent."),
this.props.useCustomFilterer===!0&&null===this.props.customFilterer&&console.error("useCustomFilterer is set to true but no custom filter function was specified."),this.props.useCustomFilterComponent===!0&&null===this.props.customFilterComponent&&console.error("useCustomFilterComponent is set to true but no customFilterComponent was specified.")

},getDataForRender:function e(t,n,r){var o=this,i=this
if(""!==this.state.sortColumn){var s=this.state.sortColumn,a=k(this.props.columnMetadata,{columnName:s}),l,u={columns:[],orders:[]}
if(a.length>0&&(l=a[0].hasOwnProperty("customCompareFn")&&a[0].customCompareFn,a[0].multiSort&&(u=a[0].multiSort)),this.state.sortDirection)if("function"==typeof l)2===l.length?(t=t.sort(function(e,t){
return l(R(e,s),R(t,s))}),"desc"===this.state.sortDirection&&t.reverse()):1===l.length&&(t=D(t,function(e){return l(R(e,s))},[this.state.sortDirection]))
else{var p=[function(e){return(R(e,s)||"").toString().toLowerCase()}],c=[this.state.sortDirection]
u.columns.forEach(function(e,t){p.push(function(t){return(R(t,e)||"").toString().toLowerCase()}),"asc"===u.orders[t]||"desc"===u.orders[t]?c.push(u.orders[t]):c.push(o.state.sortDirection)}),t=D(t,p,c)

}}var d=this.getCurrentPage()
if(!this.props.useExternal&&r&&this.state.resultsPerPage*(d+1)<=this.state.resultsPerPage*this.state.maxPage&&d>=0)if(this.isInfiniteScrollEnabled())t=C(t,(d+1)*this.state.resultsPerPage)
else{var f=v(t,d*this.state.resultsPerPage)
t=(b||S)(f,f.length-this.state.resultsPerPage)}for(var h=this.columnSettings.getMetadataColumns,m=[],g=0;g<t.length;g++){var y=t[g]
"undefined"!=typeof y[i.props.childrenColumnName]&&y[i.props.childrenColumnName].length>0&&(y.children=i.getDataForRender(y[i.props.childrenColumnName],n,!1),"children"!==i.props.childrenColumnName&&delete y[i.props.childrenColumnName]),
m.push(y)}return m},getCurrentResults:function e(t){return this.state.filteredResults||t||this.props.results},getCurrentPage:function e(){return this.props.externalCurrentPage||this.state.page},getCurrentSort:function e(){
return this.props.useExternal?this.props.externalSortColumn:this.state.sortColumn},getCurrentSortAscending:function e(){return this.props.useExternal?this.props.externalSortAscending:"asc"===this.state.sortDirection

},getCurrentMaxPage:function e(){return this.props.useExternal?this.props.externalMaxPage:this.state.maxPage},getSortObject:function e(){return{enableSort:this.props.enableSort,changeSort:this.changeSort,
sortColumn:this.getCurrentSort(),sortAscending:this.getCurrentSortAscending(),sortDirection:this.state.sortDirection,sortAscendingClassName:this.props.sortAscendingClassName,sortDescendingClassName:this.props.sortDescendingClassName,
sortAscendingComponent:this.props.sortAscendingComponent,sortDescendingComponent:this.props.sortDescendingComponent,sortDefaultComponent:this.props.sortDefaultComponent}},_toggleSelectAll:function e(){
var t=this.getDataForRender(this.getCurrentResults(),this.columnSettings.getColumns(),!0),n=!this.state.isSelectAllChecked,r=JSON.parse(JSON.stringify(this.state.selectedRowIds)),o=this
_(t,function(e){o._updateSelectedRowIds(e[o.props.uniqueIdentifier],r,n)},this),this.setState({isSelectAllChecked:n,selectedRowIds:r}),this.props.onSelectionChange&&this.props.onSelectionChange(r,n)},_toggleSelectRow:function e(t,n){
var r=this.getDataForRender(this.getCurrentResults(),this.columnSettings.getColumns(),!0),o=JSON.parse(JSON.stringify(this.state.selectedRowIds))
this._updateSelectedRowIds(t[this.props.uniqueIdentifier],o,n)
var i=this._getAreAllRowsChecked(o,I(r,this.props.uniqueIdentifier))
this.setState({isSelectAllChecked:i,selectedRowIds:o}),this.props.onSelectionChange&&this.props.onSelectionChange(o,i)},_updateSelectedRowIds:function e(t,n,r){var o
r?(o=E(n,function(e){return t===e}),void 0===o&&n.push(t)):n.splice(n.indexOf(t),1)},_getIsSelectAllChecked:function e(){return this.state.isSelectAllChecked},_getAreAllRowsChecked:function e(t,n){return n.length===w(n,t).length

},_getIsRowChecked:function e(t){return this.state.selectedRowIds.indexOf(t[this.props.uniqueIdentifier])>-1},getSelectedRowIds:function e(){return this.state.selectedRowIds},_resetSelectedRows:function e(){
this.setState({isSelectAllChecked:!1,selectedRowIds:[]})},getMultipleSelectionObject:function e(){return{isMultipleSelection:!E(this.props.results,function(e){return"children"in e})&&this.props.isMultipleSelection,
toggleSelectAll:this._toggleSelectAll,getIsSelectAllChecked:this._getIsSelectAllChecked,toggleSelectRow:this._toggleSelectRow,getSelectedRowIds:this.getSelectedRowIds,getIsRowChecked:this._getIsRowChecked
}},isInfiniteScrollEnabled:function e(){return!this.props.useCustomPagerComponent&&this.props.enableInfiniteScroll},getClearFixStyles:function e(){return{clear:"both",display:"table",width:"100%"}},getSettingsStyles:function e(){
return{float:"left",width:"50%",textAlign:"right"}},getFilterStyles:function e(){return{float:"left",width:"50%",textAlign:"left",color:"#222",minHeight:"1px"}},getFilter:function e(){return this.props.showFilter&&this.shouldUseCustomGridComponent()===!1?this.props.useCustomFilterComponent?o.createElement(h,{
changeFilter:this.setFilter,placeholderText:this.props.filterPlaceholderText,customFilterComponent:this.props.customFilterComponent,results:this.props.results,currentResults:this.getCurrentResults()}):o.createElement(s,{
changeFilter:this.setFilter,placeholderText:this.props.filterPlaceholderText}):""},getSettings:function e(){return this.props.showSettings?o.createElement("button",{type:"button",className:this.props.settingsToggleClassName,
onClick:this.toggleColumnChooser,style:this.props.useGriddleStyles?{background:"none",border:"none",padding:0,margin:0,fontSize:14}:null},this.props.settingsText,this.props.settingsIconComponent):""},getTopSection:function e(t,n){
if(this.props.showFilter===!1&&this.props.showSettings===!1)return""
var r=null,i=null,s=null
return this.props.useGriddleStyles&&(r=this.getFilterStyles(),i=this.getSettingsStyles(),s=this.getClearFixStyles()),o.createElement("div",{className:"top-section",style:s},o.createElement("div",{className:"griddle-filter",
style:r},t),o.createElement("div",{className:"griddle-settings-toggle",style:i},n))},getPagingSection:function e(t,n){if((this.props.showPager&&!this.isInfiniteScrollEnabled()&&!this.shouldUseCustomGridComponent())!==!1)return o.createElement("div",{
className:"griddle-footer"},this.props.useCustomPagerComponent?o.createElement(f,{customPagerComponentOptions:this.props.customPagerComponentOptions,next:this.nextPage,previous:this.previousPage,currentPage:t,
maxPage:n,setPage:this.setPage,nextText:this.props.nextText,previousText:this.props.previousText,customPagerComponent:this.props.customPagerComponent}):o.createElement(a,{useGriddleStyles:this.props.useGriddleStyles,
next:this.nextPage,previous:this.previousPage,nextClassName:this.props.nextClassName,nextIconComponent:this.props.nextIconComponent,previousClassName:this.props.previousClassName,previousIconComponent:this.props.previousIconComponent,
currentPage:t,maxPage:n,setPage:this.setPage,nextText:this.props.nextText,previousText:this.props.previousText}))},getColumnSelectorSection:function e(t,n){return this.state.showColumnChooser?o.createElement(l,{
columns:t,selectedColumns:n,setColumns:this.setColumns,settingsText:this.props.settingsText,settingsIconComponent:this.props.settingsIconComponent,maxRowsText:this.props.maxRowsText,setPageSize:this.setPageSize,
showSetPageSize:!this.shouldUseCustomGridComponent(),resultsPerPage:this.state.resultsPerPage,enableToggleCustom:this.props.enableToggleCustom,toggleCustomComponent:this.toggleCustomComponent,useCustomComponent:this.shouldUseCustomRowComponent()||this.shouldUseCustomGridComponent(),
useGriddleStyles:this.props.useGriddleStyles,enableCustomFormatText:this.props.enableCustomFormatText,columnMetadata:this.props.columnMetadata}):""},getCustomGridSection:function e(){return o.createElement(this.props.customGridComponent,r({
data:this.props.results,className:this.props.customGridComponentClassName},this.props.gridMetadata))},getCustomRowSection:function e(t,n,r,i,s){return o.createElement("div",null,o.createElement(d,{data:t,
columns:n,metadataColumns:r,globalData:s,className:this.props.customRowComponentClassName,customComponent:this.props.customRowComponent,style:this.props.useGriddleStyles?this.getClearFixStyles():null}),this.props.showPager&&i)

},getStandardGridSection:function e(t,n,r,s,a){var l=this.getSortObject(),u=this.getMultipleSelectionObject(),p=this.shouldShowNoDataSection(t),c=this.getNoDataSection()
return o.createElement("div",{className:"griddle-body"},o.createElement(i,{useGriddleStyles:this.props.useGriddleStyles,noDataSection:c,showNoData:p,columnSettings:this.columnSettings,rowSettings:this.rowSettings,
sortSettings:l,multipleSelectionSettings:u,filterByColumn:this.filterByColumn,isSubGriddle:this.props.isSubGriddle,useGriddleIcons:this.props.useGriddleIcons,useFixedLayout:this.props.useFixedLayout,showPager:this.props.showPager,
pagingContent:s,data:t,className:this.props.tableClassName,enableInfiniteScroll:this.isInfiniteScrollEnabled(),nextPage:this.nextPage,showTableHeading:this.props.showTableHeading,useFixedHeader:this.props.useFixedHeader,
parentRowCollapsedClassName:this.props.parentRowCollapsedClassName,parentRowExpandedClassName:this.props.parentRowExpandedClassName,parentRowCollapsedComponent:this.props.parentRowCollapsedComponent,parentRowExpandedComponent:this.props.parentRowExpandedComponent,
bodyHeight:this.props.bodyHeight,paddingHeight:this.props.paddingHeight,rowHeight:this.props.rowHeight,infiniteScrollLoadTreshold:this.props.infiniteScrollLoadTreshold,externalLoadingComponent:this.props.externalLoadingComponent,
externalIsLoading:this.props.externalIsLoading,hasMorePages:a,onRowClick:this.props.onRowClick}))},getContentSection:function e(t,n,r,o,i,s){return this.shouldUseCustomGridComponent()&&null!==this.props.customGridComponent?this.getCustomGridSection():this.shouldUseCustomRowComponent()?this.getCustomRowSection(t,n,r,o,s):this.getStandardGridSection(t,n,r,o,i)

},getNoDataSection:function e(){return null!=this.props.customNoDataComponent?o.createElement("div",{className:this.props.noDataClassName},o.createElement(this.props.customNoDataComponent,this.props.customNoDataComponentProps)):o.createElement(u,{
noDataMessage:this.props.noDataMessage})},shouldShowNoDataSection:function e(t){return!this.props.allowEmptyGrid&&(this.props.useExternal===!1&&("undefined"==typeof t||0===t.length)||this.props.useExternal===!0&&this.props.externalIsLoading===!1&&0===t.length)

},render:function e(){var t=this,n=this.getCurrentResults(),r=this.props.tableClassName+" table-header",i=this.getFilter(),s=this.getSettings(),a=this.getTopSection(i,s),l=[],u=this.columnSettings.getColumns(),p=this.getDataForRender(n,u,!0),c=this.columnSettings.getMetadataColumns()


this.props.columnMetadata?_(this.props.columnMetadata,function(e){"boolean"==typeof e.visible&&e.visible===!1||l.push(e.columnName)}):l=y.keys(O(n[0],c)),l=this.columnSettings.orderColumns(l)
var d=this.getCurrentPage(),f=this.getCurrentMaxPage(),h=d+1<f,m=this.getPagingSection(d,f),g=this.getContentSection(p,u,c,m,h,this.props.globalData),v=this.getColumnSelectorSection(l,u),b=this.props.gridClassName.length>0?"griddle "+this.props.gridClassName:"griddle"


return b+=this.shouldUseCustomRowComponent()?" griddle-custom":"",o.createElement("div",{className:b},a,v,o.createElement("div",{className:"griddle-container",style:this.props.useGriddleStyles&&!this.props.isSubGriddle?{
border:"1px solid #DDD"}:null},g))}})
c.Griddle=e.exports=U},function(e,t,n){"use strict"
var r=n(2),o=n(42),i=n(203),s=n(43),a=n(210),l=r.createClass({displayName:"GridTable",getDefaultProps:function e(){return{data:[],columnSettings:null,rowSettings:null,sortSettings:null,multipleSelectionSettings:null,
className:"",enableInfiniteScroll:!1,nextPage:null,hasMorePages:!1,useFixedHeader:!1,useFixedLayout:!0,paddingHeight:null,rowHeight:null,filterByColumn:null,infiniteScrollLoadTreshold:null,bodyHeight:null,
useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",parentRowCollapsedComponent:"▶",parentRowExpandedComponent:"▼",
externalLoadingComponent:null,externalIsLoading:!1,onRowClick:null}},getInitialState:function e(){return{scrollTop:0,scrollHeight:this.props.bodyHeight,clientHeight:this.props.bodyHeight}},componentDidMount:function e(){
this.gridScroll()},componentDidUpdate:function e(t,n){this.gridScroll()},gridScroll:function e(){if(this.props.enableInfiniteScroll&&!this.props.externalIsLoading){var t=this.refs.scrollable,n=t.scrollTop,r=t.scrollHeight,o=t.clientHeight


if(null!==this.props.rowHeight&&this.state.scrollTop!==n&&Math.abs(this.state.scrollTop-n)>=this.getAdjustedRowHeight()){var i={scrollTop:n,scrollHeight:r,clientHeight:o}
this.setState(i)}var s=r-(n+o)-this.props.infiniteScrollLoadTreshold,a=.6*s
a<=this.props.infiniteScrollLoadTreshold&&this.props.nextPage()}},verifyProps:function e(){null===this.props.columnSettings&&console.error("gridTable: The columnSettings prop is null and it shouldn't be"),
null===this.props.rowSettings&&console.error("gridTable: The rowSettings prop is null and it shouldn't be")},getAdjustedRowHeight:function e(){return this.props.rowHeight+2*this.props.paddingHeight},getNodeContent:function e(){
this.verifyProps()
var t=this,n=!1
if(!this.props.externalIsLoading||this.props.enableInfiniteScroll){var o=t.props.data,s=null,a=null,l=!1
if(this.props.enableInfiniteScroll&&null!==this.props.rowHeight&&void 0!==this.refs.scrollable){var u=t.getAdjustedRowHeight(),p=Math.ceil(t.state.clientHeight/u),c=Math.max(0,Math.floor(t.state.scrollTop/u)-.25*p),d=Math.min(c+1.25*p,this.props.data.length-1)


o=o.slice(c,d+1)
var f={height:c*u+"px"}
s=r.createElement("tr",{key:"above-"+f.height,style:f})
var h={height:(this.props.data.length-d)*u+"px"}
a=r.createElement("tr",{key:"below-"+h.height,style:h})}var m=o.map(function(e,o){var s="undefined"!=typeof e.children&&e.children.length>0,a=t.props.rowSettings.getRowKey(e,o)
return s&&(n=s),r.createElement(i,{useGriddleStyles:t.props.useGriddleStyles,isSubGriddle:t.props.isSubGriddle,parentRowExpandedClassName:t.props.parentRowExpandedClassName,parentRowCollapsedClassName:t.props.parentRowCollapsedClassName,
parentRowExpandedComponent:t.props.parentRowExpandedComponent,parentRowCollapsedComponent:t.props.parentRowCollapsedComponent,data:e,key:a+"-container",uniqueId:a,columnSettings:t.props.columnSettings,
rowSettings:t.props.rowSettings,paddingHeight:t.props.paddingHeight,multipleSelectionSettings:t.props.multipleSelectionSettings,rowHeight:t.props.rowHeight,hasChildren:s,tableClassName:t.props.className,
onRowClick:t.props.onRowClick})})
if(this.props.showNoData){var g=this.props.columnSettings.getVisibleColumnCount()
m.push(r.createElement("tr",{key:"no-data-section"},r.createElement("td",{colSpan:g},this.props.noDataSection)))}return s&&m.unshift(s),a&&m.push(a),{nodes:m,anyHasChildren:n}}return null},render:function e(){
var t=this,n=[],i=!1,s=this.getNodeContent()
s&&(n=s.nodes,i=s.anyHasChildren)
var a=null,l=null,u={width:"100%"}
if(this.props.useFixedLayout&&(u.tableLayout="fixed"),this.props.enableInfiniteScroll&&(a={position:"relative",overflowY:"scroll",height:this.props.bodyHeight+"px",width:"100%"}),this.props.externalIsLoading){
var p=null,c=null
this.props.useGriddleStyles&&(p={textAlign:"center",paddingBottom:"40px"}),c=this.props.columnSettings.getVisibleColumnCount()
var d=this.props.externalLoadingComponent?r.createElement(this.props.externalLoadingComponent,null):r.createElement("div",null,"Loading...")
l=r.createElement("tbody",null,r.createElement("tr",null,r.createElement("td",{style:p,colSpan:c},d)))}var f=this.props.showTableHeading?r.createElement(o,{useGriddleStyles:this.props.useGriddleStyles,
useGriddleIcons:this.props.useGriddleIcons,sortSettings:this.props.sortSettings,multipleSelectionSettings:this.props.multipleSelectionSettings,columnSettings:this.props.columnSettings,filterByColumn:this.props.filterByColumn,
rowSettings:this.props.rowSettings}):void 0
i||(n=r.createElement("tbody",null,n))
var h=r.createElement("tbody",null)
if(this.props.showPager){var m=this.props.useGriddleStyles?{padding:"0px",backgroundColor:"#EDEDED",border:"0px",color:"#222",height:this.props.showNoData?"20px":null}:null
h=r.createElement("tbody",null,r.createElement("tr",null,r.createElement("td",{colSpan:this.props.multipleSelectionSettings.isMultipleSelection?this.props.columnSettings.getVisibleColumnCount()+1:this.props.columnSettings.getVisibleColumnCount(),
style:m,className:"footer-container"},this.props.showNoData?null:this.props.pagingContent)))}return this.props.useFixedHeader?(this.props.useGriddleStyles&&(u.tableLayout="fixed"),r.createElement("div",null,r.createElement("table",{
className:this.props.className,style:this.props.useGriddleStyles&&u||null},f),r.createElement("div",{ref:"scrollable",onScroll:this.gridScroll,style:a},r.createElement("table",{className:this.props.className,
style:this.props.useGriddleStyles&&u||null},n,l,h)))):r.createElement("div",{ref:"scrollable",onScroll:this.gridScroll,style:a},r.createElement("table",{className:this.props.className,style:this.props.useGriddleStyles&&u||null
},f,n,l,h))}})
e.exports=l},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(2),i=n(43),s=n(198),a=o.createClass({displayName:"DefaultHeaderComponent",render:function e(){return o.createElement("span",null,this.props.displayName)

}}),l=o.createClass({displayName:"GridTitle",getDefaultProps:function e(){return{columnSettings:null,filterByColumn:function e(){},rowSettings:null,sortSettings:null,multipleSelectionSettings:null,headerStyle:null,
useGriddleStyles:!0,useGriddleIcons:!0,headerStyles:{}}},componentWillMount:function e(){this.verifyProps()},sort:function e(t){var n=this
return function(e){n.props.sortSettings.changeSort(t)}},toggleSelectAll:function e(t){this.props.multipleSelectionSettings.toggleSelectAll()},handleSelectionChange:function e(t){},verifyProps:function e(){
null===this.props.columnSettings&&console.error("gridTitle: The columnSettings prop is null and it shouldn't be"),null===this.props.sortSettings&&console.error("gridTitle: The sortSettings prop is null and it shouldn't be")

},render:function e(){this.verifyProps()
var t=this,n={},i=this.props.columnSettings.getColumns().map(function(e,i){var l={},u="",p=t.props.columnSettings.getMetadataColumnProperty(e,"sortable",!0),c=p?t.props.sortSettings.sortDefaultComponent:null


t.props.sortSettings.sortColumn==e&&"asc"===t.props.sortSettings.sortDirection?(u=t.props.sortSettings.sortAscendingClassName,c=t.props.useGriddleIcons&&t.props.sortSettings.sortAscendingComponent):t.props.sortSettings.sortColumn==e&&"desc"===t.props.sortSettings.sortDirection&&(u+=t.props.sortSettings.sortDescendingClassName,
c=t.props.useGriddleIcons&&t.props.sortSettings.sortDescendingComponent)
var d=t.props.columnSettings.getColumnMetadataByName(e),f=t.props.columnSettings.getMetadataColumnProperty(e,"displayName",e),h=t.props.columnSettings.getMetadataColumnProperty(e,"customHeaderComponent",a),m=t.props.columnSettings.getMetadataColumnProperty(e,"customHeaderComponentProps",{})


u=null==d?u:(u&&u+" "||u)+t.props.columnSettings.getMetadataColumnProperty(e,"cssClassName",""),t.props.useGriddleStyles&&(l={backgroundColor:"#EDEDEF",border:"0px",borderBottom:"1px solid #DDD",color:"#222",
padding:"5px",cursor:p?"pointer":"default"}),n=d&&d.titleStyles?s({},l,d.titleStyles):s({},l)
var g=f?"th":"td"
return o.createElement(g,{onClick:p?t.sort(e):null,"data-title":e,className:u,key:e,style:n},o.createElement(h,r({columnName:e,displayName:f,filterByColumn:t.props.filterByColumn},m)),c)})
i&&this.props.multipleSelectionSettings.isMultipleSelection&&i.unshift(o.createElement("th",{key:"selection",onClick:this.toggleSelectAll,style:n,className:"griddle-select griddle-select-title"},o.createElement("input",{
type:"checkbox",checked:this.props.multipleSelectionSettings.getIsSelectAllChecked(),onChange:this.handleSelectionChange})))
var l=t.props.rowSettings&&t.props.rowSettings.getHeaderRowMetadataClass()||null
return o.createElement("thead",null,o.createElement("tr",{className:l,style:this.props.headerStyles},i))}})
e.exports=l},function(e,t,n){"use strict"
function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(44),s=n(165),a=n(167),l=n(174),u=n(190),p=function(){
function e(){var t=arguments.length<=0||void 0===arguments[0]?[]:arguments[0],n=arguments.length<=1||void 0===arguments[1]?[]:arguments[1],o=arguments.length<=2||void 0===arguments[2]?"children":arguments[2],i=arguments.length<=3||void 0===arguments[3]?[]:arguments[3],s=arguments.length<=4||void 0===arguments[4]?[]:arguments[4]


r(this,e),this.allColumns=t,this.filteredColumns=n,this.childrenColumnName=o,this.columnMetadata=i,this.metadataColumns=s}return o(e,[{key:"getMetadataColumns",value:function e(){var t=i(s(this.columnMetadata,{
visible:!1}),function(e){return e.columnName})
return t.indexOf(this.childrenColumnName)<0&&t.push(this.childrenColumnName),t.concat(this.metadataColumns)}},{key:"getVisibleColumnCount",value:function e(){return this.getColumns().length}},{key:"getColumnMetadataByName",
value:function e(t){return a(this.columnMetadata,{columnName:t})}},{key:"hasColumnMetadata",value:function e(){return null!==this.columnMetadata&&this.columnMetadata.length>0}},{key:"getMetadataColumnProperty",
value:function e(t,n,r){var o=this.getColumnMetadataByName(t)
return"undefined"==typeof o||null===o?r:o.hasOwnProperty(n)?o[n]:r}},{key:"orderColumns",value:function e(t){var n=this,r=100,o=l(t,function(e){var t=a(n.columnMetadata,{columnName:e})
return"undefined"==typeof t||null===t||isNaN(t.order)?r:t.order})
return o}},{key:"getColumns",value:function e(){var t=0===this.filteredColumns.length?this.allColumns:this.filteredColumns
return t=u(t,this.metadataColumns),t=this.orderColumns(t)}}]),e}()
e.exports=p},function(e,t,n){function r(e,t){var n=a(e)?o:s
return n(e,i(t,3))}var o=n(45),i=n(46),s=n(159),a=n(109)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e)
return o}e.exports=n},function(e,t,n){function r(e){return"function"==typeof e?e:null==e?s:"object"==typeof e?a(e)?i(e[0],e[1]):o(e):l(e)}var o=n(47),i=n(140),s=n(155),a=n(109),l=n(156)
e.exports=r},function(e,t,n){function r(e){var t=i(e)
return 1==t.length&&t[0][2]?s(t[0][0],t[0][1]):function(n){return n===e||o(n,e,t)}}var o=n(48),i=n(137),s=n(139)
e.exports=r},function(e,t,n){function r(e,t,n,r){var l=n.length,u=l,p=!r
if(null==e)return!u
for(e=Object(e);l--;){var c=n[l]
if(p&&c[2]?c[1]!==e[c[0]]:!(c[0]in e))return!1}for(;++l<u;){c=n[l]
var d=c[0],f=e[d],h=c[1]
if(p&&c[2]){if(void 0===f&&!(d in e))return!1}else{var m=new o
if(r)var g=r(f,h,d,e,t,m)
if(!(void 0===g?i(h,f,s|a,r,m):g))return!1}}return!0}var o=n(49),i=n(93),s=1,a=2
e.exports=r},function(e,t,n){function r(e){var t=this.__data__=new o(e)
this.size=t.size}var o=n(50),i=n(58),s=n(59),a=n(60),l=n(61),u=n(62)
r.prototype.clear=i,r.prototype.delete=s,r.prototype.get=a,r.prototype.has=l,r.prototype.set=u,e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(51),i=n(52),s=n(55),a=n(56),l=n(57)
r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t){function n(){this.__data__=[],this.size=0}e.exports=n},function(e,t,n){function r(e){
var t=this.__data__,n=o(t,e)
if(n<0)return!1
var r=t.length-1
return n==r?t.pop():s.call(t,n,1),--this.size,!0}var o=n(53),i=Array.prototype,s=i.splice
e.exports=r},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n
return-1}var o=n(54)
e.exports=r},function(e,t){function n(e,t){return e===t||e!==e&&t!==t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e)
return n<0?void 0:t[n][1]}var o=n(53)
e.exports=r},function(e,t,n){function r(e){return o(this.__data__,e)>-1}var o=n(53)
e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__,r=o(n,e)
return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}var o=n(53)
e.exports=r},function(e,t,n){function r(){this.__data__=new o,this.size=0}var o=n(50)
e.exports=r},function(e,t){function n(e){var t=this.__data__,n=t.delete(e)
return this.size=t.size,n}e.exports=n},function(e,t){function n(e){return this.__data__.get(e)}e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t,n){function r(e,t){
var n=this.__data__
if(n instanceof o){var r=n.__data__
if(!i||r.length<a-1)return r.push([e,t]),this.size=++n.size,this
n=this.__data__=new s(r)}return n.set(e,t),this.size=n.size,this}var o=n(50),i=n(63),s=n(78),a=200
e.exports=r},function(e,t,n){var r=n(64),o=n(69),i=r(o,"Map")
e.exports=i},function(e,t,n){function r(e,t){var n=i(e,t)
return o(n)?n:void 0}var o=n(65),i=n(77)
e.exports=r},function(e,t,n){function r(e){if(!s(e)||i(e))return!1
var t=o(e)?h:u
return t.test(a(e))}var o=n(66),i=n(74),s=n(73),a=n(76),l=/[\\^$.*+?()[\]{}|]/g,u=/^\[object .+?Constructor\]$/,p=Function.prototype,c=Object.prototype,d=p.toString,f=c.hasOwnProperty,h=RegExp("^"+d.call(f).replace(l,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$")


e.exports=r},function(e,t,n){function r(e){if(!i(e))return!1
var t=o(e)
return t==a||t==l||t==s||t==u}var o=n(67),i=n(73),s="[object AsyncFunction]",a="[object Function]",l="[object GeneratorFunction]",u="[object Proxy]"
e.exports=r},function(e,t,n){function r(e){return null==e?void 0===e?l:a:u&&u in Object(e)?i(e):s(e)}var o=n(68),i=n(71),s=n(72),a="[object Null]",l="[object Undefined]",u=o?o.toStringTag:void 0
e.exports=r},function(e,t,n){var r=n(69),o=r.Symbol
e.exports=o},function(e,t,n){var r=n(70),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")()
e.exports=i},function(e,t){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t
e.exports=n}).call(t,function(){return this}())},function(e,t,n){function r(e){var t=s.call(e,l),n=e[l]
try{e[l]=void 0
var r=!0}catch(e){}var o=a.call(e)
return r&&(t?e[l]=n:delete e[l]),o}var o=n(68),i=Object.prototype,s=i.hasOwnProperty,a=i.toString,l=o?o.toStringTag:void 0
e.exports=r},function(e,t){function n(e){return o.call(e)}var r=Object.prototype,o=r.toString
e.exports=n},function(e,t){function n(e){var t=typeof e
return null!=e&&("object"==t||"function"==t)}e.exports=n},function(e,t,n){function r(e){return!!i&&i in e}var o=n(75),i=function(){var e=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"")
return e?"Symbol(src)_1."+e:""}()
e.exports=r},function(e,t,n){var r=n(69),o=r["__core-js_shared__"]
e.exports=o},function(e,t){function n(e){if(null!=e){try{return o.call(e)}catch(e){}try{return e+""}catch(e){}}return""}var r=Function.prototype,o=r.toString
e.exports=n},function(e,t){function n(e,t){return null==e?void 0:e[t]}e.exports=n},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(79),i=n(87),s=n(90),a=n(91),l=n(92)
r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.size=0,this.__data__={hash:new o,map:new(s||i),string:new o
}}var o=n(80),i=n(50),s=n(63)
e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(81),i=n(83),s=n(84),a=n(85),l=n(86)
r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.__data__=o?o(null):{},this.size=0}var o=n(82)
e.exports=r},function(e,t,n){var r=n(64),o=r(Object,"create")
e.exports=o},function(e,t){function n(e){var t=this.has(e)&&delete this.__data__[e]
return this.size-=t?1:0,t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__
if(o){var n=t[e]
return n===i?void 0:n}return a.call(t,e)?t[e]:void 0}var o=n(82),i="__lodash_hash_undefined__",s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){function r(e){var t=this.__data__
return o?void 0!==t[e]:s.call(t,e)}var o=n(82),i=Object.prototype,s=i.hasOwnProperty
e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__
return this.size+=this.has(e)?0:1,n[e]=o&&void 0===t?i:t,this}var o=n(82),i="__lodash_hash_undefined__"
e.exports=r},function(e,t,n){function r(e){var t=o(this,e).delete(e)
return this.size-=t?1:0,t}var o=n(88)
e.exports=r},function(e,t,n){function r(e,t){var n=e.__data__
return o(t)?n["string"==typeof t?"string":"hash"]:n.map}var o=n(89)
e.exports=r},function(e,t){function n(e){var t=typeof e
return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}e.exports=n},function(e,t,n){function r(e){return o(this,e).get(e)}var o=n(88)
e.exports=r},function(e,t,n){function r(e){return o(this,e).has(e)}var o=n(88)
e.exports=r},function(e,t,n){function r(e,t){var n=o(this,e),r=n.size
return n.set(e,t),this.size+=n.size==r?0:1,this}var o=n(88)
e.exports=r},function(e,t,n){function r(e,t,n,s,a){return e===t||(null==e||null==t||!i(e)&&!i(t)?e!==e&&t!==t:o(e,t,n,s,r,a))}var o=n(94),i=n(118)
e.exports=r},function(e,t,n){function r(e,t,n,r,g,v){var b=u(e),E=u(t),C=b?h:l(e),_=E?h:l(t)
C=C==f?m:C,_=_==f?m:_
var S=C==m,w=_==m,P=C==_
if(P&&p(e)){if(!p(t))return!1
b=!0,S=!1}if(P&&!S)return v||(v=new o),b||c(e)?i(e,t,n,r,g,v):s(e,t,C,n,r,g,v)
if(!(n&d)){var F=S&&y.call(e,"__wrapped__"),x=w&&y.call(t,"__wrapped__")
if(F||x){var T=F?e.value():e,O=x?t.value():t
return v||(v=new o),g(T,O,n,r,v)}}return!!P&&(v||(v=new o),a(e,t,n,r,g,v))}var o=n(49),i=n(95),s=n(101),a=n(105),l=n(132),u=n(109),p=n(119),c=n(122),d=1,f="[object Arguments]",h="[object Array]",m="[object Object]",g=Object.prototype,y=g.hasOwnProperty


e.exports=r},function(e,t,n){function r(e,t,n,r,u,p){var c=n&a,d=e.length,f=t.length
if(d!=f&&!(c&&f>d))return!1
var h=p.get(e)
if(h&&p.get(t))return h==t
var m=-1,g=!0,y=n&l?new o:void 0
for(p.set(e,t),p.set(t,e);++m<d;){var v=e[m],b=t[m]
if(r)var E=c?r(b,v,m,t,e,p):r(v,b,m,e,t,p)
if(void 0!==E){if(E)continue
g=!1
break}if(y){if(!i(t,function(e,t){if(!s(y,t)&&(v===e||u(v,e,n,r,p)))return y.push(t)})){g=!1
break}}else if(v!==b&&!u(v,b,n,r,p)){g=!1
break}}return p.delete(e),p.delete(t),g}var o=n(96),i=n(99),s=n(100),a=1,l=2
e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.__data__=new o;++t<n;)this.add(e[t])}var o=n(78),i=n(97),s=n(98)
r.prototype.add=r.prototype.push=i,r.prototype.has=s,e.exports=r},function(e,t){function n(e){return this.__data__.set(e,r),this}var r="__lodash_hash_undefined__"
e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0
return!1}e.exports=n},function(e,t){function n(e,t){return e.has(t)}e.exports=n},function(e,t,n){function r(e,t,n,r,o,S,P){switch(n){case _:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1


e=e.buffer,t=t.buffer
case C:return!(e.byteLength!=t.byteLength||!S(new i(e),new i(t)))
case d:case f:case g:return s(+e,+t)
case h:return e.name==t.name&&e.message==t.message
case y:case b:return e==t+""
case m:var F=l
case v:var x=r&p
if(F||(F=u),e.size!=t.size&&!x)return!1
var T=P.get(e)
if(T)return T==t
r|=c,P.set(e,t)
var O=a(F(e),F(t),r,o,S,P)
return P.delete(e),O
case E:if(w)return w.call(e)==w.call(t)}return!1}var o=n(68),i=n(102),s=n(54),a=n(95),l=n(103),u=n(104),p=1,c=2,d="[object Boolean]",f="[object Date]",h="[object Error]",m="[object Map]",g="[object Number]",y="[object RegExp]",v="[object Set]",b="[object String]",E="[object Symbol]",C="[object ArrayBuffer]",_="[object DataView]",S=o?o.prototype:void 0,w=S?S.valueOf:void 0


e.exports=r},function(e,t,n){var r=n(69),o=r.Uint8Array
e.exports=o},function(e,t){function n(e){var t=-1,n=Array(e.size)
return e.forEach(function(e,r){n[++t]=[r,e]}),n}e.exports=n},function(e,t){function n(e){var t=-1,n=Array(e.size)
return e.forEach(function(e){n[++t]=e}),n}e.exports=n},function(e,t,n){function r(e,t,n,r,s,l){var u=n&i,p=o(e),c=p.length,d=o(t),f=d.length
if(c!=f&&!u)return!1
for(var h=c;h--;){var m=p[h]
if(!(u?m in t:a.call(t,m)))return!1}var g=l.get(e)
if(g&&l.get(t))return g==t
var y=!0
l.set(e,t),l.set(t,e)
for(var v=u;++h<c;){m=p[h]
var b=e[m],E=t[m]
if(r)var C=u?r(E,b,m,t,e,l):r(b,E,m,e,t,l)
if(!(void 0===C?b===E||s(b,E,n,r,l):C)){y=!1
break}v||(v="constructor"==m)}if(y&&!v){var _=e.constructor,S=t.constructor
_!=S&&"constructor"in e&&"constructor"in t&&!("function"==typeof _&&_ instanceof _&&"function"==typeof S&&S instanceof S)&&(y=!1)}return l.delete(e),l.delete(t),y}var o=n(106),i=1,s=Object.prototype,a=s.hasOwnProperty


e.exports=r},function(e,t,n){function r(e){return o(e,s,i)}var o=n(107),i=n(110),s=n(113)
e.exports=r},function(e,t,n){function r(e,t,n){var r=t(e)
return i(e)?r:o(r,n(e))}var o=n(108),i=n(109)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n]
return e}e.exports=n},function(e,t){var n=Array.isArray
e.exports=n},function(e,t,n){var r=n(111),o=n(112),i=Object.prototype,s=i.propertyIsEnumerable,a=Object.getOwnPropertySymbols,l=a?function(e){return null==e?[]:(e=Object(e),r(a(e),function(t){return s.call(e,t)

}))}:o
e.exports=l},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=0,i=[];++n<r;){var s=e[n]
t(s,n,e)&&(i[o++]=s)}return i}e.exports=n},function(e,t){function n(){return[]}e.exports=n},function(e,t,n){function r(e){return s(e)?o(e):i(e)}var o=n(114),i=n(127),s=n(131)
e.exports=r},function(e,t,n){function r(e,t){var n=s(e),r=!n&&i(e),p=!n&&!r&&a(e),d=!n&&!r&&!p&&u(e),f=n||r||p||d,h=f?o(e.length,String):[],m=h.length
for(var g in e)!t&&!c.call(e,g)||f&&("length"==g||p&&("offset"==g||"parent"==g)||d&&("buffer"==g||"byteLength"==g||"byteOffset"==g)||l(g,m))||h.push(g)
return h}var o=n(115),i=n(116),s=n(109),a=n(119),l=n(121),u=n(122),p=Object.prototype,c=p.hasOwnProperty
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n)
return r}e.exports=n},function(e,t,n){var r=n(117),o=n(118),i=Object.prototype,s=i.hasOwnProperty,a=i.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&s.call(e,"callee")&&!a.call(e,"callee")

}
e.exports=l},function(e,t,n){function r(e){return i(e)&&o(e)==s}var o=n(67),i=n(118),s="[object Arguments]"
e.exports=r},function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},function(e,t,n){(function(e){var r=n(69),o=n(120),i="object"==typeof t&&t&&!t.nodeType&&t,s=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=s&&s.exports===i,l=a?r.Buffer:void 0,u=l?l.isBuffer:void 0,p=u||o


e.exports=p}).call(t,n(29)(e))},function(e,t){function n(){return!1}e.exports=n},function(e,t){function n(e,t){return t=null==t?r:t,!!t&&("number"==typeof e||o.test(e))&&e>-1&&e%1==0&&e<t}var r=9007199254740991,o=/^(?:0|[1-9]\d*)$/


e.exports=n},function(e,t,n){var r=n(123),o=n(125),i=n(126),s=i&&i.isTypedArray,a=s?o(s):r
e.exports=a},function(e,t,n){function r(e){return s(e)&&i(e.length)&&!!A[o(e)]}var o=n(67),i=n(124),s=n(118),a="[object Arguments]",l="[object Array]",u="[object Boolean]",p="[object Date]",c="[object Error]",d="[object Function]",f="[object Map]",h="[object Number]",m="[object Object]",g="[object RegExp]",y="[object Set]",v="[object String]",b="[object WeakMap]",E="[object ArrayBuffer]",C="[object DataView]",_="[object Float32Array]",S="[object Float64Array]",w="[object Int8Array]",P="[object Int16Array]",F="[object Int32Array]",x="[object Uint8Array]",T="[object Uint8ClampedArray]",O="[object Uint16Array]",I="[object Uint32Array]",A={}


A[_]=A[S]=A[w]=A[P]=A[F]=A[x]=A[T]=A[O]=A[I]=!0,A[a]=A[l]=A[E]=A[u]=A[C]=A[p]=A[c]=A[d]=A[f]=A[h]=A[m]=A[g]=A[y]=A[v]=A[b]=!1,e.exports=r},function(e,t){function n(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=r

}var r=9007199254740991
e.exports=n},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n},function(e,t,n){(function(e){var r=n(70),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,s=i&&i.exports===o,a=s&&r.process,l=function(){
try{return a&&a.binding&&a.binding("util")}catch(e){}}()
e.exports=l}).call(t,n(29)(e))},function(e,t,n){function r(e){if(!o(e))return i(e)
var t=[]
for(var n in Object(e))a.call(e,n)&&"constructor"!=n&&t.push(n)
return t}var o=n(128),i=n(129),s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t){function n(e){var t=e&&e.constructor,n="function"==typeof t&&t.prototype||r
return e===n}var r=Object.prototype
e.exports=n},function(e,t,n){var r=n(130),o=r(Object.keys,Object)
e.exports=o},function(e,t){function n(e,t){return function(n){return e(t(n))}}e.exports=n},function(e,t,n){function r(e){return null!=e&&i(e.length)&&!o(e)}var o=n(66),i=n(124)
e.exports=r},function(e,t,n){var r=n(133),o=n(63),i=n(134),s=n(135),a=n(136),l=n(67),u=n(76),p="[object Map]",c="[object Object]",d="[object Promise]",f="[object Set]",h="[object WeakMap]",m="[object DataView]",g=u(r),y=u(o),v=u(i),b=u(s),E=u(a),C=l

;(r&&C(new r(new ArrayBuffer(1)))!=m||o&&C(new o)!=p||i&&C(i.resolve())!=d||s&&C(new s)!=f||a&&C(new a)!=h)&&(C=function(e){var t=l(e),n=t==c?e.constructor:void 0,r=n?u(n):""
if(r)switch(r){case g:return m
case y:return p
case v:return d
case b:return f
case E:return h}return t}),e.exports=C},function(e,t,n){var r=n(64),o=n(69),i=r(o,"DataView")
e.exports=i},function(e,t,n){var r=n(64),o=n(69),i=r(o,"Promise")
e.exports=i},function(e,t,n){var r=n(64),o=n(69),i=r(o,"Set")
e.exports=i},function(e,t,n){var r=n(64),o=n(69),i=r(o,"WeakMap")
e.exports=i},function(e,t,n){function r(e){for(var t=i(e),n=t.length;n--;){var r=t[n],s=e[r]
t[n]=[r,s,o(s)]}return t}var o=n(138),i=n(113)
e.exports=r},function(e,t,n){function r(e){return e===e&&!o(e)}var o=n(73)
e.exports=r},function(e,t){function n(e,t){return function(n){return null!=n&&(n[e]===t&&(void 0!==t||e in Object(n)))}}e.exports=n},function(e,t,n){function r(e,t){return a(e)&&l(t)?u(p(e),t):function(n){
var r=i(n,e)
return void 0===r&&r===t?s(n,e):o(t,r,c|d)}}var o=n(93),i=n(141),s=n(152),a=n(144),l=n(138),u=n(139),p=n(151),c=1,d=2
e.exports=r},function(e,t,n){function r(e,t,n){var r=null==e?void 0:o(e,t)
return void 0===r?n:r}var o=n(142)
e.exports=r},function(e,t,n){function r(e,t){t=o(t,e)
for(var n=0,r=t.length;null!=e&&n<r;)e=e[i(t[n++])]
return n&&n==r?e:void 0}var o=n(143),i=n(151)
e.exports=r},function(e,t,n){function r(e,t){return o(e)?e:i(e,t)?[e]:s(a(e))}var o=n(109),i=n(144),s=n(146),a=n(149)
e.exports=r},function(e,t,n){function r(e,t){if(o(e))return!1
var n=typeof e
return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!i(e))||(a.test(e)||!s.test(e)||null!=t&&e in Object(t))}var o=n(109),i=n(145),s=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,a=/^\w*$/
e.exports=r},function(e,t,n){function r(e){return"symbol"==typeof e||i(e)&&o(e)==s}var o=n(67),i=n(118),s="[object Symbol]"
e.exports=r},function(e,t,n){var r=n(147),o=/^\./,i=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,s=/\\(\\)?/g,a=r(function(e){var t=[]
return o.test(e)&&t.push(""),e.replace(i,function(e,n,r,o){t.push(r?o.replace(s,"$1"):n||e)}),t})
e.exports=a},function(e,t,n){function r(e){var t=o(e,function(e){return n.size===i&&n.clear(),e}),n=t.cache
return t}var o=n(148),i=500
e.exports=r},function(e,t,n){function r(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError(i)
var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],i=n.cache
if(i.has(o))return i.get(o)
var s=e.apply(this,r)
return n.cache=i.set(o,s)||i,s}
return n.cache=new(r.Cache||o),n}var o=n(78),i="Expected a function"
r.Cache=o,e.exports=r},function(e,t,n){function r(e){return null==e?"":o(e)}var o=n(150)
e.exports=r},function(e,t,n){function r(e){if("string"==typeof e)return e
if(s(e))return i(e,r)+""
if(a(e))return p?p.call(e):""
var t=e+""
return"0"==t&&1/e==-l?"-0":t}var o=n(68),i=n(45),s=n(109),a=n(145),l=1/0,u=o?o.prototype:void 0,p=u?u.toString:void 0
e.exports=r},function(e,t,n){function r(e){if("string"==typeof e||o(e))return e
var t=e+""
return"0"==t&&1/e==-i?"-0":t}var o=n(145),i=1/0
e.exports=r},function(e,t,n){function r(e,t){return null!=e&&i(e,t,o)}var o=n(153),i=n(154)
e.exports=r},function(e,t){function n(e,t){return null!=e&&t in Object(e)}e.exports=n},function(e,t,n){function r(e,t,n){t=o(t,e)
for(var r=-1,p=t.length,c=!1;++r<p;){var d=u(t[r])
if(!(c=null!=e&&n(e,d)))break
e=e[d]}return c||++r!=p?c:(p=null==e?0:e.length,!!p&&l(p)&&a(d,p)&&(s(e)||i(e)))}var o=n(143),i=n(116),s=n(109),a=n(121),l=n(124),u=n(151)
e.exports=r},function(e,t){function n(e){return e}e.exports=n},function(e,t,n){function r(e){return s(e)?o(a(e)):i(e)}var o=n(157),i=n(158),s=n(144),a=n(151)
e.exports=r},function(e,t){function n(e){return function(t){return null==t?void 0:t[e]}}e.exports=n},function(e,t,n){function r(e){return function(t){return o(t,e)}}var o=n(142)
e.exports=r},function(e,t,n){function r(e,t){var n=-1,r=i(e)?Array(e.length):[]
return o(e,function(e,o,i){r[++n]=t(e,o,i)}),r}var o=n(160),i=n(131)
e.exports=r},function(e,t,n){var r=n(161),o=n(164),i=o(r)
e.exports=i},function(e,t,n){function r(e,t){return e&&o(e,t,i)}var o=n(162),i=n(113)
e.exports=r},function(e,t,n){var r=n(163),o=r()
e.exports=o},function(e,t){function n(e){return function(t,n,r){for(var o=-1,i=Object(t),s=r(t),a=s.length;a--;){var l=s[e?a:++o]
if(n(i[l],l,i)===!1)break}return t}}e.exports=n},function(e,t,n){function r(e,t){return function(n,r){if(null==n)return n
if(!o(n))return e(n,r)
for(var i=n.length,s=t?i:-1,a=Object(n);(t?s--:++s<i)&&r(a[s],s,a)!==!1;);return n}}var o=n(131)
e.exports=r},function(e,t,n){function r(e,t){var n=a(e)?o:i
return n(e,s(t,3))}var o=n(111),i=n(166),s=n(46),a=n(109)
e.exports=r},function(e,t,n){function r(e,t){var n=[]
return o(e,function(e,r,o){t(e,r,o)&&n.push(e)}),n}var o=n(160)
e.exports=r},function(e,t,n){var r=n(168),o=n(169),i=r(o)
e.exports=i},function(e,t,n){function r(e){return function(t,n,r){var a=Object(t)
if(!i(t)){var l=o(n,3)
t=s(t),n=function(e){return l(a[e],e,a)}}var u=e(t,n,r)
return u>-1?a[l?t[u]:u]:void 0}}var o=n(46),i=n(131),s=n(113)
e.exports=r},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
if(!r)return-1
var l=null==n?0:s(n)
return l<0&&(l=a(r+l,0)),o(e,i(t,3),l)}var o=n(170),i=n(46),s=n(171),a=Math.max
e.exports=r},function(e,t){function n(e,t,n,r){for(var o=e.length,i=n+(r?1:-1);r?i--:++i<o;)if(t(e[i],i,e))return i
return-1}e.exports=n},function(e,t,n){function r(e){var t=o(e),n=t%1
return t===t?n?t-n:t:0}var o=n(172)
e.exports=r},function(e,t,n){function r(e){if(!e)return 0===e?e:0
if(e=o(e),e===i||e===-i){var t=e<0?-1:1
return t*s}return e===e?e:0}var o=n(173),i=1/0,s=1.7976931348623157e308
e.exports=r},function(e,t,n){function r(e){if("number"==typeof e)return e
if(i(e))return s
if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e
e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e
e=e.replace(a,"")
var n=u.test(e)
return n||p.test(e)?c(e.slice(2),n?2:8):l.test(e)?s:+e}var o=n(73),i=n(145),s=NaN,a=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,u=/^0b[01]+$/i,p=/^0o[0-7]+$/i,c=parseInt
e.exports=r},function(e,t,n){var r=n(175),o=n(177),i=n(181),s=n(189),a=i(function(e,t){if(null==e)return[]
var n=t.length
return n>1&&s(e,t[0],t[1])?t=[]:n>2&&s(t[0],t[1],t[2])&&(t=[t[0]]),o(e,r(t,1),[])})
e.exports=a},function(e,t,n){function r(e,t,n,s,a){var l=-1,u=e.length
for(n||(n=i),a||(a=[]);++l<u;){var p=e[l]
t>0&&n(p)?t>1?r(p,t-1,n,s,a):o(a,p):s||(a[a.length]=p)}return a}var o=n(108),i=n(176)
e.exports=r},function(e,t,n){function r(e){return s(e)||i(e)||!!(a&&e&&e[a])}var o=n(68),i=n(116),s=n(109),a=o?o.isConcatSpreadable:void 0
e.exports=r},function(e,t,n){function r(e,t,n){var r=-1
t=o(t.length?t:[p],l(i))
var c=s(e,function(e,n,i){var s=o(t,function(t){return t(e)})
return{criteria:s,index:++r,value:e}})
return a(c,function(e,t){return u(e,t,n)})}var o=n(45),i=n(46),s=n(159),a=n(178),l=n(125),u=n(179),p=n(155)
e.exports=r},function(e,t){function n(e,t){var n=e.length
for(e.sort(t);n--;)e[n]=e[n].value
return e}e.exports=n},function(e,t,n){function r(e,t,n){for(var r=-1,i=e.criteria,s=t.criteria,a=i.length,l=n.length;++r<a;){var u=o(i[r],s[r])
if(u){if(r>=l)return u
var p=n[r]
return u*("desc"==p?-1:1)}}return e.index-t.index}var o=n(180)
e.exports=r},function(e,t,n){function r(e,t){if(e!==t){var n=void 0!==e,r=null===e,i=e===e,s=o(e),a=void 0!==t,l=null===t,u=t===t,p=o(t)
if(!l&&!p&&!s&&e>t||s&&a&&u&&!l&&!p||r&&a&&u||!n&&u||!i)return 1
if(!r&&!s&&!p&&e<t||p&&n&&i&&!r&&!s||l&&n&&i||!a&&i||!u)return-1}return 0}var o=n(145)
e.exports=r},function(e,t,n){function r(e,t){return s(i(e,t,o),e+"")}var o=n(155),i=n(182),s=n(184)
e.exports=r},function(e,t,n){function r(e,t,n){return t=i(void 0===t?e.length-1:t,0),function(){for(var r=arguments,s=-1,a=i(r.length-t,0),l=Array(a);++s<a;)l[s]=r[t+s]
s=-1
for(var u=Array(t+1);++s<t;)u[s]=r[s]
return u[t]=n(l),o(e,this,u)}}var o=n(183),i=Math.max
e.exports=r},function(e,t){function n(e,t,n){switch(n.length){case 0:return e.call(t)
case 1:return e.call(t,n[0])
case 2:return e.call(t,n[0],n[1])
case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.exports=n},function(e,t,n){var r=n(185),o=n(188),i=o(r)
e.exports=i},function(e,t,n){var r=n(186),o=n(187),i=n(155),s=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:i
e.exports=s},function(e,t){function n(e){return function(){return e}}e.exports=n},function(e,t,n){var r=n(64),o=function(){try{var e=r(Object,"defineProperty")
return e({},"",{}),e}catch(e){}}()
e.exports=o},function(e,t){function n(e){var t=0,n=0
return function(){var s=i(),a=o-(s-n)
if(n=s,a>0){if(++t>=r)return arguments[0]}else t=0
return e.apply(void 0,arguments)}}var r=800,o=16,i=Date.now
e.exports=n},function(e,t,n){function r(e,t,n){if(!a(n))return!1
var r=typeof t
return!!("number"==r?i(n)&&s(t,n.length):"string"==r&&t in n)&&o(n[t],e)}var o=n(54),i=n(131),s=n(121),a=n(73)
e.exports=r},function(e,t,n){var r=n(191),o=n(175),i=n(181),s=n(197),a=i(function(e,t){return s(e)?r(e,o(t,1,s,!0)):[]})
e.exports=a},function(e,t,n){function r(e,t,n,r){var c=-1,d=i,f=!0,h=e.length,m=[],g=t.length
if(!h)return m
n&&(t=a(t,l(n))),r?(d=s,f=!1):t.length>=p&&(d=u,f=!1,t=new o(t))
e:for(;++c<h;){var y=e[c],v=null==n?y:n(y)
if(y=r||0!==y?y:0,f&&v===v){for(var b=g;b--;)if(t[b]===v)continue e
m.push(y)}else d(t,v,r)||m.push(y)}return m}var o=n(96),i=n(192),s=n(196),a=n(45),l=n(125),u=n(100),p=200
e.exports=r},function(e,t,n){function r(e,t){var n=null==e?0:e.length
return!!n&&o(e,t,0)>-1}var o=n(193)
e.exports=r},function(e,t,n){function r(e,t,n){return t===t?s(e,t,n):o(e,i,n)}var o=n(170),i=n(194),s=n(195)
e.exports=r},function(e,t){function n(e){return e!==e}e.exports=n},function(e,t){function n(e,t,n){for(var r=n-1,o=e.length;++r<o;)if(e[r]===t)return r
return-1}e.exports=n},function(e,t){function n(e,t,n){for(var r=-1,o=null==e?0:e.length;++r<o;)if(n(t,e[r]))return!0
return!1}e.exports=n},function(e,t,n){function r(e){return i(e)&&o(e)}var o=n(131),i=n(118)
e.exports=r},function(e,t,n){var r=n(199),o=n(201),i=n(202),s=n(131),a=n(128),l=n(113),u=Object.prototype,p=u.hasOwnProperty,c=i(function(e,t){if(a(t)||s(t))return void o(t,l(t),e)
for(var n in t)p.call(t,n)&&r(e,n,t[n])})
e.exports=c},function(e,t,n){function r(e,t,n){var r=e[t]
a.call(e,t)&&i(r,n)&&(void 0!==n||t in e)||o(e,t,n)}var o=n(200),i=n(54),s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){function r(e,t,n){"__proto__"==t&&o?o(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}var o=n(187)
e.exports=r},function(e,t,n){function r(e,t,n,r){var s=!n
n||(n={})
for(var a=-1,l=t.length;++a<l;){var u=t[a],p=r?r(n[u],e[u],u,n,e):void 0
void 0===p&&(p=e[u]),s?i(n,u,p):o(n,u,p)}return n}var o=n(199),i=n(200)
e.exports=r},function(e,t,n){function r(e){return o(function(t,n){var r=-1,o=n.length,s=o>1?n[o-1]:void 0,a=o>2?n[2]:void 0
for(s=e.length>3&&"function"==typeof s?(o--,s):void 0,a&&i(n[0],n[1],a)&&(s=o<3?void 0:s,o=1),t=Object(t);++r<o;){var l=n[r]
l&&e(t,l,r,s)}return t})}var o=n(181),i=n(189)
e.exports=r},function(e,t,n){"use strict"
var r=n(2),o=n(43),i=n(204),s=r.createClass({displayName:"GridRowContainer",getDefaultProps:function e(){return{useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,columnSettings:null,rowSettings:null,
paddingHeight:null,rowHeight:null,parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",parentRowCollapsedComponent:"▶",parentRowExpandedComponent:"▼",onRowClick:null,
multipleSelectionSettings:null}},getInitialState:function e(){return{data:{},showChildren:!1}},componentWillReceiveProps:function e(){this.setShowChildren(!1)},toggleChildren:function e(){this.setShowChildren(this.state.showChildren===!1)

},setShowChildren:function e(t){this.setState({showChildren:t})},verifyProps:function e(){null===this.props.columnSettings&&console.error("gridRowContainer: The columnSettings prop is null and it shouldn't be")

},render:function e(){this.verifyProps()
var t=this
if("undefined"==typeof this.props.data)return r.createElement("tbody",null)
var n=[],o=this.props.columnSettings.getColumns()
n.push(r.createElement(this.props.rowSettings.rowComponent,{useGriddleStyles:this.props.useGriddleStyles,isSubGriddle:this.props.isSubGriddle,data:this.props.rowSettings.isCustom?i(this.props.data,o):this.props.data,
rowData:this.props.rowSettings.isCustom?this.props.data:null,columnSettings:this.props.columnSettings,rowSettings:this.props.rowSettings,hasChildren:t.props.hasChildren,toggleChildren:t.toggleChildren,
showChildren:t.state.showChildren,key:t.props.uniqueId+"_base_row",useGriddleIcons:t.props.useGriddleIcons,parentRowExpandedClassName:this.props.parentRowExpandedClassName,parentRowCollapsedClassName:this.props.parentRowCollapsedClassName,
parentRowExpandedComponent:this.props.parentRowExpandedComponent,parentRowCollapsedComponent:this.props.parentRowCollapsedComponent,paddingHeight:t.props.paddingHeight,rowHeight:t.props.rowHeight,onRowClick:t.props.onRowClick,
multipleSelectionSettings:this.props.multipleSelectionSettings}))
var s=null
return t.state.showChildren&&(s=t.props.hasChildren&&this.props.data.children.map(function(e,n){var o=t.props.rowSettings.getRowKey(e,n)
if("undefined"!=typeof e.children){var i=t.constructor.Griddle
return r.createElement("tr",{key:o,style:{paddingLeft:5}},r.createElement("td",{colSpan:t.props.columnSettings.getVisibleColumnCount(),className:"griddle-parent",style:t.props.useGriddleStyles?{border:"none",
padding:"0 0 0 5px"}:null},r.createElement(i,{rowMetadata:{key:"id"},isSubGriddle:!0,results:[e],columns:t.props.columnSettings.getColumns(),tableClassName:t.props.tableClassName,parentRowExpandedClassName:t.props.parentRowExpandedClassName,
parentRowCollapsedClassName:t.props.parentRowCollapsedClassName,showTableHeading:!1,showPager:!1,columnMetadata:t.props.columnSettings.columnMetadata,parentRowExpandedComponent:t.props.parentRowExpandedComponent,
parentRowCollapsedComponent:t.props.parentRowCollapsedComponent,paddingHeight:t.props.paddingHeight,rowHeight:t.props.rowHeight})))}return r.createElement(t.props.rowSettings.rowComponent,{useGriddleStyles:t.props.useGriddleStyles,
isSubGriddle:t.props.isSubGriddle,data:e,columnSettings:t.props.columnSettings,isChildRow:!0,columnMetadata:t.props.columnSettings.columnMetadata,key:o})})),t.props.hasChildren===!1?n[0]:r.createElement("tbody",null,t.state.showChildren?n.concat(s):n)

}})
e.exports=s},function(e,t,n){var r=n(205),o=n(208),i=o(function(e,t){return null==e?{}:r(e,t)})
e.exports=i},function(e,t,n){function r(e,t){return o(e,t,function(t,n){return i(e,n)})}var o=n(206),i=n(152)
e.exports=r},function(e,t,n){function r(e,t,n){for(var r=-1,a=t.length,l={};++r<a;){var u=t[r],p=o(e,u)
n(p,u)&&i(l,s(u,e),p)}return l}var o=n(142),i=n(207),s=n(143)
e.exports=r},function(e,t,n){function r(e,t,n,r){if(!a(e))return e
t=i(t,e)
for(var u=-1,p=t.length,c=p-1,d=e;null!=d&&++u<p;){var f=l(t[u]),h=n
if(u!=c){var m=d[f]
h=r?r(m,f,d):void 0,void 0===h&&(h=a(m)?m:s(t[u+1])?[]:{})}o(d,f,h),d=d[f]}return e}var o=n(199),i=n(143),s=n(121),a=n(73),l=n(151)
e.exports=r},function(e,t,n){function r(e){return s(i(e,void 0,o),e+"")}var o=n(209),i=n(182),s=n(184)
e.exports=r},function(e,t,n){function r(e){var t=null==e?0:e.length
return t?o(e,1):[]}var o=n(175)
e.exports=r},function(e,t,n){"use strict"
function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(211),s=function(){function e(){
var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=arguments.length<=1||void 0===arguments[1]?null:arguments[1],o=!(arguments.length<=2||void 0===arguments[2])&&arguments[2]
r(this,e),this.rowMetadata=t,this.rowComponent=n,this.isCustom=o}return o(e,[{key:"getRowKey",value:function e(t,n){var r
return r=this.hasRowMetadataKey()?t[this.rowMetadata.key]:i("grid_row")}},{key:"hasRowMetadataKey",value:function e(){return this.hasRowMetadata()&&null!==this.rowMetadata.key&&void 0!==this.rowMetadata.key

}},{key:"getBodyRowMetadataClass",value:function e(t){return this.hasRowMetadata()&&null!==this.rowMetadata.bodyCssClassName&&void 0!==this.rowMetadata.bodyCssClassName?"function"==typeof this.rowMetadata.bodyCssClassName?this.rowMetadata.bodyCssClassName(t):this.rowMetadata.bodyCssClassName:null

}},{key:"getHeaderRowMetadataClass",value:function e(){return this.hasRowMetadata()&&null!==this.rowMetadata.headerCssClassName&&void 0!==this.rowMetadata.headerCssClassName?this.rowMetadata.headerCssClassName:null

}},{key:"hasRowMetadata",value:function e(){return null!==this.rowMetadata}}]),e}()
e.exports=s},function(e,t,n){function r(e){var t=++i
return o(e)+t}var o=n(149),i=0
e.exports=r},function(e,t,n){"use strict"
var r=n(2),o=r.createClass({displayName:"GridFilter",getDefaultProps:function e(){return{placeholderText:""}},handleChange:function e(t){this.props.changeFilter(t.target.value)},render:function e(){return r.createElement("div",{
className:"filter-container"},r.createElement("input",{type:"text",name:"filter",placeholder:this.props.placeholderText,className:"form-control",onChange:this.handleChange}))}})
e.exports=o},function(e,t,n){"use strict"
var r=n(2),o=n(198),i=r.createClass({displayName:"GridPagination",getDefaultProps:function e(){return{maxPage:0,nextText:"",previousText:"",currentPage:0,useGriddleStyles:!0,nextClassName:"griddle-next",
previousClassName:"griddle-previous",nextIconComponent:null,previousIconComponent:null}},pageChange:function e(t){this.props.setPage(parseInt(t.target.value,10)-1)},render:function e(){var t="",n=""
this.props.currentPage>0&&(t=r.createElement("button",{type:"button",onClick:this.props.previous,style:this.props.useGriddleStyles?{color:"#222",border:"none",background:"none",margin:"0 0 0 10px"}:null
},this.props.previousIconComponent,this.props.previousText)),this.props.currentPage!==this.props.maxPage-1&&(n=r.createElement("button",{type:"button",onClick:this.props.next,style:this.props.useGriddleStyles?{
color:"#222",border:"none",background:"none",margin:"0 10px 0 0"}:null},this.props.nextText,this.props.nextIconComponent))
var i=null,s=null,a=null
if(this.props.useGriddleStyles===!0){var l={float:"left",minHeight:"1px",marginTop:"5px"}
a=o({textAlign:"right",width:"34%"},l),s=o({textAlign:"center",width:"33%"},l),i=o({width:"33%"},l)}for(var u=[],p=1;p<=this.props.maxPage;p++)u.push(r.createElement("option",{value:p,key:p},p))
return r.createElement("div",{style:this.props.useGriddleStyles?{minHeight:"35px"}:null},r.createElement("div",{className:this.props.previousClassName,style:i},t),r.createElement("div",{className:"griddle-page",
style:s},r.createElement("select",{value:this.props.currentPage+1,onChange:this.pageChange},u)," / ",this.props.maxPage),r.createElement("div",{className:this.props.nextClassName,style:a},n))}})
e.exports=i},function(e,t,n){"use strict"
var r=n(2),o=n(215),i=n(219),s=n(167),a=r.createClass({displayName:"GridSettings",getDefaultProps:function e(){return{columns:[],columnMetadata:[],selectedColumns:[],settingsText:"",maxRowsText:"",resultsPerPage:0,
enableToggleCustom:!1,useCustomComponent:!1,useGriddleStyles:!0,toggleCustomComponent:function e(){}}},setPageSize:function e(t){var n=parseInt(t.target.value,10)
this.props.setPageSize(n)},handleChange:function e(t){var n=t.target.dataset?t.target.dataset.name:t.target.getAttribute("data-name")
t.target.checked===!0&&o(this.props.selectedColumns,n)===!1?(this.props.selectedColumns.push(n),this.props.setColumns(this.props.selectedColumns)):this.props.setColumns(i(this.props.selectedColumns,n))

},render:function e(){var t=this,n=[]
t.props.useCustomComponent===!1&&(n=this.props.columns.map(function(e,n){var i=o(t.props.selectedColumns,e),a=s(t.props.columnMetadata,{columnName:e}),l=e
return"undefined"!=typeof a&&"undefined"!=typeof a.displayName&&null!=a.displayName&&(l=a.displayName),"undefined"!=typeof a&&null!=a&&a.locked?r.createElement("div",{className:"column checkbox"},r.createElement("label",null,r.createElement("input",{
type:"checkbox",disabled:!0,name:"check",checked:i,"data-name":e}),l)):"undefined"!=typeof a&&null!=a&&"undefined"!=typeof a.visible&&a.visible===!1?null:r.createElement("div",{className:"griddle-column-selection checkbox",
key:e,style:t.props.useGriddleStyles?{float:"left",width:"20%"}:null},r.createElement("label",null,r.createElement("input",{type:"checkbox",name:"check",onChange:t.handleChange,checked:i,"data-name":e}),l))

}))
var i=t.props.enableToggleCustom?r.createElement("div",{className:"form-group"},r.createElement("label",{htmlFor:"maxRows"},r.createElement("input",{type:"checkbox",checked:this.props.useCustomComponent,
onChange:this.props.toggleCustomComponent})," ",this.props.enableCustomFormatText)):"",a=this.props.showSetPageSize?r.createElement("div",null,r.createElement("label",{htmlFor:"maxRows"},this.props.maxRowsText,":",r.createElement("select",{
onChange:this.setPageSize,value:this.props.resultsPerPage},r.createElement("option",{value:"5"},"5"),r.createElement("option",{value:"10"},"10"),r.createElement("option",{value:"25"},"25"),r.createElement("option",{
value:"50"},"50"),r.createElement("option",{value:"100"},"100")))):""
return r.createElement("div",{className:"griddle-settings",style:this.props.useGriddleStyles?{backgroundColor:"#FFF",border:"1px solid #DDD",color:"#222",padding:"10px",marginBottom:"10px"}:null},r.createElement("h6",null,this.props.settingsText),r.createElement("div",{
className:"griddle-columns",style:this.props.useGriddleStyles?{clear:"both",display:"table",width:"100%",borderBottom:"1px solid #EDEDED",marginBottom:"10px"}:null},n),a,i)}})
e.exports=a},function(e,t,n){function r(e,t,n,r){e=i(e)?e:l(e),n=n&&!r?a(n):0
var p=e.length
return n<0&&(n=u(p+n,0)),s(e)?n<=p&&e.indexOf(t,n)>-1:!!p&&o(e,t,n)>-1}var o=n(193),i=n(131),s=n(216),a=n(171),l=n(217),u=Math.max
e.exports=r},function(e,t,n){function r(e){return"string"==typeof e||!i(e)&&s(e)&&o(e)==a}var o=n(67),i=n(109),s=n(118),a="[object String]"
e.exports=r},function(e,t,n){function r(e){return null==e?[]:o(e,i(e))}var o=n(218),i=n(113)
e.exports=r},function(e,t,n){function r(e,t){return o(t,function(t){return e[t]})}var o=n(45)
e.exports=r},function(e,t,n){var r=n(191),o=n(181),i=n(197),s=o(function(e,t){return i(e)?r(e,t):[]})
e.exports=s},function(e,t,n){"use strict"
var r=n(2),o=r.createClass({displayName:"GridNoData",getDefaultProps:function e(){return{noDataMessage:"No Data"}},render:function e(){var t=this
return r.createElement("div",null,this.props.noDataMessage)}})
e.exports=o},function(e,t,n){"use strict"
var r=n(2),o=n(43),i=n(222),s=n(66),a=n(229),l=n(198),u=n(231),p=n(237),c=n(219),d=r.createClass({displayName:"GridRow",getDefaultProps:function e(){return{isChildRow:!1,showChildren:!1,data:{},columnSettings:null,
rowSettings:null,hasChildren:!1,useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,paddingHeight:null,rowHeight:null,parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",
parentRowCollapsedComponent:"▶",parentRowExpandedComponent:"▼",onRowClick:null,multipleSelectionSettings:null}},handleClick:function e(t){null!==this.props.onRowClick&&s(this.props.onRowClick)?this.props.onRowClick(this,t):this.props.hasChildren&&this.props.toggleChildren()

},handleSelectionChange:function e(t){},handleSelectClick:function e(t){this.props.multipleSelectionSettings.isMultipleSelection&&("checkbox"===t.target.type?this.props.multipleSelectionSettings.toggleSelectRow(this.props.data,this.refs.selected.checked):this.props.multipleSelectionSettings.toggleSelectRow(this.props.data,!this.refs.selected.checked))

},verifyProps:function e(){null===this.props.columnSettings&&console.error("gridRow: The columnSettings prop is null and it shouldn't be")},formatData:function e(t){return"boolean"==typeof t?String(t):t

},render:function e(){var t=this
this.verifyProps()
var n=this,o=null
this.props.useGriddleStyles&&(o={margin:"0px",padding:n.props.paddingHeight+"px 5px "+n.props.paddingHeight+"px 5px",height:n.props.rowHeight?this.props.rowHeight-2*n.props.paddingHeight+"px":null,backgroundColor:"#FFF",
borderTopColor:"#DDD",color:"#222"})
var d=this.props.columnSettings.getColumns(),f=a(d,[]),h=l({},this.props.data)
u(h,f)
var m=p(i.pick(h,c(d,"children"))),g=m.map(function(e,n){var i=null,s=t.props.columnSettings.getColumnMetadataByName(e[0]),a=0===n&&t.props.hasChildren&&t.props.showChildren===!1&&t.props.useGriddleIcons?r.createElement("span",{
style:t.props.useGriddleStyles?{fontSize:"10px",marginRight:"5px"}:null},t.props.parentRowCollapsedComponent):0===n&&t.props.hasChildren&&t.props.showChildren&&t.props.useGriddleIcons?r.createElement("span",{
style:t.props.useGriddleStyles?{fontSize:"10px"}:null},t.props.parentRowExpandedComponent):""
if(0===n&&t.props.isChildRow&&t.props.useGriddleStyles&&(o=l(o,{paddingLeft:10})),t.props.columnSettings.hasColumnMetadata()&&"undefined"!=typeof s&&null!==s)if("undefined"!=typeof s.customComponent&&null!==s.customComponent){
var u=r.createElement(s.customComponent,{data:e[1],rowData:h,metadata:s})
i=r.createElement("td",{onClick:t.handleClick,className:s.cssClassName,key:n,style:o},u)}else i=r.createElement("td",{onClick:t.handleClick,className:s.cssClassName,key:n,style:o},a,t.formatData(e[1]))


return i||r.createElement("td",{onClick:t.handleClick,key:n,style:o},a,e[1])}),y,v
if(null!==this.props.onRowClick&&s(this.props.onRowClick)?(y=null,v=this.handleSelectClick):this.props.multipleSelectionSettings&&this.props.multipleSelectionSettings.isMultipleSelection?(y=this.handleSelectClick,
v=null):(y=null,v=null),g&&this.props.multipleSelectionSettings&&this.props.multipleSelectionSettings.isMultipleSelection){var b=this.props.multipleSelectionSettings.getSelectedRowIds()
g.unshift(r.createElement("td",{key:"selection",style:o,className:"griddle-select griddle-select-cell",onClick:v},r.createElement("input",{type:"checkbox",checked:this.props.multipleSelectionSettings.getIsRowChecked(h),
onChange:this.handleSelectionChange,ref:"selected"})))}var E=n.props.rowSettings&&n.props.rowSettings.getBodyRowMetadataClass(n.props.data)||"standard-row"
return n.props.isChildRow?E="child-row":n.props.hasChildren&&(E=n.props.showChildren?this.props.parentRowExpandedClassName:this.props.parentRowCollapsedClassName),r.createElement("tr",{onClick:y,className:E
},g)}})
e.exports=d},function(e,t,n){"use strict"
function r(e){for(var t=/\[("|')(.+)\1\]|([^.\[\]]+)/g,n=[],r;null!==(r=t.exec(e));)n.push(r[2]||r[3])
return n}function o(e,t){if("string"==typeof t){if(void 0!==e[t])return e[t]
t=r(t)}for(var n=-1,o=t.length;++n<o&&null!=e;)e=e[t[n]]
return n===o?e:void 0}function i(e,t){var n={},r=e,i
i=function(e,t){return e in t},r=Object(r)
for(var s=0,a=t.length;s<a;s++){var l=t[s]
i(l,r)&&(n[l]=o(r,l))}return n}function s(e,t){var n=[]
return u(e,function(e,r){var o=t?t+"."+r:r
!p(e)||c(e)||d(e)||e instanceof Date?n.push(o):n=n.concat(s(e,o))}),n}function a(e,t){c(e)?u(e,function(e){a(e,t)}):f(e)?h(e,function(e){a(e,t)}):t(e)}function l(e){var t=[]
return a(e,function(e){t.push(e)}),t}var u=n(223),p=n(73),c=n(109),d=n(66),f=n(226),h=n(228)
e.exports={pick:i,getAt:o,keys:s,getObjectValues:l}},function(e,t,n){function r(e,t){var n=a(e)?o:i
return n(e,s(t))}var o=n(224),i=n(160),s=n(225),a=n(109)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&t(e[n],n,e)!==!1;);return e}e.exports=n},function(e,t,n){function r(e){return"function"==typeof e?e:o}var o=n(155)
e.exports=r},function(e,t,n){function r(e){if(!s(e)||o(e)!=a)return!1
var t=i(e)
if(null===t)return!0
var n=c.call(t,"constructor")&&t.constructor
return"function"==typeof n&&n instanceof n&&p.call(n)==d}var o=n(67),i=n(227),s=n(118),a="[object Object]",l=Function.prototype,u=Object.prototype,p=l.toString,c=u.hasOwnProperty,d=p.call(Object)
e.exports=r},function(e,t,n){var r=n(130),o=r(Object.getPrototypeOf,Object)
e.exports=o},function(e,t,n){function r(e,t){return e&&o(e,i(t))}var o=n(161),i=n(225)
e.exports=r},function(e,t,n){function r(e,t){return i(e||[],t||[],o)}var o=n(199),i=n(230)
e.exports=r},function(e,t){function n(e,t,n){for(var r=-1,o=e.length,i=t.length,s={};++r<o;){var a=r<i?t[r]:void 0
n(s,e[r],a)}return s}e.exports=n},function(e,t,n){var r=n(183),o=n(232),i=n(181),s=n(236),a=i(function(e){return e.push(void 0,s),r(o,void 0,e)})
e.exports=a},function(e,t,n){var r=n(201),o=n(202),i=n(233),s=o(function(e,t,n,o){r(t,i(t),e,o)})
e.exports=s},function(e,t,n){function r(e){return s(e)?o(e,!0):i(e)}var o=n(114),i=n(234),s=n(131)
e.exports=r},function(e,t,n){function r(e){if(!o(e))return s(e)
var t=i(e),n=[]
for(var r in e)("constructor"!=r||!t&&l.call(e,r))&&n.push(r)
return n}var o=n(73),i=n(128),s=n(235),a=Object.prototype,l=a.hasOwnProperty
e.exports=r},function(e,t){function n(e){var t=[]
if(null!=e)for(var n in Object(e))t.push(n)
return t}e.exports=n},function(e,t,n){function r(e,t,n,r){return void 0===e||o(e,i[n])&&!s.call(r,n)?t:e}var o=n(54),i=Object.prototype,s=i.hasOwnProperty
e.exports=r},function(e,t,n){var r=n(238),o=n(113),i=r(o)
e.exports=i},function(e,t,n){function r(e){return function(t){var n=i(t)
return n==l?s(t):n==u?a(t):o(t,e(t))}}var o=n(239),i=n(132),s=n(103),a=n(240),l="[object Map]",u="[object Set]"
e.exports=r},function(e,t,n){function r(e,t){return o(t,function(t){return[t,e[t]]})}var o=n(45)
e.exports=r},function(e,t){function n(e){var t=-1,n=Array(e.size)
return e.forEach(function(e){n[++t]=[e,e]}),n}e.exports=n},function(e,t,n){"use strict"
var r=n(2),o=r.createClass({displayName:"CustomRowComponentContainer",getDefaultProps:function e(){return{data:[],metadataColumns:[],className:"",customComponent:{},globalData:{}}},render:function e(){
var t=this
if("function"!=typeof t.props.customComponent)return console.log("Couldn't find valid template."),r.createElement("div",{className:this.props.className})
var n=this.props.data.map(function(e,n){return r.createElement(t.props.customComponent,{data:e,metadataColumns:t.props.metadataColumns,key:n,globalData:t.props.globalData})}),o=this.props.showPager&&this.props.pagingContent


return r.createElement("div",{className:this.props.className,style:this.props.style},n)}})
e.exports=o},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(2),i=o.createClass({displayName:"CustomPaginationContainer",getDefaultProps:function e(){return{maxPage:0,nextText:"",
previousText:"",currentPage:0,customPagerComponent:{},customPagerComponentOptions:{}}},render:function e(){var t=this
return"function"!=typeof t.props.customPagerComponent?(console.log("Couldn't find valid template."),o.createElement("div",null)):o.createElement(t.props.customPagerComponent,r({},this.props.customPagerComponentOptions,{
maxPage:this.props.maxPage,nextText:this.props.nextText,previousText:this.props.previousText,currentPage:this.props.currentPage,setPage:this.props.setPage,previous:this.props.previous,next:this.props.next
}))}})
e.exports=i},function(e,t,n){"use strict"
var r=n(2),o=r.createClass({displayName:"CustomFilterContainer",getDefaultProps:function e(){return{placeholderText:""}},render:function e(){var t=this
return"function"!=typeof t.props.customFilterComponent?(console.log("Couldn't find valid template."),r.createElement("div",null)):r.createElement(t.props.customFilterComponent,{changeFilter:this.props.changeFilter,
results:this.props.results,currentResults:this.props.currentResults,placeholderText:this.props.placeholderText})}})
e.exports=o},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
return r?(t=n||void 0===t?1:i(t),o(e,t<0?0:t,r)):[]}var o=n(245),i=n(171)
e.exports=r},function(e,t){function n(e,t,n){var r=-1,o=e.length
t<0&&(t=-t>o?0:o+t),n=n>o?o:n,n<0&&(n+=o),o=t>n?0:n-t>>>0,t>>>=0
for(var i=Array(o);++r<o;)i[r]=e[r+t]
return i}e.exports=n},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
return r?(t=n||void 0===t?1:i(t),t=r-t,o(e,0,t<0?0:t)):[]}var o=n(245),i=n(171)
e.exports=r},function(e,t,n){function r(e,t,n){return e&&e.length?(t=n||void 0===t?1:i(t),o(e,0,t<0?0:t)):[]}var o=n(245),i=n(171)
e.exports=r},function(e,t,n){function r(e){var t=null==e?0:e.length
return t?o(e,0,-1):[]}var o=n(245)
e.exports=r},function(e,t,n){var r=n(45),o=n(250),i=n(181),s=n(251),a=i(function(e){var t=r(e,s)
return t.length&&t[0]===e[0]?o(t):[]})
e.exports=a},function(e,t,n){function r(e,t,n){for(var r=n?s:i,c=e[0].length,d=e.length,f=d,h=Array(d),m=1/0,g=[];f--;){var y=e[f]
f&&t&&(y=a(y,l(t))),m=p(y.length,m),h[f]=!n&&(t||c>=120&&y.length>=120)?new o(f&&y):void 0}y=e[0]
var v=-1,b=h[0]
e:for(;++v<c&&g.length<m;){var E=y[v],C=t?t(E):E
if(E=n||0!==E?E:0,!(b?u(b,C):r(g,C,n))){for(f=d;--f;){var _=h[f]
if(!(_?u(_,C):r(e[f],C,n)))continue e}b&&b.push(C),g.push(E)}}return g}var o=n(96),i=n(192),s=n(196),a=n(45),l=n(125),u=n(100),p=Math.min
e.exports=r},function(e,t,n){function r(e){return o(e)?e:[]}var o=n(197)
e.exports=r},function(e,t,n){function r(e){if(null==e)return!0
if(l(e)&&(a(e)||"string"==typeof e||"function"==typeof e.splice||u(e)||c(e)||s(e)))return!e.length
var t=i(e)
if(t==d||t==f)return!e.size
if(p(e))return!o(e).length
for(var n in e)if(m.call(e,n))return!1
return!0}var o=n(127),i=n(132),s=n(116),a=n(109),l=n(131),u=n(119),p=n(128),c=n(122),d="[object Map]",f="[object Set]",h=Object.prototype,m=h.hasOwnProperty
e.exports=r},function(e,t){function n(e){return null===e}e.exports=n},function(e,t){function n(e){return void 0===e}e.exports=n},function(e,t,n){var r=n(45),o=n(256),i=n(279),s=n(143),a=n(201),l=n(282),u=n(208),p=n(264),c=1,d=2,f=4,h=u(function(e,t){
var n={}
if(null==e)return n
var u=!1
t=r(t,function(t){return t=s(t,e),u||(u=t.length>1),t}),a(e,p(e),n),u&&(n=o(n,c|d|f,l))
for(var h=t.length;h--;)i(n,t[h])
return n})
e.exports=h},function(e,t,n){function r(e,t,n,x,T,O){var I,D=t&S,N=t&w,U=t&P
if(n&&(I=T?n(e,x,T,O):n(e)),void 0!==I)return I
if(!C(e))return e
var j=b(e)
if(j){if(I=g(e),!D)return p(e,I)}else{var L=m(e),M=L==A||L==k
if(E(e))return u(e,D)
if(L==R||L==F||M&&!T){if(I=N||M?{}:v(e),!D)return N?d(e,l(I,e)):c(e,a(I,e))}else{if(!X[L])return T?e:{}
I=y(e,L,r,D)}}O||(O=new o)
var q=O.get(e)
if(q)return q
O.set(e,I)
var B=U?N?h:f:N?keysIn:_,z=j?void 0:B(e)
return i(z||e,function(o,i){z&&(i=o,o=e[i]),s(I,i,r(o,t,n,i,e,O))}),I}var o=n(49),i=n(224),s=n(199),a=n(257),l=n(258),u=n(259),p=n(260),c=n(261),d=n(262),f=n(106),h=n(264),m=n(132),g=n(265),y=n(266),v=n(277),b=n(109),E=n(119),C=n(73),_=n(113),S=1,w=2,P=4,F="[object Arguments]",x="[object Array]",T="[object Boolean]",O="[object Date]",I="[object Error]",A="[object Function]",k="[object GeneratorFunction]",D="[object Map]",N="[object Number]",R="[object Object]",U="[object RegExp]",j="[object Set]",L="[object String]",M="[object Symbol]",q="[object WeakMap]",B="[object ArrayBuffer]",z="[object DataView]",H="[object Float32Array]",G="[object Float64Array]",V="[object Int8Array]",Q="[object Int16Array]",W="[object Int32Array]",$="[object Uint8Array]",K="[object Uint8ClampedArray]",Y="[object Uint16Array]",Z="[object Uint32Array]",X={}


X[F]=X[x]=X[B]=X[z]=X[T]=X[O]=X[H]=X[G]=X[V]=X[Q]=X[W]=X[D]=X[N]=X[R]=X[U]=X[j]=X[L]=X[M]=X[$]=X[K]=X[Y]=X[Z]=!0,X[I]=X[A]=X[q]=!1,e.exports=r},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(201),i=n(113)


e.exports=r},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(201),i=n(233)
e.exports=r},function(e,t,n){(function(e){function r(e,t){if(t)return e.slice()
var n=e.length,r=u?u(n):new e.constructor(n)
return e.copy(r),r}var o=n(69),i="object"==typeof t&&t&&!t.nodeType&&t,s=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=s&&s.exports===i,l=a?o.Buffer:void 0,u=l?l.allocUnsafe:void 0
e.exports=r}).call(t,n(29)(e))},function(e,t){function n(e,t){var n=-1,r=e.length
for(t||(t=Array(r));++n<r;)t[n]=e[n]
return t}e.exports=n},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(201),i=n(110)
e.exports=r},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(201),i=n(263)
e.exports=r},function(e,t,n){var r=n(108),o=n(227),i=n(110),s=n(112),a=Object.getOwnPropertySymbols,l=a?function(e){for(var t=[];e;)r(t,i(e)),e=o(e)
return t}:s
e.exports=l},function(e,t,n){function r(e){return o(e,s,i)}var o=n(107),i=n(263),s=n(233)
e.exports=r},function(e,t){function n(e){var t=e.length,n=e.constructor(t)
return t&&"string"==typeof e[0]&&o.call(e,"index")&&(n.index=e.index,n.input=e.input),n}var r=Object.prototype,o=r.hasOwnProperty
e.exports=n},function(e,t,n){function r(e,t,n,r){var I=e.constructor
switch(t){case b:return o(e)
case c:case d:return new I(+e)
case E:return i(e,r)
case C:case _:case S:case w:case P:case F:case x:case T:case O:return p(e,r)
case f:return s(e,r,n)
case h:case y:return new I(e)
case m:return a(e)
case g:return l(e,r,n)
case v:return u(e)}}var o=n(267),i=n(268),s=n(269),a=n(272),l=n(273),u=n(275),p=n(276),c="[object Boolean]",d="[object Date]",f="[object Map]",h="[object Number]",m="[object RegExp]",g="[object Set]",y="[object String]",v="[object Symbol]",b="[object ArrayBuffer]",E="[object DataView]",C="[object Float32Array]",_="[object Float64Array]",S="[object Int8Array]",w="[object Int16Array]",P="[object Int32Array]",F="[object Uint8Array]",x="[object Uint8ClampedArray]",T="[object Uint16Array]",O="[object Uint32Array]"


e.exports=r},function(e,t,n){function r(e){var t=new e.constructor(e.byteLength)
return new o(t).set(new o(e)),t}var o=n(102)
e.exports=r},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer
return new e.constructor(n,e.byteOffset,e.byteLength)}var o=n(267)
e.exports=r},function(e,t,n){function r(e,t,n){var r=t?n(s(e),a):s(e)
return i(r,o,new e.constructor)}var o=n(270),i=n(271),s=n(103),a=1
e.exports=r},function(e,t){function n(e,t){return e.set(t[0],t[1]),e}e.exports=n},function(e,t){function n(e,t,n,r){var o=-1,i=null==e?0:e.length
for(r&&i&&(n=e[++o]);++o<i;)n=t(n,e[o],o,e)
return n}e.exports=n},function(e,t){function n(e){var t=new e.constructor(e.source,r.exec(e))
return t.lastIndex=e.lastIndex,t}var r=/\w*$/
e.exports=n},function(e,t,n){function r(e,t,n){var r=t?n(s(e),a):s(e)
return i(r,o,new e.constructor)}var o=n(274),i=n(271),s=n(104),a=1
e.exports=r},function(e,t){function n(e,t){return e.add(t),e}e.exports=n},function(e,t,n){function r(e){return s?Object(s.call(e)):{}}var o=n(68),i=o?o.prototype:void 0,s=i?i.valueOf:void 0
e.exports=r},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer
return new e.constructor(n,e.byteOffset,e.length)}var o=n(267)
e.exports=r},function(e,t,n){function r(e){return"function"!=typeof e.constructor||s(e)?{}:o(i(e))}var o=n(278),i=n(227),s=n(128)
e.exports=r},function(e,t,n){var r=n(73),o=Object.create,i=function(){function e(){}return function(t){if(!r(t))return{}
if(o)return o(t)
e.prototype=t
var n=new e
return e.prototype=void 0,n}}()
e.exports=i},function(e,t,n){function r(e,t){return t=o(t,e),e=s(e,t),null==e||delete e[a(i(t))]}var o=n(143),i=n(280),s=n(281),a=n(151)
e.exports=r},function(e,t){function n(e){var t=null==e?0:e.length
return t?e[t-1]:void 0}e.exports=n},function(e,t,n){function r(e,t){return t.length<2?e:o(e,i(t,0,-1))}var o=n(142),i=n(245)
e.exports=r},function(e,t,n){function r(e){return o(e)?void 0:e}var o=n(226)
e.exports=r},function(e,t,n){function r(e,t,n,r){return null==e?[]:(i(t)||(t=null==t?[]:[t]),n=r?void 0:n,i(n)||(n=null==n?[]:[n]),o(e,t,n))}var o=n(177),i=n(109)
e.exports=r},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0}),t.TableView=void 0
var a=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&s.return&&s.return()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(2),p=r(u),c=n(40),d=r(c),f=n(5),h=r(f),m=n(24),g=n(30),y=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.getColumns=n.getColumns.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handleRowClick=n.handleRowClick.bind(n),n.renderSelect=n.renderSelect.bind(n),n.renderTitle=n.renderTitle.bind(n),
n.renderNoItemsNotice=n.renderNoItemsNotice.bind(n),n.state={enableSort:!1},n}return s(t,e),l(t,[{key:"componentDidMount",value:function e(){this.setState({enableSort:!0})}},{key:"componentWillUnmount",
value:function e(){this.setState({enableSort:!1})}},{key:"getColumns",value:function e(){var t=["thumbnail","title","size","lastEdited"]
return this.props.selectableItems&&t.unshift("selected"),t}},{key:"getColumnConfig",value:function e(){return[{columnName:"selected",sortable:!1,displayName:"",cssClassName:"gallery__table-column--select",
customComponent:this.renderSelect},{columnName:"thumbnail",sortable:!1,displayName:"",cssClassName:"gallery__table-column--image",customComponent:this.renderThumbnail},{columnName:"title",customCompareFn:function e(){
return 0},cssClassName:"gallery__table-column--title",customComponent:this.renderTitle},{columnName:"lastEdited",displayName:"Modified",customComponent:this.renderDate},{columnName:"size",sortable:!1,displayName:"Size",
cssClassName:"sort--disabled",customComponent:this.renderSize}]}},{key:"getRowMetadata",value:function e(t){return"gallery__table-row "+(t.highlighted?"gallery__table-row--highlighted":"")}},{key:"getTableProps",
value:function e(){var t=this.props.sort.split(","),n=a(t,2),r=n[0],o=n[1]
return{tableClassName:"gallery__table table table-hover",gridClassName:"gallery__main-view--table",rowMetadata:{bodyCssClassName:this.getRowMetadata},sortAscendingComponent:"",sortDescendingComponent:"",
useExternal:!0,externalSetPage:this.handleSetPage,externalChangeSort:this.handleSort,externalSetFilter:function e(){return null},externalSetPageSize:function e(){return null},externalCurrentPage:this.props.page-1,
externalMaxPage:Math.ceil(this.props.totalCount/this.props.limit),externalSortColumn:r,externalSortAscending:this.state.enableSort?"asc"===o:"asc"!==o,initialSort:r,columns:this.getColumns(),columnMetadata:this.getColumnConfig(),
useGriddleStyles:!1,onRowClick:this.handleRowClick,results:this.props.files,customNoDataComponent:this.renderNoItemsNotice}}},{key:"handleActivate",value:function e(t,n){"folder"===n.type?this.props.onOpenFolder(t,n):this.props.onOpenFile(t,n)

}},{key:"handleRowClick",value:function e(t,n){var r=t.props.data
return n.currentTarget.classList.contains("gallery__table-column--select")&&(n.stopPropagation(),n.preventDefault(),"function"==typeof this.props.onSelect)?void this.props.onSelect(n,r):void this.handleActivate(n,r)

}},{key:"handleSort",value:function e(t,n){var r=n?"asc":"desc"
this.state.enableSort&&this.props.onSort(t+","+r)}},{key:"handleSetPage",value:function e(t){this.props.onSetPage(t+1)}},{key:"preventFocus",value:function e(t){t.preventDefault()}},{key:"renderNoItemsNotice",
value:function e(){return 0!==this.props.files.length||this.props.loading?null:p.default.createElement("p",{className:"gallery__no-item-notice"},h.default._t("AssetAdmin.NOITEMSFOUND"))}},{key:"renderSize",
value:function e(t){if("folder"===t.rowData.type)return null
var n=(0,g.fileSize)(t.data)
return p.default.createElement("span",null,n)}},{key:"renderProgressBar",value:function e(t){if(!t.uploading||t.message&&"error"===t.message.type)return null
if(t.id>0)return p.default.createElement("div",{className:"gallery__progress-bar--complete"})
var n={className:"gallery__progress-bar-progress",style:{width:t.progress+"%"}}
return p.default.createElement("div",{className:"gallery__progress-bar"},p.default.createElement("div",n))}},{key:"renderTitle",value:function e(t){var n=this.renderProgressBar(t.rowData)
return p.default.createElement("div",{className:"fill-width"},p.default.createElement("div",{className:"flexbox-area-grow"},t.data),n)}},{key:"renderSelect",value:function e(t){return p.default.createElement("input",{
type:"checkbox",title:h.default._t("AssetAdmin.SELECT"),checked:t.data,tabIndex:"-1",onMouseDown:this.preventFocus})}},{key:"renderDate",value:function e(t){return"folder"===t.rowData.type?null:p.default.createElement("span",null,t.data)

}},{key:"renderThumbnail",value:function e(t){var n=t.data||t.rowData.url,r=t.rowData.category||"false",o="gallery__table-image",i=[o],s={}
return i.push(o+"--"+r),"image"===r&&n&&(s.backgroundImage='url("'+n+'")'),n||"folder"===r||i.push(o+"--error"),p.default.createElement("div",{className:i.join(" "),style:s})}},{key:"render",value:function e(){
return p.default.createElement(d.default,this.getTableProps())}}]),t}(u.Component)
y.defaultProps=m.galleryViewDefaultProps,y.propTypes=m.galleryViewPropTypes,t.TableView=y,t.default=y},function(e,t){e.exports=FormAlert},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0}),t.BackButton=void 0
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(2),u=r(l),p=n(38),c=r(p),d=n(39),f=r(d),h=function(e){
function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),a(t,[{key:"render",value:function e(){var t=["btn","btn-secondary","btn--no-text","font-icon-level-up","btn--icon-large","gallery__back"]


this.props.enlarged&&(t.push("z-depth-1"),t.push("gallery__back--droppable-hover"))
var n=this.props.badge
return u.default.createElement("button",{className:t.join(" "),title:"Navigate up a level",onClick:this.props.onClick},!!n&&u.default.createElement(f.default,{className:"gallery__back-badge",status:n.status,
message:n.message}))}}]),t}(l.Component)
h.propTypes={onClick:l.PropTypes.func,enlarged:l.PropTypes.bool,badge:l.PropTypes.shape(f.default.propTypes)},t.BackButton=h,t.default=(0,c.default)("GalleryItem")(h)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}Object.defineProperty(t,"__esModule",{value:!0}),t.config=t.mutation=void 0


var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=o(["\n  mutation CreateFolder($folder:FolderInput!) {\n    createFolder(folder: $folder) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ","\n  ","\n"],["\n  mutation CreateFolder($folder:FolderInput!) {\n    createFolder(folder: $folder) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ","\n  ","\n"]),a=n(4),l=n(288),u=r(l),p=n(289),c=(0,
u.default)(s,p.fileInterface,p.file),d={props:function e(t){var n=t.mutate,r=t.ownProps,o=r.errors,s=r.actions,a=function e(t,r){return n({variables:{folder:{parentId:t,name:r}}})}
return{errorMessage:o&&o[0].message,actions:i({},s,{files:i({},s.files,{createFolder:a})})}}}
t.mutation=c,t.config=d,t.default=(0,a.graphql)(c,d)},function(e,t){e.exports=GraphQLTag},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}Object.defineProperty(t,"__esModule",{value:!0}),t.folder=t.file=t.fileInterface=void 0


var i=o(["\n  fragment FileInterfaceFields on FileInterface {\n    canDelete\n    canEdit\n    canView\n    category\n    exists\n    filename\n    id\n    lastEdited\n    name\n    parentId\n    title\n    type\n    url\n  }\n"],["\n  fragment FileInterfaceFields on FileInterface {\n    canDelete\n    canEdit\n    canView\n    category\n    exists\n    filename\n    id\n    lastEdited\n    name\n    parentId\n    title\n    type\n    url\n  }\n"]),s=o(["\n  fragment FileFields on File {\n    draft\n    extension\n    height\n    published\n    size\n    smallThumbnail\n    thumbnail\n    width\n    inUseCount\n  }\n"],["\n  fragment FileFields on File {\n    draft\n    extension\n    height\n    published\n    size\n    smallThumbnail\n    thumbnail\n    width\n    inUseCount\n  }\n"]),a=o(["\n  fragment FolderFields on Folder {\n    filesInUseCount\n  }\n"],["\n  fragment FolderFields on Folder {\n    filesInUseCount\n  }\n"]),l=n(288),u=r(l),p=(0,
u.default)(i),c=(0,u.default)(s),d=(0,u.default)(a)
t.fileInterface=p,t.file=c,t.folder=d},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}Object.defineProperty(t,"__esModule",{value:!0}),t.config=t.mutation=void 0


var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=o(["\n  mutation MoveFiles($folderId:ID!, $fileIds:[ID]!) {\n    moveFiles(folderId: $folderId, fileIds: $fileIds) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ","\n  ","\n"],["\n  mutation MoveFiles($folderId:ID!, $fileIds:[ID]!) {\n    moveFiles(folderId: $folderId, fileIds: $fileIds) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ","\n  ","\n"]),a=n(4),l=n(288),u=r(l),p=n(289),c=(0,
u.default)(s,p.fileInterface,p.file),d={props:function e(t){var n=t.mutate,r=t.ownProps.actions
return{actions:i({},r,{files:i({},r.files,{moveFiles:function e(t,r){return n({variables:{folderId:t,fileIds:r}})}})})}}}
t.mutation=c,t.config=d,t.default=(0,a.graphql)(c,d)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(2),u=r(l),p=n(36),c=n(37),d=r(c),f=n(292),h=r(f),m=null,g=(0,
p.DragDropContext)(function(e){return m=e,(0,d.default)(e)}),y=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),a(t,[{key:"componentDidMount",
value:function e(){window.addEventListener("drop",this.handleDrop,!0)}},{key:"componentWillUnmount",value:function e(){window.removeEventListener("drop",this.handleDrop,!0)}},{key:"handleDrop",value:function e(){
var t=m&&m.backend
t&&t.isDraggingNativeItem()&&t.endDragNativeItem()}},{key:"render",value:function e(){var t=this.props,n=t.className,r=t.children
return u.default.createElement("div",{className:n},r,u.default.createElement(h.default,null))}}]),t}(l.Component)
y.propTypes={className:l.PropTypes.string,children:l.PropTypes.arrayOf(l.PropTypes.node)},t.default=g(y)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(2),u=r(l),p=n(36),c=n(33),d=r(c),f=function(e){
function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),a(t,[{key:"getOffset",value:function e(){var t=this.props.offset
return{transform:t&&"translate("+t.x+"px, "+t.y+"px)"}}},{key:"render",value:function e(){if(!this.props.isDragging)return null
var t=this.props.item
if(!t.selected)return null
var n=t.selected.length
return u.default.createElement("div",{className:"gallery-item__drag-layer"},u.default.createElement("div",{className:"gallery-item__drag-layer-item",style:this.getOffset()},n>1&&[u.default.createElement("div",{
key:"1",className:"gallery-item__drag-shadow"}),u.default.createElement("div",{key:"2",className:"gallery-item__drag-shadow gallery-item__drag-shadow--second"}),u.default.createElement("div",{key:"3",className:"gallery-item__drag-shadow gallery-item__drag-shadow--third"
})],u.default.createElement(d.default,t.props),n>1&&u.default.createElement("span",{className:"gallery-item__drag-layer-count label label-primary label-pill"},n)))}}]),t}(l.Component)
f.propTypes={item:l.PropTypes.object,offset:l.PropTypes.shape({x:l.PropTypes.number.isRequired,y:l.PropTypes.number.isRequired}),isDragging:l.PropTypes.bool.isRequired}
var h=function e(t){return{item:t.getItem(),offset:t.getSourceClientOffset(),isDragging:t.isDragging()}}
t.default=(0,p.DragLayer)(h)(f)},function(e,t){e.exports=Breadcrumb},function(e,t){e.exports=Toolbar},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e){return e&&Object.keys(e).length>0

}function u(e,t){var n={},r=e.form[t.searchFormSchemaUrl]
return r&&r.values&&(n=r.values),{formData:n}}function p(e){return{actions:{schema:(0,b.bindActionCreators)(F,e),reduxForm:(0,b.bindActionCreators)({reset:x.reset,initialize:x.initialize},e)}}}Object.defineProperty(t,"__esModule",{
value:!0}),t.hasFilters=t.Search=void 0
var c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(5),f=o(d),h=n(2),m=o(h),g=n(9),y=n(3),v=o(y),b=n(8),E=n(13),C=o(E),_=n(22),S=o(_),w=n(296),P=n(297),F=r(P),x=n(298),T={
NONE:"NONE",VISIBLE:"VISIBLE",EXPANDED:"EXPANDED"},O=function(e){function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.expand=n.expand.bind(n),n.handleClick=n.handleClick.bind(n),n.handleKeyUp=n.handleKeyUp.bind(n),n.handleChange=n.handleChange.bind(n),n.doSearch=n.doSearch.bind(n),n.focusInput=n.focusInput.bind(n),
n.focusFirstFormField=n.focusFirstFormField.bind(n),n.hide=n.hide.bind(n),n.show=n.show.bind(n),n.toggle=n.toggle.bind(n),n.open=n.open.bind(n),n.state={view:T.NONE,searchText:n.props.filters&&n.props.filters.name||""
},n}return a(t,e),c(t,[{key:"componentWillMount",value:function e(){document.addEventListener("click",this.handleClick,!1),this.setOverrides(this.props)}},{key:"componentWillUnmount",value:function e(){
document.removeEventListener("click",this.handleClick,!1),this.setOverrides()}},{key:"componentWillReceiveProps",value:function e(t){t&&!l(t.filters)&&l(this.props.filters)?this.clearFormData(t):JSON.stringify(t.filters)!==JSON.stringify(this.props.filters)&&this.setOverrides(t)

}},{key:"focusInput",value:function e(){if(this.state.view!==T.NONE){var t=v.default.findDOMNode(this.refs.contentInput)
t!==document.activeElement&&(t.focus(),t.select())}}},{key:"focusFirstFormField",value:function e(){if(this.state.view===T.EXPANDED){var t=v.default.findDOMNode(this.refs.contentForm),n=t&&t.querySelector("input, textarea, select")


n&&(n.focus(),n.select&&n.select())}}},{key:"clearFormData",value:function e(t){this.setState({searchText:""})
var n=t&&t.searchFormSchemaUrl||this.props.searchFormSchemaUrl
n&&(this.props.actions.reduxForm.initialize(n,{},Object.keys(this.props.formData)),this.props.actions.reduxForm.reset(n),this.props.actions.schema.setSchemaStateOverrides(n,null))}},{key:"setOverrides",
value:function e(t){if(t&&(!l(t.filters)||this.props.searchFormSchemaUrl!==t.searchFormSchemaUrl)){var n=t&&t.searchFormSchemaUrl||this.props.searchFormSchemaUrl
n&&this.props.actions.schema.setSchemaStateOverrides(n,null)}if(t&&l(t.filters)&&t.searchFormSchemaUrl){var r=t.filters||{},o={fields:Object.keys(r).map(function(e){var t=r[e]
return{name:e,value:t}})}
this.props.actions.schema.setSchemaStateOverrides(t.searchFormSchemaUrl,o)}}},{key:"handleClick",value:function e(t){var n=v.default.findDOMNode(this)
n&&!n.contains(t.target)&&this.hide()}},{key:"handleChange",value:function e(t){this.setState({searchText:t.target.value})}},{key:"handleKeyUp",value:function e(t){13===t.keyCode&&this.doSearch()}},{key:"open",
value:function e(){this.show(),setTimeout(this.focusInput,50)}},{key:"hide",value:function e(){this.setState({view:T.NONE})}},{key:"show",value:function e(){this.setState({view:T.VISIBLE})}},{key:"expand",
value:function e(){this.setState({view:T.EXPANDED})}},{key:"toggle",value:function e(){switch(this.state.view){case T.VISIBLE:this.expand(),setTimeout(this.focusFirstFormField,50)
break
case T.EXPANDED:this.show()}}},{key:"doSearch",value:function e(){var t=this,n={}
this.state.searchText&&(n.name=this.state.searchText),Object.keys(this.props.formData).forEach(function(e){var r=t.props.formData[e]
r&&(n[e]=r)}),this.props.onSearch(n)}},{key:"render",value:function e(){var t=this.props.id+"_ExtraFields",n=this.props.id+"_Trigger",r=this.state.searchText,o=["search","flexbox-area-grow"],i=["btn","btn-secondary","btn--icon-md","btn--no-text","font-icon-down-open","search__filter-trigger"],s=!1


switch(this.state.view){case T.EXPANDED:s=!0,o.push("search--active")
break
case T.VISIBLE:i.push("collapsed"),o.push("search--active")
break
case T.NONE:i.push("collapsed")}return m.default.createElement("div",{className:o.join(" ")},m.default.createElement("button",{className:"btn btn--no-text btn-secondary font-icon-search btn--icon-large search__trigger",
type:"button",title:f.default._t("AssetAdmin.SEARCH","Search"),"aria-owns":this.props.id,"aria-controls":this.props.id,"aria-expanded":"false",onClick:this.open,id:n}),m.default.createElement("div",{id:this.props.id,
className:"search__group"},m.default.createElement("input",{"aria-labelledby":n,type:"text",name:"name",ref:"contentInput",placeholder:f.default._t("AssetAdmin.SEARCH","Search"),className:"form-control search__content-field",
onKeyUp:this.handleKeyUp,onChange:this.handleChange,value:r,autoFocus:!0}),m.default.createElement("button",{"aria-expanded":s,"aria-controls":t,onClick:this.toggle,className:i.join(" "),title:f.default._t("AssetAdmin.ADVANCED","Advanced")
},m.default.createElement("span",{className:"search__filter-trigger-text"},f.default._t("AssetAdmin.ADVANCED","Advanced"))),m.default.createElement("button",{className:"btn btn-primary search__submit font-icon-search btn--icon-large btn--no-text",
title:f.default._t("AssetAdmin.SEARCH","Search"),onClick:this.doSearch}),m.default.createElement("button",{onClick:this.hide,title:f.default._t("AssetAdmin.CLOSE","Close"),className:"btn font-icon-cancel btn--no-text btn--icon-md search__cancel",
"aria-controls":this.props.id,"aria-expanded":"true"}),m.default.createElement(w.Collapse,{in:s},m.default.createElement("div",{id:t,className:"search__filter-panel",ref:"contentForm"},m.default.createElement(S.default,{
schemaUrl:this.props.searchFormSchemaUrl})))))}}]),t}(C.default)
O.propTypes={searchFormSchemaUrl:h.PropTypes.string.isRequired,id:h.PropTypes.string.isRequired,data:h.PropTypes.object,folderId:h.PropTypes.number,onSearch:h.PropTypes.func.isRequired,filters:h.PropTypes.object,
formData:h.PropTypes.object},t.Search=O,t.hasFilters=l,t.default=(0,g.connect)(u,p)(O)},function(e,t){e.exports=ReactBootstrap},function(e,t){e.exports=SchemaActions},function(e,t){e.exports=ReduxForm},function(e,t,n){
"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}Object.defineProperty(t,"__esModule",{value:!0}),t.config=t.query=void 0


var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&s.return&&s.return()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a=o(["\n  query ReadFiles($limit:Int!, $offset:Int!, $rootFilter: FileFilterInput, \n    $childrenFilter: FileFilterInput, $sortBy:[ChildrenSortInputType]\n  ) {\n    readFiles(filter: $rootFilter) {\n      pageInfo {\n        totalCount\n      }\n      edges {\n        node {\n          ...FileInterfaceFields\n          ...FileFields\n          ...on Folder {\n            children(limit:$limit, offset:$offset, filter: $childrenFilter, sortBy:$sortBy) {\n              pageInfo {\n                totalCount\n              }\n              edges {\n                node {\n                  ...FileInterfaceFields\n                  ...FileFields\n                  ...FolderFields\n                }\n              }\n            }\n            parents {\n              id\n              title\n            }\n          }\n        }\n      }\n    }\n  }\n  ","\n  ","\n  ","\n"],["\n  query ReadFiles($limit:Int!, $offset:Int!, $rootFilter: FileFilterInput, \n    $childrenFilter: FileFilterInput, $sortBy:[ChildrenSortInputType]\n  ) {\n    readFiles(filter: $rootFilter) {\n      pageInfo {\n        totalCount\n      }\n      edges {\n        node {\n          ...FileInterfaceFields\n          ...FileFields\n          ...on Folder {\n            children(limit:$limit, offset:$offset, filter: $childrenFilter, sortBy:$sortBy) {\n              pageInfo {\n                totalCount\n              }\n              edges {\n                node {\n                  ...FileInterfaceFields\n                  ...FileFields\n                  ...FolderFields\n                }\n              }\n            }\n            parents {\n              id\n              title\n            }\n          }\n        }\n      }\n    }\n  }\n  ","\n  ","\n  ","\n"]),l=n(4),u=n(288),p=r(u),c=n(300),d=n(289),f=n(295),h=(0,
p.default)(a,d.fileInterface,d.file,d.folder),m={options:function e(t){var n=t.sectionConfig,r=t.folderId,o=t.query,a=o.sort?o.sort.split(","):["",""],l=s(a,2),u=l[0],p=l[1],c=o.filter||{},d=o.limit||n.limit


return{variables:{rootFilter:{id:r},childrenFilter:i(c,{parentId:void 0,recursive:(0,f.hasFilters)(c),currentFolderOnly:void 0}),limit:d,offset:((o.page||1)-1)*d,sortBy:u&&p?[{field:u,direction:p.toUpperCase()
}]:void 0}}},props:function e(t){var n=t.data,r=n.networkStatus,o=n.refetch,s=n.readFiles,a=t.ownProps.actions,l=s&&s.edges[0]?s.edges[0].node:null,u=l&&l.children?l.children.edges.map(function(e){return e.node

}).filter(function(e){return e}):[],p=l&&l.children?l.children.pageInfo.totalCount:0,d=r!==c.NetworkStatus.ready&&r!==c.NetworkStatus.error
return{loading:d,folder:l,files:u,filesTotalCount:p,actions:i({},a,{files:i({},a.files,{readFiles:o})})}}}
t.query=h,t.config=m,t.default=(0,l.graphql)(h,m)},function(e,t,n){"use strict"
function r(e,t){if(void 0===e&&(e={}),s.isQueryInitAction(t)){var n=i({},e),r=e[t.queryId]
if(r&&r.queryString!==t.queryString)throw new Error("Internal Error: may not update existing query string in store")
var p=!1,c=void 0
t.storePreviousVariables&&r&&r.networkStatus!==u.loading&&(l(r.variables,t.variables)||(p=!0,c=r.variables))
var d=u.loading
return p?d=u.setVariables:t.isPoll?d=u.poll:t.isRefetch?d=u.refetch:t.isPoll&&(d=u.poll),n[t.queryId]={queryString:t.queryString,variables:t.variables,previousVariables:c,loading:!0,networkError:null,graphQLErrors:null,
networkStatus:d,forceFetch:t.forceFetch,returnPartialData:t.returnPartialData,lastRequestId:t.requestId,metadata:t.metadata},n}if(s.isQueryResultAction(t)){if(!e[t.queryId])return e
if(t.requestId<e[t.queryId].lastRequestId)return e
var n=i({},e),f=a.graphQLResultHasError(t.result)
return n[t.queryId]=i({},e[t.queryId],{loading:!1,networkError:null,graphQLErrors:f?t.result.errors:null,previousVariables:null,networkStatus:u.ready}),n}if(s.isQueryErrorAction(t)){if(!e[t.queryId])return e


if(t.requestId<e[t.queryId].lastRequestId)return e
var n=i({},e)
return n[t.queryId]=i({},e[t.queryId],{loading:!1,networkError:t.error,networkStatus:u.error}),n}if(s.isQueryResultClientAction(t)){if(!e[t.queryId])return e
var n=i({},e)
return n[t.queryId]=i({},e[t.queryId],{loading:!t.complete,networkError:null,previousVariables:null,networkStatus:t.complete?u.ready:u.loading}),n}if(s.isQueryStopAction(t)){var n=i({},e)
return delete n[t.queryId],n}return s.isStoreResetAction(t)?o(e,t):e}function o(e,t){var n=t.observableQueryIds,r=Object.keys(e).filter(function(e){return n.indexOf(e)>-1}).reduce(function(t,n){return t[n]=i({},e[n],{
loading:!0,networkStatus:u.loading}),t},{})
return r}var i=this&&this.__assign||Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++){t=arguments[n]
for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},s=n(301),a=n(302),l=n(303),u
!function(e){e[e.loading=1]="loading",e[e.setVariables=2]="setVariables",e[e.fetchMore=3]="fetchMore",e[e.refetch=4]="refetch",e[e.poll=6]="poll",e[e.ready=7]="ready",e[e.error=8]="error"}(u=t.NetworkStatus||(t.NetworkStatus={})),
t.queries=r},function(e,t){"use strict"
function n(e){return"APOLLO_QUERY_RESULT"===e.type}function r(e){return"APOLLO_QUERY_ERROR"===e.type}function o(e){return"APOLLO_QUERY_INIT"===e.type}function i(e){return"APOLLO_QUERY_RESULT_CLIENT"===e.type

}function s(e){return"APOLLO_QUERY_STOP"===e.type}function a(e){return"APOLLO_MUTATION_INIT"===e.type}function l(e){return"APOLLO_MUTATION_RESULT"===e.type}function u(e){return"APOLLO_MUTATION_ERROR"===e.type

}function p(e){return"APOLLO_UPDATE_QUERY_RESULT"===e.type}function c(e){return"APOLLO_STORE_RESET"===e.type}function d(e){return"APOLLO_SUBSCRIPTION_RESULT"===e.type}t.isQueryResultAction=n,t.isQueryErrorAction=r,
t.isQueryInitAction=o,t.isQueryResultClientAction=i,t.isQueryStopAction=s,t.isMutationInitAction=a,t.isMutationResultAction=l,t.isMutationErrorAction=u,t.isUpdateQueryResultAction=p,t.isStoreResetAction=c,
t.isSubscriptionResultAction=d},function(e,t,n){"use strict"
function r(e){return"StringValue"===e.kind}function o(e){return"BooleanValue"===e.kind}function i(e){return"IntValue"===e.kind}function s(e){return"FloatValue"===e.kind}function a(e){return"Variable"===e.kind

}function l(e){return"ObjectValue"===e.kind}function u(e){return"ListValue"===e.kind}function p(e){return"EnumValue"===e.kind}function c(e,t,n,d){if(i(n)||s(n))e[t.value]=Number(n.value)
else if(o(n)||r(n))e[t.value]=n.value
else if(l(n)){var f={}
n.fields.map(function(e){return c(f,e.name,e.value,d)}),e[t.value]=f}else if(a(n)){if(!(d&&n.name.value in d))throw new Error('The inline argument "'+n.name.value+'" is expected as a variable but was not provided.')


var h=d[n.name.value]
e[t.value]=h}else if(u(n))e[t.value]=n.values.map(function(e){var n={}
return c(n,t,e,d),n[t.value]})
else{if(!p(n))throw new Error('The inline argument "'+t.value+'" of kind "'+n.kind+'" is not supported.\n                    Use variables instead of inline arguments to overcome this limitation.')
e[t.value]=n.value}}function d(e,t){if(e.arguments&&e.arguments.length){var n={}
return e.arguments.forEach(function(e){var r=e.name,o=e.value
return c(n,r,o,t)}),f(e.name.value,n)}return e.name.value}function f(e,t){if(t){var n=JSON.stringify(t)
return e+"("+n+")"}return e}function h(e){return e.alias?e.alias.value:e.name.value}function m(e){return"Field"===e.kind}function g(e){return"InlineFragment"===e.kind}function y(e){return e.errors&&e.errors.length

}function v(e){return C(e)&&"id"===e.type}function b(e,t){return void 0===t&&(t=!1),{type:"id",id:e,generated:t}}function E(e){return C(e)&&"json"===e.type}var C=n(73)
t.storeKeyNameFromField=d,t.storeKeyNameFromFieldNameAndArgs=f,t.resultKeyNameFromField=h,t.isField=m,t.isInlineFragment=g,t.graphQLResultHasError=y,t.isIdValue=v,t.toIdValue=b,t.isJsonValue=E},function(e,t,n){
function r(e,t){return o(e,t)}var o=n(93)
e.exports=r},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}Object.defineProperty(t,"__esModule",{value:!0}),t.config=t.mutation=void 0


var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=o(["mutation DeleteFile($id:ID!) {\n  deleteFile(id: $id)\n}"],["mutation DeleteFile($id:ID!) {\n  deleteFile(id: $id)\n}"]),a=n(4),l=n(288),u=r(l),p=(0,
u.default)(s),c={props:function e(t){var n=t.mutate,r=t.ownProps.actions,o=function e(t,r){return n({variables:{id:t},resultBehaviors:[{type:"DELETE",dataId:r}]})}
return{actions:i({},r,{files:i({},r.files,{deleteFile:o})})}}}
t.mutation=p,t.config=c,t.default=(0,a.graphql)(p,c)},function(e,t){e.exports=qs},function(e,t,n){(function(t){e.exports=t.InsertEmbedModal=n(307)}).call(t,function(){return this}())},function(e,t,n){"use strict"


function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=e.config.sections[S],r=t.fileAttributes?t.fileAttributes.Url:"",o=n.form.remoteEditForm.schemaUrl,i=r&&o+"/?embedurl="+encodeURIComponent(r),s=n.form.remoteCreateForm.schemaUrl,a=i||s


return{sectionConfig:n,schemaUrl:a,targetUrl:r}}function u(e){return{actions:{schema:(0,y.bindActionCreators)(_,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.InsertEmbedModal=void 0
var p=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&s.return&&s.return()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(5),h=o(f),m=n(2),g=o(m),y=n(8),v=n(9),b=n(23),E=o(b),C=n(297),_=r(C),S="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",w=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSubmit=n.handleSubmit.bind(n),n}return a(t,e),d(t,[{key:"componentWillMount",value:function e(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function e(t){t.show&&!this.props.show&&this.setOverrides(t)

}},{key:"componentWillUnmount",value:function e(){this.clearOverrides()}},{key:"setOverrides",value:function e(t){if(this.props.schemaUrl!==t.schemaUrl&&this.clearOverrides(),t.schemaUrl){var n=c({},t.fileAttributes)


delete n.ID
var r={fields:Object.entries(n).map(function(e){var t=p(e,2),n=t[0],r=t[1]
return{name:n,value:r}})}
this.props.actions.schema.setSchemaStateOverrides(t.schemaUrl,r)}}},{key:"getModalProps",value:function e(){var t=c({handleSubmit:this.handleSubmit,onLoadingError:this.handleLoadingError,showErrorMessage:!0,
responseClassBad:"alert alert-danger"},this.props,{bodyClassName:"fill-height",className:"insert-embed-modal "+this.props.className,bsSize:"lg",handleHide:this.props.onHide,title:this.props.targetUrl?h.default._t("InsertEmbedModal.EditTitle","Media from the web"):h.default._t("InsertEmbedModal.CreateTitle","Insert new media from the web")
})
return delete t.onHide,delete t.sectionConfig,delete t.onInsert,delete t.fileAttributes,t}},{key:"clearOverrides",value:function e(){this.props.actions.schema.setSchemaStateOverrides(this.props.schemaUrl,null)

}},{key:"handleLoadingError",value:function e(t){"function"==typeof this.props.onLoadingError&&this.props.onLoadingError(t)}},{key:"handleSubmit",value:function e(t,n){return"action_addmedia"===n&&this.props.onCreate(t),
"action_insertmedia"===n&&this.props.onInsert(t),"action_cancel"===n&&this.props.onHide(),Promise.resolve()}},{key:"render",value:function e(){return g.default.createElement(E.default,this.getModalProps())

}}]),t}(m.Component)
w.propTypes={sectionConfig:m.PropTypes.shape({url:m.PropTypes.string,form:m.PropTypes.object}),show:m.PropTypes.bool,onInsert:m.PropTypes.func.isRequired,onCreate:m.PropTypes.func.isRequired,fileAttributes:m.PropTypes.shape({
Url:m.PropTypes.string,CaptionText:m.PropTypes.string,PreviewUrl:m.PropTypes.string,Placement:m.PropTypes.string,Width:m.PropTypes.number,Height:m.PropTypes.number}),onHide:m.PropTypes.func.isRequired,
className:m.PropTypes.string,actions:m.PropTypes.object,schemaUrl:m.PropTypes.string.isRequired,targetUrl:m.PropTypes.string,onLoadingError:m.PropTypes.func},w.defaultProps={className:"",fileAttributes:{}
},t.InsertEmbedModal=w,t.default=(0,v.connect)(l,u)(w)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}var o=n(8),i=n(309),s=r(i),a=n(310),l=r(a),u=n(311),p=r(u),c=n(312),d=r(c),f=n(314),h=r(f),m=n(10),g=r(m),y=n(316),v=r(y),b=n(318),E=r(b),C=n(320),_=r(C),S=n(321),w=r(S),P=n(326),F=r(P),x=n(328),T=r(x)


document.addEventListener("DOMContentLoaded",function(){_.default.register("UploadField",w.default),_.default.register("PreviewImageField",F.default),_.default.register("HistoryList",T.default)
var e=s.default.getSection("SilverStripe\\AssetAdmin\\Controller\\AssetAdmin")
l.default.add({path:e.url,component:g.default,indexRoute:{component:g.default},childRoutes:[{path:"show/:folderId/edit/:fileId",component:g.default},{path:"show/:folderId",component:g.default}]}),p.default.add("assetAdmin",(0,
o.combineReducers)({gallery:d.default,queuedFiles:h.default,uploadField:v.default,previewField:E.default}))})},function(e,t){e.exports=Config},function(e,t){e.exports=ReactRouteRegister},function(e,t){
e.exports=ReducerRegister},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p,t=arguments[1]
switch(t.type){case u.default.SET_FILE_BADGE:return i({},e,{badges:e.badges.filter(function(e){return e.id!==t.payload.id}).concat([t.payload])})
case u.default.CLEAR_FILE_BADGE:return i({},e,{badges:e.badges.filter(function(e){return e.id!==t.payload.id})})
case u.default.SET_ENABLE_DROPZONE:return i({},e,{enableDropzone:t.payload.enableDropzone})
case u.default.SET_NOTICE_MESSAGE:return i({},e,{noticeMessage:t.payload.message})
case u.default.SET_ERROR_MESSAGE:return i({},e,{errorMessage:t.payload.message})
case u.default.LOAD_FILE_SUCCESS:var n=e.files.find(function(e){return e.id===t.payload.id})
if(n){var r=i({},n,t.payload.file)
return(0,a.default)(i({},e,{files:e.files.map(function(e){return e.id===r.id?r:e})}))}return e.folder.id===t.payload.id?(0,a.default)(i({},e,{folder:i({},e.folder,t.payload.file)})):e
case u.default.SELECT_FILES:var o=null
return o=null===t.payload.ids?e.files.map(function(e){return e.id}):e.selectedFiles.concat(t.payload.ids.filter(function(t){return e.selectedFiles.indexOf(t)===-1})),(0,a.default)(i({},e,{selectedFiles:o
}))
case u.default.DESELECT_FILES:var s=null
return s=null===t.payload.ids?[]:e.selectedFiles.filter(function(e){return t.payload.ids.indexOf(e)===-1}),(0,a.default)(i({},e,{selectedFiles:s}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}
t.default=o
var s=n(313),a=r(s),l=n(16),u=r(l),p={editorFields:[],file:null,files:[],focus:!1,path:null,selectedFiles:[],page:0,errorMessage:null,enableDropzone:!0,badges:[]}},function(e,t){e.exports=DeepFreezeStrict

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:h,t=arguments[1]
switch(t.type){case u.default.ADD_QUEUED_FILE:return(0,a.default)(i({},e,{items:e.items.concat([i({},c.default,t.payload.file)])}))
case u.default.FAIL_UPLOAD:return(0,a.default)(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,{message:t.payload.message}):e})}))
case u.default.PURGE_UPLOAD_QUEUE:return(0,a.default)(i({},e,{items:e.items.filter(function(e){return!e.id})}))
case u.default.REMOVE_QUEUED_FILE:return(0,a.default)(i({},e,{items:e.items.filter(function(e){return e.queuedId!==t.payload.queuedId})}))
case u.default.SUCCEED_UPLOAD:return(0,a.default)(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,t.payload.json,{messages:[{value:f.default._t("AssetAdmin.DROPZONE_SUCCESS_UPLOAD"),
type:"success",extraClass:"success"}]}):e})}))
case u.default.UPDATE_QUEUED_FILE:return(0,a.default)(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,t.payload.updates):e})}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=n(313),a=r(s),l=n(19),u=r(l),p=n(315),c=r(p),d=n(5),f=r(d),h={items:[]}
t.default=o},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(313),i=r(o),s=(0,i.default)({name:null,canDelete:!1,canEdit:!1,category:null,created:null,extension:null,filename:null,id:0,lastEdited:null,messages:null,owner:{id:0,title:null},parent:{filename:null,
id:0,title:null},queuedId:null,size:null,title:null,type:null,url:null,xhr:null,thumbnail:null,smallThumbnail:null,height:null,width:null})
t.default=s},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:h,t=arguments[1],n=function n(r){
if(!t.payload.fieldId)throw new Error("Invalid fieldId")
var o=e.fields[t.payload.fieldId]?e.fields[t.payload.fieldId]:m
return(0,u.default)(a({},e,{fields:a({},e.fields,i({},t.payload.fieldId,a({},o,r(o))))}))}
switch(t.type){case c.default.UPLOADFIELD_ADD_FILE:return n(function(e){return{files:[].concat(o(e.files),[a({},f.default,t.payload.file)])}})
case c.default.UPLOADFIELD_SET_FILES:return n(function(){return{files:t.payload.files}})
case c.default.UPLOADFIELD_UPLOAD_FAILURE:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,{message:t.payload.message}):e})}})
case c.default.UPLOADFIELD_REMOVE_FILE:return n(function(e){return{files:e.files.filter(function(e){return!(t.payload.file.queuedId&&e.queuedId===t.payload.file.queuedId||t.payload.file.id&&e.id===t.payload.file.id)

})}})
case c.default.UPLOADFIELD_UPLOAD_SUCCESS:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,t.payload.json):e})}})
case c.default.UPLOADFIELD_UPDATE_QUEUED_FILE:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,t.payload.updates):e})}})
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=n(313),u=r(l),p=n(317),c=r(p),d=n(315),f=r(d),h={fields:{}},m={files:[]}
t.default=s},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.default={UPLOADFIELD_ADD_FILE:"UPLOADFIELD_ADD_FILE",UPLOADFIELD_SET_FILES:"UPLOADFIELD_SET_FILES",UPLOADFIELD_REMOVE_FILE:"UPLOADFIELD_REMOVE_FILE",UPLOADFIELD_UPLOAD_FAILURE:"UPLOADFIELD_UPLOAD_FAILURE",
UPLOADFIELD_UPLOAD_SUCCESS:"UPLOADFIELD_UPLOAD_SUCCESS",UPLOADFIELD_UPDATE_QUEUED_FILE:"UPLOADFIELD_UPDATE_QUEUED_FILE"}},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c,t=arguments[1]


switch(t.type){case p.default.PREVIEWFIELD_ADD_FILE:return(0,l.default)(s({},e,o({},t.payload.id,t.payload.file)))
case p.default.PREVIEWFIELD_FAIL_UPLOAD:return(0,l.default)(s({},e,o({},t.payload.id,s({},e[t.payload.id],t.payload.message))))
case p.default.PREVIEWFIELD_REMOVE_FILE:return(0,l.default)(s({},e,o({},t.payload.id,void 0)))
case p.default.PREVIEWFIELD_UPDATE_FILE:return(0,l.default)(s({},e,o({},t.payload.id,s({},e[t.payload.id],t.payload.data))))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(313),l=r(a),u=n(319),p=r(u),c={}
t.default=i},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.default={PREVIEWFIELD_ADD_FILE:"PREVIEWFIELD_ADD_FILE",PREVIEWFIELD_REMOVE_FILE:"PREVIEWFIELD_REMOVE_FILE",PREVIEWFIELD_UPDATE_FILE:"PREVIEWFIELD_UPDATE_FILE",
PREVIEWFIELD_FAIL_UPLOAD:"PREVIEWFIELD_FAIL_UPLOAD"}},function(e,t){e.exports=Injector},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=t.id,r=[]


e.assetAdmin&&e.assetAdmin.uploadField&&e.assetAdmin.uploadField.fields&&e.assetAdmin.uploadField.fields[n]&&(r=e.assetAdmin.uploadField.fields[n].files||[])
var o=e.config.SecurityID
return{files:r,securityId:o}}function u(e){return{actions:{uploadField:(0,y.bindActionCreators)(D,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.ConnectedUploadField=t.UploadField=void 0
var p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(5),f=o(d),h=n(2),m=o(h),g=n(9),y=n(8),v=n(21),b=o(v),E=n(13),C=o(E),_=n(322),S=o(_),w=n(323),P=o(w),F=n(27),x=o(F),T=n(324),O=o(T),I=n(34),A=o(I),k=n(325),D=r(k),N=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.renderChild=n.renderChild.bind(n),n.handleAddShow=n.handleAddShow.bind(n),n.handleAddHide=n.handleAddHide.bind(n),n.handleAddInsert=n.handleAddInsert.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),
n.handleSending=n.handleSending.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),
n.handleItemRemove=n.handleItemRemove.bind(n),n.handleChange=n.handleChange.bind(n),n.state={selecting:!1},n}return a(t,e),c(t,[{key:"componentDidMount",value:function e(){this.props.actions.uploadField.setFiles(this.props.id,this.props.data.files)

}},{key:"componentWillReceiveProps",value:function e(t){var n=this.props.files||[],r=t.files||[],o=this.compareValues(n,r)
o&&this.handleChange(t)}},{key:"compareValues",value:function e(t,n){if(t.length!==n.length)return!0
for(var r=0;r<t.length;r++)if(t[r].id!==n[r].id)return!0
return!1}},{key:"handleAddedFile",value:function e(t){var n=p({},t,{uploaded:!0})
this.props.actions.uploadField.addFile(this.props.id,n)}},{key:"handleSending",value:function e(t,n){this.props.actions.uploadField.updateQueuedFile(this.props.id,t._queuedId,{xhr:n})}},{key:"handleUploadProgress",
value:function e(t,n){this.props.actions.uploadField.updateQueuedFile(this.props.id,t._queuedId,{progress:n})}},{key:"handleSuccessfulUpload",value:function e(t){var n=JSON.parse(t.xhr.response)
return"undefined"!=typeof n[0].error?void this.handleFailedUpload(t):void this.props.actions.uploadField.succeedUpload(this.props.id,t._queuedId,n[0])}},{key:"handleFailedUpload",value:function e(t,n){
this.props.actions.uploadField.failUpload(this.props.id,t._queuedId,n)}},{key:"handleItemRemove",value:function e(t,n){this.props.actions.uploadField.removeFile(this.props.id,n)}},{key:"handleChange",value:function e(t){
if("function"==typeof t.onChange){var n=t.files.filter(function(e){return e.id}).map(function(e){return e.id}),r={Files:n}
t.onChange(r)}}},{key:"handleSelect",value:function e(t){t.preventDefault()}},{key:"handleAddShow",value:function e(t){t.preventDefault(),this.setState({selecting:!0})}},{key:"handleAddHide",value:function e(){
this.setState({selecting:!1})}},{key:"handleAddInsert",value:function e(t,n){this.props.actions.uploadField.addFile(this.props.id,n),this.handleAddHide()}},{key:"render",value:function e(){return m.default.createElement("div",{
className:"uploadfield"},this.renderDropzone(),this.props.files.map(this.renderChild),this.renderDialog())}},{key:"canEdit",value:function e(){return!this.props.disabled&&!this.props.readOnly}},{key:"renderDropzone",
value:function e(){if(!this.props.data.createFileEndpoint)return null
var t={height:b.default.SMALL_THUMBNAIL_HEIGHT,width:b.default.SMALL_THUMBNAIL_WIDTH},n=this.props.name,r={url:this.props.data.createFileEndpoint.url,method:this.props.data.createFileEndpoint.method,paramName:"Upload",
thumbnailWidth:b.default.SMALL_THUMBNAIL_WIDTH,thumbnailHeight:b.default.SMALL_THUMBNAIL_HEIGHT}
if(this.props.data.multi||(r.maxFiles=1),!this.canEdit())return this.props.files.length?null:m.default.createElement("p",null,f.default._t("AssetAdminUploadField.EMPTY","No files"))
var o=["uploadfield__dropzone"]
this.props.files.length&&!this.props.data.multi&&o.push("uploadfield__dropzone--hidden")
var i=this.props.securityId
return m.default.createElement(x.default,{name:n,canUpload:!0,uploadButton:!1,uploadSelector:".uploadfield__upload-button, .uploadfield__backdrop",folderId:this.props.data.parentid,handleAddedFile:this.handleAddedFile,
handleError:this.handleFailedUpload,handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,preview:t,options:r,securityID:i,className:o.join(" ")
},m.default.createElement("div",{className:"uploadfield__backdrop"}),m.default.createElement("span",{className:"uploadfield__droptext"},m.default.createElement("button",{onClick:this.handleSelect,className:"uploadfield__upload-button"
},f.default._t("AssetAdminUploadField.BROWSE","Browse"))," ",f.default._t("AssetAdminUploadField.OR","or")," ",m.default.createElement("button",{onClick:this.handleAddShow,className:"uploadfield__add-button"
},f.default._t("AssetAdminUploadField.ADD_FILES","Add from files"))))}},{key:"renderDialog",value:function e(){return m.default.createElement(O.default,{title:!1,show:this.state.selecting,onInsert:this.handleAddInsert,
onHide:this.handleAddHide,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",type:"select"})}},{key:"renderChild",value:function e(t,n){var r={key:n,item:t,name:this.props.name,
handleRemove:this.handleItemRemove,canEdit:this.canEdit()}
return m.default.createElement(P.default,r)}}]),t}(C.default)
N.propTypes={extraClass:m.default.PropTypes.string,id:m.default.PropTypes.string.isRequired,name:m.default.PropTypes.string.isRequired,onChange:m.default.PropTypes.func,value:m.default.PropTypes.shape({
Files:m.default.PropTypes.arrayOf(m.default.PropTypes.number)}),files:m.default.PropTypes.arrayOf(A.default),readOnly:m.default.PropTypes.bool,disabled:m.default.PropTypes.bool,data:m.default.PropTypes.shape({
createFileEndpoint:m.default.PropTypes.shape({url:m.default.PropTypes.string.isRequired,method:m.default.PropTypes.string.isRequired,payloadFormat:m.default.PropTypes.string.isRequired}),multi:m.default.PropTypes.bool,
parentid:m.default.PropTypes.number})},N.defaultProps={value:{Files:[]},extraClass:"",className:""}
var R=(0,g.connect)(l,u)(N)
t.UploadField=N,t.ConnectedUploadField=R,t.default=(0,S.default)(R)},function(e,t){e.exports=FieldHolder},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(5),u=r(l),p=n(2),c=r(p),d=n(13),f=r(d),h=n(21),m=r(h),g=n(34),y=r(g),v=n(30),b=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleRemove=n.handleRemove.bind(n),n}return s(t,e),a(t,[{key:"getThumbnailStyles",value:function e(){if(this.isImage()&&(this.exists()||this.uploading())){var t=this.props.item.smallThumbnail||this.props.item.url


return{backgroundImage:"url("+t+")"}}return{}}},{key:"hasError",value:function e(){return!!this.props.item.message&&"error"===this.props.item.message.type}},{key:"renderErrorMessage",value:function e(){
var t=null
return this.hasError()?t=this.props.item.message.value:this.exists()||this.uploading()||(t=u.default._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==t?c.default.createElement("div",{className:"uploadfield-item__error-message"
},t):null}},{key:"getThumbnailClassNames",value:function e(){var t=["uploadfield-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&t.push("uploadfield-item__thumbnail--small"),t.join(" ")}},{key:"getItemClassNames",value:function e(){var t=this.props.item.category||"none",n=["fill-width","uploadfield-item","uploadfield-item--"+t]


return this.exists()||this.uploading()||n.push("uploadfield-item--missing"),this.hasError()&&n.push("uploadfield-item--error"),n.join(" ")}},{key:"isImage",value:function e(){return"image"===this.props.item.category

}},{key:"exists",value:function e(){return this.props.item.exists}},{key:"uploading",value:function e(){return!!this.props.item.uploaded}},{key:"complete",value:function e(){return this.uploading()&&this.props.item.id>0

}},{key:"isImageSmallerThanThumbnail",value:function e(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1
var t=this.props.item.width,n=this.props.item.height
return n&&t&&n<m.default.SMALL_THUMBNAIL_HEIGHT&&t<m.default.SMALL_THUMBNAIL_WIDTH}},{key:"preventFocus",value:function e(t){t.preventDefault()}},{key:"handleRemove",value:function e(t){t.preventDefault(),
this.props.handleRemove&&this.props.handleRemove(t,this.props.item)}},{key:"renderProgressBar",value:function e(){var t={className:"uploadfield-item__progress-bar",style:{width:this.props.item.progress+"%"
}}
return!this.hasError()&&this.uploading()?this.complete()?c.default.createElement("div",{className:"uploadfield-item__complete-icon"}):c.default.createElement("div",{className:"uploadfield-item__upload-progress"
},c.default.createElement("div",t)):null}},{key:"renderRemoveButton",value:function e(){if(!this.props.canEdit)return null
var t=["btn","uploadfield-item__remove-btn","btn-secondary","btn--no-text","font-icon-cancel","btn--icon-md"].join(" ")
return c.default.createElement("button",{className:t,onClick:this.handleRemove,ref:"backButton"})}},{key:"renderFileDetails",value:function e(){var t=""
return this.props.item.size&&(t=", "+(0,v.fileSize)(this.props.item.size)),c.default.createElement("div",{className:"uploadfield-item__details fill-width flexbox-area-grow"},c.default.createElement("span",{
className:"uploadfield-item__title",ref:"title"},this.props.item.title),c.default.createElement("span",{className:"uploadfield-item__meta"},this.props.item.extension,t))}},{key:"render",value:function e(){
var t=this.props.name+"[Files][]"
return c.default.createElement("div",{className:this.getItemClassNames()},c.default.createElement("input",{type:"hidden",value:this.props.item.id,name:t}),c.default.createElement("div",{ref:"thumbnail",
className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()}),this.renderFileDetails(),this.renderProgressBar(),this.renderErrorMessage(),this.renderRemoveButton())}}]),t}(f.default)
b.propTypes={canEdit:c.default.PropTypes.bool,name:c.default.PropTypes.string.isRequired,item:y.default,handleRemove:c.default.PropTypes.func},t.default=b},function(e,t){e.exports=InsertMediaModal},function(e,t,n){
"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return function(n){return n({type:c.default.UPLOADFIELD_ADD_FILE,payload:{fieldId:e,file:t}})}}function i(e,t){return function(n){return n({
type:c.default.UPLOADFIELD_SET_FILES,payload:{fieldId:e,files:t}})}}function s(e,t,n){return function(r){var o=n.message
return"string"==typeof n&&(o={value:n,type:"error"}),r({type:c.default.UPLOADFIELD_UPLOAD_FAILURE,payload:{fieldId:e,queuedId:t,message:o}})}}function a(e,t){return function(n){return n({type:c.default.UPLOADFIELD_REMOVE_FILE,
payload:{fieldId:e,file:t}})}}function l(e,t,n){return function(r){return r({type:c.default.UPLOADFIELD_UPLOAD_SUCCESS,payload:{fieldId:e,queuedId:t,json:n}})}}function u(e,t,n){return function(r){return r({
type:c.default.UPLOADFIELD_UPDATE_QUEUED_FILE,payload:{fieldId:e,queuedId:t,updates:n}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addFile=o,t.setFiles=i,t.failUpload=s,t.removeFile=a,t.succeedUpload=l,
t.updateQueuedFile=u
var p=n(317),c=r(p)},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=e.config.SecurityID,r=t.id,o=e.assetAdmin.previewField[r]||{},i=(0,
C.formValueSelector)(t.formid)
return{securityID:n,upload:o,nameValue:i(e,"Name")}}function u(e){return{actions:{previewField:(0,E.bindActionCreators)(S,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.PreviewImageField=void 0


var p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(5),d=o(c),f=n(2),h=o(f),m=n(27),g=o(m),y=n(21),v=o(y),b=n(9),E=n(8),C=n(298),_=n(327),S=r(_),w=n(30),P=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleAddedFile=n.handleAddedFile.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleSending=n.handleSending.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),
n.handleCancelUpload=n.handleCancelUpload.bind(n),n.handleRemoveErroredUpload=n.handleRemoveErroredUpload.bind(n),n.canFileUpload=n.canFileUpload.bind(n),n.updateFormData=n.updateFormData.bind(n),n}return a(t,e),
p(t,[{key:"componentWillReceiveProps",value:function e(t){(this.props.data.url&&t.data.url!==this.props.data.url||this.props.data.version&&t.data.version!==this.props.data.version)&&this.props.actions.previewField.removeFile(this.props.id)

}},{key:"componentWillUnmount",value:function e(){this.props.actions.previewField.removeFile(this.props.id)}},{key:"getDropzoneProps",value:function e(){var t=this.props.data.uploadFileEndpoint,n=this.props.name,r={
url:t&&t.url,method:t&&t.method,paramName:"Upload",clickable:"#preview-replace-button",maxFiles:1},o={height:v.default.THUMBNAIL_HEIGHT,width:v.default.THUMBNAIL_WIDTH},i=this.props.securityID,s=["asset-dropzone--button","preview__container",this.props.className,this.props.extraClass]


return{name:n,className:s.join(" "),canUpload:t&&this.canEdit(),preview:o,folderId:this.props.data.parentid,options:r,securityID:i,uploadButton:!1,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,
handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,canFileUpload:this.canFileUpload,updateFormData:this.updateFormData}}},{key:"canEdit",
value:function e(){return!this.props.readOnly&&!this.props.disabled&&"folder"!==this.props.data.category}},{key:"preventDefault",value:function e(t){t.preventDefault()}},{key:"canFileUpload",value:function e(t){
var n=this.props.data.initialValues.FileFilename,r=(0,w.getFileExtension)(n),o=(0,w.getFileExtension)(t.name)
if(!r||r===o)return!0
var i=d.default._t("AssetAdmin.CONFIRM_CHANGE_EXTENSION","Are you sure you want upload a file with a different extension?")
return this.props.confirm(i)}},{key:"handleCancelUpload",value:function e(){this.props.upload.xhr&&this.props.upload.xhr.abort(),this.handleRemoveErroredUpload()}},{key:"handleRemoveErroredUpload",value:function e(){
if("function"==typeof this.props.onAutofill){var t=this.props.data.initialValues
this.props.onAutofill("FileFilename",t.FileFilename),this.props.onAutofill("FileHash",t.FileHash),this.props.onAutofill("FileVariant",t.FileVariant)}this.props.actions.previewField.removeFile(this.props.id)

}},{key:"handleAddedFile",value:function e(t){this.props.actions.previewField.addFile(this.props.id,t)}},{key:"handleFailedUpload",value:function e(t,n){this.props.actions.previewField.failUpload(this.props.id,n)

}},{key:"handleSuccessfulUpload",value:function e(t){var n=JSON.parse(t.xhr.response)
"function"==typeof this.props.onAutofill&&(this.props.onAutofill("FileFilename",n.Filename),this.props.onAutofill("FileHash",n.Hash),this.props.onAutofill("FileVariant",n.Variant),n.Name&&this.props.onAutofill(this.props.data.nameField,n.Name))

}},{key:"handleSending",value:function e(t,n){this.props.actions.previewField.updateFile(this.props.id,{xhr:n})}},{key:"updateFormData",value:function e(t){t.append("ID",this.props.data.id),t.append("Name",this.props.nameValue)

}},{key:"handleUploadProgress",value:function e(t,n){this.props.actions.previewField.updateFile(this.props.id,{progress:n})}},{key:"renderImage",value:function e(){var t=this.props.data
if(!t.exists&&!this.props.upload.url)return h.default.createElement("div",{className:"editor__file-preview-message--file-missing"},d.default._t("AssetAdmin.FILE_MISSING","File cannot be found"))
var n=this.props.upload.category,r=n&&"image"!==n?v.default.DEFAULT_PREVIEW:this.props.upload.url||t.preview||t.url,o=h.default.createElement("img",{alt:"preview",src:r,className:"editor__thumbnail"}),i=this.props.upload.progress,s=t.url&&!i?h.default.createElement("a",{
className:"editor__file-preview-link",href:t.url,target:"_blank"},o):null,a=i>0&&i<100?h.default.createElement("div",{className:"preview__progress"},h.default.createElement("div",{className:"preview__progress-bar",
style:{width:i+"%"}})):null,l=this.props.upload.message,u=null
return l?u=h.default.createElement("div",{className:"preview__message preview__message--"+l.type},l.value):100===i&&(u=h.default.createElement("div",{className:"preview__message preview__message--success"
},d.default._t("AssetAdmin.REPlACE_FILE_SUCCESS","Upload successful, the file will be replaced when you Save."))),h.default.createElement("div",{className:"editor__thumbnail-container"},s||o,a,u)}},{key:"renderToolbar",
value:function e(){var t=this.canEdit()
return this.props.data.url||t?h.default.createElement("div",{className:"preview__toolbar fill-height"},this.props.data.url?h.default.createElement("a",{href:this.props.data.url,target:"_blank",className:"preview__toolbar-button--link preview__toolbar-button"
},"Open"):null,t?h.default.createElement("button",{id:"preview-replace-button",onClick:this.preventDefault,className:"preview__toolbar-button--replace preview__toolbar-button"},"Replace"):null,this.props.upload.progress||this.props.upload.message?h.default.createElement("button",{
onClick:this.handleCancelUpload,className:"preview__toolbar-button--remove preview__toolbar-button"},"Remove"):null):null}},{key:"render",value:function e(){var t=this.getDropzoneProps()
if(this.canEdit())return h.default.createElement(g.default,t,this.renderImage(),this.renderToolbar())
var n=["preview__container",this.props.className,this.props.extraClass]
return h.default.createElement("div",{className:n.join(" ")},this.renderImage(),this.renderToolbar())}}]),t}(f.Component)
P.propTypes={id:f.PropTypes.string.isRequired,name:f.PropTypes.string,className:f.PropTypes.string,extraClass:f.PropTypes.string,readOnly:f.PropTypes.bool,disabled:f.PropTypes.bool,onAutofill:f.PropTypes.func,
formid:f.PropTypes.string,nameValue:f.PropTypes.string,data:f.PropTypes.shape({id:f.PropTypes.number,parentid:f.PropTypes.number,version:f.PropTypes.number,url:f.PropTypes.string,exists:f.PropTypes.bool,
preview:f.PropTypes.string,category:f.PropTypes.string,nameField:f.PropTypes.string,uploadFileEndpoint:f.PropTypes.shape({url:f.PropTypes.string.isRequired,method:f.PropTypes.string.isRequired,payloadFormat:f.PropTypes.string
}),initialValues:f.PropTypes.object}).isRequired,upload:f.PropTypes.shape({url:f.PropTypes.string,progress:f.PropTypes.number,xhr:f.PropTypes.object,category:f.PropTypes.string,message:f.PropTypes.shape({
type:f.PropTypes.string.isRequired,value:f.PropTypes.string.isRequired})}),actions:f.PropTypes.object,securityID:f.PropTypes.string,confirm:f.PropTypes.func},P.defaultProps={extraClass:"",className:"",
data:{},upload:{},confirm:function e(t){return window.confirm(t)}},t.PreviewImageField=P,t.default=(0,b.connect)(l,u)(P)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e){return{type:u.default.PREVIEWFIELD_REMOVE_FILE,payload:{id:e}}}function i(e,t){return{type:u.default.PREVIEWFIELD_ADD_FILE,payload:{id:e,
file:t}}}function s(e,t){return{type:u.default.PREVIEWFIELD_FAIL_UPLOAD,payload:{id:e,message:t}}}function a(e,t){return{type:u.default.PREVIEWFIELD_UPDATE_FILE,payload:{id:e,data:t}}}Object.defineProperty(t,"__esModule",{
value:!0}),t.removeFile=o,t.addFile=i,t.failUpload=s,t.updateFile=a
var l=n(319),u=r(l)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t=e.config.sections["SilverStripe\\AssetAdmin\\Controller\\AssetAdmin"]


return{sectionConfig:t,historySchemaUrl:t.form.fileHistoryForm.schemaUrl}}Object.defineProperty(t,"__esModule",{value:!0}),t.HistoryList=void 0
var l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),p=n(2),c=r(p),d=n(9),f=n(14),h=r(f),m=n(309),g=r(m),y=n(329),v=r(y),b=n(22),E=r(b),C=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.state={detailView:null,history:[],loadedDetails:!0},n.handleClick=n.handleClick.bind(n),n.handleBack=n.handleBack.bind(n),n.api=n.createEndpoint(e.sectionConfig.historyEndpoint),n}return s(t,e),
u(t,[{key:"componentDidMount",value:function e(){this.refreshHistoryIfNeeded()}},{key:"componentWillReceiveProps",value:function e(t){this.refreshHistoryIfNeeded(t)}},{key:"getContainerClassName",value:function e(){
return this.state.viewDetails&&!this.state.loadedDetails?"file-history history-container--loading":"file-history"}},{key:"refreshHistoryIfNeeded",value:function e(t){var n=this
t&&t.data.fileId===this.props.data.fileId&&t.data.latestVersionId===this.props.data.latestVersionId||this.api({fileId:t?t.data.fileId:this.props.data.fileId}).then(function(e){n.setState({history:e})})

}},{key:"handleClick",value:function e(t){this.setState({viewDetails:t})}},{key:"handleBack",value:function e(t){t.preventDefault(),this.setState({viewDetails:null})}},{key:"createEndpoint",value:function e(t){
var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]
return h.default.createEndpointFetcher(l({},t,n?{defaultData:{SecurityID:g.default.get("SecurityID")}}:{}))}},{key:"render",value:function e(){var t=this,n=this.getContainerClassName()
if(!this.state.history)return c.default.createElement("div",{className:n})
if(this.state.viewDetails){var r=[this.props.historySchemaUrl,this.props.data.fileId,this.state.viewDetails].join("/"),o=["btn btn-secondary","btn--icon-xl btn--no-text","font-icon-left-open-big","file-history__back"].join(" ")


return c.default.createElement("div",{className:n},c.default.createElement("a",{className:o,onClick:this.handleBack}),c.default.createElement(E.default,{schemaUrl:r}))}return c.default.createElement("div",{
className:n},c.default.createElement("ul",{className:"list-group list-group-flush file-history__list"},this.state.history.map(function(e){return c.default.createElement(v.default,l({key:e.versionid},e,{
onClick:t.handleClick}))})))}}]),t}(p.Component)
C.propTypes={sectionConfig:c.default.PropTypes.shape({form:c.default.PropTypes.object,historyEndpoint:c.default.PropTypes.shape({url:c.default.PropTypes.string,method:c.default.PropTypes.string,responseFormat:c.default.PropTypes.string
})}),historySchemaUrl:c.default.PropTypes.string,data:c.default.PropTypes.object},C.defaultProps={data:{fieldId:0}},t.HistoryList=C,t.default=(0,d.connect)(a)(C)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(2),u=r(l),p=n(13),c=r(p),d=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleClick=n.handleClick.bind(n),n}return s(t,e),a(t,[{key:"handleClick",value:function e(t){t.preventDefault(),"function"==typeof this.props.onClick&&this.props.onClick(this.props.versionid)

}},{key:"render",value:function e(){var t=null
return"Published"===this.props.status&&(t=u.default.createElement("p",null,u.default.createElement("span",{className:"history-item__status-flag"},this.props.status)," at ",this.props.date_formatted)),u.default.createElement("li",{
className:"list-group-item history-item",onClick:this.handleClick},u.default.createElement("p",null,u.default.createElement("span",{className:"history-item__version"},"v.",this.props.versionid),u.default.createElement("span",{
className:"history-item__date"},this.props.date_ago," ",this.props.author),this.props.summary),t)}}]),t}(c.default)
d.propTypes={versionid:l.PropTypes.number.isRequired,summary:l.PropTypes.oneOfType([l.PropTypes.bool,l.PropTypes.string]).isRequired,status:l.PropTypes.string,author:l.PropTypes.string,date:l.PropTypes.string,
onClick:l.PropTypes.func},t.default=d},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}var o=n(1),i=r(o),s=n(2),a=r(s),l=n(3),u=r(l),p=n(4),c=n(331),d=n(321)
i.default.entwine("ss",function(e){e(".js-react-boot input.entwine-uploadfield:visible").entwine({onunmatch:function e(){this._super(),u.default.unmountComponentAtNode(this[0])},onmatch:function e(){this._super(),
this.refresh()},refresh:function e(){var t=window.ss.store,n=window.ss.apolloClient,r=this.getAttributes()
u.default.render(a.default.createElement(p.ApolloProvider,{store:t,client:n},a.default.createElement(d.ConnectedUploadField,r)),this.parent()[0])},getAttributes:function t(){var n=e(this).data("state"),r=e(this).data("schema")


return(0,c.schemaMerge)(r,n)}})})},function(e,t){e.exports=schemaFieldValues},function(e,t){}])

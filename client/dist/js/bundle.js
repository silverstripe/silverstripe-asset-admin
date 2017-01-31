!function(e){function t(r){if(n[r])return n[r].exports
var o=n[r]={exports:{},id:r,loaded:!1}
return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={}
return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict"
n(1),n(293),n(315),n(317)},function(e,t,n){(function(t){e.exports=t.InsertMediaModal=n(2)}).call(t,function(){return this}())},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=e.config.sections[P],r=t.fileAttributes?t.fileAttributes.ID:null,o=r&&n.form.fileInsertForm.schemaUrl+"/"+r


return{sectionConfig:n,schemaUrl:o}}function u(e){return{actions:{schema:(0,y.bindActionCreators)(F,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.InsertMediaModal=void 0
var p=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&s.return&&s.return()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(3),h=o(f),m=n(4),g=o(m),y=n(5),v=n(6),b=n(7),C=n(9),E=o(C),S=n(20),_=o(S),w=n(290),F=r(w),P="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",x=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSubmit=n.handleSubmit.bind(n),n.handleBrowse=n.handleBrowse.bind(n),n.handleOpenFolder=n.handleOpenFolder.bind(n),n.getUrl=n.getUrl.bind(n),n.state={folderId:0,fileId:e.fileAttributes.ID,
query:{}},n}return a(t,e),c(t,[{key:"componentWillMount",value:function e(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function e(t){!t.show&&this.props.show&&this.setState({
folderId:0,fileId:null,query:{}}),t.show&&!this.props.show&&t.fileAttributes.ID&&(this.setOverrides(t),this.setState({folderId:0,fileId:t.fileAttributes.ID}))}},{key:"componentWillUnmount",value:function e(){
this.setOverrides()}},{key:"setOverrides",value:function e(t){if(!t||this.props.schemaUrl!==t.schemaUrl){var n=t&&t.schemaUrl||this.props.schemaUrl
n&&this.props.actions.schema.setSchemaStateOverrides(n,null)}if(t&&t.schemaUrl){var r=d({},t.fileAttributes)
delete r.ID
var o={fields:Object.entries(r).map(function(e){var t=p(e,2),n=t[0],r=t[1]
return{name:n,value:r}})}
this.props.actions.schema.setSchemaStateOverrides(t.schemaUrl,o)}}},{key:"getUrl",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=parseInt(t||0,10),i=parseInt(n||0,10),s=o!==this.getFolderId(),a=d({},r)


return(s||a.page<=1)&&delete a.page,(0,b.buildUrl)(this.props.sectionConfig.url,o,i,a)}},{key:"getFolderId",value:function e(){return parseInt(this.state.folderId||0,10)}},{key:"getFileId",value:function e(){
return parseInt(this.state.fileId||this.props.fileId,10)}},{key:"getSectionProps",value:function e(){return{dialog:!0,type:this.props.type,toolbarChildren:this.renderToolbarChildren(),sectionConfig:this.props.sectionConfig,
folderId:this.getFolderId(),fileId:this.getFileId(),query:this.state.query,getUrl:this.getUrl,onBrowse:this.handleBrowse,onOpenFolder:this.handleOpenFolder,onSubmitEditor:this.handleSubmit}}},{key:"getModalProps",
value:function e(){var t=d({},this.props,{className:"insert-media-modal "+this.props.className,bsSize:"lg"})
return delete t.onHide,delete t.onInsert,delete t.sectionConfig,delete t.schemaUrl,t}},{key:"handleSubmit",value:function e(t,n,r,o){return this.props.onInsert(t,o)}},{key:"handleBrowse",value:function e(t,n){
var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}
this.setState({folderId:t,fileId:n,query:r})}},{key:"handleOpenFolder",value:function e(t){this.handleBrowse(t)}},{key:"renderToolbarChildren",value:function e(){return g.default.createElement("button",{
type:"button",className:"btn btn-secondary close insert-media-modal__close-button",onClick:this.props.onHide,"aria-label":h.default._t("FormBuilderModal.CLOSE","Close")},g.default.createElement("span",{
"aria-hidden":"true"},"×"))}},{key:"render",value:function e(){var t=this.getModalProps(),n=this.getSectionProps(),r=this.props.show?g.default.createElement(E.default,n):null
return g.default.createElement(_.default,t,r)}}]),t}(m.Component)
x.propTypes={sectionConfig:m.PropTypes.shape({url:m.PropTypes.string,form:m.PropTypes.object}),type:m.PropTypes.oneOf(["insert","select","admin"]),schemaUrl:m.PropTypes.string,show:m.PropTypes.bool,onInsert:m.PropTypes.func.isRequired,
fileAttributes:m.PropTypes.shape({ID:m.PropTypes.number,AltText:m.PropTypes.string,Width:m.PropTypes.number,Height:m.PropTypes.number,TitleTooltip:m.PropTypes.string,Alignment:m.PropTypes.string}),fileId:m.PropTypes.number,
onHide:m.PropTypes.func,className:m.PropTypes.string,actions:m.PropTypes.object},x.defaultProps={className:"",fileAttributes:{},type:"insert"},t.InsertMediaModal=x,t.default=(0,v.connect)(l,u)(x)},function(e,t){
e.exports=i18n},function(e,t){e.exports=React},function(e,t){e.exports=Redux},function(e,t){e.exports=ReactRedux},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t,n,r){var o=null


o=n?e+"/show/"+t+"/edit/"+n:t?e+"/show/"+t:e+"/"
var i=r&&Object.keys(r).length>0
return i&&(o=o+"?"+b.default.stringify(r)),o}function l(e){var t=e.config.sections[C]
return{sectionConfig:t}}Object.defineProperty(t,"__esModule",{value:!0}),t.buildUrl=t.AssetAdminRouter=void 0
var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(4),c=r(d),f=n(6),h=n(8),m=n(9),g=r(m),y=n(29),v=n(292),b=r(v),C="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",E=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleBrowse=n.handleBrowse.bind(n),n.getUrl=n.getUrl.bind(n),n}return s(t,e),p(t,[{key:"getUrl",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=parseInt(t||0,10),i=parseInt(n||0,10),s=o!==this.getFolderId(),l=u({},r)


return(s||l.page<=1)&&delete l.page,a(this.props.sectionConfig.url,o,i,l)}},{key:"getFolderId",value:function e(){return this.props.params&&this.props.params.folderId?parseInt(this.props.params.folderId,10):0

}},{key:"getFileId",value:function e(){return this.props.params&&this.props.params.fileId?parseInt(this.props.params.fileId,10):0}},{key:"getSectionProps",value:function e(){return{sectionConfig:this.props.sectionConfig,
type:"admin",folderId:this.getFolderId(),fileId:this.getFileId(),query:this.getQuery(),getUrl:this.getUrl,onBrowse:this.handleBrowse}}},{key:"getQuery",value:function e(){return(0,y.decodeQuery)(this.props.location.search)

}},{key:"handleBrowse",value:function e(t,n,r){var o=this.getUrl(t,n,r)
this.props.router.push(o)}},{key:"render",value:function e(){return this.props.sectionConfig?c.default.createElement(g.default,this.getSectionProps()):null}}]),t}(d.Component)
E.propTypes={sectionConfig:d.PropTypes.shape({url:d.PropTypes.string,limit:d.PropTypes.number,form:d.PropTypes.object}),location:d.PropTypes.shape({pathname:d.PropTypes.string,query:d.PropTypes.object,
search:d.PropTypes.string}),params:d.PropTypes.object,router:d.PropTypes.object},t.AssetAdminRouter=E,t.buildUrl=a,t.default=(0,h.withRouter)((0,f.connect)(l)(E))},function(e,t){e.exports=ReactRouter},function(e,t,n){
"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function s(e){if(Array.isArray(e)){
for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function p(e){return{securityId:e.config.SecurityID,
queuedFiles:e.assetAdmin.queuedFiles}}function d(e){return{actions:{gallery:(0,E.bindActionCreators)(T,e),breadcrumbsActions:(0,E.bindActionCreators)(O,e),queuedFiles:(0,E.bindActionCreators)(D,e)}}}Object.defineProperty(t,"__esModule",{
value:!0}),t.AssetAdmin=void 0
var c=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&s.return&&s.return()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},h=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),m=i(["\n  query ReadFiles($limit:Int!, $offset:Int!, $rootFilter: FileFilterInput, \n    $childrenFilter: FileFilterInput, $sortBy:[ChildrenSortInputType]\n  ) {\n    readFiles(filter: $rootFilter) {\n      pageInfo {\n        totalCount\n      }\n      edges {\n        node {\n          ...FileInterfaceFields\n          ...FileFields\n          ...on Folder {\n            children(limit:$limit, offset:$offset, filter: $childrenFilter, sortBy:$sortBy) {\n              pageInfo {\n                totalCount\n              }\n              edges {\n                node {\n                  ...FileInterfaceFields\n                  ...FileFields\n                  ...FolderFields\n                }\n              }\n            }\n            parents {\n              id\n              title\n            }\n          }\n        }\n      }\n    }\n  }\n  ","\n  ","\n  ","\n"],["\n  query ReadFiles($limit:Int!, $offset:Int!, $rootFilter: FileFilterInput, \n    $childrenFilter: FileFilterInput, $sortBy:[ChildrenSortInputType]\n  ) {\n    readFiles(filter: $rootFilter) {\n      pageInfo {\n        totalCount\n      }\n      edges {\n        node {\n          ...FileInterfaceFields\n          ...FileFields\n          ...on Folder {\n            children(limit:$limit, offset:$offset, filter: $childrenFilter, sortBy:$sortBy) {\n              pageInfo {\n                totalCount\n              }\n              edges {\n                node {\n                  ...FileInterfaceFields\n                  ...FileFields\n                  ...FolderFields\n                }\n              }\n            }\n            parents {\n              id\n              title\n            }\n          }\n        }\n      }\n    }\n  }\n  ","\n  ","\n  ","\n"]),g=i(["mutation UpdateFile($id:ID!, $file:FileInput!) {\n  updateFile(id: $id, file: $file) {\n   id\n  }\n}"],["mutation UpdateFile($id:ID!, $file:FileInput!) {\n  updateFile(id: $id, file: $file) {\n   id\n  }\n}"]),y=i(["mutation DeleteFile($id:ID!) {\n  deleteFile(id: $id)\n}"],["mutation DeleteFile($id:ID!) {\n  deleteFile(id: $id)\n}"]),v=n(4),b=o(v),C=n(6),E=n(5),S=n(10),_=o(S),w=n(11),F=o(w),P=n(3),x=o(P),I=n(12),T=r(I),A=n(14),O=r(A),k=n(15),D=r(k),N=n(17),R=o(N),U=n(21),L=o(U),M=n(282),j=o(M),q=n(283),B=o(q),H=n(280),z=n(281),G=o(z),V=n(284),Q=n(288),W=o(Q),$=function(e){
function t(e){a(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleOpenFile=n.handleOpenFile.bind(n),n.handleCloseFile=n.handleCloseFile.bind(n),n.handleDelete=n.handleDelete.bind(n),n.handleDoSearch=n.handleDoSearch.bind(n),n.handleSubmitEditor=n.handleSubmitEditor.bind(n),
n.handleOpenFolder=n.handleOpenFolder.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.createEndpoint=n.createEndpoint.bind(n),n.handleBackButtonClick=n.handleBackButtonClick.bind(n),
n.handleFolderIcon=n.handleFolderIcon.bind(n),n.handleBrowse=n.handleBrowse.bind(n),n.handleViewChange=n.handleViewChange.bind(n),n.handleUpload=n.handleUpload.bind(n),n.handleCreateFolderSuccess=n.handleCreateFolderSuccess.bind(n),
n.compare=n.compare.bind(n),n}return u(t,e),h(t,[{key:"componentWillMount",value:function e(){var t=this.props.sectionConfig
this.endpoints={updateFolderApi:this.createEndpoint(t.updateFolderEndpoint),historyApi:this.createEndpoint(t.historyEndpoint)}}},{key:"componentWillReceiveProps",value:function e(t){var n=this.compare(this.props.folder,t.folder)

;(n||(0,Q.hasFilters)(t.query.filter)!==(0,Q.hasFilters)(this.props.query.filter))&&this.setBreadcrumbs(t)}},{key:"handleBrowse",value:function e(t,n,r){"function"==typeof this.props.onBrowse&&this.props.onBrowse(t,n,r),
t!==this.props.folderId&&this.props.actions.gallery.deselectFiles()}},{key:"handleSetPage",value:function e(t){this.handleBrowse(this.props.folderId,this.props.fileId,f({},this.props.query,{page:t}))}},{
key:"handleDoSearch",value:function e(t){this.handleBrowse(t.currentFolderOnly?this.props.folderId:0,0,f({},this.getBlankQuery(),{filter:t}))}},{key:"getBlankQuery",value:function e(){var t={}
return Object.keys(this.props.query).forEach(function(e){t[e]=void 0}),t}},{key:"handleSort",value:function e(t){this.handleBrowse(this.props.folderId,this.props.fileId,f({},this.props.query,{sort:t,limit:void 0,
page:void 0}))}},{key:"handleViewChange",value:function e(t){this.handleBrowse(this.props.folderId,this.props.fileId,f({},this.props.query,{view:t}))}},{key:"createEndpoint",value:function e(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]


return F.default.createEndpointFetcher(f({},t,n?{defaultData:{SecurityID:this.props.securityId}}:{}))}},{key:"handleBackButtonClick",value:function e(t){t.preventDefault(),this.props.folder?this.handleOpenFolder(this.props.folder.parentId||0):this.handleOpenFolder(0)

}},{key:"setBreadcrumbs",value:function e(t){var n=this,r=t.folder,o=t.query,i=[{text:x.default._t("AssetAdmin.FILES","Files"),href:this.props.getUrl&&this.props.getUrl(),onClick:function e(t){t.preventDefault(),
n.handleBrowse()}}]
r&&r.id&&(r.parents&&r.parents.forEach(function(e){i.push({text:e.title,href:n.props.getUrl&&n.props.getUrl(e.id),onClick:function t(r){r.preventDefault(),n.handleBrowse(e.id)}})}),i.push({text:r.title,
href:this.props.getUrl&&this.props.getUrl(r.id),onClick:function e(t){t.preventDefault(),n.handleBrowse(r.id)},icon:{className:"icon font-icon-edit-list",action:this.handleFolderIcon}})),(0,Q.hasFilters)(o.filter)&&i.push({
text:x.default._t("LeftAndMain.SEARCHRESULTS","Search results")}),this.props.actions.breadcrumbsActions.setBreadcrumbs(i)}},{key:"compare",value:function e(t,n){return!!(t&&!n||n&&!t)||t&&n&&(t.id!==n.id||t.name!==n.name)

}},{key:"handleFolderIcon",value:function e(t){t.preventDefault(),this.handleOpenFile(this.props.folderId)}},{key:"handleOpenFile",value:function e(t){this.handleBrowse(this.props.folderId,t,this.props.query)

}},{key:"handleSubmitEditor",value:function e(t,n,r){var o=this,i=null
if("function"==typeof this.props.onSubmitEditor){var s=this.props.files.find(function(e){return e.id===parseInt(o.props.fileId,10)})
i=this.props.onSubmitEditor(t,n,r,s)}else i=r()
if(!i)throw new Error("Promise was not returned for submitting")
return i.then(function(e){return o.props.refetch(),e})}},{key:"handleCloseFile",value:function e(){this.handleOpenFolder(this.props.folderId)}},{key:"handleOpenFolder",value:function e(t){var n=f({},this.props.query)


delete n.page,delete n.filter,this.handleBrowse(t,null,n)}},{key:"handleDelete",value:function e(t){var n=this,r=[].concat(s(this.props.files),s(this.props.queuedFiles.items)),o=r.find(function(e){return e.id===t

})
if(!o&&this.props.folder&&this.props.folder.id===t&&(o=this.props.folder),!o)throw new Error("File selected for deletion cannot be found: "+t)
var i=this.props.client.dataId({__typename:o.__typename,id:o.id})
return this.props.mutate({mutation:"DeleteFile",variables:{id:o.id},resultBehaviors:[{type:"DELETE",dataId:i}]}).then(function(){n.props.actions.gallery.deselectFiles([o.id]),o.queuedId&&n.props.actions.queuedFiles.removeQueuedFile(o.queuedId),
o&&n.handleBrowse(o.parent?o.parent.id:0)})}},{key:"handleUpload",value:function e(){}},{key:"handleCreateFolderSuccess",value:function e(){this.props.refetch()}},{key:"renderGallery",value:function e(){
var t=this.props.sectionConfig,n=t.createFileEndpoint.url,r=t.createFileEndpoint.method,o=this.props.query&&parseInt(this.props.query.limit||t.limit,10),i=this.props.query&&parseInt(this.props.query.page||1,10),s=this.props.query&&this.props.query.sort,a=this.props.query&&this.props.query.view,l=this.props.query&&this.props.query.filter||{}


return b.default.createElement(L.default,{files:this.props.files,fileId:this.props.fileId,folderId:this.props.folderId,folder:this.props.folder,type:this.props.type,limit:o,page:i,totalCount:this.props.filesTotalCount,
view:a,filters:l,createFileApiUrl:n,createFileApiMethod:r,updateFolderApi:this.endpoints.updateFolderApi,onDelete:this.handleDelete,onOpenFile:this.handleOpenFile,onOpenFolder:this.handleOpenFolder,onSuccessfulUpload:this.handleUpload,
onCreateFolderSuccess:this.handleCreateFolderSuccess,onSort:this.handleSort,onSetPage:this.handleSetPage,onViewChange:this.handleViewChange,sort:s,sectionConfig:t,loading:this.props.loading})}},{key:"renderEditor",
value:function e(){var t=this.props.sectionConfig,n=null
switch(this.props.type){case"insert":n=t.form.fileInsertForm.schemaUrl
break
case"select":n=t.form.fileSelectForm.schemaUrl
break
case"admin":default:n=t.form.fileEditForm.schemaUrl}return this.props.fileId?b.default.createElement(R.default,{className:"insert"===this.props.type?"editor--dialog":"",fileId:this.props.fileId,onClose:this.handleCloseFile,
editFileSchemaUrl:n,onSubmit:this.handleSubmitEditor,onDelete:this.handleDelete,addToCampaignSchemaUrl:t.form.addToCampaignForm.schemaUrl}):null}},{key:"render",value:function e(){var t=!!(this.props.folder&&this.props.folder.id||(0,
Q.hasFilters)(this.props.query.filter)),n=this.props.sectionConfig.form.fileSearchForm.schemaUrl,r=this.props.query.filter||{}
return b.default.createElement("div",{className:"fill-height"},b.default.createElement(B.default,{showBackButton:t,handleBackButtonClick:this.handleBackButtonClick},b.default.createElement(j.default,{multiline:!0
}),b.default.createElement("div",{className:"asset-admin__toolbar-extra pull-xs-right fill-width"},b.default.createElement(W.default,{onSearch:this.handleDoSearch,id:"AssetSearchForm",searchFormSchemaUrl:n,
folderId:this.props.folderId,filters:r}),this.props.toolbarChildren)),b.default.createElement("div",{className:"flexbox-area-grow fill-width fill-height gallery"},this.renderGallery(),this.renderEditor()),"admin"!==this.props.type&&this.props.loading&&[b.default.createElement("div",{
key:"overlay",className:"cms-content-loading-overlay ui-widget-overlay-light"}),b.default.createElement("div",{key:"spinner",className:"cms-content-loading-spinner"})])}}]),t}(_.default)
$.propTypes={mutate:b.default.PropTypes.func.isRequired,dialog:v.PropTypes.bool,sectionConfig:v.PropTypes.shape({url:v.PropTypes.string,limit:v.PropTypes.number,form:v.PropTypes.object}),fileId:v.PropTypes.number,
folderId:v.PropTypes.number,onBrowse:v.PropTypes.func,getUrl:v.PropTypes.func,query:v.PropTypes.shape({sort:v.PropTypes.string,limit:v.PropTypes.oneOfType([v.PropTypes.number,v.PropTypes.string]),page:v.PropTypes.oneOfType([v.PropTypes.number,v.PropTypes.string]),
filter:v.PropTypes.object}),onSubmitEditor:v.PropTypes.func,type:v.PropTypes.oneOf(["insert","select","admin"]),files:v.PropTypes.array,queuedFiles:v.PropTypes.shape({items:v.PropTypes.array.isRequired
}),filesTotalCount:v.PropTypes.number,folder:v.PropTypes.shape({id:v.PropTypes.number,title:v.PropTypes.string,parents:v.PropTypes.array,parentId:v.PropTypes.number,canView:v.PropTypes.bool,canEdit:v.PropTypes.bool
}),loading:v.PropTypes.bool},$.defaultProps={type:"admin",query:{sort:"",limit:null,page:0,filter:{}}}
var K=(0,G.default)(m,L.default.fragments.fileInterface,L.default.fragments.file,L.default.fragments.folder),Y={options:function e(t){var n=t.sectionConfig,r=t.folderId,o=t.query,i=o.sort?o.sort.split(","):["",""],s=c(i,2),a=s[0],l=s[1],u=o.filter||{},p=o.limit||n.limit


return{variables:{rootFilter:{id:r},childrenFilter:f(u,{parentId:void 0,recursive:(0,Q.hasFilters)(u),currentFolderOnly:void 0}),limit:p,offset:((o.page||1)-1)*p,sortBy:a&&l?[{field:a,direction:l.toUpperCase()
}]:void 0}}},props:function e(t){var n=t.data,r=n.networkStatus,o=n.refetch,i=n.readFiles,s=i&&i.edges[0]?i.edges[0].node:null,a=s&&s.children?s.children.edges.map(function(e){return e.node}).filter(function(e){
return e}):[],l=s&&s.children?s.children.pageInfo.totalCount:0,u=r!==V.NetworkStatus.ready&&r!==V.NetworkStatus.error
return{loading:u,refetch:o,folder:s,files:a,filesTotalCount:l}}},X=(0,G.default)(g),Z=(0,G.default)(y)
t.AssetAdmin=$,t.default=(0,E.compose)((0,C.connect)(p,d),(0,H.graphql)(K,Y),(0,H.graphql)(X),(0,H.graphql)(Z),function(e){return(0,H.withApollo)(e)})($)},function(e,t){e.exports=SilverStripeComponent},function(e,t){
e.exports=Backend},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return function(n){n({type:p.default.LOAD_FILE_SUCCESS,payload:{id:e,file:t}})}}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null


return function(t){return t({type:p.default.SELECT_FILES,payload:{ids:e}})}}function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null
return function(t){return t({type:p.default.DESELECT_FILES,payload:{ids:e}})}}function a(e){return function(t){return t({type:p.default.SET_NOTICE_MESSAGE,payload:{message:e}})}}function l(e){return function(t){
return t({type:p.default.SET_ERROR_MESSAGE,payload:{message:e}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.loadFile=o,t.selectFiles=i,t.deselectFiles=s,t.setNoticeMessage=a,t.setErrorMessage=l


var u=n(13),p=r(u)},function(e,t){"use strict"
function n(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0})
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}
t.default=["DESELECT_FILES","SELECT_FILES","LOAD_FILE_REQUEST","LOAD_FILE_SUCCESS","HIGHLIGHT_FILES","UPDATE_BATCH_ACTIONS","SET_NOTICE_MESSAGE","SET_ERROR_MESSAGE"].reduce(function(e,t){return r(e,n({},t,"GALLERY."+t))

},{})},function(e,t){e.exports=BreadcrumbsActions},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e){return function(t){return t({type:d.default.ADD_QUEUED_FILE,payload:{file:e}})}}function i(e,t){return function(n){var r=t.message
return"string"==typeof t&&(r={value:t,type:"error"}),n({type:d.default.FAIL_UPLOAD,payload:{queuedId:e,message:r}})}}function s(){return function(e){return e({type:d.default.PURGE_UPLOAD_QUEUE,payload:null
})}}function a(e){return function(t){return t({type:d.default.REMOVE_QUEUED_FILE,payload:{queuedId:e}})}}function l(e,t){return function(n){return n({type:d.default.SUCCEED_UPLOAD,payload:{queuedId:e,json:t
}})}}function u(e,t){return function(n){return n({type:d.default.UPDATE_QUEUED_FILE,payload:{queuedId:e,updates:t}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addQueuedFile=o,t.failUpload=i,t.purgeUploadQueue=s,
t.removeQueuedFile=a,t.succeedUpload=l,t.updateQueuedFile=u
var p=n(16),d=r(p)},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.default={ADD_QUEUED_FILE:"ADD_QUEUED_FILE",FAIL_UPLOAD:"FAIL_UPLOAD",PURGE_UPLOAD_QUEUE:"PURGE_UPLOAD_QUEUE",REMOVE_QUEUED_FILE:"REMOVE_QUEUED_FILE",SUCCEED_UPLOAD:"SUCCEED_UPLOAD",
UPDATE_QUEUED_FILE:"UPDATE_QUEUED_FILE"}},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(3),u=r(l),p=n(4),d=r(p),c=n(18),f=r(c),h=n(19),m=r(h),g=n(20),y=r(g),v=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleCancelKeyDown=n.handleCancelKeyDown.bind(n),n.handleClose=n.handleClose.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n.handleAction=n.handleAction.bind(n),n.closeModal=n.closeModal.bind(n),
n.openModal=n.openModal.bind(n),n.state={openModal:!1},n}return s(t,e),a(t,[{key:"handleAction",value:function e(t,n){var r=t.currentTarget.name
return"action_addtocampaign"===r?(this.openModal(),void t.preventDefault()):"action_delete"===r?(confirm(u.default._t("AssetAdmin.CONFIRMDELETE"))&&this.props.onDelete(n.ID),void t.preventDefault()):void 0

}},{key:"handleCancelKeyDown",value:function e(t){t.keyCode!==f.default.SPACE_KEY_CODE&&t.keyCode!==f.default.RETURN_KEY_CODE||this.handleClose(t)}},{key:"handleSubmit",value:function e(t,n,r){return"function"==typeof this.props.onSubmit?this.props.onSubmit(t,n,r):r()

}},{key:"handleClose",value:function e(t){this.props.onClose(),this.closeModal(),t&&t.preventDefault()}},{key:"openModal",value:function e(){this.setState({openModal:!0})}},{key:"closeModal",value:function e(){
this.setState({openModal:!1})}},{key:"renderCancelButton",value:function e(){return d.default.createElement("a",{tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",
onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u.default._t("AssetAdmin.CANCEL")})}},{key:"renderCancelButton",value:function e(){return d.default.createElement("a",{
tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u.default._t("AssetAdmin.CANCEL")
})}},{key:"renderCancelButton",value:function e(){return d.default.createElement("a",{tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,
type:"button","aria-label":u.default._t("AssetAdmin.CANCEL")})}},{key:"render",value:function e(){var t=this.props.editFileSchemaUrl+"/"+this.props.fileId,n=this.props.addToCampaignSchemaUrl+"/"+this.props.fileId,r=["panel","panel--padded","panel--scrollable","form--no-dividers","editor"]


return this.props.className&&r.push(this.props.className),d.default.createElement("div",{className:r.join(" ")},d.default.createElement("div",{className:"editor__details"},d.default.createElement(m.default,{
schemaUrl:t,afterMessages:this.renderCancelButton(),handleSubmit:this.handleSubmit,handleAction:this.handleAction}),d.default.createElement(y.default,{show:this.state.openModal,handleHide:this.closeModal,
schemaUrl:n,bodyClassName:"modal__dialog",responseClassBad:"modal__response modal__response--error",responseClassGood:"modal__response modal__response--good"})))}}]),t}(p.Component)
v.propTypes={dialog:d.default.PropTypes.bool,className:d.default.PropTypes.string,fileId:d.default.PropTypes.number.isRequired,onClose:d.default.PropTypes.func.isRequired,onSubmit:d.default.PropTypes.func.isRequired,
onDelete:d.default.PropTypes.func.isRequired,editFileSchemaUrl:d.default.PropTypes.string.isRequired,addToCampaignSchemaUrl:d.default.PropTypes.string,openAddCampaignModal:d.default.PropTypes.bool},t.default=v

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(3),i=r(o)
t.default={CSS_TRANSITION_TIME:300,SMALL_THUMBNAIL_HEIGHT:60,SMALL_THUMBNAIL_WIDTH:60,THUMBNAIL_HEIGHT:150,THUMBNAIL_WIDTH:200,BULK_ACTIONS:[{value:"delete",label:i.default._t("AssetAdmin.BULK_ACTIONS_DELETE","Delete"),
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
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function s(e){if(Array.isArray(e)){
for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function p(e){var t=e.assetAdmin.gallery,n=t.selectedFiles,r=t.errorMessage,o=t.noticeMessage


return{selectedFiles:n,errorMessage:r,noticeMessage:o,queuedFiles:e.assetAdmin.queuedFiles,securityId:e.config.SecurityID}}function d(e){return{actions:{gallery:(0,O.bindActionCreators)(V,e),queuedFiles:(0,
O.bindActionCreators)(W,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.galleryViewDefaultProps=t.galleryViewPropTypes=t.sorters=t.Gallery=void 0
var c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},f=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),h=i(["\n   fragment FileInterfaceFields on FileInterface {\n    canDelete\n    canEdit\n    canView\n    category\n    exists\n    filename\n    id\n    lastEdited\n    name\n    parentId\n    title\n    type\n    url\n   }\n    "],["\n   fragment FileInterfaceFields on FileInterface {\n    canDelete\n    canEdit\n    canView\n    category\n    exists\n    filename\n    id\n    lastEdited\n    name\n    parentId\n    title\n    type\n    url\n   }\n    "]),m=i(["\n   fragment FileFields on File {\n    draft\n    extension\n    height\n    published\n    size\n    smallThumbnail\n    thumbnail\n    width\n    inUseCount\n   }\n    "],["\n   fragment FileFields on File {\n    draft\n    extension\n    height\n    published\n    size\n    smallThumbnail\n    thumbnail\n    width\n    inUseCount\n   }\n    "]),g=i(["\n   fragment FolderFields on Folder {\n    filesInUseCount\n   }\n    "],["\n   fragment FolderFields on Folder {\n    filesInUseCount\n   }\n    "]),y=i(["\n  mutation CreateFolder($folder:FolderInput!) {\n    createFolder(folder: $folder) {\n   ...FileInterfaceFields\n   ...FileFields\n  }\n}\n","\n","\n"],["\n  mutation CreateFolder($folder:FolderInput!) {\n    createFolder(folder: $folder) {\n   ...FileInterfaceFields\n   ...FileFields\n  }\n}\n","\n","\n"]),v=n(22),b=o(v),C=n(3),E=o(C),S=n(4),_=o(S),w=n(23),F=o(w),P=n(24),x=o(P),I=n(25),T=o(I),A=n(6),O=n(5),k=n(26),D=o(k),N=n(30),R=o(N),U=n(31),L=o(U),M=n(278),j=o(M),q=n(18),B=o(q),H=n(279),z=o(H),G=n(12),V=r(G),Q=n(15),W=r(Q),$=n(280),K=n(281),Y=o(K),X=[{
field:"title",direction:"asc",label:E.default._t("AssetAdmin.FILTER_TITLE_ASC","title a-z")},{field:"title",direction:"desc",label:E.default._t("AssetAdmin.FILTER_TITLE_DESC","title z-a")},{field:"lastEdited",
direction:"desc",label:E.default._t("AssetAdmin.FILTER_DATE_DESC","newest")},{field:"lastEdited",direction:"asc",label:E.default._t("AssetAdmin.FILTER_DATE_ASC","oldest")}],Z=function(e){function t(e){
a(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleOpenFolder=n.handleOpenFolder.bind(n),n.handleOpenFile=n.handleOpenFile.bind(n),n.handleSelect=n.handleSelect.bind(n),n.handleSelectSort=n.handleSelectSort.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),
n.handleCancelUpload=n.handleCancelUpload.bind(n),n.handleRemoveErroredUpload=n.handleRemoveErroredUpload.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleSending=n.handleSending.bind(n),
n.handleBackClick=n.handleBackClick.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),
n.handleCreateFolder=n.handleCreateFolder.bind(n),n.handleViewChange=n.handleViewChange.bind(n),n.handleClearSearch=n.handleClearSearch.bind(n),n}return u(t,e),f(t,[{key:"componentDidMount",value:function e(){
this.initSortDropdown()}},{key:"componentWillReceiveProps",value:function e(t){if("tile"!==t.view){var n=this.getSortElement()
n.off("change")}this.compareFiles(this.props.files,t.files)||t.actions.queuedFiles.purgeUploadQueue(),this.checkLoadingIndicator(t)}},{key:"componentDidUpdate",value:function e(){this.initSortDropdown()

}},{key:"getSortElement",value:function e(){return(0,b.default)(F.default.findDOMNode(this)).find(".gallery__sort .dropdown")}},{key:"getSearchMessage",value:function e(t){var n=[]
t.name&&n.push(E.default._t("LeftAndMain.SEARCHRESULTSMESSAGEKEYWORDS","with keywords '{name}'")),t.createdFrom&&t.createdTo?n.push(E.default._t("LeftAndMain.SEARCHRESULTSMESSAGEEDITEDBETWEEN","created between '{createdFrom}' and '{createdTo}'")):t.createdFrom?n.push(E.default._t("LeftAndMain.SEARCHRESULTSMESSAGEEDITEDFROM","created after '{createdFrom}'")):t.createdTo&&n.push(E.default._t("LeftAndMain.SEARCHRESULTSMESSAGEEDITEDTO","created before '{createdTo}'")),
t.appCategory&&n.push(E.default._t("LeftAndMain.SEARCHRESULTSMESSAGECATEGORY","categorised as '{appCategory}'")),t.currentFolderOnly&&n.push(E.default._t("LeftAndMain.SEARCHRESULTSMESSAGELIMIT","limited to the folder '{folder}'"))


var r=[n.slice(0,-1).join(E.default._t("LeftAndMain.JOIN",",")+" "),n.slice(-1)].filter(function(e){return e}).join(" "+E.default._t("LeftAndMain.JOINLAST","and")+" ")
if(""===r)return""
var o={parts:E.default.inject(r,c({folder:this.props.folder.title},t,{appCategory:t.appCategory?t.appCategory.toLowerCase():void 0}))}
return E.default.inject(E.default._t("LeftAndMain.SEARCHRESULTSMESSAGE","Search results {parts}"),o)}},{key:"checkLoadingIndicator",value:function e(t){var n=(0,b.default)(".cms-content.AssetAdmin")
n.length&&(t.loading?n.addClass("loading"):n.removeClass("loading"))}},{key:"compareFiles",value:function e(t,n){if(t&&!n||!t&&n)return!1
if(t.length!==n.length)return!1
for(var r=0;r<t.length;r++)if(t[r].id!==n[r].id)return!1
return!0}},{key:"initSortDropdown",value:function e(){var t=this
"tile"===this.props.view&&!function(){var e=t.getSortElement()
e.chosen({allow_single_deselect:!0,disable_search_threshold:20}),e.on("change",function(){return x.default.Simulate.click(e.find(":selected")[0])})}()}},{key:"handleSort",value:function e(t){this.props.actions.queuedFiles.purgeUploadQueue(),
this.props.onSort(t)}},{key:"handleSelectSort",value:function e(t){this.handleSort(t.currentTarget.value)}},{key:"handleSetPage",value:function e(t){this.props.onSetPage(t)}},{key:"handleCancelUpload",
value:function e(t){t.xhr.abort(),this.props.actions.queuedFiles.removeQueuedFile(t.queuedId)}},{key:"handleRemoveErroredUpload",value:function e(t){this.props.actions.queuedFiles.removeQueuedFile(t.queuedId)

}},{key:"handleAddedFile",value:function e(t){this.props.actions.queuedFiles.addQueuedFile(t)}},{key:"handleSending",value:function e(t,n){this.props.actions.queuedFiles.updateQueuedFile(t._queuedId,{xhr:n
})}},{key:"handleUploadProgress",value:function e(t,n){this.props.actions.queuedFiles.updateQueuedFile(t._queuedId,{progress:n})}},{key:"handleCreateFolder",value:function e(t){var n=this,r=this.promptFolderName(),o=parseInt(this.props.folder.id,10)


r&&this.props.mutate({mutation:"CreateFolder",variables:{folder:{parentId:o,name:r}}}).then(function(e){n.props.onCreateFolderSuccess&&n.props.onCreateFolderSuccess(e)}),t.preventDefault()}},{key:"handleSuccessfulUpload",
value:function e(t){var n=JSON.parse(t.xhr.response)
if("undefined"!=typeof n[0].error)return void this.handleFailedUpload(t)
if(this.props.actions.queuedFiles.succeedUpload(t._queuedId,n[0]),this.props.onSuccessfulUpload&&this.props.onSuccessfulUpload(n),"admin"!==this.props.type&&!this.props.fileId&&0===this.props.queuedFiles.items.length){
var r=n.pop()
this.props.onOpenFile(r.id)}}},{key:"handleFailedUpload",value:function e(t,n){this.props.actions.queuedFiles.failUpload(t._queuedId,n)}},{key:"promptFolderName",value:function e(){return prompt(E.default._t("AssetAdmin.PROMPTFOLDERNAME"))

}},{key:"itemIsSelected",value:function e(t){return this.props.selectedFiles.indexOf(t)>-1}},{key:"itemIsHighlighted",value:function e(t){return this.props.fileId===t}},{key:"handleClearSearch",value:function e(t){
this.handleOpenFolder(t,this.props.folder)}},{key:"handleOpenFolder",value:function e(t,n){t.preventDefault(),this.props.actions.gallery.setErrorMessage(null),this.props.actions.gallery.setNoticeMessage(null),
this.props.onOpenFolder(n.id)}},{key:"handleOpenFile",value:function e(t,n){t.preventDefault(),null!==n.created&&this.props.onOpenFile(n.id,n)}},{key:"handleSelect",value:function e(t,n){this.props.selectedFiles.indexOf(n.id)===-1?this.props.actions.gallery.selectFiles([n.id]):this.props.actions.gallery.deselectFiles([n.id])

}},{key:"handleBackClick",value:function e(t){t.preventDefault(),this.props.onOpenFolder(this.props.folder.parentId)}},{key:"handleViewChange",value:function e(t){var n=t.currentTarget.value
this.props.onViewChange(n)}},{key:"renderSort",value:function e(){var t=this
return"tile"!==this.props.view?null:_.default.createElement("div",{className:"gallery__sort fieldholder-small"},_.default.createElement("select",{className:"dropdown no-change-track no-chzn",tabIndex:"0",
style:{width:"160px"},defaultValue:this.props.sort},X.map(function(e,n){return _.default.createElement("option",{key:n,onClick:t.handleSelectSort,"data-field":e.field,"data-direction":e.direction,value:e.field+","+e.direction
},e.label)})))}},{key:"renderToolbar",value:function e(){var t=this.props.folder.canEdit
return _.default.createElement("div",{className:"toolbar--content toolbar--space-save"},_.default.createElement("div",{className:"fill-width"},_.default.createElement("div",{className:"flexbox-area-grow"
},this.renderBackButton(),_.default.createElement("button",{id:"upload-button",className:"btn btn-secondary font-icon-upload btn--icon-xl",type:"button",disabled:!t},_.default.createElement("span",{className:"btn__text"
},E.default._t("AssetAdmin.DROPZONE_UPLOAD"))),_.default.createElement("button",{id:"add-folder-button",className:"btn btn-secondary font-icon-folder-add btn--icon-xl",type:"button",onClick:this.handleCreateFolder,
disabled:!t},_.default.createElement("span",{className:"btn__text"},E.default._t("AssetAdmin.ADD_FOLDER_BUTTON")))),_.default.createElement("div",{className:"gallery__state-buttons"},this.renderSort(),_.default.createElement("div",{
className:"btn-group",role:"group","aria-label":"View mode"},this.renderViewChangeButtons()))))}},{key:"renderSearchAlert",value:function e(){var t=this.props.filters
if(!t||0===Object.keys(t).length)return null
var n=this.getSearchMessage(t)
if(""===n)return null
var r=_.default.createElement("div",null,_.default.createElement("button",{onClick:this.handleClearSearch,className:"btn btn-info font-icon-cancel form-alert__btn--right"},E.default._t("LeftAndMain.SEARCHCLEARRESULTS","Clear results")),n)


return _.default.createElement(z.default,{value:{react:r},type:"warning"})}},{key:"renderViewChangeButtons",value:function e(){var t=this,n=["tile","table"]
return n.map(function(e,n){var r="table"===e?"list":"thumbnails",o=["gallery__view-change-button","btn btn-secondary","btn--icon-sm","btn--no-text"]
return e===t.props.view?null:(o.push("font-icon-"+r),_.default.createElement("button",{id:"button-view-"+e,key:n,className:o.join(" "),type:"button",title:"Change view gallery/list",onClick:t.handleViewChange,
value:e}))})}},{key:"renderBackButton",value:function e(){var t=["btn","btn-secondary","btn--no-text","font-icon-level-up","btn--icon-large","gallery__back"].join(" ")
return null!==this.props.folder.parentId?_.default.createElement("button",{className:t,title:"Navigate up a level",onClick:this.handleBackClick,ref:"backButton"}):null}},{key:"renderBulkActions",value:function e(){
var t=this,n=function e(n){Promise.all(n.map(function(e){return t.props.onDelete(e.id).then(function(){return!0}).catch(function(){return!1})})).then(function(e){var n=e.filter(function(e){return e}).length


n!==e.length?(t.props.actions.gallery.setErrorMessage(E.default.sprintf(E.default._t("AssetAdmin.BULK_ACTIONS_DELETE_FAIL"),n,e.length-n)),t.props.actions.gallery.setNoticeMessage(null)):(t.props.actions.gallery.setNoticeMessage(E.default.sprintf(E.default._t("AssetAdmin.BULK_ACTIONS_DELETE_SUCCESS"),n)),
t.props.actions.gallery.setErrorMessage(null))})},r=function e(n){t.props.onOpenFile(n[0].id)},o=B.default.BULK_ACTIONS.map(function(e){return"delete"!==e.value||e.callback?"edit"!==e.value||e.callback?e:c({},e,{
callback:r}):c({},e,{callback:n})}),i=[].concat(s(this.props.files),s(this.props.queuedFiles.items)),a=this.props.selectedFiles.map(function(e){return i.find(function(t){return t&&e===t.id})})
return a.length>0&&"admin"===this.props.type?_.default.createElement(T.default,{transitionName:"bulk-actions",transitionEnterTimeout:B.default.CSS_TRANSITION_TIME,transitionLeaveTimeout:B.default.CSS_TRANSITION_TIME
},_.default.createElement(R.default,{actions:o,items:a,key:a.length>0})):null}},{key:"renderGalleryView",value:function e(){var t=this,n="table"===this.props.view?j.default:L.default,r=this.props.queuedFiles.items.filter(function(e){
return!e.id||!t.props.files.find(function(t){return t.id===e.id})}).map(function(e){return c({},e,{uploading:!(e.id>0)})}),o=[].concat(s(r),s(this.props.files)).map(function(e){return c({},e||{},{selected:t.itemIsSelected(e.id),
highlighted:t.itemIsHighlighted(e.id)})}),i=this.props,a=i.type,l=i.loading,u=i.page,p=i.totalCount,d=i.limit,f=i.sort,h={selectableItems:"admin"===a,files:o,loading:l,page:u,totalCount:p,limit:d,sort:f,
onSort:this.handleSort,onSetPage:this.handleSetPage,onOpenFile:this.handleOpenFile,onOpenFolder:this.handleOpenFolder,onSelect:this.handleSelect,onCancelUpload:this.handleCancelUpload,onRemoveErroredUpload:this.handleRemoveErroredUpload
}
return _.default.createElement(n,h)}},{key:"render",value:function e(){if(!this.props.folder)return this.props.errorMessage?_.default.createElement("div",{className:"gallery__error"},_.default.createElement("div",{
className:"gallery__error-message"},_.default.createElement("h3",null,E.default._t("AssetAdmin.DROPZONE_RESPONSE_ERROR","Server responded with an error.")),_.default.createElement("p",null,this.props.errorMessage))):null


var t=this.props.errorMessage?_.default.createElement(z.default,{value:this.props.errorMessage,type:"danger"}):null,n=this.props.noticeMessage?_.default.createElement(z.default,{value:this.props.noticeMessage,
type:"success"}):null,r={height:B.default.THUMBNAIL_HEIGHT,width:B.default.THUMBNAIL_WIDTH},o={url:this.props.createFileApiUrl,method:this.props.createFileApiMethod,paramName:"Upload",clickable:"#upload-button"
},i=this.props.securityId,s=this.props.folder.canEdit,a=["panel","panel--padded","panel--scrollable","gallery__main"]
return"insert"===this.props.type&&a.push("insert-media-modal__main"),_.default.createElement("div",{className:"flexbox-area-grow gallery__outer"},this.renderBulkActions(),_.default.createElement(D.default,{
name:"gallery-container",canUpload:s,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,
preview:r,folderId:this.props.folderId,options:o,securityID:i,uploadButton:!1},_.default.createElement("div",{className:a.join(" ")},this.renderToolbar(),t,n,this.renderSearchAlert(),this.renderGalleryView())))

}}]),t}(S.Component),J={page:1,limit:15,sort:X[0].field+","+X[0].direction},ee={loading:S.PropTypes.bool,sort:S.PropTypes.string,files:S.PropTypes.arrayOf(S.PropTypes.shape({id:S.PropTypes.number,parent:S.PropTypes.shape({
id:S.PropTypes.number})})).isRequired,totalCount:S.PropTypes.number,page:S.PropTypes.number,limit:S.PropTypes.number,onOpenFile:S.PropTypes.func.isRequired,onOpenFolder:S.PropTypes.func.isRequired,onSort:S.PropTypes.func.isRequired,
onSetPage:S.PropTypes.func.isRequired},te=c({},J,{selectableItems:!1}),ne=c({},ee,{selectableItems:S.PropTypes.bool,onSelect:S.PropTypes.func,onCancelUpload:S.PropTypes.func,onDelete:_.default.PropTypes.func,
onRemoveErroredUpload:S.PropTypes.func})
Z.defaultProps=c({},J,{type:"admin",view:"tile"}),Z.propTypes=c({},ee,{client:_.default.PropTypes.object,mutate:_.default.PropTypes.func,onUploadSuccess:_.default.PropTypes.func,onCreateFolderSuccess:_.default.PropTypes.func,
onDelete:_.default.PropTypes.func,type:S.PropTypes.oneOf(["insert","select","admin"]),view:S.PropTypes.oneOf(["tile","table"]),dialog:S.PropTypes.bool,fileId:S.PropTypes.number,folderId:S.PropTypes.number.isRequired,
folder:S.PropTypes.shape({id:S.PropTypes.number,title:S.PropTypes.string,parentId:S.PropTypes.number,canView:S.PropTypes.bool,canEdit:S.PropTypes.bool}),queuedFiles:S.PropTypes.shape({items:S.PropTypes.array.isRequired
}),selectedFiles:S.PropTypes.arrayOf(S.PropTypes.number),errorMessage:S.PropTypes.string,actions:S.PropTypes.object,securityId:S.PropTypes.string,onViewChange:S.PropTypes.func.isRequired,createFileApiUrl:S.PropTypes.string,
createFileApiMethod:S.PropTypes.string,search:S.PropTypes.object}),Z.fragments={fileInterface:(0,Y.default)(h),file:(0,Y.default)(m),folder:(0,Y.default)(g)}
var re=(0,Y.default)(y,Z.fragments.fileInterface,Z.fragments.file)
t.Gallery=Z,t.sorters=X,t.galleryViewPropTypes=ne,t.galleryViewDefaultProps=te,t.default=(0,O.compose)((0,$.graphql)(re),function(e){return(0,$.withApollo)(e)},(0,A.connect)(p,d))(Z)},function(e,t){e.exports=jQuery

},function(e,t){e.exports=ReactDom},function(e,t){e.exports=ReactAddonsTestUtils},function(e,t){e.exports=ReactAddonsCssTransitionGroup},function(e,t,n){"use strict"
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
if(void 0!==s)return s.call(r)},p=n(4),d=r(p),c=n(23),f=r(c),h=n(10),m=r(h),g=n(3),y=r(g),v=n(27),b=r(v),C=n(22),E=r(C),S=n(29),_=0,w=function(e){function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.dropzone=null,n.dragging=!1,n.handleAddedFile=n.handleAddedFile.bind(n),n.handleDragEnter=n.handleDragEnter.bind(n),n.handleDragLeave=n.handleDragLeave.bind(n),n.handleDrop=n.handleDrop.bind(n),
n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleError=n.handleError.bind(n),n.handleSending=n.handleSending.bind(n),n.handleSuccess=n.handleSuccess.bind(n),n.loadImage=n.loadImage.bind(n),
n}return s(t,e),l(t,[{key:"componentDidMount",value:function e(){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this)
var n=this.getDefaultOptions(),r=this.props.uploadSelector
if(!r&&this.props.uploadButton&&(r=".asset-dropzone__upload-button"),r){var o=(0,E.default)(f.default.findDOMNode(this)).find(r)
o&&o.length&&(n.clickable=o.toArray())}this.dropzone=new b.default(f.default.findDOMNode(this),a({},n,this.props.options))
var i=this.props.name
i&&this.dropzone.hiddenFileInput.classList.add("dz-input-"+i),"undefined"!=typeof this.props.promptOnRemove&&this.setPromptOnRemove(this.props.promptOnRemove)}},{key:"componentWillUnmount",value:function e(){
u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentWillUnmount",this).call(this),this.dropzone.disable()}},{key:"render",value:function e(){var t=["asset-dropzone"]
this.props.className&&t.push(this.props.className)
var n={className:"asset-dropzone__upload-button ss-ui-button font-icon-upload",type:"button"}
return this.props.canUpload||(n.disabled=!0),this.dragging===!0&&t.push("dragging"),d.default.createElement("div",{className:t.join(" ")},this.props.uploadButton&&d.default.createElement("button",n,y.default._t("AssetAdmin.DROPZONE_UPLOAD")),this.props.children)

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
r.append("SecurityID",this.props.securityID),r.append("ParentID",this.props.folderId)
var i=a({},n,{abort:function e(){o.dropzone.cancelUpload(t),n.abort()}})
"function"==typeof this.props.handleSending&&this.props.handleSending(t,i,r)}},{key:"generateQueuedId",value:function e(){return++_}},{key:"handleAddedFile",value:function e(t){var n=this
if(this.props.options.maxFiles&&this.dropzone.files.length>this.props.options.maxFiles)return this.dropzone.removeFile(this.dropzone.files[0]),"function"==typeof this.props.handleMaxFilesExceeded&&this.props.handleMaxFilesExceeded(t),
Promise.resolve()
if("function"==typeof this.props.canFileUpload&&!this.props.canFileUpload(t))return this.dropzone.removeFile(t),Promise.resolve()
if(!this.props.canUpload)return this.dropzone.removeFile(t),Promise.reject(new Error(y.default._t("AssetAdmin.DROPZONE_CANNOT_UPLOAD")))
t._queuedId=this.generateQueuedId()
var r=new Promise(function(e){var r=new FileReader
r.onload=function(r){if("image"===n.getFileCategory(t.type)){var o=document.createElement("img")
e(n.loadImage(o,r.target.result))}else e({})},r.readAsDataURL(t)})
return r.then(function(e){var r={height:e.height,width:e.width,category:n.getFileCategory(t.type),filename:t.name,queuedId:t._queuedId,size:t.size,title:n.getFileTitle(t.name),extension:(0,S.getFileExtension)(t.name),
type:t.type,url:e.thumbnailURL,thumbnail:e.thumbnailURL,smallThumbail:e.thumbnailURL}
return n.props.handleAddedFile(r),n.dropzone.processFile(t),r})}},{key:"getFileTitle",value:function e(t){return t.replace(/[.][^.]+$/,"").replace(/-_/," ")}},{key:"loadImage",value:function e(t,n){var r=this


return new Promise(function(e){t.onload=function(){var n=document.createElement("canvas"),o=n.getContext("2d"),i=2*r.props.preview.width,s=2*r.props.preview.height,a=t.naturalWidth/t.naturalHeight
t.naturalWidth<i||t.naturalHeight<s?(n.width=t.naturalWidth,n.height=t.naturalHeight):a<1?(n.width=i,n.height=i/a):(n.width=s*a,n.height=s),o.drawImage(t,0,0,n.width,n.height)
var l=n.toDataURL("image/png")
e({width:t.naturalWidth,height:t.naturalHeight,thumbnailURL:l})},t.src=n})}},{key:"handleError",value:function e(t,n){this.dropzone.removeFile(t),"function"==typeof this.props.handleError&&this.props.handleError(t,n)

}},{key:"handleSuccess",value:function e(t){this.dropzone.removeFile(t),this.props.handleSuccess(t)}},{key:"setPromptOnRemove",value:function e(t){this.dropzone.options.dictRemoveFileConfirmation=t}}]),
t}(m.default)
w.propTypes={folderId:d.default.PropTypes.number.isRequired,handleAddedFile:d.default.PropTypes.func.isRequired,handleDragEnter:d.default.PropTypes.func,handleDragLeave:d.default.PropTypes.func,handleDrop:d.default.PropTypes.func,
handleError:d.default.PropTypes.func.isRequired,handleSending:d.default.PropTypes.func,handleSuccess:d.default.PropTypes.func.isRequired,handleMaxFilesExceeded:d.default.PropTypes.func,canFileUpload:d.default.PropTypes.func,
options:d.default.PropTypes.shape({url:d.default.PropTypes.string.isRequired}),promptOnRemove:d.default.PropTypes.string,securityID:d.default.PropTypes.string.isRequired,uploadButton:d.default.PropTypes.bool,
uploadSelector:d.default.PropTypes.string,canUpload:d.default.PropTypes.bool.isRequired,preview:d.default.PropTypes.shape({width:d.default.PropTypes.number,height:d.default.PropTypes.number}),className:d.default.PropTypes.string
},w.defaultProps={uploadButton:!0},t.default=w},function(e,t,n){(function(e,t){(function(){var n,r,o,i,s,a,l,u,p=[].slice,d={}.hasOwnProperty,c=function(e,t){function n(){this.constructor=e}for(var r in t)d.call(t,r)&&(e[r]=t[r])


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
return c(t,e),t.prototype.Emitter=r,t.prototype.events=["drop","dragstart","dragend","dragenter","dragover","dragleave","addedfile","addedfiles","removedfile","thumbnail","error","errormultiple","processing","processingmultiple","uploadprogress","totaluploadprogress","sending","sendingmultiple","success","successmultiple","canceled","canceledmultiple","complete","completemultiple","reset","maxfilesexceeded","maxfilesreached","queuecomplete"],
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

},addedfile:function(e){var n,r,o,i,s,a,l,u,p,d,c,f,h
if(this.element===this.previewsContainer&&this.element.classList.add("dz-started"),this.previewsContainer){for(e.previewElement=t.createElement(this.options.previewTemplate.trim()),e.previewTemplate=e.previewElement,
this.previewsContainer.appendChild(e.previewElement),d=e.previewElement.querySelectorAll("[data-dz-name]"),i=0,l=d.length;i<l;i++)n=d[i],n.textContent=this._renameFilename(e.name)
for(c=e.previewElement.querySelectorAll("[data-dz-size]"),s=0,u=c.length;s<u;s++)n=c[s],n.innerHTML=this.filesize(e.size)
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
return o=document.createElement("img"),r&&(o.crossOrigin=r),o.onload=function(t){return function(){var r,i,s,l,u,p,d,c
if(e.width=o.width,e.height=o.height,s=t.options.resize.call(t,e),null==s.trgWidth&&(s.trgWidth=s.optWidth),null==s.trgHeight&&(s.trgHeight=s.optHeight),r=document.createElement("canvas"),i=r.getContext("2d"),
r.width=s.trgWidth,r.height=s.trgHeight,a(i,o,null!=(u=s.srcX)?u:0,null!=(p=s.srcY)?p:0,s.srcWidth,s.srcHeight,null!=(d=s.trgX)?d:0,null!=(c=s.trgY)?c:0,s.trgWidth,s.trgHeight),l=r.toDataURL("image/png"),
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
var r,i,s,a,l,u,p,d,c,f,h,m,g,y,v,b,C,E,S,_,w,F,P,x,I,T,A,O,k,D,N,R,U,L
for(S=new XMLHttpRequest,_=0,x=e.length;_<x;_++)r=e[_],r.xhr=S
m=o(this.options.method,e),C=o(this.options.url,e),S.open(m,C,!0),S.withCredentials=!!this.options.withCredentials,v=null,s=function(t){return function(){var n,o,i
for(i=[],n=0,o=e.length;n<o;n++)r=e[n],i.push(t._errorProcessing(e,v||t.options.dictResponseError.replace("{{statusCode}}",S.status),S))
return i}}(this),b=function(t){return function(n){var o,i,s,a,l,u,p,d,c
if(null!=n)for(i=100*n.loaded/n.total,s=0,u=e.length;s<u;s++)r=e[s],r.upload={progress:i,total:n.total,bytesSent:n.loaded}
else{for(o=!0,i=100,a=0,p=e.length;a<p;a++)r=e[a],100===r.upload.progress&&r.upload.bytesSent===r.upload.total||(o=!1),r.upload.progress=i,r.upload.bytesSent=r.upload.total
if(o)return}for(c=[],l=0,d=e.length;l<d;l++)r=e[l],c.push(t.emit("uploadprogress",r,i,r.upload.bytesSent))
return c}}(this),S.onload=function(n){return function(r){var o
if(e[0].status!==t.CANCELED&&4===S.readyState){if(v=S.responseText,S.getResponseHeader("content-type")&&~S.getResponseHeader("content-type").indexOf("application/json"))try{v=JSON.parse(v)}catch(e){r=e,
v="Invalid JSON response from server."}return b(),200<=(o=S.status)&&o<300?n._finished(e,v,r):s()}}}(this),S.onerror=function(n){return function(){if(e[0].status!==t.CANCELED)return s()}}(this),y=null!=(k=S.upload)?k:S,
y.onprogress=b,u={Accept:"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"},this.options.headers&&n(u,this.options.headers)
for(a in u)l=u[a],l&&S.setRequestHeader(a,l)
if(i=new FormData,this.options.params){D=this.options.params
for(h in D)E=D[h],i.append(h,E)}for(w=0,I=e.length;w<I;w++)r=e[w],this.emit("sending",r,S,i)
if(this.options.uploadMultiple&&this.emit("sendingmultiple",e,S,i),"FORM"===this.element.tagName)for(N=this.element.querySelectorAll("input, textarea, select, button"),F=0,T=N.length;F<T;F++)if(d=N[F],
c=d.getAttribute("name"),f=d.getAttribute("type"),"SELECT"===d.tagName&&d.hasAttribute("multiple"))for(R=d.options,P=0,A=R.length;P<A;P++)g=R[P],g.selected&&i.append(c,g.value)
else(!f||"checkbox"!==(U=f.toLowerCase())&&"radio"!==U||d.checked)&&i.append(c,d.value)
for(p=O=0,L=e.length-1;0<=L?O<=L:O>=L;p=0<=L?++O:--O)i.append(this._getParamName(p),e[p],this._renameFilename(e[p].name))
return this.submitRequest(S,i,e)},t.prototype.submitRequest=function(e,t,n){return e.send(t)},t.prototype._finished=function(e,n,r){var o,i,s
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
return u=l/s,0===u?1:u},a=function(e,t,n,r,o,i,a,l,u,p){var d
return d=s(t),e.drawImage(t,n,r,o,i,a,l,u,p/d)},i=function(e,t){var n,r,o,i,s,a,l,u,p
if(o=!1,p=!0,r=e.document,u=r.documentElement,n=r.addEventListener?"addEventListener":"attachEvent",l=r.addEventListener?"removeEventListener":"detachEvent",a=r.addEventListener?"":"on",i=function(n){if("readystatechange"!==n.type||"complete"===r.readyState)return("load"===n.type?e:r)[l](a+n.type,i,!1),
!o&&(o=!0)?t.call(e,n.type||n):void 0},s=function(){var e
try{u.doScroll("left")}catch(t){return e=t,void setTimeout(s,50)}return i("poll")},"complete"!==r.readyState){if(r.createEventObject&&u.doScroll){try{p=!e.frameElement}catch(e){}p&&s()}return r[n](a+"DOMContentLoaded",i,!1),
r[n](a+"readystatechange",i,!1),e[n](a+"load",i,!1)}},n._autoDiscoverFunction=function(){if(n.autoDiscover)return n.discover()},i(window,n._autoDiscoverFunction)}).call(this)}).call(t,n(22),n(28)(e))},function(e,t){
e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],e.webpackPolyfill=1),e}},function(e,t){e.exports=DataFormat},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return{gallery:e.assetAdmin.gallery
}}Object.defineProperty(t,"__esModule",{value:!0}),t.BulkActions=void 0
var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(22),p=r(u),d=n(4),c=r(d),f=n(23),h=r(f),m=n(10),g=r(m),y=n(24),v=r(y),b=n(6),C=t.BulkActions=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.onChangeValue=n.onChangeValue.bind(n),n}return s(t,e),l(t,[{key:"componentDidMount",value:function e(){var t=(0,p.default)(h.default.findDOMNode(this)).find(".dropdown")
t.chosen({allow_single_deselect:!0,disable_search_threshold:20}),t.change(function(){return v.default.Simulate.click(t.find(":selected")[0])})}},{key:"render",value:function e(){var t=this,n=this.props.actions.map(function(e,n){
var r=t.props.items.length&&(!e.canApply||e.canApply(t.props.items))
if(!r)return""
var o=["bulk-actions__action","ss-ui-button","ui-corner-all",e.className||"font-icon-info-circled"].join(" ")
return c.default.createElement("button",{type:"button",className:o,key:n,onClick:t.onChangeValue,value:e.value},e.label)})
return c.default.createElement("div",{className:"bulk-actions fieldholder-small"},c.default.createElement("div",{className:"bulk-actions-counter"},this.props.items.length),n)}},{key:"getOptionByValue",
value:function e(t){return this.props.actions.find(function(e){return e.value===t})}},{key:"onChangeValue",value:function e(t){var n=this,r=null,o=this.getOptionByValue(t.target.value)
return null===o?null:(r="function"==typeof o.confirm?o.confirm(this.props.items).then(function(){return o.callback(n.props.items)}).catch(function(e){if("cancelled"!==e)throw e}):o.callback(this.props.items)||Promise.resolve(),
(0,p.default)(h.default.findDOMNode(this)).find(".dropdown").val("").trigger("liszt:updated"),r)}}]),t}(g.default)
C.propTypes={items:c.default.PropTypes.array,actions:c.default.PropTypes.arrayOf(c.default.PropTypes.shape({value:c.default.PropTypes.string.isRequired,label:c.default.PropTypes.string.isRequired,className:c.default.PropTypes.string,
destructive:c.default.PropTypes.bool,callback:c.default.PropTypes.func,canApply:c.default.PropTypes.func,confirm:c.default.PropTypes.func}))},t.default=(0,b.connect)(a)(C)},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(3),p=r(u),d=n(4),c=r(d),f=n(32),h=r(f),m=n(21),g=n(34),y=r(g),v=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.renderItem=n.renderItem.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handlePrevPage=n.handlePrevPage.bind(n),n.handleNextPage=n.handleNextPage.bind(n),n}return s(t,e),l(t,[{key:"handleSetPage",
value:function e(t){this.props.onSetPage(t)}},{key:"handleNextPage",value:function e(){this.handleSetPage(this.props.page+1)}},{key:"handlePrevPage",value:function e(){this.handleSetPage(this.props.page-1)

}},{key:"folderFilter",value:function e(t){return"folder"===t.type}},{key:"fileFilter",value:function e(t){return"folder"!==t.type}},{key:"renderPagination",value:function e(){if(this.props.totalCount<=this.props.limit)return null


var t={setPage:this.handleSetPage,maxPage:Math.ceil(this.props.totalCount/this.props.limit),next:this.handleNextPage,nextText:p.default._t("Pagination.NEXT","Next"),previous:this.handlePrevPage,previousText:p.default._t("Pagination.PREVIOUS","Previous"),
currentPage:this.props.page-1,useGriddleStyles:!1}
return c.default.createElement("div",{className:"griddle-footer"},c.default.createElement(y.default.GridPagination,t))}},{key:"renderItem",value:function e(t,n){var r={key:n,item:t}
return t.uploading?a(r,{onCancelUpload:this.props.onCancelUpload,onRemoveErroredUpload:this.props.onRemoveErroredUpload}):a(r,{onActivate:"folder"===t.type?this.props.onOpenFolder:this.props.onOpenFile
}),this.props.selectableItems&&a(r,{selectable:!0,onSelect:this.props.onSelect}),c.default.createElement(h.default,r)}},{key:"render",value:function e(){return c.default.createElement("div",{className:"gallery__main-view--tile"
},c.default.createElement("div",{className:"gallery__folders"},this.props.files.filter(this.folderFilter).map(this.renderItem)),c.default.createElement("div",{className:"gallery__files"},this.props.files.filter(this.fileFilter).map(this.renderItem)),0===this.props.files.length&&!this.props.loading&&c.default.createElement("p",{
className:"gallery__no-item-notice"},p.default._t("AssetAdmin.NOITEMSFOUND")),c.default.createElement("div",{className:"gallery__load"},this.renderPagination()))}}]),t}(d.Component)
v.defaultProps=m.galleryViewDefaultProps,v.propTypes=m.galleryViewPropTypes,t.default=v},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(3),u=r(l),p=n(4),d=r(p),c=n(18),f=r(c),h=n(10),m=r(h),g=n(33),y=r(g),v=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSelect=n.handleSelect.bind(n),n.handleActivate=n.handleActivate.bind(n),n.handleKeyDown=n.handleKeyDown.bind(n),n.handleCancelUpload=n.handleCancelUpload.bind(n),n.preventFocus=n.preventFocus.bind(n),
n}return s(t,e),a(t,[{key:"handleActivate",value:function e(t){t.stopPropagation(),"function"==typeof this.props.onActivate&&this.props.onActivate(t,this.props.item)}},{key:"handleSelect",value:function e(t){
t.stopPropagation(),t.preventDefault(),"function"==typeof this.props.onSelect&&this.props.onSelect(t,this.props.item)}},{key:"getThumbnailStyles",value:function e(){var t=this.props.item.thumbnail
return this.isImage()&&t&&(this.exists()||this.uploading())?{backgroundImage:"url("+t+")"}:{}}},{key:"hasError",value:function e(){var e=!1
return this.props.item.message&&(e="error"===this.props.item.message.type),e}},{key:"getErrorMessage",value:function e(){var t=null
return this.hasError()?t=this.props.item.message.value:this.exists()||this.uploading()||(t=u.default._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==t?d.default.createElement("span",{className:"gallery-item__error-message"
},t):null}},{key:"getThumbnailClassNames",value:function e(){var t=["gallery-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&t.push("gallery-item__thumbnail--small"),t.join(" ")}},{key:"getItemClassNames",value:function e(){var t=this.props.item.category||"false",n=["gallery-item gallery-item--"+t]


return this.exists()||this.uploading()||n.push("gallery-item--missing"),this.props.selectable&&(n.push("gallery-item--selectable"),this.props.item.selected&&n.push("gallery-item--selected")),this.props.item.highlighted&&n.push("gallery-item--highlighted"),
this.hasError()&&n.push("gallery-item--error"),n.join(" ")}},{key:"getStatusFlags",value:function e(){var t=[]
return"folder"!==this.props.item.type&&(this.props.item.draft?t.push(d.default.createElement("span",{key:"status-draft",title:u.default._t("File.DRAFT","Draft"),className:"gallery-item--draft"})):this.props.item.modified&&t.push(d.default.createElement("span",{
key:"status-modified",title:u.default._t("File.MODIFIED","Modified"),className:"gallery-item--modified"}))),t}},{key:"isImage",value:function e(){return"image"===this.props.item.category}},{key:"exists",
value:function e(){return this.props.item.exists}},{key:"uploading",value:function e(){return this.props.item.uploading}},{key:"complete",value:function e(){return this.uploading()&&this.props.item.id>0

}},{key:"isImageSmallerThanThumbnail",value:function e(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1
var t=this.props.item.width,n=this.props.item.height
return n&&t&&n<f.default.THUMBNAIL_HEIGHT&&t<f.default.THUMBNAIL_WIDTH}},{key:"handleKeyDown",value:function e(t){t.stopPropagation(),f.default.SPACE_KEY_CODE===t.keyCode&&(t.preventDefault(),this.handleSelect(t)),
f.default.RETURN_KEY_CODE===t.keyCode&&this.handleActivate(t)}},{key:"preventFocus",value:function e(t){t.preventDefault()}},{key:"handleCancelUpload",value:function e(t){t.stopPropagation(),this.hasError()?this.props.onRemoveErroredUpload(this.props.item):this.props.onCancelUpload&&this.props.onCancelUpload(this.props.item)

}},{key:"getProgressBar",value:function e(){var t=null,n={className:"gallery-item__progress-bar",style:{width:this.props.item.progress+"%"}}
return this.hasError()||!this.uploading()||this.complete()||(t=d.default.createElement("div",{className:"gallery-item__upload-progress"},d.default.createElement("div",n))),t}},{key:"render",value:function e(){
var t=null,n=null,r=null
return this.props.selectable&&(t=this.handleSelect,n="font-icon-tick"),this.uploading()?(t=this.handleCancelUpload,n="font-icon-cancel"):this.exists()&&(r=d.default.createElement("div",{className:"gallery-item--overlay font-icon-edit"
},"View")),d.default.createElement("div",{className:this.getItemClassNames(),"data-id":this.props.item.id,tabIndex:"0",onKeyDown:this.handleKeyDown,onClick:this.handleActivate},d.default.createElement("div",{
ref:"thumbnail",className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()},r,this.getStatusFlags()),this.getProgressBar(),this.getErrorMessage(),d.default.createElement("div",{className:"gallery-item__title",
ref:"title"},d.default.createElement("label",{className:"gallery-item__checkbox-label "+n,onClick:t},d.default.createElement("input",{className:"gallery-item__checkbox",type:"checkbox",title:u.default._t("AssetAdmin.SELECT"),
tabIndex:"-1",onMouseDown:this.preventFocus})),this.props.item.title))}}]),t}(m.default)
v.propTypes={item:y.default,highlighted:p.PropTypes.bool,selected:p.PropTypes.bool,message:p.PropTypes.shape({value:p.PropTypes.string,type:p.PropTypes.string}),selectable:p.PropTypes.bool,onActivate:p.PropTypes.func,
onSelect:p.PropTypes.func,onCancelUpload:p.PropTypes.func,onRemoveErroredUpload:p.PropTypes.func},t.default=v},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(4),i=r(o),s=i.default.PropTypes.shape({exists:i.default.PropTypes.bool,type:i.default.PropTypes.string,smallThumbnail:i.default.PropTypes.string,thumbnail:i.default.PropTypes.string,width:i.default.PropTypes.number,
height:i.default.PropTypes.number,category:i.default.PropTypes.oneOfType([i.default.PropTypes.bool,i.default.PropTypes.string]).isRequired,id:i.default.PropTypes.number.isRequired,url:i.default.PropTypes.string,
title:i.default.PropTypes.string.isRequired,progress:i.default.PropTypes.number})
t.default=s},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(4),i=n(35),s=n(206),a=n(207),l=n(208),u=n(214),p=n(215),d=n(197),c=n(235),f=n(236),h=n(237),m=n(37),g=n(204),y=n(216),v=n(238),b=n(240),C=n(161),E=n(241),S=n(217),_=n(242),w=n(243),F=n(103),P=n(246),x=n(247),I=n(248),T=n(249),A=n(38),O=n(192),k=n(159),D=n(277),N=n(150),R=n(135),U=o.createClass({
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
if(r.hasOwnProperty(n)&&!t)r=T(r,n)
else{var o={}
o[n]=t,r=O({},r,o)}this.filterByColumnFilters(r)},setFilter:function e(t){if(this.props.useExternal)return void this.props.externalSetFilter(t)
var n=this,r={page:0,filter:t}
r.filteredResults=this.props.useCustomFilterer?this.props.customFilterer(this.props.results,t):this.defaultFilter(this.props.results,t),r.maxPage=n.getMaxPage(r.filteredResults),(I(t)||x(t)||P(t))&&(r.filter=t,
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
n.setState(r)}this.props.enableInfiniteScroll&&this.setState({isSelectAllChecked:!1})},setColumns:function e(t){this.columnSettings.filteredColumns=F(t)?t:[t],this.setState({filteredColumns:this.columnSettings.filteredColumns
})},nextPage:function e(){var t=this.getCurrentPage()
t<this.getCurrentMaxPage()-1&&this.setPage(t+1)},previousPage:function e(){var t=this.getCurrentPage()
t>0&&this.setPage(t-1)},changeSort:function e(t){if(this.props.enableSort!==!1){if(this.props.useExternal){var n=this.props.externalSortColumn!==t||!this.props.externalSortAscending
return this.setState({sortColumn:t,sortDirection:n?"asc":"desc"}),void this.props.externalChangeSort(t,n)}var r=C(this.props.columnMetadata,{columnName:t})||{},o=r.sortDirectionCycle?r.sortDirectionCycle:[null,"asc","desc"],i=null,s=o.indexOf(this.state.sortDirection&&t===this.state.sortColumn?this.state.sortDirection:null)


s=(s+1)%o.length,i=o[s]?o[s]:null
var a={page:0,sortColumn:t,sortDirection:i}
this.setState(a)}},componentWillReceiveProps:function e(t){if(this.setMaxPage(t.results),t.resultsPerPage!==this.props.resultsPerPage&&this.setPageSize(t.resultsPerPage),this.columnSettings.columnMetadata=t.columnMetadata,
t.results.length>0){var n=y.keys(t.results[0]),r=this.columnSettings.allColumns.length==n.length&&this.columnSettings.allColumns.every(function(e,t){return e===n[t]})
r||(this.columnSettings.allColumns=n)}else this.columnSettings.allColumns.length>0&&(this.columnSettings.allColumns=[])
if(t.selectedRowIds){var o=this.getDataForRender(this.getCurrentResults(t.results),this.columnSettings.getColumns(),!0)
this.setState({isSelectAllChecked:this._getAreAllRowsChecked(t.selectedRowIds,A(o,this.props.uniqueIdentifier)),selectedRowIds:t.selectedRowIds})}},getInitialState:function e(){var t={maxPage:0,page:0,
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
else{var p=[function(e){return(R(e,s)||"").toString().toLowerCase()}],d=[this.state.sortDirection]
u.columns.forEach(function(e,t){p.push(function(t){return(R(t,e)||"").toString().toLowerCase()}),"asc"===u.orders[t]||"desc"===u.orders[t]?d.push(u.orders[t]):d.push(o.state.sortDirection)}),t=D(t,p,d)

}}var c=this.getCurrentPage()
if(!this.props.useExternal&&r&&this.state.resultsPerPage*(c+1)<=this.state.resultsPerPage*this.state.maxPage&&c>=0)if(this.isInfiniteScrollEnabled())t=E(t,(c+1)*this.state.resultsPerPage)
else{var f=v(t,c*this.state.resultsPerPage)
t=(b||_)(f,f.length-this.state.resultsPerPage)}for(var h=this.columnSettings.getMetadataColumns,m=[],g=0;g<t.length;g++){var y=t[g]
"undefined"!=typeof y[i.props.childrenColumnName]&&y[i.props.childrenColumnName].length>0&&(y.children=i.getDataForRender(y[i.props.childrenColumnName],n,!1),"children"!==i.props.childrenColumnName&&delete y[i.props.childrenColumnName]),
m.push(y)}return m},getCurrentResults:function e(t){return this.state.filteredResults||t||this.props.results},getCurrentPage:function e(){return this.props.externalCurrentPage||this.state.page},getCurrentSort:function e(){
return this.props.useExternal?this.props.externalSortColumn:this.state.sortColumn},getCurrentSortAscending:function e(){return this.props.useExternal?this.props.externalSortAscending:"asc"===this.state.sortDirection

},getCurrentMaxPage:function e(){return this.props.useExternal?this.props.externalMaxPage:this.state.maxPage},getSortObject:function e(){return{enableSort:this.props.enableSort,changeSort:this.changeSort,
sortColumn:this.getCurrentSort(),sortAscending:this.getCurrentSortAscending(),sortDirection:this.state.sortDirection,sortAscendingClassName:this.props.sortAscendingClassName,sortDescendingClassName:this.props.sortDescendingClassName,
sortAscendingComponent:this.props.sortAscendingComponent,sortDescendingComponent:this.props.sortDescendingComponent,sortDefaultComponent:this.props.sortDefaultComponent}},_toggleSelectAll:function e(){
var t=this.getDataForRender(this.getCurrentResults(),this.columnSettings.getColumns(),!0),n=!this.state.isSelectAllChecked,r=JSON.parse(JSON.stringify(this.state.selectedRowIds)),o=this
S(t,function(e){o._updateSelectedRowIds(e[o.props.uniqueIdentifier],r,n)},this),this.setState({isSelectAllChecked:n,selectedRowIds:r}),this.props.onSelectionChange&&this.props.onSelectionChange(r,n)},_toggleSelectRow:function e(t,n){
var r=this.getDataForRender(this.getCurrentResults(),this.columnSettings.getColumns(),!0),o=JSON.parse(JSON.stringify(this.state.selectedRowIds))
this._updateSelectedRowIds(t[this.props.uniqueIdentifier],o,n)
var i=this._getAreAllRowsChecked(o,A(r,this.props.uniqueIdentifier))
this.setState({isSelectAllChecked:i,selectedRowIds:o}),this.props.onSelectionChange&&this.props.onSelectionChange(o,i)},_updateSelectedRowIds:function e(t,n,r){var o
r?(o=C(n,function(e){return t===e}),void 0===o&&n.push(t)):n.splice(n.indexOf(t),1)},_getIsSelectAllChecked:function e(){return this.state.isSelectAllChecked},_getAreAllRowsChecked:function e(t,n){return n.length===w(n,t).length

},_getIsRowChecked:function e(t){return this.state.selectedRowIds.indexOf(t[this.props.uniqueIdentifier])>-1},getSelectedRowIds:function e(){return this.state.selectedRowIds},_resetSelectedRows:function e(){
this.setState({isSelectAllChecked:!1,selectedRowIds:[]})},getMultipleSelectionObject:function e(){return{isMultipleSelection:!C(this.props.results,function(e){return"children"in e})&&this.props.isMultipleSelection,
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
data:this.props.results,className:this.props.customGridComponentClassName},this.props.gridMetadata))},getCustomRowSection:function e(t,n,r,i,s){return o.createElement("div",null,o.createElement(c,{data:t,
columns:n,metadataColumns:r,globalData:s,className:this.props.customRowComponentClassName,customComponent:this.props.customRowComponent,style:this.props.useGriddleStyles?this.getClearFixStyles():null}),this.props.showPager&&i)

},getStandardGridSection:function e(t,n,r,s,a){var l=this.getSortObject(),u=this.getMultipleSelectionObject(),p=this.shouldShowNoDataSection(t),d=this.getNoDataSection()
return o.createElement("div",{className:"griddle-body"},o.createElement(i,{useGriddleStyles:this.props.useGriddleStyles,noDataSection:d,showNoData:p,columnSettings:this.columnSettings,rowSettings:this.rowSettings,
sortSettings:l,multipleSelectionSettings:u,filterByColumn:this.filterByColumn,isSubGriddle:this.props.isSubGriddle,useGriddleIcons:this.props.useGriddleIcons,useFixedLayout:this.props.useFixedLayout,showPager:this.props.showPager,
pagingContent:s,data:t,className:this.props.tableClassName,enableInfiniteScroll:this.isInfiniteScrollEnabled(),nextPage:this.nextPage,showTableHeading:this.props.showTableHeading,useFixedHeader:this.props.useFixedHeader,
parentRowCollapsedClassName:this.props.parentRowCollapsedClassName,parentRowExpandedClassName:this.props.parentRowExpandedClassName,parentRowCollapsedComponent:this.props.parentRowCollapsedComponent,parentRowExpandedComponent:this.props.parentRowExpandedComponent,
bodyHeight:this.props.bodyHeight,paddingHeight:this.props.paddingHeight,rowHeight:this.props.rowHeight,infiniteScrollLoadTreshold:this.props.infiniteScrollLoadTreshold,externalLoadingComponent:this.props.externalLoadingComponent,
externalIsLoading:this.props.externalIsLoading,hasMorePages:a,onRowClick:this.props.onRowClick}))},getContentSection:function e(t,n,r,o,i,s){return this.shouldUseCustomGridComponent()&&null!==this.props.customGridComponent?this.getCustomGridSection():this.shouldUseCustomRowComponent()?this.getCustomRowSection(t,n,r,o,s):this.getStandardGridSection(t,n,r,o,i)

},getNoDataSection:function e(){return null!=this.props.customNoDataComponent?o.createElement("div",{className:this.props.noDataClassName},o.createElement(this.props.customNoDataComponent,this.props.customNoDataComponentProps)):o.createElement(u,{
noDataMessage:this.props.noDataMessage})},shouldShowNoDataSection:function e(t){return!this.props.allowEmptyGrid&&(this.props.useExternal===!1&&("undefined"==typeof t||0===t.length)||this.props.useExternal===!0&&this.props.externalIsLoading===!1&&0===t.length)

},render:function e(){var t=this,n=this.getCurrentResults(),r=this.props.tableClassName+" table-header",i=this.getFilter(),s=this.getSettings(),a=this.getTopSection(i,s),l=[],u=this.columnSettings.getColumns(),p=this.getDataForRender(n,u,!0),d=this.columnSettings.getMetadataColumns()


this.props.columnMetadata?S(this.props.columnMetadata,function(e){"boolean"==typeof e.visible&&e.visible===!1||l.push(e.columnName)}):l=y.keys(T(n[0],d)),l=this.columnSettings.orderColumns(l)
var c=this.getCurrentPage(),f=this.getCurrentMaxPage(),h=c+1<f,m=this.getPagingSection(c,f),g=this.getContentSection(p,u,d,m,h,this.props.globalData),v=this.getColumnSelectorSection(l,u),b=this.props.gridClassName.length>0?"griddle "+this.props.gridClassName:"griddle"


return b+=this.shouldUseCustomRowComponent()?" griddle-custom":"",o.createElement("div",{className:b},a,v,o.createElement("div",{className:"griddle-container",style:this.props.useGriddleStyles&&!this.props.isSubGriddle?{
border:"1px solid #DDD"}:null},g))}})
d.Griddle=e.exports=U},function(e,t,n){"use strict"
var r=n(4),o=n(36),i=n(197),s=n(37),a=n(204),l=r.createClass({displayName:"GridTable",getDefaultProps:function e(){return{data:[],columnSettings:null,rowSettings:null,sortSettings:null,multipleSelectionSettings:null,
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
if(this.props.enableInfiniteScroll&&null!==this.props.rowHeight&&void 0!==this.refs.scrollable){var u=t.getAdjustedRowHeight(),p=Math.ceil(t.state.clientHeight/u),d=Math.max(0,Math.floor(t.state.scrollTop/u)-.25*p),c=Math.min(d+1.25*p,this.props.data.length-1)


o=o.slice(d,c+1)
var f={height:d*u+"px"}
s=r.createElement("tr",{key:"above-"+f.height,style:f})
var h={height:(this.props.data.length-c)*u+"px"}
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
var p=null,d=null
this.props.useGriddleStyles&&(p={textAlign:"center",paddingBottom:"40px"}),d=this.props.columnSettings.getVisibleColumnCount()
var c=this.props.externalLoadingComponent?r.createElement(this.props.externalLoadingComponent,null):r.createElement("div",null,"Loading...")
l=r.createElement("tbody",null,r.createElement("tr",null,r.createElement("td",{style:p,colSpan:d},c)))}var f=this.props.showTableHeading?r.createElement(o,{useGriddleStyles:this.props.useGriddleStyles,
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
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(4),i=n(37),s=n(192),a=o.createClass({displayName:"DefaultHeaderComponent",render:function e(){return o.createElement("span",null,this.props.displayName)

}}),l=o.createClass({displayName:"GridTitle",getDefaultProps:function e(){return{columnSettings:null,filterByColumn:function e(){},rowSettings:null,sortSettings:null,multipleSelectionSettings:null,headerStyle:null,
useGriddleStyles:!0,useGriddleIcons:!0,headerStyles:{}}},componentWillMount:function e(){this.verifyProps()},sort:function e(t){var n=this
return function(e){n.props.sortSettings.changeSort(t)}},toggleSelectAll:function e(t){this.props.multipleSelectionSettings.toggleSelectAll()},handleSelectionChange:function e(t){},verifyProps:function e(){
null===this.props.columnSettings&&console.error("gridTitle: The columnSettings prop is null and it shouldn't be"),null===this.props.sortSettings&&console.error("gridTitle: The sortSettings prop is null and it shouldn't be")

},render:function e(){this.verifyProps()
var t=this,n={},i=this.props.columnSettings.getColumns().map(function(e,i){var l={},u="",p=t.props.columnSettings.getMetadataColumnProperty(e,"sortable",!0),d=p?t.props.sortSettings.sortDefaultComponent:null


t.props.sortSettings.sortColumn==e&&"asc"===t.props.sortSettings.sortDirection?(u=t.props.sortSettings.sortAscendingClassName,d=t.props.useGriddleIcons&&t.props.sortSettings.sortAscendingComponent):t.props.sortSettings.sortColumn==e&&"desc"===t.props.sortSettings.sortDirection&&(u+=t.props.sortSettings.sortDescendingClassName,
d=t.props.useGriddleIcons&&t.props.sortSettings.sortDescendingComponent)
var c=t.props.columnSettings.getColumnMetadataByName(e),f=t.props.columnSettings.getMetadataColumnProperty(e,"displayName",e),h=t.props.columnSettings.getMetadataColumnProperty(e,"customHeaderComponent",a),m=t.props.columnSettings.getMetadataColumnProperty(e,"customHeaderComponentProps",{})


u=null==c?u:(u&&u+" "||u)+t.props.columnSettings.getMetadataColumnProperty(e,"cssClassName",""),t.props.useGriddleStyles&&(l={backgroundColor:"#EDEDEF",border:"0px",borderBottom:"1px solid #DDD",color:"#222",
padding:"5px",cursor:p?"pointer":"default"}),n=c&&c.titleStyles?s({},l,c.titleStyles):s({},l)
var g=f?"th":"td"
return o.createElement(g,{onClick:p?t.sort(e):null,"data-title":e,className:u,key:e,style:n},o.createElement(h,r({columnName:e,displayName:f,filterByColumn:t.props.filterByColumn},m)),d)})
i&&this.props.multipleSelectionSettings.isMultipleSelection&&i.unshift(o.createElement("th",{key:"selection",onClick:this.toggleSelectAll,style:n,className:"griddle-select griddle-select-title"},o.createElement("input",{
type:"checkbox",checked:this.props.multipleSelectionSettings.getIsSelectAllChecked(),onChange:this.handleSelectionChange})))
var l=t.props.rowSettings&&t.props.rowSettings.getHeaderRowMetadataClass()||null
return o.createElement("thead",null,o.createElement("tr",{className:l,style:this.props.headerStyles},i))}})
e.exports=l},function(e,t,n){"use strict"
function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(38),s=n(159),a=n(161),l=n(168),u=n(184),p=function(){
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
return n(e,i(t,3))}var o=n(39),i=n(40),s=n(153),a=n(103)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e)
return o}e.exports=n},function(e,t,n){function r(e){return"function"==typeof e?e:null==e?s:"object"==typeof e?a(e)?i(e[0],e[1]):o(e):l(e)}var o=n(41),i=n(134),s=n(149),a=n(103),l=n(150)
e.exports=r},function(e,t,n){function r(e){var t=i(e)
return 1==t.length&&t[0][2]?s(t[0][0],t[0][1]):function(n){return n===e||o(n,e,t)}}var o=n(42),i=n(131),s=n(133)
e.exports=r},function(e,t,n){function r(e,t,n,r){var l=n.length,u=l,p=!r
if(null==e)return!u
for(e=Object(e);l--;){var d=n[l]
if(p&&d[2]?d[1]!==e[d[0]]:!(d[0]in e))return!1}for(;++l<u;){d=n[l]
var c=d[0],f=e[c],h=d[1]
if(p&&d[2]){if(void 0===f&&!(c in e))return!1}else{var m=new o
if(r)var g=r(f,h,c,e,t,m)
if(!(void 0===g?i(h,f,s|a,r,m):g))return!1}}return!0}var o=n(43),i=n(87),s=1,a=2
e.exports=r},function(e,t,n){function r(e){var t=this.__data__=new o(e)
this.size=t.size}var o=n(44),i=n(52),s=n(53),a=n(54),l=n(55),u=n(56)
r.prototype.clear=i,r.prototype.delete=s,r.prototype.get=a,r.prototype.has=l,r.prototype.set=u,e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(45),i=n(46),s=n(49),a=n(50),l=n(51)
r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t){function n(){this.__data__=[],this.size=0}e.exports=n},function(e,t,n){function r(e){
var t=this.__data__,n=o(t,e)
if(n<0)return!1
var r=t.length-1
return n==r?t.pop():s.call(t,n,1),--this.size,!0}var o=n(47),i=Array.prototype,s=i.splice
e.exports=r},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n
return-1}var o=n(48)
e.exports=r},function(e,t){function n(e,t){return e===t||e!==e&&t!==t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e)
return n<0?void 0:t[n][1]}var o=n(47)
e.exports=r},function(e,t,n){function r(e){return o(this.__data__,e)>-1}var o=n(47)
e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__,r=o(n,e)
return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}var o=n(47)
e.exports=r},function(e,t,n){function r(){this.__data__=new o,this.size=0}var o=n(44)
e.exports=r},function(e,t){function n(e){var t=this.__data__,n=t.delete(e)
return this.size=t.size,n}e.exports=n},function(e,t){function n(e){return this.__data__.get(e)}e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t,n){function r(e,t){
var n=this.__data__
if(n instanceof o){var r=n.__data__
if(!i||r.length<a-1)return r.push([e,t]),this.size=++n.size,this
n=this.__data__=new s(r)}return n.set(e,t),this.size=n.size,this}var o=n(44),i=n(57),s=n(72),a=200
e.exports=r},function(e,t,n){var r=n(58),o=n(63),i=r(o,"Map")
e.exports=i},function(e,t,n){function r(e,t){var n=i(e,t)
return o(n)?n:void 0}var o=n(59),i=n(71)
e.exports=r},function(e,t,n){function r(e){if(!s(e)||i(e))return!1
var t=o(e)?h:u
return t.test(a(e))}var o=n(60),i=n(68),s=n(67),a=n(70),l=/[\\^$.*+?()[\]{}|]/g,u=/^\[object .+?Constructor\]$/,p=Function.prototype,d=Object.prototype,c=p.toString,f=d.hasOwnProperty,h=RegExp("^"+c.call(f).replace(l,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$")


e.exports=r},function(e,t,n){function r(e){if(!i(e))return!1
var t=o(e)
return t==a||t==l||t==s||t==u}var o=n(61),i=n(67),s="[object AsyncFunction]",a="[object Function]",l="[object GeneratorFunction]",u="[object Proxy]"
e.exports=r},function(e,t,n){function r(e){return null==e?void 0===e?l:a:u&&u in Object(e)?i(e):s(e)}var o=n(62),i=n(65),s=n(66),a="[object Null]",l="[object Undefined]",u=o?o.toStringTag:void 0
e.exports=r},function(e,t,n){var r=n(63),o=r.Symbol
e.exports=o},function(e,t,n){var r=n(64),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")()
e.exports=i},function(e,t){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t
e.exports=n}).call(t,function(){return this}())},function(e,t,n){function r(e){var t=s.call(e,l),n=e[l]
try{e[l]=void 0
var r=!0}catch(e){}var o=a.call(e)
return r&&(t?e[l]=n:delete e[l]),o}var o=n(62),i=Object.prototype,s=i.hasOwnProperty,a=i.toString,l=o?o.toStringTag:void 0
e.exports=r},function(e,t){function n(e){return o.call(e)}var r=Object.prototype,o=r.toString
e.exports=n},function(e,t){function n(e){var t=typeof e
return null!=e&&("object"==t||"function"==t)}e.exports=n},function(e,t,n){function r(e){return!!i&&i in e}var o=n(69),i=function(){var e=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"")
return e?"Symbol(src)_1."+e:""}()
e.exports=r},function(e,t,n){var r=n(63),o=r["__core-js_shared__"]
e.exports=o},function(e,t){function n(e){if(null!=e){try{return o.call(e)}catch(e){}try{return e+""}catch(e){}}return""}var r=Function.prototype,o=r.toString
e.exports=n},function(e,t){function n(e,t){return null==e?void 0:e[t]}e.exports=n},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(73),i=n(81),s=n(84),a=n(85),l=n(86)
r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.size=0,this.__data__={hash:new o,map:new(s||i),string:new o
}}var o=n(74),i=n(44),s=n(57)
e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(75),i=n(77),s=n(78),a=n(79),l=n(80)
r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.__data__=o?o(null):{},this.size=0}var o=n(76)
e.exports=r},function(e,t,n){var r=n(58),o=r(Object,"create")
e.exports=o},function(e,t){function n(e){var t=this.has(e)&&delete this.__data__[e]
return this.size-=t?1:0,t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__
if(o){var n=t[e]
return n===i?void 0:n}return a.call(t,e)?t[e]:void 0}var o=n(76),i="__lodash_hash_undefined__",s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){function r(e){var t=this.__data__
return o?void 0!==t[e]:s.call(t,e)}var o=n(76),i=Object.prototype,s=i.hasOwnProperty
e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__
return this.size+=this.has(e)?0:1,n[e]=o&&void 0===t?i:t,this}var o=n(76),i="__lodash_hash_undefined__"
e.exports=r},function(e,t,n){function r(e){var t=o(this,e).delete(e)
return this.size-=t?1:0,t}var o=n(82)
e.exports=r},function(e,t,n){function r(e,t){var n=e.__data__
return o(t)?n["string"==typeof t?"string":"hash"]:n.map}var o=n(83)
e.exports=r},function(e,t){function n(e){var t=typeof e
return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}e.exports=n},function(e,t,n){function r(e){return o(this,e).get(e)}var o=n(82)
e.exports=r},function(e,t,n){function r(e){return o(this,e).has(e)}var o=n(82)
e.exports=r},function(e,t,n){function r(e,t){var n=o(this,e),r=n.size
return n.set(e,t),this.size+=n.size==r?0:1,this}var o=n(82)
e.exports=r},function(e,t,n){function r(e,t,n,s,a){return e===t||(null==e||null==t||!i(e)&&!i(t)?e!==e&&t!==t:o(e,t,n,s,r,a))}var o=n(88),i=n(112)
e.exports=r},function(e,t,n){function r(e,t,n,r,g,v){var b=u(e),C=u(t),E=b?h:l(e),S=C?h:l(t)
E=E==f?m:E,S=S==f?m:S
var _=E==m,w=S==m,F=E==S
if(F&&p(e)){if(!p(t))return!1
b=!0,_=!1}if(F&&!_)return v||(v=new o),b||d(e)?i(e,t,n,r,g,v):s(e,t,E,n,r,g,v)
if(!(n&c)){var P=_&&y.call(e,"__wrapped__"),x=w&&y.call(t,"__wrapped__")
if(P||x){var I=P?e.value():e,T=x?t.value():t
return v||(v=new o),g(I,T,n,r,v)}}return!!F&&(v||(v=new o),a(e,t,n,r,g,v))}var o=n(43),i=n(89),s=n(95),a=n(99),l=n(126),u=n(103),p=n(113),d=n(116),c=1,f="[object Arguments]",h="[object Array]",m="[object Object]",g=Object.prototype,y=g.hasOwnProperty


e.exports=r},function(e,t,n){function r(e,t,n,r,u,p){var d=n&a,c=e.length,f=t.length
if(c!=f&&!(d&&f>c))return!1
var h=p.get(e)
if(h&&p.get(t))return h==t
var m=-1,g=!0,y=n&l?new o:void 0
for(p.set(e,t),p.set(t,e);++m<c;){var v=e[m],b=t[m]
if(r)var C=d?r(b,v,m,t,e,p):r(v,b,m,e,t,p)
if(void 0!==C){if(C)continue
g=!1
break}if(y){if(!i(t,function(e,t){if(!s(y,t)&&(v===e||u(v,e,n,r,p)))return y.push(t)})){g=!1
break}}else if(v!==b&&!u(v,b,n,r,p)){g=!1
break}}return p.delete(e),p.delete(t),g}var o=n(90),i=n(93),s=n(94),a=1,l=2
e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.__data__=new o;++t<n;)this.add(e[t])}var o=n(72),i=n(91),s=n(92)
r.prototype.add=r.prototype.push=i,r.prototype.has=s,e.exports=r},function(e,t){function n(e){return this.__data__.set(e,r),this}var r="__lodash_hash_undefined__"
e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0
return!1}e.exports=n},function(e,t){function n(e,t){return e.has(t)}e.exports=n},function(e,t,n){function r(e,t,n,r,o,_,F){switch(n){case S:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1


e=e.buffer,t=t.buffer
case E:return!(e.byteLength!=t.byteLength||!_(new i(e),new i(t)))
case c:case f:case g:return s(+e,+t)
case h:return e.name==t.name&&e.message==t.message
case y:case b:return e==t+""
case m:var P=l
case v:var x=r&p
if(P||(P=u),e.size!=t.size&&!x)return!1
var I=F.get(e)
if(I)return I==t
r|=d,F.set(e,t)
var T=a(P(e),P(t),r,o,_,F)
return F.delete(e),T
case C:if(w)return w.call(e)==w.call(t)}return!1}var o=n(62),i=n(96),s=n(48),a=n(89),l=n(97),u=n(98),p=1,d=2,c="[object Boolean]",f="[object Date]",h="[object Error]",m="[object Map]",g="[object Number]",y="[object RegExp]",v="[object Set]",b="[object String]",C="[object Symbol]",E="[object ArrayBuffer]",S="[object DataView]",_=o?o.prototype:void 0,w=_?_.valueOf:void 0


e.exports=r},function(e,t,n){var r=n(63),o=r.Uint8Array
e.exports=o},function(e,t){function n(e){var t=-1,n=Array(e.size)
return e.forEach(function(e,r){n[++t]=[r,e]}),n}e.exports=n},function(e,t){function n(e){var t=-1,n=Array(e.size)
return e.forEach(function(e){n[++t]=e}),n}e.exports=n},function(e,t,n){function r(e,t,n,r,s,l){var u=n&i,p=o(e),d=p.length,c=o(t),f=c.length
if(d!=f&&!u)return!1
for(var h=d;h--;){var m=p[h]
if(!(u?m in t:a.call(t,m)))return!1}var g=l.get(e)
if(g&&l.get(t))return g==t
var y=!0
l.set(e,t),l.set(t,e)
for(var v=u;++h<d;){m=p[h]
var b=e[m],C=t[m]
if(r)var E=u?r(C,b,m,t,e,l):r(b,C,m,e,t,l)
if(!(void 0===E?b===C||s(b,C,n,r,l):E)){y=!1
break}v||(v="constructor"==m)}if(y&&!v){var S=e.constructor,_=t.constructor
S!=_&&"constructor"in e&&"constructor"in t&&!("function"==typeof S&&S instanceof S&&"function"==typeof _&&_ instanceof _)&&(y=!1)}return l.delete(e),l.delete(t),y}var o=n(100),i=1,s=Object.prototype,a=s.hasOwnProperty


e.exports=r},function(e,t,n){function r(e){return o(e,s,i)}var o=n(101),i=n(104),s=n(107)
e.exports=r},function(e,t,n){function r(e,t,n){var r=t(e)
return i(e)?r:o(r,n(e))}var o=n(102),i=n(103)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n]
return e}e.exports=n},function(e,t){var n=Array.isArray
e.exports=n},function(e,t,n){var r=n(105),o=n(106),i=Object.prototype,s=i.propertyIsEnumerable,a=Object.getOwnPropertySymbols,l=a?function(e){return null==e?[]:(e=Object(e),r(a(e),function(t){return s.call(e,t)

}))}:o
e.exports=l},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=0,i=[];++n<r;){var s=e[n]
t(s,n,e)&&(i[o++]=s)}return i}e.exports=n},function(e,t){function n(){return[]}e.exports=n},function(e,t,n){function r(e){return s(e)?o(e):i(e)}var o=n(108),i=n(121),s=n(125)
e.exports=r},function(e,t,n){function r(e,t){var n=s(e),r=!n&&i(e),p=!n&&!r&&a(e),c=!n&&!r&&!p&&u(e),f=n||r||p||c,h=f?o(e.length,String):[],m=h.length
for(var g in e)!t&&!d.call(e,g)||f&&("length"==g||p&&("offset"==g||"parent"==g)||c&&("buffer"==g||"byteLength"==g||"byteOffset"==g)||l(g,m))||h.push(g)
return h}var o=n(109),i=n(110),s=n(103),a=n(113),l=n(115),u=n(116),p=Object.prototype,d=p.hasOwnProperty
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n)
return r}e.exports=n},function(e,t,n){var r=n(111),o=n(112),i=Object.prototype,s=i.hasOwnProperty,a=i.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&s.call(e,"callee")&&!a.call(e,"callee")

}
e.exports=l},function(e,t,n){function r(e){return i(e)&&o(e)==s}var o=n(61),i=n(112),s="[object Arguments]"
e.exports=r},function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},function(e,t,n){(function(e){var r=n(63),o=n(114),i="object"==typeof t&&t&&!t.nodeType&&t,s=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=s&&s.exports===i,l=a?r.Buffer:void 0,u=l?l.isBuffer:void 0,p=u||o


e.exports=p}).call(t,n(28)(e))},function(e,t){function n(){return!1}e.exports=n},function(e,t){function n(e,t){return t=null==t?r:t,!!t&&("number"==typeof e||o.test(e))&&e>-1&&e%1==0&&e<t}var r=9007199254740991,o=/^(?:0|[1-9]\d*)$/


e.exports=n},function(e,t,n){var r=n(117),o=n(119),i=n(120),s=i&&i.isTypedArray,a=s?o(s):r
e.exports=a},function(e,t,n){function r(e){return s(e)&&i(e.length)&&!!O[o(e)]}var o=n(61),i=n(118),s=n(112),a="[object Arguments]",l="[object Array]",u="[object Boolean]",p="[object Date]",d="[object Error]",c="[object Function]",f="[object Map]",h="[object Number]",m="[object Object]",g="[object RegExp]",y="[object Set]",v="[object String]",b="[object WeakMap]",C="[object ArrayBuffer]",E="[object DataView]",S="[object Float32Array]",_="[object Float64Array]",w="[object Int8Array]",F="[object Int16Array]",P="[object Int32Array]",x="[object Uint8Array]",I="[object Uint8ClampedArray]",T="[object Uint16Array]",A="[object Uint32Array]",O={}


O[S]=O[_]=O[w]=O[F]=O[P]=O[x]=O[I]=O[T]=O[A]=!0,O[a]=O[l]=O[C]=O[u]=O[E]=O[p]=O[d]=O[c]=O[f]=O[h]=O[m]=O[g]=O[y]=O[v]=O[b]=!1,e.exports=r},function(e,t){function n(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=r

}var r=9007199254740991
e.exports=n},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n},function(e,t,n){(function(e){var r=n(64),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,s=i&&i.exports===o,a=s&&r.process,l=function(){
try{return a&&a.binding&&a.binding("util")}catch(e){}}()
e.exports=l}).call(t,n(28)(e))},function(e,t,n){function r(e){if(!o(e))return i(e)
var t=[]
for(var n in Object(e))a.call(e,n)&&"constructor"!=n&&t.push(n)
return t}var o=n(122),i=n(123),s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t){function n(e){var t=e&&e.constructor,n="function"==typeof t&&t.prototype||r
return e===n}var r=Object.prototype
e.exports=n},function(e,t,n){var r=n(124),o=r(Object.keys,Object)
e.exports=o},function(e,t){function n(e,t){return function(n){return e(t(n))}}e.exports=n},function(e,t,n){function r(e){return null!=e&&i(e.length)&&!o(e)}var o=n(60),i=n(118)
e.exports=r},function(e,t,n){var r=n(127),o=n(57),i=n(128),s=n(129),a=n(130),l=n(61),u=n(70),p="[object Map]",d="[object Object]",c="[object Promise]",f="[object Set]",h="[object WeakMap]",m="[object DataView]",g=u(r),y=u(o),v=u(i),b=u(s),C=u(a),E=l

;(r&&E(new r(new ArrayBuffer(1)))!=m||o&&E(new o)!=p||i&&E(i.resolve())!=c||s&&E(new s)!=f||a&&E(new a)!=h)&&(E=function(e){var t=l(e),n=t==d?e.constructor:void 0,r=n?u(n):""
if(r)switch(r){case g:return m
case y:return p
case v:return c
case b:return f
case C:return h}return t}),e.exports=E},function(e,t,n){var r=n(58),o=n(63),i=r(o,"DataView")
e.exports=i},function(e,t,n){var r=n(58),o=n(63),i=r(o,"Promise")
e.exports=i},function(e,t,n){var r=n(58),o=n(63),i=r(o,"Set")
e.exports=i},function(e,t,n){var r=n(58),o=n(63),i=r(o,"WeakMap")
e.exports=i},function(e,t,n){function r(e){for(var t=i(e),n=t.length;n--;){var r=t[n],s=e[r]
t[n]=[r,s,o(s)]}return t}var o=n(132),i=n(107)
e.exports=r},function(e,t,n){function r(e){return e===e&&!o(e)}var o=n(67)
e.exports=r},function(e,t){function n(e,t){return function(n){return null!=n&&(n[e]===t&&(void 0!==t||e in Object(n)))}}e.exports=n},function(e,t,n){function r(e,t){return a(e)&&l(t)?u(p(e),t):function(n){
var r=i(n,e)
return void 0===r&&r===t?s(n,e):o(t,r,d|c)}}var o=n(87),i=n(135),s=n(146),a=n(138),l=n(132),u=n(133),p=n(145),d=1,c=2
e.exports=r},function(e,t,n){function r(e,t,n){var r=null==e?void 0:o(e,t)
return void 0===r?n:r}var o=n(136)
e.exports=r},function(e,t,n){function r(e,t){t=o(t,e)
for(var n=0,r=t.length;null!=e&&n<r;)e=e[i(t[n++])]
return n&&n==r?e:void 0}var o=n(137),i=n(145)
e.exports=r},function(e,t,n){function r(e,t){return o(e)?e:i(e,t)?[e]:s(a(e))}var o=n(103),i=n(138),s=n(140),a=n(143)
e.exports=r},function(e,t,n){function r(e,t){if(o(e))return!1
var n=typeof e
return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!i(e))||(a.test(e)||!s.test(e)||null!=t&&e in Object(t))}var o=n(103),i=n(139),s=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,a=/^\w*$/
e.exports=r},function(e,t,n){function r(e){return"symbol"==typeof e||i(e)&&o(e)==s}var o=n(61),i=n(112),s="[object Symbol]"
e.exports=r},function(e,t,n){var r=n(141),o=/^\./,i=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,s=/\\(\\)?/g,a=r(function(e){var t=[]
return o.test(e)&&t.push(""),e.replace(i,function(e,n,r,o){t.push(r?o.replace(s,"$1"):n||e)}),t})
e.exports=a},function(e,t,n){function r(e){var t=o(e,function(e){return n.size===i&&n.clear(),e}),n=t.cache
return t}var o=n(142),i=500
e.exports=r},function(e,t,n){function r(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError(i)
var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],i=n.cache
if(i.has(o))return i.get(o)
var s=e.apply(this,r)
return n.cache=i.set(o,s)||i,s}
return n.cache=new(r.Cache||o),n}var o=n(72),i="Expected a function"
r.Cache=o,e.exports=r},function(e,t,n){function r(e){return null==e?"":o(e)}var o=n(144)
e.exports=r},function(e,t,n){function r(e){if("string"==typeof e)return e
if(s(e))return i(e,r)+""
if(a(e))return p?p.call(e):""
var t=e+""
return"0"==t&&1/e==-l?"-0":t}var o=n(62),i=n(39),s=n(103),a=n(139),l=1/0,u=o?o.prototype:void 0,p=u?u.toString:void 0
e.exports=r},function(e,t,n){function r(e){if("string"==typeof e||o(e))return e
var t=e+""
return"0"==t&&1/e==-i?"-0":t}var o=n(139),i=1/0
e.exports=r},function(e,t,n){function r(e,t){return null!=e&&i(e,t,o)}var o=n(147),i=n(148)
e.exports=r},function(e,t){function n(e,t){return null!=e&&t in Object(e)}e.exports=n},function(e,t,n){function r(e,t,n){t=o(t,e)
for(var r=-1,p=t.length,d=!1;++r<p;){var c=u(t[r])
if(!(d=null!=e&&n(e,c)))break
e=e[c]}return d||++r!=p?d:(p=null==e?0:e.length,!!p&&l(p)&&a(c,p)&&(s(e)||i(e)))}var o=n(137),i=n(110),s=n(103),a=n(115),l=n(118),u=n(145)
e.exports=r},function(e,t){function n(e){return e}e.exports=n},function(e,t,n){function r(e){return s(e)?o(a(e)):i(e)}var o=n(151),i=n(152),s=n(138),a=n(145)
e.exports=r},function(e,t){function n(e){return function(t){return null==t?void 0:t[e]}}e.exports=n},function(e,t,n){function r(e){return function(t){return o(t,e)}}var o=n(136)
e.exports=r},function(e,t,n){function r(e,t){var n=-1,r=i(e)?Array(e.length):[]
return o(e,function(e,o,i){r[++n]=t(e,o,i)}),r}var o=n(154),i=n(125)
e.exports=r},function(e,t,n){var r=n(155),o=n(158),i=o(r)
e.exports=i},function(e,t,n){function r(e,t){return e&&o(e,t,i)}var o=n(156),i=n(107)
e.exports=r},function(e,t,n){var r=n(157),o=r()
e.exports=o},function(e,t){function n(e){return function(t,n,r){for(var o=-1,i=Object(t),s=r(t),a=s.length;a--;){var l=s[e?a:++o]
if(n(i[l],l,i)===!1)break}return t}}e.exports=n},function(e,t,n){function r(e,t){return function(n,r){if(null==n)return n
if(!o(n))return e(n,r)
for(var i=n.length,s=t?i:-1,a=Object(n);(t?s--:++s<i)&&r(a[s],s,a)!==!1;);return n}}var o=n(125)
e.exports=r},function(e,t,n){function r(e,t){var n=a(e)?o:i
return n(e,s(t,3))}var o=n(105),i=n(160),s=n(40),a=n(103)
e.exports=r},function(e,t,n){function r(e,t){var n=[]
return o(e,function(e,r,o){t(e,r,o)&&n.push(e)}),n}var o=n(154)
e.exports=r},function(e,t,n){var r=n(162),o=n(163),i=r(o)
e.exports=i},function(e,t,n){function r(e){return function(t,n,r){var a=Object(t)
if(!i(t)){var l=o(n,3)
t=s(t),n=function(e){return l(a[e],e,a)}}var u=e(t,n,r)
return u>-1?a[l?t[u]:u]:void 0}}var o=n(40),i=n(125),s=n(107)
e.exports=r},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
if(!r)return-1
var l=null==n?0:s(n)
return l<0&&(l=a(r+l,0)),o(e,i(t,3),l)}var o=n(164),i=n(40),s=n(165),a=Math.max
e.exports=r},function(e,t){function n(e,t,n,r){for(var o=e.length,i=n+(r?1:-1);r?i--:++i<o;)if(t(e[i],i,e))return i
return-1}e.exports=n},function(e,t,n){function r(e){var t=o(e),n=t%1
return t===t?n?t-n:t:0}var o=n(166)
e.exports=r},function(e,t,n){function r(e){if(!e)return 0===e?e:0
if(e=o(e),e===i||e===-i){var t=e<0?-1:1
return t*s}return e===e?e:0}var o=n(167),i=1/0,s=1.7976931348623157e308
e.exports=r},function(e,t,n){function r(e){if("number"==typeof e)return e
if(i(e))return s
if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e
e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e
e=e.replace(a,"")
var n=u.test(e)
return n||p.test(e)?d(e.slice(2),n?2:8):l.test(e)?s:+e}var o=n(67),i=n(139),s=NaN,a=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,u=/^0b[01]+$/i,p=/^0o[0-7]+$/i,d=parseInt
e.exports=r},function(e,t,n){var r=n(169),o=n(171),i=n(175),s=n(183),a=i(function(e,t){if(null==e)return[]
var n=t.length
return n>1&&s(e,t[0],t[1])?t=[]:n>2&&s(t[0],t[1],t[2])&&(t=[t[0]]),o(e,r(t,1),[])})
e.exports=a},function(e,t,n){function r(e,t,n,s,a){var l=-1,u=e.length
for(n||(n=i),a||(a=[]);++l<u;){var p=e[l]
t>0&&n(p)?t>1?r(p,t-1,n,s,a):o(a,p):s||(a[a.length]=p)}return a}var o=n(102),i=n(170)
e.exports=r},function(e,t,n){function r(e){return s(e)||i(e)||!!(a&&e&&e[a])}var o=n(62),i=n(110),s=n(103),a=o?o.isConcatSpreadable:void 0
e.exports=r},function(e,t,n){function r(e,t,n){var r=-1
t=o(t.length?t:[p],l(i))
var d=s(e,function(e,n,i){var s=o(t,function(t){return t(e)})
return{criteria:s,index:++r,value:e}})
return a(d,function(e,t){return u(e,t,n)})}var o=n(39),i=n(40),s=n(153),a=n(172),l=n(119),u=n(173),p=n(149)
e.exports=r},function(e,t){function n(e,t){var n=e.length
for(e.sort(t);n--;)e[n]=e[n].value
return e}e.exports=n},function(e,t,n){function r(e,t,n){for(var r=-1,i=e.criteria,s=t.criteria,a=i.length,l=n.length;++r<a;){var u=o(i[r],s[r])
if(u){if(r>=l)return u
var p=n[r]
return u*("desc"==p?-1:1)}}return e.index-t.index}var o=n(174)
e.exports=r},function(e,t,n){function r(e,t){if(e!==t){var n=void 0!==e,r=null===e,i=e===e,s=o(e),a=void 0!==t,l=null===t,u=t===t,p=o(t)
if(!l&&!p&&!s&&e>t||s&&a&&u&&!l&&!p||r&&a&&u||!n&&u||!i)return 1
if(!r&&!s&&!p&&e<t||p&&n&&i&&!r&&!s||l&&n&&i||!a&&i||!u)return-1}return 0}var o=n(139)
e.exports=r},function(e,t,n){function r(e,t){return s(i(e,t,o),e+"")}var o=n(149),i=n(176),s=n(178)
e.exports=r},function(e,t,n){function r(e,t,n){return t=i(void 0===t?e.length-1:t,0),function(){for(var r=arguments,s=-1,a=i(r.length-t,0),l=Array(a);++s<a;)l[s]=r[t+s]
s=-1
for(var u=Array(t+1);++s<t;)u[s]=r[s]
return u[t]=n(l),o(e,this,u)}}var o=n(177),i=Math.max
e.exports=r},function(e,t){function n(e,t,n){switch(n.length){case 0:return e.call(t)
case 1:return e.call(t,n[0])
case 2:return e.call(t,n[0],n[1])
case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.exports=n},function(e,t,n){var r=n(179),o=n(182),i=o(r)
e.exports=i},function(e,t,n){var r=n(180),o=n(181),i=n(149),s=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:i
e.exports=s},function(e,t){function n(e){return function(){return e}}e.exports=n},function(e,t,n){var r=n(58),o=function(){try{var e=r(Object,"defineProperty")
return e({},"",{}),e}catch(e){}}()
e.exports=o},function(e,t){function n(e){var t=0,n=0
return function(){var s=i(),a=o-(s-n)
if(n=s,a>0){if(++t>=r)return arguments[0]}else t=0
return e.apply(void 0,arguments)}}var r=800,o=16,i=Date.now
e.exports=n},function(e,t,n){function r(e,t,n){if(!a(n))return!1
var r=typeof t
return!!("number"==r?i(n)&&s(t,n.length):"string"==r&&t in n)&&o(n[t],e)}var o=n(48),i=n(125),s=n(115),a=n(67)
e.exports=r},function(e,t,n){var r=n(185),o=n(169),i=n(175),s=n(191),a=i(function(e,t){return s(e)?r(e,o(t,1,s,!0)):[]})
e.exports=a},function(e,t,n){function r(e,t,n,r){var d=-1,c=i,f=!0,h=e.length,m=[],g=t.length
if(!h)return m
n&&(t=a(t,l(n))),r?(c=s,f=!1):t.length>=p&&(c=u,f=!1,t=new o(t))
e:for(;++d<h;){var y=e[d],v=null==n?y:n(y)
if(y=r||0!==y?y:0,f&&v===v){for(var b=g;b--;)if(t[b]===v)continue e
m.push(y)}else c(t,v,r)||m.push(y)}return m}var o=n(90),i=n(186),s=n(190),a=n(39),l=n(119),u=n(94),p=200
e.exports=r},function(e,t,n){function r(e,t){var n=null==e?0:e.length
return!!n&&o(e,t,0)>-1}var o=n(187)
e.exports=r},function(e,t,n){function r(e,t,n){return t===t?s(e,t,n):o(e,i,n)}var o=n(164),i=n(188),s=n(189)
e.exports=r},function(e,t){function n(e){return e!==e}e.exports=n},function(e,t){function n(e,t,n){for(var r=n-1,o=e.length;++r<o;)if(e[r]===t)return r
return-1}e.exports=n},function(e,t){function n(e,t,n){for(var r=-1,o=null==e?0:e.length;++r<o;)if(n(t,e[r]))return!0
return!1}e.exports=n},function(e,t,n){function r(e){return i(e)&&o(e)}var o=n(125),i=n(112)
e.exports=r},function(e,t,n){var r=n(193),o=n(195),i=n(196),s=n(125),a=n(122),l=n(107),u=Object.prototype,p=u.hasOwnProperty,d=i(function(e,t){if(a(t)||s(t))return void o(t,l(t),e)
for(var n in t)p.call(t,n)&&r(e,n,t[n])})
e.exports=d},function(e,t,n){function r(e,t,n){var r=e[t]
a.call(e,t)&&i(r,n)&&(void 0!==n||t in e)||o(e,t,n)}var o=n(194),i=n(48),s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){function r(e,t,n){"__proto__"==t&&o?o(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}var o=n(181)
e.exports=r},function(e,t,n){function r(e,t,n,r){var s=!n
n||(n={})
for(var a=-1,l=t.length;++a<l;){var u=t[a],p=r?r(n[u],e[u],u,n,e):void 0
void 0===p&&(p=e[u]),s?i(n,u,p):o(n,u,p)}return n}var o=n(193),i=n(194)
e.exports=r},function(e,t,n){function r(e){return o(function(t,n){var r=-1,o=n.length,s=o>1?n[o-1]:void 0,a=o>2?n[2]:void 0
for(s=e.length>3&&"function"==typeof s?(o--,s):void 0,a&&i(n[0],n[1],a)&&(s=o<3?void 0:s,o=1),t=Object(t);++r<o;){var l=n[r]
l&&e(t,l,r,s)}return t})}var o=n(175),i=n(183)
e.exports=r},function(e,t,n){"use strict"
var r=n(4),o=n(37),i=n(198),s=r.createClass({displayName:"GridRowContainer",getDefaultProps:function e(){return{useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,columnSettings:null,rowSettings:null,
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
e.exports=s},function(e,t,n){var r=n(199),o=n(202),i=o(function(e,t){return null==e?{}:r(e,t)})
e.exports=i},function(e,t,n){function r(e,t){return o(e,t,function(t,n){return i(e,n)})}var o=n(200),i=n(146)
e.exports=r},function(e,t,n){function r(e,t,n){for(var r=-1,a=t.length,l={};++r<a;){var u=t[r],p=o(e,u)
n(p,u)&&i(l,s(u,e),p)}return l}var o=n(136),i=n(201),s=n(137)
e.exports=r},function(e,t,n){function r(e,t,n,r){if(!a(e))return e
t=i(t,e)
for(var u=-1,p=t.length,d=p-1,c=e;null!=c&&++u<p;){var f=l(t[u]),h=n
if(u!=d){var m=c[f]
h=r?r(m,f,c):void 0,void 0===h&&(h=a(m)?m:s(t[u+1])?[]:{})}o(c,f,h),c=c[f]}return e}var o=n(193),i=n(137),s=n(115),a=n(67),l=n(145)
e.exports=r},function(e,t,n){function r(e){return s(i(e,void 0,o),e+"")}var o=n(203),i=n(176),s=n(178)
e.exports=r},function(e,t,n){function r(e){var t=null==e?0:e.length
return t?o(e,1):[]}var o=n(169)
e.exports=r},function(e,t,n){"use strict"
function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(205),s=function(){function e(){
var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=arguments.length<=1||void 0===arguments[1]?null:arguments[1],o=!(arguments.length<=2||void 0===arguments[2])&&arguments[2]
r(this,e),this.rowMetadata=t,this.rowComponent=n,this.isCustom=o}return o(e,[{key:"getRowKey",value:function e(t,n){var r
return r=this.hasRowMetadataKey()?t[this.rowMetadata.key]:i("grid_row")}},{key:"hasRowMetadataKey",value:function e(){return this.hasRowMetadata()&&null!==this.rowMetadata.key&&void 0!==this.rowMetadata.key

}},{key:"getBodyRowMetadataClass",value:function e(t){return this.hasRowMetadata()&&null!==this.rowMetadata.bodyCssClassName&&void 0!==this.rowMetadata.bodyCssClassName?"function"==typeof this.rowMetadata.bodyCssClassName?this.rowMetadata.bodyCssClassName(t):this.rowMetadata.bodyCssClassName:null

}},{key:"getHeaderRowMetadataClass",value:function e(){return this.hasRowMetadata()&&null!==this.rowMetadata.headerCssClassName&&void 0!==this.rowMetadata.headerCssClassName?this.rowMetadata.headerCssClassName:null

}},{key:"hasRowMetadata",value:function e(){return null!==this.rowMetadata}}]),e}()
e.exports=s},function(e,t,n){function r(e){var t=++i
return o(e)+t}var o=n(143),i=0
e.exports=r},function(e,t,n){"use strict"
var r=n(4),o=r.createClass({displayName:"GridFilter",getDefaultProps:function e(){return{placeholderText:""}},handleChange:function e(t){this.props.changeFilter(t.target.value)},render:function e(){return r.createElement("div",{
className:"filter-container"},r.createElement("input",{type:"text",name:"filter",placeholder:this.props.placeholderText,className:"form-control",onChange:this.handleChange}))}})
e.exports=o},function(e,t,n){"use strict"
var r=n(4),o=n(192),i=r.createClass({displayName:"GridPagination",getDefaultProps:function e(){return{maxPage:0,nextText:"",previousText:"",currentPage:0,useGriddleStyles:!0,nextClassName:"griddle-next",
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
var r=n(4),o=n(209),i=n(213),s=n(161),a=r.createClass({displayName:"GridSettings",getDefaultProps:function e(){return{columns:[],columnMetadata:[],selectedColumns:[],settingsText:"",maxRowsText:"",resultsPerPage:0,
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
return n<0&&(n=u(p+n,0)),s(e)?n<=p&&e.indexOf(t,n)>-1:!!p&&o(e,t,n)>-1}var o=n(187),i=n(125),s=n(210),a=n(165),l=n(211),u=Math.max
e.exports=r},function(e,t,n){function r(e){return"string"==typeof e||!i(e)&&s(e)&&o(e)==a}var o=n(61),i=n(103),s=n(112),a="[object String]"
e.exports=r},function(e,t,n){function r(e){return null==e?[]:o(e,i(e))}var o=n(212),i=n(107)
e.exports=r},function(e,t,n){function r(e,t){return o(t,function(t){return e[t]})}var o=n(39)
e.exports=r},function(e,t,n){var r=n(185),o=n(175),i=n(191),s=o(function(e,t){return i(e)?r(e,t):[]})
e.exports=s},function(e,t,n){"use strict"
var r=n(4),o=r.createClass({displayName:"GridNoData",getDefaultProps:function e(){return{noDataMessage:"No Data"}},render:function e(){var t=this
return r.createElement("div",null,this.props.noDataMessage)}})
e.exports=o},function(e,t,n){"use strict"
var r=n(4),o=n(37),i=n(216),s=n(60),a=n(223),l=n(192),u=n(225),p=n(231),d=n(213),c=r.createClass({displayName:"GridRow",getDefaultProps:function e(){return{isChildRow:!1,showChildren:!1,data:{},columnSettings:null,
rowSettings:null,hasChildren:!1,useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,paddingHeight:null,rowHeight:null,parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",
parentRowCollapsedComponent:"▶",parentRowExpandedComponent:"▼",onRowClick:null,multipleSelectionSettings:null}},handleClick:function e(t){null!==this.props.onRowClick&&s(this.props.onRowClick)?this.props.onRowClick(this,t):this.props.hasChildren&&this.props.toggleChildren()

},handleSelectionChange:function e(t){},handleSelectClick:function e(t){this.props.multipleSelectionSettings.isMultipleSelection&&("checkbox"===t.target.type?this.props.multipleSelectionSettings.toggleSelectRow(this.props.data,this.refs.selected.checked):this.props.multipleSelectionSettings.toggleSelectRow(this.props.data,!this.refs.selected.checked))

},verifyProps:function e(){null===this.props.columnSettings&&console.error("gridRow: The columnSettings prop is null and it shouldn't be")},formatData:function e(t){return"boolean"==typeof t?String(t):t

},render:function e(){var t=this
this.verifyProps()
var n=this,o=null
this.props.useGriddleStyles&&(o={margin:"0px",padding:n.props.paddingHeight+"px 5px "+n.props.paddingHeight+"px 5px",height:n.props.rowHeight?this.props.rowHeight-2*n.props.paddingHeight+"px":null,backgroundColor:"#FFF",
borderTopColor:"#DDD",color:"#222"})
var c=this.props.columnSettings.getColumns(),f=a(c,[]),h=l({},this.props.data)
u(h,f)
var m=p(i.pick(h,d(c,"children"))),g=m.map(function(e,n){var i=null,s=t.props.columnSettings.getColumnMetadataByName(e[0]),a=0===n&&t.props.hasChildren&&t.props.showChildren===!1&&t.props.useGriddleIcons?r.createElement("span",{
style:t.props.useGriddleStyles?{fontSize:"10px",marginRight:"5px"}:null},t.props.parentRowCollapsedComponent):0===n&&t.props.hasChildren&&t.props.showChildren&&t.props.useGriddleIcons?r.createElement("span",{
style:t.props.useGriddleStyles?{fontSize:"10px"}:null},t.props.parentRowExpandedComponent):""
if(0===n&&t.props.isChildRow&&t.props.useGriddleStyles&&(o=l(o,{paddingLeft:10})),t.props.columnSettings.hasColumnMetadata()&&"undefined"!=typeof s&&null!==s)if("undefined"!=typeof s.customComponent&&null!==s.customComponent){
var u=r.createElement(s.customComponent,{data:e[1],rowData:h,metadata:s})
i=r.createElement("td",{onClick:t.handleClick,className:s.cssClassName,key:n,style:o},u)}else i=r.createElement("td",{onClick:t.handleClick,className:s.cssClassName,key:n,style:o},a,t.formatData(e[1]))


return i||r.createElement("td",{onClick:t.handleClick,key:n,style:o},a,e[1])}),y,v
if(null!==this.props.onRowClick&&s(this.props.onRowClick)?(y=null,v=this.handleSelectClick):this.props.multipleSelectionSettings&&this.props.multipleSelectionSettings.isMultipleSelection?(y=this.handleSelectClick,
v=null):(y=null,v=null),g&&this.props.multipleSelectionSettings&&this.props.multipleSelectionSettings.isMultipleSelection){var b=this.props.multipleSelectionSettings.getSelectedRowIds()
g.unshift(r.createElement("td",{key:"selection",style:o,className:"griddle-select griddle-select-cell",onClick:v},r.createElement("input",{type:"checkbox",checked:this.props.multipleSelectionSettings.getIsRowChecked(h),
onChange:this.handleSelectionChange,ref:"selected"})))}var C=n.props.rowSettings&&n.props.rowSettings.getBodyRowMetadataClass(n.props.data)||"standard-row"
return n.props.isChildRow?C="child-row":n.props.hasChildren&&(C=n.props.showChildren?this.props.parentRowExpandedClassName:this.props.parentRowCollapsedClassName),r.createElement("tr",{onClick:y,className:C
},g)}})
e.exports=c},function(e,t,n){"use strict"
function r(e){for(var t=/\[("|')(.+)\1\]|([^.\[\]]+)/g,n=[],r;null!==(r=t.exec(e));)n.push(r[2]||r[3])
return n}function o(e,t){if("string"==typeof t){if(void 0!==e[t])return e[t]
t=r(t)}for(var n=-1,o=t.length;++n<o&&null!=e;)e=e[t[n]]
return n===o?e:void 0}function i(e,t){var n={},r=e,i
i=function(e,t){return e in t},r=Object(r)
for(var s=0,a=t.length;s<a;s++){var l=t[s]
i(l,r)&&(n[l]=o(r,l))}return n}function s(e,t){var n=[]
return u(e,function(e,r){var o=t?t+"."+r:r
!p(e)||d(e)||c(e)||e instanceof Date?n.push(o):n=n.concat(s(e,o))}),n}function a(e,t){d(e)?u(e,function(e){a(e,t)}):f(e)?h(e,function(e){a(e,t)}):t(e)}function l(e){var t=[]
return a(e,function(e){t.push(e)}),t}var u=n(217),p=n(67),d=n(103),c=n(60),f=n(220),h=n(222)
e.exports={pick:i,getAt:o,keys:s,getObjectValues:l}},function(e,t,n){function r(e,t){var n=a(e)?o:i
return n(e,s(t))}var o=n(218),i=n(154),s=n(219),a=n(103)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&t(e[n],n,e)!==!1;);return e}e.exports=n},function(e,t,n){function r(e){return"function"==typeof e?e:o}var o=n(149)
e.exports=r},function(e,t,n){function r(e){if(!s(e)||o(e)!=a)return!1
var t=i(e)
if(null===t)return!0
var n=d.call(t,"constructor")&&t.constructor
return"function"==typeof n&&n instanceof n&&p.call(n)==c}var o=n(61),i=n(221),s=n(112),a="[object Object]",l=Function.prototype,u=Object.prototype,p=l.toString,d=u.hasOwnProperty,c=p.call(Object)
e.exports=r},function(e,t,n){var r=n(124),o=r(Object.getPrototypeOf,Object)
e.exports=o},function(e,t,n){function r(e,t){return e&&o(e,i(t))}var o=n(155),i=n(219)
e.exports=r},function(e,t,n){function r(e,t){return i(e||[],t||[],o)}var o=n(193),i=n(224)
e.exports=r},function(e,t){function n(e,t,n){for(var r=-1,o=e.length,i=t.length,s={};++r<o;){var a=r<i?t[r]:void 0
n(s,e[r],a)}return s}e.exports=n},function(e,t,n){var r=n(177),o=n(226),i=n(175),s=n(230),a=i(function(e){return e.push(void 0,s),r(o,void 0,e)})
e.exports=a},function(e,t,n){var r=n(195),o=n(196),i=n(227),s=o(function(e,t,n,o){r(t,i(t),e,o)})
e.exports=s},function(e,t,n){function r(e){return s(e)?o(e,!0):i(e)}var o=n(108),i=n(228),s=n(125)
e.exports=r},function(e,t,n){function r(e){if(!o(e))return s(e)
var t=i(e),n=[]
for(var r in e)("constructor"!=r||!t&&l.call(e,r))&&n.push(r)
return n}var o=n(67),i=n(122),s=n(229),a=Object.prototype,l=a.hasOwnProperty
e.exports=r},function(e,t){function n(e){var t=[]
if(null!=e)for(var n in Object(e))t.push(n)
return t}e.exports=n},function(e,t,n){function r(e,t,n,r){return void 0===e||o(e,i[n])&&!s.call(r,n)?t:e}var o=n(48),i=Object.prototype,s=i.hasOwnProperty
e.exports=r},function(e,t,n){var r=n(232),o=n(107),i=r(o)
e.exports=i},function(e,t,n){function r(e){return function(t){var n=i(t)
return n==l?s(t):n==u?a(t):o(t,e(t))}}var o=n(233),i=n(126),s=n(97),a=n(234),l="[object Map]",u="[object Set]"
e.exports=r},function(e,t,n){function r(e,t){return o(t,function(t){return[t,e[t]]})}var o=n(39)
e.exports=r},function(e,t){function n(e){var t=-1,n=Array(e.size)
return e.forEach(function(e){n[++t]=[e,e]}),n}e.exports=n},function(e,t,n){"use strict"
var r=n(4),o=r.createClass({displayName:"CustomRowComponentContainer",getDefaultProps:function e(){return{data:[],metadataColumns:[],className:"",customComponent:{},globalData:{}}},render:function e(){
var t=this
if("function"!=typeof t.props.customComponent)return console.log("Couldn't find valid template."),r.createElement("div",{className:this.props.className})
var n=this.props.data.map(function(e,n){return r.createElement(t.props.customComponent,{data:e,metadataColumns:t.props.metadataColumns,key:n,globalData:t.props.globalData})}),o=this.props.showPager&&this.props.pagingContent


return r.createElement("div",{className:this.props.className,style:this.props.style},n)}})
e.exports=o},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(4),i=o.createClass({displayName:"CustomPaginationContainer",getDefaultProps:function e(){return{maxPage:0,nextText:"",
previousText:"",currentPage:0,customPagerComponent:{},customPagerComponentOptions:{}}},render:function e(){var t=this
return"function"!=typeof t.props.customPagerComponent?(console.log("Couldn't find valid template."),o.createElement("div",null)):o.createElement(t.props.customPagerComponent,r({},this.props.customPagerComponentOptions,{
maxPage:this.props.maxPage,nextText:this.props.nextText,previousText:this.props.previousText,currentPage:this.props.currentPage,setPage:this.props.setPage,previous:this.props.previous,next:this.props.next
}))}})
e.exports=i},function(e,t,n){"use strict"
var r=n(4),o=r.createClass({displayName:"CustomFilterContainer",getDefaultProps:function e(){return{placeholderText:""}},render:function e(){var t=this
return"function"!=typeof t.props.customFilterComponent?(console.log("Couldn't find valid template."),r.createElement("div",null)):r.createElement(t.props.customFilterComponent,{changeFilter:this.props.changeFilter,
results:this.props.results,currentResults:this.props.currentResults,placeholderText:this.props.placeholderText})}})
e.exports=o},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
return r?(t=n||void 0===t?1:i(t),o(e,t<0?0:t,r)):[]}var o=n(239),i=n(165)
e.exports=r},function(e,t){function n(e,t,n){var r=-1,o=e.length
t<0&&(t=-t>o?0:o+t),n=n>o?o:n,n<0&&(n+=o),o=t>n?0:n-t>>>0,t>>>=0
for(var i=Array(o);++r<o;)i[r]=e[r+t]
return i}e.exports=n},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
return r?(t=n||void 0===t?1:i(t),t=r-t,o(e,0,t<0?0:t)):[]}var o=n(239),i=n(165)
e.exports=r},function(e,t,n){function r(e,t,n){return e&&e.length?(t=n||void 0===t?1:i(t),o(e,0,t<0?0:t)):[]}var o=n(239),i=n(165)
e.exports=r},function(e,t,n){function r(e){var t=null==e?0:e.length
return t?o(e,0,-1):[]}var o=n(239)
e.exports=r},function(e,t,n){var r=n(39),o=n(244),i=n(175),s=n(245),a=i(function(e){var t=r(e,s)
return t.length&&t[0]===e[0]?o(t):[]})
e.exports=a},function(e,t,n){function r(e,t,n){for(var r=n?s:i,d=e[0].length,c=e.length,f=c,h=Array(c),m=1/0,g=[];f--;){var y=e[f]
f&&t&&(y=a(y,l(t))),m=p(y.length,m),h[f]=!n&&(t||d>=120&&y.length>=120)?new o(f&&y):void 0}y=e[0]
var v=-1,b=h[0]
e:for(;++v<d&&g.length<m;){var C=y[v],E=t?t(C):C
if(C=n||0!==C?C:0,!(b?u(b,E):r(g,E,n))){for(f=c;--f;){var S=h[f]
if(!(S?u(S,E):r(e[f],E,n)))continue e}b&&b.push(E),g.push(C)}}return g}var o=n(90),i=n(186),s=n(190),a=n(39),l=n(119),u=n(94),p=Math.min
e.exports=r},function(e,t,n){function r(e){return o(e)?e:[]}var o=n(191)
e.exports=r},function(e,t,n){function r(e){if(null==e)return!0
if(l(e)&&(a(e)||"string"==typeof e||"function"==typeof e.splice||u(e)||d(e)||s(e)))return!e.length
var t=i(e)
if(t==c||t==f)return!e.size
if(p(e))return!o(e).length
for(var n in e)if(m.call(e,n))return!1
return!0}var o=n(121),i=n(126),s=n(110),a=n(103),l=n(125),u=n(113),p=n(122),d=n(116),c="[object Map]",f="[object Set]",h=Object.prototype,m=h.hasOwnProperty
e.exports=r},function(e,t){function n(e){return null===e}e.exports=n},function(e,t){function n(e){return void 0===e}e.exports=n},function(e,t,n){var r=n(39),o=n(250),i=n(273),s=n(137),a=n(195),l=n(276),u=n(202),p=n(258),d=1,c=2,f=4,h=u(function(e,t){
var n={}
if(null==e)return n
var u=!1
t=r(t,function(t){return t=s(t,e),u||(u=t.length>1),t}),a(e,p(e),n),u&&(n=o(n,d|c|f,l))
for(var h=t.length;h--;)i(n,t[h])
return n})
e.exports=h},function(e,t,n){function r(e,t,n,x,I,T){var A,D=t&_,N=t&w,U=t&F
if(n&&(A=I?n(e,x,I,T):n(e)),void 0!==A)return A
if(!E(e))return e
var L=b(e)
if(L){if(A=g(e),!D)return p(e,A)}else{var M=m(e),j=M==O||M==k
if(C(e))return u(e,D)
if(M==R||M==P||j&&!I){if(A=N||j?{}:v(e),!D)return N?c(e,l(A,e)):d(e,a(A,e))}else{if(!Z[M])return I?e:{}
A=y(e,M,r,D)}}T||(T=new o)
var q=T.get(e)
if(q)return q
T.set(e,A)
var B=U?N?h:f:N?keysIn:S,H=L?void 0:B(e)
return i(H||e,function(o,i){H&&(i=o,o=e[i]),s(A,i,r(o,t,n,i,e,T))}),A}var o=n(43),i=n(218),s=n(193),a=n(251),l=n(252),u=n(253),p=n(254),d=n(255),c=n(256),f=n(100),h=n(258),m=n(126),g=n(259),y=n(260),v=n(271),b=n(103),C=n(113),E=n(67),S=n(107),_=1,w=2,F=4,P="[object Arguments]",x="[object Array]",I="[object Boolean]",T="[object Date]",A="[object Error]",O="[object Function]",k="[object GeneratorFunction]",D="[object Map]",N="[object Number]",R="[object Object]",U="[object RegExp]",L="[object Set]",M="[object String]",j="[object Symbol]",q="[object WeakMap]",B="[object ArrayBuffer]",H="[object DataView]",z="[object Float32Array]",G="[object Float64Array]",V="[object Int8Array]",Q="[object Int16Array]",W="[object Int32Array]",$="[object Uint8Array]",K="[object Uint8ClampedArray]",Y="[object Uint16Array]",X="[object Uint32Array]",Z={}


Z[P]=Z[x]=Z[B]=Z[H]=Z[I]=Z[T]=Z[z]=Z[G]=Z[V]=Z[Q]=Z[W]=Z[D]=Z[N]=Z[R]=Z[U]=Z[L]=Z[M]=Z[j]=Z[$]=Z[K]=Z[Y]=Z[X]=!0,Z[A]=Z[O]=Z[q]=!1,e.exports=r},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(195),i=n(107)


e.exports=r},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(195),i=n(227)
e.exports=r},function(e,t,n){(function(e){function r(e,t){if(t)return e.slice()
var n=e.length,r=u?u(n):new e.constructor(n)
return e.copy(r),r}var o=n(63),i="object"==typeof t&&t&&!t.nodeType&&t,s=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=s&&s.exports===i,l=a?o.Buffer:void 0,u=l?l.allocUnsafe:void 0
e.exports=r}).call(t,n(28)(e))},function(e,t){function n(e,t){var n=-1,r=e.length
for(t||(t=Array(r));++n<r;)t[n]=e[n]
return t}e.exports=n},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(195),i=n(104)
e.exports=r},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(195),i=n(257)
e.exports=r},function(e,t,n){var r=n(102),o=n(221),i=n(104),s=n(106),a=Object.getOwnPropertySymbols,l=a?function(e){for(var t=[];e;)r(t,i(e)),e=o(e)
return t}:s
e.exports=l},function(e,t,n){function r(e){return o(e,s,i)}var o=n(101),i=n(257),s=n(227)
e.exports=r},function(e,t){function n(e){var t=e.length,n=e.constructor(t)
return t&&"string"==typeof e[0]&&o.call(e,"index")&&(n.index=e.index,n.input=e.input),n}var r=Object.prototype,o=r.hasOwnProperty
e.exports=n},function(e,t,n){function r(e,t,n,r){var A=e.constructor
switch(t){case b:return o(e)
case d:case c:return new A(+e)
case C:return i(e,r)
case E:case S:case _:case w:case F:case P:case x:case I:case T:return p(e,r)
case f:return s(e,r,n)
case h:case y:return new A(e)
case m:return a(e)
case g:return l(e,r,n)
case v:return u(e)}}var o=n(261),i=n(262),s=n(263),a=n(266),l=n(267),u=n(269),p=n(270),d="[object Boolean]",c="[object Date]",f="[object Map]",h="[object Number]",m="[object RegExp]",g="[object Set]",y="[object String]",v="[object Symbol]",b="[object ArrayBuffer]",C="[object DataView]",E="[object Float32Array]",S="[object Float64Array]",_="[object Int8Array]",w="[object Int16Array]",F="[object Int32Array]",P="[object Uint8Array]",x="[object Uint8ClampedArray]",I="[object Uint16Array]",T="[object Uint32Array]"


e.exports=r},function(e,t,n){function r(e){var t=new e.constructor(e.byteLength)
return new o(t).set(new o(e)),t}var o=n(96)
e.exports=r},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer
return new e.constructor(n,e.byteOffset,e.byteLength)}var o=n(261)
e.exports=r},function(e,t,n){function r(e,t,n){var r=t?n(s(e),a):s(e)
return i(r,o,new e.constructor)}var o=n(264),i=n(265),s=n(97),a=1
e.exports=r},function(e,t){function n(e,t){return e.set(t[0],t[1]),e}e.exports=n},function(e,t){function n(e,t,n,r){var o=-1,i=null==e?0:e.length
for(r&&i&&(n=e[++o]);++o<i;)n=t(n,e[o],o,e)
return n}e.exports=n},function(e,t){function n(e){var t=new e.constructor(e.source,r.exec(e))
return t.lastIndex=e.lastIndex,t}var r=/\w*$/
e.exports=n},function(e,t,n){function r(e,t,n){var r=t?n(s(e),a):s(e)
return i(r,o,new e.constructor)}var o=n(268),i=n(265),s=n(98),a=1
e.exports=r},function(e,t){function n(e,t){return e.add(t),e}e.exports=n},function(e,t,n){function r(e){return s?Object(s.call(e)):{}}var o=n(62),i=o?o.prototype:void 0,s=i?i.valueOf:void 0
e.exports=r},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer
return new e.constructor(n,e.byteOffset,e.length)}var o=n(261)
e.exports=r},function(e,t,n){function r(e){return"function"!=typeof e.constructor||s(e)?{}:o(i(e))}var o=n(272),i=n(221),s=n(122)
e.exports=r},function(e,t,n){var r=n(67),o=Object.create,i=function(){function e(){}return function(t){if(!r(t))return{}
if(o)return o(t)
e.prototype=t
var n=new e
return e.prototype=void 0,n}}()
e.exports=i},function(e,t,n){function r(e,t){return t=o(t,e),e=s(e,t),null==e||delete e[a(i(t))]}var o=n(137),i=n(274),s=n(275),a=n(145)
e.exports=r},function(e,t){function n(e){var t=null==e?0:e.length
return t?e[t-1]:void 0}e.exports=n},function(e,t,n){function r(e,t){return t.length<2?e:o(e,i(t,0,-1))}var o=n(136),i=n(239)
e.exports=r},function(e,t,n){function r(e){return o(e)?void 0:e}var o=n(220)
e.exports=r},function(e,t,n){function r(e,t,n,r){return null==e?[]:(i(t)||(t=null==t?[]:[t]),n=r?void 0:n,i(n)||(n=null==n?[]:[n]),o(e,t,n))}var o=n(171),i=n(103)
e.exports=r},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&s.return&&s.return()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(4),p=r(u),d=n(34),c=r(d),f=n(3),h=r(f),m=n(21),g=n(29),y=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.getColumns=n.getColumns.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handleRowClick=n.handleRowClick.bind(n),n.renderSelect=n.renderSelect.bind(n),n.renderTitle=n.renderTitle.bind(n),
n.renderNoItemsNotice=n.renderNoItemsNotice.bind(n),n.state={enableSort:!1},n}return s(t,e),l(t,[{key:"componentDidMount",value:function e(){this.setState({enableSort:!0})}},{key:"componentWillUnmount",
value:function e(){this.setState({enableSort:!1})}},{key:"getColumns",value:function e(){var t=["thumbnail","title","size","lastEdited"]
return this.props.selectableItems&&t.unshift("selected"),t}},{key:"getColumnConfig",value:function e(){return[{columnName:"selected",sortable:!1,displayName:"",cssClassName:"gallery__table-column--select",
customComponent:this.renderSelect},{columnName:"thumbnail",sortable:!1,displayName:"",cssClassName:"gallery__table-column--image",customComponent:this.renderThumbnail},{columnName:"title",customCompareFn:function e(){
return 0},cssClassName:"gallery__table-column--title",customComponent:this.renderTitle},{columnName:"lastEdited",displayName:"Modified",customComponent:this.renderDate},{columnName:"size",sortable:!1,displayName:"Size",
customComponent:this.renderSize}]}},{key:"getTableProps",value:function e(){var t=this.props.sort.split(","),n=a(t,2),r=n[0],o=n[1]
return{tableClassName:"gallery__table table table-hover",gridClassName:"gallery__main-view--table",rowMetadata:{bodyCssClassName:"gallery__table-row"},sortAscendingComponent:"",sortDescendingComponent:"",
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

}},{key:"renderThumbnail",value:function e(t){var n=t.data||t.rowData.url
return"folder"===t.rowData.type?p.default.createElement("div",{className:"gallery__table-image--folder"}):n?p.default.createElement("img",{src:n,alt:t.rowData.title,className:"gallery__table-image"}):p.default.createElement("div",{
className:"gallery__table-image--error"})}},{key:"render",value:function e(){return p.default.createElement(c.default,this.getTableProps())}}]),t}(u.Component)
y.defaultProps=m.galleryViewDefaultProps,y.propTypes=m.galleryViewPropTypes,t.default=y},function(e,t){e.exports=FormAlert},function(e,t){e.exports=ReactApollo},function(e,t){e.exports=GraphQLTag},function(e,t){
e.exports=Breadcrumb},function(e,t){e.exports=Toolbar},function(e,t,n){"use strict"
function r(e,t){if(void 0===e&&(e={}),s.isQueryInitAction(t)){var n=i({},e),r=e[t.queryId]
if(r&&r.queryString!==t.queryString)throw new Error("Internal Error: may not update existing query string in store")
var p=!1,d=void 0
t.storePreviousVariables&&r&&r.networkStatus!==u.loading&&(l(r.variables,t.variables)||(p=!0,d=r.variables))
var c=u.loading
return p?c=u.setVariables:t.isPoll?c=u.poll:t.isRefetch?c=u.refetch:t.isPoll&&(c=u.poll),n[t.queryId]={queryString:t.queryString,variables:t.variables,previousVariables:d,loading:!0,networkError:null,graphQLErrors:null,
networkStatus:c,forceFetch:t.forceFetch,returnPartialData:t.returnPartialData,lastRequestId:t.requestId,metadata:t.metadata},n}if(s.isQueryResultAction(t)){if(!e[t.queryId])return e
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
for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},s=n(285),a=n(286),l=n(287),u
!function(e){e[e.loading=1]="loading",e[e.setVariables=2]="setVariables",e[e.fetchMore=3]="fetchMore",e[e.refetch=4]="refetch",e[e.poll=6]="poll",e[e.ready=7]="ready",e[e.error=8]="error"}(u=t.NetworkStatus||(t.NetworkStatus={})),
t.queries=r},function(e,t){"use strict"
function n(e){return"APOLLO_QUERY_RESULT"===e.type}function r(e){return"APOLLO_QUERY_ERROR"===e.type}function o(e){return"APOLLO_QUERY_INIT"===e.type}function i(e){return"APOLLO_QUERY_RESULT_CLIENT"===e.type

}function s(e){return"APOLLO_QUERY_STOP"===e.type}function a(e){return"APOLLO_MUTATION_INIT"===e.type}function l(e){return"APOLLO_MUTATION_RESULT"===e.type}function u(e){return"APOLLO_MUTATION_ERROR"===e.type

}function p(e){return"APOLLO_UPDATE_QUERY_RESULT"===e.type}function d(e){return"APOLLO_STORE_RESET"===e.type}function c(e){return"APOLLO_SUBSCRIPTION_RESULT"===e.type}t.isQueryResultAction=n,t.isQueryErrorAction=r,
t.isQueryInitAction=o,t.isQueryResultClientAction=i,t.isQueryStopAction=s,t.isMutationInitAction=a,t.isMutationResultAction=l,t.isMutationErrorAction=u,t.isUpdateQueryResultAction=p,t.isStoreResetAction=d,
t.isSubscriptionResultAction=c},function(e,t,n){"use strict"
function r(e){return"StringValue"===e.kind}function o(e){return"BooleanValue"===e.kind}function i(e){return"IntValue"===e.kind}function s(e){return"FloatValue"===e.kind}function a(e){return"Variable"===e.kind

}function l(e){return"ObjectValue"===e.kind}function u(e){return"ListValue"===e.kind}function p(e){return"EnumValue"===e.kind}function d(e,t,n,c){if(i(n)||s(n))e[t.value]=Number(n.value)
else if(o(n)||r(n))e[t.value]=n.value
else if(l(n)){var f={}
n.fields.map(function(e){return d(f,e.name,e.value,c)}),e[t.value]=f}else if(a(n)){if(!(c&&n.name.value in c))throw new Error('The inline argument "'+n.name.value+'" is expected as a variable but was not provided.')


var h=c[n.name.value]
e[t.value]=h}else if(u(n))e[t.value]=n.values.map(function(e){var n={}
return d(n,t,e,c),n[t.value]})
else{if(!p(n))throw new Error('The inline argument "'+t.value+'" of kind "'+n.kind+'" is not supported.\n                    Use variables instead of inline arguments to overcome this limitation.')
e[t.value]=n.value}}function c(e,t){if(e.arguments&&e.arguments.length){var n={}
return e.arguments.forEach(function(e){var r=e.name,o=e.value
return d(n,r,o,t)}),f(e.name.value,n)}return e.name.value}function f(e,t){if(t){var n=JSON.stringify(t)
return e+"("+n+")"}return e}function h(e){return e.alias?e.alias.value:e.name.value}function m(e){return"Field"===e.kind}function g(e){return"InlineFragment"===e.kind}function y(e){return e.errors&&e.errors.length

}function v(e){return E(e)&&"id"===e.type}function b(e,t){return void 0===t&&(t=!1),{type:"id",id:e,generated:t}}function C(e){return E(e)&&"json"===e.type}var E=n(67)
t.storeKeyNameFromField=c,t.storeKeyNameFromFieldNameAndArgs=f,t.resultKeyNameFromField=h,t.isField=m,t.isInlineFragment=g,t.graphQLResultHasError=y,t.isIdValue=v,t.toIdValue=b,t.isJsonValue=C},function(e,t,n){
function r(e,t){return o(e,t)}var o=n(87)
e.exports=r},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e){return e&&Object.keys(e).length>0

}function u(e,t){var n={},r=e.form[t.searchFormSchemaUrl]
return r&&r.values&&(n=r.values),{formData:n}}function p(e){return{actions:{schema:(0,b.bindActionCreators)(P,e),reduxForm:(0,b.bindActionCreators)({reset:x.reset,initialize:x.initialize},e)}}}Object.defineProperty(t,"__esModule",{
value:!0})
var d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()
t.hasFilters=l
var c=n(3),f=o(c),h=n(4),m=o(h),g=n(6),y=n(23),v=o(y),b=n(5),C=n(10),E=o(C),S=n(19),_=o(S),w=n(289),F=n(290),P=r(F),x=n(291),I={NONE:"NONE",VISIBLE:"VISIBLE",EXPANDED:"EXPANDED"},T=function(e){function t(e){
i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.expand=n.expand.bind(n),n.handleClick=n.handleClick.bind(n),n.handleKeyUp=n.handleKeyUp.bind(n),n.handleChange=n.handleChange.bind(n),n.doSearch=n.doSearch.bind(n),n.focusInput=n.focusInput.bind(n),
n.focusFirstFormField=n.focusFirstFormField.bind(n),n.hide=n.hide.bind(n),n.show=n.show.bind(n),n.toggle=n.toggle.bind(n),n.open=n.open.bind(n),n.state={view:I.NONE,searchText:n.props.filters&&n.props.filters.name||""
},n}return a(t,e),d(t,[{key:"componentWillMount",value:function e(){document.addEventListener("click",this.handleClick,!1),this.setOverrides(this.props)}},{key:"componentWillUnmount",value:function e(){
document.removeEventListener("click",this.handleClick,!1),this.setOverrides()}},{key:"componentWillReceiveProps",value:function e(t){t&&!l(t.filters)&&l(this.props.filters)?this.clearFormData(t):JSON.stringify(t.filters)!==JSON.stringify(this.props.filters)&&this.setOverrides(t)

}},{key:"focusInput",value:function e(){if(this.state.view!==I.NONE){var t=v.default.findDOMNode(this.refs.contentInput)
t!==document.activeElement&&(t.focus(),t.select())}}},{key:"focusFirstFormField",value:function e(){if(this.state.view===I.EXPANDED){var t=v.default.findDOMNode(this.refs.contentForm),n=t&&t.querySelector("input, textarea, select")


n&&(n.focus(),n.select&&n.select())}}},{key:"clearFormData",value:function e(t){this.setState({searchText:""})
var n=t&&t.searchFormSchemaUrl||this.props.searchFormSchemaUrl
n&&(this.props.actions.reduxForm.initialize(n,{},Object.keys(this.props.formData)),this.props.actions.reduxForm.reset(n),this.props.actions.schema.setSchemaStateOverrides(n,null))}},{key:"setOverrides",
value:function e(t){var n=this
if(t&&(!l(t.filters)||this.props.searchFormSchemaUrl!==t.searchFormSchemaUrl)){var r=t&&t.searchFormSchemaUrl||this.props.searchFormSchemaUrl
r&&this.props.actions.schema.setSchemaStateOverrides(r,null)}t&&l(t.filters)&&t.searchFormSchemaUrl&&!function(){var e=t.filters||{},r={fields:Object.keys(e).map(function(t){var n=e[t]
return{name:t,value:n}})}
n.props.actions.schema.setSchemaStateOverrides(t.searchFormSchemaUrl,r)}()}},{key:"handleClick",value:function e(t){var n=v.default.findDOMNode(this)
n&&!n.contains(t.target)&&this.hide()}},{key:"handleChange",value:function e(t){this.setState({searchText:t.target.value})}},{key:"handleKeyUp",value:function e(t){13===t.keyCode&&this.doSearch()}},{key:"open",
value:function e(){this.show(),setTimeout(this.focusInput,50)}},{key:"hide",value:function e(){this.setState({view:I.NONE})}},{key:"show",value:function e(){this.setState({view:I.VISIBLE})}},{key:"expand",
value:function e(){this.setState({view:I.EXPANDED})}},{key:"toggle",value:function e(){switch(this.state.view){case I.VISIBLE:this.expand(),setTimeout(this.focusFirstFormField,50)
break
case I.EXPANDED:this.show()}}},{key:"doSearch",value:function e(){var t=this,n={}
this.state.searchText&&(n.name=this.state.searchText),Object.keys(this.props.formData).forEach(function(e){var r=t.props.formData[e]
r&&(n[e]=r)}),this.props.onSearch(n)}},{key:"render",value:function e(){var t=this.props.id+"_ExtraFields",n=this.props.id+"_Trigger",r=this.state.searchText,o=["search","flexbox-area-grow"],i=["btn","btn-secondary","btn--icon-md","btn--no-text","font-icon-down-open","search__filter-trigger"],s=!1


switch(this.state.view){case I.EXPANDED:s=!0,o.push("search--active")
break
case I.VISIBLE:i.push("collapsed"),o.push("search--active")
break
case I.NONE:i.push("collapsed")}return m.default.createElement("div",{className:o.join(" ")},m.default.createElement("button",{className:"btn btn--no-text btn-secondary font-icon-search btn--icon-large search__trigger",
type:"button",title:f.default._t("AssetAdmin.SEARCH","Search"),"aria-owns":this.props.id,"aria-controls":this.props.id,"aria-expanded":"false",onClick:this.open,id:n}),m.default.createElement("div",{id:this.props.id,
className:"search__group"},m.default.createElement("input",{"aria-labelledby":n,type:"text",name:"name",ref:"contentInput",placeholder:f.default._t("AssetAdmin.SEARCH","Search"),className:"form-control search__content-field",
onKeyUp:this.handleKeyUp,onChange:this.handleChange,value:r,autoFocus:!0}),m.default.createElement("button",{"aria-expanded":s,"aria-controls":t,onClick:this.toggle,className:i.join(" "),title:f.default._t("AssetAdmin.ADVANCED","Advanced")
},m.default.createElement("span",{className:"search__filter-trigger-text"},f.default._t("AssetAdmin.ADVANCED","Advanced"))),m.default.createElement("button",{className:"btn btn-primary search__submit font-icon-search btn--icon-large btn--no-text",
title:f.default._t("AssetAdmin.SEARCH","Search"),onClick:this.doSearch}),m.default.createElement("button",{onClick:this.hide,title:f.default._t("AssetAdmin.CLOSE","Close"),className:"btn font-icon-cancel btn--no-text btn--icon-md search__cancel",
"aria-controls":this.props.id,"aria-expanded":"true"}),m.default.createElement(w.Collapse,{in:s},m.default.createElement("div",{id:t,className:"search__filter-panel",ref:"contentForm"},m.default.createElement(_.default,{
schemaUrl:this.props.searchFormSchemaUrl})))))}}]),t}(E.default)
T.propTypes={searchFormSchemaUrl:h.PropTypes.string.isRequired,id:h.PropTypes.string.isRequired,data:h.PropTypes.object,folderId:h.PropTypes.number,onSearch:h.PropTypes.func.isRequired,filters:h.PropTypes.object,
formData:h.PropTypes.object},t.default=(0,g.connect)(u,p)(T)},function(e,t){e.exports=ReactBootstrap},function(e,t){e.exports=SchemaActions},function(e,t){e.exports=ReduxForm},function(e,t){e.exports=qs

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}var o=n(5),i=n(294),s=r(i),a=n(295),l=r(a),u=n(296),p=r(u),d=n(297),c=r(d),f=n(299),h=r(f),m=n(7),g=r(m),y=n(301),v=r(y),b=n(303),C=r(b),E=n(305),S=r(E),_=n(306),w=r(_),F=n(311),P=r(F),x=n(313),I=r(x)


document.addEventListener("DOMContentLoaded",function(){S.default.register("UploadField",w.default),S.default.register("PreviewImageField",P.default),S.default.register("HistoryList",I.default)
var e=s.default.getSection("SilverStripe\\AssetAdmin\\Controller\\AssetAdmin")
l.default.add({path:e.url,component:g.default,indexRoute:{component:g.default},childRoutes:[{path:"show/:folderId/edit/:fileId",component:g.default},{path:"show/:folderId",component:g.default}]}),p.default.add("assetAdmin",(0,
o.combineReducers)({gallery:c.default,queuedFiles:h.default,uploadField:v.default,previewField:C.default}))})},function(e,t){e.exports=Config},function(e,t){e.exports=ReactRouteRegister},function(e,t){
e.exports=ReducerRegister},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d,t=arguments[1]
switch(t.type){case p.default.SET_NOTICE_MESSAGE:return s({},e,{noticeMessage:t.payload.message})
case p.default.SET_ERROR_MESSAGE:return s({},e,{errorMessage:t.payload.message})
case p.default.LOAD_FILE_SUCCESS:var n=e.files.find(function(e){return e.id===t.payload.id})
if(n){var r=function(){var r=s({},n,t.payload.file)
return{v:(0,l.default)(s({},e,{files:e.files.map(function(e){return e.id===r.id?r:e})}))}}()
if("object"===("undefined"==typeof r?"undefined":i(r)))return r.v}else if(e.folder.id===t.payload.id)return(0,l.default)(s({},e,{folder:s({},e.folder,t.payload.file)}))
return e
case p.default.SELECT_FILES:var o=null
return o=null===t.payload.ids?e.files.map(function(e){return e.id}):e.selectedFiles.concat(t.payload.ids.filter(function(t){return e.selectedFiles.indexOf(t)===-1})),(0,l.default)(s({},e,{selectedFiles:o
}))
case p.default.DESELECT_FILES:var a=null
return a=null===t.payload.ids?[]:e.selectedFiles.filter(function(e){return t.payload.ids.indexOf(e)===-1}),(0,l.default)(s({},e,{selectedFiles:a}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e

},s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}
t.default=o
var a=n(298),l=r(a),u=n(13),p=r(u),d={editorFields:[],file:null,files:[],focus:!1,path:null,selectedFiles:[],page:0,errorMessage:null}},function(e,t){e.exports=DeepFreezeStrict},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{default:e}}function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:h,t=arguments[1]
switch(t.type){case u.default.ADD_QUEUED_FILE:return(0,a.default)(i({},e,{items:e.items.concat([i({},d.default,t.payload.file)])}))
case u.default.FAIL_UPLOAD:return(0,a.default)(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,{message:t.payload.message}):e})}))
case u.default.PURGE_UPLOAD_QUEUE:return(0,a.default)(i({},e,{items:e.items.filter(function(e){return!e.id})}))
case u.default.REMOVE_QUEUED_FILE:return(0,a.default)(i({},e,{items:e.items.filter(function(e){return e.queuedId!==t.payload.queuedId})}))
case u.default.SUCCEED_UPLOAD:return(0,a.default)(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,t.payload.json,{messages:[{value:f.default._t("AssetAdmin.DROPZONE_SUCCESS_UPLOAD"),
type:"success",extraClass:"success"}]}):e})}))
case u.default.UPDATE_QUEUED_FILE:return(0,a.default)(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,t.payload.updates):e})}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=n(298),a=r(s),l=n(16),u=r(l),p=n(300),d=r(p),c=n(3),f=r(c),h={items:[]}
t.default=o},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(298),i=r(o),s=(0,i.default)({name:null,canDelete:!1,canEdit:!1,category:null,created:null,extension:null,filename:null,id:0,lastEdited:null,messages:null,owner:{id:0,title:null},parent:{filename:null,
id:0,title:null},queuedId:null,size:null,title:null,type:null,url:null,xhr:null,thumbnail:null,smallThumbnail:null,height:null,width:null})
t.default=s},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:h,t=arguments[1],n=function n(r){
if(!t.payload.fieldId)throw new Error("Invalid fieldId")
var o=e.fields[t.payload.fieldId]?e.fields[t.payload.fieldId]:m
return(0,u.default)(a({},e,{fields:a({},e.fields,i({},t.payload.fieldId,a({},o,r(o))))}))}
switch(t.type){case d.default.UPLOADFIELD_ADD_FILE:return n(function(e){return{files:[].concat(o(e.files),[a({},f.default,t.payload.file)])}})
case d.default.UPLOADFIELD_SET_FILES:return n(function(){return{files:t.payload.files}})
case d.default.UPLOADFIELD_UPLOAD_FAILURE:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,{message:t.payload.message}):e})}})
case d.default.UPLOADFIELD_REMOVE_FILE:return n(function(e){return{files:e.files.filter(function(e){return!(t.payload.file.queuedId&&e.queuedId===t.payload.file.queuedId||t.payload.file.id&&e.id===t.payload.file.id)

})}})
case d.default.UPLOADFIELD_UPLOAD_SUCCESS:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,t.payload.json):e})}})
case d.default.UPLOADFIELD_UPDATE_QUEUED_FILE:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,t.payload.updates):e})}})
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=n(298),u=r(l),p=n(302),d=r(p),c=n(300),f=r(c),h={fields:{}},m={files:[]}
t.default=s},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.default={UPLOADFIELD_ADD_FILE:"UPLOADFIELD_ADD_FILE",UPLOADFIELD_SET_FILES:"UPLOADFIELD_SET_FILES",UPLOADFIELD_REMOVE_FILE:"UPLOADFIELD_REMOVE_FILE",UPLOADFIELD_UPLOAD_FAILURE:"UPLOADFIELD_UPLOAD_FAILURE",
UPLOADFIELD_UPLOAD_SUCCESS:"UPLOADFIELD_UPLOAD_SUCCESS",UPLOADFIELD_UPDATE_QUEUED_FILE:"UPLOADFIELD_UPDATE_QUEUED_FILE"}},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d,t=arguments[1]


switch(t.type){case p.default.PREVIEWFIELD_ADD_FILE:return(0,l.default)(s({},e,o({},t.payload.id,t.payload.file)))
case p.default.PREVIEWFIELD_FAIL_UPLOAD:return(0,l.default)(s({},e,o({},t.payload.id,s({},e[t.payload.id],t.payload.message))))
case p.default.PREVIEWFIELD_REMOVE_FILE:return(0,l.default)(s({},e,o({},t.payload.id,void 0)))
case p.default.PREVIEWFIELD_UPDATE_FILE:return(0,l.default)(s({},e,o({},t.payload.id,s({},e[t.payload.id],t.payload.data))))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(298),l=r(a),u=n(304),p=r(u),d={}
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
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(3),f=o(c),h=n(4),m=o(h),g=n(6),y=n(5),v=n(18),b=o(v),C=n(10),E=o(C),S=n(307),_=o(S),w=n(308),F=o(w),P=n(26),x=o(P),I=n(309),T=o(I),A=n(33),O=o(A),k=n(310),D=r(k),N=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.renderChild=n.renderChild.bind(n),n.handleAddShow=n.handleAddShow.bind(n),n.handleAddHide=n.handleAddHide.bind(n),n.handleAddInsert=n.handleAddInsert.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),
n.handleSending=n.handleSending.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),
n.handleItemRemove=n.handleItemRemove.bind(n),n.handleChange=n.handleChange.bind(n),n.state={selecting:!1},n}return a(t,e),d(t,[{key:"componentDidMount",value:function e(){this.props.actions.uploadField.setFiles(this.props.id,this.props.data.files)

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
className:"uploadfield"},this.renderDropzone(),this.props.files.map(this.renderChild),this.renderDialog())}},{key:"renderDropzone",value:function e(){if(!this.props.data.createFileEndpoint)return null
var t={height:b.default.SMALL_THUMBNAIL_HEIGHT,width:b.default.SMALL_THUMBNAIL_WIDTH},n=this.props.name,r={url:this.props.data.createFileEndpoint.url,method:this.props.data.createFileEndpoint.method,paramName:"Upload",
thumbnailWidth:b.default.SMALL_THUMBNAIL_WIDTH,thumbnailHeight:b.default.SMALL_THUMBNAIL_HEIGHT}
this.props.data.multi||(r.maxFiles=1)
var o=["uploadfield__dropzone"]
this.props.files.length&&!this.props.data.multi&&o.push("uploadfield__dropzone--hidden")
var i=this.props.securityId
return m.default.createElement(x.default,{name:n,canUpload:!0,uploadButton:!1,uploadSelector:".uploadfield__upload-button, .uploadfield__backdrop",folderId:this.props.data.parentid,handleAddedFile:this.handleAddedFile,
handleError:this.handleFailedUpload,handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,preview:t,options:r,securityID:i,className:o.join(" ")
},m.default.createElement("div",{className:"uploadfield__backdrop"}),m.default.createElement("span",{className:"uploadfield__droptext"},m.default.createElement("button",{onClick:this.handleSelect,className:"uploadfield__upload-button"
},f.default._t("AssetAdminUploadField.BROWSE","Browse"))," ",f.default._t("AssetAdminUploadField.OR","or")," ",m.default.createElement("button",{onClick:this.handleAddShow,className:"uploadfield__add-button"
},f.default._t("AssetAdminUploadField.ADD_FILES","Add from files"))))}},{key:"renderDialog",value:function e(){return m.default.createElement(T.default,{title:!1,show:this.state.selecting,onInsert:this.handleAddInsert,
onHide:this.handleAddHide,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",type:"select"})}},{key:"renderChild",value:function e(t,n){var r={key:n,item:t,name:this.props.name,
handleRemove:this.handleItemRemove}
return m.default.createElement(F.default,r)}}]),t}(E.default)
N.propTypes={extraClass:m.default.PropTypes.string,id:m.default.PropTypes.string.isRequired,name:m.default.PropTypes.string.isRequired,onChange:m.default.PropTypes.func,value:m.default.PropTypes.shape({
Files:m.default.PropTypes.arrayOf(m.default.PropTypes.number)}),files:m.default.PropTypes.arrayOf(O.default),readOnly:m.default.PropTypes.bool,disabled:m.default.PropTypes.bool,data:m.default.PropTypes.shape({
createFileEndpoint:m.default.PropTypes.shape({url:m.default.PropTypes.string.isRequired,method:m.default.PropTypes.string.isRequired,payloadFormat:m.default.PropTypes.string.isRequired}),multi:m.default.PropTypes.bool,
parentid:m.default.PropTypes.number})},N.defaultProps={value:{Files:[]},extraClass:"",className:""}
var R=(0,g.connect)(l,u)(N)
t.UploadField=N,t.ConnectedUploadField=R,t.default=(0,_.default)(R)},function(e,t){e.exports=FieldHolder},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(3),u=r(l),p=n(4),d=r(p),c=n(10),f=r(c),h=n(18),m=r(h),g=n(33),y=r(g),v=n(29),b=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleRemove=n.handleRemove.bind(n),n}return s(t,e),a(t,[{key:"getThumbnailStyles",value:function e(){if(this.isImage()&&(this.exists()||this.uploading())){var t=this.props.item.smallThumbnail||this.props.item.url


return{backgroundImage:"url("+t+")"}}return{}}},{key:"hasError",value:function e(){return!!this.props.item.message&&"error"===this.props.item.message.type}},{key:"renderErrorMessage",value:function e(){
var t=null
return this.hasError()?t=this.props.item.message.value:this.exists()||this.uploading()||(t=u.default._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==t?d.default.createElement("div",{className:"uploadfield-item__error-message"
},t):null}},{key:"getThumbnailClassNames",value:function e(){var t=["uploadfield-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&t.push("uploadfield-item__thumbnail--small"),t.join(" ")}},{key:"getItemClassNames",value:function e(){var t=this.props.item.category||"none",n=["fill-width","uploadfield-item","uploadfield-item--"+t]


return this.exists()||this.uploading()||n.push("uploadfield-item--missing"),this.hasError()&&n.push("uploadfield-item--error"),n.join(" ")}},{key:"isImage",value:function e(){return"image"===this.props.item.category

}},{key:"exists",value:function e(){return this.props.item.exists}},{key:"uploading",value:function e(){return!!this.props.item.uploaded}},{key:"complete",value:function e(){return this.uploading()&&this.props.item.id>0

}},{key:"isImageSmallerThanThumbnail",value:function e(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1
var t=this.props.item.width,n=this.props.item.height
return n&&t&&n<m.default.SMALL_THUMBNAIL_HEIGHT&&t<m.default.SMALL_THUMBNAIL_WIDTH}},{key:"preventFocus",value:function e(t){t.preventDefault()}},{key:"handleRemove",value:function e(t){t.preventDefault(),
this.props.handleRemove&&this.props.handleRemove(t,this.props.item)}},{key:"renderProgressBar",value:function e(){var t={className:"uploadfield-item__progress-bar",style:{width:this.props.item.progress+"%"
}}
return!this.hasError()&&this.uploading()?this.complete()?d.default.createElement("div",{className:"uploadfield-item__complete-icon"}):d.default.createElement("div",{className:"uploadfield-item__upload-progress"
},d.default.createElement("div",t)):null}},{key:"renderRemoveButton",value:function e(){var t=["btn","uploadfield-item__remove-btn","btn-secondary","btn--no-text","font-icon-cancel","btn--icon-md"].join(" ")


return d.default.createElement("button",{className:t,onClick:this.handleRemove,ref:"backButton"})}},{key:"renderFileDetails",value:function e(){var t=""
return this.props.item.size&&(t=", "+(0,v.fileSize)(this.props.item.size)),d.default.createElement("div",{className:"uploadfield-item__details fill-width flexbox-area-grow"},d.default.createElement("span",{
className:"uploadfield-item__title",ref:"title"},this.props.item.title),d.default.createElement("span",{className:"uploadfield-item__meta"},this.props.item.extension,t))}},{key:"render",value:function e(){
var t=this.props.name+"[Files][]"
return d.default.createElement("div",{className:this.getItemClassNames()},d.default.createElement("input",{type:"hidden",value:this.props.item.id,name:t}),d.default.createElement("div",{ref:"thumbnail",
className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()}),this.renderFileDetails(),this.renderProgressBar(),this.renderErrorMessage(),this.renderRemoveButton())}}]),t}(f.default)
b.propTypes={name:d.default.PropTypes.string.isRequired,item:y.default,handleRemove:d.default.PropTypes.func},t.default=b},function(e,t){e.exports=InsertMediaModal},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return function(n){return n({type:d.default.UPLOADFIELD_ADD_FILE,payload:{fieldId:e,file:t}})}}function i(e,t){return function(n){return n({
type:d.default.UPLOADFIELD_SET_FILES,payload:{fieldId:e,files:t}})}}function s(e,t,n){return function(r){var o=n.message
return"string"==typeof n&&(o={value:n,type:"error"}),r({type:d.default.UPLOADFIELD_UPLOAD_FAILURE,payload:{fieldId:e,queuedId:t,message:o}})}}function a(e,t){return function(n){return n({type:d.default.UPLOADFIELD_REMOVE_FILE,
payload:{fieldId:e,file:t}})}}function l(e,t,n){return function(r){return r({type:d.default.UPLOADFIELD_UPLOAD_SUCCESS,payload:{fieldId:e,queuedId:t,json:n}})}}function u(e,t,n){return function(r){return r({
type:d.default.UPLOADFIELD_UPDATE_QUEUED_FILE,payload:{fieldId:e,queuedId:t,updates:n}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addFile=o,t.setFiles=i,t.failUpload=s,t.removeFile=a,t.succeedUpload=l,
t.updateQueuedFile=u
var p=n(302),d=r(p)},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=e.config.SecurityID,r=t.id,o=e.assetAdmin.previewField[r]||{}


return{securityID:n,upload:o}}function u(e){return{actions:{previewField:(0,C.bindActionCreators)(S,e)}}}Object.defineProperty(t,"__esModule",{value:!0})
var p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(3),c=o(d),f=n(4),h=o(f),m=n(26),g=o(m),y=n(18),v=o(y),b=n(6),C=n(5),E=n(312),S=r(E),_=n(29),w=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleAddedFile=n.handleAddedFile.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleSending=n.handleSending.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),
n.handleCancelUpload=n.handleCancelUpload.bind(n),n.handleRemoveErroredUpload=n.handleRemoveErroredUpload.bind(n),n.canFileUpload=n.canFileUpload.bind(n),n}return a(t,e),p(t,[{key:"componentWillReceiveProps",
value:function e(t){(this.props.data.url&&t.data.url!==this.props.data.url||this.props.data.version&&t.data.version!==this.props.data.version)&&this.props.actions.previewField.removeFile(this.props.id)

}},{key:"componentWillUnmount",value:function e(){this.props.actions.previewField.removeFile(this.props.id)}},{key:"getDropzoneProps",value:function e(){var t=this.props.data.uploadFileEndpoint,n=this.props.name,r={
url:t&&t.url,method:t&&t.method,paramName:"Upload",clickable:"#preview-replace-button",maxFiles:1},o={height:v.default.THUMBNAIL_HEIGHT,width:v.default.THUMBNAIL_WIDTH},i=this.props.securityID,s=["asset-dropzone--button","preview__container",this.props.className,this.props.extraClass]


return{name:n,className:s.join(" "),canUpload:t&&this.canEdit(),preview:o,folderId:this.props.data.parentid,options:r,securityID:i,uploadButton:!1,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,
handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,canFileUpload:this.canFileUpload}}},{key:"canEdit",value:function e(){return!this.props.readOnly&&!this.props.disabled&&"folder"!==this.props.data.category

}},{key:"preventDefault",value:function e(t){t.preventDefault()}},{key:"canFileUpload",value:function e(t){var n=this.props.data.initialValues.FileFilename,r=(0,_.getFileExtension)(n),o=(0,_.getFileExtension)(t.name)


if(!r||r===o)return!0
var i=c.default._t("AssetAdmin.CONFIRM_CHANGE_EXTENSION","Are you sure you want upload a file with a different extension?")
return this.props.confirm(i)}},{key:"handleCancelUpload",value:function e(){this.props.upload.xhr&&this.props.upload.xhr.abort(),this.handleRemoveErroredUpload()}},{key:"handleRemoveErroredUpload",value:function e(){
if("function"==typeof this.props.onAutofill){var t=this.props.data.initialValues
this.props.onAutofill("FileFilename",t.FileFilename),this.props.onAutofill("FileHash",t.FileHash),this.props.onAutofill("FileVariant",t.FileVariant)}this.props.actions.previewField.removeFile(this.props.id)

}},{key:"handleAddedFile",value:function e(t){this.props.actions.previewField.addFile(this.props.id,t)}},{key:"handleFailedUpload",value:function e(t,n){this.props.actions.previewField.failUpload(this.props.id,n)

}},{key:"handleSuccessfulUpload",value:function e(t){var n=JSON.parse(t.xhr.response)
if("function"==typeof this.props.onAutofill){this.props.onAutofill("FileFilename",n.Filename),this.props.onAutofill("FileHash",n.Hash),this.props.onAutofill("FileVariant",n.Variant)
var r=(0,_.getFileExtension)(this.props.data.url),o=(0,_.getFileExtension)(n.Filename)
r!==o&&this.props.onAutofill(this.props.data.nameField,n.Name)}}},{key:"handleSending",value:function e(t,n){this.props.actions.previewField.updateFile(this.props.id,{xhr:n})}},{key:"handleUploadProgress",
value:function e(t,n){this.props.actions.previewField.updateFile(this.props.id,{progress:n})}},{key:"renderImage",value:function e(){var t=this.props.data
if(!t.exists&&!this.props.upload.url)return h.default.createElement("div",{className:"editor__file-preview-message--file-missing"},c.default._t("AssetAdmin.FILE_MISSING","File cannot be found"))
var n=this.props.upload.category,r=n&&"image"!==n?v.default.DEFAULT_PREVIEW:this.props.upload.url||t.preview||t.url,o=h.default.createElement("img",{alt:"preview",src:r,className:"editor__thumbnail"}),i=this.props.upload.progress,s=t.url&&!i?h.default.createElement("a",{
className:"editor__file-preview-link",href:t.url,target:"_blank"},o):null,a=i>0&&i<100?h.default.createElement("div",{className:"preview__progress"},h.default.createElement("div",{className:"preview__progress-bar",
style:{width:i+"%"}})):null,l=this.props.upload.message,u=null
return l?u=h.default.createElement("div",{className:"preview__message preview__message--"+l.type},l.value):100===i&&(u=h.default.createElement("div",{className:"preview__message preview__message--success"
},c.default._t("AssetAdmin.REPlACE_FILE_SUCCESS","Upload successful, the file will be replaced when you Save."))),h.default.createElement("div",{className:"editor__thumbnail-container"},s||o,a,u)}},{key:"renderToolbar",
value:function e(){var t=this.canEdit()
return this.props.data.url||t?h.default.createElement("div",{className:"preview__toolbar fill-height"},this.props.data.url?h.default.createElement("a",{href:this.props.data.url,target:"_blank",className:"preview__toolbar-button--link preview__toolbar-button"
},"Open"):null,t?h.default.createElement("button",{id:"preview-replace-button",onClick:this.preventDefault,className:"preview__toolbar-button--replace preview__toolbar-button"},"Replace"):null,this.props.upload.progress||this.props.upload.message?h.default.createElement("button",{
onClick:this.handleCancelUpload,className:"preview__toolbar-button--remove preview__toolbar-button"},"Remove"):null):null}},{key:"render",value:function e(){var t=this.getDropzoneProps()
if(this.canEdit())return h.default.createElement(g.default,t,this.renderImage(),this.renderToolbar())
var n=["preview__container",this.props.className,this.props.extraClass]
return h.default.createElement("div",{className:n.join(" ")},this.renderImage(),this.renderToolbar())}}]),t}(f.Component)
w.propTypes={id:f.PropTypes.string.isRequired,name:f.PropTypes.string,className:f.PropTypes.string,extraClass:f.PropTypes.string,readOnly:f.PropTypes.bool,disabled:f.PropTypes.bool,onAutofill:f.PropTypes.func,
data:f.PropTypes.shape({parentid:f.PropTypes.number,version:f.PropTypes.number,url:f.PropTypes.string,exists:f.PropTypes.bool,preview:f.PropTypes.string,category:f.PropTypes.string,nameField:f.PropTypes.string,
uploadFileEndpoint:f.PropTypes.shape({url:f.PropTypes.string.isRequired,method:f.PropTypes.string.isRequired,payloadFormat:f.PropTypes.string}),initialValues:f.PropTypes.object}).isRequired,upload:f.PropTypes.shape({
url:f.PropTypes.string,progress:f.PropTypes.number,xhr:f.PropTypes.object,category:f.PropTypes.string,message:f.PropTypes.shape({type:f.PropTypes.string.isRequired,value:f.PropTypes.string.isRequired})
}),actions:f.PropTypes.object,securityID:f.PropTypes.string,confirm:f.PropTypes.func},w.defaultProps={extraClass:"",className:"",data:{},upload:{},confirm:function e(t){return window.confirm(t)}},t.default=(0,
b.connect)(l,u)(w)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e){return{type:u.default.PREVIEWFIELD_REMOVE_FILE,payload:{id:e}}}function i(e,t){return{type:u.default.PREVIEWFIELD_ADD_FILE,payload:{id:e,
file:t}}}function s(e,t){return{type:u.default.PREVIEWFIELD_FAIL_UPLOAD,payload:{id:e,message:t}}}function a(e,t){return{type:u.default.PREVIEWFIELD_UPDATE_FILE,payload:{id:e,data:t}}}Object.defineProperty(t,"__esModule",{
value:!0}),t.removeFile=o,t.addFile=i,t.failUpload=s,t.updateFile=a
var l=n(304),u=r(l)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t=e.config.sections["SilverStripe\\AssetAdmin\\Controller\\AssetAdmin"]


return{sectionConfig:t,historySchemaUrl:t.form.fileHistoryForm.schemaUrl}}Object.defineProperty(t,"__esModule",{value:!0}),t.HistoryList=void 0
var l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),p=n(4),d=r(p),c=n(6),f=n(11),h=r(f),m=n(294),g=r(m),y=n(314),v=r(y),b=n(19),C=r(b),E=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.state={detailView:null,history:[],loadedDetails:!0},n.handleClick=n.handleClick.bind(n),n.handleBack=n.handleBack.bind(n),n.api=n.createEndpoint(e.sectionConfig.historyEndpoint),n}return s(t,e),
u(t,[{key:"componentDidMount",value:function e(){this.refreshHistoryIfNeeded()}},{key:"componentWillReceiveProps",value:function e(t){this.refreshHistoryIfNeeded(t)}},{key:"getContainerClassName",value:function e(){
return this.state.viewDetails&&!this.state.loadedDetails?"file-history history-container--loading":"file-history"}},{key:"refreshHistoryIfNeeded",value:function e(t){var n=this
t&&t.data.fileId===this.props.data.fileId&&t.data.latestVersionId===this.props.data.latestVersionId||this.api({fileId:t?t.data.fileId:this.props.data.fileId}).then(function(e){n.setState({history:e})})

}},{key:"handleClick",value:function e(t){this.setState({viewDetails:t})}},{key:"handleBack",value:function e(t){t.preventDefault(),this.setState({viewDetails:null})}},{key:"createEndpoint",value:function e(t){
var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]
return h.default.createEndpointFetcher(l({},t,n?{defaultData:{SecurityID:g.default.get("SecurityID")}}:{}))}},{key:"render",value:function e(){var t=this,n=this.getContainerClassName()
if(!this.state.history)return d.default.createElement("div",{className:n})
if(this.state.viewDetails){var r=[this.props.historySchemaUrl,this.props.data.fileId,this.state.viewDetails].join("/"),o=["btn btn-secondary","btn--icon-xl btn--no-text","font-icon-left-open-big","file-history__back"].join(" ")


return d.default.createElement("div",{className:n},d.default.createElement("a",{className:o,onClick:this.handleBack}),d.default.createElement(C.default,{schemaUrl:r}))}return d.default.createElement("div",{
className:n},d.default.createElement("ul",{className:"list-group list-group-flush file-history__list"},this.state.history.map(function(e){return d.default.createElement(v.default,l({key:e.versionid},e,{
onClick:t.handleClick}))})))}}]),t}(p.Component)
E.propTypes={sectionConfig:d.default.PropTypes.shape({form:d.default.PropTypes.object,historyEndpoint:d.default.PropTypes.shape({url:d.default.PropTypes.string,method:d.default.PropTypes.string,responseFormat:d.default.PropTypes.string
})}),historySchemaUrl:d.default.PropTypes.string,data:d.default.PropTypes.object},E.defaultProps={data:{fieldId:0}},t.HistoryList=E,t.default=(0,c.connect)(a)(E)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(4),u=r(l),p=n(10),d=r(p),c=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleClick=n.handleClick.bind(n),n}return s(t,e),a(t,[{key:"handleClick",value:function e(t){t.preventDefault(),"function"==typeof this.props.onClick&&this.props.onClick(this.props.versionid)

}},{key:"render",value:function e(){var t=null
return"Published"===this.props.status&&(t=u.default.createElement("p",null,u.default.createElement("span",{className:"history-item__status-flag"},this.props.status)," at ",this.props.date_formatted)),u.default.createElement("li",{
className:"list-group-item history-item",onClick:this.handleClick},u.default.createElement("p",null,u.default.createElement("span",{className:"history-item__version"},"v.",this.props.versionid),u.default.createElement("span",{
className:"history-item__date"},this.props.date_ago," ",this.props.author),this.props.summary),t)}}]),t}(d.default)
c.propTypes={versionid:l.PropTypes.number.isRequired,summary:l.PropTypes.oneOfType([l.PropTypes.bool,l.PropTypes.string]).isRequired,status:l.PropTypes.string,author:l.PropTypes.string,date:l.PropTypes.string,
onClick:l.PropTypes.func},t.default=c},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}var o=n(22),i=r(o),s=n(4),a=r(s),l=n(23),u=r(l),p=n(280),d=n(316),c=n(306)
i.default.entwine("ss",function(e){e(".js-react-boot input.entwine-uploadfield").entwine({onunmatch:function e(){this._super(),u.default.unmountComponentAtNode(this[0])},onmatch:function e(){this._super(),
this.refresh()},refresh:function e(){var t=window.ss.store,n=window.ss.apolloClient,r=this.getAttributes()
u.default.render(a.default.createElement(p.ApolloProvider,{store:t,client:n},a.default.createElement(c.ConnectedUploadField,r)),this.parent()[0])},getAttributes:function t(){var n=e(this).data("state"),r=e(this).data("schema")


return(0,d.schemaMerge)(r,n)}})})},function(e,t){e.exports=schemaFieldValues},function(e,t){}])

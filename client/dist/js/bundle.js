!function(e){function t(r){if(n[r])return n[r].exports
var o=n[r]={exports:{},id:r,loaded:!1}
return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={}
return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict"
n(1),n(395),n(417),n(419)},function(e,t,n){(function(t){e.exports=t.InsertMediaModal=n(2)}).call(t,function(){return this}())},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=e.config.sections[F],r=t.fileAttributes?t.fileAttributes.ID:null,o=r&&n.form.fileInsertForm.schemaUrl+"/"+r


return{sectionConfig:n,schemaUrl:o}}function u(e){return{actions:{schema:(0,y.bindActionCreators)(P,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.InsertMediaModal=void 0
var p=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(l){o=!0,i=l}finally{try{!r&&s["return"]&&s["return"]()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(3),h=o(f),m=n(4),g=o(m),y=n(5),v=n(6),b=n(7),_=n(9),E=o(_),C=n(20),S=o(C),w=n(392),P=r(w),F="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",x=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSubmit=n.handleSubmit.bind(n),n.handleBrowse=n.handleBrowse.bind(n),n.handleOpenFolder=n.handleOpenFolder.bind(n),n.getUrl=n.getUrl.bind(n),n.state={folderId:0,fileId:e.fileAttributes.ID,
query:{}},n}return a(t,e),d(t,[{key:"componentWillMount",value:function n(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function r(e){!e.show&&this.props.show&&this.setState({
folderId:0,fileId:null,query:{}}),e.show&&!this.props.show&&e.fileAttributes.ID&&(this.setOverrides(e),this.setState({folderId:0,fileId:e.fileAttributes.ID}))}},{key:"componentWillUnmount",value:function o(){
this.setOverrides()}},{key:"setOverrides",value:function l(e){if(!e||this.props.schemaUrl!==e.schemaUrl){var t=e&&e.schemaUrl||this.props.schemaUrl
t&&this.props.actions.schema.setSchemaStateOverrides(t,null)}if(e&&e.schemaUrl){var n=c({},e.fileAttributes)
delete n.ID
var r={fields:Object.entries(n).map(function(e){var t=p(e,2),n=t[0],r=t[1]
return{name:n,value:r}})}
this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,r)}}},{key:"getUrl",value:function u(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],t=arguments.length<=1||void 0===arguments[1]?null:arguments[1],n=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],r=parseInt(e||0,10),o=parseInt(t||0,10),i=r!==this.getFolderId(),s=c({},n)


return(i||s.page<=1)&&delete s.page,(0,b.buildUrl)(this.props.sectionConfig.url,r,o,s)}},{key:"getFolderId",value:function f(){return parseInt(this.state.folderId||0,10)}},{key:"getFileId",value:function m(){
return parseInt(this.state.fileId||this.props.fileId,10)}},{key:"getSectionProps",value:function y(){return{dialog:!0,type:this.props.type,toolbarChildren:this.renderToolbarChildren(),sectionConfig:this.props.sectionConfig,
folderId:this.getFolderId(),fileId:this.getFileId(),query:this.state.query,getUrl:this.getUrl,onBrowse:this.handleBrowse,onOpenFolder:this.handleOpenFolder,onSubmitEditor:this.handleSubmit}}},{key:"getModalProps",
value:function v(){var e=c({},this.props,{className:"insert-media-modal "+this.props.className,bsSize:"lg"})
return delete e.onHide,delete e.onInsert,delete e.sectionConfig,delete e.schemaUrl,e}},{key:"handleSubmit",value:function _(e,t,n,r){return this.props.onInsert(e,r)}},{key:"handleBrowse",value:function C(e,t){
var n=arguments.length<=2||void 0===arguments[2]?{}:arguments[2]
this.setState({folderId:e,fileId:t,query:n})}},{key:"handleOpenFolder",value:function w(e){this.handleBrowse(e)}},{key:"renderToolbarChildren",value:function P(){return g["default"].createElement("button",{
type:"button",className:"btn btn-secondary close insert-media-modal__close-button",onClick:this.props.onHide,"aria-label":h["default"]._t("FormBuilderModal.CLOSE","Close")},g["default"].createElement("span",{
"aria-hidden":"true"},"×"))}},{key:"render",value:function F(){var e=this.getModalProps(),t=this.getSectionProps(),n=this.props.show?g["default"].createElement(E["default"],t):null
return g["default"].createElement(S["default"],e,n)}}]),t}(m.Component)
x.propTypes={sectionConfig:m.PropTypes.shape({url:m.PropTypes.string,form:m.PropTypes.object}),type:m.PropTypes.oneOf(["insert","select","admin"]),schemaUrl:m.PropTypes.string,show:m.PropTypes.bool,onInsert:m.PropTypes.func.isRequired,
fileAttributes:m.PropTypes.shape({ID:m.PropTypes.number,AltText:m.PropTypes.string,Width:m.PropTypes.number,Height:m.PropTypes.number,TitleTooltip:m.PropTypes.string,Alignment:m.PropTypes.string}),fileId:m.PropTypes.number,
onHide:m.PropTypes.func,className:m.PropTypes.string,actions:m.PropTypes.object},x.defaultProps={className:"",fileAttributes:{},type:"insert"},t.InsertMediaModal=x,t["default"]=(0,v.connect)(l,u)(x)},function(e,t){
e.exports=i18n},function(e,t){e.exports=React},function(e,t){e.exports=Redux},function(e,t){e.exports=ReactRedux},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t,n,r){var o=null


o=n?e+"/show/"+t+"/edit/"+n:t?e+"/show/"+t:e+"/"
var i=r&&Object.keys(r).length>0
return i&&(o=o+"?"+b["default"].stringify(r)),o}function l(e){var t=e.config.sections[_]
return{sectionConfig:t}}Object.defineProperty(t,"__esModule",{value:!0}),t.buildUrl=t.AssetAdminRouter=void 0
var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(4),d=r(c),f=n(6),h=n(8),m=n(9),g=r(m),y=n(29),v=n(394),b=r(v),_="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",E=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleBrowse=n.handleBrowse.bind(n),n.getUrl=n.getUrl.bind(n),n}return s(t,e),p(t,[{key:"getUrl",value:function n(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],t=arguments.length<=1||void 0===arguments[1]?null:arguments[1],n=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],r=parseInt(e||0,10),o=parseInt(t||0,10),i=r!==this.getFolderId(),s=u({},n)


return(i||s.page<=1)&&delete s.page,a(this.props.sectionConfig.url,r,o,s)}},{key:"getFolderId",value:function r(){return this.props.params&&this.props.params.folderId?parseInt(this.props.params.folderId,10):0

}},{key:"getFileId",value:function l(){return this.props.params&&this.props.params.fileId?parseInt(this.props.params.fileId,10):0}},{key:"getSectionProps",value:function c(){return{sectionConfig:this.props.sectionConfig,
type:"admin",folderId:this.getFolderId(),fileId:this.getFileId(),query:this.getQuery(),getUrl:this.getUrl,onBrowse:this.handleBrowse}}},{key:"getQuery",value:function f(){return(0,y.decodeQuery)(this.props.location.search)

}},{key:"handleBrowse",value:function h(e,t,n){var r=this.getUrl(e,t,n)
this.props.router.push(r)}},{key:"render",value:function m(){return this.props.sectionConfig?d["default"].createElement(g["default"],this.getSectionProps()):null}}]),t}(c.Component)
E.propTypes={sectionConfig:c.PropTypes.shape({url:c.PropTypes.string,limit:c.PropTypes.number,form:c.PropTypes.object}),location:c.PropTypes.shape({pathname:c.PropTypes.string,query:c.PropTypes.object,
search:c.PropTypes.string}),params:c.PropTypes.object,router:c.PropTypes.object},t.AssetAdminRouter=E,t.buildUrl=a,t["default"]=(0,h.withRouter)((0,f.connect)(l)(E))},function(e,t){e.exports=ReactRouter

},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function s(e){if(Array.isArray(e)){
for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function p(e){return{securityId:e.config.SecurityID,
queuedFiles:e.assetAdmin.queuedFiles}}function c(e){return{actions:{gallery:(0,_.bindActionCreators)(T,e),breadcrumbsActions:(0,_.bindActionCreators)(I,e),queuedFiles:(0,_.bindActionCreators)(D,e)}}}Object.defineProperty(t,"__esModule",{
value:!0}),t.AssetAdmin=void 0
var d=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(l){o=!0,i=l}finally{try{!r&&s["return"]&&s["return"]()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},h=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),m=i(["\n  query ReadFiles($limit:Int!, $offset:Int!, $rootFilter: FileFilterInput, \n    $childrenFilter: FileFilterInput, $sortBy:[ChildrenSortInputType]\n  ) {\n    readFiles(filter: $rootFilter) {\n      pageInfo {\n        totalCount\n      }\n      edges {\n        node {\n          ...FileInterfaceFields\n          ...FileFields\n          ...on Folder {\n            children(limit:$limit, offset:$offset, filter: $childrenFilter, sortBy:$sortBy) {\n              pageInfo {\n                totalCount\n              }\n              edges {\n                node {\n                  ...FileInterfaceFields\n                  ...FileFields\n                  ...FolderFields\n                }\n              }\n            }\n            parents {\n              id\n              title\n            }\n          }\n        }\n      }\n    }\n  }\n  ","\n  ","\n  ","\n"],["\n  query ReadFiles($limit:Int!, $offset:Int!, $rootFilter: FileFilterInput, \n    $childrenFilter: FileFilterInput, $sortBy:[ChildrenSortInputType]\n  ) {\n    readFiles(filter: $rootFilter) {\n      pageInfo {\n        totalCount\n      }\n      edges {\n        node {\n          ...FileInterfaceFields\n          ...FileFields\n          ...on Folder {\n            children(limit:$limit, offset:$offset, filter: $childrenFilter, sortBy:$sortBy) {\n              pageInfo {\n                totalCount\n              }\n              edges {\n                node {\n                  ...FileInterfaceFields\n                  ...FileFields\n                  ...FolderFields\n                }\n              }\n            }\n            parents {\n              id\n              title\n            }\n          }\n        }\n      }\n    }\n  }\n  ","\n  ","\n  ","\n"]),g=i(["mutation DeleteFile($id:ID!) {\n  deleteFile(id: $id)\n}"],["mutation DeleteFile($id:ID!) {\n  deleteFile(id: $id)\n}"]),y=n(4),v=o(y),b=n(6),_=n(5),E=n(10),C=o(E),S=n(11),w=o(S),P=n(3),F=o(P),x=n(12),T=r(x),O=n(14),I=r(O),A=n(15),D=r(A),k=n(17),N=o(k),R=n(21),j=o(R),U=n(287),L=o(U),M=n(288),z=o(M),q=n(283),B=n(284),H=o(B),G=n(289),V=n(390),Q=o(V),W=function(e){
function t(e){a(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleOpenFile=n.handleOpenFile.bind(n),n.handleCloseFile=n.handleCloseFile.bind(n),n.handleDelete=n.handleDelete.bind(n),n.handleDoSearch=n.handleDoSearch.bind(n),n.handleSubmitEditor=n.handleSubmitEditor.bind(n),
n.handleOpenFolder=n.handleOpenFolder.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.createEndpoint=n.createEndpoint.bind(n),n.handleBackButtonClick=n.handleBackButtonClick.bind(n),
n.handleFolderIcon=n.handleFolderIcon.bind(n),n.handleBrowse=n.handleBrowse.bind(n),n.handleViewChange=n.handleViewChange.bind(n),n.handleUpload=n.handleUpload.bind(n),n.handleCreateFolderSuccess=n.handleCreateFolderSuccess.bind(n),
n.handleMoveFilesSuccess=n.handleMoveFilesSuccess.bind(n),n.compare=n.compare.bind(n),n}return u(t,e),h(t,[{key:"componentWillMount",value:function n(){var e=this.props.sectionConfig
this.endpoints={historyApi:this.createEndpoint(e.historyEndpoint)}}},{key:"componentWillReceiveProps",value:function r(e){var t=this.compare(this.props.folder,e.folder);(t||(0,V.hasFilters)(e.query.filter)!==(0,
V.hasFilters)(this.props.query.filter))&&this.setBreadcrumbs(e)}},{key:"handleBrowse",value:function o(e,t,n){"function"==typeof this.props.onBrowse&&this.props.onBrowse(e,t,n),e!==this.props.folderId&&this.props.actions.gallery.deselectFiles()

}},{key:"handleSetPage",value:function i(e){this.handleBrowse(this.props.folderId,this.props.fileId,f({},this.props.query,{page:e}))}},{key:"handleDoSearch",value:function p(e){this.handleBrowse(e.currentFolderOnly?this.props.folderId:0,0,f({},this.getBlankQuery(),{
filter:e}))}},{key:"getBlankQuery",value:function c(){var e={}
return Object.keys(this.props.query).forEach(function(t){e[t]=void 0}),e}},{key:"handleSort",value:function d(e){this.handleBrowse(this.props.folderId,this.props.fileId,f({},this.props.query,{sort:e,limit:void 0,
page:void 0}))}},{key:"handleViewChange",value:function m(e){this.handleBrowse(this.props.folderId,this.props.fileId,f({},this.props.query,{view:e}))}},{key:"createEndpoint",value:function g(e){var t=arguments.length<=1||void 0===arguments[1]||arguments[1]


return w["default"].createEndpointFetcher(f({},e,t?{defaultData:{SecurityID:this.props.securityId}}:{}))}},{key:"handleBackButtonClick",value:function y(e){e.preventDefault(),this.props.folder?this.handleOpenFolder(this.props.folder.parentId||0):this.handleOpenFolder(0)

}},{key:"setBreadcrumbs",value:function b(e){var t=this,n=e.folder,r=e.query,o=[{text:F["default"]._t("AssetAdmin.FILES","Files"),href:this.props.getUrl&&this.props.getUrl(),onClick:function i(e){e.preventDefault(),
t.handleBrowse()}}]
n&&n.id&&(n.parents&&n.parents.forEach(function(e){o.push({text:e.title,href:t.props.getUrl&&t.props.getUrl(e.id),onClick:function n(r){r.preventDefault(),t.handleBrowse(e.id)}})}),o.push({text:n.title,
href:this.props.getUrl&&this.props.getUrl(n.id),onClick:function s(e){e.preventDefault(),t.handleBrowse(n.id)},icon:{className:"icon font-icon-edit-list",action:this.handleFolderIcon}})),(0,V.hasFilters)(r.filter)&&o.push({
text:F["default"]._t("LeftAndMain.SEARCHRESULTS","Search results")}),this.props.actions.breadcrumbsActions.setBreadcrumbs(o)}},{key:"compare",value:function _(e,t){return!!(e&&!t||t&&!e)||e&&t&&(e.id!==t.id||e.name!==t.name)

}},{key:"handleFolderIcon",value:function E(e){e.preventDefault(),this.handleOpenFile(this.props.folderId)}},{key:"handleOpenFile",value:function C(e){this.handleBrowse(this.props.folderId,e,this.props.query)

}},{key:"handleSubmitEditor",value:function S(e,t,n){var r=this,o=null
if("function"==typeof this.props.onSubmitEditor){var i=this.props.files.find(function(e){return e.id===parseInt(r.props.fileId,10)})
o=this.props.onSubmitEditor(e,t,n,i)}else o=n()
if(!o)throw new Error("Promise was not returned for submitting")
return o.then(function(e){return r.props.refetch(),e})}},{key:"handleCloseFile",value:function P(){this.handleOpenFolder(this.props.folderId)}},{key:"handleOpenFolder",value:function x(e){var t=f({},this.props.query)


delete t.page,delete t.filter,this.handleBrowse(e,null,t)}},{key:"handleDelete",value:function T(e){var t=this,n=[].concat(s(this.props.files),s(this.props.queuedFiles.items)),r=n.find(function(t){return t.id===e

})
if(!r&&this.props.folder&&this.props.folder.id===e&&(r=this.props.folder),!r)throw new Error("File selected for deletion cannot be found: "+e)
var o=this.props.client.dataId({__typename:r.__typename,id:r.id})
return this.props.actions.mutate.deleteFile(r.id,o).then(function(){t.props.actions.gallery.deselectFiles([r.id]),r.queuedId&&t.props.actions.queuedFiles.removeQueuedFile(r.queuedId),r&&t.handleBrowse(r.parent?r.parent.id:0)

})}},{key:"handleUpload",value:function O(){}},{key:"handleCreateFolderSuccess",value:function I(){this.props.refetch()}},{key:"handleMoveFilesSuccess",value:function A(e,t){var n=this,r=this.props.queuedFiles.items.filter(function(e){
return t.includes(e.id)})
r.forEach(function(e){e.queuedId&&n.props.actions.queuedFiles.removeQueuedFile(e.queuedId)}),this.props.actions.gallery.deselectFiles(),this.props.refetch()}},{key:"renderGallery",value:function D(){var e=this.props.sectionConfig,t=e.createFileEndpoint.url,n=e.createFileEndpoint.method,r=this.props.query&&parseInt(this.props.query.limit||e.limit,10),o=this.props.query&&parseInt(this.props.query.page||1,10),i=this.props.query&&this.props.query.sort,s=this.props.query&&this.props.query.view,a=this.props.query&&this.props.query.filter||{}


return v["default"].createElement(j["default"],{files:this.props.files,fileId:this.props.fileId,folderId:this.props.folderId,folder:this.props.folder,type:this.props.type,limit:r,page:o,totalCount:this.props.filesTotalCount,
view:s,filters:a,createFileApiUrl:t,createFileApiMethod:n,onDelete:this.handleDelete,onOpenFile:this.handleOpenFile,onOpenFolder:this.handleOpenFolder,onSuccessfulUpload:this.handleUpload,onCreateFolderSuccess:this.handleCreateFolderSuccess,
onMoveFilesSuccess:this.handleMoveFilesSuccess,onSort:this.handleSort,onSetPage:this.handleSetPage,onViewChange:this.handleViewChange,sort:i,sectionConfig:e,loading:this.props.loading})}},{key:"renderEditor",
value:function k(){var e=this.props.sectionConfig,t=null
switch(this.props.type){case"insert":t=e.form.fileInsertForm.schemaUrl
break
case"select":t=e.form.fileSelectForm.schemaUrl
break
case"admin":default:t=e.form.fileEditForm.schemaUrl}return this.props.fileId?v["default"].createElement(N["default"],{className:"insert"===this.props.type?"editor--dialog":"",fileId:this.props.fileId,onClose:this.handleCloseFile,
editFileSchemaUrl:t,onSubmit:this.handleSubmitEditor,onDelete:this.handleDelete,addToCampaignSchemaUrl:e.form.addToCampaignForm.schemaUrl}):null}},{key:"render",value:function R(){var e=!!(this.props.folder&&this.props.folder.id||(0,
V.hasFilters)(this.props.query.filter)),t=this.props.sectionConfig.form.fileSearchForm.schemaUrl,n=this.props.query.filter||{}
return v["default"].createElement("div",{className:"fill-height"},v["default"].createElement(z["default"],{showBackButton:e,handleBackButtonClick:this.handleBackButtonClick},v["default"].createElement(L["default"],{
multiline:!0}),v["default"].createElement("div",{className:"asset-admin__toolbar-extra pull-xs-right fill-width"},v["default"].createElement(Q["default"],{onSearch:this.handleDoSearch,id:"AssetSearchForm",
searchFormSchemaUrl:t,folderId:this.props.folderId,filters:n}),this.props.toolbarChildren)),v["default"].createElement("div",{className:"flexbox-area-grow fill-width fill-height gallery"},this.renderGallery(),this.renderEditor()),"admin"!==this.props.type&&this.props.loading&&[v["default"].createElement("div",{
key:"overlay",className:"cms-content-loading-overlay ui-widget-overlay-light"}),v["default"].createElement("div",{key:"spinner",className:"cms-content-loading-spinner"})])}}]),t}(C["default"])
W.propTypes={dialog:y.PropTypes.bool,sectionConfig:y.PropTypes.shape({url:y.PropTypes.string,limit:y.PropTypes.number,form:y.PropTypes.object}),fileId:y.PropTypes.number,folderId:y.PropTypes.number,onBrowse:y.PropTypes.func,
getUrl:y.PropTypes.func,query:y.PropTypes.shape({sort:y.PropTypes.string,limit:y.PropTypes.oneOfType([y.PropTypes.number,y.PropTypes.string]),page:y.PropTypes.oneOfType([y.PropTypes.number,y.PropTypes.string]),
filter:y.PropTypes.object}),onSubmitEditor:y.PropTypes.func,type:y.PropTypes.oneOf(["insert","select","admin"]),files:y.PropTypes.array,queuedFiles:y.PropTypes.shape({items:y.PropTypes.array.isRequired
}),filesTotalCount:y.PropTypes.number,folder:y.PropTypes.shape({id:y.PropTypes.number,title:y.PropTypes.string,parents:y.PropTypes.array,parentId:y.PropTypes.number,canView:y.PropTypes.bool,canEdit:y.PropTypes.bool
}),loading:y.PropTypes.bool,actions:y.PropTypes.object},W.defaultProps={type:"admin",query:{sort:"",limit:null,page:0,filter:{}}}
var $=(0,H["default"])(m,j["default"].fragments.fileInterface,j["default"].fragments.file,j["default"].fragments.folder),K={options:function Z(e){var t=e.sectionConfig,n=e.folderId,r=e.query,o=r.sort?r.sort.split(","):["",""],i=d(o,2),s=i[0],a=i[1],l=r.filter||{},u=r.limit||t.limit


return{variables:{rootFilter:{id:n},childrenFilter:f(l,{parentId:void 0,recursive:(0,V.hasFilters)(l),currentFolderOnly:void 0}),limit:u,offset:((r.page||1)-1)*u,sortBy:s&&a?[{field:s,direction:a.toUpperCase()
}]:void 0}}},props:function X(e){var t=e.data,n=t.networkStatus,r=t.refetch,o=t.readFiles,i=o&&o.edges[0]?o.edges[0].node:null,s=i&&i.children?i.children.edges.map(function(e){return e.node}).filter(function(e){
return e}):[],a=i&&i.children?i.children.pageInfo.totalCount:0,l=n!==G.NetworkStatus.ready&&n!==G.NetworkStatus.error
return{loading:l,refetch:r,folder:i,files:s,filesTotalCount:a}}},Y=(0,H["default"])(g)
t.AssetAdmin=W,t["default"]=(0,_.compose)((0,b.connect)(p,c),(0,q.graphql)($,K),(0,q.graphql)(Y,{props:function J(e){var t=e.mutate,n=e.ownProps.actions
return{actions:f({},n,{mutate:f({},n.mutate,{deleteFile:function r(e,n){return t({variables:{id:e},resultBehaviors:[{type:"DELETE",dataId:n}]})}})})}}}),function(e){return(0,q.withApollo)(e)})(W)},function(e,t){
e.exports=SilverStripeComponent},function(e,t){e.exports=Backend},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){return function(n){n({type:f["default"].LOAD_FILE_SUCCESS,payload:{id:e,file:t}})}}function i(){var e=arguments.length<=0||void 0===arguments[0]?null:arguments[0]


return function(t){return t({type:f["default"].SELECT_FILES,payload:{ids:e}})}}function s(){var e=arguments.length<=0||void 0===arguments[0]?null:arguments[0]
return function(t){return t({type:f["default"].DESELECT_FILES,payload:{ids:e}})}}function a(e){return function(t){return t({type:f["default"].SET_NOTICE_MESSAGE,payload:{message:e}})}}function l(e){return function(t){
return t({type:f["default"].SET_ERROR_MESSAGE,payload:{message:e}})}}function u(e){return function(t){return t({type:f["default"].SET_ENABLE_DROPZONE,payload:{enableDropzone:e}})}}function p(e){return function(t){
t({type:f["default"].CLEAR_FILE_BADGE,payload:{id:e}})}}function c(e,t,n,r){return function(o,i){var s=i(),a=s.assetAdmin,l=a.gallery.badges.find(function(t){return t.id===e})
l&&l.timer&&clearTimeout(l.timer)
var u=r>0?setTimeout(function(){return p(e)(o)},r):null
o({type:f["default"].SET_FILE_BADGE,payload:{id:e,message:t,status:n,timer:u}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.loadFile=o,t.selectFiles=i,t.deselectFiles=s,t.setNoticeMessage=a,t.setErrorMessage=l,
t.setEnableDropzone=u,t.clearFileBadge=p,t.setFileBadge=c
var d=n(13),f=r(d)},function(e,t){"use strict"
function n(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0})
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}
t["default"]=["DESELECT_FILES","SELECT_FILES","LOAD_FILE_REQUEST","LOAD_FILE_SUCCESS","HIGHLIGHT_FILES","UPDATE_BATCH_ACTIONS","SET_NOTICE_MESSAGE","SET_ERROR_MESSAGE","SET_ENABLE_DROPZONE","SET_FILE_BADGE","CLEAR_FILE_BADGE"].reduce(function(e,t){
return r(e,n({},t,"GALLERY."+t))},{})},function(e,t){e.exports=BreadcrumbsActions},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e){return function(t){return t({type:c["default"].ADD_QUEUED_FILE,payload:{file:e}})}}function i(e,t){return function(n){var r=t.message
return"string"==typeof t&&(r={value:t,type:"error"}),n({type:c["default"].FAIL_UPLOAD,payload:{queuedId:e,message:r}})}}function s(){return function(e){return e({type:c["default"].PURGE_UPLOAD_QUEUE,payload:null
})}}function a(e){return function(t){return t({type:c["default"].REMOVE_QUEUED_FILE,payload:{queuedId:e}})}}function l(e,t){return function(n){return n({type:c["default"].SUCCEED_UPLOAD,payload:{queuedId:e,
json:t}})}}function u(e,t){return function(n){return n({type:c["default"].UPDATE_QUEUED_FILE,payload:{queuedId:e,updates:t}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addQueuedFile=o,t.failUpload=i,
t.purgeUploadQueue=s,t.removeQueuedFile=a,t.succeedUpload=l,t.updateQueuedFile=u
var p=n(16),c=r(p)},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={ADD_QUEUED_FILE:"ADD_QUEUED_FILE",FAIL_UPLOAD:"FAIL_UPLOAD",PURGE_UPLOAD_QUEUE:"PURGE_UPLOAD_QUEUE",REMOVE_QUEUED_FILE:"REMOVE_QUEUED_FILE",
SUCCEED_UPLOAD:"SUCCEED_UPLOAD",UPDATE_QUEUED_FILE:"UPDATE_QUEUED_FILE"}},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(3),u=r(l),p=n(4),c=r(p),d=n(18),f=r(d),h=n(19),m=r(h),g=n(20),y=r(g),v=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleCancelKeyDown=n.handleCancelKeyDown.bind(n),n.handleClose=n.handleClose.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n.handleAction=n.handleAction.bind(n),n.closeModal=n.closeModal.bind(n),
n.openModal=n.openModal.bind(n),n.state={openModal:!1},n}return s(t,e),a(t,[{key:"handleAction",value:function n(e,t){var n=e.currentTarget.name
return"action_addtocampaign"===n?(this.openModal(),void e.preventDefault()):"action_delete"===n?(confirm(u["default"]._t("AssetAdmin.CONFIRMDELETE"))&&this.props.onDelete(t.ID),void e.preventDefault()):void 0

}},{key:"handleCancelKeyDown",value:function r(e){e.keyCode!==f["default"].SPACE_KEY_CODE&&e.keyCode!==f["default"].RETURN_KEY_CODE||this.handleClose(e)}},{key:"handleSubmit",value:function l(e,t,n){return"function"==typeof this.props.onSubmit?this.props.onSubmit(e,t,n):n()

}},{key:"handleClose",value:function p(e){this.props.onClose(),this.closeModal(),e&&e.preventDefault()}},{key:"openModal",value:function d(){this.setState({openModal:!0})}},{key:"closeModal",value:function h(){
this.setState({openModal:!1})}},{key:"renderCancelButton",value:function g(){return c["default"].createElement("a",{tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",
onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u["default"]._t("AssetAdmin.CANCEL")})}},{key:"renderCancelButton",value:function v(){return c["default"].createElement("a",{
tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u["default"]._t("AssetAdmin.CANCEL")
})}},{key:"renderCancelButton",value:function b(){return c["default"].createElement("a",{tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",onClick:this.handleClose,
onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u["default"]._t("AssetAdmin.CANCEL")})}},{key:"render",value:function _(){var e=this.props.editFileSchemaUrl+"/"+this.props.fileId,t=this.props.addToCampaignSchemaUrl+"/"+this.props.fileId,n=["panel","panel--padded","panel--scrollable","form--no-dividers","editor"]


return this.props.className&&n.push(this.props.className),c["default"].createElement("div",{className:n.join(" ")},c["default"].createElement("div",{className:"editor__details"},c["default"].createElement(m["default"],{
schemaUrl:e,afterMessages:this.renderCancelButton(),handleSubmit:this.handleSubmit,handleAction:this.handleAction}),c["default"].createElement(y["default"],{show:this.state.openModal,handleHide:this.closeModal,
schemaUrl:t,bodyClassName:"modal__dialog",responseClassBad:"modal__response modal__response--error",responseClassGood:"modal__response modal__response--good"})))}}]),t}(p.Component)
v.propTypes={dialog:c["default"].PropTypes.bool,className:c["default"].PropTypes.string,fileId:c["default"].PropTypes.number.isRequired,onClose:c["default"].PropTypes.func.isRequired,onSubmit:c["default"].PropTypes.func.isRequired,
onDelete:c["default"].PropTypes.func.isRequired,editFileSchemaUrl:c["default"].PropTypes.string.isRequired,addToCampaignSchemaUrl:c["default"].PropTypes.string,openAddCampaignModal:c["default"].PropTypes.bool
},t["default"]=v},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(3),i=r(o)
t["default"]={MOVE_SUCCESS_DURATION:3e3,CSS_TRANSITION_TIME:300,SMALL_THUMBNAIL_HEIGHT:60,SMALL_THUMBNAIL_WIDTH:60,THUMBNAIL_HEIGHT:150,THUMBNAIL_WIDTH:200,BULK_ACTIONS:[{value:"delete",label:i["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE","Delete"),
className:"font-icon-trash",destructive:!0,callback:null,canApply:function s(e){return e.reduce(function(e,t){return t&&t.canDelete&&e},!0)},confirm:function(e){function t(t){return e.apply(this,arguments)

}return t.toString=function(){return e.toString()},t}(function(e){return new Promise(function(t,n){var r=e.filter(function(e){return"folder"===e.type&&e.filesInUseCount>0})
if(r.length)return alert(i["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE_FOLDER","These folders contain files which are currently in use, you must move or delete their contents before you can delete the folder.")),
void n("cancelled")
var o=e.filter(function(e){return"folder"!==e.type&&e.inUseCount>0}),s=i["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE_CONFIRM","Are you sure you want to delete these files?")
1===e.length&&1===o.length&&(s=i["default"].sprintf(i["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE_SINGLE_CONFIRM","This file is currently in use in %s places, are you sure you want to delete it?"),e[0].inUseCount)),
o.length>1&&i["default"].sprintf(i["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE_MULTI_CONFIRM","There are %s files currently in use, are you sure you want to delete these files?"),o.length),confirm(s)?t():n("cancelled")

})})},{value:"edit",label:i["default"]._t("AssetAdmin.BULK_ACTIONS_EDIT","Edit"),className:"font-icon-edit",destructive:!1,canApply:function a(e){return 1===e.length},callback:null}],BULK_ACTIONS_PLACEHOLDER:i["default"]._t("AssetAdmin.BULK_ACTIONS_PLACEHOLDER"),
SPACE_KEY_CODE:32,RETURN_KEY_CODE:13,DEFAULT_PREVIEW:"framework/client/dist/images/app_icons/generic_92.png"}},function(e,t){e.exports=FormBuilderLoader},function(e,t){e.exports=FormBuilderModal},function(e,t,n){
"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function s(e){if(Array.isArray(e)){
for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function p(e){var t=e.assetAdmin.gallery,n=t.selectedFiles,r=t.errorMessage,o=t.noticeMessage,i=t.enableDropzone,s=t.badges


return{selectedFiles:n,errorMessage:r,noticeMessage:o,enableDropzone:i,badges:s,queuedFiles:e.assetAdmin.queuedFiles,securityId:e.config.SecurityID}}function c(e){return{actions:{gallery:(0,D.bindActionCreators)($,e),
queuedFiles:(0,D.bindActionCreators)(Y,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.galleryViewDefaultProps=t.galleryViewPropTypes=t.sorters=t.Gallery=void 0
var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},f=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),h=i(["\n   fragment FileInterfaceFields on FileInterface {\n    canDelete\n    canEdit\n    canView\n    category\n    exists\n    filename\n    id\n    lastEdited\n    name\n    parentId\n    title\n    type\n    url\n   }\n    "],["\n   fragment FileInterfaceFields on FileInterface {\n    canDelete\n    canEdit\n    canView\n    category\n    exists\n    filename\n    id\n    lastEdited\n    name\n    parentId\n    title\n    type\n    url\n   }\n    "]),m=i(["\n   fragment FileFields on File {\n    draft\n    extension\n    height\n    published\n    size\n    smallThumbnail\n    thumbnail\n    width\n    inUseCount\n   }\n    "],["\n   fragment FileFields on File {\n    draft\n    extension\n    height\n    published\n    size\n    smallThumbnail\n    thumbnail\n    width\n    inUseCount\n   }\n    "]),g=i(["\n   fragment FolderFields on Folder {\n    filesInUseCount\n   }\n    "],["\n   fragment FolderFields on Folder {\n    filesInUseCount\n   }\n    "]),y=i(["\n  mutation CreateFolder($folder:FolderInput!) {\n    createFolder(folder: $folder) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ","\n  ","\n"],["\n  mutation CreateFolder($folder:FolderInput!) {\n    createFolder(folder: $folder) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ","\n  ","\n"]),v=i(["\n  mutation MoveFiles($folderId:ID!, $fileIds:[ID]!) {\n    moveFiles(folderId: $folderId, fileIds: $fileIds) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ","\n  ","\n"],["\n  mutation MoveFiles($folderId:ID!, $fileIds:[ID]!) {\n    moveFiles(folderId: $folderId, fileIds: $fileIds) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ","\n  ","\n"]),b=n(22),_=o(b),E=n(3),C=o(E),S=n(4),w=o(S),P=n(23),F=o(P),x=n(24),T=o(x),O=n(25),I=o(O),A=n(6),D=n(5),k=n(26),N=o(k),R=n(30),j=o(R),U=n(31),L=o(U),M=n(280),z=o(M),q=n(18),B=o(q),H=n(281),G=o(H),V=n(282),Q=o(V),W=n(12),$=r(W),K=n(15),Y=r(K),Z=n(283),X=n(284),J=o(X),ee=n(285),te=o(ee),ne=[{
field:"title",direction:"asc",label:C["default"]._t("AssetAdmin.FILTER_TITLE_ASC","title a-z")},{field:"title",direction:"desc",label:C["default"]._t("AssetAdmin.FILTER_TITLE_DESC","title z-a")},{field:"lastEdited",
direction:"desc",label:C["default"]._t("AssetAdmin.FILTER_DATE_DESC","newest")},{field:"lastEdited",direction:"asc",label:C["default"]._t("AssetAdmin.FILTER_DATE_ASC","oldest")}],re=function(e){function t(e){
a(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleOpenFolder=n.handleOpenFolder.bind(n),n.handleOpenFile=n.handleOpenFile.bind(n),n.handleSelect=n.handleSelect.bind(n),n.handleSelectSort=n.handleSelectSort.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),
n.handleCancelUpload=n.handleCancelUpload.bind(n),n.handleRemoveErroredUpload=n.handleRemoveErroredUpload.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleSending=n.handleSending.bind(n),
n.handleBackClick=n.handleBackClick.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),
n.handleCreateFolder=n.handleCreateFolder.bind(n),n.handleViewChange=n.handleViewChange.bind(n),n.handleClearSearch=n.handleClearSearch.bind(n),n.handleEnableDropzone=n.handleEnableDropzone.bind(n),n.handleMoveFiles=n.handleMoveFiles.bind(n),
n.handleBulkDelete=n.handleBulkDelete.bind(n),n.handleBulkEdit=n.handleBulkEdit.bind(n),n}return u(t,e),f(t,[{key:"componentDidMount",value:function n(){this.initSortDropdown()}},{key:"componentWillReceiveProps",
value:function r(e){if("tile"!==e.view){var t=this.getSortElement()
t.off("change")}this.compareFiles(this.props.files,e.files)||e.actions.queuedFiles.purgeUploadQueue(),this.checkLoadingIndicator(e)}},{key:"componentDidUpdate",value:function o(){this.initSortDropdown()

}},{key:"getSortElement",value:function i(){return(0,_["default"])(F["default"].findDOMNode(this)).find(".gallery__sort .dropdown")}},{key:"getSearchMessage",value:function p(e){var t=[]
e.name&&t.push(C["default"]._t("LeftAndMain.SEARCHRESULTSMESSAGEKEYWORDS","with keywords '{name}'")),e.createdFrom&&e.createdTo?t.push(C["default"]._t("LeftAndMain.SEARCHRESULTSMESSAGEEDITEDBETWEEN","created between '{createdFrom}' and '{createdTo}'")):e.createdFrom?t.push(C["default"]._t("LeftAndMain.SEARCHRESULTSMESSAGEEDITEDFROM","created after '{createdFrom}'")):e.createdTo&&t.push(C["default"]._t("LeftAndMain.SEARCHRESULTSMESSAGEEDITEDTO","created before '{createdTo}'")),
e.appCategory&&t.push(C["default"]._t("LeftAndMain.SEARCHRESULTSMESSAGECATEGORY","categorised as '{appCategory}'")),e.currentFolderOnly&&t.push(C["default"]._t("LeftAndMain.SEARCHRESULTSMESSAGELIMIT","limited to the folder '{folder}'"))


var n=[t.slice(0,-1).join(C["default"]._t("LeftAndMain.JOIN",",")+" "),t.slice(-1)].filter(function(e){return e}).join(" "+C["default"]._t("LeftAndMain.JOINLAST","and")+" ")
if(""===n)return""
var r={parts:C["default"].inject(n,d({folder:this.props.folder.title},e,{appCategory:e.appCategory?e.appCategory.toLowerCase():void 0}))}
return C["default"].inject(C["default"]._t("LeftAndMain.SEARCHRESULTSMESSAGE","Search results {parts}"),r)}},{key:"checkLoadingIndicator",value:function c(e){var t=(0,_["default"])(".cms-content.AssetAdmin")


t.length&&(e.loading?t.addClass("loading"):t.removeClass("loading"))}},{key:"compareFiles",value:function h(e,t){if(e&&!t||!e&&t)return!1
if(e.length!==t.length)return!1
for(var n=0;n<e.length;n++)if(e[n].id!==t[n].id)return!1
return!0}},{key:"initSortDropdown",value:function m(){var e=this
"tile"===this.props.view&&!function(){var t=e.getSortElement()
t.chosen({allow_single_deselect:!0,disable_search_threshold:20}),t.on("change",function(){return T["default"].Simulate.click(t.find(":selected")[0])})}()}},{key:"handleSort",value:function g(e){this.props.actions.queuedFiles.purgeUploadQueue(),
this.props.onSort(e)}},{key:"handleSelectSort",value:function y(e){this.handleSort(e.currentTarget.value)}},{key:"handleSetPage",value:function v(e){this.props.onSetPage(e)}},{key:"handleCancelUpload",
value:function b(e){e.xhr.abort(),this.props.actions.queuedFiles.removeQueuedFile(e.queuedId)}},{key:"handleRemoveErroredUpload",value:function E(e){this.props.actions.queuedFiles.removeQueuedFile(e.queuedId)

}},{key:"handleAddedFile",value:function S(e){this.props.actions.queuedFiles.addQueuedFile(e)}},{key:"handleSending",value:function P(e,t){this.props.actions.queuedFiles.updateQueuedFile(e._queuedId,{xhr:t
})}},{key:"handleUploadProgress",value:function x(e,t){this.props.actions.queuedFiles.updateQueuedFile(e._queuedId,{progress:t})}},{key:"handleCreateFolder",value:function O(e){var t=this,n=this.promptFolderName(),r=parseInt(this.props.folder.id,10)


n&&this.props.actions.mutate.createFolder(r,n).then(function(e){t.props.onCreateFolderSuccess&&t.props.onCreateFolderSuccess(e)}),e.preventDefault()}},{key:"handleSuccessfulUpload",value:function A(e){
var t=JSON.parse(e.xhr.response)
if("undefined"!=typeof t[0].error)return void this.handleFailedUpload(e)
if(this.props.actions.queuedFiles.succeedUpload(e._queuedId,t[0]),this.props.onSuccessfulUpload&&this.props.onSuccessfulUpload(t),"admin"!==this.props.type&&!this.props.fileId&&0===this.props.queuedFiles.items.length){
var n=t.pop()
this.props.onOpenFile(n.id)}}},{key:"handleFailedUpload",value:function D(e,t){this.props.actions.queuedFiles.failUpload(e._queuedId,t)}},{key:"promptFolderName",value:function k(){return prompt(C["default"]._t("AssetAdmin.PROMPTFOLDERNAME"))

}},{key:"itemIsSelected",value:function R(e){return this.props.selectedFiles.indexOf(e)>-1}},{key:"itemIsHighlighted",value:function U(e){return this.props.fileId===e}},{key:"handleClearSearch",value:function M(e){
this.handleOpenFolder(e,this.props.folder)}},{key:"handleOpenFolder",value:function q(e,t){e.preventDefault(),this.props.actions.gallery.setErrorMessage(null),this.props.actions.gallery.setNoticeMessage(null),
this.props.onOpenFolder(t.id)}},{key:"handleOpenFile",value:function H(e,t){e.preventDefault(),null!==t.created&&this.props.onOpenFile(t.id,t)}},{key:"handleSelect",value:function V(e,t){this.props.selectedFiles.indexOf(t.id)===-1?this.props.actions.gallery.selectFiles([t.id]):this.props.actions.gallery.deselectFiles([t.id])

}},{key:"handleBackClick",value:function W(e){e.preventDefault(),this.props.onOpenFolder(this.props.folder.parentId)}},{key:"handleViewChange",value:function $(e){var t=e.currentTarget.value
this.props.onViewChange(t)}},{key:"handleEnableDropzone",value:function K(e){this.props.actions.gallery.setEnableDropzone(e)}},{key:"handleMoveFiles",value:function Y(e,t){var n=this
this.props.actions.mutate.moveFiles(e,t).then(function(){var r=B["default"].MOVE_SUCCESS_DURATION,o="+"+t.length
n.props.actions.gallery.setFileBadge(e,o,"success",r),"function"==typeof n.props.onMoveFilesSuccess&&n.props.onMoveFilesSuccess(e,t)})}},{key:"handleBulkDelete",value:function Z(e){var t=this
return Promise.all(e.map(function(e){return e.queuedId?(t.props.actions.queuedFiles.removeQueuedFile(e.queuedId),Promise.resolve(!0)):t.props.onDelete(e.id).then(function(){return!0})["catch"](function(){
return!1})})).then(function(e){var n=e.filter(function(e){return e}).length
n!==e.length?(t.props.actions.gallery.setErrorMessage(C["default"].sprintf(C["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE_FAIL"),n,e.length-n)),t.props.actions.gallery.setNoticeMessage(null)):(t.props.actions.gallery.setNoticeMessage(C["default"].sprintf(C["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE_SUCCESS"),n)),
t.props.actions.gallery.setErrorMessage(null))})}},{key:"handleBulkEdit",value:function X(e){this.props.onOpenFile(e[0].id)}},{key:"renderSort",value:function J(){var e=this
return"tile"!==this.props.view?null:w["default"].createElement("div",{className:"gallery__sort fieldholder-small"},w["default"].createElement("select",{className:"dropdown no-change-track no-chzn",tabIndex:"0",
style:{width:"160px"},defaultValue:this.props.sort},ne.map(function(t,n){return w["default"].createElement("option",{key:n,onClick:e.handleSelectSort,"data-field":t.field,"data-direction":t.direction,value:t.field+","+t.direction
},t.label)})))}},{key:"renderToolbar",value:function ee(){var e=this.props.folder.canEdit
return w["default"].createElement("div",{className:"toolbar--content toolbar--space-save"},w["default"].createElement("div",{className:"fill-width"},w["default"].createElement("div",{className:"flexbox-area-grow"
},this.renderBackButton(),w["default"].createElement("button",{id:"upload-button",className:"btn btn-secondary font-icon-upload btn--icon-xl",type:"button",disabled:!e},w["default"].createElement("span",{
className:"btn__text"},C["default"]._t("AssetAdmin.DROPZONE_UPLOAD"))),w["default"].createElement("button",{id:"add-folder-button",className:"btn btn-secondary font-icon-folder-add btn--icon-xl",type:"button",
onClick:this.handleCreateFolder,disabled:!e},w["default"].createElement("span",{className:"btn__text"},C["default"]._t("AssetAdmin.ADD_FOLDER_BUTTON")))),w["default"].createElement("div",{className:"gallery__state-buttons"
},this.renderSort(),w["default"].createElement("div",{className:"btn-group",role:"group","aria-label":"View mode"},this.renderViewChangeButtons()))))}},{key:"renderSearchAlert",value:function re(){var e=this.props.filters


if(!e||0===Object.keys(e).length)return null
var t=this.getSearchMessage(e)
if(""===t)return null
var n=w["default"].createElement("div",null,w["default"].createElement("button",{onClick:this.handleClearSearch,className:"btn btn-info font-icon-cancel form-alert__btn--right"},C["default"]._t("LeftAndMain.SEARCHCLEARRESULTS","Clear results")),t)


return w["default"].createElement(G["default"],{value:{react:n},type:"warning"})}},{key:"renderViewChangeButtons",value:function oe(){var e=this,t=["tile","table"]
return t.map(function(t,n){var r="table"===t?"list":"thumbnails",o=["gallery__view-change-button","btn btn-secondary","btn--icon-sm","btn--no-text"]
return t===e.props.view?null:(o.push("font-icon-"+r),w["default"].createElement("button",{id:"button-view-"+t,key:n,className:o.join(" "),type:"button",title:"Change view gallery/list",onClick:e.handleViewChange,
value:t}))})}},{key:"renderBackButton",value:function ie(){var e=this.props.folder.parentId
if(null!==e){var t=this.props.badges.find(function(t){return t.id===e})
return w["default"].createElement("div",{className:"gallery__back-container"},w["default"].createElement(Q["default"],{item:{id:e},onClick:this.handleBackClick,onDropFiles:this.handleMoveFiles,badge:t}))

}return null}},{key:"renderBulkActions",value:function se(){var e=this,t=B["default"].BULK_ACTIONS.map(function(t){if(!t.callback)switch(t.value){case"delete":return d({},t,{callback:e.handleBulkDelete
})
case"edit":return d({},t,{callback:e.handleBulkEdit})
default:return t}return t}),n=[].concat(s(this.props.files),s(this.props.queuedFiles.items)),r=this.props.selectedFiles.map(function(e){return n.find(function(t){return t&&e===t.id})})
return r.length>0&&"admin"===this.props.type?w["default"].createElement(I["default"],{transitionName:"bulk-actions",transitionEnterTimeout:B["default"].CSS_TRANSITION_TIME,transitionLeaveTimeout:B["default"].CSS_TRANSITION_TIME
},w["default"].createElement(j["default"],{actions:t,items:r,key:r.length>0})):null}},{key:"renderGalleryView",value:function ae(){var e=this,t="table"===this.props.view?z["default"]:L["default"],n=this.props.queuedFiles.items.filter(function(t){
return!t.id||!e.props.files.find(function(e){return e.id===t.id})}).map(function(e){return d({},e,{uploading:!(e.id>0)})}),r=[].concat(s(n),s(this.props.files)).map(function(t){return d({},t||{},{selected:e.itemIsSelected(t.id),
highlighted:e.itemIsHighlighted(t.id)})}),o=this.props,i=o.type,a=o.loading,l=o.page,u=o.totalCount,p=o.limit,c=o.sort,f=o.selectedFiles,h=o.badges,m={selectableItems:"admin"===i,files:r,loading:a,page:l,
totalCount:u,limit:p,sort:c,selectedFiles:f,badges:h,onSort:this.handleSort,onSetPage:this.handleSetPage,onOpenFile:this.handleOpenFile,onOpenFolder:this.handleOpenFolder,onSelect:this.handleSelect,onCancelUpload:this.handleCancelUpload,
onDropFiles:this.handleMoveFiles,onRemoveErroredUpload:this.handleRemoveErroredUpload,onEnableDropzone:this.handleEnableDropzone}
return w["default"].createElement(t,m)}},{key:"render",value:function le(){if(!this.props.folder)return this.props.errorMessage?w["default"].createElement("div",{className:"gallery__error flexbox-area-grow"
},w["default"].createElement("div",{className:"gallery__error-message"},w["default"].createElement("h3",null,C["default"]._t("AssetAdmin.DROPZONE_RESPONSE_ERROR","Server responded with an error.")),w["default"].createElement("p",null,this.props.errorMessage))):w["default"].createElement("div",{
className:"flexbox-area-grow"})
var e=w["default"].createElement("div",{className:"gallery_messages"},this.props.errorMessage&&w["default"].createElement(G["default"],{value:this.props.errorMessage,type:"danger"}),this.props.noticeMessage&&w["default"].createElement(G["default"],{
value:this.props.noticeMessage,type:"success"}),this.renderSearchAlert()),t={height:B["default"].THUMBNAIL_HEIGHT,width:B["default"].THUMBNAIL_WIDTH},n={url:this.props.createFileApiUrl,method:this.props.createFileApiMethod,
paramName:"Upload",clickable:"#upload-button"},r=this.props.securityId,o=this.props.folder.canEdit&&this.props.enableDropzone,i=["panel","panel--padded","panel--scrollable","gallery__main"]
return"insert"===this.props.type&&i.push("insert-media-modal__main"),w["default"].createElement("div",{className:"flexbox-area-grow gallery__outer"},this.renderBulkActions(),w["default"].createElement(N["default"],{
name:"gallery-container",canUpload:o,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,
preview:t,folderId:this.props.folderId,options:n,securityID:r,uploadButton:!1},w["default"].createElement(te["default"],{className:i.join(" ")},this.renderToolbar(),e,this.renderGalleryView())))}}]),t}(S.Component),oe={
page:1,limit:15,sort:ne[0].field+","+ne[0].direction},ie={loading:S.PropTypes.bool,sort:S.PropTypes.string,files:S.PropTypes.arrayOf(S.PropTypes.shape({id:S.PropTypes.number,parent:S.PropTypes.shape({id:S.PropTypes.number
})})).isRequired,selectedFiles:S.PropTypes.arrayOf(S.PropTypes.number),totalCount:S.PropTypes.number,page:S.PropTypes.number,limit:S.PropTypes.number,badges:S.PropTypes.arrayOf(S.PropTypes.shape({id:S.PropTypes.number,
message:S.PropTypes.node,status:S.PropTypes.string})),onOpenFile:S.PropTypes.func.isRequired,onOpenFolder:S.PropTypes.func.isRequired,onSort:S.PropTypes.func.isRequired,onSetPage:S.PropTypes.func.isRequired
},se=d({},oe,{selectableItems:!1}),ae=d({},ie,{selectableItems:S.PropTypes.bool,onSelect:S.PropTypes.func,onCancelUpload:S.PropTypes.func,onDelete:w["default"].PropTypes.func,onRemoveErroredUpload:S.PropTypes.func,
onEnableDropzone:S.PropTypes.func})
re.defaultProps=d({},oe,{type:"admin",view:"tile",enableDropzone:!0}),re.propTypes=d({},ie,{client:w["default"].PropTypes.object,onUploadSuccess:w["default"].PropTypes.func,onCreateFolderSuccess:w["default"].PropTypes.func,
onMoveFilesSuccess:w["default"].PropTypes.func,onDelete:w["default"].PropTypes.func,type:S.PropTypes.oneOf(["insert","select","admin"]),view:S.PropTypes.oneOf(["tile","table"]),dialog:S.PropTypes.bool,
fileId:S.PropTypes.number,folderId:S.PropTypes.number.isRequired,folder:S.PropTypes.shape({id:S.PropTypes.number,title:S.PropTypes.string,parentId:S.PropTypes.number,canView:S.PropTypes.bool,canEdit:S.PropTypes.bool
}),queuedFiles:S.PropTypes.shape({items:S.PropTypes.array.isRequired}),errorMessage:S.PropTypes.string,actions:S.PropTypes.object,securityId:S.PropTypes.string,onViewChange:S.PropTypes.func.isRequired,
createFileApiUrl:S.PropTypes.string,createFileApiMethod:S.PropTypes.string,search:S.PropTypes.object,enableDropzone:S.PropTypes.bool}),re.fragments={fileInterface:(0,J["default"])(h),file:(0,J["default"])(m),
folder:(0,J["default"])(g)}
var le=(0,J["default"])(y,re.fragments.fileInterface,re.fragments.file),ue=(0,J["default"])(v,re.fragments.fileInterface,re.fragments.file)
t.Gallery=re,t.sorters=ne,t.galleryViewPropTypes=ae,t.galleryViewDefaultProps=se,t["default"]=(0,D.compose)((0,A.connect)(p,c),(0,Z.graphql)(ue,{props:function pe(e){var t=e.mutate,n=e.ownProps.actions


return{actions:d({},n,{mutate:d({},n.mutate,{moveFiles:function r(e,n){return t({variables:{folderId:e,fileIds:n}})}})})}}}),(0,Z.graphql)(le,{props:function ce(e){var t=e.mutate,n=e.ownProps,r=n.errors,o=n.actions


return{errorMessage:r&&r[0].message,actions:d({},o,{mutate:d({},o.mutate,{createFolder:function i(e,n){return t({variables:{folder:{parentId:e,name:n}}})}})})}}}),function(e){return(0,Z.withApollo)(e)})(re)

},function(e,t){e.exports=jQuery},function(e,t){e.exports=ReactDom},function(e,t){e.exports=ReactAddonsTestUtils},function(e,t){e.exports=ReactAddonsCssTransitionGroup},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function P(e,t,n){null===e&&(e=Function.prototype)


var r=Object.getOwnPropertyDescriptor(e,t)
if(void 0===r){var o=Object.getPrototypeOf(e)
return null===o?void 0:P(o,t,n)}if("value"in r)return r.value
var i=r.get
if(void 0!==i)return i.call(n)},p=n(4),c=r(p),d=n(23),f=r(d),h=n(10),m=r(h),g=n(3),y=r(g),v=n(27),b=r(v),_=n(22),E=r(_),C=n(29),S=0,w=function(e){function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.dropzone=null,n.dragging=!1,n.handleAddedFile=n.handleAddedFile.bind(n),n.handleDragEnter=n.handleDragEnter.bind(n),n.handleDragLeave=n.handleDragLeave.bind(n),n.handleDrop=n.handleDrop.bind(n),
n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleError=n.handleError.bind(n),n.handleSending=n.handleSending.bind(n),n.handleSuccess=n.handleSuccess.bind(n),n.loadImage=n.loadImage.bind(n),
n}return s(t,e),l(t,[{key:"componentDidMount",value:function n(){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this)
var e=this.getDefaultOptions(),n=this.props.uploadSelector
if(!n&&this.props.uploadButton&&(n=".asset-dropzone__upload-button"),n){var r=(0,E["default"])(f["default"].findDOMNode(this)).find(n)
r&&r.length&&(e.clickable=r.toArray())}this.dropzone=new b["default"](f["default"].findDOMNode(this),a({},e,this.props.options))
var o=this.props.name
o&&this.dropzone.hiddenFileInput.classList.add("dz-input-"+o),"undefined"!=typeof this.props.promptOnRemove&&this.setPromptOnRemove(this.props.promptOnRemove)}},{key:"componentWillUnmount",value:function r(){
u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentWillUnmount",this).call(this),this.dropzone.disable()}},{key:"componentWillReceiveProps",value:function p(e){e.canUpload?this.dropzone&&this.dropzone.enable():this.dropzone.disable()

}},{key:"render",value:function d(){var e=["asset-dropzone"]
this.props.className&&e.push(this.props.className)
var t={className:"asset-dropzone__upload-button ss-ui-button font-icon-upload",type:"button"}
return this.props.canUpload||(t.disabled=!0),this.dragging===!0&&e.push("dragging"),c["default"].createElement("div",{className:e.join(" ")},this.props.uploadButton&&c["default"].createElement("button",t,y["default"]._t("AssetAdmin.DROPZONE_UPLOAD")),this.props.children)

}},{key:"getDefaultOptions",value:function h(){return{autoProcessQueue:!1,addedfile:this.handleAddedFile,dragenter:this.handleDragEnter,dragleave:this.handleDragLeave,drop:this.handleDrop,uploadprogress:this.handleUploadProgress,
dictDefaultMessage:y["default"]._t("AssetAdmin.DROPZONE_DEFAULT_MESSAGE"),dictFallbackMessage:y["default"]._t("AssetAdmin.DROPZONE_FALLBACK_MESSAGE"),dictFallbackText:y["default"]._t("AssetAdmin.DROPZONE_FALLBACK_TEXT"),
dictInvalidFileType:y["default"]._t("AssetAdmin.DROPZONE_INVALID_FILE_TYPE"),dictResponseError:y["default"]._t("AssetAdmin.DROPZONE_RESPONSE_ERROR"),dictCancelUpload:y["default"]._t("AssetAdmin.DROPZONE_CANCEL_UPLOAD"),
dictCancelUploadConfirmation:y["default"]._t("AssetAdmin.DROPZONE_CANCEL_UPLOAD_CONFIRMATION"),dictRemoveFile:y["default"]._t("AssetAdmin.DROPZONE_REMOVE_FILE"),dictMaxFilesExceeded:y["default"]._t("AssetAdmin.DROPZONE_MAX_FILES_EXCEEDED"),
error:this.handleError,sending:this.handleSending,success:this.handleSuccess,thumbnailHeight:150,thumbnailWidth:200}}},{key:"getFileCategory",value:function m(e){return e.split("/")[0]}},{key:"handleDragEnter",
value:function g(e){this.props.canUpload&&(this.dragging=!0,this.forceUpdate(),"function"==typeof this.props.handleDragEnter&&this.props.handleDragEnter(e))}},{key:"handleDragLeave",value:function v(e){
var t=f["default"].findDOMNode(this)
this.props.canUpload&&e.target===t&&(this.dragging=!1,this.forceUpdate(),"function"==typeof this.props.handleDragLeave&&this.props.handleDragLeave(e,t))}},{key:"handleUploadProgress",value:function _(e,t,n){
"function"==typeof this.props.handleUploadProgress&&this.props.handleUploadProgress(e,t,n)}},{key:"handleDrop",value:function w(e){this.dragging=!1,this.forceUpdate(),"function"==typeof this.props.handleDrop&&this.props.handleDrop(e)

}},{key:"handleSending",value:function P(e,t,n){var r=this
"function"==typeof this.props.updateFormData&&this.props.updateFormData(n),n.append("SecurityID",this.props.securityID),n.append("ParentID",this.props.folderId)
var o=a({},t,{abort:function i(){r.dropzone.cancelUpload(e),t.abort()}})
"function"==typeof this.props.handleSending&&this.props.handleSending(e,o,n)}},{key:"generateQueuedId",value:function F(){return++S}},{key:"handleAddedFile",value:function x(e){var t=this
if(this.props.options.maxFiles&&this.dropzone.files.length>this.props.options.maxFiles)return this.dropzone.removeFile(this.dropzone.files[0]),"function"==typeof this.props.handleMaxFilesExceeded&&this.props.handleMaxFilesExceeded(e),
Promise.resolve()
if("function"==typeof this.props.canFileUpload&&!this.props.canFileUpload(e))return this.dropzone.removeFile(e),Promise.resolve()
if(!this.props.canUpload)return this.dropzone.removeFile(e),Promise.reject(new Error(y["default"]._t("AssetAdmin.DROPZONE_CANNOT_UPLOAD")))
e._queuedId=this.generateQueuedId()
var n=new Promise(function(n){var r=new FileReader
r.onload=function(r){if("image"===t.getFileCategory(e.type)){var o=document.createElement("img")
n(t.loadImage(o,r.target.result))}else n({})},r.readAsDataURL(e)})
return n.then(function(n){var r={height:n.height,width:n.width,category:t.getFileCategory(e.type),filename:e.name,queuedId:e._queuedId,size:e.size,title:t.getFileTitle(e.name),extension:(0,C.getFileExtension)(e.name),
type:e.type,url:n.thumbnailURL,thumbnail:n.thumbnailURL,smallThumbail:n.thumbnailURL}
return t.props.handleAddedFile(r),t.dropzone.processFile(e),r})}},{key:"getFileTitle",value:function T(e){return e.replace(/[.][^.]+$/,"").replace(/-_/," ")}},{key:"loadImage",value:function O(e,t){var n=this


return new Promise(function(r){e.onload=function(){var t=document.createElement("canvas"),o=t.getContext("2d"),i=2*n.props.preview.width,s=2*n.props.preview.height,a=e.naturalWidth/e.naturalHeight
e.naturalWidth<i||e.naturalHeight<s?(t.width=e.naturalWidth,t.height=e.naturalHeight):a<1?(t.width=i,t.height=i/a):(t.width=s*a,t.height=s),o.drawImage(e,0,0,t.width,t.height)
var l=t.toDataURL("image/png")
r({width:e.naturalWidth,height:e.naturalHeight,thumbnailURL:l})},e.src=t})}},{key:"handleError",value:function I(e,t){this.dropzone.removeFile(e),"function"==typeof this.props.handleError&&this.props.handleError(e,t)

}},{key:"handleSuccess",value:function A(e){this.dropzone.removeFile(e),this.props.handleSuccess(e)}},{key:"setPromptOnRemove",value:function D(e){this.dropzone.options.dictRemoveFileConfirmation=e}}]),
t}(m["default"])
w.propTypes={folderId:c["default"].PropTypes.number.isRequired,handleAddedFile:c["default"].PropTypes.func.isRequired,handleDragEnter:c["default"].PropTypes.func,handleDragLeave:c["default"].PropTypes.func,
handleDrop:c["default"].PropTypes.func,handleError:c["default"].PropTypes.func.isRequired,handleSending:c["default"].PropTypes.func,updateFormData:c["default"].PropTypes.func,handleSuccess:c["default"].PropTypes.func.isRequired,
handleMaxFilesExceeded:c["default"].PropTypes.func,canFileUpload:c["default"].PropTypes.func,options:c["default"].PropTypes.shape({url:c["default"].PropTypes.string.isRequired}),promptOnRemove:c["default"].PropTypes.string,
securityID:c["default"].PropTypes.string.isRequired,uploadButton:c["default"].PropTypes.bool,uploadSelector:c["default"].PropTypes.string,canUpload:c["default"].PropTypes.bool.isRequired,preview:c["default"].PropTypes.shape({
width:c["default"].PropTypes.number,height:c["default"].PropTypes.number}),className:c["default"].PropTypes.string},w.defaultProps={uploadButton:!0},t["default"]=w},function(e,t,n){(function(e,t){(function(){
var n,r,o,i,s,a,l,u,p=[].slice,c={}.hasOwnProperty,d=function(e,t){function n(){this.constructor=e}for(var r in t)c.call(t,r)&&(e[r]=t[r])
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
try{r=t.dataTransfer.effectAllowed}catch(o){}return t.dataTransfer.dropEffect="move"===r||"linkMove"===r?"move":"copy",n(t),e.emit("dragover",t)}}(this),dragleave:function(e){return function(t){return e.emit("dragleave",t)

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
var r,i,s,a,l,u,p,c,d,f,h,m,g,y,v,b,_,E,C,S,w,P,F,x,T,O,I,A,D,k,N,R,j,U
for(C=new XMLHttpRequest,S=0,x=e.length;S<x;S++)r=e[S],r.xhr=C
m=o(this.options.method,e),_=o(this.options.url,e),C.open(m,_,!0),C.withCredentials=!!this.options.withCredentials,v=null,s=function(t){return function(){var n,o,i
for(i=[],n=0,o=e.length;n<o;n++)r=e[n],i.push(t._errorProcessing(e,v||t.options.dictResponseError.replace("{{statusCode}}",C.status),C))
return i}}(this),b=function(t){return function(n){var o,i,s,a,l,u,p,c,d
if(null!=n)for(i=100*n.loaded/n.total,s=0,u=e.length;s<u;s++)r=e[s],r.upload={progress:i,total:n.total,bytesSent:n.loaded}
else{for(o=!0,i=100,a=0,p=e.length;a<p;a++)r=e[a],100===r.upload.progress&&r.upload.bytesSent===r.upload.total||(o=!1),r.upload.progress=i,r.upload.bytesSent=r.upload.total
if(o)return}for(d=[],l=0,c=e.length;l<c;l++)r=e[l],d.push(t.emit("uploadprogress",r,i,r.upload.bytesSent))
return d}}(this),C.onload=function(n){return function(r){var o
if(e[0].status!==t.CANCELED&&4===C.readyState){if(v=C.responseText,C.getResponseHeader("content-type")&&~C.getResponseHeader("content-type").indexOf("application/json"))try{v=JSON.parse(v)}catch(i){r=i,
v="Invalid JSON response from server."}return b(),200<=(o=C.status)&&o<300?n._finished(e,v,r):s()}}}(this),C.onerror=function(n){return function(){if(e[0].status!==t.CANCELED)return s()}}(this),y=null!=(D=C.upload)?D:C,
y.onprogress=b,u={Accept:"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"},this.options.headers&&n(u,this.options.headers)
for(a in u)l=u[a],l&&C.setRequestHeader(a,l)
if(i=new FormData,this.options.params){k=this.options.params
for(h in k)E=k[h],i.append(h,E)}for(w=0,T=e.length;w<T;w++)r=e[w],this.emit("sending",r,C,i)
if(this.options.uploadMultiple&&this.emit("sendingmultiple",e,C,i),"FORM"===this.element.tagName)for(N=this.element.querySelectorAll("input, textarea, select, button"),P=0,O=N.length;P<O;P++)if(c=N[P],
d=c.getAttribute("name"),f=c.getAttribute("type"),"SELECT"===c.tagName&&c.hasAttribute("multiple"))for(R=c.options,F=0,I=R.length;F<I;F++)g=R[F],g.selected&&i.append(d,g.value)
else(!f||"checkbox"!==(j=f.toLowerCase())&&"radio"!==j||c.checked)&&i.append(d,c.value)
for(p=A=0,U=e.length-1;0<=U?A<=U:A>=U;p=0<=U?++A:--A)i.append(this._getParamName(p),e[p],this._renameFilename(e[p].name))
return this.submitRequest(C,i,e)},t.prototype.submitRequest=function(e,t,n){return e.send(t)},t.prototype._finished=function(e,n,r){var o,i,s
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
try{for(i=0,a=e.length;i<a;i++)r=e[i],o.push(this.getElement(r,t))}catch(p){n=p,o=null}}else if("string"==typeof e)for(o=[],u=document.querySelectorAll(e),s=0,l=u.length;s<l;s++)r=u[s],o.push(r)
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
try{u.doScroll("left")}catch(t){return e=t,void setTimeout(s,50)}return i("poll")},"complete"!==r.readyState){if(r.createEventObject&&u.doScroll){try{p=!e.frameElement}catch(c){}p&&s()}return r[n](a+"DOMContentLoaded",i,!1),
r[n](a+"readystatechange",i,!1),e[n](a+"load",i,!1)}},n._autoDiscoverFunction=function(){if(n.autoDiscover)return n.discover()},i(window,n._autoDiscoverFunction)}).call(this)}).call(t,n(22),n(28)(e))},function(e,t){
e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],e.webpackPolyfill=1),e}},function(e,t){e.exports=DataFormat},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return{gallery:e.assetAdmin.gallery
}}Object.defineProperty(t,"__esModule",{value:!0}),t.BulkActions=void 0
var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(22),p=r(u),c=n(4),d=r(c),f=n(23),h=r(f),m=n(10),g=r(m),y=n(24),v=r(y),b=n(6),_=t.BulkActions=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.onChangeValue=n.onChangeValue.bind(n),n}return s(t,e),l(t,[{key:"componentDidMount",value:function n(){var e=(0,p["default"])(h["default"].findDOMNode(this)).find(".dropdown")
e.chosen({allow_single_deselect:!0,disable_search_threshold:20}),e.change(function(){return v["default"].Simulate.click(e.find(":selected")[0])})}},{key:"render",value:function r(){var e=this,t=this.props.actions.map(function(t,n){
var r=e.props.items.length&&(!t.canApply||t.canApply(e.props.items))
if(!r)return""
var o=["bulk-actions__action","ss-ui-button","ui-corner-all",t.className||"font-icon-info-circled"].join(" ")
return d["default"].createElement("button",{type:"button",className:o,key:n,onClick:e.onChangeValue,value:t.value},t.label)})
return d["default"].createElement("div",{className:"bulk-actions fieldholder-small"},d["default"].createElement("div",{className:"bulk-actions-counter"},this.props.items.length),t)}},{key:"getOptionByValue",
value:function a(e){return this.props.actions.find(function(t){return t.value===e})}},{key:"onChangeValue",value:function u(e){var t=this,n=null,r=this.getOptionByValue(e.target.value)
return null===r?null:(n="function"==typeof r.confirm?r.confirm(this.props.items).then(function(){return r.callback(t.props.items)})["catch"](function(e){if("cancelled"!==e)throw e}):r.callback(this.props.items)||Promise.resolve(),
(0,p["default"])(h["default"].findDOMNode(this)).find(".dropdown").val("").trigger("liszt:updated"),n)}}]),t}(g["default"])
_.propTypes={items:d["default"].PropTypes.array,actions:d["default"].PropTypes.arrayOf(d["default"].PropTypes.shape({value:d["default"].PropTypes.string.isRequired,label:d["default"].PropTypes.string.isRequired,
className:d["default"].PropTypes.string,destructive:d["default"].PropTypes.bool,callback:d["default"].PropTypes.func,canApply:d["default"].PropTypes.func,confirm:d["default"].PropTypes.func}))},t["default"]=(0,
b.connect)(a)(_)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(3),p=r(u),c=n(4),d=r(c),f=n(32),h=n(21),m=n(39),g=r(m),y=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.renderItem=n.renderItem.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handlePrevPage=n.handlePrevPage.bind(n),n.handleNextPage=n.handleNextPage.bind(n),n.handleDrag=n.handleDrag.bind(n),n}
return s(t,e),l(t,[{key:"handleDrag",value:function n(e){this.props.onEnableDropzone(!e)}},{key:"handleSetPage",value:function r(e){this.props.onSetPage(e)}},{key:"handleNextPage",value:function u(){this.handleSetPage(this.props.page+1)

}},{key:"handlePrevPage",value:function c(){this.handleSetPage(this.props.page-1)}},{key:"folderFilter",value:function h(e){return"folder"===e.type}},{key:"fileFilter",value:function m(e){return"folder"!==e.type

}},{key:"renderPagination",value:function y(){if(this.props.totalCount<=this.props.limit)return null
var e={setPage:this.handleSetPage,maxPage:Math.ceil(this.props.totalCount/this.props.limit),next:this.handleNextPage,nextText:p["default"]._t("Pagination.NEXT","Next"),previous:this.handlePrevPage,previousText:p["default"]._t("Pagination.PREVIOUS","Previous"),
currentPage:this.props.page-1,useGriddleStyles:!1}
return d["default"].createElement("div",{className:"griddle-footer"},d["default"].createElement(g["default"].GridPagination,e))}},{key:"renderItem",value:function v(e,t){var n=this.props.badges.find(function(t){
return t.id===e.id}),r={key:t,item:e,selectedFiles:this.props.selectedFiles,onDrag:this.handleDrag,badge:n}
return e.uploading?a(r,{onCancelUpload:this.props.onCancelUpload,onRemoveErroredUpload:this.props.onRemoveErroredUpload}):a(r,{onActivate:"folder"===e.type?this.props.onOpenFolder:this.props.onOpenFile
}),this.props.selectableItems&&a(r,{selectable:!0,onSelect:this.props.onSelect}),"folder"===e.type?(a(r,{onDropFiles:this.props.onDropFiles}),d["default"].createElement(f.Folder,r)):d["default"].createElement(f.File,r)

}},{key:"render",value:function b(){return d["default"].createElement("div",{className:"gallery__main-view--tile"},d["default"].createElement("div",{className:"gallery__folders"},this.props.files.filter(this.folderFilter).map(this.renderItem)),d["default"].createElement("div",{
className:"gallery__files"},this.props.files.filter(this.fileFilter).map(this.renderItem)),0===this.props.files.length&&!this.props.loading&&d["default"].createElement("p",{className:"gallery__no-item-notice"
},p["default"]._t("AssetAdmin.NOITEMSFOUND")),d["default"].createElement("div",{className:"gallery__load"},this.renderPagination()))}}]),t}(c.Component)
y.defaultProps=h.galleryViewDefaultProps,y.propTypes=h.galleryViewPropTypes,t["default"]=y},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0}),t.File=t.Folder=void 0
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(3),u=r(l),p=n(4),c=r(p),d=n(18),f=r(d),h=n(10),m=r(h),g=n(33),y=r(g),v=n(34),b=r(v),_=n(37),E=r(_),C=n(38),S=r(C),w=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSelect=n.handleSelect.bind(n),n.handleActivate=n.handleActivate.bind(n),n.handleKeyDown=n.handleKeyDown.bind(n),n.handleCancelUpload=n.handleCancelUpload.bind(n),n.preventFocus=n.preventFocus.bind(n),
n}return s(t,e),a(t,[{key:"handleActivate",value:function n(e){e.stopPropagation(),"function"==typeof this.props.onActivate&&this.props.onActivate(e,this.props.item)}},{key:"handleSelect",value:function r(e){
e.stopPropagation(),e.preventDefault(),"function"==typeof this.props.onSelect&&this.props.onSelect(e,this.props.item)}},{key:"getThumbnailStyles",value:function l(){var e=this.props.item.thumbnail
return this.isImage()&&e&&(this.exists()||this.uploading())?{backgroundImage:"url("+e+")"}:{}}},{key:"hasError",value:function p(){var p=!1
return this.props.item.message&&(p="error"===this.props.item.message.type),p}},{key:"getErrorMessage",value:function d(){var e=null
return this.hasError()?e=this.props.item.message.value:this.exists()||this.uploading()||(e=u["default"]._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==e?c["default"].createElement("span",{
className:"gallery-item__error-message"},e):null}},{key:"getThumbnailClassNames",value:function h(){var e=["gallery-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&e.push("gallery-item__thumbnail--small"),e.join(" ")}},{key:"getItemClassNames",value:function m(){var e=this.props.item.category||"false",t=["gallery-item gallery-item--"+e]


return this.exists()||this.uploading()||t.push("gallery-item--missing"),this.props.selectable&&(t.push("gallery-item--selectable"),this.props.item.selected&&t.push("gallery-item--selected")),this.props.enlarged&&t.push("gallery-item--enlarged"),
this.props.item.highlighted&&t.push("gallery-item--highlighted"),this.hasError()&&t.push("gallery-item--error"),t.join(" ")}},{key:"getStatusFlags",value:function g(){var e=[]
return"folder"!==this.props.item.type&&(this.props.item.draft?e.push(c["default"].createElement("span",{key:"status-draft",title:u["default"]._t("File.DRAFT","Draft"),className:"gallery-item--draft"})):this.props.item.modified&&e.push(c["default"].createElement("span",{
key:"status-modified",title:u["default"]._t("File.MODIFIED","Modified"),className:"gallery-item--modified"}))),e}},{key:"isImage",value:function y(){return"image"===this.props.item.category}},{key:"exists",
value:function v(){return this.props.item.exists}},{key:"uploading",value:function b(){return this.props.item.uploading}},{key:"complete",value:function _(){return this.uploading()&&this.props.item.id>0

}},{key:"isImageSmallerThanThumbnail",value:function E(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1
var e=this.props.item.width,t=this.props.item.height
return t&&e&&t<f["default"].THUMBNAIL_HEIGHT&&e<f["default"].THUMBNAIL_WIDTH}},{key:"handleKeyDown",value:function C(e){e.stopPropagation(),f["default"].SPACE_KEY_CODE===e.keyCode&&(e.preventDefault(),
this.handleSelect(e)),f["default"].RETURN_KEY_CODE===e.keyCode&&this.handleActivate(e)}},{key:"preventFocus",value:function w(e){e.preventDefault()}},{key:"handleCancelUpload",value:function P(e){e.stopPropagation(),
this.hasError()?this.props.onRemoveErroredUpload(this.props.item):this.props.onCancelUpload&&this.props.onCancelUpload(this.props.item)}},{key:"getProgressBar",value:function F(){var e=null,t={className:"gallery-item__progress-bar",
style:{width:this.props.item.progress+"%"}}
return this.hasError()||!this.uploading()||this.complete()||(e=c["default"].createElement("div",{className:"gallery-item__upload-progress"},c["default"].createElement("div",t))),e}},{key:"render",value:function x(){
var e=null,t=null,n=null
this.props.selectable&&(e=this.handleSelect,t="font-icon-tick"),this.uploading()?(e=this.handleCancelUpload,t="font-icon-cancel"):this.exists()&&(n=c["default"].createElement("div",{className:"gallery-item--overlay font-icon-edit"
},"View"))
var r=this.props.badge
return c["default"].createElement("div",{className:this.getItemClassNames(),"data-id":this.props.item.id,tabIndex:"0",onKeyDown:this.handleKeyDown,onClick:this.handleActivate},!!r&&c["default"].createElement(S["default"],{
className:"gallery-item__badge",status:r.status,message:r.message}),c["default"].createElement("div",{ref:"thumbnail",className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()},n,this.getStatusFlags()),this.getProgressBar(),this.getErrorMessage(),c["default"].createElement("div",{
className:"gallery-item__title",ref:"title"},c["default"].createElement("label",{className:"gallery-item__checkbox-label "+t,onClick:e},c["default"].createElement("input",{className:"gallery-item__checkbox",
type:"checkbox",title:u["default"]._t("AssetAdmin.SELECT"),tabIndex:"-1",onMouseDown:this.preventFocus})),this.props.item.title))}}]),t}(m["default"])
w.propTypes={item:y["default"],highlighted:p.PropTypes.bool,selected:p.PropTypes.bool,enlarged:p.PropTypes.bool,message:p.PropTypes.shape({value:p.PropTypes.string,type:p.PropTypes.string}),selectable:p.PropTypes.bool,
onActivate:p.PropTypes.func,onSelect:p.PropTypes.func,onCancelUpload:p.PropTypes.func,onRemoveErroredUpload:p.PropTypes.func}
var P="GalleryItem",F=(0,b["default"])(P)(w),x=(0,E["default"])(P)(F)
t.Folder=x,t.File=F,t["default"]=w},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(4),i=r(o),s=i["default"].PropTypes.shape({exists:i["default"].PropTypes.bool,type:i["default"].PropTypes.string,smallThumbnail:i["default"].PropTypes.string,thumbnail:i["default"].PropTypes.string,
width:i["default"].PropTypes.number,height:i["default"].PropTypes.number,category:i["default"].PropTypes.oneOfType([i["default"].PropTypes.bool,i["default"].PropTypes.string]).isRequired,id:i["default"].PropTypes.number.isRequired,
url:i["default"].PropTypes.string,title:i["default"].PropTypes.string.isRequired,progress:i["default"].PropTypes.number})
t["default"]=s},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t={beginDrag:function a(e){
"function"==typeof e.onDrag&&e.onDrag(!0)
var t=e.selectedFiles.concat([])
return 0===t.length&&t.push(e.item.id),{selected:t,props:e}},endDrag:function f(e){"function"==typeof e.onDrag&&e.onDrag(!1)}},n=function h(e,t){return{connectDragPreview:e.dragPreview(),connectDragSource:e.dragSource(),
isDragging:t.isDragging()}},r=(0,c.DragSource)(e,t,n)
return function(e){var t=function(t){function n(){return o(this,n),i(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return s(n,t),l(n,[{key:"componentDidMount",value:function r(){this.props.connectDragPreview((0,
d.getEmptyImage)(),{captureDraggingState:!0})}},{key:"render",value:function a(){var t=this.props.connectDragSource,n=p["default"].createElement(e,this.props)
return t("string"==typeof n.type?n:p["default"].createElement("div",{className:"gallery-item__draggable"},n))}}]),n}(u.Component)
return t.propTypes={connectDragSource:u.PropTypes.func.isRequired,connectDragPreview:u.PropTypes.func.isRequired,item:u.PropTypes.shape({id:u.PropTypes.number.isRequired}).isRequired,onDrag:u.PropTypes.func,
selectedFiles:u.PropTypes.arrayOf(u.PropTypes.number)},r(t)}}Object.defineProperty(t,"__esModule",{value:!0})
var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()
t["default"]=a
var u=n(4),p=r(u),c=n(35),d=n(36)},function(e,t){e.exports=ReactDND},function(e,t){e.exports=ReactDNDHtml5Backend},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t={drop:function a(e,t){
if(t.canDrop()){var n=t.getItem()
e.onDropFiles(e.item.id,n.selected)}},canDrop:function d(e,t){var n=t.getItem()
return 1!==n.selected.length||n.selected[0]!==e.item.id}},n=function f(e,t){var n=t.isOver()
return{enlarged:n&&t.canDrop(),connectDropTarget:e.dropTarget(),isOver:n}},r=(0,c.DropTarget)(e,t,n)
return function(e){var t=function(t){function n(){return o(this,n),i(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return s(n,t),l(n,[{key:"render",value:function r(){var t=this.props.connectDropTarget,n=p["default"].createElement(e,this.props)


return t("string"==typeof n.type?n:p["default"].createElement("div",{className:"gallery-item__droppable"},n))}}]),n}(u.Component)
return t.propTypes={connectDropTarget:u.PropTypes.func.isRequired,item:u.PropTypes.shape({id:u.PropTypes.number.isRequired}).isRequired},r(t)}}Object.defineProperty(t,"__esModule",{value:!0})
var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()
t["default"]=a
var u=n(4),p=r(u),c=n(35)},function(e,t){e.exports=Badge},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(4),i=n(40),s=n(207),a=n(208),l=n(209),u=n(215),p=n(216),c=n(198),d=n(233),f=n(234),h=n(235),m=n(42),g=n(205),y=n(217),v=n(236),b=n(238),_=n(161),E=n(239),C=n(218),S=n(240),w=n(241),P=n(111),F=n(244),x=n(245),T=n(246),O=n(247),I=n(43),A=n(193),D=n(158),k=n(279),N=n(149),R=n(134),j=o.createClass({
displayName:"Griddle",statics:{GridTable:i,GridFilter:s,GridPagination:a,GridSettings:l,GridRow:p},columnSettings:null,rowSettings:null,getDefaultProps:function U(){return{columns:[],gridMetadata:null,
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
},defaultFilter:function L(e,t){var n=this
return D(e,function(e){for(var r=y.keys(e),o=0;o<r.length;o++){var i=n.columnSettings.getMetadataColumnProperty(r[o],"filterable",!0)
if(i&&(y.getAt(e,r[o])||"").toString().toLowerCase().indexOf(t.toLowerCase())>=0)return!0}return!1})},filterByColumnFilters:function M(e){var t=Object.keys(e).reduce(function(t,n){return D(t,function(t){
return y.getAt(t,n||"").toString().toLowerCase().indexOf(e[n].toLowerCase())>=0})},this.props.results),n={columnFilters:e}
e?(n.filteredResults=t,n.maxPage=this.getMaxPage(n.filteredResults)):this.state.filter?n.filteredResults=this.props.useCustomFilterer?this.props.customFilterer(this.props.results,filter):this.defaultFilter(this.props.results,filter):n.filteredResults=null,
this.setState(n)},filterByColumn:function z(e,t){var n=this.state.columnFilters
if(n.hasOwnProperty(t)&&!e)n=O(n,t)
else{var r={}
r[t]=e,n=A({},n,r)}this.filterByColumnFilters(n)},setFilter:function q(e){if(this.props.useExternal)return void this.props.externalSetFilter(e)
var t=this,n={page:0,filter:e}
n.filteredResults=this.props.useCustomFilterer?this.props.customFilterer(this.props.results,e):this.defaultFilter(this.props.results,e),n.maxPage=t.getMaxPage(n.filteredResults),(T(e)||x(e)||F(e))&&(n.filter=e,
n.filteredResults=null),t.setState(n),this._resetSelectedRows()},setPageSize:function B(e){return this.props.useExternal?(this.setState({resultsPerPage:e}),void this.props.externalSetPageSize(e)):(this.state.resultsPerPage=e,
void this.setMaxPage())},toggleColumnChooser:function H(){this.setState({showColumnChooser:!this.state.showColumnChooser})},isNullOrUndefined:function G(e){return void 0===e||null===e},shouldUseCustomRowComponent:function V(){
return this.isNullOrUndefined(this.state.useCustomRowComponent)?this.props.useCustomRowComponent:this.state.useCustomRowComponent},shouldUseCustomGridComponent:function Q(){return this.isNullOrUndefined(this.state.useCustomGridComponent)?this.props.useCustomGridComponent:this.state.useCustomGridComponent

},toggleCustomComponent:function W(){"grid"===this.state.customComponentType?this.setState({useCustomGridComponent:!this.shouldUseCustomGridComponent()}):"row"===this.state.customComponentType&&this.setState({
useCustomRowComponent:!this.shouldUseCustomRowComponent()})},getMaxPage:function $(e,t){if(this.props.useExternal)return this.props.externalMaxPage
t||(t=(e||this.getCurrentResults()).length)
var n=Math.ceil(t/this.state.resultsPerPage)
return n},setMaxPage:function K(e){var t=this.getMaxPage(e)
this.state.maxPage!==t&&this.setState({page:0,maxPage:t,filteredColumns:this.columnSettings.filteredColumns})},setPage:function Y(e){if(this.props.useExternal)return void this.props.externalSetPage(e)
if(e*this.state.resultsPerPage<=this.state.resultsPerPage*this.state.maxPage){var t=this,n={page:e}
t.setState(n)}this.props.enableInfiniteScroll&&this.setState({isSelectAllChecked:!1})},setColumns:function Z(e){this.columnSettings.filteredColumns=P(e)?e:[e],this.setState({filteredColumns:this.columnSettings.filteredColumns
})},nextPage:function X(){var e=this.getCurrentPage()
e<this.getCurrentMaxPage()-1&&this.setPage(e+1)},previousPage:function J(){var e=this.getCurrentPage()
e>0&&this.setPage(e-1)},changeSort:function ee(e){if(this.props.enableSort!==!1){if(this.props.useExternal){var t=this.props.externalSortColumn!==e||!this.props.externalSortAscending
return this.setState({sortColumn:e,sortDirection:t?"asc":"desc"}),void this.props.externalChangeSort(e,t)}var n=_(this.props.columnMetadata,{columnName:e})||{},r=n.sortDirectionCycle?n.sortDirectionCycle:[null,"asc","desc"],o=null,i=r.indexOf(this.state.sortDirection&&e===this.state.sortColumn?this.state.sortDirection:null)


i=(i+1)%r.length,o=r[i]?r[i]:null
var s={page:0,sortColumn:e,sortDirection:o}
this.setState(s)}},componentWillReceiveProps:function te(e){if(this.setMaxPage(e.results),e.resultsPerPage!==this.props.resultsPerPage&&this.setPageSize(e.resultsPerPage),this.columnSettings.columnMetadata=e.columnMetadata,
e.results.length>0){var t=y.keys(e.results[0]),n=this.columnSettings.allColumns.length==t.length&&this.columnSettings.allColumns.every(function(e,n){return e===t[n]})
n||(this.columnSettings.allColumns=t)}else this.columnSettings.allColumns.length>0&&(this.columnSettings.allColumns=[])
if(e.columns!==this.columnSettings.filteredColumns&&(this.columnSettings.filteredColumns=e.columns),e.selectedRowIds){var r=this.getDataForRender(this.getCurrentResults(e.results),this.columnSettings.getColumns(),!0)


this.setState({isSelectAllChecked:this._getAreAllRowsChecked(e.selectedRowIds,I(r,this.props.uniqueIdentifier)),selectedRowIds:e.selectedRowIds})}},getInitialState:function ne(){var e={maxPage:0,page:0,
filteredResults:null,filteredColumns:[],filter:"",columnFilters:{},resultsPerPage:this.props.resultsPerPage||5,showColumnChooser:!1,isSelectAllChecked:!1,selectedRowIds:this.props.selectedRowIds}
return e},componentWillMount:function re(){this.verifyExternal(),this.verifyCustom(),this.columnSettings=new m(this.props.results.length>0?y.keys(this.props.results[0]):[],this.props.columns,this.props.childrenColumnName,this.props.columnMetadata,this.props.metadataColumns),
this.rowSettings=new g(this.props.rowMetadata,this.props.useCustomTableRowComponent&&this.props.customTableRowComponent?this.props.customTableRowComponent:p,this.props.useCustomTableRowComponent),this.props.initialSort&&this.changeSort(this.props.initialSort),
this.setMaxPage(),this.shouldUseCustomGridComponent()?this.setState({customComponentType:"grid"}):this.shouldUseCustomRowComponent()?this.setState({customComponentType:"row"}):this.setState({filteredColumns:this.columnSettings.filteredColumns
})},componentDidMount:function oe(){if(this.props.componentDidMount&&"function"==typeof this.props.componentDidMount)return this.props.componentDidMount()},verifyExternal:function ie(){this.props.useExternal===!0&&(null===this.props.externalSetPage&&console.error("useExternal is set to true but there is no externalSetPage function specified."),
null===this.props.externalChangeSort&&console.error("useExternal is set to true but there is no externalChangeSort function specified."),null===this.props.externalSetFilter&&console.error("useExternal is set to true but there is no externalSetFilter function specified."),
null===this.props.externalSetPageSize&&console.error("useExternal is set to true but there is no externalSetPageSize function specified."),null===this.props.externalMaxPage&&console.error("useExternal is set to true but externalMaxPage is not set."),
null===this.props.externalCurrentPage&&console.error("useExternal is set to true but externalCurrentPage is not set. Griddle will not page correctly without that property when using external data."))},
verifyCustom:function se(){this.props.useCustomGridComponent===!0&&null===this.props.customGridComponent&&console.error("useCustomGridComponent is set to true but no custom component was specified."),this.props.useCustomRowComponent===!0&&null===this.props.customRowComponent&&console.error("useCustomRowComponent is set to true but no custom component was specified."),
this.props.useCustomGridComponent===!0&&this.props.useCustomRowComponent===!0&&console.error("Cannot currently use both customGridComponent and customRowComponent."),this.props.useCustomFilterer===!0&&null===this.props.customFilterer&&console.error("useCustomFilterer is set to true but no custom filter function was specified."),
this.props.useCustomFilterComponent===!0&&null===this.props.customFilterComponent&&console.error("useCustomFilterComponent is set to true but no customFilterComponent was specified.")},getDataForRender:function ae(e,t,n){
var r=this,o=this
if(""!==this.state.sortColumn){var i=this.state.sortColumn,s=D(this.props.columnMetadata,{columnName:i}),a,l={columns:[],orders:[]}
if(s.length>0&&(a=s[0].hasOwnProperty("customCompareFn")&&s[0].customCompareFn,s[0].multiSort&&(l=s[0].multiSort)),this.state.sortDirection)if("function"==typeof a)2===a.length?(e=e.sort(function(e,t){
return a(R(e,i),R(t,i))}),"desc"===this.state.sortDirection&&e.reverse()):1===a.length&&(e=k(e,function(e){return a(R(e,i))},[this.state.sortDirection]))
else{var u=[N(i)],p=[this.state.sortDirection]
l.columns.forEach(function(e,t){u.push(N(e)),"asc"===l.orders[t]||"desc"===l.orders[t]?p.push(l.orders[t]):p.push(r.state.sortDirection)}),e=k(e,u,p)}}var c=this.getCurrentPage()
if(!this.props.useExternal&&n&&this.state.resultsPerPage*(c+1)<=this.state.resultsPerPage*this.state.maxPage&&c>=0)if(this.isInfiniteScrollEnabled())e=E(e,(c+1)*this.state.resultsPerPage)
else{var d=v(e,c*this.state.resultsPerPage)
e=(b||S)(d,d.length-this.state.resultsPerPage)}for(var f=this.columnSettings.getMetadataColumns,h=[],m=0;m<e.length;m++){var g=e[m]
"undefined"!=typeof g[o.props.childrenColumnName]&&g[o.props.childrenColumnName].length>0&&(g.children=o.getDataForRender(g[o.props.childrenColumnName],t,!1),"children"!==o.props.childrenColumnName&&delete g[o.props.childrenColumnName]),
h.push(g)}return h},getCurrentResults:function le(e){return this.state.filteredResults||e||this.props.results},getCurrentPage:function ue(){return this.props.externalCurrentPage||this.state.page},getCurrentSort:function pe(){
return this.props.useExternal?this.props.externalSortColumn:this.state.sortColumn},getCurrentSortAscending:function ce(){return this.props.useExternal?this.props.externalSortAscending:"asc"===this.state.sortDirection

},getCurrentMaxPage:function de(){return this.props.useExternal?this.props.externalMaxPage:this.state.maxPage},getSortObject:function fe(){return{enableSort:this.props.enableSort,changeSort:this.changeSort,
sortColumn:this.getCurrentSort(),sortAscending:this.getCurrentSortAscending(),sortDirection:this.state.sortDirection,sortAscendingClassName:this.props.sortAscendingClassName,sortDescendingClassName:this.props.sortDescendingClassName,
sortAscendingComponent:this.props.sortAscendingComponent,sortDescendingComponent:this.props.sortDescendingComponent,sortDefaultComponent:this.props.sortDefaultComponent}},_toggleSelectAll:function he(){
var e=this.getDataForRender(this.getCurrentResults(),this.columnSettings.getColumns(),!0),t=!this.state.isSelectAllChecked,n=JSON.parse(JSON.stringify(this.state.selectedRowIds)),r=this
C(e,function(e){r._updateSelectedRowIds(e[r.props.uniqueIdentifier],n,t)},this),this.setState({isSelectAllChecked:t,selectedRowIds:n}),this.props.onSelectionChange&&this.props.onSelectionChange(n,t)},_toggleSelectRow:function me(e,t){
var n=this.getDataForRender(this.getCurrentResults(),this.columnSettings.getColumns(),!0),r=JSON.parse(JSON.stringify(this.state.selectedRowIds))
this._updateSelectedRowIds(e[this.props.uniqueIdentifier],r,t)
var o=this._getAreAllRowsChecked(r,I(n,this.props.uniqueIdentifier))
this.setState({isSelectAllChecked:o,selectedRowIds:r}),this.props.onSelectionChange&&this.props.onSelectionChange(r,o)},_updateSelectedRowIds:function ge(e,t,n){var r
n?(r=_(t,function(t){return e===t}),void 0===r&&t.push(e)):t.splice(t.indexOf(e),1)},_getIsSelectAllChecked:function ye(){return this.state.isSelectAllChecked},_getAreAllRowsChecked:function ve(e,t){return t.length===w(t,e).length

},_getIsRowChecked:function be(e){return this.state.selectedRowIds.indexOf(e[this.props.uniqueIdentifier])>-1},getSelectedRowIds:function _e(){return this.state.selectedRowIds},_resetSelectedRows:function Ee(){
this.setState({isSelectAllChecked:!1,selectedRowIds:[]})},getMultipleSelectionObject:function Ce(){return{isMultipleSelection:!_(this.props.results,function(e){return"children"in e})&&this.props.isMultipleSelection,
toggleSelectAll:this._toggleSelectAll,getIsSelectAllChecked:this._getIsSelectAllChecked,toggleSelectRow:this._toggleSelectRow,getSelectedRowIds:this.getSelectedRowIds,getIsRowChecked:this._getIsRowChecked
}},isInfiniteScrollEnabled:function Se(){return!this.props.useCustomPagerComponent&&this.props.enableInfiniteScroll},getClearFixStyles:function we(){return{clear:"both",display:"table",width:"100%"}},getSettingsStyles:function Pe(){
return{"float":"left",width:"50%",textAlign:"right"}},getFilterStyles:function Fe(){return{"float":"left",width:"50%",textAlign:"left",color:"#222",minHeight:"1px"}},getFilter:function xe(){return this.props.showFilter&&this.shouldUseCustomGridComponent()===!1?this.props.useCustomFilterComponent?o.createElement(h,{
changeFilter:this.setFilter,placeholderText:this.props.filterPlaceholderText,customFilterComponent:this.props.customFilterComponent,results:this.props.results,currentResults:this.getCurrentResults()}):o.createElement(s,{
changeFilter:this.setFilter,placeholderText:this.props.filterPlaceholderText}):""},getSettings:function Te(){return this.props.showSettings?o.createElement("button",{type:"button",className:this.props.settingsToggleClassName,
onClick:this.toggleColumnChooser,style:this.props.useGriddleStyles?{background:"none",border:"none",padding:0,margin:0,fontSize:14}:null},this.props.settingsText,this.props.settingsIconComponent):""},getTopSection:function Oe(e,t){
if(this.props.showFilter===!1&&this.props.showSettings===!1)return""
var n=null,r=null,i=null
return this.props.useGriddleStyles&&(n=this.getFilterStyles(),r=this.getSettingsStyles(),i=this.getClearFixStyles()),o.createElement("div",{className:"top-section",style:i},o.createElement("div",{className:"griddle-filter",
style:n},e),o.createElement("div",{className:"griddle-settings-toggle",style:r},t))},getPagingSection:function Ie(e,t){if((this.props.showPager&&!this.isInfiniteScrollEnabled()&&!this.shouldUseCustomGridComponent())!==!1)return o.createElement("div",{
className:"griddle-footer"},this.props.useCustomPagerComponent?o.createElement(f,{customPagerComponentOptions:this.props.customPagerComponentOptions,next:this.nextPage,previous:this.previousPage,currentPage:e,
maxPage:t,setPage:this.setPage,nextText:this.props.nextText,previousText:this.props.previousText,customPagerComponent:this.props.customPagerComponent}):o.createElement(a,{useGriddleStyles:this.props.useGriddleStyles,
next:this.nextPage,previous:this.previousPage,nextClassName:this.props.nextClassName,nextIconComponent:this.props.nextIconComponent,previousClassName:this.props.previousClassName,previousIconComponent:this.props.previousIconComponent,
currentPage:e,maxPage:t,setPage:this.setPage,nextText:this.props.nextText,previousText:this.props.previousText}))},getColumnSelectorSection:function Ae(e,t){return this.state.showColumnChooser?o.createElement(l,{
columns:e,selectedColumns:t,setColumns:this.setColumns,settingsText:this.props.settingsText,settingsIconComponent:this.props.settingsIconComponent,maxRowsText:this.props.maxRowsText,setPageSize:this.setPageSize,
showSetPageSize:!this.shouldUseCustomGridComponent(),resultsPerPage:this.state.resultsPerPage,enableToggleCustom:this.props.enableToggleCustom,toggleCustomComponent:this.toggleCustomComponent,useCustomComponent:this.shouldUseCustomRowComponent()||this.shouldUseCustomGridComponent(),
useGriddleStyles:this.props.useGriddleStyles,enableCustomFormatText:this.props.enableCustomFormatText,columnMetadata:this.props.columnMetadata}):""},getCustomGridSection:function De(){return o.createElement(this.props.customGridComponent,r({
data:this.props.results,className:this.props.customGridComponentClassName},this.props.gridMetadata))},getCustomRowSection:function ke(e,t,n,r,i){return o.createElement("div",null,o.createElement(d,{data:e,
columns:t,metadataColumns:n,globalData:i,className:this.props.customRowComponentClassName,customComponent:this.props.customRowComponent,style:this.props.useGriddleStyles?this.getClearFixStyles():null}),this.props.showPager&&r)

},getStandardGridSection:function Ne(e,t,n,r,s){var a=this.getSortObject(),l=this.getMultipleSelectionObject(),u=this.shouldShowNoDataSection(e),p=this.getNoDataSection()
return o.createElement("div",{className:"griddle-body"},o.createElement(i,{useGriddleStyles:this.props.useGriddleStyles,noDataSection:p,showNoData:u,columnSettings:this.columnSettings,rowSettings:this.rowSettings,
sortSettings:a,multipleSelectionSettings:l,filterByColumn:this.filterByColumn,isSubGriddle:this.props.isSubGriddle,useGriddleIcons:this.props.useGriddleIcons,useFixedLayout:this.props.useFixedLayout,showPager:this.props.showPager,
pagingContent:r,data:e,className:this.props.tableClassName,enableInfiniteScroll:this.isInfiniteScrollEnabled(),nextPage:this.nextPage,showTableHeading:this.props.showTableHeading,useFixedHeader:this.props.useFixedHeader,
parentRowCollapsedClassName:this.props.parentRowCollapsedClassName,parentRowExpandedClassName:this.props.parentRowExpandedClassName,parentRowCollapsedComponent:this.props.parentRowCollapsedComponent,parentRowExpandedComponent:this.props.parentRowExpandedComponent,
bodyHeight:this.props.bodyHeight,paddingHeight:this.props.paddingHeight,rowHeight:this.props.rowHeight,infiniteScrollLoadTreshold:this.props.infiniteScrollLoadTreshold,externalLoadingComponent:this.props.externalLoadingComponent,
externalIsLoading:this.props.externalIsLoading,hasMorePages:s,onRowClick:this.props.onRowClick}))},getContentSection:function Re(e,t,n,r,o,i){return this.shouldUseCustomGridComponent()&&null!==this.props.customGridComponent?this.getCustomGridSection():this.shouldUseCustomRowComponent()?this.getCustomRowSection(e,t,n,r,i):this.getStandardGridSection(e,t,n,r,o)

},getNoDataSection:function je(){return null!=this.props.customNoDataComponent?o.createElement("div",{className:this.props.noDataClassName},o.createElement(this.props.customNoDataComponent,this.props.customNoDataComponentProps)):o.createElement(u,{
noDataMessage:this.props.noDataMessage})},shouldShowNoDataSection:function Ue(e){return!this.props.allowEmptyGrid&&(this.props.useExternal===!1&&("undefined"==typeof e||0===e.length)||this.props.useExternal===!0&&this.props.externalIsLoading===!1&&0===e.length)

},render:function Le(){var e=this,t=this.getCurrentResults(),n=this.props.tableClassName+" table-header",r=this.getFilter(),i=this.getSettings(),s=this.getTopSection(r,i),a=[],l=this.columnSettings.getColumns(),u=this.getDataForRender(t,l,!0),p=this.columnSettings.getMetadataColumns()


a=y.keys(O(t[0],p)),a=this.columnSettings.orderColumns(a)
var c=this.getCurrentPage(),d=this.getCurrentMaxPage(),f=c+1<d,h=this.getPagingSection(c,d),m=this.getContentSection(u,l,p,h,f,this.props.globalData),g=this.getColumnSelectorSection(a,l),v=this.props.gridClassName.length>0?"griddle "+this.props.gridClassName:"griddle"


return v+=this.shouldUseCustomRowComponent()?" griddle-custom":"",o.createElement("div",{className:v},s,g,o.createElement("div",{className:"griddle-container",style:this.props.useGriddleStyles&&!this.props.isSubGriddle?{
border:"1px solid #DDD"}:null},m))}})
c.Griddle=e.exports=j},function(e,t,n){"use strict"
var r=n(4),o=n(41),i=n(198),s=n(42),a=n(205),l=r.createClass({displayName:"GridTable",getDefaultProps:function u(){return{data:[],columnSettings:null,rowSettings:null,sortSettings:null,multipleSelectionSettings:null,
className:"",enableInfiniteScroll:!1,nextPage:null,hasMorePages:!1,useFixedHeader:!1,useFixedLayout:!0,paddingHeight:null,rowHeight:null,filterByColumn:null,infiniteScrollLoadTreshold:null,bodyHeight:null,
useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",parentRowCollapsedComponent:"▶",parentRowExpandedComponent:"▼",
externalLoadingComponent:null,externalIsLoading:!1,onRowClick:null}},getInitialState:function p(){return{scrollTop:0,scrollHeight:this.props.bodyHeight,clientHeight:this.props.bodyHeight}},componentDidMount:function c(){
this.gridScroll()},componentDidUpdate:function d(e,t){this.gridScroll()},gridScroll:function f(){if(this.props.enableInfiniteScroll&&!this.props.externalIsLoading){var e=this.refs.scrollable,t=e.scrollTop,n=e.scrollHeight,r=e.clientHeight


if(null!==this.props.rowHeight&&this.state.scrollTop!==t&&Math.abs(this.state.scrollTop-t)>=this.getAdjustedRowHeight()){var o={scrollTop:t,scrollHeight:n,clientHeight:r}
this.setState(o)}var i=n-(t+r)-this.props.infiniteScrollLoadTreshold,s=.6*i
s<=this.props.infiniteScrollLoadTreshold&&this.props.nextPage()}},verifyProps:function h(){null===this.props.columnSettings&&console.error("gridTable: The columnSettings prop is null and it shouldn't be"),
null===this.props.rowSettings&&console.error("gridTable: The rowSettings prop is null and it shouldn't be")},getAdjustedRowHeight:function m(){return this.props.rowHeight+2*this.props.paddingHeight},getNodeContent:function g(){
this.verifyProps()
var e=this,t=!1
if(!this.props.externalIsLoading||this.props.enableInfiniteScroll){var n=e.props.data,o=null,s=null,a=!1
if(this.props.enableInfiniteScroll&&null!==this.props.rowHeight&&void 0!==this.refs.scrollable){var l=e.getAdjustedRowHeight(),u=Math.ceil(e.state.clientHeight/l),p=Math.max(0,Math.floor(e.state.scrollTop/l)-.25*u),c=Math.min(p+1.25*u,this.props.data.length-1)


n=n.slice(p,c+1)
var d={height:p*l+"px"}
o=r.createElement("tr",{key:"above-"+d.height,style:d})
var f={height:(this.props.data.length-c)*l+"px"}
s=r.createElement("tr",{key:"below-"+f.height,style:f})}var h=n.map(function(n,o){var s="undefined"!=typeof n.children&&n.children.length>0,a=e.props.rowSettings.getRowKey(n,o)
return s&&(t=s),r.createElement(i,{useGriddleStyles:e.props.useGriddleStyles,isSubGriddle:e.props.isSubGriddle,parentRowExpandedClassName:e.props.parentRowExpandedClassName,parentRowCollapsedClassName:e.props.parentRowCollapsedClassName,
parentRowExpandedComponent:e.props.parentRowExpandedComponent,parentRowCollapsedComponent:e.props.parentRowCollapsedComponent,data:n,key:a+"-container",uniqueId:a,columnSettings:e.props.columnSettings,
rowSettings:e.props.rowSettings,paddingHeight:e.props.paddingHeight,multipleSelectionSettings:e.props.multipleSelectionSettings,rowHeight:e.props.rowHeight,hasChildren:s,tableClassName:e.props.className,
onRowClick:e.props.onRowClick})})
if(this.props.showNoData){var m=this.props.columnSettings.getVisibleColumnCount()
h.push(r.createElement("tr",{key:"no-data-section"},r.createElement("td",{colSpan:m},this.props.noDataSection)))}return o&&h.unshift(o),s&&h.push(s),{nodes:h,anyHasChildren:t}}return null},render:function y(){
var e=this,t=[],n=!1,i=this.getNodeContent()
i&&(t=i.nodes,n=i.anyHasChildren)
var s=null,a=null,l={width:"100%"}
if(this.props.useFixedLayout&&(l.tableLayout="fixed"),this.props.enableInfiniteScroll&&(s={position:"relative",overflowY:"scroll",height:this.props.bodyHeight+"px",width:"100%"}),this.props.externalIsLoading){
var u=null,p=null
this.props.useGriddleStyles&&(u={textAlign:"center",paddingBottom:"40px"}),p=this.props.columnSettings.getVisibleColumnCount()
var c=this.props.externalLoadingComponent?r.createElement(this.props.externalLoadingComponent,null):r.createElement("div",null,"Loading...")
a=r.createElement("tbody",null,r.createElement("tr",null,r.createElement("td",{style:u,colSpan:p},c)))}var d=this.props.showTableHeading?r.createElement(o,{useGriddleStyles:this.props.useGriddleStyles,
useGriddleIcons:this.props.useGriddleIcons,sortSettings:this.props.sortSettings,multipleSelectionSettings:this.props.multipleSelectionSettings,columnSettings:this.props.columnSettings,filterByColumn:this.props.filterByColumn,
rowSettings:this.props.rowSettings}):void 0
n||(t=r.createElement("tbody",null,t))
var f=r.createElement("tbody",null)
if(this.props.showPager){var h=this.props.useGriddleStyles?{padding:"0px",backgroundColor:"#EDEDED",border:"0px",color:"#222",height:this.props.showNoData?"20px":null}:null
f=r.createElement("tbody",null,r.createElement("tr",null,r.createElement("td",{colSpan:this.props.multipleSelectionSettings.isMultipleSelection?this.props.columnSettings.getVisibleColumnCount()+1:this.props.columnSettings.getVisibleColumnCount(),
style:h,className:"footer-container"},this.props.showNoData?null:this.props.pagingContent)))}return this.props.useFixedHeader?(this.props.useGriddleStyles&&(l.tableLayout="fixed"),r.createElement("div",null,r.createElement("table",{
className:this.props.className,style:this.props.useGriddleStyles&&l||null},d),r.createElement("div",{ref:"scrollable",onScroll:this.gridScroll,style:s},r.createElement("table",{className:this.props.className,
style:this.props.useGriddleStyles&&l||null},t,a,f)))):r.createElement("div",{ref:"scrollable",onScroll:this.gridScroll,style:s},r.createElement("table",{className:this.props.className,style:this.props.useGriddleStyles&&l||null
},d,t,a,f))}})
e.exports=l},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(4),i=n(42),s=n(193),a=o.createClass({displayName:"DefaultHeaderComponent",render:function u(){return o.createElement("span",null,this.props.displayName)

}}),l=o.createClass({displayName:"GridTitle",getDefaultProps:function p(){return{columnSettings:null,filterByColumn:function e(){},rowSettings:null,sortSettings:null,multipleSelectionSettings:null,headerStyle:null,
useGriddleStyles:!0,useGriddleIcons:!0,headerStyles:{}}},componentWillMount:function c(){this.verifyProps()},sort:function d(e){var t=this
return function(n){t.props.sortSettings.changeSort(e)}},toggleSelectAll:function f(e){this.props.multipleSelectionSettings.toggleSelectAll()},handleSelectionChange:function h(e){},verifyProps:function m(){
null===this.props.columnSettings&&console.error("gridTitle: The columnSettings prop is null and it shouldn't be"),null===this.props.sortSettings&&console.error("gridTitle: The sortSettings prop is null and it shouldn't be")

},render:function g(){this.verifyProps()
var e=this,t={},n=this.props.columnSettings.getColumns().map(function(n,i){var l={},u="",p=e.props.columnSettings.getMetadataColumnProperty(n,"sortable",!0),c=p?e.props.sortSettings.sortDefaultComponent:null


e.props.sortSettings.sortColumn==n&&"asc"===e.props.sortSettings.sortDirection?(u=e.props.sortSettings.sortAscendingClassName,c=e.props.useGriddleIcons&&e.props.sortSettings.sortAscendingComponent):e.props.sortSettings.sortColumn==n&&"desc"===e.props.sortSettings.sortDirection&&(u+=e.props.sortSettings.sortDescendingClassName,
c=e.props.useGriddleIcons&&e.props.sortSettings.sortDescendingComponent)
var d=e.props.columnSettings.getColumnMetadataByName(n),f=e.props.columnSettings.getMetadataColumnProperty(n,"displayName",n),h=e.props.columnSettings.getMetadataColumnProperty(n,"customHeaderComponent",a),m=e.props.columnSettings.getMetadataColumnProperty(n,"customHeaderComponentProps",{})


u=null==d?u:(u&&u+" "||u)+e.props.columnSettings.getMetadataColumnProperty(n,"cssClassName",""),e.props.useGriddleStyles&&(l={backgroundColor:"#EDEDEF",border:"0px",borderBottom:"1px solid #DDD",color:"#222",
padding:"5px",cursor:p?"pointer":"default"}),t=d&&d.titleStyles?s({},l,d.titleStyles):s({},l)
var g=f?"th":"td"
return o.createElement(g,{onClick:p?e.sort(n):null,"data-title":n,className:u,key:n,style:t},o.createElement(h,r({columnName:n,displayName:f,filterByColumn:e.props.filterByColumn},m)),c)})
n&&this.props.multipleSelectionSettings.isMultipleSelection&&n.unshift(o.createElement("th",{key:"selection",onClick:this.toggleSelectAll,style:t,className:"griddle-select griddle-select-title"},o.createElement("input",{
type:"checkbox",checked:this.props.multipleSelectionSettings.getIsSelectAllChecked(),onChange:this.handleSelectionChange})))
var i=e.props.rowSettings&&e.props.rowSettings.getHeaderRowMetadataClass()||null
return o.createElement("thead",null,o.createElement("tr",{className:i,style:this.props.headerStyles},n))}})
e.exports=l},function(e,t,n){"use strict"
function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(43),s=n(158),a=n(161),l=n(168),u=n(185),p=function(){
function e(){var t=arguments.length<=0||void 0===arguments[0]?[]:arguments[0],n=arguments.length<=1||void 0===arguments[1]?[]:arguments[1],o=arguments.length<=2||void 0===arguments[2]?"children":arguments[2],i=arguments.length<=3||void 0===arguments[3]?[]:arguments[3],s=arguments.length<=4||void 0===arguments[4]?[]:arguments[4]


r(this,e),this.allColumns=t,this.filteredColumns=n,this.childrenColumnName=o,this.columnMetadata=i,this.metadataColumns=s}return o(e,[{key:"getMetadataColumns",value:function t(){var e=i(s(this.columnMetadata,{
visible:!1}),function(e){return e.columnName})
return e.indexOf(this.childrenColumnName)<0&&e.push(this.childrenColumnName),e.concat(this.metadataColumns)}},{key:"getVisibleColumnCount",value:function n(){return this.getColumns().length}},{key:"getColumnMetadataByName",
value:function p(e){return a(this.columnMetadata,{columnName:e})}},{key:"hasColumnMetadata",value:function c(){return null!==this.columnMetadata&&this.columnMetadata.length>0}},{key:"getMetadataColumnProperty",
value:function d(e,t,n){var r=this.getColumnMetadataByName(e)
return"undefined"==typeof r||null===r?n:r.hasOwnProperty(t)?r[t]:n}},{key:"orderColumns",value:function f(e){var t=this,n=100,r=l(e,function(e){var r=a(t.columnMetadata,{columnName:e})
return"undefined"==typeof r||null===r||isNaN(r.order)?n:r.order})
return r}},{key:"getColumns",value:function h(){var e=0===this.filteredColumns.length?this.allColumns:this.filteredColumns
return e=u(e,this.metadataColumns),e=this.orderColumns(e)}}]),e}()
e.exports=p},function(e,t,n){function r(e,t){var n=a(e)?o:s
return n(e,i(t,3))}var o=n(44),i=n(45),s=n(152),a=n(111)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e)
return o}e.exports=n},function(e,t,n){function r(e){return"function"==typeof e?e:null==e?s:"object"==typeof e?a(e)?i(e[0],e[1]):o(e):l(e)}var o=n(46),i=n(133),s=n(148),a=n(111),l=n(149)
e.exports=r},function(e,t,n){function r(e){var t=i(e)
return 1==t.length&&t[0][2]?s(t[0][0],t[0][1]):function(n){return n===e||o(n,e,t)}}var o=n(47),i=n(130),s=n(132)
e.exports=r},function(e,t,n){function r(e,t,n,r){var l=n.length,u=l,p=!r
if(null==e)return!u
for(e=Object(e);l--;){var c=n[l]
if(p&&c[2]?c[1]!==e[c[0]]:!(c[0]in e))return!1}for(;++l<u;){c=n[l]
var d=c[0],f=e[d],h=c[1]
if(p&&c[2]){if(void 0===f&&!(d in e))return!1}else{var m=new o
if(r)var g=r(f,h,d,e,t,m)
if(!(void 0===g?i(h,f,s|a,r,m):g))return!1}}return!0}var o=n(48),i=n(92),s=1,a=2
e.exports=r},function(e,t,n){function r(e){var t=this.__data__=new o(e)
this.size=t.size}var o=n(49),i=n(57),s=n(58),a=n(59),l=n(60),u=n(61)
r.prototype.clear=i,r.prototype["delete"]=s,r.prototype.get=a,r.prototype.has=l,r.prototype.set=u,e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(50),i=n(51),s=n(54),a=n(55),l=n(56)
r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t){function n(){this.__data__=[],this.size=0}e.exports=n},function(e,t,n){function r(e){
var t=this.__data__,n=o(t,e)
if(n<0)return!1
var r=t.length-1
return n==r?t.pop():s.call(t,n,1),--this.size,!0}var o=n(52),i=Array.prototype,s=i.splice
e.exports=r},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n
return-1}var o=n(53)
e.exports=r},function(e,t){function n(e,t){return e===t||e!==e&&t!==t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e)
return n<0?void 0:t[n][1]}var o=n(52)
e.exports=r},function(e,t,n){function r(e){return o(this.__data__,e)>-1}var o=n(52)
e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__,r=o(n,e)
return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}var o=n(52)
e.exports=r},function(e,t,n){function r(){this.__data__=new o,this.size=0}var o=n(49)
e.exports=r},function(e,t){function n(e){var t=this.__data__,n=t["delete"](e)
return this.size=t.size,n}e.exports=n},function(e,t){function n(e){return this.__data__.get(e)}e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t,n){function r(e,t){
var n=this.__data__
if(n instanceof o){var r=n.__data__
if(!i||r.length<a-1)return r.push([e,t]),this.size=++n.size,this
n=this.__data__=new s(r)}return n.set(e,t),this.size=n.size,this}var o=n(49),i=n(62),s=n(77),a=200
e.exports=r},function(e,t,n){var r=n(63),o=n(68),i=r(o,"Map")
e.exports=i},function(e,t,n){function r(e,t){var n=i(e,t)
return o(n)?n:void 0}var o=n(64),i=n(76)
e.exports=r},function(e,t,n){function r(e){if(!s(e)||i(e))return!1
var t=o(e)?h:u
return t.test(a(e))}var o=n(65),i=n(73),s=n(72),a=n(75),l=/[\\^$.*+?()[\]{}|]/g,u=/^\[object .+?Constructor\]$/,p=Function.prototype,c=Object.prototype,d=p.toString,f=c.hasOwnProperty,h=RegExp("^"+d.call(f).replace(l,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$")


e.exports=r},function(e,t,n){function r(e){if(!i(e))return!1
var t=o(e)
return t==a||t==l||t==s||t==u}var o=n(66),i=n(72),s="[object AsyncFunction]",a="[object Function]",l="[object GeneratorFunction]",u="[object Proxy]"
e.exports=r},function(e,t,n){function r(e){return null==e?void 0===e?l:a:(e=Object(e),u&&u in e?i(e):s(e))}var o=n(67),i=n(70),s=n(71),a="[object Null]",l="[object Undefined]",u=o?o.toStringTag:void 0
e.exports=r},function(e,t,n){var r=n(68),o=r.Symbol
e.exports=o},function(e,t,n){var r=n(69),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")()
e.exports=i},function(e,t){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t
e.exports=n}).call(t,function(){return this}())},function(e,t,n){function r(e){var t=s.call(e,l),n=e[l]
try{e[l]=void 0
var r=!0}catch(o){}var i=a.call(e)
return r&&(t?e[l]=n:delete e[l]),i}var o=n(67),i=Object.prototype,s=i.hasOwnProperty,a=i.toString,l=o?o.toStringTag:void 0
e.exports=r},function(e,t){function n(e){return o.call(e)}var r=Object.prototype,o=r.toString
e.exports=n},function(e,t){function n(e){var t=typeof e
return null!=e&&("object"==t||"function"==t)}e.exports=n},function(e,t,n){function r(e){return!!i&&i in e}var o=n(74),i=function(){var e=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"")
return e?"Symbol(src)_1."+e:""}()
e.exports=r},function(e,t,n){var r=n(68),o=r["__core-js_shared__"]
e.exports=o},function(e,t){function n(e){if(null!=e){try{return o.call(e)}catch(t){}try{return e+""}catch(t){}}return""}var r=Function.prototype,o=r.toString
e.exports=n},function(e,t){function n(e,t){return null==e?void 0:e[t]}e.exports=n},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(78),i=n(86),s=n(89),a=n(90),l=n(91)
r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.size=0,this.__data__={hash:new o,map:new(s||i),string:new o
}}var o=n(79),i=n(49),s=n(62)
e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(80),i=n(82),s=n(83),a=n(84),l=n(85)
r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.__data__=o?o(null):{},this.size=0}var o=n(81)
e.exports=r},function(e,t,n){var r=n(63),o=r(Object,"create")
e.exports=o},function(e,t){function n(e){var t=this.has(e)&&delete this.__data__[e]
return this.size-=t?1:0,t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__
if(o){var n=t[e]
return n===i?void 0:n}return a.call(t,e)?t[e]:void 0}var o=n(81),i="__lodash_hash_undefined__",s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){function r(e){var t=this.__data__
return o?void 0!==t[e]:s.call(t,e)}var o=n(81),i=Object.prototype,s=i.hasOwnProperty
e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__
return this.size+=this.has(e)?0:1,n[e]=o&&void 0===t?i:t,this}var o=n(81),i="__lodash_hash_undefined__"
e.exports=r},function(e,t,n){function r(e){var t=o(this,e)["delete"](e)
return this.size-=t?1:0,t}var o=n(87)
e.exports=r},function(e,t,n){function r(e,t){var n=e.__data__
return o(t)?n["string"==typeof t?"string":"hash"]:n.map}var o=n(88)
e.exports=r},function(e,t){function n(e){var t=typeof e
return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}e.exports=n},function(e,t,n){function r(e){return o(this,e).get(e)}var o=n(87)
e.exports=r},function(e,t,n){function r(e){return o(this,e).has(e)}var o=n(87)
e.exports=r},function(e,t,n){function r(e,t){var n=o(this,e),r=n.size
return n.set(e,t),this.size+=n.size==r?0:1,this}var o=n(87)
e.exports=r},function(e,t,n){function r(e,t,n,a,l){return e===t||(null==e||null==t||!i(e)&&!s(t)?e!==e&&t!==t:o(e,t,n,a,r,l))}var o=n(93),i=n(72),s=n(110)
e.exports=r},function(e,t,n){function r(e,t,n,r,g,v){var b=u(e),_=u(t),E=h,C=h
b||(E=l(e),E=E==f?m:E),_||(C=l(t),C=C==f?m:C)
var S=E==m,w=C==m,P=E==C
if(P&&p(e)){if(!p(t))return!1
b=!0,S=!1}if(P&&!S)return v||(v=new o),b||c(e)?i(e,t,n,r,g,v):s(e,t,E,n,r,g,v)
if(!(n&d)){var F=S&&y.call(e,"__wrapped__"),x=w&&y.call(t,"__wrapped__")
if(F||x){var T=F?e.value():e,O=x?t.value():t
return v||(v=new o),g(T,O,n,r,v)}}return!!P&&(v||(v=new o),a(e,t,n,r,g,v))}var o=n(48),i=n(94),s=n(100),a=n(104),l=n(125),u=n(111),p=n(112),c=n(115),d=1,f="[object Arguments]",h="[object Array]",m="[object Object]",g=Object.prototype,y=g.hasOwnProperty


e.exports=r},function(e,t,n){function r(e,t,n,r,u,p){var c=n&a,d=e.length,f=t.length
if(d!=f&&!(c&&f>d))return!1
var h=p.get(e)
if(h&&p.get(t))return h==t
var m=-1,g=!0,y=n&l?new o:void 0
for(p.set(e,t),p.set(t,e);++m<d;){var v=e[m],b=t[m]
if(r)var _=c?r(b,v,m,t,e,p):r(v,b,m,e,t,p)
if(void 0!==_){if(_)continue
g=!1
break}if(y){if(!i(t,function(e,t){if(!s(y,t)&&(v===e||u(v,e,n,r,p)))return y.push(t)})){g=!1
break}}else if(v!==b&&!u(v,b,n,r,p)){g=!1
break}}return p["delete"](e),p["delete"](t),g}var o=n(95),i=n(98),s=n(99),a=1,l=2
e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.__data__=new o;++t<n;)this.add(e[t])}var o=n(77),i=n(96),s=n(97)
r.prototype.add=r.prototype.push=i,r.prototype.has=s,e.exports=r},function(e,t){function n(e){return this.__data__.set(e,r),this}var r="__lodash_hash_undefined__"
e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0
return!1}e.exports=n},function(e,t){function n(e,t){return e.has(t)}e.exports=n},function(e,t,n){function r(e,t,n,r,o,S,P){switch(n){case C:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1


e=e.buffer,t=t.buffer
case E:return!(e.byteLength!=t.byteLength||!S(new i(e),new i(t)))
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
return P["delete"](e),O
case _:if(w)return w.call(e)==w.call(t)}return!1}var o=n(67),i=n(101),s=n(53),a=n(94),l=n(102),u=n(103),p=1,c=2,d="[object Boolean]",f="[object Date]",h="[object Error]",m="[object Map]",g="[object Number]",y="[object RegExp]",v="[object Set]",b="[object String]",_="[object Symbol]",E="[object ArrayBuffer]",C="[object DataView]",S=o?o.prototype:void 0,w=S?S.valueOf:void 0


e.exports=r},function(e,t,n){var r=n(68),o=r.Uint8Array
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
var b=e[m],_=t[m]
if(r)var E=u?r(_,b,m,t,e,l):r(b,_,m,e,t,l)
if(!(void 0===E?b===_||s(b,_,n,r,l):E)){y=!1
break}v||(v="constructor"==m)}if(y&&!v){var C=e.constructor,S=t.constructor
C!=S&&"constructor"in e&&"constructor"in t&&!("function"==typeof C&&C instanceof C&&"function"==typeof S&&S instanceof S)&&(y=!1)}return l["delete"](e),l["delete"](t),y}var o=n(105),i=1,s=Object.prototype,a=s.hasOwnProperty


e.exports=r},function(e,t,n){function r(e){return s(e)?o(e):i(e)}var o=n(106),i=n(120),s=n(124)
e.exports=r},function(e,t,n){function r(e,t){var n=s(e),r=!n&&i(e),p=!n&&!r&&a(e),d=!n&&!r&&!p&&u(e),f=n||r||p||d,h=f?o(e.length,String):[],m=h.length
for(var g in e)!t&&!c.call(e,g)||f&&("length"==g||p&&("offset"==g||"parent"==g)||d&&("buffer"==g||"byteLength"==g||"byteOffset"==g)||l(g,m))||h.push(g)
return h}var o=n(107),i=n(108),s=n(111),a=n(112),l=n(114),u=n(115),p=Object.prototype,c=p.hasOwnProperty
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n)
return r}e.exports=n},function(e,t,n){var r=n(109),o=n(110),i=Object.prototype,s=i.hasOwnProperty,a=i.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&s.call(e,"callee")&&!a.call(e,"callee")

}
e.exports=l},function(e,t,n){function r(e){return i(e)&&o(e)==s}var o=n(66),i=n(110),s="[object Arguments]"
e.exports=r},function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},function(e,t){var n=Array.isArray
e.exports=n},function(e,t,n){(function(e){var r=n(68),o=n(113),i="object"==typeof t&&t&&!t.nodeType&&t,s=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=s&&s.exports===i,l=a?r.Buffer:void 0,u=l?l.isBuffer:void 0,p=u||o


e.exports=p}).call(t,n(28)(e))},function(e,t){function n(){return!1}e.exports=n},function(e,t){function n(e,t){return t=null==t?r:t,!!t&&("number"==typeof e||o.test(e))&&e>-1&&e%1==0&&e<t}var r=9007199254740991,o=/^(?:0|[1-9]\d*)$/


e.exports=n},function(e,t,n){var r=n(116),o=n(118),i=n(119),s=i&&i.isTypedArray,a=s?o(s):r
e.exports=a},function(e,t,n){function r(e){return s(e)&&i(e.length)&&!!A[o(e)]}var o=n(66),i=n(117),s=n(110),a="[object Arguments]",l="[object Array]",u="[object Boolean]",p="[object Date]",c="[object Error]",d="[object Function]",f="[object Map]",h="[object Number]",m="[object Object]",g="[object RegExp]",y="[object Set]",v="[object String]",b="[object WeakMap]",_="[object ArrayBuffer]",E="[object DataView]",C="[object Float32Array]",S="[object Float64Array]",w="[object Int8Array]",P="[object Int16Array]",F="[object Int32Array]",x="[object Uint8Array]",T="[object Uint8ClampedArray]",O="[object Uint16Array]",I="[object Uint32Array]",A={}


A[C]=A[S]=A[w]=A[P]=A[F]=A[x]=A[T]=A[O]=A[I]=!0,A[a]=A[l]=A[_]=A[u]=A[E]=A[p]=A[c]=A[d]=A[f]=A[h]=A[m]=A[g]=A[y]=A[v]=A[b]=!1,e.exports=r},function(e,t){function n(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=r

}var r=9007199254740991
e.exports=n},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n},function(e,t,n){(function(e){var r=n(69),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,s=i&&i.exports===o,a=s&&r.process,l=function(){
try{return a&&a.binding&&a.binding("util")}catch(e){}}()
e.exports=l}).call(t,n(28)(e))},function(e,t,n){function r(e){if(!o(e))return i(e)
var t=[]
for(var n in Object(e))a.call(e,n)&&"constructor"!=n&&t.push(n)
return t}var o=n(121),i=n(122),s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t){function n(e){var t=e&&e.constructor,n="function"==typeof t&&t.prototype||r
return e===n}var r=Object.prototype
e.exports=n},function(e,t,n){var r=n(123),o=r(Object.keys,Object)
e.exports=o},function(e,t){function n(e,t){return function(n){return e(t(n))}}e.exports=n},function(e,t,n){function r(e){return null!=e&&i(e.length)&&!o(e)}var o=n(65),i=n(117)
e.exports=r},function(e,t,n){var r=n(126),o=n(62),i=n(127),s=n(128),a=n(129),l=n(66),u=n(75),p="[object Map]",c="[object Object]",d="[object Promise]",f="[object Set]",h="[object WeakMap]",m="[object DataView]",g=u(r),y=u(o),v=u(i),b=u(s),_=u(a),E=l

;(r&&E(new r(new ArrayBuffer(1)))!=m||o&&E(new o)!=p||i&&E(i.resolve())!=d||s&&E(new s)!=f||a&&E(new a)!=h)&&(E=function(e){var t=l(e),n=t==c?e.constructor:void 0,r=n?u(n):""
if(r)switch(r){case g:return m
case y:return p
case v:return d
case b:return f
case _:return h}return t}),e.exports=E},function(e,t,n){var r=n(63),o=n(68),i=r(o,"DataView")
e.exports=i},function(e,t,n){var r=n(63),o=n(68),i=r(o,"Promise")
e.exports=i},function(e,t,n){var r=n(63),o=n(68),i=r(o,"Set")
e.exports=i},function(e,t,n){var r=n(63),o=n(68),i=r(o,"WeakMap")
e.exports=i},function(e,t,n){function r(e){for(var t=i(e),n=t.length;n--;){var r=t[n],s=e[r]
t[n]=[r,s,o(s)]}return t}var o=n(131),i=n(105)
e.exports=r},function(e,t,n){function r(e){return e===e&&!o(e)}var o=n(72)
e.exports=r},function(e,t){function n(e,t){return function(n){return null!=n&&(n[e]===t&&(void 0!==t||e in Object(n)))}}e.exports=n},function(e,t,n){function r(e,t){return a(e)&&l(t)?u(p(e),t):function(n){
var r=i(n,e)
return void 0===r&&r===t?s(n,e):o(t,r,c|d)}}var o=n(92),i=n(134),s=n(145),a=n(137),l=n(131),u=n(132),p=n(144),c=1,d=2
e.exports=r},function(e,t,n){function r(e,t,n){var r=null==e?void 0:o(e,t)
return void 0===r?n:r}var o=n(135)
e.exports=r},function(e,t,n){function r(e,t){t=o(t,e)
for(var n=0,r=t.length;null!=e&&n<r;)e=e[i(t[n++])]
return n&&n==r?e:void 0}var o=n(136),i=n(144)
e.exports=r},function(e,t,n){function r(e,t){return o(e)?e:i(e,t)?[e]:s(a(e))}var o=n(111),i=n(137),s=n(139),a=n(142)
e.exports=r},function(e,t,n){function r(e,t){if(o(e))return!1
var n=typeof e
return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!i(e))||(a.test(e)||!s.test(e)||null!=t&&e in Object(t))}var o=n(111),i=n(138),s=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,a=/^\w*$/
e.exports=r},function(e,t,n){function r(e){return"symbol"==typeof e||i(e)&&o(e)==s}var o=n(66),i=n(110),s="[object Symbol]"
e.exports=r},function(e,t,n){var r=n(140),o=/^\./,i=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,s=/\\(\\)?/g,a=r(function(e){var t=[]
return o.test(e)&&t.push(""),e.replace(i,function(e,n,r,o){t.push(r?o.replace(s,"$1"):n||e)}),t})
e.exports=a},function(e,t,n){function r(e){var t=o(e,function(e){return n.size===i&&n.clear(),e}),n=t.cache
return t}var o=n(141),i=500
e.exports=r},function(e,t,n){function r(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError(i)
var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],i=n.cache
if(i.has(o))return i.get(o)
var s=e.apply(this,r)
return n.cache=i.set(o,s)||i,s}
return n.cache=new(r.Cache||o),n}var o=n(77),i="Expected a function"
r.Cache=o,e.exports=r},function(e,t,n){function r(e){return null==e?"":o(e)}var o=n(143)
e.exports=r},function(e,t,n){function r(e){if("string"==typeof e)return e
if(s(e))return i(e,r)+""
if(a(e))return p?p.call(e):""
var t=e+""
return"0"==t&&1/e==-l?"-0":t}var o=n(67),i=n(44),s=n(111),a=n(138),l=1/0,u=o?o.prototype:void 0,p=u?u.toString:void 0
e.exports=r},function(e,t,n){function r(e){if("string"==typeof e||o(e))return e
var t=e+""
return"0"==t&&1/e==-i?"-0":t}var o=n(138),i=1/0
e.exports=r},function(e,t,n){function r(e,t){return null!=e&&i(e,t,o)}var o=n(146),i=n(147)
e.exports=r},function(e,t){function n(e,t){return null!=e&&t in Object(e)}e.exports=n},function(e,t,n){function r(e,t,n){t=o(t,e)
for(var r=-1,p=t.length,c=!1;++r<p;){var d=u(t[r])
if(!(c=null!=e&&n(e,d)))break
e=e[d]}return c||++r!=p?c:(p=null==e?0:e.length,!!p&&l(p)&&a(d,p)&&(s(e)||i(e)))}var o=n(136),i=n(108),s=n(111),a=n(114),l=n(117),u=n(144)
e.exports=r},function(e,t){function n(e){return e}e.exports=n},function(e,t,n){function r(e){return s(e)?o(a(e)):i(e)}var o=n(150),i=n(151),s=n(137),a=n(144)
e.exports=r},function(e,t){function n(e){return function(t){return null==t?void 0:t[e]}}e.exports=n},function(e,t,n){function r(e){return function(t){return o(t,e)}}var o=n(135)
e.exports=r},function(e,t,n){function r(e,t){var n=-1,r=i(e)?Array(e.length):[]
return o(e,function(e,o,i){r[++n]=t(e,o,i)}),r}var o=n(153),i=n(124)
e.exports=r},function(e,t,n){var r=n(154),o=n(157),i=o(r)
e.exports=i},function(e,t,n){function r(e,t){return e&&o(e,t,i)}var o=n(155),i=n(105)
e.exports=r},function(e,t,n){var r=n(156),o=r()
e.exports=o},function(e,t){function n(e){return function(t,n,r){for(var o=-1,i=Object(t),s=r(t),a=s.length;a--;){var l=s[e?a:++o]
if(n(i[l],l,i)===!1)break}return t}}e.exports=n},function(e,t,n){function r(e,t){return function(n,r){if(null==n)return n
if(!o(n))return e(n,r)
for(var i=n.length,s=t?i:-1,a=Object(n);(t?s--:++s<i)&&r(a[s],s,a)!==!1;);return n}}var o=n(124)
e.exports=r},function(e,t,n){function r(e,t){var n=a(e)?o:i
return n(e,s(t,3))}var o=n(159),i=n(160),s=n(45),a=n(111)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=0,i=[];++n<r;){var s=e[n]
t(s,n,e)&&(i[o++]=s)}return i}e.exports=n},function(e,t,n){function r(e,t){var n=[]
return o(e,function(e,r,o){t(e,r,o)&&n.push(e)}),n}var o=n(153)
e.exports=r},function(e,t,n){var r=n(162),o=n(163),i=r(o)
e.exports=i},function(e,t,n){function r(e){return function(t,n,r){var a=Object(t)
if(!i(t)){var l=o(n,3)
t=s(t),n=function(e){return l(a[e],e,a)}}var u=e(t,n,r)
return u>-1?a[l?t[u]:u]:void 0}}var o=n(45),i=n(124),s=n(105)
e.exports=r},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
if(!r)return-1
var l=null==n?0:s(n)
return l<0&&(l=a(r+l,0)),o(e,i(t,3),l)}var o=n(164),i=n(45),s=n(165),a=Math.max
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
return n||p.test(e)?c(e.slice(2),n?2:8):l.test(e)?s:+e}var o=n(72),i=n(138),s=NaN,a=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,u=/^0b[01]+$/i,p=/^0o[0-7]+$/i,c=parseInt
e.exports=r},function(e,t,n){var r=n(169),o=n(172),i=n(176),s=n(184),a=i(function(e,t){if(null==e)return[]
var n=t.length
return n>1&&s(e,t[0],t[1])?t=[]:n>2&&s(t[0],t[1],t[2])&&(t=[t[0]]),o(e,r(t,1),[])})
e.exports=a},function(e,t,n){function r(e,t,n,s,a){var l=-1,u=e.length
for(n||(n=i),a||(a=[]);++l<u;){var p=e[l]
t>0&&n(p)?t>1?r(p,t-1,n,s,a):o(a,p):s||(a[a.length]=p)}return a}var o=n(170),i=n(171)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n]
return e}e.exports=n},function(e,t,n){function r(e){return s(e)||i(e)||!!(a&&e&&e[a])}var o=n(67),i=n(108),s=n(111),a=o?o.isConcatSpreadable:void 0
e.exports=r},function(e,t,n){function r(e,t,n){var r=-1
t=o(t.length?t:[p],l(i))
var c=s(e,function(e,n,i){var s=o(t,function(t){return t(e)})
return{criteria:s,index:++r,value:e}})
return a(c,function(e,t){return u(e,t,n)})}var o=n(44),i=n(45),s=n(152),a=n(173),l=n(118),u=n(174),p=n(148)
e.exports=r},function(e,t){function n(e,t){var n=e.length
for(e.sort(t);n--;)e[n]=e[n].value
return e}e.exports=n},function(e,t,n){function r(e,t,n){for(var r=-1,i=e.criteria,s=t.criteria,a=i.length,l=n.length;++r<a;){var u=o(i[r],s[r])
if(u){if(r>=l)return u
var p=n[r]
return u*("desc"==p?-1:1)}}return e.index-t.index}var o=n(175)
e.exports=r},function(e,t,n){function r(e,t){if(e!==t){var n=void 0!==e,r=null===e,i=e===e,s=o(e),a=void 0!==t,l=null===t,u=t===t,p=o(t)
if(!l&&!p&&!s&&e>t||s&&a&&u&&!l&&!p||r&&a&&u||!n&&u||!i)return 1
if(!r&&!s&&!p&&e<t||p&&n&&i&&!r&&!s||l&&n&&i||!a&&i||!u)return-1}return 0}var o=n(138)
e.exports=r},function(e,t,n){function r(e,t){return s(i(e,t,o),e+"")}var o=n(148),i=n(177),s=n(179)
e.exports=r},function(e,t,n){function r(e,t,n){return t=i(void 0===t?e.length-1:t,0),function(){for(var r=arguments,s=-1,a=i(r.length-t,0),l=Array(a);++s<a;)l[s]=r[t+s]
s=-1
for(var u=Array(t+1);++s<t;)u[s]=r[s]
return u[t]=n(l),o(e,this,u)}}var o=n(178),i=Math.max
e.exports=r},function(e,t){function n(e,t,n){switch(n.length){case 0:return e.call(t)
case 1:return e.call(t,n[0])
case 2:return e.call(t,n[0],n[1])
case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.exports=n},function(e,t,n){var r=n(180),o=n(183),i=o(r)
e.exports=i},function(e,t,n){var r=n(181),o=n(182),i=n(148),s=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:i
e.exports=s},function(e,t){function n(e){return function(){return e}}e.exports=n},function(e,t,n){var r=n(63),o=function(){try{var e=r(Object,"defineProperty")
return e({},"",{}),e}catch(t){}}()
e.exports=o},function(e,t){function n(e){var t=0,n=0
return function(){var s=i(),a=o-(s-n)
if(n=s,a>0){if(++t>=r)return arguments[0]}else t=0
return e.apply(void 0,arguments)}}var r=800,o=16,i=Date.now
e.exports=n},function(e,t,n){function r(e,t,n){if(!a(n))return!1
var r=typeof t
return!!("number"==r?i(n)&&s(t,n.length):"string"==r&&t in n)&&o(n[t],e)}var o=n(53),i=n(124),s=n(114),a=n(72)
e.exports=r},function(e,t,n){var r=n(186),o=n(169),i=n(176),s=n(192),a=i(function(e,t){return s(e)?r(e,o(t,1,s,!0)):[]})
e.exports=a},function(e,t,n){function r(e,t,n,r){var c=-1,d=i,f=!0,h=e.length,m=[],g=t.length
if(!h)return m
n&&(t=a(t,l(n))),r?(d=s,f=!1):t.length>=p&&(d=u,f=!1,t=new o(t))
e:for(;++c<h;){var y=e[c],v=null==n?y:n(y)
if(y=r||0!==y?y:0,f&&v===v){for(var b=g;b--;)if(t[b]===v)continue e
m.push(y)}else d(t,v,r)||m.push(y)}return m}var o=n(95),i=n(187),s=n(191),a=n(44),l=n(118),u=n(99),p=200
e.exports=r},function(e,t,n){function r(e,t){var n=null==e?0:e.length
return!!n&&o(e,t,0)>-1}var o=n(188)
e.exports=r},function(e,t,n){function r(e,t,n){return t===t?s(e,t,n):o(e,i,n)}var o=n(164),i=n(189),s=n(190)
e.exports=r},function(e,t){function n(e){return e!==e}e.exports=n},function(e,t){function n(e,t,n){for(var r=n-1,o=e.length;++r<o;)if(e[r]===t)return r
return-1}e.exports=n},function(e,t){function n(e,t,n){for(var r=-1,o=null==e?0:e.length;++r<o;)if(n(t,e[r]))return!0
return!1}e.exports=n},function(e,t,n){function r(e){return i(e)&&o(e)}var o=n(124),i=n(110)
e.exports=r},function(e,t,n){var r=n(194),o=n(196),i=n(197),s=n(124),a=n(121),l=n(105),u=Object.prototype,p=u.hasOwnProperty,c=i(function(e,t){if(a(t)||s(t))return void o(t,l(t),e)
for(var n in t)p.call(t,n)&&r(e,n,t[n])})
e.exports=c},function(e,t,n){function r(e,t,n){var r=e[t]
a.call(e,t)&&i(r,n)&&(void 0!==n||t in e)||o(e,t,n)}var o=n(195),i=n(53),s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){function r(e,t,n){"__proto__"==t&&o?o(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}var o=n(182)
e.exports=r},function(e,t,n){function r(e,t,n,r){var s=!n
n||(n={})
for(var a=-1,l=t.length;++a<l;){var u=t[a],p=r?r(n[u],e[u],u,n,e):void 0
void 0===p&&(p=e[u]),s?i(n,u,p):o(n,u,p)}return n}var o=n(194),i=n(195)
e.exports=r},function(e,t,n){function r(e){return o(function(t,n){var r=-1,o=n.length,s=o>1?n[o-1]:void 0,a=o>2?n[2]:void 0
for(s=e.length>3&&"function"==typeof s?(o--,s):void 0,a&&i(n[0],n[1],a)&&(s=o<3?void 0:s,o=1),t=Object(t);++r<o;){var l=n[r]
l&&e(t,l,r,s)}return t})}var o=n(176),i=n(184)
e.exports=r},function(e,t,n){"use strict"
var r=n(4),o=n(42),i=n(199),s=r.createClass({displayName:"GridRowContainer",getDefaultProps:function a(){return{useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,columnSettings:null,rowSettings:null,
paddingHeight:null,rowHeight:null,parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",parentRowCollapsedComponent:"▶",parentRowExpandedComponent:"▼",onRowClick:null,
multipleSelectionSettings:null}},getInitialState:function l(){return{data:{},showChildren:!1}},componentWillReceiveProps:function u(){this.setShowChildren(!1)},toggleChildren:function p(){this.setShowChildren(this.state.showChildren===!1)

},setShowChildren:function c(e){this.setState({showChildren:e})},verifyProps:function d(){null===this.props.columnSettings&&console.error("gridRowContainer: The columnSettings prop is null and it shouldn't be")

},render:function f(){this.verifyProps()
var e=this
if("undefined"==typeof this.props.data)return r.createElement("tbody",null)
var t=[],n=this.props.columnSettings.getColumns()
t.push(r.createElement(this.props.rowSettings.rowComponent,{useGriddleStyles:this.props.useGriddleStyles,isSubGriddle:this.props.isSubGriddle,data:this.props.rowSettings.isCustom?i(this.props.data,n):this.props.data,
rowData:this.props.rowSettings.isCustom?this.props.data:null,columnSettings:this.props.columnSettings,rowSettings:this.props.rowSettings,hasChildren:e.props.hasChildren,toggleChildren:e.toggleChildren,
showChildren:e.state.showChildren,key:e.props.uniqueId+"_base_row",useGriddleIcons:e.props.useGriddleIcons,parentRowExpandedClassName:this.props.parentRowExpandedClassName,parentRowCollapsedClassName:this.props.parentRowCollapsedClassName,
parentRowExpandedComponent:this.props.parentRowExpandedComponent,parentRowCollapsedComponent:this.props.parentRowCollapsedComponent,paddingHeight:e.props.paddingHeight,rowHeight:e.props.rowHeight,onRowClick:e.props.onRowClick,
multipleSelectionSettings:this.props.multipleSelectionSettings}))
var o=null
return e.state.showChildren&&(o=e.props.hasChildren&&this.props.data.children.map(function(t,n){var o=e.props.rowSettings.getRowKey(t,n)
if("undefined"!=typeof t.children){var i=e.constructor.Griddle
return r.createElement("tr",{key:o,style:{paddingLeft:5}},r.createElement("td",{colSpan:e.props.columnSettings.getVisibleColumnCount(),className:"griddle-parent",style:e.props.useGriddleStyles?{border:"none",
padding:"0 0 0 5px"}:null},r.createElement(i,{rowMetadata:{key:"id"},isSubGriddle:!0,results:[t],columns:e.props.columnSettings.getColumns(),tableClassName:e.props.tableClassName,parentRowExpandedClassName:e.props.parentRowExpandedClassName,
parentRowCollapsedClassName:e.props.parentRowCollapsedClassName,showTableHeading:!1,showPager:!1,columnMetadata:e.props.columnSettings.columnMetadata,parentRowExpandedComponent:e.props.parentRowExpandedComponent,
parentRowCollapsedComponent:e.props.parentRowCollapsedComponent,paddingHeight:e.props.paddingHeight,rowHeight:e.props.rowHeight})))}return r.createElement(e.props.rowSettings.rowComponent,{useGriddleStyles:e.props.useGriddleStyles,
isSubGriddle:e.props.isSubGriddle,data:t,columnSettings:e.props.columnSettings,isChildRow:!0,columnMetadata:e.props.columnSettings.columnMetadata,key:o})})),e.props.hasChildren===!1?t[0]:r.createElement("tbody",null,e.state.showChildren?t.concat(o):t)

}})
e.exports=s},function(e,t,n){var r=n(200),o=n(203),i=o(function(e,t){return null==e?{}:r(e,t)})
e.exports=i},function(e,t,n){function r(e,t){return e=Object(e),o(e,t,function(t,n){return i(e,n)})}var o=n(201),i=n(145)
e.exports=r},function(e,t,n){function r(e,t,n){for(var r=-1,a=t.length,l={};++r<a;){var u=t[r],p=o(e,u)
n(p,u)&&i(l,s(u,e),p)}return l}var o=n(135),i=n(202),s=n(136)
e.exports=r},function(e,t,n){function r(e,t,n,r){if(!a(e))return e
t=i(t,e)
for(var u=-1,p=t.length,c=p-1,d=e;null!=d&&++u<p;){var f=l(t[u]),h=n
if(u!=c){var m=d[f]
h=r?r(m,f,d):void 0,void 0===h&&(h=a(m)?m:s(t[u+1])?[]:{})}o(d,f,h),d=d[f]}return e}var o=n(194),i=n(136),s=n(114),a=n(72),l=n(144)
e.exports=r},function(e,t,n){function r(e){return s(i(e,void 0,o),e+"")}var o=n(204),i=n(177),s=n(179)
e.exports=r},function(e,t,n){function r(e){var t=null==e?0:e.length
return t?o(e,1):[]}var o=n(169)
e.exports=r},function(e,t,n){"use strict"
function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(206),s=function(){function e(){
var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=arguments.length<=1||void 0===arguments[1]?null:arguments[1],o=!(arguments.length<=2||void 0===arguments[2])&&arguments[2]
r(this,e),this.rowMetadata=t,this.rowComponent=n,this.isCustom=o}return o(e,[{key:"getRowKey",value:function t(e,n){var r
return r=this.hasRowMetadataKey()?e[this.rowMetadata.key]:i("grid_row")}},{key:"hasRowMetadataKey",value:function n(){return this.hasRowMetadata()&&null!==this.rowMetadata.key&&void 0!==this.rowMetadata.key

}},{key:"getBodyRowMetadataClass",value:function s(e){return this.hasRowMetadata()&&null!==this.rowMetadata.bodyCssClassName&&void 0!==this.rowMetadata.bodyCssClassName?"function"==typeof this.rowMetadata.bodyCssClassName?this.rowMetadata.bodyCssClassName(e):this.rowMetadata.bodyCssClassName:null

}},{key:"getHeaderRowMetadataClass",value:function a(){return this.hasRowMetadata()&&null!==this.rowMetadata.headerCssClassName&&void 0!==this.rowMetadata.headerCssClassName?this.rowMetadata.headerCssClassName:null

}},{key:"hasRowMetadata",value:function l(){return null!==this.rowMetadata}}]),e}()
e.exports=s},function(e,t,n){function r(e){var t=++i
return o(e)+t}var o=n(142),i=0
e.exports=r},function(e,t,n){"use strict"
var r=n(4),o=r.createClass({displayName:"GridFilter",getDefaultProps:function i(){return{placeholderText:""}},handleChange:function s(e){this.props.changeFilter(e.target.value)},render:function a(){return r.createElement("div",{
className:"filter-container"},r.createElement("input",{type:"text",name:"filter",placeholder:this.props.placeholderText,className:"form-control",onChange:this.handleChange}))}})
e.exports=o},function(e,t,n){"use strict"
var r=n(4),o=n(193),i=r.createClass({displayName:"GridPagination",getDefaultProps:function s(){return{maxPage:0,nextText:"",previousText:"",currentPage:0,useGriddleStyles:!0,nextClassName:"griddle-next",
previousClassName:"griddle-previous",nextIconComponent:null,previousIconComponent:null}},pageChange:function a(e){this.props.setPage(parseInt(e.target.value,10)-1)},render:function l(){var e="",t=""
this.props.currentPage>0&&(e=r.createElement("button",{type:"button",onClick:this.props.previous,style:this.props.useGriddleStyles?{color:"#222",border:"none",background:"none",margin:"0 0 0 10px"}:null
},this.props.previousIconComponent,this.props.previousText)),this.props.currentPage!==this.props.maxPage-1&&(t=r.createElement("button",{type:"button",onClick:this.props.next,style:this.props.useGriddleStyles?{
color:"#222",border:"none",background:"none",margin:"0 10px 0 0"}:null},this.props.nextText,this.props.nextIconComponent))
var n=null,i=null,s=null
if(this.props.useGriddleStyles===!0){var a={"float":"left",minHeight:"1px",marginTop:"5px"}
s=o({textAlign:"right",width:"34%"},a),i=o({textAlign:"center",width:"33%"},a),n=o({width:"33%"},a)}for(var l=[],u=1;u<=this.props.maxPage;u++)l.push(r.createElement("option",{value:u,key:u},u))
return r.createElement("div",{style:this.props.useGriddleStyles?{minHeight:"35px"}:null},r.createElement("div",{className:this.props.previousClassName,style:n},e),r.createElement("div",{className:"griddle-page",
style:i},r.createElement("select",{value:this.props.currentPage+1,onChange:this.pageChange},l)," / ",this.props.maxPage),r.createElement("div",{className:this.props.nextClassName,style:s},t))}})
e.exports=i},function(e,t,n){"use strict"
var r=n(4),o=n(210),i=n(214),s=n(161),a=r.createClass({displayName:"GridSettings",getDefaultProps:function l(){return{columns:[],columnMetadata:[],selectedColumns:[],settingsText:"",maxRowsText:"",resultsPerPage:0,
enableToggleCustom:!1,useCustomComponent:!1,useGriddleStyles:!0,toggleCustomComponent:function e(){}}},setPageSize:function u(e){var t=parseInt(e.target.value,10)
this.props.setPageSize(t)},handleChange:function p(e){var t=e.target.dataset?e.target.dataset.name:e.target.getAttribute("data-name")
e.target.checked===!0&&o(this.props.selectedColumns,t)===!1?(this.props.selectedColumns.push(t),this.props.setColumns(this.props.selectedColumns)):this.props.setColumns(i(this.props.selectedColumns,t))

},render:function c(){var e=this,t=[]
e.props.useCustomComponent===!1&&(t=this.props.columns.map(function(t,n){var i=o(e.props.selectedColumns,t),a=s(e.props.columnMetadata,{columnName:t}),l=t
return"undefined"!=typeof a&&"undefined"!=typeof a.displayName&&null!=a.displayName&&(l=a.displayName),"undefined"!=typeof a&&null!=a&&a.locked?r.createElement("div",{className:"column checkbox"},r.createElement("label",null,r.createElement("input",{
type:"checkbox",disabled:!0,name:"check",checked:i,"data-name":t}),l)):"undefined"!=typeof a&&null!=a&&"undefined"!=typeof a.visible&&a.visible===!1?null:r.createElement("div",{className:"griddle-column-selection checkbox",
key:t,style:e.props.useGriddleStyles?{"float":"left",width:"20%"}:null},r.createElement("label",null,r.createElement("input",{type:"checkbox",name:"check",onChange:e.handleChange,checked:i,"data-name":t
}),l))}))
var n=e.props.enableToggleCustom?r.createElement("div",{className:"form-group"},r.createElement("label",{htmlFor:"maxRows"},r.createElement("input",{type:"checkbox",checked:this.props.useCustomComponent,
onChange:this.props.toggleCustomComponent})," ",this.props.enableCustomFormatText)):"",i=this.props.showSetPageSize?r.createElement("div",null,r.createElement("label",{htmlFor:"maxRows"},this.props.maxRowsText,":",r.createElement("select",{
onChange:this.setPageSize,value:this.props.resultsPerPage},r.createElement("option",{value:"5"},"5"),r.createElement("option",{value:"10"},"10"),r.createElement("option",{value:"25"},"25"),r.createElement("option",{
value:"50"},"50"),r.createElement("option",{value:"100"},"100")))):""
return r.createElement("div",{className:"griddle-settings",style:this.props.useGriddleStyles?{backgroundColor:"#FFF",border:"1px solid #DDD",color:"#222",padding:"10px",marginBottom:"10px"}:null},r.createElement("h6",null,this.props.settingsText),r.createElement("div",{
className:"griddle-columns",style:this.props.useGriddleStyles?{clear:"both",display:"table",width:"100%",borderBottom:"1px solid #EDEDED",marginBottom:"10px"}:null},t),i,n)}})
e.exports=a},function(e,t,n){function r(e,t,n,r){e=i(e)?e:l(e),n=n&&!r?a(n):0
var p=e.length
return n<0&&(n=u(p+n,0)),s(e)?n<=p&&e.indexOf(t,n)>-1:!!p&&o(e,t,n)>-1}var o=n(188),i=n(124),s=n(211),a=n(165),l=n(212),u=Math.max
e.exports=r},function(e,t,n){function r(e){return"string"==typeof e||!i(e)&&s(e)&&o(e)==a}var o=n(66),i=n(111),s=n(110),a="[object String]"
e.exports=r},function(e,t,n){function r(e){return null==e?[]:o(e,i(e))}var o=n(213),i=n(105)
e.exports=r},function(e,t,n){function r(e,t){return o(t,function(t){return e[t]})}var o=n(44)
e.exports=r},function(e,t,n){var r=n(186),o=n(176),i=n(192),s=o(function(e,t){return i(e)?r(e,t):[]})
e.exports=s},function(e,t,n){"use strict"
var r=n(4),o=r.createClass({displayName:"GridNoData",getDefaultProps:function i(){return{noDataMessage:"No Data"}},render:function s(){var e=this
return r.createElement("div",null,this.props.noDataMessage)}})
e.exports=o},function(e,t,n){"use strict"
var r=n(4),o=n(42),i=n(217),s=n(65),a=n(221),l=n(193),u=n(223),p=n(229),c=n(214),d=r.createClass({displayName:"GridRow",getDefaultProps:function f(){return{isChildRow:!1,showChildren:!1,data:{},columnSettings:null,
rowSettings:null,hasChildren:!1,useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,paddingHeight:null,rowHeight:null,parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",
parentRowCollapsedComponent:"▶",parentRowExpandedComponent:"▼",onRowClick:null,multipleSelectionSettings:null}},handleClick:function h(e){null!==this.props.onRowClick&&s(this.props.onRowClick)?this.props.onRowClick(this,e):this.props.hasChildren&&this.props.toggleChildren()

},handleSelectionChange:function m(e){},handleSelectClick:function g(e){this.props.multipleSelectionSettings.isMultipleSelection&&("checkbox"===e.target.type?this.props.multipleSelectionSettings.toggleSelectRow(this.props.data,this.refs.selected.checked):this.props.multipleSelectionSettings.toggleSelectRow(this.props.data,!this.refs.selected.checked))

},verifyProps:function y(){null===this.props.columnSettings&&console.error("gridRow: The columnSettings prop is null and it shouldn't be")},formatData:function v(e){return"boolean"==typeof e?String(e):e

},render:function b(){var e=this
this.verifyProps()
var t=this,n=null
this.props.useGriddleStyles&&(n={margin:"0px",padding:t.props.paddingHeight+"px 5px "+t.props.paddingHeight+"px 5px",height:t.props.rowHeight?this.props.rowHeight-2*t.props.paddingHeight+"px":null,backgroundColor:"#FFF",
borderTopColor:"#DDD",color:"#222"})
var o=this.props.columnSettings.getColumns(),d=a(o,[]),f=l({},this.props.data)
u(f,d)
var h=p(i.pick(f,c(o,"children"))),m=h.map(function(t,o){var i=null,s=e.props.columnSettings.getColumnMetadataByName(t[0]),a=0===o&&e.props.hasChildren&&e.props.showChildren===!1&&e.props.useGriddleIcons?r.createElement("span",{
style:e.props.useGriddleStyles?{fontSize:"10px",marginRight:"5px"}:null},e.props.parentRowCollapsedComponent):0===o&&e.props.hasChildren&&e.props.showChildren&&e.props.useGriddleIcons?r.createElement("span",{
style:e.props.useGriddleStyles?{fontSize:"10px"}:null},e.props.parentRowExpandedComponent):""
if(0===o&&e.props.isChildRow&&e.props.useGriddleStyles&&(n=l(n,{paddingLeft:10})),e.props.columnSettings.hasColumnMetadata()&&"undefined"!=typeof s&&null!==s)if("undefined"!=typeof s.customComponent&&null!==s.customComponent){
var u=r.createElement(s.customComponent,{data:t[1],rowData:f,metadata:s})
i=r.createElement("td",{onClick:e.handleClick,className:s.cssClassName,key:o,style:n},u)}else i=r.createElement("td",{onClick:e.handleClick,className:s.cssClassName,key:o,style:n},a,e.formatData(t[1]))


return i||r.createElement("td",{onClick:e.handleClick,key:o,style:n},a,t[1])}),g,y
if(null!==this.props.onRowClick&&s(this.props.onRowClick)?(g=null,y=this.handleSelectClick):this.props.multipleSelectionSettings&&this.props.multipleSelectionSettings.isMultipleSelection?(g=this.handleSelectClick,
y=null):(g=null,y=null),m&&this.props.multipleSelectionSettings&&this.props.multipleSelectionSettings.isMultipleSelection){var v=this.props.multipleSelectionSettings.getSelectedRowIds()
m.unshift(r.createElement("td",{key:"selection",style:n,className:"griddle-select griddle-select-cell",onClick:y},r.createElement("input",{type:"checkbox",checked:this.props.multipleSelectionSettings.getIsRowChecked(f),
onChange:this.handleSelectionChange,ref:"selected"})))}var b=t.props.rowSettings&&t.props.rowSettings.getBodyRowMetadataClass(t.props.data)||"standard-row"
return t.props.isChildRow?b="child-row":t.props.hasChildren&&(b=t.props.showChildren?this.props.parentRowExpandedClassName:this.props.parentRowCollapsedClassName),r.createElement("tr",{onClick:g,className:b
},m)}})
e.exports=d},function(e,t,n){"use strict"
function r(e){for(var t=/\[("|')(.+)\1\]|([^.\[\]]+)/g,n=[],r;null!==(r=t.exec(e));)n.push(r[2]||r[3])
return n}function o(e,t){if("string"==typeof t){if(void 0!==e[t])return e[t]
t=r(t)}for(var n=-1,o=t.length;++n<o&&null!=e;)e=e[t[n]]
return n===o?e:void 0}function i(e,t){var n={},r=e,i
i=function(e,t){return e in t},r=Object(r)
for(var s=0,a=t.length;s<a;s++){var l=t[s]
i(l,r)&&(n[l]=o(r,l))}return n}function s(e,t){var n=[]
return a(e,function(e,r){var o=t?t+"."+r:r
!l(e)||u(e)||p(e)?n.push(o):n=n.concat(s(e,o))}),n}var a=n(218),l=n(72),u=n(111),p=n(65)
e.exports={pick:i,getAt:o,keys:s}},function(e,t,n){function r(e,t){var n=a(e)?o:i
return n(e,s(t))}var o=n(219),i=n(153),s=n(220),a=n(111)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&t(e[n],n,e)!==!1;);return e}e.exports=n},function(e,t,n){function r(e){return"function"==typeof e?e:o}var o=n(148)
e.exports=r},function(e,t,n){function r(e,t){return i(e||[],t||[],o)}var o=n(194),i=n(222)
e.exports=r},function(e,t){function n(e,t,n){for(var r=-1,o=e.length,i=t.length,s={};++r<o;){var a=r<i?t[r]:void 0
n(s,e[r],a)}return s}e.exports=n},function(e,t,n){var r=n(178),o=n(224),i=n(225),s=n(176),a=s(function(e){return e.push(void 0,o),r(i,void 0,e)})
e.exports=a},function(e,t,n){function r(e,t,n,r){return void 0===e||o(e,i[n])&&!s.call(r,n)?t:e}var o=n(53),i=Object.prototype,s=i.hasOwnProperty
e.exports=r},function(e,t,n){var r=n(196),o=n(197),i=n(226),s=o(function(e,t,n,o){r(t,i(t),e,o)})
e.exports=s},function(e,t,n){function r(e){return s(e)?o(e,!0):i(e)}var o=n(106),i=n(227),s=n(124)
e.exports=r},function(e,t,n){function r(e){if(!o(e))return s(e)
var t=i(e),n=[]
for(var r in e)("constructor"!=r||!t&&l.call(e,r))&&n.push(r)
return n}var o=n(72),i=n(121),s=n(228),a=Object.prototype,l=a.hasOwnProperty
e.exports=r},function(e,t){function n(e){var t=[]
if(null!=e)for(var n in Object(e))t.push(n)
return t}e.exports=n},function(e,t,n){var r=n(230),o=n(105),i=r(o)
e.exports=i},function(e,t,n){function r(e){return function(t){var n=i(t)
return n==l?s(t):n==u?a(t):o(t,e(t))}}var o=n(231),i=n(125),s=n(102),a=n(232),l="[object Map]",u="[object Set]"
e.exports=r},function(e,t,n){function r(e,t){return o(t,function(t){return[t,e[t]]})}var o=n(44)
e.exports=r},function(e,t){function n(e){var t=-1,n=Array(e.size)
return e.forEach(function(e){n[++t]=[e,e]}),n}e.exports=n},function(e,t,n){"use strict"
var r=n(4),o=r.createClass({displayName:"CustomRowComponentContainer",getDefaultProps:function i(){return{data:[],metadataColumns:[],className:"",customComponent:{},globalData:{}}},render:function s(){
var e=this
if("function"!=typeof e.props.customComponent)return console.log("Couldn't find valid template."),r.createElement("div",{className:this.props.className})
var t=this.props.data.map(function(t,n){return r.createElement(e.props.customComponent,{data:t,metadataColumns:e.props.metadataColumns,key:n,globalData:e.props.globalData})}),n=this.props.showPager&&this.props.pagingContent


return r.createElement("div",{className:this.props.className,style:this.props.style},t)}})
e.exports=o},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(4),i=o.createClass({displayName:"CustomPaginationContainer",getDefaultProps:function s(){return{maxPage:0,nextText:"",
previousText:"",currentPage:0,customPagerComponent:{},customPagerComponentOptions:{}}},render:function a(){var e=this
return"function"!=typeof e.props.customPagerComponent?(console.log("Couldn't find valid template."),o.createElement("div",null)):o.createElement(e.props.customPagerComponent,r({},this.props.customPagerComponentOptions,{
maxPage:this.props.maxPage,nextText:this.props.nextText,previousText:this.props.previousText,currentPage:this.props.currentPage,setPage:this.props.setPage,previous:this.props.previous,next:this.props.next
}))}})
e.exports=i},function(e,t,n){"use strict"
var r=n(4),o=r.createClass({displayName:"CustomFilterContainer",getDefaultProps:function i(){return{placeholderText:""}},render:function s(){var e=this
return"function"!=typeof e.props.customFilterComponent?(console.log("Couldn't find valid template."),r.createElement("div",null)):r.createElement(e.props.customFilterComponent,{changeFilter:this.props.changeFilter,
results:this.props.results,currentResults:this.props.currentResults,placeholderText:this.props.placeholderText})}})
e.exports=o},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
return r?(t=n||void 0===t?1:i(t),o(e,t<0?0:t,r)):[]}var o=n(237),i=n(165)
e.exports=r},function(e,t){function n(e,t,n){var r=-1,o=e.length
t<0&&(t=-t>o?0:o+t),n=n>o?o:n,n<0&&(n+=o),o=t>n?0:n-t>>>0,t>>>=0
for(var i=Array(o);++r<o;)i[r]=e[r+t]
return i}e.exports=n},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
return r?(t=n||void 0===t?1:i(t),t=r-t,o(e,0,t<0?0:t)):[]}var o=n(237),i=n(165)
e.exports=r},function(e,t,n){function r(e,t,n){return e&&e.length?(t=n||void 0===t?1:i(t),o(e,0,t<0?0:t)):[]}var o=n(237),i=n(165)
e.exports=r},function(e,t,n){function r(e){var t=null==e?0:e.length
return t?o(e,0,-1):[]}var o=n(237)
e.exports=r},function(e,t,n){var r=n(44),o=n(242),i=n(176),s=n(243),a=i(function(e){var t=r(e,s)
return t.length&&t[0]===e[0]?o(t):[]})
e.exports=a},function(e,t,n){function r(e,t,n){for(var r=n?s:i,c=e[0].length,d=e.length,f=d,h=Array(d),m=1/0,g=[];f--;){var y=e[f]
f&&t&&(y=a(y,l(t))),m=p(y.length,m),h[f]=!n&&(t||c>=120&&y.length>=120)?new o(f&&y):void 0}y=e[0]
var v=-1,b=h[0]
e:for(;++v<c&&g.length<m;){var _=y[v],E=t?t(_):_
if(_=n||0!==_?_:0,!(b?u(b,E):r(g,E,n))){for(f=d;--f;){var C=h[f]
if(!(C?u(C,E):r(e[f],E,n)))continue e}b&&b.push(E),g.push(_)}}return g}var o=n(95),i=n(187),s=n(191),a=n(44),l=n(118),u=n(99),p=Math.min
e.exports=r},function(e,t,n){function r(e){return o(e)?e:[]}var o=n(192)
e.exports=r},function(e,t,n){function r(e){if(null==e)return!0
if(l(e)&&(a(e)||"string"==typeof e||"function"==typeof e.splice||u(e)||c(e)||s(e)))return!e.length
var t=i(e)
if(t==d||t==f)return!e.size
if(p(e))return!o(e).length
for(var n in e)if(m.call(e,n))return!1
return!0}var o=n(120),i=n(125),s=n(108),a=n(111),l=n(124),u=n(112),p=n(121),c=n(115),d="[object Map]",f="[object Set]",h=Object.prototype,m=h.hasOwnProperty
e.exports=r},function(e,t){function n(e){return null===e}e.exports=n},function(e,t){function n(e){return void 0===e}e.exports=n},function(e,t,n){var r=n(44),o=n(248),i=n(276),s=n(136),a=n(196),l=n(203),u=n(261),p=1,c=2,d=4,f=l(function(e,t){
var n={}
if(null==e)return n
var l=!1
t=r(t,function(t){return t=s(t,e),l||(l=t.length>1),t}),a(e,u(e),n),l&&(n=o(n,p|c|d))
for(var f=t.length;f--;)i(n,t[f])
return n})
e.exports=f},function(e,t,n){function r(e,t,n,x,T,O){var I,k=t&S,N=t&w,j=t&P
if(n&&(I=T?n(e,x,T,O):n(e)),void 0!==I)return I
if(!E(e))return e
var U=b(e)
if(U){if(I=g(e),!k)return p(e,I)}else{var L=m(e),M=L==A||L==D
if(_(e))return u(e,k)
if(L==R||L==F||M&&!T){if(I=N||M?{}:v(e),!k)return N?d(e,l(I,e)):c(e,a(I,e))}else{if(!X[L])return T?e:{}
I=y(e,L,r,k)}}O||(O=new o)
var z=O.get(e)
if(z)return z
O.set(e,I)
var q=j?N?h:f:N?keysIn:C,B=U?void 0:q(e)
return i(B||e,function(o,i){B&&(i=o,o=e[i]),s(I,i,r(o,t,n,i,e,O))}),I}var o=n(48),i=n(219),s=n(194),a=n(249),l=n(250),u=n(251),p=n(252),c=n(253),d=n(256),f=n(259),h=n(261),m=n(125),g=n(262),y=n(263),v=n(274),b=n(111),_=n(112),E=n(72),C=n(105),S=1,w=2,P=4,F="[object Arguments]",x="[object Array]",T="[object Boolean]",O="[object Date]",I="[object Error]",A="[object Function]",D="[object GeneratorFunction]",k="[object Map]",N="[object Number]",R="[object Object]",j="[object RegExp]",U="[object Set]",L="[object String]",M="[object Symbol]",z="[object WeakMap]",q="[object ArrayBuffer]",B="[object DataView]",H="[object Float32Array]",G="[object Float64Array]",V="[object Int8Array]",Q="[object Int16Array]",W="[object Int32Array]",$="[object Uint8Array]",K="[object Uint8ClampedArray]",Y="[object Uint16Array]",Z="[object Uint32Array]",X={}


X[F]=X[x]=X[q]=X[B]=X[T]=X[O]=X[H]=X[G]=X[V]=X[Q]=X[W]=X[k]=X[N]=X[R]=X[j]=X[U]=X[L]=X[M]=X[$]=X[K]=X[Y]=X[Z]=!0,X[I]=X[A]=X[z]=!1,e.exports=r},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(196),i=n(105)


e.exports=r},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(196),i=n(226)
e.exports=r},function(e,t,n){(function(e){function r(e,t){if(t)return e.slice()
var n=e.length,r=u?u(n):new e.constructor(n)
return e.copy(r),r}var o=n(68),i="object"==typeof t&&t&&!t.nodeType&&t,s=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=s&&s.exports===i,l=a?o.Buffer:void 0,u=l?l.allocUnsafe:void 0
e.exports=r}).call(t,n(28)(e))},function(e,t){function n(e,t){var n=-1,r=e.length
for(t||(t=Array(r));++n<r;)t[n]=e[n]
return t}e.exports=n},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(196),i=n(254)
e.exports=r},function(e,t,n){var r=n(123),o=n(255),i=Object.getOwnPropertySymbols,s=i?r(i,Object):o
e.exports=s},function(e,t){function n(){return[]}e.exports=n},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(196),i=n(257)
e.exports=r},function(e,t,n){var r=n(170),o=n(258),i=n(254),s=n(255),a=Object.getOwnPropertySymbols,l=a?function(e){for(var t=[];e;)r(t,i(e)),e=o(e)
return t}:s
e.exports=l},function(e,t,n){var r=n(123),o=r(Object.getPrototypeOf,Object)
e.exports=o},function(e,t,n){function r(e){return o(e,s,i)}var o=n(260),i=n(254),s=n(105)
e.exports=r},function(e,t,n){function r(e,t,n){var r=t(e)
return i(e)?r:o(r,n(e))}var o=n(170),i=n(111)
e.exports=r},function(e,t,n){function r(e){return o(e,s,i)}var o=n(260),i=n(257),s=n(226)
e.exports=r},function(e,t){function n(e){var t=e.length,n=e.constructor(t)
return t&&"string"==typeof e[0]&&o.call(e,"index")&&(n.index=e.index,n.input=e.input),n}var r=Object.prototype,o=r.hasOwnProperty
e.exports=n},function(e,t,n){function r(e,t,n,r){var I=e.constructor
switch(t){case b:return o(e)
case c:case d:return new I((+e))
case _:return i(e,r)
case E:case C:case S:case w:case P:case F:case x:case T:case O:return p(e,r)
case f:return s(e,r,n)
case h:case y:return new I(e)
case m:return a(e)
case g:return l(e,r,n)
case v:return u(e)}}var o=n(264),i=n(265),s=n(266),a=n(269),l=n(270),u=n(272),p=n(273),c="[object Boolean]",d="[object Date]",f="[object Map]",h="[object Number]",m="[object RegExp]",g="[object Set]",y="[object String]",v="[object Symbol]",b="[object ArrayBuffer]",_="[object DataView]",E="[object Float32Array]",C="[object Float64Array]",S="[object Int8Array]",w="[object Int16Array]",P="[object Int32Array]",F="[object Uint8Array]",x="[object Uint8ClampedArray]",T="[object Uint16Array]",O="[object Uint32Array]"


e.exports=r},function(e,t,n){function r(e){var t=new e.constructor(e.byteLength)
return new o(t).set(new o(e)),t}var o=n(101)
e.exports=r},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer
return new e.constructor(n,e.byteOffset,e.byteLength)}var o=n(264)
e.exports=r},function(e,t,n){function r(e,t,n){var r=t?n(s(e),a):s(e)
return i(r,o,new e.constructor)}var o=n(267),i=n(268),s=n(102),a=1
e.exports=r},function(e,t){function n(e,t){return e.set(t[0],t[1]),e}e.exports=n},function(e,t){function n(e,t,n,r){var o=-1,i=null==e?0:e.length
for(r&&i&&(n=e[++o]);++o<i;)n=t(n,e[o],o,e)
return n}e.exports=n},function(e,t){function n(e){var t=new e.constructor(e.source,r.exec(e))
return t.lastIndex=e.lastIndex,t}var r=/\w*$/
e.exports=n},function(e,t,n){function r(e,t,n){var r=t?n(s(e),a):s(e)
return i(r,o,new e.constructor)}var o=n(271),i=n(268),s=n(103),a=1
e.exports=r},function(e,t){function n(e,t){return e.add(t),e}e.exports=n},function(e,t,n){function r(e){return s?Object(s.call(e)):{}}var o=n(67),i=o?o.prototype:void 0,s=i?i.valueOf:void 0
e.exports=r},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer
return new e.constructor(n,e.byteOffset,e.length)}var o=n(264)
e.exports=r},function(e,t,n){function r(e){return"function"!=typeof e.constructor||s(e)?{}:o(i(e))}var o=n(275),i=n(258),s=n(121)
e.exports=r},function(e,t,n){var r=n(72),o=Object.create,i=function(){function e(){}return function(t){if(!r(t))return{}
if(o)return o(t)
e.prototype=t
var n=new e
return e.prototype=void 0,n}}()
e.exports=i},function(e,t,n){function r(e,t){return t=o(t,e),e=s(e,t),null==e||delete e[a(i(t))]}var o=n(136),i=n(277),s=n(278),a=n(144)
e.exports=r},function(e,t){function n(e){var t=null==e?0:e.length
return t?e[t-1]:void 0}e.exports=n},function(e,t,n){function r(e,t){return t.length<2?e:o(e,i(t,0,-1))}var o=n(135),i=n(237)
e.exports=r},function(e,t,n){function r(e,t,n,r){return null==e?[]:(i(t)||(t=null==t?[]:[t]),n=r?void 0:n,i(n)||(n=null==n?[]:[n]),o(e,t,n))}var o=n(172),i=n(111)
e.exports=r},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(l){o=!0,i=l}finally{try{!r&&s["return"]&&s["return"]()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(4),p=r(u),c=n(39),d=r(c),f=n(3),h=r(f),m=n(21),g=n(29),y=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.getColumns=n.getColumns.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handleRowClick=n.handleRowClick.bind(n),n.renderSelect=n.renderSelect.bind(n),n.renderTitle=n.renderTitle.bind(n),
n.renderNoItemsNotice=n.renderNoItemsNotice.bind(n),n.state={enableSort:!1},n}return s(t,e),l(t,[{key:"componentDidMount",value:function n(){this.setState({enableSort:!0})}},{key:"componentWillUnmount",
value:function r(){this.setState({enableSort:!1})}},{key:"getColumns",value:function u(){var e=["thumbnail","title","size","lastEdited"]
return this.props.selectableItems&&e.unshift("selected"),e}},{key:"getColumnConfig",value:function c(){return[{columnName:"selected",sortable:!1,displayName:"",cssClassName:"gallery__table-column--select",
customComponent:this.renderSelect},{columnName:"thumbnail",sortable:!1,displayName:"",cssClassName:"gallery__table-column--image",customComponent:this.renderThumbnail},{columnName:"title",customCompareFn:function e(){
return 0},cssClassName:"gallery__table-column--title",customComponent:this.renderTitle},{columnName:"lastEdited",displayName:"Modified",customComponent:this.renderDate},{columnName:"size",sortable:!1,displayName:"Size",
cssClassName:"sort--disabled",customComponent:this.renderSize}]}},{key:"getTableProps",value:function f(){var e=this.props.sort.split(","),t=a(e,2),n=t[0],r=t[1]
return{tableClassName:"gallery__table table table-hover",gridClassName:"gallery__main-view--table",rowMetadata:{bodyCssClassName:"gallery__table-row"},sortAscendingComponent:"",sortDescendingComponent:"",
useExternal:!0,externalSetPage:this.handleSetPage,externalChangeSort:this.handleSort,externalSetFilter:function o(){return null},externalSetPageSize:function i(){return null},externalCurrentPage:this.props.page-1,
externalMaxPage:Math.ceil(this.props.totalCount/this.props.limit),externalSortColumn:n,externalSortAscending:this.state.enableSort?"asc"===r:"asc"!==r,initialSort:n,columns:this.getColumns(),columnMetadata:this.getColumnConfig(),
useGriddleStyles:!1,onRowClick:this.handleRowClick,results:this.props.files,customNoDataComponent:this.renderNoItemsNotice}}},{key:"handleActivate",value:function m(e,t){"folder"===t.type?this.props.onOpenFolder(e,t):this.props.onOpenFile(e,t)

}},{key:"handleRowClick",value:function y(e,t){var n=e.props.data
return t.currentTarget.classList.contains("gallery__table-column--select")&&(t.stopPropagation(),t.preventDefault(),"function"==typeof this.props.onSelect)?void this.props.onSelect(t,n):void this.handleActivate(t,n)

}},{key:"handleSort",value:function v(e,t){var n=t?"asc":"desc"
this.state.enableSort&&this.props.onSort(e+","+n)}},{key:"handleSetPage",value:function b(e){this.props.onSetPage(e+1)}},{key:"preventFocus",value:function _(e){e.preventDefault()}},{key:"renderNoItemsNotice",
value:function E(){return 0!==this.props.files.length||this.props.loading?null:p["default"].createElement("p",{className:"gallery__no-item-notice"},h["default"]._t("AssetAdmin.NOITEMSFOUND"))}},{key:"renderSize",
value:function C(e){if("folder"===e.rowData.type)return null
var t=(0,g.fileSize)(e.data)
return p["default"].createElement("span",null,t)}},{key:"renderProgressBar",value:function S(e){if(!e.uploading||e.message&&"error"===e.message.type)return null
if(e.id>0)return p["default"].createElement("div",{className:"gallery__progress-bar--complete"})
var t={className:"gallery__progress-bar-progress",style:{width:e.progress+"%"}}
return p["default"].createElement("div",{className:"gallery__progress-bar"},p["default"].createElement("div",t))}},{key:"renderTitle",value:function w(e){var t=this.renderProgressBar(e.rowData)
return p["default"].createElement("div",{className:"fill-width"},p["default"].createElement("div",{className:"flexbox-area-grow"},e.data),t)}},{key:"renderSelect",value:function P(e){return p["default"].createElement("input",{
type:"checkbox",title:h["default"]._t("AssetAdmin.SELECT"),checked:e.data,tabIndex:"-1",onMouseDown:this.preventFocus})}},{key:"renderDate",value:function F(e){return"folder"===e.rowData.type?null:p["default"].createElement("span",null,e.data)

}},{key:"renderThumbnail",value:function x(e){var t=e.data||e.rowData.url
return"folder"===e.rowData.type?p["default"].createElement("div",{className:"gallery__table-image--folder"}):t?p["default"].createElement("img",{src:t,alt:e.rowData.title,className:"gallery__table-image"
}):p["default"].createElement("div",{className:"gallery__table-image--error"})}},{key:"render",value:function T(){return p["default"].createElement(d["default"],this.getTableProps())}}]),t}(u.Component)


y.defaultProps=m.galleryViewDefaultProps,y.propTypes=m.galleryViewPropTypes,t["default"]=y},function(e,t){e.exports=FormAlert},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0}),t.BackButton=void 0
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(4),u=r(l),p=n(37),c=r(p),d=n(38),f=r(d),h=function(e){
function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),a(t,[{key:"render",value:function n(){var e=["btn","btn-secondary","btn--no-text","font-icon-level-up","btn--icon-large","gallery__back"]


this.props.enlarged&&(e.push("z-depth-1"),e.push("gallery__back--droppable-hover"))
var t=this.props.badge
return u["default"].createElement("button",{className:e.join(" "),title:"Navigate up a level",onClick:this.props.onClick},!!t&&u["default"].createElement(f["default"],{className:"gallery__back-badge",status:t.status,
message:t.message}))}}]),t}(l.Component)
h.propTypes={onClick:l.PropTypes.func,enlarged:l.PropTypes.bool,badge:l.PropTypes.shape(f["default"].propTypes)},t.BackButton=h,t["default"]=(0,c["default"])("GalleryItem")(h)},function(e,t){e.exports=ReactApollo

},function(e,t){e.exports=GraphQLTag},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(4),u=r(l),p=n(35),c=n(36),d=r(c),f=n(286),h=r(f),m=null,g=(0,
p.DragDropContext)(function(e){return m=e,(0,d["default"])(e)}),y=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),a(t,[{key:"componentDidMount",
value:function n(){window.addEventListener("drop",this.handleDrop,!0)}},{key:"componentWillUnmount",value:function r(){window.removeEventListener("drop",this.handleDrop,!0)}},{key:"handleDrop",value:function l(){
var e=m&&m.backend
e&&e.isDraggingNativeItem()&&e.endDragNativeItem()}},{key:"render",value:function p(){var e=this.props,t=e.className,n=e.children
return u["default"].createElement("div",{className:t},n,u["default"].createElement(h["default"],null))}}]),t}(l.Component)
y.propTypes={className:l.PropTypes.string,children:l.PropTypes.arrayOf(l.PropTypes.node)},t["default"]=g(y)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(4),u=r(l),p=n(35),c=n(32),d=r(c),f=function(e){
function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),a(t,[{key:"getOffset",value:function n(){var e=this.props.offset
return{transform:e&&"translate("+e.x+"px, "+e.y+"px)"}}},{key:"render",value:function r(){if(!this.props.isDragging)return null
var e=this.props.item
if(!e.selected)return null
var t=e.selected.length
return u["default"].createElement("div",{className:"gallery-item__drag-layer"},u["default"].createElement("div",{className:"gallery-item__drag-layer-item",style:this.getOffset()},t>1&&[u["default"].createElement("div",{
key:"1",className:"gallery-item__drag-shadow"}),u["default"].createElement("div",{key:"2",className:"gallery-item__drag-shadow gallery-item__drag-shadow--second"}),u["default"].createElement("div",{key:"3",
className:"gallery-item__drag-shadow gallery-item__drag-shadow--third"})],u["default"].createElement(d["default"],e.props),t>1&&u["default"].createElement("span",{className:"gallery-item__drag-layer-count label label-primary label-pill"
},t)))}}]),t}(l.Component)
f.propTypes={item:l.PropTypes.object,offset:l.PropTypes.shape({x:l.PropTypes.number.isRequired,y:l.PropTypes.number.isRequired}),isDragging:l.PropTypes.bool.isRequired}
var h=function m(e){return{item:e.getItem(),offset:e.getSourceClientOffset(),isDragging:e.isDragging()}}
t["default"]=(0,p.DragLayer)(h)(f)},function(e,t){e.exports=Breadcrumb},function(e,t){e.exports=Toolbar},function(e,t,n){"use strict"
function r(e,t){if(void 0===e&&(e={}),i.isQueryInitAction(t)){var n=a({},e),r=e[t.queryId]
if(r&&r.queryString!==t.queryString)throw new Error("Internal Error: may not update existing query string in store")
var p=!1,c=void 0
t.storePreviousVariables&&r&&r.networkStatus!==u.loading&&(l(r.variables,t.variables)||(p=!0,c=r.variables))
var d=u.loading
return p?d=u.setVariables:t.isPoll?d=u.poll:t.isRefetch?d=u.refetch:t.isPoll&&(d=u.poll),n[t.queryId]={queryString:t.queryString,variables:t.variables,previousVariables:c,loading:!0,networkError:null,graphQLErrors:null,
networkStatus:d,forceFetch:t.forceFetch,returnPartialData:t.returnPartialData,lastRequestId:t.requestId,metadata:t.metadata},n}if(i.isQueryResultAction(t)){if(!e[t.queryId])return e
if(t.requestId<e[t.queryId].lastRequestId)return e
var n=a({},e),f=s.graphQLResultHasError(t.result)
return n[t.queryId]=a({},e[t.queryId],{loading:!1,networkError:null,graphQLErrors:f?t.result.errors:null,previousVariables:null,networkStatus:u.ready}),n}if(i.isQueryErrorAction(t)){if(!e[t.queryId])return e


if(t.requestId<e[t.queryId].lastRequestId)return e
var n=a({},e)
return n[t.queryId]=a({},e[t.queryId],{loading:!1,networkError:t.error,networkStatus:u.error}),n}if(i.isQueryResultClientAction(t)){if(!e[t.queryId])return e
var n=a({},e)
return n[t.queryId]=a({},e[t.queryId],{loading:!t.complete,networkError:null,previousVariables:null,networkStatus:t.complete?u.ready:u.loading}),n}if(i.isQueryStopAction(t)){var n=a({},e)
return delete n[t.queryId],n}return i.isStoreResetAction(t)?o(e,t):e}function o(e,t){var n=t.observableQueryIds,r=Object.keys(e).filter(function(e){return n.indexOf(e)>-1}).reduce(function(t,n){return t[n]=a({},e[n],{
loading:!0,networkStatus:u.loading}),t},{})
return r}var i=n(290),s=n(291),a=n(293),l=n(342),u
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

}function v(e){return E(e)&&"id"===e.type}function b(e,t){return void 0===t&&(t=!1),{type:"id",id:e,generated:t}}function _(e){return E(e)&&"json"===e.type}var E=n(292)
t.storeKeyNameFromField=d,t.storeKeyNameFromFieldNameAndArgs=f,t.resultKeyNameFromField=h,t.isField=m,t.isInlineFragment=g,t.graphQLResultHasError=y,t.isIdValue=v,t.toIdValue=b,t.isJsonValue=_},function(e,t){
function n(e){var t=typeof e
return null!=e&&("object"==t||"function"==t)}e.exports=n},function(e,t,n){var r=n(294),o=n(311),i=n(312),s=n(322),a=n(325),l=n(326),u=Object.prototype,p=u.hasOwnProperty,c=i(function(e,t){if(a(t)||s(t))return void o(t,l(t),e)


for(var n in t)p.call(t,n)&&r(e,n,t[n])})
e.exports=c},function(e,t,n){function r(e,t,n){var r=e[t]
a.call(e,t)&&i(r,n)&&(void 0!==n||t in e)||o(e,t,n)}var o=n(295),i=n(310),s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){function r(e,t,n){"__proto__"==t&&o?o(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}var o=n(296)
e.exports=r},function(e,t,n){var r=n(297),o=function(){try{var e=r(Object,"defineProperty")
return e({},"",{}),e}catch(t){}}()
e.exports=o},function(e,t,n){function r(e,t){var n=i(e,t)
return o(n)?n:void 0}var o=n(298),i=n(309)
e.exports=r},function(e,t,n){function r(e){if(!s(e)||i(e))return!1
var t=o(e)?h:u
return t.test(a(e))}var o=n(299),i=n(306),s=n(292),a=n(308),l=/[\\^$.*+?()[\]{}|]/g,u=/^\[object .+?Constructor\]$/,p=Function.prototype,c=Object.prototype,d=p.toString,f=c.hasOwnProperty,h=RegExp("^"+d.call(f).replace(l,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$")


e.exports=r},function(e,t,n){function r(e){if(!i(e))return!1
var t=o(e)
return t==a||t==l||t==s||t==u}var o=n(300),i=n(292),s="[object AsyncFunction]",a="[object Function]",l="[object GeneratorFunction]",u="[object Proxy]"
e.exports=r},function(e,t,n){function r(e){return null==e?void 0===e?l:a:(e=Object(e),u&&u in e?i(e):s(e))}var o=n(301),i=n(304),s=n(305),a="[object Null]",l="[object Undefined]",u=o?o.toStringTag:void 0


e.exports=r},function(e,t,n){var r=n(302),o=r.Symbol
e.exports=o},function(e,t,n){var r=n(303),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")()
e.exports=i},function(e,t){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t
e.exports=n}).call(t,function(){return this}())},function(e,t,n){function r(e){var t=s.call(e,l),n=e[l]
try{e[l]=void 0
var r=!0}catch(o){}var i=a.call(e)
return r&&(t?e[l]=n:delete e[l]),i}var o=n(301),i=Object.prototype,s=i.hasOwnProperty,a=i.toString,l=o?o.toStringTag:void 0
e.exports=r},function(e,t){function n(e){return o.call(e)}var r=Object.prototype,o=r.toString
e.exports=n},function(e,t,n){function r(e){return!!i&&i in e}var o=n(307),i=function(){var e=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"")
return e?"Symbol(src)_1."+e:""}()
e.exports=r},function(e,t,n){var r=n(302),o=r["__core-js_shared__"]
e.exports=o},function(e,t){function n(e){if(null!=e){try{return o.call(e)}catch(t){}try{return e+""}catch(t){}}return""}var r=Function.prototype,o=r.toString
e.exports=n},function(e,t){function n(e,t){return null==e?void 0:e[t]}e.exports=n},function(e,t){function n(e,t){return e===t||e!==e&&t!==t}e.exports=n},function(e,t,n){function r(e,t,n,r){var s=!n
n||(n={})
for(var a=-1,l=t.length;++a<l;){var u=t[a],p=r?r(n[u],e[u],u,n,e):void 0
void 0===p&&(p=e[u]),s?i(n,u,p):o(n,u,p)}return n}var o=n(294),i=n(295)
e.exports=r},function(e,t,n){function r(e){return o(function(t,n){var r=-1,o=n.length,s=o>1?n[o-1]:void 0,a=o>2?n[2]:void 0
for(s=e.length>3&&"function"==typeof s?(o--,s):void 0,a&&i(n[0],n[1],a)&&(s=o<3?void 0:s,o=1),t=Object(t);++r<o;){var l=n[r]
l&&e(t,l,r,s)}return t})}var o=n(313),i=n(321)
e.exports=r},function(e,t,n){function r(e,t){return s(i(e,t,o),e+"")}var o=n(314),i=n(315),s=n(317)
e.exports=r},function(e,t){function n(e){return e}e.exports=n},function(e,t,n){function r(e,t,n){return t=i(void 0===t?e.length-1:t,0),function(){for(var r=arguments,s=-1,a=i(r.length-t,0),l=Array(a);++s<a;)l[s]=r[t+s]


s=-1
for(var u=Array(t+1);++s<t;)u[s]=r[s]
return u[t]=n(l),o(e,this,u)}}var o=n(316),i=Math.max
e.exports=r},function(e,t){function n(e,t,n){switch(n.length){case 0:return e.call(t)
case 1:return e.call(t,n[0])
case 2:return e.call(t,n[0],n[1])
case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.exports=n},function(e,t,n){var r=n(318),o=n(320),i=o(r)
e.exports=i},function(e,t,n){var r=n(319),o=n(296),i=n(314),s=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:i
e.exports=s},function(e,t){function n(e){return function(){return e}}e.exports=n},function(e,t){function n(e){var t=0,n=0
return function(){var s=i(),a=o-(s-n)
if(n=s,a>0){if(++t>=r)return arguments[0]}else t=0
return e.apply(void 0,arguments)}}var r=800,o=16,i=Date.now
e.exports=n},function(e,t,n){function r(e,t,n){if(!a(n))return!1
var r=typeof t
return!!("number"==r?i(n)&&s(t,n.length):"string"==r&&t in n)&&o(n[t],e)}var o=n(310),i=n(322),s=n(324),a=n(292)
e.exports=r},function(e,t,n){function r(e){return null!=e&&i(e.length)&&!o(e)}var o=n(299),i=n(323)
e.exports=r},function(e,t){function n(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=r}var r=9007199254740991
e.exports=n},function(e,t){function n(e,t){return t=null==t?r:t,!!t&&("number"==typeof e||o.test(e))&&e>-1&&e%1==0&&e<t}var r=9007199254740991,o=/^(?:0|[1-9]\d*)$/
e.exports=n},function(e,t){function n(e){var t=e&&e.constructor,n="function"==typeof t&&t.prototype||r
return e===n}var r=Object.prototype
e.exports=n},function(e,t,n){function r(e){return s(e)?o(e):i(e)}var o=n(327),i=n(339),s=n(322)
e.exports=r},function(e,t,n){function r(e,t){var n=s(e),r=!n&&i(e),p=!n&&!r&&a(e),d=!n&&!r&&!p&&u(e),f=n||r||p||d,h=f?o(e.length,String):[],m=h.length
for(var g in e)!t&&!c.call(e,g)||f&&("length"==g||p&&("offset"==g||"parent"==g)||d&&("buffer"==g||"byteLength"==g||"byteOffset"==g)||l(g,m))||h.push(g)
return h}var o=n(328),i=n(329),s=n(332),a=n(333),l=n(324),u=n(335),p=Object.prototype,c=p.hasOwnProperty
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n)
return r}e.exports=n},function(e,t,n){var r=n(330),o=n(331),i=Object.prototype,s=i.hasOwnProperty,a=i.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&s.call(e,"callee")&&!a.call(e,"callee")

}
e.exports=l},function(e,t,n){function r(e){return i(e)&&o(e)==s}var o=n(300),i=n(331),s="[object Arguments]"
e.exports=r},function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},function(e,t){var n=Array.isArray
e.exports=n},function(e,t,n){(function(e){var r=n(302),o=n(334),i="object"==typeof t&&t&&!t.nodeType&&t,s=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=s&&s.exports===i,l=a?r.Buffer:void 0,u=l?l.isBuffer:void 0,p=u||o


e.exports=p}).call(t,n(28)(e))},function(e,t){function n(){return!1}e.exports=n},function(e,t,n){var r=n(336),o=n(337),i=n(338),s=i&&i.isTypedArray,a=s?o(s):r
e.exports=a},function(e,t,n){function r(e){return s(e)&&i(e.length)&&!!A[o(e)]}var o=n(300),i=n(323),s=n(331),a="[object Arguments]",l="[object Array]",u="[object Boolean]",p="[object Date]",c="[object Error]",d="[object Function]",f="[object Map]",h="[object Number]",m="[object Object]",g="[object RegExp]",y="[object Set]",v="[object String]",b="[object WeakMap]",_="[object ArrayBuffer]",E="[object DataView]",C="[object Float32Array]",S="[object Float64Array]",w="[object Int8Array]",P="[object Int16Array]",F="[object Int32Array]",x="[object Uint8Array]",T="[object Uint8ClampedArray]",O="[object Uint16Array]",I="[object Uint32Array]",A={}


A[C]=A[S]=A[w]=A[P]=A[F]=A[x]=A[T]=A[O]=A[I]=!0,A[a]=A[l]=A[_]=A[u]=A[E]=A[p]=A[c]=A[d]=A[f]=A[h]=A[m]=A[g]=A[y]=A[v]=A[b]=!1,e.exports=r},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n

},function(e,t,n){(function(e){var r=n(303),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,s=i&&i.exports===o,a=s&&r.process,l=function(){try{return a&&a.binding&&a.binding("util")

}catch(e){}}()
e.exports=l}).call(t,n(28)(e))},function(e,t,n){function r(e){if(!o(e))return i(e)
var t=[]
for(var n in Object(e))a.call(e,n)&&"constructor"!=n&&t.push(n)
return t}var o=n(325),i=n(340),s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){var r=n(341),o=r(Object.keys,Object)
e.exports=o},function(e,t){function n(e,t){return function(n){return e(t(n))}}e.exports=n},function(e,t,n){function r(e,t){return o(e,t)}var o=n(343)
e.exports=r},function(e,t,n){function r(e,t,n,a,l){return e===t||(null==e||null==t||!i(e)&&!s(t)?e!==e&&t!==t:o(e,t,n,a,r,l))}var o=n(344),i=n(292),s=n(331)
e.exports=r},function(e,t,n){function r(e,t,n,r,g,v){var b=u(e),_=u(t),E=h,C=h
b||(E=l(e),E=E==f?m:E),_||(C=l(t),C=C==f?m:C)
var S=E==m,w=C==m,P=E==C
if(P&&p(e)){if(!p(t))return!1
b=!0,S=!1}if(P&&!S)return v||(v=new o),b||c(e)?i(e,t,n,r,g,v):s(e,t,E,n,r,g,v)
if(!(n&d)){var F=S&&y.call(e,"__wrapped__"),x=w&&y.call(t,"__wrapped__")
if(F||x){var T=F?e.value():e,O=x?t.value():t
return v||(v=new o),g(T,O,n,r,v)}}return!!P&&(v||(v=new o),a(e,t,n,r,g,v))}var o=n(345),i=n(374),s=n(380),a=n(384),l=n(385),u=n(332),p=n(333),c=n(335),d=1,f="[object Arguments]",h="[object Array]",m="[object Object]",g=Object.prototype,y=g.hasOwnProperty


e.exports=r},function(e,t,n){function r(e){var t=this.__data__=new o(e)
this.size=t.size}var o=n(346),i=n(353),s=n(354),a=n(355),l=n(356),u=n(357)
r.prototype.clear=i,r.prototype["delete"]=s,r.prototype.get=a,r.prototype.has=l,r.prototype.set=u,e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(347),i=n(348),s=n(350),a=n(351),l=n(352)
r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t){function n(){this.__data__=[],this.size=0}e.exports=n},function(e,t,n){function r(e){
var t=this.__data__,n=o(t,e)
if(n<0)return!1
var r=t.length-1
return n==r?t.pop():s.call(t,n,1),--this.size,!0}var o=n(349),i=Array.prototype,s=i.splice
e.exports=r},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n
return-1}var o=n(310)
e.exports=r},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e)
return n<0?void 0:t[n][1]}var o=n(349)
e.exports=r},function(e,t,n){function r(e){return o(this.__data__,e)>-1}var o=n(349)
e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__,r=o(n,e)
return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}var o=n(349)
e.exports=r},function(e,t,n){function r(){this.__data__=new o,this.size=0}var o=n(346)
e.exports=r},function(e,t){function n(e){var t=this.__data__,n=t["delete"](e)
return this.size=t.size,n}e.exports=n},function(e,t){function n(e){return this.__data__.get(e)}e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t,n){function r(e,t){
var n=this.__data__
if(n instanceof o){var r=n.__data__
if(!i||r.length<a-1)return r.push([e,t]),this.size=++n.size,this
n=this.__data__=new s(r)}return n.set(e,t),this.size=n.size,this}var o=n(346),i=n(358),s=n(359),a=200
e.exports=r},function(e,t,n){var r=n(297),o=n(302),i=r(o,"Map")
e.exports=i},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(360),i=n(368),s=n(371),a=n(372),l=n(373)
r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.size=0,this.__data__={hash:new o,map:new(s||i),string:new o
}}var o=n(361),i=n(346),s=n(358)
e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(362),i=n(364),s=n(365),a=n(366),l=n(367)
r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.__data__=o?o(null):{},this.size=0}var o=n(363)
e.exports=r},function(e,t,n){var r=n(297),o=r(Object,"create")
e.exports=o},function(e,t){function n(e){var t=this.has(e)&&delete this.__data__[e]
return this.size-=t?1:0,t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__
if(o){var n=t[e]
return n===i?void 0:n}return a.call(t,e)?t[e]:void 0}var o=n(363),i="__lodash_hash_undefined__",s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){function r(e){var t=this.__data__
return o?void 0!==t[e]:s.call(t,e)}var o=n(363),i=Object.prototype,s=i.hasOwnProperty
e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__
return this.size+=this.has(e)?0:1,n[e]=o&&void 0===t?i:t,this}var o=n(363),i="__lodash_hash_undefined__"
e.exports=r},function(e,t,n){function r(e){var t=o(this,e)["delete"](e)
return this.size-=t?1:0,t}var o=n(369)
e.exports=r},function(e,t,n){function r(e,t){var n=e.__data__
return o(t)?n["string"==typeof t?"string":"hash"]:n.map}var o=n(370)
e.exports=r},function(e,t){function n(e){var t=typeof e
return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}e.exports=n},function(e,t,n){function r(e){return o(this,e).get(e)}var o=n(369)
e.exports=r},function(e,t,n){function r(e){return o(this,e).has(e)}var o=n(369)
e.exports=r},function(e,t,n){function r(e,t){var n=o(this,e),r=n.size
return n.set(e,t),this.size+=n.size==r?0:1,this}var o=n(369)
e.exports=r},function(e,t,n){function r(e,t,n,r,u,p){var c=n&a,d=e.length,f=t.length
if(d!=f&&!(c&&f>d))return!1
var h=p.get(e)
if(h&&p.get(t))return h==t
var m=-1,g=!0,y=n&l?new o:void 0
for(p.set(e,t),p.set(t,e);++m<d;){var v=e[m],b=t[m]
if(r)var _=c?r(b,v,m,t,e,p):r(v,b,m,e,t,p)
if(void 0!==_){if(_)continue
g=!1
break}if(y){if(!i(t,function(e,t){if(!s(y,t)&&(v===e||u(v,e,n,r,p)))return y.push(t)})){g=!1
break}}else if(v!==b&&!u(v,b,n,r,p)){g=!1
break}}return p["delete"](e),p["delete"](t),g}var o=n(375),i=n(378),s=n(379),a=1,l=2
e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.__data__=new o;++t<n;)this.add(e[t])}var o=n(359),i=n(376),s=n(377)
r.prototype.add=r.prototype.push=i,r.prototype.has=s,e.exports=r},function(e,t){function n(e){return this.__data__.set(e,r),this}var r="__lodash_hash_undefined__"
e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0
return!1}e.exports=n},function(e,t){function n(e,t){return e.has(t)}e.exports=n},function(e,t,n){function r(e,t,n,r,o,S,P){switch(n){case C:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1


e=e.buffer,t=t.buffer
case E:return!(e.byteLength!=t.byteLength||!S(new i(e),new i(t)))
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
return P["delete"](e),O
case _:if(w)return w.call(e)==w.call(t)}return!1}var o=n(301),i=n(381),s=n(310),a=n(374),l=n(382),u=n(383),p=1,c=2,d="[object Boolean]",f="[object Date]",h="[object Error]",m="[object Map]",g="[object Number]",y="[object RegExp]",v="[object Set]",b="[object String]",_="[object Symbol]",E="[object ArrayBuffer]",C="[object DataView]",S=o?o.prototype:void 0,w=S?S.valueOf:void 0


e.exports=r},function(e,t,n){var r=n(302),o=r.Uint8Array
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
var b=e[m],_=t[m]
if(r)var E=u?r(_,b,m,t,e,l):r(b,_,m,e,t,l)
if(!(void 0===E?b===_||s(b,_,n,r,l):E)){y=!1
break}v||(v="constructor"==m)}if(y&&!v){var C=e.constructor,S=t.constructor
C!=S&&"constructor"in e&&"constructor"in t&&!("function"==typeof C&&C instanceof C&&"function"==typeof S&&S instanceof S)&&(y=!1)}return l["delete"](e),l["delete"](t),y}var o=n(326),i=1,s=Object.prototype,a=s.hasOwnProperty


e.exports=r},function(e,t,n){var r=n(386),o=n(358),i=n(387),s=n(388),a=n(389),l=n(300),u=n(308),p="[object Map]",c="[object Object]",d="[object Promise]",f="[object Set]",h="[object WeakMap]",m="[object DataView]",g=u(r),y=u(o),v=u(i),b=u(s),_=u(a),E=l

;(r&&E(new r(new ArrayBuffer(1)))!=m||o&&E(new o)!=p||i&&E(i.resolve())!=d||s&&E(new s)!=f||a&&E(new a)!=h)&&(E=function(e){var t=l(e),n=t==c?e.constructor:void 0,r=n?u(n):""
if(r)switch(r){case g:return m
case y:return p
case v:return d
case b:return f
case _:return h}return t}),e.exports=E},function(e,t,n){var r=n(297),o=n(302),i=r(o,"DataView")
e.exports=i},function(e,t,n){var r=n(297),o=n(302),i=r(o,"Promise")
e.exports=i},function(e,t,n){var r=n(297),o=n(302),i=r(o,"Set")
e.exports=i},function(e,t,n){var r=n(297),o=n(302),i=r(o,"WeakMap")
e.exports=i},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e){return e&&Object.keys(e).length>0

}function u(e,t){var n={},r=e.form[t.searchFormSchemaUrl]
return r&&r.values&&(n=r.values),{formData:n}}function p(e){return{actions:{schema:(0,b.bindActionCreators)(F,e),reduxForm:(0,b.bindActionCreators)({reset:x.reset,initialize:x.initialize},e)}}}Object.defineProperty(t,"__esModule",{
value:!0})
var c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()
t.hasFilters=l
var d=n(3),f=o(d),h=n(4),m=o(h),g=n(6),y=n(23),v=o(y),b=n(5),_=n(10),E=o(_),C=n(19),S=o(C),w=n(391),P=n(392),F=r(P),x=n(393),T={NONE:"NONE",VISIBLE:"VISIBLE",EXPANDED:"EXPANDED"},O=function(e){function t(e){
i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.expand=n.expand.bind(n),n.handleClick=n.handleClick.bind(n),n.handleKeyUp=n.handleKeyUp.bind(n),n.handleChange=n.handleChange.bind(n),n.doSearch=n.doSearch.bind(n),n.focusInput=n.focusInput.bind(n),
n.focusFirstFormField=n.focusFirstFormField.bind(n),n.hide=n.hide.bind(n),n.show=n.show.bind(n),n.toggle=n.toggle.bind(n),n.open=n.open.bind(n),n.state={view:T.NONE,searchText:n.props.filters&&n.props.filters.name||""
},n}return a(t,e),c(t,[{key:"componentWillMount",value:function n(){document.addEventListener("click",this.handleClick,!1),this.setOverrides(this.props)}},{key:"componentWillUnmount",value:function r(){
document.removeEventListener("click",this.handleClick,!1),this.setOverrides()}},{key:"componentWillReceiveProps",value:function o(e){e&&!l(e.filters)&&l(this.props.filters)?this.clearFormData(e):JSON.stringify(e.filters)!==JSON.stringify(this.props.filters)&&this.setOverrides(e)

}},{key:"focusInput",value:function u(){if(this.state.view!==T.NONE){var e=v["default"].findDOMNode(this.refs.contentInput)
e!==document.activeElement&&(e.focus(),e.select())}}},{key:"focusFirstFormField",value:function p(){if(this.state.view===T.EXPANDED){var e=v["default"].findDOMNode(this.refs.contentForm),t=e&&e.querySelector("input, textarea, select")


t&&(t.focus(),t.select&&t.select())}}},{key:"clearFormData",value:function d(e){this.setState({searchText:""})
var t=e&&e.searchFormSchemaUrl||this.props.searchFormSchemaUrl
t&&(this.props.actions.reduxForm.initialize(t,{},Object.keys(this.props.formData)),this.props.actions.reduxForm.reset(t),this.props.actions.schema.setSchemaStateOverrides(t,null))}},{key:"setOverrides",
value:function h(e){var t=this
if(e&&(!l(e.filters)||this.props.searchFormSchemaUrl!==e.searchFormSchemaUrl)){var n=e&&e.searchFormSchemaUrl||this.props.searchFormSchemaUrl
n&&this.props.actions.schema.setSchemaStateOverrides(n,null)}e&&l(e.filters)&&e.searchFormSchemaUrl&&!function(){var n=e.filters||{},r={fields:Object.keys(n).map(function(e){var t=n[e]
return{name:e,value:t}})}
t.props.actions.schema.setSchemaStateOverrides(e.searchFormSchemaUrl,r)}()}},{key:"handleClick",value:function g(e){var t=v["default"].findDOMNode(this)
t&&!t.contains(e.target)&&this.hide()}},{key:"handleChange",value:function y(e){this.setState({searchText:e.target.value})}},{key:"handleKeyUp",value:function b(e){13===e.keyCode&&this.doSearch()}},{key:"open",
value:function _(){this.show(),setTimeout(this.focusInput,50)}},{key:"hide",value:function E(){this.setState({view:T.NONE})}},{key:"show",value:function C(){this.setState({view:T.VISIBLE})}},{key:"expand",
value:function P(){this.setState({view:T.EXPANDED})}},{key:"toggle",value:function F(){switch(this.state.view){case T.VISIBLE:this.expand(),setTimeout(this.focusFirstFormField,50)
break
case T.EXPANDED:this.show()}}},{key:"doSearch",value:function x(){var e=this,t={}
this.state.searchText&&(t.name=this.state.searchText),Object.keys(this.props.formData).forEach(function(n){var r=e.props.formData[n]
r&&(t[n]=r)}),this.props.onSearch(t)}},{key:"render",value:function O(){var e=this.props.id+"_ExtraFields",t=this.props.id+"_Trigger",n=this.state.searchText,r=["search","flexbox-area-grow"],o=["btn","btn-secondary","btn--icon-md","btn--no-text","font-icon-down-open","search__filter-trigger"],i=!1


switch(this.state.view){case T.EXPANDED:i=!0,r.push("search--active")
break
case T.VISIBLE:o.push("collapsed"),r.push("search--active")
break
case T.NONE:o.push("collapsed")}return m["default"].createElement("div",{className:r.join(" ")},m["default"].createElement("button",{className:"btn btn--no-text btn-secondary font-icon-search btn--icon-large search__trigger",
type:"button",title:f["default"]._t("AssetAdmin.SEARCH","Search"),"aria-owns":this.props.id,"aria-controls":this.props.id,"aria-expanded":"false",onClick:this.open,id:t}),m["default"].createElement("div",{
id:this.props.id,className:"search__group"},m["default"].createElement("input",{"aria-labelledby":t,type:"text",name:"name",ref:"contentInput",placeholder:f["default"]._t("AssetAdmin.SEARCH","Search"),
className:"form-control search__content-field",onKeyUp:this.handleKeyUp,onChange:this.handleChange,value:n,autoFocus:!0}),m["default"].createElement("button",{"aria-expanded":i,"aria-controls":e,onClick:this.toggle,
className:o.join(" "),title:f["default"]._t("AssetAdmin.ADVANCED","Advanced")},m["default"].createElement("span",{className:"search__filter-trigger-text"},f["default"]._t("AssetAdmin.ADVANCED","Advanced"))),m["default"].createElement("button",{
className:"btn btn-primary search__submit font-icon-search btn--icon-large btn--no-text",title:f["default"]._t("AssetAdmin.SEARCH","Search"),onClick:this.doSearch}),m["default"].createElement("button",{
onClick:this.hide,title:f["default"]._t("AssetAdmin.CLOSE","Close"),className:"btn font-icon-cancel btn--no-text btn--icon-md search__cancel","aria-controls":this.props.id,"aria-expanded":"true"}),m["default"].createElement(w.Collapse,{
"in":i},m["default"].createElement("div",{id:e,className:"search__filter-panel",ref:"contentForm"},m["default"].createElement(S["default"],{schemaUrl:this.props.searchFormSchemaUrl})))))}}]),t}(E["default"])


O.propTypes={searchFormSchemaUrl:h.PropTypes.string.isRequired,id:h.PropTypes.string.isRequired,data:h.PropTypes.object,folderId:h.PropTypes.number,onSearch:h.PropTypes.func.isRequired,filters:h.PropTypes.object,
formData:h.PropTypes.object},t["default"]=(0,g.connect)(u,p)(O)},function(e,t){e.exports=ReactBootstrap},function(e,t){e.exports=SchemaActions},function(e,t){e.exports=ReduxForm},function(e,t){e.exports=qs

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}var o=n(5),i=n(396),s=r(i),a=n(397),l=r(a),u=n(398),p=r(u),c=n(399),d=r(c),f=n(401),h=r(f),m=n(7),g=r(m),y=n(403),v=r(y),b=n(405),_=r(b),E=n(407),C=r(E),S=n(408),w=r(S),P=n(413),F=r(P),x=n(415),T=r(x)


document.addEventListener("DOMContentLoaded",function(){C["default"].register("UploadField",w["default"]),C["default"].register("PreviewImageField",F["default"]),C["default"].register("HistoryList",T["default"])


var e=s["default"].getSection("SilverStripe\\AssetAdmin\\Controller\\AssetAdmin")
l["default"].add({path:e.url,component:g["default"],indexRoute:{component:g["default"]},childRoutes:[{path:"show/:folderId/edit/:fileId",component:g["default"]},{path:"show/:folderId",component:g["default"]
}]}),p["default"].add("assetAdmin",(0,o.combineReducers)({gallery:d["default"],queuedFiles:h["default"],uploadField:v["default"],previewField:_["default"]}))})},function(e,t){e.exports=Config},function(e,t){
e.exports=ReactRouteRegister},function(e,t){e.exports=ReducerRegister},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(){var e=arguments.length<=0||void 0===arguments[0]?c:arguments[0],t=arguments[1]
switch(t.type){case p["default"].SET_FILE_BADGE:return s({},e,{badges:e.badges.filter(function(e){return e.id!==t.payload.id}).concat([t.payload])})
case p["default"].CLEAR_FILE_BADGE:return s({},e,{badges:e.badges.filter(function(e){return e.id!==t.payload.id})})
case p["default"].SET_ENABLE_DROPZONE:return s({},e,{enableDropzone:t.payload.enableDropzone})
case p["default"].SET_NOTICE_MESSAGE:return s({},e,{noticeMessage:t.payload.message})
case p["default"].SET_ERROR_MESSAGE:return s({},e,{errorMessage:t.payload.message})
case p["default"].LOAD_FILE_SUCCESS:var n=e.files.find(function(e){return e.id===t.payload.id})
if(n){var r=function(){var r=s({},n,t.payload.file)
return{v:(0,l["default"])(s({},e,{files:e.files.map(function(e){return e.id===r.id?r:e})}))}}()
if("object"===("undefined"==typeof r?"undefined":i(r)))return r.v}else if(e.folder.id===t.payload.id)return(0,l["default"])(s({},e,{folder:s({},e.folder,t.payload.file)}))
return e
case p["default"].SELECT_FILES:var o=null
return o=null===t.payload.ids?e.files.map(function(e){return e.id}):e.selectedFiles.concat(t.payload.ids.filter(function(t){return e.selectedFiles.indexOf(t)===-1})),(0,l["default"])(s({},e,{selectedFiles:o
}))
case p["default"].DESELECT_FILES:var a=null
return a=null===t.payload.ids?[]:e.selectedFiles.filter(function(e){return t.payload.ids.indexOf(e)===-1}),(0,l["default"])(s({},e,{selectedFiles:a}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},s=Object.assign||function(e){
for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}
t["default"]=o
var a=n(400),l=r(a),u=n(13),p=r(u),c={editorFields:[],file:null,files:[],focus:!1,path:null,selectedFiles:[],page:0,errorMessage:null,enableDropzone:!0,badges:[]}},function(e,t){e.exports=DeepFreezeStrict

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(){var e=arguments.length<=0||void 0===arguments[0]?h:arguments[0],t=arguments[1]
switch(t.type){case u["default"].ADD_QUEUED_FILE:return(0,a["default"])(i({},e,{items:e.items.concat([i({},c["default"],t.payload.file)])}))
case u["default"].FAIL_UPLOAD:return(0,a["default"])(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,{message:t.payload.message}):e})}))
case u["default"].PURGE_UPLOAD_QUEUE:return(0,a["default"])(i({},e,{items:e.items.filter(function(e){return!e.id})}))
case u["default"].REMOVE_QUEUED_FILE:return(0,a["default"])(i({},e,{items:e.items.filter(function(e){return e.queuedId!==t.payload.queuedId})}))
case u["default"].SUCCEED_UPLOAD:return(0,a["default"])(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,t.payload.json,{messages:[{value:f["default"]._t("AssetAdmin.DROPZONE_SUCCESS_UPLOAD"),
type:"success",extraClass:"success"}]}):e})}))
case u["default"].UPDATE_QUEUED_FILE:return(0,a["default"])(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,t.payload.updates):e})}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=n(400),a=r(s),l=n(16),u=r(l),p=n(402),c=r(p),d=n(3),f=r(d),h={items:[]}
t["default"]=o},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(400),i=r(o),s=(0,i["default"])({name:null,canDelete:!1,canEdit:!1,category:null,created:null,extension:null,filename:null,id:0,lastEdited:null,messages:null,owner:{id:0,title:null},parent:{filename:null,
id:0,title:null},queuedId:null,size:null,title:null,type:null,url:null,xhr:null,thumbnail:null,smallThumbnail:null,height:null,width:null})
t["default"]=s},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(){var e=arguments.length<=0||void 0===arguments[0]?h:arguments[0],t=arguments[1],n=function r(n){
if(!t.payload.fieldId)throw new Error("Invalid fieldId")
var r=e.fields[t.payload.fieldId]?e.fields[t.payload.fieldId]:m
return(0,u["default"])(a({},e,{fields:a({},e.fields,i({},t.payload.fieldId,a({},r,n(r))))}))}
switch(t.type){case c["default"].UPLOADFIELD_ADD_FILE:return n(function(e){return{files:[].concat(o(e.files),[a({},f["default"],t.payload.file)])}})
case c["default"].UPLOADFIELD_SET_FILES:return n(function(){return{files:t.payload.files}})
case c["default"].UPLOADFIELD_UPLOAD_FAILURE:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,{message:t.payload.message}):e})}})
case c["default"].UPLOADFIELD_REMOVE_FILE:return n(function(e){return{files:e.files.filter(function(e){return!(t.payload.file.queuedId&&e.queuedId===t.payload.file.queuedId||t.payload.file.id&&e.id===t.payload.file.id)

})}})
case c["default"].UPLOADFIELD_UPLOAD_SUCCESS:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,t.payload.json):e})}})
case c["default"].UPLOADFIELD_UPDATE_QUEUED_FILE:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,t.payload.updates):e})}})
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=n(400),u=r(l),p=n(404),c=r(p),d=n(402),f=r(d),h={fields:{}},m={files:[]}
t["default"]=s},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={UPLOADFIELD_ADD_FILE:"UPLOADFIELD_ADD_FILE",UPLOADFIELD_SET_FILES:"UPLOADFIELD_SET_FILES",UPLOADFIELD_REMOVE_FILE:"UPLOADFIELD_REMOVE_FILE",
UPLOADFIELD_UPLOAD_FAILURE:"UPLOADFIELD_UPLOAD_FAILURE",UPLOADFIELD_UPLOAD_SUCCESS:"UPLOADFIELD_UPLOAD_SUCCESS",UPLOADFIELD_UPDATE_QUEUED_FILE:"UPLOADFIELD_UPDATE_QUEUED_FILE"}},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(){var e=arguments.length<=0||void 0===arguments[0]?c:arguments[0],t=arguments[1]


switch(t.type){case p["default"].PREVIEWFIELD_ADD_FILE:return(0,l["default"])(s({},e,o({},t.payload.id,t.payload.file)))
case p["default"].PREVIEWFIELD_FAIL_UPLOAD:return(0,l["default"])(s({},e,o({},t.payload.id,s({},e[t.payload.id],t.payload.message))))
case p["default"].PREVIEWFIELD_REMOVE_FILE:return(0,l["default"])(s({},e,o({},t.payload.id,void 0)))
case p["default"].PREVIEWFIELD_UPDATE_FILE:return(0,l["default"])(s({},e,o({},t.payload.id,s({},e[t.payload.id],t.payload.data))))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(400),l=r(a),u=n(406),p=r(u),c={}
t["default"]=i},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={PREVIEWFIELD_ADD_FILE:"PREVIEWFIELD_ADD_FILE",PREVIEWFIELD_REMOVE_FILE:"PREVIEWFIELD_REMOVE_FILE",PREVIEWFIELD_UPDATE_FILE:"PREVIEWFIELD_UPDATE_FILE",
PREVIEWFIELD_FAIL_UPLOAD:"PREVIEWFIELD_FAIL_UPLOAD"}},function(e,t){e.exports=Injector},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=t.id,r=[]


e.assetAdmin&&e.assetAdmin.uploadField&&e.assetAdmin.uploadField.fields&&e.assetAdmin.uploadField.fields[n]&&(r=e.assetAdmin.uploadField.fields[n].files||[])
var o=e.config.SecurityID
return{files:r,securityId:o}}function u(e){return{actions:{uploadField:(0,y.bindActionCreators)(k,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.ConnectedUploadField=t.UploadField=void 0
var p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(3),f=o(d),h=n(4),m=o(h),g=n(6),y=n(5),v=n(18),b=o(v),_=n(10),E=o(_),C=n(409),S=o(C),w=n(410),P=o(w),F=n(26),x=o(F),T=n(411),O=o(T),I=n(33),A=o(I),D=n(412),k=r(D),N=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.renderChild=n.renderChild.bind(n),n.handleAddShow=n.handleAddShow.bind(n),n.handleAddHide=n.handleAddHide.bind(n),n.handleAddInsert=n.handleAddInsert.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),
n.handleSending=n.handleSending.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),
n.handleItemRemove=n.handleItemRemove.bind(n),n.handleChange=n.handleChange.bind(n),n.state={selecting:!1},n}return a(t,e),c(t,[{key:"componentDidMount",value:function n(){this.props.actions.uploadField.setFiles(this.props.id,this.props.data.files)

}},{key:"componentWillReceiveProps",value:function r(e){var t=this.props.files||[],n=e.files||[],r=this.compareValues(t,n)
r&&this.handleChange(e)}},{key:"compareValues",value:function o(e,t){if(e.length!==t.length)return!0
for(var n=0;n<e.length;n++)if(e[n].id!==t[n].id)return!0
return!1}},{key:"handleAddedFile",value:function l(e){var t=p({},e,{uploaded:!0})
this.props.actions.uploadField.addFile(this.props.id,t)}},{key:"handleSending",value:function u(e,t){this.props.actions.uploadField.updateQueuedFile(this.props.id,e._queuedId,{xhr:t})}},{key:"handleUploadProgress",
value:function d(e,t){this.props.actions.uploadField.updateQueuedFile(this.props.id,e._queuedId,{progress:t})}},{key:"handleSuccessfulUpload",value:function h(e){var t=JSON.parse(e.xhr.response)
return"undefined"!=typeof t[0].error?void this.handleFailedUpload(e):void this.props.actions.uploadField.succeedUpload(this.props.id,e._queuedId,t[0])}},{key:"handleFailedUpload",value:function g(e,t){
this.props.actions.uploadField.failUpload(this.props.id,e._queuedId,t)}},{key:"handleItemRemove",value:function y(e,t){this.props.actions.uploadField.removeFile(this.props.id,t)}},{key:"handleChange",value:function v(e){
if("function"==typeof e.onChange){var t=e.files.filter(function(e){return e.id}).map(function(e){return e.id}),n={Files:t}
e.onChange(n)}}},{key:"handleSelect",value:function _(e){e.preventDefault()}},{key:"handleAddShow",value:function E(e){e.preventDefault(),this.setState({selecting:!0})}},{key:"handleAddHide",value:function C(){
this.setState({selecting:!1})}},{key:"handleAddInsert",value:function S(e,t){this.props.actions.uploadField.addFile(this.props.id,t),this.handleAddHide()}},{key:"render",value:function w(){return m["default"].createElement("div",{
className:"uploadfield"},this.renderDropzone(),this.props.files.map(this.renderChild),this.renderDialog())}},{key:"renderDropzone",value:function F(){if(!this.props.data.createFileEndpoint)return null
var e={height:b["default"].SMALL_THUMBNAIL_HEIGHT,width:b["default"].SMALL_THUMBNAIL_WIDTH},t=this.props.name,n={url:this.props.data.createFileEndpoint.url,method:this.props.data.createFileEndpoint.method,
paramName:"Upload",thumbnailWidth:b["default"].SMALL_THUMBNAIL_WIDTH,thumbnailHeight:b["default"].SMALL_THUMBNAIL_HEIGHT}
this.props.data.multi||(n.maxFiles=1)
var r=["uploadfield__dropzone"]
this.props.files.length&&!this.props.data.multi&&r.push("uploadfield__dropzone--hidden")
var o=this.props.securityId
return m["default"].createElement(x["default"],{name:t,canUpload:!0,uploadButton:!1,uploadSelector:".uploadfield__upload-button, .uploadfield__backdrop",folderId:this.props.data.parentid,handleAddedFile:this.handleAddedFile,
handleError:this.handleFailedUpload,handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,preview:e,options:n,securityID:o,className:r.join(" ")
},m["default"].createElement("div",{className:"uploadfield__backdrop"}),m["default"].createElement("span",{className:"uploadfield__droptext"},m["default"].createElement("button",{onClick:this.handleSelect,
className:"uploadfield__upload-button"},f["default"]._t("AssetAdminUploadField.BROWSE","Browse"))," ",f["default"]._t("AssetAdminUploadField.OR","or")," ",m["default"].createElement("button",{onClick:this.handleAddShow,
className:"uploadfield__add-button"},f["default"]._t("AssetAdminUploadField.ADD_FILES","Add from files"))))}},{key:"renderDialog",value:function T(){return m["default"].createElement(O["default"],{title:!1,
show:this.state.selecting,onInsert:this.handleAddInsert,onHide:this.handleAddHide,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",type:"select"})}},{key:"renderChild",value:function I(e,t){
var n={key:t,item:e,name:this.props.name,handleRemove:this.handleItemRemove}
return m["default"].createElement(P["default"],n)}}]),t}(E["default"])
N.propTypes={extraClass:m["default"].PropTypes.string,id:m["default"].PropTypes.string.isRequired,name:m["default"].PropTypes.string.isRequired,onChange:m["default"].PropTypes.func,value:m["default"].PropTypes.shape({
Files:m["default"].PropTypes.arrayOf(m["default"].PropTypes.number)}),files:m["default"].PropTypes.arrayOf(A["default"]),readOnly:m["default"].PropTypes.bool,disabled:m["default"].PropTypes.bool,data:m["default"].PropTypes.shape({
createFileEndpoint:m["default"].PropTypes.shape({url:m["default"].PropTypes.string.isRequired,method:m["default"].PropTypes.string.isRequired,payloadFormat:m["default"].PropTypes.string.isRequired}),multi:m["default"].PropTypes.bool,
parentid:m["default"].PropTypes.number})},N.defaultProps={value:{Files:[]},extraClass:"",className:""}
var R=(0,g.connect)(l,u)(N)
t.UploadField=N,t.ConnectedUploadField=R,t["default"]=(0,S["default"])(R)},function(e,t){e.exports=FieldHolder},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(3),u=r(l),p=n(4),c=r(p),d=n(10),f=r(d),h=n(18),m=r(h),g=n(33),y=r(g),v=n(29),b=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleRemove=n.handleRemove.bind(n),n}return s(t,e),a(t,[{key:"getThumbnailStyles",value:function n(){if(this.isImage()&&(this.exists()||this.uploading())){var e=this.props.item.smallThumbnail||this.props.item.url


return{backgroundImage:"url("+e+")"}}return{}}},{key:"hasError",value:function r(){return!!this.props.item.message&&"error"===this.props.item.message.type}},{key:"renderErrorMessage",value:function l(){
var e=null
return this.hasError()?e=this.props.item.message.value:this.exists()||this.uploading()||(e=u["default"]._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==e?c["default"].createElement("div",{
className:"uploadfield-item__error-message"},e):null}},{key:"getThumbnailClassNames",value:function p(){var e=["uploadfield-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&e.push("uploadfield-item__thumbnail--small"),e.join(" ")}},{key:"getItemClassNames",value:function d(){var e=this.props.item.category||"none",t=["fill-width","uploadfield-item","uploadfield-item--"+e]


return this.exists()||this.uploading()||t.push("uploadfield-item--missing"),this.hasError()&&t.push("uploadfield-item--error"),t.join(" ")}},{key:"isImage",value:function f(){return"image"===this.props.item.category

}},{key:"exists",value:function h(){return this.props.item.exists}},{key:"uploading",value:function g(){return!!this.props.item.uploaded}},{key:"complete",value:function y(){return this.uploading()&&this.props.item.id>0

}},{key:"isImageSmallerThanThumbnail",value:function b(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1
var e=this.props.item.width,t=this.props.item.height
return t&&e&&t<m["default"].SMALL_THUMBNAIL_HEIGHT&&e<m["default"].SMALL_THUMBNAIL_WIDTH}},{key:"preventFocus",value:function _(e){e.preventDefault()}},{key:"handleRemove",value:function E(e){e.preventDefault(),
this.props.handleRemove&&this.props.handleRemove(e,this.props.item)}},{key:"renderProgressBar",value:function C(){var e={className:"uploadfield-item__progress-bar",style:{width:this.props.item.progress+"%"
}}
return!this.hasError()&&this.uploading()?this.complete()?c["default"].createElement("div",{className:"uploadfield-item__complete-icon"}):c["default"].createElement("div",{className:"uploadfield-item__upload-progress"
},c["default"].createElement("div",e)):null}},{key:"renderRemoveButton",value:function S(){var e=["btn","uploadfield-item__remove-btn","btn-secondary","btn--no-text","font-icon-cancel","btn--icon-md"].join(" ")


return c["default"].createElement("button",{className:e,onClick:this.handleRemove,ref:"backButton"})}},{key:"renderFileDetails",value:function w(){var e=""
return this.props.item.size&&(e=", "+(0,v.fileSize)(this.props.item.size)),c["default"].createElement("div",{className:"uploadfield-item__details fill-width flexbox-area-grow"},c["default"].createElement("span",{
className:"uploadfield-item__title",ref:"title"},this.props.item.title),c["default"].createElement("span",{className:"uploadfield-item__meta"},this.props.item.extension,e))}},{key:"render",value:function P(){
var e=this.props.name+"[Files][]"
return c["default"].createElement("div",{className:this.getItemClassNames()},c["default"].createElement("input",{type:"hidden",value:this.props.item.id,name:e}),c["default"].createElement("div",{ref:"thumbnail",
className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()}),this.renderFileDetails(),this.renderProgressBar(),this.renderErrorMessage(),this.renderRemoveButton())}}]),t}(f["default"])
b.propTypes={name:c["default"].PropTypes.string.isRequired,item:y["default"],handleRemove:c["default"].PropTypes.func},t["default"]=b},function(e,t){e.exports=InsertMediaModal},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){return function(n){return n({type:c["default"].UPLOADFIELD_ADD_FILE,payload:{fieldId:e,file:t}})}}function i(e,t){return function(n){
return n({type:c["default"].UPLOADFIELD_SET_FILES,payload:{fieldId:e,files:t}})}}function s(e,t,n){return function(r){var o=n.message
return"string"==typeof n&&(o={value:n,type:"error"}),r({type:c["default"].UPLOADFIELD_UPLOAD_FAILURE,payload:{fieldId:e,queuedId:t,message:o}})}}function a(e,t){return function(n){return n({type:c["default"].UPLOADFIELD_REMOVE_FILE,
payload:{fieldId:e,file:t}})}}function l(e,t,n){return function(r){return r({type:c["default"].UPLOADFIELD_UPLOAD_SUCCESS,payload:{fieldId:e,queuedId:t,json:n}})}}function u(e,t,n){return function(r){return r({
type:c["default"].UPLOADFIELD_UPDATE_QUEUED_FILE,payload:{fieldId:e,queuedId:t,updates:n}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addFile=o,t.setFiles=i,t.failUpload=s,t.removeFile=a,t.succeedUpload=l,
t.updateQueuedFile=u
var p=n(404),c=r(p)},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=e.config.SecurityID,r=t.id,o=e.assetAdmin.previewField[r]||{},i=(0,
E.formValueSelector)(t.form)
return{securityID:n,upload:o,nameValue:i(e,"Name")}}function u(e){return{actions:{previewField:(0,_.bindActionCreators)(S,e)}}}Object.defineProperty(t,"__esModule",{value:!0})
var p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(3),d=o(c),f=n(4),h=o(f),m=n(26),g=o(m),y=n(18),v=o(y),b=n(6),_=n(5),E=n(393),C=n(414),S=r(C),w=n(29),P=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleAddedFile=n.handleAddedFile.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleSending=n.handleSending.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),
n.handleCancelUpload=n.handleCancelUpload.bind(n),n.handleRemoveErroredUpload=n.handleRemoveErroredUpload.bind(n),n.canFileUpload=n.canFileUpload.bind(n),n.updateFormData=n.updateFormData.bind(n),n}return a(t,e),
p(t,[{key:"componentWillReceiveProps",value:function n(e){(this.props.data.url&&e.data.url!==this.props.data.url||this.props.data.version&&e.data.version!==this.props.data.version)&&this.props.actions.previewField.removeFile(this.props.id)

}},{key:"componentWillUnmount",value:function r(){this.props.actions.previewField.removeFile(this.props.id)}},{key:"getDropzoneProps",value:function o(){var e=this.props.data.uploadFileEndpoint,t=this.props.name,n={
url:e&&e.url,method:e&&e.method,paramName:"Upload",clickable:"#preview-replace-button",maxFiles:1},r={height:v["default"].THUMBNAIL_HEIGHT,width:v["default"].THUMBNAIL_WIDTH},o=this.props.securityID,i=["asset-dropzone--button","preview__container",this.props.className,this.props.extraClass]


return{name:t,className:i.join(" "),canUpload:e&&this.canEdit(),preview:r,folderId:this.props.data.parentid,options:n,securityID:o,uploadButton:!1,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,
handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,canFileUpload:this.canFileUpload,updateFormData:this.updateFormData}}},{key:"canEdit",
value:function l(){return!this.props.readOnly&&!this.props.disabled&&"folder"!==this.props.data.category}},{key:"preventDefault",value:function u(e){e.preventDefault()}},{key:"canFileUpload",value:function c(e){
var t=this.props.data.initialValues.FileFilename,n=(0,w.getFileExtension)(t),r=(0,w.getFileExtension)(e.name)
if(!n||n===r)return!0
var o=d["default"]._t("AssetAdmin.CONFIRM_CHANGE_EXTENSION","Are you sure you want upload a file with a different extension?")
return this.props.confirm(o)}},{key:"handleCancelUpload",value:function f(){this.props.upload.xhr&&this.props.upload.xhr.abort(),this.handleRemoveErroredUpload()}},{key:"handleRemoveErroredUpload",value:function m(){
if("function"==typeof this.props.onAutofill){var e=this.props.data.initialValues
this.props.onAutofill("FileFilename",e.FileFilename),this.props.onAutofill("FileHash",e.FileHash),this.props.onAutofill("FileVariant",e.FileVariant)}this.props.actions.previewField.removeFile(this.props.id)

}},{key:"handleAddedFile",value:function y(e){this.props.actions.previewField.addFile(this.props.id,e)}},{key:"handleFailedUpload",value:function b(e,t){this.props.actions.previewField.failUpload(this.props.id,t)

}},{key:"handleSuccessfulUpload",value:function _(e){var t=JSON.parse(e.xhr.response)
"function"==typeof this.props.onAutofill&&(this.props.onAutofill("FileFilename",t.Filename),this.props.onAutofill("FileHash",t.Hash),this.props.onAutofill("FileVariant",t.Variant),t.Name&&this.props.onAutofill(this.props.data.nameField,t.Name))

}},{key:"handleSending",value:function E(e,t){this.props.actions.previewField.updateFile(this.props.id,{xhr:t})}},{key:"updateFormData",value:function C(e){e.append("ID",this.props.data.id),e.append("Name",this.props.nameValue)

}},{key:"handleUploadProgress",value:function S(e,t){this.props.actions.previewField.updateFile(this.props.id,{progress:t})}},{key:"renderImage",value:function P(){var e=this.props.data
if(!e.exists&&!this.props.upload.url)return h["default"].createElement("div",{className:"editor__file-preview-message--file-missing"},d["default"]._t("AssetAdmin.FILE_MISSING","File cannot be found"))
var t=this.props.upload.category,n=t&&"image"!==t?v["default"].DEFAULT_PREVIEW:this.props.upload.url||e.preview||e.url,r=h["default"].createElement("img",{alt:"preview",src:n,className:"editor__thumbnail"
}),o=this.props.upload.progress,i=e.url&&!o?h["default"].createElement("a",{className:"editor__file-preview-link",href:e.url,target:"_blank"},r):null,s=o>0&&o<100?h["default"].createElement("div",{className:"preview__progress"
},h["default"].createElement("div",{className:"preview__progress-bar",style:{width:o+"%"}})):null,a=this.props.upload.message,l=null
return a?l=h["default"].createElement("div",{className:"preview__message preview__message--"+a.type},a.value):100===o&&(l=h["default"].createElement("div",{className:"preview__message preview__message--success"
},d["default"]._t("AssetAdmin.REPlACE_FILE_SUCCESS","Upload successful, the file will be replaced when you Save."))),h["default"].createElement("div",{className:"editor__thumbnail-container"},i||r,s,l)

}},{key:"renderToolbar",value:function F(){var e=this.canEdit()
return this.props.data.url||e?h["default"].createElement("div",{className:"preview__toolbar fill-height"},this.props.data.url?h["default"].createElement("a",{href:this.props.data.url,target:"_blank",className:"preview__toolbar-button--link preview__toolbar-button"
},"Open"):null,e?h["default"].createElement("button",{id:"preview-replace-button",onClick:this.preventDefault,className:"preview__toolbar-button--replace preview__toolbar-button"},"Replace"):null,this.props.upload.progress||this.props.upload.message?h["default"].createElement("button",{
onClick:this.handleCancelUpload,className:"preview__toolbar-button--remove preview__toolbar-button"},"Remove"):null):null}},{key:"render",value:function x(){var e=this.getDropzoneProps()
if(this.canEdit())return h["default"].createElement(g["default"],e,this.renderImage(),this.renderToolbar())
var t=["preview__container",this.props.className,this.props.extraClass]
return h["default"].createElement("div",{className:t.join(" ")},this.renderImage(),this.renderToolbar())}}]),t}(f.Component)
P.propTypes={id:f.PropTypes.string.isRequired,name:f.PropTypes.string,className:f.PropTypes.string,extraClass:f.PropTypes.string,readOnly:f.PropTypes.bool,disabled:f.PropTypes.bool,onAutofill:f.PropTypes.func,
form:f.PropTypes.string,nameValue:f.PropTypes.string,data:f.PropTypes.shape({id:f.PropTypes.number,parentid:f.PropTypes.number,version:f.PropTypes.number,url:f.PropTypes.string,exists:f.PropTypes.bool,
preview:f.PropTypes.string,category:f.PropTypes.string,nameField:f.PropTypes.string,uploadFileEndpoint:f.PropTypes.shape({url:f.PropTypes.string.isRequired,method:f.PropTypes.string.isRequired,payloadFormat:f.PropTypes.string
}),initialValues:f.PropTypes.object}).isRequired,upload:f.PropTypes.shape({url:f.PropTypes.string,progress:f.PropTypes.number,xhr:f.PropTypes.object,category:f.PropTypes.string,message:f.PropTypes.shape({
type:f.PropTypes.string.isRequired,value:f.PropTypes.string.isRequired})}),actions:f.PropTypes.object,securityID:f.PropTypes.string,confirm:f.PropTypes.func},P.defaultProps={extraClass:"",className:"",
data:{},upload:{},confirm:function F(e){return window.confirm(e)}},t["default"]=(0,b.connect)(l,u)(P)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e){return{type:u["default"].PREVIEWFIELD_REMOVE_FILE,payload:{id:e}}}function i(e,t){return{type:u["default"].PREVIEWFIELD_ADD_FILE,payload:{
id:e,file:t}}}function s(e,t){return{type:u["default"].PREVIEWFIELD_FAIL_UPLOAD,payload:{id:e,message:t}}}function a(e,t){return{type:u["default"].PREVIEWFIELD_UPDATE_FILE,payload:{id:e,data:t}}}Object.defineProperty(t,"__esModule",{
value:!0}),t.removeFile=o,t.addFile=i,t.failUpload=s,t.updateFile=a
var l=n(406),u=r(l)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t=e.config.sections["SilverStripe\\AssetAdmin\\Controller\\AssetAdmin"]


return{sectionConfig:t,historySchemaUrl:t.form.fileHistoryForm.schemaUrl}}Object.defineProperty(t,"__esModule",{value:!0}),t.HistoryList=void 0
var l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),p=n(4),c=r(p),d=n(6),f=n(11),h=r(f),m=n(396),g=r(m),y=n(416),v=r(y),b=n(19),_=r(b),E=t.HistoryList=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.state={detailView:null,history:[],loadedDetails:!0},n.handleClick=n.handleClick.bind(n),n.handleBack=n.handleBack.bind(n),n.api=n.createEndpoint(e.sectionConfig.historyEndpoint),n}return s(t,e),
u(t,[{key:"componentDidMount",value:function n(){this.refreshHistoryIfNeeded()}},{key:"componentWillReceiveProps",value:function r(e){this.refreshHistoryIfNeeded(e)}},{key:"getContainerClassName",value:function a(){
return this.state.viewDetails&&!this.state.loadedDetails?"file-history history-container--loading":"file-history"}},{key:"refreshHistoryIfNeeded",value:function p(e){var t=this
e&&e.data.fileId===this.props.data.fileId&&e.data.latestVersionId===this.props.data.latestVersionId||this.api({fileId:e?e.data.fileId:this.props.data.fileId}).then(function(e){t.setState({history:e})})

}},{key:"handleClick",value:function d(e){this.setState({viewDetails:e})}},{key:"handleBack",value:function f(e){e.preventDefault(),this.setState({viewDetails:null})}},{key:"createEndpoint",value:function m(e){
var t=arguments.length<=1||void 0===arguments[1]||arguments[1]
return h["default"].createEndpointFetcher(l({},e,t?{defaultData:{SecurityID:g["default"].get("SecurityID")}}:{}))}},{key:"render",value:function y(){var e=this,t=this.getContainerClassName()
if(!this.state.history)return c["default"].createElement("div",{className:t})
if(this.state.viewDetails){var n=[this.props.historySchemaUrl,this.props.data.fileId,this.state.viewDetails].join("/"),r=["btn btn-secondary","btn--icon-xl btn--no-text","font-icon-left-open-big","file-history__back"].join(" ")


return c["default"].createElement("div",{className:t},c["default"].createElement("a",{className:r,onClick:this.handleBack}),c["default"].createElement(_["default"],{schemaUrl:n}))}return c["default"].createElement("div",{
className:t},c["default"].createElement("ul",{className:"list-group list-group-flush file-history__list"},this.state.history.map(function(t){return c["default"].createElement(v["default"],l({key:t.versionid
},t,{onClick:e.handleClick}))})))}}]),t}(p.Component)
E.propTypes={sectionConfig:c["default"].PropTypes.shape({form:c["default"].PropTypes.object,historyEndpoint:c["default"].PropTypes.shape({url:c["default"].PropTypes.string,method:c["default"].PropTypes.string,
responseFormat:c["default"].PropTypes.string})}),historySchemaUrl:c["default"].PropTypes.string,data:c["default"].PropTypes.object},E.defaultProps={data:{fieldId:0}},t.HistoryList=E,t["default"]=(0,d.connect)(a)(E)

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(4),u=r(l),p=n(10),c=r(p),d=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleClick=n.handleClick.bind(n),n}return s(t,e),a(t,[{key:"handleClick",value:function n(e){e.preventDefault(),"function"==typeof this.props.onClick&&this.props.onClick(this.props.versionid)

}},{key:"render",value:function r(){var e=null
return"Published"===this.props.status&&(e=u["default"].createElement("p",null,u["default"].createElement("span",{className:"history-item__status-flag"},this.props.status)," at ",this.props.date_formatted)),
u["default"].createElement("li",{className:"list-group-item history-item",onClick:this.handleClick},u["default"].createElement("p",null,u["default"].createElement("span",{className:"history-item__version"
},"v.",this.props.versionid),u["default"].createElement("span",{className:"history-item__date"},this.props.date_ago," ",this.props.author),this.props.summary),e)}}]),t}(c["default"])
d.propTypes={versionid:l.PropTypes.number.isRequired,summary:l.PropTypes.oneOfType([l.PropTypes.bool,l.PropTypes.string]).isRequired,status:l.PropTypes.string,author:l.PropTypes.string,date:l.PropTypes.string,
onClick:l.PropTypes.func},t["default"]=d},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}var o=n(22),i=r(o),s=n(4),a=r(s),l=n(23),u=r(l),p=n(283),c=n(418),d=n(408)
i["default"].entwine("ss",function(e){e(".js-react-boot input.entwine-uploadfield:visible").entwine({onunmatch:function t(){this._super(),u["default"].unmountComponentAtNode(this[0])},onmatch:function n(){
this._super(),this.refresh()},refresh:function r(){var e=window.ss.store,t=window.ss.apolloClient,n=this.getAttributes()
u["default"].render(a["default"].createElement(p.ApolloProvider,{store:e,client:t},a["default"].createElement(d.ConnectedUploadField,n)),this.parent()[0])},getAttributes:function o(){var t=e(this).data("state"),n=e(this).data("schema")


return(0,c.schemaMerge)(n,t)}})})},function(e,t){e.exports=schemaFieldValues},function(e,t){}])

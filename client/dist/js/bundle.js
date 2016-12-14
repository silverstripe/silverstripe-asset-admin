!function(e){function t(r){if(n[r])return n[r].exports
var o=n[r]={exports:{},id:r,loaded:!1}
return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={}
return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict"
n(1),n(277),n(301),n(303)},function(e,t,n){(function(t){e.exports=t.InsertMediaModal=n(2)}).call(t,function(){return this}())},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=e.config.sections[S],r=t.fileAttributes?t.fileAttributes.ID:null,o=e.config.sections[S],i=r&&o.form.fileInsertForm.schemaUrl+"/"+r


return{sectionConfig:n,schemaUrl:i}}function u(e){return{actions:{schema:(0,m.bindActionCreators)(_,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.InsertMediaModal=void 0
var p=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var s=e[Symbol.iterator](),a;!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(l){o=!0,i=l}finally{try{!r&&s["return"]&&s["return"]()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(3),h=o(f),m=n(4),g=n(5),y=n(6),v=o(y),b=n(16),C=o(b),E=n(276),_=r(E),S="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",w=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSubmit=n.handleSubmit.bind(n),n.handleBrowse=n.handleBrowse.bind(n),n.getUrl=n.getUrl.bind(n),n.state={folderId:0,fileId:e.fileAttributes.ID,query:{}},n}return a(t,e),c(t,[{key:"componentWillMount",
value:function n(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function r(e){!e.show&&this.props.show&&this.setState({folderId:0,fileId:null,query:{}}),e.show&&!this.props.show&&e.fileAttributes.ID&&(this.setOverrides(e),
this.setState({folderId:0,fileId:e.fileAttributes.ID}))}},{key:"componentWillUnmount",value:function o(){this.setOverrides()}},{key:"setOverrides",value:function l(e){if(!e||this.props.schemaUrl!==e.schemaUrl){
var t=e&&e.schemaUrl||this.props.schemaUrl
t&&this.props.actions.schema.setSchemaStateOverrides(t,null)}if(e&&e.schemaUrl){var n=d({},e.fileAttributes)
delete n.ID
var r={fields:Object.entries(n).map(function(e){var t=p(e,2),n=t[0],r=t[1]
return{name:n,value:r}})}
this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,r)}}},{key:"getUrl",value:function u(e,t){var n=this.props.sectionConfig.url,r=n+"/show/"+(e||0)
return t&&(r=r+"/edit/"+t),r}},{key:"getSectionProps",value:function f(){return{dialog:!0,type:this.props.type,sectionConfig:this.props.sectionConfig,folderId:parseInt(this.state.folderId,10),fileId:parseInt(this.state.fileId||this.props.fileId,10),
query:this.state.query,getUrl:this.getUrl,onBrowse:this.handleBrowse,onSubmitEditor:this.handleSubmit}}},{key:"getModalProps",value:function m(){return d({},this.props,{handleHide:this.props.onHide,className:"insert-media-modal "+this.props.className,
bsSize:"lg",onHide:void 0,onInsert:void 0,sectionConfig:void 0,schemaUrl:void 0})}},{key:"handleSubmit",value:function g(e,t,n,r){return this.props.onInsert(e,r)}},{key:"handleBrowse",value:function y(e,t,n){
var r={}
null!==n&&(r=this.state.query,n&&(r=d({},r,n))),this.setState({folderId:e,fileId:t,query:r})}},{key:"render",value:function b(){var e=this.getModalProps(),t=this.getSectionProps(),n=this.props.show?h["default"].createElement(v["default"],t):null


return h["default"].createElement(C["default"],e,n)}}]),t}(f.Component)
w.propTypes={sectionConfig:f.PropTypes.shape({url:f.PropTypes.string,form:f.PropTypes.object}),type:f.PropTypes.oneOf(["insert","select","admin"]),schemaUrl:f.PropTypes.string,show:f.PropTypes.bool,onInsert:f.PropTypes.func.isRequired,
fileAttributes:f.PropTypes.shape({ID:f.PropTypes.number,AltText:f.PropTypes.string,Width:f.PropTypes.number,Height:f.PropTypes.number,TitleTooltip:f.PropTypes.string,Alignment:f.PropTypes.string}),fileId:f.PropTypes.number,
onHide:f.PropTypes.func,className:f.PropTypes.string,actions:f.PropTypes.object},w.defaultProps={className:"",fileAttributes:{},type:"insert"},t.InsertMediaModal=w,t["default"]=(0,g.connect)(l,u)(w)},function(e,t){
e.exports=React},function(e,t){e.exports=Redux},function(e,t){e.exports=ReactRedux},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e){var t=e.assetAdmin.gallery,n=t.loading,r=t.folder,o=t.files


return{loading:n,files:o,folder:r,securityId:e.config.SecurityID}}function u(e){return{actions:{gallery:(0,m.bindActionCreators)(S,e),breadcrumbsActions:(0,m.bindActionCreators)(P,e)}}}Object.defineProperty(t,"__esModule",{
value:!0}),t.AssetAdmin=void 0
var p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(3),f=o(c),h=n(5),m=n(4),g=n(7),y=o(g),v=n(8),b=o(v),C=n(9),E=o(C),_=n(10),S=r(_),w=n(12),P=r(w),x=n(13),F=o(x),I=n(17),T=o(I),A=n(274),O=o(A),D=n(275),k=o(D),R=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleOpenFile=n.handleOpenFile.bind(n),n.handleCloseFile=n.handleCloseFile.bind(n),n.handleDelete=n.handleDelete.bind(n),n.handleSubmitEditor=n.handleSubmitEditor.bind(n),n.handleOpenFolder=n.handleOpenFolder.bind(n),
n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.createEndpoint=n.createEndpoint.bind(n),n.handleBackButtonClick=n.handleBackButtonClick.bind(n),n.handleFolderIcon=n.handleFolderIcon.bind(n),
n.handleBrowse=n.handleBrowse.bind(n),n.handleViewChange=n.handleViewChange.bind(n),n.compare=n.compare.bind(n),n}return a(t,e),d(t,[{key:"componentWillMount",value:function n(){var e=this.props.sectionConfig


this.endpoints={createFolderApi:this.createEndpoint(e.createFolderEndpoint),readFolderApi:this.createEndpoint(e.readFolderEndpoint,!1),updateFolderApi:this.createEndpoint(e.updateFolderEndpoint),deleteApi:this.createEndpoint(e.deleteEndpoint),
historyApi:this.createEndpoint(e.historyEndpoint)}}},{key:"componentWillReceiveProps",value:function r(e){var t=this.compare(this.props.folder,e.folder)
t&&this.setBreadcrumbs(e.folder)}},{key:"handleBrowse",value:function o(e,t,n){"function"==typeof this.props.onBrowse&&this.props.onBrowse(e,t,n)}},{key:"handleSetPage",value:function l(e){this.handleBrowse(this.props.folderId,this.props.fileId,{
page:e})}},{key:"handleSort",value:function u(e){this.handleBrowse(this.props.folderId,this.props.fileId,{sort:e,limit:void 0,page:void 0})}},{key:"handleViewChange",value:function c(e){this.handleBrowse(this.props.folderId,this.props.fileId,{
view:e})}},{key:"createEndpoint",value:function h(e){var t=arguments.length<=1||void 0===arguments[1]||arguments[1]
return b["default"].createEndpointFetcher(p({},e,t?{defaultData:{SecurityID:this.props.securityId}}:{}))}},{key:"handleBackButtonClick",value:function m(e){e.preventDefault(),this.props.folder?this.handleOpenFolder(this.props.folder.parentID||0):this.handleOpenFolder(0)

}},{key:"setBreadcrumbs",value:function g(e){var t=this,n=[{text:E["default"]._t("AssetAdmin.FILES","Files"),href:this.props.getUrl&&this.props.getUrl(),onClick:function r(e){e.preventDefault(),t.handleBrowse()

}}]
e&&e.id&&(e.parents&&e.parents.forEach(function(e){n.push({text:e.title,href:t.props.getUrl&&t.props.getUrl(e.id),onClick:function r(n){n.preventDefault(),t.handleBrowse(e.id)}})}),n.push({text:e.title,
icon:{className:"icon font-icon-edit-list",action:this.handleFolderIcon}})),this.props.actions.breadcrumbsActions.setBreadcrumbs(n)}},{key:"compare",value:function y(e,t){return!!(e&&!t||t&&!e)||e&&t&&(e.id!==t.id||e.name!==t.name)

}},{key:"handleFolderIcon",value:function v(e){e.preventDefault(),this.handleOpenFile(this.props.folderId)}},{key:"handleOpenFile",value:function C(e){this.handleBrowse(this.props.folderId,e)}},{key:"handleSubmitEditor",
value:function _(e,t,n){var r=this,o=null
if("function"==typeof this.props.onSubmitEditor){var i=this.props.files.find(function(e){return e.id===parseInt(r.props.fileId,10)})
o=this.props.onSubmitEditor(e,t,n,i)}else o=n()
if(!o)throw new Error("Promise was not returned for submitting")
return o.then(function(e){return e&&e.record&&r.props.actions.gallery.loadFile(r.props.fileId,e.record),e})}},{key:"handleCloseFile",value:function S(){this.handleOpenFolder(this.props.folderId)}},{key:"handleOpenFolder",
value:function w(e){this.handleBrowse(e)}},{key:"handleDelete",value:function P(e){var t=this,n=this.props.files.find(function(t){return t.id===e})
!n&&this.props.folder&&this.props.folder.id===e&&(n=this.props.folder),confirm(E["default"]._t("AssetAdmin.CONFIRMDELETE"))&&this.props.actions.gallery.deleteItems(this.endpoints.deleteApi,[e]).then(function(){
n&&t.handleBrowse(n.parent?n.parent.id:0)})}},{key:"renderGallery",value:function x(){var e=this.props.sectionConfig,t=e.createFileEndpoint.url,n=e.createFileEndpoint.method,r=this.props.query&&parseInt(this.props.query.limit||e.limit,10),o=this.props.query&&parseInt(this.props.query.page||0,10),i=this.props.query&&this.props.query.sort,s=this.props.query&&this.props.query.view


return f["default"].createElement(T["default"],{fileId:this.props.fileId,folderId:this.props.folderId,folder:this.props.folder,type:this.props.type,limit:r,page:o,view:s,createFileApiUrl:t,createFileApiMethod:n,
createFolderApi:this.endpoints.createFolderApi,readFolderApi:this.endpoints.readFolderApi,updateFolderApi:this.endpoints.updateFolderApi,deleteApi:this.endpoints.deleteApi,onOpenFile:this.handleOpenFile,
onOpenFolder:this.handleOpenFolder,onSort:this.handleSort,onSetPage:this.handleSetPage,onViewChange:this.handleViewChange,sort:i,sectionConfig:e})}},{key:"renderEditor",value:function I(){var e=this.props.sectionConfig,t=null


switch(this.props.type){case"insert":t=e.form.fileInsertForm.schemaUrl
break
case"select":t=e.form.fileSelectForm.schemaUrl
break
case"admin":default:t=e.form.fileEditForm.schemaUrl}return this.props.fileId&&0!==this.props.files.length?f["default"].createElement(F["default"],{className:"insert"===this.props.type?"editor--dialog":"",
fileId:this.props.fileId,onClose:this.handleCloseFile,editFileSchemaUrl:t,onSubmit:this.handleSubmitEditor,onDelete:this.handleDelete,addToCampaignSchemaUrl:e.form.addToCampaignForm.schemaUrl}):null}},{
key:"render",value:function A(){var e=!(!this.props.folder||!this.props.folder.id)
return f["default"].createElement("div",{className:"fill-height"},f["default"].createElement(k["default"],{showBackButton:e,handleBackButtonClick:this.handleBackButtonClick},f["default"].createElement(O["default"],{
multiline:!0})),f["default"].createElement("div",{className:"flexbox-area-grow fill-width fill-height gallery"},this.renderGallery(),this.renderEditor()),"insert"===this.props.type&&this.props.loading&&[f["default"].createElement("div",{
key:"overlay",className:"cms-content-loading-overlay ui-widget-overlay-light"}),f["default"].createElement("div",{key:"spinner",className:"cms-content-loading-spinner"})])}}]),t}(y["default"])
R.propTypes={dialog:c.PropTypes.bool,sectionConfig:c.PropTypes.shape({url:c.PropTypes.string,limit:c.PropTypes.number,form:c.PropTypes.object}),fileId:c.PropTypes.number,folderId:c.PropTypes.number,onBrowse:c.PropTypes.func,
getUrl:c.PropTypes.func,query:c.PropTypes.shape({sort:c.PropTypes.string,limit:c.PropTypes.oneOfType([c.PropTypes.number,c.PropTypes.string]),page:c.PropTypes.oneOfType([c.PropTypes.number,c.PropTypes.string])
}),onSubmitEditor:c.PropTypes.func,type:c.PropTypes.oneOf(["insert","select","admin"]),files:c.PropTypes.array,folder:c.PropTypes.shape({id:c.PropTypes.number,title:c.PropTypes.string,parents:c.PropTypes.array,
parentID:c.PropTypes.number,canView:c.PropTypes.bool,canEdit:c.PropTypes.bool})},R.defaultProps={type:"admin"},t.AssetAdmin=R,t["default"]=(0,h.connect)(l,u)(R)},function(e,t){e.exports=SilverStripeComponent

},function(e,t){e.exports=Backend},function(e,t){e.exports=i18n},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){return function(n){return n({type:f["default"].ADD_FILES,payload:{files:e,count:t}})}}function i(e,t){return function(n){return n({type:f["default"].DELETE_ITEM_REQUEST,
payload:{ids:t}}),e({ids:t}).then(function(e){return n({type:f["default"].DELETE_ITEM_SUCCESS,payload:{ids:t}}),e})["catch"](function(e){throw n({type:f["default"].DELETE_ITEM_FAILURE,payload:{e:e}}),e

})}}function s(e,t,n,r,o){return function(i){return i({type:f["default"].LOAD_FOLDER_REQUEST,payload:{folderId:parseInt(t,10)}}),e({id:t,limit:n,page:r,sort:o}).then(function(e){return i({type:f["default"].LOAD_FOLDER_SUCCESS,
payload:{files:e.files,folder:{id:parseInt(e.folderID,10),title:e.title,parents:e.parents,parent:e.parent,canEdit:e.canEdit,canDelete:e.canDelete,parentID:null===e.parentID?null:parseInt(e.parentID,10)
},count:e.count}}),e})["catch"](function(e){throw console.trace(e.message),i({type:f["default"].LOAD_FOLDER_FAILURE,payload:{message:e.message}}),e})}}function a(){return{type:f["default"].UNLOAD_FOLDER
}}function l(e,t){return function(n){n({type:f["default"].LOAD_FILE_SUCCESS,payload:{id:e,file:t}})}}function u(){var e=arguments.length<=0||void 0===arguments[0]?null:arguments[0]
return function(t){return t({type:f["default"].SELECT_FILES,payload:{ids:e}})}}function p(){var e=arguments.length<=0||void 0===arguments[0]?null:arguments[0]
return function(t){return t({type:f["default"].DESELECT_FILES,payload:{ids:e}})}}function d(e,t,n){return function(r){return r({type:f["default"].CREATE_FOLDER_REQUEST,payload:{name:n}}),e({ParentID:isNaN(t)?0:t,
Name:n}).then(function(e){return r({type:f["default"].CREATE_FOLDER_SUCCESS,payload:{name:n}}),e})["catch"](function(e){throw r({type:f["default"].CREATE_FOLDER_FAILURE,payload:{error:"Couldn't create "+n+": "+e
}}),e})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addFiles=o,t.deleteItems=i,t.loadFolderContents=s,t.unloadFolderContents=a,t.loadFile=l,t.selectFiles=u,t.deselectFiles=p,t.createFolder=d
var c=n(11),f=r(c)},function(e,t){"use strict"
function n(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0})
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}
t["default"]=["ADD_FILES","DESELECT_FILES","REMOVE_FILES","SELECT_FILES","LOAD_FILE_REQUEST","LOAD_FILE_SUCCESS","CREATE_FOLDER_REQUEST","CREATE_FOLDER_SUCCESS","CREATE_FOLDER_FAILURE","DELETE_ITEM_REQUEST","DELETE_ITEM_SUCCESS","DELETE_ITEM_FAILURE","LOAD_FOLDER_REQUEST","LOAD_FOLDER_SUCCESS","LOAD_FOLDER_FAILURE","UNLOAD_FOLDER","HIGHLIGHT_FILES","UPDATE_BATCH_ACTIONS"].reduce(function(e,t){
return r(e,n({},t,"GALLERY."+t))},{})},function(e,t){e.exports=BreadcrumbsActions},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(9),u=r(l),p=n(3),d=r(p),c=n(14),f=r(c),h=n(15),m=r(h),g=n(16),y=r(g),v=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleCancelKeyDown=n.handleCancelKeyDown.bind(n),n.handleClose=n.handleClose.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n.handleAction=n.handleAction.bind(n),n.closeModal=n.closeModal.bind(n),
n.openModal=n.openModal.bind(n),n.state={openModal:!1},n}return s(t,e),a(t,[{key:"handleAction",value:function n(e,t){var n=e.currentTarget.name
return"action_addtocampaign"===n?(this.openModal(),void e.preventDefault()):"action_delete"===n?(this.props.onDelete(t.ID),void e.preventDefault()):void 0}},{key:"handleCancelKeyDown",value:function r(e){
e.keyCode!==f["default"].SPACE_KEY_CODE&&e.keyCode!==f["default"].RETURN_KEY_CODE||this.handleClose(e)}},{key:"handleSubmit",value:function l(e,t,n){return"function"==typeof this.props.onSubmit?this.props.onSubmit(e,t,n):n()

}},{key:"handleClose",value:function p(e){this.props.onClose(),this.closeModal(),e&&e.preventDefault()}},{key:"openModal",value:function c(){this.setState({openModal:!0})}},{key:"closeModal",value:function h(){
this.setState({openModal:!1})}},{key:"renderCancelButton",value:function g(){return d["default"].createElement("a",{tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",
onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u["default"]._t("AssetAdmin.CANCEL")})}},{key:"renderCancelButton",value:function v(){return d["default"].createElement("a",{
tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u["default"]._t("AssetAdmin.CANCEL")
})}},{key:"renderCancelButton",value:function b(){return d["default"].createElement("a",{tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",onClick:this.handleClose,
onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u["default"]._t("AssetAdmin.CANCEL")})}},{key:"render",value:function C(){var e=this.props.editFileSchemaUrl+"/"+this.props.fileId,t=this.props.addToCampaignSchemaUrl+"/"+this.props.fileId,n=["panel","panel--padded","panel--scrollable","form--no-dividers","editor"]


return this.props.className&&n.push(this.props.className),d["default"].createElement("div",{className:n.join(" ")},d["default"].createElement("div",{className:"editor__details"},d["default"].createElement(m["default"],{
schemaUrl:e,afterMessages:this.renderCancelButton(),handleSubmit:this.handleSubmit,handleAction:this.handleAction}),d["default"].createElement(y["default"],{show:this.state.openModal,handleHide:this.closeModal,
schemaUrl:t,bodyClassName:"modal__dialog",responseClassBad:"modal__response modal__response--error",responseClassGood:"modal__response modal__response--good"})))}}]),t}(p.Component)
v.propTypes={dialog:d["default"].PropTypes.bool,className:d["default"].PropTypes.string,fileId:d["default"].PropTypes.number.isRequired,onClose:d["default"].PropTypes.func.isRequired,onSubmit:d["default"].PropTypes.func.isRequired,
onDelete:d["default"].PropTypes.func.isRequired,editFileSchemaUrl:d["default"].PropTypes.string.isRequired,addToCampaignSchemaUrl:d["default"].PropTypes.string,openAddCampaignModal:d["default"].PropTypes.bool
},t["default"]=v},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(9),i=r(o)
t["default"]={CSS_TRANSITION_TIME:300,SMALL_THUMBNAIL_HEIGHT:60,SMALL_THUMBNAIL_WIDTH:60,THUMBNAIL_HEIGHT:150,THUMBNAIL_WIDTH:200,BULK_ACTIONS:[{value:"delete",label:i["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE","Delete"),
className:"font-icon-trash",destructive:!0,callback:null,confirm:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=null,t=i["default"].sprintf(i["default"]._t("AssetAdmin.BULK_ACTIONS_CONFIRM"),i["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE_CONFIRM","delete"))


return e=confirm(t)?Promise.resolve():Promise.reject()})},{value:"edit",label:i["default"]._t("AssetAdmin.BULK_ACTIONS_EDIT","Edit"),className:"font-icon-edit",destructive:!1,canApply:function s(e){return 1===e.length

},callback:null}],BULK_ACTIONS_PLACEHOLDER:i["default"]._t("AssetAdmin.BULK_ACTIONS_PLACEHOLDER"),SPACE_KEY_CODE:32,RETURN_KEY_CODE:13}},function(e,t){e.exports=FormBuilderLoader},function(e,t){e.exports=FormBuilderModal

},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function i(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){var t=e.assetAdmin.gallery,n=t.loading,r=t.count,o=t.files,i=t.selectedFiles,s=t.errorMessage


return{loading:n,count:r,files:o,selectedFiles:i,errorMessage:s,queuedFiles:e.assetAdmin.queuedFiles,securityId:e.config.SecurityID}}function p(e){return{actions:{gallery:(0,x.bindActionCreators)(j,e),
queuedFiles:(0,x.bindActionCreators)(H,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.galleryViewDefaultProps=t.galleryViewPropTypes=t.sorters=t.Gallery=void 0
var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(18),h=o(f),m=n(9),g=o(m),y=n(3),v=o(y),b=n(19),C=o(b),E=n(20),_=o(E),S=n(21),w=o(S),P=n(5),x=n(4),F=n(22),I=o(F),T=n(25),A=o(T),O=n(26),D=o(O),k=n(270),R=o(k),N=n(14),L=o(N),U=n(10),j=r(U),M=n(272),H=r(M),B=[{
field:"title",direction:"asc",label:g["default"]._t("AssetAdmin.FILTER_TITLE_ASC","title a-z")},{field:"title",direction:"desc",label:g["default"]._t("AssetAdmin.FILTER_TITLE_DESC","title z-a")},{field:"created",
direction:"desc",label:g["default"]._t("AssetAdmin.FILTER_DATE_DESC","newest")},{field:"created",direction:"asc",label:g["default"]._t("AssetAdmin.FILTER_DATE_ASC","oldest")}],z=function(e){function t(e){
s(this,t)
var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleOpenFolder=n.handleOpenFolder.bind(n),n.handleOpenFile=n.handleOpenFile.bind(n),n.handleSelect=n.handleSelect.bind(n),n.handleSelectSort=n.handleSelectSort.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),
n.handleCancelUpload=n.handleCancelUpload.bind(n),n.handleRemoveErroredUpload=n.handleRemoveErroredUpload.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleSending=n.handleSending.bind(n),
n.handleBackClick=n.handleBackClick.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),
n.handleCreateFolder=n.handleCreateFolder.bind(n),n.handleViewChange=n.handleViewChange.bind(n),n.renderNoItemsNotice=n.renderNoItemsNotice.bind(n),n}return l(t,e),c(t,[{key:"componentDidMount",value:function n(){
this.refreshFolderIfNeeded(null,this.props)}},{key:"componentWillReceiveProps",value:function r(e){if("tile"!==e.view){var t=this.getSortElement()
t.off("change")}this.refreshFolderIfNeeded(this.props,e)}},{key:"componentDidUpdate",value:function o(){var e=this
"tile"===this.props.view&&!function(){var t=e.getSortElement()
t.chosen({allow_single_deselect:!0,disable_search_threshold:20}),t.on("change",function(){return _["default"].Simulate.click(t.find(":selected")[0])})}(),this.checkLoadingIndicator()}},{key:"componentWillUnmount",
value:function u(){this.props.actions.gallery.unloadFolderContents()}},{key:"getSortElement",value:function p(){return(0,h["default"])(C["default"].findDOMNode(this)).find(".gallery__sort .dropdown")}},{
key:"checkLoadingIndicator",value:function f(){var e=(0,h["default"])(".cms-content.AssetAdmin")
this.props.loading?e.addClass("loading"):e.removeClass("loading")}},{key:"refreshFolderIfNeeded",value:function m(e,t){e&&t.folderId===e.folderId&&t.limit===e.limit&&t.page===e.page&&t.sort===e.sort||(this.props.actions.gallery.deselectFiles(),
this.props.actions.gallery.loadFolderContents(t.readFolderApi,t.folderId,t.limit,t.page,t.sort))}},{key:"handleSort",value:function y(e){this.props.actions.queuedFiles.purgeUploadQueue(),this.props.onSort(e)

}},{key:"handleSelectSort",value:function b(e){this.handleSort(e.currentTarget.value)}},{key:"handleSetPage",value:function E(e){this.props.onSetPage(e)}},{key:"handleCancelUpload",value:function S(e){
e.xhr.abort(),this.props.actions.queuedFiles.removeQueuedFile(e.queuedId)}},{key:"handleRemoveErroredUpload",value:function P(e){this.props.actions.queuedFiles.removeQueuedFile(e.queuedId)}},{key:"handleAddedFile",
value:function x(e){this.props.actions.queuedFiles.addQueuedFile(e)}},{key:"handleSending",value:function F(e,t){this.props.actions.queuedFiles.updateQueuedFile(e._queuedId,{xhr:t})}},{key:"handleUploadProgress",
value:function T(e,t){this.props.actions.queuedFiles.updateQueuedFile(e._queuedId,{progress:t})}},{key:"handleCreateFolder",value:function O(e){var t=this,n=this.promptFolderName()
null!==n&&this.props.actions.gallery.createFolder(this.props.createFolderApi,this.props.folderId,n).then(function(e){return t.refreshFolderIfNeeded(null,t.props),e}),e.preventDefault()}},{key:"handleSuccessfulUpload",
value:function k(e){var t=JSON.parse(e.xhr.response)
if("undefined"!=typeof t[0].error)return void this.handleFailedUpload(e)
if(this.props.actions.queuedFiles.removeQueuedFile(e._queuedId),this.props.actions.gallery.addFiles(t,this.props.count+1),"admin"!==this.props.type&&!this.props.fileId&&0===this.props.queuedFiles.items.length){
var n=t.pop()
this.props.onOpenFile(n.id)}}},{key:"handleFailedUpload",value:function N(e,t){this.props.actions.queuedFiles.failUpload(e._queuedId,t)}},{key:"promptFolderName",value:function U(){return prompt(g["default"]._t("AssetAdmin.PROMPTFOLDERNAME"))

}},{key:"itemIsSelected",value:function j(e){return this.props.selectedFiles.indexOf(e)>-1}},{key:"itemIsHighlighted",value:function M(e){return this.props.fileId===e}},{key:"handleOpenFolder",value:function H(e,t){
e.preventDefault(),this.props.onOpenFolder(t.id)}},{key:"handleOpenFile",value:function z(e,t){e.preventDefault(),null!==t.created&&this.props.onOpenFile(t.id,t)}},{key:"handleSelect",value:function G(e,t){
this.props.selectedFiles.indexOf(t.id)===-1?this.props.actions.gallery.selectFiles([t.id]):this.props.actions.gallery.deselectFiles([t.id])}},{key:"handleBackClick",value:function q(e){e.preventDefault(),
this.props.onOpenFolder(this.props.folder.parentID)}},{key:"handleViewChange",value:function V(e){var t=e.currentTarget.value
this.props.onViewChange(t)}},{key:"renderSort",value:function W(){var e=this
return"tile"!==this.props.view?null:v["default"].createElement("div",{className:"gallery__sort fieldholder-small"},v["default"].createElement("select",{className:"dropdown no-change-track no-chzn",tabIndex:"0",
style:{width:"160px"},defaultValue:this.props.sort},B.map(function(t,n){return v["default"].createElement("option",{key:n,onClick:e.handleSelectSort,"data-field":t.field,"data-direction":t.direction,value:t.field+","+t.direction
},t.label)})))}},{key:"renderToolbar",value:function Q(){var e=this.props.folder.canEdit
return v["default"].createElement("div",{className:"toolbar--content toolbar--space-save"},v["default"].createElement("div",{className:"fill-width"},v["default"].createElement("div",{className:"flexbox-area-grow"
},this.renderBackButton(),v["default"].createElement("button",{id:"upload-button",className:"btn btn-secondary font-icon-upload btn--icon-xl",type:"button",disabled:!e},v["default"].createElement("span",{
className:"btn__text"},g["default"]._t("AssetAdmin.DROPZONE_UPLOAD"))),v["default"].createElement("button",{id:"add-folder-button",className:"btn btn-secondary font-icon-folder-add btn--icon-xl",type:"button",
onClick:this.handleCreateFolder,disabled:!e},v["default"].createElement("span",{className:"btn__text"},g["default"]._t("AssetAdmin.ADD_FOLDER_BUTTON")))),v["default"].createElement("div",{className:"gallery__state-buttons"
},this.renderSort(),v["default"].createElement("div",{className:"btn-group",role:"group","aria-label":"View mode"},this.renderViewChangeButtons()))))}},{key:"renderViewChangeButtons",value:function K(){
var e=this,t=["tile","table"]
return t.map(function(t,n){var r="table"===t?"list":"thumbnails",o=["gallery__view-change-button","btn btn-secondary","btn--icon-sm","btn--no-text"]
return t===e.props.view?null:(o.push("font-icon-"+r),v["default"].createElement("button",{id:"button-view-"+t,key:n,className:o.join(" "),type:"button",onClick:e.handleViewChange,value:t}))})}},{key:"renderBackButton",
value:function $(){var e=["btn","btn-secondary","btn--no-text","font-icon-level-up","btn--icon-large","gallery__back"].join(" ")
return null!==this.props.folder.parentID?v["default"].createElement("button",{className:e,onClick:this.handleBackClick,ref:"backButton"}):null}},{key:"renderBulkActions",value:function Z(){var e=this,t=function i(t){
var n=t.map(function(e){return e.id})
e.props.actions.gallery.deleteItems(e.props.deleteApi,n)},n=function s(t){e.props.onOpenFile(t[0].id)},r=L["default"].BULK_ACTIONS.map(function(e){return"delete"!==e.value||e.callback?"edit"!==e.value||e.callback?e:d({},e,{
callback:n}):d({},e,{callback:t})}),o=this.props.selectedFiles.map(function(t){return e.props.files.find(function(e){return t===e.id})})
return o.length>0&&"admin"===this.props.type?v["default"].createElement(w["default"],{transitionName:"bulk-actions",transitionEnterTimeout:L["default"].CSS_TRANSITION_TIME,transitionLeaveTimeout:L["default"].CSS_TRANSITION_TIME
},v["default"].createElement(A["default"],{actions:r,items:o,key:o.length>0})):null}},{key:"renderNoItemsNotice",value:function Y(){return 0!==this.props.files.length||this.props.loading?null:v["default"].createElement("p",{
className:"gallery__no-item-notice"},g["default"]._t("AssetAdmin.NOITEMSFOUND"))}},{key:"renderGalleryView",value:function X(){var e=this,t="table"===this.props.view?R["default"]:D["default"],n=this.props.files.map(function(t){
return d({},t,{selected:e.itemIsSelected(t.id),highlighted:e.itemIsHighlighted(t.id)})}),r=this.props.queuedFiles.items.map(function(e){return d({},e,{uploading:!0})}),o=[].concat(i(r),i(n)),s=this.props,a=s.type,l=s.loading,u=s.page,p=s.count,c=s.limit,f=s.sort,h={
selectableItems:"admin"===a,files:o,loading:l,page:u,count:p,limit:c,sort:f,onSort:this.handleSort,onSetPage:this.handleSetPage,onOpenFile:this.handleOpenFile,onOpenFolder:this.handleOpenFolder,onSelect:this.handleSelect,
onCancelUpload:this.handleCancelUpload,onRemoveErroredUpload:this.handleRemoveErroredUpload,renderNoItemsNotice:this.renderNoItemsNotice}
return v["default"].createElement(t,h)}},{key:"render",value:function J(){if(!this.props.folder)return this.props.errorMessage?v["default"].createElement("div",{className:"gallery__error"},v["default"].createElement("div",{
className:"gallery__error-message"},v["default"].createElement("h3",null,this.props.errorMessage&&g["default"]._t("AssetAdmin.DROPZONE_RESPONSE_ERROR","Server responded with an error.")),v["default"].createElement("p",null,this.props.errorMessage))):null


var e={height:L["default"].THUMBNAIL_HEIGHT,width:L["default"].THUMBNAIL_WIDTH},t={url:this.props.createFileApiUrl,method:this.props.createFileApiMethod,paramName:"Upload",clickable:"#upload-button"},n=this.props.securityId,r=this.props.folder.canEdit,o=["panel","panel--padded","panel--scrollable","gallery__main"]


return"insert"===this.props.type&&o.push("insert-media-modal__main"),v["default"].createElement("div",{className:"flexbox-area-grow gallery__outer"},this.renderBulkActions(),v["default"].createElement(I["default"],{
canUpload:r,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,
preview:e,folderId:this.props.folderId,options:t,securityID:n,uploadButton:!1},v["default"].createElement("div",{className:o.join(" ")},this.renderToolbar(),this.renderGalleryView())))}}]),t}(y.Component),G={
page:0,limit:15,sort:B[0].field+","+B[0].direction},q={loading:y.PropTypes.bool,sort:y.PropTypes.string,files:y.PropTypes.arrayOf(y.PropTypes.shape({id:y.PropTypes.number,parent:y.PropTypes.shape({id:y.PropTypes.number
})})).isRequired,count:y.PropTypes.number,page:y.PropTypes.number,limit:y.PropTypes.number,onOpenFile:y.PropTypes.func.isRequired,onOpenFolder:y.PropTypes.func.isRequired,onSort:y.PropTypes.func.isRequired,
onSetPage:y.PropTypes.func.isRequired},V=d({},G,{selectableItems:!1}),W=d({},q,{selectableItems:y.PropTypes.bool,onSelect:y.PropTypes.func,onCancelUpload:y.PropTypes.func,onRemoveErroredUpload:y.PropTypes.func,
renderNoItemsNotice:y.PropTypes.func.isRequired})
z.defaultProps=d({},G,{type:"admin",view:"tile"}),z.propTypes=d({},q,{type:y.PropTypes.oneOf(["insert","select","admin"]),view:y.PropTypes.oneOf(["tile","table"]),dialog:y.PropTypes.bool,fileId:y.PropTypes.number,
folderId:y.PropTypes.number.isRequired,folder:y.PropTypes.shape({id:y.PropTypes.number,parentID:y.PropTypes.number,canView:y.PropTypes.bool,canEdit:y.PropTypes.bool}),queuedFiles:y.PropTypes.shape({items:y.PropTypes.array.isRequired
}),selectedFiles:y.PropTypes.arrayOf(y.PropTypes.number),errorMessage:y.PropTypes.string,actions:y.PropTypes.object.isRequired,securityId:y.PropTypes.string,onViewChange:y.PropTypes.func.isRequired,createFileApiUrl:y.PropTypes.string,
createFileApiMethod:y.PropTypes.string,createFolderApi:y.PropTypes.func,readFolderApi:y.PropTypes.func,deleteApi:y.PropTypes.func}),t.Gallery=z,t.sorters=B,t.galleryViewPropTypes=W,t.galleryViewDefaultProps=V,
t["default"]=(0,P.connect)(u,p)(z)},function(e,t){e.exports=jQuery},function(e,t){e.exports=ReactDom},function(e,t){e.exports=ReactAddonsTestUtils},function(e,t){e.exports=ReactAddonsCssTransitionGroup

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function w(e,t,n){null===e&&(e=Function.prototype)


var r=Object.getOwnPropertyDescriptor(e,t)
if(void 0===r){var o=Object.getPrototypeOf(e)
return null===o?void 0:w(o,t,n)}if("value"in r)return r.value
var i=r.get
if(void 0!==i)return i.call(n)},p=n(3),d=r(p),c=n(19),f=r(c),h=n(7),m=r(h),g=n(9),y=r(g),v=n(23),b=r(v),C=n(18),E=r(C),_=0,S=function(e){function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.dropzone=null,n.dragging=!1,n.handleAddedFile=n.handleAddedFile.bind(n),n.handleDragEnter=n.handleDragEnter.bind(n),n.handleDragLeave=n.handleDragLeave.bind(n),n.handleDrop=n.handleDrop.bind(n),
n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleError=n.handleError.bind(n),n.handleSending=n.handleSending.bind(n),n.handleSuccess=n.handleSuccess.bind(n),n.loadImage=n.loadImage.bind(n),
n}return s(t,e),l(t,[{key:"componentDidMount",value:function n(){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this)
var e=this.getDefaultOptions(),n=this.props.uploadSelector
if(!n&&this.props.uploadButton&&(n=".asset-dropzone__upload-button"),n){var r=(0,E["default"])(f["default"].findDOMNode(this)).find(n)
r&&r.length&&(e.clickable=r.toArray())}this.dropzone=new b["default"](f["default"].findDOMNode(this),a({},e,this.props.options)),"undefined"!=typeof this.props.promptOnRemove&&this.setPromptOnRemove(this.props.promptOnRemove)

}},{key:"componentWillUnmount",value:function r(){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentWillUnmount",this).call(this),this.dropzone.disable()}},{key:"render",value:function p(){
var e=["asset-dropzone"]
this.props.className&&e.push(this.props.className)
var t={className:"asset-dropzone__upload-button ss-ui-button font-icon-upload",type:"button"}
return this.props.canUpload||(t.disabled=!0),this.dragging===!0&&e.push("dragging"),d["default"].createElement("div",{className:e.join(" ")},this.props.uploadButton&&d["default"].createElement("button",t,y["default"]._t("AssetAdmin.DROPZONE_UPLOAD")),this.props.children)

}},{key:"getDefaultOptions",value:function c(){return{autoProcessQueue:!1,addedfile:this.handleAddedFile,dragenter:this.handleDragEnter,dragleave:this.handleDragLeave,drop:this.handleDrop,uploadprogress:this.handleUploadProgress,
dictDefaultMessage:y["default"]._t("AssetAdmin.DROPZONE_DEFAULT_MESSAGE"),dictFallbackMessage:y["default"]._t("AssetAdmin.DROPZONE_FALLBACK_MESSAGE"),dictFallbackText:y["default"]._t("AssetAdmin.DROPZONE_FALLBACK_TEXT"),
dictInvalidFileType:y["default"]._t("AssetAdmin.DROPZONE_INVALID_FILE_TYPE"),dictResponseError:y["default"]._t("AssetAdmin.DROPZONE_RESPONSE_ERROR"),dictCancelUpload:y["default"]._t("AssetAdmin.DROPZONE_CANCEL_UPLOAD"),
dictCancelUploadConfirmation:y["default"]._t("AssetAdmin.DROPZONE_CANCEL_UPLOAD_CONFIRMATION"),dictRemoveFile:y["default"]._t("AssetAdmin.DROPZONE_REMOVE_FILE"),dictMaxFilesExceeded:y["default"]._t("AssetAdmin.DROPZONE_MAX_FILES_EXCEEDED"),
error:this.handleError,sending:this.handleSending,success:this.handleSuccess,thumbnailHeight:150,thumbnailWidth:200}}},{key:"getFileCategory",value:function h(e){return e.split("/")[0]}},{key:"handleDragEnter",
value:function m(e){this.props.canUpload&&(this.dragging=!0,this.forceUpdate(),"function"==typeof this.props.handleDragEnter&&this.props.handleDragEnter(e))}},{key:"handleDragLeave",value:function g(e){
var t=f["default"].findDOMNode(this)
this.props.canUpload&&e.target===t&&(this.dragging=!1,this.forceUpdate(),"function"==typeof this.props.handleDragLeave&&this.props.handleDragLeave(e,t))}},{key:"handleUploadProgress",value:function v(e,t,n){
"function"==typeof this.props.handleUploadProgress&&this.props.handleUploadProgress(e,t,n)}},{key:"handleDrop",value:function C(e){this.dragging=!1,this.forceUpdate(),"function"==typeof this.props.handleDrop&&this.props.handleDrop(e)

}},{key:"handleSending",value:function S(e,t,n){n.append("SecurityID",this.props.securityID),n.append("ParentID",this.props.folderId),"function"==typeof this.props.handleSending&&this.props.handleSending(e,t,n)

}},{key:"generateQueuedId",value:function w(){return++_}},{key:"handleAddedFile",value:function P(e){var t=this
if(this.props.options.maxFiles&&this.dropzone.files.length>this.props.options.maxFiles)return this.dropzone.removeFile(this.dropzone.files[0]),void("function"==typeof this.props.handleMaxFilesExceeded&&this.props.handleMaxFilesExceeded(e))


if(!this.props.canUpload)return Promise.reject(new Error(y["default"]._t("AssetAdmin.DROPZONE_CANNOT_UPLOAD")))
e._queuedId=this.generateQueuedId()
var n=new Promise(function(n){var r=new FileReader
r.onload=function(r){if("image"===t.getFileCategory(e.type)){var o=document.createElement("img")
n(t.loadImage(o,r.target.result))}else n({})},r.readAsDataURL(e)})
return n.then(function(n){var r={dimensions:{height:n.height,width:n.width},category:t.getFileCategory(e.type),filename:e.name,queuedId:e._queuedId,size:e.size,title:t.getFileTitle(e.name),extension:t.getFileExtension(e.name),
type:e.type,url:n.thumbnailURL}
return t.props.handleAddedFile(r),t.dropzone.processFile(e),r})}},{key:"getFileTitle",value:function x(e){return e.replace(/[.][^.]+$/,"").replace(/-_/," ")}},{key:"getFileExtension",value:function F(e){
return/[.]/.exec(e)?e.replace(/^.+[.]/,""):""}},{key:"loadImage",value:function I(e,t){var n=this
return new Promise(function(r){e.onload=function(){var t=document.createElement("canvas"),o=t.getContext("2d"),i=2*n.props.preview.width,s=2*n.props.preview.height,a=e.naturalWidth/e.naturalHeight
e.naturalWidth<i||e.naturalHeight<s?(t.width=e.naturalWidth,t.height=e.naturalHeight):a<1?(t.width=i,t.height=i/a):(t.width=s*a,t.height=s),o.drawImage(e,0,0,t.width,t.height)
var l=t.toDataURL("image/png")
r({width:e.naturalWidth,height:e.naturalHeight,thumbnailURL:l})},e.src=t})}},{key:"handleError",value:function T(e,t){"function"==typeof this.props.handleError&&this.props.handleError(e,t)}},{key:"handleSuccess",
value:function A(e){this.props.handleSuccess(e)}},{key:"setPromptOnRemove",value:function O(e){this.dropzone.options.dictRemoveFileConfirmation=e}}]),t}(m["default"])
S.propTypes={folderId:d["default"].PropTypes.number.isRequired,handleAddedFile:d["default"].PropTypes.func.isRequired,handleDragEnter:d["default"].PropTypes.func,handleDragLeave:d["default"].PropTypes.func,
handleDrop:d["default"].PropTypes.func,handleError:d["default"].PropTypes.func.isRequired,handleSending:d["default"].PropTypes.func,handleSuccess:d["default"].PropTypes.func.isRequired,handleMaxFilesExceeded:d["default"].PropTypes.func,
options:d["default"].PropTypes.shape({url:d["default"].PropTypes.string.isRequired}),promptOnRemove:d["default"].PropTypes.string,securityID:d["default"].PropTypes.string.isRequired,uploadButton:d["default"].PropTypes.bool,
uploadSelector:d["default"].PropTypes.string,canUpload:d["default"].PropTypes.bool.isRequired,preview:d["default"].PropTypes.shape({width:d["default"].PropTypes.number,height:d["default"].PropTypes.number
}),className:d["default"].PropTypes.string},S.defaultProps={uploadButton:!0},t["default"]=S},function(e,t,n){(function(e,t){(function(){var n,r,o,i,s,a,l,u,p=[].slice,d={}.hasOwnProperty,c=function(e,t){
function n(){this.constructor=e}for(var r in t)d.call(t,r)&&(e[r]=t[r])
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
var r,i,s,a,l,u,p,d,c,f,h,m,g,y,v,b,C,E,_,S,w,P,x,F,I,T,A,O,D,k,R,N,L,U
for(_=new XMLHttpRequest,S=0,F=e.length;S<F;S++)r=e[S],r.xhr=_
m=o(this.options.method,e),C=o(this.options.url,e),_.open(m,C,!0),_.withCredentials=!!this.options.withCredentials,v=null,s=function(t){return function(){var n,o,i
for(i=[],n=0,o=e.length;n<o;n++)r=e[n],i.push(t._errorProcessing(e,v||t.options.dictResponseError.replace("{{statusCode}}",_.status),_))
return i}}(this),b=function(t){return function(n){var o,i,s,a,l,u,p,d,c
if(null!=n)for(i=100*n.loaded/n.total,s=0,u=e.length;s<u;s++)r=e[s],r.upload={progress:i,total:n.total,bytesSent:n.loaded}
else{for(o=!0,i=100,a=0,p=e.length;a<p;a++)r=e[a],100===r.upload.progress&&r.upload.bytesSent===r.upload.total||(o=!1),r.upload.progress=i,r.upload.bytesSent=r.upload.total
if(o)return}for(c=[],l=0,d=e.length;l<d;l++)r=e[l],c.push(t.emit("uploadprogress",r,i,r.upload.bytesSent))
return c}}(this),_.onload=function(n){return function(r){var o
if(e[0].status!==t.CANCELED&&4===_.readyState){if(v=_.responseText,_.getResponseHeader("content-type")&&~_.getResponseHeader("content-type").indexOf("application/json"))try{v=JSON.parse(v)}catch(i){r=i,
v="Invalid JSON response from server."}return b(),200<=(o=_.status)&&o<300?n._finished(e,v,r):s()}}}(this),_.onerror=function(n){return function(){if(e[0].status!==t.CANCELED)return s()}}(this),y=null!=(D=_.upload)?D:_,
y.onprogress=b,u={Accept:"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"},this.options.headers&&n(u,this.options.headers)
for(a in u)l=u[a],l&&_.setRequestHeader(a,l)
if(i=new FormData,this.options.params){k=this.options.params
for(h in k)E=k[h],i.append(h,E)}for(w=0,I=e.length;w<I;w++)r=e[w],this.emit("sending",r,_,i)
if(this.options.uploadMultiple&&this.emit("sendingmultiple",e,_,i),"FORM"===this.element.tagName)for(R=this.element.querySelectorAll("input, textarea, select, button"),P=0,T=R.length;P<T;P++)if(d=R[P],
c=d.getAttribute("name"),f=d.getAttribute("type"),"SELECT"===d.tagName&&d.hasAttribute("multiple"))for(N=d.options,x=0,A=N.length;x<A;x++)g=N[x],g.selected&&i.append(c,g.value)
else(!f||"checkbox"!==(L=f.toLowerCase())&&"radio"!==L||d.checked)&&i.append(c,d.value)
for(p=O=0,U=e.length-1;0<=U?O<=U:O>=U;p=0<=U?++O:--O)i.append(this._getParamName(p),e[p],this._renameFilename(e[p].name))
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
return u=l/s,0===u?1:u},a=function(e,t,n,r,o,i,a,l,u,p){var d
return d=s(t),e.drawImage(t,n,r,o,i,a,l,u,p/d)},i=function(e,t){var n,r,o,i,s,a,l,u,p
if(o=!1,p=!0,r=e.document,u=r.documentElement,n=r.addEventListener?"addEventListener":"attachEvent",l=r.addEventListener?"removeEventListener":"detachEvent",a=r.addEventListener?"":"on",i=function(n){if("readystatechange"!==n.type||"complete"===r.readyState)return("load"===n.type?e:r)[l](a+n.type,i,!1),
!o&&(o=!0)?t.call(e,n.type||n):void 0},s=function(){var e
try{u.doScroll("left")}catch(t){return e=t,void setTimeout(s,50)}return i("poll")},"complete"!==r.readyState){if(r.createEventObject&&u.doScroll){try{p=!e.frameElement}catch(d){}p&&s()}return r[n](a+"DOMContentLoaded",i,!1),
r[n](a+"readystatechange",i,!1),e[n](a+"load",i,!1)}},n._autoDiscoverFunction=function(){if(n.autoDiscover)return n.discover()},i(window,n._autoDiscoverFunction)}).call(this)}).call(t,n(18),n(24)(e))},function(e,t){
e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],e.webpackPolyfill=1),e}},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return{gallery:e.assetAdmin.gallery
}}Object.defineProperty(t,"__esModule",{value:!0}),t.BulkActions=void 0
var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(18),p=r(u),d=n(3),c=r(d),f=n(19),h=r(f),m=n(7),g=r(m),y=n(20),v=r(y),b=n(5),C=t.BulkActions=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.onChangeValue=n.onChangeValue.bind(n),n}return s(t,e),l(t,[{key:"componentDidMount",value:function n(){var e=(0,p["default"])(h["default"].findDOMNode(this)).find(".dropdown")
e.chosen({allow_single_deselect:!0,disable_search_threshold:20}),e.change(function(){return v["default"].Simulate.click(e.find(":selected")[0])})}},{key:"render",value:function r(){var e=this,t=this.props.actions.map(function(t,n){
var r=e.props.items.length&&(!t.canApply||t.canApply(e.props.items))
if(!r)return""
var o=["bulk-actions__action","ss-ui-button","ui-corner-all",t.className||"font-icon-info-circled"].join(" ")
return c["default"].createElement("button",{type:"button",className:o,key:n,onClick:e.onChangeValue,value:t.value},t.label)})
return c["default"].createElement("div",{className:"bulk-actions fieldholder-small"},c["default"].createElement("div",{className:"bulk-actions-counter"},this.props.items.length),t)}},{key:"getOptionByValue",
value:function a(e){return this.props.actions.find(function(t){return t.value===e})}},{key:"onChangeValue",value:function u(e){var t=this,n=null,r=this.getOptionByValue(e.target.value)
return null===r?null:(n="function"==typeof r.confirm?r.confirm(this.props.items).then(function(){return r.callback(t.props.items)}):r.callback(this.props.items)||Promise.resolve(),(0,p["default"])(h["default"].findDOMNode(this)).find(".dropdown").val("").trigger("liszt:updated"),
n)}}]),t}(g["default"])
C.propTypes={items:c["default"].PropTypes.array,actions:c["default"].PropTypes.arrayOf(c["default"].PropTypes.shape({value:c["default"].PropTypes.string.isRequired,label:c["default"].PropTypes.string.isRequired,
className:c["default"].PropTypes.string,destructive:c["default"].PropTypes.bool,callback:c["default"].PropTypes.func,canApply:c["default"].PropTypes.func,confirm:c["default"].PropTypes.func}))},t["default"]=(0,
b.connect)(a)(C)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(9),p=r(u),d=n(3),c=r(d),f=n(27),h=r(f),m=n(17),g=n(29),y=r(g),v=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.renderItem=n.renderItem.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handlePrevPage=n.handlePrevPage.bind(n),n.handleNextPage=n.handleNextPage.bind(n),n}return s(t,e),l(t,[{key:"handleSetPage",
value:function n(e){this.props.onSetPage(e)}},{key:"handleNextPage",value:function r(){this.handleSetPage(this.props.page+1)}},{key:"handlePrevPage",value:function u(){this.handleSetPage(this.props.page-1)

}},{key:"folderFilter",value:function d(e){return"folder"===e.type}},{key:"fileFilter",value:function f(e){return"folder"!==e.type}},{key:"renderPagination",value:function m(){if(this.props.count<=this.props.limit)return null


var e={setPage:this.handleSetPage,maxPage:Math.ceil(this.props.count/this.props.limit),next:this.handleNextPage,nextText:p["default"]._t("Pagination.NEXT","Next"),previous:this.handlePrevPage,previousText:p["default"]._t("Pagination.PREVIOUS","Previous"),
currentPage:this.props.page,useGriddleStyles:!1}
return c["default"].createElement("div",{className:"griddle-footer"},c["default"].createElement(y["default"].GridPagination,e))}},{key:"renderItem",value:function g(e,t){var n={key:t,item:e}
return e.uploading?a(n,{onCancelUpload:this.props.onCancelUpload,onRemoveErroredUpload:this.props.onRemoveErroredUpload}):a(n,{onActivate:"folder"===e.type?this.props.onOpenFolder:this.props.onOpenFile
}),this.props.selectableItems&&a(n,{selectable:!0,onSelect:this.props.onSelect}),c["default"].createElement(h["default"],n)}},{key:"render",value:function v(){return c["default"].createElement("div",{className:"gallery__main-view--tile"
},c["default"].createElement("div",{className:"gallery__folders"},this.props.files.filter(this.folderFilter).map(this.renderItem)),c["default"].createElement("div",{className:"gallery__files"},this.props.files.filter(this.fileFilter).map(this.renderItem)),this.props.renderNoItemsNotice(),c["default"].createElement("div",{
className:"gallery__load"},this.renderPagination()))}}]),t}(d.Component)
v.defaultProps=m.galleryViewDefaultProps,v.propTypes=m.galleryViewPropTypes,t["default"]=v},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(9),u=r(l),p=n(3),d=r(p),c=n(14),f=r(c),h=n(7),m=r(h),g=n(28),y=r(g),v=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSelect=n.handleSelect.bind(n),n.handleActivate=n.handleActivate.bind(n),n.handleKeyDown=n.handleKeyDown.bind(n),n.handleCancelUpload=n.handleCancelUpload.bind(n),n.preventFocus=n.preventFocus.bind(n),
n}return s(t,e),a(t,[{key:"handleActivate",value:function n(e){e.stopPropagation(),"function"==typeof this.props.onActivate&&this.props.onActivate(e,this.props.item)}},{key:"handleSelect",value:function r(e){
e.stopPropagation(),e.preventDefault(),"function"==typeof this.props.onSelect&&this.props.onSelect(e,this.props.item)}},{key:"getThumbnailStyles",value:function l(){if(this.isImage()&&(this.exists()||this.uploading())){
var e=this.props.item.thumbnail||this.props.item.url
return{backgroundImage:"url("+e+")"}}return{}}},{key:"hasError",value:function p(){var p=!1
return this.props.message&&(p="error"===this.props.message.type),p}},{key:"getErrorMessage",value:function c(){var e=null
return this.hasError()?e=this.props.message.value:this.exists()||this.uploading()||(e=u["default"]._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==e?d["default"].createElement("span",{className:"gallery-item__error-message"
},e):null}},{key:"getThumbnailClassNames",value:function h(){var e=["gallery-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&e.push("gallery-item__thumbnail--small"),e.join(" ")}},{key:"getItemClassNames",value:function m(){var e=this.props.item.category||"false",t=["gallery-item gallery-item--"+e]


return this.exists()||this.uploading()||t.push("gallery-item--missing"),this.props.selectable&&(t.push("gallery-item--selectable"),this.props.item.selected&&t.push("gallery-item--selected")),this.props.item.highlighted&&t.push("gallery-item--highlighted"),
this.hasError()&&t.push("gallery-item--error"),t.join(" ")}},{key:"getStatusFlags",value:function g(){var e=[]
return"folder"!==this.props.item.type&&(this.props.item.draft?e.push(d["default"].createElement("span",{key:"status-draft",title:u["default"]._t("File.DRAFT","Draft"),className:"gallery-item--draft"})):this.props.item.modified&&e.push(d["default"].createElement("span",{
key:"status-modified",title:u["default"]._t("File.MODIFIED","Modified"),className:"gallery-item--modified"}))),e}},{key:"isImage",value:function y(){return"image"===this.props.item.category}},{key:"exists",
value:function v(){return this.props.item.exists}},{key:"uploading",value:function b(){return this.props.item.uploading}},{key:"isImageSmallerThanThumbnail",value:function C(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1


var e=this.props.item.dimensions
return e&&e.height<f["default"].THUMBNAIL_HEIGHT&&e.width<f["default"].THUMBNAIL_WIDTH}},{key:"handleKeyDown",value:function E(e){e.stopPropagation(),f["default"].SPACE_KEY_CODE===e.keyCode&&(e.preventDefault(),
this.handleSelect(e)),f["default"].RETURN_KEY_CODE===e.keyCode&&this.handleActivate(e)}},{key:"preventFocus",value:function _(e){e.preventDefault()}},{key:"handleCancelUpload",value:function S(e){e.stopPropagation(),
this.hasError()?this.props.handleRemoveErroredUpload(this.props.item):this.props.handleCancelUpload(this.props.item)}},{key:"getProgressBar",value:function w(){var e=null,t={className:"gallery-item__progress-bar",
style:{width:this.props.item.progress+"%"}}
return!this.hasError()&&this.uploading()&&(e=d["default"].createElement("div",{className:"gallery-item__upload-progress"},d["default"].createElement("div",t))),e}},{key:"render",value:function P(){var e=null,t=null,n=null


return this.props.selectable&&(e=this.handleSelect,t="font-icon-tick"),this.uploading()?(e=this.handleCancelUpload,t="font-icon-cancel"):this.exists()&&(n=d["default"].createElement("div",{className:"gallery-item--overlay font-icon-edit"
},"View")),d["default"].createElement("div",{className:this.getItemClassNames(),"data-id":this.props.item.id,tabIndex:"0",onKeyDown:this.handleKeyDown,onClick:this.handleActivate},d["default"].createElement("div",{
ref:"thumbnail",className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()},n,this.getStatusFlags()),this.getProgressBar(),this.getErrorMessage(),d["default"].createElement("div",{className:"gallery-item__title",
ref:"title"},d["default"].createElement("label",{className:"gallery-item__checkbox-label "+t,onClick:e},d["default"].createElement("input",{className:"gallery-item__checkbox",type:"checkbox",title:u["default"]._t("AssetAdmin.SELECT"),
tabIndex:"-1",onMouseDown:this.preventFocus})),this.props.item.title))}}]),t}(m["default"])
v.propTypes={item:y["default"],highlighted:p.PropTypes.bool,selected:p.PropTypes.bool,message:p.PropTypes.shape({value:p.PropTypes.string,type:p.PropTypes.string}),selectable:p.PropTypes.bool,onActivate:p.PropTypes.func,
onSelect:p.PropTypes.func,onCancelUpload:p.PropTypes.func,onRemoveErroredUpload:p.PropTypes.func},t["default"]=v},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(3),i=r(o),s=i["default"].PropTypes.shape({exists:i["default"].PropTypes.bool,type:i["default"].PropTypes.string,smallThumbnail:i["default"].PropTypes.string,thumbnail:i["default"].PropTypes.string,
dimensions:i["default"].PropTypes.shape({width:i["default"].PropTypes.number,height:i["default"].PropTypes.number}),category:i["default"].PropTypes.oneOfType([i["default"].PropTypes.bool,i["default"].PropTypes.string]).isRequired,
id:i["default"].PropTypes.number.isRequired,url:i["default"].PropTypes.string,title:i["default"].PropTypes.string.isRequired,progress:i["default"].PropTypes.number})
t["default"]=s},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(3),i=n(30),s=n(197),a=n(198),l=n(199),u=n(205),p=n(206),d=n(188),c=n(223),f=n(224),h=n(225),m=n(32),g=n(195),y=n(207),v=n(226),b=n(228),C=n(151),E=n(229),_=n(208),S=n(230),w=n(231),P=n(101),x=n(234),F=n(235),I=n(236),T=n(237),A=n(33),O=n(183),D=n(148),k=n(269),R=n(139),N=n(124),L=o.createClass({
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
},defaultFilter:function j(e,t){var n=this
return D(e,function(e){for(var r=y.keys(e),o=0;o<r.length;o++){var i=n.columnSettings.getMetadataColumnProperty(r[o],"filterable",!0)
if(i&&(y.getAt(e,r[o])||"").toString().toLowerCase().indexOf(t.toLowerCase())>=0)return!0}return!1})},filterByColumnFilters:function M(e){var t=Object.keys(e).reduce(function(t,n){return D(t,function(t){
return y.getAt(t,n||"").toString().toLowerCase().indexOf(e[n].toLowerCase())>=0})},this.props.results),n={columnFilters:e}
e?(n.filteredResults=t,n.maxPage=this.getMaxPage(n.filteredResults)):this.state.filter?n.filteredResults=this.props.useCustomFilterer?this.props.customFilterer(this.props.results,filter):this.defaultFilter(this.props.results,filter):n.filteredResults=null,
this.setState(n)},filterByColumn:function H(e,t){var n=this.state.columnFilters
if(n.hasOwnProperty(t)&&!e)n=T(n,t)
else{var r={}
r[t]=e,n=O({},n,r)}this.filterByColumnFilters(n)},setFilter:function B(e){if(this.props.useExternal)return void this.props.externalSetFilter(e)
var t=this,n={page:0,filter:e}
n.filteredResults=this.props.useCustomFilterer?this.props.customFilterer(this.props.results,e):this.defaultFilter(this.props.results,e),n.maxPage=t.getMaxPage(n.filteredResults),(I(e)||F(e)||x(e))&&(n.filter=e,
n.filteredResults=null),t.setState(n),this._resetSelectedRows()},setPageSize:function z(e){return this.props.useExternal?(this.setState({resultsPerPage:e}),void this.props.externalSetPageSize(e)):(this.state.resultsPerPage=e,
void this.setMaxPage())},toggleColumnChooser:function G(){this.setState({showColumnChooser:!this.state.showColumnChooser})},isNullOrUndefined:function q(e){return void 0===e||null===e},shouldUseCustomRowComponent:function V(){
return this.isNullOrUndefined(this.state.useCustomRowComponent)?this.props.useCustomRowComponent:this.state.useCustomRowComponent},shouldUseCustomGridComponent:function W(){return this.isNullOrUndefined(this.state.useCustomGridComponent)?this.props.useCustomGridComponent:this.state.useCustomGridComponent

},toggleCustomComponent:function Q(){"grid"===this.state.customComponentType?this.setState({useCustomGridComponent:!this.shouldUseCustomGridComponent()}):"row"===this.state.customComponentType&&this.setState({
useCustomRowComponent:!this.shouldUseCustomRowComponent()})},getMaxPage:function K(e,t){if(this.props.useExternal)return this.props.externalMaxPage
t||(t=(e||this.getCurrentResults()).length)
var n=Math.ceil(t/this.state.resultsPerPage)
return n},setMaxPage:function $(e){var t=this.getMaxPage(e)
this.state.maxPage!==t&&this.setState({page:0,maxPage:t,filteredColumns:this.columnSettings.filteredColumns})},setPage:function Z(e){if(this.props.useExternal)return void this.props.externalSetPage(e)
if(e*this.state.resultsPerPage<=this.state.resultsPerPage*this.state.maxPage){var t=this,n={page:e}
t.setState(n)}this.props.enableInfiniteScroll&&this.setState({isSelectAllChecked:!1})},setColumns:function Y(e){this.columnSettings.filteredColumns=P(e)?e:[e],this.setState({filteredColumns:this.columnSettings.filteredColumns
})},nextPage:function X(){var e=this.getCurrentPage()
e<this.getCurrentMaxPage()-1&&this.setPage(e+1)},previousPage:function J(){var e=this.getCurrentPage()
e>0&&this.setPage(e-1)},changeSort:function ee(e){if(this.props.enableSort!==!1){if(this.props.useExternal){var t=this.props.externalSortColumn!==e||!this.props.externalSortAscending
return this.setState({sortColumn:e,sortDirection:t?"asc":"desc"}),void this.props.externalChangeSort(e,t)}var n=C(this.props.columnMetadata,{columnName:e})||{},r=n.sortDirectionCycle?n.sortDirectionCycle:[null,"asc","desc"],o=null,i=r.indexOf(this.state.sortDirection&&e===this.state.sortColumn?this.state.sortDirection:null)


i=(i+1)%r.length,o=r[i]?r[i]:null
var s={page:0,sortColumn:e,sortDirection:o}
this.setState(s)}},componentWillReceiveProps:function te(e){if(this.setMaxPage(e.results),e.resultsPerPage!==this.props.resultsPerPage&&this.setPageSize(e.resultsPerPage),this.columnSettings.columnMetadata=e.columnMetadata,
e.results.length>0){var t=y.keys(e.results[0]),n=this.columnSettings.allColumns.length==t.length&&this.columnSettings.allColumns.every(function(e,n){return e===t[n]})
n||(this.columnSettings.allColumns=t)}else this.columnSettings.allColumns.length>0&&(this.columnSettings.allColumns=[])
if(e.columns!==this.columnSettings.filteredColumns&&(this.columnSettings.filteredColumns=e.columns),e.selectedRowIds){var r=this.getDataForRender(this.getCurrentResults(e.results),this.columnSettings.getColumns(),!0)


this.setState({isSelectAllChecked:this._getAreAllRowsChecked(e.selectedRowIds,A(r,this.props.uniqueIdentifier)),selectedRowIds:e.selectedRowIds})}},getInitialState:function ne(){var e={maxPage:0,page:0,
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
return a(N(e,i),N(t,i))}),"desc"===this.state.sortDirection&&e.reverse()):1===a.length&&(e=k(e,function(e){return a(N(e,i))},[this.state.sortDirection]))
else{var u=[R(i)],p=[this.state.sortDirection]
l.columns.forEach(function(e,t){u.push(R(e)),"asc"===l.orders[t]||"desc"===l.orders[t]?p.push(l.orders[t]):p.push(r.state.sortDirection)}),e=k(e,u,p)}}var d=this.getCurrentPage()
if(!this.props.useExternal&&n&&this.state.resultsPerPage*(d+1)<=this.state.resultsPerPage*this.state.maxPage&&d>=0)if(this.isInfiniteScrollEnabled())e=E(e,(d+1)*this.state.resultsPerPage)
else{var c=v(e,d*this.state.resultsPerPage)
e=(b||S)(c,c.length-this.state.resultsPerPage)}for(var f=this.columnSettings.getMetadataColumns,h=[],m=0;m<e.length;m++){var g=e[m]
"undefined"!=typeof g[o.props.childrenColumnName]&&g[o.props.childrenColumnName].length>0&&(g.children=o.getDataForRender(g[o.props.childrenColumnName],t,!1),"children"!==o.props.childrenColumnName&&delete g[o.props.childrenColumnName]),
h.push(g)}return h},getCurrentResults:function le(e){return this.state.filteredResults||e||this.props.results},getCurrentPage:function ue(){return this.props.externalCurrentPage||this.state.page},getCurrentSort:function pe(){
return this.props.useExternal?this.props.externalSortColumn:this.state.sortColumn},getCurrentSortAscending:function de(){return this.props.useExternal?this.props.externalSortAscending:"asc"===this.state.sortDirection

},getCurrentMaxPage:function ce(){return this.props.useExternal?this.props.externalMaxPage:this.state.maxPage},getSortObject:function fe(){return{enableSort:this.props.enableSort,changeSort:this.changeSort,
sortColumn:this.getCurrentSort(),sortAscending:this.getCurrentSortAscending(),sortDirection:this.state.sortDirection,sortAscendingClassName:this.props.sortAscendingClassName,sortDescendingClassName:this.props.sortDescendingClassName,
sortAscendingComponent:this.props.sortAscendingComponent,sortDescendingComponent:this.props.sortDescendingComponent,sortDefaultComponent:this.props.sortDefaultComponent}},_toggleSelectAll:function he(){
var e=this.getDataForRender(this.getCurrentResults(),this.columnSettings.getColumns(),!0),t=!this.state.isSelectAllChecked,n=JSON.parse(JSON.stringify(this.state.selectedRowIds)),r=this
_(e,function(e){r._updateSelectedRowIds(e[r.props.uniqueIdentifier],n,t)},this),this.setState({isSelectAllChecked:t,selectedRowIds:n}),this.props.onSelectionChange&&this.props.onSelectionChange(n,t)},_toggleSelectRow:function me(e,t){
var n=this.getDataForRender(this.getCurrentResults(),this.columnSettings.getColumns(),!0),r=JSON.parse(JSON.stringify(this.state.selectedRowIds))
this._updateSelectedRowIds(e[this.props.uniqueIdentifier],r,t)
var o=this._getAreAllRowsChecked(r,A(n,this.props.uniqueIdentifier))
this.setState({isSelectAllChecked:o,selectedRowIds:r}),this.props.onSelectionChange&&this.props.onSelectionChange(r,o)},_updateSelectedRowIds:function ge(e,t,n){var r
n?(r=C(t,function(t){return e===t}),void 0===r&&t.push(e)):t.splice(t.indexOf(e),1)},_getIsSelectAllChecked:function ye(){return this.state.isSelectAllChecked},_getAreAllRowsChecked:function ve(e,t){return t.length===w(t,e).length

},_getIsRowChecked:function be(e){return this.state.selectedRowIds.indexOf(e[this.props.uniqueIdentifier])>-1},getSelectedRowIds:function Ce(){return this.state.selectedRowIds},_resetSelectedRows:function Ee(){
this.setState({isSelectAllChecked:!1,selectedRowIds:[]})},getMultipleSelectionObject:function _e(){return{isMultipleSelection:!C(this.props.results,function(e){return"children"in e})&&this.props.isMultipleSelection,
toggleSelectAll:this._toggleSelectAll,getIsSelectAllChecked:this._getIsSelectAllChecked,toggleSelectRow:this._toggleSelectRow,getSelectedRowIds:this.getSelectedRowIds,getIsRowChecked:this._getIsRowChecked
}},isInfiniteScrollEnabled:function Se(){return!this.props.useCustomPagerComponent&&this.props.enableInfiniteScroll},getClearFixStyles:function we(){return{clear:"both",display:"table",width:"100%"}},getSettingsStyles:function Pe(){
return{"float":"left",width:"50%",textAlign:"right"}},getFilterStyles:function xe(){return{"float":"left",width:"50%",textAlign:"left",color:"#222",minHeight:"1px"}},getFilter:function Fe(){return this.props.showFilter&&this.shouldUseCustomGridComponent()===!1?this.props.useCustomFilterComponent?o.createElement(h,{
changeFilter:this.setFilter,placeholderText:this.props.filterPlaceholderText,customFilterComponent:this.props.customFilterComponent,results:this.props.results,currentResults:this.getCurrentResults()}):o.createElement(s,{
changeFilter:this.setFilter,placeholderText:this.props.filterPlaceholderText}):""},getSettings:function Ie(){return this.props.showSettings?o.createElement("button",{type:"button",className:this.props.settingsToggleClassName,
onClick:this.toggleColumnChooser,style:this.props.useGriddleStyles?{background:"none",border:"none",padding:0,margin:0,fontSize:14}:null},this.props.settingsText,this.props.settingsIconComponent):""},getTopSection:function Te(e,t){
if(this.props.showFilter===!1&&this.props.showSettings===!1)return""
var n=null,r=null,i=null
return this.props.useGriddleStyles&&(n=this.getFilterStyles(),r=this.getSettingsStyles(),i=this.getClearFixStyles()),o.createElement("div",{className:"top-section",style:i},o.createElement("div",{className:"griddle-filter",
style:n},e),o.createElement("div",{className:"griddle-settings-toggle",style:r},t))},getPagingSection:function Ae(e,t){if((this.props.showPager&&!this.isInfiniteScrollEnabled()&&!this.shouldUseCustomGridComponent())!==!1)return o.createElement("div",{
className:"griddle-footer"},this.props.useCustomPagerComponent?o.createElement(f,{customPagerComponentOptions:this.props.customPagerComponentOptions,next:this.nextPage,previous:this.previousPage,currentPage:e,
maxPage:t,setPage:this.setPage,nextText:this.props.nextText,previousText:this.props.previousText,customPagerComponent:this.props.customPagerComponent}):o.createElement(a,{useGriddleStyles:this.props.useGriddleStyles,
next:this.nextPage,previous:this.previousPage,nextClassName:this.props.nextClassName,nextIconComponent:this.props.nextIconComponent,previousClassName:this.props.previousClassName,previousIconComponent:this.props.previousIconComponent,
currentPage:e,maxPage:t,setPage:this.setPage,nextText:this.props.nextText,previousText:this.props.previousText}))},getColumnSelectorSection:function Oe(e,t){return this.state.showColumnChooser?o.createElement(l,{
columns:e,selectedColumns:t,setColumns:this.setColumns,settingsText:this.props.settingsText,settingsIconComponent:this.props.settingsIconComponent,maxRowsText:this.props.maxRowsText,setPageSize:this.setPageSize,
showSetPageSize:!this.shouldUseCustomGridComponent(),resultsPerPage:this.state.resultsPerPage,enableToggleCustom:this.props.enableToggleCustom,toggleCustomComponent:this.toggleCustomComponent,useCustomComponent:this.shouldUseCustomRowComponent()||this.shouldUseCustomGridComponent(),
useGriddleStyles:this.props.useGriddleStyles,enableCustomFormatText:this.props.enableCustomFormatText,columnMetadata:this.props.columnMetadata}):""},getCustomGridSection:function De(){return o.createElement(this.props.customGridComponent,r({
data:this.props.results,className:this.props.customGridComponentClassName},this.props.gridMetadata))},getCustomRowSection:function ke(e,t,n,r,i){return o.createElement("div",null,o.createElement(c,{data:e,
columns:t,metadataColumns:n,globalData:i,className:this.props.customRowComponentClassName,customComponent:this.props.customRowComponent,style:this.props.useGriddleStyles?this.getClearFixStyles():null}),this.props.showPager&&r)

},getStandardGridSection:function Re(e,t,n,r,s){var a=this.getSortObject(),l=this.getMultipleSelectionObject(),u=this.shouldShowNoDataSection(e),p=this.getNoDataSection()
return o.createElement("div",{className:"griddle-body"},o.createElement(i,{useGriddleStyles:this.props.useGriddleStyles,noDataSection:p,showNoData:u,columnSettings:this.columnSettings,rowSettings:this.rowSettings,
sortSettings:a,multipleSelectionSettings:l,filterByColumn:this.filterByColumn,isSubGriddle:this.props.isSubGriddle,useGriddleIcons:this.props.useGriddleIcons,useFixedLayout:this.props.useFixedLayout,showPager:this.props.showPager,
pagingContent:r,data:e,className:this.props.tableClassName,enableInfiniteScroll:this.isInfiniteScrollEnabled(),nextPage:this.nextPage,showTableHeading:this.props.showTableHeading,useFixedHeader:this.props.useFixedHeader,
parentRowCollapsedClassName:this.props.parentRowCollapsedClassName,parentRowExpandedClassName:this.props.parentRowExpandedClassName,parentRowCollapsedComponent:this.props.parentRowCollapsedComponent,parentRowExpandedComponent:this.props.parentRowExpandedComponent,
bodyHeight:this.props.bodyHeight,paddingHeight:this.props.paddingHeight,rowHeight:this.props.rowHeight,infiniteScrollLoadTreshold:this.props.infiniteScrollLoadTreshold,externalLoadingComponent:this.props.externalLoadingComponent,
externalIsLoading:this.props.externalIsLoading,hasMorePages:s,onRowClick:this.props.onRowClick}))},getContentSection:function Ne(e,t,n,r,o,i){return this.shouldUseCustomGridComponent()&&null!==this.props.customGridComponent?this.getCustomGridSection():this.shouldUseCustomRowComponent()?this.getCustomRowSection(e,t,n,r,i):this.getStandardGridSection(e,t,n,r,o)

},getNoDataSection:function Le(){return null!=this.props.customNoDataComponent?o.createElement("div",{className:this.props.noDataClassName},o.createElement(this.props.customNoDataComponent,this.props.customNoDataComponentProps)):o.createElement(u,{
noDataMessage:this.props.noDataMessage})},shouldShowNoDataSection:function Ue(e){return!this.props.allowEmptyGrid&&(this.props.useExternal===!1&&("undefined"==typeof e||0===e.length)||this.props.useExternal===!0&&this.props.externalIsLoading===!1&&0===e.length)

},render:function je(){var e=this,t=this.getCurrentResults(),n=this.props.tableClassName+" table-header",r=this.getFilter(),i=this.getSettings(),s=this.getTopSection(r,i),a=[],l=this.columnSettings.getColumns(),u=this.getDataForRender(t,l,!0),p=this.columnSettings.getMetadataColumns()


a=y.keys(T(t[0],p)),a=this.columnSettings.orderColumns(a)
var d=this.getCurrentPage(),c=this.getCurrentMaxPage(),f=d+1<c,h=this.getPagingSection(d,c),m=this.getContentSection(u,l,p,h,f,this.props.globalData),g=this.getColumnSelectorSection(a,l),v=this.props.gridClassName.length>0?"griddle "+this.props.gridClassName:"griddle"


return v+=this.shouldUseCustomRowComponent()?" griddle-custom":"",o.createElement("div",{className:v},s,g,o.createElement("div",{className:"griddle-container",style:this.props.useGriddleStyles&&!this.props.isSubGriddle?{
border:"1px solid #DDD"}:null},m))}})
d.Griddle=e.exports=L},function(e,t,n){"use strict"
var r=n(3),o=n(31),i=n(188),s=n(32),a=n(195),l=r.createClass({displayName:"GridTable",getDefaultProps:function u(){return{data:[],columnSettings:null,rowSettings:null,sortSettings:null,multipleSelectionSettings:null,
className:"",enableInfiniteScroll:!1,nextPage:null,hasMorePages:!1,useFixedHeader:!1,useFixedLayout:!0,paddingHeight:null,rowHeight:null,filterByColumn:null,infiniteScrollLoadTreshold:null,bodyHeight:null,
useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",parentRowCollapsedComponent:"▶",parentRowExpandedComponent:"▼",
externalLoadingComponent:null,externalIsLoading:!1,onRowClick:null}},getInitialState:function p(){return{scrollTop:0,scrollHeight:this.props.bodyHeight,clientHeight:this.props.bodyHeight}},componentDidMount:function d(){
this.gridScroll()},componentDidUpdate:function c(e,t){this.gridScroll()},gridScroll:function f(){if(this.props.enableInfiniteScroll&&!this.props.externalIsLoading){var e=this.refs.scrollable,t=e.scrollTop,n=e.scrollHeight,r=e.clientHeight


if(null!==this.props.rowHeight&&this.state.scrollTop!==t&&Math.abs(this.state.scrollTop-t)>=this.getAdjustedRowHeight()){var o={scrollTop:t,scrollHeight:n,clientHeight:r}
this.setState(o)}var i=n-(t+r)-this.props.infiniteScrollLoadTreshold,s=.6*i
s<=this.props.infiniteScrollLoadTreshold&&this.props.nextPage()}},verifyProps:function h(){null===this.props.columnSettings&&console.error("gridTable: The columnSettings prop is null and it shouldn't be"),
null===this.props.rowSettings&&console.error("gridTable: The rowSettings prop is null and it shouldn't be")},getAdjustedRowHeight:function m(){return this.props.rowHeight+2*this.props.paddingHeight},getNodeContent:function g(){
this.verifyProps()
var e=this,t=!1
if(!this.props.externalIsLoading||this.props.enableInfiniteScroll){var n=e.props.data,o=null,s=null,a=!1
if(this.props.enableInfiniteScroll&&null!==this.props.rowHeight&&void 0!==this.refs.scrollable){var l=e.getAdjustedRowHeight(),u=Math.ceil(e.state.clientHeight/l),p=Math.max(0,Math.floor(e.state.scrollTop/l)-.25*u),d=Math.min(p+1.25*u,this.props.data.length-1)


n=n.slice(p,d+1)
var c={height:p*l+"px"}
o=r.createElement("tr",{key:"above-"+c.height,style:c})
var f={height:(this.props.data.length-d)*l+"px"}
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
var d=this.props.externalLoadingComponent?r.createElement(this.props.externalLoadingComponent,null):r.createElement("div",null,"Loading...")
a=r.createElement("tbody",null,r.createElement("tr",null,r.createElement("td",{style:u,colSpan:p},d)))}var c=this.props.showTableHeading?r.createElement(o,{useGriddleStyles:this.props.useGriddleStyles,
useGriddleIcons:this.props.useGriddleIcons,sortSettings:this.props.sortSettings,multipleSelectionSettings:this.props.multipleSelectionSettings,columnSettings:this.props.columnSettings,filterByColumn:this.props.filterByColumn,
rowSettings:this.props.rowSettings}):void 0
n||(t=r.createElement("tbody",null,t))
var f=r.createElement("tbody",null)
if(this.props.showPager){var h=this.props.useGriddleStyles?{padding:"0px",backgroundColor:"#EDEDED",border:"0px",color:"#222",height:this.props.showNoData?"20px":null}:null
f=r.createElement("tbody",null,r.createElement("tr",null,r.createElement("td",{colSpan:this.props.multipleSelectionSettings.isMultipleSelection?this.props.columnSettings.getVisibleColumnCount()+1:this.props.columnSettings.getVisibleColumnCount(),
style:h,className:"footer-container"},this.props.showNoData?null:this.props.pagingContent)))}return this.props.useFixedHeader?(this.props.useGriddleStyles&&(l.tableLayout="fixed"),r.createElement("div",null,r.createElement("table",{
className:this.props.className,style:this.props.useGriddleStyles&&l||null},c),r.createElement("div",{ref:"scrollable",onScroll:this.gridScroll,style:s},r.createElement("table",{className:this.props.className,
style:this.props.useGriddleStyles&&l||null},t,a,f)))):r.createElement("div",{ref:"scrollable",onScroll:this.gridScroll,style:s},r.createElement("table",{className:this.props.className,style:this.props.useGriddleStyles&&l||null
},c,t,a,f))}})
e.exports=l},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(3),i=n(32),s=n(183),a=o.createClass({displayName:"DefaultHeaderComponent",render:function u(){return o.createElement("span",null,this.props.displayName)

}}),l=o.createClass({displayName:"GridTitle",getDefaultProps:function p(){return{columnSettings:null,filterByColumn:function e(){},rowSettings:null,sortSettings:null,multipleSelectionSettings:null,headerStyle:null,
useGriddleStyles:!0,useGriddleIcons:!0,headerStyles:{}}},componentWillMount:function d(){this.verifyProps()},sort:function c(e){var t=this
return function(n){t.props.sortSettings.changeSort(e)}},toggleSelectAll:function f(e){this.props.multipleSelectionSettings.toggleSelectAll()},handleSelectionChange:function h(e){},verifyProps:function m(){
null===this.props.columnSettings&&console.error("gridTitle: The columnSettings prop is null and it shouldn't be"),null===this.props.sortSettings&&console.error("gridTitle: The sortSettings prop is null and it shouldn't be")

},render:function g(){this.verifyProps()
var e=this,t={},n=this.props.columnSettings.getColumns().map(function(n,i){var l={},u="",p=e.props.columnSettings.getMetadataColumnProperty(n,"sortable",!0),d=p?e.props.sortSettings.sortDefaultComponent:null


e.props.sortSettings.sortColumn==n&&"asc"===e.props.sortSettings.sortDirection?(u=e.props.sortSettings.sortAscendingClassName,d=e.props.useGriddleIcons&&e.props.sortSettings.sortAscendingComponent):e.props.sortSettings.sortColumn==n&&"desc"===e.props.sortSettings.sortDirection&&(u+=e.props.sortSettings.sortDescendingClassName,
d=e.props.useGriddleIcons&&e.props.sortSettings.sortDescendingComponent)
var c=e.props.columnSettings.getColumnMetadataByName(n),f=e.props.columnSettings.getMetadataColumnProperty(n,"displayName",n),h=e.props.columnSettings.getMetadataColumnProperty(n,"customHeaderComponent",a),m=e.props.columnSettings.getMetadataColumnProperty(n,"customHeaderComponentProps",{})


u=null==c?u:(u&&u+" "||u)+e.props.columnSettings.getMetadataColumnProperty(n,"cssClassName",""),e.props.useGriddleStyles&&(l={backgroundColor:"#EDEDEF",border:"0px",borderBottom:"1px solid #DDD",color:"#222",
padding:"5px",cursor:p?"pointer":"default"}),t=c&&c.titleStyles?s({},l,c.titleStyles):s({},l)
var g=f?"th":"td"
return o.createElement(g,{onClick:p?e.sort(n):null,"data-title":n,className:u,key:n,style:t},o.createElement(h,r({columnName:n,displayName:f,filterByColumn:e.props.filterByColumn},m)),d)})
n&&this.props.multipleSelectionSettings.isMultipleSelection&&n.unshift(o.createElement("th",{key:"selection",onClick:this.toggleSelectAll,style:t,className:"griddle-select griddle-select-title"},o.createElement("input",{
type:"checkbox",checked:this.props.multipleSelectionSettings.getIsSelectAllChecked(),onChange:this.handleSelectionChange})))
var i=e.props.rowSettings&&e.props.rowSettings.getHeaderRowMetadataClass()||null
return o.createElement("thead",null,o.createElement("tr",{className:i,style:this.props.headerStyles},n))}})
e.exports=l},function(e,t,n){"use strict"
function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(33),s=n(148),a=n(151),l=n(158),u=n(175),p=function(){
function e(){var t=arguments.length<=0||void 0===arguments[0]?[]:arguments[0],n=arguments.length<=1||void 0===arguments[1]?[]:arguments[1],o=arguments.length<=2||void 0===arguments[2]?"children":arguments[2],i=arguments.length<=3||void 0===arguments[3]?[]:arguments[3],s=arguments.length<=4||void 0===arguments[4]?[]:arguments[4]


r(this,e),this.allColumns=t,this.filteredColumns=n,this.childrenColumnName=o,this.columnMetadata=i,this.metadataColumns=s}return o(e,[{key:"getMetadataColumns",value:function t(){var e=i(s(this.columnMetadata,{
visible:!1}),function(e){return e.columnName})
return e.indexOf(this.childrenColumnName)<0&&e.push(this.childrenColumnName),e.concat(this.metadataColumns)}},{key:"getVisibleColumnCount",value:function n(){return this.getColumns().length}},{key:"getColumnMetadataByName",
value:function p(e){return a(this.columnMetadata,{columnName:e})}},{key:"hasColumnMetadata",value:function d(){return null!==this.columnMetadata&&this.columnMetadata.length>0}},{key:"getMetadataColumnProperty",
value:function c(e,t,n){var r=this.getColumnMetadataByName(e)
return"undefined"==typeof r||null===r?n:r.hasOwnProperty(t)?r[t]:n}},{key:"orderColumns",value:function f(e){var t=this,n=100,r=l(e,function(e){var r=a(t.columnMetadata,{columnName:e})
return"undefined"==typeof r||null===r||isNaN(r.order)?n:r.order})
return r}},{key:"getColumns",value:function h(){var e=0===this.filteredColumns.length?this.allColumns:this.filteredColumns
return e=u(e,this.metadataColumns),e=this.orderColumns(e)}}]),e}()
e.exports=p},function(e,t,n){function r(e,t){var n=a(e)?o:s
return n(e,i(t,3))}var o=n(34),i=n(35),s=n(142),a=n(101)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e)
return o}e.exports=n},function(e,t,n){function r(e){return"function"==typeof e?e:null==e?s:"object"==typeof e?a(e)?i(e[0],e[1]):o(e):l(e)}var o=n(36),i=n(123),s=n(138),a=n(101),l=n(139)
e.exports=r},function(e,t,n){function r(e){var t=i(e)
return 1==t.length&&t[0][2]?s(t[0][0],t[0][1]):function(n){return n===e||o(n,e,t)}}var o=n(37),i=n(120),s=n(122)
e.exports=r},function(e,t,n){function r(e,t,n,r){var l=n.length,u=l,p=!r
if(null==e)return!u
for(e=Object(e);l--;){var d=n[l]
if(p&&d[2]?d[1]!==e[d[0]]:!(d[0]in e))return!1}for(;++l<u;){d=n[l]
var c=d[0],f=e[c],h=d[1]
if(p&&d[2]){if(void 0===f&&!(c in e))return!1}else{var m=new o
if(r)var g=r(f,h,c,e,t,m)
if(!(void 0===g?i(h,f,s|a,r,m):g))return!1}}return!0}var o=n(38),i=n(82),s=1,a=2
e.exports=r},function(e,t,n){function r(e){var t=this.__data__=new o(e)
this.size=t.size}var o=n(39),i=n(47),s=n(48),a=n(49),l=n(50),u=n(51)
r.prototype.clear=i,r.prototype["delete"]=s,r.prototype.get=a,r.prototype.has=l,r.prototype.set=u,e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(40),i=n(41),s=n(44),a=n(45),l=n(46)
r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t){function n(){this.__data__=[],this.size=0}e.exports=n},function(e,t,n){function r(e){
var t=this.__data__,n=o(t,e)
if(n<0)return!1
var r=t.length-1
return n==r?t.pop():s.call(t,n,1),--this.size,!0}var o=n(42),i=Array.prototype,s=i.splice
e.exports=r},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n
return-1}var o=n(43)
e.exports=r},function(e,t){function n(e,t){return e===t||e!==e&&t!==t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e)
return n<0?void 0:t[n][1]}var o=n(42)
e.exports=r},function(e,t,n){function r(e){return o(this.__data__,e)>-1}var o=n(42)
e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__,r=o(n,e)
return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}var o=n(42)
e.exports=r},function(e,t,n){function r(){this.__data__=new o,this.size=0}var o=n(39)
e.exports=r},function(e,t){function n(e){var t=this.__data__,n=t["delete"](e)
return this.size=t.size,n}e.exports=n},function(e,t){function n(e){return this.__data__.get(e)}e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t,n){function r(e,t){
var n=this.__data__
if(n instanceof o){var r=n.__data__
if(!i||r.length<a-1)return r.push([e,t]),this.size=++n.size,this
n=this.__data__=new s(r)}return n.set(e,t),this.size=n.size,this}var o=n(39),i=n(52),s=n(67),a=200
e.exports=r},function(e,t,n){var r=n(53),o=n(58),i=r(o,"Map")
e.exports=i},function(e,t,n){function r(e,t){var n=i(e,t)
return o(n)?n:void 0}var o=n(54),i=n(66)
e.exports=r},function(e,t,n){function r(e){if(!s(e)||i(e))return!1
var t=o(e)?h:u
return t.test(a(e))}var o=n(55),i=n(63),s=n(62),a=n(65),l=/[\\^$.*+?()[\]{}|]/g,u=/^\[object .+?Constructor\]$/,p=Function.prototype,d=Object.prototype,c=p.toString,f=d.hasOwnProperty,h=RegExp("^"+c.call(f).replace(l,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$")


e.exports=r},function(e,t,n){function r(e){if(!i(e))return!1
var t=o(e)
return t==a||t==l||t==s||t==u}var o=n(56),i=n(62),s="[object AsyncFunction]",a="[object Function]",l="[object GeneratorFunction]",u="[object Proxy]"
e.exports=r},function(e,t,n){function r(e){return null==e?void 0===e?l:a:(e=Object(e),u&&u in e?i(e):s(e))}var o=n(57),i=n(60),s=n(61),a="[object Null]",l="[object Undefined]",u=o?o.toStringTag:void 0
e.exports=r},function(e,t,n){var r=n(58),o=r.Symbol
e.exports=o},function(e,t,n){var r=n(59),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")()
e.exports=i},function(e,t){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t
e.exports=n}).call(t,function(){return this}())},function(e,t,n){function r(e){var t=s.call(e,l),n=e[l]
try{e[l]=void 0
var r=!0}catch(o){}var i=a.call(e)
return r&&(t?e[l]=n:delete e[l]),i}var o=n(57),i=Object.prototype,s=i.hasOwnProperty,a=i.toString,l=o?o.toStringTag:void 0
e.exports=r},function(e,t){function n(e){return o.call(e)}var r=Object.prototype,o=r.toString
e.exports=n},function(e,t){function n(e){var t=typeof e
return null!=e&&("object"==t||"function"==t)}e.exports=n},function(e,t,n){function r(e){return!!i&&i in e}var o=n(64),i=function(){var e=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"")
return e?"Symbol(src)_1."+e:""}()
e.exports=r},function(e,t,n){var r=n(58),o=r["__core-js_shared__"]
e.exports=o},function(e,t){function n(e){if(null!=e){try{return o.call(e)}catch(t){}try{return e+""}catch(t){}}return""}var r=Function.prototype,o=r.toString
e.exports=n},function(e,t){function n(e,t){return null==e?void 0:e[t]}e.exports=n},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(68),i=n(76),s=n(79),a=n(80),l=n(81)
r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.size=0,this.__data__={hash:new o,map:new(s||i),string:new o
}}var o=n(69),i=n(39),s=n(52)
e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){var r=e[t]
this.set(r[0],r[1])}}var o=n(70),i=n(72),s=n(73),a=n(74),l=n(75)
r.prototype.clear=o,r.prototype["delete"]=i,r.prototype.get=s,r.prototype.has=a,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.__data__=o?o(null):{},this.size=0}var o=n(71)
e.exports=r},function(e,t,n){var r=n(53),o=r(Object,"create")
e.exports=o},function(e,t){function n(e){var t=this.has(e)&&delete this.__data__[e]
return this.size-=t?1:0,t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__
if(o){var n=t[e]
return n===i?void 0:n}return a.call(t,e)?t[e]:void 0}var o=n(71),i="__lodash_hash_undefined__",s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){function r(e){var t=this.__data__
return o?void 0!==t[e]:s.call(t,e)}var o=n(71),i=Object.prototype,s=i.hasOwnProperty
e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__
return this.size+=this.has(e)?0:1,n[e]=o&&void 0===t?i:t,this}var o=n(71),i="__lodash_hash_undefined__"
e.exports=r},function(e,t,n){function r(e){var t=o(this,e)["delete"](e)
return this.size-=t?1:0,t}var o=n(77)
e.exports=r},function(e,t,n){function r(e,t){var n=e.__data__
return o(t)?n["string"==typeof t?"string":"hash"]:n.map}var o=n(78)
e.exports=r},function(e,t){function n(e){var t=typeof e
return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}e.exports=n},function(e,t,n){function r(e){return o(this,e).get(e)}var o=n(77)
e.exports=r},function(e,t,n){function r(e){return o(this,e).has(e)}var o=n(77)
e.exports=r},function(e,t,n){function r(e,t){var n=o(this,e),r=n.size
return n.set(e,t),this.size+=n.size==r?0:1,this}var o=n(77)
e.exports=r},function(e,t,n){function r(e,t,n,a,l){return e===t||(null==e||null==t||!i(e)&&!s(t)?e!==e&&t!==t:o(e,t,n,a,r,l))}var o=n(83),i=n(62),s=n(100)
e.exports=r},function(e,t,n){function r(e,t,n,r,g,v){var b=u(e),C=u(t),E=h,_=h
b||(E=l(e),E=E==f?m:E),C||(_=l(t),_=_==f?m:_)
var S=E==m,w=_==m,P=E==_
if(P&&p(e)){if(!p(t))return!1
b=!0,S=!1}if(P&&!S)return v||(v=new o),b||d(e)?i(e,t,n,r,g,v):s(e,t,E,n,r,g,v)
if(!(n&c)){var x=S&&y.call(e,"__wrapped__"),F=w&&y.call(t,"__wrapped__")
if(x||F){var I=x?e.value():e,T=F?t.value():t
return v||(v=new o),g(I,T,n,r,v)}}return!!P&&(v||(v=new o),a(e,t,n,r,g,v))}var o=n(38),i=n(84),s=n(90),a=n(94),l=n(115),u=n(101),p=n(102),d=n(105),c=1,f="[object Arguments]",h="[object Array]",m="[object Object]",g=Object.prototype,y=g.hasOwnProperty


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
break}}return p["delete"](e),p["delete"](t),g}var o=n(85),i=n(88),s=n(89),a=1,l=2
e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length
for(this.__data__=new o;++t<n;)this.add(e[t])}var o=n(67),i=n(86),s=n(87)
r.prototype.add=r.prototype.push=i,r.prototype.has=s,e.exports=r},function(e,t){function n(e){return this.__data__.set(e,r),this}var r="__lodash_hash_undefined__"
e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0
return!1}e.exports=n},function(e,t){function n(e,t){return e.has(t)}e.exports=n},function(e,t,n){function r(e,t,n,r,o,S,P){switch(n){case _:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1


e=e.buffer,t=t.buffer
case E:return!(e.byteLength!=t.byteLength||!S(new i(e),new i(t)))
case c:case f:case g:return s(+e,+t)
case h:return e.name==t.name&&e.message==t.message
case y:case b:return e==t+""
case m:var x=l
case v:var F=r&p
if(x||(x=u),e.size!=t.size&&!F)return!1
var I=P.get(e)
if(I)return I==t
r|=d,P.set(e,t)
var T=a(x(e),x(t),r,o,S,P)
return P["delete"](e),T
case C:if(w)return w.call(e)==w.call(t)}return!1}var o=n(57),i=n(91),s=n(43),a=n(84),l=n(92),u=n(93),p=1,d=2,c="[object Boolean]",f="[object Date]",h="[object Error]",m="[object Map]",g="[object Number]",y="[object RegExp]",v="[object Set]",b="[object String]",C="[object Symbol]",E="[object ArrayBuffer]",_="[object DataView]",S=o?o.prototype:void 0,w=S?S.valueOf:void 0


e.exports=r},function(e,t,n){var r=n(58),o=r.Uint8Array
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
break}v||(v="constructor"==m)}if(y&&!v){var _=e.constructor,S=t.constructor
_!=S&&"constructor"in e&&"constructor"in t&&!("function"==typeof _&&_ instanceof _&&"function"==typeof S&&S instanceof S)&&(y=!1)}return l["delete"](e),l["delete"](t),y}var o=n(95),i=1,s=Object.prototype,a=s.hasOwnProperty


e.exports=r},function(e,t,n){function r(e){return s(e)?o(e):i(e)}var o=n(96),i=n(110),s=n(114)
e.exports=r},function(e,t,n){function r(e,t){var n=s(e),r=!n&&i(e),p=!n&&!r&&a(e),c=!n&&!r&&!p&&u(e),f=n||r||p||c,h=f?o(e.length,String):[],m=h.length
for(var g in e)!t&&!d.call(e,g)||f&&("length"==g||p&&("offset"==g||"parent"==g)||c&&("buffer"==g||"byteLength"==g||"byteOffset"==g)||l(g,m))||h.push(g)
return h}var o=n(97),i=n(98),s=n(101),a=n(102),l=n(104),u=n(105),p=Object.prototype,d=p.hasOwnProperty
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n)
return r}e.exports=n},function(e,t,n){var r=n(99),o=n(100),i=Object.prototype,s=i.hasOwnProperty,a=i.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&s.call(e,"callee")&&!a.call(e,"callee")

}
e.exports=l},function(e,t,n){function r(e){return i(e)&&o(e)==s}var o=n(56),i=n(100),s="[object Arguments]"
e.exports=r},function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},function(e,t){var n=Array.isArray
e.exports=n},function(e,t,n){(function(e){var r=n(58),o=n(103),i="object"==typeof t&&t&&!t.nodeType&&t,s=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=s&&s.exports===i,l=a?r.Buffer:void 0,u=l?l.isBuffer:void 0,p=u||o


e.exports=p}).call(t,n(24)(e))},function(e,t){function n(){return!1}e.exports=n},function(e,t){function n(e,t){return t=null==t?r:t,!!t&&("number"==typeof e||o.test(e))&&e>-1&&e%1==0&&e<t}var r=9007199254740991,o=/^(?:0|[1-9]\d*)$/


e.exports=n},function(e,t,n){var r=n(106),o=n(108),i=n(109),s=i&&i.isTypedArray,a=s?o(s):r
e.exports=a},function(e,t,n){function r(e){return s(e)&&i(e.length)&&!!O[o(e)]}var o=n(56),i=n(107),s=n(100),a="[object Arguments]",l="[object Array]",u="[object Boolean]",p="[object Date]",d="[object Error]",c="[object Function]",f="[object Map]",h="[object Number]",m="[object Object]",g="[object RegExp]",y="[object Set]",v="[object String]",b="[object WeakMap]",C="[object ArrayBuffer]",E="[object DataView]",_="[object Float32Array]",S="[object Float64Array]",w="[object Int8Array]",P="[object Int16Array]",x="[object Int32Array]",F="[object Uint8Array]",I="[object Uint8ClampedArray]",T="[object Uint16Array]",A="[object Uint32Array]",O={}


O[_]=O[S]=O[w]=O[P]=O[x]=O[F]=O[I]=O[T]=O[A]=!0,O[a]=O[l]=O[C]=O[u]=O[E]=O[p]=O[d]=O[c]=O[f]=O[h]=O[m]=O[g]=O[y]=O[v]=O[b]=!1,e.exports=r},function(e,t){function n(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=r

}var r=9007199254740991
e.exports=n},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n},function(e,t,n){(function(e){var r=n(59),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,s=i&&i.exports===o,a=s&&r.process,l=function(){
try{return a&&a.binding&&a.binding("util")}catch(e){}}()
e.exports=l}).call(t,n(24)(e))},function(e,t,n){function r(e){if(!o(e))return i(e)
var t=[]
for(var n in Object(e))a.call(e,n)&&"constructor"!=n&&t.push(n)
return t}var o=n(111),i=n(112),s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t){function n(e){var t=e&&e.constructor,n="function"==typeof t&&t.prototype||r
return e===n}var r=Object.prototype
e.exports=n},function(e,t,n){var r=n(113),o=r(Object.keys,Object)
e.exports=o},function(e,t){function n(e,t){return function(n){return e(t(n))}}e.exports=n},function(e,t,n){function r(e){return null!=e&&i(e.length)&&!o(e)}var o=n(55),i=n(107)
e.exports=r},function(e,t,n){var r=n(116),o=n(52),i=n(117),s=n(118),a=n(119),l=n(56),u=n(65),p="[object Map]",d="[object Object]",c="[object Promise]",f="[object Set]",h="[object WeakMap]",m="[object DataView]",g=u(r),y=u(o),v=u(i),b=u(s),C=u(a),E=l

;(r&&E(new r(new ArrayBuffer(1)))!=m||o&&E(new o)!=p||i&&E(i.resolve())!=c||s&&E(new s)!=f||a&&E(new a)!=h)&&(E=function(e){var t=l(e),n=t==d?e.constructor:void 0,r=n?u(n):""
if(r)switch(r){case g:return m
case y:return p
case v:return c
case b:return f
case C:return h}return t}),e.exports=E},function(e,t,n){var r=n(53),o=n(58),i=r(o,"DataView")
e.exports=i},function(e,t,n){var r=n(53),o=n(58),i=r(o,"Promise")
e.exports=i},function(e,t,n){var r=n(53),o=n(58),i=r(o,"Set")
e.exports=i},function(e,t,n){var r=n(53),o=n(58),i=r(o,"WeakMap")
e.exports=i},function(e,t,n){function r(e){for(var t=i(e),n=t.length;n--;){var r=t[n],s=e[r]
t[n]=[r,s,o(s)]}return t}var o=n(121),i=n(95)
e.exports=r},function(e,t,n){function r(e){return e===e&&!o(e)}var o=n(62)
e.exports=r},function(e,t){function n(e,t){return function(n){return null!=n&&(n[e]===t&&(void 0!==t||e in Object(n)))}}e.exports=n},function(e,t,n){function r(e,t){return a(e)&&l(t)?u(p(e),t):function(n){
var r=i(n,e)
return void 0===r&&r===t?s(n,e):o(t,r,d|c)}}var o=n(82),i=n(124),s=n(135),a=n(127),l=n(121),u=n(122),p=n(134),d=1,c=2
e.exports=r},function(e,t,n){function r(e,t,n){var r=null==e?void 0:o(e,t)
return void 0===r?n:r}var o=n(125)
e.exports=r},function(e,t,n){function r(e,t){t=o(t,e)
for(var n=0,r=t.length;null!=e&&n<r;)e=e[i(t[n++])]
return n&&n==r?e:void 0}var o=n(126),i=n(134)
e.exports=r},function(e,t,n){function r(e,t){return o(e)?e:i(e,t)?[e]:s(a(e))}var o=n(101),i=n(127),s=n(129),a=n(132)
e.exports=r},function(e,t,n){function r(e,t){if(o(e))return!1
var n=typeof e
return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!i(e))||(a.test(e)||!s.test(e)||null!=t&&e in Object(t))}var o=n(101),i=n(128),s=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,a=/^\w*$/
e.exports=r},function(e,t,n){function r(e){return"symbol"==typeof e||i(e)&&o(e)==s}var o=n(56),i=n(100),s="[object Symbol]"
e.exports=r},function(e,t,n){var r=n(130),o=/^\./,i=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,s=/\\(\\)?/g,a=r(function(e){var t=[]
return o.test(e)&&t.push(""),e.replace(i,function(e,n,r,o){t.push(r?o.replace(s,"$1"):n||e)}),t})
e.exports=a},function(e,t,n){function r(e){var t=o(e,function(e){return n.size===i&&n.clear(),e}),n=t.cache
return t}var o=n(131),i=500
e.exports=r},function(e,t,n){function r(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError(i)
var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],i=n.cache
if(i.has(o))return i.get(o)
var s=e.apply(this,r)
return n.cache=i.set(o,s)||i,s}
return n.cache=new(r.Cache||o),n}var o=n(67),i="Expected a function"
r.Cache=o,e.exports=r},function(e,t,n){function r(e){return null==e?"":o(e)}var o=n(133)
e.exports=r},function(e,t,n){function r(e){if("string"==typeof e)return e
if(s(e))return i(e,r)+""
if(a(e))return p?p.call(e):""
var t=e+""
return"0"==t&&1/e==-l?"-0":t}var o=n(57),i=n(34),s=n(101),a=n(128),l=1/0,u=o?o.prototype:void 0,p=u?u.toString:void 0
e.exports=r},function(e,t,n){function r(e){if("string"==typeof e||o(e))return e
var t=e+""
return"0"==t&&1/e==-i?"-0":t}var o=n(128),i=1/0
e.exports=r},function(e,t,n){function r(e,t){return null!=e&&i(e,t,o)}var o=n(136),i=n(137)
e.exports=r},function(e,t){function n(e,t){return null!=e&&t in Object(e)}e.exports=n},function(e,t,n){function r(e,t,n){t=o(t,e)
for(var r=-1,p=t.length,d=!1;++r<p;){var c=u(t[r])
if(!(d=null!=e&&n(e,c)))break
e=e[c]}return d||++r!=p?d:(p=null==e?0:e.length,!!p&&l(p)&&a(c,p)&&(s(e)||i(e)))}var o=n(126),i=n(98),s=n(101),a=n(104),l=n(107),u=n(134)
e.exports=r},function(e,t){function n(e){return e}e.exports=n},function(e,t,n){function r(e){return s(e)?o(a(e)):i(e)}var o=n(140),i=n(141),s=n(127),a=n(134)
e.exports=r},function(e,t){function n(e){return function(t){return null==t?void 0:t[e]}}e.exports=n},function(e,t,n){function r(e){return function(t){return o(t,e)}}var o=n(125)
e.exports=r},function(e,t,n){function r(e,t){var n=-1,r=i(e)?Array(e.length):[]
return o(e,function(e,o,i){r[++n]=t(e,o,i)}),r}var o=n(143),i=n(114)
e.exports=r},function(e,t,n){var r=n(144),o=n(147),i=o(r)
e.exports=i},function(e,t,n){function r(e,t){return e&&o(e,t,i)}var o=n(145),i=n(95)
e.exports=r},function(e,t,n){var r=n(146),o=r()
e.exports=o},function(e,t){function n(e){return function(t,n,r){for(var o=-1,i=Object(t),s=r(t),a=s.length;a--;){var l=s[e?a:++o]
if(n(i[l],l,i)===!1)break}return t}}e.exports=n},function(e,t,n){function r(e,t){return function(n,r){if(null==n)return n
if(!o(n))return e(n,r)
for(var i=n.length,s=t?i:-1,a=Object(n);(t?s--:++s<i)&&r(a[s],s,a)!==!1;);return n}}var o=n(114)
e.exports=r},function(e,t,n){function r(e,t){var n=a(e)?o:i
return n(e,s(t,3))}var o=n(149),i=n(150),s=n(35),a=n(101)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=0,i=[];++n<r;){var s=e[n]
t(s,n,e)&&(i[o++]=s)}return i}e.exports=n},function(e,t,n){function r(e,t){var n=[]
return o(e,function(e,r,o){t(e,r,o)&&n.push(e)}),n}var o=n(143)
e.exports=r},function(e,t,n){var r=n(152),o=n(153),i=r(o)
e.exports=i},function(e,t,n){function r(e){return function(t,n,r){var a=Object(t)
if(!i(t)){var l=o(n,3)
t=s(t),n=function(e){return l(a[e],e,a)}}var u=e(t,n,r)
return u>-1?a[l?t[u]:u]:void 0}}var o=n(35),i=n(114),s=n(95)
e.exports=r},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
if(!r)return-1
var l=null==n?0:s(n)
return l<0&&(l=a(r+l,0)),o(e,i(t,3),l)}var o=n(154),i=n(35),s=n(155),a=Math.max
e.exports=r},function(e,t){function n(e,t,n,r){for(var o=e.length,i=n+(r?1:-1);r?i--:++i<o;)if(t(e[i],i,e))return i
return-1}e.exports=n},function(e,t,n){function r(e){var t=o(e),n=t%1
return t===t?n?t-n:t:0}var o=n(156)
e.exports=r},function(e,t,n){function r(e){if(!e)return 0===e?e:0
if(e=o(e),e===i||e===-i){var t=e<0?-1:1
return t*s}return e===e?e:0}var o=n(157),i=1/0,s=1.7976931348623157e308
e.exports=r},function(e,t,n){function r(e){if("number"==typeof e)return e
if(i(e))return s
if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e
e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e
e=e.replace(a,"")
var n=u.test(e)
return n||p.test(e)?d(e.slice(2),n?2:8):l.test(e)?s:+e}var o=n(62),i=n(128),s=NaN,a=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,u=/^0b[01]+$/i,p=/^0o[0-7]+$/i,d=parseInt
e.exports=r},function(e,t,n){var r=n(159),o=n(162),i=n(166),s=n(174),a=i(function(e,t){if(null==e)return[]
var n=t.length
return n>1&&s(e,t[0],t[1])?t=[]:n>2&&s(t[0],t[1],t[2])&&(t=[t[0]]),o(e,r(t,1),[])})
e.exports=a},function(e,t,n){function r(e,t,n,s,a){var l=-1,u=e.length
for(n||(n=i),a||(a=[]);++l<u;){var p=e[l]
t>0&&n(p)?t>1?r(p,t-1,n,s,a):o(a,p):s||(a[a.length]=p)}return a}var o=n(160),i=n(161)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n]
return e}e.exports=n},function(e,t,n){function r(e){return s(e)||i(e)||!!(a&&e&&e[a])}var o=n(57),i=n(98),s=n(101),a=o?o.isConcatSpreadable:void 0
e.exports=r},function(e,t,n){function r(e,t,n){var r=-1
t=o(t.length?t:[p],l(i))
var d=s(e,function(e,n,i){var s=o(t,function(t){return t(e)})
return{criteria:s,index:++r,value:e}})
return a(d,function(e,t){return u(e,t,n)})}var o=n(34),i=n(35),s=n(142),a=n(163),l=n(108),u=n(164),p=n(138)
e.exports=r},function(e,t){function n(e,t){var n=e.length
for(e.sort(t);n--;)e[n]=e[n].value
return e}e.exports=n},function(e,t,n){function r(e,t,n){for(var r=-1,i=e.criteria,s=t.criteria,a=i.length,l=n.length;++r<a;){var u=o(i[r],s[r])
if(u){if(r>=l)return u
var p=n[r]
return u*("desc"==p?-1:1)}}return e.index-t.index}var o=n(165)
e.exports=r},function(e,t,n){function r(e,t){if(e!==t){var n=void 0!==e,r=null===e,i=e===e,s=o(e),a=void 0!==t,l=null===t,u=t===t,p=o(t)
if(!l&&!p&&!s&&e>t||s&&a&&u&&!l&&!p||r&&a&&u||!n&&u||!i)return 1
if(!r&&!s&&!p&&e<t||p&&n&&i&&!r&&!s||l&&n&&i||!a&&i||!u)return-1}return 0}var o=n(128)
e.exports=r},function(e,t,n){function r(e,t){return s(i(e,t,o),e+"")}var o=n(138),i=n(167),s=n(169)
e.exports=r},function(e,t,n){function r(e,t,n){return t=i(void 0===t?e.length-1:t,0),function(){for(var r=arguments,s=-1,a=i(r.length-t,0),l=Array(a);++s<a;)l[s]=r[t+s]
s=-1
for(var u=Array(t+1);++s<t;)u[s]=r[s]
return u[t]=n(l),o(e,this,u)}}var o=n(168),i=Math.max
e.exports=r},function(e,t){function n(e,t,n){switch(n.length){case 0:return e.call(t)
case 1:return e.call(t,n[0])
case 2:return e.call(t,n[0],n[1])
case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.exports=n},function(e,t,n){var r=n(170),o=n(173),i=o(r)
e.exports=i},function(e,t,n){var r=n(171),o=n(172),i=n(138),s=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:i
e.exports=s},function(e,t){function n(e){return function(){return e}}e.exports=n},function(e,t,n){var r=n(53),o=function(){try{var e=r(Object,"defineProperty")
return e({},"",{}),e}catch(t){}}()
e.exports=o},function(e,t){function n(e){var t=0,n=0
return function(){var s=i(),a=o-(s-n)
if(n=s,a>0){if(++t>=r)return arguments[0]}else t=0
return e.apply(void 0,arguments)}}var r=800,o=16,i=Date.now
e.exports=n},function(e,t,n){function r(e,t,n){if(!a(n))return!1
var r=typeof t
return!!("number"==r?i(n)&&s(t,n.length):"string"==r&&t in n)&&o(n[t],e)}var o=n(43),i=n(114),s=n(104),a=n(62)
e.exports=r},function(e,t,n){var r=n(176),o=n(159),i=n(166),s=n(182),a=i(function(e,t){return s(e)?r(e,o(t,1,s,!0)):[]})
e.exports=a},function(e,t,n){function r(e,t,n,r){var d=-1,c=i,f=!0,h=e.length,m=[],g=t.length
if(!h)return m
n&&(t=a(t,l(n))),r?(c=s,f=!1):t.length>=p&&(c=u,f=!1,t=new o(t))
e:for(;++d<h;){var y=e[d],v=null==n?y:n(y)
if(y=r||0!==y?y:0,f&&v===v){for(var b=g;b--;)if(t[b]===v)continue e
m.push(y)}else c(t,v,r)||m.push(y)}return m}var o=n(85),i=n(177),s=n(181),a=n(34),l=n(108),u=n(89),p=200
e.exports=r},function(e,t,n){function r(e,t){var n=null==e?0:e.length
return!!n&&o(e,t,0)>-1}var o=n(178)
e.exports=r},function(e,t,n){function r(e,t,n){return t===t?s(e,t,n):o(e,i,n)}var o=n(154),i=n(179),s=n(180)
e.exports=r},function(e,t){function n(e){return e!==e}e.exports=n},function(e,t){function n(e,t,n){for(var r=n-1,o=e.length;++r<o;)if(e[r]===t)return r
return-1}e.exports=n},function(e,t){function n(e,t,n){for(var r=-1,o=null==e?0:e.length;++r<o;)if(n(t,e[r]))return!0
return!1}e.exports=n},function(e,t,n){function r(e){return i(e)&&o(e)}var o=n(114),i=n(100)
e.exports=r},function(e,t,n){var r=n(184),o=n(186),i=n(187),s=n(114),a=n(111),l=n(95),u=Object.prototype,p=u.hasOwnProperty,d=i(function(e,t){if(a(t)||s(t))return void o(t,l(t),e)
for(var n in t)p.call(t,n)&&r(e,n,t[n])})
e.exports=d},function(e,t,n){function r(e,t,n){var r=e[t]
a.call(e,t)&&i(r,n)&&(void 0!==n||t in e)||o(e,t,n)}var o=n(185),i=n(43),s=Object.prototype,a=s.hasOwnProperty
e.exports=r},function(e,t,n){function r(e,t,n){"__proto__"==t&&o?o(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}var o=n(172)
e.exports=r},function(e,t,n){function r(e,t,n,r){var s=!n
n||(n={})
for(var a=-1,l=t.length;++a<l;){var u=t[a],p=r?r(n[u],e[u],u,n,e):void 0
void 0===p&&(p=e[u]),s?i(n,u,p):o(n,u,p)}return n}var o=n(184),i=n(185)
e.exports=r},function(e,t,n){function r(e){return o(function(t,n){var r=-1,o=n.length,s=o>1?n[o-1]:void 0,a=o>2?n[2]:void 0
for(s=e.length>3&&"function"==typeof s?(o--,s):void 0,a&&i(n[0],n[1],a)&&(s=o<3?void 0:s,o=1),t=Object(t);++r<o;){var l=n[r]
l&&e(t,l,r,s)}return t})}var o=n(166),i=n(174)
e.exports=r},function(e,t,n){"use strict"
var r=n(3),o=n(32),i=n(189),s=r.createClass({displayName:"GridRowContainer",getDefaultProps:function a(){return{useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,columnSettings:null,rowSettings:null,
paddingHeight:null,rowHeight:null,parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",parentRowCollapsedComponent:"▶",parentRowExpandedComponent:"▼",onRowClick:null,
multipleSelectionSettings:null}},getInitialState:function l(){return{data:{},showChildren:!1}},componentWillReceiveProps:function u(){this.setShowChildren(!1)},toggleChildren:function p(){this.setShowChildren(this.state.showChildren===!1)

},setShowChildren:function d(e){this.setState({showChildren:e})},verifyProps:function c(){null===this.props.columnSettings&&console.error("gridRowContainer: The columnSettings prop is null and it shouldn't be")

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
e.exports=s},function(e,t,n){var r=n(190),o=n(193),i=o(function(e,t){return null==e?{}:r(e,t)})
e.exports=i},function(e,t,n){function r(e,t){return e=Object(e),o(e,t,function(t,n){return i(e,n)})}var o=n(191),i=n(135)
e.exports=r},function(e,t,n){function r(e,t,n){for(var r=-1,a=t.length,l={};++r<a;){var u=t[r],p=o(e,u)
n(p,u)&&i(l,s(u,e),p)}return l}var o=n(125),i=n(192),s=n(126)
e.exports=r},function(e,t,n){function r(e,t,n,r){if(!a(e))return e
t=i(t,e)
for(var u=-1,p=t.length,d=p-1,c=e;null!=c&&++u<p;){var f=l(t[u]),h=n
if(u!=d){var m=c[f]
h=r?r(m,f,c):void 0,void 0===h&&(h=a(m)?m:s(t[u+1])?[]:{})}o(c,f,h),c=c[f]}return e}var o=n(184),i=n(126),s=n(104),a=n(62),l=n(134)
e.exports=r},function(e,t,n){function r(e){return s(i(e,void 0,o),e+"")}var o=n(194),i=n(167),s=n(169)
e.exports=r},function(e,t,n){function r(e){var t=null==e?0:e.length
return t?o(e,1):[]}var o=n(159)
e.exports=r},function(e,t,n){"use strict"
function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(196),s=function(){function e(){
var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=arguments.length<=1||void 0===arguments[1]?null:arguments[1],o=!(arguments.length<=2||void 0===arguments[2])&&arguments[2]
r(this,e),this.rowMetadata=t,this.rowComponent=n,this.isCustom=o}return o(e,[{key:"getRowKey",value:function t(e,n){var r
return r=this.hasRowMetadataKey()?e[this.rowMetadata.key]:i("grid_row")}},{key:"hasRowMetadataKey",value:function n(){return this.hasRowMetadata()&&null!==this.rowMetadata.key&&void 0!==this.rowMetadata.key

}},{key:"getBodyRowMetadataClass",value:function s(e){return this.hasRowMetadata()&&null!==this.rowMetadata.bodyCssClassName&&void 0!==this.rowMetadata.bodyCssClassName?"function"==typeof this.rowMetadata.bodyCssClassName?this.rowMetadata.bodyCssClassName(e):this.rowMetadata.bodyCssClassName:null

}},{key:"getHeaderRowMetadataClass",value:function a(){return this.hasRowMetadata()&&null!==this.rowMetadata.headerCssClassName&&void 0!==this.rowMetadata.headerCssClassName?this.rowMetadata.headerCssClassName:null

}},{key:"hasRowMetadata",value:function l(){return null!==this.rowMetadata}}]),e}()
e.exports=s},function(e,t,n){function r(e){var t=++i
return o(e)+t}var o=n(132),i=0
e.exports=r},function(e,t,n){"use strict"
var r=n(3),o=r.createClass({displayName:"GridFilter",getDefaultProps:function i(){return{placeholderText:""}},handleChange:function s(e){this.props.changeFilter(e.target.value)},render:function a(){return r.createElement("div",{
className:"filter-container"},r.createElement("input",{type:"text",name:"filter",placeholder:this.props.placeholderText,className:"form-control",onChange:this.handleChange}))}})
e.exports=o},function(e,t,n){"use strict"
var r=n(3),o=n(183),i=r.createClass({displayName:"GridPagination",getDefaultProps:function s(){return{maxPage:0,nextText:"",previousText:"",currentPage:0,useGriddleStyles:!0,nextClassName:"griddle-next",
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
var r=n(3),o=n(200),i=n(204),s=n(151),a=r.createClass({displayName:"GridSettings",getDefaultProps:function l(){return{columns:[],columnMetadata:[],selectedColumns:[],settingsText:"",maxRowsText:"",resultsPerPage:0,
enableToggleCustom:!1,useCustomComponent:!1,useGriddleStyles:!0,toggleCustomComponent:function e(){}}},setPageSize:function u(e){var t=parseInt(e.target.value,10)
this.props.setPageSize(t)},handleChange:function p(e){var t=e.target.dataset?e.target.dataset.name:e.target.getAttribute("data-name")
e.target.checked===!0&&o(this.props.selectedColumns,t)===!1?(this.props.selectedColumns.push(t),this.props.setColumns(this.props.selectedColumns)):this.props.setColumns(i(this.props.selectedColumns,t))

},render:function d(){var e=this,t=[]
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
return n<0&&(n=u(p+n,0)),s(e)?n<=p&&e.indexOf(t,n)>-1:!!p&&o(e,t,n)>-1}var o=n(178),i=n(114),s=n(201),a=n(155),l=n(202),u=Math.max
e.exports=r},function(e,t,n){function r(e){return"string"==typeof e||!i(e)&&s(e)&&o(e)==a}var o=n(56),i=n(101),s=n(100),a="[object String]"
e.exports=r},function(e,t,n){function r(e){return null==e?[]:o(e,i(e))}var o=n(203),i=n(95)
e.exports=r},function(e,t,n){function r(e,t){return o(t,function(t){return e[t]})}var o=n(34)
e.exports=r},function(e,t,n){var r=n(176),o=n(166),i=n(182),s=o(function(e,t){return i(e)?r(e,t):[]})
e.exports=s},function(e,t,n){"use strict"
var r=n(3),o=r.createClass({displayName:"GridNoData",getDefaultProps:function i(){return{noDataMessage:"No Data"}},render:function s(){var e=this
return r.createElement("div",null,this.props.noDataMessage)}})
e.exports=o},function(e,t,n){"use strict"
var r=n(3),o=n(32),i=n(207),s=n(55),a=n(211),l=n(183),u=n(213),p=n(219),d=n(204),c=r.createClass({displayName:"GridRow",getDefaultProps:function f(){return{isChildRow:!1,showChildren:!1,data:{},columnSettings:null,
rowSettings:null,hasChildren:!1,useGriddleStyles:!0,useGriddleIcons:!0,isSubGriddle:!1,paddingHeight:null,rowHeight:null,parentRowCollapsedClassName:"parent-row",parentRowExpandedClassName:"parent-row expanded",
parentRowCollapsedComponent:"▶",parentRowExpandedComponent:"▼",onRowClick:null,multipleSelectionSettings:null}},handleClick:function h(e){null!==this.props.onRowClick&&s(this.props.onRowClick)?this.props.onRowClick(this,e):this.props.hasChildren&&this.props.toggleChildren()

},handleSelectionChange:function m(e){},handleSelectClick:function g(e){this.props.multipleSelectionSettings.isMultipleSelection&&("checkbox"===e.target.type?this.props.multipleSelectionSettings.toggleSelectRow(this.props.data,this.refs.selected.checked):this.props.multipleSelectionSettings.toggleSelectRow(this.props.data,!this.refs.selected.checked))

},verifyProps:function y(){null===this.props.columnSettings&&console.error("gridRow: The columnSettings prop is null and it shouldn't be")},formatData:function v(e){return"boolean"==typeof e?String(e):e

},render:function b(){var e=this
this.verifyProps()
var t=this,n=null
this.props.useGriddleStyles&&(n={margin:"0px",padding:t.props.paddingHeight+"px 5px "+t.props.paddingHeight+"px 5px",height:t.props.rowHeight?this.props.rowHeight-2*t.props.paddingHeight+"px":null,backgroundColor:"#FFF",
borderTopColor:"#DDD",color:"#222"})
var o=this.props.columnSettings.getColumns(),c=a(o,[]),f=l({},this.props.data)
u(f,c)
var h=p(i.pick(f,d(o,"children"))),m=h.map(function(t,o){var i=null,s=e.props.columnSettings.getColumnMetadataByName(t[0]),a=0===o&&e.props.hasChildren&&e.props.showChildren===!1&&e.props.useGriddleIcons?r.createElement("span",{
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
e.exports=c},function(e,t,n){"use strict"
function r(e){for(var t=/\[("|')(.+)\1\]|([^.\[\]]+)/g,n=[],r;null!==(r=t.exec(e));)n.push(r[2]||r[3])
return n}function o(e,t){if("string"==typeof t){if(void 0!==e[t])return e[t]
t=r(t)}for(var n=-1,o=t.length;++n<o&&null!=e;)e=e[t[n]]
return n===o?e:void 0}function i(e,t){var n={},r=e,i
i=function(e,t){return e in t},r=Object(r)
for(var s=0,a=t.length;s<a;s++){var l=t[s]
i(l,r)&&(n[l]=o(r,l))}return n}function s(e,t){var n=[]
return a(e,function(e,r){var o=t?t+"."+r:r
!l(e)||u(e)||p(e)?n.push(o):n=n.concat(s(e,o))}),n}var a=n(208),l=n(62),u=n(101),p=n(55)
e.exports={pick:i,getAt:o,keys:s}},function(e,t,n){function r(e,t){var n=a(e)?o:i
return n(e,s(t))}var o=n(209),i=n(143),s=n(210),a=n(101)
e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&t(e[n],n,e)!==!1;);return e}e.exports=n},function(e,t,n){function r(e){return"function"==typeof e?e:o}var o=n(138)
e.exports=r},function(e,t,n){function r(e,t){return i(e||[],t||[],o)}var o=n(184),i=n(212)
e.exports=r},function(e,t){function n(e,t,n){for(var r=-1,o=e.length,i=t.length,s={};++r<o;){var a=r<i?t[r]:void 0
n(s,e[r],a)}return s}e.exports=n},function(e,t,n){var r=n(168),o=n(214),i=n(215),s=n(166),a=s(function(e){return e.push(void 0,o),r(i,void 0,e)})
e.exports=a},function(e,t,n){function r(e,t,n,r){return void 0===e||o(e,i[n])&&!s.call(r,n)?t:e}var o=n(43),i=Object.prototype,s=i.hasOwnProperty
e.exports=r},function(e,t,n){var r=n(186),o=n(187),i=n(216),s=o(function(e,t,n,o){r(t,i(t),e,o)})
e.exports=s},function(e,t,n){function r(e){return s(e)?o(e,!0):i(e)}var o=n(96),i=n(217),s=n(114)
e.exports=r},function(e,t,n){function r(e){if(!o(e))return s(e)
var t=i(e),n=[]
for(var r in e)("constructor"!=r||!t&&l.call(e,r))&&n.push(r)
return n}var o=n(62),i=n(111),s=n(218),a=Object.prototype,l=a.hasOwnProperty
e.exports=r},function(e,t){function n(e){var t=[]
if(null!=e)for(var n in Object(e))t.push(n)
return t}e.exports=n},function(e,t,n){var r=n(220),o=n(95),i=r(o)
e.exports=i},function(e,t,n){function r(e){return function(t){var n=i(t)
return n==l?s(t):n==u?a(t):o(t,e(t))}}var o=n(221),i=n(115),s=n(92),a=n(222),l="[object Map]",u="[object Set]"
e.exports=r},function(e,t,n){function r(e,t){return o(t,function(t){return[t,e[t]]})}var o=n(34)
e.exports=r},function(e,t){function n(e){var t=-1,n=Array(e.size)
return e.forEach(function(e){n[++t]=[e,e]}),n}e.exports=n},function(e,t,n){"use strict"
var r=n(3),o=r.createClass({displayName:"CustomRowComponentContainer",getDefaultProps:function i(){return{data:[],metadataColumns:[],className:"",customComponent:{},globalData:{}}},render:function s(){
var e=this
if("function"!=typeof e.props.customComponent)return console.log("Couldn't find valid template."),r.createElement("div",{className:this.props.className})
var t=this.props.data.map(function(t,n){return r.createElement(e.props.customComponent,{data:t,metadataColumns:e.props.metadataColumns,key:n,globalData:e.props.globalData})}),n=this.props.showPager&&this.props.pagingContent


return r.createElement("div",{className:this.props.className,style:this.props.style},t)}})
e.exports=o},function(e,t,n){"use strict"
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(3),i=o.createClass({displayName:"CustomPaginationContainer",getDefaultProps:function s(){return{maxPage:0,nextText:"",
previousText:"",currentPage:0,customPagerComponent:{},customPagerComponentOptions:{}}},render:function a(){var e=this
return"function"!=typeof e.props.customPagerComponent?(console.log("Couldn't find valid template."),o.createElement("div",null)):o.createElement(e.props.customPagerComponent,r({},this.props.customPagerComponentOptions,{
maxPage:this.props.maxPage,nextText:this.props.nextText,previousText:this.props.previousText,currentPage:this.props.currentPage,setPage:this.props.setPage,previous:this.props.previous,next:this.props.next
}))}})
e.exports=i},function(e,t,n){"use strict"
var r=n(3),o=r.createClass({displayName:"CustomFilterContainer",getDefaultProps:function i(){return{placeholderText:""}},render:function s(){var e=this
return"function"!=typeof e.props.customFilterComponent?(console.log("Couldn't find valid template."),r.createElement("div",null)):r.createElement(e.props.customFilterComponent,{changeFilter:this.props.changeFilter,
results:this.props.results,currentResults:this.props.currentResults,placeholderText:this.props.placeholderText})}})
e.exports=o},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
return r?(t=n||void 0===t?1:i(t),o(e,t<0?0:t,r)):[]}var o=n(227),i=n(155)
e.exports=r},function(e,t){function n(e,t,n){var r=-1,o=e.length
t<0&&(t=-t>o?0:o+t),n=n>o?o:n,n<0&&(n+=o),o=t>n?0:n-t>>>0,t>>>=0
for(var i=Array(o);++r<o;)i[r]=e[r+t]
return i}e.exports=n},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length
return r?(t=n||void 0===t?1:i(t),t=r-t,o(e,0,t<0?0:t)):[]}var o=n(227),i=n(155)
e.exports=r},function(e,t,n){function r(e,t,n){return e&&e.length?(t=n||void 0===t?1:i(t),o(e,0,t<0?0:t)):[]}var o=n(227),i=n(155)
e.exports=r},function(e,t,n){function r(e){var t=null==e?0:e.length
return t?o(e,0,-1):[]}var o=n(227)
e.exports=r},function(e,t,n){var r=n(34),o=n(232),i=n(166),s=n(233),a=i(function(e){var t=r(e,s)
return t.length&&t[0]===e[0]?o(t):[]})
e.exports=a},function(e,t,n){function r(e,t,n){for(var r=n?s:i,d=e[0].length,c=e.length,f=c,h=Array(c),m=1/0,g=[];f--;){var y=e[f]
f&&t&&(y=a(y,l(t))),m=p(y.length,m),h[f]=!n&&(t||d>=120&&y.length>=120)?new o(f&&y):void 0}y=e[0]
var v=-1,b=h[0]
e:for(;++v<d&&g.length<m;){var C=y[v],E=t?t(C):C
if(C=n||0!==C?C:0,!(b?u(b,E):r(g,E,n))){for(f=c;--f;){var _=h[f]
if(!(_?u(_,E):r(e[f],E,n)))continue e}b&&b.push(E),g.push(C)}}return g}var o=n(85),i=n(177),s=n(181),a=n(34),l=n(108),u=n(89),p=Math.min
e.exports=r},function(e,t,n){function r(e){return o(e)?e:[]}var o=n(182)
e.exports=r},function(e,t,n){function r(e){if(null==e)return!0
if(l(e)&&(a(e)||"string"==typeof e||"function"==typeof e.splice||u(e)||d(e)||s(e)))return!e.length
var t=i(e)
if(t==c||t==f)return!e.size
if(p(e))return!o(e).length
for(var n in e)if(m.call(e,n))return!1
return!0}var o=n(110),i=n(115),s=n(98),a=n(101),l=n(114),u=n(102),p=n(111),d=n(105),c="[object Map]",f="[object Set]",h=Object.prototype,m=h.hasOwnProperty
e.exports=r},function(e,t){function n(e){return null===e}e.exports=n},function(e,t){function n(e){return void 0===e}e.exports=n},function(e,t,n){var r=n(34),o=n(238),i=n(266),s=n(126),a=n(186),l=n(193),u=n(251),p=1,d=2,c=4,f=l(function(e,t){
var n={}
if(null==e)return n
var l=!1
t=r(t,function(t){return t=s(t,e),l||(l=t.length>1),t}),a(e,u(e),n),l&&(n=o(n,p|d|c))
for(var f=t.length;f--;)i(n,t[f])
return n})
e.exports=f},function(e,t,n){function r(e,t,n,F,I,T){var A,k=t&S,R=t&w,L=t&P
if(n&&(A=I?n(e,F,I,T):n(e)),void 0!==A)return A
if(!E(e))return e
var U=b(e)
if(U){if(A=g(e),!k)return p(e,A)}else{var j=m(e),M=j==O||j==D
if(C(e))return u(e,k)
if(j==N||j==x||M&&!I){if(A=R||M?{}:v(e),!k)return R?c(e,l(A,e)):d(e,a(A,e))}else{if(!X[j])return I?e:{}
A=y(e,j,r,k)}}T||(T=new o)
var H=T.get(e)
if(H)return H
T.set(e,A)
var B=L?R?h:f:R?keysIn:_,z=U?void 0:B(e)
return i(z||e,function(o,i){z&&(i=o,o=e[i]),s(A,i,r(o,t,n,i,e,T))}),A}var o=n(38),i=n(209),s=n(184),a=n(239),l=n(240),u=n(241),p=n(242),d=n(243),c=n(246),f=n(249),h=n(251),m=n(115),g=n(252),y=n(253),v=n(264),b=n(101),C=n(102),E=n(62),_=n(95),S=1,w=2,P=4,x="[object Arguments]",F="[object Array]",I="[object Boolean]",T="[object Date]",A="[object Error]",O="[object Function]",D="[object GeneratorFunction]",k="[object Map]",R="[object Number]",N="[object Object]",L="[object RegExp]",U="[object Set]",j="[object String]",M="[object Symbol]",H="[object WeakMap]",B="[object ArrayBuffer]",z="[object DataView]",G="[object Float32Array]",q="[object Float64Array]",V="[object Int8Array]",W="[object Int16Array]",Q="[object Int32Array]",K="[object Uint8Array]",$="[object Uint8ClampedArray]",Z="[object Uint16Array]",Y="[object Uint32Array]",X={}


X[x]=X[F]=X[B]=X[z]=X[I]=X[T]=X[G]=X[q]=X[V]=X[W]=X[Q]=X[k]=X[R]=X[N]=X[L]=X[U]=X[j]=X[M]=X[K]=X[$]=X[Z]=X[Y]=!0,X[A]=X[O]=X[H]=!1,e.exports=r},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(186),i=n(95)


e.exports=r},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(186),i=n(216)
e.exports=r},function(e,t,n){(function(e){function r(e,t){if(t)return e.slice()
var n=e.length,r=u?u(n):new e.constructor(n)
return e.copy(r),r}var o=n(58),i="object"==typeof t&&t&&!t.nodeType&&t,s=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=s&&s.exports===i,l=a?o.Buffer:void 0,u=l?l.allocUnsafe:void 0
e.exports=r}).call(t,n(24)(e))},function(e,t){function n(e,t){var n=-1,r=e.length
for(t||(t=Array(r));++n<r;)t[n]=e[n]
return t}e.exports=n},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(186),i=n(244)
e.exports=r},function(e,t,n){var r=n(113),o=n(245),i=Object.getOwnPropertySymbols,s=i?r(i,Object):o
e.exports=s},function(e,t){function n(){return[]}e.exports=n},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(186),i=n(247)
e.exports=r},function(e,t,n){var r=n(160),o=n(248),i=n(244),s=n(245),a=Object.getOwnPropertySymbols,l=a?function(e){for(var t=[];e;)r(t,i(e)),e=o(e)
return t}:s
e.exports=l},function(e,t,n){var r=n(113),o=r(Object.getPrototypeOf,Object)
e.exports=o},function(e,t,n){function r(e){return o(e,s,i)}var o=n(250),i=n(244),s=n(95)
e.exports=r},function(e,t,n){function r(e,t,n){var r=t(e)
return i(e)?r:o(r,n(e))}var o=n(160),i=n(101)
e.exports=r},function(e,t,n){function r(e){return o(e,s,i)}var o=n(250),i=n(247),s=n(216)
e.exports=r},function(e,t){function n(e){var t=e.length,n=e.constructor(t)
return t&&"string"==typeof e[0]&&o.call(e,"index")&&(n.index=e.index,n.input=e.input),n}var r=Object.prototype,o=r.hasOwnProperty
e.exports=n},function(e,t,n){function r(e,t,n,r){var A=e.constructor
switch(t){case b:return o(e)
case d:case c:return new A((+e))
case C:return i(e,r)
case E:case _:case S:case w:case P:case x:case F:case I:case T:return p(e,r)
case f:return s(e,r,n)
case h:case y:return new A(e)
case m:return a(e)
case g:return l(e,r,n)
case v:return u(e)}}var o=n(254),i=n(255),s=n(256),a=n(259),l=n(260),u=n(262),p=n(263),d="[object Boolean]",c="[object Date]",f="[object Map]",h="[object Number]",m="[object RegExp]",g="[object Set]",y="[object String]",v="[object Symbol]",b="[object ArrayBuffer]",C="[object DataView]",E="[object Float32Array]",_="[object Float64Array]",S="[object Int8Array]",w="[object Int16Array]",P="[object Int32Array]",x="[object Uint8Array]",F="[object Uint8ClampedArray]",I="[object Uint16Array]",T="[object Uint32Array]"


e.exports=r},function(e,t,n){function r(e){var t=new e.constructor(e.byteLength)
return new o(t).set(new o(e)),t}var o=n(91)
e.exports=r},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer
return new e.constructor(n,e.byteOffset,e.byteLength)}var o=n(254)
e.exports=r},function(e,t,n){function r(e,t,n){var r=t?n(s(e),a):s(e)
return i(r,o,new e.constructor)}var o=n(257),i=n(258),s=n(92),a=1
e.exports=r},function(e,t){function n(e,t){return e.set(t[0],t[1]),e}e.exports=n},function(e,t){function n(e,t,n,r){var o=-1,i=null==e?0:e.length
for(r&&i&&(n=e[++o]);++o<i;)n=t(n,e[o],o,e)
return n}e.exports=n},function(e,t){function n(e){var t=new e.constructor(e.source,r.exec(e))
return t.lastIndex=e.lastIndex,t}var r=/\w*$/
e.exports=n},function(e,t,n){function r(e,t,n){var r=t?n(s(e),a):s(e)
return i(r,o,new e.constructor)}var o=n(261),i=n(258),s=n(93),a=1
e.exports=r},function(e,t){function n(e,t){return e.add(t),e}e.exports=n},function(e,t,n){function r(e){return s?Object(s.call(e)):{}}var o=n(57),i=o?o.prototype:void 0,s=i?i.valueOf:void 0
e.exports=r},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer
return new e.constructor(n,e.byteOffset,e.length)}var o=n(254)
e.exports=r},function(e,t,n){function r(e){return"function"!=typeof e.constructor||s(e)?{}:o(i(e))}var o=n(265),i=n(248),s=n(111)
e.exports=r},function(e,t,n){var r=n(62),o=Object.create,i=function(){function e(){}return function(t){if(!r(t))return{}
if(o)return o(t)
e.prototype=t
var n=new e
return e.prototype=void 0,n}}()
e.exports=i},function(e,t,n){function r(e,t){return t=o(t,e),e=s(e,t),null==e||delete e[a(i(t))]}var o=n(126),i=n(267),s=n(268),a=n(134)
e.exports=r},function(e,t){function n(e){var t=null==e?0:e.length
return t?e[t-1]:void 0}e.exports=n},function(e,t,n){function r(e,t){return t.length<2?e:o(e,i(t,0,-1))}var o=n(125),i=n(227)
e.exports=r},function(e,t,n){function r(e,t,n,r){return null==e?[]:(i(t)||(t=null==t?[]:[t]),n=r?void 0:n,i(n)||(n=null==n?[]:[n]),o(e,t,n))}var o=n(162),i=n(101)
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
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(3),p=r(u),d=n(29),c=r(d),f=n(9),h=r(f),m=n(17),g=n(271),y=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.getColumns=n.getColumns.bind(n),n.handleSort=n.handleSort.bind(n),n.handleSetPage=n.handleSetPage.bind(n),n.handleRowClick=n.handleRowClick.bind(n),n.renderSelect=n.renderSelect.bind(n),n.renderTitle=n.renderTitle.bind(n),
n.state={enableSort:!1},n}return s(t,e),l(t,[{key:"componentDidMount",value:function n(){this.setState({enableSort:!0})}},{key:"componentWillUnmount",value:function r(){this.setState({enableSort:!1})}},{
key:"getColumns",value:function u(){var e=["thumbnail","title","size","lastUpdated"]
return this.props.selectableItems&&e.unshift("selected"),e}},{key:"getColumnConfig",value:function d(){return[{columnName:"selected",sortable:!1,displayName:"",cssClassName:"gallery__table-column--select",
customComponent:this.renderSelect},{columnName:"thumbnail",sortable:!1,displayName:"",cssClassName:"gallery__table-column--image",customComponent:this.renderThumbnail},{columnName:"title",customCompareFn:function e(){
return 0},cssClassName:"gallery__table-column--title",customComponent:this.renderTitle},{columnName:"lastUpdated",displayName:"Modified",customComponent:this.renderDate},{columnName:"size",displayName:"Size",
customComponent:this.renderSize}]}},{key:"getTableProps",value:function f(){var e=this.props.sort.split(","),t=a(e,2),n=t[0],r=t[1]
return{tableClassName:"gallery__table table table-hover",gridClassName:"gallery__main-view--table",rowMetadata:{bodyCssClassName:"gallery__table-row"},sortAscendingComponent:"",sortDescendingComponent:"",
useExternal:!0,externalSetPage:this.handleSetPage,externalChangeSort:this.handleSort,externalSetFilter:function o(){return null},externalSetPageSize:function i(){return null},externalCurrentPage:this.props.page,
externalMaxPage:Math.ceil(this.props.count/this.props.limit),externalSortColumn:n,externalSortAscending:this.state.enableSort?"asc"===r:"asc"!==r,initialSort:n,columns:this.getColumns(),columnMetadata:this.getColumnConfig(),
useGriddleStyles:!1,onRowClick:this.handleRowClick,results:this.props.files,customNoDataComponent:this.props.renderNoItemsNotice}}},{key:"handleActivate",value:function m(e,t){"folder"===t.type?this.props.onOpenFolder(e,t):this.props.onOpenFile(e,t)

}},{key:"handleRowClick",value:function y(e,t){var n=e.props.data
return t.currentTarget.classList.contains("gallery__table-column--select")&&(t.stopPropagation(),t.preventDefault(),"function"==typeof this.props.onSelect)?void this.props.onSelect(t,n):void this.handleActivate(t,n)

}},{key:"handleSort",value:function v(e,t){var n=t?"asc":"desc"
this.state.enableSort&&this.props.onSort(e+","+n)}},{key:"handleSetPage",value:function b(e){this.props.onSetPage(e)}},{key:"preventFocus",value:function C(e){e.preventDefault()}},{key:"renderSize",value:function E(e){
if("folder"===e.rowData.type)return null
var t=(0,g.fileSize)(e.data)
return p["default"].createElement("span",null,t)}},{key:"renderProgressBar",value:function _(e){if(!e.uploading||e.message&&"error"===e.message.type)return null
if(e.id>0)return p["default"].createElement("div",{className:"gallery__progress-bar--complete"})
var t={className:"gallery__progress-bar-progress",style:{width:e.progress+"%"}}
return p["default"].createElement("div",{className:"gallery__progress-bar"},p["default"].createElement("div",t))}},{key:"renderTitle",value:function S(e){var t=this.renderProgressBar(e.rowData)
return p["default"].createElement("div",{className:"fill-width"},p["default"].createElement("div",{className:"flexbox-area-grow"},e.data),t)}},{key:"renderSelect",value:function w(e){return p["default"].createElement("input",{
type:"checkbox",title:h["default"]._t("AssetAdmin.SELECT"),checked:e.data,tabIndex:"-1",onMouseDown:this.preventFocus})}},{key:"renderDate",value:function P(e){return"folder"===e.rowData.type?null:p["default"].createElement("span",null,e.data)

}},{key:"renderThumbnail",value:function x(e){var t=e.data||e.rowData.url
return t?p["default"].createElement("img",{src:t,alt:e.rowData.title,className:"gallery__table-image"}):p["default"].createElement("div",{className:"gallery__table-image--error"})}},{key:"render",value:function F(){
return p["default"].createElement(c["default"],this.getTableProps())}}]),t}(u.Component)
y.defaultProps=m.galleryViewDefaultProps,y.propTypes=m.galleryViewPropTypes,t["default"]=y},function(e,t){e.exports=DataFormat},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e){return function(t){return t({type:d["default"].ADD_QUEUED_FILE,payload:{file:e}})}}function i(e,t){return function(n){var r=t.message
return"string"==typeof t&&(r={value:t,type:"error"}),n({type:d["default"].FAIL_UPLOAD,payload:{queuedId:e,message:r}})}}function s(){return function(e){return e({type:d["default"].PURGE_UPLOAD_QUEUE,payload:null
})}}function a(e){return function(t){return t({type:d["default"].REMOVE_QUEUED_FILE,payload:{queuedId:e}})}}function l(e){return function(t){return t({type:d["default"].SUCCEED_UPLOAD,payload:{queuedId:e
}})}}function u(e,t){return function(n){return n({type:d["default"].UPDATE_QUEUED_FILE,payload:{queuedId:e,updates:t}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addQueuedFile=o,t.failUpload=i,
t.purgeUploadQueue=s,t.removeQueuedFile=a,t.succeedUpload=l,t.updateQueuedFile=u
var p=n(273),d=r(p)},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={ADD_QUEUED_FILE:"ADD_QUEUED_FILE",FAIL_UPLOAD:"FAIL_UPLOAD",PURGE_UPLOAD_QUEUE:"PURGE_UPLOAD_QUEUE",REMOVE_QUEUED_FILE:"REMOVE_QUEUED_FILE",
SUCCEED_UPLOAD:"SUCCEED_UPLOAD",UPDATE_QUEUED_FILE:"UPDATE_QUEUED_FILE"}},function(e,t){e.exports=Breadcrumb},function(e,t){e.exports=Toolbar},function(e,t){e.exports=SchemaActions},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{"default":e}}var o=n(4),i=n(278),s=r(i),a=n(279),l=r(a),u=n(280),p=r(u),d=n(281),c=r(d),f=n(283),h=r(f),m=n(285),g=r(m),y=n(287),v=r(y),b=n(289),C=r(b),E=n(291),_=r(E),S=n(292),w=r(S),P=n(297),x=r(P),F=n(299),I=r(F)


document.addEventListener("DOMContentLoaded",function(){_["default"].register("UploadField",w["default"]),_["default"].register("PreviewImageField",x["default"]),_["default"].register("HistoryList",I["default"])


var e=s["default"].getSection("SilverStripe\\AssetAdmin\\Controller\\AssetAdmin")
l["default"].add({path:e.url,component:g["default"],indexRoute:{onEnter:function t(n,r){var o=[e.url,"show",0].join("/")
r(o)}},childRoutes:[{path:"show/:folderId/edit/:fileId",component:g["default"]},{path:"show/:folderId",component:g["default"]}]}),p["default"].add("assetAdmin",(0,o.combineReducers)({gallery:c["default"],
queuedFiles:h["default"],uploadField:v["default"],previewField:C["default"]}))})},function(e,t){e.exports=Config},function(e,t){e.exports=ReactRouteRegister},function(e,t){e.exports=ReducerRegister},function(e,t,n){
"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(){var e=arguments.length<=0||void 0===arguments[0]?d:arguments[0],t=arguments[1]
switch(t.type){case p["default"].ADD_FILES:var n=function(){var n=[]
return t.payload.files.forEach(function(t){var r=!1
e.files.forEach(function(e){e.id===t.id&&(r=!0)}),r||n.push(t)}),{v:(0,l["default"])(s({},e,{count:"undefined"!=typeof t.payload.count?t.payload.count:e.count,files:n.concat(e.files)}))}}()
if("object"===("undefined"==typeof n?"undefined":i(n)))return n.v
case p["default"].LOAD_FILE_SUCCESS:var r=e.files.find(function(e){return e.id===t.payload.id})
if(r){var o=function(){var n=s({},r,t.payload.file)
return{v:(0,l["default"])(s({},e,{files:e.files.map(function(e){return e.id===n.id?n:e})}))}}()
if("object"===("undefined"==typeof o?"undefined":i(o)))return o.v}else if(e.folder.id===t.payload.id)return(0,l["default"])(s({},e,{folder:s({},e.folder,t.payload.file)}))
return e
case p["default"].UNLOAD_FOLDER:return s({},e,{files:[]})
case p["default"].SELECT_FILES:var a=null
return a=null===t.payload.ids?e.files.map(function(e){return e.id}):e.selectedFiles.concat(t.payload.ids.filter(function(t){return e.selectedFiles.indexOf(t)===-1})),(0,l["default"])(s({},e,{selectedFiles:a
}))
case p["default"].DESELECT_FILES:var u=null
return u=null===t.payload.ids?[]:e.selectedFiles.filter(function(e){return t.payload.ids.indexOf(e)===-1}),(0,l["default"])(s({},e,{selectedFiles:u}))
case p["default"].DELETE_ITEM_SUCCESS:return(0,l["default"])(s({},e,{selectedFiles:e.selectedFiles.filter(function(e){return t.payload.ids.indexOf(e)===-1}),files:e.files.filter(function(e){return t.payload.ids.indexOf(e.id)===-1

}),count:e.count-1}))
case p["default"].LOAD_FOLDER_REQUEST:return(0,l["default"])(s({},e,{errorMessage:null,selectedFiles:[],loading:!0}))
case p["default"].LOAD_FOLDER_SUCCESS:return(0,l["default"])(s({},e,{folder:t.payload.folder,files:t.payload.files,count:t.payload.count,loading:!1}))
case p["default"].LOAD_FOLDER_FAILURE:return(0,l["default"])(s({},e,{errorMessage:t.payload.message,loading:!1}))
case p["default"].ADD_FOLDER_REQUEST:return e
case p["default"].ADD_FOLDER_FAILURE:return e
case p["default"].ADD_FOLDER_SUCCESS:return e
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},s=Object.assign||function(e){
for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}
t["default"]=o
var a=n(282),l=r(a),u=n(11),p=r(u),d={count:0,editorFields:[],file:null,files:[],fileId:0,folderId:0,focus:!1,path:null,selectedFiles:[],page:0,errorMessage:null}},function(e,t){e.exports=DeepFreezeStrict

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(){var e=arguments.length<=0||void 0===arguments[0]?h:arguments[0],t=arguments[1]
switch(t.type){case u["default"].ADD_QUEUED_FILE:return(0,a["default"])(i({},e,{items:e.items.concat([i({},d["default"],t.payload.file)])}))
case u["default"].FAIL_UPLOAD:return(0,a["default"])(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,{message:t.payload.message}):e})}))
case u["default"].PURGE_UPLOAD_QUEUE:return(0,a["default"])(i({},e,{items:e.items.filter(function(e){return!e.message||"error"!==e.message.type&&"success"!==e.message.type})}))
case u["default"].REMOVE_QUEUED_FILE:return(0,a["default"])(i({},e,{items:e.items.filter(function(e){return e.queuedId!==t.payload.queuedId})}))
case u["default"].SUCCEED_UPLOAD:return(0,a["default"])(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,{messages:[{value:f["default"]._t("AssetAdmin.DROPZONE_SUCCESS_UPLOAD"),
type:"success",extraClass:"success"}]}):e})}))
case u["default"].UPDATE_QUEUED_FILE:return(0,a["default"])(i({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?i({},e,t.payload.updates):e})}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=n(282),a=r(s),l=n(273),u=r(l),p=n(284),d=r(p),c=n(9),f=r(c),h={items:[]}
t["default"]=o},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(282),i=r(o),s=(0,i["default"])({attributes:{dimensions:{height:null,width:null}},name:null,canDelete:!1,canEdit:!1,category:null,created:null,extension:null,filename:null,id:0,lastUpdated:null,
messages:null,owner:{id:0,title:null},parent:{filename:null,id:0,title:null},queuedId:null,size:null,title:null,type:null,url:null,xhr:null})
t["default"]=s},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t=e.config.sections[g]


return{sectionConfig:t}}Object.defineProperty(t,"__esModule",{value:!0}),t.AssetAdminRouter=void 0
var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(3),p=r(u),d=n(5),c=n(286),f=n(6),h=r(f),m=n(271),g="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",y=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleBrowse=n.handleBrowse.bind(n),n.getUrl=n.getUrl.bind(n),n}return s(t,e),l(t,[{key:"getUrl",value:function n(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],t=arguments[1],n=arguments[2],r=this.props.sectionConfig.url,o=r+"/show/"+e


t&&(o=o+"/edit/"+t)
var i=(0,m.urlQuery)(this.props.location,n)
return i&&(o=""+o+i),o}},{key:"getSectionProps",value:function r(){return{sectionConfig:this.props.sectionConfig,type:"admin",folderId:parseInt(this.props.params.folderId,10),fileId:parseInt(this.props.params.fileId,10),
query:this.props.location.query,getUrl:this.getUrl,onBrowse:this.handleBrowse}}},{key:"handleBrowse",value:function a(e,t,n){var r=this.getUrl(e,t,n)
this.props.router.push(r)}},{key:"render",value:function u(){return this.props.sectionConfig?p["default"].createElement(h["default"],this.getSectionProps()):null}}]),t}(u.Component)
y.propTypes={sectionConfig:u.PropTypes.shape({url:u.PropTypes.string,form:u.PropTypes.object}),location:u.PropTypes.shape({pathname:u.PropTypes.string,query:u.PropTypes.object}),params:u.PropTypes.shape({
fileId:u.PropTypes.string,folderId:u.PropTypes.string}),router:u.PropTypes.object},t.AssetAdminRouter=y,t["default"]=(0,c.withRouter)((0,d.connect)(a)(y))},function(e,t){e.exports=ReactRouter},function(e,t,n){
"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(){var e=arguments.length<=0||void 0===arguments[0]?h:arguments[0],t=arguments[1],n=function r(n){
if(!t.payload.fieldId)throw new Error("Invalid fieldId")
var r=e.fields[t.payload.fieldId]?e.fields[t.payload.fieldId]:m
return(0,u["default"])(a({},e,{fields:a({},e.fields,i({},t.payload.fieldId,a({},r,n(r))))}))}
switch(t.type){case d["default"].UPLOADFIELD_ADD_FILE:return n(function(e){return{files:[].concat(o(e.files),[a({},f["default"],t.payload.file)])}})
case d["default"].UPLOADFIELD_SET_FILES:return n(function(){return{files:t.payload.files}})
case d["default"].UPLOADFIELD_UPLOAD_FAILURE:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,{message:t.payload.message}):e})}})
case d["default"].UPLOADFIELD_REMOVE_FILE:return n(function(e){return{files:e.files.filter(function(e){return!(t.payload.file.queuedId&&e.queuedId===t.payload.file.queuedId||t.payload.file.id&&e.id===t.payload.file.id)

})}})
case d["default"].UPLOADFIELD_UPLOAD_SUCCESS:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,t.payload.json):e})}})
case d["default"].UPLOADFIELD_UPDATE_QUEUED_FILE:return n(function(e){return{files:e.files.map(function(e){return e.queuedId===t.payload.queuedId?a({},e,t.payload.updates):e})}})
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=n(282),u=r(l),p=n(288),d=r(p),c=n(284),f=r(c),h={fields:{}},m={files:[]}
t["default"]=s},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={UPLOADFIELD_ADD_FILE:"UPLOADFIELD_ADD_FILE",UPLOADFIELD_SET_FILES:"UPLOADFIELD_SET_FILES",UPLOADFIELD_REMOVE_FILE:"UPLOADFIELD_REMOVE_FILE",
UPLOADFIELD_UPLOAD_FAILURE:"UPLOADFIELD_UPLOAD_FAILURE",UPLOADFIELD_UPLOAD_SUCCESS:"UPLOADFIELD_UPLOAD_SUCCESS",UPLOADFIELD_UPDATE_QUEUED_FILE:"UPLOADFIELD_UPDATE_QUEUED_FILE"}},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(){var e=arguments.length<=0||void 0===arguments[0]?d:arguments[0],t=arguments[1]


switch(t.type){case p["default"].PREVIEWFIELD_ADD_FILE:return(0,l["default"])(s({},e,o({},t.payload.id,t.payload.file)))
case p["default"].PREVIEWFIELD_FAIL_UPLOAD:return(0,l["default"])(s({},e,o({},t.payload.id,s({},e[t.payload.id],{message:t.payload.message}))))
case p["default"].PREVIEWFIELD_REMOVE_FILE:return(0,l["default"])(s({},e,o({},t.payload.id,void 0)))
case p["default"].PREVIEWFIELD_UPDATE_FILE:return(0,l["default"])(s({},e,o({},t.payload.id,s({},e[t.payload.id],t.payload.data))))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(282),l=r(a),u=n(290),p=r(u),d={}
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
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(9),f=o(c),h=n(3),m=o(h),g=n(5),y=n(4),v=n(14),b=o(v),C=n(7),E=o(C),_=n(293),S=o(_),w=n(294),P=o(w),x=n(22),F=o(x),I=n(295),T=o(I),A=n(28),O=o(A),D=n(296),k=r(D),R=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.renderChild=n.renderChild.bind(n),n.handleAddShow=n.handleAddShow.bind(n),n.handleAddHide=n.handleAddHide.bind(n),n.handleAddInsert=n.handleAddInsert.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),
n.handleSending=n.handleSending.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),
n.handleItemRemove=n.handleItemRemove.bind(n),n.handleChange=n.handleChange.bind(n),n.state={selecting:!1},n}return a(t,e),d(t,[{key:"componentDidMount",value:function n(){this.props.actions.uploadField.setFiles(this.props.id,this.props.data.files)

}},{key:"componentWillReceiveProps",value:function r(e){var t=this.props.files||[],n=e.files||[],r=this.compareValues(t,n)
r&&this.handleChange(e)}},{key:"compareValues",value:function o(e,t){if(e.length!==t.length)return!0
for(var n=0;n<e.length;n++)if(e[n].id!==t[n].id)return!0
return!1}},{key:"handleAddedFile",value:function l(e){var t=p({},e,{uploaded:!0})
this.props.actions.uploadField.addFile(this.props.id,t)}},{key:"handleSending",value:function u(e,t){this.props.actions.uploadField.updateQueuedFile(this.props.id,e._queuedId,{xhr:t})}},{key:"handleUploadProgress",
value:function c(e,t){this.props.actions.uploadField.updateQueuedFile(this.props.id,e._queuedId,{progress:t})}},{key:"handleSuccessfulUpload",value:function h(e){var t=JSON.parse(e.xhr.response)
return"undefined"!=typeof t[0].error?void this.handleFailedUpload(e):void this.props.actions.uploadField.succeedUpload(this.props.id,e._queuedId,t[0])}},{key:"handleFailedUpload",value:function g(e,t){
this.props.actions.uploadField.failUpload(this.props.id,e._queuedId,t)}},{key:"handleItemRemove",value:function y(e,t){this.props.actions.uploadField.removeFile(this.props.id,t)}},{key:"handleChange",value:function v(e){
if("function"==typeof e.onChange){var t=e.files.filter(function(e){return e.id}).map(function(e){return e.id}),n={Files:t}
e.onChange(n)}}},{key:"handleSelect",value:function C(e){e.preventDefault()}},{key:"handleAddShow",value:function E(e){e.preventDefault(),this.setState({selecting:!0})}},{key:"handleAddHide",value:function _(){
this.setState({selecting:!1})}},{key:"handleAddInsert",value:function S(e,t){this.props.actions.uploadField.addFile(this.props.id,t),this.handleAddHide()}},{key:"render",value:function w(){return m["default"].createElement("div",{
className:"uploadfield"},this.renderDropzone(),this.props.files.map(this.renderChild),this.renderDialog())}},{key:"renderDropzone",value:function x(){if(!this.props.data.createFileEndpoint)return null
var e={height:b["default"].SMALL_THUMBNAIL_HEIGHT,width:b["default"].SMALL_THUMBNAIL_WIDTH},t={url:this.props.data.createFileEndpoint.url,method:this.props.data.createFileEndpoint.method,paramName:"Upload",
thumbnailWidth:b["default"].SMALL_THUMBNAIL_WIDTH,thumbnailHeight:b["default"].SMALL_THUMBNAIL_HEIGHT}
this.props.data.multi||(t.maxFiles=1)
var n=["uploadfield__dropzone"]
this.props.files.length&&!this.props.data.multi&&n.push("uploadfield__dropzone--hidden")
var r=this.props.securityId
return m["default"].createElement(F["default"],{canUpload:!0,uploadButton:!1,uploadSelector:".uploadfield__upload-button, .uploadfield__backdrop",folderId:this.props.data.parentid,handleAddedFile:this.handleAddedFile,
handleError:this.handleFailedUpload,handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,preview:e,options:t,securityID:r,className:n.join(" ")
},m["default"].createElement("div",{className:"uploadfield__backdrop"}),m["default"].createElement("span",{className:"uploadfield__droptext"},m["default"].createElement("button",{onClick:this.handleSelect,
className:"uploadfield__upload-button"},f["default"]._t("AssetAdminUploadField.BROWSE","Browse"))," ",f["default"]._t("AssetAdminUploadField.OR","or")," ",m["default"].createElement("button",{onClick:this.handleAddShow,
className:"uploadfield__add-button"},f["default"]._t("AssetAdminUploadField.ADD_FILES","Add from files"))))}},{key:"renderDialog",value:function I(){return m["default"].createElement(T["default"],{title:!1,
show:this.state.selecting,onInsert:this.handleAddInsert,onHide:this.handleAddHide,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",type:"select"})}},{key:"renderChild",value:function A(e,t){
var n={key:t,item:e,name:this.props.name,handleRemove:this.handleItemRemove}
return m["default"].createElement(P["default"],n)}}]),t}(E["default"])
R.propTypes={extraClass:m["default"].PropTypes.string,id:m["default"].PropTypes.string.isRequired,name:m["default"].PropTypes.string.isRequired,onChange:m["default"].PropTypes.func,value:m["default"].PropTypes.shape({
Files:m["default"].PropTypes.arrayOf(m["default"].PropTypes.number)}),files:m["default"].PropTypes.arrayOf(O["default"]),readOnly:m["default"].PropTypes.bool,disabled:m["default"].PropTypes.bool,data:m["default"].PropTypes.shape({
createFileEndpoint:m["default"].PropTypes.shape({url:m["default"].PropTypes.string.isRequired,method:m["default"].PropTypes.string.isRequired,payloadFormat:m["default"].PropTypes.string.isRequired}),multi:m["default"].PropTypes.bool,
parentid:m["default"].PropTypes.number})},R.defaultProps={value:{Files:[]},extraClass:"",className:""}
var N=(0,g.connect)(l,u)(R)
t.UploadField=R,t.ConnectedUploadField=N,t["default"]=(0,S["default"])(N)},function(e,t){e.exports=FieldHolder},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(9),u=r(l),p=n(3),d=r(p),c=n(7),f=r(c),h=n(14),m=r(h),g=n(28),y=r(g),v=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleRemove=n.handleRemove.bind(n),n}return s(t,e),a(t,[{key:"getThumbnailStyles",value:function n(){if(this.isImage()&&(this.exists()||this.uploading())){var e=this.props.item.smallThumbnail||this.props.item.url


return{backgroundImage:"url("+e+")"}}return{}}},{key:"hasError",value:function r(){return!!this.props.item.message&&"error"===this.props.item.message.type}},{key:"renderErrorMessage",value:function l(){
var e=null
return this.hasError()?e=this.props.item.message.value:this.exists()||this.uploading()||(e=u["default"]._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==e?d["default"].createElement("div",{
className:"uploadfield-item__error-message"},e):null}},{key:"getThumbnailClassNames",value:function p(){var e=["uploadfield-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&e.push("uploadfield-item__thumbnail--small"),e.join(" ")}},{key:"getItemClassNames",value:function c(){var e=this.props.item.category||"none",t=["fill-width","uploadfield-item","uploadfield-item--"+e]


return this.exists()||this.uploading()||t.push("uploadfield-item--missing"),this.hasError()&&t.push("uploadfield-item--error"),t.join(" ")}},{key:"isImage",value:function f(){return"image"===this.props.item.category

}},{key:"exists",value:function h(){return this.props.item.exists}},{key:"uploading",value:function g(){return!!this.props.item.uploaded}},{key:"complete",value:function y(){return this.uploading()&&this.props.item.id>0

}},{key:"isImageSmallerThanThumbnail",value:function v(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1
var e=this.props.item.dimensions
return e&&e.height<m["default"].SMALL_THUMBNAIL_HEIGHT&&e.width<m["default"].SMALL_THUMBNAIL_WIDTH}},{key:"preventFocus",value:function b(e){e.preventDefault()}},{key:"handleRemove",value:function C(e){
e.preventDefault(),this.props.handleRemove&&this.props.handleRemove(e,this.props.item)}},{key:"renderProgressBar",value:function E(){var e={className:"uploadfield-item__progress-bar",style:{width:this.props.item.progress+"%"
}}
return!this.hasError()&&this.uploading()?this.complete()?d["default"].createElement("div",{className:"uploadfield-item__complete-icon"}):d["default"].createElement("div",{className:"uploadfield-item__upload-progress"
},d["default"].createElement("div",e)):null}},{key:"renderRemoveButton",value:function _(){var e=["btn","uploadfield-item__remove-btn","btn-secondary","btn--no-text","font-icon-cancel","btn--icon-md"].join(" ")


return d["default"].createElement("button",{className:e,onClick:this.handleRemove,ref:"backButton"})}},{key:"renderFileDetails",value:function S(){return d["default"].createElement("div",{className:"uploadfield-item__details fill-width flexbox-area-grow"
},d["default"].createElement("span",{className:"uploadfield-item__title",ref:"title"},this.props.item.title),d["default"].createElement("span",{className:"uploadfield-item__meta"},this.props.item.extension,", ",this.props.item.size))

}},{key:"render",value:function w(){var e=this.props.name+"[Files][]"
return d["default"].createElement("div",{className:this.getItemClassNames()},d["default"].createElement("input",{type:"hidden",value:this.props.item.id,name:e}),d["default"].createElement("div",{ref:"thumbnail",
className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()}),this.renderFileDetails(),this.renderProgressBar(),this.renderErrorMessage(),this.renderRemoveButton())}}]),t}(f["default"])
v.propTypes={name:d["default"].PropTypes.string.isRequired,item:y["default"],handleRemove:d["default"].PropTypes.func},t["default"]=v},function(e,t){e.exports=InsertMediaModal},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){return function(n){return n({type:d["default"].UPLOADFIELD_ADD_FILE,payload:{fieldId:e,file:t}})}}function i(e,t){return function(n){
return n({type:d["default"].UPLOADFIELD_SET_FILES,payload:{fieldId:e,files:t}})}}function s(e,t,n){return function(r){var o=n.message
return"string"==typeof n&&(o={value:n,type:"error"}),r({type:d["default"].UPLOADFIELD_UPLOAD_FAILURE,payload:{fieldId:e,queuedId:t,message:o}})}}function a(e,t){return function(n){return n({type:d["default"].UPLOADFIELD_REMOVE_FILE,
payload:{fieldId:e,file:t}})}}function l(e,t,n){return function(r){return r({type:d["default"].UPLOADFIELD_UPLOAD_SUCCESS,payload:{fieldId:e,queuedId:t,json:n}})}}function u(e,t,n){return function(r){return r({
type:d["default"].UPLOADFIELD_UPDATE_QUEUED_FILE,payload:{fieldId:e,queuedId:t,updates:n}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addFile=o,t.setFiles=i,t.failUpload=s,t.removeFile=a,t.succeedUpload=l,
t.updateQueuedFile=u
var p=n(288),d=r(p)},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=e.config.SecurityID,r=t.id,o=e.assetAdmin.previewField[r]||{}


return{securityID:n,upload:o}}function u(e){return{actions:{previewField:(0,C.bindActionCreators)(_,e)}}}Object.defineProperty(t,"__esModule",{value:!0})
var p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(9),c=o(d),f=n(3),h=o(f),m=n(22),g=o(m),y=n(14),v=o(y),b=n(5),C=n(4),E=n(298),_=r(E),S=function(e){
function t(e){i(this,t)
var n=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleAddedFile=n.handleAddedFile.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleSending=n.handleSending.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),
n.handleCancelUpload=n.handleCancelUpload.bind(n),n.handleRemoveErroredUpload=n.handleRemoveErroredUpload.bind(n),n}return a(t,e),p(t,[{key:"componentWillUnmount",value:function n(){this.props.actions.previewField.removeFile(this.props.id)

}},{key:"getDropzoneProps",value:function r(){var e=this.props.data.uploadFileEndpoint,t={url:e&&e.url,method:e&&e.method,paramName:"Upload",clickable:"#preview-replace-button",maxFiles:1},n={height:v["default"].THUMBNAIL_HEIGHT,
width:v["default"].THUMBNAIL_WIDTH},r=this.props.securityID,o=["asset-dropzone--button","preview__container",this.props.className,this.props.extraClass]
return{className:o.join(" "),canUpload:e&&this.canEdit(),preview:n,folderId:this.props.data.parentid,options:t,securityID:r,uploadButton:!1,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,
handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress}}},{key:"canEdit",value:function o(){return!this.props.readOnly&&!this.props.disabled&&"folder"!==this.props.data.category

}},{key:"preventDefault",value:function l(e){e.preventDefault()}},{key:"handleCancelUpload",value:function u(){this.props.upload.xhr&&this.props.upload.xhr.abort(),this.handleRemoveErroredUpload()}},{key:"handleRemoveErroredUpload",
value:function d(){this.props.actions.previewField.removeFile(this.props.id)}},{key:"handleAddedFile",value:function f(e){this.props.actions.previewField.addFile(this.props.id,e)}},{key:"handleFailedUpload",
value:function m(e,t){this.props.actions.previewField.failUpload(this.props.id,t)}},{key:"handleSuccessfulUpload",value:function y(e){var t=JSON.parse(e.xhr.response)
"function"==typeof this.props.onAutofill&&(this.props.onAutofill("FileFilename",t.Filename),this.props.onAutofill("FileHash",t.Hash),this.props.onAutofill("FileVariant",t.Variant))}},{key:"handleSending",
value:function b(e,t){this.props.actions.previewField.updateFile(this.props.id,{xhr:t})}},{key:"handleUploadProgress",value:function C(e,t){this.props.actions.previewField.updateFile(this.props.id,{progress:t
})}},{key:"renderImage",value:function E(){var e=this.props.data
if(!e.exists&&!this.props.upload.url)return h["default"].createElement("div",{className:"editor__file-preview-message--file-missing"},c["default"]._t("AssetAdmin.FILE_MISSING","File cannot be found"))
var t=this.props.upload.url||e.preview||e.url,n=h["default"].createElement("img",{src:t,className:"editor__thumbnail"})
return e.url?h["default"].createElement("a",{className:"editor__file-preview-link",href:e.url,target:"_blank"},n):n}},{key:"renderToolbar",value:function _(){var e=this.canEdit()
return this.props.data.url||e?h["default"].createElement("div",{className:"preview__toolbar fill-height"},this.props.data.url?h["default"].createElement("a",{href:this.props.data.url,target:"_blank",className:"preview__toolbar-button--link preview__toolbar-button"
},"Open"):null,e?h["default"].createElement("a",{href:"#",id:"preview-replace-button",onClick:this.preventDefault,className:"preview__toolbar-button--replace preview__toolbar-button"},"Replace"):null):null

}},{key:"render",value:function S(){var e=this.getDropzoneProps()
return h["default"].createElement(g["default"],e,this.renderImage(),this.renderToolbar())}}]),t}(f.Component)
S.propTypes={id:f.PropTypes.string.isRequired,name:f.PropTypes.string,className:f.PropTypes.string,extraClass:f.PropTypes.string,readOnly:f.PropTypes.bool,disabled:f.PropTypes.bool,onAutofill:f.PropTypes.func,
data:f.PropTypes.shape({parentid:f.PropTypes.number,url:f.PropTypes.string,exists:f.PropTypes.bool,preview:f.PropTypes.string,category:f.PropTypes.string,uploadFileEndpoint:f.PropTypes.shape({url:f.PropTypes.string.isRequired,
method:f.PropTypes.string.isRequired,payloadFormat:f.PropTypes.string})}).isRequired,upload:f.PropTypes.shape({url:f.PropTypes.string,progress:f.PropTypes.number,xhr:f.PropTypes.object}),actions:f.PropTypes.object,
securityID:f.PropTypes.string},S.defaultProps={extraClass:"",className:""},t["default"]=(0,b.connect)(l,u)(S)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e){return{type:u["default"].PREVIEWFIELD_REMOVE_FILE,payload:{id:e}}}function i(e,t){return{type:u["default"].PREVIEWFIELD_ADD_FILE,payload:{
id:e,file:t}}}function s(e,t){return{type:u["default"].PREVIEWFIELD_FAIL_UPLOAD,payload:{id:e,message:t}}}function a(e,t){return{type:u["default"].PREVIEWFIELD_UPDATE_FILE,payload:{id:e,data:t}}}Object.defineProperty(t,"__esModule",{
value:!0}),t.removeFile=o,t.addFile=i,t.failUpload=s,t.updateFile=a
var l=n(290),u=r(l)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t=e.config.sections["SilverStripe\\AssetAdmin\\Controller\\AssetAdmin"]


return{sectionConfig:t,historySchemaUrl:t.form.fileHistoryForm.schemaUrl}}Object.defineProperty(t,"__esModule",{value:!0}),t.HistoryList=void 0
var l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),p=n(3),d=r(p),c=n(5),f=n(8),h=r(f),m=n(278),g=r(m),y=n(300),v=r(y),b=n(15),C=r(b),E=t.HistoryList=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.state={detailView:null,history:[],loadedDetails:!0},n.handleClick=n.handleClick.bind(n),n.handleBack=n.handleBack.bind(n),n.api=n.createEndpoint(e.sectionConfig.historyEndpoint),n}return s(t,e),
u(t,[{key:"componentDidMount",value:function n(){this.refreshHistoryIfNeeded()}},{key:"componentWillReceiveProps",value:function r(e){this.refreshHistoryIfNeeded(e)}},{key:"getContainerClassName",value:function a(){
return this.state.viewDetails&&!this.state.loadedDetails?"file-history history-container--loading":"file-history"}},{key:"refreshHistoryIfNeeded",value:function p(e){var t=this
e&&e.data.fileId===this.props.data.fileId&&e.data.latestVersionId===this.props.data.latestVersionId||this.api({fileId:e?e.data.fileId:this.props.data.fileId}).then(function(e){t.setState({history:e})})

}},{key:"handleClick",value:function c(e){this.setState({viewDetails:e})}},{key:"handleBack",value:function f(e){e.preventDefault(),this.setState({viewDetails:null})}},{key:"createEndpoint",value:function m(e){
var t=arguments.length<=1||void 0===arguments[1]||arguments[1]
return h["default"].createEndpointFetcher(l({},e,t?{defaultData:{SecurityID:g["default"].get("SecurityID")}}:{}))}},{key:"render",value:function y(){var e=this,t=this.getContainerClassName()
if(!this.state.history)return d["default"].createElement("div",{className:t})
if(this.state.viewDetails){var n=[this.props.historySchemaUrl,this.props.data.fileId,this.state.viewDetails].join("/"),r=["btn btn-secondary","btn--icon-xl btn--no-text","font-icon-left-open-big","file-history__back"].join(" ")


return d["default"].createElement("div",{className:t},d["default"].createElement("a",{className:r,onClick:this.handleBack}),d["default"].createElement(C["default"],{schemaUrl:n}))}return d["default"].createElement("div",{
className:t},d["default"].createElement("ul",{className:"list-group list-group-flush file-history__list"},this.state.history.map(function(t){return d["default"].createElement(v["default"],l({key:t.versionid
},t,{onClick:e.handleClick}))})))}}]),t}(p.Component)
E.propTypes={sectionConfig:d["default"].PropTypes.shape({form:d["default"].PropTypes.object,historyEndpoint:d["default"].PropTypes.shape({url:d["default"].PropTypes.string,method:d["default"].PropTypes.string,
responseFormat:d["default"].PropTypes.string})}),historySchemaUrl:d["default"].PropTypes.string,data:d["default"].PropTypes.object},E.defaultProps={data:{fieldId:0}},t.HistoryList=E,t["default"]=(0,c.connect)(a)(E)

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(3),u=r(l),p=n(7),d=r(p),c=function(e){
function t(e){o(this,t)
var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleClick=n.handleClick.bind(n),n}return s(t,e),a(t,[{key:"handleClick",value:function n(e){e.preventDefault(),"function"==typeof this.props.onClick&&this.props.onClick(this.props.versionid)

}},{key:"render",value:function r(){var e=null
return"Published"===this.props.status&&(e=u["default"].createElement("p",null,u["default"].createElement("span",{className:"history-item__status-flag"},this.props.status)," at ",this.props.date_formatted)),
u["default"].createElement("li",{className:"list-group-item history-item",onClick:this.handleClick},u["default"].createElement("p",null,u["default"].createElement("span",{className:"history-item__version"
},"v.",this.props.versionid),u["default"].createElement("span",{className:"history-item__date"},this.props.date_ago," ",this.props.author),this.props.summary),e)}}]),t}(d["default"])
c.propTypes={versionid:l.PropTypes.number.isRequired,summary:l.PropTypes.oneOfType([l.PropTypes.bool,l.PropTypes.string]).isRequired,status:l.PropTypes.string,author:l.PropTypes.string,date:l.PropTypes.string,
onClick:l.PropTypes.func},t["default"]=c},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}var o=n(18),i=r(o),s=n(3),a=r(s),l=n(19),u=r(l),p=n(5),d=n(302),c=n(292)
i["default"].entwine("ss",function(e){e(".js-react-boot input.entwine-uploadfield").entwine({onunmatch:function t(){this._super(),u["default"].unmountComponentAtNode(this[0])},onmatch:function n(){this._super(),
this.refresh()},refresh:function r(){var e=window.ss.store,t=this.getAttributes()
u["default"].render(a["default"].createElement(p.Provider,{store:e},a["default"].createElement(c.ConnectedUploadField,t)),this.parent()[0])},getAttributes:function o(){var t=e(this).data("state"),n=e(this).data("schema")


return(0,d.schemaMerge)(n,t)}})})},function(e,t){e.exports=schemaFieldValues},function(e,t){}])

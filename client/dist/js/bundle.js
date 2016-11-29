!function(e){function t(r){if(n[r])return n[r].exports
var i=n[r]={exports:{},id:r,loaded:!1}
return e[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={}
return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict"
n(1),n(33),n(50)},function(e,t,n){(function(t){e.exports=t.InsertMediaModal=n(2)}).call(t,function(){return this}())},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var n=e.config.sections[I],r=t.fileAttributes.ID,i=e.config.sections[I],o=r&&i.form.FileInsertForm.schemaUrl+"/"+r


return{sectionConfig:n,schemaUrl:o}}function u(e){return{actions:{schema:(0,m.bindActionCreators)(F,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.InsertMediaModal=void 0
var d=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0
try{for(var l=e[Symbol.iterator](),a;!(r=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(s){i=!0,o=s}finally{try{!r&&l["return"]&&l["return"]()}finally{if(i)throw o}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(3),h=i(f),m=n(4),y=n(5),g=n(6),v=i(g),E=n(16),b=i(E),_=n(32),F=r(_),I="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",T=function(e){
function t(e){o(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSubmit=n.handleSubmit.bind(n),n.handleBrowse=n.handleBrowse.bind(n),n.getUrl=n.getUrl.bind(n),n.state={folderId:0,fileId:e.fileAttributes.ID,query:{}},n}return a(t,e),c(t,[{key:"componentWillMount",
value:function n(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function r(e){!e.show&&this.props.show&&this.setState({folderId:0,fileId:null,query:{}}),e.show&&!this.props.show&&e.fileAttributes.ID&&(this.setOverrides(e),
this.setState({folderId:0,fileId:e.fileAttributes.ID}))}},{key:"componentWillUnmount",value:function i(){this.setOverrides()}},{key:"setOverrides",value:function s(e){if(e&&this.props.schemaUrl===e.schemaUrl||this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,null),
e&&e.schemaUrl){var t=p({},e.fileAttributes)
delete t.ID
var n={fields:Object.entries(t).map(function(e){var t=d(e,2),n=t[0],r=t[1]
return{name:n,value:r}})}
this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,n)}}},{key:"getUrl",value:function u(e,t){var n=this.props.sectionConfig.url,r=n+"/show/"+(e||0)
return t&&(r=r+"/edit/"+t),r}},{key:"getSectionProps",value:function f(){return{dialog:!0,type:"insert",sectionConfig:this.props.sectionConfig,folderId:this.state.folderId,fileId:this.state.fileId||this.props.fileId,
query:this.state.query,getUrl:this.getUrl,onBrowse:this.handleBrowse,onSubmitEditor:this.handleSubmit}}},{key:"getModalProps",value:function m(){return p({},this.props,{handleHide:this.props.onHide,className:"insert-media-modal "+this.props.className,
bsSize:"lg",onHide:void 0,onInsert:void 0,sectionConfig:void 0,schemaUrl:void 0})}},{key:"handleSubmit",value:function y(e,t,n,r){return this.props.onInsert(e,r)}},{key:"handleBrowse",value:function g(e,t,n){
var r=n
r=null===n||n?p({},this.state.query,n):this.state.query,this.setState({folderId:e,fileId:t,query:r})}},{key:"render",value:function E(){var e=this.getModalProps(),t=this.getSectionProps(),n=this.props.show?h["default"].createElement(v["default"],t):null


return h["default"].createElement(b["default"],e,n)}}]),t}(f.Component)
T.propTypes={sectionConfig:f.PropTypes.shape({url:f.PropTypes.string,form:f.PropTypes.object}),schemaUrl:f.PropTypes.string,show:f.PropTypes.bool,onInsert:f.PropTypes.func.isRequired,fileAttributes:f.PropTypes.shape({
ID:f.PropTypes.number,AltText:f.PropTypes.string,Width:f.PropTypes.number,Height:f.PropTypes.number,TitleTooltip:f.PropTypes.string,Alignment:f.PropTypes.string}),fileId:f.PropTypes.number,onHide:f.PropTypes.func,
className:f.PropTypes.string,actions:f.PropTypes.object},T.defaultProps={className:"",fileAttributes:{}},t.InsertMediaModal=T,t["default"]=(0,y.connect)(s,u)(T)},function(e,t){e.exports=React},function(e,t){
e.exports=Redux},function(e,t){e.exports=ReactRedux},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var n=e.assetAdmin.gallery.folder,r=e.assetAdmin.gallery.files


return{files:r,folder:n,limit:t.sectionConfig.limit,securityId:e.config.SecurityID}}function u(e){return{actions:{gallery:(0,m.bindActionCreators)(I,e),breadcrumbsActions:(0,m.bindActionCreators)(A,e)}
}}Object.defineProperty(t,"__esModule",{value:!0}),t.AssetAdmin=void 0
var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(3),f=i(c),h=n(5),m=n(4),y=n(7),g=i(y),v=n(8),E=i(v),b=n(9),_=i(b),F=n(10),I=r(F),T=n(12),A=r(T),D=n(13),P=i(D),O=n(17),S=i(O),L=n(30),w=i(L),C=n(31),k=i(C),U=function(e){
function t(e){o(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleOpenFile=n.handleOpenFile.bind(n),n.handleCloseFile=n.handleCloseFile.bind(n),n["delete"]=n["delete"].bind(n),n.handleSubmitEditor=n.handleSubmitEditor.bind(n),n.handleOpenFolder=n.handleOpenFolder.bind(n),
n.handleSort=n.handleSort.bind(n),n.createEndpoint=n.createEndpoint.bind(n),n.handleBackButtonClick=n.handleBackButtonClick.bind(n),n.handleFolderIcon=n.handleFolderIcon.bind(n),n.handleBrowse=n.handleBrowse.bind(n),
n.compare=n.compare.bind(n),n}return a(t,e),p(t,[{key:"componentWillMount",value:function n(){var e=this.props.sectionConfig
this.endpoints={createFolderApi:this.createEndpoint(e.createFolderEndpoint),readFolderApi:this.createEndpoint(e.readFolderEndpoint,!1),updateFolderApi:this.createEndpoint(e.updateFolderEndpoint),deleteApi:this.createEndpoint(e.deleteEndpoint)
}}},{key:"componentWillReceiveProps",value:function r(e){var t=this.compare(this.props.folder,e.folder)
t&&this.setBreadcrumbs(e.folder)}},{key:"handleBrowse",value:function i(e,t,n){"function"==typeof this.props.onBrowse&&this.props.onBrowse(e,t,n)}},{key:"handleSort",value:function s(e){this.handleBrowse(this.props.folderId,this.props.fileId,{
sort:e})}},{key:"createEndpoint",value:function u(e){var t=arguments.length<=1||void 0===arguments[1]||arguments[1]
return E["default"].createEndpointFetcher(d({},e,t?{defaultData:{SecurityID:this.props.securityId}}:{}))}},{key:"handleBackButtonClick",value:function c(e){e.preventDefault(),this.props.folder?this.handleOpenFolder(this.props.folder.parentID||0):this.handleOpenFolder(0)

}},{key:"setBreadcrumbs",value:function h(e){var t=this,n=[{text:_["default"]._t("AssetAdmin.FILES","Files"),href:this.props.sectionConfig.url}]
e&&e.id&&(e.parents&&e.parents.forEach(function(e){n.push({text:e.title,href:t.props.getUrl&&t.props.getUrl(e.id),onClick:function r(){return t.handleBrowse(e.id)}})}),n.push({text:e.title,icon:{className:"icon font-icon-edit-list",
action:this.handleFolderIcon}})),this.props.actions.breadcrumbsActions.setBreadcrumbs(n)}},{key:"compare",value:function m(e,t){return!!(e&&!t||t&&!e)||e&&t&&(e.id!==t.id||e.name!==t.name)}},{key:"handleFolderIcon",
value:function y(e){e.preventDefault(),this.handleOpenFile(this.props.folderId)}},{key:"handleOpenFile",value:function g(e){this.handleBrowse(this.props.folderId,e)}},{key:"handleSubmitEditor",value:function v(e,t,n){
var r=this,i=null
if("function"==typeof this.props.onSubmitEditor){var o=this.props.files.find(function(e){return e.id===parseInt(r.props.fileId,10)})
i=this.props.onSubmitEditor(e,t,n,o)}else i=n()
if(!i)throw new Error("Promise was not returned for submitting")
return i.then(function(e){return e&&e.record&&r.props.actions.gallery.loadFile(r.props.fileId,e.record),e})}},{key:"handleCloseFile",value:function b(){this.handleOpenFolder(this.props.folderId)}},{key:"handleOpenFolder",
value:function F(e){this.handleBrowse(e)}},{key:"delete",value:function I(e){var t=this,n=this.props.files.find(function(t){return t.id===e})
if(!n&&this.props.folder&&this.props.folder.id===e&&(n=this.props.folder),!n)throw new Error("File selected for deletion cannot be found: "+e)
var r=n.parent?n.parent.id:0
confirm(_["default"]._t("AssetAdmin.CONFIRMDELETE"))&&this.props.actions.gallery.deleteItems(this.endpoints.deleteApi,[n.id]).then(function(){t.handleBrowse(r)})}},{key:"renderGallery",value:function T(){
var e=this.props.sectionConfig,t=e.createFileEndpoint.url,n=e.createFileEndpoint.method,r=this.props.query&&this.props.query.limit,i=this.props.query&&this.props.query.page,o=this.props.query&&this.props.query.sort


return f["default"].createElement(S["default"],{dialog:this.props.dialog,files:this.props.files,fileId:this.props.fileId,folderId:this.props.folderId,folder:this.props.folder,type:this.props.type,limit:r,
page:i,createFileApiUrl:t,createFileApiMethod:n,createFolderApi:this.endpoints.createFolderApi,readFolderApi:this.endpoints.readFolderApi,updateFolderApi:this.endpoints.updateFolderApi,deleteApi:this.endpoints.deleteApi,
onOpenFile:this.handleOpenFile,onOpenFolder:this.handleOpenFolder,onSort:this.handleSort,sort:o,sectionConfig:e})}},{key:"renderEditor",value:function A(){var e=this,t=this.props.sectionConfig,n=this.props.files.find(function(t){
return t.id===parseInt(e.props.fileId,10)}),r="insert"===this.props.type?t.form.FileInsertForm.schemaUrl:t.form.FileEditForm.schemaUrl
return n||this.props.fileId===this.props.folderId?f["default"].createElement(P["default"],{dialog:this.props.dialog,fileId:this.props.fileId,onClose:this.handleCloseFile,editFileSchemaUrl:r,onSubmit:this.handleSubmitEditor,
onDelete:this["delete"],addToCampaignSchemaUrl:t.form.AddToCampaignForm.schemaUrl}):null}},{key:"render",value:function D(){var e=!(!this.props.folder||!this.props.folder.id)
return f["default"].createElement("div",{className:"fill-height"},f["default"].createElement(k["default"],{showBackButton:e,handleBackButtonClick:this.handleBackButtonClick},f["default"].createElement(w["default"],{
multiline:!0})),f["default"].createElement("div",{className:"flexbox-area-grow fill-width fill-height gallery"},this.renderGallery(),this.renderEditor()))}}]),t}(g["default"])
U.propTypes={dialog:c.PropTypes.bool,sectionConfig:c.PropTypes.shape({url:c.PropTypes.string,limit:c.PropTypes.number,form:c.PropTypes.object}),fileId:c.PropTypes.number,folderId:c.PropTypes.number,onBrowse:c.PropTypes.func,
getUrl:c.PropTypes.func,query:c.PropTypes.shape({sort:c.PropTypes.string}),onSubmitEditor:c.PropTypes.func,type:c.PropTypes.oneOf(["insert","admin"]),files:c.PropTypes.array,folder:c.PropTypes.shape({id:c.PropTypes.number,
title:c.PropTypes.string,parents:c.PropTypes.array,parentID:c.PropTypes.number,canView:c.PropTypes.bool,canEdit:c.PropTypes.bool})},U.defaultProps={type:"admin"},t.AssetAdmin=U,t["default"]=(0,h.connect)(s,u)(U)

},function(e,t){e.exports=SilverStripeComponent},function(e,t){e.exports=Backend},function(e,t){e.exports=i18n},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){return function(n){return n({type:h["default"].ADD_FILES,payload:{files:e,count:t}})}}function o(e,t){return function(n){return n({type:h["default"].DELETE_ITEM_REQUEST,
payload:{ids:t}}),e({ids:t}).then(function(e){return n({type:h["default"].DELETE_ITEM_SUCCESS,payload:{ids:t}}),e})["catch"](function(e){throw n({type:h["default"].DELETE_ITEM_FAILURE,payload:{e:e}}),e

})}}function l(e,t,n,r){return function(i){return i({type:h["default"].LOAD_FOLDER_REQUEST,payload:{folderId:parseInt(t,10)}}),e({id:t,limit:n,page:r}).then(function(e){return i({type:h["default"].LOAD_FOLDER_SUCCESS,
payload:{files:e.files,folder:{id:parseInt(e.folderID,10),title:e.title,parents:e.parents,parent:e.parent,canEdit:e.canEdit,canDelete:e.canDelete,parentID:null===e.parentID?null:parseInt(e.parentID,10)
},folderId:parseInt(e.folderID,10)}}),e})["catch"](function(e){throw i({type:h["default"].LOAD_FOLDER_FAILURE,payload:{message:e.message}}),e})}}function a(){return{type:h["default"].UNLOAD_FOLDER}}function s(e,t){
return function(n){n({type:h["default"].LOAD_FILE_SUCCESS,payload:{id:e,file:t}})}}function u(){var e=arguments.length<=0||void 0===arguments[0]?null:arguments[0]
return function(t){return t({type:h["default"].SELECT_FILES,payload:{ids:e}})}}function d(){var e=arguments.length<=0||void 0===arguments[0]?null:arguments[0]
return function(t){return t({type:h["default"].DESELECT_FILES,payload:{ids:e}})}}function p(e){return function(t){return t({type:h["default"].SORT_FILES,payload:{comparator:e}})}}function c(e,t,n){return function(r){
return r({type:h["default"].CREATE_FOLDER_REQUEST,payload:{name:n}}),e({ParentID:isNaN(t)?0:t,Name:n}).then(function(e){return r({type:h["default"].CREATE_FOLDER_SUCCESS,payload:{name:n}}),e})["catch"](function(e){
throw r({type:h["default"].CREATE_FOLDER_FAILURE,payload:{error:"Couldn't create "+n+": "+e}}),e})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addFiles=i,t.deleteItems=o,t.loadFolderContents=l,
t.unloadFolderContents=a,t.loadFile=s,t.selectFiles=u,t.deselectFiles=d,t.sortFiles=p,t.createFolder=c
var f=n(11),h=r(f)},function(e,t){"use strict"
function n(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0})
var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}
t["default"]=["ADD_FILES","DESELECT_FILES","REMOVE_FILES","SELECT_FILES","SORT_FILES","LOAD_FILE_REQUEST","LOAD_FILE_SUCCESS","CREATE_FOLDER_REQUEST","CREATE_FOLDER_SUCCESS","CREATE_FOLDER_FAILURE","DELETE_ITEM_REQUEST","DELETE_ITEM_SUCCESS","DELETE_ITEM_FAILURE","LOAD_FOLDER_REQUEST","LOAD_FOLDER_SUCCESS","LOAD_FOLDER_FAILURE","UNLOAD_FOLDER","HIGHLIGHT_FILES","UPDATE_BATCH_ACTIONS"].reduce(function(e,t){
return r(e,n({},t,"GALLERY."+t))},{})},function(e,t){e.exports=BreadcrumbsActions},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(9),u=r(s),d=n(3),p=r(d),c=n(14),f=r(c),h=n(15),m=r(h),y=n(16),g=r(y),v=function(e){
function t(e){i(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleCancelKeyDown=n.handleCancelKeyDown.bind(n),n.handleClose=n.handleClose.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n.handleAction=n.handleAction.bind(n),n.closeModal=n.closeModal.bind(n),
n.openModal=n.openModal.bind(n),n.state={openModal:!1},n}return l(t,e),a(t,[{key:"handleAction",value:function n(e,t){var n=e.currentTarget.name
return"action_addtocampaign"===n?(this.openModal(),void e.preventDefault()):"action_delete"===n?(this.props.onDelete(t.ID),void e.preventDefault()):void 0}},{key:"handleCancelKeyDown",value:function r(e){
e.keyCode!==f["default"].SPACE_KEY_CODE&&e.keyCode!==f["default"].RETURN_KEY_CODE||this.handleClose(e)}},{key:"handleSubmit",value:function s(e,t,n){return"function"==typeof this.props.onSubmit?this.props.onSubmit(e,t,n):n()

}},{key:"handleClose",value:function d(e){this.props.onClose(),this.closeModal(),e&&e.preventDefault()}},{key:"openModal",value:function c(){this.setState({openModal:!0})}},{key:"closeModal",value:function h(){
this.setState({openModal:!1})}},{key:"renderCancelButton",value:function y(){return p["default"].createElement("a",{tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",
onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u["default"]._t("AssetAdmin.CANCEL")})}},{key:"render",value:function v(){var e=this.props.editFileSchemaUrl+"/"+this.props.fileId,t=this.props.addToCampaignSchemaUrl+"/"+this.props.fileId,n=["panel","panel--padded","panel--scrollable","form--no-dividers","editor"]


return this.props.dialog&&n.push("editor--dialog"),p["default"].createElement("div",{className:n.join(" ")},p["default"].createElement("div",{className:"editor__details"},p["default"].createElement(m["default"],{
schemaUrl:e,afterMessages:this.renderCancelButton(),handleSubmit:this.handleSubmit,handleAction:this.handleAction}),p["default"].createElement(g["default"],{show:this.state.openModal,handleHide:this.closeModal,
schemaUrl:t,bodyClassName:"modal__dialog",responseClassBad:"modal__response modal__response--error",responseClassGood:"modal__response modal__response--good"})))}}]),t}(d.Component)
v.propTypes={dialog:p["default"].PropTypes.bool,fileId:p["default"].PropTypes.number.isRequired,onClose:p["default"].PropTypes.func.isRequired,onSubmit:p["default"].PropTypes.func.isRequired,onDelete:p["default"].PropTypes.func.isRequired,
editFileSchemaUrl:p["default"].PropTypes.string.isRequired,addToCampaignSchemaUrl:p["default"].PropTypes.string,openAddCampaignModal:p["default"].PropTypes.bool},t["default"]=v},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var i=n(9),o=r(i)
t["default"]={CSS_TRANSITION_TIME:300,SMALL_THUMBNAIL_HEIGHT:60,SMALL_THUMBNAIL_WIDTH:60,THUMBNAIL_HEIGHT:150,THUMBNAIL_WIDTH:200,BULK_ACTIONS:[{value:"delete",label:o["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE","Delete"),
className:"font-icon-trash",destructive:!0,callback:null,confirm:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=null,t=o["default"].sprintf(o["default"]._t("AssetAdmin.BULK_ACTIONS_CONFIRM"),o["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE_CONFIRM","delete"))


return e=confirm(t)?Promise.resolve():Promise.reject()})},{value:"edit",label:o["default"]._t("AssetAdmin.BULK_ACTIONS_EDIT","Edit"),className:"font-icon-edit",destructive:!1,canApply:function l(e){return 1===e.length

},callback:null}],BULK_ACTIONS_PLACEHOLDER:o["default"]._t("AssetAdmin.BULK_ACTIONS_PLACEHOLDER"),SPACE_KEY_CODE:32,RETURN_KEY_CODE:13}},function(e,t){e.exports=FormBuilderLoader},function(e,t){e.exports=FormBuilderModal

},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){return function(n,r){
var i=n[e].toLowerCase(),o=r[e].toLowerCase()
if("asc"===t){if(i<o)return-1
if(i>o)return 1}else{if(i>o)return-1
if(i<o)return 1}return 0}}function u(e){var t=e.assetAdmin.gallery,n=t.loading,r=t.count,i=t.files,o=t.selectedFiles,l=t.errorMessage
return{loading:n,count:r,files:i,selectedFiles:o,errorMessage:l,queuedFiles:e.assetAdmin.queuedFiles,securityId:e.config.SecurityID}}function d(e){return{actions:{gallery:(0,A.bindActionCreators)(N,e),
queuedFiles:(0,A.bindActionCreators)(j,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.Gallery=void 0
var p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0
try{for(var l=e[Symbol.iterator](),a;!(r=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(s){i=!0,o=s}finally{try{!r&&l["return"]&&l["return"]()}finally{if(i)throw o}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),f=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),h=n(18),m=i(h),y=n(9),g=i(y),v=n(3),E=i(v),b=n(19),_=i(b),F=n(20),I=i(F),T=n(5),A=n(4),D=n(21),P=i(D),O=n(22),S=i(O),L=n(25),w=i(L),C=n(27),k=i(C),U=n(14),R=i(U),M=n(10),N=r(M),x=n(28),j=r(x),q=function(e){
function t(e){o(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.sorters=[{field:"title",direction:"asc",label:g["default"]._t("AssetAdmin.FILTER_TITLE_ASC")},{field:"title",direction:"desc",label:g["default"]._t("AssetAdmin.FILTER_TITLE_DESC")},{field:"created",
direction:"desc",label:g["default"]._t("AssetAdmin.FILTER_DATE_DESC")},{field:"created",direction:"asc",label:g["default"]._t("AssetAdmin.FILTER_DATE_ASC")}],n.handleFolderActivate=n.handleFolderActivate.bind(n),
n.handleFileActivate=n.handleFileActivate.bind(n),n.handleToggleSelect=n.handleToggleSelect.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),n.handleCancelUpload=n.handleCancelUpload.bind(n),n.handleRemoveErroredUpload=n.handleRemoveErroredUpload.bind(n),
n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleSending=n.handleSending.bind(n),n.handleItemDelete=n.handleItemDelete.bind(n),n.handleBackClick=n.handleBackClick.bind(n),n.handleMoreClick=n.handleMoreClick.bind(n),
n.handleSort=n.handleSort.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),n.handleCreateFolder=n.handleCreateFolder.bind(n),n}return a(t,e),
f(t,[{key:"componentDidMount",value:function n(){this.refreshFolderIfNeeded()}},{key:"componentWillReceiveProps",value:function r(e){if((e.sort||e.files)&&(this.props.files.length!==e.files.length||this.props.sort!==e.sort)){
var t=e.sort||this.sorters[0].field+","+this.sorters[0].direction,n=t.split(","),r=c(n,2),i=r[0],o=r[1]
this.props.actions.gallery.sortFiles(s(i,o))}}},{key:"componentWillUpdate",value:function i(){var e=(0,m["default"])(_["default"].findDOMNode(this)).find(".gallery__sort .dropdown")
e.off("change")}},{key:"componentDidUpdate",value:function u(e){var t=(0,m["default"])(_["default"].findDOMNode(this)).find(".gallery__sort .dropdown")
t.chosen({allow_single_deselect:!0,disable_search_threshold:20}),t.on("change",function(){return P["default"].Simulate.click(t.find(":selected")[0])}),this.refreshFolderIfNeeded(e),this.checkLoadingIndicator()

}},{key:"componentWillUnmount",value:function d(){this.props.actions.gallery.unloadFolderContents()}},{key:"getNoItemsNotice",value:function h(){return this.props.files.length<1&&this.props.queuedFiles.items.length<1&&!this.props.loading?E["default"].createElement("p",{
className:"gallery__no-item-notice"},g["default"]._t("AssetAdmin.NOITEMSFOUND")):null}},{key:"getMoreButton",value:function y(){return this.props.count>this.props.files.length?E["default"].createElement("button",{
className:"gallery__load-more",onClick:this.handleMoreClick},g["default"]._t("AssetAdmin.LOADMORE")):null}},{key:"checkLoadingIndicator",value:function v(){var e=(0,m["default"])(".cms-content.AssetAdmin")


this.props.loading&&!e.hasClass("loading")?e.addClass("loading"):!this.props.loading&&e.hasClass("loading")&&e.removeClass("loading")}},{key:"refreshFolderIfNeeded",value:function b(e){e&&this.props.folderId===e.folderId||(this.props.actions.gallery.deselectFiles(),
this.props.actions.gallery.loadFolderContents(this.props.readFolderApi,this.props.folderId,this.props.limit,this.props.page))}},{key:"handleSort",value:function F(e){"function"==typeof this.props.onSort&&(this.props.actions.queuedFiles.purgeUploadQueue(),
this.props.onSort(e.target.value))}},{key:"handleCancelUpload",value:function T(e){e.xhr.abort(),this.props.actions.queuedFiles.removeQueuedFile(e.queuedId)}},{key:"handleRemoveErroredUpload",value:function A(e){
this.props.actions.queuedFiles.removeQueuedFile(e.queuedId)}},{key:"handleAddedFile",value:function D(e){this.props.actions.queuedFiles.addQueuedFile(e)}},{key:"handleSending",value:function O(e,t){this.props.actions.queuedFiles.updateQueuedFile(e._queuedId,{
xhr:t})}},{key:"handleUploadProgress",value:function L(e,t){this.props.actions.queuedFiles.updateQueuedFile(e._queuedId,{progress:t})}},{key:"handleCreateFolder",value:function C(e){var t=this,n=this.promptFolderName()


n&&this.props.actions.gallery.createFolder(this.props.createFolderApi,this.props.folderId,n).then(function(e){return t.props.actions.gallery.addFiles([e],1),e}),e.preventDefault()}},{key:"handleSuccessfulUpload",
value:function U(e){var t=JSON.parse(e.xhr.response)
if("undefined"!=typeof t[0].error)return void this.handleFailedUpload(e)
if(this.props.actions.queuedFiles.removeQueuedFile(e._queuedId),this.props.actions.gallery.addFiles(t,this.props.count+1),"insert"===this.props.type&&!this.props.fileId&&0===this.props.queuedFiles.items.length){
var n=t.pop()
this.props.onOpenFile(n.id)}}},{key:"handleFailedUpload",value:function M(e,t){this.props.actions.queuedFiles.failUpload(e._queuedId,t)}},{key:"handleItemDelete",value:function N(e,t){confirm(g["default"]._t("AssetAdmin.CONFIRMDELETE"))&&this.props.actions.gallery.deleteItems(this.props.deleteApi,[t.id])

}},{key:"promptFolderName",value:function x(){return prompt(g["default"]._t("AssetAdmin.PROMPTFOLDERNAME"))}},{key:"itemIsSelected",value:function j(e){return this.props.selectedFiles.indexOf(e)>-1}},{
key:"itemIsHighlighted",value:function q(e){return this.props.fileId===e}},{key:"handleFolderActivate",value:function B(e,t){e.preventDefault(),this.props.onOpenFolder(t.id)}},{key:"handleFileActivate",
value:function z(e,t){e.preventDefault(),null!==t.created&&this.props.onOpenFile(t.id,t)}},{key:"handleToggleSelect",value:function H(e,t){this.props.selectedFiles.indexOf(t.id)===-1?this.props.actions.gallery.selectFiles([t.id]):this.props.actions.gallery.deselectFiles([t.id])

}},{key:"handleMoreClick",value:function Q(e){e.stopPropagation(),e.preventDefault(),this.props.actions.gallery.deselectFiles()}},{key:"handleBackClick",value:function W(e){e.preventDefault(),this.props.onOpenFolder(this.props.folder.parentID)

}},{key:"renderToolbar",value:function G(){var e=this.props.folder.canEdit
return E["default"].createElement("div",{className:"toolbar--content toolbar--space-save"},this.renderBackButton(),E["default"].createElement("button",{id:"upload-button",className:"btn btn-secondary font-icon-upload btn--icon-xl",
type:"button",disabled:!e},E["default"].createElement("span",{className:"btn__text"},g["default"]._t("AssetAdmin.DROPZONE_UPLOAD"))),E["default"].createElement("button",{id:"add-folder-button",className:"btn btn-secondary font-icon-folder-add btn--icon-xl ",
type:"button",onClick:this.handleCreateFolder,disabled:!e},E["default"].createElement("span",{className:"btn__text"},g["default"]._t("AssetAdmin.ADD_FOLDER_BUTTON"))))}},{key:"renderSort",value:function K(){
var e=this
return E["default"].createElement("div",{className:"gallery__sort fieldholder-small"},E["default"].createElement("select",{className:"dropdown no-change-track no-chzn",tabIndex:"0",style:{width:"160px"
},defaultValue:this.props.sort},this.sorters.map(function(t,n){return E["default"].createElement("option",{key:n,onClick:e.handleSort,"data-field":t.field,"data-direction":t.direction,value:t.field+","+t.direction
},t.label)})))}},{key:"renderBackButton",value:function V(){var e=["btn","btn-secondary","btn--no-text","font-icon-level-up","btn--icon-large","gallery__back"].join(" ")
return null!==this.props.folder.parentID?E["default"].createElement("button",{className:e,onClick:this.handleBackClick,ref:"backButton"}):null}},{key:"renderBulkActions",value:function Z(){var e=this,t=function o(t){
var n=t.map(function(e){return e.id})
e.props.actions.gallery.deleteItems(e.props.deleteApi,n)},n=function l(t){e.props.onOpenFile(t[0].id)},r=R["default"].BULK_ACTIONS.map(function(e){return"delete"!==e.value||e.callback?"edit"!==e.value||e.callback?e:p({},e,{
callback:n}):p({},e,{callback:t})}),i=this.props.selectedFiles.map(function(t){return e.props.files.find(function(e){return t===e.id})})
return i.length>0&&"admin"===this.props.type?E["default"].createElement(I["default"],{transitionName:"bulk-actions",transitionEnterTimeout:R["default"].CSS_TRANSITION_TIME,transitionLeaveTimeout:R["default"].CSS_TRANSITION_TIME
},E["default"].createElement(k["default"],{actions:r,items:i,key:i.length>0})):null}},{key:"render",value:function Y(){var e=this
if(!this.props.folder)return this.props.errorMessage?E["default"].createElement("div",{className:"gallery__error"},E["default"].createElement("div",{className:"gallery__error-message"},E["default"].createElement("h3",null,this.props.errorMessage&&g["default"]._t("AssetAdmin.DROPZONE_RESPONSE_ERROR","Server responded with an error.")),E["default"].createElement("p",null,this.props.errorMessage))):E["default"].createElement("div",null)


var t={height:R["default"].THUMBNAIL_HEIGHT,width:R["default"].THUMBNAIL_WIDTH},n={url:this.props.createFileApiUrl,method:this.props.createFileApiMethod,paramName:"Upload",clickable:"#upload-button"},r=this.props.securityId,i=this.props.folder.canEdit,o="admin"===this.props.type,l=["panel","panel--padded","panel--scrollable","gallery__main"]


return this.props.dialog&&l.push("insert-media-modal__main"),E["default"].createElement("div",{className:"flexbox-area-grow gallery__outer"},this.renderBulkActions(),E["default"].createElement("div",{className:l.join(" ")
},this.renderSort(),this.renderToolbar(),E["default"].createElement(S["default"],{canUpload:i,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,handleSuccess:this.handleSuccessfulUpload,
handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,preview:t,folderId:this.props.folderId,options:n,securityID:r,uploadButton:!1},E["default"].createElement("div",{className:"gallery__folders"
},this.props.files.map(function(t,n){return"folder"===t.type?E["default"].createElement(w["default"],{key:n,item:t,selectable:o,selected:e.itemIsSelected(t.id),highlighted:e.itemIsHighlighted(t.id),handleDelete:e.handleItemDelete,
handleToggleSelect:e.handleToggleSelect,handleActivate:e.handleFolderActivate}):null})),E["default"].createElement("div",{className:"gallery__files"},this.props.queuedFiles.items.map(function(t,n){return E["default"].createElement(w["default"],{
key:"queued_file_"+n,item:t,selectable:o,selected:e.itemIsSelected(t.id),highlighted:e.itemIsHighlighted(t.id),handleDelete:e.handleItemDelete,handleActivate:e.handleFileActivate,handleCancelUpload:e.handleCancelUpload,
handleRemoveErroredUpload:e.handleRemoveErroredUpload,message:t.message,uploading:!0})}),this.props.files.map(function(t,n){return"folder"!==t.type?E["default"].createElement(w["default"],{key:"file_"+n,
item:t,selectable:o,selected:e.itemIsSelected(t.id),highlighted:e.itemIsHighlighted(t.id),handleDelete:e.handleItemDelete,handleToggleSelect:e.handleToggleSelect,handleActivate:e.handleFileActivate}):null

})),this.getNoItemsNotice(),E["default"].createElement("div",{className:"gallery__load"},this.getMoreButton()))))}}]),t}(v.Component)
q.defaultProps={type:"admin"},q.propTypes={dialog:v.PropTypes.bool,fileId:v.PropTypes.number,folderId:v.PropTypes.number.isRequired,folder:v.PropTypes.shape({id:v.PropTypes.number,parentID:v.PropTypes.number,
canView:v.PropTypes.bool,canEdit:v.PropTypes.bool}),queuedFiles:v.PropTypes.shape({items:v.PropTypes.array.isRequired}),onOpenFile:v.PropTypes.func.isRequired,onOpenFolder:v.PropTypes.func.isRequired,onSort:v.PropTypes.func,
createFileApiUrl:v.PropTypes.string,createFileApiMethod:v.PropTypes.string,createFolderApi:v.PropTypes.func,readFolderApi:v.PropTypes.func,deleteApi:v.PropTypes.func,actions:v.PropTypes.object,sort:v.PropTypes.string,
type:v.PropTypes.oneOf(["insert","admin"]),limit:v.PropTypes.number,page:v.PropTypes.number,loading:v.PropTypes.bool,count:v.PropTypes.number,files:v.PropTypes.array,selectedFiles:v.PropTypes.arrayOf(v.PropTypes.number),
errorMessage:v.PropTypes.string,securityId:v.PropTypes.string},t.Gallery=q,t["default"]=(0,T.connect)(u,d)(q)},function(e,t){e.exports=jQuery},function(e,t){e.exports=ReactDom},function(e,t){e.exports=ReactAddonsCssTransitionGroup

},function(e,t){e.exports=ReactAddonsTestUtils},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function T(e,t,n){null===e&&(e=Function.prototype)


var r=Object.getOwnPropertyDescriptor(e,t)
if(void 0===r){var i=Object.getPrototypeOf(e)
return null===i?void 0:T(i,t,n)}if("value"in r)return r.value
var o=r.get
if(void 0!==o)return o.call(n)},d=n(3),p=r(d),c=n(19),f=r(c),h=n(7),m=r(h),y=n(9),g=r(y),v=n(23),E=r(v),b=n(18),_=r(b),F=0,I=function(e){function t(e){i(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.dropzone=null,n.dragging=!1,n.handleAddedFile=n.handleAddedFile.bind(n),n.handleDragEnter=n.handleDragEnter.bind(n),n.handleDragLeave=n.handleDragLeave.bind(n),n.handleDrop=n.handleDrop.bind(n),
n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleError=n.handleError.bind(n),n.handleSending=n.handleSending.bind(n),n.handleSuccess=n.handleSuccess.bind(n),n.loadImage=n.loadImage.bind(n),
n}return l(t,e),s(t,[{key:"componentDidMount",value:function n(){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this)
var e=this.getDefaultOptions()
this.props.uploadButton===!0&&(e.clickable=(0,_["default"])(f["default"].findDOMNode(this)).find(".asset-dropzone__upload-button")[0]),this.props.uploadSelector&&(e.clickable=(0,_["default"])(f["default"].findDOMNode(this)).find(this.props.uploadSelector)[0]),
this.dropzone=new E["default"](f["default"].findDOMNode(this),a({},e,this.props.options)),"undefined"!=typeof this.props.promptOnRemove&&this.setPromptOnRemove(this.props.promptOnRemove)}},{key:"componentWillUnmount",
value:function r(){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentWillUnmount",this).call(this),this.dropzone.disable()}},{key:"render",value:function d(){var e=["asset-dropzone"]


this.props.className&&e.push(this.props.className)
var t={className:"asset-dropzone__upload-button ss-ui-button font-icon-upload",type:"button"}
return this.props.canUpload||(t.disabled=!0),this.dragging===!0&&e.push("dragging"),p["default"].createElement("div",{className:e.join(" ")},this.props.uploadButton&&p["default"].createElement("button",t,g["default"]._t("AssetAdmin.DROPZONE_UPLOAD")),this.props.children)

}},{key:"getDefaultOptions",value:function c(){return{autoProcessQueue:!1,addedfile:this.handleAddedFile,dragenter:this.handleDragEnter,dragleave:this.handleDragLeave,drop:this.handleDrop,uploadprogress:this.handleUploadProgress,
dictDefaultMessage:g["default"]._t("AssetAdmin.DROPZONE_DEFAULT_MESSAGE"),dictFallbackMessage:g["default"]._t("AssetAdmin.DROPZONE_FALLBACK_MESSAGE"),dictFallbackText:g["default"]._t("AssetAdmin.DROPZONE_FALLBACK_TEXT"),
dictInvalidFileType:g["default"]._t("AssetAdmin.DROPZONE_INVALID_FILE_TYPE"),dictResponseError:g["default"]._t("AssetAdmin.DROPZONE_RESPONSE_ERROR"),dictCancelUpload:g["default"]._t("AssetAdmin.DROPZONE_CANCEL_UPLOAD"),
dictCancelUploadConfirmation:g["default"]._t("AssetAdmin.DROPZONE_CANCEL_UPLOAD_CONFIRMATION"),dictRemoveFile:g["default"]._t("AssetAdmin.DROPZONE_REMOVE_FILE"),dictMaxFilesExceeded:g["default"]._t("AssetAdmin.DROPZONE_MAX_FILES_EXCEEDED"),
error:this.handleError,sending:this.handleSending,success:this.handleSuccess,thumbnailHeight:150,thumbnailWidth:200}}},{key:"getFileCategory",value:function h(e){return e.split("/")[0]}},{key:"handleDragEnter",
value:function m(e){this.props.canUpload&&(this.dragging=!0,this.forceUpdate(),"function"==typeof this.props.handleDragEnter&&this.props.handleDragEnter(e))}},{key:"handleDragLeave",value:function y(e){
var t=f["default"].findDOMNode(this)
this.props.canUpload&&e.target===t&&(this.dragging=!1,this.forceUpdate(),"function"==typeof this.props.handleDragLeave&&this.props.handleDragLeave(e,t))}},{key:"handleUploadProgress",value:function v(e,t,n){
"function"==typeof this.props.handleUploadProgress&&this.props.handleUploadProgress(e,t,n)}},{key:"handleDrop",value:function b(e){this.dragging=!1,this.forceUpdate(),"function"==typeof this.props.handleDrop&&this.props.handleDrop(e)

}},{key:"handleSending",value:function I(e,t,n){n.append("SecurityID",this.props.securityID),n.append("ParentID",this.props.folderId),"function"==typeof this.props.handleSending&&this.props.handleSending(e,t,n)

}},{key:"generateQueuedId",value:function T(){return++F}},{key:"handleAddedFile",value:function A(e){var t=this
if(!this.props.canUpload)return Promise.reject(new Error(g["default"]._t("AssetAdmin.DROPZONE_CANNOT_UPLOAD")))
e._queuedId=this.generateQueuedId()
var n=new Promise(function(n){var r=new FileReader
r.onload=function(r){if("image"===t.getFileCategory(e.type)){var i=document.createElement("img")
n(t.loadImage(i,r.target.result))}else n({})},r.readAsDataURL(e)})
return n.then(function(n){var r={dimensions:{height:n.height,width:n.width},category:t.getFileCategory(e.type),filename:e.name,queuedId:e._queuedId,size:t.getFileSize(e.size),title:t.getFileTitle(e.name),
extension:t.getFileExtension(e.name),type:e.type,url:n.thumbnailURL}
return t.props.handleAddedFile(r),t.dropzone.processFile(e),r})}},{key:"getFileTitle",value:function D(e){return e.replace(/[.][^.]+$/,"").replace(/-_/," ")}},{key:"getFileExtension",value:function P(e){
return/[.]/.exec(e)?e.replace(/^.+[.]/,""):""}},{key:"getFileSize",value:function O(e){if(e<1024)return e+" bytes"
if(e<10240){var t=Math.round(e/1024*10)/10
return t+" KB"}if(e<1048576){var n=Math.round(e/1024)
return n+" KB"}if(e<10485760){var r=Math.round(e/1048576*10)/10
return r+" MB"}if(e<1073741824){var i=Math.round(e/1048576)
return i+" MB"}var o=Math.round(e/1073741824*10)/10
return o+" GB"}},{key:"loadImage",value:function S(e,t){var n=this
return new Promise(function(r){e.onload=function(){var t=document.createElement("canvas"),i=t.getContext("2d"),o=2*n.props.preview.width,l=2*n.props.preview.height,a=e.naturalWidth/e.naturalHeight
e.naturalWidth<o||e.naturalHeight<l?(t.width=e.naturalWidth,t.height=e.naturalHeight):a<1?(t.width=o,t.height=o/a):(t.width=l*a,t.height=l),i.drawImage(e,0,0,t.width,t.height)
var s=t.toDataURL("image/png")
r({width:e.naturalWidth,height:e.naturalHeight,thumbnailURL:s})},e.src=t})}},{key:"handleError",value:function L(e,t){"function"==typeof this.props.handleError&&this.props.handleError(e,t)}},{key:"handleSuccess",
value:function w(e){this.props.handleSuccess(e)}},{key:"setPromptOnRemove",value:function C(e){this.dropzone.options.dictRemoveFileConfirmation=e}}]),t}(m["default"])
I.propTypes={folderId:p["default"].PropTypes.number.isRequired,handleAddedFile:p["default"].PropTypes.func.isRequired,handleDragEnter:p["default"].PropTypes.func,handleDragLeave:p["default"].PropTypes.func,
handleDrop:p["default"].PropTypes.func,handleError:p["default"].PropTypes.func.isRequired,handleSending:p["default"].PropTypes.func,handleSuccess:p["default"].PropTypes.func.isRequired,options:p["default"].PropTypes.shape({
url:p["default"].PropTypes.string.isRequired}),promptOnRemove:p["default"].PropTypes.string,securityID:p["default"].PropTypes.string.isRequired,uploadButton:p["default"].PropTypes.bool,uploadSelector:p["default"].PropTypes.string,
canUpload:p["default"].PropTypes.bool.isRequired,preview:p["default"].PropTypes.shape({width:p["default"].PropTypes.number,height:p["default"].PropTypes.number}),className:p["default"].PropTypes.string
},I.defaultProps={uploadButton:!0},t["default"]=I},function(e,t,n){(function(e,t){(function(){var n,r,i,o,l,a,s,u,d=[].slice,p={}.hasOwnProperty,c=function(e,t){function n(){this.constructor=e}for(var r in t)p.call(t,r)&&(e[r]=t[r])


return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e}
s=function(){},r=function(){function e(){}return e.prototype.addEventListener=e.prototype.on,e.prototype.on=function(e,t){return this._callbacks=this._callbacks||{},this._callbacks[e]||(this._callbacks[e]=[]),
this._callbacks[e].push(t),this},e.prototype.emit=function(){var e,t,n,r,i,o
if(r=arguments[0],e=2<=arguments.length?d.call(arguments,1):[],this._callbacks=this._callbacks||{},n=this._callbacks[r])for(i=0,o=n.length;i<o;i++)t=n[i],t.apply(this,e)
return this},e.prototype.removeListener=e.prototype.off,e.prototype.removeAllListeners=e.prototype.off,e.prototype.removeEventListener=e.prototype.off,e.prototype.off=function(e,t){var n,r,i,o,l
if(!this._callbacks||0===arguments.length)return this._callbacks={},this
if(r=this._callbacks[e],!r)return this
if(1===arguments.length)return delete this._callbacks[e],this
for(i=o=0,l=r.length;o<l;i=++o)if(n=r[i],n===t){r.splice(i,1)
break}return this},e}(),n=function(e){function t(e,r){var i,o,l
if(this.element=e,this.version=t.version,this.defaultOptions.previewTemplate=this.defaultOptions.previewTemplate.replace(/\n*/g,""),this.clickableElements=[],this.listeners=[],this.files=[],"string"==typeof this.element&&(this.element=document.querySelector(this.element)),
!this.element||null==this.element.nodeType)throw new Error("Invalid dropzone element.")
if(this.element.dropzone)throw new Error("Dropzone already attached.")
if(t.instances.push(this),this.element.dropzone=this,i=null!=(l=t.optionsForElement(this.element))?l:{},this.options=n({},this.defaultOptions,i,null!=r?r:{}),this.options.forceFallback||!t.isBrowserSupported())return this.options.fallback.call(this)


if(null==this.options.url&&(this.options.url=this.element.getAttribute("action")),!this.options.url)throw new Error("No URL provided.")
if(this.options.acceptedFiles&&this.options.acceptedMimeTypes)throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.")
this.options.acceptedMimeTypes&&(this.options.acceptedFiles=this.options.acceptedMimeTypes,delete this.options.acceptedMimeTypes),this.options.method=this.options.method.toUpperCase(),(o=this.getExistingFallback())&&o.parentNode&&o.parentNode.removeChild(o),
this.options.previewsContainer!==!1&&(this.options.previewsContainer?this.previewsContainer=t.getElement(this.options.previewsContainer,"previewsContainer"):this.previewsContainer=this.element),this.options.clickable&&(this.options.clickable===!0?this.clickableElements=[this.element]:this.clickableElements=t.getElements(this.options.clickable,"clickable")),
this.init()}var n,i
return c(t,e),t.prototype.Emitter=r,t.prototype.events=["drop","dragstart","dragend","dragenter","dragover","dragleave","addedfile","addedfiles","removedfile","thumbnail","error","errormultiple","processing","processingmultiple","uploadprogress","totaluploadprogress","sending","sendingmultiple","success","successmultiple","canceled","canceledmultiple","complete","completemultiple","reset","maxfilesexceeded","maxfilesreached","queuecomplete"],
t.prototype.defaultOptions={url:null,method:"post",withCredentials:!1,parallelUploads:2,uploadMultiple:!1,maxFilesize:256,paramName:"file",createImageThumbnails:!0,maxThumbnailFilesize:10,thumbnailWidth:120,
thumbnailHeight:120,filesizeBase:1e3,maxFiles:null,params:{},clickable:!0,ignoreHiddenFiles:!0,acceptedFiles:null,acceptedMimeTypes:null,autoProcessQueue:!0,autoQueue:!0,addRemoveLinks:!1,previewsContainer:null,
hiddenInputContainer:"body",capture:null,renameFilename:null,dictDefaultMessage:"Drop files here to upload",dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",dictFallbackText:"Please use the fallback form below to upload your files like in the olden days.",
dictFileTooBig:"File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",dictInvalidFileType:"You can't upload files of this type.",dictResponseError:"Server responded with {{statusCode}} code.",
dictCancelUpload:"Cancel upload",dictCancelUploadConfirmation:"Are you sure you want to cancel this upload?",dictRemoveFile:"Remove file",dictRemoveFileConfirmation:null,dictMaxFilesExceeded:"You can not upload any more files.",
accept:function(e,t){return t()},init:function(){return s},forceFallback:!1,fallback:function(){var e,n,r,i,o,l
for(this.element.className=""+this.element.className+" dz-browser-not-supported",l=this.element.getElementsByTagName("div"),i=0,o=l.length;i<o;i++)e=l[i],/(^| )dz-message($| )/.test(e.className)&&(n=e,
e.className="dz-message")
return n||(n=t.createElement('<div class="dz-message"><span></span></div>'),this.element.appendChild(n)),r=n.getElementsByTagName("span")[0],r&&(null!=r.textContent?r.textContent=this.options.dictFallbackMessage:null!=r.innerText&&(r.innerText=this.options.dictFallbackMessage)),
this.element.appendChild(this.getFallbackForm())},resize:function(e){var t,n,r
return t={srcX:0,srcY:0,srcWidth:e.width,srcHeight:e.height},n=e.width/e.height,t.optWidth=this.options.thumbnailWidth,t.optHeight=this.options.thumbnailHeight,null==t.optWidth&&null==t.optHeight?(t.optWidth=t.srcWidth,
t.optHeight=t.srcHeight):null==t.optWidth?t.optWidth=n*t.optHeight:null==t.optHeight&&(t.optHeight=1/n*t.optWidth),r=t.optWidth/t.optHeight,e.height<t.optHeight||e.width<t.optWidth?(t.trgHeight=t.srcHeight,
t.trgWidth=t.srcWidth):n>r?(t.srcHeight=e.height,t.srcWidth=t.srcHeight*r):(t.srcWidth=e.width,t.srcHeight=t.srcWidth/r),t.srcX=(e.width-t.srcWidth)/2,t.srcY=(e.height-t.srcHeight)/2,t},drop:function(e){
return this.element.classList.remove("dz-drag-hover")},dragstart:s,dragend:function(e){return this.element.classList.remove("dz-drag-hover")},dragenter:function(e){return this.element.classList.add("dz-drag-hover")

},dragover:function(e){return this.element.classList.add("dz-drag-hover")},dragleave:function(e){return this.element.classList.remove("dz-drag-hover")},paste:s,reset:function(){return this.element.classList.remove("dz-started")

},addedfile:function(e){var n,r,i,o,l,a,s,u,d,p,c,f,h
if(this.element===this.previewsContainer&&this.element.classList.add("dz-started"),this.previewsContainer){for(e.previewElement=t.createElement(this.options.previewTemplate.trim()),e.previewTemplate=e.previewElement,
this.previewsContainer.appendChild(e.previewElement),p=e.previewElement.querySelectorAll("[data-dz-name]"),o=0,s=p.length;o<s;o++)n=p[o],n.textContent=this._renameFilename(e.name)
for(c=e.previewElement.querySelectorAll("[data-dz-size]"),l=0,u=c.length;l<u;l++)n=c[l],n.innerHTML=this.filesize(e.size)
for(this.options.addRemoveLinks&&(e._removeLink=t.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>'+this.options.dictRemoveFile+"</a>"),e.previewElement.appendChild(e._removeLink)),
r=function(n){return function(r){return r.preventDefault(),r.stopPropagation(),e.status===t.UPLOADING?t.confirm(n.options.dictCancelUploadConfirmation,function(){return n.removeFile(e)}):n.options.dictRemoveFileConfirmation?t.confirm(n.options.dictRemoveFileConfirmation,function(){
return n.removeFile(e)}):n.removeFile(e)}}(this),f=e.previewElement.querySelectorAll("[data-dz-remove]"),h=[],a=0,d=f.length;a<d;a++)i=f[a],h.push(i.addEventListener("click",r))
return h}},removedfile:function(e){var t
return e.previewElement&&null!=(t=e.previewElement)&&t.parentNode.removeChild(e.previewElement),this._updateMaxFilesReachedClass()},thumbnail:function(e,t){var n,r,i,o
if(e.previewElement){for(e.previewElement.classList.remove("dz-file-preview"),o=e.previewElement.querySelectorAll("[data-dz-thumbnail]"),r=0,i=o.length;r<i;r++)n=o[r],n.alt=e.name,n.src=t
return setTimeout(function(t){return function(){return e.previewElement.classList.add("dz-image-preview")}}(this),1)}},error:function(e,t){var n,r,i,o,l
if(e.previewElement){for(e.previewElement.classList.add("dz-error"),"String"!=typeof t&&t.error&&(t=t.error),o=e.previewElement.querySelectorAll("[data-dz-errormessage]"),l=[],r=0,i=o.length;r<i;r++)n=o[r],
l.push(n.textContent=t)
return l}},errormultiple:s,processing:function(e){if(e.previewElement&&(e.previewElement.classList.add("dz-processing"),e._removeLink))return e._removeLink.textContent=this.options.dictCancelUpload},processingmultiple:s,
uploadprogress:function(e,t,n){var r,i,o,l,a
if(e.previewElement){for(l=e.previewElement.querySelectorAll("[data-dz-uploadprogress]"),a=[],i=0,o=l.length;i<o;i++)r=l[i],"PROGRESS"===r.nodeName?a.push(r.value=t):a.push(r.style.width=""+t+"%")
return a}},totaluploadprogress:s,sending:s,sendingmultiple:s,success:function(e){if(e.previewElement)return e.previewElement.classList.add("dz-success")},successmultiple:s,canceled:function(e){return this.emit("error",e,"Upload canceled.")

},canceledmultiple:s,complete:function(e){if(e._removeLink&&(e._removeLink.textContent=this.options.dictRemoveFile),e.previewElement)return e.previewElement.classList.add("dz-complete")},completemultiple:s,
maxfilesexceeded:s,maxfilesreached:s,queuecomplete:s,addedfiles:s,previewTemplate:'<div class="dz-preview dz-file-preview">\n  <div class="dz-image"><img data-dz-thumbnail /></div>\n  <div class="dz-details">\n    <div class="dz-size"><span data-dz-size></span></div>\n    <div class="dz-filename"><span data-dz-name></span></div>\n  </div>\n  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n  <div class="dz-success-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Check</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>\n      </g>\n    </svg>\n  </div>\n  <div class="dz-error-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Error</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">\n          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>'
},n=function(){var e,t,n,r,i,o,l
for(r=arguments[0],n=2<=arguments.length?d.call(arguments,1):[],o=0,l=n.length;o<l;o++){t=n[o]
for(e in t)i=t[e],r[e]=i}return r},t.prototype.getAcceptedFiles=function(){var e,t,n,r,i
for(r=this.files,i=[],t=0,n=r.length;t<n;t++)e=r[t],e.accepted&&i.push(e)
return i},t.prototype.getRejectedFiles=function(){var e,t,n,r,i
for(r=this.files,i=[],t=0,n=r.length;t<n;t++)e=r[t],e.accepted||i.push(e)
return i},t.prototype.getFilesWithStatus=function(e){var t,n,r,i,o
for(i=this.files,o=[],n=0,r=i.length;n<r;n++)t=i[n],t.status===e&&o.push(t)
return o},t.prototype.getQueuedFiles=function(){return this.getFilesWithStatus(t.QUEUED)},t.prototype.getUploadingFiles=function(){return this.getFilesWithStatus(t.UPLOADING)},t.prototype.getAddedFiles=function(){
return this.getFilesWithStatus(t.ADDED)},t.prototype.getActiveFiles=function(){var e,n,r,i,o
for(i=this.files,o=[],n=0,r=i.length;n<r;n++)e=i[n],e.status!==t.UPLOADING&&e.status!==t.QUEUED||o.push(e)
return o},t.prototype.init=function(){var e,n,r,i,o,l,a
for("form"===this.element.tagName&&this.element.setAttribute("enctype","multipart/form-data"),this.element.classList.contains("dropzone")&&!this.element.querySelector(".dz-message")&&this.element.appendChild(t.createElement('<div class="dz-default dz-message"><span>'+this.options.dictDefaultMessage+"</span></div>")),
this.clickableElements.length&&(r=function(e){return function(){return e.hiddenFileInput&&e.hiddenFileInput.parentNode.removeChild(e.hiddenFileInput),e.hiddenFileInput=document.createElement("input"),e.hiddenFileInput.setAttribute("type","file"),
(null==e.options.maxFiles||e.options.maxFiles>1)&&e.hiddenFileInput.setAttribute("multiple","multiple"),e.hiddenFileInput.className="dz-hidden-input",null!=e.options.acceptedFiles&&e.hiddenFileInput.setAttribute("accept",e.options.acceptedFiles),
null!=e.options.capture&&e.hiddenFileInput.setAttribute("capture",e.options.capture),e.hiddenFileInput.style.visibility="hidden",e.hiddenFileInput.style.position="absolute",e.hiddenFileInput.style.top="0",
e.hiddenFileInput.style.left="0",e.hiddenFileInput.style.height="0",e.hiddenFileInput.style.width="0",document.querySelector(e.options.hiddenInputContainer).appendChild(e.hiddenFileInput),e.hiddenFileInput.addEventListener("change",function(){
var t,n,i,o
if(n=e.hiddenFileInput.files,n.length)for(i=0,o=n.length;i<o;i++)t=n[i],e.addFile(t)
return e.emit("addedfiles",n),r()})}}(this))(),this.URL=null!=(l=window.URL)?l:window.webkitURL,a=this.events,i=0,o=a.length;i<o;i++)e=a[i],this.on(e,this.options[e])
return this.on("uploadprogress",function(e){return function(){return e.updateTotalUploadProgress()}}(this)),this.on("removedfile",function(e){return function(){return e.updateTotalUploadProgress()}}(this)),
this.on("canceled",function(e){return function(t){return e.emit("complete",t)}}(this)),this.on("complete",function(e){return function(t){if(0===e.getAddedFiles().length&&0===e.getUploadingFiles().length&&0===e.getQueuedFiles().length)return setTimeout(function(){
return e.emit("queuecomplete")},0)}}(this)),n=function(e){return e.stopPropagation(),e.preventDefault?e.preventDefault():e.returnValue=!1},this.listeners=[{element:this.element,events:{dragstart:function(e){
return function(t){return e.emit("dragstart",t)}}(this),dragenter:function(e){return function(t){return n(t),e.emit("dragenter",t)}}(this),dragover:function(e){return function(t){var r
try{r=t.dataTransfer.effectAllowed}catch(i){}return t.dataTransfer.dropEffect="move"===r||"linkMove"===r?"move":"copy",n(t),e.emit("dragover",t)}}(this),dragleave:function(e){return function(t){return e.emit("dragleave",t)

}}(this),drop:function(e){return function(t){return n(t),e.drop(t)}}(this),dragend:function(e){return function(t){return e.emit("dragend",t)}}(this)}}],this.clickableElements.forEach(function(e){return function(n){
return e.listeners.push({element:n,events:{click:function(r){return(n!==e.element||r.target===e.element||t.elementInside(r.target,e.element.querySelector(".dz-message")))&&e.hiddenFileInput.click(),!0}
}})}}(this)),this.enable(),this.options.init.call(this)},t.prototype.destroy=function(){var e
return this.disable(),this.removeAllFiles(!0),(null!=(e=this.hiddenFileInput)?e.parentNode:void 0)&&(this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput),this.hiddenFileInput=null),delete this.element.dropzone,
t.instances.splice(t.instances.indexOf(this),1)},t.prototype.updateTotalUploadProgress=function(){var e,t,n,r,i,o,l,a
if(r=0,n=0,e=this.getActiveFiles(),e.length){for(a=this.getActiveFiles(),o=0,l=a.length;o<l;o++)t=a[o],r+=t.upload.bytesSent,n+=t.upload.total
i=100*r/n}else i=100
return this.emit("totaluploadprogress",i,n,r)},t.prototype._getParamName=function(e){return"function"==typeof this.options.paramName?this.options.paramName(e):""+this.options.paramName+(this.options.uploadMultiple?"["+e+"]":"")

},t.prototype._renameFilename=function(e){return"function"!=typeof this.options.renameFilename?e:this.options.renameFilename(e)},t.prototype.getFallbackForm=function(){var e,n,r,i
return(e=this.getExistingFallback())?e:(r='<div class="dz-fallback">',this.options.dictFallbackText&&(r+="<p>"+this.options.dictFallbackText+"</p>"),r+='<input type="file" name="'+this._getParamName(0)+'" '+(this.options.uploadMultiple?'multiple="multiple"':void 0)+' /><input type="submit" value="Upload!"></div>',
n=t.createElement(r),"FORM"!==this.element.tagName?(i=t.createElement('<form action="'+this.options.url+'" enctype="multipart/form-data" method="'+this.options.method+'"></form>'),i.appendChild(n)):(this.element.setAttribute("enctype","multipart/form-data"),
this.element.setAttribute("method",this.options.method)),null!=i?i:n)},t.prototype.getExistingFallback=function(){var e,t,n,r,i,o
for(t=function(e){var t,n,r
for(n=0,r=e.length;n<r;n++)if(t=e[n],/(^| )fallback($| )/.test(t.className))return t},o=["div","form"],r=0,i=o.length;r<i;r++)if(n=o[r],e=t(this.element.getElementsByTagName(n)))return e},t.prototype.setupEventListeners=function(){
var e,t,n,r,i,o,l
for(o=this.listeners,l=[],r=0,i=o.length;r<i;r++)e=o[r],l.push(function(){var r,i
r=e.events,i=[]
for(t in r)n=r[t],i.push(e.element.addEventListener(t,n,!1))
return i}())
return l},t.prototype.removeEventListeners=function(){var e,t,n,r,i,o,l
for(o=this.listeners,l=[],r=0,i=o.length;r<i;r++)e=o[r],l.push(function(){var r,i
r=e.events,i=[]
for(t in r)n=r[t],i.push(e.element.removeEventListener(t,n,!1))
return i}())
return l},t.prototype.disable=function(){var e,t,n,r,i
for(this.clickableElements.forEach(function(e){return e.classList.remove("dz-clickable")}),this.removeEventListeners(),r=this.files,i=[],t=0,n=r.length;t<n;t++)e=r[t],i.push(this.cancelUpload(e))
return i},t.prototype.enable=function(){return this.clickableElements.forEach(function(e){return e.classList.add("dz-clickable")}),this.setupEventListeners()},t.prototype.filesize=function(e){var t,n,r,i,o,l,a,s


if(r=0,i="b",e>0){for(l=["TB","GB","MB","KB","b"],n=a=0,s=l.length;a<s;n=++a)if(o=l[n],t=Math.pow(this.options.filesizeBase,4-n)/10,e>=t){r=e/Math.pow(this.options.filesizeBase,4-n),i=o
break}r=Math.round(10*r)/10}return"<strong>"+r+"</strong> "+i},t.prototype._updateMaxFilesReachedClass=function(){return null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(this.getAcceptedFiles().length===this.options.maxFiles&&this.emit("maxfilesreached",this.files),
this.element.classList.add("dz-max-files-reached")):this.element.classList.remove("dz-max-files-reached")},t.prototype.drop=function(e){var t,n
e.dataTransfer&&(this.emit("drop",e),t=e.dataTransfer.files,this.emit("addedfiles",t),t.length&&(n=e.dataTransfer.items,n&&n.length&&null!=n[0].webkitGetAsEntry?this._addFilesFromItems(n):this.handleFiles(t)))

},t.prototype.paste=function(e){var t,n
if(null!=(null!=e&&null!=(n=e.clipboardData)?n.items:void 0))return this.emit("paste",e),t=e.clipboardData.items,t.length?this._addFilesFromItems(t):void 0},t.prototype.handleFiles=function(e){var t,n,r,i


for(i=[],n=0,r=e.length;n<r;n++)t=e[n],i.push(this.addFile(t))
return i},t.prototype._addFilesFromItems=function(e){var t,n,r,i,o
for(o=[],r=0,i=e.length;r<i;r++)n=e[r],null!=n.webkitGetAsEntry&&(t=n.webkitGetAsEntry())?t.isFile?o.push(this.addFile(n.getAsFile())):t.isDirectory?o.push(this._addFilesFromDirectory(t,t.name)):o.push(void 0):null!=n.getAsFile&&(null==n.kind||"file"===n.kind)?o.push(this.addFile(n.getAsFile())):o.push(void 0)


return o},t.prototype._addFilesFromDirectory=function(e,t){var n,r,i
return n=e.createReader(),r=function(e){return"undefined"!=typeof console&&null!==console&&"function"==typeof console.log?console.log(e):void 0},(i=function(e){return function(){return n.readEntries(function(n){
var r,o,l
if(n.length>0){for(o=0,l=n.length;o<l;o++)r=n[o],r.isFile?r.file(function(n){if(!e.options.ignoreHiddenFiles||"."!==n.name.substring(0,1))return n.fullPath=""+t+"/"+n.name,e.addFile(n)}):r.isDirectory&&e._addFilesFromDirectory(r,""+t+"/"+r.name)


i()}return null},r)}}(this))()},t.prototype.accept=function(e,n){return e.size>1024*this.options.maxFilesize*1024?n(this.options.dictFileTooBig.replace("{{filesize}}",Math.round(e.size/1024/10.24)/100).replace("{{maxFilesize}}",this.options.maxFilesize)):t.isValidFile(e,this.options.acceptedFiles)?null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(n(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}",this.options.maxFiles)),
this.emit("maxfilesexceeded",e)):this.options.accept.call(this,e,n):n(this.options.dictInvalidFileType)},t.prototype.addFile=function(e){return e.upload={progress:0,total:e.size,bytesSent:0},this.files.push(e),
e.status=t.ADDED,this.emit("addedfile",e),this._enqueueThumbnail(e),this.accept(e,function(t){return function(n){return n?(e.accepted=!1,t._errorProcessing([e],n)):(e.accepted=!0,t.options.autoQueue&&t.enqueueFile(e)),
t._updateMaxFilesReachedClass()}}(this))},t.prototype.enqueueFiles=function(e){var t,n,r
for(n=0,r=e.length;n<r;n++)t=e[n],this.enqueueFile(t)
return null},t.prototype.enqueueFile=function(e){if(e.status!==t.ADDED||e.accepted!==!0)throw new Error("This file can't be queued because it has already been processed or was rejected.")
if(e.status=t.QUEUED,this.options.autoProcessQueue)return setTimeout(function(e){return function(){return e.processQueue()}}(this),0)},t.prototype._thumbnailQueue=[],t.prototype._processingThumbnail=!1,
t.prototype._enqueueThumbnail=function(e){if(this.options.createImageThumbnails&&e.type.match(/image.*/)&&e.size<=1024*this.options.maxThumbnailFilesize*1024)return this._thumbnailQueue.push(e),setTimeout(function(e){
return function(){return e._processThumbnailQueue()}}(this),0)},t.prototype._processThumbnailQueue=function(){if(!this._processingThumbnail&&0!==this._thumbnailQueue.length)return this._processingThumbnail=!0,
this.createThumbnail(this._thumbnailQueue.shift(),function(e){return function(){return e._processingThumbnail=!1,e._processThumbnailQueue()}}(this))},t.prototype.removeFile=function(e){if(e.status===t.UPLOADING&&this.cancelUpload(e),
this.files=u(this.files,e),this.emit("removedfile",e),0===this.files.length)return this.emit("reset")},t.prototype.removeAllFiles=function(e){var n,r,i,o
for(null==e&&(e=!1),o=this.files.slice(),r=0,i=o.length;r<i;r++)n=o[r],(n.status!==t.UPLOADING||e)&&this.removeFile(n)
return null},t.prototype.createThumbnail=function(e,t){var n
return n=new FileReader,n.onload=function(r){return function(){return"image/svg+xml"===e.type?(r.emit("thumbnail",e,n.result),void(null!=t&&t())):r.createThumbnailFromUrl(e,n.result,t)}}(this),n.readAsDataURL(e)

},t.prototype.createThumbnailFromUrl=function(e,t,n,r){var i
return i=document.createElement("img"),r&&(i.crossOrigin=r),i.onload=function(t){return function(){var r,o,l,s,u,d,p,c
if(e.width=i.width,e.height=i.height,l=t.options.resize.call(t,e),null==l.trgWidth&&(l.trgWidth=l.optWidth),null==l.trgHeight&&(l.trgHeight=l.optHeight),r=document.createElement("canvas"),o=r.getContext("2d"),
r.width=l.trgWidth,r.height=l.trgHeight,a(o,i,null!=(u=l.srcX)?u:0,null!=(d=l.srcY)?d:0,l.srcWidth,l.srcHeight,null!=(p=l.trgX)?p:0,null!=(c=l.trgY)?c:0,l.trgWidth,l.trgHeight),s=r.toDataURL("image/png"),
t.emit("thumbnail",e,s),null!=n)return n()}}(this),null!=n&&(i.onerror=n),i.src=t},t.prototype.processQueue=function(){var e,t,n,r
if(t=this.options.parallelUploads,n=this.getUploadingFiles().length,e=n,!(n>=t)&&(r=this.getQueuedFiles(),r.length>0)){if(this.options.uploadMultiple)return this.processFiles(r.slice(0,t-n))
for(;e<t;){if(!r.length)return
this.processFile(r.shift()),e++}}},t.prototype.processFile=function(e){return this.processFiles([e])},t.prototype.processFiles=function(e){var n,r,i
for(r=0,i=e.length;r<i;r++)n=e[r],n.processing=!0,n.status=t.UPLOADING,this.emit("processing",n)
return this.options.uploadMultiple&&this.emit("processingmultiple",e),this.uploadFiles(e)},t.prototype._getFilesWithXhr=function(e){var t,n
return n=function(){var n,r,i,o
for(i=this.files,o=[],n=0,r=i.length;n<r;n++)t=i[n],t.xhr===e&&o.push(t)
return o}.call(this)},t.prototype.cancelUpload=function(e){var n,r,i,o,l,a,s
if(e.status===t.UPLOADING){for(r=this._getFilesWithXhr(e.xhr),i=0,l=r.length;i<l;i++)n=r[i],n.status=t.CANCELED
for(e.xhr.abort(),o=0,a=r.length;o<a;o++)n=r[o],this.emit("canceled",n)
this.options.uploadMultiple&&this.emit("canceledmultiple",r)}else(s=e.status)!==t.ADDED&&s!==t.QUEUED||(e.status=t.CANCELED,this.emit("canceled",e),this.options.uploadMultiple&&this.emit("canceledmultiple",[e]))


if(this.options.autoProcessQueue)return this.processQueue()},i=function(){var e,t
return t=arguments[0],e=2<=arguments.length?d.call(arguments,1):[],"function"==typeof t?t.apply(this,e):t},t.prototype.uploadFile=function(e){return this.uploadFiles([e])},t.prototype.uploadFiles=function(e){
var r,o,l,a,s,u,d,p,c,f,h,m,y,g,v,E,b,_,F,I,T,A,D,P,O,S,L,w,C,k,U,R,M,N
for(F=new XMLHttpRequest,I=0,P=e.length;I<P;I++)r=e[I],r.xhr=F
m=i(this.options.method,e),b=i(this.options.url,e),F.open(m,b,!0),F.withCredentials=!!this.options.withCredentials,v=null,l=function(t){return function(){var n,i,o
for(o=[],n=0,i=e.length;n<i;n++)r=e[n],o.push(t._errorProcessing(e,v||t.options.dictResponseError.replace("{{statusCode}}",F.status),F))
return o}}(this),E=function(t){return function(n){var i,o,l,a,s,u,d,p,c
if(null!=n)for(o=100*n.loaded/n.total,l=0,u=e.length;l<u;l++)r=e[l],r.upload={progress:o,total:n.total,bytesSent:n.loaded}
else{for(i=!0,o=100,a=0,d=e.length;a<d;a++)r=e[a],100===r.upload.progress&&r.upload.bytesSent===r.upload.total||(i=!1),r.upload.progress=o,r.upload.bytesSent=r.upload.total
if(i)return}for(c=[],s=0,p=e.length;s<p;s++)r=e[s],c.push(t.emit("uploadprogress",r,o,r.upload.bytesSent))
return c}}(this),F.onload=function(n){return function(r){var i
if(e[0].status!==t.CANCELED&&4===F.readyState){if(v=F.responseText,F.getResponseHeader("content-type")&&~F.getResponseHeader("content-type").indexOf("application/json"))try{v=JSON.parse(v)}catch(o){r=o,
v="Invalid JSON response from server."}return E(),200<=(i=F.status)&&i<300?n._finished(e,v,r):l()}}}(this),F.onerror=function(n){return function(){if(e[0].status!==t.CANCELED)return l()}}(this),g=null!=(C=F.upload)?C:F,
g.onprogress=E,u={Accept:"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"},this.options.headers&&n(u,this.options.headers)
for(a in u)s=u[a],s&&F.setRequestHeader(a,s)
if(o=new FormData,this.options.params){k=this.options.params
for(h in k)_=k[h],o.append(h,_)}for(T=0,O=e.length;T<O;T++)r=e[T],this.emit("sending",r,F,o)
if(this.options.uploadMultiple&&this.emit("sendingmultiple",e,F,o),"FORM"===this.element.tagName)for(U=this.element.querySelectorAll("input, textarea, select, button"),A=0,S=U.length;A<S;A++)if(p=U[A],
c=p.getAttribute("name"),f=p.getAttribute("type"),"SELECT"===p.tagName&&p.hasAttribute("multiple"))for(R=p.options,D=0,L=R.length;D<L;D++)y=R[D],y.selected&&o.append(c,y.value)
else(!f||"checkbox"!==(M=f.toLowerCase())&&"radio"!==M||p.checked)&&o.append(c,p.value)
for(d=w=0,N=e.length-1;0<=N?w<=N:w>=N;d=0<=N?++w:--w)o.append(this._getParamName(d),e[d],this._renameFilename(e[d].name))
return this.submitRequest(F,o,e)},t.prototype.submitRequest=function(e,t,n){return e.send(t)},t.prototype._finished=function(e,n,r){var i,o,l
for(o=0,l=e.length;o<l;o++)i=e[o],i.status=t.SUCCESS,this.emit("success",i,n,r),this.emit("complete",i)
if(this.options.uploadMultiple&&(this.emit("successmultiple",e,n,r),this.emit("completemultiple",e)),this.options.autoProcessQueue)return this.processQueue()},t.prototype._errorProcessing=function(e,n,r){
var i,o,l
for(o=0,l=e.length;o<l;o++)i=e[o],i.status=t.ERROR,this.emit("error",i,n,r),this.emit("complete",i)
if(this.options.uploadMultiple&&(this.emit("errormultiple",e,n,r),this.emit("completemultiple",e)),this.options.autoProcessQueue)return this.processQueue()},t}(r),n.version="4.3.0",n.options={},n.optionsForElement=function(e){
return e.getAttribute("id")?n.options[i(e.getAttribute("id"))]:void 0},n.instances=[],n.forElement=function(e){if("string"==typeof e&&(e=document.querySelector(e)),null==(null!=e?e.dropzone:void 0))throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.")


return e.dropzone},n.autoDiscover=!0,n.discover=function(){var e,t,r,i,o,l
for(document.querySelectorAll?r=document.querySelectorAll(".dropzone"):(r=[],e=function(e){var t,n,i,o
for(o=[],n=0,i=e.length;n<i;n++)t=e[n],/(^| )dropzone($| )/.test(t.className)?o.push(r.push(t)):o.push(void 0)
return o},e(document.getElementsByTagName("div")),e(document.getElementsByTagName("form"))),l=[],i=0,o=r.length;i<o;i++)t=r[i],n.optionsForElement(t)!==!1?l.push(new n(t)):l.push(void 0)
return l},n.blacklistedBrowsers=[/opera.*Macintosh.*version\/12/i],n.isBrowserSupported=function(){var e,t,r,i,o
if(e=!0,window.File&&window.FileReader&&window.FileList&&window.Blob&&window.FormData&&document.querySelector)if("classList"in document.createElement("a"))for(o=n.blacklistedBrowsers,r=0,i=o.length;r<i;r++)t=o[r],
t.test(navigator.userAgent)&&(e=!1)
else e=!1
else e=!1
return e},u=function(e,t){var n,r,i,o
for(o=[],r=0,i=e.length;r<i;r++)n=e[r],n!==t&&o.push(n)
return o},i=function(e){return e.replace(/[\-_](\w)/g,function(e){return e.charAt(1).toUpperCase()})},n.createElement=function(e){var t
return t=document.createElement("div"),t.innerHTML=e,t.childNodes[0]},n.elementInside=function(e,t){if(e===t)return!0
for(;e=e.parentNode;)if(e===t)return!0
return!1},n.getElement=function(e,t){var n
if("string"==typeof e?n=document.querySelector(e):null!=e.nodeType&&(n=e),null==n)throw new Error("Invalid `"+t+"` option provided. Please provide a CSS selector or a plain HTML element.")
return n},n.getElements=function(e,t){var n,r,i,o,l,a,s,u
if(e instanceof Array){i=[]
try{for(o=0,a=e.length;o<a;o++)r=e[o],i.push(this.getElement(r,t))}catch(d){n=d,i=null}}else if("string"==typeof e)for(i=[],u=document.querySelectorAll(e),l=0,s=u.length;l<s;l++)r=u[l],i.push(r)
else null!=e.nodeType&&(i=[e])
if(null==i||!i.length)throw new Error("Invalid `"+t+"` option provided. Please provide a CSS selector, a plain HTML element or a list of those.")
return i},n.confirm=function(e,t,n){return window.confirm(e)?t():null!=n?n():void 0},n.isValidFile=function(e,t){var n,r,i,o,l
if(!t)return!0
for(t=t.split(","),r=e.type,n=r.replace(/\/.*$/,""),o=0,l=t.length;o<l;o++)if(i=t[o],i=i.trim(),"."===i.charAt(0)){if(e.name.toLowerCase().indexOf(i.toLowerCase(),e.name.length-i.length)!==-1)return!0}else if(/\/\*$/.test(i)){
if(n===i.replace(/\/.*$/,""))return!0}else if(r===i)return!0
return!1},"undefined"!=typeof e&&null!==e&&(e.fn.dropzone=function(e){return this.each(function(){return new n(this,e)})}),"undefined"!=typeof t&&null!==t?t.exports=n:window.Dropzone=n,n.ADDED="added",
n.QUEUED="queued",n.ACCEPTED=n.QUEUED,n.UPLOADING="uploading",n.PROCESSING=n.UPLOADING,n.CANCELED="canceled",n.ERROR="error",n.SUCCESS="success",l=function(e){var t,n,r,i,o,l,a,s,u,d
for(a=e.naturalWidth,l=e.naturalHeight,n=document.createElement("canvas"),n.width=1,n.height=l,r=n.getContext("2d"),r.drawImage(e,0,0),i=r.getImageData(0,0,1,l).data,d=0,o=l,s=l;s>d;)t=i[4*(s-1)+3],0===t?o=s:d=s,
s=o+d>>1
return u=s/l,0===u?1:u},a=function(e,t,n,r,i,o,a,s,u,d){var p
return p=l(t),e.drawImage(t,n,r,i,o,a,s,u,d/p)},o=function(e,t){var n,r,i,o,l,a,s,u,d
if(i=!1,d=!0,r=e.document,u=r.documentElement,n=r.addEventListener?"addEventListener":"attachEvent",s=r.addEventListener?"removeEventListener":"detachEvent",a=r.addEventListener?"":"on",o=function(n){if("readystatechange"!==n.type||"complete"===r.readyState)return("load"===n.type?e:r)[s](a+n.type,o,!1),
!i&&(i=!0)?t.call(e,n.type||n):void 0},l=function(){var e
try{u.doScroll("left")}catch(t){return e=t,void setTimeout(l,50)}return o("poll")},"complete"!==r.readyState){if(r.createEventObject&&u.doScroll){try{d=!e.frameElement}catch(p){}d&&l()}return r[n](a+"DOMContentLoaded",o,!1),
r[n](a+"readystatechange",o,!1),e[n](a+"load",o,!1)}},n._autoDiscoverFunction=function(){if(n.autoDiscover)return n.discover()},o(window,n._autoDiscoverFunction)}).call(this)}).call(t,n(18),n(24)(e))},function(e,t){
e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],e.webpackPolyfill=1),e}},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(9),u=r(s),d=n(3),p=r(d),c=n(14),f=r(c),h=n(7),m=r(h),y=n(26),g=r(y),v=function(e){
function t(e){i(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleToggleSelect=n.handleToggleSelect.bind(n),n.handleDelete=n.handleDelete.bind(n),n.handleActivate=n.handleActivate.bind(n),n.handleKeyDown=n.handleKeyDown.bind(n),n.handleCancelUpload=n.handleCancelUpload.bind(n),
n.preventFocus=n.preventFocus.bind(n),n}return l(t,e),a(t,[{key:"handleActivate",value:function n(e){e.stopPropagation(),this.props.handleActivate(e,this.props.item)}},{key:"handleToggleSelect",value:function r(e){
e.stopPropagation(),e.preventDefault(),"function"==typeof this.props.handleToggleSelect&&this.props.handleToggleSelect(e,this.props.item)}},{key:"handleDelete",value:function s(e){this.props.handleDelete(e,this.props.item)

}},{key:"getThumbnailStyles",value:function d(){if(this.isImage()&&(this.exists()||this.uploading())){var e=this.props.item.thumbnail||this.props.item.url
return{backgroundImage:"url("+e+")"}}return{}}},{key:"hasError",value:function c(){var c=!1
return this.props.message&&(c="error"===this.props.message.type),c}},{key:"getErrorMessage",value:function h(){var e=null
return this.hasError()?e=this.props.message.value:this.exists()||this.uploading()||(e=u["default"]._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==e?p["default"].createElement("span",{className:"gallery-item__error-message"
},e):null}},{key:"getThumbnailClassNames",value:function m(){var e=["gallery-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&e.push("gallery-item__thumbnail--small"),e.join(" ")}},{key:"getItemClassNames",value:function y(){var e=this.props.item.category||"false",t=["gallery-item gallery-item--"+e]


return this.exists()||this.uploading()||t.push("gallery-item--missing"),this.props.selectable&&(t.push("gallery-item--selectable"),this.props.selected&&t.push("gallery-item--selected")),this.props.highlighted&&t.push("gallery-item--highlighted"),
this.hasError()&&t.push("gallery-item--error"),t.join(" ")}},{key:"getStatusFlags",value:function g(){var e=[]
return"folder"!==this.props.item.type&&(this.props.item.draft?e.push(p["default"].createElement("span",{key:"status-draft",title:u["default"]._t("File.DRAFT","Draft"),className:"gallery-item--draft"})):this.props.item.modified&&e.push(p["default"].createElement("span",{
key:"status-modified",title:u["default"]._t("File.MODIFIED","Modified"),className:"gallery-item--modified"}))),e}},{key:"isImage",value:function v(){return"image"===this.props.item.category}},{key:"exists",
value:function E(){return this.props.item.exists}},{key:"uploading",value:function b(){return this.props.uploading}},{key:"isImageSmallerThanThumbnail",value:function _(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1


var e=this.props.item.dimensions
return e&&e.height<f["default"].THUMBNAIL_HEIGHT&&e.width<f["default"].THUMBNAIL_WIDTH}},{key:"handleKeyDown",value:function F(e){e.stopPropagation(),f["default"].SPACE_KEY_CODE===e.keyCode&&(e.preventDefault(),
this.handleToggleSelect(e)),f["default"].RETURN_KEY_CODE===e.keyCode&&this.handleActivate(e)}},{key:"preventFocus",value:function I(e){e.preventDefault()}},{key:"handleCancelUpload",value:function T(e){
e.stopPropagation(),this.hasError()?this.props.handleRemoveErroredUpload(this.props.item):this.props.handleCancelUpload(this.props.item)}},{key:"getProgressBar",value:function A(){var e=null,t={className:"gallery-item__progress-bar",
style:{width:this.props.item.progress+"%"}}
return!this.hasError()&&this.uploading()&&(e=p["default"].createElement("div",{className:"gallery-item__upload-progress"},p["default"].createElement("div",t))),e}},{key:"render",value:function D(){var e=null,t=null,n=null


return this.props.selectable&&(e=this.handleToggleSelect,t="font-icon-tick"),this.uploading()?(e=this.handleCancelUpload,t="font-icon-cancel"):this.exists()&&(n=p["default"].createElement("div",{className:"gallery-item--overlay font-icon-edit"
},"View")),p["default"].createElement("div",{className:this.getItemClassNames(),"data-id":this.props.item.id,tabIndex:"0",onKeyDown:this.handleKeyDown,onClick:this.handleActivate},p["default"].createElement("div",{
ref:"thumbnail",className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()},n,this.getStatusFlags()),this.getProgressBar(),this.getErrorMessage(),p["default"].createElement("div",{className:"gallery-item__title",
ref:"title"},p["default"].createElement("label",{className:"gallery-item__checkbox-label "+t,onClick:e},p["default"].createElement("input",{className:"gallery-item__checkbox",type:"checkbox",title:u["default"]._t("AssetAdmin.SELECT"),
tabIndex:"-1",onMouseDown:this.preventFocus})),this.props.item.title))}}]),t}(m["default"])
v.propTypes={item:g["default"],highlighted:d.PropTypes.bool,selected:d.PropTypes.bool.isRequired,handleActivate:d.PropTypes.func.isRequired,handleToggleSelect:d.PropTypes.func,handleDelete:d.PropTypes.func.isRequired,
message:d.PropTypes.shape({value:d.PropTypes.string,type:d.PropTypes.string}),uploading:d.PropTypes.bool,selectable:d.PropTypes.bool},t["default"]=v},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var i=n(3),o=r(i),l=o["default"].PropTypes.shape({exists:o["default"].PropTypes.bool,type:o["default"].PropTypes.string,smallThumbnail:o["default"].PropTypes.string,thumbnail:o["default"].PropTypes.string,
dimensions:o["default"].PropTypes.shape({width:o["default"].PropTypes.number,height:o["default"].PropTypes.number}),category:o["default"].PropTypes.oneOfType([o["default"].PropTypes.bool,o["default"].PropTypes.string]).isRequired,
id:o["default"].PropTypes.number.isRequired,url:o["default"].PropTypes.string,title:o["default"].PropTypes.string.isRequired,progress:o["default"].PropTypes.number})
t["default"]=l},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return{gallery:e.assetAdmin.gallery
}}Object.defineProperty(t,"__esModule",{value:!0}),t.BulkActions=void 0
var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(18),d=r(u),p=n(3),c=r(p),f=n(19),h=r(f),m=n(7),y=r(m),g=n(21),v=r(g),E=n(5),b=t.BulkActions=function(e){
function t(e){i(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.onChangeValue=n.onChangeValue.bind(n),n}return l(t,e),s(t,[{key:"componentDidMount",value:function n(){var e=(0,d["default"])(h["default"].findDOMNode(this)).find(".dropdown")
e.chosen({allow_single_deselect:!0,disable_search_threshold:20}),e.change(function(){return v["default"].Simulate.click(e.find(":selected")[0])})}},{key:"render",value:function r(){var e=this,t=this.props.actions.map(function(t,n){
var r=e.props.items.length&&(!t.canApply||t.canApply(e.props.items))
if(!r)return""
var i=["bulk-actions_action","ss-ui-button","ui-corner-all",t.className||"font-icon-info-circled"].join(" ")
return c["default"].createElement("button",{type:"button",className:i,key:n,onClick:e.onChangeValue,value:t.value},t.label)})
return c["default"].createElement("div",{className:"bulk-actions fieldholder-small"},c["default"].createElement("div",{className:"bulk-actions-counter"},this.props.items.length),t)}},{key:"getOptionByValue",
value:function a(e){return this.props.actions.find(function(t){return t.value===e})}},{key:"onChangeValue",value:function u(e){var t=this,n=null,r=this.getOptionByValue(e.target.value)
return null===r?null:(n="function"==typeof r.confirm?r.confirm(this.props.items).then(function(){return r.callback(t.props.items)}):r.callback(this.props.items)||Promise.resolve(),(0,d["default"])(h["default"].findDOMNode(this)).find(".dropdown").val("").trigger("liszt:updated"),
n)}}]),t}(y["default"])
b.propTypes={items:c["default"].PropTypes.array,actions:c["default"].PropTypes.arrayOf(c["default"].PropTypes.shape({value:c["default"].PropTypes.string.isRequired,label:c["default"].PropTypes.string.isRequired,
className:c["default"].PropTypes.string,destructive:c["default"].PropTypes.bool,callback:c["default"].PropTypes.func,canApply:c["default"].PropTypes.func,confirm:c["default"].PropTypes.func}))},t["default"]=(0,
E.connect)(a)(b)},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(e){return function(t){return t({type:p["default"].ADD_QUEUED_FILE,payload:{file:e}})}}function o(e,t){return function(n){var r=t.message
return"string"==typeof t&&(r={value:t,type:"error"}),n({type:p["default"].FAIL_UPLOAD,payload:{queuedId:e,message:r}})}}function l(){return function(e){return e({type:p["default"].PURGE_UPLOAD_QUEUE,payload:null
})}}function a(e){return function(t){return t({type:p["default"].REMOVE_QUEUED_FILE,payload:{queuedId:e}})}}function s(e){return function(t){return t({type:p["default"].SUCCEED_UPLOAD,payload:{queuedId:e
}})}}function u(e,t){return function(n){return n({type:p["default"].UPDATE_QUEUED_FILE,payload:{queuedId:e,updates:t}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addQueuedFile=i,t.failUpload=o,
t.purgeUploadQueue=l,t.removeQueuedFile=a,t.succeedUpload=s,t.updateQueuedFile=u
var d=n(29),p=r(d)},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={ADD_QUEUED_FILE:"ADD_QUEUED_FILE",FAIL_UPLOAD:"FAIL_UPLOAD",PURGE_UPLOAD_QUEUE:"PURGE_UPLOAD_QUEUE",REMOVE_QUEUED_FILE:"REMOVE_QUEUED_FILE",
SUCCEED_UPLOAD:"SUCCEED_UPLOAD",UPDATE_QUEUED_FILE:"UPDATE_QUEUED_FILE"}},function(e,t){e.exports=Breadcrumb},function(e,t){e.exports=Toolbar},function(e,t){e.exports=SchemaActions},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{"default":e}}var i=n(4),o=n(34),l=r(o),a=n(35),s=r(a),u=n(36),d=r(u),p=n(37),c=r(p),f=n(39),h=r(f),m=n(41),y=r(m),g=n(43),v=r(g),E=n(45),b=r(E),_=n(46),F=r(_)
document.addEventListener("DOMContentLoaded",function(){b["default"].register("UploadField",F["default"])
var e=l["default"].getSection("SilverStripe\\AssetAdmin\\Controller\\AssetAdmin")
s["default"].add({path:e.url,component:y["default"],indexRoute:{onEnter:function t(n,r){var i=[e.url,"show",0].join("/")
r(i)}},childRoutes:[{path:"show/:folderId/edit/:fileId",component:y["default"]},{path:"show/:folderId",component:y["default"]}]}),d["default"].add("assetAdmin",(0,i.combineReducers)({gallery:c["default"],
queuedFiles:h["default"],uploadField:v["default"]}))})},function(e,t){e.exports=Config},function(e,t){e.exports=ReactRouteRegister},function(e,t){e.exports=ReducerRegister},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{"default":e}}function i(){var e=arguments.length<=0||void 0===arguments[0]?p:arguments[0],t=arguments[1],n=null
switch(t.type){case d["default"].ADD_FILES:var r=function(){var n=[]
return t.payload.files.forEach(function(t){var r=!1
e.files.forEach(function(e){e.id===t.id&&(r=!0)}),r||n.push(t)}),{v:(0,s["default"])(l({},e,{count:"undefined"!=typeof t.payload.count?t.payload.count:e.count,files:n.concat(e.files)}))}}()
if("object"===("undefined"==typeof r?"undefined":o(r)))return r.v
case d["default"].REMOVE_FILES:return n="undefined"==typeof t.payload.ids?(0,s["default"])(l({},e,{count:0,files:[]})):(0,s["default"])(l({},e,{count:e.files.filter(function(e){return t.payload.ids.indexOf(e.id)===-1

}).length,files:e.files.filter(function(e){return t.payload.ids.indexOf(e.id)===-1})}))
case d["default"].LOAD_FILE_SUCCESS:var i=e.files.find(function(e){return e.id===t.payload.id})
if(i){var a=function(){var n=l({},i,t.payload.file)
return{v:(0,s["default"])(l({},e,{files:e.files.map(function(e){return e.id===n.id?n:e})}))}}()
if("object"===("undefined"==typeof a?"undefined":o(a)))return a.v}else if(e.folder.id===t.payload.id)return(0,s["default"])(l({},e,{folder:l({},e.folder,t.payload.file)}))
return e
case d["default"].UNLOAD_FOLDER:return l({},e,{files:[]})
case d["default"].SELECT_FILES:var u=null
return u=null===t.payload.ids?e.files.map(function(e){return e.id}):e.selectedFiles.concat(t.payload.ids.filter(function(t){return e.selectedFiles.indexOf(t)===-1})),(0,s["default"])(l({},e,{selectedFiles:u
}))
case d["default"].DESELECT_FILES:var c=null
return c=null===t.payload.ids?[]:e.selectedFiles.filter(function(e){return t.payload.ids.indexOf(e)===-1}),(0,s["default"])(l({},e,{selectedFiles:c}))
case d["default"].DELETE_ITEM_SUCCESS:return(0,s["default"])(l({},e,{selectedFiles:e.selectedFiles.filter(function(e){return t.payload.ids.indexOf(e)===-1}),files:e.files.filter(function(e){return t.payload.ids.indexOf(e.id)===-1

}),count:e.files.filter(function(e){return t.payload.ids.indexOf(e.id)===-1}).length}))
case d["default"].SORT_FILES:var f=e.files.filter(function(e){return"folder"===e.type}),h=e.files.filter(function(e){return"folder"!==e.type})
return(0,s["default"])(l({},e,{files:f.sort(t.payload.comparator).concat(h.sort(t.payload.comparator))}))
case d["default"].LOAD_FOLDER_REQUEST:return(0,s["default"])(l({},e,{errorMessage:null,folderId:t.payload.folderId,selectedFiles:[],files:[],count:0,loading:!0}))
case d["default"].LOAD_FOLDER_SUCCESS:return(0,s["default"])(l({},e,{folder:t.payload.folder,files:t.payload.files,count:t.payload.files.length,loading:!1}))
case d["default"].LOAD_FOLDER_FAILURE:return(0,s["default"])(l({},e,{errorMessage:t.payload.message,loading:!1}))
case d["default"].ADD_FOLDER_REQUEST:return e
case d["default"].ADD_FOLDER_FAILURE:return e
case d["default"].ADD_FOLDER_SUCCESS:return e
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},l=Object.assign||function(e){
for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}
t["default"]=i
var a=n(38),s=r(a),u=n(11),d=r(u),p={count:0,editorFields:[],file:null,files:[],fileId:0,folderId:0,focus:!1,path:null,selectedFiles:[],page:0,errorMessage:null}},function(e,t){e.exports=DeepFreezeStrict

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(){var e=arguments.length<=0||void 0===arguments[0]?h:arguments[0],t=arguments[1]
switch(t.type){case u["default"].ADD_QUEUED_FILE:return(0,a["default"])(o({},e,{items:e.items.concat([o({},p["default"],t.payload.file)])}))
case u["default"].FAIL_UPLOAD:return(0,a["default"])(o({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?o({},e,{message:t.payload.message}):e})}))
case u["default"].PURGE_UPLOAD_QUEUE:return(0,a["default"])(o({},e,{items:e.items.filter(function(e){return!e.message||"error"!==e.message.type&&"success"!==e.message.type})}))
case u["default"].REMOVE_QUEUED_FILE:return(0,a["default"])(o({},e,{items:e.items.filter(function(e){return e.queuedId!==t.payload.queuedId})}))
case u["default"].SUCCEED_UPLOAD:return(0,a["default"])(o({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?o({},e,{messages:[{value:f["default"]._t("AssetAdmin.DROPZONE_SUCCESS_UPLOAD"),
type:"success",extraClass:"success"}]}):e})}))
case u["default"].UPDATE_QUEUED_FILE:return(0,a["default"])(o({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?o({},e,t.payload.updates):e})}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=n(38),a=r(l),s=n(29),u=r(s),d=n(40),p=r(d),c=n(9),f=r(c),h={items:[]}
t["default"]=i},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var i=n(38),o=r(i),l=(0,o["default"])({attributes:{dimensions:{height:null,width:null}},name:null,canDelete:!1,canEdit:!1,category:null,created:null,extension:null,filename:null,id:0,lastUpdated:null,messages:null,
owner:{id:0,title:null},parent:{filename:null,id:0,title:null},queuedId:null,size:null,title:null,type:null,url:null,xhr:null})
t["default"]=l},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t=e.config.sections[y]


return{sectionConfig:t}}Object.defineProperty(t,"__esModule",{value:!0}),t.AssetAdminRouter=void 0
var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(3),p=r(d),c=n(5),f=n(42),h=n(6),m=r(h),y="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",g=function(e){
function t(e){i(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleBrowse=n.handleBrowse.bind(n),n.getUrl=n.getUrl.bind(n),n}return l(t,e),u(t,[{key:"getUrl",value:function n(e,t){var n=this.props.sectionConfig.url,r=n+"/show/"+(e||0)
return t&&(r=r+"/edit/"+t),r}},{key:"getSectionProps",value:function r(){return{sectionConfig:this.props.sectionConfig,type:"admin",folderId:parseInt(this.props.params.folderId,10),fileId:parseInt(this.props.params.fileId,10),
query:this.props.location.query,getUrl:this.getUrl,onBrowse:this.handleBrowse}}},{key:"handleBrowse",value:function a(e,t,n){var r=this.getUrl(e,t),i=null
i=null===n||n?s({},this.props.location.query,n):this.props.location.query,this.props.router.push(s({},this.props.location,{pathname:r,query:i}))}},{key:"render",value:function d(){if(!this.props.sectionConfig)return null


var e=this.getSectionProps()
return p["default"].createElement(m["default"],e)}}]),t}(d.Component)
g.propTypes={sectionConfig:d.PropTypes.shape({url:d.PropTypes.string,form:d.PropTypes.object}),location:d.PropTypes.shape({pathname:d.PropTypes.string,query:d.PropTypes.object}),params:d.PropTypes.shape({
fileId:d.PropTypes.string,folderId:d.PropTypes.string}),router:d.PropTypes.object},t.AssetAdminRouter=g,t["default"]=(0,f.withRouter)((0,c.connect)(a)(g))},function(e,t){e.exports=ReactRouter},function(e,t,n){
"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e){if(Array.isArray(e)){
for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function l(){var e=arguments.length<=0||void 0===arguments[0]?h:arguments[0],t=arguments[1]
switch(t.type){case p["default"].FILEFIELD_ADD_FILE:return(0,u["default"])(a({},e,{fields:a({},e.fields,i({},t.payload.fieldId,[].concat(o(e.fields[t.payload.fieldId]||[]),[a({},f["default"],t.payload.file)])))
}))
case p["default"].FILEFIELD_SET_FILES:return(0,u["default"])(a({},e,{fields:a({},e.fields,i({},t.payload.fieldId,t.payload.files))}))
case p["default"].FILEFIELD_UPLOAD_FAILURE:return(0,u["default"])(a({},e,{fields:a({},e.fields,i({},t.payload.fieldId,(e.fields[t.payload.fieldId]||[]).map(function(e){return e.queuedId===t.payload.queuedId?a({},e,{
message:t.payload.message}):e})))}))
case p["default"].FILEFIELD_REMOVE_FILE:return(0,u["default"])(a({},e,{fields:a({},e.fields,i({},t.payload.fieldId,(e.fields[t.payload.fieldId]||[]).filter(function(e){return!(t.payload.file.queuedId&&e.queuedId===t.payload.file.queuedId||t.payload.file.id&&e.id===t.payload.file.id)

})))}))
case p["default"].FILEFIELD_UPLOAD_SUCCESS:return(0,u["default"])(a({},e,{fields:a({},e.fields,i({},t.payload.fieldId,(e.fields[t.payload.fieldId]||[]).map(function(e){return e.queuedId===t.payload.queuedId?a({},e,t.payload.json):e

})))}))
case p["default"].FILEFIELD_UPDATE_QUEUED_FILE:return(0,u["default"])(a({},e,{fields:a({},e.fields,i({},t.payload.fieldId,(e.fields[t.payload.fieldId]||[]).map(function(e){return e.queuedId===t.payload.queuedId?a({},e,t.payload.updates):e

})))}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=n(38),u=r(s),d=n(44),p=r(d),c=n(40),f=r(c),h={fields:{}}
t["default"]=l},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={FILEFIELD_ADD_FILE:"FILEFIELD_ADD_FILE",FILEFIELD_SET_FILES:"FILEFIELD_SET_FILES",FILEFIELD_REMOVE_FILE:"FILEFIELD_REMOVE_FILE",FILEFIELD_UPLOAD_FAILURE:"FILEFIELD_UPLOAD_FAILURE",
FILEFIELD_UPLOAD_SUCCESS:"FILEFIELD_UPLOAD_SUCCESS",FILEFIELD_UPDATE_QUEUED_FILE:"FILEFIELD_UPDATE_QUEUED_FILE"}},function(e,t){e.exports=Injector},function(e,t,n){"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var n=t.id,r=[]


e.assetAdmin&&e.assetAdmin.uploadField&&e.assetAdmin.uploadField.fields&&(r=e.assetAdmin.uploadField.fields[n]||[])
var i=e.config.SecurityID
return{files:r,securityId:i}}function u(e){return{actions:{uploadField:(0,g.bindActionCreators)(w,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.UploadField=void 0
var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(9),f=i(c),h=n(3),m=i(h),y=n(5),g=n(4),v=n(14),E=i(v),b=n(7),_=i(b),F=n(47),I=i(F),T=n(48),A=i(T),D=n(22),P=i(D),O=n(26),S=i(O),L=n(49),w=r(L),C=function(e){
function t(e){o(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.renderChild=n.renderChild.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),n.handleSending=n.handleSending.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),
n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleItemRemove=n.handleItemRemove.bind(n),n.handleChange=n.handleChange.bind(n),n}return a(t,e),p(t,[{key:"componentDidMount",value:function n(){
this.props.actions.uploadField.setFiles(this.props.id,this.props.data.files)}},{key:"componentWillReceiveProps",value:function r(e){var t=this.props.files||[],n=e.files||[],r=this.compareValues(t,n)
r&&this.handleChange(e)}},{key:"compareValues",value:function i(e,t){if(e.length!==t.length)return!0
for(var n=0;n<e.length;n++)if(e[n].id!==t[n].id)return!0
return!1}},{key:"handleAddedFile",value:function s(e){var t=d({},e,{uploaded:!0})
this.props.actions.uploadField.addFile(this.props.id,t)}},{key:"handleSending",value:function u(e,t){this.props.actions.uploadField.updateQueuedFile(this.props.id,e._queuedId,{xhr:t})}},{key:"handleUploadProgress",
value:function c(e,t){this.props.actions.uploadField.updateQueuedFile(this.props.id,e._queuedId,{progress:t})}},{key:"handleSuccessfulUpload",value:function h(e){var t=JSON.parse(e.xhr.response)
return"undefined"!=typeof t[0].error?void this.handleFailedUpload(e):void this.props.actions.uploadField.succeedUpload(this.props.id,e._queuedId,t[0])}},{key:"handleFailedUpload",value:function y(e,t){
this.props.actions.uploadField.failUpload(this.props.id,e._queuedId,t)}},{key:"handleItemRemove",value:function g(e,t){this.props.actions.uploadField.removeFile(this.props.id,t)}},{key:"handleChange",value:function v(e){
if("function"==typeof e.onChange){var t=e.files.filter(function(e){return e.id}).map(function(e){return e.id}),n={Files:t}
e.onChange(n)}}},{key:"handleSelect",value:function b(e){e.preventDefault()}},{key:"render",value:function _(){return m["default"].createElement("div",{className:"uploadfield"},this.renderDropzone(),this.props.files.map(this.renderChild))

}},{key:"renderDropzone",value:function F(){if(!this.props.data.createFileEndpoint)return null
var e={height:E["default"].SMALL_THUMBNAIL_HEIGHT,width:E["default"].SMALL_THUMBNAIL_WIDTH},t={url:this.props.data.createFileEndpoint.url,method:this.props.data.createFileEndpoint.method,paramName:"Upload",
thumbnailWidth:E["default"].SMALL_THUMBNAIL_WIDTH,thumbnailHeight:E["default"].SMALL_THUMBNAIL_HEIGHT}
this.props.data.multi||(t.maxFiles=1)
var n=["uploadfield__dropzone"]
this.props.files.length&&!this.props.data.multi&&n.push("uploadfield__dropzone--hidden")
var r=this.props.securityId
return m["default"].createElement(P["default"],{canUpload:!0,uploadButton:!1,uploadSelector:".uploadfield__dropzone-area",folderId:this.props.data.parentid,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,
handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,preview:e,options:t,securityID:r,className:n.join(" ")},m["default"].createElement("div",{
className:"uploadfield__dropzone-area"},m["default"].createElement("span",{className:"uploadfield__droptext"},m["default"].createElement("a",{href:"#",onClick:this.handleSelect,className:"uploadfield__upload-button"
},f["default"]._t("AssetAdminUploadField.BROWSE","Browse")))))}},{key:"renderChild",value:function I(e,t){var n={key:t,item:e,name:this.props.name,handleRemove:this.handleItemRemove}
return m["default"].createElement(A["default"],n)}}]),t}(_["default"])
C.propTypes={extraClass:m["default"].PropTypes.string,id:m["default"].PropTypes.string.isRequired,name:m["default"].PropTypes.string.isRequired,onChange:m["default"].PropTypes.func,value:m["default"].PropTypes.shape({
Files:m["default"].PropTypes.arrayOf(m["default"].PropTypes.number)}),files:m["default"].PropTypes.arrayOf(S["default"]),readOnly:m["default"].PropTypes.bool,disabled:m["default"].PropTypes.bool,data:m["default"].PropTypes.shape({
createFileEndpoint:m["default"].PropTypes.shape({url:m["default"].PropTypes.string.isRequired,method:m["default"].PropTypes.string.isRequired,payloadFormat:m["default"].PropTypes.string.isRequired}),multi:m["default"].PropTypes.bool,
parentid:m["default"].PropTypes.number})},C.defaultProps={value:{Files:[]},extraClass:"",className:""},t.UploadField=C,t["default"]=(0,I["default"])((0,y.connect)(s,u)(C))},function(e,t){e.exports=FieldHolder

},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(9),u=r(s),d=n(3),p=r(d),c=n(7),f=r(c),h=n(14),m=r(h),y=n(26),g=r(y),v=function(e){
function t(e){i(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleRemove=n.handleRemove.bind(n),n}return l(t,e),a(t,[{key:"getThumbnailStyles",value:function n(){if(this.isImage()&&(this.exists()||this.uploading())){var e=this.props.item.smallThumbnail||this.props.item.url


return{backgroundImage:"url("+e+")"}}return{}}},{key:"hasError",value:function r(){return!!this.props.item.message&&"error"===this.props.item.message.type}},{key:"renderErrorMessage",value:function s(){
var e=null
return this.hasError()?e=this.props.item.message.value:this.exists()||this.uploading()||(e=u["default"]._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==e?p["default"].createElement("div",{
className:"uploadfield-item__error-message"},e):null}},{key:"getThumbnailClassNames",value:function d(){var e=["uploadfield-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&e.push("uploadfield-item__thumbnail--small"),e.join(" ")}},{key:"getItemClassNames",value:function c(){var e=this.props.item.category||"none",t=["fill-width","uploadfield-item","uploadfield-item--"+e]


return this.exists()||this.uploading()||t.push("uploadfield-item--missing"),this.hasError()&&t.push("uploadfield-item--error"),t.join(" ")}},{key:"isImage",value:function f(){return"image"===this.props.item.category

}},{key:"exists",value:function h(){return this.props.item.exists}},{key:"uploading",value:function y(){return!!this.props.item.uploaded}},{key:"complete",value:function g(){return this.uploading()&&this.props.item.id>0

}},{key:"isImageSmallerThanThumbnail",value:function v(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1
var e=this.props.item.dimensions
return e&&e.height<m["default"].SMALL_THUMBNAIL_HEIGHT&&e.width<m["default"].SMALL_THUMBNAIL_WIDTH}},{key:"preventFocus",value:function E(e){e.preventDefault()}},{key:"handleRemove",value:function b(e){
e.preventDefault(),this.props.handleRemove&&this.props.handleRemove(e,this.props.item)}},{key:"renderProgressBar",value:function _(){var e={className:"uploadfield-item__progress-bar",style:{width:this.props.item.progress+"%"
}}
return!this.hasError()&&this.uploading()?this.complete()?p["default"].createElement("div",{className:"uploadfield-item__complete-icon"}):p["default"].createElement("div",{className:"uploadfield-item__upload-progress"
},p["default"].createElement("div",e)):null}},{key:"renderRemoveButton",value:function F(){var e=["btn","uploadfield-item__remove-btn","btn-secondary","btn--no-text","font-icon-cancel","btn--icon-md"].join(" ")


return p["default"].createElement("button",{className:e,onClick:this.handleRemove,ref:"backButton"})}},{key:"renderFileDetails",value:function I(){return p["default"].createElement("div",{className:"uploadfield-item__details fill-width flexbox-area-grow"
},p["default"].createElement("span",{className:"uploadfield-item__title",ref:"title"},this.props.item.title),p["default"].createElement("span",{className:"uploadfield-item__meta"},this.props.item.extension,", ",this.props.item.size))

}},{key:"render",value:function T(){var e=this.props.name+"[Files][]"
return p["default"].createElement("div",{className:this.getItemClassNames()},p["default"].createElement("input",{type:"hidden",value:this.props.item.id,name:e}),p["default"].createElement("div",{ref:"thumbnail",
className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()}),this.renderFileDetails(),this.renderProgressBar(),this.renderErrorMessage(),this.renderRemoveButton())}}]),t}(f["default"])
v.propTypes={name:p["default"].PropTypes.string.isRequired,item:g["default"],handleRemove:p["default"].PropTypes.func},t["default"]=v},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){return function(n){return n({type:p["default"].FILEFIELD_ADD_FILE,payload:{fieldId:e,file:t}})}}function o(e,t){return function(n){return n({
type:p["default"].FILEFIELD_SET_FILES,payload:{fieldId:e,files:t}})}}function l(e,t,n){return function(r){var i=n.message
return"string"==typeof n&&(i={value:n,type:"error"}),r({type:p["default"].FILEFIELD_UPLOAD_FAILURE,payload:{fieldId:e,queuedId:t,message:i}})}}function a(e,t){return function(n){return n({type:p["default"].FILEFIELD_REMOVE_FILE,
payload:{fieldId:e,file:t}})}}function s(e,t,n){return function(r){return r({type:p["default"].FILEFIELD_UPLOAD_SUCCESS,payload:{fieldId:e,queuedId:t,json:n}})}}function u(e,t,n){return function(r){return r({
type:p["default"].FILEFIELD_UPDATE_QUEUED_FILE,payload:{fieldId:e,queuedId:t,updates:n}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addFile=i,t.setFiles=o,t.failUpload=l,t.removeFile=a,t.succeedUpload=s,
t.updateQueuedFile=u
var d=n(44),p=r(d)},function(e,t){}])

//# sourceMappingURL=bundle.js.map
!function(e){function t(i){if(n[i])return n[i].exports
var r=n[i]={exports:{},id:i,loaded:!1}
return e[i].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={}
return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict"
n(1),n(33),n(50)},function(e,t,n){(function(t){e.exports=t.InsertMediaModal=n(2)}).call(t,function(){return this}())},function(e,t,n){"use strict"
function i(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var n=e.config.sections[I],i=t.fileAttributes.ID,r=e.config.sections[I],o=i&&r.form.FileInsertForm.schemaUrl+"/"+i


return{sectionConfig:n,schemaUrl:o}}function u(e){return{actions:{schema:(0,m.bindActionCreators)(F,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.InsertMediaModal=void 0
var d=function(){function e(e,t){var n=[],i=!0,r=!1,o=void 0
try{for(var l=e[Symbol.iterator](),a;!(i=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);i=!0);}catch(s){r=!0,o=s}finally{try{!i&&l["return"]&&l["return"]()}finally{if(r)throw o}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),f=n(3),h=r(f),m=n(4),y=n(5),g=n(6),v=r(g),E=n(16),b=r(E),_=n(32),F=i(_),I="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",T=function(e){
function t(e){o(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSubmit=n.handleSubmit.bind(n),n.handleBrowse=n.handleBrowse.bind(n),n.getUrl=n.getUrl.bind(n),n.state={folderId:0,fileId:e.fileAttributes.ID,query:{}},n}return a(t,e),c(t,[{key:"componentWillMount",
value:function n(){this.setOverrides(this.props)}},{key:"componentWillReceiveProps",value:function i(e){!e.show&&this.props.show&&this.setState({folderId:0,fileId:null,query:{}}),e.show&&!this.props.show&&e.fileAttributes.ID&&(this.setOverrides(e),
this.setState({folderId:0,fileId:e.fileAttributes.ID}))}},{key:"componentWillUnmount",value:function r(){this.setOverrides()}},{key:"setOverrides",value:function s(e){if(e&&this.props.schemaUrl===e.schemaUrl||this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,null),
e&&e.schemaUrl){var t=p({},e.fileAttributes)
delete t.ID
var n={fields:Object.entries(t).map(function(e){var t=d(e,2),n=t[0],i=t[1]
return{name:n,value:i}})}
this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,n)}}},{key:"getUrl",value:function u(e,t){var n=this.props.sectionConfig.url,i=n+"/show/"+(e||0)
return t&&(i=i+"/edit/"+t),i}},{key:"getSectionProps",value:function f(){return{dialog:!0,type:"insert",sectionConfig:this.props.sectionConfig,folderId:this.state.folderId,fileId:this.state.fileId||this.props.fileId,
query:this.state.query,getUrl:this.getUrl,onBrowse:this.handleBrowse,onSubmitEditor:this.handleSubmit}}},{key:"getModalProps",value:function m(){return p({},this.props,{handleHide:this.props.onHide,className:"insert-media-modal "+this.props.className,
bsSize:"lg",onHide:void 0,onInsert:void 0,sectionConfig:void 0,schemaUrl:void 0})}},{key:"handleSubmit",value:function y(e,t,n,i){return this.props.onInsert(e,i)}},{key:"handleBrowse",value:function g(e,t,n){
var i=n
i=null===n||n?p({},this.state.query,n):this.state.query,this.setState({folderId:e,fileId:t,query:i})}},{key:"render",value:function E(){var e=this.getModalProps(),t=this.getSectionProps(),n=this.props.show?h["default"].createElement(v["default"],t):null


return h["default"].createElement(b["default"],e,n)}}]),t}(f.Component)
T.propTypes={sectionConfig:f.PropTypes.shape({url:f.PropTypes.string,form:f.PropTypes.object}),schemaUrl:f.PropTypes.string,show:f.PropTypes.bool,onInsert:f.PropTypes.func.isRequired,fileAttributes:f.PropTypes.shape({
ID:f.PropTypes.number,AltText:f.PropTypes.string,Width:f.PropTypes.number,Height:f.PropTypes.number,TitleTooltip:f.PropTypes.string,Alignment:f.PropTypes.string}),fileId:f.PropTypes.number,onHide:f.PropTypes.func,
className:f.PropTypes.string,actions:f.PropTypes.object},T.defaultProps={className:"",fileAttributes:{}},t.InsertMediaModal=T,t["default"]=(0,y.connect)(s,u)(T)},function(e,t){e.exports=React},function(e,t){
e.exports=Redux},function(e,t){e.exports=ReactRedux},function(e,t,n){"use strict"
function i(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var n=e.assetAdmin.gallery.folder,i=e.assetAdmin.gallery.files


return{files:i,folder:n,limit:t.sectionConfig.limit,securityId:e.config.SecurityID}}function u(e){return{actions:{gallery:(0,m.bindActionCreators)(I,e),breadcrumbsActions:(0,m.bindActionCreators)(A,e)}
}}Object.defineProperty(t,"__esModule",{value:!0}),t.AssetAdmin=void 0
var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},p=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),c=n(3),f=r(c),h=n(5),m=n(4),y=n(7),g=r(y),v=n(8),E=r(v),b=n(9),_=r(b),F=n(10),I=i(F),T=n(12),A=i(T),D=n(13),P=r(D),O=n(17),L=r(O),w=n(30),S=r(w),C=n(31),k=r(C),U=function(e){
function t(e){o(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleOpenFile=n.handleOpenFile.bind(n),n.handleCloseFile=n.handleCloseFile.bind(n),n["delete"]=n["delete"].bind(n),n.handleSubmitEditor=n.handleSubmitEditor.bind(n),n.handleOpenFolder=n.handleOpenFolder.bind(n),
n.handleSort=n.handleSort.bind(n),n.createEndpoint=n.createEndpoint.bind(n),n.handleBackButtonClick=n.handleBackButtonClick.bind(n),n.handleFolderIcon=n.handleFolderIcon.bind(n),n.handleBrowse=n.handleBrowse.bind(n),
n.compare=n.compare.bind(n),n}return a(t,e),p(t,[{key:"componentWillMount",value:function n(){var e=this.props.sectionConfig
this.endpoints={createFolderApi:this.createEndpoint(e.createFolderEndpoint),readFolderApi:this.createEndpoint(e.readFolderEndpoint,!1),updateFolderApi:this.createEndpoint(e.updateFolderEndpoint),deleteApi:this.createEndpoint(e.deleteEndpoint)
}}},{key:"componentWillReceiveProps",value:function i(e){var t=this.compare(this.props.folder,e.folder)
t&&this.setBreadcrumbs(e.folder)}},{key:"handleBrowse",value:function r(e,t,n){"function"==typeof this.props.onBrowse&&this.props.onBrowse(e,t,n)}},{key:"handleSort",value:function s(e){this.handleBrowse(this.props.folderId,this.props.fileId,{
sort:e})}},{key:"createEndpoint",value:function u(e){var t=arguments.length<=1||void 0===arguments[1]||arguments[1]
return E["default"].createEndpointFetcher(d({},e,t?{defaultData:{SecurityID:this.props.securityId}}:{}))}},{key:"handleBackButtonClick",value:function c(e){e.preventDefault(),this.props.folder?this.handleOpenFolder(this.props.folder.parentID||0):this.handleOpenFolder(0)

}},{key:"setBreadcrumbs",value:function h(e){var t=this,n=[{text:_["default"]._t("AssetAdmin.FILES","Files"),href:this.props.sectionConfig.url}]
e&&e.id&&(e.parents&&e.parents.forEach(function(e){n.push({text:e.title,href:t.props.getUrl&&t.props.getUrl(e.id),onClick:function i(){return t.handleBrowse(e.id)}})}),n.push({text:e.title,icon:{className:"icon font-icon-edit-list",
action:this.handleFolderIcon}})),this.props.actions.breadcrumbsActions.setBreadcrumbs(n)}},{key:"compare",value:function m(e,t){return!!(e&&!t||t&&!e)||e&&t&&(e.id!==t.id||e.name!==t.name)}},{key:"handleFolderIcon",
value:function y(e){e.preventDefault(),this.handleOpenFile(this.props.folderId)}},{key:"handleOpenFile",value:function g(e){this.handleBrowse(this.props.folderId,e)}},{key:"handleSubmitEditor",value:function v(e,t,n){
var i=this,r=null
if("function"==typeof this.props.onSubmitEditor){var o=this.props.files.find(function(e){return e.id===parseInt(i.props.fileId,10)})
r=this.props.onSubmitEditor(e,t,n,o)}else r=n()
if(!r)throw new Error("Promise was not returned for submitting")
return r.then(function(e){return e&&e.record&&i.props.actions.gallery.loadFile(i.props.fileId,e.record),e})}},{key:"handleCloseFile",value:function b(){this.handleOpenFolder(this.props.folderId)}},{key:"handleOpenFolder",
value:function F(e){this.handleBrowse(e)}},{key:"delete",value:function I(e){var t=this,n=this.props.files.find(function(t){return t.id===e})
if(!n&&this.props.folder&&this.props.folder.id===e&&(n=this.props.folder),!n)throw new Error("File selected for deletion cannot be found: "+e)
var i=n.parent?n.parent.id:0
confirm(_["default"]._t("AssetAdmin.CONFIRMDELETE"))&&this.props.actions.gallery.deleteItems(this.endpoints.deleteApi,[n.id]).then(function(){t.handleBrowse(i)})}},{key:"renderGallery",value:function T(){
var e=this.props.sectionConfig,t=e.createFileEndpoint.url,n=e.createFileEndpoint.method,i=this.props.query&&this.props.query.limit,r=this.props.query&&this.props.query.page,o=this.props.query&&this.props.query.sort


return f["default"].createElement(L["default"],{dialog:this.props.dialog,files:this.props.files,fileId:this.props.fileId,folderId:this.props.folderId,folder:this.props.folder,type:this.props.type,limit:i,
page:r,createFileApiUrl:t,createFileApiMethod:n,createFolderApi:this.endpoints.createFolderApi,readFolderApi:this.endpoints.readFolderApi,updateFolderApi:this.endpoints.updateFolderApi,deleteApi:this.endpoints.deleteApi,
onOpenFile:this.handleOpenFile,onOpenFolder:this.handleOpenFolder,onSort:this.handleSort,sort:o,sectionConfig:e})}},{key:"renderEditor",value:function A(){var e=this,t=this.props.sectionConfig,n=this.props.files.find(function(t){
return t.id===parseInt(e.props.fileId,10)}),i="insert"===this.props.type?t.form.FileInsertForm.schemaUrl:t.form.FileEditForm.schemaUrl
return n||this.props.fileId===this.props.folderId?f["default"].createElement(P["default"],{dialog:this.props.dialog,fileId:this.props.fileId,onClose:this.handleCloseFile,editFileSchemaUrl:i,onSubmit:this.handleSubmitEditor,
onDelete:this["delete"],addToCampaignSchemaUrl:t.form.AddToCampaignForm.schemaUrl}):null}},{key:"render",value:function D(){var e=!(!this.props.folder||!this.props.folder.id)
return f["default"].createElement("div",{className:"fill-height"},f["default"].createElement(k["default"],{showBackButton:e,handleBackButtonClick:this.handleBackButtonClick},f["default"].createElement(S["default"],{
multiline:!0})),f["default"].createElement("div",{className:"flexbox-area-grow fill-width fill-height gallery"},this.renderGallery(),this.renderEditor()))}}]),t}(g["default"])
U.propTypes={dialog:c.PropTypes.bool,sectionConfig:c.PropTypes.shape({url:c.PropTypes.string,limit:c.PropTypes.number,form:c.PropTypes.object}),fileId:c.PropTypes.number,folderId:c.PropTypes.number,onBrowse:c.PropTypes.func,
getUrl:c.PropTypes.func,query:c.PropTypes.shape({sort:c.PropTypes.string}),onSubmitEditor:c.PropTypes.func,type:c.PropTypes.oneOf(["insert","admin"]),files:c.PropTypes.array,folder:c.PropTypes.shape({id:c.PropTypes.number,
title:c.PropTypes.string,parents:c.PropTypes.array,parentID:c.PropTypes.number,canView:c.PropTypes.bool,canEdit:c.PropTypes.bool})},U.defaultProps={type:"admin"},t.AssetAdmin=U,t["default"]=(0,h.connect)(s,u)(U)

},function(e,t){e.exports=SilverStripeComponent},function(e,t){e.exports=Backend},function(e,t){e.exports=i18n},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){return function(n){return n({type:h["default"].ADD_FILES,payload:{files:e,count:t}})}}function o(e,t){return function(n){return n({type:h["default"].DELETE_ITEM_REQUEST,
payload:{ids:t}}),e({ids:t}).then(function(e){return n({type:h["default"].DELETE_ITEM_SUCCESS,payload:{ids:t}}),e})["catch"](function(e){throw n({type:h["default"].DELETE_ITEM_FAILURE,payload:{e:e}}),e

})}}function l(e,t,n,i){return function(r){return r({type:h["default"].LOAD_FOLDER_REQUEST,payload:{folderId:parseInt(t,10)}}),e({id:t,limit:n,page:i}).then(function(e){return r({type:h["default"].LOAD_FOLDER_SUCCESS,
payload:{files:e.files,folder:{id:parseInt(e.folderID,10),title:e.title,parents:e.parents,parent:e.parent,canEdit:e.canEdit,canDelete:e.canDelete,parentID:null===e.parentID?null:parseInt(e.parentID,10)
},folderId:parseInt(e.folderID,10)}}),e})["catch"](function(e){throw r({type:h["default"].LOAD_FOLDER_FAILURE,payload:{message:e.message}}),e})}}function a(){return{type:h["default"].UNLOAD_FOLDER}}function s(e,t){
return function(n){n({type:h["default"].LOAD_FILE_SUCCESS,payload:{id:e,file:t}})}}function u(){var e=arguments.length<=0||void 0===arguments[0]?null:arguments[0]
return function(t){return t({type:h["default"].SELECT_FILES,payload:{ids:e}})}}function d(){var e=arguments.length<=0||void 0===arguments[0]?null:arguments[0]
return function(t){return t({type:h["default"].DESELECT_FILES,payload:{ids:e}})}}function p(e){return function(t){return t({type:h["default"].SORT_FILES,payload:{comparator:e}})}}function c(e,t,n){return function(i){
return i({type:h["default"].CREATE_FOLDER_REQUEST,payload:{name:n}}),e({ParentID:isNaN(t)?0:t,Name:n}).then(function(e){return i({type:h["default"].CREATE_FOLDER_SUCCESS,payload:{name:n}}),e})["catch"](function(e){
throw i({type:h["default"].CREATE_FOLDER_FAILURE,payload:{error:"Couldn't create "+n+": "+e}}),e})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addFiles=r,t.deleteItems=o,t.loadFolderContents=l,
t.unloadFolderContents=a,t.loadFile=s,t.selectFiles=u,t.deselectFiles=d,t.sortFiles=p,t.createFolder=c
var f=n(11),h=i(f)},function(e,t){"use strict"
function n(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0})
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e}
t["default"]=["ADD_FILES","DESELECT_FILES","REMOVE_FILES","SELECT_FILES","SORT_FILES","LOAD_FILE_REQUEST","LOAD_FILE_SUCCESS","CREATE_FOLDER_REQUEST","CREATE_FOLDER_SUCCESS","CREATE_FOLDER_FAILURE","DELETE_ITEM_REQUEST","DELETE_ITEM_SUCCESS","DELETE_ITEM_FAILURE","LOAD_FOLDER_REQUEST","LOAD_FOLDER_SUCCESS","LOAD_FOLDER_FAILURE","UNLOAD_FOLDER","HIGHLIGHT_FILES","UPDATE_BATCH_ACTIONS"].reduce(function(e,t){
return i(e,n({},t,"GALLERY."+t))},{})},function(e,t){e.exports=BreadcrumbsActions},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),s=n(9),u=i(s),d=n(3),p=i(d),c=n(14),f=i(c),h=n(15),m=i(h),y=n(16),g=i(y),v=function(e){
function t(e){r(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleCancelKeyDown=n.handleCancelKeyDown.bind(n),n.handleClose=n.handleClose.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n.handleAction=n.handleAction.bind(n),n.closeModal=n.closeModal.bind(n),
n.openModal=n.openModal.bind(n),n.state={openModal:!1},n}return l(t,e),a(t,[{key:"renderCancelButton",value:function n(){return p["default"].createElement("a",{tabIndex:"0",className:"btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl",
onClick:this.handleClose,onKeyDown:this.handleCancelKeyDown,type:"button","aria-label":u["default"]._t("AssetAdmin.CANCEL")})}},{key:"handleAction",value:function i(e,t){var n=e.currentTarget.name
return"action_addtocampaign"===n?(this.openModal(),void e.preventDefault()):"action_delete"===n?(this.props.onDelete(t.ID),void e.preventDefault()):void 0}},{key:"handleCancelKeyDown",value:function s(e){
e.keyCode!==f["default"].SPACE_KEY_CODE&&e.keyCode!==f["default"].RETURN_KEY_CODE||this.handleClose(e)}},{key:"handleSubmit",value:function d(e,t,n){return"function"==typeof this.props.onSubmit?this.props.onSubmit(e,t,n):n()

}},{key:"openModal",value:function c(){this.setState({openModal:!0})}},{key:"closeModal",value:function h(){this.setState({openModal:!1})}},{key:"handleClose",value:function y(e){this.props.onClose(),this.closeModal(),
e&&e.preventDefault()}},{key:"render",value:function v(){var e=this.props.editFileSchemaUrl+"/"+this.props.fileId,t=this.props.addToCampaignSchemaUrl+"/"+this.props.fileId,n=["panel","panel--padded","panel--scrollable","form--no-dividers","editor"]


return this.props.dialog&&n.push("editor--dialog"),p["default"].createElement("div",{className:n.join(" ")},p["default"].createElement("div",{className:"editor__details"},p["default"].createElement(m["default"],{
schemaUrl:e,afterMessages:this.renderCancelButton(),handleSubmit:this.handleSubmit,handleAction:this.handleAction}),p["default"].createElement(g["default"],{show:this.state.openModal,handleHide:this.closeModal,
schemaUrl:t,bodyClassName:"modal__dialog",responseClassBad:"modal__response modal__response--error",responseClassGood:"modal__response modal__response--good"})))}}]),t}(d.Component)
v.propTypes={dialog:p["default"].PropTypes.bool,fileId:p["default"].PropTypes.number.isRequired,onClose:p["default"].PropTypes.func.isRequired,onSubmit:p["default"].PropTypes.func.isRequired,onDelete:p["default"].PropTypes.func.isRequired,
editFileSchemaUrl:p["default"].PropTypes.string.isRequired,addToCampaignSchemaUrl:p["default"].PropTypes.string,openAddCampaignModal:p["default"].PropTypes.bool},t["default"]=v},function(e,t,n){"use strict"


function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var r=n(9),o=i(r)
t["default"]={CSS_TRANSITION_TIME:300,SMALL_THUMBNAIL_HEIGHT:60,SMALL_THUMBNAIL_WIDTH:60,THUMBNAIL_HEIGHT:150,THUMBNAIL_WIDTH:200,BULK_ACTIONS:[{value:"delete",label:o["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE","Delete"),
className:"font-icon-trash",destructive:!0,callback:null,confirm:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=null,t=o["default"].sprintf(o["default"]._t("AssetAdmin.BULK_ACTIONS_CONFIRM"),o["default"]._t("AssetAdmin.BULK_ACTIONS_DELETE_CONFIRM","delete"))


return e=confirm(t)?Promise.resolve():Promise.reject()})},{value:"edit",label:o["default"]._t("AssetAdmin.BULK_ACTIONS_EDIT","Edit"),className:"font-icon-edit",destructive:!1,canApply:function l(e){return 1===e.length

},callback:null}],BULK_ACTIONS_PLACEHOLDER:o["default"]._t("AssetAdmin.BULK_ACTIONS_PLACEHOLDER"),SPACE_KEY_CODE:32,RETURN_KEY_CODE:13}},function(e,t){e.exports=FormBuilderLoader},function(e,t){e.exports=FormBuilderModal

},function(e,t,n){"use strict"
function i(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){return function(n,i){
var r=n[e].toLowerCase(),o=i[e].toLowerCase()
if("asc"===t){if(r<o)return-1
if(r>o)return 1}else{if(r>o)return-1
if(r<o)return 1}return 0}}function u(e){var t=e.assetAdmin.gallery,n=t.loading,i=t.count,r=t.files,o=t.selectedFiles,l=t.errorMessage
return{loading:n,count:i,files:r,selectedFiles:o,errorMessage:l,queuedFiles:e.assetAdmin.queuedFiles,securityId:e.config.SecurityID}}function d(e){return{actions:{gallery:(0,A.bindActionCreators)(x,e),
queuedFiles:(0,A.bindActionCreators)(j,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.Gallery=void 0
var p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},c=function(){function e(e,t){var n=[],i=!0,r=!1,o=void 0
try{for(var l=e[Symbol.iterator](),a;!(i=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);i=!0);}catch(s){r=!0,o=s}finally{try{!i&&l["return"]&&l["return"]()}finally{if(r)throw o}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),f=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),h=n(18),m=r(h),y=n(9),g=r(y),v=n(3),E=r(v),b=n(19),_=r(b),F=n(20),I=r(F),T=n(5),A=n(4),D=n(21),P=r(D),O=n(22),L=r(O),w=n(25),S=r(w),C=n(27),k=r(C),U=n(14),R=r(U),M=n(10),x=i(M),N=n(28),j=i(N),q=function(e){
function t(e){o(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.sorters=[{field:"title",direction:"asc",label:g["default"]._t("AssetAdmin.FILTER_TITLE_ASC")},{field:"title",direction:"desc",label:g["default"]._t("AssetAdmin.FILTER_TITLE_DESC")},{field:"created",
direction:"desc",label:g["default"]._t("AssetAdmin.FILTER_DATE_DESC")},{field:"created",direction:"asc",label:g["default"]._t("AssetAdmin.FILTER_DATE_ASC")}],n.handleFolderActivate=n.handleFolderActivate.bind(n),
n.handleFileActivate=n.handleFileActivate.bind(n),n.handleToggleSelect=n.handleToggleSelect.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),n.handleCancelUpload=n.handleCancelUpload.bind(n),n.handleRemoveErroredUpload=n.handleRemoveErroredUpload.bind(n),
n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleSending=n.handleSending.bind(n),n.handleItemDelete=n.handleItemDelete.bind(n),n.handleBackClick=n.handleBackClick.bind(n),n.handleMoreClick=n.handleMoreClick.bind(n),
n.handleSort=n.handleSort.bind(n),n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),n.handleCreateFolder=n.handleCreateFolder.bind(n),n}return a(t,e),
f(t,[{key:"componentDidMount",value:function n(){this.refreshFolderIfNeeded()}},{key:"componentWillReceiveProps",value:function i(e){if((e.sort||e.files)&&(this.props.files.length!==e.files.length||this.props.sort!==e.sort)){
var t=e.sort||this.sorters[0].field+","+this.sorters[0].direction,n=t.split(","),i=c(n,2),r=i[0],o=i[1]
this.props.actions.gallery.sortFiles(s(r,o))}}},{key:"componentWillUpdate",value:function r(){var e=(0,m["default"])(_["default"].findDOMNode(this)).find(".gallery__sort .dropdown")
e.off("change")}},{key:"componentDidUpdate",value:function u(e){var t=(0,m["default"])(_["default"].findDOMNode(this)).find(".gallery__sort .dropdown")
t.chosen({allow_single_deselect:!0,disable_search_threshold:20}),t.on("change",function(){return P["default"].Simulate.click(t.find(":selected")[0])}),this.refreshFolderIfNeeded(e),this.checkLoadingIndicator()

}},{key:"componentWillUnmount",value:function d(){this.props.actions.gallery.unloadFolderContents()}},{key:"getNoItemsNotice",value:function h(){return this.props.files.length<1&&this.props.queuedFiles.items.length<1&&!this.props.loading?E["default"].createElement("p",{
className:"gallery__no-item-notice"},g["default"]._t("AssetAdmin.NOITEMSFOUND")):null}},{key:"getMoreButton",value:function y(){return this.props.count>this.props.files.length?E["default"].createElement("button",{
className:"gallery__load-more",onClick:this.handleMoreClick},g["default"]._t("AssetAdmin.LOADMORE")):null}},{key:"checkLoadingIndicator",value:function v(){var e=(0,m["default"])(".cms-content.AssetAdmin")


this.props.loading&&!e.hasClass("loading")?e.addClass("loading"):!this.props.loading&&e.hasClass("loading")&&e.removeClass("loading")}},{key:"refreshFolderIfNeeded",value:function b(e){e&&this.props.folderId===e.folderId||(this.props.actions.gallery.deselectFiles(),
this.props.actions.gallery.loadFolderContents(this.props.readFolderApi,this.props.folderId,this.props.limit,this.props.page))}},{key:"handleSort",value:function F(e){"function"==typeof this.props.onSort&&(this.props.actions.queuedFiles.purgeUploadQueue(),
this.props.onSort(e.target.value))}},{key:"handleCancelUpload",value:function T(e){e.xhr.abort(),this.props.actions.queuedFiles.removeQueuedFile(e.queuedId)}},{key:"handleRemoveErroredUpload",value:function A(e){
this.props.actions.queuedFiles.removeQueuedFile(e.queuedId)}},{key:"handleAddedFile",value:function D(e){this.props.actions.queuedFiles.addQueuedFile(e)}},{key:"handleSending",value:function O(e,t){this.props.actions.queuedFiles.updateQueuedFile(e._queuedId,{
xhr:t})}},{key:"handleUploadProgress",value:function w(e,t){this.props.actions.queuedFiles.updateQueuedFile(e._queuedId,{progress:t})}},{key:"handleCreateFolder",value:function C(e){var t=this,n=this.promptFolderName()


n&&this.props.actions.gallery.createFolder(this.props.createFolderApi,this.props.folderId,n).then(function(e){return t.props.actions.gallery.addFiles([e],1),e}),e.preventDefault()}},{key:"handleSuccessfulUpload",
value:function U(e){var t=JSON.parse(e.xhr.response)
if("undefined"!=typeof t[0].error)return void this.handleFailedUpload(e)
if(this.props.actions.queuedFiles.removeQueuedFile(e._queuedId),this.props.actions.gallery.addFiles(t,this.props.count+1),"insert"===this.props.type&&!this.props.fileId&&0===this.props.queuedFiles.items.length){
var n=t.pop()
this.props.onOpenFile(n.id)}}},{key:"handleFailedUpload",value:function M(e,t){this.props.actions.queuedFiles.failUpload(e._queuedId,t)}},{key:"handleItemDelete",value:function x(e,t){confirm(g["default"]._t("AssetAdmin.CONFIRMDELETE"))&&this.props.actions.gallery.deleteItems(this.props.deleteApi,[t.id])

}},{key:"promptFolderName",value:function N(){return prompt(g["default"]._t("AssetAdmin.PROMPTFOLDERNAME"))}},{key:"itemIsSelected",value:function j(e){return this.props.selectedFiles.indexOf(e)>-1}},{
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
e.props.actions.gallery.deleteItems(e.props.deleteApi,n)},n=function l(t){e.props.onOpenFile(t[0].id)},i=R["default"].BULK_ACTIONS.map(function(e){return"delete"!==e.value||e.callback?"edit"!==e.value||e.callback?e:p({},e,{
callback:n}):p({},e,{callback:t})}),r=this.props.selectedFiles.map(function(t){return e.props.files.find(function(e){return t===e.id})})
return r.length>0&&"admin"===this.props.type?E["default"].createElement(I["default"],{transitionName:"bulk-actions",transitionEnterTimeout:R["default"].CSS_TRANSITION_TIME,transitionLeaveTimeout:R["default"].CSS_TRANSITION_TIME
},E["default"].createElement(k["default"],{actions:i,items:r,key:r.length>0})):null}},{key:"render",value:function Y(){var e=this
if(!this.props.folder)return this.props.errorMessage?E["default"].createElement("div",{className:"gallery__error"},E["default"].createElement("div",{className:"gallery__error-message"},E["default"].createElement("h3",null,this.props.errorMessage&&g["default"]._t("AssetAdmin.DROPZONE_RESPONSE_ERROR","Server responded with an error.")),E["default"].createElement("p",null,this.props.errorMessage))):E["default"].createElement("div",null)


var t={height:R["default"].THUMBNAIL_HEIGHT,width:R["default"].THUMBNAIL_WIDTH},n={url:this.props.createFileApiUrl,method:this.props.createFileApiMethod,paramName:"Upload",clickable:"#upload-button"},i=this.props.securityId,r=this.props.folder.canEdit,o="admin"===this.props.type,l=["panel","panel--padded","panel--scrollable","gallery__main"]


return this.props.dialog&&l.push("insert-media-modal__main"),E["default"].createElement("div",{className:"flexbox-area-grow gallery__outer"},this.renderBulkActions(),E["default"].createElement("div",{className:l.join(" ")
},this.renderSort(),this.renderToolbar(),E["default"].createElement(L["default"],{canUpload:r,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,handleSuccess:this.handleSuccessfulUpload,
handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,preview:t,folderId:this.props.folderId,options:n,securityID:i,uploadButton:!1},E["default"].createElement("div",{className:"gallery__folders"
},this.props.files.map(function(t,n){return"folder"===t.type?E["default"].createElement(S["default"],{key:n,item:t,selectable:o,selected:e.itemIsSelected(t.id),highlighted:e.itemIsHighlighted(t.id),handleDelete:e.handleItemDelete,
handleToggleSelect:e.handleToggleSelect,handleActivate:e.handleFolderActivate}):null})),E["default"].createElement("div",{className:"gallery__files"},this.props.queuedFiles.items.map(function(t,n){return E["default"].createElement(S["default"],{
key:"queued_file_"+n,item:t,selectable:o,selected:e.itemIsSelected(t.id),highlighted:e.itemIsHighlighted(t.id),handleDelete:e.handleItemDelete,handleActivate:e.handleFileActivate,handleCancelUpload:e.handleCancelUpload,
handleRemoveErroredUpload:e.handleRemoveErroredUpload,message:t.message,uploading:!0})}),this.props.files.map(function(t,n){return"folder"!==t.type?E["default"].createElement(S["default"],{key:"file_"+n,
item:t,selectable:o,selected:e.itemIsSelected(t.id),highlighted:e.itemIsHighlighted(t.id),handleDelete:e.handleItemDelete,handleToggleSelect:e.handleToggleSelect,handleActivate:e.handleFileActivate}):null

})),this.getNoItemsNotice(),E["default"].createElement("div",{className:"gallery__load"},this.getMoreButton()))))}}]),t}(v.Component)
q.defaultProps={type:"admin"},q.propTypes={dialog:v.PropTypes.bool,fileId:v.PropTypes.number,folderId:v.PropTypes.number.isRequired,folder:v.PropTypes.shape({id:v.PropTypes.number,parentID:v.PropTypes.number,
canView:v.PropTypes.bool,canEdit:v.PropTypes.bool}),queuedFiles:v.PropTypes.shape({items:v.PropTypes.array.isRequired}),onOpenFile:v.PropTypes.func.isRequired,onOpenFolder:v.PropTypes.func.isRequired,onSort:v.PropTypes.func,
createFileApiUrl:v.PropTypes.string,createFileApiMethod:v.PropTypes.string,createFolderApi:v.PropTypes.func,readFolderApi:v.PropTypes.func,deleteApi:v.PropTypes.func,actions:v.PropTypes.object,sort:v.PropTypes.string,
type:v.PropTypes.oneOf(["insert","admin"]),limit:v.PropTypes.number,page:v.PropTypes.number,loading:v.PropTypes.bool,count:v.PropTypes.number,files:v.PropTypes.array,selectedFiles:v.PropTypes.arrayOf(v.PropTypes.number),
errorMessage:v.PropTypes.string,securityId:v.PropTypes.string},t.Gallery=q,t["default"]=(0,T.connect)(u,d)(q)},function(e,t){e.exports=jQuery},function(e,t){e.exports=ReactDom},function(e,t){e.exports=ReactAddonsCssTransitionGroup

},function(e,t){e.exports=ReactAddonsTestUtils},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),u=function I(e,t,n){null===e&&(e=Function.prototype)


var i=Object.getOwnPropertyDescriptor(e,t)
if(void 0===i){var r=Object.getPrototypeOf(e)
return null===r?void 0:I(r,t,n)}if("value"in i)return i.value
var o=i.get
if(void 0!==o)return o.call(n)},d=n(3),p=i(d),c=n(19),f=i(c),h=n(7),m=i(h),y=n(9),g=i(y),v=n(23),E=i(v),b=n(18),_=i(b),F=function(e){function t(e){r(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.dropzone=null,n.dragging=!1,n.handleAddedFile=n.handleAddedFile.bind(n),n.handleDragEnter=n.handleDragEnter.bind(n),n.handleDragLeave=n.handleDragLeave.bind(n),n.handleDrop=n.handleDrop.bind(n),
n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleError=n.handleError.bind(n),n.handleSending=n.handleSending.bind(n),n.handleSuccess=n.handleSuccess.bind(n),n.loadImage=n.loadImage.bind(n),
n}return l(t,e),s(t,[{key:"componentDidMount",value:function n(){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this)
var e=this.getDefaultOptions()
this.props.uploadButton===!0&&(e.clickable=(0,_["default"])(f["default"].findDOMNode(this)).find(".asset-dropzone__upload-button")[0]),this.props.uploadSelector&&(e.clickable=(0,_["default"])(f["default"].findDOMNode(this)).find(this.props.uploadSelector)[0]),
this.dropzone=new E["default"](f["default"].findDOMNode(this),a({},e,this.props.options)),"undefined"!=typeof this.props.promptOnRemove&&this.setPromptOnRemove(this.props.promptOnRemove)}},{key:"componentWillUnmount",
value:function i(){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentWillUnmount",this).call(this),this.dropzone.disable()}},{key:"render",value:function d(){var e=["asset-dropzone"]


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

}},{key:"handleSending",value:function F(e,t,n){n.append("SecurityID",this.props.securityID),n.append("ParentID",this.props.folderId),"function"==typeof this.props.handleSending&&this.props.handleSending(e,t,n)

}},{key:"generateQueuedId",value:function I(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,n="x"===e?t:3&t|8
return n.toString(16)})}},{key:"handleAddedFile",value:function T(e){var t=this
if(!this.props.canUpload)return Promise.reject(new Error(g["default"]._t("AssetAdmin.DROPZONE_CANNOT_UPLOAD")))
e._queuedId=this.generateQueuedId()
var n=new Promise(function(n){var i=new FileReader
i.onload=function(i){if("image"===t.getFileCategory(e.type)){var r=document.createElement("img")
n(t.loadImage(r,i.target.result))}else n({})},i.readAsDataURL(e)})
return n.then(function(n){var i={dimensions:{height:n.height,width:n.width},category:t.getFileCategory(e.type),filename:e.name,queuedId:e._queuedId,size:t.getFileSize(e.size),title:t.getFileTitle(e.name),
extension:t.getFileExtension(e.name),type:e.type,url:n.thumbnailURL}
return t.props.handleAddedFile(i),t.dropzone.processFile(e),i})}},{key:"getFileTitle",value:function A(e){return e.replace(/[.][^.]+$/,"").replace(/-_/," ")}},{key:"getFileExtension",value:function D(e){
return/[.]/.exec(e)?e.replace(/^.+[.]/,""):void 0}},{key:"getFileSize",value:function P(e){if(e<1024)return e+" bytes"
if(e<10240){var t=Math.round(e/1024*10)/10
return t+" KB"}if(e<1048576){var n=Math.round(e/1024)
return n+" KB"}if(e<10485760){var i=Math.round(e/1048576*10)/10
return i+" MB"}if(e<1073741824){var r=Math.round(e/1048576)
return r+" MB"}var o=Math.round(e/1073741824*10)/10
return o+" GB"}},{key:"loadImage",value:function O(e,t){var n=this
return new Promise(function(i){e.onload=function(){var t=document.createElement("canvas"),r=t.getContext("2d"),o=2*n.props.preview.width,l=2*n.props.preview.height,a=e.naturalWidth/e.naturalHeight
e.naturalWidth<o||e.naturalHeight<l?(t.width=e.naturalWidth,t.height=e.naturalHeight):a<1?(t.width=o,t.height=o/a):(t.width=l*a,t.height=l),r.drawImage(e,0,0,t.width,t.height)
var s=t.toDataURL("image/png")
i({width:e.naturalWidth,height:e.naturalHeight,thumbnailURL:s})},e.src=t})}},{key:"handleError",value:function L(e,t){"function"==typeof this.props.handleError&&this.props.handleError(e,t)}},{key:"handleSuccess",
value:function w(e){this.props.handleSuccess(e)}},{key:"setPromptOnRemove",value:function S(e){this.dropzone.options.dictRemoveFileConfirmation=e}}]),t}(m["default"])
F.propTypes={folderId:p["default"].PropTypes.number.isRequired,handleAddedFile:p["default"].PropTypes.func.isRequired,handleDragEnter:p["default"].PropTypes.func,handleDragLeave:p["default"].PropTypes.func,
handleDrop:p["default"].PropTypes.func,handleError:p["default"].PropTypes.func.isRequired,handleSending:p["default"].PropTypes.func,handleSuccess:p["default"].PropTypes.func.isRequired,options:p["default"].PropTypes.shape({
url:p["default"].PropTypes.string.isRequired}),promptOnRemove:p["default"].PropTypes.string,securityID:p["default"].PropTypes.string.isRequired,uploadButton:p["default"].PropTypes.bool,uploadSelector:p["default"].PropTypes.string,
canUpload:p["default"].PropTypes.bool.isRequired,preview:p["default"].PropTypes.shape({width:p["default"].PropTypes.number,height:p["default"].PropTypes.number}),className:p["default"].PropTypes.string
},F.defaultProps={uploadButton:!0},t["default"]=F},function(e,t,n){(function(e,t){(function(){var n,i,r,o,l,a,s,u,d=[].slice,p={}.hasOwnProperty,c=function(e,t){function n(){this.constructor=e}for(var i in t)p.call(t,i)&&(e[i]=t[i])


return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e}
s=function(){},i=function(){function e(){}return e.prototype.addEventListener=e.prototype.on,e.prototype.on=function(e,t){return this._callbacks=this._callbacks||{},this._callbacks[e]||(this._callbacks[e]=[]),
this._callbacks[e].push(t),this},e.prototype.emit=function(){var e,t,n,i,r,o
if(i=arguments[0],e=2<=arguments.length?d.call(arguments,1):[],this._callbacks=this._callbacks||{},n=this._callbacks[i])for(r=0,o=n.length;r<o;r++)t=n[r],t.apply(this,e)
return this},e.prototype.removeListener=e.prototype.off,e.prototype.removeAllListeners=e.prototype.off,e.prototype.removeEventListener=e.prototype.off,e.prototype.off=function(e,t){var n,i,r,o,l
if(!this._callbacks||0===arguments.length)return this._callbacks={},this
if(i=this._callbacks[e],!i)return this
if(1===arguments.length)return delete this._callbacks[e],this
for(r=o=0,l=i.length;o<l;r=++o)if(n=i[r],n===t){i.splice(r,1)
break}return this},e}(),n=function(e){function t(e,i){var r,o,l
if(this.element=e,this.version=t.version,this.defaultOptions.previewTemplate=this.defaultOptions.previewTemplate.replace(/\n*/g,""),this.clickableElements=[],this.listeners=[],this.files=[],"string"==typeof this.element&&(this.element=document.querySelector(this.element)),
!this.element||null==this.element.nodeType)throw new Error("Invalid dropzone element.")
if(this.element.dropzone)throw new Error("Dropzone already attached.")
if(t.instances.push(this),this.element.dropzone=this,r=null!=(l=t.optionsForElement(this.element))?l:{},this.options=n({},this.defaultOptions,r,null!=i?i:{}),this.options.forceFallback||!t.isBrowserSupported())return this.options.fallback.call(this)


if(null==this.options.url&&(this.options.url=this.element.getAttribute("action")),!this.options.url)throw new Error("No URL provided.")
if(this.options.acceptedFiles&&this.options.acceptedMimeTypes)throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.")
this.options.acceptedMimeTypes&&(this.options.acceptedFiles=this.options.acceptedMimeTypes,delete this.options.acceptedMimeTypes),this.options.method=this.options.method.toUpperCase(),(o=this.getExistingFallback())&&o.parentNode&&o.parentNode.removeChild(o),
this.options.previewsContainer!==!1&&(this.options.previewsContainer?this.previewsContainer=t.getElement(this.options.previewsContainer,"previewsContainer"):this.previewsContainer=this.element),this.options.clickable&&(this.options.clickable===!0?this.clickableElements=[this.element]:this.clickableElements=t.getElements(this.options.clickable,"clickable")),
this.init()}var n,r
return c(t,e),t.prototype.Emitter=i,t.prototype.events=["drop","dragstart","dragend","dragenter","dragover","dragleave","addedfile","addedfiles","removedfile","thumbnail","error","errormultiple","processing","processingmultiple","uploadprogress","totaluploadprogress","sending","sendingmultiple","success","successmultiple","canceled","canceledmultiple","complete","completemultiple","reset","maxfilesexceeded","maxfilesreached","queuecomplete"],
t.prototype.defaultOptions={url:null,method:"post",withCredentials:!1,parallelUploads:2,uploadMultiple:!1,maxFilesize:256,paramName:"file",createImageThumbnails:!0,maxThumbnailFilesize:10,thumbnailWidth:120,
thumbnailHeight:120,filesizeBase:1e3,maxFiles:null,params:{},clickable:!0,ignoreHiddenFiles:!0,acceptedFiles:null,acceptedMimeTypes:null,autoProcessQueue:!0,autoQueue:!0,addRemoveLinks:!1,previewsContainer:null,
hiddenInputContainer:"body",capture:null,renameFilename:null,dictDefaultMessage:"Drop files here to upload",dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",dictFallbackText:"Please use the fallback form below to upload your files like in the olden days.",
dictFileTooBig:"File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",dictInvalidFileType:"You can't upload files of this type.",dictResponseError:"Server responded with {{statusCode}} code.",
dictCancelUpload:"Cancel upload",dictCancelUploadConfirmation:"Are you sure you want to cancel this upload?",dictRemoveFile:"Remove file",dictRemoveFileConfirmation:null,dictMaxFilesExceeded:"You can not upload any more files.",
accept:function(e,t){return t()},init:function(){return s},forceFallback:!1,fallback:function(){var e,n,i,r,o,l
for(this.element.className=""+this.element.className+" dz-browser-not-supported",l=this.element.getElementsByTagName("div"),r=0,o=l.length;r<o;r++)e=l[r],/(^| )dz-message($| )/.test(e.className)&&(n=e,
e.className="dz-message")
return n||(n=t.createElement('<div class="dz-message"><span></span></div>'),this.element.appendChild(n)),i=n.getElementsByTagName("span")[0],i&&(null!=i.textContent?i.textContent=this.options.dictFallbackMessage:null!=i.innerText&&(i.innerText=this.options.dictFallbackMessage)),
this.element.appendChild(this.getFallbackForm())},resize:function(e){var t,n,i
return t={srcX:0,srcY:0,srcWidth:e.width,srcHeight:e.height},n=e.width/e.height,t.optWidth=this.options.thumbnailWidth,t.optHeight=this.options.thumbnailHeight,null==t.optWidth&&null==t.optHeight?(t.optWidth=t.srcWidth,
t.optHeight=t.srcHeight):null==t.optWidth?t.optWidth=n*t.optHeight:null==t.optHeight&&(t.optHeight=1/n*t.optWidth),i=t.optWidth/t.optHeight,e.height<t.optHeight||e.width<t.optWidth?(t.trgHeight=t.srcHeight,
t.trgWidth=t.srcWidth):n>i?(t.srcHeight=e.height,t.srcWidth=t.srcHeight*i):(t.srcWidth=e.width,t.srcHeight=t.srcWidth/i),t.srcX=(e.width-t.srcWidth)/2,t.srcY=(e.height-t.srcHeight)/2,t},drop:function(e){
return this.element.classList.remove("dz-drag-hover")},dragstart:s,dragend:function(e){return this.element.classList.remove("dz-drag-hover")},dragenter:function(e){return this.element.classList.add("dz-drag-hover")

},dragover:function(e){return this.element.classList.add("dz-drag-hover")},dragleave:function(e){return this.element.classList.remove("dz-drag-hover")},paste:s,reset:function(){return this.element.classList.remove("dz-started")

},addedfile:function(e){var n,i,r,o,l,a,s,u,d,p,c,f,h
if(this.element===this.previewsContainer&&this.element.classList.add("dz-started"),this.previewsContainer){for(e.previewElement=t.createElement(this.options.previewTemplate.trim()),e.previewTemplate=e.previewElement,
this.previewsContainer.appendChild(e.previewElement),p=e.previewElement.querySelectorAll("[data-dz-name]"),o=0,s=p.length;o<s;o++)n=p[o],n.textContent=this._renameFilename(e.name)
for(c=e.previewElement.querySelectorAll("[data-dz-size]"),l=0,u=c.length;l<u;l++)n=c[l],n.innerHTML=this.filesize(e.size)
for(this.options.addRemoveLinks&&(e._removeLink=t.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>'+this.options.dictRemoveFile+"</a>"),e.previewElement.appendChild(e._removeLink)),
i=function(n){return function(i){return i.preventDefault(),i.stopPropagation(),e.status===t.UPLOADING?t.confirm(n.options.dictCancelUploadConfirmation,function(){return n.removeFile(e)}):n.options.dictRemoveFileConfirmation?t.confirm(n.options.dictRemoveFileConfirmation,function(){
return n.removeFile(e)}):n.removeFile(e)}}(this),f=e.previewElement.querySelectorAll("[data-dz-remove]"),h=[],a=0,d=f.length;a<d;a++)r=f[a],h.push(r.addEventListener("click",i))
return h}},removedfile:function(e){var t
return e.previewElement&&null!=(t=e.previewElement)&&t.parentNode.removeChild(e.previewElement),this._updateMaxFilesReachedClass()},thumbnail:function(e,t){var n,i,r,o
if(e.previewElement){for(e.previewElement.classList.remove("dz-file-preview"),o=e.previewElement.querySelectorAll("[data-dz-thumbnail]"),i=0,r=o.length;i<r;i++)n=o[i],n.alt=e.name,n.src=t
return setTimeout(function(t){return function(){return e.previewElement.classList.add("dz-image-preview")}}(this),1)}},error:function(e,t){var n,i,r,o,l
if(e.previewElement){for(e.previewElement.classList.add("dz-error"),"String"!=typeof t&&t.error&&(t=t.error),o=e.previewElement.querySelectorAll("[data-dz-errormessage]"),l=[],i=0,r=o.length;i<r;i++)n=o[i],
l.push(n.textContent=t)
return l}},errormultiple:s,processing:function(e){if(e.previewElement&&(e.previewElement.classList.add("dz-processing"),e._removeLink))return e._removeLink.textContent=this.options.dictCancelUpload},processingmultiple:s,
uploadprogress:function(e,t,n){var i,r,o,l,a
if(e.previewElement){for(l=e.previewElement.querySelectorAll("[data-dz-uploadprogress]"),a=[],r=0,o=l.length;r<o;r++)i=l[r],"PROGRESS"===i.nodeName?a.push(i.value=t):a.push(i.style.width=""+t+"%")
return a}},totaluploadprogress:s,sending:s,sendingmultiple:s,success:function(e){if(e.previewElement)return e.previewElement.classList.add("dz-success")},successmultiple:s,canceled:function(e){return this.emit("error",e,"Upload canceled.")

},canceledmultiple:s,complete:function(e){if(e._removeLink&&(e._removeLink.textContent=this.options.dictRemoveFile),e.previewElement)return e.previewElement.classList.add("dz-complete")},completemultiple:s,
maxfilesexceeded:s,maxfilesreached:s,queuecomplete:s,addedfiles:s,previewTemplate:'<div class="dz-preview dz-file-preview">\n  <div class="dz-image"><img data-dz-thumbnail /></div>\n  <div class="dz-details">\n    <div class="dz-size"><span data-dz-size></span></div>\n    <div class="dz-filename"><span data-dz-name></span></div>\n  </div>\n  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n  <div class="dz-success-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Check</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>\n      </g>\n    </svg>\n  </div>\n  <div class="dz-error-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Error</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">\n          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>'
},n=function(){var e,t,n,i,r,o,l
for(i=arguments[0],n=2<=arguments.length?d.call(arguments,1):[],o=0,l=n.length;o<l;o++){t=n[o]
for(e in t)r=t[e],i[e]=r}return i},t.prototype.getAcceptedFiles=function(){var e,t,n,i,r
for(i=this.files,r=[],t=0,n=i.length;t<n;t++)e=i[t],e.accepted&&r.push(e)
return r},t.prototype.getRejectedFiles=function(){var e,t,n,i,r
for(i=this.files,r=[],t=0,n=i.length;t<n;t++)e=i[t],e.accepted||r.push(e)
return r},t.prototype.getFilesWithStatus=function(e){var t,n,i,r,o
for(r=this.files,o=[],n=0,i=r.length;n<i;n++)t=r[n],t.status===e&&o.push(t)
return o},t.prototype.getQueuedFiles=function(){return this.getFilesWithStatus(t.QUEUED)},t.prototype.getUploadingFiles=function(){return this.getFilesWithStatus(t.UPLOADING)},t.prototype.getAddedFiles=function(){
return this.getFilesWithStatus(t.ADDED)},t.prototype.getActiveFiles=function(){var e,n,i,r,o
for(r=this.files,o=[],n=0,i=r.length;n<i;n++)e=r[n],e.status!==t.UPLOADING&&e.status!==t.QUEUED||o.push(e)
return o},t.prototype.init=function(){var e,n,i,r,o,l,a
for("form"===this.element.tagName&&this.element.setAttribute("enctype","multipart/form-data"),this.element.classList.contains("dropzone")&&!this.element.querySelector(".dz-message")&&this.element.appendChild(t.createElement('<div class="dz-default dz-message"><span>'+this.options.dictDefaultMessage+"</span></div>")),
this.clickableElements.length&&(i=function(e){return function(){return e.hiddenFileInput&&e.hiddenFileInput.parentNode.removeChild(e.hiddenFileInput),e.hiddenFileInput=document.createElement("input"),e.hiddenFileInput.setAttribute("type","file"),
(null==e.options.maxFiles||e.options.maxFiles>1)&&e.hiddenFileInput.setAttribute("multiple","multiple"),e.hiddenFileInput.className="dz-hidden-input",null!=e.options.acceptedFiles&&e.hiddenFileInput.setAttribute("accept",e.options.acceptedFiles),
null!=e.options.capture&&e.hiddenFileInput.setAttribute("capture",e.options.capture),e.hiddenFileInput.style.visibility="hidden",e.hiddenFileInput.style.position="absolute",e.hiddenFileInput.style.top="0",
e.hiddenFileInput.style.left="0",e.hiddenFileInput.style.height="0",e.hiddenFileInput.style.width="0",document.querySelector(e.options.hiddenInputContainer).appendChild(e.hiddenFileInput),e.hiddenFileInput.addEventListener("change",function(){
var t,n,r,o
if(n=e.hiddenFileInput.files,n.length)for(r=0,o=n.length;r<o;r++)t=n[r],e.addFile(t)
return e.emit("addedfiles",n),i()})}}(this))(),this.URL=null!=(l=window.URL)?l:window.webkitURL,a=this.events,r=0,o=a.length;r<o;r++)e=a[r],this.on(e,this.options[e])
return this.on("uploadprogress",function(e){return function(){return e.updateTotalUploadProgress()}}(this)),this.on("removedfile",function(e){return function(){return e.updateTotalUploadProgress()}}(this)),
this.on("canceled",function(e){return function(t){return e.emit("complete",t)}}(this)),this.on("complete",function(e){return function(t){if(0===e.getAddedFiles().length&&0===e.getUploadingFiles().length&&0===e.getQueuedFiles().length)return setTimeout(function(){
return e.emit("queuecomplete")},0)}}(this)),n=function(e){return e.stopPropagation(),e.preventDefault?e.preventDefault():e.returnValue=!1},this.listeners=[{element:this.element,events:{dragstart:function(e){
return function(t){return e.emit("dragstart",t)}}(this),dragenter:function(e){return function(t){return n(t),e.emit("dragenter",t)}}(this),dragover:function(e){return function(t){var i
try{i=t.dataTransfer.effectAllowed}catch(r){}return t.dataTransfer.dropEffect="move"===i||"linkMove"===i?"move":"copy",n(t),e.emit("dragover",t)}}(this),dragleave:function(e){return function(t){return e.emit("dragleave",t)

}}(this),drop:function(e){return function(t){return n(t),e.drop(t)}}(this),dragend:function(e){return function(t){return e.emit("dragend",t)}}(this)}}],this.clickableElements.forEach(function(e){return function(n){
return e.listeners.push({element:n,events:{click:function(i){return(n!==e.element||i.target===e.element||t.elementInside(i.target,e.element.querySelector(".dz-message")))&&e.hiddenFileInput.click(),!0}
}})}}(this)),this.enable(),this.options.init.call(this)},t.prototype.destroy=function(){var e
return this.disable(),this.removeAllFiles(!0),(null!=(e=this.hiddenFileInput)?e.parentNode:void 0)&&(this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput),this.hiddenFileInput=null),delete this.element.dropzone,
t.instances.splice(t.instances.indexOf(this),1)},t.prototype.updateTotalUploadProgress=function(){var e,t,n,i,r,o,l,a
if(i=0,n=0,e=this.getActiveFiles(),e.length){for(a=this.getActiveFiles(),o=0,l=a.length;o<l;o++)t=a[o],i+=t.upload.bytesSent,n+=t.upload.total
r=100*i/n}else r=100
return this.emit("totaluploadprogress",r,n,i)},t.prototype._getParamName=function(e){return"function"==typeof this.options.paramName?this.options.paramName(e):""+this.options.paramName+(this.options.uploadMultiple?"["+e+"]":"")

},t.prototype._renameFilename=function(e){return"function"!=typeof this.options.renameFilename?e:this.options.renameFilename(e)},t.prototype.getFallbackForm=function(){var e,n,i,r
return(e=this.getExistingFallback())?e:(i='<div class="dz-fallback">',this.options.dictFallbackText&&(i+="<p>"+this.options.dictFallbackText+"</p>"),i+='<input type="file" name="'+this._getParamName(0)+'" '+(this.options.uploadMultiple?'multiple="multiple"':void 0)+' /><input type="submit" value="Upload!"></div>',
n=t.createElement(i),"FORM"!==this.element.tagName?(r=t.createElement('<form action="'+this.options.url+'" enctype="multipart/form-data" method="'+this.options.method+'"></form>'),r.appendChild(n)):(this.element.setAttribute("enctype","multipart/form-data"),
this.element.setAttribute("method",this.options.method)),null!=r?r:n)},t.prototype.getExistingFallback=function(){var e,t,n,i,r,o
for(t=function(e){var t,n,i
for(n=0,i=e.length;n<i;n++)if(t=e[n],/(^| )fallback($| )/.test(t.className))return t},o=["div","form"],i=0,r=o.length;i<r;i++)if(n=o[i],e=t(this.element.getElementsByTagName(n)))return e},t.prototype.setupEventListeners=function(){
var e,t,n,i,r,o,l
for(o=this.listeners,l=[],i=0,r=o.length;i<r;i++)e=o[i],l.push(function(){var i,r
i=e.events,r=[]
for(t in i)n=i[t],r.push(e.element.addEventListener(t,n,!1))
return r}())
return l},t.prototype.removeEventListeners=function(){var e,t,n,i,r,o,l
for(o=this.listeners,l=[],i=0,r=o.length;i<r;i++)e=o[i],l.push(function(){var i,r
i=e.events,r=[]
for(t in i)n=i[t],r.push(e.element.removeEventListener(t,n,!1))
return r}())
return l},t.prototype.disable=function(){var e,t,n,i,r
for(this.clickableElements.forEach(function(e){return e.classList.remove("dz-clickable")}),this.removeEventListeners(),i=this.files,r=[],t=0,n=i.length;t<n;t++)e=i[t],r.push(this.cancelUpload(e))
return r},t.prototype.enable=function(){return this.clickableElements.forEach(function(e){return e.classList.add("dz-clickable")}),this.setupEventListeners()},t.prototype.filesize=function(e){var t,n,i,r,o,l,a,s


if(i=0,r="b",e>0){for(l=["TB","GB","MB","KB","b"],n=a=0,s=l.length;a<s;n=++a)if(o=l[n],t=Math.pow(this.options.filesizeBase,4-n)/10,e>=t){i=e/Math.pow(this.options.filesizeBase,4-n),r=o
break}i=Math.round(10*i)/10}return"<strong>"+i+"</strong> "+r},t.prototype._updateMaxFilesReachedClass=function(){return null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(this.getAcceptedFiles().length===this.options.maxFiles&&this.emit("maxfilesreached",this.files),
this.element.classList.add("dz-max-files-reached")):this.element.classList.remove("dz-max-files-reached")},t.prototype.drop=function(e){var t,n
e.dataTransfer&&(this.emit("drop",e),t=e.dataTransfer.files,this.emit("addedfiles",t),t.length&&(n=e.dataTransfer.items,n&&n.length&&null!=n[0].webkitGetAsEntry?this._addFilesFromItems(n):this.handleFiles(t)))

},t.prototype.paste=function(e){var t,n
if(null!=(null!=e&&null!=(n=e.clipboardData)?n.items:void 0))return this.emit("paste",e),t=e.clipboardData.items,t.length?this._addFilesFromItems(t):void 0},t.prototype.handleFiles=function(e){var t,n,i,r


for(r=[],n=0,i=e.length;n<i;n++)t=e[n],r.push(this.addFile(t))
return r},t.prototype._addFilesFromItems=function(e){var t,n,i,r,o
for(o=[],i=0,r=e.length;i<r;i++)n=e[i],null!=n.webkitGetAsEntry&&(t=n.webkitGetAsEntry())?t.isFile?o.push(this.addFile(n.getAsFile())):t.isDirectory?o.push(this._addFilesFromDirectory(t,t.name)):o.push(void 0):null!=n.getAsFile&&(null==n.kind||"file"===n.kind)?o.push(this.addFile(n.getAsFile())):o.push(void 0)


return o},t.prototype._addFilesFromDirectory=function(e,t){var n,i,r
return n=e.createReader(),i=function(e){return"undefined"!=typeof console&&null!==console&&"function"==typeof console.log?console.log(e):void 0},(r=function(e){return function(){return n.readEntries(function(n){
var i,o,l
if(n.length>0){for(o=0,l=n.length;o<l;o++)i=n[o],i.isFile?i.file(function(n){if(!e.options.ignoreHiddenFiles||"."!==n.name.substring(0,1))return n.fullPath=""+t+"/"+n.name,e.addFile(n)}):i.isDirectory&&e._addFilesFromDirectory(i,""+t+"/"+i.name)


r()}return null},i)}}(this))()},t.prototype.accept=function(e,n){return e.size>1024*this.options.maxFilesize*1024?n(this.options.dictFileTooBig.replace("{{filesize}}",Math.round(e.size/1024/10.24)/100).replace("{{maxFilesize}}",this.options.maxFilesize)):t.isValidFile(e,this.options.acceptedFiles)?null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(n(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}",this.options.maxFiles)),
this.emit("maxfilesexceeded",e)):this.options.accept.call(this,e,n):n(this.options.dictInvalidFileType)},t.prototype.addFile=function(e){return e.upload={progress:0,total:e.size,bytesSent:0},this.files.push(e),
e.status=t.ADDED,this.emit("addedfile",e),this._enqueueThumbnail(e),this.accept(e,function(t){return function(n){return n?(e.accepted=!1,t._errorProcessing([e],n)):(e.accepted=!0,t.options.autoQueue&&t.enqueueFile(e)),
t._updateMaxFilesReachedClass()}}(this))},t.prototype.enqueueFiles=function(e){var t,n,i
for(n=0,i=e.length;n<i;n++)t=e[n],this.enqueueFile(t)
return null},t.prototype.enqueueFile=function(e){if(e.status!==t.ADDED||e.accepted!==!0)throw new Error("This file can't be queued because it has already been processed or was rejected.")
if(e.status=t.QUEUED,this.options.autoProcessQueue)return setTimeout(function(e){return function(){return e.processQueue()}}(this),0)},t.prototype._thumbnailQueue=[],t.prototype._processingThumbnail=!1,
t.prototype._enqueueThumbnail=function(e){if(this.options.createImageThumbnails&&e.type.match(/image.*/)&&e.size<=1024*this.options.maxThumbnailFilesize*1024)return this._thumbnailQueue.push(e),setTimeout(function(e){
return function(){return e._processThumbnailQueue()}}(this),0)},t.prototype._processThumbnailQueue=function(){if(!this._processingThumbnail&&0!==this._thumbnailQueue.length)return this._processingThumbnail=!0,
this.createThumbnail(this._thumbnailQueue.shift(),function(e){return function(){return e._processingThumbnail=!1,e._processThumbnailQueue()}}(this))},t.prototype.removeFile=function(e){if(e.status===t.UPLOADING&&this.cancelUpload(e),
this.files=u(this.files,e),this.emit("removedfile",e),0===this.files.length)return this.emit("reset")},t.prototype.removeAllFiles=function(e){var n,i,r,o
for(null==e&&(e=!1),o=this.files.slice(),i=0,r=o.length;i<r;i++)n=o[i],(n.status!==t.UPLOADING||e)&&this.removeFile(n)
return null},t.prototype.createThumbnail=function(e,t){var n
return n=new FileReader,n.onload=function(i){return function(){return"image/svg+xml"===e.type?(i.emit("thumbnail",e,n.result),void(null!=t&&t())):i.createThumbnailFromUrl(e,n.result,t)}}(this),n.readAsDataURL(e)

},t.prototype.createThumbnailFromUrl=function(e,t,n,i){var r
return r=document.createElement("img"),i&&(r.crossOrigin=i),r.onload=function(t){return function(){var i,o,l,s,u,d,p,c
if(e.width=r.width,e.height=r.height,l=t.options.resize.call(t,e),null==l.trgWidth&&(l.trgWidth=l.optWidth),null==l.trgHeight&&(l.trgHeight=l.optHeight),i=document.createElement("canvas"),o=i.getContext("2d"),
i.width=l.trgWidth,i.height=l.trgHeight,a(o,r,null!=(u=l.srcX)?u:0,null!=(d=l.srcY)?d:0,l.srcWidth,l.srcHeight,null!=(p=l.trgX)?p:0,null!=(c=l.trgY)?c:0,l.trgWidth,l.trgHeight),s=i.toDataURL("image/png"),
t.emit("thumbnail",e,s),null!=n)return n()}}(this),null!=n&&(r.onerror=n),r.src=t},t.prototype.processQueue=function(){var e,t,n,i
if(t=this.options.parallelUploads,n=this.getUploadingFiles().length,e=n,!(n>=t)&&(i=this.getQueuedFiles(),i.length>0)){if(this.options.uploadMultiple)return this.processFiles(i.slice(0,t-n))
for(;e<t;){if(!i.length)return
this.processFile(i.shift()),e++}}},t.prototype.processFile=function(e){return this.processFiles([e])},t.prototype.processFiles=function(e){var n,i,r
for(i=0,r=e.length;i<r;i++)n=e[i],n.processing=!0,n.status=t.UPLOADING,this.emit("processing",n)
return this.options.uploadMultiple&&this.emit("processingmultiple",e),this.uploadFiles(e)},t.prototype._getFilesWithXhr=function(e){var t,n
return n=function(){var n,i,r,o
for(r=this.files,o=[],n=0,i=r.length;n<i;n++)t=r[n],t.xhr===e&&o.push(t)
return o}.call(this)},t.prototype.cancelUpload=function(e){var n,i,r,o,l,a,s
if(e.status===t.UPLOADING){for(i=this._getFilesWithXhr(e.xhr),r=0,l=i.length;r<l;r++)n=i[r],n.status=t.CANCELED
for(e.xhr.abort(),o=0,a=i.length;o<a;o++)n=i[o],this.emit("canceled",n)
this.options.uploadMultiple&&this.emit("canceledmultiple",i)}else(s=e.status)!==t.ADDED&&s!==t.QUEUED||(e.status=t.CANCELED,this.emit("canceled",e),this.options.uploadMultiple&&this.emit("canceledmultiple",[e]))


if(this.options.autoProcessQueue)return this.processQueue()},r=function(){var e,t
return t=arguments[0],e=2<=arguments.length?d.call(arguments,1):[],"function"==typeof t?t.apply(this,e):t},t.prototype.uploadFile=function(e){return this.uploadFiles([e])},t.prototype.uploadFiles=function(e){
var i,o,l,a,s,u,d,p,c,f,h,m,y,g,v,E,b,_,F,I,T,A,D,P,O,L,w,S,C,k,U,R,M,x
for(F=new XMLHttpRequest,I=0,P=e.length;I<P;I++)i=e[I],i.xhr=F
m=r(this.options.method,e),b=r(this.options.url,e),F.open(m,b,!0),F.withCredentials=!!this.options.withCredentials,v=null,l=function(t){return function(){var n,r,o
for(o=[],n=0,r=e.length;n<r;n++)i=e[n],o.push(t._errorProcessing(e,v||t.options.dictResponseError.replace("{{statusCode}}",F.status),F))
return o}}(this),E=function(t){return function(n){var r,o,l,a,s,u,d,p,c
if(null!=n)for(o=100*n.loaded/n.total,l=0,u=e.length;l<u;l++)i=e[l],i.upload={progress:o,total:n.total,bytesSent:n.loaded}
else{for(r=!0,o=100,a=0,d=e.length;a<d;a++)i=e[a],100===i.upload.progress&&i.upload.bytesSent===i.upload.total||(r=!1),i.upload.progress=o,i.upload.bytesSent=i.upload.total
if(r)return}for(c=[],s=0,p=e.length;s<p;s++)i=e[s],c.push(t.emit("uploadprogress",i,o,i.upload.bytesSent))
return c}}(this),F.onload=function(n){return function(i){var r
if(e[0].status!==t.CANCELED&&4===F.readyState){if(v=F.responseText,F.getResponseHeader("content-type")&&~F.getResponseHeader("content-type").indexOf("application/json"))try{v=JSON.parse(v)}catch(o){i=o,
v="Invalid JSON response from server."}return E(),200<=(r=F.status)&&r<300?n._finished(e,v,i):l()}}}(this),F.onerror=function(n){return function(){if(e[0].status!==t.CANCELED)return l()}}(this),g=null!=(C=F.upload)?C:F,
g.onprogress=E,u={Accept:"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"},this.options.headers&&n(u,this.options.headers)
for(a in u)s=u[a],s&&F.setRequestHeader(a,s)
if(o=new FormData,this.options.params){k=this.options.params
for(h in k)_=k[h],o.append(h,_)}for(T=0,O=e.length;T<O;T++)i=e[T],this.emit("sending",i,F,o)
if(this.options.uploadMultiple&&this.emit("sendingmultiple",e,F,o),"FORM"===this.element.tagName)for(U=this.element.querySelectorAll("input, textarea, select, button"),A=0,L=U.length;A<L;A++)if(p=U[A],
c=p.getAttribute("name"),f=p.getAttribute("type"),"SELECT"===p.tagName&&p.hasAttribute("multiple"))for(R=p.options,D=0,w=R.length;D<w;D++)y=R[D],y.selected&&o.append(c,y.value)
else(!f||"checkbox"!==(M=f.toLowerCase())&&"radio"!==M||p.checked)&&o.append(c,p.value)
for(d=S=0,x=e.length-1;0<=x?S<=x:S>=x;d=0<=x?++S:--S)o.append(this._getParamName(d),e[d],this._renameFilename(e[d].name))
return this.submitRequest(F,o,e)},t.prototype.submitRequest=function(e,t,n){return e.send(t)},t.prototype._finished=function(e,n,i){var r,o,l
for(o=0,l=e.length;o<l;o++)r=e[o],r.status=t.SUCCESS,this.emit("success",r,n,i),this.emit("complete",r)
if(this.options.uploadMultiple&&(this.emit("successmultiple",e,n,i),this.emit("completemultiple",e)),this.options.autoProcessQueue)return this.processQueue()},t.prototype._errorProcessing=function(e,n,i){
var r,o,l
for(o=0,l=e.length;o<l;o++)r=e[o],r.status=t.ERROR,this.emit("error",r,n,i),this.emit("complete",r)
if(this.options.uploadMultiple&&(this.emit("errormultiple",e,n,i),this.emit("completemultiple",e)),this.options.autoProcessQueue)return this.processQueue()},t}(i),n.version="4.3.0",n.options={},n.optionsForElement=function(e){
return e.getAttribute("id")?n.options[r(e.getAttribute("id"))]:void 0},n.instances=[],n.forElement=function(e){if("string"==typeof e&&(e=document.querySelector(e)),null==(null!=e?e.dropzone:void 0))throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.")


return e.dropzone},n.autoDiscover=!0,n.discover=function(){var e,t,i,r,o,l
for(document.querySelectorAll?i=document.querySelectorAll(".dropzone"):(i=[],e=function(e){var t,n,r,o
for(o=[],n=0,r=e.length;n<r;n++)t=e[n],/(^| )dropzone($| )/.test(t.className)?o.push(i.push(t)):o.push(void 0)
return o},e(document.getElementsByTagName("div")),e(document.getElementsByTagName("form"))),l=[],r=0,o=i.length;r<o;r++)t=i[r],n.optionsForElement(t)!==!1?l.push(new n(t)):l.push(void 0)
return l},n.blacklistedBrowsers=[/opera.*Macintosh.*version\/12/i],n.isBrowserSupported=function(){var e,t,i,r,o
if(e=!0,window.File&&window.FileReader&&window.FileList&&window.Blob&&window.FormData&&document.querySelector)if("classList"in document.createElement("a"))for(o=n.blacklistedBrowsers,i=0,r=o.length;i<r;i++)t=o[i],
t.test(navigator.userAgent)&&(e=!1)
else e=!1
else e=!1
return e},u=function(e,t){var n,i,r,o
for(o=[],i=0,r=e.length;i<r;i++)n=e[i],n!==t&&o.push(n)
return o},r=function(e){return e.replace(/[\-_](\w)/g,function(e){return e.charAt(1).toUpperCase()})},n.createElement=function(e){var t
return t=document.createElement("div"),t.innerHTML=e,t.childNodes[0]},n.elementInside=function(e,t){if(e===t)return!0
for(;e=e.parentNode;)if(e===t)return!0
return!1},n.getElement=function(e,t){var n
if("string"==typeof e?n=document.querySelector(e):null!=e.nodeType&&(n=e),null==n)throw new Error("Invalid `"+t+"` option provided. Please provide a CSS selector or a plain HTML element.")
return n},n.getElements=function(e,t){var n,i,r,o,l,a,s,u
if(e instanceof Array){r=[]
try{for(o=0,a=e.length;o<a;o++)i=e[o],r.push(this.getElement(i,t))}catch(d){n=d,r=null}}else if("string"==typeof e)for(r=[],u=document.querySelectorAll(e),l=0,s=u.length;l<s;l++)i=u[l],r.push(i)
else null!=e.nodeType&&(r=[e])
if(null==r||!r.length)throw new Error("Invalid `"+t+"` option provided. Please provide a CSS selector, a plain HTML element or a list of those.")
return r},n.confirm=function(e,t,n){return window.confirm(e)?t():null!=n?n():void 0},n.isValidFile=function(e,t){var n,i,r,o,l
if(!t)return!0
for(t=t.split(","),i=e.type,n=i.replace(/\/.*$/,""),o=0,l=t.length;o<l;o++)if(r=t[o],r=r.trim(),"."===r.charAt(0)){if(e.name.toLowerCase().indexOf(r.toLowerCase(),e.name.length-r.length)!==-1)return!0}else if(/\/\*$/.test(r)){
if(n===r.replace(/\/.*$/,""))return!0}else if(i===r)return!0
return!1},"undefined"!=typeof e&&null!==e&&(e.fn.dropzone=function(e){return this.each(function(){return new n(this,e)})}),"undefined"!=typeof t&&null!==t?t.exports=n:window.Dropzone=n,n.ADDED="added",
n.QUEUED="queued",n.ACCEPTED=n.QUEUED,n.UPLOADING="uploading",n.PROCESSING=n.UPLOADING,n.CANCELED="canceled",n.ERROR="error",n.SUCCESS="success",l=function(e){var t,n,i,r,o,l,a,s,u,d
for(a=e.naturalWidth,l=e.naturalHeight,n=document.createElement("canvas"),n.width=1,n.height=l,i=n.getContext("2d"),i.drawImage(e,0,0),r=i.getImageData(0,0,1,l).data,d=0,o=l,s=l;s>d;)t=r[4*(s-1)+3],0===t?o=s:d=s,
s=o+d>>1
return u=s/l,0===u?1:u},a=function(e,t,n,i,r,o,a,s,u,d){var p
return p=l(t),e.drawImage(t,n,i,r,o,a,s,u,d/p)},o=function(e,t){var n,i,r,o,l,a,s,u,d
if(r=!1,d=!0,i=e.document,u=i.documentElement,n=i.addEventListener?"addEventListener":"attachEvent",s=i.addEventListener?"removeEventListener":"detachEvent",a=i.addEventListener?"":"on",o=function(n){if("readystatechange"!==n.type||"complete"===i.readyState)return("load"===n.type?e:i)[s](a+n.type,o,!1),
!r&&(r=!0)?t.call(e,n.type||n):void 0},l=function(){var e
try{u.doScroll("left")}catch(t){return e=t,void setTimeout(l,50)}return o("poll")},"complete"!==i.readyState){if(i.createEventObject&&u.doScroll){try{d=!e.frameElement}catch(p){}d&&l()}return i[n](a+"DOMContentLoaded",o,!1),
i[n](a+"readystatechange",o,!1),e[n](a+"load",o,!1)}},n._autoDiscoverFunction=function(){if(n.autoDiscover)return n.discover()},o(window,n._autoDiscoverFunction)}).call(this)}).call(t,n(18),n(24)(e))},function(e,t){
e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],e.webpackPolyfill=1),e}},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),s=n(9),u=i(s),d=n(3),p=i(d),c=n(14),f=i(c),h=n(7),m=i(h),y=n(26),g=i(y),v=function(e){
function t(e){r(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleToggleSelect=n.handleToggleSelect.bind(n),n.handleDelete=n.handleDelete.bind(n),n.handleActivate=n.handleActivate.bind(n),n.handleKeyDown=n.handleKeyDown.bind(n),n.handleCancelUpload=n.handleCancelUpload.bind(n),
n.preventFocus=n.preventFocus.bind(n),n}return l(t,e),a(t,[{key:"handleActivate",value:function n(e){e.stopPropagation(),this.props.handleActivate(e,this.props.item)}},{key:"handleToggleSelect",value:function i(e){
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
function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0})
var r=n(3),o=i(r),l=o["default"].PropTypes.shape({exists:o["default"].PropTypes.bool,type:o["default"].PropTypes.string,smallThumbnail:o["default"].PropTypes.string,thumbnail:o["default"].PropTypes.string,
dimensions:o["default"].PropTypes.shape({width:o["default"].PropTypes.number,height:o["default"].PropTypes.number}),category:o["default"].PropTypes.oneOfType([o["default"].PropTypes.bool,o["default"].PropTypes.string]).isRequired,
id:o["default"].PropTypes.number.isRequired,url:o["default"].PropTypes.string,title:o["default"].PropTypes.string.isRequired,progress:o["default"].PropTypes.number})
t["default"]=l},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return{gallery:e.assetAdmin.gallery
}}Object.defineProperty(t,"__esModule",{value:!0}),t.BulkActions=void 0
var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),u=n(18),d=i(u),p=n(3),c=i(p),f=n(19),h=i(f),m=n(7),y=i(m),g=n(21),v=i(g),E=n(5),b=t.BulkActions=function(e){
function t(e){r(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.onChangeValue=n.onChangeValue.bind(n),n}return l(t,e),s(t,[{key:"componentDidMount",value:function n(){var e=(0,d["default"])(h["default"].findDOMNode(this)).find(".dropdown")
e.chosen({allow_single_deselect:!0,disable_search_threshold:20}),e.change(function(){return v["default"].Simulate.click(e.find(":selected")[0])})}},{key:"render",value:function i(){var e=this,t=this.props.actions.map(function(t,n){
var i=e.props.items.length&&(!t.canApply||t.canApply(e.props.items))
if(!i)return""
var r=["bulk-actions_action","ss-ui-button","ui-corner-all",t.className||"font-icon-info-circled"].join(" ")
return c["default"].createElement("button",{type:"button",className:r,key:n,onClick:e.onChangeValue,value:t.value},t.label)})
return c["default"].createElement("div",{className:"bulk-actions fieldholder-small"},c["default"].createElement("div",{className:"bulk-actions-counter"},this.props.items.length),t)}},{key:"getOptionByValue",
value:function a(e){return this.props.actions.find(function(t){return t.value===e})}},{key:"onChangeValue",value:function u(e){var t=this,n=null,i=this.getOptionByValue(e.target.value)
return null===i?null:(n="function"==typeof i.confirm?i.confirm(this.props.items).then(function(){return i.callback(t.props.items)}):i.callback(this.props.items)||Promise.resolve(),(0,d["default"])(h["default"].findDOMNode(this)).find(".dropdown").val("").trigger("liszt:updated"),
n)}}]),t}(y["default"])
b.propTypes={items:c["default"].PropTypes.array,actions:c["default"].PropTypes.arrayOf(c["default"].PropTypes.shape({value:c["default"].PropTypes.string.isRequired,label:c["default"].PropTypes.string.isRequired,
className:c["default"].PropTypes.string,destructive:c["default"].PropTypes.bool,callback:c["default"].PropTypes.func,canApply:c["default"].PropTypes.func,confirm:c["default"].PropTypes.func}))},t["default"]=(0,
E.connect)(a)(b)},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(e){return function(t){return t({type:p["default"].ADD_QUEUED_FILE,payload:{file:e}})}}function o(e,t){return function(n){var i=t.message
return"string"==typeof t&&(i={value:t,type:"error"}),n({type:p["default"].FAIL_UPLOAD,payload:{queuedId:e,message:i}})}}function l(){return function(e){return e({type:p["default"].PURGE_UPLOAD_QUEUE,payload:null
})}}function a(e){return function(t){return t({type:p["default"].REMOVE_QUEUED_FILE,payload:{queuedId:e}})}}function s(e){return function(t){return t({type:p["default"].SUCCEED_UPLOAD,payload:{queuedId:e
}})}}function u(e,t){return function(n){return n({type:p["default"].UPDATE_QUEUED_FILE,payload:{queuedId:e,updates:t}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addQueuedFile=r,t.failUpload=o,
t.purgeUploadQueue=l,t.removeQueuedFile=a,t.succeedUpload=s,t.updateQueuedFile=u
var d=n(29),p=i(d)},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={ADD_QUEUED_FILE:"ADD_QUEUED_FILE",FAIL_UPLOAD:"FAIL_UPLOAD",PURGE_UPLOAD_QUEUE:"PURGE_UPLOAD_QUEUE",REMOVE_QUEUED_FILE:"REMOVE_QUEUED_FILE",
SUCCEED_UPLOAD:"SUCCEED_UPLOAD",UPDATE_QUEUED_FILE:"UPDATE_QUEUED_FILE"}},function(e,t){e.exports=Breadcrumb},function(e,t){e.exports=Toolbar},function(e,t){e.exports=SchemaActions},function(e,t,n){"use strict"


function i(e){return e&&e.__esModule?e:{"default":e}}var r=n(4),o=n(34),l=i(o),a=n(35),s=i(a),u=n(36),d=i(u),p=n(37),c=i(p),f=n(39),h=i(f),m=n(41),y=i(m),g=n(43),v=i(g),E=n(45),b=i(E),_=n(46),F=i(_)
document.addEventListener("DOMContentLoaded",function(){b["default"].register("FileField",F["default"])
var e=l["default"].getSection("SilverStripe\\AssetAdmin\\Controller\\AssetAdmin")
s["default"].add({path:e.url,component:y["default"],indexRoute:{onEnter:function t(n,i){var r=[e.url,"show",0].join("/")
i(r)}},childRoutes:[{path:"show/:folderId/edit/:fileId",component:y["default"]},{path:"show/:folderId",component:y["default"]}]}),d["default"].add("assetAdmin",(0,r.combineReducers)({gallery:c["default"],
queuedFiles:h["default"],fileField:v["default"]}))})},function(e,t){e.exports=Config},function(e,t){e.exports=ReactRouteRegister},function(e,t){e.exports=ReducerRegister},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(){var e=arguments.length<=0||void 0===arguments[0]?p:arguments[0],t=arguments[1],n=null
switch(t.type){case d["default"].ADD_FILES:var i=function(){var n=[]
return t.payload.files.forEach(function(t){var i=!1
e.files.forEach(function(e){e.id===t.id&&(i=!0)}),i||n.push(t)}),{v:(0,s["default"])(l({},e,{count:"undefined"!=typeof t.payload.count?t.payload.count:e.count,files:n.concat(e.files)}))}}()
if("object"===("undefined"==typeof i?"undefined":o(i)))return i.v
case d["default"].REMOVE_FILES:return n="undefined"==typeof t.payload.ids?(0,s["default"])(l({},e,{count:0,files:[]})):(0,s["default"])(l({},e,{count:e.files.filter(function(e){return t.payload.ids.indexOf(e.id)===-1

}).length,files:e.files.filter(function(e){return t.payload.ids.indexOf(e.id)===-1})}))
case d["default"].LOAD_FILE_SUCCESS:var r=e.files.find(function(e){return e.id===t.payload.id})
if(r){var a=function(){var n=l({},r,t.payload.file)
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
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e}
t["default"]=r
var a=n(38),s=i(a),u=n(11),d=i(u),p={count:0,editorFields:[],file:null,files:[],fileId:0,folderId:0,focus:!1,path:null,selectedFiles:[],page:0,errorMessage:null}},function(e,t){e.exports=DeepFreezeStrict

},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(){var e=arguments.length<=0||void 0===arguments[0]?h:arguments[0],t=arguments[1]
switch(t.type){case u["default"].ADD_QUEUED_FILE:return(0,a["default"])(o({},e,{items:e.items.concat([o({},(0,p["default"])(),t.payload.file)])}))
case u["default"].FAIL_UPLOAD:return(0,a["default"])(o({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?o({},e,{message:t.payload.message}):e})}))
case u["default"].PURGE_UPLOAD_QUEUE:return(0,a["default"])(o({},e,{items:e.items.filter(function(e){return!e.message||"error"!==e.message.type&&"success"!==e.message.type})}))
case u["default"].REMOVE_QUEUED_FILE:return(0,a["default"])(o({},e,{items:e.items.filter(function(e){return e.queuedId!==t.payload.queuedId})}))
case u["default"].SUCCEED_UPLOAD:return(0,a["default"])(o({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?o({},e,{messages:[{value:f["default"]._t("AssetAdmin.DROPZONE_SUCCESS_UPLOAD"),
type:"success",extraClass:"success"}]}):e})}))
case u["default"].UPDATE_QUEUED_FILE:return(0,a["default"])(o({},e,{items:e.items.map(function(e){return e.queuedId===t.payload.queuedId?o({},e,t.payload.updates):e})}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},l=n(38),a=i(l),s=n(29),u=i(s),d=n(40),p=i(d),c=n(9),f=i(c),h={items:[]}
t["default"]=r},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(){return(0,l["default"])({attributes:{dimensions:{height:null,width:null}},name:null,canDelete:!1,canEdit:!1,category:null,created:null,extension:null,
filename:null,id:0,lastUpdated:null,messages:null,owner:{id:0,title:null},parent:{filename:null,id:0,title:null},queuedId:null,size:null,title:null,type:null,url:null,xhr:null})}Object.defineProperty(t,"__esModule",{
value:!0})
var o=n(38),l=i(o)
t["default"]=r},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t=e.config.sections[y]


return{sectionConfig:t}}Object.defineProperty(t,"__esModule",{value:!0}),t.AssetAdminRouter=void 0
var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),d=n(3),p=i(d),c=n(5),f=n(42),h=n(6),m=i(h),y="SilverStripe\\AssetAdmin\\Controller\\AssetAdmin",g=function(e){
function t(e){r(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleBrowse=n.handleBrowse.bind(n),n.getUrl=n.getUrl.bind(n),n}return l(t,e),u(t,[{key:"getUrl",value:function n(e,t){var n=this.props.sectionConfig.url,i=n+"/show/"+(e||0)
return t&&(i=i+"/edit/"+t),i}},{key:"getSectionProps",value:function i(){return{sectionConfig:this.props.sectionConfig,type:"admin",folderId:parseInt(this.props.params.folderId,10),fileId:parseInt(this.props.params.fileId,10),
query:this.props.location.query,getUrl:this.getUrl,onBrowse:this.handleBrowse}}},{key:"handleBrowse",value:function a(e,t,n){var i=this.getUrl(e,t),r=null
r=null===n||n?s({},this.props.location.query,n):this.props.location.query,this.props.router.push(s({},this.props.location,{pathname:i,query:r}))}},{key:"render",value:function d(){if(!this.props.sectionConfig)return null


var e=this.getSectionProps()
return p["default"].createElement(m["default"],e)}}]),t}(d.Component)
g.propTypes={sectionConfig:d.PropTypes.shape({url:d.PropTypes.string,form:d.PropTypes.object}),location:d.PropTypes.shape({pathname:d.PropTypes.string,query:d.PropTypes.object}),params:d.PropTypes.shape({
fileId:d.PropTypes.string,folderId:d.PropTypes.string}),router:d.PropTypes.object},t.AssetAdminRouter=g,t["default"]=(0,f.withRouter)((0,c.connect)(a)(g))},function(e,t){e.exports=ReactRouter},function(e,t,n){
"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e){if(Array.isArray(e)){
for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function l(){return(0,d["default"])({attributes:{dimensions:{height:null,width:null}},name:null,canDelete:!1,canEdit:!1,category:null,created:null,extension:null,filename:null,
id:0,lastUpdated:null,messages:null,owner:{id:0,title:null},parent:{filename:null,id:0,title:null},queuedId:null,size:null,title:null,type:null,url:null,xhr:null,progress:0,uploaded:!1})}function a(){var e=arguments.length<=0||void 0===arguments[0]?f:arguments[0],t=arguments[1]


switch(t.type){case c["default"].FILEFIELD_ADD_FILE:return(0,d["default"])(s({},e,{fields:s({},e.fields,r({},t.payload.fieldId,[].concat(o(e.fields[t.payload.fieldId]||[]),[s({},l(),t.payload.file)])))
}))
case c["default"].FILEFIELD_SET_FILES:return(0,d["default"])(s({},e,{fields:s({},e.fields,r({},t.payload.fieldId,t.payload.files))}))
case c["default"].FILEFIELD_FAIL_UPLOAD:return(0,d["default"])(s({},e,{fields:s({},e.fields,r({},t.payload.fieldId,(e.fields[t.payload.fieldId]||[]).map(function(e){return e.queuedId===t.payload.queuedId?s({},e,{
message:t.payload.message}):e})))}))
case c["default"].FILEFIELD_REMOVE_FILE:return(0,d["default"])(s({},e,{fields:s({},e.fields,r({},t.payload.fieldId,(e.fields[t.payload.fieldId]||[]).filter(function(e){return!(t.payload.file.queuedId&&e.queuedId===t.payload.file.queuedId||t.payload.file.id&&e.id===t.payload.file.id)

})))}))
case c["default"].FILEFIELD_SUCCEED_UPLOAD:return(0,d["default"])(s({},e,{fields:s({},e.fields,r({},t.payload.fieldId,(e.fields[t.payload.fieldId]||[]).map(function(e){return e.queuedId===t.payload.queuedId?s({},e,t.payload.json):e

})))}))
case c["default"].FILEFIELD_UPDATE_QUEUED_FILE:return(0,d["default"])(s({},e,{fields:s({},e.fields,r({},t.payload.fieldId,(e.fields[t.payload.fieldId]||[]).map(function(e){return e.queuedId===t.payload.queuedId?s({},e,t.payload.updates):e

})))}))
default:return e}}Object.defineProperty(t,"__esModule",{value:!0})
var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e}
t.fileFactory=l
var u=n(38),d=i(u),p=n(44),c=i(p),f={fields:{}}
t["default"]=a},function(e,t){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={FILEFIELD_ADD_FILE:"FILEFIELD_ADD_FILE",FILEFIELD_SET_FILES:"FILEFIELD_SET_FILES",FILEFIELD_FAIL_UPLOAD:"FILEFIELD_FAIL_UPLOAD",FILEFIELD_REMOVE_FILE:"FILEFIELD_REMOVE_FILE",
FILEFIELD_SUCCEED_UPLOAD:"FILEFIELD_SUCCEED_UPLOAD",FILEFIELD_UPDATE_QUEUED_FILE:"FILEFIELD_UPDATE_QUEUED_FILE"}},function(e,t){e.exports=Injector},function(e,t,n){"use strict"
function i(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t["default"]=e,t}function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t){var n=t.id,i=[]


e.assetAdmin&&e.assetAdmin.fileField&&e.assetAdmin.fileField.fields&&(i=e.assetAdmin.fileField.fields[n]||[])
var r=e.config.SecurityID
return{files:i,securityId:r}}function u(e){return{actions:{fileField:(0,m.bindActionCreators)(L,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.FileField=void 0
var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},p=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),c=n(3),f=r(c),h=n(5),m=n(4),y=n(14),g=r(y),v=n(7),E=r(v),b=n(47),_=r(b),F=n(48),I=r(F),T=n(22),A=r(T),D=n(26),P=r(D),O=n(49),L=i(O),w=function(e){
function t(e){o(this,t)
var n=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.renderChild=n.renderChild.bind(n),n.handleAddedFile=n.handleAddedFile.bind(n),n.handleSending=n.handleSending.bind(n),n.handleUploadProgress=n.handleUploadProgress.bind(n),n.handleFailedUpload=n.handleFailedUpload.bind(n),
n.handleSuccessfulUpload=n.handleSuccessfulUpload.bind(n),n.handleItemRemove=n.handleItemRemove.bind(n),n.handleChange=n.handleChange.bind(n),n}return a(t,e),p(t,[{key:"componentDidMount",value:function n(){
this.props.actions.fileField.setFiles(this.props.id,this.props.data.files)}},{key:"componentWillReceiveProps",value:function i(e){var t=this.props.files||[],n=e.files||[],i=this.compareValues(t,n)
i&&this.handleChange(e)}},{key:"compareValues",value:function r(e,t){if(e.length!==t.length)return!0
for(var n=0;n<e.length;n++)if(e[n].id!==t[n].id)return!0
return!1}},{key:"handleAddedFile",value:function s(e){var t=d({},e,{uploaded:!0})
this.props.actions.fileField.addFile(this.props.id,t)}},{key:"handleSending",value:function u(e,t){this.props.actions.fileField.updateQueuedFile(this.props.id,e._queuedId,{xhr:t})}},{key:"handleUploadProgress",
value:function c(e,t){this.props.actions.fileField.updateQueuedFile(this.props.id,e._queuedId,{progress:t})}},{key:"handleSuccessfulUpload",value:function h(e){var t=JSON.parse(e.xhr.response)
return"undefined"!=typeof t[0].error?void this.handleFailedUpload(e):void this.props.actions.fileField.succeedUpload(this.props.id,e._queuedId,t[0])}},{key:"handleFailedUpload",value:function m(e,t){this.props.actions.fileField.failUpload(this.props.id,e._queuedId,t)

}},{key:"handleItemRemove",value:function y(e,t){this.props.actions.fileField.removeFile(this.props.id,t)}},{key:"handleChange",value:function v(e){if("function"==typeof e.onChange){var t=e.files.filter(function(e){
return e.id}).map(function(e){return e.id}),n={Files:t}
e.onChange(n)}}},{key:"render",value:function E(){return f["default"].createElement("div",{className:"file-field"},this.renderDropzone(),this.props.files.map(this.renderChild))}},{key:"renderDropzone",
value:function b(){if(this.props.files.length&&!this.props.data.multi)return null
var e={height:g["default"].SMALL_THUMBNAIL_HEIGHT,width:g["default"].SMALL_THUMBNAIL_WIDTH},t={url:this.props.data.createFileEndpoint.url,method:this.props.data.createFileEndpoint.method,paramName:"Upload",
thumbnailWidth:g["default"].SMALL_THUMBNAIL_WIDTH,thumbnailHeight:g["default"].SMALL_THUMBNAIL_HEIGHT},n=this.props.securityId
return f["default"].createElement(A["default"],{canUpload:!0,uploadButton:!1,uploadSelector:".file-field__dropzone-area",folderId:this.props.data.parentid,handleAddedFile:this.handleAddedFile,handleError:this.handleFailedUpload,
handleSuccess:this.handleSuccessfulUpload,handleSending:this.handleSending,handleUploadProgress:this.handleUploadProgress,preview:e,options:t,securityID:n,className:"file-field__dropzone"},f["default"].createElement("div",{
className:"file-field__dropzone-area"},f["default"].createElement("span",{className:"file-field__droptext"},f["default"].createElement("a",{className:"file-field__upload-button"},"Browse"))))}},{key:"renderChild",
value:function _(e,t){var n={key:t,item:e,name:this.props.name,handleRemove:this.handleItemRemove}
return f["default"].createElement(I["default"],n)}}]),t}(E["default"])
w.propTypes={extraClass:f["default"].PropTypes.string,id:f["default"].PropTypes.string.isRequired,name:f["default"].PropTypes.string.isRequired,onChange:f["default"].PropTypes.func,value:f["default"].PropTypes.shape({
Files:f["default"].PropTypes.arrayOf(f["default"].PropTypes.number)}),files:f["default"].PropTypes.arrayOf(P["default"]),readOnly:f["default"].PropTypes.bool,disabled:f["default"].PropTypes.bool,data:f["default"].PropTypes.shape({
createFileEndpoint:f["default"].PropTypes.shape({url:f["default"].PropTypes.string.isRequired,method:f["default"].PropTypes.string.isRequired,payloadFormat:f["default"].PropTypes.string.isRequired}),multi:f["default"].PropTypes.bool,
parentid:f["default"].PropTypes.number})},w.defaultProps={value:{Files:[]},extraClass:"",className:""},t.FileField=w,t["default"]=(0,_["default"])((0,h.connect)(s,u)(w))},function(e,t){e.exports=FieldHolder

},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),s=n(9),u=i(s),d=n(3),p=i(d),c=n(7),f=i(c),h=n(14),m=i(h),y=n(26),g=i(y),v=function(e){
function t(e){r(this,t)
var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleRemove=n.handleRemove.bind(n),n}return l(t,e),a(t,[{key:"getThumbnailStyles",value:function n(){if(this.isImage()&&(this.exists()||this.uploading())){var e=this.props.item.smallThumbnail||this.props.item.url


return{backgroundImage:"url("+e+")"}}return{}}},{key:"hasError",value:function i(){return!!this.props.item.message&&"error"===this.props.item.message.type}},{key:"getErrorMessage",value:function s(){var e=null


return this.hasError()?e=this.props.item.message.value:this.exists()||this.uploading()||(e=u["default"]._t("AssetAdmin.FILE_MISSING","File cannot be found")),null!==e?p["default"].createElement("div",{
className:"file-field-item__error-message"},e):null}},{key:"getThumbnailClassNames",value:function d(){var e=["file-field-item__thumbnail"]
return this.isImageSmallerThanThumbnail()&&e.push("file-field-item__thumbnail--small"),e.join(" ")}},{key:"getItemClassNames",value:function c(){var e=this.props.item.category||"none",t=["fill-width","file-field-item","file-field-item--"+e]


return this.exists()||this.uploading()||t.push("file-field-item--missing"),this.hasError()&&t.push("file-field-item--error"),t.join(" ")}},{key:"isImage",value:function f(){return"image"===this.props.item.category

}},{key:"exists",value:function h(){return this.props.item.exists}},{key:"uploading",value:function y(){return!!this.props.item.uploaded}},{key:"complete",value:function g(){return this.uploading()&&this.props.item.id>0

}},{key:"isImageSmallerThanThumbnail",value:function v(){if(!this.isImage()||!this.exists()&&!this.uploading())return!1
var e=this.props.item.dimensions
return e&&e.height<m["default"].SMALL_THUMBNAIL_HEIGHT&&e.width<m["default"].SMALL_THUMBNAIL_WIDTH}},{key:"preventFocus",value:function E(e){e.preventDefault()}},{key:"handleRemove",value:function b(e){
e.preventDefault(),this.props.handleRemove&&this.props.handleRemove(e,this.props.item)}},{key:"getProgressBar",value:function _(){var e={className:"file-field-item__progress-bar",style:{width:this.props.item.progress+"%"
}}
return!this.hasError()&&this.uploading()?this.complete()?p["default"].createElement("div",{className:"file-field-item__complete-icon"}):p["default"].createElement("div",{className:"file-field-item__upload-progress"
},p["default"].createElement("div",e)):null}},{key:"getRemoveButton",value:function F(){var e=["btn","file-field-item__remove-btn","btn-secondary","btn--no-text","font-icon-cancel","btn--icon-md"].join(" ")


return p["default"].createElement("button",{className:e,onClick:this.handleRemove,ref:"backButton"})}},{key:"getFileDetails",value:function I(){return p["default"].createElement("div",{className:"file-field-item__details fill-width flexbox-area-grow"
},p["default"].createElement("span",{className:"file-field-item__title",ref:"title"},this.props.item.title),p["default"].createElement("span",{className:"file-field-item__meta"},this.props.item.extension,", ",this.props.item.size))

}},{key:"render",value:function T(){var e=this.props.name+"[Files][]"
return p["default"].createElement("div",{className:this.getItemClassNames()},p["default"].createElement("input",{type:"hidden",value:this.props.item.id,name:e}),p["default"].createElement("div",{ref:"thumbnail",
className:this.getThumbnailClassNames(),style:this.getThumbnailStyles()}),this.getFileDetails(),this.getProgressBar(),this.getErrorMessage(),this.getRemoveButton())}}]),t}(f["default"])
v.propTypes={name:p["default"].PropTypes.string.isRequired,item:g["default"],handleRemove:p["default"].PropTypes.func},t["default"]=v},function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){return function(n){return n({type:p["default"].FILEFIELD_ADD_FILE,payload:{fieldId:e,file:t}})}}function o(e,t){return function(n){return n({
type:p["default"].FILEFIELD_SET_FILES,payload:{fieldId:e,files:t}})}}function l(e,t,n){return function(i){var r=n.message
return"string"==typeof n&&(r={value:n,type:"error"}),i({type:p["default"].FILEFIELD_FAIL_UPLOAD,payload:{fieldId:e,queuedId:t,message:r}})}}function a(e,t){return function(n){return n({type:p["default"].FILEFIELD_REMOVE_FILE,
payload:{fieldId:e,file:t}})}}function s(e,t,n){return function(i){return i({type:p["default"].FILEFIELD_SUCCEED_UPLOAD,payload:{fieldId:e,queuedId:t,json:n}})}}function u(e,t,n){return function(i){return i({
type:p["default"].FILEFIELD_UPDATE_QUEUED_FILE,payload:{fieldId:e,queuedId:t,updates:n}})}}Object.defineProperty(t,"__esModule",{value:!0}),t.addFile=r,t.setFiles=o,t.failUpload=l,t.removeFile=a,t.succeedUpload=s,
t.updateQueuedFile=u
var d=n(44),p=i(d)},function(e,t){}])

//# sourceMappingURL=bundle.js.map
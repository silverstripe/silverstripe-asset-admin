import Injector from 'lib/Injector';
import { combineReducers } from 'redux';
import gallery from 'state/gallery/GalleryReducer';
import queuedFiles from 'state/queuedFiles/QueuedFilesReducer';
import uploadField from 'state/uploadField/UploadFieldReducer';
import previewField from 'state/previewField/PreviewFieldReducer';
import imageLoad from 'state/imageLoad/ImageLoadReducer';
import displaySearch from 'state/displaySearch/DisplaySearchReducer';
import confirmDeletion from 'state/confirmDeletion/ConfirmDeletionReducer';
import modal from 'state/modal/ModalReducer';

const registerReducers = () => {
  Injector.reducer.register('assetAdmin', combineReducers({
    gallery,
    queuedFiles,
    uploadField,
    previewField,
    imageLoad,
    displaySearch,
    confirmDeletion,
    modal
  }));
};

export default registerReducers;

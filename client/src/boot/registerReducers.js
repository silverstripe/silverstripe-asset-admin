import Injector from 'lib/Injector';
import { combineReducers } from 'redux';
import galleryReducer from 'state/gallery/GalleryReducer';
import queuedFilesReducer from 'state/queuedFiles/QueuedFilesReducer';
import uploadFieldReducer from 'state/uploadField/UploadFieldReducer';
import previewFieldReducer from 'state/previewField/PreviewFieldReducer';
import imageLoadReducer from 'state/imageLoad/ImageLoadReducer';

const registerReducers = () => {
  Injector.reducer.register('assetAdmin', combineReducers({
    gallery: galleryReducer,
    queuedFiles: queuedFilesReducer,
    uploadField: uploadFieldReducer,
    previewField: previewFieldReducer,
    imageLoad: imageLoadReducer,
  }));
};

export default registerReducers;

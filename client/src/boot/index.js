import { combineReducers } from 'redux';
import Config from 'lib/Config';
import reactRouteRegister from 'lib/ReactRouteRegister';
import reducerRegister from 'lib/ReducerRegister';
import galleryReducer from 'state/gallery/GalleryReducer';
import queuedFilesReducer from 'state/queuedFiles/QueuedFilesReducer';
import AssetAdminRouter from 'containers/AssetAdmin/AssetAdminRouter';
import fileFieldReducer from 'state/fileField/FileFieldReducer';
import Injector from 'lib/Injector';
import FileField from 'components/FileField/FileField';

document.addEventListener('DOMContentLoaded', () => {
  Injector.register('FileField', FileField);

  const sectionConfig = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin');
  reactRouteRegister.add({
    path: sectionConfig.url,
    component: AssetAdminRouter,
    indexRoute: {
      // Show root folder by default
      onEnter: (nextState, replace) => {
        const redirectUrl = [
          sectionConfig.url,
          'show',
          0,
        ].join('/');
        replace(redirectUrl);
      },
    },
    childRoutes: [
      {
        path: 'show/:folderId/edit/:fileId',
        component: AssetAdminRouter,
      },
      {
        path: 'show/:folderId',
        component: AssetAdminRouter,
      },
    ],
  });

  reducerRegister.add('assetAdmin', combineReducers({
    gallery: galleryReducer,
    queuedFiles: queuedFilesReducer,
    fileField: fileFieldReducer,
  }));
});

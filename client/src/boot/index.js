import { combineReducers } from 'redux';
import Config from 'lib/Config';
import reactRouteRegister from 'lib/ReactRouteRegister';
import reducerRegister from 'lib/ReducerRegister';
import galleryReducer from 'state/gallery/GalleryReducer';
import queuedFilesReducer from 'state/queuedFiles/QueuedFilesReducer';
import editorReducer from 'state/editor/EditorReducer';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';

document.addEventListener('DOMContentLoaded', () => {
  const sectionConfig = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin');
  reactRouteRegister.add({
    path: sectionConfig.url,
    component: AssetAdmin,
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
        component: AssetAdmin,
      },
      {
        path: 'show/:folderId',
        component: AssetAdmin,
      },
    ],
  });

  reducerRegister.add('assetAdmin', combineReducers({
    gallery: galleryReducer,
    editor: editorReducer,
    queuedFiles: queuedFilesReducer,
  }));
});

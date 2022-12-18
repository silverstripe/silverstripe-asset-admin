/* global document */
import Config from 'lib/Config';
import reactRouteRegister from 'lib/ReactRouteRegister';
import AssetAdminRouter from 'containers/AssetAdmin/AssetAdminRouter';
import applyTransform from 'boot/applyTransform';
import registerReducers from 'boot/registerReducers';
import registerComponents from 'boot/registerComponents';
import registerQueries from 'boot/registerQueries';

document.addEventListener('DOMContentLoaded', () => {
  registerComponents();

  applyTransform();

  const baseURL = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin').reactRoutePath;

  reactRouteRegister.add({
    path: '/',
    routes: [
      {
        path: `${baseURL}/show/:folderId/:viewAction/:fileId`,
        component: AssetAdminRouter,
      },
      {
        path: `${baseURL}/show/:folderId/:viewAction`,
        component: AssetAdminRouter,
      },
      {
        path: `${baseURL}/show/:folderId`,
        component: AssetAdminRouter,
      },
      {
        path: `${baseURL}`,
        component: AssetAdminRouter,
      },
    ],
  });

  registerQueries();

  registerReducers();
});

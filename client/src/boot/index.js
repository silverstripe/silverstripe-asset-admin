/* global document */
import Config from 'lib/Config';
import reactRouteRegister from 'lib/ReactRouteRegister';
import AssetAdminRouter from 'containers/AssetAdmin/AssetAdminRouter';
import applyTransform from 'boot/applyTransform';
import registerReducers from 'boot/registerReducers';
import registerComponents from 'boot/registerComponents';
import registerQueries from 'boot/registerQueries';
import { joinUrlPaths } from 'lib/urls';

document.addEventListener('DOMContentLoaded', () => {
  registerComponents();

  applyTransform();

  const baseURL = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin').reactRoutePath;

  reactRouteRegister.add({
    path: '/',
    routes: [
      {
        path: joinUrlPaths(baseURL, 'show/:folderId/:viewAction/:fileId'),
        component: AssetAdminRouter,
      },
      {
        path: joinUrlPaths(baseURL, 'show/:folderId/:viewAction'),
        component: AssetAdminRouter,
      },
      {
        path: joinUrlPaths(baseURL, 'show/:folderId'),
        component: AssetAdminRouter,
      },
      {
        path: baseURL,
        component: AssetAdminRouter,
      },
    ],
  });

  registerQueries();

  registerReducers();
});

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

  const sectionConfig = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin');

  reactRouteRegister.add({
    path: '/',
    routes: [
      {
        path: `/${sectionConfig.url}/show/:folderId/:viewAction/:fileId`,
        component: AssetAdminRouter,
      },
      {
        path: `/${sectionConfig.url}/show/:folderId/:viewAction`,
        component: AssetAdminRouter,
      },
      {
        path: `/${sectionConfig.url}/show/:folderId`,
        component: AssetAdminRouter,
      },
      {
        path: `/${sectionConfig.url}`,
        component: AssetAdminRouter,
      },
    ],
  });

  registerQueries();

  registerReducers();
});

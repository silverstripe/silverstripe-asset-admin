/* global document */
import Config from 'lib/Config';
import reactRouteRegister from 'lib/ReactRouteRegister';
import AssetAdminRouter from 'containers/AssetAdmin/AssetAdminRouter';
import applyTransform from 'boot/applyTransform';
import registerReducers from 'boot/registerReducers';
import registerComponents from 'boot/registerComponents';

document.addEventListener('DOMContentLoaded', () => {
  registerComponents();

  applyTransform();

  const sectionConfig = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin');

  reactRouteRegister.add({
    path: sectionConfig.url,
    component: AssetAdminRouter,
    indexRoute: { component: AssetAdminRouter },
    childRoutes: [
      {
        path: 'show/:folderId/:viewAction/:fileId',
        component: AssetAdminRouter,
      },
      {
        path: 'show/:folderId/:viewAction',
        component: AssetAdminRouter,
      },
      {
        path: 'show/:folderId',
        component: AssetAdminRouter,
      },
    ],
  });

  registerReducers();
});

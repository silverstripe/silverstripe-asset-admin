import i18n from 'i18n';
import { combineReducers } from 'redux';
import Config from 'lib/Config';
import reactRouteRegister from 'lib/ReactRouteRegister';
import galleryReducer from 'state/gallery/GalleryReducer';
import queuedFilesReducer from 'state/queuedFiles/QueuedFilesReducer';
import AssetAdminRouter from 'containers/AssetAdmin/AssetAdminRouter';
import uploadFieldReducer from 'state/uploadField/UploadFieldReducer';
import previewFieldReducer from 'state/previewField/PreviewFieldReducer';
import imageLoadReducer from 'state/imageLoad/ImageLoadReducer';
import Injector from 'lib/Injector';
import UploadField from 'components/UploadField/UploadField';
import PreviewImageField from 'components/PreviewImageField/PreviewImageField';
import ProportionConstraintField from 'components/ProportionConstraintField/ProportionConstraintField';
import HistoryList from 'containers/HistoryList/HistoryList';

document.addEventListener('DOMContentLoaded', () => {
  Injector.component.register('UploadField', UploadField);
  Injector.component.register('PreviewImageField', PreviewImageField);
  Injector.component.register('HistoryList', HistoryList);
  Injector.component.register('ProportionConstraintField', ProportionConstraintField);

  Injector.transform(
    'insert-media-modal',
    (updater) => {
      updater.form.alterSchema('AssetAdmin.EditForm', form => {
        const schema = form.getState();
        const schemaId = schema.schema.id;
        const overrides = schema.stateOverride && schema.stateOverride.fields;
        const customTitle = (schemaId === 'Form_fileInsertForm' && overrides)
          ? i18n._t('AssetAdmin.UPDATE_FILE', 'Update file')
          : i18n._t('AssetAdmin.INSERT_FILE', 'Insert file');

        form.mutateField('action_insert', (field) => ({
          ...field,
          title: customTitle || field.title,
        }));

        return form.getState();
      });
    }
  );
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

  Injector.reducer.register('assetAdmin', combineReducers({
    gallery: galleryReducer,
    queuedFiles: queuedFilesReducer,
    uploadField: uploadFieldReducer,
    previewField: previewFieldReducer,
    imageLoad: imageLoadReducer,
  }));
});

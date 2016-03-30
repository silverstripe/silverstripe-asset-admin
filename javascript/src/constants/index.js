import i18n from 'i18n';

export default {
  CSS_TRANSITION_TIME: 300,
  THUMBNAIL_HEIGHT: 150,
  THUMBNAIL_WIDTH: 200,
  BULK_ACTIONS: [
    {
      value: 'delete',
      label: i18n._t('AssetGalleryField.BULK_ACTIONS_DELETE'),
      destructive: true,
    },
  ],
  BULK_ACTIONS_PLACEHOLDER: i18n._t('AssetGalleryField.BULK_ACTIONS_PLACEHOLDER'),
  HOME_ROUTE: '/assets', // Hardcoded here until we have a config manager
  EDITING_ROUTE: '/assets/EditForm/field/Files/item/:id/edit', // Hardcoded here until we have a config manager
  FOLDER_ROUTE: '/assets/show/:id?', // Hardcoded here until we have a config manager
};

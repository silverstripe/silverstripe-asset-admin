import i18n from 'i18n';

export default {
  CSS_TRANSITION_TIME: 300,
  THUMBNAIL_HEIGHT: 150,
  THUMBNAIL_WIDTH: 200,
  BULK_ACTIONS_DELETE: {
    value: 'delete',
    label: i18n._t('AssetAdmin.BULK_ACTIONS_DELETE', 'Delete'),
    className: 'font-icon-trash',
    destructive: true,
    disabled: false,
  },
  BULK_ACTIONS_EDIT_FOLDER: {
    value: 'editFolder',
    label: i18n._t('AssetAdmin.BULK_ACTIONS_EDIT_FOLDER', 'Edit folder'),
    className: 'font-icon-edit-list',
    destructive: false,
    disabled: false,
  },
  BULK_ACTIONS_PLACEHOLDER: i18n._t('AssetAdmin.BULK_ACTIONS_PLACEHOLDER'),
  SPACE_KEY_CODE: 32,
  RETURN_KEY_CODE: 13,
};

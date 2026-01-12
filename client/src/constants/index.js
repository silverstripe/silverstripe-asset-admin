/* global alert, confirm */
import i18n from 'i18n';

export default {
  ACTIONS: {
    CREATE_FOLDER: 'create-folder',
    EDIT_FILE: 'edit',
  },
  MOVE_SUCCESS_DURATION: 3000,
  CSS_TRANSITION_TIME: 300,
  SMALL_THUMBNAIL_HEIGHT: 60,
  SMALL_THUMBNAIL_WIDTH: 60,
  THUMBNAIL_HEIGHT: 150,
  THUMBNAIL_WIDTH: 200,
  BULK_ACTIONS: [
    {
      value: 'delete',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_DELETE', 'Delete'),
      icon: 'trash',
      destructive: true,
      callback: null, // defined in <Gallery> for now
      canApply: (items) => (
        items.every(item => item && item.canDelete)
      ),
    },
    // Archive is the same as Delete just with a different label and icon
    // There is logic to choose which bulk-action to use in Gallery.js
    {
      value: 'archive',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_ARCHIVE', 'Archive'),
      icon: 'box',
      destructive: true,
      callback: null, // defined in <Gallery> for now
      canApply: (items) => (
        items.every(item => item && item.canDelete)
      ),
    },
    {
      value: 'edit',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_EDIT', 'Edit'),
      icon: 'edit',
      destructive: false,
      // Only allow editing if a single item (file or folder) is selected
      canApply: (items) => items.length === 1,
      callback: null, // defined in <Gallery> for now
    },
    {
      value: 'move',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_MOVE', 'Move'),
      icon: 'folder-move',
      canApply: (items) => items.every(item => item && item.canEdit),
      destructive: false,
      callback: null,
    },
    {
      value: 'publish',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_PUBLISH', 'Publish'),
      icon: 'rocket',
      destructive: false,
      callback: null, // defined in <Gallery> for now
      canApply: (items) => (
        items.some(item => item && item.modified) &&
        items.every(item => item.canEdit && item.type !== 'folder')
      ),
      confirm: null,
    },
    {
      value: 'unpublish',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_UNPUBLISH', 'Unpublish'),
      icon: 'cancel-circled',
      destructive: false,
      callback: null, // defined in <Gallery> for now
      canApply: (items) => (
        items.some(item => item.published) &&
        items.every(item => item.canEdit && item.type !== 'folder')
      ),
      confirm: null,
    },
    {
      value: 'insert',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_INSERT', 'Insert'),
      className: 'btn-primary',
      icon: 'plus-circled',
      destructive: false,
      callback: null, // defined in <Gallery> for now
      canApply: (items) => items.length,
      confirm: null,
    },
  ],
  BULK_ACTIONS_PLACEHOLDER: i18n._t('AssetAdmin.BULK_ACTIONS_PLACEHOLDER'),
  DEFAULT_PREVIEW: 'framework/client/dist/images/app_icons/generic_92.png',
  MODAL_MOVE: 'MODAL_MOVE',
};

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
      className: 'font-icon-trash',
      destructive: true,
      callback: null, // defined in <Gallery> for now
      canApply: (items) => (
        items.every(item => item && item.canDelete)
      ),
      confirm: (items) => new Promise((resolve, reject) => {
        const foldersInUse = items.filter((item) =>
          item.type === 'folder' && item.filesInUseCount > 0
        );

        if (foldersInUse.length) {
          // eslint-disable-next-line no-alert
          alert(i18n._t(
            'AssetAdmin.BULK_ACTIONS_DELETE_FOLDER',
            'These folders contain files which are currently in use, you must move or '
              + 'delete their contents before you can delete the folder.'
          ));

          reject('cancelled');
          return;
        }
        const filesInUse = items.filter((item) =>
          item.type !== 'folder' && item.inUseCount > 0
        );

        let msg = i18n._t(
          'AssetAdmin.BULK_ACTIONS_DELETE_CONFIRM',
          'Are you sure you want to delete these files?'
        );
        if (items.length === 1 && filesInUse.length === 1) {
          msg = i18n.sprintf(
            i18n._t(
              'AssetAdmin.BULK_ACTIONS_DELETE_SINGLE_CONFIRM',
              'This file is currently used in %s place(s), are you sure you want to delete it?'
            ),
            items[0].inUseCount
          );
        } else if (filesInUse.length > 0) {
          msg = i18n.sprintf(
            i18n._t(
              'AssetAdmin.BULK_ACTIONS_DELETE_MULTI_CONFIRM',
              'There are %s files currently in use, are you sure you want to delete these files?'
            ),
            filesInUse.length
          );
        }
        if (filesInUse.length > 0) {
          msg += '\n\n';
          msg += i18n._t(
            'AssetAdmin.BULK_ACTIONS_DELETE_WARNING',
            'Ensure files are removed from content areas prior to deleting them,'
            + ' otherwise they will appear as broken links.'
          );
        }

        // eslint-disable-next-line no-alert
        if (confirm(msg)) {
          resolve();
        } else {
          reject('cancelled');
        }
      }),
    },
    {
      value: 'edit',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_EDIT', 'Edit'),
      className: 'font-icon-edit',
      destructive: false,
      // Only allow editing if a single item (file or folder) is selected
      canApply: (items) => items.length === 1,
      callback: null, // defined in <Gallery> for now
    },
    {
      value: 'move',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_MOVE', 'Move'),
      className: 'font-icon-folder-move',
      canApply: (items) => items.every(item => item && item.canEdit),
      destructive: false,
      callback: null,
    },
    {
      value: 'publish',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_PUBLISH', 'Publish'),
      className: 'font-icon-rocket',
      destructive: false,
      callback: null, // defined in <Gallery> for now
      canApply: (items) => (
        items.some(item => item && !item.published) &&
        items.every(item => item.canEdit && item.type !== 'folder')
      ),
      confirm: null,
    },
    {
      value: 'unpublish',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_UNPUBLISH', 'Unpublish'),
      className: 'font-icon-cancel-circled',
      destructive: false,
      callback: null, // defined in <Gallery> for now
      canApply: (items) => (
        items.some(item => item.published) &&
        items.every(item => item.canEdit && item.type !== 'folder')
      ),
      confirm: (items) => new Promise((resolve, reject) => {
        const filesInUse = items.filter((item) => item.inUseCount > 0);

        let msg = i18n._t(
          'AssetAdmin.BULK_ACTIONS_UNPUBLISH_CONFIRM',
          'Are you sure you want to unpublish these files?'
        );
        if (items.length === 1 && filesInUse.length === 1) {
          msg = i18n.sprintf(
            i18n._t(
              'AssetAdmin.BULK_ACTIONS_UNPUBLISH_SINGLE_CONFIRM',
              'This file is currently used in %s place(s), are you sure you want to unpublish it?'
            ),
            items[0].inUseCount
          );
        } else if (filesInUse.length > 0) {
          msg = i18n.sprintf(
            i18n._t(
              'AssetAdmin.BULK_ACTIONS_UNPUBLISH_MULTI_CONFIRM',
              'There are %s files currently in use, are you sure you want to unpublish these files?'
            ),
            filesInUse.length
          );
        }
        // eslint-disable-next-line no-alert
        if (confirm(msg)) {
          resolve();
        } else {
          reject('cancelled');
        }
      }),
    },
  ],
  BULK_ACTIONS_PLACEHOLDER: i18n._t('AssetAdmin.BULK_ACTIONS_PLACEHOLDER'),
  SPACE_KEY_CODE: 32,
  RETURN_KEY_CODE: 13,
  DEFAULT_PREVIEW: 'framework/client/dist/images/app_icons/generic_92.png',
  MODAL_MOVE: 'MODAL_MOVE',
};

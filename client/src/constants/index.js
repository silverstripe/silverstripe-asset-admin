import i18n from 'i18n';

export default {
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
        items.reduce(
          // TODO Fix 'delete' resultBehaviour to delete the "edge" object containing
          // the actual item, see AssetAdmin.js
          (current, item) => (item && item.canDelete && current),
          true
        )
      ),
      confirm: (items) => new Promise((resolve, reject) => {
        const foldersInUse = items.filter((item) =>
          item.type === 'folder' && item.filesInUseCount > 0
        );

        if (foldersInUse.length || true) {
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
              'This file is currently in use in %s places, are you sure you want to delete it?'
            ),
            items[0].inUseCount
          );
        }
        if (filesInUse.length > 1) {
          i18n.sprintf(
            i18n._t(
              'AssetAdmin.BULK_ACTIONS_DELETE_MULTI_CONFIRM',
              'There are %s files currently in use, are you sure you want to delete these files?'
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
    {
      value: 'edit',
      label: i18n._t('AssetAdmin.BULK_ACTIONS_EDIT', 'Edit'),
      className: 'font-icon-edit',
      destructive: false,
      // Only allow editing if a single item (file or folder) is selected
      canApply: (items) => items.length === 1,
      callback: null, // defined in <Gallery> for now
    },
  ],
  BULK_ACTIONS_PLACEHOLDER: i18n._t('AssetAdmin.BULK_ACTIONS_PLACEHOLDER'),
  SPACE_KEY_CODE: 32,
  RETURN_KEY_CODE: 13,
  DEFAULT_PREVIEW: 'framework/client/dist/images/app_icons/generic_92.png',
};

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
      canApply: (items) => {
          return items.reduce(function(current, item) {
              return (item.canDelete && current);
          }, true);
      },
      confirm: () => {
        let promise = null;
        const msg = i18n.sprintf(
          i18n._t('AssetAdmin.BULK_ACTIONS_CONFIRM'),
          i18n._t('AssetAdmin.BULK_ACTIONS_DELETE_CONFIRM', 'delete')
        );

        // eslint-disable-next-line no-alert
        if (confirm(msg)) {
          promise = Promise.resolve();
        } else {
          promise = Promise.reject();
        }

        return promise;
      },
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
};

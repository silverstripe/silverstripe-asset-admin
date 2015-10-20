export default {
	'THUMBNAIL_HEIGHT': 150,
	'THUMBNAIL_WIDTH': 200,
	'FILE_SELECT_KEYS': [32, 13],
	'ACTION_TITLE_EDIT': ss.i18n._t('AssetGalleryField.EDIT'),
	'ACTION_TITLE_DELETE': ss.i18n._t('AssetGalleryField.DELETE'),
	'BULK_ACTIONS': [
		{
			value: 'delete',
			label: ss.i18n._t('AssetGalleryField.BULK_ACTIONS_DELETE'),
			destructive: true
		}
	]
};

import i18n from 'i18n';

const insertAssetModal = (form) => {
  const schema = form.getState();

  const updateFile = i18n._t('AssetAdmin.UPDATE_FILE', 'Update file');
  const insertFile = i18n._t('AssetAdmin.INSERT_FILE', 'Insert file');

  const overrides = schema.stateOverride && schema.stateOverride.fields;
  let customTitle = overrides && overrides.length > 0 ? updateFile : insertFile;

  // see if TinyMCE button exists and is active (means user has selected an existing image)
  const insertButtonTitle = i18n._t('AssetAdmin.INSERT_FROM_FILES', 'Insert from Files');
  const insertButton = document.querySelector(`div[aria-label="${insertButtonTitle}"]`);
  if (insertButton) {
    customTitle = insertButton.classList.contains('mce-active') ? updateFile : insertFile;
  }

  form.mutateField('action_insert', (field) => ({
    ...field,
    title: customTitle || field.title,
  }));

  return form.getState();
};

export default insertAssetModal;

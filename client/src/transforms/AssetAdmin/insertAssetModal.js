import i18n from 'i18n';

const insertAssetModal = (form) => {
  console.dir(form);

  const schema = form.getState();
  const overrides = schema.stateOverride && schema.stateOverride.fields;
  const customTitle = (overrides && overrides.length > 0)
    ? i18n._t('AssetAdmin.UPDATE_FILE', 'Update file')
    : i18n._t('AssetAdmin.INSERT_FILE', 'Insert file');

  form.mutateField('action_insert', (field) => ({
    ...field,
    title: customTitle || field.title,
  }));


  return form.getState();
};

export default insertAssetModal;

import i18n from 'i18n';
import Injector from 'lib/Injector';

const insertTransform = form => {
  const schema = form.getState();
  // todo remove this schemaName check when injector considers schemaName for selector
  const schemaName = schema.schema.name;
  if (schemaName !== 'fileInsertForm') {
    return schema;
  }
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

const applyTransform = () => {
  Injector.transform(
    'insert-media-modal',
    (updater) => {
      updater.form.alterSchema('AssetAdmin.EditForm', insertTransform);
    }
  );
};

export default applyTransform;

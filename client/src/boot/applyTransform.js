import React from 'react';
import i18n from 'i18n';
import Injector from 'lib/Injector';
import { findTreeByPath } from 'components/TreeDropdownField/TreeDropdownField';
import { connect } from 'react-redux';
import { compose } from 'redux';

const insertTransform = (form) => {
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

const DisabledTreeDropdownField = (TreeDropdownField) => (props) => {
  /* eslint-disable react/prop-types */
  const { disabledIDs } = props;
  const find = props.findTreeByPath || findTreeByPath;
  /* eslint-enable react/prop-types */

  const newProps = {
    ...props,
    findTreeByPath(tree, visible) {
      const visibleTree = find(tree, visible);
      const pathDisabled = visible.some(id => disabledIDs.includes(id));
      return visibleTree ? {
        ...visibleTree,
        children: visibleTree.children.map(child => ({
          ...child,
          disabled: pathDisabled || disabledIDs.includes(child.id),
        })),
      } : null;
    },
  };

  return <TreeDropdownField {...newProps} />;
};

const ConnectedMoveTreeDropdownField = compose(
  connect(
    state => ({
      disabledIDs: state.assetAdmin.gallery.selectedFiles,
    })
  ),
  DisabledTreeDropdownField
);

const applyTransform = () => {
  Injector.transform(
    'insert-media-modal',
    (updater) => {
      updater.form.alterSchema('AssetAdmin.EditForm.fileInsertForm', insertTransform);
    }
  );

  Injector.transform(
    'move-form-disabled',
    (updater) => {
      updater.component('TreeDropdownField.AssetAdmin.MoveForm', ConnectedMoveTreeDropdownField);
    }
  );
};

export default applyTransform;

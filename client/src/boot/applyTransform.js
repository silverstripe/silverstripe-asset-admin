/* global confirm */
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

const OwnerAwareUnpublish = (FormAction) => (props) => {
  const originalOnclick = props.onClick;
  const newProps = {
    ...props,
    onClick(e, nameOrID) {
      const { owners } = props.data;
      if (owners && parseInt(owners, 10) > 0) {
        const message = [
          i18n.inject(
            i18n._t(
              'AssetAdmin.SINGLE_OWNED_WARNING_1',
              'This file is being used in {count} other published section(s).',
            ),
            { count: owners }
          ),
          i18n._t(
            'AssetAdmin.SINGLE_OWNED_WARNING_2',
            'Ensure files are removed from content areas prior to unpublishing them. Otherwise, they will appear as broken links.'
          ),
          i18n._t(
            'AssetAdmin.SINGLE_OWNED_WARNING_3',
            'Do you want to unpublish this file anyway?'
          )
        ];
        // eslint-disable-next-line no-alert
        if (confirm(message.join('\n\n'))) {
          e.preventDefault();
          return;
        }
      }
      originalOnclick(e, nameOrID);
    }
  };

  return <FormAction {...newProps} />;
};

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

  Injector.transform(
    'owner-unpublishing',
    (updater) => {
      updater.component('FormAction.AssetAdmin.EditForm.action_unpublish', OwnerAwareUnpublish);
    }
  );
};

export default applyTransform;

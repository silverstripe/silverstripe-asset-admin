import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { findTreeByPath } from 'components/TreeDropdownField/TreeDropdownField';

/**
 * Enables a treepdropdown field to have individually disabled items
 */
const disabledTreeDropdownField = (TreeDropdownField) => (props) => {
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

/*
 * Ensure selected files can't also be selected as move target
 */
const moveTreeDropdownField = compose(
  connect(
    state => ({
      disabledIDs: state.assetAdmin.gallery.selectedFiles,
    })
  ),
  disabledTreeDropdownField
);

export { disabledTreeDropdownField };

export default moveTreeDropdownField;

import i18n from 'i18n';
import React from 'react';
import { connect } from 'react-redux';
import { inject } from 'lib/Injector';
import { DropdownItem } from 'reactstrap';
import Button from 'components/Button/Button';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const BulkActions = ({
  items = [],
  actions = [],
  ActionMenu = null,
  showCount = true,
  onClearSelection,
  onSelectAll,
}) => {
  /**
   * @param {Element} target
   * @returns {Object} One of props.actions.
   */
  const getOptionByValue = (target) => {
    let option = actions.find(action => action.value === target.value);
    // If there's no option, make sure the actual button was the event target and not a child element
    if (option === null || option === undefined) {
      option = actions.find(action => action.value === target.closest('.bulk-actions__action').value);
    }
    return option;
  };

  /**
   * @param {Event} event
   * @returns {Promise|null}
   */
  const handleChangeValue = (event) => {
    let promise = null;

    // Make sure a valid option has been selected.
    const option = getOptionByValue(event.target);
    if (option === null || option === undefined) {
      return null;
    }

    // Optionally execute confirmation logic (can be async)
    // This is kept separate from "callback" in order to support
    // progress indicators on this component just for actual bulk processing
    // (instead of just waiting for user feedback in a dialog etc.)
    if (typeof option.confirm === 'function') {
      promise = option.confirm(items)
        .then(() => option.callback(event, items))
        .catch((reason) => {
          // Suppress and catch errors for user-cancelled actions
          if (reason !== 'cancelled') {
            throw reason;
          }
        });
    } else {
      promise = option.callback(event, items) || Promise.resolve();
    }

    return promise;
  };

  const renderChild = (action, i) => {
    const className = classnames(
      'bulk-actions__action',
      action.className,
      {
        btn: (i < 2),
        'bulk-actions__action--more': (i > 2),
      }
    );
    const icon = action.icon || 'info-circled';
    if (i < 2) {
      return (
        <Button
          className={className}
          icon={icon}
          key={action.value}
          onClick={handleChangeValue}
          value={action.value}
          color={action.color}
        >
          {action.label}
        </Button>
      );
    }
    return (
      <DropdownItem
        type="button"
        className={className}
        key={action.value}
        onClick={handleChangeValue}
        value={action.value}
      >
        <span className={`font-icon-${icon}`} aria-hidden="true" />
        {action.label}
      </DropdownItem>
    );
  };

  if (!items.length) {
    return null;
  }

  let children = actions.filter(action =>
    (!action.canApply || action.canApply(items))
  );

  children = children.map(renderChild);

  if (!children.length) {
    return null;
  }

  const selectAll = i18n._t('AssetAdmin.BULK_ACTIONS_SELECT_ALL', 'Select all');
  const selected = i18n.sprintf(
    i18n._t('AssetAdmin.BULK_ACTIONS_SELECTED', '%s selected'),
    items.length
  );
  const title = i18n._t('AssetAdmin.BULK_ACTIONS_CLEAR_SELECTION', 'Clear selection');

  return (
    <div className="bulk-actions fieldholder-small">
      {showCount &&
        <>
          <Button
            className="bulk-actions-counter"
            onClick={onClearSelection}
            title={title}
            icon="cross-mark"
          >
            {selected}
          </Button>
          <div className="bulk-actions-select-all">
            <Button onClick={onSelectAll}>
              {selectAll}
            </Button>
          </div>
        </>
      }
      {children.slice(0, 2)}
      {children.length > 2 && ActionMenu
        ? (
          <ActionMenu
            id="BulkActions"
            className="bulk-actions__more-actions-menu"
          >
            {children.slice(2)}
          </ActionMenu>
        )
        : children.slice(2)
      }
    </div>
  );
};

BulkActions.propTypes = {
  items: PropTypes.array,
  actions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    destructive: PropTypes.bool,
    callback: PropTypes.func,
    canApply: PropTypes.func,
    confirm: PropTypes.func,
    icon: PropTypes.string,
  })),
  ActionMenu: PropTypes.elementType,
  showCount: PropTypes.bool,
  onClearSelection: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    gallery: state.assetAdmin.gallery,
  };
}

const BulkActionsWithState = connect(mapStateToProps)(BulkActions);

export { BulkActions as Component };

export default inject(
  ['ActionMenu'],
  (ActionMenu) => ({ ActionMenu }),
  () => 'BulkActions'
)(BulkActionsWithState);

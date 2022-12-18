import i18n from 'i18n';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { inject } from 'lib/Injector';
import { Button, DropdownItem } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class BulkActions extends Component {
  constructor(props) {
    super(props);

    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.renderChild = this.renderChild.bind(this);
  }

  /**
   * @param {String} value
   * @returns {Object} One of props.actions.
   */
  getOptionByValue(value) {
    return this.props.actions.find(action => action.value === value);
  }

  /**
   * @param {Event} event
   * @returns {Promise|null}
   */
  handleChangeValue(event) {
    let promise = null;

    // Make sure a valid option has been selected.
    const option = this.getOptionByValue(event.target.value);
    if (option === null) {
      return null;
    }

    // Optionally execute confirmation logic (can be async)
    // This is kept separate from "callback" in order to support
    // progress indicators on this component just for actual bulk processing
    // (instead of just waiting for user feedback in a dialog etc.)
    if (typeof option.confirm === 'function') {
      promise = option.confirm(this.props.items)
        .then(() => option.callback(event, this.props.items))
        .catch((reason) => {
          // Suppress and catch errors for user-cancelled actions
          if (reason !== 'cancelled') {
            throw reason;
          }
        });
    } else {
      promise = option.callback(event, this.props.items) || Promise.resolve();
    }

    return promise;
  }

  renderChild(action, i) {
    const className = classnames(
      'bulk-actions__action',
      action.className || 'font-icon-info-circled',
      {
        btn: (i < 2),
        'bulk-actions__action--more': (i > 2),
      }
    );
    if (i < 2) {
      return (
        <Button
          className={className}
          key={action.value}
          onClick={this.handleChangeValue}
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
        onClick={this.handleChangeValue}
        value={action.value}
      >
        {action.label}
      </DropdownItem>
    );
  }

  render() {
    if (!this.props.items.length) {
      return null;
    }

    let children = this.props.actions.filter(action =>
      (!action.canApply || action.canApply(this.props.items))
    );

    children = children.map(this.renderChild);

    if (!children.length) {
      return null;
    }

    const { ActionMenu, showCount } = this.props;

    const count = this.props.items.length;

    return (
      <div className="bulk-actions fieldholder-small">
        {showCount &&
          <div className="bulk-actions-counter">{count}</div>
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
  }
}

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
  })),
  ActionMenu: PropTypes.elementType,
  showCount: PropTypes.bool,
};

BulkActions.defaultProps = {
  items: [],
  actions: [],
  ActionMenu: null,
  total: null,
  showCount: true,
  totalReachedMessage: i18n._t(''),
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

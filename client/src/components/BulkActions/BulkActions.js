import $ from 'jquery';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { connect } from 'react-redux';
import { inject } from 'lib/Injector';
import classnames from 'classnames';

class BulkActions extends Component {
  constructor(props) {
    super(props);

    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  componentDidMount() {
    const $select = $(ReactDOM.findDOMNode(this)).find('.dropdown');

    $select.chosen({
      allow_single_deselect: true,
      disable_search_threshold: 20,
    });

    // Chosen stops the change event from reaching React so we have to simulate a click.
    $select.change(() => ReactTestUtils.Simulate.click($select.find(':selected')[0]));
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
        .then(() => option.callback(this.props.items))
        .catch((reason) => {
          // Suppress and catch errors for user-cancelled actions
          if (reason !== 'cancelled') {
            throw reason;
          }
        });
    } else {
      promise = option.callback(this.props.items) || Promise.resolve();
    }

    // Reset the dropdown to it's placeholder value.
    $(ReactDOM.findDOMNode(this)).find('.dropdown').val('').trigger('liszt:updated');

    return promise;
  }

  render() {
    // eslint-disable-next-line arrow-body-style
    const children = this.props.actions.map((action, i) => {
      const canApply = (
        // At least one item is selected
        this.props.items.length &&
        // ... and the action applies to all of the selected items
        (!action.canApply || action.canApply(this.props.items))
      );
      if (!canApply) {
        return '';
      }

      const className = classnames(
        'bulk-actions__action',
        'ss-ui-button',
        'ui-corner-all',
        action.className || 'font-icon-info-circled',
        {
          'bulk-actions__action--more': (i > 2),
        }
      );
      return (<button
        type="button"
        className={className}
        key={action.value}
        onClick={this.handleChangeValue}
        value={action.value}
      >
        {action.label}
      </button>);
    }).filter(item => item);

    if (!children.length) {
      return null;
    }
    const { PopoverField } = this.props;

    return (
      <div className="bulk-actions fieldholder-small btn-group">
        <div className="bulk-actions-counter">{this.props.items.length}</div>
        {children.slice(0, 2)}
        {children.length > 2 && PopoverField
          ? (
            <PopoverField
              id="BulkActions"
              popoverClassName="bulk-actions__more-actions-menu"
              container={this}
              data={{ placement: 'bottom' }}
            >
              {children.slice(2)}
            </PopoverField>
          )
          : children.slice(2)
        }
      </div>
    );
  }
}

BulkActions.propTypes = {
  items: React.PropTypes.array,
  actions: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    destructive: React.PropTypes.bool,
    callback: React.PropTypes.func,
    canApply: React.PropTypes.func,
    confirm: React.PropTypes.func,
  })),
  PopoverField: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.func]),
};

BulkActions.defaultProps = {
  items: [],
  actions: [],
  PopoverField: null,
};

function mapStateToProps(state) {
  return {
    gallery: state.assetAdmin.gallery,
  };
}

const BulkActionsWithState = connect(mapStateToProps)(BulkActions);

export { BulkActions as Component };

export default inject(
  ['PopoverField'],
  (PopoverField) => ({ PopoverField }),
  () => 'BulkActions'
)(BulkActionsWithState);

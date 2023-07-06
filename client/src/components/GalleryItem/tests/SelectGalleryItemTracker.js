import React, { Component } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

const triggerAction = action('selected');
class SelectGalleryItemTracker extends Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      selected: props.item.selected,
    };
  }

  handleSelect(event, item) {
    triggerAction(this.state.selected ? 'unchecked' : 'checked', item.title);
    this.setState((prevState) => ({ selected: !prevState.selected }));
  }

  render() {
    const children = React.Children.map(this.props.children, (child) => (
      React.cloneElement(child, {
        item: {
          ...child.props.item,
          selected: this.state.selected,
        },
        onSelect: (...args) => {
          if (child.props.onSelect) {
            child.props.onSelect(...args);
          }
          this.handleSelect(...args);
        },
      })
    ));
    return <div>{children}</div>;
  }
}

SelectGalleryItemTracker.propTypes = {
  children: PropTypes.any,
  item: PropTypes.shape({
    selected: PropTypes.bool,
  }),
};

SelectGalleryItemTracker.defaultProps = {
  item: {
    selected: null,
  },
};

export default SelectGalleryItemTracker;

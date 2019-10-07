import React, { Component, Children, cloneElement, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import ImageSizePresetList from './ImageSizePresetList'
import { formValueSelector } from 'redux-form';
import getFormState from 'lib/getFormState';
import { connect } from 'react-redux';
import { compose } from 'redux';

class ProportionConstraintField extends Component {
  constructor(props) {
    super(props);
    const childrenArray = Children.toArray(props.children);

    if (childrenArray.length !== 2) {
      throw new Error('ProportionConstraintField must be passed two children -- one field for each value');
    }
  }

  /**
   * The overloading function for change handlers provided to the children
   *
   * @param {Number} childIndex
   * @param {Event} e
   */
  handleChange(childIndex, e, newValue) {
    const { children, active, onAutofill, data: { ratio } } = this.props;

    // value depends on whether onChange triggered on a basic input
    // or a redux form input
    const peerIndex = (childIndex === 0) ? 1 : 0;
    const value = newValue || e.target.value;
    const currentName = children[childIndex].props.name;
    const peerName = children[peerIndex].props.name;
    const multiplier = childIndex === 0 ? 1 / ratio : ratio;
    const { round } = Math;

    onAutofill(currentName, value);
    // retain aspect ratio only when this field is active
    if (active) {
      onAutofill(peerName, round(value * multiplier));
    }
  }

  render() {
    console.dir(this.props);
    const { FieldGroup, data: {imageSizePresets, originalWidth}, currentWidth } = this.props;

    return (
      <Fragment>
        <FieldGroup {...this.props}>
          {this.props.children.map((child, key) => (
            cloneElement(child, {
              // overload the children change handler
              onChange: (e, newValue) => this.handleChange(key, e, newValue),
              key,
            }, child.props.children)
          ))}
        </FieldGroup>

        <ImageSizePresetList
          imageSizePresets={imageSizePresets} originalWidth={originalWidth} currentWidth={currentWidth}
          onSelect={(value) => this.handleChange(0, {}, value)} />
      </Fragment>
    );
  }
}

ProportionConstraintField.propTypes = {
  children: PropTypes.array,
  onAutofill: PropTypes.func,
  active: PropTypes.bool,
  data: PropTypes.shape({
    ratio: PropTypes.number.isRequired,
    originalWidth: PropTypes.number,
    originalHeight: PropTypes.number,
  }),
  FieldGroup: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
};

ProportionConstraintField.defaultProps = {
  active: true,
};


function mapStateToProps(state,{formid}) {
  const selector = formValueSelector(formid, getFormState);

  return {
    currentWidth: selector(state, 'Width'),
  };
}

export { ProportionConstraintField as Component };

export default compose(
  connect(mapStateToProps),
  inject(['FieldGroup'])
)(ProportionConstraintField);

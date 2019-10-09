import React, { Component, Children, cloneElement, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import ImageSizePresetList from './ImageSizePresetList'
import { formValueSelector } from 'redux-form';
import getFormState from 'lib/getFormState';
import { connect } from 'react-redux';
import { compose } from 'redux';

/**
 * Component that displays a width and height field, syncing them up so that the ratio between them remain unchanged.
 */
class ProportionConstraintField extends Component {
  constructor(props) {
    super(props);
    const childrenArray = Children.toArray(props.children);

    if (childrenArray.length !== 2) {
      throw new Error('ProportionConstraintField must be passed two children -- one field for each value');
    }

    this.handlePresetSelect = this.handlePresetSelect.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);

    this.state = {hasFocus: false};
  }

  componentDidUpdate() {
    // Let invalid values stand if the user is currently editing the fields
    if (!this.state.hasFocus) {
      // Make sure our initial dimensions are initialised to something sensible
      const {current: {width}} = this.props;
      this.forceValidWidth(width);
    }
  }

  /**
   * Handle change events for the fields
   * @param {Number} childIndex Index of the field that has been changed
   * @param {String} newValue
   */
  handleChange(childIndex, newValue) {
    // If the new value can be converted to something sensible
    const value = parseInt(newValue);
    if (value && value > 0) {
      this.syncFields(childIndex, value)
    }
  }

  /**
   * Sync up the two fields
   * @param {Number} childIndex Index of the field that has been changed
   * @param {Number} newValue
   */
  syncFields(childIndex, newValue) {
    const {children, active, onAutofill, data: {ratio} } = this.props;

    // value depends on whether onChange triggered on a basic input
    // or a redux form input
    const peerIndex = (childIndex === 0) ? 1 : 0;

    const currentName = children[childIndex].props.name;
    const peerName = children[peerIndex].props.name;
    const multiplier = childIndex === 0 ? 1 / ratio : ratio;

    onAutofill(currentName, newValue);
    // retain aspect ratio only when this field is active
    if (active) {
      onAutofill(peerName, Math.round(newValue * multiplier));
    }
  }

  /**
   * Handle selection of a preset image
   * @param {Number} newWidth
   */
  handlePresetSelect(newWidth) {
    this.syncFields(0, newWidth);

    // Reset the focus on the Width field
    const {key} = this.props.children[0];
    document.getElementById(key).focus();
  }

  /**
   * Handle the user moving to another field
   * @param {Number} key Index of the field being blured
   * @param {Event} e
   */
  handleBlur(key, e) {
    this.setState({hasFocus: false})

    const newValue = parseInt(e.target.value)
    if (!newValue || newValue <= 0) {
      // If the user leave the field in an invalid state, reset dimensions to their default
      e.preventDefault();
      this.resetDimensions();
    }
  }

  /**
   * Handle the focus on a field
   */
  handleFocus() {
    this.setState({hasFocus: true})
  }

  /**
   * Get the default width for images who don't have a valid one yet.
   * @returns {number}
   */
  defaultWidth()
  {
    const {imageSizePresets, data: {originalWidth}} = this.props;

    // Default to the default image size preset first. Then to the original width of the image.
    // If all else fail, default to 600
    const defaultPreset = imageSizePresets && imageSizePresets.find(preset => preset.default);
    const defaultWidth = (defaultPreset && defaultPreset.width) || originalWidth || 600;

    // Make sure our default width isn't wider than the natural width of the image
    return originalWidth && originalWidth < defaultWidth ? originalWidth : defaultWidth;
  }

  /**
   * Make sure we have a sensible width entered
   */
  forceValidWidth(width) {
    const newValue = parseInt(width);
    if (!newValue || newValue <= 0) {
      this.resetDimensions();
    }
  }

  /**
   * Reset the dimensions to a sensible dimensions.
   */
  resetDimensions() {
    const defaultValue = this.defaultWidth();
    this.syncFields(0, defaultValue);
  }

  render() {
    const { FieldGroup, data: {originalWidth}, current: {width: currentWidth}, imageSizePresets } = this.props;

    return (
      <Fragment>
        <FieldGroup smallholder={false} {...this.props}>
          {this.props.children.map((child, key) => (
            cloneElement(child, {
              // overload the children change handler
              onChange: (e, newValue) => this.handleChange(key, newValue),
              onBlur: (e) => this.handleBlur(key, e),
              onFocus: (e) => this.handleFocus(),
              key,
            }, child.props.children)
          ))}
        </FieldGroup>

        {<ImageSizePresetList
          originalWidth={parseInt(originalWidth)}
          currentWidth={currentWidth}
          imageSizePresets={imageSizePresets}
          onSelect={ this.handlePresetSelect } />
        }
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
  current: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  FieldGroup: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  imageSizePresets: PropTypes.arrayOf(PropTypes.shape({
    width: PropTypes.number,
    text: PropTypes.string,
    default: PropTypes.bool,
  }))
};

ProportionConstraintField.defaultProps = {
  active: true,
};

function mapStateToProps(state, { formid }) {
  const selector = formValueSelector(formid, getFormState);

  const currentWidth = selector(state, 'Width');
  const currentHeight = selector(state, 'Height');

  return {
    current: {
      width: currentWidth ? parseInt(currentWidth) : undefined,
      heigth: currentHeight ? parseInt(currentHeight) : undefined
    },
    imageSizePresets: state.assetAdmin.modal.imageSizePresets
  };
}

export { ProportionConstraintField as Component };

export default compose(
  connect(mapStateToProps),
  inject(['FieldGroup'])
)(ProportionConstraintField);

import React, { Children, cloneElement, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import { formValueSelector } from 'redux-form';
import getFormState from 'lib/getFormState';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ImageSizePresetList from './ImageSizePresetList';

/**
 * Component that displays a width and height field, syncing them up so that the ratio between
 * them remain unchanged.
 */
const ProportionConstraintField = (_props) => {
  const defaultProps = {
    active: true,
  };
  const props = {
    ...defaultProps,
    ..._props,
  };
  const childrenArray = Children.toArray(props.children);

  if (childrenArray.length !== 2) {
    throw new Error('ProportionConstraintField must be passed two children -- one field for each value');
  }

  const [hasFocus, setHasFocus] = useState(false);

  // Holds the props of the previous render, because componentDidUpdate received the previous props
  const prevPropsRef = useRef(props);

  useEffect(() => {
    // Let invalid values stand if the user is currently editing the fields
    if (!hasFocus) {
      // Make sure our initial dimensions are initialised to something sensible
      const { current: { width } } = prevPropsRef.current;
      const value = parseInt(width, 10);
      if (!value || value <= 0) {
        // eslint-disable-next-line no-use-before-define
        resetDimensions();
      }
    }
    prevPropsRef.current = props;
  });

  /**
   * Handle change events for the fields
   * @param {Number} childIndex Index of the field that has been changed
   * @param {String} newValue
   */
  const handleChange = (childIndex, e, newValue) => {
    // If the new value can be converted to something sensible
    const value = parseInt((newValue || (e.target && e.target.value)), 10);
    if (value && value > 0) {
      // eslint-disable-next-line no-use-before-define
      syncFields(childIndex, value);
    }
  };

  /**
   * Sync up the two fields
   * @param {Number} childIndex Index of the field that has been changed
   * @param {Number} newValue
   */
  const syncFields = (childIndex, newValue) => {
    const { children, active, onAutofill, data: { ratio } } = props;

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
  };

  /**
   * Handle selection of a preset image
   * @param {Number} newWidth
   */
  const handlePresetSelect = (newWidth) => {
    syncFields(0, newWidth);

    // Reset the focus on the Width field
    const { key } = props.children[0];
    const fieldEl = document.getElementById(key);
    if (fieldEl) {
      fieldEl.focus();
    }
  };

  /**
   * Handle the user moving to another field
   * @param {Number} key Index of the field being blured
   * @param {Event} e
   */
  const handleBlur = (key, e) => {
    setHasFocus(false);

    const newValue = parseInt(e && e.target && e.target.value, 10);
    if (!newValue || newValue <= 0) {
      // If the user leave the field in an invalid state, reset dimensions to their default
      e.preventDefault();
      // eslint-disable-next-line no-use-before-define
      resetDimensions();
    }
  };

  /**
   * Handle the focus on a field
   */
  const handleFocus = () => {
    setHasFocus(true);
  };

  /**
   * Get the default width for images who don't have a valid one yet.
   * @returns {number}
   */
  const defaultWidth = () => {
    const { imageSizePresets, data: { originalWidth } } = props;

    // Default to the default image size preset first. Then to the original width of the image.
    // If all else fail, default to 600
    const defaultPreset = imageSizePresets && imageSizePresets.find(preset => preset.default);
    const defaultWidthValue = (defaultPreset && defaultPreset.width) || originalWidth || 600;

    // Make sure our default width isn't wider than the natural width of the image
    return originalWidth && originalWidth < defaultWidthValue ? originalWidth : defaultWidthValue;
  };

  /**
   * Reset the dimensions to a sensible dimensions.
   */
  const resetDimensions = () => {
    const defaultValue = defaultWidth();
    syncFields(0, defaultValue);
  };

  const {
    FieldGroup,
    data: { originalWidth, isRemoteFile },
    current: { width: currentWidth },
    imageSizePresets } = props;

  return (
    <FieldGroup smallholder={false} {...props}>
      {props.children.map((child, key) => (
        cloneElement(child, {
          // overload the children change handler
          onChange: (e, newValue) => handleChange(key, e, newValue),
          onBlur: (e) => handleBlur(key, e),
          onFocus: () => handleFocus(),
          // eslint-disable-next-line react/no-array-index-key
          key,
        }, child.props.children)
      ))}
      {!isRemoteFile && <ImageSizePresetList
        originalWidth={parseInt(originalWidth, 10)}
        currentWidth={currentWidth}
        imageSizePresets={imageSizePresets}
        onSelect={handlePresetSelect}
      />
        }
    </FieldGroup>
  );
};

ProportionConstraintField.propTypes = {
  children: PropTypes.array,
  onAutofill: PropTypes.func,
  active: PropTypes.bool,
  data: PropTypes.shape({
    ratio: PropTypes.number.isRequired,
    isRemoteFile: PropTypes.bool,
    originalWidth: PropTypes.number,
    originalHeight: PropTypes.number,
  }),
  current: PropTypes.shape({
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  FieldGroup: PropTypes.elementType.isRequired,
  imageSizePresets: PropTypes.arrayOf(PropTypes.shape({
    width: PropTypes.number,
    text: PropTypes.string,
    default: PropTypes.bool,
  }))
};

function mapStateToProps(state, { formid }) {
  const selector = formValueSelector(formid, getFormState);

  const currentWidth = selector(state, 'Width');
  const currentHeight = selector(state, 'Height');

  return {
    current: {
      width: currentWidth ? parseInt(currentWidth, 10) : undefined,
      heigth: currentHeight ? parseInt(currentHeight, 10) : undefined
    },
    imageSizePresets: state.assetAdmin.modal.imageSizePresets
  };
}

export { ProportionConstraintField as Component };

export default compose(
  connect(mapStateToProps),
  inject(['FieldGroup'])
)(ProportionConstraintField);

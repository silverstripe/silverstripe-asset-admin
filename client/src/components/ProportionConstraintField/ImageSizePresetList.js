import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { formValueSelector } from 'redux-form';
import getFormState from 'lib/getFormState';
import { connect } from 'react-redux';
import { compose } from 'redux';

/**
 *
 * @param {{text: String, width: Number}[]} imageSizePresets
 */
const ImageSizePresetList = ({ imageSizePresets, onSelect, currentWidth, originalWidth }) => (imageSizePresets ? (
  <ul className="image-size-preset-list">
    {imageSizePresets.map(
    ({ width, text }) => (
      <li key={text} className="image-size-preset-list__list-item">
        <Button
          color="link" size="sm"
          onClick={() => onSelect(width || originalWidth)}
          disabled={(originalWidth < width) || currentWidth === (width || originalWidth)}
        >
          {text}
        </Button>
      </li>)
  )}
  </ul>
) : null);

ImageSizePresetList.propTypes = {
  onSelect: PropTypes.func,
  imageSizePresets: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    width: PropTypes.number
  })),
  currentWidth: PropTypes.number,
  originalWidth: PropTypes.number,
};


function mapStateToProps(state, { formid }) {
  const selector = formValueSelector(formid, getFormState);

  const currentWidth = selector(state, 'Width');

  return {
    currentWidth: currentWidth ? parseInt(currentWidth) : undefined,
    imageSizePresets: state.assetAdmin.modal.imageSizePresets
  };
}

export default compose(connect(mapStateToProps))(ImageSizePresetList);

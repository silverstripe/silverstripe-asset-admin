import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

/**
 * Display a list of possible image size presets that the user can click to quicky set the width and height of the image in the placement form.
 * @param {{text: String, width: Number}[]} imageSizePresets
 */
const ImageSizePresetList =
  ({ imageSizePresets, onSelect, currentWidth, originalWidth }) => (imageSizePresets ? (
    <ul className="image-size-preset-list">
      {imageSizePresets.map(
    ({ width, text }) => (
      <li key={text} className="image-size-preset-list__list-item">
        <Button
          color="link"
          size="sm"
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

export default ImageSizePresetList;

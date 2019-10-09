import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

/**
 *
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

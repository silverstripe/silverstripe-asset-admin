import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import i18n from 'i18n';

/**
 * Generate an explicit message for screen readers only.
 * @param {string} text
 * @returns {string}
 */
const srText = (text) => (
  i18n.inject(
    i18n._t(
      'AssetAdmin.SET_IMAGE_SIZE_TO',
      'Set image size to "{preset}"'
    ),
    { preset: text }
  )
);

/**
 * Display a link-button that will allow user to select an image size preset.
 */
const PresetButton = ({ onSelect, currentWidth, originalWidth, width, text }) => (
  <Button
    color="link"
    size="sm"
    onClick={() => onSelect(width || originalWidth)}
    disabled={(originalWidth < width) || currentWidth === (width || originalWidth)}
  >
    <span className="sr-only">{srText(text)}</span>
    <span aria-hidden="true">{text}</span>
  </Button>
);

/**
 * Display a list of possible image size presets that the user can click to quicky set the width
 * and height of the image in the placement form.
 * @param {{text: String, width: Number}[]} imageSizePresets
 */
const ImageSizePresetList = ({ imageSizePresets, ...btnProps }) => (
  imageSizePresets ? (
    <ul className="image-size-preset-list">
      { imageSizePresets.map(
        (presetProps) => (
          <li key={presetProps.text} className="image-size-preset-list__list-item">
            <PresetButton {...presetProps} {...btnProps} />
          </li>
        )
      ) }
    </ul>
  ) : null
);

ImageSizePresetList.propTypes = {
  onSelect: PropTypes.func,
  imageSizePresets: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    width: PropTypes.number
  })),
  currentWidth: PropTypes.number,
  originalWidth: PropTypes.number.isRequired,
};

export default ImageSizePresetList;

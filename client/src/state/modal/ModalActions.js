import ACTION_TYPES from './ModalActionTypes';

/**
 * Define the image size presets for the modal
 *
 * @param {Object[]} List of image size presets
 */
export function defineImageSizePresets(imageSizePresets) {
  return {
    type: ACTION_TYPES.DEFINE_IMAGE_SIZE_PRESETS,
    payload: { imageSizePresets },
  };
}


import ACTION_TYPES from './ModalActionTypes';

/**
 * Initial base state
 * @type { Object }
 */
export const initialState = {
  imageSizePresets: []
};

function modalReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ACTION_TYPES.DEFINE_IMAGE_SIZE_PRESETS:
      return { ...state, imageSizePresets: payload.imageSizePresets };
    default:
      return state;
  }
}

export default modalReducer;

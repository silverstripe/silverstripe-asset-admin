import IMAGE_LOAD from './ImageLoadActionTypes';

const initialState = {
  files: [], // each file is an object with url, status, and retryAfter
};

/**
 * Reducer for the `assetAdmin.gallery` state key.
 *
 * @param {object} state
 * @param {string} type - Name of the dispatched action.
 * @param {object} payload - Optional data passed with the action.
 */
export default function imageLoadReducer(state = initialState, { type, payload } = {}) {
  switch (type) {
    case IMAGE_LOAD.SET_STATUS: {
      return {
        ...state,
        files: [
          ...state.files.filter((file) => file.url !== payload.url),
          payload,
        ],
      };
    }

    case IMAGE_LOAD.RESET: {
      return {
        ...state,
        files: [
          ...state.files.filter((file) => file.url !== payload.url),
        ],
      };
    }

    default:
      return state;
  }
}

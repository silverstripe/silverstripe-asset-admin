import IMAGE_LOAD from './ImageLoadActionTypes';
import ImageLoadActionHandler from './ImageLoadActionHandler';

/**
 * Called whenever a URL is wanted
 *
 * @param {String} url - URL to load
 * @param {Object} options - see configShape.imageRetry for shape
 * @param {Function} factory - Factory for performing the image load
 */
export function loadImage(url, options, factory = null) {
  return (dispatch, getState) => {
    // Ensure url is loadable
    if (!url) {
      return null;
    }

    // Only process new urls, or urls that have been reset
    const state = getState();
    const currentFile = state.assetAdmin.imageLoad.files.find((file) => file.url === url);
    if (currentFile) {
      return null;
    }

    const loadOptions = {
      ...options,
      onStatusChange: (statusURL, status) => (
        dispatch({
          type: IMAGE_LOAD.SET_STATUS,
          payload: { status, url: statusURL },
        })
      ),
      onReset: (statusURL) => (
        dispatch({
          type: IMAGE_LOAD.RESET,
          payload: { url: statusURL },
        })
      ),
    };

    // Pass to handler
    const handler = new ImageLoadActionHandler(loadOptions, factory);
    return handler.loadImage(url);
  };
}

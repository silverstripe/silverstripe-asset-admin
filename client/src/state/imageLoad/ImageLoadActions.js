import IMAGE_LOAD from './ImageLoadActionTypes';
import ImageLoadActionHandler from './ImageLoadActionHandler';

/**
 * Default factory to test for image
 *
 * @param {String} url
 * @param {function} resolve
 * @param {function} reject
 */
const defaultImageFactory = (url, resolve, reject) => {
  const img = new Image();
  img.onload = resolve;
  img.onerror = reject;
  img.src = url;
};

/**
 * Called whenever a URL is wanted
 *
 * @param {String} url - URL to load
 * @param {Object} options - see configShape.imageRetry for shape
 */
export function loadImage(url, options) {
  return (dispatch, getState) => {
    // Ensure url is loadable
    if (!url || !url.match(/https?:\/\//)) {
      return null;
    }

    // Only process new urls, or urls that have been reset
    const state = getState();
    const currentFile = state
      && state.assetAdmin
      && state.assetAdmin.imageLoad
      && state.assetAdmin.imageLoad.files
      && state.assetAdmin.imageLoad.files.find((file) => file.url === url);
    if (currentFile) {
      return null;
    }

    // Pass to handler
    const handler = new ImageLoadActionHandler(options, defaultImageFactory);
    handler.setOnStatusChange((statusURL, status) => (
      dispatch({
        type: IMAGE_LOAD.SET_STATUS,
        payload: { status, url: statusURL },
      })
    ));
    handler.setOnReset((statusURL) => (
      dispatch({
        type: IMAGE_LOAD.RESET,
        payload: { url: statusURL },
      })
    ));
    return handler.loadImage(url);
  };
}

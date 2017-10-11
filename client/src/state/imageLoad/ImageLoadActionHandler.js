/* global Image */
import IMAGE_STATUS from './ImageLoadStatus';
import ImageLoadLocker from './ImageLoadLocker';

const defaultOptions = {
  minRetry: 0,
  maxRetry: 0,
  expiry: 0,
  // set noops as default for events
  onStatusChange: () => null,
  onRetry: () => null,
  onReset: () => null,
  onTimeout: () => null,
};

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

class ImageLoadActionHandler {
  constructor(options, factory = defaultImageFactory) {
    this.options = { ...defaultOptions, ...options };
    this.factory = factory;
  }

  /**
   * Entry point to the main loop
   *
   * @param {String} url - URL to load
   * @return {Promise}|{null} - Promise, or null if not able to attempt
   */
  loadImage(url) {
    // If retry is disabled
    if (!this.options.minRetry) {
      return null;
    }

    // Attempt to lock this url, but return if already locked by another process
    if (!ImageLoadLocker.lock(url)) {
      return null;
    }

    return this.loadImageLoop(url, this.options.minRetry);
  }

  /**
   * Attempt request to asset
   *
   * @param {String} url - URL to load
   * @param {Number} retryAfter - Delay after which we should retry, if this fails
   * @return {Promise}
   */
  loadImageLoop(url, retryAfter) {
    // Set status to loading
    this.options.onStatusChange(url, IMAGE_STATUS.LOADING);

    // Begin loading image
    return new Promise((resolve, reject) => this.factory(url, resolve, reject))
      .then(() => this.handleSuccess(url))
      .catch(() => this.handleError(url, retryAfter));
  }

  /**
   * Mark a file as reset (default status)
   *
   * @param {String} url
   * @param {Function} resolve - Resolution handler for promise
   */
  handleReset(url, resolve) {
    this.options.onReset(url);
    resolve();
  }

  /**
   * Setup a timeout delay and trigger an event
   *
   * @param {Function} callback
   * @param {Number} delay
   * @return {Number} id
   */
  handleTimeout(callback, delay) {
    const id = setTimeout(callback, delay);
    this.options.onTimeout(id, delay);
    return id;
  }

  /**
   * When we have finally loaded an image
   *
   * @param {String} url
   */
  handleSuccess(url) {
    // Unlock after success
    ImageLoadLocker.unlock(url);
    this.options.onStatusChange(url, IMAGE_STATUS.SUCCESS);
  }

  /**
   * When we have exhausted all possible attempts mark as failed
   *
   * @param {String} url
   * @return {Promise|null}
   */
  handleFailure(url) {
    // Unlock after final failure
    ImageLoadLocker.unlock(url);
    this.options.onStatusChange(url, IMAGE_STATUS.FAILED);

    // Allow failure to expire if configured
    if (this.options.expiry) {
      return new Promise((resolve) => {
        this.handleTimeout(
          () => this.handleReset(url, resolve),
          this.options.expiry * 1000
        );
      });
    }

    // Otherwise, stop further attempts
    return null;
  }

  /**
   * On failure we want to temporarily mark as failed, and retry later
   *
   * @param {String} url
   * @param {Number} retryAfter
   * @return {Promise}|{null}
   */
  handleError(url, retryAfter) {
    // Check if we should expire
    if (retryAfter > this.options.maxRetry) {
      return this.handleFailure(url);
    }

    // Set waiting status during timeout
    this.options.onStatusChange(url, IMAGE_STATUS.WAITING);

    // Wait for the specified retryAfter seconds, then repeat the loop
    // with a new retryAfter
    return this.handleRetry(url, retryAfter);
  }

  /**
   * Begin a retry
   *
   * @param {String} url - URL to load
   * @param {Number} retryAfter - Number of seconds to retry after
   * @return {Promise}
   */
  handleRetry(url, retryAfter) {
    const promise = new Promise((resolve) => {
      this.handleTimeout(
        () => resolve(this.loadImageLoop(url, retryAfter * 2)),
        retryAfter * 1000
      );
    });
    this.options.onRetry(url, retryAfter, promise);
    return promise;
  }

  /**
   * Register event for a retry being started
   *
   * @param {Function} callback
   */
  setOnRetry(callback) {
    this.options.onRetry = callback;
  }

  /**
   * Register event for a file being reset
   *
   * @param {Function} callback
   */
  setOnReset(callback) {
    this.options.onReset = callback;
  }

  /**
   * Register event for a status change
   *
   * @param {Function} callback
   */
  setOnStatusChange(callback) {
    this.options.onStatusChange = callback;
  }

  /**
   * Register event for a tick action
   *
   * @param {Function} callback
   */
  setOnTimeout(callback) {
    this.options.onTimeout = callback;
  }
}

export { defaultImageFactory };

export default ImageLoadActionHandler;

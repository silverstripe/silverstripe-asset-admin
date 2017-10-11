/* global window */
class ImageLoadLocker {
  constructor() {
    this.urls = [];
  }

  /**
   * Attempt to lock a url, and return true if successful
   *
   * @param {String} url
   * @return {Boolean} True if successful
   */
  lock(url) {
    // Add url, and return true if successfully locked (semi-atomically)
    const index = this.urls.indexOf(url);
    if (index >= 0) {
      return false;
    }
    this.urls = [...this.urls, url];
    return true;
  }

  /**
   * Unlock a url
   *
   * @param {String} url
   */
  unlock(url) {
    this.urls = this.urls.filter((next) => next !== url);
  }
}

window.ss = window.ss || {};
window.ss.imagelocker = window.ss.imagelocker || new ImageLoadLocker();

export { ImageLoadLocker as Component };

export default window.ss.imagelocker;

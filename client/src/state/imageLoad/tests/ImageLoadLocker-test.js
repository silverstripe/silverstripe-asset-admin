/* global jest, describe, it, expect, beforeEach, jasmine */

jest.unmock('../ImageLoadLocker');

import { ImageLoadLocker } from '../ImageLoadLocker';

describe('ImageLoadLocker', () => {
  it('locked images can not be re-locked', () => {
    const locker = new ImageLoadLocker();
    // Initial lock is successful
    let result = locker.lock('http://www.google.com/url.jpg');
    expect(result).toBe(true);

    // Re-lock fails
    result = locker.lock('http://www.google.com/url.jpg');
    expect(result).toBe(false);

    // Another file is successful
    result = locker.lock('http://www.google.com/url2.jpg');
    expect(result).toBe(true);

    // Unlock frees the file
    locker.unlock('http://www.google.com/url.jpg');
    result = locker.lock('http://www.google.com/url.jpg');
    expect(result).toBe(true);
  });
});

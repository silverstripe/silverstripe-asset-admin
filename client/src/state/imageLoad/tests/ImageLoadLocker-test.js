/* global jest, describe, it, expect, beforeEach, jasmine */

jest.unmock('../ImageLoadLocker');

import { Component as ImageLoadLocker } from '../ImageLoadLocker';

describe('ImageLoadLocker', () => {
  let locker = null;

  beforeEach(() => {
    locker = new ImageLoadLocker();
  });

  it('should not let locked images can not be re-locked without unlocking', () => {
    // Initial lock is successful
    let result = locker.lock('http://www.google.com/url.jpg');
    expect(result).toBe(true);

    // Re-lock fails
    result = locker.lock('http://www.google.com/url.jpg');
    expect(result).toBe(false);

    // Unlock frees the file
    locker.unlock('http://www.google.com/url.jpg');
    result = locker.lock('http://www.google.com/url.jpg');
    expect(result).toBe(true);
  });

  it('should allow locking different files without unlocking', () => {
    // Initial lock is successful
    let result = locker.lock('http://www.google.com/url.jpg');
    expect(result).toBe(true);

    // Another file is successful
    result = locker.lock('http://www.google.com/url2.jpg');
    expect(result).toBe(true);
  });
});

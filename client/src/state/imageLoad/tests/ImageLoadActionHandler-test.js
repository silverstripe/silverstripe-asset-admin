/* global jest, describe, it, expect, beforeEach, jasmine */

import ImageLoadActionHandler from '../ImageLoadActionHandler';
import IMAGE_STATUS from '../ImageLoadStatus';

describe('ImageLoadActionHandler', () => {
  it('immediately successful images should report success', () => {
    const options = {
      minRetry: 4,
      maxRetry: 8,
      onStatusChange: jest.fn(),
    };
    // Create handler which immediately succeeds
    const loadImageHandler = new ImageLoadActionHandler(
      options,
      (url, resolve) => { resolve(); }
    );


    // Test image loading succeeds
    return loadImageHandler
      .loadImage('http://www.example.com/file.jpg')
      .then(() => {
        // First state is set to loading
        expect(options.onStatusChange.mock.calls.length).toBe(2);
        expect(options.onStatusChange.mock.calls[0]).toEqual([
          'http://www.example.com/file.jpg',
          IMAGE_STATUS.LOADING,
        ]);
        // Second state is set to success
        expect(options.onStatusChange.mock.calls[1]).toEqual([
          'http://www.example.com/file.jpg',
          IMAGE_STATUS.SUCCESS,
        ]);
      });
  });

  it('eternally failing images end up failed', () => {
    jest.useFakeTimers();

    const options = {
      minRetry: 4,
      maxRetry: 8,
      onStatusChange: jest.fn(),
      // ensure all future timers advance automatically
      onTimeout: () => jest.runAllTimers(),
    };

    // Create handler which always fails
    const loadImageHandler = new ImageLoadActionHandler(
      options,
      (url, resolve, reject) => { reject(); }
    );

    // Attempts three times, after a 4 second then 8 second retry delay
    return loadImageHandler
      .loadImage('http://www.example.com/file2.jpg')
      .then(() => {
        // Check the following waits were called
        expect(setTimeout.mock.calls.length).toBe(2);
        expect(setTimeout.mock.calls[0][1]).toBe(4000);
        expect(setTimeout.mock.calls[1][1]).toBe(8000);

        // Order is load, wait, load, wait, load, fail
        expect(options.onStatusChange.mock.calls.length).toBe(6);
        expect(options.onStatusChange.mock.calls[0][0]).toBe('http://www.example.com/file2.jpg');
        expect(options.onStatusChange.mock.calls[0][1]).toBe(IMAGE_STATUS.LOADING);
        expect(options.onStatusChange.mock.calls[1][1]).toBe(IMAGE_STATUS.WAITING);
        expect(options.onStatusChange.mock.calls[4][1]).toBe(IMAGE_STATUS.LOADING);
        expect(options.onStatusChange.mock.calls[5][0]).toBe('http://www.example.com/file2.jpg');
        expect(options.onStatusChange.mock.calls[5][1]).toBe(IMAGE_STATUS.FAILED);
      });
  });

  it('initially failing download can eventually succeed', () => {
    jest.useFakeTimers();

    const options = {
      minRetry: 4,
      maxRetry: 8,
      onStatusChange: jest.fn(),
      // ensure all future timers advance automatically
      onTimeout: () => jest.runAllTimers(),
    };
    let attempts = 0;
    const handler = (url, resolve, reject) => {
      attempts += 1;
      if (attempts > 2) {
        resolve();
      } else {
        reject();
      }
    };

    // Dowload fails twice, but then succeeds on the final retry (12 seconds total)
    const loadImageHandler = new ImageLoadActionHandler(options, handler);

    // Attempts three times, after a 4 second then 8 second retry delay
    return loadImageHandler
      .loadImage('http://www.example.com/file3.jpg')
      .then(() => {
        // Order is load, wait, load, wait, load, success
        expect(options.onStatusChange.mock.calls.length).toBe(6);
        expect(options.onStatusChange.mock.calls[0][0]).toBe('http://www.example.com/file3.jpg');
        expect(options.onStatusChange.mock.calls[2][1]).toBe(IMAGE_STATUS.LOADING);
        expect(options.onStatusChange.mock.calls[3][1]).toBe(IMAGE_STATUS.WAITING);
        expect(options.onStatusChange.mock.calls[5][0]).toBe('http://www.example.com/file3.jpg');
        expect(options.onStatusChange.mock.calls[5][1]).toBe(IMAGE_STATUS.SUCCESS);
      });
  });

  it('failed download with expiry will eventually expire', () => {
    jest.useFakeTimers();

    const options = {
      minRetry: 4,
      maxRetry: 8,
      expiry: 40,
      onStatusChange: jest.fn(),
      onReset: jest.fn(),
      // ensure all future timers advance automatically
      onTimeout: () => jest.runAllTimers(),
    };
    const handler = (url, resolve, reject) => { reject(); };
    // Create handler which always fails
    const loadImageHandler = new ImageLoadActionHandler(
      options,
      handler
    );

    // Attempts three times, after a 4 second then 8 second retry delay
    return loadImageHandler
      .loadImage('http://www.example.com/file4.jpg')
      .then(() => {
        // Check the following waits were called
        expect(setTimeout.mock.calls.length).toBe(3);
        expect(setTimeout.mock.calls[0][1]).toBe(4000);
        expect(setTimeout.mock.calls[1][1]).toBe(8000);
        // Expiry after all retries have been exhausted
        expect(setTimeout.mock.calls[2][1]).toBe(40000);

        // Order is load, wait, load, wait, load, fail
        expect(options.onStatusChange.mock.calls.length).toBe(6);
        expect(options.onStatusChange.mock.calls[0][0]).toBe('http://www.example.com/file4.jpg');
        expect(options.onStatusChange.mock.calls[1][1]).toBe(IMAGE_STATUS.WAITING);
        expect(options.onStatusChange.mock.calls[5][0]).toBe('http://www.example.com/file4.jpg');
        expect(options.onStatusChange.mock.calls[5][1]).toBe(IMAGE_STATUS.FAILED);

        // Ensure reset invokes
        expect(options.onReset).toBeCalledWith('http://www.example.com/file4.jpg');
      });
  });
});

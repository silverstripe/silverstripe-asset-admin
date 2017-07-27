/* global jest, describe, it, expect, beforeEach, jasmine */

jest.unmock('react');
jest.unmock('deep-freeze-strict');
jest.unmock('../ImageLoadActionHandler');
jest.unmock('../ImageLoadActionTypes');

import ImageLoadActionHandler from '../ImageLoadActionHandler';
import IMAGE_STATUS from '../ImageLoadStatus';

describe('imageLoadActions', () => {
  describe('loadImage', () => {
    it('immediately successful images should report success', () => {
      // Create handler which immediately succeeds
      const loadImageHandler = new ImageLoadActionHandler(
        { minRetry: 4, maxRetry: 8 },
        (url, resolve) => { resolve(); }
      );

      // Follow status changes
      const statusListener = jest.fn();
      loadImageHandler.setOnStatusChange(statusListener);

      // Test image loading succeeds
      return loadImageHandler
        .loadImage('http://www.example.com/file.jpg')
        .then(() => {
          // First state is set to loading
          expect(statusListener.mock.calls.length).toBeGreaterThan(0);
          expect(statusListener.mock.calls[0]).toEqual([
            'http://www.example.com/file.jpg',
            IMAGE_STATUS.LOADING,
          ]);
          // Second state is set to success
          expect(statusListener.mock.calls.length).toBeGreaterThan(1);
          expect(statusListener.mock.calls[1]).toEqual([
            'http://www.example.com/file.jpg',
            IMAGE_STATUS.SUCCESS,
          ]);
          expect(statusListener.mock.calls.length).toBe(2);
        });
    });

    it('eternally failing images end up failed', () => {
      jest.useFakeTimers();

      // Create handler which always fails
      const loadImageHandler = new ImageLoadActionHandler(
        { minRetry: 4, maxRetry: 8 },
        (url, resolve, reject) => { reject(); }
      );

      // Follow status changes, and ensure all future timers advance automatically
      const statusListener = jest.fn();
      loadImageHandler.setOnStatusChange(statusListener);
      loadImageHandler.setOnTimeout(() => (jest.runAllTimers()));

      // Attempts three times, after a 4 second then 8 second retry delay
      return loadImageHandler
        .loadImage('http://www.example.com/file2.jpg')
        .then(() => {
          // Check the following waits were called
          const waits = [
            4000,
            8000,
          ];
          expect(setTimeout.mock.calls.length).toBe(waits.length);
          for (let i = 0; i < waits.length; i++) {
            expect(setTimeout.mock.calls[i][1]).toEqual(waits[i]);
          }

          // Order is load, wait, load, wait, load, fail
          const states = [
            IMAGE_STATUS.LOADING,
            IMAGE_STATUS.WAITING,
            IMAGE_STATUS.LOADING,
            IMAGE_STATUS.WAITING,
            IMAGE_STATUS.LOADING,
            IMAGE_STATUS.FAILED,
          ];
          expect(statusListener.mock.calls.length).toBe(states.length);
          for (let i = 0; i < states.length; i++) {
            expect(statusListener.mock.calls[i]).toEqual([
              'http://www.example.com/file2.jpg',
              states[i],
            ]);
          }
        });
    });

    it('initially failing download can eventually succeed', () => {
      jest.useFakeTimers();

      // Dowload fails twice, but then succeeds on the final retry (12 seconds total)
      let attempts = 0;
      const loadImageHandler = new ImageLoadActionHandler(
        { minRetry: 4, maxRetry: 8 },
        (url, resolve, reject) => {
          if (++attempts > 2) {
            resolve();
          } else {
            reject();
          }
        }
      );

      // Follow status changes, and ensure all future timers advance automatically
      const statusListener = jest.fn();
      loadImageHandler.setOnStatusChange(statusListener);
      loadImageHandler.setOnTimeout(() => (jest.runAllTimers()));

      // Attempts three times, after a 4 second then 8 second retry delay
      return loadImageHandler
        .loadImage('http://www.example.com/file3.jpg')
        .then(() => {
          // Check the following waits were called
          const waits = [
            4000,
            8000,
          ];
          expect(setTimeout.mock.calls.length).toBe(waits.length);
          for (let i = 0; i < waits.length; i++) {
            expect(setTimeout.mock.calls[i][1]).toEqual(waits[i]);
          }

          // Order is load, wait, load, wait, load, success
          const states = [
            IMAGE_STATUS.LOADING,
            IMAGE_STATUS.WAITING,
            IMAGE_STATUS.LOADING,
            IMAGE_STATUS.WAITING,
            IMAGE_STATUS.LOADING,
            IMAGE_STATUS.SUCCESS,
          ];
          expect(statusListener.mock.calls.length).toBe(states.length);
          for (let i = 0; i < states.length; i++) {
            expect(statusListener.mock.calls[i]).toEqual([
              'http://www.example.com/file3.jpg',
              states[i],
            ]);
          }
        });
    });

    it('failed download with expiry will eventually expire', () => {
      jest.useFakeTimers();

      // Create handler which always fails
      const loadImageHandler = new ImageLoadActionHandler(
        { minRetry: 4, maxRetry: 8, expiry: 40 },
        (url, resolve, reject) => { reject(); }
      );

      // Follow status changes, and ensure all future timers advance automatically
      const statusListener = jest.fn();
      loadImageHandler.setOnStatusChange(statusListener);
      const expireListener = jest.fn();
      loadImageHandler.setOnReset(expireListener);
      loadImageHandler.setOnTimeout(() => (jest.runAllTimers()));

      // Attempts three times, after a 4 second then 8 second retry delay
      return loadImageHandler
        .loadImage('http://www.example.com/file4.jpg')
        .then(() => {
          // Check the following waits were called
          const waits = [
            4000,
            8000,
            40000,
          ];
          expect(setTimeout.mock.calls.length).toBe(waits.length);
          for (let i = 0; i < waits.length; i++) {
            expect(setTimeout.mock.calls[i][1]).toEqual(waits[i]);
          }

          // Order is load, wait, load, wait, load, fail
          const states = [
            IMAGE_STATUS.LOADING,
            IMAGE_STATUS.WAITING,
            IMAGE_STATUS.LOADING,
            IMAGE_STATUS.WAITING,
            IMAGE_STATUS.LOADING,
            IMAGE_STATUS.FAILED,
          ];
          expect(statusListener.mock.calls.length).toBe(states.length);
          for (let i = 0; i < states.length; i++) {
            expect(statusListener.mock.calls[i]).toEqual([
              'http://www.example.com/file4.jpg',
              states[i],
            ]);
          }

          // Ensure reset invokes
          expect(expireListener.mock.calls.length).toBe(1);
          expect(expireListener.mock.calls[0]).toEqual([
            'http://www.example.com/file4.jpg',
          ]);
        });
    });
  });
});

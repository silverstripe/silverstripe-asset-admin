/* global jest, describe, it, expect, beforeEach, jasmine */

jest.mock('../ImageLoadActionHandler', () => jest.fn());

import ImageLoadActionHandler from '../ImageLoadActionHandler';
import IMAGE_STATUS from '../ImageLoadStatus';
import IMAGE_LOAD from '../ImageLoadActionTypes';
import { loadImage } from '../ImageLoadActions';

describe('loadImage', () => {
  let dispatch = null;
  let getState = null;
  const options = { minRetry: 2, maxRetry: 4 };

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      assetAdmin: {
        imageLoad: {
          files: [{
            url: 'http://www.mysite.com/file.jpg',
            state: IMAGE_STATUS.FAILED,
          }],
        },
      },
    }));
  });

  it('should skip missing images', () => {
    const result = loadImage('', {})(dispatch, getState);
    expect(result).toBe(null);
    expect(dispatch).not.toBeCalled();
    expect(getState).toHaveBeenCalledTimes(0);
  });

  it('should skip processed files', () => {
    const result = loadImage('http://www.mysite.com/file.jpg', options)(dispatch, getState);
    expect(result).toBe(null);
    expect(dispatch).not.toBeCalled();
    expect(getState).toHaveBeenCalledTimes(1);
  });

  it('should process new files', () => {
    class MockHandler {
      constructor(opts) {
        expect(opts.minRetry).toBe(2);
        expect(opts.maxRetry).toBe(4);
        this.opts = opts;
      }
      loadImage(url) {
        expect(url).toBe('http://www.mysite.com/another.jpg');
        return Promise.resolve(this.opts);
      }
    }

    ImageLoadActionHandler.mockImplementation((opts) => new MockHandler(opts));

    const url = 'http://www.mysite.com/another.jpg';
    const result = loadImage(url, options)(dispatch, getState);
    expect(result).toBeInstanceOf(Promise);

    // Assert result of calls after promise is resolved
    return result.then((opts) => {
      expect(dispatch).not.toBeCalled();

      opts.onReset(url);
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: IMAGE_LOAD.RESET,
        payload: { url },
      });


      const status = 'MY_MOCK_STATUS';
      opts.onStatusChange(url, status);
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: IMAGE_LOAD.SET_STATUS,
        payload: { status, url },
      });

      expect(getState).toHaveBeenCalledTimes(1);
    });
  });
});

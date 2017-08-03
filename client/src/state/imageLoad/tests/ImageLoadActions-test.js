/* global jest, describe, it, expect, beforeEach, jasmine */

jest.unmock('../ImageLoadActions');
jest.unmock('../ImageLoadActionHandler');

import IMAGE_STATUS from '../ImageLoadStatus';
import { loadImage } from '../ImageLoadActions';

describe('loadImage', () => {
  let dispatch = null;
  let getState = null;
  const options = { minRetry: 2, maxRetry: 4 };

  beforeEach(() => {
    dispatch = jest
      .genMockFn();
    getState = jest
      .genMockFn()
      .mockReturnValue({
        assetAdmin: {
          imageLoad: {
            files: [{
              url: 'http://www.mysite.com/file.jpg',
              state: IMAGE_STATUS.FAILED,
            }],
          },
        },
      });
  });

  it('should skip missing images', () => {
    const result = loadImage('', {})(dispatch, getState);
    expect(result).toBe(null);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(0);
  });

  it('should skip processed files', () => {
    const result = loadImage('http://www.mysite.com/file.jpg', options)(dispatch, getState);
    expect(result).toBe(null);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(1);
  });

  it('should process new files', () => {
    const mockFactory = jest
      .genMockFn()
      .mockImplementation((url, resolve) => resolve());

    const result = loadImage('http://www.mysite.com/another.jpg', options, mockFactory)(dispatch, getState);
    expect(result).toBeInstanceOf(Promise);

    // Assert result of calls after promise is resolved
    return result.then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: 'IMAGE_LOAD_SET_STATUS',
        payload: {
          status: IMAGE_STATUS.LOADING,
          url: 'http://www.mysite.com/another.jpg',
        },
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: 'IMAGE_LOAD_SET_STATUS',
        payload: {
          status: IMAGE_STATUS.SUCCESS,
          url: 'http://www.mysite.com/another.jpg',
        },
      });
      expect(getState).toHaveBeenCalledTimes(1);
      expect(mockFactory).toHaveBeenCalledTimes(1);
    });
  });
});

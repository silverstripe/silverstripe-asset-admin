/* global jest, jasmine, describe, it, expect, beforeEach, Event */

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as GalleryItem } from '../GalleryItem';
import IMAGE_STATUS from 'state/imageLoad/ImageLoadStatus';

describe('GalleryItem', () => {
  let props = null;

  beforeEach(() => {
    props = {
      id: 0,
      selectable: true,
      selected: false,
      onSelect: jest.fn(),
      onActivate: jest.fn(),
      onDelete: jest.fn(),
      item: {
        width: 10,
        height: 10,
        exists: true,
        category: 'image',
        id: 1,
        title: 'test',
        canEdit: true,
      },
      sectionConfig: {
        imageRetry: {
          minRetry: 0,
          maxRetry: 0,
          expiry: 0,
        },
      },
      loadState: IMAGE_STATUS.DISABLED,
    };
  });

  describe('handleCancelUpload()', () => {
    let item = null;
    const event = new Event('test');

    beforeEach(() => {
      props.onRemoveErroredUpload = jest.genMockFunction();
      props.onCancelUpload = jest.genMockFunction();

      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );
    });

    it('should call onRemoveErroredUpload when there was an error', () => {
      item.hasError = () => true;
      item.handleCancelUpload(event);

      expect(props.onRemoveErroredUpload).toBeCalled();
    });

    it('should call onCancelUpload when there were no errors found', () => {
      item.hasError = () => false;
      item.handleCancelUpload(event);

      expect(props.onCancelUpload).toBeCalled();
    });
  });

  describe('hasError()', () => {
    let item = null;

    it('should give an error if message type is "error"', () => {
      props.item.message = { type: 'error', value: '' };
      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );
      const error = item.hasError();

      expect(error).toBe(true);
    });

    it('should give no error if message type is "success"', () => {
      props.item.message = { type: 'success', value: '' };
      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );
      const error = item.hasError();

      expect(error).toBe(false);
    });
  });

  describe('handleActivate()', () => {
    let item = null;
    let event = null;

    beforeEach(() => {
      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      event = {
        stopPropagation: jest.genMockFunction(),
        preventDefault: jest.genMockFunction(),
      };
    });

    it('should call props.onActivate', () => {
      expect(item.props.onActivate.mock.calls.length).toBe(0);

      item.handleActivate(event);

      expect(item.props.onActivate).toBeCalled();
    });

    it('should stop propagation of the event', () => {
      item.handleActivate(event);

      expect(event.stopPropagation).toBeCalled();
    });
  });

  describe('handleSelect()', () => {
    let item = null;
    let event = null;

    beforeEach(() => {
      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      event = {
        stopPropagation: jest.genMockFunction(),
        preventDefault: jest.genMockFunction(),
      };
    });

    it('should call props.onSelect', () => {
      expect(item.props.onSelect.mock.calls.length).toBe(0);

      item.handleSelect(event);

      expect(item.props.onSelect).toBeCalled();
    });

    it('should stop propagation of the event', () => {
      item.handleSelect(event);

      expect(event.stopPropagation).toBeCalled();
    });
  });

  describe('getThumbnailStyles()', () => {
    let item = null;

    it('should return backgroundImage with the correct url if the item is a thumbnail', () => {
      props.item = {
        ...props.item,
        category: 'image',
        url: 'myUrl',
        thumbnail: 'myThumbnailUrl',
      };

      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      expect(item.getThumbnailStyles()).toEqual({ backgroundImage: 'url(myThumbnailUrl)' });
      expect(item.getThumbnailClassNames()).toBe('gallery-item__thumbnail gallery-item__thumbnail--small');
    });

    it('should not return backgroundImage with no thumbnail can be found', () => {
      props.item = {
        ...props.item,
        category: 'image',
        url: 'myUrl',
        thumbnail: '',
      };

      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      const classNames = item.getThumbnailClassNames();

      expect(item.getThumbnailStyles()).toEqual({});
      expect(classNames).toContain('gallery-item__thumbnail');
      expect(classNames).toContain('gallery-item__thumbnail--small');
    });

    it('should not return backgroundImage if thumbnail failed to load', () => {
      props = {
        ...props,
        loadState: IMAGE_STATUS.FAILED,
        item: {
          ...props.item,
          category: 'image',
          url: 'myUrl',
          thumbnail: 'myThumbnailUrl',
        },
      };

      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      const classNames = item.getThumbnailClassNames();

      expect(item.getThumbnailStyles()).toEqual({});
      expect(classNames).toContain('gallery-item__thumbnail');
      expect(classNames).toContain('gallery-item__thumbnail--small');
      expect(classNames).toContain('gallery-item__thumbnail--error');
    });

    it('should return an empty object if the item is not an image', () => {
      props.item = {
        ...props.item,
        category: 'notAnImage',
        url: 'myUrl',
      };

      expect(item.getThumbnailStyles()).toEqual({});
      expect(item.getThumbnailClassNames()).toContain('gallery-item__thumbnail');
    });
  });

  describe('getThumbnailClassNames()', () => {
    let item = null;

    beforeEach(() => {
      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      item.isImageSmallerThanThumbnail = jest.genMockFunction();
    });

    it('should return not return small classes by default', () => {
      expect(item.getThumbnailClassNames()).toContain('gallery-item__thumbnail');
    });

    it('should return small classes only if isImageSmallerThanThumbnail returns true', () => {
      item.isImageSmallerThanThumbnail.mockReturnValueOnce(true);

      expect(item.isImage()).toEqual(true);
      expect(item.getThumbnailClassNames()).toContain('gallery-item__thumbnail--small');
    });
  });

  describe('getItemClassNames()', () => {
    let item = null;

    it('should return the file\'s category', () => {
      props.item.category = 'image';

      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      expect(item.getItemClassNames()).toContain('item--image');
    });

    it('should return selected if the selected prop is true', () => {
      props.selectable = true;
      props.item.selected = true;

      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      expect(item.getItemClassNames()).toContain('item--selected');
    });

    it('should return not selected if the selected prop is true but not selectable', () => {
      props.selectable = false;
      props.selected = true;

      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      expect(item.getItemClassNames()).not.toContain('item--selected');
    });
  });

  describe('isImageSmallerThanThumbnail()', () => {
    let item = null;

    beforeEach(() => {
      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );
    });

    it('should return true if the dimensions are smaller than the default thumbnail size', () => {
      expect(item.isImageSmallerThanThumbnail()).toBe(true);
    });

    it('should return false if the dimensions are larger than the default thumbnail size', () => {
      props.item.width = 1000;
      props.item.height = 1000;

      expect(item.isImageSmallerThanThumbnail()).toBe(false);
    });
  });

  describe('handleKeyDown()', () => {
    let item = null;
    let event = null;

    beforeEach(() => {
      props.spaceKey = 32;
      props.returnKey = 13;

      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      event = {
        stopPropagation: jest.genMockFunction(),
        preventDefault: jest.genMockFunction(),
      };

      item.handleSelect = jest.genMockFunction();
      item.handleActivate = jest.genMockFunction();
    });

    it('should trigger handleSelect when the space key is pressed', () => {
      event.keyCode = 32;
      expect(item.handleSelect.mock.calls.length).toBe(0);

      item.handleKeyDown(event);

      expect(item.handleSelect).toBeCalled();
    });

    it('should trigger handleActivate when the return key is pressed', () => {
      event.keyCode = 13;
      expect(item.handleActivate.mock.calls.length).toBe(0);

      item.handleKeyDown(event);

      expect(item.handleActivate).toBeCalled();
    });

    it('should prevent the default behaviour of the event', () => {
      event.keyCode = 32;
      item.handleKeyDown(event);

      expect(event.preventDefault).toBeCalled();
    });
  });
});

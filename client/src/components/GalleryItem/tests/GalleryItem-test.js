/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('react');
jest.unmock('../GalleryItem');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import GalleryItem from '../GalleryItem';

describe('GalleryItem', () => {
  let props = null;

  beforeEach(() => {
    props = {
      id: 0,
      selected: false,
      onSelect: jest.genMockFunction(),
      onActivate: jest.genMockFunction(),
      handleDelete: jest.genMockFunction(),
      item: {
        dimensions: {
          width: 10,
          height: 10,
        },
        exists: true,
        category: 'image',
        id: 1,
        title: 'test',
      },
    };
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

    beforeEach(() => {
      props.item.url = 'myurl';

      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );
    });

    it('should return backgroundImage with the correct url if the item is an image', () => {
      item.props.item.category = 'image';

      expect(JSON.stringify(item.getThumbnailStyles())).toBe('{"backgroundImage":"url(myurl)"}');
    });

    it('should return an empty object if the item is not an image', () => {
      item.props.item.category = 'notAnImage';

      expect(JSON.stringify(item.getThumbnailStyles())).toBe('{}');
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
      expect(item.getThumbnailClassNames()).toBe('gallery-item__thumbnail');
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
      props.item.dimensions = {
        width: 1000,
        height: 1000,
      };

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

    it('should stop propagation of the event', () => {
      item.handleKeyDown(event);

      expect(event.stopPropagation).toBeCalled();
    });

    it('should prevent the default behaviour of the event', () => {
      event.keyCode = 32;
      item.handleKeyDown(event);

      expect(event.preventDefault).toBeCalled();
    });
  });

  describe('preventFocus()', () => {
    let item = null;
    let event = null;

    beforeEach(() => {
      item = ReactTestUtils.renderIntoDocument(
        <GalleryItem {...props} />
      );

      event = {
        preventDefault: jest.genMockFunction(),
      };
    });

    it('should prevent the default behaviour of the event', () => {
      item.preventFocus(event);

      expect(event.preventDefault).toBeCalled();
    });
  });
});

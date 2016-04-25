/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('../index.js');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import FileComponent from '../index.js';

describe('FileComponent', () => {
  let props;

  beforeEach(() => {
    props = {
      id: 0,
      selected: false,
      handleToggleSelect: jest.genMockFunction(),
      handleActivate: jest.genMockFunction(),
      handleDelete: jest.genMockFunction(),
      item: {
        attributes: {
          dimensions: {
            width: 10,
            height: 10,
          },
        },
        category: 'image',
        id: 1,
        title: 'test',
      },
    };
  });

  describe('handleActivate()', () => {
    let file;
    let event;

    beforeEach(() => {
      file = ReactTestUtils.renderIntoDocument(
        <FileComponent {...props} />
      );

      event = {
        stopPropagation: jest.genMockFunction(),
      };
    });

    it('should call props.handleActivate', () => {
      expect(file.props.handleActivate.mock.calls.length).toBe(0);

      file.handleActivate(event);

      expect(file.props.handleActivate).toBeCalled();
    });

    it('should stop propagation of the event', () => {
      file.handleActivate(event);

      expect(event.stopPropagation).toBeCalled();
    });
  });

  describe('handleToggleSelect()', () => {
    let file;
    let event;

    beforeEach(() => {
      file = ReactTestUtils.renderIntoDocument(
        <FileComponent {...props} />
      );

      event = {
        stopPropagation: jest.genMockFunction(),
      };
    });

    it('should call props.handleToggleSelect', () => {
      expect(file.props.handleToggleSelect.mock.calls.length).toBe(0);

      file.handleToggleSelect(event);

      expect(file.props.handleToggleSelect).toBeCalled();
    });

    it('should stop propagation of the event', () => {
      file.handleToggleSelect(event);

      expect(event.stopPropagation).toBeCalled();
    });
  });

  describe('getThumbnailStyles()', () => {
    let file;

    beforeEach(() => {
      props.item.url = 'myurl';

      file = ReactTestUtils.renderIntoDocument(
        <FileComponent {...props} />
      );
    });

    it('should return backgroundImage with the correct url if the item is an image', () => {
      file.props.item.category = 'image';

      expect(JSON.stringify(file.getThumbnailStyles())).toBe('{"backgroundImage":"url(myurl)"}');
    });

    it('should return an empty object if the item is not an image', () => {
      file.props.item.category = 'notAnImage';

      expect(JSON.stringify(file.getThumbnailStyles())).toBe('{}');
    });
  });

  describe('getThumbnailClassNames()', () => {
    let file;

    beforeEach(() => {
      file = ReactTestUtils.renderIntoDocument(
        <FileComponent {...props} />
      );

      file.isImageSmallerThanThumbnail = jest.genMockFunction();
    });

    it('should return "item__thumbnail"', () => {
      expect(file.getThumbnailClassNames()).toBe('item__thumbnail');
    });

    it('should return "item__thumbnail item__thumbnail--small" if isImageSmallerThanThumbnail returns true', () => {
      file.isImageSmallerThanThumbnail.mockReturnValueOnce(true);

      expect(file.getThumbnailClassNames()).toContain('item__thumbnail--small');
    });
  });

  describe('getItemClassNames()', () => {
    let file;

    it('should return the file\'s category', () => {
      props.item.category = 'image';

      file = ReactTestUtils.renderIntoDocument(
        <FileComponent {...props} />
      );

      expect(file.getItemClassNames()).toContain('item--image');
    });

    it('should return selected if the selected prop is true', () => {
      props.selected = true;

      file = ReactTestUtils.renderIntoDocument(
        <FileComponent {...props} />
      );

      expect(file.getItemClassNames()).toContain('item--selected');
    });
  });

  describe('isImageSmallerThanThumbnail()', () => {
    let file;

    beforeEach(() => {
      file = ReactTestUtils.renderIntoDocument(
        <FileComponent {...props} />
      );
    });

    it('should return true if the dimensions are smaller than the default thumbnail size', () => {
      expect(file.isImageSmallerThanThumbnail()).toBe(true);
    });

    it('should return false if the dimensions are larger than the default thumbnail size', () => {
      props.item.attributes.dimensions = {
        width: 1000,
        height: 1000,
      };

      expect(file.isImageSmallerThanThumbnail()).toBe(false);
    });
  });

  describe('handleKeyDown()', () => {
    let file;
    let event;

    beforeEach(() => {
      props.spaceKey = 32;
      props.returnKey = 13;

      file = ReactTestUtils.renderIntoDocument(
        <FileComponent {...props} />
      );

      event = {
        stopPropagation: jest.genMockFunction(),
        preventDefault: jest.genMockFunction(),
      };

      file.handleToggleSelect = jest.genMockFunction();
      file.handleActivate = jest.genMockFunction();
    });

    it('should trigger handleToggleSelect when the space key is pressed', () => {
      event.keyCode = 32;
      expect(file.handleToggleSelect.mock.calls.length).toBe(0);

      file.handleKeyDown(event);

      expect(file.handleToggleSelect).toBeCalled();
    });

    it('should trigger handleActivate when the return key is pressed', () => {
      event.keyCode = 13;
      expect(file.handleActivate.mock.calls.length).toBe(0);

      file.handleKeyDown(event);

      expect(file.handleActivate).toBeCalled();
    });

    it('should stop propagation of the event', () => {
      file.handleKeyDown(event);

      expect(event.stopPropagation).toBeCalled();
    });

    it('should prevent the default behaviour of the event', () => {
      event.keyCode = 32;
      file.handleKeyDown(event);

      expect(event.preventDefault).toBeCalled();
    });
  });

  describe('preventFocus()', () => {
    let file;
    let event;

    beforeEach(() => {
      file = ReactTestUtils.renderIntoDocument(
        <FileComponent {...props} />
      );

      event = {
        preventDefault: jest.genMockFunction(),
      };
    });

    it('should prevent the default behaviour of the event', () => {
      file.preventFocus(event);

      expect(event.preventDefault).toBeCalled();
    });
  });
});

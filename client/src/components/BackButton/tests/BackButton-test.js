/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('../BackButton');
jest.unmock('components/GalleryItem/droppable');
jest.unmock('components/Badge/Badge');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { BackButton } from '../BackButton';

describe('BackButton', () => {
  let props = null;

  beforeEach(() => {
    props = {
      onClick: jest.genMockFunction(),
      enlarged: false,
      badge: {
        status: 'success',
        message: 'Test successful',
      },
    };
  });

  describe('render()', () => {
    it('should render a badge when the badge property is defined', () => {
      const item = ReactTestUtils.renderIntoDocument(
        <BackButton {...props} />
      );
      let badge = null;
      try {
        badge = ReactTestUtils.findRenderedDOMComponentWithClass(item, 'gallery__back-badge');
      } catch (e) {
        // something happened
      }

      expect(badge).not.toBe(null);
    });

    it('should not render a badge when the badge property is falsey', () => {
      props.badge = null;
      const item = ReactTestUtils.renderIntoDocument(
        <BackButton {...props} />
      );
      let badge = null;
      try {
        badge = ReactTestUtils.findRenderedDOMComponentWithClass(item, 'gallery__back-badge');
      } catch (e) {
        // something happened
      }

      expect(badge).toBe(null);
    });

    it('should have extra classes when "enlarged"', () => {
      props.enlarged = true;
      const item = ReactTestUtils.renderIntoDocument(
        <BackButton {...props} />
      );
      const element = item && item.render();

      expect(element.props.className).toContain('gallery__back--droppable-hover');
    });
  });
});

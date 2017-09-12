/* global jest, jasmine, describe, it, expect, beforeEach */

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as BackButton } from '../BackButton';

describe('BackButton', () => {
  let props = null;

  beforeEach(() => {
    props = {
      onClick: jest.fn(),
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
        badge = ReactTestUtils.scryRenderedDOMComponentsWithClass(item, 'gallery__back-badge')[0];
      } catch (e) {
        // something happened
      }

      expect(badge).toBeTruthy();
    });

    it('should not render a badge when the badge property is falsey', () => {
      props.badge = null;
      const item = ReactTestUtils.renderIntoDocument(
        <BackButton {...props} />
      );
      let badge = null;
      try {
        badge = ReactTestUtils.scryRenderedDOMComponentsWithClass(item, 'gallery__back-badge')[0];
      } catch (e) {
        // something happened
      }

      expect(badge).toBeFalsy();
    });

    it('should have extra classes when "enlarged"', () => {
      props.enlarged = true;
      const item = ReactTestUtils.renderIntoDocument(
        <BackButton {...props} />
      );
      const button = ReactTestUtils.scryRenderedDOMComponentsWithClass(item, 'gallery__back')[0];

      expect(Array.from(button.classList)).toContain('gallery__back--droppable-hover');
    });
  });
});

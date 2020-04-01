/* global jest, jasmine, describe, it, expect, beforeEach */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { Component as ProportionConstraintField } from '../ProportionConstraintField';

// eslint-disable-next-line react/prop-types
const FieldGroup = ({ children }) => <div>{children}</div>;

const imageSizePresets = [
  { width: 1234, text: 'default', default: true },
  { width: 4321, text: 'super large' },
  { width: 2, text: 'super small' },
];

/**
 * @param {Object} props
 * @returns {{item: *, calls: }}
 */
const render = (props = {}) => {
  const autofill = jest.fn();
  const item = ReactTestUtils.renderIntoDocument(
    <ProportionConstraintField
      data={{ ratio: 3 / 2, originalWidth: 1800 }}
      onAutofill={autofill}
      FieldGroup={FieldGroup}
      imageSizePresets={imageSizePresets}
      current={{ width: 12, height: 4 }}
      {...props}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );

  return { item, calls: autofill.mock.calls };
};

/**
 * Validates that calls would produce the attach data
 * @param {Array[]} calls
 * @param {Object} data
 */
const expectDimensions = (calls, data = {}) => {
  const keys = Object.keys(data);
  expect(calls.length).toBe(keys.length);
  calls.forEach(([key, width]) => {
    expect(keys).toContain(key);
    expect(width).toBe(data[key]);
  });
};

describe('ProportionConstraintField', () => {
  describe('mount()', () => {
    it('should throw if two children are not given', () => {
      let error = null;
      try {
        ReactTestUtils.ShallowRenderer(
          <ProportionConstraintField ratio={1} FieldGroup={FieldGroup} current={{}} />
        );
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it('bad initial value should be reset to default', () => {
      const { calls } = render({ current: {} });
      expectDimensions(calls, { one: 1234, two: 823 });
    });
  });

  describe('handleChange()', () => {
    it('should call autofill with the correct values', () => {
      const { item, calls } = render();
      const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(item, 'input');
      ReactTestUtils.Simulate.change(inputs[0], { target: { value: 6 } });

      expectDimensions(calls, { one: 6, two: 4 });
    });

    it('should call autofill with explicit newValue', () => {
      const { item, calls } = render();
      item.handleChange(0, { target: {} }, 6);

      expectDimensions(calls, { one: 6, two: 4 });
    });

    it('providing value has string should work', () => {
      const { item, calls } = render();
      item.handleChange(1, { target: {} }, '6');

      expectDimensions(calls, { one: 9, two: 6 });
    });

    it('should not constrain when not active', () => {
      const { item, calls } = render({ active: false });
      const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(item, 'input');
      ReactTestUtils.Simulate.change(inputs[0], { target: { value: 6 } });

      expectDimensions(calls, { one: 6 });
    });

    it('bad values are tolerated', () => {
      const { item, calls } = render();
      item.handleChange(0, {}, 'non-numeric-value');
      expectDimensions(calls);
    });
  });

  describe('syncFields()', () => {
    it('should call autofill with explicit newValue', () => {
      const { item, calls } = render();
      item.syncFields(0, 6);

      expectDimensions(calls, { one: 6, two: 4 });
    });

    it('Updating height should update width', () => {
      const { item, calls } = render();
      item.syncFields(1, 6);
      expectDimensions(calls, { one: 9, two: 6 });
    });
  });

  describe('handlePresetSelect()', () => {
    it('should call autofill with explicit newValue', () => {
      const { item, calls } = render();
      item.handlePresetSelect(1080);

      expectDimensions(calls, { one: 1080, two: 720 });
    });
  });

  describe('handleBlur()', () => {
    it('Do nothing with valid values', () => {
      const { item, calls } = render();
      const preventDefault = jest.fn();
      item.handleBlur(0, { target: { value: 123 }, preventDefault });
      expectDimensions(calls);
      expect(preventDefault.mock.calls.length).toBe(0);
    });

    it('invalid values trigger reset', () => {
      const { item, calls } = render();
      const preventDefault = jest.fn();
      item.handleBlur(0, { preventDefault });
      expectDimensions(calls, { one: 1234, two: 823 });
      expect(preventDefault.mock.calls.length).toBe(1);
    });
  });

  describe('handleFocus()', () => {
    it('hasFocus state should be updated', () => {
      const { item } = render();
      item.handleFocus();
      expect(item.state.hasFocus).toBe(true);

      item.handleBlur(0, { target: { value: 123 } });
      expect(item.state.hasFocus).toBe(false);
    });
  });

  describe('defaultWidth()', () => {
    const testCases = [
      ['default image size preset is the first default', {}, 1234],
      ['fall back to original size', { imageSizePresets: [] }, 1800],
      ['fall back to 600', { imageSizePresets: [], data: { ratio: 1.5 } }, 600],
      ['never bigger than original size', { data: { ratio: 1.5, originalWidth: 123 } }, 123],
    ];

    testCases.forEach(([message, props, expected]) => {
      it(message, () => {
        const { item } = render(props);
        const actual = item.defaultWidth();
        expect(actual).toBe(expected);
      });
    });
  });

  describe('resetDimensions()', () => {
    it('dimensions are reset to defaults', () => {
      const { item, calls } = render();
      item.resetDimensions();
      expectDimensions(calls, { one: 1234, two: 823 });
    });
  });

  describe('data.isRemoteFile', () => {
    const defaultProps = { ratio: 1.5, originalWidth: 123 };
    const hasRenderedImageSizePresetList = item =>
      ReactTestUtils.scryRenderedDOMComponentsWithClass(item, 'image-size-preset-list').length > 0;
    it('has rendered <ImageSizePresetList> when false', () => {
      const props = { data: { isRemoteFile: false, ...defaultProps } };
      const { item } = render(props);
      expect(hasRenderedImageSizePresetList(item)).toBe(true);
    });
    it('has rendered <ImageSizePresetList> when missing', () => {
      const props = { data: { isRemoteFile: false, ...defaultProps } };
      const { item } = render(props);
      expect(hasRenderedImageSizePresetList(item)).toBe(true);
    });
    it('has not rendered <ImageSizePresetList> when true', () => {
      const props = { data: { isRemoteFile: true, ...defaultProps } };
      const { item } = render(props);
      expect(hasRenderedImageSizePresetList(item)).toBe(false);
    });
  });
});

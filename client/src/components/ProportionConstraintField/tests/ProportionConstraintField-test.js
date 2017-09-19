/* global jest, jasmine, describe, it, expect, beforeEach */

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as ProportionConstraintField } from '../ProportionConstraintField';

// eslint-disable-next-line react/prop-types
const FieldGroup = ({ children }) => <div>{children}</div>;

describe('ProportionConstraintField', () => {
  describe('mount()', () => {
    it('should throw if two children are not given', () => {
      let error = null;
      try {
        ReactTestUtils.renderIntoDocument(
          <ProportionConstraintField ratio={1} FieldGroup={FieldGroup} />
        );
      } catch (e) {
        error = e;
      }
      expect(error).toBeTruthy();
    });

    it('should call autofill with the correct values', () => {
      const autofill = jest.fn();
      const item = ReactTestUtils.renderIntoDocument(
        <ProportionConstraintField
          data={{ ratio: 1.5 }}
          onAutofill={autofill}
          FieldGroup={FieldGroup}
        >
          <input name="one" type="text" value="0" />
          <input name="two" type="text" value="0" />
        </ProportionConstraintField>
      );
      const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(item, 'input');
      ReactTestUtils.Simulate.change(inputs[0], { target: { value: 6 } });

      expect(autofill.mock.calls.length).toBe(2);
      expect(autofill.mock.calls[0][0]).toBe('one');
      expect(autofill.mock.calls[0][1]).toBe(6);
      expect(autofill.mock.calls[1][0]).toBe('two');
      expect(autofill.mock.calls[1][1]).toBe(4);
    });

    it('should not constrain when not active', () => {
      const mockFn = jest.fn();
      const item = ReactTestUtils.renderIntoDocument(
        <ProportionConstraintField
          active={false}
          data={{ ratio: 1.5 }}
          onAutofill={mockFn}
          FieldGroup={FieldGroup}
        >
          <input name="one" type="text" value="0" />
          <input name="two" type="text" value="0" />
        </ProportionConstraintField>
      );
      const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(item, 'input');
      ReactTestUtils.Simulate.change(inputs[0], { target: { value: 6 } });

      expect(mockFn.mock.calls.length).toBe(1);
      expect(mockFn.mock.calls[0][0]).toBe('one');
      expect(mockFn.mock.calls[0][1]).toBe(6);
    });
  });
});

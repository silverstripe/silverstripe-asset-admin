/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('../ProportionConstraintField');
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ProportionConstraintField from '../ProportionConstraintField';
import Injector from 'lib/Injector';

const FieldGroup = (props) => <div>{props.children}</div>;
FieldGroup.propTypes = {
  children: React.PropTypes.array,
};
Injector.register('FieldGroup', FieldGroup);

describe('ProportionConstraintField', () => {
  describe('mount()', () => {
    it('should throw if two children are not given', () => {
      let error = null;
      try {
        ReactTestUtils.renderIntoDocument(
                  <ProportionConstraintField ratio={1} />
                );
      } catch (e) {
        error = e;
      }
      expect(error).toBeTruthy();
    });

    it('should call autofill with the correct values', () => {
      const mockFn = jest.fn();
      const item = ReactTestUtils.renderIntoDocument(
              <ProportionConstraintField data={{ ratio: 1.5 }} onAutofill={mockFn}>
                  <input name="one" type="text" value="0" />
                  <input name="two" type="text" value="0" />
              </ProportionConstraintField>
            );
      const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(item, 'input');
      ReactTestUtils.Simulate.change(inputs[0], { target: { value: 6 } });
      expect(mockFn.mock.calls.length).toBe(2);
      expect(mockFn.mock.calls[0][0]).toBe('one');
      expect(mockFn.mock.calls[0][1]).toBe(6);
      expect(mockFn.mock.calls[1][0]).toBe('two');
      expect(mockFn.mock.calls[1][1]).toBe(4);
    });

    it('should not constrain when not active', () => {
      const mockFn = jest.fn();
      const item = ReactTestUtils.renderIntoDocument(
              <ProportionConstraintField active={false} data={{ ratio: 1.5 }} onAutofill={mockFn}>
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

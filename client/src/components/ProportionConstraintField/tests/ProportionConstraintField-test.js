/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as ProportionConstraintField } from '../ProportionConstraintField';

function makeProps(obj = {}) {
  return {
    data: { ratio: 3 / 2, originalWidth: 1800 },
    onAutofill: () => null,
    FieldGroup: ({ children }) => <div>{children}</div>,
    imageSizePresets: [
      { width: 1234, text: 'default', default: true },
      { width: 4321, text: 'super large' },
      { width: 2, text: 'super small' },
    ],
    current: { width: 12, height: 4 },
    active: true,
    ...obj
  };
}

test('ProportionConstraintField mount() should throw if two children are not given', () => {
  const consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => null);
  expect(() => render(
    <ProportionConstraintField {...makeProps()} />
  )).toThrow('ProportionConstraintField must be passed two children -- one field for each value');
  consoleErrorFn.mockRestore();
});

test('ProportionConstraintField mount() bad initial value should be reset to default', () => {
  const onAutofill = jest.fn();
  render(
    <ProportionConstraintField {...makeProps({
      current: {},
      onAutofill
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  expect(onAutofill.mock.calls.length).toBe(2);
  expect(onAutofill.mock.calls[0][0]).toBe('one');
  expect(onAutofill.mock.calls[0][1]).toBe(1234);
  expect(onAutofill.mock.calls[1][0]).toBe('two');
  expect(onAutofill.mock.calls[1][1]).toBe(823);
});

test('ProportionConstraintField handleChange() should call autofill with the correct values', () => {
  const onAutofill = jest.fn();
  const { container } = render(
    <ProportionConstraintField {...makeProps({
      onAutofill
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  const inputs = container.querySelectorAll('input');
  fireEvent.change(inputs[0], { target: { value: 6 } });
  expect(onAutofill.mock.calls.length).toBe(2);
  expect(onAutofill.mock.calls[0][0]).toBe('one');
  expect(onAutofill.mock.calls[0][1]).toBe(6);
  expect(onAutofill.mock.calls[1][0]).toBe('two');
  expect(onAutofill.mock.calls[1][1]).toBe(4);
});

test('ProportionConstraintField handleChange() providing value as string should work', () => {
  const onAutofill = jest.fn();
  const { container } = render(
    <ProportionConstraintField {...makeProps({
      onAutofill
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  const inputs = container.querySelectorAll('input');
  fireEvent.change(inputs[0], { target: { value: '6' } });
  expect(onAutofill.mock.calls.length).toBe(2);
  expect(onAutofill.mock.calls[0][0]).toBe('one');
  expect(onAutofill.mock.calls[0][1]).toBe(6);
  expect(onAutofill.mock.calls[1][0]).toBe('two');
  expect(onAutofill.mock.calls[1][1]).toBe(4);
});

test('ProportionConstraintField handleChange() should not constrain when not active', () => {
  const onAutofill = jest.fn();
  const { container } = render(
    <ProportionConstraintField {...makeProps({
      onAutofill,
      active: false
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  const inputs = container.querySelectorAll('input');
  fireEvent.change(inputs[0], { target: { value: '6' } });
  expect(onAutofill.mock.calls.length).toBe(1);
  expect(onAutofill.mock.calls[0][0]).toBe('one');
  expect(onAutofill.mock.calls[0][1]).toBe(6);
});

test('ProportionConstraintField handleChange() bad values are tolerated', () => {
  const onAutofill = jest.fn();
  const { container } = render(
    <ProportionConstraintField {...makeProps({
      onAutofill,
      active: false
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  const inputs = container.querySelectorAll('input');
  fireEvent.change(inputs[0], { target: { value: 'non-numeric-value' } });
  expect(onAutofill.mock.calls.length).toBe(0);
});

test('ProportionConstraintField defaultWidth() fell back to original size', () => {
  const onAutofill = jest.fn();
  render(
    <ProportionConstraintField {...makeProps({
      onAutofill,
      current: {},
      imageSizePresets: []
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  expect(onAutofill.mock.calls.length).toBe(2);
  expect(onAutofill.mock.calls[0][0]).toBe('one');
  expect(onAutofill.mock.calls[0][1]).toBe(1800);
  expect(onAutofill.mock.calls[1][0]).toBe('two');
  expect(onAutofill.mock.calls[1][1]).toBe(1200);
});

test('ProportionConstraintField defaultWidth() fall back to 600', () => {
  const onAutofill = jest.fn();
  render(
    <ProportionConstraintField {...makeProps({
      onAutofill,
      current: {},
      imageSizePresets: [],
      data: { ratio: 1.5 }
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  expect(onAutofill.mock.calls.length).toBe(2);
  expect(onAutofill.mock.calls[0][0]).toBe('one');
  expect(onAutofill.mock.calls[0][1]).toBe(600);
  expect(onAutofill.mock.calls[1][0]).toBe('two');
  expect(onAutofill.mock.calls[1][1]).toBe(400);
});

test('ProportionConstraintField defaultWidth() never bigger than original size', () => {
  const onAutofill = jest.fn();
  render(
    <ProportionConstraintField {...makeProps({
      onAutofill,
      current: {},
      imageSizePresets: [],
      data: { ratio: 1.5, originalWidth: 123 }
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  expect(onAutofill.mock.calls.length).toBe(2);
  expect(onAutofill.mock.calls[0][0]).toBe('one');
  expect(onAutofill.mock.calls[0][1]).toBe(123);
  expect(onAutofill.mock.calls[1][0]).toBe('two');
  expect(onAutofill.mock.calls[1][1]).toBe(82);
});

test('ProportionConstraintField resetDimensions() dimensions are reset to defaults', () => {
  const onAutofill = jest.fn();
  const { rerender } = render(
    <ProportionConstraintField {...makeProps({
      current: {},
      imageSizePresets: []
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  rerender(
    <ProportionConstraintField {...makeProps({
      onAutofill,
      current: {}
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  expect(onAutofill.mock.calls.length).toBe(2);
  expect(onAutofill.mock.calls[0][0]).toBe('one');
  expect(onAutofill.mock.calls[0][1]).toBe(1234);
  expect(onAutofill.mock.calls[1][0]).toBe('two');
  expect(onAutofill.mock.calls[1][1]).toBe(823);
});

test('ProportionConstraintField data.isRemoteFile has rendered <ImageSizePresetList> when false', () => {
  const { container } = render(
    <ProportionConstraintField {...makeProps({
      data: {
        isRemoteFile: false,
        ratio: 1.5,
        originalWidth: 123
      }
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  expect(container.querySelectorAll('.image-size-preset-list').length).toBe(1);
});

test('ProportionConstraintField data.isRemoteFile has rendered <ImageSizePresetList> when true', () => {
  const { container } = render(
    <ProportionConstraintField {...makeProps({
      data: {
        isRemoteFile: true,
        ratio: 1.5,
        originalWidth: 123
      }
    })}
    >
      <input name="one" type="text" value="0" />
      <input name="two" type="text" value="0" />
    </ProportionConstraintField>
  );
  expect(container.querySelectorAll('.image-size-preset-list').length).toBe(0);
});

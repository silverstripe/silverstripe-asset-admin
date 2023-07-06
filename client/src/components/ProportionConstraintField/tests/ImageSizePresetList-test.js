/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ImageSizePresetList from '../ImageSizePresetList';

function makeProps(obj = {}) {
  return {
    onSelect: () => null,
    imageSizePresets: [
      { width: 1234, text: 'default', default: true },
      { width: 4321, text: 'super large' },
      { width: 2, text: 'super small' },
    ],
    currentWidth: 123,
    originalWidth: 321,
    ...obj
  };
}

test('ImageSizePresetList render() presets are displayed', () => {
  const { container } = render(
    <ImageSizePresetList {...makeProps()}/>
  );
  const buttons = container.querySelectorAll('button');
  expect(buttons[0].querySelector('span.sr-only').textContent).toBe('Set image size to "default"');
  expect(buttons[0].querySelector('span[aria-hidden="true"]').textContent).toBe('default');
  expect(buttons[1].querySelector('span.sr-only').textContent).toBe('Set image size to "super large"');
  expect(buttons[1].querySelector('span[aria-hidden="true"]').textContent).toBe('super large');
  expect(buttons[2].querySelector('span.sr-only').textContent).toBe('Set image size to "super small"');
  expect(buttons[2].querySelector('span[aria-hidden="true"]').textContent).toBe('super small');
});

test('ImageSizePresetList render() prset bigger than image are disabled', () => {
  const { container } = render(
    <ImageSizePresetList {...makeProps()}/>
  );
  const buttons = container.querySelectorAll('button');
  expect(buttons[0].disabled).toBe(true);
  expect(buttons[1].disabled).toBe(true);
  expect(buttons[2].disabled).toBe(false);
});

test('ImageSizePresetList render() selected preset is disabled', () => {
  const { container } = render(
    <ImageSizePresetList {...makeProps({
      currentWidth: 2
    })}
    />
  );
  const buttons = container.querySelectorAll('button');
  expect(buttons[0].disabled).toBe(true);
  expect(buttons[1].disabled).toBe(true);
  expect(buttons[2].disabled).toBe(true);
});

test('ImageSizePresetList onSelect() clicking a button trigger onSelect()', () => {
  const onSelect = jest.fn();
  const { container } = render(
    <ImageSizePresetList {...makeProps({
      onSelect
    })}
    />
  );
  const buttons = container.querySelectorAll('button');
  fireEvent.click(buttons[2]);
  expect(onSelect.mock.calls.length).toBe(1);
  expect(onSelect.mock.calls[0][0]).toBe(2);
});

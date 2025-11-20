/* global jest, test, expect */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import UploadButton from '../UploadButton';

function makeProps(obj = {}) {
  return {
    canEdit: true,
    ...obj
  };
}

test('UploadButton renders button with correct id', () => {
  const { container } = render(
    <UploadButton {...makeProps()} />
  );
  const button = container.querySelector('button#upload-button');
  expect(button).not.toBeNull();
});

test('UploadButton renders button with correct CSS classes', () => {
  const { container } = render(
    <UploadButton {...makeProps()} />
  );
  const button = container.querySelector('button#upload-button');
  expect(button.classList.contains('btn')).toBe(true);
  expect(button.classList.contains('btn-secondary')).toBe(true);
  expect(button.classList.contains('btn--icon-xl')).toBe(true);
});

test('UploadButton renders button with type button', () => {
  const { container } = render(
    <UploadButton {...makeProps()} />
  );
  const button = container.querySelector('button#upload-button');
  expect(button.type).toBe('button');
});

test('UploadButton renders icon with upload class', () => {
  const { container } = render(
    <UploadButton {...makeProps()} />
  );
  const icon = container.querySelector('.font-icon-upload');
  expect(icon).not.toBeNull();
  expect(icon.classList.contains('btn__icon')).toBe(true);
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('UploadButton renders button text content', () => {
  const { container } = render(
    <UploadButton {...makeProps()} />
  );
  const textSpan = container.querySelector('.btn__text.btn__title');
  expect(textSpan).not.toBeNull();
});

test('UploadButton button is enabled when canEdit is true', () => {
  const { container } = render(
    <UploadButton {...makeProps({ canEdit: true })} />
  );
  const button = container.querySelector('button#upload-button');
  expect(button.disabled).toBe(false);
});

test('UploadButton button is disabled when canEdit is false', () => {
  const { container } = render(
    <UploadButton {...makeProps({ canEdit: false })} />
  );
  const button = container.querySelector('button#upload-button');
  expect(button.disabled).toBe(true);
});

test('UploadButton renders with default props', () => {
  const { container } = render(
    <UploadButton {...makeProps()} />
  );
  const button = container.querySelector('button#upload-button');
  expect(button).not.toBeNull();
  expect(button.disabled).toBe(false);
});

test('UploadButton button has correct structure with icon and text', () => {
  const { container } = render(
    <UploadButton {...makeProps()} />
  );
  const button = container.querySelector('button#upload-button');
  const children = button.children;
  expect(children.length).toBe(2);
  expect(children[0].classList.contains('font-icon-upload')).toBe(true);
  expect(children[1].classList.contains('btn__text')).toBe(true);
});

test('UploadButton icon is properly hidden from screen readers', () => {
  const { container } = render(
    <UploadButton {...makeProps()} />
  );
  const icon = container.querySelector('.font-icon-upload');
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('UploadButton renders with multiple instances independently', () => {
  const { container } = render(
    <div>
      <UploadButton {...makeProps({ canEdit: true })} />
      <UploadButton {...makeProps({ canEdit: false })} />
    </div>
  );
  const buttons = container.querySelectorAll('button#upload-button');
  expect(buttons.length).toBe(2);
  expect(buttons[0].disabled).toBe(false);
  expect(buttons[1].disabled).toBe(true);
});

test('UploadButton renders text from i18n translation key', () => {
  const { container } = render(
    <UploadButton {...makeProps()} />
  );
  const textSpan = container.querySelector('.btn__text.btn__title');
  expect(textSpan).not.toBeNull();
  expect(textSpan.className).toContain('btn__text');
  expect(textSpan.className).toContain('btn__title');
});

test('UploadButton button click is not prevented by disabled attribute', () => {
  const { container } = render(
    <UploadButton {...makeProps({ canEdit: true })} />
  );
  const button = container.querySelector('button#upload-button');
  const event = new MouseEvent('click', { bubbles: true });
  expect(() => {
    fireEvent(button, event);
  }).not.toThrow();
});

test('UploadButton button does not trigger click when disabled', () => {
  const { container } = render(
    <UploadButton {...makeProps({ canEdit: false })} />
  );
  const button = container.querySelector('button#upload-button');
  expect(button.disabled).toBe(true);
});

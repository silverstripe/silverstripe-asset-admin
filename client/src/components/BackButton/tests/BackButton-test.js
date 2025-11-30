/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as BackButton } from '../BackButton';

function makeProps(obj = {}) {
  return {
    onClick: () => null,
    enlarged: false,
    badge: {
      status: 'success',
      message: 'Test successful',
    },
    ...obj
  };
}

test('BackButton render() should render a badge when the badge property is defined', () => {
  const { container } = render(
    <BackButton {...makeProps()}/>
  );
  expect(container.querySelectorAll('.gallery__back-badge')).toHaveLength(1);
});

test('BackButton render() should not render a badge when the badge property is falsey', () => {
  const { container } = render(
    <BackButton {...makeProps({
      badge: null
    })}
    />
  );
  expect(container.querySelectorAll('.gallery__back-badge')).toHaveLength(0);
});

test('BackButton render() should have extra classes when "enlarged"', () => {
  const { container } = render(
    <BackButton {...makeProps({
      isDropping: true
    })}
    />
  );
  const els = container.querySelectorAll('.gallery__back');
  expect(els).toHaveLength(1);
  expect(els[0].classList).toContain('gallery__back--droppable-hover');
});

test('BackButton should have base CSS classes on the button element', () => {
  const { container } = render(
    <BackButton {...makeProps()} />
  );
  const button = container.querySelector('button');
  expect(button).not.toBeNull();
  expect(button.classList).toContain('btn');
  expect(button.classList).toContain('btn-secondary');
  expect(button.classList).toContain('btn--no-text');
  expect(button.classList).toContain('btn--icon-large');
  expect(button.classList).toContain('gallery__back');
});

test('BackButton should have correct title attribute', () => {
  const { container } = render(
    <BackButton {...makeProps()} />
  );
  const button = container.querySelector('button');
  expect(button.getAttribute('title')).toBe('Navigate up a level');
});

test('BackButton should render the level-up icon with aria-hidden attribute', () => {
  const { container } = render(
    <BackButton {...makeProps()} />
  );
  const icon = container.querySelector('.font-icon-level-up');
  expect(icon).not.toBeNull();
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('BackButton should call onClick handler when clicked', () => {
  const onClick = jest.fn();
  const { container } = render(
    <BackButton {...makeProps({ onClick })} />
  );
  const button = container.querySelector('button');
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('BackButton should not have droppable-hover class when isDropping is false', () => {
  const { container } = render(
    <BackButton {...makeProps({
      isDropping: false
    })}
    />
  );
  const button = container.querySelector('button');
  expect(button.classList).not.toContain('gallery__back--droppable-hover');
});

test('BackButton should not have z-depth-1 class when isDropping is false', () => {
  const { container } = render(
    <BackButton {...makeProps({
      isDropping: false
    })}
    />
  );
  const button = container.querySelector('button');
  expect(button.classList).not.toContain('z-depth-1');
});

test('BackButton should have z-depth-1 class when isDropping is true', () => {
  const { container } = render(
    <BackButton {...makeProps({
      isDropping: true
    })}
    />
  );
  const button = container.querySelector('button');
  expect(button.classList).toContain('z-depth-1');
});

test('BackButton should render badge with correct status and message', () => {
  const { container } = render(
    <BackButton {...makeProps({
      badge: {
        status: 'danger',
        message: 'Upload failed'
      }
    })}
    />
  );
  const badge = container.querySelector('.gallery__back-badge');
  expect(badge).not.toBeNull();
  expect(badge.classList.contains('badge-danger')).toBe(true);
  expect(badge.textContent).toBe('Upload failed');
});

test('BackButton should not render a badge when badge is undefined', () => {
  const { container } = render(
    <BackButton {...makeProps({
      badge: undefined
    })}
    />
  );
  expect(container.querySelectorAll('.gallery__back-badge')).toHaveLength(0);
});

test('BackButton should handle multiple onClick calls', () => {
  const onClick = jest.fn();
  const { container } = render(
    <BackButton {...makeProps({ onClick })} />
  );
  const button = container.querySelector('button');
  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(3);
});

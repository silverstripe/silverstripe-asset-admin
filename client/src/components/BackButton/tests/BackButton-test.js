/* global jest, test, expect */

import React from 'react';
import { render } from '@testing-library/react';
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

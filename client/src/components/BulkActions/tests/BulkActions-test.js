/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as BulkActions } from '../BulkActions';

jest.mock('jquery', () => {
  const jqueryMock = {
    find: () => jqueryMock,
    change: () => jqueryMock,
    val: () => jqueryMock,
    trigger: () => null,
    chosen: () => null,
    on: () => null,
    off: () => null,
  };
  return () => jqueryMock;
});

test('BulkActions canApply() shows an action button when canApply returns true', async () => {
  const { container } = render(
    <BulkActions {...{
      actions: [
        {
          value: 'action-with-apply',
          label: '',
          canApply: (items) => items.filter(item => item.applies).length,
          callback: () => true,
        },
        {
          value: 'action-without-apply',
          label: '',
          callback: () => true,
        },
      ],
      items: [{ applies: true }]
    }}
    />
  );
  const actions = container.querySelectorAll('.bulk-actions__action');
  expect(actions).toHaveLength(2);
  expect(actions[0].getAttribute('value')).toBe('action-with-apply');
  expect(actions[1].getAttribute('value')).toBe('action-without-apply');
});

test('BulkActions canApply() shows an action button when canApply returns false', () => {
  const { container } = render(
    <BulkActions {...{
      actions: [
        {
          value: 'action-with-apply',
          label: '',
          canApply: (items) => items.filter(item => item.applies).length,
          callback: () => true,
        },
        {
          value: 'action-without-apply',
          label: '',
          callback: () => true,
        },
      ],
      items: [{ applies: false }]
    }}
    />
  );
  const actions = container.querySelectorAll('.bulk-actions__action');
  expect(actions).toHaveLength(1);
  expect(actions[0].getAttribute('value')).toBe('action-without-apply');
});

test('BulkActions getOptionsByValue() should return the option which matches the given value', async () => {
  let doResolve;
  const promise = new Promise((resolve) => {
    doResolve = resolve;
  });
  const { container } = render(
    <BulkActions {...{
      actions: [
        {
          value: 'my-first-action',
          label: 'My First Action',
          callback: () => doResolve(),
        },
      ],
      items: [{ applies: true }],
    }}
    />
  );
  const action = container.querySelector('.bulk-actions__action');
  fireEvent.click(action);
  await promise;
  expect(container.querySelector('.bulk-actions__action').getAttribute('value')).toBe('my-first-action');
});

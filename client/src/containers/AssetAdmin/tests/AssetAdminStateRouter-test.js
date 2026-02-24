/* global jest, test, expect */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssetAdminStateRouter } from '../stateRouter';

let lastReturn;
let nextParams;
beforeEach(() => {
  lastReturn = undefined;
  nextParams = undefined;
});

function makeProps(obj = {}) {
  return {
    sectionConfig: {
      url: '',
      reactRoutePath: '/assets',
    },
    folderId: 0,
    actions: {
      resetFormStack: jest.fn(),
    },
    Component: ({ getUrl }) => (
      <button
        type="button"
        onClick={() => {
          lastReturn = getUrl(...nextParams);
        }}
      >
        Asset admin
      </button>
    ),
    ...obj
  };
}

test('AssetAdminStateRouter getUrl should avoid protocol-relative URLs', () => {
  render(
    <AssetAdminStateRouter {...makeProps()} />
  );
  const admin = screen.getByRole('button', { name: 'Asset admin' });
  nextParams = [0, null, {}];
  fireEvent.click(admin);
  expect(lastReturn).toBe('/assets');
});

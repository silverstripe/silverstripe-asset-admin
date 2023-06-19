/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as AssetAdminRouter } from '../AssetAdminRouter';

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
      limit: 10,
      form: {},
    },
    router: {
      location: {
        pathname: '',
        query: {},
        search: '',
      },
      navigate: jest.fn(),
      params: {
        folderId: 0
      },
    },
    AssetAdminComponent: ({ getUrl }) => <div
      data-testid="test-asset-admin"
      onClick={() => {
        lastReturn = getUrl(...nextParams);
      }}
    />,
    ...obj
  };
}

test('AssetAdminRouter getUrl should retain page query parameter when not changing folders', async () => {
  render(
    <AssetAdminRouter {...makeProps()}/>
  );
  const admin = await screen.findByTestId('test-asset-admin');
  nextParams = [0, null, { page: 2 }];
  fireEvent.click(admin);
  expect(lastReturn).toContain('page=2');
});

test('AssetAdminRouter getUrl should remove page query parameter when changing folders', async () => {
  render(
    <AssetAdminRouter {...makeProps()}/>
  );
  const admin = await screen.findByTestId('test-asset-admin');
  nextParams = [99, null, { page: 2 }];
  fireEvent.click(admin);
  expect(lastReturn).not.toContain('page=2');
});

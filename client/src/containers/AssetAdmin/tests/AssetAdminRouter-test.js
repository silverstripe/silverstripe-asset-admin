/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as AssetAdminRouter, buildUrl } from '../AssetAdminRouter';

let lastReturn;
let nextParams;
let capturedProps;
beforeEach(() => {
  lastReturn = undefined;
  nextParams = undefined;
  capturedProps = undefined;
});

function makeProps(obj = {}) {
  return {
    sectionConfig: {
      url: '',
      limit: 10,
      form: {},
      reactRoutePath: 'admin/assets',
    },
    router: {
      location: {
        pathname: '',
        query: {},
        search: '',
        state: null,
      },
      navigate: jest.fn(),
      params: {
        folderId: 0
      },
    },
    AssetAdminComponent: (props) => {
      capturedProps = props;
      return (
        <div
          data-testid="test-asset-admin"
          onClick={() => {
            if (nextParams && props.getUrl) {
              lastReturn = props.getUrl(...nextParams);
            }
          }}
        />
      );
    },
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

test('AssetAdminRouter getUrl should remove page query parameter when page is 1', async () => {
  render(
    <AssetAdminRouter {...makeProps()}/>
  );
  const admin = await screen.findByTestId('test-asset-admin');
  nextParams = [0, null, { page: 1 }];
  fireEvent.click(admin);
  expect(lastReturn).not.toContain('page=');
});

test('AssetAdminRouter getUrl should generate url with fileId', async () => {
  render(
    <AssetAdminRouter {...makeProps()}/>
  );
  const admin = await screen.findByTestId('test-asset-admin');
  nextParams = [5, 10, {}];
  fireEvent.click(admin);
  expect(lastReturn).toContain('show/5/edit/10');
});

test('AssetAdminRouter getUrl should generate url with only folderId', async () => {
  render(
    <AssetAdminRouter {...makeProps()}/>
  );
  const admin = await screen.findByTestId('test-asset-admin');
  nextParams = [5, null, {}];
  fireEvent.click(admin);
  expect(lastReturn).toContain('show/5');
  expect(lastReturn).not.toContain('edit');
});

test('AssetAdminRouter renders null when sectionConfig is not provided', () => {
  const { container } = render(
    <AssetAdminRouter {...makeProps({ sectionConfig: null })}/>
  );
  expect(container.firstChild).toBeNull();
});

test('AssetAdminRouter renders AssetAdmin component when sectionConfig is provided', () => {
  render(
    <AssetAdminRouter {...makeProps()}/>
  );
  expect(screen.getByTestId('test-asset-admin')).not.toBeNull();
});

test('AssetAdminRouter getFolderId returns folderId from router params', () => {
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '', state: null },
        navigate: jest.fn(),
        params: { folderId: 42 }
      }
    })}
    />
  );
  expect(capturedProps.folderId).toBe(42);
});

test('AssetAdminRouter getFolderId returns 0 when no folderId in params', () => {
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '', state: null },
        navigate: jest.fn(),
        params: {}
      }
    })}
    />
  );
  expect(capturedProps.folderId).toBe(0);
});

test('AssetAdminRouter getFileId returns fileId from router params', () => {
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '', state: null },
        navigate: jest.fn(),
        params: { fileId: 123 }
      }
    })}
    />
  );
  expect(capturedProps.fileId).toBe(123);
});

test('AssetAdminRouter getFileId returns 0 when no fileId in params', () => {
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '', state: null },
        navigate: jest.fn(),
        params: {}
      }
    })}
    />
  );
  expect(capturedProps.fileId).toBe(0);
});

test('AssetAdminRouter getViewAction returns viewAction from router params', () => {
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '', state: null },
        navigate: jest.fn(),
        params: { viewAction: 'create-folder' }
      }
    })}
    />
  );
  expect(capturedProps.viewAction).toBe('create-folder');
});

test('AssetAdminRouter getViewAction returns edit default when no viewAction in params', () => {
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '', state: null },
        navigate: jest.fn(),
        params: {}
      }
    })}
    />
  );
  expect(capturedProps.viewAction).toBe('edit');
});

test('AssetAdminRouter getQuery returns decoded query from location.search', () => {
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '?foo=bar&baz=qux', state: null },
        navigate: jest.fn(),
        params: {}
      }
    })}
    />
  );
  expect(capturedProps.query).toEqual({ foo: 'bar', baz: 'qux' });
});

test('AssetAdminRouter handleBrowse calls navigate with correct url', () => {
  const navigate = jest.fn();
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '', state: null },
        navigate,
        params: { folderId: 5 }
      }
    })}
    />
  );
  capturedProps.onBrowse(5, 10, { page: 2 });
  expect(navigate).toHaveBeenCalledWith('/admin/assets/show/5/edit/10?page=2');
});

test('AssetAdminRouter handleBrowse removes page when changing folders', () => {
  const navigate = jest.fn();
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '', state: null },
        navigate,
        params: { folderId: 0 }
      }
    })}
    />
  );
  capturedProps.onBrowse(5, 10, { page: 2 });
  expect(navigate).toHaveBeenCalledWith('/admin/assets/show/5/edit/10');
});

test('AssetAdminRouter handleReplaceUrl calls navigate with replace option', () => {
  const navigate = jest.fn();
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '', state: null },
        navigate,
        params: { folderId: 5 }
      }
    })}
    />
  );
  capturedProps.onReplaceUrl(5, 10, { page: 2 });
  expect(navigate).toHaveBeenCalledWith('/admin/assets/show/5/edit/10?page=2', { replace: true });
});

test('AssetAdminRouter handleResetDetails calls navigate with reset state', () => {
  const navigate = jest.fn();
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '', state: null },
        navigate,
        params: {}
      }
    })}
    />
  );
  capturedProps.resetFileDetails(5, 10, {});
  expect(navigate).toHaveBeenCalledWith(
    '/admin/assets/show/5',
    {
      replace: true,
      state: { reset: true, resetPath: '/admin/assets/show/5/edit/10' }
    }
  );
});

test('AssetAdminRouter getSectionProps passes correct props to AssetAdmin', () => {
  render(
    <AssetAdminRouter {...makeProps({
      router: {
        location: { pathname: '', query: {}, search: '?filter=images', state: null },
        navigate: jest.fn(),
        params: { folderId: 7, fileId: 14, viewAction: 'edit' }
      }
    })}
    />
  );
  expect(capturedProps.sectionConfig).not.toBeNull();
  expect(capturedProps.type).toBe('admin');
  expect(capturedProps.folderId).toBe(7);
  expect(capturedProps.fileId).toBe(14);
  expect(capturedProps.viewAction).toBe('edit');
  expect(capturedProps.query).toEqual({ filter: 'images' });
  expect(typeof capturedProps.getUrl).toBe('function');
  expect(typeof capturedProps.onBrowse).toBe('function');
  expect(typeof capturedProps.onReplaceUrl).toBe('function');
  expect(typeof capturedProps.resetFileDetails).toBe('function');
});

test('buildUrl throws error for invalid action', () => {
  expect(() => {
    buildUrl({
      base: '/admin/assets',
      folderId: 5,
      fileId: null,
      query: {},
      action: 'invalid-action'
    });
  }).toThrow('Invalid action provided: invalid-action');
});

test('buildUrl generates url with create-folder action', () => {
  const url = buildUrl({
    base: '/admin/assets',
    folderId: 5,
    fileId: null,
    query: {},
    action: 'create-folder'
  });
  expect(url).toBe('/admin/assets/show/5/create-folder');
});

test('buildUrl generates url without folderId defaults to 0 for create-folder', () => {
  const url = buildUrl({
    base: '/admin/assets',
    folderId: null,
    fileId: null,
    query: {},
    action: 'create-folder'
  });
  expect(url).toBe('/admin/assets/show/0/create-folder');
});

test('buildUrl generates base url when no folderId or fileId', () => {
  const url = buildUrl({
    base: '/admin/assets',
    folderId: null,
    fileId: null,
    query: {},
    action: null
  });
  expect(url).toBe('/admin/assets');
});

test('buildUrl includes query parameters in url', () => {
  const url = buildUrl({
    base: '/admin/assets',
    folderId: 5,
    fileId: null,
    query: { search: 'test', page: 2 },
    action: null
  });
  expect(url).toContain('search=test');
  expect(url).toContain('page=2');
});

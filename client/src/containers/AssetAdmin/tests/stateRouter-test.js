/* global jest, test, expect, beforeEach */

import React from 'react';
import { render, act } from '@testing-library/react';
import { AssetAdminStateRouter } from '../stateRouter';

let capturedProps;
let renderedFileIds;
beforeEach(() => {
  capturedProps = undefined;
  renderedFileIds = [];
});

function makeProps(obj = {}) {
  return {
    sectionConfig: {
      url: 'admin/assets',
      reactRoutePath: 'admin/assets',
    },
    folderId: 5,
    actions: {
      resetFormStack: jest.fn(),
    },
    Component: (props) => {
      capturedProps = props;
      renderedFileIds.push(props.fileId);
      return <div />;
    },
    ...obj
  };
}

test('AssetAdminStateRouter getSectionProps passes resetFileDetails to AssetAdmin', () => {
  render(<AssetAdminStateRouter {...makeProps()} />);
  expect(typeof capturedProps.resetFileDetails).toBe('function');
  expect(typeof capturedProps.onBrowse).toBe('function');
  expect(typeof capturedProps.getUrl).toBe('function');
});

test('AssetAdminStateRouter handleResetDetails remounts the editor on the same file', () => {
  render(<AssetAdminStateRouter {...makeProps()} />);
  act(() => {
    capturedProps.onBrowse(5, 10, { page: 2 });
  });
  renderedFileIds = [];
  act(() => {
    capturedProps.resetFileDetails(5, 10, { page: 2 });
  });
  // The editor only refetches the record when the file is cleared and then reopened
  expect(renderedFileIds).toEqual([0, 10]);
  expect(capturedProps.folderId).toBe(5);
  expect(capturedProps.fileId).toBe(10);
  expect(capturedProps.query).toEqual({ page: 2 });
});

test('AssetAdminStateRouter handleResetDetails does not reset the form stack', () => {
  const resetFormStack = jest.fn();
  render(<AssetAdminStateRouter {...makeProps({ actions: { resetFormStack } })} />);
  act(() => {
    capturedProps.onBrowse(5, 10, {});
  });
  resetFormStack.mockClear();
  act(() => {
    capturedProps.resetFileDetails(5, 10, {});
  });
  expect(resetFormStack).not.toHaveBeenCalled();
});

test('AssetAdminStateRouter passes initial state and does not pass Component to AssetAdmin', () => {
  render(<AssetAdminStateRouter {...makeProps()} />);
  expect(capturedProps.folderId).toBe(5);
  expect(capturedProps.fileId).toBe(0);
  expect(capturedProps.viewAction).toBe('edit');
  expect(capturedProps.query).toEqual({});
  expect(capturedProps.Component).toBeUndefined();
  expect(capturedProps.sectionConfig.url).toBe('admin/assets');
});

test('AssetAdminStateRouter passes folderId as null when it is not known', () => {
  render(<AssetAdminStateRouter {...makeProps({ folderId: null })} />);
  expect(capturedProps.folderId).toBeNull();
});

test('AssetAdminStateRouter falls back to the fileId prop', () => {
  render(<AssetAdminStateRouter {...makeProps({ fileId: 7 })} />);
  expect(capturedProps.fileId).toBe(7);
});

test('AssetAdminStateRouter onBrowse updates folder, file, query and action', () => {
  render(<AssetAdminStateRouter {...makeProps()} />);
  act(() => {
    capturedProps.onBrowse(6, 11, { q: 'a' }, 'create-folder');
  });
  expect(capturedProps.folderId).toBe(6);
  expect(capturedProps.fileId).toBe(11);
  expect(capturedProps.query).toEqual({ q: 'a' });
  expect(capturedProps.viewAction).toBe('create-folder');
});

test('AssetAdminStateRouter onBrowse defaults query and action', () => {
  render(<AssetAdminStateRouter {...makeProps()} />);
  act(() => {
    capturedProps.onBrowse(6, 11);
  });
  expect(capturedProps.query).toEqual({});
  expect(capturedProps.viewAction).toBe('edit');
});

test('AssetAdminStateRouter onBrowse throws on an invalid action', () => {
  render(<AssetAdminStateRouter {...makeProps()} />);
  expect(() => capturedProps.onBrowse(6, 11, {}, 'bogus')).toThrow('Invalid action provided: bogus');
});

test('AssetAdminStateRouter onBrowse resets the form stack only when the file changes', () => {
  const resetFormStack = jest.fn();
  render(<AssetAdminStateRouter {...makeProps({ actions: { resetFormStack } })} />);
  act(() => {
    capturedProps.onBrowse(5, 10, {});
  });
  expect(resetFormStack).toHaveBeenCalledTimes(1);
  act(() => {
    capturedProps.onBrowse(5, 10, { page: 2 });
  });
  expect(resetFormStack).toHaveBeenCalledTimes(1);
});

test('AssetAdminStateRouter getUrl builds urls for folders and files', () => {
  render(<AssetAdminStateRouter {...makeProps()} />);
  expect(capturedProps.getUrl()).toBe('admin/assets');
  expect(capturedProps.getUrl(5)).toBe('admin/assets/show/5');
  expect(capturedProps.getUrl(5, 10)).toBe('admin/assets/show/5/edit/10');
  expect(capturedProps.getUrl(5, 10, { q: 'a' })).toBe('admin/assets/show/5/edit/10?q=a');
});

test('AssetAdminStateRouter getUrl removes page when on first page or when the folder changes', () => {
  render(<AssetAdminStateRouter {...makeProps()} />);
  expect(capturedProps.getUrl(5, 0, { page: 1 })).toBe('admin/assets/show/5');
  expect(capturedProps.getUrl(5, 0, { page: 3 })).toBe('admin/assets/show/5?page=3');
  expect(capturedProps.getUrl(6, 0, { page: 3 })).toBe('admin/assets/show/6');
});

test('AssetAdminStateRouter getUrl keeps page when the current folder is not known', () => {
  render(<AssetAdminStateRouter {...makeProps({ folderId: null })} />);
  expect(capturedProps.getUrl(6, 0, { page: 3 })).toBe('admin/assets/show/6?page=3');
});

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

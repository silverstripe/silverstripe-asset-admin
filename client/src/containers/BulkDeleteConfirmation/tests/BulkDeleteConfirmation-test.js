/* global jest, jasmine, describe, it, expect, beforeEach, Event */

import React from 'react';
import { Component } from '../BulkDeleteConfirmation';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('BulkDeleteMessage', () => {
  const renderer = new ShallowRenderer();

  const FOLDER = 'folder';
  const FILE = 'file';

  const files = [
    { id: 1, title: 'A folder', type: FOLDER },
    { id: 2, title: 'Another folder', type: FOLDER },
    { id: 3, title: 'image.jpg', type: FILE },
    { id: 4, title: 'document.pdf', type: FILE },
  ];

  let props;

  beforeEach(() => {
    props = {
      loading: false,
      LoadingComponent: () => <p>Loading...</p>,
      transition: false,
      files,
      fileUsage: {},
      onCancel: jest.fn(),
      onModalClose: jest.fn(),
      onConfirm: jest.fn(),
    };
  });


  it('Nothing in use', () => {
    renderer.render(<Component {...props} />);
    const { props: { isOpen, actions } } = renderer.getRenderOutput();

    expect(isOpen).toBe(true);
    expect(actions.length).toBe(2);
    expect(actions[0].label).toBe('Delete');
    expect(actions[1].label).toBe('Cancel');

    actions[0].handler();
    expect(props.onConfirm.mock.calls.length).toBe(1);
    expect(props.onCancel.mock.calls.length).toBe(0);
  });

  it('Folder in use', () => {
    renderer.render(<Component {...props} fileUsage={{ 1: 5 }} />);
    const { props: { isOpen, actions } } = renderer.getRenderOutput();

    expect(isOpen).toBe(true);
    expect(actions.length).toBe(2);
    expect(actions[0].label).toBe('Cancel');

    actions[0].handler();
    expect(props.onConfirm.mock.calls.length).toBe(0);
    expect(props.onCancel.mock.calls.length).toBe(1);
  });

  it('Files in use', () => {
    renderer.render(<Component {...props} fileUsage={{ 3: 5 }} />);
    const { props: { isOpen, actions } } = renderer.getRenderOutput();

    expect(isOpen).toBe(true);
    expect(actions.length).toBe(2);
    expect(actions[0].label).toBe('Cancel');
    expect(actions[1].label).toBe('Delete');

    actions[0].handler();
    expect(props.onConfirm.mock.calls.length).toBe(0);
    expect(props.onCancel.mock.calls.length).toBe(1);
  });
});

/* global jest, test, expect */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Component from '../AddFolderButton';

test('AddFolderButton', () => {
  const onCreateFolder = jest.fn();
  const { container } = render(
    <Component {...{
      canEdit: true,
      onCreateFolder
    }}
    />
  );
  const button = container.querySelector('button#add-folder-button');
  fireEvent.click(button);
  expect(onCreateFolder.mock.calls.length).toBe(1);
});

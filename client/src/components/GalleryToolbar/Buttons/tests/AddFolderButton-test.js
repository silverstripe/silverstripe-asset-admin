/* global jest, test, expect */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Component from '../AddFolderButton';

test('AddFolderButton renders button with correct id', () => {
  const onCreateFolder = jest.fn();
  const { container } = render(
    <Component {...{
      canEdit: true,
      onCreateFolder
    }}
    />
  );
  const button = container.querySelector('button#add-folder-button');
  expect(button).not.toBeNull();
});

test('AddFolderButton renders button with correct CSS classes', () => {
  const onCreateFolder = jest.fn();
  const { container } = render(
    <Component {...{
      canEdit: true,
      onCreateFolder
    }}
    />
  );
  const button = container.querySelector('button#add-folder-button');
  expect(button.classList.contains('btn')).toBe(true);
  expect(button.classList.contains('btn-secondary')).toBe(true);
  expect(button.classList.contains('btn--icon-xl')).toBe(true);
});

test('AddFolderButton renders button with type button', () => {
  const onCreateFolder = jest.fn();
  const { container } = render(
    <Component {...{
      canEdit: true,
      onCreateFolder
    }}
    />
  );
  const button = container.querySelector('button#add-folder-button');
  expect(button.type).toBe('button');
});

test('AddFolderButton renders icon with folder-add class', () => {
  const onCreateFolder = jest.fn();
  const { container } = render(
    <Component {...{
      canEdit: true,
      onCreateFolder
    }}
    />
  );
  const icon = container.querySelector('.font-icon-folder-add');
  expect(icon).not.toBeNull();
  expect(icon.classList.contains('btn__icon')).toBe(true);
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('AddFolderButton renders button text content', () => {
  const onCreateFolder = jest.fn();
  const { container } = render(
    <Component {...{
      canEdit: true,
      onCreateFolder
    }}
    />
  );
  const textSpan = container.querySelector('.btn__text.btn__title');
  expect(textSpan).not.toBeNull();
});

test('AddFolderButton calls onCreateFolder when clicked and canEdit is true', () => {
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

test('AddFolderButton does not call onCreateFolder when canEdit is false', () => {
  const onCreateFolder = jest.fn();
  const { container } = render(
    <Component {...{
      canEdit: false,
      onCreateFolder
    }}
    />
  );
  const button = container.querySelector('button#add-folder-button');
  expect(button.disabled).toBe(true);
});

test('AddFolderButton button is disabled when canEdit is false', () => {
  const onCreateFolder = jest.fn();
  const { container } = render(
    <Component {...{
      canEdit: false,
      onCreateFolder
    }}
    />
  );
  const button = container.querySelector('button#add-folder-button');
  expect(button.disabled).toBe(true);
  fireEvent.click(button);
  expect(onCreateFolder.mock.calls.length).toBe(0);
});

test('AddFolderButton button is enabled when canEdit is true', () => {
  const onCreateFolder = jest.fn();
  const { container } = render(
    <Component {...{
      canEdit: true,
      onCreateFolder
    }}
    />
  );
  const button = container.querySelector('button#add-folder-button');
  expect(button.disabled).toBe(false);
});

test('AddFolderButton handles multiple clicks correctly', () => {
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
  fireEvent.click(button);
  fireEvent.click(button);
  expect(onCreateFolder.mock.calls.length).toBe(3);
});

test('AddFolderButton prevents default event behavior', () => {
  const onCreateFolder = jest.fn();
  const { container } = render(
    <Component {...{
      canEdit: true,
      onCreateFolder
    }}
    />
  );
  const button = container.querySelector('button#add-folder-button');
  const event = new MouseEvent('click', { bubbles: true });
  event.preventDefault = jest.fn();
  fireEvent(button, event);
  expect(onCreateFolder).toHaveBeenCalled();
});

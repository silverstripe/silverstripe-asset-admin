/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryItem from '../HistoryItem';

function makeProps(obj = {}) {
  return {
    versionid: 1,
    summary: 'Test summary',
    status: 'Draft',
    author: 'John Doe',
    date_formatted: '2024-01-15 10:30:00',
    date_ago: '2 days ago',
    onClick: jest.fn(),
    ...obj
  };
}

test('HistoryItem renders with basic props', () => {
  const { container } = render(<HistoryItem {...makeProps()} />);
  const listItem = container.querySelector('.history-item');
  expect(listItem).not.toBeNull();
  expect(listItem.classList.contains('list-group-item')).toBe(true);
});

test('HistoryItem displays version number', () => {
  render(<HistoryItem {...makeProps({ versionid: 42 })} />);
  expect(screen.getByText('v.42')).not.toBeNull();
});

test('HistoryItem displays date_ago and author', () => {
  render(<HistoryItem {...makeProps({ date_ago: '3 hours ago', author: 'Jane Smith' })} />);
  expect(screen.getByText(/3 hours ago Jane Smith/)).not.toBeNull();
});

test('HistoryItem displays summary', () => {
  render(<HistoryItem {...makeProps({ summary: 'Updated content' })} />);
  expect(screen.getByText('Updated content')).not.toBeNull();
});

test('HistoryItem handles onClick callback', () => {
  const onClick = jest.fn();
  const { container } = render(<HistoryItem {...makeProps({ versionid: 5, onClick })} />);
  const listItem = container.querySelector('.history-item');
  fireEvent.click(listItem);
  expect(onClick).toHaveBeenCalledWith(5);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('HistoryItem does not show published line for Draft status', () => {
  const { container } = render(<HistoryItem {...makeProps({ status: 'Draft' })} />);
  expect(container.querySelector('.history-item__status-flag')).toBeNull();
});

test('HistoryItem shows published line for Published status', () => {
  render(<HistoryItem {...makeProps({ status: 'Published', date_formatted: '2024-01-15 10:30:00' })} />);
  const statusFlag = screen.getByText('Published');
  expect(statusFlag).not.toBeNull();
  expect(statusFlag.classList.contains('history-item__status-flag')).toBe(true);
  expect(screen.getByText(/at 2024-01-15 10:30:00/)).not.toBeNull();
});

test('HistoryItem prevents default on click', () => {
  const onClick = jest.fn();
  const { container } = render(<HistoryItem {...makeProps({ onClick })} />);
  const listItem = container.querySelector('.history-item');
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
  listItem.dispatchEvent(event);
  expect(preventDefaultSpy).toHaveBeenCalled();
});

test('HistoryItem handles summary as boolean false', () => {
  const { container } = render(<HistoryItem {...makeProps({ summary: false })} />);
  expect(container.querySelector('.history-item')).not.toBeNull();
});

test('HistoryItem renders without onClick prop', () => {
  const { container } = render(<HistoryItem {...makeProps({ onClick: undefined })} />);
  const listItem = container.querySelector('.history-item');
  expect(() => {
    fireEvent.click(listItem);
  }).not.toThrow();
});

test('HistoryItem renders without optional props', () => {
  const { container } = render(
    <HistoryItem
      {...makeProps({
        status: undefined,
        author: undefined,
        date_formatted: undefined,
        date_ago: undefined,
        onClick: undefined,
      })}
    />
  );
  expect(container.querySelector('.history-item')).not.toBeNull();
});

test('HistoryItem displays correct version class', () => {
  const { container } = render(<HistoryItem {...makeProps({ versionid: 99 })} />);
  const versionSpan = container.querySelector('.history-item__version');
  expect(versionSpan).not.toBeNull();
  expect(versionSpan.textContent).toBe('v.99');
});

test('HistoryItem displays correct date class', () => {
  const { container } = render(<HistoryItem {...makeProps({ date_ago: '1 week ago', author: 'Admin' })} />);
  const dateSpan = container.querySelector('.history-item__date');
  expect(dateSpan).not.toBeNull();
  expect(dateSpan.textContent).toBe('1 week ago Admin');
});

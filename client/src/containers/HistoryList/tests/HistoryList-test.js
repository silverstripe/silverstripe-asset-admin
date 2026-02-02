/* global jest, test, expect, afterEach */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Component as HistoryList } from '../HistoryList';

jest.mock('lib/Backend');
jest.mock('lib/Config');
jest.mock('containers/FormBuilderLoader/FormBuilderLoader', () => ({
  __esModule: true,
  default: ({ schemaUrl }) => <div data-testid="form-builder-loader" data-schema-url={schemaUrl}>FormBuilderLoader</div>,
}));
jest.mock('containers/HistoryList/HistoryItem', () => ({
  __esModule: true,
  default: ({ versionid, onClick }) => (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li data-testid={`history-item-${versionid}`} onClick={() => onClick(versionid)}>
      History Item {versionid}
    </li>
  ),
}));

const mockApi = jest.fn();

jest.mock('lib/Backend', () => ({
  __esModule: true,
  default: {
    createEndpointFetcher: jest.fn(() => mockApi),
  },
}));

jest.mock('lib/Config', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => 'mock-security-id'),
  },
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

function makeProps(obj = {}) {
  return {
    sectionConfig: {
      endpoints: {
        history: {
          url: '/admin/assets/api/history',
          method: 'GET',
        },
      },
      form: {
        fileHistoryForm: {
          schemaUrl: '/admin/assets/schema/history',
        },
      },
    },
    historySchemaUrl: '/admin/assets/schema/history',
    data: {
      fileId: 123,
      latestVersionId: 5,
    },
    ...obj
  };
}

test('HistoryList renders loading state initially', () => {
  const { container } = render(<HistoryList {...makeProps()} />);
  expect(screen.getByText('Loading...')).not.toBeNull();
  const loadingDiv = container.querySelector('.history-list--loading');
  expect(loadingDiv).not.toBeNull();
});

test('HistoryList fetches history on mount', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
    { versionid: 2, summary: 'Second version' },
  ]);
  render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(mockApi).toHaveBeenCalledWith({ fileId: 123 });
  });
  jest.useRealTimers();
});

test('HistoryList renders history list after loading', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
    { versionid: 2, summary: 'Second version' },
  ]);
  render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(screen.getByTestId('history-item-1')).not.toBeNull();
  });
  expect(screen.getByTestId('history-item-2')).not.toBeNull();
  const listGroup = document.querySelector('.list-group');
  expect(listGroup).not.toBeNull();
  expect(listGroup.classList.contains('list-group-flush')).toBe(true);
  expect(listGroup.classList.contains('history-list__list')).toBe(true);
  jest.useRealTimers();
});

test('HistoryList handles empty history list', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([]);
  const { container } = render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(container.querySelector('.history-list__list')).not.toBeNull();
  });
  const items = container.querySelectorAll('[data-testid^="history-item-"]');
  expect(items.length).toBe(0);
  jest.useRealTimers();
});

test('HistoryList shows detail view when item clicked', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
    { versionid: 2, summary: 'Second version' },
  ]);
  render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(screen.getByTestId('history-item-1')).not.toBeNull();
  });
  const item = screen.getByTestId('history-item-1');
  fireEvent.click(item);
  await waitFor(() => {
    expect(screen.getByTestId('form-builder-loader')).not.toBeNull();
  });
  jest.useRealTimers();
});

test('HistoryList renders back button in detail view', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
  ]);
  render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(screen.getByTestId('history-item-1')).not.toBeNull();
  });
  const item = screen.getByTestId('history-item-1');
  fireEvent.click(item);
  await waitFor(() => {
    const backButton = document.querySelector('.history-list__back');
    expect(backButton).not.toBeNull();
    expect(backButton.classList.contains('btn')).toBe(true);
    expect(backButton.classList.contains('btn-secondary')).toBe(true);
    expect(backButton.classList.contains('btn--icon-xl')).toBe(true);
    expect(backButton.classList.contains('btn--no-text')).toBe(true);
  });
  jest.useRealTimers();
});

test('HistoryList back button returns to list view', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
  ]);
  render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(screen.getByTestId('history-item-1')).not.toBeNull();
  });
  const item = screen.getByTestId('history-item-1');
  fireEvent.click(item);
  await waitFor(() => {
    expect(screen.getByTestId('form-builder-loader')).not.toBeNull();
  });
  const backButton = document.querySelector('.history-list__back');
  fireEvent.click(backButton);
  await waitFor(() => {
    expect(screen.getByTestId('history-item-1')).not.toBeNull();
  });
  jest.useRealTimers();
});

test('HistoryList back button prevents default action', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
  ]);
  render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(screen.getByTestId('history-item-1')).not.toBeNull();
  });
  const item = screen.getByTestId('history-item-1');
  fireEvent.click(item);
  await waitFor(() => {
    expect(screen.getByTestId('form-builder-loader')).not.toBeNull();
  });
  const backButton = document.querySelector('.history-list__back');
  await waitFor(() => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    backButton.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
  jest.useRealTimers();
});

test('HistoryList renders FormBuilderLoader with correct schemaUrl', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 3, summary: 'Third version' },
  ]);
  render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(screen.getByTestId('history-item-3')).not.toBeNull();
  });
  const item = screen.getByTestId('history-item-3');
  fireEvent.click(item);
  await waitFor(() => {
    const formBuilder = screen.getByTestId('form-builder-loader');
    expect(formBuilder.getAttribute('data-schema-url')).toBe('/admin/assets/schema/history/123/3');
  });
  jest.useRealTimers();
});

test('HistoryList refreshes when fileId changes', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
  ]);
  const { rerender } = render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(mockApi).toHaveBeenCalledWith({ fileId: 123 });
  });
  mockApi.mockClear();
  mockApi.mockResolvedValueOnce([
    { versionid: 2, summary: 'Second version' },
  ]);
  rerender(<HistoryList {...makeProps({ data: { fileId: 456, latestVersionId: 5 } })} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(mockApi).toHaveBeenCalledWith({ fileId: 456 });
  });
  jest.useRealTimers();
});

test('HistoryList refreshes when latestVersionId changes', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
  ]);
  const { rerender } = render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(mockApi).toHaveBeenCalledWith({ fileId: 123 });
  });
  mockApi.mockClear();
  mockApi.mockResolvedValueOnce([
    { versionid: 2, summary: 'Second version' },
  ]);
  rerender(<HistoryList {...makeProps({ data: { fileId: 123, latestVersionId: 8 } })} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(mockApi).toHaveBeenCalledWith({ fileId: 123 });
  });
  jest.useRealTimers();
});

test('HistoryList does not refresh when props unchanged', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
  ]);
  const { rerender } = render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(mockApi).toHaveBeenCalledWith({ fileId: 123 });
  });
  mockApi.mockClear();
  rerender(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  expect(mockApi).not.toHaveBeenCalled();
  jest.useRealTimers();
});

test('HistoryList renders with default data prop', () => {
  const props = makeProps({ data: undefined });
  const { container } = render(<HistoryList {...props} />);
  expect(container.querySelector('.history-list--loading')).not.toBeNull();
});

test('HistoryList back button has correct accessibility attributes', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
  ]);
  render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(screen.getByTestId('history-item-1')).not.toBeNull();
  });
  const item = screen.getByTestId('history-item-1');
  fireEvent.click(item);
  await waitFor(() => {
    const backButton = document.querySelector('.history-list__back');
    expect(backButton.getAttribute('title')).toBe('Back to history list');
    expect(backButton.getAttribute('aria-label')).toBe('Back to history list');
  });
  jest.useRealTimers();
});

test('HistoryList back button renders icon with aria-hidden', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
  ]);
  render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(screen.getByTestId('history-item-1')).not.toBeNull();
  });
  const item = screen.getByTestId('history-item-1');
  fireEvent.click(item);
  await waitFor(() => {
    const icon = document.querySelector('.font-icon-left-open-big');
    expect(icon).not.toBeNull();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });
  jest.useRealTimers();
});

test('HistoryList renders FormBuilderLoader with correct formTag', async () => {
  jest.useFakeTimers();
  mockApi.mockResolvedValueOnce([
    { versionid: 1, summary: 'First version' },
  ]);
  render(<HistoryList {...makeProps()} />);
  jest.advanceTimersByTime(250);
  await waitFor(() => {
    expect(screen.getByTestId('history-item-1')).not.toBeNull();
  });
  const item = screen.getByTestId('history-item-1');
  fireEvent.click(item);
  await waitFor(() => {
    expect(screen.getByTestId('form-builder-loader')).not.toBeNull();
  });
  jest.useRealTimers();
});

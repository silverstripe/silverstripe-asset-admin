/* global jest, test, expect, afterEach */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Component as BulkActions } from '../BulkActions';

jest.mock('jquery', () => {
  const jqueryMock = {
    find: () => jqueryMock,
    change: () => jqueryMock,
    val: () => jqueryMock,
    trigger: () => null,
    chosen: () => null,
    on: () => null,
    off: () => null,
  };
  return () => jqueryMock;
});

function makeProps(obj = {}) {
  return {
    items: [],
    actions: [],
    onClearSelection: jest.fn(),
    onSelectAll: jest.fn(),
    ActionMenu: null,
    showCount: true,
    ...obj
  };
}

test('BulkActions canApply() shows an action button when canApply returns true', async () => {
  const { container } = render(
    <BulkActions {...makeProps({
      actions: [
        {
          value: 'action-with-apply',
          label: '',
          canApply: (items) => items.filter(item => item.applies).length,
          callback: () => true,
        },
        {
          value: 'action-without-apply',
          label: '',
          callback: () => true,
        },
      ],
      items: [{ applies: true }],
    })}
    />
  );
  const actions = container.querySelectorAll('.bulk-actions__action');
  expect(actions).toHaveLength(2);
  expect(actions[0].getAttribute('value')).toBe('action-with-apply');
  expect(actions[1].getAttribute('value')).toBe('action-without-apply');
});

test('BulkActions canApply() shows an action button when canApply returns false', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      actions: [
        {
          value: 'action-with-apply',
          label: '',
          canApply: (items) => items.filter(item => item.applies).length,
          callback: () => true,
        },
        {
          value: 'action-without-apply',
          label: '',
          callback: () => true,
        },
      ],
      items: [{ applies: false }],
    })}
    />
  );
  const actions = container.querySelectorAll('.bulk-actions__action');
  expect(actions).toHaveLength(1);
  expect(actions[0].getAttribute('value')).toBe('action-without-apply');
});

test('BulkActions getOptionsByValue() should return the option which matches the given value', async () => {
  let doResolve;
  const promise = new Promise((resolve) => {
    doResolve = resolve;
  });
  const { container } = render(
    <BulkActions {...makeProps({
      actions: [
        {
          value: 'my-first-action',
          label: 'My First Action',
          callback: () => doResolve(),
        },
      ],
      items: [{ applies: true }],
    })}
    />
  );
  const action = container.querySelector('.bulk-actions__action');
  fireEvent.click(action);
  await promise;
  expect(container.querySelector('.bulk-actions__action').getAttribute('value')).toBe('my-first-action');
});

test('BulkActions returns null when no items selected', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      items: [],
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          callback: () => true,
        },
      ],
    })}
    />
  );
  expect(container.firstChild).toBeNull();
});

test('BulkActions returns null when no actions can be applied', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ applies: false }],
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          canApply: (items) => items.filter(item => item.applies).length,
          callback: () => true,
        },
      ],
    })}
    />
  );
  expect(container.firstChild).toBeNull();
});

test('BulkActions displays selection count when showCount is true', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }, { id: 2 }, { id: 3 }],
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          callback: () => true,
        },
      ],
      showCount: true,
    })}
    />
  );
  const counter = container.querySelector('.bulk-actions-counter');
  expect(counter).not.toBeNull();
  expect(counter.textContent).toContain('3 selected');
});

test('BulkActions does not display selection count when showCount is false', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          callback: () => true,
        },
      ],
      showCount: false,
    })}
    />
  );
  const counter = container.querySelector('.bulk-actions-counter');
  expect(counter).toBeNull();
});

test('BulkActions calls onClearSelection when clear button is clicked', () => {
  const onClearSelection = jest.fn();
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          callback: () => true,
        },
      ],
      onClearSelection,
      showCount: true,
    })}
    />
  );
  const clearButton = container.querySelector('.bulk-actions-counter');
  fireEvent.click(clearButton);
  expect(onClearSelection).toHaveBeenCalled();
});

test('BulkActions calls onSelectAll when select all button is clicked', () => {
  const onSelectAll = jest.fn();
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          callback: () => true,
        },
      ],
      onSelectAll,
      showCount: true,
    })}
    />
  );
  const selectAllButton = container.querySelector('.bulk-actions-select-all button');
  fireEvent.click(selectAllButton);
  expect(onSelectAll).toHaveBeenCalled();
});

test('BulkActions displays first two actions as buttons and rest as dropdown items', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'action-1',
          label: 'Action 1',
          callback: () => true,
        },
        {
          value: 'action-2',
          label: 'Action 2',
          callback: () => true,
        },
        {
          value: 'action-3',
          label: 'Action 3',
          callback: () => true,
        },
        {
          value: 'action-4',
          label: 'Action 4',
          callback: () => true,
        },
        {
          value: 'action-5',
          label: 'Action 5',
          callback: () => true,
        },
      ],
    })}
    />
  );
  const buttons = container.querySelectorAll('.bulk-actions__action.btn');
  const moreItems = container.querySelectorAll('.bulk-actions__action--more');
  expect(buttons).toHaveLength(2);
  expect(moreItems).toHaveLength(2);
});

test('BulkActions action callback is called with items when clicked', async () => {
  const callback = jest.fn(() => Promise.resolve());
  const items = [{ id: 1 }, { id: 2 }];
  const { container } = render(
    <BulkActions {...makeProps({
      items,
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          callback,
        },
      ],
    })}
    />
  );
  const action = container.querySelector('.bulk-actions__action');
  fireEvent.click(action);
  await waitFor(() => {
    expect(callback).toHaveBeenCalledWith(expect.any(Object), items);
  });
});

test('BulkActions confirm callback is called before callback', async () => {
  const confirmFn = jest.fn(() => Promise.resolve());
  const callbackFn = jest.fn(() => Promise.resolve());
  const items = [{ id: 1 }];
  const { container } = render(
    <BulkActions {...makeProps({
      items,
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          confirm: confirmFn,
          callback: callbackFn,
        },
      ],
    })}
    />
  );
  const action = container.querySelector('.bulk-actions__action');
  fireEvent.click(action);
  await waitFor(() => {
    expect(confirmFn).toHaveBeenCalledWith(items);
    expect(callbackFn).toHaveBeenCalled();
  });
});

test('BulkActions does not call callback when confirm rejects', async () => {
  const confirmFn = jest.fn(() => Promise.reject('cancelled'));
  const callbackFn = jest.fn(() => Promise.resolve());
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          confirm: confirmFn,
          callback: callbackFn,
        },
      ],
    })}
    />
  );
  const action = container.querySelector('.bulk-actions__action');
  fireEvent.click(action);
  await waitFor(() => {
    expect(callbackFn).not.toHaveBeenCalled();
  });
});

test('BulkActions action with custom color and icon', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'delete-action',
          label: 'Delete',
          color: 'danger',
          icon: 'trash',
          callback: () => true,
        },
      ],
    })}
    />
  );
  const action = container.querySelector('.bulk-actions__action');
  expect(action).not.toBeNull();
  expect(action.getAttribute('value')).toBe('delete-action');
});

test('BulkActions action with custom className', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'custom-action',
          label: 'Custom',
          className: 'custom-class',
          callback: () => true,
        },
      ],
    })}
    />
  );
  const action = container.querySelector('.bulk-actions__action');
  expect(action.classList.contains('custom-class')).toBe(true);
});

test('BulkActions uses default icon when none specified', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'action-1',
          label: 'Action 1',
          callback: () => true,
        },
        {
          value: 'action-2',
          label: 'Action 2',
          callback: () => true,
        },
        {
          value: 'action-3',
          label: 'Action 3',
          callback: () => true,
        },
        {
          value: 'action-4',
          label: 'Action 4',
          callback: () => true,
        },
      ],
    })}
    />
  );
  const dropdownItem = container.querySelector('.bulk-actions__action--more');
  expect(dropdownItem).not.toBeNull();
  const icon = dropdownItem.querySelector('[aria-hidden="true"]');
  expect(icon).not.toBeNull();
  expect(icon.classList.contains('font-icon-info-circled')).toBe(true);
});

test('BulkActions action item at index 2 is not marked as --more', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'action-1',
          label: 'Action 1',
          callback: () => true,
        },
        {
          value: 'action-2',
          label: 'Action 2',
          callback: () => true,
        },
        {
          value: 'action-3',
          label: 'Action 3',
          callback: () => true,
        },
      ],
    })}
    />
  );
  const allActions = container.querySelectorAll('.bulk-actions__action');
  const thirdAction = allActions[2];
  expect(thirdAction).not.toBeNull();
  expect(thirdAction.classList.contains('bulk-actions__action--more')).toBe(false);
});

test('BulkActions does not render ActionMenu when there are no items > 2', () => {
  const mockActionMenu = jest.fn(() => <div data-testid="action-menu">Menu</div>);
  const { queryByTestId } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'action-1',
          label: 'Action 1',
          callback: () => true,
        },
        {
          value: 'action-2',
          label: 'Action 2',
          callback: () => true,
        },
      ],
      ActionMenu: mockActionMenu,
    })}
    />
  );
  expect(queryByTestId('action-menu')).toBeNull();
  expect(mockActionMenu).not.toHaveBeenCalled();
});

test('BulkActions renders ActionMenu when there are items > 2', () => {
  const mockActionMenu = jest.fn(({ children }) => (
    <div data-testid="action-menu">{children}</div>
  ));
  const { queryByTestId } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'action-1',
          label: 'Action 1',
          callback: () => true,
        },
        {
          value: 'action-2',
          label: 'Action 2',
          callback: () => true,
        },
        {
          value: 'action-3',
          label: 'Action 3',
          callback: () => true,
        },
      ],
      ActionMenu: mockActionMenu,
    })}
    />
  );
  expect(queryByTestId('action-menu')).not.toBeNull();
  expect(mockActionMenu).toHaveBeenCalled();
});

test('BulkActions getOptionByValue finds option by closest button element', async () => {
  const callback = jest.fn(() => Promise.resolve());
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'test-action',
          label: 'Test Label',
          callback,
        },
      ],
    })}
    />
  );
  const button = container.querySelector('.bulk-actions__action');
  const buttonLabel = button.querySelector('span') || button.firstChild;
  fireEvent.click(buttonLabel);
  await waitFor(() => {
    expect(callback).toHaveBeenCalled();
  });
});

test('BulkActions callback without confirm resolves when callback returns nothing', async () => {
  const callback = jest.fn(() => null);
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          callback,
        },
      ],
    })}
    />
  );
  const action = container.querySelector('.bulk-actions__action');
  fireEvent.click(action);
  await waitFor(() => {
    expect(callback).toHaveBeenCalled();
  });
});

test('BulkActions renders component with correct main class', () => {
  const { container } = render(
    <BulkActions {...makeProps({
      items: [{ id: 1 }],
      actions: [
        {
          value: 'test-action',
          label: 'Test',
          callback: () => true,
        },
      ],
    })}
    />
  );
  const bulkActionsContainer = container.querySelector('.bulk-actions');
  expect(bulkActionsContainer).not.toBeNull();
  expect(bulkActionsContainer.classList.contains('fieldholder-small')).toBe(true);
});

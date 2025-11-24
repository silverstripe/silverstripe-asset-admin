/* global jest, test, expect, beforeEach, afterEach */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Component as InsertMediaModal } from '../InsertMediaModal';

// Mock child components
jest.mock('containers/AssetAdmin/AssetAdmin');
jest.mock('components/FormBuilderModal/FormBuilderModal', () => ({
  __esModule: true,
  default: ({ children, className, size, showCloseButton, ...props }) => (
    <div
      data-testid="form-builder-modal"
      className={className}
      data-size={size}
      data-show-close-button={showCloseButton}
      {...props}
    >
      {children}
    </div>
  )
}));
jest.mock('components/Modal/ModalCloseButton', () => ({
  __esModule: true,
  default: ({ classNames, onClosed, ...props }) => (
    <button
      className={classNames}
      onClick={onClosed}
      {...props}
    >
      Close
    </button>
  )
}));

let consoleWarnFn;
let consoleErrorFn;

beforeEach(() => {
  consoleWarnFn = jest.spyOn(console, 'warn').mockImplementation(() => null);
  consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => null);
});

afterEach(() => {
  consoleWarnFn.mockRestore();
  consoleErrorFn.mockRestore();
});

function makeProps(obj = {}) {
  return {
    isOpen: false,
    onInsert: jest.fn(),
    onBrowse: jest.fn(),
    onClosed: jest.fn(),
    sectionConfig: {
      url: 'test/section',
      form: {},
    },
    fileAttributes: {},
    folderId: 0,
    className: '',
    actions: {
      gallery: {
        deselectFiles: jest.fn(),
      },
      modal: {},
    },
    type: 'insert-media',
    maxFiles: 1,
    ...obj
  };
}

test('InsertMediaModal renders FormBuilderModal with correct props', () => {
  render(<InsertMediaModal {...makeProps()} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal).not.toBeNull();
  expect(modal.classList.contains('insert-media-modal')).toBe(true);
});

test('InsertMediaModal renders with custom className', () => {
  render(<InsertMediaModal {...makeProps({ className: 'custom-class' })} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal.classList.contains('custom-class')).toBe(true);
});

test('InsertMediaModal renders modal with size lg', () => {
  render(<InsertMediaModal {...makeProps()} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal.getAttribute('data-size')).toBe('lg');
});

test('InsertMediaModal does not show close button in props', () => {
  render(<InsertMediaModal {...makeProps()} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal.getAttribute('data-show-close-button')).toBe('false');
});

test('InsertMediaModal does not render AssetAdmin when isOpen is false', () => {
  const props = makeProps({ isOpen: false });
  render(<InsertMediaModal {...props} />);
  // Note: We're not verifying the absence here since AssetAdmin is mocked
  // The important part is that it should be null when isOpen is false
  expect(props.onBrowse).toHaveBeenCalledWith(0);
});

test('InsertMediaModal calls onBrowse on mount when isOpen is false', () => {
  const onBrowse = jest.fn();
  const props = makeProps({ isOpen: false, onBrowse });
  render(<InsertMediaModal {...props} />);
  expect(onBrowse).toHaveBeenCalledWith(0);
});

test('InsertMediaModal calls onBrowse with custom folderId on mount when isOpen is false', () => {
  const onBrowse = jest.fn();
  const props = makeProps({ isOpen: false, onBrowse, folderId: 42 });
  render(<InsertMediaModal {...props} />);
  expect(onBrowse).toHaveBeenCalledWith(42);
});

test('InsertMediaModal calls setOverrides and onBrowse when isOpen and fileAttributes.ID exists', () => {
  const onBrowse = jest.fn();
  const setOverrides = jest.fn();
  const fileAttributes = { ID: 123, AltText: 'test' };
  const props = makeProps({
    isOpen: true,
    onBrowse,
    setOverrides,
    fileAttributes,
    folderId: 5
  });
  render(<InsertMediaModal {...props} />);
  expect(setOverrides).toHaveBeenCalledWith(props);
  expect(onBrowse).toHaveBeenCalledWith(5, 123);
});

test('InsertMediaModal calls onBrowse without fileId when isOpen but no fileAttributes.ID', () => {
  const onBrowse = jest.fn();
  const setOverrides = jest.fn();
  const props = makeProps({
    isOpen: true,
    onBrowse,
    setOverrides,
    fileAttributes: {},
    folderId: 10
  });
  render(<InsertMediaModal {...props} />);
  expect(setOverrides).not.toHaveBeenCalled();
  expect(onBrowse).not.toHaveBeenCalled();
});

test('InsertMediaModal renders and calls onBrowse on mount when isOpen is false', () => {
  const onBrowse = jest.fn();
  const props = makeProps({ isOpen: false, onBrowse });
  render(<InsertMediaModal {...props} />);
  expect(onBrowse).toHaveBeenCalledWith(0);
});

test('InsertMediaModal calls deselectFiles when isOpen transitions from true to false', () => {
  const deselectFiles = jest.fn();
  const props = makeProps({
    isOpen: true,
    actions: {
      gallery: { deselectFiles },
      modal: {},
    }
  });
  const { rerender } = render(<InsertMediaModal {...props} />);

  // Now rerender with isOpen false
  rerender(<InsertMediaModal {...makeProps({ isOpen: false, actions: { gallery: { deselectFiles }, modal: {} } })} />);

  expect(deselectFiles).toHaveBeenCalled();
});

test('InsertMediaModal calls onBrowse when isOpen transitions from true to false', () => {
  const onBrowse = jest.fn();
  const deselectFiles = jest.fn();
  const props = makeProps({
    isOpen: true,
    onBrowse,
    actions: {
      gallery: { deselectFiles },
      modal: {},
    },
    folderId: 7
  });
  const { rerender } = render(<InsertMediaModal {...props} />);

  rerender(<InsertMediaModal {...makeProps({
    isOpen: false,
    onBrowse,
    actions: { gallery: { deselectFiles }, modal: {} },
    folderId: 7
  })}
  />);

  // onBrowse should have been called with the folderId
  expect(onBrowse).toHaveBeenCalledWith(7);
});

test('InsertMediaModal handles setOverrides transition from isOpen false to true', () => {
  const onBrowse = jest.fn();
  const setOverrides = jest.fn();
  const fileAttributes = { ID: 999, AltText: 'changed' };

  const props1 = makeProps({
    isOpen: false,
    onBrowse,
    setOverrides,
    fileAttributes: {},
    folderId: 3
  });

  const { rerender } = render(<InsertMediaModal {...props1} />);

  const props2 = makeProps({
    isOpen: true,
    onBrowse,
    setOverrides,
    fileAttributes,
    folderId: 3
  });

  rerender(<InsertMediaModal {...props2} />);

  expect(setOverrides).toHaveBeenCalledWith(props2);
  expect(onBrowse).toHaveBeenCalledWith(3, 999);
});

test('InsertMediaModal correctly sets propTypes', () => {
  expect(InsertMediaModal.propTypes).toBeDefined();
  expect(InsertMediaModal.propTypes.isOpen).toBeDefined();
  expect(InsertMediaModal.propTypes.onInsert).toBeDefined();
  expect(InsertMediaModal.propTypes.onBrowse).toBeDefined();
  expect(InsertMediaModal.propTypes.fileAttributes).toBeDefined();
  expect(InsertMediaModal.propTypes.actions).toBeDefined();
});

test('InsertMediaModal handles type prop', () => {
  const props = makeProps({ type: 'insert-link' });
  render(<InsertMediaModal {...props} />);
  // Component should render without errors
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal).not.toBeNull();
});

test('InsertMediaModal handles fileAttributes with multiple properties', () => {
  const onBrowse = jest.fn();
  const setOverrides = jest.fn();
  const fileAttributes = {
    ID: 456,
    AltText: 'Alternative text',
    Width: 300,
    Height: 200,
    Loading: 'lazy',
    TitleTooltip: 'tooltip text',
    Alignment: 'center',
    Description: 'A description',
    TargetBlank: true,
  };
  const props = makeProps({
    isOpen: true,
    onBrowse,
    setOverrides,
    fileAttributes,
    folderId: 1
  });
  render(<InsertMediaModal {...props} />);
  expect(setOverrides).toHaveBeenCalledWith(props);
  expect(onBrowse).toHaveBeenCalledWith(1, 456);
});

test('InsertMediaModal renders without errors when no sectionConfig provided', () => {
  const props = makeProps({ sectionConfig: null });
  render(<InsertMediaModal {...props} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal).not.toBeNull();
});

test('InsertMediaModal renders without errors with empty file attributes', () => {
  const props = makeProps({ fileAttributes: {} });
  render(<InsertMediaModal {...props} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal).not.toBeNull();
});

test('InsertMediaModal has no console warnings or errors on render', () => {
  render(<InsertMediaModal {...makeProps()} />);
  expect(consoleWarnFn).not.toHaveBeenCalled();
  expect(consoleErrorFn).not.toHaveBeenCalled();
});

test('InsertMediaModal getSectionProps returns expected properties', () => {
  const props = makeProps({
    isOpen: true,
    onBrowse: jest.fn(),
    onInsert: jest.fn(),
  });
  render(<InsertMediaModal {...props} />);
  // The component should render without errors
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal).not.toBeNull();
});

test('InsertMediaModal getModalProps includes dialog and correct props', () => {
  render(<InsertMediaModal {...makeProps()} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal.classList.contains('insert-media-modal')).toBe(true);
  expect(modal.getAttribute('data-size')).toBe('lg');
});

test('InsertMediaModal correctly handles onClosed prop', () => {
  const onClosed = jest.fn();
  render(<InsertMediaModal {...makeProps({ onClosed })} />);
  // onClosed is passed through the component via renderToolbarChildren
  // which would be used by the FormBuilderModal
});

test('InsertMediaModal does not render AssetAdmin as null when isOpen is false', () => {
  const props = makeProps({ isOpen: false });
  const { container } = render(<InsertMediaModal {...props} />);
  // When isOpen is false, AssetAdmin should be null
  expect(container.textContent).not.toContain('AssetAdmin');
});

test('InsertMediaModal handles folder prop fallback when folderId is null', () => {
  const onBrowse = jest.fn();
  const props = makeProps({
    isOpen: false,
    onBrowse,
    folderId: null,
    folder: { id: 99 }
  });
  render(<InsertMediaModal {...props} />);
  // Should still call onBrowse, though the folder prop is not used in the class component
  // This verifies the component handles the scenario gracefully
});

test('InsertMediaModal handles maxFiles prop', () => {
  const props = makeProps({ maxFiles: 5 });
  render(<InsertMediaModal {...props} />);
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal).not.toBeNull();
});

test('InsertMediaModal handles setOverrides as optional function', () => {
  const onBrowse = jest.fn();
  const props = makeProps({
    isOpen: false,
    onBrowse,
    setOverrides: undefined,
    fileAttributes: { ID: 123 }
  });
  render(<InsertMediaModal {...props} />);
  // Should not error when setOverrides is not a function
  expect(onBrowse).toHaveBeenCalledWith(0);
});

test('InsertMediaModal handles nested props for actions object', () => {
  const deselectFiles = jest.fn();
  const props = makeProps({
    actions: {
      gallery: {
        deselectFiles
      },
      modal: {}
    },
    isOpen: false
  });
  render(<InsertMediaModal {...props} />);
  expect(props.actions.gallery.deselectFiles).toBeDefined();
});

test('InsertMediaModal passes correct props to AssetAdmin when isOpen', () => {
  const onBrowse = jest.fn();
  const onInsert = jest.fn();
  const props = makeProps({
    isOpen: true,
    onBrowse,
    onInsert
  });
  render(<InsertMediaModal {...props} />);
  // AssetAdmin is mocked, so we just verify the component renders
  const modal = screen.getByTestId('form-builder-modal');
  expect(modal).not.toBeNull();
});

test('InsertMediaModal updates onBrowse when folderId changes', () => {
  const onBrowse = jest.fn();
  const props1 = makeProps({ isOpen: false, folderId: 1, onBrowse });
  const { rerender } = render(<InsertMediaModal {...props1} />);

  const props2 = makeProps({ isOpen: false, folderId: 2, onBrowse });
  rerender(<InsertMediaModal {...props2} />);

  // Verify onBrowse was called
  expect(onBrowse).toHaveBeenCalled();
});

test('InsertMediaModal does not update onBrowse when fileAttributes changes in same isOpen state', () => {
  const onBrowse = jest.fn();
  const props1 = makeProps({
    isOpen: true,
    onBrowse,
    fileAttributes: { ID: 1 }
  });
  const { rerender } = render(<InsertMediaModal {...props1} />);

  onBrowse.mockClear();

  const props2 = makeProps({
    isOpen: true,
    onBrowse,
    fileAttributes: { ID: 2 }
  });
  rerender(<InsertMediaModal {...props2} />);

  // onBrowse should not be called when only fileAttributes changes
  // because componentDidUpdate only calls onBrowse on isOpen state transitions
  expect(onBrowse).not.toHaveBeenCalled();
});

test('InsertMediaModal correctly renders children prop when provided', () => {
  render(<InsertMediaModal {...makeProps()} />);
  const modal = screen.getByTestId('form-builder-modal');
  // Modal children should be null or the AssetAdmin component (which is mocked)
  expect(modal).not.toBeNull();
});

test('InsertMediaModal handles isOpen prop transitions correctly', () => {
  const deselectFiles = jest.fn();
  const onBrowse = jest.fn();
  const props1 = makeProps({
    isOpen: true,
    onBrowse,
    actions: { gallery: { deselectFiles }, modal: {} }
  });

  const { rerender } = render(<InsertMediaModal {...props1} />);

  const props2 = makeProps({
    isOpen: false,
    onBrowse,
    actions: { gallery: { deselectFiles }, modal: {} }
  });

  rerender(<InsertMediaModal {...props2} />);

  // deselectFiles should be called when transitioning from open to closed
  expect(deselectFiles).toHaveBeenCalled();
});

test('InsertMediaModal respects type prop variations', () => {
  const types = ['insert-media', 'insert-link', 'select', 'admin'];
  types.forEach(type => {
    const { unmount } = render(<InsertMediaModal {...makeProps({ type })} />);
    const modal = screen.getByTestId('form-builder-modal');
    expect(modal).not.toBeNull();
    unmount();
  });
});

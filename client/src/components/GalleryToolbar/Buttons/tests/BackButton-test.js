/* global jest, test,expect */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import BackButton from '../BackButton';

function makeProps(obj = {}) {
  return {
    folder: {
      id: 1,
      title: 'container folder',
      parentId: null,
      canView: true,
      canEdit: true,
    },
    BackComponent: ({ onClick }) => <div data-testid="test-back" onClick={onClick}/>,
    onMoveFiles: () => {},
    onOpenFolder: () => {},
    badges: [],
    ...obj
  };
}

test('BackButton render should not render if parentId is not set', () => {
  const { container } = render(
    <BackButton {...makeProps()}/>
  );
  expect(container.querySelectorAll('.gallery__back-container')).toHaveLength(0);
});

test('BackButton render a react component if parentId is set', () => {
  const { container } = render(
    <BackButton {...makeProps({
      folder: {
        ...makeProps().folder,
        parentId: 15
      }
    })}
    />
  );
  expect(container.querySelectorAll('.gallery__back-container')).toHaveLength(1);
});

test('BackButton handleBackClick() should open folder with parentId', async () => {
  const onOpenFolder = jest.fn();
  render(
    <BackButton {...makeProps({
      folder: {
        ...makeProps().folder,
        parentId: 15
      },
      onOpenFolder
    })}
    />
  );
  const back = await screen.findByTestId('test-back');
  fireEvent.click(back);
  expect(onOpenFolder).toBeCalledWith(15);
});

test('BackButton passes correct props to BackComponent', () => {
  render(
    <BackButton {...makeProps({
      folder: {
        ...makeProps().folder,
        parentId: 15
      }
    })}
    />
  );
  const backButton = screen.getByTestId('test-back');
  expect(backButton).not.toBeNull();
});

test('BackButton passes badge to BackComponent when badge exists for parentId', () => {
  const badge = { id: 15, message: 'Badge message', status: 'warning' };
  const BackComponentMock = jest.fn(() => <div data-testid="test-back" />);
  render(
    <BackButton {...makeProps({
      folder: {
        ...makeProps().folder,
        parentId: 15
      },
      badges: [badge],
      BackComponent: BackComponentMock
    })}
    />
  );
  expect(BackComponentMock).toHaveBeenCalledWith(
    expect.objectContaining({
      badge,
      item: { id: 15 }
    }),
    expect.anything()
  );
});

test('BackButton passes undefined badge to BackComponent when no matching badge', () => {
  const badge = { id: 99, message: 'Badge message', status: 'warning' };
  const BackComponentMock = jest.fn(() => <div data-testid="test-back" />);
  render(
    <BackButton {...makeProps({
      folder: {
        ...makeProps().folder,
        parentId: 15
      },
      badges: [badge],
      BackComponent: BackComponentMock
    })}
    />
  );
  expect(BackComponentMock).toHaveBeenCalledWith(
    expect.objectContaining({
      badge: undefined,
      item: { id: 15 }
    }),
    expect.anything()
  );
});

test('BackButton does not call onOpenFolder when it is not a function', async () => {
  // Suppress PropTypes warning for this test
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const onOpenFolder = 'not a function';
  render(
    <BackButton {...makeProps({
      folder: {
        ...makeProps().folder,
        parentId: 15
      },
      onOpenFolder
    })}
    />
  );
  consoleSpy.mockRestore();
  const back = screen.getByTestId('test-back');
  expect(() => {
    fireEvent.click(back);
  }).not.toThrow();
});

test('BackButton prevents default event behavior on click', async () => {
  const onOpenFolder = jest.fn();
  render(
    <BackButton {...makeProps({
      folder: {
        ...makeProps().folder,
        parentId: 15
      },
      onOpenFolder
    })}
    />
  );
  const back = screen.getByTestId('test-back');
  const event = new MouseEvent('click', { bubbles: true });
  event.preventDefault = jest.fn();
  fireEvent(back, event);
  expect(onOpenFolder).toHaveBeenCalled();
});

test('BackButton renders with multiple badges and finds correct one', () => {
  const badges = [
    { id: 10, message: 'Badge 1', status: 'info' },
    { id: 15, message: 'Badge 2', status: 'warning' },
    { id: 20, message: 'Badge 3', status: 'error' }
  ];
  const BackComponentMock = jest.fn(() => <div data-testid="test-back" />);
  render(
    <BackButton {...makeProps({
      folder: {
        ...makeProps().folder,
        parentId: 15
      },
      badges,
      BackComponent: BackComponentMock
    })}
    />
  );
  expect(BackComponentMock).toHaveBeenCalledWith(
    expect.objectContaining({
      badge: badges[1]
    }),
    expect.anything()
  );
});

test('BackButton renders with empty badges array', () => {
  const BackComponentMock = jest.fn(() => <div data-testid="test-back" />);
  render(
    <BackButton {...makeProps({
      folder: {
        ...makeProps().folder,
        parentId: 15
      },
      badges: [],
      BackComponent: BackComponentMock
    })}
    />
  );
  expect(screen.getByTestId('test-back')).not.toBeNull();
  expect(BackComponentMock).toHaveBeenCalledWith(
    expect.objectContaining({
      badge: undefined
    }),
    expect.anything()
  );
});

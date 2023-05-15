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

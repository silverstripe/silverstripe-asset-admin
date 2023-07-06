/* global jest, expect, test */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EditorHeader, { buttonStates } from '../EditorHeader';

jest.mock('containers/FormBuilderLoader/FormBuilderLoader');
jest.mock('components/FormBuilderModal/FormBuilderModal');

function makeProps(obj = {}) {
  return {
    showButton: buttonStates.NONE,
    ...obj
  };
}

test('EditorHeader render No button at all', () => {
  const { container } = render(
    <EditorHeader {...makeProps()}>
      Title field
    </EditorHeader>
  );
  expect(container.querySelector('.editor-header__field').textContent).toBe('Title field');
  expect(container.querySelector('.editor-header__back-button')).toBe(null);
  expect(container.querySelector('.editor-header__cancel-button')).toBe(null);
  expect(container.querySelector('.editor-header__edit')).toBe(null);
});

test('EditorHeader render Details button', () => {
  const onDetails = jest.fn();
  const { container } = render(
    <EditorHeader {...makeProps({
      onDetails
    })}
    >
      Title field
    </EditorHeader>
  );
  expect(container.querySelector('.editor-header__field').textContent).toBe('Title field');
  expect(container.querySelector('.editor-header__back-button')).toBe(null);
  expect(container.querySelector('.editor-header__cancel-button')).toBe(null);
  expect(container.querySelector('.editor-header__edit')).not.toBe(null);
  fireEvent.click(container.querySelector('.editor-header__edit'));
  expect(onDetails).toBeCalled();
});

test('EditorHeader render Back button always displayed', () => {
  const onCancel = jest.fn();
  const { container } = render(
    <EditorHeader {...makeProps({
      onCancel,
      showButton: buttonStates.ALWAYS_BACK
    })}
    >
      Title field
    </EditorHeader>
  );
  expect(container.querySelector('.editor-header__field').textContent).toBe('Title field');
  expect(container.querySelector('.editor-header__cancel-button')).toBe(null);
  expect(container.querySelector('.editor-header__edit')).toBe(null);
  expect(container.querySelector('.editor-header__back-button')).not.toBe(null);
  fireEvent.click(container.querySelector('.editor-header__back-button'));
  expect(onCancel).toBeCalled();
});

test('EditorHeader render Back button sometimes displayed', () => {
  const onCancel = jest.fn();
  const { container } = render(
    <EditorHeader {...makeProps({
      onCancel,
      showButton: buttonStates.ONLY_BACK
    })}
    >
      Title field
    </EditorHeader>
  );
  expect(container.querySelector('.editor-header__field').textContent).toBe('Title field');
  expect(container.querySelector('.editor-header__cancel-button')).toBe(null);
  expect(container.querySelector('.editor-header__edit')).toBe(null);
  expect(container.querySelector('.editor-header__back-button')).not.toBe(null);
  fireEvent.click(container.querySelector('.editor-header__back-button'));
  expect(onCancel).toBeCalled();
});

test('EditorHeader render Cancel button always displayed', () => {
  const onCancel = jest.fn();
  const { container } = render(
    <EditorHeader {...makeProps({
      onCancel,
      showButton: buttonStates.ALWAYS_CANCEL
    })}
    >
      Title field
    </EditorHeader>
  );
  expect(container.querySelector('.editor-header__field').textContent).toBe('Title field');
  expect(container.querySelector('.editor-header__back-button')).toBe(null);
  expect(container.querySelector('.editor-header__edit')).toBe(null);
  expect(container.querySelector('.editor-header__cancel-button')).not.toBe(null);
  fireEvent.click(container.querySelector('.editor-header__cancel-button'));
  expect(onCancel).toBeCalled();
});

test('EditorHeader render Cancel button sometimes displayed', () => {
  const onCancel = jest.fn();
  const { container } = render(
    <EditorHeader {...makeProps({
      onCancel,
      showButton: buttonStates.ONLY_CANCEL
    })}
    >
      Title field
    </EditorHeader>
  );
  expect(container.querySelector('.editor-header__field').textContent).toBe('Title field');
  expect(container.querySelector('.editor-header__back-button')).toBe(null);
  expect(container.querySelector('.editor-header__edit')).toBe(null);
  expect(container.querySelector('.editor-header__cancel-button')).not.toBe(null);
  fireEvent.click(container.querySelector('.editor-header__cancel-button'));
  expect(onCancel).toBeCalled();
});

test('EditorHeader render Switch between cancel and back', () => {
  const { container } = render(
    <EditorHeader {...makeProps({
      showButton: buttonStates.SWITCH
    })}
    >
      Title field
    </EditorHeader>
  );
  expect(container.querySelector('.editor-header__field').textContent).toBe('Title field');
  expect(container.querySelector('.editor-header__cancel-button')).not.toBe(null);
  expect(container.querySelector('.editor-header__cancel-button').classList).toContain('editor-header__cancel-button--lg-above');
  expect(container.querySelector('.editor-header__back-button')).not.toBe(null);
  expect(container.querySelector('.editor-header__back-button').classList).toContain('editor-header__back-button--md-below');
});

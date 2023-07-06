/* global jest, test, expect, beforeEach */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as Editor } from '../Editor';
import { buttonStates } from '../EditorHeader';

let consoleErrorFn;
let nextAction;
let nextParams;
let createFnParams;
beforeEach(() => {
  nextAction = undefined;
  nextParams = [];
  // surpress warning:
  // Warning: Injector.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined
  consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => null);
});
afterEach(() => {
  consoleErrorFn.mockRestore();
});

function makeProps(obj = {}) {
  return {
    schemaUrlQueries: [],
    schemaUrl: 'edit/file',
    fileId: 123,
    onClose: () => null,
    onSubmit: () => null,
    actions: {
      modal: {
        popFormStackEntry: () => null,
        pushFormStackEntry: () => null,
        stashFormValues: () => null,
      }
    },
    file: {
      type: 'image'
    },
    EditorHeaderComponent: ({ onCancel, onDetails, showButton }) => <div
      data-testid="test-editor-header"
      onClick={() => {
        if (nextAction === 'cancel') {
          onCancel();
        } else if (nextAction === 'details') {
          onDetails();
        }
      }}
      data-show-button={showButton}
    />,
    FormBuilderLoaderComponent: ({ createFn, onAction, schemaUrl }) => (
      <div data-testid="test-form-builder-loader" onClick={() => onAction(...nextParams)} data-schema-url={schemaUrl}>{createFn(...createFnParams)}</div>
    ),
    FormBuilderModalComponent: ({ isOpen }) => <div data-testid="test-form-builder-modal" data-is-open={isOpen}/>,
    ...obj
  };
}

async function openModal() {
  const loader = await screen.findByTestId('test-form-builder-loader');
  nextParams = [{
    preventDefault: () => null,
    currentTarget: {
      name: 'action_addtocampaign'
    }
  }];
  fireEvent.click(loader);
  nextParams = [{
    preventDefault: () => null,
    currentTarget: {
      name: 'foo'
    }
  }];
}

test('Editor handleClose Closing editor', async () => {
  const popFormStackEntry = jest.fn();
  const onClose = jest.fn();
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  render(
    <Editor {...makeProps({
      actions: {
        modal: {
          popFormStackEntry
        }
      },
      onClose,
      showingSubForm: false
    })}
    />
  );
  openModal();
  let modal = await screen.findByTestId('test-form-builder-modal');
  expect(modal.getAttribute('data-is-open')).toBe('true');
  const header = await screen.findByTestId('test-editor-header');
  nextAction = 'cancel';
  fireEvent.click(header);
  expect(popFormStackEntry).not.toHaveBeenCalled();
  expect(onClose).toHaveBeenCalled();
  modal = await screen.findByTestId('test-form-builder-modal');
  expect(modal.getAttribute('data-is-open')).toBe('false');
  expect(header.getAttribute('data-show-button')).toBe(buttonStates.SWITCH);
});

test('Editor handleClose Closing sub form', async () => {
  const popFormStackEntry = jest.fn();
  const onClose = jest.fn();
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  render(
    <Editor {...makeProps({
      actions: {
        modal: {
          popFormStackEntry
        }
      },
      onClose,
      showingSubForm: true
    })}
    />
  );
  openModal();
  let modal = await screen.findByTestId('test-form-builder-modal');
  expect(modal.getAttribute('data-is-open')).toBe('true');
  const header = await screen.findByTestId('test-editor-header');
  nextAction = 'cancel';
  fireEvent.click(header);
  expect(popFormStackEntry).toHaveBeenCalled();
  expect(onClose).not.toHaveBeenCalled();
  modal = await screen.findByTestId('test-form-builder-modal');
  expect(modal.getAttribute('data-is-open')).toBe('true');
  expect(header.getAttribute('data-show-button')).toBe(buttonStates.SWITCH);
});

test('Editor editorHeader Top Form without detail', async () => {
  createFnParams = ['div', { formid: 'myFormName' }];
  render(
    <Editor {...makeProps()}/>
  );
  const loader = await screen.findByTestId('test-form-builder-loader');
  expect(loader.querySelectorAll('div[formid="myFormName"]').length).toBe(1);
});

test('Editor editorHeader Top Form with detail in dialog', async () => {
  const pushFormStackEntry = jest.fn();
  const stashFormValues = jest.fn();
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup', formid: 'myFormName' }];
  render(
    <Editor {...makeProps({
      actions: {
        modal: {
          pushFormStackEntry,
          stashFormValues
        }
      },
      showingSubForm: false,
      nextType: 'subform',
      dialog: true
    })}
    />
  );
  openModal();
  const header = await screen.findByTestId('test-editor-header');
  nextAction = 'details';
  fireEvent.click(header);
  expect(stashFormValues).toHaveBeenCalledWith('myFormName', 'edit/file/123');
  expect(pushFormStackEntry).toHaveBeenCalledWith('subform');
  expect(header.getAttribute('data-show-button')).toBe(buttonStates.ONLY_BACK);
});

test('Editor editorHeader Sub form in dialog', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup', formid: 'myFormName' }];
  render(
    <Editor {...makeProps({
      showingSubForm: true,
      dialog: true
    })}
    />
  );
  openModal();
  const header = await screen.findByTestId('test-editor-header');
  expect(header.getAttribute('data-show-button')).toBe(buttonStates.ALWAYS_BACK);
});

test('Editor editorHeader Form for folder', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup', formid: 'myFormName' }];
  render(
    <Editor {...makeProps({
      nextType: 'subform',
      dialog: true,
      file: { type: 'folder' }
    })}
    />
  );
  openModal();
  const header = await screen.findByTestId('test-editor-header');
  expect(header.getAttribute('data-show-button')).toBe(buttonStates.SWITCH);
});

test('Editor getFormSchemaUrl Plain URL', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  render(
    <Editor {...makeProps({
      schemaUrlQueries: []
    })}
    />
  );
  openModal();
  const loader = await screen.findByTestId('test-form-builder-loader');
  expect(loader.getAttribute('data-schema-url')).toBe('edit/file/123');
});

test('Editor getFormSchemaUrl Plain URL', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  render(
    <Editor {...makeProps({
      schemaUrlQueries: [{ name: 'q', value: 'search' }]
    })}
    />
  );
  openModal();
  const loader = await screen.findByTestId('test-form-builder-loader');
  expect(loader.getAttribute('data-schema-url')).toBe('edit/file/123?q=search');
});

test('Editor getFormSchemaUrl Plain URL', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  render(
    <Editor {...makeProps({
      schemaUrlQueries: [
        { name: 'q', value: 'search' },
        { name: 'foo', value: 'bar' },
      ]
    })}
    />
  );
  openModal();
  const loader = await screen.findByTestId('test-form-builder-loader');
  expect(loader.getAttribute('data-schema-url')).toBe('edit/file/123?q=search&foo=bar');
});

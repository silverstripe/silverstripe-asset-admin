/* global jest, test, expect, beforeEach */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import backend from 'lib/Backend';
import { Component as Editor } from '../Editor';
import { buttonStates } from '../EditorHeader';

let resolveBackendGet;

jest.mock('lib/Backend', () => ({
  get: () => new Promise(resolve => {
    resolveBackendGet = resolve;
  })
}));

function makeReadFileResponse() {
  return {
    json: () => ({
      id: 1,
      type: 'file',
    })
  };
}

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

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdminOpen';
window.ss.config = {
  SecurityID: 1234567890,
  sections: [
    {
      name: sectionConfigKey,
      endpoints: {
        read: 'test/endpoint/read',
      }
    },
  ],
};

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
  resolveBackendGet(makeReadFileResponse());
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
  resolveBackendGet(makeReadFileResponse());
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
  resolveBackendGet(makeReadFileResponse());
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
  resolveBackendGet(makeReadFileResponse());
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
  resolveBackendGet(makeReadFileResponse());
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
    })}
    />
  );
  resolveBackendGet({
    json: () => ({
      id: 1,
      type: 'folder',
    })
  });
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
  resolveBackendGet(makeReadFileResponse());
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
  resolveBackendGet(makeReadFileResponse());
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
  resolveBackendGet(makeReadFileResponse());
  openModal();
  const loader = await screen.findByTestId('test-form-builder-loader');
  expect(loader.getAttribute('data-schema-url')).toBe('edit/file/123?q=search&foo=bar');
});

test('Editor handleSubmit calls custom onSubmit', async () => {
  const onSubmit = jest.fn(() => Promise.resolve());
  const submitFn = jest.fn();
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const FormBuilderLoaderComponent = jest.fn(({ onSubmit: onSubmitProp }) => {
    onSubmitProp({ foo: 'bar' }, 'action_save', submitFn);
    return <div data-testid="test-form-builder-loader"/>;
  });
  render(
    <Editor {...makeProps({
      onSubmit,
      FormBuilderLoaderComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  expect(onSubmit).toHaveBeenCalledWith({ foo: 'bar' }, 'action_save', submitFn);
  expect(submitFn).not.toHaveBeenCalled();
});

test('Editor handleSubmit pops form stack on subform primary action', async () => {
  const onSubmit = jest.fn(() => Promise.resolve());
  const popFormStackEntry = jest.fn();
  const submitFn = jest.fn();
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const FormBuilderLoaderComponent = jest.fn(({ onSubmit: onSubmitProp }) => {
    onSubmitProp({ foo: 'bar' }, 'action_save', submitFn);
    return <div data-testid="test-form-builder-loader"/>;
  });
  render(
    <Editor {...makeProps({
      onSubmit,
      showingSubForm: true,
      actions: {
        modal: {
          popFormStackEntry
        }
      },
      FormBuilderLoaderComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  await Promise.resolve();
  expect(popFormStackEntry).toHaveBeenCalled();
});

test('Editor handleSubmit does not pop form stack on subform non-primary action', async () => {
  const onSubmit = jest.fn(() => Promise.resolve());
  const popFormStackEntry = jest.fn();
  const submitFn = jest.fn();
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const FormBuilderLoaderComponent = jest.fn(({ onSubmit: onSubmitProp }) => {
    onSubmitProp({ foo: 'bar' }, 'action_other', submitFn);
    return <div data-testid="test-form-builder-loader"/>;
  });
  render(
    <Editor {...makeProps({
      onSubmit,
      showingSubForm: true,
      actions: {
        modal: {
          popFormStackEntry
        }
      },
      FormBuilderLoaderComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  await Promise.resolve();
  expect(popFormStackEntry).not.toHaveBeenCalled();
});

test('Editor handleSubmit uses default submit when no custom onSubmit', async () => {
  const submitFn = jest.fn(() => Promise.resolve());
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const FormBuilderLoaderComponent = jest.fn(({ onSubmit: onSubmitProp }) => {
    onSubmitProp({ foo: 'bar' }, 'action_save', submitFn);
    return <div data-testid="test-form-builder-loader"/>;
  });
  render(
    <Editor {...makeProps({
      onSubmit: undefined,
      FormBuilderLoaderComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  expect(submitFn).toHaveBeenCalled();
});

test('Editor handleAction opens modal for addtocampaign', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  render(
    <Editor {...makeProps()}/>
  );
  resolveBackendGet(makeReadFileResponse());
  const loader = await screen.findByTestId('test-form-builder-loader');
  let modal = await screen.findByTestId('test-form-builder-modal');
  expect(modal.getAttribute('data-is-open')).toBe('false');
  nextParams = [{
    preventDefault: jest.fn(),
    currentTarget: {
      name: 'action_addtocampaign'
    }
  }];
  fireEvent.click(loader);
  modal = await screen.findByTestId('test-form-builder-modal');
  expect(modal.getAttribute('data-is-open')).toBe('true');
  expect(nextParams[0].preventDefault).toHaveBeenCalled();
});

test('Editor handleAction calls confirm deletion for delete action', async () => {
  const confirm = jest.fn();
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  render(
    <Editor {...makeProps({
      actions: {
        confirmDeletion: {
          confirm
        }
      }
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const loader = await screen.findByTestId('test-form-builder-loader');
  nextParams = [{
    preventDefault: jest.fn(),
    currentTarget: {
      name: 'action_delete'
    }
  }];
  fireEvent.click(loader);
  expect(confirm).toHaveBeenCalledWith([{ id: 1, type: 'file' }]);
  expect(nextParams[0].preventDefault).toHaveBeenCalled();
});

test('Editor handleCancelKeyDown triggers handleClose on return key', async () => {
  const onClose = jest.fn();
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const EditorHeaderComponent = jest.fn(({ onCancel }) => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 13) {
        onCancel(event);
      }
    };
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    return <div data-testid="test-editor-header" onKeyDown={handleKeyDown} tabIndex={0}/>;
  });
  render(
    <Editor {...makeProps({
      onClose,
      EditorHeaderComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const header = await screen.findByTestId('test-editor-header');
  fireEvent.keyDown(header, { keyCode: 13 });
  expect(onClose).toHaveBeenCalled();
});

test('Editor handleCancelKeyDown triggers handleClose on space key', async () => {
  const onClose = jest.fn();
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const EditorHeaderComponent = jest.fn(({ onCancel }) => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 32) {
        onCancel(event);
      }
    };
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    return <div data-testid="test-editor-header" onKeyDown={handleKeyDown} tabIndex={0}/>;
  });
  render(
    <Editor {...makeProps({
      onClose,
      EditorHeaderComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  const header = await screen.findByTestId('test-editor-header');
  fireEvent.keyDown(header, { keyCode: 32 });
  expect(onClose).toHaveBeenCalled();
});

test('Editor handleLoadingError sets error state', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const FormBuilderLoaderComponent = jest.fn(({ onLoadingError }) => {
    onLoadingError({ errors: [{ value: 'Test error', code: 500 }] });
    return <div data-testid="test-form-builder-loader"/>;
  });
  render(
    <Editor {...makeProps({
      FormBuilderLoaderComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  expect(screen.getByText('Test error')).not.toBeNull();
});

test('Editor handleLoadingError displays file missing message for 404', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const FormBuilderLoaderComponent = jest.fn(({ onLoadingError }) => {
    onLoadingError({ errors: [{ value: 'Not found', code: 404 }] });
    return <div data-testid="test-form-builder-loader"/>;
  });
  render(
    <Editor {...makeProps({
      FormBuilderLoaderComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  expect(screen.getByText('File cannot be found')).not.toBeNull();
});

test('Editor handleLoadingError displays unknown error when no message', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const FormBuilderLoaderComponent = jest.fn(({ onLoadingError }) => {
    onLoadingError({ errors: [{ code: 500 }] });
    return <div data-testid="test-form-builder-loader"/>;
  });
  render(
    <Editor {...makeProps({
      FormBuilderLoaderComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  expect(screen.getByText('An unknown error has occurred')).not.toBeNull();
});

test('Editor handleLoadingSuccess clears loading and error state', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const FormBuilderLoaderComponent = jest.fn(({ onFetchingSchema, onLoadingSuccess }) => (
    <div data-testid="test-form-builder-loader">
      <button data-testid="start-loading" onClick={() => onFetchingSchema()}/>
      <button data-testid="finish-loading" onClick={() => onLoadingSuccess()}/>
    </div>
  ));
  const loadingComponent = jest.fn(() => <div data-testid="test-loading"/>);
  render(
    <Editor {...makeProps({
      FormBuilderLoaderComponent,
      loadingComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  const startLoading = screen.getByTestId('start-loading');
  const finishLoading = screen.getByTestId('finish-loading');
  fireEvent.click(startLoading);
  expect(screen.getByTestId('test-loading')).not.toBeNull();
  fireEvent.click(finishLoading);
  await waitFor(() => {
    expect(screen.queryByTestId('test-loading')).toBeNull();
  });
});

test('Editor handleFetchingSchema sets loading state', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const FormBuilderLoaderComponent = jest.fn(({ onFetchingSchema }) => {
    onFetchingSchema();
    return <div data-testid="test-form-builder-loader"/>;
  });
  const loadingComponent = jest.fn(() => <div data-testid="test-loading"/>);
  render(
    <Editor {...makeProps({
      FormBuilderLoaderComponent,
      loadingComponent
    })}
    />
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  expect(screen.getByTestId('test-loading')).not.toBeNull();
});

test('Editor componentDidUpdate refetches file when fileId changes', async () => {
  let getCallCount = 0;
  const originalGet = backend.get;
  backend.get = jest.fn((url) => {
    getCallCount += 1;
    return originalGet(url);
  });
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const { rerender } = render(
    <Editor {...makeProps({ fileId: 123 })}/>
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  expect(getCallCount).toBe(1);
  rerender(
    <Editor {...makeProps({ fileId: 456 })}/>
  );
  resolveBackendGet(makeReadFileResponse());
  expect(getCallCount).toBe(2);
  backend.get = originalGet;
});

test('Editor componentDidUpdate does not refetch when fileId unchanged', async () => {
  let getCallCount = 0;
  const originalGet = backend.get;
  backend.get = jest.fn((url) => {
    getCallCount += 1;
    return originalGet(url);
  });
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const { rerender } = render(
    <Editor {...makeProps({ fileId: 123, className: 'old-class' })}/>
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  expect(getCallCount).toBe(1);
  rerender(
    <Editor {...makeProps({ fileId: 123, className: 'new-class' })}/>
  );
  expect(getCallCount).toBe(1);
  backend.get = originalGet;
});

test('Editor createFn uses default SchemaComponent for non-header fields', async () => {
  createFnParams = ['div', { name: 'SomeOtherField', id: 'field-123' }];
  render(
    <Editor {...makeProps()}/>
  );
  resolveBackendGet(makeReadFileResponse());
  const loader = await screen.findByTestId('test-form-builder-loader');
  expect(loader.querySelectorAll('div[name="SomeOtherField"]').length).toBe(1);
});

test('Editor renders with disabled dropzone class when enableDropzone is false', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const { container } = render(
    <Editor {...makeProps({ enableDropzone: false })}/>
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  const editor = container.querySelector('.editor--asset-dropzone--disable');
  expect(editor).not.toBeNull();
});

test('Editor renders without disabled dropzone class when enableDropzone is true', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const { container } = render(
    <Editor {...makeProps({ enableDropzone: true })}/>
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  const editor = container.querySelector('.editor--asset-dropzone--disable');
  expect(editor).toBeNull();
});

test('Editor renders null before file is loaded', () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const { container } = render(
    <Editor {...makeProps()}/>
  );
  expect(container.firstChild).toBeNull();
});

test('Editor passes file prop to FormBuilderLoaderComponent', async () => {
  createFnParams = [null, { name: 'AssetEditorHeaderFieldGroup' }];
  const FormBuilderLoaderComponent = jest.fn(() => <div data-testid="test-form-builder-loader"/>);
  render(
    <Editor {...makeProps({ FormBuilderLoaderComponent })}/>
  );
  resolveBackendGet(makeReadFileResponse());
  await screen.findByTestId('test-form-builder-loader');
  expect(FormBuilderLoaderComponent).toHaveBeenCalledWith(
    expect.objectContaining({
      file: { id: 1, type: 'file' }
    }),
    expect.anything()
  );
});

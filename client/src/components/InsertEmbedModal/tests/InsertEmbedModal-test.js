/* global jest, expect, test */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as InsertEmbedModal } from '../InsertEmbedModal';

function makeProps(obj = {}) {
  return {
    onInsert: () => null,
    onCreate: () => null,
    onClosed: () => null,
    schemaUrl: 'test.com/schema',
    actions: {
      schema: {
        setSchemaStateOverrides: () => null,
      },
    },
    FormBuilderModalComponent: ({ onSubmit }) => <div data-testid="test-form-builder-modal" onClick={() => onSubmit({}, 'action_addmedia')}/>,
    ...obj
  };
}

// FormBuilderLoader mock was not mocking properly
// manually override with a stateless null component
jest.mock('components/FormBuilderModal/FormBuilderModal', () => () => null);

test('InsertEmbedModal clearOverrides() should call the action to state override and provide null', () => {
  const setSchemaStateOverrides = jest.fn();
  const { unmount } = render(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      }
    })}
    />
  );
  unmount();
  expect(setSchemaStateOverrides).toBeCalledWith('test.com/schema', null);
});

test('InsertEmbedModal setOverrides() should set a new override url if url has changed', () => {
  const setSchemaStateOverrides = jest.fn();
  const { rerender } = render(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      isOpen: false
    })}
    />
  );
  rerender(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      schemaUrl: 'test2.com/schema',
      isOpen: true
    })}
    />
  );
  expect(setSchemaStateOverrides.mock.calls).toHaveLength(2);
  expect(setSchemaStateOverrides).toHaveBeenNthCalledWith(1, 'test.com/schema', { fields: [] });
  expect(setSchemaStateOverrides).toHaveBeenNthCalledWith(2, 'test2.com/schema', { fields: [] });
});

test('InsertEmbedModal setOverrides() should not set a new override url if url has not changed', () => {
  const setSchemaStateOverrides = jest.fn();
  const { rerender } = render(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      isOpen: false
    })}
    />
  );
  rerender(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      isOpen: true
    })}
    />
  );
  expect(setSchemaStateOverrides.mock.calls).toHaveLength(2);
  expect(setSchemaStateOverrides).toHaveBeenNthCalledWith(1, 'test.com/schema', { fields: [] });
  expect(setSchemaStateOverrides).toHaveBeenNthCalledWith(2, 'test.com/schema', { fields: [] });
});

test('InsertEmbedModal setOverrides() should not call the state override action if no url is provided', () => {
  const setSchemaStateOverrides = jest.fn();
  const { rerender } = render(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      isOpen: false
    })}
    />
  );
  rerender(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      schemaUrl: '',
      isOpen: true
    })}
    />
  );
  expect(setSchemaStateOverrides.mock.calls).toHaveLength(1);
  expect(setSchemaStateOverrides).toHaveBeenNthCalledWith(1, 'test.com/schema', { fields: [] });
});

test('InsertEmbedModal setOverrides() should set the fields in the proper structure and exclude ID', () => {
  const setSchemaStateOverrides = jest.fn();
  const { rerender } = render(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      isOpen: false
    })}
    />
  );
  rerender(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      schemaUrl: 'test.com/schema',
      fileAttributes: {
        ID: 5,
        Name: 'Bob',
      },
      isOpen: true
    })}
    />
  );
  expect(setSchemaStateOverrides.mock.calls).toHaveLength(2);
  expect(setSchemaStateOverrides).toHaveBeenNthCalledWith(1, 'test.com/schema', { fields: [] });
  expect(setSchemaStateOverrides).toHaveBeenNthCalledWith(2, 'test.com/schema', { fields: [{ name: 'Name', value: 'Bob' }] });
});

test('InsertEmbedModal handleSubmit() should call create when addmedia is actioned', async () => {
  const onCreate = jest.fn();
  render(
    <InsertEmbedModal {...makeProps({
      onCreate,
      isOpen: false
    })}
    />
  );
  const modal = await screen.findByTestId('test-form-builder-modal');
  fireEvent.click(modal);
  expect(onCreate).toBeCalled();
});

test('InsertEmbedModal handleSubmit() should call onInsert when insertmedia is actioned', async () => {
  const onInsert = jest.fn();
  const FormBuilderModal = ({ onSubmit }) => (
    <div data-testid="test-form-builder-modal" onClick={() => onSubmit({}, 'action_insertmedia')} />
  );
  render(
    <InsertEmbedModal {...makeProps({
      onInsert,
      FormBuilderModalComponent: FormBuilderModal,
      isOpen: false
    })}
    />
  );
  const modal = await screen.findByTestId('test-form-builder-modal');
  fireEvent.click(modal);
  expect(onInsert).toBeCalled();
});

test('InsertEmbedModal handleSubmit() should call onClosed when cancel is actioned', async () => {
  const onClosed = jest.fn();
  const FormBuilderModal = ({ onSubmit }) => (
    <div data-testid="test-form-builder-modal" onClick={() => onSubmit({}, 'action_cancel')} />
  );
  render(
    <InsertEmbedModal {...makeProps({
      onClosed,
      FormBuilderModalComponent: FormBuilderModal,
      isOpen: false
    })}
    />
  );
  const modal = await screen.findByTestId('test-form-builder-modal');
  fireEvent.click(modal);
  expect(onClosed).toBeCalled();
});

test('InsertEmbedModal handleSubmit() should handle unknown actions gracefully', async () => {
  const onCreate = jest.fn();
  const onInsert = jest.fn();
  const onClosed = jest.fn();
  const FormBuilderModal = ({ onSubmit }) => (
    <div data-testid="test-form-builder-modal" onClick={() => onSubmit({}, 'unknown_action')} />
  );
  render(
    <InsertEmbedModal {...makeProps({
      onCreate,
      onInsert,
      onClosed,
      FormBuilderModalComponent: FormBuilderModal,
      isOpen: false
    })}
    />
  );
  const modal = await screen.findByTestId('test-form-builder-modal');
  fireEvent.click(modal);
  expect(onCreate).not.toBeCalled();
  expect(onInsert).not.toBeCalled();
  expect(onClosed).not.toBeCalled();
});

test('InsertEmbedModal handleLoadingError() should call callback if onLoadingError is a function', () => {
  const onLoadingError = jest.fn();
  render(
    <InsertEmbedModal {...makeProps({
      onLoadingError
    })}
    />
  );
  expect(onLoadingError).not.toHaveBeenCalled();
});

test('InsertEmbedModal handleLoadingError() should not throw if onLoadingError is not provided', () => {
  expect(() => {
    render(
      <InsertEmbedModal {...makeProps({
        onLoadingError: undefined
      })}
      />
    );
  }).not.toThrow();
});

test('InsertEmbedModal should render FormBuilderModalComponent with correct props', () => {
  const FormBuilderModal = ({ onSubmit: onSubmitProp, className, size, title, identifier, showErrorMessage, responseClassBad }) => (
    <div
      data-testid="test-form-builder-modal"
      data-class-name={className}
      data-size={size}
      data-title={title}
      data-identifier={identifier}
      data-show-error-message={showErrorMessage ? 'true' : 'false'}
      data-response-class-bad={responseClassBad}
      onClick={() => onSubmitProp({}, 'action_addmedia')}
    />
  );
  render(
    <InsertEmbedModal {...makeProps({
      FormBuilderModalComponent: FormBuilderModal,
      className: 'custom-modal-class',
      isOpen: true
    })}
    />
  );
  const modal = screen.getByTestId('test-form-builder-modal');
  expect(modal.getAttribute('data-size')).toBe('lg');
  expect(modal.getAttribute('data-identifier')).toBe('AssetAdmin.InsertEmbedModal');
  expect(modal.getAttribute('data-show-error-message')).toBe('true');
  expect(modal.getAttribute('data-response-class-bad')).toBe('alert alert-danger');
  expect(modal.getAttribute('data-class-name')).toContain('insert-embed-modal');
  expect(modal.getAttribute('data-class-name')).toContain('custom-modal-class');
});

test('InsertEmbedModal should set modal title to Create when targetUrl is not provided', () => {
  const FormBuilderModal = ({ title }) => (
    <div data-testid="test-form-builder-modal" data-title={title} />
  );
  render(
    <InsertEmbedModal {...makeProps({
      FormBuilderModalComponent: FormBuilderModal,
      targetUrl: undefined,
      isOpen: true
    })}
    />
  );
  const modal = screen.getByTestId('test-form-builder-modal');
  expect(modal.getAttribute('data-title')).toContain('Insert new media from the web');
});

test('InsertEmbedModal should set modal title to Edit when targetUrl is provided', () => {
  const FormBuilderModal = ({ title }) => (
    <div data-testid="test-form-builder-modal" data-title={title} />
  );
  render(
    <InsertEmbedModal {...makeProps({
      FormBuilderModalComponent: FormBuilderModal,
      targetUrl: 'http://example.com/media',
      isOpen: true
    })}
    />
  );
  const modal = screen.getByTestId('test-form-builder-modal');
  expect(modal.getAttribute('data-title')).toContain('Media from the web');
});

test('InsertEmbedModal should exclude sectionConfig from modal props', () => {
  const excludedProps = [];
  const FormBuilderModal = (props) => {
    if (props.sectionConfig) {
      excludedProps.push('sectionConfig');
    }
    if (props.onInsert) {
      excludedProps.push('onInsert');
    }
    if (props.fileAttributes) {
      excludedProps.push('fileAttributes');
    }
    return <div data-testid="test-form-builder-modal" />;
  };
  render(
    <InsertEmbedModal {...makeProps({
      FormBuilderModalComponent: FormBuilderModal,
      isOpen: true
    })}
    />
  );
  expect(excludedProps).toEqual([]);
});

test('InsertEmbedModal should handle empty className prop', () => {
  const FormBuilderModal = ({ className }) => (
    <div data-testid="test-form-builder-modal" data-class-name={className} />
  );
  render(
    <InsertEmbedModal {...makeProps({
      FormBuilderModalComponent: FormBuilderModal,
      className: '',
      isOpen: true
    })}
    />
  );
  const modal = screen.getByTestId('test-form-builder-modal');
  expect(modal.getAttribute('data-class-name')).toBe('insert-embed-modal ');
});

test('InsertEmbedModal should handle fileAttributes with multiple fields', () => {
  const setSchemaStateOverrides = jest.fn();
  const { rerender } = render(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      isOpen: false
    })}
    />
  );
  rerender(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      schemaUrl: 'test.com/schema',
      fileAttributes: {
        ID: 5,
        Name: 'Bob',
        Email: 'bob@example.com',
        Age: 30,
      },
      isOpen: true
    })}
    />
  );
  expect(setSchemaStateOverrides).toHaveBeenNthCalledWith(2, 'test.com/schema', {
    fields: [
      { name: 'Name', value: 'Bob' },
      { name: 'Email', value: 'bob@example.com' },
      { name: 'Age', value: 30 },
    ]
  });
});

test('InsertEmbedModal componentDidUpdate should not call setOverrides when isOpen becomes false', () => {
  const setSchemaStateOverrides = jest.fn();
  const { rerender } = render(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      isOpen: true
    })}
    />
  );
  setSchemaStateOverrides.mockClear();
  rerender(
    <InsertEmbedModal {...makeProps({
      actions: {
        schema: {
          setSchemaStateOverrides,
        }
      },
      isOpen: false
    })}
    />
  );
  expect(setSchemaStateOverrides).not.toBeCalled();
});

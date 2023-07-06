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

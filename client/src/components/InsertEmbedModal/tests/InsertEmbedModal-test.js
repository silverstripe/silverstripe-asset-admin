/* global jest, jasmine, describe, it, expect, beforeEach */

// FormBuilderLoader mock was not mocking properly
// manually override with a stateless null component
jest.mock('components/FormBuilderModal/FormBuilderModal', () => () => null);

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as InsertEmbedModal } from '../InsertEmbedModal';

describe('InsertEmbedModal', () => {
  let props = {};

  beforeEach(() => {
    props = {
      onInsert: jest.genMockFunction(),
      onCreate: jest.genMockFunction(),
      onHide: jest.genMockFunction(),
      schemaUrl: 'test.com/schema',
      actions: {
        schema: {
          setSchemaStateOverrides: jest.genMockFunction(),
        },
      },
    };
  });

  describe('clearOverrides()', () => {
    it('should call the action to state override and provide null', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <InsertEmbedModal {...props} />
      );

      component.clearOverrides();

      expect(props.actions.schema.setSchemaStateOverrides).toBeCalledWith('test.com/schema', null);
    });
  });

  describe('setOverrides()', () => {
    it('should clear override if url has changed', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <InsertEmbedModal {...props} />
      );
      const nextProps = {
        schemaUrl: 'test2.com/schema',
        fileAttributes: {
          ID: 5,
          Name: 'Bob',
        },
      };

      component.clearOverrides = jest.genMockFunction();
      component.setOverrides(nextProps);

      expect(component.clearOverrides).toBeCalled();
    });

    it('should not call the state override action if no url is provided', () => {
      props.schemaUrl = '';
      const component = ReactTestUtils.renderIntoDocument(
        <InsertEmbedModal {...props} />
      );
      const nextProps = {
        schemaUrl: '',
      };

      component.setOverrides(nextProps);

      expect(props.actions.schema.setSchemaStateOverrides).not.toBeCalled();
    });

    it('should set the fields in the proper structure and exclude ID', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <InsertEmbedModal {...props} />
      );
      const nextProps = {
        schemaUrl: 'test.com/schema',
        fileAttributes: {
          ID: 5,
          Name: 'Bob',
        },
      };

      component.setOverrides(nextProps);

      expect(props.actions.schema.setSchemaStateOverrides).toBeCalledWith('test.com/schema', {
        fields: [
          { name: 'Name', value: 'Bob' },
        ],
      });
    });
  });

  describe('handleSubmit()', () => {
    it('should call create when addmedia is actioned', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <InsertEmbedModal {...props} />
      );
      const data = { Name: 'Bob' };
      const mockSubmit = jest.genMockFunction();

      component.handleSubmit(data, 'action_addmedia', mockSubmit);

      expect(props.onCreate).toBeCalledWith(data);
      expect(mockSubmit).not.toBeCalled();
    });

    it('should call insert when insertmedia is actioned', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <InsertEmbedModal {...props} />
      );
      const data = { Name: 'Bob' };
      const mockSubmit = jest.genMockFunction();

      component.handleSubmit(data, 'action_insertmedia', mockSubmit);

      expect(props.onInsert).toBeCalledWith(data);
      expect(mockSubmit).not.toBeCalled();
    });

    it('should call hide when cancel is actioned', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <InsertEmbedModal {...props} />
      );
      const data = { Name: 'Bob' };
      const mockSubmit = jest.genMockFunction();

      component.handleSubmit(data, 'action_cancel', mockSubmit);

      expect(props.onHide).toBeCalled();
      expect(mockSubmit).not.toBeCalled();
    });
  });
});

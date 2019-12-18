/* global jest, jasmine, describe, it, expect, beforeEach, FormData */
jest.mock('containers/FormBuilderLoader/FormBuilderLoader');
jest.mock('components/FormBuilderModal/FormBuilderModal');

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import { Component as Editor } from '../Editor';
import { buttonStates } from '../EditorHeader';

const render = (props) => {
  const baseProps = {
    schemaUrlQueries: [],
    schemaUrl: 'edit/file',
    targetId: 123,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    actions: {
      modal: {
        popFormStackEntry: jest.fn(),
        pushFormStackEntry: jest.fn(),
        stashFormValues: jest.fn(),
      }
    },
    file: {
      type: 'image'
    },
    ...props
  };
  const component = ReactTestUtils.renderIntoDocument(<Editor {...baseProps} />);
  return { component, baseProps };
};

describe('Editor', () => {
  describe('handleClose', () => {
    it('Closing editor', () => {
      const {
        component,
        baseProps: {
          actions: {
            modal: { popFormStackEntry }
          },
          onClose
        }
      } = render({ showingSubForm: false });

      component.openModal();
      component.handleClose();

      expect(popFormStackEntry).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
      expect(component.state).toHaveProperty('openModal', false);
    });

    it('Closing sub form', () => {
      const {
        component,
        baseProps: {
          actions: {
            modal: { popFormStackEntry }
          },
          onClose
        }
      } = render({ showingSubForm: true });

      component.openModal();
      component.handleClose();

      expect(popFormStackEntry).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      expect(component.state).toHaveProperty('openModal', true);
    });
  });

  describe('editorHeader', () => {
    it('Top form without detail', () => {
      const { component } = render({});

      component.openModal();
      const connectedHeader = component.editorHeader({ SchemaComponent: 'div' });

      expect(connectedHeader.type.name).toBe('EditorHeader');
      expect(connectedHeader.props.onDetails).toBeFalsy();
      expect(connectedHeader.props.onCancel).toBe(component.handleClose);
      expect(connectedHeader.props.children.type).toBe('div');
      expect(connectedHeader.props.showButton).toBe(buttonStates.SWITCH);
    });

    it('Top form with detail in dialog', () => {
      const {
        component,
        baseProps: {
          actions: {
            modal: { pushFormStackEntry, stashFormValues }
          }
        }
      } = render({ showingSubForm: false, nextType: 'subform', dialog: true });

      component.openModal();
      const connectedHeader = component.editorHeader({
        SchemaComponent: 'div',
        formid: 'myFormName'
      });

      expect(connectedHeader.type.name).toBe('EditorHeader');
      expect(connectedHeader.props.onCancel).toBe(component.handleClose);
      expect(connectedHeader.props.children.type).toBe('div');
      expect(connectedHeader.props.showButton).toBe(buttonStates.ONLY_BACK);

      connectedHeader.props.onDetails();
      expect(stashFormValues).toHaveBeenCalledWith('myFormName', 'edit/file/123');
      expect(pushFormStackEntry).toHaveBeenCalledWith('subform');
    });

    it('Sub form in dialog', () => {
      const { component } = render({ showingSubForm: true, dialog: true });

      component.openModal();
      const connectedHeader = component.editorHeader({ SchemaComponent: 'div' });

      expect(connectedHeader.type.name).toBe('EditorHeader');
      expect(connectedHeader.props.onDetails).toBeFalsy();
      expect(connectedHeader.props.onCancel).toBe(component.handleClose);
      expect(connectedHeader.props.children.type).toBe('div');
      expect(connectedHeader.props.showButton).toBe(buttonStates.ALWAYS_BACK);
    });

    it('Form for folder', () => {
      const { component } =
        render({ nextType: 'subform', dialog: true, file: { type: 'folder' } });

      component.openModal();
      const connectedHeader = component.editorHeader({
        SchemaComponent: 'div',
        formid: 'myFormName'
      });

      expect(connectedHeader.type.name).toBe('EditorHeader');
      expect(connectedHeader.props.onDetails).toBeFalsy();
      expect(connectedHeader.props.onCancel).toBe(component.handleClose);
      expect(connectedHeader.props.children.type).toBe('div');
      expect(connectedHeader.props.showButton).toBe(buttonStates.SWITCH);
    });
  });

  describe('createFn', () => {
    it('Regular Field', () => {
      const { component } = render({});
      const fieldComponent = component.createFn('div', { name: 'Title', id: 'TitleID' });

      expect(fieldComponent.type).toBe('div');
      expect(fieldComponent.key).toBe('TitleID');
      expect(fieldComponent.props.name).toBe('Title');
      expect(fieldComponent.props.id).toBe('TitleID');
    });

    it('Editor Header Field', () => {
      const { component } = render({});
      const fieldComponent = component.createFn('div', { name: 'AssetEditorHeaderFieldGroup', id: 'TitleID' });

      expect(fieldComponent.type.name).toBe('bound editorHeader');
      expect(fieldComponent.key).toBe('TitleID');
      expect(fieldComponent.props.SchemaComponent).toBe('div');
      expect(fieldComponent.props.name).toBe('AssetEditorHeaderFieldGroup');
      expect(fieldComponent.props.id).toBe('TitleID');
    });
  });

  describe('getFormSchemaUrl', () => {
    const testCase = [
      ['Plain URL', {}, 'edit/file/123'],
      [
        'Query param',
        { schemaUrlQueries: [{ name: 'q', value: 'search' }] },
        'edit/file/123?q=search'
      ],
      [
        'More than one query param',
        { schemaUrlQueries: [
          { name: 'q', value: 'search' },
          { name: 'foo', value: 'bar' },
        ] },
        'edit/file/123?q=search&foo=bar'
      ]
    ];

    testCase.forEach(([desc, props, expected]) => it(desc, () => {
      const { component } = render(props);
      const formSchemaUrl = component.getFormSchemaUrl();
      expect(formSchemaUrl).toBe(expected);
    }));
  });
});

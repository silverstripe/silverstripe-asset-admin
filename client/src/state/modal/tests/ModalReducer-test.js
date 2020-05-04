/* global jest, describe, it, pit, expect, beforeEach, jasmine */
import reducer, { initialState } from '../ModalReducer';
import {
  defineImageSizePresets,
  pushFormStackEntry,
  popFormStackEntry,
  reset,
  stashFormValues,
  resetFormStack,
  initFormStack
} from '../ModalActions';
import setIn from 'redux-form/lib/structure/plain/setIn';
import SCHEMA_ACTION_TYPES from 'state/schema/SchemaActionTypes';

const presetList = [
  { width: 123, text: 'test preset' }
];

describe('Modal State Reducers', () => {
  describe('Image Size Preset', () => {
    it('Defining new preset', () => {
      const actualNewState = reducer(
        initialState,
        defineImageSizePresets(presetList)
      );
      expect(actualNewState.imageSizePresets).toBe(presetList);
    });
  });

  describe('Initialising Form stack', () => {
    it('Initilising empty stack', () => {
      const actualNewState = reducer(
        initialState,
        initFormStack('admin')
      );

      expect(actualNewState.formSchema.type).toBe('admin');
      expect(actualNewState.formSchema.nextType).toBeFalsy();
      expect(actualNewState.formSchemaStack).toHaveLength(1);
      expect(actualNewState.formSchema).toBe(actualNewState.formSchemaStack[0]);
    });

    it('Initialising empty stack with follow up type', () => {
      const actualNewState = reducer(
        initialState,
        initFormStack('select-link', 'admin')
      );

      expect(actualNewState.formSchema.type).toBe('select-link');
      expect(actualNewState.formSchema.nextType).toBe('admin');
      expect(actualNewState.formSchemaStack).toHaveLength(1);
      expect(actualNewState.formSchema).toBe(actualNewState.formSchemaStack[0]);
    });

    it('Re-initialising stack', () => {
      let actualNewState = reducer(
        initialState,
        pushFormStackEntry('admin')
      );

      actualNewState = reducer(
        actualNewState,
        initFormStack('select-link', 'admin')
      );

      expect(actualNewState.formSchema.type).toBe('select-link');
      expect(actualNewState.formSchema.nextType).toBe('admin');
      expect(actualNewState.formSchemaStack).toHaveLength(1);
      expect(actualNewState.formSchema).toBe(actualNewState.formSchemaStack[0]);
    });
  });

  describe('Pushing Form stack', () => {
    it('Pushing a new form on the stack', () => {
      const actualNewState = reducer(
        initialState,
        pushFormStackEntry('admin')
      );

      expect(actualNewState.formSchema.type).toBe('admin');
      expect(actualNewState.formSchema.nextType).toBeFalsy();
      expect(actualNewState.formSchemaStack).toHaveLength(1);
      expect(actualNewState.formSchema).toBe(actualNewState.formSchemaStack[0]);
    });

    it('Pushing a new form with a follow up type on the stack', () => {
      const actualNewState = reducer(
        initialState,
        pushFormStackEntry('select-link', 'admin')
      );

      expect(actualNewState.formSchema.type).toBe('select-link');
      expect(actualNewState.formSchema.nextType).toBe('admin');
      expect(actualNewState.formSchemaStack).toHaveLength(1);
      expect(actualNewState.formSchema).toBe(actualNewState.formSchemaStack[0]);
    });

    it('Pushing 2 new forms on the stack', () => {
      let actualNewState = reducer(
        initialState,
        pushFormStackEntry('admin')
      );

      actualNewState = reducer(
        actualNewState,
        pushFormStackEntry('select-link', 'admin')
      );

      expect(actualNewState.formSchema.type).toBe('select-link');
      expect(actualNewState.formSchema.nextType).toBe('admin');
      expect(actualNewState.formSchemaStack).toHaveLength(2);
      expect(actualNewState.formSchema).toBe(actualNewState.formSchemaStack[1]);
    });
  });

  describe('Poping Form stack', () => {
    it('Poping empty form stack', () => {
      const actualNewState = reducer(
        initialState,
        popFormStackEntry()
      );

      expect(actualNewState.formSchema).toBeFalsy();
      expect(actualNewState.formSchemaStack).toHaveLength(0);
    });

    it('Poping form stack with 1 entry', () => {
      let actualNewState = reducer(
        initialState,
        pushFormStackEntry('admin')
      );
      actualNewState = reducer(
        actualNewState,
        popFormStackEntry()
      );

      expect(actualNewState.formSchema).toBeFalsy();
      expect(actualNewState.formSchemaStack).toHaveLength(0);
    });

    it('Poping form stack with 2 entries', () => {
      let actualNewState = reducer(
        initialState,
        pushFormStackEntry('admin')
      );
      actualNewState = reducer(
        actualNewState,
        pushFormStackEntry('select-link', 'admin')
      );
      actualNewState = reducer(
        actualNewState,
        popFormStackEntry()
      );

      expect(actualNewState.formSchema.type).toBe('admin');
      expect(actualNewState.formSchema.nextType).toBeFalsy();
      expect(actualNewState.formSchemaStack).toHaveLength(1);
      expect(actualNewState.formSchema).toBe(actualNewState.formSchemaStack[0]);
    });
  });

  describe('Resetting to initial state', () => {
    it('Reseting form stack with 2 entries', () => {
      let actualNewState = reducer(
        initialState,
        pushFormStackEntry('admin')
      );
      actualNewState = reducer(
        actualNewState,
        pushFormStackEntry('select-link', 'admin')
      );
      actualNewState = reducer(
        actualNewState,
        reset()
      );

      expect(actualNewState.formSchema).toBeFalsy();
      expect(actualNewState.imageSizePresets).toHaveLength(0);
      expect(actualNewState.formSchemaStack).toHaveLength(0);
    });

    it('Selecting a different', () => {
      let actualNewState = reducer(
        initialState,
        pushFormStackEntry('select-link', 'admin')
      );
      actualNewState = reducer(
        actualNewState,
        pushFormStackEntry('admin')
      );
      actualNewState = reducer(
        actualNewState,
        resetFormStack()
      );

      expect(actualNewState.formSchema.type).toBe('select-link');
      expect(actualNewState.formSchema.nextType).toBe('admin');
      expect(actualNewState.formSchemaStack).toHaveLength(1);
      expect(actualNewState.formSchema).toBe(actualNewState.formSchemaStack[0]);
    });
  });

  describe('Stashing form data', () => {
    const formIdentifier = 'AssetAdmin.EditorForm.fileInsertForm';
    const schemaUrl = 'admin/assets/schema/fileInsertForm';

    const stashFn = stashFormValues(formIdentifier, schemaUrl);

    it('Values are stash if they exist on the redux-form store', () => {
      const dispatch = jest.fn();
      const values = {
        foo: 'bar'
      };
      const fields = [{
        name: 'foo',
        id: 'foo',
        type: 'text',
        schemaType: 'Text'
      }];

      let state = setIn({}, `form.formState.${formIdentifier}.values`, values);
      state = setIn(state, `form.formSchemas.${schemaUrl}.schema.fields`, fields);

      stashFn(dispatch, () => state);

      expect(dispatch).toHaveBeenCalledWith({
        type: SCHEMA_ACTION_TYPES.SET_SCHEMA_STATE_OVERRIDES,
        payload: {
          id: schemaUrl,
          stateOverride: {
            fields: [{
              name: 'foo',
              value: 'bar'
            }]
          }
        },
      });
    });

    it('Nothing happens if values don\'t exist on redux-form store', () => {
      const dispatch = jest.fn();
      const state = setIn({}, 'form.formState', {});
      stashFn(dispatch, () => (state));

      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});


import ACTION_TYPES from './ModalActionTypes';
import getIn from 'redux-form/lib/structure/plain/getIn';
import { setSchemaStateOverrides } from 'state/schema/SchemaActions';
import isStashableField from './helpers';

/**
 * @typedef {import('types/ImageSizePreset').ImageSizePreset} ImageSizePreset
 */

/**
 * Define the image size presets for the modal
 *
 * @param {ImageSizePreset[]} List of image size presets
 */
export function defineImageSizePresets(imageSizePresets) {
  return {
    type: ACTION_TYPES.DEFINE_IMAGE_SIZE_PRESETS,
    payload: { imageSizePresets },
  };
}

/**
 * Stash the form data as a form schema override so the user doesn't loose their changes.
 * @param {string} formIdentifier Redux-Form form name
 * @param {string} schemaUrl Full schema URL where to store the schema overrides
 * @returns {function(...[*]=)}
 */
export function stashFormValues(formIdentifier, schemaUrl) {
  // This need to be run as a thunk because we need getState to get the full state
  return (dispatch, getState) => {
    const state = getState();
    const values = getIn(state.form.formState, `${formIdentifier}.values`);
    const fieldSchema = getIn(state.form.formSchemas, `${schemaUrl}.schema.fields`);

    if (values) {
      const fields = Object
        .keys(values)
        .filter(name => values[name] !== null && isStashableField(name, fieldSchema))
        .map(name => ({ name, value: values[name] }));

      dispatch(setSchemaStateOverrides(schemaUrl, { fields }));
    }
  };
}

/**
 * Display a new form in the Editor.
 * @param {string} type Type of the next form
 * @param {string|undefined} nextType Possible type of the next next form
 */
export function pushFormStackEntry(type, nextType = undefined) {
  return ({
    type: ACTION_TYPES.PUSH_FORM_SCHEMA,
    payload: { formSchema: { type, nextType } },
  });
}

/**
 * Initialise the form schema stack.
 * @param {string} type Type of the next form
 * @param {string|undefined} nextType Possible type of the next next form
 */
export function initFormStack(type, nextType = undefined) {
  return ({
    type: ACTION_TYPES.INIT_FORM_SCHEMA_STACK,
    payload: { formSchema: { type, nextType } },
  });
}

/**
 * Define the image size presets for the modal
 *
 * @param {ImageSizePreset[]} List of image size presets
 */
export function popFormStackEntry() {
  return { type: ACTION_TYPES.POP_FORM_SCHEMA };
}

/**
 * Reset Modal state to the initial state.
 */
export function reset() {
  return { type: ACTION_TYPES.RESET };
}

/**
 * Define the image size presets for the modal.
 */
export function resetFormStack() {
  return { type: ACTION_TYPES.RESET_FORM_STACK };
}

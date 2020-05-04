import ACTION_TYPES from './ModalActionTypes';

/**
 * @typedef {import('types/ImageSizePreset').ImageSizePreset} ImageSizePreset
 */

/**
 * The Modal FormSchemaStack can contains a list of forms. This allows you to push new forms on
 * top of the stack and transition the Editor to a different form. When the form stack is "pop"
 * the user is returned to the previous form they were editing. In practice, this is only used
 * when inserting media to transition to the edit file form. But it could be used for other
 * purposes.
 *
 * @typedef FormSchemaStackEntry
 * @type { Object }
 * @property { string } type The current form type
 * @property { string|undefined } nextType A possible follow up form type
 */

/**
 * @typedef ModalState
 * @type { Object }
 * @property { ImageSizePreset[] } imageSizePresets
 * @property { FormSchemaStackEntry[] } formSchemaStack
 * @property { FormSchemaStackEntry| undefined } formSchema
 */

/**
 * @typedef {ModalState} ModalStateWithFormSchema
 * @property {FormSchemaStackEntry} formSchema - The parent element
 */

/**
 * Initial base state
 * @type { ModalState }
 */
export const initialState = {
  imageSizePresets: [],
  formSchemaStack: [],
  formSchema: undefined
};

/**
 * @param { ModalState } state
 * @param { string } type
 * @param { Object } payload
 * @returns { ModalState }
 */
function modalReducer(state = initialState, { type, payload }) {
  const { formSchemaStack: stack } = state;

  switch (type) {
    case ACTION_TYPES.DEFINE_IMAGE_SIZE_PRESETS:
      return { ...state, imageSizePresets: payload.imageSizePresets };
    case ACTION_TYPES.PUSH_FORM_SCHEMA:
      return { ...state, formSchemaStack: [...stack, payload.formSchema] };
    case ACTION_TYPES.INIT_FORM_SCHEMA_STACK:
      return { ...state, formSchemaStack: [payload.formSchema] };
    case ACTION_TYPES.POP_FORM_SCHEMA:
      return { ...state, formSchemaStack: stack.slice(0, -1) };
    case ACTION_TYPES.RESET:
      return initialState;
    case ACTION_TYPES.RESET_FORM_STACK:
      return { ...state, formSchemaStack: stack.slice(0, 1) };
    default:
      return state;
  }
}

/**
 * Convenience method to return the top of the stack.
 * @param { ModalState } state
 * @returns {ModalStateWithFormSchema}
 */
const popFormSchemaStackWrapper = (state) => ({
  ...state,
  formSchema: state.formSchemaStack.slice(-1).pop()
});

export default (...args) => popFormSchemaStackWrapper(modalReducer(...args));

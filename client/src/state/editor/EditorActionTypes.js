// Action type constants, of the form
// EDITOR.SET_EDITOR_FIELDS === 'EDITOR.SET_EDITOR_FIELDS'

export default [
  'UPDATE_FORM_STATE',
  'SET_FILE',
].reduce((obj, item) => Object.assign(obj, { [item]: `EDITOR.${item}` }), {});

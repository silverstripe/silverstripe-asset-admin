// Action type constants, of the form
// EDITOR.SET_EDITOR_FIELDS === 'EDITOR.SET_EDITOR_FIELDS'

export default [
  'SET_EDITOR_FIELDS',
  'UPDATE_EDITOR_FIELD',
  'SET_OPEN_FILE',
  'HIDE',
].reduce((obj, item) => Object.assign(obj, { [item]: `EDITOR.${item}` }), {});

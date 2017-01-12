// Action type constants, of the form
// GALLERY.ADD_FILES === 'GALLERY.ADD_FILES'

export default [
  'DESELECT_FILES',
  'SELECT_FILES',
  'LOAD_FILE_REQUEST',
  'LOAD_FILE_SUCCESS',
  'HIGHLIGHT_FILES',
  'UPDATE_BATCH_ACTIONS',
  'SET_NOTICE_MESSAGE',
  'SET_ERROR_MESSAGE',
].reduce((obj, item) => Object.assign(obj, { [item]: `GALLERY.${item}` }), {});

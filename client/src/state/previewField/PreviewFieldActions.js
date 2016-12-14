import ACTION_TYPES from './PreviewFieldActionTypes';

export function removeFile(id) {
  return {
    type: ACTION_TYPES.PREVIEWFIELD_REMOVE_FILE,
    payload: { id },
  };
}

export function addFile(id, file) {
  return {
    type: ACTION_TYPES.PREVIEWFIELD_ADD_FILE,
    payload: { id, file },
  };
}

export function failUpload(id, message) {
  return {
    type: ACTION_TYPES.PREVIEWFIELD_FAIL_UPLOAD,
    payload: { id, message },
  };
}

export function updateFile(id, data) {
  return {
    type: ACTION_TYPES.PREVIEWFIELD_UPDATE_FILE,
    payload: { id, data },
  };
}

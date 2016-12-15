import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './PreviewFieldActionTypes';

const initialState = {};

function previewFieldReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.PREVIEWFIELD_ADD_FILE: {
      return deepFreeze(Object.assign({}, state, {
        [action.payload.id]: action.payload.file,
      }));
    }

    case ACTION_TYPES.PREVIEWFIELD_FAIL_UPLOAD: {
      return deepFreeze(Object.assign({}, state, {
        [action.payload.id]: Object.assign({}, state[action.payload.id], action.payload.message),
      }));
    }

    case ACTION_TYPES.PREVIEWFIELD_REMOVE_FILE: {
      return deepFreeze(Object.assign({}, state, {
        [action.payload.id]: undefined,
      }));
    }

    case ACTION_TYPES.PREVIEWFIELD_UPDATE_FILE: {
      return deepFreeze(Object.assign({}, state, {
        [action.payload.id]: Object.assign({}, state[action.payload.id], action.payload.data),
      }));
    }

    default:
      return state;
  }
}

export default previewFieldReducer;

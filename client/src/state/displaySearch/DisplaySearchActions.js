import ACTION_TYPES from './DisplaySearchActionTypes';

export function toggleSearch() {
  return {
    type: ACTION_TYPES.TOGGLE_SEARCH,
    payload: null,
  };
}

export function openSearch() {
  return {
    type: ACTION_TYPES.OPEN_SEARCH,
    payload: null,
  };
}

export function closeSearch() {
  return {
    type: ACTION_TYPES.CLOSE_SEARCH,
    payload: null,
  };
}

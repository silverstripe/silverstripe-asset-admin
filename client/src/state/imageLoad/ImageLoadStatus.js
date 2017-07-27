export default {
  DISABLED: 'DISABLED', // Preloading disabled for this record
  NONE: 'NONE', // Not started
  SUCCESS: 'SUCCESS',
  LOADING: 'LOADING',
  WAITING: 'WAITING', // Failed and waiting to retry
  FAILED: 'FAILED', // File could not be loaded and all re-attempts expired (never loadable)
};

import i18n from 'i18n';

/**
 * Convert an http status code to a message
 *
 * @param { int } statusCode
 * @param { XMLHttpRequest } xhr - optional xhr response for custom validation messages
 */
export default function getStatusCodeMessage(statusCode, xhr) {
  if (statusCode === 413) {
    return i18n._t('AssetAdmin.ERROR_FILE_SIZE', 'File size limit exceeded');
  }

  // check for validation messages
  if (statusCode === 403) {
    if (xhr && typeof xhr.response === 'string') {
      return xhr.response;
    }
  }

  return i18n._t('AssetAdmin.ERROR_DEFAULT', 'Something went wrong, please try again');
}

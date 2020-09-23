import i18n from 'i18n';

/**
 * Convert an http status code to a message
 *
 * @param { int } statusCode
 */
export default function getStatusCodeMessage(statusCode) {
  if (statusCode === 413) {
    return i18n._t('AssetAdmin.ERROR_FILE_SIZE', 'File size limit exceeded');
  }
  return i18n._t('AssetAdmin.ERROR_DEFAULT', 'Something went wrong, please try again');
}

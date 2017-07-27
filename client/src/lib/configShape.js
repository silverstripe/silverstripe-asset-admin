import { PropTypes } from 'react';

const configShape = PropTypes.shape({
  url: PropTypes.string,
  limit: PropTypes.number,
  imageRetry: PropTypes.shape({
    minRetry: PropTypes.number,
    maxRetry: PropTypes.number,
    expiry: PropTypes.number,
  }),
  form: PropTypes.object,
  dropzoneOptions: PropTypes.object,
});

export default configShape;

import { PropTypes } from 'react';

const configShape = PropTypes.shape({
  url: PropTypes.string,
  limit: PropTypes.number,
  form: PropTypes.object,
  dropzoneOptions: PropTypes.object,
});

export default configShape;

import PropTypes from 'prop-types';

const fileShape = PropTypes.shape({
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  canView: PropTypes.bool,
  exists: PropTypes.bool,
  type: PropTypes.string,
  smallThumbnail: PropTypes.string,
  thumbnail: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  category: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  id: PropTypes.number,
  url: PropTypes.string,
  title: PropTypes.string,
  progress: PropTypes.number,
  visibility: PropTypes.string,
  hasRestrictedAccess: PropTypes.bool,
  isTrackedFormUpload: PropTypes.bool
});

export default fileShape;

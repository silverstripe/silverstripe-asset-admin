import React from 'react';

const fileShape = React.PropTypes.shape({
  canEdit: React.PropTypes.bool,
  canDelete: React.PropTypes.bool,
  canView: React.PropTypes.bool,
  exists: React.PropTypes.bool,
  type: React.PropTypes.string,
  smallThumbnail: React.PropTypes.string,
  thumbnail: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  category: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.string]),
  id: React.PropTypes.number,
  url: React.PropTypes.string,
  title: React.PropTypes.string,
  progress: React.PropTypes.number,
});

export default fileShape;

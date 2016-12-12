import React from 'react';

const fileShape = React.PropTypes.shape({
  exists: React.PropTypes.bool,
  type: React.PropTypes.string,
  smallThumbnail: React.PropTypes.string,
  thumbnail: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  category: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.string]).isRequired,
  id: React.PropTypes.number.isRequired,
  url: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  progress: React.PropTypes.number,
});

export default fileShape;

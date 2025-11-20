import React from 'react';
import PropTypes from 'prop-types';
import Back from 'components/BackButton/BackButton';

/**
 * Gallery Toolbar Back button.
 *
 * @returns {XML|null} button
 */
const BackButton = ({
  folder,
  badges,
  BackComponent = Back,
  onOpenFolder,
}) => {
  const handleBackClick = (event) => {
    event.preventDefault();
    if (typeof onOpenFolder === 'function') {
      onOpenFolder(folder.parentId);
    }
  };

  const { parentId: itemId } = folder;
  if (itemId === null) {
    return null;
  }
  const badge = badges.find((item) => item.id === itemId);
  return (
    <div className="gallery__back-container">
      <BackComponent
        item={{ id: itemId }}
        onClick={handleBackClick}
        badge={badge}
      />
    </div>
  );
};

BackButton.propTypes = {
  folder: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    parentId: PropTypes.number,
    canView: PropTypes.bool,
    canEdit: PropTypes.bool,
  }).isRequired,
  badges: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    message: PropTypes.node,
    status: PropTypes.string,
  })).isRequired,
  onOpenFolder: PropTypes.func.isRequired,
  BackComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

export default BackButton;

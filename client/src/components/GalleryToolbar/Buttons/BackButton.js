import React, { PropTypes } from 'react';
import Back from 'components/BackButton/BackButton';

export function onClick(onOpenFolder, folder) {
  /**
   * Handles browsing back/up one folder
   *
   * @param {Event} event
   */
  return function handleBackClick(event) {
    event.preventDefault();
    onOpenFolder(folder.parentId);
  };
}
/**
 * Gallery Toolbar Back button.
 *
 * @returns {XML|null} button
 */
function BackButton({
  folder,
  badges,
  onOpenFolder,
  handleMoveFiles,
}) {
  const { parentId: itemId } = folder;
  if (itemId !== null) {
    const badge = badges.find((item) => item.id === itemId);
    return (
      <div className="gallery__back-container">
        <Back
          item={{ id: itemId }}
          onClick={onClick(onOpenFolder, folder)}
          onDropFiles={handleMoveFiles}
          badge={badge}
        />
      </div>
    );
  }
  return null;
}

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
  handleMoveFiles: PropTypes.func.isRequired,
};

export default BackButton;

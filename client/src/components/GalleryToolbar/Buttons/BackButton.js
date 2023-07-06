import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Back from 'components/BackButton/BackButton';

/**
 * Gallery Toolbar Back button.
 *
 * @returns {XML|null} button
 */
class BackButton extends Component {
  constructor(props) {
    super(props);
    this.handleBackClick = this.handleBackClick.bind(this);
  }

  handleBackClick(event) {
    const { onOpenFolder, folder } = this.props;

    event.preventDefault();
    if (typeof onOpenFolder === 'function') {
      onOpenFolder(folder.parentId);
    }
  }

  render() {
    const {
      folder,
      badges,
      onMoveFiles,
      BackComponent
    } = this.props;
    const { parentId: itemId } = folder;
    if (itemId === null) {
      return null;
    }
    const badge = badges.find((item) => item.id === itemId);
    return (
      <div className="gallery__back-container">
        <BackComponent
          item={{ id: itemId }}
          onClick={this.handleBackClick}
          onDropFiles={onMoveFiles}
          badge={badge}
        />
      </div>
    );
  }
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
  onMoveFiles: PropTypes.func.isRequired,
  BackComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

BackButton.defaultProps = {
  BackComponent: Back,
};

export default BackButton;

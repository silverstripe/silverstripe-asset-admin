import React, { PropTypes, Component } from 'react';
import droppable from 'components/GalleryItem/droppable';
import Badge from 'components/Badge/Badge';

// eslint-disable-next-line react/prefer-stateless-function
class BackButton extends Component {
  render() {
    const classList = [
      'btn',
      'btn-secondary',
      'btn--no-text',
      'font-icon-level-up',
      'btn--icon-large',
      'gallery__back',
    ];

    if (this.props.enlarged) {
      classList.push('z-depth-1');
      classList.push('gallery__back--droppable-hover');
    }

    const badge = this.props.badge;

    return (
      <button
        className={classList.join(' ')}
        title="Navigate up a level"
        onClick={this.props.onClick}
      >
        {!!badge &&
        <Badge
          className="gallery__back-badge"
          status={badge.status}
          message={badge.message}
        />
        }
      </button>
    );
  }
}

BackButton.propTypes = {
  onClick: PropTypes.func,
  enlarged: PropTypes.bool,
  badge: PropTypes.shape(Badge.propTypes),
};

export { BackButton };

export default droppable('GalleryItem')(BackButton);

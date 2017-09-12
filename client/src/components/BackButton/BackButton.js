import React, { PropTypes } from 'react';
import droppable from 'components/GalleryItem/droppable';
import Badge from 'components/Badge/Badge';
import i18n from 'i18n';

const BackButton = (props) => {
  const classList = [
    'btn',
    'btn-secondary',
    'btn--no-text',
    'font-icon-level-up',
    'btn--icon-large',
    'gallery__back',
  ];

  if (props.enlarged) {
    classList.push('z-depth-1');
    classList.push('gallery__back--droppable-hover');
  }

  const badge = props.badge;

  return (
    <button
      className={classList.join(' ')}
      title={i18n._t('AssetAdmin.BACK_DESCRIPTION', 'Navigate up a level')}
      onClick={props.onClick}
    >
      {Boolean(badge) &&
      <Badge
        className="gallery__back-badge"
        status={badge.status}
        message={badge.message}
      />
      }
    </button>
  );
};

BackButton.propTypes = {
  onClick: PropTypes.func,
  enlarged: PropTypes.bool,
  badge: PropTypes.shape(Badge.propTypes),
};

export { BackButton as Component };

export default droppable('GalleryItem')(BackButton);

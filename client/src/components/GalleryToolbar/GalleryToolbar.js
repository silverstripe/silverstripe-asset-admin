import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BackButtonDefault from './Buttons/BackButton';
import UploadButtonDefault from './Buttons/UploadButton';
import AddFolderButtonDefault from './Buttons/AddFolderButton';

const GalleryToolbar = ({
  badges,
  children,
  folder,
  onOpenFolder,
  onCreateFolder,
  onSort,
  onViewChange,
  view = 'tile',
  sort,
  sorters,
  BackButton = BackButtonDefault,
  UploadButton = UploadButtonDefault,
  AddFolderButton = AddFolderButtonDefault,
}) => {
  /**
   * Handler for when the sorter dropdown value is changed
   *
   * @param {Event} event
   */
  const handleSelectSort = (event) => {
    onSort(event.currentTarget.value);
  };

  /**
   * Handles changing the view type when the view button is clicked
   *
   * @param event
   */
  const handleViewChange = (event) => {
    const viewValue = event.currentTarget.value;

    onViewChange(viewValue);
  };

  /**
   * Generates the react components needed for the Sorter part of this component
   *
   * @returns {XML}
   */
  const renderSort = () => {
    if (view !== 'tile') {
      return null;
    }

    return (
      <div className="gallery__sort fieldholder-small">
        <select
          className="dropdown no-change-track no-chzn"
          tabIndex="0"
          style={{ width: '160px' }}
          defaultValue={sort}
        >
          {sorters.map((sorter) => {
            // upper case first letter of words
            const label = sorter.label.replace(/^\w|[\s\-]+\w/g, c => c.toUpperCase());
            return (
              <option
                key={`${sorter.field}-${sorter.direction}`}
                onClick={handleSelectSort}
                data-field={sorter.field}
                data-direction={sorter.direction}
                value={`${sorter.field},${sorter.direction}`}
              >
                {label}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  /**
   * Renders the react component buttons for changing the view that is currently being used
   *
   * @returns {Array} buttons
   */
  const renderViewChangeButtons = () => {
    const views = ['tile', 'table'];
    return views.map((viewButton) => {
      const icon = (viewButton === 'table') ? 'list' : 'thumbnails';
      const classNames = [
        'gallery__view-change-button',
        'btn btn-secondary',
        'btn--icon-sm',
        'btn--no-text',
      ];

      if (viewButton === view) {
        return null;
      }
      return (
        <button
          id={`button-view-${viewButton}`}
          key={viewButton}
          className={classNames.join(' ')}
          type="button"
          title="Change view gallery/list"
          onClick={handleViewChange}
          value={viewButton}
        >
          <span className={`font-icon-${icon}`} aria-hidden="true" />
        </button>
      );
    });
  };

  const { canEdit } = folder;

  return (
    <div className="toolbar--content toolbar--space-save">
      <div className="fill-width">
        <div className="gallery__btn-toolbar flexbox-area-grow">
          <div className="btn-toolbar">
            <BackButton
              folder={folder}
              badges={badges}
              onOpenFolder={onOpenFolder}
            />
            <UploadButton
              canEdit={canEdit}
            />
            <AddFolderButton
              canEdit={canEdit}
              onCreateFolder={onCreateFolder}
            />
            {children}
          </div>
        </div>

        <div className="gallery__state-buttons">
          {renderSort()}
          <div className="btn-group" role="group" aria-label="View mode">
            {renderViewChangeButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

GalleryToolbar.propTypes = {
  onCreateFolder: PropTypes.func.isRequired,
  onViewChange: PropTypes.func.isRequired,
  onOpenFolder: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  folder: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    parentId: PropTypes.number,
    canView: PropTypes.bool,
    canEdit: PropTypes.bool,
  }).isRequired,
  view: PropTypes.oneOf(['tile', 'table']),
  sort: PropTypes.string,
  badges: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    message: PropTypes.node,
    status: PropTypes.string,
  })),
  BackButton: PropTypes.elementType,
  UploadButton: PropTypes.elementType,
  AddFolderButton: PropTypes.elementType,
};

function mapStateToProps(state, ownProps) {
  let { sort } = ownProps;

  const {
    badges,
    sorters,
  } = state.assetAdmin.gallery;

  // set default sort
  if (sort === '') {
    sort = `${sorters[0].field},${sorters[0].direction}`;
  }
  return { badges, sorters, sort };
}

export {
  GalleryToolbar as Component,
};

export default connect(mapStateToProps)(GalleryToolbar);

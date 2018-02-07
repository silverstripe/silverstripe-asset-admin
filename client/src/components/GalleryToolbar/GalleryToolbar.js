import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import BackButtonDefault from './Buttons/BackButton';
import UploadButtonDefault from './Buttons/UploadButton';
import AddFolderButtonDefault from './Buttons/AddFolderButton';

class GalleryToolbar extends Component {
  constructor(props) {
    super(props);
    this.handleSelectSort = this.handleSelectSort.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
  }

  /**
   * Handler for when the sorter dropdown value is changed
   *
   * @param {Event} event
   */
  handleSelectSort(event) {
    this.props.onSort(event.currentTarget.value);
  }

  /**
   * Handles changing the view type when the view button is clicked
   *
   * @param event
   */
  handleViewChange(event) {
    const view = event.currentTarget.value;

    this.props.onViewChange(view);
  }

  /**
   * Generates the react components needed for the Sorter part of this component
   *
   * @returns {XML}
   */
  renderSort() {
    if (this.props.view !== 'tile') {
      return null;
    }
    return (
      <div className="gallery__sort fieldholder-small">
        <select
          className="dropdown no-change-track no-chzn"
          tabIndex="0"
          style={{ width: '160px' }}
          defaultValue={this.props.sort}
        >
          {this.props.sorters.map((sorter) => (
            <option
              key={`${sorter.field}-${sorter.direction}`}
              onClick={this.handleSelectSort}
              data-field={sorter.field}
              data-direction={sorter.direction}
              value={`${sorter.field},${sorter.direction}`}
            >
              {sorter.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  /**
   * Renders the react component buttons for changing the view that is currently being used
   *
   * @returns {Array} buttons
   */
  renderViewChangeButtons() {
    const views = ['tile', 'table'];
    return views.map((view) => {
      const icon = (view === 'table') ? 'list' : 'thumbnails';
      const classNames = [
        'gallery__view-change-button',
        'btn btn-secondary',
        'btn--icon-sm',
        'btn--no-text',
      ];

      if (view === this.props.view) {
        return null;
      }
      classNames.push(`font-icon-${icon}`);
      return (
        <button
          id={`button-view-${view}`}
          key={view}
          className={classNames.join(' ')}
          type="button"
          title="Change view gallery/list"
          onClick={this.handleViewChange}
          value={view}
        />
      );
    });
  }

  render() {
    const {
      badges,
      children,
      folder,
      onMoveFiles,
      onOpenFolder,
      onCreateFolder,
      // Button components
      BackButton,
      UploadButton,
      AddFolderButton,
    } = this.props;

    const { canEdit } = folder;

    return (
      <div className="toolbar--content toolbar--space-save">
        <div className="fill-width">
          <div className="flexbox-area-grow">
            <div className="btn-toolbar">
              <BackButton
                folder={folder}
                badges={badges}
                onOpenFolder={onOpenFolder}
                onMoveFiles={onMoveFiles}
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
            {this.renderSort()}
            <div className="btn-group" role="group" aria-label="View mode">
              {this.renderViewChangeButtons()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GalleryToolbar.propTypes = {
  onMoveFiles: PropTypes.func.isRequired,
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
  BackButton: PropTypes.func,
  UploadButton: PropTypes.func,
  AddFolderButton: PropTypes.func,
};

GalleryToolbar.defaultProps = {
  view: 'tile',
  BackButton: BackButtonDefault,
  UploadButton: UploadButtonDefault,
  AddFolderButton: AddFolderButtonDefault,
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

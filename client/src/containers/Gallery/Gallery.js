// TODO pull out jQuery library to separate HOC
import $ from 'jQuery';
import i18n from 'i18n';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import AssetDropzone from 'components/AssetDropzone/AssetDropzone';
import BulkActions from 'components/BulkActions/BulkActions';
import ThumbnailView from 'containers/ThumbnailView/ThumbnailView';
import TableView from 'containers/TableView/TableView';
import CONSTANTS from 'constants/index';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as queuedFilesActions from 'state/queuedFiles/QueuedFilesActions';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

/**
 * List of sorters for tile view, required here because it's rendered outside the tile view
 * component
 *
 * @todo Use lowercase identifiers once we can map them in the silverstripe/graphql module
 *
 * @type {array} sorters
 */
const sorters = [
  {
    field: 'title',
    direction: 'asc',
    label: i18n._t('AssetAdmin.FILTER_TITLE_ASC', 'title a-z'),
  },
  {
    field: 'title',
    direction: 'desc',
    label: i18n._t('AssetAdmin.FILTER_TITLE_DESC', 'title z-a'),
  },
  {
    field: 'lastEdited',
    direction: 'desc',
    label: i18n._t('AssetAdmin.FILTER_DATE_DESC', 'newest'),
  },
  {
    field: 'lastEdited',
    direction: 'asc',
    label: i18n._t('AssetAdmin.FILTER_DATE_ASC', 'oldest'),
  },
];

class Gallery extends Component {

  constructor(props) {
    super(props);

    this.handleOpenFolder = this.handleOpenFolder.bind(this);
    this.handleOpenFile = this.handleOpenFile.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectSort = this.handleSelectSort.bind(this);
    this.handleAddedFile = this.handleAddedFile.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.handleRemoveErroredUpload = this.handleRemoveErroredUpload.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleSending = this.handleSending.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
    this.handleSuccessfulUpload = this.handleSuccessfulUpload.bind(this);
    this.handleFailedUpload = this.handleFailedUpload.bind(this);
    this.handleCreateFolder = this.handleCreateFolder.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
  }

  componentDidMount() {
    this.initSortDropdown();
  }

  componentWillReceiveProps(nextProps) {
    // turn off chosen.js
    if (nextProps.view !== 'tile') {
      const $select = this.getSortElement();

      $select.off('change');
    }

    // If props.files has changed, flush any uploaded files.
    // The render() logic will merge queuedFiles into the props.files array
    // until this is called, leaving completed uploads temporarily in the current view,
    // even if they're technically not part of props.files.
    if (this.compareFiles(this.props.files, nextProps.files)) {
      nextProps.actions.queuedFiles.purgeUploadQueue();
    }

    this.checkLoadingIndicator();
  }

  componentDidUpdate() {
    this.initSortDropdown();
  }

  /**
   * Gets the element which represents the sorter dropdown for jQuery plugin usage
   *
   * @returns {jQuery}
   */
  getSortElement() {
    return $(ReactDOM.findDOMNode(this)).find('.gallery__sort .dropdown');
  }

  /**
   * Required anti-pattern, because `.cms-content` is the container for the React component.
   *
   * Adds or removes the load class from `.cms-content` if it is for the AssetAdmin
   */
  checkLoadingIndicator() {
    const $sectionWrapper = $('.cms-content.AssetAdmin');
    if (!$sectionWrapper.length) {
      return;
    }

    if (this.props.loading) {
      $sectionWrapper.addClass('loading');
    } else {
      $sectionWrapper.removeClass('loading');
    }
  }

  /**
   * Compare two lists to see if equal
   *
   * @param {Array} left
   * @param {Array} right
   * @return {Boolean}
   */
  compareFiles(left, right) {
    if ((left && !right) || (!left && right)) {
      return true;
    }
    if (left.length !== right.length) {
      return true;
    }
    for (let i = 0; i < left.length; i++) {
      if (left[i].id !== right[i].id) {
        return true;
      }
    }
    return false;
  }

  initSortDropdown() {
    // turn on chosen if required
    if (this.props.view === 'tile') {
      const $select = this.getSortElement();

      // We opt-out of letting the CMS handle Chosen because it doesn't
      // re-apply the behaviour correctly.
      // So after the gallery has been rendered we apply Chosen.
      $select.chosen({
        allow_single_deselect: true,
        disable_search_threshold: 20,
      });

      // Chosen stops the change event from reaching React so we have to simulate a click.
      $select.on('change', () => ReactTestUtils.Simulate.click($select.find(':selected')[0]));
    }
  }

   /**
   * Handler for when the user changes the sort order
   *
   * @param {string} value
   */
  handleSort(value) {
    this.props.actions.queuedFiles.purgeUploadQueue();
    this.props.onSort(value);
    // this will flow round to `componentWillReceiveProps` and update sort there.
  }

  /**
   * Handler for when the sorter dropdown value is changed
   *
   * @param {Event} event
   */
  handleSelectSort(event) {
    this.handleSort(event.currentTarget.value);
  }

  /**
   * Handles setting the pagination page number
   *
   * @param {number} page
   */
  handleSetPage(page) {
    this.props.onSetPage(page);
  }

  /**
   * Handles removing an upload and cancelling the request made to upload
   *
   * @param {object} fileData
   */
  handleCancelUpload(fileData) {
    fileData.xhr.abort();
    this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedId);
  }

  /**
   * Handles removing an upload that had errored during/after upload
   *
   * @param {object} fileData
   */
  handleRemoveErroredUpload(fileData) {
    this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedId);
  }

  /**
   * Handler for when a file was added to be uploaded
   *
   * @param {object} fileData
   */
  handleAddedFile(fileData) {
    this.props.actions.queuedFiles.addQueuedFile(fileData);
  }

  /**
   * Triggered just before the xhr request is sent.
   *
   * @param {Object} fileData - File interface.
   *      See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {Object} xhr
   */
  handleSending(file, xhr) {
    this.props.actions.queuedFiles.updateQueuedFile(file._queuedId, { xhr });
  }

  handleUploadProgress(file, progress) {
    this.props.actions.queuedFiles.updateQueuedFile(file._queuedId, { progress });
  }

  /**
   * Handler for when the user changes clicks the add folder button
   *
   * @param {Event} event
   */
  handleCreateFolder(event) {
    const name = this.promptFolderName();
    const parentId = parseInt(this.props.folder.id, 10);
    if (name) {
      this.props.mutate({
        mutation: 'CreateFolder',
        variables: {
          folder: {
            parentId,
            name,
          },
        },
      }).then((data) => {
        if (this.props.onCreateFolderSuccess) {
          this.props.onCreateFolderSuccess(data);
        }
      });
      // TODO Figure out how to use fields with arguments in store path
      // const dataId = this.props.client.dataId({
      //   __typename: 'Folder',
      //   id: parentId,
      // });
      // resultBehaviors: [
      //   {
      //     type: 'ARRAY_INSERT',
      //     resultPath: ['createFolder'],
      //     storePath: [dataId, 'children({"limit:15,"offset":0})'],
      //     where: 'PREPEND',
      //   },
      // ],
    }
    event.preventDefault();
  }

  /**
   * Handles successful file uploads.
   *
   * @param {Object} fileXhr - File interface.
   *      See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  handleSuccessfulUpload(fileXhr) {
    const json = JSON.parse(fileXhr.xhr.response);

    // SilverStripe send back a success code with an error message sometimes...
    if (typeof json[0].error !== 'undefined') {
      this.handleFailedUpload(fileXhr);
      return;
    }

    this.props.actions.queuedFiles.succeedUpload(fileXhr._queuedId, json[0]);

    // TODO Update GraphQL store with new model,
    // see https://github.com/silverstripe/silverstripe-graphql/issues/14
    if (this.props.onSuccessfulUpload) {
      this.props.onSuccessfulUpload(json);
    }

    // redirect to open the last uploaded file for 'insert/select modal' type only
    if (this.props.type !== 'admin'
      && !this.props.fileId
      && this.props.queuedFiles.items.length === 0
    ) {
      const lastFile = json.pop();
      this.props.onOpenFile(lastFile.id);
    }
  }

  handleFailedUpload(fileXhr, response) {
    this.props.actions.queuedFiles.failUpload(fileXhr._queuedId, response);
  }

  /**
   * Prompts for a folder name from the user
   *
   * @return {string|null}
   */
  promptFolderName() {
    // eslint-disable-next-line no-alert
    return prompt(i18n._t('AssetAdmin.PROMPTFOLDERNAME'));
  }

  /**
   * Checks if a file or folder is currently selected.
   *
   * @param {Number} id - The id of the file or folder to check.
   * @return {Boolean}
   */
  itemIsSelected(id) {
    return this.props.selectedFiles.indexOf(id) > -1;
  }

  /**
   * Checks if a file or folder is currently highlighted,
   * which typically means its own for viewing or editing.
   *
   * @param {Number} id - The id of the file or folder to check.
   * @return {Boolean}
   */
  itemIsHighlighted(id) {
    return this.props.fileId === id;
  }

  /**
   * Handles a user drilling down into a folder.
   *
   * @param {Object} event - Event object.
   * @param {Object} folder - The folder that's being activated.
   */
  handleOpenFolder(event, folder) {
    event.preventDefault();
    this.props.onOpenFolder(folder.id);
  }

  /**
   * Handles a user activating the file editor.
   *
   * @param {Object} event - Event object.
   * @param {Object} file - The file that's being activated.
   */
  handleOpenFile(event, file) {
    event.preventDefault();
    // Disable file editing if the file has not finished uploading
    // or the upload has errored.
    if (file.created === null) {
      return;
    }

    this.props.onOpenFile(file.id, file);
  }

  /**
   * Handles the user toggling the selected/deselected state of a file or folder.
   *
   * @param {Object} event - Event object.
   * @param {Object} item - The item being selected/deselected
   */
  handleSelect(event, item) {
    if (this.props.selectedFiles.indexOf(item.id) === -1) {
      this.props.actions.gallery.selectFiles([item.id]);
    } else {
      this.props.actions.gallery.deselectFiles([item.id]);
    }
  }

  /**
   * Handles browsing back/up one folder
   *
   * @param {Event} event
   */
  handleBackClick(event) {
    event.preventDefault();
    this.props.onOpenFolder(this.props.folder.parentId);
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
          {sorters.map((sorter, i) => (
            <option
              key={i}
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
   * Generates the react components needed for the Toolbar part of this component.
   *
   * @returns {XML}
   */
  renderToolbar() {
    const canEdit = this.props.folder.canEdit;

    return (
      <div className="toolbar--content toolbar--space-save">
        <div className="fill-width">
          <div className="flexbox-area-grow">
            {this.renderBackButton()}

            <button
              id="upload-button"
              className="btn btn-secondary font-icon-upload btn--icon-xl"
              type="button"
              disabled={!canEdit}
            >
              <span className="btn__text">{i18n._t('AssetAdmin.DROPZONE_UPLOAD')}</span>
            </button>

            <button
              id="add-folder-button"
              className="btn btn-secondary font-icon-folder-add btn--icon-xl"
              type="button"
              onClick={this.handleCreateFolder}
              disabled={!canEdit}
            >
              <span className="btn__text">{i18n._t('AssetAdmin.ADD_FOLDER_BUTTON')}</span>
            </button>
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

  /**
   * Renders the react component buttons for changing the view that is currently being used
   *
   * @returns {Array} buttons
   */
  renderViewChangeButtons() {
    const views = ['tile', 'table'];
    return views.map((view, index) => {
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
          key={index}
          className={classNames.join(' ')}
          type="button"
          onClick={this.handleViewChange}
          value={view}
        >
        </button>
      );
    });
  }

  /**
   * Generates the react components needed for the Back button.
   *
   * @returns {XML|null} button
   */
  renderBackButton() {
    const classes = [
      'btn',
      'btn-secondary',
      'btn--no-text',
      'font-icon-level-up',
      'btn--icon-large',
      'gallery__back',
    ].join(' ');
    if (this.props.folder.parentId !== null) {
      return (
        <button
          className={classes}
          onClick={this.handleBackClick}
          ref="backButton"
        >
        </button>
      );
    }

    return null;
  }

  /**
   * Generates the react components needed for the BulkActions part of this component.
   *
   * @returns {XML}
   */
  renderBulkActions() {
    const deleteAction = (items) => {
      items.forEach(item => this.props.onDelete(item.id));
    };
    const editAction = (items) => {
      this.props.onOpenFile(items[0].id);
    };
    const actions = CONSTANTS.BULK_ACTIONS.map((action) => {
      if (action.value === 'delete' && !action.callback) {
        return Object.assign({}, action, { callback: deleteAction });
      }
      if (action.value === 'edit' && !action.callback) {
        return Object.assign({}, action, { callback: editAction });
      }
      return action;
    });
    // Bulk actions can happen for both queuedFiles (after they've completed the upload),
    // and the actual props.files in the current view.
    // TODO Refactor "queued files" into separate visual area and remove coupling here
    const allFiles = [...this.props.files, ...this.props.queuedFiles.items];
    const selectedFileObjs = this.props.selectedFiles.map(id => allFiles.find(file => file && id === file.id));

    if (selectedFileObjs.length > 0 && this.props.type === 'admin') {
      return (
        <ReactCSSTransitionGroup
          transitionName="bulk-actions"
          transitionEnterTimeout={CONSTANTS.CSS_TRANSITION_TIME}
          transitionLeaveTimeout={CONSTANTS.CSS_TRANSITION_TIME}
        >
          <BulkActions
            actions={actions}
            items={selectedFileObjs}
            key={selectedFileObjs.length > 0}
          />
        </ReactCSSTransitionGroup>
      );
    }

    return null;
  }

  /**
   * Renders the core view for this component, the component is determined by the view property
   *
   * @returns {XML}
   */
  renderGalleryView() {
    const GalleryView = (this.props.view === 'table') ? TableView : ThumbnailView;

    const queuedFiles = this.props.queuedFiles.items
      .filter((file) => (
        // Exclude uploaded files that have been reloaded via graphql
        !file.id || !this.props.files.find((next) => (next.id === file.id))
      ))
      .map((file) => Object.assign({}, file, {
        // Queued files get removed in componentWillReceiveProps when the props.files array has changed identity,
        // which will also get rid of this flag. But intermediary render calls *after* upload might still
        // show queued files with successful uploads, hence we determine uploading status by absence of a database id.
        uploading: !(file.id > 0),
      }));
    const files = [
      // Always sort uploaded files first, even if they wouldn't show up in
      // this pagination page. They'll disappear on the next refetch() or navigation event.
      ...queuedFiles,
      ...this.props.files,
    ].map((file) => Object.assign({}, file || {}, {
      selected: this.itemIsSelected(file.id),
      highlighted: this.itemIsHighlighted(file.id),
    }));
    const {
      type,
      loading,
      page,
      totalCount,
      limit,
      sort,
    } = this.props;

    const props = {
      selectableItems: type === 'admin',
      files,
      loading,
      page,
      totalCount,
      limit,
      sort,
      onSort: this.handleSort,
      onSetPage: this.handleSetPage,
      onOpenFile: this.handleOpenFile,
      onOpenFolder: this.handleOpenFolder,
      onSelect: this.handleSelect,
      onCancelUpload: this.handleCancelUpload,
      onRemoveErroredUpload: this.handleRemoveErroredUpload,
    };

    return <GalleryView {...props} />;
  }

  render() {
    if (!this.props.folder) {
      if (this.props.errorMessage) {
        return (
          <div className="gallery__error">
            <div className="gallery__error-message">
              <h3>{ this.props.errorMessage &&
                i18n._t('AssetAdmin.DROPZONE_RESPONSE_ERROR', 'Server responded with an error.')
              }</h3>
              <p>{ this.props.errorMessage }</p>
            </div>
          </div>
        );
      }
      return null;
    }

    const dimensions = {
      height: CONSTANTS.THUMBNAIL_HEIGHT,
      width: CONSTANTS.THUMBNAIL_WIDTH,
    };
    const dropzoneOptions = {
      url: this.props.createFileApiUrl,
      method: this.props.createFileApiMethod,
      paramName: 'Upload',
      clickable: '#upload-button',
    };

    const securityID = this.props.securityId;
    const canEdit = this.props.folder.canEdit;

    const galleryClasses = [
      'panel', 'panel--padded', 'panel--scrollable', 'gallery__main',
    ];
    if (this.props.type === 'insert') {
      galleryClasses.push('insert-media-modal__main');
    }

    return (
      <div className="flexbox-area-grow gallery__outer">
        {this.renderBulkActions()}

        <AssetDropzone
          name="gallery-container"
          canUpload={canEdit}
          handleAddedFile={this.handleAddedFile}
          handleError={this.handleFailedUpload}
          handleSuccess={this.handleSuccessfulUpload}
          handleSending={this.handleSending}
          handleUploadProgress={this.handleUploadProgress}
          preview={dimensions}
          folderId={this.props.folderId}
          options={dropzoneOptions}
          securityID={securityID}
          uploadButton={false}
        >

          <div className={galleryClasses.join(' ')}>
            {this.renderToolbar()}

            {this.renderGalleryView()}
          </div>
        </AssetDropzone>
      </div>
    );
  }
}

const sharedDefaultProps = {
  page: 0,
  limit: 15,
  sort: `${sorters[0].field},${sorters[0].direction}`,
};

const sharedPropTypes = {
  loading: PropTypes.bool,
  sort: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    parent: PropTypes.shape({
      id: PropTypes.number,
    }),
  })).isRequired,
  totalCount: PropTypes.number,
  page: PropTypes.number,
  limit: PropTypes.number,
  onOpenFile: PropTypes.func.isRequired,
  onOpenFolder: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onSetPage: PropTypes.func.isRequired,
};

const galleryViewDefaultProps = Object.assign({}, sharedDefaultProps, {
  selectableItems: false,
});

const galleryViewPropTypes = Object.assign({}, sharedPropTypes, {
  selectableItems: PropTypes.bool,
  onSelect: PropTypes.func,
  onCancelUpload: PropTypes.func,
  onDelete: React.PropTypes.func,
  onRemoveErroredUpload: PropTypes.func,
});

Gallery.defaultProps = Object.assign({}, sharedDefaultProps, {
  type: 'admin',
  view: 'tile',
});

Gallery.propTypes = Object.assign({}, sharedPropTypes, {
  client: React.PropTypes.object,
  mutate: React.PropTypes.func,
  onUploadSuccess: React.PropTypes.func,
  onCreateFolderSuccess: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  type: PropTypes.oneOf(['insert', 'select', 'admin']),
  view: PropTypes.oneOf(['tile', 'table']),
  dialog: PropTypes.bool,
  fileId: PropTypes.number,
  folderId: PropTypes.number.isRequired,
  folder: PropTypes.shape({
    id: PropTypes.number,
    parentId: PropTypes.number,
    canView: PropTypes.bool,
    canEdit: PropTypes.bool,
  }),
  queuedFiles: PropTypes.shape({
    items: PropTypes.array.isRequired,
  }),
  selectedFiles: PropTypes.arrayOf(PropTypes.number),
  errorMessage: PropTypes.string,
  actions: PropTypes.object,
  securityId: PropTypes.string,
  onViewChange: PropTypes.func.isRequired,

  createFileApiUrl: PropTypes.string,
  createFileApiMethod: PropTypes.string,
});

Gallery.fragments = {
  fileInterface: gql`
   fragment FileInterfaceFields on FileInterface {
    canDelete
    canEdit
    canView
    category
    exists
    filename
    id
    lastEdited
    name
    parentId
    title
    type
    url
   }
    `,
  file: gql`
   fragment FileFields on File {
    draft
    extension
    height
    published
    size
    smallThumbnail
    thumbnail
    width
   }
    `,
};

function mapStateToProps(state) {
  const {
    selectedFiles,
    errorMessage,
  } = state.assetAdmin.gallery;

  return {
    selectedFiles,
    errorMessage,
    queuedFiles: state.assetAdmin.queuedFiles,
    securityId: state.config.SecurityID,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: bindActionCreators(galleryActions, dispatch),
      queuedFiles: bindActionCreators(queuedFilesActions, dispatch),
    },
  };
}

const createFolderMutation = gql`
  mutation CreateFolder($folder:FolderInput!) {
    createFolder(folder: $folder) {
   ...FileInterfaceFields
   ...FileFields
  }
}
${Gallery.fragments.fileInterface}
${Gallery.fragments.file}
`;

export { Gallery, sorters, galleryViewPropTypes, galleryViewDefaultProps };

export default compose(
  graphql(createFolderMutation),
  (component) => withApollo(component),
  connect(mapStateToProps, mapDispatchToProps)
)(Gallery);

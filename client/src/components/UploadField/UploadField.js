import i18n from 'i18n';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { inject } from 'lib/Injector';
import CONSTANTS from 'constants/index';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import fileShape from 'lib/fileShape';
import * as uploadFieldActions from 'state/uploadField/UploadFieldActions';

class UploadField extends Component {
  constructor(props) {
    super(props);
    this.renderChild = this.renderChild.bind(this);
    this.handleAddShow = this.handleAddShow.bind(this);
    this.handleAddHide = this.handleAddHide.bind(this);
    this.handleAddInsert = this.handleAddInsert.bind(this);
    this.handleAddedFile = this.handleAddedFile.bind(this);
    this.handleSending = this.handleSending.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleFailedUpload = this.handleFailedUpload.bind(this);
    this.handleSuccessfulUpload = this.handleSuccessfulUpload.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handleReplaceShow = this.handleReplaceShow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReplace = this.handleReplace.bind(this);

    this.state = {
      selecting: false,
      selectingItem: null,
    };
  }

  componentDidMount() {
    // Copy form schema data into redux and then ignore it
    this.props.actions.uploadField.setFiles(this.props.id, this.props.data.files);
  }

  componentWillReceiveProps(nextProps) {
    // Propegate redux state changes to redux-from value for this field
    const existingFiles = this.props.files || [];
    const newFiles = nextProps.files || [];
    const filesChanged = this.compareValues(existingFiles, newFiles);

    if (filesChanged) {
      this.handleChange(nextProps);
    }
  }

  /**
   * Check if two arrays of file objects have different id keys
   *
   * @param {Array} left
   * @param {Array} right
     */
  compareValues(left, right) {
    // Check length
    if (left.length !== right.length) {
      return true;
    }
    // Check ids appear in the same order
    for (let i = 0; i < left.length; i++) {
      if (left[i].id !== right[i].id) {
        return true;
      }
    }
    return false;
  }

  handleAddedFile(data) {
    const file = { ...data, uploaded: true };
    this.props.actions.uploadField.addFile(this.props.id, file);
  }

  /**
   * Triggered just before the xhr request is sent.
   *
   * @param {Object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {Object} xhr
   */
  handleSending(file, xhr) {
    this.props.actions.uploadField.updateQueuedFile(this.props.id, file._queuedId, { xhr });
  }

  /**
   * Update upload progress status.
   *
   * @param {Object} file
   * @param {Number} progress
   */
  handleUploadProgress(file, progress) {
    this.props.actions.uploadField.updateQueuedFile(this.props.id, file._queuedId, { progress });
  }

  /**
   * Handles successful file uploads.
   *
   * @param {Object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  handleSuccessfulUpload(file) {
    const json = JSON.parse(file.xhr.response);

    // SilverStripe send back a success code with an error message sometimes...
    if (typeof json[0].error !== 'undefined') {
      this.handleFailedUpload(file);
      return;
    }

    // @todo - Should successful uploads be moved to another state?
    this.props.actions.uploadField.succeedUpload(this.props.id, file._queuedId, json[0]);
  }

  handleFailedUpload(file, response) {
    this.props.actions.uploadField.failUpload(this.props.id, file._queuedId, response);
  }

  /**
   * Handler for removing an uploaded item
   *
   * @param {Object} event
   * @param {Object} item
   */
  handleItemRemove(event, item) {
    this.props.actions.uploadField.removeFile(this.props.id, item);
  }

  /**
   * Handler for clicking on the uploaded item
   *
   * @param {Object} event
   * @param {Object} selectingItem
   */
  handleReplaceShow(event, selectingItem) {
    this.setState({
      selecting: true,
      selectingItem,
    });
  }

  /**
   * Event called when selected value is updated
   *
   * @param {Object} props - new props to get files from
   */
  handleChange(props) {
    if (typeof props.onChange === 'function') {
      // Write back list of files to value
      const fileIds = props.files
        .filter((file) => file.id)
        .map((file) => file.id);
      const newValue = { Files: fileIds };
      props.onChange(newValue);
    }
  }

  /**
   * Handler for 'upload' dialog.
   *
   * @param {Object} event - Click event
   */
  handleSelect(event) {
    event.preventDefault();
  }

  /**
   * Open new 'add from files' dialog
   *
   * @param {Object} event - Click event
   */
  handleAddShow(event) {
    event.preventDefault();
    this.setState({
      selecting: true,
      selectingItem: null,
    });
  }

  /**
   * Close 'add from files' dialog
   */
  handleAddHide() {
    this.setState({
      selecting: false,
      selectingItem: null,
    });
  }

  /**
   * Handle file being added by 'add from files' dialog
   *
   * @param {Object} data - Submitted insert form data
   * @param {Object} file - file record
   */
  handleAddInsert(data, file) {
    this.props.actions.uploadField.addFile(this.props.id, file);
    this.handleAddHide();

    return Promise.resolve({});
  }

  /**
   * Handle file being replaced from the modal
   *
   * @param {Object} data
   * @param {Object} file
   */
  handleReplace(data, file) {
    const { selectingItem } = this.state;
    const { id, actions: { uploadField: { addFile, removeFile } } } = this.props;
    if (!selectingItem) {
      throw new Error('Tried to replace a file when none was selected.');
    }
    removeFile(id, selectingItem);
    addFile(id, file);
    this.handleAddHide();

    return Promise.resolve({});
  }

  /**
   * Check if this field can be modified
   *
   * @return {Boolean}
   */
  canEdit() {
    return !this.props.disabled && !this.props.readOnly;
  }

  /**
   * Render "drop file here" area
   *
   * @returns {object}
   */
  renderDropzone() {
    const { AssetDropzone } = this.props;
    if (!this.props.data.createFileEndpoint) {
      return null;
    }
    const dimensions = {
      height: CONSTANTS.SMALL_THUMBNAIL_HEIGHT,
      width: CONSTANTS.SMALL_THUMBNAIL_WIDTH,
    };
    const maxFiles = this.props.data.multi ? this.props.data.maxFiles : 1;
    const filesCount = this.props.files.filter(file => !file.message || file.message.type !== 'error').length;
    const allowed = maxFiles > 0 ? Math.max(maxFiles - filesCount, 0) : null;
    const dropzoneOptions = {
      url: this.props.data.createFileEndpoint.url,
      method: this.props.data.createFileEndpoint.method,
      paramName: 'Upload',
      maxFiles: allowed,
      thumbnailWidth: CONSTANTS.SMALL_THUMBNAIL_WIDTH,
      thumbnailHeight: CONSTANTS.SMALL_THUMBNAIL_HEIGHT,
    };

    // Handle readonly field
    if (!this.canEdit()) {
      if (this.props.files.length) {
        return null;
      }
      return (
        <p>{i18n._t('AssetAdmin.EMPTY', 'No files')}</p>
      );
    }

    // If single upload and there is a file, don't render dropzone
    const classNames = ['uploadfield__dropzone'];
    if (allowed === 0) {
      classNames.push('uploadfield__dropzone--hidden');
    }

    const securityID = this.props.securityId;

    return (
      <AssetDropzone
        name={this.props.name}
        canUpload={this.canEdit()}
        uploadButton={false}
        uploadSelector=".uploadfield__upload-button, .uploadfield__backdrop"
        folderId={this.props.data.parentid}
        onAddedFile={this.handleAddedFile}
        onError={this.handleFailedUpload}
        onSuccess={this.handleSuccessfulUpload}
        onSending={this.handleSending}
        onUploadProgress={this.handleUploadProgress}
        preview={dimensions}
        options={dropzoneOptions}
        securityID={securityID}
        className={classNames.join(' ')}
      >
        <div className="uploadfield__backdrop" />
        <span className="uploadfield__droptext">
          <button type="button" onClick={this.handleSelect} className="uploadfield__upload-button">
            {i18n._t('AssetAdmin.BROWSE', 'Browse')}
          </button>
          {' '}
          {i18n._t('AssetAdmin.OR', 'or')}
          {' '}
          <button type="button" onClick={this.handleAddShow} className="uploadfield__add-button">
            {i18n._t('AssetAdmin.ADD_FILES', 'Add from files')}
          </button>
        </span>
      </AssetDropzone>
    );
  }

  renderDialog() {
    const { InsertMediaModal } = this.props;
    const { selecting, selectingItem } = this.state;

    return (
      <InsertMediaModal
        title={false}
        show={selecting}
        onInsert={selectingItem ? this.handleReplace : this.handleAddInsert}
        onHide={this.handleAddHide}
        type="select"
        bodyClassName="modal__dialog"
        className="insert-media-react__dialog-wrapper"
        fileAttributes={selectingItem ? { ID: selectingItem.id } : null}
        folderId={selectingItem && typeof item === 'object' ? selectingItem.parent.id : 0}
      />
    );
  }

  /**
   *
   * @param {object} item
   * @returns {object}
   */
  renderChild(item) {
    const { UploadFieldItem } = this.props;
    const itemProps = {
      // otherwise only one error file is shown and the rest are hidden due to having the same `key`
      key: item.id ? `file-${item.id}` : `queued-${item.queuedId}`,
      item,
      name: this.props.name,
      onRemove: this.handleItemRemove,
      canEdit: this.canEdit(),
      onView: this.handleReplaceShow,
    };
    return <UploadFieldItem {...itemProps} />;
  }

  render() {
    return (
      <div className="uploadfield">
        {this.renderDropzone()}
        {this.props.files.map(this.renderChild)}
        {this.renderDialog()}
      </div>
    );
  }
}

UploadField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.shape({ // PHP / posted value
    Files: PropTypes.arrayOf(PropTypes.number),
  }),
  files: PropTypes.arrayOf(fileShape), // Authoritative redux state
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  data: PropTypes.shape({
    createFileEndpoint: PropTypes.shape({
      url: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      payloadFormat: PropTypes.string.isRequired,
    }),
    multi: PropTypes.bool,
    parentid: PropTypes.number,
  }),
  UploadFieldItem: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  AssetDropzone: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  InsertMediaModal: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

UploadField.defaultProps = {
  value: { Files: [] },
  className: '',
};

function mapStateToProps(state, ownprops) {
  const id = ownprops.id;
  let files = [];
  if (state.assetAdmin
    && state.assetAdmin.uploadField
    && state.assetAdmin.uploadField.fields
    && state.assetAdmin.uploadField.fields[id]
  ) {
    files = state.assetAdmin.uploadField.fields[id].files || [];
  }
  const securityId = state.config.SecurityID;
  return { files, securityId };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      uploadField: bindActionCreators(uploadFieldActions, dispatch),
    },
  };
}

const ConnectedUploadField = connect(mapStateToProps, mapDispatchToProps)(UploadField);

export { UploadField as Component, ConnectedUploadField };

export default compose(
  inject(['UploadFieldItem', 'AssetDropzone', 'InsertMediaModal']),
  fieldHolder,
)(ConnectedUploadField);
